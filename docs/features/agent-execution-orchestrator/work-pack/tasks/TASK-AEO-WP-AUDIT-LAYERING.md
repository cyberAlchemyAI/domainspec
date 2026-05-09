# TASK-AEO-WP-AUDIT-LAYERING - Execute Layering Audit

## Goal

Run `domainspec-audit-layering` for `agent-execution-orchestrator`, publish `LAYERING-ALIGNMENT-REPORT.md`, and create deterministic remediation tasks for dependency-direction or boundary violations.

## Wave Assignment

- Primary wave: W3

## Status

deferred-until-mutation

## DomainSpec Coverage

| Source                                                                                               | Coverage IDs                                                                                         |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [WORK-PACK.md](../../WORK-PACK.md)                                                                   | audit-layering closure stage                                                                         |
| [INITIAL-DEFINITIONS.md](../../../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md) | SandboxProviderInterface, BranchStrategyPolicy, RunArtifactMapping, PlannerGateBeforeFeatureMutation |
| [PROJECT-OVERVIEW.md](../../../../interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md)       | bounded context separation and reliability controls                                                  |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [LAYERING-REFERENCE.md](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)
- [DEPENDENCY-RULES.md](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)
- [domainspec-audit-layering SKILL.md](../../../../../copilot/skills/domainspec-audit-layering/SKILL.md)

## Implementation Directives

- This task is deferred while the current slice remains docs-only/non-mutation.
- Reactivate when the first mutation-capable stage (`backend-implement`, `instrument-otel`, `infra-deploy`, or code-tag mutation) starts.
- Execute layering audit after implementation and verification artifacts are available.
- Publish report at `docs/features/agent-execution-orchestrator/LAYERING-ALIGNMENT-REPORT.md`.
- Convert each layering violation into explicit remediation tasks with dependency-direction fixes.

## Completion Criteria

- Layering report exists with explicit verdict and evidence links.
- All non-PASS findings are mapped to remediation tasks and re-run criteria.

## Verification Evidence

- `domainspec-audit-layering agent-execution-orchestrator`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                          |
| ----------- | -------- | -------- | ----------------------------------------------------------------------------- |
| D-AEO-002   | yes      | selected | Provider adapter baseline must remain isolated behind orchestration contracts |
| D-AEO-004   | yes      | selected | Cancellation semantics must not violate dependency-direction boundaries       |
