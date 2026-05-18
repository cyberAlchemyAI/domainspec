---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, feature]
node_type: readme
is_session: false
layer: architecture, application
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Feature: Two-Layer Retrieval

Implementation of retrieval over the graded knowledge vault that reads both
schema-layer structure (typed edges, node types, evidence stages,
verification provenance) and instance-layer content (body embeddings).
The contract lives in [spec/SPEC.md](spec/SPEC.md). The design that
motivates the contract lives in the vault — see
[discovery/README.md](discovery/README.md) for the pointer.

## Lifecycle order

```
discovery (vault, canonical)  →  spec (here)  →  code (../intent.py, ../compose.py, retriever.py)
```

The discovery is load-bearing: do not edit the spec without re-reading the
discovery. The spec is the contract: do not edit the code without
updating the spec.

## Layout

```
features/two-layer-retrieval/
├── README.md          # this file
├── discovery/
│   └── README.md      # pointer to vault/discovery/two-layer-retrieval/
└── spec/
    └── SPEC.md        # the contract — read this before writing retriever.py
```

## Status

Draft. The discovery is exploratory; the spec is the first concrete
proposal for prototyping. First prototype target:
`/Users/victorboscaro/house_project/docs/vault/`.
