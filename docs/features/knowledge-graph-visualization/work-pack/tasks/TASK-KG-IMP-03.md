# TASK-KG-IMP-03 - UI Mirror Cards, Graph Canvas, and Concept Detail Interactions

## Goal

Implement the current UI surface with synchronized mirror cards, relationship graph, and concept detail panel plus deep-link action.

## Wave Assignment

- Primary wave: W2

## Status

not-started

## DomainSpec Coverage

| Source                             | Coverage IDs                                                                                                                                                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [UI-SPEC.md](../../UI-SPEC.md)     | ui.knowledge-graph-visualization.route.canvas, KnowledgeGraphPageLayout, MirrorCardGrid, RelationshipGraphCanvas, ConceptDetailPanel, useMirrorGraph, useConceptFocus, NavigateToDefinitionAction, FocusStateIndicator |
| [states.md](../../states.md)       | ExplorationState, I1, I2, I3                                                                                                                                                                                           |
| [workflows.md](../../workflows.md) | MirrorInteractionWorkflow, CardSyncPolicy                                                                                                                                                                              |
| [STORIES.md](../../STORIES.md)     | US-1, US-3, US-4                                                                                                                                                                                                       |
| [TEST-SPEC.md](../../TEST-SPEC.md) | KG-UIE2E-001..004                                                                                                                                                                                                      |

## Architecture References

- [UI-ARCHITECTURE.md](../../../../UI-ARCHITECTURE.md)
- [Architecture Pattern Library - UI Concepts](../../../../../architecture/ARCHITECTURE-PATTERN-LIBRARY.md)
- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)

## Implementation Directives

- Implement exactly one page with three synchronized regions (cards, graph, detail).
- Use query/mutation hooks defined in UI-SPEC; avoid embedding transport logic in presentational components.
- Keep focus-state transitions aligned with ExplorationState machine.
- Ensure keyboard and accessibility behavior for concept selection and open-definition action.
- Keep graph layout deterministic to stabilize E2E behavior.

## Reusable legacy Assets

| Asset                                                                                                                                                                             | Reuse Mode            | Required Adaptation                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [apps/web/src/App.tsx](../../../../../apps/web/src/App.tsx) page shell composition baseline                                                                                       | reuse with adaptation | Expand starter page into three synchronized regions (cards, graph, detail) using current UI-SPEC contracts.                |
| [apps/web/src/main.tsx](../../../../../apps/web/src/main.tsx) app bootstrap and root mounting pattern                                                                             | reuse mostly as-is    | Keep root bootstrap and wire providers/config needed by current query and interaction hooks.                               |
| [apps/web/src/styles.css](../../../../../apps/web/src/styles.css) baseline styling entrypoint                                                                                     | reuse with adaptation | Reuse global stylesheet entrypoint and introduce current design tokens/layout classes from UI-SPEC.                        |
| [apps/web/package.json](../../../../../apps/web/package.json) dependency and script surface                                                                                       | reuse with adaptation | Reuse dependency/scripts baseline while adding current test/build script requirements for KG interactions.                 |
| Removed legacy UI modules (`apps/web/src/lib/api.ts`, `apps/web/src/lib/query-keys.ts`, `apps/web/src/components/knowledge-graph/*`, `apps/web/src/hooks/useConceptInspector.ts`) | re-implement          | Recreate API client, hooks, and graph/detail components in current module layout; do not restore deleted modules verbatim. |

## legacy Carryover Limits

- Do not reuse legacy component naming/contract assumptions (`AtlasPanel`, `HolisticFeaturePanel`) as authoritative current UX semantics.
- Do not depend on deleted hook `apps/web/src/hooks/useEdgeTypeProjection.ts` without backend endpoint support.

## Execution Steps

1. Implement route and layout shell.
2. Implement mirror card grid with required-card visibility and freshness badges.
3. Implement graph canvas with concept click behavior.
4. Implement detail panel with inbound/outbound relation rendering and open-definition action.
5. Integrate focus-state indicator and error-handling UX.

## Completion Criteria

- UI three-pane surface renders and updates in sync.
- Concept click updates detail panel consistently.
- Open-definition action resolves target or shows explicit error message.
- KG-UIE2E-001..004 pass.

## Verification Evidence

- Web check/build output.
- Playwright E2E output for all KG UI IDs.

## Gaps and Questions

- Deterministic layout engine decision remains open.
- Optional aspect-card default visibility remains open.

## Decision Lock

| Decision ID | Required | Status  | Note                             |
| ----------- | -------- | ------- | -------------------------------- |
| D-KG-004    | yes      | pending | Layout engine choice             |
| D-KG-006    | yes      | pending | Optional card visibility default |
