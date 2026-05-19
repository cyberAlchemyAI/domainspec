---
tags: [vault, lens-findings, two-layer-retrieval, vector-rag, failure-modes]
node_type: findings
is_session: false
layer: ontology
nature: explanatory, reference
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Vector-RAG Failure Modes

## Objective

Empirically catalog documented failures of vector RAG in graph-structured corpora; map each to the four schema-layer concerns (type erasure, edge erasure, stage collapse, identity violation).

## Findings

### A. Failure-mode catalog

#### F1. Global sensemaking collapse (Microsoft GraphRAG, Novorossiya example)
**Failed.** "What is Novorossiya?" over Ukraine-conflict news returned irrelevant results — no single chunk defined the term; the concept exists only as a pattern across entity-edge co-occurrences. GraphRAG wins comprehensiveness 72–83% and diversity 62–82% vs naive vector RAG. **Why.** Edge erasure + identity violation. **Src.** arXiv:2404.16130.

#### F2. Multi-hop reasoning gap (MuSiQue / 2WikiMultihop)
**Failed.** NV-Embed-v2 reaches 69.7% passage recall@5 on MuSiQue; HippoRAG 2 lifts to 74.7%. On 2Wiki: 76.5% → 90.4%. Gap attributed to "independent vector retrieval being unable to make multi-hop connections between disparate pieces of knowledge." **Why.** Edge erasure + identity violation. **Src.** arXiv:2502.14802.

#### F3. Schema-bound query collapse on KPI/forecast queries
**Failed.** Survey reports vector-only RAG scores ~0% on schema-bound KPI/forecast queries; optimized GraphRAG reaches 90%+. HippoRAG 2 reaches 53.4% on complex reasoning vs 42.9% baseline. **Why.** Type erasure + edge erasure + stage collapse. **Src.** arXiv:2506.05690.

#### F4. Compound-value-type confusion (Mindful-RAG)
**Failed.** Models treated KG compound-value-type nodes (intermediate connectors representing n-ary facts) as final answer entities, returning connector IDs instead of roles. **Why.** Type erasure, directly. **Src.** arXiv:2407.12216.

#### F5. Incorrect relation mapping in multi-hop
**Failed.** For "spouse of X's father?", retrievers surface text matching {X, spouse} rather than chaining father→spouse. **Why.** Edge erasure + identity violation. **Src.** arXiv:2407.12216.

#### F6. Temporal / stage constraint ignored
**Failed.** Mindful-RAG: models fail to apply "temporal, geographical, or logical constraints." HoH benchmark: outdated retrieved facts produce "temporal hallucination." FinanceBench: shared vector-store RAG ~19% accuracy vs 76% for retrieval respecting page/structure — failures concentrate on "current period" vs "prior period" (stage distinction). **Why.** Stage collapse + type erasure. **Src.** arXiv:2407.12216; arXiv:2503.04800; arXiv:2408.10343.

#### F7. Chunk-level context loss (Anthropic Contextual Retrieval, SEC-filing example)
**Failed.** "The company's revenue grew by 3% over the previous quarter" embedded with no anchor to ACME Corp or Q2 2023. Plain embedding RAG: 5.7% top-20 failure; with entity/period context prepended: 3.7%; with BM25: 2.9%. **Why.** Identity violation (referent — (company, period) tuple — not in embedded text) + type erasure. **Src.** Anthropic blog.

#### F8. Seven Failure Points: FP2 + FP7
**Failed.** Three production case studies (15K docs / 1K questions): most common failures were FP2 (relevant doc exists but doesn't rank top-K) and FP7 (answer correct but omits content the user expected aggregated across A, B, C). **Why.** FP2: identity violation. FP7: edge erasure. **Src.** arXiv:2401.05856.

#### F9. Lost-in-the-middle position bias
**Failed.** Gold passage in middle of 20-doc context drops multi-doc QA accuracy. Compounds vector RAG's failure because it can't prioritize structurally-central evidence. **Why.** Interacts with edge erasure — when retrieval can't identify the bridge node in a multi-hop chain, the LLM is left to guess. **Src.** arXiv:2307.03172.

#### F10. Disconnected-knowledge / weak entity connectivity corpora
**Failed.** Vector RAG degrades sharply on "low information density and weak entity connectivity." On simple-fact queries vector RAG *beats* GraphRAG (83.2% evidence recall) — failure is specifically structural. **Why.** Type erasure + edge erasure. **Src.** arXiv:2506.05690.

### B. Pattern table

| # | Failure | Type erasure | Edge erasure | Stage collapse | Identity violation |
|---|---|---|---|---|---|
| F1 | Global sensemaking | | X | | X |
| F2 | Multi-hop QA | | X | | X |
| F3 | KPI/forecast schema-bound | X | X | X | |
| F4 | CVT node misread | X | | | X |
| F5 | Incorrect relation mapping | | X | | X |
| F6 | Temporal/stage constraint | X | | X | |
| F7 | Chunk-level context loss | X | | | X |
| F8 | FP2/FP7 | | X | | X |
| F9 | Lost-in-the-middle | | (X) | | |
| F10 | Disconnected-knowledge corpora | X | X | | |

Tally: type erasure 5, edge erasure 7, stage collapse 2, identity violation 6.

### C. Honest reporting

- **Edge erasure + identity violation: heavily corroborated.** Every multi-hop benchmark and every GraphRAG variant frames the gap in these terms.
- **Type erasure: corroborated via downstream symptoms** (CVT confusion, schema-bound query collapse). Literature rarely names "node type" as the missing primitive; it names "structure" or "schema."
- **Stage collapse: weakest-corroborated.** Indirect evidence only. Either a real empirical gap or vocabulary mismatch (provenance, freshness, evidence quality).
- **Contrary finding.** Vector RAG outperforms GraphRAG on simple fact lookups (83.2%, arXiv:2506.05690). Scope the critique: it predicts failure on queries whose answer-identity depends on type/edge/stage structure, not on every query.

## Caveats

- **Stage collapse is the weakest-corroborated of the four schema-layer concerns** (2/10). The lens cannot rule out that "stage" is just a vault-internal vocabulary not yet named in the GraphRAG literature; the design decision to treat it as a first-class signal therefore rests more on vault discipline than on benchmark evidence.
- **The contrary finding (F10 ∼ 83.2%) bounds the scope of the critique.** Vector RAG is not universally broken — it loses specifically on structurally-demanding queries. Any claim that "graph-aware retrieval beats vector RAG" must be scoped accordingly.
- **The pattern table is the analyst's mapping**, not an attribute carried on the source papers. Different mappings (e.g., grouping F9 with F1) would be defensible.
- All evidence is from external corpora (Wikipedia, finance, news, legal). None tested on a graded-vault corpus directly; the vault-specific failure modes (e.g., supersedes pathology) are extrapolations, not measurements.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
