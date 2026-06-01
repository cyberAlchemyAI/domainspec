---
tags: [vault, discovery, subagents, inheritance, backport, research-skill, base-engine]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: active
version: 0.1.0
last_updated: 2026-05-26
---

# Relation to Base `domainspec-subagents-strategy`

> How the `research` refinement layer relates to the base engine: what it inherits, what it adds, what stays research-local, how conflicts resolve, and which patterns are candidates for backport. Sibling to [`principle.md`](./principle.md), [`role-taxonomy.md`](./role-taxonomy.md), [`decisions-log.md`](./decisions-log.md).

---

## What `research` inherits from `domainspec-subagents-strategy`

The base engine remains load-bearing under `research`. The following machinery is **inherited verbatim**:

- **Spec engine.** R25 spec schema, content-addressed YAML, in-chat composition at Step 0, post-confirm persistence at Step 2.5.
- **Lifecycle skeleton.** R3 Step 1 (chat proposal) / Step 2 (user confirm) / Step 3 (single-message fan-out). All anchored as `R3 Step 1 / R3 Step 2 / R3 Step 3` under both constitutions.
- **Validator-skip rule for trivial cases.** R26's trivial-dispatch carve-out (`mode: single` AND `layers: 1` AND `n: 1` AND no `bootstrap_override`) skips the validator dispatch. Carries over unchanged.
- **Telemetry pattern.** R28 JSONL emission to `internal_tools/vault_telemetry/events/subagent-strategy.jsonl`, with start-event before fan-out, plus the R31 close-event (now base, since v0.3.0).
- **R5–R6 user gate discipline.** Two user-confirmation gates (pre-dispatch, pre-promotion); proposal never persists pre-confirm; named writer surfaces own all post-confirm file persistence.

If `research` ever stops inheriting any of these, it ceases to be a research-shaped dispatch — it becomes a separate skill family.

---

## What `research` adds

The following are *not* in the base; they are the research layer's contribution:

- **Four canonical work-roles.** `explorer | skeptic | writer | auditor`. The base engine's `layers[].role` is `investigate | evaluate | meta-evaluate | synthesize` (workflow stages). The four work-roles live in `agents[].role` orthogonally. Full discussion in [`role-taxonomy.md`](./role-taxonomy.md).
- **Per-agent decision-record schema.** R12 of `research-constitution`. Every agent writes one schema-conformant file at `<corpus>/<topic-slug>/agents/`. The base engine has no per-agent file requirement.
- **Anti-bias tension check.** Was added research-local, then promoted to base R29 (v0.3.0). The research constitution retains the rule (R10) as an inheritance marker.
- **Typed `success_metric`.** R19 of `research-constitution`. Closed taxonomy: `coverage | closure | refutation | convergence | artifact | exploratory`. The base engine has no typed metric — success is post-hoc rationalized at close.
- **Typed `exit_reason`.** Was added research-local, then promoted to base R31 (v0.3.0). The research constitution retains the rule (R21) as an inheritance marker; the value `reviewer_rejected_twice` remains research-local because the base has no auditor role.
- **Per-layer mode composability.** Was added research-local, then promoted to base R30 (v0.3.0). Closes the long-standing `OQ-mixed-dag-schema` in the base.
- **DSL of composition.** The arrow-shorthand (`L1:explorer(N=3, sonnet) → L2:skeptic(N=2, opus) → ...`). Sugar over the canonical spec; not in the base.

---

## What stays NOT shared

Some patterns are research-specific and will not be backported:

- **Closure marks.** The corpus-specific closure vocabulary (`closed-borrowing | closed-contribution | closed-paper | closed-analogy | closed-negative | open | promoted | needs-review`) lives in `research-*/SCHEMA.md` files. The base engine has no notion of closure marks — its lifecycle terminates with the four-component grade, not with a typed closure.
- **Research-specific gates.** R27 (precedent kill), R28 (non-vacuity witness), R29 (definitional soundness) are research-shaped audit checks; they have no meaning over generic `docs/features/<feature>/research/` dispatches.
- **Scientist agent pool.** `theorem/agents-strategy/agent-pool.yaml` is curated from authors cited in `research-*` and `theorem/`. A generic `docs/features/` dispatch would draw from a different pool (or none) — the naming discipline survives, the pool itself does not.

---

## Conflict resolution rule

This mirrors the conflict-resolution clause in [`research-constitution.md` §12](../../constitution/research-constitution.md):

- For `category: documents` dispatches under the `research` skill, the **research refinement layer wins** when it strengthens a base rule (e.g. tension over coverage, typed metric over free-text).
- For any other dispatch under `domainspec-subagents-strategy` directly, the **base engine wins** — the refinement layer is dormant.
- Where research-constitution inherits verbatim (R10, R21), the base rule IS the operative rule under both surfaces; the inheritance marker exists for navigability, not for divergence.

There is no current rule conflict in flight. This clause is forward-looking: future research-layer amendments must check whether they remain strict supersets, and if not, declare the divergence explicitly.

---

## Backport candidates

Three patterns are **high-confidence backports** to `domainspec-subagents-strategy` — they have already shipped in base v0.3.0:

- **Per-layer mode composability** → base R30. Closes `OQ-mixed-dag-schema`.
- **Typed `exit_reason` taxonomy** → base R31. Adds dispatch-level retro-analyzability.
- **Anti-bias pairwise tension check** → base R29. Strengthens R26 validator item 3.

Three patterns are **medium-confidence backports** — deferred until production-validated by `research` use:

- **Per-agent decision-record schema.** Likely valuable for non-research dispatches too (any multi-agent dispatch is unauditable without per-agent files), but the schema fields are research-shaped (closure_mark, dissent) and would need generalization before backport.
- **Typed `success_metric`.** Closed taxonomy is research-shaped (coverage / closure / refutation / convergence / artifact / exploratory); generalizing to code-modification dispatches needs a separate audit.
- **DSL of composition.** Cheap to adopt, but the value depends on how often base dispatches share the linear-pipeline shape. If they do, backport; if base dispatches are more often single-mode, the DSL is overhead.

Backport timing for the medium-confidence three is gated on: (a) at least two research dispatches successfully using them, (b) at least one base dispatch identifying friction from their absence. Neither condition is satisfied as of 2026-05-26.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [principle.md](./principle.md) | `umbrella` | The eight refinements; this file is the inheritance map. |
| [role-taxonomy.md](./role-taxonomy.md) | `sibling` | The four work-roles and one meta-role; this is the largest add the research layer makes over the base. |
| [decisions-log.md](./decisions-log.md) | `sibling` | The chronological record, including the backport-deferral decision. |
| [../../constitution/research-constitution.md](../../constitution/research-constitution.md) | `codified-in` | §12 (Relationship to other constitutions) carries the canonical conflict-resolution clause. |
| [../../constitution/domainspec-subagents-strategy-constitution.md](../../constitution/domainspec-subagents-strategy-constitution.md) | `inherits-from` | The base; R29–R31 are the v0.3.0 backports. |
