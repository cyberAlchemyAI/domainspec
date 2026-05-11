# TASK-AEO-WP-03 - Observability and Governance Signal Instrumentation Mapping

## Goal

Define feature-level observability contracts and governance signal mappings so orchestrator lifecycle stages emit deterministic telemetry aligned with delegation tuning, terminal guard, and signal-observer patterns.

## Wave Assignment

- Primary wave: W2

## Status

completed

- Completed at: 2026-05-10 (UTC)
- Output artifacts:
  - [observability.md](../../observability.md)
  - [hermes-session-compaction-inventory.md](../context/hermes-session-compaction-inventory.md)

## Capability Contract Subset

| Contract Area       | Required Subset                                                                        |
| ------------------- | -------------------------------------------------------------------------------------- |
| Run telemetry       | stage run outcome lifecycle, suspected stuck and retry signals, duration coverage      |
| Governance evidence | standard evidence envelope per run and per stage                                       |
| Observer mapping    | signal-emission mapping for workflow gaps, contract gaps, evidence gaps, and proposals |

## DomainSpec Coverage

| Source                                                                                                   | Coverage IDs                                                                                                                  |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [INITIAL-DEFINITIONS.md](../../../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md)     | RunArtifactMapping, suspected_stuck_rate, terminal_outcome_coverage, retry_resolution_rate, cross_run_contamination_incidents |
| [DELEGATION-TUNING.md](../../../../signals/DELEGATION-TUNING.md)                                         | stageRunId lifecycle rows, outcome terminal states, suspectedStuck, retryCount, durationMs                                    |
| [TERMINAL-GUARD.md](../../../../../../../docs/signals/TERMINAL-GUARD.md)                                 | guard profile usage, risky command preflight, bounded execution recovery                                                      |
| [domainspec-signal-observer SKILL.md](../../../../../copilot/skills/domainspec-signal-observer/SKILL.md) | workflow-gap, contract-gap, evidence-gap, decision-friction signal types                                                      |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [OBSERVABILITY.md](../../../../../OBSERVABILITY.md)
- [TEST-PIPELINE.md](../../../../../TEST-PIPELINE.md)
- [DELEGATION-TUNING.md](../../../../signals/DELEGATION-TUNING.md)
- [Hermes Session Compaction Inventory](../context/hermes-session-compaction-inventory.md)

## Implementation Directives

- Define feature observability contracts in `observability.md` with stage-to-metric mapping.
- Map every planned stage to required delegation telemetry rows (`started` + terminal row).
- Map terminal command guard behavior to lifecycle policies and recovery branches.
- Specify standard evidence envelope contents for each run: telemetry pair, terminal guard evidence, transcript excerpt, decision snapshot.
- Include signal-observer emission points for plan/spec/execute/verify transitions.
- Define docs-only/non-mutation obligations for `alignment-gap` and layering `governance-gap` signals while audit stages are deferred.
- Incorporate Hermes benchmark patterns for session lineage continuity, handoff summaries, and compaction-safe telemetry pairing.

## Completion Criteria

- Observability contract file includes lifecycle metrics, attributes, and emission points.
- Telemetry mapping tables cover delegation tuning and terminal guard contracts for each stage.
- Evidence envelope requirements are explicit and auditable.
- Hermes benchmark inventory is recorded and linked from this task for traceable pattern adoption decisions.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-WP-03.md`
- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/context/hermes-session-compaction-inventory.md`
- `bash tools/check_markdown_links.sh docs/signals/DELEGATION-TUNING.md`
- `jq -s 'map(select(.skill=="domainspec-plan-phase-bridge"))' ../../docs/signals/delegation-tuning.jsonl`
- `jq -s 'map(select(.skill=="domainspec-plan-phase-bridge")) | group_by(.stageRunId) | map({stageRunId: .[0].stageRunId, startedRows: (map(select(.outcome=="started")) | length), terminalRows: (map(select(.outcome!="started")) | length), outcomes: (map(.outcome) | unique)})' ../../docs/signals/delegation-tuning.jsonl`
- `rg -n "previousStageRunId|resumed/compacted|handoff summary|retrieval evidence" docs/features/agent-execution-orchestrator/observability.md docs/features/agent-execution-orchestrator/work-pack/context/hermes-session-compaction-inventory.md`

## Verification Notes

- `domainspec-plan-phase-bridge` telemetry rows are tracked in the repository-level ledger at `../../docs/signals/delegation-tuning.jsonl`; the local implementation ledger (`docs/signals/delegation-tuning.jsonl`) is implementation-scope only.
- StageRunId pairing evidence and lineage continuity obligations are auditable through the queries above and the mapped requirements in `observability.md`.

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                     |
| ----------- | -------- | -------- | ------------------------------------------------------------------------ |
| D-AEO-003   | yes      | selected | Use `Standard` evidence envelope for run telemetry and governance output |
| D-AEO-004   | yes      | selected | Cancellation outcome semantics must be measurable in telemetry           |
