# Interfaces: Knowledge Graph Visualization

## External: KnowledgeGraphAPI (REST)

### GET /api/knowledge-graph/mirror-cards

**Exposes:** [GetMirrorCards](queries.md#getmirrorcards)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field                  | Type    | Maps To                                                            |
| ---------------------- | ------- | ------------------------------------------------------------------ |
| featureId              | string  | [GetMirrorCards](queries.md#getmirrorcards).featureId              |
| includeOptionalAspects | boolean | [GetMirrorCards](queries.md#getmirrorcards).includeOptionalAspects |

**Responses:**

| Status | Condition      | Body                          |
| ------ | -------------- | ----------------------------- |
| 200    | Success        | `cards[]` mirror card payload |
| 401    | Unauthorized   | auth error                    |
| 422    | Invalid filter | validation error              |

### GET /api/knowledge-graph/graph

**Exposes:** [GetRelationshipGraph](queries.md#getrelationshipgraph)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field          | Type     | Maps To                                                              |
| -------------- | -------- | -------------------------------------------------------------------- |
| featureId      | string   | [GetRelationshipGraph](queries.md#getrelationshipgraph).featureId    |
| edgeKinds[]    | string[] | [GetRelationshipGraph](queries.md#getrelationshipgraph).edgeKinds    |
| conceptTypes[] | string[] | [GetRelationshipGraph](queries.md#getrelationshipgraph).conceptTypes |

**Responses:**

| Status | Condition      | Body                 |
| ------ | -------------- | -------------------- |
| 200    | Success        | `nodes[]`, `edges[]` |
| 401    | Unauthorized   | auth error           |
| 422    | Invalid filter | validation error     |

### GET /api/knowledge-graph/concepts/:conceptId

**Exposes:** [GetConceptDetailCard](queries.md#getconceptdetailcard)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field     | Type   | Maps To                                                           |
| --------- | ------ | ----------------------------------------------------------------- |
| featureId | string | [GetConceptDetailCard](queries.md#getconceptdetailcard).featureId |
| conceptId | string | [GetConceptDetailCard](queries.md#getconceptdetailcard).conceptId |

**Responses:**

| Status | Condition       | Body                        |
| ------ | --------------- | --------------------------- |
| 200    | Success         | concept detail card payload |
| 404    | Concept missing | not found error             |

### GET /api/knowledge-graph/concepts/:conceptId/definition

**Exposes:** [GetDefinitionPointer](queries.md#getdefinitionpointer)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field     | Type   | Maps To                                                           |
| --------- | ------ | ----------------------------------------------------------------- |
| featureId | string | [GetDefinitionPointer](queries.md#getdefinitionpointer).featureId |
| conceptId | string | [GetDefinitionPointer](queries.md#getdefinitionpointer).conceptId |

**Responses:**

| Status | Condition       | Body                       |
| ------ | --------------- | -------------------------- |
| 200    | Success         | definition pointer payload |
| 404    | Pointer missing | not found error            |

### POST /api/knowledge-graph/concepts/:conceptId/open-definition

**Exposes:** [OpenDefinition](operations.md#opendefinition)
**Auth:** Bearer token (`domainspec.kg.read`)

**Request:**

| Field     | Type   | Maps To                                                  |
| --------- | ------ | -------------------------------------------------------- |
| sessionId | string | [OpenDefinition](operations.md#opendefinition).sessionId |
| conceptId | string | [OpenDefinition](operations.md#opendefinition).conceptId |

**Responses:**

| Status | Condition        | Body                       |
| ------ | ---------------- | -------------------------- |
| 200    | Success          | resolved definition target |
| 409    | Session mismatch | operation error            |
| 404    | Anchor missing   | operation error            |

---

## Internal: KnowledgeGraphModule Interface

**Consumers:** web app adapters, documentation maintenance tooling

| Method                         | Maps To                                                          | Description                          |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------------------ |
| rebuildMirrorProjection(input) | [RebuildMirrorProjection](operations.md#rebuildmirrorprojection) | Recompute cards and graph projection |
| selectConcept(input)           | [SelectConcept](operations.md#selectconcept)                     | Persist focused concept              |
| openDefinition(input)          | [OpenDefinition](operations.md#opendefinition)                   | Resolve/open definition pointer      |
| getMirrorCards(input)          | [GetMirrorCards](queries.md#getmirrorcards)                      | Read mirror card payload             |
| getRelationshipGraph(input)    | [GetRelationshipGraph](queries.md#getrelationshipgraph)          | Read graph nodes and edges           |
| getConceptDetailCard(input)    | [GetConceptDetailCard](queries.md#getconceptdetailcard)          | Read detail card payload             |
| getDefinitionPointer(input)    | [GetDefinitionPointer](queries.md#getdefinitionpointer)          | Read deep-link target                |
