# Question Design Philosophy

## Overview

The Compass assessment is the primary mechanism for gathering [User] evidence. Question design determines the quality and reliability of this evidence. This document defines the philosophy, principles, and design approach for the assessment question set.

---

## Design Principles

### 1. Specificity over Generality

Questions should elicit specific, observable information rather than opinions or general impressions.

**Bad**: "How efficient is your sales process?" (Opinion-based)
**Good**: "How many hours per week does your average SDR spend on lead research?" (Fact-based)

**Why**: Specific answers can be validated and cross-referenced. General impressions are subjective and prone to bias.

### 2. Behavioral over Attitudinal

Questions should focus on what people DO, not what they THINK.

**Bad**: "Do you think your support team is effective?"
**Good**: "What is your average time to first response for support tickets?"

**Why**: Behavior is observable and measurable. Attitudes are situational and unreliable.

### 3. Comparative Benchmarking

Questions should enable comparison against industry baselines.

**Design**: Each multi-choice option corresponds to a known industry benchmark range. This enables the reasoning engine to assess where the organization falls relative to peers.

**Example**: "How long does your monthly revenue reconciliation typically take?" with options mapping to <1 day (top quartile), 1-3 days (median), 3-5 days (below median), >5 days (bottom quartile).

### 4. Friction Discovery

Questions are designed to surface operational friction — the gap between current state and desired state.

**Technique**: Each question has an implicit "pain threshold." When a response crosses the threshold, it generates a signal for the reasoning engine.

**Example**: Lead response time > 4 hours = pain signal for ticket/routing automation.

### 5. Branching for Depth

Questions should branch based on previous responses to explore areas of interest while skipping irrelevant areas.

**Design Pattern**: Each high-priority question has branching rules. If a user reports a pain point, follow-up questions probe deeper. If a user reports no pain or N/A, the branch is skipped.

### 6. Evidence Tagging

Every question carries evidence tags that link to signal families and blueprint patterns.

**Purpose**: Enables the reasoning engine to rapidly connect assessment responses to relevant patterns without parsing question text.

**Example**: Tags like "lead_qualification", "forecasting", "ticket_routing" directly map to blueprint IDs.

### 7. Weighted Priority

Questions are weighted by their signal value. Higher-weight questions contribute more to the organizational profile.

**Weighting Factors**:
- Pattern coverage (how many blueprints this question informs)
- Signal strength (how strong an indicator this question is)
- Uniqueness (whether this information is available from other sources)

---

## Question Types

### Boolean

Use: Clear yes/no factual questions.
Format: "Do you have X?" / "Is X true?"
Signal: Binary indicator, high confidence.
Example: "Does your organization use a formal customer health score system?"

### Scale (1-5)

Use: Quantifiable measures.
Format: Numerical scale with labeled anchors.
Signal: Continuous indicator, medium confidence.
Example: "How many hours per week does your sales team spend manually entering data?" (1 = <2 hrs, 5 = 10+ hrs)

### Multi-Choice

Use: Categorical assessment with defined options.
Format: Mutually exclusive options covering the range.
Signal: Categorical indicator, high confidence.
Example: "How are support tickets typically routed?" with options for manual, rule-based, AI-powered, not formal.

### Open

Use: Complex situations requiring narrative explanation.
Format: Free-text response.
Signal: Rich qualitative signal, lower confidence (user perception).
Example: "How is user feedback currently collected, organized, and prioritized?"

---

## Question Distribution

| Department | Questions | Focus Areas |
|------------|-----------|-------------|
| Sales | 4 | Lead qualification, forecasting |
| Marketing | 3 | Attribution, reporting, content |
| Customer Success | 2 | Health scoring, churn detection |
| Support | 3 | Routing, knowledge base, response time |
| Finance | 2 | AP processing, reconciliation |
| Product | 2 | Feedback management, spec writing |
| Engineering | 3 | Documentation, incident response, code review |
| People/HR | 2 | Resume screening, interview scheduling |
| Legal | 2 | Contract review, compliance monitoring |
| Operations | 2 | Tool provisioning, reporting |

**Total**: 25 questions

---

## Quality Assurance

### Question Validation Criteria

Each question must pass:
1. **Clarity**: Would a non-expert understand this question?
2. **Specificity**: Does this question elicit a specific answer?
3. **Actionability**: Can the answer inform a reasoning path?
4. **Benchmarkability**: Can the answer be compared to industry baselines?
5. **Non-leadership**: Does the question avoid leading the respondent?

### Bias Prevention

Questions are reviewed for:
- **Confirmation bias**: Questions that only confirm existing assumptions
- **Leading language**: Questions that suggest a "correct" answer
- **Cultural bias**: Assumptions about organizational norms that may not apply globally
- **Role bias**: Questions that assume a particular role's perspective

### Evolution

The question set evolves through:
1. **Response analysis**: Identifying questions that consistently produce unusable answers
2. **Pattern drift**: Updating questions as AI capabilities and business workflows evolve
3. **Coverage gaps**: Adding questions when the reasoning engine identifies signal gaps
4. **Brevity optimization**: Removing questions that don't contribute to differentiated outcomes
