# Capability: V2 Relationship Constellation Canvas

## Purpose

Provide an analysis-first graph surface for architecture and specification exploration, enabling deterministic path tracing and multi-hop dependency inspection.

## Primary User Journey

1. Analyst opens constellation canvas and selects seed concept(s).
2. Analyst chooses depth and relation filters to expand neighborhood.
3. Analyst requests shortest cross-feature path between two concepts.
4. Analyst inspects grouped relation families and evidence links.
5. Analyst saves a lens preset for repeated analysis sessions.

## Interaction Contract

- Multi-hop neighborhood retrieval uses [GetNeighborhoodByDepth](../queries.md#getneighborhoodbydepth).
- Deterministic path tracing uses [GetShortestCrossFeaturePath](../queries.md#getshortestcrossfeaturepath).
- Typed relation grouping uses [GetEdgeTypedProjection](../queries.md#getedgetypedprojection).
- Trace composition and ranking rules are governed by [TraceSelectionWorkflow](../workflows.md#traceselectionworkflow).

## Analysis Controls

| Control             | Description                                      | Backing Contract                                                                            |
| ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Depth selector      | Choose expansion depth for neighborhood analysis | [GetNeighborhoodByDepth](../queries.md#getneighborhoodbydepth).depth                        |
| Edge-type filter    | Restrict analysis to canonical relation types    | [GetEdgeTypedProjection](../queries.md#getedgetypedprojection).edgeTypes                    |
| Cross-feature focus | Prioritize edges that cross feature boundaries   | [GetShortestCrossFeaturePath](../queries.md#getshortestcrossfeaturepath).preferCrossFeature |
| Family grouping     | Group projected edges into analysis families     | [RelationshipFamilyProjection](../mappings.md#relationshipfamilyprojection)                 |

## Edge-Family Lenses

| Family        | Included Edge Types                                                     | Use                                           |
| ------------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| Structural    | `contains`, `maps`, `queries`, `exposes`, `derives`, `contracts`        | Inspect shape and data dependency structure   |
| Behavioral    | `performs`, `produces`, `orchestrates`, `applies`, `mutates`, `submits` | Inspect execution and side-effect flow        |
| Governance    | `enforces`, `enforces-cross`, `protects`, `mirrors`                     | Inspect control and authorization constraints |
| Cross-Feature | `produces-for`, `triggers-cross`                                        | Inspect inter-feature coupling                |
| Lifecycle     | `transitions`, `reflects`, `emits`, `displays`                          | Inspect state and visibility propagation      |

## Acceptance Checks

- [ ] Multi-hop neighborhoods are deterministic and bounded by requested depth.
- [ ] Shortest cross-feature path results are ranked with a documented policy.
- [ ] Edge grouping uses only canonical edge types from [EdgeType](../domain.md#edgetype).
- [ ] Trace results provide evidence paths for each edge.
- [ ] Saved lens metadata can be represented by `LensSaved` event payload.

## Story Links

- [US-V2-01](../STORIES.md#us-v2-01-find-shortest-cross-feature-path)
- [US-V2-02](../STORIES.md#us-v2-02-explore-multi-hop-neighborhoods)
- [US-V2-03](../STORIES.md#us-v2-03-analyze-typed-relationship-families)
