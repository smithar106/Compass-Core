// Stage: Root Cause Analysis (Priority 1)
// A problem may have multiple possible causes. Generate hypotheses before
// collecting evidence. Never assume the first hypothesis is correct.

import type {
  BusinessProblem,
  RootCauseHypothesis,
  EvidenceRecord,
  PipelineContext,
} from "../types/index.js";
import { PIPELINE_VERSION as REASONING_PIPELINE_VERSION } from "../types/index.js";

export interface RootCauseAnalysisInput {
  problems: BusinessProblem[];
  answers: Array<{ questionId: number; value: string | number | boolean; type: string; wasSkipped: boolean }>;
  workflowSignals: any;
  evidence: EvidenceRecord[];
}

// ─── Hypothesis templates per problem type ───────────────────────────────────
// Each problem type maps to common root cause categories. Deterministic
// generation from assessment signals.

const HYPOTHESIS_CATALOGUE: Record<string, Array<{
  title: string;
  description: string;
  category: RootCauseHypothesis["category"];
  triggerCheck?: (answers: Map<number, any>, signals: any) => boolean;
  source: RootCauseHypothesis["source"];
}>> = {
  "problem-sales-qualification": [
    { title: "Inconsistent qualification criteria across team", description: "Sales reps apply different standards when qualifying leads, leading to variable conversion rates", category: "process", source: "assessment_signal" },
    { title: "Insufficient lead enrichment data at capture time", description: "CRM lacks the fields needed to make a quick qualification decision", category: "data", source: "assessment_signal" },
    { title: "No formal qualification rubric or scorecard exists", description: "Without a documented framework, qualification is ad-hoc and unrepeatable", category: "process", source: "assessment_signal" },
    { title: "Lead routing to the wrong rep type", description: "SDR/AE split is unclear; leads bounce between teams", category: "people", source: "inference" },
  ],
  "problem-support-triage": [
    { title: "Agents spend excessive time on after-call work", description: "Wrap-up tasks consume more time than the actual interaction", category: "process", source: "assessment_signal" },
    { title: "Self-service knowledge base does not cover common issues", description: "Customers cannot resolve issues without contacting support", category: "technology", source: "assessment_signal" },
    { title: "Ticket categorization rules are missing or stale", description: "Auto-routing fails because category rules are out of date", category: "process", source: "inference" },
    { title: "Peak call volume exceeds agent capacity", description: "Scheduling does not align with demand patterns", category: "people", source: "inference" },
    { title: "Agents lack visibility into customer history during call", description: "CRM integration gaps force agents to ask redundant questions", category: "technology", source: "inference" },
  ],
  "problem-cs-reactive": [
    { title: "No automated health score combining usage and support data", description: "CSMs must manually evaluate accounts without aggregated signals", category: "technology", source: "assessment_signal" },
    { title: "CSM-to-account ratio too high for proactive outreach", description: "Each CSM manages too many accounts to provide individual attention", category: "people", source: "inference" },
    { title: "Renewal reminders trigger too late in the cycle", description: "Contract end dates are not visible early enough for intervention", category: "process", source: "inference" },
    { title: "Customer usage data is not surfaced to the CS team", description: "Product analytics exist but are not shared with CS", category: "data", source: "inference" },
  ],
  "problem-finance-close": [
    { title: "Invoice data entry is manual with no OCR", description: "AP staff manually key invoice data from scanned documents", category: "process", source: "assessment_signal" },
    { title: "Approval workflow requires redundant sign-offs", description: "Multiple approvers review the same invoice independently", category: "process", source: "assessment_signal" },
    { title: "ERP integration gaps delay reconciliation", description: "Systems do not talk to each other; reconciliation is a manual spreadsheet exercise", category: "technology", source: "inference" },
    { title: "Month-end close checklist or playbook is undocumented", description: "Close steps are tribal knowledge; nothing is written down", category: "process", source: "inference" },
  ],
  "problem-legal-review": [
    { title: "Every contract reviewed from scratch with no playbook", description: "Legal has no standard redlines or fallback positions", category: "process", source: "assessment_signal" },
    { title: "Standard contracts lack self-serve portal", description: "Every NDA/MSA goes through legal because there is no template self-serve option", category: "technology", source: "inference" },
    { title: "Regulatory change monitoring is manual", description: "Legal manually tracks regulation changes rather than using an automated feed", category: "process", source: "assessment_signal" },
  ],
  "problem-approval-chain": [
    { title: "No documented approval authority matrix", description: "Anyone can require approval, so everyone does", category: "process", source: "assessment_signal" },
    { title: "Approval stages grew organically without review", description: "Stages added one at a time; no one has ever audited the chain", category: "process", source: "inference" },
    { title: "Managers fear delegating approval authority", description: "Cultural concern about being held accountable for delegated decisions", category: "people", source: "inference" },
  ],
  "problem-ops-ownership": [
    { title: "No single accountable owner for the workflow", description: "Responsibility is distributed across roles with no primary decision-maker", category: "people", source: "assessment_signal" },
    { title: "Workflow was never formally designed", description: "The process evolved as a series of workarounds rather than intentional design", category: "process", source: "assessment_signal" },
    { title: "Tools were adopted independently without integration", description: "Each team chose its own tools; cross-team flow is manual", category: "technology", source: "inference" },
  ],
  "problem-product-feedback": [
    { title: "Feedback collected in too many channels with no consolidation", description: "User feedback lives in Slack, email, support tickets, and calls with no single source of truth", category: "process", source: "assessment_signal" },
    { title: "No systematic prioritization framework", description: "Roadmap decisions are made by whoever advocates loudest", category: "process", source: "assessment_signal" },
    { title: "Product analytics insufficient to validate feedback signals", description: "No usage data exists to weigh feedback against actual behavior", category: "data", source: "inference" },
  ],
  "problem-engineering-docs": [
    { title: "No documentation standard or review process", description: "Engineers write docs (or not) however they choose", category: "process", source: "assessment_signal" },
    { title: "Documentation is treated as optional, not a deliverable", description: "Story points do not include documentation; it is cut first", category: "people", source: "inference" },
    { title: "No single source of truth exists for system architecture", description: "Architecture knowledge is scattered across multiple wikis and individual memories", category: "process", source: "inference" },
  ],
  "problem-hr-screening": [
    { title: "No applicant tracking system in place", description: "Resumes arrive via email with no structured pipeline", category: "technology", source: "assessment_signal" },
    { title: "Screening criteria are not documented", description: "Each recruiter applies different heuristics", category: "process", source: "inference" },
    { title: "Volume fluctuates with no capacity buffer", description: "Spikes in applications create backlogs", category: "people", source: "inference" },
  ],
  "problem-marketing-reporting": [
    { title: "Data lives in silos across channel-specific tools", description: "Each channel exports a different format", category: "data", source: "assessment_signal" },
    { title: "No unified attribution model agreed across teams", description: "Sales and marketing disagree on which touches drive revenue", category: "process", source: "assessment_signal" },
    { title: "Report compilation is manual because no dashboard exists", description: "Scripts and manual queries are required for every reporting cycle", category: "technology", source: "inference" },
  ],
};

export async function generateRootCauseHypotheses(
  input: RootCauseAnalysisInput,
  _context: PipelineContext,
): Promise<{ problems: BusinessProblem[]; evidence: EvidenceRecord[] }> {
  const evidence: EvidenceRecord[] = [...input.evidence];
  const answerMap = new Map(input.answers.map((a) => [a.questionId, a]));

  const mergedProblems = mergeDuplicateProblems(input.problems, evidence);

  for (const problem of mergedProblems) {
    const templates = HYPOTHESIS_CATALOGUE[problem.id] ?? [];
    const hypotheses: RootCauseHypothesis[] = [];

    for (const t of templates) {
      const id = `hyp-${problem.id}-${hypotheses.length + 1}`;
      const ev: EvidenceRecord = {
        id,
        type: "explicit_hypothesis",
        evidenceClass: "Inference",
        sourceLabel: `Hypothesis: ${t.title}`,
        content: t.description,
        confidence: 0.5,
        reliability: 0.6,
        metadata: { hypothesisCategory: t.category, source: t.source },
      };
      evidence.push(ev);

      hypotheses.push({
        id,
        problemId: problem.id,
        title: t.title,
        description: t.description,
        category: t.category,
        likelihood: "medium",
        supportingEvidenceIds: [id],
        weakeningEvidenceIds: [],
        source: t.source,
      });
    }

    problem.rootCauseHypotheses = hypotheses;
  }

  return { problems: mergedProblems, evidence };
}

// ─── Priority 4: Merge duplicate problems ────────────────────────────────────
// Multiple assessment signals may point to the same underlying problem.
// Detect and merge instead of creating separate entries.

function mergeDuplicateProblems(problems: BusinessProblem[], evidence: EvidenceRecord[]): BusinessProblem[] {
  const merged = new Map<string, BusinessProblem>();
  const duplicationMap: Record<string, string[]> = {};

  const toRemove = new Set<string>();

  for (const problem of problems) {
    const duplicates = duplicationMap[problem.id] ?? [];
    const isDuplicate = problems.some((p) => p.id !== problem.id && duplicates.includes(p.id));

    if (isDuplicate) {
      const primaryId = duplicates[0];
      toRemove.add(problem.id);

      if (merged.has(primaryId)) {
        const primary = merged.get(primaryId)!;
        primary.mergedSignalIds.push(...problem.evidenceIds);
        primary.evidenceIds = [...new Set([...primary.evidenceIds, ...problem.evidenceIds])];
        primary.currentImpact = {
          ...primary.currentImpact,
          userHoursPerWeek: Math.max(primary.currentImpact.userHoursPerWeek, problem.currentImpact.userHoursPerWeek),
          cost: Math.max(primary.currentImpact.cost, problem.currentImpact.cost),
        };
      }
    } else {
      merged.set(problem.id, { ...problem, mergedSignalIds: [] });
    }
  }

  return Array.from(merged.values());
}
