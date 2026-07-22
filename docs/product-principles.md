# Compass Product Principles

## Product Hook

**What should we automate next?**

The product earns that hook by sometimes recommending:
- AI;
- deterministic software;
- process redesign;
- human work;
- a hybrid;
- no intervention yet.

## Central Insight

**AI is commoditizing implementation.** As building software becomes cheaper and easier, the scarce resource shifts from implementation to judgment.

Compass operates before implementation.

## Current Product (MVP Boundary)

```
Assessment
↓
AI Opportunity Map
↓
Compare Intervention Paths
↓
Prioritize One Intervention
↓
Implementation Blueprint
```

### Currently Delivered
- Guided organizational assessment across 10 departments
- Business-problem detection (broken handoffs, repetitive decisions, manual synthesis, missing information, high exception volume, duplicated approvals, poor visibility, inconsistent judgment, underused software, training gaps, ownership gaps)
- Six-path intervention comparison (AI, deterministic software, process redesign, human work, hybrid, no action yet)
- Deterministic four-pass prioritization (eligibility → business leverage → readiness → portfolio priority)
- Alternative rejection with explicit reasons and evidence links
- Evidence-traceable explanations
- Escalation classification (5 levels: business configurable → security/legal review)
- Implementation Blueprint with current/future workflow, phases, success metrics, failure modes, and change management plan

### Not Yet Built (Not Claimed)
- Slack or Jira analysis
- Deployment automation
- Continuous system monitoring
- Cross-customer learning
- Portfolio governance
- Outcome measurement
- External integrations

## Product Principles

1. **AI-agnostic, outcome-obsessed.** Every problem is first understood on its own terms before any technology is considered. The goal is the highest-value intervention, not AI adoption.

2. **Understand the problem before selecting technology.** Candidate generation identifies business problems, not merely AI use cases. The comparison engine evaluates all paths equally.

3. **Compare AI with simpler alternatives.** For every qualifying business problem, Compass evaluates deterministic software, process redesign, human work, and hybrid approaches alongside AI. Every selected intervention must explain why alternatives were rejected.

4. **Explain every recommendation.** Every conclusion is traceable to: user-provided evidence, deterministic derivation, documented benchmark, future external research, AI inference, or explicit hypothesis. No explanation may introduce unsupported factual claims.

5. **Keep technical and non-technical users aligned.** The Implementation Blueprint is concrete enough for an implementation team to evaluate yet understandable to a non-technical operations leader. Escalation levels clarify who needs to be involved.

6. **Do not claim future capabilities as current features.** Interfaces support future phases (external integrations, monitoring, portfolio governance) without building them now.

## Four Internal Pillars

- **North — Direction:** Compass tells an operations leader which problem to solve and what type of solution to use, not how to build it.
- **East — Capability:** The engine evaluates all intervention types deterministically. An LLM helps structure ambiguous assessment text but never assigns the final rank or selected intervention.
- **South — Visibility:** Every recommendation includes the evidence for it, the evidence against alternatives, the assumptions it depends on, and the missing evidence.
- **West — Learning:** Each deployment generates training data for future path-suitability calibration. The four-pass scores are designed to be compared across runs.
