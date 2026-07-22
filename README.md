# Major-Compass

**Compass** is an AI opportunity-discovery platform for B2B SaaS companies. It determines **where** AI creates measurable operational leverage **before** any implementation begins.

Compass sits above AI implementation platforms such as Major, Bland, and OpenAI. Rather than asking "how do we build this AI feature?", Compass answers the prior question: "**which** AI application will create the most value for our specific organization, today?"

## Why Compass

Most B2B SaaS companies approach AI with a technology-first mindset: pick a model, find a use case, build a prototype. This is backwards. Compass flips the sequence to **organization-first**: understand the company's workflows, bottlenecks, signals, and constraints — then identify where AI creates genuine leverage.

Compass does not:
- Build or deploy AI features
- Fine-tune models
- Recommend specific vendors or LLMs
- Generate ROI projections

Compass does:
- Map organizational workflows across 10 departments
- Extract signals of operational friction
- Pattern-match against 50 validated B2B SaaS AI blueprints
- Generate ranked AI Opportunity Maps with evidence and confidence
- Produce implementation blueprints with dependency sequencing

## System Architecture

```
Company Profile → Intelligence Layer (8 Agents) → Adaptive Assessment
  → Reasoning Engine V2 (8-stage pipeline) → Knowledge Graph
    → AI Opportunity Map + Implementation Blueprint
```

### Milestones

| Milestone | Area | Status |
|-----------|------|--------|
| M1 | Foundation: Thesis, PRD, Framework, Research Plan, Blueprint Summary | Complete |
| M2 | Blueprints (50) + Assessment (25 questions, scoring, signals) | Complete |
| M3 | Reasoning Engine (8-stage pipeline, ranking, confidence, explanation) | Complete |
| M4 | Intelligence Layer (8 agents: Company, Tech, Workflow, Industry, Hypotheses, Adaptive, Graph, Reasoning V2) | Complete |

## Repository Structure

```
Major-Compass/
├── README.md                    # This file
├── docs/                        # Foundation documents
│   ├── product-thesis.md
│   ├── product-requirements.md
│   ├── recommendation-framework.md
│   ├── research-plan.md
│   └── blueprint-library-summary.md
├── schemas/                     # JSON Schema Draft 2020-12
│   ├── company-assessment.schema.json
│   ├── workflow-blueprint.schema.json
│   └── company-profile-schema.json
├── data/                        # Blueprint library + research data
│   ├── blueprints/
│   │   └── b2b-saas-workflows.json
│   └── research/
├── assessment/                  # Assessment engine
│   ├── questions.json
│   ├── signal-map.md
│   ├── scoring-framework.md
│   ├── question-design.md
│   └── sample-results.md
├── reasoning/                   # Reasoning engine
│   ├── reasoning-engine.md
│   ├── reasoning-pipeline.md
│   ├── ranking-algorithm.md
│   ├── confidence-framework.md
│   ├── implementation-sequencing.md
│   ├── opportunity-explanation-framework.md
│   └── reasoning-examples.md
├── research/                    # Research framework
│   ├── research-framework.md
│   ├── signal-library.md
│   ├── company-profile-schema.json
│   ├── research-agent-design.md
│   └── research-examples.md
├── knowledge-graph/             # Knowledge graph
│   ├── graph-schema.json
│   ├── ontology.md
│   ├── relationship-model.md
│   └── organizational-reasoning.md
├── simulator/                   # Simulation engine
│   ├── simulation-engine.md
│   ├── simulation-framework.md
│   ├── scenario-library.md
│   └── example-simulations.md
├── intelligence/                # Intelligence layer - 8 agents
│   ├── README.md
│   ├── 01-company/
│   ├── 02-technology/
│   ├── 03-workflow/
│   ├── 04-industry/
│   ├── 05-hypotheses/
│   ├── 06-adaptive-assessment/
│   ├── 07-graph/
│   └── 08-reasoning-v2/
└── prompts/
```

## Usage

Compass is a reasoning engine, not a running service. The documents in this repository define the complete logic, schema, and framework required to implement the platform. Implementation targets include:

- Python-based reasoning pipeline
- FastAPI or GraphQL API layer
- PostgreSQL with pgvector for blueprint matching
- Neo4j or similar graph database for the knowledge graph
- LLM integration for research agent orchestration

## License

Proprietary. All rights reserved.
