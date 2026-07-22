import { loadAssessment } from "./stages/01-load-assessment.js";
import { buildCompanyContext } from "./stages/02-build-company-context.js";
import { normalizeWorkflowSignals } from "./stages/03-normalize-workflow.js";
import { generateOpportunityCandidates } from "./stages/04-generate-candidates.js";
import { rankOpportunities } from "./stages/05-rank-opportunities.js";
import { buildEvidenceTraces } from "./stages/06-build-evidence.js";
import { generateExplanations } from "./stages/07-generate-explanations.js";
import { persistOpportunityMap } from "./stages/08-persist.js";
import type { PipelineContext, PipelineRunRecord, OpportunityMap, RunAssessmentInput } from "./types/index.js";

export const PIPELINE_VERSION = "1.0.0";
export const ALGORITHM_VERSION = "1.0.0";
export const PROMPT_VERSIONS = {
  company_intelligence: "1.0.0",
  opportunity_explanation: "1.0.0",
};

export async function runAssessment(input: RunAssessmentInput, supabase: any): Promise<OpportunityMap> {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = new Date().toISOString();
  const stageDurations: Record<string, number> = {};
  const logs: Array<{ stage: string; message: string; data?: Record<string, unknown> }> = [];

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

  context.log("pipeline", "Starting pipeline run", {
    pipelineVersion: PIPELINE_VERSION,
    sessionId: input.sessionId,
  });

  let currentEvidence: any[] = [];

  try {
    // Stage 1: Load assessment
    let start = Date.now();
    const assessment = await loadAssessment({ sessionId: input.sessionId }, context);
    stageDurations.load_assessment = Date.now() - start;
    currentEvidence = assessment.evidence;

    // Stage 2: Build company context
    start = Date.now();
    const companyResult = await buildCompanyContext(
      { answers: assessment.answers, evidence: currentEvidence },
      context
    );
    stageDurations.build_company_context = Date.now() - start;
    currentEvidence = companyResult.evidence;

    // Stage 3: Normalize workflow signals
    start = Date.now();
    const workflowResult = await normalizeWorkflowSignals(
      { answers: assessment.answers, company: companyResult.company, evidence: currentEvidence },
      context
    );
    stageDurations.normalize_workflow_signals = Date.now() - start;
    currentEvidence = workflowResult.evidence;

    // Stage 4: Generate opportunity candidates
    start = Date.now();
    const candidateResult = await generateOpportunityCandidates(
      { answers: assessment.answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: currentEvidence },
      context
    );
    stageDurations.generate_candidates = Date.now() - start;
    currentEvidence = candidateResult.evidence;

    // Stage 5: Rank opportunities
    start = Date.now();
    const rankingResult = await rankOpportunities(
      { candidates: candidateResult.candidates, answers: assessment.answers, company: companyResult.company, workflowSignals: workflowResult.signals, evidence: currentEvidence },
      context
    );
    stageDurations.rank_opportunities = Date.now() - start;
    currentEvidence = rankingResult.evidence;

    // Stage 6: Build evidence traces
    start = Date.now();
    const evidenceResult = await buildEvidenceTraces(
      { ranked: rankingResult.ranked, evidence: currentEvidence },
      context
    );
    stageDurations.calculate_confidence = Date.now() - start;
    stageDurations.build_evidence_traces = Date.now() - start;
    currentEvidence = evidenceResult.evidence;

    // Stage 7: Generate explanations
    start = Date.now();
    const explanationResult = await generateExplanations({
      companySummary: companyResult.company.companySummary,
      ranked: evidenceResult.opportunities,
      evidence: currentEvidence,
      sessionId: input.sessionId,
      pipelineVersion: PIPELINE_VERSION,
      stageDurations,
      runRecord: {
        pipelineVersion: PIPELINE_VERSION,
        promptVersions: PROMPT_VERSIONS,
        algorithmVersion: ALGORITHM_VERSION,
        modelIdentifiers: { deterministic: "none" },
        timestamps: { startedAt, completedAt: "" },
        duration: 0,
        stageDurations,
        inputReferences: [input.sessionId],
        outputReferences: [],
        errorState: null,
        retryCount: 0,
      },
    }, context);
    stageDurations.generate_explanations = Date.now() - start;
    currentEvidence = explanationResult.evidence;

    // Stage 8: Persist
    start = Date.now();
    await persistOpportunityMap({
      opportunityMap: explanationResult.opportunityMap,
      evidence: currentEvidence,
      sessionId: input.sessionId,
      userId: input.userId,
    }, context);
    stageDurations.persist_opportunity_map = Date.now() - start;

    context.log("pipeline", "Pipeline completed successfully", {
      duration: Object.values(stageDurations).reduce((a, b) => a + b, 0),
      opportunityCount: explanationResult.opportunityMap.opportunities.length,
    });

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

    // Create a minimal persisted error state
    try {
      await persistOpportunityMap({
        opportunityMap: {
          mapId: `map-${input.sessionId}-failed`,
          companyName: "Assessment",
          assessmentSessionId: input.sessionId,
          generatedAt: new Date().toISOString(),
          pipelineVersion: PIPELINE_VERSION,
          executiveSummary: {
            headline: "Pipeline did not complete",
            finding: `The opportunity discovery pipeline encountered an error: ${errorMessage}`,
            recommendedFocus: "Please retry the assessment or contact support",
            quickWins: 0,
          },
          opportunities: [],
          implementationSequencing: {
            strategy: "Retry",
            strategyRationale: "Pipeline failed before generating recommendations",
            phases: [{ phase: 1, name: "Retry", description: "Re-run the pipeline", opportunityIds: [], estimatedDuration: "Immediate" }],
          },
          evidence: currentEvidence,
          generationMetadata: {
            pipelineVersion: PIPELINE_VERSION,
            promptVersions: PROMPT_VERSIONS,
            algorithmVersion: ALGORITHM_VERSION,
            modelIdentifiers: { deterministic: "none" },
            timestamps: { startedAt, completedAt: new Date().toISOString() },
            duration: Object.values(stageDurations).reduce((a, b) => a + b, 0),
            stageDurations,
            inputReferences: [input.sessionId],
            outputReferences: [],
            errorState: errorMessage,
            retryCount: 0,
          },
        },
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
