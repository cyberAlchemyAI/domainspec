# Capability: V1 Capability Atlas Board

## Purpose

Provide a learnability-first entrypoint where users can quickly understand:

- Which features exist.
- Which capabilities each feature owns.
- Which concepts and relationships are involved.
- How cross-feature relationships appear at first hop.

## Primary User Journey

1. User opens the atlas and sees feature cards grouped by pillar.
2. User applies filters (status, priority, tag, taxonomy type) to narrow the view.
3. User opens one capability card to view capability neighborhood.
4. User selects one concept to open inspector context with evidence links.
5. User follows cross-feature preview edges to understand adjacent feature impact.

## Information Architecture

| Area               | Purpose                                           | Backing Concepts                                                                       |
| ------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Feature Atlas      | Entry navigation across features and capabilities | [CapabilityAnchor](../domain.md#capabilityanchor), [GraphNode](../domain.md#graphnode) |
| Filter Bar         | Restrict by taxonomy and metadata dimensions      | [ViewFilter](../domain.md#viewfilter)                                                  |
| Neighborhood Panel | Show first-hop concept and relationship context   | [GraphNode](../domain.md#graphnode), [GraphEdge](../domain.md#graphedge)               |
| Inspector Panel    | Show concept details and evidence paths           | [GraphNode](../domain.md#graphnode), [GraphEdge](../domain.md#graphedge)               |
| Freshness Banner   | Show snapshot generation and staleness window     | [GraphSnapshot](../domain.md#graphsnapshot)                                            |

## Interaction Contract

- Atlas load uses [GetFeatureAtlas](../queries.md#getfeatureatlas).
- Capability neighborhood preview uses [GetCapabilityNeighborhood](../queries.md#getcapabilityneighborhood) with depth = 1.
- Concept inspector uses [GetConceptInspectorContext](../queries.md#getconceptinspectorcontext).
- V1 does not support multi-hop graph expansion beyond one hop.

## Filtering Model

| Filter Dimension | Backing Field                                      | Behavior                                  |
| ---------------- | -------------------------------------------------- | ----------------------------------------- |
| Pillar           | [ViewFilter](../domain.md#viewfilter).pillar       | Includes features of selected pillar only |
| Status           | [ViewFilter](../domain.md#viewfilter).status       | Includes docs in selected status          |
| Priority         | [ViewFilter](../domain.md#viewfilter).priority     | Includes selected priority values         |
| Concept Type     | [ViewFilter](../domain.md#viewfilter).conceptTypes | Restricts neighborhood node types         |
| Edge Type        | [ViewFilter](../domain.md#viewfilter).edgeTypes    | Restricts visible relationship types      |
| Tag              | [ViewFilter](../domain.md#viewfilter).tag          | Includes features matching one tag        |
| Search           | [ViewFilter](../domain.md#viewfilter).searchText   | Matches feature and capability titles     |

## Cross-Feature Preview Rules

V1 cross-feature preview is limited to first-hop edges with canonical relationship types only:

- `produces-for`
- `triggers-cross`
- `enforces-cross`

When one of these edges is present, the UI must show:

1. target feature id,
2. edge type,
3. evidence path.

## Acceptance Checks

- [ ] Atlas view is fully reproducible from [GetFeatureAtlas](../queries.md#getfeatureatlas).
- [ ] Every capability card resolves to exactly one [CapabilityAnchor](../domain.md#capabilityanchor).
- [ ] Neighborhood view shows only depth-1 nodes and edges in V1.
- [ ] Inspector panel resolves concept source path and anchor when available.
- [ ] No relationship labels outside [EdgeType](../domain.md#edgetype) are rendered.
- [ ] Freshness banner always shows [GraphSnapshot](../domain.md#graphsnapshot).generatedAt and stale window.

## Story Links

- [US-V1-01](../STORIES.md#us-v1-01-quickly-understand-feature-landscape)
- [US-V1-02](../STORIES.md#us-v1-02-drill-down-into-capability-neighborhood)
- [US-V1-03](../STORIES.md#us-v1-03-inspect-one-concept-with-evidence)
- [US-V1-04](../STORIES.md#us-v1-04-preview-cross-feature-connections)
