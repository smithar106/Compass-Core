// Stage: Four-Pass Intervention Ranking (Priority 3)
// Pass 1: Eligibility — is the problem + intervention valid enough to consider?
// Pass 2: Business leverage — cost, time, revenue, risk, customer/employee impact, strategic importance
// Pass 3: Readiness & feasibility — process stability, data readiness, owner, dependencies, effort, regulatory, change burden
// Pass 4: Portfolio priority — time to value, confidence, dependency order, reversibility, learning value, concentration risk, competing initiatives
//
// Fully deterministic. An LLM must not assign the final rank or selected
// intervention without this deterministic validation.

import type {
  BusinessProblem,
  RecommendedIntervention,
  RankedIntervention,
  DimensionResult,
  Tier,
  Recommendation,
  EvidenceRecord,
  InterventionPath,
  PipelineContext,
} from "../types/index.js";
import { PRIORITIZATION_VERSION } from "../types/index.js";
import type { InterventionOption } from "../types/index.js";

export interface RankInterventionsInput {
  problems: BusinessProblem[];
  interventions: RecommendedIntervention[];
  workflowSignals: any;
  evidence: EvidenceRecord[];
}

function dim(score: number, maxScore: number, passAt: number, condAt: number, details: string[]): DimensionResult {
  const label = score >= passAt ? "pass" : score >= condAt ? "conditional" : "fail";
  return { score, maxScore, label, details };
}

export async function rankInterventions(
  input: RankInterventionsInput,
  _context: PipelineContext,
): Promise<{ ranked: RankedIntervention[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const problemById = new Map(input.problems.map((p) => [p.id, p]));
  const out: RankedIntervention[] = [];

  for (const rec of input.interventions) {
    const problem = problemById.get(rec.problemId);
    if (!problem) continue;
    const selected = rec.comparedOptions.find((o) => o.path === rec.selectedPath);
    if (!selected) continue;

    // ── Pass 1: Eligibility ────────────────────────────────────────────────
    const p1Details: string[] = [];
    let p1 = 10;
    if (selected.eligibility !== "eligible") { p1 = 0; p1Details.push(`Selected path ${rec.selectedPath} is ineligible: ${selected.disqualifiers[0] ?? "no reason recorded"}`); }
    if (problem.evidenceIds.length < 1) { p1 = 0; p1Details.push("Problem has no supporting evidence"); }
    if (rec.comparedOptions.length < 3) { p1 = Math.min(p1, 4); p1Details.push("Fewer than 3 intervention paths were compared — comparison incomplete"); }
    if (rec.alternativeRejections.length < rec.comparedOptions.length - 1) { p1 = Math.min(p1, 5); p1Details.push("Not every rejected path has a recorded reason"); }
    if (rec.reasonsSelected.length === 0) { p1 = Math.min(p1, 5); p1Details.push("No selection rationale recorded"); }
    if (p1 === 10) p1Details.push("Problem and intervention are valid, evidenced, and fully compared");
    const eligibility = dim(p1, 10, 6, 3, p1Details);

    // ── Pass 2: Business leverage ──────────────────────────────────────────
    const p2Details: string[] = [];
    let p2 = 0;
    const imp = problem.currentImpact;
    if (imp.userHoursPerWeek >= 15) { p2 += 3; p2Details.push(`High weekly burden (${imp.userHoursPerWeek}h/week)`); }
    else if (imp.userHoursPerWeek >= 8) { p2 += 2; p2Details.push(`Moderate weekly burden (${imp.userHoursPerWeek}h/week)`); }
    else if (imp.userHoursPerWeek >= 3) { p2 += 1; p2Details.push(`Low weekly burden (${imp.userHoursPerWeek}h/week)`); }
    if (imp.revenueImpact && imp.revenueImpact >= 100000) { p2 += 3; p2Details.push(`Revenue-linked ($${Math.round(imp.revenueImpact / 1000)}k)`); }
    else if (imp.cost >= 40000) { p2 += 2; p2Details.push(`Material cost exposure ($${Math.round(imp.cost / 1000)}k)`); }
    else { p2 += 1; p2Details.push("Modest direct cost exposure"); }
    if (imp.customerImpactScore >= 7) { p2 += 2; p2Details.push("Strong customer-facing impact"); }
    else if (imp.customerImpactScore >= 4) { p2 += 1; p2Details.push("Some customer-facing impact"); }
    if (imp.strategicImportance === "high") { p2 += 2; p2Details.push("Strategically important"); }
    else if (imp.strategicImportance === "medium") { p2 += 1; p2Details.push("Moderately strategic"); }
    if (selected.operationalRisk <= 3) { p2 += 1; p2Details.push("Low operational risk"); }
    const businessLeverage = dim(Math.min(p2, 10), 10, 6, 3, p2Details);

    // ── Pass 3: Readiness and feasibility ──────────────────────────────────
    const p3Details: string[] = [];
    let p3 = 0;
    if (selected.dataReadiness >= 7) { p3 += 2; p3Details.push("Data readiness high"); }
    else if (selected.dataReadiness >= 5) { p3 += 1; p3Details.push("Data readiness moderate"); }
    else { p3Details.push("Data readiness low"); }
    if (selected.organizationalReadiness >= 7) { p3 += 2; p3Details.push("Clear ownership and organizational readiness"); }
    else if (selected.organizationalReadiness >= 4) { p3 += 1; p3Details.push("Partial organizational readiness"); }
    else { p3Details.push("Ownership unclear — readiness burden"); }
    if (selected.implementationComplexity <= 4) { p3 += 2; p3Details.push("Low implementation effort"); }
    else if (selected.implementationComplexity <= 6) { p3 += 1; p3Details.push("Moderate implementation effort"); }
    else { p3Details.push("Heavy implementation effort"); }
    const needsRegulatory = rec.escalationRequirements.some((e) => e.type === "security_or_legal_review");
    if (!needsRegulatory) { p3 += 2; p3Details.push("No regulatory gate"); }
    else { p3 += 1; p3Details.push("Regulatory/legal review required before rollout"); }
    if (selected.technicalRisk <= 3) { p3 += 2; p3Details.push("Low technical risk"); }
    else if (selected.technicalRisk <= 6) { p3 += 1; p3Details.push("Moderate technical risk"); }
    else { p3Details.push("High technical risk"); }
    if (rec.selectedPath === "process_redesign" || rec.selectedPath === "human_work") { p3 += 1; p3Details.push("Change-management burden is organizational, not technical"); }
    const readiness = dim(Math.min(p3, 10), 10, 6, 3, p3Details);

    // ── Pass 4: Portfolio priority ─────────────────────────────────────────
    const p4Details: string[] = [];
    let p4 = 0;
    const ttvWeeks = selected.estimatedTimeToValue.unit === "weeks"
      ? selected.estimatedTimeToValue.max
      : selected.estimatedTimeToValue.max * (selected.estimatedTimeToValue.unit === "months" ? 4 : 1 / 7);
    if (ttvWeeks <= 4) { p4 += 3; p4Details.push(`Fast time to value (≤${Math.round(ttvWeeks)} weeks)`); }
    else if (ttvWeeks <= 10) { p4 += 2; p4Details.push("Moderate time to value"); }
    else if (ttvWeeks > 0) { p4 += 1; p4Details.push("Slow time to value"); }
    if (rec.confidence >= 0.75) { p4 += 3; p4Details.push(`High confidence (${rec.confidence.toFixed(2)})`); }
    else if (rec.confidence >= 0.5) { p4 += 2; p4Details.push(`Moderate confidence (${rec.confidence.toFixed(2)})`); }
    else { p4 += 1; p4Details.push(`Low confidence (${rec.confidence.toFixed(2)})`); }
    if (selected.reversibility >= 8) { p4 += 2; p4Details.push("Highly reversible decision"); }
    else if (selected.reversibility >= 6) { p4 += 1; p4Details.push("Mostly reversible"); }
    if (rec.selectedPath === "process_redesign" || rec.selectedPath === "deterministic_software") { p4 += 1; p4Details.push("Builds organizational capability for later phases"); }
    const sameDeptCount = input.interventions.filter((r) => problemById.get(r.problemId)?.department === problem.department).length;
    if (sameDeptCount > 2) { p4 -= 1; p4Details.push(`Concentration risk: ${sameDeptCount} interventions in ${problem.department}`); }
    if (rec.selectedPath === "no_action_yet") { p4 = Math.min(p4, 3); p4Details.push("Deferred: priority capped until blockers resolve"); }
    const portfolioPriority = dim(Math.max(0, Math.min(p4, 10)), 10, 6, 3, p4Details);

    // ── Tier + recommendation (deterministic) ─────────────────────────────
    const total = eligibility.score + businessLeverage.score + readiness.score + portfolioPriority.score;
    let tier: Tier;
    let recommendation: Recommendation;
    // Deferred due to insufficient evidence → always defer with rationale
    if (rec.deferredDueToInsufficientEvidence) { tier = 3; recommendation = "defer"; }
    else if (eligibility.label === "fail") { tier = 4; recommendation = "do_not_pursue"; }
    else if (rec.selectedPath === "no_action_yet") { tier = 3; recommendation = "defer"; }
    else if (total >= 30 && businessLeverage.score >= 6) { tier = 1; recommendation = "build_now"; }
    else if (total >= 26) { tier = 2; recommendation = "validate_next"; }
    else if (total >= 14) { tier = 3; recommendation = "defer"; }
    else { tier = 4; recommendation = "do_not_pursue"; }

    const traceId = `trace-intervention-${rec.problemId}`;
    evidence.push({
      id: traceId,
      type: "deterministic_derivation",
      evidenceClass: "Deterministic",
      sourceLabel: `Four-pass ranking: ${problem.title}`,
      content: `eligibility=${eligibility.score}, leverage=${businessLeverage.score}, readiness=${readiness.score}, portfolio=${portfolioPriority.score} → tier ${tier}, ${recommendation} (path=${rec.selectedPath})`,
      confidence: 0.9,
      reliability: 0.95,
      metadata: { prioritizationVersion: PRIORITIZATION_VERSION },
    });

    out.push({
      ...rec,
      problem,
      tier,
      sequence: 0,
      recommendation,
      eligibility,
      businessLeverage,
      readiness,
      portfolioPriority,
      rankedScore: total,
      reasoningTraceId: traceId,
    });
  }

  out.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.rankedScore - a.rankedScore;
  });
  out.forEach((r, i) => { r.sequence = i + 1; });

  return { ranked: out, evidence };
}
