# TASK-KG-IMP-04 - Deterministic Test Suite and Readiness Evidence

## Goal

Implement and run deterministic tests for API, operations, UI interactions, and non-functional checks, then publish pilot-readiness evidence.

## Wave Assignment

- Primary wave: W2
- Supporting wave: W3 (readiness publication)

## Status

in-progress

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [events.md](../../events.md)         | MirrorProjectionBuilt, ConceptSelected, DefinitionOpened                                                                                                    |
| [operations.md](../../operations.md) | ResolveProjectionScope, RebuildMirrorProjection, SelectConcept, OpenDefinition                                                                              |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | KG-BE-ST-001..015, KG-BE-OP-001..020, KG-BE-ERR-001..010, KG-BE-API-001..013, KG-BE-IFMAP-001..011, KG-UI-NAV-001, KG-UI-JRN-001..004, KG-UI-STATE-001..004 |
| [STORIES.md](../../STORIES.md)       | US-1, US-2, US-3, US-4                                                                                                                                      |
| [SPEC.md](../../SPEC.md)             | Whiteboard-first cross-project capability contract                                                                                                          |

## Architecture References

- [Testing Alignment](../../../../../architecture/pattern-library/TESTING-ALIGNMENT.md)
- [TEST-PIPELINE.md](../../../../../TEST-PIPELINE.md)

## Implementation Directives

- Convert each TEST-SPEC contract row into executable test case(s).
- Keep deterministic fixtures and stable sorting for graph assertions.
- Add explicit test coverage for strict `(projectKey, featureId)` scope invariants.
- Add explicit test coverage for whiteboard board-level behavior (`aspect`, `feature`, `concept`).
- Include negative-path coverage for unresolved anchors and unknown concept IDs.
- Include negative-path coverage for unknown/disabled `projectKey`, unavailable scoped feature, and invalid scope propagation.
- Publish evidence matrix linking tests to stories and coverage IDs.

## Reusable legacy Assets

| Asset                                                                                                                              | Reuse Mode            | Required Adaptation                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [backend/src/server.test.ts](../../../../../backend/src/server.test.ts) `buildServer` injection harness and response-pattern tests | reuse with adaptation | Reuse setup and health-route assertion style; expand to current KG API paths and payload contracts.                              |
| [backend/package.json](../../../../../backend/package.json) backend test script segmentation surface                               | reuse with adaptation | Keep phased execution model and map script filters to KG naming/test IDs as current suites are added.                            |
| [apps/web/package.json](../../../../../apps/web/package.json) frontend test script/dependency surface                              | reuse with adaptation | Reuse baseline frontend script surface while adding Playwright/E2E coverage for current KG interactions.                         |
| Removed legacy E2E artifact (`apps/web/e2e/knowledge-graph-visualization/atlas.spec.ts`)                                           | re-implement          | Recreate deterministic KG Playwright specs from current UI-SPEC and TEST-SPEC; do not restore deleted fixture/model assumptions. |

## legacy Carryover Limits

- Legacy test IDs not present in current `TEST-SPEC.md` are not valid completion evidence for KG contracts.
- Any E2E assertions coupled to legacy holistic/semantic zoom endpoints must be rewritten to current route/API behavior.

## Execution Steps

1. Add/refresh backend unit and integration tests for API and operation contracts.
2. Add/refresh backend tests for cross-project scope guards from [TEST-SPEC.md](../../TEST-SPEC.md#uncovered-formal-gaps).
3. Add/refresh UI E2E tests for aspect-to-feature-to-concept board transitions and click-to-definition behavior.
4. Run full suite and collect deterministic outputs.
5. Publish readiness evidence updates and map failures to follow-up actions.

## Completion Criteria

- All required KG test IDs execute.
- Cross-project scope obligations are represented by explicit automated tests.
- Whiteboard drill-level behavior is covered by automated UI tests.
- Failing tests are either fixed or documented with owner/date follow-up.
- Pilot-readiness evidence package is published.

## Verification Evidence

- Test command output snapshots.
- Traceability update linking every test ID to evidence.
- Latest evidence (2026-05-06):
  - `pnpm --filter @domainspec/backend check` - pass
  - `pnpm --filter @domainspec/backend test` - pass (`tests=22`, `fail=0`)
  - `pnpm --filter @domainspec/web check` - pass
  - `pnpm --filter @domainspec/web test:e2e` - pass (`16 passed`)
  - Added deterministic backend scope/IFMAP tests in `backend/src/server.test.ts`.
  - Refreshed aspect->feature->concept->open-definition UI journey coverage in `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts`.

## Readiness Evidence Matrix (2026-05-06)

| Obligation Slice                                                                                                                        | Evidence                                                                                                                                                                                                        | Status | Follow-up |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------- |
| TEST-SPEC API + IFMAP deterministic mapping (`KG-BE-API-001`, `KG-BE-API-004`, `KG-BE-IFMAP-001`, `KG-BE-IFMAP-002`, `KG-BE-IFMAP-004`) | Backend tests: `KG-BE-API-001 KG-BE-IFMAP-001 KG-BE-IFMAP-002 ...`, `KG-BE-API-004 KG-BE-IFMAP-004 ...` in `backend/src/server.test.ts`                                                                         | pass   | none      |
| Cross-project scope guards (unknown/disabled source, unavailable feature, strict `(projectKey, featureId)` isolation)                   | Backend tests in `backend/src/server.test.ts` covering `MIRROR_SOURCE_PROJECT_UNKNOWN`, `MIRROR_SOURCE_FEATURE_UNAVAILABLE`, and snapshot isolation checks                                                      | pass   | none      |
| Whiteboard transition chain (`aspect -> feature -> concept`) and definition open behavior (`KG-UI-JRN-003`)                             | Playwright test `KG-UI-JRN-003 aspect -> feature -> concept transitions and open-definition remain deterministic` in `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts` | pass   | none      |
| Full relevant suites (backend + web + e2e)                                                                                              | `pnpm --filter @domainspec/backend check`, `pnpm --filter @domainspec/backend test`, `pnpm --filter @domainspec/web check`, `pnpm --filter @domainspec/web test:e2e`                                            | pass   | none      |

## Gaps and Questions

- Non-functional threshold baselines need confirmation for local environment variance.
- Formalize cross-project scope IDs in TEST-SPEC once approved.
- Mandatory W3 audit command entrypoints are not available in this shell runtime (`domainspec-audit-alignment` and `domainspec-audit-layering` returned `command not found`); execute via the delegated DomainSpec runtime and publish generated reports in W3.

## Decision Lock

| Decision ID | Required | Status   | Note                                |
| ----------- | -------- | -------- | ----------------------------------- |
| D-KG-004    | yes      | selected | Server-deterministic layout         |
| D-KG-005    | yes      | selected | In-app definition open mode         |
| D-KG-007    | yes      | selected | Registered source key policy        |
| D-KG-009    | yes      | selected | Strict scope propagation invariants |
