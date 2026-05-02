---
name: domainspec-task-session
description: Run one implementation plan task as a guided interactive session with option trade-offs, gate checks, completion criteria, and sync updates.
argument-hint: "<task-id-or-file> [--auto] [--dry-run]"
agent: domainspec-task-executor
allowed-tools: Read, Write, Glob, Grep, AskQuestions, Task, Bash
---

<objective>
Execute a single plan task end-to-end with minimal user friction: ask focused interactive questions, resolve option trade-offs explicitly, enforce gates, complete the task, and synchronize artifacts.
</objective>

<context>
Read first:
- domainspec/CHANGELOG.md
- implementation/domainspec/plan/index.md
- implementation/domainspec/plan/VISION.md
- implementation/domainspec/plan/TRACEABILITY.md
- implementation/domainspec/ADLC-ALIGNMENT.md

Resolve target task from either:

- task ID (for example: `CTX-01`, `INF-03`, `GOV-02`)
- explicit file path under `implementation/domainspec/plan/`
  </context>

<flags>
- `--auto`: choose the recommended option for each decision and continue without interactive prompts.
- `--dry-run`: return execution path, decisions, and gate checks without mutating files.
</flags>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
## Step 0 - Resolve Task Session Scope

1. Read framework constraints from `domainspec/CHANGELOG.md`.
2. Resolve the target task file:
   - If input is an ID, map by filename prefix in `implementation/domainspec/plan/**`.
   - If ambiguous, ask a focused clarification question.
3. Parse task objective, dependencies, implementation tasks, deliverables, and done criteria.

## Step 1 - Build Decision Pack (Interactive)

4. Enumerate unresolved implementation decisions with more than one viable option.
5. For each decision, build option cards with:
   - what the option entails
   - short-term consequences
   - long-term consequences
   - trade-offs across speed, complexity, risk, governance impact, and maintenance
   - recommended option with rationale
6. Ask the user to choose each decision:
   - Preferred: AskQuestions with objective option labels and concise consequences.
   - If `--auto`, choose the recommended option and record that it was auto-selected.
   - If AskQuestions is unavailable, use plain numbered choices in chat and require explicit selection.

## Step 2 - Gate Handling (Hard Gate)

7. Evaluate dependency and governance gates before mutation:
   - Task dependencies listed in the task file.
   - Saturn-critical dependency constraints from `implementation/domainspec/plan/index.md`.
   - Governance blocking policy alignment (`GOV-01`, `GOV-02`, `GOV-03`) when applicable.
8. If any blocker is unresolved:
   - Return BLOCK.
   - Provide exact unblock actions, owner recommendation, and sequence.
   - Stop before implementation mutation.

## Step 3 - Execute Task

9. Convert selected options + task checklist into ordered execution steps.
10. Execute implementation updates (docs/code/tests/config) for the task scope.
11. Validate completion using task done criteria.
12. Run relevant validation commands based on touched assets (tests, lint, docs checks, scripts).

## Step 4 - Synchronize Work

13. Synchronize task completion state and traceability artifacts:

- Update the target task file done criteria checkboxes where evidence exists.
- Update `implementation/domainspec/plan/TRACEABILITY.md` when alignment mappings changed.
- Update `implementation/domainspec/plan/index.md` when prioritization/order is affected.
- Update `implementation/domainspec/ADLC-ALIGNMENT.md` when ADLC/H-task mapping changed.

14. If no sync change is needed, report explicitly why.

## Step 5 - Session Report

15. Return a compact report with:

- task resolved
- decisions and selected options
- trade-offs and consequences summary
- gate verdict (PASS/BLOCK)
- files updated
- validations run and results
- remaining follow-up items
  </process>

<error-handling>
- Task not found -> BLOCK with candidate matches.
- Ambiguous task ID -> ask clarification before any mutation.
- Unresolved blocker decision -> BLOCK.
- Gate failure -> BLOCK with ordered remediation.
- Validation failures after retries -> FLAG with required follow-up actions.
</error-handling>

<authority-rule>
- Task file and DomainSpec governance artifacts are source of truth.
- No mutation proceeds when gate status is BLOCK.
- Decision options must include explicit consequences and trade-offs before selection.
</authority-rule>
