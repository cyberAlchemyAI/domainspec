---
tags: [vault, ontology, folder-structure, fractal, two-layer, schema-instance]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
version: 0.1.0
last_updated: 2026-05-17
---

# Folder Structure Fractal — Vault Schema/Instance Stratification

> A discovery exploring whether the vault's folder structure should be made fractal (one recursive `Unit ::= README.md schema/ instance/ lenses/` grammar at every depth) and two-layer-guaranteed (top-level `vault/schema/` vs `vault/instance/` siblings, mirrored at every Unit, with frontmatter `layer:` as the redundant validating invariant). After two waves of evaluation, the maximal proposal does not survive; a narrower design — top-level split + per-type slot rules + `layer:` validator — does, and is what this discovery records as the load-bearing decision.

---

## Objective

Decide whether the vault's folder layout should encode the schema/instance distinction at the directory level (instead of frontmatter alone), whether that encoding should be recursive (fractal) or restricted to the top level, and what migration discipline applies. The end state is a narrowed adoption: top-level `vault/schema/` and `vault/instance/` siblings, per-node-type slot rules, a `layer:` frontmatter invariant cross-checking path and content, with the fractal-everywhere claim deferred pending measured load.

---

## 1. Business Context

### Why now

The vault currently mixes schema-layer artifacts (constitutions, ontology-conventions, confidence-levels, frontmatter spec) with instance-layer content (discoveries, premises, sessions, bets, amendments) under one flat `vault/` root. The framework's S5 invariant (schema lives outside the graph) holds at the frontmatter level but not at the folder level. Lens 01 surfaced a load-bearing finding: the file at `vault/constitution/folder-structure-constitution.md` governs the FIDC product *code* repo, not the vault — **no vault-folder constitution exists**. Cross-vault drift across `/domainspec`, `/house_project`, `/maestro-trama` ships byte-identical constitution files while the actual folder layouts diverge (e.g., `sessions/` vs `conversations/`; `audits/` only in house_project; `bets/` only in domainspec), and nothing mechanically catches that drift.

### What's broken

- `vault/constitution/folder-structure-constitution.md` is misnamed — it governs the FIDC product code, not the vault (lens 01 §A.2).
- No constitution governs vault folder shape; the only formal rule is `discovery-structure-constitution.md` §1 covering one folder family (lens 01 §A.3).
- Schema artifacts (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`, `foundational-knowledges.md`) sit as flat root peers of instance subtrees — S5 violation visible at the folder level (lens 01 §F).
- `vault/constitution/` mixes belief-derived constitutions (schema-shaping) with norm-only constitutions (commit-message, frontend) — the folder hides the schema/instance distinction by mixing both (lens 01 §F).
- Cross-vault drift between `/domainspec`, `/house_project`, `/maestro-trama` is mechanically uncaught (lens 01 §D).
- `discovery-structure-constitution.md` §1 ("no other subfolders") is already in tension with the older `vault/discovery/domainspec-vault-foundations/research/` and `vault/discovery/domainspec-vault-edges/research/` subtrees, neither migrated (lens 01 §C.1).

### What stays the same

- The current discovery-folder shape (`vault/discovery/<slug>/README.md + lenses/`) and its ≤7-lenses + ≤60-line-README caps as declared by `discovery-structure-constitution.md` §1 — **the narrowed design preserves them verbatim** and does not add slots inside discoveries (lens 07 §E step 4).
- Frontmatter-as-source-of-truth for `node_type` (`epistemic-chain.md` A-4) — folder location remains storage, not classification.
- The 21-edge catalog in `ontology-conventions.md` Appendix C and the bidirectionality rule in §8.
- Sessions remain time-flat single files; no Unit promotion.
- The vault platform code (`internal_tools/vault_common/`, `internal_tools/vault_ctl/`) stays at the sibling-of-vault location; no platform restructure.
- Cross-repo rollout is **explicitly out of scope** — `/domainspec` migrates alone; `/house_project`, `/maestro-trama`, `/financas_pessoais`, `/football-stats-oracle` are blocked pending a separate schema-canonicalization protocol (lens 07 §D).

---

## 2. Core Concepts

### C-1. Schema layer vs instance layer (top-level only)

The vault gains two mandatory top-level siblings: `vault/schema/` (rules that define how nodes are written — constitutions, conventions, ontology spec, migrations, amendments) and `vault/instance/` (populated content — discoveries, premises, axioms, conceptuals, sessions, bets, snapshots). The split is **navigational**, not type-theoretic: it makes the schema/instance discipline visible to humans and tools without re-enacting the Russell-dodge that already lives in `vault_common.frontmatter` per the frontmatter-ownership constitution. (Lens 07 §B item 1; lens 02 §B reading 1; closes lens 04 A6's overstated S5 framing by demoting it to navigational.)

### C-2. `layer:` frontmatter as path-coherence invariant

Every node carries a required `layer: schema | instance` field. A validator in `vault_common.frontmatter` rejects any file whose `layer:` value disagrees with its path prefix. This is the redundant cross-check that prevents path and content from drifting and is the falsification hook for the entire design. **The validator MUST land in code before any file moves** (lens 04 A9; lens 07 §E step 1). Without it, the new field becomes folklore — exactly the failure mode lens 01 §A.4 already documented for the current vault.

### C-3. Per-node-type slot rules (closes the optional-slot defect)

The grammar is **not** "any Unit may have any slot." Each node type has an explicit shape declared in the new constitution:

- **discoveries**: `README.md` + optional `lenses/`; no `schema/`, no `instance/` subfolders (preserves `discovery-structure-constitution.md` §1 verbatim).
- **constitutions, premises, axioms, conceptuals, bets, amendments, snapshots**: single file under their respective folder; no Unit promotion.
- **sessions**: flat single files under `vault/instance/sessions/`; exempt from any Unit discipline.

This closes lens 04 A1 (recursive Unit shape is disproportionate for thin nodes) and lens 04 A3 (sessions break the Unit shape; "optional everywhere" degenerates the grammar). The grammar becomes finite and per-type rather than universally recursive.

### C-4. Conceptual nodes are schema by dominant role

`conceptual/` defines vocabulary that other nodes' frontmatter and bodies reference. Under the narrowed design, conceptuals live under `vault/schema/conceptual/`. This closes lens 04 A4's dual-role objection by picking one role explicitly rather than punting to `layer:` alone. (Lens 07 §B item 4.)

### C-5. The fractal (recursive Unit) shape is deferred, not declined

Lens 02's recursive `Unit ::= README.md schema/ instance/ lenses/` grammar applied at every depth is the maximal proposal. It does not ship in this constitution. The capability — a grown lens that needs local schema may opt into a Unit shape — is reserved for a future amendment if and when `vault_ctl walk` starts case-splitting on folder type or grown lenses develop genuine local-schema needs. (Lens 07 §C; lens 06 §I item 3.) This is the partial-adoption verdict, not a rejection of the fractal claim.

### C-6. Amendment cascade (the migration sequence)

Adoption is not a single act; it is a sequence governed by R2 (`schema-amendment-discipline-constitution.md`). The order is load-bearing because each step is the next step's precondition:

1. Amend `frontmatter-ownership-constitution.md` to add `layer:` field + validator (validator lands in code first).
2. Write `vault-folder-structure-constitution.md` at status `draft` at its pre-migration path.
3. Write and dry-run the migration script (~200 LoC, ~112 files moved).
4. Verify `discovery-structure-constitution.md` §1 remains compatible (narrowing dissolves the conflict — no amendment needed).
5. Execute migration in three commits: `git mv` only (preserves history), then link rewrites (~900 substitutions across ~60 files), then schema commit (add `layer:` to all 111 files; flip constitution from draft to active).
6. R2 amendment recording the migration at the post-migration path.
7. Validate: `vault-ctl validate --strict && edges-check --strict && snapshot vault-corpus-v0.2-layer-stratified`.

(Lens 07 §E; lens 05 §E, §H; lens 04 A8's two-phase defense subsumed.)

---

## 3. Decisions Taken

### D-1. Adopt the narrowed top-level split, defer the recursive mirror

- **Decision.** Ship `vault/schema/` + `vault/instance/` as mandatory top-level siblings with per-type slot rules and the `layer:` frontmatter invariant. Defer the recursive Unit grammar at every depth.
- **Rationale.** All three Wave 2 evaluators converged on the same answer under different framings: lens 04 (adversarial) found the all-the-way-down grammar structurally defective (A1, A3) and in fatal conflict with `discovery-structure-constitution.md` §1 (A2); lens 05 (migration cost) measured ~3× cost asymmetry between full and partial migration for unmeasured marginal benefit and recommended option I.3 + I.2; lens 06 (long-term + cross-repo) found the binary split holds well at 1k files and leaks at 10k but the recursive mirror would be honored mostly in the breach by 12 months. Three independent attack vectors, one consensus: load-bearing wins are the top-level split + `layer:` validator; everything else is overreach.
- **Status.** Adopted as the verdict of this discovery. Implementation pending the migration cascade.

### D-2. Block cross-repo rollout pending a schema-canonicalization protocol

- **Decision.** `/domainspec` migrates alone. `/house_project`, `/maestro-trama`, `/financas_pessoais`, `/football-stats-oracle` are explicitly blocked.
- **Rationale.** Lens 06 §A established that the five vaults are not five instances of the same shape: `/financas_pessoais` has no vault (agent-organized, not graph-organized); `/football-stats-oracle` uses `raw/` not `lenses/`; `/house_project` carries a third "product-schema" layer the binary doesn't name; cross-vault constitution files are currently byte-identical and would diverge during any staggered rollout, *worsening* the drift problem lens 01 §D documented before any later coordinated effort closes it. Drift detection without a resolution rule is half a feature (lens 06 §I item 8).
- **Status.** Blocked. A separate discovery is owed for the canonicalization protocol.

### D-3. Drop the S5/Russell-dodge and Kauffman framings from the load-bearing justification

- **Decision.** The new constitution does not claim S5 stratification as its primary warrant, and the Kauffman `K = K{K K}K` analogy is not carried into the constitution body.
- **Rationale.** Lens 04 A6: the folder split is path-depth, not a typed import boundary; the actual Russell-dodge already lives in `vault_common.frontmatter`. Lens 04 A10: Kauffman's recursion is semantic (each `K` *is* a Kauffman-form), the folder grammar's recursion is syntactic (a folder *contains* sub-folders). The analogy is motivational, not derivational. Demoting both is honest and concedes nothing the proposal actually delivers.
- **Status.** Adopted. The constitution's justification rests on drift detection, onboarding, and the path-coherence invariant — empirically defensible claims — not on theoretical isomorphism.

### D-4. Decline to encode reflection-tower levels as folders

- **Decision.** No `vault/schema/schema/` or `vault/instance/level-N/` ahead of time. Level stays implicit in citation structure.
- **Rationale.** Lens 06 §C: the framework's own theory says the tower is generative, not enumerable; committing to a level count in folder names commits to a number the framework refuses to commit to. When schema-of-schema artifacts demand a home (predicted at 10k files), decide then.
- **Status.** Adopted.

---

## 4. Alternatives Considered

### A-1. Full recursive fractal (the lens 02 maximal proposal)

`Unit ::= README.md schema/ instance/ lenses/` applied at every depth, with `vault/schema/` and `vault/instance/` mirrored inside every Unit. **Rejected** because: (i) lens 04 A1 — disproportionate for thin nodes (premise files inflated to folders); (ii) lens 04 A2 — direct contradiction with `discovery-structure-constitution.md` §1; (iii) lens 04 A3 — every-slot-optional grammar degenerates to "anything goes"; (iv) lens 05 — ~3× migration cost (37 h vs 14 h expected) for marginal-and-unmeasured benefit; (v) lens 06 — at 10k files the four-slot grammar would have grown to six or seven slots or be honored mostly in the breach. The maximal proposal was the bait that produced the minimal correct answer; the discovery loop functioned correctly by killing it.

### A-2. Symlinks (`vault/schema -> vault/constitution`-style)

Adds the top-level semantic surface (a directory called `schema/`) without breaking any path. **Rejected** because schema is a union of multiple sources (constitution/, ontology-conventions.md, confidence-levels.md, ontology-architecture-draft.md, foundational-knowledges.md) — a single symlink cannot aggregate them; per-file symlinks degenerate into a parallel naming system. Cosmetic, not structurally honoring the schema/instance discipline. (Lens 05 §I.1.)

### A-3. Frontmatter-only (`layer:` field, no folder moves)

Add the validating invariant without touching paths. **Rejected as primary** because it loses the navigational stratification — a human grep'ing `vault/constitution/` still sees a mixed folder of schema-shaping and norm-only constitutions; agent retrieval still has to read frontmatter to discriminate. (Lens 02 §B rejected reading 3; lens 05 §I.2.) **Adopted as complement** to D-1: the `layer:` field is the falsification hook that catches drift mechanically.

### A-4. Encode reflection-tower levels as folders (`level-0/`, `level-1/`, …)

**Rejected** per D-4 above.

### A-5. Unified `instance/claims/` folder (premise + axiom merged)

`vault/instance/premise/foo.md` and `vault/instance/axiom/foo.md` could collapse to `vault/instance/claims/foo.md` with `node_type: premise|axiom` in frontmatter — making promotion/demotion a frontmatter edit rather than a `git mv` (which breaks inbound edges per `epistemic-chain.md` OQ-6). **Deferred to OQ-3 below**; the narrowed design inherits sibling folders by default but the choice is not argued. Pin to OQ-6 of `epistemic-chain.md` when one resolves.

---

## 5. Open Questions

### OQ-1. Sessions break the Unit shape — exempt them, or rebuild them as thin Units?

**Recommendation:** Exempt sessions explicitly in the new constitution as flat single files under `vault/instance/sessions/`. The narrowed design (C-3) already takes this position. Reopen only if session count exceeds 1k and flat layout becomes unbrowsable — at that point consider date-partitioned subfolders (`sessions/2026/05/`), not Unit promotion.

### OQ-2. The `discovery-structure-constitution.md` "no other subfolders" rule vs the proposal's recursive Unit slots — which wins?

**Resolved by narrowing.** The narrowed design does not add `schema/` or `instance/` slots inside discoveries (C-3, lens 07 §E step 4). `discovery-structure-constitution.md` §1 remains in force unchanged. If a future change wants local slots inside a discovery, that change triggers an R2 amendment to discovery-structure §1 — not the other way around. Recorded as resolved here so future readers do not reopen.

### OQ-3. Sibling `premise/` + `axiom/` vs unified `claims/` folder

**Recommendation:** Keep sibling folders for now (the path-as-stratification signal is load-bearing for human navigation and for C-1's "schema lives left, instance lives right" onboarding promise — see lens 06 §D). Revisit when `epistemic-chain.md` OQ-6 (edge-target identity under promotion) resolves: if a stable claim-id mechanism lands, unified `claims/` becomes viable; if path-rewrite passes are the chosen resolution, sibling folders are fine. Whichever OQ resolves first should pin the other.

### OQ-4. Cross-repo schema-canonicalization protocol

**Recommendation:** Dispatch a separate discovery before any cross-repo migration. Lens 06 §I item 8 names this as a precondition. Until then, D-2 holds: `/domainspec` migrates alone and the cross-vault drift problem temporarily widens before any later coordinated effort closes it. This cost is named, not paid down.

### OQ-5. Schema-of-schema folder split at 10k files

**Recommendation:** Do nothing now. Lens 06 §B predicts `vault/schema/schema/` or equivalent will demand existence at 10k files when schema-of-schema artifacts (amendments to the frontmatter constitution, governance of governance) accumulate. Revisit at the 1k-file checkpoint (D-1's deferred-item trigger) or when the first concrete schema-of-schema artifact lands, whichever comes first.

### OQ-6. The `layer:` field's relationship to `node_type`

**Recommendation:** Treat as orthogonal per the discipline of `ontology-conventions.md` §9 (Orthogonality Principle). `node_type` is the role (axiom, premise, constitution, discovery, …); `layer` is the storage stratum (schema, instance). A constitution is always `layer: schema`; a session is always `layer: instance`; a conceptual is `layer: schema` (D-1, C-4). The mapping is dense — every `node_type` value belongs to exactly one of the two `layer` values — so a future audit may show `layer` carries low marginal entropy given `node_type` and the field can be reduced to a derived check rather than a stored field. **Open**: collect 30 days of corpus data after migration, then decide whether `layer` graduates to a derived projection of `node_type` or stays as a stored cross-check.

### OQ-7. Multimedia assets and generated content (`assets/`, `generated/`)

**Recommendation:** Defer. Lens 06 §F flagged these as residues neither named nor placed by the proposal. The narrowed design carries `vault/assets/` over unchanged into `vault/instance/assets/`. Generated content does not yet exist in any vault. When the first generated-content artifact lands, dispatch a focused discovery; do not pre-build the slot.

---

## 6. Provenance and Epistemic Honesty

This discovery was produced by a single domainspec-subagents-strategy dispatch organized in two waves of lenses. Wave 1 (lenses 01–03) mapped the prior research, theorized the fractal proposal, and surveyed external knowledge-management prior art. Wave 2 (lenses 04–07) attacked the proposal adversarially, measured its migration cost, evaluated its long-term and cross-repo applicability, and synthesized the verdict. The Wave 2 verdict (lens 07) is what this discovery's Decisions Taken section codifies.

The three "deepest-thing" lenses (`deepest-thing-empirical`, `deepest-thing-historical`, `deepest-thing-structural`) are **session-level reflections** about the night's overall accomplishment, not load-bearing claims about folder structure. They speak to broader framework moves (residue clock, Kauffman precedent absorption, Lawvere/Yoneda interpretations) that contextualize but do not justify the folder decisions above. They are **speculative by epistemic register** — first-person session-end synthesis, not adversarially tested — and the folder-structure design above does not derive from them. They are catalogued in this discovery's lens folder because they were part of the same dispatch; readers should treat their veracity as session-reflective rather than evidential.

Per `ontology-conventions.md` §Applicability, discovery files omit `veracidade` and `convicção` frontmatter because a discovery holds multiple options at varying confidence; per-decision confidence belongs inline. Confidence inline: D-1 high (three independent evaluators converged); D-2 high (lens 06 §A is empirical across the five repos); D-3 medium (rhetorical move, not a measured claim); D-4 medium-high (theory says so, but no concrete schema-of-schema artifact has yet appeared to test it).

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/folder-structure-fractal/lenses/01-prior-research-catalog.md` | `derives-from` | Lens 01 mapped the prior research, the FIDC-misnaming finding, the live contradictions, and the cross-vault drift that frame this discovery's problem statement. |
| `vault/discovery/folder-structure-fractal/lenses/02-fractal-folder-theory.md` | `derives-from` | Lens 02 stated the maximal fractal proposal whose narrowing produced the adopted design; A-1 above records what was rejected. |
| `vault/discovery/folder-structure-fractal/lenses/03-external-prior-art.md` | `derives-from` | Lens 03 surveyed 13 knowledge-management systems and established that the schema/instance + recursive-Unit + constitution-as-first-class-node combination is without prior art. |
| `vault/discovery/folder-structure-fractal/lenses/04-adversarial-attack.md` | `derives-from` | Lens 04's attacks A1–A10 forced the narrowing recorded in D-1, the per-type slot rules in C-3, the conceptual-as-schema decision in C-4, and the dropping of S5/Kauffman framings in D-3. |
| `vault/discovery/folder-structure-fractal/lenses/05-migration-cost-estimate.md` | `derives-from` | Lens 05 measured the ~900 path references and ~37 h cost asymmetry that justified D-1's partial-adoption decision and produced C-6's amendment cascade. |
| `vault/discovery/folder-structure-fractal/lenses/06-long-term-cross-repo.md` | `derives-from` | Lens 06's cross-repo survey established D-2 (block cross-repo rollout) and D-4 (decline reflection-tower folder encoding), and contributed OQ-5. |
| `vault/discovery/folder-structure-fractal/lenses/07-wave-2-synthesis-and-verdict.md` | `derives-from` | Lens 07 is the synthesis verdict this discovery codifies; D-1 through D-4 are its consolidated statement. |
| `vault/constitution/discovery-structure-constitution.md` | `cites` | The narrowed design preserves §1 verbatim; OQ-2 records why no amendment is required. |
| `vault/constitution/frontmatter-ownership-constitution.md` | `cites` | C-2's `layer:` field requires amending this constitution; step 1 of the cascade in C-6. |
| `vault/constitution/schema-amendment-discipline-constitution.md` | `governed-by` | R2 governs the amendment cascade in C-6 and the eventual flip of `vault-folder-structure-constitution.md` from draft to active. |
| `vault/ontology-conventions.md` | `cites` | §8 bidirectionality rule and Appendix C edge catalog govern this discovery's `## Connections` block; §9 Orthogonality Principle informs OQ-6's `layer` vs `node_type` analysis. |
| `vault/discovery/domainspec-vault-foundations/epistemic-chain.md` | `cites` | A-4 (folder-as-classifier rejected) is the principle the narrowed design honors by keeping `layer:` as a navigational cross-check, not a classification mechanism; OQ-6 of that discovery is upstream of OQ-3 here. |
| `vault/discovery/graph-as-residue-attractor/README.md` | `cites` | The host-shape-witnesses-hosted-theorem framing motivated lens 02's maximal proposal; lens 07 §D explicitly drops this framing from the load-bearing justification, but the conceptual lineage is recorded. |
| `vault/discovery/two-layer-platform-architecture/README.md` | `cites` | The schema/instance discipline at the infrastructure level (vault_common kernel vs subsystems) is the upstream theoretical move this discovery mirrors at the folder level. |

---

## Source dispatch

- **Source findings:** the seven Wave 1+2 lenses under `vault/discovery/folder-structure-fractal/lenses/` plus the three session-level `deepest-thing-*.md` lenses, dispatched 2026-05-16 as part of the night's chained sessions (0406, 0500, 0600, 0700).
- **Dispatch type:** triangulated multi-lens domainspec-subagents-strategy dispatch (Wave 1 = parallel-fanout; Wave 2 = adversarial-audit + cost-estimate + long-term-evaluation + synthesis).
- **Promotion:** lifecycle step 7 user-gate, confirmed 2026-05-17, knowledge-scope target (vault-internal).
