---
name: domainspec-subagents-strategy
description: "Route DomainSpec/Arcanum subagent dispatches: check the trigger, tension the sheet, hold the human gate, register, run, close, and preserve the append-only ledger."
---

# DomainSpec Subagents Strategy

## Overview

Use this skill when the user invokes `$domainspec-subagents-strategy`, asks to run a governed subagent dispatch, or asks to spawn subagents under the DomainSpec/Arcanum discipline. This skill is a router: it defines no dispatch fields and makes no type-specific research/review/experiment judgment by itself.

## Arcanum Core Boundary

This skill is the DomainSpec consuming adapter for the public Arcanum
`subagent-strategy` core. The Arcanum sigil owns the portable trigger,
proposal, tension, confirmation, registration, dependency, closeout, and
observability lifecycle. This adapter owns the DomainSpec constitution, type
owners, form/schema, agent pool, registrar, ledger, Inventory policy, and local
artifact paths.

Do not copy this adapter's private authority or paths into Arcanum. Changes to
the reusable lifecycle belong in `subagent-strategy`; changes to DomainSpec
bindings remain here.

It operationalizes the repo-local subagent strategy constitution when present:
`implementation/domainspec/internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md`.
The ledger row schema is `"0.7.0"` for new dispatch rows. Historical rows
remain structurally grandfathered.

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

## Research And Review Inventory Preflight

For every strategy request classified as `research` or `review`, perform an
automatic, read-only Inventory lookup after the preliminary P1 decision and
dispatch-type resolution, but before drafting a dispatch sheet or finalizing an
inline strategy. This lookup does not require an additional user prompt.

1. Detect the repository-local Inventory package and use `inventory` in
   `lookup` mode.
2. Derive lookup terms from the goal, target artifacts or question, dispatch
   type, affected contract areas, and likely source or lens vocabulary.
3. Read `index.json` first when it exists and is parseable. Use `index.md` only
   as a flagged fallback.
4. Produce a named `strategy-inventory-packet` with lookup status, query terms,
   entry IDs, evidence-card and EvidenceSet IDs, paths, selectors, summaries,
   tags, confidence, source references, obligation fit, excluded matches with
   reasons, unresolved gaps, residue, and a non-authority notice.
5. Use the packet to shape source corpora, lanes, angles, target selectors, and
   agent inputs. The strategy must state at least one design consequence, or
   explain why every candidate match was excluded.
6. Pass only relevant packet fields to each lane; do not make every agent reread
   the whole Inventory.

Inventory is a discovery read model, not proof or dispatch authority. Its
results do not determine the P1 decision, authorize a dispatch, satisfy
check-tension, or replace human confirmation. The lookup is inline preflight
work, not a subagent group or ledger event.

Continue with explicit `inventory_unavailable`, `machine_index_gap`, or
`no_inventory_match` residue when lookup is degraded. Never convert an
Inventory no-match into `precedent-clean`; research must still perform and cite
the actual precedent search. Review findings must still quote and verify the
current artifact. Automatic preflight must not expand into Inventory `install`,
`query`, `ingest`, `backfill`, or `sync`.

## Lifecycle

1. Propose.
   Make the preliminary P1 decision, resolve the dispatch type, run the research/review Inventory preflight when applicable, and read the relevant type owner. Resolve the repo-local `register-dispatch` form owner before drafting. Persist the candidate as a schema 0.7.0 dispatch-row core without `evidence_binding`, then run:

   ```sh
   node implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs \
     --validate-sheet <dispatch-sheet.json>
   ```

   Continue only when the command emits `SHEET_VALIDATION=pass`, `SCHEMA_VERSION=0.7.0`, the exact `SHEET_SHA256`, and `LEDGER_MUTATION=none`. If a selected runtime or candidate declares another version, report `FORM_VERSION_DRIFT`, rematerialize from the repo-local owner, and validate again before tension or confirmation. Other form errors block. For each group with 2 or more agents, name the anti-bias axis and the concrete question where the agents are expected to disagree. Run the check-tension gate with two independent agents against the admitted digest; only a double PASS bound to that same digest reaches the human. Preserve the two evidence handles, verdicts, and digest, not the full returns. Any strategist edit after admission invalidates the digest and returns to confirmation-readiness validation before both tension checks. If the runtime has no callable subagent tool, state that the tension gate cannot be executed and stop at a validated but ungated proposal.

2. Confirm.
   Wait for explicit human confirmation only after confirmation readiness and both tension checks pass. Silence, discussion, or a question is not confirmation. Record a confirmation handle and the exact confirmed sheet digest. After confirmation, the sheet is frozen; any byte change returns to confirmation-readiness validation, both tension checks, and explicit reconfirmation. Never classify a post-confirmation schema edit as harmless under the current exact-byte binding.

3. Register and run.
   Assemble schema 0.7.0 `evidence_binding` from the live sheet path/digest,
   the two PASS handles, and the confirmation handle. Append the dispatch row
   with the deterministic appender; it independently hashes the current sheet
   and rejects incomplete or substituted evidence. Then launch groups by dependency:
   a group is READY when every `sequential` or `zig-zag` edge into it has produced what it
   must respond to and the live type owner's declared stage-handoff gate returns `ready`
   for those exact artifacts. The gate may instead return `needs_feedback` with a typed
   repair owner and one eligible already-confirmed edge, or `blocked`. Traverse only a
   declared edge with remaining capacity; otherwise preserve the gap for final approval.
   `feedback` edges never count as initial dependencies. A sheet with no connections
   declares groups independent. Agents inside a group run in parallel. If an agent errors,
   downstream groups and the final approver must receive the partial result.

   For research dispatches, apply the research owner's evidence-closure and repair-routing
   gate before launching the writer. The strategist appends `research.md` from verbatim
   explorer returns only. The writer writes `findings.md` only. Synthesizer and reviewer
   output is digested into `findings.md`; it is not transcribed into `research.md`.

4. Close.
   Close all spawned agents, report `exit_reason` and `agents_spawned`, and append the close row. The ledger gets exactly two appends per dispatch: the dispatch row and the close row. After closeout, update inventory and observability read models when present.

## Required Strategy Response Shape

When the user invokes this skill for a strategy, proposal, or dispatch design, the chat answer must surface the strategy itself, not only file paths or validation status. Include:

1. **P1 trigger decision** - why this is or is not a dispatch.
2. **Lanes / groups** - each group, its purpose, role, anti-bias axis, and whether it runs in parallel or depends on another group.
3. **Subagents** - agent names, roles, angles, and output expectations.
4. **Dependency flow** - sequential, zig-zag, feedback, and final-approval edges.
5. **Gate / ledger state** - confirmation-readiness status and live schema, check-tension status, confirmation requirement, registration state, and closeout expectation.
6. **Inventory preflight** - for research/review, lookup status, selected and
   excluded evidence, gaps, and the concrete effect on lanes or agent inputs.
7. **Next human action** - usually `confirmed`, revise the sheet, or decline.

For any durable proposal written to disk, add the same lanes/subagents summary to the proposal artifact unless doing so would duplicate a stricter local template.

## Post-Result Inventory Hook

When the repository has an inventory package, inventory the **result of the strategy**, not just the existence of the dispatch machinery.

For every durable strategy/proposal, create or update an inventory entry that captures:

- the P1 trigger decision;
- the lanes/groups and their roles;
- the subagents, angles, and expected outputs;
- the dependency flow;
- the gate, confirmation, registration, and ledger state;
- for research/review, the `strategy-inventory-packet` status, selected and
  excluded evidence, gaps, and design consequences;
- the next human action.

This inventory entry is a non-authority read model. It must link to the proposal sheet and gate artifacts, but it does not replace the chat answer: the chat answer must still show the lanes and subagents directly.

Minimum inventory checks for a durable strategy/proposal:

- the human index links the strategy-result entry;
- tags include `strategy-result`, `dispatch`, and `subagents`;
- the inventory log records whether the proposal is unregistered, registered, run, or closed;
- the strategy-result entry links the proposal sheet and gate artifacts;
- after a run, durable findings, validation reports, and closeout evidence get their own entries or log rows.

## Workflow Reflect Hook

When the user correction or observer pass indicates that this skill's answer omitted lanes/subagents, confused inventory with the strategy result, or drifted from its response shape, route maintenance through the canonical Arcanum `sigil-maintenance-loop` with `target_sigil_id: domainspec-subagents-strategy`. Do not manually sequence only `workflow-reflect` and `sigil-development`.

Pass the current correction or observer envelope, the affected contract area, and relevant lookup terms into the spell. The spell always performs a read-only, machine-index-first Inventory lookup before reflection and must not ask for additional permission for that lookup. Keep this maintenance lookup distinct from the Post-Result Inventory Hook above: lookup retrieves prior evidence for reflection; the post-result hook records durable strategy and dispatch results.

`sigil-development` remains the lifecycle owner for edits. The strategy skill is mutated only after the spell has produced a reflection outcome and the user has approved the bounded change scope.

Reflection-relevant signals include:

- missing P1, lanes, subagents, dependency flow, gate state, or next human action in a strategy response;
- inventory entries that point to machinery but omit the strategy result;
- durable proposals that lack a lanes/subagents summary;
- research/review strategy design that omits the pre-sheet Inventory lookup or
  records a lookup without any design consequence or explicit exclusion;
- closeout that appends the dispatch ledger but leaves inventory or observability stale;
- path drift between a standalone repository and the private upstream owner checkout.
- confirmation requested before the exact persisted sheet passes the live
  `register-dispatch` form owner;
- stale runtime or schema projection discovered only after human confirmation;
- repeated confirmation caused by a preventable pre-confirmation form defect.
- a consuming stage launched because an upstream artifact existed even though
  the type-owner handoff gate had not returned `ready`;
- research source bytes, provenance, selectors, anchors, or pointers sent to
  writer revision instead of an eligible explorer feedback route;
- originating strategy gaps recorded only under a post-result child hook such
  as Inventory rather than under `domainspec-subagents-strategy`.

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

For `research` or `review`, perform the Inventory preflight and read the type
skill before creating the sheet. For `experiment`, read the type skill without
implying an automatic Inventory preflight. This router owns only the universal
dispatch process.

## Registering

Use the form owner:
`implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md`.

Before tension or confirmation, validate the persisted sheet without mutating
the ledger:

```sh
node implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs \
  --validate-sheet <dispatch-sheet.json>
```

The candidate sheet must omit `evidence_binding`; it is assembled separately
only after confirmation. A form-version warning blocks progress until the sheet
is rematerialized from the current repo-local owner and passes.

Use the deterministic appender from the repo root:

```sh
node implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs .register-dispatch.tmp.json
```

Create temporary JSON records with a normal file edit tool. For new dispatch
rows, include schema 0.7.0 `evidence_binding` with the live sheet path/digest,
two unique PASS handles, and explicit confirmation handle, all bound to the
same digest. Run the appender, then delete the temp file. Do not hand-edit
`telemetry/agents/subagents-dispatch.yaml`.

For close rows, use `close_of`, `exit_reason`, `agents_spawned`, optional `feedback_prompts`, and optional `invoked_by`. Do not include `dispatch_id` in a close record.

## Invariants

- Pairwise tension: every group with 2 or more agents must have a named axis and per-agent angle.
- Claim <= proof: every artifact produced by the dispatch must cite or preserve its evidence boundary.
- Final approval: `final_approver` is `parent` unless a dedicated one-agent auditor group is declared; no working-group member self-approves.
- Three dials, three scopes: `layers` belongs to a group, `loop_cap` belongs to a zig-zag or feedback edge, and `max_loops` belongs to the whole dispatch.
- One human gate: preventable form and version drift is resolved before asking;
  exact-byte changes after confirmation still require reconfirmation.
- Stage readiness is owner-typed: `ready`, `needs_feedback`, or `blocked`.
  Repair traverses only an already-confirmed eligible edge with capacity.
- Exit reasons are `resolved`, `loop_ceiling_reached`, `dissent_irreconcilable`, `user_abort`, or `error`.
- Trust but verify: if a subagent wrote files or claimed a check passed, inspect the diff or run the check before treating it as done.
- Public/private boundary: when outputs land in public `arcanum`, do not write private parent paths, private submodule paths, emails, or workspace-only evidence into the public artifact.

## Pointers

- Constitution: `implementation/domainspec/internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md`
- Check-tension gate: `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/check-tension/SKILL.md`
- Form and appender: `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md`
- Agent pool: `telemetry/agents/agent-pool.yaml`
- Dispatch ledger: `telemetry/agents/subagents-dispatch.yaml`
