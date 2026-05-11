# Observability: Agent Execution Orchestrator

## Capability Backlinks

- [Governance Telemetry and Signal Emission](SPEC.md#governance-telemetry-and-signal-emission)
- [Sandcastle-Aligned Run Lifecycle](SPEC.md#sandcastle-aligned-run-lifecycle)

## RunArtifactMapping

**Type:** Mapping
**Concept ID:** `agent-execution-orchestrator.RunArtifactMapping`

Maps each [ExecutionRun](domain.md#executionrun) stage lifecycle outcome to deterministic [TelemetryEnvelope](domain.md#telemetryenvelope) fields.

### Mapping Table

| Source                                                              | Target Envelope Field                                                      | Required          | Notes                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------- | ------- | ------ | --------- |
| `delegation-tuning.jsonl` `started` row                             | [TelemetryEnvelope](domain.md#telemetryenvelope).startedTelemetryRef       | yes               | Same `stageRunId` as terminal row                                 |
| `delegation-tuning.jsonl` terminal row                              | [TelemetryEnvelope](domain.md#telemetryenvelope).terminalTelemetryRef      | yes               | Outcome in `completed                                             | blocked | failed | canceled` |
| terminal row `durationMs`                                           | [TelemetryEnvelope](domain.md#telemetryenvelope).durationMs                | yes               | Non-negative duration                                             |
| terminal row `suspectedStuck`                                       | [TelemetryEnvelope](domain.md#telemetryenvelope).suspectedStuck            | yes               | Supports stuck-rate metric                                        |
| terminal row `retryCount`                                           | [TelemetryEnvelope](domain.md#telemetryenvelope).retryCount                | yes               | Supports retry-resolution metric                                  |
| terminal guard run result refs                                      | [TelemetryEnvelope](domain.md#telemetryenvelope).terminalGuardEvidenceRefs | yes               | Required for guarded/nudged commands                              |
| transcript excerpt reference                                        | [TelemetryEnvelope](domain.md#telemetryenvelope).transcriptExcerptRef      | yes               | Required by standard envelope                                     |
| decision snapshot reference                                         | [TelemetryEnvelope](domain.md#telemetryenvelope).decisionSnapshotRef       | yes               | Required by standard envelope                                     |
| resumed/compacted stage handoff summary                             | [TelemetryEnvelope](domain.md#telemetryenvelope).transcriptExcerptRef      | yes (conditional) | Required when stage resumes from prior run context                |
| lineage continuity (`previousStageRunId`, resume/compaction reason) | [TelemetryEnvelope](domain.md#telemetryenvelope).decisionSnapshotRef       | yes (conditional) | Required when a stage terminal outcome chains into a continuation |

## GovernanceSignalEmission

**Type:** Event
**Concept ID:** `agent-execution-orchestrator.GovernanceSignalEmission`

Represents governance signal rows emitted after stage terminal outcomes and recovery branches.

### Signal Payload

| Field       | Type                                                   | Required | Description                                                                                |
| ----------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| signalType  | [GovernanceSignalType](domain.md#governancesignaltype) | yes      | `workflow-gap`, `contract-gap`, `evidence-gap`, `decision-friction`, `proposal`, `pattern` |
| runId       | string                                                 | yes      | Source [ExecutionRun](domain.md#executionrun).runId                                        |
| stageRunId  | string                                                 | yes      | Correlates to telemetry rows                                                               |
| stage       | [StageType](domain.md#stagetype)                       | yes      | Stage that emitted signal                                                                  |
| outcome     | [TerminalOutcome](domain.md#terminaloutcome)           | yes      | Stage terminal outcome                                                                     |
| evidenceRef | string                                                 | yes      | Reference to [TelemetryEnvelope](domain.md#telemetryenvelope) or supporting artifact       |
| emittedAt   | string (ISO-8601)                                      | yes      | Emission timestamp                                                                         |

## Stage Telemetry Coverage Matrix

| Stage                 | Delegation Started Row | Delegation Terminal Row | Terminal Guard Evidence       | Governance Signal Emission |
| --------------------- | ---------------------- | ----------------------- | ----------------------------- | -------------------------- |
| plan                  | required               | required                | required for guarded commands | required                   |
| architecture-baseline | required               | required                | required for guarded commands | required                   |
| discovery             | required               | required                | required for guarded commands | required                   |
| spec                  | required               | required                | required for guarded commands | required                   |
| stories               | required               | required                | required for guarded commands | required                   |
| tests                 | required               | required                | required for guarded commands | required                   |
| implementation        | required               | required                | required for guarded commands | required                   |
| observability         | required               | required                | required for guarded commands | required                   |
| audits                | required               | required                | required for guarded commands | required                   |
| verify                | required               | required                | required for guarded commands | required                   |

## Metrics Derived From Telemetry

| Metric                              | Definition                                                                                                                                                               | Formula                                                                                                                                                                                                                      | Target Direction |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `suspected_stuck_rate`              | Fraction of terminal rows with stuck flag                                                                                                                                | `count(suspectedStuck=true)/count(terminalRows)`                                                                                                                                                                             | reduce           |
| `orphan_stage_run_rate`             | Fraction of eligible started stage runs without a terminal pair after watchdog+grace window (eligible delegated commands: `domainspec-implement`, `domainspec-tag-code`) | `count(startedRows where delegatedCommand in {domainspec-implement,domainspec-tag-code} without terminal match after watchdog+120s)/count(startedRows where delegatedCommand in {domainspec-implement,domainspec-tag-code})` | reduce to 0      |
| `terminal_outcome_coverage`         | Coverage of started rows with terminal outcome                                                                                                                           | `count(startedRows with terminal match)/count(startedRows)`                                                                                                                                                                  | increase to 1.0  |
| `retry_resolution_rate`             | Fraction of retried runs that reached non-failed terminal outcome                                                                                                        | `count(retried runs with outcome in {completed,blocked})/count(retried runs)`                                                                                                                                                | improve          |
| `lineage_continuity_coverage`       | Fraction of resumed/compacted stage runs with explicit lineage evidence in decision snapshot + handoff transcript refs                                                   | `count(resumedOrCompactedRuns with lineage refs)/count(resumedOrCompactedRuns)`                                                                                                                                              | increase to 1.0  |
| `cross_run_contamination_incidents` | Count of runs with isolation leakage evidence                                                                                                                            | `count(run incidents tagged contamination)`                                                                                                                                                                                  | reduce           |
| `mean_time_to_stage_completion`     | Average terminal duration per stage                                                                                                                                      | `avg(durationMs by stage)`                                                                                                                                                                                                   | stabilize        |

## Orphan-Rate Scope Note

`orphan_stage_run_rate` is conditional and not global for all stages. Include a stage run in the numerator and denominator only when `delegatedCommand` is `domainspec-implement` or `domainspec-tag-code`.

## Hermes Benchmark Adoption (Task AEO-WP-03)

Inventory source: [Hermes Session Compaction Inventory](work-pack/context/hermes-session-compaction-inventory.md)

| Benchmark Pattern                                 | AEO Contract Adoption                                                                                        | Evidence Location                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Compression lineage via parent-child run chain    | Require conditional lineage continuity refs in decision snapshot for resumed/compacted stages                | [RunArtifactMapping](#runartifactmapping)                                     |
| Resume recap and continuity summary               | Require handoff summary reference in transcript excerpt for resumed/compacted stages                         | [RunArtifactMapping](#runartifactmapping)                                     |
| FTS-backed prior-session recall and summarization | Require retrieval evidence reference when prior runs are consulted before mutation or verification decisions | [Standard Evidence Envelope Checklist](#standard-evidence-envelope-checklist) |
| Orphaned continuation hygiene                     | Keep orphan metric scoped to mutation-capable commands only                                                  | [Orphan-Rate Scope Note](#orphan-rate-scope-note)                             |

## Delegation Ledger Mapping

Source contract: [DELEGATION-TUNING.md](../../signals/DELEGATION-TUNING.md)

| Ledger Field                 | Use In Feature                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `stageRunId`                 | Correlation key for [ExecutionRun](domain.md#executionrun) and [TelemetryEnvelope](domain.md#telemetryenvelope) |
| `stageRunId` pairing quality | Input for `orphan_stage_run_rate` and stale-stage reconciliation checks                                         |
| `delegationProfile`          | Selects [WatchdogTimeoutRule](rules.md#watchdogtimeoutrule) budget                                              |
| `thinkingBudget`             | Retry narrowing evidence in [RetryPolicy](rules.md#retrypolicy)                                                 |
| `outcome`                    | Terminal state mapping under [RunStateMachine](rules.md#runstatemachine)                                        |
| `suspectedStuck`             | Input for `suspected_stuck_rate`                                                                                |
| `retryCount`                 | Input for bounded retry auditing                                                                                |
| `durationMs`                 | Input for stage completion timing metric                                                                        |
| `notes`                      | Human-readable remediation trace                                                                                |

## Terminal Guard Mapping

Source contract: [TERMINAL-GUARD.md](../../../../../docs/signals/TERMINAL-GUARD.md)

| Guard Signal                 | Lifecycle Mapping                                                                              | Evidence Requirement                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `nudge` classification       | Pre-stage safety checks before execution                                                       | Store nudge result reference in [TelemetryEnvelope](domain.md#telemetryenvelope).terminalGuardEvidenceRefs |
| `run` timeout + monitoring   | Active stage execution hardening                                                               | Store guard execution result reference                                                                     |
| recovery path classification | Recovery branch in [LatestRunWinsRecoveryWorkflow](workflows.md#latestrunwinsrecoveryworkflow) | Store recovery artifact reference                                                                          |

## Signal Observer Mapping

Source contract: `domainspec-signal-observer` skill

| Lifecycle Moment                          | Signal Types                        | Why                                           |
| ----------------------------------------- | ----------------------------------- | --------------------------------------------- |
| Stage terminal `blocked`                  | `workflow-gap`, `evidence-gap`      | Stage could not complete with full evidence   |
| Repeated contract mismatch                | `contract-gap`, `decision-friction` | Captures unresolved policy/contract tension   |
| Successful deterministic recovery pattern | `pattern`, `proposal`               | Captures reusable execution hardening pattern |

## Standard Evidence Envelope Checklist

- [ ] One delegation `started` row exists for each `stageRunId`.
- [ ] One delegation terminal row exists for each `stageRunId`.
- [ ] Terminal outcome is one of `completed`, `blocked`, `failed`, `canceled`.
- [ ] Terminal guard evidence references are present when commands are guarded/nudged.
- [ ] Transcript excerpt reference exists.
- [ ] Decision snapshot reference exists.
- [ ] Governance signal rows are emitted at terminal lifecycle boundaries.
- [ ] Resumed/compacted stages include lineage continuity evidence (`previousStageRunId` + reason) in decision snapshots.
- [ ] Resumed/compacted stages include handoff summary evidence in transcript excerpts.
- [ ] Prior-run recall includes retrieval evidence references when earlier runs are consulted before mutation or verification decisions.
