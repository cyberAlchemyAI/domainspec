---
tags: [vault, ontology, edges, invariants]
node_type: constitution
is_session: false
layer: ontology
nature: enforcement
status: exploratory
version: 0.1.0
last_updated: 2026-05-16
derives-from:
  - vault/discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md
---

# Edge Acyclicity

> Closes residue **R3** of the invariants-and-layer-alignment lens (§C row S10, §D S10): the schema requires `derives-from` to be well-founded, but no populated check enforced this on the actual edge graph. A cycle would create a non-terminating promotion loop and break the uniqueness argument for axiom-as-terminal.

---

## Objective

Some edge types in the graded knowledge graph carry a *direction-of-justification* and must therefore be acyclic on the populated edge set. This constitution names which edge types those are, why, and assigns the detection responsibility to `vault-ctl cycles`.

## 1. Per-edge-type acyclicity

| Edge type | Acyclic? | Rationale |
|---|---|---|
| `derives-from` | **yes (S10)** | Justification chains must terminate at an axiom. A cycle is a non-terminating promotion loop. |
| `supersedes`   | **yes**      | Semantic: a node supersedes its predecessor, not vice versa. A cycle means "X replaces Y replaces X" — incoherent. |
| `governs`      | **yes**      | A governance loop (rule A governs rule B governs A) collapses L3 separation; no node can be the *source* of authority. |
| `part-of`      | **yes**      | Mereological containment is a strict partial order. |
| `codified-as`, `operationalized-by`, `validates`, `creates`, `modifies` | **yes** | All carry a direction (abstract→concrete, evidence→claim, action→effect). Cycles indicate a mislabelled edge. |
| `cites`        | **no**       | Bibliographic citation is naturally cyclic across a corpus; no semantic violation in two notes citing each other. |
| `contradicts`  | **no**       | Schema-mandated symmetric (S11). Self-loop is still forbidden (a node cannot contradict itself). |
| `lenses`       | **no**       | Indexing edge from a discovery README to its lenses; not a justification. |

The acyclic set is therefore:
`derives-from, supersedes, governs, part-of, codified-as, operationalized-by, validates, creates, modifies`.

## 2. Self-loops

For any **acyclic** edge type, a self-loop (`A —t→ A`) is forbidden. It is a degenerate cycle of length 1 and is always either a typo or a category mistake. For `contradicts`, self-loops are also forbidden (a node contradicting itself is unsatisfiable, not informative). For `cites`, self-loops are allowed but pointless and may be flagged as warnings.

## 3. Detection responsibility

`vault-ctl cycles check` runs DFS-based cycle detection on the subgraph restricted to each acyclic edge type and reports every cycle found, by edge type, as a human-readable path `A → B → … → A`. `vault-ctl cycles report` produces the same data with file paths and edge counts for human review. Both commands accept `--strict`; with `--strict`, exit non-zero if any cycle is found.

The detector reads only the in-vault edge graph: edges whose `dst` is a URL or external (non-`.md`) target are excluded from the cycle graph — they cannot participate in an in-vault cycle.

## 4. Fix responsibility

The tool **reports, does not auto-fix.** A cycle in a justification edge is a content error: the author must decide which edge is wrong and edit the frontmatter. Auto-removal would silently change provenance, which is exactly the discipline `derives-from` exists to preserve.

When a cycle is reported, the standard remedies are: (i) re-type one edge (it was `derives-from` but should be `cites`); (ii) reverse one edge (the direction was inverted); (iii) introduce a new intermediate node breaking the loop and demote one side.

## 5. Boundary

This constitution governs *edge-graph shape*, not edge *semantics* beyond the direction-of-justification claim. It does not police whether a `derives-from` edge is *justified* — only that the resulting digraph is acyclic. Substantive justification is the reviewer's call.

If a new edge type is added to `EDGE_FIELDS`, this constitution must be updated to declare its acyclicity status before the detector ships.
