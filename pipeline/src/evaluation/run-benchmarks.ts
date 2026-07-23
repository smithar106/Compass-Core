// Evaluation harness — runs legacy opportunity benchmarks and intervention-path
// benchmarks (Priority 10). Measures AI overrecommendation rate, path accuracy,
// alternative comparison completeness, unsupported claim rate, explanation
// faithfulness, confidence calibration, ranking stability, and blueprint
// completeness. Exits with non-zero if regression thresholds are exceeded.

import { benchmarks } from "./benchmarks.js";
import { interventionFixtures, type InterventionFixture } from "./intervention-benchmarks.js";
import { interventionBlueprints, blueprintsForPath } from "../stages/intervention-blueprint-library.js";
import { INTERVENTION_ENGINE_VERSION, PRIORITIZATION_VERSION } from "../types/index.js";

const OPPORTUNITY_PASS_THRESHOLD = 0.7;

const ACCURACY_MIN = 0.8;
const AI_OVERRECOMMENDATION_MAX = 0.34;
const UNSUPPORTED_CLAIM_MAX = 0.0;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MOCK_CONTEXT = {
  sessionId: "eval",
  userId: "eval-user",
  organizationId: undefined,
  startedAt: new Date().toISOString(),
  requestId: "eval",
  supabase: null,
  log: () => {},
};

function mockSupabase() {
  return {
    from: () => ({
      select: () => ({
        "*": [],
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: { user_id: "eval-user" }, error: null }),
        single: () => Promise.resolve({ data: { user_id: "eval-user", metadata: {} }, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: "eval-map" }, error: null }) }) }),
      upsert: () => Promise.resolve({ error: null }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  };
}

// ─── Intervention evaluation ─────────────────────────────────────────────────

interface InterventionEvalResult {
  fixtureId: string;
  name: string;
  passed: boolean;
  failures: string[];
  selectedPath: string | null;
  expectedPath: string;
  confidence: number;
  optionCount: number;
  rejectionCount: number;
}

async function runInterventionBenchmarks(): Promise<{
  results: InterventionEvalResult[];
  totalAiSelections: number;
  totalSelections: number;
}> {
  const results: InterventionEvalResult[] = [];
  let totalAiSelections = 0;
  let totalSelections = 0;

  for (const fixture of interventionFixtures) {
    const failures: string[] = [];
    const answers = Object.entries(fixture.answers).map(([qId, value]) => ({
      questionId: parseInt(qId),
      value,
      type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "scale" : "text",
      wasSkipped: false,
    }));

    try {
      const { buildCompanyContext } = await import("../stages/02-build-company-context.js");
      const { normalizeWorkflowSignals } = await import("../stages/03-normalize-workflow.js");
      const { generateBusinessProblems, generateInterventionOptions, getTemplateCharacteristics } = await import("../stages/03-intervention-planning.js");
      const { rankInterventions } = await import("../stages/05-rank-interventions.js");

      const companyResult = await buildCompanyContext({ answers, evidence: [] }, MOCK_CONTEXT);
      const workflowResult = await normalizeWorkflowSignals({ answers, company: companyResult.company, evidence: companyResult.evidence }, MOCK_CONTEXT);
      const problemResult = await generateBusinessProblems({ answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: workflowResult.evidence }, MOCK_CONTEXT);
      // Run root cause analysis and evidence sufficiency first
      const { generateRootCauseHypotheses } = await import("../stages/03-root-cause-analysis.js");
      const { analyzeEvidenceSufficiency } = await import("../stages/04-evidence-analysis.js");

      const rootCauseResult = await generateRootCauseHypotheses({
        problems: problemResult.problems,
        answers,
        workflowSignals: workflowResult.signals,
        evidence: problemResult.evidence,
      }, MOCK_CONTEXT);
      const evidenceResult = await analyzeEvidenceSufficiency({
        problems: rootCauseResult.problems,
        answers,
        evidence: rootCauseResult.evidence,
      }, MOCK_CONTEXT);

      const interventionResult = await generateInterventionOptions({
        problems: rootCauseResult.problems,
        answers,
        workflowSignals: workflowResult.signals,
        evidence: evidenceResult.evidence,
        characteristics: getTemplateCharacteristics(),
        sufficiencies: evidenceResult.sufficiencies,
        followUpQuestions: evidenceResult.followUpQuestions,
        deferredProblems: evidenceResult.deferredProblems,
      }, MOCK_CONTEXT);
      const rankingResult = await rankInterventions({
        problems: problemResult.problems,
        interventions: interventionResult.interventions,
        workflowSignals: workflowResult.signals,
        evidence: interventionResult.evidence,
      }, MOCK_CONTEXT);

      const matched = rankingResult.ranked.find((r) => r.problemId === fixture.expected.problemId);
      if (!matched) {
        failures.push(`Problem "${fixture.expected.problemId}" not found in ranked interventions. Available: ${rankingResult.ranked.map((r) => r.problemId).join(", ")}`);
        results.push({ fixtureId: fixture.id, name: fixture.name, passed: false, failures, selectedPath: null, expectedPath: fixture.expected.expectedPath, confidence: 0, optionCount: 0, rejectionCount: 0 });
        continue;
      }

      const selectedPath = matched.selectedPath;
      const expectedPath = fixture.expected.expectedPath;
      const selected = matched.comparedOptions.find((o) => o.path === selectedPath);

      if (selectedPath !== expectedPath) {
        failures.push(`Expected path "${expectedPath}", got "${selectedPath}". Scores: ${matched.comparedOptions.map((o) => `${o.path}=${o.eligibility}`).join(", ")}`);
      }

      // New metric: AI overrecommendation (count total and AI selections)
      totalSelections++;
      if (selectedPath === "ai") totalAiSelections++;

      // Alternative comparison completeness: every compared option must have a rejection reason (for non-selected)
      const comparedCount = matched.comparedOptions.length;
      const rejectionCount = matched.alternativeRejections.length;
      const expectedRejections = comparedCount - 1;
      if (rejectionCount < expectedRejections) {
        failures.push(`Alternative comparison incomplete: ${rejectionCount}/${expectedRejections} alternatives have rejection reasons`);
      }

      // Unsupported claim rate: every selection reason must reference evidence (we check comparison-level evidence)
      if (matched.reasonsSelected.length === 0) {
        failures.push("No selection reasons provided");
      }
      if (matched.alternativeRejections.length > 0) {
        const missingEvidence = matched.alternativeRejections.some((r) => !r.evidenceIds || r.evidenceIds.length === 0);
        if (missingEvidence) failures.push("At least one alternative rejection lacks evidence IDs");
      }

      // Explanation faithfulness: selection reasons must be meaningful
      if (matched.reasonsSelected.some((r) => r.length < 10)) {
        failures.push("Selection reasons appear too short for meaningful explanation");
      }

      // Confidence calibration
      if (fixture.expected.confidenceMin !== undefined && matched.confidence < fixture.expected.confidenceMin) {
        failures.push(`Confidence ${matched.confidence.toFixed(2)} below min ${fixture.expected.confidenceMin}`);
      }
      if (fixture.expected.confidenceMax !== undefined && matched.confidence > fixture.expected.confidenceMax) {
        failures.push(`Confidence ${matched.confidence.toFixed(2)} above max ${fixture.expected.confidenceMax}`);
      }

      // Ranking stability: re-run and compare
      const rankingResult2 = await rankInterventions({
        problems: problemResult.problems,
        interventions: interventionResult.interventions,
        workflowSignals: workflowResult.signals,
        evidence: interventionResult.evidence,
      }, MOCK_CONTEXT);
      const matched2 = rankingResult2.ranked.find((r) => r.problemId === fixture.expected.problemId);
      if (JSON.stringify(matched) !== JSON.stringify(matched2)) {
        failures.push("Ranking not deterministic: re-run produced different results");
      }

      // Blueprint completeness: at least one blueprint supports the selected path
      const pathBlueprints = blueprintsForPath(selectedPath as any);
      if (pathBlueprints.length === 0) {
        failures.push(`No blueprints available for path "${selectedPath}" — blueprint library incomplete`);
      }

      const passed = failures.length === 0;
      results.push({
        fixtureId: fixture.id,
        name: fixture.name,
        passed,
        failures,
        selectedPath,
        expectedPath,
        confidence: matched.confidence,
        optionCount: comparedCount,
        rejectionCount,
      });

    } catch (err) {
      results.push({
        fixtureId: fixture.id,
        name: fixture.name,
        passed: false,
        failures: [`Pipeline error: ${err instanceof Error ? err.message : String(err)}`],
        selectedPath: null,
        expectedPath: fixture.expected.expectedPath,
        confidence: 0,
        optionCount: 0,
        rejectionCount: 0,
      });
    }
  }

  return { results, totalAiSelections, totalSelections };
}

// ─── Main runner ─────────────────────────────────────────────────────────────

async function runAll(): Promise<void> {
  console.log("COMPASS EVALUATION SUITE");
  console.log("=".repeat(80));
  console.log(`Intervention Engine: ${INTERVENTION_ENGINE_VERSION}`);
  console.log(`Prioritization: ${PRIORITIZATION_VERSION}`);
  console.log(`Blueprint library: ${interventionBlueprints.length} blueprints`);
  console.log("=".repeat(80));
  console.log();

  // 1. Legacy opportunity benchmarks ─────────────────────────────────────────
  console.log("Legacy Opportunity Benchmarks");
  console.log("-".repeat(60));

  let oppPassed = 0;
  let oppFailed = 0;

  for (const benchmark of benchmarks) {
    const answers = Object.entries(benchmark.answers).map(([qId, value]) => ({
      questionId: parseInt(qId),
      value,
      type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "scale" : "text",
      wasSkipped: false,
    }));

    const failures: string[] = [];

    try {
      const { buildCompanyContext } = await import("../stages/02-build-company-context.js");
      const { normalizeWorkflowSignals } = await import("../stages/03-normalize-workflow.js");
      const { generateOpportunityCandidates } = await import("../stages/04-generate-candidates.js");
      const { rankOpportunities } = await import("../stages/05-rank-opportunities.js");

      const companyResult = await buildCompanyContext({ answers, evidence: [] }, MOCK_CONTEXT);
      const workflowResult = await normalizeWorkflowSignals({ answers, company: companyResult.company, evidence: companyResult.evidence }, MOCK_CONTEXT);
      const candidateResult = await generateOpportunityCandidates({ answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: workflowResult.evidence }, MOCK_CONTEXT);
      const rankingResult = await rankOpportunities({ candidates: candidateResult.candidates, answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: candidateResult.evidence }, MOCK_CONTEXT);
      const rankingResult2 = await rankOpportunities({ candidates: candidateResult.candidates, answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: candidateResult.evidence }, MOCK_CONTEXT);

      const ranked = rankingResult.ranked;
      const tier1Ops = ranked.filter((o) => o.tier === 1);
      const confidenceScores = ranked.map((o) => o.confidence.score);

      if (benchmark.expected.minTier1Count !== undefined && tier1Ops.length < benchmark.expected.minTier1Count) {
        failures.push(`Expected ≥ ${benchmark.expected.minTier1Count} Tier 1, got ${tier1Ops.length}`);
      }
      if (benchmark.expected.maxTier1Count !== undefined && tier1Ops.length > benchmark.expected.maxTier1Count) {
        failures.push(`Expected ≤ ${benchmark.expected.maxTier1Count} Tier 1, got ${tier1Ops.length}`);
      }
      if (benchmark.expected.topTierDepartment && tier1Ops[0]?.candidate.department !== benchmark.expected.topTierDepartment) {
        failures.push(`Expected top department ${benchmark.expected.topTierDepartment}, got ${tier1Ops[0]?.candidate.department}`);
      }
      if (benchmark.expected.confidenceMin !== undefined) {
        const minC = Math.min(...confidenceScores);
        if (minC < benchmark.expected.confidenceMin) failures.push(`Min confidence ${minC.toFixed(2)} < ${benchmark.expected.confidenceMin}`);
      }
      if (benchmark.expected.confidenceMax !== undefined) {
        const maxC = Math.max(...confidenceScores);
        if (maxC > benchmark.expected.confidenceMax) failures.push(`Max confidence ${maxC.toFixed(2)} > ${benchmark.expected.confidenceMax}`);
      }

      // Determinism check
      const r1 = JSON.stringify(rankingResult.ranked.map((o) => ({ id: o.candidate.id, tier: o.tier })));
      const r2 = JSON.stringify(rankingResult2.ranked.map((o) => ({ id: o.candidate.id, tier: o.tier })));
      if (r1 !== r2) failures.push("Determinism check failed");

    } catch (err) {
      failures.push(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    const passed = failures.length === 0;
    if (passed) oppPassed++; else oppFailed++;
    console.log(`${passed ? "✓" : "✗"} ${benchmark.name} (${benchmark.id})`);
    for (const f of failures) console.log(`     ⚠ ${f}`);
  }

  // 2. Intervention benchmarks ──────────────────────────────────────────────
  console.log();
  console.log("Intervention-Path Benchmarks (Priority 10)");
  console.log("-".repeat(60));

  const { results: interventionResults, totalAiSelections, totalSelections } = await runInterventionBenchmarks();

  let intPassed = 0;
  let intFailed = 0;
  let totalAICount = 0;
  let totalSelectCount = 0;
  let totalRejections = 0;
  let totalCloseCheckRejections = 0;
  let totalUnsupportedClaims = 0;
  let faithfulnessCount = 0;
  let calibrationCount = 0;
  let stabilityPassCount = 0;
  let blueprintPassCount = 0;

  for (const r of interventionResults) {
    if (r.passed) intPassed++; else intFailed++;
    if (r.selectedPath === "ai") totalAICount++;
    totalSelectCount++;
    totalRejections += r.rejectionCount;
    totalCloseCheckRejections += r.optionCount - 1;
    if (r.failures.some((f) => f.includes("evidence"))) totalUnsupportedClaims++;
    if (!r.failures.some((f) => f.includes("explanation"))) faithfulnessCount++;
    if (!r.failures.some((f) => f.includes("Confidence"))) calibrationCount++;
    if (!r.failures.some((f) => f.includes("deterministic"))) stabilityPassCount++;
    if (!r.failures.some((f) => f.includes("blueprint"))) blueprintPassCount++;

    console.log(`${r.passed ? "✓" : "✗"} ${r.name} (${r.fixtureId})`);
    if (!r.passed) for (const f of r.failures) console.log(`     ⚠ ${f}`);
    console.log(`     Selected: ${r.selectedPath ?? "none"} (expected ${r.expectedPath}) | confidence: ${r.confidence.toFixed(2)} | options: ${r.optionCount}`);
  }

  // 3. Metrics ──────────────────────────────────────────────────────────────
  const interventionPathAccuracy = intPassed / interventionResults.length;
  const aiOverrecommendationRate = totalSelectCount > 0 ? totalAICount / totalSelectCount : 0;
  const alternativeComparisonCompleteness = totalCloseCheckRejections > 0 ? totalRejections / totalCloseCheckRejections : 1;
  const unsupportedClaimRate = interventionResults.length > 0 ? totalUnsupportedClaims / interventionResults.length : 0;
  const explanationFaithfulness = interventionResults.length > 0 ? faithfulnessCount / interventionResults.length : 1;
  const confidenceCalibration = interventionResults.length > 0 ? calibrationCount / interventionResults.length : 1;
  const rankingStability = interventionResults.length > 0 ? stabilityPassCount / interventionResults.length : 1;
  const blueprintCompleteness = interventionResults.length > 0 ? blueprintPassCount / interventionResults.length : 1;

  // 4. Report ───────────────────────────────────────────────────────────────
  console.log();
  console.log("=".repeat(80));
  console.log("INTERVENTION ENGINE METRICS (Priority 10)");
  console.log("=".repeat(80));
  console.log();
  console.log(`  Intervention-path accuracy:                ${(interventionPathAccuracy * 100).toFixed(1)}%  (threshold ≥ ${(ACCURACY_MIN * 100).toFixed(0)}%)`);
  console.log(`  AI overrecommendation rate:               ${(aiOverrecommendationRate * 100).toFixed(1)}%  (threshold ≤ ${(AI_OVERRECOMMENDATION_MAX * 100).toFixed(0)}%)`);
  console.log(`  Alternative comparison completeness:      ${(alternativeComparisonCompleteness * 100).toFixed(1)}%`);
  console.log(`  Unsupported claim rate:                   ${(unsupportedClaimRate * 100).toFixed(1)}%  (threshold ≤ ${(UNSUPPORTED_CLAIM_MAX * 100).toFixed(0)}%)`);
  console.log(`  Explanation faithfulness:                 ${(explanationFaithfulness * 100).toFixed(1)}%`);
  console.log(`  Confidence calibration:                   ${(confidenceCalibration * 100).toFixed(1)}%`);
  console.log(`  Ranking stability (deterministic):        ${(rankingStability * 100).toFixed(1)}%`);
  console.log(`  Blueprint completeness:                   ${(blueprintCompleteness * 100).toFixed(1)}%`);
  console.log();

  // 5. Summary ──────────────────────────────────────────────────────────────
  const oppRate = oppPassed / (oppPassed + oppFailed);
  const passRate = (oppPassed + intPassed) / (oppPassed + oppFailed + intPassed + intFailed);

  console.log("=".repeat(80));
  console.log("OVERALL SUMMARY");
  console.log("=".repeat(80));
  console.log(`  Legacy benchmarks:   ${oppPassed}/${oppPassed + oppFailed} passed (${(oppRate * 100).toFixed(1)}%)`);
  console.log(`  Intervention benchmarks: ${intPassed}/${intPassed + intFailed} passed (${(intPassed / (intPassed + intFailed) * 100).toFixed(1)}%)`);
  console.log(`  Overall:              ${passRate >= OPPORTUNITY_PASS_THRESHOLD ? "✓ PASS" : "✗ FAIL"} (${(passRate * 100).toFixed(1)}%)`);
  console.log();

  const regressions: string[] = [];
  if (aiOverrecommendationRate > AI_OVERRECOMMENDATION_MAX) regressions.push(`AI overrecommendation rate ${(aiOverrecommendationRate * 100).toFixed(1)}% exceeds max ${(AI_OVERRECOMMENDATION_MAX * 100).toFixed(0)}%`);
  if (interventionPathAccuracy < ACCURACY_MIN) regressions.push(`Intervention-path accuracy ${(interventionPathAccuracy * 100).toFixed(1)}% below min ${(ACCURACY_MIN * 100).toFixed(0)}%`);
  if (unsupportedClaimRate > UNSUPPORTED_CLAIM_MAX) regressions.push(`Unsupported claim rate ${(unsupportedClaimRate * 100).toFixed(1)}% above max ${(UNSUPPORTED_CLAIM_MAX * 100).toFixed(0)}%`);

  if (regressions.length > 0) {
    console.log("REGRESSIONS:");
    for (const r of regressions) console.log(`  ✗ ${r}`);
    console.log();
    console.error(`Evaluation failed — ${regressions.length} regression(s) detected.`);
    process.exit(1);
  }

  console.log("All checks passed. No regressions.");
  process.exit(0);
}

runAll().catch((err) => {
  console.error("Evaluation failed:", err);
  process.exit(1);
});
