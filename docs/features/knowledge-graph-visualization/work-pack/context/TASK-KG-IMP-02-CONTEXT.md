# TASK-KG-IMP-02 Context Pack

## Context Pack Summary

- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-02
- Mode: standard
- Strict relevance gate: on
- Planner preflight gate: PASS (`plannerGateStatus=pass` in WORK-PACK.md)
- Framework constraints applied:
  - CHANGELOG 2.0.8 reviewed (delegation profile/telemetry updates; no additional retrieval constraints for context-builder artifacts)
  - CHANGELOG 2.0.4 enforced (strict selector+obligation binding, interested-data subsets, schema/budget gates)
- Files selected: 14
- Snippets selected: 39
- Excerpt lines: 218 / 280
- Obligation coverage: 14 / 14 (100%)
- Noise ratio: 0.00
- Output markdown: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-02-CONTEXT.md
- Output index: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-02-CONTEXT.index.json
- Blockers: 0

## Obligation Matrix

| Obligation ID | Requirement                                                                                                                                                                | Evidence Source                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| O1            | Planner gate must be PASS before context artifact writes                                                                                                                   | WORK-PACK.md Planner Control Fields (`plannerGateStatus=pass`)                                 |
| O2            | Read-query coverage includes GetMirrorCards + GetRelationshipGraph with board-level query semantics (`activeAspect`, `viewLevel`, `selectedFeatureId`, `selectedGroupKey`) | TASK-KG-IMP-02 coverage table + queries.md GetMirrorCards/GetRelationshipGraph                 |
| O3            | Read-query coverage includes GetConceptDetailCard + GetDefinitionPointer with scope-aware fields                                                                           | TASK-KG-IMP-02 coverage table + queries.md GetConceptDetailCard/GetDefinitionPointer           |
| O4            | External/internal API contracts must include KnowledgeGraphAPI, KnowledgeGraphModule, and ProjectSourceRegistry mappings                                                   | interfaces.md endpoint and interface sections                                                  |
| O5            | Scope propagation must resolve from registered `projectKey + featureId` before read/mutation handlers                                                                      | operations.md ResolveProjectionScope + interfaces.md ProjectSourceRegistry + D-KG-007/D-KG-009 |
| O6            | Selection semantics must validate card id/type (`feature`, `story`, `concept-group`, `concept`) with deterministic diagnostics                                             | TASK-KG-IMP-02 directives + operations.md SelectConcept rules/errors                           |
| O7            | Open-definition semantics must enforce session match plus pointer/anchor resolution with stable error codes                                                                | operations.md OpenDefinition rules/errors + interfaces.md open-definition endpoint             |
| O8            | Adapter shaping obligations include mirror cards and concept detail projections                                                                                            | mappings.md DocumentToMirrorCardAdapter + ConceptToDetailCardAdapter                           |
| O9            | Layering split keeps HTTP parse/serialize in adapters and behavior semantics in application, with dependency boundaries                                                    | LAYERING-REFERENCE.md + DEPENDENCY-RULES.md + TASK-KG-IMP-02 directives                        |
| O10           | Verification coverage must map to KG-BE-API-001..013, KG-BE-IFMAP-001..011, KG-BE-OP-011..020, including unresolved scope gaps                                             | TEST-SPEC.md contract/mapping/operation tables + Uncovered Formal Gaps                         |
| O11           | Decision locks D-KG-005, D-KG-007, D-KG-009 must remain binding for this task                                                                                              | TASK-KG-IMP-02 Decision Lock + DECISIONS.md gate results                                       |
| O12           | Reuse legacy bootstrap and test harness assets (`server.ts`, `server.test.ts`, `index.ts`) with adaptation                                                                 | TASK-KG-IMP-02 Reusable legacy Assets + code symbol selectors                                  |
| O13           | Relationship context must be interested-data subset from SPEC feature concept graph edges only                                                                             | SPEC.md Feature Concept Graph edge labels                                                      |
| O14           | Legacy carryover limits forbid restoring removed legacy route surface as primary API                                                                                       | TASK-KG-IMP-02 legacy Carryover Limits                                                         |

## Included Context

- docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-02.md
  - Why included: Primary authority for stage scope, coverage IDs, directives, reusable assets, and decision lock.
  - Selectors: `## DomainSpec Coverage` (line 16), `## Architecture References` (line 26), `## Implementation Directives` (line 32), `## Reusable legacy Assets` (line 42), `## legacy Carryover Limits` (line 51), `## Completion Criteria` (line 64), `## Decision Lock` (line 82)
  - Obligation refs: O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O14

- docs/features/knowledge-graph-visualization/WORK-PACK.md
  - Why included: Planner preflight evidence and task-board scope lock for KG-IMP-02.
  - Selectors: `## Planner Control Fields` (line 7), `plannerGateStatus` row (line 11), `## Task Status Board` (line 18), `KG-IMP-02` row (line 22)
  - Obligation refs: O1, O10

- docs/features/knowledge-graph-visualization/DECISIONS.md
  - Why included: Decision authority for in-app definition mode and strict cross-project scope policy.
  - Selectors: `D-KG-005` (line 14), `D-KG-007` (line 19), `D-KG-009` (line 21)
  - Obligation refs: O5, O11

- docs/features/knowledge-graph-visualization/SPEC.md
  - Why included: Feature concept graph source for relationship interested-data subset and API/query concept linkage.
  - Selectors: `## Feature Concept Graph` (line 139), query/interface linkage rows for `GetMirrorCards`..`ProjectSourceRegistry` (lines 160-173), ownership rows (lines 186-188)
  - Obligation refs: O2, O4, O13

- docs/features/knowledge-graph-visualization/queries.md
  - Why included: Authoritative read contracts for cards, graph, detail, and definition pointer queries.
  - Selectors: `## GetMirrorCards` (line 3), `## GetRelationshipGraph` (line 48), board-level fields `activeAspect/viewLevel/selectedFeatureId/selectedGroupKey` (lines 61-64), `## GetConceptDetailCard` (line 100), `## GetDefinitionPointer` (line 148)
  - Obligation refs: O2, O3

- docs/features/knowledge-graph-visualization/interfaces.md
  - Why included: Endpoint and method mappings for KnowledgeGraphAPI/KnowledgeGraphModule/ProjectSourceRegistry.
  - Selectors: `### GET /api/knowledge-graph/mirror-cards` (line 28), `### GET /api/knowledge-graph/graph` (line 51), `### GET /api/knowledge-graph/concepts/:conceptId` (line 79), `### GET /api/knowledge-graph/concepts/:conceptId/definition` (line 104), `### POST /api/knowledge-graph/concepts/:conceptId/open-definition` (line 127), `## Internal: KnowledgeGraphModule Interface` (line 153), `## Internal: ProjectSourceRegistry Interface` (line 169)
  - Obligation refs: O4, O5, O7

- docs/features/knowledge-graph-visualization/operations.md
  - Why included: Scope resolution, selection semantics, and open-definition deterministic errors.
  - Selectors: `## ResolveProjectionScope` (line 3), root/scope errors (`MIRROR_SOURCE_PROJECT_UNKNOWN`, `MIRROR_SOURCE_FEATURE_UNAVAILABLE`, `MIRROR_SOURCE_ROOT_INVALID`) (lines 33-35), `## SelectConcept` (line 101), selection errors (`WHITEBOARD_CARD_NOT_FOUND`, `CONCEPT_SELECTION_SOURCE_INVALID`, `CONCEPT_SCOPE_MISMATCH`) (lines 146-148), `## OpenDefinition` (line 153), definition errors (`DEFINITION_SESSION_MISMATCH`, `DEFINITION_POINTER_NOT_FOUND`, `DEFINITION_ANCHOR_NOT_FOUND`, `DEFINITION_SCOPE_MISMATCH`) (lines 199-202)
  - Obligation refs: O5, O6, O7

- docs/features/knowledge-graph-visualization/mappings.md
  - Why included: Adapter contracts for mirror card shaping and concept detail card shaping.
  - Selectors: `## DocumentToMirrorCardAdapter` (line 37), `## ConceptToDetailCardAdapter` (line 68), definition validation clause (line 94)
  - Obligation refs: O8

- docs/features/knowledge-graph-visualization/TEST-SPEC.md
  - Why included: Verification ID authority and explicit unresolved scope-gap obligations.
  - Selectors: `KG-BE-OP-011` (line 50), `KG-BE-OP-020` (line 59), `KG-BE-API-001` (line 106), `KG-BE-API-013` (line 118), `KG-BE-IFMAP-001` (line 124), `KG-BE-IFMAP-011` (line 134), `## Uncovered Formal Gaps` (line 228)
  - Obligation refs: O10

- architecture/pattern-library/LAYERING-REFERENCE.md
  - Why included: Application vs interface responsibility split for route contracts.
  - Selectors: `## Layer Responsibilities` (line 5), `### Application Layer` (line 18), `### Interface / Adapters Layer` (line 39)
  - Obligation refs: O9

- architecture/pattern-library/DEPENDENCY-RULES.md
  - Why included: Enforce layer dependency constraints and drift-blocking checks.
  - Selectors: `## Layer Dependency Constraints` (line 5), `## Static Enforcement` (line 12), `## Violation Heuristic` (line 20)
  - Obligation refs: O9

- backend/src/server.ts
  - Why included: Reusable Fastify bootstrap and route-boundary wiring pattern.
  - Selectors: symbol `buildServer` (lines 13-25), `app.get("/health")` route (line 18), `registerKnowledgeGraphRoutes(...)` (line 23)
  - Obligation refs: O12

- backend/src/server.test.ts
  - Why included: Reusable inject/lifecycle and deterministic contract diagnostics pattern.
  - Selectors: test `rebuild persists projection and read endpoints return latest snapshot` (line 32), test `concept detail, definition, and open-definition endpoints satisfy stage-2 contract` (line 115), test `open-definition returns deterministic mismatch diagnostics` (line 201), test `rebuild rejects unknown project with deterministic code` (line 259), test `rebuild rejects invalid feature path escapes before file reads` (line 288)
  - Obligation refs: O10, O12

- backend/src/index.ts
  - Why included: Reusable process-boundary composition and scope-related env wiring.
  - Selectors: symbol `optionalEnv` (line 3), symbol `start` (line 13), `buildServer({...knowledgeGraph})` (line 17), `listen` startup boundary (line 25)
  - Obligation refs: O5, O12

## Excluded Candidates

- docs/features/knowledge-graph-visualization/UI-SPEC.md
  - Why excluded: No uncovered KG-IMP-02 obligations remained after task decision lock + DECISIONS + operations/interface contracts.

- docs/features/knowledge-graph-visualization/work-pack/shared/03-cross-task-decisions.md
  - Why excluded: Useful for D-KG-005 but does not cover D-KG-007/D-KG-009 required by TASK-KG-IMP-02 Decision Lock.

- architecture/ARCHITECTURE.md
  - Why excluded: Used as retrieval map during selection, but not retained because direct pattern-library files already satisfy all architecture obligations.

- docs/index/feature-map.md
  - Why excluded: Not present.

- docs/index/features-index.json
  - Why excluded: Not present.

- docs/index/tag-index.json
  - Why excluded: Not present.

- backend/src/auth.ts
  - Why excluded: Legacy module is intentionally removed and called out as re-implement (do not restore).

- backend/src/scopes.ts
  - Why excluded: Legacy module is intentionally removed and called out as re-implement (do not restore).

- backend/src/knowledge-graph-use-cases.ts
  - Why excluded: Legacy module is intentionally removed and called out as re-implement (do not restore).

## Interested Data Subsets

- relationships (derived from SPEC feature graph edge column only):
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

1. Implement/verify adapter boundary parsing and serialization for cards/graph/detail/definition endpoints while keeping business semantics in application use-cases.
2. Enforce scope propagation (`projectKey`, `featureId`) and deterministic diagnostics across rebuild, reads, selection, and open-definition.
3. Close TEST-SPEC scope-gap coverage by adding formal IDs for unknown project, unavailable feature, and root-confinement invariants.
4. Reuse the selected bootstrap/test/startup patterns while preserving task carryover limits against restoring removed legacy route surfaces.
