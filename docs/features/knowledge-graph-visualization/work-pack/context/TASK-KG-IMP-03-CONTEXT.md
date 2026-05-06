# TASK-KG-IMP-03 Context Pack

## Context Pack Summary

- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-03
- Mode: standard
- Strict relevance gate: on
- Planner preflight gate: PASS (`plannerGateStatus=pass` in WORK-PACK.md)
- Framework constraints applied:
  - CHANGELOG 2.0.8 reviewed (delegation profile and telemetry updates; no additional retrieval constraints for context-builder artifacts)
  - CHANGELOG 2.0.4 enforced (strict selector+obligation binding, interested-data subsets, context index schema, and mode budgets)
- Files selected: 14
- Snippets selected: 48
- Excerpt lines: 263 / 280
- Obligation coverage: 10 / 10 (100%)
- Noise ratio: 0.03
- Output markdown: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-03-CONTEXT.md
- Output index: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-03-CONTEXT.index.json
- Blockers: 0

## Obligation Matrix

| Obligation ID | Requirement                                                                                                                          | Evidence Source                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| O1            | Task contract for UI stage remains bound to declared coverage IDs and decision lock (`D-KG-004`, `D-KG-006`).                        | TASK-KG-IMP-03 DomainSpec Coverage + Decision Lock                                                             |
| O2            | UI page route, three-pane layout, component inventory, hooks, and OpenDefinition UX contract follow UI-SPEC identifiers exactly.     | UI-SPEC Route Table, Component Inventory, Data Flow, OpenDefinitionAction, Accessibility, UI Concept Registry  |
| O3            | Exploration state transitions and invariants (`I1`, `I2`, `I3`) drive focus-state and navigation semantics.                          | states.md ExplorationState + Invariants                                                                        |
| O4            | Mirror interaction orchestration and card sync policy enforce deterministic board/detail synchronization and required-file behavior. | workflows.md MirrorInteractionWorkflow + CardSyncPolicy                                                        |
| O5            | User journeys for US-1, US-3, and US-4 remain authoritative for visible UI behavior and click-to-definition expectations.            | STORIES.md US-1, US-3, US-4 + Story Coverage Matrix                                                            |
| O6            | Verification coverage includes required UI IDs: NAV, JRN, FORM, STATE, and A11Y obligations.                                         | TEST-SPEC.md KG-UI-NAV-001, KG-UI-JRN-001..004, KG-UI-FORM-001..002, KG-UI-STATE-001..004, KG-UI-A11Y-001..002 |
| O7            | Architecture constraints enforce deterministic, contract-bound UI with CP-05 UI-read-binding and interface/adapters layering.        | UI-ARCHITECTURE.md + ARCHITECTURE-PATTERN-LIBRARY.md + LAYERING-REFERENCE.md                                   |
| O8            | Reusable asset baseline uses current app shell/bootstrap/styles/scripts with adaptation, not ad-hoc wiring.                          | TASK-KG-IMP-03 Reusable legacy Assets + apps/web source selectors                                              |
| O9            | Legacy carryover limits remain active (no old semantic naming authority and no deleted `useEdgeTypeProjection` dependency).          | TASK-KG-IMP-03 legacy Carryover Limits                                                                         |
| O10           | Relationship context remains an interested-data subset derived only from SPEC feature-graph edge labels relevant to this feature.    | SPEC.md Feature Concept Graph                                                                                  |

## Included Context

- docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-03.md
  - Why included: Primary task authority for coverage IDs, directives, reusable assets, carryover limits, and decision lock.
  - Selectors: `## DomainSpec Coverage` (line 15), `## Architecture References` (line 25), `## Implementation Directives` (line 31), `## Reusable legacy Assets` (line 40), `## legacy Carryover Limits` (line 50), `## Decision Lock` (line 82)
  - Obligation refs: O1, O8, O9

- docs/features/knowledge-graph-visualization/UI-SPEC.md
  - Why included: Canonical UI contract for route/layout/components/hooks/open-definition mapping and accessibility.
  - Selectors: `## Route Table` (line 33), `## Component Inventory` (line 99), `## Data Flow` (line 112), `### OpenDefinitionAction` (line 147), `## Accessibility Requirements` (line 177), `## UI Concept Registry` rows for required IDs (lines 193-205)
  - Obligation refs: O2, O6

- docs/features/knowledge-graph-visualization/states.md
  - Why included: State machine lifecycle and invariants that must be reflected in focus and open-definition behavior.
  - Selectors: `## ExplorationState` (line 3), invariant rows `I1`, `I2`, `I3` (lines 29-31)
  - Obligation refs: O3

- docs/features/knowledge-graph-visualization/workflows.md
  - Why included: Orchestration and policy constraints for deterministic card/graph/detail synchronization.
  - Selectors: `## MirrorInteractionWorkflow` (line 3), `## CardSyncPolicy` (line 53)
  - Obligation refs: O4

- docs/features/knowledge-graph-visualization/STORIES.md
  - Why included: User-behavior authority for required journeys and detail/deep-link expectations.
  - Selectors: `### US-1` (line 7), `### US-3` (line 55), `### US-4` (line 78), Story Coverage Matrix rows (lines 131-132)
  - Obligation refs: O5

- docs/features/knowledge-graph-visualization/TEST-SPEC.md
  - Why included: Required verification IDs for this UI stage.
  - Selectors: `KG-UI-NAV-001` (line 186), `KG-UI-JRN-001..004` (lines 187-190), `KG-UI-FORM-001..002` (lines 196-197), `KG-UI-STATE-001..004` (lines 203-206), `KG-UI-A11Y-001..002` (lines 213-214)
  - Obligation refs: O6

- docs/features/knowledge-graph-visualization/SPEC.md
  - Why included: Feature concept graph edge source used to derive relationship interested-data subset.
  - Selectors: `## Feature Concept Graph` (line 141), workflow/state rows (lines 151-159), UI binding rows (lines 174-179)
  - Obligation refs: O10, O4

- docs/UI-ARCHITECTURE.md
  - Why included: UI constitution for deterministic contracts, responsive behavior, and routing/component layout.
  - Selectors: `## Design Principles` items 1,2,5 (lines 33-37), `## Breakpoint Contract` (line 84), `## Routing and Page Structure` (line 92)
  - Obligation refs: O7

- architecture/ARCHITECTURE-PATTERN-LIBRARY.md
  - Why included: Pattern constraints for CP-05 ui-read-binding, UI concepts, and intra/cross-layer edges.
  - Selectors: `CP-05 ui-read-binding` row (line 34), `### UI Concepts (11)` (line 58), intra-UI edges (`renders/wraps/composes/consumes`) (lines 100-103), cross-layer edges (`fetches/reflects`) (lines 113-115)
  - Obligation refs: O7

- architecture/pattern-library/LAYERING-REFERENCE.md
  - Why included: Layering boundary for behavior in application and transport in interface/adapters.
  - Selectors: `### Application Layer` (line 18), `### Interface / Adapters Layer` (line 39)
  - Obligation refs: O7

- apps/web/src/App.tsx
  - Why included: Reuse baseline for route shell, hook composition (`useMirrorGraph`, `useConceptFocus`), and layout wiring.
  - Selectors: symbol `App` (line 8), constant `KNOWLEDGE_GRAPH_ROUTE` (line 6), imports for hooks/layout (lines 1-3), callbacks `onRefreshProjection` and `onOpenDefinition` (lines 74-80)
  - Obligation refs: O8, O2, O4

- apps/web/src/main.tsx
  - Why included: Root bootstrap and stylesheet entrypoint reuse baseline.
  - Selectors: imports for `App` and `styles.css` (lines 4-5), `ReactDOM.createRoot(...).render(...)` (line 7)
  - Obligation refs: O8

- apps/web/src/styles.css
  - Why included: Reuse baseline for design tokens, focus ring, three-pane layout grid, and responsive panel behavior.
  - Selectors: `:root` token block (line 3), `button:focus-visible`/`a:focus-visible` (line 58), `.kg-panels` three-column grid (line 257), responsive `@media (max-width: 940px)` layout collapse (line 593)
  - Obligation refs: O8, O2, O7

- apps/web/package.json
  - Why included: Script/dependency baseline for build/check/dev/preview/e2e loop.
  - Selectors: `scripts` entries `build/check/dev/preview/test:e2e` (lines 7-11), dependencies `react/react-dom` (lines 14-15), devDependency `vite` (line 23)
  - Obligation refs: O8

## Excluded Candidates

- docs/features/knowledge-graph-visualization/WORK-PACK.md
  - Why excluded: consulted for planner preflight only; no uncovered TASK-KG-IMP-03 contract obligation after task-specific sources were selected.

- docs/features/knowledge-graph-visualization/DECISIONS.md
  - Why excluded: TASK-KG-IMP-03 decision lock already records selected decisions with no unresolved choice for this stage.

- architecture/ARCHITECTURE.md
  - Why excluded: retrieval-map compatibility artifact only; direct architecture selectors from UI-ARCHITECTURE + pattern-library close obligations.

- docs/index/feature-map.md
  - Why excluded: not present.

- docs/index/features-index.json
  - Why excluded: not present.

- docs/index/tag-index.json
  - Why excluded: not present.

- apps/web/src/components/knowledge-graph/\*
  - Why excluded: wildcard path in task asset table has no selector-level binding in strict mode.

- apps/web/src/lib/api.ts
  - Why excluded: linked under legacy re-implementation note; task-level contracts are already satisfied via UI-SPEC data-flow selectors.

- apps/web/src/lib/query-keys.ts
  - Why excluded: linked under legacy re-implementation note; inclusion would duplicate obligations already bound to UI-SPEC query-key contracts.

- apps/web/src/hooks/useConceptInspector.ts
  - Why excluded: file is absent and explicitly listed as removed legacy module in task asset table.

- apps/web/src/hooks/useEdgeTypeProjection.ts
  - Why excluded: file is absent and explicitly forbidden by task carryover limits.

## Interested Data Subsets

- relationships (derived only from SPEC feature concept graph edge column):
  - applies
  - consumes
  - contains
  - displays
  - exposes
  - fetches
  - maps
  - mutates
  - orchestrates
  - produces
  - queries
  - reflects
  - renders
  - shapes
  - transitions
  - wraps

## Next Actions

1. Use this pack to finalize remaining UI synchronization and open-definition interaction paths against UI-SPEC/state/workflow constraints.
2. Stabilize Playwright selectors and waits for KG-UI-NAV/JRN/FORM/STATE/A11Y IDs in TEST-SPEC.
3. Keep style and layout changes bound to `styles.css` token/breakpoint contracts and avoid legacy semantic regressions.
