# Company Intelligence Agent

## Overview

The Company Intelligence Agent is the orchestrator of the Intelligence Layer. Given a company name and website URL, it produces a comprehensive operational profile through a combination of public research and inference.

This agent does NOT have direct access to internal company data. All inferences are based on public signals and pattern matching.

---

## Inputs

| Input | Required | Source |
|-------|----------|--------|
| Company Name | Yes | User |
| Website URL | Yes | User |
| Industry (optional) | No | User (if known) |

---

## Outputs

The agent produces a Company Profile containing:

| Category | Fields | Inference Method |
|----------|--------|-----------------|
| Identity | Industry, sub-industry, business model, customer segments | Website parsing, Crunchbase |
| Size | Headcount estimate, headcount range, confidence | LinkedIn, job postings, team page |
| Revenue Stage | Seed/Series A/B/C/Growth/Mature | Crunchbase, press, headcount inference |
| Funding | Total raised, last round, investors | Crunchbase, press releases |
| Organizational Structure | Departments, sizes, org complexity | LinkedIn, team page, inference |
| Executive Priorities | Top 3-5 priorities with source citations | CEO letters, interviews, blog |
| Known Bottlenecks | Operational friction points | Assessment, research analysis |
| AI Maturity | Level, known tools, AI stance | AI blog posts, job postings, partnerships |
| Tech Maturity | Level, tools, infrastructure | Tech stack detection |
| Constraints | Technical, regulatory, organizational, resource | Industry, certifications, assessment |
| Approval Structure | Centralized/decentralized/consensus-driven | Org structure, company size inference |
| Compliance Profile | Frameworks, certifications | Trust page, privacy policy |

---

## Inference Logic

### Headcount Estimation

**Method**: Multi-source triangulation
1. LinkedIn employee count (most reliable if available)
2. Team page headcount (often incomplete)
3. Job posting volume (inference: open roles ≈ 10-20% of total)
4. Crunchbase employee range (often outdated)

**Formula**:
```
headcount = weighted_average([
  (linkedin_count, weight=0.5),
  (team_page_count * 1.2, weight=0.2),  # team page usually incomplete
  (open_roles * 7, weight=0.2),          # avg 15% of headcount
  (crunchbase_range_midpoint, weight=0.1)
])
```

**Confidence**:
- 2+ sources agree within 20% → High
- Sources disagree by 20-50% → Medium
- Single source or >50% disagreement → Low

### Revenue Stage Inference

**Method**: Pattern matching

| Signal | Stage |
|--------|-------|
| Headcount < 50, < $5M funding | Seed |
| Headcount 50-150, $5-20M funding | Series A |
| Headcount 150-400, $20-100M funding | Series B-C |
| Headcount 400-1000, $100M+ funding, public signals | Growth |
| Headcount 1000+, public company or large private | Mature |

### Department Structure Inference

**Method**: Role distribution from LinkedIn + job postings

For each department, estimate size based on:
- Percentage of LinkedIn profiles with that department's keywords
- Open roles in that department
- Industry benchmark ratios (e.g., 30% eng, 20% sales for B2B SaaS)

**Industry Benchmarks (B2B SaaS, 100-500 employees)**:
| Department | Typical % |
|------------|-----------|
| Engineering | 25-35% |
| Sales | 15-25% |
| Support | 8-12% |
| Customer Success | 5-10% |
| Marketing | 8-12% |
| Product | 5-8% |
| Finance | 3-5% |
| People/HR | 2-4% |
| Legal | 1-3% |
| Operations | 3-5% |

---

## Edge Cases

### Private Company, No Funding Data
- Cannot determine revenue stage from funding
- Infer from headcount, product maturity, and growth signals
- Confidence: Low

### Recently Rebranded Company
- Check Crunchbase for former names
- Search both old and new names
- Note rebranding in profile

### Conglomerate / Multi-Product Company
- Identify which division/parent is being assessed
- Focus research on the specific entity
- Note parent relationship if relevant

### Company with Common Name
- Disambiguate by website URL (primary)
- Check location, industry, size for confirmation
- Include disambiguation notes in profile

---

## Evidence Structure

Every inference in the Company Profile includes:

```yaml
inference: "Headcount estimate: 400 employees"
confidence: "High"
evidence:
  - type: "Research"
    source: "LinkedIn Company Page"
    detail: "LinkedIn shows 387 employees"
    timestamp: "2026-07-20T14:30:00Z"
  - type: "Research"
    source: "Crunchbase"
    detail: "Crunchbase range: 201-500 employees"
    timestamp: "2026-07-20T14:35:00Z"
  - type: "Research"
    source: "Job Postings Analysis"
    detail: "35 open roles suggests ~350-525 total headcount"
    timestamp: "2026-07-20T14:40:00Z"
reasoning: >
  Three independent sources converge on ~350-500 employees.
  LinkedIn is most current and specific. Job posting volume
  is consistent with this range. Crunchbase range is broad
  but does not contradict.
```
