# Tasks: Knowledge Graph Visualization

## Ordered Tasks (Whiteboard Pivot)

1. ops/docs: enforce terminal-safe markdown link validation command pattern (no parent-shell `exit`) and keep per-file output visible.
1. docs: finalize whiteboard-first contracts in [SPEC.md](SPEC.md), [operations.md](operations.md), [queries.md](queries.md), [interfaces.md](interfaces.md), [workflows.md](workflows.md), and [UI-SPEC.md](UI-SPEC.md).
1. backend: implement projection index model for aspect cards + whiteboard cards/edges with scope key `(projectKey, featureId)`.
1. backend: parse SPEC relationship index sources (Feature Concept Graph, Cross-Feature Dependencies, Produces For) into canonical whiteboard edges.
1. backend: implement `GET /mirror-cards` for aspect rail and `GET /graph` for whiteboard board levels (`aspect`, `feature`, `concept`).
1. backend: implement grouped concept-card derivation by aspect source file and story-card derivation for selected feature.
1. backend: implement `SelectConcept` card-selection state model and `OpenDefinition` with aspect-aware pointer resolution.
1. ui: implement three-surface layout (`AspectCardRail`, `WhiteboardCanvas`, `CardInspectorPanel`) and route-query state.
1. ui: implement SPEC-level feature atlas board (feature cards + cross-feature edges).
1. ui: implement feature drilldown board (concept groups + concept cards + story cards).
1. ui: implement aspect/definition navigation (for example `MakeupBalance` opens domain visualization and description).
1. governance: enforce bugfix workflow gate so mutation requests must bootstrap/update `WORK-PACK.md` and `TASK-*` before implementation.
1. ui: fix browser Back/Forward restoration after concept drilldown (`aspect -> feature -> concept`).
1. ui: align concept-detail relation rendering with concept-edge payload fields and eliminate duplicate-key warnings.
1. test: add backend tests for board-level graph payloads, grouping, and relationship-index traceability.
1. test: add UI tests for full flow: aspect select -> feature click -> grouped concept view -> concept click -> open definition.
1. test: add regression coverage for browser Back restoration and inspector relation rendering stability on concept focus.
1. verify: run feature verification and alignment/layering audits before readiness gate.

## Example Acceptance Path (Poker Team)

1. Select source `projectKey=poker-team` and feature `player-makeup`.
2. At SPEC aspect level, whiteboard shows feature cards and cross-feature relations.
3. Click `player-makeup` card.
4. Whiteboard shows grouped concept cards and story cards.
5. Click concept `MakeupBalance`.
6. Domain visualization opens with `MakeupBalance` description from `domain.md#makeupbalance`.

## Ownership Labels

- docs: DomainSpec contracts and cross-link correctness.
- backend: projection index, relationship extraction, and API contracts.
- ui: aspect rail, whiteboard interactions, and detail navigation.
- test: backend contract tests and whiteboard UI journeys.
- verify: verification, alignment, and layering evidence publication.
