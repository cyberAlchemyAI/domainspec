# Grill-With-Docs Interviewer Inventory (Decision Preflight)

## Purpose

Inventory and adapt the `grill-with-docs` interviewing pattern so task execution starts only after key decisions are explicit.

Source skill repository path:

- https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs

Raw source files reviewed:

- https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/grill-with-docs/SKILL.md
- https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/grill-with-docs/CONTEXT-FORMAT.md
- https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/grill-with-docs/ADR-FORMAT.md

## What It Adds

- Relentless one-question-at-a-time interviewing before implementation.
- Immediate challenge of ambiguous terms against canonical glossary.
- Scenario-based pressure tests for boundary and edge-case clarity.
- Decision capture as the conversation progresses, not after execution.

## Extracted Core Pattern

1. Ask one question at a time and wait for response.
2. Provide a recommended answer with each question.
3. If code can answer the question, inspect code before asking.
4. Challenge terminology conflicts against existing definitions.
5. Stress-test with concrete scenarios and contradictions.
6. Persist resolved language decisions immediately.
7. Offer ADR only when all three are true:
   - hard to reverse,
   - surprising without context,
   - result of a real trade-off.

## DomainSpec Adaptation For This Feature

Use this as a decision preflight before each C1 task execution.

### Decision Preflight Inputs

- [SPEC.md](../../SPEC.md)
- [domain.md](../../domain.md)
- [operations.md](../../operations.md)
- [rules.md](../../rules.md)
- active task file under `work-pack/tasks/`

### Decision Preflight Questions (Minimum Set)

1. Which route selection mode applies: `full-lifecycle` or `stage-subset`?
2. Which ordered stages are in scope for this task, and why this order?
3. Does any selected stage require `isolated-child-run`?
4. Which evidence fields are mandatory at this step versus deferred?
5. Which terminology in this task is still ambiguous and must be resolved now?

### Exit Conditions Before Task Execution

- No unresolved blocker decision remains for task scope.
- Terminology conflicts are resolved and documented.
- Stage order and isolation decisions are explicit.
- Evidence obligations for the task are explicit.

### Output Artifact Contract

For each task, append a short "Decision Preflight Snapshot" section with:

- selected answers,
- alternatives rejected,
- unresolved risks (if any),
- links to supporting spec sections.

## Initial Adoption Scope

- Start at [TASK-AEO-C1-02.md](../tasks/TASK-AEO-C1-02.md).
- Apply the same preflight pattern to C1-03 through C1-07.
