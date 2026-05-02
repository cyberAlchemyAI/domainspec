---
tags: [creatives, embeddings, trama]
node_type: discovery
is_session: false
layer: domain
nature: explanatory
status: exploratory
veracidade: low
convicção: low
version: 0.1.0
last_updated: 2026-04-22
---

# Discovery — Creative Embedding Applications

## Objective

Explore what role, if any, dense vector representations of creative assets (current model: `gemini-embedding-2-preview`) can play in the Creative Operations system. Answers: *"We have embeddings for every rendered creative. What decision could they inform that would justify ratifying them as a first-class input to a rule?"*

Today the embeddings exist as research data only — stored in `data/embeddings/ads_embeddings_output.csv`, referenced by [[domain-dictionary#creative-embedding]], but consumed by no axiom, premise, or constitution. This discovery is the explicit home of the orphaned-node concern flagged in the dictionary's own Open Points.

---

## Context

- Embeddings are produced per-creative (one row per `ad_name`, `drive_link`) and capture the semantic content of the rendered image or video.
- No downstream rule references them. They are effectively **side-effect data** from the generative pipeline.
- Meanwhile, three ratified rules ([[constitution/creative-removal-constitution]], [[constitution/winning-creative-constitution]], [[constitution/creative-attribute-constitution]]) all operate without embedding inputs.

---

## Candidate Applications

Ordered from lowest-risk to highest-risk to ratify:

### 1. Similarity-based lineage inference (diagnostic)
Given a winner, surface its N-nearest neighbors in embedding space. Useful for *understanding* why a creative won, not for making decisions. Lowest bar — no rule change, just a dashboard.

### 2. Duplicate-detection gate in CapoMastro registration
Reject creatives whose embedding cosine-similarity to an already-registered creative exceeds a threshold. Prevents near-duplicate creatives from consuming independent campaign slots. Requires a threshold choice and a manual-override path.

### 3. Cluster-based exploration budget
Guarantee that a minimum share of campaign spend goes to creatives in under-represented embedding clusters — to avoid the pipeline collapsing onto a small region of creative space. Requires a cluster-stability story (embedding model changes would shift clusters).

### 4. Embedding-conditioned removal signal
Keep a creative alive longer if its embedding neighbors include recent winners, even if its spend share is below the removal threshold. Riskiest — directly modifies the removal rule and is sensitive to embedding model version drift.

### 5. Auto-generation routing (TRAMA)
Route TRAMA's generation agents toward embedding regions where winners cluster. Most ambitious; requires the `parent_creative` lineage field to be schema-enforced ([[premise/creative-premises#p-crt-14--every-automatically-generated-creative-must-carry-complete-lineage]]) and a causal story about whether embedding-region success is reproducible.

---

## Open Questions

1. **What is the embedding actually capturing?** `gemini-embedding-2-preview` is a black box. Without a structured probe (does it encode audience? angle? product? format?), we risk building rules on a signal we don't understand.
2. **Stability across embedding-model upgrades**. When the model is upgraded, every clustering, similarity, and nearest-neighbor call shifts. How do we version-tag rule decisions that consumed embeddings?
3. **Cost of labeling**. For any of applications 1–5 to be evaluated, we need a ground-truth label (winner / loser, good / bad duplicate, on-cluster / off-cluster). Labeling 1,000+ creatives is non-trivial.
4. **Substitute signal**. Several candidate applications have cheaper proxies: duplicate detection via `Visual Brief` text similarity, exploration budget via `Ângulo` value counts. Embeddings should only enter the ontology when a rule genuinely cannot be expressed without them.

---

## Evidence Needed

- A structured probe of what the current embedding encodes (classifier heads trained on `Ângulo`, `Audiência`, product, format; accuracy per attribute).
- A backtest on 2025 creatives: if application #1 had been in place, would it have surfaced the same winner-lineage clusters the team identified qualitatively (stirrup-nao-marca derivatives, etc.)?
- A versioning story for the embedding model tag on attributed revenue.

---

## Consequences if Adopted

- A new premise ratifies what we believe the embedding captures (`P-CRT-15 — creative embeddings encode X`).
- [[domain-dictionary#creative-embedding]] expands with the specific application adopted.
- [[metrics-dictionary]] gains embedding-derived metrics (cosine similarity, cluster ID, nearest-winner distance).
- The first rule to consume embeddings carries an `embedding_model_version` field, matching the pattern proposed for the attribution model.

---

## Consequences if Rejected

- [[domain-dictionary#creative-embedding]] collapses into a single line noting the asset exists but is not consumed by any rule.
- The embedding pipeline becomes a pure research artifact, out of the core graph.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[domain-dictionary]] | `questions` | Resolves the orphan-node concern on `Creative Embedding` |
| [[premise/creative-premises]] | `questions` | Candidate new premise (P-CRT-15) depends on this discovery |
| [[constitution/creative-attribute-constitution]] | `contextualizes` | Any rule ratified here may cascade into schema changes (parent-creative, embedding-version fields) |
| [[metrics-dictionary]] | `contextualizes` | Embedding-derived metrics would register here if ratified |
| [[conceptual/performance-marketing-context]] | `contextualizes` | The four-levers framing is what makes embedding-driven creative selection a strategic bet rather than a technical curiosity |
