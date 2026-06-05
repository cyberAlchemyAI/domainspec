---
tags: [vault, discovery, ontology, residue, attractor, reflection-tower, yoneda, lawvere]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
version: 0.2.1
last_updated: 2026-05-19
---

# Graph as Residue Attractor

> **v0.2.0 update (2026-05-18):** This discovery was originally drafted on 2026-05-17 directly from the 7 lenses, without an intermediate research-layer document. On 2026-05-18 a post-hoc `research/research.md` and `research/research-synthesis.md` were added under the new vault convention. The discovery's commitments were not edited; the version bump records the structural alignment. If the post-hoc research surfaces tensions with current commitments, those are filed as open questions in `research.md` for a future v0.3.0.

> The graded knowledge graph (premise / constitution / axiom × conceptual / discovery / session, with typed edges and a condensation operator) is conjectured to be the **within-level attractor of two-layer residue accounting on the operation "curate a body of knowledge"**, with uniqueness across levels migrating to a canonical reflection tower.

## Objective

Codify the design space explored across four primary lenses, two corroborated re-runs, and one adversarial precedent check, around the claim that the vault's graded-graph structure is not a design choice but the unique stable form of knowledge curation under two-layer residue accounting. Record which pieces of the claim are mathematically load-bearing, which are metaphor / framing, and which are empirical bets awaiting falsification.

---

## Epistemic posture (read this before the technical sections)

This discovery deliberately separates **theorems we cite**, **theorems-as-applied (analogies we draw)**, and **guiding metaphors**. The same paragraph can mix all three; we mark them.

- **Theorem-cited.** A formally proved result with a verified primary or secondary source. We may invoke it, but its content lives in the source — we do not re-prove it here. Examples in this discovery: Gödel G1/G2, Tarski undefinability, Löb, Lawvere 1969 fixed-point, Yoneda lemma.
- **Theorem-as-applied.** A claim of the form "*structure X in our system instantiates the hypotheses of theorem T, therefore T's conclusion applies to X*". The application is itself a mathematical claim, and it is **only as load-bearing as the demonstration that the hypotheses are met**. In this discovery, most "applied to the graph" sections are theorem-as-applied at the level of *informal* hypothesis-check; they are not Lean-grade. Treat them as guiding constraints — useful but not yet proofs.
- **Guiding metaphor / heuristic.** A framing that imports vocabulary from a formal system without claiming hypothesis-match. Useful for thinking; provides no deductive weight. The discovery's headline phrase "residue attractor" is in this category until a fixed-point statement is actually proved against a concrete category.

**Per-claim flags.** Where a claim is borderline, we mark it inline as `[theorem-cited]`, `[theorem-as-applied, informal]`, or `[metaphor]`. The Kauffman lens (05) is the audit against over-claiming; its verdict is honored throughout.

---

## 1. Business Context

### Why now

Four independent conversations across four repositories landed on the same graded-graph construction in the same hour. Around the same time the two-layer framework in `/domainspec-theorem` codified the proposition that any translation operation has two independent symmetries with two independent residues that do not reduce (Noether-flavored). Together, those two observations posed the question: *is the vault's graded graph the design we happened to draw, or the only stable shape the operation "curate knowledge" can land on?* Every downstream design — two-layer retrieval, two-layer platform architecture, folder-structure fractal — derives load-bearing constraints from whichever answer we adopt. The investigation was launched to figure out which answer is honestly available, and at what confidence.

### What's broken (claims the design space surfaced)

- The initial "unique fixed point" formulation is **refuted** by Lawvere's diagonal theorem in any setting where the truth-object is binary and the naming map is point-surjective (see [lenses/03c-lawvere-yanofsky-corroborated/findings.md](lenses/03c-lawvere-yanofsky-corroborated/findings.md) §4). The slogan "the graph is the unique attractor of κ" cannot stand without qualification. `[theorem-cited]`
- Two slogans of the system — "a node *is* what its typed edges say it is" and "two agents *have converged* iff their hom-presheaves agree per node" — are stated colloquially in earlier vault docs without proof. Yoneda upgrades both to theorems *if* the typed-edge category is well-defined and locally small ([lenses/04-yoneda-lemma/findings.md](lenses/04-yoneda-lemma/findings.md) §B.2). `[theorem-as-applied, informal — depends on identifying the right base category]`
- The condensation operator has no falsifiable geometric realizer in the current vault. EVōC (Tutte Institute, McInnes 2024) is proposed as a candidate; it has not been run on a real vault yet ([lenses/02-evoc-algorithm/findings.md](lenses/02-evoc-algorithm/findings.md) §4). `[empirical bet, not yet tested]`
- Schema/instance alignment has four flagged residues — convicção (schema-only), schema-meta evolution, derives-chain circularity, governs-edges enforcement — at which the framework predicts new constitutions will emerge ([lenses/01-invariants-and-layer-alignment/findings.md](lenses/01-invariants-and-layer-alignment/findings.md) §C). The prediction has not been tested over time. `[empirical bet]`
- Two of the twelve schema invariants (S7 promotion-as-homomorphism, S12 governs-only-from-constitution) lack uniqueness sketches ([lenses/01-invariants-and-layer-alignment/findings.md](lenses/01-invariants-and-layer-alignment/findings.md) §D). They may be descriptive theorems *about* the GKG rather than constituents of it. `[honest gap]`

### What stays the same

- The two-layer framework in `/domainspec-theorem` is the input premise; this discovery does not attempt to revise it.
- The existing `vault/ontology-conventions.md` schema (node_type / layer / nature / status / veracidade / convicção / tags + edge catalog) is the schema-side object the discovery talks *about*; it is not modified by this discovery.
- The discovery is exploratory; nothing here is yet a constitution, axiom, or premise. Promotion to those node types requires its own gate per the epistemic chain.
- Source PDFs and URLs cited in the lenses (Gödel/Tarski/Löb/Lawvere/Yoneda primary and secondary literature) are out of scope — we cite their conclusions; we do not re-derive them.

---

## 2. Core Concepts

### C1. Two-layer residue accounting

From `/domainspec-theorem`'s two-layer framework. The operation κ "curate a body of knowledge" is decomposed into a schema-layer symmetry (renaming invariance of node/edge types) and an instance-layer symmetry (re-realization invariance of populated content). Each symmetry has its own conserved current (after Noether) and its own residue (what fails to round-trip). The residues are independent: closing one does not close the other. `[theorem-cited (Noether), theorem-as-applied (the two symmetries claim is the framework's, treated here as input)]`

### C2. The graded knowledge graph (GKG)

Nodes typed by the product `{premise, axiom, constitution} × {conceptual, discovery, session}`; edges typed by `{derives-from, contextualizes, governs, implements, contradicts, ...}` (full 21-edge catalog in `vault/ontology-conventions.md` Appendix C); a condensation operator promoting nodes through `draft → exploratory → active → consolidated → evergreen`. The headline conjecture is that GKG is the within-level attractor of κ under C1.

### C3. Within-level attractor (vs unique fixed point)

The initial "unique fixed point" framing was refuted (see Lawvere's diagonal applied to a binary truth-object). The corrected framing is: **uniqueness holds within a single level $\mathcal{G}_n$ of a canonical reflection tower; across levels uniqueness migrates to the tower itself.** This is the load-bearing structural revision the discovery defends. `[theorem-as-applied — depends on the tower being canonical, which is itself only argued informally below]`

### C4. Residue as Lawvere diagonal witness

Each instance state whose characteristic predicate is not nameable as a constitution at level $\mathcal{G}_n$ is, formally, a Yanofsky $g(x) = \alpha(f(x,x))$ — the diagonal element of an unrepresentable map. Promoting that residue to a new constitution at $\mathcal{G}_{n+1}$ is the Feferman reflection step. `[theorem-as-applied — the identification of "residue" with the diagonal element is a structural analogy, not a proven correspondence between the framework's residue calculus and Yanofsky's construction]`

### C5. EVōC as geometric realizer of condensation

EVōC's persistence hierarchy is proposed as a candidate operational realizer of the condensation operator. Each persistence level becomes a candidate stage; parent-cluster pointers become candidate condensation maps; convergence between agents becomes bottleneck distance on persistence diagrams. `[empirical bet — has not been run on a real vault; the algorithm itself is unpublished and the cluster-extraction step cites PLSCAN (Bot, McInnes, Aerts, 2025)]`

### C6. Yoneda upgrades two slogans to theorems

Identify each node $n$ with the presheaf $h_n := \mathrm{Hom}(-, n)$ on the typed-edge category. Then $n \cong m \iff h_n \cong h_m$ naturally (forced identity criterion), and "two agents have converged" gets a basis-free, metric-free definition (convergence iff per-node hom-presheaf isomorphism). `[theorem-as-applied — the typed-edge category must actually be locally small and the right base; if agents disagree on edge typing, their presheaf categories are over different bases and Yoneda is silent]`

---

## 3. Decisions taken (and their epistemic status)

### D-1. Replace "unique fixed point" with "within-level attractor of a canonical reflection tower"

**Decision.** The structure-theorem statement for the GKG is to be written in the reflection-tower form, not the flat fixed-point form. The headline phrasing is: "within level $\mathcal{G}_n$ with truth-object $Y_n$ chosen so that all $\sigma$ arising from $\mathcal{G}_n$-constitutions have fixed points in $Y_n$, $\mathcal{G}_n$ is the within-level attractor; uniqueness across the tower $\mathcal{G}_0 \subset \mathcal{G}_1 \subset \dots$ is uniqueness of the *tower*."

**Rationale.** The flat form is refuted by Lawvere 1.2 / Yanofsky Theorem 1 whenever the truth-object admits a fixed-point-free endomorphism (e.g., $Y = 2$ with negation). The tower form is the strongest honest reformulation: it survives Lawvere by stratifying, survives Tarski by stratifying truth predicates, and survives Löb by paying for reflection in axioms rather than schemas. The argument is corroborated by hard-fetched primary sources in [lenses/03c-lawvere-yanofsky-corroborated/findings.md](lenses/03c-lawvere-yanofsky-corroborated/findings.md) and the Gödel/Tarski/Löb side in [lenses/03b-godel-tarski-lob-corroborated/findings.md](lenses/03b-godel-tarski-lob-corroborated/findings.md).

**Status.** Adopted as the working formulation. Still `[theorem-as-applied, informal]` until a Lean-grade or paper-grade statement actually demonstrates the hypotheses against a concrete category extracted from the vault.

### D-2. Treat lens 03 as load-bearing only via the corroborated re-runs

**Decision.** Lens [03](lenses/03-godel-lawvere-limits/findings.md) is preserved as the original synthesis but flagged `verification: [model-recall]`. The corroborated lenses [03b](lenses/03b-godel-tarski-lob-corroborated/findings.md) (Gödel/Tarski/Löb, hard-fetched) and [03c](lenses/03c-lawvere-yanofsky-corroborated/findings.md) (Lawvere/Yanofsky, hard-fetched against the Lawvere 1969 TAC reprint PDF and arXiv math/0305282) are the citable load-bearing forms.

**Rationale.** Per the memory rule on epistemic honesty: a "rule" backed only by training-time recall is heuristic, not theorem. The hard-fetched re-runs do not materially change lens 03's content but they upgrade the source-chain. The verification ledger in 03c also records honest negatives (Pavlovic 1996, Bauer 2014, Kauffman 2009 Constructivist Foundations — none fetched).

**Status.** Adopted.

### D-3. Honor the Kauffman precedent check; reposition the framework's novelty claim

**Decision.** Per [lenses/05-kauffman-precedent-check/findings.md](lenses/05-kauffman-precedent-check/findings.md), the synchronic four-component synthesis (form-as-conserved + fractal self-similarity + strange-loop closure + emergence-via-residue) is **prior art under Kauffman's reflexive-domain / eigenform program** (ANPA paper and Kybernetes 2005). The framework's genuinely novel load-bearing pieces narrow to three: (i) the **diachronic** reflection tower (Kauffman is synchronic; he resolves paradox by Church-Curry, not by Feferman ascent), (ii) the **Spivak-style two-layer (structure/instance) separation** (Kauffman's domain is one expandable magma), (iii) the **explicit physics-precedent claim** invoking RG/Noether (zero hits for "renormaliz" or "noether" across all three open Kauffman PDFs, verified by grep). Future writeups must cite Kauffman for the prior-art base.

**Rationale.** The adversarial CE-1 partially lands. Refusing to honor it would be over-claiming.

**Status.** Adopted.

### D-4. Identify the M2 / M6′ Yoneda-load-bearing places explicitly

**Decision.** Per [lenses/04-yoneda-lemma/findings.md](lenses/04-yoneda-lemma/findings.md) §B.5, Yoneda is load-bearing in three places: M2 representability conjecture (the conjecture is literally a Yoneda-image question), M6′ base case (`$\Delta$ faithful $\iff$ $\mathrm{y}\Delta$ faithful` is a one-line corollary), and the forced identity-of-nodes criterion ($n \cong m \iff h_n \cong h_m$). Kan extensions, the adjoint triple $\Sigma \dashv \Delta^* \dashv \Pi$, and Lawvere's diagonal *use* Yoneda but their headline content is independent.

**Rationale.** Naming which results actually depend on Yoneda (vs which use it as scaffolding) is required to honor the math-vs-metaphor distinction. Without this triage, "Yoneda is everywhere" reads as decoration.

**Status.** Adopted.

### D-5. Omit `veracidade` / `convicção` from this discovery's frontmatter; flag per-claim inline

**Decision.** Per `vault/ontology-conventions.md` §6 Applicability — "discovery: per-option confidence belongs inline in the body" — this discovery carries no top-level veracidade/convicção. Per-claim confidence is surfaced via inline `[theorem-cited]` / `[theorem-as-applied, informal]` / `[metaphor]` / `[empirical bet]` flags.

**Rationale.** A single document-level score would collapse exactly the math-vs-metaphor distinction this discovery exists to defend. The schema's choice to omit the fields for discoveries is honored.

**Status.** Adopted.

---

## 4. Alternatives considered

### A-1. Keep the "unique fixed point" framing and pick a richer truth-object

**Sketch.** Drop binary $Y$; pick $Y$ = stages = $\{$ premise, constitution, axiom $\}$ with a non-trivial endomorphism that has fixed points. Lawvere then becomes constructive (asserts fixed points exist) rather than destructive (forbids point-surjective naming).

**Why rejected (for now).** Even with a richer $Y$, Lawvere only buys us *existence* of fixed points of specific $\sigma$, not *uniqueness* of the attractor. The reflection-tower formulation is strictly stronger and the across-levels uniqueness it offers (ordinal-analysis-grade, like Gentzen / Rathjen) is the right shape for the structure theorem. See lens 03c §5. **Alternative retained as a fallback** if the canonical-tower argument fails to materialize.

### A-2. Treat the four-component synthesis as the novel contribution; do not pursue the reflection tower

**Sketch.** Stake the framework's novelty on the synchronic four-component synthesis (form-as-conserved + fractal + strange-loop + emergence-via-residue) and the categorical formalization, and skip the diachronic tower.

**Why rejected.** [Lens 05](lenses/05-kauffman-precedent-check/findings.md) refutes this directly: Kauffman has the synchronic synthesis already in print. Pursuing it as novel would be inadvertent re-derivation.

### A-3. Replace EVōC with an in-house persistence algorithm

**Sketch.** Build a custom persistence-based clusterer rather than depend on EVōC's unpublished algorithm + PLSCAN cluster extraction.

**Why deferred.** EVōC's authorship (Leland McInnes / Tutte) and its specialization for embedding vectors gives it a head start. The unpublished-algorithm risk is real but the falsifiability of the convergence-as-bottleneck-distance metric is independent of which clusterer produces the persistence hierarchy. **Alternative retained** as a parallel path if EVōC empirical results disappoint or if the algorithm proves unstable in practice.

### A-4. Skip the physics-precedent (RG/Noether) framing

**Sketch.** Drop the analogy to renormalization-group flow and Noether's theorem; defend the two-layer residue construction on its own structural merits.

**Why noted but not adopted.** The RG/Noether framing is one of the three pieces that distinguish the framework from Kauffman's program (per D-3); dropping it shrinks the novelty claim to two pieces. However, the analogy itself is `[metaphor]` until either (a) a concrete RG-style flow on the GKG is defined and a fixed-point analysis is done, or (b) a concrete continuous symmetry of κ is identified and Noether's theorem actually applied. Until then the analogy is rhetorical. **Decision deferred** to the structure-theorem writeup.

---

## 5. Open questions

### OQ-1. Is the reflection tower's transfinite extension exactly iterated Yoneda?

Iterated Yoneda ($\mathcal{C} \mapsto \mathrm{PSh}(\mathcal{C}) \mapsto \mathrm{PSh}(\mathrm{PSh}(\mathcal{C})) \dots$) is the standard free-cocompletion tower; embeddings are fully faithful, left adjoints are colimit-preserving, Day convolution lifts monoidal structure. If the framework's reflection tower equals this shape, uniqueness up to equivalence at each level is the Yoneda-embedding uniqueness. If it equals a Feferman-style reflection sequence instead, the climb rate may differ. **Recommendation.** Define the tower in both forms and prove (or disprove) the equivalence on a small worked example.

### OQ-2. Do the four predicted residues empirically generate new constitutions in the next month?

The four flagged alignment residues — convicção (schema-only), schema-meta evolution, derives-chain circularity, governs-edges enforcement — are predictions, not proofs. **Recommendation.** Promote each to a `premise` file under `vault/premise/` with an explicit falsification test, then audit at +30 days.

### OQ-3. Does M2 representability hold for the specific category underlying the GKG?

The conjecture (`Functor.IsRepresentable` of `Δ.op ⋙ yoneda.obj b`) is precisely formulable in Lean. **Recommendation.** Encode the small worked example (3 schema nodes, 3 instance nodes, the four-object comma category) and run the test.

### OQ-4. What is the right truth-object $Y$ at each tower level?

Binary? Graded by stage? Richer (e.g., a Heyting algebra reflecting graded acceptance)? The choice determines which $\sigma$'s have fixed points and therefore which Lawvere instances bite. **Recommendation.** Start with $Y_n$ = stage-lattice; lift to richer objects if/when the stage lattice proves too coarse.

### OQ-5. Are S7 and S12 descriptive theorems about the GKG or generative constituents?

Lens 01 §D could not construct sharp uniqueness arguments for S7 (promotion-as-homomorphism) and S12 (governs-only-from-constitution). **Recommendation.** Either find the uniqueness argument or demote them from "schema invariants" to "observed regularities" with explicit downgrading in the next conventions revision.

### OQ-6. Do the boundary cases in lens 01 §E actually delimit GKG correctly?

Seven boundary statements were proposed (fully formal corpus trivializes, purely tacit starves, stage collapse saturates, schema drift becomes uninterpretable, no-human collapses I5, continuous domains need sheaves, adversarial contradicts-flooding). **Recommendation.** Encode each as a `test` document so degradation is observable.

### OQ-7. Does the unread Kauffman 2009 Constructivist Foundations paper add reflection-tower material?

[Lens 05](lenses/05-kauffman-precedent-check/findings.md) could not read this paper (gated). Probability `<15%` it introduces Feferman-style reflection that the ANPA paper omits, but cannot rule out. **Recommendation.** Obtain via free CF registration or ILL; re-run the precedent check if it adds material.

---

## 6. What would move this discovery

- A falsifiable empirical run of the EVōC pipeline on at least one existing vault (e.g., `/house_project/docs/vault/discovery/`), comparing its persistence hierarchy against existing premise/constitution/axiom assignments.
- Emergence of new constitutions at the four predicted residue points in the next month, or absence of them (either direction is information).
- A Lean-grade or paper-grade statement of within-level uniqueness in the reflection-tower form, on a concrete small category extracted from the vault.
- Independent reproduction of Lawvere/Yanofsky / Yoneda applications by an outside reader who has not seen these lenses.

---

## 7. Source dispatch

This discovery was promoted (lifecycle step 7 of the `/domainspec-subagents-strategy` skill, user-confirmed 2026-05-17) from the eight artifacts under [`lenses/`](lenses/) and the navigation [README.md](README.md):

- [README.md](README.md) — folder navigation, claim, status, next moves.
- [lenses/01-invariants-and-layer-alignment/findings.md](lenses/01-invariants-and-layer-alignment/findings.md) — schema/instance invariants, alignment residues, uniqueness sketches, boundary statements.
- [lenses/02-evoc-algorithm/findings.md](lenses/02-evoc-algorithm/findings.md) — EVōC research note and pipeline proposal.
- [lenses/03-godel-lawvere-limits/findings.md](lenses/03-godel-lawvere-limits/findings.md) — original Gödel/Tarski/Löb/Lawvere synthesis (model-recall; superseded for citation purposes by 03b/03c).
- [lenses/03b-godel-tarski-lob-corroborated/findings.md](lenses/03b-godel-tarski-lob-corroborated/findings.md) — hard-fetch re-run of the logic side.
- [lenses/03c-lawvere-yanofsky-corroborated/findings.md](lenses/03c-lawvere-yanofsky-corroborated/findings.md) — hard-fetch re-run of the categorical side, primary sources.
- [lenses/04-yoneda-lemma/findings.md](lenses/04-yoneda-lemma/findings.md) — Yoneda load-bearing assessment.
- [lenses/05-kauffman-precedent-check/findings.md](lenses/05-kauffman-precedent-check/findings.md) — adversarial precedent check against Kauffman's reflexive-domain / eigenform program.

The convergence trigger (four independent conversations in the same hour across four repositories landing on the same graded-graph construction) is recorded in the README's Business Context paragraph; no session log for that convergence currently exists in the vault.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/graph-as-residue-attractor/research/research.md` | `derives-from` | Post-hoc cross-lens synthesis (backfilled 2026-05-18) — the canonical research-layer source for this discovery. |
| `vault/discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment/findings.md` | `derives-from` | Invariant catalog (12+12), alignment table, four flagged residues, S7/S12 honest gaps — informs C2, C4, OQ-2, OQ-5. |
| `vault/discovery/graph-as-residue-attractor/lenses/02-evoc-algorithm/findings.md` | `derives-from` | EVōC as candidate geometric realizer of condensation — informs C5, A-3. |
| `vault/discovery/graph-as-residue-attractor/lenses/03-godel-lawvere-limits/findings.md` | `derives-from` | Original `[model-recall]` synthesis that triggered the reflection-tower reformulation — informs C3, D-2; load-bearing only via 03b/03c. |
| `vault/discovery/graph-as-residue-attractor/lenses/03b-godel-tarski-lob-corroborated/findings.md` | `derives-from` | Hard-fetch logic-side corroboration — informs D-1, D-2. |
| `vault/discovery/graph-as-residue-attractor/lenses/03c-lawvere-yanofsky-corroborated/findings.md` | `derives-from` | Hard-fetch categorical-side corroboration with "weakly point-surjective" precision — informs D-1, D-2. |
| `vault/discovery/graph-as-residue-attractor/lenses/04-yoneda-lemma/findings.md` | `derives-from` | Yoneda load-bearing triage and embeddings-as-restricted-Yoneda bridge — informs C6, D-4. |
| `vault/discovery/graph-as-residue-attractor/lenses/05-kauffman-precedent-check/findings.md` | `derives-from` | Adversarial precedent check; narrows novelty claim to three pieces — informs D-3, OQ-7. |
| `vault/ontology-conventions.md` | `cites` | The 21-edge catalog, node-type vocabulary, and §6 Applicability rule (omit veracidade/convicção for discoveries) are load-bearing for D-5 and for the GKG description in C2. |
| `vault/discovery/certification-on-the-wrong-object/discovery.md` | `derives` | Downstream diagnosis: consequence (d) sharpens this node's four predicted residues / "prediction not tested over time" flag into a missing-error-term claim over tower iteration. |
