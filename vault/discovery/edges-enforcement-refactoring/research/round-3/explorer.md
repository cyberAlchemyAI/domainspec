---
tags: [vault, ontology, edges, authoring, derivation, refactoring]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.3.0
last_updated: 2026-05-30
---

# Explorer (Round 3) — Edges Enforcement Refactoring

> Round-3 revision of `../round-2/explorer.md`. Two independent Round-2 reviewers (`../round-2/reviewer-1.md`, `../round-2/reviewer-2.md`) returned `accept-with-revisions`; the synthesis (`../round-2/robot-talks.md`) issued two non-negotiable structural demotions (§4 spec → sketch; OQ-10 → blocking dependency) plus a 10-item prioritized revision agenda. This round executes both demotions, fixes the three catalog-shape violations the Round-2 `## Connections` table introduced, composes the `contradicts` fix (new AC-10 + dedup mechanism), and adds a new §8 "Reframings" surfacing the 3 dead metaphors that persisted from Round 1 (one of which — catalog-as-fixed-invariant — has become load-bearing) and a §9 "Blocking dependencies" naming catalog-reconciliation as the precondition for promotion. Constitutional amendment text remains **out of scope** per `discovery-structure-constitution.md` §6.

> **Frontmatter unchanged from Round 2.** `node_type: research` (per `../round-2/reviewer-1.md` F7 closure + `ontology-conventions.md` Appendix B). The consolidated discovery is a future promotion-time artifact, and now (per §9) one that cannot promote until a sibling catalog-reconciliation node closes.

---

## Objective

This research artifact proposes to **invert the authoring authority** for vault edges. Today, edges live in two hand-authored places: hyperlinks in body prose AND the `## Connections` table on each endpoint. The constitution's actual binding text — `ontology-conventions.md` §8 Directionality Principle ("Edges between vault nodes must be declared on both endpoints. … Both sides are written explicitly in Markdown — there is no SQL-layer inference.") + Appendix C Authoring Rule 1 ("A `## Connections` block on the source declares the forward edge; the target document declares the inverse. … Asymmetric declarations between vault nodes are bugs.") — pins **bidirectionality** as load-bearing and makes the `## Connections` block the **declared surface**, but does **not** name body links as a forbidden second declaration surface.

The proposal flips the de-facto convention: the body-prose hyperlink — annotated with the edge type via the markdown `title` attribute (`[text](path "edge-type")`) — becomes the single source-of-truth, and `## Connections` becomes a mechanically derived projection that is never hand-edited. Links whose `title` is missing or not a recognized edge name remain prose. Migration mechanics are out of scope per Victor's instruction; what *is* in scope this round is the **operational sketch** (§4, demoted from "spec" per Round-2 robot-talks) the eventual derivation pipeline must satisfy, with explicit honesty that no prototype contact has yet occurred.

---

## 1. Business Context

### Why now

The dual-surface authoring regime has accumulated visible drift. The `inverse-edge-fix` discovery (`vault/discovery/inverse-edge-fix/inverse-edge-fix.md`) catalogs ~90 vault-internal missing-inverse edges plus three high-traffic sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`) that carry no `## Connections` block at all despite being heavily linked. The `documents-metadata-enforcement` discovery names the same problem from the enforcement angle. The `domainspec-vault-edges` discovery (D-5) records `derives-from` overload as tracked debt.

The proximate structural cause: **the table is far enough from the prose that authors edit one and forget the other.** But the deeper cause — surfaced explicitly in §8 Reframing R-2 — is *authoring rate*: every audit-then-sweep cycle recovers the symptom (rows added, inverses backfilled) without changing the rate at which edges are *born* into a coherent state. Inverting authority moves the symptom; it does not on its own change the rate. This proposal acknowledges that limit; see R-2.

Three conditioning facts make this the right moment: (i) the body-link → edge mapping has a low-cost machine-readable carrier (the markdown `title` attribute) that no existing constitution forbids; (ii) the carve-outs in `ontology-conventions.md` §8 (skills/agents forward-only-by-target; sessions forward-only-by-source) are already path-prefix- and frontmatter-keyed, so adding a third mechanism (title-attribute presence) does not break the rule shape; (iii) `documents-metadata-enforcement` and `inverse-edge-fix` together already commit the vault to mechanical edge enforcement — the proposal here is about *which surface is mechanical*, not *whether* enforcement happens.

### What's broken

- **Drift between body and table.** Author writes prose mentioning `[discovery X](path/to/x.md)`, intends a `cites` edge, but never opens the `## Connections` block. The two surfaces disagree silently.
- **Three high-traffic sinks with no `## Connections` block** (`vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/ontology-architecture-draft.md`). Under this proposal, those sinks' inverse blocks are generated from whoever's body links target them; the sinks themselves need not declare anything.
- **Inverse maintenance cost** — every forward edit requires a paired inverse edit on the target, in a different file.
- **"Is this link an edge?" ambiguity in body prose.** Today there is no in-file marker distinguishing a typed edge (`cites`) from a passing mention. Inverting puts the burden on the prose link to declare its type — making the ambiguity locally resolvable.
- **Off-catalog edge names already in active use.** Per `../round-2/reviewer-2.md` NF-5: `proposes-edit` lives in 12 uses across 6 files (including `ontology-conventions.md` §8 prose); `blocked-by` lives in `inverse-edge-fix.md`. These are not Appendix C catalog names. The proposal cannot ship without addressing what the first derivation pass would do to them — see AC-N (§3) and §9.

### What stays the same

- **The Appendix C edge catalog** (modulo the 21/22/25 count residue tracked in OQ-10 and now promoted to §9 blocking dependency). This proposal does not add, rename, remove, or recategorize edges. **D-3 wording is demoted in §5** to reflect that "preserved unchanged" is unevaluable until OQ-10 closes (per `../round-2/reviewer-1.md` N-5 + `../round-2/reviewer-2.md` Regression-1).
- **The bidirectionality rule** (`ontology-conventions.md` §8). What changes is *who authors the inverse* — derived mechanically from the forward body link rather than hand-written.
- **The two carve-outs in §8.** Skills/agents forward-only-by-target and sessions forward-only-by-source continue to hold.
- **`contradicts` symmetry, acyclicity** (`edge-acyclicity-constitution.md`), `governs` runtime witness, and frontmatter ownership are touched as follows: `contradicts` *authoring posture* changes (AC-10, new this round); the symmetry property itself does not. Acyclicity, `governs`, and frontmatter ownership are untouched.
- **Connection Coverage Policy.** Links without a recognized edge-type `title` remain prose. This proposal does NOT convert every markdown link into a typed edge.
- **The `## Connections` section itself remains rendered.** Regenerated, not deleted.

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
2. **The title attribute** (`"derives-from"`) is the edge type. The catalog of legal values is `ontology-conventions.md` Appendix C — subject to §9 blocking dependency.
3. **The link's surrounding context** is the edge's description. The picker is decided in §5 D-7 (enclosing sentence, with a tie-breaker for the ~33 link sites that have no enclosing sentence — added this round per `../round-2/reviewer-2.md` NF-2).

A markdown link whose `title` is absent, empty, or not a member of the edge catalog is **not an edge** under this proposal. It is prose.

### The title-attribute mechanism

The `title` attribute is part of the CommonMark/GFM spec for inline links: `[text](url "title")`. It renders as a tooltip on hover, does not pollute the visible text, and is preserved by Pandoc, mdast, remark, and every CommonMark-compliant AST parser.

Cost (per `../round-2/reviewer-2.md` Finding 2 / AC-3): repurposing `title` from human-readable accessibility tooltip to machine-readable edge type **forfeits the tooltip-as-accessibility-hint affordance** on vault prose. Measured baseline: zero existing vault links use `title` for human-readable purposes today, so the loss is prospective, not retroactive.

Why this carrier and not an alternative (unchanged from Round 2; see `../round-2/explorer.md` §2 for the rejected alternatives — fenced metadata block, wikilink-with-type, custom link prefix, separate YAML block — each fails on standards-compliance, invisibility, machine-readability, or toolchain support).

### The derivation pipeline (conceptual, NOT YET PROTOTYPED)

A derivation pass would:

1. Parse each vault `.md` file via a CommonMark AST.
2. For each **inline** link in the body (not in `## Connections`, not in fenced code blocks, not in frontmatter, not in images, not in reference-style or shortcut links — see §4.2), inspect the `title` attribute.
3. If the title matches a catalog forward-edge name, emit a forward edge.
4. Per D-8 (forward-only authoring): if the title matches a catalog *inverse* name, the linter rejects it.
5. For each forward edge so emitted, apply the §8 carve-outs and edge-class rules (§4.3): skill/agent target → forward-only; session source → forward-only; `retrofits` → no inverse projection; `contradicts` → see AC-10 + §4.3 mechanism specification; otherwise project the inverse onto the target.
6. Regenerate every vault file's `## Connections` section from the projected edge set. The marker convention used to bound the regenerated region is itself an open question this round (see §4.1 and the §4 opening honesty admission); Round-2 named `<!-- BEGIN derived --> / <!-- END derived -->` but `../round-2/reviewer-2.md` NF-1 measured **zero pre-existing use** in the vault, so the convention is invented, not borrowed.

### Why this is not "just SQL-layer inference"

Same argument as Round 2: the constitution's articulation of *why* both sides must be declared is in `ontology-conventions.md` §8 ("Why both sides: **local readability**"). The proposal preserves local readability: the `## Connections` block on the target remains present and human-readable in plain Markdown — regenerated rather than hand-typed.

---

## 3. Amendment candidates

**Important boundary.** Per `discovery-structure-constitution.md` §6 ("A discovery does not promote itself. It surfaces *candidates* … Actually creating those files is a separate, deliberate act"), this section lists the constitutional surfaces a downstream amendment node would need to touch. **It does not draft the amendment text.**

AC-1 through AC-9 carry over from Round 2; AC-10 (contradicts posture change) is new this round per `../round-2/reviewer-1.md` N-4 + `../round-2/reviewer-2.md` NF-3 + Round-2 robot-talks SY-2; AC-N is new this round to address `../round-2/reviewer-2.md` NF-5.

### AC-1 — §8 Directionality Principle (`ontology-conventions.md`): posture change

- **Surface.** `ontology-conventions.md` §8, second sentence.
- **Posture.** Both sides remain **visible** in Markdown on both endpoints (local readability preserved); only one side is **authored**. The other is materialized on write. The "no SQL-layer inference" clause becomes "no runtime-only inference."
- **Status.** Candidate. Not drafted here.

### AC-2 — New subsection in §8: "Typed body links — authoring rules"

- **Surface.** `ontology-conventions.md` §8, new subsection after the carve-outs.
- **Posture.** Specifies syntax (`[anchor](target "edge-type")`), scope (body prose only, inline links only), prose-vs-edge rule (untitled = prose), inverse-handling discipline (generated, not hand-authored).
- **Status.** Candidate.

### AC-3 — Acknowledge the a11y / tooltip repurposing

- **Surface.** §8 new subsection or §8 carve-out section.
- **Posture.** State explicitly that the `title` attribute on vault prose links is repurposed from human-readable tooltip to machine-readable edge type. Measured baseline: zero existing vault links use `title` for human-readable purposes.
- **Status.** Candidate.

### AC-4 — Description-field handling (binding choice — see §5 D-7)

- **Surface.** `ontology-conventions.md` §8 typed-body-link subsection.
- **Posture.** The constitution must name the picked option from §5 D-7 (option (a) — enclosing sentence with NF-2 tie-breaker).
- **Status.** Candidate.

### AC-5 — Edge-class-specific derivation rules

- **Surface.** `ontology-conventions.md` Appendix C Authoring rules.
- **Posture.** Make explicit: `retrofits` is forward-only; `subclass-of` tree constraint must be checked post-derivation. **Note:** `contradicts`-specific handling has been promoted to its own AC-10 (this round) because the change is constitutional, not merely operational.
- **Status.** Candidate.

### AC-6 — `frontmatter-ownership-constitution.md` Rule 6 cross-reference

- **Surface.** `ontology-conventions.md` §8 new subsection.
- **Posture.** Derivation pipeline consumes carve-out predicates from `vault_common.frontmatter.carveouts` (Rule 6 — single ownership), not reimplemented.
- **Status.** Candidate.

### AC-7 — Forward-only authoring (D-8)

- **Surface.** Same as AC-2.
- **Posture.** Body links carry the catalog **forward** name only. Inverse-name titles linter-rejected.
- **Status.** Candidate.

### AC-8 — Cutover ordering

- **Surface.** No existing constitution covers this; would land in the same deliberate-act session as AC-1.
- **Posture.** Constitution amendment (AC-1 + AC-2) is **gated** on the migration pass having run at least once, AND on the off-catalog-edge reconciliation (AC-N) having completed, AND on the §9 catalog-reconciliation blocker having closed. Extended this round to absorb AC-N + §9 dependencies per `../round-2/robot-talks.md` revision agenda item 2 (option c).
- **Status.** Candidate.

### AC-9 — Partial supersession of `inverse-edge-fix` Tier 2

- **Surface.** `inverse-edge-fix.md` session note + this research artifact's eventual consolidated discovery.
- **Posture.** If adopted, `inverse-edge-fix` Tier 2 (manual inverse backfill) is **dissolved** — the derivation pipeline materializes inverses mechanically. The Round-2 framing called this a `supersedes` edge with "partial" prose semantics; `../round-2/reviewer-1.md` N-1 correctly noted that the catalog forbids `supersedes` from a `research` source AND forbids "partial" wholesale semantics. **This round demotes the §Connections row to `cites`** (per agenda item 1) and carries the partial-supersession claim in D-10 prose only. Whether the catalog should be amended to admit "partial supersession" is raised as a candidate in AC-11 (below) so this proposal's table is not the place that depends on an unproposed amendment.
- **Status.** Candidate. Sequencing directive to `inverse-edge-fix` Tier 1 is in §3 AC-9-bis below.

### AC-9-bis — Tier 1 sequencing directive for `inverse-edge-fix`

- **Surface.** `inverse-edge-fix.md` session note.
- **Posture.** Per `../round-2/reviewer-2.md` NF-4 + `../round-2/robot-talks.md` SY-3: if `inverse-edge-fix` Tier 1 (bootstrap empty `## Connections` blocks on the three sinks) runs before this proposal's derivation tool exists, those bootstrapped tables become **hand-authored** Connections sections that the derivation tool would later either overwrite (data loss) or wrap retroactively (unscoped). **Direction:** Tier 1 continues, but its bootstrap row format SHOULD include whatever idempotency-region convention this proposal eventually picks (see §4.1 unresolved) — OR Tier 1 pauses pending §9 closure. Conjecture, not commitment; awaits §9 catalog-reconciliation outcome.
- **Status.** Candidate / conjecture. This is one of two routes; the other is "Tier 1 pauses." Round-3 reviewers should attack whether this AC-9-bis is well-formed or whether it punts the sequencing question.

### AC-10 — Authoring Rule 3 amendment: `contradicts` becomes derive-from-either-side **(NEW this round)**

- **Surface.** `ontology-conventions.md` Appendix C Authoring Rules section, line 640 ("**`contradicts` is special.** Both sides use the same name (it is symmetric). Both must still declare.").
- **Posture change.** The current rule is "both must still declare." This proposal relaxes that to: **declaration on either side is sufficient; the projection materializes the symmetric position on the other side.** Authoring on both sides remains legal; the dedup mechanism (§4.3) collapses the two emissions to a single canonical pair.
- **Why this is constitutional, not operational.** Round 2's §4.3 silently performed this relaxation inside an operational spec (`../round-2/reviewer-1.md` N-4 caught it). The §3-vs-§4 boundary (discovery surfaces candidates; operational spec implements them) requires the rule-change to live in §3 as an AC, with §4.3 specifying the *mechanism* that implements it. This AC closes the §3-vs-§4 boundary violation.
- **Alternative path explicitly considered.** Restore Authoring Rule 3 ("both must still declare") and have §4.3 *validate* symmetric authoring rather than project it. This closes the boundary violation by reverting the relaxation. The cost: high-traffic symmetric edges (the "most valuable edge type" per `ontology-conventions.md` line 324) lose the inverse-materialization benefit the rest of the proposal claims. **Pick:** AC-10 (relaxation) over restore, on the grounds that excluding `contradicts` from the inverse-materialization benefit would be the rare-case carve-out that re-introduces dual-surface authoring D-1 is meant to eliminate. The trade-off is documented; restore remains a valid Round-3 reviewer attack vector.
- **Status.** Candidate. Mechanism is in §4.3 (specified this round per `../round-2/reviewer-2.md` NF-3).

### AC-11 — Catalog amendment to admit "partial supersession" *(conditional candidate)*

- **Surface.** `ontology-conventions.md` Appendix C `supersedes` row.
- **Posture.** *If* the team wants the catalog to encode the relationship AC-9 prose-describes (Tier 2 dissolved, Tier 1 and Tier 3 unaffected), the catalog row for `supersedes` (currently "1:1 wholesale") would need to admit either a `supersedes-partial` variant OR a cardinality/qualifier extension. Round-3 reviewers should treat this AC as a conjecture surfaced for visibility — the proposal does NOT commit to needing it. Demoting the §Connections row to `cites` (per agenda item 1) is sufficient to avoid catalog violation without AC-11.
- **Status.** Conditional candidate. Raised so the catalog-extension option is on the table, not adopted.

### AC-N — Catalog absorption of `proposes-edit` (and audit of off-catalog edge names) **(NEW this round)**

- **Surface.** `ontology-conventions.md` Appendix C catalog tables (add `proposes-edit` as a forward edge), §8 prose (formalize what is currently example-only).
- **Posture.** Per `../round-2/reviewer-2.md` NF-5: `proposes-edit` lives in 12 uses across 6 files **including the constitution itself** (§8 prose examples lines 297, 303). It is functionally a quasi-canonical edge name. Two routes:
  - **(b) Absorb.** Add `proposes-edit` to Appendix C with a defined source/target/cardinality. Resolves the constitutional self-inconsistency (catalog says "22 forward edges"; example-only edges aren't counted but are in active use). This is the §9 catalog-reconciliation blocker's natural form.
  - **(a) Reject.** Treat all 12 uses as drift to be rewritten before the first derivation pass. Cost: edits to 6 files including the constitution; effectively merges this proposal with a separate catalog-cleanup sweep.
- **`blocked-by`.** Per `../round-2/reviewer-2.md` NF-5: one use in `inverse-edge-fix.md`. Same routes apply; less load-bearing because lower count.
- **Picked route:** **(b) Absorb**, conditional on §9 catalog-reconciliation node deciding the same. If §9 picks (a) instead, this AC is withdrawn. AC-N is therefore *both* a candidate AND a dependency on §9 — surfaced explicitly so that Round-3 reviewers can attack the conditionality.
- **Status.** Candidate (conditional on §9).

### What does NOT change in the constitution

- The Appendix C edge catalog **names and directionality** (modulo the count residue, OQ-10, §9, and the AC-N absorption question).
- The two carve-outs in §8.
- The `contradicts` *symmetry property* itself (AC-10 changes the *authoring rule*, not the symmetry).
- The acyclicity constitution.
- The `governs`-runtime-witness constitution.
- The frontmatter-ownership constitution's single-owner schema.
- The discovery-structure constitution's §3 required body sections.

---

## 4. Operational sketch

**Honesty admission (new this round, per `../round-2/robot-talks.md` survival check + agenda item 10).** This section was titled "Operational spec" in Round 2; both reviewers and the synthesis agreed the title overcommits. **This is concrete enough to attack but not concrete enough to implement without prototype contact on 5 vault files.** No `vault-ctl edges derive` exists (TD-2). At least three Round-2 reviewer findings (NF-1 invented marker convention; NF-2 enclosing-sentence undefined for ~33 link sites; NF-3 `contradicts` dedup mechanism unspecified) are precisely the class of gap that prototype contact would surface. This round closes some of them on paper (NF-3 below); the rest are explicitly marked as sketch-level commitments awaiting prototype.

The §4 content survives the demotion. What changes is the *commitment level*: §5 decisions are still decisions, §3 candidates are still candidates, but §4 below is a sketch toward a specification rather than a specification.

### 4.1 IO contract of the derivation tool (sketch)

**Inputs:**
- All `.md` files under `vault/`.
- The Appendix C edge catalog (parsed from `ontology-conventions.md`, or — once §9 closes — a derived enumeration node).
- The carve-out predicates loaded from `vault_common.frontmatter.carveouts` (per `frontmatter-ownership-constitution.md` Rule 6).

**Outputs:**
- For each vault `.md` file: the file is rewritten so that the regenerated region inside `## Connections` reflects the current projected edge set. **Nothing outside the regenerated region is touched.**
- A derive-report (path proposed `vault/.edges/derive-report.jsonl`) with one line per warning: dangling targets, non-catalog title strings, deduped-link merges, invariant violations.

**Regenerated region — unresolved.** Round 2 named `<!-- BEGIN derived --> / <!-- END derived -->` HTML-comment markers. `../round-2/reviewer-2.md` NF-1 measured zero pre-existing use in the vault and noted no known markdown-tool prior art (Sphinx? mkdocs? Jekyll? — none confirmed). Three exits remain open and this round does NOT pick:
- (a) Cite a markdown-convention prior art for the marker pair. Not surfaced as of this round.
- (b) Treat marker insertion as part of migration debt; the full `## Connections` section is regenerated until markers are bootstrapped corpus-wide.
- (c) Sequence marker insertion as part of `inverse-edge-fix` Tier 1 sink bootstrapping (composes with AC-9-bis).

**This is a sketch-level unresolved item; Round-3 reviewers may attack the punt.** The honest answer is: marker convention picks depend on prototype contact with the corpus, and no prototype exists.

**Idempotency.** Running the tool twice on an unchanged corpus must produce zero file changes. This property is load-bearing for D-2 ("never hand-edited") and depends on the regenerated-region convention being decidable from the file alone.

**Failure modes:**
- Dangling target → warning, edge materialized with `[dangling]` suffix in the Type column. Not an error.
- Title not in catalog → warning, edge **not** materialized — the link is treated as prose. **Caveat:** off-catalog edges already in tabular use (e.g., `proposes-edit` in 12 places per NF-5) are NOT title-based; they're table-cell content. Reconciliation of those is AC-N + §9, not §4.1.
- Title in inverse-name position → **error**, build fails.
- Post-derivation invariant violation → **error**.

**Scope of what is NOT in the contract:**
- Migration of existing 852 edge rows is out of scope (D-6).
- Cross-repo edges (`_backlog.md` parking) are out of scope (TD-5).
- Frontmatter is not touched.

### 4.2 Syntax constraint — inline links only

Unchanged from Round 2 (`../round-2/explorer.md` §4.2). Inline `[text](url "type")` only. Image links, reference-style, shortcut, autolinks, code-fenced, frontmatter-YAML, in-`## Connections` are all forbidden as edge form.

**Added this round per `../round-2/reviewer-2.md` NF-6 + `../round-2/robot-talks.md` revision agenda item 9:** The AST parser (mdast/remark) is the authority on fence boundaries. Manual regex-based fence detection is forbidden.

### 4.3 Edge-class handling

Unchanged from Round 2 for `retrofits` (forward-only), `subclass-of` (post-derivation tree check), the two §8 carve-outs (predicate-keyed via `vault_common.frontmatter.carveouts`), and acyclicity (delegated to existing `vault-ctl cycles check`).

**`contradicts` — specified this round per `../round-2/reviewer-2.md` NF-3 + Round-2 robot-talks SY-2.** AC-10 (§3) names the constitutional posture change (declaration on either side is sufficient); the mechanism that implements it is:

1. **Parsing phase.** Both files are parsed independently. From `A.md` `[B](B.md "contradicts")` in §3, emit edge `(source=A, target=B, type=contradicts, description=enclosing-sentence-from-A-§3, origin=A-bodylink-N)`. From `B.md` `[A](A.md "contradicts")` in §5, emit `(source=B, target=A, type=contradicts, description=enclosing-sentence-from-B-§5, origin=B-bodylink-M)`.
2. **Canonical-pair step.** For each emitted `contradicts` edge `(s, t)`, compute canonical pair `(min(s,t), max(s,t))` by lexicographic order on vault-root-relative path. (Closes OQ-2 in this round: alphabetical source order is the canonical-pair rule; file-mtime / author-order alternatives are explicitly rejected for non-determinism.)
3. **Dedup step.** Group all emitted `contradicts` edges by canonical pair. Within each group, deterministic merge:
   - **Description:** the description from the alphabetically-first source (i.e., the description authored on the canonical lower-path endpoint). If only one side declared, that side's description wins by construction.
   - **The discarded description:** logged to derive-report as a warning ("symmetric edge dedup discarded description from <other-source>"). Authors who want both descriptions preserved must merge them into the canonical side's enclosing sentence manually.
4. **Projection step.** For each canonical pair, materialize one row on each endpoint's `## Connections` section (the symmetric position on the other side). Both endpoints carry the canonical (alphabetically-first-source) description.
5. **Validation step.** Acyclicity / triangle / self-loop invariants run after projection on the projected edge set.

**Trade-off.** Step 3's "alphabetically-first description wins" is deterministic but information-lossy. Authors are warned via derive-report. The alternative (concatenate both descriptions into a `description-source` / `description-target` pair on the row) doubles the row width and complicates the rendered table; rejected for v1. Tracked as TD-10 (new this round) if the rejection proves wrong in practice.

**Multi-edge same-pair, same-type dedup (`cites` ×3 → 1 row):** Unchanged from Round 2 §4.3 (first-occurrence rule, TD-7 alternatives). Note: this is the *non-symmetric* dedup; `contradicts` dedup is the canonical-pair rule above.

**Multi-edge same-pair, different types** (e.g., `cites` + `validates`): two rows. Unchanged.

### 4.4 Inverse-write discipline

Unchanged from Round 2 (§4.4) in substance: marker discipline (subject to the §4.1 marker-convention unresolved item), carve-out predicate sourcing via `vault_common.frontmatter.carveouts`, write atomicity per source-file edit.

**Added this round per `../round-2/reviewer-2.md` NF-1:** the "tool inserts markers" hand-wave is acknowledged as unsourced. Marker insertion is either (a) deferred to migration, (b) sequenced with `inverse-edge-fix` Tier 1 (AC-9-bis), or (c) the marker convention itself is dropped in favor of full `## Connections` regeneration. Picking among these is sketch-level pending prototype contact.

### 4.5 On-write vs on-build (binding decision D-9: on-build for v1)

Unchanged from Round 2 in substance.

**Added this round per `../round-2/reviewer-1.md` N-6 + `../round-2/robot-talks.md` agenda item 8:** the "constitution names *what* derivation does, not *when* it runs" claim is grounded in `ontology-conventions.md` §8's "no SQL-layer inference" — under on-build, materialization happens *before* any SQL/render-layer reads the corpus, so D-9 respects §8 as-currently-written. This is the constitutional anchor for D-9's reversibility claim.

---

## 5. Decision Summary

The research artifact commits to the following decisions. **D-7 extended** this round for the enclosing-sentence fallback; **D-3 wording demoted** this round in its own sentence per `../round-2/reviewer-1.md` N-5 + `../round-2/reviewer-2.md` Regression-1; **D-10 re-typed** in the §Connections table per `../round-2/reviewer-1.md` N-1; **D-11 added** for the `contradicts` posture change (AC-10) for symmetry with the operational mechanism in §4.3.

- **D-1 — Adopt typed body links as the single authored surface for edges.**
- **D-2 — Demote `## Connections` to derived output.** (Regenerated region convention is sketch-level — see §4.1.)
- **D-3 — Preserve the Appendix C edge catalog as-cataloged, modulo §9.** Demoted this round: the 21/22/25 count residue and the off-catalog `proposes-edit`/`blocked-by` propagation make "preserved unchanged" unevaluable in the strict sense. D-3's commitment is conditional on §9 catalog-reconciliation closure. Per `../round-2/reviewer-1.md` N-5 + `../round-2/reviewer-2.md` Regression-1: the disclaimer now lives inside D-3, not in a sibling OQ.
- **D-4 — Untyped links remain prose.**
- **D-5 — Inverse visibility is preserved through regeneration.**
- **D-6 — Migration is out of scope.** Refinement vs Round 1 (carried from Round 2): description-field design is in scope for this research (D-7); migration mechanics are not.
- **D-7 — Description-field semantics: option (a) — enclosing sentence, with fallback rules (extended this round).** Per `../round-2/reviewer-2.md` NF-2: ~33 link sites have no enclosing sentence (32 standalone list items + 1 header link + body-table cells in 76 files). **The picked fallback chain:**
  1. **If the link has an enclosing sentence in body prose:** that sentence (Round-2 picked rule).
  2. **If the link is a standalone list item with no surrounding prose** (the 32 measured cases): the link text itself becomes the description.
  3. **If the link is inside a markdown header** (the 1 measured case): the header text itself becomes the description.
  4. **If the link is inside a body table cell** (~448 cases across 76 files): the row's first cell content (typically a label column) becomes the description; if the link is itself in the first cell, the table caption or preceding paragraph becomes the description.
  5. **If none of the above resolves** (extreme edge case): empty description with a warning logged to derive-report.

  The picked chain is deterministic, returns a defined value for every link site measured in the corpus, and is sketch-level pending prototype contact (a prototype on 5 vault files may surface chain elements that perform poorly). Alternative: admit standalone-bullet and table-cell edges are out of scope for v1 (rejected because list-of-references bullets — which the chain handles via element 2 — are exactly where `cites` edges should be cheap to author).

  **The 40% information-loss commitment (~407 of 1027 measured edge rows exceed 120 chars) is unchanged from Round 2.** The fallback chain does not reduce that number; it only handles the previously-undefined sites.

  Option (b) `description=""` attribute rejected (CommonMark portability). Option (c) `connection_notes:` frontmatter list is the bounded escape hatch (TD-6).

- **D-8 — Forward-only authoring.** Body links carry the catalog forward name only. Inverse-name titles are linter-rejected.
- **D-9 — Derivation runs on-build for v1.** Reversible without constitutional change; constitutional anchor in §4.5 (added this round).
- **D-10 — This research partially supersedes `inverse-edge-fix` Tier 2.** The hand-authoring discipline that Tier 2 codifies is dissolved by mechanical derivation. **Re-typing this round:** the §Connections row toward `inverse-edge-fix` is now `cites`, NOT `supersedes` (Round 2's choice violated the catalog source-type column per `../round-2/reviewer-1.md` N-1). The partial-supersession claim is carried in this D-10 prose only, not encoded in a typed edge. AC-11 (§3) raises the catalog-amendment option for any consumer that wants the claim typed.
- **D-11 — `contradicts` authoring relaxes to declaration-on-either-side-is-sufficient (NEW this round).** Per AC-10 (§3) + §4.3 mechanism. The decision is constitutional (AC-10) and operational (§4.3 dedup mechanism); D-11 records the binding commitment. The alternative path (restore "both must still declare" + §4.3 validates only) is explicitly considered in AC-10 and rejected on the grounds that excluding the most valuable edge type from inverse-materialization would re-introduce dual-surface authoring D-1 is meant to eliminate.

---

## 6. Tracked Debt

- **TD-1 — Migration path is undesigned.** Out of scope per D-6.
- **TD-2 — Tooling does not exist.** The §4 operational sketch is conceptual. No `vault-ctl edges derive` exists.
- **TD-3 — Catalog-count residue.** Promoted to §9 blocking dependency this round (was tracked debt in Round 2). The 21/22/25 disagreement is no longer "downstream concern"; it is precondition for promotion. Cross-ref: OQ-10, §9.
- **TD-4 — `derives-from` overload is not addressed by this proposal.** Orthogonal.
- **TD-5 — Cross-repo and dangling targets.** Dangling specified in §4.1. Cross-repo out of scope.
- **TD-6 — Description-field fallback to option (c) is a bounded escape hatch.** Per D-7. Unchanged.
- **TD-7 — Description-merge rule for multi-edge same-pair same-type is "first occurrence".** Unchanged.
- **TD-8 — Editor-preview ergonomics for `title`-as-edge-type.** Unchanged.
- **TD-9 — Measurement of how many existing prose links would retroactively qualify as edges if titled.** Unchanged.
- **TD-10 — `contradicts` dedup discards one description (NEW this round).** §4.3 step 3 picks "alphabetically-first description wins" for determinism. The discarded description is logged to derive-report. If the discard rate proves empirically high or the discarded descriptions prove load-bearing for symmetric-edge meaning, the fallback is to add `description-source` / `description-target` row pair format — doubling row width. Tracked debt, not picked.
- **TD-11 — §4 marker convention is undecided (NEW this round, demoted from Round 2 §4.1 assertion).** Per `../round-2/reviewer-2.md` NF-1: `<!-- BEGIN/END derived -->` is invented; the three exits (cite prior art / migration debt / sequence with Tier 1) remain open pending prototype contact. Tracked as debt because picking it requires running a derivation pass on 5 vault files, which this round does not do.
- **TD-12 — D-7 fallback chain is sketch-level (NEW this round).** The 5-element chain in D-7 is deterministic on paper but sketch-level pending prototype. Cases like "link is the entire bullet" vs "link is one of several inline links in the bullet" are not separately resolved by the chain as written.

---

## 7. Open Questions

- **OQ-2 — `contradicts` symmetry dedup canonical form.** **CLOSED this round** by §4.3 step 2 (alphabetical source order on vault-root-relative path).
- **OQ-5 — Migration trap: links inside `## Connections` overwritten on regen.** Unchanged.
- **OQ-7 — Interaction with `documents-metadata-enforcement`.** Unchanged.
- **OQ-8 — Rejected alternative `Scope` column.** Confirmed not re-introduced.
- **OQ-9 — Sequencing footgun.** Unchanged; AC-8 names the gating rule, the question of *who enforces* remains open.
- **OQ-10 — Catalog-count reconciliation.** **PROMOTED this round** to §9 blocking dependency.
- **OQ-11 — Sequencing between this research and `inverse-edge-fix` in-flight Tier 1.** Partially addressed by AC-9-bis (this round); the conditional remains open until §9 closes.
- **OQ-12 — A11y / tooltip regression mitigation.** Unchanged.
- **OQ-13 — Does AC-N pick (b) absorb survive scrutiny? (NEW this round).** If §9 catalog-reconciliation node decides `proposes-edit` should be *removed* from constitution prose (route a) rather than absorbed into Appendix C (route b), AC-N is withdrawn and the 12 existing uses must be rewritten before any derivation pass. Surfaces a decision-dependency that this proposal cannot make alone.
- **OQ-14 — Is the §4.1 regenerated-region convention "BEGIN/END markers" worth keeping as a working assumption even unsourced? (NEW this round, from NF-1).** TD-11 tracks the debt; OQ-14 surfaces the question of whether the spec should retain `<!-- BEGIN/END derived -->` as a placeholder (so reviewers can attack a concrete form) or strip it entirely (so reviewers attack the abstract idempotency property only).
- **OQ-15 — Is D-7 fallback element 4 (table-cell description) operationally tractable? (NEW this round).** The chain says "row's first cell content"; in practice, body tables in vault files have varied first-column semantics (some are labels, some are categories, some are paths). Open whether a single rule serves all 76 files with body tables.
- **OQ-16 — Does AC-9-bis "Tier 1 continues" punt the sequencing question or answer it? (NEW this round).** Round-3 reviewers may attack AC-9-bis as a tautology ("Tier 1 continues until §9 closes, then we'll know"). Surfaced for attack.

(Round-1 OQ-1, OQ-3, OQ-4, OQ-6 remain closed; OQ-2 closes this round; OQ-10 promotes to §9.)

---

## 8. Reframings (NEW this round)

Per `../round-2/robot-talks.md` "Persisting dead metaphors": 3 of 4 metaphors flagged in Round 1 survived into Round 2; DM-3 (catalog-as-fixed-invariant) graduated to load-bearing via CV-1 + SY-1. This section names each dead metaphor explicitly and proposes what the actual frame should be. **This is the explorer's metacognitive contribution.** Round-3 reviewers will attack whether the replacements are real or cosmetic.

### R-1 — "Single-source-of-truth" is not an unqualified good for *edges with descriptions*

**What was implicit.** Round 2's D-7 framed option (c) — separate authored surface for descriptions — as "weakens the headline claim" and "an escape hatch." The framing presumes that single-source-of-truth (SoT) is the universally correct shape and decomposition is a recovery move when SoT fails.

**What should replace it.** SoT is the correct shape for *edge declarations* (the type + source + target tuple) where the cost of disagreement is silent corpus inconsistency. SoT is **not** automatically the correct shape for *edge descriptions* where the cost of forced SoT is 40% information loss. The valid alternative frame: **edges have two parts (the typed pointer and the rationale), and the parts have different authoring economies.** The pointer wants SoT (low-cost to mechanize, high-cost when wrong); the rationale wants a separate surface optimized for prose density (high-cost to fragment, low-cost when authored where the prose naturally lives).

**Operational consequence.** D-7 option (a) is still the picked choice for v1 because the decomposition cost (option c) requires an unscoped constitution amendment for `connection_notes:`. But the *reason* to prefer (a) is "lower amendment cost for v1," not "SoT is intrinsically better." If migration measurement (TD-9) finds the 40% loss is concentrated in rows whose rationales are load-bearing (e.g., `contradicts` reasons), the move to (c) is not a defeat — it is the recognition that the two parts have always had different authoring economies. **The metaphor that prevented this reading: "single-source-of-truth = good, decomposition = bad."** Replace with: "SoT for the pointer, decomposition-when-warranted for the rationale."

### R-2 — "Drift" is a symptom of *authoring rate*, not a symptom of *surface distance*

**What was implicit.** §1 ("Why now") frames drift as "the table is far enough from the prose that authors edit one and forget the other." The implicit mechanism is *distance between surfaces*. Inverting which surface is authoritative would, on this frame, eliminate drift.

**What should replace it.** Distance is a contributing factor; the load-bearing factor is **authoring rate** — the rate at which edges enter the corpus in a coherent state. Audit-then-sweep cycles recover drift after it accumulates; they do not change the rate. **Inverting authority moves where the drift accumulates without changing how fast it accumulates.** If authors today edit prose and forget the table, after this proposal authors will edit prose and forget the `title` attribute — the *which surface* changes, the *forgetting rate* may not.

**Operational consequence.** The proposal's claim shifts from "this eliminates drift" to "this localizes drift to a single surface where mechanical enforcement (linter, CI, on-build derive) can act on it." That is a real improvement — mechanical enforcement on a single surface is strictly easier than reconciliation across two surfaces — but it does not on its own change the rate at which authors forget to title their edges. The merge-conflict-footprint concern raised by `../round-2/reviewer-2.md` DV2-5 is the same shape: on-build moves the conflict surface from "two files manually edited" to "two files automatically regenerated," not from "conflicts exist" to "conflicts don't." **The metaphor that prevented this reading: "drift = surface-distance problem."** Replace with: "drift = authoring-rate problem; surface-distance amplifies it; mechanization controls amplification but not rate."

### R-3 — The catalog is not a fixed invariant; it is the artifact this proposal must reconcile with *first* (LOAD-BEARING per CV-1)

**What was implicit.** D-3 ("Preserve the Appendix C edge catalog … unchanged in name and directionality") treats the catalog as a stable referent the proposal can preserve. OQ-10 (Round 2) admitted the count residue but framed it as "not this proposal's job to fix" — a downstream concern.

**What should replace it.** The Round-2 review chain showed this framing is unsustainable. CV-1 (Round-2 robot-talks): the §Connections table in this very file violated catalog source-type columns three times; the corpus contains 12 live uses of `proposes-edit` (off-catalog) including in the constitution's own §8 prose. **The catalog disagrees with itself (21/22/25 count) and with the corpus that uses it (off-catalog edges in active circulation including in the constitution).** A proposal that claims to preserve the catalog cannot proceed against an internally-inconsistent referent.

**Operational consequence.** This proposal's blocker for promotion is no longer just "build the derivation tool." It is **reconcile the catalog first**, which is §9 (added this round). D-3 is demoted to acknowledge this dependency in its own sentence. AC-N raises the absorption-vs-rejection decision for `proposes-edit`. AC-8 cutover ordering is extended to gate also on §9 closure. **The metaphor that prevented this reading: "catalog = fixed background invariant the proposal preserves."** Replace with: "catalog = co-evolving artifact; this proposal cannot promote until the catalog stops being three different things at once."

This is the load-bearing reframing of Round 3. Round-2 robot-talks named it: "Round 3 must decide whether catalog reconciliation (OQ-10) is a precondition or a sibling concern." This round decides: **precondition.** §9 is the structural form of that decision.

### R-4 — "The pipeline" is not a single coherent object

**What was implicit.** §4 throughout Round 2 referred to "the derivation pipeline" as one object with one IO contract. Migration was acknowledged as separately-scoped, but validation, materialization, and bootstrap were conflated.

**What should replace it.** There are at least **three** distinct pipelines (or pipeline-phases) the proposal touches:
- **Materialization** — the `vault-ctl edges derive` invocation that writes regenerated regions. The §4 sketch is mostly about this.
- **Validation** — the post-derivation invariant checks (acyclicity, subclass-of tree, contradicts canonical pair). Currently described as "step 5 of derivation" but mechanically independent — could run as a CI check without rewriting any file.
- **Bootstrap** — the marker-insertion sub-tool (`../round-2/reviewer-2.md` NF-1 named this implicitly: "the marker-insertion sub-tool"). Currently hand-waved as "the tool inserts them"; mechanically a one-shot migration concern with its own IO contract.

**Operational consequence.** Treating these as one tool obscures that materialization can ship without bootstrap (if the corpus pre-bootstraps markers via Tier 1) and bootstrap can ship without materialization (if Tier 1 redirects to insert markers without writing derived rows). The §4.5 D-9 "on-build for v1" decision is really three decisions: on-build *materialization*, *validation*, and *bootstrap* are each independent timing choices. **The metaphor that prevented this reading: "the pipeline = singular noun."** Replace with: "materialization + validation + bootstrap = three pipelines with three independent timing choices, currently bundled under one name."

This reframing is partial — Round 2 already split migration off — but the validation-vs-materialization-vs-bootstrap decomposition is new this round and surfaces a Round-3 attack vector: §4.5's D-9 may be over-committing because it picks one timing for three things.

---

## 9. Blocking Dependencies (NEW this round)

Per `../round-2/robot-talks.md` survival check + non-negotiable precondition #2: this discovery **cannot promote to a consolidated discovery** until the following sibling node closes. Tracked as a blocking dependency, not as tracked debt.

### B-1 — Catalog-reconciliation node must close (OQ-10 promoted)

**What.** A sibling node — research, audit, or amendment, whichever the team picks — must reconcile the Appendix C catalog with itself and with the corpus. Concretely, it must resolve:

1. **Count residue.** `ontology-conventions.md` line 322 says "21 forward edges (40 names total counting inverses)"; line 556 says "22 forward edges"; manual enumeration of the three Appendix C subtables yields 25 (Epistemic 15 + Provenance 9 + Reference 1). At least two of the three sources are wrong. The reconciliation must pick the correct count, identify which inline claims to amend, and explain the discrepancy (deprecated-and-not-removed? table miscounted?).

2. **Off-catalog edge propagation.** Per `../round-2/reviewer-2.md` NF-5: `proposes-edit` lives in 12 uses across 6 files including `ontology-conventions.md` §8 prose lines 297, 303. `blocked-by` lives in 1 use in `inverse-edge-fix.md`. The reconciliation must decide route (a) reject and rewrite all uses OR route (b) absorb into Appendix C with defined source/target/cardinality (AC-N route b).

3. **Source-type column completeness.** Whether `research`-typed nodes should be admitted as sources for `refines` and/or `supersedes` (the catalog rows currently exclude `research`). This is raised by `../round-2/reviewer-1.md` N-1/N-2/N-3 as a downstream consequence of the §Connections fix. If the answer is "yes, admit `research`," this proposal's `cites`-demoted rows could later be re-elevated. If "no," the demotion is permanent.

**Why this is a blocker, not a tracked debt.** Per Round-2 robot-talks SY-1: "the proposal's headline (single-source-of-truth via mechanical derivation) is being undercut by its own hand-authored table" AND the first derivation pass would mechanically delete 12 live edges the corpus and constitution treat as canonical. D-3 ("preserved unchanged") is unevaluable until B-1 closes. This proposal cannot promote to a consolidated discovery against an internally-inconsistent catalog without inflating its own claims.

**Test of done.** A sibling node exists, has reached `status: active` or `closed`, addresses all three sub-items above, and is referenced from this proposal's `## Connections` table via a `cites` or `derives-from` edge (whichever the catalog admits between this `research` node and the sibling node type).

**Operational specification of the blocker (not hand-waved).** The blocker is satisfied when: (i) `ontology-conventions.md` has a single internally-consistent forward-edge count (lines 322 and 556 agree with manual table enumeration); (ii) the `proposes-edit` decision is made (route a or route b) and propagated to the constitution; (iii) the source-type column for `refines` and `supersedes` is either confirmed-as-is or amended. Three concrete file-level checks; not a vague "the catalog is reconciled."

**Estimated cost of the blocker.** Out of scope to estimate here; that's the sibling node's job. But the recognition that this proposal cannot proceed without it is the load-bearing claim of §9.

### B-2 — Prototype contact on 5 vault files (recommended, not blocking, but escalates to blocking if §4 sketch elements prove untenable)

**What.** A 50-line prototype that runs §4's sketch on 5 vault files chosen to cover NF-1 (marker insertion), NF-2 (standalone-bullet links), NF-3 (contradicts dedup), NF-4 (in-flight Tier 1), NF-5 (off-catalog edges). The prototype's job is to surface what §4 forgot.

**Status.** Recommended by `../round-2/reviewer-2.md` "strongest concern" and `../round-2/robot-talks.md` agenda item 10. NOT promoted to blocking this round because:
- The §4 demotion to "operational sketch" (this round's first non-negotiable) absorbs the commitment-level mismatch.
- The prototype is implementation work, not research work; making it a blocker for promotion-to-discovery would conflate research-promotion with implementation-completion.

**Escalation rule.** If Round-3 reviewers find specific §4 sketch elements that are *internally* contradictory (not merely sketch-level), B-2 escalates to blocking. Round-3 reviewers should attack §4 with this escalation explicitly in mind.

---

## Connections

> **Authoring note (revised this round).** Per the proposal's own logic, this section should be derived from typed body links in §1–§9. Since the derivation pipeline does not exist (TD-2) and migration is out of scope (D-6), this round hand-authors the table in the legacy form. Round 2's table introduced three catalog source-type violations (`refines`/`supersedes`/`supersedes` from a `research` source — per `../round-2/reviewer-1.md` N-1/N-2/N-3). **This round demotes the three violating rows to `cites`** (which Appendix C admits with source `any`, target `any`, per `ontology-conventions.md` line 616) and carries the prose-rich relationships in the body (§3 AC-1/AC-2/AC-9, §5 D-10, §9 B-1). The catalog-extension option (admit `research` as a source for `refines`/`supersedes`, or admit "partial supersession" semantics) is surfaced as AC-11 in §3 and as sub-item 3 of §9 B-1 — raised, not adopted by this row.

| Document | Type | Description |
|----------|------|-------------|
| [../../../../ontology-conventions.md](../../../../ontology-conventions.md) | `cites` | The Appendix C edge catalog and §8 Directionality Principle are the constitutional baseline this proposal proposes to extend (AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-10, AC-N). **Demoted from Round-2 `refines` per `../round-2/reviewer-1.md` N-3** (catalog source-type for `refines` excludes `research`). The "refines" relationship is real but cannot be typed by this `research` node without an AC-11-style catalog extension; carried in §3 prose instead. Inverse `cited-by` to be added at promotion. |
| [../../../../discovery/domainspec-vault-edges/discovery.md](../../../../discovery/domainspec-vault-edges/discovery.md) | `cites` | The Appendix C edge catalog adopted by D-1 of that discovery is the baseline this proposal claims to preserve (modulo §9 reconciliation). A-3 SQL-layer-inference rejection is addressed in §2 via the constitution's own "local readability" framing. A-4 `Scope`-column rejection confirmed not re-introduced (OQ-8). Inverse `cited-by` to be added at promotion. |
| [../../../../discovery/inverse-edge-fix/inverse-edge-fix.md](../../../../discovery/inverse-edge-fix/inverse-edge-fix.md) | `cites` | **Demoted from Round-2 `supersedes` per `../round-2/reviewer-1.md` N-1.** The partial-supersession claim (Tier 2 dissolved; Tier 1 sequencing per AC-9-bis; Tier 3 independent) is carried in §5 D-10 prose. The catalog forbids `supersedes` from a `research` source AND forbids "partial" wholesale semantics — the relationship the proposal wants to type cannot be typed without AC-11 (raised, not adopted). NF-4 sequencing question addressed in AC-9-bis. Inverse `cited-by` to be added at promotion. |
| [../../../../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md](../../../../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md) | `cites` | Adjacent enforcement discovery; OQ-7 names the question of whether the derivation pipeline proposed here can share a host with the metadata pipeline proposed there. Inverse `cited-by` to be added at promotion. |
| [../../../../constitution/edge-acyclicity-constitution.md](../../../../constitution/edge-acyclicity-constitution.md) | `cites` | Acyclicity is preserved unchanged by this proposal; the derivation pipeline must continue to feed `vault-ctl cycles check` the same edge graph it sees today (§4.3). Inverse `cited-by` to be added at promotion. |
| [../../../../constitution/frontmatter-ownership-constitution.md](../../../../constitution/frontmatter-ownership-constitution.md) | `cites` | The derivation does NOT extend frontmatter; it rewrites a body section. Per AC-6 + §4.4, the pipeline consumes carve-out predicates from `vault_common.frontmatter.carveouts` (Rule 6) rather than reimplementing them, preserving single ownership. Inverse `cited-by` to be added at promotion. |
| [../../../../constitution/discovery-structure-constitution.md](../../../../constitution/discovery-structure-constitution.md) | `governed-by` | This research's shape (frontmatter, structure, the discovery → constitution promotion-path discipline that motivates §3 being "candidates" not "drafts") follows the discovery-structure constitution. Per §6: "A discovery does not promote itself … Actually creating those files is a separate, deliberate act." `governed-by` source-type per catalog: `discovery, implementation-plan, spec` — **caveat:** this `research`-typed node is technically not in the listed source set; raised as sub-item of §9 B-1 sub-item 3 (source-type column completeness). For Round 3 we accept the catalog gap rather than demote to `cites`, because `governed-by` carries semantically-load-bearing constitutional binding that `cites` does not encode, and §9 B-1 is the natural place to surface the gap. Inverse `governs` to be added at promotion. |
| [../round-2/explorer.md](../round-2/explorer.md) | `cites` | **Replaces Round-2's `supersedes` self-reference per `../round-2/reviewer-1.md` N-2** (intra-dispatch round-to-round revision is encoded by folder structure, not by a typed edge; the catalog forbids `supersedes` from `research` and reserves the edge for cross-decision wholesale replacement, not within-dispatch revision). Closes Round-2 N-2's recommendation. The Round-2 → Round-3 revision relationship is encoded by folder layout and the §Objective / opening-paragraph narration. |
| [../round-2/reviewer-1.md](../round-2/reviewer-1.md) | `cites` | Constitutional-coherence Round-2 review. R1 closure: 9/10 R1 findings adequately closed. N-1, N-2, N-3 drive the §Connections demotion to `cites` this round (agenda item 1). N-4 drives AC-10 + §4.3 contradicts mechanism (agenda item 3). N-5 drives D-3 wording demotion (agenda item 7). N-6 drives §4.5 constitutional anchor (agenda item 8). |
| [../round-2/reviewer-2.md](../round-2/reviewer-2.md) | `cites` | Operational-viability Round-2 review. R1 closure: 10/10 surface; F4 partial, F7 partial. NF-1 drives §4.1 regenerated-region demotion + TD-11 (agenda item 4). NF-2 drives D-7 fallback chain (agenda item 5). NF-3 drives §4.3 contradicts dedup mechanism specification (agenda item 3). NF-4 drives AC-9-bis (agenda item 6). NF-5 drives AC-N + §9 (agenda item 2). NF-6 drives §4.2 AST authority sentence (agenda item 9). |
| [../round-2/robot-talks.md](../round-2/robot-talks.md) | `cites` | Round-2 synthesis. Survival check's two structural demotions (§4 → sketch, OQ-10 → blocker) executed this round; 10-item revision agenda addressed item-by-item in §Return summary. CV-1 (catalog self-inconsistency) drives §9 B-1. SY-2 (contradicts compose-fix) drives AC-10 + §4.3 together. SY-3 (AC-9 decomposition) drives the §Connections demotion + AC-9-bis + AC-11. DM-3 graduation drives §8 R-3. |
| [../round-1/explorer.md](../round-1/explorer.md) | `cites` | Round-1 origin point. Closes Round-1 OQ-1 (→ D-8), OQ-3 (→ D-7), OQ-4 (→ §4.3 multi-type rule), OQ-6 epistemic branch (→ D-10), OQ-2 (→ §4.3 step 2 alphabetical canonical-pair rule, this round). Round-2's `supersedes` toward Round-1 explorer is also replaced by `cites` here (same N-2 catalog reasoning). |
| [../round-1/robot-talks.md](../round-1/robot-talks.md) | `cites` | Round-1 synthesis whose 4 dead metaphors (DM-1 SoT, DM-2 drift, DM-3 catalog, DM-4 pipeline) are confronted in §8 Reframings this round (DM-3 promoted to load-bearing, the other three named with proposed replacements). |
