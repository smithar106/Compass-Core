import type { InterventionPath } from "./index.js";

export const RANKING_ALGORITHM_VERSION = "four_pass_v2";
export type Tier = 1 | 2 | 3 | 4;
export type Recommendation = "build_now" | "validate_next" | "defer" | "do_not_pursue";

export interface DimensionResult {
  score: number;
  maxScore: number;
  label: "pass" | "conditional" | "fail";
  details: string[];
}

export interface EvidenceRecord {
  id: string;
  type: string;
  evidenceClass: string;
  sourceUri?: string;
  sourceLabel: string;
  content: string;
  observedAt?: string;
  confidence: number;
  freshness?: number;
  reliability?: number;
  metadata?: Record<string, unknown>;
}

export interface OpportunityCandidate {
  id: string;
  blueprintId?: string;
  title: string;
  problemStatement: string;
  targetWorkflow: string;
  department: string;
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

export interface RankedOpportunity {
  candidate: OpportunityCandidate;
  tier: Tier;
  sequence: number;
  recommendation: Recommendation;
  feasibility: DimensionResult;
  businessLeverage: DimensionResult;
  implementationReadiness: DimensionResult;
  strategicAlignment: DimensionResult;
  confidence: any;
  evidenceIds: string[];
  dependencies: string[];
  disqualifiers: string[];
  reasoningTraceId: string;
}
