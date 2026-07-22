"use strict";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { RankedOpportunity } from "../src/types/index.js";
import { RankOpportunitiesInput } from "../src/stages/05-rank-opportunities.js";

// Test fixtures
const mockCandidates = [
  {
    id: "candidate-1",
    blueprintId: "BP-SALES-001",
    title: "Automated Sales Qualification & Routing",
    problemStatement: "Your sales team lacks a standardized qualification framework",
    targetWorkflow: "Lead intake → qualification → routing → follow-up scheduling",
    department: "Sales",
    businessObjective: "Reduce time-to-qualification and improve lead conversion",
    proposedSystemType: "AI-powered lead qualification and routing engine",
    detectedSignals: ["manual lead triage", "inconsistent qualification"],
    requiredCapabilities: ["CRM integration", "lead scoring model"],
    dependencies: [],
    risks: ["CRM data quality"],
    evidenceIds: ["det-pain-sales-qual"],
    candidateSource: "blueprint" as const,
  },
  {
    id: "candidate-2",
    blueprintId: "BP-FIN-001",
    title: "Accounts Payable Automation",
    problemStatement: "Manual invoice processing, expense approvals, payment bottlenecks",
    targetWorkflow: "Invoice receipt → data entry → approval routing → payment processing",
    department: "Finance",
    businessObjective: "Reduce manual processing time by 80%, accelerate month-end close",
    proposedSystemType: "AI-powered accounts payable automation",
    detectedSignals: ["manual invoice processing", "slow month-end close"],
    requiredCapabilities: ["OCR/document processing", "ERP integration"],
    dependencies: ["ERP API access"],
    risks: ["ERP integration complexity"],
    evidenceIds: ["det-finance-close", "det-finance-expenses"],
    candidateSource: "blueprint" as const,
  },
];

const mockAnswers = [
  { questionId: 1, value: true, type: "boolean", wasSkipped: false },
  { questionId: 2, value: "3 - Balanced", type: "scale", wasSkipped: false },
  { questionId: 3, value: "Salesforce", type: "text", wasSkipped: false },
];

const mockCompany = {};
const mockWorkflowSignals = {};
const mockEvidence = [];

describe("Ranking Tests", () => {
  beforeEach(() => {});

  it("should produce Tier 1 for high feasibility and business leverage", () => {
    const input: RankOpportunitiesInput = {
      candidates: mockCandidates,
      answers: mockAnswers,
      company: mockCompany,
      workflowSignals: mockWorkflowSignals,
      evidence: mockEvidence,
    };
    // Import and run ranking stage
    const { rankOpportunities } = require("../src/stages/05-rank-opportunities.js");
    const result = await rankOpportunities(input, {
      sessionId: "test-session",
      userId: "test-user",
      supabase: null,
      log: () => {},
      requestId: "test-request",
    } as any);

    expect(result.ranked).toHaveLength(2);
    expect(result.ranked[0]).toBeDefined();
    expect(result.ranked[0].tier).toBe(1);
    expect(result.ranked[0].recommendation).toBe("build_now");
    expect(result.ranked[0].feasibility.label).toBe("pass");
    expect(result.ranked[0].businessLeverage.label).toBe("pass");
    expect(result.ranked[1].tier).toBe(2);
    expect(result.ranked[1].recommendation).toBe("validate_next");
  });

  it("should identify feasible but low-value opportunity -> Tier 3", () => {
    const lowValueCandidate = {
      id: "candidate-low",
      title: "Minor Feature Enhancement",
      problemStatement: "Small improvement to existing dashboard",
      targetWorkflow: "Manual data entry",
      department: "Engineering",
      businessObjective: "Minor productivity gain",
      proposedSystemType: "Simple script",
      detectedSignals: ["minor manual effort"],
      requiredCapabilities: ["simple scripting"],
      dependencies: ["developer time"],
      risks: [],
      evidenceIds: ["det-low-impact"],
      candidateSource: "composite" as const,
    };

    const input: RankOpportunitiesInput = {
      candidates: [mockCandidates[0], lowValueCandidate],
      answers: mockAnswers,
      company: mockCompany,
      workflowSignals: mockWorkflowSignals,
      evidence: mockEvidence,
    };

    const { rankOpportunities } = require("../src/stages/05-rank-opportunities.js");
    const result = await rankOpportunities(input, {
      sessionId: "test-session",
      userId: "test-user",
      supabase: null,
      log: () => {},
      requestId: "test-request",
    } as any);

    expect(result.ranked).toHaveLength(2);
    expect(result.ranked[1].tier).toBe(3);
    expect(result.ranked[1].recommendation).toBe("defer");
    expect(result.ranked[1].feasibility.label).toBe("pass");
    expect(result.ranked[1].businessLeverage.score).toBeLessThanOrEqualTo(10);
  });

  it("should produce deterministic output for same input", () => {
    const input: RankOpportunitiesInput = {
      candidates: mockCandidates,
      answers: mockAnswers,
      company: mockCompany,
      workflowSignals: mockWorkflowSignals,
      evidence: mockEvidence,
    };

    const { rankOpportunities } = require("../src/stages/05-rank-opportunities.js");
    const result1 = await rankOpportunities(input, {
      sessionId: "test-session",
      userId: "test-user",
      supabase: null,
      log: () => {},
      requestId: "test-request",
    } as any);
    const result2 = await rankOpportunities(input, {
      sessionId: "test-session",
      userId: "test-user",
      supabase: null,
      log: () => {},
      requestId: "test-request",
    } as any);

    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
  });

  it("should produce all candidates as Tier 4 when feasibility fails", () => {
    const noDataCandidate = {
      id: "candidate-no-evidence",
      title: "Mystery System",
      problemStatement: "Unknown problem",
      targetWorkflow: "",
      department: "Sales",
      businessObjective: "Unknown",
      proposedSystemType: "Unknown",
      detectedSignals: [],
      requiredCapabilities: [],
      dependencies: [],
      risks: [],
      evidenceIds: [],
      candidateSource: "custom" as const,
    };

    const input: RankOpportunitiesInput = {
      candidates: [noDataCandidate],
      answers: mockAnswers,
      company: mockCompany,
      workflowSignals: mockWorkflowSignals,
      evidence: mockEvidence,
    };

    const { rankOpportunities } = require("../src/stages/05-rank-opportunities.js");
    const result = await rankOpportunities(input, {
      sessionId: "test-session",
      userId: "test-user",
      supabase: null,
      log: () => {},
      requestId: "test-request",
    } as any);

    expect(result.ranked).toHaveLength(1);
    expect(result.ranked[0].tier).toBe(4);
    expect(result.ranked[0].feasibility.label).toBe("fail");
    expect(result.ranked[0].recommendation).toBe("do_not_pursue");
  });

  it("should handle conflicting evidence gracefully", () => {
    const conflictingCandidate = {
      id: "candidate-conflict",
      title: "Conflicting Solution",
      problemStatement: "Both good and bad signals present",
      targetWorkflow: "Manual process",
      department: "Operations",
      businessObjective: "Mixed impact",
      proposedSystemType: "Hybrid system",
      detectedSignals: ["manual bottleneck", "high data quality"],
      requiredCapabilities: ["integration", "analytics"],
      dependencies: [],
      risks: ["integration complexity", "data quality"],
      evidenceIds: ["evidence-good", "evidence-bad"],
      candidateSource: "composite" as const,
    };

    const input: RankOpportunitiesInput = {
      candidates: [conflictingCandidate],
      answers: mockAnswers,
      company: mockCompany,
      workflowSignals: mockWorkflowSignals,
      evidence: mockEvidence,
    };

    const { rankOpportunities } = require("../src/stages/05-rank-opportunities.js");
    const result = await rankOpportunities(input, {
      sessionId: "test-session",
      userId: "test-user",
      supabase: null,
      log: () => {},
      requestId: "test-request",
    } as any);

    expect(result.ranked).toHaveLength(1);
    expect([1, 2, 3, 4].includes(result.ranked[0].tier)).toBe(true);
    expect(["build_now", "validate_next", "defer", "do_not_pursue"].includes(result.ranked[0].recommendation)).toBe(true);
  });
});
