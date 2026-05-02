# Plan-First Contract: Worked Example (Same Feature, Multiple Tasks)

Status: Example
Date: 2026-05-02

## Scenario

Feature: `knowledge-graph-visualization`

A team needs to run three tasks in the same feature scope:

1. Task A (docs policy): tighten lens persistence policy language in spec artifacts.
2. Task B (governance behavior): add automatic expiry handling requirements for risk exceptions.
3. Task C (readiness): prepare pilot-readiness evidence package.

This example shows how one feature can use one work-pack manifest with modular task and wave files.

## Step 0: Planner preflight for all mutation paths

Control flow:

1. User enters via orchestrator with a same-feature multi-task request.
2. Orchestrator invokes planner preflight once for the feature.
3. Planner classifies each task, updates manifest gate fields, and assigns waves.
4. Specialists execute only tasks/waves with planner gate PASS.
5. If gate is missing/stale, specialists BLOCK and request planner refresh.

Example command policy in this scenario:

| Command                      | Planner preflight required    | Reason                                                |
| ---------------------------- | ----------------------------- | ----------------------------------------------------- |
| `domainspec-spec-feature`    | yes                           | Task A and B are medium/high mutation tasks           |
| `domainspec-generate-tests`  | yes (conditional -> yes here) | Cross-aspect updates from Task A and B                |
| `domainspec-implement`       | yes                           | Mutation-capable execution                            |
| `domainspec-pilot-readiness` | yes                           | Produces readiness evidence and may update artifacts  |
| `domainspec-verify-feature`  | no (read-only)                | Verification checks evidence, does not plan mutations |

## Step 1: Complexity gate per task

| Task | Ambiguity | Blast radius | Governance sensitivity | Estimated size | Complexity |
| ---- | --------- | ------------ | ---------------------- | -------------- | ---------- |
| A    | low       | medium       | medium                 | small          | medium     |
| B    | medium    | medium       | high                   | medium         | high       |
| C    | low       | low          | high                   | small          | medium     |

Result:

- Task A, B, C all require plan-first execution artifacts.
- Task B defaults to delegated orchestration mode.

## Step 2: Create or update one feature work-pack

Stable entrypoint:

- `docs/features/knowledge-graph-visualization/WORK-PACK.md`

Modular structure:

- `docs/features/knowledge-graph-visualization/work-pack/shared/01-context.md`
- `docs/features/knowledge-graph-visualization/work-pack/shared/02-cross-task-gaps-and-questions.md`
- `docs/features/knowledge-graph-visualization/work-pack/shared/03-cross-task-decisions.md`
- `docs/features/knowledge-graph-visualization/work-pack/shared/04-traceability.md`
- `docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-A.md`
- `docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-B.md`
- `docs/features/knowledge-graph-visualization/work-pack/tasks/TASK-C.md`
- `docs/features/knowledge-graph-visualization/work-pack/waves/W1.md`
- `docs/features/knowledge-graph-visualization/work-pack/waves/W2.md`
- `docs/features/knowledge-graph-visualization/work-pack/waves/W3.md`

## Step 3: Manifest status board in WORK-PACK.md

Example status table:

| Task   | Goal                                   | Complexity | Assigned waves | Gate status                             | Current status |
| ------ | -------------------------------------- | ---------- | -------------- | --------------------------------------- | -------------- |
| Task A | Lens persistence policy clarification  | medium     | W1, W2         | decision-lock required                  | in-progress    |
| Task B | Exception expiry behavior requirements | high       | W1, W2, W3     | decision-lock required + delegated mode | not-started    |
| Task C | Pilot readiness evidence pack          | medium     | W2, W3         | readiness profile required              | not-started    |

Manifest control fields should also show planner authority state:

- `plannerGateStatus: pass`
- `activePlanRef: work-pack/waves/W1.md`
- `lastPlannedAt: 2026-05-02T00:00:00Z`

## Step 4: Questions and trade-offs before mutation

Each task file contains its own gaps/questions and options.

Example location for Task B:

- `work-pack/tasks/TASK-B.md` -> `## Gaps and Questions`

Example blocker for Task B:

- Question: exception expiry enforcement model
- Option 1: passive expiry (enforced on read)
  - faster implementation
  - weaker determinism for timing-sensitive controls
- Option 2: active expiry (scheduled revocation + read enforcement)
  - stronger governance behavior
  - higher operational complexity
- Recommended: Option 2 for high governance sensitivity

If a blocker affects multiple tasks, it goes to:

- `work-pack/shared/02-cross-task-gaps-and-questions.md`

No spec/test/code mutation starts until blocker decisions are locked in task files (and shared decisions file when cross-task blockers exist).

## Step 4a: Example task prompts (copy-paste)

Use this pattern for any task prompt:

```text
Feature: <feature-name>
Task: <task-id>
Wave: <wave-id>
Goal: <what must be achieved>
Scope limits: <what files/areas can be changed>
Gate preconditions: <what must be true before mutation>
Expected outputs: <files and evidence to produce>
Stop conditions: <when to BLOCK>
```

### Prompt 1: Planner preflight for all tasks

```text
@domainspec-orchestrator domainspec-orchestrate "For feature knowledge-graph-visualization, run planner preflight for Task A, Task B, and Task C. Create or update WORK-PACK.md, classify complexity per task, assign waves, and set planner gate fields. Do not mutate spec or code artifacts yet."
```

### Prompt 2: Task A execution prompt (spec update)

```text
@domainspec-spec-writer domainspec-spec-feature knowledge-graph-visualization --update

Execute Task A from work-pack/tasks/TASK-A.md in Wave W2.
Goal: tighten lens persistence policy language in feature docs.
Scope limits: only files mapped by Task A traceability links.
Gate preconditions: plannerGateStatus=pass and Task A decision lock resolved.
Expected outputs: updated spec artifacts plus traceability evidence links in WORK-PACK manifest.
Stop conditions: if planner gate is missing/stale or Task A has unresolved blocker decisions, return BLOCK.
```

### Prompt 3: Task B execution prompt (high complexity delegated mode)

```text
@domainspec-implementer domainspec-implement knowledge-graph-visualization --mode gsd-phase

Execute Task B from work-pack/tasks/TASK-B.md in Waves W2-W3.
Goal: add automatic expiry handling requirements and corresponding implementation obligations.
Scope limits: only Task B mapped docs/code surfaces.
Gate preconditions: plannerGateStatus=pass, Task B decision lock resolved, and cross-task blockers resolved.
Expected outputs: updated artifacts, verification evidence per wave, and gate status updates in WORK-PACK.md.
Stop conditions: if any wave gate fails, stop progression to next wave and return BLOCK with remediation actions.
```

### Prompt 4: Task C execution prompt (readiness package)

```text
@domainspec-verifier domainspec-readiness-gate knowledge-graph-visualization --profile pilot --mode native

Execute Task C from work-pack/tasks/TASK-C.md in Wave W3.
Goal: produce pilot readiness evidence package and verdict.
Scope limits: readiness artifacts and linked verification outputs only.
Gate preconditions: plannerGateStatus=pass and prerequisite waves completed.
Expected outputs: pilot readiness verdict (PASS/FLAG/BLOCK), blockers list, and next actions.
Stop conditions: if prior wave evidence is incomplete, return BLOCK and list missing evidence.
```

## Step 5: Wave plan across tasks

Wave files coordinate task execution while preserving one feature context.

### W1 (planning and decision lock)

- finalize context baseline for all tasks
- resolve blocker questions for Task A and Task B
- write decision lock entries

Exit gate:

- all blocker decisions resolved

### W2 (spec and test obligations)

- apply Task A policy updates in feature docs
- apply Task B behavior requirements in feature docs
- derive or update test obligations for Task A and Task B
- start Task C readiness checklist skeleton

Exit gate:

- updated docs trace to decision locks
- no unresolved blocker-level gaps

### W3 (verification and readiness)

- run verification checks for changed obligations
- complete readiness profile evidence for Task C
- emit final verdict for pilot profile

Exit gate:

- readiness verdict is PASS or FLAG with explicit follow-up actions

## Step 6: How this prevents bloat and confusion

Why one manifest plus modules works:

1. One stable place to check overall feature status.
2. Per-task files keep details isolated and reviewable.
3. Per-wave files keep execution order explicit.
4. Shared files capture only cross-task dependencies.
5. Gates evaluate the full pack as one logical artifact.

## Step 7: Adding a new task later

If a new Task D appears (same feature), do not create a separate planning universe.

Instead:

1. add `work-pack/tasks/TASK-D.md`
2. update WORK-PACK status board
3. assign Task D to existing or new waves
4. run complexity gate and decision lock for Task D only

This keeps a single feature execution narrative without forcing one giant file.
