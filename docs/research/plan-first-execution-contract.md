# Plan-First Execution Contract

Status: Draft for iteration
Date: 2026-05-02
Scope: DomainSpec workflow behavior (skills + agents)

## What we are trying to accomplish

Make DomainSpec execution plan-first for any task that is not trivial.

Primary outcome:

1. Medium/high complexity tasks must produce a structured plan artifact before any spec or code mutation.
2. The plan must capture context gaps, decision options with trade-offs, locked decisions, and wave-by-wave execution.
3. Pipeline and readiness stages must enforce this contract consistently.

## Why this matters

Without a shared plan contract, agents can execute with implicit assumptions, skip key trade-off decisions, and drift in quality across runs.

This contract is intended to:

- reduce ambiguity before mutation
- keep decisions portable across sessions/agents
- improve predictability of execution quality
- preserve DomainSpec semantic authority while reusing orchestration patterns

## Non-goals

- replace existing specialist commands
- force heavy planning for low complexity work
- move semantic authority from DomainSpec docs to GSD artifacts

## Contract summary

### Rule 1: Complexity gate first

Before mutation, classify task complexity as `low`, `medium`, or `high`.

Dimensions:

- ambiguity and unresolved decisions
- cross-feature/cross-layer blast radius
- governance and policy sensitivity
- execution size (estimated waves/tasks)

Policy:

- `low`: direct execution allowed
- `medium`: structured plan artifact required
- `high`: structured plan artifact required, delegated orchestration mode default

### Rule 2: Mandatory structured plan for medium/high

Required artifact path:

`docs/features/{feature}/WORK-PACK.md`

Required sections:

1. Context baseline
   - observed
   - stated
   - hypothesized
2. Gap register
   - blocker and non-blocker gaps
3. Clarification decision pack
   - option cards
   - trade-offs
   - recommended option
4. Decision lock table
   - selected option
   - rationale
   - source and timestamp
5. Wave execution plan
   - dependencies
   - gates
   - done criteria
   - evidence outputs
6. Structured execution prompt
   - compact execution contract for downstream agents
   - explicit boundaries (what not to do)
7. Traceability links
   - each wave step linked to feature aspect files

### Rule 2a: Work-pack must scale without bloat

`WORK-PACK.md` is the stable entrypoint, not necessarily the only file.

Task-local planning is the default for medium/high scope.

Scaling policy:

- Start with one file for medium scope.
- Split into modular files when the pack becomes large (for example: more than 3 waves, or the file exceeds a practical review size).

Recommended modular layout:

- `docs/features/{feature}/WORK-PACK.md` (manifest and navigation)
- `docs/features/{feature}/work-pack/shared/01-context.md`
- `docs/features/{feature}/work-pack/shared/02-cross-task-gaps-and-questions.md`
- `docs/features/{feature}/work-pack/shared/03-cross-task-decisions.md`
- `docs/features/{feature}/work-pack/shared/04-traceability.md`
- `docs/features/{feature}/work-pack/tasks/TASK-A.md`
- `docs/features/{feature}/work-pack/tasks/TASK-B.md`
- `docs/features/{feature}/work-pack/tasks/TASK-C.md`
- `docs/features/{feature}/work-pack/waves/W1.md`
- `docs/features/{feature}/work-pack/waves/W2.md`
- `docs/features/{feature}/work-pack/waves/W3.md`

Task file invariants:

1. Each task file must contain its own gaps/questions.
2. Each task file must contain its own decision lock entries.
3. Shared gaps/questions files are only for blockers affecting multiple tasks.

Manifest invariants:

1. The manifest must always exist.
2. The manifest must link all active module files.
3. The manifest must contain current status per wave.
4. Gates evaluate the manifest plus linked modules as one logical artifact.

### Rule 3: No mutation before decision lock

If blocker-level decisions are unresolved (task-local or cross-task), return BLOCK and stop before spec/test/code mutation.

### Rule 4: Wave-by-wave execution only

For medium/high work, execution must follow the defined wave sequence. A blocked gate in one wave blocks later waves.

### Rule 5: Readiness profile required at completion

Completion must include an explicit readiness profile and verdict.

Profiles:

- `pilot`
- `release-candidate`
- `production`

## How pipeline and readiness integrate this contract

Pipeline exists to enforce the plan contract end-to-end, not to replace it.

Integration points:

1. Planner/orchestrator run complexity gate.
2. Decision gate enforces task-level and cross-task lock before mutation.
3. Specialist skills execute waves from the work-pack manifest and linked wave modules.
4. Verifier checks required artifacts and evidence.
5. Readiness stage emits final profile-based verdict.

## Planner authority and invocation policy

Planner is the control plane for this contract.

Authority rules:

1. Orchestrator triggers planner preflight before mutation-capable execution.
2. Planner owns complexity classification and writes gate status to the work-pack manifest.
3. Specialist skills execute only when planner gate is PASS for the target task/wave.
4. If planner gate is missing or stale, specialists must return BLOCK and request planner preflight.

Recommended manifest control fields:

- `plannerGateStatus`: pass | block
- `complexity`: low | medium | high
- `activePlanRef`: path to current plan artifact
- `lastPlannedAt`: ISO timestamp

Invocation policy:

### Mandatory planner-gated commands

- `domainspec-pipeline`
- `domainspec-implement`
- `domainspec-ui-pipeline`
- `domainspec-task-session`
- `domainspec-spec-feature` for medium/high scope
- `domainspec-pilot-readiness` when it mutates docs or decisions

### Conditional planner-gated commands

- `domainspec-interview-scope` when transitioning from discovery to mutation planning
- `domainspec-generate-tests` when test updates imply cross-aspect decision surfaces
- `domainspec-spec-feature` for low complexity only when no unresolved decisions exist

### Planner bypass by default

- `domainspec-help`
- read-only audits and verification commands
- deterministic sync-only commands with no decision surface

Compatibility note:

Commands remain directly callable. Planner preflight can be implicit (auto-invoked) or explicit, but mutation may not proceed without a valid planner gate.

## Command compatibility and evolution

Compatibility constraints:

- keep all existing `domainspec-*` specialist commands callable
- preserve direct advanced/internal invocation

Readiness evolution options:

- Option A: keep `domainspec-pilot-readiness`, add `--profile`
- Option B: add `domainspec-readiness-gate` and keep pilot command as alias

## Role contracts

### Interviewer

Must produce context baseline, then generate task-local gap/question packs with options and trade-offs.

### Spec writer

Must consume decision locks and wave scope before mutating SPEC/aspect docs.

### Implementer

Must execute by wave with gate checks and evidence capture.

### Planner/orchestrator

Must enforce complexity gate, mandatory `WORK-PACK.md`, and decision lock before mutation.

### Verifier

Must fail medium/high completion when required plan artifacts/evidence are missing.

### All other mutation-capable specialists

Must validate planner gate status before writing changes. If invalid, they must stop and hand off to planner preflight.

## Minimal required artifacts for medium/high completion

- `docs/features/{feature}/WORK-PACK.md`
- `docs/features/{feature}/work-pack/` module files (when split mode is active)
- `docs/features/{feature}/work-pack/tasks/*.md` with task-local gaps/questions and decisions
- `docs/features/{feature}/DECISIONS.md` (or profile-specific decision artifact)
- updated SPEC/test artifacts with wave trace links
- readiness verdict with selected profile and evidence

## Mapping to SPDD and GSD (bounded reuse)

SPDD contribution:

- prompt/spec-first discipline
- explicit boundaries and trade-offs
- sync-oriented thinking

GSD contribution:

- discuss/plan/execute wave orchestration mechanics

Boundary rule:

- DomainSpec remains semantic source of truth.
- GSD remains orchestration support layer.

## Definition of done for this initiative

This initiative is complete when:

1. Medium/high tasks are blocked unless `WORK-PACK.md` exists and decision lock is complete.
2. Specialist skills consume and update the same work-pack artifact.
3. Verifier/readiness checks enforce profile-based evidence requirements.
4. Low complexity tasks remain lightweight and backward compatible.

## Implementation phases

### Phase 1: Documentation and template

1. Add `templates/work-pack.md`.
2. Align command docs with the plan-first contract.

### Phase 2: Gate wiring

1. Add complexity scoring behavior to orchestrator/planner flow.
2. Enforce work-pack requirement for medium/high.

### Phase 3: Specialist adoption

1. Interviewer writes context/gaps/decision-pack sections.
2. Spec writer and implementer execute and report by wave.

### Phase 4: Readiness generalization

1. Introduce profile model while keeping pilot compatibility.

### Phase 5: Verification hardening

1. Block completion on missing required artifacts/evidence.

## Open design questions

1. Single decision file vs profile-specific decision files?
2. Should split thresholds be fixed or repository-tunable?
3. Should low complexity optionally support a lightweight work-pack mode?
4. Auto-select readiness profile or always ask explicitly?
5. Minimum evidence package per readiness profile?

## Locked decisions (2026-05-02)

The following rollout decisions are resolved for implementation waves:

1. Planner gate scope: all mutation-capable commands.
2. Readiness evolution: Option B (`domainspec-readiness-gate`) with pilot compatibility retained.
3. Copy policy: mirror skill updates to additional runtime copies now.
4. Planner gate staleness rule: conservative.
5. Enforcement rollout: hard rollout now.
6. Existing feature backfill: lazy backfill on first medium/high execution.

## Immediate next step

Implement Phase 1 and Phase 2 first. Do not start specialist rewiring before complexity gate and plan artifact enforcement are stable.

## Worked example

For a concrete walkthrough with multiple tasks on the same feature, see:

- `plan-first-execution-contract-example.md`
