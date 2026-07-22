# Opportunity Explanation Framework

## Overview

Compass generates three audience-specific variants of each opportunity explanation. All variants share a common 6-part structure but differ in depth, language, and emphasis.

---

## Common 6-Part Structure

Every opportunity explanation follows this structure:

| Part | Content | Purpose |
|------|---------|---------|
| 1. Signal | What operational signal was detected | Establishes the observation |
| 2. Pattern | Which blueprint pattern matched | Connects observation to known patterns |
| 3. Opportunity | The recommended AI application | States the recommendation |
| 4. Evidence | Supporting evidence with classes and confidence | Proves the recommendation is grounded |
| 5. Confidence | Confidence level and dimension breakdown | Communicates certainty |
| 6. Action | Recommended next steps | Drives action |

---

## Audience Variants

### Executive Variant

**Audience**: CEO, Board Members, VP-level

**Purpose**: Enable strategic decision-making. Provide enough context to approve or defer.

**Characteristics**:
- 1 page per opportunity (max)
- Strategic language, minimal technical detail
- Focus on business impact and resource requirements
- Clear "recommend / do not recommend" framing

**Example**:

```
# Sales Lead Qualification Automation

## Signal
Our assessment shows that SDRs spend approximately 60% of their time on
lead research rather than actual selling. At your current team size of
15 SDRs, this represents roughly 375 hours per week of non-selling activity.

## Pattern
This is consistent with pattern BP-SALES-01, observed across growth-stage
B2B SaaS companies scaling from 50 to 200+ employees. Organizations at
this stage typically experience lead qualification as their top sales bottleneck.

## Opportunity
Deploy an AI lead enrichment and scoring agent that automates lead research,
ICP scoring, and routing. Estimated to recover 60-70% of SDR research time
for selling activity.

## Evidence
[User] VP of Sales confirmed manual research process and time allocation
[Research] 12 recent SDR job postings confirm scaling pressure
[Inference] Pattern BP-SALES-01 has 91% match score with your profile

## Confidence: HIGH
Strong evidence convergence across all three evidence classes.

## Recommended Action
Proceed with implementation planning. Estimated 4-6 weeks engineering
effort, 2 weeks change management. Recommend including this in Q3 roadmap.
```

### Technical Variant

**Audience**: CTO, Engineering Leads, Architects

**Purpose**: Enable implementation planning. Provide technical details, system impacts, and engineering considerations.

**Characteristics**:
- 2-3 pages per opportunity
- Technical language, system references
- Focus on architecture, integration, dependencies
- Includes effort estimates and technical risks

**Example**:

```
# Sales Lead Qualification Automation — Technical Deep-Dive

## Signal
Assessment response Q-SALES-01: "Manual research using multiple tools"
Assessment response Q-SALES-02: Scale 4/5 (15+ hrs/week on research)

## Pattern Match: BP-SALES-01 (Score: 0.91)
Systems matched: Salesforce, HubSpot, ZoomInfo, Outreach

## Implementation Architecture

[Current State]
Inbound Lead → HubSpot → SDR opens SFDC → Opens ZoomInfo → Manual research
  → Updates SFDC fields → Manual ICP scoring → Manual routing → Outreach sequence

[Target State]
Inbound Lead → HubSpot → AI Enrichment Agent (enriches from ZoomInfo + web)
  → AI ICP Scoring (rule-based + ML) → AI Routing (by territory/fit/availability)
  → Auto-populate SFDC → SDR receives qualified lead with research brief

## Integration Points
1. HubSpot → AI Agent (webhook on new lead creation)
2. AI Agent → ZoomInfo API (enrichment)
3. AI Agent → Salesforce API (field updates, lead conversion)
4. AI Agent → Outreach API (sequence enrollment)

## Dependencies
- Prerequisite: Salesforce field standardization (est. 1 week)
- Concurrent: None
- Enables: Intelligent Deal Forecasting (BP-SALES-02)

## Effort Estimate
- AI enrichment agent: 3 weeks (1 engineer)
- Scoring logic implementation: 1 week
- Routing logic: 1 week
- Integration testing: 1 week
- Change management: 2 weeks (SDR training, playbook updates)
Total: 6 weeks engineering, 2 weeks change management

## Technical Risks
1. ZoomInfo API rate limits (mitigation: caching, batch processing)
2. Salesforce API limits (mitigation: async processing)
3. ICP scoring accuracy (mitigation: monitor, manual override for first month)

## Edge Cases
- Unknown company in enrichment: flag for manual review
- Lead from untracked source: route based on minimal data with low confidence flag
- Duplicate lead detection: merge with existing record
```

### Operational Variant

**Audience**: VP Operations, Department Heads, Process Owners

**Purpose**: Enable execution planning. Provide process changes, team impacts, and implementation steps.

**Characteristics**:
- 1-2 pages per opportunity
- Process language, workflow references
- Focus on people, process, and workflow changes
- Includes timeline and success metrics

**Example**:

```
# Sales Lead Qualification Automation — Operational Plan

## Signal
Sales team currently spends 60% of time on lead research (15 SDRs × 25 hrs
research = 375 hrs/week). This is your highest-identified operational friction point.

## Pattern: BP-SALES-01
Standard for B2B SaaS companies scaling from 50 to 200+ employees.

## What Changes

### Before
1. Lead arrives in HubSpot
2. SDR checks HubSpot → Opens SFDC → Opens ZoomInfo
3. SDR manually researches company (15-30 min)
4. SDR scores lead using personal judgment
5. SDR manually routes to appropriate AE
6. SDR writes personalized email

### After
1. Lead arrives in HubSpot
2. AI Agent enriches, scores, and routes (30 seconds)
3. SDR receives qualified lead with research brief
4. SDR reviews and sends personalized email
5. SDR spends saved time on selling activities

## Team Impact
- SDRs: Shift from 60% research / 40% selling → 20% research / 80% selling
- No headcount reduction: redeploy SDR capacity to higher-value activities
- Sales Ops: Less manual monitoring, more strategic optimization

## Success Metrics
| Metric | Before | Target (60 days) |
|--------|--------|-------------------|
| Lead response time | 4+ hours | < 30 min |
| SDR selling time | 40% | 70%+ |
| Lead-to-opportunity rate | 25% | 40%+ |

## Implementation Schedule
Week 1:  Tool audit and Salesforce field standardization
Week 2:  AI agent configuration and integration setup
Week 3:  Scoring and routing logic implementation
Week 4:  Testing and SDR training
Week 5:  Soft launch (50% of leads routed via AI)
Week 6:  Full rollout and monitoring dashboard

## Change Management
- Week 3: SDR training session (1 hour)
- Week 4: Playbook updates and FAQ document
- Week 5: Office hours for questions and feedback
- Week 6: Retrospective and adjustments
```
