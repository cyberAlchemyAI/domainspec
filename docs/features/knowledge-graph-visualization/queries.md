# Queries: Knowledge Graph Visualization

## GetMirrorCards

**Type:** Query (read-only)
**Actor:** Authenticated user

### Input

| Field                  | Type    | Required | Description                       |
| ---------------------- | ------- | -------- | --------------------------------- |
| featureId              | string  | yes      | Feature slug                      |
| includeOptionalAspects | boolean | no       | Include non-required aspect files |

### Filters

| Field       | Type     | Default                            | Description                       |
| ----------- | -------- | ---------------------------------- | --------------------------------- |
| aspectKinds | string[] | `['SPEC','DOMAIN','OPERATIONS']`   | Restrict returned card categories |
| freshness   | string[] | `['up-to-date','stale','missing']` | Filter by card freshness status   |

### Output

| Field                 | Type    | Source                                                   | Description              |
| --------------------- | ------- | -------------------------------------------------------- | ------------------------ |
| cards[].filePath      | string  | [MirrorCardView](domain.md#mirrorcardview).filePath      | Mirrored file path       |
| cards[].title         | string  | [MirrorCardView](domain.md#mirrorcardview).title         | Card label               |
| cards[].aspectKind    | string  | [MirrorCardView](domain.md#mirrorcardview).aspectKind    | File category            |
| cards[].conceptCount  | integer | [MirrorCardView](domain.md#mirrorcardview).conceptCount  | Concepts present in file |
| cards[].relationCount | integer | [MirrorCardView](domain.md#mirrorcardview).relationCount | Related graph edges      |
| cards[].freshness     | string  | [MirrorCardView](domain.md#mirrorcardview).freshness     | Sync status              |

### Reads From

| Entity                                         | Relationship | Fields Used      |
| ---------------------------------------------- | ------------ | ---------------- |
| [MirrorProjection](domain.md#mirrorprojection) | queries      | cards, featureId |

---

## GetRelationshipGraph

**Type:** Query (read-only)
**Actor:** Authenticated user

### Input

| Field     | Type   | Required | Description  |
| --------- | ------ | -------- | ------------ |
| featureId | string | yes      | Feature slug |

### Filters

| Field        | Type     | Default             | Description                        |
| ------------ | -------- | ------------------- | ---------------------------------- |
| edgeKinds    | string[] | all canonical kinds | Restrict edge labels in graph      |
| conceptTypes | string[] | all types           | Restrict graph node taxonomy types |

### Output

| Field                 | Type   | Source                                                        | Description          |
| --------------------- | ------ | ------------------------------------------------------------- | -------------------- |
| nodes[].conceptId     | string | [ConceptDefinition](domain.md#conceptdefinition).conceptId    | Node concept ID      |
| nodes[].name          | string | [ConceptDefinition](domain.md#conceptdefinition).name         | Node display name    |
| nodes[].taxonomyType  | string | [ConceptDefinition](domain.md#conceptdefinition).taxonomyType | Taxonomy type        |
| edges[].fromConceptId | string | [RelationshipEdge](domain.md#relationshipedge).fromConceptId  | Edge origin          |
| edges[].edge          | string | [RelationshipEdge](domain.md#relationshipedge).edge           | Canonical edge label |
| edges[].toConceptId   | string | [RelationshipEdge](domain.md#relationshipedge).toConceptId    | Edge destination     |
| edges[].evidence      | string | [RelationshipEdge](domain.md#relationshipedge).evidence       | Evidence link        |

### Reads From

| Entity                                           | Relationship | Fields Used                   |
| ------------------------------------------------ | ------------ | ----------------------------- |
| [MirrorProjection](domain.md#mirrorprojection)   | queries      | nodeCount, edgeCount, edges   |
| [ConceptDefinition](domain.md#conceptdefinition) | queries      | conceptId, name, taxonomyType |

---

## GetConceptDetailCard

**Type:** Query (read-only)
**Actor:** Authenticated user

### Input

| Field     | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| featureId | string | yes      | Feature slug        |
| conceptId | string | yes      | Selected concept ID |

### Filters

| Field           | Type    | Default | Description                    |
| --------------- | ------- | ------- | ------------------------------ |
| includeInbound  | boolean | true    | Include inbound related edges  |
| includeOutbound | boolean | true    | Include outbound related edges |

### Output

| Field               | Type                                             | Source                                                               | Description            |
| ------------------- | ------------------------------------------------ | -------------------------------------------------------------------- | ---------------------- |
| conceptId           | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).conceptId           | Selected concept ID    |
| title               | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).title               | Display title          |
| summary             | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).summary             | Concept summary        |
| definition.filePath | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).definition.filePath | Definition file path   |
| definition.anchor   | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).definition.anchor   | Definition anchor      |
| inboundRelations    | [RelationshipEdge](domain.md#relationshipedge)[] | [ConceptDetailCard](domain.md#conceptdetailcard).inboundRelations    | Related incoming edges |
| outboundRelations   | [RelationshipEdge](domain.md#relationshipedge)[] | [ConceptDetailCard](domain.md#conceptdetailcard).outboundRelations   | Related outgoing edges |

### Reads From

| Entity                                           | Relationship | Fields Used                                 |
| ------------------------------------------------ | ------------ | ------------------------------------------- |
| [ConceptDefinition](domain.md#conceptdefinition) | queries      | conceptId, name, summary, definitionPointer |
| [MirrorProjection](domain.md#mirrorprojection)   | queries      | edges                                       |

---

## GetDefinitionPointer

**Type:** Query (read-only)
**Actor:** Authenticated user

### Input

| Field     | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| featureId | string | yes      | Feature slug        |
| conceptId | string | yes      | Selected concept ID |

### Filters

| Field             | Type    | Default | Description                |
| ----------------- | ------- | ------- | -------------------------- |
| preferExactAnchor | boolean | true    | Require exact anchor match |

### Output

| Field    | Type    | Source                                                    | Description            |
| -------- | ------- | --------------------------------------------------------- | ---------------------- |
| filePath | string  | [DefinitionPointer](domain.md#definitionpointer).filePath | Relative markdown path |
| anchor   | string  | [DefinitionPointer](domain.md#definitionpointer).anchor   | Markdown anchor        |
| lineHint | integer | [DefinitionPointer](domain.md#definitionpointer).lineHint | Optional line hint     |
| label    | string  | [DefinitionPointer](domain.md#definitionpointer).label    | Link label             |

### Reads From

| Entity                                           | Relationship | Fields Used       |
| ------------------------------------------------ | ------------ | ----------------- |
| [ConceptDefinition](domain.md#conceptdefinition) | queries      | definitionPointer |
