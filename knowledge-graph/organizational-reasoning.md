# Organizational Reasoning with the Knowledge Graph

## Overview

The knowledge graph enables the reasoning engine to derive insights that are not explicitly stated in any single input. By traversing relationships, the engine can infer organizational properties, identify hidden bottlenecks, and discover opportunities that no individual signal would reveal.

---

## Inference Patterns

### Pattern 1: Bottleneck Detection via Approval Depth

**Question**: Where are approval bottlenecks creating workflow friction?

**Method**:
1. Find all Approval nodes connected to Workflow nodes
2. For each workflow, count approval depth (number of approvals required)
3. For each approval, check averageTime property
4. Identify workflows with: depth > 3 OR averageTime > 48 hours
5. Cross-reference with assessment friction signals

**Example**:
```
Workflow: "Contract Creation" requires 4 approvals
  → Legal approves (avg 24h)
  → Finance approves (avg 12h)
  → VP Sales approves (avg 8h)
  → CEO approves (avg 48h)
→ Total: 92 hours average approval time
→ Inference: Legal and CEO are primary bottlenecks
→ Opportunity: Automated contract review (reduces Legal time)
```

### Pattern 2: System Redundancy Detection

**Question**: Is the organization paying for overlapping tools?

**Method**:
1. Find all System nodes with the same category
2. Check for multiple systems serving the same purpose
3. Cross-reference with usage frequency
4. Identify redundancy where two systems serve the same workflow

**Example**:
```
Category: CRM
  → System: Salesforce (used by Sales)
  → System: HubSpot (used by Marketing)
  → System: Pipedrive (used by SDR team)
→ Inference: Tool sprawl, consolidation opportunity
→ Opportunity: Vendor consolidation recommendation
```

### Pattern 3: Knowledge Sink Detection

**Question**: Where does organizational knowledge reside unsupported by systems?

**Method**:
1. Find Person nodes with high knowledge criticality
2. Check for Document nodes that document that knowledge
3. If Person has critical knowledge BUT no Document documents it → knowledge sink
4. Cross-reference with departure risk signals

**Example**:
```
Person: "Sarah" (Senior Data Engineer)
  → owns: Knowledge domain "Data Pipeline Architecture"
  → No Document documents this domain
  → Risk: Key-person dependency
→ Inference: Documentation gap with high bus-factor risk
→ Opportunity: Automated documentation generation
```

### Pattern 4: Handoff Friction Identification

**Question**: Which cross-department handoffs create the most friction?

**Method**:
1. Find all handoff_to edges
2. For each, check friction_level property
3. For high-friction handoffs, check:
   - Is there a documented handoff process?
   - Is there a shared system?
   - Are there distinct ownership boundaries?
4. Combine friction_score from assessment with graph analysis

**Example**:
```
Sales ──handoff_to──→ CS (friction: high)
  Handoff includes: contract, implementation notes, contacts
  Tools: Salesforce → Gainsight (no integration)
  Assessment confirms: "CS usually has to chase Sales for context"
→ Inference: Handoff friction caused by system disconnection
→ Opportunity: Automated handoff with context sync
```

### Pattern 5: AI Readiness Synthesis

**Question**: What is the organization's overall AI readiness considering systems, culture, and workflows?

**Method**:
1. Aggregate signals from:
   - AI Maturity node (from research)
   - Change Capacity node (from assessment)
   - Technical Infrastructure scores
   - Workflow.aiReadiness properties
2. Cross-reference for consistency
3. Identify specific readiness barriers

**Example**:
```
AI Maturity: "Experimental" (research)
Change Capacity: "High" (assessment)
Technical Infrastructure: "Modern" (research)
Workflow.aiReadiness: Majority "High" (assessment)
→ Overall AI Readiness: "High" with caveat: needs strategy
→ Inference: Organization is ready for AI but needs AI strategy first
```

---

## Graph-Enhanced Reasoning

### Before Graph (Stage 1)

The reasoning engine generates opportunities using only explicit inputs:
- Assessment responses
- Research profile
- Blueprint matches

### After Graph (Stage 3+)

The reasoning engine enriches opportunities with graph-derived insights:
- Bottleneck depth analysis
- System dependency chains
- Cross-department friction points
- Knowledge concentration risks

### Example Enhancement

**Without Graph**:
```
Opportunity: Automated Lead Qualification
Evidence:
  [User] High time on lead research
  [Research] Salesforce detected
  [Inference] Stage-typical bottleneck
Confidence: High
```

**With Graph**:
```
Opportunity: Automated Lead Qualification
Evidence:
  [User] High time on lead research
  [Research] Salesforce, ZoomInfo, HubSpot detected
  [Inference] Stage-typical bottleneck
Graph Enhancement:
  - System redundancy: HubSpot + Salesforce both used for lead management
  - Handoff friction: Lead qualification → Deal management has high friction
  - Approval depth: Lead routing has 3 approval layers (SDR → Manager → RevOps)
  - Knowledge sink: Lead scoring criteria only known by one senior SDR
Confidence: Confirmed (graph adds cross-confirmation)
```

---

## Graph Update Rules

### When to Update

| Event | Update Type | Scope |
|-------|-------------|-------|
| Assessment response received | Add/Update nodes and edges | Direct answers |
| Research profile generated | Add nodes, set confidence | Research findings |
| New inference made | Add inferred edges | Intermediate conclusions |
| Opportunity generated | Add Opportunity node | Reasoning output |
| Ranking complete | Update Opportunity node priority | Priority property |

### Update Frequency

- Assessment responses: Real-time (as user progresses)
- Research profile: On demand (when profile is generated)
- Inferences: Batch after each pipeline stage
- Opportunity updates: After ranking completes

### Data Retention

- Graph persists for the duration of the assessment engagement
- After final report delivered, graph is anonymized and retained for pattern learning
- Customer can request graph deletion at any time
