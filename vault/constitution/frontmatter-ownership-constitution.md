---
tags: [vault, ontology, infrastructure, frontmatter]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: active
version: 1.0.0
last_updated: 2026-05-16
---

# Frontmatter Ownership

> **`vault_common` owns the single Pydantic v2 model that defines the schema for every vault node.** Every subsystem (`vault_ctl`, `vault_telemetry`, `convergence_runner`, `graph_retrieval`, `pipeline`) validates against this model. No subsystem owns its own view. Schema evolution is a single PR with N known downstream consumers, not a folklore drift across N tools.

---

## Why this is a constitution, not a convention

The platform architecture discovery (`two-layer-platform-architecture/`) named frontmatter ownership as the architectural fork that drives every other decision. If five subsystems own five views of the same schema, the schema becomes folklore: five parsers handle `convicção` slightly differently, telemetry silently drops documents `vault_ctl` accepts, the graph retriever indexes nodes the Lean pipeline rejects. The drift is silent, cumulative, and impossible to localize after the fact.

A single-owner schema makes the constraint mechanical: a frontmatter change is one PR against `vault_common.frontmatter`, and every subsystem that reads frontmatter rebuilds against the new model. Compile-time guarantees replace folklore.

## Rules

1. **Single source of truth.** The Pydantic v2 model `vault_common.frontmatter.NodeFrontmatter` (and per-`node_type` subclasses) is the *only* authoritative schema for vault frontmatter. `ontology-conventions.md` remains the human-readable spec; `vault_common.frontmatter` is its executable form. When they disagree, the Pydantic model wins for code; the conventions doc must be updated to match.

2. **Per-type subclasses.** `NodeFrontmatter` is the base with universal fields (`node_type`, `layer`, `nature`, `status`, `version`, `last_updated`, `tags`, `is_session`). Each `node_type` has a subclass: `PremiseFrontmatter`, `ConstitutionFrontmatter`, `AxiomFrontmatter`, `ConceptualFrontmatter`, `DiscoveryFrontmatter`, `SessionFrontmatter`, `LensFrontmatter`. Subclasses add type-specific required fields (premise requires `veracidade` + `convicção` + falsification test; lens requires `verification`; session requires `is_session: true` + timestamp + conversation_id; etc.).

3. **No subsystem-private extensions.** A subsystem that needs to attach private metadata to a node uses a sibling file (e.g., `<node>.cache.json`), never extends the frontmatter. Frontmatter extensions are constitution-level changes.

4. **Schema versioning.** Every frontmatter carries a `schema_version` field (added by this constitution; default `1`). Major version bumps require a migration script under `vault/migrations/v<N>-to-v<N+1>.py` that backfills existing files. The validator rejects nodes whose `schema_version` is unknown to the current `vault_common` version.

5. **Forward compatibility.** Unknown frontmatter keys are *warned* but not *rejected*, to allow soft rollout of new fields. After one full schema version, unknown keys become errors.

6. **Carve-outs preserved.** Existing carve-outs from `ontology-conventions.md` (sessions are forward-only on `is_session: true`; `.claude/skills/**` and `.claude/agents/**` are forward-only edge targets) live in `vault_common.frontmatter.carveouts` as explicit functions, not as scattered conditionals.

7. **The constitution is itself a node** governed by `discovery-structure-constitution.md` (which governs how constitutions are written and amended). When this constitution is amended, the version bump is recorded in `last_updated` and a session note records the rationale.

## Migration discipline

This constitution introduces `schema_version: 1` as a required field. Pre-existing vault nodes do not have it. The migration is:

- `vault/migrations/v0-to-v1.py` backfills `schema_version: 1` on every existing node, in place, no other changes.
- Run once. Commit. From then on, every new node carries `schema_version: 1` (enforced by `vault_ctl validate`).
- Future bumps (`v1-to-v2`) follow the same pattern.

## What this constitution does NOT govern

- The contents of frontmatter fields (that's `ontology-conventions.md`).
- The body of vault nodes.
- File naming conventions outside frontmatter.
- The runtime behavior of subsystems beyond "they must validate via `vault_common.frontmatter`."

## Promotion path

This constitution is `active` at v1.0.0 because the platform-architecture discovery identified it as the architectural fork that gates every other decision and the alternative (per-subsystem schema ownership) is concretely worse in named ways. It graduates to `consolidated` once `vault_common.frontmatter` is implemented and at least two subsystems consume it. It graduates to `evergreen` once it has survived one schema bump (v1 → v2) without ambiguity.
