// Priority 5: Intervention Blueprint Library
// Blueprints describe intervention patterns across ALL path types — not only
// AI. Each blueprint declares supported paths, problem patterns, conditions,
// disqualifiers, requirements, phases, failure modes, and evidence needs.

import type { InterventionBlueprint, InterventionPath } from "../types/index.js";

export const INTERVENTION_BLUEPRINT_VERSION = "blueprints_v2";

export const interventionBlueprints: InterventionBlueprint[] = [
  {
    id: "IB-DET-ROUTING-01",
    name: "Deterministic routing rules",
    supportedPaths: ["deterministic_software"],
    problemPatterns: ["stable routing rules", "structured inputs", "predictable exceptions", "invoice routing", "ticket assignment"],
    requiredConditions: [
      { type: "prerequisite", statement: "Routing rules documented and stable for 90+ days", evidenceTags: ["process_specification"] },
      { type: "requirement", statement: "Inputs are structured fields (amount, vendor, category)", evidenceTags: ["data_schema"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "Exceptions exceed 20% of volume", evidenceTags: ["exception_rate"] },
      { type: "disqualifier", statement: "Rules change more than quarterly", evidenceTags: ["rule_stability"] },
    ],
    requiredData: [
      { type: "structured", description: "Historical routing decisions with inputs and outcomes", source: "system_of_record", requiredConfidence: 0.9 },
    ],
    requiredSystems: [
      { type: "workflow_tool", name: "Workflow engine or ERP rules module", configuration: "Rule table with audit log" },
    ],
    humanRoles: [
      { type: "owner", department: "Operations", responsibility: "Owns rule table and change control", timeCommitment: "2h/week" },
      { type: "reviewer", department: "Operations", responsibility: "Weekly exception review", timeCommitment: "1h/week" },
    ],
    implementationPhases: [
      { phase: 1, name: "Rule harvest", description: "Extract implicit rules from historical decisions", estimatedDuration: "1-2 weeks", deliverable: "Documented rule table", dependencies: [], requiredResources: ["Ops lead", "Analyst"] },
      { phase: 2, name: "Encode + shadow", description: "Encode rules; run in shadow mode against live flow", estimatedDuration: "2-3 weeks", deliverable: "Shadow-mode accuracy report", dependencies: ["Rule harvest"], requiredResources: ["Technical specialist"] },
      { phase: 3, name: "Cutover + audit", description: "Route live traffic; audit weekly", estimatedDuration: "1 week", deliverable: "Live routing with audit trail", dependencies: ["Encode + shadow"], requiredResources: ["Ops lead"] },
    ],
    securityConsiderations: [
      { category: "audit_trail", description: "Every automated routing decision must be logged with rule version", mitigationStrategy: "Append-only decision log" },
    ],
    successMetrics: [
      { name: "Straight-through rate", definition: "% items routed without human touch", baselineValue: 0, targetValue: 90, unit: "%", measurementFrequency: "weekly" },
      { name: "Routing accuracy", definition: "% routed to correct destination", baselineValue: 70, targetValue: 98, unit: "%", measurementFrequency: "weekly" },
    ],
    commonFailureModes: [
      { probability: "medium", impact: "medium", description: "Rule drift as business changes", mitigation: "Quarterly rule review with owner sign-off" },
      { probability: "low", impact: "high", description: "Silent misrouting of edge cases", mitigation: "Exception queue with daily review" },
    ],
    escalationRequirements: [
      { type: "technical_specialist", description: "Encoding rules into the workflow system", triggerConditions: ["Initial setup", "Rule schema changes"] },
      { type: "operations_admin", description: "Routine rule threshold changes", triggerConditions: ["Threshold tuning"] },
    ],
    evidenceRequirements: [
      { type: "deterministic_analysis", source: "Historical routing log", requiredConfidence: 0.85, dataPointsNeeded: 200 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-AI-CLASSIFY-REVIEW-01",
    name: "AI-assisted classification with human review",
    supportedPaths: ["ai", "hybrid"],
    problemPatterns: ["unstructured text", "ambiguous requests at scale", "probabilistic classification", "language interpretation"],
    requiredConditions: [
      { type: "prerequisite", statement: "Labeled examples exist or can be collected within 4 weeks", evidenceTags: ["training_data"] },
      { type: "requirement", statement: "Errors are tolerable when routed to human review", evidenceTags: ["error_tolerance"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "Volume below ~100 items/month", evidenceTags: ["volume"] },
      { type: "disqualifier", statement: "Zero error tolerance with regulatory accountability", evidenceTags: ["compliance"] },
    ],
    requiredData: [
      { type: "unstructured", description: "Raw items (tickets, emails, requests)", source: "system_of_record", requiredConfidence: 0.8 },
      { type: "historical", description: "Human-resolved examples for evaluation", source: "system_of_record", requiredConfidence: 0.8 },
    ],
    requiredSystems: [
      { type: "ai_model", name: "Classifier or LLM endpoint", configuration: "Confidence-thresholded with review queue" },
      { type: "workflow_tool", name: "Review queue", configuration: "Low-confidence items route to humans" },
    ],
    humanRoles: [
      { type: "reviewer", department: "Operations", responsibility: "Review low-confidence classifications", timeCommitment: "varies with volume" },
      { type: "owner", department: "Operations", responsibility: "Owns accuracy targets and thresholds", timeCommitment: "2h/week" },
    ],
    implementationPhases: [
      { phase: 1, name: "Baseline evaluation", description: "Label sample; measure baseline accuracy", estimatedDuration: "2 weeks", deliverable: "Baseline accuracy report", dependencies: [], requiredResources: ["Analyst"] },
      { phase: 2, name: "Pilot with review", description: "Deploy with 100% human review, then taper", estimatedDuration: "3-4 weeks", deliverable: "Pilot accuracy + review burden report", dependencies: ["Baseline evaluation"], requiredResources: ["Engineer", "Reviewers"] },
      { phase: 3, name: "Steady state", description: "Threshold tuned to accuracy/review tradeoff", estimatedDuration: "1 week", deliverable: "Live system with monitoring", dependencies: ["Pilot with review"], requiredResources: ["Owner"] },
    ],
    securityConsiderations: [
      { category: "data_privacy", description: "Unstructured items may contain PII", mitigationStrategy: "PII redaction before model calls; vendor DPA" },
    ],
    successMetrics: [
      { name: "Auto-resolution rate", definition: "% items resolved without human review", baselineValue: 0, targetValue: 70, unit: "%", measurementFrequency: "weekly" },
      { name: "Classification accuracy", definition: "Accuracy on reviewed sample", baselineValue: 0, targetValue: 95, unit: "%", measurementFrequency: "weekly" },
    ],
    commonFailureModes: [
      { probability: "medium", impact: "high", description: "Distribution shift degrades accuracy silently", mitigation: "Weekly sampled review with accuracy alerting" },
      { probability: "high", impact: "low", description: "Review queue fatigue", mitigation: "Tune thresholds; cap review volume" },
    ],
    escalationRequirements: [
      { type: "software_engineer", description: "Model integration and threshold infrastructure", triggerConditions: ["Initial build", "Accuracy regression"] },
    ],
    evidenceRequirements: [
      { type: "user_data", source: "Historical ticket/request log", requiredConfidence: 0.8, dataPointsNeeded: 500 },
      { type: "ai_inference", source: "Baseline evaluation run", requiredConfidence: 0.7, dataPointsNeeded: 100 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-PROCESS-REDESIGN-01",
    name: "Approval-process redesign",
    supportedPaths: ["process_redesign"],
    problemPatterns: ["redundant approvals", "unclear ownership", "unnecessary handoffs", "policy conflict", "missing SOP"],
    requiredConditions: [
      { type: "prerequisite", statement: "An executive sponsor can mandate the new process", evidenceTags: ["sponsorship"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "No accountable owner can be named even after redesign", evidenceTags: ["ownership"] },
    ],
    requiredData: [
      { type: "structured", description: "Approval chain map with cycle times per stage", source: "workflow_system", requiredConfidence: 0.7 },
    ],
    requiredSystems: [],
    humanRoles: [
      { type: "owner", department: "Operations", responsibility: "Redesigned process owner", timeCommitment: "4h/week during rollout" },
      { type: "approver", department: "Executive", responsibility: "Sponsor who mandates the change", timeCommitment: "1h/week" },
    ],
    implementationPhases: [
      { phase: 1, name: "Map current state", description: "Document every approval stage and its actual purpose", estimatedDuration: "1 week", deliverable: "Current-state map", dependencies: [], requiredResources: ["Ops lead"] },
      { phase: 2, name: "Redesign", description: "Remove redundant stages; assign single owner", estimatedDuration: "1-2 weeks", deliverable: "Future-state SOP", dependencies: ["Map current state"], requiredResources: ["Sponsor", "Owner"] },
      { phase: 3, name: "Rollout + measure", description: "Train team; measure cycle time weekly", estimatedDuration: "2-4 weeks", deliverable: "Cycle-time report", dependencies: ["Redesign"], requiredResources: ["Whole team"] },
    ],
    securityConsiderations: [],
    successMetrics: [
      { name: "Approval stages", definition: "Number of sequential approvals", baselineValue: 12, targetValue: 4, unit: "count", measurementFrequency: "monthly" },
      { name: "Cycle time", definition: "Request to decision", baselineValue: 10, targetValue: 2, unit: "days", measurementFrequency: "weekly" },
    ],
    commonFailureModes: [
      { probability: "high", impact: "medium", description: "Approvals creep back without ownership", mitigation: "Quarterly process audit by owner" },
      { probability: "medium", impact: "high", description: "Team routes around the new process", mitigation: "Sponsor enforcement + visible metrics" },
    ],
    escalationRequirements: [
      { type: "operations_admin", description: "SOP documentation and workflow tool configuration", triggerConditions: ["Rollout"] },
      { type: "business_configurable", description: "Routine threshold tweaks", triggerConditions: ["Tuning"] },
    ],
    evidenceRequirements: [
      { type: "user_data", source: "Approval workflow records", requiredConfidence: 0.7, dataPointsNeeded: 50 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-HUMAN-OWNERSHIP-01",
    name: "Deliberate human ownership for high-stakes judgment",
    supportedPaths: ["human_work"],
    problemPatterns: ["rare high-stakes cases", "empathy required", "regulatory accountability", "unresolved ambiguity", "low volume"],
    requiredConditions: [
      { type: "prerequisite", statement: "A named, accountable individual accepts ownership", evidenceTags: ["ownership"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "Volume grows beyond sustainable human capacity", evidenceTags: ["volume"] },
    ],
    requiredData: [],
    requiredSystems: [],
    humanRoles: [
      { type: "owner", department: "Legal", responsibility: "Accountable decision-maker", timeCommitment: "as needed" },
    ],
    implementationPhases: [
      { phase: 1, name: "Assign ownership", description: "Name accountable owner and backup", estimatedDuration: "1 week", deliverable: "Ownership charter", dependencies: [], requiredResources: ["Executive sponsor"] },
      { phase: 2, name: "Document criteria", description: "Write down judgment criteria for consistency", estimatedDuration: "1-2 weeks", deliverable: "Decision criteria doc", dependencies: ["Assign ownership"], requiredResources: ["Owner"] },
    ],
    securityConsiderations: [
      { category: "audit_trail", description: "High-stakes decisions must be documented", mitigationStrategy: "Decision log with rationale" },
    ],
    successMetrics: [
      { name: "Decision latency", definition: "Time from case open to decision", baselineValue: 5, targetValue: 2, unit: "days", measurementFrequency: "monthly" },
    ],
    commonFailureModes: [
      { probability: "medium", impact: "high", description: "Single point of failure on one person", mitigation: "Named backup + documented criteria" },
    ],
    escalationRequirements: [
      { type: "security_or_legal_review", description: "Regulatory sign-off for high-stakes decisions", triggerConditions: ["Each decision class change"] },
    ],
    evidenceRequirements: [
      { type: "user_data", source: "Case history", requiredConfidence: 0.6, dataPointsNeeded: 10 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-HYBRID-SYNTHESIS-01",
    name: "Structured automation with AI judgment and human exception handling",
    supportedPaths: ["hybrid"],
    problemPatterns: ["mixed structured and unstructured work", "high volume with judgment", "staged automation"],
    requiredConditions: [
      { type: "prerequisite", statement: "Work can be decomposed into structured steps and judgment steps", evidenceTags: ["process_map"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "No part of the work is stable enough to structure", evidenceTags: ["rule_stability"] },
    ],
    requiredData: [
      { type: "structured", description: "Structured fields for the deterministic portion", source: "system_of_record", requiredConfidence: 0.8 },
      { type: "unstructured", description: "Documents/messages for the judgment portion", source: "system_of_record", requiredConfidence: 0.7 },
    ],
    requiredSystems: [
      { type: "workflow_tool", name: "Orchestration", configuration: "Routes items between rules, model, and humans" },
      { type: "ai_model", name: "Judgment model", configuration: "Assists on unstructured portion only" },
    ],
    humanRoles: [
      { type: "reviewer", department: "Operations", responsibility: "Handles exceptions and model review", timeCommitment: "varies" },
    ],
    implementationPhases: [
      { phase: 1, name: "Decompose", description: "Split workflow into deterministic and judgment steps", estimatedDuration: "1-2 weeks", deliverable: "Step-level workflow map", dependencies: [], requiredResources: ["Ops lead"] },
      { phase: 2, name: "Automate deterministic steps", description: "Ship rules for the structured portion first", estimatedDuration: "2-4 weeks", deliverable: "Partial automation live", dependencies: ["Decompose"], requiredResources: ["Technical specialist"] },
      { phase: 3, name: "Add AI assistance", description: "Model assists judgment steps with human approval", estimatedDuration: "4-8 weeks", deliverable: "Hybrid flow live", dependencies: ["Automate deterministic steps"], requiredResources: ["Engineer", "Reviewers"] },
    ],
    securityConsiderations: [
      { category: "data_privacy", description: "Model sees only the judgment-step payload", mitigationStrategy: "Field-level scoping" },
    ],
    successMetrics: [
      { name: "End-to-end cycle time", definition: "Trigger to completion", baselineValue: 100, targetValue: 40, unit: "% of baseline", measurementFrequency: "weekly" },
    ],
    commonFailureModes: [
      { probability: "medium", impact: "medium", description: "Boundary between rules and model blurs over time", mitigation: "Quarterly step-level audit" },
    ],
    escalationRequirements: [
      { type: "software_engineer", description: "Orchestration build", triggerConditions: ["Initial build"] },
    ],
    evidenceRequirements: [
      { type: "user_data", source: "Workflow records", requiredConfidence: 0.75, dataPointsNeeded: 200 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-NO-ACTION-01",
    name: "No-action readiness plan",
    supportedPaths: ["no_action_yet"],
    problemPatterns: ["missing owner", "insufficient evidence", "poor data readiness", "unstable process", "excessive risk"],
    requiredConditions: [],
    disqualifiers: [
      { type: "disqualifier", statement: "Impact is high and ownership is clear — deferral is avoidance, not strategy", evidenceTags: ["impact"] },
    ],
    requiredData: [],
    requiredSystems: [],
    humanRoles: [
      { type: "stakeholder", department: "Operations", responsibility: "Tracks the deferral trigger conditions", timeCommitment: "30min/month" },
    ],
    implementationPhases: [
      { phase: 1, name: "Define triggers", description: "Write the conditions that would re-open this problem", estimatedDuration: "1 day", deliverable: "Trigger list", dependencies: [], requiredResources: ["Ops lead"] },
      { phase: 2, name: "Resolve blockers", description: "Fix ownership/evidence gaps that block intervention", estimatedDuration: "varies", deliverable: "Re-assessment", dependencies: ["Define triggers"], requiredResources: ["Executive sponsor"] },
    ],
    securityConsiderations: [],
    successMetrics: [
      { name: "Blockers resolved", definition: "Deferral triggers cleared", baselineValue: 0, targetValue: 100, unit: "%", measurementFrequency: "monthly" },
    ],
    commonFailureModes: [
      { probability: "medium", impact: "medium", description: "Deferred problem silently worsens", mitigation: "Monthly trigger review" },
    ],
    escalationRequirements: [
      { type: "business_configurable", description: "Trigger review is a business decision", triggerConditions: ["Monthly review"] },
    ],
    evidenceRequirements: [],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-KNOWLEDGE-RETRIEVAL-01",
    name: "Internal knowledge retrieval",
    supportedPaths: ["ai", "hybrid"],
    problemPatterns: ["tribal knowledge", "slow answers to repeated questions", "documentation exists but is not findable"],
    requiredConditions: [
      { type: "prerequisite", statement: "Source documents exist somewhere (docs, tickets, chats)", evidenceTags: ["corpus"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "Answers require judgment beyond retrieval", evidenceTags: ["judgment"] },
    ],
    requiredData: [
      { type: "unstructured", description: "Documentation corpus", source: "docs/wiki/tickets", requiredConfidence: 0.7 },
    ],
    requiredSystems: [
      { type: "ai_model", name: "Retrieval + answer synthesis", configuration: "Grounded answers with citations" },
    ],
    humanRoles: [
      { type: "owner", department: "Operations", responsibility: "Corpus freshness", timeCommitment: "1h/week" },
    ],
    implementationPhases: [
      { phase: 1, name: "Corpus assembly", description: "Identify and index source documents", estimatedDuration: "1-2 weeks", deliverable: "Indexed corpus", dependencies: [], requiredResources: ["Owner"] },
      { phase: 2, name: "Pilot", description: "Team uses retrieval for 2 weeks; measure deflection", estimatedDuration: "2 weeks", deliverable: "Deflection report", dependencies: ["Corpus assembly"], requiredResources: ["Team"] },
    ],
    securityConsiderations: [
      { category: "access_control", description: "Answers must respect document permissions", mitigationStrategy: "Permission-aware retrieval" },
    ],
    successMetrics: [
      { name: "Question deflection", definition: "% repeated questions answered without a human", baselineValue: 0, targetValue: 50, unit: "%", measurementFrequency: "weekly" },
    ],
    commonFailureModes: [
      { probability: "medium", impact: "medium", description: "Stale corpus produces wrong answers", mitigation: "Citation requirements + freshness alerts" },
    ],
    escalationRequirements: [
      { type: "technical_specialist", description: "Retrieval system setup", triggerConditions: ["Initial setup"] },
    ],
    evidenceRequirements: [
      { type: "user_data", source: "Question logs", requiredConfidence: 0.6, dataPointsNeeded: 100 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-DATA-SYNC-01",
    name: "Structured data synchronization",
    supportedPaths: ["deterministic_software"],
    problemPatterns: ["repetitive data movement between systems", "copy-paste between tools", "duplicate entry"],
    requiredConditions: [
      { type: "prerequisite", statement: "Both systems expose APIs or exports", evidenceTags: ["api_access"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "Field semantics differ irreconcilably between systems", evidenceTags: ["schema"] },
    ],
    requiredData: [
      { type: "structured", description: "Field mapping between systems", source: "schema docs", requiredConfidence: 0.9 },
    ],
    requiredSystems: [
      { type: "integration", name: "iPaaS or custom sync", configuration: "Scheduled sync with conflict rules" },
    ],
    humanRoles: [
      { type: "owner", department: "Operations", responsibility: "Owns mapping and conflict resolution", timeCommitment: "1h/week" },
    ],
    implementationPhases: [
      { phase: 1, name: "Field mapping", description: "Define source-of-truth per field", estimatedDuration: "1 week", deliverable: "Mapping doc", dependencies: [], requiredResources: ["Owner"] },
      { phase: 2, name: "Sync build + verify", description: "Build sync; reconcile a full historical pass", estimatedDuration: "2-3 weeks", deliverable: "Verified sync", dependencies: ["Field mapping"], requiredResources: ["Technical specialist"] },
    ],
    securityConsiderations: [
      { category: "data_privacy", description: "Cross-system sync expands data surface", mitigationStrategy: "Minimum-field sync; encrypted transit" },
    ],
    successMetrics: [
      { name: "Duplicate entry eliminated", definition: "Manual re-keying events per week", baselineValue: 100, targetValue: 0, unit: "events", measurementFrequency: "weekly" },
    ],
    commonFailureModes: [
      { probability: "medium", impact: "medium", description: "Silent sync failures create divergence", mitigation: "Daily reconciliation counts with alerting" },
    ],
    escalationRequirements: [
      { type: "technical_specialist", description: "Sync build and API work", triggerConditions: ["Initial build", "Schema changes"] },
    ],
    evidenceRequirements: [
      { type: "deterministic_analysis", source: "System schemas", requiredConfidence: 0.9, dataPointsNeeded: 1 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-REPORTING-AUTO-01",
    name: "Reporting automation",
    supportedPaths: ["deterministic_software"],
    problemPatterns: ["recurring manual report compilation", "copy-paste dashboards", "monthly deck assembly"],
    requiredConditions: [
      { type: "prerequisite", statement: "Metrics are defined and data sources are stable", evidenceTags: ["metric_definitions"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "Metrics change every cycle", evidenceTags: ["metric_stability"] },
    ],
    requiredData: [
      { type: "structured", description: "Metric definitions and source queries", source: "analytics", requiredConfidence: 0.85 },
    ],
    requiredSystems: [
      { type: "analytics", name: "BI or scheduled query", configuration: "Auto-refresh with distribution" },
    ],
    humanRoles: [
      { type: "owner", department: "Operations", responsibility: "Metric definitions", timeCommitment: "1h/month" },
    ],
    implementationPhases: [
      { phase: 1, name: "Metric freeze", description: "Lock definitions for one cycle", estimatedDuration: "3 days", deliverable: "Definition doc", dependencies: [], requiredResources: ["Owner"] },
      { phase: 2, name: "Automate", description: "Scheduled queries + auto-distribution", estimatedDuration: "1-2 weeks", deliverable: "Automated report", dependencies: ["Metric freeze"], requiredResources: ["Analyst"] },
    ],
    securityConsiderations: [
      { category: "access_control", description: "Auto-distributed reports may over-share", mitigationStrategy: "Distribution list review" },
    ],
    successMetrics: [
      { name: "Compilation time", definition: "Hours to produce the recurring report", baselineValue: 8, targetValue: 0.5, unit: "hours", measurementFrequency: "monthly" },
    ],
    commonFailureModes: [
      { probability: "low", impact: "medium", description: "Upstream data change breaks the report", mitigation: "Query tests + owner alert" },
    ],
    escalationRequirements: [
      { type: "operations_admin", description: "BI configuration", triggerConditions: ["Setup", "Metric changes"] },
    ],
    evidenceRequirements: [
      { type: "user_data", source: "Report samples", requiredConfidence: 0.8, dataPointsNeeded: 3 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
  {
    id: "IB-VENDOR-CONFIG-01",
    name: "Existing-vendor configuration",
    supportedPaths: ["deterministic_software", "no_action_yet"],
    problemPatterns: ["underused existing software", "paying for features not enabled", "manual work the current stack already solves"],
    requiredConditions: [
      { type: "prerequisite", statement: "Capability exists in a tool the company already licenses", evidenceTags: ["license"] },
    ],
    disqualifiers: [
      { type: "disqualifier", statement: "Capability requires a tier upgrade exceeding build cost", evidenceTags: ["cost"] },
    ],
    requiredData: [],
    requiredSystems: [
      { type: "existing_vendor", name: "Existing platform", configuration: "Enable/configure dormant module" },
    ],
    humanRoles: [
      { type: "owner", department: "Operations", responsibility: "Vendor configuration owner", timeCommitment: "2h/week during setup" },
    ],
    implementationPhases: [
      { phase: 1, name: "Capability audit", description: "Confirm the licensed tool solves the problem", estimatedDuration: "3 days", deliverable: "Audit note", dependencies: [], requiredResources: ["Owner"] },
      { phase: 2, name: "Configure + train", description: "Enable feature; train the team", estimatedDuration: "1-2 weeks", deliverable: "Working configuration", dependencies: ["Capability audit"], requiredResources: ["Vendor CSM", "Team"] },
    ],
    securityConsiderations: [],
    successMetrics: [
      { name: "Feature adoption", definition: "% team using the enabled capability", baselineValue: 0, targetValue: 80, unit: "%", measurementFrequency: "weekly" },
    ],
    commonFailureModes: [
      { probability: "high", impact: "low", description: "Configured but not adopted", mitigation: "Training + usage dashboard" },
    ],
    escalationRequirements: [
      { type: "business_configurable", description: "No engineering required", triggerConditions: ["Configuration"] },
    ],
    evidenceRequirements: [
      { type: "research", source: "Vendor documentation", requiredConfidence: 0.8, dataPointsNeeded: 1 },
    ],
    version: INTERVENTION_BLUEPRINT_VERSION,
  },
];

export function blueprintsForPath(path: InterventionPath): InterventionBlueprint[] {
  return interventionBlueprints.filter((b) => b.supportedPaths.includes(path));
}

export function matchBlueprintsForProblem(patterns: string[]): InterventionBlueprint[] {
  const lowered = patterns.map((p) => p.toLowerCase());
  return interventionBlueprints.filter((b) =>
    b.problemPatterns.some((pp) => lowered.some((p) => p.includes(pp) || pp.includes(p))),
  );
}
