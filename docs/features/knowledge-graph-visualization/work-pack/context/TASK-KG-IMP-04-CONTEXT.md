# TASK-KG-IMP-04 Context Pack

## Context Pack Summary

- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-04
- Mode: standard
- Strict relevance gate: on
- Planner preflight gate: PASS (`plannerGateStatus=pass` in WORK-PACK.md)
- Framework constraints applied:
  - CHANGELOG 2.0.8 reviewed (delegation profile + telemetry updates; no extra retrieval constraints for context-builder output schema)
  - CHANGELOG 2.0.4 enforced (strict selector+obligation binding, interested-data subsets, required index schema, and mode budgets)
- Files selected: 14
- Snippets selected: 68
- Excerpt lines: 273 / 280
- Obligation coverage: 11 / 11 (100%)
- Noise ratio: 0.10
- Output markdown: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-04-CONTEXT.md
- Output index: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-04-CONTEXT.index.json
- Blockers: 0

## Obligation Matrix

| Obligation ID | Requirement                                                                                                                      | Evidence Source                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| O1            | Task authority remains bound to TASK-KG-IMP-04 coverage table, directives, completion criteria, and decision lock.               | TASK-KG-IMP-04 DomainSpec Coverage, Implementation Directives, Completion Criteria, Decision Lock                                 |
| O2            | Event obligations must cover `MirrorProjectionBuilt`, `ConceptSelected`, and `DefinitionOpened` producer/consumer behavior.      | events.md + TEST-SPEC event rows (`KG-BE-EVT-001..009`)                                                                           |
| O3            | Operation and scope obligations must enforce deterministic `(projectKey, featureId)` propagation and explicit scope diagnostics. | operations.md (`ResolveProjectionScope`, `RebuildMirrorProjection`, `SelectConcept`, `OpenDefinition`) + TEST-SPEC uncovered gaps |
| O4            | TEST-SPEC ranges in the task contract map to executable backend and UI test IDs.                                                 | TEST-SPEC rows for `KG-BE-ST`, `KG-BE-OP`, `KG-BE-ERR`, `KG-BE-API`, `KG-BE-IFMAP`, `KG-UI-*`                                     |
| O5            | Story-level acceptance for US-1..US-4 remains the authority for UI journey behavior.                                             | STORIES.md US-1..US-4 and Story Coverage Matrix                                                                                   |
| O6            | Whiteboard-first and cross-project capability contract remains tied to SPEC concept graph semantics.                             | SPEC.md overview + Feature Concept Graph                                                                                          |
| O7            | Architecture testing constraints must map each layer/doc section to deterministic test derivation and traceability.              | TESTING-ALIGNMENT.md + TEST-PIPELINE.md                                                                                           |
| O8            | Reusable backend harness adaptation must preserve deterministic API response patterns and scope error diagnostics.               | backend/src/server.test.ts + TASK reusable assets row                                                                             |
| O9            | Test execution surfaces remain script-bound for backend and frontend suites.                                                     | backend/package.json + apps/web/package.json                                                                                      |
| O10           | Playwright runtime config must preserve deterministic host/port/runtime settings for E2E runs.                                   | apps/web/playwright.config.ts                                                                                                     |
| O11           | UI journey tests must remain deterministic via shared KG API mocks and route/state assertions.                                   | apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts + mock-api.ts                            |

## Included Context

- docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-04.md
  - Why included: Primary task contract and strict coverage-ID authority.
  - Selectors: `## DomainSpec Coverage` (line 16), `## Implementation Directives` (line 31), reusable asset row for `backend/src/server.test.ts` (line 45), `## Completion Criteria` (line 63), `## Decision Lock` (line 82)
  - Obligation refs: O1, O4, O8

- docs/features/knowledge-graph-visualization/TEST-SPEC.md
  - Why included: Authoritative test-ID ranges, uncovered formal gaps, and UI journey/state targets.
  - Selectors: `### State Machine Obligations` (line 16), `KG-BE-OP-001` (line 40), `KG-BE-ERR-001` (line 91), `KG-BE-API-001` (line 106), `KG-BE-IFMAP-001` (line 124), `KG-BE-EVT-001..009` (lines 140-148), `KG-UI-NAV-001`/`KG-UI-JRN-001..004` (lines 186-190), `KG-UI-STATE-001..004` (lines 203-206), `## Uncovered Formal Gaps` (line 228)
  - Obligation refs: O2, O3, O4, O11

- docs/features/knowledge-graph-visualization/operations.md
  - Why included: Contract-level rules and error codes for scope resolution and definition-open flow.
  - Selectors: `## ResolveProjectionScope` (line 3), R1/R2 rules (lines 20-21), error codes `MIRROR_SOURCE_PROJECT_UNKNOWN`/`MIRROR_SOURCE_ROOT_INVALID` (lines 33-35), `## RebuildMirrorProjection` + R0 scope precondition (line 58), `## SelectConcept` R0 scope-match (line 123), `## OpenDefinition` R0 + `DEFINITION_SESSION_MISMATCH` (lines 173, 199)
  - Obligation refs: O2, O3, O4

- docs/features/knowledge-graph-visualization/events.md
  - Why included: Event payload/consumer authority for task-declared event coverage IDs.
  - Selectors: `## MirrorProjectionBuilt` (line 3), `## ConceptSelected` (line 27), `## DefinitionOpened` (line 50)
  - Obligation refs: O2

- docs/features/knowledge-graph-visualization/STORIES.md
  - Why included: US-1..US-4 acceptance behavior and traceability for UI journeys.
  - Selectors: `### US-1` (line 7), `### US-2` (line 30), `### US-3` (line 55), `### US-4` (line 78), scope acceptance checks in `### US-5` (lines 103-116), Story Coverage Matrix rows for US-1..US-4 (lines 131-132)
  - Obligation refs: O5, O3, O11

- docs/features/knowledge-graph-visualization/SPEC.md
  - Why included: Whiteboard-first capability contract and feature-graph edge authority for interested-data extraction.
  - Selectors: `## Overview` (line 10), `### Cross-Project Documentation Scope` (line 79), concept rows for `ResolveProjectionScope`/`RebuildMirrorProjection`/`SelectConcept`/`OpenDefinition` (lines 107-110), event rows (lines 123-125), `## Feature Concept Graph` (line 139)
  - Obligation refs: O6, O3, O2

- architecture/pattern-library/TESTING-ALIGNMENT.md
  - Why included: Layer-to-test obligations for deterministic architecture-to-verification mapping.
  - Selectors: `## Layer-to-Test Mapping` (line 5), `## Canonical Pipeline Reference` (line 17)
  - Obligation refs: O7

- TEST-PIPELINE.md
  - Why included: Test derivation rules and Playwright scaffold/traceability conventions.
  - Selectors: `## Test Generation Rules` (line 24), `## UI E2E Test Generation Rules` (line 291), `### Playwright Test Scaffold Convention` (line 421)
  - Obligation refs: O7, O11

- backend/src/server.test.ts
  - Why included: Reusable `buildServer` injection harness and deterministic scope diagnostics for backend contract adaptation.
  - Selectors: symbol `buildServer` import (line 7), open-definition mismatch assertion `DEFINITION_SESSION_MISMATCH` (line 260), unknown project assertion `MIRROR_SOURCE_PROJECT_UNKNOWN` (line 289), cross-project scope mismatch scenario (lines 451-452, 478-481), invalid scope root assertion `MIRROR_SOURCE_ROOT_INVALID` (line 530)
  - Obligation refs: O8, O3, O4

- backend/package.json
  - Why included: Backend test execution surface for deterministic contract suites.
  - Selectors: `scripts` (line 6), `test` command `tsx --test src/**/*.test.ts` (line 11), `test:ci` (line 12)
  - Obligation refs: O9

- apps/web/package.json
  - Why included: Frontend E2E execution surface and Playwright dependency contract.
  - Selectors: `scripts.test:e2e` (line 11), `devDependencies.@playwright/test` (line 18)
  - Obligation refs: O9

- apps/web/playwright.config.ts
  - Why included: Deterministic E2E runtime topology for local host/port and web-server bootstrap.
  - Selectors: `testDir` (line 9), `use.baseURL` (line 15), `use.trace` (line 16), `webServer.command` (line 26)
  - Obligation refs: O10, O9

- apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts
  - Why included: Existing journey test contract for US-1..US-4 and URL/state propagation assertions.
  - Selectors: `installKnowledgeGraphApiMocks` usage (lines 2, 10), `US-1` test (line 13), `US-2` test (line 24), `US-3` drill/open-definition test (line 37), URL assertions (`viewLevel`, `selectedGroupKey`) (lines 48, 57, 65), `US-4` detail panel test (line 83)
  - Obligation refs: O11, O5

- apps/web/e2e/knowledge-graph-visualization/mock-api.ts
  - Why included: Deterministic E2E fixture behavior for scope keys, session mismatch diagnostics, and board-level filters.
  - Selectors: `installKnowledgeGraphApiMocks` (line 156), deterministic `projectKey`/`featureId` payload fields (lines 166-167, 193-194), `DEFINITION_SESSION_MISMATCH` response (line 248), `viewLevel`/`selectedGroupKey` graph shaping (lines 284-290, 339-348)
  - Obligation refs: O11, O3

## Excluded Candidates

- docs/features/knowledge-graph-visualization/WORK-PACK.md
  - Why excluded: used for planner preflight confirmation only; no uncovered TASK-KG-IMP-04 obligation required retention after task + test-spec selection.

- docs/index/feature-map.md
  - Why excluded: not present.

- docs/index/features-index.json
  - Why excluded: not present.

- docs/index/tag-index.json
  - Why excluded: not present.

- apps/web/e2e/knowledge-graph-visualization/atlas.spec.ts
  - Why excluded: file is intentionally removed in task contract (re-implement required, no legacy restore).

- apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.navigation.spec.ts
  - Why excluded: selector obligations already covered by TEST-SPEC + journey spec + Playwright config at lower cost.

- apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.forms.spec.ts
  - Why excluded: FORM obligations captured by TEST-SPEC rows and deterministic mock-api selectors.

- apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.states.spec.ts
  - Why excluded: STATE obligations captured by TEST-SPEC + journey URL/state assertions.

- apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.responsive.spec.ts
  - Why excluded: responsive derivation remains covered through TEST-PIPELINE + Playwright config selectors.

- apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.accessibility.spec.ts
  - Why excluded: accessibility derivation remains covered through TEST-SPEC + TEST-PIPELINE selectors for this strict pack.

- apps/web/test-results/\*\*/error-context.md
  - Why excluded: ephemeral run artifacts; not normative obligations and excluded under strict relevance.

## Interested Data Subsets

- relationships (derived only from SPEC Feature Concept Graph edge column):
  - applies
  - consumes
  - contains
  - displays
  - exposes
  - fetches
  - maps
  - mutates
  - orchestrates
  - produces
  - queries
  - reflects
  - renders
  - shapes
  - transitions
  - wraps

## Next Actions

1. Use this pack to close uncovered scope IDs by adding explicit tests for unknown/disabled `projectKey`, strict `(projectKey, featureId)` propagation, and root-safety diagnostics.
2. Bind each new/updated backend and UI test case to TEST-SPEC IDs and story IDs in the readiness evidence matrix.
3. Re-run backend + Playwright suites through package script surfaces captured here and publish pilot-readiness evidence with deterministic command outputs.
