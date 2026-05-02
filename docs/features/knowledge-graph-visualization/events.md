# Events: Knowledge Graph Visualization

## ProjectionBuilt

**Produced by:** projection refresh process
**Triggers transition:** N/A (read-model synchronization signal)

### Payload

| Field        | Type              | Description                       |
| ------------ | ----------------- | --------------------------------- |
| snapshotId   | string            | Generated snapshot identifier     |
| generatedAt  | string (ISO-8601) | Snapshot generation timestamp     |
| featureCount | number            | Total features in the snapshot    |
| conceptCount | number            | Total concepts in the snapshot    |
| edgeCount    | number            | Total typed edges in the snapshot |

### Consumed by

| Consumer                                                    | Action                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| [GetFeatureAtlas](queries.md#getfeatureatlas)               | Uses newest snapshot metadata for freshness and counts |
| [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth) | Uses synchronized graph projection data                |

---

## TraceComputed

**Produced by:** [TraceSelectionWorkflow](workflows.md#traceselectionworkflow)
**Triggers transition:** N/A (analysis result signal)

### Payload

| Field           | Type     | Description                           |
| --------------- | -------- | ------------------------------------- |
| traceId         | string   | Computed trace identifier             |
| sourceConceptId | string   | Trace start concept                   |
| targetConceptId | string   | Trace target concept                  |
| pathLength      | number   | Number of edges in selected path      |
| pathScore       | number   | Ranked score used for selected path   |
| usedEdgeTypes   | string[] | Canonical edge types included in path |

### Consumed by

| Consumer                                                              | Action                                            |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath) | Returns deterministic ranked path details         |
| [GetEdgeTypedProjection](queries.md#getedgetypedprojection)           | Builds typed projections for inspector and legend |

---

## LensSaved

**Produced by:** analyst lens persistence hook
**Triggers transition:** N/A (view preference signal)

### Payload

| Field        | Type              | Description           |
| ------------ | ----------------- | --------------------- |
| lensId       | string            | Saved lens identifier |
| ownerId      | string            | Lens owner identifier |
| edgeTypes    | string[]          | Edge filter set       |
| conceptTypes | string[]          | Concept filter set    |
| maxDepth     | number            | Depth preference      |
| savedAt      | string (ISO-8601) | Save timestamp        |

### Consumed by

| Consumer                                                    | Action                                   |
| ----------------------------------------------------------- | ---------------------------------------- |
| [GetEdgeTypedProjection](queries.md#getedgetypedprojection) | Applies saved lens filter defaults       |
| [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth) | Applies saved depth and type constraints |

---

## DependencyRiskRaised

**Produced by:** [ComputeDependencyRiskScore](operations.md#computedependencyriskscore)
**Triggers transition:** [Warning -> Critical](states.md#dependencyriskstate) or [Watch -> Warning](states.md#dependencyriskstate)

### Payload

| Field           | Type                           | Description                    |
| --------------- | ------------------------------ | ------------------------------ |
| sourceFeatureId | string                         | Source feature id              |
| targetFeatureId | string                         | Target feature id              |
| previousState   | [RiskBand](domain.md#riskband) | Previous dependency risk state |
| currentState    | [RiskBand](domain.md#riskband) | Current dependency risk state  |
| riskScore       | number                         | Newly computed risk score      |
| snapshotId      | string                         | Snapshot used for computation  |

### Consumed by

| Consumer                                                      | Action                                     |
| ------------------------------------------------------------- | ------------------------------------------ |
| [GetDependencyMatrix](queries.md#getdependencymatrix)         | Displays updated high-risk cells           |
| [RiskAssessmentWorkflow](workflows.md#riskassessmentworkflow) | Routes elevated pairs to governance triage |

---

## DependencyRiskMitigated

**Produced by:** [ApproveRiskException](operations.md#approveriskexception)
**Triggers transition:** [Warning -> Mitigated](states.md#dependencyriskstate) or [Critical -> Mitigated](states.md#dependencyriskstate)

### Payload

| Field           | Type              | Description                   |
| --------------- | ----------------- | ----------------------------- |
| sourceFeatureId | string            | Source feature id             |
| targetFeatureId | string            | Target feature id             |
| exceptionId     | string            | Approved exception identifier |
| approvedBy      | string            | Governance approver           |
| expiresAt       | string (ISO-8601) | Exception expiration          |
| riskScore       | number            | Preserved computed score      |

### Consumed by

| Consumer                                                    | Action                                             |
| ----------------------------------------------------------- | -------------------------------------------------- |
| [GetDependencyMatrix](queries.md#getdependencymatrix)       | Displays effective Mitigated state for pair        |
| [ReleaseImpactWorkflow](workflows.md#releaseimpactworkflow) | Applies mitigation status in release decision flow |

---

## StoryboardPublished

**Produced by:** [BuildImpactStoryboard](operations.md#buildimpactstoryboard)
**Triggers transition:** N/A (analysis publication signal)

### Payload

| Field           | Type                           | Description                       |
| --------------- | ------------------------------ | --------------------------------- |
| storyboardId    | string                         | Published storyboard identifier   |
| sourceFeatureId | string                         | Source feature id                 |
| targetFeatureId | string                         | Target feature id                 |
| stepCount       | number                         | Number of steps in storyboard     |
| riskBand        | [RiskBand](domain.md#riskband) | Risk band attached to publication |
| publishedAt     | string (ISO-8601)              | Publication timestamp             |

### Consumed by

| Consumer                                                    | Action                                     |
| ----------------------------------------------------------- | ------------------------------------------ |
| [GetImpactStoryboard](queries.md#getimpactstoryboard)       | Serves latest published storyboard view    |
| [ReleaseImpactWorkflow](workflows.md#releaseimpactworkflow) | Uses publication as release evidence input |
