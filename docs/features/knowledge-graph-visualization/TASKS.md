# Tasks: Knowledge Graph Visualization

## Ordered Tasks

1. docs: finalize current mirror-first contracts in SPEC, domain, operations, queries, and UI-SPEC.
2. backend: implement projection rebuild pipeline from markdown docs to cards and graph, persisted into database-backed read storage.
3. backend: implement read queries for mirror cards, graph, concept detail, and definition pointer.
4. backend: implement select/open operations with explicit error diagnostics.
5. ui: implement page layout with mirror card grid, relationship graph canvas, and concept detail panel.
6. ui: wire click interactions for concept focus and definition open.
7. test: add deterministic API, operation, and UI interaction tests from TEST-SPEC.
8. verify: run feature verification and alignment/layering audits before readiness gate.

## Reuse Candidates from legacy Audit

1. parser and docs scanning utilities: reuse `backend/src/knowledge-graph-docs-import.ts` helper functions (`listMarkdownFiles`, `extractFrontmatter`, `toAnchor`) and adapt parsing to current concept table + feature graph contracts.
2. database bootstrap pattern: reuse `backend/src/knowledge-graph-repository.ts` initialization/transaction flow (`loadIntoRuntime`, `ensureInitialized`, `readData`) while replacing schema and DTO mapping with current MirrorProjection entities.
3. canonical taxonomy guards: reuse `backend/src/knowledge-graph.ts` canonical sets/guards (`CONCEPT_TYPES`, `EDGE_TYPES`, `isConceptType`, `isEdgeType`) for validation boundaries.
4. api boundary and auth wiring: reuse `backend/src/server.ts` request parsing/validation helpers plus `backend/src/auth.ts` scope middleware.
5. web transport layer: reuse `apps/web/src/lib/api.ts` and `apps/web/src/lib/query-keys.ts` request/error/key primitives.
6. test harnesses: reuse backend inject harness in `backend/src/server.test.ts` and Playwright mock-route patterns in `apps/web/e2e/knowledge-graph-visualization/atlas.spec.ts`.
7. replace rather than reuse: do not carry over legacy hardcoded seed model and legacy-only endpoints from `backend/src/knowledge-graph.ts`; these must be replaced by markdown-to-db current projections.
8. replace or implement missing contract: legacy UI hook `apps/web/src/hooks/useEdgeTypeProjection.ts` targets `/knowledge-graph/projections/edge-types`, which is not implemented in backend routes and must be removed or implemented before reuse.

## Ownership Labels

- docs: DomainSpec contracts and cross-link correctness.
- backend: projection parsing, query contracts, and operation semantics.
- ui: cards + graph + details interaction surface.
- test: backend contracts and UI journeys.
- verify: verification, alignment, and layering evidence publication.
