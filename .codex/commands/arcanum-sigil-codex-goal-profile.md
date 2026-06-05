---
tags: [arcanum, codex-command]
node_type: spec
is_session: false
layer: application
nature: procedural, reference, technical
status: active
version: 0.1.0
last_updated: 2026-05-27
---

# Arcanum Sigil: codex goal profile

<!-- arcanum:capability-id codex-goal-profile -->
<!-- arcanum:capability-kind sigil -->
<!-- arcanum:capability-tier transmutations -->
<!-- arcanum:command arcanum-sigil-codex-goal-profile -->

<!-- arcanum:runtime codex -->

## Observer Envelope: Task Zero

Before doing domain work, establish the observer envelope for this Arcanum invocation.

- `run_id`: use an existing hook-provided run id when present; otherwise use `arcanum-arcanum-sigil-codex-goal-profile-<UTC timestamp>`.
- `capability.id`: `codex-goal-profile`
- `capability.kind`: `sigil`
- `capability.tier`: `transmutations`
- `capability.mode`: `command`
- `target_artifact`: this command file
- request summary: summarize the user request before execution.
- expected outputs: list intended artifacts before execution when known.

Closeout is mandatory but must not hide the primary result. At the end, report:

- `OBSERVATION`
- `LEDGER`
- `REFLECTION_TRIGGER`
- `RECOMMENDATION`
- `DEDUPE_KEY`

If deterministic hook or wrapper telemetry is unavailable, preserve the result and report the observability gap.


## Objective

Run the installed Arcanum sigil `codex-goal-profile` using the canonical definition snapshot embedded below.

## Process

1. Use the embedded canonical README and SKILL snapshots as the execution contract.
2. Execute only this installed sigil unless the definition explicitly delegates or the user asks to route elsewhere.
3. Preserve the selected sigil's process, quality bar, anti-patterns, output contract, validation gates, gaps, and next route.
4. Return artifact used, command used, validation result, observability result, and next action.

## Guardrails

- Keep this command focused on `codex-goal-profile`.
- Do not silently add, remove, or refresh capabilities.
- Do not treat generated observer telemetry as a substitute for the primary result.

## Canonical README Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/transmutations/codex-goal-profile/README.md

````markdown
# Codex Goal Profile

Codex Goal Profile is a Transmutation sigil for turning an Arcanum work-pack task or SWU into a strong native Codex `/goal` contract.

It does not implement `/goal`. Codex already owns the native Goal runtime: persistent thread-scoped objectives, lifecycle controls, continuation policy, budget handling, and evidence-based completion.

This transmutation exists because Arcanum work-packs contain rich execution context, while native Codex Goals need a compact operating contract.

When used from Task Session, the profile also consumes a Context Builder handoff pack. That pack is stored as session evidence, emitted as Markdown plus JSON/index, and must pass strict coverage before a runnable native Goal is generated.

## Problem It Solves

Work-packs are excellent dashboards:

- task board,
- waves,
- SWU manifest,
- task contracts,
- source links,
- blockers,
- validation,
- handoff pack paths and strict coverage status.

Native Codex Goals are excellent runtime objectives:

- persistent outcome,
- verification surface,
- constraints,
- boundaries,
- iteration policy,
- blocked stop condition.
- pack-first context boundary.

The missing bridge is a faithful transformation from one selected work-pack task or SWU into a native `/goal` command that Codex can run without losing scope or overstating completion.

## Use When

- a work-pack SWU is ready for execution,
- the work may require multiple Codex turns,
- the completion condition is evidence-based,
- the path is uncertain but bounded,
- the user wants Codex's native Goal lifecycle rather than a one-off prompt.

## Do Not Use When

- the task is a tiny deterministic edit,
- the work-pack/SWU lacks validation evidence,
- dependencies or write scope are unclear,
- the user wants an immediate answer,
- native Codex Goals are unavailable in the current runtime.

## Inputs

- `WORK-PACK.md`,
- selected task contract,
- selected SWU row,
- source links,
- dependencies,
- write scope,
- done criteria,
- validation command or reviewable evidence,
- handoff pack Markdown path,
- handoff pack JSON/index path,
- strict coverage status,
- fallback exploration rule,
- blockers and budget constraints.

## Output

The output is a ready-to-run native Codex Goal profile:

```text
/goal <outcome>, verified by <evidence>, while preserving <constraints>. Use the handoff pack at <markdown path> and structured index at <json path> as selected source context, plus <allowed write scope>. Broaden repository exploration only for named gaps from the pack. If you use extra sources, report the named gap, source path, and whether it changed the result. Between iterations, <iteration policy>. If blocked or no valid paths remain, <stop condition and report shape>.
```

It may also include a short audit block explaining:

- source task/SWU,
- dependency status,
- write scope,
- validation surface,
- handoff pack Markdown and JSON/index,
- strict coverage status,
- fallback exploration rule,
- extra-source reporting requirement,
- known blockers,
- why a native Goal is or is not appropriate.

The transmutation returns `block` instead of a runnable Goal when the handoff pack is missing, strict coverage failed, validation or write scope is absent, or fallback exploration would require broad unnamed discovery.

## Codex Runtime Boundary

Native Codex Goals own:

- `/goal`,
- `/goal pause`,
- `/goal resume`,
- `/goal clear`,
- thread-scoped goal state,
- continuation at safe idle boundaries,
- budget-limited continuation,
- evidence-based completion.

Arcanum owns only the profile transformation and optional observability around whether the profile was useful.

Official reference: <https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex>

## Why This Is A Transmutation

The sigil transforms a structured Arcanum execution unit into a native Codex operating contract. It does not coordinate the work itself, own task execution, or create a competing runtime.

````

## Canonical SKILL Snapshot

Canonical source: https://github.com/cyberAlchemyAI/arcanum/blob/main/transmutations/codex-goal-profile/SKILL.md

````markdown
---
name: codex-goal-profile
description: "Use when converting an Arcanum work-pack task or SWU into a strong native Codex /goal command with outcome, verification surface, constraints, boundaries, iteration policy, and blocked stop condition."
argument-hint: "<work-pack-path> --swu <SWU-ID> --context-pack <markdown-path> --context-index <json-path> [--output <path>]"
tier: transmutations
domain: codex-goal-authoring
version: 0.2.0
origin: extracted from retired Arcanum goal spell after native Codex Goals became the runtime owner
allowed-tools: Read, Write, Glob, Grep
---

<objective>
Transform a selected Arcanum work-pack task or SWU into a native Codex `/goal` profile that preserves scope, evidence, constraints, stop conditions, and strict handoff-pack context.
</objective>

<logic-type>
Transmutation: bounded synthesis from work-pack execution contract to native Codex Goal command.
</logic-type>

<applicability>
Use this skill when:

- a work-pack, task, or SWU is ready for execution,
- native Codex Goals are available,
- the task may require continuation across turns,
- the user needs a compact, auditable `/goal` command rather than another planning artifact.
</applicability>

<inputs>
Expected inputs:

- work-pack path,
- selected task ID or SWU ID,
- parent task contract,
- dependencies,
- source contracts,
- write scope,
- done criteria,
- validation command or evidence surface,
- handoff pack Markdown path,
- handoff pack JSON/index path,
- strict coverage status,
- fallback exploration rule,
- blocker state,
- budget or stop constraints.
</inputs>

<process>
1. Confirm the selected task or SWU. If multiple SWUs are available and none is selected, stop and ask for the SWU.
2. Read only the work-pack row, parent task contract, source links, and validation context needed for that unit.
3. Check readiness:
   - dependencies are satisfied or explicitly named,
   - write scope is bounded,
   - done criteria are concrete,
   - validation surface is available,
   - handoff pack Markdown and JSON/index are available,
   - strict coverage passed,
   - fallback exploration is limited to named uncovered obligations or gaps,
   - blockers do not prevent safe execution.
4. If readiness fails, return a blocked profile with the exact unblock action rather than generating a runnable `/goal`.
5. Build the native Codex Goal using six fields:
   - outcome,
   - verification surface,
   - constraints,
   - boundaries,
   - iteration policy,
   - blocked stop condition.
6. Preserve work-pack navigation by referencing the task/SWU/source files in the profile.
7. Preserve handoff-pack navigation by referencing the Markdown pack and structured index.
8. Require the runtime final report to name any extra sources used outside the handoff pack, the gap that justified each source, and whether the source changed the result.
9. Do not claim runtime ownership. Codex native Goals own pause, resume, clear, continuation, and completion.
</process>

<quality-bar>
A good profile:

- can be pasted directly as a native Codex `/goal`,
- names the exact task or SWU,
- has a measurable completion condition,
- names the verification surface,
- constrains write scope,
- references the session-evidence handoff pack and JSON/index,
- requires pack-first execution,
- permits broad exploration only for named gaps from the pack,
- requires reporting extra sources used for named-gap fallback exploration,
- names dependencies and blockers,
- explains what Codex should do between iterations,
- states when to stop and what to report.
</quality-bar>

<anti-patterns>
Avoid:

- creating an Arcanum `/goal` command that competes with native Codex Goals,
- generating a goal for an unselected task bundle,
- omitting verification,
- hiding blockers,
- allowing broad write scope by default,
- generating a goal without strict handoff-pack coverage,
- treating fallback exploration as permission for broad discovery,
- saying "keep going until done" without a budget or stop condition,
- marking the goal complete without evidence.
</anti-patterns>

<output-contract>
Return:

```markdown
## Codex Goal Profile Result

- Source work-pack: <path>
- Selected unit: <task-or-swu-id>
- Readiness: pass | block
- Native Goal:
  ```text
  /goal <goal text>
  ```
- Verification surface: <command or evidence>
- Boundaries: <write scope and source context>
- Handoff pack: <markdown path and JSON/index path>
- Strict coverage: pass | block
- Fallback exploration: none | named gaps only | block
- Extra-source reporting: required | n/a
- Stop condition: <blocked report rule>
- Validation: <checks performed or not run>
```
</output-contract>

````
