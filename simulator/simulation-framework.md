# Simulation Framework

## Overview

The Simulation Framework governs how scenarios are defined, executed, and evaluated. It ensures consistent testing methodology across all simulation types.

---

## Scenario Definition

Every scenario in the simulation library is defined by:

```yaml
scenario:
  id: "S-001"
  name: "Growth-Stage SaaS with Sales Friction"
  description: "A typical Series B SaaS company experiencing sales scaling friction"
  profile:
    company:
      name: "SynthCorp (synthetic)"
      size: 250
      revenueStage: "Series B"
      industry: "B2B SaaS"
      departments: ["Sales", "Marketing", "CS", "Support", "Finance", "Product", "Engineering", "HR", "Legal", "Ops"]
      orgComplexity: "Hierarchical"
      aiMaturity: "Experimental"
    technology:
      crm: "Salesforce"
      support: "Zendesk"
      hris: "BambooHR"
      engineering: ["GitHub", "Jira", "Slack"]
      cloud: "AWS"
    assessment:
      salesFriction: "High"
      supportFriction: "Medium"
      financeFriction: "Low"
      legalFriction: "Medium"
      csFriction: "High"
      completeness: 0.9  # 90% questions answered
  expected:
    topOpportunities: ["BP-SALES-01", "BP-CS-01", "BP-SUPP-01"]
    minOpportunityCount: 3
    maxOpportunityCount: 10
    tier1Opportunities: 1
    evidenceTraceability: true
```

---

## Execution Flow

```
1. Load scenario definition
2. Generate company profile from scenario parameters
3. Generate technology profile from scenario parameters
4. Generate assessment responses from scenario parameters
5. Run research agents (synthetic mode)
6. Run reasoning pipeline on synthetic data
7. Run validation suite on pipeline output
8. Compare actual output to expected output
9. Generate simulation report
```

---

## Evaluation Metrics

### Pipeline Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Pipeline completion rate | 100% | Percentage of scenarios that complete without error |
| Average processing time | < 5 min | Time from input to full output |
| Graceful degradation rate | 100% | Percentage of incomplete inputs that produce partial output |

### Quality Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Top opportunity recall | > 80% | Percentage of expected top opportunities that appear in actual output |
| Tier assignment accuracy | > 80% | Percentage of opportunities assigned to correct tier |
| Evidence traceability | 100% | Percentage of claims that trace to input evidence |
| Confidence calibration | > 80% | Percentage of confidence assignments that match evidence quality rules |

### Robustness Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Missing input handling | No crash | Pipeline handles missing optional inputs gracefully |
| Conflicting input handling | No crash | Pipeline handles conflicting evidence gracefully |
| Edge case coverage | > 90% | Percentage of edge case scenarios that complete |
| Determinism | 100% | Same inputs produce same outputs (deterministic mode) |

---

## Test Suites

### Suite 1: Smoke Tests (5 scenarios)

Quick validation that pipeline runs end-to-end:
- Minimal company (50 employees, single product, flat org)
- Full company (1000+ employees, 10 departments)
- Missing assessment (research-only mode)
- Very high friction company
- Very low friction company

### Suite 2: Department Coverage (10 scenarios)

Each scenario emphasizes one department:
- Sales-heavy: All sales friction high
- Support-heavy: All support friction high
- Mixed: Random distribution

### Suite 3: Edge Cases (10 scenarios)

Boundary conditions:
- No research data available
- All assessment responses "I don't know"
- Conflicting assessment vs. research
- Company with all 10 departments but 5000+ employees
- Sub-50 employee company
- Very high AI maturity
- Very low change capacity
- Multiple compliance frameworks
- No tech stack detected
- Company in transition (recent acquisition)

### Suite 4: Blueprint Coverage (50 scenarios)

Each scenario is designed to trigger a specific blueprint match. Verifies every blueprint in the library can be matched.

### Suite 5: Regression Tests (ongoing)

When a bug is found in production, a scenario is added that reproduces the bug. The scenario must pass in subsequent runs.
