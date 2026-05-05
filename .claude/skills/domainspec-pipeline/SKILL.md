---
name: domainspec-pipeline
description: End-to-end feature pipeline — from business idea to verified implementation in one command. Orchestrates planning, spec writing, story generation, test derivation, backend implementation, optional UI lifecycle, observability derivation, infrastructure sync, and verification.
argument-hint: "<feature-name> [--skip-discovery <reason>] [--backend-only] [--skip-ui] [--skip-observability] [--skip-instrumentation] [--skip-otel-verify] [--skip-infra] [--spec-only] [--test-only] [--dry-run]"
agent: domainspec-planner
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, WebFetch, Task
---

<objective>
Execute the full DomainSpec feature lifecycle in one pass — from a feature name (new or existing) through to verified, tested implementation with optional UI.
</objective>

<flags>
- `--skip-discovery <reason>`: Bypass the Step 0 discovery existence check. Requires a one-line reason. Propagates to every subordinate skill (`domainspec-spec-feature`, `domainspec-planner`, etc.) and is recorded as a waiver in the resulting spec frontmatter (`discovery_waived: true`, `discovery_waiver_reason: <reason>`).
- `--spec-only`: Stop after generating SPEC + aspect files + stories (Steps 1–3). Review before building.
- `--test-only`: Stop after generating TEST-SPEC (Steps 1–4). Review test obligations before implementing.
- `--backend-only`: Run backend implementation and skip UI pipeline entirely.
- `--skip-ui`: Alias for `--backend-only`.
- `--skip-observability`: Skip all observability steps (Steps 7a–7c).
- `--skip-instrumentation`: Skip OTel code instrumentation (Step 7b). Generates spec only.
- `--skip-otel-verify`: Skip OTel verification (Step 7c). Instruments without verifying.
- `--skip-infra`: Skip infrastructure sync (Step 7d). No prometheus.yml or alert rule updates.
- `--dry-run`: Show the execution plan without running any steps.
</flags>

<context>
This skill orchestrates the full pipeline described in domainspec/README.md:

```
plan → spec → stories → tests → implement → ui-pipeline → observability-spec → instrument-otel → otel-verify → infra-deploy → registry-sync → verify → emit-signals → observer
```

Each step delegates to the specialist agent/skill responsible for that stage.
This skill never bypasses delegate skills — it sequences them and propagates context.

Prerequisites:

- domainspec/ framework installed
- Claude Code agent pack installed (agents, skills, instructions)
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
- infra/prometheus.yml (updated scrape config, if infra applies)
- infra/alerts/{feature}.rules.yml (alert rules from slos.md, if infra applies)
- docs/features/{feature}/ALIGNMENT-REPORT.md
- docs/features/{feature}/UI-REVIEW.md (if UI applies)
- docs/features/{feature}/PIPELINE-REPORT.md (economy of action + reflection)
- docs/registry.md, docs/glossary.md (synced)
  </context>

<process>
## Pre-flight

1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Check if docs/features/{feature}/ exists:
   - If exists → this is an **evolution** of an existing feature. Load SPEC.md and all aspect files.
   - If missing → this is a **new feature**. Ensure docs/ directory exists (run `domainspec-init` if needed).
2b. Validate governance baseline before feature execution:
    - Preferred baseline file: `docs/shared/governance-baseline.md`.
    - Compatibility fallback accepted: `docs/shared/cash-game-management-governance.md`.
    - If neither file exists, return BLOCK and require `domainspec-init` (or copy `domainspec/templates/governance-baseline.md` manually) before continuing.
3. If --dry-run, output the execution plan (which steps apply, which delegate skills) and stop.
3b. Parse `--skip-discovery <reason>` from invocation args. If present, capture `skipDiscovery = true` and `skipDiscoveryReason = <reason>`; otherwise default to `false`. The flag, when set, MUST be appended to every subordinate skill invocation in subsequent steps (see "Flag plumbing" below).

## Step 0 — Discovery existence check

3c. Determine the feature slug from the invocation arg (`<feature-name>` → kebab-case slug).
3d. Search BOTH discovery locations:
    - `vault/discovery/<topic>-definitions/<slug>.md` (knowledge-graph location; `<topic>` may be wildcard-globbed since the topic prefix is unknown at pipeline entry).
    - `docs/features/<feature>/discovery/<slug>.md` (feature-folder location).
3e. Resolution rules:
    - **Found** in either location → record `discoveryFound = true` and proceed to Step 1.
    - **Missing** AND `skipDiscovery = true` → proceed; the flag and reason propagate to every subordinate skill (see "Flag plumbing"). The waiver is recorded in the resulting SPEC.md frontmatter as `discovery_waived: true` and `discovery_waiver_reason: <skipDiscoveryReason>`. `domainspec-spec-feature` is responsible for stamping the waiver during Step 2.
    - **Missing** AND `skipDiscovery = false` → HALT with a soft recommendation block. Emit verbatim:
      - "No discovery exists for <feature>."
      - "Write the discovery first via `.claude/skills/custom/discovery-writing.md`."
      - "Override with `--skip-discovery <reason>` to proceed without one."
      - "Or invoke `domainspec-interviewer` for help classifying scope (knowledge → vault, application → feature folder)."
      Do NOT proceed to Step 1 or any subsequent step until the user resolves (either by writing a discovery and re-invoking, or by re-invoking with `--skip-discovery <reason>`).
3f. **Flag plumbing**: when `skipDiscovery = true`, append `--skip-discovery "<skipDiscoveryReason>"` to the argv passed to every subordinate skill that this pipeline dispatches downstream — including but not limited to `domainspec-spec-feature`, `domainspec-planner`, `domainspec-sync-user-stories`, `domainspec-generate-tests`, `domainspec-implement`, `domainspec-ui-pipeline`, `domainspec-instrument-otel`, `domainspec-otel-verify`, `domainspec-infra-deploy`, `domainspec-verify-feature`. Subordinate skills decide whether they consume or simply forward the flag; the pipeline's responsibility is propagation, not interpretation.

## Step 1 — Plan

4. Delegate to `domainspec-planner`:
   - For new features: ask clarifying questions about business objective, constraints, and acceptance criteria.
   - For existing features: load current docs and identify what needs to change.
   - Output: execution plan with dependency-ordered tasks, complexity assessment, and identified risks.
5. If complexity is medium/high, auto-select `gsd-phase` execution mode for task orchestration.

## Step 2 — Spec

6. Delegate to `domainspec-spec-feature {feature}`:
   - Researches context (uses `mars-researcher` when needed).
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

## Step 5b — Infrastructure Binding Gate

14. After implementation, verify production-readiness of infrastructure bindings:
    a. **Repository binding scan**: grep all route files and the app entry point for stub/in-memory/mock repo imports. Any non-test file importing stubs → BLOCK with explicit remediation (create real DB-backed adapter, wire into routes).
    b. **Migration completeness**: if `infrastructure/database/schema.ts` defines tables → verify `drizzle/` contains migration files, `migrate.ts` exists and is called from entry point, CI workflow runs `db:migrate` before tests, Dockerfile copies `drizzle/` to runtime image.
    c. **Lifecycle hooks**: if `operations.md` or `interfaces.md` defines seed/bootstrap hooks → verify implementation exists and is wired into startup before `app.listen()`.
    d. If any check fails, fix before proceeding to UI or observability steps.

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

## Step 7d — Infrastructure Deploy Sync (conditional)

28. Check if infra sync applies:
    - Skip if `--skip-infra`.
    - Skip if `--spec-only` or `--test-only`.
    - Skip if no docs/INFRA-ARCHITECTURE.md exists (infra not yet initialized).
    - Requires: observability.md exists (from Step 7a or pre-existing).
    - Otherwise, proceed.
29. Delegate to `domainspec-infra-deploy {feature}`:
    - Regenerates infra/prometheus.yml from all observability specs.
    - Generates/updates infra/alerts/{feature}.rules.yml from docs/slos.md.
    - Verifies docker-compose.prod.yml matches INFRA-ARCHITECTURE.md.
    - Validates generated configs.
30. If validation fails → FLAG infra sync, continue to registry.

## Step 8 — Registry Sync

31. Delegate to `domainspec-sync-registry`:
    - Updates docs/registry.md and docs/glossary.md from all SPEC.md concept tables.

## Step 9 — Verify

32. Delegate to `domainspec-verify-feature {feature}`:
    - Runs alignment audit, layering audit, test evidence check.
    - Returns PASS / FLAG / BLOCK verdict.

## Step 10 — Emit Signals (Session Epilogue)

33. After verification verdict, emit structured signals to `docs/signals/pipeline-signals.jsonl`:
    a. **Per-step signals:** For each step executed, emit a `step-verdict` signal with verdict, retries, files touched, tests added.
    b. **Economy signal:** Emit one `overhead` signal with aggregate counters — steps executed/skipped, agent delegations, human questions, retries, overhead ratio.
    c. **Quality signals:** For each alignment gap, spec gap, or governance gap found during the run, emit the corresponding signal type (`alignment-gap`, `spec-gap`, `governance-gap`).
    d. **Rework signals:** For each step that required retries or human correction, emit a `rework` signal with root cause and iteration count.
    e. **Decision signals:** For significant design decisions made during the run, emit a `decision` signal.
    f. **Proposal signals:** For each skill improvement idea identified, emit a `proposal` signal with target file and rationale.
    g. **Pattern signals:** For reusable insights worth tracking, emit a `pattern` signal.
34. Signal format follows `domainspec/templates/SIGNAL-SCHEMA.md`. Each signal is one JSON line appended to the JSONL file with `source: "session-epilogue"`.
35. Enforce session completeness invariants before completion:
    - If any `step-verdict` exists, emit exactly one `overhead` signal.
    - If any `step-verdict` has `retriesNeeded > 0`, emit at least one `rework` signal.

## Step 11 — Dual-Phase Observer

36. Run fast observer (blocking):
    - Execute deterministic detector and signal validator to emit `source: "fast-observer"` signals.
    - If critical/high governance violations are found, return BLOCK.
37. Build telemetry bundle for deep analysis:
    - Ordered tool/command events.
    - Incremental diff snapshots.
    - Test output chronology with timestamps.
38. Dispatch async deep observer (non-blocking):
    - Analyze telemetry bundle and emit behavior-level signals with `source: "async-observer"`.
    - Append to same JSONL log.
39. Deep reflection remains asynchronous via tuning workflow or manual `domainspec-reflect --from-signals`.

## Completion

40. Return pipeline summary: - Feature: name, new or evolved - Artifacts created/updated (file paths by category: docs, backend, frontend, tests) - Test results: count passed / failed / pending - Build status: backend + frontend (if applicable) - UI audit verdict (if applicable, or "skipped") - Observability spec: instrument count, applicable rules, pillar-specific obligations (or "skipped") - Instrumentation: files modified, instruments added, compilation status (or "skipped") - OTel verification: coverage %, verdict (PASS/FLAG/BLOCK), change requests count (or "skipped") - Infra sync: prometheus.yml updated, alert rules generated/updated, validation status (or "skipped") - Verification verdict: PASS / FLAG / BLOCK with details - Signals emitted by source (session-epilogue, fast-observer, async-observer) - Next actions (if FLAG or BLOCK)
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
