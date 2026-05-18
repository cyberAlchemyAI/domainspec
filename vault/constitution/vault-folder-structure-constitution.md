---
tags: [vault, ontology, infrastructure, folder-structure, layer-stratification]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-16
---

# Vault Folder Structure

> **The vault stratifies into two sibling top-level layers — `vault/schema/` (rules that define the graph) and `vault/instance/` (the populated graph itself) — with a `layer:` frontmatter field that path and content must agree on.** This is the narrowed proposal that survived Wave 2 evaluation of `discovery/folder-structure-fractal/`. It honors S5 at the folder level, makes cross-vault drift mechanically diff-able, and explicitly declines the maximal-fractal extensions that did not earn their migration cost.

---

## Status

**Draft.** This document is the design. Adoption is a separate act, conditional on (a) the migration script's `--dry-run` being reviewed, (b) the `layer:` validator landing in `vault_common.frontmatter` first, and (c) `discovery-structure-constitution.md` §1 being amended via R2 to retract "no other subfolders" (it does not need to be retracted to satisfy this constitution as narrowed — see §4 — but the cascade ordering is recorded in `lenses/07` of the discovery for traceability).

## 1. The split

Two mandatory top-level siblings under `vault/`:

```
vault/
├── README.md
├── schema/      # rules: definitions, conventions, constitutions, migrations
└── instance/    # populated content the schema governs
```

Both folders are **mandatory** after migration. A vault with only one is malformed.

## 2. Migration map

| Current path | Post-migration path |
|---|---|
| `vault/constitution/*.md` | `vault/schema/constitution/*.md` |
| `vault/ontology-conventions.md` | `vault/schema/conventions/ontology-conventions.md` |
| `vault/confidence-levels.md` | `vault/schema/conventions/confidence-levels.md` |
| `vault/foundational-knowledges.md` | `vault/schema/ontology/foundational-knowledges.md` |
| `vault/ontology-architecture-draft.md` | `vault/schema/ontology/architecture-draft.md` |
| `vault/agent-navigation.md`, `vault/human-navigation.md` | merged into `vault/README.md` + `vault/schema/conventions/navigation.md` |
| `vault/migrations/` | `vault/schema/migrations/` |
| `vault/amendments/` | `vault/instance/amendments/` |
| `vault/discovery/` | `vault/instance/discovery/` (path-only `git mv`; internal Unit shape preserved) |
| `vault/premise/`, `vault/axiom/` | `vault/instance/{premise,axiom}/` |
| `vault/conceptual/` | `vault/schema/conceptual/` (see §3) |
| `vault/sessions/` | `vault/instance/sessions/` |
| `vault/bets/` | `vault/instance/bets/` |
| `vault/snapshots/` | `vault/instance/snapshots/` |

## 3. Per-node-type slot rules

The grammar is **not** fractal-everywhere. Each node type has explicit slot rules. The grammar is falsifiable because it is finite, not because it is uniform.

- **`discovery/<slug>/`** — required `README.md`; optional `lenses/` (per `discovery-structure-constitution`); **NO `schema/` or `instance/` slots inside a discovery.** This is the narrowing that lets the proposal coexist with the existing discovery constitution.
- **`constitution/<name>.md`** — single file under `vault/schema/constitution/`. No folder, no slots.
- **`premise/<name>.md`** — single file under `vault/instance/premise/`. No folder.
- **`axiom/<name>.md`** — single file under `vault/instance/axiom/`. No folder.
- **`conceptual/<name>.md`** — single file under `vault/schema/conceptual/`. Conceptual nodes are dual-role (E1 A4); they are placed under `schema/` because they define vocabulary used by other nodes' frontmatter and bodies. The instance content is the definition itself.
- **`session/...`** — flat single files under `vault/instance/sessions/`. **Sessions are exempt from the Unit shape** (E1 A3 finding; sessions are time-append-only and have no triangulation discipline).
- **`bet/<id>.md`** — single file under `vault/instance/bets/`.
- **`amendment/<date>-<slug>.md`** — single file under `vault/instance/amendments/`. Amendments are instance-of-schema-evolution; they record changes to schema but are themselves time-stamped append-only artifacts.
- **`snapshot/<tag>.json`** — single file under `vault/instance/snapshots/`.

Any folder under `vault/schema/` or `vault/instance/` that does not match a rule above is malformed.

## 4. The `layer:` frontmatter invariant

Every vault node carries a required frontmatter field:

```yaml
layer: schema | instance
```

`schema` for files under `vault/schema/**`; `instance` for files under `vault/instance/**`. The validator (`vault_common.frontmatter.NodeFrontmatter`, extended) rejects any node whose `layer:` does not match its path. This replaces the historical `layer: ontology` usage — the old value is migrated to `layer: schema` for constitutions and `layer: instance` for everything else. Field governance is delegated to `frontmatter-ownership-constitution.md`; this constitution is the policy that field exists to enforce.

## 5. Self-canonicalization

This constitution governs the structure it lives inside. Bootstrap is explicit:

- **Before migration:** this file lives at `vault/constitution/vault-folder-structure-constitution.md`.
- **After migration:** this file lives at `vault/schema/constitution/vault-folder-structure-constitution.md`.
- The R2 amendment-log entry that records the migration also records the path change of this constitution. The amendment is written under the *post-migration* path (`vault/instance/amendments/`), in the same atomic commit as the moves.

## 6. Cross-repo deferral

This constitution applies to **`/domainspec` only**. The four sibling repos (`house_project`, `maestro-trama`, `financas_pessoais`, `football-stats-oracle`) are out of scope. Cross-repo coordination requires a separate **schema-canonicalization protocol** (not yet drafted) that resolves ownership of byte-identical constitution files across repos. Per E3 recommendation: **block** cross-repo rollout until that protocol exists; otherwise drift detection becomes visible but unactionable.

## 7. What this constitution does NOT do

- It does **not** retract `discovery-structure-constitution.md` §1's "no other subfolders" rule. The narrowed proposal in §3 (no `schema/`/`instance/` slots inside discoveries) is compatible with §1 as written. If a future amendment to discoveries adds local slots, it is governed by R2 and is a separate decision.
- It does **not** mandate a recursive Unit grammar at every depth (E2 and E3 deferred this; the cost outweighs the benefit at current scale).
- It does **not** encode reflection-tower levels as folders (E3 declined; the tower is implicit in citation chains, not folder names).
- It does **not** govern asset files, generated content, or person-namespaces. Those are residues to be addressed when they exist in the vault.

## 8. Promotion path

`draft` → `active` once: (a) `vault_common.frontmatter.NodeFrontmatter.layer` lands with the path-coherence validator; (b) the migration script `vault/migrations/v1-to-v2-folder-restructure.py` is written and its `--dry-run` output is reviewed; (c) `discovery-structure-constitution.md` is checked for §1 compatibility (the narrowing in §3 should suffice; if a contradiction is found, amend via R2 before this constitution goes active). `active` → `consolidated` once the migration has executed and three subsequent vault edits have validated without drift.
