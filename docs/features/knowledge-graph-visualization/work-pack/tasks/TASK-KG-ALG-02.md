# TASK-KG-ALG-02 - Source Registry Abstraction and Full-Index Ingestion Plan

## Goal

Define a source-registry abstraction and full-index ingestion strategy that supports cross-project projection without exclusivity to poker-team.

## Wave Assignment

- Primary wave: W1

## Status

not-started

## Prerequisite

- [TASK-KG-ALG-01.md](TASK-KG-ALG-01.md)

## DomainSpec Coverage

| Source                               | Coverage IDs                                                  |
| ------------------------------------ | ------------------------------------------------------------- |
| [operations.md](../../operations.md) | ResolveProjectionScope.R1..R3, RebuildMirrorProjection.R0..R6 |
| [interfaces.md](../../interfaces.md) | ProjectSourceRegistry, KnowledgeGraphAPI                      |
| [queries.md](../../queries.md)       | GetMirrorCards, GetRelationshipGraph                          |
| [SPEC.md](../../SPEC.md)             | Cross-Project Documentation Scope capability                  |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | KG-BE-OP-001..010, KG-BE-API-001..006                         |

## Architecture References

- [ARCHITECTURE.md](../../../../../ARCHITECTURE.md)
- [DEPENDENCY-RULES.md](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)
- [UI-ARCHITECTURE.md](../../../../UI-ARCHITECTURE.md)

## Implementation Directives

1. Keep source strategy non-exclusive and registry-governed.
2. Treat poker-team as baseline/example evidence only.
3. Define full-index ingestion order and fallback behavior for missing index files.
4. Preserve strict `(projectKey, featureId)` scope invariants through rebuild/read/select/open-definition paths.
5. Define explicit validation for root/path safety and unsupported-source rejection.

## Completion Criteria

- [ ] Non-exclusive source strategy is explicit and test-linked.
- [ ] Full-index ingestion order is deterministic and documented.
- [ ] Scope-safety and source-registry failure modes are mapped to error obligations.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-ALG-02.md`
- `rg -n "ResolveProjectionScope|projectKey|featureId|non-exclusive|poker-team" docs/features/knowledge-graph-visualization/{SPEC.md,operations.md,interfaces.md,work-pack/tasks/TASK-KG-ALG-02.md}`

## Gaps and Questions

- Ingestion fallback precedence for missing index artifacts (`KG-ALG-GAP-002`, `KG-ALG-Q-002`).

## Decision Lock

| Decision ID | Required | Status   | Note                                                                 |
| ----------- | -------- | -------- | -------------------------------------------------------------------- |
| D-KG-012    | yes      | selected | Poker-team is baseline/example only; strategy remains non-exclusive. |
| D-KG-009    | yes      | selected | Scope invariants remain strict across operations and queries.        |
