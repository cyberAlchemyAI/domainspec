# Operations: Knowledge Graph Visualization

## Capability Backlinks

- [Aspect Whiteboard Navigation](SPEC.md#aspect-whiteboard-navigation)
- [SPEC-Level Feature Atlas](SPEC.md#spec-level-feature-atlas)
- [Graph Layout & Edge Semantics Algorithm](SPEC.md#graph-layout--edge-semantics-algorithm)
- [Feature Drilldown By Aspect](SPEC.md#feature-drilldown-by-aspect)
- [Cross-Project Documentation Scope](SPEC.md#cross-project-documentation-scope)

## ResolveProjectionScope

**Type:** Operation (deterministic resolution)
**Actor:** API adapter or internal module before read/mutation
**Triggers:** Any request carrying `projectKey` and `featureId`

### Input

| Field      | Type   | Required | Description                                 |
| ---------- | ------ | -------- | ------------------------------------------- |
| projectKey | string | yes      | Registered source project key               |
| featureId  | string | yes      | Feature slug inside selected source project |

### Rules

| ID  | Rule                                                                           | Formal                                                       |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| R1  | Project source must exist and be active                                        | `exists workspace(projectKey) and workspace.status='active'` |
| R2  | Feature docs root must contain target feature                                  | `exists dir(workspace.featureDocsRootDir + '/' + featureId)` |
| R3  | Resolved paths must stay inside workspace roots                                | `all resolvedPaths startsWith workspace.workspaceRootDir`    |
| R4  | Scope resolution must be source-agnostic and must not special-case one project | `scopeResolver uses workspace registry only`                 |

### Postconditions

- One [ProjectionScope](domain.md#projectionscope) is resolved and attached to request context.
- The resolved scope references one active [DocumentationWorkspace](domain.md#documentationworkspace).
- Scope includes deterministic root evidence used by ingest and projection stages.

### Error States

| Condition                        | Result                                          |
| -------------------------------- | ----------------------------------------------- |
| Unknown or disabled project key  | Reject with `MIRROR_SOURCE_PROJECT_UNKNOWN`     |
| Feature folder missing           | Reject with `MIRROR_SOURCE_FEATURE_UNAVAILABLE` |
| Resolved root/path escapes scope | Reject with `MIRROR_SOURCE_ROOT_INVALID`        |

---

## RebuildMirrorProjection

**Type:** Operation (mutation)
**Actor:** System indexer or authorized maintainer
**Triggers:** Initial load, explicit refresh action, scheduled docs sync

### Input

| Field       | Type     | Required | Description                                                                      |
| ----------- | -------- | -------- | -------------------------------------------------------------------------------- |
| projectKey  | string   | yes      | Source project key resolved by [ResolveProjectionScope](#resolveprojectionscope) |
| featureId   | string   | yes      | Target feature slug                                                              |
| sourceFiles | string[] | yes      | Candidate markdown files to index as file-level cards                            |
| requestedBy | string   | yes      | Trigger identity                                                                 |

### Rules

| ID  | Rule                                                                           | Formal                                                                                       |
| --- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| R0  | Projection scope must resolve first                                            | `ResolveProjectionScope(projectKey, featureId) succeeds`                                     |
| R1  | Required aspect files must exist                                               | `{'SPEC.md','domain.md','operations.md'} subsetOf sourceFiles`                               |
| R2  | Relationship index ingest source is SPEC-authoritative only                    | `relationshipIndex = parse(SPEC.featureConceptGraph + SPEC.dependencies + SPEC.producesFor)` |
| R3  | Ingest must preserve deterministic hierarchy order                             | `hierarchyOrder = feature -> sort(files) -> sort(concepts by conceptId)`                     |
| R4  | File-level cards are one-to-one with mirrored files                            | `count(aspectCards) = count(distinct mirroredFiles)`                                         |
| R5  | Edge semantics labels must be computed for each rendered edge                  | `forall e in edges: exists(e.type,e.from,e.to,e.why)`                                        |
| R6  | Cross-feature edges must include navigation target metadata and highlight key  | `crossEdge -> exists(targetFeatureId,targetProjectKey,edgeHighlightKey)`                     |
| R7  | Concept detail enrichment must use explicit source fields when available       | `concept.description/rules present -> enrichmentMode='explicit'`                             |
| R8  | Concept detail fallback must be deterministic when explicit fields are missing | `missing(description/rules) -> enrichmentMode='fallback'`                                    |
| R9  | Projection persistence is atomic per snapshot                                  | `persist(snapshot) succeeds once OR operation rejects`                                       |

### Calculations

| ID  | Calculation                           | Formula                                                                      |
| --- | ------------------------------------- | ---------------------------------------------------------------------------- |
| C1  | Aspect card count                     | `aspectCardCount = count(distinct mirroredFiles)`                            |
| C2  | Feature atlas node count              | `featureNodeCount = count(featureCards in SPEC board)`                       |
| C3  | Deterministic hierarchy signature     | `hierarchySignature = hash(projectKey + featureId + ordered(file->concept))` |
| C4  | Edge density                          | `edgeDensity = edgeCount / max(cardCount, 1)`                                |
| C5  | Grouped concept cluster count         | `clusterCount = count(distinct conceptCards.groupKey)`                       |
| C6  | Unknown relation fallback color token | `fallbackColor = stableHash(edgeType) -> paletteIndex`                       |

### State Transition

[ExplorationSession](domain.md#explorationsession): `Idle -> ProjectionReady`

### Postconditions

- Parsed markdown entities are persisted as one projection snapshot.
- Aspect card rail and whiteboard graph are synchronized from the same snapshot.
- SPEC-level view renders feature cards and cross-feature edges from authoritative relationship index rows.
- Feature-level view renders concept/story cards grouped by aspect source.
- Concept-level detail includes explicit description/rules when available, otherwise deterministic fallback semantics.
- [MirrorProjectionBuilt](events.md#mirrorprojectionbuilt) is emitted with snapshot summary.

### Error States

| Condition                               | Result                                             |
| --------------------------------------- | -------------------------------------------------- |
| Missing required file                   | Reject with `MIRROR_REQUIRED_FILE_MISSING`         |
| Unknown source project                  | Reject with `MIRROR_SOURCE_PROJECT_UNKNOWN`        |
| Source feature folder missing           | Reject with `MIRROR_SOURCE_FEATURE_UNAVAILABLE`    |
| Invalid source root/path                | Reject with `MIRROR_SOURCE_ROOT_INVALID`           |
| Relationship index is missing/invalid   | Reject with `MIRROR_RELATIONSHIP_INDEX_INVALID`    |
| Unresolved edge endpoint                | Reject with `MIRROR_EDGE_ENDPOINT_UNKNOWN`         |
| Projection snapshot persistence failure | Reject with `MIRROR_PROJECTION_PERSISTENCE_FAILED` |

---

## SelectConcept

**Type:** Operation (interaction mutation)
**Actor:** Authenticated user through whiteboard interaction
**Triggers:** Click on feature card, story card, concept-group card, concept card, or cross-feature edge

### Input

| Field            | Type   | Required | Description                                               |
| ---------------- | ------ | -------- | --------------------------------------------------------- |
| projectKey       | string | yes      | Source project key                                        |
| featureId        | string | yes      | Feature slug inside source project                        |
| sessionId        | string | yes      | Active exploration session                                |
| selectedCardId   | string | yes      | Selected whiteboard card identifier                       |
| selectedCardType | string | yes      | `feature`, `story`, `concept-group`, `concept`            |
| selectedAspect   | string | no       | Active aspect card (`SPEC`, `DOMAIN`, `OPERATIONS`, ...)  |
| selectedEdgeKey  | string | no       | Edge key when interaction originated from a relation edge |
| source           | string | yes      | `rail`, `board`, `detail`, `card`, or `graph`             |

### Rules

| ID  | Rule                                                                        | Formal                                                                    |
| --- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| R0  | Session scope must match request scope                                      | `session.projectKey = projectKey and session.featureId = featureId`       |
| R1  | Selected card must exist in current whiteboard view                         | `exists card(selectedCardId, selectedCardType)`                           |
| R2  | Concept card must have definition pointer                                   | `selectedCardType='concept' -> exists definitionPointer`                  |
| R3  | Source must be supported                                                    | `source in {'rail','board','detail','card','graph'}`                      |
| R4  | Aspect switch must preserve relationship index mode                         | `selectedAspect change keeps relationSource='SPEC.relationshipIndex'`     |
| R5  | Cross-feature edge selection must persist highlight metadata for next scope | `selectedEdgeKey != null -> session.highlightedEdgeKey = selectedEdgeKey` |

### State Transition

[ExplorationSession](domain.md#explorationsession):

- `ProjectionReady -> ConceptFocused` when selecting concept/story card,
- `ProjectionReady -> ProjectionReady` with updated board scope when selecting feature/aspect-group card,
- `ConceptFocused -> ConceptFocused` when selecting a new concept in the same scope.

### Postconditions

- Session stores selected card identity and active board depth.
- Session stores edge highlight identity when interaction comes from a cross-feature edge.
- [ConceptSelected](events.md#conceptselected) is emitted for concept/story focus.
- Whiteboard payload for next query is scoped by selected card and aspect.

### Error States

| Condition            | Result                                           |
| -------------------- | ------------------------------------------------ |
| Unknown card         | Reject with `WHITEBOARD_CARD_NOT_FOUND`          |
| Invalid source       | Reject with `CONCEPT_SELECTION_SOURCE_INVALID`   |
| Scope mismatch       | Reject with `CONCEPT_SCOPE_MISMATCH`             |
| Missing card mapping | Reject with `WHITEBOARD_CARD_MAPPING_UNRESOLVED` |

---

## OpenDefinition

**Type:** Operation (interaction mutation)
**Actor:** Authenticated user
**Triggers:** "Open definition" click from concept detail

### Input

| Field      | Type   | Required | Description                                        |
| ---------- | ------ | -------- | -------------------------------------------------- |
| projectKey | string | yes      | Source project key                                 |
| featureId  | string | yes      | Feature slug in source project                     |
| sessionId  | string | yes      | Active exploration session                         |
| conceptId  | string | yes      | Focused concept identifier                         |
| aspectHint | string | no       | Preferred aspect file for definition visualization |

### Rules

| ID  | Rule                                                                          | Formal                                                              |
| --- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| R0  | Session scope must match request                                              | `session.projectKey = projectKey and session.featureId = featureId` |
| R1  | Session focus must match concept ID                                           | `session.selectedConceptId = conceptId`                             |
| R2  | Pointer must resolve to visible file/anchor                                   | `exists file(pointer.filePath) and exists anchor(pointer.anchor)`   |
| R3  | Aspect navigation hint must be valid                                          | `aspectHint is null or aspectHint in availableAspectKinds`          |
| R4  | Returned detail target must preserve enrichment mode and not discard fallback | `detail.enrichmentMode in {'explicit','fallback'}`                  |

### Calculations

| ID  | Calculation              | Formula                                                  |
| --- | ------------------------ | -------------------------------------------------------- |
| C1  | Target URL               | `target = pointer.filePath + '#' + pointer.anchor`       |
| C2  | Next board visualization | `nextBoard = pointer.aspectKind or aspectHint or 'SPEC'` |

### State Transition

[ExplorationSession](domain.md#explorationsession): `ConceptFocused -> DefinitionOpened`

### Postconditions

- Session stores `lastDefinitionTarget` and next aspect visualization.
- [DefinitionOpened](events.md#definitionopened) is emitted.
- Caller receives resolved [DefinitionPointer](domain.md#definitionpointer).

### Error States

| Condition        | Result                                     |
| ---------------- | ------------------------------------------ |
| Session mismatch | Reject with `DEFINITION_SESSION_MISMATCH`  |
| Missing pointer  | Reject with `DEFINITION_POINTER_NOT_FOUND` |
| Anchor not found | Reject with `DEFINITION_ANCHOR_NOT_FOUND`  |
| Scope mismatch   | Reject with `DEFINITION_SCOPE_MISMATCH`    |
