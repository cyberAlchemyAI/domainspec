# TASK-AEO-WP-TAG-CODE - Apply DomainSpec Source Tags and Validate Drift

## Goal

Run `domainspec-tag-code` for `agent-execution-orchestrator`, then publish tag extraction/validation/drift outcomes as closure evidence.

## Wave Assignment

- Primary wave: W3

## Status

deferred-until-mutation

## DomainSpec Coverage

| Source                                                                                               | Coverage IDs                                                             |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [WORK-PACK.md](../../WORK-PACK.md)                                                                   | AEO-WP-TAG closure obligation, stage coverage closure                    |
| [INITIAL-DEFINITIONS.md](../../../../interviews/agent-execution-orchestrator/INITIAL-DEFINITIONS.md) | ExecutionRun, RunStateMachine, ExecuteRun, ResumeRun, RunArtifactMapping |
| [PROJECT-DECISIONS.md](../../../../interviews/agent-execution-orchestrator/PROJECT-DECISIONS.md)     | PD-005, D-AEO-002                                                        |

## Architecture References

- [TAXONOMY.md](../../../../../domainspec/TAXONOMY.md)
- [RELATIONSHIPS.md](../../../../../domainspec/RELATIONSHIPS.md)
- [domainspec-tag-code SKILL.md](../../../../../copilot/skills/domainspec-tag-code/SKILL.md)

## Implementation Directives

- This task is deferred while the current slice remains docs-only/non-mutation.
- Reactivate when the first mutation-capable stage starts and implementation artifacts exist.
- Execute tagging only after spec/test/implementation artifacts exist and pass baseline checks.
- Ensure tags cover orchestrator lifecycle concepts and policy constructs with no placeholder tags.
- Publish extraction, validation, and drift outputs to feature evidence artifacts.
- If drift is detected, create follow-up remediation tasks and keep this task immutable as closure evidence.

## Completion Criteria

- Tag command completed with extract + validate + drift outcomes published.
- Tag evidence maps to feature concept tokens and route contracts.
- Remediation follow-up items are created for any non-PASS result.

## Verification Evidence

- `domainspec-tag-code agent-execution-orchestrator`

## Gaps and Questions

- None at planning seed stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                                 |
| ----------- | -------- | -------- | ------------------------------------------------------------------------------------ |
| D-AEO-002   | yes      | selected | Tagging must preserve provider-agnostic baseline with Sandcastle reference semantics |
