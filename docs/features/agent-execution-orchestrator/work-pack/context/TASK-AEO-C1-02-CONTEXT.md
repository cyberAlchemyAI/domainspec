# Context Pack: TASK-AEO-C1-02

## Build Metadata

- Task: TASK-AEO-C1-02
- Feature: agent-execution-orchestrator
- Generated at: 2026-05-11T17:10:53Z
- Mode: standard
- Strict relevance: enabled
- Emit: markdown + index-json
- Source task: ../tasks/TASK-AEO-C1-02.md

## Framework Constraints Applied

- 2.0.10: terminal hardening requires guard-first handling for risky command paths and bounded search behavior.
- 2.0.9: delegated stage runs must reconcile started rows with terminal outcomes.
- 2.0.8: delegated telemetry must carry profile, thinking budget, suspected-stuck, retry, and duration fields.
- 2.0.4: context selection requires selector-level evidence, obligation binding, interested-data subsets, and noise budget enforcement.

## Obligation Matrix

| Obligation Ref | Requirement                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| OBL-C1-02-01   | Define prompt-builder input contract: stage contracts, `selectionPolicy`, ordered `selectedStages`, context refs, and decision snapshot pointer. |
| OBL-C1-02-02   | Define prompt-builder output contract: ordered prompt artifact set compliant with C1-01 schema and keyed by `stageRunId`.                        |
| OBL-C1-02-03   | Preserve determinism: identical selected stage set + identical inputs must yield identical normalized prompt artifacts.                          |
| OBL-C1-02-04   | Enforce stage-subset semantics: non-empty, distinct, ordered selected set constrained by declared stage contracts.                               |
| OBL-C1-02-05   | Define failure boundaries for missing stage inputs and invalid stage subset selection.                                                           |
| OBL-C1-02-06   | Bind explicit prompt-build step and ordering expectations to route assembly/runtime workflow semantics.                                          |
| OBL-C1-02-07   | Run and record decision preflight snapshot before implementation work begins.                                                                    |
| OBL-C1-02-08   | Preserve capability-sequence lesson capture obligations for this task.                                                                           |
| OBL-C1-02-09   | Keep verification evidence scoped to deterministic builder terms (`selectedStages`, `selectionPolicy`, `build`, `prompt`, `deterministic`).      |
| OBL-C1-02-10   | Apply strict context-builder contract (`selected[].selectors`, `selected[].obligationRefs`, `interestedData`).                                   |

## Candidate Ranking

Scoring formula applied per candidate:

`score = (1 - signal) * 0.45 + cost * 0.30 + ambiguity * 0.25`

Lower score indicates higher inclusion priority.

## Selected Evidence (Strict, 11 Files)

### S01 - Task contract seed

- Source: ../tasks/TASK-AEO-C1-02.md
- Selectors: `## Goal` (line 3), `## Capability Slice` (line 27), `## DomainSpec Coverage` (line 35), `## Implementation Directives` (line 45), `## Completion Criteria` (line 73), `## Verification Evidence` (line 80)
- ObligationRefs: OBL-C1-02-01, OBL-C1-02-02, OBL-C1-02-03, OBL-C1-02-04, OBL-C1-02-05, OBL-C1-02-06, OBL-C1-02-07, OBL-C1-02-08, OBL-C1-02-09
- Why included: primary obligations and explicit seed links.
- Excerpt:

> "Builder input | Stage contracts, `selectionPolicy`, `selectedStages`, context refs, and decision snapshot pointer"
>
> "Builder output | Ordered prompt artifact set compliant with Task C1-01 schema and keyed by `stageRunId`"

### S02 - Prerequisite contract carry-forward

- Source: ../tasks/TASK-AEO-C1-01.md
- Selectors: `## Capability Slice` (line 21), `## DomainSpec Coverage` (line 29), `## Implementation Directives` (line 37), `## Completion Criteria` (line 44), `## Decision Lock` (line 57)
- ObligationRefs: OBL-C1-02-02, OBL-C1-02-03
- Why included: C1-02 output must remain compliant with the schema and determinism baseline established by C1-01.
- Excerpt:

> "Prompt schema | Required prompt fields, type constraints, and validation rules"
>
> "Determinism | Prompt output must be reproducible from the same stage contract and context"

### S03 - Route assembly and builder semantics

- Source: ../../operations.md
- Selectors: `## AssemblePipelineRoute` (line 10), `### Input` (line 31), `### Prompt Artifact Examples (C1 Baseline)` (line 78), `### Prompt Artifact Normalization (Deterministic Ordering)` (line 141), `### Rules` (line 148), `### Error States` (line 170)
- ObligationRefs: OBL-C1-02-01, OBL-C1-02-02, OBL-C1-02-04, OBL-C1-02-05, OBL-C1-02-06
- Why included: canonical input/output fields, normalization behavior, stage-subset rules, and failure states.
- Excerpt:

> "selectedStages ... Ordered selected stage set when `selectionPolicy=stage-subset`"
>
> "Stage-subset selection must be ordered and non-empty"
>
> "Reject with `ROUTE_STAGE_SELECTION_INVALID`"

### S04 - Domain entities and value objects

- Source: ../../domain.md
- Selectors: `### PipelineRouteTemplate` (line 29), `### StageContract` (line 75)
- ObligationRefs: OBL-C1-02-01, OBL-C1-02-04, OBL-C1-02-06
- Why included: authoritative route-template and stage-contract field semantics.
- Excerpt:

> "stageContracts ... Ordered stage contracts for this route template"
>
> "selectedStages ... Ordered stage set selected for this route (can be subset)"

### S05 - Rule-level determinism and validation

- Source: ../../rules.md
- Selectors: `## StageSelectionContract` (line 147), `## PromptArtifactSchemaRequired` (line 266), `## PromptArtifactDeterminism` (line 285), `### Normalization Requirements` (line 294)
- ObligationRefs: OBL-C1-02-02, OBL-C1-02-03, OBL-C1-02-04, OBL-C1-02-05
- Why included: formal stage-subset constraints, required prompt fields, and deterministic normalization invariants.
- Excerpt:

> "selectionPolicy=stage-subset -> length(selectedStages)>=1 and distinct(selectedStages) and selectedStages subsetOf stageContracts.stage"
>
> "same(stageContract, stageInputRefs, requiredArtifactRefs, decisionSnapshotRef) -> same(normalizedPromptArtifact)"

### S06 - Interface-level prompt artifact contract

- Source: ../../interfaces.md
- Selectors: `## Internal: RouteArtifactInterface` (line 9), `### Prompt Artifact Schema (C1 Baseline)` (line 27), `### Prompt Artifact Validation Cases (C1 Baseline)` (line 62)
- ObligationRefs: OBL-C1-02-01, OBL-C1-02-02, OBL-C1-02-05, OBL-C1-02-06
- Why included: builder-facing schema contract and validation outcomes (`PA-VALID-01`, `PA-INVALID-01`, `PA-INVALID-02`).
- Excerpt:

> "validatePromptArtifact ... PASS/FAIL with validation reasons"
>
> "`stageRunId` ... Non-empty and unique per stage attempt"

### S07 - Stage order execution anchor

- Source: ../../workflows.md
- Selectors: `## FeatureLifecyclePipelineWorkflow` (line 10), step-table row "Resolve selected stage set and order" (line 41), invariant `I-WF-1` (line 104)
- ObligationRefs: OBL-C1-02-04, OBL-C1-02-06
- Why included: execution-order contract tying route assembly to deterministic stage progression.
- Excerpt:

> "Resolve selected stage set and order ... Ordered selected stages available"
>
> "Route execution order follows StageContract sequence"

### S08 - Decision preflight contract

- Source: grill-with-docs-interviewer-inventory.md
- Selectors: `### Decision Preflight Inputs` (line 41), `### Decision Preflight Questions (Minimum Set)` (line 49), `### Exit Conditions Before Task Execution` (line 57), `### Output Artifact Contract` (line 64), `## Initial Adoption Scope` (line 73)
- ObligationRefs: OBL-C1-02-07
- Why included: explicit pre-implementation interview gate and required "Decision Preflight Snapshot" output.
- Excerpt:

> "Use this as a decision preflight before each C1 task execution"
>
> "For each task, append a short 'Decision Preflight Snapshot' section"

### S09 - Lesson continuity contract

- Source: capability-sequence-lessons.md
- Selectors: `## Capability 1 Entries` (line 18), row for `TASK-AEO-C1-02` (line 23)
- ObligationRefs: OBL-C1-02-08
- Why included: required lesson-entry behavior and reuse contract for post-task closure.
- Excerpt:

> "Before executing each capability task, complete a one-question-at-a-time decision preflight"

### S10 - Feature graph edge authority

- Source: ../../SPEC.md
- Selectors: domain concept row for `PipelineRouteTemplate` (line 116), `## Feature Concept Graph` (line 164), `AssemblePipelineRoute | enforces | StageContract` edge (line 170), `PipelineRouteTemplate | contains | StageContract` edge (line 171), `RouteArtifactInterface | exposes | AssemblePipelineRoute` edge (line 175)
- ObligationRefs: OBL-C1-02-01, OBL-C1-02-04, OBL-C1-02-06, OBL-C1-02-10
- Why included: exact relationship-edge subset for route-template, stage-contract, and interface exposure obligations.
- Excerpt:

> "PipelineRouteTemplate ... Supports full lifecycle or ordered stage-subset selection"
>
> "AssemblePipelineRoute ... enforces ... StageContract"

### S11 - Framework hard constraints for this mode

- Source: ../../../../../domainspec/CHANGELOG.md
- Selectors: `## [2.0.10]` (line 26), `## [2.0.9]` (line 37), `## [2.0.8]` (line 48), `## [2.0.4]` (line 85)
- ObligationRefs: OBL-C1-02-10
- Why included: mandatory context-builder strict-gate and telemetry/terminal invariants that constrain artifact construction.
- Excerpt:

> "context selection now requires selector-level evidence and obligation binding"
>
> "output index now requires `selected[].selectors`, `selected[].obligationRefs`, and `interestedData` subsets"

## Architecture Retrieval Map Resolution

- Explicit architecture references are not declared in `TASK-AEO-C1-02.md` coverage table or directives.
- No uncovered C1-02 obligation required expansion into `architecture/ARCHITECTURE.md` or `architecture/pattern-library/*`.
- Architecture expansion was therefore excluded by strict gate (`no obligationRef -> exclude`).

## Interested Data Subsets

### Feature Graph Edge Subset (SPEC-scoped)

Only edge labels needed for prompt-builder obligations were retained.

| From                                                | Edge     | To                                                 | Evidence                        |
| --------------------------------------------------- | -------- | -------------------------------------------------- | ------------------------------- |
| agent-execution-orchestrator.AssemblePipelineRoute  | enforces | agent-execution-orchestrator.StageContract         | SPEC `## Feature Concept Graph` |
| agent-execution-orchestrator.PipelineRouteTemplate  | contains | agent-execution-orchestrator.StageContract         | SPEC `## Feature Concept Graph` |
| agent-execution-orchestrator.RouteArtifactInterface | exposes  | agent-execution-orchestrator.AssemblePipelineRoute | SPEC `## Feature Concept Graph` |

### Prompt Builder Field Subset

| Contract Element   | Required Subset                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Builder input      | `stageContracts`, `selectedStages`, `selectionPolicy`, `stageInputRefs`, `decisionSnapshotRef` |
| Builder output     | ordered prompt artifacts keyed by `stageRunId`                                                 |
| Determinism        | canonical key ordering + sorted refs + ISO-8601 UTC timestamp                                  |
| Failure boundaries | `ROUTE_STAGE_SELECTION_INVALID`, missing `stageRunId`, empty `stageInputRefs`                  |

## Excluded Candidates (Strict)

| Candidate                                                         | Exclusion Reason                                                                                                      |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ../../WORK-PACK.md                                                | Planning manifest is derivative for C1-02 context; task + prerequisite + aspect docs already satisfy all obligations. |
| ../../observability.md                                            | No direct C1-02 obligation references observability mappings for prompt-builder semantics.                            |
| ../../../../../architecture/ARCHITECTURE.md                       | No explicit architecture retrieval-map obligation for C1-02; inclusion would violate strict relevance gate.           |
| ../../../../../architecture/pattern-library/\*_/_.md              | Excluded for same reason as above (`no obligationRef`).                                                               |
| ../../../../../docs/index/feature-map.md and index json artifacts | Expansion was unnecessary because explicit task links fully covered all obligations.                                  |

## Budget And Strict Gate Check

- Selected files: 11 / 14 (standard budget pass)
- Excerpt lines: 163 / 280 (standard budget pass)
- Noise ratio: 0.11 (must be <= 0.15, pass)
- Selector gate: pass (11/11 selected entries include selectors)
- Obligation binding gate: pass (11/11 selected entries include obligationRefs)

## Blockers

- None. All obligations from `TASK-AEO-C1-02.md` were covered by explicit task-scoped sources.
