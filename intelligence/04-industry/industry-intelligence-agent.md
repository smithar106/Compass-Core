# Industry Intelligence Agent

## Overview

The Industry Intelligence Agent researches the company's industry to determine common workflows, KPIs, AI initiatives, failures, regulations, friction points, and best practices. It answers the question: "What do companies in this industry typically benefit from AI?"

---

## Inputs

| Input | Source |
|-------|--------|
| Company Industry | Company Intelligence Agent |
| Sub-Industry | Company Intelligence Agent |
| Company Size/Stage | Company Intelligence Agent |

---

## Outputs

| Output | Description |
|--------|-------------|
| Industry Profile | Industry overview, common patterns, benchmarks |
| Opportunity Library | Recurring opportunity patterns for the industry |
| Benchmark Data | Industry-typical KPIs, tooling, friction points |

---

## Industry Research Methodology

### Sources

1. **Industry reports**: Gartner, Forrester, IDC reports on AI in the industry
2. **Industry publications**: Trade journals, newsletters, analyst blogs
3. **Competitor case studies**: How competitors in the same industry use AI
4. **Customer reviews**: Common complaints across industry players
5. **Regulatory frameworks**: Industry-specific regulations
6. **Job posting analysis**: Skills and roles in demand across the industry

### Analysis Dimensions

| Dimension | Questions |
|-----------|-----------|
| Common Workflows | What workflows are universal in this industry? |
| Industry KPIs | What metrics matter most to companies in this industry? |
| AI Adoption Patterns | How is AI being adopted across the industry? |
| Known Failures | What AI initiatives have failed in this industry and why? |
| Regulatory Landscape | What regulations affect AI deployment? |
| Operational Friction | What are the most common operational pain points? |
| Tech Stack Norms | What tools and platforms are industry-standard? |
| Cost Structure | How do companies in this industry spend on operations? |

---

## B2B SaaS Industry Profile

### Industry Overview

B2B SaaS is a $200B+ market with hundreds of companies sharing remarkably similar operational structures, tool stacks, and workflow patterns. This homogeneity makes it the ideal initial vertical for Compass.

### Common Workflows

| Area | Universal Workflows | Variability |
|------|-------------------|-------------|
| Sales | Lead qualification, pipeline management, forecasting | Low |
| Marketing | Content production, campaign management, attribution | Medium |
| Customer Success | Health scoring, QBR, churn management | Medium |
| Support | Ticket triage, knowledge management, escalation | Low |
| Finance | Subscription billing, revenue recognition, procurement | Low |
| Product | Feedback management, roadmap prioritization, spec writing | Medium |
| Engineering | Code review, documentation, incident response | Low |
| HR | Recruiting, onboarding, performance management | Low |
| Legal | Contract review, compliance, IP management | Low |
| Operations | Tool provisioning, reporting, vendor management | Medium |

### Industry KPIs

| KPI | SaaS Typical | Why It Matters |
|-----|-------------|----------------|
| NRR (Net Revenue Retention) | 100-130% | Growth efficiency metric |
| Churn Rate | 5-10% monthly for SMB; <5% for Enterprise | Retention health |
| ACV (Annual Contract Value) | $10K SMB, $100K Mid-Market, $500K+ Enterprise | Revenue quality |
| CAC Payback | 12-24 months | Sales efficiency |
| Time to Value | 30-90 days | Onboarding effectiveness |
| Support Ticket Volume | 100-1000+/month per 1000 customers | Support scaling |
| Forecast Accuracy | 70-90% | Sales process maturity |

### AI Adoption Patterns

| AI Application | Adoption Rate | Success Rate |
|---------------|---------------|--------------|
| Chatbots/Conversational AI | 60%+ | Medium |
| Content Generation | 50%+ | High |
| Sales Call Analysis | 40%+ | High |
| Code Generation Assistance | 35%+ | Medium |
| Knowledge Base AI | 30%+ | High |
| Automated Data Entry | 25%+ | Medium |
| Predictive Analytics | 20%+ | Low-Medium |
| Personalization Engines | 15%+ | Medium |

### Common AI Failures

| Failure Pattern | Root Cause |
|---------------|------------|
| Chatbot deployed without human escalation path | Poor design |
| Content AI generates inaccurate information | Lack of human review |
| Predictive model trained on insufficient data | Data quality issues |
| AI automation bypassed by employees | Poor change management |
| AI tool doesn't integrate with existing workflows | Integration neglected |

### Regulatory Landscape

| Regulation | Applicability | AI Impact |
|-----------|--------------|-----------|
| GDPR | All SaaS with EU customers | Data processing restrictions |
| CCPA | SaaS with California customers | Data collection restrictions |
| SOC2 | Enterprise SaaS | Security controls for AI systems |
| HIPAA | HealthTech SaaS | Patient data restrictions |
| PCI DSS | Payments/financial SaaS | Financial data restrictions |
| AI Act (EU) | SaaS with EU customers | AI risk classification requirements |

---

## Industry Opportunity Library

High-level opportunity patterns for B2B SaaS:

```yaml
patterns:
  - id: "IND-SaaS-01"
    pattern: "Growth-stage billing complexity"
    signals: ["Usage-based pricing", "Multi-product", "Enterprise+self-serve"]
    opportunities: ["Subscription billing automation", "Revenue reconciliation"]
    confidence: "High"

  - id: "IND-SaaS-02"
    pattern: "Support scaling pressure"
    signals: ["Growing customer base", "Flat support headcount", "High ticket volume"]
    opportunities: ["Ticket triage AI", "Knowledge base AI", "Response generation"]
    confidence: "High"

  - id: "IND-SaaS-03"
    pattern: "Sales efficiency decline at scale"
    signals: ["SDR team >10", "Manual CRM processes", "Forecast accuracy <80%"]
    opportunities: ["Lead qualification AI", "Meeting intelligence", "Forecasting AI"]
    confidence: "High"

  - id: "IND-SaaS-04"
    pattern: "Customer retention pressure"
    signals: ["Churn >5% monthly", "No health scoring", "CS team <10% of total"]
    opportunities: ["Health score automation", "Churn prediction", "QBR automation"]
    confidence: "High"

  - id: "IND-SaaS-05"
    pattern: "Legal bottleneck at enterprise scale"
    signals: ["Legal team <5 people", "Growing enterprise deals", "Manual contract review"]
    opportunities: ["Contract review AI", "NDA automation", "Clause library"]
    confidence: "High"
```
