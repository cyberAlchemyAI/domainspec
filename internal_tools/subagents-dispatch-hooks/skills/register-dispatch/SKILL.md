---
name: register-dispatch
description: Record a subagent dispatch in <repo-root>/telemetry/agents/subagents-dispatch.yaml through the profile-driven registrar. `research`, `review`, `experiment`, and `other` are LIVE; `code`, `plan`, and `suggestion` remain reserved. The durable material-bound sheet is preserved while one run-local registration envelope is consumed.
---

# register-dispatch

Record **one row per dispatch** in the repo ledger `telemetry/agents/subagents-dispatch.yaml`,
under the subagents-strategy constitution **schema v0.10.0** for new rows. Schema
v0.9.0 and older ledger rows remain read-only historical inputs. A dispatch contributes exactly
**two appends** (constitution Principle 3): the **dispatch row** (the spec, at dispatch) and
the **close row** (`close_of` + outcome, at termination). The ledger is append-only — rows
are never edited in place.

## When to use

- Before the tension and human gates, run the non-mutating confirmation-readiness
  validator against the exact persisted candidate sheet. It validates the live
  row core without requiring `evidence_binding` and never mutates the ledger. A
  run-phase experiment performs one bounded read-only lookup to prove its closed
  proposal and exact criterion lineage before confirmation.
- For a v0.10.0 candidate, registration additionally requires one exact passing
  `domainspec.preconfirmation-closure.v1` receipt over the same sheet,
  material projection, criterion package, execution topology, briefings, and
  consumer versions. The receipt uses `scope: experiment` when experiment-only
  topology and criterion checks are reachable; other dispatches use `scope:
dispatch` and bind null execution refs rather than inventing an inapplicable
  rehearsal. Confirmation must bind the same `material_sha256`.
- After (or as) you dispatch subagents for any non-trivial task.
- **Principle-2 gate:** append only after the human's explicit confirmation of
  the material strategy, either directly or carried by a deterministic
  material-equivalence receipt —
  the gate is owned by the router (`domainspec-subagents-strategy`) / constitution P2;
  never append before it.
- Register **once per dispatch**, not once per agent or per group. A dispatch with three
  groups and six agents is **one** row; `groups` is a JSON column.
- At termination, append the **close row** (see below). Both appends use the same appender.
- Skip only for trivial inline work that spawns no subagent. A single helper invocation
  is not a dispatch (P11, owned by the router) — do not register it; it is reported in
  the parent's `agents_spawned`.

## The dispatch row (schema v0.10.0; v0.9.0 historical compatibility)

The appender **validates the incoming record strictly** and rejects (exit 2) on any
schema violation, listing every error. Unknown keys are rejected — keys in constitution
§7's removed table (`success_metric`, `constraints`, `created`) get an explicit
**removed by schema v0.5.2** error (historical: those keys were removed at v0.5.2); old
ledger-row-only keys (`status`, `anti_bias` top level, `agents` top level, `corpus`,
`topic_slug`, `session`) get a **pre-v0.5.2 ledger-row key, not in the v0.9.0 schema**
error.

**Not enforced by the appender** (sheet-design rules owned by the strategist and the
human confirm gate): the `dispatch_id` `YYYY-MM-DD-<slug>` format, the `layers > 1`
not-on-a-zig-zag/feedback-endpoint corollary, and the semantic four-test anti-bias
decision rule (constitution P5: axis vocabulary / clone / spread / semantic
evidence quality — gate-checked on the sheet). The appender deterministically
enforces complete pair coverage, pool membership, non-null identity uniqueness,
and final-approver eligibility before tension or confirmation. The
`anti_bias_global` required-when-≥ 2-groups-fan-out conditional is also
appender-enforced.

### Top level

| Field                 | Required               | Meaning / constraint                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dispatch_id`         | ✅                     | Unique id, `YYYY-MM-DD-<slug>` (§5). Dedup key — re-registering the same id is a no-op.                                                                                                                                                                                                                                                                                           |
| `schema_version`      | ✅                     | New candidates and new dispatch rows must be **exactly** `"0.10.0"`. Existing `"0.9.0"` sheets and ledger rows remain validate-only historical inputs; they cannot be newly registered or rewritten.                                                                                                                                                                              |
| `dispatch_type`       | ✅                     | `research \| code \| review \| plan \| suggestion \| experiment \| other`. `research`, `review`, `experiment`, and `other` are LIVE; the other three remain RESERVED. Experiment owns explicit `propose` and `run` contracts. `other` is the bounded execution fallback and requires the exact scope and independent downstream review described by its type owner.               |
| `goal`                | ✅                     | Non-empty string — the human's objective, one or two sentences.                                                                                                                                                                                                                                                                                                                   |
| `context`             | ✅                     | Non-empty string — 2–4 sentences of framing; the only channel subagents get (§5).                                                                                                                                                                                                                                                                                                 |
| `max_loops`           | ✅                     | Integer 1..5 — whole-sequence re-run ceiling.                                                                                                                                                                                                                                                                                                                                     |
| `final_approver`      | ✅                     | Exactly `parent`, or the pooled `agent_name` that appears once as the sole `auditor` in a singleton dedicated approval group. Arbitrary external names and working roles are rejected before confirmation.                                                                                                                                                                        |
| `evidence_binding`    | ✅                     | **JSON column** binding the live sheet file and SHA-256 to exactly two tension-disposition handles and one confirmation handle. V0.10.0 also requires the exact passing preconfirmation-closure receipt and `confirmation.material_sha256`. Subject-group sheets require two independent PASS receipts; no-subject sheets require the canonical mechanical checker/reviewer pair. |
| `groups`              | ✅                     | **JSON column** — non-empty array of group objects (below).                                                                                                                                                                                                                                                                                                                       |
| `meta`                | –                      | If present, must be boolean `true` (planning/framework dispatches only).                                                                                                                                                                                                                                                                                                          |
| `parent_dispatch_id`  | –                      | String (or null/omitted) — only on a dispatch planned by a meta dispatch.                                                                                                                                                                                                                                                                                                         |
| `anti_bias_global`    | ≥ 2 fan-out groups: ✅ | String — dispatch-wide tension theme. **Required when ≥ 2 groups have ≥ 2 agents — appender-enforced (exit 2)** since the 2026-06-12 in-place amendment (constitution §9).                                                                                                                                                                                                        |
| `working_folder`      | LIVE types: ✅         | Repo-relative path where outputs or dispatch receipts land. **Required when `dispatch_type` is `research`, `review`, `experiment`, or `other`; must never start with `vault/`.** It does not broaden confirmed write authority.                                                                                                                                                   |
| `experiment_contract` | experiment: ✅         | Strict JSON object required exactly for `dispatch_type: experiment`. `propose` declares the criterion output. `run` binds a closed proposal, exact criterion, distinct outputs, and `parent_mechanical` adjudication with a rule locator. It is forbidden for other types.                                                                                                        |
| `invoked_by`          | –                      | Email of the invoking human. If omitted, the appender resolves it from `git config user.email` (fail-soft: warning + `null`). Tooling-level extension, not in constitution §5 (owner-directed 2026-06-12), pending a one-line constitutional amendment.                                                                                                                           |
| `connections`         | –                      | **JSON column** — array of `{from, to, type, loop_cap?}` objects (below).                                                                                                                                                                                                                                                                                                         |
| `project_dir`         | –                      | Control key: repo-root fallback when `CLAUDE_PROJECT_DIR` is unset. Never emitted to the ledger.                                                                                                                                                                                                                                                                                  |
| `created`             | stamped                | ISO timestamp **stamped by the appender** — supplying it is rejected (removed by v0.5.2).                                                                                                                                                                                                                                                                                         |

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
confirmation, or any digest that does not equal `sheet_sha256`. This exact
digest is machine-integrity evidence: any sheet edit requires new readiness and
tension evidence before registration. `confirmation.sheet_sha256` attaches the
confirmation handle to the current admitted machine bytes; it does not mean the
human approved serialization details. The router may carry a prior human
confirmation only with a deterministic material-equivalence receipt.

The appender parses the exact confirmed sheet and recomputes the `check-tension`
subject-group predicate: at least two agents in one group, with at least one
`explorer`, `skeptic`, or `auditor`. Subject-group sheets keep the ordinary two
independent PASS handles. A sheet with no subject group spawns no tension agents
and must instead carry exactly this digest-bound set:

```text
check-tension:no-subject:checker:<sheet_sha256>
check-tension:no-subject:reviewer:<sheet_sha256>
```

Those two records are mechanical gate slots, not independent judgments. The
registrar rejects invented ordinary handles for a no-subject sheet, reserved
no-subject handles for a subject-group sheet, predicate drift between the sheet
and registered row, and any missing, duplicate, partial, or stale pair. Neither
branch bypasses `confirmation.confirmed: true`.

For experiment rows, the appender also parses the confirmed sheet and requires
its `experiment_contract` to equal the registered contract exactly. The sheet
digest alone cannot license a different phase, criterion, output path, or
adjudication rule.

### `experiment_contract`

Propose shape:

```json
{
  "phase": "propose",
  "criterion_output_path": "CRITERION.md"
}
```

Run shape:

```json
{
  "phase": "run",
  "proposal_dispatch_id": "2026-08-27-example-propose",
  "criterion_ref": {
    "path": "experiments/example/CRITERION.md",
    "sha256": "<64 lowercase hex characters>",
    "size": 1234
  },
  "experiment_output_path": "experiment.md",
  "findings_output_path": "findings.md",
  "adjudication": {
    "mode": "parent_mechanical",
    "rule_locator": "experiments/example/CRITERION.md#mechanical-verdict-rule"
  }
}
```

Output paths are relative to `working_folder`. Exact references use
repository-relative paths, SHA-256, and positive byte size. Run readiness reads
only the referenced proposal and close rows and blocks unless the proposal is a
resolved v0.10.0 propose row with status `frozen` and an identical criterion ref.

### Each object in `groups`

| Key                       | Required  | Meaning / constraint                                                                                                                                                                                                    |
| ------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `group_id`                | ✅        | Stable id, unique among groups; the target of `connections` references. A group has **no** `role` field — its function is read off its agents' roles, and its workflow position off its `connections`.                  |
| `agents`                  | ✅        | Non-empty array of agent objects (below). They run in parallel.                                                                                                                                                         |
| `n`                       | –         | Integer ≥ 1; if present must equal `agents.length`.                                                                                                                                                                     |
| `robot_talks`             | –         | Boolean — agents discuss after their parallel runs (n ≥ 2 only meaningful).                                                                                                                                             |
| `layers`                  | –         | Integer ≥ 1 — sequential invocations of this group. Unenforced: a group with `layers > 1` may not sit on a zig-zag/feedback endpoint (§5 layers corollary).                                                             |
| `anti_bias`               | n ≥ 2: ✅ | The group's named tension axis. **Required when the group has ≥ 2 agents** (Principle 5).                                                                                                                               |
| `predicted_disagreements` | n ≥ 2: ✅ | Array of `{pair: [lower_index, higher_index], statement}`. Exactly one record is required for every unordered pair; it must be absent for singleton groups. This digest-owned field is the only Test 4 evidence source. |

### Each object in `groups[].agents`

| Key              | Required  | Meaning / constraint                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `role`           | ✅        | `explorer \| synthesizer \| skeptic \| writer \| auditor`. Pipeline order: explorers gather → **synthesizer** reconciles their returns into a candidate picture (n:1, exchanges with reviewers, may pull more from explorers) → skeptics/reviewers attack → **writer** persists `findings.md` via the `domainspec-findings-writing` skill (n:1) → auditor. `research.md` (the verbatim explorer transcript) is **not** a writer task — the strategist appends it via `domainspec-research-writing`. |
| `model`          | ✅        | Non-empty string — concrete model id, picked by difficulty.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `token_budget`   | ✅        | Positive integer — declared output-length target; **no unlimited default** (§5).                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `initial_prompt` | ✅        | Non-empty string — the full briefing the agent receives at launch. Newlines are fine: JSON.stringify escapes them into the single-line JSON column.                                                                                                                                                                                                                                                                                                                                                 |
| `agent_name`     | –         | String from `telemetry/agents/agent-pool.yaml`, or `null`. Every non-null identity must resolve in that pool and appear only once in the dispatch.                                                                                                                                                                                                                                                                                                                                                  |
| `angle`          | n ≥ 2: ✅ | This agent's position on the group's `anti_bias` axis. **Required when the group has ≥ 2 agents.**                                                                                                                                                                                                                                                                                                                                                                                                  |

### Agent and approver admission

The non-mutating readiness validator resolves
`telemetry/agents/agent-pool.yaml` before the human gate. A missing or
unreadable pool, an unpooled non-null identity, or a repeated non-null identity
blocks. `null` remains valid for an unnamed runtime selection.

`final_approver: "parent"` is always the default valid shape. A named
approver is valid only when that pooled identity occurs exactly once in
`groups`, has role `auditor`, and is the only agent in that group. The
singleton auditor is the approval stage, not a working explorer,
synthesizer, skeptic, or writer. A named identity outside the groups or an
arbitrary external maintainer string is invalid.

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

### Before tension or confirmation

1. Persist the candidate dispatch sheet using the current form owner. The sheet
   contains the dispatch-row fields above except `evidence_binding`, which cannot
   exist until tension and confirmation have happened.
2. Run the non-mutating readiness gate from the repository root:
   ```sh
   node implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs \
     --validate-sheet path/to/dispatch-sheet.json
   ```
3. Continue only when it emits `SHEET_VALIDATION=pass`,
   `SCHEMA_VERSION=<live-version>`, the exact `SHEET_SHA256`, and
   `LEDGER_MUTATION=none`.
4. `WARNING FORM_VERSION_DRIFT` means a selected runtime or candidate sheet is
   stale. Warn the maintainer, rematerialize from this live form owner, and
   validate again before tension or confirmation. The warning never admits an
   invalid sheet.
5. Any other readiness error blocks before tension. This includes an unpooled
   or duplicated identity, an inadmissible final approver, or missing,
   duplicated, reversed, self, out-of-range, or empty pair evidence.
   `check-tension` owns semantic anti-bias quality; it does not replace this
   deterministic readiness gate.

This ordering prevents deterministic registrar defects from creating a second
human gate. Draft-revision authorization is not dispatch confirmation. Ask for
confirmation once, only after readiness and the applicable tension disposition
passes. Any later byte change requires readiness validation and new
digest-bound tension evidence on the
current digest. It requires a new human confirmation only when the router's
material-strategy projection changed or deterministic equivalence is unknown.

### After confirmation

1. Preserve the confirmed sheet at its durable evidence path. Assemble the
   registration record from it and add `evidence_binding`: the exact tension
   disposition, confirmation handle/material digest, and passing closure ref.
2. Generate one `domainspec.subagent-strategy-registration-envelope.v1` under
   `telemetry/agents/runtime/subagents-strategy/`. It binds the private profile,
   durable source-sheet exact ref, material confirmation, optional equivalence
   receipt, closure admission receipt, executable projection digest, temporary
   close path, and the complete registration record. The envelope is run-local;
   the sheet, material projection, tension evidence, and closure stay durable.
3. Run the shared-mechanics appender through the private adapter:
   ```sh
   node implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs \
     --consume telemetry/agents/runtime/subagents-strategy/<dispatch-id>.tmp.json
   ```
   It validates schema v0.10.0 and the envelope, delegates locking, structural
   history checks, durable append, and exact-content idempotence to the public
   registrar engine, appends the normalized private row, then consumes only the
   registration envelope. A failed validation or append preserves the envelope.
   The repo root is resolved from `$ARCANUM_PROJECT_DIR`, then
   `$CODEX_PROJECT_DIR`, then `$CLAUDE_PROJECT_DIR`, falling back to a
   `project_dir` key in the record and finally the current working directory.
4. Verify the normalized ledger row and consumed-envelope state before any
   native action is emitted. Write the later raw close row to the declared
   `temporary_close` path, then run the profile engine in `close` mode:
   ```sh
   node arcanum/arcana/subagent-strategy/scripts/strategy-runtime.cjs close \
     telemetry/agents/runtime/subagents-strategy/<dispatch-id>.close.tmp.json \
     --profile implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/runtime-profile.json
   ```
   A successful close appends exactly one paired row and consumes only that
   run-local close record.

## Example record

```json
{
  "dispatch_id": "2026-06-12-residue-precedent-sweep",
  "schema_version": "0.10.0",
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
      "predicted_disagreements": [
        {
          "pair": [0, 1],
          "statement": "Agent 0 searches formal-methods literature while agent 1 searches practitioner sources on the source-corpus axis; each exposes the other's corpus blind spot."
        }
      ],
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
  schema_version: "0.10.0"
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
        "predicted_disagreements":
          [
            {
              "pair": [0, 1],
              "statement": "Agent 0 searches formal sources while agent 1 searches practitioner sources; each exposes the other's corpus blind spot.",
            },
          ],
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

| Field                 | Required            | Meaning / constraint                                                                                                                                                                                                                                                                                                            |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `close_of`            | ✅                  | The `dispatch_id` being closed. Dedup key — re-closing the same id is a no-op. A close without a matching dispatch row is rejected; orphan close rows are not admitted.                                                                                                                                                         |
| `exit_reason`         | ✅                  | Closed vocabulary: `resolved \| loop_ceiling_reached \| dissent_irreconcilable \| user_abort \| error`. Precedence when several apply: §5.                                                                                                                                                                                      |
| `agents_spawned`      | ✅                  | **JSON column** — object with numeric `total`, object `tree` (keyed by **agent** role — `explorer \| synthesizer \| skeptic \| writer \| auditor` — plus a `helpers` bucket), and **required** non-negative integer `loops_used` (constitution §5 lists loop iterations used as a component of `agents_spawned`, not optional). |
| `feedback_prompts`    | –                   | **JSON column** — array of strings: each `feedback`-edge ask, recorded **verbatim** in the close row (Principle 3 / §5 `feedback` semantics).                                                                                                                                                                                   |
| `experiment_closeout` | v0.9 experiment: ✅ | Phase-matched typed closeout. Resolved proposals use `frozen` or `invalid`; abnormal proposals use `not_frozen`. Resolved runs use `adjudicated` with a verdict and three exact refs; abnormal runs use `not_adjudicated` without a verdict.                                                                                    |
| `invoked_by`          | –                   | As on the dispatch row: record value, else `git config user.email`, else `null` with a warning. Tooling-level extension, not in constitution §5 (owner-directed 2026-06-12), pending a one-line constitutional amendment.                                                                                                       |
| `project_dir`         | –                   | Control key: repo-root fallback when `CLAUDE_PROJECT_DIR` is unset. Accepted by the appender, never emitted to the ledger.                                                                                                                                                                                                      |
| `closed`              | stamped             | ISO timestamp **stamped by the appender** — supplying it is rejected.                                                                                                                                                                                                                                                           |

A close record must **not** carry `dispatch_id`, a top-level `agents` array, or any
other key not in this table — unknown keys are rejected (exit 2).

### Experiment closeouts

Resolved proposal:

```json
{
  "experiment_closeout": {
    "phase": "propose",
    "status": "frozen",
    "criterion_ref": { "path": "...", "sha256": "...", "size": 1234 }
  }
}
```

Resolved run:

```json
{
  "experiment_closeout": {
    "phase": "run",
    "status": "adjudicated",
    "verdict": "SURVIVED",
    "criterion_ref": { "path": "...", "sha256": "...", "size": 1234 },
    "experiment_ref": { "path": "...", "sha256": "...", "size": 2345 },
    "findings_ref": { "path": "...", "sha256": "...", "size": 3456 }
  }
}
```

`SURVIVED`, `FALSIFIED`, and `INVALID` are scientific verdicts, not execution
statuses. A non-resolved exit must use `not_frozen` or `not_adjudicated`; the
appender rejects a fabricated outcome.

## Grandfathering (old rows)

Rows written under pre-v0.5.2 schemas (recognizable by the absence of
`schema_version`; they carry old keys like `status`, `agents`, `success_metric`)
are **valid historical artifacts and are never re-validated** against the new
schema. The appender's pre-append self-check over the existing ledger is
**structure-only** (line shapes, JSON values, unique ids) so old rows keep
passing forever. Strict v0.9.0 validation applies **only to the incoming
record**, before append. The ledger file's own header comment is likewise
historical — written once at creation, never edited; it may lag the current schema.
