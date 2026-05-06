# TASK-KG-IMP-01 Context Pack

## Context Pack Summary

- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-01
- Mode: standard
- Strict relevance gate: on
- Planner preflight gate: PASS (`plannerGateStatus=pass` in WORK-PACK.md)
- Framework constraints applied:
  - CHANGELOG 2.0.8 reviewed (delegation profile/telemetry policy added; no extra retrieval constraints for context-builder artifacts)
  - CHANGELOG 2.0.4 enforced (strict relevance, interested-data subset, selector-bound index schema, mode budgets)
- Files selected: 14
- Snippets selected: 25
- Excerpt lines: 259 / 280
- Obligation coverage: 14 / 14 (100%)
- Noise ratio: 0.00
- Output markdown: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-01-CONTEXT.md
- Output index: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-01-CONTEXT.index.json
- Blockers: 0

## Obligation Matrix

| Obligation ID | Requirement                                                                                                   | Evidence Source                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| O1            | Planner preflight gate must be PASS before writing context artifacts                                          | WORK-PACK.md Planner Control Fields (`plannerGateStatus=pass`)                            |
| O2            | Enforce strict `(projectKey, featureId)` scope isolation and root-path confinement                            | operations.md ResolveProjectionScope R1-R3 + task directives                              |
| O3            | Required mirror source files must exist (`SPEC.md`, `domain.md`, `operations.md`)                             | operations.md RebuildMirrorProjection R1 + TEST-SPEC KG-BE-OP-001/002                     |
| O4            | Parse relationship index from all required SPEC sources                                                       | task directives + SPEC.md Feature Concept Graph, Cross-Feature Dependencies, Produces For |
| O5            | Validate all edge labels against canonical relationship vocabulary                                            | mappings.md validation + RELATIONSHIPS.md edge subset + TEST-SPEC KG-BE-OP-005/006        |
| O6            | Validate all edge endpoints against parsed concept IDs                                                        | mappings.md validation + operations.md error states + TEST-SPEC KG-BE-OP-007/008          |
| O7            | Materialize parsed markdown into domain entities before exposure/persistence                                  | task execution steps + domain.md entities + mappings adapters                             |
| O8            | Produce whiteboard projection artifacts for `aspect`, `feature`, `concept` levels with deterministic ordering | task directives + operations.md R4/R5/C4                                                  |
| O9            | Persist exactly one snapshot atomically per `(projectKey, featureId)`                                         | operations.md R6/error states + TEST-SPEC KG-BE-OP-009/010, KG-BE-ERR-004                 |
| O10           | Keep scanner/parser concerns in adapters and canonical validation in application layer                        | task directives + architecture foundations/layering references                            |
| O11           | Preserve rebuild request and scope-resolution interface contracts                                             | interfaces.md rebuild field map + ProjectSourceRegistry contract                          |
| O12           | Keep parser verification obligations and unresolved cross-project scope gaps explicit                         | TEST-SPEC KG-BE-OP-001..010, KG-BE-ERR-001..004, Uncovered Formal Gaps                    |
| O13           | Reuse Fastify bootstrap + inject lifecycle patterns from approved legacy assets                               | task reusable assets + backend/src/server.ts + backend/src/server.test.ts                 |
| O14           | Enforce legacy carryover limits (no deleted in-memory dataset/module restoration)                             | task legacy Carryover Limits                                                              |

## Included Context

- docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-01.md
  - Why included: Primary task authority for contracts, directives, completion, and legacy limits.
  - Selectors: `## DomainSpec Coverage` (line 16), `## Implementation Directives` (line 34), `## legacy Carryover Limits` (line 57), `## Completion Criteria` (line 72), `## Decision Lock` (line 94)
  - Obligation refs: O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14

- docs/features/knowledge-graph-visualization/WORK-PACK.md
  - Why included: Required planner preflight evidence and architecture-guided KG-IMP-01 implementation directive.
  - Selectors: `## Planner Control Fields` (line 7), `plannerGateStatus` row (line 11), `## Architecture-Guided Task Directives` (line 39), `KG-IMP-01` row (line 44)
  - Obligation refs: O1, O10

- docs/features/knowledge-graph-visualization/domain.md
  - Why included: Canonical domain entities and value objects for parser output materialization.
  - Selectors: `### DocumentationWorkspace` (line 5), `### FeatureDocument` (line 21), `### ConceptDefinition` (line 39), `### MirrorProjection` (line 57), `### ProjectionScope` (line 97), `### RelationshipEdge` (line 110), `### MirrorCardView` (line 141), `### AspectKind` (line 178), `### FreshnessStatus` (line 192)
  - Obligation refs: O2, O7, O8

- docs/features/knowledge-graph-visualization/operations.md
  - Why included: Scope constraints, rebuild rules/calculations, and deterministic rejection contract.
  - Selectors: `## ResolveProjectionScope` (line 3), R1-R3 (lines 20-22), `## RebuildMirrorProjection` (line 39), R0-R6 (lines 58-64), C1-C4 (lines 70-73), Error States (lines 91-97)
  - Obligation refs: O2, O3, O5, O6, O8, O9

- docs/features/knowledge-graph-visualization/mappings.md
  - Why included: Document parsing and adapter validation contracts for entity/card/edge projection.
  - Selectors: `## DocumentToConceptMapping` (line 3), Validation table (line 27), `## DocumentToMirrorCardAdapter` (line 37), `## ConceptToDetailCardAdapter` (line 68)
  - Obligation refs: O5, O6, O7

- docs/features/knowledge-graph-visualization/SPEC.md
  - Why included: Relationship-index source sections required by parser contracts.
  - Selectors: `## Concepts` (line 85), `## Feature Concept Graph` (line 139), `## Cross-Feature Dependencies` (line 207), `## Produces For` (line 214)
  - Obligation refs: O4, O5, O6, O8

- docs/features/knowledge-graph-visualization/interfaces.md
  - Why included: Rebuild request field mappings and trusted scope registry interface contract.
  - Selectors: `### POST /api/knowledge-graph/rebuild` (line 5), request mapping rows (lines 14-17), `## Internal: ProjectSourceRegistry Interface` (line 169), `resolveProjectionScope(input)` row (line 175)
  - Obligation refs: O2, O11

- docs/features/knowledge-graph-visualization/TEST-SPEC.md
  - Why included: Deterministic parser rejection/persistence obligations and unresolved cross-project scope gaps.
  - Selectors: KG-BE-OP-001 (line 40), KG-BE-OP-010 (line 49), KG-BE-ERR-001 (line 91), KG-BE-ERR-004 (line 94), `## Uncovered Formal Gaps` (line 228)
  - Obligation refs: O3, O5, O6, O9, O12

- RELATIONSHIPS.md
  - Why included: Canonical vocabulary authority for label validation subset.
  - Selectors: `applies` (line 146), `consumes` (line 222), `contains` (line 164), `displays` (line 258), `exposes` (line 129), `fetches` (line 271), `maps` (line 155), `mutates` (line 280), `orchestrates` (line 138), `produces` (line 66), `queries` (line 173), `reflects` (line 289), `renders` (line 195), `shapes` (line 240), `transitions` (line 120), `wraps` (line 204)
  - Obligation refs: O5

- architecture/ARCHITECTURE.md
  - Why included: Retrieval-map authority for minimal architecture context loading.
  - Selectors: `## Retrieval Map` (line 11), `## Canonical Companions` (line 24)
  - Obligation refs: O10

- architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md
  - Why included: Layer model baseline for concern placement constraints.
  - Selectors: `## Principles` (line 5), `## Layer Model` (line 13), `## Layer Snapshot` (line 27)
  - Obligation refs: O10

- architecture/pattern-library/LAYERING-REFERENCE.md
  - Why included: Detailed implementation-layer responsibility boundaries.
  - Selectors: `## Layer Responsibilities` (line 5), `### Application Layer` (line 18), `### Infrastructure Layer` (line 28), `### Interface / Adapters Layer` (line 39), `## Module Boundary Guidelines` (line 49)
  - Obligation refs: O10

- backend/src/server.ts
  - Why included: Reusable Fastify bootstrap and route registration boundary.
  - Selectors: symbol `buildServer` (lines 13-24), `app.register(cors...)` (line 16), `app.get("/health")` (line 18), `registerKnowledgeGraphRoutes(...)` (line 23)
  - Obligation refs: O13

- backend/src/server.test.ts
  - Why included: Reusable inject lifecycle pattern for parser/projection endpoint contracts.
  - Selectors: test `health endpoint returns ok` (line 13), test `rebuild persists projection and read endpoints return latest snapshot` (line 32), `app.inject(...)` call sites (line 20 and line 45), `t.after(...app.close)` teardown (line 16)
  - Obligation refs: O13

## Excluded Candidates

- architecture/ARCHITECTURE-PATTERN-LIBRARY.md
  - Why excluded: Explicitly linked, but no uncovered O10 obligations remained after architecture index + foundations + layering references.

- docs/features/knowledge-graph-visualization/queries.md
  - Why excluded: Read-query/filter contract implementation is primarily TASK-KG-IMP-02 scope, not parser/projection rebuild core for TASK-KG-IMP-01.

- docs/features/knowledge-graph-visualization/events.md
  - Why excluded: Event-consumer contract coverage not required to satisfy O2-O11 parser/projection obligations.

- docs/features/knowledge-graph-visualization/states.md
  - Why excluded: Session interaction state-machine obligations are not required for parser/projection persistence core.

- governance/tags/CODE-TAG-COMPOSABILITY-PATTERNS.md
  - Why excluded: No uncovered composability obligations for this task slice after contract coverage.

- governance/tags/examples/composability/\*
  - Why excluded: No uncovered composability obligations; examples would add noise.

- docs/index/feature-map.md
  - Why excluded: Not present.

- docs/index/features-index.json
  - Why excluded: Not present.

- docs/index/tag-index.json
  - Why excluded: Not present.

## Interested Data Subsets

- relationships (derived from SPEC feature graph edge column):
  - applies
  - consumes
  - contains
  - displays
  - exposes
  - fetches
  - maps
  - mutates
  - orchestrates
  - produces
  - queries
  - reflects
  - renders
  - shapes
  - transitions
  - wraps

## Next Actions

1. Implement adapter-level markdown scanning/parsing for the required SPEC relationship sources and required mirror files.
2. Implement application-layer canonical edge and endpoint validation before persistence.
3. Materialize parser outputs into domain entities and persist one atomic snapshot per `(projectKey, featureId)`.
4. Ensure KG-BE-OP-001..010 and KG-BE-ERR-001..004 tests remain green while adding formal cross-project scope test IDs.
