# Route Artifact Prompt Pack - Legacy WP-02 Baseline

## Scope and Decision Lock

- Legacy source: WP-02 route-artifact baseline (retired task file on 2026-05-11)
- Feature: `agent-execution-orchestrator`
- Primary objective: provide one concrete, prompt-ready route artifact for operator embedding in `CLAUDE.md` and copilot instruction contexts.

Decision lock carried from [WORK-PACK.md](../../WORK-PACK.md#resolved-decision-gate):

| Decision  | Locked Value                | Route Impact                                                                        |
| --------- | --------------------------- | ----------------------------------------------------------------------------------- |
| D-AEO-001 | `merge-to-head`             | Default branch strategy for mutating stages unless explicit policy exception exists |
| D-AEO-002 | Sandcastle adapter baseline | MVP provider baseline for execution runtime and sandbox lifecycle semantics         |
| D-AEO-003 | Standard evidence envelope  | Every terminal stage must include telemetry pair + transcript + decision references |
| D-AEO-004 | `latest-run-wins`           | Superseded active runs are canceled deterministically and replaced by newest run    |

## Canonical Route Template

Route chain (canonical):

`discovery -> spec -> stories -> tests -> implementation -> observability -> audits -> verify`

Template envelope:

```yaml
routeTemplateId: agent-execution-orchestrator.route-template.v1
feature: agent-execution-orchestrator
stages:
  - discovery
  - spec
  - stories
  - tests
  - implementation
  - observability
  - audits
  - verify
defaults:
  branchStrategy: merge-to-head
  providerBaseline: sandcastle
  cancellationPolicy: latest-run-wins
  evidenceEnvelope: standard
  maxRetriesPerStage: 1
```

## Telemetry and Guard Baseline (All Stages)

Apply to every stage command in the route:

1. Append one `started` row and one terminal row sharing the same `stageRunId` in `docs/signals/delegation-tuning.jsonl`.
2. Record required fields: `delegationProfile`, `thinkingBudget`, `suspectedStuck`, `retryCount`, `durationMs`, `outcome`, `notes`.
3. Preserve standard evidence envelope fields in stage evidence references: started telemetry ref, terminal telemetry ref, terminal guard evidence refs, transcript excerpt ref, decision snapshot ref.
4. Preflight risky commands with `./tools/terminal_guard.sh nudge -- <command...>`.
5. Run risky/long commands with `./tools/terminal_guard.sh run --timeout <seconds> -- <command...>`.

## Stage Command and Artifact Contract

| Stage          | Command Form (specialist mode)                                                                                      | Expected Artifacts                                                                          | Telemetry Requirements                                                                                     | Guard Expectations                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------- |
| discovery      | `domainspec-context-builder agent-execution-orchestrator --task <TASK_ID> --mode standard`                          | `work-pack/context/<TASK_ID>-CONTEXT.md`, `work-pack/context/<TASK_ID>-CONTEXT.index.json`  | started + terminal row for `stage=discovery`; decision notes include selected discovery path               | nudge before broad search commands; guard run for high-output scans               |
| spec           | `domainspec-spec-feature agent-execution-orchestrator --task <TASK_ID>`                                             | `SPEC.md` plus relevant aspect-doc updates                                                  | started + terminal row for `stage=spec`; evidence refs include edited artifact set                         | nudge before multi-file mutation commands; guard run for long validation commands |
| stories        | `domainspec-sync-user-stories agent-execution-orchestrator`                                                         | `STORIES.md` sync and coverage links                                                        | started + terminal row for `stage=stories`; notes capture coverage-sync outcome                            | nudge before story regeneration scripts; guard run if command is long-running     |
| tests          | `domainspec-generate-tests agent-execution-orchestrator`                                                            | `TEST-SPEC.md` and generated test plan references                                           | started + terminal row for `stage=tests`; notes include test-suite scope                                   | nudge before heavy derivation commands; guard run for generation pipelines        |
| implementation | `domainspec-implement agent-execution-orchestrator`                                                                 | implementation diffs, task scaffold, and follow-up tag task evidence                        | started + terminal row for `stage=implementation`; envelope includes decision snapshot for branch strategy | nudge before package/build/test commands; guarded run for risky shell flows       |
| observability  | `domainspec-instrument-otel agent-execution-orchestrator && domainspec-otel-verify agent-execution-orchestrator`    | instrumentation updates and `OBSERVABILITY-REPORT.md` (or equivalent verification artifact) | started + terminal row for `stage=observability`; include metric coverage summary in notes                 | guard all long-running instrumentation/verification commands                      |
| audits         | `domainspec-audit-alignment agent-execution-orchestrator && domainspec-audit-layering agent-execution-orchestrator` | `ALIGNMENT-REPORT.md`, `LAYERING-ALIGNMENT-REPORT.md`                                       | started + terminal row for `stage=audits`; include severity summary in notes                               | guard repo-wide scans and report generation commands                              |
| verify         | `domainspec-verify-feature agent-execution-orchestrator`                                                            | `VERIFICATION.md` readiness verdict                                                         | started + terminal row for `stage=verify`; include verdict (`PASS                                          | FLAG                                                                              | BLOCK`) in notes | guard full-suite verification commands and telemetry reconciliation checks |

## Failure Handling and Retry Envelope Guidance

When any stage enters non-success path:

1. Capture terminal evidence first (terminal telemetry row + guard output refs).
2. If `suspectedStuck=true` or non-progress loop detected, apply one bounded retry with narrower scope and/or reduced thinking budget (`maxRetriesPerStage=1`).
3. If a newer run supersedes the active run for the same scope, apply `latest-run-wins`: terminate the older run deterministically and continue with the newest run.
4. Reconcile stale telemetry rows before rerun/exit: `./tools/reconcile_delegation_tuning.sh`.
5. If retry still fails, terminate stage with `blocked` (recoverable) or `failed` (non-recoverable) and include remediation notes.

Retry envelope template (terminal row example):

```json
{
  "stageRunId": "<same-stage-run-id>",
  "stage": "<stage-name>",
  "outcome": "blocked",
  "suspectedStuck": true,
  "retryCount": 1,
  "durationMs": 0,
  "notes": "retry exhausted after narrowed scope; remediation: <next action>"
}
```

## Ready-To-Copy Prompt Block (CLAUDE.md Style)

```markdown
## Agent Execution Orchestrator - Route Artifact

Use this canonical route for feature `agent-execution-orchestrator`:

discovery -> spec -> stories -> tests -> implementation -> observability -> audits -> verify

Decision lock:

- branch strategy default: merge-to-head
- provider baseline: sandcastle adapter
- cancellation policy: latest-run-wins
- evidence envelope: standard
- retry policy: max 1 bounded retry with narrowed scope

Per-stage command form:

- discovery: domainspec-context-builder agent-execution-orchestrator --task <TASK_ID> --mode standard
- spec: domainspec-spec-feature agent-execution-orchestrator --task <TASK_ID>
- stories: domainspec-sync-user-stories agent-execution-orchestrator
- tests: domainspec-generate-tests agent-execution-orchestrator
- implementation: domainspec-implement agent-execution-orchestrator
- observability: domainspec-instrument-otel agent-execution-orchestrator && domainspec-otel-verify agent-execution-orchestrator
- audits: domainspec-audit-alignment agent-execution-orchestrator && domainspec-audit-layering agent-execution-orchestrator
- verify: domainspec-verify-feature agent-execution-orchestrator

For every stage:

1. append started telemetry row, 2) run command with terminal-guard expectations, 3) append terminal telemetry row, 4) preserve standard evidence envelope refs.

Failure handling:

- one bounded retry (narrowed scope/reduced thinking)
- latest-run-wins cancellation for superseded runs
- reconcile stale telemetry rows with ./tools/reconcile_delegation_tuning.sh
- if retry fails, return blocked/failed with remediation notes
```

## Ready-To-Copy Prompt Block (Copilot Instructions Style)

```markdown
<agent-execution-orchestrator-route>
feature: agent-execution-orchestrator
route: discovery -> spec -> stories -> tests -> implementation -> observability -> audits -> verify

defaults:
branchStrategy: merge-to-head
providerBaseline: sandcastle
cancellationPolicy: latest-run-wins
evidenceEnvelope: standard
maxRetriesPerStage: 1

stageCommandForm:
discovery: domainspec-context-builder agent-execution-orchestrator --task <TASK_ID> --mode standard
spec: domainspec-spec-feature agent-execution-orchestrator --task <TASK_ID>
stories: domainspec-sync-user-stories agent-execution-orchestrator
tests: domainspec-generate-tests agent-execution-orchestrator
implementation: domainspec-implement agent-execution-orchestrator
observability: domainspec-instrument-otel agent-execution-orchestrator && domainspec-otel-verify agent-execution-orchestrator
audits: domainspec-audit-alignment agent-execution-orchestrator && domainspec-audit-layering agent-execution-orchestrator
verify: domainspec-verify-feature agent-execution-orchestrator

telemetryContract:

- one started row + one terminal row per stageRunId
- required fields: delegationProfile, thinkingBudget, suspectedStuck, retryCount, durationMs, outcome, notes
- standard envelope refs required: startedTelemetryRef, terminalTelemetryRef, terminalGuardEvidenceRefs, transcriptExcerptRef, decisionSnapshotRef

guardContract:

- preflight: ./tools/terminal_guard.sh nudge -- <command...>
- guarded run for risky commands: ./tools/terminal_guard.sh run --timeout <seconds> -- <command...>

failureEnvelope:

- bounded retry once with narrowed scope
- apply latest-run-wins for superseded runs
- run ./tools/reconcile_delegation_tuning.sh before exit
- terminal outcome must be completed|blocked|failed (and canceled for superseded-run state models when supported)
  </agent-execution-orchestrator-route>
```

## Source Links

- [WORK-PACK.md](../../WORK-PACK.md)
- [SPEC.md](../../SPEC.md)
- [operations.md](../../operations.md)
- [workflows.md](../../workflows.md)
- [rules.md](../../rules.md)
- [observability.md](../../observability.md)
- [DELEGATION-TUNING.md](../../../../signals/DELEGATION-TUNING.md)
- [TERMINAL-GUARD.md](../../../../../../../docs/signals/TERMINAL-GUARD.md)
