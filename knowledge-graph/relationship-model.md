# Relationship Model

## Overview

The Relationship Model defines the semantics of connections between nodes in the knowledge graph. Understanding these relationships is critical for the reasoning engine to traverse the graph and derive insights.

---

## Core Relationship Patterns

### Department → System

```
Department ──uses──→ System
Department ──owns──→ System
```

**Semantics**: Departments use systems to perform work. Ownership means the department is the primary administrator or decision-maker for that system.

**Example**: Sales uses Salesforce, owns Salesforce configuration.

### Department → Workflow

```
Department ──owns──→ Workflow
Department ──participates_in──→ Workflow (cross-dept)
```

**Semantics**: Each workflow has a primary owning department. Workflows that span departments have participation edges.

**Example**: Customer Success owns the Renewal workflow; Sales participates.

### Person → Department

```
Person ──belongs_to──→ Department
Person ──reports_to──→ Person
```

**Semantics**: People are members of departments. Reporting lines form the organizational hierarchy.

**Example**: VP of Sales → CEO; SDR → Sales Manager.

### Workflow → System

```
Workflow ──uses──→ System
Workflow ──depends_on──→ System
```

**Semantics**: Workflows use systems as tools. Dependencies are stronger: the workflow cannot function without the system.

**Example**: Lead Qualification depends on CRM; uses ZoomInfo for enrichment.

### Workflow → Workflow

```
Workflow ──handoff_to──→ Workflow
Workflow ──depends_on──→ Workflow
Workflow ──feeds_into──→ Workflow
```

**Semantics**: Workflows connect in sequences. Handoffs represent cross-team transfers. Dependencies represent ordering constraints. Feed-into represents output becoming input.

**Example**: Lead Qualification handoff_to Deal Management feeds_into Forecasting.

### Decision → Workflow

```
Decision ──affects──→ Workflow
Decision ──informed_by──→ KPI
```

**Semantics**: Decisions modify workflows. Decisions are informed by KPIs.

**Example**: "Move to usage-based pricing" decision affects Billing and Forecasting workflows.

---

## Cross-Department Handoff Patterns

### Sales → Customer Success

```
Sales ──handoff_to──→ Customer Success (at contract signing)
```

**Artifacts**: Signed contract, implementation plan, customer contacts
**Friction points**: Missing context, delayed handoff, misaligned expectations
**AI Opportunity**: Automated handoff with context package

### Customer Success → Support

```
Customer Success ──handoff_to──→ Support (when issue escalates)
```

**Artifacts**: Escalation ticket, account context, priority level
**Friction points**: Repeated information, delayed response, misrouting
**AI Opportunity**: Intelligent escalation with full context

### Sales → Finance

```
Sales ──handoff_to──→ Finance (for billing setup)
```

**Artifacts**: Signed contract, billing terms, purchase order
**Friction points**: Billing setup errors, delayed invoicing, term misalignment
**AI Opportunity**: Automated billing configuration from contract terms

### Engineering → Support

```
Engineering ──informs──→ Support (when releasing features)
```

**Artifacts**: Release notes, known issues, documentation updates
**Friction points**: Support learns about changes after customers
**AI Opportunity**: Automated release notes → knowledge base sync

### Legal → Sales

```
Legal ──approves──→ Sales (contract terms)
```

**Artifacts**: Approved contract, redline, fallback positions
**Friction points**: Long approval cycles, inconsistent positions
**AI Opportunity**: AI-assisted contract review with pre-approved fallbacks

---

## Relationship Query Patterns

### Pattern 1: "Which workflows does this department own and what systems do they depend on?"

```
Department → owns → Workflow → depends_on → System
```

**Use**: Identify system dependencies for a department's critical workflows.

### Pattern 2: "What are the handoffs between Sales and Customer Success?"

```
Sales → Workflow → handoff_to → Workflow → Customer Success
```

**Use**: Identify cross-department friction points.

### Pattern 3: "What approvals block this workflow?"

```
Approval → governs → Workflow → owned_by → Department
```

**Use**: Identify approval bottlenecks in critical workflows.

### Pattern 4: "What opportunities does this system enable?"

```
System → enables → Opportunity
```

**Use**: When recommending a system, show what opportunities it unlocks.

### Pattern 5: "What is the chain of decisions that led to this workflow design?"

```
Decision → affects → Workflow
Decision ← informed_by ← KPI
```

**Use**: Understand why workflows are designed as they are.

---

## Relationship Confidence

Each edge has a confidence level based on its evidence:

| Evidence | Confidence | Example |
|----------|------------|---------|
| Assessment confirmed | Confirmed | User says "Sales uses Salesforce" |
| Research detected + assessment confirmed | High | LinkedIn + user confirms |
| Research only | Medium | LinkedIn shows Sales roles + SFDC listed |
| Inference only | Low | Inferred from industry patterns |

---

## Graph Traversal Rules

### Rule 1: Single-Hop
Direct neighbor queries are highest confidence.

### Rule 2: Two-Hop with Same Type
`Department → Workflow → Department` (handoff) is Medium-High confidence.

### Rule 3: Three-Hop or Mixed
`Department → Person → Decision → Workflow` is Medium-Low confidence.

### Rule 4: Circular Paths
If traversal returns to a node already visited, stop (cycle detected).

### Rule 5: Weighted Paths
When multiple paths exist between two nodes, prefer:
1. Shortest path (fewer hops)
2. Higher confidence edges
3. Direct edges over inferred
