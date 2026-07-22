# Signal Map

## Overview

Compass identifies and classifies signals across 9 families. Signals are indicators of operational friction, AI readiness, and organizational opportunity. Each signal family contains multiple specific signals that the reasoning engine uses for pattern matching.

---

## 1. Growth Signals

Indicators of organizational growth trajectory and scaling pressure.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| GR-01 | Headcount Velocity | Rate of hiring across departments | Research: Job postings, LinkedIn growth |
| GR-02 | Revenue Stage | Current revenue milestone and trajectory | Research: Funding, press, financial data |
| GR-03 | Market Expansion | Entry into new markets or segments | Research: Press releases, job postings for new regions |
| GR-04 | Product Launches | Velocity of new product/feature releases | Research: Changelog, product announcements |
| GR-05 | Customer Growth | Growth in customer count or accounts | Research: Case studies, customer metrics |
| GR-06 | International Expansion | Geographic expansion signals | Research: Job postings, office announcements |

---

## 2. Operational Signals

Indicators of how work flows through the organization.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| OP-01 | Manual Process Density | Prevalence of manual data entry and processing | Assessment: User-reported time allocation |
| OP-02 | Cross-Department Handoffs | Frequency and friction of inter-department transfers | Assessment: Workflow questions |
| OP-03 | Approval Chain Depth | Number of approval layers for common processes | Assessment: Process questions |
| OP-04 | Reporting Burden | Time spent on recurring report generation | Assessment: Reporting questions |
| OP-05 | Process Documentation | Existence and currency of process documentation | Assessment: Documentation questions |
| OP-06 | Meeting Load | Time spent in internal meetings vs. productive work | Inference: Combined signals |

---

## 3. Technical Signals

Indicators of technology stack, architecture, and engineering practices.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| TC-01 | Tech Stack Modernity | Age and sophistication of core technology stack | Research: Job postings, engineering blog, GitHub |
| TC-02 | AI Tool Adoption | Existing use of AI tools and platforms | Research: Blog posts, partnerships, tool mentions |
| TC-03 | Data Infrastructure | Maturity of data warehouse, pipelines, and analytics | Research: Job postings (data roles), tool mentions |
| TC-04 | Integration Complexity | Number of integrated systems and automation level | Research: Integration pages, partner listings |
| TC-05 | Engineering Practices | Development methodology, CI/CD, testing culture | Research: Engineering blog, GitHub activity |
| TC-06 | API Maturity | Extent of API usage and external integrations | Research: Developer docs, API references |

---

## 4. Financial Signals

Indicators of financial health, efficiency, and processes.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| FI-01 | Billing Complexity | Complexity of billing model (usage, tiered, per-seat) | Research: Pricing page |
| FI-02 | AP/AR Maturity | Automation level of payables and receivables | Assessment: Finance questions |
| FI-03 | Forecasting Process | Sophistication of financial forecasting | Assessment: Forecasting questions |
| FI-04 | Expense Management | Process for expense reporting and approval | Assessment: Expense questions |
| FI-05 | Revenue Recognition | Complexity of revenue recognition (ASC 606) | Research: Business model, public filings |

---

## 5. Organizational Signals

Indicators of structure, roles, and complexity.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| OR-01 | Department Count | Number of distinct departments or functions | Research: LinkedIn, team page |
| OR-02 | Org Depth | Layers of management and reporting | Inference: Headcount distribution |
| OR-03 | Role Specialization | Degree of role specialization vs. generalist | Research: Job title diversity |
| OR-04 | Remote Distribution | Geographic distribution of workforce | Research: Job postings, company page |
| OR-05 | Recent Reorganization | Changes in organizational structure | Research: Press, leadership announcements |

---

## 6. Cultural Signals

Indicators of organizational culture, AI stance, and change readiness.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| CU-01 | AI Stance | Leadership attitude toward AI adoption | Research: CEO letters, interviews, blog |
| CU-02 | Innovation Culture | Willingness to try new tools and approaches | Research: Engineering blog, tool choices |
| CU-03 | Change Readiness | Organizational history of adopting new processes | Research: Past tool migrations, process changes |
| CU-04 | Efficiency Focus | Degree of operational efficiency as a stated priority | Research: Leadership communications |
| CU-05 | Data-Driven Culture | Emphasis on data in decision-making | Research: Job postings, content |

---

## 7. Compliance Signals

Indicators of regulatory and compliance requirements.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| CM-01 | Regulatory Exposure | Industries and regulations that apply to the company | Research: Industry, customer reviews |
| CM-02 | Certification Status | SOC2, HIPAA, GDPR, ISO certifications held | Research: Website, trust page |
| CM-03 | Data Privacy Requirements | Data handling and privacy obligations | Research: Privacy policy, industry |
| CM-04 | Contract Complexity | Complexity of contracts and number of counterparties | Assessment: Legal questions |
| CM-05 | IP Portfolio Size | Number of patents and IP assets | Research: Patent databases |

---

## 8. Competitive Signals

Indicators of competitive pressure and market dynamics.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| CO-01 | Competitive Intensity | Number and strength of competitors in market | Research: Market analysis |
| CO-02 | Market Position | Leadership position in category | Research: Analyst reports, reviews |
| CO-03 | Differentiation Pressure | Need to differentiate through product or service | Inference: Market maturity signals |
| CO-04 | Pricing Pressure | Commoditization or pricing competition | Research: Pricing page changes |

---

## 9. Strategic Signals

Indicators of strategic direction and priorities.

| Signal ID | Signal Name | Description | Detection Method |
|-----------|-------------|-------------|-----------------|
| ST-01 | Stated Priorities | Explicitly stated strategic priorities from leaders | Research: CEO letters, earnings calls |
| ST-02 | Investment Areas | Where the company is investing (hiring, product, marketing) | Research: Job postings, announcements |
| ST-03 | Partnership Strategy | Key partnerships and integrations | Research: Partner page, press releases |
| ST-04 | AI Strategy | Publicly stated approach to AI | Research: AI blog posts, product announcements |
| ST-05 | Growth Strategy | Organic vs. acquisition growth approach | Research: Press, funding announcements |

---

## Signal Processing Rules

### Signal Weighting

Each signal has a base weight determined by:
1. **Reliability**: How consistently the signal is detected across sources
2. **Specificity**: How specifically the signal indicates a particular pattern
3. **Timeliness**: How current the signal information is

### Signal Decay

Signals decay over time:
- Research signals: 30-day half-life
- Assessment signals: No decay (direct from user)
- Inference signals: 14-day half-life

### Cross-Signal Correlation

When multiple independent signals point to the same pattern, confidence is amplified:
- 2 independent signals → 1.5x confidence multiplier
- 3+ independent signals → 2x confidence multiplier
- Conflicting signals → 0.5x confidence penalty
