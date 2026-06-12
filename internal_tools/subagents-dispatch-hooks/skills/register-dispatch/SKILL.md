---
name: register-dispatch
description: Record a subagent dispatch as one row in <repo-root>/telemetry/agents/subagents-dispatch.yaml — one row per dispatch, with each agent's angle and the anti_bias axis. Use whenever you dispatch one or more subagents (a research-skill run OR an ad-hoc Agent call), since not every dispatch is a research dispatch. Trivial single lookups that spawn no subagent do not need registration.
---

# register-dispatch

Record **one row per dispatch** in the repo ledger `telemetry/agents/subagents-dispatch.yaml`,
under the subagents-strategy constitution **schema v0.5.2**. A dispatch contributes exactly
**two appends** (constitution Principle 3): the **dispatch row** (the spec, at dispatch) and
the **close row** (`close_of` + outcome, at termination). The ledger is append-only — rows
are never edited in place.

## When to use

- After (or as) you dispatch subagents for any non-trivial task.
- Register **once per dispatch**, not once per agent or per group. A dispatch with three
  groups and six agents is **one** row; `groups` is a JSON column.
- At termination, append the **close row** (see below). Both appends use the same appender.
- Skip only for trivial inline work that spawns no subagent. A single helper invocation
  inside a running agent's scope is not a dispatch (Principle 11) — it is reported in the
  parent's `agents_spawned`, not registered.

## The dispatch row (schema v0.5.2)

The appender **validates the incoming record strictly** and rejects (exit 2) on any
violation, listing every error. Unknown keys are rejected — including the pre-v0.5.2
keys `status`, `success_metric`, `constraints`, `anti_bias` (top level), `agents`
(top level), `corpus`, `topic_slug`, `session`, and `created`, which were **removed by
schema v0.5.2** and get an explicit error saying so.

### Top level

| Field | Required | Meaning / constraint |
|-------|----------|----------------------|
| `dispatch_id` | ✅ | Unique id, `YYYY-MM-DD-<slug>` (§5). Dedup key — re-registering the same id is a no-op. |
| `schema_version` | ✅ | Must be **exactly** `"0.5.2"`. |
| `dispatch_type` | ✅ | `research \| code \| review \| plan \| suggestion`. Only `research` is LIVE; the other four are reserved (FORECAST) — the appender notes this but records anyway. |
| `goal` | ✅ | Non-empty string — the human's objective, one or two sentences. |
| `context` | ✅ | Non-empty string — 2–4 sentences of framing; the only channel subagents get (§5). |
| `max_loops` | ✅ | Integer 1..5 — whole-sequence re-run ceiling. |
| `final_approver` | ✅ | Non-empty string: `parent` or the `agent_name` of a dedicated meta-evaluate approver (never a working-group member — Principle 12). |
| `groups` | ✅ | **JSON column** — non-empty array of group objects (below). |
| `meta` | – | If present, must be boolean `true` (planning/framework dispatches only). |
| `parent_dispatch_id` | – | String (or null/omitted) — only on a dispatch planned by a meta dispatch. |
| `anti_bias_global` | – | String — dispatch-wide tension theme (required by the constitution when ≥ 2 groups fan out; the appender does not enforce that conditional). |
| `working_folder` | research: ✅ | Repo-relative path where outputs land. **Required when `dispatch_type` is `research`; must never start with `vault/`.** |
| `invoked_by` | – | Email of the invoking human. If omitted, the appender resolves it from `git config user.email` (fail-soft: warning + `null`). |
| `connections` | – | **JSON column** — array of `{from, to, type, loop_cap?}` objects (below). |
| `project_dir` | – | Control key: repo-root fallback when `CLAUDE_PROJECT_DIR` is unset. Never emitted to the ledger. |
| `created` | stamped | ISO timestamp **stamped by the appender** — supplying it is rejected (removed by v0.5.2). |

### Each object in `groups`

| Key | Required | Meaning / constraint |
|-----|----------|----------------------|
| `group_id` | ✅ | Stable id, unique among groups; the target of `connections` references. |
| `role` | ✅ | `investigate \| evaluate \| meta-evaluate \| synthesize`. |
| `agents` | ✅ | Non-empty array of agent objects (below). They run in parallel. |
| `n` | – | Integer ≥ 1; if present must equal `agents.length`. |
| `robot_talks` | – | Boolean — agents discuss after their parallel runs (n ≥ 2 only meaningful). |
| `layers` | – | Integer ≥ 1 — sequential invocations of this group. |
| `anti_bias` | n ≥ 2: ✅ | The group's named tension axis. **Required when the group has ≥ 2 agents** (Principle 5). |

### Each object in `groups[].agents`

| Key | Required | Meaning / constraint |
|-----|----------|----------------------|
| `role` | ✅ | `explorer \| skeptic \| writer \| auditor`. |
| `model` | ✅ | Non-empty string — concrete model id, picked by difficulty. |
| `token_budget` | ✅ | Positive integer — declared output-length target; **no unlimited default** (§5). |
| `initial_prompt` | ✅ | Non-empty string — the full briefing the agent receives at launch. Newlines are fine: JSON.stringify escapes them into the single-line JSON column. |
| `agent_name` | – | String from the agent pool, or `null`. |
| `angle` | n ≥ 2: ✅ | This agent's position on the group's `anti_bias` axis. **Required when the group has ≥ 2 agents.** |

### Each object in `connections`

Exactly `{from, to, type, loop_cap?}` — any other key is rejected.

| Key | Required | Meaning / constraint |
|-----|----------|----------------------|
| `from` / `to` | ✅ | Must reference declared `group_id`s. |
| `type` | ✅ | `sequential \| zig-zag \| feedback`. |
| `loop_cap` | – | Positive integer. Allowed **only** on `zig-zag`/`feedback`; **must be absent on `sequential`** (§5). |

## How to write the row

The skill ships a deterministic appender; do **not** hand-edit the YAML.

1. Assemble the dispatch record as JSON (the fields above) — normally read straight off
   the confirmed dispatch sheet (goal, context, groups, connections, per-agent
   angle/model/token_budget/initial_prompt).
2. Write that JSON to a temp file (use the Write tool, so it is UTF-8 — do **not**
   pipe JSON through PowerShell, which mangles it to UTF-16):
   `<repo-root>/.register-dispatch.tmp.json`
3. Run the appender (prefer the Bash tool):
   ```sh
   node "$HOME/.claude/skills/register-dispatch/append-dispatch.cjs" \
        "$CLAUDE_PROJECT_DIR/.register-dispatch.tmp.json"
   ```
   It creates `telemetry/agents/subagents-dispatch.yaml` (and its directories) with
   a header if absent, validates the record against schema v0.5.2 (exit 2 with the
   full error list on violation), appends one row, and is idempotent on
   `dispatch_id`. Before appending it structurally self-checks the existing ledger
   (line shapes, JSON values, unique ids) and refuses with exit 1 if the ledger is
   corrupt — fix the corruption before registering anything else.
   The repo root is resolved as `$CLAUDE_PROJECT_DIR`, falling back to a
   `project_dir` key in the record, then to the current working directory — so
   if the env var is unset, run the appender from the repo root (or set
   `project_dir` in the JSON) and pass the temp file as a relative path.
4. Delete the temp file.

## Example record

```json
{
  "dispatch_id": "2026-06-12-residue-precedent-sweep",
  "schema_version": "0.5.2",
  "dispatch_type": "research",
  "goal": "Determine whether the residue-ledger pattern has prior art that constrains our naming.",
  "context": "The discovery names a residue ledger as novel. Before publishing we need to know if the pattern is already owned in the literature and under what name. Outputs feed the discovery's open-question section.",
  "max_loops": 1,
  "final_approver": "parent",
  "anti_bias_global": "novelty optimism vs precedent skepticism",
  "working_folder": "research/residue-precedent-sweep/",
  "invoked_by": "victorboscaro@gmail.com",
  "groups": [
    {
      "group_id": "explorers",
      "role": "investigate",
      "n": 2,
      "anti_bias": "source corpus (formal-methods literature vs practitioner blogs)",
      "agents": [
        {"agent_name": "Abramsky, Samson", "role": "explorer", "model": "claude-sonnet-4-6", "token_budget": 800,
         "angle": "owns the formal-methods literature side",
         "initial_prompt": "Search the formal-methods literature for prior art on residue/remainder ledgers in spec governance. Return: candidate precedents with citations, or a defended no-precedent claim. Budget ~800 tokens."},
        {"agent_name": "Baez, John", "role": "explorer", "model": "claude-sonnet-4-6", "token_budget": 800,
         "angle": "owns the practitioner/industry side",
         "initial_prompt": "Search practitioner sources (ADRs, RFC processes, engineering blogs) for residue-ledger-like patterns. Return: candidate precedents with links, or a defended no-precedent claim. Budget ~800 tokens."}
      ]
    },
    {
      "group_id": "synthesizer",
      "role": "synthesize",
      "agents": [
        {"agent_name": null, "role": "writer", "model": "claude-opus-4-8", "token_budget": 3000,
         "initial_prompt": "Draft findings.md from the explorers' returns: every load-bearing claim cites the collected return it rests on."}
      ]
    }
  ],
  "connections": [
    {"from": "explorers", "to": "synthesizer", "type": "sequential"},
    {"from": "synthesizer", "to": "explorers", "type": "feedback", "loop_cap": 1}
  ]
}
```

This appends exactly one row, with `groups` and `connections` as JSON columns. The
resulting ledger row looks like:

```yaml
  - dispatch_id: "2026-06-12-residue-precedent-sweep"
    schema_version: "0.5.2"
    created: "2026-06-12T18:00:00.000Z"
    invoked_by: "victorboscaro@gmail.com"
    dispatch_type: "research"
    goal: "Determine whether the residue-ledger pattern has prior art that constrains our naming."
    context: "The discovery names a residue ledger as novel. …"
    max_loops: 1
    final_approver: "parent"
    anti_bias_global: "novelty optimism vs precedent skepticism"
    working_folder: "research/residue-precedent-sweep/"
    groups: [{"group_id":"explorers","role":"investigate","n":2,"anti_bias":"source corpus (formal-methods literature vs practitioner blogs)","agents":[…]}, …]
    connections: [{"from":"explorers","to":"synthesizer","type":"sequential"},{"from":"synthesizer","to":"explorers","type":"feedback","loop_cap":1}]
```

## Closing a dispatch (the close row)

The ledger is **append-only** — never edit the original row to mark a dispatch
finished (a hook denies direct edits). Instead, append the **close row**: run the
same appender with a record that has `close_of` (the original `dispatch_id`)
instead of `dispatch_id`:

```json
{
  "close_of": "2026-06-12-residue-precedent-sweep",
  "exit_reason": "resolved",
  "agents_spawned": {"total": 3, "tree": {"investigate": 2, "synthesize": 1, "helpers": 0}, "loops_used": 1},
  "feedback_prompts": ["Explorers: the formal-methods return cites no post-2020 source — re-sweep 2020+ venues for the same pattern."],
  "invoked_by": "victorboscaro@gmail.com"
}
```

| Field | Required | Meaning / constraint |
|-------|----------|----------------------|
| `close_of` | ✅ | The `dispatch_id` being closed. Dedup key — re-closing the same id is a no-op. Warns (but still appends) if no matching dispatch row exists. |
| `exit_reason` | ✅ | Closed vocabulary: `resolved \| loop_ceiling_reached \| dissent_irreconcilable \| user_abort \| error`. Precedence when several apply: `user_abort` > `error` > `dissent_irreconcilable` > `loop_ceiling_reached` > `resolved` (§5). |
| `agents_spawned` | ✅ | **JSON column** — object with numeric `total`, object `tree` (keyed by role-category, helpers in their own bucket), and optional integer `loops_used`. |
| `feedback_prompts` | – | **JSON column** — array of strings: each `feedback`-edge ask, recorded **verbatim** in the close row (Principle 3 / §5 `feedback` semantics). |
| `invoked_by` | – | As on the dispatch row: record value, else `git config user.email`, else `null` with a warning. |
| `closed` | stamped | ISO timestamp **stamped by the appender** — supplying it is rejected. |

A close record must **not** carry `dispatch_id`, a top-level `agents` array, or any
other key not in this table — unknown keys are rejected (exit 2).

## Grandfathering (old rows)

Rows written under pre-v0.5.2 schemas (recognizable by the absence of
`schema_version`; they carry old keys like `status`, `agents`, `success_metric`)
are **valid historical artifacts and are never re-validated** against the new
schema. The appender's pre-append self-check over the existing ledger is
**structure-only** (line shapes, JSON values, unique ids) so old rows keep
passing forever. Strict v0.5.2 validation applies **only to the incoming
record**, before append.
