# TASK-UPS-WP-AUDIT-LAYERING - Execute Layering Audit

## Goal

Run `domainspec-audit-layering` for `ui-prototyping-studio`, publish `LAYERING-ALIGNMENT-REPORT.md`, and consolidate layering remediation with alignment findings.

## Wave Assignment

- Primary wave: W3

## Status

not-started

## DomainSpec Coverage

| Source                               | Coverage IDs                                                   |
| ------------------------------------ | -------------------------------------------------------------- |
| [domain.md](../../domain.md)         | StudioSession, MutationBatch, RevisionManifestEntry            |
| [operations.md](../../operations.md) | InitializeSession, SynthesizeMutationBatch, ApplyApprovedBatch |
| [interfaces.md](../../interfaces.md) | UIPrototypingStudioAPI, StudioOrchestrationModule              |
| [workflows.md](../../workflows.md)   | MVPStudioIterationWorkflow, GovernanceGatePolicy               |
| [states.md](../../states.md)         | StudioSessionState                                             |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [Architecture Foundations](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [Layering Reference](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)
- [Dependency Rules](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)

## Implementation Directives

- Execute layering audit after implementation tasks and alignment audit output are available.
- Save report at `docs/features/ui-prototyping-studio/LAYERING-ALIGNMENT-REPORT.md`.
- Merge layering remediation with alignment remediation into a single dependency-ordered track in `WORK-PACK.md` updates.

## Completion Criteria

- Layering report exists with explicit violations and dependency-order remediation notes.
- Consolidated remediation track is reflected in work-pack follow-up tasks.

## Verification Evidence

- `domainspec-audit-layering ui-prototyping-studio`

## Gaps and Questions

- None for planning stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                             |
| ----------- | -------- | -------- | ---------------------------------------------------------------- |
| D-005       | yes      | selected | Manual governance flow requires strict layer boundaries          |
| D-007       | yes      | selected | Adapter-only compatibility must not leak into domain/application |
