# Domain: Agent Execution Orchestrator

## Capability Backlinks

- [Explicit Pipeline Route Composition](SPEC.md#explicit-pipeline-route-composition)
- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)
- [Policy-Governed Branch and Cancellation Control](SPEC.md#policy-governed-branch-and-cancellation-control)
- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## Entities

### ExecutionPipeline

Owns one named orchestration capability and its default route policy.

| Field                 | Type                                            | Required | Description                                                                                         |
| --------------------- | ----------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| pipelineId            | string                                          | yes      | Stable identifier for [ExecutionPipeline](#executionpipeline)                                       |
| name                  | string                                          | yes      | Human-readable name used by [RouteArtifactInterface](interfaces.md#internal-routeartifactinterface) |
| routeTemplate         | [PipelineRouteTemplate](#pipelineroutetemplate) | yes      | Ordered stage composition contract                                                                  |
| defaultBranchStrategy | [BranchStrategy](#branchstrategy)               | yes      | Branch strategy lock (default `merge-to-head`)                                                      |
| providerBaseline      | [ProviderAdapter](#provideradapter)             | yes      | MVP provider baseline (`sandcastle`)                                                                |
| version               | string                                          | yes      | Route template semantic version                                                                     |

**Operations:** [AssemblePipelineRoute](operations.md#assemblepipelineroute)

---

### PipelineRouteTemplate

Declares one composable route artifact that can be embedded in prompt contexts and orchestrator policies.

| Field             | Type                              | Required | Description                                                           |
| ----------------- | --------------------------------- | -------- | --------------------------------------------------------------------- |
| templateId        | string                            | yes      | Stable identifier for [PipelineRouteTemplate](#pipelineroutetemplate) |
| stageContracts    | [StageContract](#stagecontract)[] | yes      | Ordered stage contracts for this route template                       |
| selectedStages    | [StageType](#stagetype)[]         | yes      | Ordered stage set selected for this route (can be subset)             |
| selectionPolicy   | string                            | yes      | Route selection mode (`full-lifecycle` or `stage-subset`)             |
| mandatoryCoverage | [StageType](#stagetype)[]         | yes      | Stage set that must always be present for the selected policy         |
| optionalCoverage  | [StageType](#stagetype)[]         | no       | Stage set allowed when profile requests optional stages               |
| profile           | string                            | yes      | Route profile name (`pilot`, `release-candidate`, `production`)       |

**Operations:** [AssemblePipelineRoute](operations.md#assemblepipelineroute), [ExecutePipelineRoute](operations.md#executepipelineroute)

---

### ExecutionRun

Identity-bearing run object spanning one route execution from queue to terminal outcome.

| Field              | Type                                      | Required | Description                                                                                                  |
| ------------------ | ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| runId              | string                                    | yes      | Stable identifier for [ExecutionRun](#executionrun)                                                          |
| parentRunId        | string                                    | no       | Parent run identifier when this run is spawned as isolated child stage run                                   |
| pipelineId         | string                                    | yes      | Owning [ExecutionPipeline](#executionpipeline).pipelineId                                                    |
| templateId         | string                                    | yes      | Active [PipelineRouteTemplate](#pipelineroutetemplate).templateId                                            |
| executionProfile   | string                                    | yes      | Delegation profile (`quick`, `standard`, `deep`) used by [WatchdogTimeoutRule](rules.md#watchdogtimeoutrule) |
| currentState       | [RunState](#runstate)                     | yes      | Current state under [RunStateMachine](rules.md#runstatemachine)                                              |
| terminalOutcome    | [TerminalOutcome](#terminaloutcome)       | no       | Final outcome once terminal state is reached                                                                 |
| activeStage        | [StageType](#stagetype)                   | no       | Current stage being executed (unset when terminal)                                                           |
| activeStageRunId   | string                                    | no       | Active stage execution key while run is in non-terminal state                                                |
| stageRuns          | [StageExecution](#stageexecution)[]       | yes      | Ordered stage execution records under this run                                                               |
| retryCount         | integer                                   | yes      | Current retry counter constrained by [RetryPolicy](rules.md#retrypolicy)                                     |
| suspectedStuck     | boolean                                   | yes      | Watchdog flag governed by [WatchdogTimeoutRule](rules.md#watchdogtimeoutrule)                                |
| sandboxLease       | [SandboxLease](#sandboxlease)             | yes      | Active sandbox lease for this run                                                                            |
| worktreeLease      | [WorktreeLease](#worktreelease)           | yes      | Active worktree lease for this run                                                                           |
| sessionSnapshot    | [SessionSnapshot](#sessionsnapshot)       | no       | Resume payload when run is interrupted                                                                       |
| telemetryEnvelopes | [TelemetryEnvelope](#telemetryenvelope)[] | yes      | Stage-level evidence envelopes keyed by `stageRunId`                                                         |

**Lifecycle:** See [RunStateMachine](rules.md#runstatemachine)
**Operations:** [ExecutePipelineRoute](operations.md#executepipelineroute), [ResumeExecutionRun](operations.md#resumeexecutionrun), [CancelSupersededRun](operations.md#cancelsupersededrun)

## Value Objects

### StageContract

| Field             | Type                                            | Constraint                                                                                      |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| stage             | [StageType](#stagetype)                         | Must be unique within [PipelineRouteTemplate](#pipelineroutetemplate).stageContracts            |
| isolationMode     | [StageIsolationMode](#stageisolationmode)       | Default `shared-run`; `isolated-child-run` allowed for risky stages                             |
| operationRef      | string                                          | Must map to one operation in [operations.md](operations.md)                                     |
| requiredArtifacts | string[]                                        | Must include stage evidence required by [TelemetryPairRequired](rules.md#telemetrypairrequired) |
| terminalOutcomes  | [TerminalOutcome](#terminaloutcome)[]           | Must include `completed`, `blocked`, `failed`                                                   |
| emitsSignals      | [GovernanceSignalType](#governancesignaltype)[] | Must be non-empty for lifecycle boundary stages                                                 |

**Equality:** Two [StageContract](#stagecontract) values are equal when `stage`, `operationRef`, `requiredArtifacts`, and `terminalOutcomes` are identical.

---

### StageExecution

| Field           | Type                                      | Constraint                                                                                                                                  |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| stageRunId      | string                                    | Non-empty, unique within parent [ExecutionRun](#executionrun), and equal to ordered prompt artifact `stageRunId` for the same stage attempt |
| stage           | [StageType](#stagetype)                   | Must exist in selected route stage set                                                                                                      |
| order           | integer                                   | Must match ordered index from [PipelineRouteTemplate](#pipelineroutetemplate).selectedStages                                                |
| isolationMode   | [StageIsolationMode](#stageisolationmode) | Must match [StageContract](#stagecontract).isolationMode                                                                                    |
| childRunId      | string                                    | Required when `isolationMode=isolated-child-run`; referenced child run must set `parentRunId` to parent run `runId`                         |
| state           | [RunState](#runstate)                     | Must follow stage-level lifecycle semantics                                                                                                 |
| terminalOutcome | [TerminalOutcome](#terminaloutcome)       | Required when `state` is terminal                                                                                                           |
| startedAt       | string (ISO-8601)                         | Required                                                                                                                                    |
| terminalAt      | string (ISO-8601)                         | Required when stage is terminal                                                                                                             |

**Equality:** Two [StageExecution](#stageexecution) values are equal when `stageRunId`, `stage`, and `order` match.

---

### SandboxLease

| Field              | Type                                | Constraint                                                              |
| ------------------ | ----------------------------------- | ----------------------------------------------------------------------- |
| provider           | [ProviderAdapter](#provideradapter) | MVP must be `sandcastle`                                                |
| sandboxId          | string                              | Non-empty                                                               |
| createdAt          | string (ISO-8601)                   | Required                                                                |
| releasedAt         | string (ISO-8601)                   | Required when [ExecutionRun](#executionrun).currentState is terminal    |
| idleTimeoutSeconds | integer                             | Must satisfy [WatchdogTimeoutRule](rules.md#watchdogtimeoutrule) window |

**Equality:** Two [SandboxLease](#sandboxlease) values are equal when `provider`, `sandboxId`, and `createdAt` match.

---

### WorktreeLease

| Field          | Type                              | Constraint                                                                     |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| repositoryRoot | string                            | Must reference tracked repository                                              |
| leasePath      | string                            | Must be unique per active [ExecutionRun](#executionrun)                        |
| branchName     | string                            | Required when [BranchStrategy](#branchstrategy) is `branch` or `merge-to-head` |
| strategy       | [BranchStrategy](#branchstrategy) | Must follow [BranchStrategyPolicy](rules.md#branchstrategypolicy)              |
| mergeTarget    | string                            | Required when `strategy=merge-to-head`                                         |

**Equality:** Two [WorktreeLease](#worktreelease) values are equal when `leasePath` and `branchName` match.

---

### SessionSnapshot

| Field             | Type                    | Constraint                                                     |
| ----------------- | ----------------------- | -------------------------------------------------------------- |
| runId             | string                  | Must match [ExecutionRun](#executionrun).runId                 |
| stage             | [StageType](#stagetype) | Required                                                       |
| stageRunId        | string                  | Must match active [StageExecution](#stageexecution).stageRunId |
| cwd               | string                  | Required resume directory                                      |
| terminalSessionId | string                  | Required when terminal session is active                       |
| pendingPrompt     | string                  | Optional next prompt value                                     |
| capturedAt        | string (ISO-8601)       | Required                                                       |
| snapshotVersion   | string                  | Required for schema compatibility checks                       |

**Equality:** Two [SessionSnapshot](#sessionsnapshot) values are equal when `runId`, `stage`, and `capturedAt` match.

---

### TelemetryEnvelope

| Field                     | Type     | Constraint                                                                   |
| ------------------------- | -------- | ---------------------------------------------------------------------------- |
| stageRunId                | string   | Must match one [StageExecution](#stageexecution).stageRunId under parent run |
| startedTelemetryRef       | string   | Required pointer to `started` row in delegation tuning ledger                |
| terminalTelemetryRef      | string   | Required pointer to terminal row in delegation tuning ledger                 |
| durationMs                | integer  | Non-negative                                                                 |
| suspectedStuck            | boolean  | Mirrors telemetry field in delegation ledger                                 |
| retryCount                | integer  | Non-negative and bounded by [RetryPolicy](rules.md#retrypolicy)              |
| terminalGuardEvidenceRefs | string[] | Required for guarded or nudged command paths                                 |
| transcriptExcerptRef      | string   | Required by [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum)      |
| decisionSnapshotRef       | string   | Required by [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum)      |

**Equality:** Two [TelemetryEnvelope](#telemetryenvelope) values are equal when `stageRunId`, `startedTelemetryRef`, and `terminalTelemetryRef` match.

## Enums

### StageType

| Value                 | Description                                |
| --------------------- | ------------------------------------------ |
| plan                  | Planner and gate checks                    |
| architecture-baseline | Wave W0 baseline checks                    |
| discovery             | Discovery and context gathering            |
| spec                  | Capability and aspect spec authoring       |
| stories               | Story synchronization and matrix updates   |
| tests                 | Test spec generation                       |
| implementation        | Implementation execution stage             |
| observability         | Observability and telemetry contract stage |
| audits                | Alignment/layering audit stage             |
| verify                | Readiness/feature verification stage       |

### StageIsolationMode

| Value              | Description                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- |
| shared-run         | Stage executes inside parent [ExecutionRun](#executionrun)                                    |
| isolated-child-run | Stage executes in dedicated child [ExecutionRun](#executionrun) and reports outcome to parent |

### RunState

| Value         | Description                                          |
| ------------- | ---------------------------------------------------- |
| queued        | Run is accepted and waiting for execution            |
| running       | Run is actively executing stage logic                |
| waiting-retry | Run paused for bounded retry transition              |
| resuming      | Run is restoring [SessionSnapshot](#sessionsnapshot) |
| completed     | Run reached successful terminal state                |
| blocked       | Run reached blocked terminal state                   |
| failed        | Run reached failed terminal state                    |
| canceled      | Run was deterministically canceled                   |

### TerminalOutcome

| Value     | Description                                   |
| --------- | --------------------------------------------- |
| completed | Stage/run finished successfully               |
| blocked   | Stage/run stopped with actionable remediation |
| failed    | Stage/run terminated with failure             |
| canceled  | Stage/run canceled by policy                  |

### BranchStrategy

| Value         | Description                                          |
| ------------- | ---------------------------------------------------- |
| head          | Execute directly on active branch head               |
| merge-to-head | Execute in branch/worktree and merge back on success |
| branch        | Execute in isolated branch without auto-merge        |

### ProviderAdapter

| Value      | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| sandcastle | Sandcastle-style sandbox/worktree provider baseline for MVP |
| custom     | Extension hook for future provider adapters                 |

### GovernanceSignalType

| Value             | Description                                  |
| ----------------- | -------------------------------------------- |
| workflow-gap      | Stage sequencing or workflow obligation gap  |
| contract-gap      | Missing or inconsistent contract mapping     |
| evidence-gap      | Missing telemetry/evidence envelope fields   |
| decision-friction | Repeated unresolved decision pressure        |
| proposal          | Suggested governance or pipeline improvement |
| pattern           | Reusable successful pattern observed         |
