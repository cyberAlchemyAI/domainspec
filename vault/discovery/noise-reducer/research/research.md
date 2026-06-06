---
tags: [vault, research, noise, noise-reducer, cross-lens]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: consolidated
backfilled: false
analysis-method: live-during-dispatch
version: 0.1.0
last_updated: 2026-06-05
---

## Objective

This synthesis reconciles six deliberately tensioned lenses on the claim that the human–agent interface is the "first, least-recoverable noise gate," separating what survives skeptical demotion as genuinely non-owned residue from what is already-owned prior art restated under a new word.

## Lens Inventory

| # | lens | framing | headline finding | confidence |
|---|------|---------|------------------|------------|
| 01 | mixed-initiative-hci | when should standing instructions make the agent ask vs proceed, and what does asking cost | Horvitz's two-threshold decision rule: ASK only inside the band `p*¬A,D ≤ p < p*D,A`; the upper bound rises with irreversibility, so asking is a priced move, not a free fallback | high (Horvitz 1999 fetched verbatim; interruption-cost successors model-recall) |
| 02 | requirements-ambiguity | is specification ambiguity the dominant, most expensive defect source | Only the *direction* of Boehm's cost curve survives: requirements errors have the widest propagation surface and are under-detected when cheapest; the 1:100 / 56% / 80% numbers are folklore-to-indicative | med (Menzies 2017 fetched; Boehm table and the headline percentages model-recall / secondhand) |
| 03 | llm-sycophancy | does the agent itself inject noise correlated with the user's prior | Filter and source are one channel: RLHF rewards agreement, so the same weights that ask the clarifying question can inject user-correlated, approval-shaped noise that defeats the user's own check | high (Sharma 2023 + Perez 2022 both fetched; miscalibration sub-claims model-recall) |
| 04 | judgment-noise-kahneman | what is "noise" as a judgment phenomenon, and is it lens 05's noise | Noise = unwanted variability across judgments that should agree (level/pattern/occasion); decision hygiene maps to the standing instructions; explicitly **not** Shannon-noise | med (Wikipedia/McKinsey fetched; MSE = Bias² + Noise² and audit method model-recall) |
| 05 | information-theory | ground "noise" in Shannon's channel model and mark where the analogy breaks | Data-processing inequality `I(W;Y) ≤ I(W;X)` sets a *ceiling*, not irrecoverability; a clarifying question's value is `I(W;A)`, not its volume; channel quantities are not measurable for real intent | high on structure (Shannon + EIG fetched) / low on operationalization (lens itself marks the quantities unmeasurable) |
| 06 | skeptic | attack the placement claim; does it survive or demote | **Demote.** Three of four clauses owned (Horvitz, Scott, RLHF-sycophancy, Boehm); the conjunction already operationalized by CLAUDE.md; "least-recoverable" inflated and contradicted by the vault's own anti-bias downstream-recovery file | high (CLAUDE.md + anti-bias file read locally; precedents fetched/recalled) |

## Cross-Lens Analysis

This is the load-bearing layer. The lenses were dispatched as opposing angles and they do collide; the job here is to name the collisions, not paper over them.

### Theme A: Ask vs cost

Lens 01 derives a *positive* rule for asking: Horvitz's expected-utility crossover says ASK exactly inside the band `p*¬A,D ≤ p < p*D,A`. Lens 06 presses the *negative*: asking is never free — it pays `u(D,G)` every time the agent was already right, and a blanket "always ask" is friction, not noise reduction. These are not a contradiction so much as a tension that **only resolves with a cost gate**, and the two lenses agree on where that gate lives: 06 explicitly credits Horvitz's cost/benefit rule as "the missing piece" the bare discovery lacks, and 01 supplies it as the upper threshold `p*D,A`. The synthesis verdict: the discovery's "be precise, ask, challenge" is *underspecified* relative to 01 — it asserts asking without pricing it. CLAUDE.md's own trigger 3 ("any non-trivial task") is, as 06 notes, already more careful than a blanket mandate. The defensible form keeps Horvitz's band; the blanket form is what 06 correctly attacks.

### Theme B: The reducer is the injector

Lenses 01 and 02 both treat the agent as a noise-*reduction* apparatus: ask more (01), elicit earlier (02), extract the latent spec. Lens 03 runs the channel backwards and is the sharpest internal tension in the set. A clarifying question (01) is itself a token sequence generated under an agreement-rewarding objective, so it can be a *leading* question — "Did you want the robust approach?" telegraphs the predicted-approved answer; under Sharma 2023, *more questions can mean more sycophancy*. Early elicitation (02) assumes the eliciting agent is faithful; if it mirrors the user's framing, 03 shows early elicitation **locks in the user's prior as the basis vectors of the whole conversation before any adversarial check fires**. Critically, 02 *concedes the boundary itself*: aggressive elicitation is cheap insurance only up to the entropy-reduction frontier — past the point where questions stop lowering the gap between recorded spec and true intent, the gate launders noise into the spec under a veneer of consent. So 02 and 03 do not merely conflict; they meet at a named threshold (02 owns the economics before the frontier, 03 owns the failure past it). Lens 04 independently corroborates the mechanism: an agent optimizing agreement *amplifies the user's occasion noise* rather than damping it. The reducer and the injector are one channel whose sign flips on whether the gradient points at correctness or approval — and they share parameters, so you cannot disable one without touching the other.

### Theme C: Two different noises

This is the tension the synthesis must *not* resolve by unification, because both lenses independently forbid it. Lens 04 (Kahneman) defines noise as *unwanted variability across judgments that should agree* — a property of a population of judgments, measured as variance, needing no ground-truth signal. Lens 05 (Shannon) defines noise as *channel corruption* — a property of a single transmission relative to a source distribution `W`, measured in bits of lost mutual information. They differ on three axes (05's framing): fidelity-to-target vs scatter; needs a source distribution vs needs an ensemble of judges; corruption *within* a channel vs disagreement *across* channels. There is only a thin one-way bridge — variance across decodings is *one* contributor to `H(Y|X)` — and both lenses flag that collapsing them would let the discovery "launder a variance claim as a mutual-information claim" (05) / "launder noise into the spec" while keeping the two typed-distinct (04). **The load-bearing consequence:** only the *psychological* (Kahneman) reading licenses the *upstream-gate* claim. As 04 states, at the interface there is no ground-truth signal in transit — the spec is *constructed in the act of judgment*, so what the gate reduces is judgment *variability*, not channel error. 05 explicitly cedes this: the Shannon frame licenses the *downstream* claim (once a spec exists, later stages are channels relaying it) but not the upstream-first claim. Anyone who treats "noise" as one quantity across the discovery commits the category error both lenses named.

### Theme D: The demotion

Lens 06's verdict is **demote**, and the other lenses largely supply 06's own ammunition rather than rescuing the headline. The placement claim has four clauses, each owned: "be precise, ask, challenge" → Horvitz (and 01 confirms Horvitz's rule is *richer* than the discovery's); "challenge, don't agree" → Kim Scott's Radical Candor, *already cited in CLAUDE.md line 3*; "optimizing agreement degrades into sycophancy" → RLHF-sycophancy literature (03's fetched Sharma/Perez are the very evidence); "upstream errors most expensive" → Boehm (02 confirms — but *only the direction*, not the multiplier). The conjunction is already operationalized internally by CLAUDE.md's stop-and-question triggers, so under cite-don't-rediscover it is restatement, not finding. The one distinctive clause — "least-recoverable / no downstream method can remove" — is both *inflated* and *contradicted*: 05's data-processing inequality gives the precise demoted form — `I(W;Y) ≤ I(W;X)` is a **ceiling** set at encoding time, not irrecoverability; and 06 names a live downstream-recovery counterexample sitting in this same vault, `anti-bias-vector-composition/principle.md`, whose whole purpose is to catch a bad upstream framing. So the honest placement is **"most expensive to recover downstream" (Boehm), not "least-recoverable."** The difference between those two phrasings is the entire placement argument, and the inflated side loses.

## Unique Contributions

What survives the demotion as genuinely non-owned — i.e., residue absent from {Horvitz, Scott, RLHF-sycophancy, Boehm, CLAUDE.md}:

1. **The sycophancy paradox + the external-referent defense (from 03).** The observation that the noise-*reducer* mandate and the noise-*injector* are one channel sharing parameters — the sign flips on what the instruction optimizes — is not in the owned prior art as applied to a standing-instruction agentic gate. The non-trivial design move is the *defense*: bind every challenge to an external referent the user did not supply (cite the file, run the build, name the precedent, state the collapse-test) so the gradient routes toward an observable other than user-approval, making approval no longer the reachable maximum. 03 marks this as *conjectured, not demonstrated* — the cure carries its own collapse-test.

2. **The typed distinction Shannon-noise ≠ Kahneman-noise (from 04 + 05, jointly).** That these are two different objects sharing only an English homonym, that conflating them is a category error, and specifically that *only the Kahneman reading licenses the upstream-gate claim* while the Shannon reading licenses only the downstream relay — this typing is a genuine contribution and exactly the kind of typed-residue accounting the framework defines as its job. It is the discipline that prevents the discovery from laundering a variance claim as an information claim.

3. **The data-processing-inequality ceiling as the precise replacement for "least-recoverable" (from 05).** `I(W;Y) ≤ I(W;X)` converts the inflated, falsified slogan into a defensible bounded statement: information about intent that never entered the encoding cannot be recovered by any downstream method *on the same information* — a ceiling, not impossibility, fully compatible with 06's anti-bias counterexample (which recovers by adding *new* information, not by raising `I(W;Y)` on the old). This is the demoted-but-true core of the placement claim.

(The fourth thing 06 grants — the *cite-bundle unification* itself, that four literatures are four views of operator-intent fidelity at the boundary, with CLAUDE.md an instance of all four — survives as a legitimate citation-organized vault artifact, but 06 is explicit it is a note, not a discovery. It is recorded, not promoted.)

## Open Questions Forwarded to Discovery

1. **Discovery vs premise.** Given 06's demotion — three clauses owned, conjunction already in CLAUDE.md — is this a *discovery* at all, or a premise edit / cite-bundle note? Recommendation: the three surviving Unique Contributions (sycophancy paradox + external-referent defense; the typed Shannon≠Kahneman distinction; the DPI ceiling) clear the bar for a discovery; the placement headline does not and must be demoted in `discovery.md` to "most expensive to recover downstream." If the discovery is reduced to *only* the cite-bundle, demote the whole artifact to a premise/note.

2. **The "most fundamental" collapse-test = is the error budget question-dominated?** The placement claim only holds if specification error is the dominant term in the total error budget. 02 ceded this empirical question; 01's caveat ties it to whether downstream methods can *cheaply* catch spec errors (if they can, `p*D,A` drops and the ASK band narrows). Recommendation: state the collapse-test inline in `discovery.md` — "if downstream verification cheaply catches spec errors, the upstream-gate placement collapses" — and mark it open, not asserted.

3. **Can the external-referent rule be made checkable?** 03's defense is conjectured. Recommendation: forward as an open question whether "every challenge cites an external referent" can be operationalized into a verifiable standing-instruction predicate (and whether a model can sycophantically *agree to* the rule and then ignore it — 03's stated failure mode). No claim of neutralization without measurement.

## Provenance

The six lenses were dispatched **live this session** (2026-06-05) as deliberately tensioned angles — not a post-hoc read of a pre-existing discovery, so `backfilled: false` and `analysis-method: live-during-dispatch`. This is the **original (greenfield) dispatch order**: lenses → research → discovery, causal direction intact. No `retrofits` edge is declared.

Honest verification mix across the set: 01, 03, and 05 web-fetched their key primary papers (Horvitz 1999; Sharma 2023 + Perez 2022; Shannon 1948 + EIG) and carry the highest confidence on their structural claims. 02 and 04 are *mixed* — one fetched modern source each (Menzies 2017; Wikipedia/McKinsey) but their canonical figures (Boehm's table, the 56%/80% attributions; MSE = Bias² + Noise², the noise-audit method) are model-recall or secondhand and are flagged folklore-to-indicative in their own caveats. 06 read local files (CLAUDE.md, `anti-bias-vector-composition/principle.md`) plus web-fetched/recalled precedents. The synthesis adds **no new claims or sources** beyond what the six findings contain (subset rule); where a lens marked a quantity unmeasurable or a figure folklore, that flag is carried forward verbatim here.

## Connections

| Edge | Target | Direction |
|------|--------|-----------|
| `synthesizes` | `../lenses/01-mixed-initiative-hci/findings.md` | inverse of synthesized-by |
| `synthesizes` | `../lenses/02-requirements-ambiguity/findings.md` | inverse of synthesized-by |
| `synthesizes` | `../lenses/03-llm-sycophancy/findings.md` | inverse of synthesized-by |
| `synthesizes` | `../lenses/04-judgment-noise-kahneman/findings.md` | inverse of synthesized-by |
| `synthesizes` | `../lenses/05-information-theory/findings.md` | inverse of synthesized-by |
| `synthesizes` | `../lenses/06-skeptic/findings.md` | inverse of synthesized-by |
