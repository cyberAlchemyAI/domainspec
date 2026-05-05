---
name: domainspec-orchestrate
description: Unified user-facing DomainSpec entrypoint. Route natural-language DomainSpec requests to the correct specialist domainspec-* workflow while preserving direct specialist commands for advanced/internal use.
argument-hint: "<natural-language-request>"
agent: domainspec-orchestrator
allowed-tools: Read, Glob, Grep, AskQuestions, Task
---

<objective>
Provide one stable user-facing DomainSpec entrypoint that classifies intent and dispatches to the right specialist command without changing specialist command behavior.
</objective>

<context>
Read command definitions under `.github/skills/domainspec-*/SKILL.md`, package docs under `domainspec/copilot/`, and framework updates in `domainspec/CHANGELOG.md`.
</context>

<process>
1. Read `domainspec/CHANGELOG.md` and command skill definitions.
2. If the user explicitly requests a `domainspec-*` command, preserve and execute that command unchanged.
3. If the request is DomainSpec natural language without an explicit command, map to one specialist command:
   - kickoff, discovery, or baseline gating -> `domainspec-start`
   - docs bootstrap -> `domainspec-init`
   - work-pack task implementation (`TASK-*` or `docs/features/{feature}/work-pack/tasks/*.md`) -> `domainspec-implement <feature>`
   - task context pack preparation for implementation predictability -> `domainspec-context-builder <feature> [--task <TASK-ID|task-path>]`
   - end-to-end feature delivery -> `domainspec-pipeline <feature>`
   - feature spec authoring -> `domainspec-spec-feature <feature>`
   - story sync -> `domainspec-sync-user-stories <feature>`
   - test derivation -> `domainspec-generate-tests <feature>`
   - backend implementation -> `domainspec-implement <feature>`
   - UI lifecycle -> `domainspec-ui-pipeline <feature>`
   - observability instrumentation -> `domainspec-instrument-otel <feature>`
   - observability verification -> `domainspec-otel-verify <feature>`
   - infrastructure architecture/sync -> `domainspec-infra-architecture` or `domainspec-infra-deploy <feature>`
   - audits/readiness -> `domainspec-audit-alignment`, `domainspec-audit-layering`, `domainspec-verify-feature <feature>`, or `domainspec-readiness-gate <feature> [--profile ...]`
   - command guidance -> `domainspec-help`
4. If intent is ambiguous, ask focused clarification questions before selecting the route.
   - If a work-pack task ID is provided without resolvable feature context, ask for feature name and then route to `domainspec-implement <feature>`.
5. Planner-first enforcement for mutation-capable routes:
   - For `domainspec-pipeline`, `domainspec-spec-feature`, `domainspec-generate-tests`, `domainspec-implement`, `domainspec-ui-pipeline`, and mutation-capable readiness flows, require delegate execution to establish or validate planner preflight and work-pack gate (`docs/features/{feature}/WORK-PACK.md`) before mutation.
   - Read-only guidance and verification-only commands may bypass planner preflight.
6. Return and run the routed command with resolved arguments.
7. In responses, show both recommended orchestrator route and direct specialist command when useful, labeling direct use as advanced/internal.
</process>

<routing-guardrails>
- DomainSpec-only entrypoint routing: do not route DomainSpec intent into `gsd-*` flows unless the user explicitly asks for GSD.
- No removals, renames, or behavior changes to existing `domainspec-*` specialist commands.
- Preserve existing specialist command semantics; this skill only normalizes entrypoint intent.
- Do not route work-pack tasks (`docs/features/{feature}/work-pack/tasks/*.md`) to `domainspec-task-session`; always route to `domainspec-implement <feature>`.
- Treat `domainspec-task-session` as direct-advanced only when explicitly invoked with an explicit file path under `implementation/domainspec/plan/`.
</routing-guardrails>

<output-contract>
Return:

```markdown
## DomainSpec Route Decision

- Request class: <intent>
- Routed command: <domainspec-\* command>
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
