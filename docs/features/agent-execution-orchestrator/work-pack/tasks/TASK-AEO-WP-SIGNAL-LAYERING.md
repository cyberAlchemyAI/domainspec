# TASK-AEO-WP-SIGNAL-LAYERING - Emit Layering Governance Signal Obligations

## Goal

Emit `governance-gap` signals with layering-boundary evidence for docs-only/non-mutation slices where `domainspec-audit-layering` is intentionally deferred.

## Wave Assignment

- Primary wave: W2
- Follow-up wave: W3

## Status

not-started

## DomainSpec Coverage

| Source                                                        | Coverage IDs                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------------- |
| [WORK-PACK.md](../../WORK-PACK.md)                            | governance-gap obligation, audit-layering deferred-until-mutation |
| [rules.md](../../rules.md)                                    | dependency-direction and boundary invariants                      |
| [SIGNAL-SCHEMA.md](../../../../../templates/SIGNAL-SCHEMA.md) | `governance-gap` type and governance category constraints         |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [LAYERING-REFERENCE.md](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)
- [pipeline-signals.jsonl](../../../../signals/pipeline-signals.jsonl)

## Implementation Directives

- Run this task only while mutation-capable stages remain skipped for this slice.
- Evaluate layering-boundary risks and dependency-direction ambiguities from docs and planning artifacts.
- Append a valid `governance-gap` signal entry with explicit layering evidence and remediation direction.
- Include explicit note that `domainspec-audit-layering` is deferred until mutation starts.

## Completion Criteria

- Layering governance signal is emitted when risk exists, or a no-risk determination is documented with evidence.
- Signal payloads conform to `SIGNAL-SCHEMA.md` constraints.
- Evidence links in `WORK-PACK.md` reference emitted signal rows.

## Verification Evidence

- `bash tools/check_markdown_links.sh docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-WP-SIGNAL-LAYERING.md`
- `rg -n '"type"\s*:\s*"governance-gap"' docs/signals/pipeline-signals.jsonl`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                               |
| ----------- | -------- | -------- | ---------------------------------------------------------------------------------- |
| D-AEO-002   | yes      | selected | Provider/adapter boundaries stay contract-first while mutation stages are deferred |
| D-AEO-004   | yes      | selected | Cancellation and run-state boundaries must remain deterministic and auditable      |
