# WORK-PACK: {feature-name}

## Purpose

Plan-first execution manifest for medium/high complexity feature work.

This file is the stable entrypoint for planning state. It can stay single-file for small scope or link split modules under `work-pack/` for larger scope.

## Planner Control Fields

| Field             | Value                                  | Notes                                 |
| ----------------- | -------------------------------------- | ------------------------------------- |
| plannerGateStatus | pass / block                           | Must be `pass` before mutation stages |
| complexity        | low / medium / high                    | Planner-assigned current level        |
| activePlanRef     | {path}                                 | Current wave or plan file reference   |
| lastPlannedAt     | YYYY-MM-DDTHH:MM:SSZ                   | ISO timestamp                         |
| readinessProfile  | pilot / release-candidate / production | Completion target profile             |

## Task Status Board

| Task ID | Goal   | Complexity          | Assigned Waves | Gate Status     | Status                                |
| ------- | ------ | ------------------- | -------------- | --------------- | ------------------------------------- |
| TASK-A  | {goal} | low / medium / high | W1, W2         | ready / blocked | not-started / in-progress / completed |

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
- `work-pack/waves/W1.md`

## Wave Status Board

| Wave | Objective   | Entry Gate   | Exit Gate    | Status                                | Evidence |
| ---- | ----------- | ------------ | ------------ | ------------------------------------- | -------- |
| W1   | {objective} | {conditions} | {conditions} | not-started / in-progress / completed | {links}  |

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
- Shared files are for cross-task blockers and dependencies only.
- If planner gate is `block`, do not run mutation-capable stages.

## Change Log

| Date       | Change                    | Author |
| ---------- | ------------------------- | ------ |
| YYYY-MM-DD | Initial work-pack created | {name} |
