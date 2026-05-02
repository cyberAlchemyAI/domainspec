---
tags: [newspaper, ontology, knowledge-graph, navigation, discovery]
node_type: discovery
is_session: false
layer: application, ontology
nature: exploratory
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-04-10
---

# Discovery: Newspaper → Knowledge Graph Navigation Bridge

## Context

O Grafo Diário publishes articles synthesized from vault activity. Each article carries `meta.source_files` (the vault documents it drew from) and `tag` (business/system domain tags like `"Ontology | Pipeline"`). The ontology visualization at `/ontology-visualization` shows how all vault nodes connect structurally across the knowledge graph.

Currently, there is no bridge between reading an article and seeing where that article's subject sits in the knowledge graph. A reader learns *what happened* but cannot immediately see *why it matters structurally* — how the entities involved relate to the rest of the system.

This discovery explores what it would take to build that bridge.

---

## The Feature

A clickable element in each newspaper article — a tag, a domain label, or a dedicated "View in Graph" link — that opens `/ontology-visualization` filtered or centered on the nodes relevant to that article.

The navigation should open in a new tab or panel, preserving the newspaper context. The reader shifts from temporal view (what happened today) to relational view (how it fits the system) without losing their place.

---

## Why It Matters

The newspaper and the knowledge graph are two projections of the same underlying data. The newspaper is temporal: it answers *what changed*. The graph is relational: it answers *how things connect*. Together they close a loop:

- Article surfaces a structural decision → reader clicks → graph shows the full dependency context → reader understands consequence
- This is not a convenience feature. It is what makes the newspaper epistemically complete rather than just a digest.

The graph view also gives the Editor-in-Chief a feedback signal: which ontology regions are being navigated to most often, which means the editorial prioritization is hitting or missing what readers care about.

---

## Open Questions (Blockers Before Implementation)

### 1. Does `/ontology-visualization` support query params?

For this to work, `/ontology-visualization` must accept a URL parameter that tells it which node(s) to center on or highlight. For example:

```
/ontology-visualization?nodes=aquisicao,pipeline&source=newspaper&article=node_001
```

This requires `/ontology-visualization` to read query params on load and filter/pan the graph accordingly. **Unknown whether this is currently supported.**

### 2. How do article tags map to ontology node identifiers?

Article `tag` values (e.g., `"Ontology | Pipeline"`) are editorial labels, not graph node IDs. The ontology node identifiers are likely different (e.g., slugs like `extraction-pipeline`, UUIDs, or concept names from `dictionary-business.md`).

Two possible resolution strategies:
- **A. Editor Agent emits node IDs directly**: Add `meta.graph_node_ids: List[str]` to the article schema. Gemini identifies the relevant ontology nodes while synthesizing the article. Risk: Gemini may hallucinate IDs that don't exist in the graph.
- **B. Server-side lookup**: Given `meta.source_files`, a lookup service resolves the source vault documents to their corresponding ontology nodes. More reliable, but requires the ontology index to be queryable at runtime.

### 3. What is the correct ontology node identifier format?

The knowledge graph has nodes with identifiers defined in the ontology extraction pipeline. The exact ID format needs to be confirmed before the Editor Agent can emit them or a lookup table can be built.

### 4. Should this open in a new tab or an in-page panel?

- **New tab**: Simplest. Preserves newspaper state. Risk: context fragmentation.
- **In-page overlay/panel**: Richer UX. The newspaper stays visible while the graph loads alongside. Requires layout work in the winning template.

---

## Proposed Implementation Sketch (for Future Agent)

When the above questions are resolved, the implementation path is:

### Step 1: Schema extension

Add `graph_node_ids` to `ArticleMeta` in `editor_agent_scaffold.py` and `data-exchange-protocol.md`:

```python
class ArticleMeta(BaseModel):
    impact: float
    risk: Literal["low", "medium", "high"]
    source_files: List[str]
    graph_node_ids: List[str] = Field(
        default_factory=list,
        description="Ontology node IDs this article relates to. Used for knowledge graph navigation."
    )
```

### Step 2: Editor Agent prompt addition

Instruct Gemini to identify and emit the ontology node IDs corresponding to each article's subject matter. These must match the canonical node IDs from the running ontology index.

### Step 3: Template rendering

In the newspaper template, render each article's `graph_node_ids` as a navigation link:

```html
<a class="graph-link" href="/ontology-visualization?nodes={ids}&source=newspaper" target="_blank">
  View in Graph →
</a>
```

### Step 4: `/ontology-visualization` param handling

The ontology visualization frontend reads `?nodes=` on load, filters/highlights/pans to those nodes, and shows a "via O Grafo Diário" context label so the user knows how they arrived.

---

## What Must Be Confirmed Before Starting

- [ ] `/ontology-visualization` route exists and is reachable from the newspaper context
- [ ] The visualization frontend can accept and handle `?nodes=` query params
- [ ] Ontology node ID format confirmed (slug? UUID? label?)
- [ ] Decision made on resolution strategy: Editor Agent emits IDs vs. server-side lookup
- [ ] Decision made on navigation target: new tab vs. in-page panel
