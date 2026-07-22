# Scenario Library

## Overview

The Scenario Library contains predefined simulation scenarios organized by type. Each scenario is a JSON/YAML document that defines the synthetic company profile, technology stack, and assessment responses needed to test a specific pipeline behavior.

---

## Smoke Test Scenarios

### S-001: Minimal Company

```yaml
id: "S-001"
name: "Minimal Company"
description: "Smallest viable company profile"
profile:
  size: 50
  revenueStage: "Seed"
  departments: ["Sales", "Engineering", "Support"]
  orgComplexity: "Flat"
  aiMaturity: "None"
  assessment:
    completeness: 0.6
    salesFriction: "Medium"
    supportFriction: "Medium"
expected:
  minOpportunities: 1
  maxOpportunities: 5
  pipelineCompletes: true
```

### S-002: Full Enterprise

```yaml
id: "S-002"
name: "Full Enterprise"
description: "Large enterprise with all departments"
profile:
  size: 2500
  revenueStage: "Mature"
  departments: ["Sales", "Marketing", "CS", "Support", "Finance", "Product", "Engineering", "HR", "Legal", "Ops"]
  orgComplexity: "Matrix"
  aiMaturity: "Adopting"
  assessment:
    completeness: 1.0
    salesFriction: "Medium"
    marketingFriction: "Low"
    csFriction: "High"
    supportFriction: "High"
    financeFriction: "Medium"
    productFriction: "Medium"
    engFriction: "Low"
    hrFriction: "Low"
    legalFriction: "High"
    opsFriction: "Medium"
expected:
  minOpportunities: 8
  maxOpportunities: 15
  departmentCoverage: 10
```

---

## Edge Case Scenarios

### E-001: No Research Data

```yaml
id: "E-001"
name: "No Research Data"
description: "Company with no public signals"
profile:
  researchData:
    identity: false
    funding: false
    techStack: false
    leadership: false
    customer: false
  assessment:
    completeness: 0.8
expected:
  pipelineCompletes: true
  allConfidence: "Low or Medium"  # No [Research] evidence
```

### E-002: All "I Don't Know"

```yaml
id: "E-002"
name: "All I Don't Know"
description: "User answers 'I don't know' to all questions"
profile:
  size: 200
  revenueStage: "Series A"
  assessment:
    completeness: 0.9
    allIDontKnow: true
expected:
  pipelineCompletes: true
  evidenceClasses: ["Research", "Inference"]  # No [User] evidence
  minOpportunities: 1  # Research-only at minimum
```

### E-003: Conflicting Assessment vs. Research

```yaml
id: "E-003"
name: "Conflicting Assessment vs Research"
description: "User reports low friction but research shows high friction signals"
profile:
  size: 500
  revenueStage: "Series C"
  assessment:
    salesFriction: "Low"  # User says sales is fine
  research:
    salesSignals:
      - "40 open sales roles (hiring surge)"
      - "CEO says 'Sales productivity is our #1 challenge'"
      - "Customer reviews complain about slow sales response"
expected:
  conflictDetected: true
  conflictResolution: "Evidence precedence applied"
  finalTier: "Tier 2 or higher"  # Research overrides User for some signals
```

### E-004: Sub-50 Employee Company

```yaml
id: "E-004"
name: "Sub-50 Employee Company"
description: "Very small company, limited structure"
profile:
  size: 25
  revenueStage: "Seed"
  departments: ["Engineering", "Sales"]
  orgComplexity: "Flat"
  aiMaturity: "None"
  assessment:
    completeness: 0.5
expected:
  departmentLimit: 2  # Only existing departments get recommendations
  minOpportunities: 1
  maxOpportunities: 3
```

### E-005: High AI Maturity

```yaml
id: "E-005"
name: "High AI Maturity"
description: "Company already using AI extensively"
profile:
  size: 800
  revenueStage: "Growth"
  aiMaturity: "Leading"
  research:
    aiSignals:
      - "AI product features announced"
      - "20 AI-related job postings"
      - "Dedicated AI research team"
  assessment:
    aiAdoption: "Extensive"
expected:
  opportunitiesInclude: ["AI optimization", "Next-gen AI"]
  opportunitiesExclude: ["Basic AI"]  # Already have basic
```

---

## Department-Specific Scenarios

### D-001: Sales-Heavy

```yaml
id: "D-001"
name: "Sales-Heavy Profile"
description: "Maximum sales friction, all other departments low"
profile:
  size: 300
  departments: all
  assessment:
    salesFriction: "High"
    marketingFriction: "Low"
    csFriction: "Low"
    supportFriction: "Low"
    financeFriction: "Low"
    productFriction: "Low"
    engFriction: "Low"
    hrFriction: "Low"
    legalFriction: "Low"
    opsFriction: "Low"
expected:
  topBlueprint: startsWith "BP-SALES"
  salesOpportunityCount: 3+
  nonSalesOpportunityCount: 0
```

### D-002: Legal-Heavy (Enterprise)

```yaml
id: "D-002"
name: "Legal-Heavy Enterprise"
description: "High legal friction, high compliance needs"
profile:
  size: 1200
  departments: all
  complianceCertifications: ["SOC2", "HIPAA", "GDPR", "ISO27001"]
  assessment:
    legalFriction: "High"
expected:
  topBlueprint: startsWith "BP-LEGAL"
  legalOpportunityCount: 3+
```

---

## Blueprint Coverage Scenarios

Each of the 50 blueprints has a dedicated scenario designed to trigger a high match score. For example:

### BC-SALES-01: For BP-SALES-01

```yaml
id: "BC-SALES-01"
blueprint: "BP-SALES-01"
profile:
  size: 200
  revenueStage: "Series B"
  departments: ["Sales"]
  techStack: ["Salesforce", "HubSpot", "ZoomInfo", "Outreach"]
  assessment:
    qSales01: "Manual research using multiple tools"
    qSales02: 5  # Scale: extreme time on research
expected:
  matchScoreBP01: ">= 0.8"
  opportunityGeneratedBP01: true
```

---

## Benchmarking Scenarios

### B-001: Stripe-like

Profile emulating a Stripe-like company (payments, high scale, engineering-focused).

### B-002: HubSpot-like

Profile emulating a HubSpot-like company (marketing platform, mid-market, product-led growth).

### B-003: Toast-like

Profile emulating a Toast-like company (vertical SaaS, enterprise sales, high compliance).
