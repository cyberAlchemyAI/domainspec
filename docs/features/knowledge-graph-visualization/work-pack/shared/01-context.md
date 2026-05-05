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
- Feature concept graph edges must use canonical labels from [RELATIONSHIPS.md](../../../../../RELATIONSHIPS.md).
- Every graph edge endpoint must resolve to a known concept ID in feature concept tables.
- Deep-link open must return explicit error diagnostics when target cannot be resolved.

## Execution Streams

1. Stream A (backend projection): parser, canonical validation, projection storage.
2. Stream B (backend API): read contracts plus select/open interaction operations.
3. Stream C (UI): cards, graph, details, and definition navigation UX.
4. Stream D (verification): tests, readiness evidence, verify/alignment/layering audits.

## legacy Reuse Inventory (Code Already Implemented)

### Reuse with adaptation

- [backend/src/server.ts](../../../../../backend/src/server.ts): Fastify app bootstrap, route registration pattern, and baseline health contract.
- [backend/src/server.test.ts](../../../../../backend/src/server.test.ts): inject harness pattern for endpoint-level contract tests.
- [apps/web/src/App.tsx](../../../../../apps/web/src/App.tsx): base component composition shell for feature surface insertion.
- [apps/web/src/main.tsx](../../../../../apps/web/src/main.tsx): client bootstrap and root render wiring.

### Reuse as-is

- No KG-specific reusable module remains as-is in current baseline; treat projection/graph contracts as fresh implementation from docs.

### Do not reuse unchanged

- Deleted legacy modules under `backend/src/knowledge-graph*.ts` and repository-import helpers must not be restored verbatim.
- Deleted legacy endpoint assumptions in UI hooks/components must not be reintroduced unless backed by current interfaces.
- `apps/web/src/hooks/useEdgeTypeProjection.ts` legacy contract `/knowledge-graph/projections/edge-types` must not be reused unless that route is explicitly implemented in this cycle.

## Success Criteria

- Required mirror cards are always present.
- Graph and cards remain synchronized to same snapshot.
- Concept click reliably opens definition pointer.
- Detail card always reflects selected concept and related edges.
- Pilot profile reaches PASS or explicit dated FLAG with action owners.
