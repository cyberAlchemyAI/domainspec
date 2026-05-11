# Operations: Agent Execution Orchestrator

## Capability Backlinks

- [Explicit Pipeline Route Composition](SPEC.md#explicit-pipeline-route-composition)
- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)
- [Policy-Governed Branch and Cancellation Control](SPEC.md#policy-governed-branch-and-cancellation-control)
- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## AssemblePipelineRoute

**Type:** Operation (mutation)
**Actor:** DomainSpec operator
**Triggers:** New route artifact request or route update request

Builds a deterministic route from an ordered DomainSpec skill chain. The operator chooses a pipeline intent (for example kickoff, docs-only bootstrap, bugfix, stage-subset composition, or full feature delivery), maps that intent to a `domainspec-*` sequence, and validates each stage contract before publishing the route artifact.

### Skill-Chain Profiles

| Profile                      | Ordered Skills                                                                                                                                                                                      | Stage Contract Focus                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Kickoff baseline             | `domainspec-start`                                                                                                                                                                                  | Scope gate, baseline decisions, readiness profile     |
| Docs bootstrap               | `domainspec-init`                                                                                                                                                                                   | Artifact structure, includes/dependencies integrity   |
| Context-first implementation | `domainspec-context-builder -> domainspec-implement -> domainspec-tag-code -> domainspec-audit-alignment -> domainspec-audit-layering -> domainspec-verify-feature`                                 | Mutation closure with tag/audit/verify evidence       |
| Bugfix controlled pipeline   | `domainspec-plan-phase-bridge -> domainspec-context-builder -> domainspec-implement -> domainspec-tag-code -> domainspec-audit-alignment -> domainspec-audit-layering -> domainspec-verify-feature` | Task bootstrap + deterministic mutation closure trail |
| Selective stage-set pipeline | Operator-selected `domainspec-*` chain aligned to chosen stage subset (for example `plan -> spec -> tests`)                                                                                         | Targeted lifecycle slice with explicit stage ordering |
| Full feature delivery        | `domainspec-pipeline`                                                                                                                                                                               | End-to-end governed lifecycle in one pipeline command |

Docs-only slices keep the route mutation-safe by deferring mutation-only closure skills and satisfying governance obligations via signal emission until mutation stages begin.

### Input

| Field             | Type                                                     | Required | Description                                                                                                                                                                                  |
| ----------------- | -------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pipelineId        | string                                                   | yes      | Target [ExecutionPipeline](domain.md#executionpipeline).pipelineId                                                                                                                           |
| template          | [PipelineRouteTemplate](domain.md#pipelineroutetemplate) | yes      | Candidate route template                                                                                                                                                                     |
| requestedBy       | string                                                   | yes      | Operator identity                                                                                                                                                                            |
| capabilityScope   | string[]                                                 | yes      | Capability names covered by this route                                                                                                                                                       |
| selectedStages    | [StageType](domain.md#stagetype)[]                       | no       | Ordered selected stage set when `selectionPolicy=stage-subset`                                                                                                                               |
| selectionPolicy   | string                                                   | no       | `full-lifecycle` or `stage-subset`                                                                                                                                                           |
| promptBuildInputs | object                                                   | yes      | Stage-scoped prompt build bundle (`stageInputRefsByStage`, `requiredArtifactRefsByStage`, `stageRunIdsByStage`, `handoffArtifactRefsByStagePair`, `decisionSnapshotRef`, `createdAtByStage`) |

### Prompt Builder Build Step Contract

The prompt builder step runs after stage selection and before any stage execution record starts.

#### Build Input Contract

| Field                            | Type                                       | Required | Constraint                                                                                                                                        |
| -------------------------------- | ------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selectionPolicy`                | string                                     | yes      | Must be `full-lifecycle` or `stage-subset`                                                                                                        |
| `selectedStages`                 | [StageType](domain.md#stagetype)[]         | yes      | Non-empty, distinct, and order-preserving subset of `template.stageContracts.stage` when `selectionPolicy=stage-subset`                           |
| `stageContracts`                 | [StageContract](domain.md#stagecontract)[] | yes      | Ordered contracts from [PipelineRouteTemplate](domain.md#pipelineroutetemplate)                                                                   |
| `stageInputRefsByStage`          | object                                     | yes      | Every selected stage has `length(refs)>=1`                                                                                                        |
| `requiredArtifactRefsByStage`    | object                                     | yes      | Every selected stage has `length(refs)>=1`                                                                                                        |
| `stageRunIdsByStage`             | object                                     | yes      | Every selected stage maps to one non-empty `stageRunId`                                                                                           |
| `handoffArtifactRefsByStagePair` | object                                     | yes      | For each consecutive selected-stage pair key `<stageN>-><stageN+1>`, `length(refs)>=1` and refs are a subset of `stageInputRefsByStage[stageN+1]` |
| `decisionSnapshotRef`            | string                                     | yes      | Non-empty pointer to decision preflight/result evidence                                                                                           |
| `createdAtByStage`               | object                                     | yes      | Every selected stage maps to ISO-8601 UTC timestamp                                                                                               |

#### Build Output Contract

| Field                         | Type                               | Required | Constraint                                                  |
| ----------------------------- | ---------------------------------- | -------- | ----------------------------------------------------------- |
| `promptArtifacts`             | object[]                           | yes      | Ordered exactly as `selectedStages`                         |
| `promptArtifactsByStageRunId` | object                             | yes      | Keys match `stageRunIdsByStage` exactly                     |
| `buildOrder`                  | [StageType](domain.md#stagetype)[] | yes      | Equal to `selectedStages`                                   |
| `promptArtifactSetHash`       | string                             | yes      | Deterministic hash over normalized ordered prompt artifacts |

### Deterministic Reproducibility Check

Multi-stage reproducibility must be checked before execution. For one selected set (for example `spec -> tests -> implementation`), two independent prompt builds with identical inputs must produce the same `promptArtifactSetHash`.

Formal:

`same(selectionPolicy, selectedStages, stageContracts, stageInputRefsByStage, requiredArtifactRefsByStage, stageRunIdsByStage, handoffArtifactRefsByStagePair, decisionSnapshotRef, createdAtByStage) -> same(promptArtifactSetHash)`

### Prompt Artifact Examples (C1 Baseline)

Prompt artifacts are constructed from stage contracts and must carry explicit `stageRunId`, stage type, and required input references before runner execution.

Valid payload (`PA-VALID-01`):

```json
{
  "promptVersion": "1.0.0",
  "pipelineId": "agent-execution-orchestrator",
  "templateId": "route-template-v1",
  "stageRunId": "aeo-c1-stage-0001",
  "stage": "implementation",
  "stageInputRefs": [
    "work-pack/tasks/TASK-AEO-C1-01.md",
    "work-pack/capabilities/CAP-AEO-C1-PIPELINE-EXECUTION.md"
  ],
  "requiredArtifactRefs": [
    "docs/signals/delegation-tuning.jsonl",
    "docs/signals/terminal-guard.jsonl"
  ],
  "decisionSnapshotRef": "docs/features/agent-execution-orchestrator/WORK-PACK.md#resolved-decision-gate",
  "createdAt": "2026-05-10T00:00:00Z"
}
```

Invalid payload (`PA-INVALID-01`, missing `stageRunId`):

```json
{
  "promptVersion": "1.0.0",
  "pipelineId": "agent-execution-orchestrator",
  "templateId": "route-template-v1",
  "stage": "implementation",
  "stageInputRefs": ["work-pack/tasks/TASK-AEO-C1-01.md"],
  "requiredArtifactRefs": ["docs/signals/delegation-tuning.jsonl"],
  "decisionSnapshotRef": "docs/features/agent-execution-orchestrator/WORK-PACK.md#resolved-decision-gate",
  "createdAt": "2026-05-10T00:00:00Z"
}
```

Invalid payload (`PA-INVALID-02`, empty `stageInputRefs`):

```json
{
  "promptVersion": "1.0.0",
  "pipelineId": "agent-execution-orchestrator",
  "templateId": "route-template-v1",
  "stageRunId": "aeo-c1-stage-0002",
  "stage": "implementation",
  "stageInputRefs": [],
  "requiredArtifactRefs": ["docs/signals/delegation-tuning.jsonl"],
  "decisionSnapshotRef": "docs/features/agent-execution-orchestrator/WORK-PACK.md#resolved-decision-gate",
  "createdAt": "2026-05-10T00:00:00Z"
}
```

### Prompt Artifact Normalization (Deterministic Ordering)

1. Serialize object keys in lexical order.
2. Normalize `stageInputRefs` and `requiredArtifactRefs` arrays in ascending lexical order.
3. Preserve canonical ISO-8601 UTC timestamps for `createdAt`.
4. Reject payloads that require lossy normalization (for example missing required fields).

### Rules

| ID  | Rule                                                              | Formal                                                                                   |
| --- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| R1  | Mandatory stages are required for the selected route profile      | `forall s in mandatoryCoverage, exists stageContracts.stage = s`                         |
| R2  | Stage contracts are unique by [StageType](domain.md#stagetype)    | `distinct(stageContracts.stage)`                                                         |
| R3  | Stage contract evidence obligations must be complete              | `forall c in stageContracts, c.requiredArtifacts != empty`                               |
| R4  | Feature-path mutation requires planner gate pass                  | See [PlannerGateBeforeFeatureMutation](rules.md#plannergatebeforefeaturemutation)        |
| R5  | Stage-subset selection must be ordered and non-empty              | `selectionPolicy=stage-subset -> length(selectedStages)>=1 and distinct(selectedStages)` |
| R6  | Stage-subset selection must map to declared stage contracts       | `forall s in selectedStages, exists c in stageContracts where c.stage=s`                 |
| R7  | Prompt build step is mandatory before stage execution starts      | See [PromptBuildStepContract](rules.md#promptbuildstepcontract)                          |
| R8  | Prompt artifact set must pass deterministic reproducibility check | See [PromptArtifactDeterminism](rules.md#promptartifactdeterminism)                      |

### State Transition

[ExecutionPipeline](domain.md#executionpipeline): `route-draft -> route-ready`

### Postconditions

- [ExecutionPipeline](domain.md#executionpipeline).routeTemplate is updated to the validated [PipelineRouteTemplate](domain.md#pipelineroutetemplate).
- [RouteArtifactInterface](interfaces.md#internal-routeartifactinterface) can expose the route artifact for prompt contexts.

### Error States

| Condition                                | Result                                          |
| ---------------------------------------- | ----------------------------------------------- |
| Missing mandatory stage                  | Reject with `ROUTE_STAGE_MISSING`               |
| Duplicate stage contract                 | Reject with `ROUTE_STAGE_DUPLICATE`             |
| Missing planner gate pass                | Reject with `PLANNER_GATE_REQUIRED`             |
| Invalid stage subset                     | Reject with `ROUTE_STAGE_SELECTION_INVALID`     |
| Missing prompt build input bundle        | Reject with `PROMPT_BUILD_INPUTS_REQUIRED`      |
| Missing selected-stage input refs        | Reject with `PROMPT_STAGE_INPUT_MISSING`        |
| Missing selected-stage run id            | Reject with `PROMPT_STAGE_RUN_ID_MISSING`       |
| Prompt artifact set order/count mismatch | Reject with `PROMPT_ARTIFACT_SET_INVALID`       |
| Prompt artifact reproducibility mismatch | Reject with `PROMPT_ARTIFACT_NON_DETERMINISTIC` |

---

## ExecutePipelineRoute

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Execute request against route template

### Input

| Field                | Type                                         | Required | Description                                                                                                                          |
| -------------------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| runId                | string                                       | yes      | New [ExecutionRun](domain.md#executionrun).runId                                                                                     |
| parentRunId          | string                                       | no       | Present only when executing a stage as isolated child run                                                                            |
| pipelineId           | string                                       | yes      | Source [ExecutionPipeline](domain.md#executionpipeline).pipelineId                                                                   |
| templateId           | string                                       | yes      | Source [PipelineRouteTemplate](domain.md#pipelineroutetemplate).templateId                                                           |
| provider             | [ProviderAdapter](domain.md#provideradapter) | yes      | Provider baseline (`sandcastle` for MVP)                                                                                             |
| branchStrategy       | [BranchStrategy](domain.md#branchstrategy)   | no       | Strategy override; default resolved by [BranchStrategyPolicy](rules.md#branchstrategypolicy)                                         |
| executionProfile     | string                                       | yes      | Watchdog profile (`quick`, `standard`, `deep`) used for timeout budgets and retry narrowing                                          |
| stagePromptArtifacts | object[]                                     | yes      | Ordered prompt artifacts from build step; order must match selected stages and each artifact must include `stageRunId`               |
| stageInputs          | object                                       | yes      | Stage-scoped execution inputs including `stageInputRefsByStage`, `requiredArtifactRefsByStage`, and `handoffArtifactRefsByStagePair` |

### Output

| Field                       | Type                                         | Required | Description                                                                   |
| --------------------------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| stageExecutions             | [StageExecution](domain.md#stageexecution)[] | yes      | Ordered stage execution records with terminal outcomes                        |
| terminalOutcomeByStageRunId | object                                       | yes      | Map `stageRunId -> terminal outcome` for all started stages                   |
| parentRunState              | [RunState](domain.md#runstate)               | yes      | Terminal parent run state (`completed`, `blocked`, `failed`, or `canceled`)   |
| parentTerminalOutcome       | [TerminalOutcome](domain.md#terminaloutcome) | yes      | Deterministic parent terminal outcome derived from stage terminal outcomes    |
| childRunIdsByStageRunId     | object                                       | no       | Present for isolated stages; maps parent `stageRunId` to spawned `childRunId` |

### Rules

| ID  | Rule                                                                                   | Formal                                                                                                                                                                              |
| --- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Provider adapter must satisfy MVP baseline                                             | `provider = sandcastle OR provider in approvedExtensionSet`                                                                                                                         |
| R2  | Every stage run must publish telemetry pair                                            | See [TelemetryPairRequired](rules.md#telemetrypairrequired)                                                                                                                         |
| R3  | Run must terminate with explicit outcome                                               | See [TerminalOutcomeRequired](rules.md#terminaloutcomerequired)                                                                                                                     |
| R4  | Retry attempts are bounded and narrowed                                                | See [RetryPolicy](rules.md#retrypolicy)                                                                                                                                             |
| R5  | Superseded active runs follow latest-run-wins cancellation                             | See [CancellationPolicy](rules.md#cancellationpolicy)                                                                                                                               |
| R6  | Parent run tracks one [StageExecution](domain.md#stageexecution) per selected stage    | `forall stage in selectedStages, exists stageExecution where stageExecution.stage=stage`                                                                                            |
| R7  | Isolated stages execute as child runs and report back to parent stage execution record | `stageExecution.isolationMode=isolated-child-run -> childRunId != null and parentRunId != null`                                                                                     |
| R8  | Stage execution identity is bound to ordered prompt artifacts                          | `forall i in [0..n-1], stageExecutions[i].stageRunId = stagePromptArtifacts[i].stageRunId and stageExecutions[i].order=i`                                                           |
| R9  | Watchdog boundary drives bounded retry and blocked terminal outcome                    | `elapsedMs > watchdogBudget(executionProfile) -> suspectedStuck=true and (retryCount < maxRetries -> state=waiting-retry) and (retryCount = maxRetries -> terminalOutcome=blocked)` |
| R10 | Isolated child runs must reconcile terminal outcomes to parent stage records           | `stageExecution.isolationMode=isolated-child-run -> childRun.parentRunId=runId and stageExecution.terminalOutcome=childRun.terminalOutcome`                                         |
| R11 | Consecutive stage handoff refs must satisfy next-stage required artifact refs          | `forall i in [0..n-2], requiredArtifactRefsByStage[selectedStages[i+1]] subsetOf handoffArtifactRefsByStagePair[selectedStages[i] + "->" + selectedStages[i+1]]`                    |

### Calculations

| ID  | Calculation                     | Formula                                                                                                                                                           |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | Stage completion duration       | `durationMs = terminalTimestamp - startedTimestamp`                                                                                                               |
| C2  | Stuck flag decision             | `suspectedStuck = elapsed > watchdogBudget(executionProfile)`                                                                                                     |
| C3  | Parent terminal outcome mapping | `parentTerminalOutcome = if any(stageOutcome=failed) failed else if any(stageOutcome=blocked) blocked else if any(stageOutcome=canceled) canceled else completed` |

### Controlled Single Selected-Stage Parent-Run Scenario (C1-04)

This controlled single selected-stage path executes one selected stage in one parent run and preserves C1-03 identity/topology semantics (`stageRunId` continuity and ordered [StageExecution](domain.md#stageexecution) records).

#### Scenario Input Contract

| Field                  | Value                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `selectionPolicy`      | `stage-subset`                                                                         |
| `selectedStages`       | `[implementation]`                                                                     |
| `runId`                | `aeo-c1-04-parent-0001`                                                                |
| `stagePromptArtifacts` | One ordered artifact where `stagePromptArtifacts[0].stageRunId = aeo-c1-04-stage-0001` |
| `stageInputs`          | Exactly one stage-scoped input bundle for `implementation`                             |

#### Stage and Parent Terminal Mapping

| Stage terminal outcome (`aeo-c1-04-stage-0001`) | Parent run state | Parent terminal outcome |
| ----------------------------------------------- | ---------------- | ----------------------- |
| `completed`                                     | `completed`      | `completed`             |
| `blocked`                                       | `blocked`        | `blocked`               |
| `failed`                                        | `failed`         | `failed`                |
| `canceled`                                      | `canceled`       | `canceled`              |

#### Evidence References

| Evidence Type                       | Reference                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Prompt artifact reference           | `stagePromptArtifacts[0]` keyed by `stageRunId=aeo-c1-04-stage-0001`                                             |
| Stage execution record reference    | `stageExecutions[0]` and parent [ExecutionRun](domain.md#executionrun).`stageRuns[0]` with the same `stageRunId` |
| Run output classification reference | `terminalOutcomeByStageRunId["aeo-c1-04-stage-0001"]`, `parentRunState`, `parentTerminalOutcome`                 |

#### Error Boundary Classification

| Condition                                         | Single-stage classification                                            |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `PROVIDER_UNAVAILABLE`                            | Terminal `failed` for parent run with stage context                    |
| `TERMINAL_OUTCOME_MISSING`                        | Terminal `failed` for parent run because stage terminal row is missing |
| Retry budget exhausted (`RETRY_BUDGET_EXHAUSTED`) | Terminal `blocked` for parent run with remediation                     |

### Stage-Subset Chaining and Handoff Scenario (C1-05)

This chained selected-stage path extends C1-04 from one stage to three ordered stages and requires deterministic handoff artifacts for every consecutive pair.

#### Scenario Input Contract

| Field                                     | Value                                                                                                                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selectionPolicy`                         | `stage-subset`                                                                                                                                                                    |
| `selectedStages`                          | `[plan, spec, tests]`                                                                                                                                                             |
| `runId`                                   | `aeo-c1-05-parent-0001`                                                                                                                                                           |
| `stagePromptArtifacts`                    | Three ordered artifacts with `stageRunId` values `[aeo-c1-05-plan-0001, aeo-c1-05-spec-0001, aeo-c1-05-tests-0001]`                                                               |
| `stageInputs.stageInputRefsByStage.spec`  | Includes `docs/features/agent-execution-orchestrator/workflows.md#featurelifecyclepipelineworkflow`, `docs/features/agent-execution-orchestrator/rules.md#stageselectioncontract` |
| `stageInputs.stageInputRefsByStage.tests` | Includes `docs/features/agent-execution-orchestrator/SPEC.md#concept-registry`, `docs/features/agent-execution-orchestrator/domain.md#stageexecution`                             |

#### Consecutive Stage Handoff Fields

| Stage pair      | `fromStageRunId`      | `toStageRunId`         | `handoffArtifactRefsByStagePair` key | Expected handoff artifact refs                                                                                                                                           |
| --------------- | --------------------- | ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `plan -> spec`  | `aeo-c1-05-plan-0001` | `aeo-c1-05-spec-0001`  | `plan->spec`                         | `docs/features/agent-execution-orchestrator/workflows.md#featurelifecyclepipelineworkflow`, `docs/features/agent-execution-orchestrator/rules.md#stageselectioncontract` |
| `spec -> tests` | `aeo-c1-05-spec-0001` | `aeo-c1-05-tests-0001` | `spec->tests`                        | `docs/features/agent-execution-orchestrator/SPEC.md#concept-registry`, `docs/features/agent-execution-orchestrator/domain.md#stageexecution`                             |

#### Handoff Mismatch Classification

| Condition                                                                                                              | Stage classification                                   | Parent run classification | Remediation hook                                                              |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------- | ----------------------------------------------------------------------------- |
| `requiredArtifactRefsByStage[nextStage]` is not satisfied by `handoffArtifactRefsByStagePair[currentStage->nextStage]` | `blocked` with reason `STAGE_HANDOFF_INPUT_UNRESOLVED` | `blocked`                 | Regenerate stage N output artifacts and rebuild prompt artifacts before retry |
| Consecutive stage topology mismatch (`stageRunId`/order mismatch for `currentStage -> nextStage`)                      | `failed` with reason `STAGE_HANDOFF_TOPOLOGY_MISMATCH` | `failed`                  | Stop run, repair ordered stage topology, and re-run route assembly            |

#### Evidence References

| Evidence Type                     | Reference                                                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Ordered prompt artifacts          | `stagePromptArtifacts[0..2]` keyed by `stageRunId` values `aeo-c1-05-plan-0001`, `aeo-c1-05-spec-0001`, `aeo-c1-05-tests-0001`     |
| Ordered stage execution records   | `stageExecutions[0..2]` and parent [ExecutionRun](domain.md#executionrun).`stageRuns[0..2]` with matching `stageRunId` and `order` |
| Handoff artifact mapping          | `stageInputs.handoffArtifactRefsByStagePair["plan->spec"]`, `stageInputs.handoffArtifactRefsByStagePair["spec->tests"]`            |
| Parent/run classification mapping | `terminalOutcomeByStageRunId`, `parentRunState`, `parentTerminalOutcome`                                                           |

### Failure, Retry, Supersession, and Isolated Reconciliation Scenario (C1-06)

This recovery-focused scenario extends C1-05 with one forced failure branch, one supersession branch, and one isolated-stage failure branch.

#### Scenario Input Contract

| Field                                                                   | Value                       |
| ----------------------------------------------------------------------- | --------------------------- |
| `selectionPolicy`                                                       | `stage-subset`              |
| `selectedStages`                                                        | `[implementation, verify]`  |
| Forced-failure branch parent run                                        | `aeo-c1-06-ff-parent-0001`  |
| Forced-failure branch stage run                                         | `aeo-c1-06-ff-impl-0001`    |
| Supersession branch superseded run                                      | `aeo-c1-06-ss-parent-0001`  |
| Supersession branch winning run                                         | `aeo-c1-06-ss-parent-0002`  |
| Supersession branch active stage run                                    | `aeo-c1-06-ss-impl-0001`    |
| Isolation branch parent run                                             | `aeo-c1-06-iso-parent-0001` |
| Isolation branch stage run                                              | `aeo-c1-06-iso-impl-0001`   |
| Isolation branch child run                                              | `aeo-c1-06-iso-child-0001`  |
| `executionProfile`                                                      | `deep`                      |
| `retryPolicy.maxRetries`                                                | `1`                         |
| `retryPolicy.narrowingRequired`                                         | `true`                      |
| `stageExecution.isolationMode` (implementation stage, isolation branch) | `isolated-child-run`        |

#### Forced-Failure Branch With Bounded Retry

| Step             | Contract expectation                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Initial failure  | `aeo-c1-06-ff-impl-0001` enters `waiting-retry` after forced failure trigger with `suspectedStuck=true`                                          |
| Retry attempt    | One retry is allowed (`retryCount=1`) and must narrow scope (`narrowedScope=true`)                                                               |
| Retry exhaustion | A second failure after retry returns `terminalOutcomeByStageRunId["aeo-c1-06-ff-impl-0001"] = blocked` with remediation `RETRY_BUDGET_EXHAUSTED` |
| Parent mapping   | `parentRunState=blocked` and `parentTerminalOutcome=blocked`                                                                                     |

#### Supersession Branch (`latest-run-wins`)

| Step                   | Contract expectation                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| Trigger                | `aeo-c1-06-ss-parent-0002` starts after `aeo-c1-06-ss-parent-0001` for the same route scope              |
| Cancellation path      | [CancelSupersededRun](#cancelsupersededrun) sets `aeo-c1-06-ss-parent-0001` terminal state to `canceled` |
| Terminal telemetry     | Superseded run must emit terminal telemetry row with `outcome=canceled` for `aeo-c1-06-ss-impl-0001`     |
| Winning run continuity | `aeo-c1-06-ss-parent-0002` continues independently under normal execution rules                          |

#### Isolated-Stage Failure Reconciled to Parent Stage Record

| Step                        | Contract expectation                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Child-run failure           | `aeo-c1-06-iso-child-0001` reaches terminal `failed` for `implementation`                                                                |
| Parent stage reconciliation | Parent `stageExecutions` entry for `aeo-c1-06-iso-impl-0001` must set `childRunId=aeo-c1-06-iso-child-0001` and `terminalOutcome=failed` |
| Parent terminal mapping     | `terminalOutcomeByStageRunId["aeo-c1-06-iso-impl-0001"] = failed`, `parentRunState=failed`, and `parentTerminalOutcome=failed`           |

#### Recovery Branch Terminal Outcome Guarantees

| Branch                                    | Stage-level guarantee                                                     | Parent-level guarantee                 | Telemetry guarantee                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| Forced-failure + retry exhaustion         | `aeo-c1-06-ff-impl-0001 -> blocked`                                       | `aeo-c1-06-ff-parent-0001 -> blocked`  | One `started` row and one terminal row for `aeo-c1-06-ff-impl-0001`            |
| Supersession (`latest-run-wins`)          | `aeo-c1-06-ss-impl-0001 -> canceled`                                      | `aeo-c1-06-ss-parent-0001 -> canceled` | One `started` row and one terminal `canceled` row for `aeo-c1-06-ss-impl-0001` |
| Isolated child-run failure reconciliation | `aeo-c1-06-iso-impl-0001 -> failed` (equal to child run terminal outcome) | `aeo-c1-06-iso-parent-0001 -> failed`  | One `started` row and one terminal row for parent stage run and child run      |

All recovery branches above must satisfy [TerminalOutcomeRequired](rules.md#terminaloutcomerequired): each started `stageRunId` has one terminal outcome and the parent terminal outcome is reduced from stage terminal outcomes.

### State Transition

[ExecutionRun](domain.md#executionrun): `queued -> running -> completed|blocked|failed|canceled`

### Postconditions

- One [SandboxLease](domain.md#sandboxlease) and one [WorktreeLease](domain.md#worktreelease) are allocated and released deterministically.
- Parent [ExecutionRun](domain.md#executionrun) has ordered [StageExecution](domain.md#stageexecution) records for selected stages.
- Runner output includes stage-level terminal outcome mapping keyed by `stageRunId` and one deterministic parent terminal outcome.
- For `isolated-child-run`, child run linkage (`childRunId`, `parentRunId`) and terminal outcome are reconciled into parent [StageExecution](domain.md#stageexecution) before parent terminalization.
- Each stage execution has one `started` and one terminal row in [DelegationTelemetryLedgerInterface](interfaces.md#internal-delegationtelemetryledgerinterface).
- [TelemetryEnvelope](domain.md#telemetryenvelope) is complete for each terminal stage execution.

### Error States

| Condition                                                                                                                          | Result                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Provider contract unavailable                                                                                                      | Reject with `PROVIDER_UNAVAILABLE`                                                                  |
| Missing terminal outcome row                                                                                                       | Reject with `TERMINAL_OUTCOME_MISSING`                                                              |
| Watchdog budget exceeded and retry budget exhausted                                                                                | Return `blocked` with `stageRunId`, `stage`, and remediation `RETRY_BUDGET_EXHAUSTED`               |
| Stage runtime returned unrecoverable execution error                                                                               | Return `failed` with `stageRunId`, `stage`, and reason `STAGE_RUNTIME_FAILED`                       |
| Isolated child-run linkage or terminal outcome reconciliation mismatch                                                             | Return `failed` with `stageRunId`, `childRunId`, and reason `CHILD_RUN_RECONCILIATION_FAILED`       |
| Consecutive stage handoff artifact mismatch (`requiredArtifactRefsByStage[nextStage]` unresolved from previous stage handoff refs) | Return `blocked` with `stageRunId`, `nextStage`, and remediation `STAGE_HANDOFF_INPUT_UNRESOLVED`   |
| Consecutive stage handoff topology mismatch (`order` or `stageRunId` continuity mismatch)                                          | Return `failed` with `fromStageRunId`, `toStageRunId`, and reason `STAGE_HANDOFF_TOPOLOGY_MISMATCH` |

---

## ResumeExecutionRun

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Resume request for interrupted run

### Input

| Field       | Type                                         | Required | Description                                         |
| ----------- | -------------------------------------------- | -------- | --------------------------------------------------- |
| runId       | string                                       | yes      | Target [ExecutionRun](domain.md#executionrun).runId |
| snapshot    | [SessionSnapshot](domain.md#sessionsnapshot) | yes      | Captured resume payload                             |
| requestedBy | string                                       | yes      | Operator or runtime identity                        |

### Rules

| ID  | Rule                                               | Formal                                                                         |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| R1  | Snapshot must match run identity and stage         | `snapshot.runId = runId`                                                       |
| R2  | Snapshot schema must be complete for resume        | `required(snapshot.cwd, snapshot.terminalSessionId, snapshot.snapshotVersion)` |
| R3  | Resume cannot bypass terminal evidence obligations | See [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum)                |

### State Transition

[ExecutionRun](domain.md#executionrun): `running|waiting-retry -> resuming -> running|completed|blocked|failed|canceled`

### Postconditions

- Resume path either reaches a terminal state or returns deterministic blocked remediation.
- Resume attempt and outcome are appended to [TelemetryEnvelope](domain.md#telemetryenvelope).

### Error States

| Condition                        | Result                                     |
| -------------------------------- | ------------------------------------------ |
| Snapshot missing required fields | Reject with `SNAPSHOT_INCOMPLETE`          |
| Snapshot version incompatible    | Reject with `SNAPSHOT_VERSION_UNSUPPORTED` |

---

## CancelSupersededRun

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Newer run supersedes active run for same route scope

### Input

| Field           | Type   | Required | Description                                             |
| --------------- | ------ | -------- | ------------------------------------------------------- |
| supersededRunId | string | yes      | Previous [ExecutionRun](domain.md#executionrun).runId   |
| winningRunId    | string | yes      | New active [ExecutionRun](domain.md#executionrun).runId |
| reason          | string | yes      | Cancellation rationale                                  |

### Rules

| ID  | Rule                                             | Formal                                                         |
| --- | ------------------------------------------------ | -------------------------------------------------------------- |
| R1  | Newest run has precedence                        | `startedAt(winningRunId) > startedAt(supersededRunId)`         |
| R2  | Superseded run must record terminal canceled row | `terminalOutcome(supersededRunId)=canceled`                    |
| R3  | Cancellation emits governance signal             | `exists signal where type = decision-friction OR workflow-gap` |

### State Transition

[ExecutionRun](domain.md#executionrun): `running|waiting-retry -> canceled`

### Postconditions

- Superseded run emits deterministic `canceled` terminal telemetry row.
- [WorktreeLease](domain.md#worktreelease) and [SandboxLease](domain.md#sandboxlease) for superseded run are released.

### Error States

| Condition                       | Result                               |
| ------------------------------- | ------------------------------------ |
| Superseded run already terminal | Return no-op with `ALREADY_TERMINAL` |
| Winning run missing             | Reject with `WINNING_RUN_MISSING`    |

---

## EmitGovernanceSignals

**Type:** Operation (mutation)
**Actor:** Orchestrator runtime
**Triggers:** Stage terminal outcome, recovery branch, or verification handoff

### Input

| Field       | Type                                                     | Required | Description                                         |
| ----------- | -------------------------------------------------------- | -------- | --------------------------------------------------- |
| runId       | string                                                   | yes      | Source [ExecutionRun](domain.md#executionrun).runId |
| stage       | [StageType](domain.md#stagetype)                         | yes      | Stage that produced the signal                      |
| outcome     | [TerminalOutcome](domain.md#terminaloutcome)             | yes      | Terminal outcome for stage                          |
| envelope    | [TelemetryEnvelope](domain.md#telemetryenvelope)         | yes      | Evidence payload                                    |
| signalTypes | [GovernanceSignalType](domain.md#governancesignaltype)[] | yes      | Signal rows to emit                                 |

### Rules

| ID  | Rule                                                      | Formal                                                          |
| --- | --------------------------------------------------------- | --------------------------------------------------------------- |
| R1  | Evidence envelope must be complete before signal emission | See [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum) |
| R2  | Signal types must match observer contract vocabulary      | `signalTypes subsetOf GovernanceSignalType`                     |
| R3  | Emission appends rows without rewriting history           | `appendOnly(pipeline-signals.jsonl)`                            |

### State Transition

[ExecutionRun](domain.md#executionrun): `completed|blocked|failed|canceled -> terminal-signal-emitted`

### Postconditions

- Governance signal rows are appended for [SignalObserverInterface](interfaces.md#internal-signalobserverinterface) consumption.
- Signal rows reference [TelemetryEnvelope](domain.md#telemetryenvelope).stageRunId for traceability.

### Error States

| Condition                       | Result                                   |
| ------------------------------- | ---------------------------------------- |
| Missing evidence envelope field | Reject with `SIGNAL_EVIDENCE_INCOMPLETE` |
| Unknown signal type             | Reject with `SIGNAL_TYPE_INVALID`        |
