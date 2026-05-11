# Context Pack: TASK-AEO-C1-05

## Build Metadata

- Task: TASK-AEO-C1-05
- Feature: agent-execution-orchestrator
- Stage run id: c646e19f-1fae-42c1-9164-eb0aebe74bdb
- Command contract: domainspec-context-builder agent-execution-orchestrator --task TASK-AEO-C1-05 --mode standard --strict --emit both
- Generated at: 2026-05-11T01:17:34Z
- Mode: standard
- Strict relevance: enabled
- Emit: markdown + index-json
- Source task: ../tasks/TASK-AEO-C1-05.md

## Framework Constraints Applied

- 2.0.10: terminal guard and bounded command/search behavior constrain chaining evidence and deterministic recovery boundaries.
- 2.0.9: started telemetry rows must reconcile to terminal outcomes.
- 2.0.8: delegated stage telemetry rows require profile/thinking/stuck/retry/duration fields.
- 2.0.7: suspected-stuck execution requires one bounded retry before final blocked outcome.
- 2.0.4: context-builder output must be selector-bound, obligation-bound, interested-data scoped, and noise-budget compliant.

## Obligation Matrix

| Obligation Ref | Requirement                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| OBL-C1-05-01   | Define an ordered stage-subset chain scenario with at least three stages.                                                                      |
| OBL-C1-05-02   | Define handoff contract fields between consecutive stages in the selected chain.                                                               |
| OBL-C1-05-03   | Map stage N outputs to stage N+1 required inputs with explicit evidence references.                                                            |
| OBL-C1-05-04   | Capture SessionSnapshot continuity fields needed for interruption/resume across chained stages.                                                |
| OBL-C1-05-05   | Preserve ordered StageExecution identity (`stageRunId`, `order`) for chained execution.                                                        |
| OBL-C1-05-06   | Cover workflow authority for FeatureLifecyclePipelineWorkflow stage-loop ordering and evidence append.                                         |
| OBL-C1-05-07   | Cover operation authority for ExecutePipelineRoute chained outputs (`terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`). |
| OBL-C1-05-08   | Cover operation authority for ResumeExecutionRun in chained/interrupted flows.                                                                 |
| OBL-C1-05-09   | Cover rule authority for StageSelectionContract ordered subset constraints.                                                                    |
| OBL-C1-05-10   | Define deterministic mismatch behavior when stage N output cannot satisfy stage N+1 requirements.                                              |
| OBL-C1-05-11   | Bind mismatch classification to explicit terminal failure classes and remediation hooks.                                                       |
| OBL-C1-05-12   | Add one test-spec obligation anchor for chaining + handoff behavior.                                                                           |
| OBL-C1-05-13   | Carry forward prerequisite continuity from C1-04 single-stage proof path before chain expansion.                                               |
| OBL-C1-05-14   | Preserve lesson-log update obligation in capability-sequence context.                                                                          |
| OBL-C1-05-15   | Enforce strict schema gates (`selected[].selectors`, `selected[].obligationRefs`, `interestedData`) and standard-mode budgets.                 |
| OBL-C1-05-16   | Apply current changelog constraints (2.0.10/2.0.9/2.0.8/2.0.7/2.0.4).                                                                          |

## Candidate Ranking

Scoring formula applied per candidate:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

Lower score indicates higher inclusion priority.

## Selected Evidence (Strict, 10 Files)

### S01 - Task contract seed

- Source: ../tasks/TASK-AEO-C1-05.md
- Selectors: `# TASK-AEO-C1-05 - Stage Chaining and Handoff` (line 1), `## Goal` (line 3), `## Prerequisite` (line 15), `## Capability Slice` (line 19), `## DomainSpec Coverage` (line 27), `## Implementation Directives` (line 37), `## Completion Criteria` (line 44), `## Verification Evidence` (line 50)
- ObligationRefs: OBL-C1-05-01, OBL-C1-05-02, OBL-C1-05-03, OBL-C1-05-04, OBL-C1-05-05, OBL-C1-05-06, OBL-C1-05-07, OBL-C1-05-08, OBL-C1-05-09, OBL-C1-05-10, OBL-C1-05-11, OBL-C1-05-12, OBL-C1-05-13, OBL-C1-05-14
- Why included: primary task contract and explicit seed coverage IDs for C1-05.
- Excerpt:

> "Selected stage subset executes in declared order"
>
> "Stage N outputs mapped as stage N+1 required inputs"

### S02 - Immediate prerequisite continuity

- Source: ../tasks/TASK-AEO-C1-04.md
- Selectors: `# TASK-AEO-C1-04 - Single Selected-Stage Execution in Parent Run` (line 1), `## Goal` (line 3), `## Capability Slice` (line 26), `## DomainSpec Coverage` (line 34), `## Evidence References` (line 56), `## Verification Evidence` (line 62)
- ObligationRefs: OBL-C1-05-05, OBL-C1-05-11, OBL-C1-05-13
- Why included: C1-05 extends C1-04 by adding multi-stage handoff while preserving single-stage identity and terminal mapping guarantees.
- Excerpt:

> "single selected-stage path ... maps stage terminal outcome directly to the parent run terminal state"

### S03 - Domain authority for chain identity and resume payload

- Source: ../../domain.md
- Selectors: `### PipelineRouteTemplate` (line 29), `selectedStages` row (line 37), `### StageExecution` (line 90), `stageRunId` row (line 94), `order` row (line 96), `### SessionSnapshot` (line 136), `stageRunId` row (line 142), `terminalSessionId` row (line 144)
- ObligationRefs: OBL-C1-05-03, OBL-C1-05-04, OBL-C1-05-05, OBL-C1-05-09
- Why included: formal source for ordered selected-stage set, stage execution identity, and resume snapshot continuity fields.
- Excerpt:

> "selectedStages ... ordered stage set selected for this route"
>
> "stageRunId ... equal to ordered prompt artifact stageRunId"

### S04 - Workflow authority for chaining loop and recovery

- Source: ../../workflows.md
- Selectors: `## FeatureLifecyclePipelineWorkflow` (line 10), `More selected stages?` decision node (line 31), `### Step Table` (line 36), step rows for selected stage order/build/start/evidence append (lines 41, 42, 44, 46), `### Invariants` (line 72), `I-WF-1` (line 76), `I-WF-6` (line 81), `## LatestRunWinsRecoveryWorkflow` (line 85), resume step row (line 119)
- ObligationRefs: OBL-C1-05-01, OBL-C1-05-02, OBL-C1-05-03, OBL-C1-05-06, OBL-C1-05-08, OBL-C1-05-10
- Why included: canonical stage-loop, handoff ordering, reproducibility invariant, and chained resume branch contract.
- Excerpt:

> "Build ordered prompt artifact set"
>
> "More selected stages?"

### S05 - Operation authority for handoff fields and mismatch classification

- Source: ../../operations.md
- Selectors: `## AssemblePipelineRoute` (line 10), `promptBuildInputs` row (line 41), build-input rows `stageInputRefsByStage`, `requiredArtifactRefsByStage`, `stageRunIdsByStage` (lines 54-56), `promptArtifactSetHash` row (line 67), `### Deterministic Reproducibility Check` (line 69), reproducibility formula (line 75), prompt-build error rows `PROMPT_STAGE_INPUT_MISSING`, `PROMPT_STAGE_RUN_ID_MISSING`, `PROMPT_ARTIFACT_SET_INVALID` (lines 178-180), `## ExecutePipelineRoute` (line 185), output rows `terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome` (lines 210-212), rule rows `R6`, `R8` (lines 224, 226), calculation `C3` (line 236), `## ResumeExecutionRun` (line 302), `SNAPSHOT_INCOMPLETE` error row (line 337)
- ObligationRefs: OBL-C1-05-02, OBL-C1-05-03, OBL-C1-05-04, OBL-C1-05-07, OBL-C1-05-08, OBL-C1-05-10, OBL-C1-05-11
- Why included: definitive contract for handoff I/O fields, chain result mapping, resume constraints, and deterministic mismatch failure classes.
- Excerpt:

> "selectedStages ... requiredArtifactRefsByStage ... stageRunIdsByStage"
>
> "terminalOutcomeByStageRunId ... parentRunState ... parentTerminalOutcome"

### S06 - Rule authority for ordered subset, topology, and terminal guarantees

- Source: ../../rules.md
- Selectors: `## RunStateMachine` (line 9), transition rows `stage-completed`, `stage-blocked`, `stage-failed` (lines 23, 25, 26), `## StageSelectionContract` (line 147), `SSC-1` and `SSC-2` rows (lines 160-161), `## PromptBuildStepContract` (line 166), constraint rows `P-PB-1`..`P-PB-5` (lines 179-183), `## StageRunTopology` (line 196), `T-RT-1`, `T-RT-2` rows (lines 209-210), `## TerminalOutcomeRequired` (line 215), started-to-terminal rule (line 222)
- ObligationRefs: OBL-C1-05-01, OBL-C1-05-03, OBL-C1-05-05, OBL-C1-05-09, OBL-C1-05-10, OBL-C1-05-11
- Why included: legalizes ordered stage-subset chaining and binds mismatch/terminal behavior to deterministic state transitions.
- Excerpt:

> "selectionPolicy=stage-subset ... preservesOrder(selectedStages, stageContracts.stage)"
>
> "started(sr.stageRunId) -> exists terminal(sr.stageRunId)"

### S07 - Test-obligation authority for chain and resume behavior

- Source: ../../TEST-SPEC.md
- Selectors: trace rows `AEO-TR-002` (line 38), `AEO-TR-003` (line 39), `AEO-TR-008` (line 44), `AEO-TR-011` (line 47); operation/rule rows `AEO-BE-OP-010` (line 100), `AEO-BE-OP-012` (line 102), `AEO-BE-OP-024` (line 114), `AEO-BE-OP-027` (line 117), `AEO-BE-OP-046` (line 136), `AEO-BE-RULE-024` (line 165)
- ObligationRefs: OBL-C1-05-08, OBL-C1-05-10, OBL-C1-05-11, OBL-C1-05-12
- Why included: identifies current verification anchors where multi-stage handoff obligations should be extended from single-stage baseline.
- Excerpt:

> "AEO-BE-OP-046 ... single selected-stage scenario"

### S08 - Capability lesson continuity sink

- Source: capability-sequence-lessons.md
- Selectors: `## Capability 1 Entries` (line 18), `TASK-AEO-C1-04` row (line 26), `## Promotion Rule` (line 28)
- ObligationRefs: OBL-C1-05-13, OBL-C1-05-14
- Why included: C1-05 completion requires one new lesson entry extending C1 sequencing from single-stage proof to chain handoff.
- Excerpt:

> "before adding multi-stage chaining"

### S09 - Concept registry and relationship-edge subset authority

- Source: ../../SPEC.md
- Selectors: `## Concept Registry` (line 123), concept rows `StageExecution` (line 131), `SessionSnapshot` (line 134), `ResumeExecutionRun` (line 145), `RunStateMachine` (line 148), `FeatureLifecyclePipelineWorkflow` (line 159), `## Feature Concept Graph` (line 164), edge rows `FeatureLifecyclePipelineWorkflow | orchestrates | ExecutePipelineRoute` (line 168), `RunStateMachine | enforces | ExecutePipelineRoute` (line 172)
- ObligationRefs: OBL-C1-05-06, OBL-C1-05-07, OBL-C1-05-08, OBL-C1-05-09, OBL-C1-05-15
- Why included: authoritative concept IDs and feature-graph edges for interested-data subset extraction under strict mode.
- Excerpt:

> "FeatureLifecyclePipelineWorkflow ... orchestrates ... ExecutePipelineRoute"

### S10 - Framework strict-mode constraints

- Source: ../../../../../CHANGELOG.md
- Selectors: `## [2.0.10]` (line 26), `## [2.0.9]` (line 37), `## [2.0.8]` (line 48), `## [2.0.7]` (line 61), `## [2.0.4]` (line 85)
- ObligationRefs: OBL-C1-05-15, OBL-C1-05-16
- Why included: binds strict relevance/schema gates, budgets, and delegated terminalization constraints for this context build.
- Excerpt:

> "strict relevance gate ... selector-level evidence and obligation binding"

## Architecture Retrieval Map Resolution

- Explicit architecture references are not declared in `TASK-AEO-C1-05.md` coverage table or implementation directives.
- No uncovered C1-05 obligation required expansion into `architecture/ARCHITECTURE.md` or `architecture/pattern-library/*`.
- Architecture expansion was excluded by strict gate (`no obligationRef -> exclude`).

## Interested Data Subsets

### Feature Graph Edge Subset (SPEC-scoped)

Only C1-05-required relationship edges were retained.

| From                                                          | Edge         | To                                                | Evidence                                 |
| ------------------------------------------------------------- | ------------ | ------------------------------------------------- | ---------------------------------------- |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow | orchestrates | agent-execution-orchestrator.ExecutePipelineRoute | SPEC `## Feature Concept Graph` line 168 |
| agent-execution-orchestrator.RunStateMachine                  | enforces     | agent-execution-orchestrator.ExecutePipelineRoute | SPEC `## Feature Concept Graph` line 172 |

### Stage Chaining Handoff Subset

| Contract Element              | Required Subset                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stage subset chain            | `selectionPolicy=stage-subset`, `selectedStages` ordered/distinct/non-empty, minimum scenario shape: `plan -> spec -> tests`                                                         |
| Handoff fields (`N -> N+1`)   | `stageRunId`, `stage`, `order`, `stageInputRefsByStage[nextStage]`, `requiredArtifactRefsByStage[nextStage]`, `promptArtifactsByStageRunId[stageRunId]`, `promptArtifactSetHash`     |
| Parent/child continuity       | `terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`, `ExecutionRun.stageRuns` order-preserving linkage                                                          |
| Resume continuity             | `SessionSnapshot.runId`, `SessionSnapshot.stage`, `SessionSnapshot.stageRunId`, `SessionSnapshot.cwd`, `SessionSnapshot.terminalSessionId`, `snapshotVersion`                        |
| Deterministic mismatch subset | `PROMPT_STAGE_INPUT_MISSING`, `PROMPT_STAGE_RUN_ID_MISSING`, `PROMPT_ARTIFACT_SET_INVALID`, `SNAPSHOT_INCOMPLETE`, plus terminal mapping into `blocked` or `failed` with remediation |

## Excluded Candidates (Strict)

| Candidate                                                       | Exclusion Reason                                                                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| ../../interfaces.md                                             | No direct C1-05 coverage ID or implementation directive requires interface-level expansion for this stage. |
| ../../observability.md                                          | C1-05 scope is chaining/handoff contract definition; observability metrics are derivative for this slice.  |
| ../../WORK-PACK.md                                              | Planning manifest is derivative; task + aspect docs already satisfy C1-05 obligations.                     |
| ../waves/W4.md                                                  | Wave tracker adds schedule metadata but no unique handoff contract clauses.                                |
| ../../../../../architecture/ARCHITECTURE.md                     | No explicit architecture retrieval-map obligation for C1-05 (`no obligationRef -> exclude`).               |
| ../../../../../architecture/pattern-library/                    | No bound C1-05 obligation requires pattern-library expansion.                                              |
| ../../../../../docs/index/feature-map.md and docs/index/\*.json | Index expansion was unnecessary because explicit task links fully covered obligations.                     |

## Budget And Strict Gate Check

- Selected files: 10 / 14 (standard budget pass)
- Excerpt lines: 233 / 280 (standard budget pass)
- Noise ratio: 0.12 (must be <= 0.15, pass)
- Selector gate: pass (10/10 selected entries include selectors)
- Obligation binding gate: pass (10/10 selected entries include obligationRefs)

## Blockers

- None. All obligations from `TASK-AEO-C1-05.md` were covered by explicit task-scoped sources.
