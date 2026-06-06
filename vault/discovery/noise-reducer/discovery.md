---
tags: [vault, discovery, noise, human-agent-interface, sycophancy, calibration]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
version: 0.2.0
last_updated: 2026-06-05
---

# Noise Reducer

> **Post-hoc alignment note (v0.2.0).** This discovery was first drafted at v0.1.0 in a *knowledge-finding* framing — it led with a Claim/Status/Summary structure asking whether the human–agent interface is the "first, least-recoverable noise gate," and demoted its own headline when its skeptic lens showed the conjunction was already owned. v0.2.0 recasts it into the **feature-discovery** format per `lens-research-discovery-layout.md`; the `research/` layer now sits beneath it as the load-bearing input. The substance is preserved — the same six lenses, the same surviving residues, the same scope-fence — but the framing is now *what we are refining in the agent's standing-instruction layer and why*, not *is this a finding*. The "first, least-recoverable gate" headline is acknowledged here as **DEMOTED by lens 06**: it is owned prior art plus an over-claim, and is replaced by the data-processing-inequality ceiling form.

## Objective

Refine the agent's standing-instruction layer — the system prompt / `CLAUDE.md`, **not** memory (which is non-binding recalled context) — so it reduces specification noise at the human→agent interface. The end state: an explicit external-referent anti-sycophancy rule, a typed noise vocabulary that holds Shannon-noise and Kahneman-noise distinct, and a stated scope-fence on what standing instructions cannot fix.

## 1. Business Context

### Why now

A `research`-skill / agent-behavior refinement is in flight, and the partner-mandate it leans on already exists — `domainspec-theorem/CLAUDE.md` opens with "partner, not executor," Radical Candor as baseline, and the four Stop-and-Question triggers. But that mandate is stated as **etiquette / disposition**, not as a mechanism defended against the specific failure mode it is exposed to (sycophancy). Before the refinement commits to new standing-instruction text, it needs a grounded statement of exactly where the disposition is mechanically undefended.

### What's broken

These are disposition/framing gaps, not code defects with line numbers — marked honestly as such:

- **(a) No mechanistic anti-sycophancy anchor.** `domainspec-theorem/CLAUDE.md` (line ~3) states Radical Candor as a *disposition*. Lens 03 shows the noise-filter and the noise-injector are **one channel sharing weights**, so an instruction to "help reach the best (business-defined) outcome" is, to first order, an RLHF gradient toward *agreement* — "best outcome" is unobservable at inference while "user satisfied this turn" is the trained proxy. The mandate is self-undermining unless anchored to an external referent.
- **(b) Noise vocabulary risks a category error.** Any "noise-tracking" frame that treats "noise" as one quantity conflates **Shannon-noise** (channel corruption against a known transmitted signal) with **Kahneman-noise** (unwanted variability across judgments needing no ground-truth). Lenses 04 and 05 independently forbid the unification; conflating them launders a variance claim as a mutual-information claim.
- **(c) The headline "first, least-recoverable gate" is inflated.** Lens 06: three of the four clauses are owned (Horvitz mixed-initiative; Kim Scott Radical Candor — already cited in `CLAUDE.md`; the RLHF-sycophancy literature; Boehm on late-defect cost), and the conjunction is already operationalized by `CLAUDE.md`'s triggers. "Least-recoverable" specifically overstates the data-processing-inequality ceiling: `I(W;Y) ≤ I(W;X)` sets a *ceiling*, not irrecoverability — and the vault's own `anti-bias-vector-composition` is a live downstream-recovery counterexample.

### What stays the same

Explicit scope boundary — this refinement does **not**:

- **Rewrite the existing partner-mandate text or Stop-and-Question triggers** in `domainspec-theorem/CLAUDE.md`. They stand; we add a mechanistic anchor beneath them, we do not restate or replace them.
- **Touch the anti-bias principle** (`../anti-bias-vector-composition/`). It is the cited downstream-recovery layer; we cite it, we do not re-derive it.
- **Re-derive the four-role epistemic model** or any of the dispatch machinery the sibling discovery governs.

## 2. Core Concepts

- **The human→agent interface as a noisy channel (cited premise, not novel).** Lens 05 reads the interface as a Shannon channel `W → X → Y` — latent intent `W`, encoded utterance `X`, decoded spec `Y`. This is a borrowed frame, not a contribution; it supplies the algebra the demoted headline is restated in.
- **The sycophancy paradox + external-referent defense (load-bearing surviving contribution).** Lens 03: the noise-reducer mandate and the noise-injector are the same channel, the sign flipping on whether the gradient points at correctness or approval — and they share parameters, so you cannot disable one without touching the other. The structural defense is to bind every challenge to an **external referent the user did not supply** (a build result, a citation, a collapse-test) so user-approval stops being the reachable maximum. This is the dispatch's actual residue, absent from the owned prior art as applied to a standing-instruction agentic gate.
- **Typed noise — Shannon-noise ≠ Kahneman-noise (lenses 04/05).** Two distinct objects sharing one English word. Only the *psychological* (Kahneman) reading licenses the **upstream-gate** claim — at the interface no fully-formed spec is in transit, so what the gate reduces is judgment *variability*. The Shannon reading licenses only the downstream relay stages. Keeping them typed-distinct is the discipline that prevents the frame from equivocating.
- **The data-processing-inequality ceiling (the demoted replacement for "least-recoverable").** `I(W;Y) ≤ I(W;X)`: information about intent that never entered the encoding cannot be recovered by any downstream method *on the same information*. This is a ceiling set at encoding time, not impossibility — fully compatible with the anti-bias counterexample, which recovers by adding *new* information rather than raising `I(W;Y)` on the old.

## 3. Detailed Specifications — Decisions & Open Questions

### D-1 — Adopt the external-referent anti-sycophancy rule (decided)

A challenge from the agent is **load-bearing only when anchored to a referent the user did not supply** — a build result, a citation, a collapse-test. Rationale: direct derivation from lens 03's sycophancy paradox; the repo's existing `subset rule` and `cite-don't-rediscover` already instantiate this pattern — D-1 names the mechanism behind them rather than introducing a new rule. Decided because it is the surviving load-bearing contribution and is a derivation, not a contested option.

### D-2 — Hold Shannon-noise and Kahneman-noise typed-distinct (decided)

Any noise vocabulary in the standing layer keeps the two readings typed-distinct; the upstream-gate claim rests **only** on the psychological (Kahneman) reading. Rationale: category discipline at no epistemic cost — lenses 04 and 05 agree and both flag the conflation as a category error. Decided because it is a typing convention, reversible at zero cost.

### D-3 — Replace "least-recoverable" with the DPI-ceiling form (decided)

The headline word "least-recoverable" is retired in favor of `I(W;Y) ≤ I(W;X)` — a ceiling on recoverable intent-fidelity set at encoding time. Rationale: it is the precise claim the formalism supports; the inflated form is refuted by `anti-bias-vector-composition` acting as a downstream recovery layer. Decided because lens 05 supplies the exact replacement and lens 06 falsifies the original.

### OQ-1 — Discovery or premise?

Are the surviving residues a *discovery*, or a *premise* attached to `CLAUDE.md`'s partner-mandate? **Recommendation:** likely a premise on the partner-mandate — but the sycophancy-paradox mechanism (D-1) may clear the discovery bar on its own. If reduced to only the cite-bundle, demote to a premise/note.

### OQ-2 — "Most fundamental" collapse-test

Is the project's error budget actually *question-dominated*? The placement holds only if specification error is the dominant term. **Recommendation:** run an error-budget trace — classify past failures by noise source — before treating the interface as the highest-leverage stage. If most bad outcomes trace to downstream execution, the upstream-gate placement collapses. Marked open, not asserted.

### OQ-3 — Can the external-referent rule be a checkable standing instruction?

Can "every challenge cites a user-independent referent" be operationalized into a verifiable predicate, or does it collapse into the existing `cite-don't-rediscover` rule? **Recommendation:** draft it and test for redundancy — and check whether a model can sycophantically *agree to* the rule and then ignore it (lens 03's stated failure mode). No claim of neutralization without measurement.

## Connections

| Document | Type | Description |
|---|---|---|
| `research/research.md` | `derives-from` | The cross-lens synthesis (canonical) this discovery's commitments stand on. |
| `lenses/01-mixed-initiative-hci/findings.md` | `derives-from` | Horvitz two-threshold ask rule; asking is a priced move. |
| `lenses/02-requirements-ambiguity/findings.md` | `derives-from` | Economics of upstream ambiguity; only Boehm's *direction* survives. |
| `lenses/03-llm-sycophancy/findings.md` | `derives-from` | The sycophancy paradox + external-referent defense (load-bearing residue). |
| `lenses/04-judgment-noise-kahneman/findings.md` | `derives-from` | Kahneman-noise as judgment variability; not Shannon-noise. |
| `lenses/05-information-theory/findings.md` | `derives-from` | Interface as noisy channel; the `I(W;Y) ≤ I(W;X)` ceiling. |
| `lenses/06-skeptic/findings.md` | `derives-from` | Precedent-kill + the "least-recoverable" over-claim; forces the demotion. |
| `../anti-bias-vector-composition/principle.md` | `cites` | The owned downstream-recovery layer that refutes "least-recoverable"; cited, not re-derived. |
| `../subagents-topologies/discovery.md` | `relates-to` | Sibling dispatch; same demotion pattern (skeptic kills the headline, residue survives). |
| `domainspec-theorem/CLAUDE.md` | `relates-to` | The existing partner-mandate this discovery anchors mechanistically. |
