# WORK-PACK: knowledge-graph-visualization (current remake)

## Purpose

Planner-managed execution manifest for rebuilding the Knowledge Graph feature with mirror cards, canonical relationship graph projection, concept deep-link navigation, and related detail cards.

## Planner Control Fields

| Field             | Value                                                              | Notes                                                  |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| plannerGateStatus | pass                                                               | Docs baseline complete for mutation planning           |
| complexity        | high                                                               | Backend parser + API + UI + tests + verification scope |
| architectureWave  | W0                                                                 | Mandatory first wave for architecture and stage lock   |
| activePlanRef     | docs/features/knowledge-graph-visualization/IMPLEMENTATION-PLAN.md | Active whiteboard pivot implementation plan            |
| lastPlannedAt     | 2026-05-06T15:20:00Z                                               | ISO timestamp                                          |
| readinessProfile  | pilot                                                              | Initial target profile                                 |

## Task Status Board

| Task ID   | Goal                                                                       | Complexity | Assigned Waves | Gate Status      | Status      |
| --------- | -------------------------------------------------------------------------- | ---------- | -------------- | ---------------- | ----------- |
| KG-IMP-08 | Stabilize docs validation execution with terminal-safe command conventions | low        | W0             | ready            | completed   |
| KG-IMP-01 | Implement docs-to-projection parser and canonical edge validation          | high       | W1, W2         | ready            | in-progress |
| KG-IMP-02 | Implement read/interaction API contracts for cards, graph, and definitions | high       | W1, W2         | ready            | in-progress |
| KG-IMP-03 | Implement UI mirror cards + graph + detail interactions                    | high       | W1, W2         | ready            | in-progress |
| KG-IMP-04 | Implement deterministic tests from TEST-SPEC and reach pilot readiness     | medium     | W2, W3         | ready-after-impl | in-progress |
| KG-IMP-05 | Execute feature verification verdict (`domainspec-verify-feature`)         | high       | W3             | ready-after-impl | completed   |
| KG-IMP-06 | Execute alignment audit (`domainspec-audit-alignment`)                     | high       | W3             | ready-after-impl | completed   |
| KG-IMP-07 | Execute layering audit (`domainspec-audit-layering`)                       | high       | W3             | ready-after-impl | not-started |
| KG-IMP-09 | Close alignment blockers and rerun audit to clear BLOCK verdict            | high       | W3             | ready-after-impl | not-started |

## Mandatory Closure Obligations

| Obligation           | Required Command                                           | Task Mapping | Baseline Report              | Current State      |
| -------------------- | ---------------------------------------------------------- | ------------ | ---------------------------- | ------------------ |
| Feature verification | `domainspec-verify-feature knowledge-graph-visualization`  | KG-IMP-05    | VERIFICATION.md              | FLAG (2026-05-06)  |
| Alignment audit      | `domainspec-audit-alignment knowledge-graph-visualization` | KG-IMP-06    | ALIGNMENT-REPORT.md          | BLOCK (2026-05-06) |
| Layering audit       | `domainspec-audit-layering knowledge-graph-visualization`  | KG-IMP-07    | LAYERING-ALIGNMENT-REPORT.md | pending            |

## Architecture-Guided Task Directives

| Task ID   | DomainSpec Sources                             | Coverage IDs                                                                                                 | Architecture References                                                                        | Implementation Directive                                                                                                                                                       | Verification Evidence                    |
| --------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| KG-IMP-08 | IMPLEMENTATION-PLAN.md, TASKS.md, WORK-PACK.md | docs link-check command reliability, terminal lifecycle safety                                               | ../../../ARCHITECTURE.md#rule--calculation-pattern                                             | Use non-destructive command patterns for iterative docs checks (no parent-shell `exit`), preserve per-file output, and keep terminal session reusable across verification runs | command transcript + summary line output |
| KG-IMP-01 | SPEC.md, domain.md, mappings.md, operations.md | FeatureDocument, ConceptDefinition, MirrorProjection, RelationshipEdge, R1, R2, R3, R4, KG-OP-001, KG-OP-002 | ../../../ARCHITECTURE.md#layer-model, ../../../ARCHITECTURE.md#rule--calculation-pattern       | Keep parsing and canonical validation in application/use-case layer, keep file I/O in adapters, and materialize parsed docs into domain entities before projection persistence | TEST-SPEC.md IDs + backend check output  |
| KG-IMP-02 | queries.md, interfaces.md, operations.md       | KG-API-001, KG-API-002, KG-API-003, KG-API-004                                                               | ../../../ARCHITECTURE.md#interface--adapters-layer, ../../../ARCHITECTURE.md#application-layer | Keep HTTP parsing/serialization in adapters and business semantics in use-cases; return explicit error codes for deep-link failures                                            | server contract tests                    |
| KG-IMP-03 | UI-SPEC.md, interfaces.md, states.md           | KG-UIE2E-001, KG-UIE2E-002, KG-UIE2E-003, KG-UIE2E-004                                                       | ../../UI-ARCHITECTURE.md, ../../../ARCHITECTURE.md#ui-concepts                                 | Implement three-pane UI surface exactly per UI-SPEC and preserve click-to-focus and click-to-definition behavior contracts                                                     | web check + Playwright evidence          |
| KG-IMP-04 | TEST-SPEC.md, STORIES.md, SPEC.md              | US-1, US-2, US-3, US-4, KG-NF-001, KG-NF-002, KG-NF-003                                                      | ../../../ARCHITECTURE.md#testing-strategy, ../../../TEST-PIPELINE.md                           | Convert every contract ID into executable tests and publish evidence matrix for pilot readiness gate                                                                           | test suite + readiness report            |

## Required Links

### Split mode (active)

- work-pack/shared/01-context.md
- work-pack/shared/02-cross-task-gaps-and-questions.md
- work-pack/shared/03-cross-task-decisions.md
- work-pack/shared/04-traceability.md
- work-pack/tasks/TASK-KG-IMP-01.md
- work-pack/tasks/TASK-KG-IMP-02.md
- work-pack/tasks/TASK-KG-IMP-03.md
- work-pack/tasks/TASK-KG-IMP-04.md
- work-pack/tasks/TASK-KG-IMP-05.md
- work-pack/tasks/TASK-KG-IMP-06.md
- work-pack/tasks/TASK-KG-IMP-07.md
- work-pack/tasks/TASK-KG-IMP-08.md
- work-pack/tasks/TASK-KG-IMP-09.md
- work-pack/waves/W0.md
- work-pack/waves/W1.md
- work-pack/waves/W2.md
- work-pack/waves/W3.md

## Wave Status Board

| Wave | Objective                                          | Entry Gate                               | Exit Gate                                    | Status      | Evidence                                |
| ---- | -------------------------------------------------- | ---------------------------------------- | -------------------------------------------- | ----------- | --------------------------------------- |
| W0   | Architecture baseline and full stage coverage lock | Work-pack created with planner gate pass | Stage coverage and directives complete       | completed   | work-pack/waves/W0.md                   |
| W1   | Backend projection and API contracts               | W0 complete                              | Parser/API contracts implemented and checked | in-progress | work-pack/waves/W1.md                   |
| W2   | UI interactions and full contract tests            | W1 complete                              | UI + tests pass for required obligations     | in-progress | work-pack/waves/W2.md                   |
| W3   | Readiness and mandatory audits                     | W2 complete                              | verify/alignment/layering reports published  | in-progress | work-pack/waves/W3.md + VERIFICATION.md |

## Pipeline Stage Coverage

| Stage                 | Required | Wave Mapping | Status      | Evidence                                      | Skip Reason                                 |
| --------------------- | -------- | ------------ | ----------- | --------------------------------------------- | ------------------------------------------- |
| plan                  | yes      | W0           | completed   | WORK-PACK.md                                  | -                                           |
| architecture-baseline | yes      | W0           | completed   | WORK-PACK.md directives                       | -                                           |
| spec                  | yes      | W0, W1       | completed   | SPEC.md                                       | -                                           |
| stories               | yes      | W0, W1       | completed   | STORIES.md                                    | -                                           |
| tests                 | yes      | W2           | in-progress | TEST-SPEC.md + TASK-KG-IMP-04 evidence matrix | readiness publication in progress           |
| backend-implement     | yes      | W1, W2       | in-progress | backend test suite pass                       | pending whiteboard pivot deltas             |
| ui-pipeline           | yes      | W2           | in-progress | web check + test:e2e pass                     | readiness publication in progress           |
| observability-spec    | yes      | W2           | not-started | pending                                       | pending                                     |
| instrument-otel       | yes      | W2           | not-started | pending                                       | pending                                     |
| otel-verify           | yes      | W2, W3       | not-started | pending                                       | pending                                     |
| infra-deploy          | yes      | W2, W3       | not-started | pending                                       | pending                                     |
| registry-sync         | yes      | W2, W3       | not-started | pending                                       | pending                                     |
| verify-readiness      | yes      | W3           | not-started | pending                                       | pending                                     |
| verify-feature        | yes      | W3           | completed   | VERIFICATION.md                               | FLAG remediation open (`A-KG-VER-001..003`) |
| audit-alignment       | yes      | W3           | completed   | ALIGNMENT-REPORT.md                           | -                                           |
| audit-layering        | yes      | W3           | not-started | pending                                       | pending                                     |

## Decision Lock Summary

| Decision ID | Scope      | Status   | Selected Option                                                     | Source       | Date       |
| ----------- | ---------- | -------- | ------------------------------------------------------------------- | ------------ | ---------- |
| D-KG-001    | cross-task | selected | Mirror-first card model requires SPEC/domain/operations parity      | user request | 2026-05-03 |
| D-KG-002    | cross-task | selected | Graph projection must use canonical Feature Concept Graph edges     | user request | 2026-05-03 |
| D-KG-003    | cross-task | selected | Concept click opens definition target and detail panel in same flow | user request | 2026-05-03 |

## Blockers

| Blocker ID | Scope      | Description                                                                | Owner    | Next Action                                                   | Target Date |
| ---------- | ---------- | -------------------------------------------------------------------------- | -------- | ------------------------------------------------------------- | ----------- |
| B-KG-001   | cross-task | Resolved: deterministic layout decision applied (`D-KG-004`).              | web-core | Keep monitoring through W3 verification outputs               | 2026-05-06  |
| B-KG-002   | cross-task | Resolved: Playwright selector/state stabilization completed (`16 passed`). | web-core | Keep regression checks in readiness and verify-feature stages | 2026-05-06  |

## Notes

- This work-pack seeds mandatory verify/alignment/layering closure tasks at creation time.
- `ui-pipeline` stage is mandatory because UI-SPEC is in scope and user interaction is core behavior.
- Split-mode planning files under `work-pack/` are the active execution source for this feature.
- Keep this file synchronized with wave transitions and command evidence.

## Change Log

| Date       | Change                                                                                                                     | Author  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ------- |
| 2026-05-07 | Added KG-IMP-09 to close `ALIGNMENT-REPORT.md` blockers (`A-KG-ALG-001..008`) and synchronized W3 tracking                 | Copilot |
| 2026-05-06 | Completed KG-IMP-06 alignment task; refreshed `ALIGNMENT-REPORT.md` with non-PASS owner/date remediation + rerun plan      | Copilot |
| 2026-05-06 | Completed KG-IMP-05 verification task; published `VERIFICATION.md` with `FLAG` verdict and owner-dated remediation actions | Copilot |
| 2026-05-06 | Updated KG-IMP-04 readiness evidence references; backend/web/E2E suites are passing and W2 blockers marked resolved        | Copilot |
| 2026-05-06 | Synced KG-IMP-01..04 and W1/W2 to in-progress based on passing backend/web checks and failing E2E evidence                 | Copilot |
| 2026-05-06 | Added KG-IMP-08 to track terminal-safe docs validation execution and prevent parent-shell termination                      | Copilot |
| 2026-05-03 | Initial current remake work-pack created from user-defined interaction model                                               | Copilot |
| 2026-05-03 | Added detailed split-mode work-pack files under work-pack/shared, work-pack/tasks, and work-pack/waves                     | Copilot |
