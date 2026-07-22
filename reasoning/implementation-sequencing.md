# Implementation Sequencing Framework

## Overview

Once opportunities are ranked by tier, Compass determines the optimal implementation sequence. The sequencing framework considers dependencies, resource constraints, and strategic priorities to produce a recommended order of execution.

---

## 5 Sequencing Strategies

### 1. Quick Win

**Definition**: Low complexity, high impact, minimal dependencies.

**Characteristics**:
- Implementation effort: < 6 weeks
- Complexity: Low
- Dependencies: None or minimal
- Risk: Low
- Organizational change required: Minimal

**Examples**:
- Intelligent Interview Scheduling
- Automated Sales Meeting Intelligence
- Dependency Update Automation

**Placement**: Always first in the sequence. Builds momentum and credibility.

### 2. Foundational

**Definition**: Necessary infrastructure or capability that enables other opportunities.

**Characteristics**:
- Implementation effort: 4-10 weeks
- Complexity: Medium
- Dependencies: May depend on nothing but may enable many things
- Risk: Medium
- Organizational change required: Moderate

**Examples**:
- CRM Data Quality Improvement
- Automated Health Score Calculation
- Data Quality Monitoring

**Placement**: Early in sequence, before opportunities that depend on them.

### 3. Package Deal

**Definition**: Multiple related opportunities that deliver more value together than separately.

**Characteristics**:
- Implementation effort: Combined, 8-16 weeks
- Complexity: Medium-High
- Dependencies: Opportunities within the package are interdependent
- Risk: Medium (spread across package)
- Organizational change required: Significant

**Examples**:
- Lead-to-Cash Package (Lead Qualification + Deal Forecasting + Contract Renewal)
- Support Transformation Package (Ticket Routing + KB Assistant + Response Generation)

**Placement**: As a single initiative, after Quick Wins, before Phased Rollouts.

### 4. Phased Rollout

**Definition**: Large opportunity that must be broken into phases due to scope, risk, or resource constraints.

**Characteristics**:
- Implementation effort: 12-24 weeks (total)
- Complexity: High
- Dependencies: Phases within the rollout are sequential
- Risk: High (mitigated by phasing)
- Organizational change required: Significant

**Examples**:
- Enterprise Contract Review System (Phase 1: NDA automation, Phase 2: Contract analysis, Phase 3: Full CLM)
- Churn Prediction Platform (Phase 1: Feature store, Phase 2: Model training, Phase 3: Production deployment)

**Placement**: Later in sequence, once Quick Wins have freed resources and built credibility.

### 5. Conditional

**Definition**: Opportunity that depends on a condition or prerequisite that is not yet met.

**Characteristics**:
- Timing: Unknown (depends on condition)
- Complexity: Variable
- Dependencies: Unresolved external dependency
- Risk: High
- Organizational change required: Variable

**Examples**:
- AI-Powered Personalization (depends on data infrastructure readiness)
- Automated Test Generation (depends on test framework standardization)

**Placement**: Deferred until condition is met. Reviewed each planning cycle.

---

## Decision Tree

The following decision tree determines implementation strategy for each opportunity:

```
Is the opportunity low complexity AND low dependency?
  YES → Quick Win
  NO  → Is it a prerequisite for other opportunities?
    YES → Foundational
    NO  → Can it be combined with related opportunities for greater impact?
      YES → Package Deal
      NO  → Is it large scope that must be broken into phases?
        YES → Phased Rollout
        NO  → Does it depend on an unresolved condition?
          YES → Conditional
          NO  → (Fallback) Quick Win with caveats
```

---

## Sequencing Rules

### Rule 1: Build Momentum First

The first 2-3 items in any implementation sequence should be Quick Wins. This builds organizational confidence, demonstrates value, and creates budget justification for larger initiatives.

### Rule 2: Foundational Before Dependent

If Opportunity B depends on Foundational Opportunity A, A must be completed (or well underway) before B begins. The implementation blueprint explicitly marks these dependencies.

### Rule 3: Package Deals as Milestones

Package Deals should be treated as named initiatives (e.g., "Sales Efficiency Program") with a single owner, budget, and timeline. Individual opportunities within the package are workstreams.

### Rule 4: Phased Rollouts Have Go/No-Go Gates

Each phase of a Phased Rollout has a go/no-go decision point. The next phase only proceeds if the previous phase met its success criteria.

### Rule 5: Conditional Opportunities Are Reviewed Quarterly

Conditional opportunities are reviewed each planning cycle. If the condition is met, they are re-evaluated through the full ranking pipeline and assigned a new strategy.

---

## Resource Allocation Heuristics

| Strategy | Team Size | Duration | Budget Level |
|----------|-----------|----------|--------------|
| Quick Win | 1-2 people | 2-6 weeks | Low |
| Foundational | 2-3 people | 4-10 weeks | Medium |
| Package Deal | 3-5 people | 8-16 weeks | High |
| Phased Rollout | 3-5 people | 12-24 weeks | High |
| Conditional | TBD | TBD | TBD |

---

## Sequence Example

```
Month 1-2:   Quick Win #1 (Automated NDA Processing)
             Quick Win #2 (Automated Meeting Intelligence)
Month 2-4:   Foundational (Customer Health Score Calculation)
Month 3-6:   Package Deal (Support Transformation)
             → Ticket Routing (Month 3-4)
             → KB Assistant (Month 4-5)
             → Response Generation (Month 5-6)
Month 4-8:   Phased Rollout (Revenue Reconciliation)
             → Phase 1: Data Pipeline (Month 4-5)
             → Phase 2: Matching Engine (Month 5-6)
             → Phase 3: Reporting (Month 6-8)
Month 6+:    Conditional (Churn Prediction)
             → Condition: Health scoring operational for 3 months
```
