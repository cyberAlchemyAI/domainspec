---
tags: [vault, convention-notes, graph-as-residue-attractor]
node_type: convention-notes
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Convention notes — flagged for canonical-catalog fold-in

This file flags convention extensions used during the 2026-05-18 proving-ground migration of `graph-as-residue-attractor/` that are NOT yet in `vault/ontology-conventions.md`. Fold these into the canonical edge catalog (Appendix C) and the node-type vocabulary before rolling out the new layout to the remaining 15 folders.

## Pending additions

### 1. New edge type: `corroborates` / `corroborated-by`

**Used in this folder.** Lenses 03b and 03c both carry `corroborates` edges pointing to lens 03; lens 03 carries the inverse `corroborated-by` edges.

**Semantics.** A `corroborates` edge from B to A means: B is an independent re-investigation of A's claims using a stronger evidence chain (e.g., hard-fetched primary sources vs `[model-recall]`). B does not replace A; A is preserved as the original synthesis. Both remain in the graph.

**Why not `derives-from` or `cites`.** `derives-from` implies B builds on A's content; `corroborates` is the opposite — B independently re-derives A's claims to upgrade their source-chain. `cites` is too weak: it does not record the audit relationship.

**Proposed inverse name.** `corroborated-by`. Symmetric to other inverse edges in the catalog.

**Action.** Add to `vault/ontology-conventions.md` Appendix C with the above semantics.

### 2. New node types used by the lens → research → discovery convention

The proving-ground migration uses three node types that may not be in the current Appendix:

- `findings` — output of a single lens dispatch; lives at `lenses/<slug>/findings.md`.
- `research` — cross-lens synthesis; lives at `research/research.md`.
- `research-synthesis` — short-form readable summary (≤500 words); lives at `research/research-synthesis.md`.

**Action.** Confirm these are in the node-type vocabulary or add them.

### 3. Backfill flag

`research.md` in this folder carries `backfilled: true` in its frontmatter to record that it was written post-hoc after the discovery already existed. If backfill is going to recur as the new convention rolls out to existing folders, this should become a recognized frontmatter field.

**Action.** Decide whether `backfilled: bool` is a first-class field or a free-text note in the body.

## Historical artifact (not a gap)

`dispatch.md` is omitted from the seven lens subfolders. The original dispatches predate the new convention; the literal prompts are unrecoverable. A folder containing only `findings.md` is the honest representation of a backfilled lens — do not generate fictional `dispatch.md` files to satisfy a schema.
