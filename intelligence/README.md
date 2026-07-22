# Intelligence Layer — Compass AI Opportunity Discovery

## Overview

The Intelligence Layer is the pre-assessment research and profiling system. It deploys 8 specialized agents that work together to build a comprehensive organizational profile before the adaptive assessment begins.

Each agent produces specific outputs that feed into the Reasoning Engine V2.

## Agent Architecture

```
Input: Company Name + Website URL
  │
  ├── Agent 1: Company Intelligence (Orchestrator)
  │     Outputs: Company Profile
  │
  ├── Agent 2: Technology Intelligence
  │     Outputs: Tech Stack Profile, Integration Priority
  │
  ├── Agent 3: Organizational Workflow
  │     Outputs: Workflow Map, Handoff Library
  │
  ├── Agent 4: Industry Intelligence
  │     Outputs: Industry Profile, Opportunity Library
  │
  ├── Agent 5: AI Opportunity Hypothesis
  │     Outputs: Pre-Assessment Hypotheses
  │
  ├── Agent 6: Adaptive Assessment
  │     Outputs: Personalized Question Set
  │
  ├── Agent 7: Knowledge Graph
  │     Outputs: Organizational Graph
  │
  └── Agent 8: Reasoning Engine V2
        Outputs: AI Opportunity Map, Implementation Blueprint
```

## Agent Directory

| Agent | Directory | Function |
|-------|-----------|----------|
| 1 | `01-company/` | Company Intelligence Orchestrator |
| 2 | `02-technology/` | Technology Stack Intelligence |
| 3 | `03-workflow/` | Organizational Workflow Mapping |
| 4 | `04-industry/` | Industry Intelligence & Benchmarking |
| 5 | `05-hypotheses/` | AI Opportunity Hypothesis Engine |
| 6 | `06-adaptive-assessment/` | Adaptive Question Engine |
| 7 | `07-graph/` | Organizational Knowledge Graph |
| 8 | `08-reasoning-v2/` | Unified Reasoning Engine |
