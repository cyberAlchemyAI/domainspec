# Operations: Knowledge Graph Visualization

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

| ID  | Rule                                            | Formal                                                       |
| --- | ----------------------------------------------- | ------------------------------------------------------------ |
| R1  | Project source must exist and be active         | `exists workspace(projectKey) and workspace.status='active'` |
| R2  | Feature docs root must contain target feature   | `exists dir(workspace.featureDocsRootDir + '/' + featureId)` |
| R3  | Resolved paths must stay inside workspace roots | `all resolvedPaths startsWith workspace.workspaceRootDir`    |

### Postconditions

- One [ProjectionScope](domain.md#projectionscope) is resolved and attached to request context.
- The resolved scope references one active [DocumentationWorkspace](domain.md#documentationworkspace).

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
| sourceFiles | string[] | yes      | Candidate markdown files to mirror as aspect cards                               |
| requestedBy | string   | yes      | Trigger identity                                                                 |

### Rules

| ID  | Rule                                                     | Formal                                                                |
| --- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| R0  | Projection scope must resolve first                      | `ResolveProjectionScope(projectKey, featureId) succeeds`              |
| R1  | Required aspect files must exist                         | `{'SPEC.md','domain.md','operations.md'} subsetOf sourceFiles`        |
| R2  | Aspect cards are one-to-one with mirrored files          | `count(aspectCards) = count(distinct mirroredFiles)`                  |
| R3  | Whiteboard feature-level relations come from SPEC index  | `all crossFeatureEdges source in SPEC.relationshipIndex`              |
| R4  | Concept and story cards are linked to selected feature   | `forall card in drilldownCards: card.featureId = selectedFeatureId`   |
| R5  | Concept grouping must be derivable by aspect source file | `forall conceptCard: conceptCard.groupKey = conceptCard.sourceAspect` |
| R6  | Projection persistence is atomic per snapshot            | `persist(snapshot) succeeds once OR operation rejects`                |

### Calculations

| ID  | Calculation                   | Formula                                                |
| --- | ----------------------------- | ------------------------------------------------------ |
| C1  | Aspect card count             | `aspectCardCount = count(distinct mirroredFiles)`      |
| C2  | Feature atlas node count      | `featureNodeCount = count(featureCards in SPEC board)` |
| C3  | Whiteboard edge density       | `edgeDensity = edgeCount / max(cardCount, 1)`          |
| C4  | Grouped concept cluster count | `clusterCount = count(distinct conceptCards.groupKey)` |

### State Transition

[ExplorationSession](domain.md#explorationsession): `Idle -> ProjectionReady`

### Postconditions

- Parsed markdown entities are persisted as one projection snapshot in database storage.
- Aspect card rail can render for current scope.
- SPEC whiteboard can render feature cards and cross-feature edges.
- Feature drilldown can render concept cards, grouped by aspect source, plus story cards.
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
**Actor:** Authenticated user through whiteboard click
**Triggers:** Click on feature card, story card, concept group card, or concept card

### Input

| Field            | Type   | Required | Description                                              |
| ---------------- | ------ | -------- | -------------------------------------------------------- |
| projectKey       | string | yes      | Source project key                                       |
| featureId        | string | yes      | Feature slug inside source project                       |
| sessionId        | string | yes      | Active exploration session                               |
| selectedCardId   | string | yes      | Selected whiteboard card identifier                      |
| selectedCardType | string | yes      | `feature`, `story`, `concept-group`, `concept`           |
| selectedAspect   | string | no       | Active aspect card (`SPEC`, `DOMAIN`, `OPERATIONS`, ...) |
| source           | string | yes      | `rail`, `board`, `detail`, `card`, or `graph`            |

### Rules

| ID  | Rule                                                | Formal                                                                |
| --- | --------------------------------------------------- | --------------------------------------------------------------------- |
| R0  | Session scope must match request scope              | `session.projectKey = projectKey and session.featureId = featureId`   |
| R1  | Selected card must exist in current whiteboard view | `exists card(selectedCardId, selectedCardType)`                       |
| R2  | Concept card must have definition pointer           | `selectedCardType='concept' -> exists definitionPointer`              |
| R3  | Source must be supported                            | `source in {'rail','board','detail','card','graph'}`                  |
| R4  | Aspect switch must preserve relationship index mode | `selectedAspect change keeps relationSource='SPEC.relationshipIndex'` |

### State Transition

[ExplorationSession](domain.md#explorationsession):

- `ProjectionReady -> ConceptFocused` when selecting concept/story card,
- `ProjectionReady -> ProjectionReady` with updated board scope when selecting feature/aspect-group card.

### Postconditions

- Session stores selected card identity and active board depth.
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
**Triggers:** "Open definition" click from card detail

### Input

| Field      | Type   | Required | Description                                        |
| ---------- | ------ | -------- | -------------------------------------------------- |
| projectKey | string | yes      | Source project key                                 |
| featureId  | string | yes      | Feature slug in source project                     |
| sessionId  | string | yes      | Active exploration session                         |
| conceptId  | string | yes      | Focused concept identifier                         |
| aspectHint | string | no       | Preferred aspect file for definition visualization |

### Rules

| ID  | Rule                                        | Formal                                                              |
| --- | ------------------------------------------- | ------------------------------------------------------------------- |
| R0  | Session scope must match request            | `session.projectKey = projectKey and session.featureId = featureId` |
| R1  | Session focus must match concept ID         | `session.selectedConceptId = conceptId`                             |
| R2  | Pointer must resolve to visible file/anchor | `exists file(pointer.filePath) and exists anchor(pointer.anchor)`   |
| R3  | Aspect navigation hint must be valid        | `aspectHint is null or aspectHint in availableAspectKinds`          |

### Calculations

| ID  | Calculation              | Formula                                                  |
| --- | ------------------------ | -------------------------------------------------------- |
| C1  | Target URL               | `target = pointer.filePath + '#' + pointer.anchor`       |
| C2  | Next board visualization | `nextBoard = pointer.aspectKind or aspectHint or 'SPEC'` |

### State Transition

[ExplorationSession](domain.md#explorationsession): `ConceptFocused -> DefinitionOpened`

### Postconditions

- Session stores `lastDefinitionTarget` and `lastAspectVisualization`.
- [DefinitionOpened](events.md#definitionopened) is emitted.
- Caller receives resolved [DefinitionPointer](domain.md#definitionpointer).

### Error States

| Condition        | Result                                     |
| ---------------- | ------------------------------------------ |
| Session mismatch | Reject with `DEFINITION_SESSION_MISMATCH`  |
| Missing pointer  | Reject with `DEFINITION_POINTER_NOT_FOUND` |
| Anchor not found | Reject with `DEFINITION_ANCHOR_NOT_FOUND`  |
| Scope mismatch   | Reject with `DEFINITION_SCOPE_MISMATCH`    |
