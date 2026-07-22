# Signal Library

## Overview

The Signal Library catalogues every signal that Compass research agents and assessment questions detect. Each signal is defined with its detection method, evidence class, and related blueprints.

This library serves as the reference for the reasoning engine's signal extraction stage.

---

## Signal Categories

### Department-Specific Signals

Each of the 10 departments has a set of signals organized by workflow area.

**Sales Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| SL-01 | Manual lead qualification | Assessment Q-SALES-01, Q-SALES-02 | [User] |
| SL-02 | Inaccurate forecasting | Assessment Q-SALES-03, Q-SALES-04 | [User] |
| SL-03 | No CRM enrichment | Assessment, job postings | [User], [Research] |
| SL-04 | SDR capacity bottleneck | Job postings, assessment | [Research], [User] |
| SL-05 | No call recording/analysis | Assessment, tool detection | [User], [Research] |

**Marketing Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| MK-01 | No attribution model | Assessment Q-MKTG-01 | [User] |
| MK-02 | Slow campaign reporting | Assessment Q-MKTG-02 | [User] |
| MK-03 | Manual content briefs | Assessment Q-MKTG-03 | [User] |
| MK-04 | Low content velocity | Blog analysis | [Research] |
| MK-05 | No ABM program | Assessment, job postings | [User], [Research] |

**Customer Success Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| CS-01 | Manual health scoring | Assessment Q-CS-01 | [User] |
| CS-02 | Late churn detection | Assessment Q-CS-02 | [User] |
| CS-03 | No expansion tracking | Assessment, CS hiring | [User], [Research] |
| CS-04 | High churn rate | Research (reviews, press) | [Research] |
| CS-05 | CSM overloaded | Job postings, assessment | [Research], [User] |

**Support Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| SU-01 | Manual ticket routing | Assessment Q-SUPP-01 | [User] |
| SU-02 | Low KB utilization | Assessment Q-SUPP-02 | [User] |
| SU-03 | Slow first response | Assessment Q-SUPP-03 | [User] |
| SU-04 | High ticket volume | Research (hiring, reviews) | [Research] |
| SU-05 | Low CSAT | Research (reviews) | [Research] |

**Finance Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| FI-01 | Manual AP processing | Assessment Q-FIN-01 | [User] |
| FI-02 | Slow reconciliation | Assessment Q-FIN-02 | [User] |
| FI-03 | Complex billing model | Research (pricing page) | [Research] |
| FI-04 | Frequent billing errors | Research (reviews) | [Research] |
| FI-05 | No FP&A automation | Assessment, job postings | [User], [Research] |

**Product Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| PR-01 | Ad-hoc feedback process | Assessment Q-PROD-01 | [User] |
| PR-02 | Slow spec writing | Assessment Q-PROD-02 | [User] |
| PR-03 | Low feature adoption | Research (product, reviews) | [Research] |
| PR-04 | No competitive monitoring | Assessment, blog | [User], [Research] |
| PR-05 | Siloed usage data | Assessment, tool detection | [User], [Research] |

**Engineering Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| EN-01 | Outdated documentation | Assessment Q-ENG-01 | [User] |
| EN-02 | Slow incident RCA | Assessment Q-ENG-02 | [User] |
| EN-03 | Long PR review cycles | Assessment Q-ENG-03 | [User] |
| EN-04 | Low test coverage | Research (GitHub, blog) | [Research] |
| EN-05 | Outdated dependencies | Research (GitHub, security) | [Research] |

**People/HR Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| HR-01 | Manual resume screening | Assessment Q-HR-01 | [User] |
| HR-02 | Heavy scheduling burden | Assessment Q-HR-02 | [User] |
| HR-03 | High hiring velocity | Research (job boards) | [Research] |
| HR-04 | Low employee engagement | Research (Glassdoor) | [Research] |
| HR-05 | No onboarding automation | Assessment, research | [User], [Research] |

**Legal Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| LG-01 | Manual contract review | Assessment Q-LEGAL-01 | [User] |
| LG-02 | Manual compliance monitoring | Assessment Q-LEGAL-02 | [User] |
| LG-03 | High contract volume | Research (revenue stage, deals) | [Research] |
| LG-04 | Complex compliance needs | Research (certifications, industry) | [Research] |
| LG-05 | No clause library | Assessment, legal team size | [User], [Research] |

**Operations Signals**

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| OP-01 | Manual tool provisioning | Assessment Q-OPS-01 | [User] |
| OP-02 | Manual report generation | Assessment Q-OPS-02 | [User] |
| OP-03 | No vendor management | Assessment, research | [User], [Research] |
| OP-04 | High tool count | Research (integrations page) | [Research] |
| OP-05 | No process documentation | Assessment | [User] |

---

## Cross-Department Signals

| ID | Signal | Detection | Evidence Class |
|----|--------|-----------|----------------|
| XD-01 | High approval chain depth | Multiple assessment responses | [User] |
| XD-02 | Data silos | Assessment, system detection | [User], [Research] |
| XD-03 | No cross-dept process visibility | Assessment responses | [User] |
| XD-04 | Meeting overload | Inferred from team size | [Inference] |
| XD-05 | Document proliferation | Inferred from team size | [Inference] |

---

## Signal Strength Scoring

Each signal is scored on:
- **Confidence**: High/Medium/Low based on evidence quality
- **Freshness**: Hours since detected
- **Relevance**: How directly this signal relates to blueprints
- **Uniqueness**: How unique this signal is (vs. common across all companies)
