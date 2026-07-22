import type { OpportunityMap, RankedOpportunity, EvidenceRecord, PipelineRunRecord, PipelineContext } from "../types/index.js";

interface GenerateExplanationsInput {
  companySummary: string;
  ranked: RankedOpportunity[];
  evidence: EvidenceRecord[];
  sessionId: string;
  pipelineVersion: string;
  stageDurations: Record<string, number>;
  runRecord: PipelineRunRecord;
}

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
  const phases = buildImplementationPhases(opportunities);

  const opportunityMap: OpportunityMap = {
    mapId: `map-${input.sessionId}-${Date.now()}`,
    companyName: input.companySummary.split(".")[0] || "Organization",
    assessmentSessionId: input.sessionId,
    generatedAt: new Date().toISOString(),
    pipelineVersion: input.pipelineVersion,
    executiveSummary,
    opportunities,
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
      timestamps: {
        ...input.runRecord.timestamps,
        completedAt: new Date().toISOString(),
      },
      stageDurations: input.stageDurations,
    },
  };

  return { opportunityMap, evidence };
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

function buildImplementationPhases(opportunities: RankedOpportunity[]) {
  const phases: OpportunityMap["implementationSequencing"]["phases"] = [];
  const now = opportunities.filter((o) => o.recommendation === "build_now");
  const next = opportunities.filter((o) => o.recommendation === "validate_next");
  const later = opportunities.filter((o) => o.recommendation === "defer");

  if (now.length > 0) {
    phases.push({
      phase: 1,
      name: "Quick Wins",
      description: "High-feasibility opportunities with immediate business leverage",
      opportunityIds: now.map((o) => o.candidate.id),
      estimatedDuration: "4-8 weeks",
    });
  }
  if (next.length > 0) {
    phases.push({
      phase: 2,
      name: "Validation Phase",
      description: "Opportunities requiring additional assessment before commitment",
      opportunityIds: next.map((o) => o.candidate.id),
      estimatedDuration: "8-12 weeks",
    });
  }
  if (later.length > 0 || phases.length === 0) {
    phases.push({
      phase: phases.length + 1,
      name: "Long-term Opportunities",
      description: "Opportunities to revisit as organizational maturity grows",
      opportunityIds: later.map((o) => o.candidate.id),
      estimatedDuration: "3-6 months",
    });
  }

  return phases;
}
