---
name: domainspec-pipeline
description: End-to-end feature pipeline — from business idea to verified implementation in one command. Orchestrates planning, spec writing, story generation, test derivation, backend implementation, optional UI lifecycle, observability derivation, and verification.
argument-hint: "<feature-name> [--backend-only] [--skip-ui] [--skip-observability] [--skip-instrumentation] [--skip-otel-verify] [--spec-only] [--test-only] [--dry-run]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, WebFetch, Task
---

<objective>
Execute the full DomainSpec feature lifecycle in one pass — from a feature name (new or existing) through to verified, tested implementation with optional UI.
</objective>

<flags>
- `--spec-only`: Stop after generating SPEC + aspect files + stories (Steps 1–3). Review before building.
- `--test-only`: Stop after generating TEST-SPEC (Steps 1–4). Review test obligations before implementing.
- `--backend-only`: Run backend implementation and skip UI pipeline entirely.
- `--skip-ui`: Alias for `--backend-only`.
- `--skip-observability`: Skip all observability steps (Steps 7a–7c).
- `--skip-instrumentation`: Skip OTel code instrumentation (Step 7b). Generates spec only.
- `--skip-otel-verify`: Skip OTel verification (Step 7c). Instruments without verifying.
- `--dry-run`: Show the execution plan without running any steps.
</flags>

<context>
This skill orchestrates the full pipeline described in domainspec/README.md:

```
plan → spec → stories → tests → implement → ui-pipeline → observability-spec → instrument-otel → otel-verify → registry-sync → verify
```

Each step delegates to the specialist agent/skill responsible for that stage.
This skill never bypasses delegate skills — it sequences them and propagates context.

Prerequisites:
- domainspec/ framework installed
- Copilot agent pack installed (agents, skills, instructions)
- docs/ directory exists (or domainspec-init will create it)

Created/updated by this skill (cumulative):
- docs/features/{feature}/SPEC.md
- docs/features/{feature}/domain.md, operations.md, states.md, interfaces.md, events.md, queries.md, etc.
- docs/features/{feature}/STORIES.md
- docs/features/{feature}/TEST-SPEC.md
- Backend source files (entities, operations, use-cases, adapters, tests)
- docs/features/{feature}/UI-SPEC.md (if UI applies)
- Frontend pages, components, hooks, E2E tests (if UI applies)
- docs/features/{feature}/observability.md
- docs/features/{feature}/OBSERVABILITY-REPORT.md (instrumentation verification)
- docs/features/{feature}/ALIGNMENT-REPORT.md
- docs/features/{feature}/UI-REVIEW.md (if UI applies)
- docs/registry.md, docs/glossary.md (synced)
</context>

<process>
## Pre-flight

1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Check if docs/features/{feature}/ exists:
   - If exists → this is an **evolution** of an existing feature. Load SPEC.md and all aspect files.
   - If missing → this is a **new feature**. Ensure docs/ directory exists (run `domainspec-init` if needed).
3. If --dry-run, output the execution plan (which steps apply, which delegate skills) and stop.

## Step 1 — Plan

4. Delegate to `domainspec-planner`:
   - For new features: ask clarifying questions about business objective, constraints, and acceptance criteria.
   - For existing features: load current docs and identify what needs to change.
   - Output: execution plan with dependency-ordered tasks, complexity assessment, and identified risks.
5. If complexity is medium/high, auto-select `gsd-phase` execution mode for task orchestration.

## Step 2 — Spec

6. Delegate to `domainspec-spec-feature {feature}`:
   - Researches context (uses `domainspec-researcher` when needed).
   - Produces SPEC.md with concept table and all relevant aspect files.
   - For existing features with `--update`: evolves existing docs rather than recreating.
7. Validate: SPEC.md exists, concept table is non-empty, at least one aspect file exists.

## Step 3 — Stories

8. Delegate to `domainspec-sync-user-stories {feature}`:
   - Derives STORIES.md from aspect docs — classic + BDD format, traceable to concepts.
9. If --spec-only, return summary of created artifacts and stop.

## Step 4 — Tests

10. Delegate to `domainspec-generate-tests {feature}`:
    - Derives backend TEST-SPEC.md from formal aspect docs.
    - If interfaces.md has HTTP endpoints and UI-SPEC.md exists, also generates E2E obligations.
11. If --test-only, return summary of test obligations and stop.

## Step 5 — Implement Backend

12. Delegate to `domainspec-implement {feature}`:
    - Implements entities, operations, state machines, events, interfaces from documented contracts.
    - Runs tests and reports pass/fail.
    - For existing features: runs alignment + layering audits first, then applies fixes.
13. Run automated checks. If tests fail, attempt fix (max 2 iterations), then FLAG.

## Step 6 — UI Pipeline (conditional)

14. Check if UI applies:
    - Skip if --backend-only or --skip-ui.
    - Skip if interfaces.md has no HTTP endpoints.
    - Otherwise, proceed.
15. Delegate to `domainspec-ui-pipeline {feature}`:
    - Ensures UI-ARCHITECTURE.md exists.
    - Generates UI-SPEC.md.
    - Scaffolds E2E tests.
    - Implements frontend pages and components.
    - Runs visual audit.

## Step 7a — Observability Spec (conditional)

16. Check if observability applies:
    - Skip if `--skip-observability`.
    - Skip if `--spec-only` or `--test-only` (haven't reached this stage yet).
    - Otherwise, proceed.
17. Load OBSERVABILITY.md derivation rules (O1–O16) and the observability template.
18. Scan feature aspect files to determine which rules apply:
    - `states.md` → O1 (transition counters), O2 (state distribution), O3 (invariant monitors)
    - `operations.md` → O4 (base operation metrics), O5 (rule violation rates), O6 (calculation drift), O7 (postcondition verification)
    - `interfaces.md` → O8 (endpoint SLOs)
    - Operations with idempotency rules → O9 (idempotency monitors)
    - `events.md` → O10 (event flow)
    - `queries.md` → O11 (query performance)
    - `workflows.md` → O12 (workflow completion)
    - SPEC.md capabilities → O13 (business KPIs)
    - STORIES.md user journeys → O14 (funnel metrics)
    - `pillar: finance` in frontmatter → O15 (transaction integrity), O16 (financial cycle metrics)
19. Generate `docs/features/{feature}/observability.md` using the template, populating each applicable rule section with concrete metric declarations in OTel format.
20. All instruments use OTel conventions: Meter scope = project name, `feature` as attribute, dot-separated semantic names, typed instruments (Counter, Histogram, Gauge, UpDownCounter).

## Step 7b — Instrument OTel (conditional)

21. Check if instrumentation applies:
    - Skip if `--skip-observability` or `--skip-instrumentation`.
    - Skip if `--spec-only` or `--test-only`.
    - Requires: observability.md exists (from Step 7a or pre-existing).
    - Otherwise, proceed.
22. Delegate to `domainspec-instrument-otel {feature}`:
    - Reads observability.md and maps instruments to code locations.
    - Imports shared instruments from `infrastructure/telemetry/instruments.ts`.
    - Creates feature-specific instruments when shared set does not cover.
    - Wraps use-case functions with metric recording (O4, O5, O7).
    - Adds state transition recording (O1), event emission tracking (O10).
    - Runs `tsc --noEmit` to validate compilation.
23. If compilation fails after 2 retries → FLAG instrumentation, continue to next step.

## Step 7c — Verify OTel (conditional)

24. Check if verification applies:
    - Skip if `--skip-observability` or `--skip-otel-verify`.
    - Skip if `--spec-only` or `--test-only`.
    - Requires: observability.md exists and backend code is instrumented.
    - Otherwise, proceed.
25. Delegate to `domainspec-otel-verify {feature}`:
    - Scans code for instrument registrations and recording calls.
    - Classifies each declared instrument: ✅ Instrumented | ⚠️ Partial | ❌ Missing | 🔄 Drifted.
    - Produces docs/features/{feature}/OBSERVABILITY-REPORT.md with change requests.
26. If verdict is BLOCK and --fix behavior is desired:
    - Re-invoke `domainspec-instrument-otel --change-requests OBSERVABILITY-REPORT.md`.
    - Re-verify (max 3 iterations).
27. Record observability verdict for final pipeline summary.

## Step 8 — Registry Sync

28. Delegate to `domainspec-sync-registry`:
    - Updates docs/registry.md and docs/glossary.md from all SPEC.md concept tables.

## Step 9 — Verify

29. Delegate to `domainspec-verify-feature {feature}`:
    - Runs alignment audit, layering audit, test evidence check.
    - Returns PASS / FLAG / BLOCK verdict.

## Completion

30. Return pipeline summary:
    - Feature: name, new or evolved
    - Artifacts created/updated (file paths by category: docs, backend, frontend, tests)
    - Test results: count passed / failed / pending
    - Build status: backend + frontend (if applicable)
    - UI audit verdict (if applicable, or "skipped")
    - Observability spec: instrument count, applicable rules, pillar-specific obligations (or "skipped")
    - Instrumentation: files modified, instruments added, compilation status (or "skipped")
    - OTel verification: coverage %, verdict (PASS/FLAG/BLOCK), change requests count (or "skipped")
    - Verification verdict: PASS / FLAG / BLOCK with details
    - Next actions (if FLAG or BLOCK)
</process>

<error-handling>
- Pre-flight failures (no domainspec/, no docs/) → BLOCK with setup instructions.
- Planner questions unanswered → cannot proceed, re-prompt user.
- Spec generation fails → BLOCK at step 2, report what is missing.
- Test derivation finds incomplete docs → FLAG with specific gaps, continue to implement what is derivable.
- Backend implementation test failures after 2 retries → FLAG, continue to UI if applicable.
- UI pipeline BLOCK → report but do not revert backend implementation.
- Observability derivation with incomplete aspect docs → FLAG with which rules could not be derived, continue to instrumentation.
- Instrumentation compilation failure after retries → FLAG, continue to verification.
- OTel verification BLOCK after 3 fix iterations → FLAG with detailed gap report, continue to registry sync.
- Verification BLOCK → report with required remediation steps.
</error-handling>

<authority-rule>
- DomainSpec artifacts (SPEC, aspects, STORIES) define behavior — they are the source of truth.
- This skill orchestrates the pipeline sequence — it never overrides delegate skill decisions.
- When delegate skills ask interactive questions (planner, ui-architecture), those propagate to the user.
- If a delegate skill produces a FLAG or BLOCK, this skill records it and decides whether to continue or stop based on severity.
</authority-rule>
