# Company Intelligence — Full Reasoning Design

## Overview

This document details the complete reasoning design behind the Company Intelligence Agent, including inference chains, confidence calibration, and integration with downstream agents.

---

## Inference Chain Architecture

The Company Intelligence Agent operates through 5 sequential inference phases:

```
Phase 1: Identity & Classification
  → Phase 2: Size & Stage Estimation
    → Phase 3: Structure & Department Mapping
      → Phase 4: Strategic Signals Extraction
        → Phase 5: Constraint & Compliance Assessment
```

Each phase depends on the previous phase(s) completing successfully.

---

## Phase 1: Identity & Classification

**Goal**: Determine what the company is and what it does.

**Process**:
1. Parse website for: title, meta description, h1, structured data (JSON-LD)
2. Extract: company name, tagline, product description, industry keywords
3. Cross-reference with Crunchbase for industry classification
4. Infer business model from pricing page: per-seat, usage-based, tiered, enterprise
5. Infer customer segments from: pricing page, case studies, product positioning

**Key Inference**: Business model

| Pricing Signal | Business Model Inference | Confidence |
|---------------|-------------------------|------------|
| Per-user/month pricing | SaaS | High |
| Usage-based (per API call, per event) | Usage-based | High |
| Tiered plans with usage limits | Hybrid | Medium |
| "Contact us" only | Enterprise SaaS | Medium |
| Transaction percentage | Marketplace | Medium |

---

## Phase 2: Size & Stage Estimation

**Goal**: Estimate headcount, revenue stage, and growth trajectory.

**Process**:
1. Collect headcount signals from multiple sources (see inference logic in agent doc)
2. Estimate revenue stage from headcount + funding + public signals
3. Infer growth stage from: hiring velocity, funding recency, product launch frequency

**Cross-Validation**:
```
If headcount suggests Series B (200-400) 
  AND Crunchbase shows $30M Series B 18 months ago
  AND LinkedIn shows 35 open roles (high hiring)
  → Growth Stage: "Scaling" — Confirmed confidence
```

**Edge Case**: Bootstrap companies
- No funding data available
- Estimate revenue stage from headcount alone
- Headcount 50-150 → likely Series A equivalent
- Headcount 150-500 → likely Series B-C equivalent
- Lower confidence due to no financial signals

---

## Phase 3: Structure & Department Mapping

**Goal**: Map the organizational structure and team distribution.

**Process**:
1. Query LinkedIn for employee titles and departments
2. Categorize titles into standard departments
3. Estimate department sizes from title distribution
4. Infer org complexity from: team size, leadership titles, reported org structure

**Department Classification**:
```
Title contains "Sales" / "SDR" / "AE" / "Account Executive" → Sales
Title contains "Engineer" / "Developer" / "Architect" / "SRE" → Engineering
Title contains "Support" / "Success" / "CSM" → Customer Success / Support
Title contains "Marketing" / "Growth" / "Content" → Marketing
Title contains "Product" / "PM" → Product
...
```

**Org Complexity Heuristics**:
- < 100 people → Flat (or founder-led with few layers)
- 100-500 → Hierarchical (management layers emerge)
- 500+ → Matrix (cross-functional structures common)
- VP of X + Director of Y + Manager of Z → Hierarchical confirmed

---

## Phase 4: Strategic Signals Extraction

**Goal**: Identify executive priorities, known bottlenecks, and strategic direction.

**Process**:
1. Search for recent leadership communications (CEO letters, earnings calls, blog posts)
2. Extract themes using frequency analysis
3. Identify direct quotes about priorities and challenges
4. Infer AI stance from explicit statements and product direction
5. Identify bottlenecks from: customer reviews (complaints), job postings (urgent hires), leadership statements

**Priority Signal Strength**:
- Direct quote from CEO = Strong
- Mentioned in investor letter = Strong
- Consistent across multiple communications = Confirmed
- Mentioned once in passing = Weak

---

## Phase 5: Constraint & Compliance Assessment

**Goal**: Identify constraints that affect AI opportunity feasibility.

**Process**:
1. Check trust/security page for certifications (SOC2, HIPAA, ISO, etc.)
2. Infer regulatory exposure from industry (FinTech → banking regs, HealthTech → HIPAA)
3. Infer resource constraints from: revenue stage, hiring freeze signals, funding recency
4. Infer cultural constraints from: org size, industry, AI stance, change history

**Constraint Catalog**:

| Constraint Type | Signals | 
|----------------|---------|
| Technical | Outdated tech stack, no data warehouse, legacy systems |
| Regulatory | Industry regulations, certifications, privacy requirements |
| Organizational | Deep approval chains, matrix org, unionized |
| Cultural | Low change capacity, skeptical AI stance |
| Resource | Limited budget, hiring freeze, no AI talent |

---

## Confidence Calibration

### Single Signal Confidence
| Signal Source | Base Confidence |
|---------------|----------------|
| [Research] — Official company source | High |
| [Research] — Third-party verified source | Medium-High |
| [Research] — Unverified third-party | Medium |
| [Inference] — Strong pattern match | Medium |
| [Inference] — Weak pattern match | Low |

### Cross-Signal Confidence
| Agreement Pattern | Multiplier |
|------------------|------------|
| 2+ independent [Research] signals agree | 1.5x (max High) |
| 3+ independent [Research] signals agree | 2x (max Confirmed) |
| [Research] + [Inference] agree | 1.5x (max High) |
| Signals conflict | 0.5x penalty |

---

## Integration with Downstream Agents

| Agent | What Company Intelligence Provides |
|-------|-----------------------------------|
| Technology Intelligence | Company identity, size, stage, industry for tech stack inference |
| Workflow Intelligence | Department structure, org complexity for workflow mapping |
| Industry Intelligence | Industry, sub-industry for industry benchmarking |
| Hypothesis Agent | Executive priorities, known bottlenecks for hypothesis generation |
| Adaptive Assessment | All profile data for question personalization |
| Knowledge Graph | Identity, structure, executive priorities, constraints as graph nodes |
| Reasoning V2 | Complete profile as primary input to reasoning pipeline |
