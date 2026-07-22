// Priority 6/10: Trust, explainability, and evaluation-suite types.
// Canonical domain types live in ./index.ts; this module adds the evidence
// taxonomy and benchmark-harness types used by the evaluation suite.

import type {
  EvidenceClass,
  EvidenceType,
  InterventionPath,
  EscalationLevel,
  TimeEstimate,
} from "./index.js";

// ─── Evidence taxonomy (Priority 6) ──────────────────────────────────────────
// Every conclusion must be traceable to one of these sources. No explanation
// may introduce unsupported factual claims.

export type EvidenceSourceKind =
  | "user_provided_evidence"
  | "deterministic_derivation"
  | "documented_benchmark"
  | "external_research"      // future phase; not used in current MVP claims
  | "ai_inference"
  | "explicit_hypothesis";

export interface EvidenceClassification {
  kind: EvidenceSourceKind;
  type: EvidenceType;
  evidenceClass: EvidenceClass;
  quality: "high" | "medium" | "low";
  verification: "verified" | "pending" | "conflict";
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

export interface EscalationPath {
  problemId: string;
  interventionPath: InterventionPath;
  escalationLevel: EscalationLevel;
  reason: string;
  requiredApprover: string;
  notificationChannels: string[];
  estimatedTimeToResolve: TimeEstimate;
}

// ─── Evaluation suite types (Priority 10) ────────────────────────────────────

export interface InterventionTestCase {
  id: string;
  name: string;
  answers: Record<number, string | number | boolean>;
  expected: {
    department?: string;
    expectedPath: InterventionPath;
    problemId?: string;
    confidenceMin?: number;
    confidenceMax?: number;
  };
  description: string;
  category: "ai" | "deterministic" | "process_redesign" | "human_work" | "hybrid" | "no_action";
}

export interface EvaluationMetrics {
  interventionPathAccuracy: number;
  aiOverrecommendationRate: number;
  alternativeComparisonCompleteness: number;
  unsupportedClaimRate: number;
  explanationFaithfulness: number;
  confidenceCalibration: number;
  rankingStability: number;
  blueprintCompleteness: number;
}

export interface RegressionThresholds {
  aiOverrecommendationRateMax: number;
  unsupportedClaimRateMax: number;
  interventionPathAccuracyMin: number;
}

export const DEFAULT_REGRESSION_THRESHOLDS: RegressionThresholds = {
  aiOverrecommendationRateMax: 0.34, // Compass must not recommend AI reflexively
  unsupportedClaimRateMax: 0.0,      // zero unsupported factual claims
  interventionPathAccuracyMin: 0.8,  // at least 80% path accuracy on fixtures
};

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  metrics: EvaluationMetrics;
  thresholds: RegressionThresholds;
  regressions: string[];
  recommendations: string[];
}
