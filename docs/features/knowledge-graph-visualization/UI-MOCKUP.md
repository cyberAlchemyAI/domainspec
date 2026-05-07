---
id: knowledge-graph-visualization-ui-mockup
feature: knowledge-graph-visualization
title: "Knowledge Graph Visualization UI Mockup"
summary: Web-view markdown mockup aligned to the current running screen and UI-SPEC interaction contract.
status: draft
owners:
  - web-core
updatedAt: 2026-05-07
dependencies:
  - UI-SPEC.md
  - SPEC.md
---

# UI Mockup: Knowledge Graph Visualization

Derived from:

- [UI-SPEC.md](UI-SPEC.md)
- [SPEC.md](SPEC.md)

This document is now focused on desktop web view only.

---

## Scope

- In scope: desktop web experience of `/knowledge-graph`
- Out of scope for this version: tablet/mobile variations

---

## Route and Query Model (Web)

Route:

- `/knowledge-graph`

Primary query parameters:

- `projectKey`
- `featureId`
- `activeAspect`
- `viewLevel`
- `selectedFeatureId`
- `selectedGroupKey`
- `selectedCardId`

---

## Current Web Layout Mockup (As-Is)

```
┌───────────────────────────── LEFT SIDEBAR ─────────────────────────────┬────────────────── MAIN ──────────────────────┐
│ DomainSpec UI                                                          │ Header                                          │
│ Feature Atlas                                                          │ domainspec-core / player-management             │
│ [Knowledge Graph]                                                      │ Knowledge Graph Visualization                   │
│ Mirror cards, relation graph, and concept detail panel                │ Projection generated at <timestamp>             │
│                                                                        │ [State badge: Projection Ready] [Rebuild]       │
├────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│                                                                        │ 3-column panel area                              │
│                                                                        │ ┌ Aspect Rail ┐ ┌ Whiteboard Canvas ┐ ┌ Inspector ┐
│                                                                        │ │ SPEC card   │ │ View level label   │ │ Placeholder│
│                                                                        │ │ DOMAIN card │ │ state summary      │ │ or details │
│                                                                        │ │ OPERATIONS  │ │ SVG graph nodes    │ │ Open def   │
│                                                                        │ │             │ │ keyboard list      │ │ State text │
│                                                                        │ │             │ │ canonical edges    │ │ messages   │
│                                                                        │ └─────────────┘ └───────────────────┘ └───────────┘
└────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────┘
```

---

## Panel Breakdown (Web)

### Header

- Eyebrow: `projectKey / featureId`
- Title: `Knowledge Graph Visualization`
- Meta: projection generated timestamp
- Controls: focus state indicator + rebuild projection button

### Aspect Rail

- Shows aspect cards with counts (`concepts`, `stories`)
- Current web view shows required set:
  - `SPEC`
  - `DOMAIN`
  - `OPERATIONS`

### Whiteboard Canvas

- Shows current `viewLevel` and selected scope summary
- SVG card graph (deterministic layout)
- Keyboard fallback card list
- Canonical edge list with evidence links

### Card Inspector

- Placeholder when no card is selected
- Detailed card metadata when focused
- Open definition action
- State and status/error message region

---

## Web Interaction Storyboard

### Step 1: Initial load

- Route loads with scope from query params.
- Header, rail, board, and inspector appear.
- State typically becomes `Projection Ready` after data load.

### Step 2: Aspect selection

- User clicks an aspect card in rail.
- Board reloads scoped by selected `activeAspect`.
- URL updates with new query state.

### Step 3: Feature drilldown

- In `viewLevel=aspect`, user focuses a feature card.
- URL moves to `viewLevel=feature` and sets `selectedFeatureId`.
- Board shows concept-group and concept/story cards.

### Step 4: Concept focus

- User clicks a concept card.
- URL moves to `viewLevel=concept` and sets `selectedCardId`.
- Inspector shows definition + inbound/outbound relations.

### Step 5: Open definition

- User clicks Open Definition.
- State indicator becomes `Definition Opened`.
- Hash navigation updates to `filePath#anchor` target.

### Step 6: Browser Back restoration

Expected back chain:

```
concept -> feature -> aspect
```

---

## Inspector Mockup (Web)

```
Card Inspector
--------------
Title: player-management
Summary: Projection scope feature player-management

Card type: concept
Card ID: concept:feature.player-management
Concept: feature.player-management
Definition file: SPEC.md
Definition anchor: #cross-feature-dependencies

Inbound relations:
- feature:... enforces-cross feature:...

Outbound relations:
- feature:... produces-for consumer:...
- feature:... queries feature:...

[Open definition]
State: Concept Focused / Definition Opened
Message area: success/error mapping
```

---

## Web-Focused Visual Notes

- Left sidebar is persistent and visually dominant.
- Main area emphasizes task context in the top header.
- Board panel is the largest content region.
- Inspector panel is narrower and detail-focused.

---

## Accessibility Notes

- Aspect cards remain keyboard-focusable and expose active state.
- Whiteboard keeps keyboard fallback list for non-pointer navigation.
- Inspector state/messages are announced in live regions.
- Open definition control remains explicit and keyboard triggerable.

---

## Web Trace Checklist

- [x] Route and query model captured.
- [x] Current desktop web structure represented.
- [x] Header + rail + board + inspector behavior represented.
- [x] Interaction flow (load -> aspect -> feature -> concept -> open-definition) represented.
- [x] Whiteboard target mockup and state variants represented.
- [x] Feature-level cross-dependency sketch with relation-labeled arrows represented.
- [x] Browser Back restoration represented.
- [x] Inspector fields and relation sections represented.
- [x] Accessibility notes represented for web view.

---

## To-Be Web Mockup (Target)

Design direction for the next desktop iteration:

- Make graph exploration primary and reduce cognitive load in the right inspector.
- Keep deterministic interaction model while improving scanability and action clarity.
- Preserve all existing behavior contracts from UI-SPEC.

```
┌───────────────────────────── LEFT SIDEBAR ─────────────────────────────┬────────────────── MAIN ──────────────────────┐
│ DomainSpec UI                                                          │ Header                                          │
│ Feature Atlas                                                          │ domainspec-core / player-management             │
│ [Knowledge Graph]                                                      │ Knowledge Graph Visualization                   │
│                                                                        │ [Source] [Feature] [Aspect] [State] [Rebuild]  │
├────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│                                                                        │ Board Workspace                                  │
│                                                                        │ ┌────────────── Board Toolbar ────────────────┐  │
│                                                                        │ │ viewLevel chips  focus trail  edge filter   │  │
│                                                                        │ └──────────────────────────────────────────────┘  │
│                                                                        │ ┌──────────────── Whiteboard Graph ───────────┐  │
│                                                                        │ │ larger nodes, clearer labels, edge legends  │  │
│                                                                        │ │ click node -> focus trail updates           │  │
│                                                                        │ └──────────────────────────────────────────────┘  │
│                                                                        │                                                  │
│                                                                        │ Inspector Drawer (contextual)                   │
│                                                                        │ - collapsed by default at aspect level          │
│                                                                        │ - auto-opens for concept/story focus            │
│                                                                        │ - sticky actions: Open definition, copy target  │
└────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────┘
```

### To-Be Interaction Notes

- Aspect level:
  - Inspector stays minimal (summary only).
  - Board emphasizes feature topology and edge meaning.
- Feature level:
  - Concept groups become explicit visual clusters.
  - Keyboard list can switch between compact and verbose modes.
- Concept level:
  - Inspector auto-expands and anchors relation evidence.
  - Open Definition action remains first-class and always visible.

---

## Whiteboard Capabilities (To-Be Focus)

This section isolates the Whiteboard scope so we can iterate it as its own component surface.

### Component Boundary

- Owns:
  - graph rendering area
  - board toolbar controls
  - node/edge interaction behavior
  - keyboard fallback list behavior
  - whiteboard-level loading and error states
- Does not own:
  - global sidebar navigation
  - top-level page header metadata
  - inspector content schema

### Whiteboard Mockup (Target)

```text
┌──────────────────────────── Whiteboard ─────────────────────────────┐
│ Toolbar                                                             │
│ [Aspect] [Feature*] [Concept]   Trail: SPEC > player-management     │
│ Edge filters: [all] [enforces-cross] [queries] [applies] [produces-for] │
├──────────────────────────────────────────────────────────────────────┤
│ Legend:                                                             │
│ node: feature card                                                  │
│ arrow label format: relation-type | why description                 │
├──────────────────────────────────────────────────────────────────────┤
│ Graph canvas (viewLevel=feature, cross dependencies)                │
│                                                                      │
│ [player-management] -- enforces-cross | Permission enforcement for all player-management routes --> [auth-access-control] │
│ [player-management] -- queries | Reads hands and profit for rolling period metrics -----------> [player-stats] │
│ [player-management] -- queries | Reads current makeup value exposed in overview DTO ----------> [player-makeup] │
│ [player-management] -- queries | Resolves progression checks through delegated progression query -> [player-progression] │
│                                                                                                  │
│ [financial-settlement] -- queries | Resolve player and deal context ---------------------------> [player-management] │
│ [financial-settlement] -- queries | Aggregate period profit/rakeback --------------------------> [player-stats] │
│ [financial-settlement] -- applies | Apply debt policy and update makeup -----------------------> [player-makeup] │
│                                                                                                  │
│ [player-makeup] -- queries | Resolve player and persist makeup on player aggregate -----------> [player-management] │
│ [player-makeup] -- produces-for | Provides debt policy and debt state consumed in settlement flows -> [financial-settlement] │
│                                                                      │
│ Active edge footer: financial-settlement --applies--> player-makeup │
│ Why: Apply debt policy and update makeup                             │
├──────────────────────────────────────────────────────────────────────┤
│ Keyboard list mode: [compact] [verbose]                             │
│ > player-management -> player-stats [queries]                        │
│   financial-settlement -> player-makeup [applies]                    │
│   player-makeup -> financial-settlement [produces-for]               │
└──────────────────────────────────────────────────────────────────────┘
```

### Source Rows Used for Arrow Labels (Poker Team)

- player-management -> auth-access-control (`enforces-cross`): Permission enforcement for all player-management read/write routes.
- player-management -> player-stats (`queries`): Reads hands and profit for rolling period metrics.
- player-management -> player-makeup (`queries`): Reads current makeup value exposed in overview DTO.
- player-management -> player-progression (`queries`): Resolves progression checks through delegated progression query.
- financial-settlement -> player-management (`queries`): Resolve player and deal context.
- financial-settlement -> player-stats (`queries`): Aggregate period profit/rakeback.
- financial-settlement -> player-makeup (`applies`): Apply debt policy and update makeup.
- player-makeup -> player-management (`queries`): Resolve player and persist makeup on player aggregate.
- player-makeup -> financial-settlement (`produces-for`): Provides debt policy and debt state consumed in settlement flows.

### Whiteboard State Variants

1. Loading

- Toolbar disabled except level indicator.
- Graph canvas shows skeleton nodes and edge placeholders.

2. Empty

- Canvas shows no-cards message and context hint.
- Toolbar remains interactive for aspect/feature switches.

3. Error

- Inline error banner in canvas with retry action.
- Previously loaded graph remains visible when possible.

### Capability Set V1

1. View-level controls
   - Render explicit chips for `aspect`, `feature`, and `concept` levels.
   - Reflect active level from query state and allow deterministic transitions.
2. Focus trail
   - Show breadcrumb-style focus context (aspect -> feature -> concept).
   - Keep trail synchronized with browser back/forward navigation.
3. Edge filtering
   - Provide relation-category filters that only affect board rendering.
   - Preserve canonical edge semantics and evidence references.
4. Graph readability
   - Increase node label clarity and visual hierarchy by card type.
   - Add edge legend with consistent relation label mapping.
5. Keyboard fallback modes
   - Support compact and verbose list modes.
   - Keep all graph targets reachable without pointer interaction.
6. Whiteboard state model
   - Show loading skeletons while projection/graph data resolves.
   - Show recoverable empty and error states with retry affordance.

### Whiteboard Interaction Contract

- Node click:
  - updates board focus
  - emits URL state change compatible with existing navigation model
  - triggers inspector sync without blocking board interaction
- Edge click (where present):
  - highlights relation context on board
  - optionally preselects related node
- Toolbar changes:
  - apply immediately to board state
  - do not mutate unrelated page-level controls

### Whiteboard Acceptance Slice (Iteration 1)

- User can switch `viewLevel` from board toolbar and see URL/state parity.
- User can identify edge meaning via legend without opening inspector.
- User can filter edge categories and restore full graph in one action.
- User can complete aspect -> feature -> concept traversal using keyboard-only mode.
- Whiteboard loading/error states are visible, actionable, and non-blocking.

### Open Decisions for Next Iteration

- Should edge filters persist in URL query params or remain session-local UI state?
- Should focus trail be read-only context or include direct jump actions?
- At concept-level density, prefer pan/zoom controls or semantic clustering first?

---

## As-Is to To-Be Gap List

| Area               | As-Is                           | To-Be Target                                            | Gap                                                 | Priority |
| ------------------ | ------------------------------- | ------------------------------------------------------- | --------------------------------------------------- | -------- |
| Header controls    | State + rebuild only            | Source/feature/aspect controls grouped with focus trail | Missing control grouping and exploration breadcrumb | High     |
| Board affordance   | Static summary text + svg graph | Toolbar with view chips, focus trail, edge filters      | Missing explicit exploration controls               | High     |
| Inspector behavior | Always visible full panel       | Contextual drawer that expands on concept focus         | Missing progressive disclosure                      | Medium   |
| Graph readability  | Small labels and dense rows     | Larger node hierarchy and clearer edge legends          | Missing visual emphasis hierarchy                   | High     |
| Edge comprehension | Canonical edge list below board | Inline legend + filterable edge categories              | Missing direct relationship decoding aids           | Medium   |
| Keyboard fallback  | Single list mode                | Compact/verbose switch with stronger focus cues         | Missing mode and accessibility ergonomics           | Medium   |
| Action ergonomics  | Open definition button in panel | Sticky action bar for concept-focused state             | Missing action persistence on deep exploration      | Medium   |

### Suggested Web-Only Implementation Sequence

1. Add board toolbar primitives (view chips, focus trail placeholder, edge filter UI).
2. Introduce inspector progressive states (minimal at aspect, expanded at concept).
3. Improve whiteboard node/edge visual hierarchy without changing behavior contract.
4. Add edge legend and filter wiring to existing query parameters.
5. Add keyboard list modes and accessibility-focused focus indicators.
6. Update E2E contracts for toolbar and contextual inspector behavior.

---

## Review Use

Use this mockup for:

- quick web-view UX alignment before code changes,
- web E2E walkthroughs,
- stakeholder reviews for desktop scope,
- regression triage against the running desktop screen.
