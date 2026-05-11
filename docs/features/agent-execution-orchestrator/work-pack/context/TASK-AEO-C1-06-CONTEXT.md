# Context Pack: TASK-AEO-C1-06

## Build Metadata

- Task: TASK-AEO-C1-06
- Feature: agent-execution-orchestrator
- Stage run id: 507c72c5-695f-4867-b907-0f261e3c5e3b
- Command contract: domainspec-context-builder agent-execution-orchestrator --task TASK-AEO-C1-06 --mode standard --strict --emit both
- Generated at: 2026-05-10T00:00:00Z
- Mode: standard
- Strict relevance: enabled
- Emit: markdown + index-json
- Source task: ../tasks/TASK-AEO-C1-06.md

## Framework Constraints Applied

- 2.0.10: bounded/guarded execution policy shapes recovery evidence boundaries.
- 2.0.9: every started stage row must reconcile to a terminal outcome row.
- 2.0.8: delegated stage telemetry requires profile/thinking/stuck/retry fields.
- 2.0.7: suspected-stuck path permits one bounded retry before final blocked outcome.
- 2.0.4: strict selector-level + obligation-bound context selection and interested-data subsets are mandatory.

## Obligation Matrix

| Obligation Ref | Requirement                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| OBL-C1-06-01   | Define one forced-failure scenario with bounded retry behavior.                                                                |
| OBL-C1-06-02   | Define one supersession scenario proving latest-run-wins cancellation semantics.                                               |
| OBL-C1-06-03   | Define terminal-outcome guarantees for recovery branches.                                                                      |
| OBL-C1-06-04   | Define one isolated-stage failure scenario where child-run terminal outcome reconciles into parent stage record.               |
| OBL-C1-06-05   | Bind RetryPolicy parameters and exhaustion behavior.                                                                           |
| OBL-C1-06-06   | Bind CancellationPolicy decision rules and cancellation terminal telemetry requirement.                                        |
| OBL-C1-06-07   | Bind LatestRunWinsRecoveryWorkflow steps and invariants.                                                                       |
| OBL-C1-06-08   | Bind StageRunTopology child-run reconciliation constraints.                                                                    |
| OBL-C1-06-09   | Bind StageIsolationMode and StageExecution childRunId linkage constraints.                                                     |
| OBL-C1-06-10   | Bind TerminalOutcomeRequired stage-level and parent-level terminalization semantics.                                           |
| OBL-C1-06-11   | Bind ExecutePipelineRoute output mappings for stage and parent terminal outcomes.                                              |
| OBL-C1-06-12   | Bind ResumeExecutionRun and CancelSupersededRun error boundaries for recovery/supersession branches.                           |
| OBL-C1-06-13   | Carry forward deterministic handoff/mismatch continuity from C1-05 prerequisite before adding recovery complexity.             |
| OBL-C1-06-14   | Preserve lesson entry obligation and promotion continuity.                                                                     |
| OBL-C1-06-15   | Enforce definitions-phase scope: docs-only/non-mutation and no code-mutation assumptions.                                      |
| OBL-C1-06-16   | Enforce strict schema gates (`selected[].selectors`, `selected[].obligationRefs`, `interestedData`) and standard-mode budgets. |
| OBL-C1-06-17   | Apply current changelog constraints (2.0.10, 2.0.9, 2.0.8, 2.0.7, 2.0.4).                                                      |

## Candidate Ranking

Scoring formula applied per candidate:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

Lower score means higher inclusion priority.

## Selected Evidence (Strict, 10 Files)

### S01 - Task contract seed

- Source: ../tasks/TASK-AEO-C1-06.md
- Selectors: `# TASK-AEO-C1-06 - Failure Handling, Retry, and Supersession` (line 1), `## Goal` (line 3), `## Prerequisite` (line 15), `## Capability Slice` (line 19), `## DomainSpec Coverage` (line 28), `## Implementation Directives` (line 39), `## Completion Criteria` (line 47), `## Verification Evidence` (line 53)
- ObligationRefs: OBL-C1-06-01, OBL-C1-06-02, OBL-C1-06-03, OBL-C1-06-04, OBL-C1-06-05, OBL-C1-06-06, OBL-C1-06-07, OBL-C1-06-08, OBL-C1-06-09, OBL-C1-06-10, OBL-C1-06-11, OBL-C1-06-12, OBL-C1-06-13, OBL-C1-06-14, OBL-C1-06-15
- Why included: primary obligation source and seed coverage IDs.

### S02 - Prerequisite continuity source

- Source: ../tasks/TASK-AEO-C1-05.md
- Selectors: `# TASK-AEO-C1-05 - Stage Chaining and Handoff` (line 1), `## Goal` (line 3), `## Status` (line 11), `## DomainSpec Coverage` (line 35), `## Implementation Directives` (line 45), `## Evidence References` (line 58)
- ObligationRefs: OBL-C1-06-13
- Why included: C1-06 extends C1-05 deterministic handoff/mismatch semantics with retry/supersession/recovery branches.

### S03 - Rule authority for retry/cancellation/topology/terminalization

- Source: ../../rules.md
- Selectors: `## RunStateMachine` (line 9), superseded transition row (line 27), `## RetryPolicy` (line 63), `P-R-3` row (line 82), `## CancellationPolicy` (line 86), `P-C-1` row (line 103), `## StageRunTopology` (line 200), `T-RT-3` row (line 215), `## TerminalOutcomeRequired` (line 240), started-to-terminal formula (line 247), parent terminal reduction (line 251)
- ObligationRefs: OBL-C1-06-01, OBL-C1-06-02, OBL-C1-06-03, OBL-C1-06-05, OBL-C1-06-06, OBL-C1-06-08, OBL-C1-06-10, OBL-C1-06-13
- Why included: canonical policy and invariant source for bounded retry, latest-run-wins cancellation, isolated reconciliation, and terminal outcome guarantees.

### S04 - Recovery workflow authority

- Source: ../../workflows.md
- Selectors: `I-WF-5` row (line 108), `## LatestRunWinsRecoveryWorkflow` (line 114), `Triggers` line (line 117), compensation strategy (line 119), step 2 cancel superseded run (line 146), step 3 retry narrowed scope (line 147), step 4 resume interrupted run (line 148), `I-RW-1` (line 155), `I-RW-2` (line 156), `I-RW-3` (line 157), `I-RW-4` (line 158)
- ObligationRefs: OBL-C1-06-01, OBL-C1-06-02, OBL-C1-06-03, OBL-C1-06-04, OBL-C1-06-07, OBL-C1-06-12
- Why included: defines the explicit recovery branch sequence and invariants for supersession, retry, resume, and telemetry completion.

### S05 - Domain authority for isolation linkage

- Source: ../../domain.md
- Selectors: `isolationMode` stage-contract row (line 80), `### StageExecution` (line 90), `childRunId` row (line 98), `### StageIsolationMode` (line 186), `isolated-child-run` enum row (line 191)
- ObligationRefs: OBL-C1-06-04, OBL-C1-06-08, OBL-C1-06-09
- Why included: formal child-run linkage and isolation semantics used in C1-06 isolated failure/reconciliation scenario.

### S06 - Operation authority for execution/recovery/supersession outcomes

- Source: ../../operations.md
- Selectors: `## ExecutePipelineRoute` (line 186), output rows `terminalOutcomeByStageRunId` (line 211), `parentTerminalOutcome` (line 213), `childRunIdsByStageRunId` (line 214), `### Rules` (line 216), rules `R3` (line 222), `R4` (line 223), `R5` (line 224), `R9` (line 228), `R10` (line 229), calc `C3` (line 238), `### Stage-Subset Chaining and Handoff Scenario (C1-05)` (line 279), error row `RETRY_BUDGET_EXHAUSTED` (line 336), error row `CHILD_RUN_RECONCILIATION_FAILED` (line 338), `## ResumeExecutionRun` (line 344), `SNAPSHOT_INCOMPLETE` error row (line 379), `## CancelSupersededRun` (line 384), cancellation terminal rule `R2` (line 403)
- ObligationRefs: OBL-C1-06-01, OBL-C1-06-02, OBL-C1-06-03, OBL-C1-06-04, OBL-C1-06-05, OBL-C1-06-06, OBL-C1-06-10, OBL-C1-06-11, OBL-C1-06-12, OBL-C1-06-13
- Why included: operation-level contractual source for terminal mapping, retry exhaustion, child-run reconciliation failure handling, resume errors, and deterministic supersession cancellation.

### S07 - Feature contract and graph subset authority

- Source: ../../SPEC.md
- Selectors: `### Policy-Governed Branch and Cancellation Control` (line 89), policy rows `RetryPolicy` (line 96), `CancellationPolicy` (line 97), operation row `CancelSupersededRun` (line 98), `## Concept Registry` (line 123), concept rows `StageIsolationMode` (line 137), `RetryPolicy` (line 150), `CancellationPolicy` (line 151), `LatestRunWinsRecoveryWorkflow` (line 160), `## Feature Concept Graph` (line 164), edges at lines 168, 172, 174
- ObligationRefs: OBL-C1-06-02, OBL-C1-06-05, OBL-C1-06-06, OBL-C1-06-07, OBL-C1-06-09, OBL-C1-06-16
- Why included: binds concept IDs and relationship-edge subset used by strict interested-data extraction.

### S08 - Lesson continuity sink

- Source: capability-sequence-lessons.md
- Selectors: `## Capability 1 Entries` (line 18), `TASK-AEO-C1-05` lesson row (line 27), `## Promotion Rule` (line 29)
- ObligationRefs: OBL-C1-06-13, OBL-C1-06-14
- Why included: completion contract requires one C1-06 lesson entry and progression continuity.

### S09 - Definitions-phase scope guard

- Source: ../../WORK-PACK.md
- Selectors: `## Governance Signal Obligations (Docs-Only/Non-Mutation)` (line 174), `## Notes` (line 262), planning-only no mutation note (line 264), docs-only/non-mutation note (line 265)
- ObligationRefs: OBL-C1-06-15
- Why included: enforces explicit non-mutation scope for this definitions-phase slice.

### S10 - Framework strict-mode source

- Source: ../../../../../domainspec/CHANGELOG.md
- Selectors: `## [2.0.10]` (line 26), `## [2.0.9]` (line 37), `## [2.0.8]` (line 48), `## [2.0.7]` (line 61), `## [2.0.4]` (line 85)
- ObligationRefs: OBL-C1-06-16, OBL-C1-06-17
- Why included: defines strict context-builder schema gates, noise budget, and terminalization constraints applied during pack generation.

## Architecture Retrieval Map Resolution

- Explicit architecture references are not declared in `TASK-AEO-C1-06.md` coverage table or directives.
- No uncovered C1-06 obligation required expansion into `architecture/ARCHITECTURE.md` or `architecture/pattern-library/*`.
- Architecture expansion excluded by strict gate (`no obligationRef -> exclude`).

## Interested Data Subsets

### Feature Graph Edge Subset (SPEC-scoped)

Only C1-06-relevant relationship edges were retained.

| From                                                          | Edge         | To                                                | Evidence                    |
| ------------------------------------------------------------- | ------------ | ------------------------------------------------- | --------------------------- |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow | orchestrates | agent-execution-orchestrator.ExecutePipelineRoute | SPEC feature graph line 168 |
| agent-execution-orchestrator.RunStateMachine                  | enforces     | agent-execution-orchestrator.ExecutePipelineRoute | SPEC feature graph line 172 |
| agent-execution-orchestrator.CancellationPolicy               | applies      | agent-execution-orchestrator.CancelSupersededRun  | SPEC feature graph line 174 |

### Recovery/Supersession/Isolation Contract Subset

| Contract Element         | Required Subset                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Retry                    | `maxRetries=1`, retry narrowing required, exhaustion -> terminal `blocked`                                     |
| Supersession             | `latest-run-wins` policy, superseded run must terminalize as `canceled`                                        |
| Recovery workflow        | detect trigger -> cancel superseded or retry narrowed -> optional resume -> emit governance signals            |
| Isolation reconciliation | `isolationMode=isolated-child-run` requires child run linkage and parent stage terminal outcome reconciliation |
| Terminal guarantees      | all started `stageRunId` values must reach terminal outcome; parent outcome reduced from stage outcomes        |

## Excluded Candidates (Strict)

| Candidate                                        | Exclusion Reason                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| ../../interfaces.md                              | No direct C1-06 coverage ID or directive requires interface-level expansion in this slice.                         |
| ../../observability.md                           | C1-06 scope is recovery/cancellation/isolation contract definition; observability derivation is downstream.        |
| ../../TEST-SPEC.md                               | Task directives require defining contract scenarios first; no explicit test-obligation coverage ID in C1-06 table. |
| ../waves/W4.md                                   | Wave tracker contributes schedule/progress metadata but no unique C1-06 contract clauses.                          |
| ../capabilities/CAP-AEO-C1-PIPELINE-EXECUTION.md | Capability overview is derivative; task + aspect docs already bind C1-06 obligations.                              |
| ../../../../../architecture/ARCHITECTURE.md      | No explicit architecture retrieval-map obligation for C1-06 (`no obligationRef -> exclude`).                       |
| ../../../../../architecture/pattern-library/     | No bound C1-06 obligation requires pattern-library expansion.                                                      |
| ../../../../../docs/index/feature-map.md         | Optional index artifact not required; explicit task links fully covered obligations.                               |
| ../../../../../docs/index/features-index.json    | Optional index artifact not required; explicit task links fully covered obligations.                               |
| ../../../../../docs/index/tag-index.json         | Optional index artifact not required; explicit task links fully covered obligations.                               |

## Budget And Strict Gate Check

- Selected files: 10 / 14 (standard budget pass)
- Excerpt lines: 218 / 280 (standard budget pass)
- Noise ratio: 0.12 (must be <= 0.15, pass)
- Selector gate: pass (10/10 selected entries include selectors)
- Obligation binding gate: pass (10/10 selected entries include obligationRefs)

## Blockers

- None. Explicit C1-06 obligations are fully covered by task-linked feature sources.
