# Hypothesis Validation Framework

## Overview

The Hypothesis Validation Framework defines how pre-assessment hypotheses are validated or invalidated by the adaptive assessment. Each hypothesis maps to specific assessment questions that confirm or reject the prediction.

---

## Validation Flow

```
Hypothesis Generated
  → Adaptive Assessment includes relevant questions
    → User responses confirm or reject hypothesis
      → Confirmed: Hypothesis becomes [User] signal, strengthens opportunity
      → Partially Confirmed: Mixed signals, moderate confidence
      → Rejected: Hypothesis noted, may indicate atypical organization
      → Inconclusive: Insufficient data, flagged for follow-up
```

---

## Validation Rules

### Rule 1: Direct Validation (Strong)

A single assessment question directly confirms or rejects the hypothesis.

**Example**:
- Hypothesis: "Lead qualification is manual"
- Question: Q-SALES-01 "How do sales reps qualify leads?"
- Answer: "Manual research using multiple tools" → **Confirmed**
- Answer: "Automated enrichment and scoring" → **Rejected**

### Rule 2: Multi-Question Validation (Medium)

Multiple assessment questions together confirm or reject the hypothesis.

**Example**:
- Hypothesis: "Support team is under-resourced"
- Q-SUPP-03: Response time > 4 hours → +1 confirmed
- Q-SUPP-01: Manual routing → +1 confirmed
- Research: 8 support hires open → +1 confirmed
- 3/3 confirmed → **Confirmed**

### Rule 3: Contradiction Detection

When assessment responses contradict the hypothesis AND the hypothesis was high confidence:

1. Record the contradiction
2. Investigate: Was the hypothesis based on faulty signals?
3. Adjust: Update the company's profile to reflect the contradiction
4. Document: Note the contradiction in the reasoning path

---

## Validation Outcomes

| Outcome | Action | Confidence Impact |
|---------|--------|-------------------|
| Confirmed | Strengthen evidence for related blueprints | +1 level (max Confirmed) |
| Partial | Generate moderate-strength signals | No change |
| Rejected | Reduce priority of related blueprints | -1 level |
| Inconclusive | Flag for follow-up (not enough info) | Keep current |

---

## Hypothesis Lifecycle

```
             ┌──────────────────────────────┐
             │   Hypothesis Generated        │
             │   (Idle)                      │
             └──────────────┬───────────────┘
                            │
                            ▼
             ┌──────────────────────────────┐
             │   Assessment Validates        │
             │   (Active)                    │
             └──────────────┬───────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────┐
     │  Confirmed   │ │ Rejected │ │Partial   │
     │  → Signal    │ │→ Note    │ │→ Mixed   │
     └──────────────┘ └──────────┘ └──────────┘
              │             │             │
              ▼             ▼             ▼
     ┌────────────────────────────────────────┐
     │      Hypothesis Resolved                │
     │      (Archived with outcome)            │
     └────────────────────────────────────────┘
```
