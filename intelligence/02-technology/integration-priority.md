# Integration Priority Framework

## Overview

The Integration Priority Framework determines which system integrations Compass should recommend for a given company. It balances value creation against implementation effort to produce a prioritized integration roadmap.

---

## Priority Scoring

Each potential integration is scored on two axes:

### Value Score (1-10)

| Factor | Weight | Description |
|--------|--------|-------------|
| AI Enablement | 30% | Does this integration directly enable an AI opportunity? |
| Data Unlock | 25% | Does this integration make previously siloed data accessible? |
| Friction Reduction | 20% | Does this integration reduce manual work or errors? |
| Cross-Dept Impact | 15% | How many departments benefit from this integration? |
| Strategic Alignment | 10% | Does this support executive priorities? |

### Effort Score (1-10, higher = more effort)

| Factor | Weight | Description |
|--------|--------|-------------|
| API Availability | 30% | Does the system have a public API? |
| Auth Complexity | 20% | OAuth, SSO, API keys, or custom auth? |
| Data Mapping | 20% | How complex is the data transformation? |
| Maintenance Burden | 15% | Will this integration require ongoing maintenance? |
| Dependency Chain | 15% | Does this depend on other integrations first? |

### Priority Calculation

```
Priority = Value Score - Effort Score
(-9 to +9 range)

High Priority:      +6 to +9
Medium Priority:    +2 to +5
Low Priority:       -2 to +1
Skip:               -9 to -3
```

---

## Integration Patterns

### Pattern 1: CRM ↔ Support (High Priority)

**Why**: Unified customer view. Support sees sales context, sales sees support issues.

**Example**: Salesforce ↔ Zendesk

**Value**: 8/10 (reduces context switching, improves response quality)
**Effort**: 2/10 (standard APIs, many pre-built connectors)
**Priority**: High

### Pattern 2: CRM ↔ Communication (Medium Priority)

**Why**: Deal updates in Slack, activity logging from emails.

**Example**: Salesforce ↔ Slack

**Value**: 5/10 (convenient, but not transformative)
**Effort**: 1/10 (native integrations)
**Priority**: Medium

### Pattern 3: Data Warehouse ↔ Analytics (Medium-High Priority)

**Why**: Enables data-driven decision making across departments.

**Example**: Snowflake ↔ Tableau

**Value**: 7/10 (unlocks analytics)
**Effort**: 3/10 (ODBC/JDBC, standard)
**Priority**: High

### Pattern 4: HRIS ↔ Identity (High Priority)

**Why**: Automated user provisioning and deprovisioning.

**Example**: Workday ↔ Okta

**Value**: 7/10 (security + efficiency)
**Effort**: 3/10 (SCIM standard)
**Priority**: High

### Pattern 5: ERP ↔ Billing (Medium Priority)

**Why**: Automated revenue reconciliation.

**Example**: NetSuite ↔ Stripe

**Value**: 6/10 (saves 3+ days of manual reconciliation)
**Effort**: 4/10 (custom mapping needed)
**Priority**: Medium

---

## System Dependency Map

```
[CRM Salesforce]
  ├── [Support Zendesk] — High priority
  ├── [Marketing HubSpot] — High priority
  ├── [Communication Slack] — Medium priority
  └── [Data Warehouse Snowflake] — Medium priority

[HRIS Workday]
  └── [Identity Okta] — High priority
  └── [Communication Slack] — Low priority

[Engineering GitHub]
  ├── [Engineering Jira] — High priority (PR ↔ Ticket)
  └── [Communication Slack] — Medium priority (deploy notifications)

[ERP NetSuite]
  └── [Billing Stripe] — Medium priority
  └── [Data Warehouse Snowflake] — High priority (financial reporting)

[Data Warehouse Snowflake]
  ├── [Analytics Tableau] — High priority
  ├── [CRM Salesforce] — Medium priority
  └── [Product Analytics Mixpanel] — Medium priority
```

---

## Integration Sequencing

### Phase 1: Foundation (Weeks 1-4)

High-priority integrations that enable AI opportunities:
1. CRM ↔ Support (customer view)
2. HRIS ↔ Identity (provisioning automation)
3. Data Warehouse ↔ Analytics (reporting automation)

### Phase 2: Enablement (Weeks 4-8)

Integrations that prepare data for AI:
1. CRM ↔ Data Warehouse (sales analytics pipeline)
2. Support ↔ Data Warehouse (support analytics)

### Phase 3: Optimization (Weeks 8-12)

Remaining medium-priority integrations:
1. CRM ↔ Communication (sales alerts)
2. Engineering ↔ Communication (deploy notifications)

---

## Integration Anti-Patterns (Skip or Delay)

| Pattern | Reason |
|---------|--------|
| Legacy system → Modern system (high effort, low value) | Effort > value until legacy system replaced |
| Two systems with overlapping functions | Consolidation is better than integration |
| System with no API or webhook | Requires scraping or manual export |
| System being actively replaced | Wait for migration to complete |
| Single-user tool (personal CRM, individual analytics) | Not worth enterprise integration effort |
