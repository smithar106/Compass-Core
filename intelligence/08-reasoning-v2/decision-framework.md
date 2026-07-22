# Decision Framework

## Overview

The Decision Framework determines which opportunities to present to the user and how to prioritize them. It takes the ranked pattern matches from Reasoning V2 and makes final decisions about opportunity inclusion, ordering, and presentation.

---

## Opportunity Selection Criteria

An opportunity is selected for presentation if it meets ALL criteria:

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Match Score | ≥ 0.5 | Below this, the pattern is not meaningful |
| Company Fit | Stage + Size compatible | Blueprint must be appropriate for company's maturity |
| Uniqueness | Not identical to higher-ranked opportunity | Prevent duplicates |
| Actionability | Opportunity must be concretely actionable | No vague "improve operations" |
| Evidence Strength | At least Medium confidence | Avoid speculation in final output |

---

## Priority Scoring

Selected opportunities receive a priority score for ordering:

```
priority = 
  impact × 0.4 +
  feasibility × 0.3 +
  urgency × 0.2 +
  strategicAlignment × 0.1
```

### Impact

How much business value does this opportunity represent?

| Level | Score | Description |
|-------|-------|-------------|
| Transformational | 1.0 | Changes how the business operates |
| High | 0.8 | Significant efficiency or revenue gain |
| Medium | 0.5 | Measurable improvement |
| Low | 0.2 | Incremental improvement |

### Feasibility

How easy is it to implement?

| Level | Score | Description |
|-------|-------|-------------|
| Very High | 1.0 | Low effort, existing tools, high adoption |
| High | 0.8 | Moderate effort, clear path |
| Medium | 0.5 | Significant effort, some uncertainty |
| Low | 0.2 | Very difficult, unknown path |

### Urgency

How pressing is this opportunity?

| Level | Score | Description |
|-------|-------|-------------|
| Critical | 1.0 | Current pain, losing money |
| High | 0.8 | Growing pain, will become critical |
| Medium | 0.5 | Would be nice to address |
| Low | 0.2 | Not urgent, could wait 12+ months |

### Strategic Alignment

Does this opportunity support the company's strategic direction?

| Level | Score | Description |
|-------|-------|-------------|
| Core | 1.0 | Directly enables strategy |
| Supporting | 0.7 | Supports strategy indirectly |
| Neutral | 0.4 | Neither helps nor hinders |
| Misaligned | 0.0 | Conflicts with strategy |

---

## Opportunity Presentability

Not every matched opportunity should be presented. Filtering rules:

| Rule | Action | Rationale |
|------|--------|-----------|
| Too Obvious | Remove | "Use email" is not a useful insight |
| Requires Overhaul | Flag as long-term | Not immediately actionable |
| Regulatory Block | Flag as conditional | May or may not be feasible |
| Already Implemented | Remove (or flag as confirmed) | Don't sell what they have |
| Too Generic | Remove | Must be specific to their context |

---

## Context-Aware Prioritization

Priority scoring adapts to company context:

| Context | Adjustment |
|---------|------------|
| Growth Stage | Higher weight on revenue opportunities (sales, marketing) |
| Enterprise Stage | Higher weight on efficiency and compliance |
| High Churn | Higher weight on CS and support opportunities |
| Heavy Manual Ops | Higher weight on automation opportunities |
| Post-Funding | Higher weight on scalable infrastructure |

---

## Presentation Ordering

Final list is ordered by priority score. Then grouped:

1. **Top 3**: Highest priority, most impactful
2. **Quick Wins**: Feasibility > 0.8, can be implemented quickly
3. **Strategic Bets**: High impact but lower feasibility
4. **Long-term**: Urgency < 0.3, recommended for later

Maximum 10 opportunities presented. If more than 10, trim lowest priority.
