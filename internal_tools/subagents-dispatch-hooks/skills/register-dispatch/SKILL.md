---
name: register-dispatch
description: Record a subagent dispatch in <repo-root>/telemetry/agents/subagents-dispatch.yaml — two appends per dispatch (dispatch row + close row), with each agent's angle and the anti_bias axis. Use whenever you dispatch one or more subagents (a research-skill run OR an ad-hoc Agent call); only `research`, `review`, and `experiment` are LIVE — the other three dispatch_types are reserved names until populated. Trivial single lookups that spawn no subagent do not need registration. Single owner of the record/sheet fill mechanics — the form layer of the router → type-skill → form chain (field tables, enums, appender, close row).
---

# register-dispatch

Record **one row per dispatch** in the repo ledger `telemetry/agents/subagents-dispatch.yaml`,
under the subagents-strategy constitution **schema v0.7.0**. A dispatch contributes exactly
**two appends** (constitution Principle 3): the **dispatch row** (the spec, at dispatch) and
the **close row** (`close_of` + outcome, at termination). The ledger is append-only — rows
are never edited in place.

## When to use

- After (or as) you dispatch subagents for any non-trivial task.
- **Principle-2 gate:** append only after the human's explicit confirm of the sheet —
  the gate is owned by the router (`domainspec-subagents-strategy`) / constitution P2;
  never append before it.
- Register **once per dispatch**, not once per agent or per group. A dispatch with three
  groups and six agents is **one** row; `groups` is a JSON column.
- At termination, append the **close row** (see below). Both appends use the same appender.
- Skip only for trivial inline work that spawns no subagent. A single helper invocation
  is not a dispatch (P11, owned by the router) — do not register it; it is reported in
  the parent's `agents_spawned`.

## The dispatch row (schema v0.7.0)

The appender **validates the incoming record strictly** and rejects (exit 2) on any
schema violation, listing every error. Unknown keys are rejected — keys in constitution
§7's removed table (`success_metric`, `constraints`, `created`) get an explicit
**removed by schema v0.5.2** error (historical: those keys were removed at v0.5.2); old
ledger-row-only keys (`status`, `anti_bias` top level, `agents` top level, `corpus`,
`topic_slug`, `session`) get a **pre-v0.5.2 ledger-row key, not in the v0.7.0 schema**
error.

**Not enforced by the appender** (sheet-design rules owned by the strategist and the
human confirm gate): `final_approver` working-group membership (P12 no-self-approval),
the `dispatch_id` `YYYY-MM-DD-<slug>` format, the `layers > 1`
not-on-a-zig-zag/feedback-endpoint corollary, and the semantic four-test anti-bias
decision rule (constitution P5: axis vocabulary / clone / spread / evidence — gate-checked
on the sheet). The `anti_bias_global` required-when-≥ 2-groups-fan-out conditional **is
appender-enforced** since the 2026-06-12 in-place amendment (constitution §9).

### Top level

| Field                | Required               | Meaning / constraint                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dispatch_id`        | ✅                     | Unique id, `YYYY-MM-DD-<slug>` (§5). Dedup key — re-registering the same id is a no-op.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `schema_version`     | ✅                     | Must be **exactly** `"0.7.0"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `dispatch_type`      | ✅                     | `research \| code \| review \| plan \| suggestion \| experiment`. `research`, `review`, and `experiment` are LIVE (review 2026-06-12; experiment 2026-06-14, narrow recipe — owner decisions); the other three (`code`, `plan`, `suggestion`) are RESERVED and the appender rejects them under v0.7.0. `experiment` runs the falsification strategy (role-set designer/runner/adjudicator/skeptic; grader = falsification against a pre-registered criterion + internal validity + reproducibility; verdict SURVIVED/FALSIFIED/INVALID; the criterion is a `working_folder` artifact, never a column). |
| `goal`               | ✅                     | Non-empty string — the human's objective, one or two sentences.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `context`            | ✅                     | Non-empty string — 2–4 sentences of framing; the only channel subagents get (§5).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `max_loops`          | ✅                     | Integer 1..5 — whole-sequence re-run ceiling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `final_approver`     | ✅                     | Non-empty string: `parent` or the `agent_name` of a dedicated approver agent (no self-approval — P12).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `evidence_binding`   | ✅                     | **JSON column** binding the live sheet file and SHA-256 to exactly two independent PASS verdict handles and one explicit-confirmation handle. See below.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `groups`             | ✅                     | **JSON column** — non-empty array of group objects (below).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `meta`               | –                      | If present, must be boolean `true` (planning/framework dispatches only).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `parent_dispatch_id` | –                      | String (or null/omitted) — only on a dispatch planned by a meta dispatch.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `anti_bias_global`   | ≥ 2 fan-out groups: ✅ | String — dispatch-wide tension theme. **Required when ≥ 2 groups have ≥ 2 agents — appender-enforced (exit 2)** since the 2026-06-12 in-place amendment (constitution §9).                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `working_folder`     | LIVE types: ✅         | Repo-relative path where outputs land. **Required when `dispatch_type` is `research`, `review`, or `experiment`; must never start with `vault/`.**                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `invoked_by`         | –                      | Email of the invoking human. If omitted, the appender resolves it from `git config user.email` (fail-soft: warning + `null`). Tooling-level extension, not in constitution §5 (owner-directed 2026-06-12), pending a one-line constitutional amendment.                                                                                                                                                                                                                                                                                                                                                |
| `connections`        | –                      | **JSON column** — array of `{from, to, type, loop_cap?}` objects (below).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `project_dir`        | –                      | Control key: repo-root fallback when `CLAUDE_PROJECT_DIR` is unset. Never emitted to the ledger.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `created`            | stamped                | ISO timestamp **stamped by the appender** — supplying it is rejected (removed by v0.5.2).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### `evidence_binding`

The evidence binding stores handles and digests, never full subagent returns or
chat transcripts:

```json
{
  "sheet_path": "research/example/dispatch-sheet.json",
  "sheet_sha256": "<64 lowercase hex characters>",
  "tension_verdicts": [
    {
      "handle": "tension-run-1",
      "verdict": "pass",
      "sheet_sha256": "<same digest>"
    },
    {
      "handle": "tension-run-2",
      "verdict": "pass",
      "sheet_sha256": "<same digest>"
    }
  ],
  "confirmation": {
    "handle": "confirmation-record-1",
    "confirmed": true,
    "sheet_sha256": "<same digest>"
  }
}
```

`sheet_path` must be a repository-relative regular file that resolves inside
the repository. The appender hashes its current bytes and rejects a digest
mismatch, one or failing verdict, duplicate verdict handles, absent
confirmation, or any digest that does not equal `sheet_sha256`. Any sheet edit
after tension or confirmation therefore requires new verdict and confirmation
evidence before registration.

### Each object in `groups`

| Key           | Required  | Meaning / constraint                                                                                                                                                                                   |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `group_id`    | ✅        | Stable id, unique among groups; the target of `connections` references. A group has **no** `role` field — its function is read off its agents' roles, and its workflow position off its `connections`. |
| `agents`      | ✅        | Non-empty array of agent objects (below). They run in parallel.                                                                                                                                        |
| `n`           | –         | Integer ≥ 1; if present must equal `agents.length`.                                                                                                                                                    |
| `robot_talks` | –         | Boolean — agents discuss after their parallel runs (n ≥ 2 only meaningful).                                                                                                                            |
| `layers`      | –         | Integer ≥ 1 — sequential invocations of this group. Unenforced: a group with `layers > 1` may not sit on a zig-zag/feedback endpoint (§5 layers corollary).                                            |
| `anti_bias`   | n ≥ 2: ✅ | The group's named tension axis. **Required when the group has ≥ 2 agents** (Principle 5).                                                                                                              |

### Each object in `groups[].agents`

| Key              | Required  | Meaning / constraint                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `role`           | ✅        | `explorer \| synthesizer \| skeptic \| writer \| auditor`. Pipeline order: explorers gather → **synthesizer** reconciles their returns into a candidate picture (n:1, exchanges with reviewers, may pull more from explorers) → skeptics/reviewers attack → **writer** persists `findings.md` via the `domainspec-findings-writing` skill (n:1) → auditor. `research.md` (the verbatim explorer transcript) is **not** a writer task — the strategist appends it via `domainspec-research-writing`. |
| `model`          | ✅        | Non-empty string — concrete model id, picked by difficulty.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `token_budget`   | ✅        | Positive integer — declared output-length target; **no unlimited default** (§5).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `initial_prompt` | ✅        | Non-empty string — the full briefing the agent receives at launch. Newlines are fine: JSON.stringify escapes them into the single-line JSON column.                                                                                                                                                                                                                                                                                                                                                 |
| `agent_name`     | –         | String from the agent pool, or `null`.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `angle`          | n ≥ 2: ✅ | This agent's position on the group's `anti_bias` axis. **Required when the group has ≥ 2 agents.**                                                                                                                                                                                                                                                                                                                                                                                                  |

### Each object in `connections`

Exactly `{from, to, type, loop_cap?}` — any other key is rejected.

| Key           | Required | Meaning / constraint                                                                                 |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `from` / `to` | ✅       | Must reference declared `group_id`s.                                                                 |
| `type`        | ✅       | `sequential \| zig-zag \| feedback`.                                                                 |
| `loop_cap`    | –        | Positive integer. Allowed **only** on `zig-zag`/`feedback`; **must be absent on `sequential`** (§5). |

## How to write the row

The skill ships a deterministic appender; do **not** hand-edit the YAML. To check the
ledger (e.g. `dispatch_id` uniqueness), use the Read tool — the append-only hook blocks
Bash access to the file, even read-only commands.

1. Assemble the dispatch record as JSON (the fields above) — normally read straight off
   the confirmed dispatch sheet (goal, context, groups, connections, per-agent
   angle/model/token_budget/initial_prompt). Add `evidence_binding` from the
   frozen sheet, two tension PASS receipts, and explicit confirmation record.
2. Write that JSON to a temp file (use the Write tool, so it is UTF-8 — do **not**
   pipe JSON through PowerShell, which mangles it to UTF-16):
   `<repo-root>/.register-dispatch.tmp.json`
3. Run the appender (prefer the Bash tool):
   ```sh
   node "$HOME/.claude/skills/register-dispatch/append-dispatch.cjs" \
        "$CLAUDE_PROJECT_DIR/.register-dispatch.tmp.json"
   ```
   It creates `telemetry/agents/subagents-dispatch.yaml` (and its directories) with
   a header if absent, validates the record against schema v0.7.0 (exit 2 with the
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
  "schema_version": "0.7.0",
  "dispatch_type": "research",
  "goal": "Determine whether the residue-ledger pattern has prior art that constrains our naming.",
  "context": "The discovery names a residue ledger as novel. Before publishing we need to know if the pattern is already owned in the literature and under what name. Outputs feed the discovery's open-question section.",
  "max_loops": 1,
  "final_approver": "parent",
  "anti_bias_global": "novelty optimism vs precedent skepticism",
  "working_folder": "research/residue-precedent-sweep/",
  "invoked_by": "victorboscaro@gmail.com",
  "evidence_binding": {
    "sheet_path": "research/residue-precedent-sweep/dispatch-sheet.json",
    "sheet_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "tension_verdicts": [
      {
        "handle": "tension-1",
        "verdict": "pass",
        "sheet_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "handle": "tension-2",
        "verdict": "pass",
        "sheet_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ],
    "confirmation": {
      "handle": "confirmation-1",
      "confirmed": true,
      "sheet_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
  },
  "groups": [
    {
      "group_id": "explorers",
      "n": 2,
      "anti_bias": "source corpus (formal-methods literature vs practitioner blogs)",
      "agents": [
        {
          "agent_name": "Abramsky, Samson",
          "role": "explorer",
          "model": "claude-sonnet-4-6",
          "token_budget": 800,
          "angle": "owns the formal-methods literature side",
          "initial_prompt": "Search the formal-methods literature for prior art on residue/remainder ledgers in spec governance. Return: candidate precedents with citations, or a defended no-precedent claim. Budget ~800 tokens."
        },
        {
          "agent_name": "Baez, John",
          "role": "explorer",
          "model": "claude-sonnet-4-6",
          "token_budget": 800,
          "angle": "owns the practitioner/industry side",
          "initial_prompt": "Search practitioner sources (ADRs, RFC processes, engineering blogs) for residue-ledger-like patterns. Return: candidate precedents with links, or a defended no-precedent claim. Budget ~800 tokens."
        }
      ]
    },
    {
      "group_id": "synthesizer",
      "agents": [
        {
          "agent_name": null,
          "role": "synthesizer",
          "model": "claude-opus-4-8",
          "token_budget": 3000,
          "initial_prompt": "Reconcile the explorers' returns into a candidate picture: every load-bearing claim cites the collected return it rests on. Budget ~3000 tokens."
        }
      ]
    }
  ],
  "connections": [
    { "from": "explorers", "to": "synthesizer", "type": "sequential" }
  ]
}
```

This appends exactly one row, with `groups` and `connections` as JSON columns. The
resulting ledger row looks like:

```yaml
- dispatch_id: "2026-06-12-residue-precedent-sweep"
  schema_version: "0.7.0"
  created: "2026-06-12T18:00:00.000Z"
  invoked_by: "victorboscaro@gmail.com"
  dispatch_type: "research"
  goal: "Determine whether the residue-ledger pattern has prior art that constrains our naming."
  context: "The discovery names a residue ledger as novel. …"
  max_loops: 1
  final_approver: "parent"
  anti_bias_global: "novelty optimism vs precedent skepticism"
  working_folder: "research/residue-precedent-sweep/"
  evidence_binding:
    {
      "sheet_path": "research/residue-precedent-sweep/dispatch-sheet.json",
      "sheet_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "tension_verdicts": […],
      "confirmation": { … },
    }
  groups:
    [
      {
        "group_id": "explorers",
        "n": 2,
        "anti_bias": "source corpus (formal-methods literature vs practitioner blogs)",
        "agents": […],
      },
      …,
    ]
  connections:
    [{ "from": "explorers", "to": "synthesizer", "type": "sequential" }]
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
  "agents_spawned": {
    "total": 3,
    "tree": { "explorer": 2, "synthesizer": 1, "helpers": 0 },
    "loops_used": 1
  },
  "feedback_prompts": [
    "Explorers: the formal-methods return cites no post-2020 source — re-sweep 2020+ venues for the same pattern."
  ],
  "invoked_by": "victorboscaro@gmail.com"
}
```

| Field              | Required | Meaning / constraint                                                                                                                                                                                                                                                                                                            |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `close_of`         | ✅       | The `dispatch_id` being closed. Dedup key — re-closing the same id is a no-op. Warns (but still appends) if no matching dispatch row exists — an orphan close row indicates a Principle-3 breach upstream (the dispatch row should have been written at dispatch).                                                              |
| `exit_reason`      | ✅       | Closed vocabulary: `resolved \| loop_ceiling_reached \| dissent_irreconcilable \| user_abort \| error`. Precedence when several apply: §5.                                                                                                                                                                                      |
| `agents_spawned`   | ✅       | **JSON column** — object with numeric `total`, object `tree` (keyed by **agent** role — `explorer \| synthesizer \| skeptic \| writer \| auditor` — plus a `helpers` bucket), and **required** non-negative integer `loops_used` (constitution §5 lists loop iterations used as a component of `agents_spawned`, not optional). |
| `feedback_prompts` | –        | **JSON column** — array of strings: each `feedback`-edge ask, recorded **verbatim** in the close row (Principle 3 / §5 `feedback` semantics).                                                                                                                                                                                   |
| `invoked_by`       | –        | As on the dispatch row: record value, else `git config user.email`, else `null` with a warning. Tooling-level extension, not in constitution §5 (owner-directed 2026-06-12), pending a one-line constitutional amendment.                                                                                                       |
| `project_dir`      | –        | Control key: repo-root fallback when `CLAUDE_PROJECT_DIR` is unset. Accepted by the appender, never emitted to the ledger.                                                                                                                                                                                                      |
| `closed`           | stamped  | ISO timestamp **stamped by the appender** — supplying it is rejected.                                                                                                                                                                                                                                                           |

A close record must **not** carry `dispatch_id`, a top-level `agents` array, or any
other key not in this table — unknown keys are rejected (exit 2).

## Grandfathering (old rows)

Rows written under pre-v0.5.2 schemas (recognizable by the absence of
`schema_version`; they carry old keys like `status`, `agents`, `success_metric`)
are **valid historical artifacts and are never re-validated** against the new
schema. The appender's pre-append self-check over the existing ledger is
**structure-only** (line shapes, JSON values, unique ids) so old rows keep
passing forever. Strict v0.7.0 validation applies **only to the incoming
record**, before append. The ledger file's own header comment is likewise
historical — written once at creation, never edited; it may lag the current schema.
