# Organizational Workflow Agent

## Overview

The Organizational Workflow Agent models how work flows through a company. Given company profile, industry, and department information, it maps the end-to-end workflow paths, identifies approval chains, bottlenecks, ownership patterns, and handoff friction points.

---

## Inputs

| Input | Source |
|-------|--------|
| Company Profile | Company Intelligence Agent |
| Department Structure | Company Intelligence Agent |
| Technology Profile | Technology Intelligence Agent |
| Industry Profile | Industry Intelligence Agent |

---

## Outputs

| Output | Description |
|--------|-------------|
| Workflow Map | End-to-end workflow visualization with steps, owners, and dependencies |
| Handoff Library | Cross-department handoff points with friction assessment |
| Bottleneck Analysis | Identified bottlenecks with severity and impact |
| Approval Map | Approval chain depth and ownership |

---

## Workflow Mapping Methodology

### Step 1: Department Identification

Identify which of the 10 departments exist in the organization. For each department, determine its primary workflows from the Blueprint Library patterns.

### Step 2: Cross-Department Flow Mapping

Map how work flows between departments:

```
Lead (Marketing) → Lead Qualification (Sales) → Deal (Sales)
  → Implementation (CS) → Support (Support) → Renewal (Sales/CS)
```

### Step 3: Handoff Identification

For each cross-department transition, identify:
- What artifacts are transferred
- What information is lost in the handoff
- What approval gates exist between departments
- Typical delay at each handoff point

### Step 4: Bottleneck Detection

Identify bottlenecks from:
- Workflows with long durations relative to industry benchmarks
- Handoff points with high friction
- Approval chains with deep layers
- Single-person dependencies

---

## Cross-Department Flow (B2B SaaS Standard)

```
                     ┌──────────────────────────────────────────────┐
                     │                                              │
                     ▼                                              │
Marketing ──→ Sales ──→ Customer Success ──→ Support ───────────────┤
  │                  │         │                  │                 │
  │                  │         ▼                  │                 │
  │                  │    (Expansion)             │                 │
  │                  │         │                  │                 │
  │                  │         ▼                  │                 │
  │                  │    Finance (Billing)       │                 │
  │                  │         │                  │                 │
  ▼                  ▼         ▼                  ▼                 │
Product ←── Engineering ←── Legal ←── Operations ←──────────────────┘
```

### Flow Descriptions

**Marketing → Sales**: Lead handoff
- Artifacts: Lead score, source, engagement history
- Friction: Marketing-qualified leads may not be sales-ready

**Sales → Customer Success**: Customer handoff (post-sale)
- Artifacts: Contract, implementation plan, contacts
- Friction: Lost context, delayed handoff, misaligned expectations

**Customer Success → Support**: Escalation
- Artifacts: Escalation ticket, account context
- Friction: Repeated information, delayed response

**Customer Success → Finance**: Billing changes
- Artifacts: Plan changes, discount approvals
- Friction: Billing errors, delayed adjustments

**Support → Engineering**: Bug reports
- Artifacts: Bug report, reproduction steps
- Friction: Missing information, priority disagreements

**Engineering → Product**: Feature completion
- Artifacts: Feature, documentation, release notes
- Friction: Missing docs, incomplete features

**Legal → Sales**: Contract approval
- Artifacts: Approved contract, redlines
- Friction: Long approval cycles, inconsistent positions

**Operations → All**: Tool provisioning
- Artifacts: Accounts, access, permissions
- Friction: Slow provisioning, access errors

---

## Workflow Map Schema

```yaml
workflows:
  - id: "WF-001"
    name: "Lead-to-Cash"
    description: "End-to-end pipeline from lead generation to revenue recognition"
    departments: ["Marketing", "Sales", "Customer Success", "Finance"]
    steps:
      - stepOrder: 1
        name: "Lead Generation"
        owner: "Marketing"
        systems: ["HubSpot", "Salesforce"]
        duration: "Ongoing"
      - stepOrder: 2
        name: "Lead Qualification"
        owner: "Sales"
        handoffFrom: 1
        systems: ["Salesforce", "ZoomInfo"]
        duration: "0-24 hours"
        friction: "Medium"
      - stepOrder: 3
        name: "Deal Management"
        owner: "Sales"
        handoffFrom: 2
        systems: ["Salesforce", "Outreach"]
        duration: "30-90 days"
        friction: "Low"
      - stepOrder: 4
        name: "Contracting"
        owner: "Legal"
        handoffFrom: 3
        systems: ["Ironclad", "DocuSign"]
        duration: "2-5 days"
        friction: "High"
      - stepOrder: 5
        name: "Onboarding"
        owner: "CS"
        handoffFrom: 4
        systems: ["Gainsight", "Salesforce"]
        duration: "1-4 weeks"
        friction: "High"
      - stepOrder: 6
        name: "Billing Setup"
        owner: "Finance"
        handoffFrom: 5
        systems: ["Stripe"]
        duration: "1-2 days"
        friction: "Medium"
      - stepOrder: 7
        name: "Revenue Recognition"
        owner: "Finance"
        handoffFrom: 6
        systems: ["NetSuite"]
        duration: "Monthly"
        friction: "Low"
```

---

## Edge Cases

### Company Missing a Department

If a department doesn't exist (e.g., no Legal for a small company):
- Workflows that would go through that department are shortened
- Responsibility shifts to the closest related department (e.g., CEO handles legal)
- No handoff friction at that point

### Highly Matrixed Organization

Workflows may not follow clean department boundaries. In matrix orgs:
- Multiple handoffs per step (cross-functional teams)
- Higher friction at each handoff point
- More approval layers

### Remote-First Organization

Remote orgs have different workflow patterns:
- More async communication
- More documented handoffs (Slack, Notion)
- Higher meeting load for coordination
- Tool-dependent workflows
