# Reasoning Examples

This document contains 5 fictional company walkthroughs demonstrating the complete reasoning pipeline from input to output.

---

## Example 1: "SkySync" (Cloud Storage for Enterprise)

**Input**: Company name + website URL
**Profile**: ~800 employees, Series D, $120M ARR, 5,000+ customers

### Assessment Highlights

| Question | Response | Signal |
|----------|----------|--------|
| Q-SALES-01 | "Manual research using multiple tools" | Lead qualification friction |
| Q-SUPP-01 | "Manual triage by support manager" | Ticket routing bottleneck |
| Q-FIN-01 | "Some automation via OCR/AP tool" | Partial AP automation |
| Q-LEGAL-01 | "Legal reviews every contract manually" | Legal bottleneck (enterprise) |
| Q-CS-01 | "Spreadsheet with manual data entry" | No health scoring |
| Q-ENG-01 | "Exists but outdated" | Engineering doc debt |

### Research Signals

- CEO letter: "Scaling without adding proportional headcount is our #1 priority"
- Job postings: 30 open roles (8 support, 5 legal, 4 CS)
- Certifications: SOC2 Type II, HIPAA
- Tools: Salesforce, Zendesk, Jira, Confluence, Stripe

### Pattern Matching

| Blueprint | Score | Reason |
|-----------|-------|--------|
| BP-SALES-01 (Lead Qualification) | 0.72 | Manual research + Salesforce + SDR scaling |
| BP-SUPP-01 (Ticket Routing) | 0.85 | Manual triage + Zendesk + 8 support hires |
| BP-CS-01 (Health Scoring) | 0.68 | Spreadsheet health + CS team scaling |
| BP-LEGAL-01 (Contract Review) | 0.78 | Manual review + 5 legal hires + enterprise |
| BP-FIN-01 (Invoice Processing) | 0.45 | Partial automation—low match |

### Opportunity Map (Top 5)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | Automated Ticket Triage + Routing | Confirmed | [User] Manual, [Research] Support hiring, [Inference] Zendesk ready |
| T1 | Automated NDA Processing | Confirmed | [User] Legal bottleneck, [Research] Legal hiring, [Inf] Velocity needed |
| T1 | Automated Health Score Calculation | High | [User] Spreadsheet, [Research] CS hiring, [Inf] Stage typical |
| T2 | Automated Lead Qualification | High | [User] Manual, [Inf] Salesforce ready, [Research] CEO priority |
| T2 | Automated Contract Review | Medium | [User] Manual, [Inf] Enterprise complexity, [Research] Legal hiring |

### Implementation Sequence

```
Weeks 1-4:  Automated NDA Processing (Quick Win)
            → Frees legal capacity immediately
Weeks 3-7:  Ticket Triage + Routing (Quick Win)
            → Support faster with existing team
Weeks 6-12: Health Score Calculation (Foundational)
            → Enables proactive CS
Weeks 8-16: Automated Lead Qualification (Foundational)
            → Addresses CEO scaling priority
Weeks 12-24: Contract Review System (Phased)
             → Package with NDA automation for full legal suite
```

---

## Example 2: "CodeCanvas" (Developer Tools)

**Input**: Company name + website URL
**Profile**: ~60 employees, Seed stage, $3M ARR, product-led growth

### Assessment Highlights

| Question | Response | Signal |
|----------|----------|--------|
| Q-MKTG-01 | "No formal attribution model" | Marketing analytics gap |
| Q-PROD-01 | (Open) "We use a Slack channel for feedback" | Ad-hoc feedback |
| Q-ENG-02 | "1-4 hours" | Incident RCA slow for team size |
| Q-HR-01 | "Recruiter reviews every resume manually" | Recruiting bottleneck |

### Research Signals

- CEO is former engineering leader, technical founder
- Company blog: heavy on developer experience content
- Tech stack: Modern (GitHub, Vercel, Slack, Notion, Linear)
- 4 job postings: 2 eng, 1 support, 1 growth
- No funding announcements beyond seed

### Pattern Matching

| Blueprint | Score | Reason |
|-----------|-------|--------|
| BP-PROD-01 (Feedback Synthesis) | 0.88 | Slack feedback + small team + PM capacity limited |
| BP-MKTG-03 (Lead Scoring) | 0.55 | PLG company—lead scoring less relevant |
| BP-ENG-04 (Incident Response) | 0.62 | Slow RCA + engineering-heavy team |
| BP-HR-01 (Resume Screening) | 0.45 | Manual review but low volume |

### Opportunity Map (Top 3 — limited by company size)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | User Feedback Synthesis | Confirmed | [User] Slack feedback, [Research] Product-led, [Inf] Team too small for PM/feedback |
| T1 | Automated Sales Meeting Intelligence | High | [User] Not asked directly but [Inf] PLG + enterprise deals need call intelligence |
| T2 | Incident Response Intelligence | Medium | [User] Slow RCA, [Inf] Engineering culture values reliability |

### Implementation Sequence

```
Weeks 2-5:  User Feedback Synthesis (Quick Win)
            → Informs product direction with limited PM resources
Weeks 4-8:  Meeting Intelligence (Quick Win)
            → CRM data quality improvement as side effect
Weeks 8-14: Incident Response (Foundational)
            → Engineer time savings for core product development
```

---

## Example 3: "GreenPulse" (SaaS Sustainability Analytics)

**Input**: Company name + website URL
**Profile**: ~200 employees, Series B, $15M ARR, targeting enterprise

### Assessment Highlights

| Question | Response | Signal |
|----------|----------|--------|
| Q-SALES-03 | "Within 20% of forecast" | Low forecast accuracy |
| Q-CS-01 | "CSM manually assesses each account" | CS scaling problem |
| Q-LEGAL-02 | "Manual monitoring by legal team" | Compliance monitoring gap |
| Q-OPS-01 | "Manual setup by IT for each tool" | IT provisioning friction |

### Research Signals

- CEO interview: "We need to build for enterprise compliance from day one"
- Series B announced 6 months ago (growth pressure)
- Open roles: 12 (4 sales, 3 CS, 2 compliance, 2 eng, 1 IT)
- Compliance: SOC2 in progress
- Tools: Salesforce, HubSpot, Zendesk, NetSuite

### Pattern Matching

| Blueprint | Score | Reason |
|-----------|-------|--------|
| BP-CS-01 (Health Scoring) | 0.82 | Manual CS + growth + enterprise focus |
| BP-OPS-01 (Tool Provisioning) | 0.75 | Manual IT + 12 hires inbound |
| BP-LEGAL-03 (Compliance Monitoring) | 0.79 | Manual + SOC2 in progress + enterprise target |
| BP-SALES-02 (Forecasting) | 0.65 | 20% accuracy gap |

### Opportunity Map (Top 5)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | Customer Health Score Calculation | Confirmed | [User] Manual, [Research] CS hiring, [Inf] Enterprise scaling |
| T1 | Compliance Monitoring Automation | Confirmed | [User] Manual compliance, [Research] SOC2 in progress, CEO priority |
| T2 | Tool Provisioning Automation | High | [User] Manual IT, [Research] 12 hires, [Inf] Okta-ready likely |
| T2 | Intelligent Deal Forecasting | High | [User] 20% accuracy gap, [Research] 4 sales hires, [Inf] SFDC present |
| T3 | Automated QBR Preparation | Medium | [Inference] Enterprise CS requires QBRs at scale |

### Implementation Sequence

```
Weeks 1-5:  Health Score Calculation (Quick Win)
            → Enables CS scaling immediately
Weeks 2-7:  Compliance Monitoring (Foundational)
            → CEO priority, SOC2 requirement
Weeks 5-12: Tool Provisioning Automation (Quick Win)
            → IT efficiency with 12 hires inbound
Weeks 8-16: Deal Forecasting (Conditional)
            → Requires CRM data quality improvement first
```

---

## Example 4: "TrustBind" (Contract Management SaaS)

**Input**: Company name + website URL
**Profile**: ~1,200 employees, Public company, $300M ARR

### Assessment Highlights

| Question | Response | Signal |
|----------|----------|--------|
| Q-LEGAL-01 | "AI-assisted contract review" | Already has some AI |
| Q-LEGAL-02 | "Automated compliance monitoring" | Already automated |
| Q-ENG-01 | "Comprehensive and up to date" | Mature engineering |
| Q-SALES-01 | "Automated enrichment and scoring" | Sales already modern |

### Research Signals

- Public company: earnings transcripts available
- CEO priority: "Operational efficiency through platform consolidation"
- R&D spend: 25% of revenue (below industry average for public SaaS)
- Churn rate: 8% annual (industry: 5-10%, but high for contract mgmt)

### Pattern Matching

| Blueprint | Score | Reason |
|-----------|-------|--------|
| BP-CS-02 (Churn Prediction) | 0.81 | 8% churn for contract mgmt is high |
| BP-LEGAL-05 (IP Management) | 0.72 | Contract mgmt company—should be IP leader |
| BP-ENG-03 (Test Generation) | 0.55 | Maturing eng, lower R&D spend |
| BP-OPS-04 (Vendor Performance) | 0.68 | Platform consolidation priority |

### Opportunity Map (Top 4)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | Churn Risk Prediction | Confirmed | [User] Not asked directly but [Research] High churn + [Inf] Revenue at risk |
| T1 | Vendor Performance Intelligence | High | [User] Operations Qs, [Research] Platform consolidation priority |
| T2 | IP Disclosure Management | Medium | [User] Already has AI legal tools, [Inf] Should be IP leader |
| T3 | Automated Test Generation | Low | [Inference] Lower R&D spend + mature eng → test gap |

### Implementation Sequence

```
Weeks 1-8:  Churn Risk Prediction (Quick Win + Foundational)
            → Direct revenue protection
Weeks 4-10: Vendor Performance Intelligence (Quick Win)
            → Supports consolidation strategy
Weeks 8-16: IP Management (Foundational)
            → Matches company's core business value
```

---

## Example 5: "HireFlow" (Recruiting SaaS)

**Input**: Company name + website URL
**Profile**: ~500 employees, Series C, $50M ARR

### Assessment Highlights

| Question | Response | Signal |
|----------|----------|--------|
| Q-HR-01 | "AI-powered resume screening" | Already has this |
| Q-HR-02 | "5+ emails per interview round" | Heavy scheduling pain |
| Q-SALES-02 | Scale 5/5 (excessive time) | Extreme sales friction |
| Q-FIN-02 | "3-5 days for reconciliation" | Slow financial close |

### Research Signals

- Their product IS an AI recruiting platform
- CEO blog: "We're investing in AI before our competitors"
- High growth: 40% YoY headcount growth
- 20 open roles across all departments
- Tools: Salesforce, HubSpot, NetSuite, Stripe

### Pattern Matching

| Blueprint | Score | Reason |
|-----------|-------|--------|
| BP-HR-02 (Interview Scheduling) | 0.91 | They sell recruiting—should have best-in-class scheduling |
| BP-SALES-01 (Lead Qual) | 0.75 | Extreme sales friction despite being SaaS |
| BP-FIN-03 (Revenue Reconciliation) | 0.62 | Slow close for growth-stage |
| BP-CS-01 (Health Scoring) | 0.58 | No health scoring data available |

### Opportunity Map (Top 4)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | Intelligent Interview Scheduling | Confirmed | [User] Heavy scheduling pain, [Research] Recruiting company, [Inf] Should be showcase |
| T1 | Automated Lead Qualification | Confirmed | [User] Extreme sales friction, [Research] High growth, [Inf] Core sales process |
| T2 | Automated Revenue Reconciliation | High | [User] 3-5 day close, [Inf] Growth-stage complexity |
| T3 | Customer Health Score Calculation | Medium | [Inference] Growth-stage, no data available |

### Unique Observation

HireFlow is an AI recruiting company using manual interview scheduling — this is a "dogfooding" opportunity. The recommendation includes deploying their own product's scheduling features or building a specialized internal version.

### Implementation Sequence

```
Weeks 1-4:  Interview Scheduling (Quick Win + Dogfooding)
            → They should be their own best customer
Weeks 2-7:  Lead Qualification (Quick Win)
            → Fix their own sales process
Weeks 6-12: Revenue Reconciliation (Foundational)
            → Financial close efficiency for growth
```
