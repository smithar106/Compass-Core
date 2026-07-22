# Relationship Library

## Overview

The Relationship Library defines the complete set of edge types used in the knowledge graph. Each relationship type records who learned it, how confident we are, and which assessment question triggered it.

---

## Relationship Catalog

### (Department) ──uses── (System)

| Field | Value |
|-------|-------|
| Description | Department uses a specific system or tool |
| Directionality | Directed |
| Properties | `userCount`, `adoptionLevel`, `criticality` |
| Evidence Source | Tech Stack Analysis, Assessment Questions |
| Expected Count | 3-15 per company |
| Confidence Default | Medium |

### (Department) ──handoff_to── (Department)

| Field | Value |
|-------|-------|
| Description | Work flows from source department to target |
| Directionality | Directed |
| Properties | `frequency`, `handoffType`, `painLevel` |
| Evidence Source | Assessment Questions |
| Expected Count | 1-5 per company |

### (System) ──enables── (Workflow)

| Field | Value |
|-------|-------|
| Description | System makes a specific workflow possible |
| Directionality | Directed |
| Properties | `criticality`, `replacementCost` |
| Evidence Source | Tech Stack Analysis, Assessment Questions |
| Expected Count | 2-8 per company |

### (System) ──integrates_with── (System)

| Field | Value |
|-------|-------|
| Description | Two systems integrate (or should integrate) |
| Directionality | Undirected |
| Properties | `integrationType`, `quality`, `manualEffort` |
| Evidence Source | Tech Stack Analysis, Assessment Questions |
| Expected Count | 1-10 per company |

### (Workflow) ──depends_on── (Workflow)

| Field | Value |
|-------|-------|
| Description | One workflow depends on another completing first |
| Directionality | Directed |
| Properties | `dependencyType`, `criticality` |
| Evidence Source | Assessment Questions, Research |
| Expected Count | 1-5 per company |

### (Person) ──owns── (Workflow)

| Field | Value |
|-------|-------|
| Description | A person or role is responsible for a workflow |
| Directionality | Directed |
| Properties | `ownershipLevel`, `backupExists` |
| Evidence Source | Assessment Questions |
| Expected Count | 1-10 per company |

### (Constraint) ──blocks── (Opportunity)

| Field | Value |
|-------|-------|
| Description | A constraint prevents an opportunity from being realized |
| Directionality | Directed |
| Properties | `severity`, `mitigationPossible` |
| Evidence Source | Pattern Matching, Assessment Questions |
| Expected Count | 1-5 per company |

### (Opportunity) ──enables── (Outcome)

| Field | Value |
|-------|-------|
| Description | Realizing an opportunity leads to a better outcome |
| Directionality | Directed |
| Properties | `impactLevel`, `timeframe`, `confidence` |
| Evidence Source | Pattern Matching, Blueprint Library |
| Expected Count | 2-8 per company |

---

## Relationship Properties

All relationships share these base properties:

| Property | Type | Description |
|----------|------|-------------|
| confidence | Enum [Low, Medium, High, Confirmed] | How sure we are about this edge |
| evidence | Array of String | Sources supporting this edge |
| assessmentQuestion | String | Question ID if from assessment |
| learnedAt | Timestamp | When this edge was added |
| updatedAt | Timestamp | Last update time |

---

## Graph Inference Rules

Beyond explicit edges, the graph builder infers edges:

| Rule | From | To | Inferred Edge |
|------|------|----|---------------|
| Transitive System Usage | Dept A uses Sys X, Sys X enables Workflow Y | Dept A owns Workflow Y | `uses` (indirect) |
| Common System | Dept A uses Sys X, Dept B uses Sys X | Dept A handoff_to Dept B | Potential handoff |
| Tool Gap | Dept A should use Sys X (by blueprint) but doesn't | Dept A ──missing── Sys X | Gap constraint edge |
| Sequential Dependencies | Workflow A precedes Workflow B in blueprint | Workflow B depends_on Workflow A | Inferred dependency |

Inferred edges have lower confidence than explicit edges unless validated.
