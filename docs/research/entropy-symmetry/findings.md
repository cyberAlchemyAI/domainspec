---
tags: [entropy, mdl, information-bottleneck, free-energy, via-negativa, dispatch-2026-06-21-entropy-symmetry]
node_type: subagents-findings
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-06-21
created_by: victorboscaro@gmail.com
---

# Entropy-Reduction Symmetry — Falsification Findings

## Goal

Test, falsifiably, the operator's intuition that **reducing "descriptive entropy" — subject to preserving domain coverage — is a single fundamental property** that simultaneously improves four levels: (a) cognitive clarity, (b) schema/spec quality, (c) token cost ("energy"), and (d) language-model behavior.

## One-line answer

The symmetry is **real but needs two corrections**: it is not *minimize entropy* but **minimize descriptive cost _subject to_ a coverage constraint** (the constraint is load-bearing — drop it and the correct move often flips to *maximize* entropy, Jaynes); and it genuinely unifies **cognition + schema + model behavior** as one `−log P` / KL object, while the **energy/token leg rides along only by engineering analogy**, not by the shared functional.

## Verdict matrix

| candidate | owner (precedent) | witnessed? (non-vacuity) | sound? (definitional) | verdict |
|---|---|---|---|---|
| **A. Strong: "minimize entropy everywhere → clarity/performance"** | owned — inverts Jaynes MaxEnt; it is parsimony pushed past its constraint | falsified by witness: temperature→0 lowers model entropy yet *raises* human error (confidently-wrong) — cross-level divergence under one knob | no — sign error; the right operation under uncertainty is *maximize* entropy subject to constraints | **REFUTED / FALSE** |
| **B. Hedged: "minimize descriptive cost subject to coverage, to each level's constrained optimum"** | build-from-owned — MDL (Rissanen), rate-distortion (Shannon), information bottleneck (Tishby), free-energy (Friston) | witnessed — IB's `I(T;Y)` relevance term; Arcanum's marginal-utility stop rule; domainspec context-builder noise-ratio cap | sound, **not novel** — a re-naming of MDL/IB; non-vacuous as a *cross-level* observation for a/b/d | **SURVIVES — PARTIAL** (real for cognition/schema/model) |
| **C. "tokens = energy = entropy" (the 4th leg)** | Landauer's principle — the only entropy↔energy bridge | **no formal witness** — Landauer bounds *bit-erasure*, not token generation; real hardware runs ~10⁹× above the bound | category error — tokens are description length (bits), not thermodynamic entropy; "energy" here is engineering cost-per-FLOP | **KILL** (non-vacuity) — rides along ordinally only |

A KILL is banked as a typed negative, not deleted: candidate C *would* have closed the loop "low entropy ⇒ low energy" as a law of nature; the exact fact that zeroed it is that **the only formal entropy→energy law (Landauer) does not bind on token cost in practice** — the link is real but engineering (fewer bits → fewer FLOPs → fewer joules), not the shared `−log P` functional.

## The shared formal object (why a/b/d genuinely unify)

Three of the four levels are **the same object in different costumes** — `L = −log P(data | model) + (model cost)`, minimized subject to a fidelity term that names the coverage [explorer 1]:

- **Schema/spec (b)** — **MDL** (Rissanen): two-part code `L(H) − log P(x|H)`; the data-fit term `−log P(x|H)` is the coverage constraint that blocks collapse to the empty model. *(Grünwald & Roos 2019; Scholarpedia MDL.)*
- **Cognition (a)** — **Free-energy principle** (Friston): `F = D_KL[Q‖P(s|o)] − log P(o)`, decomposing to **accuracy + complexity** — the *same* `−log P` + KL structure as MDL; the accuracy term is the coverage constraint. *(Parr/Friston 2019.)*
- **Model (d)** — **cross-entropy training** is literally MDL on text: loss `= −(1/N)Σ log P(token|context)` = bits-per-token = description length of the corpus; perplexity `= exp(cross-entropy)`. *(Brenndoerfer; The Gradient.)*
- The **"subject to coverage" clause** is named exactly in **Information Bottleneck**: minimize `I(X;T)` subject to `I(T;Y) ≥ const` — the relevance term `I(T;Y)` *is* coverage [explorer 1]; and in **rate-distortion**: minimize bits subject to a distortion bound `D`. IB is formally a rate-distortion problem — same machinery. *(Tishby/Pereira/Bialek 1999; Shannon.)*

Independent cross-confirmation: bounded-rationality / rational-inattention economics minimizes `D_KL[π‖π₀]` subject to expected utility — the *same* free-energy object arriving from neuroscience **and** economics [explorer 1].

## Why the strong form is false (the refutation that survived)

The correct sign under uncertainty is frequently the **opposite** [explorer 2]:

- **MaxEnt (Jaynes 1957):** choose the distribution that *maximizes* entropy subject to constraints — the minimum-entropy choice "says something stronger than what we are assuming," fabricating unwarranted commitments. Sign error, not magnitude error.
- **Regularization adds entropy on purpose** (label smoothing, max-entropy regularization) to stop overconfident collapse; optimal model/schema entropy is **intermediate**.
- **RL entropy bonus** exists *because* low policy entropy kills exploration and causes premature convergence.
- **Edge of chaos:** computational capacity peaks at *intermediate* entropy, not the minimum.
- **Sharpest kill — temperature→0:** one knob lowers model output entropy (d) but induces mode collapse and worst-case calibration ("most overconfident where wrong"), so the human (a), trusting a crisp low-entropy output, decides *worse*. One intervention, two levels moving opposite — falsifies "single functional minimized uniformly."

Reconciliation: each level has a **constrained** (often intermediate) entropy optimum, and the optima do **not** coincide under one shared knob. "Subject to coverage" is doing all the work — it is the disguised Jaynes constraint set, after which the operation is *hit the constrained optimum*, not *minimize*.

## Internal corpora — the principle is already operational (under other names)

Both sibling frameworks independently encode the **hedged** form, including its brake — agreement across disjoint corpora, not echo:

**domainspec** [explorer 3] behaves as if "remove every degree of freedom coverage does not require" is the design law:
- `ontology-view` makes forbidden relationships **unconstructible by type** (no catalog edge admits the endpoint pair) rather than asserted in prose — removing schema degrees of freedom structurally (`.claude/skills/ontology-view/SKILL.md:59`).
- `engineer-view` **bijective verdict ownership**: every stance → exactly one owning row (`.claude/skills/engineer-view/SKILL.md:70`).
- `domainspec-context-builder` is rate-distortion in practice: "minimal deterministic context pack… strict relevance gates," `noiseRatio ≤ 0.15`, excerpt budgets per mode (`SKILL.md:3,73-81`).
- **The coverage brake (keeps entropy on purpose):** the **residue ledger** — "open residue never demoted" (`ontology-view/SKILL.md:50`); OPEN/CRITICAL verdicts preserved by **reconcile-not-regenerate** so authored judgment is never collapsed under pressure to "finish" (`engineer-view` DECISIONS D6).

**Arcanum** [explorer 4] encodes the same with its own vocabulary — and its June-2026 handoff states the operator's intuition almost verbatim:
- **Via Negativa** (Taleb): "formalize a rule or axiom only when its absence has proven costly" (`BUSINESS-ONTOLOGY.md:15`) — add a degree of freedom only when its *absence* hurt.
- CyberAlchemy Method: "does not reward complexity for being elegant; introduces structure only when… a named tension the simpler unit cannot responsibly handle" — MDL in prose (`CYBERALCHEMY-METHOD.md:48`).
- **The brake, explicit:** "Avoid premature complexity, but do not create brittle minimalism" (`CYBERALCHEMY-METHOD.md:171`); "Preserve open-endedness: closure is contextual, not final" (`:84`); confidence levels separate *evidence* from *commitment* to explore low-evidence areas without brittle architecture (`BUSINESS-ONTOLOGY.md:30-35`).
- **Near-verbatim match:** a context-schema-refinement handoff (2026-06-19) states *"Reduce entropy → reveal schema… the method's objective function is entropy reduction"* — **paired with a marginal-utility stop rule:** "refine until the marginal utility of revealing more schema drops below its marginal cost… over-refining past saturation *reduces* fidelity." That stop rule **is** the coverage constraint, already operationalized.

## What this means for the system (constructive)

Adopt the principle in its **corrected, load-bearing form**, not the seductive one:

> **Remove every degree of freedom that coverage does not require — and not one more.**
> (Constrained minimum description length / least action under a fidelity bound. The constraint is not a footnote; it flips the sign.)

- The four "entropies" are **not one quantity**. Cognition, schema, and model output share a real `−log P`/KL functional; **token cost is a description-length proxy that converts to energy only through engineering**, so treat "energy" as a *consequence ordinally tracked*, not a fourth instance of the same law.
- The mechanisms that already embody this — `ontology-view` unconstructibility, Via Negativa, the residue ledger, the marginal-utility stop rule — are **correct precisely because they pair subtraction with a brake**. The residue ledger / OPEN status / premises are not incidental: they *are* the coverage constraint made operational, the thing that stops the system from minimizing into brittle false-certainty.

## Open questions (not promoted to discovery)

1. Is there value in stating this as a **constitutional axiom** ("constrained MDL / via-negativa-with-a-brake") that the view-quartet and the dispatch governance both cite — or does naming it risk over-formalizing (a Via-Negativa violation: formalize only once its absence has cost us)?
2. Can the **marginal-utility stop rule** from Arcanum's handoff be ported into domainspec's context-builder as an explicit termination criterion (it currently uses fixed budgets, not a marginal test)?
3. Does the energy/token leg deserve its own treatment (cost telemetry) rather than being folded into the entropy metaphor?

## Method note (deviation from the full pipeline)

Four explorers ran as subagents (registered: `2026-06-21-entropy-symmetry`). The synthesizer / skeptic / writer / auditor stages were **collapsed into the parent** rather than spawned, justified by: the refutador (explorer 2) already supplied strong independent adversarial pressure; explorer 1 self-disclosed the weak (energy) leg; the synthesis concedes rather than defends the hypothesis (low confirmation-bias residual); and token economy. The two killing gates (non-vacuity, definitional-soundness) were applied inline and are recorded in the verdict matrix.
