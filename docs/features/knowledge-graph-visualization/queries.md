# Queries: Knowledge Graph Visualization

## GetFeatureAtlas

**Type:** Query (read-only)
**Actor:** Authenticated documentation reader

### Input

| Field               | Type                               | Required | Description                                                               |
| ------------------- | ---------------------------------- | -------- | ------------------------------------------------------------------------- |
| profileId           | string                             | no       | Optional [VisualizationProfile](domain.md#visualizationprofile).profileId |
| filter              | [ViewFilter](domain.md#viewfilter) | no       | Optional filter override                                                  |
| includeCapabilities | boolean                            | no       | Includes capability anchors when true                                     |

### Filters

| Field      | Type                                           | Default | Description                                |
| ---------- | ---------------------------------------------- | ------- | ------------------------------------------ |
| pillar     | string                                         | all     | Restrict features by pillar                |
| status     | [FeatureDocStatus](domain.md#featuredocstatus) | all     | Restrict by feature status                 |
| priority   | string                                         | all     | Restrict by priority                       |
| tag        | string                                         | none    | Filter by one tag                          |
| searchText | string                                         | none    | Match on feature title or capability title |

### Output

| Field        | Type     | Source                                                | Description                           |
| ------------ | -------- | ----------------------------------------------------- | ------------------------------------- |
| snapshotId   | string   | [GraphSnapshot](domain.md#graphsnapshot).snapshotId   | Snapshot reference                    |
| generatedAt  | string   | [GraphSnapshot](domain.md#graphsnapshot).generatedAt  | Freshness timestamp                   |
| featureCount | number   | [GraphSnapshot](domain.md#graphsnapshot).featureCount | Result feature count                  |
| features[]   | object[] | [CapabilityAnchor](domain.md#capabilityanchor)        | Feature cards with capability anchors |

### Reads From

| Entity                                         | Relationship | Fields Used                                        |
| ---------------------------------------------- | ------------ | -------------------------------------------------- |
| [GraphSnapshot](domain.md#graphsnapshot)       | queries      | snapshotId, generatedAt, featureCount              |
| [CapabilityAnchor](domain.md#capabilityanchor) | queries      | featureId, capabilityKey, capabilityTitle, summary |
| [GraphNode](domain.md#graphnode)               | queries      | featureId, conceptType, status, tags               |

---

## GetCapabilityNeighborhood

**Type:** Query (read-only)
**Actor:** Authenticated documentation reader

### Input

| Field         | Type                               | Required | Description                          |
| ------------- | ---------------------------------- | -------- | ------------------------------------ |
| featureId     | string                             | yes      | Feature namespace                    |
| capabilityKey | string                             | yes      | Capability identifier inside feature |
| depth         | number                             | no       | Neighborhood depth, V1 max = 1       |
| filter        | [ViewFilter](domain.md#viewfilter) | no       | Optional edge and node filter        |

### Filters

| Field            | Type                                   | Default | Description                                |
| ---------------- | -------------------------------------- | ------- | ------------------------------------------ |
| conceptTypes     | [ConceptType](domain.md#concepttype)[] | all     | Restrict neighbor node types               |
| edgeTypes        | [EdgeType](domain.md#edgetype)[]       | all     | Restrict edge types                        |
| crossFeatureOnly | boolean                                | false   | Include only cross-feature edges when true |

### Output

| Field      | Type     | Source                                              | Description                        |
| ---------- | -------- | --------------------------------------------------- | ---------------------------------- |
| snapshotId | string   | [GraphSnapshot](domain.md#graphsnapshot).snapshotId | Snapshot reference                 |
| capability | object   | [CapabilityAnchor](domain.md#capabilityanchor)      | Selected capability anchor         |
| nodes[]    | object[] | [GraphNode](domain.md#graphnode)                    | Neighbor concept nodes             |
| edges[]    | object[] | [GraphEdge](domain.md#graphedge)                    | Typed edges between returned nodes |

### Reads From

| Entity                                         | Relationship | Fields Used                                                      |
| ---------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| [CapabilityAnchor](domain.md#capabilityanchor) | queries      | featureId, capabilityKey, capabilityTitle, specPath, specAnchor  |
| [GraphNode](domain.md#graphnode)               | queries      | conceptId, conceptType, title, sourcePath, sourceAnchor          |
| [GraphEdge](domain.md#graphedge)               | queries      | edgeType, fromConceptId, toConceptId, crossFeature, evidencePath |

---

## GetConceptInspectorContext

**Type:** Query (read-only)
**Actor:** Authenticated documentation reader

### Input

| Field           | Type    | Required | Description                       |
| --------------- | ------- | -------- | --------------------------------- |
| conceptId       | string  | yes      | Node identifier                   |
| includeIncoming | boolean | no       | Includes incoming edges when true |
| includeOutgoing | boolean | no       | Includes outgoing edges when true |

### Filters

| Field     | Type                             | Default | Description               |
| --------- | -------------------------------- | ------- | ------------------------- |
| edgeTypes | [EdgeType](domain.md#edgetype)[] | all     | Optional edge-type filter |

### Output

| Field                | Type     | Source                                         | Description                              |
| -------------------- | -------- | ---------------------------------------------- | ---------------------------------------- |
| concept              | object   | [GraphNode](domain.md#graphnode)               | Primary concept node                     |
| linkedCapabilities[] | object[] | [CapabilityAnchor](domain.md#capabilityanchor) | Capabilities that reference this concept |
| neighborEdges[]      | object[] | [GraphEdge](domain.md#graphedge)               | Incoming and outgoing typed edges        |

### Reads From

| Entity                                         | Relationship | Fields Used                                                        |
| ---------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| [GraphNode](domain.md#graphnode)               | queries      | conceptId, featureId, conceptType, title, sourcePath, sourceAnchor |
| [GraphEdge](domain.md#graphedge)               | queries      | edgeType, fromConceptId, toConceptId, crossFeature, evidencePath   |
| [CapabilityAnchor](domain.md#capabilityanchor) | queries      | featureId, capabilityKey, specPath, specAnchor                     |

---

## GetShortestCrossFeaturePath

**Type:** Query (read-only)
**Actor:** Architecture analyst

### Input

| Field              | Type    | Required | Description                               |
| ------------------ | ------- | -------- | ----------------------------------------- |
| sourceConceptId    | string  | yes      | Path starting concept                     |
| targetConceptId    | string  | yes      | Path target concept                       |
| maxDepth           | number  | no       | Maximum explored path depth, default 4    |
| preferCrossFeature | boolean | no       | Prioritizes cross-feature edges when true |

### Filters

| Field               | Type                                   | Default | Description                              |
| ------------------- | -------------------------------------- | ------- | ---------------------------------------- |
| edgeTypes           | [EdgeType](domain.md#edgetype)[]       | all     | Restrict path edge types                 |
| blockedConceptTypes | [ConceptType](domain.md#concepttype)[] | none    | Exclude specific concept types from path |

### Output

| Field     | Type     | Source                           | Description                          |
| --------- | -------- | -------------------------------- | ------------------------------------ |
| traceId   | string   | derived                          | Deterministic trace identifier       |
| nodes[]   | object[] | [GraphNode](domain.md#graphnode) | Ordered path nodes                   |
| edges[]   | object[] | [GraphEdge](domain.md#graphedge) | Ordered path edges                   |
| pathScore | number   | derived                          | Ranking score used for selected path |

### Reads From

| Entity                           | Relationship | Fields Used                                        |
| -------------------------------- | ------------ | -------------------------------------------------- |
| [GraphNode](domain.md#graphnode) | queries      | conceptId, featureId, conceptType                  |
| [GraphEdge](domain.md#graphedge) | queries      | edgeType, fromConceptId, toConceptId, crossFeature |

---

## GetNeighborhoodByDepth

**Type:** Query (read-only)
**Actor:** Architecture analyst

### Input

| Field         | Type                               | Required | Description                       |
| ------------- | ---------------------------------- | -------- | --------------------------------- |
| rootConceptId | string                             | yes      | Starting concept for exploration  |
| depth         | number                             | yes      | Exploration depth in range [1..4] |
| filter        | [ViewFilter](domain.md#viewfilter) | no       | Optional concept and edge filters |

### Filters

| Field            | Type                                   | Default | Description                     |
| ---------------- | -------------------------------------- | ------- | ------------------------------- |
| edgeTypes        | [EdgeType](domain.md#edgetype)[]       | all     | Restrict edge kinds             |
| conceptTypes     | [ConceptType](domain.md#concepttype)[] | all     | Restrict node kinds             |
| crossFeatureOnly | boolean                                | false   | Restrict to cross-feature edges |

### Output

| Field            | Type     | Source                           | Description                        |
| ---------------- | -------- | -------------------------------- | ---------------------------------- |
| rootConceptId    | string   | input                            | Root concept reference             |
| nodes[]          | object[] | [GraphNode](domain.md#graphnode) | Reachable concepts within depth    |
| edges[]          | object[] | [GraphEdge](domain.md#graphedge) | Reachable typed edges within depth |
| maxObservedDepth | number   | derived                          | Max depth reached in result        |

### Reads From

| Entity                           | Relationship | Fields Used                                        |
| -------------------------------- | ------------ | -------------------------------------------------- |
| [GraphNode](domain.md#graphnode) | queries      | conceptId, featureId, conceptType, title           |
| [GraphEdge](domain.md#graphedge) | queries      | edgeType, fromConceptId, toConceptId, crossFeature |

---

## GetEdgeTypedProjection

**Type:** Query (read-only)
**Actor:** Architecture analyst

### Input

| Field                  | Type                             | Required | Description                              |
| ---------------------- | -------------------------------- | -------- | ---------------------------------------- |
| contextConceptIds[]    | string[]                         | yes      | Concept set for projection               |
| edgeTypes[]            | [EdgeType](domain.md#edgetype)[] | no       | Optional edge-type constraints           |
| includeFamilyBreakdown | boolean                          | no       | Includes grouped family counts when true |

### Filters

| Field                   | Type    | Default | Description                                |
| ----------------------- | ------- | ------- | ------------------------------------------ |
| includeCrossFeatureOnly | boolean | false   | Restrict projection to cross-feature edges |

### Output

| Field            | Type     | Source                                        | Description                        |
| ---------------- | -------- | --------------------------------------------- | ---------------------------------- |
| projectedEdges[] | object[] | [GraphEdge](domain.md#graphedge)              | Filtered edge projection           |
| familyCounts     | object   | derived                                       | Edge counts by relationship family |
| evidencePaths[]  | string[] | [GraphEdge](domain.md#graphedge).evidencePath | Traceability evidence              |

### Reads From

| Entity                           | Relationship | Fields Used                                                      |
| -------------------------------- | ------------ | ---------------------------------------------------------------- |
| [GraphEdge](domain.md#graphedge) | queries      | edgeType, fromConceptId, toConceptId, crossFeature, evidencePath |

---

## GetDependencyMatrix

**Type:** Query (read-only)
**Actor:** Governance lead, release manager, architecture reviewer

### Input

| Field            | Type                           | Required | Description                                                           |
| ---------------- | ------------------------------ | -------- | --------------------------------------------------------------------- |
| snapshotId       | string                         | no       | Optional [GraphSnapshot](domain.md#graphsnapshot).snapshotId override |
| minRiskBand      | [RiskBand](domain.md#riskband) | no       | Optional minimum band filter                                          |
| includeMitigated | boolean                        | no       | Includes Mitigated cells when true                                    |

### Filters

| Field           | Type   | Default | Description                |
| --------------- | ------ | ------- | -------------------------- |
| sourceFeatureId | string | all     | Restrict matrix rows       |
| targetFeatureId | string | all     | Restrict matrix columns    |
| pillar          | string | all     | Restrict by feature pillar |

### Output

| Field        | Type     | Source                                                     | Description                 |
| ------------ | -------- | ---------------------------------------------------------- | --------------------------- |
| snapshotId   | string   | [GraphSnapshot](domain.md#graphsnapshot).snapshotId        | Snapshot used for matrix    |
| cells[]      | object[] | [FeaturePairImpact](domain.md#featurepairimpact)           | Risk matrix cells           |
| maxRiskScore | number   | [FeaturePairImpact](domain.md#featurepairimpact).riskScore | Highest score in result set |

### Reads From

| Entity                                           | Relationship | Fields Used                                                           |
| ------------------------------------------------ | ------------ | --------------------------------------------------------------------- |
| [GraphSnapshot](domain.md#graphsnapshot)         | queries      | snapshotId, generatedAt                                               |
| [FeaturePairImpact](domain.md#featurepairimpact) | queries      | sourceFeatureId, targetFeatureId, riskScore, riskBand, effectiveState |
| [RiskException](domain.md#riskexception)         | queries      | exceptionId, sourceFeatureId, targetFeatureId, status, expiresAt      |

---

## GetImpactStoryboard

**Type:** Query (read-only)
**Actor:** Governance lead, release manager

### Input

| Field           | Type   | Required | Description                  |
| --------------- | ------ | -------- | ---------------------------- |
| sourceFeatureId | string | yes      | Matrix source feature        |
| targetFeatureId | string | yes      | Matrix target feature        |
| releaseWindowId | string | no       | Optional release scope       |
| maxDepth        | number | no       | Optional traversal depth cap |

### Filters

| Field                   | Type    | Default | Description                                   |
| ----------------------- | ------- | ------- | --------------------------------------------- |
| includeAlternativePaths | boolean | false   | Include non-primary path candidates when true |

### Output

| Field           | Type                           | Source                                                           | Description                    |
| --------------- | ------------------------------ | ---------------------------------------------------------------- | ------------------------------ |
| storyboardId    | string                         | derived                                                          | Storyboard identifier          |
| sourceFeatureId | string                         | [FeaturePairImpact](domain.md#featurepairimpact).sourceFeatureId | Storyboard source feature      |
| targetFeatureId | string                         | [FeaturePairImpact](domain.md#featurepairimpact).targetFeatureId | Storyboard target feature      |
| riskScore       | number                         | [FeaturePairImpact](domain.md#featurepairimpact).riskScore       | Risk score used for storyboard |
| riskBand        | [RiskBand](domain.md#riskband) | [FeaturePairImpact](domain.md#featurepairimpact).riskBand        | Risk band used for storyboard  |
| steps[]         | object[]                       | [TraceStep](domain.md#tracestep)                                 | Ordered impact steps           |

### Reads From

| Entity                                           | Relationship | Fields Used                                                           |
| ------------------------------------------------ | ------------ | --------------------------------------------------------------------- |
| [FeaturePairImpact](domain.md#featurepairimpact) | queries      | sourceFeatureId, targetFeatureId, riskScore, riskBand, effectiveState |
| [GraphNode](domain.md#graphnode)                 | queries      | conceptId, title, featureId, sourcePath                               |
| [GraphEdge](domain.md#graphedge)                 | queries      | edgeType, fromConceptId, toConceptId, evidencePath                    |
