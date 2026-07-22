# Simulation Engine

## Overview

The Compass Simulation Engine tests the reasoning pipeline against synthetic company profiles to validate output quality, edge case handling, and pipeline robustness. Simulations are not for external use — they are an internal quality assurance tool.

---

## Purpose

1. **Pipeline validation**: Verify that the reasoning pipeline produces correct outputs for known inputs
2. **Edge case testing**: Test scenarios that are rare in production but important to handle correctly
3. **Regression testing**: Ensure pipeline changes don't break existing reasoning paths
4. **Blueprint coverage**: Verify that all 50 blueprints can be matched by some synthetic profile
5. **Confidence calibration**: Ensure confidence levels map correctly to evidence quality

---

## Engine Architecture

```
Simulation Runner
├── Profile Generator
│   ├── Company Profile Generator
│   ├── Technology Profile Generator
│   ├── Industry Profile Generator
│   └── Assessment Response Generator
├── Scenario Library
│   ├── Known Company Scenarios
│   ├── Edge Case Scenarios
│   └── Stress Test Scenarios
└── Validation Suite
    ├── Output Structure Validator
    ├── Evidence Trace Validator
    ├── Ranking Validator
    └── Confidence Validator
```

---

## Profile Generator

### Company Profile Generator

Generates synthetic company profiles with controlled properties:

**Configurable Parameters**:
- Company size (50-5000 employees)
- Revenue stage (Seed to Mature)
- Industry vertical
- Departments (which exist, sizes)
- Tech stack (which tools, categories)
- Org complexity (flat/hierarchical/matrix)
- AI maturity (None to Leading)
- Change capacity (Low to High)

**Generation Approach**:
1. Select parameter values from configurable ranges
2. Generate realistic company name and description
3. Populate profile fields with parameter-consistent values
4. Add random variation within parameter bounds

### Technology Profile Generator

Generates synthetic tech stacks:

**Configurable Parameters**:
- CRM (Salesforce, HubSpot, Pipedrive, etc.)
- Support (Zendesk, Intercom, Freshdesk, etc.)
- HRIS (Workday, BambooHR, Rippling, etc.)
- Engineering tools (GitHub, GitLab, Jira, Linear, etc.)
- Cloud provider
- Data warehouse
- Communication tools

**Generation Approach**:
1. Select primary and secondary tools for each category
2. Set integration level (none, basic, deep)
3. Generate confidence based on detection simulation

### Assessment Response Generator

Generates synthetic assessment responses:

**Configurable Parameters**:
- Friction levels per department (Low/Medium/High)
- Truthfulness (how honest the synthetic user is)
- Completeness (how many questions answered)
- Confidence (how confident the synthetic user is)

**Generation Approach**:
1. For each question, select answer based on department friction settings
2. Add variation (truthfulness parameter controls how consistently)
3. Generate open responses from templates
4. Mark some questions as skipped based on completeness

---

## Simulation Modes

### Deterministic Mode

Same inputs always produce same outputs. Used for regression testing.

### Randomized Mode

Adds controlled randomness to test pipeline robustness. Used for stress testing.

### Adversarial Mode

Generates inputs designed to break the pipeline (conflicting data, missing data, extreme values). Used for edge case testing.

---

## Validation Suite

### Output Structure Validator

Verifies that pipeline outputs conform to expected schemas:
- AI Opportunity Map has required fields
- Implementation Blueprint has required sections
- Confidence reports have all 5 dimensions

### Evidence Trace Validator

Verifies that every claim in the output traces to specific input evidence:
- Every opportunity cites at least one evidence item
- Evidence classes are correctly tagged
- Evidence references are valid

### Ranking Validator

Verifies that ranking follows algorithm rules:
- No weighted averages used
- Tier assignments follow 4-pass criteria
- Dependency ordering is correct
- Strategic alignment adjustments are documented

### Confidence Validator

Verifies that confidence levels match evidence quality:
- Single evidence class → max Medium
- Two classes → max High
- Three classes → max Confirmed
- Evidence count thresholds respected
- Conflict penalties applied
