# Confidence Framework

## Overview

Every recommendation, inference, and signal in Compass carries a confidence assessment. Confidence is not a single number — it is assessed across 5 dimensions that together determine the overall confidence level.

---

## 5 Evidence Dimensions

### 1. Source Authority

How authoritative is the evidence source?

| Level | Description | Examples |
|-------|-------------|----------|
| High | Direct, primary source with expertise | User assessment response about own work; Official company filing |
| Medium | Secondary or observed source | User assessment about another department; Public interview |
| Low | Third-hand or inferred source | Social media mention; Unverified blog post |

### 2. Data Freshness

How current is the evidence?

| Level | Description |
|-------|-------------|
| High | Collected within last 7 days |
| Medium | Collected within last 30 days |
| Low | Collected more than 30 days ago |

### 3. Directness

How directly does the evidence relate to the claim?

| Level | Description |
|-------|-------------|
| High | Evidence directly supports the claim |
| Medium | Evidence relates but requires interpretation |
| Low | Evidence is tangentially related or circumstantial |

### 4. Consistency

How consistent is the evidence across multiple sources?

| Level | Description |
|-------|-------------|
| High | Multiple independent sources agree |
| Medium | Sources mostly agree with minor inconsistencies |
| Low | Sources conflict or evidence is from single source |

### 5. Specificity

How specific is the evidence about the claim?

| Level | Description |
|-------|-------------|
| High | Evidence includes specific numbers, examples, or quotes |
| Medium | Evidence is directional but not specific |
| Low | Evidence is vague or general |

---

## Confidence Levels

### Confirmed

**Definition**: Multiple high-confidence evidence sources from at least two evidence classes converge on the same conclusion.

**Requirements**:
- At least 3 evidence items
- At least 2 evidence classes represented
- No dimension rated "Low"
- Source Authority: at least one "High"
- Consistency: "High"

**Interpretation**: Actionable with high certainty. This opportunity exists and the reasoning is sound.

### High

**Definition**: Strong evidence from multiple sources, with some dimensions not at maximum.

**Requirements**:
- At least 2 evidence items
- At least 1 evidence class represented
- No more than one dimension rated "Low"
- Source Authority: at least one "Medium" or higher
- Consistency: "Medium" or higher

**Interpretation**: Actionable with confidence. Implementation risk is manageable.

### Medium

**Definition**: Evidence exists but is limited in quality, quantity, or consistency.

**Requirements**:
- At least 1 evidence item
- No dimension rated "Low" unless compensated by other dimensions
- Source Authority: at least one "Low" accepted if multiple items

**Interpretation**: Directionally useful but needs validation. Proceed with caution.

### Low

**Definition**: Limited, conflicting, or very indirect evidence.

**Requirements**:
- Any single evidence item (even one)
- Or: all dimensions "Low"
- Or: conflicting evidence with no resolution

**Interpretation**: Informational only. Not actionable without further validation.

---

## Confidence Calculation

### Step 1: Dimension Scoring

Each dimension is scored High (3), Medium (2), or Low (1).

### Step 2: Consensus Check

If 3+ dimensions are at the same level, that level is the base confidence.

### Step 3: Modifiers

Apply modifiers based on evidence properties:

| Modifier | Effect |
|----------|--------|
| [User] evidence present | +1 to Source Authority (max High) |
| Cross-class confirmation | +1 to Consistency (max High) |
| Evidence conflict | -1 to Consistency |
| Single evidence class only | Cap at Medium |
| Assessment not completed | All evidence capped at Medium |

### Step 4: Level Assignment

| Modified Score | Level |
|----------------|-------|
| 2.5+ | Confirmed |
| 2.0 - 2.4 | High |
| 1.5 - 1.9 | Medium |
| < 1.5 | Low |

---

## Confidence Reporting

Every recommendation includes:

```yaml
confidence:
  level: "High"
  dimensions:
    source_authority: "High"    # [User] evidence from VP of Sales
    data_freshness: "High"       # Assessment completed today
    directness: "Medium"         # Evidence is about related pain, not exact
    consistency: "High"          # User, Research, and Inference all agree
    specificity: "Medium"        # General pain point, not specific metric
  reasoning: >
    Three evidence classes converge on lead qualification friction.
    [User] evidence is direct from the VP of Sales.
    [Research] confirms recent SDR hiring spree indicating scaling pressure.
    [Inference] matches stage-typical lead qualification bottlenecks.
```

---

## Confidence in Practice

### When to Act

| Confidence | Recommendation |
|------------|----------------|
| Confirmed | Implement immediately |
| High | Plan implementation, start soon |
| Medium | Investigate further before committing |
| Low | Collect more data, do not act yet |

### Confidence Over Time

Confidence decays for research-based evidence:
- Research signals: 30-day half-life (confidence halves every 30 days)
- Assessment evidence: No decay (direct from user)
- Inference evidence: 14-day half-life

After 90 days without update, all evidence is treated as "Low" confidence.
