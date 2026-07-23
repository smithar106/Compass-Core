# Compass Product Contract

## What Compass Is

Compass helps operations leaders decide **what to automate next**, whether the right answer is AI, deterministic software, process redesign, human work, a hybrid, or no action yet, and generates an Implementation Blueprint for the chosen intervention.

Compass operates **before** implementation — it is a reasoning engine that produces a ranked, evidence-backed intervention plan. It does not build, deploy, monitor, or manage any system.

## Product Hook

> What should your company automate next?

This is not a presumption that automation is always appropriate. The hook invites an honest answer. Compass may recommend:
- AI;
- deterministic software;
- process redesign;
- human work;
- a hybrid;
- **no action yet**.

## Target Customer

- COO
- VP Operations
- Head of Business Operations
- B2B SaaS company
- Approximately 200–1,000 employees

The MVP buyer and primary user is the operations leader. The long-term product may serve the whole organization; the MVP does not.

## Core Insight

> AI is rapidly commoditizing implementation. As building software becomes cheaper and easier, the scarce resource shifts from implementation to judgment.

Companies have abundant tools. They lack confidence about what to solve first. Many vendors begin with the solution they sell. Compass begins with the underlying business problem. Compass operates before implementation.

## Current Product Loop

```
Assessment
→ AI Opportunity Map
→ Compare Intervention Paths
→ Prioritize One Intervention
→ Implementation Blueprint
```

### Assessment

Captures: how work is performed, where it breaks down, desired outcomes, frequency, people and handoffs, tools and systems, data availability, exceptions, current cost or time, ownership, risk, process stability, and prior attempts. The assessment must not ask the user to design an AI solution.

### AI Opportunity Map

A prioritized map of business problems and improvement opportunities. Despite the name, entries may recommend non-AI interventions. The name is retained for YC continuity; the internal domain model is business problems, not technologies.

### Compare Intervention Paths

For every qualified business problem, Compass evaluates:
- AI
- Deterministic software
- Process redesign
- Human work
- Hybrid
- No action yet

Each path is scored on deterministic criteria. Every selected path must explain why alternatives were rejected.

### Prioritize One Intervention

Deterministic four-pass prioritization:
1. Eligibility — is the problem and intervention valid?
2. Business leverage — cost, time, revenue, risk, customer and employee impact, strategic importance
3. Readiness and feasibility — data readiness, owner, dependencies, effort, regulatory, change burden
4. Portfolio priority — time to value, confidence, reversibility, learning value, concentration risk

### Implementation Blueprint

A concrete plan that operations leaders and technical teams can understand and evaluate together. Covers: problem definition, root cause, selected intervention, compared alternatives, current and future workflow, required systems, APIs, data, human roles, ownership, security, privacy, rollout phases, change management, validation plan, success metrics, risks, assumptions, escalation requirements, and expected business impact.

## Canonical Product Principles

### AI-agnostic, outcome-obsessed

Compass does not maximize AI adoption. It maximizes expected business improvement.

### Understand before recommending

Compass must identify the workflow, root cause, operating context, and desired outcome before selecting any technology.

### Compare simpler alternatives

AI must always compete against deterministic software, process redesign, human work, hybrid systems, and no action yet.

### Evidence before certainty

Recommendations must show: evidence, assumptions, missing information, confidence, alternative paths, and reasons alternatives were rejected.

### Business language first

Default views must be understandable by non-technical operators. Technical details remain available for engineers and implementation teams through progressive disclosure.

### Deterministic decisions where possible

LLMs may structure ambiguity, synthesize explanations, or assist with research. They must not independently assign final priority, override hard constraints, invent evidence, or produce unsupported claims.

### Current truth over future ambition

Do not present planned functionality as already built. Interfaces may anticipate future capabilities without claiming them.

## Recommendation Contract

Every recommendation must answer:

1. Why is this the right problem?
2. Why is this the right intervention?
3. Why should it be prioritized now?
4. How should it be implemented?
5. What evidence supports it?
6. Which assumptions could change it?
7. What does success look like?
8. When is technical escalation required?

## Current MVP Requirements

The MVP must support:
- Guided assessment
- Persisted responses
- Business-problem identification
- Intervention-path comparison
- Deterministic prioritization
- Evidence and assumption display
- Projected business impact
- Selected intervention
- Implementation Blueprint
- User feedback on recommendation usefulness

## Explicitly Out of Scope Before YC Submission

Do not build or claim:
- Slack ingestion
- Jira ingestion
- Automatic deployment
- Live AI-system monitoring
- Portfolio governance
- Vendor marketplace
- Cross-customer learning
- Autonomous implementation
- Full organizational systems inventory
- Real-time ROI measurement
- Broad integration ecosystem
- Advanced billing
- Multi-enterprise administration

Interfaces may anticipate these capabilities without implementing them now.

## Trust Contract

Compass must never behave like a black-box AI agency.

Every Opportunity Map and Blueprint must expose:
- Recommendation rationale
- Evidence
- Assumptions
- Confidence
- Alternatives
- Rejection reasons
- Expected impact
- Success metrics
- Risks
- Owner
- Escalation level

## Technical and Non-Technical User Contract

For operations leaders, emphasize: problem, impact, owner, recommended intervention, effort, time to value, risk, and success metric.

For technical users, additionally expose: systems, APIs, data requirements, architecture, security, dependencies, evaluation method, and escalation conditions.

Do not create separate products. Use progressive disclosure within one shared artifact.

## Four Internal Pillars

### North — Direction
What should the organization improve next?

### East — Capability
How can technical and non-technical people participate in improvement?

### South — Visibility
Why was a decision made, who owns it, and what should happen?

### West — Learning
How will outcomes eventually improve future recommendations?

Only North and the pre-implementation portion of South are central to the current MVP.

## Core and Web Responsibilities

**Compass Core owns:** schemas, business-problem extraction, intervention generation, intervention eligibility, intervention scoring, deterministic prioritization, confidence, evidence traceability, alternative rejection, Blueprint generation, evaluation, and persistence contracts.

**Compass Web owns:** marketing, assessment UX, authentication, response persistence, pipeline invocation, Opportunity Map rendering, intervention comparison, Blueprint rendering, user feedback, accessibility, and demo reliability.

The frontend must not reimplement recommendation logic.

## Demo Contract

The YC demo must show:
```
One operations leader
→ one assessment
→ one AI Opportunity Map
→ multiple intervention types
→ one prioritized intervention
→ one Implementation Blueprint
```

The sample organization must produce at least:
- One AI recommendation
- One deterministic-software recommendation
- One process-redesign recommendation
- One hybrid recommendation
- One lower-priority or no-action recommendation

## Success Definition

The MVP succeeds when a reviewer can understand, within minutes:
- What business problem Compass solves
- Why it exists before implementation platforms
- Why it does not recommend AI reflexively
- How it chose the leading intervention
- What an implementation team should do next
