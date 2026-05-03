---
id: knowledge-graph-visualization-ui
feature: knowledge-graph-visualization
title: "Knowledge Graph Visualization UI Specification"
summary: Mirror cards, relationship graph canvas, and concept detail interactions.
status: draft
pillar: platform
domain: knowledge-graph-visualization-ui
audience:
  - developers
priority: p1
lang: en
owners:
  - web-core
updatedAt: 2026-05-03
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

> Governs the frontend presentation of mirror cards, relationship graph, concept deep-link navigation, and concept detail cards.
> Constrained by [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md).

---

## Route Table

| Route              | Page Title      | Layout                   | Auth Required | Permission         |
| ------------------ | --------------- | ------------------------ | ------------- | ------------------ |
| `/knowledge-graph` | Knowledge Graph | KnowledgeGraphPageLayout | Yes           | domainspec.kg.read |

---

## Page Layouts

### /knowledge-graph (Knowledge Graph)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header: "Knowledge Graph Visualization"                                  │
├──────────────────────────┬──────────────────────────────┬────────────────────┤
│ MirrorCardGrid           │ RelationshipGraphCanvas      │ ConceptDetailPanel │
│ - SPEC card              │ - Concept nodes              │ - Concept summary   │
│ - domain card            │ - Canonical edges            │ - Inbound/outbound  │
│ - operations card        │ - Click to focus concept     │ - Open definition   │
└──────────────────────────┴──────────────────────────────┴────────────────────┘
```

---

## Component Inventory

| Component                  | Type            | Location                                                              | Purpose                                      |
| -------------------------- | --------------- | --------------------------------------------------------------------- | -------------------------------------------- |
| `KnowledgeGraphPageLayout` | Layout          | `apps/web/src/layouts/KnowledgeGraphPageLayout.tsx`                   | Page shell with three-pane grid              |
| `MirrorCardGrid`           | Component       | `apps/web/src/components/knowledge-graph/MirrorCardGrid.tsx`          | Shows one card per mirrored source file      |
| `RelationshipGraphCanvas`  | Component       | `apps/web/src/components/knowledge-graph/RelationshipGraphCanvas.tsx` | Renders concept nodes and canonical edges    |
| `ConceptDetailPanel`       | Component       | `apps/web/src/components/knowledge-graph/ConceptDetailPanel.tsx`      | Shows selected concept details and relations |
| `FocusStateIndicator`      | State Indicator | `apps/web/src/components/knowledge-graph/FocusStateIndicator.tsx`     | Displays exploration lifecycle state         |

---

## Data Flow

### /knowledge-graph

| API Call                                                  | Hook                | Cache Key                                       | Triggers                  |
| --------------------------------------------------------- | ------------------- | ----------------------------------------------- | ------------------------- |
| `GET /api/knowledge-graph/mirror-cards`                   | `useMirrorGraph()`  | `queryKeys.kg.cards(featureId)`                 | Page mount, refresh       |
| `GET /api/knowledge-graph/graph`                          | `useMirrorGraph()`  | `queryKeys.kg.graph(featureId)`                 | Page mount, filter change |
| `GET /api/knowledge-graph/concepts/:conceptId`            | `useConceptFocus()` | `queryKeys.kg.detail(featureId, conceptId)`     | Concept click             |
| `GET /api/knowledge-graph/concepts/:conceptId/definition` | `useConceptFocus()` | `queryKeys.kg.definition(featureId, conceptId)` | Definition action prepare |

### Mutations

| API Call                                                        | Hook                                 | On Success                                   |
| --------------------------------------------------------------- | ------------------------------------ | -------------------------------------------- |
| `client://knowledge-graph/select-concept`                       | `useConceptFocus().selectConcept()`  | Update focused node and refresh detail panel |
| `POST /api/knowledge-graph/concepts/:conceptId/open-definition` | `useConceptFocus().openDefinition()` | Navigate to target `filePath#anchor`         |

---

## Form Contracts

No free-text form is required for current. Interaction contracts are click-based (card click, node click, open definition action).

### OpenDefinitionAction

| Field     | Type   | HTML Input | Validation                           | Error Message                                |
| --------- | ------ | ---------- | ------------------------------------ | -------------------------------------------- |
| conceptId | string | hidden     | Required, must match focused concept | "Select a concept before opening definition" |

**Error Code -> UI Message Mapping:**

| API Error Code                 | HTTP Status | UI Message                                                         |
| ------------------------------ | ----------- | ------------------------------------------------------------------ |
| `DEFINITION_SESSION_MISMATCH`  | 409         | "Selection changed. Please select the concept again."              |
| `DEFINITION_POINTER_NOT_FOUND` | 404         | "Definition link is not available for this concept."               |
| `DEFINITION_ANCHOR_NOT_FOUND`  | 404         | "Definition anchor is outdated. Refresh projection and try again." |

---

## State-to-UI Mapping

| Domain Value       | UI Representation                               | Color / Variant |
| ------------------ | ----------------------------------------------- | --------------- |
| `Idle`             | Empty placeholder with reload prompt            | neutral         |
| `ProjectionReady`  | Badge "Projection Ready"                        | blue            |
| `ConceptFocused`   | Badge "Concept Focused" + highlighted node/card | green           |
| `DefinitionOpened` | Badge "Definition Opened" + link state toast    | cyan            |

---

## Accessibility Requirements

| Component                 | Requirement                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `MirrorCardGrid`          | Cards are keyboard-focusable with visible focus ring        |
| `RelationshipGraphCanvas` | Node list fallback for keyboard users and screen readers    |
| `ConceptDetailPanel`      | Uses heading hierarchy and `aria-live="polite"` for updates |
| `Open definition action`  | Triggerable by Enter/Space with explicit `aria-label`       |

---

## UI Concept Registry

| Concept                       | ID                                                           | Type            |
| ----------------------------- | ------------------------------------------------------------ | --------------- |
| `/knowledge-graph`            | ui.knowledge-graph-visualization.route.canvas                | Page            |
| `KnowledgeGraphPageLayout`    | ui.knowledge-graph-visualization.KnowledgeGraphPageLayout    | Layout          |
| `MirrorCardGrid`              | ui.knowledge-graph-visualization.MirrorCardGrid              | Component       |
| `RelationshipGraphCanvas`     | ui.knowledge-graph-visualization.RelationshipGraphCanvas     | Component       |
| `ConceptDetailPanel`          | ui.knowledge-graph-visualization.ConceptDetailPanel          | Component       |
| `useMirrorGraph`              | ui.knowledge-graph-visualization.useMirrorGraph              | Hook            |
| `useConceptFocus`             | ui.knowledge-graph-visualization.useConceptFocus             | Hook            |
| `GraphDataBinding`            | ui.knowledge-graph-visualization.GraphDataBinding            | Binding         |
| `ConceptFocusBinding`         | ui.knowledge-graph-visualization.ConceptFocusBinding         | Binding         |
| `DefinitionNavigationBinding` | ui.knowledge-graph-visualization.DefinitionNavigationBinding | Binding         |
| `NavigateToDefinitionAction`  | ui.knowledge-graph-visualization.NavigateToDefinitionAction  | Action          |
| `FocusStateIndicator`         | ui.knowledge-graph-visualization.FocusStateIndicator         | State Indicator |
