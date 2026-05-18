---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, operations]
node_type: spec
is_session: false
layer: application
nature: procedural, technical
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Operations: Two-Layer Retrieval

There are **no domain-mutating operations** in this feature — the
retriever is read-only. This document instead covers the **operational
concerns** of running the retriever in process: configuration loading,
error handling, corpus reload, and the embedding-matrix warm/cold
lifecycle. Domain operations (`states.md`-aligned mutations) do not
exist and the corresponding files are intentionally omitted.

## Configuration

There is no separate config file in v0.1; configuration is **call-site
parameters** to `retrieve()` and **constructor parameters** to the
`VaultCorpus` and `Embedder` impls. See
[interfaces.md](interfaces.md) for the `retrieve()` parameters.

### NetworkXCorpus constructor

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `root` | `Path` | required | Vault root directory to crawl for `.md` files |
| `embedder` | [Embedder](domain.md#embedder) | required | Embeds bodies on load; satisfies the Protocol |
| `glob` | `str` | `"**/*.md"` | Files to ingest |
| `eager_embed` | `bool` | `True` | If `True`, compute the body-embedding matrix at construction (warm). If `False`, defer until first `search_body` (cold). |

### SentenceTransformerEmbedder constructor

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `model_name` | `str` | `"sentence-transformers/all-MiniLM-L6-v2"` | HF hub model id |
| `device` | `str` | `"cpu"` | Torch device |
| `cache_dir` | `Path \| None` | `None` | Pass to HF to control on-disk model cache |

## Error Handling

Source: [interfaces.md error contract](interfaces.md#error-contract).

| Condition | Behavior | Recoverable? |
| --------- | -------- | ------------ |
| Empty query | `ValueError` raised before any work | No — caller must fix |
| `k <= 0` | `ValueError` | No |
| `corpus` does not satisfy Protocol | `TypeError` at first method call | No |
| Embedder fails to encode | Propagate underlying exception; log at ERROR | Caller may retry |
| `LENS_TRIANGULATION` classified | `NotImplementedError` with intent name in the message | No until v0.2 |
| Step 2b seed extraction fails (no path in query) | Fall back to step 2a, append note to `RetrievalResult.notes`, continue | Yes (degraded but successful) |
| Edge access fails for a single candidate (corruption) | Log at WARN, drop the candidate, continue | Yes |
| Corpus root path does not exist | `FileNotFoundError` at `NetworkXCorpus.__init__` | No — caller must fix |

**Principle:** The retriever **never swallows** an exception silently.
Either it returns a `RetrievalResult` (possibly with notes) or it
raises. Partial-success with a corrupt result is not a permitted
outcome.

## Corpus Reload

The corpus is **immutable** for the lifetime of a `VaultCorpus`
instance. To pick up vault changes, the caller constructs a new
instance. There is no in-place reload API in v0.1.

**Rationale:** Reload-while-querying is a concurrency problem the v0.1
prototype does not solve. The Protocol does not forbid a future
`reload()` method, but it is not required and not implemented.

**Pattern for callers that need fresh data:**

```python
corpus = NetworkXCorpus(root=vault_root, embedder=embedder)
# ... queries ...
# vault was edited externally
corpus = NetworkXCorpus(root=vault_root, embedder=embedder)  # rebuild
# ... fresh queries ...
```

A future backend (e.g. Kuzu) may support live updates; the
[architecture.md extension points](architecture.md#extension-points)
allow it without changing the `retrieve` algorithm.

## Embedding Matrix: Warm vs Cold

The embedding matrix is the dominant memory artifact in
`NetworkXCorpus`. At ~10³ nodes × 384 dim × float32 = ~1.5 MB plus
sentence-transformers model load (~80 MB), so the absolute cost is
small, but startup latency matters for short-lived processes
(notebooks, CLI invocations).

### Warm mode (default — `eager_embed=True`)

- At construction, the corpus encodes every node body and stacks the
  vectors into a NumPy matrix.
- `search_body` is a single matmul against the query vector.
- Construction cost: O(N) embedding calls (typically 1–10s for vault
  scale on CPU).
- First-query latency: ~constant, dominated by query embedding (one
  `Embedder.encode` call).

### Cold mode (`eager_embed=False`)

- At construction, the corpus only loads frontmatter and edges.
- The matrix is built on first `search_body` call.
- Useful when the caller may never invoke a body-leaning intent (e.g.
  pure PROVENANCE walks) and wants minimum startup time.
- First-query latency on a body-leaning intent: spike — same cost as
  warm-mode construction.

### Observability hook

The
[corpus.embedding_matrix.ready](observability.md#backend-health) gauge
reports `0` (cold) or `1` (warm) at any moment. A caller can wait on
that gauge before sending body-leaning traffic.

## Process Lifecycle

| Phase | What happens | Owner |
| ----- | ------------ | ----- |
| Construction | Embedder loaded (model download if missing); `VaultCorpus` instance built; matrix warmed if eager | Caller |
| Steady state | `retrieve()` called repeatedly against the same corpus instance | Caller |
| Reload | New corpus instance built; old one garbage-collected | Caller |
| Teardown | Python process exit; no explicit shutdown required | Caller |

There is no daemon, no background thread, and no file watcher in v0.1.

## Out of Scope (operational)

- Persistent caching of the embedding matrix across processes.
- Concurrent / multi-process access to a single `VaultCorpus`.
- Hot reload on vault file changes.
- Distributed retrieval (sharded corpora).
- Rate limiting (this is a library, not a service).

These are tracked as future-backend concerns and will likely land with
the `KuzuCorpus` adapter rather than as changes to this spec.
