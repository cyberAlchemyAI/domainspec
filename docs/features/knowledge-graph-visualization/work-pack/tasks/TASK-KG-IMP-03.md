# TASK-KG-IMP-03 - Whiteboard UI, Aspect Navigation, and Inspector Interactions

## Goal

Implement the current whiteboard UI surface with synchronized aspect rail, whiteboard canvas, and card inspector panel plus open-definition action.

## Wave Assignment

- Primary wave: W2

## Status

in-progress

## DomainSpec Coverage

| Source                             | Coverage IDs                                                                                                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [UI-SPEC.md](../../UI-SPEC.md)     | ui.knowledge-graph-visualization.route.canvas, KnowledgeGraphPageLayout, AspectCardRail, WhiteboardCanvas, WhiteboardCard, CardInspectorPanel, useMirrorGraph, useConceptFocus, OpenDefinitionAction, FocusStateIndicator |
| [states.md](../../states.md)       | ExplorationState, I1, I2, I3                                                                                                                                                                                              |
| [workflows.md](../../workflows.md) | MirrorInteractionWorkflow, CardSyncPolicy                                                                                                                                                                                 |
| [STORIES.md](../../STORIES.md)     | US-1, US-3, US-4                                                                                                                                                                                                          |
| [TEST-SPEC.md](../../TEST-SPEC.md) | KG-UI-NAV-001, KG-UI-JRN-001..004, KG-UI-FORM-001..002, KG-UI-STATE-001..004, KG-UI-A11Y-001..002                                                                                                                         |

## Architecture References

- [UI-ARCHITECTURE.md](../../../../UI-ARCHITECTURE.md)
- [Architecture Pattern Library - UI Concepts](../../../../../architecture/ARCHITECTURE-PATTERN-LIBRARY.md)
- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)

## Implementation Directives

- Implement exactly one page with three synchronized regions (aspect rail, whiteboard canvas, inspector panel).
- Use query/mutation hooks defined in UI-SPEC; avoid embedding transport logic in presentational components.
- Keep focus-state and board-level transitions aligned with ExplorationState and `viewLevel` contract.
- Implement drill flow semantics: `aspect -> feature -> concept` with `selectedFeatureId` and `selectedGroupKey` propagation.
- Ensure keyboard and accessibility behavior for card focus and open-definition action.
- Keep whiteboard layout deterministic to stabilize E2E behavior.

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
2. Implement `AspectCardRail` with active aspect state and required-card guarantees.
3. Implement `WhiteboardCanvas` for `viewLevel=aspect` feature-card board.
4. Implement `WhiteboardCanvas` drilldown for `viewLevel=feature` concept-group and concept-card boards.
5. Implement `CardInspectorPanel` for focused card detail and open-definition action.
6. Integrate focus-state indicator, board-level state transitions, and error-handling UX.

## Completion Criteria

- UI three-region surface renders and updates in sync across aspect/feature/concept levels.
- Aspect selection and board drilldown transitions are deterministic and URL/query-state consistent.
- Concept click updates inspector panel consistently.
- Open-definition action resolves target or shows explicit error message.
- Required UI navigation/journey/form/state/a11y obligations pass.

## Verification Evidence

- Web check/build output.
- Playwright E2E output for all KG UI IDs.
- Latest evidence (2026-05-06): web typecheck and production build pass with three-pane layout components present.

## Gaps and Questions

- No open design decisions; pending work is verification stabilization after whiteboard contract pivot.

## Decision Lock

| Decision ID | Required | Status   | Note                               |
| ----------- | -------- | -------- | ---------------------------------- |
| D-KG-004    | yes      | selected | Server-deterministic layout        |
| D-KG-006    | yes      | selected | Progressive optional-aspect reveal |
