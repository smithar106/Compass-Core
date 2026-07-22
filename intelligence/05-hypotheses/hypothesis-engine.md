# AI Opportunity Hypothesis Engine

## Overview

The Hypothesis Agent generates **pre-assessment hypotheses** about likely organizational struggles. These hypotheses are not recommendations — they are predictions for the adaptive assessment to validate.

By generating hypotheses before the assessment, Compass can:
1. Ask more targeted questions
2. Challenge user assumptions
3. Reduce assessment length by focusing on high-likelihood areas
4. Provide a baseline for measuring assessment accuracy

---

## Inputs

| Input | Source |
|-------|--------|
| Company Profile | Company Intelligence Agent |
| Technology Profile | Technology Intelligence Agent |
| Industry Profile | Industry Intelligence Agent |
| Workflow Map | Organizational Workflow Agent (if available) |

---

## Outputs

| Output | Description |
|--------|-------------|
| Hypothesis Set | Ranked list of hypothesized friction points |
| Validation Plan | Which assessment questions validate each hypothesis |
| Confidence per Hypothesis | How confident the agent is in each prediction |

---

## Hypothesis Generation Logic

### Pattern 1: Stage-Based Hypotheses

Based on revenue stage, certain friction points are predictable:

| Stage | Likely Hypotheses | Confidence |
|-------|-------------------|------------|
| Seed | Product feedback management unstructured, No formal sales process | Medium |
| Series A | Sales process ad-hoc, Support scaling pressure, No CS processes | High |
| Series B | Lead qualification manual, Forecast accuracy low, Support ticket volume growing | High |
| Series C | Cross-dept handoffs friction, Legal/contract bottlenecks, CS health scoring missing | High |
| Growth | Tool sprawl, Data quality issues, Compliance gaps, Operational reporting burden | High |
| Mature | Legacy system integration, Innovation velocity, Organizational change resistance | Medium |

### Pattern 2: Tech Stack-Based Hypotheses

Based on detected tools, certain friction points are predictable:

| Tech Signal | Hypothesis |
|-------------|------------|
| Salesforce detected, no enrichment tool | Lead enrichment likely manual |
| Zendesk/Intercom detected, no AI add-on | Ticket routing likely manual |
| No data warehouse detected | Reporting likely manual, data quality poor |
| GitHub detected, no CI/CD signals | Deployments likely manual or infrequent |
| No HRIS detected | Onboarding/tool provisioning likely manual |
| Manual billing (no Stripe/Recurly detected) | Billing reconciliation likely painful |
| Okta detected + no SCIM provisioning | User provisioning likely manual |

### Pattern 3: Industry-Based Hypotheses

Based on industry, certain friction points are predictable:

| Industry | Hypothesis |
|----------|------------|
| B2B SaaS (general) | Sales forecasting accuracy < 80% |
| FinTech | Compliance monitoring burden high |
| HealthTech | HIPAA compliance creates documentation overhead |
| E-commerce/SaaS | Billing reconciliation complex (usage + subscriptions) |
| Developer Tools | Engineering documentation likely neglected |

### Pattern 4: Organizational Complexity Hypotheses

| Org Signal | Hypothesis |
|------------|------------|
| Hierarchical org (500+ people) | Approval chains cause workflow delays |
| Matrix org | Cross-dept coordination friction, meeting overload |
| Remote-first | Async communication gaps, documentation needs higher |
| Rapid growth (40%+ YoY) | Processes not keeping pace with headcount growth |

### Pattern 5: Cross-Signal Hypotheses

When multiple signals suggest the same hypothesis, confidence increases:

**Example**:
- Stage: Series B (→ lead qualification likely manual)
- Tech: Salesforce + no enrichment tool (→ lead enrichment likely manual)
- Industry: B2B SaaS (→ sales process scaling is typical pain point)
- Combined confidence: Confirmed

---

## Hypothesis Structure

Each hypothesis follows this structure:

```yaml
hypotheses:
  - id: "HYP-SALES-001"
    area: "Sales"
    hypothesis: "Lead qualification process is largely manual, consuming >40% of SDR time"
    confidence: "High"
    basedOn:
      - factor: "Revenue Stage"
        value: "Series B (200 employees)"
        confidence: "High"
      - factor: "Tech Stack"
        value: "Salesforce detected, no enrichment tools"
        confidence: "Medium"
      - factor: "Industry Pattern"
        value: "B2B SaaS growth-stage manual qualification"
        confidence: "High"
    validationQuestions:
      - "Q-SALES-01"
      - "Q-SALES-02"
    crossValidation:
      - ifConfirmed: "Strengthens recommendation for BP-SALES-01"
      - ifRejected: "Indicates higher AI maturity than typical"
```

---

## Hypothesis Types

| Type | Description | Example |
|------|-------------|---------|
| Friction | Organization is experiencing operational friction | "Support ticket routing is manual and slow" |
| Gap | Organization is missing a capability or process | "No customer health scoring system exists" |
| Constraint | A constraint is blocking operational improvement | "Legal department is understaffed for contract volume" |
| Readiness | Organization is ready (or not) for AI adoption | "Change capacity is high, AI readiness is low" |
| Contradiction | Research signals contradict user's likely self-assessment | "User may report high efficiency but research shows bottlenecks" |

---

## Edge Cases

### No Research Data Available

Generate hypotheses from stage and industry only. Confidence: Low.

### Very Small Company (< 50 employees)

Most B2B SaaS patterns don't apply. Generate minimal hypotheses focused on product and engineering.

### Company Already Using AI

Reduce hypothesis confidence for basic AI areas. Focus on advanced or adjacent opportunities.
