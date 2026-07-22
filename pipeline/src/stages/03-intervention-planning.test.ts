// Priority 13: Unit tests for intervention intelligence
import { describe, it, expect } from "vitest";
import {
  aiSuitability,
  deterministicSuitability,
  processRedesignSuitability,
  humanWorkSuitability,
  hybridSuitability,
  noActionSuitability,
} from "./03-intervention-planning.js";
import type { ProblemCharacteristics } from "./03-intervention-planning.js";
import { blueprintsForPath, interventionBlueprints } from "./intervention-blueprint-library.js";
import { INTERVENTION_ENGINE_VERSION, PRIORITIZATION_VERSION } from "../types/index.js";

const baseChars: ProblemCharacteristics = {
  dataStructure: "structured",
  ruleStability: "stable",
  ambiguity: "low",
  volume: "medium",
  stakes: "medium",
  judgmentRequired: "low",
  ownershipClarity: "clear",
  processMaturity: "documented",
  errorTolerance: "high",
  exceptionVolume: "low",
  empathyRequired: false,
  regulatoryAccountability: false,
};

const noImpact = { cost: 10000, timePerOccurrence: 30, userHoursPerWeek: 8, customerImpactScore: 4, strategicImportance: "medium" as const, revenueImpact: 0 };

describe("aiSuitability", () => {
  it("scores high for unstructured data with ambiguity", () => {
    const result = aiSuitability({ ...baseChars, dataStructure: "unstructured", ambiguity: "high", ruleStability: "changing", volume: "high" });
    expect(result.score).toBeGreaterThanOrEqual(7);
    expect(result.disqualifiers).toHaveLength(0);
  });

  it("disqualifies for low error tolerance with regulatory accountability", () => {
    const result = aiSuitability({ ...baseChars, errorTolerance: "low", regulatoryAccountability: true });
    expect(result.disqualifiers).toContain("Regulatory accountability with low error tolerance blocks probabilistic classification");
  });

  it("disqualifies for very low volume", () => {
    const result = aiSuitability({ ...baseChars, volume: "low" });
    expect(result.disqualifiers).toContain("Volume too low to train or justify a model");
  });

  it("consistent with version identifiers", () => {
    expect(INTERVENTION_ENGINE_VERSION).toBe("intervention_v1");
    expect(PRIORITIZATION_VERSION).toBe("four_pass_v2");
  });
});

describe("deterministicSuitability", () => {
  it("scores high for stable rules with structured data and low ambiguity", () => {
    const result = deterministicSuitability(baseChars);
    expect(result.score).toBeGreaterThanOrEqual(7);
    expect(result.disqualifiers).toHaveLength(0);
  });

  it("disqualifies for unstable rules", () => {
    const result = deterministicSuitability({ ...baseChars, ruleStability: "changing" });
    expect(result.disqualifiers).toContain("Unstable rules defeat fixed logic");
  });

  it("disqualifies for unstructured data", () => {
    const result = deterministicSuitability({ ...baseChars, dataStructure: "unstructured" });
    expect(result.disqualifiers).toContain("Unstructured inputs cannot be handled by rules alone");
  });

  it("disqualifies when ownership is unclear", () => {
    const result = deterministicSuitability({ ...baseChars, ownershipClarity: "unclear" });
    expect(result.disqualifiers).toContain("No clear owner to maintain and change-control encoded rules");
  });
});

describe("processRedesignSuitability", () => {
  it("scores high for ad-hoc process with unclear ownership", () => {
    const result = processRedesignSuitability({ ...baseChars, ownershipClarity: "unclear", processMaturity: "ad_hoc", exceptionVolume: "high", ambiguity: "high", judgmentRequired: "high" });
    expect(result.score).toBeGreaterThanOrEqual(6);
  });

  it("disqualifies for already-documented processes with clear ownership", () => {
    const result = processRedesignSuitability(baseChars);
    expect(result.disqualifiers).toContain("Process is already documented and owned; redesign adds little");
  });
});

describe("humanWorkSuitability", () => {
  it("scores high for rare high-stakes regulatory work", () => {
    const result = humanWorkSuitability({ ...baseChars, volume: "low", stakes: "high", regulatoryAccountability: true, empathyRequired: true, judgmentRequired: "high", ambiguity: "high" });
    expect(result.score).toBeGreaterThanOrEqual(7);
    expect(result.disqualifiers).toHaveLength(0);
  });

  it("disqualifies high-volume low-judgment work from staying manual", () => {
    const result = humanWorkSuitability({ ...baseChars, volume: "high", judgmentRequired: "low" });
    expect(result.disqualifiers).toContain("High-volume low-judgment work should not stay manual");
  });
});

describe("hybridSuitability", () => {
  it("scores high for mixed structured/unstructured work with high volume and judgment needs", () => {
    const result = hybridSuitability({ ...baseChars, dataStructure: "mixed", exceptionVolume: "high", stakes: "high", volume: "high", judgmentRequired: "high", ruleStability: "changing" });
    expect(result.score).toBeGreaterThanOrEqual(6);
  });

  it("disqualifies for simple structured work at low volume", () => {
    const result = hybridSuitability({ ...baseChars, volume: "low", dataStructure: "structured" });
    expect(result.disqualifiers).toContain("Too simple and too rare to justify a hybrid build");
  });
});

describe("noActionSuitability", () => {
  it("scores highly for low-importance problems with no owner", () => {
    const result = noActionSuitability({ ...baseChars, ownershipClarity: "unclear", volume: "low" }, { ...noImpact, userHoursPerWeek: 4, strategicImportance: "low" });
    expect(result.score).toBeGreaterThanOrEqual(6);
    expect(result.disqualifiers).toHaveLength(0);
  });

  it("disqualifies for strategically important problems", () => {
    const result = noActionSuitability({ ...baseChars, ownershipClarity: "clear" }, { ...noImpact, strategicImportance: "high", userHoursPerWeek: 10 });
    expect(result.disqualifiers).toContain("Strategically important — deferring is itself a decision with cost");
  });

  it("disqualifies problems with high weekly burden", () => {
    const result = noActionSuitability({ ...baseChars, ownershipClarity: "clear" }, { ...noImpact, userHoursPerWeek: 25, strategicImportance: "low" });
    expect(result.disqualifiers).toContain("Weekly burden too large to defer without explicit rationale");
  });
});

describe("interventionBlueprintLibrary", () => {
  it("contains blueprints for all 6 intervention paths", () => {
    const paths = ["ai", "deterministic_software", "process_redesign", "human_work", "hybrid", "no_action_yet"];
    for (const p of paths) {
      const bps = blueprintsForPath(p as any);
      expect(bps.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns the same library deterministically", () => {
    const b1 = interventionBlueprints.map((b) => b.id);
    const b2 = interventionBlueprints.map((b) => b.id);
    expect(b1).toEqual(b2);
  });

  it("each blueprint declares a non-empty supportedPaths array", () => {
    for (const bp of interventionBlueprints) {
      expect(bp.supportedPaths.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("each blueprint has valid version string", () => {
    for (const bp of interventionBlueprints) {
      expect(bp.version).toBeTruthy();
    }
  });
});
