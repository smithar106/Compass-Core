# Example Simulations

This document shows example simulation outputs for different scenario types.

---

## Simulation 1: "Smoke Test — Minimal Company"

### Scenario
- 50 employees, Seed stage, Flat org
- Departments: Sales, Engineering, Support
- AI maturity: None

### Pipeline Execution
```yaml
stages:
  intake:
    status: "Completed"
    inputsReceived: 3  # Profile, research, assessment (partial)
    dataCompleteness: 0.4  # Only 40% of expected data available
  signalExtraction:
    signalsExtracted: 12
    signalFamilies: [Growth, Operational, Technical]
  patternMatching:
    blueprintsScored: 10  # Only 10 of 50 applicable (no Marketing, etc.)
    matchesAboveThreshold: 3
    topBlueprint: BP-SALES-01 (score 0.55)
  constraintEvaluation:
    opportunitiesFiltered: 0
    opportunitiesConditional: 1
  opportunityGeneration:
    opportunitiesGenerated: 3
  ranking:
    tier1: 1
    tier2: 1
    tier3: 1
    tier4: 0
  confidenceScoring:
    confirmed: 0
    high: 1
    medium: 1
    low: 1
```

### Output
```yaml
opportunities:
  - id: "OPP-001"
    title: "Automated Sales Meeting Intelligence"
    tier: 1
    confidence: "High"
    evidence:
      - "[User] Q-SALES-02: Scale 4/5 on manual work"
      - "[Research] Sales team growing"
  - id: "OPP-002"
    title: "Automated Ticket Triage"
    tier: 2
    confidence: "Medium"
    evidence:
      - "[User] Q-SUPP-01: Manual triage"
  - id: "OPP-003"
    title: "Intelligent Documentation Generation"
    tier: 3
    confidence: "Low"
    evidence:
      - "[Inference] Small eng team likely has doc gaps"
```

---

## Simulation 2: "Edge Case — All 'I Don't Know'"

### Scenario
- 200 employees, Series A
- User answered "I don't know" to all questions

### Pipeline Execution
```yaml
stages:
  intake:
    status: "Completed (partial)"
    warnings:
      - "All user responses are 'I don't know' — reduced confidence"
  signalExtraction:
    signalsExtracted: 8  # Research-only signals
    evidenceClasses: ["Research", "Inference"]
  patternMatching:
    matchesAboveThreshold: 2
    topBlueprint: BP-MKTG-01 (score 0.48)
  confidenceScoring:
    maxConfidence: "Medium"  # Capped due to single evidence class
```

### Output
```yaml
outputNotes:
  - "Assessment provided minimal signal due to 'I don't know' responses"
  - "All opportunities are based on Research and Inference only"
  - "Recommend completing full assessment for higher confidence"
opportunities:
  - id: "OPP-001"
    title: "User Feedback Synthesis"
    tier: 2
    confidence: "Medium"
    evidence:
      - "[Research] Product-led company likely needs feedback sys"
      - "[Inference] Stage-typical product development gap"
```

---

## Simulation 3: "Department Focus — Legal-Heavy"

### Scenario
- 1200 employees, enterprise, SOC2/HIPAA
- High legal friction

### Pipeline Execution
```yaml
stages:
  patternMatching:
    topBlueprints:
      - BP-LEGAL-01 (Contract Review): 0.88
      - BP-LEGAL-02 (Clause Library): 0.82
      - BP-LEGAL-03 (Compliance Monitoring): 0.79
      - BP-LEGAL-04 (NDA Processing): 0.85
  ranking:
    tier1: [BP-LEGAL-01, BP-LEGAL-04]
    tier2: [BP-LEGAL-02, BP-LEGAL-03]
    tier3: []
    tier4: []
```

### Output
```yaml
opportunities:
  - id: "OPP-001"
    title: "Automated NDA Processing"
    tier: 1
    confidence: "Confirmed"
    strategy: "Quick Win"
  - id: "OPP-002"
    title: "Automated Contract Review"
    tier: 1
    confidence: "Confirmed"
    strategy: "Package Deal (with NDA)"
  - id: "OPP-003"
    title: "Clause Library Management"
    tier: 2
    confidence: "High"
    strategy: "Foundational"
  - id: "OPP-004"
    title: "Compliance Monitoring Automation"
    tier: 2
    confidence: "High"
    strategy: "Foundational"
```

---

## Simulation 4: "Stress Test — Conflicting Data"

### Scenario
- User reports LOW sales friction
- Research shows STRONG sales friction signals

### Conflict Resolution
```yaml
conflictDetected: true
conflicts:
  - signal: "Sales lead qualification friction"
    userValue: "Low friction (Q-SALES-01: automated enrichment)"
    researchValue: "High friction (40 sales hires, CEO priority on sales productivity)"
    resolution: "[Research] overrides [User] — CEO priority is strong signal"
    confidenceImpact: "Reduced from Confirmed to High"
```

### Output
```yaml
opportunities:
  - id: "OPP-001"
    title: "Automated Lead Qualification"
    tier: 2  # Downgraded from 1 due to conflict
    confidence: "High"  # Downgraded from Confirmed
    notes:
      - "User reports low friction but multiple research signals contradict"
      - "Confidence reduced due to evidence conflict"
      - "Recommend discussing this area in detail during follow-up"
```

---

## Simulation 5: "Benchmark — Growth-Stage SaaS"

### Scenario
- 300 employees, Series B, $25M ARR
- All departments present
- High sales and CS friction

### Full Output Summary

```yaml
companyProfile:
  identity: "SynthCorp Analytics"
  size: 300
  stage: "Series B"
  departments: 10
assessmentProfile:
  highFriction: ["Sales", "Customer Success", "Support"]
  mediumFriction: ["Marketing", "Operations", "Legal"]
  lowFriction: ["Finance", "Product", "Engineering", "HR"]

opportunityMap:
  tier1:
    - "Automated Lead Qualification" (BP-SALES-01)
    - "Customer Health Score Calculation" (BP-CS-01)
    - "Automated Ticket Triage" (BP-SUPP-01)
  tier2:
    - "Intelligent Deal Forecasting" (BP-SALES-02)
    - "Automated NDA Processing" (BP-LEGAL-04)
    - "Content Brief Generation" (BP-MKTG-01)
  tier3:
    - "Tool Provisioning Automation" (BP-OPS-01)
    - "Automated Report Generation" (BP-OPS-03)
  tier4:
    - "Employee Sentiment Analysis" (BP-HR-03)

implementationBlueprint:
  phase1: "Quick Wins (Weeks 1-6)"
    - "Automated Ticket Triage" (Week 1-4)
    - "Health Score Calculation" (Week 2-6)
  phase2: "Foundational (Weeks 4-10)"
    - "Lead Qualification" (Week 4-10)
    - "NDA Processing" (Week 5-8)
  phase3: "Package Deal (Weeks 8-16)"
    - "Content Brief + Campaign Analysis" (Week 8-16)
  phase4: "Phased (Weeks 12-24+)"
    - "Deal Forecasting (conditional on CRM quality)"

confidenceSummary:
  confirmed: 2
  high: 3
  medium: 2
  low: 1

evidenceBreakdown:
  totalEvidenceItems: 47
  byClass:
    User: 22
    Research: 15
    Inference: 10
  byDepartment:
    Sales: 12
    Support: 8
    CS: 7
    Legal: 5
    Marketing: 4
    Ops: 4
    Other: 7
```
