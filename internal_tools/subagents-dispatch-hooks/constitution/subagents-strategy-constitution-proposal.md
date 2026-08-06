---
tags: [agents, dispatch, subagents, orchestration, constitution]
node_type: constitution
is_session: false
layer: architecture
nature: procedural, technical
status: draft
version: 0.8.1-proposal
last_updated: 2026-08-02
replaces: vault/constitution/domainspec-subagents-strategy-constitution.md@v0.3.0 (and the v0.4.0 draft; v0.5.1 amended in place after the 2026-06-12 adversarial assessment)
derives_from: vault/premise/domainspec-subagents-strategy-premises.md@v0.4.0
---

# Subagents-Strategy Constitution — lean rewrite (PROPOSAL)

## 1. Goal — why this constitution exists

Dispatching subagents without discipline fails in four recurring ways:

1. **False consensus** — N agents that are really N clones of one viewpoint, read back as independent confirmation.
2. **Claim inflation** — results whose narrative outruns what any agent actually verified.
3. **Opacity** — spawn trees and costs nobody can reconstruct after the fact.
4. **Unbounded iteration** — "run it again until it converges", with no brake.

This constitution exists to make every dispatch **designed** (tensioned angles, explicit
structure), **gated** (a human confirms before anything runs), **recorded** (one row in one
canonical registry), and **closed** (a typed exit, a spawn report).

It matters because dispatch is the system's multiplication step — the only way work scales
past one context window. Bias or opacity introduced here propagates into everything built
on top. And because **the strategist agent** (the orchestrating agent that composes the
dispatch sheet and proposes it to the human) **fills almost every field itself**, this document
is first of all the _agent's manual_: each parameter must be defined precisely enough that
two strategists, given the same goal, would fill the sheet's **structure** the same way.
(The judgment dials — `model`, `token_budget`, each `angle` — are not deterministic; they
are validated by the human at the confirm gate.)

## 2. Context

- **Operating model:** the human supplies the **`goal`**, and may pin any of the dials —
  which groups to have, the number of zig-zag loops, the number of layers, the approver.
  The strategist agent fills everything the human left open, proposes the filled sheet
  in chat, and dispatches only after the human confirms.
- **One canonical registry:** `telemetry/agents/subagents-dispatch.yaml` — always this path.
  Each dispatch contributes exactly **two appends**: the **dispatch row** (the spec, written
  at dispatch) and the **close row** (`close_of` + outcome, written at termination). There is
  no separate spec file and no separate event log.
- **Claim ≤ proof:** three of the six `dispatch_type` values (`code | plan | suggestion`)
  are reserved names — defined in §5 but not yet active; `research`, `review`, and `experiment`
  are LIVE (`review` 2026-06-12, `experiment` 2026-06-14, by owner decision — see §5 `dispatch_type`).
- **Companion documents:** a group running robot-talks binds `vault/constitution/robot-talks-constitution.md`;
  the pool of allowed `agent_name`s lives at `telemetry/agents/agent-pool.yaml` (245 names, each
  tagged with an ordered `role_fit` list drawn from explorer / synthesizer / skeptic / writer / auditor).
- This proposal replaces both the live v0.3.0 and the v0.4.0 draft.
- **Adoption / grandfathering:** rows and specs written under the old schemas remain valid
  historical artifacts and are never re-validated against this schema; dispatches from the
  adoption date on use this schema and stamp it via `schema_version`.

## 3. High-level idea

A dispatch is a set of **groups** ordered by their connections. **Groups are scheduled by
dependency: a group is READY when every group with a `sequential` or `zig-zag` edge into it
has produced what it must respond to; all READY groups launch concurrently.** A zig-zag
edge counts as a dependency in its `from`→`to` direction only — the `from` endpoint opens
the exchange (A→B with A = `from`); the back-turns are intra-exchange, never readiness
edges. `feedback`
edges are back-edges and never count as dependencies (counting them would make every loop a
deadlock). Groups with no incoming edges start together at dispatch; a sheet that declares
no connections thereby declares its groups independent — if order matters, say so with an
edge. Declared order is the deterministic tiebreak for narration and registration, not an
execution constraint. **The agents inside a group always run in parallel** — each agent
gets its own start, with its own briefing and its own context. Parallel means concurrent
and independent, never shared. Anything that depends on a sibling's output belongs in a
downstream group, joined by an edge.

**Connections** say how groups relate beyond plain order: a group can simply send its
output forward (`sequential`), two groups can exchange messages in bounded alternation
(`zig-zag`), or a group can reach back for more material (`feedback`).

**Robot-talks is intra-group:** a group with `robot_talks: true` (only meaningful at
`n ≥ 2`) has its agents come back after their parallel runs and **discuss** — each
confronts the others' outputs along the declared tension — before the group returns.

Here _explorers_, _synthesizer_, _reviewers_, _writer_, and _auditor_ are example
`group_id` labels — not reserved keywords. A group has no role field of its own (removed
v0.6.0 — see §11): what kind of work a group does is carried by its agents' `role`s
(`explorer` / `synthesizer` / `skeptic` / `writer` / `auditor`), and where it sits in the
workflow is carried by its `connections`.

The canonical shape (sequential spine): **explorers → synthesizer → reviewers → writer →
auditor.** Each is a distinct pipeline stage. Between explorers and reviewers there is
**always a synthesizer** — it plays midfield: it **reconciles** the explorers' returns into
a candidate picture and exchanges with the reviewers via **zig-zag**. The back-edge to the
explorers (**feedback**) is **conditional**: it is instantiated only when there is a
reviewer group _and_ material may be missing — not auto-instantiated in every dispatch
(shown dashed below). The **writer** is a separate downstream stage (no longer the
synthesizer): it **persists `findings.md` only**, via `domainspec-findings-writing` (n:1).
`research.md` is **not** a writer task — it is the verbatim transcript of the **explorer**
returns, appended **mechanically by the strategist** via `domainspec-research-writing`. The
**auditor** evaluates `findings.md` only and may **revise** it back to the writer (default
one revision).

```
explorers ──sequential──▶ synthesizer ◀──zig-zag──▶ reviewers
     ▲                        │                          │
     └┄┄┄┄┄┄┄feedback┄┄┄┄┄┄┄┄┄┘   (conditional)          │ sequential
                                                         ▼  (after zig-zag converges)
                                              writer ──sequential──▶ auditor
                                                 ▲                       │
                                                 └┄┄┄┄┄revision┄┄┄┄┄┄┄┄┄┄┘   (default 1)
```

How a group's parallel outputs combine is **derived, not declared**: a group with
`robot_talks: true` synthesizes; a group without robot-talks just concatenates. Zig-zag
does not enter this rule — it is message exchange between two groups, not a way of
combining outputs.

Lifecycle: **(1)** strategist fills the sheet and proposes it in chat → **(2)** human
confirms its material strategy (nothing persists before this; any later sheet-byte
edit re-enters machine readiness and tension gates, while material change also re-enters
the human gate) → **(3)** dispatch row appended to the registry,
groups dispatched in order, outputs land in `working_folder` → **(4)** close: the strategist
**reports** `exit_reason` + `agents_spawned` in chat and in the findings doc, AND appends
the **close row** (`close_of`) to the registry. Neither row is ever edited in place — the
ledger is strictly append-only.

A **meta** dispatch is a dispatch _about_ dispatching — planning what to research, or
redesigning the framework itself — and is the only context in which dispatch lineage
(`parent_dispatch_id`) exists.

## 4. Principles

1. **Trigger.** Dispatch only when at least one holds: _synthesis_ (3+ sources to combine), _context protection_ (raw output ≫ what the parent needs), _isolation_ (discardable exploration), _parallelism_ (independent tasks). Otherwise work inline.
2. **Human gate.** The strategist proposes the filled sheet in chat only after
   composite confirmation readiness and both independent tension verdicts
   pass. Form/version, live type, agent-pool membership, identity uniqueness,
   final-approver shape, complete digest-owned pair evidence, and local path
   constraints are deterministic pre-confirmation obligations. The human
   confirms, revises, or abandons. Approval to revise the draft is not dispatch
   confirmation. Nothing dispatches — and no row is written — before explicit
   confirmation. Silence or a question is not confirmation. A normal ready
   proposal asks once. Human confirmation binds the reviewed material strategy,
   not raw serialization bytes. Any later byte edit re-enters readiness and both
   tension checks. The prior confirmation carries only when a deterministic
   projection comparison proves the material strategy unchanged; material or
   unclassifiable change re-enters the human gate.
3. **Two appends, one place.** The strategist appends the **dispatch row** to `telemetry/agents/subagents-dispatch.yaml` at dispatch, and the **close row** (`close_of` carrying `exit_reason` + `agents_spawned`) at termination. Rows are **never edited in place** — the ledger is append-only, and the appender is the single, serializing write path. The outcome is additionally reported in chat (1–2 sentences) and in the findings document. No other persistence surface exists for dispatch metadata.
4. **Execution shape.** Agents within a group run in parallel — each with its own start, briefing, and context. Groups are scheduled **by dependency**: a group is READY when every group with a `sequential` or `zig-zag` edge into it has produced what it must respond to (a zig-zag edge counts only in its `from`→`to` direction — the `from` endpoint opens the exchange); all READY groups launch concurrently; `feedback` edges never count as dependencies; a sheet with no connections declares its groups independent. Dependent work goes in a downstream group, joined by an edge. An agent error inside a group degrades to a **partial group result** that downstream groups and the `final_approver` must be told about; `exit_reason: error` is reserved for failures that leave the dispatch unable to produce its deliverable.
5. **Anti-bias tension.** Any group with N ≥ 2 agents must be **pairwise tensioned**: for every pair, a competent observer could predict in advance a question on which they disagree. The group names the axis (`anti_bias`); each agent takes a position (`angle`). Non-overlapping is not enough. The check happens at the confirm gate: a sheet whose pairs have no predictable disagreement goes back for revision. The proposal must state, for each tensioned pair, the question on which the two are predicted to disagree.
   **Decision rule (mechanical PASS/REJECT, applied at the confirm gate by the `check-tension` skill, which owns the runnable rubric; the four tests below are the canonical law it applies, and the rationale for each lives in `vault/discovery/anti-bias-vector-composition/`):**
   1. **Axis test** — the **group-level `anti_bias`** names one of the four canonical axes (**methodology | source-corpus | attack-vector | temporal-prior**) or an explicitly declared composite of them. Anything outside this vocabulary → REJECT. The closure governs per-group `anti_bias` only — `anti_bias_global` is a free-text tension theme (§5) that the per-group axes specialize; it is never vocabulary-checked.
   2. **Clone test** — any two `angle`s in the group share the same core noun phrase → REJECT.
   3. **Spread test** — in a group of `explorer`s (investigation work): all agents share one methodology, or all share one source corpus → REJECT (a pass requires at least two distinct axes represented across the group's angles). In a group of `skeptic`s (evaluation work): any two skeptics share the same attack gate → REJECT.
   4. **Evidence test** — the sheet carries, for every unordered pair, one
      digest-owned `predicted_disagreements` record with canonical agent
      indexes and the written predicted-disagreement sentence ("a_i runs [X],
      a_j runs [Y] on the [axis] axis; a bias in a_i would be exposed by
      a_j"). Companion prose cannot satisfy this test.
      A sheet that passes all four tests PASSES — no residual judgment call.
      **Enforcement split:** the appender enforces the presence conditionals,
      complete pair coverage, canonical pair shape, pool membership, identity
      uniqueness, and approver admission. `check-tension` judges axis, clone,
      spread, and semantic evidence quality using only the exact sheet bytes and
      rubric.
6. **Synthesizer midfield; writer/auditor downstream.** The canonical research pipeline is the sequential spine **explorers → synthesizer → reviewers → writer → auditor**, five distinct stages. Between explorers and reviewers there is always a **synthesizer** — it _reconciles_ the explorer returns into a candidate picture; it does **not** persist the deliverable files. Synthesizer ↔ reviewers iterate via **zig-zag**; synthesizer → explorers via **feedback**, which is **conditional** — it is instantiated only when there is a reviewer group _and_ material may be missing, not auto-instantiated in every dispatch. Reviewers never review raw explorer output directly. The **writer** is stage 4 (n:1): once the synthesizer ↔ reviewers exchange converges, the writer _persists_ **`findings.md` only** via `domainspec-findings-writing` — it is **no longer the synthesizer**, and it does **not** author `research.md` (the strategist appends that — see Principle 9). The **auditor** (stage 5) evaluates `findings.md` ONLY and owns the **revision** edge back to the writer (default one revision; more permitted). Conditional edges over the spine: `robot_talks` on explorers and/or reviewers; `zig-zag` synthesizer ⇄ reviewers; `feedback` synthesizer → explorers; `revision` auditor → writer (default 1).
7. **Aggregation is derived.** A group with `robot_talks: true` → `synthesize`; otherwise → `concat` (an `n = 1` group simply returns its single output). Aggregation is never a field. Zig-zag is inter-group exchange — it does not change either group's combination rule. _(Non-binding note: a bare `concat` is intermediate plumbing, never the dispatch's final deliverable — concatenated parallel outputs feed a downstream `synthesize` group or the `final_approver`, they are not handed back as the answer.)_
8. **Trust-but-verify.** If a subagent wrote files or claimed a check passed, the parent inspects the actual diff / runs the actual check before treating it as done.
9. **Outputs.** For a `dispatch_type: research` dispatch, everything the dispatch produces lands in `working_folder`. `findings.md` is **authored by the writer stage** (stage 4) via `domainspec-findings-writing`; `research.md` (the verbatim explorer transcript) is **appended mechanically by the strategist** via `domainspec-research-writing` — neither the synthesizer nor the writer authors `research.md`. The two-file rule applies only to a **research fan-out (n ≥ 2)**: the collected returns (research) and the cited synthesis (findings) — every load-bearing claim in the findings cites the collected return it rests on, and the `final_approver` checks this when recommending acceptance. A **research n = 1** dispatch produces a single file, `findings.md`.
10. **Claim ≤ proof** in every artifact produced.
11. **Helper invocations are not dispatches.** A single agent spawned _by_ a running agent, within its parent's scope, needs no row and no gate — it is reported post-hoc in the parent's `agents_spawned` report (chat + findings, not written to the ledger row). It escalates to a real dispatch if it fans out (2+) or outgrows the scope. Spawn count is unregulated; reporting is the brake. _(The exact helper-vs-dispatch boundary is provisional — an open question, not settled law.)_
12. **Final approval.** Every dispatch names a `final_approver` holding the
    last approve/reject with a does-this-fit-the-whole mandate. There is exactly
    **one human gate** — the entry confirm of Principle 2. `final_approver` is
    `parent` (default) or a pooled **dedicated approver agent**: the identity
    appears exactly once as the sole agent of a singleton group, has role
    `auditor`, and performs only the approval stage. Explorer, synthesizer,
    skeptic, and writer roles cannot approve; arbitrary external names cannot
    approve. The auditor evaluates **`findings.md` only** and owns the **revision**
    edge back to the writer. The approver receives the full `working_folder`. If
    the approver's group never runs, approval falls back to `parent`. When the
    approver is an agent, it recommends accept/reject; a reject may trigger a
    re-run within `max_loops`. There is no second human gate at close.
13. **Meta and lineage.** A planning/framework dispatch is marked `meta`. `parent_dispatch_id` exists **only** on a dispatch spawned by a meta dispatch, pointing back to it. No other lineage fields exist. A meta dispatch may itself be planned by another meta dispatch (`meta: true` with non-null `parent_dispatch_id`); the chain stays finite and acyclic. A meta-planned child is a new sheet and re-enters the confirm gate — Principle 2 has no meta exception.
14. **Robot-talks binding.** Any group with `robot_talks: true` additionally binds `vault/constitution/robot-talks-constitution.md` as versioned at dispatch time; that constitution wins conflicts **inside the discussion** — but where it would prescribe an additional human gate, this constitution's single-gate rule (Principle 12) governs. When a synthesizer sits downstream of **any robot-talks group whose agents' positions feed it**, it MUST receive each of that group's agents' **initial** and **final** position (both present in `working_folder`), so premature-convergence / collapse is detectable. _(Scope generalized 2026-06-12 to cover the review type's attacker→synthesizer hop.)_

## 5. Parameter reference

Status: **R** required · **O** optional · **C** conditional.
Fills: **H** human · **A** strategist agent. The human's minimum input is `goal`; the
human may also pin any numeric dial (`max_loops`, a connection's `loop_cap`, a group's
`layers`) — whatever the human pins, the strategist keeps.

### Level 1 — DISPATCH

#### `dispatch_id` — R · A

**What:** unique id, `YYYY-MM-DD-<slug>`.
**Why:** the key joining the row, the artifacts, and any meta lineage.
**How:** date + slug naming the question, e.g. `2026-06-12-residue-precedent-sweep`. The
strategist checks the ledger before assigning; if the slug repeats within a date, suffix
`-2`, `-3`, … — the id must be unique in the registry.

#### `schema_version` — R · A

**What:** the **row-schema** version this row conforms to — currently `"0.8.0"`.
Schema 0.8.0 adds digest-owned `predicted_disagreements` plus deterministic
agent-pool, identity-uniqueness, and final-approver admission. Earlier rows
remain historical.
**Why:** grandfathering (§2) and future migrations are mechanizable only if every row names
its schema; pre-v0.5.2 rows are recognizable by this field's absence.
**How:** the literal row-schema version in force at dispatch time (`"0.8.0"`). Note this is
the **wire** schema_version, which tracks row-schema changes only — distinct from the
document `version` (§10.1), which also bumps on prose/principle changes.

#### `invoked_by` — O · A (tooling-provenance extension)

**What:** the invoking user's git/GitHub email — provenance for who triggered the dispatch.
**Why:** ties a row to the human behind the strategist session for later attribution; a
tooling-level convenience, not a dispatch-design field.
**How:** resolved by the appender from `git config user.email` when omitted; may be set
explicitly. Recognized as a tooling-provenance extension — it carries no constitutional
semantics and gates nothing.

#### `dispatch_type` — R · A

**What:** which typed strategy (role-set + evaluation criterion) the dispatch enacts.
**Why:** fixes the agent-role vocabulary in one move.
**Values:** `research | code | review | plan | suggestion | experiment`. `research`, `review`, and `experiment` are LIVE; the other three (`code`, `plan`, `suggestion`) are reserved names and **must not be dispatched until populated**.
_(`review` populated 2026-06-12 by owner decision: the red-team strategy — attack existing artifacts to surface flaws for improvement; type skill `.claude/skills/review/SKILL.md`; reuses the four research agent roles with red-team semantics. Recorded in-place under the now-retired no-bump practice (§10); a LIVE-status change today requires a document-`version` bump regardless of the row schema (§10.1) — folded into the v0.6.0 versioned amendment (§11). §7 debt re-confrontation per the promotion rule: all three debts re-confronted and AFFIRMED open unchanged — review adds no spawn/cost machinery, no lifecycle change, and the registry remains the sole persistence surface.)_
_(`experiment` populated 2026-06-14 by owner decision, **narrow recipe** — **[scope superseded 2026-06-15: this dispatch is propose-only; the runner/adjudicator roles and the SURVIVED/FALSIFIED adjudication described below moved to a separate downstream run — see the scope clarification note immediately after this paragraph]**: the falsification strategy — run a probe against a success/failure criterion **pre-registered** (frozen before the result exists), and adjudicate survived-vs-falsified. Type skill `.claude/skills/experiment/SKILL.md`; discovery `internal_tools/subagents-dispatch-hooks/docs/discovery/experiment-promotion/discovery.md`. **Role-set** maps onto the existing **agent-role** enum (`explorer | skeptic | writer | auditor`; no new values): designer (`writer`, authors the pre-registered criterion as a `working_folder` artifact) · runner (`explorer`, runs the probe = reasoning/investigation, **not** code execution) · adjudicator (`auditor`, verdict against the criterion) · skeptic (`skeptic`, attacks internal validity). **Grader:** falsification against the pre-registered criterion + internal validity + reproducibility (deterministic re-adjudication) — distinct from `research` (coverage / claim ≤ proof). **Verdict:** SURVIVED / FALSIFIED / INVALID. **Open questions resolved at promotion:** peer type, not a sub-mode of `research` (the grader differs — criterion fixed *before* the result, vs coverage judged *after*); the `runner`↔`code` collision deferred by the narrow recipe — the code-execution runner stays RESERVED, gated on `code` landing. Recorded without a row-schema change: no new column; the criterion is a `working_folder` artifact, never `success_metric`. §7 debt re-confrontation per the promotion rule: see §7 (P-SS-8 / P-SS-9 unchanged; the NEW persistence debt narrowed — the criterion is governance-grade but off-registry).)_

_(**Scope clarification — 2026-06-15, owner decision.** `experiment` is scoped to the **pre-registration (propose) phase**: the **designer** (`writer`) and **skeptic** (`skeptic`) produce a **frozen, validity-checked `criterion.md`** — the experiment proposal. **Running the probe and adjudicating survived-vs-falsified is a separate downstream step**, not this dispatch; the **runner** (`explorer`) and **adjudicator** (`auditor`) belong to that later run. Verdict timing follows: **INVALID** may be rendered at propose (the skeptic kills an unfalsifiable design before freeze); **SURVIVED / FALSIFIED** are rendered only at the run. A propose dispatch therefore closes `resolved` on an accepted frozen `criterion.md`, never on SURVIVED/FALSIFIED. Type skill `.claude/skills/experiment/SKILL.md` is the authority on the propose/run split.)_

#### `goal` — R · **H**

**What:** the human's general objective, one or two sentences. The strategist decomposes it
across groups and agents — the goal itself is never per-agent.
**Why:** it is what makes the row legible later and what the `final_approver` judges against.
**How:** state the outcome wanted, not the method.

#### `context` — R · H/A

**What:** 2–4 sentences of framing.
**Why:** subagents never see the parent conversation; context is the **only** channel that
enables judgment calls — which is exactly why it cannot be optional.

#### `max_loops` — R · H/A

**What:** how many times the whole group-sequence may be re-run.
**Why:** the mechanical brake against "again until it converges". The harness refuses run N+1.
A re-run fires **only** when the `final_approver` rejects the result requesting another
round; nothing else triggers it.
**Values:** int, default `1`, max `5`.

#### `final_approver` — R · H/A

**What:** who holds the last approve/reject gate.
**Values:** `parent` (default — the strategist session, human behind it) or the
`agent_name` of a **dedicated approver agent** — the sole agent of a **dedicated approver
group** (its agent's `role` is `auditor`) that does no other work in the dispatch. An
approver may never appear in any working group (no self-approval — Principle 12). No other
designation mechanism exists.

#### `meta` — O · A

**What:** marks a dispatch whose object is dispatching itself — planning what to research,
or redesigning the framework. (Historical precedent: `2026-05-16-subagent-strategy-parametrization-wave5`,
the dispatch that redrafted this very constitution — recorded under the old v0.2.0 spec
schema; cite it for the concept, not the format.)
**Why:** separates dispatches that produce _plans_ from dispatches that _execute_ them; it is
the precondition for lineage.
**Values:** `true`; omitted otherwise.

#### `parent_dispatch_id` — C · A

**What:** id of the meta dispatch that planned this one.
**How:** present **only** on a dispatch that was planned by a meta dispatch; value = the
`dispatch_id` of that planning meta dispatch; written by the strategist at registration time
(the meta dispatch's id already exists). **Omitted / null** on every top-level dispatch (one
not planned by a meta dispatch). A top-level meta dispatch therefore has
`parent_dispatch_id = null` — this is the recursion base case; the chain is finite and acyclic,
and a dispatch cannot be its own ancestor.
**Why:** links plan to execution. It is not a budget and not generic lineage — absent on every
dispatch that wasn't planned by a meta dispatch.

#### `anti_bias_global` — C · A (required when ≥ 2 groups have `n ≥ 2`; optional otherwise)

**What:** the dispatch-wide tension theme that per-group `anti_bias` axes specialize.
**Free-text** — not subject to the Principle 5 axis-vocabulary closure (that closure governs
per-group `anti_bias` only).
**Why:** keeps the tension design coherent across groups instead of N unrelated axes — required
once two or more groups each fan out, where uncoordinated axes would drift.
**Enforcement:** the conditional is appender-enforced (exit 2) since the 2026-06-12 in-place
amendment (§9) — a record with ≥ 2 fan-out groups and no `anti_bias_global` is rejected.

#### `working_folder` — C · A (required when `dispatch_type` is `research`, `review`, or `experiment`)

**What:** where the dispatch's outputs land — research + findings documents, a spec file,
or the code itself, depending on what the dispatch produces. For `research`, this is always a
docs path. For a research **n ≥ 2** dispatch the two files of Principle 9 are
`<working_folder>/research.md` (collected returns) and `<working_folder>/findings.md` (cited
synthesis); a research **n = 1** dispatch produces a single `<working_folder>/findings.md`.
**Why:** outputs need one declared home; the registry row only points at it.
**How:** repo-relative path. Never `vault/**`.

### Level 2 — GROUP (`groups[]`)

Groups are scheduled **by dependency** (Principle 4): every group whose edge-predecessors
are done launches, concurrently with other ready groups; the agents inside each run
**in parallel**.

#### `group_id` — R · A

**What:** stable id, the target of `connections[]` references. E.g. `explorers`, `synthesizer`, `reviewers`.
**Note:** a group has **no `role` field** (removed v0.6.0 — see §11). A group's function is
read off its agents' `role`s and its place in the canonical shape (Principle 6) off its
`connections`. The close-row tally (`agents_spawned`) keys directly by **agent** role.

#### `n` — O · A (default 1)

**What:** agent count in the group. (There is no cardinality field — `n` already answers it.)
**Why:** the trigger for the conditional fields: `anti_bias`,
`predicted_disagreements`, and per-agent `angle` become required at `n ≥ 2`.

#### `robot_talks` — O · H/A

**What:** boolean, default `false`; only meaningful when `n ≥ 2`. When `true`, the group's
agents, after producing their parallel outputs, come back and **discuss** — each confronts
the others' outputs along the group's declared tension (`anti_bias` / `angle`s) — before
the group returns one result.
**Why:** turns N parallel monologues into one argued result, for questions that need
confrontation rather than collection. It is what flips the group's derived aggregation to
`synthesize` (Principle 7) and what binds `vault/constitution/robot-talks-constitution.md` (Principle 14).
**Values:** `true | false`.

#### `layers` — O · H/A

**What:** a plain integer: how many sequential invocations of this group to run.
**Why:** lets one band run as N ordered passes (e.g. two successive reviewer rounds) without
polluting the top-level structure with near-duplicate groups.
**Layers vs loop — the positive rule:** N passes **with conversation between them** (each pass
reads the previous pass's output and responds) ⇒ model as `loop_cap` on a zig-zag/feedback edge.
N **independent** passes (same input, aggregated after) ⇒ model as `layers`. **Corollary:**
`layers > 1` is forbidden ONLY when a zig-zag/feedback edge runs _between_ the layers (that's
conversation, hence a loop); independent multi-pass `layers` stays valid. An edge incident to
a layered group counts as running _between_ its layers (it would re-fire per pass) — so a
group with `layers > 1` may not sit on a zig-zag/feedback endpoint.
**Values:** int ≥ 1, default `1`.

#### `anti_bias` — C · A (required iff `n ≥ 2`)

**What:** the group's named tension axis. It **specializes `anti_bias_global` when that is
present**; when `anti_bias_global` is absent, the group's `anti_bias` is stand-alone
(self-sufficient, references no global).
**Why:** Principle 5 made mechanical — forces the strategist to _design_ the disagreement
instead of spawning N clones.
**How:** name the axis and ideally the tensioned pairs. The axis vocabulary is closed
(Principle 5 decision rule, axis test): **methodology | source-corpus | attack-vector |
temporal-prior**, or an explicitly declared composite of them.

#### `predicted_disagreements` — C · A (required iff `n ≥ 2`)

**What:** one digest-owned record for every unordered pair of agent indexes:
`{pair: [lower_index, higher_index], statement: <predicted disagreement>}`.
**Why:** Test 4 evidence must be part of the exact confirmed bytes. Companion
strategy prose is not admitted evidence.
**How:** for `n = 2`, include `[0, 1]`; for `n = 3`, include `[0, 1]`, `[0, 2]`,
and `[1, 2]`. Pairs are unique, in range, non-self, and ascending; statements
are non-empty. Omit the field for singleton groups.

### Level 3 — CONNECTION (`connections[]`)

Plain JSON objects: `{from, to, type, loop_cap?}`. Nothing else. (`loop_cap` only on
`zig-zag`/`feedback`; absent on `sequential` — see below.)

#### `from` / `to` — R · A

**What:** endpoints, referencing declared `group_id`s.

#### `type` — R · A

**Values:**

- `sequential` — `from` sends its output forward; `to` starts after it completes. Pure
  information handoff.
- `zig-zag` — bounded **message exchange** between two groups, alternating turns
  (A→B→A→…). The canonical use: synthesizer ↔ reviewers. Exchange only — it does not
  change how either group aggregates its outputs. **Opening turn:** the `from` endpoint
  opens the exchange; for readiness scheduling (P4) the edge counts as a dependency only
  in its `from`→`to` direction — the back-turns are intra-exchange, never readiness edges.
  **Ordering:** a group's robot-talks
  discussion resolves completely before the group enters any zig-zag turn.
  **Convergence:** every reviewer-side turn carries the standing goal of hunting
  inconsistencies; a turn in which **no participating reviewer raises an inconsistency**
  terminates the exchange as converged — the `loop_cap` is a ceiling for non-convergence,
  not a quota to be burned.
- `feedback` — a back-edge: a later group reaches back to an earlier one for more material
  or rework. Canonical uses: synthesizer → explorers (pull more material) and auditor →
  writer (the **revision** edge — return `findings.md` for revision, default `loop_cap: 1`).
  **Semantics:** the same agents are re-invoked;
  the requesting group's ask **is** the feedback prompt, and the parent session records it
  verbatim in the close row (Principle 3). **Firing rule (under dependency scheduling, P4):**
  a feedback edge fires as a re-invocation **event** — it fires when (and only when) the
  requesting group emits its ask; it never counts as a dependency and never blocks any
  group's launch (§3).

**Canonical edge set (default for `dispatch_type: research`):** the sequential spine
explorers → synthesizer (`sequential`), synthesizer ↔ reviewers (`zig-zag`), reviewers →
writer (`sequential`, after the zig-zag converges), and writer → auditor (`sequential`) are
instantiated when the strategist declares the canonical groups. Two back-edges are
**conditional**: synthesizer → explorers (`feedback`) is instantiated only when there is a
reviewer group _and_ material may be missing; auditor → writer (`feedback` — the **revision**
edge, default `loop_cap: 1`) is instantiated when the auditor may return `findings.md` for
revision. `robot_talks` may sit on explorers and/or reviewers. Not auto-instantiated in
every dispatch. The strategist may override any of these on the sheet.

#### `loop_cap` — C · H/A (only on `type ∈ {zig-zag, feedback}`; must be absent on `sequential`)

**What:** local bound on the iterations of a `zig-zag` or `feedback` edge.
May be omitted — default `2`. The human may pin it; otherwise the strategist sets it.
**Why:** every exchange needs its own ceiling; the whole-graph bound is `max_loops` (Level 1).

#### Choosing the dial (max_loops vs loop_cap vs layers)

Three dials, three scopes — given "the reviewers should get two passes":

| Dial                      | Scope                               | Use it when                                                         |
| ------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `layers: 2` (group)       | the same group re-invoked           | two reviewer passes over the same material, no new conversation     |
| `loop_cap: 2` (edge)      | the conversation between two groups | two rounds of synthesizer ↔ reviewers exchange                      |
| `max_loops: 2` (dispatch) | the whole dispatch                  | the final_approver rejected and asked for the entire sequence again |

One scenario, one dial. If two dials seem to fit, the smallest scope wins.

### Level 4 — AGENT (`groups[].agents[]`)

#### `agent_name` — O · A (default `null`)

**What:** the agent's name, drawn from the allowed-names pool at `telemetry/agents/agent-pool.yaml`
when set, e.g. `"Russell, Bertrand"`.
**Why:** stable, human-readable identity across the row, the artifacts, and the chat narration.
**How:** **recommended for fan-outs** (where named identities make the narration legible),
**optional for ad-hoc dispatch** — recorded practice runs with `agent_name: null`. Never required.
Every non-null identity must resolve in the pool and appear only once in a
dispatch; these are deterministic pre-confirmation checks.

#### `role` — R · A

**What:** the agent's kind of worker. Vocabulary fixed by `dispatch_type`.
**Values (research):** `explorer | synthesizer | skeptic | writer | auditor` — five distinct
pipeline stages (canonical spine **explorers → synthesizer → reviewers → writer → auditor**):

- `explorer` — generates under one tensioned angle (group `n` 2–4).
- `synthesizer` — reconciles the explorer returns into a candidate picture; exchanges with the reviewers (zig-zag) and may pull more from explorers (feedback). n:1. Does **not** persist files.
- `skeptic` — the reviewers; each attacks one named gate.
- `writer` — persists **`findings.md` only**, via `domainspec-findings-writing` (n:1). **No longer the synthesizer, and no longer the author of `research.md`.**
- `auditor` — evaluates `findings.md` only; the dedicated `final_approver`; may return `findings.md` to the writer for revision (default one).

`research.md` is appended by the **strategist** (the parent that owns the dispatch), not by
any agent role: it is the verbatim **explorer** transcript, assembled per
`domainspec-research-writing` — the same hand that appends the ledger rows.

#### `angle` — C · A (required iff group `n ≥ 2`)

**What:** this agent's position on the group's `anti_bias` axis, one sentence.
**Why:** the agent-side half of Principle 5 — the axis names _where_ siblings disagree,
the angles place each sibling on it.

#### `initial_prompt` — R · A

**What:** the agent's starting prompt — the briefing it receives at launch: its task, the
context it needs, what is already ruled out, and the return expected. Each agent has its
own start (Principle 4); this is that start, written out.
**Why:** briefing quality determines output quality, and recording the prompt in the row
is what makes the dispatch auditable and reproducible — without it, the row says who ran
but not what they were actually asked.
**How:** composed by the strategist from `goal` + `context` + the agent's `angle`. The
structured fields summarize it; the prompt is the full text the agent sees. The agent
chooses what to read — inside the repo or outside it; the prompt states the task, not a
reading list.

#### `model` — R · A

**What:** the concrete model this agent runs on — provider-qualified (Anthropic, OpenAI, …).
**Why:** model choice is the cost/quality dial, and it tracks **task difficulty**: hard
tasks (adversarial review, subtle synthesis) get heavier models; mechanical sweeps get
lighter ones. The human validates these choices at the confirm gate.
**How:** name the model id; pick by difficulty, not by habit.
_(Non-binding note: in a group with `n ≥ 2`, putting every tensioned agent on the **same model**
can weaken the anti-bias design of Principle 5 — shared training priors blunt the predicted
disagreement. Not prohibited; flagged as a quality consideration for the strategist at the confirm gate.)_

#### `token_budget` — R · A

**What:** per-agent output-length cap.
**Why:** every agent declares a `token_budget` — there is **NO unlimited default**. The
strategist sets it per agent by difficulty (the same discipline as `model`) and states it in
the agent's `initial_prompt`. It is a **declared target, not a harness-enforced cap** — no
runtime component enforces it today; enforcement is an OPEN QUESTION alongside the
recursion-cost debt below.
**Caveat:** a per-agent budget bounds a _single_ agent's cost, NOT recursion-runaway (many
agents each under budget still sum without limit). Bounding total recursive cost is an
**OPEN QUESTION** — see the premise-debt note in §7.
**Values:** int (required).

### Close of dispatch (chat + findings + the close row)

Both values below are stated in chat and in the findings doc at close, AND carried by the
**close row** the strategist appends to the registry (`close_of: <dispatch_id>` —
Principle 3). The dispatch row itself is never edited; the close row is the outcome's
queryable home.

#### `exit_reason` — close row + reported · A

**Values (closed vocabulary):** `resolved | loop_ceiling_reached | dissent_irreconcilable | user_abort | error`.

- `resolved` — the `final_approver` accepted / no contradiction remains. **Decision procedure:**
  the `final_approver` accepted the result — nothing else counts as resolved.
- `loop_ceiling_reached` — hit the loop ceiling (an edge `loop_cap` OR `max_loops`) without
  converging.
- `dissent_irreconcilable` — agents did not reconcile after the ceiling.
- `user_abort` — the human abandoned at the gate (Principle 2). This value cannot disappear.
- `error` — technical failure.

**Precedence (when more than one applies):** `user_abort` > `error` >
`dissent_irreconcilable` > `loop_ceiling_reached` > `resolved`. A ceiling hit that leaves
unreconciled positions is `dissent_irreconcilable`; a `final_approver` rejection the human
chooses not to re-run is an abandonment → `user_abort`.

**Why:** typed exits make retro-analysis possible; silent exit is a violation. Carried on the
close row, and reported in chat with 1–2 sentences of context and in the findings doc.

#### `agents_spawned` — close row + reported · A

**What:** total count + spawn tree keyed by **agent role** (`explorer | synthesizer | skeptic | writer | auditor`),
with **helper invocations** (Principle 11) in their own bucket, + loop iterations used. E.g.
`{total: 8, tree: {explorer: 3, synthesizer: 1, skeptic: 2, writer: 1, auditor: 1, helpers: 0}, loops_used: 1}`.
(v0.6.0: keyed by **agent** role directly — the former agent-role↔group-role map is gone with
the group `role` field, which removes the CR-2 bucketing ambiguity.)
**Why:** spawn count is unregulated, so reporting is the entire accountability mechanism.

## 6. Skeleton YAML

```yaml
# dispatch row appended to telemetry/agents/subagents-dispatch.yaml at dispatch;
# a close row ({close_of, exit_reason, agents_spawned}) is appended at termination.
# rows are never edited in place (Principle 3).
- dispatch_id: 2026-06-12-example-slug
  schema_version: "0.8.0"
  dispatch_type: research # research LIVE; review LIVE (2026-06-12); experiment LIVE (2026-06-14); code|plan|suggestion RESERVED
  goal: > # HUMAN input — the general objective;
    One or two sentences.             # the strategist decomposes it below.
  context: >
    2-4 sentences of framing the subagents need.
  max_loops: 1 # whole-sequence re-runs (default 1, max 5)
  final_approver:
    "Gödel, Kurt" # parent | pooled sole auditor in a singleton
    # dedicated approval group — Principle 12
  # meta: true                        # only on planning/framework dispatches
  # parent_dispatch_id: 2026-06-11-meta-plan   # only when spawned by a meta dispatch
  anti_bias_global: novelty optimism vs precedent skepticism
  working_folder: docs/features/<feature>/research/<topic>/ # or a spec path, or code

  groups: # scheduled by DEPENDENCY (P4): ready groups launch concurrently;
    # declared order is narration tiebreak, not an execution constraint
    - group_id: explorers
      n:
        3 # the 3 agents run IN PARALLEL, one message
        # (no group `role` field — v0.6.0; function = agents' roles)
      anti_bias: source-corpus (Shannon vs resource-theory vs categorical)
      predicted_disagreements: # complete unordered-pair coverage
        - {
            pair: [0, 1],
            statement: "Agent 0 and agent 1 search different corpora; each exposes the other's source blind spot.",
          }
        - {
            pair: [0, 2],
            statement: "Agent 0 and agent 2 search different corpora; each exposes the other's source blind spot.",
          }
        - {
            pair: [1, 2],
            statement: "Agent 1 and agent 2 search different corpora; each exposes the other's source blind spot.",
          }
      agents:
        - agent_name: "Abramsky, Samson"
          role: explorer
          angle: owns the Shannon/mutual-information side
          model: claude-sonnet-4-6 # picked by difficulty: mechanical sweep, lighter model
          token_budget: 800 # REQUIRED per agent — no unlimited default
          initial_prompt: >
            The full briefing this agent receives at launch: task, context,
            what is already ruled out, expected return. Composed by the
            strategist from goal + context + this agent's angle and target.
        # ... 2 more explorers, each with its own angle/initial_prompt

    - group_id: synthesizer # the mandatory midfield (Principle 6)
      n: 1 # function read from its synthesizer agent's role
      agents:
        - agent_name: "Noether, Emmy"
          role: synthesizer # reconciles explorer returns; does NOT persist files
          model: claude-opus-4-8 # reconciliation work: heavier model
          token_budget: 4000 # REQUIRED per agent — set by difficulty
          initial_prompt: >
            Briefing for the synthesis: what to reconcile from the explorers'
            material into a candidate picture, and how to handle reviewer
            objections over the zig-zag.

    - group_id: reviewers
      n: 2
      robot_talks:
        true # n>=2 only: agents discuss each other's outputs
        # before returning; aggregation becomes synthesize
      layers: 1 # int: sequential invocations of this group
      anti_bias: attack-vector (precedent-kill vs non-vacuity)
      predicted_disagreements:
        - {
            pair: [0, 1],
            statement: "Agent 0 attacks precedent while agent 1 attacks vacuity; each exposes a distinct false-positive mode.",
          }
      agents:
        - agent_name: "Russell, Bertrand"
          role: skeptic
          angle: kill any candidate already owned in the literature
          model: claude-opus-4-8
          token_budget: 3000 # REQUIRED per agent
        - agent_name: "Quine, Willard Van Orman"
          role: skeptic
          angle: kill any candidate that is vacuously true
          model: claude-opus-4-8
          token_budget: 3000 # REQUIRED per agent

    - group_id: writer # stage 4 — persists findings.md (Principle 9)
      n: 1 # function read from its writer agent's role
      agents:
        - agent_name: "Turing, Alan"
          role: writer # persists findings.md via domainspec-findings-writing
          model: claude-opus-4-8 # (research.md is the strategist's append)
          token_budget: 5000 # REQUIRED per agent
          initial_prompt: >
            Persist findings.md (domainspec-findings-writing) from the converged
            synthesizer picture; every load-bearing findings claim cites the explorer
            return it rests on. research.md (the explorer transcript) is appended
            separately by the strategist.

    - group_id: auditor # stage 5 — dedicated final_approver (Principle 12)
      n: 1 # function read from its auditor agent's role
      agents:
        - agent_name: "Gödel, Kurt"
          role: auditor # evaluates findings.md ONLY; owns revision→writer
          model: claude-opus-4-8
          token_budget: 3000 # REQUIRED per agent
          initial_prompt: >
            Evaluate findings.md only; recommend accept/reject and the
            Principle 9 citation check. May return findings.md to the writer
            for revision (default one).

  connections: # {from, to, type, loop_cap?} — nothing else
    # type: sequential | zig-zag | feedback
    - { from: explorers, to: synthesizer, type: sequential }
    - { from: synthesizer, to: reviewers, type: zig-zag, loop_cap: 2 } # human may pin loop_cap
    - { from: synthesizer, to: explorers, type: feedback, loop_cap: 1 }
    - { from: reviewers, to: writer, type: sequential } # after zig-zag converges
    - { from: writer, to: auditor, type: sequential }
    - { from: auditor, to: writer, type: feedback, loop_cap: 1 } # revision (auditor→writer, default 1)


  # at termination a close row is appended: {close_of, exit_reason, agents_spawned};
  # the same values are reported in chat + findings.
  # exit_reason  ∈ resolved | loop_ceiling_reached | dissent_irreconcilable | user_abort | error
  #   precedence: user_abort > error > dissent_irreconcilable > loop_ceiling_reached > resolved
  # agents_spawned = total + spawn tree (keyed by AGENT role: explorer|synthesizer|skeptic|writer|auditor, helpers in their own bucket) + loops_used
```

## 7. Removed relative to v0.3.0 / v0.4.0-draft (for assessment)

| Removed                                                                    | Why it goes                                                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `success_metric`                                                           | Agent filled it with vacuous restatements of `goal`. Halt = `max_loops` + final_approver judgment.                                                                                                                                                                |
| `dispatch_kind`                                                            | One canonical registry path; nothing to route. The _meta_ concept survives as the `meta` boolean.                                                                                                                                                                 |
| Spec files + telemetry JSONL + `spec_hash`/`corpus_hash`                   | The registry row replaces both surfaces.                                                                                                                                                                                                                          |
| `created`                                                                  | The registry appender stamps rows; not a strategist concern.                                                                                                                                                                                                      |
| `constraints` / `stop_conditions`                                          | Rules-of-engagement live in the briefing prompts, not the schema.                                                                                                                                                                                                 |
| `final_approver_criteria`, `gate_authority`                                | The approver field alone carries the mandate.                                                                                                                                                                                                                     |
| `heuristic_row`, `bootstrap_override`, `validator:` block                  | Governance ceremony for machinery that no longer exists; strategist self-checks against §5, the human confirm is the gate.                                                                                                                                        |
| `recursion_budget` / spawn caps                                            | Spawn count unregulated; `agents_spawned` reporting is the accountability.                                                                                                                                                                                        |
| Top-level `mode` / per-wave `interaction`+`submode`                        | Execution shape is fixed (groups sequential, agents parallel); inter-group exchange is `connections` (`zig-zag`/`feedback`); intra-group dialogue is the group's `robot_talks` boolean; submodes (`dialectic`/`tournament`) dropped.                              |
| `cardinality`                                                              | `n` already answers it.                                                                                                                                                                                                                                           |
| `aggregation`                                                              | Derived: robot-talks → synthesize, no robot-talks → concat (zig-zag is exchange, not aggregation). Never a field.                                                                                                                                                 |
| Group-level `model`                                                        | Model is chosen per agent, by difficulty.                                                                                                                                                                                                                         |
| Group-level `role` (`investigate`/`evaluate`/`meta-evaluate`/`synthesize`) | Redundant with the agent-level `role`: a group's function is read off its agents' roles and its workflow position off its `connections`; the close-row tally keys by **agent** role. (Removed v0.6.0 — it was the root cause of the CR-2 contradiction; see §11.) |
| Nested `layers[]` objects                                                  | `layers` is now a plain int: number of sequential invocations of the group.                                                                                                                                                                                       |
| Connection `carries`, `input_priority`, `gate`, edge submodes              | Connections are exactly `{from, to, type, loop_cap?}`.                                                                                                                                                                                                            |
| `agent_id`                                                                 | Replaced by `agent_name` from the allowed-names pool YAML.                                                                                                                                                                                                        |
| `difficulty_justification`                                                 | Folded into `model`'s fill rule (pick by difficulty; human validates at confirm).                                                                                                                                                                                 |
| `tools` / `read_scope` / `target`                                          | All read-scoping cut — the agent chooses what to look at, inside the repo or outside; the `initial_prompt` states the task, not a reading list.                                                                                                                   |
| `expected_output_shape`                                                    | Folded into `initial_prompt` — the briefing itself states the expected return.                                                                                                                                                                                    |
| `grade` (four-component)                                                   | Never filled in practice; `exit_reason` + `agents_spawned` are the close record.                                                                                                                                                                                  |
| Old role-ordering invariant ("synthesize never precedes evaluate")         | Superseded by the canonical shape: explorers → **synthesizer** ↔ reviewers (zig-zag), synthesizer → explorers (feedback).                                                                                                                                         |
| 31-rule body, 7-step lifecycle prose, amendment machinery                  | Compressed into §4's fourteen principles.                                                                                                                                                                                                                         |
| Discovery-promotion lifecycle + its second human gate (old R3 step 7, R6b) | Out of scope for the dispatch constitution — promoting findings into permanent vault knowledge belongs to the vault discovery workflow; if re-added, the gate must be defined there. **Deliberate cut, recorded here.**                                           |

**Premise-debt accounting** (per the v0.4.0 waiver-composition meta-clause: every amendment
must re-list all open premise-outrunning debts and explicitly affirm or discharge each):

- **P-SS-8 (spawn budget)** — **AFFIRMED, carried open.** Spawn _count_ stays unregulated;
  the `recursion_budget` is **not** reintroduced; `agents_spawned` reporting is the
  count-side brake. The **cost** debt this premise carries — sharpened by the real
  incident (~1.67 billion tokens, July 2025) — is **only declaratively addressed** by the
  per-agent **mandatory `token_budget`** (M4): every agent declares a cost target, but no
  runtime component enforces it (v0.5.2 correction — the v0.5.1 "partially discharged"
  claim overstated; a declared target bounds nothing by itself). And even if enforced, that
  bound is per-agent only; **recursion-runaway**
  (the aggregate cost of many in-budget agents fanned out recursively) remains **NOT
  limited** — recorded here as an explicit **OPEN QUESTION**. The human chose this round not
  to reopen the `recursion_budget`. Full discharge requires either an aggregate/recursive
  cost bound or a P-SS-8 text revision.
- **P-SS-9 (linear lifecycle)** — **AFFIRMED, carried open.** Groups + connections describe
  data-flow topology; the lifecycle (propose → confirm → dispatch → close) stays linear.
  v0.5.2 restores the close as a lifecycle write: a `close_of` row is appended at
  termination (the dispatch row itself is still never edited).
  Discharge requires a P-SS-9 revision separating lifecycle-order from topology.
- **NEW debt (opened by v0.5.1, narrowed by v0.5.2)** — **AFFIRMED, carried open.** The
  spec-file, telemetry, and validator rules (numbered R25–R28 in v0.3.0) remain removed;
  P-SS-9's artifact wording now rests on Principle 9's research-only two-file clause. The
  v0.5.1 aggravation — "the outcome is not persisted at all" — is **discharged by the
  v0.5.2 close row** (T1 decision, 2026-06-12 assessment): the registry now persists both
  the spec and the outcome. Residual debt: the registry is still the sole persistence
  surface for _row-schema_ dispatch metadata (narrowed by the `experiment` re-confrontation
  below — CR-4 fix, v0.6.0); discharge requires a premise revision acknowledging the
  two-append registry as that surface.

No waiver is inherited silently; promoting any RESERVED `dispatch_type` to LIVE must
re-confront all three debts.

**`experiment` promotion (2026-06-14) — re-confrontation** (adversarial: proponent × skeptic):

- **P-SS-8 (spawn / cost)** — **AFFIRMED open, unchanged.** The narrow recipe adds no spawn/cost
  machinery; its roles map onto existing enums, the RESERVED code-execution runner pre-commits
  nothing (no substrate exists), and reproducibility-by-re-adjudication is one more in-budget agent
  inside the already-open count/recursion surface — logged as a future input to the
  recursion-runaway OPEN QUESTION, not a change to it.
- **P-SS-9 (linear lifecycle)** — **AFFIRMED open, unchanged.** The criterion-freeze is data-flow
  topology (originally the `designer →sequential→ runner` edge — **superseded 2026-06-15**, see note
  below) plus the existing P2 confirm-gate re-entry on edit, not a new lifecycle phase;
  propose → confirm → dispatch → close stays linear.
  _(Scope update 2026-06-15: with `experiment` scoped to the propose phase — the run separated
  downstream (§5 note) — the freeze anchors to the **P2 confirm-gate**, not a `designer→runner` edge
  (there is no runner in a propose dispatch); the lifecycle stays linear and the propose dispatch
  closes on the accepted frozen `criterion.md`.)_
- **NEW debt (persistence)** — **STRAINED; discharged by premise revision.** `experiment` is the
  first LIVE type whose verdict-defining datum — the pre-registered criterion — is _governance-grade_
  (frozen at P2, immutable, re-gating on edit) yet persisted **off-registry**, in `working_folder`:
  a close row's `FALSIFIED`/`SURVIVED` is uninterpretable and irreproducible from the ledger alone.
  The premise is therefore **narrowed**: the registry is the sole persistence surface for _row-schema_
  dispatch metadata; `experiment`'s pre-registered criterion is a governance-grade artifact persisted
  in `working_folder` (located by the row's `working_folder` field), not the registry. A registry-side
  pointer + content hash to the specific criterion artifact (restoring full ledger self-sufficiency
  for re-adjudication) is recorded as an **OPEN** hardening option, deferred until `experiment` use
  proves the gap bites.
  _(Scope update 2026-06-15: the `FALSIFIED`/`SURVIVED` close belongs to the **run** dispatch
  (downstream); the **propose** dispatch closes `resolved` on an accepted frozen `criterion.md`. The
  off-registry-criterion concern therefore attaches to the later run, and the deferred pointer+hash
  hardening is precisely what would let that run re-adjudicate `SURVIVED`/`FALSIFIED` from the ledger.)_

**propose/run re-scope (2026-06-15, owner decision) — re-confrontation.** The 2026-06-15 split
(`experiment` dispatch = propose-only; the run + SURVIVED/FALSIFIED adjudication is a separate
downstream dispatch) falsifies a premise the 2026-06-14 NEW-debt above rests on — that _this_
dispatch closes on a SURVIVED/FALSIFIED row. Per §7's promotion rule (a change to the debts is
re-confronted adversarially, proponent × skeptic), the three debts are re-confronted under the
split; the adversarial source is the review dispatch
`2026-06-15-experiment-propose-run-rescope-review` (3 tensioned attackers ⟂ verifier).

- **P-SS-8 (spawn / cost)** — **AFFIRMED open, unchanged.** Splitting one dispatch into two adds no
  spawn/cost machinery; the propose dispatch is _smaller_ (designer + skeptic) and the run is a
  separate future dispatch counted on its own.
- **P-SS-9 (linear lifecycle)** — **AFFIRMED, strengthened.** Removing the in-dispatch runner makes
  the freeze anchor cleanly to the P2 gate; both phases stay linear (propose → confirm → dispatch →
  close; later, run → confirm → dispatch → close).
- **NEW debt (persistence)** — **RELAXED at propose, re-attached to run.** The propose dispatch's
  deliverable _is_ the criterion artifact and it closes `resolved` on acceptance of that artifact —
  there is no SURVIVED/FALSIFIED row to be "uninterpretable from the ledger", so the debt does not
  bind the propose dispatch. It re-attaches to the **run** dispatch (whose close _does_ carry
  SURVIVED/FALSIFIED against an off-registry criterion); the deferred registry pointer + content
  hash is the run's OPEN hardening, to land when the run phase is built.
- **Process note (§10).** This re-scope touches no field, enum, row-schema, or code surface
  (verified: the appender test battery asserts only `experiment`'s `working_folder` requirement —
  nothing about outputs, verdict, or roles), so §10.2 five-surface atomic promotion does not fire;
  it is an annotation-class change to an already-LIVE type under §10.1's typo/prose carve-out,
  recorded as an owner decision. A document-`version` bump for the propose/run model is left to the
  owner's call.

## 8. v0.5.2 amendments (2026-06-12 adversarial assessment)

Source: `research/subagents-strategy/2026-06-12-constitution-v051-assessment/findings.md`
(dispatch `2026-06-12-constitution-v051-adversarial-assessment` — 4 explorers ⟂ tensioned →
synthesizer ↔ 2 reviewers zig-zag; 2 CRITICAL / 14 MAJOR / 11 MINOR confirmed, 4 findings
refuted in review). Owner decisions:

| Decision                            | Amendment                                                                                                                                                                                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **T1 — persist the outcome**        | Close row (`close_of`) restored; Principle 3 rewritten as the two-append rule; the `feedback`-prompt write-back now lands in the close row — resolving the v0.5.1 literal self-contradiction (C1) and re-aligning text with the appender (C2).           |
| **T2 — `success_metric` stays cut** | Reviewer-side zig-zag turns carry a standing inconsistency-hunting goal; a turn in which no reviewer raises an inconsistency terminates the exchange as converged (also closes the missing-convergence-criterion gap, M12).                              |
| **T3 — no self-approval**           | `final_approver` ∈ {`parent`, dedicated `meta-evaluate` approver}; never a working-group member; fallback to `parent` if its group never runs; approver receives the full `working_folder`. (Also gives `meta-evaluate`/`auditor` their worked trigger.) |
| **T4 — pool kept, facts fixed**     | §2 corrected: 245 names; `role_fit` is an ordered list.                                                                                                                                                                                                  |
| **T5 — keep and tighten**           | Meta-planned-by-meta sanctioned (P13); `loop_cap`-on-sequential prohibition cross-referenced at the schema line; incident-edge rule added to the `layers` corollary.                                                                                     |

Assessment fixes applied alongside: confirmed-sheet freeze rule (M7); `dispatch_id` same-day
suffix/uniqueness rule (M8); `schema_version` row field (M9); partial-failure semantics in
P4 (M10); approver fallback + input surface in P12 (M11); `token_budget` reframed as a
declared target and the P-SS-8 "partially discharged" claim corrected (M4); §1 determinism
claim scoped to structure (M13); appender named the single serializing write path (M14);
`exit_reason` precedence order (m1); `n` made optional-with-default and `agents_spawned`
re-keyed by role-category with a `helpers` bucket (m7/N15); `context` made required (N12);
robot-talks binding pinned under the single-gate rule (N14); wave5 precedent flagged as
old-schema (m9).

## 9. 2026-06-12 in-place owner amendments (scheduling + anti-bias decision rule)

Owner decisions of the 2026-06-12 session (recorded in place, no version bump — the row
schema is unchanged; fold into the next versioned amendment, per the `review`-promotion
precedent in §5 `dispatch_type`):

| Decision                         | Amendment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **D1 — dependency scheduling**   | "Groups run sequentially in declared order" replaced everywhere (§3, P4, §5 Level 2, §6 skeleton) by dependency-based readiness: a group is READY when every group with a `sequential`/`zig-zag` edge into it has produced what it must respond to; all READY groups launch concurrently; `feedback` edges never count as dependencies; a connection-less sheet declares its groups independent; declared order is narration/registration tiebreak only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **D2 — anti_bias decision rule** | Principle 5 gains a four-test mechanical PASS/REJECT rule (axis vocabulary closed to the four canonical axes or a declared composite — **scoped to per-group `anti_bias` only**; `anti_bias_global` stays a free-text theme; clone test; spread test; pairwise predicted-disagreement evidence test), with semantics owned by `vault/discovery/anti-bias-vector-composition/validator-check.md` _(pending v0.5.2 realignment — its protocol still speaks the removed `dispatch.yaml`/`composition`/`layers[]` schema)_. **Enforcement split:** tests 1–4 (the semantic axis/clone/spread/evidence checks) are gate-checked on the sheet only (no executable enforcement); the **presence** conditionals are **appender-enforced** (exit 2) — _both_ the per-group `anti_bias` (required at n ≥ 2) _and_ `anti_bias_global` (required when ≥ 2 groups have n ≥ 2), as `append-dispatch.cjs` actually does. (CR-1 fix, v0.6.0: the prior "solely `anti_bias_global`" wording contradicted P5 and the code.) |

**Premise-debt re-confrontation** (per the §7 meta-clause): **P-SS-8 (spawn budget)** —
AFFIRMED, carried open; D1/D2 add no spawn or cost machinery (concurrent launch changes
wall-clock shape, not agent count or token spend). **P-SS-9 (linear lifecycle)** —
AFFIRMED, carried open; D1 changes group _execution_ scheduling (topology), not the
propose → confirm → dispatch → close lifecycle, which stays linear. This affirmation relies
on the lifecycle-vs-topology separation that P-SS-9's own discharge condition records as
not yet made — an honest dependency, not a discharge. **NEW debt (opened by v0.5.1,
narrowed by v0.5.2 — §7)** — AFFIRMED, carried open in full, both clauses: the spec-file,
telemetry, and validator rules (R25–R28 in v0.3.0) remain removed and P-SS-9's artifact
wording rests on Principle 9's research-only two-file clause; and (residual) the registry
remains the only persistence surface for dispatch metadata.

**LANDED 2026-06-12 (in place, no version bump — same precedent as the `review`-type
population in §5):** `invoked_by` — the appender-resolved invoking-user email stamped on
both rows — is now recognized in §5 (Level 1) as an OPTIONAL tooling-provenance extension
(owner-directed 2026-06-12; source: register-dispatch SKILL). Fold into the next versioned
amendment.

**Related open proposal (not yet law):** depth-1 nested dispatch (a working agent granted
the right to open ≤ 1 nested dispatch, capped at 2 nested dispatches per parent, nested
dispatches may not nest further, delegated gate + mandatory registration via
`parent_dispatch_id`). Pending a `dispatch_type: research` design dispatch before any
amendment is drafted — Principle 13 and Principle 11 are the affected law.

## 10. Amendment hygiene — version-bump + atomic promotion (LANDED 2026-06-15, v0.5.3)

The §9 "in-place, no version bump" practice is the documented source of doc-vs-code drift:
every "v0.5.2" reference became a target silently amended N times, and the 2026-06-14
`experiment` promotion left the test battery red and §5's `working_folder` field stale (the
v0.5.3 stale-field failure — distinct from the §8 assessment finding C1). Owner decision
2026-06-15 retires that practice for surface changes:

1. **Version bump on surface change.** Any change to a field, an enum value, a principle, or
   a `dispatch_type`'s LIVE/RESERVED status bumps the document `version`. In-place edits
   without a bump are allowed only for typo/prose fixes that change no field, enum, or status.
   (This is distinct from the wire `schema_version`, which bumps only when the _row schema_
   changes — at v0.6.0 the row schema **did** change, as the group `role` field was removed,
   so `schema_version` advanced 0.5.2 → 0.6.0.)
2. **Atomic promotion.** Promoting a `dispatch_type` (RESERVED → LIVE) or changing a field's
   conditional must touch, in one change set: the **code** (appender enum/validation), the
   **type SKILL**, this **constitution §5 field table**, the **test battery**, and the
   **README** — verified by re-running `tests/test-append-dispatch.cjs` to green. A promotion
   that updates fewer than all five surfaces is incomplete.
3. **Single-located law (consolidated v0.6.0).** The constitution lives in **exactly one**
   place: `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md`.
   The former repo-root copy was **deleted at v0.6.0** — the double-located model was itself the
   documented source of the doc-vs-doc drift this section exists to stop, so it is retired. There
   is no migration-source / live-law split any more: the single file is both the live law and the
   portable source. (The `internal_tools/subagents-dispatch-hooks/` tree remains the bundle copied
   into consumer repos; the constitution simply travels inside it.) _(History: §10 originally
   mandated two synchronized copies; v0.5.3 landed it in both, and v0.6.0 consolidated to one.)_

This §10 clause was the final amendment landed under the retired in-place practice (v0.5.3);
§11 (v0.6.0) is the first amendment landed under the new version-bump regime.

## 11. v0.6.0 amendments (2026-06-15 internal-consistency review)

Source: `research/subagents-strategy/2026-06-15-constitution-v053-consistency-review/findings.md`
(dispatch `2026-06-15-constitution-v053-consistency-review` — review type; 3 attackers
robot_talks → synthesizer → 2 verifiers zig-zag; 1 CRITICAL / 2 MAJOR / 5 MINOR confirmed,
4 candidate findings refuted in verification). Owner decision 2026-06-15: full structural fix.
This is the first **versioned** amendment under §10.1; it is also the first **row-schema**
change since 0.5.2, so the wire `schema_version` advances 0.5.2 → 0.6.0.

| #                         | Decision                                     | Amendment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CR-1** (CRITICAL)       | Enforcement contract had to be single-valued | §9 D2's "solely `anti_bias_global` is appender-enforced" was wrong (it contradicted P5 _and_ `append-dispatch.cjs`, which rejects a missing per-group `anti_bias` at n ≥ 2 and a missing `anti_bias_global` at ≥ 2 fan-out groups). D2 rewritten to match P5 and the code: **both presence conditionals are appender-enforced; only the four semantic tests are gate-only.**                                                                                                                                                           |
| **CR-2** (MAJOR)          | Group `role` removed entirely                | The group-level `role` field is **deleted** (Level 2 schema, P6 wording, §3, the experiment recipe, the `agents_spawned` map, the §6 skeleton). A group's function is now read off its agents' `role`s and its workflow position off its `connections`; the close-row tally keys directly by **agent** role. This dissolves the broken 1:1 `auditor ↔ meta-evaluate` map that the experiment recipe violated. Row-schema change → `schema_version` 0.6.0; `append-dispatch.cjs` + test battery updated in the same change set (§10.2). |
| **CR-6** (MAJOR)          | Dangling decision label                      | §7's `token_budget` reference "(D6)" repointed to "(M4)", the real decision id.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **CR-4/5/8/9/12** (MINOR) | Drift cleanup                                | §7 "sole persistence surface" narrowed to "row-schema metadata"; "FORECAST" → "RESERVED" everywhere (skeleton + §7); §5 review-note version-axis clarified; §10's "C1 failure" renamed to disambiguate from §8's assessment finding C1; skeleton axis tokens hyphenated (`source-corpus`, `attack-vector`) to match the closed vocabulary.                                                                                                                                                                                             |
| **§10.3**                 | Consolidate the law                          | Repo-root copy deleted; the constitution is now single-located in `internal_tools/subagents-dispatch-hooks/constitution/` (§10.3 rewritten). Active skill pointers repointed off "repo root".                                                                                                                                                                                                                                                                                                                                          |

Findings **refuted in verification** (recorded, not actioned — claim ≤ proof): the §10
atomic-promotion rule is _not_ retroactively self-violated (its amnesty scopes it
prospectively); §8's "v0.5.2 amendments" heading is correctly scoped history; the "14 MAJOR"
count is a non-exhaustive summary; the skeleton feedback edge is governed conditional by §3/§5.

**Premise-debt re-confrontation** (per the §7 meta-clause; required because v0.6.0 changes the
row schema): **P-SS-8 (spawn / cost)** — AFFIRMED, carried open; removing a field adds no spawn
or cost machinery. **P-SS-9 (linear lifecycle)** — AFFIRMED, carried open; the change is to the
group _schema_, not the propose → confirm → dispatch → close lifecycle. **NEW debt (persistence)**
— AFFIRMED, carried open as narrowed by the `experiment` re-confrontation (§7); the registry
remains the sole persistence surface for row-schema metadata. No debt is discharged or newly
opened by v0.6.0.

## 12. v0.6.1 amendment (2026-06-15 — `experiment` propose/run re-scope)

Source: the review dispatches `2026-06-15-experiment-skill-proposal-review` (the original
knowledge-taxonomy-comparison proposal review) and `2026-06-15-experiment-propose-run-rescope-review`
(3 tensioned attackers ⟂ verifier over this changeset;
`research/subagents-strategy/2026-06-15-experiment-propose-run-rescope-review/findings.md`). Owner
decision 2026-06-15: `experiment` is **re-scoped** to the pre-registration (propose) phase only.

This re-scopes an **already-LIVE** type's lifecycle model; per §10.1 that is a principle change, so
the document `version` bumps **0.6.0 → 0.6.1**. It touches **no** field, enum, row-schema, or code
surface, so the wire `schema_version` stays `0.6.0` and §10.2's five-surface atomic promotion does
**not** fire (verified: the appender test battery asserts only `experiment`'s `working_folder`
requirement — nothing about outputs, verdict, or roles).

| #                                     | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Amendment |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **EX-1 — propose/run split**          | `dispatch_type: experiment` is scoped to the **propose** phase: designer (`writer`) + skeptic (`skeptic`) produce a frozen, validity-checked `criterion.md`. **Running the probe + adjudicating SURVIVED/FALSIFIED is a separate downstream dispatch** (runner `explorer` + adjudicator `auditor`). INVALID may be rendered at propose; SURVIVED/FALSIFIED only at the run. The propose dispatch closes `resolved` on an accepted frozen `criterion.md`. Authority: type skill `.claude/skills/experiment/SKILL.md`. |
| **EX-2 — §5 + P-SS-9 reconciliation** | The 2026-06-14 §5 `dispatch_type` note and the §7 P-SS-9 bullet carried the single-dispatch model present-tense; both are marked **scope-superseded 2026-06-15** in place (the freeze anchors to the **P2 gate**, not a `designer→runner` edge — there is no runner in a propose dispatch).                                                                                                                                                                                                                          |
| **EX-3 — §7 debt re-confrontation**   | A **propose/run re-confrontation** block was added to §7: P-SS-8 unchanged; P-SS-9 strengthened; the persistence NEW-debt **RELAXED at propose** (the criterion artifact _is_ the deliverable; no SURVIVED/FALSIFIED row to be ledger-uninterpretable) and **re-attached to the run** (where the deferred pointer + content hash becomes relevant).                                                                                                                                                                  |
| **EX-4 — downstream reconciliation**  | The router `dispatch_type` table (both skill copies) annotated "propose phase only"; `docs/discovery/experiment-promotion/discovery.md` carries a dated scope-update note flagging the split.                                                                                                                                                                                                                                                                                                                        |

**Premise-debt re-confrontation:** performed in §7 (the "propose/run re-scope (2026-06-15) —
re-confrontation" block); not duplicated here.

**Open (owner / next):** the **run phase** is undesigned — whether it is a new mode of `experiment`,
a use of the RESERVED `code` type once it lands, or a separate type, is the next design decision; the
deferred registry pointer + content hash (§7) is the run's OPEN hardening.

## 13. v0.6.2 amendment (2026-06-18 — research five-role split + skill portability)

Source: this session's rewrite of the `research` type skill for cross-repo portability, and the
owner correction that the `synthesizer` and `writer` functions are **distinct roles at distinct
pipeline stages**, not one conflated role. Owner decision 2026-06-18.

This adds a value to the agent-`role` enum; per §10.1 an enum-value change bumps the **document**
`version` **0.6.1 → 0.6.2**. It is **not** a row-schema (structural) change — no field is added or
removed and the row shape is unchanged — so the wire `schema_version` **stays `0.6.0`** (precedent:
the 2026-06-14 `experiment` LIVE promotion changed `LIVE_TYPES` in code without a wire bump). The
appender already accepts `role: synthesizer` at `schema_version "0.6.0"`; the test battery is green
(83 pass).

| #                                               | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Amendment |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **RS-1 — synthesizer/writer split**             | The `synthesizer` (reconciles explorer returns into a candidate picture; mid-pipeline; zig-zags with reviewers; may feedback to explorers) and the `writer` (persists `research.md`+`findings.md` via the `domainspec-research-writing` / `domainspec-findings-writing` skills **[research.md ownership superseded 2026-06-18 by §14 RW-1: the writer persists `findings.md` only; the strategist appends `research.md`]**) are **separate agent roles at separate stages**. The research agent-`role` enum is therefore five: `explorer / synthesizer / skeptic / writer / auditor`. Authority: type skill `skills/research/SKILL.md`. |
| **RS-2 — canonical pipeline**                   | The research canonical shape is the sequential spine `explorers → synthesizer → reviewers → writer → auditor`. Conditional edges: `robot_talks` on explorers and/or reviewers; `zig-zag` synthesizer⇄reviewers; `feedback` synthesizer→explorers; and a structural `revision` edge auditor→writer (modelled as a `feedback` edge, `loop_cap` default 1 — **no new `connections.type` enum value**). Reflected in §3, §5 (`role`, canonical edge set), §6 skeleton, P6, P9, P12.                                                                                                                                                         |
| **RS-3 — auditor evaluates `findings.md` only** | The `auditor` (dedicated `final_approver`) evaluates `findings.md` only and owns the `revision` edge back to the `writer` (default one revision, may request more). P12 narrowed accordingly.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **§10.2 five-surface check**                    | Synced in one change set: **code** (`append-dispatch.cjs` `AGENT_ROLES` += `synthesizer`), **type skill** (`research/SKILL.md` rewritten), **constitution §5** (`role` field table + §3/§6/P6/P9/P12), **tests** (+2 cases asserting `synthesizer` accepted and enumerated; 83 green), **README** (describes roles generically — no enumeration, no edit required).                                                                                                                                                                                                                                                                     |

**Skill-portability note (no law change).** The `research` type skill was rewritten to reference
**only sibling skills** (`domainspec-subagents-strategy`, `check-tension`, `register-dispatch`,
`robot-talks`, and the two writing skills) — no constitution section numbers, vault paths, or
telemetry paths — so the bundle is runnable when copied to another repo. This is an authoring
convention for the skill, not a constitutional rule; the constitution remains the dispute authority
the skill points back to.

**Premise-debt re-confrontation:** **P-SS-8 (spawn / cost)** — AFFIRMED, carried open; adding a role
value adds no spawn or cost machinery. **P-SS-9 (linear lifecycle)** — AFFIRMED, carried open; the
five-stage spine is still the propose → confirm → dispatch → close lifecycle, now with a named
revision back-edge already governed as a conditional `feedback` edge by §3/§5. No debt discharged or
newly opened.

## 14. v0.6.3 amendment (2026-06-18 — research.md is the strategist's append, writer owns findings.md only)

Source: owner decision 2026-06-18, same session. Refines the RS-1 split (§13): the
`synthesizer`/`writer` separation stands, but the **writer's file ownership narrows to
`findings.md` only**, and **`research.md` becomes a mechanical append owned by the
strategist** (the parent that owns the dispatch), not by any agent role.

Per §10.1 this is a **prose/semantics change, not an enum or row-schema change** — the
five-role enum is untouched, no field is added or removed, and the wire `schema_version`
**stays `0.6.0`**. The `append-dispatch.cjs` `AGENT_ROLES` set and the test battery are
unaffected. It bumps the **document** `version` **0.6.2 → 0.6.3**.

| #                                                            | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Amendment |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| **RW-1 — research.md is explorer-only, strategist-appended** | `research.md` is the **verbatim transcript of the explorer returns only** (one `## Agent N` section per explorer), appended **mechanically by the strategist** per `domainspec-research-writing`. It is not authored by the `writer`, and synthesizer/reviewer output is not transcribed into it — those survive digested (and cited) in `findings.md`. Supersedes the part of **RS-1 (§13)** that assigned `research.md` to the writer.                                                                                                                                       |
| **RW-2 — writer owns findings.md only**                      | The `writer` (stage 4) persists **`findings.md` only**, via `domainspec-findings-writing`. The role is otherwise unchanged: n:1, downstream of the reviewers, subject to the auditor's `revision` edge.                                                                                                                                                                                                                                                                                                                                                                        |
| **RW-3 — file names and path**                               | The two outputs are `research.md` and `findings.md` at the **root of `working_folder`** (not `domainspec-research.md` / `domainspec-findings.md`, not a `working_folder/research/` subfolder). The writing skills are aligned to this naming.                                                                                                                                                                                                                                                                                                                                  |
| **§10.2 surface check**                                      | **code** — unaffected (no enum change). **type skill** — `research/SKILL.md` (both the `internal_tools` master and the deployed `.claude` copy) updated and re-synced. **constitution** — §1, §4 (P6, P9), §5 (`role`), §6 skeleton edited in place + this §14. **writing skills** — `domainspec-research-writing` (explorer-only, strategist-appended) and `domainspec-findings-writing` (writer-authored) re-aligned, names/paths fixed. **register-dispatch** — pipeline note (writer persists findings.md; strategist appends research.md). **tests/README** — unaffected. |

**Premise-debt re-confrontation:** **P-SS-8 (spawn / cost)** — AFFIRMED, carried open;
moving an append from the writer to the strategist removes an agent task, adds no machinery.
**P-SS-9 (linear lifecycle)** — AFFIRMED, carried open; the spine and lifecycle are
unchanged. No debt discharged or newly opened.

## 15. v0.8.0 amendment (2026-07-28 — one confirmation-ready sheet)

Source: repeated-confirmation incident review plus the required independent
`sigil-development` observer pass. The prior form could pass while agent
identities, approver eligibility, and Test 4 evidence were still unresolved.
That made preventable defects appear only after the human had confirmed.

This is a row-schema change. New dispatch sheets use wire
`schema_version: "0.8.0"`; historical rows remain structurally grandfathered.

| #                                           | Decision                                                                                                                                                                                                                                                                              | Amendment |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **CR-1 — digest-owned pair evidence**       | Every fan-out group adds `predicted_disagreements`, with exactly one canonical indexed record for every unordered pair. Companion prose cannot satisfy Test 4.                                                                                                                        |
| **CR-2 — deterministic identity admission** | Before tension or confirmation, every non-null `agent_name` must resolve in the active pool and appear only once in the dispatch.                                                                                                                                                     |
| **CR-3 — approver admission**               | A named `final_approver` must be pooled and occur exactly once as the sole `auditor` of a singleton dedicated approval group. `parent` remains the default. Arbitrary external names and working roles are invalid.                                                                   |
| **CR-4 — sheet-only tension gate**          | The two independent tension verdicts receive only the exact sheet bytes, digest, and rubric. They run independently in parallel; checker/reviewer comparison occurs only after both verdicts are frozen.                                                                              |
| **CR-5 — one human request**                | Draft revision is not confirmation. Form, type, pool, identity, approver, pair coverage, path, and tension obligations close before the normal single confirmation request. Byte revisions refresh machine gates; only material or unclassifiable changes require a fresh human gate. |
| **CR-6 — evidence boundary**                | The deterministic appender owns structural pair coverage and identity/approver admission. `check-tension` owns semantic axis, clone, spread, and evidence quality. Neither gate may infer the other's verdict.                                                                        |

## 16. v0.8.1 document amendment (2026-08-02 — semantic confirmation)

Source: user-reported redundant-confirmation defect, maintenance Inventory
lookup, and the required independent observer pass. The row schema remains
`0.8.0`; this amendment changes lifecycle semantics and evidence interpretation,
not ledger columns.

1. Human confirmation binds a deterministic **material-strategy projection**:
   objective and evidence boundary; dispatch type; lane purpose; agent identity,
   role, angle, prompt, and source scope; outputs; dependency topology and loop
   ceilings; final approver; destination; publication/privacy boundary;
   validation; and stop conditions.
2. Exact sheet SHA-256 values remain mandatory **machine-integrity evidence** for
   readiness, both tension verdicts, and registrar attachment. Every byte edit
   invalidates those machine receipts and reruns their gates.
3. Whitespace, key order, digests and evidence handles, derived counts, schema
   defaults, and canonical materialization of content already presented to the
   human are mechanical only when a deterministic comparison proves the
   material projection unchanged.
4. A prior confirmation may carry to new admitted bytes only with a durable
   material-equivalence receipt. Material change, unknown equivalence, or an
   unprovable comparison fails closed and requires the revised strategy to be
   presented and reconfirmed.
5. `confirmation.sheet_sha256` binds the direct-or-carried confirmation handle
   to the bytes being registered; it does not redefine human approval as assent
   to serialization details.
