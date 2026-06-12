---
name: domainspec-subagents-strategy
description: Govern any subagent dispatch through one groups/connections sheet — strategist fills it, human confirms it, two rows record it. Invoke whenever a Principle-1 trigger holds (synthesis from 3+ sources, context protection, discardable isolation, or parallel independent tasks); otherwise work inline. Operationalizes the subagents-strategy constitution v0.5.2.
---

# Subagents-Strategy Skill — the strategist's manual

Operationalizes `subagents-strategy-constitution-proposal.md` (repo root, frontmatter `version: 0.5.2-proposal`). When this skill is active, **you (the parent Claude session) enact the strategist role**: you fill the dispatch sheet, propose it in chat, wait for the human confirm, register the row, run the groups, and close with a report plus a close row.

> **Governance note:** the live `vault/constitution/domainspec-subagents-strategy-constitution.md` is still v0.3.0 and has **not yet been superseded on disk**. This skill follows v0.5.2 by owner decision of 2026-06-12. Where the two conflict, v0.5.2 wins. All v0.3.0 machinery (spec files, JSONL telemetry, validator agent + checklist, `recursion_budget`, heuristic rows, `mode` enum, ping-pong, R-numbered rules, the 9-step lifecycle, mandatory writer agents) is **deleted** — do not resurrect any of it.

## When to invoke (Principle 1)

Dispatch only when at least one trigger holds:

- **Synthesis** — 3+ sources to combine.
- **Context protection** — raw output ≫ what the parent needs.
- **Isolation** — discardable exploration.
- **Parallelism** — independent tasks.

If none holds, work inline. Do not dispatch.

**Helper invocations are not dispatches (Principle 11).** A single agent spawned *by* a running agent, within its parent's scope, needs no row and no gate — it is reported post-hoc in the parent's `agents_spawned` report (chat + findings; not written into the ledger row). It escalates to a real dispatch if it fans out (2+ agents) or outgrows the parent's scope. Spawn count is unregulated; reporting is the brake. (The exact helper-vs-dispatch boundary is provisional, not settled law.)

## Lifecycle (§3)

1. **Propose.** Fill the sheet (below) and propose it in chat. The proposal MUST state, for each tensioned pair in any n ≥ 2 group, the question on which the two agents are predicted to disagree (Principle 5).
2. **Confirm.** The human confirms, revises, or abandons. Confirmation is an explicit affirmative in chat — silence or a question is not confirmation. **Nothing persists before the confirm.** The confirmed sheet is **frozen**: any strategist edit after confirm re-enters the gate.
3. **Register + run.** Append the **dispatch row** to `telemetry/agents/subagents-dispatch.yaml` via the sanctioned appender (see Registration binding). Then dispatch groups **sequentially in declared order**; agents inside a group run **in parallel**, each with its own start, briefing, and context — never shared. Dependent work goes in a later group. Outputs land in `working_folder`. An agent error inside a group degrades to a **partial group result** that downstream groups and the `final_approver` must be told about.
4. **Close.** Report `exit_reason` + `agents_spawned` in chat (1–2 sentences) AND in the findings doc, AND append the **close row** (`close_of`) to the registry. The ledger is strictly **append-only** — neither row is ever edited in place; the appender is the single, serializing write path. No other persistence surface exists for dispatch metadata. If a `feedback` edge fired, record its feedback prompt verbatim in the close row.

There is exactly **one human gate** — the entry confirm. No second gate at close (the human keeps the power to abandon at any time → `user_abort`).

## The dispatch sheet (§5)

The human supplies `goal` and may pin any dial (`max_loops`, a `loop_cap`, a group's `layers`, the approver). You fill everything left open.

### Level 1 — dispatch

| Field | Req | What |
|---|---|---|
| `dispatch_id` | R | `YYYY-MM-DD-<slug>` naming the question. Check the ledger first; if the slug repeats within a date, suffix `-2`, `-3`, … — unique in the registry. |
| `schema_version` | R | Literal `"0.5.2"`. |
| `dispatch_type` | R | `research \| code \| review \| plan \| suggestion`. **Only `research` is LIVE**; the other four are reserved names and must not be dispatched. |
| `goal` | R (human) | One–two sentences, outcome not method. Never per-agent — you decompose it across groups. The `final_approver` judges against it. |
| `context` | R | 2–4 sentences of framing. Subagents never see the parent conversation; this is their only channel for judgment calls. |
| `max_loops` | R | Whole-sequence re-runs. Int, default `1`, max `5`. A re-run fires **only** on a `final_approver` reject requesting another round. |
| `final_approver` | R | `parent` (default) or the `agent_name` of a **dedicated approver agent** — sole member of a `meta-evaluate` group that does no other work. Never a working-group member (no self-approval). Receives the full `working_folder`. If its group never runs, approval falls back to `parent`. An agent approver *recommends* accept/reject; a reject may trigger a re-run within `max_loops`. |
| `meta` | O | `true` only on a dispatch *about* dispatching (planning research, redesigning the framework); omitted otherwise. |
| `parent_dispatch_id` | C | Only on a dispatch planned by a meta dispatch; value = that meta dispatch's id. Chain is finite and acyclic. A meta-planned child is a new sheet and re-enters the confirm gate. |
| `anti_bias_global` | C | Required when ≥ 2 groups have n ≥ 2: the dispatch-wide tension theme that per-group axes specialize. |
| `working_folder` | C | Required for `research`. Repo-relative path where all outputs land. **Never `vault/**`.** |

### Level 2 — groups (`groups[]`)

Groups run sequentially in declared order; agents inside each run in parallel.

| Field | Req | What |
|---|---|---|
| `group_id` | R | Stable id, the target of `connections[]` (e.g. `explorers`, `synthesizer`, `reviewers` — labels, not keywords). |
| `role` | R | `investigate \| evaluate \| meta-evaluate \| synthesize`. Canonical shape (Principle 6): investigate → synthesize (mandatory midfield) → evaluate, with meta-evaluate after evaluation when used. Reviewers never review raw explorer output directly. |
| `n` | O | Agent count, default `1`. At n ≥ 2, `anti_bias` and per-agent `angle` become required. |
| `robot_talks` | O | Bool, default `false`; meaningful only at n ≥ 2. The agents come back after their parallel runs and **discuss** along the declared tension before the group returns one result. Flips the group's derived aggregation to `synthesize` and binds `vault/constitution/robot-talks-constitution.md` as versioned at dispatch time (it wins conflicts inside the discussion — but this constitution's single-gate rule overrides any extra human gate it would prescribe). When a synthesizer sits downstream of a robot-talks reviewer group, it MUST receive each reviewer's initial AND final position. |
| `layers` | O | Plain int ≥ 1, default `1`: sequential invocations of this group. **Layers vs loop:** N passes *with conversation between them* ⇒ `loop_cap` on a zig-zag/feedback edge; N *independent* passes (same input, aggregated after) ⇒ `layers`. **Corollary:** an edge incident to a layered group counts as running between its layers — a group with `layers > 1` may not sit on a zig-zag/feedback endpoint. |
| `anti_bias` | C | Required iff n ≥ 2. The group's named tension axis (methodology, source corpus, attack vector, era prior, …); specializes `anti_bias_global` when present, stand-alone otherwise. |

### Level 3 — connections (`connections[]`)

Plain objects: `{from, to, type, loop_cap?}` — nothing else. `from`/`to` reference declared `group_id`s.

- `sequential` — pure handoff; `to` starts after `from` completes. `loop_cap` must be absent.
- `zig-zag` — bounded message exchange between two groups, alternating turns. Canonical: synthesizer ↔ reviewers. Exchange only — it changes neither group's aggregation. A group's robot-talks discussion resolves completely before any zig-zag turn. **Convergence:** every reviewer-side turn hunts inconsistencies; a turn in which no participating reviewer raises one terminates the exchange as converged — `loop_cap` is a ceiling, not a quota.
- `feedback` — a back-edge to an earlier group for more material. Canonical: synthesizer → explorers. The same agents are re-invoked; the requesting group's ask **is** the feedback prompt, recorded verbatim in the close row.

`loop_cap` is allowed only on `zig-zag`/`feedback`; default `2`; the human may pin it.

**Canonical edge set (default for research):** explorers → synthesizer (`sequential`) and synthesizer ↔ reviewers (`zig-zag`) when the canonical groups are declared. The synthesizer → explorers `feedback` edge is **conditional**: instantiated only when there is a reviewer/auditor group AND material may be missing — never auto-instantiated. You may override any of these on the sheet.

**Three dials, three scopes** — one scenario, one dial; if two seem to fit, the smallest scope wins:

| Dial | Scope | Use when |
|---|---|---|
| `layers: 2` (group) | same group re-invoked | two independent passes over the same material, no new conversation |
| `loop_cap: 2` (edge) | conversation between two groups | two rounds of synthesizer ↔ reviewers exchange |
| `max_loops: 2` (dispatch) | the whole dispatch | the final_approver rejected and asked for the entire sequence again |

### Level 4 — agents (`groups[].agents[]`)

| Field | Req | What |
|---|---|---|
| `agent_name` | O | From the pool at `telemetry/agents/agent-pool.yaml` (245 names, each with an ordered `role_fit` list). Recommended for fan-outs (legible narration); optional for ad-hoc (`agent_name: null`). |
| `role` | R | (research vocabulary) `explorer \| skeptic \| writer \| auditor`. |
| `angle` | C | Required iff group n ≥ 2: this agent's one-sentence position on the group's `anti_bias` axis. |
| `initial_prompt` | R | The **full launch briefing**: task, context, what is ruled out, expected return. Composed from `goal` + `context` + the agent's `angle`. The prompt states the task, not a reading list — the agent chooses what to read. Recording it is what makes the dispatch auditable. |
| `model` | R | Concrete model id, picked by **difficulty** (hard adversarial/synthesis work → heavier; mechanical sweeps → lighter), not habit. The human validates picks at the confirm gate. Caveat: in an n ≥ 2 group, putting every tensioned agent on the same model can blunt the predicted disagreement — not prohibited, but flag it. |
| `token_budget` | R | Int. Per-agent output target — **no unlimited default**; set by difficulty and stated in the `initial_prompt`. It is a declared target, not harness-enforced; it bounds one agent's cost, not recursion-runaway (open question). |

### Aggregation — derived, never a field

`robot_talks: true` → the group synthesizes; otherwise → concat (an n = 1 group simply returns its output). Zig-zag is inter-group exchange and never enters this rule. A bare concat is intermediate plumbing, **never the dispatch's final deliverable** — it feeds a downstream synthesize group or the `final_approver`.

## Outputs (Principle 9)

For `dispatch_type: research`, everything lands in `working_folder`:

- **Research fan-out (n ≥ 2):** two files — `<working_folder>/research.md` (collected returns) and `<working_folder>/findings.md` (cited synthesis). **Every load-bearing claim in findings cites the collected return it rests on**; the `final_approver` checks this when recommending acceptance (it receives both files).
- **Research n = 1:** a single `<working_folder>/findings.md`.

The constitutional requirement is the **files**, not who writes them — you may delegate the writing to a helper agent, but there is no mandatory writer-agent machinery. Claim ≤ proof in every artifact (Principle 10).

## Close

**`exit_reason`** — closed vocabulary, one value:

| Value | When |
|---|---|
| `resolved` | The `final_approver` accepted the result — **nothing else counts as resolved**. |
| `loop_ceiling_reached` | An edge `loop_cap` OR `max_loops` hit without converging. |
| `dissent_irreconcilable` | Agents did not reconcile after the ceiling. |
| `user_abort` | The human abandoned (at the gate or any time). |
| `error` | Technical failure leaving the dispatch unable to produce its deliverable. |

**Precedence when several apply:** `user_abort` > `error` > `dissent_irreconcilable` > `loop_ceiling_reached` > `resolved`. A ceiling hit that leaves unreconciled positions is `dissent_irreconcilable`; a `final_approver` rejection the human chooses not to re-run is `user_abort`. Silent exit is a violation.

**`agents_spawned`** — total count + spawn tree keyed by **role-category** (`explorer ↔ investigate`, `skeptic ↔ evaluate`, `writer ↔ synthesize`, `auditor ↔ meta-evaluate`), with helper invocations in their own `helpers` bucket, + `loops_used`. E.g. `{total: 6, tree: {investigate: 3, synthesize: 1, evaluate: 2, helpers: 0}, loops_used: 1}`.

Both values go to chat + findings doc + the close row.

## Registration binding (tooling — operational glue, not constitution text)

Both rows are appended by writing a **UTF-8 JSON record file** and running:

```
node internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs <record.json>
```

(also installed at `~/.claude/skills/register-dispatch/`). The appender targets `telemetry/agents/subagents-dispatch.yaml` and is the single serializing write path; an append-only hook blocks any other edit to the ledger.

**Canonical record shape — match it exactly:**

- **Dispatch row keys:** `dispatch_id, schema_version, dispatch_type, goal, context, max_loops, final_approver, meta?, parent_dispatch_id?, anti_bias_global?, working_folder, invoked_by?, groups[], connections[]?`
  - `groups[]` = `{group_id, role, n?, robot_talks?, layers?, anti_bias?, agents: [{agent_name?, role, angle?, model, token_budget, initial_prompt}]}`
  - `connections[]` = `{from, to, type, loop_cap?}`
- **Close row keys:** `close_of, exit_reason, agents_spawned, feedback_prompts?, invoked_by?`
- `created` / `closed` timestamps are **stamped by the appender, never by the strategist**.
- `invoked_by`: the invoking user's git/GitHub email; if omitted, the appender resolves it from `git config user.email`. Note: `invoked_by` is a **tooling-level extension not yet in constitution §5** (owner-directed 2026-06-12; pending a one-line constitutional amendment).

**Skeleton (abridged — defer to constitution §6 for the full annotated skeleton):**

```yaml
- dispatch_id: 2026-06-12-example-slug
  schema_version: "0.5.2"
  dispatch_type: research
  goal: >
    One or two sentences (human-supplied).
  context: >
    2-4 sentences of framing.
  max_loops: 1
  final_approver: parent
  anti_bias_global: novelty optimism vs precedent skepticism
  working_folder: docs/features/<feature>/research/<topic>/
  groups:
    - group_id: explorers
      role: investigate
      n: 2
      anti_bias: source corpus (A vs B)
      agents:
        - {agent_name: "Abramsky, Samson", role: explorer, angle: owns side A,
           model: <id-by-difficulty>, token_budget: 800, initial_prompt: "full briefing..."}
        - {agent_name: "Noether, Emmy", role: explorer, angle: owns side B,
           model: <id-by-difficulty>, token_budget: 800, initial_prompt: "full briefing..."}
    - group_id: synthesizer
      role: synthesize
      n: 1
      agents:
        - {role: writer, model: <id-by-difficulty>, token_budget: 4000, initial_prompt: "..."}
  connections:
    - {from: explorers, to: synthesizer, type: sequential}
# at close: append {close_of, exit_reason, agents_spawned, feedback_prompts?}
```

## Strategist duties at the gate and after

- **Anti-bias check (Principle 5).** Any n ≥ 2 group must be **pairwise tensioned**: for every pair, a competent observer could predict in advance a question on which they disagree. Non-overlapping is not enough. The check happens at the confirm gate — your proposal names each pair's predicted-disagreement question; a sheet whose pairs have no predictable disagreement goes back for revision.
- **Trust-but-verify (Principle 8).** If a subagent wrote files or claimed a check passed, inspect the actual diff / run the actual check before treating it as done.

## References

- **Governing doc:** `subagents-strategy-constitution-proposal.md` (repo root, v0.5.2-proposal) — §5 parameter reference, §6 full skeleton.
- **Agent pool:** `telemetry/agents/agent-pool.yaml` (245 names, ordered `role_fit`).
- **Ledger:** `telemetry/agents/subagents-dispatch.yaml` (append-only; two rows per dispatch).
- **Appender + hooks:** `internal_tools/subagents-dispatch-hooks/` (`skills/register-dispatch/append-dispatch.cjs`, append-only enforcement hook).
- **Robot-talks binding:** `vault/constitution/robot-talks-constitution.md` (bound per group when `robot_talks: true`; single-gate override applies).
- **Anti-bias source:** `vault/discovery/anti-bias-vector-composition/` — principle.md, validator-check.md, examples.md.
