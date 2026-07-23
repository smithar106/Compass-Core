import { loadAssessment } from "./stages/01-load-assessment.js";
import { buildCompanyContext } from "./stages/02-build-company-context.js";
import { normalizeWorkflowSignals } from "./stages/03-normalize-workflow.js";
import { generateBusinessProblems, generateInterventionOptions, getTemplateCharacteristics } from "./stages/03-intervention-planning.js";
import { generateRootCauseHypotheses } from "./stages/03-root-cause-analysis.js";
import { analyzeEvidenceSufficiency } from "./stages/04-evidence-analysis.js";
import { generateOpportunityCandidates } from "./stages/04-generate-candidates.js";
import { rankOpportunities } from "./stages/05-rank-opportunities.js";
import { rankInterventions } from "./stages/05-rank-interventions.js";
import { buildEvidenceTraces } from "./stages/06-build-evidence.js";
import { generateExplanations } from "./stages/07-generate-explanations.js";
import { persistOpportunityMap } from "./stages/08-persist.js";
import { createLogger } from "./stages/pipeline-log.js";
import {
  INTERVENTION_ENGINE_VERSION,
  PRIORITIZATION_VERSION,
  REASONING_PIPELINE_VERSION,
} from "./types/index.js";
import type { PipelineContext, OpportunityMap, RunAssessmentInput } from "./types/index.js";

export const PIPELINE_VERSION = "2.1.0";
export const ALGORITHM_VERSION = PRIORITIZATION_VERSION;
export { INTERVENTION_ENGINE_VERSION, PRIORITIZATION_VERSION, REASONING_PIPELINE_VERSION };
export const PROMPT_VERSIONS = {
  company_intelligence: "1.0.0",
  opportunity_explanation: "1.0.0",
  intervention_explanation: "1.0.0",
};

const PIPELINE_STAGE_NAMES: string[] = [
  "load_assessment",
  "build_company_context",
  "normalize_workflow_signals",
  "generate_business_problems",
  "root_cause_analysis",
  "evidence_sufficiency",
  "intervention_comparison",
  "rank_interventions",
  "build_evidence_traces",
  "generate_explanations",
  "persist_opportunity_map",
];

export async function runAssessment(input: RunAssessmentInput, supabase: any): Promise<OpportunityMap> {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = new Date().toISOString();
  const stageDurations: Record<string, number> = {};
  const logs: Array<{ stage: string; message: string; data?: Record<string, unknown> }> = [];
  const pipeLogger = createLogger(requestId);

  const context: PipelineContext = {
    sessionId: input.sessionId,
    userId: input.userId,
    organizationId: input.organizationId,
    startedAt,
    requestId,
    supabase,
    log: (stage, message, data?) => {
      const entry = { stage, message, data, timestamp: new Date().toISOString() };
      logs.push(entry);
      try {
        console.log(JSON.stringify({ ...entry, requestId }));
      } catch {} // Silently handle logging failures (e.g., in non-Node environments)
    },
  };

  context.log("pipeline", "Starting reasoned pipeline run", {
    pipelineVersion: PIPELINE_VERSION,
    reasoningPipelineVersion: REASONING_PIPELINE_VERSION,
    interventionEngineVersion: INTERVENTION_ENGINE_VERSION,
    prioritizationVersion: PRIORITIZATION_VERSION,
    sessionId: input.sessionId,
  });

  let currentEvidence: any[] = [];
  let currentProblems: any[] = [];

  const baseRunRecord = {
    pipelineVersion: PIPELINE_VERSION,
    interventionEngineVersion: INTERVENTION_ENGINE_VERSION,
    prioritizationVersion: PRIORITIZATION_VERSION,
    promptVersions: PROMPT_VERSIONS,
    algorithmVersion: ALGORITHM_VERSION,
    modelIdentifiers: { deterministic: "none" },
    timestamps: { startedAt, completedAt: "" },
    duration: 0,
    stageDurations,
    inputReferences: [input.sessionId],
    outputReferences: [] as string[],
    errorState: null as string | null,
    retryCount: 0,
  };

  try {
    // Stage 1: Load assessment
    pipeLogger.startStage("load_assessment", input.sessionId.length);
    let start = Date.now();
    const assessment = await loadAssessment({ sessionId: input.sessionId }, context);
    stageDurations.load_assessment = Date.now() - start;
    currentEvidence = assessment.evidence;
    pipeLogger.completeStage("load_assessment", assessment.answers.length);

    // Stage 2: Build company context
    pipeLogger.startStage("build_company_context", currentEvidence.length);
    start = Date.now();
    const companyResult = await buildCompanyContext(
      { answers: assessment.answers, evidence: currentEvidence },
      context
    );
    stageDurations.build_company_context = Date.now() - start;
    currentEvidence = companyResult.evidence;
    pipeLogger.completeStage("build_company_context", companyResult.company.companySummary.length);

    // Stage 3: Normalize workflow signals
    pipeLogger.startStage("normalize_workflow_signals", currentEvidence.length);
    start = Date.now();
    const workflowResult = await normalizeWorkflowSignals(
      { answers: assessment.answers, company: companyResult.company, evidence: currentEvidence },
      context
    );
    stageDurations.normalize_workflow_signals = Date.now() - start;
    currentEvidence = workflowResult.evidence;
    pipeLogger.completeStage("normalize_workflow_signals", workflowResult.signals.painPoints.length);

    // Stage 4: Generate business problems from signals
    pipeLogger.startStage("generate_business_problems", workflowResult.signals.painPoints.length);
    start = Date.now();
    const problemResult = await generateBusinessProblems(
      { answers: assessment.answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: currentEvidence },
      context
    );
    stageDurations.generate_business_problems = Date.now() - start;
    currentEvidence = problemResult.evidence;
    currentProblems = problemResult.problems;
    pipeLogger.completeStage("generate_business_problems", problemResult.problems.length, {
      problemIds: problemResult.problems.map((p: any) => p.id),
    });

    // Stage 5: Root cause analysis — generate hypotheses, merge duplicates
    pipeLogger.startStage("root_cause_analysis", problemResult.problems.length);
    start = Date.now();
    const rootCauseResult = await generateRootCauseHypotheses(
      { problems: problemResult.problems, answers: assessment.answers, workflowSignals: workflowResult.signals, evidence: currentEvidence },
      context
    );
    stageDurations.root_cause_analysis = Date.now() - start;
    currentEvidence = rootCauseResult.evidence;
    currentProblems = rootCauseResult.problems;
    pipeLogger.completeStage("root_cause_analysis", currentProblems.length, {
      totalHypotheses: currentProblems.reduce((sum: number, p: any) => sum + (p.rootCauseHypotheses?.length ?? 0), 0),
    });

    // Stage 6: Evidence sufficiency — can we recommend yet?
    pipeLogger.startStage("evidence_sufficiency", currentProblems.length);
    start = Date.now();
    const evidenceResult = await analyzeEvidenceSufficiency(
      { problems: currentProblems, answers: assessment.answers, evidence: currentEvidence },
      context
    );
    stageDurations.evidence_sufficiency = Date.now() - start;
    pipeLogger.completeStage("evidence_sufficiency", evidenceResult.deferredProblems.length, {
      deferredCount: evidenceResult.deferredProblems.length,
      sufficiencyStatuses: Array.from(evidenceResult.sufficiencies.entries()).map(([k, v]) => `${k}=${v.status}`),
    });

    // Stage 7: Intervention comparison (gated on evidence sufficiency)
    pipeLogger.startStage("intervention_comparison", currentProblems.length);
    start = Date.now();
    const interventionResult = await generateInterventionOptions(
      {
        problems: currentProblems,
        answers: assessment.answers,
        workflowSignals: workflowResult.signals,
        evidence: currentEvidence,
        characteristics: getTemplateCharacteristics(),
        sufficiencies: evidenceResult.sufficiencies,
        followUpQuestions: evidenceResult.followUpQuestions,
        deferredProblems: evidenceResult.deferredProblems,
      },
      context
    );
    stageDurations.intervention_comparison = Date.now() - start;
    currentEvidence = interventionResult.evidence;
    pipeLogger.completeStage("intervention_comparison", interventionResult.interventions.length, {
      deferredCount: interventionResult.interventions.filter((i: any) => i.deferredDueToInsufficientEvidence).length,
      recommendedCount: interventionResult.interventions.filter((i: any) => !i.deferredDueToInsufficientEvidence).length,
    });

    // Stage 7b: Legacy opportunity candidates (compatibility adapter)
    start = Date.now();
    const candidateResult = await generateOpportunityCandidates(
      { answers: assessment.answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: currentEvidence },
      context
    );
    stageDurations.generate_candidates = Date.now() - start;
    currentEvidence = candidateResult.evidence;

    // Stage 8: Rank opportunities (legacy, retained for compatibility)
    start = Date.now();
    const rankingResult = await rankOpportunities(
      { candidates: candidateResult.candidates, answers: assessment.answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: currentEvidence },
      context
    );
    stageDurations.rank_opportunities = Date.now() - start;
    currentEvidence = rankingResult.evidence;

    // Stage 9: Rank interventions (four_pass_v2)
    pipeLogger.startStage("rank_interventions", interventionResult.interventions.length);
    start = Date.now();
    const interventionRankingResult = await rankInterventions(
      {
        problems: currentProblems,
        interventions: interventionResult.interventions,
        workflowSignals: workflowResult.signals,
        evidence: currentEvidence,
      },
      context
    );
    stageDurations.rank_interventions = Date.now() - start;
    currentEvidence = interventionRankingResult.evidence;
    pipeLogger.completeStage("rank_interventions", interventionRankingResult.ranked.length, {
      tiers: interventionRankingResult.ranked.map((r: any) => `tier${r.tier}`),
    });

    // Stage 10: Build evidence traces
    start = Date.now();
    const evidenceTracesResult = await buildEvidenceTraces(
      { ranked: rankingResult.ranked, evidence: currentEvidence },
      context
    );
    stageDurations.build_evidence_traces = Date.now() - start;
    currentEvidence = evidenceTracesResult.evidence;

    // Stage 11: Generate explanations + Opportunity Map
    start = Date.now();
    const explanationResult = await generateExplanations({
      companySummary: companyResult.company.companySummary,
      ranked: evidenceTracesResult.opportunities,
      rankedInterventions: interventionRankingResult.ranked,
      evidence: currentEvidence,
      sessionId: input.sessionId,
      pipelineVersion: PIPELINE_VERSION,
      stageDurations,
      runRecord: baseRunRecord,
    }, context);
    stageDurations.generate_explanations = Date.now() - start;
    currentEvidence = explanationResult.evidence;

    // Stage 12: Persist
    start = Date.now();
    await persistOpportunityMap({
      opportunityMap: explanationResult.opportunityMap,
      rankedInterventions: interventionRankingResult.ranked,
      evidence: currentEvidence,
      sessionId: input.sessionId,
      userId: input.userId,
    }, context);
    stageDurations.persist_opportunity_map = Date.now() - start;

    context.log("pipeline", "Pipeline completed successfully", {
      duration: Object.values(stageDurations).reduce((a, b) => a + b, 0),
      opportunityCount: explanationResult.opportunityMap.opportunities.length,
      interventionCount: explanationResult.opportunityMap.interventionEntries.length,
      pipeLoggerSummary: pipeLogger.getSummary(),
    });
    context.log("pipeline", "Pipeline debug log", { stages: pipeLogger.getLogs() });

    return {
      ...explanationResult.opportunityMap,
      generationMetadata: {
        ...explanationResult.opportunityMap.generationMetadata,
        duration: Object.values(stageDurations).reduce((a, b) => a + b, 0),
        timestamps: {
          ...explanationResult.opportunityMap.generationMetadata.timestamps,
          completedAt: new Date().toISOString(),
        },
      },
    };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    context.log("pipeline", "Pipeline failed", { error: errorMessage });

    try {
      await persistOpportunityMap({
        opportunityMap: {
          mapId: `map-${input.sessionId}-failed`,
          companyName: "Assessment",
          assessmentSessionId: input.sessionId,
          generatedAt: new Date().toISOString(),
          pipelineVersion: PIPELINE_VERSION,
          interventionEngineVersion: INTERVENTION_ENGINE_VERSION,
          prioritizationVersion: PRIORITIZATION_VERSION,
          executiveSummary: {
            headline: "Pipeline did not complete",
            finding: `The opportunity discovery pipeline encountered an error: ${errorMessage}`,
            recommendedFocus: "Please retry the assessment or contact support",
            quickWins: 0,
          },
          opportunities: [],
          interventionEntries: [],
          implementationSequencing: {
            strategy: "Retry",
            strategyRationale: "Pipeline failed before generating recommendations",
            phases: [{ phase: 1, name: "Retry", description: "Re-run the pipeline", opportunityIds: [], interventionIds: [], estimatedDuration: "Immediate" }],
          },
          evidence: currentEvidence,
          generationMetadata: {
            ...baseRunRecord,
            timestamps: { startedAt, completedAt: new Date().toISOString() },
            duration: Object.values(stageDurations).reduce((a, b) => a + b, 0),
            errorState: errorMessage,
          },
        },
        rankedInterventions: [],
        evidence: currentEvidence,
        sessionId: input.sessionId,
        userId: input.userId,
      }, context);
    } catch (persistErr) {
      context.log("pipeline", "Failed to persist error state", { error: String(persistErr) });
    }

    throw err;
  }
}
