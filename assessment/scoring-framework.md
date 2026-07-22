# Scoring Framework

## Overview

Compass scores organizations across 10 dimensions to build a comprehensive operational profile. Scores are not absolute ratings — they are relative indicators used for pattern matching against the blueprint library.

Each dimension scores on a 1-5 scale:
- **1**: Not present / Minimal
- **2**: Ad-hoc / Basic
- **3**: Defined / Moderate
- **4**: Managed / Strong
- **5**: Optimized / Exceptional

---

## Dimension 1: Process Formalization

How formally are processes documented, followed, and measured?

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | No formal processes; tribal knowledge | "We just figure it out" |
| 2 | Some documented processes, not enforced | Notion docs, rarely followed |
| 3 | Key processes documented and followed | SOPs exist, team follows them |
| 4 | Processes measured and improved | KPIs tracked, regular reviews |
| 5 | Processes optimized continuously | Automation focus, continuous improvement |

**Blueprint Relevance**: High — formalized processes are easier to AI-augment

---

## Dimension 2: Technical Infrastructure

Maturity of technology stack, data infrastructure, and engineering practices.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | Fragmented tools, manual processes | Spreadsheets as databases |
| 2 | Core systems in place but disconnected | CRM, support tool, minimal integration |
| 3 | Integrated stack with some automation | APIs connected, some workflow automation |
| 4 | Modern stack with data infrastructure | Data warehouse, CI/CD, monitoring |
| 5 | Advanced infrastructure with AI/ML | ML pipeline, feature store, experimentation |

**Blueprint Relevance**: Medium — determines implementation feasibility

---

## Dimension 3: Data Quality & Accessibility

Quality, completeness, and accessibility of data across systems.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | Data siloed, poor quality, no governance | "Ask Bob for the numbers" |
| 2 | Partial data quality, manual cleansing | Duplicates common, manual fixes |
| 3 | Defined data quality processes | Naming conventions, regular cleansing |
| 4 | Proactive data quality monitoring | DQ dashboards, automated alerts |
| 5 | Data-driven organization | Data product thinking, data as asset |

**Blueprint Relevance**: High — AI requires quality data

---

## Dimension 4: Organizational Complexity

Complexity of organizational structure, approval chains, and decision-making.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | Flat, simple structure | < 50 people, founder-led |
| 2 | Some departments exist | Functional teams, clear reporting |
| 3 | Matrix or multiple departments | Cross-functional, dotted lines |
| 4 | Complex multi-region organization | Geographic and functional complexity |
| 5 | Highly matrixed, global | Multiple divisions, regions, matrices |

**Blueprint Relevance**: Low — more about implementation approach

---

## Dimension 5: AI Readiness

Organizational readiness to adopt and operationalize AI.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | Skeptical or unaware | No AI discussion, no AI tools |
| 2 | Experimenting cautiously | Individual experiments, no strategy |
| 3 | Active exploration with some adoption | AI pilot programs, internal tools |
| 4 | Strategic AI adoption | AI roadmap, dedicated team |
| 5 | AI-embedded organization | AI in core product and operations |

**Blueprint Relevance**: High — determines which opportunities are feasible

---

## Dimension 6: Change Capacity

Ability of the organization to adopt new processes and technologies.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | Change-averse, slow | Previous change failures, resistance |
| 2 | Cautious but willing | Change requires strong evidence |
| 3 | Change-capable | Regular process improvements accepted |
| 4 | Change-embracing | Actively seeks improvement |
| 5 | Change-driven | Culture of continuous transformation |

**Blueprint Relevance**: Medium — affects implementation sequencing

---

## Dimension 7: Operational Friction

Degree of operational friction, inefficiency, and bottlenecks.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | Minimal friction | Efficient operations, few bottlenecks |
| 2 | Occasional friction | Some manual processes, manageable |
| 3 | Noticeable friction | Frequent manual work, some bottlenecks |
| 4 | Significant friction | Heavy manual processing, clear bottlenecks |
| 5 | Critical friction | Processes breaking, urgent need for change |

**Blueprint Relevance**: High — friction is the opportunity signal

---

## Dimension 8: Strategic Urgency

How urgently the organization needs to address operational issues.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | No urgency | Stable, no growth pressure |
| 2 | Low urgency | Background improvement desire |
| 3 | Moderate urgency | Some pressure from growth or competition |
| 4 | High urgency | Growth outpacing ops, competitive pressure |
| 5 | Critical urgency | Imminent scaling crisis or market threat |

**Blueprint Relevance**: Medium — affects priority and timing

---

## Dimension 9: Resource Availability

Availability of budget, talent, and time for AI implementation.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | No resources available | No budget, no capacity |
| 2 | Limited resources | Small experimental budget |
| 3 | Some resources | Dedicated project budget possible |
| 4 | Good resources | Budget approved, team available |
| 5 | Ample resources | Dedicated AI budget and team |

**Blueprint Relevance**: Medium — affects opportunity feasibility

---

## Dimension 10: Compliance Sensitivity

Degree to which compliance and regulatory considerations constrain operations.

| Score | Description | Indicators |
|-------|-------------|------------|
| 1 | No compliance constraints | Unregulated, no certifications |
| 2 | Low compliance burden | Basic privacy requirements |
| 3 | Moderate compliance | SOC2, GDPR applicable |
| 4 | High compliance | HIPAA, financial regulations |
| 5 | Critical compliance | Multiple frameworks, audited continuously |

**Blueprint Relevance**: Low — more about constraint evaluation

---

## Scoring Methodology

1. **Base Score**: Determined from assessment responses
2. **Signal Adjustment**: Research signals can adjust score ±0.5
3. **Inference Adjustment**: Pattern matching can adjust score ±0.5
4. **Confidence**: Each dimension score includes confidence level

### Score Aggregation

Dimension scores are NOT averaged or combined into a composite score. Each dimension is evaluated independently for pattern matching purposes. The reasoning engine uses dimension profiles to match organizations to blueprints.

### Example Score Profile

```yaml
organization: "Acme SaaS Co."
dimensions:
  process_formalization: { score: 2, confidence: "Medium" }
  technical_infrastructure: { score: 3, confidence: "High" }
  data_quality_accessibility: { score: 2, confidence: "Medium" }
  organizational_complexity: { score: 3, confidence: "High" }
  ai_readiness: { score: 2, confidence: "Low" }
  change_capacity: { score: 3, confidence: "Medium" }
  operational_friction: { score: 4, confidence: "High" }
  strategic_urgency: { score: 3, confidence: "Medium" }
  resource_availability: { score: 2, confidence: "Low" }
  compliance_sensitivity: { score: 3, confidence: "Medium" }
```

This profile indicates a company with high operational friction, moderate technical infrastructure, and low AI readiness — making Quick Win opportunities the priority.
