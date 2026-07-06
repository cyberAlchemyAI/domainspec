---
name: domainspec-subagents-strategy
description: "Route DomainSpec/Arcanum subagent dispatches: check the trigger, tension the sheet, hold the human gate, register, run, close, and preserve the append-only ledger."
---

# DomainSpec Subagents Strategy

## Overview

Use this skill when the user invokes `$domainspec-subagents-strategy`, asks to run a governed subagent dispatch, or asks to spawn subagents under the DomainSpec/Arcanum discipline. This skill is a router: it defines no dispatch fields and makes no type-specific research/review/experiment judgment by itself.

It operationalizes the repo-local subagent strategy constitution when present:
`implementation/domainspec/internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md`.
The ledger row schema remains `"0.6.0"` even when the constitution text is at a later proposal revision.

Before acting, locate the active repo root. In `domainspec-core`, prefer the repo-local owner files under `implementation/domainspec/internal_tools/subagents-dispatch-hooks/` over any generated runtime copy.
In standalone migrated repositories, prefer the repo-local `ops/subagents-strategy/`, `.agents/skills/`, `telemetry/agents/agents.yaml`, and `telemetry/agents/subagents-dispatch.yaml` surfaces over private upstream paths.

## When To Dispatch

Dispatch only when at least one Principle-1 trigger holds:

- Synthesis: 3 or more sources, lenses, or returns must be combined.
- Context protection: raw output would be much larger than what the parent should carry.
- Isolation: exploration should be discardable or independently checked.
- Parallelism: independent work can run concurrently.

Otherwise, work inline.

Helper rule: a single helper agent spawned within a running agent's scope is not a dispatch. Record it post-hoc in the parent's `agents_spawned.helpers`. It escalates into a dispatch when it fans out to 2 or more agents or outgrows the parent's scope.

## Lifecycle

1. Propose.
   Read the relevant owner files, then draft a dispatch sheet. For each group with 2 or more agents, name the anti-bias axis and the concrete question where the agents are expected to disagree. Before presenting the sheet to the human, run the check-tension gate with two independent agents; only a double PASS reaches the human. If the runtime has no callable subagent tool, state that the gate cannot be executed and stop at a proposed sheet.

2. Confirm.
   Wait for explicit human confirmation. Silence, discussion, or a question is not confirmation. After confirmation, the sheet is frozen; any strategist edit re-enters the check-tension gate.

3. Register and run.
   Append the dispatch row with the deterministic appender, then launch groups by dependency:
   a group is READY when every `sequential` or `zig-zag` edge into it has produced what it must respond to. `feedback` edges never count as dependencies. A sheet with no connections declares groups independent. Agents inside a group run in parallel. If an agent errors, downstream groups and the final approver must receive the partial result.

   For research dispatches, the strategist appends `research.md` from verbatim explorer returns only. The writer writes `findings.md` only. Synthesizer and reviewer output is digested into `findings.md`; it is not transcribed into `research.md`.

4. Close.
   Close all spawned agents, report `exit_reason` and `agents_spawned`, and append the close row. The ledger gets exactly two appends per dispatch: the dispatch row and the close row. After closeout, update inventory and observability read models when present.

## Required Strategy Response Shape

When the user invokes this skill for a strategy, proposal, or dispatch design, the chat answer must surface the strategy itself, not only file paths or validation status. Include:

1. **P1 trigger decision** - why this is or is not a dispatch.
2. **Lanes / groups** - each group, its purpose, role, anti-bias axis, and whether it runs in parallel or depends on another group.
3. **Subagents** - agent names, roles, angles, and output expectations.
4. **Dependency flow** - sequential, zig-zag, feedback, and final-approval edges.
5. **Gate / ledger state** - check-tension status, confirmation requirement, registration state, and closeout expectation.
6. **Next human action** - usually `confirmed`, revise the sheet, or decline.

For any durable proposal written to disk, add the same lanes/subagents summary to the proposal artifact unless doing so would duplicate a stricter local template.

## Inventory Hook

When the repository has an inventory package, inventory the **result of the strategy**, not just the existence of the dispatch machinery.

For every durable strategy/proposal, create or update an inventory entry that captures:

- the P1 trigger decision;
- the lanes/groups and their roles;
- the subagents, angles, and expected outputs;
- the dependency flow;
- the gate, confirmation, registration, and ledger state;
- the next human action.

This inventory entry is a non-authority read model. It must link to the proposal sheet and gate artifacts, but it does not replace the chat answer: the chat answer must still show the lanes and subagents directly.

Minimum inventory checks for a durable strategy/proposal:

- the human index links the strategy-result entry;
- tags include `strategy-result`, `dispatch`, and `subagents`;
- the inventory log records whether the proposal is unregistered, registered, run, or closed;
- the strategy-result entry links the proposal sheet and gate artifacts;
- after a run, durable findings, validation reports, and closeout evidence get their own entries or log rows.

## Workflow Reflect Hook

When the user correction or observer pass indicates that this skill's answer omitted lanes/subagents, confused inventory with the strategy result, or drifted from its response shape, preserve that as observability signal and run `workflow-reflect` before applying another behavior change.

Use `sigil-development` as the lifecycle owner for edits. `workflow-reflect` may write reflection reports and state, but the strategy skill itself is only mutated after the reflection outcome is synthesized.

Reflection-relevant signals include:

- missing P1, lanes, subagents, dependency flow, gate state, or next human action in a strategy response;
- inventory entries that point to machinery but omit the strategy result;
- durable proposals that lack a lanes/subagents summary;
- closeout that appends the dispatch ledger but leaves inventory or observability stale;
- path drift between a standalone repository and the private upstream owner checkout.

## Routing

Route by `dispatch_type`. Reserved types must not be dispatched until populated.

| dispatch_type | status   | owner skill                                                                                    |
| ------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `research`    | LIVE     | `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md`   |
| `review`      | LIVE     | `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/review/SKILL.md`     |
| `experiment`  | LIVE     | `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/experiment/SKILL.md` |
| `code`        | RESERVED | none                                                                                           |
| `plan`        | RESERVED | none                                                                                           |
| `suggestion`  | RESERVED | none                                                                                           |

For `research`, `review`, or `experiment`, read the type skill before creating the sheet. This router owns only the universal dispatch process.

## Registering

Use the form owner:
`implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md`.

Use the deterministic appender from the repo root:

```sh
node implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs .register-dispatch.tmp.json
```

Create temporary JSON records with a normal file edit tool, run the appender, then delete the temp file. Do not hand-edit `telemetry/agents/subagents-dispatch.yaml`.

For close rows, use `close_of`, `exit_reason`, `agents_spawned`, optional `feedback_prompts`, and optional `invoked_by`. Do not include `dispatch_id` in a close record.

## Invariants

- Pairwise tension: every group with 2 or more agents must have a named axis and per-agent angle.
- Claim <= proof: every artifact produced by the dispatch must cite or preserve its evidence boundary.
- Final approval: `final_approver` is `parent` unless a dedicated one-agent auditor group is declared; no working-group member self-approves.
- Three dials, three scopes: `layers` belongs to a group, `loop_cap` belongs to a zig-zag or feedback edge, and `max_loops` belongs to the whole dispatch.
- Exit reasons are `resolved`, `loop_ceiling_reached`, `dissent_irreconcilable`, `user_abort`, or `error`.
- Trust but verify: if a subagent wrote files or claimed a check passed, inspect the diff or run the check before treating it as done.
- Public/private boundary: when outputs land in public `arcanum`, do not write private parent paths, private submodule paths, emails, or workspace-only evidence into the public artifact.

## Pointers

- Constitution: `implementation/domainspec/internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md`
- Check-tension gate: `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/check-tension/SKILL.md`
- Form and appender: `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md`
- Agent pool: `telemetry/agents/agent-pool.yaml`
- Dispatch ledger: `telemetry/agents/subagents-dispatch.yaml`
