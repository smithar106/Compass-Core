# Sample Assessment Results

This document contains fictional assessment results for three anonymized B2B SaaS companies. These demonstrate how the reasoning engine processes assessment data and produces AI Opportunity Maps.

---

## Company A: "NovaPay" (Payments Infrastructure)

**Profile**: Payments processing API platform, ~400 employees, Series C, $40M ARR

### Organizational Profile (Scoring)

| Dimension | Score | Confidence |
|-----------|-------|------------|
| Process Formalization | 3 | High |
| Technical Infrastructure | 4 | High |
| Data Quality & Accessibility | 3 | Medium |
| Organizational Complexity | 3 | High |
| AI Readiness | 2 | High |
| Change Capacity | 3 | Medium |
| Operational Friction | 4 | High |
| Strategic Urgency | 4 | High |
| Resource Availability | 3 | High |
| Compliance Sensitivity | 4 | High |

### Key Signals Extracted

| Signal | Source | Evidence |
|--------|--------|----------|
| High support ticket volume with manual routing | [User] Q-SUPP-01 | "Manual triage by support manager" |
| Support ticket response time > 4 hours | [User] Q-SUPP-03 | "4-24 hours" |
| Invoice processing fully manual | [User] Q-FIN-01 | "Manual data entry for all invoices" |
| Revenue reconciliation takes 3-5 days | [User] Q-FIN-02 | "3-5 days" |
| CEO priority: operational efficiency at scale | [Research] Q3 Earnings Call | "Our next phase is about operational excellence" |
| Rapid hiring: 50 open roles (20 engineering) | [Research] Job Boards | Hiring velocity suggests scaling pressure |
| Engineering documentation outdated | [User] Q-ENG-01 | "Exists but outdated" |
| No formal health scoring for customers | [User] Q-CS-01 | "Not formally tracked" |

### AI Opportunity Map (Top 5)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | Automated Invoice Processing | Confirmed | [User] Manual AP, [Inference] Stage-typical scaling pressure |
| T1 | Automated Ticket Triage & Routing | Confirmed | [User] Manual triage, slow response, [Research] High hiring |
| T2 | Intelligent Deal Forecasting | High | [Inference] Revenue stage + complex billing model |
| T2 | Automated Health Score Calculation | High | [User] No health scoring, [Research] High churn industry |
| T3 | Incident Response Intelligence | Medium | [User] Engineering outdated docs, [Research] Complex infra |

### Implementation Blueprint

```
Week 1-4:  Automated Ticket Triage (Quick Win - <4 weeks)
  → Reduces support response time, frees support manager
Week 3-8:  Automated Invoice Processing (Quick Win - 4-6 weeks)
  → Reduces AP burden, improves accuracy
Week 6-12: Customer Health Scoring (Foundational)
  → Enables proactive CS, reduces churn
Week 8-16: Deal Forecasting (Conditional - needs CRM data quality first)
  → Requires CRM cleanup before implementation
```

---

## Company B: "FlowLabs" (Workflow Automation)

**Profile**: Low-code workflow automation platform, ~150 employees, Series A, $8M ARR

### Organizational Profile

| Dimension | Score | Confidence |
|-----------|-------|------------|
| Process Formalization | 2 | High |
| Technical Infrastructure | 3 | High |
| Data Quality & Accessibility | 2 | Medium |
| Organizational Complexity | 2 | High |
| AI Readiness | 3 | High |
| Change Capacity | 4 | Medium |
| Operational Friction | 3 | High |
| Strategic Urgency | 4 | High |
| Resource Availability | 2 | High |
| Compliance Sensitivity | 2 | Medium |

### Key Signals

| Signal | Source | Evidence |
|--------|--------|----------|
| Lead qualification is manual | [User] Q-SALES-01 | "Manual research using multiple tools" |
| SDRs spend 15+ hrs/week on lead research | [User] Q-SALES-02 | Scale 4/5 |
| Forecast accuracy within 20% | [User] Q-SALES-03 | "Within 20%" |
| No formal customer health tracking | [User] Q-CS-01 | "Not formally tracked" |
| AI-forward CEO | [Research] CEO Blog | "AI is the biggest shift since cloud" |
| Co-founder as CTO | [Research] Team Page | Suggests rapid decision-making |
| Business model: usage-based | [Research] Pricing Page | Billing complexity medium |

### AI Opportunity Map (Top 5)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | Automated Lead Qualification | Confirmed | [User] Manual research + high hours, [Research] AI-ready CEO |
| T1 | Intelligent Interview Scheduling | High | [User] Heavy scheduling pain [Inference] Stage-typical recruiting |
| T2 | Automated Sales Meeting Intelligence | High | [User] Manual CRM updates, [Research] Modern tech stack |
| T2 | User Feedback Synthesis | High | [User] Product feedback is ad-hoc (Q-PROD-01 open response) |
| T3 | AI Knowledge Base Assistant | Medium | [Inference] Support scaling pressure with growth |

### Implementation Blueprint

```
Week 1-3:  Automated Lead Qualification (Quick Win)
  → Direct sales efficiency impact, CEO alignment
Week 2-5:  Sales Meeting Intelligence (Quick Win)
  → CRM data quality improvement as side effect
Week 4-10: User Feedback Synthesis (Foundational)
  → Better product decisions with limited PM resources
Week 6-12: Interview Scheduling (Quick Win)
  → Removes recruiting bottleneck for scaling
```

---

## Company C: "DataBridge" (Enterprise Data Integration)

**Profile**: Enterprise data integration and ETL platform, ~1200 employees, Growth stage (Series D), $150M ARR

### Organizational Profile

| Dimension | Score | Confidence |
|-----------|-------|------------|
| Process Formalization | 4 | High |
| Technical Infrastructure | 4 | High |
| Data Quality & Accessibility | 3 | Medium |
| Organizational Complexity | 4 | High |
| AI Readiness | 3 | High |
| Change Capacity | 2 | Medium |
| Operational Friction | 3 | High |
| Strategic Urgency | 3 | High |
| Resource Availability | 4 | High |
| Compliance Sensitivity | 4 | High |

### Key Signals

| Signal | Source | Evidence |
|--------|--------|----------|
| Legal reviews every contract manually | [User] Q-LEGAL-01 | "Legal reviews every contract manually" |
| Compliance monitored manually | [User] Q-LEGAL-02 | "Manual monitoring by legal team" |
| SOC2 and HIPAA certified | [Research] Trust Page | Compliance-sensitive org |
| Forecast accuracy within 5% | [User] Q-SALES-03 | "Within 5%" (mature process) |
| Multi-touch attribution | [User] Q-MKTG-01 | Strong marketing analytics |
| Contract review takes 2-5 days | [Inference] Enterprise stage | Legal bottleneck at scale |
| CEO priority: profitable growth | [Research] Investor Letter | Efficiency focus, not growth at all costs |

### AI Opportunity Map (Top 5)

| Tier | Opportunity | Confidence | Key Evidence |
|-----|-------------|------------|--------------|
| T1 | Automated Contract Review | Confirmed | [User] Manual legal review, [Research] SOC2/HIPAA, [Inference] Enterprise scaling |
| T1 | Automated NDA Processing | Confirmed | [User] Legal bottleneck, [Inference] High-velocity contracting |
| T2 | Automated Revenue Reconciliation | High | [Inference] $150M ARR, billing complexity, ASC 606 |
| T2 | Compliance Monitoring Automation | High | [User] Manual compliance, [Research] Multiple certs |
| T3 | Automated QBR Preparation | Medium | [Inference] Large CS org, high-value enterprise accounts |

### Implementation Blueprint

```
Week 1-6:  Automated NDA Processing (Quick Win)
  → Fast legal win, frees legal for high-value work
Week 4-12: Automated Contract Review (Package Deal with NDA)
  → Larger effort but high value for enterprise org
Week 8-16: Compliance Monitoring Automation (Foundational)
  → Required for regulatory risk management
Week 12-20: Revenue Reconciliation (Phased)
  → Complex implementation, higher compliance sensitivity
```
