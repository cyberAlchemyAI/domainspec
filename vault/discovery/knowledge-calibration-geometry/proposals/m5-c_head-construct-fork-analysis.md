---
tags: [decision-gate, fork-analysis, C_head, knowledge-calibration-geometry, m5]
node_type: fork-analysis
parent_discovery: vault/discovery/knowledge-calibration-geometry/discovery.md
related_proposal: vault/discovery/knowledge-calibration-geometry/proposals/v0.5.0-patch.md
status: draft
layer: ontology, application
nature: explanatory, reference
created: 2026-05-27
last_updated: 2026-05-27
created_by: m5-research-agent
axiom_invoked: AX-DS-4
---

# M5 — `C_head` Construct-Type Fork Analysis

> Research document for the M5 decision-gate session. This document **does not decide**. It lays out the three candidate construct types for `C_head` so the user can choose under AX-DS-4. Citations point back to `discovery.md` v0.4.0, `findings.md` (F2, P-A), and `lenses/axis-psychometric-geometric/findings.md` (P1).

---

## Section 1 — Decision Statement

**Decision under evaluation.** Pick one construct type for `C_head` — the central object of the `knowledge-calibration-geometry` discovery, defined in H-1 as "knowledge internalized by a person or group." The three candidates surfaced by the 4-lens audit (specifically Lens 2 P1) are mutually incompatible psychometric framings:

- **Fork A — Latent continuous trait** (IRT / Rasch family)
- **Fork B — Knowledge-state vector** (Cognitive Diagnostic Models: DINA, G-DINA, LCDM)
- **Fork C — Behavioral disposition** (propensity estimation)

**What this decision gates.** Per `v0.5.0-patch.md` M5 and the M2 distance-stack table, every `d(head_*, *)` row in the v0.5.0 distance stack carries the status `conjecture-pending-C_head-decision`. Until this fork is resolved:

- no formula for `d(head_i, reference(task_family))`, `d(head_i, head_j)`, `d(head_group, reference)`, `cohesion(group)`, or `bias(group, reference)` has a definite typing;
- `d_math(head_*, *)` cannot exist at all (per the v0.5.0 M2 note: the math-distance component projects onto Lean-declaration identity, and a person's knowledge state does not natively reference Lean declarations unless we pick a construct type that includes formal-statement endorsements);
- the carrier-space decision (audit F1 / P-A) cannot be made — the carrier is downstream of the construct type;
- the canonical claim layer that mediates `C_head` / `C_spec` / `C_system` comparison (Lens 2 G12) cannot be specified — it would mediate an under-typed vertex;
- no reliability operationalization (F6) is possible — the relevant reliability statistics depend on the construct family.

**Consequences of not deciding (current state).** v0.4.0 ships `C_head` as **simultaneously** all three constructs (Lens 2 P1: "alternately treated as a latent continuous trait, a discrete knowledge state, and a behavioral disposition"). v0.5.0 explicitly *flags* the ambiguity rather than resolving it. Each downstream metric is therefore provisional in a way that compounds: 5 distance rows undefined, 1 reliability framework undefined, 1 claim layer undefined, ~6 follow-up patches blocked (audit patches 5, 6, 7, 8, plus 2b). This is invocation of AX-DS-4 (an architectural decision that cannot be made silently in code or a follow-on edit).

---

## Section 2 — Comparative Matrix

| Dimension | Fork A (Latent Trait) | Fork B (Knowledge-State Vector) | Fork C (Behavioral Disposition) |
|---|---|---|---|
| **Mathematical formalism** | Probabilistic, parametric. 1PL/2PL/3PL logistic IRT (Lord & Novick 1968; Rasch 1960; Embretson & Reise 2000). Person = scalar `θ ∈ ℝ` (or low-dim vector). Item has difficulty `b`, discrimination `a`, optional guessing `c`. `P(correct \| θ) = c + (1−c)·σ(a(θ−b))`. | Latent-class / diagnostic. Person = binary vector `α ∈ {0,1}^K` over K atomic skills/rules. Q-matrix `q ∈ {0,1}^{J×K}` maps items to skills. DINA: conjunctive (must master *all* required skills); G-DINA / LCDM: general (compensatory or hybrid). (Junker & Sijtsma 2001; de la Torre 2011; Henson, Templin & Willse 2009; Rupp, Templin, Henson 2010.) | Stochastic / Bayesian / propensity. Person = distribution over actions in repeated contexts; "knowledge" = consistency of choice with a target policy. Often Bayesian belief updating, sometimes non-parametric. (Dang, King & Inzlicht 2020 for the divergence argument; broader behavioral-propensity literature.) |
| **What "distance" means** | `d(head_i, reference)` = `\|θ_i − θ_ref\|` on the calibrated logit scale (interval scale only after Rasch fits). `d(head_i, head_j)` = `\|θ_i − θ_j\|`. Symmetric, satisfies metric axioms on `ℝ`. Cross-person comparability is the whole point. | `d(head_i, reference)` = Hamming distance on binary vector (or Jaccard if asymmetric); also natural: set-difference (which skills missing vs which extra). Reference itself is a target vector `α_ref ∈ {0,1}^K`. Distances are discrete, ordinal-friendly. | `d(head_i, reference)` = divergence between behavioral distribution and target policy distribution (KL, JS, total variation, or Brier-like). Often asymmetric. "Distance" is at the *behavior-frequency* layer, not at a stable internal state. |
| **Required evidence per person** | Multi-item test responses (≥ ~20 items for stable θ at fixed item parameters; ≥ ~200 persons for joint item-and-person calibration). Items must be pre-calibrated or jointly calibrated. | One probe per (skill × difficulty) cell at minimum; ideally multiple probes per skill for diagnostic reliability. Q-matrix must be specified by domain experts before scoring. | Many repeated decisions in similar situations over time. Sample size is *per-person interactions*, not per-person items. Single-shot probes are nearly useless. |
| **Minimum sample size for calibration** | unknown precisely — IRT canon: ≥200 persons for joint calibration of 1PL; ≥500 for 2PL; ≥1000 for 3PL (Embretson & Reise 2000 rule of thumb; Lens 2 P9 cited "≥200" generically). | unknown — DINA/G-DINA need fewer persons than IRT (latent-class identification is structural) but more items per skill. Rule-of-thumb ranges in literature; need user input or lit-check. | unknown — depends heavily on the behavioral signal-to-noise ratio. Bayesian posteriors can be informative with N=1 person if interactions are dense, but cross-person calibration of a "target policy" needs much more. |
| **Fit to the bidirectional game loop (H-3)** | Native fit for `system → person` direction (items elicit responses). Poor fit for `person → system` direction (IRT has no theory of person-generated probes). | Native fit for `system → person` (each probe targets a Q-matrix row). The `person → system` direction can be partially modeled as "person asks about skills they lack," giving a complementary diagnostic signal. | Strongest fit for *naturalistic* observation over time, not for the discrete probe loop. Game loop becomes the elicitation mechanism for behavioral traces; less natural for one-shot scoring. |
| **Fit to direct + inferred channels (H-9)** | Direct elicitation = items. Inferred behavioral evidence is hard to fold into the same `θ` without explicit auxiliary models (testlet IRT, multidim IRT) — practically two scores, one declared θ, one operational θ, that should not be averaged. | Direct = probes that test specific skill cells; inferred = pattern of action-traces decoded against the Q-matrix. Both can populate the same `α` vector if the evidence rules treat each skill independently. | Direct elicitation is the *secondary* channel for this construct. Inferred behavior is the *primary* channel. Direct probes are weak evidence for a behavioral disposition unless they are themselves choice tasks. Aligns with Dang et al. 2020's argument that declared and behavioral measures index different constructs. |
| **Fit to the theorem's V/H/D axis** | Weakest fit. θ is a scalar latent; it does not carry typed schema structure. V-axis (schema-vs-instance) collapses — θ is at the instance layer with no schema decomposition. H-axis (temporal accumulation) requires explicit longitudinal IRT (latent growth curves). D-axis (self-reference) has no obvious hook. | **Strongest fit to V-axis.** The binary skill vector `α` is literally a discrete schema; mastery of skill `k` is a schema-level claim, and the Q-matrix is a typed translation from items to schema. Maps onto `theorem-Lean:DomainSpec.lean`'s schema/instance split — schema is the Q-matrix, instance is a person's `α` filling. H-axis fits naturally (skill acquisition over time is a monotone refinement). | Fits H-axis (behavior accumulates over time, the second-law analog applies to behavior-distribution entropy). V-axis fit is weak (behavior is at the instance layer; no schema decomposition unless the action space is itself typed). |
| **Compatible C-9 distance components** (from `two-layer-retrieval#C-9`) | `d_embed` (embed θ in scalar/low-dim space); weakly `d_trust` (calibration freshness). Incompatible with `d_lex`, `d_graph`, `d_code`, `d_math` for `head_*` rows — θ is not a symbol, not a graph node, not a code unit, not a Lean declaration. | `d_lex` (skill names match), `d_graph` (the Q-matrix *is* a graph between probes and skills), `d_trust` (skill mastery has a freshness model), and **conditionally `d_math`** if skills are bound to Lean declarations or formal statements. Best multi-component coverage. | `d_embed` (behavior trace embedding), `d_trust` (recency of observed behavior). Incompatible with `d_lex` / `d_graph` / `d_math` for `head_*` rows — behavior is a sequence, not a symbol or a typed graph node. |
| **Reliability instrumentation needed** | Internal consistency (Cronbach α / McDonald ω) over item set; test-retest of θ across occasions; person-fit statistics; item-fit statistics; differential item functioning (DIF) for cross-group invariance. | Classification accuracy (per skill) against gold-labeled probes; consistency of skill profile across alternate Q-matrices; attribute-level reliability (not the same as test-level). | Stability of behavioral pattern over time (test-retest at the behavior-distribution level); inter-rater agreement only if behavior is human-coded; calibration of the Bayesian prior (sensitivity analysis). |
| **What kills this fork (falsifier)** | If responses across items targeting the same construct do not form a coherent unidimensional (or low-dim) scale — i.e., fit statistics fail, the Wright map shows inversions, or person ordering changes dramatically across item subsets — the construct does not exist as a latent trait. | If the Q-matrix cannot be specified by domain experts with reasonable agreement, or if probes cannot be designed to cleanly target single skill cells (every probe ends up requiring 5+ skills), the model is unidentifiable in practice. | If behavior is too noisy or too situational to admit a stable target policy — i.e., the same person acts differently in apparently identical situations with no recoverable structure — there is no construct to estimate. Also killed if every behavioral signal turns out to require a declared-knowledge proxy to interpret (collapses back to Fork A or B). |
| **Cost (time, tooling, expertise)** | High. Requires IRT expertise, item-calibration pipeline, ~200+ persons for cold-start. Tooling: `mirt`, `TAM`, `pyirt`, custom Stan/PyMC. Multi-month onboarding. | Medium-high. Requires domain experts to author Q-matrix (substantial effort, contested decisions). Fewer persons needed but more items per skill. Tooling: `CDM` (R), `GDINA` (R), custom. | Variable. Cheap to start (just collect behavior) but expensive to validate — requires longitudinal data collection infrastructure, behavior-coding pipeline (often LLM-as-judge with all its reliability issues per F6), and a defensible target-policy specification. |
| **Reversibility if wrong** | Medium. θ scores collected under one item bank are tied to that calibration; switching constructs invalidates them. But the *responses* themselves are preserved and can be re-scored under Fork B (treating items as targeting binary skills) — at the cost of throwing away the item-parameter calibration work. | High *to Fork A*: a Q-matrix-organized item pool can be re-fit as an IRT scale (collapse skills into latent θ). Lower *to Fork C*: skill-vector data has no natural conversion to behavior-trace data. | Low. Behavioral traces are rich raw data but require *new* probe collection to fit a Fork A or Fork B model. The cost of starting with Fork C and discovering you need Fork A or B is mostly sunk-data — the longitudinal infrastructure stays useful, but the calibration work restarts. |

---

## Section 3 — Per-fork narrative

### Fork A — Latent continuous trait (IRT / Rasch)

**What it commits the product to mathematically.** Every person becomes a scalar (or low-dim vector) on a latent ability continuum. Every probe becomes an item with parameters that live in the same space. Scores become `θ`-estimates with standard errors. All distances become `|θ_i − θ_j|` on the logit scale. Group-level quantities (`bias(group, reference)`, `cohesion(group)`) become `mean(θ_group) − θ_ref` and `var(θ_group)`. This is mathematically the cleanest fork — metric axioms hold, distances are symmetric and triangle-inequality-satisfying, interval scale is achieved after Rasch fits, and the whole `d(head, head)` and `d(head, reference)` machinery becomes ordinary distance on `ℝ`.

**Evidence required on day 1.** A pre-calibrated item bank (or enough joint-calibration data: ≥200 persons × ≥20 items minimum, per IRT canon). Without this, `θ` estimates have unbounded standard errors and the metric machinery degenerates. The discovery's "first experiment" (5–7 probes × 2–3 people) is **two orders of magnitude below** the minimum needed to even fit a 1PL Rasch model — Fork A says day-1 calibration of any `d(head_*, *)` distance is not possible at the discovery's proposed experiment scale.

**What becomes IMPOSSIBLE under this fork.** (1) Diagnostic feedback at the skill level — "you know X but not Y" becomes a category error because the construct is unidimensional. (2) `d_graph(head_*, *)` and `d_math(head_*, *)` from the C-9 distance stack — `θ` is not a graph node, not a Lean declaration. (3) Theorem-side V-axis coupling — the schema-vs-instance split has no analog when the construct is a scalar. (4) The Q-matrix discipline (which is the natural typed-translation layer between probes and skills).

**Concrete example calibration finding.** "Person A's θ on the FIDC-feature task family is −0.4 logits (SE 0.3), reference θ is +1.2 logits, gap = 1.6 logits (~64% probability of getting a median-difficulty item wrong). Δ over last 30 days: +0.5 logits. Confidence: medium (n=12 items, ω=0.78)." This is a single number per person per task family. It can be tracked over time. It does not say *what specifically* the person does not know.

### Fork B — Knowledge-state vector (Cognitive Diagnostic Models)

**What it commits the product to mathematically.** Every person becomes a binary (or fuzzy in LCDM) vector indexed by atomic skills/rules. Every probe is tagged with a Q-matrix row stating which skills it requires. Scoring is diagnostic: each item provides evidence for or against mastery of specific skills. Distances become set-comparisons (Hamming, Jaccard, set difference) over the skill vector. "Reference" becomes a target skill profile `α_ref ∈ {0,1}^K`. Group-level alignment is natural — `cohesion(group)` = mean pairwise Hamming distance within group; `bias(group, reference)` = mean Hamming distance from `α_ref`.

**Evidence required on day 1.** (a) An expert-authored Q-matrix listing the atomic skills and which probes target which skills. (b) Multiple probes per skill cell (≥2–3) so that single-probe rater error does not flip mastery classification. (c) A domain ontology rich enough to *enumerate* the skills — which means the `C_spec` subcategory `Spec.ontology` (per H-7) must be load-bearing for this fork to work. Fork B is the fork that most directly couples `C_head` to `C_spec` structurally.

**What becomes IMPOSSIBLE under this fork.** (1) Continuous trajectory metrics — improvement is "skill k flipped from 0 to 1," not a smooth gradient. (2) Cross-task-family comparability without re-mapping Q-matrices — `θ` scales are linear; skill vectors over disjoint Q-matrices are not comparable at all. (3) Behavioral-only evidence — without probes that cleanly hit Q-matrix cells, behavior is just unstructured action data. (4) The "person operates at the meta-rule level" hypothesis from the sibling `abstraction-level` discovery — discrete mastery has no natural representation of abstraction depth.

**Concrete example calibration finding.** "Person A is missing 3 of 12 skills required by the FIDC-feature task family: `skill_07 (filter-eligibility-EXP-DI)`, `skill_09 (cessao-prior-to-pagamento)`, `skill_11 (CCB-vs-CRA-distinction)`. Has 2 extra skills not in `α_ref`: `skill_15`, `skill_18` (possibly evidence of stale reference — these were valid 3 months ago). Confidence: high on `skill_07` (3/3 probes failed), medium on `skill_09` (2/3 probes failed, 1 ambiguous)." This produces an actionable per-skill diagnosis — exactly what the discovery's anti-dashboard discipline (H-11 / G-11) demands.

### Fork C — Behavioral disposition (propensity estimation)

**What it commits the product to mathematically.** Every person becomes a distribution over actions in recurring contexts. "Knowing the domain" = behaving consistently with a target policy across the same contexts. Distances become divergences between behavioral distributions (KL, JS, total variation) — often asymmetric, generally not satisfying metric axioms. Reference becomes a target action policy `π_ref`. Group quantities become distributional comparisons (mean JS divergence within group; mean JS divergence to `π_ref`).

**Evidence required on day 1.** Rich behavioral instrumentation — repeated decisions in genuinely-recurring contexts, ideally instrumented at the moment of choice with the alternatives the person did not pick (otherwise you cannot compute the choice distribution, only the action). The discovery's bidirectional game loop is the *wrong* primary instrument for this fork; the right instrument is *naturalistic observation of work*. The game loop becomes the *secondary* probe channel — useful for occasional calibration checks but not the main evidence source.

**What becomes IMPOSSIBLE under this fork.** (1) Single-shot scoring of any kind. (2) Cross-person comparability without a shared context distribution — if persons A and B never face the same situations, their behavioral distributions are not comparable at all (analogous to Lens 2 P6's measurement-invariance critique). (3) Probe-bank reuse — items are not the primary evidence type. (4) The Mislevy-style Evidence-Centered Design Student Model (Lens 2 P3) — there is no stable student model, only a behavioral signature.

**Concrete example calibration finding.** "Over the last 60 days, Person A made 47 decisions in the FIDC-eligibility context. Their action distribution diverges from `π_ref` by KL = 0.31 nats (95% bootstrap CI [0.22, 0.41]). The divergence is concentrated in two contexts: `context_05 (EXP-DI ambiguous)` and `context_11 (cessao timing)` — in both, Person A picked the wrong filter 4/7 and 3/5 times respectively. The pattern is stable over the 60 days (no learning trend). Confidence: medium (sample-size-bound)." Note that this finding *cannot exist after day 1* — it requires the 60-day window to emerge.

---

## Section 4 — Cross-fork interactions

### Can two forks coexist?

**Strongest case for coexistence: Fork A + Fork C as two distinct constructs.** Lens 2 P5 cites Dang/King/Inzlicht 2020 as the explicit argument: declared knowledge and behavioral knowledge correlate weakly (r often < .3) **because they index different constructs, not because one is noise around the other**. P5's suggested patch on the discovery is exactly to split `C_head` into `C_head_dec` (declared, Fork A natural) and `C_head_op` (operational, Fork C natural), with `C_head_meta` and `C_head_tac` as further candidate splits. Under this reading, the question is not "which fork wins?" but "which forks survive as distinct first-class constructs in v1, and which are deferred?"

**Fork A + Fork B as nested layers.** Possible but awkward: a Q-matrix-derived skill mastery vector can be coarsened into a `θ` (sum or weighted-sum score), but the reverse direction is lossy in a way that breaks IRT identifiability. If both are wanted, Fork B as the primary representation with Fork A as a *derived summary* is the cleaner direction (matrix → scalar, never scalar → matrix). The reverse (Fork A primary, with post-hoc skill-vector recovery) is what IRT practitioners explicitly warn against.

**Fork B + Fork C.** Compatible in principle if the action space is itself typed against the Q-matrix (e.g., each behavioral choice corresponds to applying or violating a specific skill). Requires very heavy instrumentation. Probably not a v1 combination.

### Can a fork be added later without throwing away day-1 data?

| Day-1 fork | Add Fork A later? | Add Fork B later? | Add Fork C later? |
|---|---|---|---|
| **Started with A** | (already) | Partial — responses re-scorable as binary skill evidence if a Q-matrix is authored later, but item parameters are sunk cost | Hard — IRT items are not behavioral traces; new instrumentation required |
| **Started with B** | Easy — collapse skill vector into θ summary | (already) | Hard — probes are not behavior; new instrumentation required |
| **Started with C** | Hard — behavioral traces do not yield item-level responses without redesigning collection | Hard — same reason | (already) |

**Conclusion.** Fork B is the most *reversibility-friendly* day-1 commitment — it can be summarized into A later, and it preserves the most structured raw data. Fork C is the *least* reversibility-friendly — its raw data (behavioral traces) does not natively support the other two forks' calibration needs.

### Which fork is most consistent with the game-loop discovery?

`questions-game/individual-fidelity/discovery.md` H-2 proposes a 5-component construct map for fidelity: **vocabulary, relations, rules, exceptions, application**. This is *natively a Q-matrix* — each component is a skill, each probe is tagged with the components it tests. The "calibration queue" output (D-4) and the "likely-source ∈ {head, spec, ambiguous}" field (H-1) are diagnostic decisions per-item-per-skill, not gradient updates on a scalar. This fits Fork B substantially better than Fork A or C. Lens 2's G6 candidate operationalizations for OQ-1 (logical, test-retest, internal-consistency, hierarchical-Guttman, transferable) also lean Fork B for "hierarchical-Guttman" (a Q-matrix prerequisite ordering) and Fork A for "internal-consistency" — but the game loop's question taxonomy is built around component-tagged probes, which is Fork B's native unit.

The `questions-game/README.md` also lists `learning-velocity` and `abstraction-level` as separate planned discoveries — `learning-velocity` will be Fork-A-friendly (rate of θ change), `abstraction-level` will probably need a custom construct (not cleanly any of the three).

---

## Section 5 — Recommendation (defeasible)

**The user decides. This is a recommendation, not a pre-commitment.**

If forced to recommend, I would tentatively favor **Fork B (knowledge-state vector / CDM)** for the following four reasons:

1. **Best alignment with the sibling game-loop discovery.** `individual-fidelity` H-2's 5-component construct map *is* a Q-matrix in everything but name; Fork B formalizes what the game-loop design is already converging on.
2. **Strongest fit to the theorem's V/H/D axis** (per the Section 2 matrix row). Fork B's binary skill vector is literally a schema/instance split — schema = Q-matrix, instance = a person's filling. This is the only fork that gives the head/spec/system triangle a non-decorative typed structure to share with the theorem layer.
3. **Best multi-component coverage in the C-9 distance stack.** Fork B is the only fork under which `d_graph(head_*, *)` and conditionally `d_math(head_*, *)` are even definable.
4. **Highest reversibility.** A Q-matrix-organized evidence base can be coarsened into Fork A later; the reverse is not true.

**Counterarguments the user should weigh against this recommendation:**

- Fork B requires substantial upfront expert effort to author the Q-matrix, and the Q-matrix is *itself* contested across experts — this is the classic CDM identifiability problem.
- Fork B has the *least* compatibility with the Dang et al. 2020 finding (Lens 2 P5) that declared and behavioral knowledge are distinct constructs. A Fork-A-plus-Fork-C two-construct design might survive the next 10 years of cognitive-science literature better than a single Fork B commitment.
- The discovery already commits to anti-dashboard discipline (H-11 / G-11). Fork B's natural output (per-skill diagnosis) is the most anti-dashboard-compatible — but a critic could argue this is also the most easily *misused* as a per-person skill ranking, which is exactly the consequential-validity threat (Lens 2 P10).

**What I am explicitly NOT doing:** pre-committing to a number, a power-analysis target, a tooling stack, or a sample-size threshold. Those are downstream of the fork choice and would need a separate dispatch if the user picks Fork B.

---

## Section 6 — Open questions for the decision-gate

These are questions the user might want answered (or to answer for themselves) before deciding:

- **DQ-1. Cross-person comparability vs within-person trajectory tracking — which is the primary product job?** Fork A is best for cross-person; Fork C is best for within-person trajectory; Fork B sits between them but biases toward cross-person diagnosis. The product framing of v0.4.0 leaves this ambiguous (H-4's distances include both `d(head_i, head_j)` and improvement language at OQ-8). A decision here implicitly biases the fork choice.

- **DQ-2. Is the first user the author or external users?** `individual-fidelity` D-3 commits to "first player is the DomainSpec author." If the long-run target user is an external SME using DomainSpec for an unfamiliar domain, Fork B (skill diagnosis) is more useful than Fork A (single ability score) — but if the long-run target is benchmarking many users against each other, Fork A is the only one with the right comparability machinery.

- **DQ-3. How much upfront Q-matrix authoring effort is acceptable?** Fork B's day-1 cost is dominated by Q-matrix design. If the user is unwilling to commit to writing a Q-matrix per task family before the first experiment, Fork B is operationally impossible and the choice collapses to A vs C.

- **DQ-4. Should the v1 commitment be a single construct, or a two-construct split (declared + operational)?** This is the Dang et al. 2020 question from Lens 2 P5. A two-construct split is more defensible psychometrically but doubles the calibration cost. The "one construct, multiple components" position is what Fork B naturally produces; the "two constructs, different math" position requires an A+C combination.

- **DQ-5. How important is theorem-side coupling (V/H/D axis fit) in the first year?** If the answer is "very important — we want the head/spec/system triangle typed as a categorical structure soon," Fork B is the only candidate that gets there. If the answer is "the theorem is a long-horizon ambition, day-1 product can ignore it," Fork A's mathematical cleanness becomes more attractive.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [`../discovery.md`](../discovery.md) | `derives-from` | Source of H-1 (`C_head` definition), H-9 (direct/inferred channels), H-4 (geometry framing), and the "First useful product distances" table that this fork analysis exists to make computable. |
| [`../findings.md`](../findings.md) | `derives-from` | F2 names the three-construct fork as the load-bearing missing piece; P-A names the construct-type-before-carrier dependency. |
| [`../lenses/axis-psychometric-geometric/findings.md`](../lenses/axis-psychometric-geometric/findings.md) | `derives-from` | P1 is the most direct source for the three-fork enumeration; P5, P11, G1, G12 inform Sections 2, 4, and 5. |
| [`v0.5.0-patch.md`](v0.5.0-patch.md) | `derives-from` | M5 deferred the construct-type choice to this decision-gate session and marked all `d(head_*, *)` rows `conjecture-pending-C_head-decision`. |
| [`../../two-layer-retrieval/discovery.md`](../../two-layer-retrieval/discovery.md) | `cites` | C-9 distance stack — Section 2's "Compatible C-9 distance components" row evaluates each fork against this stack. |
| [`../../questions-game/individual-fidelity/discovery.md`](../../questions-game/individual-fidelity/discovery.md) | `cites` | H-2's 5-component construct map informs Section 4's game-loop consistency analysis. |
| [`/Users/victorboscaro/domainspec-theorem/FRAMEWORK-IMPLICATIONS.md`](/Users/victorboscaro/domainspec-theorem/FRAMEWORK-IMPLICATIONS.md) | `cites` | V/H/D axis decomposition — Section 2's "Fit to the theorem's V/H/D axis" row evaluates each fork against the closed Lean results. |
