# Interfaces: Agent Execution Orchestrator

## Capability Backlinks

- [Explicit Pipeline Route Composition](SPEC.md#explicit-pipeline-route-composition)
- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)
- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)

## Internal: RouteArtifactInterface

**Purpose:** Publish explicit [PipelineRouteTemplate](domain.md#pipelineroutetemplate) artifacts for orchestrator and prompt contexts.

### Exposes

- [AssemblePipelineRoute](operations.md#assemblepipelineroute)

### Methods

| Method                   | Input                                                                                                                                                                                  | Output                                                                       | Maps To                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `saveRouteTemplate`      | [ExecutionPipeline](domain.md#executionpipeline), [PipelineRouteTemplate](domain.md#pipelineroutetemplate)                                                                             | Route artifact reference                                                     | [AssemblePipelineRoute](operations.md#assemblepipelineroute)          |
| `getRouteTemplate`       | `pipelineId`, `version`                                                                                                                                                                | [PipelineRouteTemplate](domain.md#pipelineroutetemplate)                     | [ExecutePipelineRoute](operations.md#executepipelineroute)            |
| `renderPromptContext`    | [PipelineRouteTemplate](domain.md#pipelineroutetemplate)                                                                                                                               | Prompt-safe markdown artifact                                                | [SPEC.md](SPEC.md#explicit-pipeline-route-composition)                |
| `buildPromptArtifacts`   | `selectionPolicy`, ordered `selectedStages`, `stageContracts`, `stageInputRefsByStage`, `requiredArtifactRefsByStage`, `stageRunIdsByStage`, `decisionSnapshotRef`, `createdAtByStage` | Ordered prompt artifact set keyed by `stageRunId` and deterministic set hash | [PromptBuildStepContract](rules.md#promptbuildstepcontract)           |
| `validatePromptArtifact` | prompt artifact payload                                                                                                                                                                | PASS/FAIL with validation reasons                                            | [PromptArtifactSchemaRequired](rules.md#promptartifactschemarequired) |

### Prompt Artifact Schema (C1 Baseline)

| Field                  | Type                             | Required | Validation                                                                                  |
| ---------------------- | -------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `promptVersion`        | string                           | yes      | Semver format (for example `1.0.0`)                                                         |
| `pipelineId`           | string                           | yes      | Must reference existing [ExecutionPipeline](domain.md#executionpipeline).pipelineId         |
| `templateId`           | string                           | yes      | Must reference existing [PipelineRouteTemplate](domain.md#pipelineroutetemplate).templateId |
| `stageRunId`           | string                           | yes      | Non-empty and unique per stage attempt                                                      |
| `stage`                | [StageType](domain.md#stagetype) | yes      | Must be one of stage enum values                                                            |
| `stageInputRefs`       | string[]                         | yes      | At least one evidence or input reference                                                    |
| `requiredArtifactRefs` | string[]                         | yes      | Includes all stage contract evidence obligations                                            |
| `decisionSnapshotRef`  | string                           | yes      | Required by standard evidence envelope                                                      |
| `transcriptExcerptRef` | string                           | no       | Optional at build time, required before terminal emission                                   |
| `createdAt`            | string                           | yes      | ISO-8601 timestamp                                                                          |

### Prompt Builder Build Step Contract

| Build Input Field             | Required | Validation                                                                   |
| ----------------------------- | -------- | ---------------------------------------------------------------------------- |
| `selectionPolicy`             | yes      | Must be `full-lifecycle` or `stage-subset`                                   |
| `selectedStages`              | yes      | Ordered stage list; non-empty + distinct when `selectionPolicy=stage-subset` |
| `stageContracts`              | yes      | Declares allowed stage set and canonical order                               |
| `stageInputRefsByStage`       | yes      | Every selected stage has at least one input ref                              |
| `requiredArtifactRefsByStage` | yes      | Every selected stage has at least one required artifact ref                  |
| `stageRunIdsByStage`          | yes      | Every selected stage has one non-empty `stageRunId`                          |
| `decisionSnapshotRef`         | yes      | Non-empty decision evidence pointer                                          |
| `createdAtByStage`            | yes      | ISO-8601 UTC timestamp per selected stage                                    |

| Build Output Field            | Required | Validation                                           |
| ----------------------------- | -------- | ---------------------------------------------------- |
| `promptArtifacts`             | yes      | Ordered exactly as `selectedStages`                  |
| `promptArtifactsByStageRunId` | yes      | Key set equals values of `stageRunIdsByStage`        |
| `buildOrder`                  | yes      | Equal to `selectedStages`                            |
| `promptArtifactSetHash`       | yes      | Same for repeated builds with same normalized inputs |

### Prompt Artifact Validation Cases (C1 Baseline)

| Case ID               | Condition                                                                                                                   | Expected Result                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `PA-VALID-01`         | Required fields complete, `stageRunId` present, enum-valid `stage`                                                          | PASS                                    |
| `PA-INVALID-01`       | Missing `stageRunId`                                                                                                        | FAIL `PROMPT_STAGE_RUN_ID_REQUIRED`     |
| `PA-INVALID-02`       | Empty `stageInputRefs`                                                                                                      | FAIL `PROMPT_STAGE_INPUT_REFS_REQUIRED` |
| `PA-BUILD-INVALID-01` | `selectedStages` contains stage without `stageInputRefsByStage[stage]`                                                      | FAIL `PROMPT_STAGE_INPUT_MISSING`       |
| `PA-BUILD-INVALID-02` | Missing `stageRunIdsByStage[stage]` for selected stage                                                                      | FAIL `PROMPT_STAGE_RUN_ID_MISSING`      |
| `PA-BUILD-INVALID-03` | Build output order differs from `selectedStages`                                                                            | FAIL `PROMPT_ARTIFACT_SET_INVALID`      |
| `PA-BUILD-DET-01`     | Repeated build with same `selectionPolicy=stage-subset` and same 3-stage selected set produces same `promptArtifactSetHash` | PASS                                    |

---

## Internal: SandboxProviderInterface

**Purpose:** Keep run lifecycle provider-agnostic while enforcing Sandcastle baseline semantics.

### Exposes

- [ExecutePipelineRoute](operations.md#executepipelineroute)
- [ResumeExecutionRun](operations.md#resumeexecutionrun)

### Methods

| Method             | Input                                                                                                                                           | Output                                                                         | Maps To                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `createSandbox`    | [ExecutionRun](domain.md#executionrun), [ProviderAdapter](domain.md#provideradapter)                                                            | [SandboxLease](domain.md#sandboxlease)                                         | [ExecutePipelineRoute](operations.md#executepipelineroute) |
| `createWorktree`   | [ExecutionRun](domain.md#executionrun), [BranchStrategy](domain.md#branchstrategy)                                                              | [WorktreeLease](domain.md#worktreelease)                                       | [ExecutePipelineRoute](operations.md#executepipelineroute) |
| `executeStage`     | [ExecutionRun](domain.md#executionrun), ordered prompt artifact payload, [StageIsolationMode](domain.md#stageisolationmode), `executionProfile` | Stage execution result (`stageRunId`, terminal outcome, optional `childRunId`) | [ExecutePipelineRoute](operations.md#executepipelineroute) |
| `resumeSession`    | [SessionSnapshot](domain.md#sessionsnapshot)                                                                                                    | Runtime resume result                                                          | [ResumeExecutionRun](operations.md#resumeexecutionrun)     |
| `releaseResources` | [ExecutionRun](domain.md#executionrun)                                                                                                          | Release confirmation                                                           | [RunStateMachine](rules.md#runstatemachine)                |

### Contract Notes

- MVP baseline requires [ProviderAdapter](domain.md#provideradapter) value `sandcastle`.
- `executeStage` must return a terminal outcome for every started `stageRunId`.
- For `isolated-child-run`, `executeStage` must include `childRunId` and preserve parent linkage (`childRun.parentRunId = parent runId`).
- Alternate providers are extension hooks and must preserve [RunStateMachine](rules.md#runstatemachine) semantics.

---

## Internal: DelegationTelemetryLedgerInterface

**Purpose:** Append stage telemetry rows to delegation tuning ledger with strict started/terminal pairing.

### Exposes

- [EmitGovernanceSignals](operations.md#emitgovernancesignals)
- [ExecutePipelineRoute](operations.md#executepipelineroute)

### Methods

| Method              | Input                                                                                                    | Output                  | Maps To                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `appendStartedRow`  | `stageRunId`, `stage`, `delegationProfile`, `thinkingBudget`                                             | Row reference           | [TelemetryPairRequired](rules.md#telemetrypairrequired)     |
| `appendTerminalRow` | `stageRunId`, [TerminalOutcome](domain.md#terminaloutcome), `suspectedStuck`, `retryCount`, `durationMs` | Row reference           | [TelemetryPairRequired](rules.md#telemetrypairrequired)     |
| `auditUnpairedRows` | time window                                                                                              | Unpaired stage run list | [TerminalOutcomeRequired](rules.md#terminaloutcomerequired) |

### Contract Notes

- Backed by [DELEGATION-TUNING.md](../../signals/DELEGATION-TUNING.md) schema.
- History is append-only; row rewrites are forbidden.

---

## Internal: TerminalGuardInterface

**Purpose:** Bind orchestration to guarded command execution and deterministic terminal recovery evidence.

### Exposes

- [ExecutePipelineRoute](operations.md#executepipelineroute)
- [EmitGovernanceSignals](operations.md#emitgovernancesignals)

### Methods

| Method       | Input                       | Output                                   | Maps To                                                                     |
| ------------ | --------------------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| `nudge`      | command descriptor          | Nudge classification and recommendations | [WatchdogTimeoutRule](rules.md#watchdogtimeoutrule)                         |
| `runGuarded` | command descriptor, timeout | Guard execution result and telemetry ref | [ArtifactEvidenceMinimum](rules.md#artifactevidenceminimum)                 |
| `recover`    | terminal error context      | Recovery result                          | [LatestRunWinsRecoveryWorkflow](workflows.md#latestrunwinsrecoveryworkflow) |

### Contract Notes

- Contract source: [TERMINAL-GUARD.md](../../../../../docs/signals/TERMINAL-GUARD.md).
- Guard evidence references are required in [TelemetryEnvelope](domain.md#telemetryenvelope).

---

## Internal: SignalObserverInterface

**Purpose:** Publish observer-compatible governance signal rows for asynchronous tuning and governance loops.

### Exposes

- [EmitGovernanceSignals](operations.md#emitgovernancesignals)

### Methods

| Method                 | Input                                                                                                      | Output                      | Maps To                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------- |
| `appendSignalRows`     | [GovernanceSignalType](domain.md#governancesignaltype)[], [TelemetryEnvelope](domain.md#telemetryenvelope) | Signal row references       | [GovernanceSignalEmission](observability.md#governancesignalemission) |
| `validateSignalSchema` | signal rows                                                                                                | PASS/FLAG validation report | [observability.md](observability.md#signal-observer-mapping)          |

### Contract Notes

- Signal vocabulary follows `workflow-gap`, `contract-gap`, `evidence-gap`, `decision-friction`, `proposal`, `pattern`.
- Emission targets async-observer flows described in `domainspec-signal-observer` skill.
