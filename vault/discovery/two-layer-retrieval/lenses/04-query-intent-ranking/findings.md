---
tags: [vault, lens-findings, two-layer-retrieval, intent-classification, ranking]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Query-Intent Conditioned Ranking

## Objective

Propose a query-intent taxonomy for the graded vault; derive per-intent ranking functions composing body-similarity, edge-traversal, and type/stage/verification filters.

## Findings

### A. Literature survey (web-fetched)

- **Query-intent taxonomies.** Broder (2002): navigational / informational / transactional. Rose-Levinson refines into hierarchy (informational ~62%, navigational ~13%, transactional ~24%). LLM-era conversational search uses SetFit→LLM hybrids achieving within ~2% of pure-LLM accuracy at half the latency. **Gap for us:** no taxonomy includes intents whose target is an *epistemic structure* (axioms vs drafts, derivation chains, contradiction sets). They classify intent *about the world*, not *about the corpus's own confidence shape*.
- **Faceted retrieval.** Treats categorical attributes as filters layered over a similarity score. Amazon's learning-to-rank-and-retrieve combines structured filters with learned ranking inside one model. **Gap:** facets are flat; our `derives-from` / `supersedes` / `contradicts` are typed graph relations, which facet vocabularies don't model.
- **Ranking-function composition.** Dominant production pattern: parallel BM25 + dense → fusion → cross-encoder rerank. RRF (Cormack et al.) is rank-only and parameter-free. Late-interaction (ColBERT) sits between early and late fusion. LTR with KG-derived features (Dali et al.) shows structured-feature gains. **Gap:** all compose *signal types*, not *intents*. Composition is fixed at training time; ours must vary at query time.
- **Multi-strategy retrievers.** LlamaIndex `RouterRetriever` uses an LLM selector over candidate retrievers' metadata to dispatch a query. LangChain `MultiQueryRetriever` and ensembles fuse multiple strategies but route by configuration. **Gap:** routers select retrievers but do not parametrise the *ranking function within* a retriever by intent.
- **Intent-conditioned KG ranking.** Closest prior art: Xiong et al.'s Explicit Semantic Ranking; MIND-RAG (ICCV 2025) injects fine-grained intent signals (modality, domain) into reranking. **Gap for us:** no published system lets the *typed edge being traversed* be a function of the *classified intent*, with stage and verification facets co-varying.

### B. Intent taxonomy for the graded vault

Let $V = (N, E)$ with node types $T_N$, edge types $T_E$, stages $S$, verification $P$. Node $n$ has body embedding $\mathbf{b}(n)$, type $\tau(n)$, stage $\sigma(n)$, verification $\pi(n) \subseteq P$.

| # | Intent | Gloss | Target | Composition |
|---|---|---|---|---|
| I1 | **Canon** | "What do we currently believe?" | $\tau \in \{\text{axiom, constitution}\}$ ∧ $\sigma \in \{\text{consolidated, evergreen}\}$ | high type/stage filter, low traversal, mid vector |
| I2 | **Provenance** | "What's the evidence for X?" | inbound closure under `derives-from` ∪ `cites` from $x$ | high backward traversal, anchor-required |
| I3 | **Frontier** | "What are we exploring?" | $\sigma \in \{\text{draft, exploratory}\}$, recency-weighted | filter + recency, vector secondary |
| I4 | **Tension** | "What contradicts Y?" | `contradicts` neighbours of $y$, plus their supersessions | traversal-only, vector tiebreaker |
| I5 | **Semantic** | "Anything near X" | unrestricted | pure cosine |
| I6 | **Blast-radius** | "What breaks if I retire Z?" | inbound `governs` ∪ inbound `derives-from` from $z$, transitive | reverse traversal, type-weighted by downstream criticality |
| I7 | **Lens-triangulation** | "What independent angles bear on X?" | nodes connected to $x$ by `lenses`; partitioned by `dispatched_by` | edge-typed traversal + diversity penalty across lens origins |
| I8 | **Definitional** | "What does term T mean here?" | $\tau = \text{conceptual}$, $\sigma \geq \text{active}$, vector-near to T | vector + type filter, verification-boosted |

I1, I3, I5 are *body-leaning*; I2, I4, I6, I7 are *edge-leaning*; I8 is mixed.

### C. Compose-function sketches

$\cos(q, n) = \langle \mathbf{q}, \mathbf{b}(n)\rangle / (\|\mathbf{q}\|\|\mathbf{b}(n)\|)$. For anchor $a$ and edge subset $E' \subseteq T_E$, $d_{E'}(a, n)$ = shortest directed path along edges in $E'$; $\rho_{E'}(a, n) = \gamma^{d_{E'}(a, n)}$. Stage prior $\mu(\sigma) \in [0,1]$ monotone. Verification prior $\nu(\pi) = 1 - \alpha \cdot \mathbb{1}[\pi = \{\text{recall}\}]$.

$$r_{\text{I1}}(q, n) = \mathbb{1}[\tau(n) \in \{\text{ax, con}\}] \cdot \mu(\sigma(n)) \cdot \nu(\pi(n)) \cdot \cos(q, n)$$

$$r_{\text{I2}}(q, n; x) = \mathbb{1}[d_{\{\text{derives-from, cites}\}}^{-1}(x, n) < \infty] \cdot \rho_{\{\text{derives-from, cites}\}^{-1}}(x, n) \cdot \nu(\pi(n))$$

$$r_{\text{I3}}(q, n) = \mathbb{1}[\sigma(n) \in \{\text{dr, ex}\}] \cdot e^{-\lambda \Delta t(n)} \cdot \cos(q, n)$$

$$r_{\text{I4}}(q, n; y) = \mathbb{1}[d_{\{\text{contradicts}\}}(y, n) \leq 2] \cdot \rho_{\{\text{contradicts, supersedes}\}}(y, n) + \epsilon \cos(q, n)$$

$$r_{\text{I5}}(q, n) = \cos(q, n)$$

$$r_{\text{I6}}(q, n; z) = \sum_{E' \in \{\{\text{governs}\}, \{\text{derives-from}\}\}} w_{E'} \cdot \rho_{E'^{-1}}(z, n) \cdot \mu(\sigma(n))$$

$$r_{\text{I7}}(q, n; x) = \mathbb{1}[(x, n) \in \text{lenses}] \cdot \cos(q, n) \cdot \text{div}(n \mid \text{selected})$$

$$r_{\text{I8}}(q, n) = \mathbb{1}[\tau(n) = \text{conceptual}] \cdot \mathbb{1}[\sigma(n) \geq \text{active}] \cdot \nu(\pi(n)) \cdot \cos(q, n)$$

Two templates fall out: **body-leaning** $r = (\text{type/stage filter}) \cdot \nu(\pi) \cdot \cos$, and **edge-leaning** $r = \mathbb{1}[\text{reachable via } E'] \cdot \rho_{E'}(a, n) \cdot (\text{prior})$. I7 is the only intent requiring a *diversity* objective rather than a pointwise score — the ranker returns sets, not lists, for triangulation intents.

### D. Open design questions

1. **Intent detection mechanism.** Rule-based is brittle; pure-LLM is expensive; SetFit→LLM hybrid needs labelled vault queries we don't yet have. Bootstrap: hand-label ~200 historical queries, or generate synthetic queries from the taxonomy?
2. **Multi-intent queries.** "Evidence for X, and what contradicts it?" is I2 ∪ I4. Decompose into sub-queries? Define a product ranker $r_{\text{I2}} \cdot r_{\text{I4}}$? Treat intents as a soft distribution $p(i \mid q)$ and compose $r = \sum_i p(i \mid q) \, r_i$? Option (c) requires score-comparability — the problem RRF was invented to dodge.
3. **Graceful degradation when structure is absent.** I2 on a node with no inbound `derives-from` returns nothing. Fall back to I5 (semantic proxy)? Or report the structural void?
4. **Anchor resolution.** Edge-leaning intents require an anchor; anchor resolution is itself a retrieval (I5/I8). Two-stage pipeline. What confidence on anchor resolution justifies committing to the edge-leaning ranker?
5. **Verification as filter vs prior.** For I1, should `recall`-only axioms be *excluded* (hard filter) or *demoted* (soft prior)? Suggests $\nu_i(\pi)$ intent-conditioned, not global $\nu(\pi)$.

## Caveats

- **The eight-intent taxonomy is a proposal**, not a validation against historical vault queries. No labelled corpus exists yet; partition cleanness is asserted, not measured.
- **Compose-function sketches are skeleton ranking functions**, not specifications. Constants ($\gamma$, $\lambda$, $\alpha$, $w_{E'}$, $\epsilon$) are unset; learning vs. fixed values is deferred.
- **Intent classifier mechanism is unspecified** (D.1). Without it, the whole intent-conditioning architecture has no front door.
- I7 (Lens-triangulation) is the only intent demanding a diversity objective; the architecture spec must handle pointwise-vs-set rankers as distinct paths.
- Verification-as-filter-vs-prior (D.5) is the open lever closest to the discovery's epistemic discipline; treating it as global $\nu(\pi)$ would silently flatten the vault's confidence ladder.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
