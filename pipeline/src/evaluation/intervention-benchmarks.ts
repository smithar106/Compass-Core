// Priority 10: Intervention-path benchmark fixtures
// 6 cases covering all 6 intervention paths. These fixtures prove that Compass
// does not recommend AI reflexively. Each fixture relies on the deterministic
// suitability functions in 03-intervention-planning.ts.

import type { InterventionPath } from "../types/index.js";

export interface InterventionFixture {
  id: string;
  name: string;
  answers: Record<number, string | number | boolean>;
  expected: {
    department?: string;
    expectedPath: InterventionPath;
    problemId: string;
    confidenceMin?: number;
    confidenceMax?: number;
  };
  description: string;
  category: InterventionPath;
}

// Baseline answers — every system present, no gaps.
const ALL_GOOD: Record<number, string | number | boolean> = {
  1: true, 2: "5", 3: "Salesforce", 4: true, 5: "5", 6: "Multi-touch",
  7: true, 8: "5", 9: "Gainsight", 10: "50%+", 11: true, 12: "< 1 hour",
  13: true, 14: "< 1 day", 15: true, 16: "RICE scoring", 17: true,
  18: "Comprehensive and up to date", 19: "< 4 hours", 20: true,
  21: "Quarterly reviews", 22: true, 23: "Automated compliance monitoring",
  24: true, 25: "Nothing urgent",
};

export const interventionFixtures: InterventionFixture[] = [
  {
    id: "INT-DET-01",
    category: "deterministic_software",
    name: "Stable invoice routing rules → deterministic software",
    description: "Finance department with manual invoice processing, stable structured data, and clear ownership. Deterministic routing should win because rules are stable and inputs are structured; AI is disqualified by low error tolerance and regulatory accountability.",
    answers: { ...ALL_GOOD, 13: false, 14: "3-5 days" },
    expected: {
      department: "Finance",
      expectedPath: "deterministic_software",
      problemId: "problem-finance-close",
      confidenceMin: 0.5,
      confidenceMax: 0.95,
    },
  },
  {
    id: "INT-REDESIGN-01",
    category: "process_redesign",
    name: "Twelve-stage approval process → process redesign",
    description: "Organizational approval chains are long and ownership is unclear. Process redesign should win because No owner exists to maintain any tooling, and the primary defect is the process itself, not the technology supporting it.",
    answers: { ...ALL_GOOD, 13: false, 14: "15+ days" },
    expected: {
      department: "Operations",
      expectedPath: "process_redesign",
      problemId: "problem-approval-chain",
      confidenceMin: 0.5,
      confidenceMax: 0.95,
    },
  },
  {
    id: "INT-HUMAN-01",
    category: "human_work",
    name: "Rare high-stakes disciplinary review → human work",
    description: "Legal department manually reviews every standard contract. Volume is low, stakes are high, and regulatory accountability demands a named human decision-maker. AI is disqualified by low error tolerance; deterministic cannot handle the unstructured input; the right answer is deliberate human ownership.",
    answers: { ...ALL_GOOD, 22: false },
    expected: {
      department: "Legal",
      expectedPath: "human_work",
      problemId: "problem-legal-review",
      confidenceMin: 0.5,
      confidenceMax: 0.95,
    },
  },
  {
    id: "INT-AI-01",
    category: "ai",
    name: "Ambiguous customer requests at scale → AI with human review",
    description: "Support ticket triage is manual, volume is high, inputs are unstructured, and patterns change monthly. Deterministic is disqualified by unstructured data; the correct path is AI-based classification with low-confidence items routed to human review.",
    answers: { ...ALL_GOOD, 10: "0-10%", 11: false },
    expected: {
      department: "Support",
      expectedPath: "ai",
      problemId: "problem-support-triage",
      confidenceMin: 0.5,
      confidenceMax: 0.95,
    },
  },
  {
    id: "INT-NO-ACTION-01",
    category: "no_action_yet",
    name: "Broken workflow with no owner → no action until ownership resolved",
    description: "Operational workflows are ad-hoc with duplicated approvals and no clear owner. Strategic importance is low and the weekly burden is modest. Process redesign ties with no-action on score, but the tiebreak goes to no-action (lower implementation complexity) because the first step must be resolving ownership before any process change.",
    answers: { ...ALL_GOOD, 24: false },
    expected: {
      department: "Operations",
      expectedPath: "no_action_yet",
      problemId: "problem-ops-ownership",
      confidenceMin: 0.3,
      confidenceMax: 0.95,
    },
  },
  {
    id: "INT-HYBRID-01",
    category: "hybrid",
    name: "Repetitive proposal synthesis with mixed inputs → hybrid",
    description: "Customer success lacks early risk detection. The work combines structured usage data with unstructured interaction signals. Hybrid is the best fit because the deterministic portion (usage metrics) can be automated while the judgment portion (outreach, empathy) stays with humans.",
    answers: { ...ALL_GOOD, 7: false, 8: "1 - Reactive only" },
    expected: {
      department: "Customer Success",
      expectedPath: "hybrid",
      problemId: "problem-cs-reactive",
      confidenceMin: 0.5,
      confidenceMax: 0.95,
    },
  },
];
