# Knowledge Graph Visualization - User Stories

> Source of storytelling truth for [knowledge-graph-visualization](SPEC.md).

## US-V1-01 Quickly Understand Feature Landscape

**Classic format**
As a documentation reader, I want to browse a pillar-grouped atlas of features and capabilities, so that I can understand what the system contains in a few minutes.

**BDD scenario**
Given the visualization module has a generated snapshot
When I open the atlas view
Then I see features grouped by pillar, with capability anchors and current documentation status

**Acceptance checks**

- [ ] Atlas is retrieved by [GetFeatureAtlas](queries.md#getfeatureatlas).
- [ ] Each card shows feature id, title, status, and priority.
- [ ] Capability anchors come from [CapabilityAnchor](domain.md#capabilityanchor).
- [ ] Snapshot freshness uses [GraphSnapshot](domain.md#graphsnapshot).generatedAt.

**Capability link**: [V1 Capability Atlas Board](capabilities/v1-capability-atlas-board.md)

---

## US-V1-02 Drill Down Into Capability Neighborhood

**Classic format**
As a technical reader, I want to open one capability and see its immediate concept neighborhood, so that I can understand local relationships without graph overload.

**BDD scenario**
Given I selected one feature capability
When I open neighborhood preview
Then I receive depth-1 nodes and typed edges connected to that capability context

**Acceptance checks**

- [ ] Neighborhood is retrieved by [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood).
- [ ] V1 depth is limited to one hop.
- [ ] Edges are labeled only with values from [EdgeType](domain.md#edgetype).
- [ ] Cross-feature edges indicate whether [GraphEdge](domain.md#graphedge).crossFeature is true.

**Capability link**: [V1 Capability Atlas Board](capabilities/v1-capability-atlas-board.md)

---

## US-V1-03 Inspect One Concept With Evidence

**Classic format**
As a feature author, I want to inspect a concept and see its evidence links, so that I can validate where each concept is defined and connected.

**BDD scenario**
Given I selected one concept from atlas or neighborhood
When I open the inspector panel
Then I see concept metadata, incoming/outgoing edges, and evidence path references

**Acceptance checks**

- [ ] Inspector context is retrieved by [GetConceptInspectorContext](queries.md#getconceptinspectorcontext).
- [ ] Concept metadata includes concept type and source path from [GraphNode](domain.md#graphnode).
- [ ] Inspector lists linked capabilities and neighbor edges.
- [ ] Evidence paths come from [GraphEdge](domain.md#graphedge).evidencePath or [GraphNode](domain.md#graphnode).sourcePath.

**Capability link**: [V1 Capability Atlas Board](capabilities/v1-capability-atlas-board.md)

---

## US-V1-04 Preview Cross-Feature Connections

**Classic format**
As an architecture reviewer, I want to preview first-hop cross-feature relations while browsing, so that I can quickly spot coupling between features.

**BDD scenario**
Given a selected capability has cross-feature relationships
When neighborhood preview renders
Then I can identify target feature and relationship type for each cross-feature edge

**Acceptance checks**

- [ ] Cross-feature previews include `produces-for`, `triggers-cross`, and `enforces-cross` when present.
- [ ] Each preview includes target feature id, edge type, and evidence path.
- [ ] All preview labels match [EdgeType](domain.md#edgetype).

**Capability link**: [V1 Capability Atlas Board](capabilities/v1-capability-atlas-board.md)

---

## US-V2-01 Find Shortest Cross-Feature Path

**Classic format**
As an architecture analyst, I want to find the deterministic shortest path between two concepts across features, so that I can quickly understand coupling and propagation chains.

**BDD scenario**
Given I selected source and target concepts
When I run shortest-path analysis
Then I receive a deterministic ranked path with canonical edge labels and evidence paths

**Acceptance checks**

- [ ] Path retrieval uses [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath).
- [ ] Path ranking follows policy in [TraceSelectionWorkflow](workflows.md#traceselectionworkflow).
- [ ] Returned edges use only [EdgeType](domain.md#edgetype).
- [ ] Trace payload semantics align with [TraceComputed](events.md#tracecomputed).

**Capability link**: [V2 Relationship Constellation Canvas](capabilities/v2-relationship-constellation-canvas.md)

---

## US-V2-02 Explore Multi-Hop Neighborhoods

**Classic format**
As an architecture analyst, I want to expand a concept neighborhood by depth with filters, so that I can inspect relationship density and downstream reach.

**BDD scenario**
Given I selected a root concept and depth
When I run neighborhood analysis
Then I receive nodes and edges reachable within the selected depth and filter constraints

**Acceptance checks**

- [ ] Neighborhood retrieval uses [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth).
- [ ] Depth validation follows [MultiHopAnalysisWorkflow](workflows.md#multihopanalysisworkflow).
- [ ] Returned node and edge sets are bounded by requested depth.
- [ ] Projection freshness is compatible with [ProjectionBuilt](events.md#projectionbuilt).

**Capability link**: [V2 Relationship Constellation Canvas](capabilities/v2-relationship-constellation-canvas.md)

---

## US-V2-03 Analyze Typed Relationship Families

**Classic format**
As an architecture analyst, I want to group edges into relationship families, so that I can reason about structural, behavioral, governance, cross-feature, and lifecycle coupling.

**BDD scenario**
Given I have a concept context and edge filters
When I request typed projection
Then I receive projected edges and family counts with traceable evidence paths

**Acceptance checks**

- [ ] Typed projection uses [GetEdgeTypedProjection](queries.md#getedgetypedprojection).
- [ ] Family grouping follows [RelationshipFamilyProjection](mappings.md#relationshipfamilyprojection).
- [ ] Family counts reconcile with projected edge count.
- [ ] Lens persistence semantics are compatible with [LensSaved](events.md#lenssaved).

**Capability link**: [V2 Relationship Constellation Canvas](capabilities/v2-relationship-constellation-canvas.md)

---

## US-V3-01 Review Dependency Matrix Risk Bands

**Classic format**
As a governance lead, I want to review dependency matrix cells by risk band, so that I can prioritize cross-feature pairs that require release scrutiny.

**BDD scenario**
Given matrix data is refreshed for the current snapshot
When I open the dependency matrix with a minimum risk-band filter
Then I receive feature-pair cells with score, risk band, and effective state metadata

**Acceptance checks**

- [ ] Matrix retrieval uses [GetDependencyMatrix](queries.md#getdependencymatrix).
- [ ] Score and band semantics align with [ComputeDependencyRiskScore](operations.md#computedependencyriskscore).
- [ ] Effective state transitions align with [DependencyRiskState](states.md#dependencyriskstate).
- [ ] Raised-risk transitions align with [DependencyRiskRaised](events.md#dependencyriskraised).

**Capability link**: [V3 Dependency Matrix + Trace Storyboard](capabilities/v3-dependency-matrix-trace-storyboard.md)

---

## US-V3-02 Analyze Release Impact Storyboard

**Classic format**
As a release manager, I want a deterministic impact storyboard for one high-risk pair, so that I can justify release decisions with traceable evidence.

**BDD scenario**
Given I selected one source-target pair from the matrix
When I request release impact analysis
Then a published storyboard returns ordered steps with evidence paths and risk context

**Acceptance checks**

- [ ] Storyboard generation uses [BuildImpactStoryboard](operations.md#buildimpactstoryboard).
- [ ] Storyboard retrieval uses [GetImpactStoryboard](queries.md#getimpactstoryboard).
- [ ] Storyboard steps align with [TraceStep](domain.md#tracestep) and [PathToStoryboardMapping](mappings.md#pathtostoryboardmapping).
- [ ] Publication signal aligns with [StoryboardPublished](events.md#storyboardpublished).

**Capability link**: [V3 Dependency Matrix + Trace Storyboard](capabilities/v3-dependency-matrix-trace-storyboard.md)

---

## US-V3-03 Approve Temporary Risk Exception

**Classic format**
As a governance approver, I want to approve a bounded risk exception for a warning or critical pair, so that urgent releases can proceed with explicit accountability.

**BDD scenario**
Given a dependency pair is in Warning or Critical state
When I approve an exception with justification and expiry
Then the pair effective state becomes Mitigated while preserving the computed risk score

**Acceptance checks**

- [ ] Exception approval uses [ApproveRiskException](operations.md#approveriskexception).
- [ ] Exception constraints follow rules R1-R5 in [ApproveRiskException](operations.md#approveriskexception).
- [ ] Transition to Mitigated follows [DependencyRiskState](states.md#dependencyriskstate).
- [ ] Mitigation signal aligns with [DependencyRiskMitigated](events.md#dependencyriskmitigated).

**Capability link**: [V3 Dependency Matrix + Trace Storyboard](capabilities/v3-dependency-matrix-trace-storyboard.md)

---

## Story Coverage Matrix

| Story ID | Capability                              | Core Concepts                                                                                                      | Core Queries                                                          |
| -------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| US-V1-01 | V1 Capability Atlas Board               | [GraphSnapshot](domain.md#graphsnapshot), [CapabilityAnchor](domain.md#capabilityanchor)                           | [GetFeatureAtlas](queries.md#getfeatureatlas)                         |
| US-V1-02 | V1 Capability Atlas Board               | [GraphNode](domain.md#graphnode), [GraphEdge](domain.md#graphedge)                                                 | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood)     |
| US-V1-03 | V1 Capability Atlas Board               | [GraphNode](domain.md#graphnode), [GraphEdge](domain.md#graphedge), [CapabilityAnchor](domain.md#capabilityanchor) | [GetConceptInspectorContext](queries.md#getconceptinspectorcontext)   |
| US-V1-04 | V1 Capability Atlas Board               | [GraphEdge](domain.md#graphedge)                                                                                   | [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood)     |
| US-V2-01 | V2 Relationship Constellation Canvas    | [GraphNode](domain.md#graphnode), [GraphEdge](domain.md#graphedge)                                                 | [GetShortestCrossFeaturePath](queries.md#getshortestcrossfeaturepath) |
| US-V2-02 | V2 Relationship Constellation Canvas    | [GraphNode](domain.md#graphnode), [GraphEdge](domain.md#graphedge)                                                 | [GetNeighborhoodByDepth](queries.md#getneighborhoodbydepth)           |
| US-V2-03 | V2 Relationship Constellation Canvas    | [GraphEdge](domain.md#graphedge)                                                                                   | [GetEdgeTypedProjection](queries.md#getedgetypedprojection)           |
| US-V3-01 | V3 Dependency Matrix + Trace Storyboard | [FeaturePairImpact](domain.md#featurepairimpact), [RiskBand](domain.md#riskband)                                   | [GetDependencyMatrix](queries.md#getdependencymatrix)                 |
| US-V3-02 | V3 Dependency Matrix + Trace Storyboard | [TraceStep](domain.md#tracestep), [FeaturePairImpact](domain.md#featurepairimpact)                                 | [GetImpactStoryboard](queries.md#getimpactstoryboard)                 |
| US-V3-03 | V3 Dependency Matrix + Trace Storyboard | [RiskException](domain.md#riskexception), [FeaturePairImpact](domain.md#featurepairimpact)                         | [GetDependencyMatrix](queries.md#getdependencymatrix)                 |
