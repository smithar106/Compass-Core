# Research Agent Design

## Overview

Compass deploys 14 specialized research sub-agents, each responsible for extracting specific signals from public sources. Agents operate in parallel where possible and report results to the Company Intelligence Agent for consolidation.

---

## Agent Architecture

```
Orchestrator (Company Intelligence Agent)
  ├── Identity Agent
  ├── Financial Research Agent
  ├── Technology Research Agent
  ├── Leadership Intelligence Agent
  ├── Organizational Structure Agent
  ├── Job Posting Agent
  ├── Engineering Signals Agent
  ├── Customer Sentiment Agent
  ├── Content Analysis Agent
  ├── Social Signals Agent
  ├── Compliance Research Agent
  ├── AI Signals Agent
  ├── Competitive Research Agent
  └── Partnership Research Agent
```

---

## Agent Definitions

### 1. Identity Agent

**Purpose**: Determine basic company identity and classification.

**Sources**: Company website, Wikipedia, Crunchbase, LinkedIn

**Outputs**:
- Legal/operating name
- Industry and sub-industry classification
- Business model (SaaS, usage-based, etc.)
- Year founded
- Headquarters location
- Company description and tagline

**Logic**:
1. Fetch company website → extract meta description, title, structured data
2. Cross-reference with Crunchbase for industry classification
3. Verify against LinkedIn company page
4. If discrepancies, use majority vote with source authority tiebreaker

**Edge Cases**:
- Multiple companies with same name → disambiguate by URL
- Recently rebranded → check Crunchbase for former names
- Parent vs. subsidiary → determine which entity is the assessment target

### 2. Financial Research Agent

**Purpose**: Gather financial signals: funding, valuation, revenue stage.

**Sources**: Crunchbase, SEC filings (EDGAR), PitchBook, press releases, funding announcements

**Outputs**:
- Total funding raised
- Last round type, date, amount
- Notable investors
- Revenue stage estimate
- Valuation (if available)
- Public/private status

**Logic**:
1. Query Crunchbase API for funding data
2. If public, fetch SEC filings for financials
3. Cross-reference with press releases
4. If private and no funding data, estimate stage from headcount and product maturity

**Edge Cases**:
- Bootstrapped company → no funding data, infer stage from headcount
- SPAC or reverse merger → treat as public, check SEC filings
- International company → check local equivalents of Crunchbase

### 3. Technology Research Agent

**Purpose**: Infer the company's technology stack from public signals.

**Sources**: Job postings (technical requirements), engineering blog, GitHub org, integration pages, Wappalyzer detection

**Outputs**:
- CRM, Support platform, HRIS, ERP
- Engineering tools (GitHub, Jira, Linear)
- Cloud provider
- Data warehouse
- AI tools
- Communication tools

**Logic**:
1. Check job postings for tool requirements listed in descriptions
2. Check engineering blog for technology mentions
3. Check GitHub org for repos, languages, contributions
4. Check integration page for partner technologies
5. Use Wappalyzer detection from website

**Edge Cases**:
- No public tech signals → return empty, low confidence
- Conflicting signals (e.g., multiple CRMs) → report all with notes
- Acquired company → check for legacy + new stack signals

### 4. Leadership Intelligence Agent

**Purpose**: Extract strategic priorities, known challenges, and AI stance from leadership.

**Sources**: CEO letters, earnings transcripts, investor presentations, blog posts, podcast interviews

**Outputs**:
- Top 3-5 strategic priorities with supporting quotes
- Known operational challenges
- AI stance (enthusiastic/cautious/skeptical)
- Recent organizational changes
- Growth stage indicators

**Logic**:
1. Search for recent CEO communications (letters, blog posts, interviews)
2. Extract themes using NLP (frequency analysis of topics)
3. Identify direct quotes about priorities and challenges
4. Assess AI stance from explicit statements and tone
5. Cross-reference multiple communications for consistency

**Edge Cases**:
- No leadership content → skip, note limitation
- Generic statements only → low confidence, flag for assessment
- Conflicting priorities across sources → record all with source attribution

### 5. Organizational Structure Agent

**Purpose**: Infer departmental structure and team sizes.

**Sources**: LinkedIn company page, team page, job postings, org announcements

**Outputs**:
- List of departments
- Estimated headcount per department
- Org complexity (flat/hierarchical/matrix)
- Key executives and their roles
- Recent restructuring signals

**Logic**:
1. Use LinkedIn data for department distribution
2. Analyze job postings for team structure signals
3. Check team page for reporting structure
4. Cross-reference with press releases for exec announcements

**Edge Cases**:
- Small company (<50) → limited LinkedIn data, use team page
- Remote-first → different collaboration patterns, note
- Rapidly growing → use hiring velocity as team growth indicator

### 6. Job Posting Agent

**Purpose**: Analyze job postings for hiring velocity, roles, and tech stack signals.

**Sources**: LinkedIn Jobs, Indeed, company careers page, Glassdoor

**Outputs**:
- Total open positions
- Role distribution by department
- Hiring velocity (new vs. old postings)
- Tech stack mentions
- Seniority distribution
- Remote/onsite requirements

**Logic**:
1. Collect job postings from multiple sources
2. Deduplicate across sources
3. Categorize by department and seniority
4. Extract tech stack mentions from requirements
5. Track posting dates for velocity calculation

**Edge Cases**:
- No job postings → cannot determine hiring signals
- Always-open postings → filter by recent date
- Ghost jobs (posted but not actively hiring) → cannot easily detect, note limitation

### 7. Engineering Signals Agent

**Purpose**: Assess engineering practices and culture.

**Sources**: GitHub org, engineering blog, Stack Overflow, tech talks

**Outputs**:
- Primary languages and frameworks
- Open source contributions
- Engineering blog activity
- CI/CD indicators
- Testing culture signals
- Documentation quality indicators

**Logic**:
1. Analyze GitHub org: repo count, stars, forks, contribution frequency
2. Check for CI/CD configuration files in repos
3. Analyze engineering blog for post frequency and topics
4. Check Stack Overflow for company presence

**Edge Cases**:
- No GitHub org → limited engineering signals
- Private repos only → limited visibility
- No engineering blog → skip, note

### 8. Customer Sentiment Agent

**Purpose**: Gather customer satisfaction and complaint signals.

**Sources**: G2, Capterra, TrustRadius, AppSumo, app store reviews

**Outputs**:
- Average rating
- Common praise themes
- Common complaint themes
- Feature request frequency
- Support quality perception

**Logic**:
1. Query review aggregators for company listing
2. Extract ratings and review counts
3. Analyze review text for themes (NLP topic modeling)
4. Identify recurring complaints

**Edge Cases**:
- No reviews → no customer sentiment data
- Low review count (<10) → low confidence
- Astroturfed reviews → difficult to detect, note limitation

### 9. Content Analysis Agent

**Purpose**: Assess content marketing maturity and focus areas.

**Sources**: Company blog, whitepapers, case studies, webinars

**Outputs**:
- Content publishing frequency
- Content topics and themes
- Content quality assessment
- Thought leadership areas
- SEO maturity indicators

**Logic**:
1. Crawl blog for posts, dates, categories
2. Analyze post frequency over time
3. Extract topics using NLP
4. Assess SEO optimization (headings, meta, structure)

**Edge Cases**:
- No blog → no content signals
- Infrequent posting → low maturity signal
- AI-generated content → note as possible signal about AI stance

### 10. Social Signals Agent

**Purpose**: Assess social media presence and public perception.

**Sources**: LinkedIn posts, Twitter/X, Reddit, Hacker News

**Outputs**:
- Social media activity level
- Employer brand signals
- Community engagement
- PR/crisis indicators
- Thought leadership reach

**Logic**:
1. Check social profiles for activity frequency
2. Analyze post engagement
3. Check Reddit/HN for mentions and sentiment
4. Monitor for crisis signals

### 11. Compliance Research Agent

**Purpose**: Identify compliance frameworks and regulatory exposure.

**Sources**: Trust page, privacy policy, terms of service, industry classification

**Outputs**:
- Security certifications (SOC2, HIPAA, ISO, etc.)
- Data privacy compliance (GDPR, CCPA)
- Industry-specific regulations
- Security practices indicators

**Logic**:
1. Check trust/security page for certifications
2. Analyze privacy policy for data handling practices
3. Infer regulatory exposure from industry

### 12. AI Signals Agent

**Purpose**: Detect AI-related activity and maturity.

**Sources**: AI blog posts, product announcements, partnerships, job postings

**Outputs**:
- AI maturity level
- Known AI tools/investments
- AI stance from leadership
- AI hiring signals

**Logic**:
1. Search for AI/ML mentions on blog, press releases
2. Check job postings for AI-specific roles
3. Monitor AI vendor partnerships
4. Assess AI stance from leadership communications

### 13. Competitive Research Agent

**Purpose**: Understand competitive positioning and market context.

**Sources**: Analyst reports, competitive reviews, market positioning

**Outputs**:
- Primary competitors
- Market position (leader/challenger/niche)
- Differentiation factors
- Pricing strategy relative to market

**Logic**:
1. Identify competitors from comparison pages, reviews
2. Check G2 category positioning
3. Analyze pricing page for market positioning

### 14. Partnership Research Agent

**Purpose**: Map partner ecosystem and integration strategy.

**Sources**: Partner page, integration marketplace, press releases

**Outputs**:
- Integration partners
- Technology alliances
- Channel partners
- Marketplace presence

**Logic**:
1. Crawl partner page for listed partners
2. Check integration marketplace for connectors
3. Analyze partnership announcements

---

## Agent Coordination

### Parallel Execution

All 14 agents run in parallel with the following constraints:
- Independent agents: No constraints (most agents)
- Dependent agents: Identity Agent must complete before some following agents can correctly identify the company

### Timeouts

Each agent has a **60-second timeout**. If an agent does not return within 60 seconds, its results are skipped and research proceeds without that data source.

### Quality Threshold

Agents must achieve at least **"Low" confidence** in their primary output. If confidence is below Low, the agent's output is flagged as unreliable and may be excluded.

### Result Merging

The Orchestrator merges agent results by:
1. Deduplicating overlapping signals
2. Resolving conflicts (majority rule with source authority tiebreaker)
3. Assigning confidence based on source count and quality
4. Flagging contradictions for the assessment phase
