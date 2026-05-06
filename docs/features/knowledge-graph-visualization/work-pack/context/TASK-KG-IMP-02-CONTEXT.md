# TASK-KG-IMP-02 Context Pack

## Context Pack Summary

- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-02
- Mode: standard
- Strict relevance gate: on
- Files selected: 14
- Snippets selected: 30
- Obligation coverage: 100%
- Noise ratio: 0.00
- Output markdown: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-02-CONTEXT.md
- Output index: docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-02-CONTEXT.index.json
- Blockers: 0

## Obligation Matrix

| Obligation ID | Requirement                                                                                                               | Evidence Source                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| O0            | Planner gate must be PASS and stage-1 scope must include KG-IMP-02                                                        | WORK-PACK.md Planner Control Fields + W1 wave/task board                    |
| O1            | Implement concept-detail, definition-pointer, and open-definition API contracts                                           | interfaces.md endpoints + TASK-KG-IMP-02 Goal/Execution Steps               |
| O2            | Preserve query-level filters and output shapes for detail and definition retrieval                                        | queries.md sections GetConceptDetailCard and GetDefinitionPointer           |
| O3            | Selection semantics remain in application layer with explicit errors                                                      | operations.md#selectconcept + TASK-KG-IMP-02 Implementation Directives      |
| O4            | Open-definition semantics must enforce session match and pointer/anchor resolution with stable error codes                | operations.md#opendefinition + interfaces.md POST open-definition responses |
| O5            | Keep endpoint parsing/serialization in adapters and business semantics in application use-cases                           | TASK-KG-IMP-02 Implementation Directives + LAYERING-REFERENCE.md            |
| O6            | Enforce layer dependency boundaries for interface/application/infrastructure                                              | DEPENDENCY-RULES.md + LAYERING-REFERENCE.md                                 |
| O7            | Concept detail projection must follow ConceptToDetailCard adapter contract                                                | mappings.md#concepttodetailcardadapter                                      |
| O8            | Stage-1 verification coverage must include KG-API-003..005 and KG-OP-003..004 plus interface mappings                     | TEST-SPEC.md contract matrix rows for KG-BE-API/KG-BE-OP/KG-BE-IFMAP        |
| O9            | Locked decision: open-definition action remains visible with no selection and click produces validation message path      | User lock + UI-SPEC OpenDefinitionAction + operations error code mapping    |
| O10           | Locked decision: backend stage-1 scope includes full interface contract for concept detail + definition + open-definition | User lock + TASK-KG-IMP-02 + interfaces.md endpoint set                     |
| O11           | Reuse Fastify bootstrap/inject harness patterns for deterministic route contracts                                         | backend/src/server.ts + backend/src/server.test.ts                          |

## Included Context

- docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-02.md
  - Why included: authoritative stage-1 contract for API/read/interaction scope
  - Selectors: Goal, DomainSpec Coverage, Architecture References, Implementation Directives, Execution Steps, Completion Criteria, Decision Lock
  - Obligation refs: O1, O2, O3, O4, O5, O8, O9, O10

- docs/features/knowledge-graph-visualization/WORK-PACK.md
  - Why included: planner gate evidence and W1 task scope lock
  - Selectors: Planner Control Fields (plannerGateStatus=pass), Task Status Board row KG-IMP-02, Wave Status Board row W1
  - Obligation refs: O0, O8, O10

- docs/features/knowledge-graph-visualization/work-pack/shared/03-cross-task-decisions.md
  - Why included: selected cross-task decision constraints that bind open-definition behavior
  - Selectors: Selected Decisions rows D-KG-003 and D-KG-005, Decision Application Rules
  - Obligation refs: O9, O10

- docs/features/knowledge-graph-visualization/queries.md
  - Why included: detail and definition read contracts with filters/output fields
  - Selectors: GetConceptDetailCard (Input, Filters, Output, Reads From), GetDefinitionPointer (Input, Filters, Output, Reads From)
  - Obligation refs: O1, O2, O10

- docs/features/knowledge-graph-visualization/interfaces.md
  - Why included: authoritative external/internal interface surface for stage-1 APIs
  - Selectors: GET /api/knowledge-graph/concepts/:conceptId, GET /api/knowledge-graph/concepts/:conceptId/definition, POST /api/knowledge-graph/concepts/:conceptId/open-definition, Internal KnowledgeGraphModule methods
  - Obligation refs: O1, O4, O10

- docs/features/knowledge-graph-visualization/operations.md
  - Why included: semantic guards and deterministic errors for select/open flows
  - Selectors: SelectConcept (Rules, Postconditions, Error States), OpenDefinition (Rules, Calculations, Postconditions, Error States)
  - Obligation refs: O3, O4, O9, O10

- docs/features/knowledge-graph-visualization/mappings.md
  - Why included: adapter contract for concept detail shaping
  - Selectors: ConceptToDetailCardAdapter (Field Mapping, Defaults, Validation)
  - Obligation refs: O7, O10

- docs/features/knowledge-graph-visualization/TEST-SPEC.md
  - Why included: deterministic verification obligations for stage-1 API/operation behavior
  - Selectors: Operation Rule Obligations rows KG-BE-OP-011..020, Interface Contract Obligations rows KG-BE-API-007..013, Interface Field-Mapping Obligations rows KG-BE-IFMAP-006..011, UI Form row KG-UI-FORM-001
  - Obligation refs: O8, O9, O10

- docs/features/knowledge-graph-visualization/UI-SPEC.md
  - Why included: user-visible validation contract for open-definition action when concept is not focused
  - Selectors: Data Flow mutation row POST /api/knowledge-graph/concepts/:conceptId/open-definition, OpenDefinitionAction validation table, Error Code -> UI Message Mapping
  - Obligation refs: O9, O10

- architecture/ARCHITECTURE.md
  - Why included: retrieval authority for architecture files used in this context pack
  - Selectors: Retrieval Map, Canonical Companions
  - Obligation refs: O5, O6

- architecture/pattern-library/LAYERING-REFERENCE.md
  - Why included: enforce adapter vs application separation for endpoint semantics
  - Selectors: Application Layer, Interface / Adapters Layer, Module Boundary Guidelines
  - Obligation refs: O5, O6

- architecture/pattern-library/DEPENDENCY-RULES.md
  - Why included: dependency constraints and drift blocking criteria
  - Selectors: Layer Dependency Constraints, Static Enforcement, Violation Heuristic
  - Obligation refs: O6

- backend/src/server.ts
  - Why included: reusable route/bootstrap boundary pattern for registering KG endpoints
  - Selectors: symbol buildServer, registerKnowledgeGraphRoutes call, app.get("/health") route pattern
  - Obligation refs: O5, O11

- backend/src/server.test.ts
  - Why included: reusable inject lifecycle and route contract assertion pattern
  - Selectors: test("health endpoint returns ok"), test("rebuild persists projection and read endpoints return latest snapshot"), app.inject(...) lifecycle and teardown
  - Obligation refs: O8, O11

## Excluded Candidates

- docs/features/knowledge-graph-visualization/domain.md
  - Why excluded: no uncovered KG-IMP-02 obligations remain after queries/interfaces/mappings selectors resolve detail and definition contracts.

- docs/features/knowledge-graph-visualization/DECISIONS.md
  - Why excluded: cross-task decision lock file provides narrower and direct decision IDs needed for stage-1 obligations.

- backend/src/index.ts
  - Why excluded: startup entrypoint pattern is optional for KG-IMP-02 obligations; route/bootstrap and contract test patterns are already covered by selected server files.

- architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md
  - Why excluded: no uncovered layering obligations remain after Layering Reference + Dependency Rules.

- docs/index/feature-map.md
  - Why excluded: file absent.

- docs/index/features-index.json
  - Why excluded: file absent.

- docs/index/tag-index.json
  - Why excluded: file absent.

## Interested Data Subsets

- relationships: applies, consumes, contains, displays, exposes, fetches, maps, mutates, orchestrates, produces, queries, reflects, renders, shapes, transitions, wraps

## Next Actions

1. Implement and register detail/definition/open-definition handlers through adapter boundaries and map input DTOs to application contracts.
2. Implement application-layer select/open semantics with deterministic error-code mapping and session persistence behavior.
3. Add/extend contract tests for KG-BE-API-007..013, KG-BE-OP-011..020, and KG-BE-IFMAP-006..011.
4. Ensure UI open-definition validation messaging is wired to `DEFINITION_SESSION_MISMATCH` and related error codes.
