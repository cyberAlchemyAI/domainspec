# TASK-UPS-WP-AUDIT-ALIGNMENT - Execute Alignment Audit

## Goal

Run `domainspec-audit-alignment` for `ui-prototyping-studio`, publish `ALIGNMENT-REPORT.md`, and capture remediation obligations when drift is detected.

## Wave Assignment

- Primary wave: W3

## Status

blocked

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| [SPEC.md](../../SPEC.md)             | StudioSession, UIPrototypingStudioAPI, GovernanceGatePolicy                                           |
| [operations.md](../../operations.md) | InitializeSession, GenerateVariants, SelectOrCommitBaseline, ApproveMutationBatch, ApplyApprovedBatch |
| [interfaces.md](../../interfaces.md) | UIPrototypingStudioAPI, NewspaperContractAdapter                                                      |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [Architecture Foundations](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [Dependency Rules](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)

## Implementation Directives

- Execute alignment audit after implementation tasks and after verification output is available.
- Save report at `docs/features/ui-prototyping-studio/ALIGNMENT-REPORT.md`.
- For every non-PASS item, create explicit remediation entries linked back to source IDs.

## Completion Criteria

- Alignment report exists with clear PASS/FLAG/BLOCK verdict.
- Remediation actions are listed with owner and follow-up path.

## Verification Evidence

- `domainspec-audit-alignment ui-prototyping-studio`
- `../evidence/UPS-WP-AUDIT-ALIGNMENT/uips-task01-alignment-20260508T021240Z.log`
- `../evidence/UPS-WP-AUDIT-ALIGNMENT/uips-task01-alignment-20260508T021240Z-obligation-coverage-v2.log`
- `../../ALIGNMENT-REPORT.md`

## Execution Outcome

| Field          | Value                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| stageRunId     | uips-task01-alignment-20260508T021240Z                                         |
| outcome        | blocked                                                                        |
| suspectedStuck | false                                                                          |
| retryCount     | 0                                                                              |
| blocker        | Missing WP-02/WP-03 contracts and production-path in-memory repository binding |

## Gaps and Questions

- Alignment drift is expected while WP-02 and WP-03 remain unimplemented.

## Decision Lock

| Decision ID | Required | Status   | Note                                                       |
| ----------- | -------- | -------- | ---------------------------------------------------------- |
| D-005       | yes      | selected | Manual governance checks are mandatory in alignment audit  |
| D-007       | yes      | selected | Adapter-only compatibility boundary must remain drift-free |
