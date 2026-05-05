# TASK-KG-IMP-01 - Docs-to-Projection Parser and Canonical Edge Validation

## Goal

Implement projection rebuild behavior that parses feature docs into domain entities, mirror cards, and canonical relationship graph data, then persists the projection snapshot to the database.

## Wave Assignment

- Primary wave: W1
- Supporting wave: W2 (if parser hardening is required)

## Status

not-started

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [domain.md](../../domain.md)         | FeatureDocument, ConceptDefinition, MirrorProjection, RelationshipEdge, MirrorCardView, ExplorationSession, DefinitionPointer, ConceptDetailCard, AspectKind, FreshnessStatus |
| [operations.md](../../operations.md) | R1, R2, R3, R4, R5, C1, C2, C3                                                                                                                                                |
| [mappings.md](../../mappings.md)     | DocumentToConceptMapping, DocumentToMirrorCardAdapter                                                                                                                         |
| [SPEC.md](../../SPEC.md)             | Feature Concept Graph rows                                                                                                                                                    |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | KG-OP-001, KG-OP-002, KG-OP-005, KG-API-001, KG-API-002, KG-API-005                                                                                                           |

## Architecture References

- [Architecture Index](../../../../../architecture/ARCHITECTURE.md)
- [Architecture Foundations - Layer Model](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#layer-model)
- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)
- [Architecture Pattern Library](../../../../../architecture/ARCHITECTURE-PATTERN-LIBRARY.md)

## Implementation Directives

- Keep markdown file scanning and parsing in adapter/infrastructure layer.
- Materialize parsed outputs into domain entities before projection persistence.
- Keep canonical validations and rejection logic in application/use-case layer.
- Validate all relationship edges against canonical vocabulary before projection persistence.
- Validate all edge endpoints against parsed concept IDs before projection persistence.
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

1. Implement or extend parser to read concept table and feature concept graph table from feature SPEC.
2. Normalize and validate concept IDs and edge labels.
3. Build [FeatureDocument](../../domain.md#featuredocument), [ConceptDefinition](../../domain.md#conceptdefinition), and [RelationshipEdge](../../domain.md#relationshipedge) entities/value objects.
4. Build mirror-card aggregates per required source file.
5. Persist [MirrorProjection](../../domain.md#mirrorprojection) snapshot with cards and edges into database-backed read storage, then return it.
6. Add unit tests for missing required files and invalid/unknown edge endpoints.

## Completion Criteria

- Parser rejects missing required mirror files.
- Parser rejects unknown edge labels and unknown endpoints.
- Parsed docs are materialized into domain entity models before exposure.
- Parsed markdown projection is persisted atomically in the database.
- Projection output includes required cards and canonical edges.
- KG-OP-001, KG-OP-002, and KG-OP-005 pass.

## Verification Evidence

- Backend test output linked in execution update.
- Registry/projection stats snapshot attached to task update.

## Gaps and Questions

- Markdown table edge cases (separator styles, blank lines) must be validated against real docs samples.

## Decision Lock

| Decision ID | Required | Status   | Note                     |
| ----------- | -------- | -------- | ------------------------ |
| D-KG-001    | yes      | selected | Required cards fixed     |
| D-KG-002    | yes      | selected | Canonical edges required |
| D-KG-003    | no       | selected | Not blocking parser core |
