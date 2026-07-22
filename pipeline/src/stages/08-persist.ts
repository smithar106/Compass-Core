import type { EvidenceRecord, OpportunityMap, RankedOpportunity, RankedIntervention, PipelineContext } from "../types/index.js";

interface PersistInput {
  opportunityMap: OpportunityMap;
  rankedInterventions?: RankedIntervention[];
  evidence: EvidenceRecord[];
  sessionId: string;
  userId: string;
}

export async function persistOpportunityMap(input: PersistInput, context: PipelineContext): Promise<void> {
  context.log("persist_opportunity_map", "Persisting opportunity map", {
    sessionId: input.sessionId,
    opportunityCount: input.opportunityMap.opportunities.length,
    evidenceCount: input.evidence.length,
  });

  // 1. Persist evidence records
  const { data: evidenceData, error: evidenceError } = await context.supabase
    .from("company_evidence")
    .upsert(
      input.evidence.map((e) => ({
        id: e.id,
        organization_id: null,
        category: e.type,
        key: e.sourceLabel,
        value: { content: e.content, confidence: e.confidence },
        confidence: e.confidence,
        evidence_class: e.evidenceClass,
        source_type: e.sourceLabel,
        source_url: e.sourceUri || null,
        reasoning: e.content,
      })),
      { onConflict: "id", ignoreDuplicates: false }
    );

  if (evidenceError) {
    throw new Error(`Failed to persist evidence: ${evidenceError.message}`);
  }

  // 2. Create opportunity map record
  const { data: mapData, error: mapError } = await context.supabase
    .from("opportunity_maps")
    .insert({
      id: input.opportunityMap.mapId,
      assessment_session_id: input.sessionId,
      company_name: input.opportunityMap.companyName,
      executive_summary: input.opportunityMap.executiveSummary,
      implementation_sequencing: input.opportunityMap.implementationSequencing,
      cross_opportunity_dependencies: { phases: input.opportunityMap.implementationSequencing.phases },
    })
    .select("id")
    .single();

  if (mapError) {
    throw new Error(`Failed to create opportunity map: ${mapError.message}`);
  }

  // 3. Persist individual opportunities
  for (const opp of input.opportunityMap.opportunities) {
    const { error: oppError } = await context.supabase
      .from("opportunities")
      .insert({
        opportunity_map_id: input.opportunityMap.mapId,
        rank: opp.sequence,
        title: opp.candidate.title,
        department: opp.candidate.department,
        problem: opp.candidate.problemStatement,
        business_impact: {
          description: opp.businessLeverage.details.join("; "),
          impactType: "Efficiency",
          estimatedImpact: opp.tier === 1 ? "High" : opp.tier <= 3 ? "Moderate" : "Low",
        },
        implementation_difficulty: opp.tier === 1 ? "Medium" : opp.tier <= 3 ? "Low" : "High",
        confidence: opp.confidence.level,
        risks: opp.candidate.risks.map((r) => ({ risk: r, category: "Organizational", likelihood: "Medium", impact: "Medium" })),
        dependencies: opp.candidate.dependencies.map((d) => ({ dependency: d, type: "Process", required: true, status: "Needed" })),
        reasoning: opp.confidence.reasoning,
        evidence: { evidenceIds: opp.evidenceIds },
      });

    if (oppError) {
      context.log("persist_opportunity_map", "Failed to persist opportunity", {
        title: opp.candidate.title,
        error: oppError.message,
      });
    }
  }

  // 3b. Persist intervention-intelligence entities (Priority 12)
  for (const ri of input.rankedInterventions ?? []) {
    // business_problems
    const { error: problemError } = await context.supabase
      .from("business_problems")
      .upsert({
        id: ri.problemId,
        assessment_session_id: input.sessionId,
        title: ri.problem.title,
        description: ri.problem.description,
        department: ri.problem.department,
        workflow: ri.problem.workflow,
        desired_outcome: ri.problem.desiredOutcome,
        current_impact: ri.problem.currentImpact,
        evidence_ids: ri.problem.evidenceIds,
        engine_version: input.opportunityMap.interventionEngineVersion,
      }, { onConflict: "id" });
    if (problemError) {
      context.log("persist_opportunity_map", "Failed to persist business problem", { id: ri.problemId, error: problemError.message });
    }

    // intervention_options (every compared path)
    const { error: optionsError } = await context.supabase
      .from("intervention_options")
      .upsert(
        ri.comparedOptions.map((o) => ({
          id: `${ri.problemId}-${o.path}`,
          problem_id: ri.problemId,
          path: o.path,
          summary: o.summary,
          expected_impact: o.expectedImpact,
          estimated_cost: o.estimatedCost,
          estimated_time_to_value: o.estimatedTimeToValue,
          implementation_complexity: o.implementationComplexity,
          data_readiness: o.dataReadiness,
          organizational_readiness: o.organizationalReadiness,
          technical_risk: o.technicalRisk,
          operational_risk: o.operationalRisk,
          human_judgment_requirement: o.humanJudgmentRequirement,
          reversibility: o.reversibility,
          confidence: o.confidence,
          eligible: o.eligible,
          disqualifiers: o.disqualifiers,
          evidence_ids: o.evidenceIds,
          engine_version: input.opportunityMap.interventionEngineVersion,
        })),
        { onConflict: "id" },
      );
    if (optionsError) {
      context.log("persist_opportunity_map", "Failed to persist intervention options", { id: ri.problemId, error: optionsError.message });
    }

    // selected_interventions
    const { error: selectedError } = await context.supabase
      .from("selected_interventions")
      .upsert({
        id: `sel-${ri.problemId}`,
        problem_id: ri.problemId,
        opportunity_map_id: input.opportunityMap.mapId,
        selected_path: ri.selectedPath,
        reasons_selected: ri.reasonsSelected,
        confidence: ri.confidence,
        tier: ri.tier,
        sequence: ri.sequence,
        recommendation: ri.recommendation,
        ranked_score: ri.rankedScore,
        pass_scores: {
          eligibility: ri.eligibility,
          business_leverage: ri.businessLeverage,
          readiness: ri.readiness,
          portfolio_priority: ri.portfolioPriority,
        },
        success_metrics: ri.successMetrics,
        escalation_requirements: ri.escalationRequirements,
        reasoning_trace_id: ri.reasoningTraceId,
        engine_version: input.opportunityMap.interventionEngineVersion,
        prioritization_version: input.opportunityMap.prioritizationVersion,
      }, { onConflict: "id" });
    if (selectedError) {
      context.log("persist_opportunity_map", "Failed to persist selected intervention", { id: ri.problemId, error: selectedError.message });
    }

    // alternative_rejections
    const { error: rejectionError } = await context.supabase
      .from("alternative_rejections")
      .upsert(
        ri.reasonsAlternativesRejected.map((r) => ({
          id: `${ri.problemId}-rej-${r.path}`,
          problem_id: ri.problemId,
          path: r.path,
          primary_reason: r.primaryReason,
          secondary_reasons: r.secondaryReasons,
          evidence_ids: r.evidenceIds,
        })),
        { onConflict: "id" },
      );
    if (rejectionError) {
      context.log("persist_opportunity_map", "Failed to persist alternative rejections", { id: ri.problemId, error: rejectionError.message });
    }

    // intervention_assumptions
    const allAssumptions = ri.comparedOptions.flatMap((o) =>
      o.assumptions.map((a) => ({ ...a, optionPath: o.path })),
    );
    if (allAssumptions.length > 0) {
      const { error: assumptionError } = await context.supabase
        .from("intervention_assumptions")
        .upsert(
          allAssumptions.map((a) => ({
            id: a.id,
            problem_id: ri.problemId,
            option_path: a.optionPath,
            statement: a.statement,
            confidence: a.confidence,
            evidence_ids: a.evidenceIds,
          })),
          { onConflict: "id" },
        );
      if (assumptionError) {
        context.log("persist_opportunity_map", "Failed to persist assumptions", { id: ri.problemId, error: assumptionError.message });
      }
    }
  }

  // 4. Persist reasoning trace
  const { error: traceError } = await context.supabase
    .from("reasoning_traces")
    .insert({
      opportunity_map_id: input.opportunityMap.mapId,
      pipeline: {
        version: input.opportunityMap.pipelineVersion,
        interventionEngineVersion: input.opportunityMap.interventionEngineVersion,
        prioritizationVersion: input.opportunityMap.prioritizationVersion,
        stages: [
          "load_assessment",
          "build_company_context",
          "normalize_workflow_signals",
          "generate_business_problems",
          "generate_intervention_options",
          "generate_candidates",
          "rank_opportunities",
          "rank_interventions",
          "build_evidence_traces",
          "generate_explanations",
          "persist_opportunity_map",
        ],
      },
      decisions: input.opportunityMap.opportunities.map((o) => ({
        id: o.candidate.id,
        tier: o.tier,
        recommendation: o.recommendation,
        feasibility: o.feasibility,
        businessLeverage: o.businessLeverage,
        confidence: o.confidence,
      })),
      confidence_breakdown: {
        sourceAuthority: 0.8,
        dataFreshness: 0.95,
        directness: 0.7,
        consistency: 0.7,
        specificity: 0.6,
      },
      opportunity_traces: input.opportunityMap.opportunities.map((o) => ({
        id: o.candidate.id,
        trace: o.reasoningTraceId,
      })),
      performance: input.opportunityMap.generationMetadata.stageDurations,
      audit_log: [{
        event: "pipeline_complete",
        timestamp: new Date().toISOString(),
        version: input.opportunityMap.pipelineVersion,
      }],
    });

  if (traceError) {
    context.log("persist_opportunity_map", "Failed to persist reasoning trace", { error: traceError.message });
  }

  // 5. Update session status
  const { error: updateError } = await context.supabase
    .from("assessment_sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      metadata: {
        ...input.opportunityMap.generationMetadata,
        opportunityMapId: input.opportunityMap.mapId,
      },
    })
    .eq("id", input.sessionId);

  if (updateError) {
    context.log("persist_opportunity_map", "Failed to update session", { error: updateError.message });
  }

  context.log("persist_opportunity_map", "Opportunity map persisted successfully", {
    mapId: input.opportunityMap.mapId,
    opportunitiesPersisted: input.opportunityMap.opportunities.length,
  });
}
