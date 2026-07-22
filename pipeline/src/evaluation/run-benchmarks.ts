import { runAssessment } from "../index.js";
import { loadBlueprintLibrary } from "../stages/blueprint-library.js";
import { benchmarks } from "./benchmarks.js";

const PASS_THRESHOLD = 0.7;

interface EvalResult {
  benchmarkId: string;
  name: string;
  passed: boolean;
  failures: string[];
  details: {
    tier1Count: number;
    topDepartment: string | null;
    recommendationCount: number;
    evidenceCount: number;
    confidenceScores: number[];
  };
}

async function runBenchmarks(): Promise<void> {
  console.log("Running Compass benchmark evaluation...\n");

  const results: EvalResult[] = [];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const benchmark of benchmarks) {
    const failures: string[] = [];

    // Create answers in the format the pipeline expects
    const answers = Object.entries(benchmark.answers).map(([qId, value]) => ({
      questionId: parseInt(qId),
      questionVersion: "1.0",
      value,
      type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "scale" : "text",
      order: parseInt(qId),
      wasSkipped: value === "",
      timeSpent: 5,
      metadata: {},
    }));

    // Mock a session and run pipeline stages
    const mockSupabase = {
      from: () => ({
        select: () => ({
          "*": answers,
          order: () => Promise.resolve({ data: answers, error: null }),
          eq: () => Promise.resolve({ data: { user_id: "eval-user" }, error: null }),
          single: () => Promise.resolve({ data: { user_id: "eval-user", metadata: {} }, error: null }),
        }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: "eval-map" }, error: null }) }) }),
        upsert: () => Promise.resolve({ error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      }),
    };

    // Run pipeline stages directly (without external deps)
    try {
      const { buildCompanyContext } = await import("../stages/02-build-company-context.js");
      const { normalizeWorkflowSignals } = await import("../stages/03-normalize-workflow.js");
      const { generateOpportunityCandidates } = await import("../stages/04-generate-candidates.js");
      const { rankOpportunities } = await import("../stages/05-rank-opportunities.js");

      const mockContext = {
        sessionId: "eval",
        userId: "eval-user",
        startedAt: new Date().toISOString(),
        requestId: "eval",
        supabase: mockSupabase,
        log: () => {},
      };

      const companyResult = await buildCompanyContext({ answers, evidence: [] }, mockContext);
      const workflowResult = await normalizeWorkflowSignals({ answers, company: companyResult.company, evidence: companyResult.evidence }, mockContext);
      const candidateResult = await generateOpportunityCandidates({ answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: workflowResult.evidence }, mockContext);
      const rankingResult = await rankOpportunities({ candidates: candidateResult.candidates, answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: candidateResult.evidence }, mockContext);

      const ranked = rankingResult.ranked;
      const tier1Ops = ranked.filter((o) => o.tier === 1);
      const evidenceCount = rankingResult.evidence.length;
      const topDept = tier1Ops.length > 0 ? tier1Ops[0].candidate.department : null;
      const confidenceScores = ranked.map((o) => o.confidence.score);

      // Check expectations
      if (benchmark.expected.minTier1Count !== undefined) {
        if (tier1Ops.length < benchmark.expected.minTier1Count) {
          failures.push(`Expected >= ${benchmark.expected.minTier1Count} Tier 1 opportunities, got ${tier1Ops.length}`);
        }
      }

      if (benchmark.expected.maxTier1Count !== undefined) {
        if (tier1Ops.length > benchmark.expected.maxTier1Count) {
          failures.push(`Expected <= ${benchmark.expected.maxTier1Count} Tier 1 opportunities, got ${tier1Ops.length}`);
        }
      }

      if (benchmark.expected.topTierDepartment && topDept) {
        // Soft check — just note if different
        if (topDept !== benchmark.expected.topTierDepartment) {
          failures.push(`Expected top department ${benchmark.expected.topTierDepartment}, got ${topDept}`);
        }
      }

      if (benchmark.expected.confidenceMin !== undefined) {
        const minConf = Math.min(...confidenceScores);
        if (minConf < benchmark.expected.confidenceMin) {
          failures.push(`Min confidence ${minConf.toFixed(2)} < threshold ${benchmark.expected.confidenceMin}`);
        }
      }

      if (benchmark.expected.confidenceMax !== undefined) {
        const maxConf = Math.max(...confidenceScores);
        if (maxConf > benchmark.expected.confidenceMax) {
          failures.push(`Max confidence ${maxConf.toFixed(2)} > threshold ${benchmark.expected.confidenceMax}`);
        }
      }

      // Schema validity: every ranked opportunity must have required fields
      for (const opp of ranked) {
        if (!opp.candidate.id) failures.push("Missing candidate ID");
        if (!opp.candidate.title) failures.push("Missing candidate title");
        if (!opp.candidate.department) failures.push("Missing candidate department");
        if (!opp.candidate.problemStatement) failures.push("Missing problem statement");
        if (opp.tier < 1 || opp.tier > 4) failures.push(`Invalid tier: ${opp.tier}`);
        if (!opp.evidenceIds || opp.evidenceIds.length < 1) failures.push(`No evidence for ${opp.candidate.id}`);
      }

      // Deterministic consistency: run twice, expect same results
      const rankingResult2 = await rankOpportunities({ candidates: candidateResult.candidates, answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: candidateResult.evidence }, mockContext);
      const ranked2 = rankingResult2.ranked;

      for (let i = 0; i < Math.min(ranked.length, ranked2.length); i++) {
        if (ranked[i].candidate.id !== ranked2[i].candidate.id) {
          failures.push(`Determinism check failed: run 1 has ${ranked[i].candidate.id} at position ${i}, run 2 has ${ranked2[i].candidate.id}`);
          break;
        }
      }

      const passed = failures.length === 0;
      if (passed) totalPassed++;
      else totalFailed++;

      results.push({
        benchmarkId: benchmark.id,
        name: benchmark.name,
        passed,
        failures,
        details: {
          tier1Count: tier1Ops.length,
          topDepartment: topDept,
          recommendationCount: ranked.length,
          evidenceCount,
          confidenceScores,
        },
      });

    } catch (err) {
      totalFailed++;
      results.push({
        benchmarkId: benchmark.id,
        name: benchmark.name,
        passed: false,
        failures: [`Pipeline error: ${err instanceof Error ? err.message : String(err)}`],
        details: { tier1Count: 0, topDepartment: null, recommendationCount: 0, evidenceCount: 0, confidenceScores: [] },
      });
    }
  }

  // Print results
  console.log("=".repeat(80));
  console.log("COMPASS BENCHMARK EVALUATION RESULTS");
  console.log("=".repeat(80));
  console.log();

  for (const r of results) {
    const status = r.passed ? "✓ PASS" : "✗ FAIL";
    console.log(`${status} | ${r.name}`);
    console.log(`     Tier 1: ${r.details.tier1Count} | Recommendations: ${r.details.recommendationCount} | Evidence: ${r.details.evidenceCount}`);
    console.log(`     Confidence: ${r.details.confidenceScores.map((s) => s.toFixed(2)).join(", ")}`);
    if (r.failures.length > 0) {
      for (const f of r.failures) {
        console.log(`     ⚠  ${f}`);
      }
    }
    console.log();
  }

  const passRate = totalPassed / (totalPassed + totalFailed);
  const threshold = PASS_THRESHOLD;

  console.log("=".repeat(80));
  console.log(`Passed: ${totalPassed}/${totalPassed + totalFailed} (${(passRate * 100).toFixed(1)}%)`);
  console.log(`Threshold: ${(threshold * 100).toFixed(0)}%`);
  console.log(`Overall: ${passRate >= threshold ? "✓ PASS" : "✗ FAIL"}`);
  console.log("=".repeat(80));

  // Exit with error if below threshold
  if (passRate < threshold) {
    console.error(`\nEvaluation failed: pass rate ${(passRate * 100).toFixed(1)}% < ${(threshold * 100).toFixed(0)}%threshold`);
    process.exit(1);
  }

  // Exit normally
  process.exit(0);
}

runBenchmarks().catch((err) => {
  console.error("Evaluation failed:", err);
  process.exit(1);
});
