# TASK-KG-IMP-09 Context Pack

- Stage: context-builder
- Command contract: domainspec-context-builder knowledge-graph-visualization --task TASK-KG-IMP-09 --mode standard --strict --emit both
- Feature: knowledge-graph-visualization
- Task: TASK-KG-IMP-09
- Mode: standard
- Strict relevance gate: enabled
- Generated: 2026-05-07

## Applied Framework Constraints

From CHANGELOG v2.0.8 and v2.0.4:

- Delegated stage telemetry and bounded execution are required.
- Strict relevance gate is mandatory: no selector -> no inclusion.
- Obligation binding is mandatory: no obligationRef -> exclude.
- Interested-data must use relationship edge subset, not full catalogs.
- Standard mode budgets: <=14 files, <=280 excerpt lines, noiseRatio <=0.15.

## Seed Set From Task Contract

Task-linked seeds:

- docs/features/knowledge-graph-visualization/ALIGNMENT-REPORT.md
- docs/features/knowledge-graph-visualization/interfaces.md
- docs/features/knowledge-graph-visualization/events.md
- docs/features/knowledge-graph-visualization/operations.md
- docs/features/knowledge-graph-visualization/UI-SPEC.md
- docs/features/knowledge-graph-visualization/TEST-SPEC.md
- architecture/ARCHITECTURE-PATTERN-LIBRARY.md
- architecture/pattern-library/LAYERING-REFERENCE.md
- architecture/pattern-library/TESTING-ALIGNMENT.md

Coverage IDs and action IDs parsed from task:

- KG-ALG-004..011
- A-KG-ALG-001..008
- KG-BE-API-001..013
- KG-BE-EVT-005, KG-BE-EVT-007, KG-BE-EVT-009
- KG-BE-OP-015, KG-BE-OP-016
- KG-UI-STATE-002, KG-UI-STATE-003

## Obligation Matrix

| Obligation | Contract IDs                                                 | Requirement                                                                                              |
| ---------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| O1         | KG-ALG-004, A-KG-ALG-001                                     | Add write-scope guard for POST /api/knowledge-graph/rebuild and deterministic 401/403 evidence.          |
| O2         | KG-ALG-005, A-KG-ALG-002, KG-BE-EVT-005/007/009              | Implement declared consumers or trim/waive claims with governance rationale.                             |
| O3         | KG-ALG-006, A-KG-ALG-003                                     | Remove production-path in-memory adapter bindings or file formal waiver.                                 |
| O4         | KG-ALG-007, A-KG-ALG-004, KG-BE-QRY-001                      | Align mirror-cards payload shape with storyCount and isActive contract.                                  |
| O5         | KG-ALG-008, A-KG-ALG-005, KG-UI-STATE-002/003                | Reconcile UI state vocabulary between UI-SPEC and frontend state model.                                  |
| O6         | KG-ALG-009, A-KG-ALG-006, KG-BE-OP-015/016                   | Reconcile selection source value set in canonical contract and code.                                     |
| O7         | KG-ALG-010, A-KG-ALG-007                                     | Close mandatory TEST-SPEC coverage deficit or formally reduce obligation set with owner/date acceptance. |
| O8         | KG-ALG-011, A-KG-ALG-008, KG-BE-IFMAP-005, KG-BE-QRY-003/007 | Reconcile conceptTypes and freshness-filter obligations across contracts.                                |
| O9         | TASK-KG-IMP-09 completion criteria                           | Produce non-BLOCK alignment verdict or FLAG-only accepted residuals.                                     |
| O10        | Architecture reference: Interface / Adapters Layer           | Keep route-layer changes in interface layer and business logic in application/domain layers.             |
| O11        | Architecture reference: Testing Alignment                    | Keep remediation evidence aligned with layer-to-test mapping.                                            |

## Selected Context (Strict, Selector-Bound)

| File                                                                          | Selectors                                                                                                                                                                                               | Obligation refs            | Why included                                                                               |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-KG-IMP-09.md | lines 18-24 (DomainSpec Coverage), 34-41 (Implementation Directives), 51-54 (Completion Criteria)                                                                                                       | O1,O2,O3,O4,O5,O6,O7,O8,O9 | Canonical task contract and closure target.                                                |
| docs/features/knowledge-graph-visualization/ALIGNMENT-REPORT.md               | lines 52-59 (KG-ALG-004..011), 116-123 (A-KG-ALG-001..008), 137-141 (BLOCK verdict reasons)                                                                                                             | O1,O2,O3,O4,O5,O6,O7,O8,O9 | Current blocker set and remediation matrix.                                                |
| docs/features/knowledge-graph-visualization/interfaces.md                     | lines 5-12 (POST rebuild auth), 63-72 (GET graph request map)                                                                                                                                           | O1,O8                      | Auth and query-field contract baseline.                                                    |
| docs/features/knowledge-graph-visualization/events.md                         | line 23 (Observability consumer), line 46 (Analytics consumer), line 70 (Audit log consumer)                                                                                                            | O2                         | Event consumer obligations under drift.                                                    |
| docs/features/knowledge-graph-visualization/operations.md                     | lines 123-129 (SelectConcept input source), 136-139 (R3 source rule)                                                                                                                                    | O6                         | Canonical source enumeration rule for selection.                                           |
| docs/features/knowledge-graph-visualization/UI-SPEC.md                        | lines 168-173 (State-to-UI mapping with AspectFocused and FeatureFocused)                                                                                                                               | O5                         | UI state vocabulary target for reconciliation.                                             |
| docs/features/knowledge-graph-visualization/TEST-SPEC.md                      | lines 106-118 (API obligations), 144-148 (event consumers), 154-160 (query obligations), 204-205 (UI state obligations), 228-232 (Uncovered Formal Gaps)                                                | O1,O2,O4,O5,O7,O8          | Coverage and reconciliation obligations for verification closure.                          |
| docs/features/knowledge-graph-visualization/queries.md                        | lines 35-37 (storyCount/isActive output), 76-81 (graph filters)                                                                                                                                         | O4,O8                      | Query contract shape and filter expectations.                                              |
| docs/features/knowledge-graph-visualization/SPEC.md                           | lines 148-152 (applies/orchestrates/produces), 159-162 (queries/exposes context)                                                                                                                        | O2,O9                      | Interested-data relationship subset seed.                                                  |
| architecture/pattern-library/LAYERING-REFERENCE.md                            | lines 39-43 (Interface / Adapters Layer responsibilities)                                                                                                                                               | O10                        | Layering guard for route remediation.                                                      |
| architecture/pattern-library/TESTING-ALIGNMENT.md                             | lines 5-10 (Layer-to-test mapping)                                                                                                                                                                      | O11                        | Test evidence alignment guardrail.                                                         |
| backend/src/modules/knowledge-graph/interface/http-routes.ts                  | lines 12-16 (in-memory adapter imports), 199-207 (rebuild route path), 264-272 (mirror-cards response map), 299-306 (graph filter parse), 560-571 (assertReadScope), 760-769 (normalizeSelectionSource) | O1,O3,O4,O6,O8,O10         | Primary implementation drift surface across blockers.                                      |
| backend/src/modules/knowledge-graph/domain/models.ts                          | lines 36-38 (SelectionSource union), 100-104 (MirrorCardView fields)                                                                                                                                    | O4,O6                      | Domain type-level contract currently allowing expanded source set and relationCount shape. |
| apps/web/src/hooks/useConceptFocus.ts                                         | lines 18-23 (ExplorationState union), 66-73 (derived state transitions)                                                                                                                                 | O5                         | Frontend state model for UI vocabulary drift.                                              |

## Interested-Data Subset (Feature Graph Edges)

Subset extracted from SPEC feature concept graph and narrowed to TASK-KG-IMP-09 obligations:

| From                                                    | Edge         | To                                                    | Evidence                               | Obligation refs |
| ------------------------------------------------------- | ------------ | ----------------------------------------------------- | -------------------------------------- | --------------- |
| knowledge-graph-visualization.CardSyncPolicy            | applies      | knowledge-graph-visualization.RebuildMirrorProjection | workflows.md#cardsyncpolicy            | O1,O9           |
| knowledge-graph-visualization.MirrorInteractionWorkflow | orchestrates | knowledge-graph-visualization.RebuildMirrorProjection | workflows.md#mirrorinteractionworkflow | O1,O9           |
| knowledge-graph-visualization.MirrorInteractionWorkflow | orchestrates | knowledge-graph-visualization.SelectConcept           | workflows.md#mirrorinteractionworkflow | O6,O9           |
| knowledge-graph-visualization.MirrorInteractionWorkflow | orchestrates | knowledge-graph-visualization.OpenDefinition          | workflows.md#mirrorinteractionworkflow | O9              |
| knowledge-graph-visualization.RebuildMirrorProjection   | produces     | knowledge-graph-visualization.MirrorProjectionBuilt   | operations.md#rebuildmirrorprojection  | O2              |
| knowledge-graph-visualization.SelectConcept             | produces     | knowledge-graph-visualization.ConceptSelected         | operations.md#selectconcept            | O2,O6           |
| knowledge-graph-visualization.OpenDefinition            | produces     | knowledge-graph-visualization.DefinitionOpened        | operations.md#opendefinition           | O2              |
| knowledge-graph-visualization.ConceptSelected           | transitions  | knowledge-graph-visualization.ExplorationState        | states.md#explorationstate             | O5              |
| knowledge-graph-visualization.DefinitionOpened          | transitions  | knowledge-graph-visualization.ExplorationState        | states.md#explorationstate             | O5              |
| knowledge-graph-visualization.GetMirrorCards            | queries      | knowledge-graph-visualization.MirrorProjection        | queries.md#getmirrorcards              | O4,O8           |
| knowledge-graph-visualization.GetRelationshipGraph      | queries      | knowledge-graph-visualization.MirrorProjection        | queries.md#getrelationshipgraph        | O8              |

## Candidate Ranking (Lower Is Better)

Formula applied: score = (1 - signal)*0.45 + cost*0.30 + ambiguity\*0.25

Top-ranked selected artifacts:

| File                | Score |
| ------------------- | ----- |
| TASK-KG-IMP-09.md   | 0.028 |
| ALIGNMENT-REPORT.md | 0.102 |
| http-routes.ts      | 0.104 |
| useConceptFocus.ts  | 0.103 |
| interfaces.md       | 0.106 |
| domain/models.ts    | 0.110 |

## Excluded Evidence

- architecture/ARCHITECTURE-PATTERN-LIBRARY.md: excluded after selector check; LAYERING-REFERENCE and TESTING-ALIGNMENT satisfy explicit architecture obligations with lower retrieval cost.
- backend/src/modules/knowledge-graph/application/session-store.ts: excluded as duplicate proof of in-memory binding already captured at composition site in http-routes.ts.
- backend/src/modules/knowledge-graph/infrastructure/in-memory-project-source-registry.ts: excluded as duplicate for O3 once composition-level binding is captured.
- backend/src/modules/knowledge-graph/application/get-latest-mirror-projection.ts: excluded for this pack because O8 can be resolved from interfaces + queries + route parser selectors already included.
- docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-\*.md: excluded to avoid generated-context recursion/noise.

## Gate Checks

- Selector bound: PASS (all selected entries have explicit selectors).
- Obligation bound: PASS (all selected entries map to >=1 obligationRef).
- Mode budget files: PASS (14/14).
- Mode budget excerpt lines: PASS (220/280).
- Noise ratio: PASS (0.07 <= 0.15).
- Unresolved blockers: none.

This context pack is ready for TASK-KG-IMP-09 implementation execution and alignment rerun closure.
