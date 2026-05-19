---
tags: [vault, lens-findings, two-layer-retrieval, yoneda, faithfulness]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Formal Faithfulness (Yoneda-indexed criterion)

## Objective

Derive the formal faithfulness criterion for retrieval over a typed-edge category; prove vector-only retrieval cannot satisfy it; show graph-aware retrieval is the minimum architecture that can.

## Findings

**Notation.** $\mathcal{C}$ = the typed-edge category (objects = nodes typed by $\tau : \mathrm{Ob}(\mathcal{C}) \to \mathcal{T}$ with $\mathcal{T} = \{\text{premise, constitution, axiom, conceptual, discovery, session}\}$; morphisms typed by an edge law $\mathcal{E} \subseteq \mathcal{T}\times\mathcal{T} \times \mathrm{EdgeKinds}$, $\mathrm{EdgeKinds} = \{\text{derives-from, cites, contradicts, governs, supersedes}\}$). The vault is the presheaf $\mathcal{G} = \mathrm{y}_\mathcal{C} : \mathcal{C} \hookrightarrow \widehat{\mathcal{C}} := \mathbf{Set}^{\mathcal{C}^{\mathrm{op}}}$. $\mathrm{Sub}(\mathcal{G})$ is the poset of subpresheaves of $\mathcal{G}$.

### A. Retrieval as a functor

Let $\mathcal{Q}$ be a small category of queries (morphisms = refinements). A **retrieval operation** is a functor
$$R : \mathcal{Q} \to \mathrm{Sub}(\mathcal{G}),$$
sending each query to the subpresheaf returned, and each refinement $q \to q'$ to a monomorphism $R(q') \hookrightarrow R(q)$ (refinement narrows; functoriality enforces respect for the refinement lattice).

### B. Faithfulness condition

Write $\iota_q : R(q) \hookrightarrow \mathcal{G}$ for the structural inclusion. For each retrieved node $n \in R(q)$, the inclusion induces
$$\iota_q^* h_n^{R(q)} \;\to\; h_n^{\mathcal{G}}, \qquad h_n^{X}(c) := \mathrm{Hom}_{X}(c, n).$$

**Definition (faithfulness).** $R$ is *faithful to the two-layer structure* iff for every $q$ and every $n \in R(q)$, this comparison is a natural isomorphism. Equivalently: $\iota_q$ is **full** on every retrieved node — $R(q)$ inherits, without addition or deletion, the typed-edge structure $\mathcal{G}$ assigns to its retrieved nodes.

By Yoneda, $n \cong m$ in $\mathcal{G}$ iff $h_n \cong h_m$ naturally. So the condition above is the smallest condition that forces *node identity in $R(q)$ to coincide with node identity in $\mathcal{G}$*.

### C. Vector-only retrieval cannot be faithful (proof-grade)

Let $e : \mathrm{Ob}(\mathcal{C}) \to S^{d-1}$ be a body-embedding map, and let $R_v(q) := \mathrm{top}_K(e(q), e(-); \cos)$. The factorization
$$\mathcal{Q} \xrightarrow{e} (\mathbb{R}^d, \cos) \xleftarrow{e} \mathcal{C} \to \mathrm{Sub}(\mathcal{G})$$
gives $R_v$ no access to $\mathrm{EdgeKinds}$ or $\tau$. Three impossibility statements:

**(C1) No typed-edge preservation.** $(\mathbb{R}^d, \cos)$ is thin and symmetric; between any two points, at most one comparison of type $\mathbb{R}$. It admits no functor to the typed-edge $\mathrm{EdgeKinds}$-graded hom-set unless that grading is recoverable from $\cos(e(x), e(y))$ — which by construction it is not. The codomain has $\geq 2$ distinguishable hom-elements (typed), the domain has $\leq 1$. ∎

**(C2) No type stratification.** $\tau$ is discrete. $e$ does not factor through $\tau$: for embeddings trained on bodies, $e(\text{premise } p) \approx e(\text{discovery } d)$ whenever bodies are paraphrases. $R_v$ returns $p$ and $d$ with no separator; the induced subpresheaf collapses the type-fibers and cannot be a subpresheaf of $\mathcal{G}$ once we ask for $\tau$-respecting structure.

**(C3) Counterexample to the Yoneda identity criterion — the supersedes pathology.** Let $\mathcal{C}$ have two nodes $n, m$ with identical bodies ($e(n) = e(m)$) but $\mathcal{G}$ contains a `supersedes` edge $n \to m$ and no edge $m \to n$. Then $h_n \not\cong h_m$ — they differ at the component $h_n(m) = \{\text{supersedes}\}$, $h_m(m) = \{\mathrm{id}\}$. $R_v$ cannot distinguish them: for any $q$ with $\cos(e(q), e(n)) = \cos(e(q), e(m))$, the top-$K$ output treats $n, m$ as interchangeable. Hence $R_v$ violates the faithfulness condition. ∎

This is the *supersedes pathology* concretely: a paper and its retraction have near-identical bodies and opposite edge semantics. Vector RAG returns them as equivalent. The framework returns them as distinct.

### D. Graph-aware retrieval is the minimum (theorem-grade sketch)

Let $R_g : \mathcal{Q} \to \mathrm{Sub}(\mathcal{G})$ be a retriever with access to both $e$ and $\mathrm{Hom}_\mathcal{C}(-, -)$, defined by: (i) seed-set $S(q) := \mathrm{top}_K(e(q), e(-))$; (ii) closure $R_g(q) := $ the full subpresheaf of $\mathcal{G}$ spanned by $S(q)$ together with all $\mathcal{G}$-edges among $S(q)$.

**Proposition (sufficiency).** $R_g$ is faithful. *Proof:* by construction, $\iota_q : R_g(q) \hookrightarrow \mathcal{G}$ is a *full* subpresheaf inclusion, so for each $n \in R_g(q)$ and each $c \in R_g(q)$, $\mathrm{Hom}_{R_g(q)}(c, n) = \mathrm{Hom}_\mathcal{G}(c, n)$. The Yoneda comparison is an equality. ∎

**Proposition (necessity / minimum-requirement theorem).** Any retriever $R$ that does not read the typed-edge structure $\mathrm{Hom}_\mathcal{C}(-,-)$ — formally: any $R$ that factors through a category $\mathcal{M}$ with a forgetful functor $U : \mathcal{C} \to \mathcal{M}$ that is not faithful on hom-sets — fails the faithfulness condition. ∎

So *graph-awareness is not an optimization, it is the minimum*: any faithful retriever must factor through $\mathcal{C}$ via a hom-faithful functor.

### E. Query-intent conditioning (formal)

Let a query $q$ come equipped with a **demand functor** $D_q : \mathcal{G} \to \mathcal{S}_q$, where $\mathcal{S}_q$ is a presheaf category over a typically smaller typed-edge category $\mathcal{C}_q$ (e.g., $\mathcal{C}_{\text{"what contradicts Y"}}$ retains only `contradicts` and `supersedes`). $D_q$ is a projection: it forgets edge kinds, type strata, or both.

**Definition ($q$-faithfulness).** $R$ is **$q$-faithful** iff the diagram
$$
\begin{array}{ccc}
R(q) & \hookrightarrow & \mathcal{G} \\
\downarrow D_q|_{R(q)} & & \downarrow D_q \\
D_q(R(q)) & \hookrightarrow & \mathcal{S}_q
\end{array}
$$
commutes and the bottom inclusion is *full* in $\mathcal{S}_q$.

**Proposition.** $R_g$ extended along $D_q$'s edge class is $q$-faithful for every $q$. $R_v$ is $q$-faithful only when $D_q$ projects to the **discrete** $\mathcal{S}_q$ (edges forgotten entirely), i.e., when $q$'s intent makes no demand on the schema layer.

### F. Boundary regimes

1. **Pure semantic similarity ($D_q$ discrete).** Faithfulness reduces to "the returned object set is the right object set." $R_v$ and $R_g$ coincide modulo recall.
2. **Vacuous regime (out-of-vault query).** $D_q(\mathcal{G}) = \emptyset \Rightarrow R(q) = \emptyset$ trivially.
3. **Schema-residue regime (M2 wall).** Query intent ranges over a richer $\mathcal{C}_q$ than the vault's schema — the §3.3 schema-residue / M2 conjecture re-surfacing inside retrieval. No retriever can repair it without changing $\mathcal{C}$.
4. **Instance-residue regime (Skolem witnesses).** $D_q$ demands edges that exist in $\mathcal{C}$ but whose endpoints have not been populated — retrieval can only return $\Sigma_\Delta$-style Skolem witnesses or $\Pi_\Delta$-style enumerations.

A fifth: **morphism-symmetry collapse** — if $\mathcal{C}_q$ is thin (at most one morphism between any two objects), the Yoneda identity criterion collapses to set membership, and keyword search suffices.

### Status of each claim

- §A, §B, §E: **definitions** (no theorem content beyond well-formedness).
- §C1, §C2, §C3: **proof-grade impossibility / counterexample** (C3 is the load-bearing one — minimal, two-node, schema-driven).
- §D sufficiency: **proof** (immediate from full-subpresheaf construction).
- §D necessity: **proof sketch** (relies on the hom-faithfulness reduction; clean but unformalized).
- §F items 3–4: **conjectural reductions** of the retrieval criterion to the open M2 / M6′ conjectures.

## Caveats

- **§C1–C3 are proof-grade as formal properties of a category-theoretic model of retrieval.** They say "no embedding-only functor can distinguish these two configurations," NOT "vector RAG benchmarks badly." The empirical separation between formal and observed failure is lens 03's job; this lens deliberately does not establish empirical benchmark claims.
- The prose in §C3 ("Vector RAG returns them as equivalent. The framework returns them as distinct") reads empirical but is rigorously a statement about model expressiveness. A reader skimming §C may conflate the two registers; the discovery's §6 epistemic-honesty table is the authoritative separator.
- §D's necessity argument is proof-sketch only, not formalized in Lean. If it does not formalize cleanly under Lean queue 0003, the load-bearing necessity claim weakens to "supported but not proven."
- §F items 3–4 reduce open conjectures of the framework (M2, M6′) into retrieval; they do not resolve them.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
