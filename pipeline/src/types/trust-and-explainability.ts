// Priority 6: Trust and Explainability Types

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
  requiredConfidence?: number;
  verificationStatus?: "verified" | "pending" | "conflict";
}

export interface EvidenceClassification {
  type: "User Answer" | "Research Data" | "AI Inference" | "Deterministic Calculation" | "Domain Expert" | "External Benchmark";
  quality: "High" | "Medium" | "Low";
  verification: "Verified" | "Pending" | "Conflict";
  source: string;
  credibility: number;
  lastUpdated?: string;
}

export interface TransparencyRecord {
  conclusionId: string;
  problemId: string;
  interventionPath: InterventionPath;
  supportingEvidenceIds: string[];
  conflictingEvidenceIds: string[];
  assumptions: string[];
  confidenceBreakdown: {
    evidenceConfidence: number;
    dataFreshness: number;
    sourceAuthority: number;
    corroboration: number;
  };
  alternativeConsiderationIds: string[];
  requiredExpertise: EscalationLevel[];
}

export interface EvidenceTaxonomy {
  category: "process_metrics" | "customer_impact" | "technical_feasibility" | "organizational_readiness" | "market_context";
  subcategory: string;
  requiredFormat: "numerical" | "categorical" | "textual" | "temporal";
  minimumQuantity: number;
  verificationMethod: "system_query" | "human_review" | "external_audit" | "ai_validation";
  retentionPeriod: "short_term" | "long_term" | "permanent";
}

// Priority 7: Escalation Classification Types

export type EscalationLevel = 
  | "business_configurable"
  | "operations_admin"
  | "technical_specialist"
  | "software_engineer"
  | "security_or_legal_review";

export interface EscalationRequirement {
  levels: EscalationLevel[];
  description: string;
  triggerConditions: string[];
  estimatedTimeToResolve: TimeEstimate;
  requiredDocumentation: string[];
  complianceRequirements: string[];
}

export interface EscalationPath {
  problemId: string;
  interventionPath: InterventionPath;
  escalationLevel: EscalationLevel;
  reason: string;
  requiredApprover: string;
  notificationChannels: string[];
}

// Priority 8: Updated Opportunity Map Structure

export interface UpdatedOpportunityMap {
  mapId: string;
  companyName: string;
  assessmentSessionId: string;
  generatedAt: string;
  pipelineVersion: string;
  interventionEngineVersion: string;
  executiveSummary: {
    headline: string;
    finding: string;
    recommendedFocus: string;
    quickWins: number;
    strategicValue?: string;
  };
  businessProblems: BusinessProblem[];
  rankedInterventions: RankedIntervention[];
  implementationSequencing: {
    strategy: string;
    strategyRationale: string;
    phases: {
      phase: number;
      name: string;
      description: string;
      interventionIds: string[];
      opportunityIds: string[];
      estimatedDuration: string;
    }[];
  };
  evidence: EvidenceRecord[];
  evidenceTaxonomy: EvidenceTaxonomy[];
  transparencyRecords: TransparencyRecord[];
  escalationPaths: EscalationPath[];
  generationMetadata: PipelineRunRecord;
}

// Priority 9: Updated Implementation Blueprint

export interface ImplementationBlueprint {
  problemDefinition: BusinessProblem;
  rootCause: string;
  selectedIntervention: ProposedIntervention;
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
  trustScore: number;
  explanationTrace: {
    interventionPath: InterventionPath;
    supportingEvidence: string[];
    contradictoryEvidence: string[];
    assumptions: string[];
    reasoning: string[];
  };
}

// Priority 10: Test Fixtures for Non-AI Outcomes

export interface InterventionTestCase {
  id: string;
  name: string;
  answers: Record<number, string | number | boolean>;
  expectedProblem: {
    department: string;
    expectedPath: InterventionPath;
    confidenceMin?: number;
    confidenceMax?: number;
  };
  description: string;
  category: "ai" | "deterministic" | "process_redesign" | "human_work" | "hybrid" | "no_action";
}

export interface InterventionBenchmark {
  testCases: InterventionTestCase[];
  metrics: {
    interventionPathAccuracy: number;
    aiOverrecommendationRate: number;
    alternativeComparisonCompleteness: number;
    unsupportedClaimRate: number;
    explanationFaithfulness: number;
    confidenceCalibration: number;
    rankingStability: number;
    blueprintCompleteness: number;
  };
  regressionThresholds: {
    aiOverrecommendationRate: number;
    unsupportedClaimRate: number;
  };
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  accuracyScore: number;
  aiOverrecommendationScore: number;
  interventionPathAccuracy: number;
  explanationFaithfulness: number;
  confidenceCalibration: number;
  rankingStability: number;
  blueprintCompleteness: number;
  recommendations: string[];
}
