# TASK-AEO-WP-AUDIT-ALIGNMENT - Execute Alignment Audit

## Goal

Run `domainspec-audit-alignment` for `agent-execution-orchestrator`, publish `ALIGNMENT-REPORT.md`, and capture deterministic remediation obligations for all alignment drift findings.

## Wave Assignment

- Primary wave: W3

## Status

deferred-until-mutation

## DomainSpec Coverage

| Source                                                                                               | Coverage IDs                                                                  |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [WORK-PACK.md](../../WORK-PACK.md)                                                                   | audit-alignment closure stage                                                 |
| [PROJECT-OVERVIEW.md](../../../../interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md)       | explicit route composition intent, Sandcastle lifecycle intent                |
| [INITIAL-DEFINITIONS.md](../../../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md) | ExecutionRun, RunStateMachine, SandboxProviderInterface, BranchStrategyPolicy |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [ARCHITECTURE-FOUNDATIONS.md](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [domainspec-audit-alignment SKILL.md](../../../../../copilot/skills/domainspec-audit-alignment/SKILL.md)

## Implementation Directives

- This task is deferred while the current slice remains docs-only/non-mutation.
- Reactivate when the first mutation-capable stage (`backend-implement`, `instrument-otel`, `infra-deploy`, or code-tag mutation) starts.
- Execute alignment audit only after feature docs/tests/implementation are available.
- Publish report at `docs/features/agent-execution-orchestrator/ALIGNMENT-REPORT.md`.
- For every non-PASS finding, capture owner, remediation task reference, and re-run condition.

## Completion Criteria

- Alignment report exists with explicit verdict.
- Findings are mapped to remediation tasks with traceable evidence.

## Verification Evidence

- `domainspec-audit-alignment agent-execution-orchestrator`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                        |
| ----------- | -------- | -------- | --------------------------------------------------------------------------- |
| D-AEO-001   | yes      | selected | Alignment must validate `merge-to-head` lifecycle policy semantics          |
| D-AEO-002   | yes      | selected | Alignment must preserve provider-agnostic contract with Sandcastle baseline |
