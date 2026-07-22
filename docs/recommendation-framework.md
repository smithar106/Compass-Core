# Recommendation Framework: AI Opportunity Maps

## Overview

Compass generates **AI Opportunity Maps** — ranked, evidence-grounded collections of AI applications that create measurable operational leverage for a specific B2B SaaS organization.

This document defines the framework for generating, classifying, and presenting recommendations.

---

## Core Principles

1. **Evidence-based, not intuition-based**: Every recommendation traces back to specific evidence in one of three classes.
2. **No scoring tiers**: Recommendations are not numerically scored. They are assigned to tiers via a 4-pass ranking algorithm.
3. **Confidence transparency**: Every recommendation carries a confidence level with supporting reasoning.
4. **Organizational specificity**: Recommendations reference the specific organization's workflows, systems, and people.
5. **Dependency awareness**: Recommendations include prerequisite relationships with other recommendations.

---

## Evidence Classes

Every piece of evidence used in recommendation generation belongs to exactly one class:

### [User] — Direct User Evidence

Evidence provided directly by the user during the assessment.

**Characteristics**:
- Highest authority class
- Explicitly volunteered by organizational insiders
- Subject to user perception bias
- Limited to what the user knows and chooses to share

**Examples**:
- "Our sales team spends 8 hours per week manually entering data into the CRM." ([User], Assessment Q14)
- "We have no automated process for contract renewal reminders." ([User], Assessment Q22)
- "Customer support tickets take an average of 48 hours for first response." ([User], Assessment Q31)

**Authority**: High (insider knowledge)
**Bias risk**: Perception may not match reality; individual experience may not represent team experience

### [Research] — External Research Evidence

Evidence gathered by Compass research agents from public sources.

**Characteristics**:
- Verifiable by third parties
- Independent of user self-reporting
- May be outdated or incomplete
- Limited to what is publicly available

**Examples**:
- "Company job postings show 15 open engineering roles, suggesting capacity constraints." ([Research], Job Boards)
- "CEO stated in Q3 earnings call: 'Our top priority is reducing customer churn.'" ([Research], Earnings Transcript)
- "Company website lists Salesforce, HubSpot, Jira, and Confluence as tools." ([Research], Website/Social)

**Authority**: Medium-High (verifiable, but may not reflect internal reality)
**Bias risk**: Public signals can be aspirational rather than actual

### [Inference] — Derived Evidence

Evidence derived by Compass through pattern matching between blueprints, research, and assessment data.

**Characteristics**:
- Highest uncertainty class
- Based on statistical patterns from the blueprint library
- Always accompanied by confidence level
- Always explicit about being inferred

**Examples**:
- "Companies at this stage ($20-50M ARR) with similar tech stacks typically experience revenue attribution friction." ([Inference], Blueprint Pattern #23)
- "The combination of high assessment friction scores in Sales and recent Sales leadership hires suggests readiness for sales process AI." ([Inference], Cross-signal correlation)
- "Org structure shows no dedicated Sales Operations role, which typically correlates with manual reporting processes." ([Inference], Organizational Pattern)

**Authority**: Low-Medium (derived, not observed)
**Bias risk**: Pattern-matching accuracy depends on blueprint library completeness and company specificity

---

## Opportunity Structure

Each opportunity in an AI Opportunity Map has the following structure:

```yaml
id: "OPP-2024-001"
title: "Automated Sales Lead Qualification"
department: "Sales"
tier: "Tier 1"

signal:
  description: "Assessment indicates 60% of sales time spent on lead research"
  evidence:
    - type: "User"
      source: "Assessment Q12"
      detail: "Sales team averages 20 hrs/week on lead qualification research"
      quote: "We spend more time researching leads than talking to them"
    - type: "Research"
      source: "Company Job Postings"
      detail: "Recent hiring for Sales Development role suggests scaling need"
    - type: "Inference"
      source: "Blueprint Match #08"
      detail: "Companies at this stage (50-100 reps) typically have qualification bottlenecks"

pattern:
  id: "BP-08"
  name: "Automated Lead Intelligence"
  match_quality: 0.87
  description: "AI extracts and enriches lead data from multiple sources, prioritizes based on ICP fit, and pushes qualified leads to CRM"

opportunity:
  description: "Deploy AI agent that automatically researches inbound leads, enriches CRM records, and scores against ICP criteria"
  affected_systems: ["Salesforce", "Outreach", "ZoomInfo"]
  affected_workflows: ["Lead qualification", "Lead routing", "CRM data entry"]
  estimated_scope: "4-6 weeks engineering, 2-week change management"

evidence_summary:
  user_signals: 3
  research_signals: 2
  inference_signals: 2

confidence:
  level: "High"  # Confirmed | High | Medium | Low
  dimensions:
    source_authority: "High"    # Multiple evidence classes confirm
    data_freshness: "High"       # Assessment just completed
    directness: "High"           # Direct user report of specific pain
    consistency: "High"          # User, Research, Inference all align
    specificity: "Medium"        # Exact implementation details inferred

dependencies:
  prerequisites:
    - "OPP-2024-003: CRM Data Quality Improvement"
  blocking: []
  concurrent: ["OPP-2024-005: Automated Meeting Notes"]

implementation_strategy: "Quick Win"
sequence_order: 2
```

---

## Evidence Aggregation Rules

### Rule 1: Single Evidence Class Sufficiency

A single evidence class is sufficient to generate an opportunity, but confidence is bounded by that class:

- [User] only → Max confidence: Medium
- [Research] only → Max confidence: Medium
- [Inference] only → Max confidence: Medium
- Any two classes → Max confidence: High
- All three classes → Max confidence: Confirmed

### Rule 2: Evidence Count Thresholds

| Count of Evidence Items | Max Confidence |
|------------------------|----------------|
| 1-2 | Medium |
| 3-4 | High |
| 5+ | Confirmed |

### Rule 3: Evidence Conflict Resolution

If evidence classes conflict:
1. [User] evidence takes precedence over [Research]
2. [Research] evidence takes precedence over [Inference]
3. Conflicts are recorded in the reasoning path
4. Confidence is downgraded by one level for each conflict
5. The reasoning section explains the conflict and resolution

### Rule 4: Minimum Evidence Requirements

Every opportunity requires:
- At least one evidence item (any class)
- At least one pattern match from the blueprint library
- Explicit confidence assessment on all 5 dimensions
- Identified dependencies (even if empty)

---

## Recommendation Presentation

### Tiered Presentation

Opportunities are grouped into tiers (not scored):

| Tier | Label | Criteria | Presentation |
|------|-------|----------|-------------|
| Tier 1 | Highest Priority | High confidence + High impact + No blockers | Featured, call to action |
| Tier 2 | High Priority | High/Medium confidence + Medium/High impact | Detailed cards |
| Tier 3 | Worth Exploring | Medium confidence + Medium impact | Expandable list |
| Tier 4 | Monitor | Low confidence or Low impact | Reference list |

### Filtering Dimensions

Users can filter the opportunity map by:
- Department
- Confidence level
- Implementation strategy
- Dependencies status
- Evidence class composition

### Sorting (within tier)

Within each tier, opportunities are sorted by:
1. Confidence (higher first)
2. Evidence diversity (more classes better)
3. Implementation quickness (Quick Wins first)
4. Prerequisite position (prerequisites before dependents)

---

## Limitation Statements

Every AI Opportunity Map includes these limitations:

1. **Compass identifies opportunities, not implementations**: These recommendations require technical validation, security review, and implementation planning before execution.
2. **Confidence reflects evidence quality, not outcome certainty**: High confidence means strong evidence exists, not that the opportunity will succeed.
3. **Blueprint matches are pattern-based**: The blueprint library represents patterns observed across the industry. Your organization's specific implementation will differ.
4. **Assessment captures perception**: User responses reflect individual perception. Cross-referencing with multiple stakeholders may reveal different priorities.
5. **Research is limited to public data**: Private internal information may change the analysis. Treat research findings as directional.
