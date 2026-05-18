---
lens: adversarial-attack
date: 2026-05-16
dispatched_by: subagent — adversarial attack on the fractal-folder + two-layer proposal
addresses: Find concrete ways the proposal breaks; assess severity; recommend defensive amendments
sources:
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/01-prior-research-catalog.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/02-fractal-folder-theory.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/03-external-prior-art.md
  - /Users/victorboscaro/domainspec/vault/constitution/discovery-structure-constitution.md
  - /Users/victorboscaro/domainspec/vault/ (ls)
  - grep counts of internal path refs across vault
verification: [local-files-read]
---

# Lens 04 — Adversarial attack on the fractal-folder + two-layer proposal

The proposal in lens 02 makes three coupled claims: (i) a recursive `Unit ::= README.md schema/ instance/ lenses/` grammar applied at every depth; (ii) a top-level sibling split `vault/schema/` vs `vault/instance/`; (iii) a `layer:` frontmatter invariant cross-checking (i)+(ii). I attack each surface in turn. Severities: FATAL (proposal cannot be adopted as written), SERIOUS (must amend or pay cost), MINOR (cosmetic), CONFUSED (the proposal itself is unclear on what it claims).

## A1 — Recursive Unit shape is wrong for thin nodes (SERIOUS)

**Construction.** A premise file is a single `.md` with frontmatter — `vault/premise/snapshot-as-empirical-floor.md`, ~80 lines. The Unit grammar says a Unit is `README.md [schema/]? [instance/]? [lenses/]?`. If a premise is a Unit, it becomes `vault/instance/premise/snapshot-as-empirical-floor/README.md`. Now: does `conceptual/` contain Units? An entry like `conceptual/eigenform.md` (a vocabulary definition) is also a single `.md`. Promoting it to `conceptual/eigenform/README.md` is wildly disproportionate. The recursion has no natural floor: where does "Unit" stop and "leaf .md" begin? The grammar says lenses may be `NN-<slug>.md | NN-<slug>/Unit`, leaving promotion to "author discretion." But the *same* discretion must exist for premises, conceptuals, axioms — and the proposal does not say so.

**Defense.** "Leaves stay leaves; Unit promotion is opt-in at every type." But then form-invariance is opt-in too, which collapses the central selling point. If most nodes never assume Unit shape, the fractal isn't fractal — it's "some folders happen to have lenses."

**Cost vs save.** Defense costs the whole eigenform argument (D.1 in lens 02). Save: spares ~150 thin files from ceremonial promotion. Defense costs more than it saves *if* the proposal's value rests on form-invariance, which it does.

## A2 — `discovery-structure-constitution.md` §1 directly contradicts the proposal (FATAL to coexistence)

**Construction.** The constitution, status `exploratory` v0.1.1, dated 2026-05-16, says verbatim: "No other subfolders. Provenance beyond lenses … lives outside the vault and is linked from the README." The proposal mandates that every Unit (including every discovery) may carry `schema/` and `instance/` siblings of `lenses/`. The current `graph-as-residue-attractor/` is the *named first instance* under the constitution. Lens 02's example explicitly proposes adding `schema/lens-numbering.md` and `instance/notes/` to that very discovery — a direct violation of §1.

**Defense.** "Amend the discovery-structure constitution." But the discovery-structure constitution was authored the same session (2026-05-16) the fractal proposal was authored. Amending a 12-hour-old exploratory constitution to make room for a still-exploratory proposal violates the schema-amendment discipline's spirit (R2 requires consolidation through use, not retrofitting through aspiration). It is also self-undermining: if a freshly minted rule can be overturned by a not-yet-evaluated proposal, neither rule has authority.

**Cost vs save.** Defense (amend) saves the proposal but destroys the constitution's status as a stable surface. The discovery folder is by *count* the most-instantiated structured area of the vault (12 discoveries). Pulling its shape rule open during Wave 2 is the dominant risk vector. FATAL to *peaceful* coexistence — the proposal must explicitly retract or rewrite §1, and own that as a Wave-2 cost line item, not paper over it.

## A3 — Sessions break the Unit shape; "optional" guts the grammar (SERIOUS, CONFUSED)

**Construction.** 34 session files live flat under `sessions/`. They have no `schema/`, no `lenses/`, no `instance/`. The proposal's grammar `Unit ::= README.md [schema/]? [instance/]? [lenses/]?` makes every slot optional. With every slot optional, `Unit ::= README.md` — i.e., "any folder with a README is a Unit." Then any file `foo.md` is *not* a Unit (no README, no folder). So sessions, which are bare `.md` at `sessions/2026-05-16-*.md`, are not Units at all. They can only be fit by either (a) exempting them (then the grammar isn't a rule, it's a family of allowed shapes), or (b) wrapping each in a folder `sessions/<date>/README.md` (which inflates 34 files to 34 folders for no semantic gain). Lens 02 §G admits this as "honest residue" but does not resolve it.

**Defense.** "The grammar is descriptive at the Unit level; sessions are not Units but `leaf entries under an instance/<type>/` namespace." Fine — but then the proposal has *two* primitives (Unit, leaf) and rules for which is allowed where, which is exactly the non-fractal case-split the proposal claimed to abolish (D.2).

**Cost vs save.** Defense (two-primitive) saves sessions but reintroduces the case-split. The grammar in lens 02 §C does not currently distinguish Unit vs leaf at the type level. CONFUSED: the proposal alternates between "everything is a Unit" (motivating eigenform) and "anything-with-a-README is a Unit" (allowing leaves elsewhere). Pick one.

## A4 — Schema/instance is a false dichotomy for `conceptual` nodes (SERIOUS)

**Construction.** `conceptual/eigenform.md` is *both* schema (it defines a term referenced by other nodes' frontmatter and bodies — it constrains how `eigenform` may be used) and instance (it is a dated, version-bumped, populated artifact that itself complies with `ontology-conventions.md`). Under the proposal it must live at exactly one of `vault/schema/conceptual/eigenform.md` or `vault/instance/conceptual/eigenform.md`. Either choice is wrong: the first puts a populated dated artifact in the rules tree (S5 violation of the kind the proposal claims to *fix*); the second puts a vocabulary-defining artifact in the instance tree (where it can be the target of `derives-from:` edges from constitutions, which the schema/instance split was supposed to forbid). The same problem hits *every* "definitional" artifact: foundational-knowledges, ontology-conventions itself (it both defines `node_type` and asserts version 1.4 instance-style).

**Defense.** "Use the `layer:` frontmatter to mark the dominant role." But then `layer:` does the work and the folder split adds nothing — exactly the (B.3) reading the proposal *rejected* as "satisfies semantic split but not navigational one." The proposal cannot simultaneously demand that path and content not drift AND admit dual-role nodes whose path must arbitrarily pick one role.

**Cost vs save.** Defense undermines (3)+(1) coherence. SERIOUS for any vault that takes its own vocabulary seriously.

## A5 — Cross-vault migration is harder than admitted (SERIOUS)

**Construction.** The proposal says "apply to /domainspec first; record cross-repo migration as separate per-repo work." This is wrong on two counts. First, a grep of the current vault for the strings `vault/(discovery|constitution|premise|axiom|conceptual|sessions|bets|amendments|snapshots|migrations)/` returns **788 occurrences** in `.md` files — every one of these is a path-bearing reference that breaks under `vault/X` → `vault/instance/X` or `vault/schema/X`. Second, `house_project` and `maestro-trama` ship byte-identical constitutions. The moment domainspec restructures, the three constitutions diverge — and the current state (lens 01 §D) already documents that "nothing checks folder shape against any spec." The migration is therefore *coordinated* across all vaults — or one vault's constitutions silently lie about the others.

(Cross-repo file-path links per grep: 1 in current vault. So the inter-vault *link* surface is thin — but the *constitution-text* surface is total: every byte-identical constitution that mentions a folder path goes stale on every non-migrated repo.)

**Defense.** "Stagger the rollout; each vault carries its own migration entry." But staggered rollout means the byte-identical constitutions are *not* byte-identical during the rollout window, which means the cross-vault drift problem lens 01 §D documented gets *worse* before it gets better — the proposal's own diagnostic surface is what migration breaks.

**Cost vs save.** The 788-reference rewrite is mechanical (a sed script), but every rewrite is a chance to break a `derives-from` chain. SERIOUS but bounded if a single migration script is run atomically across all five vaults — which requires the coordination the proposal disclaims.

## A6 — The Russell-dodge claim is overstated (MINOR, CONFUSED)

**Construction.** Lens 02 D.4 claims "Schema documents *cannot* be the target of an `instance/` edge by path alone." False. A node at `vault/instance/discovery/foo/README.md` can write `derives-from: ../../../schema/constitution/bar.md` — the path is just longer. The "stratification" is a depth-suffix on the path, not a typed import boundary. The actual Russell-dodge (S5) was achieved by frontmatter-ownership-constitution declaring the schema lives in `vault_common.frontmatter` *code*, not in any vault file. Moving folders around adds path depth without escaping the graph: both `schema/` and `instance/` are under `vault/` and both contain markdown nodes the graph indexes.

**Defense.** "The folder split is navigational, not type-theoretic." Then drop the S5 framing, which is the proposal's strongest-sounding claim. Without the S5 framing, the value reduces to "humans can tell schema apart from instance by path" — a tag would do the same.

**Cost vs save.** Dropping S5 framing is honest and cheap. MINOR severity; CONFUSED because the proposal trades on the strong reading while doing the weak work.

## A7 — The novelty claim cuts both ways (MINOR)

**Construction.** Lens 03 §G: "no surveyed system has a top-level folder split where one folder holds rules-about-content and the other holds content … /domainspec's split is genuinely novel." The negative reading: 13 surveyed systems, 0 adopt this pattern. The Bayesian prior on "13 mature systems all missed this" vs "13 systems found this not worth the cost" favors the latter. Lens 03 §F.1 *itself* lists "Anti-deep-folders" as the dominant consensus pattern; the proposal adds depth in exactly the dimension the consensus warns against.

**Defense.** "Our vault has constraints those systems don't (constitutions as peer markdown)." True but only argues novelty of the *problem*, not soundness of *this* solution. The argument-from-novelty needs falsifiability: what observation would tell us we picked a novel mistake?

**Cost vs save.** MINOR. The novelty rhetoric is decorative; the proposal stands or falls on internal merits.

## A8 — Migration scripts touch every file; self-referential migration is unresolved (SERIOUS)

**Construction.** 788 path references to rewrite. The bet ledger in `vault/bets/` carries `for_claim:` references; the amendments log records every schema change. Per R2 (schema-amendment discipline), the folder restructure *is itself a schema change* and so must be amendment-logged. But the amendment file would live at `vault/schema/amendments/...` — the new path — which doesn't exist until the migration runs. The amendment recording the migration cannot precede the migration that makes its path exist. Chicken-and-egg.

Worse: the new `vault-folder-structure-constitution.md` must live somewhere. Lens 02 puts constitutions at `vault/schema/constitution/`. But this constitution governs the folder split that puts it there. The constitution's own path is determined by the rule it asserts. If the constitution at `vault/schema/constitution/folder.md` says "schema lives at vault/schema/," moving it elsewhere falsifies itself; staying put makes it self-asserting. Either is fine logically (Gödel-style), but the *amendment trail* — required by R2 — has no path to live on during the bootstrap.

**Defense.** "Two-phase migration: phase 1 creates `vault/schema/` next to the old layout, writes the constitution and the amendment, then phase 2 moves the rest." Workable but doubles the migration cost and creates a window where two roots coexist (paths resolve ambiguously).

**Cost vs save.** SERIOUS. The two-phase defense is mandatory and should be a named, costed step in the proposal, not glossed.

## A9 — Mechanical enforcement is absent (SERIOUS)

**Construction.** Lens 02 §C names `layer:` as the validating invariant but does not say *what code* checks it. Lens 01 §D documents that the three vaults already drift despite byte-identical constitutions, *because nothing checks folder shape against any spec*. Adding a third concept (`layer:`) without naming an enforcer adds a third drift surface. The proposal explicitly defers "vault_common.frontmatter.NodeFrontmatter adds: layer" to a future amendment of a different constitution, with no commitment.

**Defense.** "Write the validator as part of the migration." Necessary, but the proposal does not list this as a Wave-2 deliverable. If unenforced, `layer:` becomes folklore — exactly the failure mode lens 01 §A.4 footnote 4 already named as the current vault's pathology.

**Cost vs save.** Defense (write validator) is non-optional. SERIOUS until promoted to a named gating step.

## A10 — Kauffman analogy is decorative, not load-bearing (MINOR, CONFUSED)

**Construction.** Kauffman's `K = K{K K}K` is a recursion where each `K` *is* a Kauffman-form: the recursion is *semantic* (the same kind of thing all the way down). The proposed folder grammar's recursion is *syntactic*: a folder *contains* sub-folders with these names. The two are not analogous: in Kauffman, `K` denotes itself; in the folder grammar, `instance/` does not *denote* a Unit, it *contains* Units. Calling the folder structure "fractal after Kauffman" overstates the structural parallel. The actual relevant precedent (lens 03 §G) is more honest: same primitive at every level (Roam blocks, TiddlyWiki tag-is-tiddler) — and those systems abandoned folders to achieve it.

**Defense.** "It's a motivational analogy, not a derivation." Fine — then remove the Eigen.pdf §4 framing from lens 02. As long as the analogy is load-bearing in the rhetoric ("the host shape now witnesses the hosted theorem," D.1), it is being asked to do work it cannot do.

**Cost vs save.** Cheap to drop. MINOR; CONFUSED in the proposal's current rhetoric.

---

## The deadliest attack

**A2 (constitution conflict) is the most likely to land.** It is concrete (verbatim §1), undeniable (same session, dates checked), and structural (no semantic argument can resolve "no other subfolders" vs "always allow schema/instance subfolders"). A1, A3, A4, A8 each require a fix but admit fixes; A2 forces a choice between two rules of equal recency and equal status, with no principled tiebreaker. If §1 wins, the proposal cannot apply to the discovery folder — the most-instantiated subtree. If the proposal wins, the constitution becomes provisional-on-arrival, which damages the constitution mechanism itself.

A8 (self-referential migration) is a close second, because it converts what looks like a one-time cost into a sequence the proposal hasn't sequenced.

## Defensive amendments

1. **Retract or rewrite `discovery-structure-constitution.md` §1 explicitly** as part of the proposal package. State the version bump, the rationale, and accept that "no other subfolders" becomes "allowed subfolders are exactly `lenses/`, `schema/`, `instance/`." Make this a *named precondition* of adoption, not a side-effect.

2. **Two primitives, named.** `Unit` (folder with README + slots) and `LeafEntry` (a single `.md` under an `instance/<type>/` namespace). Sessions, premises, conceptuals, axioms, bets are LeafEntries by default; promotion to Unit is opt-in and explicit. Stop pretending the grammar has one primitive — it has two, and that's fine if named.

3. **Drop the S5/Russell-dodge framing.** The folder split is navigational. The actual Russell-dodge already happened in `vault_common.frontmatter`. Demoting the S5 claim to "we mirror, at the path level, the type-level move already made in code" is honest and concedes nothing the proposal actually delivers.

4. **Drop the Kauffman analogy or restate it as motivational only.** Move the `K = K{K K}K` quote to a sidebar; do not let it carry weight in the justification.

5. **Mandate the validator before the migration.** `vault_common.frontmatter.NodeFrontmatter.layer` + a `vault_ctl walk --check-layer` command must land *before* the first file moves. No validator, no migration.

6. **Two-phase migration plan, costed.** Phase 1: create empty `vault/schema/` and `vault/instance/`, write the new constitution and its amendment record at the new paths, validate. Phase 2: move files and rewrite the 788 path references atomically. Phase 3: run validator across all five vaults; surface drift as a separate discovery.

7. **Decide the dual-role conceptual problem explicitly.** Either (a) conceptual is schema (vocabulary defines the language other nodes write in), or (b) conceptual is instance (it's just populated content), or (c) split conceptual into `vault/schema/vocabulary/` and `vault/instance/conceptual-notes/`. Pick one in the lens 02 amendment.

## Honest meta-evaluation

Is the proposal refutable in principle? *Mostly yes, with one soft spot.* The grammar is concrete enough to check (A1, A3, A8 cite specific files); the migration cost is countable (A5: 788 refs); the constitutional conflict is verbatim (A2). These are honest attack surfaces.

The soft spot is the optional-slot grammar (A3). When every slot is optional, the rule degenerates to "anything goes," and the proposal can deflect any concrete attack with "we didn't mean to force that slot there." This is a defect. **Defensive amendment: make slot-presence rules explicit per node-type** (e.g., "discoveries: REQUIRED lenses/, OPTIONAL schema/, OPTIONAL instance/; constitutions: REQUIRED nothing beyond README; premises: LeafEntry only unless promoted"). Without per-type slot rules, the grammar is unfalsifiable, which is itself fatal.

Net verdict: the proposal has real attack surfaces (A2, A8 most serious) and one rhetorical weakness (A6, A10 oversell). It is salvageable but not as written. The strongest version is much narrower: top-level `schema/` vs `instance/` split + mandatory validator + per-type slot rules + explicit retraction of the conflicting constitution §1 + dropped S5/Kauffman rhetoric. That version is worth the migration cost. The version in lens 02, as written, is not.
