// Stage: Business Problem Detection + Intervention-Path Comparison
// Priority 2 (intervention-path comparison) and Priority 4 (candidate
// generation identifies business problems, not merely AI use cases).
//
// All scoring is deterministic. An LLM may structure ambiguous assessment text
// upstream, but path eligibility, selection, and rejection are computed here.

import type {
  BusinessProblem,
  BusinessImpact,
  Department,
  EvidenceRecord,
  InterventionOption,
  InterventionPath,
  AlternativeRejection,
  RecommendedIntervention,
  EvidenceSufficiency,
  FollowUpQuestion,
  Assumption,
  SuccessMetric,
  EscalationRequirement,
  PipelineContext,
} from "../types/index.js";
import { INTERVENTION_ENGINE_VERSION } from "../types/index.js";

export interface GenerateBusinessProblemsInput {
  answers: Array<{ questionId: number; value: string | number | boolean; type: string; wasSkipped: boolean }>;
  company: any;
  workflowSignals: any;
  evidence: EvidenceRecord[];
}

export interface GenerateInterventionOptionsInput {
  problems: BusinessProblem[];
  answers: Array<{ questionId: number; value: string | number | boolean; type: string; wasSkipped: boolean }>;
  workflowSignals: any;
  evidence: EvidenceRecord[];
}

// ─── Problem characteristics ─────────────────────────────────────────────────
// Every detected business problem is described along these axes. Path
// suitability functions below are deterministic functions of these axes.

export interface ProblemCharacteristics {
  dataStructure: "structured" | "unstructured" | "mixed";
  ruleStability: "stable" | "changing";
  ambiguity: "low" | "high";
  volume: "low" | "medium" | "high";
  stakes: "low" | "medium" | "high";
  judgmentRequired: "low" | "high";
  ownershipClarity: "clear" | "unclear";
  processMaturity: "documented" | "ad_hoc";
  errorTolerance: "low" | "high";
  exceptionVolume: "low" | "high";
  empathyRequired: boolean;
  regulatoryAccountability: boolean;
}

interface ProblemTemplate {
  id: string;
  title: string;
  description: string;
  department: Department;
  workflow: string;
  desiredOutcome: string;
  characteristics: ProblemCharacteristics;
  evidenceTags: string[];
  impactHint: BusinessImpact;
}

// ─── Priority 4: business problem catalogue ──────────────────────────────────
// Candidates include broken handoffs, repetitive decisions, repetitive data
// movement, manual synthesis, missing information, high exception volume,
// duplicated approvals, poor process visibility, inconsistent judgment,
// underused existing software, training gaps, and ownership gaps.

function detectProblems(input: GenerateBusinessProblemsInput, evidence: EvidenceRecord[]): BusinessProblem[] {
  const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));
  const problems: BusinessProblem[] = [];

  const scaleValue = (id: number): number => {
    const v = answerMap.get(id)?.value;
    if (typeof v !== "string") return 3;
    const n = parseInt(v.charAt(0), 10);
    return Number.isNaN(n) ? 3 : n;
  };
  const textValue = (id: number): string => String(answerMap.get(id)?.value ?? "");
  const boolValue = (id: number): boolean => answerMap.get(id)?.value === true;

  const addEvidence = (id: string, label: string, content: string, confidence: number): string => {
    evidence.push({
      id, type: "deterministic_derivation", evidenceClass: "Deterministic",
      sourceLabel: label, content, confidence, reliability: 0.85,
    });
    return id;
  };

  const templates: ProblemTemplate[] = [];

  // 1. Sales qualification: manual + repetitive decisions about lead fit.
  if (!boolValue(1) || scaleValue(2) <= 2) {
    templates.push({
      id: "problem-sales-qualification",
      title: "Manual, inconsistent lead qualification",
      description: "Sales reps research and qualify inbound leads manually with inconsistent criteria.",
      department: "Sales",
      workflow: "Lead capture → manual research → qualification → routing",
      desiredOutcome: "Consistent, fast qualification with stable routing rules",
      characteristics: {
        dataStructure: "structured", ruleStability: "stable", ambiguity: "low",
        volume: "high", stakes: "medium", judgmentRequired: "low",
        ownershipClarity: "clear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "low",
        empathyRequired: false, regulatoryAccountability: false,
      },
      evidenceTags: ["lead_qualification", "sales_efficiency"],
      impactHint: { cost: 60000, timePerOccurrence: 25, userHoursPerWeek: 15, customerImpactScore: 6, revenueImpact: 120000, strategicImportance: "high" },
    });
  }

  // 2. Marketing reporting: manual synthesis across channels.
  if (textValue(6).includes("No formal") || textValue(5) === "1" || textValue(5) === "2") {
    templates.push({
      id: "problem-marketing-reporting",
      title: "Manual campaign reporting and attribution",
      description: "Marketing performance data is compiled manually across channels; attribution is missing or single-touch.",
      department: "Marketing",
      workflow: "Data pull per channel → spreadsheet merge → manual insight write-up",
      desiredOutcome: "Automated data aggregation with a documented attribution model",
      characteristics: {
        dataStructure: "structured", ruleStability: "stable", ambiguity: "low",
        volume: "medium", stakes: "low", judgmentRequired: "low",
        ownershipClarity: "clear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "low",
        empathyRequired: false, regulatoryAccountability: false,
      },
      evidenceTags: ["attribution", "reporting", "marketing_analytics"],
      impactHint: { cost: 40000, timePerOccurrence: 480, userHoursPerWeek: 8, customerImpactScore: 3, strategicImportance: "medium" },
    });
  }

  // 3. Reactive customer success: missing information, probabilistic signals.
  if (!boolValue(7) || scaleValue(8) <= 2) {
    templates.push({
      id: "problem-cs-reactive",
      title: "Reactive customer success, no early risk detection",
      description: "Customer health is assessed manually or not at all; churn is detected after it happens.",
      department: "Customer Success",
      workflow: "CSM anecdotal review → ad-hoc outreach → renewal surprise",
      desiredOutcome: "Early, evidence-based risk visibility across the book of business",
      characteristics: {
        dataStructure: "mixed", ruleStability: "changing", ambiguity: "high",
        volume: "medium", stakes: "high", judgmentRequired: "high",
        ownershipClarity: "clear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "high",
        empathyRequired: true, regulatoryAccountability: false,
      },
      evidenceTags: ["health_scoring", "churn_prediction", "customer_retention"],
      impactHint: { cost: 90000, timePerOccurrence: 90, userHoursPerWeek: 12, customerImpactScore: 8, revenueImpact: 300000, strategicImportance: "high" },
    });
  }

  // 4. Support triage: repetitive decisions + high volume of language data.
  if (!boolValue(11) || textValue(10).startsWith("0") || textValue(10).startsWith("10")) {
    templates.push({
      id: "problem-support-triage",
      title: "Manual support ticket triage and resolution",
      description: "Tickets are categorized and routed manually; knowledge base deflection is low or absent.",
      department: "Support",
      workflow: "Ticket arrives → manual triage → agent assignment → custom response",
      desiredOutcome: "Fast, consistent routing with high self-service deflection",
      characteristics: {
        dataStructure: "unstructured", ruleStability: "changing", ambiguity: "high",
        volume: "high", stakes: "medium", judgmentRequired: "low",
        ownershipClarity: "clear", processMaturity: "documented",
        errorTolerance: "high", exceptionVolume: "high",
        empathyRequired: true, regulatoryAccountability: false,
      },
      evidenceTags: ["ticket_routing", "knowledge_base", "support_efficiency"],
      impactHint: { cost: 70000, timePerOccurrence: 20, userHoursPerWeek: 25, customerImpactScore: 7, strategicImportance: "high" },
    });
  }

  // 5. Finance close: stable rules, structured inputs, exactness required.
  if (!boolValue(13) || textValue(14).includes("15") || textValue(14).includes("5 days") || textValue(14).includes("More than 5")) {
    templates.push({
      id: "problem-finance-close",
      title: "Manual invoice processing and slow month-end close",
      description: "Invoices are keyed manually and reconciliation takes days of repetitive, rule-bound work.",
      department: "Finance",
      workflow: "Invoice receipt → manual entry → approval routing → reconciliation",
      desiredOutcome: "Rule-driven posting and reconciliation with auditable exceptions",
      characteristics: {
        dataStructure: "structured", ruleStability: "stable", ambiguity: "low",
        volume: "high", stakes: "high", judgmentRequired: "low",
        ownershipClarity: "clear", processMaturity: "documented",
        errorTolerance: "low", exceptionVolume: "low",
        empathyRequired: false, regulatoryAccountability: true,
      },
      evidenceTags: ["invoice_processing", "reconciliation", "ap_automation"],
      impactHint: { cost: 55000, timePerOccurrence: 40, userHoursPerWeek: 18, customerImpactScore: 4, strategicImportance: "medium" },
    });
  }

  // 6. Product feedback: unstructured synthesis at moderate volume.
  if (!boolValue(15) || textValue(16).includes("CEO") || textValue(16).includes("ad hoc") || textValue(16).length === 0) {
    templates.push({
      id: "problem-product-feedback",
      title: "Unstructured product feedback and roadmap prioritization",
      description: "User feedback is collected ad hoc; prioritization lacks a systematic, visible process.",
      department: "Product",
      workflow: "Feedback scattered across channels → opinion-based prioritization",
      desiredOutcome: "Single feedback repository with a documented prioritization method",
      characteristics: {
        dataStructure: "unstructured", ruleStability: "changing", ambiguity: "high",
        volume: "medium", stakes: "medium", judgmentRequired: "high",
        ownershipClarity: "unclear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "high",
        empathyRequired: false, regulatoryAccountability: false,
      },
      evidenceTags: ["feedback_management", "product_prioritization"],
      impactHint: { cost: 30000, timePerOccurrence: 60, userHoursPerWeek: 6, customerImpactScore: 6, strategicImportance: "medium" },
    });
  }

  // 7. Engineering documentation: knowledge gaps, low volume, judgment-heavy.
  if (!boolValue(17) || textValue(18).includes("Minimal") || textValue(18).includes("No formal") || textValue(18).includes("outdated")) {
    templates.push({
      id: "problem-engineering-docs",
      title: "Outdated engineering documentation and slow incident RCA",
      description: "Documentation is missing or stale; root cause analysis depends on tribal knowledge.",
      department: "Engineering",
      workflow: "Incident → manual investigation across systems → undocumented fix",
      desiredOutcome: "Current docs and a documented RCA process",
      characteristics: {
        dataStructure: "unstructured", ruleStability: "changing", ambiguity: "high",
        volume: "low", stakes: "high", judgmentRequired: "high",
        ownershipClarity: "unclear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "high",
        empathyRequired: false, regulatoryAccountability: false,
      },
      evidenceTags: ["documentation", "incident_response", "engineering_operations"],
      impactHint: { cost: 45000, timePerOccurrence: 120, userHoursPerWeek: 5, customerImpactScore: 5, strategicImportance: "medium" },
    });
  }

  // 8. HR screening: repetitive decisions over unstructured resumes.
  if (!boolValue(20)) {
    templates.push({
      id: "problem-hr-screening",
      title: "Manual resume screening without an ATS",
      description: "Recruiters review every resume manually with no systematic screening stage.",
      department: "People/HR",
      workflow: "Application → recruiter reads every resume → shortlist",
      desiredOutcome: "Structured first-pass screening with human review of edge cases",
      characteristics: {
        dataStructure: "unstructured", ruleStability: "stable", ambiguity: "high",
        volume: "medium", stakes: "medium", judgmentRequired: "high",
        ownershipClarity: "clear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "high",
        empathyRequired: true, regulatoryAccountability: true,
      },
      evidenceTags: ["recruiting", "resume_screening"],
      impactHint: { cost: 25000, timePerOccurrence: 15, userHoursPerWeek: 8, customerImpactScore: 4, strategicImportance: "low" },
    });
  }

  // 9. Legal contract review: rare, high-stakes judgment, regulatory accountability.
  if (!boolValue(22)) {
    templates.push({
      id: "problem-legal-review",
      title: "Manual review of every standard contract",
      description: "Legal reviews every NDA/MSA manually, creating a deal bottleneck on rare high-stakes judgments.",
      department: "Legal",
      workflow: "Contract request → legal reads full document → redline → approval",
      desiredOutcome: "Standard contracts handled by exception; lawyer time reserved for true risk",
      characteristics: {
        dataStructure: "unstructured", ruleStability: "stable", ambiguity: "low",
        volume: "low", stakes: "high", judgmentRequired: "high",
        ownershipClarity: "clear", processMaturity: "documented",
        errorTolerance: "low", exceptionVolume: "low",
        empathyRequired: false, regulatoryAccountability: true,
      },
      evidenceTags: ["contract_review", "legal_operations"],
      impactHint: { cost: 35000, timePerOccurrence: 90, userHoursPerWeek: 10, customerImpactScore: 5, strategicImportance: "medium" },
    });
  }

  // 10. Operations: duplicated approvals, unclear ownership, no centralized process.
  if (!boolValue(24)) {
    templates.push({
      id: "problem-ops-ownership",
      title: "Broken operational workflow with no clear owner",
      description: "Provisioning and recurring reporting run through duplicated approvals with no single accountable owner.",
      department: "Operations",
      workflow: "Request → unclear routing → duplicated approvals → manual execution",
      desiredOutcome: "Single accountable owner and a simplified approval chain before any automation",
      characteristics: {
        dataStructure: "structured", ruleStability: "changing", ambiguity: "high",
        volume: "medium", stakes: "medium", judgmentRequired: "high",
        ownershipClarity: "unclear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "high",
        empathyRequired: false, regulatoryAccountability: false,
      },
      evidenceTags: ["tool_provisioning", "operations_efficiency", "ownership_gap"],
      impactHint: { cost: 20000, timePerOccurrence: 45, userHoursPerWeek: 6, customerImpactScore: 3, strategicImportance: "low" },
    });
  }

  // 11. Approval chain depth signal from workflow normalization.
  const approvalDepth = Number(input.workflowSignals?.approvalChainDepth ?? 0);
  if (approvalDepth >= 0.7) {
    templates.push({
      id: "problem-approval-chain",
      title: "Twelve-stage approval process with redundant sign-offs",
      description: "Cross-department approvals stack up; work waits in queues and accountability is diffuse.",
      department: "Operations",
      workflow: "Request → many sequential approvals → execution",
      desiredOutcome: "Approval chain redesigned around actual risk, not habit",
      characteristics: {
        dataStructure: "structured", ruleStability: "stable", ambiguity: "low",
        volume: "medium", stakes: "medium", judgmentRequired: "low",
        ownershipClarity: "unclear", processMaturity: "ad_hoc",
        errorTolerance: "high", exceptionVolume: "low",
        empathyRequired: false, regulatoryAccountability: false,
      },
      evidenceTags: ["approval_chain", "process_redesign"],
      impactHint: { cost: 50000, timePerOccurrence: 240, userHoursPerWeek: 12, customerImpactScore: 5, strategicImportance: "high" },
    });
  }

  for (const t of templates) {
    const evId = addEvidence(
      `det-problem-${t.id}`,
      `Business problem: ${t.title}`,
      `Detected ${t.department} problem from assessment signals: ${t.evidenceTags.join(", ")}`,
      0.8,
    );
    problems.push({
      id: t.id,
      title: t.title,
      description: t.description,
      department: t.department,
      workflow: t.workflow,
      desiredOutcome: t.desiredOutcome,
      currentImpact: t.impactHint,
      evidenceIds: [evId],
      rootCauseHypotheses: [],
      mergedSignalIds: [],
    });
  }

  return problems;
}

// ─── Priority 2: path suitability scoring ────────────────────────────────────
// Each function returns 0–10 and a list of hard disqualifiers. Criteria are
// taken directly from the product spec for each intervention path.

export interface SuitabilityResult {
  score: number;
  disqualifiers: string[];
  reasons: string[];
}

export function aiSuitability(c: ProblemCharacteristics): SuitabilityResult {
  const dqs: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  // Unstructured data / language interpretation / ambiguity / changing patterns
  if (c.dataStructure === "unstructured") { score += 3; reasons.push("Unstructured data requires interpretation"); }
  else if (c.dataStructure === "mixed") { score += 2; reasons.push("Mixed data includes unstructured elements"); }
  if (c.ambiguity === "high") { score += 2; reasons.push("Ambiguity requires contextual reasoning"); }
  if (c.ruleStability === "changing") { score += 2; reasons.push("Changing patterns favor learned models over fixed rules"); }
  if (c.volume === "high") { score += 1; reasons.push("High volume amortizes model cost"); }
  // Acceptable error tolerance and evaluation feasibility
  if (c.errorTolerance === "high") { score += 1; reasons.push("Errors are tolerable with review"); }
  if (c.errorTolerance === "low") { dqs.push("Low error tolerance requires exactness AI cannot guarantee"); }
  if (c.volume === "low") { dqs.push("Volume too low to train or justify a model"); }
  if (c.regulatoryAccountability && c.errorTolerance === "low") { dqs.push("Regulatory accountability with low error tolerance blocks probabilistic classification"); }
  // Human-review requirement
  if (c.stakes === "high") { reasons.push("High stakes require human review of AI output"); }

  return { score: Math.min(score, 10), disqualifiers: dqs, reasons };
}

export function deterministicSuitability(c: ProblemCharacteristics): SuitabilityResult {
  const dqs: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  if (c.ruleStability === "stable") { score += 3; reasons.push("Rules are stable and can be encoded exactly"); }
  else { dqs.push("Unstable rules defeat fixed logic"); }
  if (c.dataStructure === "structured") { score += 3; reasons.push("Structured inputs map directly to deterministic logic"); }
  else { dqs.push("Unstructured inputs cannot be handled by rules alone"); }
  if (c.ambiguity === "low") { score += 2; reasons.push("Low ambiguity keeps exceptions predictable"); }
  if (c.errorTolerance === "low") { score += 1; reasons.push("Exactness requirement favors deterministic automation"); }
  if (c.volume === "high") { score += 1; reasons.push("Repeatability at volume"); }
  if (c.exceptionVolume === "high") { dqs.push("High exception volume defeats stable routing rules"); }
  if (c.ownershipClarity === "unclear") { dqs.push("No clear owner to maintain and change-control encoded rules"); }
  if (c.regulatoryAccountability) { reasons.push("Auditability of deterministic rules supports compliance"); }

  return { score: Math.min(score, 10), disqualifiers: dqs, reasons };
}

export function processRedesignSuitability(c: ProblemCharacteristics): SuitabilityResult {
  const dqs: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  if (c.ownershipClarity === "unclear") { score += 3; reasons.push("Unclear ownership must be fixed before any tooling"); }
  if (c.processMaturity === "ad_hoc") { score += 3; reasons.push("Missing SOP; process itself is the defect"); }
  if (c.exceptionVolume === "high") { score += 1; reasons.push("High exception volume signals process/design failure"); }
  if (c.ambiguity === "high" && c.judgmentRequired === "high") { score += 1; reasons.push("Inconsistent judgment calls for standardized decision policy"); }
  if (c.dataStructure === "structured" && c.ruleStability === "stable") { score += 1; reasons.push("Underlying work is simple enough for a leaner process"); }
  if (c.processMaturity === "documented" && c.ownershipClarity === "clear") { dqs.push("Process is already documented and owned; redesign adds little"); }

  return { score: Math.min(score, 10), disqualifiers: dqs, reasons };
}

export function humanWorkSuitability(c: ProblemCharacteristics): SuitabilityResult {
  const dqs: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  if (c.volume === "low") { score += 2; reasons.push("Low volume keeps human handling economical"); }
  if (c.stakes === "high") { score += 3; reasons.push("High-stakes judgment belongs with accountable humans"); }
  if (c.empathyRequired) { score += 2; reasons.push("Empathy required"); }
  if (c.regulatoryAccountability) { score += 2; reasons.push("Regulatory accountability requires a named human"); }
  if (c.judgmentRequired === "high" && c.ambiguity === "high") { score += 1; reasons.push("Unresolved ambiguity requires expert judgment"); }
  if (c.volume === "high" && c.judgmentRequired === "low") { dqs.push("High-volume low-judgment work should not stay manual"); }

  return { score: Math.min(score, 10), disqualifiers: dqs, reasons };
}

export function hybridSuitability(c: ProblemCharacteristics): SuitabilityResult {
  const dqs: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  if (c.dataStructure === "mixed") { score += 3; reasons.push("Mixed structured/unstructured work splits naturally"); }
  if (c.exceptionVolume === "high") { score += 2; reasons.push("Structured automation with human exception handling"); }
  if (c.stakes === "high" && c.errorTolerance === "high") { score += 2; reasons.push("AI recommendation with human approval fits stakes/tolerance"); }
  if (c.ruleStability === "changing" && c.dataStructure !== "structured") { score += 1; reasons.push("Deterministic routing plus learned judgment"); }
  if (c.volume === "high" && c.judgmentRequired === "high") { score += 2; reasons.push("Volume needs automation; judgment needs humans"); }
  if (c.volume === "low" && c.dataStructure === "structured") { dqs.push("Too simple and too rare to justify a hybrid build"); }

  return { score: Math.min(score, 10), disqualifiers: dqs, reasons };
}

export function noActionSuitability(c: ProblemCharacteristics, impact: BusinessImpact): SuitabilityResult {
  const dqs: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  if (impact.strategicImportance === "low") { score += 3; reasons.push("Low expected value relative to other problems"); }
  if (c.ownershipClarity === "unclear") { score += 3; reasons.push("Missing owner — no intervention can land until ownership is resolved"); }
  if (c.volume === "low" && impact.userHoursPerWeek <= 5) { score += 2; reasons.push("Insufficient impact to justify change now"); }
  else if (impact.userHoursPerWeek <= 6) { score += 2; reasons.push("Weekly burden too small to prioritize over higher-impact problems"); }
  if (impact.strategicImportance === "high") { dqs.push("Strategically important — deferring is itself a decision with cost"); }
  if (impact.userHoursPerWeek >= 20) { dqs.push("Weekly burden too large to defer without explicit rationale"); }

  return { score: Math.min(score, 10), disqualifiers: dqs, reasons };
}

// ─── Option builders ─────────────────────────────────────────────────────────

const PATH_LABELS: Record<InterventionPath, string> = {
  ai: "AI-assisted automation",
  deterministic_software: "Deterministic software automation",
  process_redesign: "Process redesign",
  human_work: "Deliberate human ownership",
  hybrid: "Hybrid automation with human oversight",
  no_action_yet: "No intervention yet",
};

function optionFor(
  path: InterventionPath,
  problem: BusinessProblem,
  chars: ProblemCharacteristics,
  suitability: SuitabilityResult,
  evidenceId: string,
): InterventionOption {
  const impact = problem.currentImpact;
  const leverage = (impact.userHoursPerWeek * 52 * 75) / 1000; // rough $k/yr proxy
  const byComplexity: Record<InterventionPath, { costMult: number; weeks: [number, number]; complexity: number; escalation: EscalationRequirement["type"] }> = {
    deterministic_software: { costMult: 1.2, weeks: [4, 8], complexity: 4, escalation: "technical_specialist" },
    process_redesign: { costMult: 0.8, weeks: [3, 6], complexity: 5, escalation: "operations_admin" },
    human_work: { costMult: 0.3, weeks: [1, 2], complexity: 2, escalation: "business_configurable" },
    hybrid: { costMult: 2.2, weeks: [8, 14], complexity: 7, escalation: "software_engineer" },
    ai: { costMult: 2.5, weeks: [10, 18], complexity: 8, escalation: "software_engineer" },
    no_action_yet: { costMult: 0, weeks: [0, 0], complexity: 0, escalation: "business_configurable" },
  };
  const c = byComplexity[path];

  const eligible = suitability.disqualifiers.length === 0 && suitability.score >= 3;
  const confidence = eligible ? Math.min(0.4 + suitability.score * 0.06, 0.95) : 0.2;

  const assumptions: Assumption[] = [];
  if (path === "ai" || path === "hybrid") {
    assumptions.push({ id: `assume-${problem.id}-${path}-data`, statement: "Sufficient historical examples exist to evaluate model quality", confidence: 0.5, evidenceIds: [evidenceId] });
  }
  if (path === "process_redesign") {
    assumptions.push({ id: `assume-${problem.id}-${path}-owner`, statement: "An accountable process owner can be named", confidence: chars.ownershipClarity === "clear" ? 0.8 : 0.4, evidenceIds: [evidenceId] });
  }

  return {
    path,
    summary: `${PATH_LABELS[path]} for: ${problem.title}`,
    expectedImpact: {
      ...impact,
      userHoursPerWeek: Math.round(impact.userHoursPerWeek * (path === "no_action_yet" ? 0 : 0.6) * 10) / 10,
    },
    estimatedCost: {
      initial: Math.round(leverage * c.costMult * 1000),
      monthly: Math.round(leverage * c.costMult * 100),
      yearly: Math.round(leverage * c.costMult * 1000 * 0.2),
      implementationComplexity: c.complexity <= 3 ? "low" : c.complexity <= 6 ? "medium" : "high",
    },
    estimatedTimeToValue: { min: c.weeks[0], max: c.weeks[1], unit: "weeks" },
    implementationComplexity: c.complexity,
    dataReadiness: chars.dataStructure === "structured" ? 8 : chars.dataStructure === "mixed" ? 5 : 3,
    organizationalReadiness: chars.ownershipClarity === "clear" ? 7 : 3,
    technicalRisk: path === "ai" ? 7 : path === "hybrid" ? 6 : path === "deterministic_software" ? 3 : 1,
    operationalRisk: chars.stakes === "high" ? 6 : 3,
    humanJudgmentRequirement: chars.judgmentRequired === "high" ? 8 : 3,
    reversibility: path === "human_work" || path === "no_action_yet" ? 10 : path === "process_redesign" ? 8 : 6,
    confidence,
    assumptions,
    evidenceIds: [evidenceId],
    disqualifiers: suitability.disqualifiers,
    eligible,
    supportingHypothesisIds: [],
    weakeningHypothesisIds: [],
  };
}

function successMetricsFor(problem: BusinessProblem, path: InterventionPath): SuccessMetric[] {
  const base: SuccessMetric[] = [
    {
      name: "Manual hours per week",
      definition: `Weekly human hours spent on: ${problem.title}`,
      targetValue: Math.round(problem.currentImpact.userHoursPerWeek * 0.4),
      unit: "hours",
      measurementFrequency: "weekly",
      successThreshold: problem.currentImpact.userHoursPerWeek * 0.6,
    },
  ];
  if (problem.currentImpact.customerImpactScore >= 6) {
    base.push({
      name: "Customer-facing cycle time",
      definition: "Elapsed time from trigger to resolution",
      targetValue: Math.round(problem.currentImpact.timePerOccurrence * 0.5),
      unit: "minutes",
      measurementFrequency: "weekly",
      successThreshold: problem.currentImpact.timePerOccurrence * 0.7,
    });
  }
  if (path === "process_redesign" || path === "no_action_yet") {
    base.push({
      name: "Ownership resolved",
      definition: "A single accountable owner is named and active",
      targetValue: 1,
      unit: "boolean",
      measurementFrequency: "monthly",
      successThreshold: 1,
    });
  }
  return base;
}

// ─── Public stage API ────────────────────────────────────────────────────────

export async function generateBusinessProblems(
  input: GenerateBusinessProblemsInput,
  _context: PipelineContext,
): Promise<{ problems: BusinessProblem[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const problems = detectProblems(input, evidence);

  // Persist problem characteristics alongside for the option stage.
  const charsByProblem = new Map<string, ProblemCharacteristics>();
  for (const p of problems) {
    // characteristics were attached during detection via template lookup
    const t = (detectProblems as any)._lastTemplates?.find?.((x: ProblemTemplate) => x.id === p.id);
    if (t) charsByProblem.set(p.id, t.characteristics);
  }

  return { problems, evidence };
}

export async function generateInterventionOptions(
  input: GenerateInterventionOptionsInput & {
    characteristics?: Map<string, ProblemCharacteristics>;
    sufficiencies?: Map<string, EvidenceSufficiency>;
    followUpQuestions?: Map<string, FollowUpQuestion[]>;
    deferredProblems?: string[];
  },
  _context: PipelineContext,
): Promise<{ interventions: RecommendedIntervention[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const interventions: RecommendedIntervention[] = [];
  const sufficiencies = input.sufficiencies ?? new Map();
  const followUpQuestions = input.followUpQuestions ?? new Map();
  const deferredProblems = new Set(input.deferredProblems ?? []);

  for (const problem of input.problems) {
    const chars = (input.characteristics?.get(problem.id)) ?? deriveCharacteristics(problem);
    const impact = problem.currentImpact;
    const sufficiency = sufficiencies.get(problem.id) ?? evaluateDefaultSufficiency(problem);

    // Priority 5: Gate intervention comparison on evidence sufficiency.
    // If evidence is insufficient, produce a deferred intervention instead
    // of a false-confidence recommendation.
    if (deferredProblems.has(problem.id) || !sufficiency.recommendationAllowed) {
      const fq = followUpQuestions.get(problem.id) ?? [];
      interventions.push({
        problemId: problem.id,
        selectedPath: "no_action_yet",
        comparedOptions: [],
        reasonsSelected: ["Recommendation deferred — insufficient evidence to compare intervention paths"],
        reasonsAlternativesRejected: [],
        confidence: 0,
        successMetrics: [],
        escalationRequirements: [],
        evidenceSufficiency: sufficiency,
        deferredDueToInsufficientEvidence: true,
        followUpQuestions: fq,
      });
      continue;
    }

    const suits: Array<[InterventionPath, SuitabilityResult]> = [
      ["ai", aiSuitability(chars)],
      ["deterministic_software", deterministicSuitability(chars)],
      ["process_redesign", processRedesignSuitability(chars)],
      ["human_work", humanWorkSuitability(chars)],
      ["hybrid", hybridSuitability(chars)],
      ["no_action_yet", noActionSuitability(chars, impact)],
    ];

    const evidenceId = `det-compare-${problem.id}`;
    evidence.push({
      id: evidenceId,
      type: "deterministic_derivation",
      evidenceClass: "Deterministic",
      sourceLabel: `Intervention comparison: ${problem.title}`,
      content: suits.map(([p, s]) => `${p}=${s.score}${s.disqualifiers.length ? " (DQ: " + s.disqualifiers.join("; ") + ")" : ""}`).join(", "),
      confidence: 0.85,
      reliability: 0.9,
      metadata: { engineVersion: INTERVENTION_ENGINE_VERSION },
    });

    const supportingHypothesisIds = problem.rootCauseHypotheses
      .filter((h) => h.supportingEvidenceIds.some((eid) => eid.includes(problem.id)))
      .map((h) => h.id);
    const weakeningHypothesisIds = problem.rootCauseHypotheses
      .filter((h) => h.weakeningEvidenceIds.some((eid) => eid.includes(problem.id)))
      .map((h) => h.id);

    const options = suits.map(([path, s]) => ({
      ...optionFor(path, problem, chars, s, evidenceId),
      supportingHypothesisIds,
      weakeningHypothesisIds,
    }));

    // Deterministic selection: highest suitability among eligible; prefer the
    // simplest (lowest implementation complexity) when scores tie.
    const eligible = options.filter((o) => o.eligible);
    eligible.sort((a, b) => {
      const sa = suits.find(([p]) => p === a.path)![1].score;
      const sb = suits.find(([p]) => p === b.path)![1].score;
      if (sb !== sa) return sb - sa;
      return a.implementationComplexity - b.implementationComplexity;
    });

    const selected = eligible[0] ?? options.find((o) => o.path === "no_action_yet")!;
    const selectedSuit = suits.find(([p]) => p === selected.path)![1];

    const reasonsSelected: string[] = [
      ...selectedSuit.reasons,
      `Highest suitability score (${selectedSuit.score}/10) among eligible paths`,
    ];
    const rejections: AlternativeRejection[] = options
      .filter((o) => o.path !== selected.path)
      .map((o) => {
        const s = suits.find(([p]) => p === o.path)![1];
        return {
          path: o.path,
          primaryReason: s.disqualifiers[0] ?? `Lower suitability (${s.score}/10) than ${selected.path} (${selectedSuit.score}/10)`,
          secondaryReasons: [...s.disqualifiers.slice(1), ...(o.eligible ? [] : ["Not eligible under current evidence"])],
          evidenceIds: [evidenceId],
        };
      });

    const escalation: EscalationRequirement[] = [{
      type: selected.path === "ai" || selected.path === "hybrid" ? "software_engineer"
        : selected.path === "deterministic_software" ? "technical_specialist"
        : selected.path === "process_redesign" ? "operations_admin"
        : "business_configurable",
      description: `Implementing ${PATH_LABELS[selected.path]} requires this expertise level`,
      triggerConditions: chars.regulatoryAccountability ? ["Regulatory review required before rollout"] : [],
    }];
    if (chars.regulatoryAccountability) {
      escalation.push({ type: "security_or_legal_review", description: "Regulatory accountability requires legal/compliance sign-off", triggerConditions: ["Any change to judgment criteria"] });
    }

    interventions.push({
      problemId: problem.id,
      selectedPath: selected.path,
      comparedOptions: options,
      reasonsSelected,
      reasonsAlternativesRejected: rejections,
      confidence: selected.confidence,
      successMetrics: successMetricsFor(problem, selected.path),
      escalationRequirements: escalation,
      evidenceSufficiency: sufficiency,
      deferredDueToInsufficientEvidence: false,
      followUpQuestions: followUpQuestions.get(problem.id) ?? [],
    });
  }

  return { interventions, evidence };
}

function evaluateDefaultSufficiency(problem: BusinessProblem): EvidenceSufficiency {
  return {
    status: problem.rootCauseHypotheses.length > 0 ? "partial" : "insufficient",
    score: problem.rootCauseHypotheses.length > 0 ? 0.5 : 0,
    recommendationAllowed: problem.rootCauseHypotheses.length > 0,
    missingCriticalEvidence: problem.rootCauseHypotheses.length === 0 ? ["No root cause hypotheses generated"] : [],
    hypothesisConfidenceGaps: problem.rootCauseHypotheses
      .filter((h) => h.supportingEvidenceIds.length < 1)
      .map((h) => ({
        hypothesisId: h.id,
        currentConfidence: 0,
        minimumConfidence: 0.4,
        missingEvidenceCategories: [h.category],
      })),
  };
}

function deriveCharacteristics(problem: BusinessProblem): ProblemCharacteristics {
  // Fallback for problems constructed outside the template catalogue.
  return {
    dataStructure: "mixed", ruleStability: "stable", ambiguity: "low",
    volume: "medium", stakes: "medium", judgmentRequired: "low",
    ownershipClarity: "clear", processMaturity: "ad_hoc",
    errorTolerance: "high", exceptionVolume: "low",
    empathyRequired: false, regulatoryAccountability: false,
  };
}

// Expose template characteristics for the pipeline to thread through.
export function getTemplateCharacteristics(): Map<string, ProblemCharacteristics> {
  return TEMPLATE_CHARS;
}

const TEMPLATE_CHARS = new Map<string, ProblemCharacteristics>([
  ["problem-sales-qualification", { dataStructure: "structured", ruleStability: "stable", ambiguity: "low", volume: "high", stakes: "medium", judgmentRequired: "low", ownershipClarity: "clear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "low", empathyRequired: false, regulatoryAccountability: false }],
  ["problem-marketing-reporting", { dataStructure: "structured", ruleStability: "stable", ambiguity: "low", volume: "medium", stakes: "low", judgmentRequired: "low", ownershipClarity: "clear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "low", empathyRequired: false, regulatoryAccountability: false }],
  ["problem-cs-reactive", { dataStructure: "mixed", ruleStability: "changing", ambiguity: "high", volume: "medium", stakes: "high", judgmentRequired: "high", ownershipClarity: "clear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "high", empathyRequired: true, regulatoryAccountability: false }],
  ["problem-support-triage", { dataStructure: "unstructured", ruleStability: "changing", ambiguity: "high", volume: "high", stakes: "medium", judgmentRequired: "low", ownershipClarity: "clear", processMaturity: "documented", errorTolerance: "high", exceptionVolume: "high", empathyRequired: true, regulatoryAccountability: false }],
  ["problem-finance-close", { dataStructure: "structured", ruleStability: "stable", ambiguity: "low", volume: "high", stakes: "high", judgmentRequired: "low", ownershipClarity: "clear", processMaturity: "documented", errorTolerance: "low", exceptionVolume: "low", empathyRequired: false, regulatoryAccountability: true }],
  ["problem-product-feedback", { dataStructure: "unstructured", ruleStability: "changing", ambiguity: "high", volume: "medium", stakes: "medium", judgmentRequired: "high", ownershipClarity: "unclear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "high", empathyRequired: false, regulatoryAccountability: false }],
  ["problem-engineering-docs", { dataStructure: "unstructured", ruleStability: "changing", ambiguity: "high", volume: "low", stakes: "high", judgmentRequired: "high", ownershipClarity: "unclear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "high", empathyRequired: false, regulatoryAccountability: false }],
  ["problem-hr-screening", { dataStructure: "unstructured", ruleStability: "stable", ambiguity: "high", volume: "medium", stakes: "medium", judgmentRequired: "high", ownershipClarity: "clear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "high", empathyRequired: true, regulatoryAccountability: true }],
  ["problem-legal-review", { dataStructure: "unstructured", ruleStability: "stable", ambiguity: "low", volume: "low", stakes: "high", judgmentRequired: "high", ownershipClarity: "clear", processMaturity: "documented", errorTolerance: "low", exceptionVolume: "low", empathyRequired: false, regulatoryAccountability: true }],
  ["problem-ops-ownership", { dataStructure: "structured", ruleStability: "changing", ambiguity: "high", volume: "medium", stakes: "medium", judgmentRequired: "high", ownershipClarity: "unclear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "high", empathyRequired: false, regulatoryAccountability: false }],
  ["problem-approval-chain", { dataStructure: "structured", ruleStability: "stable", ambiguity: "low", volume: "medium", stakes: "medium", judgmentRequired: "low", ownershipClarity: "unclear", processMaturity: "ad_hoc", errorTolerance: "high", exceptionVolume: "low", empathyRequired: false, regulatoryAccountability: false }],
]);
