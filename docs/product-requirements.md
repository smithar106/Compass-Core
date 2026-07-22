# Product Requirements Document: Compass

## 1. Product Overview

Compass is an AI opportunity-discovery platform that determines where AI creates measurable operational leverage for B2B SaaS companies before implementation begins. It produces AI Opportunity Maps and Implementation Blueprints grounded in organizational evidence.

### 1.1 Vision

Every B2B SaaS company should know, with evidence and confidence, which AI applications will create the most value for their specific organization — before spending a dollar on implementation.

### 1.2 Mission

To become the standard layer between AI strategy and AI implementation for B2B SaaS companies.

---

## 2. Personas

### 2.1 VP of Operations (Primary)

**Background**: 10+ years in SaaS operations. Responsible for process efficiency, tool consolidation, and organizational scalability. Reports to COO or CEO.

**Goals**:
- Reduce operational friction without headcount growth
- Identify which processes are ready for AI augmentation
- Prioritize AI investments across departments
- Justify AI budget with evidence, not hype

**Pain Points**:
- Department heads each have their own AI wishlist (no prioritization)
- Previous AI experiments failed due to poor use-case selection
- Cannot distinguish genuine opportunity from vendor pitches
- Needs a defensible framework to say "no" to low-value AI proposals

**Usage Scenario**: Sarah, VP Ops at a 300-person B2B SaaS company, needs to build the annual AI investment plan. She uses Compass to assess all 10 departments, get a ranked AI Opportunity Map, and present evidence-based recommendations to the executive team.

### 2.2 Head of Revenue (Secondary)

**Background**: 8+ years in SaaS sales or go-to-market leadership. Responsible for revenue targets, pipeline generation, and sales efficiency.

**Goals**:
- Increase quota attainment through sales productivity
- Reduce ramp time for new sales reps
- Improve lead qualification accuracy
- Accelerate deal cycles

**Pain Points**:
- Sales team spends 40% of time on non-selling activities
- CRM data quality is poor, making forecasting unreliable
- No visibility into which sales workflows are AI-ready
- Current AI tools (chatbots, copilots) don't address core sales friction

**Usage Scenario**: Marcus, Head of Revenue, suspects his sales team is drowning in administrative work. He uses Compass to quantify sales-specific AI opportunities and prioritize them against other departmental needs.

### 2.3 CTO (Tertiary)

**Background**: 15+ years in engineering and technology leadership. Responsible for technical architecture, engineering productivity, and platform decisions.

**Goals**:
- Improve engineering velocity without burning out teams
- Reduce technical debt from ad-hoc AI experiments
- Build a coherent AI strategy across product and operations
- Ensure compliance and security in AI adoption

**Pain Points**:
- Engineering teams are building bespoke AI features without coordination
- No standard for evaluating AI tools before procurement
- Concerned about data security and compliance risks
- Needs a systematic way to triage AI requests from all departments

**Usage Scenario**: Priya, CTO, needs a unified AI roadmap that accounts for technical feasibility, dependency resolution, and security constraints. She uses Compass to get an implementation blueprint that sequences AI work properly.

---

## 3. Functional Requirements

### FR-1: Company Profiling

| ID | Requirement | Priority | Persona |
|----|------------|----------|---------|
| FR-1.1 | System shall accept company name and website URL as input | P0 | All |
| FR-1.2 | System shall research the company using public sources to infer operational profile | P0 | VP Ops |
| FR-1.3 | System shall infer: company size, revenue stage, funding status, business model | P0 | All |
| FR-1.4 | System shall infer organizational structure (departments, team sizes, reporting lines) | P1 | VP Ops |
| FR-1.5 | System shall infer tech stack from public signals | P1 | CTO |
| FR-1.6 | System shall estimate AI maturity and technology maturity | P1 | All |
| FR-1.7 | System shall identify known bottlenecks and executive priorities from CEO letters, interviews, and press | P1 | VP Ops |
| FR-1.8 | Every inference shall include: confidence level, evidence source, reasoning | P0 | All |

### FR-2: Adaptive Assessment

| ID | Requirement | Priority | Persona |
|----|------------|----------|---------|
| FR-2.1 | System shall administer an adaptive assessment of 25-40 questions | P0 | VP Ops |
| FR-2.2 | Questions shall cover all 10 departments | P0 | All |
| FR-2.3 | Assessment shall adapt based on company profile and prior responses | P0 | VP Ops |
| FR-2.4 | Questions shall be of types: boolean, scale (1-5), multi-choice, open | P0 | All |
| FR-2.5 | System shall branch questions based on previous answers | P1 | VP Ops |
| FR-2.6 | System shall skip irrelevant questions based on company profile | P1 | All |
| FR-2.7 | System shall challenge assumptions where user responses conflict with research data | P2 | VP Ops |
| FR-2.8 | System shall surface evidence tags with each question | P2 | All |

### FR-3: Opportunity Generation

| ID | Requirement | Priority | Persona |
|----|------------|----------|---------|
| FR-3.1 | System shall pattern-match assessment responses against 50+ workflow blueprints | P0 | All |
| FR-3.2 | System shall generate AI opportunities with signal, pattern, and evidence | P0 | All |
| FR-3.3 | System shall classify evidence as [User], [Research], or [Inference] | P0 | All |
| FR-3.4 | System shall assign confidence levels (Confirmed, High, Medium, Low) | P0 | All |
| FR-3.5 | System shall estimate implementation feasibility relative to company constraints | P1 | CTO |
| FR-3.6 | System shall identify dependencies between opportunities | P1 | VP Ops |
| FR-3.7 | System shall generate 5-15 opportunities per company | P1 | All |
| FR-3.8 | System shall provide reasoning paths for each opportunity | P0 | All |

### FR-4: Ranking

| ID | Requirement | Priority | Persona |
|----|------------|----------|---------|
| FR-4.1 | System shall rank opportunities using a 4-pass tier-based algorithm | P0 | All |
| FR-4.2 | Pass 1: Feasibility filter (remove technically or organizationally infeasible) | P0 | CTO |
| FR-4.3 | Pass 2: Impact estimation (assess magnitude of operational leverage) | P0 | VP Ops |
| FR-4.4 | Pass 3: Dependency ordering (identify prerequisite opportunities) | P0 | VP Ops |
| FR-4.5 | Pass 4: Strategic alignment (score against executive priorities) | P0 | Head of Revenue |
| FR-4.6 | No weighted averages or composite scores shall be used | P0 | All |
| FR-4.7 | Each opportunity shall have a tier assignment and supporting evidence | P0 | All |

### FR-5: Implementation Blueprint

| ID | Requirement | Priority | Persona |
|----|------------|----------|---------|
| FR-5.1 | System shall produce an implementation blueprint for each opportunity | P0 | CTO |
| FR-5.2 | Blueprint shall include: prerequisites, dependencies, estimated effort, sequencing strategy | P0 | CTO |
| FR-5.3 | System shall support sequencing strategies: Quick Win, Foundational, Package Deal, Phased, Conditional | P0 | VP Ops |
| FR-5.4 | Blueprint shall reference specific workflows, systems, and departments affected | P0 | All |
| FR-5.5 | System shall provide a decision tree for sequencing priority | P1 | VP Ops |
| FR-5.6 | Blueprint shall identify blocking dependencies that must be resolved first | P1 | CTO |

### FR-6: Executive Reporting

| ID | Requirement | Priority | Persona |
|----|------------|----------|---------|
| FR-6.1 | System shall produce an Executive Summary (1-page) | P0 | All |
| FR-6.2 | System shall produce a Technical Deep-Dive | P0 | CTO |
| FR-6.3 | System shall produce an Operational Action Plan | P1 | VP Ops |
| FR-6.4 | Reports shall include confidence indicators for every claim | P0 | All |
| FR-6.5 | Reports shall include the reasoning path from signal to recommendation | P0 | All |

### FR-7: Knowledge Graph

| ID | Requirement | Priority | Persona |
|----|------------|----------|---------|
| FR-7.1 | System shall maintain an organizational knowledge graph | P1 | CTO |
| FR-7.2 | Graph shall represent: departments, systems, workflows, approvals, meetings, documents, people, KPIs | P1 | All |
| FR-7.3 | Each assessment response shall enrich the graph | P2 | VP Ops |
| FR-7.4 | Each recommendation shall query the graph for context | P2 | All |
| FR-7.5 | Graph shall support inference through relationship traversal | P2 | CTO |

---

## 4. Non-Functional Requirements

### NFR-1: Performance

| ID | Requirement | Target |
|----|------------|--------|
| NFR-1.1 | Assessment completion time (user) | < 15 minutes |
| NFR-1.2 | Initial company profiling time | < 2 minutes |
| NFR-1.3 | Full reasoning pipeline execution | < 5 minutes |
| NFR-1.4 | 95th percentile API response time | < 30 seconds |

### NFR-2: Security

| ID | Requirement |
|----|------------|
| NFR-2.1 | All user data encrypted at rest and in transit |
| NFR-2.2 | No storage of proprietary company data beyond assessment completion |
| NFR-2.3 | User can request complete data deletion at any time |
| NFR-2.4 | Assessment responses treated as customer confidential |
| NFR-2.5 | Research sources limited to public data only |

### NFR-3: Reliability

| ID | Requirement | Target |
|----|------------|--------|
| NFR-3.1 | System uptime | 99.9% |
| NFR-3.2 | Reasoning pipeline determinism | Same inputs produce same outputs |
| NFR-3.3 | Evidence traceability | Every claim traceable to source |
| NFR-3.4 | Graceful degradation | Pipeline continues with partial data |

### NFR-4: Scalability

| ID | Requirement | Target |
|----|------------|--------|
| NFR-4.1 | Concurrent assessments | 100+ |
| NFR-4.2 | Blueprint library | 500+ |
| NFR-4.3 | Knowledge graph nodes | 100K+ |
| NFR-4.4 | Research throughput | 1000+ companies/day |

### NFR-5: Maintainability

| ID | Requirement |
|----|------------|
| NFR-5.1 | Blueprint library versioned and auditable |
| NFR-5.2 | Reasoning steps logged and replayable |
| NFR-5.3 | All schemas published as valid JSON Schema Draft 2020-12 |
| NFR-5.4 | Research agents independently testable |
| NFR-5.5 | Confidence framework empirically calibrated |

---

## 5. Constraints

| ID | Constraint | Rationale |
|----|------------|-----------|
| C-1 | No AI model training or fine-tuning | Keeps Compass in the opportunity-discovery layer |
| C-2 | No fabricated ROI numbers | Prevents false precision and credibility damage |
| C-3 | No vendor lock-in recommendations | Preserves neutrality between implementation platforms |
| C-4 | Evidence classes must be explicit | [User], [Research], [Inference] required |
| C-5 | No weighted average rankings | 4-pass tier-based only |
| C-6 | All research limited to public sources | No proprietary data access |
| C-7 | Assessment adaptive per company | No two same assessments |
| C-8 | Inference confidence always disclosed | Never present inference as fact |

---

## 6. User Flows

### Flow 1: Full Assessment (Complete)

1. User provides company name and website URL
2. Company Intelligence Agent profiles the organization
3. Technology Intelligence Agent infers tech stack
4. Industry Intelligence Agent researches industry context
5. Organizational Workflow Agent models workflow structure
6. Hypothesis Agent generates pre-assessment hypotheses
7. Adaptive Assessment Agent personalizes the question set
8. User completes adaptive assessment (15-25 min)
9. Assessment responses enrich the knowledge graph
10. Reasoning Engine processes through 8-stage pipeline
11. AI Opportunity Map and Implementation Blueprint generated
12. Executive, Technical, and Operational reports produced

### Flow 2: Quick Assessment (Light)

1. User provides company name and website URL only
2. Company profiling runs (no adaptive assessment)
3. Reasoning engine runs on research-only data
4. Limited opportunity map delivered (lower confidence)
5. User can upgrade to full assessment later

### Flow 3: Update Assessment

1. Returning user provides company name
2. Previous knowledge graph loaded
3. Research agents check for changes since last assessment
4. Incremental assessment probes changed areas only
5. Updated opportunity map with delta from previous

---

## 7. Acceptance Criteria

| Scenario | Given | When | Then |
|----------|-------|------|------|
| New company assessment | Valid company name and URL | User submits | Company profiled within 2 min, assessment generated |
| Adaptive question skip | Company has no engineering team | Engineering questions queued | System skips engineering questions |
| Evidence classification | Opportunity recommended | User inspects | Evidence tagged [User], [Research], or [Inference] |
| Confidence disclosure | Low confidence opportunity | User views | Low confidence indicator with reasoning shown |
| Dependency ordering | Two related opportunities | Map generated | Prerequisite identified and sequenced |
| Executive summary | Full assessment complete | User requests | One-page summary with tier rankings and confidence |
| No ROI fabrication | Any recommendation | Generated | No dollar or percentage claims present |
