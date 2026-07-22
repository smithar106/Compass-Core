# Reasoning V2 Pipeline

## Overview

Reasoning V2 is the multi-model reasoning pipeline that converts knowledge graph patterns into ranked opportunity blueprints. It uses a two-stage process: a smaller model (Sonnet) retrieves and ranks patterns, followed by a larger model (Opus) that synthesizes the final explanation.

---

## Architecture

```
Knowledge Graph
       │
       ▼
┌─────────────────┐
│   Pattern       │  Sonnet 4 (smaller model)
│   Retrieval     │  Fast, focused
│   & Ranking     │
└────────┬────────┘
         │ Raw patterns + signals
         ▼
┌─────────────────┐
│   Executive     │  Opus (larger model)
│   Explanation   │  Rich, strategic
│   Synthesis     │
└────────┬────────┘
         │ Final explanations
         ▼
    Opportunity
    Blueprints
```

---

## Stage 1: Pattern Retrieval & Ranking (Sonnet 4)

### Purpose

Take the knowledge graph and identify which opportunity blueprints match.

### Input

- Knowledge graph (nodes + edges + confidence)
- Blueprint library (all indexed patterns)
- Company profile (size, stage, industry)

### Process

1. **Graph Traversal**: Walk the graph to extract subgraphs matching blueprint trigger patterns
2. **Feature Extraction**: Convert subgraphs into feature vectors
3. **Similarity Search**: Score each blueprint against extracted features
4. **Threshold Filtering**: Keep only blueprints with score > 0.5
5. **Ranking**: Sort by score, keep top 10

### Scoring Formula

```
matchScore = 
  graphStructureMatch × 0.4 +
  departmentPresence × 0.2 +
  frictionSignals × 0.2 +
  companyStageAlignment × 0.1 +
  companySizeAlignment × 0.1
```

### Output

Top 10 matching blueprints with:
- Blueprint ID
- Match score
- Matching graph subgraph
- Signal strengths per department
- Confidence level

---

## Stage 2: Executive Explanation Synthesis (Opus)

### Purpose

Transform ranked patterns into a coherent, human-readable explanation that tells the story of the company's AI opportunity landscape.

### Input

- Top 10 blueprints (from Stage 1)
- Knowledge graph
- Company profile
- Assessment highlights
- Blueprint library (full detail for top matches)

### Process

1. **Narrative Construction**: Build a story connecting company context → pain points → opportunities
2. **Opportunity Clustering**: Group related blueprints into themes
3. **Priority Determination**: Rank opportunity clusters by feasibility + impact
4. **Evidence Linking**: Anchor every claim in graph nodes and edges
5. **Uncertainty Communication**: Flag low-confidence claims and speculation

### Output

Executive explanation with:
- Theme-level opportunity clusters
- Ranked opportunities within each theme
- Evidence strength for each claim
- Confidence indicators
- Natural language narrative

---

## Model Selection Rationale

| Stage | Model | Rationale |
|-------|-------|-----------|
| Pattern Retrieval & Ranking | Sonnet 4 | Fast, cheap, good at structurally matching patterns to graph features. Smaller model excels at focused comparisons. |
| Executive Explanation | Opus | Rich synthesis, narrative construction, handling ambiguity. Larger model needed for strategic communication. |

### Fallback

If Opus is unavailable:
- Sonnet 4 handles both stages
- Explanation quality degrades (less narrative, more bullet-point)
- Confidence indicators adjusted downward

---

## Confidence Calibration

| Confidence | Meaning | Trigger |
|------------|---------|---------|
| Confirmed | Multiple independent signals + graph validation | Score > 0.8 AND graph has supporting edges |
| High | Strong pattern match + some supporting evidence | Score > 0.7 AND at least 2 supporting edges |
| Medium | Pattern matches but evidence is thin | Score > 0.5 OR limited supporting edges |
| Low | Pattern weakly matches, speculative | Score 0.3-0.5 |
| Inconclusive | No clear pattern match | Score < 0.3 |

---

## Latency Budget

| Stage | Budget | Notes |
|-------|--------|-------|
| Graph Traversal | 2s | On small graph (50-100 nodes) |
| Feature Extraction | 1s | |
| Similarity Search | 2s | Over 500+ blueprints |
| Pattern Ranking | 1s | |
| Stage 1 Total | 6s | |
| Stage 2 (Sonnet) | 15s | Or use cached results |
| Stage 2 (Opus) | 30s | If using Opus |
| Total (Sonnet only) | 21s | |
| Total (Sonnet + Opus) | 36s | |

Target total: < 30s for acceptable user experience. If Opus is slow, fall back to Sonnet-only and note reduced quality.
