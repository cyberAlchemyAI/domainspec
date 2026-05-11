# Queries: Knowledge Graph Visualization

## Capability Backlinks

- [Aspect Whiteboard Navigation](SPEC.md#aspect-whiteboard-navigation)
- [SPEC-Level Feature Atlas](SPEC.md#spec-level-feature-atlas)
- [Graph Layout & Edge Semantics Algorithm](SPEC.md#graph-layout--edge-semantics-algorithm)
- [Feature Drilldown By Aspect](SPEC.md#feature-drilldown-by-aspect)
- [Cross-Project Documentation Scope](SPEC.md#cross-project-documentation-scope)

## GetMirrorCards

**Type:** Query (read-only)
**Actor:** Authenticated user

Returns deterministic file-level aspect cards for the selected projection scope.

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

| Field                 | Type    | Source                                                            | Description                          |
| --------------------- | ------- | ----------------------------------------------------------------- | ------------------------------------ |
| projectKey            | string  | [ProjectionScope](domain.md#projectionscope).projectKey           | Source project key                   |
| featureId             | string  | [ProjectionScope](domain.md#projectionscope).featureId            | Source feature                       |
| hierarchySignature    | string  | [MirrorProjection](domain.md#mirrorprojection).hierarchySignature | Deterministic hierarchy snapshot key |
| cards[].cardId        | string  | [MirrorCardView](domain.md#mirrorcardview).cardId                 | Stable card identity                 |
| cards[].filePath      | string  | [MirrorCardView](domain.md#mirrorcardview).filePath               | Aspect file path                     |
| cards[].hierarchyPath | string  | [MirrorCardView](domain.md#mirrorcardview).hierarchyPath          | Stable `feature -> file` path        |
| cards[].title         | string  | [MirrorCardView](domain.md#mirrorcardview).title                  | Card label                           |
| cards[].aspectKind    | string  | [MirrorCardView](domain.md#mirrorcardview).aspectKind             | Aspect category                      |
| cards[].conceptCount  | integer | [MirrorCardView](domain.md#mirrorcardview).conceptCount           | Concepts available in aspect         |
| cards[].storyCount    | integer | [MirrorCardView](domain.md#mirrorcardview).storyCount             | Story count derived for aspect       |
| cards[].relationCount | integer | [MirrorCardView](domain.md#mirrorcardview).relationCount          | Relation count derived for aspect    |
| cards[].freshness     | string  | [MirrorCardView](domain.md#mirrorcardview).freshness              | Sync status                          |
| cards[].isActive      | boolean | Derived from request context                                      | Active aspect indicator              |

### Reads From

| Entity                                                     | Relationship | Fields Used                          |
| ---------------------------------------------------------- | ------------ | ------------------------------------ |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir       |
| [MirrorProjection](domain.md#mirrorprojection)             | queries      | cards, hierarchySignature, featureId |

---

## GetRelationshipGraph

**Type:** Query (read-only)
**Actor:** Authenticated user

Returns deterministic hierarchy projection and semantic edge payloads for the current aspect/view context.

### Input

| Field              | Type   | Required | Description                                                             |
| ------------------ | ------ | -------- | ----------------------------------------------------------------------- |
| projectKey         | string | yes      | Source project key                                                      |
| featureId          | string | yes      | Feature slug                                                            |
| activeAspect       | string | yes      | Selected aspect card (`SPEC`, `DOMAIN`, `OPERATIONS`, `TEST-SPEC`, ...) |
| viewLevel          | string | yes      | `aspect`, `feature`, or `concept`                                       |
| selectedFeatureId  | string | no       | Feature card selected from SPEC board                                   |
| selectedGroupKey   | string | no       | Aspect group selected in feature drilldown                              |
| highlightedEdgeKey | string | no       | Edge key to highlight after cross-feature navigation handoff            |

### Filters

| Field          | Type     | Default       | Description                              |
| -------------- | -------- | ------------- | ---------------------------------------- |
| cardTypes      | string[] | all           | Restrict whiteboard node/card types      |
| edgeKinds      | string[] | all canonical | Restrict edge labels                     |
| includeStories | boolean  | true          | Include story cards in feature drilldown |

### Output

| Field                       | Type    | Source                                                             | Description                                         |
| --------------------------- | ------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| board.viewLevel             | string  | Derived                                                            | Active board depth                                  |
| board.activeAspect          | string  | Derived                                                            | Active aspect card                                  |
| board.hierarchySignature    | string  | [MirrorProjection](domain.md#mirrorprojection).hierarchySignature  | Deterministic hierarchy key                         |
| board.relationColorPolicy   | string  | [MirrorProjection](domain.md#mirrorprojection).relationColorPolicy | Deterministic color mapping policy                  |
| board.highlightedEdgeKey    | string  | Derived                                                            | Currently highlighted cross-feature handoff edge    |
| nodes[].cardId              | string  | [MirrorProjection](domain.md#mirrorprojection)                     | Whiteboard node identity                            |
| nodes[].cardType            | string  | [MirrorProjection](domain.md#mirrorprojection)                     | `feature`, `story`, `concept-group`, `concept`      |
| nodes[].hierarchyPath       | string  | Derived from file/concept ancestry                                 | Stable `feature -> file -> concept` projection path |
| nodes[].title               | string  | [ConceptDefinition](domain.md#conceptdefinition)                   | Card title                                          |
| nodes[].summary             | string  | [ConceptDefinition](domain.md#conceptdefinition)                   | Card summary                                        |
| nodes[].groupKey            | string  | Derived from source file                                           | Group key for concepts                              |
| edges[].edgeKey             | string  | Derived                                                            | Stable edge identity used for highlighting          |
| edges[].fromCardId          | string  | [RelationshipEdge](domain.md#relationshipedge)                     | Edge origin card                                    |
| edges[].toCardId            | string  | [RelationshipEdge](domain.md#relationshipedge)                     | Edge destination card                               |
| edges[].semantic.type       | string  | [RelationshipEdge](domain.md#relationshipedge).edge                | Canonical relation type                             |
| edges[].semantic.from       | string  | Derived from source concept title                                  | Human label for source                              |
| edges[].semantic.to         | string  | Derived from target concept title                                  | Human label for target                              |
| edges[].semantic.why        | string  | [RelationshipEdge](domain.md#relationshipedge).evidence            | Evidence-backed semantic rationale                  |
| edges[].semantic.colorToken | string  | Derived from deterministic color policy                            | Stable relation color                               |
| edges[].isCrossFeature      | boolean | Derived                                                            | True when edge navigates to another feature         |
| edges[].targetProjectKey    | string  | [RelationshipEdge](domain.md#relationshipedge).targetProjectKey    | Target source project for cross-feature edge        |
| edges[].targetFeatureId     | string  | [RelationshipEdge](domain.md#relationshipedge).targetFeatureId     | Target feature for cross-feature edge               |

### Reads From

| Entity                                                     | Relationship | Fields Used                                           |
| ---------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir                        |
| [MirrorProjection](domain.md#mirrorprojection)             | queries      | cards, edges, hierarchySignature, relationColorPolicy |
| [ConceptDefinition](domain.md#conceptdefinition)           | queries      | conceptId, name, summary, sourceFilePath              |

---

## GetConceptDetailCard

**Type:** Query (read-only)
**Actor:** Authenticated user

Returns enriched detail payload for the selected whiteboard concept.

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

| Field               | Type                                             | Source                                                               | Description                            |
| ------------------- | ------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------- |
| conceptId           | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).conceptId           | Selected concept                       |
| title               | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).title               | Display title                          |
| summary             | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).summary             | Summary text                           |
| description         | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).description         | Expanded text when available           |
| rules               | string[]                                         | [ConceptDetailCard](domain.md#conceptdetailcard).rules               | Rule/invariant bullets                 |
| enrichmentMode      | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).enrichmentMode      | `explicit` or deterministic `fallback` |
| aspectKind          | string                                           | [DefinitionPointer](domain.md#definitionpointer).aspectKind          | Aspect where concept belongs           |
| definition.filePath | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).definition.filePath | Definition file path                   |
| definition.anchor   | string                                           | [ConceptDetailCard](domain.md#conceptdetailcard).definition.anchor   | Definition anchor                      |
| inboundRelations    | [RelationshipEdge](domain.md#relationshipedge)[] | [ConceptDetailCard](domain.md#conceptdetailcard).inboundRelations    | Incoming canonical relations           |
| outboundRelations   | [RelationshipEdge](domain.md#relationshipedge)[] | [ConceptDetailCard](domain.md#conceptdetailcard).outboundRelations   | Outgoing canonical relations           |
| relatedStories      | string[]                                         | Derived from SPEC stories linkage                                    | Story cards linked to concept          |

### Reads From

| Entity                                                     | Relationship | Fields Used                                                               |
| ---------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir                                            |
| [ConceptDefinition](domain.md#conceptdefinition)           | queries      | conceptId, summary, description, rules, enrichmentMode, definitionPointer |
| [MirrorProjection](domain.md#mirrorprojection)             | queries      | edges, cards                                                              |

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

| Field      | Type    | Source                                                      | Description                      |
| ---------- | ------- | ----------------------------------------------------------- | -------------------------------- |
| filePath   | string  | [DefinitionPointer](domain.md#definitionpointer).filePath   | Relative markdown path           |
| anchor     | string  | [DefinitionPointer](domain.md#definitionpointer).anchor     | Markdown anchor                  |
| lineHint   | integer | [DefinitionPointer](domain.md#definitionpointer).lineHint   | Optional line hint               |
| label      | string  | [DefinitionPointer](domain.md#definitionpointer).label      | Link label                       |
| aspectKind | string  | [DefinitionPointer](domain.md#definitionpointer).aspectKind | Aspect to activate in whiteboard |

### Reads From

| Entity                                                     | Relationship | Fields Used                       |
| ---------------------------------------------------------- | ------------ | --------------------------------- |
| [DocumentationWorkspace](domain.md#documentationworkspace) | queries      | projectKey, featureDocsRootDir    |
| [ConceptDefinition](domain.md#conceptdefinition)           | queries      | definitionPointer, sourceFilePath |
