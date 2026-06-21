---
tags: [entropy, mdl, information-bottleneck, free-energy, via-negativa, dispatch-2026-06-21-entropy-symmetry]
node_type: subagents-research
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-06-21
created_by: victorboscaro@gmail.com
---

# Entropy-Reduction Symmetry — Raw Explorer Returns

Verbatim returns from the four explorers of dispatch `2026-06-21-entropy-symmetry`.
Synthesis (with citations and verdict matrix) lives in `findings.md`. These are raw
evidence, appended without editing.

---

## Agent 1 — Explorer "Confirmador" (formal models, web)

**Angle:** find the strongest formal frameworks where "minimize a description/uncertainty functional subject to coverage" is the unifying principle. Confirmation-seeking by design.

**VERDICT:** There is one genuinely shared formal object — `L = −log P(data | model) + (model cost)`, minimized subject to a fidelity constraint that blocks collapse to the empty model. It unifies three of the four levels — schema/spec quality (MDL), cognitive inference (free-energy principle), and language-model behavior (cross-entropy training is literally minimum description length). These are not analogies; they are the same `−log P` object. **However the fourth level — token cost as *energy* — is linked only by analogy.** Tokens are a description-length quantity (bits); Landauer's principle is the only formal entropy↔energy bridge but it bounds physical bit erasure, not abstract representation length, and real hardware runs ~10⁹× above the bound.

**Frameworks:**
- **MDL (Rissanen 1978):** `L(x) = min_{H} [ L(H) − log P(x|H) ]`; the `−log P(x|H)` data-fit term is the coverage constraint. (Grünwald & Roos 2019; Scholarpedia MDL.)
- **Kolmogorov/Solomonoff:** `P(A)=2^(−K(A))`; prediction = compression; Occam formalized. Caveat: `K` uncomputable — the Platonic ideal MDL approximates.
- **Free-energy principle (Friston):** `F = D_KL[Q‖P(s|o)] − log P(o)` = accuracy + complexity; accuracy term is the coverage constraint. Same `−log P` + KL structure as MDL. (Parr/Friston 2019.)
- **Information Bottleneck (Tishby/Pereira/Bialek 1999):** minimize `I(X;T)` subject to `I(T;Y) ≥ const`; relevance term `I(T;Y)` IS the coverage constraint, named explicitly. Best match to the hypothesis phrasing.
- **Rate-distortion (Shannon):** `R(D) = inf I(X;Ŷ)` subject to distortion ≤ D; the distortion bound is coverage. IB is formally a rate-distortion problem — same machinery.
- **Bounded rationality / rational inattention / Zipf:** `max E[utility] − (1/β)D_KL[π‖π₀]`; same free-energy object from economics. Cross-confirms recurrence across neuroscience AND economics.
- **LLM training:** cross-entropy `= −(1/N)Σ log P(token|context)` = bits-per-token = description length; perplexity = exp(cross-entropy). Token count of an output is its description length in the model's code.

**Critical honesty — analogy-only links:**
1. **Token cost as ENERGY is the weak leg.** Tokens are bits (rigorous, ties to MDL). But "energy" invokes thermodynamics, and the only formal entropy↔energy law is Landauer `E ≥ k_B·T·ln 2` per bit erased — applies only to logically irreversible operations, real GPUs run ~10⁹× above it, and Wikipedia is explicit it makes no claim linking representation-length entropy to energy unless bits are physically erased. "Fewer tokens = less energy" is true operationally (fewer FLOPs → fewer joules) but runs through engineering cost-per-FLOP, not the shared `−log P` functional. (Landauer's principle, Wikipedia; arXiv 2506.10876.)
2. **Cognitive clarity → free energy is a *model* of cognition, not measured metabolic energy.** Friston "free energy" is a variational information bound named by analogy to thermodynamic free energy; not brain ATP cost.
3. **IB-on-deep-nets is contested** (Saxe et al. challenged the Tishby/Shwartz-Ziv "compression phase") — treat model-level IB as suggestive, not settled.

**Net:** unifying functional is tight across cognition / representation / model — all instances of *minimize `−log P` (or KL / `I(X;T)`) subject to a fidelity/relevance/utility constraint that names the coverage.* The energy leg is bolted on by analogy via Landauer and the thermodynamic naming of "free energy."

---

## Agent 2 — Explorer "Refutador" (counterexamples, web)

**Angle:** break the hypothesis. Hunt counterexamples, opposite-direction principles, cross-level divergence.

**VERDICT: PARTIAL, collapsing to FALSE as stated.** Survives only in the hedged form "minimize subject to coverage" — and even that quietly smuggles the real principle, which has the *opposite sign*: you **maximize** entropy subject to constraints (Jaynes), or tune to an **intermediate** optimum (regularization, RL exploration, edge-of-chaos). "Minimize entropy everywhere" is one boundary of a tradeoff, and the system is pathological *at* that boundary.

1. **Max-ent is the opposite sign (Jaynes 1957):** choose the distribution that maximizes Shannon entropy subject to constraints, because the minimum-entropy choice "says something stronger than what we are assuming." Reducing entropy below what coverage forces *fabricates* commitments. Sign error. (SFI Press; Grokipedia max-ent.)
2. **Regularization ADDS entropy on purpose:** label smoothing / max-entropy regularization penalize overconfident one-hot predictions and improve generalization. Optimal entropy is intermediate. (arXiv:1809.05934; Lei Mao.)
3. **Bias-variance / minimal-entropy schema underfits:** zero degrees of freedom can't express domain variation. Optimum between rigidity and chaos.
4. **RL entropy bonus exists because low entropy is harmful:** prevents "premature convergence to suboptimal deterministic policies"; policy-entropy collapse is a named failure mode. (TDS entropy-regularized RL; EmergentMind policy-entropy-collapse.)
5. **Edge of chaos:** entropy rate and excess entropy peak at the order/chaos transition; computational capacity maximal near that boundary, not at minimum entropy. (arXiv:1909.05176; Bertschinger & Natschläger 2004.)
6. **CATEGORY ERROR: tokens ≠ energy, energy ≠ entropy.** Landauer links bit erasure to kT·ln2, but the entropy increase is fundamental while the energy cost is its typical thermodynamic manifestation and "could theoretically occur at no energy cost… in another conserved quantity." Token count is a description length, not a thermodynamic entropy; Landauer concerns erasure, not generation. The "tokens=energy=entropy" chain conflates three things. (Landauer, Wikipedia; Norton "Eaters of the Lotus.")
7. **SHARPEST KILL — temperature→0:** lowers model output entropy (the hypothesis says good), but T=0 induces mode collapse / degenerate repetition, and calibration is worst at T=0 ("lowest calibration error at temperature 0.7"; "most overconfident where wrong"). The single intervention that minimizes model entropy simultaneously raises the human's uncertainty and error — the human trusts the crisp low-entropy output and decides worse. One knob, two levels opposite. (ZeroEntropy temperature-sampling; TianPan LLM calibration; Brenndoerfer.)

**Synthesis of the kill:** each level has an intermediate constrained optimum, and the four optima do not coincide under a shared knob. "Subject to coverage" does all the work — a disguised Jaynes constraint set, after which the correct operation is *maximize*, not minimize. The hypothesis confuses "remove entropy coverage doesn't require" (parsimony, trivial) with "minimize entropy" (false, harmful at the boundary).

---

## Agent 3 — Explorer "Interno domainspec"

**Angle:** where the domainspec repo already encodes "reduce descriptive entropy subject to coverage" under its own names.

**VERDICT:** the repo behaves as if "minimize descriptive entropy subject to preserving coverage" is a real, intentional organizing principle — under its own terminology (unconstructibility, derive-only reconciliation, residue preservation, tension-by-design, minimal deterministic context), not the word "entropy."

**Five entropy-reduction mechanisms:**
1. **Ontology-View forbidden-edge discipline** (`.claude/skills/ontology-view/SKILL.md:58-66`, README:8-27): "A forbidden edge: endpoint types admit NO catalog edge for the (source→target) pair." The bad edge is "unconstructible by type" rather than asserted in prose — reducing the configuration space of admissible schemas.
2. **Check-Tension anti-bias gate** (`SKILL.md:6-11,85-92`): "Ambiguity is not good enough — the strategist revises until both pass cleanly." Closed axis vocabulary; reduces dispatch variance by design.
3. **Engineer-View bijective verdict ownership** (`SKILL.md:69-73`): "every stance system-view names-but-does-not-decide → exactly ONE row (zero = orphaned-stance blocker; two = duplicate-verdict violation)."
4. **Context-Builder minimal deterministic bundles** (`SKILL.md:3,73-81`): "minimal deterministic task context pack… strict relevance gates"; `noiseRatio = unboundSelections/totalSelections ≤ 0.15`; excerpt budgets (lean ≤8 files/≤140 lines). Rate-distortion / information bottleneck in practice.
5. **CLAUDE.md closed retrieval path** (`CLAUDE.md:24-25,32-37`): GitNexus/semantic_query before grep; route table collapses an open decision space into 13 closed routes naming exactly which files to read.

**Two mechanisms that DELIBERATELY preserve entropy (the coverage brake):**
6. **Residue ledger** (`ontology-view/SKILL.md:50`, `engineer-view/SKILL.md:51,71`): "open residue never demoted"; "A verdict with no citable authority is OPEN-by-default, never RESOLVED." Some questions stay genuinely undecided and surfaced.
7. **Derive-only / reconcile-not-regenerate** (`engineer-view/references/DECISIONS.md` D6:59-63): "Rebuilding from scratch would destroy authored judgment; evolve mode preserves it except where the discovery delta forces a change." Keeps OPEN/CRITICAL states rather than collapsing them under pressure to finish.

Git history shows deliberate investment in "residue" and "entropy reduction" (commits 7e3ffa3, e4c856b). The repo avoids the word "entropy" (uses unconstructible / bijective / deterministic / residue), suggesting a working principle emerged from practice rather than borrowed theory.

---

## Agent 4 — Explorer "Interno Arcanum"

**Angle:** Arcanum's parallel vocabulary for the same intuition (independent corpus). Confirm or deny the hedged (not strong) version.

**VERDICT:** Arcanum independently encodes the hedged hypothesis — "reduce descriptive entropy subject to preserving coverage, only when tension forces structure" — and explicitly refuses to over-formalize, preserving openness as a load-bearing principle. Evidence, not echo.

1. **Via Negativa** (`BUSINESS-ONTOLOGY.md:15`): "Following Nassim Taleb's principle of Via Negativa (subtraction over addition), the Business Ontology avoids formalizing rules prematurely… formalize a rule or axiom only when its absence has proven costly or caused measurable harm."
2. **Complexity only under tension** (`CYBERALCHEMY-METHOD.md:48`): "does not reward complexity for being elegant; it introduces structure when the current context has a named tension that the simpler unit cannot responsibly handle." And `:171`: "Avoid premature complexity, but do not create brittle minimalism. Ask what kind of evolution the artifact is likely to face, then preserve the smallest useful extension boundary."
3. **Confidence levels** (`BUSINESS-ONTOLOGY.md:30-35`): Evidence Confidence vs Commitment Confidence — "allows teams to explore uncertain domain areas (low evidence) without building brittle architectures (safeguarding via low commitment)."
4. **Deterministic context** (`BUSINESS-ONTOLOGY.md:55`): "the Business Ontology provides a strict, unambiguous glossary and rule set. This prevents hallucinations." Reducing model output entropy via deterministic context.
5. **Premises as soft holds** (`BUSINESS-ONTOLOGY.md:27-28`): premises stay premises until evidence accumulates — the explicit coverage constraint.
6. **Preserve open-endedness** (`CYBERALCHEMY-METHOD.md:84-85`): "Closure is contextual, not final."
7. **Transmutations** (`transmutations/README.md:5`): "A Transmutation should reduce entropy: it takes scattered, ambiguous, or under-shaped material and turns it into a clearer structure." — but bounded by quality bar.
8. **Anti-Patterns** (`ANTI-PATTERNS.md:5`): guardrails against over-reduction / outputs that "look complete while violating purpose."
9. **Cognitive load as constraint** (`arcana/distill/development/LITERATURE-RESEARCH.md:42`): "'smaller' is not always simpler. A concept split that creates five tiny fragments can increase cognitive load."
10. **NEAR-VERBATIM MATCH** (`development/session-handoffs/20260619T164442Z-context-schema-refinement-controller-handoff.md:46`): "Reduce entropy → reveal schema. Injecting the right context chunk lowers the task's uncertainty, which makes the optimal schema legible. The method's objective function is entropy reduction, not coverage." And `:48-49`: "Marginal-utility stop rule… Refine until the marginal utility of revealing more schema drops below its marginal cost… Over-refining past the saturation point reduces fidelity. This is the hard upper brake on refinement depth."

**Conclusion:** the hypothesis collapses to its hedged form. Arcanum does NOT support unbounded entropy reduction — it encodes an explicit stop rule (refine only while marginal utility exceeds marginal cost). DomainSpec-independent evidence for the hedged unified property.
