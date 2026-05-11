# TASK-KG-ALG-04 - Prototype-to-Contract Mapping and UI Behavior Plan

## Goal

Map prototype interactions to retained UI and backend contracts, producing a deterministic UI behavior plan with explicit route-state transitions.

## Wave Assignment

- Primary wave: W2

## Status

not-started

## Prerequisite

- [TASK-KG-ALG-01.md](TASK-KG-ALG-01.md)
- [TASK-KG-ALG-02.md](TASK-KG-ALG-02.md)

## DomainSpec Coverage

| Source                                                       | Coverage IDs                                                                  |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [WHITEBOARD-PROTOTYPE.html](../../WHITEBOARD-PROTOTYPE.html) | prototype behavior anchor                                                     |
| [UI-SPEC.md](../../UI-SPEC.md)                               | Interaction Contract levels 1-5, route query parameters                       |
| [SPEC.md](../../SPEC.md)                                     | Graph Layout and Edge Semantics capability, Cross-Project Documentation Scope |
| [TEST-SPEC.md](../../TEST-SPEC.md)                           | KG-UI-NAV-001..002, KG-UI-JRN-001..004, KG-UI-STATE-001..004                  |
| [interfaces.md](../../interfaces.md)                         | graph/detail/open-definition endpoint contracts                               |

## Architecture References

- [ARCHITECTURE.md](../../../../../ARCHITECTURE.md)
- [UI-ARCHITECTURE.md](../../../../UI-ARCHITECTURE.md)
- [TEST-PIPELINE.md](../../../../../TEST-PIPELINE.md)

## Implementation Directives

1. Build a behavior-mapping table from prototype controls to UI-SPEC route/query state fields.
2. Preserve deterministic drilldown history (`concept -> feature -> aspect`) behavior.
3. Keep cross-feature edge navigation and highlight semantics explicit and testable.
4. Ensure prototype visual semantics do not override canonical relationship or state contracts.
5. Prepare UI test-generation obligations (`domainspec-generate-tests --ui`) as closure-ready plan output.

## Completion Criteria

- [ ] Prototype interactions are mapped to contract-level UI states and actions.
- [ ] Behavior mapping is linked to existing UI and backend test IDs.
- [ ] Route/query-state transition plan is deterministic and reviewable.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-ALG-04.md`
- `rg -n "viewLevel|activeAspect|selectedCardId|KG-UI-NAV|KG-UI-JRN|DefinitionOpened" docs/features/knowledge-graph-visualization/{UI-SPEC.md,TEST-SPEC.md,SPEC.md,work-pack/tasks/TASK-KG-ALG-04.md}`

## Gaps and Questions

- Internal-state vs query-param state mapping granularity remains open (`KG-ALG-GAP-004`, `KG-ALG-Q-004`).

## Decision Lock

| Decision ID | Required | Status   | Note                                                                   |
| ----------- | -------- | -------- | ---------------------------------------------------------------------- |
| D-KG-014    | yes      | selected | Prototype is the planning anchor for behavior mapping.                 |
| D-KG-013    | yes      | selected | Deterministic hierarchy contract constrains UI behavior decomposition. |
