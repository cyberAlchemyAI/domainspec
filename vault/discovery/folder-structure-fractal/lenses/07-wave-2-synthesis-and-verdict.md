---
lens: wave-2-synthesis-and-verdict
date: 2026-05-16
dispatched_by: synthesizer — integrate lenses 04, 05, 06 into a single verdict and adoption plan
addresses: State precisely what survives Wave 2 evaluation of the fractal-folder proposal, what is deferred, what is declined, and the amendment cascade required to adopt
sources:
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/02-fractal-folder-theory.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/04-adversarial-attack.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/05-migration-cost-estimate.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/06-long-term-cross-repo.md
  - /Users/victorboscaro/domainspec/vault/constitution/discovery-structure-constitution.md
  - /Users/victorboscaro/domainspec/vault/constitution/schema-amendment-discipline-constitution.md
  - /Users/victorboscaro/domainspec/vault/constitution/frontmatter-ownership-constitution.md
verification: [local-files-read]
---

# Lens 07 — Wave 2 Synthesis and Verdict

The three Wave 2 evaluators (E1 adversarial, E2 migration-cost, E3 long-term + cross-repo) read the lens 02 proposal independently and converged on the same shape of answer: **partial adoption.** The two-layer top-level split survives. The recursive mirror, the all-the-way-down Unit grammar, and the cross-repo universalism do not.

This lens records what the verdict is, why it is that, what gets adopted, what gets deferred, what gets declined, and the amendment cascade required to ship the adopted slice. It also names — honestly — that the resulting design is materially smaller than the proposal that prompted Wave 2.

## A. Convergent verdict

All three evaluators land on the same conclusion under different framings:

- **E1 (adversarial)** found one fatal attack (A2: direct contradiction with `discovery-structure-constitution.md` §1) and one structural defect (A1: with every slot optional, the grammar degenerates to "anything goes"). E1's defensive amendment list mandates per-node-type slot rules and explicit retraction of any contradicting prior rule. E1 explicitly says: "The strongest version is much narrower."
- **E2 (migration-cost)** measured ~900 path references across ~60 files (~37 expected engineering hours for /domainspec alone) and recommended option I.3 + I.2: partial top-level move plus `layer:` frontmatter, deferring the full fractal. Cost asymmetry argument: full migration is 3× the partial migration for marginal-and-unmeasured benefit.
- **E3 (long-term + cross-repo)** found that the schema/instance binary holds well at 1k files, leaks at 10k files (schema-of-schema will appear and demand its own folder), and that the proposal cannot apply uniformly across the five sibling repos (`financas_pessoais` has no vault; `football-stats-oracle` uses `raw/` not `lenses/`; `house_project` carries a third "product-schema" layer the binary doesn't name). E3 recommends shipping the top-level split, deferring the recursive mirror, declining reflection-tower folder encoding, and blocking cross-repo adoption until a schema-canonicalization protocol is drafted.

Three different attack vectors, one consensus: **the load-bearing win is the top-level split + the `layer:` validator. Everything else is overreach.**

## B. The narrowed proposal (what gets adopted)

1. **Top-level `vault/schema/` and `vault/instance/` siblings.** Both mandatory. Migration map covers every existing top-level folder. This is the only structural change.
2. **The `layer:` frontmatter field**, required on every node, values `schema | instance`, MUST match the file's path. Validator in `vault_common.frontmatter` enforces.
3. **Per-node-type slot rules** (closes E1 A1). Each node type has an explicit shape:
   - discoveries: `README.md` + optional `lenses/`, no other subfolders (preserves `discovery-structure-constitution` §1);
   - constitutions, premises, axioms, conceptuals, bets, amendments, snapshots: single file under their respective folder, no Unit promotion;
   - sessions: flat single files under `vault/instance/sessions/`, exempt from any Unit discipline (closes E1 A3).
4. **Conceptual nodes live under `vault/schema/`** (closes E1 A4: they define vocabulary used elsewhere, so they are schema by dominant role).

These four items together are the new `vault-folder-structure-constitution.md` (status: draft).

## C. Deferred (not declined; revisit later under measured load)

- **Recursive mirror at every depth.** E2 found it costs ~3× more for unmeasured marginal benefit; E3 found it would be honored mostly in the breach by 12 months. Revisit if `vault_ctl walk` starts case-splitting on folder type or if grown lenses develop their own local schema needs.
- **Unit-everywhere grammar.** A discovery's `lenses/NN-<slug>/` may, in the future, opt into a full Unit shape (README + slots). That capability is *not* added now. The grammar in this draft is finite and per-type.
- **Schema-of-schema folder split.** E3 predicted `vault/schema/schema/` will appear at 10k files. Not pre-built. When it appears, decide then.

## D. Declined (will not adopt)

- **Encoding reflection-tower levels as folders** (E3 §C). The tower is generative, not enumerable; encoding levels as folder names would require committing to a count the framework refuses to commit to. Level stays implicit in citation chains.
- **Cross-repo simultaneous rollout.** E3 §I.8 named the missing protocol: drift detection without resolution is half a feature. **Block** cross-repo coordination until a separate schema-canonicalization protocol is drafted. /domainspec migrates alone.
- **The S5/Russell-dodge framing as load-bearing justification** (E1 A6). The folder split is navigational; the actual Russell-dodge already lives in `vault_common.frontmatter` per the frontmatter-ownership constitution. The new constitution does not claim S5 as its primary warrant.
- **The Kauffman analogy as derivation** (E1 A10). The Eigen.pdf §4 framing in lens 02 is motivational. Not carried into the new constitution.

## E. Amendment cascade required to adopt

Adoption is not a single act. It is a sequence, governed by R2 (`schema-amendment-discipline-constitution.md`). The order matters because each step has the next step as its precondition.

**Step 1 — `frontmatter-ownership-constitution.md` is amended (document_version bump).** Add the `layer:` field to `NodeFrontmatter` with values `schema | instance` and a path-coherence validator. R2 entry: `vault/amendments/2026-05-NN-add-layer-field.md`. Validator must land *before* any files move (E1 A9: no validator, no migration).

**Step 2 — `vault-folder-structure-constitution.md` is written at status `draft`** at its pre-migration path `vault/constitution/vault-folder-structure-constitution.md`. This is the file produced alongside this lens. No R2 entry yet — `draft` constitutions are not active schema.

**Step 3 — Migration script `vault/migrations/v1-to-v2-folder-restructure.py` is written and dry-run.** Output reviewed manually before any `git mv`. Estimated ~200 LoC per E2 §G.

**Step 4 — Check `discovery-structure-constitution.md` §1 for actual conflict.** The narrowed proposal does **not** add `schema/` or `instance/` slots inside discoveries (§3 of the new constitution explicitly forbids them). §1's "no other subfolders" is therefore *not contradicted* by the narrowed design. **No amendment to discovery-structure is required by this constitution.** (E1's A2 attack was against the *maximal* lens 02 proposal, which did add slots inside discoveries; the narrowing dissolves the contradiction. This is the move that makes A2 stop biting.) If a future change wants to add local slots to discoveries, *that* change triggers an R2 amendment to discovery-structure §1.

**Step 5 — Execute migration in three commits (per E2 §E):**
- 5a: `git mv` commit only (12 ops; rename detection preserves history).
- 5b: link-rewrite commit (~900 substitutions across ~60 files; tool LoC updates to `_AMEND_DIR`, `v0-to-v1.py`'s `VAULT_ROOT`, `vault_ctl snapshot` path).
- 5c: schema commit (add `layer:` field to all 111 files; write R2 amendment recording the migration; flip `vault-folder-structure-constitution.md` from `draft` to `active`).

**Step 6 — R2 amendment recording the migration** is written at `vault/instance/amendments/2026-05-NN-vault-folder-restructure.md` (post-migration path). The amendment cites lens 07 as its trigger, lists every moved file's old→new path, and records the path change of the new constitution itself (which moves from `vault/constitution/` to `vault/schema/constitution/` in the same atomic commit).

**Step 7 — Validate.** `vault-ctl validate --strict && vault-ctl edges-check --strict && vault-ctl snapshot vault-corpus-v0.2-layer-stratified`.

**Files that need amendment via R2 (final list, in order):**

1. `vault/constitution/frontmatter-ownership-constitution.md` — `document_version_bump` to add `layer:` field; one R2 entry.
2. `vault/migrations/v0-to-v1.py` — `VAULT_ROOT` path; covered under the migration commit, no separate R2 entry (it is a script, not a schema doc).
3. `internal_tools/vault_common/{frontmatter,amendments,bets}.py`, `internal_tools/vault_ctl/{cli,amendments,bets,governance}.py` — tool LoC updates per E2 §C; not schema docs, no R2 entries; covered by code review.
4. `vault/constitution/discovery-structure-constitution.md` — **no amendment required** under the narrowing. Flagged only as "verified compatible with new constitution §3."
5. `vault/constitution/vault-folder-structure-constitution.md` itself — when it flips from `draft` to `active`, a `document_version_bump` R2 entry records the flip, the migration's success, and the constitution's own path change.

The cascade is short because the narrowing dissolved the worst conflict (A2). The amendment-on-the-amendment-trail bootstrap problem (E1 A8) is solved by writing the amendment file *after* the migration creates its destination path; the migration commit is atomic.

## F. Honest acknowledgments

- **This is materially smaller than what Wave 2 evaluated.** Lens 02 proposed a fractal grammar applied at every depth, a recursive mirror split, and an aspiration of cross-repo uniformity. The version that survives is: two top-level folders + a frontmatter field + per-type slot rules. The "fractal" claim is dropped from the constitution body entirely. Honest: the discovery this whole exercise instantiates (`folder-structure-fractal`) ends up shipping a constitution named `vault-folder-structure` because the fractal part did not survive. That is not failure — it is the discovery doing its job.
- **The design is not the execution.** This lens and the draft constitution are paper artifacts. The migration script does not exist yet. The validator does not exist yet. Until they do, the new constitution is `draft`, not `active`. Treating the design as done would repeat exactly the pathology lens 01 §D documented (byte-identical constitutions, divergent realities).
- **Cross-repo is genuinely blocked.** Without the canonicalization protocol, /domainspec migrating alone will *temporarily widen* the cross-vault drift before any later coordinated effort closes it. This cost is named, not paid down.
- **The meta-recursion holds.** This constitution is governed by R2 (which itself was authored this session). R2's amendment of `discovery-structure-constitution` is not triggered by the narrowed design (§E step 4) — but R2 *does* govern the amendment to `frontmatter-ownership-constitution`, the bootstrap of the new constitution itself, and the eventual flip from draft to active. The closure exercises the closure.
- **The proposal's value, in retrospect.** Even though most of lens 02 did not survive, dispatching it produced: the per-type slot discipline (E1's response), the precise migration cost (E2's grep), and the cross-repo no-go (E3's survey). The maximal proposal was the bait that produced the minimal correct answer. That is the discovery loop functioning correctly.

## G. Adoption verdict

**Adopt the narrowed proposal as the new draft constitution. Execute the cascade in the order specified in §E. Do not flip the constitution to `active` until the migration script's dry-run has been reviewed and the `layer:` validator has landed in code.** Revisit the deferred items at 1k files or when `vault_ctl walk` starts case-splitting, whichever comes first.

The proposal lives — in a smaller body than it was born in.
