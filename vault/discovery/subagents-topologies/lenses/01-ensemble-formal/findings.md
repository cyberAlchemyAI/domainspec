---
lens: ensemble-formal
date: 2026-06-05
dispatched_by: subagent (lens-01)
addresses: Ensemble-error decomposition shows the diversity/ambiguity term — disagreement on shared inputs along the solution-relevant axis — is what subtracts member error; count and surface variety enter only through that term, so they are orthogonal to calibration unless they raise tension.
sources:
  - "Krogh, A. & Vedelsby, J. (1995). Neural Network Ensembles, Cross Validation, and Active Learning. NIPS 7."
  - "Geman, S., Bienenstock, E. & Doursat, R. (1992). Neural Networks and the Bias/Variance Dilemma. Neural Computation 4(1)."
  - "Hong, L. & Page, S. E. (2004). Groups of diverse problem solvers can outperform groups of high-ability problem solvers. PNAS 101(46)."
  - "Brown, G., Wyatt, J., Harris, R. & Yao, X. (2005). Diversity creation methods: a survey and categorisation. Information Fusion 6(1)."
  - "Thompson, A. (2014). Does diversity trump ability? An example of the misuse of mathematics. Notices of the AMS 61(9)."
verification: [model-recall]
node_type: findings
status: consolidated
dispatch_status: backfilled-no-prompt-recoverable
lens_order: first
tags: [vault, discovery, multi-agent, subagent-topologies, ensemble-error]
is_session: false
layer: ontology
nature: explanatory
version: 0.1.0
last_updated: 2026-06-05
---

# Lens 01 — Ensemble-formal: why tension, not count, cancels the bias term

## Objective

Establish that the ensemble-error formalism (Krogh–Vedelsby, bias–variance, Hong–Page) says what the central claim needs: the diversity/ambiguity term — disagreement on shared inputs along the solution-relevant axis — is what subtracts member error, so agent count and surface variety are orthogonal to calibration unless they raise on-axis tension.

## Findings

**Provenance note.** This lens is `model-recall`: the theorems below are standard and stated from training knowledge, with no paper fetched during production. The decompositions (Krogh–Vedelsby, bias–variance) are exact algebraic identities and are reliable; the Hong–Page material and its critiques are recalled and should be re-verified against the cited sources before being treated as load-bearing. **None of this math is the discovery's contribution** — the discovery borrows it. The contribution is the mapping from "diversity term" to "dispatch topology," which the other lenses and the README carry. This lens only establishes that the formalism *says what the central claim needs it to say*.

### 1. The Krogh–Vedelsby identity: error = average error − ambiguity

Take an ensemble of members each producing an estimate \(V_i(x)\) for a target, combined by a (possibly weighted) average \(\bar V(x) = \sum_i w_i V_i(x)\). Krogh & Vedelsby (1995) prove an *exact* pointwise identity for squared error:

\[
(\bar V - d)^2 \;=\; \sum_i w_i (V_i - d)^2 \;-\; \sum_i w_i (V_i - \bar V)^2.
\]

Averaging over the input distribution gives the ensemble generalization error

\[
E \;=\; \bar E \;-\; \bar A,
\]

where \(\bar E\) is the weighted-average error of the individual members and \(\bar A\) is the **ambiguity** (a.k.a. diversity) term — the weighted-average variance of the members *around their own mean*, \(\sum_i w_i (V_i - \bar V)^2\). This is an identity, not an inequality or an approximation: it holds for every ensemble of every size.

Two facts make it the spine of the central claim:

1. **\(\bar A \ge 0\) always**, so the ensemble is never worse than the average member. But "never worse than average" is a weak guarantee — it does not say the ensemble is *well-calibrated*, only that aggregation does not hurt the mean.
2. **\(\bar A\) is defined entirely by member disagreement *evaluated at the same inputs*.** \(V_i(x)\) and \(V_j(x)\) must differ *for the same \(x\)* for \(\bar A\) to be positive. Two members that are each accurate but identical contribute zero ambiguity. Two members that "look different" — different prompts, different personas, different phrasing — but return the same estimate on every input contribute *exactly zero* to \(\bar A\). The error reduction comes only from substantive disagreement on shared inputs, not from presentational variety.

This is the formal content of "surface diversity is orthogonal to calibration." Surface diversity that does not move \(V_i(x)\) apart on the same \(x\) leaves \(\bar A = 0\) and leaves the ensemble error pinned at the average member error.

### 2. Bias–variance: averaging preserves the *shared* bias

Krogh–Vedelsby measures spread around the ensemble's own mean. It does *not* tell you where that mean sits relative to truth. For that, decompose member error against the target. For estimators with a common expected value, the classical bias–variance decomposition (Geman, Bienenstock & Doursat, 1992) of the *ensemble* mean \(\bar V\) is:

\[
\mathbb{E}[(\bar V - d)^2] \;=\; \underbrace{(\mathbb{E}[\bar V] - d)^2}_{\text{bias}^2} \;+\; \underbrace{\operatorname{Var}(\bar V)}_{\text{variance}}.
\]

Now the load-bearing fact. For \(n\) members each with variance \(\sigma^2\) and *pairwise correlation* \(\rho\), the variance of the simple average is

\[
\operatorname{Var}(\bar V) \;=\; \frac{\sigma^2}{n} \;+\; \frac{n-1}{n}\,\rho\,\sigma^2 \;\xrightarrow[n\to\infty]{}\; \rho\,\sigma^2.
\]

Reading this term by term:

- The \(\sigma^2/n\) piece is the *independent* variance and it vanishes as you add members. **This is the only thing agent count buys you.**
- The \(\rho\sigma^2\) piece is the *correlated* floor. It does **not** shrink with \(n\). As \(n \to \infty\) the ensemble variance converges to \(\rho\sigma^2\), not to zero.
- **The bias\(^2\) term is untouched by averaging entirely.** If every member shares a systematic error — a prior they all inherit, a framing they all accept — \(\mathbb{E}[\bar V]\) carries that error and no number of members removes it.

So "more agents ≠ calibration" is not a heuristic; it is two distinct mathematical facts. Count attacks only the \(\sigma^2/n\) term. The shared-bias term and the correlated-variance floor \(\rho\sigma^2\) survive any \(n\). The only way to drain the floor is to *lower \(\rho\)* — to make members err in genuinely different directions — and the only way to attack the bias term is to make at least some members err in the direction *opposite* the shared bias. Both require disagreement along the axis where the bias actually lives.

### 3. Diversity (any axis) vs tension (the bias-carrying axis)

This is the sharp distinction the discovery needs, and the decompositions give it precisely.

- **Diversity** is spread on *some* axis — any \(\bar A > 0\), any \(\rho < 1\). You can manufacture diversity cheaply: vary temperature, vary persona, vary wording. This lowers \(\rho\) *if and only if* the variation perturbs the members' estimates on shared inputs. Often it does so on irrelevant axes — members disagree about tone while agreeing about the substantive answer. That spread reduces variance on dimensions nobody was going to be miscalibrated on, and leaves \(\rho\) near 1 on the dimension that matters.
- **Tension** is spread *aligned with the bias-carrying axis*: members forced to disagree precisely about the quantity where the shared prior would otherwise pull them together. Tension is the *projection of diversity onto the bias direction*. Only this projection lowers the correlated floor in the direction that holds the systematic error, and only this projection lets the ambiguity term \(\bar A\) subtract error where error actually accumulates.

In dispatch terms: agent count grows \(n\) (touches only \(\sigma^2/n\)); surface diversity grows off-axis spread (touches \(\bar A\) on irrelevant dimensions); **structural tension grows on-axis spread (touches \(\rho\) and bias where they live).** The decomposition makes count and surface diversity *provably orthogonal* to the bias term and to the correlated-variance floor. They are not harmful — they help the part of the error that was already going to wash out. They are simply not the load-bearing variable for calibration.

### 4. Hong & Page (2004): diversity trumps ability — under conditions

Hong & Page's "diversity trumps ability" theorem states that a group of randomly selected problem-solvers can outperform a group of the individually-best solvers, *because* the best solvers tend to share heuristics and therefore get stuck at the same local optima, while a diverse group covers complementary parts of the search space. The mechanism is the same as the ambiguity term: complementarity (disagreement on the same problem) does work that individual ability cannot.

Crucially, the theorem's conditions encode *tension*, not mere variety. The result requires that (i) the agents' problem-solving perspectives/heuristics be **relevant to the problem** — diversity on the solution-relevant axis — and (ii) the agents be individually competent above a floor (the diverse group cannot be uniformly useless). Diversity that is orthogonal to the solution structure does not trump ability; it just adds noise. This is the Hong–Page version of "tension must lie along the bias-carrying axis."

**Honest caveats (model-recall, verify before load-bearing use).** The theorem has well-known critiques — most pointedly Thompson (2014), who argues the formal version smuggles its conclusion into its assumptions (the "diversity" and "ability" measures are defined so that the inequality is near-tautological, and the random-selection limit does heavy lifting). The defensible residue, which is what this lens relies on, is the *qualitative* and *conditional* claim: complementary, problem-relevant disagreement can beat aggregated individual skill — under conditions on relevance and competence. The discovery should cite Hong–Page for the *direction* of the effect and lean on Krogh–Vedelsby and bias–variance for the *exact* algebra, not the reverse.

### 5. What the formalism gives — and what it does not

Subset discipline: the cited theorems give that **structured (on-axis) disagreement is necessary** to subtract member error and to lower the correlated-variance floor, and that **count and surface diversity cannot touch the shared-bias term**. That is exactly the central claim's "structural tension is load-bearing; count and surface diversity are orthogonal."

They do **not** give that calibration is *guaranteed*. Krogh–Vedelsby guarantees only "no worse than average member." Nothing here proves the ensemble mean lands *on* the truth — only that on-axis tension is the channel through which it *could*. Calibration remains an empirical property of a particular dispatch, which the other lenses must establish; this lens establishes only that the formal machinery makes tension the right place to look.

## Caveats

What this lens did NOT establish:

This lens treats agents as *estimators to be averaged passively*. Its whole apparatus — \(\bar A\), \(\rho\sigma^2\), the bias term — assumes that disagreement, once present, is harvested by aggregation. That apparatus reaches its hard limit exactly at the **shared-bias / correlated-error floor**: averaging cannot remove a systematic error that every member commits, and it cannot *manufacture* the on-axis disagreement that would lower \(\rho\) — it can only exploit disagreement that the dispatch topology has already induced. Where the bias is correlated across all members (a prior they all inherit, a framing none of them question), \(\rho \to 1\) on the bias axis and passive averaging is powerless. That is precisely where **Lens 02 (adversarial-debate)** takes over: when error is systematic rather than spread, you cannot average it away — you must *force confrontation* to generate the on-axis disagreement that this lens can only assume into existence. Lens 01 says tension is the load-bearing variable; Lens 02 addresses how to *produce* tension when the ensemble would otherwise collapse to a correlated consensus.

## Connections

| Document | Type | Description |
|---|---|---|
| `../../research/research.md` | `synthesized-by` | This lens's ensemble-error conclusions are consolidated by the folder's cross-lens research synthesis. |
