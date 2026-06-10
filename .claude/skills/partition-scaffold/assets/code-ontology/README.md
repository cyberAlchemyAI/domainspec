---
tags: [code-ontology, taxonomy, schema, readme]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: active
version: 1.0.0
last_updated: 2026-06-09
---

# code-ontology/

The canonical **code ontology (L1)** for this project: the closed vocabulary of
**meta-types** (what a domain concept *is*) and **typed relationships** (how concepts
connect), with machine-checkable signatures. This is the L1 layer a feature concept-graph
is built from and the `domainspec-l1-extractor` validates against.

## Files

| File | Role |
|------|------|
| [`code-ontology.json`](code-ontology.json) | **Source of truth.** 25 meta-types, 29 edges, 4 edge families, signatures, the paper↔repo token map, and the formal properties P1–P5. Edit THIS; the markdown views are generated from it. |
| [`TAXONOMY.md`](TAXONOMY.md) | Human-readable view of the meta-types. |
| [`RELATIONSHIPS.md`](RELATIONSHIPS.md) | Human-readable view of the typed edges + signatures. |
| `validate_ontology.py` | Stdlib validator: self-checks the JSON's invariants, and type-checks a concept graph (e.g. an extracted `L1.json`) against the edge signatures (Property P1). |
| `tests/` | Pytest covering the schema invariants and the graph type-checker. |

## Use

```sh
python3 schema/code-ontology/validate_ontology.py                 # self-check the ontology
python3 schema/code-ontology/validate_ontology.py path/to/L1.json # type-check a concept graph
```

> The graph type-checker accepts both shapes: the real extractor's `{objects, morphisms}` (object `meta_type`, morphism `rel_type`/`source`/`target` over object IDs) and the generic `{nodes, edges}` (`meta_type`, `type`/`source`/`target`). They are normalized internally before the P1 signature check.

## The four edge families (P5 — disjoint union)

- **R_B** (12) — backend → backend, within one feature.
- **R_CF** (3) — backend → backend, **across** a feature boundary (`source@A → target@B`).
- **R_U** (8) — UI → UI.
- **R_X** (6) — UI → backend only (P3, unidirectional).

## Provenance

Reconciled from the DomainSpec paper (§4: 24 meta-types / 26 edges, no cross-feature family,
no intra-UI signatures) and the framework repo (`TAXONOMY.md` / `RELATIONSHIPS.md`: 25 / 29).
The repo superset is canonical; the cross-feature edges were split into their own family so the
partition is honest. See `code-ontology.json` → `provenance`. The framework's own
`l1-extractor` still cites the paper's stale "24/26" counts — this self-contained bundle does
not depend on that.
