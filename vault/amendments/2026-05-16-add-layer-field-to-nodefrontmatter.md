---
amendment_id: 2026-05-16-add-layer-field-to-nodefrontmatter
date: 2026-05-16
schema_document: vault/constitution/frontmatter-ownership-constitution.md
change_type: schema_version_bump
old_version: 1.0.0
new_version: 1.1.0
trigger:
  session: null
  discovery: vault/discovery/folder-structure-fractal/
  falsified_premise: null
dependents:
  - internal_tools/vault_common/frontmatter.py (NodeFrontmatter base)
  - internal_tools/vault_ctl/cli.py (validate)
  - internal_tools/vault_telemetry/* (every reader of NodeFrontmatter)
  - convergence_runner, graph_retrieval, pipeline (transitive — all validate via vault_common.frontmatter)
  - vault/**/*.md (every existing node must be back-filled by v1-to-v2 migration)
review:
  validator_passed: pending
  snapshot_tag: null
author: victorboscaro
---

# Amendment: add `layer:` field to `NodeFrontmatter`

## Why

Lens 07 of the `folder-structure-fractal/` discovery (wave-2 synthesis-and-verdict) closes on a partial-adoption verdict: the `vault/schema/` vs `vault/instance/` split is justified at the top level even though the fully-recursive Unit grammar is deferred. The split is load-bearing only if it is *mechanically enforced* — i.e. a node's frontmatter declares which layer it belongs to and the validator rejects any file whose declared layer disagrees with its path under `vault/`.

Without the field, the split is folklore: a constitution accidentally filed under `vault/instance/` looks identical to one correctly under `vault/schema/`, and the discipline that the lens-07 verdict relies on never bites. The `layer:` field is the executable form of the lens's verdict.

## What changed

- `frontmatter-ownership-constitution.md` §1 ("universal fields") gains `layer: Literal["schema", "instance"]` as a required universal field on `NodeFrontmatter`. (The current text already names `layer` in the universal-fields enumeration of §1 rule 2, but did not constrain its values; the amendment narrows the type to the closed two-value vocabulary.)
- `version:` bumped 1.0.0 -> 1.1.0; `schema_version:` for the data model bumped 1 -> 2; `last_updated:` set to 2026-05-16.

## Dependents — required action

1. `vault_common.frontmatter.NodeFrontmatter` gains a `layer: Layer` field with `Layer = Literal["schema", "instance"]`, plus a `@model_validator` that — when the node's file path is known to the validator — asserts the declared `layer` matches the first path segment under `vault/`.
2. `vault-ctl validate` will warn (not reject) on missing `layer:` while soft rollout is in effect. `vault-ctl validate --strict` promotes the warning to an error. After v1-to-v2 migration completes and one snapshot has elapsed, `--strict` becomes the default.
3. Every subsystem that imports `NodeFrontmatter` (vault_ctl, vault_telemetry, convergence_runner, graph_retrieval, pipeline) rebuilds against the new model. No subsystem-private parsing.
4. Existing vault nodes lack `layer:`. A migration script `vault/migrations/v1-to-v2.py` (sibling agent in flight) walks `vault/` and back-fills `layer:` from the file's path: files under `vault/schema/**` get `layer: schema`, files under `vault/instance/**` get `layer: instance`. The migration runs once, in place, and the resulting diff is reviewed before commit.

## Review status

**Draft.** This entry records the design. The Pydantic edit is staged at `internal_tools/vault_common/_pending_layer_field.py` and is *not* yet applied to `frontmatter.py`. Integration order:

1. Migration script `v1-to-v2.py` is written and dry-run reviewed.
2. Pending field is moved from `_pending_layer_field.py` into `frontmatter.py`.
3. Migration runs in place; diff committed.
4. `--strict` is enabled by default; this amendment's `validator_passed` is flipped to `true` and `snapshot_tag` recorded.

This entry is the second deliberate close of residue R2 under `schema-amendment-discipline-constitution.md`, and the first to record a *draft* (not yet applied) schema change — establishing the draft -> integrated lifecycle in the amendment ledger itself.
