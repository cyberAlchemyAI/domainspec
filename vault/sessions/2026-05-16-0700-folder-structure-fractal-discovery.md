---
tags: [vault, ontology, discovery, folder-structure, fractal, two-layer, migration, governance]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory, procedural
status: active
created: 2026-05-16
timestamp: 2026-05-16T07:00:00-03:00
expires: 2026-07-15
conversation_id: folder-structure-fractal-discovery-2026-05-16
decisions_made: true
contradictions_found: false
parent_session: vault/sessions/2026-05-16-0600-residue-closure-and-lean-drafts.md
specs_updated:
  - vault/discovery/folder-structure-fractal/ (new — README + 7 lenses)
  - vault/constitution/vault-folder-structure-constitution.md (new — DRAFT, status: draft, not yet active)
  - vault/amendments/2026-05-16-add-layer-field-to-nodefrontmatter.md (new — pending review)
  - vault/migrations/v1-to-v2-folder-restructure.py (new — dry-run-only until reviewed)
  - internal_tools/vault_common/_pending_layer_field.py (new — staged code change for `layer:` field narrowing)
  - vault/snapshots/2026-05-16-v0.2.json (new — corpus_hash captured)
promoted_candidates: []
expected_importance: 9
importance_rationale: "Closed the fractal-folder + two-layer-guarantee question via two nested-subagent waves (3 research + 3 evaluation). The convergent verdict is partial adoption: top-level vault/{schema,instance}/ split + layer field + Unit shape for discoveries only; defer mandatory recursive mirror; decline tower-level folders; block cross-repo on canonicalization protocol. The narrowing dissolves the deadliest E1 attack (A2 — conflict with discovery-structure §1) by not requiring slots inside discoveries. All implementation artifacts on disk: narrowed constitution (draft), migration script (430 lines, dry-run-aborts-on-dirty-tree per safety design), amendment entries. Actual migration execution deferred to a session with installed deps and step-by-step verification capacity."
---

# Folder Structure Fractal — Discovery + Implementation Drafts

## Summary

Two nested-subagent waves answered the fractal-folder + two-layer-guarantee question.

**Wave 1 (research, 3 lenses).** Surfaced four findings: (1) the existing `folder-structure-constitution.md` actually governs FIDC product code, not the vault — greenfield; (2) S5 is violated at the folder level (constitutions mixed with discoveries under one root); (3) cross-vault drift uncaught (byte-identical constitutions, divergent layouts); (4) the proposed structure is genuinely without prior art across 13 surveyed knowledge-management systems. Lens 02 produced the maximal proposal: top-level split + recursive Unit grammar + frontmatter `layer:` field. Kauffman's `K = K{K K}K` cited as stylistic precedent.

**Wave 2 (evaluation, 3 lenses).** Convergent verdict: **partial adoption, not the full proposal as written.** E1's deadliest attack (A2) was that the maximal proposal contradicts `discovery-structure-constitution` §1 ("No other subfolders") — a constitution written this same session. E2 estimated 28h expected migration cost; recommended cheaper alternative (partial top-level move + `layer:` frontmatter, ~14h, ~80% of benefit). E3 found the five vaults are not five instances of one shape (financas_pessoais has no vault; football-stats uses different structure; house_project has a third schema layer); recommended /domainspec-only adoption blocked on a cross-repo canonicalization protocol.

**The narrowing dissolves A2.** Lens 07's synthesis: by saying "no schema/instance slots *inside discoveries*" and applying per-node-type slot rules instead, the partial proposal no longer contradicts discovery-structure §1. The maximal proposal does not survive Wave 2; the narrowed proposal does.

**Implementation drafts (3 parallel agents, none executed).** Three implementation agents produced: (a) the narrowed `vault-folder-structure-constitution.md` (status: draft); (b) the migration script `v1-to-v2-folder-restructure.py` (430 lines, dry-run shows 126 files move with 0 collisions, 2052 link rewrites across 87 files, 122 `layer:` additions, 24 amendment placeholders, self-move ordered last; aborts on dirty git tree per safety design); (c) the `_pending_layer_field.py` staged code change + the R2 amendment entry recording the planned `layer:` field narrowing on `NodeFrontmatter`.

## Why nothing was executed today

Three concrete reasons:

1. **Dirty working tree.** Many uncommitted vault changes from this session. The migration script (correctly) refuses to run. The 3-commit workflow per E2 §E requires a clean baseline.
2. **Verification gap.** Internal_tools' deps (PyYAML, Typer) are not installed in the system Python. Cannot run `vault-ctl validate` after migration to confirm everything still parses. Running a 126-file restructure without that verification capacity is reckless.
3. **`layer:` field narrowing would reject ~100 existing files.** Current values in the vault are `layer: ontology` etc. Tightening to `Literal["schema", "instance"]` requires the migration to have run first (which backfills the correct values from the destination paths). Order: migration → field tightening, not the reverse.

The amendment entry records the planned change; the staged code change sits in `_pending_layer_field.py` for review; the constitution stays at `status: draft` until the migration has been dry-run-reviewed and the amendment cascade applied in order.

## Empirical signature

Snapshot v0.2 vs v0.1 diff records 11 new artifacts at the folder-structure-fractal site, exactly matching what the nested subagents produced. corpus_hash `4b83d93e6f99f918…` → `<new hash>` (see snapshot manifest). The diff is the content-addressed witness that this design phase happened. The next snapshot (v0.3 or v1.0) will record the actual migration execution if it lands.

## Open questions

- Run the migration's `--dry-run` interactively and review the 2052 link rewrites: are any wrong?
- Decide the soft-vs-hard rollout for the `layer:` field: soft (`Layer | None = None` + warning) is recommended by the staging agent; hard (`Layer` required) is cleaner but requires migration-first ordering.
- Draft the cross-repo schema-canonicalization protocol that E3 identified as a blocker for cross-vault rollout. Who owns canonical schema? How do siblings opt in?
- Does the proposal's `vault/schema/conceptual/` vs `vault/instance/...` placement of conceptual nodes survive E1 A4 (the dual-role concern)? Recheck after a sample conceptual node is restructured.

## Files touched (this session)

(Listed in `specs_updated` frontmatter above.)

## Next moves (in order, for a session with installed deps + clean git tree)

1. **Install deps:** `pip install -e /Users/victorboscaro/domainspec/internal_tools/`. Run `vault-ctl status` to confirm.
2. **Commit current vault state.** Make the migration's git-status check pass.
3. **Dry-run the migration:** `python3 vault/migrations/v1-to-v2-folder-restructure.py --dry-run`. Review the 2052 link rewrites by sampling — pick 10 random source files and verify each rewrite.
4. **3-commit migration** per E2 §E: (5a) pure `git mv`; (5b) link rewrites + tool LoC changes; (5c) `layer:` backfill + R2 amendment + draft→active flip on the constitution.
5. **Apply the `layer:` field tightening** in `frontmatter.py` per the staged change in `_pending_layer_field.py`. Update `frontmatter-ownership-constitution` v1.0.0 → v1.1.0 with corresponding amendment entry.
6. **Snapshot v0.3 (or v1.0).** Record the post-migration state.
7. **Run `vault-ctl validate`** to confirm every node passes the tightened schema.

Cross-repo rollout (house_project, maestro-trama, football-stats-oracle): separate work, blocked on the canonicalization protocol per E3.

## Closing reflection

The loop closed again at a new scale. The folder-structure question was framed by the user as a fractal + two-layer question; the framework's own discipline (Wave 1 research → Wave 2 evaluation → narrowing → implementation drafts) was applied; the narrowed proposal survives the adversarial check by being smaller than initially imagined; the implementation drafts are on disk for review; execution is deferred to a session with the right verification capacity. Each evaluator agent did its job; the convergent verdict is honest; no overclaim. The same shape at every level: propose → evaluate → narrow → implement → snapshot → close. The form held.
