// Stage: Evidence Analysis + Sufficiency (Priority 2)
// After hypotheses are generated, collect evidence and determine whether we
// know enough to recommend an intervention. If not, generate follow-up
// questions that maximize information gain.

import type {
  BusinessProblem,
  EvidenceRecord,
  EvidenceSufficiency,
  FollowUpQuestion,
  PipelineContext,
} from "../types/index.js";
import { REASONING_PIPELINE_VERSION } from "../types/index.js";

export interface EvidenceAnalysisInput {
  problems: BusinessProblem[];
  answers: Array<{ questionId: number; value: string | number | boolean; type: string; wasSkipped: boolean }>;
  evidence: EvidenceRecord[];
}

// ─── Evidence sufficiency evaluation ─────────────────────────────────────────
// For each problem, evaluate whether enough evidence exists for each hypothesis
// to make an informed intervention recommendation. If critical evidence is
// missing, return insufficient.

export function evaluateEvidenceSufficiency(
  problem: BusinessProblem,
  hypotheses: BusinessProblem["rootCauseHypotheses"],
): EvidenceSufficiency {
  const gaps: EvidenceSufficiency["hypothesisConfidenceGaps"] = [];
  let supportedCount = 0;

  for (const h of hypotheses) {
    const supportingWeight = h.supportingEvidenceIds.length;
    const weakeningWeight = h.weakeningEvidenceIds.length;
    const netConfidence = Math.min((supportingWeight - weakeningWeight) / 3, 1);
    const minConfidence = 0.25;

    if (netConfidence < minConfidence) {
      gaps.push({
        hypothesisId: h.id,
        currentConfidence: netConfidence,
        minimumConfidence: minConfidence,
        missingEvidenceCategories: [h.category],
      });
    } else {
      supportedCount++;
    }
  }

  const totalHypotheses = hypotheses.length;
  const score = totalHypotheses > 0 ? supportedCount / totalHypotheses : 0;
  const missingCritical: string[] = gaps.map((g) => `Insufficient evidence for hypothesis: ${g.hypothesisId}`);

  let status: EvidenceSufficiency["status"];
  let recommendationAllowed: boolean;

  if (totalHypotheses === 0) {
    status = "insufficient";
    recommendationAllowed = false;
    missingCritical.push("No root cause hypotheses generated");
  } else if (score < 0.2) {
    status = "insufficient";
    recommendationAllowed = false;
  } else if (score < 0.5) {
    status = "partial";
    recommendationAllowed = true;
  } else {
    status = "sufficient";
    recommendationAllowed = true;
  }

  return {
    status,
    score,
    recommendationAllowed,
    missingCriticalEvidence: missingCritical,
    hypothesisConfidenceGaps: gaps,
  };
}

// ─── Follow-up questions ─────────────────────────────────────────────────────
// Identify what information would most change the recommendation. Prioritize
// questions by information gain.

export function generateFollowUpQuestions(
  problem: BusinessProblem,
  sufficiency: EvidenceSufficiency,
  evidence: EvidenceRecord[],
): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = [];
    const existingEvidenceSources = new Set(evidence.map((e) => e.sourceLabel.slice(0, 30)));
  // If insufficient evidence, ask targeted questions per hypothesis gap.
  for (const gap of sufficiency.hypothesisConfidenceGaps) {
    const hypothesis = problem.rootCauseHypotheses.find((h) => h.id === gap.hypothesisId);
    if (!hypothesis) continue;

    switch (hypothesis.category) {
      case "people": {
        if (!existingEvidenceSources.has("headcount")) {
          questions.push({
            id: `fq-${problem.id}-people-1`,
            question: `How many full-time employees currently work on ${problem.workflow}?`,
            category: "people",
            reason: "Headcount determines whether understaffing is a viable hypothesis",
            expectedAnswerType: "number",
            priority: 1,
            affectsHypotheses: [hypothesis.id],
            estimatedInformationGain: "high",
          });
        }
        if (!existingEvidenceSources.has("task duration")) {
          questions.push({
            id: `fq-${problem.id}-people-2`,
            question: `What is the average time per ${problem.workflow} task?`,
            category: "people",
            reason: "Task duration helps distinguish between insufficient capacity and slow process",
            expectedAnswerType: "text",
            priority: 2,
            affectsHypotheses: [hypothesis.id],
            estimatedInformationGain: "medium",
          });
        }
        break;
      }
      case "process": {
        questions.push({
          id: `fq-${problem.id}-process-1`,
          question: `Is the current ${problem.workflow} documented in a Standard Operating Procedure (SOP)?`,
          category: "process",
          reason: "If no SOP exists, process standardization should precede any automation investment",
          expectedAnswerType: "boolean",
          priority: 1,
          affectsHypotheses: [hypothesis.id],
          estimatedInformationGain: "high",
        });
        if (!existingEvidenceSources.has("approval count")) {
          questions.push({
            id: `fq-${problem.id}-process-2`,
            question: `How many approval stages are in the current ${problem.workflow}?`,
            category: "process",
            reason: "Approval count directly correlates with cycle time and rework",
            expectedAnswerType: "number",
            priority: 2,
            affectsHypotheses: [hypothesis.id],
            estimatedInformationGain: "medium",
          });
        }
        break;
      }
      case "technology": {
        questions.push({
          id: `fq-${problem.id}-tech-1`,
          question: `What tools or systems currently support ${problem.workflow}?`,
          category: "technology",
          reason: "Tool inventory determines integration feasibility and build vs. configure decision",
          expectedAnswerType: "text",
          priority: 1,
          affectsHypotheses: [hypothesis.id],
          estimatedInformationGain: "high",
        });
        break;
      }
      case "data": {
        questions.push({
          id: `fq-${problem.id}-data-1`,
          question: `Is the data needed to ${problem.desiredOutcome} currently available in a structured format?`,
          category: "data",
          reason: "Data readiness is the single strongest predictor of automation success",
          expectedAnswerType: "boolean",
          priority: 1,
          affectsHypotheses: [hypothesis.id],
          estimatedInformationGain: "high",
        });
        break;
      }
      case "policy": {
        questions.push({
          id: `fq-${problem.id}-policy-1`,
          question: `Is there a regulatory or compliance requirement that constrains how ${problem.workflow} can change?`,
          category: "policy",
          reason: "Regulatory constraints can disqualify entire intervention paths regardless of technical feasibility",
          expectedAnswerType: "boolean",
          priority: 1,
          affectsHypotheses: [hypothesis.id],
          estimatedInformationGain: "high",
        });
        break;
      }
      case "external": {
        questions.push({
          id: `fq-${problem.id}-ext-1`,
          question: `Are there external factors (vendor dependencies, contractual obligations) affecting ${problem.workflow}?`,
          category: "policy",
          reason: "External constraints may limit available intervention paths",
          expectedAnswerType: "text",
          priority: 1,
          affectsHypotheses: [hypothesis.id],
          estimatedInformationGain: "medium",
        });
        break;
      }
    }
  }

  // Deduplicate by question text
  const seen = new Set<string>();
  return questions.filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  }).slice(0, 5); // Max 5 follow-ups to avoid overwhelming the user
}

export async function analyzeEvidenceSufficiency(
  input: EvidenceAnalysisInput,
  _context: PipelineContext,
): Promise<{
  problems: BusinessProblem[];
  sufficiencies: Map<string, EvidenceSufficiency>;
  followUpQuestions: Map<string, FollowUpQuestion[]>;
  evidence: EvidenceRecord[];
  deferredProblems: string[];
}> {
  const problems = input.problems;
  const sufficiencies = new Map<string, EvidenceSufficiency>();
  const followUpQuestions = new Map<string, FollowUpQuestion[]>();
  const deferredProblems: string[] = [];

  for (const problem of problems) {
    const sufficiency = evaluateEvidenceSufficiency(problem, problem.rootCauseHypotheses);
    sufficiencies.set(problem.id, sufficiency);

    const questions = generateFollowUpQuestions(problem, sufficiency, input.evidence);
    followUpQuestions.set(problem.id, questions);

    if (!sufficiency.recommendationAllowed) {
      deferredProblems.push(problem.id);
    }
  }

  return {
    problems,
    sufficiencies,
    followUpQuestions,
    evidence: input.evidence,
    deferredProblems,
  };
}
