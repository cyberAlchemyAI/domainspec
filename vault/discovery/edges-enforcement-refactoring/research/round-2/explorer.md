---
tags: [vault, ontology, edges, authoring, derivation, refactoring]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.2.0
last_updated: 2026-05-30
---

# Explorer (Round 2) — Edges Enforcement Refactoring

> Round-2 revision of `../round-1/explorer.md`. Two independent reviewers (`../round-1/reviewer-1.md`, `../round-1/reviewer-2.md`) returned `accept-with-revisions`; the synthesis (`../round-1/robot-talks.md`) produced a 13-item revision agenda. This round closes the load-bearing items (description-field semantics, catalog reconciliation, vocabulary fix, supersession re-typing, discovery-vs-amendment split) and adds the operational spec (§4) the synthesis demanded **before** any amendment text is drafted. Constitutional amendment text is **not** included in this round (per `discovery-structure-constitution.md` §6 and synthesis item 6).

> **Frontmatter change vs Round 1.** `node_type` was `discovery` in Round 1; corrected to `research` per `reviewer-1.md` Finding 7 and `ontology-conventions.md` Appendix B ("research = exploration produced by a single investigation … feeds into a discovery; never authoritative on its own"). The consolidated discovery is a future Round-3 / promotion-time artifact.

---

## Objective

This research artifact proposes to **invert the authoring authority** for vault edges. Today, edges live in two hand-authored places: hyperlinks in body prose AND the `## Connections` table on each endpoint. The constitution's actual binding text — `ontology-conventions.md` §8 Directionality Principle ("Edges between vault nodes must be declared on both endpoints. … Both sides are written explicitly in Markdown — there is no SQL-layer inference.") + Appendix C Authoring Rule 1 ("A `## Connections` block on the source declares the forward edge; the target document declares the inverse. … Asymmetric declarations between vault nodes are bugs.") — pins **bidirectionality** as load-bearing and makes the `## Connections` block the **declared surface**, but does **not** name body links as a forbidden second declaration surface.

The proposal flips the de-facto convention: the body-prose hyperlink — annotated with the edge type via the markdown `title` attribute (`[text](path "edge-type")`) — becomes the single source-of-truth, and `## Connections` becomes a mechanically derived projection that is never hand-edited. Links whose `title` is missing or not a recognized edge name remain prose. Migration mechanics are out of scope per Victor's instruction; what *is* in scope this round (and was not, last round) is the **operational spec** the derivation pipeline must satisfy.

---

## 1. Business Context

### Why now

The dual-surface authoring regime has accumulated visible drift. The `inverse-edge-fix` discovery (`vault/discovery/inverse-edge-fix/inverse-edge-fix.md`) catalogs ~90 vault-internal missing-inverse edges plus three high-traffic sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`) that carry no `## Connections` block at all despite being heavily linked. The `documents-metadata-enforcement` discovery names the same problem from the enforcement angle. The `domainspec-vault-edges` discovery (D-5) records `derives-from` overload as tracked debt.

The structural common cause: **the table is far enough from the prose that authors edit one and forget the other**. Every audit-then-sweep cycle recovers the symptom (rows added, inverses backfilled) without addressing the cause.

Three conditioning facts make this the right moment: (i) the body-link → edge mapping has a low-cost machine-readable carrier (the markdown `title` attribute) that no existing constitution forbids; (ii) the carve-outs in `ontology-conventions.md` §8 (skills/agents forward-only-by-target; sessions forward-only-by-source) are already path-prefix- and frontmatter-keyed, so adding a third mechanism (title-attribute presence) does not break the rule shape; (iii) `documents-metadata-enforcement` and `inverse-edge-fix` together already commit the vault to mechanical edge enforcement — the proposal here is about *which surface is mechanical*, not *whether* enforcement happens.

### What's broken

- **Drift between body and table.** Author writes prose mentioning `[discovery X](path/to/x.md)`, intends a `cites` edge, but never opens the `## Connections` block. The two surfaces disagree silently.
- **Three high-traffic sinks with no `## Connections` block** (`vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/ontology-architecture-draft.md`). The `inverse-edge-fix` discovery treats "bootstrap an empty table" as Tier 1 specifically to give those rows somewhere to land. Under this proposal, those sinks' inverse blocks are generated from whoever's body links target them; the sinks themselves need not declare anything.
- **Inverse maintenance cost** — every forward edit requires a paired inverse edit on the target, in a different file. This is the mechanic the `inverse-edge-fix` Tier 2 sweep exists to repair.
- **"Is this link an edge?" ambiguity in body prose.** Today there is no in-file marker distinguishing a typed edge (`cites`) from a passing mention. Inverting puts the burden on the prose link to declare its type — making the ambiguity locally resolvable.

### What stays the same

- **The Appendix C edge catalog.** Per `ontology-conventions.md` line 556 ("The vault has **22 forward edges**"). However, see §3 Amendment candidates and §7 OQ-10 — the constitution's own count is internally inconsistent (line 322 says "21 forward edges (40 names total counting inverses)"; manual enumeration of the three subtables yields 25 — Epistemic 15, Provenance 9, Reference 1). This proposal does **not** add, rename, remove, or recategorize edges. The discrepancy is a residue that an independent catalog-reconciliation node must clear before any consumer can claim "the catalog is preserved unchanged" with full confidence (see TD-3, OQ-10).
- **The bidirectionality rule** (`ontology-conventions.md` §8). What changes is *who authors the inverse* — derived mechanically from the forward body link rather than hand-written.
- **The two carve-outs in §8.** Skills/agents forward-only-by-target and sessions forward-only-by-source continue to hold. The derivation pipeline must respect both.
- **`contradicts` symmetry, acyclicity** (`edge-acyclicity-constitution.md`), `governs` runtime witness, and frontmatter ownership. None are touched.
- **Connection Coverage Policy.** Links without a recognized edge-type `title` remain prose, not edges. This proposal does NOT convert every markdown link into a typed edge.
- **The `## Connections` section itself remains rendered.** It is regenerated, not deleted.

---

## 2. Core Concepts

### Hyperlink-as-source-of-truth

A vault edge is declared by writing a markdown link in the body prose with the edge type as the link's `title` attribute:

```markdown
This claim derives from [the foundations discovery](../foundations/discovery.md "derives-from").
The position is corroborated in [section 3 of the prior discovery](other.md#section-3 "cites").
```

Three load-bearing pieces:

1. **The link target** is the edge's `target` field.
2. **The title attribute** (`"derives-from"`) is the edge type. The catalog of legal values is `ontology-conventions.md` Appendix C.
3. **The link's surrounding context** is the edge's description. The specific picker (sentence vs paragraph vs sibling) is decided in §3 Amendment candidate AC-4 — see §3 for the binding decision and the information-loss tradeoff it accepts.

A markdown link whose `title` is absent, empty, or not a member of the edge catalog is **not an edge** under this proposal. It is prose.

### The title-attribute mechanism

The `title` attribute is part of the CommonMark/GFM spec for inline links: `[text](url "title")`. It renders as a tooltip on hover in browsers and most preview tools, does not pollute the visible text, and is preserved by Pandoc, mdast, remark, and every Markdown AST parser that complies with CommonMark.

Cost (per `reviewer-2.md` Finding 2): the `title` attribute has been used for ~25 years as a human-readable accessibility tooltip carrier (alt text for links, "opens in new tab", citation expansions). Repurposing it for machine-readable edge types **forfeits the tooltip-as-accessibility-hint affordance** on vault prose. Measured baseline (R2 Finding 2): zero existing vault links use `title` for human-readable purposes today, so the loss is prospective, not retroactive. This is named as Amendment candidate AC-3.

Why this carrier and not an alternative:

- **Not a fenced metadata block adjacent to the link** — would require a custom parser, breaks compositionality with existing tooling.
- **Not a wikilink with type** (`[[target|derives-from]]`) — Obsidian-specific.
- **Not a custom link prefix** (`[derives-from:text](path)`) — leaks the type into the visible text.
- **Not a separate YAML block** — that is what the current `## Connections` table effectively is.

The title attribute is the only mechanism that is (a) standards-compliant, (b) invisible in rendered prose, (c) machine-readable without custom tooling, (d) already supported by every markdown editor in the toolchain — accepting the a11y trade-off in (b).

### The derivation pipeline (conceptual)

A derivation pass would:

1. Parse each vault `.md` file via a CommonMark AST.
2. For each **inline** link in the body (not in `## Connections`, not in fenced code blocks, not in frontmatter, not in `![…](…)` images, not in reference-style or shortcut links — see §4.2), inspect the `title` attribute.
3. If the title matches a catalog forward-edge name, emit a forward edge `(source=this file, type=title, target=resolved link path, description=AC-4-derived)`.
4. Per AC-7 (forward-only authoring): if the title matches a catalog *inverse* name, the linter rejects it; the pipeline does not normalize.
5. For each forward edge so emitted, apply the §8 carve-outs and edge-class rules (§4.3): skill/agent target → forward-only; session source → forward-only; `retrofits` → no inverse projection; `contradicts` → symmetric handling per §4.3; otherwise project the inverse onto the target.
6. Regenerate every vault file's `## Connections` section from the projected edge set, between `<!-- BEGIN derived -->` / `<!-- END derived -->` markers (see §4.1).

This is conceptually similar to what an auditor would do today to flag missing inverses; the difference is that it *writes* the projection rather than *complaining* about its absence.

### Why this is not "just SQL-layer inference"

The `domainspec-vault-edges` discovery A-3 rejected SQL-layer inference. The constitution's own articulation of *why* both sides must be declared is in `ontology-conventions.md` §8 ("Why both sides: **local readability**. Opening either document shows the relationship without external tooling"). The proposal **preserves local readability**: the `## Connections` block on the target is still present and still human-readable in plain Markdown — it is regenerated rather than hand-typed.

(Round 1 paraphrased A-3 as "against runtime-only computation with no Markdown materialization"; `reviewer-1.md` Finding 8 correctly flagged this as a self-serving narrowing. The accurate version is what §8 itself says: local readability. Materialization-on-write preserves it; runtime-only inference would not.)

---

## 3. Amendment candidates

**Important boundary.** Per `discovery-structure-constitution.md` §6 ("A discovery does not promote itself. It surfaces *candidates* … Constitution candidates — working principles the discovery argues for. … Actually creating those files is a separate, deliberate act"), this section lists the constitutional surfaces a downstream amendment node would need to touch. It does **not** draft the amendment text. Round 1's §3 drafted text and was correctly flagged by `reviewer-1.md` Finding 3 as a promotion-path violation. This round demotes it to candidates.

Each candidate names: (a) the constitutional surface affected, (b) the change in posture, (c) the consequence for downstream artifacts. The actual prose is a deliberate-act task for a future session.

### AC-1 — §8 Directionality Principle (`ontology-conventions.md`): posture change

- **Surface.** `ontology-conventions.md` §8, second sentence ("Both sides are written explicitly in Markdown — there is no SQL-layer inference.").
- **Posture.** Both sides remain **visible** in Markdown on both endpoints (local readability preserved); but only one side is **authored**. The other is materialized on write. The "no SQL-layer inference" clause becomes "no runtime-only inference."
- **Status.** Candidate. Not drafted here.

### AC-2 — New subsection in §8: "Typed body links — authoring rules"

- **Surface.** `ontology-conventions.md` §8, new subsection after the carve-outs.
- **Posture.** Specifies syntax (`[anchor](target "edge-type")`), scope (body prose only, inline links only), prose-vs-edge rule (untitled = prose), and the inverse-handling discipline (generated, not hand-authored).
- **Status.** Candidate. Operational details enumerated in §4 of this research; constitutional language is a deliberate-act task.

### AC-3 — Acknowledge the a11y / tooltip repurposing

- **Surface.** §8 new subsection or §8 carve-out section.
- **Posture.** State explicitly that the `title` attribute on vault prose links is repurposed from human-readable tooltip to machine-readable edge type, forfeiting the tooltip-as-accessibility-hint affordance. Measured baseline: zero existing vault links use `title` for human-readable purposes (per `reviewer-2.md` Finding 2).
- **Status.** Candidate. Required so downstream readers do not mistake this for a no-cost change.

### AC-4 — Description-field handling (binding choice — see §5 D-7)

- **Surface.** `ontology-conventions.md` §8 typed-body-link subsection AND `frontmatter-ownership-constitution.md` if option (c) is picked.
- **Posture.** The constitution must name the picked option from §5 D-7 below. This candidate exists because the choice has constitutional weight regardless of which option is picked (each is a different shape of "single-source-of-truth").
- **Status.** Candidate. The choice itself is made in §5 D-7; the constitutional articulation is a downstream deliberate act.

### AC-5 — Edge-class-specific derivation rules

- **Surface.** `ontology-conventions.md` Appendix C Authoring rules; possibly `edge-acyclicity-constitution.md` cross-ref.
- **Posture.** Make explicit what the catalog already implies but does not state operationally: `retrofits` is forward-only (no inverse projection); `contradicts` is symmetric and must be deduplicated post-derivation; `subclass-of` tree constraint must be checked post-derivation. Per `reviewer-1.md` Finding 4 — these are catalog-semantic edge cases the pipeline must encode.
- **Status.** Candidate. Operational rules in §4.3.

### AC-6 — `frontmatter-ownership-constitution.md` Rule 6 cross-reference

- **Surface.** `ontology-conventions.md` §8 new subsection.
- **Posture.** State that the derivation pipeline must consume carve-out predicates from `vault_common.frontmatter.carveouts` (per `frontmatter-ownership-constitution.md` Rule 6 — single ownership of carve-out logic), not reimplement them. Per `reviewer-1.md` Finding 9.
- **Status.** Candidate. Implementation discipline in §4.4.

### AC-7 — Forward-only authoring (D-8 below)

- **Surface.** Same as AC-2.
- **Posture.** Body links carry the catalog **forward** name only. Inverse-name titles are linter-rejected. The pipeline does not normalize inverse-name authoring. Per `reviewer-1.md` Finding 10 (catalog Authoring Rule 1 already pins forward-on-source) + `reviewer-2.md` Finding 6 (option (b) reintroduces the dual-authoring drift D-1 eliminates).
- **Status.** Candidate. The decision is in §5 D-8.

### AC-8 — Cutover ordering (`discovery-structure-constitution.md`-adjacent)

- **Surface.** No existing constitution covers this; would land in the same deliberate-act session as AC-1.
- **Posture.** State that the constitution amendment (AC-1 + AC-2) is **gated** on the migration pass having run at least once, to prevent the silent edge deletion R1 Finding 5 named (the moment the constitution amends, every existing edge whose body-link is not titled becomes prose). This is the "cutover correctness" ordering invariant.
- **Status.** Candidate. Sequencing concern; ties into migration which is itself out of scope for this round (D-6).

### AC-9 — Partial supersession of `inverse-edge-fix` Tier 2

- **Surface.** `inverse-edge-fix.md` session note + that discovery's `## Connections` block + this research artifact's eventual consolidated discovery.
- **Posture.** Per `reviewer-1.md` Finding 6 + `reviewer-2.md` Finding 7, if the proposal here is adopted, `inverse-edge-fix` Tier 2 (manual inverse backfill) is **dissolved** — the derivation pipeline materializes inverses mechanically, so no hand-sweep is needed. The relationship is `supersedes` (partial, on Tier 2 only), not `cites`.
- **Status.** Candidate. The `## Connections` row in this file is corrected at the bottom (see Connections table); the formal session note on `inverse-edge-fix` is a downstream deliberate act.

### What does NOT change in the constitution

- The Appendix C edge catalog (modulo the 21/22/25 count residue tracked in OQ-10) — same names, same directionality, same inverses.
- The two carve-outs in §8 — skills/agents forward-only-by-target, sessions forward-only-by-source.
- The `contradicts`-as-symmetric rule.
- The acyclicity constitution.
- The `governs`-runtime-witness constitution.
- The frontmatter-ownership constitution's single-owner schema (the derivation rewrites a body section, not frontmatter).
- The discovery-structure constitution's §3 required body sections.

---

## 4. Operational spec

This is the section `robot-talks.md` demanded before any amendment text is drafted: a concrete IO contract for the derivation tool, edge-class handling, and inverse-write discipline. It is still a *specification*, not an implementation — no tool exists (TD-2), and no commitment is made here that this exact spec is the one that ships. But it is concrete enough that Round-3 reviewers can attack it for plausibility rather than for vapor.

### 4.1 IO contract of the derivation tool

**Inputs:**
- All `.md` files under `vault/` (the corpus root).
- The Appendix C edge catalog (parsed from `ontology-conventions.md`, or — once OQ-10 is closed — a derived enumeration node).
- The carve-out predicates loaded from `vault_common.frontmatter.carveouts` (per `frontmatter-ownership-constitution.md` Rule 6, see §4.4).

**Outputs:**
- For each vault `.md` file: the file is rewritten so that the content between `<!-- BEGIN derived -->` and `<!-- END derived -->` markers (placed inside the `## Connections` section) reflects the current projected edge set for that file. **Nothing outside those markers is touched.**
- A `vault/.edges/derive-report.jsonl` (path is a proposal, not a commitment) with one line per warning: dangling targets, non-catalog title strings, deduped-link merges, and post-derivation invariant violations (e.g., `subclass-of` non-tree).

**Idempotency.** Running the tool twice on an unchanged corpus must produce zero file changes. This is the load-bearing property that makes "on-write" and "on-build" both viable — see §4.5.

**Failure modes:**
- Dangling target → warning, edge materialized with `[dangling]` suffix in the Type column (per `reviewer-2.md` Finding 8). Not an error.
- Title not in catalog → warning ("possible typo of `derives-from`?" for near-misses), edge **not** materialized — the link is treated as prose.
- Title in inverse-name position (e.g., `"derives"` instead of `"derives-from"`) → **error**, build fails. Authors must rewrite the link as a forward from the other endpoint (AC-7 / D-8).
- Post-derivation invariant violation (e.g., `subclass-of` cycle, `contradicts` triangle that would imply `A contradicts A`) → **error**.

**Scope of what is NOT in the contract:**
- Migration of the existing 852 edge rows is out of scope (D-6); the tool may have a one-shot `--migrate` mode but its design is deferred to a separate implementation-plan node.
- Cross-repo edges (`_backlog.md` parking) are out of scope (TD-5 carries over).
- Frontmatter is not touched; only the body region between the derived-markers.

### 4.2 Syntax constraint — inline links only

Per `reviewer-2.md` Finding 3 and Edge Case Catalog, only **inline** `[text](url "type")` is a candidate edge declaration. All of the following are **prose** (or out-of-scope) regardless of any title:

- **Image links** `![alt](path "type")` — images are not edges. Hard skip.
- **Reference-style links** `[text][label]` + `[label]: url "title"` — the title lives on the definition, not the use site; ambiguous. Forbidden as edge form. (Vault has zero hits today per R2.)
- **Shortcut reference links** `[label]` alone — same forbidding.
- **Autolinks** `<https://example.com>` — no title syntax exists; out-of-scope by construction.
- **Links inside fenced code blocks** `` `[x](y "z")` `` or `` ```...``` `` — code is not authoring surface. Hard skip.
- **Links inside frontmatter YAML** — out of scope; frontmatter is the frontmatter-ownership constitution's territory.
- **Links inside `## Connections` block markers** — ignored by the extractor (the block is overwritten on regeneration).

In-scope but worth documenting:
- **Links inside blockquotes** — treated as body prose (current convention).
- **Links inside tables outside `## Connections`** (e.g., comparison tables in body) — treated as body prose; titles count.
- **Anchor-bearing targets** `[text](path#anchor "type")` — target field is `path`; the anchor is preserved in the description (AC-4 dependent).
- **Path normalization** — vault-root-relative is the canonical form; `../other.md`, `/abs/path/other.md` are normalized before edge emission.

### 4.3 Edge-class handling

The catalog has structural special cases the pipeline must know. Per `reviewer-1.md` Finding 4 (AC-5):

**Forward-only edges (no inverse projection):**
- `retrofits` — Appendix C explicitly states "intentionally lacks an inverse." The pipeline emits the forward edge; the target receives no row.

**Symmetric edges:**
- `contradicts` — Appendix C names it the only symmetric edge ("both sides use the same name"). The pipeline rule: **declared on either side is sufficient; the projection materializes the symmetric position on the other side; duplicate declarations (both sides author `"contradicts"` toward each other) are deduplicated post-derivation to a single canonical pair.** Either authoring shape is legal; the rendered output is canonical.

**Tree-constrained edges:**
- `subclass-of` — Appendix C: "Tree, not DAG — multiple inheritance forbidden." The pipeline runs a post-derivation invariant check: every node has at most one outbound `subclass-of` edge. Violations are build errors.

**Forward-only-by-target carve-out (existing §8):**
- Targets matching `.claude/skills/**` or `.claude/agents/**` → no inverse projection. The forward edge is materialized on the source; the target file is not touched (skill/agent files have no `## Connections` block).

**Forward-only-by-source carve-out (existing §8):**
- Sources with `is_session: true` in frontmatter → no inverse projection. The forward edge is materialized on the source's `## Connections` block; the target file is not touched by the session edge.

**Acyclicity:**
- Per `edge-acyclicity-constitution.md`, the set of acyclic edge types is unchanged. The pipeline feeds the existing `vault-ctl cycles check` (or its equivalent) the same edge graph it sees today.

**Multi-edge same-pair, same-type (dedup rule):**
- Per `reviewer-2.md` Finding 5: if the same source has N typed body links to the same target with the same type (e.g., three `"cites"` to `other.md` in different paragraphs), the derived `## Connections` block contains **one** row. The description is the AC-4-derived value from the **first occurrence** in document order (simplest rule, accepts the information loss as the cost of dedup determinism). Alternative rules (union, count-prefix) are noted as future tracked debt (TD-7).

**Multi-edge same-pair, different types:**
- Per `reviewer-2.md` Finding 5 + Round-1 OQ-4: if the same source has a `"cites"` link AND a `"validates"` link to the same target, the derived block contains **two** rows. One body link per type.

### 4.4 Inverse-write discipline

The pipeline writes both endpoints. Per `reviewer-2.md` Finding 4, this creates a multi-file write footprint with merge-conflict implications. The discipline:

**Marker discipline.** The derivation only writes the content between `<!-- BEGIN derived -->` and `<!-- END derived -->`. Authors may write prose, frontmatter, sub-sections — anything — outside those markers in the `## Connections` section, and the tool will not touch it. If the markers are absent on a file that becomes a target of some forward edge, the tool inserts them at the conventional `## Connections` location (end of file, before any final reference section).

**Carve-out predicate sourcing.** Per `reviewer-1.md` Finding 9 + AC-6: the pipeline calls into `vault_common.frontmatter.carveouts` for the boolean "should this edge project an inverse?" predicate. It does not fork the carve-out logic. If `frontmatter-ownership-constitution.md` Rule 6 evolves (e.g., a new path-prefix carve-out is added), the pipeline inherits the change for free.

**Write atomicity per source-file edit.** A single body-link edit on file `A` may cause writes to file `A` (regenerated source-side block) AND to file `B` (regenerated target-side block, with new inverse row). Both must succeed or both must fail. Implementation must wrap in a transactional rename-temp-then-atomic-move pattern, or equivalent.

### 4.5 On-write vs on-build (binding decision: on-build for v1)

Per `reviewer-2.md` Finding 4: two viable shapes.

- **On-write** — a pre-commit hook or editor-side daemon regenerates affected files on every save / commit. Pro: corpus is always coherent. Con: heavy IO per edit; merge-conflict footprint on high-traffic sinks.
- **On-build** — a one-shot `vault-ctl edges derive` invoked in CI and on demand. Working tree is allowed to drift between runs. Pro: simple, no editor coupling. Con: human reviewers may see stale `## Connections` blocks until CI runs.

**Decision for v1 (D-9 in §5): on-build, with a Round-3 / implementation-time revisit.** Rationale: the on-write footprint (every body-link edit potentially rewriting 5–10 files including sinks neither author touched) is exactly the merge-conflict surface that today's audit-then-sweep cycle exists to surface. On-build matches the existing operational rhythm; if the staleness window proves painful, an on-write pre-commit hook can be added later without re-amending the constitution.

This decision is reversible without constitutional change — the constitution names *what* derivation does, not *when* it runs.

---

## 5. Decision Summary

The research artifact commits to the following decisions (subject to Round-3 reviewer attack):

- **D-1 — Adopt typed body links as the single authored surface for edges.** The hyperlink in body prose, annotated with the edge type via the markdown `title` attribute, is the source-of-truth.
- **D-2 — Demote `## Connections` to derived output.** The section remains rendered on every vault node; it is regenerated mechanically between `<!-- BEGIN derived -->` / `<!-- END derived -->` markers and is never hand-edited.
- **D-3 — Preserve the Appendix C edge catalog and the two §8 carve-outs unchanged in name and directionality.** No edge names are added, removed, or renamed by this proposal. The catalog-count residue (21/22/25) is a constitutional inconsistency that must be cleared independently (OQ-10), not by this proposal.
- **D-4 — Untyped links remain prose.** A markdown link with no recognized `title` is not an edge. The proposal does not require authors to type every link — only those they mean as edges.
- **D-5 — Inverse visibility is preserved through regeneration.** Bidirectional Markdown remains a property of the corpus; only the labor model changes.
- **D-6 — Migration is out of scope.** Downstream questions about converting the existing 852 edge rows into typed body links are tracked debt for a separate implementation-plan node. **Refinement vs Round 1:** description-field design is now IN scope for this research (D-7); migration mechanics still are not.
- **D-7 — Description-field semantics: option (a) — accept information loss.** The edge's description is the **enclosing sentence** of the body link (the simplest AC-4 option). This commits the proposal to a measured **~40% information loss** on existing edge rows (per `reviewer-2.md` Finding 1: 407 of 1027 measured descriptions exceed 120 chars and would not survive being yanked from "the enclosing sentence"). The information loss is real and is the cost of single-source-of-truth.
  - **Why not option (b) — `description="…"` attribute?** Sacrifices CommonMark portability, which is the load-bearing property §2 leans on. Adding a non-CommonMark attribute means the proposal would need its own parser; that re-introduces the toolchain cost the title-attribute carrier was chosen to avoid.
  - **Why not option (c) — separate authored surface (HTML comment, sibling YAML, `connection_notes:` frontmatter list)?** Honest but weakens the headline claim: the proposal becomes "single-source-of-truth for the edge declaration, not the description." That is a defensible position, and it is bounded as **future debt** (TD-6) — if Round-3 reviewers or migration work demonstrates the 40% information loss is unsurvivable, the fallback is to add a `connection_notes:` frontmatter list keyed by `(target, type)` and split the surface. The cost of switching from (a) to (c) is bounded: the constitution amendment grows by one subsection; no body-link rewrites required.
  - **What this honest pick costs.** ~40% of existing edge rows whose descriptions are self-contained second-clause rationales (e.g., the sample row in `reviewer-2.md` Finding 1) will be **truncated** at the migration boundary. Migration tooling (out of scope per D-6) must surface these as warnings so authors can choose: rewrite the body prose to absorb the description, or accept the loss. Both are explicitly permitted.
- **D-8 — Forward-only authoring.** Body links carry the catalog **forward** name only. Inverse-name titles (e.g., `"derives"` for `derives-from`) are linter-rejected. The pipeline does not normalize. Per `reviewer-1.md` Finding 10 + `reviewer-2.md` Finding 6 + `ontology-conventions.md` Appendix C Authoring Rule 1 (which already pins forward-on-source). This closes Round-1 OQ-1.
- **D-9 — Derivation runs on-build for v1.** Reversible without constitutional change; see §4.5.
- **D-10 — This research partially supersedes `inverse-edge-fix` Tier 2.** The hand-authoring discipline that Tier 2 codifies is dissolved by mechanical derivation. The `## Connections` row toward `inverse-edge-fix` is re-typed below from `cites` to **`supersedes`** (partial — Tier 1 sink bootstrapping is still required if the migration starts before the derivation tool exists; Tier 3 is independent). A session note on `inverse-edge-fix` recording the partial supersession is a downstream deliberate act per AC-9. Per `reviewer-1.md` Finding 6 + `reviewer-2.md` Finding 7. This closes Round-1 OQ-6 (epistemic relationship branch); OQ-6's operational-sequencing branch becomes OQ-11.

---

## 6. Tracked Debt

- **TD-1 — Migration path is undesigned.** Converting the existing 852 edge rows into typed body links requires either (a) deriving body-link positions from existing table rows (likely produces ugly link placement), or (b) one-time bulk regeneration of the table from typed body links once those exist (chicken-and-egg). Out of scope per D-6.
- **TD-2 — Tooling does not exist.** The §4 operational spec is conceptual. No `vault-ctl edges derive` exists. The proposal assumes such tooling can be built; §4 specifies what it must do, not how.
- **TD-3 — Catalog-count residue.** `ontology-conventions.md` line 556 says "22 forward edges"; line 322 says "21 forward edges"; manual enumeration of the three Appendix C subtables yields 25 (Epistemic 15 + Provenance 9 + Reference 1). Three sources disagree on the count of the invariant this proposal claims to preserve. A separate catalog-reconciliation node must clear this residue. Tracked as OQ-10 because the resolution path is not obvious — it may require demoting Round-1's "21" / amending line 322, or it may surface a real ambiguity in what "forward edge" means in the constitution.
- **TD-4 — `derives-from` overload is not addressed by this proposal.** The `domainspec-vault-edges` D-5 tracked-debt entry survives unchanged. Moving the edge authoring from table to body link does not disambiguate the four conflated semantics. Orthogonal.
- **TD-5 — Cross-repo and dangling targets.** Dangling-target behavior is now specified in §4.1 (warning + `[dangling]` marker). Cross-repo edges (`_backlog.md` parking) are still out of scope.
- **TD-6 — Description-field fallback to option (c) is a bounded escape hatch.** Per D-7. If the 40% information loss proves unsurvivable in practice, the migration to a `connection_notes:` frontmatter list (option c) is a one-amendment cost: the constitution adds a subsection, the derivation tool reads two surfaces, no body-link rewrites required. Tracked as debt rather than ruled out.
- **TD-7 — Description-merge rule for multi-edge same-pair same-type is "first occurrence".** Per §4.3. Alternatives (union of enclosing sentences, count-prefixed marker) are not picked. If the first-occurrence rule produces empirically poor descriptions on migrated rows, the alternatives are tracked here.
- **TD-8 — Editor-preview ergonomics for `title`-as-edge-type.** Some markdown editors render `title` as tooltips; some do not. Authors editing in a previewer that doesn't show titles will have no visual signal that a link is typed. Workflow concern, not correctness; downstream tooling-decision.
- **TD-9 — The Round-1 author has not measured how many existing prose links would retroactively qualify as edges if titled.** A measurement pass (count links with valid-target paths and inspect for semantic catalog-edge correspondence) would inform migration sizing. Round 2 does not commit to a number; flagged for migration design.

---

## 7. Open Questions

Things this research does NOT decide. Each is a candidate for Round-3 resolution or for promotion to a sibling discovery / amendment-session.

- **OQ-2 — `contradicts` symmetry under typed body links: dedup canonical form.** §4.3 commits to "deduplicated post-derivation to a single canonical pair." But what *is* the canonical pair — alphabetical source order? Author-order? File-mtime order? The dedup rule is named; the canonical-form rule is open. Low-stakes (cosmetic); flagging so Round-3 picks.
- **OQ-5 — Links inside the `## Connections` block — overwritten behavior is named, migration trap remains.** §4.2 says the extractor ignores links inside `## Connections`. But migration (out of scope per D-6) must move existing in-table links to body prose **before** first regeneration, else the first `vault-ctl edges derive` run is a data-loss event. Per `reviewer-2.md` Finding 9. Flagged here so the migration plan doesn't forget.
- **OQ-7 — Interaction with `documents-metadata-enforcement`.** That discovery enforces frontmatter; this research proposes a body-section authoring rule change. The metadata-enforcement curator pipeline may be the natural host for the derivation pipeline here. Round-3 / amendment time should verify no duplication or contradiction.
- **OQ-8 — Rejected alternative `Scope` column** (`domainspec-vault-edges` A-4) — confirmed not re-introduced. The carve-outs are encoded in the derivation logic via `vault_common.frontmatter.carveouts` (AC-6), not in table columns. Round-2 confirms; closed if Round-3 agrees.
- **OQ-9 — Sequencing footgun.** If the constitution is amended (AC-1) but no `vault-ctl edges derive` exists, every vault file's `## Connections` block becomes stale on the first body-link edit. AC-8 names the gating rule (amendment is gated on at least one migration-pass run); this OQ tracks the question of who enforces the gate. The discovery-structure constitution does not currently police such gates.
- **OQ-10 — Catalog-count reconciliation.** The 21 / 22 / 25 residue (TD-3). Until cleared, the claim "the catalog is preserved unchanged" (D-3) is unevaluable in the strict sense. Resolution requires either an amendment to `ontology-conventions.md` (fix the inline count claims to match the table enumeration) or a deeper re-counting that exposes whether some edges in the tables are deprecated-and-not-removed. **Not this proposal's job to fix**, but a downstream blocker for any consumer that needs the catalog as a load-bearing artifact.
- **OQ-11 — Sequencing between this research and `inverse-edge-fix`'s in-flight Tier 1.** D-10 declares this research **partially supersedes** Tier 2. But `inverse-edge-fix` Tier 1 (bootstrapping `## Connections` blocks on the three high-traffic sinks) may still be useful as a stepping-stone if the derivation tool does not exist when the constitutional amendment lands (AC-8 sequencing). Open: does Tier 1 still run, or does the derivation tool's first migration-pass run subsume it? Per `reviewer-2.md` Finding 7.
- **OQ-12 — A11y / tooltip regression mitigation.** AC-3 names the regression. Open: is there a graceful path for vault prose to retain accessibility-tooltip-style hints for *non-edge* links (where the title is informational, not a catalog name)? One sketch: linter warns on titles that are neither catalog names nor a small allow-list of a11y conventions ("opens in new tab"). Per `reviewer-2.md` Finding 2 and Edge Case Catalog row 4 ("legacy a11y title").

(Round-1 OQ-1, OQ-3, OQ-4, OQ-6 are closed: OQ-1 → D-8, OQ-3 → D-7, OQ-4 → §4.3 multi-type rule, OQ-6 epistemic branch → D-10 / sequencing branch → OQ-11.)

---

## Connections

> **Authoring note.** Per the proposal's own logic, this section should ideally be derived from typed body links in §1–§7. Since the derivation pipeline does not exist (TD-2) and migration is out of scope (D-6), this round hand-authors the table in the legacy form. Consistent with what the proposal labels "transitional debt" — the research itself eats the dual-surface cost it proposes to eliminate. Round 1's table used `proposes-edit` toward `ontology-conventions.md`; `proposes-edit` does **not** appear in Appendix C's catalog (it appears only as an *example* in §8 prose, line 297 and line 303, and the discrepancy itself is part of the catalog residue tracked in OQ-10). Re-typed below to a catalog-conformant edge.

| Document | Type | Description |
|----------|------|-------------|
| [../../../../ontology-conventions.md](../../../../ontology-conventions.md) | `refines` | This research argues for a refinement of §8 Directionality Principle and a new "Typed body links — authoring rules" subsection (AC-1, AC-2). `refines` per Appendix C: "A makes B more specific without replacing it. Distinct from `supersedes` (replacement)." The constitution is not replaced; the typed-body-link discipline is a more specific articulation of how bidirectionality is materialized. Inverse `refined-by` to be added at promotion. |
| [../../../../discovery/domainspec-vault-edges/discovery.md](../../../../discovery/domainspec-vault-edges/discovery.md) | `cites` | The Appendix C edge catalog adopted by D-1 of that discovery is preserved (modulo the 21/22/25 count residue tracked in OQ-10). The `derives-from` overload (D-5 tracked debt) is acknowledged as orthogonal (TD-4). The A-3 rejection of SQL-layer inference is addressed in §2 via the local-readability framing the constitution itself uses (`ontology-conventions.md` §8 "Why both sides: local readability"). The A-4 rejection of the `Scope` column is confirmed not re-introduced (OQ-8). Inverse `cited-by` to be added at promotion. |
| [../../../../discovery/inverse-edge-fix/inverse-edge-fix.md](../../../../discovery/inverse-edge-fix/inverse-edge-fix.md) | `supersedes` | **Partial supersession** (D-10, AC-9). The Tier 2 hand-authoring sweep that `inverse-edge-fix` codifies is dissolved by the mechanical derivation this research proposes. Tier 1 (sink bootstrapping) sequencing remains open (OQ-11). Tier 3 (catalog amendment) is independent. Per `reviewer-1.md` Finding 6 + `reviewer-2.md` Finding 7. Inverse `superseded-by` to be added on `inverse-edge-fix` at promotion, alongside a session note recording the partial supersession. |
| [../../../../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md](../../../../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md) | `cites` | Adjacent enforcement discovery; OQ-7 names the question of whether the derivation pipeline proposed here can share a host with the metadata pipeline proposed there. Inverse `cited-by` to be added at promotion. |
| [../../../../constitution/edge-acyclicity-constitution.md](../../../../constitution/edge-acyclicity-constitution.md) | `cites` | Acyclicity is preserved unchanged by this proposal; the derivation pipeline must continue to feed `vault-ctl cycles check` the same edge graph it sees today (§4.3). Inverse `cited-by` to be added at promotion. |
| [../../../../constitution/frontmatter-ownership-constitution.md](../../../../constitution/frontmatter-ownership-constitution.md) | `cites` | The derivation does NOT extend frontmatter; it rewrites a body section. Per `reviewer-1.md` Finding 9 + AC-6, the pipeline consumes carve-out predicates from `vault_common.frontmatter.carveouts` (Rule 6) rather than reimplementing them, preserving single ownership. Inverse `cited-by` to be added at promotion. |
| [../../../../constitution/discovery-structure-constitution.md](../../../../constitution/discovery-structure-constitution.md) | `governed-by` | This research's shape (frontmatter, structure, the discovery → constitution promotion-path discipline that motivates §3 being "candidates" not "drafts") follows the discovery-structure constitution. Per §6: "A discovery does not promote itself … Actually creating those files is a separate, deliberate act." Inverse `governs` to be added at promotion. |
| [../round-1/explorer.md](../round-1/explorer.md) | `supersedes` | This Round-2 artifact supersedes Round 1 in the same research dispatch. Round 1's §3 drafted constitutional text (correctly flagged by `reviewer-1.md` Finding 3); this round demotes to amendment candidates (§3) and adds the operational spec (§4) the synthesis demanded. Closes Round-1 OQ-1 (→ D-8), OQ-3 (→ D-7), OQ-4 (→ §4.3), OQ-6 epistemic branch (→ D-10). |
| [../round-1/reviewer-1.md](../round-1/reviewer-1.md) | `cites` | Constitutional-coherence review whose Findings 1, 2, 3, 4, 6, 7, 8, 9, 10 are addressed in §Objective, §1, §3, §4, §5, §Connections, and the frontmatter change. |
| [../round-1/reviewer-2.md](../round-1/reviewer-2.md) | `cites` | Operational-viability review whose Findings 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 are addressed in §2 cost paragraph, §4 operational spec, and §5 decisions D-7, D-8, D-9. |
| [../round-1/robot-talks.md](../round-1/robot-talks.md) | `cites` | Round-1 synthesis whose 13-item prioritized revision agenda this artifact addresses (see return summary). |
