---
tags: [vault, discovery, subagents, decisions, log, research-skill, session-trail]
node_type: discovery
is_session: false
layer: ontology
nature: chronological
status: active
version: 0.1.0
last_updated: 2026-05-26
---

# Decisions Log — `research` Skill Design Session

> Chronological record of design decisions made during the 2026-05-26 session deriving the `research` skill and its constitution. Sibling to [`principle.md`](./principle.md), [`role-taxonomy.md`](./role-taxonomy.md), [`relation-to-base.md`](./relation-to-base.md).

Each entry follows: **Decision** (the rule that landed) / **Alternative considered** (the road not taken) / **Rationale** (why) / **Affects** (which file or axiom).

---

### 2026-05-26 — Four canonical work-roles named `explorer | skeptic | writer | auditor`

**Decision.** The four work-roles are named `explorer`, `skeptic`, `writer`, `auditor`.
**Alternative considered.** `investigate | evaluate | synthesize | review` — matching the base engine's `layers[].role` vocabulary.
**Rationale.** The base engine's vocabulary is workflow-stage shaped (when in the lifecycle); the research vocabulary needed to be epistemic-function shaped (what intellectual task). The chosen names are pungent and philosophically loaded — an "explorer" is graded on coverage from its angle, a "skeptic" on specificity of objection. The base vocabulary stays orthogonal on `layers[].role`; the new vocabulary lives on `agents[].role`.
**Affects.** `research-constitution` R4–R8; `role-taxonomy.md`.

### 2026-05-26 — Validator is a meta-role (5th), not a 4th work-role

**Decision.** The validator is separated from the four work-roles as a meta-role; the count is "4+1", not "5".
**Alternative considered.** Add `validator` to the work-role enum, making it the 5th sibling.
**Rationale.** The validator operates on the spec (a design, not a deliverable), runs at Step 0.5 (before any work-role has dispatched), and does not author a per-agent file. The four work-roles all share: artifact input, post-dispatch timing, per-agent file authorship. Forcing the validator into the same enum would either bloat the per-agent file schema (validator has no decision in that shape) or carve exceptions that erase the uniformity that makes the schema cheap to audit.
**Affects.** `research-constitution` R26 (validator gate) vs R4–R8 (work-roles); `role-taxonomy.md` §"Why 4+1".

### 2026-05-26 — Per-agent file is a schema decision record, body ≤200 words

**Decision.** Each dispatched agent writes one file at `<corpus>/<topic-slug>/agents/<NN>-<role>-<agent_name>.md` with the R12 YAML frontmatter and a body capped at 200 words.
**Alternative considered.** Free-form per-agent transcript; or no per-agent file (rely on chat history).
**Rationale.** Subagent returns vanish from chat history once the dispatch closes; without a per-agent file the dispatch is an unaudited black box. The schema-not-instance principle keeps the auditor cheap: schema conformance is checkable by `haiku`; body is reviewed by the human at close. The 200-word cap prevents the file from duplicating the briefing return and forces compression.
**Affects.** `research-constitution` R12–R14; `principle.md` refinement 3.

### 2026-05-26 — Anti-bias = 3 layers of defense

**Decision.** Anti-bias enforced at three layers: (a) structural — R26 validator names tension axes per sibling pair; (b) behavioral — agent briefings carry the angle and the predicted-disagreement question; (c) adversarial — the `skeptic` role exists precisely to surface bias that survives (a) and (b).
**Alternative considered.** Single-layer enforcement at the validator level only.
**Rationale.** Bias survives any single layer when the layer's check has a blind spot. Structural validation catches non-tensioned partitioning; behavioral prompts catch tensioned-on-paper-but-not-in-practice; adversarial skeptic catches both surviving the first two when no observer predicted the disagreement upfront. The three layers cost different things and catch different failures.
**Affects.** `research-constitution` R9–R11; `../anti-bias-vector-composition/principle.md`; `principle.md` refinement 4.

### 2026-05-26 — Mode composability is per-layer, not top-level DAG

**Decision.** Each `layers[]` entry declares its own `mode:`; top-level `mode: pipeline` when heterogeneous; composition is linear (no DAG, no `depends_on:`).
**Alternative considered.** Top-level `mode: mixed` with a DAG schema and per-agent `depends_on:` fields.
**Rationale.** The DAG would have bought heterogeneous parallelism at the cost of a schema that needs cycle detection, dependency resolution, and partial-failure semantics. Per-layer linear composition gives 90% of the value (different shapes per layer) at 10% of the schema complexity. The role-ordering invariant (synthesize never precedes evaluate) is enforced unchanged across layers regardless of per-layer mode.
**Affects.** `research-constitution` R24–R26; promoted to base R30 (v0.3.0); closes `OQ-mixed-dag-schema`; `principle.md` refinement 2.

### 2026-05-26 — Default loop = 1 (ida + volta), max 5

**Decision.** `max_loops` defaults to 1; hard cap 5.
**Alternative considered.** Default 2 (matching base `loop_cap` default); or no cap, rely on `stop_conditions`.
**Rationale.** Most research dispatches resolve in a single pass — explorer → skeptic → writer → auditor produces a finding or a `closed-negative`. Looping is the exception (skeptic kill triggers re-dispatch; auditor schema check triggers writer redo). Default 1 forces the dispatcher to *opt in* to looping with a justification, rather than budgeting loops by default and consuming them silently. Hard cap 5 prevents runaway.
**Affects.** `research-constitution` R20; `principle.md` refinement 6.

### 2026-05-26 — `success_metric` forced typed, with `exploratory` escape hatch

**Decision.** `success_metric.type` ∈ `{coverage, closure, refutation, convergence, artifact, exploratory}`, parametrized by the fields its type names. The R26 validator rejects untyped or unparametrized metrics.
**Alternative considered.** Free-text `success_criteria`; or typed without the `exploratory` escape hatch.
**Rationale.** Free-text success is post-hoc rationalized at close ("we found things, success!"). Typed metric makes the dispatch falsifiable upfront. The `exploratory` escape hatch exists because some dispatches *are* open-ended (e.g. first pass over an unfamiliar corpus); banning untyped open-endedness would force false typing. Use sparingly is the discipline; the validator counts `exploratory` invocations per cycle.
**Affects.** `research-constitution` R19; `principle.md` refinement (implicit in 6).

### 2026-05-26 — Typed `exit_reason` taxonomy, mandatory

**Decision.** Every dispatch closes with one of `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`. Reported in chat, in LEDGER, in telemetry close-event.
**Alternative considered.** Free-text `stop_conditions` as the closure record (the base engine's original v0.2.0 approach).
**Rationale.** Free-text closures cannot be retro-analyzed by failure category. The typed taxonomy makes "which dispatches died on `dissent_irreconcilable`?" a JOIN-able telemetry query. `stop_conditions` remains as human-readable supplements; the typed reason is the authoritative closure record. Promoted to base R31 (v0.3.0).
**Affects.** `research-constitution` R21–R23; promoted to base R31; `principle.md` refinement 6.

### 2026-05-26 — Lean topology: main skill + 3 sub-skills + 5 agent definitions

**Decision.** The main `research/SKILL.md` is ~60 lines pointing to three sub-skills (`research-validate`, `research-review`, `research-promote`) and five agent definitions. Constitution and discovery docs sit in `/domainspec/vault/`, loaded only on reference. Skill files local to the theorem repo.
**Alternative considered.** Single fat `SKILL.md` carrying all lifecycle steps, validator checklist, review schema, promotion rules inline.
**Rationale.** The parent-session prompt cost scales with what's loaded. A fat skill would load the full constitution machinery every time `research` is mentioned; the lean topology defers the cost to the step that needs it. Sub-skills are loaded inside their step's call; agent definitions inside child contexts; discovery docs only when referenced. Total prompt cost is dominated by the most-active step, not the sum.
**Affects.** `theorem/.claude/skills/research/SKILL.md`; `principle.md` refinement 8.

### 2026-05-26 — Backport to base `subagents-strategy` deferred until production-validated

**Decision.** Three high-confidence patterns shipped to base v0.3.0 (per-layer mode, exit_reason, tension check). Three medium-confidence (per-agent schema, typed success_metric, DSL) are deferred until at least two research dispatches use them AND at least one base dispatch identifies friction from their absence.
**Alternative considered.** Backport all six immediately to maximize uniformity.
**Rationale.** The high-confidence three were already partially present in the base (or addressed long-open OQs); promotion was low-risk. The medium-confidence three are research-shaped (per-agent schema fields name closure_mark, dissent; success_metric taxonomy is research-shaped). Premature backport would either generalize them poorly or force the base to absorb research-specific vocabulary. Defer-and-validate is the conservative path.
**Affects.** `domainspec-subagents-strategy-constitution` v0.3.0 (the three landed); `relation-to-base.md` §Backport candidates.

---

## Honest about what's untested

As of 2026-05-26, **zero research dispatches have run end-to-end under this constitution**. The decisions above are design-time commitments backed by analogy to prior dispatches under the base engine and by the explicit failure modes catalogued in `02-nested-agent-strategy-v2.md`. The first 2–3 research dispatches are expected to surface friction in:

- The per-agent file 200-word cap (may be too tight for `auditor` reports over large dispatches).
- The `max_loops = 1` default (may be too conservative if skeptic kills are common).
- The agent-pool naming discipline (`skeptic` ≠ `auditor` name constraint) at small pool sizes.

Updates to this log will follow as production use validates or invalidates the design.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [principle.md](./principle.md) | `umbrella` | The eight refinements; this log records *how* each was decided. |
| [role-taxonomy.md](./role-taxonomy.md) | `sibling` | The 4+1 split, motivated by decisions 1–2 in this log. |
| [relation-to-base.md](./relation-to-base.md) | `sibling` | The inheritance and backport map, including the deferral decision (last entry). |
| [../../constitution/research-constitution.md](../../constitution/research-constitution.md) | `codified-in` | The decisions land as R-prefixed rules in this constitution. |
| [../../constitution/domainspec-subagents-strategy-constitution.md](../../constitution/domainspec-subagents-strategy-constitution.md) | `backports-to` | R29–R31 in v0.3.0 are the high-confidence backports from this session. |
