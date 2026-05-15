---
name: domainspec-orchestrate
description: Unified user-facing DomainSpec entrypoint. Route natural-language DomainSpec requests to the correct specialist domainspec-* workflow while preserving direct specialist commands for advanced/internal use.
argument-hint: "<natural-language-request>"
agent: domainspec-orchestrator
allowed-tools: Read, Glob, Grep, AskQuestions, Task
---

<objective>
Provide one stable user-facing DomainSpec entrypoint that classifies intent and dispatches to the right specialist workflow through delegated subagent execution.
</objective>

<context>
Read command definitions under `.github/skills/domainspec-*/SKILL.md`, package docs under `domainspec/copilot/`, and framework updates in `domainspec/CHANGELOG.md`.
</context>

<process>
1. Read `domainspec/CHANGELOG.md` and command skill definitions.
2. If the user explicitly requests a `domainspec-*` command, preserve and execute that command unchanged via delegated subagent execution.
3. If the request is DomainSpec natural language without an explicit command, map to one specialist workflow:
   - kickoff, discovery, or baseline gating -> `domainspec-start`
   - docs bootstrap -> `domainspec-init`
   - work-pack task implementation (`TASK-*` or `docs/features/{feature}/work-pack/tasks/*.md`) or backend implementation intent -> implementation workflow pipeline:
     1. `domainspec-context-builder <feature> [--task <TASK-ID|task-path>] --mode standard --strict --emit both`
     2. `domainspec-implement <feature>`
     3. `domainspec-tag-code <feature>`
     4. `domainspec-audit-alignment <feature>`
     5. `domainspec-audit-layering <feature>`
     6. `domainspec-verify-feature <feature>`
    - frontend/backend bugfix or behavior regression without explicit `TASK-*` -> enforced bugfix pipeline:
       1. `domainspec-plan-phase-bridge <feature> --mode native`
       2. `domainspec-context-builder <feature> [--task <TASK-ID|task-path>] --mode standard --strict --emit both`
       3. `domainspec-implement <feature>`
       4. `domainspec-tag-code <feature>`
       5. `domainspec-audit-alignment <feature>`
       6. `domainspec-audit-layering <feature>`
       7. `domainspec-verify-feature <feature>`
   - task context pack preparation for implementation predictability (without implementation request) -> `domainspec-context-builder <feature> [--task <TASK-ID|task-path>]`
   - end-to-end feature delivery -> `domainspec-pipeline <feature>`
   - feature spec authoring/evolution -> spec-to-task-sync pipeline:
      1. `domainspec-spec-feature <feature>`
      2. `domainspec-plan-phase-bridge <feature> --mode native`
      3. `domainspec-sync-user-stories <feature>`
   - feature architecture authoring/evolution -> `domainspec-feature-architecture <feature>`
   - feature glossary authoring/evolution -> `domainspec-feature-glossary <feature>`
   - implementation layering model design/evolution -> `domainspec-implementation-layering <feature>`
   - story sync -> `domainspec-sync-user-stories <feature>`
   - test derivation -> `domainspec-generate-tests <feature>`
   - post-implementation code tagging -> `domainspec-tag-code <feature>`
   - UI lifecycle -> `domainspec-ui-pipeline <feature>`
   - observability instrumentation -> `domainspec-instrument-otel <feature>`
   - observability verification -> `domainspec-otel-verify <feature>`
   - infrastructure architecture/sync -> `domainspec-infra-architecture` or `domainspec-infra-deploy <feature>`
   - audits/readiness -> `domainspec-audit-alignment`, `domainspec-audit-layering`, `domainspec-verify-feature <feature>`, or `domainspec-readiness-gate <feature> [--profile ...]`
   - command guidance -> `domainspec-help`
   - spec grilling, decision pressure, gap closing, or Robot-Talks synthesis on a feature -> `domainspec-interview-kits <feature-or-scope> [--mode grill-with-docs|robot-talks-grill-synthesis|audit-gap|readiness-gate|auto]`
   - greenfield domain discovery, brownfield scope audit, project baseline creation -> `domainspec-interview-scope`
4. If intent is ambiguous, ask focused clarification questions before selecting the route.
   - If a work-pack task ID is provided without resolvable feature context, ask for feature name before selecting the implementation workflow pipeline.
   - If the request is a bugfix/mutation and no `TASK-*` exists yet, require feature confirmation and create/update `WORK-PACK.md` plus one task artifact before implementation.
5. Planner-first enforcement for mutation-capable routes:
   - For `domainspec-pipeline`, `domainspec-spec-feature`, `domainspec-plan-phase-bridge`, `domainspec-generate-tests`, `domainspec-context-builder`, `domainspec-implement`, `domainspec-tag-code`, `domainspec-ui-pipeline`, and mutation-capable readiness flows, require delegated execution to establish or validate planner preflight and work-pack gate (`docs/features/{feature}/WORK-PACK.md`) before mutation.
   - For bugfix/mutation requests without explicit `TASK-*`, fail closed unless delegated `domainspec-plan-phase-bridge <feature> --mode native` runs first and produces/updates `work-pack/tasks/TASK-*.md` linked from `WORK-PACK.md`.
   - Read-only guidance and verification-only commands may bypass planner preflight.
5a. Delegation tuning policy (model + thinking budget):
   - Choose the lowest-cost profile that still satisfies stage risk/ambiguity; do not start at `xhigh` thinking by default.
   - `quick` profile: prefer `sonnet` with `low` thinking for deterministic/read-heavy stages (`domainspec-help`, `domainspec-init`, `domainspec-sync-registry`, `domainspec-sync-user-stories`, `domainspec-context-builder` in `lean|standard`).
   - `standard` profile: prefer `sonnet` with `medium` thinking for docs/planning synthesis (`domainspec-spec-feature`, `domainspec-generate-tests`, `domainspec-plan-phase-bridge`, `domainspec-audit-alignment`, `domainspec-audit-layering`, readiness/audit stages).
   - `deep` profile: prefer high-capability model with `high` thinking for high-risk mutation/architecture stages (`domainspec-implement`, `domainspec-pipeline`, `domainspec-ui-pipeline`, `domainspec-infra-architecture`, `domainspec-infra-deploy`, blocker-level `domainspec-decision-gate`).
   - Escalation rule: move to a higher profile only when unresolved ambiguity, safety risk, or architecture impact justifies it.
   - De-escalation rule: when a `high|xhigh` stage is suspected-stuck, retry once with reduced thinking (`medium` or `low`) and a narrowed stage prompt before final block.
   - If user preference is speed/cost-first, bias to `sonnet` + `low|medium` except for safety-critical stages.
6. Execution model requirements:
   - Every routed specialist stage must run through a delegated subagent call, including single-stage routes.
   - Do not execute specialist logic inline in the orchestrator.
    - Create a `stageRunId` for each delegated stage.
    - Before invoking each delegated stage, append a telemetry heartbeat row with `outcome: started` and the stage `stageRunId`.
    - Capture each stage result before advancing to the next stage.
    - Enforce watchdog windows per delegation profile:
       - `quick`: 8 minutes max
       - `standard`: 15 minutes max
       - `deep`: 25 minutes max
   - Run a subagent liveness verification gate after every delegated stage:
     - Mark stage `healthy` only when the delegated call returns a terminal outcome (`completed`, `blocked`, or `failed`) with stage evidence.
       - Mark stage `suspected-stuck` when any of these occur:
          - delegated stage does not return a terminal outcome,
          - watchdog window is exceeded,
          - repeated non-progress loop is detected (for example 12+ tool calls without new files, new evidence, or terminal output).
          - terminal command reports success (`exit 0`) but delegated stage still has lingering child process(es) or no terminal completion evidence.
          - `rg`/search timeout stall is detected (for example a single search runs >20s or the same pattern+path pair times out twice without new evidence).
       - On `suspected-stuck`: capture last available stage output/evidence, retry the same delegated stage once with narrowed scope and explicit execution caps.
          - For `domainspec-context-builder` retries, cap to at most 6 read/search batches and 1 write batch, and prohibit repeated chunk-reads of generated context artifacts.
       - Stop with `blocked-at-<stage>(subagent-stuck)` if the retry is also non-terminal.
    - Append one telemetry entry per delegated stage to `docs/signals/delegation-tuning.jsonl` with: `timestamp`, `skill`, `stage`, `delegatedCommand`, `delegationProfile`, `thinkingBudget`, `outcome`, `suspectedStuck`, `retryCount`, `durationMs` (when available), and `notes`.
         - Include `stageRunId` in each row so `started` and terminal rows can be correlated.
    - If telemetry append fails, continue execution but return FLAG details with remediation to restore delegation tracking.
   - After any successful delegated `domainspec-spec-feature <feature>` stage, immediately run delegated `domainspec-plan-phase-bridge <feature> --mode native` to refresh or create `WORK-PACK.md` and `work-pack/tasks/*.md` artifacts before continuing.
   - If delegated execution is canceled/interrupted, treat stage as `suspected-stuck`, execute terminal recovery policy once, and do not continue to mutation stages without a terminal stage outcome.
   - For multi-stage workflows, stop on first BLOCK/failure and return the blocking stage, evidence, and remediation.
7. Return and run the routed command or pipeline stages with resolved arguments.
8. In responses, show both recommended orchestrator route and direct specialist command(s) when useful, labeling direct use as advanced/internal.
</process>

<terminal-resilience>
- Execute shell actions in non-interactive mode whenever possible.
- Bound long-running operations with timeout or tracked background execution.
- For `rg`/search commands, always scope to explicit include paths and use timeout guards (for example `timeout 20s rg ...`).
- Do not run unscoped repository-root `rg` scans in delegated stages.
- On two consecutive `rg` timeouts within one stage, mark `suspected-stuck` and retry once with narrowed scope or non-`rg` retrieval.
- If a terminal run stalls or breaks: capture output, kill stale session, retry once with safer flags, then return BLOCK with remediation when retry fails.
- Treat `exit 0` with lingering background child processes as a stall: capture output, terminate stale child process group, and rerun once with bounded execution.
- Avoid shell patterns that terminate the parent session unexpectedly (for example `exit` inside loops).
</terminal-resilience>

<routing-guardrails>
- DomainSpec-only entrypoint routing: do not route DomainSpec intent into `gsd-*` flows unless the user explicitly asks for GSD.
- No removals, renames, or behavior changes to existing `domainspec-*` specialist commands.
- Preserve existing specialist command semantics; this skill may compose multi-stage workflows from existing specialist commands without changing specialist internals.
- Task refresh/create is mandatory after spec mutation; do not terminate orchestration immediately after `domainspec-spec-feature`.
- Do not route work-pack tasks (`docs/features/{feature}/work-pack/tasks/*.md`) to `domainspec-task-session`; always route to the implementation workflow pipeline.
- Treat `domainspec-task-session` as direct-advanced only when explicitly invoked with an explicit file path under `implementation/domainspec/plan/`.
</routing-guardrails>

<output-contract>
Return:

```markdown
## DomainSpec Route Decision

- Request class: <intent>
- Routed mode: single-stage | multi-stage-pipeline
- Delegation: subagent-per-stage
- Routed command(s):
  1. <domainspec-\* command>
  2. <... when pipeline>
- Execution result: completed | blocked-at-<stage>
- Subagent verification: enabled
- Stage health: healthy | stuck-at-<stage>
- Watchdog: stable | triggered-at-<stage>
- Verification evidence: <stage attempts, last-progress evidence, retry action>
- Delegation profile: quick | standard | deep
- Thinking budget: low | medium | high | xhigh
- Delegation telemetry: docs/signals/delegation-tuning.jsonl (appended)
- Mode: default-entrypoint | direct-advanced
- Notes: <why this route>
```

</output-contract>

<examples>
- `/domainspec-orchestrate start DomainSpec in auto mode`
- `/domainspec-orchestrate build settlement-recovery end-to-end`
- `/domainspec-orchestrate generate tests for payment-processing`
- `/domainspec-orchestrate show DomainSpec commands`
</examples>
