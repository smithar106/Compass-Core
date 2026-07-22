export type EvidenceClass = "User" | "Research" | "Inference" | "Deterministic";

export type EvidenceType =
  | "user_answer"
  | "company_source"
  | "technology_signal"
  | "workflow_signal"
  | "benchmark"
  | "deterministic_derivation"
  | "ai_inference";

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

export type InterventionPath =
  | "ai"
  | "deterministic_software"
  | "process_redesign"
  | "human_work"
  | "hybrid"
  | "no_action_yet";

export const INTERVENTION_ENGINE_VERSION = "intervention_v1";
export const PRIORITIZATION_VERSION = "four_pass_v2";

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

export interface OpportunityMap {
  mapId: string;
  companyName: string;
  assessmentSessionId: string;
  generatedAt: string;
  pipelineVersion: string;
  executiveSummary: {
    headline: string;
    finding: string;
    recommendedFocus: string;
    quickWins: number;
    strategicValue?: string;
  };
  opportunities: RankedOpportunity[];
  implementationSequencing: {
    strategy: string;
    strategyRationale: string;
    phases: {
      phase: number;
      name: string;
      description: string;
      opportunityIds: string[];
      estimatedDuration: string;
    }[];
  };
  evidence: EvidenceRecord[];
  generationMetadata: PipelineRunRecord;
}

export interface PipelineRunRecord {
  pipelineVersion: string;
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
}

export type PipelineStageName =
  | "load_assessment"
  | "build_company_context"
  | "normalize_workflow_signals"
  | "generate_candidates"
  | "match_blueprints"
  | "rank_opportunities"
  | "calculate_confidence"
  | "build_evidence_traces"
  | "generate_explanations"
  | "persist_opportunity_map";
