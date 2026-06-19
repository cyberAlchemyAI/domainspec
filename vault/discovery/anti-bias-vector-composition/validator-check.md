---
tags: [vault, discovery, multi-agent, validator, subagents-strategy, anti-bias, spec-lifecycle]
node_type: discovery
is_session: false
layer: ontology, application
nature: procedural
status: active
version: 0.4.0
last_updated: 2026-06-18
---

# Anti-Bias Vector Composition — Validator Check

> The **rationale** behind **Principle 5 (pairwise tension)** of the subagents-strategy
> constitution: *why* each tension test exists and *why* enforcement is split the way it is.
> The **operational rubric itself** — the runnable tests applied at the confirm gate — is
> **owned by the `check-tension` skill** (see §Operational ownership below). This file no
> longer restates the runnable checklist; it explains it. The tension check is **additional**
> to the partition check ("angles non-overlapping AND covering" — see §Relationship to the
> partition check below).

> **v0.2.0 realignment note.** This file previously spoke the pre-v0.5.2 schema
> (`dispatch.yaml`, a `composition` block of **layers**, the retired `theorem-research`
> skill). v0.2.0 rewrites it to the v0.5.2 vocabulary: **`groups`** (not layers), group
> `role ∈ {investigate, evaluate, synthesize, meta-evaluate}`, agent
> `role ∈ {explorer, skeptic, writer, auditor}`, the per-group **`anti_bias`** axis, the
> per-agent **`angle`**, and the dispatch-wide **`anti_bias_global`**. Siblings
> `examples.md` and `literature.md` still carry old-schema worked shapes — pending the same
> pass. `principle.md` is realigned alongside this file.

> **v0.3.0 — post-dispatch realization removed (2026-06-15).** Anti-bias is now enforced
> **only at initialization** (the pre-dispatch Tests 1–4 below). The former post-dispatch
> "tension realization" checklist (Items 9–12) and the `Dissent:`-line / claim-ID contract it
> rested on are **retired**: self-declared per-agent dissent proved forgeable and fragile, and
> a flat parallel round cannot produce cross-citation by construction. The guarantee is that
> agents are tensioned **by design**, checked at the confirm gate; substance is not policed
> after the fact. The `Dissent:`-line element of the
> `agents-input-output` discovery is thereby superseded (that discovery's broader I/O
> contract — envelope, claim-IDs, anchors, verbatim, the P9 6-item checklist — stands); see
> its v1.1.0 note.

> **v0.4.0 — operational ownership moved to the `check-tension` skill (2026-06-18).** The
> runnable four-test + cross-group rubric previously spelled out here is now **owned inline by
> the `check-tension` skill**, so that skill is self-contained and never points into the vault
> to run. This file keeps only the *why* — the enforcement split, the per-test rationale, the
> partition distinction, the lineage. Single operational source of truth = the skill; this
> discovery is its rationale. The constitution names the skill as operational owner.

---

## Where the check lives (enforcement split)

Principle 5 has two halves, enforced in two different places — do not conflate them:

| Half | What | Enforced by | Failure mode |
|------|------|-------------|--------------|
| **Presence conditionals** | group `anti_bias` is present at `n ≥ 2`; `anti_bias_global` is present when ≥ 2 groups have `n ≥ 2` | **appender** (`append-dispatch.cjs`), mechanically, **exit 2** | record rejected at registration |
| **Tests 1–4** (axis / clone / spread / evidence) | the substance — is the axis real, are the angles distinct, is genuine disagreement pre-registered | **the `check-tension` gate** — two independent agents, before the human confirm | sheet returned to the strategist for revision |

The appender guarantees the **fields exist**; it does not judge whether they are *meaningful*.
That judgment is the tension tests, checked at the confirm gate — the `check-tension` skill
owns the runnable rubric; this file explains it.

---

## When the check runs

**One** point in the dispatch lifecycle (constitution §3): **pre-dispatch (strict), at the
confirm gate.** After the strategist authors the sheet and before the human's affirmative /
before the dispatch row is appended. Failure blocks the dispatch — the sheet must be revised
and re-gated (P2). There is **no post-dispatch anti-bias check**: the guarantee is that the
agents are tensioned **by design at initialization**, not that disagreement is policed after
the fact.

---

## Operational ownership — the runnable tests live in the skill

The runnable rubric — the closed axis vocabulary, the per-group tests (axis / clone / spread /
evidence) and the cross-group coherence check, each with its REJECT rule — is **owned by the
`check-tension` skill**, applied by its two independent agents at the confirm gate. This file
does **not** restate those rules (that duplication is exactly what drifts); it records *why*
each test earns its place:

- **Axis** — forces `anti_bias` to name a real tension dimension, not a vague label. Without a
  named axis there is no direction along which a bias term can be cancelled
  (`principle.md` §"Distinction from diversity").
- **Clone** — kills angles that differ only in vocabulary. Two paraphrases of one approach
  share one blind spot: diverse on the surface, untensioned underneath.
- **Spread** — stops a whole group collapsing onto one methodology/corpus (explorers) or one
  attack-vector (skeptics). A monoculture reproduces its bias at full strength under
  averaging (`principle.md` §"Why this matters"; Krogh-Vedelsby).
- **Evidence** (the predicted-disagreement sentence per pair) — the load-bearing one. Writing
  *what bias in a_i would be exposed by a_j* is what forces the strategist to design genuine
  tension rather than assert it, and gives the reviewer something concrete to check.
- **Cross-group coherence** — keeps per-group axes as specializations of one dispatch-wide
  theme, so multiple fanned-out groups do not drift apart (constitution §5).

The canonical axis vocabulary (methodology / source-corpus / attack-vector / temporal-prior)
is constitutional (P5 closed vocabulary); the skill applies it. See `principle.md` for the
vector-composition argument these tests operationalize.

---

## Relationship to the partition check

The `domainspec-subagents-strategy` chain already checks two conditions on a group's angle set:

- **Non-overlapping.** No two agents investigate the same *concern*.
- **Covering.** Together the angles span the macro goal — no part is unaddressed.

These are **partition** conditions: *which subset of the goal each angle covers*. They do not
ask *which direction each angle points within its subset*. Tensioned-pairwise is strictly
stronger: a group can pass non-overlapping-and-covering and fail tension — four explorers
partitioning the goal into four disjoint sub-questions, each using the same arXiv-keyword
methodology. Clean partition, complete coverage, uncancelled bias term. The gate runs **both**:
partition first, then tension (this file). A sheet must pass both to be dispatched.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [principle.md](./principle.md) | `derives-from` | The principle this validator operationalizes. Tests R (Items 4–6) enforce its negative form; tests G (Items 7–8) its positive form. |
| [literature.md](./literature.md) | `cites` | Adversarial-collaboration and groupthink lineage behind the tensioning requirement (Mill, Kahneman-Klein, Hong-Page). (Old-schema worked shapes pending realignment.) |
| [examples.md](./examples.md) | `instances` | Worked good/bad group shapes that exercise these tests. (Pending v0.5.2 realignment.) |
| `.claude/skills/check-tension/SKILL.md` | `operationalized-by` | The skill that **owns the runnable rubric** (axis vocabulary + four tests + cross-group coherence) and applies it at the confirm gate. This discovery is its rationale; the skill does not depend on this file to run. |
| `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` | `operationalized-by` ↔ | Constitution §P5 names the `check-tension` skill as the operational owner of the four-test rule and this discovery as its rationale. The constitution owns the enforcement split (appender vs gate). |
