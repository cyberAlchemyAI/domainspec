---
amendment_id: 2026-05-16-add-verification-field
date: 2026-05-16
schema_document: vault/constitution/discovery-structure-constitution.md
change_type: schema_version_bump
old_version: 0.1.0
new_version: 0.1.1
trigger:
  session: null
  discovery: vault/discovery/graph-as-residue-attractor/
  falsified_premise: null
dependents:
  - vault_common.frontmatter.LensFrontmatter
  - internal_tools/vault_ctl/cli.py (validate)
  - vault/discovery/*/lenses/*.md (must backfill verification:)
review:
  validator_passed: pending
  snapshot_tag: null
author: victorboscaro
---

# Amendment: add `verification:` to lens frontmatter

## Why

The graph-as-residue-attractor discovery surfaced that lenses recorded *what they claimed* but not *how they were produced*. A lens written from `model-recall` is second-class evidence compared to one with `local-files-read` or `web-fetched`, and the prior schema gave no place to record the distinction. Without this field, downstream promotion decisions (premise -> axiom) cannot weight evidence by production-mode.

## What changed

- §5 of `discovery-structure-constitution.md` now lists `verification:` as a required lens frontmatter field with controlled values `local-files-read | web-fetched | model-recall` (multi-value allowed).
- `version:` bumped 0.1.0 -> 0.1.1; `last_updated:` set to 2026-05-16.

## Dependents — required action

1. `vault_common.frontmatter.LensFrontmatter` gains a required `verification: list[VerificationKind]` field.
2. `vault-ctl validate --strict` will reject lens files lacking the field after the next snapshot.
3. Existing lens files under `vault/discovery/*/lenses/` must be back-filled. A one-shot migration under `vault/migrations/` is authorized but not yet written.

This entry is the first deliberate close of residue R2 from the graph-as-residue-attractor discovery, §C.
