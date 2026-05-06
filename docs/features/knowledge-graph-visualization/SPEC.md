---
feature: knowledge-graph-visualization
version: current
status: draft
updatedAt: 2026-05-06
---

# Knowledge Graph Visualization

## Overview

Knowledge Graph Visualization is a whiteboard-first documentation navigator.

The screen is structured around two synchronized surfaces:

- aspect cards (SPEC, domain, operations, TEST-SPEC, and other available feature files),
- a large whiteboard canvas that renders card nodes and relation edges for the selected aspect context.

Projection scope is cross-project: the same module can render docs from the local DomainSpec workspace or a registered external project workspace (for example `validation/poker-team`).

Deterministic baseline interaction:

- resolve one projection scope `{projectKey, featureId}`,
- load one aspect card set for that scope,
- render whiteboard content for the selected aspect,
- at SPEC level show feature cards and cross-feature edges,
- click a feature card to expand concepts and stories as cards,
- group concept cards by aspect source,
- click an aspect group or concept card to open aspect-level visualization and definition detail,
- resolve all edges through the relationship index authored in SPEC.

## What This Module Owns

- Projection scope resolution across registered documentation workspaces.
- Aspect card rail projection for current feature file set.
- Whiteboard graph projection at three drill levels:
  - SPEC level (feature cards + cross-feature edges),
  - feature level (concept cards + story cards),
  - aspect level (grouped concept cards + concept detail focus).
- Relationship index extraction from SPEC tables and graph sections as canonical edge source.
- Markdown ingestion/parsing and projection persistence into database-backed read models.
- Deterministic card selection and deep-link resolution to concept definitions.
- Read API contracts for aspect cards, whiteboard cards/edges, card details, and definition targets.

## Capabilities

| Capability                                                              | What                                                                   | Key Aspects                                                                                            | Detail                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| [Aspect Whiteboard Navigation](#aspect-whiteboard-navigation)           | Navigate documentation by aspect cards and whiteboard card graph       | [Domain](domain.md), [Queries](queries.md), [Interfaces](interfaces.md), [UI Spec](UI-SPEC.md)         | Aspect card rail, whiteboard board, card focus, deep-link open               |
| [SPEC-Level Feature Atlas](#spec-level-feature-atlas)                   | At SPEC level, show all feature cards and cross-feature relation edges | [Operations](operations.md), [Queries](queries.md), [Mappings](mappings.md), [Workflows](workflows.md) | Feature cards + cross edges driven from SPEC relationship index              |
| [Feature Drilldown By Aspect](#feature-drilldown-by-aspect)             | Click feature card to reveal concept and story cards grouped by aspect | [Operations](operations.md), [Queries](queries.md), [States](states.md), [UI Spec](UI-SPEC.md)         | Concept groups by aspect, story cards, domain focus for concept descriptions |
| [Cross-Project Documentation Scope](#cross-project-documentation-scope) | Reuse same whiteboard flow across registered project repositories      | [Domain](domain.md), [Operations](operations.md), [Interfaces](interfaces.md), [Stories](STORIES.md)   | `projectKey` scope resolution, external docs roots, poker-team example       |

### Aspect Whiteboard Navigation

The user opens the page and sees:

1. aspect cards for available files,
2. a whiteboard containing cards and relation edges for the selected aspect context,
3. a detail pane for the selected card.

Selecting any card keeps board state synchronized with detail state.

### SPEC-Level Feature Atlas

When the active aspect is SPEC, the whiteboard renders feature cards and cross-feature edges.

Edges come from the feature relationship index authored in SPEC (feature concept graph and dependency/produces tables), not from ad-hoc UI-only inference.

### Feature Drilldown By Aspect

Clicking a feature card transitions whiteboard depth to feature level:

1. show concept cards linked to selected feature,
2. show story cards for selected feature,
3. group concept cards by aspect source file,
4. clicking an aspect group or concept card opens that aspect visualization and concept description (for example `MakeupBalance` in domain view).

### Cross-Project Documentation Scope

The user can choose a registered documentation source (for example `domainspec-core` or `poker-team`) and a feature inside that source.

The module resolves workspace roots for that source and applies the same whiteboard rules: aspect cards, relationship index edges, grouped concepts, and deterministic deep-links.

## Concepts

| Concept                                                                         | ID                                                           | Type            | Description                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------- | ---------------------------------------------------------------------- |
| [DocumentationWorkspace](domain.md#documentationworkspace)                      | knowledge-graph-visualization.DocumentationWorkspace         | Entity          | Registered project docs workspace that can be projected                |
| [ProjectionScope](domain.md#projectionscope)                                    | knowledge-graph-visualization.ProjectionScope                | Value Object    | Scope key combining project source and feature                         |
| [AspectCard](domain.md#mirrorcardview)                                          | knowledge-graph-visualization.AspectCard                     | View Model      | Card for one documentation aspect file                                 |
| [WhiteboardCard](domain.md#conceptdetailcard)                                   | knowledge-graph-visualization.WhiteboardCard                 | View Model      | Generic card rendered on whiteboard (feature, story, concept, group)   |
| [WhiteboardEdge](domain.md#relationshipedge)                                    | knowledge-graph-visualization.WhiteboardEdge                 | Value Object    | Directed relation between whiteboard cards                             |
| [RelationshipIndex](domain.md#relationshipedge)                                 | knowledge-graph-visualization.RelationshipIndex              | Aggregate       | Canonical relationship source extracted from SPEC                      |
| [WhiteboardViewLevel](states.md#explorationstate)                               | knowledge-graph-visualization.WhiteboardViewLevel            | Enum            | `aspect`, `feature`, or `concept` board depth                          |
| [FeatureDocument](domain.md#featuredocument)                                    | knowledge-graph-visualization.FeatureDocument                | Entity          | Source documentation file tracked as graph/card input                  |
| [ConceptDefinition](domain.md#conceptdefinition)                                | knowledge-graph-visualization.ConceptDefinition              | Entity          | Canonical concept definition parsed from docs                          |
| [MirrorProjection](domain.md#mirrorprojection)                                  | knowledge-graph-visualization.MirrorProjection               | Entity          | Snapshot containing synchronized cards and graph aggregates            |
| [ExplorationSession](domain.md#explorationsession)                              | knowledge-graph-visualization.ExplorationSession             | Entity          | User exploration state for focused concept and opened definition       |
| [RelationshipEdge](domain.md#relationshipedge)                                  | knowledge-graph-visualization.RelationshipEdge               | Value Object    | Canonical edge connecting two concept IDs                              |
| [DefinitionPointer](domain.md#definitionpointer)                                | knowledge-graph-visualization.DefinitionPointer              | Value Object    | File-path plus anchor target for concept deep-link navigation          |
| [MirrorCardView](domain.md#mirrorcardview)                                      | knowledge-graph-visualization.MirrorCardView                 | View Model      | Card representation for one mirrored documentation file                |
| [ConceptDetailCard](domain.md#conceptdetailcard)                                | knowledge-graph-visualization.ConceptDetailCard              | View Model      | Detail projection for selected concept and related relations           |
| [AspectKind](domain.md#aspectkind)                                              | knowledge-graph-visualization.AspectKind                     | Enum            | Supported file categories represented as cards                         |
| [FreshnessStatus](domain.md#freshnessstatus)                                    | knowledge-graph-visualization.FreshnessStatus                | Enum            | Card freshness marker for sync confidence                              |
| [ExplorationState](states.md#explorationstate)                                  | knowledge-graph-visualization.ExplorationState               | State Machine   | Lifecycle from idle view to focused concept and opened definition      |
| [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)                | knowledge-graph-visualization.RebuildMirrorProjection        | Operation       | Rebuilds mirror cards and graph from docs sources                      |
| [ResolveProjectionScope](operations.md#resolveprojectionscope)                  | knowledge-graph-visualization.ResolveProjectionScope         | Operation       | Resolves source project roots for one projection scope                 |
| [SelectConcept](operations.md#selectconcept)                                    | knowledge-graph-visualization.SelectConcept                  | Operation       | Focuses one concept from card or graph interaction                     |
| [OpenDefinition](operations.md#opendefinition)                                  | knowledge-graph-visualization.OpenDefinition                 | Operation       | Resolves and opens definition anchor for selected concept              |
| [GetMirrorCards](queries.md#getmirrorcards)                                     | knowledge-graph-visualization.GetMirrorCards                 | Query           | Returns mirror card list for the feature                               |
| [GetRelationshipGraph](queries.md#getrelationshipgraph)                         | knowledge-graph-visualization.GetRelationshipGraph           | Query           | Returns concept nodes and canonical relation edges                     |
| [GetConceptDetailCard](queries.md#getconceptdetailcard)                         | knowledge-graph-visualization.GetConceptDetailCard           | Query           | Returns detail card projection for selected concept                    |
| [GetDefinitionPointer](queries.md#getdefinitionpointer)                         | knowledge-graph-visualization.GetDefinitionPointer           | Query           | Returns file and anchor target for selected concept                    |
| [KnowledgeGraphAPI](interfaces.md#external-knowledgegraphapi-rest)              | knowledge-graph-visualization.KnowledgeGraphAPI              | Interface       | External read API for cards, graph, and concept detail navigation      |
| [KnowledgeGraphModule](interfaces.md#internal-knowledgegraphmodule-interface)   | knowledge-graph-visualization.KnowledgeGraphModule           | Interface       | Internal module contract for card/graph/query operations               |
| [ProjectSourceRegistry](interfaces.md#internal-projectsourceregistry-interface) | knowledge-graph-visualization.ProjectSourceRegistry          | Interface       | Internal registry resolving allowed project documentation sources      |
| [DocumentToConceptMapping](mappings.md#documenttoconceptmapping)                | knowledge-graph-visualization.DocumentToConceptMapping       | Mapping         | Maps docs concept and relationship tables into projection entities     |
| [DocumentToMirrorCardAdapter](mappings.md#documenttomirrorcardadapter)          | knowledge-graph-visualization.DocumentToMirrorCardAdapter    | Adapter         | Shapes file metadata into mirror card view model                       |
| [ConceptToDetailCardAdapter](mappings.md#concepttodetailcardadapter)            | knowledge-graph-visualization.ConceptToDetailCardAdapter     | Adapter         | Shapes selected concept context into detail card view model            |
| [MirrorInteractionWorkflow](workflows.md#mirrorinteractionworkflow)             | knowledge-graph-visualization.MirrorInteractionWorkflow      | Workflow        | End-to-end flow across card rendering, graph focus, and deep-link open |
| [CardSyncPolicy](workflows.md#cardsyncpolicy)                                   | knowledge-graph-visualization.CardSyncPolicy                 | Policy          | Enforces minimum mirrored file coverage and staleness handling         |
| [MirrorProjectionBuilt](events.md#mirrorprojectionbuilt)                        | knowledge-graph-visualization.MirrorProjectionBuilt          | Event           | Projection rebuild completion signal                                   |
| [ConceptSelected](events.md#conceptselected)                                    | knowledge-graph-visualization.ConceptSelected                | Event           | Concept focus change signal                                            |
| [DefinitionOpened](events.md#definitionopened)                                  | knowledge-graph-visualization.DefinitionOpened               | Event           | Deep-link navigation signal                                            |
| [Graph Canvas Route](UI-SPEC.md#route-table)                                    | ui.knowledge-graph-visualization.route.canvas                | Page            | Main page rendering cards, graph, and details                          |
| [KnowledgeGraphPageLayout](UI-SPEC.md#component-inventory)                      | ui.knowledge-graph-visualization.KnowledgeGraphPageLayout    | Layout          | Layout wrapper for knowledge graph page                                |
| [MirrorCardGrid](UI-SPEC.md#component-inventory)                                | ui.knowledge-graph-visualization.MirrorCardGrid              | Component       | Card list reflecting source files                                      |
| [RelationshipGraphCanvas](UI-SPEC.md#component-inventory)                       | ui.knowledge-graph-visualization.RelationshipGraphCanvas     | Component       | Graph view showing concepts and canonical edges                        |
| [ConceptDetailPanel](UI-SPEC.md#component-inventory)                            | ui.knowledge-graph-visualization.ConceptDetailPanel          | Component       | Detail card for focused concept                                        |
| [useMirrorGraph](UI-SPEC.md#data-flow)                                          | ui.knowledge-graph-visualization.useMirrorGraph              | Hook            | Hook that fetches mirror cards and graph data                          |
| [useConceptFocus](UI-SPEC.md#data-flow)                                         | ui.knowledge-graph-visualization.useConceptFocus             | Hook            | Hook for concept focus and detail loading                              |
| [GraphDataBinding](UI-SPEC.md#ui-concept-registry)                              | ui.knowledge-graph-visualization.GraphDataBinding            | Binding         | Binding from UI hooks to read queries                                  |
| [ConceptFocusBinding](UI-SPEC.md#ui-concept-registry)                           | ui.knowledge-graph-visualization.ConceptFocusBinding         | Binding         | Binding from UI click to SelectConcept operation                       |
| [DefinitionNavigationBinding](UI-SPEC.md#ui-concept-registry)                   | ui.knowledge-graph-visualization.DefinitionNavigationBinding | Binding         | Binding from detail action to OpenDefinition operation                 |
| [NavigateToDefinitionAction](UI-SPEC.md#ui-concept-registry)                    | ui.knowledge-graph-visualization.NavigateToDefinitionAction  | Action          | User-triggered action for opening definition links                     |
| [FocusStateIndicator](UI-SPEC.md#ui-concept-registry)                           | ui.knowledge-graph-visualization.FocusStateIndicator         | State Indicator | Visual state marker for exploration lifecycle                          |

## Feature Concept Graph

| From                                                         | Edge         | To                                                       | Evidence                                               | Notes                                   |
| ------------------------------------------------------------ | ------------ | -------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------- |
| knowledge-graph-visualization.ResolveProjectionScope         | maps         | knowledge-graph-visualization.DocumentationWorkspace     | operations.md#resolveprojectionscope                   | Resolve source project roots            |
| knowledge-graph-visualization.ResolveProjectionScope         | produces     | knowledge-graph-visualization.ProjectionScope            | operations.md#resolveprojectionscope                   | Build deterministic scope key           |
| knowledge-graph-visualization.ProjectSourceRegistry          | exposes      | knowledge-graph-visualization.ResolveProjectionScope     | interfaces.md#internal-projectsourceregistry-interface | Registry-backed scope resolution        |
| knowledge-graph-visualization.RebuildMirrorProjection        | applies      | knowledge-graph-visualization.ProjectionScope            | operations.md#rebuildmirrorprojection                  | Persist projection per scope            |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.FeatureDocument            | mappings.md#documenttoconceptmapping                   | Parse file metadata into source records |
| knowledge-graph-visualization.DocumentToConceptMapping       | maps         | knowledge-graph-visualization.ConceptDefinition          | mappings.md#documenttoconceptmapping                   | Parse concept table rows                |
| knowledge-graph-visualization.DocumentToMirrorCardAdapter    | shapes       | knowledge-graph-visualization.MirrorCardView             | mappings.md#documenttomirrorcardadapter                | One card per mirrored file              |
| knowledge-graph-visualization.ConceptToDetailCardAdapter     | shapes       | knowledge-graph-visualization.ConceptDetailCard          | mappings.md#concepttodetailcardadapter                 | Related info projection                 |
| knowledge-graph-visualization.CardSyncPolicy                 | applies      | knowledge-graph-visualization.RebuildMirrorProjection    | workflows.md#cardsyncpolicy                            | Enforce required file coverage          |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.RebuildMirrorProjection    | workflows.md#mirrorinteractionworkflow                 | Initial page projection                 |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.SelectConcept              | workflows.md#mirrorinteractionworkflow                 | Click interaction                       |
| knowledge-graph-visualization.MirrorInteractionWorkflow      | orchestrates | knowledge-graph-visualization.OpenDefinition             | workflows.md#mirrorinteractionworkflow                 | Deep-link open flow                     |
| knowledge-graph-visualization.RebuildMirrorProjection        | produces     | knowledge-graph-visualization.MirrorProjectionBuilt      | operations.md#rebuildmirrorprojection                  | Rebuild completion event                |
| knowledge-graph-visualization.SelectConcept                  | produces     | knowledge-graph-visualization.ConceptSelected            | operations.md#selectconcept                            | Focus event                             |
| knowledge-graph-visualization.OpenDefinition                 | produces     | knowledge-graph-visualization.DefinitionOpened           | operations.md#opendefinition                           | Definition navigation event             |
| knowledge-graph-visualization.ConceptSelected                | transitions  | knowledge-graph-visualization.ExplorationState           | states.md#explorationstate                             | ProjectionReady -> ConceptFocused       |
| knowledge-graph-visualization.DefinitionOpened               | transitions  | knowledge-graph-visualization.ExplorationState           | states.md#explorationstate                             | ConceptFocused -> DefinitionOpened      |
| knowledge-graph-visualization.GetMirrorCards                 | queries      | knowledge-graph-visualization.MirrorProjection           | queries.md#getmirrorcards                              | Read card projection                    |
| knowledge-graph-visualization.GetMirrorCards                 | queries      | knowledge-graph-visualization.DocumentationWorkspace     | queries.md#getmirrorcards                              | Query within selected project scope     |
| knowledge-graph-visualization.GetRelationshipGraph           | queries      | knowledge-graph-visualization.MirrorProjection           | queries.md#getrelationshipgraph                        | Read graph projection                   |
| knowledge-graph-visualization.GetRelationshipGraph           | queries      | knowledge-graph-visualization.DocumentationWorkspace     | queries.md#getrelationshipgraph                        | Query within selected project scope     |
| knowledge-graph-visualization.GetConceptDetailCard           | queries      | knowledge-graph-visualization.ConceptDefinition          | queries.md#getconceptdetailcard                        | Read concept details                    |
| knowledge-graph-visualization.GetConceptDetailCard           | queries      | knowledge-graph-visualization.DocumentationWorkspace     | queries.md#getconceptdetailcard                        | Resolve detail by scope                 |
| knowledge-graph-visualization.GetDefinitionPointer           | queries      | knowledge-graph-visualization.ConceptDefinition          | queries.md#getdefinitionpointer                        | Resolve deep-link target                |
| knowledge-graph-visualization.GetDefinitionPointer           | queries      | knowledge-graph-visualization.DocumentationWorkspace     | queries.md#getdefinitionpointer                        | Resolve pointer by scope                |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetMirrorCards             | interfaces.md#external-knowledgegraphapi-rest          | Cards endpoint                          |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetRelationshipGraph       | interfaces.md#external-knowledgegraphapi-rest          | Graph endpoint                          |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetConceptDetailCard       | interfaces.md#external-knowledgegraphapi-rest          | Detail endpoint                         |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.GetDefinitionPointer       | interfaces.md#external-knowledgegraphapi-rest          | Definition target endpoint              |
| knowledge-graph-visualization.KnowledgeGraphAPI              | exposes      | knowledge-graph-visualization.OpenDefinition             | interfaces.md#external-knowledgegraphapi-rest          | Definition open endpoint                |
| knowledge-graph-visualization.KnowledgeGraphModule           | exposes      | knowledge-graph-visualization.SelectConcept              | interfaces.md#internal-knowledgegraphmodule-interface  | Internal click flow contract            |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetMirrorCards             | UI-SPEC.md#data-flow                                   | Card fetch binding                      |
| ui.knowledge-graph-visualization.GraphDataBinding            | fetches      | knowledge-graph-visualization.GetRelationshipGraph       | UI-SPEC.md#data-flow                                   | Graph fetch binding                     |
| ui.knowledge-graph-visualization.ConceptFocusBinding         | mutates      | knowledge-graph-visualization.SelectConcept              | UI-SPEC.md#data-flow                                   | Concept focus binding                   |
| ui.knowledge-graph-visualization.DefinitionNavigationBinding | mutates      | knowledge-graph-visualization.OpenDefinition             | UI-SPEC.md#data-flow                                   | Definition open binding                 |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.MirrorCardGrid          | UI-SPEC.md#page-layouts                                | Card area                               |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.RelationshipGraphCanvas | UI-SPEC.md#page-layouts                                | Graph area                              |
| ui.knowledge-graph-visualization.route.canvas                | renders      | ui.knowledge-graph-visualization.ConceptDetailPanel      | UI-SPEC.md#page-layouts                                | Detail area                             |
| ui.knowledge-graph-visualization.KnowledgeGraphPageLayout    | wraps        | ui.knowledge-graph-visualization.route.canvas            | UI-SPEC.md#route-table                                 | Shared shell                            |
| ui.knowledge-graph-visualization.MirrorCardGrid              | consumes     | ui.knowledge-graph-visualization.useMirrorGraph          | UI-SPEC.md#data-flow                                   | Card data hook                          |
| ui.knowledge-graph-visualization.RelationshipGraphCanvas     | consumes     | ui.knowledge-graph-visualization.useConceptFocus         | UI-SPEC.md#data-flow                                   | Focus hook                              |
| ui.knowledge-graph-visualization.ConceptDetailPanel          | displays     | knowledge-graph-visualization.ConceptDetailCard          | UI-SPEC.md#component-inventory                         | Detail card render                      |
| ui.knowledge-graph-visualization.FocusStateIndicator         | reflects     | knowledge-graph-visualization.ExplorationState           | UI-SPEC.md#state-to-ui-mapping                         | Exploration state badge                 |
| knowledge-graph-visualization.MirrorProjection               | contains     | knowledge-graph-visualization.RelationshipEdge           | domain.md#mirrorprojection                             | Edge set ownership                      |
| knowledge-graph-visualization.MirrorProjection               | contains     | knowledge-graph-visualization.MirrorCardView             | domain.md#mirrorprojection                             | Card set ownership                      |
| knowledge-graph-visualization.ConceptDefinition              | contains     | knowledge-graph-visualization.DefinitionPointer          | domain.md#conceptdefinition                            | Deep-link target ownership              |

## Aspects

- [Domain](domain.md) - Entities, value objects, enums for mirror and graph projection
- [Operations](operations.md) - Rebuild, concept selection, and definition open operations
- [Queries](queries.md) - Cards, graph, details, and definition pointer read models
- [Interfaces](interfaces.md) - External and internal API/module contracts
- [Mappings](mappings.md) - Doc parsing and UI projection transformations
- [Workflows](workflows.md) - Interaction workflow and sync policy
- [Events](events.md) - Projection and interaction lifecycle signals
- [States](states.md) - Exploration lifecycle transitions
- [Stories](STORIES.md) - User journeys and acceptance checks
- [UI Spec](UI-SPEC.md) - Page, components, bindings, and accessibility contract
- [Test Spec](TEST-SPEC.md) - Deterministic verification obligations
- [Tasks](TASKS.md) - Ordered execution backlog
- [Decisions](DECISIONS.md) - Locked and open design choices
- [Work Pack](WORK-PACK.md) - Planner execution baseline

## Cross-Feature Dependencies

| Depends On                                                          | Relationship | Why                                                                  |
| ------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [payment-processing](../payment-processing/SPEC.md)                 | queries      | Uses canonical concept and edge patterns as seeded projection data   |
| [domainspec-gsd-integration](../domainspec-gsd-integration/SPEC.md) | queries      | Uses cross-feature relationship samples to validate navigation paths |

## Produces For

| Consumer                | Via       | What                                                          |
| ----------------------- | --------- | ------------------------------------------------------------- |
| Feature authors         | Query     | Mirror cards proving one-to-one file coverage                 |
| DomainSpec maintainers  | Query     | Canonical graph for concept relationship review               |
| Multi-project reviewers | Query     | Same cards/graph contracts rendered against external docs     |
| Documentation reviewers | Query     | Concept detail card with related edges and evidence anchors   |
| Frontend implementers   | Interface | Stable contracts for card, graph, and deep-link interactions  |
| Governance reviewers    | Query     | Relationship traceability from selected concept to definition |

## References

- [Relationship vocabulary](../../../RELATIONSHIPS.md)
- [Taxonomy reference](../../../TAXONOMY.md)
- [Feature concept graph template](../../templates/FEATURE-CONCEPT-GRAPH.md)
- [Poker-team docs registry example](../../../../../validation/poker-team/docs/registry.md)
