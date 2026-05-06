# TASK-KG-IMP-01 - Docs-to-Projection Parser and Canonical Edge Validation

## Goal

Implement projection rebuild behavior that parses feature docs into domain entities, mirror cards, and canonical relationship graph data, then persists the projection snapshot to the database.

## Wave Assignment

- Primary wave: W1
- Supporting wave: W2 (if parser hardening is required)

## Status

in-progress

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                                                                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [domain.md](../../domain.md)         | DocumentationWorkspace, ProjectionScope, FeatureDocument, ConceptDefinition, MirrorProjection, RelationshipEdge, MirrorCardView, AspectKind, FreshnessStatus, WhiteboardCard, WhiteboardEdge |
| [operations.md](../../operations.md) | ResolveProjectionScope R1-R3, RebuildMirrorProjection R0-R6, C1-C4                                                                                                                           |
| [mappings.md](../../mappings.md)     | DocumentToConceptMapping, DocumentToMirrorCardAdapter, ConceptToDetailCardAdapter                                                                                                            |
| [SPEC.md](../../SPEC.md)             | Feature Concept Graph, Cross-Feature Dependencies, Produces For relationship index sources                                                                                                   |
| [interfaces.md](../../interfaces.md) | ProjectSourceRegistry scope resolution contract, rebuild request field mappings                                                                                                              |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | KG-BE-OP-001..010, KG-BE-ERR-001..004, uncovered cross-project scope gaps                                                                                                                    |

## Architecture References

- [Architecture Index](../../../../../architecture/ARCHITECTURE.md)
- [Architecture Foundations - Layer Model](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#layer-model)
- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)
- [Architecture Pattern Library](../../../../../architecture/ARCHITECTURE-PATTERN-LIBRARY.md)

## Implementation Directives

- Keep markdown file scanning and parsing in adapter/infrastructure layer.
- Materialize parsed outputs into domain entities before projection persistence.
- Keep scope resolution, canonical validations, and rejection logic in application/use-case layer.
- Parse relationship index from all SPEC sources required by current contracts:
  - Feature Concept Graph
  - Cross-Feature Dependencies
  - Produces For
- Validate all relationship edges against canonical vocabulary before projection persistence.
- Validate all edge endpoints against parsed concept IDs before projection persistence.
- Enforce `(projectKey, featureId)` scope isolation before file-system access.
- Materialize projection artifacts needed for whiteboard levels (`aspect`, `feature`, `concept`) while preserving deterministic ordering.
- Preserve deterministic ordering for projection outputs to stabilize tests.

## Reusable legacy Assets

| Asset                                                                                                                                                       | Reuse Mode            | Required Adaptation                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [backend/src/server.ts](../../../../../backend/src/server.ts) Fastify bootstrap (`buildServer`)                                                             | reuse with adaptation | Reuse server bootstrap and register parser/projection endpoints through adapter boundary handlers.                            |
| [backend/src/server.test.ts](../../../../../backend/src/server.test.ts) inject lifecycle pattern                                                            | reuse with adaptation | Reuse Node test + Fastify inject lifecycle pattern to validate parser/rebuild routes and responses.                           |
| Removed legacy parser modules (`backend/src/knowledge-graph-docs-import.ts`, `backend/src/knowledge-graph-repository.ts`, `backend/src/knowledge-graph.ts`) | re-implement          | Recreate parser, repository, and canonical guards from current DomainSpec contracts; do not restore deleted modules verbatim. |

## legacy Carryover Limits

- Do not recreate deleted in-memory seed datasets from `backend/src/knowledge-graph.ts`; current source of truth must be markdown parse + database persistence.
- Do not reuse legacy capability-centric concept IDs as final IDs for current mirror-card projection.

## Execution Steps

1. Implement parser flow that starts from resolved [ProjectionScope](../../domain.md#projectionscope) and reads scoped feature docs only.
2. Parse and normalize concept registry rows plus relationship index rows from all required SPEC sections.
3. Validate edge labels against canonical vocabulary and edge endpoints against parsed concept IDs.
4. Build [FeatureDocument](../../domain.md#featuredocument), [ConceptDefinition](../../domain.md#conceptdefinition), [RelationshipEdge](../../domain.md#relationshipedge), and scoped [MirrorCardView](../../domain.md#mirrorcardview) entities.
5. Derive projection structures that can support whiteboard levels (`aspect`, `feature`, `concept`) with deterministic ordering.
6. Persist one [MirrorProjection](../../domain.md#mirrorprojection) snapshot per `(projectKey, featureId)` scope key.
7. Add unit/integration tests for missing required files, invalid labels/endpoints, unknown source project/feature, and invalid source-root path.

## Completion Criteria

- Parser rejects missing required mirror files.
- Parser rejects unknown/disabled source project and unavailable source feature with deterministic codes.
- Parser rejects invalid source root/path escapes before file reads.
- Parser rejects unknown edge labels and unknown endpoints.
- Parsed docs are materialized into domain entity models before exposure.
- Parsed markdown projection is persisted atomically in the database.
- Projection output includes required aspect cards and relationship-index-derived canonical edges.
- Projection payload supports whiteboard drill levels (`aspect`, `feature`, `concept`).
- Required parser/persistence contracts pass, including cross-project scope guards.

## Verification Evidence

- Backend test output linked in execution update.
- Registry/projection stats snapshot attached to task update.
- Latest evidence (2026-05-06): backend suite passes parser rejection and projection persistence tests.

## Gaps and Questions

- Backfill missing formal test IDs for cross-project scope obligations tracked in [TEST-SPEC.md](../../TEST-SPEC.md#uncovered-formal-gaps).

## Decision Lock

| Decision ID | Required | Status   | Note                                              |
| ----------- | -------- | -------- | ------------------------------------------------- |
| D-KG-001    | yes      | selected | Required cards fixed                              |
| D-KG-002    | yes      | selected | Canonical edges required                          |
| D-KG-007    | yes      | selected | Registered project source policy                  |
| D-KG-009    | yes      | selected | Strict `(projectKey, featureId)` scope invariants |
