---
tags: [vault, lens-findings, folder-structure-fractal]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Fractal Folder Theory + Two-Layer Guarantee

## Provenance (pre-migration lens header)

- **Lens slug.** `02-fractal-folder-theory`
- **Original dispatch date.** 2026-05-16
- **Dispatched by.** subagent — theoretical proposal for fractal folder structure with two-layer guarantee
- **Original `addresses` line.** Define precisely what "fractal folder" and "guarantee two layers" mean for the /domainspec vault; produce a concrete proposal
- **Verification.** [local-files-read, model-recall]
- **Sources (pre-migration list).**
  - /Users/victorboscaro/domainspec/vault/discovery/graph-as-residue-attractor/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md
  - /Users/victorboscaro/domainspec/vault/discovery/graph-as-residue-attractor/lenses/05-kauffman-precedent-check.md
  - /Users/victorboscaro/domainspec/vault/constitution/discovery-structure-constitution.md
  - /Users/victorboscaro/domainspec/vault/constitution/frontmatter-ownership-constitution.md
  - /Users/victorboscaro/domainspec-theorem/docs/domainspec-two-layer-framework.md


The central claim of `graph-as-residue-attractor` is that **form-invariance across self-similar levels produces stability without completeness**. If true, the *folder structure* that hosts the graph must itself be form-invariant — otherwise the host shape contradicts the hosted theorem. This lens states precisely what "fractal folder" and "guarantee the two layers" mean, then proposes a concrete layout.

## A. What "fractal folder structure" means precisely

Three readings, three verdicts.

**(1) Set-theoretic self-similarity** — every folder literally contains the same sub-folder types as the root: `vault/discovery/foo/` carries its own `discovery/`, `constitution/`, `premise/`, etc. Reject. This produces unbounded recursion with no termination criterion, violates the well-foundedness S10 invariant requires of derives-from chains (the folder analogue is "every artifact must root in a finite path from the root"), and is exactly the Russell-style self-reference S5 forbids.

**(2) Topological (Koch-style) self-similarity** — the *shape* (a labelled tuple of slots) is preserved at every level; the *content* of each slot differs by level. A "unit" at any scale is `(README.md, lenses/, schema/, instance/)`. A discovery is a unit. A lens may unfold into a sub-unit if it grows lenses of its own. A constitution is a unit. A session is a unit (with a thinner lenses slot — possibly empty). **Accept this as the load-bearing reading.**

**(3) Grammar-recursive** — define folder structure as a context-free grammar where the `Unit` symbol expands to a fixed shape that may recursively contain `Unit`. Operationally identical to (2) but stated formally. Use as the *specification language* for (2); the proposal below is given as a grammar so `vault_ctl` can validate it mechanically.

The Koch precedent (Kauffman, `Eigen.pdf` §4) is `K = K{K K}K` — one symbol, recursively self-similar, fractal by construction. The folder analogue:

```
Unit  ::=  README.md  schema/  instance/  lenses/
lenses/  ::=  ( NN-<slug>.md  |  NN-<slug>/Unit )*
```

A lens is either a leaf file or, when it grows, a sub-`Unit` with the same four-slot shape. Recursion terminates by **author discretion at each level** (the `discovery-structure-constitution.md` already enforces a ≤7 cap per `lenses/`, and the README ≤60-line cap forces fork-on-overflow). Termination is empirical, not formal — exactly Kauffman's "stop without ritual excursion to infinity."

The shape is the eigenform; the content is what each level instantiates differently. This is the only reading that *operationalizes* the discovery's central claim at the file-system level.

## B. What "guarantee the two layers" means precisely

Three readings.

**(1) Sibling-layer separation** — top-level `vault/schema/` and `vault/instance/`. Schema layer holds constitutions, conventions, ontology, frontmatter spec, edge typing. Instance layer holds discoveries, premises, sessions, bets, conceptual entries. **Preserves S5 strictly** (schema documents live *outside* the instance graph; they govern it from one level up). The two-layer framework's §2.3 is honored: $\mathcal{L}_1$ (instance) and the rules that define $\mathcal{L}_1$ (schema) live in disjoint subtrees.

**(2) Mirror-layer separation** — each folder has `schema/` and `instance/`. `vault/discovery/schema/` would hold the constitution governing discoveries; `vault/discovery/instance/` the discoveries themselves. Compatible with fractality (the schema/instance split *is* the fractal shape's recurring slot pair). Violates S5 only if a folder's `schema/` is treated as a peer of the artifacts it governs; if treated as *the local meta-level*, it actually *enacts* S5 at every scale.

**(3) Type-marker only** — keep flat structure; enforce `layer:` frontmatter. **Reject as the sole mechanism.** It satisfies the *semantic* split but not the *navigational* one: a human or a recursing tool cannot tell from path alone which side of the cut a file is on. S5 demands *stratification*, and stratification is exactly what folders make visible. Type-marker is a useful *redundant* check (already in the frontmatter constitution), not a substitute.

**Accept the hybrid: (1) at top level + (2) recursively within each Unit + (3) as the validating frontmatter invariant.** Sibling separation honors S5 globally; mirror separation makes the fractal shape coherent (every Unit has its own schema/instance distinction); the frontmatter layer-marker ensures path and content cannot drift.

## C. Concrete proposal

### Grammar

```
Vault    ::=  schema/  instance/  README.md
Unit     ::=  README.md  [schema/]  [instance/]  [lenses/]
lenses/  ::=  ( NN-<slug>.md  |  NN-<slug>/Unit )*
schema/  ::=  ( <name>.md  |  <name>/Unit )*    # local meta — rules for this Unit's contents
instance/ ::= ( <name>.md  |  <name>/Unit )*    # populated artifacts governed by ../schema
```

### Top-level

```
vault/
├── README.md
├── schema/                    # the meta-graph: rules that define $\mathcal{L}_1$
│   ├── constitution/          # constitutions (currently /constitution/)
│   ├── conventions/           # ontology-conventions.md, frontmatter spec, confidence-levels
│   ├── ontology/              # ontology-architecture-draft.md, edge typing
│   └── migrations/            # schema-version migrations
└── instance/                  # the populated graph: $\mathcal{L}_1$
    ├── discovery/
    ├── premise/
    ├── axiom/
    ├── conceptual/
    ├── sessions/
    ├── bets/
    └── snapshots/
```

### One level down — a discovery as Unit

```
vault/instance/discovery/graph-as-residue-attractor/
├── README.md
├── schema/                    # local rules specific to this discovery (if any)
│   └── lens-numbering.md      # e.g., why lenses 01-05 are ordered this way
├── instance/                  # populated content not yet promoted to a lens
│   └── notes/
└── lenses/
    ├── 01-invariants-and-layer-alignment.md
    ├── 02-evoc-algorithm.md
    └── 05-kauffman-precedent-check/        # this lens grew its own Unit
        └── README.md  schema/  instance/  lenses/
```

`schema/` and `instance/` at a discovery are *optional* — a discovery with no local rules and no unpromoted notes is just `README.md + lenses/`, which is exactly the current `discovery-structure-constitution.md`. The fractal shape *generalizes* the current shape; it does not invalidate it.

### Two levels down — a grown lens as Unit

```
lenses/05-kauffman-precedent-check/
├── README.md                  # the lens's claim + summary (was the previous flat .md)
├── schema/                    # rules this lens follows (e.g., "all citations must be web-fetched")
│   └── verification-policy.md
├── instance/
│   └── fetched-pdfs/          # raw materials cited by the lens
└── lenses/                    # sub-lenses if the lens itself triangulates
    └── 01-constructivist-foundations-gap.md
```

A leaf lens stays a single `.md` file. A lens that needs its own triangulation unfolds to a Unit. The transformation is mechanical: `NN-<slug>.md` → `NN-<slug>/README.md`.

### Migration map (existing → proposed)

| Current path | Proposed path |
|---|---|
| `vault/constitution/*.md` | `vault/schema/constitution/*.md` |
| `vault/ontology-conventions.md` | `vault/schema/conventions/ontology-conventions.md` |
| `vault/confidence-levels.md` | `vault/schema/conventions/confidence-levels.md` |
| `vault/frontmatter-ownership-constitution.md` | `vault/schema/constitution/frontmatter-ownership.md` |
| `vault/ontology-architecture-draft.md` | `vault/schema/ontology/architecture-draft.md` |
| `vault/migrations/` | `vault/schema/migrations/` |
| `vault/discovery/*/` | `vault/instance/discovery/*/` (preserved internally) |
| `vault/premise/`, `vault/axiom/`, `vault/conceptual/` | `vault/instance/<same>/` |
| `vault/sessions/`, `vault/bets/`, `vault/snapshots/` | `vault/instance/<same>/` |
| `vault/agent-navigation.md`, `vault/human-navigation.md` | `vault/README.md` + `vault/schema/conventions/navigation.md` |
| `vault/foundational-knowledges.md` | `vault/schema/ontology/foundational-knowledges.md` |
| `vault/backlog`, `vault/_backlog.md`, `vault/amendments/`, `vault/assets/` | hardest cases — see §F |

### Frontmatter invariant (the type-marker layer)

`vault_common.frontmatter.NodeFrontmatter` adds: `layer: schema | instance` (required, redundant with path; validator rejects mismatch). This is the (3) reading enforced as a path/content coherence check, not as a substitute for the folder split.

## D. What fractality buys

1. **The host shape now witnesses the hosted theorem.** The vault stops contradicting its own central discovery. Form-invariance under recursion *at the folder level* is the eigenform property `graph-as-residue-attractor` claims for the graph.
2. **Generic recursion for tools.** A `vault_ctl walk` that knows the `Unit` grammar can recurse without case-splitting on depth. The traversal is one function, not seven.
3. **Onboarding is depth-invariant.** A reader who learns "every folder is a Unit with these four slots" navigates any depth without re-learning.
4. **S5 enforced by stratification.** Schema documents *cannot* be the target of an `instance/` edge by path alone. The Russell-dodge is mechanical, not aspirational.
5. **Promotion path becomes a folder operation.** A lens that grows a sub-lens is a mechanical `mv NN-<slug>.md NN-<slug>/README.md && mkdir lenses/`. The current constitution's fork-on-overflow rule (≤7 lenses) becomes a *local* operation, not a re-architecting one.
6. **Schema-meta evolution gets a home.** Residue (i) in §C of lens-01 — "schema documents have no instance discipline for their own evolution" — partially closes: `vault/schema/` is itself a Unit with its own README and its own (rare) lenses tracking schema evolution.

## E. What fractality costs

1. **Deeper paths.** `vault/discovery/foo/lenses/05-bar.md` becomes `vault/instance/discovery/foo/lenses/05-bar.md` (+1 segment). For grown lenses, +2.
2. **Optional slots create variance.** Most Units will have empty `schema/` and `instance/` sub-folders; humans must learn "absent slot = no local rules" instead of "this folder has no slots." Mitigation: validator allows omission; presence implies content.
3. **Migration cost is real.** Every cross-file link, every `derives-from` frontmatter pointer, every tool path-pattern must be rewritten. A v1→v2 migration script under the (now repositioned) `vault/schema/migrations/v1-to-v2-fractal-layout.py` is mandatory.
4. **Hierarchical-thinking humans pay a translation tax.** People who navigate by "where do constitutions live" must now navigate by "schema/constitution," one extra hop. The single-rule benefit (one shape at every depth) only pays back after enough depth.
5. **Two layers everywhere risks ceremonial empty folders.** Many discoveries genuinely have no local schema. Forcing the slot wastes attention; making it optional weakens the form-invariance. The proposal chooses optional + validator-enforced naming when present.

6. **Migration cost is recurring, not one-time.** The v1→v2 fractal migration is itself a one-shot link-rewrite. But the same class of cost recurs *indefinitely* every time a claim is promoted or demoted between `instance/premise/` and `instance/axiom/` — per `epistemic-chain.md` D-10, promotion is a file move, and under the fractal layout every such move triggers exactly the same link-rewrite mechanics as the v1→v2 migration, scoped to one claim. The fractal layout doesn't *cause* this cost (any path-based layout has it), but it inherits it. The resolution mechanism — stable claim-id, path rewrite pass, or accept-breakage — is open in `epistemic-chain.md` OQ-6 and is load-bearing for whether `vault_ctl` needs a frontmatter index or merely a path-walker.

7. **The schema/instance cut bisects the epistemic stack.** Under the proposal, `constitution/` lives in `schema/` while `premise/` and `axiom/` live in `instance/`. The epistemic-chain stack (`premise/axiom` → `constitution/skill` → executable code) is a *typed sequence* (belief → norm → executable). The fractal cut splits this sequence in the middle: the belief layer is instance-typed (claims about the world), the norm layer is schema-typed (rules of the system), and the executable layer is partly outside the vault entirely. This is defensible — beliefs are *content of the graph* while norms are *rules that govern the graph* — but it means a reader who learned the epistemic chain as one upward arrow has to additionally learn that the chain crosses a layer boundary between premise/axiom and constitution. Worth naming explicitly in the schema/instance constitution rather than left implicit in the migration map.

## F. The 2-3 hardest cases

**(1) `vault/ontology-conventions.md` and the other root-level loose files.** They are schema by content (governs how nodes are written). Proposal: move to `vault/schema/conventions/ontology-conventions.md`. The root-level placement was already a *visible* S5 violation (schema as peer of instance subtrees). Fix is mechanical; cost is link rewriting.

**(2) `vault/amendments/` and `vault/backlog/`.** Genuine ambiguity. Amendments are *changes-to-schema* — they are schema-evolution records, themselves instance-like artifacts about schema. Proposal: `vault/schema/amendments/` (Unit shape: README + instance/ = the amendment files). This makes them schema *meta-history*. Backlog is *instance-of-work-to-do* about *both layers*; it cannot live cleanly on one side. Proposal: `vault/instance/backlog/`, with frontmatter `targets: schema | instance` per item. Acknowledged: this is the residue point where the two-layer split *itself* needs an instance carrier — exactly the §C residue (ii) the lens-01 analysis predicted.

**(3) Existing `vault/discovery/*` folders.** Their internal shape (README + lenses/) is already a degenerate Unit. Migration is **path-only**: `git mv vault/discovery vault/instance/discovery`. The internal structure is preserved; the fractal shape is honored vacuously (no local schema/instance slots needed). Lenses that have already grown beyond a single file (none currently) would be upgraded leaf→Unit individually.

**(4) `vault/premise/` and `vault/axiom/` as sibling vs unified folders.** Both go under `instance/` (they are claims, not rules), so the schema/instance cut is decided. But sibling-folder placement vs a single `instance/claims/` folder with a `node_type` frontmatter discriminator is *not* decided, and it interacts directly with `epistemic-chain.md` D-10 (promotion = file move) and OQ-6 (edge-target identity). Sibling folders make the evidence-state visible in the path — `instance/premise/foo.md` vs `instance/axiom/foo.md` — at the cost of recurring `git mv` operations and inbound-edge breakage on every promotion/demotion. A unified `instance/claims/foo.md` with `node_type: premise|axiom` in frontmatter makes promotion a frontmatter edit with no path change, at the cost of losing the folder-as-stratification signal that B(1) and B(2) make load-bearing for the rest of the schema (the path no longer tells you the claim's evidence-state). The fractal proposal as currently written assumes sibling folders by inheriting the existing layout, but this is *not* an argued choice — it is a default. The decision is owed to a follow-up lens or to the OQ-6 resolution; whichever resolves first should pin the other.

## G. Honest acknowledgment

Under-specified or speculative:

- **Termination criterion is empirical, not formal.** The grammar permits arbitrary depth; only the per-Unit caps (≤7 lenses, ≤60-line README) prevent runaway recursion. A formal well-foundedness argument analogous to S10 for derives-from chains is not provided here.
- **Sessions don't fit the Unit shape cleanly.** A session is append-only, single-file, time-stamped. Forcing it into a Unit (README + slots) over-engineers it. Proposal silently allows `instance/sessions/<id>.md` as a leaf, breaking the fractal invariant for this one type. Honest residue.
- **The mirror layer (B.2) might be overkill at every level.** I argue for it as the fractal slot-pair; an alternative is to keep schema/instance only at the top and let lower Units omit the split entirely. The cost-benefit of recursive mirroring is not empirically established.
- **No instance-side check yet that path matches frontmatter `layer:`.** The frontmatter constitution must be amended to add the cross-check; until then, the type-marker (B.3) is advisory.
- **Bets and snapshots are placed in `instance/` by default but may deserve their own top-level treatment** — bets are the convicção-instance carrier (§C residue (i)) and may be schema-meta-instance hybrids. Flagged for a follow-up lens.
- **No migration is free.** I have not estimated link-rewrite cost on the current vault; the migration script is named but not designed.

The proposal lives or dies on whether the *fractal* (Unit) shape actually reduces complexity over its alternative (flat + frontmatter type-marker only). I believe it does, because the discovery it instantiates requires it. But the empirical test is: after migration, does `vault_ctl walk` get shorter, and does onboarding time drop? Those are the falsification criteria.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
