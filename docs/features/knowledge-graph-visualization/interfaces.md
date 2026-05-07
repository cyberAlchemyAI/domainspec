# Interfaces: Knowledge Graph Visualization

## External: KnowledgeGraphAPI (REST)

### POST /api/knowledge-graph/rebuild

**Exposes:** [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)
**Auth:** Bearer token (`domainspec.kg.write`)

**Request:**

| Field       | Type     | Maps To                                                                      |
| ----------- | -------- | ---------------------------------------------------------------------------- |
| projectKey  | string   | [RebuildMirrorProjection](operations.md#rebuildmirrorprojection).projectKey  |
| featureId   | string   | [RebuildMirrorProjection](operations.md#rebuildmirrorprojection).featureId   |
| sourceFiles | string[] | [RebuildMirrorProjection](operations.md#rebuildmirrorprojection).sourceFiles |
| requestedBy | string   | [RebuildMirrorProjection](operations.md#rebuildmirrorprojection).requestedBy |

**Responses:**

| Status | Condition       | Body                          |
| ------ | --------------- | ----------------------------- |
| 200    | Success         | Snapshot summary              |
| 401    | Unauthorized    | Auth error                    |
| 403    | Forbidden scope | Missing `domainspec.kg.write` |
| 404    | Unknown scope   | Source project/feature error  |
| 422    | Invalid request | Validation error              |

### GET /api/knowledge-graph/mirror-cards

**Exposes:** [GetMirrorCards](queries.md#getmirrorcards)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field                  | Type     | Maps To                                                            |
| ---------------------- | -------- | ------------------------------------------------------------------ |
| projectKey             | string   | [GetMirrorCards](queries.md#getmirrorcards).projectKey             |
| featureId              | string   | [GetMirrorCards](queries.md#getmirrorcards).featureId              |
| includeOptionalAspects | boolean  | [GetMirrorCards](queries.md#getmirrorcards).includeOptionalAspects |
| aspectKinds[]          | string[] | [GetMirrorCards](queries.md#getmirrorcards).aspectKinds            |
| activeAspect           | string   | [GetMirrorCards](queries.md#getmirrorcards).activeAspect           |

**Responses:**

| Status | Condition      | Body                          |
| ------ | -------------- | ----------------------------- |
| 200    | Success        | `cards[]` aspect card payload |
| 401    | Unauthorized   | Auth error                    |
| 404    | Unknown scope  | Source project/feature error  |
| 422    | Invalid filter | Validation error              |

### GET /api/knowledge-graph/graph

**Exposes:** [GetRelationshipGraph](queries.md#getrelationshipgraph)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field             | Type     | Maps To                                                                   |
| ----------------- | -------- | ------------------------------------------------------------------------- |
| projectKey        | string   | [GetRelationshipGraph](queries.md#getrelationshipgraph).projectKey        |
| featureId         | string   | [GetRelationshipGraph](queries.md#getrelationshipgraph).featureId         |
| activeAspect      | string   | [GetRelationshipGraph](queries.md#getrelationshipgraph).activeAspect      |
| viewLevel         | string   | [GetRelationshipGraph](queries.md#getrelationshipgraph).viewLevel         |
| selectedFeatureId | string   | [GetRelationshipGraph](queries.md#getrelationshipgraph).selectedFeatureId |
| selectedGroupKey  | string   | [GetRelationshipGraph](queries.md#getrelationshipgraph).selectedGroupKey  |
| includeStories    | boolean  | [GetRelationshipGraph](queries.md#getrelationshipgraph).includeStories    |
| cardTypes[]       | string[] | [GetRelationshipGraph](queries.md#getrelationshipgraph).cardTypes         |
| edgeKinds[]       | string[] | [GetRelationshipGraph](queries.md#getrelationshipgraph).edgeKinds         |

**Responses:**

| Status | Condition      | Body                          |
| ------ | -------------- | ----------------------------- |
| 200    | Success        | `board`, `nodes[]`, `edges[]` |
| 401    | Unauthorized   | Auth error                    |
| 404    | Unknown scope  | Source project/feature error  |
| 422    | Invalid filter | Validation error              |

### GET /api/knowledge-graph/concepts/:conceptId

**Exposes:** [GetConceptDetailCard](queries.md#getconceptdetailcard)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field           | Type    | Maps To                                                                 |
| --------------- | ------- | ----------------------------------------------------------------------- |
| projectKey      | string  | [GetConceptDetailCard](queries.md#getconceptdetailcard).projectKey      |
| featureId       | string  | [GetConceptDetailCard](queries.md#getconceptdetailcard).featureId       |
| conceptId       | string  | [GetConceptDetailCard](queries.md#getconceptdetailcard).conceptId       |
| aspectHint      | string  | [GetConceptDetailCard](queries.md#getconceptdetailcard).aspectHint      |
| includeInbound  | boolean | [GetConceptDetailCard](queries.md#getconceptdetailcard).includeInbound  |
| includeOutbound | boolean | [GetConceptDetailCard](queries.md#getconceptdetailcard).includeOutbound |
| includeStories  | boolean | [GetConceptDetailCard](queries.md#getconceptdetailcard).includeStories  |

**Responses:**

| Status | Condition       | Body                         |
| ------ | --------------- | ---------------------------- |
| 200    | Success         | Concept detail card payload  |
| 404    | Unknown scope   | Source project/feature error |
| 404    | Concept missing | Not found error              |

### GET /api/knowledge-graph/concepts/:conceptId/definition

**Exposes:** [GetDefinitionPointer](queries.md#getdefinitionpointer)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field             | Type    | Maps To                                                                   |
| ----------------- | ------- | ------------------------------------------------------------------------- |
| projectKey        | string  | [GetDefinitionPointer](queries.md#getdefinitionpointer).projectKey        |
| featureId         | string  | [GetDefinitionPointer](queries.md#getdefinitionpointer).featureId         |
| conceptId         | string  | [GetDefinitionPointer](queries.md#getdefinitionpointer).conceptId         |
| aspectHint        | string  | [GetDefinitionPointer](queries.md#getdefinitionpointer).aspectHint        |
| preferExactAnchor | boolean | [GetDefinitionPointer](queries.md#getdefinitionpointer).preferExactAnchor |

**Responses:**

| Status | Condition       | Body                         |
| ------ | --------------- | ---------------------------- |
| 200    | Success         | Definition pointer payload   |
| 404    | Unknown scope   | Source project/feature error |
| 404    | Pointer missing | Not found error              |

### POST /api/knowledge-graph/concepts/:conceptId/open-definition

**Exposes:** [OpenDefinition](operations.md#opendefinition)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field      | Type   | Maps To                                                   |
| ---------- | ------ | --------------------------------------------------------- |
| projectKey | string | [OpenDefinition](operations.md#opendefinition).projectKey |
| featureId  | string | [OpenDefinition](operations.md#opendefinition).featureId  |
| sessionId  | string | [OpenDefinition](operations.md#opendefinition).sessionId  |
| conceptId  | string | [OpenDefinition](operations.md#opendefinition).conceptId  |
| aspectHint | string | [OpenDefinition](operations.md#opendefinition).aspectHint |

**Responses:**

| Status | Condition        | Body                         |
| ------ | ---------------- | ---------------------------- |
| 200    | Success          | Resolved definition target   |
| 404    | Unknown scope    | Source project/feature error |
| 409    | Session mismatch | Operation error              |
| 404    | Anchor missing   | Operation error              |

---

## Internal: KnowledgeGraphModule Interface

**Consumers:** web app adapters, documentation maintenance tooling

| Method                         | Maps To                                                          | Description                                            |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------ |
| rebuildMirrorProjection(input) | [RebuildMirrorProjection](operations.md#rebuildmirrorprojection) | Recompute aspect cards and whiteboard graph projection |
| selectConcept(input)           | [SelectConcept](operations.md#selectconcept)                     | Persist selected whiteboard card/context               |
| openDefinition(input)          | [OpenDefinition](operations.md#opendefinition)                   | Resolve/open definition pointer                        |
| getMirrorCards(input)          | [GetMirrorCards](queries.md#getmirrorcards)                      | Read aspect card rail payload                          |
| getRelationshipGraph(input)    | [GetRelationshipGraph](queries.md#getrelationshipgraph)          | Read whiteboard cards and edges                        |
| getConceptDetailCard(input)    | [GetConceptDetailCard](queries.md#getconceptdetailcard)          | Read card detail payload                               |
| getDefinitionPointer(input)    | [GetDefinitionPointer](queries.md#getdefinitionpointer)          | Read deep-link target                                  |

---

## Internal: ProjectSourceRegistry Interface

**Consumers:** backend adapters, projection rebuild pipeline

| Method                        | Maps To                                                        | Description                                       |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------- |
| resolveProjectionScope(input) | [ResolveProjectionScope](operations.md#resolveprojectionscope) | Resolve `projectKey + featureId` to trusted roots |
