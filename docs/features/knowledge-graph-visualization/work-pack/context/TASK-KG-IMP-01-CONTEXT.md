# TASK-KG-IMP-01 Context Pack

Generated: 2026-05-07
Command contract: domainspec-context-builder knowledge-graph-visualization --task TASK-KG-IMP-01 --mode standard --strict --emit both
Profile: standard (strict)

## Framework Constraints Applied

- CHANGELOG 2.0.8: delegated stages must provide explicit stage outcome evidence and stuck detection metadata.
- CHANGELOG 2.0.4: strict relevance gate requires selector-level evidence and obligation binding for every selected file.
- CHANGELOG 2.0.4: interested-data must be narrowed to the exact relationship subset required by the task contract.
- Standard budget: max 14 files, max 280 excerpt lines, max noise ratio 0.15.

## Seed Set (Task Contract)

| Source            | Seed coverage                                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TASK-KG-IMP-01.md | DomainSpec coverage table, architecture references, directives, execution steps, completion criteria, decision lock                                                                          |
| domain.md         | DocumentationWorkspace, ProjectionScope, FeatureDocument, ConceptDefinition, MirrorProjection, RelationshipEdge, MirrorCardView, AspectKind, FreshnessStatus, WhiteboardCard, WhiteboardEdge |
| operations.md     | ResolveProjectionScope R1-R3, RebuildMirrorProjection R0-R6, C1-C4                                                                                                                           |
| mappings.md       | DocumentToConceptMapping, DocumentToMirrorCardAdapter, ConceptToDetailCardAdapter                                                                                                            |
| SPEC.md           | Feature Concept Graph, Cross-Feature Dependencies, Produces For                                                                                                                              |
| interfaces.md     | ProjectSourceRegistry scope resolution + rebuild request field mapping                                                                                                                       |
| TEST-SPEC.md      | KG-BE-OP-001..010, KG-BE-ERR-001..004, uncovered cross-project scope gaps                                                                                                                    |

## Obligation Matrix

| ID  | Obligation                                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------- |
| O1  | Parse only scoped feature docs from resolved ProjectionScope before rebuild work starts.                                   |
| O2  | Enforce strict (projectKey, featureId) scope isolation and root-path confinement before file reads.                        |
| O3  | Reject rebuild when required mirror files (SPEC.md, domain.md, operations.md) are missing.                                 |
| O4  | Parse relationship index from all required SPEC sections: Feature Concept Graph, Cross-Feature Dependencies, Produces For. |
| O5  | Validate relationship labels against canonical vocabulary before persistence.                                              |
| O6  | Validate relationship endpoints against parsed concept IDs before persistence.                                             |
| O7  | Materialize parser output into domain entities (FeatureDocument, ConceptDefinition, RelationshipEdge, MirrorCardView).     |
| O8  | Build projection artifacts for whiteboard levels (aspect, feature, concept) with deterministic ordering.                   |
| O9  | Persist exactly one MirrorProjection snapshot atomically per (projectKey, featureId) scope key.                            |
| O10 | Preserve rebuild request and ProjectSourceRegistry interface contracts.                                                    |
| O11 | Keep parser verification obligations KG-BE-OP-001..010 and KG-BE-ERR-001..004.                                             |
| O12 | Keep uncovered formal cross-project scope gaps explicit for follow-up test formalization.                                  |
| O13 | Enforce layering: parser/infrastructure in adapter layer; scope + canonical validation in application layer.               |
| O14 | Reuse approved legacy buildServer and inject lifecycle patterns without restoring removed parser modules.                  |

## Selected Context (Strict Selector + Obligation Binding)

1. docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-01.md

- Why: authoritative task contract, explicit coverage IDs, directives, and locked decisions.
- Selectors: ## DomainSpec Coverage, ## Architecture References, ## Implementation Directives, ## Reusable legacy Assets, ## legacy Carryover Limits, ## Execution Steps, ## Completion Criteria, ## Decision Lock.
- Obligation refs: O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14.

2. docs/features/knowledge-graph-visualization/domain.md

- Why: entity/value-object contracts for parser materialization and projection payload shape.
- Selectors: ### DocumentationWorkspace, ### FeatureDocument, ### ConceptDefinition, ### MirrorProjection, ### ProjectionScope, ### RelationshipEdge, ### MirrorCardView, ### AspectKind, ### FreshnessStatus, ### WhiteboardCard, ### WhiteboardEdge.
- Obligation refs: O1, O7, O8, O9.

3. docs/features/knowledge-graph-visualization/operations.md

- Why: scope guard, rebuild rules (R0-R6), calculations (C1-C4), and canonical error conditions.
- Selectors: ## ResolveProjectionScope, ResolveProjectionScope R1-R3 rows, ## RebuildMirrorProjection, RebuildMirrorProjection R0-R6 rows, calculation rows C1-C4, rebuild error states.
- Obligation refs: O1, O2, O3, O4, O5, O6, O8, O9, O13.

4. docs/features/knowledge-graph-visualization/mappings.md

- Why: parser mapping and projection adapters required for entity materialization.
- Selectors: ## DocumentToConceptMapping, validation rows in mapping contract, ## DocumentToMirrorCardAdapter, ## ConceptToDetailCardAdapter.
- Obligation refs: O7, O8, O13.

5. docs/features/knowledge-graph-visualization/SPEC.md

- Why: relationship-index source of truth and dependency/consumer relationship tables.
- Selectors: ## Feature Concept Graph, ## Cross-Feature Dependencies, ## Produces For, ## References.
- Obligation refs: O4, O5, O8.

6. docs/features/knowledge-graph-visualization/interfaces.md

- Why: rebuild request field mapping and registry-backed scope resolution contract.
- Selectors: ### POST /api/knowledge-graph/rebuild, request field mapping rows, ## Internal: ProjectSourceRegistry Interface, resolveProjectionScope(input) row.
- Obligation refs: O2, O10, O13.

7. docs/features/knowledge-graph-visualization/TEST-SPEC.md

- Why: deterministic parser and error verification IDs plus formal-gap tracking.
- Selectors: ## Backend Test Catalogue, KG-BE-OP-001..KG-BE-OP-010 rows, KG-BE-ERR-001..KG-BE-ERR-004 rows, ## Uncovered Formal Gaps.
- Obligation refs: O3, O11, O12.

8. architecture/ARCHITECTURE.md

- Why: architecture retrieval map used to keep pattern-library references deterministic.
- Selectors: pattern-library retrieval row for principles and layer model baseline.
- Obligation refs: O13.

9. architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md

- Why: immutable layer model baseline for parser placement constraints.
- Selectors: ## Layer Model.
- Obligation refs: O13.

10. architecture/pattern-library/LAYERING-REFERENCE.md

- Why: binding guidance for Interface / Adapters vs Application responsibilities.
- Selectors: ### Interface / Adapters Layer.
- Obligation refs: O13.

11. backend/src/server.ts

- Why: reusable Fastify bootstrap boundary and route registration seam.
- Selectors: symbol BuildServerOptions, symbol buildServer, registerKnowledgeGraphRoutes(...) call.
- Obligation refs: O14.

12. backend/src/server.test.ts

- Why: reusable buildServer injection lifecycle test harness pattern.
- Selectors: buildServer import, buildServer(...) setup invocations used by endpoint contract tests.
- Obligation refs: O14.

## Interested-Data Subsets

Relationship subset retained from required SPEC relationship-index sources only:

- Source section: Feature Concept Graph
- Edge labels: applies, consumes, contains, displays, exposes, fetches, maps, mutates, orchestrates, produces, queries, reflects, renders, shapes, transitions, wraps

- Source section: Cross-Feature Dependencies
- Dependency rows retained:
  - payment-processing via queries
  - domainspec-gsd-integration via queries

- Source section: Produces For
- Consumer channels retained: Query, Interface

Canonical label governance pointer (reference-only): RELATIONSHIPS.md

## Excluded Candidates (Strict Gate)

- docs/features/knowledge-graph-visualization/UI-SPEC.md: excluded, no direct parser/rebuild obligation for TASK-KG-IMP-01.
- docs/features/knowledge-graph-visualization/workflows.md: excluded, orchestration details are not required beyond operations + interfaces for this task.
- governance/tags/CODE-TAG-COMPOSABILITY-PATTERNS.md: excluded, no code-tag obligation in TASK-KG-IMP-01 contract.
- Removed legacy parser modules listed in task carryover limits: excluded by explicit non-reuse directive.

## Budget and Gate Checks

- Selected files: 12 / 14 (pass)
- Estimated excerpt lines: 236 / 280 (pass)
- Estimated noise ratio: 0.12 / 0.15 (pass)
- Selector-first gate: pass
- Obligation binding gate: pass
- Strict relevance gate: pass

## Blockers

None.
