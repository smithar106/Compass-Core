# Executive Explanation Framework

## Overview

The Executive Explanation Framework structures how Reasoning V2 Stage 2 transforms ranked patterns into a clear, strategic narrative for company leadership. The explanation must be credible, personalized, and actionable.

---

## Explanation Structure

Every executive explanation follows this structure:

1. **Executive Summary** (2-3 sentences)
2. **AI Opportunity Landscape** (thematic overview)
3. **Top 3 Opportunities** (detailed)
4. **Additional Opportunities** (brief)
5. **Implementation Roadmap** (overview)
6. **Strategic Implications** (wider context)

---

## Section Details

### 1. Executive Summary

Format:
```
[Company Name] has significant AI opportunities in [top theme], [second theme], and [third theme].
Based on our assessment, [primary opportunity] represents the highest-impact, highest-feasibility
opportunity with an estimated [impact] value.
```

**Rules**:
- Must reference company by name
- Must include the single highest-priority opportunity
- Must cite evidence source (assessment or research)

### 2. AI Opportunity Landscape

Format:
```
Your organization's AI opportunity landscape spans [N] themes:

1. [Theme Name] — [brief description] (N opportunities)
2. [Theme Name] — [brief description] (N opportunities)
...
```

**Rules**:
- Themes should be named descriptively (e.g., "Go-to-Market Acceleration")
- Each theme includes a count of opportunities within it
- Themes are ordered by total impact potential

### 3. Top 3 Opportunities

Each opportunity gets:

```
## [Opportunity Name]

**What**: [1-sentence description of the opportunity]
**Evidence**: [What signals support this] (confidence: [Level])
**Impact**: [Specific business impact estimate]
**Feasibility**: [Implementation difficulty] 
**Sequence**: [Where this fits in the implementation order]

**Supporting Signals**:
- [Signal 1: Evidence] (confidence: [Level])
- [Signal 2: Evidence] (confidence: [Level])
- ...

**Why This Company**: [Personalized context connecting to company specifics]
```

**Rules**:
- Each opportunity must include at least 2 supporting signals from the knowledge graph
- Must explain WHY this opportunity fits this specific company
- Must cite evidence confidence levels
- Impact estimates should be ranges, not single numbers

### 4. Additional Opportunities

Brief descriptions of opportunities beyond the top 3:
```
- [Opportunity Name]: [1-line description] (Impact: [Level], Feasibility: [Level])
```

**Rules**:
- Maximum 7 additional opportunities
- No detailed evidence mapping (brief only)
- Flag any dependencies between additional and top 3

### 5. Implementation Roadmap

```
## Recommended Sequence

### Phase 1 (Next 1-3 months): Quick Wins
- [Opportunity 1]: [Action]
- [Opportunity 2]: [Action]

### Phase 2 (3-6 months): Core Opportunities
- [Opportunity 3]: [Action]

### Phase 3 (6-12 months): Strategic Bets
- [Opportunity 4]: [Action]
```

**Rules**:
- Feasibility determines phase placement
- Dependencies determine ordering within phases
- Each phase includes estimated timeline

### 6. Strategic Implications

Wider implications:
- How these opportunities affect company strategy
- Organizational changes needed
- Risks if opportunities are not pursued

---

## Narrative Voice

### Tone

- **Direct and specific**: "Your sales team spends 15+ hours per week on manual lead research"
- **Not sales-y**: Avoid "revolutionize", "transform", "game-changer"
- **Confidence-calibrated**: "Our research suggests", "The assessment indicates", "We have high confidence that"

### Personalization

- Reference company specifics: industry, size, growth stage
- Use examples from their assessment responses
- Connect opportunities to their stated goals

### Evidence Anchoring

Every claim must be traceable to a source:
- "Your assessment responses indicate..." → Assessment evidence
- "Our research found..." → Intelligence evidence
- "Companies similar to yours typically..." → Benchmark evidence

---

## Quality Standards

| Standard | Requirement |
|----------|-------------|
| Specificity | Every claim references company-specific evidence |
| Actionability | Every opportunity includes a concrete action |
| Honesty | Low-confidence claims clearly labeled as speculative |
| Brevity | Executive summary ≤ 100 words, full report ≤ 1500 words |
| Consistency | No contradictions between claims |

---

## Example Excerpt

```
## AI Opportunity Landscape

Your organization's AI opportunity landscape spans 3 themes:

1. **Go-to-Market Acceleration** — 3 opportunities in sales enablement,
   lead qualification, and pipeline management
2. **Customer Experience** — 2 opportunities in support automation and
   self-service
3. **Revenue Operations** — 2 opportunities in forecasting and
   revenue intelligence

---

## Top 3 Opportunities

### Automated Lead Qualification

**What**: Deploy AI-powered lead qualification to reduce SDR manual research
from 15+ hours to under 2 hours per week.

**Evidence**: Your assessment indicates manual lead research is your #1 sales
friction (confidence: Confirmed), and your tech stack already includes
Salesforce (confidence: Confirmed), which supports most AI lead tools.

**Impact**: 70-85% reduction in SDR research time, enabling each SDR to
handle 3x more leads.

**Feasibility**: High — Salesforce ecosystem has mature AI plugins.

**Sequence**: Phase 1 (Quick Win)
```
