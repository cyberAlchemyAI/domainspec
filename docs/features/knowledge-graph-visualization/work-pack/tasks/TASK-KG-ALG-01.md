# TASK-KG-ALG-01 - Freeze Deterministic Algorithm Contract

## Goal

Freeze the deterministic algorithm contract and authority sequence as `feature -> file -> concept`, including edge semantics and deterministic rendering constraints.

## Wave Assignment

- Primary wave: W1

## Status

in-progress

## Prerequisite

- [W0.md](../waves/W0.md)

## DomainSpec Coverage

| Source                             | Coverage IDs                                                     |
| ---------------------------------- | ---------------------------------------------------------------- |
| [SPEC.md](../../SPEC.md)           | FR-001, FR-002, FR-003, FR-004, AC-001..AC-006, INV-001..INV-003 |
| [domain.md](../../domain.md)       | RelationshipEdge, ConceptDefinition, MirrorProjection            |
| [queries.md](../../queries.md)     | GetRelationshipGraph, GetConceptDetailCard                       |
| [mappings.md](../../mappings.md)   | DocumentToConceptMapping, ConceptToDetailCardAdapter             |
| [TEST-SPEC.md](../../TEST-SPEC.md) | KG-BE-QRY-005..012, KG-BE-CAP-002                                |

## Architecture References

- [ARCHITECTURE.md](../../../../../ARCHITECTURE.md)
- [RELATIONSHIPS.md](../../../../../RELATIONSHIPS.md)
- [UI-ARCHITECTURE.md](../../../../UI-ARCHITECTURE.md)

## Implementation Directives

1. Freeze one canonical ordering strategy for graph construction inputs.
2. Specify deterministic tie-break behavior for equal-rank nodes/edges.
3. Keep `type/from/to/why` edge label semantics mandatory and sourced from canonical relationship rows.
4. Keep relation-color mapping deterministic, including unknown-label fallback behavior.
5. Define markdown-link validation coverage for all referenced concept/type/field links in planning artifacts.

## Completion Criteria

- [ ] Deterministic hierarchy contract is explicitly frozen as `feature -> file -> concept` in this task output.
- [ ] Edge semantics and color fallback behavior are documented with no unresolved blocker decisions.
- [ ] Traceability links from FR/AC/INV to tasks remain valid.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-ALG-01.md`
- `rg -n "FR-001|AC-001|INV-001|feature -> file -> concept|RelationshipEdge" docs/features/knowledge-graph-visualization/{SPEC.md,domain.md,work-pack/tasks/TASK-KG-ALG-01.md}`

## Gaps and Questions

- Tie-break determinism for equal-weight edges (tracked as `KG-ALG-GAP-001`).
- Unknown relation-color fallback hash input scope (`KG-ALG-Q-001`).

## Decision Lock

| Decision ID | Required | Status   | Note                                                               |
| ----------- | -------- | -------- | ------------------------------------------------------------------ |
| D-KG-013    | yes      | selected | Deterministic hierarchy stays `feature -> file -> concept`.        |
| D-KG-014    | yes      | selected | Prototype-first anchor supports interaction planning context only. |
