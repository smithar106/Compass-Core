# Ranking Algorithm: 4-Pass Tier-Based

## Overview

Compass uses a **4-pass tier-based ranking algorithm** to rank AI opportunities. This algorithm explicitly avoids weighted averages, composite scores, or any form of numerical scoring that creates false precision.

Each pass uses binary or categorical criteria to either eliminate opportunities or assign them to tiers.

---

## Algorithm Philosophy

**Why not weighted scoring?**
- Weighted scores imply a precision that doesn't exist in opportunity assessment
- Scores are difficult to explain to stakeholders
- Small weight changes can produce disproportionate ranking changes
- Scores hide the reasoning behind a recommendation

**Why tier-based ranking?**
- Tiers are transparent: stakeholders can see why an opportunity is Tier 1 vs. Tier 4
- Binary criteria force explicit decision-making about what matters
- Tiers communicate actionable differences (Tier 1 = do now, Tier 4 = monitor)

---

## Pass 1: Feasibility Filter

**Purpose**: Remove opportunities that are technically or organizationally infeasible.

### Criteria

| Criteria | Pass Condition | Fail Condition |
|----------|---------------|----------------|
| Technical Feasibility | Required systems exist or acquirable | Required systems don't exist and cannot be acquired |
| Data Availability | Required data exists in usable form | Required data is unavailable or unusable |
| Compliance Feasibility | AI application is compliant with regulations | AI application violates regulatory constraints |
| Organizational Readiness | Organization can support the change | Organization has proven inability to adopt such changes |
| Resource Availability | Budget and talent exist or are acquirable | No path to acquire necessary resources |

### Behavior
- **Fail any criterion**: Opportunity removed from consideration (excluded from all tiers)
- **Pass all criteria**: Proceed to Pass 2
- **Borderline**: Flag as conditional; proceed to Pass 2 with note

### Output
- Surviving Opportunities (infeasible removed)
- Feasibility Flags per Opportunity

---

## Pass 2: Impact Estimation

**Purpose**: Assess the magnitude of operational leverage each opportunity creates.

### Criteria

**Impact is assessed along three dimensions, each rated High/Medium/Low:**

#### Dimension 1: Operational Leverage
| Rating | Description |
|--------|-------------|
| High | Eliminates significant manual work, reduces cycle time by >50%, or enables new capability |
| Medium | Reduces manual work or cycle time by 20-50% |
| Low | Incremental improvement (<20%) |

#### Dimension 2: Scope of Impact
| Rating | Description |
|--------|-------------|
| High | Affects 3+ departments or entire company |
| Medium | Affects 1-2 departments |
| Low | Affects a single team or individual workflow |

#### Dimension 3: Strategic Value
| Rating | Description |
|--------|-------------|
| High | Directly addresses a stated executive priority |
| Medium | Indirectly supports a strategic priority |
| Low | No clear connection to strategic priorities |

### Behavior
- **All three High**: Tier 1 candidate
- **At least one High, rest Medium**: Tier 2 candidate
- **All Medium or mixed Low/Medium**: Tier 3 candidate
- **Any Low**: Tier 4 candidate

### Output
- Impact-Assessed Opportunities
- Impact Ratings per Dimension
- Provisional Tier Assignment

---

## Pass 3: Dependency Ordering

**Purpose**: Analyze dependency relationships and adjust tier assignments based on sequencing needs.

### Dependency Types

| Type | Description | Effect on Tier |
|------|-------------|----------------|
| Prerequisite | Opportunity A must be completed before Opportunity B | A moves up, B stays |
| Blocking | Opportunity A cannot start until external constraint resolved | A may move down |
| Concurrent | Opportunities A and B can proceed independently | No tier change |
| Synergistic | Opportunities A and B together create more value than separate | Both may move up |

### Rules
1. **Prerequisite opportunities** are promoted one tier (if not already Tier 1)
2. **Block-dependent opportunities** are demoted one tier (unless Tier 4)
3. **Synergistic opportunity groups** are promoted one tier as a package
4. **No dependency** → no tier change

### Example
```
Opportunity A: CRM Data Quality (Tier 2, prerequisite for B)
Opportunity B: Automated Lead Qualification (Tier 1)
→ After Pass 3: A promoted to Tier 1 (prerequisite), B stays Tier 1
```

### Output
- Dependency-Adjusted Tiers
- Dependency Map (visualization of relationships)
- Implementation Sequence Recommendations

---

## Pass 4: Strategic Alignment

**Purpose**: Final adjustment based on alignment with executive priorities.

### Criteria

Score each opportunity against identified executive priorities:

| Alignment | Description |
|-----------|-------------|
| Direct | Opportunity directly addresses stated priority |
| Indirect | Opportunity supports priority indirectly |
| Neutral | No clear connection |
| Misaligned | Opportunity conflicts with current priority |

### Rules
- **Direct alignment**: If currently Tier 2, promote to Tier 1; if Tier 3, promote to Tier 2
- **Misaligned**: If currently Tier 2, demote to Tier 3; if Tier 1, demote to Tier 2
- **Neutral or Indirect**: No change

### Output
- Final Tier Assignment
- Strategic Alignment Notes (why each opportunity was adjusted or not)

---

## Tier Definitions

| Tier | Label | Definition | Presentation |
|------|-------|------------|--------------|
| 1 | Highest Priority | High feasibility, High impact, Blocking dependency, or Directly strategic | Featured, immediate action recommended |
| 2 | High Priority | Feasible, Medium-High impact, Some dependencies | Detailed cards, short-term plan |
| 3 | Worth Exploring | Feasible, Medium impact, No strategic alignment | Expandable list, medium-term consideration |
| 4 | Monitor | Feasible but Low impact or Low confidence | Reference list, revisit quarterly |

---

## Within-Tier Sorting

Within each tier, opportunities are sorted by:
1. **Implementation speed** (Quick Wins first)
2. **Confidence** (higher confidence first)
3. **Evidence diversity** (more evidence classes better)
4. **Dependency position** (prerequisites before dependents)

---

## Algorithm Pseudocode

```
function rankOpportunities(opportunities, company):
    # Pass 1: Feasibility Filter
    survivors = []
    for opp in opportunities:
        if isFeasible(opp, company):
            survivors.append(opp)
    
    # Pass 2: Impact Estimation
    for opp in survivors:
        opp.impactLeverage = assessOperationalLeverage(opp, company)
        opp.impactScope = assessScope(opp, company)
        opp.impactStrategic = assessStrategicValue(opp, company)
        opp.provisionalTier = calculateProvisionalTier(opp)
    
    # Pass 3: Dependency Ordering
    dependencyGraph = buildDependencyGraph(survivors)
    for opp in survivors:
        opp.finalTier = applyDependencyAdjustment(opp, dependencyGraph)
    
    # Pass 4: Strategic Alignment
    for opp in survivors:
        alignment = assessStrategicAlignment(opp, company.priorities)
        opp.finalTier = applyStrategicAdjustment(opp, alignment)
    
    # Sort within tiers
    return sortWithinTiers(survivors)
```
