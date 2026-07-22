# Branching Framework

## Overview

The Branching Framework defines decision trees that determine which questions to ask based on previous answers. Branching ensures the assessment adapts in real-time, probing deeper into areas of interest while skipping irrelevant sections.

---

## Branch Types

### Type 1: Conditional Deep Dive

Triggered when user reports friction or manual process.

```
Q-SALES-01: "How do reps qualify leads?"
  → "Manual research using multiple tools"
    → Q-SALES-01a (deep): "How many hours/week do SDRs spend on research?"
    → Q-SALES-01b (deep): "What tools do they use for research?"
  → "Basic enrichment from CRM"
    → Q-SALES-01a (deep): "What percentage of leads get enriched?"
  → "Automated enrichment and scoring"
    → No deep follow-up (skip)
```

### Type 2: Severity Assessment

Triggered when user indicates a problem exists.

```
Q-SUPP-03: "What is your average time to first response?"
  → "> 4 hours" or "Don't track"
    → Q-SUPP-03a: "What is your biggest support challenge right now?"
    → Q-SUPP-03b: "How many support tickets do you receive per month?"
  → "< 1 hour" or "1-4 hours"
    → Q-SUPP-03a: "What are you doing well in support?"
    → No severity follow-up
```

### Type 3: Capability Check

Triggered when user reports having (or lacking) a specific capability.

```
Q-CS-01: "How is customer health calculated?"
  → "Not formally tracked" or "Spreadsheet with manual data"
    → Q-CS-01a: "Do you see a need for automated health scoring?"
    → Q-CS-01b: "How do you currently identify at-risk accounts?"
  → "Automated health score in CS platform"
    → Q-CS-01c: "How satisfied are you with your health scoring?"
    → Skip Q-CS-02 (health scoring not needed)
```

### Type 4: Contradiction Probe

Triggered when user response contradicts research signals.

```
Hypothesis: "Support response time is slow" (from research)
Q-SUPP-03: "What is your average time to first response?"
  → "< 1 hour" (contradicts research)
    → Q-SUPP-03x: "Interesting — our research suggested response times might be higher. Any recent changes to your support operations?"
    → Flag: Contradiction noted, research may be outdated
```

---

## Decision Tree Format

```yaml
branching:
  questionId: "Q-SALES-01"
  type: "Conditional Deep Dive"
  trigger: 
    condition: "equals"
    value: "Manual research using multiple tools"
  actions:
    - add: 
        questionId: "Q-SALES-DEEP-01"
        text: "What specific tools do your SDRs use for lead research?"
    - add:
        questionId: "Q-SALES-DEEP-02"
        text: "How many hours per week does the average SDR spend on research?"
    - prioritize:
        questions: ["Q-SALES-02", "Q-SALES-03"]
        reason: "High signal value for sales friction hypothesis"
  alternative:
    condition: "equals"
    value: "Automated enrichment and scoring"
    actions:
      - skip: ["Q-SALES-02"]
        reason: "Already has lead qualification automation"
```

---

## Branching Rules

### Rule 1: Maximum Depth

Maximum branch depth is 3 questions. After 3 follow-ups, the branch ends to prevent the assessment from becoming too long.

### Rule 2: Priority Inheritance

Branched questions inherit the priority of their trigger question. If the trigger is high priority, follow-ups are also high priority.

### Rule 3: Evidence Tag Inheritance

Branched questions inherit evidence tags from their parent question, plus add more specific tags.

### Rule 4: Loop Prevention

No question can appear in more than one branch path. If a question is already answered, it cannot be re-asked.

### Rule 5: Optional Follow-ups

Branched questions are marked as "recommended" but not required. Users can skip follow-ups if they don't have the information.

---

## Example Complete Branching Tree

```
Q-SALES-01 (Lead Qualification Method)
├── Manual research
│   ├── Q-SALES-D01 (Hours on research)
│   ├── Q-SALES-D02 (Tools used)
│   └── Prioritize: Q-SALES-02, Q-SALES-03
├── Basic enrichment
│   ├── Q-SALES-D03 (Enrichment coverage)
│   └── Prioritize: Q-SALES-02
├── Automated enrichment
│   └── Skip: Q-SALES-02, Q-SALES-D01, Q-SALES-D02
└── I don't know
    └── Note: Low confidence in this area
```
