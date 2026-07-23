import type { OpportunityMap, OpportunityMapEntry, RankedOpportunity, RankedIntervention, EvidenceRecord, PipelineRunRecord, PipelineContext, EscalationLevel } from "../types/index.js";
import { INTERVENTION_ENGINE_VERSION, PRIORITIZATION_VERSION } from "../types/index.js";

interface GenerateExplanationsInput {
  companySummary: string;
  ranked: RankedOpportunity[];
  rankedInterventions?: RankedIntervention[];
  evidence: EvidenceRecord[];
  sessionId: string;
  pipelineVersion: string;
  stageDurations: Record<string, number>;
  runRecord: PipelineRunRecord;
}

const PATH_DISPLAY: Record<string, string> = {
  ai: "AI-assisted automation",
  deterministic_software: "Deterministic software",
  process_redesign: "Process redesign",
  human_work: "Deliberate human ownership",
  hybrid: "Hybrid (automation + human oversight)",
  no_action_yet: "No intervention yet",
};

export async function generateExplanations(input: GenerateExplanationsInput, _context: PipelineContext): Promise<{ opportunityMap: OpportunityMap; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];

  // Build deterministic explanation templates
  const opportunities = input.ranked.map((opp) => {
    const explanationEv: EvidenceRecord = {
      id: `explain-${opp.candidate.id}`,
      type: "deterministic_derivation",
      evidenceClass: "Deterministic",
      sourceLabel: `Explanation: ${opp.candidate.title}`,
      content: generateOpportunityExplanation(opp, input.companySummary),
      confidence: opp.confidence.score,
      reliability: 0.85,
    };
    evidence.push(explanationEv);
    return opp;
  });

  // Build executive summary
  const tier1Ops = opportunities.filter((o) => o.tier === 1);
  const tier2Ops = opportunities.filter((o) => o.tier === 2);
  const quickWins = opportunities.filter((o) => o.recommendation === "build_now");

  const executiveSummary = {
    headline: tier1Ops.length > 0
      ? `${tier1Ops[0].candidate.department}: ${tier1Ops[0].candidate.title}`
      : `Opportunity assessment complete`,
    finding: tier1Ops.length > 0
      ? `The strongest opportunity is in ${tier1Ops.map((o) => o.candidate.department).join(", ")}. ${tier1Ops[0].candidate.problemStatement}`
      : `No Tier-1 opportunities identified. Review assessment completeness.`,
    recommendedFocus: quickWins.length > 0
      ? `Start with "${quickWins[0].candidate.title}" — highest feasibility and business leverage`
      : `Review assessment responses for completeness before proceeding`,
    quickWins: quickWins.length,
    strategicValue: tier1Ops.length > 0 ? `Tier-1 opportunities address key operational friction points` : undefined,
  };

  // Build implementation sequencing
  const phases = buildImplementationPhases(opportunities, input.rankedInterventions ?? []);

  // Priority 8: intervention entries for the customer-facing map. Each entry
  // carries the full decision record: problem, paths compared, selection,
  // rejections, impact, effort, confidence, assumptions, metrics, owner,
  // escalation level, and blueprint availability.
  const interventionEntries: OpportunityMapEntry[] = (input.rankedInterventions ?? []).map((ri) => {
    const selected = ri.comparedOptions.find((o) => o.path === ri.selectedPath);
    const topEscalation: EscalationLevel = ri.escalationRequirements.some((e) => e.type === "security_or_legal_review")
      ? "security_or_legal_review"
      : ri.escalationRequirements[0]?.type ?? "business_configurable";
    return {
      problemId: ri.problemId,
      businessProblem: ri.problem,
      rootCause: ri.problem.description,
      currentImpact: ri.problem.currentImpact,
      evidenceIds: ri.problem.evidenceIds,
      possibleInterventionPaths: ri.comparedOptions.map((o) => o.path),
      selectedIntervention: ri.selectedPath,
      whySelected: ri.reasonsSelected,
      whyAlternativesRejected: ri.alternativeRejections,
      expectedImpact: selected?.expectedImpact ?? ri.problem.currentImpact,
      estimatedEffort: selected?.estimatedCost ?? { initial: 0, monthly: 0, yearly: 0, implementationComplexity: "low" },
      timeToValue: selected?.estimatedTimeToValue ?? { min: 0, max: 0, unit: "weeks" },
      confidence: ri.confidence,
      assumptions: selected?.assumptions ?? [],
      successMetrics: ri.successMetrics,
      requiredOwner: `${ri.problem.department} lead`,
      technicalEscalationLevel: topEscalation,
      implementationBlueprintAvailable: ri.tier <= 2 && ri.selectedPath !== "no_action_yet",
    };
  });

  const now = new Date().toISOString();
  const mapId = `map-${input.sessionId}-${Date.now()}`;

  const opportunityMap: OpportunityMap = {
    id: mapId,
    mapId,
    companyName: input.companySummary.split(".")[0] || "Organization",
    assessmentSessionId: input.sessionId,
    organizationId: undefined,
    generatedAt: now,
    createdAt: now,
    pipelineVersion: input.pipelineVersion,
    interventionEngineVersion: INTERVENTION_ENGINE_VERSION,
    prioritizationVersion: PRIORITIZATION_VERSION,
    evidenceModelVersion: "evidence_v1",
    problems: (input.rankedInterventions ?? []).map((r) => r.problem).filter(Boolean),
    prioritizedInterventions: input.rankedInterventions ?? [],
    executiveSummary,
    opportunities,
    interventionEntries,
    implementationSequencing: {
      strategy: quickWins.length > 0 ? "Quick Wins First" : "Foundational",
      strategyRationale: quickWins.length > 0
        ? `${quickWins.length} quick-win opportunities identified with high feasibility and business leverage. Start with these to build momentum.`
        : `No quick wins identified. Prioritize foundational improvements first.`,
      phases,
    },
    evidence,
    generationMetadata: {
      ...input.runRecord,
      interventionEngineVersion: INTERVENTION_ENGINE_VERSION,
      prioritizationVersion: PRIORITIZATION_VERSION,
      timestamps: {
        ...input.runRecord.timestamps,
        completedAt: new Date().toISOString(),
      },
      stageDurations: input.stageDurations,
    },
  };

  return { opportunityMap, evidence };
}

export function generateInterventionExplanation(ri: RankedIntervention): string {
  const parts: string[] = [];
  parts.push(`## ${ri.problem.title}`);
  parts.push(``);
  parts.push(`### Business Problem`);
  parts.push(ri.problem.description);
  parts.push(`Current impact: ~${ri.problem.currentImpact.userHoursPerWeek} hours/week of manual effort.`);
  parts.push(``);
  parts.push(`### Selected Intervention: ${PATH_DISPLAY[ri.selectedPath] ?? ri.selectedPath}`);
  for (const r of ri.reasonsSelected) parts.push(`- ${r}`);
  parts.push(``);
  parts.push(`### Why Alternatives Were Rejected`);
  for (const rej of ri.alternativeRejections) {
    parts.push(`- **${PATH_DISPLAY[rej.path] ?? rej.path}**: ${rej.reasons.join("; ")}`);
  }
  parts.push(``);
  parts.push(`### Confidence`);
  parts.push(`${(ri.confidence * 100).toFixed(0)}% — tier ${ri.tier}, ranked score ${ri.rankedScore}/40 (engine ${INTERVENTION_ENGINE_VERSION}, prioritization ${PRIORITIZATION_VERSION})`);
  parts.push(``);
  parts.push(`### Success Metrics`);
  for (const m of ri.successMetrics) parts.push(`- ${m.name}: target ${m.targetValue} ${m.unit} (${m.measurementFrequency})`);
  parts.push(``);
  parts.push(`### Escalation`);
  for (const e of ri.escalationRequirements) parts.push(`- ${e.type}: ${e.description}`);
  return parts.join("\n");
}

function generateOpportunityExplanation(opp: RankedOpportunity, companySummary: string): string {
  const parts: string[] = [];

  // 1. What we observed (Signal)
  parts.push(`## ${opp.candidate.title}`);
  parts.push(``);
  parts.push(`### What We Observed`);
  if (opp.candidate.detectedSignals.length > 0) {
    parts.push(`Assessment responses indicate ${opp.candidate.detectedSignals.join(", ")}.`);
  } else {
    parts.push(`Assessment responses indicate a potential opportunity in ${opp.candidate.department}.`);
  }
  parts.push(``);

  // 2. Which pattern matched
  parts.push(`### Pattern Analysis`);
  if (opp.candidate.blueprintId) {
    parts.push(`This matches established pattern ${opp.candidate.blueprintId}: ${opp.candidate.title}.`);
  } else {
    parts.push(`This is a composite opportunity generated from individual workflow signals.`);
  }
  parts.push(``);

  // 3. What we recommend
  parts.push(`### Recommendation`);
  parts.push(opp.candidate.problemStatement);
  parts.push(``);
  parts.push(`**Recommendation**: ${opp.recommendation === "build_now" ? "Build now" : opp.recommendation === "validate_next" ? "Validate next" : opp.recommendation === "defer" ? "Defer" : "Do not pursue"}`);
  parts.push(`**Tier**: ${opp.tier}${opp.tier === 1 ? " (Highest priority)" : opp.tier === 2 ? " (High priority)" : opp.tier === 3 ? " (Worth exploring)" : " (Monitor)"}`);
  parts.push(``);

  // 4. Evidence
  parts.push(`### Supporting Evidence`);
  parts.push(`- **Feasibility**: ${opp.feasibility.label.toUpperCase()} (${opp.feasibility.score}/${opp.feasibility.maxScore})`);
  for (const d of opp.feasibility.details) parts.push(`  - ${d}`);
  parts.push(`- **Business Leverage**: ${opp.businessLeverage.label.toUpperCase()} (${opp.businessLeverage.score}/${opp.businessLeverage.maxScore})`);
  for (const d of opp.businessLeverage.details) parts.push(`  - ${d}`);
  parts.push(`- **Implementation Readiness**: ${opp.implementationReadiness.label.toUpperCase()} (${opp.implementationReadiness.score}/${opp.implementationReadiness.maxScore})`);
  for (const d of opp.implementationReadiness.details) parts.push(`  - ${d}`);
  parts.push(`- **Strategic Alignment**: ${opp.strategicAlignment.label.toUpperCase()} (${opp.strategicAlignment.score}/${opp.strategicAlignment.maxScore})`);
  for (const d of opp.strategicAlignment.details) parts.push(`  - ${d}`);
  parts.push(``);

  // 5. Confidence
  parts.push(`### Confidence`);
  parts.push(`${opp.confidence.level} (${(opp.confidence.score * 100).toFixed(0)}%)`);
  parts.push(`Based on ${opp.evidenceIds.length} evidence sources.`);
  parts.push(``);

  // 6. Action
  parts.push(`### Recommended Action`);
  if (opp.recommendation === "build_now") {
    parts.push(`Begin with process discovery and stakeholder alignment. Expected timeline depends on ${opp.candidate.requiredCapabilities.join(" and ") || "team availability"}.`);
  } else if (opp.recommendation === "validate_next") {
    parts.push(`Conduct a deeper assessment of ${opp.candidate.department} workflows and quantify current costs before proceeding.`);
  } else if (opp.recommendation === "defer") {
    parts.push(`Revisit after addressing higher-priority opportunities or when more data is available.`);
  } else {
    parts.push(`Not recommended at this time due to feasibility or leverage concerns.`);
  }
  if (opp.candidate.risks.length > 0) {
    parts.push(``);
    parts.push(`**Risks**: ${opp.candidate.risks.join(", ")}`);
  }

  return parts.join("\n");
}

function buildImplementationPhases(opportunities: RankedOpportunity[], interventions: RankedIntervention[]) {
  const phases: OpportunityMap["implementationSequencing"]["phases"] = [];
  const now = opportunities.filter((o) => o.recommendation === "build_now");
  const next = opportunities.filter((o) => o.recommendation === "validate_next");
  const later = opportunities.filter((o) => o.recommendation === "defer");
  const nowI = interventions.filter((i) => i.recommendation === "build_now");
  const nextI = interventions.filter((i) => i.recommendation === "validate_next");
  const laterI = interventions.filter((i) => i.recommendation === "defer");

  if (now.length > 0 || nowI.length > 0) {
    phases.push({
      phase: 1,
      name: "Quick Wins",
      description: "High-feasibility interventions with immediate business leverage",
      opportunityIds: now.map((o) => o.candidate.id),
      interventionIds: nowI.map((i) => i.problemId),
      estimatedDuration: "4-8 weeks",
    });
  }
  if (next.length > 0 || nextI.length > 0) {
    phases.push({
      phase: 2,
      name: "Validation Phase",
      description: "Interventions requiring additional assessment before commitment",
      opportunityIds: next.map((o) => o.candidate.id),
      interventionIds: nextI.map((i) => i.problemId),
      estimatedDuration: "8-12 weeks",
    });
  }
  if (later.length > 0 || laterI.length > 0 || phases.length === 0) {
    phases.push({
      phase: phases.length + 1,
      name: "Long-term Opportunities",
      description: "Interventions to revisit as organizational maturity grows",
      opportunityIds: later.map((o) => o.candidate.id),
      interventionIds: laterI.map((i) => i.problemId),
      estimatedDuration: "3-6 months",
    });
  }

  return phases;
}
