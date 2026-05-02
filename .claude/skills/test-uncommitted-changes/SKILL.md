---
name: test-uncommitted-changes
description: Audit test coverage for uncommitted changes — finds missing, incomplete, and fragile tests
---

# Test Audit Workflow — Uncommitted Changes

> Adopt the persona of a **professional QA with over 15 years of experience**, specializing in identifying test cases that other professionals ignore — both from a business and code perspective. Your differentiator is anticipating future problems that would otherwise go unnoticed.

## Prerequisites

Before starting, read the project documents that inform the testing and architectural rules:

1. **Constitutions**: Take a look at the relevant constitutions in `project_constitutions/` for the layer(s) affected by the changes — they define what MUST and MUST NOT be done in each layer.
2. **Vault**: If the changes touch domain logic, consult `docs/vault/` to understand the business context of the involved entities. Use `derives-from` and `contextualizes` to navigate.
3. **Specs**: If there is a related spec or implementation plan (in `specs/` or `docs/specs/`), read it to understand the original intent of what was implemented.

## Steps

### Step 1 — Collect changes

// turbo
Identify **all** uncommitted changes (staged + unstaged):

```bash
git diff --stat HEAD
```

// turbo
Next, collect the full diff for analysis:

```bash
git diff HEAD
```

Organize the changes into two categories:
- **Production code**: models, views, use cases, services, migrations, configurations
- **Test code**: files in `tests/` directories

---

### Step 2 — Context mapping

For **each changed production file**, answer internally:

1. **What business rule does this code implement?** — Consult the vault and specs.
2. **What are the happy paths and edge cases?** — Think like a QA who wants to break the system.
3. **What tests already exist for this functionality?** — Examine the corresponding test files.
4. **Was there an interface change (signature, return type, exceptions)?** — These changes break contracts.

For **each changed test file**, answer internally:

1. **Does the test validate a business rule or an implementation detail?**
2. **Is the test still correct after the production changes?**
3. **Is the test testing enough or is it superficial?**

---

### Step 3 — Analysis and classification

Produce the analysis by classifying each found item into one of the categories below:

#### 3.1 — Missing Tests

Tests that **should exist** but don't. For each one, document:

| Field | Description |
|-------|-----------|
| **Description** | What the test should validate |
| **Type** | `business-rule` (validates business rule) or `code-integrity` (validates technical behavior) |
| **Scope** | `unit` / `integration` / `e2e` |
| **Importance** | CRITICAL / IMPORTANT / NICE-TO-HAVE |
| **Business context** | Why this rule matters — what would break in production without this test |
| **Suggested file** | Where the test should be written |
| **Suggested scenario** | Descriptive name of the test case (e.g., `test_reject_upload_when_bancarizador_not_registered`) |

#### 3.2 — Incomplete Tests

Tests that exist but **do not cover enough**. For each one, document:

| Field | Description |
|-------|-----------|
| **File/Test** | Path and name of the test |
| **What's missing** | Missing scenarios, edge cases, or assertions |
| **Type** | `business-rule` or `code-integrity` |
| **Importance** | CRITICAL / IMPORTANT / NICE-TO-HAVE |
| **Risk** | What might go unnoticed without the additional coverage |

#### 3.3 — Useless or Fragile Tests

Tests that **add no value** or are **fragile** (they break for the wrong reasons). For each one, document:

| Field | Description |
|-------|-----------|
| **File/Test** | Path and name of the test |
| **Problem** | Why it's useless or fragile (e.g., tests implementation instead of behavior, trivial assertion, excessive mocking) |
| **Recommendation** | `remove`, `rewrite`, or `refactor` |
| **Justification** | Why the recommendation is better than the current state |

---

### Step 4 — Artifact Synthesis

Create a markdown artifact in the conversation brain with the following format:

```markdown
# Test Audit — [Brief description of what changed]

**Date:** YYYY-MM-DD
**Changes analyzed:** [number] production files, [number] test files

## Executive Summary

[2-3 sentences summarizing the state of test coverage for the analyzed changes.
Include: how many critical missing tests, how many incomplete, how many useless.]

## Business Context

[Explanation of the affected domain. What part of the business process do these changes impact? Why are tests especially important here?]

## Missing Tests — Critical

[Detailed table of missing tests with CRITICAL importance]

## Missing Tests — Important

[Detailed table of missing tests with IMPORTANT importance]

## Missing Tests — Nice-to-have

[Detailed table of missing tests with NICE-TO-HAVE importance]

## Incomplete Tests

[Detailed table of incomplete tests]

## Useless or Fragile Tests

[Detailed table of useless or fragile tests]

## Coverage Matrix

A consolidated view showing:

| Changed functionality | Unit test | E2E test | Business rule covered? | Gap |
|------------------------|---------------|-----------|--------------------------|-----|

## Prioritized Recommendations

Ordered list by priority of what should be done:
1. [Most critical action]
2. ...
```

---

### Step 5 — Importance Criteria

Use these criteria to classify importance:

| Level | Criterion |
|-------|----------|
| **CRITICAL** | Without this test, a bug could reach production and cause **financial loss, corrupted data, or regulatory rule violation**. Includes: core business validations, financial calculations, approval flows, cross-domain data integrity. |
| **IMPORTANT** | Without this test, a bug could cause **incorrect behavior visible to the user** or **recoverable data inconsistency**. Includes: API edge cases, error handling, secondary flows, cross-layer contracts. |
| **NICE-TO-HAVE** | Without this test, the risk is **low and localized**. Includes: formatting, logs, error messages, rare paths, coverage redundancy. |

---

### Step 6 — Presentation

Present the artifact to the user with `PathsToReview` pointing to the created artifact. Include in the message:

- Total number of gaps found by importance level
- If there is any CRITICAL gap that blocks the merge
- If existing tests are generally in good shape or need refactoring
