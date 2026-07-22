# Research Framework

## Overview

The Compass Research Framework defines how public information is collected, processed, and structured to build organizational profiles. Research is conducted by specialized sub-agents that each focus on a specific source category.

---

## Research Principles

1. **Public data only**: All sources must be publicly accessible without authentication.
2. **Source citation**: Every data point traces to a specific, verifiable source.
3. **Confidence disclosure**: Every inference includes confidence level.
4. **Freshness requirements**: Research data decays; staleness limits confidence.
5. **Ethical collection**: Respect robots.txt, rate limits, and terms of service.

---

## Research Methods

### Web Research
- Crawl company website: About, Team, Careers, Pricing, Product pages
- Extract structured data from HTML/JSON-LD
- Parse blog, changelog, and documentation

### Social Research
- LinkedIn company page for headcount, departments, roles
- LinkedIn job postings for hiring velocity and roles
- Twitter/X for company announcements and culture signals
- Glassdoor for employer sentiment (organization-level)

### Technical Research
- GitHub org for engineering practices, languages, contributions
- Wappalyzer/WhatRuns for tech stack detection
- Stack Overflow for engineering culture signals
- Integrations page for tech ecosystem

### Content Research
- Blog analysis for content velocity, topics, quality
- CEO letters and interviews for strategic priorities
- Case studies for customer success patterns
- Webinars and talks for thought leadership

### Financial Research
- Crunchbase for funding, investors, and milestones
- SEC filings for public company financials
- Press releases for announcements
- Pricing page for business model signals

### Review Research
- G2, Capterra, TrustRadius for customer sentiment
- Product Hunt for product reception
- App store reviews for mobile products

---

## Research Depth Levels

| Level | Sources | Coverage | Time | Confidence |
|-------|---------|----------|------|------------|
| Basic | Website, Crunchbase, LinkedIn | Name, size, industry, funding | 5 min | Low-Medium |
| Standard | + Blog, jobs, eng blog | Tech stack, departments, strategy | 15 min | Medium |
| Deep | + Reviews, interviews, social | Workflow signals, bottlenecks, culture | 30 min | Medium-High |
| Full | All sources, cross-referenced | Complete organizational profile | 60 min | High |

---

## Research Outputs

| Output | Content | Schema |
|--------|---------|--------|
| Company Identity | Name, industry, stage, size, business model | company-profile-schema.json |
| Tech Stack | Tools by category with confidence | technology-profile.json |
| Executive Priorities | Top 3-5 priorities with source citations | company-profile-schema.json |
| Department Structure | Departments, estimated size, confidence | company-profile-schema.json |
| Known Bottlenecks | Operational friction indicators | company-profile-schema.json |
| AI Maturity | AI adoption level, known tools | company-profile-schema.json |

---

## Research Limitations

1. **Private companies**: Limited financial data for private companies
2. **Signal noise**: Public persona ≠ internal reality
3. **Freshness**: Public data may be months out of date
4. **Coverage gaps**: Small companies have fewer public signals
5. **Self-reporting bias**: Company websites are aspirational
6. **Language barriers**: Non-English sources may be missed
