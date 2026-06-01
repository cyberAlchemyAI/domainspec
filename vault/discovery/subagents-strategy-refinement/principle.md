---
tags: [vault, discovery, subagents, dispatch, strategy, refinement, role-taxonomy, research-skill]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: active
version: 0.1.0
last_updated: 2026-05-26
---

# Subagents-Strategy Refinement — Principle

> Umbrella discovery for the refinements to `domainspec-subagents-strategy` that crystallized during the `research` skill design session (2026-05-26). Adjacent deep-dive: [`../anti-bias-vector-composition/`](../anti-bias-vector-composition/). Sibling files in this discovery: [`role-taxonomy.md`](./role-taxonomy.md), [`relation-to-base.md`](./relation-to-base.md), [`decisions-log.md`](./decisions-log.md).

---

## What this discovery is

This is the umbrella record of refinements made to `domainspec-subagents-strategy` while deriving the `research` skill and its constitution. It is **not** a replacement of the base. The base engine (spec composition, validator gate, lifecycle, telemetry, four-component grading) stays load-bearing under `research`; this discovery catalogs what the research session added on top.

The motivation: the base engine is content-neutral — it parametrizes *how* a dispatch is shaped but is silent on *which epistemic functions* are being separated. In research contexts (auditing a bridge, killing a precedent, witnessing non-vacuity), those functions are not interchangeable. The refinements below name the functions and force the spec to declare them.

Each refinement either (a) already landed in `research-constitution.md@v0.1.0`, or (b) was promoted into the base constitution at `domainspec-subagents-strategy-constitution.md@v0.3.0` after proving out. Several are candidates for further backport (see [`relation-to-base.md`](./relation-to-base.md)).

---

## Ten refinements catalogued here

### 1. Role taxonomy 4+1

Four work-roles (`explorer | skeptic | writer | auditor`) plus one meta-role (`validator`). The four work-roles are *epistemic functions*, not workflow stages: an explorer can come after a writer; a skeptic can run in parallel with another skeptic. The validator is meta — it gate-keeps the spec before dispatch, not the artifacts after. Full discussion: [`role-taxonomy.md`](./role-taxonomy.md).

### 2. Per-layer mode composability

The former top-level `mode: mixed` (which had been reserved pending a DAG schema) is retired. Each `layers[]` entry declares its own `mode:` from `{single, task-fan-out, nested-waves, zig-zag, robot-talks}`. The top-level `mode:` becomes `pipeline` whenever any two layers carry distinct per-layer modes. Composition is linear — layer N runs after layer N−1 — there is no DAG and no `depends_on:` field. This closes the long-standing `OQ-mixed-dag-schema`.

### 3. Per-agent decision-record schema

Each dispatched agent writes one schema-conformant YAML decision record at `<corpus>/<topic-slug>/agents/<NN>-<role>-<agent_name>.md`. Fields: `agent_id`, `agent_name`, `layer_id`, `dispatch_id`, `role`, `model`, `decision`, `rationale`, `files_created`, `files_modified`, `references_consulted`, `dissent`, `closure_mark`. Body capped at ≤200 words. The principle is **schema-not-instance**: the file *is* the decision, not the deliberation. Agents that have nothing substantive to report still produce a file — empty files are missing files; one-sentence files are valid files.

### 4. Anti-bias pairwise tension validator check

The base engine's R26 validator already required angles to be "non-overlapping AND covering". This was strengthened to **pairwise tensioned** — for any two sibling agents in a layer with N ≥ 2, the validator must name the question on which a competent observer would predict the two agents to disagree. The deep-dive lives at [`../anti-bias-vector-composition/`](../anti-bias-vector-composition/); only the connection to this umbrella is recorded here.

### 5. DSL of composition

A linear shorthand replaces full YAML for the common case:

```
L1:explorer(N=3, sonnet) → L2:skeptic(N=2, opus) → L3:writer(parent) → L4:auditor(haiku)
```

Lower friction than full YAML for the spec-in-chat composition phase (R3 Step 1). The DSL is sugar: it desugars to the canonical spec schema. No branching syntax — the DSL refuses to express what the per-layer mode composability (refinement 2) already refuses.

### 6. `max_loops` default = 1, cap 5

The dispatch carries a `max_loops` parameter — the whole-dispatch loop budget — declared upfront in the spec. Default `1` (single pass, no loop). Hard cap `5`. Distinct from the base engine's per-layer `loop_cap`: `max_loops` is the dispatch-wide ceiling used when skeptic objections trigger a re-dispatch, when writer output fails auditor schema check, or when micro-vector tension produces irreconcilable dissent warranting a re-run with revised angles. Refinement landed in `research-constitution@v0.1.0` as R20.

### 7. `success_metric` is typed (with `exploratory` escape hatch)

The dispatch declares a `success_metric` from a closed typed taxonomy: `coverage` (N findings meeting a stated bar), `closure` (a stated open question receives a `closure_mark`), `refutation` (a stated claim is killed by precedent or counter-example), `convergence` (N independent agents arrive at the same verdict), `artifact` (a named file is produced meeting a stated bar), or `exploratory` (explicitly open-ended; one decision record per agent, no further bar — used sparingly as escape hatch). Each metric is parametrized in the spec by the fields its type names. Typing the metric upfront makes the dispatch falsifiable. Refinement landed in `research-constitution@v0.1.0` as R19.

### 8. Typed `exit_reason` taxonomy

Every dispatch terminates with exactly one `exit_reason` from the closed set: `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`. Reported in chat at dispatch close with 1–2 sentences of context; captured in the LEDGER; emitted in the R28 telemetry close-event. This replaces free-text `stop_conditions` as the closure record — `stop_conditions` remains as human-readable supplements.

### 9. Human-named agents from the scientist pool

Each dispatched agent is assigned a human name from `theorem/agents-strategy/agent-pool.yaml`. Within a single dispatch, `skeptic` and `auditor` MUST NOT share a name (these two roles are most often paired for independent objection; shared names erode dissent attribution). The LEDGER references agents by name, not just ID — "Noether's investigate contradicted Turing's evaluate" reads; "L2-A3 contradicted L3-A1" does not. The pool is drawn from scientists cited across `research-*` and `theorem/`; project authors are excluded by construction.

### 10. Lean main skill + sub-skills + agent definitions topology

To minimize per-conversation context cost, the main `research` `SKILL.md` is ~60 lines and points to:

- Three sub-skills (`research-validate`, `research-review`, `research-promote`) loaded only when their step fires.
- Five agent definitions (`research-explorer`, `research-skeptic`, `research-writer`, `research-auditor`, plus the validator-as-dispatch shape) loaded only inside child contexts.
- Constitution and discovery docs sitting in `/domainspec/vault/`, loaded only when explicitly referenced.

The skill files themselves are local to the theorem repo; the constitution and discovery are upstream in the vault. The split is what keeps the parent-session prompt cheap while preserving full discipline machinery on demand.

---

## Relationship to base `domainspec-subagents-strategy`

This discovery is a **strict superset** of the base engine. The base is content-neutral — it parametrizes dispatch but does not constrain what agents are *for*. This refinement layer adds:

- A closed taxonomy of agent functions (refinement 1).
- A per-agent persistent artifact (refinement 3).
- A tension check on angles (refinement 4).
- A DSL for common-case spec composition (refinement 5).

Plus three patterns that proved out under research and were backported to the base in `domainspec-subagents-strategy-constitution@v0.3.0`:

- Per-layer mode composability (refinement 2, now base R30).
- Typed `exit_reason` taxonomy (refinement 6, now base R31).
- Pairwise tension check (refinement 4, now base R29).

The base remains binding for any dispatch under `domainspec-subagents-strategy` directly; this refinement set binds for `category: documents` dispatches under the `research` skill. The conflict resolution clause in `research-constitution` §12 names the precedence rule explicitly.

For the full inheritance / conflict / backport story, see [`relation-to-base.md`](./relation-to-base.md).
