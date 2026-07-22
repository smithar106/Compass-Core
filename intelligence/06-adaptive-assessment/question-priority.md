# Question Priority System

## Overview

Every question in the adaptive assessment is assigned a priority score that determines its position, whether it gets asked, and what happens if it's skipped.

---

## Priority Score Calculation

Priority score (0.0 - 1.0) is calculated from 5 factors:

### Factor 1: Signal Value (0.0 - 0.3)

How much signal does this question provide for pattern matching?

| Signal Value | Score | Criteria |
|-------------|-------|----------|
| Very High | 0.3 | Directly maps to 3+ blueprints |
| High | 0.2 | Directly maps to 2 blueprints |
| Medium | 0.1 | Directly maps to 1 blueprint |
| Low | 0.0 | Indirect or no blueprint mapping |

### Factor 2: Hypothesis Alignment (0.0 - 0.25)

How well does this question validate pre-assessment hypotheses?

| Alignment | Score | Criteria |
|-----------|-------|----------|
| Direct | 0.25 | Question directly validates a High-confidence hypothesis |
| Strong | 0.15 | Question validates a Medium-confidence hypothesis |
| Moderate | 0.1 | Question partially validates a hypothesis |
| None | 0.0 | No hypothesis alignment |

### Factor 3: Information Uniqueness (0.0 - 0.2)

How uniquely does this question provide information not available from research?

| Uniqueness | Score | Criteria |
|------------|-------|----------|
| Very High | 0.2 | Information cannot be obtained from any research source |
| High | 0.15 | Information partially available but low confidence |
| Medium | 0.1 | Information available but with medium confidence |
| Low | 0.0 | Information already available from research (High) |

### Factor 4: Department Criticality (0.0 - 0.15)

How critical is this department to the organization's AI opportunity map?

| Criticality | Score | Criteria |
|-------------|-------|----------|
| Critical | 0.15 | Department is a top-3 priority for AI opportunities |
| High | 0.1 | Department is in top 5 |
| Medium | 0.05 | Department has some AI opportunity potential |
| Low | 0.0 | Department has minimal AI opportunity |

### Factor 5: Confidence Gap (0.0 - 0.1)

How much does this question fill a confidence gap in the company profile?

| Gap | Score | Criteria |
|-----|-------|----------|
| Large | 0.1 | Current profile confidence < Medium for this area |
| Medium | 0.05 | Current profile confidence = Medium |
| Small | 0.0 | Current profile confidence >= High |

---

## Priority Thresholds

| Score Range | Priority | Behavior |
|-------------|----------|----------|
| 0.75 - 1.0 | Critical | Always asked, high in sequence |
| 0.5 - 0.74 | High | Asked unless skipped by branching |
| 0.25 - 0.49 | Medium | Asked if not skipped by personalization |
| 0.0 - 0.24 | Low | Skipped unless triggered by branching |

---

## Priority Adjustment Examples

### Example 1: Sales Question for Growth-Stage Company

```
Q-SALES-01: "How do sales reps qualify leads?"
  Signal Value: 0.3 (maps to 3+ blueprints)
  Hypothesis Alignment: 0.25 (directly validates high-conf hypothesis)
  Information Uniqueness: 0.2 (cannot get from research)
  Department Criticality: 0.15 (sales is top priority)
  Confidence Gap: 0.1 (sales profile confidence is Low)
  → Total: 1.0 → CRITICAL
```

### Example 2: Legal Question for Small Company

```
Q-LEGAL-02: "How does your org track compliance?"
  Signal Value: 0.1 (maps to 1 blueprint)
  Hypothesis Alignment: 0.0 (no legal hypothesis)
  Information Uniqueness: 0.0 (can infer from industry)
  Department Criticality: 0.0 (legal not critical)
  Confidence Gap: 0.0 (no gap)
  → Total: 0.1 → LOW (skip)
```

### Example 3: Engineering Question with Research Data

```
Q-ENG-01: "State of engineering documentation?"
  Signal Value: 0.2 (maps to 2 blueprints)
  Hypothesis Alignment: 0.1 (medium hypothesis)
  Information Uniqueness: 0.05 (partially from GitHub analysis)
  Department Criticality: 0.1 (engineering important but not top 3)
  Confidence Gap: 0.05 (Medium confidence from research)
  → Total: 0.5 → HIGH
```

---

## Question Ordering

After priority scoring, questions are ordered by:
1. Priority score (descending)
2. Department (grouped for coherence)
3. Branching position (trigger questions before follow-ups)

The first 5 questions are always Critical priority. This ensures the assessment starts with high-value questions even if the user drops off.
