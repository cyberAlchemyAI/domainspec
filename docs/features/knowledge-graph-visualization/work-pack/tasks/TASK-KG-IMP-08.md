# TASK-KG-IMP-08 - Terminal-Safe Docs Validation Execution

## Goal

Prevent validation loops from terminating interactive shells while preserving full per-file diagnostics during documentation checkpoints.

## Wave Assignment

- Primary wave: W0

## Status

completed

## DomainSpec Coverage

| Source                                                 | Coverage IDs                                                |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| [WORK-PACK.md](../../WORK-PACK.md)                     | plannerGateStatus, activePlanRef, split-mode required links |
| [TASKS.md](../../TASKS.md)                             | ordered execution reliability checkpoint                    |
| [IMPLEMENTATION-PLAN.md](../../IMPLEMENTATION-PLAN.md) | Wave 0 contract lock and execution safety                   |

## Architecture References

- [Architecture Index](../../../../../architecture/ARCHITECTURE.md)
- [Architecture Foundations - Rule / Calculation Pattern](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md#rule--calculation-pattern)

## Implementation Directives

- Never end iterative validation loops with parent-shell `exit` in interactive terminals.
- Run loop body in a subshell when exit status propagation is needed.
- Always print a summary line (`failed=0|1`) after multi-file validation.
- Preserve per-file banners (`== file ==`) for deterministic troubleshooting.

## Execution Steps

1. Reproduce failing command and confirm shell termination mechanism.
2. Replace parent-shell exit pattern with subshell-safe variant.
3. Re-run feature doc link checks and capture full output.
4. Confirm shell remains active after command completion.

## Completion Criteria

- Feature docs loop emits output for every file in the target set.
- Command returns non-zero when any file fails, but shell remains usable.
- Safe command pattern is documented in execution notes and reusable.

## Verification Evidence

- Command transcript showing per-file checks and `SUMMARY failed=0`.
- Follow-up `echo shell-still-alive` output confirming terminal persistence.

## Gaps and Questions

- None.
