---
id: knowledge-graph-visualization-tests
feature: knowledge-graph-visualization
title: Knowledge Graph Visualization Test Specification
summary: Deterministic test obligations for V1 Capability Atlas Board behavior and contracts.
status: implemented
pillar: platform
domain: knowledge-graph-visualization-tests
audience:
  - developers
  - architecture
priority: p1
lang: en
owners:
  - platform-core
updatedAt: 2026-05-01
dependencies:
  - SPEC.md
  - domain.md
  - queries.md
  - interfaces.md
  - mappings.md
  - capabilities/v1-capability-atlas-board.md
  - STORIES.md
includes: []
---

# Knowledge Graph Visualization TEST-SPEC

Scope mode: V1 capability pipeline run.

## Derivation Basis

- Framework constraints: `implementation/domainspec/CHANGELOG.md`.
- Pipeline rules: `implementation/domainspec/TEST-PIPELINE.md`.
- Feature sources:
  - `implementation/domainspec/docs/features/knowledge-graph-visualization/domain.md`
  - `implementation/domainspec/docs/features/knowledge-graph-visualization/queries.md`
  - `implementation/domainspec/docs/features/knowledge-graph-visualization/interfaces.md`
  - `implementation/domainspec/docs/features/knowledge-graph-visualization/mappings.md`
  - `implementation/domainspec/docs/features/knowledge-graph-visualization/capabilities/v1-capability-atlas-board.md`
  - `implementation/domainspec/docs/features/knowledge-graph-visualization/STORIES.md`

## Test Catalogue

| Test ID         | Type                  | Source                                    | Obligation                                                                          | Deterministic Assertion                                                                                               |
| --------------- | --------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| KGV1-QUERY-001  | Query contract        | queries.md                                | GetFeatureAtlas input contract                                                      | `profileId`, `filter`, and `includeCapabilities` inputs are accepted with declared optionality and type expectations. |
| KGV1-QUERY-002  | Query contract        | queries.md                                | GetFeatureAtlas output contract                                                     | Output includes `snapshotId`, `generatedAt`, `featureCount`, and feature card payload.                                |
| KGV1-QUERY-003  | Query filter          | queries.md                                | GetFeatureAtlas pillar filter                                                       | When `pillar` filter is set, only features with matching pillar are returned.                                         |
| KGV1-QUERY-004  | Query filter          | queries.md                                | GetFeatureAtlas status filter                                                       | When `status` filter is set, only matching status rows are returned.                                                  |
| KGV1-QUERY-005  | Query filter          | queries.md                                | GetFeatureAtlas search filter                                                       | `searchText` filters by feature title and capability title deterministically.                                         |
| KGV1-QUERY-006  | Query contract        | queries.md                                | GetCapabilityNeighborhood depth rule                                                | V1 neighborhood depth is bounded to first hop (`depth <= 1`).                                                         |
| KGV1-QUERY-007  | Query contract        | queries.md                                | GetCapabilityNeighborhood output                                                    | Output contains selected capability plus typed nodes/edges neighborhood.                                              |
| KGV1-QUERY-008  | Query filter          | queries.md                                | GetCapabilityNeighborhood concept type filter                                       | Returned nodes respect `conceptTypes` filter set.                                                                     |
| KGV1-QUERY-009  | Query filter          | queries.md                                | GetCapabilityNeighborhood edge type filter                                          | Returned edges respect `edgeTypes` filter set.                                                                        |
| KGV1-QUERY-010  | Query filter          | queries.md                                | GetCapabilityNeighborhood cross-feature filter                                      | `crossFeatureOnly=true` returns only edges where `crossFeature=true`.                                                 |
| KGV1-QUERY-011  | Query contract        | queries.md                                | GetConceptInspectorContext output                                                   | Inspector result includes concept metadata, linked capabilities, and neighbor edges.                                  |
| KGV1-QUERY-012  | Query filter          | queries.md                                | GetConceptInspectorContext edge filter                                              | Inspector result respects `edgeTypes` filter and include-in/out toggles.                                              |
| KGV1-DOMAIN-001 | Domain invariant      | domain.md                                 | GraphNode uniqueness                                                                | `GraphNode.conceptId` is unique within one snapshot.                                                                  |
| KGV1-DOMAIN-002 | Domain invariant      | domain.md                                 | GraphEdge node reference validity                                                   | `fromConceptId` and `toConceptId` reference existing `GraphNode.conceptId`.                                           |
| KGV1-DOMAIN-003 | Domain invariant      | domain.md                                 | CapabilityAnchor uniqueness                                                         | `(featureId, capabilityKey)` uniqueness holds per snapshot context.                                                   |
| KGV1-DOMAIN-004 | Domain enum           | domain.md                                 | EdgeType whitelist                                                                  | Every rendered edge label must belong to `EdgeType` enum values.                                                      |
| KGV1-DOMAIN-005 | Domain constraint     | domain.md                                 | VisualizationProfile depth bound                                                    | `maxNeighborDepth` remains in allowed V1 range constraints.                                                           |
| KGV1-MAP-001    | Mapping               | mappings.md                               | IndexToGraphMapping status normalization                                            | Source status values map deterministically into `FeatureDocStatus`.                                                   |
| KGV1-MAP-002    | Mapping validation    | mappings.md                               | IndexToGraphMapping edge type validation                                            | Any edge type outside `EdgeType` is rejected.                                                                         |
| KGV1-MAP-003    | Mapping validation    | mappings.md                               | IndexToGraphMapping node existence validation                                       | Edges targeting missing nodes are rejected.                                                                           |
| KGV1-MAP-004    | Mapping               | mappings.md                               | FeatureDocsToCapabilityCards key derivation                                         | `capabilityKey` is deterministically slugified from capability title/link source.                                     |
| KGV1-MAP-005    | Mapping validation    | mappings.md                               | FeatureDocsToCapabilityCards anchor validation                                      | Capability anchor must resolve in source `SPEC.md` section.                                                           |
| KGV1-MAP-006    | Mapping               | mappings.md                               | ConceptToInspectorView field projection                                             | Inspector DTO fields map one-to-one from node and edge sources.                                                       |
| KGV1-MAP-007    | Mapping validation    | mappings.md                               | ConceptToInspectorView path validation                                              | Inspector source path is kept as relative docs path; invalid path is flagged.                                         |
| KGV1-API-001    | Interface contract    | interfaces.md                             | GET /knowledge-graph/features                                                       | Request and response shape plus `200/400/401` statuses match spec.                                                    |
| KGV1-API-002    | Interface contract    | interfaces.md                             | GET /knowledge-graph/features/{featureId}/capabilities/{capabilityKey}/neighborhood | Request and response shape plus `200/400/404/401` statuses match spec.                                                |
| KGV1-API-003    | Interface contract    | interfaces.md                             | GET /knowledge-graph/concepts/{conceptId}                                           | Request and response shape plus `200/404/401` statuses match spec.                                                    |
| KGV1-CAP-001    | Capability acceptance | capabilities/v1-capability-atlas-board.md | Atlas reproducibility                                                               | Atlas view can be reproduced exactly from GetFeatureAtlas output contract.                                            |
| KGV1-CAP-002    | Capability acceptance | capabilities/v1-capability-atlas-board.md | Depth-one neighborhood behavior                                                     | Neighborhood panel never expands beyond one hop in V1.                                                                |
| KGV1-CAP-003    | Capability acceptance | capabilities/v1-capability-atlas-board.md | Inspector evidence behavior                                                         | Inspector resolves concept source path and anchor when available.                                                     |
| KGV1-CAP-004    | Capability acceptance | capabilities/v1-capability-atlas-board.md | Cross-feature preview behavior                                                      | Preview outputs target feature id, edge type, and evidence path for canonical cross-feature edges.                    |
| KGV1-STORY-001  | Story traceability    | STORIES.md                                | US-V1-01                                                                            | Story maps to capability, concepts, and GetFeatureAtlas query.                                                        |
| KGV1-STORY-002  | Story traceability    | STORIES.md                                | US-V1-02                                                                            | Story maps to capability, concepts, and GetCapabilityNeighborhood query.                                              |
| KGV1-STORY-003  | Story traceability    | STORIES.md                                | US-V1-03                                                                            | Story maps to capability, concepts, and GetConceptInspectorContext query.                                             |
| KGV1-STORY-004  | Story traceability    | STORIES.md                                | US-V1-04                                                                            | Story maps to capability, concepts, and cross-feature preview rules.                                                  |

## Coverage Summary

- Query contracts and filters: 12
- Domain invariants and constraints: 5
- Mapping contracts and validations: 7
- Interface contracts: 3
- Capability acceptance checks: 4
- Story traceability checks: 4
- Total obligations: 35

## Story To Test Mapping

| Story                                            | Key test IDs                                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| US-V1-01 Quickly Understand Feature Landscape    | KGV1-QUERY-001, KGV1-QUERY-002, KGV1-QUERY-003, KGV1-QUERY-004, KGV1-QUERY-005, KGV1-CAP-001, KGV1-STORY-001 |
| US-V1-02 Drill Down Into Capability Neighborhood | KGV1-QUERY-006, KGV1-QUERY-007, KGV1-QUERY-008, KGV1-QUERY-009, KGV1-QUERY-010, KGV1-CAP-002, KGV1-STORY-002 |
| US-V1-03 Inspect One Concept With Evidence       | KGV1-QUERY-011, KGV1-QUERY-012, KGV1-MAP-006, KGV1-MAP-007, KGV1-CAP-003, KGV1-STORY-003                     |
| US-V1-04 Preview Cross-Feature Connections       | KGV1-DOMAIN-004, KGV1-CAP-004, KGV1-STORY-004                                                                |

## V1 Pipeline Must-Pass Subset

| Priority | Test IDs                                                       | Why it is gate-critical                                                      |
| -------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| P0       | KGV1-QUERY-006, KGV1-CAP-002, KGV1-DOMAIN-004                  | Protects V1 boundary: one-hop navigation and canonical edge vocabulary only. |
| P0       | KGV1-API-001, KGV1-API-002, KGV1-API-003                       | Locks public API behavior for atlas, neighborhood, and concept inspector.    |
| P0       | KGV1-MAP-002, KGV1-MAP-003, KGV1-MAP-005                       | Prevents invalid edge semantics and broken capability references.            |
| P1       | KGV1-STORY-001, KGV1-STORY-002, KGV1-STORY-003, KGV1-STORY-004 | Ensures story-to-contract traceability remains coherent.                     |

## V1 Pipeline Decision

Deterministic test derivation for V1 capability scope is complete with no blocking gaps.
