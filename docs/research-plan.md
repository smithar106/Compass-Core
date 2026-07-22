# Research Plan: Company Intelligence via Public Sources

## 1. Purpose

Compass research agents gather publicly available information about target companies to build an operational profile without requiring internal access. This profile feeds the Intelligence Layer and enables the Adaptive Assessment to ask relevant, personalized questions.

---

## 2. Research Methods

### 2.1 Source Categories

| Category | Sources | Information Gathered |
|----------|---------|---------------------|
| **Corporate Website** | Company website, About page, Product pages, Pricing page, Careers page, Leadership page | Company description, product categories, pricing model, team size, leadership, open roles |
| **Financial Signals** | Crunchbase, PitchBook, AngelList, SEC filings (if public), press releases | Funding rounds, total raised, valuation, revenue stage, investors |
| **Leadership Signals** | CEO letters, investor presentations, blog posts, podcast appearances, keynote talks | Strategic priorities, stated challenges, focus areas, AI stance |
| **Engineering Signals** | Engineering blog, GitHub org, Stack Overflow, tech posts | Tech stack, engineering culture, open-source usage, tooling choices |
| **Customer Signals** | G2, Capterra, TrustRadius, AppSumo, review sites | Customer sentiment, common complaints, feature requests |
| **Talent Signals** | LinkedIn company page, Indeed, Glassdoor, job boards | Headcount, hiring velocity, department sizes, roles, turnover signals |
| **Product Signals** | Product changelog, release notes, feature announcements, product hunt | Product maturity, release cadence, feature areas |
| **Content Signals** | Blog, whitepapers, webinars, case studies | Content maturity, thought leadership areas, marketing focus |
| **Social Signals** | LinkedIn posts, Twitter/X, Reddit mentions, Hacker News | Public perception, employer brand, community engagement |
| **Partnership Signals** | Partner directory, integration listings, marketplace presence | Ecosystem, integration strategy, platform dependencies |

### 2.2 Research Depth Levels

| Level | Coverage | Sources | Confidence |
|-------|----------|---------|------------|
| **Basic** | Name, industry, size, funding | Website, LinkedIn, Crunchbase | Low-Medium |
| **Standard** | + Tech stack, departments, priorities | + Engineering blog, job posts, leadership content | Medium |
| **Deep** | + Workflow signals, bottlenecks, culture | + Customer reviews, interviews, podcasts, social | Medium-High |
| **Full** | + All available signals, cross-referenced | + All sources, triangulation | High |

---

## 3. Research Agent Architecture

Research is conducted by a set of specialized sub-agents, each responsible for one source category. Agents run in parallel where possible.

### Agent: Company Research Agent

**Responsibility**: Profile the company's identity, size, stage, and structure.

**Sources**: Website, Crunchbase, LinkedIn, Wikipedia, SEC filings

**Outputs**:
- Company name and description
- Headcount estimate
- Revenue stage (Seed/Series A/B/C/Growth/Mature)
- Business model (SaaS, usage-based, hybrid)
- Customer segments (SMB, Mid-market, Enterprise)
- Geographic presence
- Year founded
- Funding information

**Edge cases**:
- Private company with no funding data → estimate from headcount and product maturity
- Multiple companies with same name → disambiguate by URL and location
- Recently rebranded company → check from historical sources

### Agent: Technology Research Agent

**Responsibility**: Infer the company's tech stack from public signals.

**Sources**: Job postings, engineering blog, GitHub, Wappalyzer signals, integration pages

**Outputs**:
- CRM (e.g., Salesforce, HubSpot, Pipedrive)
- Support platform (e.g., Zendesk, Intercom, Freshdesk)
- HRIS (e.g., Workday, BambooHR, Rippling)
- Engineering tools (e.g., GitHub, GitLab, Jira, Linear)
- Cloud provider (e.g., AWS, GCP, Azure)
- AI tools (if revealed publicly)
- Data warehouse (e.g., Snowflake, Redshift, BigQuery)
- Communication tools (e.g., Slack, Teams, Discord)

**Edge cases**:
- Company uses multiple systems for same function → report all with confidence
- No public tech signals → report minimal confidence, flag for assessment
- Acquired company using legacy + new stack → note complexity

### Agent: Leadership Intelligence Agent

**Responsibility**: Extract strategic priorities, known bottlenecks, and AI stance from leadership communications.

**Sources**: CEO letters, earnings calls (public), investor presentations, blog posts, podcast interviews, keynote videos

**Outputs**:
- Top 3-5 strategic priorities
- Known operational challenges
- AI stance (enthusiastic/cautious/skeptical)
- Recent organizational changes
- Growth stage indicators

**Technique**: Extract direct quotes where possible. Infer priorities from repeated themes in communications.

**Edge cases**:
- No leadership content available → skip, note limitation
- Extremely generic CEO letters → low confidence, flag for assessment
- Conflicting statements across sources → record both, note uncertainty

### Agent: Organizational Structure Agent

**Responsibility**: Infer departmental structure, team sizes, and org complexity.

**Sources**: LinkedIn (employee profiles), job postings, team page, org announcements

**Outputs**:
- Department list
- Estimated team sizes per department
- Org complexity (flat/hierarchical/matrix)
- Recent restructuring signals
- Key executive hires/departures

**Edge cases**:
- Company too small for LinkedIn signals (< 50 employees) → use team page
- Rapidly growing company → hiring velocity as signal
- Remote-first company → different collaboration patterns

---

## 4. Ethical Guidelines

### 4.1 Data Ethics

1. **Public data only**: All research sources must be publicly accessible without authentication, paywalls, or special access.
2. **No scraping of proprietary content**: Content behind login, paywall, or NDA will not be accessed.
3. **No personal data collection**: Research focuses on organizational structure, not individual employee data (except publicly stated leadership roles).
4. **Fair use compliance**: Respect robots.txt, rate limits, and terms of service of all sources.
5. **Transparency**: Every researched data point cites its source.

### 4.2 Privacy

1. **No individual profiling**: Researchers profile organizations, not individuals.
2. **No employee evaluation**: Individual job titles are collected only to infer organizational structure, not to evaluate performance.
3. **No contact information collection**: Email addresses, phone numbers, and personal contact info are not collected.
4. **Data minimization**: Collect only what is necessary for organizational profiling.

### 4.3 Accuracy

1. **Uncertainty disclosure**: Every inference includes confidence level.
2. **Source citation**: Every claim cites its source.
3. **Conflicting evidence**: Conflicts are recorded, not hidden.
4. **Outdated data risk**: Research timestamp is included.
5. **Correction path**: Users can correct research findings during assessment.

---

## 5. Quality Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Source diversity | ≥ 5 unique sources per company | Count sources used |
| Confidence granularity | 100% of inferences have confidence | Audit output |
| Research accuracy | ≥ 85% on known benchmarks | Periodic manual verification |
| Freshness | Research < 30 days old | Timestamp comparison |
| Coverage (basic) | 100% of companies | Minimum viability check |
| Coverage (standard) | ≥ 80% of companies | Assess signal availability |

---

## 6. Research Limitations

1. **Public data is incomplete**: Private companies may have very limited public signals. Some inferences will be low confidence.
2. **Signals can be misleading**: A company's public persona (website, blog, LinkedIn) may not match internal reality.
3. **Time lag**: Public data (Crunchbase, LinkedIn) may be weeks or months out of date.
4. **Self-reporting bias**: Company websites present an idealized version. Leadership communications are aspirational.
5. **Size-dependent coverage**: Smaller companies (< 50 employees) generate fewer public signals.
6. **Industry variation**: Some industries are more publicly transparent than others.

---

## 7. Tooling & Infrastructure

| Tool | Purpose |
|------|---------|
| Web crawler | Fetch and parse web pages |
| LLM orchestration | Extract structured data from unstructured sources |
| Job board aggregator | Collect and analyze job postings |
| GitHub API | Analyze eng org, languages, tools |
| Crunchbase API | Company financial data |
| LinkedIn API | Organizational structure signals |
| Review aggregator | Customer sentiment analysis |
