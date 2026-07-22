# Reasoning Engine Architecture

## Overview

The Compass Reasoning Engine is the core processing unit that transforms company profiles, assessment responses, and research data into ranked AI Opportunity Maps with implementation blueprints.

The engine implements an **8-stage pipeline** that processes evidence through increasingly sophisticated stages — from raw signal extraction to executive synthesis.

---

## Architecture Principles

1. **Deterministic pipeline**: Same inputs always produce same outputs. No randomness in core reasoning.
2. **Evidence traceability**: Every output is traceable back through the pipeline to specific input evidence.
3. **Graceful degradation**: Pipeline continues with partial data. Missing inputs reduce confidence but don't block processing.
4. **Pluggable stages**: Each stage can be independently improved, replaced, or tested.
5. **No black-box scoring**: No weighted averages or composite scores. All ranking is tier-based with explicit criteria.

---

## Inputs

| Input | Source | Format | Required |
|-------|--------|--------|----------|
| Company Profile | Company Intelligence Agent | JSON (company-profile-schema) | Yes |
| Technology Profile | Technology Intelligence Agent | JSON | No (low confidence without) |
| Industry Profile | Industry Intelligence Agent | Markdown | Yes |
| Workflow Map | Organizational Workflow Agent | JSON | No |
| Assessment Responses | Adaptive Assessment | JSON (company-assessment-schema) | No (light assessment without) |
| Pre-Assessment Hypotheses | Hypothesis Agent | JSON | No |
| Knowledge Graph | Graph Builder | Graph DB / JSON | No (improves with use) |

---

## 8-Stage Pipeline

```
Inputs → Stage 1: Intake → Stage 2: Signal Extraction → Stage 3: Pattern Matching
  → Stage 4: Constraint Evaluation → Stage 5: Opportunity Generation
    → Stage 6: Ranking (4-pass) → Stage 7: Confidence Scoring
      → Stage 8: Explanation Synthesis → Outputs
```

Each stage is documented in detail in `reasoning-pipeline.md`.

---

## Outputs

| Output | Description | Audience |
|--------|-------------|----------|
| AI Opportunity Map | Ranked opportunities with evidence and confidence | Executive, VP Ops |
| Implementation Blueprint | Sequenced implementation plan with dependencies | CTO, Engineering |
| Executive Summary | 1-page overview of key opportunities and strategic recommendations | CEO, Board |
| Technical Deep-Dive | Detailed analysis of each opportunity with technical considerations | CTO, Engineering Lead |
| Confidence Report | Confidence assessment for every inference and recommendation | All (transparency) |

---

## Design Decisions

### Decision 1: Pipeline over End-to-End Model

**Choice**: Decomposed pipeline with explicit stages rather than a single end-to-end AI model.

**Rationale**: Traceability, testability, and the ability to improve individual stages without retraining everything. Each stage produces intermediate artifacts that can be validated independently.

### Decision 2: Evidence Classes over Bayesian Probability

**Choice**: Three discrete evidence classes ([User], [Research], [Inference]) rather than Bayesian probability networks.

**Rationale**: Simplicity, transparency, and audibility. Bayesian networks would provide more mathematical rigor but at the cost of explainability. The evidence classes are understandable by non-technical stakeholders.

### Decision 3: Tier-Based Ranking over Weighted Scoring

**Choice**: 4-pass tier-based ranking with explicit pass/fail criteria rather than weighted score averaging.

**Rationale**: Weighted scores create false precision and are difficult to explain. Tier-based ranking is transparent: each pass eliminates or orders opportunities based on clear criteria. Stakeholders can understand why an opportunity is Tier 1 vs. Tier 4.

### Decision 4: Pattern Matching over Classification

**Choice**: Pattern matching against a library of blueprints rather than classifying organizations into predefined segments.

**Rationale**: Every organization is unique. Predefined segments would force-fit organizations into categories that don't capture their specific situation. Pattern matching identifies which blueprints are most relevant to the specific evidence profile.

### Decision 5: Cross-Signal Confidence over Single-Signal Confidence

**Choice**: Confidence is determined by cross-referencing multiple independent signals rather than trusting any single signal.

**Rationale**: A single signal (even [User] evidence) can be misleading due to perception bias, incomplete information, or outdated data. Confidence increases when multiple independent signals converge on the same conclusion.

---

## Processing Modes

### Full Assessment
- All 8 stages executed
- Requires company profile + assessment responses
- Highest quality output
- Processing time: ~5 minutes

### Light Assessment (Research-only)
- Stages 1-6 executed without assessment data
- No [User] evidence available
- Lower confidence on all outputs
- Processing time: ~2 minutes

### Incremental Update
- Previous outputs cached
- Only changed inputs re-processed
- Delta update to Opportunity Map
- Processing time: ~1 minute
