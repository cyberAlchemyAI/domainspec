# Context Pack: TASK-AEO-C1-04

## Build Metadata

- Task: TASK-AEO-C1-04
- Feature: agent-execution-orchestrator
- Stage run id: 70f664c8-589b-4078-abe0-38837e142734
- Generated at: 2026-05-11T00:50:38Z
- Mode: standard
- Strict relevance: enabled
- Emit: markdown + index-json
- Source task: ../tasks/TASK-AEO-C1-04.md

## Framework Constraints Applied

- 2.0.10: terminal guard and bounded command/search behavior constrain single-stage execution evidence and recovery boundaries.
- 2.0.9: started telemetry rows must reconcile to terminal outcomes.
- 2.0.8: delegated stage telemetry rows require profile/thinking/stuck/retry/duration fields.
- 2.0.7: suspected-stuck execution requires one bounded retry before final blocked outcome.
- 2.0.4: context-builder output must be selector-bound, obligation-bound, interested-data scoped, and noise-budget compliant.

## Obligation Matrix

| Obligation Ref | Requirement                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| OBL-C1-04-01   | Define one controlled single selected-stage scenario using `selectionPolicy=stage-subset`.                                     |
| OBL-C1-04-02   | Map stage terminal outcomes and parent-run state progression explicitly.                                                       |
| OBL-C1-04-03   | Capture single-stage execution error boundaries for blocked/failed classifications.                                            |
| OBL-C1-04-04   | Add one test-spec obligation for the single selected-stage path.                                                               |
| OBL-C1-04-05   | Provide evidence references for prompt artifact, stage execution record, and run output classification.                        |
| OBL-C1-04-06   | Cover workflow authority for `FeatureLifecyclePipelineWorkflow`.                                                               |
| OBL-C1-04-07   | Cover operation authority for `ExecutePipelineRoute` and stage-subset route selection constraints.                             |
| OBL-C1-04-08   | Cover domain authority for `StageExecution` and parent `ExecutionRun` linkage.                                                 |
| OBL-C1-04-09   | Cover `RunStateMachine` transition semantics for single-stage terminalization.                                                 |
| OBL-C1-04-10   | Carry forward runner identity/reconciliation constraints from prerequisite C1-03.                                              |
| OBL-C1-04-11   | Preserve lesson-log update obligation in capability sequence context.                                                          |
| OBL-C1-04-12   | Preserve determinism requirement: same controlled input keeps terminal outcome class.                                          |
| OBL-C1-04-13   | Enforce strict schema gates (`selected[].selectors`, `selected[].obligationRefs`, `interestedData`) and standard-mode budgets. |
| OBL-C1-04-14   | Apply current changelog constraints (2.0.10/2.0.9/2.0.8/2.0.7/2.0.4).                                                          |

## Candidate Ranking

Scoring formula applied per candidate:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

Lower score indicates higher inclusion priority.

## Selected Evidence (Strict, 10 Files)

### S01 - Task contract seed

- Source: ../tasks/TASK-AEO-C1-04.md
- Selectors: `# TASK-AEO-C1-04 - Single Selected-Stage Execution in Parent Run` (line 1), `## Goal` (line 3), `## Prerequisite` (line 15), `## Capability Slice` (line 19), `## DomainSpec Coverage` (line 27), `## Implementation Directives` (line 36), `## Completion Criteria` (line 43), `## Verification Evidence` (line 49)
- ObligationRefs: OBL-C1-04-01, OBL-C1-04-02, OBL-C1-04-03, OBL-C1-04-04, OBL-C1-04-05, OBL-C1-04-06, OBL-C1-04-07, OBL-C1-04-08, OBL-C1-04-09, OBL-C1-04-10, OBL-C1-04-11, OBL-C1-04-12
- Why included: primary task contract and explicit seed links.
- Excerpt:

> "selected stage -> prompt artifact -> parent run stage execution -> stage terminal outcome"
>
> "Add one test-spec obligation for this single-stage execution path."

### S02 - Immediate prerequisite runner contract

- Source: ../tasks/TASK-AEO-C1-03.md
- Selectors: `# TASK-AEO-C1-03 - Runner Execution Contract` (line 1), `## Goal` (line 3), `## DomainSpec Coverage` (line 36), `## Completion Criteria` (line 56), `## Verification Evidence` (line 62)
- ObligationRefs: OBL-C1-04-02, OBL-C1-04-03, OBL-C1-04-10, OBL-C1-04-12
- Why included: C1-04 depends on C1-03 runner identity/outcome semantics and inherits its deterministic evidence boundary.
- Excerpt:

> "Define the minimal runner contract that executes selected stages under one parent run and returns deterministic per-stage and parent-run outcomes."

### S03 - Workflow orchestration authority

- Source: ../../workflows.md
- Selectors: `## FeatureLifecyclePipelineWorkflow` (line 10), `### Steps` (line 18), step rows for stage execution/evidence (lines 44-46), `### Invariants` (line 49), invariant rows `I-WF-1`, `I-WF-2`, `I-WF-3`, `I-WF-6` (lines 53-58)
- ObligationRefs: OBL-C1-04-01, OBL-C1-04-02, OBL-C1-04-05, OBL-C1-04-06, OBL-C1-04-12
- Why included: defines lifecycle ordering from selected-stage resolution to terminal outcome and evidence completion.
- Excerpt:

> "Resolve selected stage set and order"
>
> "Append stage telemetry and evidence"

### S04 - Route selection and run execution operation contract

- Source: ../../operations.md
- Selectors: `## AssemblePipelineRoute` (line 10), `### Input` (line 31), selected-stage input rows (`selectedStages`, `selectionPolicy`) (lines 39, 52), rule rows `R5`, `R6` (lines 155-156), `## ExecutePipelineRoute` (line 185), `### Input` (line 191), `### Rules` (line 215), rule rows `R3`, `R6`, `R8` (lines 221, 224, 226), `### Calculations` (line 230), `### State Transition` (line 238), `### Postconditions` (line 242), `### Error States` (line 251)
- ObligationRefs: OBL-C1-04-01, OBL-C1-04-02, OBL-C1-04-03, OBL-C1-04-05, OBL-C1-04-07, OBL-C1-04-12
- Why included: supplies the formal contract for single-stage subset selection, stage execution identity, terminal mapping, and deterministic error boundaries.
- Excerpt:

> "selectionPolicy=stage-subset -> length(selectedStages)>=1 and distinct(selectedStages)"
>
> "Run must terminate with explicit outcome"

### S05 - Domain model for stage execution and parent state

- Source: ../../domain.md
- Selectors: `### ExecutionRun` (line 47), rows `currentState`, `terminalOutcome`, `stageRuns` (lines 58-62), `### StageExecution` (line 90), rows `stageRunId`, `terminalOutcome` (lines 94, 100), `### RunState` (line 193), `### TerminalOutcome` (line 206)
- ObligationRefs: OBL-C1-04-02, OBL-C1-04-05, OBL-C1-04-08, OBL-C1-04-10
- Why included: authoritative model of parent-run progression and stage-level record/outcome linkage.
- Excerpt:

> "stageRuns ... Ordered stage execution records under this run"
>
> "terminalOutcome ... Required when state is terminal"

### S06 - State machine and stage-selection rules

- Source: ../../rules.md
- Selectors: `## RunStateMachine` (line 9), transition rows `running -> stage-completed`, `running -> stage-blocked`, `running -> stage-failed` (lines 23, 25, 26), `## StageSelectionContract` (line 147), stage-subset predicate (line 154), constraints `SSC-1`, `SSC-2` (lines 160-161), `## TerminalOutcomeRequired` (line 215), started-to-terminal invariant (line 222)
- ObligationRefs: OBL-C1-04-01, OBL-C1-04-02, OBL-C1-04-03, OBL-C1-04-09, OBL-C1-04-12
- Why included: formal transition/state guarantees and stage-subset legality for single-stage execution slices.
- Excerpt:

> "selectionPolicy=stage-subset -> ... preservesOrder(selectedStages, stageContracts.stage)"
>
> "started(sr.stageRunId) -> exists terminal(sr.stageRunId)"

### S07 - Test obligation authority

- Source: ../../TEST-SPEC.md
- Selectors: `## Concept and Rule Traceability Index` (line 35), rows `AEO-TR-002`, `AEO-TR-008`, `AEO-TR-011` (lines 38, 44, 47), operation obligation rows `AEO-BE-OP-010`, `AEO-BE-OP-012`, `AEO-BE-OP-017`, `AEO-BE-OP-021`, `AEO-BE-OP-022` (lines 100, 102, 107, 111, 112)
- ObligationRefs: OBL-C1-04-03, OBL-C1-04-04, OBL-C1-04-06, OBL-C1-04-07, OBL-C1-04-09
- Why included: anchors where the new single-stage execution obligation must be added without breaking existing route and state-machine coverage.
- Excerpt:

> "AEO-TR-002 ... ExecutePipelineRoute"
>
> "AEO-BE-OP-017 ... queued to running to one terminal state"

### S08 - Capability lesson continuity sink

- Source: capability-sequence-lessons.md
- Selectors: `## Capability 1 Entries` (line 18), row for `TASK-AEO-C1-03` (line 25), `## Promotion Rule` (line 27)
- ObligationRefs: OBL-C1-04-11
- Why included: C1-04 completion requires appending one lesson entry with reuse rule.
- Excerpt:

> "Every completed task appends one lesson entry ..."

### S09 - Feature concept registry and edge authority subset

- Source: ../../SPEC.md
- Selectors: `## Concept Registry` (line 123), concept rows for `StageExecution`, `ExecutePipelineRoute`, `RunStateMachine`, `FeatureLifecyclePipelineWorkflow` (lines 131, 144, 148, 159), `## Feature Concept Graph` (line 164), edge rows `FeatureLifecyclePipelineWorkflow | orchestrates | ExecutePipelineRoute` (line 168), `RunStateMachine | enforces | ExecutePipelineRoute` (line 172)
- ObligationRefs: OBL-C1-04-06, OBL-C1-04-07, OBL-C1-04-08, OBL-C1-04-09, OBL-C1-04-13
- Why included: concept-id authority and relationship-edge source for interested-data subset extraction.
- Excerpt:

> "StageExecution ... one execution record per selected stage"
>
> "RunStateMachine ... enforces ... ExecutePipelineRoute"

### S10 - Framework hard constraints for strict mode

- Source: ../../../../../CHANGELOG.md
- Selectors: `## [2.0.10]` (line 26), `## [2.0.9]` (line 37), `## [2.0.8]` (line 48), `## [2.0.7]` (line 61), `## [2.0.4]` (line 85)
- ObligationRefs: OBL-C1-04-13, OBL-C1-04-14
- Why included: binds strict context-builder schema, bounded execution behavior, and telemetry terminalization requirements.
- Excerpt:

> "strict relevance gate ... selector-level evidence and obligation binding"
>
> "mode budgets hardened ... noise ratio <= 0.15"

## Architecture Retrieval Map Resolution

- Explicit architecture references are not declared in `TASK-AEO-C1-04.md` coverage table or implementation directives.
- No uncovered C1-04 obligation required expansion into `architecture/ARCHITECTURE.md` or `architecture/pattern-library/*`.
- Architecture expansion was excluded by strict gate (`no obligationRef -> exclude`).

## Interested Data Subsets

### Feature Graph Edge Subset (SPEC-scoped)

Only C1-04-required relationship edges were retained.

| From                                                          | Edge         | To                                                | Evidence                        |
| ------------------------------------------------------------- | ------------ | ------------------------------------------------- | ------------------------------- |
| agent-execution-orchestrator.FeatureLifecyclePipelineWorkflow | orchestrates | agent-execution-orchestrator.ExecutePipelineRoute | SPEC `## Feature Concept Graph` |
| agent-execution-orchestrator.RunStateMachine                  | enforces     | agent-execution-orchestrator.ExecutePipelineRoute | SPEC `## Feature Concept Graph` |

### Single-Stage Execution Subset

| Contract Element        | Required Subset                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------ | ---------------------------------------------- |
| Route selection         | `selectionPolicy=stage-subset`, `selectedStages` non-empty/distinct/order-preserving, single controlled stage sample (`length(selectedStages)=1`) |
| Prompt evidence         | one ordered prompt artifact carrying `stageRunId`, with deterministic builder hash for unchanged inputs                                           |
| Stage execution records | one parent `ExecutionRun.stageRuns` entry for selected stage, terminal outcome mapped by `stageRunId`                                             |
| Parent progression      | `queued -> running -> {completed                                                                                                                  | blocked | failed | canceled}`with explicit`parentTerminalOutcome` |
| Error boundary subset   | `PROVIDER_UNAVAILABLE`, `TERMINAL_OUTCOME_MISSING`, bounded retry exhaustion -> `blocked` remediation                                             |

## Excluded Candidates (Strict)

| Candidate                                                         | Exclusion Reason                                                                                                                             |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ../../WORK-PACK.md                                                | Planning manifest is derivative; task + aspect docs already satisfy all C1-04 obligations.                                                   |
| ../capabilities/CAP-AEO-C1-PIPELINE-EXECUTION.md                  | Capability overview is derivative for this task and adds no direct obligation coverage beyond selected sources.                              |
| ../waves/W4.md                                                    | Wave tracker provides progress metadata but no unique C1-04 contract clauses.                                                                |
| ../../observability.md                                            | C1-04 scope is single-stage execution contract and test-obligation binding; observability mappings are not direct obligations in this slice. |
| ../../interfaces.md                                               | No explicit C1-04 coverage ID or directive binds interface-level expansion in this stage.                                                    |
| ../../../../../architecture/ARCHITECTURE.md                       | No explicit architecture retrieval-map obligation for C1-04 (`no obligationRef -> exclude`).                                                 |
| ../../../../../architecture/pattern-library/                      | No bound C1-04 obligation requires pattern-library expansion.                                                                                |
| ../../../../../docs/index/feature-map.md and index json artifacts | Index expansion was unnecessary because explicit task links fully covered obligations.                                                       |

## Budget And Strict Gate Check

- Selected files: 10 / 14 (standard budget pass)
- Excerpt lines: 196 / 280 (standard budget pass)
- Noise ratio: 0.11 (must be <= 0.15, pass)
- Selector gate: pass (10/10 selected entries include selectors)
- Obligation binding gate: pass (10/10 selected entries include obligationRefs)

## Blockers

- None. All obligations from `TASK-AEO-C1-04.md` were covered by explicit task-scoped sources.
