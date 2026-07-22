# Organizational Workflow Mapping — Full Design

## Overview

This document details the methodology, models, and reasoning behind organizational workflow mapping.

---

## Flow Design Methodology

Workflow mapping follows these steps for each department:

### Step 1: Identify Primary Workflows

For each department, identify 1-3 primary workflows from the Blueprint Library:

| Department | Primary Workflows |
|------------|-------------------|
| Sales | Lead-to-Opportunity, Deal Management, Renewal Management |
| Marketing | Campaign Management, Content Production, Lead Generation |
| Customer Success | Health Monitoring, QBR, Expansion Management |
| Support | Ticket Resolution, Knowledge Management, Escalation |
| Finance | Procure-to-Pay, Order-to-Cash, Financial Reporting |
| Product | Feedback-to-Roadmap, Spec-to-Release |
| Engineering | Code-to-Deploy, Incident-to-Resolution |
| People/HR | Recruit-to-Hire, Onboard-to-Productive |
| Legal | Contract-to-Sign, Obligation-to-Compliance |
| Operations | Provision-to-Access, Report-to-Decision |

### Step 2: Map Step Sequences

For each workflow, identify:
- All steps in the workflow sequence
- Step owners (which role/department)
- Systems used at each step
- Typical duration per step
- Handoff points between steps
- Friction levels at each handoff

### Step 3: Identify Cross-Department Dependencies

For each workflow, identify:
- Which departments provide inputs
- Which departments receive outputs
- What information crosses department boundaries
- Where information is lost or distorted in transit

### Step 4: Assess Handoff Quality

For each handoff point, assess:
- Is there a documented process?
- Is there a shared system?
- Are handoff artifacts standardized?
- What is the typical delay?
- What is the error rate?

---

## Handoff Friction Model

### Friction Factors

| Factor | Description | Impact |
|--------|-------------|--------|
| Process Gap | No documented handoff process | High |
| System Gap | No shared system between departments | High |
| Artifact Gap | Non-standard or missing transfer artifacts | Medium |
| Approval Gap | Handoff requires approval gate | Medium |
| Knowledge Gap | Context needed but not transferred | High |
| Timing Gap | Handoff happens in batches, not real-time | Medium |

### Friction Scoring

```
handoffFriction = sum(factors present) / total factors
Low:     0-2 factors present
Medium:  3-4 factors present
High:    5-6 factors present
```

---

## Approval Chain Modeling

### Approval Types

| Type | Common Depth | Typical Owner |
|------|-------------|---------------|
| Financial approval (purchases) | 1-3 levels | Manager → Director → VP |
| Contract approval | 2-4 levels | Legal → VP → CEO (for large deals) |
| Hiring approval | 2-3 levels | HR → Manager → VP |
| Process change approval | 1-2 levels | Process Owner → Department Head |
| Technical architecture approval | 1-2 levels | Tech Lead → Engineering Director |

### Bottleneck Identification

An approval is a bottleneck if:
- Depth > 3 (more than 3 approvals required)
- Average time > 24 hours per approval layer
- Total approval time > 72 hours
- Single person is the bottleneck (vacation risk)

---

## Workflow Variability Factors

### Company Size

| Size | Workflow Pattern |
|------|-----------------|
| < 50 employees | Informal, founder-involved, minimal handoffs |
| 50-200 | Emerging processes, some handoffs, founder still involved |
| 200-500 | Defined processes, formal handoffs, middle management |
| 500-2000 | Standardized processes, complex handoffs, matrix elements |
| 2000+ | Highly formal, multiple approval layers, global coordination |

### Industry

B2B SaaS has more standardized workflow patterns than other industries due to:
- Common tooling (Salesforce, Zendesk, Jira)
- Shared operating model (subscription revenue, recurring workflows)
- Similar departmental structures

### Culture

- **Flat orgs**: Faster decisions, fewer approvals, more informal handoffs
- **Hierarchical**: Slower decisions, more approvals, formal handoff processes
- **Remote-first**: More documented handoffs, async communication, tool-dependent
