// Priority 4: TypeScript type definitions for intervention intelligence
export const INTERVENTION_ENGINE_VERSION = "intervention_v1";
export const PRIORITIZATION_VERSION = "four_pass_v2";

export type InterventionPath =
  | "ai"
  | "deterministic_software"
  | "process_redesign"
  | "human_work"
  | "hybrid"
  | "no_action_yet";

export interface BusinessProblem {
  id: string;
  title: string;
  description: string;
  department: string;
  workflow: string;
  desiredOutcome: string;
  currentImpact: BusinessImpact;
  evidenceIds: string[];
}

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

export interface EscalationRequirement {
  type: "business_configurable" | "operations_admin" | "technical_specialist" | "software_engineer" | "security_or_legal_review";
  description: string;
  triggerConditions: string[];
}

export interface EvidenceRequirement {
  type: "user_data" | "benchmark" | "research" | "ai_inference" | "deterministic_analysis";
  source: string;
  requiredConfidence: number;
  dataPointsNeeded: number;
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

export interface BlueprintCondition {
  type: "prerequisite" | "disqualifier" | "requirement";
  statement: string;
  evidenceIds: string[];
}

export interface DataRequirement {
  type: "structured" | "unstructured" | "real-time" | "historical";
  description: string;
  source: string;
  requiredConfidence: number;
}

export interface SystemRequirement {
  type: "crm" | "analytics" | "visualization" | "ai_model" | "workflow_tool" | "integration";
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
}
export type EscalationLevel =
  | "business_configurable"
  | "operations_admin"
  | "technical_specialist"
  | "software_engineer"
  | "security_or_legal_review";
