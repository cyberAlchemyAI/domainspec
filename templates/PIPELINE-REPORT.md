---
id: { feature-id }
feature: { FeatureName }
type: pipeline-report
title: "{FeatureName} — Pipeline Report"
pipeline-run: { ISO timestamp }
pipeline-mode: { new | evolution }
status: { PASS | FLAG | BLOCK }
domainspec-version: { version from CHANGELOG }
---

# {FeatureName} — Pipeline Report

> Generated at the end of every `domainspec-pipeline` run.
> Captures economy of action metrics (G7) and structured reflection (G8).

---

## Economy of Action

> ADLC Principle 10 — Minimize computational and cognitive load.

### Pipeline Counters

| Metric                        | Value | Notes                                      |
| ----------------------------- | ----- | ------------------------------------------ |
| **Steps executed**            |       | Out of 12 possible (plan→verify)           |
| **Steps skipped**             |       | Via flags or N/A conditions                |
| **Agent delegations**         |       | Count of skill/agent invocations           |
| **Human questions asked**     |       | Interactive prompts requiring user input   |
| **Files created**             |       | New files written                          |
| **Files modified**            |       | Existing files edited                      |
| **Test suites run**           |       | vitest/playwright invocations              |
| **Tests added**               |       | New test cases created                     |
| **Tests total (pass/fail)**   |       | Full suite result at end                   |
| **Retries (fix iterations)**  |       | Times agent retried after failure          |

### Context Discovery

| Metric                         | Value | Notes                                         |
| ------------------------------ | ----- | --------------------------------------------- |
| **Discovery strategy used**    |       | links-tags-first, broad-search, etc.          |
| **Files read for context**     |       | Unique files read before implementation       |
| **Subagent calls (Explore)**   |       | Read-only exploration delegations             |
| **Subagent calls (Researcher)**|       | Focused feasibility research delegations      |

### Overhead Assessment

| Metric                            | Value   |
| --------------------------------- | ------- |
| **Governance files produced**     |         |
| **Domain files produced**         |         |
| **Overhead ratio**                |         |
| **Assessment**                    | {acceptable / high — review governance cost} |

> **Overhead ratio** = governance artifacts ÷ domain artifacts. Target: ≤ 0.3 for mature features.

---

## Step Verdicts

| Step | Name                       | Verdict | Duration | Notes |
| ---- | -------------------------- | ------- | -------- | ----- |
| 1    | Plan                       |         |          |       |
| 2    | Spec                       |         |          |       |
| 3    | Stories                    |         |          |       |
| 4    | Tests                      |         |          |       |
| 5    | Implement Backend          |         |          |       |
| 5b   | Infrastructure Binding     |         |          |       |
| 6    | UI Pipeline                |         |          |       |
| 7a   | Observability Spec         |         |          |       |
| 7b   | Instrument OTel            |         |          |       |
| 7c   | Verify OTel                |         |          |       |
| 7d   | Infra Deploy Sync          |         |          |       |
| 8    | Registry Sync              |         |          |       |
| 9    | Verify                     |         |          |       |
| 10   | Reflect                    |         |          |       |

**Final Verdict:** `PASS` | `FLAG` | `BLOCK`

---

## Reflection

> ADLC Principle 12 — System reflects and tunes at every interaction.

### What went well

<!-- List decisions/steps that produced correct output on first attempt -->

- 

### What required rework

<!-- List steps that needed retries, backtracking, or human correction -->
<!-- For each: root cause, how many iterations, what fixed it -->

- 

### Governance gaps discovered

<!-- New blind spots found during this run that existing skills/audits missed -->
<!-- For each: what was missed, which skill should have caught it, severity -->

- 

### Skill improvement proposals

<!-- Concrete, actionable changes to DomainSpec skills/agents/instructions -->
<!-- Each proposal: target file, change description, rationale from this run -->

| # | Target Skill/Agent | Proposal | Rationale | Priority |
|---|-------------------|----------|-----------|----------|
|   |                   |          |           |          |

### Patterns for memory

<!-- Insights worth persisting to user/repo memory for future sessions -->
<!-- Only include if the insight is reusable and non-obvious -->

- 

---

## Artifacts Produced

### Docs

| File | Action | Notes |
|------|--------|-------|
|      |        |       |

### Backend

| File | Action | Notes |
|------|--------|-------|
|      |        |       |

### Frontend

| File | Action | Notes |
|------|--------|-------|
|      |        |       |

### Tests

| File | Action | Notes |
|------|--------|-------|
|      |        |       |

### Infrastructure

| File | Action | Notes |
|------|--------|-------|
|      |        |       |
