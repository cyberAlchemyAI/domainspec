---
id: knowledge-graph-visualization-ui
feature: knowledge-graph-visualization
title: "Knowledge Graph Visualization UI Specification"
summary: Aspect-card rail and whiteboard card graph for cross-feature and concept navigation.
status: draft
pillar: platform
domain: knowledge-graph-visualization-ui
audience:
  - developers
priority: p1
lang: en
owners:
  - web-core
updatedAt: 2026-05-06
dependencies:
  - SPEC.md
  - interfaces.md
  - operations.md
  - queries.md
  - states.md
includes: []
constitution: docs/UI-ARCHITECTURE.md
---

# UI Specification: Knowledge Graph Visualization

> Governs the frontend presentation of aspect cards, whiteboard card graphs, feature drilldown, and concept definition navigation.
> Constrained by [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md).

---

## Route Table

| Route              | Page Title      | Layout                   | Auth Required | Permission         |
| ------------------ | --------------- | ------------------------ | ------------- | ------------------ |
| `/knowledge-graph` | Knowledge Graph | KnowledgeGraphPageLayout | Yes           | domainspec.kg.read |

### Route Query Parameters

| Parameter      | Type   | Required | Default        | Description                     |
| -------------- | ------ | -------- | -------------- | ------------------------------- |
| projectKey     | string | no       | local source   | Documentation workspace key     |
| featureId      | string | no       | active feature | Feature slug in selected source |
| activeAspect   | string | no       | SPEC           | Active aspect card              |
| viewLevel      | string | no       | aspect         | `aspect`, `feature`, `concept`  |
| selectedCardId | string | no       | none           | Currently focused board card    |

---

## Page Layouts

### /knowledge-graph (Knowledge Graph)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ Header: source selector + feature selector + state indicator + rebuild control          │
├───────────────┬───────────────────────────────────────────────────────────┬───────────────┤
│ AspectCardRail│ WhiteboardCanvas                                           │ CardInspector │
│ - SPEC        │ - SPEC level: feature cards + cross-feature edges         │ - card title  │
│ - domain      │ - Feature level: concept cards + story cards               │ - summary     │
│ - operations  │ - Concept groups by aspect file                            │ - relations   │
│ - TEST-SPEC   │ - Click cards to drill down / switch aspect                │ - open action │
└───────────────┴───────────────────────────────────────────────────────────┴───────────────┘
```

---

## Interaction Contract

### Level 1: Aspect Selection

1. User selects aspect card (SPEC/domain/operations/TEST-SPEC/etc).
2. Whiteboard reloads using selected `activeAspect` and current `viewLevel`.
3. Inspector resets to currently selected card in that board.

### Level 2: SPEC Feature Atlas

1. At `activeAspect=SPEC` and `viewLevel=aspect`, whiteboard renders feature cards.
2. Cross-feature edges are rendered from SPEC relationship index sources.
3. Clicking feature card sets `viewLevel=feature` and `selectedFeatureId`.

### Level 3: Feature Drilldown

1. Whiteboard renders concept cards and story cards for selected feature.
2. Concept cards are grouped by source aspect file (domain, operations, states, etc).
3. Clicking concept group keeps `viewLevel=feature` and filters concepts by group.
4. Clicking concept card sets `viewLevel=concept` and loads concept detail.

### Level 4: Aspect/Concept Visualization

1. Clicking a concept card (for example `MakeupBalance`) switches board to concept focus.
2. If concept belongs to domain aspect, UI activates domain visualization.
3. Inspector shows description, inbound/outbound links, and evidence.
4. Open definition action navigates to `filePath#anchor`.

---

## Component Inventory

| Component                  | Type            | Location (target)                                                 | Purpose                                              |
| -------------------------- | --------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| `KnowledgeGraphPageLayout` | Layout          | `apps/web/src/layouts/KnowledgeGraphPageLayout.tsx`               | Shell with rail, board, inspector                    |
| `AspectCardRail`           | Component       | `apps/web/src/components/knowledge-graph/AspectCardRail.tsx`      | Select active documentation aspect                   |
| `WhiteboardCanvas`         | Component       | `apps/web/src/components/knowledge-graph/WhiteboardCanvas.tsx`    | Render cards/edges for active board level            |
| `WhiteboardCard`           | Component       | `apps/web/src/components/knowledge-graph/WhiteboardCard.tsx`      | Generic card surface for feature/story/concept/group |
| `CardInspectorPanel`       | Component       | `apps/web/src/components/knowledge-graph/CardInspectorPanel.tsx`  | Details and actions for selected card                |
| `FocusStateIndicator`      | State Indicator | `apps/web/src/components/knowledge-graph/FocusStateIndicator.tsx` | Displays board exploration state                     |

---

## Data Flow

### Read Queries

| API Call                                                  | Hook                | Cache Key                                                                                                 | Trigger                           |
| --------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `GET /api/knowledge-graph/mirror-cards`                   | `useMirrorGraph()`  | `queryKeys.kg.cards(projectKey, featureId)`                                                               | Route load, source/feature change |
| `GET /api/knowledge-graph/graph`                          | `useMirrorGraph()`  | `queryKeys.kg.graph(projectKey, featureId, activeAspect, viewLevel, selectedFeatureId, selectedGroupKey)` | Aspect or board selection         |
| `GET /api/knowledge-graph/concepts/:conceptId`            | `useConceptFocus()` | `queryKeys.kg.detail(projectKey, featureId, conceptId)`                                                   | Concept card focus                |
| `GET /api/knowledge-graph/concepts/:conceptId/definition` | `useConceptFocus()` | `queryKeys.kg.definition(projectKey, featureId, conceptId)`                                               | Definition action preflight       |

### Mutations

| API Call                                                        | Hook                                 | On Success                                    |
| --------------------------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| `POST /api/knowledge-graph/rebuild`                             | `useMirrorGraph().refreshProjection` | Invalidate card rail and whiteboard caches    |
| `POST /api/knowledge-graph/concepts/:conceptId/open-definition` | `useConceptFocus().openDefinition`   | Set `DefinitionOpened` and navigate to target |

---

## Form and Selection Contracts

### Aspect Selection

| Field        | Type   | Validation                                        |
| ------------ | ------ | ------------------------------------------------- |
| activeAspect | string | Must exist in `GetMirrorCards.cards[].aspectKind` |

### Whiteboard Selection

| Field            | Type   | Validation                                                    |
| ---------------- | ------ | ------------------------------------------------------------- |
| selectedCardId   | string | Must exist in current `GetRelationshipGraph.nodes[]`          |
| selectedCardType | string | Must be one of `feature`, `story`, `concept-group`, `concept` |

### OpenDefinitionAction

| Field     | Type   | Validation                           | Error Message                                |
| --------- | ------ | ------------------------------------ | -------------------------------------------- |
| conceptId | string | Required and must match focused card | "Select a concept before opening definition" |

**Error Code -> UI Message Mapping:**

| API Error Code                 | HTTP Status | UI Message                                                         |
| ------------------------------ | ----------- | ------------------------------------------------------------------ |
| `DEFINITION_SESSION_MISMATCH`  | 409         | "Selection changed. Please select the concept again."              |
| `DEFINITION_POINTER_NOT_FOUND` | 404         | "Definition link is not available for this concept."               |
| `DEFINITION_ANCHOR_NOT_FOUND`  | 404         | "Definition anchor is outdated. Refresh projection and try again." |
| `WHITEBOARD_CARD_NOT_FOUND`    | 404         | "This card is no longer available in the current board."           |

---

## State-to-UI Mapping

| Domain Value       | UI Representation                                |
| ------------------ | ------------------------------------------------ |
| `Idle`             | Empty board prompt with source/feature selectors |
| `ProjectionReady`  | Aspect rail + board loaded                       |
| `ConceptFocused`   | Concept card selected, inspector populated       |
| `DefinitionOpened` | Inspector confirmation and route/hash navigation |

---

## Accessibility Requirements

| Component                | Requirement                                                                     |
| ------------------------ | ------------------------------------------------------------------------------- |
| `AspectCardRail`         | Aspect cards are keyboard-focusable and expose active state with `aria-current` |
| `WhiteboardCanvas`       | Node list fallback for keyboard and screen-reader users                         |
| `WhiteboardCard`         | Card role is clear (`button` for actions, `article` for passive summary)        |
| `CardInspectorPanel`     | Uses heading hierarchy and `aria-live="polite"` for detail updates              |
| `Open definition action` | Triggerable by Enter/Space with explicit `aria-label`                           |

---

## UI Concept Registry

| Concept                       | ID                                                           | Type            |
| ----------------------------- | ------------------------------------------------------------ | --------------- |
| `/knowledge-graph`            | ui.knowledge-graph-visualization.route.canvas                | Page            |
| `KnowledgeGraphPageLayout`    | ui.knowledge-graph-visualization.KnowledgeGraphPageLayout    | Layout          |
| `AspectCardRail`              | ui.knowledge-graph-visualization.AspectCardRail              | Component       |
| `WhiteboardCanvas`            | ui.knowledge-graph-visualization.WhiteboardCanvas            | Component       |
| `WhiteboardCard`              | ui.knowledge-graph-visualization.WhiteboardCard              | Component       |
| `CardInspectorPanel`          | ui.knowledge-graph-visualization.CardInspectorPanel          | Component       |
| `useMirrorGraph`              | ui.knowledge-graph-visualization.useMirrorGraph              | Hook            |
| `useConceptFocus`             | ui.knowledge-graph-visualization.useConceptFocus             | Hook            |
| `GraphDataBinding`            | ui.knowledge-graph-visualization.GraphDataBinding            | Binding         |
| `AspectSelectionBinding`      | ui.knowledge-graph-visualization.AspectSelectionBinding      | Binding         |
| `FeatureDrilldownBinding`     | ui.knowledge-graph-visualization.FeatureDrilldownBinding     | Binding         |
| `DefinitionNavigationBinding` | ui.knowledge-graph-visualization.DefinitionNavigationBinding | Binding         |
| `FocusStateIndicator`         | ui.knowledge-graph-visualization.FocusStateIndicator         | State Indicator |
