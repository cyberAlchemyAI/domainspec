# TASK-KG-IMP-10 - Frontend Navigation Regression and Inspector Relation Rendering

## Goal

Fix the frontend regression where concept drilldown does not restore correctly with browser Back/Forward and align inspector relation rendering with concept-detail payload fields so console duplicate-key warnings are eliminated.

## Wave Assignment

- Primary wave: W2
- Closure wave: W3

## Status

not-started

## DomainSpec Coverage

| Source                                                 | Coverage IDs                                                   |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| [UI-SPEC.md](../../UI-SPEC.md)                         | Interaction Contract Level 2/3/4, OpenDefinitionAction         |
| [TEST-SPEC.md](../../TEST-SPEC.md)                     | KG-UI-NAV-002, KG-UI-JRN-003, KG-UI-STATE-003, KG-UI-STATE-004 |
| [STORIES.md](../../STORIES.md)                         | US-3, US-4                                                     |
| [IMPLEMENTATION-PLAN.md](../../IMPLEMENTATION-PLAN.md) | Regression Recovery Plan (2026-05-07)                          |

## Architecture References

- [UI-ARCHITECTURE.md](../../../../UI-ARCHITECTURE.md)
- [Architecture Pattern Library - UI Concepts](../../../../../architecture/ARCHITECTURE-PATTERN-LIBRARY.md)
- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)

## Implementation Directives

- Preserve deterministic URL-as-state behavior while making user-driven drilldowns browser-history navigable.
- Keep transport contracts in API hooks and rendering concerns in components.
- Align concept-detail relation typing with backend payload shape (`fromConceptId`, `toConceptId`).
- Use stable composite keys for relation rows to eliminate duplicate-key rendering warnings.
- Keep open-definition behavior and error mapping unchanged except for navigation stability.

## Execution Steps

1. Patch route/history synchronization to distinguish user-driven transitions from passive state sync.
2. Add `popstate` restore behavior so Back/Forward rebuilds `activeAspect`, `viewLevel`, `selectedFeatureId`, `selectedGroupKey`, and `selectedCardId` deterministically.
3. Align inspector relation rendering fields with concept-detail payload endpoints and stable key generation.
4. Update UI-SPEC wording where needed to explicitly require browser-history restoration semantics.
5. Update/add Playwright scenarios covering concept drilldown plus browser Back restoration (`KG-UI-NAV-002`).
6. Run verification bundle and capture evidence.

## Todo Checklist

- [x] Root-cause pipeline enforcement drift documented.
- [x] Orchestrator workflow enforcement patched across mirrors.
- [ ] Implement frontend history/back-navigation fix.
- [ ] Implement inspector relation mapping/key fix.
- [ ] Update UI contract/spec text for history restoration.
- [ ] Update/add targeted Playwright cases for `KG-UI-NAV-002`.
- [ ] Run `pnpm --filter @domainspec/web check`.
- [ ] Run `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization`.
- [ ] Perform live smoke on `/knowledge-graph?projectKey=domainspec-core&featureId=player-management`.
- [ ] Sync status in `WORK-PACK.md` and `work-pack/waves/W2.md`.

## Completion Criteria

- Browser Back/Forward restores prior board state after concept drilldown.
- Concept/detail inspector renders relation endpoints correctly with no duplicate-key warnings in runtime console.
- KG UI E2E suite passes with explicit navigation regression coverage.
- Work-pack and wave documents are synchronized with evidence links and status.

## Verification Evidence

- `pnpm --filter @domainspec/web check`
- `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization`
- Runtime smoke capture demonstrating concept drilldown then browser Back restoration.

## Gaps and Questions

- Decide whether history writes should occur only for user interactions or also for server-driven board normalization events.

## Decision Lock

| Decision ID | Required | Status      | Note                                                                  |
| ----------- | -------- | ----------- | --------------------------------------------------------------------- |
| D-KG-003    | yes      | selected    | Concept-click behavior remains the core interaction invariant.        |
| D-KG-004    | yes      | selected    | Deterministic board layout remains mandatory during regression fixes. |
| D-KG-010    | yes      | in-progress | Browser-history semantics for drilldown restoration need final lock.  |
