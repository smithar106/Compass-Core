# Adaptive Question Engine

## Overview

The Adaptive Assessment Agent modifies the 25-question assessment based on all available profiles and hypotheses. Every company receives a different assessment — questions are skipped, branched, deepened, or prioritized based on the company's specific context.

---

## Inputs

| Input | Source |
|-------|--------|
| Company Profile | Company Intelligence Agent |
| Technology Profile | Technology Intelligence Agent |
| Industry Profile | Industry Intelligence Agent |
| Pre-Assessment Hypotheses | Hypothesis Agent |
| Knowledge Graph | Graph Builder (if available) |
| Base Question Set | questions.json (25 questions) |

---

## Outputs

| Output | Description |
|--------|-------------|
| Personalized Question Set | Adapted questions with branching logic |
| Question Priority Score | Which questions are most important for this company |
| Skip Rationale | Why certain questions were skipped |
| Depth Rationale | Why certain questions were deepened |

---

## Personalization Logic

### Rule 1: Skip Irrelevant Departments

If a company lacks a department or the department is too small to assess, skip that department's questions.

**Example**: Company has no legal team (10 people, bootstrapped) → Skip all Q-LEGAL-* questions.

### Rule 2: Deepen High-Signal Areas

If pre-assessment hypotheses indicate high friction in an area, ask additional probing questions.

**Example**: Stage + Tech + Industry all point to sales friction → Keep all Sales questions AND ask follow-ups.

### Rule 3: Branch Based on Prior Answers

Use previous answers to determine which questions to ask next.

**Example**: User answers "Manual" to Q-FIN-01 → Ask Q-FIN-02 (reconciliation time). If "Automated" → Skip Q-FIN-02.

### Rule 4: Challenge Assumptions

If research signals contradict likely user responses, add probes to reconcile.

**Example**: Research shows high churn but company says "no churn issue" → Ask for specific churn rate, flag contradiction.

### Rule 5: Prioritize by Signal Value

Questions with higher signal value for this specific company are asked first and with higher weight.

**Example**: For a company with strong sales friction signals, Sales questions appear early in the assessment.

### Rule 6: Reduce Length

Every question must earn its place. If a question provides low signal value for this specific company, it's skipped.

**Example**: Company has Scale 1-2 on all HR assessment + no HR research signals → Skip HR questions (low signal value).

---

## Question Modification Types

| Modification | Description | Example |
|-------------|-------------|---------|
| Skip | Question removed entirely | No Legal dept → Skip Legal questions |
| Keep | Question asked as-is | High sales friction → Keep all Sales questions |
| Deepen | Additional follow-up question added | Manual lead qualification → "What tools do SDRs use?" |
| Branch | Question gated behind prior answer | Manual AP → Ask about reconciliation time |
| Rephrase | Question wording adjusted for context | Generic → Company-specific language |
| Prioritize | Question moved earlier in assessment | High-value question → Position 1-5 |

---

## Personalization Algorithm

```
function personalizeQuestions(baseQuestions, companyProfile, hypotheses):
    personalized = []
    
    for question in baseQuestions:
        # 1. Department relevance check
        if question.section not in companyProfile.departments:
            skip(question, "Department not present")
            continue
        
        # 2. Hypothesis alignment
        matchingHypotheses = findMatchingHypotheses(question, hypotheses)
        if matchingHypotheses is empty AND question.priority == "low":
            skip(question, "Low signal value for this company")
            continue
        
        # 3. Depth check
        if any(h.confidence == "High" for h in matchingHypotheses):
            deepenedQuestions = generateDepthQuestions(question)
            personalized.extend(deepenedQuestions)
        
        # 4. Branching
        if question.branching:
            branchLogic = buildBranch(question, companyProfile)
            question.branching = branchLogic
        
        # 5. Prioritize
        question.priorityScore = calculatePriority(question, companyProfile, hypotheses)
        
        personalized.append(question)
    
    # Sort by priority score (highest first)
    return sortByPriority(personalized)
```

---

## Edge Cases

### Company Has No Research Data

- Cannot personalize based on research signals
- Fall back to stage-based personalization
- All questions asked (no skipping)
- Questions asked in default order

### Company Is Very Large (2000+ Employees)

- More questions relevant (all departments expected)
- Focus on cross-department questions
- Deepen questions about organizational complexity

### Company Is Very Small (< 50 Employees)

- Fewer questions relevant (missing departments)
- Focus on product and sales questions
- Skip HR, Legal, Ops questions

### User Is Not VP Ops (Different Persona)

- Adjust question framing if possible
- Ask about department-specific areas they know
- Skip questions they can't answer (flag for follow-up)
