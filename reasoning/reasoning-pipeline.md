# Reasoning Pipeline

## Overview

The Reasoning Pipeline processes company and assessment data through 8 sequential stages. Each stage produces intermediate artifacts that feed into subsequent stages.

---

## Stage 1: Intake

**Purpose**: Validate and normalize all inputs into a standard internal representation.

### Inputs
- Company Profile (required)
- Technology Profile (optional)
- Industry Profile (required)
- Workflow Map (optional)
- Assessment Responses (optional)
- Pre-Assessment Hypotheses (optional)
- Knowledge Graph (optional)

### Process
1. Validate each input against its schema
2. Normalize data formats and field names
3. Merge overlapping information (e.g., company size from multiple sources)
4. Resolve conflicts using evidence class precedence ([User] > [Research] > [Inference])
5. Flag missing data that reduces confidence

### Outputs
- Normalized Company Record
- Data Completeness Score (what % of expected data is available)
- Data Quality Flags (conflicts, gaps, staleness)

### Edge Cases
- **Missing profile**: Pipeline cannot proceed beyond Stage 1. Return error.
- **Partial assessment**: Flag missing departments as "no user evidence" — proceed with reduced confidence.
- **Conflicting data**: Record both versions, note conflict, use [User] precedence.

---

## Stage 2: Signal Extraction

**Purpose**: Extract discrete signals from all inputs and classify them by signal family.

### Inputs
- Normalized Company Record (from Stage 1)

### Process
1. Parse each input for known signal patterns
2. Classify each signal into one of 9 signal families (see signal-map.md)
3. Tag each signal with evidence class: [User], [Research], [Inference]
4. Score each signal: strength (1-5), freshness (hours since detection), uniqueness
5. Group related signals into signal clusters

### Signal Extraction Rules

| Input Type | Extraction Method | Example |
|-----------|------------------|---------|
| Assessment response | Direct mapping | Q-SUPP-01 answer "Manual triage" → SU-01 signal |
| Company profile field | Direct mapping | headcountEstimate=400 → GR-01 signal |
| Research text | NLP extraction | CEO quote "operational excellence" → ST-01 signal |
| Technology inference | Pattern matching | Salesforce + Outreach → Sales tech maturity signal |
| Blueprint comparison | Score calculation | High match score on BP-SALES-01 → Sales friction signal |

### Outputs
- Signal Inventory (list of all extracted signals)
- Signal Clusters (related signals grouped by theme)
- Signal Strength Map (which signals are strongest)

### Edge Cases
- **Weak signals**: Signals below strength threshold are stored but not used for pattern matching.
- **Contradictory signals**: Signals that directly contradict each other (e.g., "AI-ready" vs "no AI tools") are flagged for conflict resolution.
- **Signal saturation**: Too many signals in one area → aggregate into composite signal.

---

## Stage 3: Pattern Matching

**Purpose**: Match extracted signals against the Blueprint Library to identify relevant workflow patterns.

### Inputs
- Signal Inventory (from Stage 2)
- Blueprint Library (50 blueprints)
- Signal Clusters (from Stage 2)

### Process
1. For each blueprint, calculate a match score against the signal inventory
2. Match dimensions:
   - **Department overlap**: Does the company have the department?
   - **Signal coverage**: How many of the blueprint's typical signals are present?
   - **Friction alignment**: Does the company's friction profile match the blueprint's pain points?
   - **Stage alignment**: Is the company at the right growth stage for this blueprint?
   - **Tech alignment**: Does the company have the prerequisite systems?
3. Score range: 0.0 (no match) to 1.0 (perfect match)
4. Threshold: Only blueprints with score >= 0.4 proceed to Stage 4

### Pattern Matching Algorithm

```
matchScore(blueprint, company) = 
  0.30 * departmentOverlap +
  0.25 * signalCoverage +
  0.20 * frictionAlignment +
  0.15 * stageAlignment +
  0.10 * techAlignment
```

Note: These weights are used only for pattern matching scoring, not for ranking. Ranking uses the 4-pass tier-based algorithm.

### Outputs
- Ranked Blueprint Matches (score >= 0.4)
- Match Explanations (which signals contributed to each match)
- Match Quality Indicators (confidence in each match)

### Edge Cases
- **No matches above threshold**: Generate "custom" opportunities from strongest signals without blueprint pattern.
- **Too many matches**: Take top 10 by match score; if cluster of similar matches, pick highest.
- **Department missing**: Blueprints for missing departments are automatically excluded.

---

## Stage 4: Constraint Evaluation

**Purpose**: Evaluate organizational constraints that affect opportunity feasibility, removing or modifying opportunities that are not viable.

### Inputs
- Ranked Blueprint Matches (from Stage 3)
- Company Profile (constraints section)
- Compliance Profile
- Resource Availability Assessment

### Process
1. For each matched blueprint, evaluate against constraints:
   - **Technical constraints**: Does the tech stack support this? (e.g., no data warehouse → data-heavy AI is harder)
   - **Compliance constraints**: Does regulation restrict this AI application? (e.g., HIPAA limits data processing)
   - **Resource constraints**: Does the company have budget and talent?
   - **Organizational constraints**: Would the org structure block this? (e.g., centralized IT approval bottleneck)
   - **Cultural constraints**: Is the organization ready for this change?
2. Classify each opportunity:
   - **Feasible**: No blocking constraints
   - **Conditional**: Feasible if constraints are resolved first
   - **Infeasible**: Blocking constraints, remove from pipeline

### Constraint Severity

| Severity | Effect | Action |
|----------|--------|--------|
| Critical | Cannot be overcome | Remove opportunity |
| Major | Significant blocker but solvable | Flag as prerequisite, adjust confidence |
| Minor | Manageable with planning | Note in implementation blueprint |

### Outputs
- Filtered Opportunity Candidates (infeasible removed)
- Constraint Flags per Opportunity (resolved constraints documented)
- Prerequisite Constraints (constraints that need resolution before implementation)

### Edge Cases
- **All opportunities filtered**: Reduce constraint thresholds, generate lighter opportunities.
- **False constraints**: If constraint evidence is low confidence, flag as tentative and proceed.

---

## Stage 5: Opportunity Generation

**Purpose**: Convert matched blueprints into concrete, organization-specific AI opportunities.

### Inputs
- Filtered Opportunity Candidates (from Stage 4)
- Company Profile
- Technology Profile
- Signal Inventory

### Process
1. For each matched blueprint, generate a specific opportunity:
   - **Description**: Organization-specific version of the blueprint
   - **Scope**: Systems, workflows, and people affected
   - **Implementation considerations**: What makes this unique for this org
   - **Evidence summary**: Which signals drove this match
2. Cross-reference with other opportunities for:
   - **Dependencies**: Does this opportunity enable or require others?
   - **Conflicts**: Does this opportunity conflict with others?
   - **Synergies**: Can this be combined with others for greater impact?

### Opportunity Structure

Each opportunity contains:
- `id`: Unique identifier
- `title`: Human-readable name
- `department`: Primary owning department
- `description`: Organization-specific description
- `matchedBlueprint`: Reference to blueprint ID
- `matchScore`: Pattern matching score
- `affectedSystems`: List of systems involved
- `affectedWorkflows`: List of workflows involved
- `estimatedScope`: Implementation effort estimate
- `evidenceSummary`: Count and type of evidence
- `constraints`: Applicable constraints and their status
- `dependencies`: Prerequisite, blocking, and concurrent relationships
- `implementationStrategy`: Quick Win | Foundational | Package Deal | Phased | Conditional

### Outputs
- AI Opportunity Candidates (unsorted, unconficenced)
- Dependency Graph (relationships between opportunities)
- Implementation Strategy Suggestions

### Edge Cases
- **Overlapping opportunities**: Merge into composite opportunity (e.g., "Sales Efficiency Package").
- **No dependencies**: Mark with empty dependency list.
- **Inconsistent scope**: If multiple blueprints suggest different scopes for same area, take average.

---

## Stage 6: Ranking (4-Pass)

**Purpose**: Rank opportunities using the 4-pass tier-based algorithm. (See `ranking-algorithm.md` for full details.)

### Process
1. **Pass 1: Feasibility Filter** — Remove technically or organizationally infeasible opportunities
2. **Pass 2: Impact Estimation** — Assess operational leverage magnitude
3. **Pass 3: Dependency Ordering** — Identify prerequisites and blockers
4. **Pass 4: Strategic Alignment** — Score against executive priorities

### Outputs
- Tier-Assigned Opportunities (Tier 1-4)
- Pass-by-Pass Reasoning for each opportunity's tier assignment

---

## Stage 7: Confidence Scoring

**Purpose**: Assess confidence in each opportunity across 5 evidence dimensions. (See `confidence-framework.md` for full details.)

### Process
1. For each opportunity, assess:
   - Source Authority
   - Data Freshness
   - Directness
   - Consistency
   - Specificity
2. Assign overall confidence: Confirmed | High | Medium | Low
3. Document confidence reasoning for transparency

### Outputs
- Confidence-Assessed Opportunities
- Confidence Reports per Opportunity
- Confidence Dashboard (overall assessment quality)

---

## Stage 8: Explanation Synthesis

**Purpose**: Transform technical pipeline outputs into audience-specific explanations and reports.

### Process
1. For each opportunity, build the 6-part explanation structure:
   - **Signal**: What we observed
   - **Pattern**: Which blueprint matched
   - **Opportunity**: What we recommend
   - **Evidence**: Supporting evidence with classes
   - **Confidence**: Confidence level with reasoning
   - **Action**: What to do next
2. Generate audience-specific variants (see `opportunity-explanation-framework.md`):
   - **Executive**: Strategic, 1-page, decision-focused
   - **Technical**: Detailed, system-oriented, implementation-focused
   - **Operational**: Process-focused, team-oriented, action-focused

### Outputs
- AI Opportunity Map (executive summary)
- Implementation Blueprint (technical)
- Operational Action Plan (operational)
- Full Reasoning Report (audit trail)
