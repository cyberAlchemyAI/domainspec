---
name: domainspec-subagents-strategy
description: Route any subagent dispatch — check the Principle-1 trigger, hold the human gate, enforce the universal invariants, then route by dispatch_type to the owning type skill (research, review, and experiment are LIVE; code/plan/suggestion are reserved). The record/sheet form is owned by register-dispatch; field definitions by constitution §5. This skill defines no field and no type-specific judgment — it routes.
---

## When to dispatch (P1) — and what is not a dispatch (P11)

Dispatch only when at least one trigger holds: **synthesis** (3+ sources to combine), **context protection** (raw output ≫ what the parent needs), **isolation** (discardable exploration), **parallelism** (independent tasks). Otherwise work inline.

**Helper rule (P11):** a single agent spawned *by* a running agent, within its parent's scope, is not a dispatch — no row, no gate; it is reported post-hoc in the parent's `agents_spawned`. It escalates to a real dispatch when it fans out (2+) or outgrows the parent's scope. *(The exact helper-vs-dispatch boundary is provisional — an open question, not settled law.)*

## Lifecycle — the universal four steps (§3)

1. **Propose.** The strategist fills the sheet — consulting the type skill (routing table below) for type judgment — and proposes it in chat, stating for each tensioned pair the question on which the two agents are predicted to disagree (P5). Before presenting to the human, run the **check-tension gate** (Pointers): two independent agents verify the sheet is genuinely tensioned (Tests 1–4); the sheet reaches the human only if **both PASS**, otherwise it returns here for revision.
2. **Confirm.** The human's explicit affirmative — silence or a question is not confirmation. Nothing persists before it. The confirmed sheet is **frozen**; any strategist edit after confirm re-enters the gate (P2).
3. **Register + run.** Append the dispatch row, then schedule groups **by dependency** (P4, amended 2026-06-12): a group is READY when every group with a `sequential`/`zig-zag` edge into it has produced what it must respond to (zig-zag counts only in its `from`→`to` direction — the `from` endpoint opens the exchange); launch all READY groups concurrently; `feedback` edges never count as dependencies; a sheet with no connections declares its groups independent; declared order is narration tiebreak only. Agents inside a group run in parallel. An agent error degrades to a **partial group result** that downstream groups and the `final_approver` must be told about.
4. **Close.** Report `exit_reason` + `agents_spawned` in chat and in the findings doc, and append the close row. Two appends, one ledger, append-only (P3).

For the record shape, the appender, and the close-row mechanics: **register-dispatch owns them** — see Pointers.

## Universal invariants (every dispatch_type)

These bullets are operational restatements of constitution §4; §4 is authoritative on conflict.

- **P5 — pairwise tension.** Any n ≥ 2 group must be pairwise tensioned (predictable disagreement per pair, named axis, per-agent position); checked by the **check-tension gate** (two independent agents) before the human confirm — untensioned sheets go back to the strategist for revision.
- **P7 — aggregation is derived,** never a field: `robot_talks: true` → the group synthesizes; otherwise → concat. *(Non-binding note, per P7's own framing: a bare concat is never the dispatch's final deliverable.)*
- **P10 — claim ≤ proof** in every artifact produced.
- **P12 — final approval.** Every dispatch names a `final_approver`: `parent` (default) or a dedicated approver group whose single agent's role is `auditor` and that does no other work; never a working-group member (no self-approval); falls back to `parent` if its group never runs; the approver receives the full `working_folder`. One human gate only — the entry confirm.
- **Three dials, three scopes.** `layers` (group) / `loop_cap` (edge) / `max_loops` (dispatch) — one scenario, one dial; if two seem to fit, the smallest scope wins. Decision table: constitution §5.
- **exit_reason.** Closed vocabulary: `resolved | loop_ceiling_reached | dissent_irreconcilable | user_abort | error`. Precedence + decision procedure: constitution §5.
- **P8 — trust-but-verify.** If a subagent wrote files or claimed a check passed, inspect the actual diff / run the actual check before treating it as done.
- **P13 — meta + lineage.** A dispatch about dispatching is `meta: true`; `parent_dispatch_id` exists only on a dispatch planned by a meta dispatch; a meta-planned child re-enters the confirm gate.
- **P14 — robot-talks binding.** A group with `robot_talks: true` binds `vault/constitution/robot-talks-constitution.md`; this constitution's single-gate rule overrides any extra human gate it would prescribe. A synthesizer downstream of a robot-talks group MUST receive each agent's initial AND final positions (collapse detection).

## Routing by dispatch_type

LIVE status is **declared by constitution §5** (promoting a reserved type goes through §7's premise-debt re-confrontation — an owner act); a LIVE row must also point to an existing skill — a consistency check, not the definition. Routing to a RESERVED type: **refuse and tell the user** the type is not yet populated.

| dispatch_type | status | skill |
|---|---|---|
| `research` | LIVE | `.claude/skills/research/SKILL.md` — research-type judgment: canonical shape, roles, gates, outputs |
| `code` | RESERVED — must not be dispatched until populated | none |
| `review` | LIVE (populated 2026-06-12, owner decision) | `.claude/skills/review/SKILL.md` — red-team judgment: attack lenses, severity taxonomy, verification discipline, change-request findings |
| `plan` | RESERVED — must not be dispatched until populated | none |
| `suggestion` | RESERVED — must not be dispatched until populated | none |
| `experiment` | LIVE (populated 2026-06-14, owner decision) | `.claude/skills/experiment/SKILL.md` — falsification judgment: pre-registered criterion freeze, validity gates, SURVIVED/FALSIFIED/INVALID verdict (propose phase only — INVALID may be rendered here; SURVIVED/FALSIFIED rendered at the separate downstream run) |

## Pointers (single owners)

- **Form — record/sheet fill mechanics:** `register-dispatch` (`~/.claude/skills/register-dispatch/`) — field tables, enums, the appender, the close row, `invoked_by`.
- **Agent names:** `~/agent-pool.yaml`.
- **Anti-bias design:** `vault/discovery/anti-bias-vector-composition/` — reached via the type skill.
- **Init-time tensioning gate:** `check-tension` (`.claude/skills/check-tension/SKILL.md`) — the two independent agents that verify Tests 1–4 before the human confirm; only "both PASS" reaches the human.
