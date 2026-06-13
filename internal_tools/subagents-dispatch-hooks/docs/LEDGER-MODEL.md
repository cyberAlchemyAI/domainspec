---
tags: [dispatch, ledger, data-model, subagents, governance, observability]
node_type: conceptual
is_session: false
layer: architecture
nature: explanatory, reference
status: exploratory
version: 0.1.0
last_updated: 2026-06-13
created_by: victorboscaro@gmail.com
---

# The Dispatch Ledger — data model & organization

This is the **mental model** of the dispatch ledger: what it is, how a row is shaped, and how
that shape normalizes. It is *not* the field schema — the authoritative field-by-field reference
is owned by [`register-dispatch/SKILL.md`](skills/register-dispatch/SKILL.md), and the field
*semantics* (the law) are owned by the
[subagents-strategy constitution](../../../vault/constitution/domainspec-subagents-strategy-constitution.md) §5.
This doc owns only the model and points to those for everything else.

## 1. What it is — and is not

The ledger is the **governance record** of subagent dispatches: one append-only YAML at
`<repo-root>/telemetry/agents/subagents-dispatch.yaml`. It answers: *who was dispatched, with
what intent, tensioned how, and how did it close.*

It is deliberately **distinct** from two neighbours it is easy to conflate (see
[README](README.md)):

- `internal_tools/agents-telemetry/` — a SQLite store of **usage measurement** (tokens,
  duration). Different question: *how much did it cost*, not *what was the design*.
- The research skill's per-folder `dispatch.yaml` **rosters** — working artifacts inside a
  research run, not the cross-run governance record.

The three coexist; they are not the same log. This one is about **authored design + governance
outcome**.

## 2. The two row types — the two-append discipline

Every dispatch contributes **exactly two appends** (constitution Principle 3):

1. a **dispatch row** — the spec, written *at dispatch* (the human-confirmed sheet);
2. a **close row** — `close_of` + the outcome, written *at termination*.

The ledger is **append-only**: rows are never edited in place. Closing a dispatch is an appended
`close_of` event, not a mutation of the original row — mechanically enforced by the
[`enforce-append-only-dispatch`](hooks/enforce-append-only-dispatch.cjs) hook. The appender is
**idempotent** on `dispatch_id` / `close_of`, and **grandfathers** rows written under older
schemas (they are historical artifacts, never re-validated). Current schema: **v0.5.2**.

## 3. The shape of a dispatch row — a tree in JSON columns

A dispatch row is a **denormalized document**: the whole dispatch tree lives in one YAML record,
with the nested parts carried as **JSON columns**.

```text
dispatch row
  dispatch_id, dispatch_type, goal, context, max_loops,
  final_approver, working_folder, anti_bias_global, invoked_by, meta
  │
  ├── groups[]          ← JSON column
  │     group_id, role, n, anti_bias, layers, robot_talks
  │     └── agents[]    ← nested inside each group
  │           role, model, token_budget, angle, initial_prompt, agent_name
  │
  └── connections[]     ← JSON column
        { from, to, type, loop_cap }
```

`groups` and `connections` are **JSON columns** — one YAML row holds the entire
`dispatch → groups → agents` tree plus the connection DAG. For each field's rules (which are
required when, the enums, the conditionals like `anti_bias`/`angle` required when a group has
≥ 2 agents), see [`register-dispatch/SKILL.md`](skills/register-dispatch/SKILL.md) — not
duplicated here on purpose.

## 4. The close row

The second append carries the outcome, not the spec:

- `close_of` — the `dispatch_id` being closed (dedup key);
- `exit_reason` — closed vocabulary: `resolved | loop_ceiling_reached |
  dissent_irreconcilable | user_abort | error`;
- `agents_spawned` — `{ total, tree (by role-category), loops_used }`;
- `feedback_prompts` — each `feedback`-edge ask, recorded **verbatim**.

## 5. Denormalized today, normalizable to L1 / L2 / L3

Today the ledger stores the **denormalized** form: one dispatch row (JSON columns) + one close
row. But the tree is a denormalized view of what is really a three-level entity. Normalized
relationally, the JSON columns **explode into flat child rows joined by foreign key**:

| Denormalized (today) | Normalized | Level | Key |
|---|---|---|---|
| the dispatch row | `dispatch` | **L1** | `dispatch_id` |
| `groups[]` (JSON column) | `group` / wave rows | **L2** | `group_id`, `dispatch_id` FK |
| `agents[]` (nested) | `agent` rows | **L3** | `agent_id`, `group_id` FK |
| `connections[]` (JSON column) | `connection` rows | — | `from`/`to` → `group_id` |

This exploded form is exactly the **L1/L2/L3 observability model** named in the
[agents-input-output discovery](discovery/agents-input-output/discovery.md) and in Arcanum's
`DISPATCH-COMPOSITION-MODEL` (the TO-VLAD6 observe-model: *flat append-only rows joined by FK,
not nested objects*). **The normalization is a design, not yet what the appender writes** — today
it is one nested document; the flat L1/L2/L3 rows are the target shape.

## 6. Two kinds of log — what this ledger captures, and what it does not

This ledger captures **authored design + governance outcome**:

- *why* the fan-out exists (`goal`, `context`),
- each worker's **angle** and the group's **`anti_bias`** tension axis,
- the **`connections`** DAG (the topology),
- the role-set and the **governance termination** (`exit_reason`).

None of this is observable — it is a set of design decisions the **model authors** (see §7). The
ledger does **not** capture behavioural/quality signals (quality-bar status, anti-pattern hits,
output-contract drift) or per-stage execution provenance (artifact paths, validation, blockers).
Those are a **different plane** — in Arcanum, the `signal-observer` ledger and the per-stage
receipts. The grain where the two planes meet is the **L3 agent row**: one row per worker, which
lines up one-to-one with an execution log's per-invocation record. Joining them by key gives, per
worker, a triple of *authored intent · observed behaviour · execution evidence* — complementary,
not overlapping.

## 7. Why model-invoked, not auto-logged

A hook sees only the raw `Agent` tool call. It **cannot author** `angle` / `anti_bias` / `goal` —
those are intent, not observable from the call. So registration is a **skill the model invokes**,
not an auto-logger; the [reminder hook](hooks/remind-register-dispatch.cjs) only nudges. This is
the deliberate split: the hook guarantees the model is *reminded*; the model supplies the meaning
the hook cannot derive. (See [README](README.md) "Business Context".)

## 8. Where the parts live — navigation

The ledger is the record; the rest of the subsystem is split by authority:

**The law (in `vault/`):**
- [subagents-strategy constitution](../../../vault/constitution/domainspec-subagents-strategy-constitution.md)
  — field semantics (§5), the `dispatch_type` vocabulary (`research`/`review` LIVE), Principles
  P3 (two-append) / P9 (citation) / P11 (helper-not-dispatch) / P12 (no self-approval).

**The mechanism (here, in `internal_tools/subagents-dispatch-hooks/`):**
- [README](README.md) — toolchain orientation.
- [`register-dispatch/SKILL.md`](skills/register-dispatch/SKILL.md) — the authoritative row
  schema (dispatch + close) and the authoring procedure.
- [`append-dispatch.cjs`](skills/register-dispatch/append-dispatch.cjs) — the only sanctioned
  write path (schema-validate-or-reject, idempotent, self-check).
- [`hooks/`](hooks/) — the three `PreToolUse` hooks: reminder-nudge on `Agent`, deny on
  `Workflow`, append-only enforcer.

**The skills that PRODUCE dispatches** (these live in `.claude/skills/`; pointed to, not owned
here):
- `domainspec-subagents-strategy` — the router (checks the Principle-1 trigger, holds the human
  gate, routes by `dispatch_type`).
- `research` — the LIVE type skill for `dispatch_type: research`.
- `review` — the LIVE type skill for `dispatch_type: review`.
- `register-dispatch` — the form/record skill (canonical source here; installed per-user to
  `~/.claude/skills/`).

**Related model docs:**
- [agents-input-output discovery](discovery/agents-input-output/discovery.md) — the per-role I/O
  contracts (the research-stage instance).
- `DISPATCH-COMPOSITION-MODEL.md` (in the sibling Arcanum repo, `TO-VLAD/`) — the cross-repo
  composition model and the logging-fusion wiring (§7, §12) this ledger plugs into.
