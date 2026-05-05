# TASK-KG-IMP-04 - Deterministic Test Suite and Readiness Evidence

## Goal

Implement and run deterministic tests for API, operations, UI interactions, and non-functional checks, then publish pilot-readiness evidence.

## Wave Assignment

- Primary wave: W2
- Supporting wave: W3 (readiness publication)

## Status

not-started

## DomainSpec Coverage

| Source                             | Coverage IDs                                                       |
| ---------------------------------- | ------------------------------------------------------------------ |
| [events.md](../../events.md)       | MirrorProjectionBuilt, ConceptSelected, DefinitionOpened           |
| [TEST-SPEC.md](../../TEST-SPEC.md) | KG-API-001..005, KG-OP-001..005, KG-UIE2E-001..004, KG-NF-001..004 |
| [STORIES.md](../../STORIES.md)     | US-1, US-2, US-3, US-4                                             |
| [SPEC.md](../../SPEC.md)           | current capability contract                                        |

## Architecture References

- [Testing Alignment](../../../../../architecture/pattern-library/TESTING-ALIGNMENT.md)
- [TEST-PIPELINE.md](../../../../../TEST-PIPELINE.md)

## Implementation Directives

- Convert each TEST-SPEC contract row into executable test case(s).
- Keep deterministic fixtures and stable sorting for graph assertions.
- Include negative-path coverage for unresolved anchors and unknown concept IDs.
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
2. Add/refresh UI E2E tests for click-to-focus and click-to-definition behavior.
3. Run full suite and collect deterministic outputs.
4. Publish readiness evidence updates and map failures to follow-up actions.

## Completion Criteria

- All required KG test IDs execute.
- Failing tests are either fixed or documented with owner/date follow-up.
- Pilot-readiness evidence package is published.

## Verification Evidence

- Test command output snapshots.
- Traceability update linking every test ID to evidence.

## Gaps and Questions

- Non-functional threshold baselines need confirmation for local environment variance.

## Decision Lock

| Decision ID | Required | Status  | Note                                     |
| ----------- | -------- | ------- | ---------------------------------------- |
| D-KG-004    | yes      | pending | Influences E2E determinism               |
| D-KG-005    | no       | pending | Affects open-definition route assertions |
