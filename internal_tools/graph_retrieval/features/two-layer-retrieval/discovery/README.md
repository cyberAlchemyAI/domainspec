---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, discovery-pointer]
node_type: readme
is_session: false
layer: ontology, architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Discovery: Two-Layer Retrieval (pointer)

The canonical discovery for this feature lives in the vault:

**[../../../../../vault/discovery/two-layer-retrieval/](../../../../../vault/discovery/two-layer-retrieval/)**

It stays there because:

- The discovery is part of the vault's residue-attractor research arc and
  is referenced by bet `B-001` and the 2026-05-16 corpus snapshots; moving
  or duplicating it would break those references.
- The vault is the canonical home for all `discovery/` content per
  `vault/constitution/discovery-structure-constitution.md`.

This file exists only so the feature folder has a discovery slot per the
feature-folder layout. Do not duplicate the discovery content here.
Edits to the discovery itself go to the vault file.

## What the discovery contains

Four lenses (read in order):

1. GraphRAG state-of-the-art survey — confirms the proposed combination
   is not published.
2. Formal faithfulness derivation — categorical proof that pure vector
   retrieval violates the Yoneda identity criterion.
3. Vector-RAG failure modes — 10 documented failures grounding the
   abstract critique empirically.
4. Query-intent ranking spec — 8-intent taxonomy with per-intent ranking
   functions; `internal_tools/graph_retrieval/compose.py` is the direct
   implementation of this lens.
