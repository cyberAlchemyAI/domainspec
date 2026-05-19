---
tags: [vault, discovery, ontology, retrieval, two-layer, graphrag, yoneda]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: exploratory
version: 0.2.0
last_updated: 2026-05-18
---

# Two-Layer Retrieval: Discovery

> **v0.2.0 post-hoc alignment note (2026-05-18).** This discovery was originally drafted on 2026-05-17 directly from the 4 lens findings without an intermediate research-layer document. On 2026-05-18 a `research/` layer (`research.md` + `research-synthesis.md`) was retrofitted in to align with the new lens → research → discovery convention proven on `graph-as-residue-attractor`. The discovery's claims were not edited; only the upstream provenance chain was structurally aligned. Any tensions surfaced by the post-hoc independent read are filed as open questions in `research.md` for a future v0.3.0.

> A retriever over the graded vault must read **both** schema-layer structure (typed edges, node types, stages, verification) **and** instance-layer content (body embeddings). Pure vector retrieval cannot in principle satisfy the vault's own identity criterion on structurally-demanding queries; the minimum faithful architecture composes body-similarity, edge-traversal, and type/stage/verification filters under **query-intent conditioning**.

---

## Objective

Codify the design space for retrieval over the graded knowledge vault: which retrieval architectures are admissible given the vault's own identity criterion, which alternatives the field has published, and which trade-offs remain open. End state: a documented exploration whose decisions and open questions ground a future architecture spec under `two-layer-platform-architecture/` (subsystem: `graph_retrieval`).

---

## 1. Business Context

### Why now

The parent discovery [`graph-as-residue-attractor`](../graph-as-residue-attractor/) defines node identity through the Yoneda hom-presheaf — a node is what its typed-edge neighborhood is, not what its body says. A retriever that operates only on body-text similarity therefore violates the vault's own identity criterion at query time. Without a retrieval architecture that respects schema-layer structure, the framework's predictions become unfalsifiable: queries that should distinguish a paper from its retraction (the *supersedes pathology*) cannot, because their bodies are near-identical and only the edge differs.

### What's broken (in the current design space)

- **Body-only similarity collapses typed edges.** Documented across 7/10 surveyed failure modes (lens 03 §A, F1, F2, F5, F8) including multi-hop QA on MuSiQue and global sensemaking on Microsoft GraphRAG's Novorossiya example. *Formal counterpart:* lens 02 §C1 (no typed-edge preservation) and §C3 (supersedes-pathology counterexample) — load-bearing because they are derivations, not benchmarks.
- **Body-only similarity collapses node types.** 5/10 failures (lens 03 §A, F3, F4, F6, F7, F10) including CVT-node misreads in Mindful-RAG and schema-bound KPI query collapse documented in `arXiv:2506.05690` (vector RAG ≈0% vs. optimized GraphRAG 90%+). *Formal counterpart:* lens 02 §C2 (no type stratification).
- **Identity violation on near-identical bodies.** 6/10 failures (lens 03 §A) plus the formal Yoneda counterexample (lens 02 §C3): `e(n) = e(m)` with a `supersedes n → m` edge yields `h_n ≢ h_m` in the vault, but vector top-K returns them as interchangeable.
- **No published GraphRAG variant exposes the full combination needed.** Lens 01 §B: pre-existing typed edges + query-intent-conditioned layer composition + evidence-stage filtering + verification-provenance ranking + Yoneda identity check is **absent from the literature surveyed**. Closest single papers: NodeRAG (heterogeneous node types — hard-coded 7), REANO (query-conditioned edge attention — no stage/provenance), KG2RAG (pre-existing edges — no intent routing).

### What stays the same

- Pure vector retrieval remains correct for **simple-fact / pure-lookup queries** where the answer's identity does not depend on type/edge/stage structure. Lens 03 §C contrary finding: vector RAG scores 83.2% evidence recall on simple facts in `arXiv:2506.05690`, beating GraphRAG. The two-layer retriever's claimed advantage is **scoped to structurally-demanding queries**, not universal.
- The vault's existing frontmatter schema, edge catalog, and node-type taxonomy are inputs to this discovery, not outputs. Schema evolution belongs in `ontology-conventions.md` and `two-layer-platform-architecture/` (kernel + frontmatter ownership), not here.
- Body embeddings remain a first-class signal. The architecture composes vector similarity with structural signals; it does not replace one with the other.
- Architecture and prototype implementation are **out of scope** for this discovery. They belong to the application-side counterpart at `internal_tools/graph_retrieval/features/two-layer-retrieval/` (referenced, not authored here).

---

## 2. Core Concepts

### C-1. Retrieval as a functor `R: Q → Sub(G)`

A retrieval operation is a functor from a query category `Q` (with refinements as morphisms) into the poset of subpresheaves of the vault `G`. Refinement narrows; functoriality enforces respect for the refinement lattice. (Lens 02 §A.) **Why this framing:** it makes "faithful" precisely definable rather than leaving it as a quality claim.

### C-2. Faithfulness = Yoneda-commutation up to natural iso

`R` is faithful iff for every retrieved node `n ∈ R(q)`, the inclusion `R(q) ↪ G` is **full on n** — `R(q)` inherits without addition or deletion the typed-edge structure `G` assigns to `n`. By Yoneda this is the smallest condition that forces node identity in `R(q)` to coincide with node identity in `G`. (Lens 02 §B.) **Why this framing:** it identifies the minimum requirement, not an optimization target.

### C-3. Two-layer composition

A faithful retriever reads two layers:
- **Schema layer** — typed edges, node types, evidence stages, verification provenance. Operated on by graph traversal, type/stage filters, edge-typed reachability.
- **Instance layer** — body embeddings. Operated on by cosine similarity.

Neither layer alone is sufficient on structurally-demanding queries (lens 02 §C1–C3). The minimum architecture composes them. (Lens 01 §C Option 3; lens 04 §B.)

### C-4. Query-intent conditioning

The *composition* of the two layers is not fixed at training time — it is selected per query by an **intent classifier**. Lens 04 §B proposes eight intents (Canon, Provenance, Frontier, Tension, Semantic, Blast-radius, Lens-triangulation, Definitional), each with a different ranking function composing body-similarity, edge-traversal, type filter, stage filter, and verification prior. **Why this framing:** lens 01 §B shows no published GraphRAG composes different layer stacks per intent — the closest precedents (REANO's query-conditioned edge attention, GraphRAG's user-selected global/local/DRIFT modes) either fix the stack or expose only 2–3 hardcoded modes.

### C-5. Verification-provenance as ranking signal (novel)

The vault's `verification` facet (`local-files-read`, `web-fetched`, `model-recall`, etc.) and its `evidence_stage` lattice (`draft → exploratory → active → consolidated → evergreen`) are first-class ranking inputs, not metadata. Lens 01 §B: this is **absent from every retrieved GraphRAG paper**. Closest analogs are SELF-RAG's ISREL/ISSUP reflection tokens (post-hoc grading, not retrieval-time) and ad-hoc metadata weighting in clinical-decision-support RAG. Lens 04 §D-5 sharpens the open question: verification should be **intent-conditioned** (`ν_i(π)`, not global `ν(π)`) — hard filter for Canon, soft demote for Frontier.

---

## 3. Decisions Taken

The lenses converge on the following decisions. Each is exploratory (`status: exploratory`); promotion requires the architecture spec and a falsification round.

### D-1. Adopt graph-aware retrieval as the minimum architecture

**Decision.** The retriever must read `Hom_C(-, -)` (typed-edge structure) in addition to body embeddings. Vector-only retrieval is rejected as the primary architecture for the vault.

**Rationale.** Lens 02 §D necessity theorem: any retriever that does not read typed-edge structure factors through a hom-non-faithful functor and therefore fails the faithfulness condition. The supersedes-pathology counterexample (§C3) is the load-bearing concrete instance — minimal, two-node, schema-driven, with proof-grade status.

**Scope.** Applies to structurally-demanding queries (intents I1–I4, I6, I7, I8 in lens 04 §B). Pure-semantic queries (I5) degrade gracefully to vector-only.

**Status.** Exploratory. The necessity theorem is proof-sketch (§D), not formalized in Lean; the supersedes-pathology counterexample is queued for Lean formalization at `/domainspec-theorem/pipeline/queue/0003`.

### D-2. Compose layers per query intent (not per training run)

**Decision.** The ranking function is selected per query by an intent classifier mapping each query to an ordered composition of (body-similarity, edge-traversal restricted to a typed subgraph, node-type filter, stage filter, verification prior). The composition is **not** fixed by the retriever's training.

**Rationale.** Lens 04 §A: no surveyed system parametrises the ranking function within a retriever by intent at query time. Lens 01 §B identifies this as the load-bearing novelty. Lens 04 §C derives two general templates that fall out of the eight intents: **body-leaning** `r = (type/stage filter) · ν(π) · cos`, and **edge-leaning** `r = 1[reachable via E'] · ρ_E'(a, n) · prior`.

**Status.** Exploratory. The intent taxonomy (8 classes) is a proposal, not validated against historical vault queries.

### D-3. Treat verification-provenance and evidence-stage as ranking signals, intent-conditioned

**Decision.** `ν_i(π)` (intent-conditioned verification prior) and `μ(σ)` (stage prior) participate in the ranking function. Verification is a hard filter for Canon-class intents (I1) and a soft demote for Frontier-class intents (I3).

**Rationale.** Lens 04 §D-5 surfaces the design question; lens 01 §B confirms no published GraphRAG variant ranks on `evidence_stage` or verification-provenance. Honest scope: lens 03 §C reports stage collapse as the *weakest-corroborated* failure mode (2/10) — the literature rarely names "evidence stage" as a missing primitive, so this design choice rests on the vault's own discipline more than on published benchmarks.

**Status.** Exploratory. Per-intent `ν_i` schedule is not specified; the architecture spec must enumerate.

---

## 4. Alternatives Considered

### A-1. Pure vector RAG (with optional reranker)

**Sketch.** Standard top-K cosine over body embeddings, optionally followed by a cross-encoder rerank.

**Why considered.** Operational simplicity; large body of tooling; **wins on simple-fact queries** (83.2% evidence recall in `arXiv:2506.05690`, lens 03 §C contrary finding).

**Why rejected as primary.** Cannot in principle satisfy the Yoneda faithfulness criterion (lens 02 §C1–C3). Empirically fails on every multi-hop benchmark surveyed (lens 03 F1, F2, F8) and on schema-bound queries (F3, F10). The supersedes-pathology counterexample (§C3) is structurally decisive: even with infinite training, vector RAG returns a paper and its retraction as interchangeable.

**Scope of remaining use.** Intent I5 (pure semantic similarity) and as the body-similarity component of body-leaning intents (I1, I3, I8).

### A-2. Adopt NodeRAG, modify heavily

**Sketch.** Lens 01 §C Option 1. NodeRAG is the only published system with first-class heterogeneous nodes and a router that respects them. Modifications: swap its 7 fixed node types for the vault's 6 (premise/constitution/axiom/conceptual/discovery/session); swap LLM/HNSW edge construction for the vault's pre-existing typed edges; add `evidence_stage` and `verification` attributes; replace K-core/betweenness importance with a stage-weighted prior; add an intent classifier.

**Why considered.** Reuses the only published type-aware router; lowest invention cost.

**Why not chosen as primary.** The intent router is the load-bearing new piece, and NodeRAG has no such router — the substitution is so large that "adopt + modify" is closer to "rebuild." NodeRAG's structural metrics (K-core, betweenness) are content-independent; the vault needs stage/verification-aware priors that NodeRAG has no place to inject.

### A-3. Compose KG2RAG + REANO + SELF-RAG-style grader

**Sketch.** Lens 01 §C Option 2. KG2RAG gives "pre-existing KG with fact-level edges drives chunk expansion." REANO gives query-conditioned edge attention. SELF-RAG's reflection-token idea, repurposed, gives evidence-stage and verification-provenance grading. Glue: REANO is inner loop; KG2RAG bounds the candidate set; the grader is outer rerank.

**Why considered.** Maximum reuse of published systems; each component is independently validated.

**Why not chosen as primary.** Three independent codebases with different assumptions; integration cost likely exceeds the cost of specifying the architecture cleanly. REANO conditions edge attention on the query but does not select *which edge types to traverse* per intent — that selector is still missing.

### A-4. Specify a new architecture (lens 01 §C Option 3)

**Sketch.** Typed-edge presheaf index (Yoneda identity directly implemented) + intent → layer-composition table + stage-and-provenance prior + lenses-edge as runtime view-switch.

**Why provisionally adopted.** Items 1, 2, and 4 do not appear in any surveyed source (lens 01 §B). Item 3 generalizes the clinical-RAG metadata-weighting pattern into a graph retriever. This is the route that respects the vault's identity criterion by construction rather than by adaptation.

**Caveat.** Lens 01 §D notes that KG2RAG, REANO, Jin et al. [186], SELF-RAG, and MIND-RAG were only reached through secondhand survey descriptions — claims about them must be re-verified before publication. The "no published variant does this" conclusion is *strong but not exhaustive*.

---

## 5. Open Questions

### OQ-1. How is query intent detected?

Rule-based is brittle; pure-LLM is expensive; the SetFit→LLM hybrid (lens 04 §A) needs labelled vault queries we do not yet have. **Recommendation:** bootstrap by hand-labelling ~200 historical queries from session logs, in parallel with generating synthetic queries from the lens 04 §B taxonomy; defer choice of classifier until labelled data exists.

### OQ-2. Hard filter or soft demote for verification?

Lens 04 §D-5. **Recommendation:** intent-conditioned `ν_i`, not global `ν`. Hard filter for I1 (Canon — `recall`-only axioms excluded); soft demote for I3 (Frontier — `recall` permitted but penalised); architecture spec must enumerate per intent.

### OQ-3. How does the architecture handle multi-intent queries?

"Evidence for X, and what contradicts it?" is I2 ∪ I4. Lens 04 §D-2 enumerates three options: decompose into sub-queries; product ranker `r_I2 · r_I4`; soft intent distribution `r = Σ_i p(i|q) · r_i`. **Recommendation:** start with decomposition (most explainable); revisit when telemetry shows the share of multi-intent queries.

### OQ-4. Does the supersedes-pathology counterexample formalize cleanly in Lean?

Queued at `/domainspec-theorem/pipeline/queue/0003`. If it does not formalize cleanly, lens 02 §C3's proof-grade status downgrades to "informal counterexample" and decision D-1's necessity argument weakens. **Recommendation:** track the Lean queue; treat counterexample as the load-bearing falsification target.

### OQ-5. Where does the architecture degrade to vector RAG gracefully?

Lens 04 §D-3: I2 (Provenance) on a node with no inbound `derives-from` returns nothing. Fall back to I5 (semantic proxy)? Or report the structural void? **Recommendation:** report the structural void by default (the framework's discipline is to surface empty result sets as data); allow caller to request semantic-proxy fallback explicitly.

### OQ-6. Anchor resolution confidence threshold

Lens 04 §D-4: edge-leaning intents require an anchor; anchor resolution is itself a retrieval (I5/I8 two-stage). What confidence on anchor resolution justifies committing to the edge-leaning ranker? **Recommendation:** open; needs prototype data.

### OQ-7. Is "stage collapse" a real empirical gap or a vocabulary mismatch?

Lens 03 §C honest reporting: stage collapse is the *weakest-corroborated* failure mode (2/10). Either the literature does not name "evidence stage" as a missing primitive (vocabulary mismatch) or vector RAG does not in fact lose stage information measurably. **Recommendation:** the architecture spec must include a falsification test targeting stage-bound queries specifically (e.g., "what did we believe in March vs. May?" on the vault's own evolution); current evidence supports the design choice but does not yet confirm it.

### OQ-8. How is "formal faithfulness" distinguished from "empirically better"?

Lens 02 establishes a **formal** property (faithfulness as Yoneda-commutation): vector RAG cannot in principle satisfy it; graph-aware retrieval can. This is *not* the empirical claim that graph-aware retrieval scores higher on benchmarks — that claim rests on lens 03's 10 documented failures and remains subject to the lens 03 §C contrary finding on simple facts. The discovery must consistently distinguish: (i) formal impossibility on the Yoneda criterion (proof-grade, lens 02), (ii) empirical failure patterns (corroborated 5–7/10, lens 03), (iii) novelty of the proposed combination (absent from surveyed literature, lens 01). **Recommendation:** treat (i) as load-bearing for the architectural decision, (ii) as scope-defining for where the advantage applies, (iii) as honest reporting on prior art.

---

## 6. Status of Each Claim (Epistemic Honesty)

Per user constraint on distinguishing formal property from empirical observation:

| Claim | Status | Source |
|-------|--------|--------|
| Vector-only retrieval violates the Yoneda identity criterion | **Proof-grade** (counterexample is minimal, two-node, constructive) | Lens 02 §C3 |
| Graph-aware retrieval (full-subpresheaf closure) is faithful | **Proof** (immediate from full-subpresheaf construction) | Lens 02 §D sufficiency |
| Graph-awareness is the minimum requirement | **Proof sketch** (hom-faithfulness reduction; not formalized) | Lens 02 §D necessity |
| Vector RAG fails on multi-hop, schema-bound, and global-sensemaking queries | **Empirical** (corroborated 5–7/10 in surveyed literature) | Lens 03 §A, §B |
| Vector RAG wins on simple-fact queries | **Empirical contrary finding** (83.2% on `arXiv:2506.05690`) | Lens 03 §C |
| Stage collapse is a documented failure mode | **Weakly empirical** (2/10; possibly vocabulary mismatch) | Lens 03 §C |
| The proposed combination is unpublished | **Survey-grade** (strong but not exhaustive; secondhand sources flagged) | Lens 01 §B, §D |
| Intent-conditioned layer composition has no published precedent | **Survey-grade** | Lens 01 §B; lens 04 §A |
| The eight-intent taxonomy partitions vault queries cleanly | **Proposal** (not validated against historical queries) | Lens 04 §B |

---

## 7. Next Moves

Tracked here so the next session does not invent them.

1. **Snapshot zero for the retrieval question** — capture the current vault's query distribution (if any session logs exist) and intent labels for a sample of ~50 queries. Without this baseline, OQ-1 cannot be answered empirically.
2. **Draft the architecture spec** under `internal_tools/graph_retrieval/features/two-layer-retrieval/` (application scope — not in this vault folder). Inputs: D-1, D-2, D-3 + the eight-intent taxonomy + the two ranking-function templates from lens 04 §C.
3. **Promote the supersedes-pathology counterexample to a `premise` file** under `vault/premise/` — it carries the formal weight of D-1 and currently lives only in lens 02 §C3.
4. **Run a falsification round.** Same query set across pure-vector and the proposed architecture on `/house_project/docs/vault/` or the domainspec vault itself. Targets: multi-hop (expected: architecture wins), simple-fact (expected: vector wins or ties — confirms scope), stage-bound (expected: architecture wins; falsifies OQ-7 if it does not).
5. **Re-verify the lens 01 secondhand sources** (KG2RAG, REANO, Jin et al. [186], SELF-RAG, MIND-RAG) by reading primary papers before any external publication of the novelty claim.
6. **Track Lean queue 0003** (OQ-4). If the supersedes counterexample does not formalize cleanly, revisit D-1's necessity argument.
7. **Coordinate with [`two-layer-platform-architecture/`](../two-layer-platform-architecture/)** — that discovery sequences `graph_retrieval` for week 5–6 and depends on the kernel + frontmatter-ownership decision landing first.

---

## Source Dispatch

This discovery promotes the findings collected in:

- `vault/discovery/two-layer-retrieval/README.md` — index and triangulation summary
- `vault/discovery/two-layer-retrieval/lenses/01-graphrag-state-of-the-art.md` — surveyed 7+ GraphRAG variants; novelty assessment
- `vault/discovery/two-layer-retrieval/lenses/02-formal-faithfulness.md` — Yoneda-indexed faithfulness criterion; impossibility results
- `vault/discovery/two-layer-retrieval/lenses/03-vector-rag-failure-modes.md` — 10 documented failure modes; pattern table
- `vault/discovery/two-layer-retrieval/lenses/04-query-intent-ranking.md` — 8-intent taxonomy; per-intent ranking functions

Dispatched and promoted under user confirmation in lifecycle step 7 of `/domainspec-subagents-strategy` on 2026-05-17.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/two-layer-retrieval/README.md` | `derives-from` | This discovery promotes the triangulated findings indexed by the folder README. |
| `vault/discovery/two-layer-retrieval/research/research.md` | `derives-from` | The post-hoc research synthesis consolidating the four lens findings under the new convention. |
| `vault/discovery/two-layer-retrieval/lenses/01-graphrag-state-of-the-art/findings.md` | `derives-from` | Lens 01 establishes the novelty assessment and the three architectural options that anchor §3 and §4. |
| `vault/discovery/two-layer-retrieval/lenses/02-formal-faithfulness/findings.md` | `derives-from` | Lens 02 provides the Yoneda-indexed faithfulness criterion that grounds D-1 and C-2. |
| `vault/discovery/two-layer-retrieval/lenses/03-vector-rag-failure-modes/findings.md` | `derives-from` | Lens 03 provides the empirical failure-mode catalog scoping the architecture's claimed advantage. |
| `vault/discovery/two-layer-retrieval/lenses/04-query-intent-ranking/findings.md` | `derives-from` | Lens 04 provides the eight-intent taxonomy and per-intent ranking functions anchoring D-2 and D-3. |
| `vault/discovery/graph-as-residue-attractor/README.md` | `derives-from` | The parent discovery's Yoneda-identity criterion is the load-bearing premise this retrieval discovery must satisfy. |
| `vault/discovery/two-layer-platform-architecture/README.md` | `cites` | The platform architecture discovery defines the kernel (`vault_common`) and subsystem boundary (`graph_retrieval`) within which the retrieval architecture spec must live; it sequences `graph_retrieval` for week 5–6. Cited as load-bearing context for §7 Next Moves item 7. |
| `vault/ontology-conventions.md` | `cites` | Edge catalog (Appendix C), node-type taxonomy, and evidence-stage / verification-provenance vocabulary are inputs to the ranking functions in §4 (D-2, D-3). |
