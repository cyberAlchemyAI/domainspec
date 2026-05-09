# TASK-AEO-WP-SIGNAL-ALIGNMENT - Emit Alignment Signal Obligations

## Goal

Emit `alignment-gap` signals for the docs-only/non-mutation slice so alignment risk remains visible while mutation-only audits are deferred.

## Wave Assignment

- Primary wave: W2
- Follow-up wave: W3

## Status

not-started

## DomainSpec Coverage

| Source                                                        | Coverage IDs                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------------- |
| [WORK-PACK.md](../../WORK-PACK.md)                            | alignment-gap obligation, audit-alignment deferred-until-mutation |
| [observability.md](../../observability.md)                    | telemetry mapping expectations, stage outcome evidence            |
| [SIGNAL-SCHEMA.md](../../../../../templates/SIGNAL-SCHEMA.md) | `alignment-gap` type and quality category constraints             |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [DELEGATION-TUNING.md](../../../../signals/DELEGATION-TUNING.md)
- [pipeline-signals.jsonl](../../../../signals/pipeline-signals.jsonl)

## Implementation Directives

- Run this task only while mutation-capable stages remain skipped for this slice.
- Evaluate docs contracts for `spec-without-code` or `contract-mismatch` risks.
- When risk is found, append a valid `alignment-gap` signal entry to `docs/signals/pipeline-signals.jsonl` with deterministic evidence references.
- Include explicit note that `domainspec-audit-alignment` is deferred until mutation starts.

## Completion Criteria

- At least one alignment signal is emitted when a gap is detected, or a no-gap determination is documented with evidence.
- Signal payloads conform to `SIGNAL-SCHEMA.md` constraints.
- Work-pack evidence links point to emitted signal rows.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-WP-SIGNAL-ALIGNMENT.md`
- `rg -n '"type"\s*:\s*"alignment-gap"' docs/signals/pipeline-signals.jsonl`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                               |
| ----------- | -------- | -------- | ------------------------------------------------------------------ |
| D-AEO-003   | yes      | selected | Standard evidence envelope applies to docs-only signal emission    |
| D-AEO-004   | yes      | selected | Signal emission must preserve deterministic run-state traceability |
