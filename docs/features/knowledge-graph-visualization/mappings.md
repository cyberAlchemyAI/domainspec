# Mappings: Knowledge Graph Visualization

## IndexToGraphMapping

**From:** Feature index artifacts (`feature-map`, `features-index`, per-feature `SPEC.md` links)
**To:** [GraphSnapshot](domain.md#graphsnapshot), [GraphNode](domain.md#graphnode), [GraphEdge](domain.md#graphedge)
**Direction:** Inbound

### Field Mapping

| Source Field                      | Target Field                                         | Transform  | Notes                                                             |
| --------------------------------- | ---------------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| features-index.generatedAt        | [GraphSnapshot](domain.md#graphsnapshot).generatedAt | direct     | Snapshot timestamp                                                |
| features-index.features[].feature | [GraphNode](domain.md#graphnode).featureId           | direct     | Feature namespace                                                 |
| features-index.features[].domain  | [GraphNode](domain.md#graphnode).conceptId           | direct     | Uses canonical domain ID when present                             |
| features-index.features[].title   | [GraphNode](domain.md#graphnode).title               | direct     | Concept display title                                             |
| features-index.features[].status  | [GraphNode](domain.md#graphnode).status              | normalized | Normalize to [FeatureDocStatus](domain.md#featuredocstatus)       |
| feature-map rows                  | [GraphEdge](domain.md#graphedge).edgeType            | inferred   | Relationship inferred from dependency tables and capability links |
| spec anchors                      | [GraphEdge](domain.md#graphedge).evidencePath        | direct     | Stores source evidence path                                       |

### Defaults

| Target Field                                               | Default Value | Condition                                   |
| ---------------------------------------------------------- | ------------- | ------------------------------------------- |
| [GraphSnapshot](domain.md#graphsnapshot).staleAfterMinutes | 60            | Missing freshness config                    |
| [GraphNode](domain.md#graphnode).tags                      | []            | Source tags absent                          |
| [GraphEdge](domain.md#graphedge).crossFeature              | false         | Source does not indicate cross-feature edge |

### Validation

| Field                                                          | Validation                                   | On Failure                         |
| -------------------------------------------------------------- | -------------------------------------------- | ---------------------------------- |
| [GraphNode](domain.md#graphnode).conceptId                     | Unique in snapshot                           | Drop node and emit mapping warning |
| [GraphEdge](domain.md#graphedge).edgeType                      | Must exist in [EdgeType](domain.md#edgetype) | Reject edge                        |
| [GraphEdge](domain.md#graphedge).fromConceptId and toConceptId | Both nodes must exist                        | Reject edge                        |

---

## FeatureDocsToCapabilityCards

**From:** Feature capability sections in `SPEC.md`
**To:** [CapabilityAnchor](domain.md#capabilityanchor)
**Direction:** Inbound

### Field Mapping

| Source Field         | Target Field                                                   | Transform | Notes                       |
| -------------------- | -------------------------------------------------------------- | --------- | --------------------------- |
| spec feature id      | [CapabilityAnchor](domain.md#capabilityanchor).featureId       | direct    | Canonical feature namespace |
| capability title     | [CapabilityAnchor](domain.md#capabilityanchor).capabilityTitle | direct    | Display title               |
| capability link slug | [CapabilityAnchor](domain.md#capabilityanchor).capabilityKey   | slugify   | Stable key per feature      |
| spec path            | [CapabilityAnchor](domain.md#capabilityanchor).specPath        | direct    | Relative path               |
| capability anchor    | [CapabilityAnchor](domain.md#capabilityanchor).specAnchor      | direct    | Heading fragment            |
| capability summary   | [CapabilityAnchor](domain.md#capabilityanchor).summary         | direct    | Optional short summary      |

### Defaults

| Target Field                                           | Default Value         | Condition                 |
| ------------------------------------------------------ | --------------------- | ------------------------- |
| [CapabilityAnchor](domain.md#capabilityanchor).summary | "No summary provided" | Capability summary absent |

### Validation

| Field                                                        | Validation                      | On Failure                         |
| ------------------------------------------------------------ | ------------------------------- | ---------------------------------- |
| [CapabilityAnchor](domain.md#capabilityanchor).capabilityKey | Unique inside feature           | Reject duplicate capability anchor |
| [CapabilityAnchor](domain.md#capabilityanchor).specAnchor    | Must resolve in source document | Reject capability anchor           |

---

## ConceptToInspectorView

**From:** [GraphNode](domain.md#graphnode) plus [GraphEdge](domain.md#graphedge) evidence
**To:** Inspector DTO used by [GetConceptInspectorContext](queries.md#getconceptinspectorcontext)
**Direction:** Outbound

### Field Mapping

| Source Field                                  | Target Field             | Transform | Notes                    |
| --------------------------------------------- | ------------------------ | --------- | ------------------------ |
| [GraphNode](domain.md#graphnode).conceptId    | concept.id               | direct    | Inspector primary key    |
| [GraphNode](domain.md#graphnode).title        | concept.title            | direct    | Inspector display title  |
| [GraphNode](domain.md#graphnode).sourcePath   | concept.source.path      | direct    | Linkable evidence source |
| [GraphNode](domain.md#graphnode).sourceAnchor | concept.source.anchor    | direct    | Linkable heading anchor  |
| [GraphEdge](domain.md#graphedge).edgeType     | relations[].type         | direct    | Canonical relation label |
| [GraphEdge](domain.md#graphedge).evidencePath | relations[].evidencePath | direct    | Traceability evidence    |

### Defaults

| Target Field | Default Value | Condition                                    |
| ------------ | ------------- | -------------------------------------------- |
| relations[]  | []            | Concept has no matched edges in filter scope |

### Validation

| Field               | Validation                   | On Failure                                         |
| ------------------- | ---------------------------- | -------------------------------------------------- |
| concept.source.path | Must be a relative docs path | Replace with fallback source path and mark warning |

---

## GraphToCanvasProjection

**From:** [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth) and [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath) outputs
**To:** Constellation canvas DTO
**Direction:** Outbound

### Field Mapping

| Source Field                                   | Target Field                  | Transform | Notes                          |
| ---------------------------------------------- | ----------------------------- | --------- | ------------------------------ |
| [GraphNode](domain.md#graphnode).conceptId     | canvas.nodes[].id             | direct    | Stable node identity           |
| [GraphNode](domain.md#graphnode).conceptType   | canvas.nodes[].kind           | direct    | Taxonomy type for styling      |
| [GraphNode](domain.md#graphnode).featureId     | canvas.nodes[].group          | direct    | Feature-based grouping         |
| [GraphEdge](domain.md#graphedge).edgeType      | canvas.edges[].type           | direct    | Canonical relation label       |
| [GraphEdge](domain.md#graphedge).fromConceptId | canvas.edges[].source         | direct    | Source node id                 |
| [GraphEdge](domain.md#graphedge).toConceptId   | canvas.edges[].target         | direct    | Target node id                 |
| [GraphEdge](domain.md#graphedge).crossFeature  | canvas.edges[].isCrossFeature | direct    | Highlights cross-feature edges |

### Defaults

| Target Field              | Default Value | Condition                           |
| ------------------------- | ------------- | ----------------------------------- |
| canvas.nodes[].importance | 1             | Source importance score unavailable |
| canvas.edges[].weight     | 1             | Source edge weight unavailable      |

### Validation

| Field                            | Validation                                   | On Failure  |
| -------------------------------- | -------------------------------------------- | ----------- |
| canvas.edges[].type              | Must exist in [EdgeType](domain.md#edgetype) | Reject edge |
| canvas.edges[].source and target | Must reference existing canvas.nodes[].id    | Reject edge |

---

## RelationshipFamilyProjection

**From:** [GraphEdge](domain.md#graphedge)[]
**To:** Relation family summary DTO
**Direction:** Outbound

### Field Mapping

| Source Field                                  | Target Field                           | Transform | Notes                                      |
| --------------------------------------------- | -------------------------------------- | --------- | ------------------------------------------ |
| [GraphEdge](domain.md#graphedge).edgeType     | family                                 | classify  | Maps each edge type into one family bucket |
| [GraphEdge](domain.md#graphedge).edgeId       | familyCounts[family].count             | aggregate | Increments family edge count               |
| [GraphEdge](domain.md#graphedge).crossFeature | familyCounts[family].crossFeatureCount | aggregate | Increments cross-feature count             |

### Defaults

| Target Field | Default Value | Condition                |
| ------------ | ------------- | ------------------------ |
| familyCounts | `{}`          | No edges matched filters |

### Validation

| Field              | Validation                                             | On Failure                                          |
| ------------------ | ------------------------------------------------------ | --------------------------------------------------- |
| family             | Must map from canonical [EdgeType](domain.md#edgetype) | Reject edge from family summary                     |
| familyCounts total | Must equal projected edge count                        | Reject family summary and return projection warning |

---

## GraphToDependencyMatrixMapping

**From:** [GraphEdge](domain.md#graphedge)[], [GraphNode](domain.md#graphnode)[], and [ComputeDependencyRiskScore](operations.md#computedependencyriskscore) results
**To:** [FeaturePairImpact](domain.md#featurepairimpact) matrix cells
**Direction:** Bidirectional

### Field Mapping

| Source Field                         | Target Field                                                                         | Transform | Notes                      |
| ------------------------------------ | ------------------------------------------------------------------------------------ | --------- | -------------------------- |
| source/target feature ids from edges | [FeaturePairImpact](domain.md#featurepairimpact).sourceFeatureId and targetFeatureId | direct    | Matrix cell coordinates    |
| C1                                   | [FeaturePairImpact](domain.md#featurepairimpact).structuralCouplingRatio             | direct    | Structural ratio           |
| C2                                   | [FeaturePairImpact](domain.md#featurepairimpact).crossFeaturePropagationRatio        | direct    | Cross-feature ratio        |
| C3                                   | [FeaturePairImpact](domain.md#featurepairimpact).governanceExposureRatio             | direct    | Governance ratio           |
| C4                                   | [FeaturePairImpact](domain.md#featurepairimpact).lifecycleVolatilityRatio            | direct    | Lifecycle ratio            |
| C5                                   | [FeaturePairImpact](domain.md#featurepairimpact).riskScore                           | direct    | Risk score                 |
| C6                                   | [FeaturePairImpact](domain.md#featurepairimpact).riskBand                            | direct    | Computed risk band         |
| C6 plus exception state              | [FeaturePairImpact](domain.md#featurepairimpact).effectiveState                      | direct    | Effective governance state |

### Defaults

| Target Field                                                       | Default Value | Condition                    |
| ------------------------------------------------------------------ | ------------- | ---------------------------- |
| [FeaturePairImpact](domain.md#featurepairimpact).riskScore         | 0             | No qualifying edges for pair |
| [FeaturePairImpact](domain.md#featurepairimpact).riskBand          | Stable        | No qualifying edges for pair |
| [FeaturePairImpact](domain.md#featurepairimpact).activeExceptionId | null          | No active exception          |

### Validation

| Field                               | Validation                                   | On Failure         |
| ----------------------------------- | -------------------------------------------- | ------------------ |
| sourceFeatureId and targetFeatureId | Must differ                                  | Reject matrix cell |
| riskScore                           | Must be integer in range [0, 100]            | Reject matrix cell |
| riskBand                            | Must be valid [RiskBand](domain.md#riskband) | Reject matrix cell |

---

## PathToStoryboardMapping

**From:** [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath), [BuildImpactStoryboard](operations.md#buildimpactstoryboard), and [FeaturePairImpact](domain.md#featurepairimpact)
**To:** Storyboard DTO for [GetImpactStoryboard](queries.md#getimpactstoryboard)
**Direction:** Outbound

### Field Mapping

| Source Field               | Target Field                                   | Transform | Notes                                               |
| -------------------------- | ---------------------------------------------- | --------- | --------------------------------------------------- |
| query path nodes and edges | storyboard.steps[]                             | sequence  | Ordered into [TraceStep](domain.md#tracestep) items |
| matrix cell source/target  | storyboard.sourceFeatureId and targetFeatureId | direct    | Matrix coordinates                                  |
| matrix cell risk score     | storyboard.riskScore                           | direct    | Score context                                       |
| matrix cell risk band      | storyboard.riskBand                            | direct    | Governance context                                  |
| edge evidence paths        | storyboard.evidencePaths[]                     | aggregate | Unique evidence path list                           |

### Defaults

| Target Field               | Default Value | Condition                       |
| -------------------------- | ------------- | ------------------------------- |
| storyboard.steps[]         | []            | No path found under constraints |
| storyboard.evidencePaths[] | []            | No evidence paths available     |

### Validation

| Field                           | Validation                                   | On Failure               |
| ------------------------------- | -------------------------------------------- | ------------------------ |
| storyboard.steps[].edgeType     | Must exist in [EdgeType](domain.md#edgetype) | Reject step              |
| storyboard.steps[].evidencePath | Must be non-empty                            | Reject step              |
| storyboard source and target    | Must match matrix cell pair                  | Reject storyboard output |
