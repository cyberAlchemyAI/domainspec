# Queries: Knowledge Graph Visualization

## GetMirrorCards

**Type:** Query (read-only)
**Actor:** Authenticated user

Returns the aspect cards for the selected feature scope.

### Input

| Field        | Type   | Required | Description                                                      |
| ------------ | ------ | -------- | ---------------------------------------------------------------- |
| projectKey   | string | yes      | Source project key                                               |
| featureId    | string | yes      | Feature slug                                                     |
| activeAspect | string | no       | Active aspect for `cards[].isActive` derivation (default `SPEC`) |

### Filters

| Field                  | Type     | Default                                    | Description                       |
| ---------------------- | -------- | ------------------------------------------ | --------------------------------- |
| includeOptionalAspects | boolean  | true                                       | Include non-required aspect files |
| aspectKinds            | string[] | ['SPEC','DOMAIN','OPERATIONS','TEST-SPEC'] | Restrict aspect cards             |

### Output

| Field                | Type    | Source                                                   | Description                         |
| -------------------- | ------- | -------------------------------------------------------- | ----------------------------------- |
| projectKey           | string  | [ProjectionScope](domain.md#projectionscope).projectKey  | Source project key                  |
| featureId            | string  | [ProjectionScope](domain.md#projectionscope).featureId   | Source feature                      |
| cards[].cardId       | string  | [MirrorCardView](domain.md#mirrorcardview)               | Stable aspect card identity         |
| cards[].filePath     | string  | [MirrorCardView](domain.md#mirrorcardview).filePath      | Aspect file path                    |
| cards[].title        | string  | [MirrorCardView](domain.md#mirrorcardview).title         | Card label                          |
| cards[].aspectKind   | string  | [MirrorCardView](domain.md#mirrorcardview).aspectKind    | Aspect category                     |
| cards[].conceptCount | integer | [MirrorCardView](domain.md#mirrorcardview).conceptCount  | Concepts available in aspect        |
| cards[].storyCount   | integer | [MirrorCardView](domain.md#mirrorcardview).relationCount | Story card count derived for aspect |
| cards[].freshness    | string  | [MirrorCardView](domain.md#mirrorcardview).freshness     | Sync status                         |
| cards[].isActive     | boolean | Derived from request context                             | Active aspect indicator             |

### Reads From

| Entity                                                     | Relationship | Fields Used                    |
| ---------------------------------------------------------- | ------------ | ------------------------------ |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir |
| [MirrorProjection](domain.md#mirrorprojection)             | queries      | cards, featureId               |

---

## GetRelationshipGraph

**Type:** Query (read-only)
**Actor:** Authenticated user

Returns the whiteboard graph for the current aspect and drilldown level.

### Input

| Field             | Type   | Required | Description                                                             |
| ----------------- | ------ | -------- | ----------------------------------------------------------------------- |
| projectKey        | string | yes      | Source project key                                                      |
| featureId         | string | yes      | Feature slug                                                            |
| activeAspect      | string | yes      | Selected aspect card (`SPEC`, `DOMAIN`, `OPERATIONS`, `TEST-SPEC`, ...) |
| viewLevel         | string | yes      | `aspect`, `feature`, or `concept`                                       |
| selectedFeatureId | string | no       | Feature card selected from SPEC board                                   |
| selectedGroupKey  | string | no       | Aspect group selected in feature drilldown                              |

### Filters

| Field          | Type     | Default       | Description                              |
| -------------- | -------- | ------------- | ---------------------------------------- |
| cardTypes      | string[] | all           | Restrict whiteboard node/card types      |
| edgeKinds      | string[] | all canonical | Restrict edge labels                     |
| includeStories | boolean  | true          | Include story cards in feature drilldown |

### Output

| Field              | Type   | Source                                           | Description                                    |
| ------------------ | ------ | ------------------------------------------------ | ---------------------------------------------- |
| board.viewLevel    | string | Derived                                          | Active board depth                             |
| board.activeAspect | string | Derived                                          | Active aspect card                             |
| nodes[].cardId     | string | [MirrorProjection](domain.md#mirrorprojection)   | Whiteboard node identity                       |
| nodes[].cardType   | string | [MirrorProjection](domain.md#mirrorprojection)   | `feature`, `story`, `concept-group`, `concept` |
| nodes[].title      | string | [ConceptDefinition](domain.md#conceptdefinition) | Card title                                     |
| nodes[].summary    | string | [ConceptDefinition](domain.md#conceptdefinition) | Card summary                                   |
| nodes[].groupKey   | string | Derived from source file                         | Group key for concepts                         |
| edges[].fromCardId | string | [RelationshipEdge](domain.md#relationshipedge)   | Edge origin card                               |
| edges[].edge       | string | [RelationshipEdge](domain.md#relationshipedge)   | Canonical edge label                           |
| edges[].toCardId   | string | [RelationshipEdge](domain.md#relationshipedge)   | Edge destination card                          |
| edges[].evidence   | string | [RelationshipEdge](domain.md#relationshipedge)   | Evidence link from relationship index          |

### Reads From

| Entity                                                     | Relationship | Fields Used                              |
| ---------------------------------------------------------- | ------------ | ---------------------------------------- |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir           |
| [MirrorProjection](domain.md#mirrorprojection)             | queries      | cards, edges, generatedAt                |
| [ConceptDefinition](domain.md#conceptdefinition)           | queries      | conceptId, name, summary, sourceFilePath |

---

## GetConceptDetailCard

**Type:** Query (read-only)
**Actor:** Authenticated user

Returns detail payload for the selected whiteboard card.

### Input

| Field      | Type   | Required | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| projectKey | string | yes      | Source project key                   |
| featureId  | string | yes      | Feature slug                         |
| conceptId  | string | yes      | Selected card concept ID             |
| aspectHint | string | no       | Preferred aspect context for details |

### Filters

| Field           | Type    | Default | Description                |
| --------------- | ------- | ------- | -------------------------- |
| includeInbound  | boolean | true    | Include inbound relations  |
| includeOutbound | boolean | true    | Include outbound relations |
| includeStories  | boolean | true    | Include linked story cards |

### Output

| Field               | Type                                             | Source                                                               | Description                   |
| ------------------- | ------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------- |
| conceptId           | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).conceptId           | Selected concept              |
| title               | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).title               | Display title                 |
| summary             | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).summary             | Concept summary               |
| aspectKind          | string                                           | Derived from concept source file                                     | Aspect where concept belongs  |
| definition.filePath | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).definition.filePath | Definition file path          |
| definition.anchor   | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).definition.anchor   | Definition anchor             |
| inboundRelations    | [RelationshipEdge](domain.md#relationshipedge)[] | [ConceptDetailCard](domain.md#conceptdetailcard).inboundRelations    | Incoming edges                |
| outboundRelations   | [RelationshipEdge](domain.md#relationshipedge)[] | [ConceptDetailCard](domain.md#conceptdetailcard).outboundRelations   | Outgoing edges                |
| relatedStories      | string[]                                         | Derived from SPEC stories linkage                                    | Story cards linked to concept |

### Reads From

| Entity                                                     | Relationship | Fields Used                                           |
| ---------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir                        |
| [ConceptDefinition](domain.md#conceptdefinition)           | queries      | conceptId, summary, definitionPointer, sourceFilePath |
| [MirrorProjection](domain.md#mirrorprojection)             | queries      | edges, cards                                          |

---

## GetDefinitionPointer

**Type:** Query (read-only)
**Actor:** Authenticated user

### Input

| Field      | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| projectKey | string | yes      | Source project key             |
| featureId  | string | yes      | Feature slug                   |
| conceptId  | string | yes      | Selected concept ID            |
| aspectHint | string | no       | Requested aspect visualization |

### Filters

| Field             | Type    | Default | Description                |
| ----------------- | ------- | ------- | -------------------------- |
| preferExactAnchor | boolean | true    | Require exact anchor match |

### Output

| Field      | Type    | Source                                                    | Description                      |
| ---------- | ------- | --------------------------------------------------------- | -------------------------------- |
| filePath   | string  | [DefinitionPointer](domain.md#definitionpointer).filePath | Relative markdown path           |
| anchor     | string  | [DefinitionPointer](domain.md#definitionpointer).anchor   | Markdown anchor                  |
| lineHint   | integer | [DefinitionPointer](domain.md#definitionpointer).lineHint | Optional line hint               |
| label      | string  | [DefinitionPointer](domain.md#definitionpointer).label    | Link label                       |
| aspectKind | string  | Derived from filePath                                     | Aspect to activate in whiteboard |

### Reads From

| Entity                                                     | Relationship | Fields Used                       |
| ---------------------------------------------------------- | ------------ | --------------------------------- |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir    |
| [ConceptDefinition](domain.md#conceptdefinition)           | queries      | definitionPointer, sourceFilePath |
