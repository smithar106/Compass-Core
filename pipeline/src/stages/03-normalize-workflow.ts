import type { EvidenceRecord, Department, NormalizedWorkflowSignals, WorkflowPainPoint, PipelineContext } from "../types/index.js";
interface NormalizeWorkflowInput {
  answers: Array<{
    questionId: number;
    value: string | number | boolean;
    type: string;
    wasSkipped: boolean;
  }>;
  company: any;
  evidence: EvidenceRecord[];
}

export async function normalizeWorkflowSignals(input: NormalizeWorkflowInput, _context: PipelineContext): Promise<{ signals: NormalizedWorkflowSignals; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));

  const painPoints: WorkflowPainPoint[] = [];

  function addPain(department: Department, pain: string, severity: "high" | "medium" | "low", confidence: number) {
    const id = `wf-pain-${department.toLowerCase().replace(/\s+/g, "-")}-${pain.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`;
    const ev: EvidenceRecord = {
      id, type: "workflow_signal", evidenceClass: "Deterministic",
      sourceLabel: `Workflow pain: ${department}`,
      content: pain, confidence, reliability: 0.8,
    };
    evidence.push(ev);
    painPoints.push({ department, pain, severity, evidenceIds: [ev.id] });
  }

  // Sales qualification pain
  if (answerMap.get(1)?.value === false) {
    addPain("Sales", "No consistent sales qualification process", "high", 0.85);
  }
  const salesManual = answerMap.get(2)?.value;
  if (salesManual && typeof salesManual === "string" && parseInt(salesManual.charAt(0)) <= 3) {
    addPain("Sales", "High manual data entry burden for AEs", "high", 0.8);
  }

  // Marketing pain
  if (answerMap.get(4)?.value === false) {
    addPain("Marketing", "No automated lead scoring", "medium", 0.85);
  }
  const marketingPersonalization = answerMap.get(5)?.value;
  if (marketingPersonalization && typeof marketingPersonalization === "string" && parseInt(marketingPersonalization.charAt(0)) <= 2) {
    addPain("Marketing", "Low personalization in email campaigns", "medium", 0.8);
  }
  const attribution = answerMap.get(6)?.value;
  if (attribution === "Don't track" || attribution === "Last-touch") {
    addPain("Marketing", "Limited marketing attribution", "medium", 0.75);
  }

  // CS pain
  if (answerMap.get(7)?.value === false) {
    addPain("Customer Success", "No automated customer health scoring", "high", 0.85);
  }
  const csProactive = answerMap.get(8)?.value;
  if (csProactive && typeof csProactive === "string" && parseInt(csProactive.charAt(0)) <= 2) {
    addPain("Customer Success", "Reactive rather than proactive CS outreach", "high", 0.8);
  }

  // Support pain
  const supportAutoPct = answerMap.get(10)?.value;
  if (supportAutoPct === "0-10%" || supportAutoPct === "10-25%") {
    addPain("Support", "Low ticket deflection rate", "high", 0.85);
  }
  if (answerMap.get(11)?.value === false) {
    addPain("Support", "No knowledge base for self-service", "high", 0.85);
  }

  // Finance pain
  if (answerMap.get(13)?.value === false) {
    addPain("Finance", "Manual expense reporting and approvals", "medium", 0.8);
  }
  const closeDays = answerMap.get(14)?.value;
  if (closeDays === "8-14 days" || closeDays === "15+ days") {
    addPain("Finance", "Slow month-end close process", "medium", 0.75);
  }

  // Product pain
  if (answerMap.get(15)?.value === false) {
    addPain("Product", "No product analytics for roadmap decisions", "medium", 0.8);
  }

  // Engineering pain
  if (answerMap.get(17)?.value === false) {
    addPain("Engineering", "No automated CI/CD pipeline", "medium", 0.85);
  }
  const engMaintenance = answerMap.get(18)?.value;
  if (engMaintenance && typeof engMaintenance === "string" && parseInt(engMaintenance.charAt(0)) <= 2) {
    addPain("Engineering", "Excessive maintenance burden on engineering", "medium", 0.75);
  }

  // HR pain
  if (answerMap.get(20)?.value === false) {
    addPain("People/HR", "No HRIS for employee lifecycle management", "low", 0.8);
  }

  // Legal pain
  if (answerMap.get(22)?.value === false) {
    addPain("Legal", "Manual contract review process creates bottleneck", "medium", 0.85);
  }

  // Operations pain
  if (answerMap.get(24)?.value === false) {
    addPain("Operations", "No centralized source of truth for operations", "medium", 0.8);
  }

  // Compute density metrics
  const manualIndicators = [answerMap.get(1)?.value === false, answerMap.get(4)?.value === false, answerMap.get(7)?.value === false, answerMap.get(11)?.value === false, answerMap.get(13)?.value === false, answerMap.get(22)?.value === false, answerMap.get(24)?.value === false].filter(Boolean).length;

  // Detect departments present from answers
  const departments: Department[] = [];
  const deptQuestions: Record<Department, number[]> = {
    Sales: [1, 2, 3], Marketing: [4, 5, 6], "Customer Success": [7, 8, 9],
    Support: [10, 11, 12], Finance: [13, 14], Product: [15, 16],
    Engineering: [17, 18, 19], "People/HR": [20, 21], Legal: [22, 23], Operations: [24, 25],
  };
  const missingDepartments: Department[] = [];

  for (const [dept, qIds] of Object.entries(deptQuestions)) {
    const answered = qIds.filter((id) => answerMap.has(id) && !answerMap.get(id)?.wasSkipped);
    if (answered.length >= 1) {
      departments.push(dept as Department);
    }
    if (answered.length === 0) {
      missingDepartments.push(dept as Department);
    }
  }

  // Compute reporting burden from open questions and manual signals
  const burdenIndicators = manualIndicators;
  const reportingBurden = Math.min(burdenIndicators / 7, 1);

  return {
    signals: {
      departments: [...new Set(departments)],
      manualProcessDensity: manualIndicators / 7,
      crossDeptHandoffs: departments.length > 5 ? 0.7 : 0.4,
      approvalChainDepth: painPoints.filter((p) => p.department === "Finance" || p.department === "Legal").length > 0 ? 0.7 : 0.3,
      reportingBurden,
      techMaturity: [answerMap.get(17)?.value === true, answerMap.get(15)?.value === true].filter(Boolean).length > 0 ? 0.6 : 0.3,
      aiReadiness: [answerMap.get(10)?.value !== "0-10%", answerMap.get(5)?.value && typeof answerMap.get(5)?.value === "string" && parseInt(answerMap.get(5)!.value!.toString().charAt(0)) >= 3].filter(Boolean).length > 0 ? 0.5 : 0.3,
      regulatoryBurden: [answerMap.get(23)?.wasSkipped === false, answerMap.get(22)?.value === true].filter(Boolean).length > 0 ? 0.5 : 0.2,
      painPoints,
      missingDepartments: [...new Set(missingDepartments)],
      evidenceIds: evidence.map((e) => e.id),
    },
    evidence,
  };
}
