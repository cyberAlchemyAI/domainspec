---
name: domainspec-orchestrate
description: Unified user-facing DomainSpec entrypoint. Route natural-language DomainSpec requests to the correct specialist domainspec-* workflow while preserving direct specialist commands for advanced/internal use.
argument-hint: "<natural-language-request>"
agent: domainspec-orchestrator
allowed-tools: Read, Glob, Grep, AskUserQuestion, Task
---

<objective>
Provide one stable user-facing DomainSpec entrypoint that classifies intent and dispatches to the right specialist workflow through delegated subagent execution.
</objective>

<context>
Read command definitions under `.claude/skills/domainspec-*/SKILL.md`, package docs under `domainspec/copilot/`, and framework updates in `domainspec/CHANGELOG.md`.
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
   - task context pack preparation for implementation predictability (without implementation request) -> `domainspec-context-builder <feature> [--task <TASK-ID|task-path>]`
   - end-to-end feature delivery -> `domainspec-pipeline <feature>`
   - feature spec authoring -> `domainspec-spec-feature <feature>`
   - story sync -> `domainspec-sync-user-stories <feature>`
   - test derivation -> `domainspec-generate-tests <feature>`
   - post-implementation code tagging -> `domainspec-tag-code <feature>`
   - UI lifecycle -> `domainspec-ui-pipeline <feature>`
   - observability instrumentation -> `domainspec-instrument-otel <feature>`
   - observability verification -> `domainspec-otel-verify <feature>`
   - infrastructure architecture/sync -> `domainspec-infra-architecture` or `domainspec-infra-deploy <feature>`
   - audits/readiness -> `domainspec-audit-alignment`, `domainspec-audit-layering`, `domainspec-verify-feature <feature>`, or `domainspec-readiness-gate <feature> [--profile ...]`
   - command guidance -> `domainspec-help`
4. If intent is ambiguous, ask focused clarification questions before selecting the route.
   - If a work-pack task ID is provided without resolvable feature context, ask for feature name before selecting the implementation workflow pipeline.
5. Planner-first enforcement for mutation-capable routes:
   - For `domainspec-pipeline`, `domainspec-spec-feature`, `domainspec-generate-tests`, `domainspec-context-builder`, `domainspec-implement`, `domainspec-tag-code`, `domainspec-ui-pipeline`, and mutation-capable readiness flows, require delegated execution to establish or validate planner preflight and work-pack gate (`docs/features/{feature}/WORK-PACK.md`) before mutation.
   - Read-only guidance and verification-only commands may bypass planner preflight.
6. Execution model requirements:
   - Every routed specialist stage must run through a delegated subagent call.
   - Capture each stage result before advancing to the next stage.
   - For multi-stage workflows, stop on first BLOCK/failure and return the blocking stage, evidence, and remediation.
7. Return and run the routed command or pipeline stages with resolved arguments.
8. In responses, show both recommended orchestrator route and direct specialist command(s) when useful, labeling direct use as advanced/internal.
</process>

<terminal-resilience>
- Execute shell actions in non-interactive mode whenever possible.
- Bound long-running operations with timeout or tracked background execution.
- If a terminal run stalls or breaks: capture output, kill stale session, retry once with safer flags, then return BLOCK with remediation when retry fails.
- Avoid shell patterns that terminate the parent session unexpectedly (for example `exit` inside loops).
</terminal-resilience>

<routing-guardrails>
- DomainSpec-only entrypoint routing: do not route DomainSpec intent into `gsd-*` flows unless the user explicitly asks for GSD.
- No removals, renames, or behavior changes to existing `domainspec-*` specialist commands.
- Preserve existing specialist command semantics; this skill may compose multi-stage workflows from existing specialist commands without changing specialist internals.
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
- Mode: default-entrypoint | direct-advanced
- Notes: <why this route>
```

</output-contract>

<examples>
- `/domainspec-orchestrate start DomainSpec in auto mode`
- `/domainspec-orchestrate build settlement-recovery end-to-end`
- `/domainspec-orchestrate generate tests for payment-processing`
- `/domainspec-orchestrate show DomainSpec commands`
