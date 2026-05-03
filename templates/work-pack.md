# WORK-PACK: {feature-name}

## Purpose

Plan-first execution manifest for medium/high complexity feature work.

This file is the stable entrypoint for planning state. It can stay single-file for small scope or link split modules under `work-pack/` for larger scope.

## Planner Control Fields

| Field             | Value                                  | Notes                                 |
| ----------------- | -------------------------------------- | ------------------------------------- |
| plannerGateStatus | pass / block                           | Must be `pass` before mutation stages |
| complexity        | low / medium / high                    | Planner-assigned current level        |
| architectureWave  | W0                                     | Mandatory first wave for medium/high  |
| activePlanRef     | {path}                                 | Current wave or plan file reference   |
| lastPlannedAt     | YYYY-MM-DDTHH:MM:SSZ                   | ISO timestamp                         |
| readinessProfile  | pilot / release-candidate / production | Completion target profile             |

## Task Status Board

| Task ID              | Goal                                                               | Complexity          | Assigned Waves | Gate Status      | Status                                |
| -------------------- | ------------------------------------------------------------------ | ------------------- | -------------- | ---------------- | ------------------------------------- |
| TASK-A               | {goal}                                                             | low / medium / high | W1, W2         | ready / blocked  | not-started / in-progress / completed |
| TASK-VERIFY          | Execute feature verification verdict (`domainspec-verify-feature`) | medium / high       | W3+            | ready-after-impl | not-started / in-progress / completed |
| TASK-AUDIT-ALIGNMENT | Execute alignment audit (`domainspec-audit-alignment`)             | medium / high       | W3+            | ready-after-impl | not-started / in-progress / completed |
| TASK-AUDIT-LAYERING  | Execute layering audit (`domainspec-audit-layering`)               | medium / high       | W3+            | ready-after-impl | not-started / in-progress / completed |

## Mandatory Closure Obligations (Required for medium/high)

Seed the following tasks when the work-pack is first created, even if execution is planned for a later wave:

- One verification task that runs `domainspec-verify-feature {feature}` and publishes `VERIFICATION.md`.
- One alignment audit task that runs `domainspec-audit-alignment {feature}` and publishes `ALIGNMENT-REPORT.md`.
- One layering audit task that runs `domainspec-audit-layering {feature}` and publishes `LAYERING-ALIGNMENT-REPORT.md`.

If any closure task returns FLAG/BLOCK, add follow-up remediation tasks without deleting the original closure tasks.

## Architecture-Guided Task Directives (Required for medium/high)

For each mutation-capable task, add one directive row that maps DomainSpec coverage IDs to architecture-constrained implementation instructions.

| Task ID | DomainSpec Sources                                                         | Coverage IDs                  | Architecture References                                                                                                                          | Implementation Directive                                                                                                                                                           | Verification Evidence           |
| ------- | -------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| TASK-A  | operations.md#operation-id; queries.md#query-id; interfaces.md#endpoint-id | R1, R2, C1, WF-01, concept-id | domainspec/ARCHITECTURE.md#domain-layer-pure; domainspec/ARCHITECTURE.md#application-layer; domainspec/ARCHITECTURE.md#rule--calculation-pattern | Implement R1 and R2 as pure domain rule functions and call them from the operation/query use-case factory; keep adapters and transport concerns outside domain/application modules | TEST-SPEC IDs + command outputs |

Directive requirements:

- `Coverage IDs` must list exact IDs from docs (for example `R1`, `R2`, `C1`, `WF-TS-01`, concept IDs).
- `Architecture References` must include links to `domainspec/ARCHITECTURE.md` and to `docs/UI-ARCHITECTURE.md` or `docs/INFRA-ARCHITECTURE.md` when applicable.
- If `ui-pipeline` stage is not skipped, at least one directive must reference `UI-SPEC.md` and a UI architecture constraint.
- If alignment/layering findings exist, directives must include explicit closure steps for both.

## Required Links

### Single-file mode

Use this file only when scope is small and reviewable.

### Split mode

When scope grows (for example: >3 tasks, >3 waves, or >250 lines), split into modules and link them here.

- `work-pack/shared/01-context.md`
- `work-pack/shared/02-cross-task-gaps-and-questions.md`
- `work-pack/shared/03-cross-task-decisions.md`
- `work-pack/shared/04-traceability.md`
- `work-pack/tasks/TASK-A.md`
- `work-pack/waves/W0.md`
- `work-pack/waves/W1.md`

## Wave Status Board

| Wave | Objective                                  | Entry Gate          | Exit Gate                                                      | Status                                | Evidence |
| ---- | ------------------------------------------ | ------------------- | -------------------------------------------------------------- | ------------------------------------- | -------- |
| W0   | {architecture and stage coverage baseline} | {work-pack created} | {architecture baseline locked and full stage matrix populated} | not-started / in-progress / completed | {links}  |
| W1   | {objective}                                | {conditions}        | {conditions}                                                   | not-started / in-progress / completed | {links}  |

## Pipeline Stage Coverage (Required)

Keep all canonical pipeline stages listed below in every medium/high work-pack, even when a stage is skipped.

| Stage                 | Required | Wave Mapping | Status                                          | Evidence | Skip Reason |
| --------------------- | -------- | ------------ | ----------------------------------------------- | -------- | ----------- |
| plan                  | yes      | W0           | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| architecture-baseline | yes      | W0           | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| spec                  | yes      | W1+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| stories               | yes      | W1+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| tests                 | yes      | W1+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| backend-implement     | yes      | W1+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| ui-pipeline           | yes      | W1+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| observability-spec    | yes      | W2+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| instrument-otel       | yes      | W2+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| otel-verify           | yes      | W2+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| infra-deploy          | yes      | W2+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| registry-sync         | yes      | W2+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| verify-readiness      | yes      | W3+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| verify-feature        | yes      | W3+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| audit-alignment       | yes      | W3+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |
| audit-layering        | yes      | W3+          | not-started / in-progress / completed / skipped | {links}  | {optional}  |

When `ui-pipeline` status is not `skipped`, evidence must include `UI-SPEC.md` and at least one UI architecture reference.

## Decision Lock Summary

| Decision ID | Scope             | Status             | Selected Option | Source              | Date       |
| ----------- | ----------------- | ------------------ | --------------- | ------------------- | ---------- |
| D-001       | task / cross-task | selected / blocked | {option}        | AskQuestions / chat | YYYY-MM-DD |

## Blockers

| Blocker ID | Scope             | Description       | Owner   | Next Action      | Target Date |
| ---------- | ----------------- | ----------------- | ------- | ---------------- | ----------- |
| B-001      | task / cross-task | {what is blocked} | {owner} | {unblock action} | YYYY-MM-DD  |

## Notes

- Task files must contain `## Gaps and Questions` and `## Decision Lock` sections.
- Task files for newly planned/refreshed work must also contain `## DomainSpec Coverage`, `## Architecture References`, and `## Implementation Directives`.
- Shared files are for cross-task blockers and dependencies only.
- Wave `W0` is mandatory for medium/high plans and must be completed before mutation-capable stages.
- Pipeline stage coverage table must list all canonical stages and provide a status for each row.
- Medium/high work-pack creation must seed verification and both audit tasks before implementation starts.
- Medium/high work-pack creation must include architecture-guided directive rows with coverage IDs and architecture links for each mutation-capable task.
- If planner gate is `block`, do not run mutation-capable stages.

## Change Log

| Date       | Change                    | Author |
| ---------- | ------------------------- | ------ |
| YYYY-MM-DD | Initial work-pack created | {name} |
