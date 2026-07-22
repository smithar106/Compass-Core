import type { CompanyIntelligence, InferredField, EvidenceBackedSignal, ConfidenceAssessment, EvidenceRecord, PipelineContext } from "../types/index.js";

interface BuildCompanyContextInput {
  answers: Array<{
    questionId: number;
    value: string | number | boolean;
    type: string;
    wasSkipped: boolean;
  }>;
  evidence: EvidenceRecord[];
}

export async function buildCompanyContext(input: BuildCompanyContextInput, _context: PipelineContext): Promise<{ company: CompanyIntelligence; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const signals: EvidenceBackedSignal[] = [];
  const unknowns: string[] = [];

  const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));

  function extractEvidence(deterministicId: string, label: string, content: string, confidence: number): EvidenceRecord {
    const rec: EvidenceRecord = {
      id: deterministicId,
      type: "deterministic_derivation",
      evidenceClass: "Deterministic",
      sourceLabel: label,
      content,
      confidence,
      reliability: 0.85,
    };
    evidence.push(rec);
    return rec;
  }

  function inferredField<T>(value: T, confidence: number, source: InferredField<T>["source"], label: string, detail: string): InferredField<T> {
    const ev = extractEvidence(`det-${label.toLowerCase().replace(/\s+/g, "-")}`, label, detail, confidence);
    return { value, confidence, evidenceIds: [ev.id], source };
  }

  // Industry from boolean questions about process/structure
  const hasSalesProcess = answerMap.get(1)?.value === true;
  const hasLeadScoring = answerMap.get(4)?.value === true;
  const hasHealthScoring = answerMap.get(7)?.value === true;
  const hasKnowledgeBase = answerMap.get(11)?.value === true;
  const hasAutomatedExpenses = answerMap.get(13)?.value === true;
  const hasProductAnalytics = answerMap.get(15)?.value === true;
  const hasCICD = answerMap.get(17)?.value === true;
  const hasHRIS = answerMap.get(20)?.value === true;
  const hasContractReview = answerMap.get(22)?.value === true;
  const hasCentralizedOps = answerMap.get(24)?.value === true;

  const structuredDeptCount = [hasSalesProcess, hasLeadScoring, hasHealthScoring, hasKnowledgeBase, hasAutomatedExpenses, hasProductAnalytics, hasCICD, hasHRIS, hasContractReview, hasCentralizedOps].filter(Boolean).length;

  const industryConfidence = structuredDeptCount >= 7 ? 0.85 : structuredDeptCount >= 4 ? 0.65 : 0.45;
  const industry = inferredField("B2B SaaS", industryConfidence, "deterministic", "Industry inference", `Inferred B2B SaaS from ${structuredDeptCount}/10 structured departments`);

  // Business model
  const businessModel = inferredField("SaaS", 0.8, "deterministic", "Business model", "Assessment targets B2B SaaS companies per product scope");

  // Employee range from organizational complexity signals
  const hasMultipleDepts = structuredDeptCount >= 5;
  const employeeRange = hasMultipleDepts ? inferredField("50-500", 0.6, "deterministic", "Employee range", `Estimated ${structuredDeptCount} department signals suggest growing organization`) : inferredField("10-50", 0.5, "deterministic", "Employee range", "Fewer department signals suggest smaller org");

  // Likely departments from question sections
  const deptSignals: string[] = [];
  const allDepartments = ["Sales", "Marketing", "Customer Success", "Support", "Finance", "Product", "Engineering", "People/HR", "Legal", "Operations"];

  const deptMap: Record<string, number[]> = {
    "Sales": [1, 2, 3],
    "Marketing": [4, 5, 6],
    "Customer Success": [7, 8, 9],
    "Support": [10, 11, 12],
    "Finance": [13, 14],
    "Product": [15, 16],
    "Engineering": [17, 18, 19],
    "People/HR": [20, 21],
    "Legal": [22, 23],
    "Operations": [24, 25],
  };

  for (const [dept, qIds] of Object.entries(deptMap)) {
    const answered = qIds.filter((id) => answerMap.has(id) && !answerMap.get(id)?.wasSkipped);
    if (answered.length >= Math.ceil(qIds.length / 2)) {
      deptSignals.push(dept);
    }
  }

  const departments = inferredField(deptSignals.length > 0 ? deptSignals : allDepartments, Math.min(0.5 + deptSignals.length * 0.05, 0.9), "deterministic", "Departments", `Detected ${deptSignals.length} departments from answered questions`);

  // Technology signals from open-ended CRM/platform answers
  const crmAnswer = answerMap.get(3)?.value;
  if (crmAnswer && typeof crmAnswer === "string" && crmAnswer.length > 0) {
    const ev = extractEvidence("det-crm-mention", "CRM platform", `User mentioned: ${crmAnswer}`, 0.85);
    signals.push({ signalId: "TC-01", name: "CRM Platform", family: "technical", value: crmAnswer, confidence: 0.85, evidenceIds: [ev.id] });
  }

  // Manual process density from scale questions
  const salesManual = answerMap.get(2)?.value;
  if (salesManual && typeof salesManual === "string") {
    const manualLevel = parseInt(salesManual.charAt(0));
    const ev = extractEvidence("det-sales-manual", "Sales manual process level", `Sales process manual level: ${manualLevel}/5`, 0.8);
    signals.push({ signalId: "OP-01", name: "Manual Process Density", family: "operational", value: manualLevel, confidence: 0.8, evidenceIds: [ev.id] });
  }

  const supportResolutionPct = answerMap.get(10)?.value;
  if (supportResolutionPct && typeof supportResolutionPct === "string") {
    const ev = extractEvidence("det-support-auto", "Support automation level", `Support auto-resolution: ${supportResolutionPct}`, 0.8);
    signals.push({ signalId: "TC-02", name: "Support Automation", family: "technical", value: supportResolutionPct, confidence: 0.8, evidenceIds: [ev.id] });
  }

  const closeDays = answerMap.get(14)?.value;
  if (closeDays && typeof closeDays === "string") {
    const ev = extractEvidence("det-close-days", "Month-end close duration", `Month-end close: ${closeDays}`, 0.8);
    signals.push({ signalId: "FI-03", name: "Close Duration", family: "financial", value: closeDays, confidence: 0.8, evidenceIds: [ev.id] });
  }

  // Workflow pain signals from automation-gap questions
  if (hasSalesProcess === false) {
    const ev = extractEvidence("det-pain-sales-qual", "Sales qualification pain", "No consistent sales qualification process", 0.85);
    signals.push({ signalId: "OP-02", name: "Sales qualification gap", family: "operational", value: "no_process", confidence: 0.85, evidenceIds: [ev.id] });
  }
  if (hasLeadScoring === false) {
    const ev = extractEvidence("det-pain-lead-scoring", "Lead scoring gap", "No automated lead scoring", 0.85);
    signals.push({ signalId: "OP-03", name: "Lead scoring gap", family: "operational", value: "no_automation", confidence: 0.85, evidenceIds: [ev.id] });
  }
  if (hasHealthScoring === false) {
    const ev = extractEvidence("det-pain-health-scoring", "Health scoring gap", "No automated customer health scoring", 0.85);
    signals.push({ signalId: "OP-04", name: "Customer health gap", family: "operational", value: "no_automation", confidence: 0.85, evidenceIds: [ev.id] });
  }
  if (hasKnowledgeBase === false) {
    const ev = extractEvidence("det-pain-kb", "Knowledge base gap", "No knowledge base for support", 0.85);
    signals.push({ signalId: "OP-05", name: "Knowledge base gap", family: "operational", value: "missing", confidence: 0.85, evidenceIds: [ev.id] });
  }
  if (hasContractReview === false) {
    const ev = extractEvidence("det-pain-contract", "Contract review gap", "No automated contract review", 0.85);
    signals.push({ signalId: "OP-06", name: "Contract review gap", family: "operational", value: "manual", confidence: 0.85, evidenceIds: [ev.id] });
  }
  if (hasAutomatedExpenses === false) {
    const ev = extractEvidence("det-pain-expenses", "Expense management gap", "No automated expense reporting", 0.85);
    signals.push({ signalId: "FI-04", name: "Expense management gap", family: "financial", value: "manual", confidence: 0.85, evidenceIds: [ev.id] });
  }

  // Tech maturity from CI/CD, product analytics, etc.
  const techSignals = [hasCICD, hasProductAnalytics, hasCentralizedOps].filter(Boolean).length;
  if (techSignals === 0) {
    const ev = extractEvidence("det-low-tech-maturity", "Low tech maturity", "No CI/CD, product analytics, or centralized ops", 0.7);
    signals.push({ signalId: "TC-03", name: "Tech Maturity", family: "technical", value: "low", confidence: 0.7, evidenceIds: [ev.id] });
  }

  // Operational pain hypotheses
  const painSignals: EvidenceBackedSignal[] = [];
  if (hasSalesProcess === false) {
    painSignals.push({ signalId: "PAIN-01", name: "Inconsistent sales qualification", family: "pain", value: "Sales lacks structured qualification", confidence: 0.85, evidenceIds: [evidence.filter(e => e.id === "det-pain-sales-qual").map(e => e.id)].flat() });
  }
  if (hasHealthScoring === false) {
    painSignals.push({ signalId: "PAIN-02", name: "Reactive customer success", family: "pain", value: "CS team cannot proactively identify at-risk accounts", confidence: 0.85, evidenceIds: [evidence.filter(e => e.id === "det-pain-health-scoring").map(e => e.id)].flat() });
  }
  if (hasKnowledgeBase === false) {
    painSignals.push({ signalId: "PAIN-03", name: "Support ticket overload", family: "pain", value: "Support handles repetitive Tier-1 tickets without KB deflection", confidence: 0.85, evidenceIds: [evidence.filter(e => e.id === "det-pain-kb").map(e => e.id)].flat() });
  }
  if (hasContractReview === false) {
    painSignals.push({ signalId: "PAIN-04", name: "Legal bottleneck", family: "pain", value: "Legal team manually reviews all contracts, slowing deals", confidence: 0.8, evidenceIds: [evidence.filter(e => e.id === "det-pain-contract").map(e => e.id)].flat() });
  }

  // Unknown areas
  if (answerMap.get(3)?.wasSkipped) unknowns.push("CRM platform details");
  if (answerMap.get(9)?.wasSkipped) unknowns.push("Customer success platform");
  if (answerMap.get(12)?.wasSkipped) unknowns.push("Support response times");
  if (answerMap.get(16)?.wasSkipped) unknowns.push("Product prioritization method");
  if (answerMap.get(19)?.wasSkipped) unknowns.push("Engineering cycle times");
  if (answerMap.get(21)?.wasSkipped) unknowns.push("HR performance review process");
  if (answerMap.get(23)?.wasSkipped) unknowns.push("Compliance management approach");
  if (answerMap.get(25)?.wasSkipped) unknowns.push("Operational improvement priorities");

  const researchQuality: ConfidenceAssessment = {
    overall: Math.min(0.4 + (evidence.length * 0.03), 0.95),
    sourceAuthority: 0.9,
    dataFreshness: 0.95,
    directness: 0.85,
    consistency: 0.7,
    specificity: 0.6,
  };

  return {
    company: {
      companySummary: `B2B SaaS company with signals from ${deptSignals.length} departments. ${hasSalesProcess ? "Has" : "Lacks"} structured sales process. ${hasHealthScoring ? "Has" : "Lacks"} customer health scoring. ${hasKnowledgeBase ? "Has" : "Lacks"} support knowledge base.`,
      industry,
      businessModel,
      employeeRange,
      likelyDepartments: departments,
      technologySignals: signals.filter((s) => s.family === "technical"),
      workflowSignals: signals.filter((s) => s.family === "operational"),
      operationalPainHypotheses: painSignals,
      unknowns,
      researchQuality,
    },
    evidence,
  };
}
