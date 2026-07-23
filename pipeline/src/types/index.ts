// ─── Compass Core Domain Types ───────────────────────────────────────────────
// Canonical domain model: Business Intervention Intelligence
// Customer-facing artifacts may retain the name "AI Opportunity Map" while the
// internal domain models business problems and intervention paths.
//
// Reasoning pipeline:
//   BusinessProblem → RootCauseHypotheses → Evidence → EvidenceSufficiency
//   → InterventionComparison → SelectedIntervention → Blueprint

export const INTERVENTION_ENGINE_VERSION = "intervention_v1";
export const PRIORITIZATION_VERSION = "four_pass_v2";

export const REASONING_PIPELINE_VERSION = "reasoned_pipeline_v1";

export type EvidenceClass = "User" | "Research" | "Inference" | "Deterministic";

export type EvidenceType =
  | "user_answer"
  | "company_source"
  | "technology_signal"
  | "workflow_signal"
  | "benchmark"
  | "deterministic_derivation"
  | "ai_inference"
  | "explicit_hypothesis"
  | "external_research";

export interface EvidenceRecord {
  id: string;
  type: EvidenceType;
  evidenceClass: EvidenceClass;
  sourceUri?: string;
  sourceLabel: string;
  content: string;
  observedAt?: string;
  confidence: number;
  freshness?: number;
  reliability?: number;
  metadata?: Record<string, unknown>;
}

export interface InferredField<T> {
  value: T;
  confidence: number;
  evidenceIds: string[];
  source: "user" | "ai" | "deterministic" | "external";
}

export interface CompanyIntelligence {
  companySummary: string;
  industry: InferredField<string>;
  businessModel: InferredField<string>;
  employeeRange: InferredField<string>;
  likelyDepartments: InferredField<string[]>;
  technologySignals: EvidenceBackedSignal[];
  workflowSignals: EvidenceBackedSignal[];
  operationalPainHypotheses: EvidenceBackedSignal[];
  unknowns: string[];
  researchQuality: ConfidenceAssessment;
}

export interface EvidenceBackedSignal {
  signalId: string;
  name: string;
  family: string;
  value: string | number | boolean;
  confidence: number;
  evidenceIds: string[];
}

export interface ConfidenceAssessment {
  overall: number;
  sourceAuthority: number;
  dataFreshness: number;
  directness: number;
  consistency: number;
  specificity: number;
}

export type Department =
  | "Sales" | "Marketing" | "Customer Success" | "Support"
  | "Finance" | "Product" | "Engineering" | "People/HR" | "Legal" | "Operations";

// ─── Intervention Intelligence (Priority 1) ──────────────────────────────────

export type InterventionPath =
  | "ai"
  | "deterministic_software"
  | "process_redesign"
  | "human_work"
  | "hybrid"
  | "no_action_yet";

export interface BusinessImpact {
  cost: number;
  timePerOccurrence: number;
  userHoursPerWeek: number;
  customerImpactScore: number;
  revenueImpact?: number;
  strategicImportance: "low" | "medium" | "high";
}

export interface CostEstimate {
  initial: number;
  monthly: number;
  yearly: number;
  implementationComplexity: "low" | "medium" | "high";
}

export interface TimeEstimate {
  min: number;
  max: number;
  unit: "days" | "weeks" | "months";
}

export interface Assumption {
  id: string;
  statement: string;
  confidence: number;
  evidenceIds: string[];
}

export interface SuccessMetric {
  name: string;
  definition: string;
  targetValue: number;
  unit: string;
  measurementFrequency: "daily" | "weekly" | "monthly" | "quarterly";
  successThreshold: number;
}

export type EscalationLevel =
  | "business_configurable"
  | "operations_admin"
  | "technical_specialist"
  | "software_engineer"
  | "security_or_legal_review";

export interface EscalationRequirement {
  type: EscalationLevel;
  description: string;
  triggerConditions: string[];
}

export interface BusinessProblem {
  id: string;
  title: string;
  description: string;
  department: Department;
  workflow: string;
  desiredOutcome: string;
  currentImpact: BusinessImpact;
  evidenceIds: string[];
  rootCauseHypotheses: RootCauseHypothesis[];
  mergedSignalIds: string[];
}

// ─── Reasoned-pipeline domain (Priority 1) ───────────────────────────────────

export interface RootCauseHypothesis {
  id: string;
  problemId: string;
  title: string;
  description: string;
  category: "people" | "process" | "technology" | "data" | "policy" | "external";
  likelihood: "low" | "medium" | "high";
  supportingEvidenceIds: string[];
  weakeningEvidenceIds: string[];
  source: "assessment_signal" | "inference" | "user_provided";
}

export interface ReasonedEvidence {
  id: string;
  type:
    | "user_fact"
    | "derived_fact"
    | "external_source"
    | "benchmark"
    | "measurement"
    | "ai_inference"
    | "missing";
  statement: string;
  confidence: number;
  supports: string[];
  weakens: string[];
  sourceLabel: string;
}

export interface EvidenceSufficiency {
  status: "insufficient" | "partial" | "sufficient";
  score: number;
  recommendationAllowed: boolean;
  missingCriticalEvidence: string[];
  hypothesisConfidenceGaps: Array<{
    hypothesisId: string;
    currentConfidence: number;
    minimumConfidence: number;
    missingEvidenceCategories: string[];
  }>;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  category: "process" | "data" | "people" | "technology" | "policy" | "impact";
  reason: string;
  expectedAnswerType: "boolean" | "scale" | "text" | "number";
  priority: number;
  affectsHypotheses: string[];
  estimatedInformationGain: "low" | "medium" | "high";
}

// ─── Pipeline debug logging (Priority 3) ─────────────────────────────────────

export type StageName =
  | "load_assessment"
  | "build_company_context"
  | "normalize_workflow_signals"
  | "generate_business_problems"
  | "root_cause_analysis"
  | "evidence_analysis"
  | "evidence_sufficiency"
  | "follow_up_questions"
  | "intervention_comparison"
  | "rank_interventions"
  | "generate_candidates"
  | "rank_opportunities"
  | "build_evidence_traces"
  | "generate_explanations"
  | "persist_opportunity_map";

export interface PipelineStageLog {
  stage: StageName;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  inputSize: number;
  outputSize: number;
  detail: Record<string, unknown>;
}

export interface InterventionOption {
  path: InterventionPath;
  summary: string;
  expectedImpact: BusinessImpact;
  estimatedCost: CostEstimate;
  estimatedTimeToValue: TimeEstimate;
  implementationComplexity: number;
  dataReadiness: number;
  organizationalReadiness: number;
  technicalRisk: number;
  operationalRisk: number;
  humanJudgmentRequirement: number;
  reversibility: number;
  confidence: number;
  assumptions: Assumption[];
  evidenceIds: string[];
  disqualifiers: string[];
  eligible: boolean;
  supportingHypothesisIds: string[];
  weakeningHypothesisIds: string[];
}

export interface AlternativeRejection {
  path: InterventionPath;
  primaryReason: string;
  secondaryReasons: string[];
  evidenceIds: string[];
}

export interface RecommendedIntervention {
  problemId: string;
  selectedPath: InterventionPath;
  comparedOptions: InterventionOption[];
  reasonsSelected: string[];
  reasonsAlternativesRejected: AlternativeRejection[];
  confidence: number;
  successMetrics: SuccessMetric[];
  escalationRequirements: EscalationRequirement[];
  evidenceSufficiency: EvidenceSufficiency;
  deferredDueToInsufficientEvidence: boolean;
  followUpQuestions: FollowUpQuestion[];
}

export interface RankedIntervention extends RecommendedIntervention {
  problem: BusinessProblem;
  tier: Tier;
  sequence: number;
  recommendation: Recommendation;
  eligibility: DimensionResult;
  businessLeverage: DimensionResult;
  readiness: DimensionResult;
  portfolioPriority: DimensionResult;
  rankedScore: number;
  reasoningTraceId: string;
}

// ─── Intervention Blueprints (Priority 5) ────────────────────────────────────

export interface BlueprintCondition {
  type: "prerequisite" | "disqualifier" | "requirement";
  statement: string;
  evidenceTags: string[];
}

export interface DataRequirement {
  type: "structured" | "unstructured" | "real-time" | "historical";
  description: string;
  source: string;
  requiredConfidence: number;
}

export interface SystemRequirement {
  type: "crm" | "analytics" | "visualization" | "ai_model" | "workflow_tool" | "integration" | "communication" | "existing_vendor";
  name: string;
  configuration: string;
}

export interface HumanRole {
  type: "owner" | "approver" | "reviewer" | "executor" | "stakeholder";
  department: string;
  responsibility: string;
  timeCommitment: string;
}

export interface ImplementationPhase {
  phase: number;
  name: string;
  description: string;
  estimatedDuration: string;
  deliverable: string;
  dependencies: string[];
  requiredResources: string[];
}

export interface SecurityConsideration {
  category: "data_privacy" | "access_control" | "audit_trail" | "compliance";
  description: string;
  mitigationStrategy: string;
}

export interface SuccessMetricTemplate {
  name: string;
  definition: string;
  baselineValue: number;
  targetValue: number;
  unit: string;
  measurementFrequency: "daily" | "weekly" | "monthly" | "quarterly";
}

export interface FailureMode {
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  description: string;
  mitigation: string;
}

export interface EvidenceRequirement {
  type: "user_data" | "benchmark" | "research" | "ai_inference" | "deterministic_analysis";
  source: string;
  requiredConfidence: number;
  dataPointsNeeded: number;
}

export interface InterventionBlueprint {
  id: string;
  name: string;
  supportedPaths: InterventionPath[];
  problemPatterns: string[];
  requiredConditions: BlueprintCondition[];
  disqualifiers: BlueprintCondition[];
  requiredData: DataRequirement[];
  requiredSystems: SystemRequirement[];
  humanRoles: HumanRole[];
  implementationPhases: ImplementationPhase[];
  securityConsiderations: SecurityConsideration[];
  successMetrics: SuccessMetricTemplate[];
  commonFailureModes: FailureMode[];
  escalationRequirements: EscalationRequirement[];
  evidenceRequirements: EvidenceRequirement[];
  version: string;
}

// ─── Implementation Blueprint output (Priority 9) ────────────────────────────

export interface ValidationPlan {
  name: string;
  description: string;
  metrics: string[];
  thresholdValues: Record<string, number>;
  rollbackPlan: string;
}

export interface ChangeManagementPlan {
  name: string;
  description: string;
  stakeholders: string[];
  communicationPlan: string;
  trainingRequired: boolean;
  adoptionStrategy: string;
}

export interface ImplementationBlueprint {
  id: string;
  problemDefinition: BusinessProblem;
  rootCause: string;
  selectedIntervention: RecommendedIntervention;
  comparedAlternatives: InterventionOption[];
  targetWorkflow: string;
  currentWorkflow: string;
  futureWorkflow: string;
  requiredSystems: SystemRequirement[];
  requiredAPIs: string[];
  requiredData: DataRequirement[];
  humanRoles: HumanRole[];
  ownership: string;
  security: SecurityConsideration[];
  privacy: SecurityConsideration[];
  rolloutPhases: ImplementationPhase[];
  changeManagement: ChangeManagementPlan;
  validationPlan: ValidationPlan;
  successMetrics: SuccessMetric[];
  risks: FailureMode[];
  assumptions: Assumption[];
  escalationRequirements: EscalationRequirement[];
  expectedBusinessImpact: BusinessImpact;
  estimatedTimeToValue: TimeEstimate;
  estimatedImplementationEffort: string;
  version: string;
}

// ─── Workflow signals ────────────────────────────────────────────────────────

export interface NormalizedWorkflowSignals {
  departments: Department[];
  manualProcessDensity: number;
  crossDeptHandoffs: number;
  approvalChainDepth: number;
  reportingBurden: number;
  techMaturity: number;
  aiReadiness: number;
  regulatoryBurden: number;
  painPoints: WorkflowPainPoint[];
  missingDepartments: Department[];
  evidenceIds: string[];
}

export interface WorkflowPainPoint {
  department: Department;
  pain: string;
  severity: "high" | "medium" | "low";
  evidenceIds: string[];
}

// ─── Legacy opportunity candidates (compatibility adapter) ───────────────────

export interface OpportunityCandidate {
  id: string;
  blueprintId?: string;
  title: string;
  problemStatement: string;
  targetWorkflow: string;
  department: Department;
  businessObjective: string;
  proposedSystemType: string;
  detectedSignals: string[];
  requiredCapabilities: string[];
  dependencies: string[];
  risks: string[];
  evidenceIds: string[];
  candidateSource: "blueprint" | "composite" | "custom";
  compatiblePaths: InterventionPath[];
}

export interface DimensionResult {
  score: number;
  maxScore: number;
  label: "pass" | "conditional" | "fail";
  details: string[];
}

export type Tier = 1 | 2 | 3 | 4;
export type Recommendation = "build_now" | "validate_next" | "defer" | "do_not_pursue";

export interface RankedOpportunity {
  candidate: OpportunityCandidate;
  tier: Tier;
  sequence: number;
  recommendation: Recommendation;
  feasibility: DimensionResult;
  businessLeverage: DimensionResult;
  implementationReadiness: DimensionResult;
  strategicAlignment: DimensionResult;
  confidence: OpportunityConfidence;
  evidenceIds: string[];
  dependencies: string[];
  disqualifiers: string[];
  reasoningTraceId: string;
}

export interface OpportunityConfidence {
  level: "Confirmed" | "High" | "Medium" | "Low";
  score: number;
  dimensions: {
    sourceAuthority: number;
    dataFreshness: number;
    directness: number;
    consistency: number;
    specificity: number;
  };
  reasoning: string[];
}

// ─── Opportunity Map (customer-facing name retained, Priority 8) ─────────────

export interface OpportunityMapEntry {
  problemId: string;
  businessProblem: BusinessProblem;
  rootCause: string;
  currentImpact: BusinessImpact;
  evidenceIds: string[];
  possibleInterventionPaths: InterventionPath[];
  selectedIntervention: InterventionPath;
  whySelected: string[];
  whyAlternativesRejected: AlternativeRejection[];
  expectedImpact: BusinessImpact;
  estimatedEffort: CostEstimate;
  timeToValue: TimeEstimate;
  confidence: number;
  assumptions: Assumption[];
  successMetrics: SuccessMetric[];
  requiredOwner: string;
  technicalEscalationLevel: EscalationLevel;
  implementationBlueprintAvailable: boolean;
}

export interface OpportunityMap {
  mapId: string;
  companyName: string;
  assessmentSessionId: string;
  generatedAt: string;
  pipelineVersion: string;
  interventionEngineVersion: string;
  prioritizationVersion: string;
  executiveSummary: {
    headline: string;
    finding: string;
    recommendedFocus: string;
    quickWins: number;
    strategicValue?: string;
  };
  opportunities: RankedOpportunity[];
  interventionEntries: OpportunityMapEntry[];
  implementationSequencing: {
    strategy: string;
    strategyRationale: string;
    phases: {
      phase: number;
      name: string;
      description: string;
      opportunityIds: string[];
      interventionIds: string[];
      estimatedDuration: string;
    }[];
  };
  evidence: EvidenceRecord[];
  generationMetadata: PipelineRunRecord;
}

export interface PipelineRunRecord {
  pipelineVersion: string;
  interventionEngineVersion?: string;
  prioritizationVersion?: string;
  promptVersions: Record<string, string>;
  algorithmVersion: string;
  modelIdentifiers: Record<string, string>;
  timestamps: {
    startedAt: string;
    completedAt: string;
  };
  duration: number;
  stageDurations: Record<string, number>;
  inputReferences: string[];
  outputReferences: string[];
  errorState: string | null;
  retryCount: number;
  costMetadata?: {
    aiCalls: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
}

export interface PipelineStage<I, O> {
  name: string;
  version: string;
  run(input: I, context: PipelineContext): Promise<O>;
}

export interface PipelineContext {
  sessionId: string;
  userId: string;
  organizationId?: string;
  startedAt: string;
  requestId: string;
  supabase: any;
  log: (stage: string, message: string, data?: Record<string, unknown>) => void;
}

export interface RunAssessmentInput {
  sessionId: string;
  userId: string;
  organizationId?: string;
}

export interface Blueprint {
  id: string;
  name: string;
  department: Department;
  description: string;
  typicalTriggers: string[];
  prerequisites: string[];
  requiredCapabilities: string[];
  exclusions: string[];
  aiComponents: string[];
  evidenceTags: string[];
  effort: string;
  timeToValue: string;
  successRate?: number;
  supportedPaths?: InterventionPath[];
}

export type PipelineStageName =
  | "load_assessment"
  | "build_company_context"
  | "normalize_workflow_signals"
  | "generate_business_problems"
  | "generate_intervention_options"
  | "generate_candidates"
  | "match_blueprints"
  | "rank_opportunities"
  | "rank_interventions"
  | "calculate_confidence"
  | "build_evidence_traces"
  | "generate_explanations"
  | "persist_opportunity_map";
