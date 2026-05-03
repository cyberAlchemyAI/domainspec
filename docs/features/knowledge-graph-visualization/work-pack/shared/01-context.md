# KG Work-Pack Context

## Feature Objective

Rebuild the Knowledge Graph feature as a mirror-first product surface where:

- cards mirror feature files,
- graph mirrors canonical concept relationships,
- clicking a concept resolves to its definition,
- concept detail card shows related context and relation evidence.

## Source of Truth

- [SPEC.md](../../SPEC.md)
- [domain.md](../../domain.md)
- [operations.md](../../operations.md)
- [queries.md](../../queries.md)
- [interfaces.md](../../interfaces.md)
- [mappings.md](../../mappings.md)
- [workflows.md](../../workflows.md)
- [events.md](../../events.md)
- [states.md](../../states.md)
- [UI-SPEC.md](../../UI-SPEC.md)
- [TEST-SPEC.md](../../TEST-SPEC.md)

## Scope In

- Backend projection pipeline from docs to cards and graph.
- Canonical relationship validation and endpoint resolution.
- Read and interaction API contracts.
- UI three-pane interaction surface (cards, graph, detail panel).
- Deterministic test obligations and pilot-readiness verification path.

## Scope Out (Initial current)

- Multi-feature federation in one graph canvas.
- Shared annotation/comment workflow.
- Auto-remediation of missing anchors.

## Hard Constraints

- Required mirror cards must include `SPEC.md`, `domain.md`, and `operations.md`.
- Feature concept graph edges must use canonical labels from [RELATIONSHIPS.md](../../../../RELATIONSHIPS.md).
- Every graph edge endpoint must resolve to a known concept ID in feature concept tables.
- Deep-link open must return explicit error diagnostics when target cannot be resolved.

## Execution Streams

1. Stream A (backend projection): parser, canonical validation, projection storage.
2. Stream B (backend API): read contracts plus select/open interaction operations.
3. Stream C (UI): cards, graph, details, and definition navigation UX.
4. Stream D (verification): tests, readiness evidence, verify/alignment/layering audits.

## legacy Reuse Inventory (Code Already Implemented)

### Reuse with adaptation

- [backend/src/knowledge-graph-docs-import.ts](../../../../backend/src/knowledge-graph-docs-import.ts): markdown traversal/frontmatter/anchor helpers and overlay flow.
- [backend/src/knowledge-graph-repository.ts](../../../../backend/src/knowledge-graph-repository.ts): DB init transaction, schema bootstrap pattern, runtime load lifecycle.
- [backend/src/server.ts](../../../../backend/src/server.ts): request parsing and validation helper pattern, database-availability gate, observability hook placement.
- [apps/web/src/lib/api.ts](../../../../apps/web/src/lib/api.ts): API transport and normalized error parsing.
- [backend/src/server.test.ts](../../../../backend/src/server.test.ts): Fastify inject harness and contract assertion structure.
- [apps/web/e2e/knowledge-graph-visualization/atlas.spec.ts](../../../../apps/web/e2e/knowledge-graph-visualization/atlas.spec.ts): Playwright route mocking and deterministic UI assertions.

### Reuse as-is

- [backend/src/auth.ts](../../../../backend/src/auth.ts) and [backend/src/scopes.ts](../../../../backend/src/scopes.ts): scope-token and authorization behavior.
- Canonical taxonomy/edge guards in [backend/src/knowledge-graph.ts](../../../../backend/src/knowledge-graph.ts): `CONCEPT_TYPES`, `EDGE_TYPES`, `isConceptType`, `isEdgeType`.

### Do not reuse unchanged

- legacy in-memory seed and capability-centric runtime model in [backend/src/knowledge-graph.ts](../../../../backend/src/knowledge-graph.ts).
- legacy endpoint assumptions in UI hooks/components that do not exist in current contracts.
- [apps/web/src/hooks/useEdgeTypeProjection.ts](../../../../apps/web/src/hooks/useEdgeTypeProjection.ts) contract `/knowledge-graph/projections/edge-types` unless backend route is implemented.

## Success Criteria

- Required mirror cards are always present.
- Graph and cards remain synchronized to same snapshot.
- Concept click reliably opens definition pointer.
- Detail card always reflects selected concept and related edges.
- Pilot profile reaches PASS or explicit dated FLAG with action owners.
