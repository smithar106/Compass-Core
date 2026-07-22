# Graph Builder

## Overview

The Graph Builder constructs the organizational knowledge graph from all available data: research profiles, assessment responses, and blueprint patterns. The graph represents the company as nodes (departments, systems, workflows, people, constraints, opportunities) connected by typed edges.

---

## Inputs

| Input | Source |
|-------|--------|
| Company Profile | Company Intelligence Agent |
| Technology Profile | Technology Intelligence Agent |
| Industry Profile | Industry Intelligence Agent |
| Assessment Responses | Adaptive Assessment Agent |
| Pre-assessment Hypotheses | Hypothesis Agent |
| Ontology | ontology.json |
| Relationship Library | relationship-library.md |

---

## Outputs

| Output | Description |
|--------|-------------|
| Knowledge Graph | Nodes + Edges representing the org |
| Inferred Edges | Relationships derived from existing data |
| Confidence Map | Per-node and per-edge confidence scores |
| Gap Nodes | Missing data identified for follow-up |

---

## Graph Construction Pipeline

### Stage 1: Node Creation

Create initial nodes from all available data:

**From Company Profile**:
- Department nodes for each detected department
- Person nodes for key roles (if identifiable)
- KPI nodes for tracked metrics (if available)
- Location nodes if relevant

**From Technology Profile**:
- System nodes for each detected system/tool
- Category tags for each system (CRM, ERP, Support, etc.)

**From Industry Profile**:
- Benchmark nodes for industry comparisons
- Compliance nodes for regulated requirements

**From Assessment**:
- Workflow nodes for identified processes
- Approval nodes for decision points
- Meeting nodes for recurring meetings
- Document nodes for artifacts
- Knowledge nodes for expertise areas
- Constraint nodes for blockers
- Opportunity nodes for AI opportunities

**From Blueprint Library**:
- Reference Opportunity nodes for known patterns
- Outcome nodes linked to opportunities

### Stage 2: Edge Creation

Create edges between nodes:

**From Technology Profile**:
- Department → System `uses` edges
- System → System `integrates_with` edges

**From Assessment**:
- Person → Workflow `owns` edges
- Department → Workflow `performs` edges
- Workflow → Workflow `depends_on` edges
- Constraint → Opportunity `blocks` edges

**From Blueprint Library**:
- Opportunity → Outcome `enables` edges
- Blueprint → Opportunity `suggests` edges

### Stage 3: Edge Inference

Apply inference rules to derive new edges:

| Rule | Trigger | Inference |
|------|---------|-----------|
| System-Workflow Mapping | System → Used by Dept that owns Workflow | System → enables → Workflow |
| Cross-Dept Collaboration | Dept A and Dept B share a system | Dept A → handoff_to → Dept B |
| Sequential Workflows | Workflow A and Workflow B in same department with temporal relation | Workflow A → depends_on → Workflow B |
| Tool Gap Detection | Department matches blueprints but lacks recommended tool | Department → has_gap → Tool Category |

### Stage 4: Confidence Assignment

Each node and edge gets a confidence score:

**Direct from Data** (High/Confirmed):
- "We use Salesforce" → System node Confidence = Confirmed
- Assessment response → Edge Confidence = High

**Inferred** (Medium/Low):
- Inferred edges → Confidence = Medium
- Deduced nodes → Confidence = Low-Medium

**Unknown** (None):
- Blueprint-recommended nodes that don't exist → Confidence = None (gap flagged)

---

## Graph Schema

```yaml
graph:
  nodes:
    - id: "dept-sales"
      type: "Department"
      label: "Sales"
      properties:
        size: 45
        confidence: "High"
        evidence: ["Company Profile", "Assessment Q-SALES-*"]
    
    - id: "sys-salesforce"
      type: "System"
      label: "Salesforce"
      properties:
        category: "CRM"
        users: 35
        confidence: "Confirmed"
        evidence: ["Technology Profile", "Assessment Q-TECH-01"]
    
    - id: "wf-lead-qualification"
      type: "Workflow"
      label: "Lead Qualification"
      properties:
        frequency: "Daily"
        duration: "Manual, multi-tool"
        confidence: "High"
        evidence: ["Assessment Q-SALES-01"]
  
  edges:
    - source: "dept-sales"
      target: "sys-salesforce"
      relationship: "uses"
      properties:
        adoptionLevel: "High"
        confidence: "Confirmed"
        evidence: ["Technology Profile"]
    
    - source: "dept-sales"
      target: "wf-lead-qualification"
      relationship: "owns"
      properties:
        confidence: "High"
        evidence: ["Assessment Q-SALES-01"]
```

---

## Edge Cases

### Conflicting Data

If two sources provide conflicting information:
- Assessment response overrides research data (user knows their org)
- Higher confidence source wins
- Conflict is recorded as a node property for later resolution

### Missing Departments

If a department is not detected:
- Department node is not created
- Related workflows/systems are orphaned
- Orphaned nodes are flagged for follow-up

### Cycle Detection

The graph must not contain cycles in the `depends_on` or `reports_to` relationships. If a cycle is detected:
- Both edges are flagged
- Assessment follow-up is triggered
- Lower-confidence edge is removed

### Graph Size Limits

Expected graph size: 30-100 nodes, 50-200 edges per company.
If graph exceeds 200 nodes, low-confidence inferred edges are pruned.
