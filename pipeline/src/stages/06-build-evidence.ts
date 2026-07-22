import type { EvidenceRecord, RankedOpportunity, OpportunityConfidence, PipelineContext } from "../types/index.js";

interface BuildEvidenceTracesInput {
  ranked: RankedOpportunity[];
  evidence: EvidenceRecord[];
}

export async function buildEvidenceTraces(input: BuildEvidenceTracesInput, _context: PipelineContext): Promise<{ opportunities: RankedOpportunity[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const opportunities = input.ranked.map((opp) => {
    const traceId = `trace-${opp.candidate.id}`;

    // Build evidence trace lines for explainability
    const traceEvidence: EvidenceRecord = {
      id: traceId,
      type: "deterministic_derivation",
      evidenceClass: "Deterministic",
      sourceLabel: `Reasoning trace: ${opp.candidate.title}`,
      content: [
        `**Signal detection**: ${opp.candidate.detectedSignals.join("; ") || "No specific signals detected"}`,
        `**Blueprint match**: ${opp.candidate.blueprintId || "Composite/custom"}`,
        `**Feasibility**: ${opp.feasibility.label.toUpperCase()} (${opp.feasibility.score}/${opp.feasibility.maxScore})`,
        opp.feasibility.details.map((d) => `  - ${d}`).join("\n"),
        `**Business leverage**: ${opp.businessLeverage.label.toUpperCase()} (${opp.businessLeverage.score}/${opp.businessLeverage.maxScore})`,
        opp.businessLeverage.details.map((d) => `  - ${d}`).join("\n"),
        `**Implementation readiness**: ${opp.implementationReadiness.label.toUpperCase()} (${opp.implementationReadiness.score}/${opp.implementationReadiness.maxScore})`,
        opp.implementationReadiness.details.map((d) => `  - ${d}`).join("\n"),
        `**Strategic alignment**: ${opp.strategicAlignment.label.toUpperCase()} (${opp.strategicAlignment.score}/${opp.strategicAlignment.maxScore})`,
        opp.strategicAlignment.details.map((d) => `  - ${d}`).join("\n"),
        `**Final tier**: ${opp.tier} (${opp.recommendation})`,
        `**Evidence sources**: ${opp.evidenceIds.length}`,
      ].join("\n"),
      confidence: opp.confidence.score,
      reliability: 0.9,
    };
    evidence.push(traceEvidence);

    return {
      ...opp,
      reasoningTraceId: traceId,
    };
  });

  return { opportunities, evidence };
}
