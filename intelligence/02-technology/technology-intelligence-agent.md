# Technology Intelligence Agent

## Overview

The Technology Intelligence Agent infers a company's technology stack from public signals and determines which integrations Compass should recommend and which to skip. It also estimates implementation difficulty for each integration.

---

## Inputs

| Input | Source |
|-------|--------|
| Company Profile | Company Intelligence Agent |
| Website URL | User |
| Public tech signals | Job postings, eng blog, GitHub, website analysis |

---

## Outputs

| Output | Description |
|--------|-------------|
| Tech Stack Profile | Detected tools by category with confidence |
| Integration Priority | Recommended integrations ranked by value/effort |
| Implementation Difficulty | Per-system and per-integration difficulty estimates |

---

## Technology Categories

| Category | Systems Detected |
|----------|-----------------|
| CRM | Salesforce, HubSpot, Pipedrive, Close, Copper |
| Support | Zendesk, Intercom, Freshdesk, Help Scout, Kustomer |
| HRIS | Workday, BambooHR, Rippling, Gusto, Personio |
| ERP/Finance | NetSuite, QuickBooks, Xero, Sage, Bill.com |
| Engineering | GitHub, GitLab, Bitbucket, Jira, Linear, Asana |
| Documentation | Confluence, Notion, Guru, Slab, GitBook |
| Cloud | AWS, GCP, Azure |
| AI Tools | OpenAI, Anthropic, LangChain, HuggingFace, Replicate |
| Identity | Okta, OneLogin, Azure AD, Auth0 |
| Data Warehouse | Snowflake, Redshift, BigQuery, Databricks |
| Communication | Slack, Microsoft Teams, Discord |
| Marketing | HubSpot, Marketo, Pardot, Mailchimp |
| Analytics | Mixpanel, Amplitude, Heap, Google Analytics |

---

## Detection Methods

### Method 1: Job Posting Analysis

Parse job descriptions for required tool experience.

**Example**: "5+ years of Salesforce experience required" → CRM: Salesforce (High confidence)

### Method 2: Engineering Blog Analysis

Parse engineering blog for technology mentions.

**Example**: "We migrated our data warehouse from Redshift to Snowflake" → DW: Snowflake (Confirmed)

### Method 3: Integration Page Analysis

Parse integration/partners page for listed integrations.

**Example**: "Slack, Salesforce, Jira, Zendesk" → confirmed integrations

### Method 4: Website Technical Detection

Analyze website headers, cookies, and JavaScript for tool signatures.

### Method 5: GitHub Organization Analysis

Check GitHub org for tools used across repositories:
- `.github/workflows` → CI/CD tools
- `package.json`, `requirements.txt` → language/framework
- `Dockerfile` → containerization

---

## Integration Priority Rubric

Each potential integration is scored on:

### Value Score (1-10)

| Criteria | Points |
|----------|--------|
| Directly enables AI opportunity | +3 |
| Reduces manual data entry | +3 |
| Unlocks data for analysis | +2 |
| Improves cross-dept collaboration | +2 |
| Required for compliance | +1 |

### Effort Score (1-10)

| Criteria | Points |
|----------|--------|
| API available | +1 (low effort) |
| Standard REST API | +2 |
| Requires OAuth 2.0 | +3 |
| Custom integration needed | +6 |
| Legacy system, no API | +10 |

### Priority Matrix

```
Priority = Value / Effort

High Priority: Value >= 5 AND Effort <= 3
Medium Priority: Value >= 4 AND Effort <= 6
Low Priority: Value < 4 OR Effort > 6
Skip: Effort > 8 OR system not relevant to AI opportunities
```

---

## Implementation Difficulty Estimation

| Difficulty | Description | Typical Timeline |
|------------|-------------|------------------|
| Low | Existing API, standard auth, documented | 1-2 weeks |
| Medium | API exists but requires custom mapping | 2-4 weeks |
| High | No API or complex legacy system | 4-8 weeks |
| Very High | No API, data extraction via scraping or manual | 8+ weeks |

---

## Edge Cases

### Company Uses Multiple CRMs

Salesforce + HubSpot + Pipedrive

**Action**: Report all. Infer primary from job posting frequency and integration page.

### No Public Tech Signals

**Action**: Return empty tech stack. Confidence: Low. Flag for assessment to fill gaps.

### Recently Migrated

**Action**: If migration signals detected, include "transitioning" note. Confidence: Medium.

### Custom / Homegrown Systems

**Action**: If job postings mention "internal tool" or custom platform, flag as potential integration challenge.
