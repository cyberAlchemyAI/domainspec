# Implementation Plan: Knowledge Graph Whiteboard Pivot

## Goal

Implement the whiteboard-first knowledge graph experience defined in [SPEC.md](SPEC.md), backend contracts ([operations.md](operations.md), [queries.md](queries.md), [interfaces.md](interfaces.md), [workflows.md](workflows.md)), and [UI-SPEC.md](UI-SPEC.md).

## Scope

- Aspect-card rail for feature files.
- SPEC-level feature atlas board with cross-feature edges.
- Feature drilldown board with concept cards grouped by aspect and story cards.
- Concept/aspect navigation into definition-focused visualization.
- Cross-project scope support using `(projectKey, featureId)`.

## Wave Plan

### Wave 0 - Contract Lock and Data Shapes

- Lock terminal-safe docs validation command pattern (run checks in a subshell; never `exit` the parent interactive shell).
- Confirm terminology and enums: `viewLevel`, `cardType`, `activeAspect`.
- Define persistence DTOs for:
  - aspect cards,
  - whiteboard cards,
  - whiteboard edges,
  - board snapshots by scope.
- Freeze API payload examples for all board levels.

Exit criteria:

- Contract docs approved.
- Link-check loop runs with per-file output and leaves terminal session alive.
- API payload fixtures committed in tests.

### Wave 1 - Backend Projection and Scope Engine

- Implement scope resolution and trusted source roots.
- Extend projection rebuild to parse relationship index from SPEC:
  - Feature Concept Graph,
  - Cross-Feature Dependencies,
  - Produces For.
- Build whiteboard card/edge payloads for:
  - `viewLevel=aspect` at SPEC,
  - `viewLevel=feature` after feature card selection,
  - `viewLevel=concept` after concept card selection.

Exit criteria:

- Backend tests pass for rebuild and all read queries.
- Unknown scope and invalid relationship-index failures return deterministic error codes.

### Wave 2 - Backend Interaction Semantics

- Implement card-selection semantics in `SelectConcept` for `feature`, `story`, `concept-group`, and `concept` cards.
- Implement aspect-aware `OpenDefinition` pointer behavior.
- Persist exploration session state needed for deterministic transitions.

Exit criteria:

- Operation tests pass for selection transitions and open-definition behavior.
- Example path supports `player-makeup` -> `MakeupBalance` domain navigation.

### Wave 3 - UI Whiteboard Surface

- Implement `AspectCardRail` and board-level route/query state sync.
- Implement `WhiteboardCanvas` with card-type rendering and grouped concept views.
- Implement `CardInspectorPanel` for summary, relations, and open-definition action.
- Keep keyboard and screen-reader fallback list parity.

Exit criteria:

- UI unit/integration tests pass for level transitions and selection behavior.
- No regressions in existing knowledge-graph route rendering.

### Wave 4 - End-to-End and Verification

- Add E2E scenarios:
  - select aspect,
  - inspect SPEC atlas,
  - click feature card,
  - inspect grouped concept/story cards,
  - click concept,
  - open definition.
- Run readiness checks and produce verification artifacts.

Exit criteria:

- E2E green for whiteboard path.
- Feature verification and audits are publishable.

## Execution Order

1. Backend data model and projection update.
2. Backend read/mutation contract update.
3. UI state model and layout update.
4. Integration + E2E validation.
5. Verify + alignment + layering audits.

## Demo Checkpoint

Reference flow for iterative demo:

1. `projectKey=poker-team`, `featureId=player-makeup`
2. SPEC board shows feature cards and cross-feature links.
3. Click feature card `player-makeup`.
4. Board shows grouped concept cards and stories.
5. Click concept `MakeupBalance`.
6. Domain view opens with `domain.md#makeupbalance` detail.
