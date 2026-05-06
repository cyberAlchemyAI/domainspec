# User Stories: Knowledge Graph Visualization

> Navigate by capability: [Mirror Coverage and Graph Parity](#mirror-coverage-and-graph-parity) · [Concept Deep-Link and Detail Card](#concept-deep-link-and-detail-card) · [Cross-Project Documentation Scope](#cross-project-documentation-scope)

## Mirror Coverage and Graph Parity

### US-1: Mirror cards for required docs

As a **feature author**, I want **one card per required source file (SPEC, domain, operations)**, so that **I can verify documentation coverage quickly**.

**Given** the feature docs exist
**When** I open the knowledge graph page
**Then** I see cards for SPEC, domain, and operations at minimum

**Acceptance checks**

- [ ] Required mirror cards are always present.
- [ ] Each card shows file path, concept count, relation count, and freshness status.

**Domain coverage**

- Concepts: [FeatureDocument](domain.md#featuredocument), [MirrorCardView](domain.md#mirrorcardview)
- States/Rules: [ExplorationState](states.md#explorationstate)
- Interfaces/Flows: [KnowledgeGraphAPI](interfaces.md#external-knowledgegraphapi-rest), [MirrorInteractionWorkflow](workflows.md#mirrorinteractionworkflow)

**Capability links**

- [Mirror Cards + Relationship Graph Navigator](SPEC.md#mirror-cards--relationship-graph-navigator)

### US-2: Graph mirrors canonical relationships

As a **documentation reviewer**, I want **the graph to render canonical relations from feature docs**, so that **the visual graph and the written spec never diverge**.

**Given** feature concepts and feature concept graph rows are defined
**When** I open the graph canvas
**Then** I see nodes and edges that match canonical concept IDs and canonical edge labels

**Acceptance checks**

- [ ] Graph only contains canonical relationship labels.
- [ ] Graph edge endpoints resolve to known concept IDs.

**Domain coverage**

- Concepts: [RelationshipEdge](domain.md#relationshipedge), [MirrorProjection](domain.md#mirrorprojection), [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)
- States/Rules: [ExplorationState](states.md#explorationstate)
- Interfaces/Flows: [GetRelationshipGraph](queries.md#getrelationshipgraph), [DocumentToConceptMapping](mappings.md#documenttoconceptmapping)

**Capability links**

- [Mirror Cards + Relationship Graph Navigator](SPEC.md#mirror-cards--relationship-graph-navigator)

## Concept Deep-Link and Detail Card

### US-3: Click concept to open definition

As a **developer**, I want **clicking a concept to resolve its definition target**, so that **I can jump directly to the source definition**.

**Given** a concept node is selected
**When** I trigger open definition
**Then** the system resolves file and anchor and opens the target

**Acceptance checks**

- [ ] Every selectable concept has a resolved definition pointer.
- [ ] Open definition fails with explicit diagnostics when anchor is missing.

**Domain coverage**

- Concepts: [DefinitionPointer](domain.md#definitionpointer), [OpenDefinition](operations.md#opendefinition)
- States/Rules: [ExplorationState](states.md#explorationstate)
- Interfaces/Flows: [GetDefinitionPointer](queries.md#getdefinitionpointer), [KnowledgeGraphAPI](interfaces.md#external-knowledgegraphapi-rest)

**Capability links**

- [Mirror Cards + Relationship Graph Navigator](SPEC.md#mirror-cards--relationship-graph-navigator)

### US-4: Related details card for selected concept

As a **maintainer**, I want **a detail card for the selected concept with related inbound and outbound relations**, so that **I can understand context without manually searching multiple files**.

**Given** a concept is focused
**When** detail data is loaded
**Then** the detail card shows summary, definition link, and related edges

**Acceptance checks**

- [ ] Detail card always matches the currently focused concept.
- [ ] Inbound and outbound relationships are shown with evidence links.

**Domain coverage**

- Concepts: [ConceptDetailCard](domain.md#conceptdetailcard), [SelectConcept](operations.md#selectconcept)
- States/Rules: [ExplorationState](states.md#explorationstate)
- Interfaces/Flows: [GetConceptDetailCard](queries.md#getconceptdetailcard), [ConceptToDetailCardAdapter](mappings.md#concepttodetailcardadapter)

**Capability links**

- [Mirror Cards + Relationship Graph Navigator](SPEC.md#mirror-cards--relationship-graph-navigator)

## Cross-Project Documentation Scope

### US-5: Project-scoped projection using poker-team docs

As a **DomainSpec maintainer**, I want **the knowledge graph to load docs from another registered project (for example poker-team)**, so that **one graph UI can inspect multiple project repositories without duplicating tooling**.

**Given** `poker-team` is registered as an active documentation source
**When** I request projection for `(projectKey=poker-team, featureId=auth-access-control)`
**Then** cards, graph, and concept details are resolved from poker-team docs roots using canonical rules

**Acceptance checks**

- [ ] Scope resolution rejects unknown or disabled project keys with explicit diagnostics.
- [ ] Rebuild and read contracts use the same `(projectKey, featureId)` scope.
- [ ] Definition pointers open targets inside the selected source workspace only.

**Domain coverage**

- Concepts: [DocumentationWorkspace](domain.md#documentationworkspace), [ProjectionScope](domain.md#projectionscope), [ResolveProjectionScope](operations.md#resolveprojectionscope)
- States/Rules: [ExplorationState](states.md#explorationstate)
- Interfaces/Flows: [ProjectSourceRegistry](interfaces.md#internal-projectsourceregistry-interface), [KnowledgeGraphAPI](interfaces.md#external-knowledgegraphapi-rest)

**Capability links**

- [Cross-Project Documentation Scope](SPEC.md#cross-project-documentation-scope)

## Story Coverage Matrix

| Capability                        | Story IDs  | Covered Concepts                                                                                                                                          | Notes                                          |
| --------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Mirror Coverage and Graph Parity  | US-1, US-2 | knowledge-graph-visualization.FeatureDocument, knowledge-graph-visualization.MirrorProjection, knowledge-graph-visualization.RebuildMirrorProjection      | Covers file parity and graph parity            |
| Concept Deep-Link and Detail Card | US-3, US-4 | knowledge-graph-visualization.DefinitionPointer, knowledge-graph-visualization.GetConceptDetailCard, knowledge-graph-visualization.OpenDefinition         | Covers click-to-definition and related details |
| Cross-Project Documentation Scope | US-5       | knowledge-graph-visualization.DocumentationWorkspace, knowledge-graph-visualization.ProjectionScope, knowledge-graph-visualization.ResolveProjectionScope | Covers project registry and scoped projection  |
