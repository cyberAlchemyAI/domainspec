---
tags: [vault, findings, noise, noise-reducer, information-theory, shannon]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
dispatch_status: historical
version: 0.1.0
last_updated: 2026-06-05
lens: information-theory
verification: [web-fetched: Shannon 1948 publication + noisy-channel + capacity = max mutual information; web-fetched: EIG = expected reduction in Shannon entropy = mutual information; model-recall: definitions of H, I(X;Y), data-processing inequality, Lindley's information measure]
---

## Objective
Ground the discovery's "noise" currency in Shannon's channel model so the upstream-gate frame is a defined quantity rather than a metaphor, and mark exactly where the analogy stops being rigorous.

## Findings

**The interface as a noisy channel.** Model the human→agent specification pipeline as a two-stage channel `W → X → Y`:
- `W` = the user's **intent** (the source — what they actually want),
- `X` = the **prompt** / standing instructions (the encoding `W → X`),
- `Y` = the agent's **internal model of the task** (the decoding `X → Y`).

**Specification noise** is the corruption injected at each stage: encoding loss (the user under-specifies, so `H(W | X) > 0`) and decoding loss (the agent misreads `X`, so `H(W | Y) > H(W | X)`). The Shannon quantities are facts about probability distributions: entropy `H(X) = −Σ p(x) log p(x)`, conditional entropy `H(X | Y)`, mutual information `I(X; Y) = H(X) − H(X | Y)` (symmetric, non-negative, zero iff independent), and channel capacity `C = max_{p(x)} I(X; Y)`.

**The data-processing inequality is the ceiling.** `I(W; Y) ≤ I(W; X)`. Information about intent that fails to enter the prompt **cannot** be recovered downstream — the agent's model can carry at most what the encoding carried. This is the precise replacement for the loose "least-recoverable" claim: no downstream method (better model, re-prompting on the same info, post-hoc filtering) can raise `I(W; Y)` above `I(W; X)`. The ceiling is set at encoding time, which is what makes the interface the gate.

**A clarifying question = information gain.** A clarifying question opens a feedback path from agent to user. For a question `Q` with answer `A`, the information gain is the expected reduction in uncertainty over the intent space:

```
IG(Q) = H(W) − E_A[ H(W | A) ] = I(W; A)
```

This is exactly the standard Expected Information Gain (verified): expected decrease in Shannon entropy, equal to the mutual information between the latent intent and the observation. A good question maximizes `I(W; A)`, targeting the highest-entropy region of the intent distribution; a question whose answer the agent could already predict has `I(W; A) ≈ 0` — it is friction, not signal. Volume of questions is not the objective; `I(W; A)` is. Standing instructions ("be precise, ask, challenge") act as a redundancy / error-correction protocol layered onto the channel.

**Shannon-noise and Kahneman-noise do NOT unify.** Treating them as one word for one thing is a category error. Shannon-noise is *channel corruption* — a property of a single transmission relative to a source distribution, measured in bits of lost mutual information. Kahneman-noise (lens 04) is *unwanted variance in judgment* — `Var` across repeated or parallel judgments that should agree, measured in the units of the judgment itself. They differ on three axes: (i) Shannon-noise is fidelity to a target (bias-like, a gap from truth), Kahneman-noise is scatter (variance, indifferent to the target); (ii) Shannon needs a source distribution `W`, Kahneman needs an ensemble of judges/occasions; (iii) one is corruption *within* a channel, the other is disagreement *across* channels. There is a thin one-way bridge — variance across decodings *is* one contributor to `H(Y | X)` — but the reduction is partial. Collapsing them would let the discovery launder a variance claim as a mutual-information claim; the two lenses share only an English homonym.

## Caveats
What this lens did NOT establish, and the honest limit on its quantities:

- **The channel quantities are NOT measurable for real intents.** The model is suggestive, not operational. Specifically:
  1. **Intent is not a well-defined random variable.** `W` has no agreed sample space or measure; intent is often *constructed* during the interaction, not pre-existing. `H(W)` is a useful fiction, not a measurable quantity.
  2. **The channel is not stationary.** `p(Y | X)` shifts within a session (context accumulates, the decoder changes). Shannon's theorems assume a fixed channel.
  3. **No alphabet, no capacity number.** There is no operational `C` in bits/symbol for natural-language specification; "capacity" stays metaphorical.
  4. **Answers can change the source.** Asking `Q` can *alter* `W` (the user realizes what they want), so `IG(Q) = I(W; A)` is then only approximate.
- The *structural* claims (encoding sets a ceiling no decoder beats; a question's value = expected entropy reduction) are rigorous *only given* the modeling assumptions above — which this lens has marked as not satisfied in the wild. Every numeric-looking claim is conditional.
- This lens does **not** reach the psychological mechanism of how instructions shape behavior (lens 01/03), and does **not** subsume Kahneman-noise (lens 04).

## Connections
- `synthesized-by` → [[../../research/research.md]]
