import type { OpportunityCandidate, EvidenceRecord, Department, PipelineContext } from "../types/index.js";
import { loadBlueprintLibrary } from "./blueprint-library.js";

interface GenerateCandidatesInput {
  answers: Array<{ questionId: number; value: string | number | boolean; type: string; wasSkipped: boolean }>;
  company: any;
  workflowSignals: any;
  evidence: EvidenceRecord[];
}

export async function generateOpportunityCandidates(input: GenerateCandidatesInput, _context: PipelineContext): Promise<{ candidates: OpportunityCandidate[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));
  const blueprints = loadBlueprintLibrary();
  const candidates: OpportunityCandidate[] = [];

  const activeDepartments: Department[] = input.workflowSignals.departments || [];

  // Signal values for matching
  const hasSalesProcess = answerMap.get(1)?.value === true;
  const hasLeadScoring = answerMap.get(4)?.value === true;
  const hasHealthScoring = answerMap.get(7)?.value === true;
  const hasKnowledgeBase = answerMap.get(11)?.value === true;
  const hasCI = answerMap.get(17)?.value === true;
  const hasContractReview = answerMap.get(22)?.value === true;
  const hasAutomatedExpenses = answerMap.get(13)?.value === true;
  const hasProductAnalytics = answerMap.get(15)?.value === true;
  const hasHRIS = answerMap.get(20)?.value === true;

  for (const bp of blueprints) {
    if (!activeDepartments.includes(bp.department)) continue;

    let matchScore = 0;
    const matchedSignals: string[] = [];

    if (bp.id === "BP-SALES-01" && !hasSalesProcess) { matchScore += 0.3; matchedSignals.push("No sales qualification process"); }
    if (bp.id === "BP-SALES-02" && !hasSalesProcess) { matchScore += 0.15; matchedSignals.push("Sales process gap affects forecasting"); }
    if (bp.id === "BP-MKTG-01" && !hasLeadScoring) { matchScore += 0.3; matchedSignals.push("No lead scoring"); }
    if (bp.id === "BP-CS-01" && !hasHealthScoring) { matchScore += 0.3; matchedSignals.push("No health scoring"); }
    if (bp.id === "BP-CS-02" && !hasHealthScoring) { matchScore += 0.1; matchedSignals.push("Onboarding likely manual"); }
    if (bp.id === "BP-SUPP-01" && (!hasKnowledgeBase || parseInt(String(answerMap.get(10)?.value ?? "0").charAt(0)) <= 25)) { matchScore += 0.3; matchedSignals.push("Low support automation"); }
    if (bp.id === "BP-SUPP-02" && !hasKnowledgeBase) { matchScore += 0.2; matchedSignals.push("Manual ticket routing"); }
    if (bp.id === "BP-FIN-01" && !hasAutomatedExpenses) { matchScore += 0.2; matchedSignals.push("Manual financial processes"); }
    if (bp.id === "BP-FIN-02" && !hasAutomatedExpenses) { matchScore += 0.25; matchedSignals.push("No expense automation"); }
    if (bp.id === "BP-ENGR-01" && !hasCI) { matchScore += 0.15; matchedSignals.push("Low engineering automation"); }
    if (bp.id === "BP-LEGAL-01" && !hasContractReview) { matchScore += 0.3; matchedSignals.push("Manual contract review"); }
    if (bp.id === "BP-PROD-01" && !hasProductAnalytics) { matchScore += 0.25; matchedSignals.push("No product analytics"); }
    if (bp.id === "BP-HR-01" && !hasHRIS) { matchScore += 0.15; matchedSignals.push("No HRIS"); }

    // Department presence
    if (matchedSignals.length > 0) matchScore += 0.15;

    // Prerequisites check
    const hasPrereqs = bp.prerequisites.every((p) => {
      if (p.includes("CRM")) return answerMap.get(3)?.wasSkipped === false || !answerMap.has(3);
      if (p.includes("Analytics") || p.includes("analytics")) return hasProductAnalytics || true;
      return true;
    });

    if (matchScore >= 0.3 && hasPrereqs) {
      const ev: EvidenceRecord = {
        id: `candidate-${bp.id}`,
        type: "deterministic_derivation",
        evidenceClass: "Deterministic",
        sourceLabel: `Blueprint match: ${bp.name}`,
        content: `Matched ${bp.department} blueprint with score ${matchScore.toFixed(2)}: ${matchedSignals.join(", ")}`,
        confidence: Math.min(matchScore + 0.3, 0.95),
        reliability: 0.8,
      };
      evidence.push(ev);

      candidates.push({
        id: `cand-${bp.id.toLowerCase()}`,
        blueprintId: bp.id,
        title: bp.name,
        problemStatement: bp.description,
        targetWorkflow: matchedSignals.join("; "),
        department: bp.department,
        businessObjective: `Reduce ${bp.department.toLowerCase()} operational friction`,
        proposedSystemType: bp.aiComponents[0] || "AI Assistant",
        detectedSignals: matchedSignals,
        requiredCapabilities: bp.requiredCapabilities,
        dependencies: bp.prerequisites,
        risks: [],
        evidenceIds: [ev.id, ...input.evidence.map((e) => e.id)],
        candidateSource: "blueprint",
      });
    }
  }

  // If no blueprints matched sufficiently, create composite
  if (candidates.length === 0) {
    const painPoints = input.workflowSignals.painPoints || [];
    for (const pain of painPoints.slice(0, 3)) {
      const ev: EvidenceRecord = {
        id: `cand-comp-${pain.department.toLowerCase().replace(/\s+/g, "-")}`,
        type: "deterministic_derivation",
        evidenceClass: "Deterministic",
        sourceLabel: `Composite candidate: ${pain.department}`,
        content: `Created composite from pain signal: ${pain.pain}`,
        confidence: 0.5,
        reliability: 0.6,
      };
      evidence.push(ev);
      candidates.push({
        id: `cand-comp-${pain.department.toLowerCase().replace(/\s+/g, "-")}`,
        title: `Address ${pain.department} workflow friction`,
        problemStatement: pain.pain,
        targetWorkflow: pain.department,
        department: pain.department,
        businessObjective: `Reduce ${pain.department.toLowerCase()} operational friction`,
        proposedSystemType: "Process Automation",
        detectedSignals: [pain.pain],
        requiredCapabilities: [],
        dependencies: [],
        risks: ["Composite candidate — validate specifics with department"],
        evidenceIds: [ev.id],
        candidateSource: "composite",
      });
    }
  }

  // Additional candidates from specific pain signals for departments that matched
  const deptPainMap: Record<string, { blueprintId: string; title: string; signal: string }[]> = {
    "Customer Success": [
      { blueprintId: "BP-CS-01", title: "Proactive Customer Health Scoring", signal: "health_scoring" },
    ],
    "Support": [
      { blueprintId: "BP-SUPP-01", title: "Self-Service Support Resolution", signal: "ticket_routing" },
      { blueprintId: "BP-SUPP-02", title: "Smart Ticket Triage & Routing", signal: "ticket_routing" },
    ],
    "Sales": [
      { blueprintId: "BP-SALES-01", title: "Automated Lead Qualification", signal: "lead_qualification" },
    ],
  };

  for (const pain of input.workflowSignals.painPoints || []) {
    const extras = deptPainMap[pain.department] || [];
    for (const extra of extras) {
      if (!candidates.find((c) => c.blueprintId === extra.blueprintId)) {
        const bp = blueprints.find((b) => b.id === extra.blueprintId);
        if (bp) {
          const ev: EvidenceRecord = {
            id: `cand-extra-${extra.blueprintId.toLowerCase()}`,
            type: "workflow_signal",
            evidenceClass: "Deterministic",
            sourceLabel: `Pain-driven: ${bp.name}`,
            content: `Generated from ${pain.department} pain signal: ${pain.pain}`,
            confidence: 0.7,
            reliability: 0.75,
          };
          evidence.push(ev);
          candidates.push({
            id: `cand-${extra.blueprintId.toLowerCase()}`,
            blueprintId: extra.blueprintId,
            title: extra.title,
            problemStatement: bp.description,
            targetWorkflow: pain.department,
            department: pain.department as Department,
            businessObjective: `Address ${pain.department.toLowerCase()} operational friction`,
            proposedSystemType: bp.aiComponents[0] || "AI Assistant",
            detectedSignals: [pain.pain],
            requiredCapabilities: bp.requiredCapabilities,
            dependencies: bp.prerequisites,
            risks: [],
            evidenceIds: [ev.id],
            candidateSource: "blueprint",
          });
        }
      }
    }
  }

  return { candidates, evidence };
}
