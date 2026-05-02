# Interfaces: Knowledge Graph Visualization

## External: KnowledgeGraphReadAPI (REST)

### GET /knowledge-graph/features

**Exposes:** [GetFeatureAtlas](queries.md#getfeatureatlas)
**Auth:** Bearer token with read scope

**Request:**

| Field               | Type    | Maps To                                                           |
| ------------------- | ------- | ----------------------------------------------------------------- |
| profileId           | string  | [GetFeatureAtlas](queries.md#getfeatureatlas).profileId           |
| pillar              | string  | [GetFeatureAtlas](queries.md#getfeatureatlas).filter.pillar       |
| status              | string  | [GetFeatureAtlas](queries.md#getfeatureatlas).filter.status       |
| priority            | string  | [GetFeatureAtlas](queries.md#getfeatureatlas).filter.priority     |
| tag                 | string  | [GetFeatureAtlas](queries.md#getfeatureatlas).filter.tag          |
| search              | string  | [GetFeatureAtlas](queries.md#getfeatureatlas).filter.searchText   |
| includeCapabilities | boolean | [GetFeatureAtlas](queries.md#getfeatureatlas).includeCapabilities |

**Responses:**

| Status | Condition                | Body                                                    |
| ------ | ------------------------ | ------------------------------------------------------- |
| 200    | Success                  | Atlas payload with feature cards and capability anchors |
| 400    | Invalid filter values    | Validation error payload                                |
| 401    | Missing or invalid token | Auth error payload                                      |

### GET /knowledge-graph/features/{featureId}/capabilities/{capabilityKey}/neighborhood

**Exposes:** [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood)
**Auth:** Bearer token with read scope

**Request:**

| Field            | Type     | Maps To                                                                                   |
| ---------------- | -------- | ----------------------------------------------------------------------------------------- |
| featureId        | string   | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood).featureId               |
| capabilityKey    | string   | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood).capabilityKey           |
| depth            | number   | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood).depth                   |
| conceptTypes[]   | string[] | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood).filter.conceptTypes     |
| edgeTypes[]      | string[] | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood).filter.edgeTypes        |
| crossFeatureOnly | boolean  | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood).filter.crossFeatureOnly |

**Responses:**

| Status | Condition                                | Body                                      |
| ------ | ---------------------------------------- | ----------------------------------------- |
| 200    | Success                                  | Neighborhood payload with nodes and edges |
| 400    | Depth out of V1 range or invalid filters | Validation error payload                  |
| 404    | Unknown feature or capability            | Not found error payload                   |
| 401    | Missing or invalid token                 | Auth error payload                        |

### GET /knowledge-graph/concepts/{conceptId}

**Exposes:** [GetConceptInspectorContext](queries.md#getconceptinspectorcontext)
**Auth:** Bearer token with read scope

**Request:**

| Field           | Type     | Maps To                                                                             |
| --------------- | -------- | ----------------------------------------------------------------------------------- |
| conceptId       | string   | [GetConceptInspectorContext](queries.md#getconceptinspectorcontext).conceptId       |
| includeIncoming | boolean  | [GetConceptInspectorContext](queries.md#getconceptinspectorcontext).includeIncoming |
| includeOutgoing | boolean  | [GetConceptInspectorContext](queries.md#getconceptinspectorcontext).includeOutgoing |
| edgeTypes[]     | string[] | [GetConceptInspectorContext](queries.md#getconceptinspectorcontext).edgeTypes       |

**Responses:**

| Status | Condition                | Body                                                       |
| ------ | ------------------------ | ---------------------------------------------------------- |
| 200    | Success                  | Inspector payload with concept evidence and neighbor edges |
| 404    | Unknown concept          | Not found error payload                                    |
| 401    | Missing or invalid token | Auth error payload                                         |

### GET /knowledge-graph/path

**Exposes:** [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath)
**Auth:** Bearer token with analysis scope

**Request:**

| Field              | Type     | Maps To                                                                                  |
| ------------------ | -------- | ---------------------------------------------------------------------------------------- |
| sourceConceptId    | string   | [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath).sourceConceptId    |
| targetConceptId    | string   | [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath).targetConceptId    |
| maxDepth           | number   | [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath).maxDepth           |
| preferCrossFeature | boolean  | [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath).preferCrossFeature |
| edgeTypes[]        | string[] | [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath).edgeTypes          |

**Responses:**

| Status | Condition                                  | Body                                                    |
| ------ | ------------------------------------------ | ------------------------------------------------------- |
| 200    | Success                                    | Deterministic path payload with nodes, edges, and score |
| 400    | Invalid path inputs or depth               | Validation error payload                                |
| 404    | Source/target concept not found or no path | Not found error payload                                 |
| 401    | Missing or invalid token                   | Auth error payload                                      |

### GET /knowledge-graph/concepts/{rootConceptId}/neighborhood/depth

**Exposes:** [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth)
**Auth:** Bearer token with analysis scope

**Request:**

| Field            | Type     | Maps To                                                                             |
| ---------------- | -------- | ----------------------------------------------------------------------------------- |
| rootConceptId    | string   | [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth).rootConceptId           |
| depth            | number   | [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth).depth                   |
| conceptTypes[]   | string[] | [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth).filter.conceptTypes     |
| edgeTypes[]      | string[] | [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth).filter.edgeTypes        |
| crossFeatureOnly | boolean  | [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth).filter.crossFeatureOnly |

**Responses:**

| Status | Condition                | Body                               |
| ------ | ------------------------ | ---------------------------------- |
| 200    | Success                  | Depth-bounded neighborhood payload |
| 400    | Invalid depth or filters | Validation error payload           |
| 404    | Unknown root concept     | Not found error payload            |
| 401    | Missing or invalid token | Auth error payload                 |

### POST /knowledge-graph/projections/edge-types

**Exposes:** [GetEdgeTypedProjection](queries.md#getedgetypedprojection)
**Auth:** Bearer token with analysis scope

**Request:**

| Field                   | Type     | Maps To                                                                             |
| ----------------------- | -------- | ----------------------------------------------------------------------------------- |
| contextConceptIds[]     | string[] | [GetEdgeTypedProjection](queries.md#getedgetypedprojection).contextConceptIds       |
| edgeTypes[]             | string[] | [GetEdgeTypedProjection](queries.md#getedgetypedprojection).edgeTypes               |
| includeFamilyBreakdown  | boolean  | [GetEdgeTypedProjection](queries.md#getedgetypedprojection).includeFamilyBreakdown  |
| includeCrossFeatureOnly | boolean  | [GetEdgeTypedProjection](queries.md#getedgetypedprojection).includeCrossFeatureOnly |

**Responses:**

| Status | Condition                         | Body                                              |
| ------ | --------------------------------- | ------------------------------------------------- |
| 200    | Success                           | Typed edge projection with optional family counts |
| 400    | Invalid context or filter payload | Validation error payload                          |
| 401    | Missing or invalid token          | Auth error payload                                |

### GET /knowledge-graph/dependency-matrix

**Exposes:** [GetDependencyMatrix](queries.md#getdependencymatrix)
**Auth:** Bearer token with governance read scope

**Request:**

| Field            | Type    | Maps To                                                                |
| ---------------- | ------- | ---------------------------------------------------------------------- |
| snapshotId       | string  | [GetDependencyMatrix](queries.md#getdependencymatrix).snapshotId       |
| minRiskBand      | string  | [GetDependencyMatrix](queries.md#getdependencymatrix).minRiskBand      |
| includeMitigated | boolean | [GetDependencyMatrix](queries.md#getdependencymatrix).includeMitigated |
| sourceFeatureId  | string  | [GetDependencyMatrix](queries.md#getdependencymatrix).sourceFeatureId  |
| targetFeatureId  | string  | [GetDependencyMatrix](queries.md#getdependencymatrix).targetFeatureId  |
| pillar           | string  | [GetDependencyMatrix](queries.md#getdependencymatrix).pillar           |

**Responses:**

| Status | Condition                | Body                                              |
| ------ | ------------------------ | ------------------------------------------------- |
| 200    | Success                  | Dependency matrix cells with risk score and state |
| 400    | Invalid matrix filters   | Validation error payload                          |
| 401    | Missing or invalid token | Auth error payload                                |

### GET /knowledge-graph/dependency-matrix/{sourceFeatureId}/{targetFeatureId}/storyboard

**Exposes:** [GetImpactStoryboard](queries.md#getimpactstoryboard)
**Auth:** Bearer token with governance read scope

**Request:**

| Field                   | Type    | Maps To                                                                       |
| ----------------------- | ------- | ----------------------------------------------------------------------------- |
| sourceFeatureId         | string  | [GetImpactStoryboard](queries.md#getimpactstoryboard).sourceFeatureId         |
| targetFeatureId         | string  | [GetImpactStoryboard](queries.md#getimpactstoryboard).targetFeatureId         |
| releaseWindowId         | string  | [GetImpactStoryboard](queries.md#getimpactstoryboard).releaseWindowId         |
| maxDepth                | number  | [GetImpactStoryboard](queries.md#getimpactstoryboard).maxDepth                |
| includeAlternativePaths | boolean | [GetImpactStoryboard](queries.md#getimpactstoryboard).includeAlternativePaths |

**Responses:**

| Status | Condition                              | Body                                                         |
| ------ | -------------------------------------- | ------------------------------------------------------------ |
| 200    | Success                                | Storyboard payload with ordered trace steps and risk summary |
| 404    | Unknown pair or storyboard unavailable | Not found error payload                                      |
| 401    | Missing or invalid token               | Auth error payload                                           |

### POST /knowledge-graph/dependency-risk/score

**Exposes:** [ComputeDependencyRiskScore](operations.md#computedependencyriskscore)
**Auth:** Bearer token with governance write scope

**Request:**

| Field           | Type    | Maps To                                                                                |
| --------------- | ------- | -------------------------------------------------------------------------------------- |
| sourceFeatureId | string  | [ComputeDependencyRiskScore](operations.md#computedependencyriskscore).sourceFeatureId |
| targetFeatureId | string  | [ComputeDependencyRiskScore](operations.md#computedependencyriskscore).targetFeatureId |
| snapshotId      | string  | [ComputeDependencyRiskScore](operations.md#computedependencyriskscore).snapshotId      |
| forceRecompute  | boolean | [ComputeDependencyRiskScore](operations.md#computedependencyriskscore).forceRecompute  |

**Responses:**

| Status | Condition                     | Body                                      |
| ------ | ----------------------------- | ----------------------------------------- |
| 200    | Success                       | Recomputed dependency risk score and band |
| 400    | Invalid pair or scoring input | Validation error payload                  |
| 401    | Missing or invalid token      | Auth error payload                        |

### POST /knowledge-graph/dependency-matrix/{sourceFeatureId}/{targetFeatureId}/storyboard

**Exposes:** [BuildImpactStoryboard](operations.md#buildimpactstoryboard)
**Auth:** Bearer token with governance write scope

**Request:**

| Field                   | Type    | Maps To                                                                              |
| ----------------------- | ------- | ------------------------------------------------------------------------------------ |
| sourceFeatureId         | string  | [BuildImpactStoryboard](operations.md#buildimpactstoryboard).sourceFeatureId         |
| targetFeatureId         | string  | [BuildImpactStoryboard](operations.md#buildimpactstoryboard).targetFeatureId         |
| maxDepth                | number  | [BuildImpactStoryboard](operations.md#buildimpactstoryboard).maxDepth                |
| includeAlternativePaths | boolean | [BuildImpactStoryboard](operations.md#buildimpactstoryboard).includeAlternativePaths |
| releaseWindowId         | string  | [BuildImpactStoryboard](operations.md#buildimpactstoryboard).releaseWindowId         |

**Responses:**

| Status | Condition                  | Body                                                 |
| ------ | -------------------------- | ---------------------------------------------------- |
| 200    | Success                    | Generated storyboard metadata and publication status |
| 400    | Invalid storyboard request | Validation error payload                             |
| 404    | Dependency pair not found  | Not found error payload                              |
| 401    | Missing or invalid token   | Auth error payload                                   |

### POST /knowledge-graph/dependency-risk/exceptions

**Exposes:** [ApproveRiskException](operations.md#approveriskexception)
**Auth:** Bearer token with governance-approver scope

**Request:**

| Field           | Type   | Maps To                                                                    |
| --------------- | ------ | -------------------------------------------------------------------------- |
| sourceFeatureId | string | [ApproveRiskException](operations.md#approveriskexception).sourceFeatureId |
| targetFeatureId | string | [ApproveRiskException](operations.md#approveriskexception).targetFeatureId |
| approvedBy      | string | [ApproveRiskException](operations.md#approveriskexception).approvedBy      |
| justification   | string | [ApproveRiskException](operations.md#approveriskexception).justification   |
| expiresAt       | string | [ApproveRiskException](operations.md#approveriskexception).expiresAt       |

**Responses:**

| Status | Condition                        | Body                                                |
| ------ | -------------------------------- | --------------------------------------------------- |
| 200    | Success                          | Exception approval payload with mitigation metadata |
| 400    | Invalid exception policy request | Validation error payload                            |
| 401    | Missing or invalid token         | Auth error payload                                  |
| 403    | Approver scope missing           | Authorization error payload                         |

---

## Internal: KnowledgeGraphReader Interface

**Consumers:** Docs portal UI layer, DomainSpec author tooling, governance review views

| Method                             | Maps To                                                                          | Description                                          |
| ---------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| getFeatureAtlas(input)             | [GetFeatureAtlas](queries.md#getfeatureatlas) query                              | Returns atlas cards and summary metadata             |
| getCapabilityNeighborhood(input)   | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood) query          | Returns one-hop capability neighborhood              |
| getConceptInspectorContext(input)  | [GetConceptInspectorContext](queries.md#getconceptinspectorcontext) query        | Returns concept detail with traceable evidence       |
| getShortestCrossFeaturePath(input) | [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath) query      | Returns ranked deterministic path between concepts   |
| getNeighborhoodByDepth(input)      | [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth) query                | Returns depth-bounded neighborhood for analysis      |
| getEdgeTypedProjection(input)      | [GetEdgeTypedProjection](queries.md#getedgetypedprojection) query                | Returns grouped relation projection                  |
| getDependencyMatrix(input)         | [GetDependencyMatrix](queries.md#getdependencymatrix) query                      | Returns governance matrix cells with score and state |
| getImpactStoryboard(input)         | [GetImpactStoryboard](queries.md#getimpactstoryboard) query                      | Returns ordered release impact storyboard            |
| computeDependencyRiskScore(input)  | [ComputeDependencyRiskScore](operations.md#computedependencyriskscore) operation | Recomputes dependency risk for one pair              |
| buildImpactStoryboard(input)       | [BuildImpactStoryboard](operations.md#buildimpactstoryboard) operation           | Generates and publishes storyboard artifact          |
| approveRiskException(input)        | [ApproveRiskException](operations.md#approveriskexception) operation             | Applies temporary mitigation override                |
