# Compass Product Roadmap

**Confidential — For Founders, Investors, and Future Employees**

---

This roadmap defines the strategic evolution of Compass. It is not a feature list. Each version represents a distinct expansion of the company's mission, customer relationship, and competitive advantage. Every version builds on the one before it.

---

## Core Thesis (Unchanged Across All Versions)

Implementation has become dramatically cheaper. Decision-making hasn't.

As building software commoditizes, the scarce resource shifts from implementation to judgment. Compass exists to help organizations make high-confidence implementation decisions before implementation begins. The product is confidence in consequential operational decisions.

---

# V1 — The Recommendation

*0–3 months | YC Stage*

### Mission

Prove that Compass can generate one recommendation trustworthy enough to change one real operational decision.

### Customer

**Who:** COO, VP Operations, Head of Business Operations at B2B SaaS companies (200–1,000 employees).

**What they feel:** Pressure to act on AI. Fear of choosing wrong. Overwhelmed by vendor claims. Unable to prioritize across departments.

### Inputs

- Structured organizational assessment (25–30 questions across 10 departments)
- Optional: company website URL for research enrichment

### Outputs

1. **Assessment** — captured responses with evidence tagging
2. **Business Problems** — detected problems with root cause hypotheses
3. **Intervention Comparison** — all 6 paths scored with deterministic criteria
4. **Recommendation** — selected intervention with evidence, alternative rejections, assumptions, confidence, success metrics, and escalation requirements
5. **Implementation Blueprint** — concrete plan covering workflow, systems, APIs, roles, phases, validation, risks, and expected impact

### Major Capabilities

- Business-problem extraction from assessment signals (14 problem patterns)
- Six-path intervention comparison (AI, deterministic software, process redesign, human work, hybrid, no action yet)
- Deterministic four-pass prioritization (eligibility, leverage, readiness, portfolio)
- Root cause hypothesis generation and evidence sufficiency gating
- Alternative rejection with concrete reasons tied to evidence
- Implementation Blueprint generation with escalation classification
- 10 intervention blueprint templates covering all path types
- AI overrecommendation measurement (target ≤ 34%)
- Idempotent pipeline execution
- Supabase persistence with RLS

### Non-Goals

- No Slack or Jira integration
- No deployment automation
- No live system monitoring
- No portfolio governance
- No cross-customer learning
- No autonomous implementation
- No full organizational systems inventory
- No real-time ROI measurement
- No broad integration ecosystem
- No advanced billing or multi-enterprise administration

### Success Metrics

| Metric | Target |
|--------|--------|
| Intervention-path accuracy (benchmark) | ≥ 80% |
| AI overrecommendation rate | ≤ 34% |
| Unsupported claim rate | 0% |
| Ranking stability (deterministic) | 100% |
| Demo completion: reviewer understands recommendation rationale | Qualitative |
| Assessment completion rate (Web) | ≥ 70% |

### Demo Story

An operations leader completes a 25-question assessment about their B2B SaaS company. Compass identifies 11 business problems across departments, compares all 6 intervention paths for each, and produces ranked recommendations. The highest-priority recommendation is deterministic software for sales lead qualification. The reviewer can see exactly why that path was selected, why AI was rejected, what evidence supports the decision, and what an implementation team should do next.

The reviewer finishes thinking: **"I understand why Compass chose this recommendation."**

### Technical Architecture

```
Compass Core (TypeScript reasoning pipeline)
  → Pipeline stages: loadAssessment → buildCompanyContext → normalizeWorkflowSignals
    → generateBusinessProblems → generateRootCauseHypotheses → analyzeEvidenceSufficiency
    → generateInterventionOptions → rankInterventions → generateExplanations → persistOpportunityMap

Compass Web (Next.js frontend)
  → Assessment UX → pipeline invocation → opportunity map rendering
  → Intervention comparison display → blueprint rendering

Supabase (PostgreSQL + pgvector)
  → assessment_sessions, questions, answers, company_evidence
  → business_problems, intervention_options, selected_interventions, alternative_rejections
  → intervention_assumptions, engine_versions, intervention_blueprints
  → opportunity_maps, opportunities, reasoning_traces
```

### Risk

| Risk | Mitigation |
|------|------------|
| Assessment too long for completion | Branching questions reduce presented count; measure drop-off |
| Recommendation confidence too low for trust | Evidence sufficiency gate prevents premature recommendations |
| Pipeline determinism not trusted by users | Expose score components and version identifiers |
| YC demo fails to show path diversity | Demo fixture generates all 6 path types from single answer set |

### What NOT to Build in V1

Slack ingestion, Jira ingestion, automatic deployment, live AI monitoring, portfolio governance, vendor marketplace, cross-customer learning, autonomous implementation, real-time ROI measurement, broad integrations, advanced billing, multi-enterprise admin.

---

# V2 — Organizational Memory

*3–6 months*

### Mission

Move from one recommendation to a system that remembers every decision and improves with each one.

### What Changed vs. V1

V1 proved Compass can produce a trustworthy recommendation. V2 proves it can learn from what happens next. The product shifts from a single-output engine to a cumulative decision system.

### Customer

**Same demographics.** V2 deepens the relationship with the same customer rather than expanding to new segments.

**What they feel now:** "The first recommendation was useful. I need to track whether we followed it, what happened, and what to do next. I don't want to start from scratch every time."

### Inputs

- All V1 inputs
- Recommendation outcome data (implemented / deferred / rejected + reason)
- Implementation follow-up surveys
- User feedback on recommendation quality
- New assessment responses for additional problems

### Outputs

All V1 outputs, plus:
1. **Recommendation History** — every recommendation ever generated, with outcome status
2. **Decision Log** — chronological record of what was recommended, chosen, and what happened
3. **Outcome Tracking** — which recommendations were implemented, with estimated vs. actual impact
4. **Refined Recommendations** — new recommendations calibrated against previous outcomes

### Major Capabilities

- **Recommendation history** — per-organization view of all past recommendations with status (pending, implemented, deferred, rejected, superseded)
- **Outcome tracking** — structured follow-up: was the recommendation followed? What was the actual impact? What went differently than expected?
- **Decision log** — immutable record of every recommendation and the reasoning behind it
- **Feedback integration** — user ratings on recommendation usefulness (per-problem and per-blueprint)
- **Early ROI tracking** — simple before/after comparison using user-reported metrics
- **Recommendation refinement** — suitability scores adjusted based on outcome feedback (deterministic; not a learned model)
- **Design partner program** — structured weekly feedback loop with 3–5 design partners

### Non-Goals

- No automated outcome measurement (user-reported only)
- No cross-customer learning (organizational silos maintained)
- No ML model training on outcomes
- No live system integration
- No portfolio-level views (deferred to V3)

### Success Metrics

| Metric | Target |
|--------|--------|
| Design partner active usage (weekly) | ≥ 3 organizations |
| Outcome tracking completion rate | ≥ 60% of recommendations |
| Recommendation usefulness rating | ≥ 4/5 |
| Return assessment rate (new problems) | ≥ 40% within 90 days |
| V1 metrics maintained or improved | All thresholds holding |

### Demo Story

Same operations leader from V1 returns 90 days later. Compass shows them the history of all previous recommendations, which ones were implemented, and what impact was reported. When they run a new assessment for a different department, Compass incorporates patterns from previous recommendations — not by changing the deterministic engine, but by surfacing relevant historical context. The leader can see: "Last time we recommended deterministic software for finance and it saved 12 hours/week. A similar pattern exists in operations."

### Architecture Additions

- `recommendation_history` table (per-organization, append-only)
- `decision_log` table (immutable, versioned)
- `outcome_tracking` table (links recommendation to follow-up survey)
- `user_feedback` table (ratings and comments per recommendation)
- Read-replica for historical queries (avoids impacting pipeline performance)

### Risk

| Risk | Mitigation |
|------|------------|
| Design partners churn before providing meaningful feedback | Over-recruit (5–7 partnerships, target 3 active); shorter feedback cycles |
| Outcome data too sparse for refinement | Manual calibration initially; require minimum 10 data points before any adjustment |
| Recommendation history becomes noise | Filter by department, time range, status; clear UI hierarchy |
| Users expect ML-powered learning | Explicit communication: learning is deterministic and transparent, not a black-box model |

### What NOT to Build in V2

Cross-customer learning, portfolio governance, live system monitoring, real-time ROI measurement, automated data ingestion, ML model training.

---

# V3 — Continuous Organizational Guidance

*6–12 months*

### Mission

Move from per-problem recommendations to continuous organizational guidance. Compass becomes the system operations leaders use to understand the health of their entire operation and prioritize across departments.

### What Changed vs. V2

V2 proved Compass can learn from individual decisions. V3 proves it can guide the organization continuously across all departments simultaneously. The product expands from a recommendation engine to an organizational guidance system.

### Customer

**Same demographics**, now with broader adoption within the organization:
- Primary: COO, VP Operations (continuous users)
- Secondary: Department heads (Sales, Marketing, CS, Finance, etc.) consuming department-level views
- Tertiary: Implementation teams consuming Blueprints

**What they feel now:** "I need to understand the full picture — not just one problem at a time. Which departments need attention? Where are we making progress? What should we prioritize this quarter?"

### Inputs

- All V2 inputs
- Multiple assessments across different departments or time periods
- Optional: lightweight KPI imports (headcount, revenue, ticket volume, etc.)
- Research integration (external signals, industry benchmarks)

### Outputs

All V2 outputs, plus:
1. **Live Organizational Dashboard** — health overview across all assessed departments
2. **Department-Level Opportunity Maps** — per-department prioritized intervention lists
3. **Portfolio Prioritization** — cross-department ranking of all open recommendations
4. **Workflow Health Indicators** — per-workflow metrics showing friction, automation level, and improvement trajectory
5. **Implementation Tracking** — status of in-progress implementations across the organization
6. **Cross-Project Learning** — surfaced patterns: "Similar recommendation succeeded in Sales; consider same approach in Support"

### Major Capabilities

- **Organizational dashboard** — single view of all assessed departments, problems, and recommendations with drill-down
- **Portfolio prioritization** — cross-department ranking considering dependencies, resource constraints, and strategic value
- **Workflow health monitoring** — re-assessment triggered by configurable intervals; tracks improvement over time
- **Research integration** — external signals (new AI capabilities, regulatory changes, benchmark data) flagged when they affect existing recommendations
- **Compass Intelligence layer** — research agents that enrich assessments with company, technology, and industry context (deterministic extraction, not generative)
- **Cross-project pattern detection** — "This problem pattern resembles one solved in another department; the same intervention path has high expected value here"

### Non-Goals

- No live API integration with customer systems
- No autonomous implementation
- No real-time KPI ingestion (manual or periodic import)
- No full organizational systems inventory
- No vendor marketplace

### Success Metrics

| Metric | Target |
|--------|--------|
| Organizational dashboard weekly active users | ≥ 5 per organization |
| Portfolio prioritization adoption (% of orgs using) | ≥ 80% |
| Recommendation coverage across departments | ≥ 6 departments per organization |
| Cross-project pattern surfaced per quarter | ≥ 3 meaningful patterns |
| V2 metrics maintained or improved | All thresholds holding |

### Demo Story

An operations leader opens Compass and sees the full organizational dashboard. Customer Success has two open recommendations (one hybrid, one process redesign). Finance implemented the deterministic software recommendation from V1 and reports 15 hours/week saved. Marketing has a new problem detected from a recent assessment. Compass surfaces a cross-project pattern: the approval-chain problem in Operations resembles one solved in Finance last quarter — the same process-redesign path is recommended, with context from the previous implementation.

### Architecture Additions

- `organizational_dashboard` materialized view (aggregates across sessions and departments)
- `workflow_health` table (time-series of workflow metrics per department)
- `research_signals` table (external signals mapped to problem patterns)
- `cross_project_patterns` table (detected similarities across problems)
- Scheduled re-assessment triggers (configurable intervals per department)
- Read-optimized dashboard endpoints (separate from pipeline API)

### Risk

| Risk | Mitigation |
|------|------------|
| Dashboard becomes a "nice to have" rather than essential | Tie directly to portfolio prioritization — must use to see cross-department ranking |
| Research integration adds noise without value | Strict filter: only surface signals that would change a recommendation |
| Cross-project patterns are spurious | Deterministic pattern matching only; no ML; require minimum similarity threshold |
| Performance degrades with historical data growth | Dashboard queries against materialized views; data retention policies |

### What NOT to Build in V3

Live API integrations, autonomous implementation, full system inventory, vendor marketplace, real-time data ingestion, ML-powered recommendations.

---

# V4 — Living Organizational Compass

*12+ months*

### Mission

Replace static dashboards and periodic reports with a living system that continuously guides the organization across four dimensions: strategic direction, execution capability, operational health, and learning.

### What Changed vs. V3

V3 proved Compass can guide an organization across multiple departments simultaneously. V4 transforms the product from a guidance system into the organization's primary operational decision interface — replacing the dashboards, spreadsheets, and periodic reviews that operations leaders currently rely on.

### Customer

**Same core demographics**, now serving as organizational operating system:
- Primary: COO, VP Operations (daily users)
- Secondary: CEO, executive team (strategic view)
- Tertiary: Department heads and team leads (operational view)

**What they feel now:** "I'm tired of stitching together data from 10 different sources to understand how we're doing. I want one place that tells me where we're headed, how we're executing, what needs attention, and what we're learning."

### Outputs

The product becomes a **living compass** with four continuously updating directions:

**North — Strategic Direction**
- Current strategic priorities derived from portfolio prioritization
- Intervention roadmap with dependencies, resource allocation, and expected impact
- "What should we be working on?" — updated dynamically

**East — Execution Capability**
- Implementation velocity across all active interventions
- Bottleneck detection (stalled implementations, resource conflicts, blocked decisions)
- Organizational readiness for future interventions

**South — Operational Health**
- Workflow health trends across all departments
- Friction signals from assessments, re-assessments, and implementation outcomes
- Early warning indicators for deteriorating processes

**West — Learning**
- What we've learned from previous interventions
- Which assumptions failed and why
- Pattern library: what works where, updated from every implementation outcome
- Research signals that affect current or planned interventions

### Major Capabilities

- **Living Compass interface** — single screen with four quadrants; each updates dynamically based on assessments, implementations, KPIs, signals, research, feedback, and organizational changes
- **Strategic roadmap** — intervention timeline optimized against portfolio priorities and resource constraints
- **Bottleneck detection** — automated identification of stalled implementations, blocked decisions, resource contention
- **Early warning system** — workflow health deterioration alerts based on re-assessment trends
- **Pattern library** — accumulated organizational knowledge: which intervention paths work in which contexts, updated with every outcome
- **Research integration (continuous)** — external signals automatically evaluated against active recommendations; flagged when a signal would change a recommendation
- **Automated re-assessment triggers** — based on time intervals, organizational changes, or external signals

### Non-Goals

- No autonomous implementation (Compass recommends; humans decide)
- No direct system integration (data enters through assessments, imports, and user input)
- No generic business intelligence platform (Compass focuses on implementation decisions)
- No vendor marketplace
- No multi-enterprise administration (deferred)

### Success Metrics

| Metric | Target |
|--------|--------|
| Daily active users (per organization) | ≥ 3 |
| Strategic roadmap adoption | ≥ 1 intervention roadmap per quarter |
| Early warnings flagged with actionable recommendations | ≥ 5 per quarter |
| Pattern library entries per organization | ≥ 20 |
| V3 metrics maintained or improved | All thresholds holding |

### Demo Story

An operations leader opens Compass and sees the living compass. North shows the current strategic priority: reduce support handle time through AI-assisted triage (estimated 20h/week savings). East shows the implementation is on track — engineering completed the API integration; operations is now training the review team. South shows workflow health improving — ticket deflection is up 15% this month. West surfaces a learning from the Finance implementation last quarter: "Deterministic software for structured workflows achieved 90% of projected savings. Consider same approach for Operations reporting automation."

The leader doesn't need to run an assessment, wait for a report, or consult a dashboard. The living compass tells them what matters, what's working, and what to do next — continuously.

### Architecture Additions

- `living_compass_state` materialized view (four-quadrant state computed from all data sources)
- `early_warning_signals` table (automated alerts with recommended actions)
- `pattern_library` table (accumulated organizational knowledge, versioned)
- `strategic_roadmap` table (current and planned interventions with dependencies)
- Continuous re-assessment scheduler (time-based, event-based, and signal-based triggers)
- Read-optimized living compass API (separate from all other APIs; sub-100ms response target)

### Risk

| Risk | Mitigation |
|------|------------|
| Living compass becomes "just another dashboard" | Core differentiator: it recommends, not just displays; every quadrant has an action |
| Information density too high for non-technical users | Progressive disclosure: C-suite sees North; ops sees all four quadrants; detail available on drill-down |
| Pattern library quality degrades with volume | Automated quality scoring: patterns with confirmed outcomes ranked higher; unconfirmed patterns decay |
| Re-assessment fatigue | Configurable intervals; smart triggering based on change signals rather than calendar |

### What NOT to Build in V4

Autonomous implementation, live system integration, generic BI platform, multi-enterprise administration, vendor marketplace.

---

## Version Dependency Map

```
V1 ──────────────────────────────────────────────
    Assessment pipeline, 6-path comparison,
    ranking, blueprint, persistence

    └── V2 ──────────────────────────────────────
        Recommendation history, outcome tracking,
        feedback, decision log, design partners

        └── V3 ──────────────────────────────────
            Organizational dashboard,
            portfolio prioritization,
            workflow health, cross-project patterns,
            research integration

            └── V4 ──────────────────────────────
                Living compass (4 directions),
                strategic roadmap, early warnings,
                pattern library, continuous guidance
```

Each version requires the previous version's infrastructure. V2 cannot exist without V1's pipeline. V3 cannot exist without V2's feedback and history. V4 cannot exist without V3's organizational view.

---

## Pricing Philosophy

Pricing evolves with the version:

| Version | Pricing Model | Rationale |
|---------|---------------|-----------|
| V1 | Flat monthly (e.g., $1k–$3k/mo) | Single output; limited history |
| V2 | Flat + outcome-based (e.g., $2k–$5k/mo) | Value tied to demonstrated outcomes |
| V3 | Per-organization tiered (e.g., $5k–$15k/mo) | Organization-wide adoption |
| V4 | Enterprise (e.g., $15k–$50k/mo) | Embedded operational system |

Pricing is not finalized. This is a framework for discussion, not a commitment.

---

## Strategic Principles

1. **Do not build V4 in V1.** Each version builds on the previous one. Premature expansion dilutes focus and prevents learning.

2. **V1 succeeds if one recommendation changes one decision.** Not if the demo is polished. Not if the pipeline is fast. Not if the UI is beautiful. One real operational decision changed by a Compass recommendation.

3. **V2 exists to prove the system is more valuable than the recommendation.** If V2 users care more about the history and decision log than any single recommendation, the product has found its long-term value.

4. **V3 exists to prove organizational breadth.** If V3 users check Compass daily to understand the health of their operation, the product has become infrastructure.

5. **V4 exists to make Compass irreplaceable.** If V4 users would reorganize their workflows rather than lose the living compass, the company has a permanent market position.

---

*This roadmap is a living document. It should be reviewed and updated quarterly based on customer feedback, market conditions, and product learning.*
