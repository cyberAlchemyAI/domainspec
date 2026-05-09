# TASK-UPS-WP-VERIFY - Execute Feature Verification Verdict

## Goal

Run `domainspec-verify-feature` for `ui-prototyping-studio`, publish verification evidence, and open deterministic remediation tasks for any FLAG/BLOCK findings.

## Wave Assignment

- Primary wave: W3

## Status

not-started

## DomainSpec Coverage

| Source                             | Coverage IDs                                                             |
| ---------------------------------- | ------------------------------------------------------------------------ |
| [SPEC.md](../../SPEC.md)           | FR-001, FR-005, FR-012, AC-003, AC-004, AC-007, AC-010, AC-011           |
| [TEST-SPEC.md](../../TEST-SPEC.md) | UPS-CON-001, UPS-CON-011, UPS-OP-001, UPS-OP-010, UPS-UI-001, UPS-UI-008 |
| [workflows.md](../../workflows.md) | GovernanceGatePolicy, MVPStudioIterationWorkflow                         |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [Testing Alignment](../../../../../architecture/pattern-library/TESTING-ALIGNMENT.md)
- [TEST-PIPELINE.md](../../../../../TEST-PIPELINE.md)

## Implementation Directives

- Run verification only after W1 and W2 implementation tasks complete.
- Publish verification artifact as `docs/features/ui-prototyping-studio/VERIFICATION.md`.
- If verdict is FLAG or BLOCK, create follow-up remediation tasks and keep this task as immutable closure evidence.

## Completion Criteria

- Verification command completed with explicit verdict.
- Report saved at expected path.
- Follow-up tasks created for every non-PASS finding.

## Verification Evidence

- `domainspec-verify-feature ui-prototyping-studio`

## Gaps and Questions

- None for planning stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                  |
| ----------- | -------- | -------- | ----------------------------------------------------- |
| D-005       | yes      | selected | Manual governance gate outcomes must be verified      |
| D-007       | yes      | selected | Adapter-only boundary must be checked in verification |
