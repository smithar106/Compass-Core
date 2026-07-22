import type { OpportunityCandidate, DimensionResult, Tier, Recommendation, RankedOpportunity, EvidenceRecord, PipelineContext } from "../types/index.js";

interface RankOpportunitiesInput {
  candidates: OpportunityCandidate[];
  answers: Array<{ questionId: number; value: string | number | boolean; type: string; wasSkipped: boolean }>;
  company: any;
  workflowSignals: any;
  evidence: EvidenceRecord[];
}

export async function rankOpportunities(input: RankOpportunitiesInput, _context: PipelineContext): Promise<{ ranked: RankedOpportunity[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));

  // Pass 1: Eligibility and Feasibility Filter
  const feasible: Array<{ candidate: OpportunityCandidate; feasibility: DimensionResult }> = [];

  for (const c of input.candidates) {
    const details: string[] = [];
    let pass = true;
    let conditional = false;

    // Data availability
    const hasData = c.evidenceIds.length >= 1;
    if (!hasData) { details.push("Insufficient evidence data"); pass = false; }

    // Workflow clarity
    const hasWorkflowClarity = c.targetWorkflow.length > 0;
    if (!hasWorkflowClarity) { details.push("Target workflow unclear"); pass = false; }

    // Integration feasibility
    const hasRequiredCaps = c.requiredCapabilities.length === 0 || c.requiredCapabilities.every((cap) => {
      if (cap.includes("CRM") && !answerMap.get(3)?.wasSkipped) return true;
      return true;
    });
    if (!hasRequiredCaps) { details.push("Missing required capabilities"); conditional = true; }

    // Regulatory suitability
    const isRegulated = input.workflowSignals.regulatoryBurden > 0.7;
    const isLegalCandidate = c.department === "Legal";
    if (isRegulated && isLegalCandidate) { details.push("Regulatory compliance required"); conditional = true; }

    // Appropriate use of AI
    const isAutomationBetter = c.detectedSignals.some((s) => s.includes("deterministic") || s.includes("formula"));
    if (isAutomationBetter) { details.push("Deterministic automation may be preferable to AI"); conditional = true; }

    // Minimum evidence
    if (c.evidenceIds.length < 1) { details.push("No supporting evidence"); pass = false; }

    const label = pass ? (conditional ? "conditional" : "pass") : "fail";
    feasible.push({
      candidate: c,
      feasibility: { score: pass ? (conditional ? 5 : 10) : 0, maxScore: 10, label: label as "pass" | "conditional" | "fail", details },
    });
  }

  // Failed candidates are retained so the map can show do-not-pursue items
  // explicitly; they are forced to Tier 4 below.
  const surviving = feasible;

  // Pass 2: Business Leverage Assessment
  function leverageLabel(score: number): "pass" | "conditional" | "fail" {
    return score >= 6 ? "pass" : score >= 3 ? "conditional" : "fail";
  }

  const withLeverage = surviving.map((f) => {
    const details: string[] = [];
    let score = 0;

    // Cost reduction
    if (f.candidate.detectedSignals.length >= 2) { score += 3; details.push("Multiple manual processes identified"); }
    else if (f.candidate.detectedSignals.length >= 1) { score += 1; details.push("Manual process identified"); }

    // Revenue impact
    const isRevenueRelated = f.candidate.department === "Sales" || f.candidate.department === "Marketing";
    if (isRevenueRelated) { score += 3; details.push("Revenue-facing department"); }

    // Cycle-time reduction
    if (f.candidate.detectedSignals.some((s) => s.includes("manual") || s.includes("slow") || s.includes("bottleneck"))) {
      score += 2; details.push("Cycle-time reduction opportunity");
    }

    // Customer impact
    const isCustomerFacing = ["Sales", "Customer Success", "Support"].includes(f.candidate.department);
    if (isCustomerFacing) { score += 2; details.push("Customer-facing impact"); }

    return { ...f, leverage: { score: Math.min(score, 10), maxScore: 10, label: leverageLabel(score), details } };
  });

  // Pass 3: Implementation Readiness
  function readinessLabel(score: number): "pass" | "conditional" | "fail" {
    return score >= 6 ? "pass" : score >= 3 ? "conditional" : "fail";
  }

  const withReadiness = withLeverage.map((f) => {
    const details: string[] = [];
    let score = 5;

    if (f.candidate.requiredCapabilities.length <= 2) { score += 2; details.push("Few integration requirements"); }
    else { score -= 1; details.push("Multiple integrations required"); }

    if (f.candidate.candidateSource === "blueprint") { score += 2; details.push("Proven blueprint pattern"); }
    else { score -= 1; details.push("Composite/custom pattern — higher risk"); }

    if (f.candidate.dependencies.length === 0) { score += 1; details.push("No external dependencies"); }
    else { details.push(`${f.candidate.dependencies.length} prerequisite(s) needed`); }

    const readiness = Math.min(score, 10);
    return { ...f, readiness: { score: readiness, maxScore: 10, label: readinessLabel(readiness), details } };
  });

  // Pass 4: Strategic Alignment and Portfolio Prioritization
  const ranked = withReadiness.map((f, i) => {
    const details: string[] = [];
    let alignmentScore = 5;

    const isStrategicPriority = f.candidate.detectedSignals.length >= 2;
    if (isStrategicPriority) { alignmentScore += 3; details.push("Addresses multiple detected signals"); }

    const isUrgent = input.workflowSignals.painPoints?.some(
      (p: any) => p.department === f.candidate.department && p.severity === "high"
    );
    if (isUrgent) { alignmentScore += 2; details.push("Addresses high-severity pain point"); }

    return { ...f, strategicAlignment: { score: Math.min(alignmentScore, 10), maxScore: 10, label: "pass" as const, details } };
  });

  // Compute tiers
  const withTiers = ranked.map((f) => {
    const fe = f.feasibility.score;
    const bl = f.leverage.score;
    const ir = f.readiness.score;
    const sa = f.strategicAlignment.score;

    let tier: Tier;
    let recommendation: Recommendation;

    const total = fe + bl + ir + sa;
    if (f.feasibility.label === "fail") { tier = 4; recommendation = "do_not_pursue"; }
    else if (total >= 30 && fe >= 7 && bl >= 6) { tier = 1; recommendation = "build_now"; }
    else if (total >= 26 && fe >= 5) { tier = 2; recommendation = "validate_next"; }
    else if (total >= 14) { tier = 3; recommendation = "defer"; }
    else { tier = 4; recommendation = "do_not_pursue"; }

    return { ...f, tier, recommendation };
  });

  // Sort by tier then by total score
  withTiers.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    const aTotal = a.feasibility.score + a.leverage.score + a.readiness.score + a.strategicAlignment.score;
    const bTotal = b.feasibility.score + b.leverage.score + b.readiness.score + b.strategicAlignment.score;
    return bTotal - aTotal;
  });

  // Deduplicate: keep highest-tier version of each department's opportunity
  const seenDepartments = new Set<string>();
  const deduped = withTiers.filter((f) => {
    if (seenDepartments.has(f.candidate.department)) return false;
    seenDepartments.add(f.candidate.department);
    return true;
  });

  // Build final ranked opportunities
  const rankedOpportunities: RankedOpportunity[] = deduped.map((f, i) => {
    const totalScore = f.feasibility.score + f.leverage.score + f.readiness.score + f.strategicAlignment.score;
    const confidence = Math.min(0.3 + (totalScore / 40) * 0.6, 0.95);

    return {
      candidate: f.candidate,
      tier: f.tier,
      sequence: i + 1,
      recommendation: f.recommendation,
      feasibility: f.feasibility,
      businessLeverage: f.leverage,
      implementationReadiness: f.readiness,
      strategicAlignment: f.strategicAlignment,
      confidence: {
        level: confidence >= 0.8 ? "High" : confidence >= 0.55 ? "Medium" : "Low",
        score: confidence,
        dimensions: {
          sourceAuthority: Math.min(f.candidate.evidenceIds.length * 0.15, 1),
          dataFreshness: 0.95,
          directness: f.candidate.candidateSource === "blueprint" ? 0.8 : 0.5,
          consistency: f.candidate.evidenceIds.length >= 2 ? 0.7 : 0.4,
          specificity: f.candidate.detectedSignals.length >= 2 ? 0.7 : 0.4,
        },
        reasoning: [
          `${f.candidate.evidenceIds.length} evidence sources`,
          f.candidate.candidateSource === "blueprint" ? "Pattern matched to validated blueprint" : "Composite candidate — lower confidence",
          `Feasibility: ${f.feasibility.label}`,
          `Business leverage: ${f.leverage.label}`,
        ],
      },
      evidenceIds: f.candidate.evidenceIds,
      dependencies: f.candidate.dependencies,
      disqualifiers: f.feasibility.label === "fail" ? ["Failed feasibility filter"] : [],
      reasoningTraceId: "",
    };
  });

  return { ranked: rankedOpportunities, evidence };
}
