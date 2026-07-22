# Knowledge Graph Ontology

## Overview

The Compass Knowledge Graph represents organizational structure, systems, workflows, and relationships. It is the persistent memory layer that improves with each assessment and enriches every recommendation.

The graph uses a labeled property graph model with typed nodes and typed edges.

---

## Node Types

### Department

Represents an organizational department or function.

**Properties**:
- `name`: Department name (Sales, Marketing, etc.)
- `estimatedSize`: Approximate headcount
- `description`: Primary function
- `confidence`: Confidence in this node's existence

**Creation**: Research agent + assessment confirmation

### System

Represents a tool or platform used by the organization.

**Properties**:
- `name`: Tool name
- `category`: CRM, Support, HRIS, etc.
- `users`: Approximate user count
- `detectionSource`: How discovered
- `confidence`: Confidence in detection

**Creation**: Technology research agent + assessment confirmation

### Workflow

Represents an identifiable business process.

**Properties**:
- `name`: Workflow name
- `department`: Owning department
- `description`: What the workflow accomplishes
- `frequency`: How often it runs
- `duration`: Typical duration
- `aiReadiness`: AI augmentation potential

**Creation**: Research agent (inferred) + assessment (confirmed)

### Approval

Represents a decision point or approval gate.

**Properties**:
- `name`: Approval name
- `owner`: Approving role
- `type`: Financial, HR, Legal, Technical, Process
- `depth`: How many layers of approval
- `averageTime`: Typical approval turnaround

**Creation**: Assessment responses + inference

### Meeting

Represents a recurring meeting or meeting type.

**Properties**:
- `name`: Meeting name
- `frequency`: Daily, Weekly, Monthly, Quarterly
- `attendees`: Typical attendee count
- `duration`: Typical duration
- `purpose`: Meeting objective

**Creation**: Assessment responses + inference from org size

### Document

Represents a document type or artifact.

**Properties**:
- `name`: Document name
- `type`: Spec, Report, Contract, Policy, etc.
- `owner`: Creating role
- `consumers`: Who reads it
- `frequency`: How often produced

**Creation**: Assessment responses + inference

### Person

Represents a role or persona (not specific individuals).

**Properties**:
- `role`: Role title
- `department`: Home department
- `seniority`: IC, Manager, Director, VP, C-level
- `responsibilities`: Key accountabilities

**Creation**: Research agent (from LinkedIn) + assessment

### Knowledge

Represents a knowledge domain or expertise area.

**Properties**:
- `domain`: Knowledge area
- `owner`: Who holds this knowledge
- `documented`: Whether it's written down
- `criticality`: How critical to operations

**Creation**: Inference from workflow analysis

### Decision

Represents a recorded decision with context.

**Properties**:
- `topic`: Decision topic
- `decision`: What was decided
- `rationale`: Why it was decided
- `date`: When decided
- `status`: Active, Superseded, Reversed

**Creation**: Assessment + inference

### KPI

Represents a key performance indicator.

**Properties**:
- `name`: KPI name
- `value`: Current or target value
- `owner`: Responsible role
- `frequency`: Measurement cadence
- `source`: Data source for calculation

**Creation**: Assessment responses + research

---

## Edge Types

### uses

**Source**: Department or Person
**Target**: System
**Meaning**: The source uses the system in their work.
**Properties**: frequency, purpose, proficiency

### depends_on

**Source**: Workflow, Decision, or Opportunity
**Target**: Workflow, System, or Approval
**Meaning**: The source depends on the target to function.
**Properties**: criticality (Critical, Major, Minor)

### reports_to

**Source**: Person
**Target**: Person
**Meaning**: Reporting relationship.
**Properties**: direct (boolean)

### owns

**Source**: Person or Department
**Target**: Workflow, Document, KPI, or System
**Meaning**: The source is responsible for the target.
**Properties**: accountability level

### participates_in

**Source**: Person or Department
**Target**: Meeting or Workflow
**Meaning**: The source participates in the target.
**Properties**: role

### produces

**Source**: Person, Department, or Workflow
**Target**: Document, Report, or Knowledge
**Meaning**: The source creates the target.
**Properties**: frequency, quality

### consumes

**Source**: Person, Department, or Workflow
**Target**: Document, Report, or Knowledge
**Meaning**: The source uses the target as input.
**Properties**: frequency, criticality

### approves

**Source**: Person or Department
**Target**: Decision, Document, or Workflow
**Meaning**: The source has approval authority over the target.
**Properties**: type, threshold

### handoff_to

**Source**: Workflow, Department, or Person
**Target**: Workflow, Department, or Person
**Meaning**: Work is transferred from source to target.
**Properties**: frequency, friction level, documentation quality

### informs

**Source**: KPI, Document, or Report
**Target**: Decision or Person
**Meaning**: The source provides information used by the target.
**Properties**: frequency, importance

### enables

**Source**: Opportunity or System
**Target**: Opportunity or Workflow
**Meaning**: The source enables the target to function or exist.
**Properties**: criticality

### blocks

**Source**: Constraint or Dependency
**Target**: Opportunity or Workflow
**Meaning**: The source prevents the target from proceeding.
**Properties**: severity, resolution path

### synergizes_with

**Source**: Opportunity or Workflow
**Target**: Opportunity or Workflow
**Meaning**: The source and target create more value together.
**Properties**: synergy strength
