---
tags: [vault, ontology, edges, authoring, derivation, refactoring, review]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-30
---

# Reviewer 2 (Round 1) — Operational Viability & Edge Cases

> Independent skeptical review of `explorer.md`. Lane: operational viability and edge cases (parser behavior, syntax collisions, editor ergonomics, migration burden, inverse-write conflicts, tracked-debt load-bearingness). I did not read `reviewer-1.md`; my verdict is formed alone.

---

## Verdict

**accept-with-revisions** — the proposal's *direction* is defensible (single-source-of-truth, kill drift by construction) and the title-attribute mechanism is the least-bad CommonMark carrier. But the Round-1 draft underweights three operational realities that, on the corpus as measured (1121 inline links, 852 edge rows, 196 `## Connections` blocks, 407/1027 ≈ 40% of edge-row descriptions exceed 120 chars), make a v1 cut without further design **unsafe to ship**. None of the issues below are fatal in the abstract; collectively they say "Round 2 must produce an operational spec before any constitutional amendment is drafted."

---

## Findings

### 1. [block] Description-column semantics is the load-bearing unsolved problem, not "tracked debt"

- **Location.** Explorer §5 TD-3, OQ-3.
- **Claim.** Explorer treats the description-field question as TD-3 ("known limitation … recorded so the next rounds can decide whether to elevate it"), and OQ-3 leans toward "take the enclosing sentence" without committing.
- **Evidence.** I counted edge rows with descriptions longer than 120 chars: `407` out of `1027` total descriptions. About **40% of existing edge rows carry a description that does not fit in a one-sentence "enclosing context"**. Sample row from `ontology-conventions.md`'s own `## Connections`: `| 'sessions/2026-05-03-0334-…' | 'modified-by' | The 2026-05-03 cross-boundary-rule + edges-hygiene session landed Section 8's formal carve-out for forward-only edges into '.claude/skills/**' and '.claude/agents/**', and bootstrapped this '## Connections' block. |` — that description is a self-contained two-clause sentence about *why this edge exists*, not the kind of thing that survives being yanked from "the enclosing sentence of a body link". The body prose that mentions this session does so in a list of files-touched, not in a sentence about *carve-out landing*.
- **Recommendation.** Demote this from TD-3 to **OQ-load-bearing**. Either (a) accept that ~40% of descriptions will be lost / degraded by derivation and call this an explicit *information loss* of the migration, (b) commit to OQ-3 option (c) — a per-link `description="…"` attribute — which is **not** CommonMark-portable (kills the "preserved by every AST parser" property the explorer's §2 leans on), or (c) keep the description as a separate authored surface (e.g., HTML comment immediately after the link, or a sibling YAML block keyed by link target+type) and accept that the proposal is no longer "single-source-of-truth for everything, only single-source-of-truth for *the edge declaration itself*". The third option is honest but it weakens the headline claim — the explorer should pick which truth it wants.

### 2. [major] Title-attribute is already the standard HTML/accessibility tooltip carrier — overloading it has user-visible cost

- **Location.** Explorer §2 "The title-attribute mechanism" and TD-6.
- **Claim.** Explorer treats the title attribute as "invisible in rendered prose" and TD-6 dismisses tooltip noise as "a workflow concern, not a correctness concern".
- **Evidence.** The CommonMark `title` attribute renders as `<a title="…">` in HTML, which **every browser and most markdown previewers (VSCode, GitHub web, Obsidian preview, Typora) renders as a hover tooltip**. Tooltips have been used for ~25 years for human-readable annotations (accessibility hints, "opens in new tab", citation expansions). The proposal recasts that surface as a machine-readable type label. Result for a reader hovering `[the foundations discovery](../foundations/discovery.md "derives-from")`: the tooltip says `derives-from` — useless prose noise for the reader, and an accessibility regression for anyone who *was* using titles to describe links for screen readers.
- **Recommendation.** Add a finding to §4 Decision Summary that explicitly accepts: "the title attribute is repurposed from human-readable tooltip to machine-readable edge type; vault prose forfeits the tooltip-as-accessibility-hint affordance." Round 2 should at minimum check what fraction of existing vault links *already* use the title attribute (I measured **zero** in vault prose, 10 hits all inside `explorer.md` examples — so this is greenfield in vault, but still a constitutional carve-out from the broader markdown ecosystem and the project should name it).

### 3. [major] Reference-style links and image links are not addressed; the AST extractor must specify behavior

- **Location.** Explorer §2 "The derivation pipeline (conceptual)" step 2: "for each inline link in the body".
- **Claim.** The explorer assumes inline `[text](url "title")` is the only relevant link form. CommonMark supports four link forms: inline, reference (`[text][label]` with a `[label]: url "title"` definition elsewhere), shortcut reference (`[label]` alone), and autolink (`<url>`). Images use `![alt](url "title")` and *also* carry a title attribute.
- **Evidence.** I ran `rg '\[[^\]]+\]\[[^\]]+\]' vault` and `rg '!\[' vault` — both return zero hits today. So the vault has no reference-style links and no images. That makes it tempting to ignore them; the explorer does.
- **Recommendation.** The constitutional amendment must state explicitly: (a) image-link titles (`![alt](path "type")`) are **ignored** by the extractor (images are not edges); (b) reference-style links may or may not carry titles (the title lives on the definition `[label]: url "title"`, not the use site); the extractor either supports them or forbids them — Round 2 must pick. Forbidding is cleaner and matches current vault practice (zero hits). Recommend: **inline-only is a hard rule**; reference-style and shortcut-style links are prose, never edges, regardless of any title on their definition. Document this as a §3.2 syntax constraint, not a footnote.

### 4. [major] Inverse generation has a write-conflict footprint the explorer doesn't size

- **Location.** Explorer §2 pipeline step 5 ("project the inverse onto the target") and §3.1 amendment.
- **Claim.** The explorer's pipeline writes the regenerated `## Connections` block on **both** the source (with the forward edge) and the target (with the inverse). That is a multi-file write for every single body-link edit.
- **Evidence.** Average vault file has 9.7 inline links (measured: 1121 links / 115 files). A discovery folder edit touching one file with 20 typed links potentially writes 21 files (1 source + up to 20 targets). For the three high-traffic sinks (`ontology-conventions.md` is cited by 7+ files in my sample; `inverse-edge-fix.md` cited by 5+), every edit to a citing file rewrites the sink's `## Connections` block. That is also where **merge conflicts** live: two parallel branches each adding a body link to the same sink will both regenerate the sink's table, producing diff conflicts on a file neither author was directly editing.
- **Recommendation.** Round 2 must specify: (a) is regeneration **on-write** (every edit triggers cross-file writes, must be in the curator pipeline / pre-commit hook) or **on-build** (a one-shot `vault-ctl edges derive` that runs in CI and the working tree is allowed to drift); (b) what is the conflict-resolution discipline when two branches both regenerate the same `## Connections` block; (c) whether the regenerated section is wrapped in `<!-- BEGIN derived -->` / `<!-- END derived -->` markers so the rewriter never touches non-derived content. None of these are addressed in §2 or §3.

### 5. [major] Same-pair, same-type duplicate links: dedup rule is unspecified and matters

- **Location.** Explorer OQ-4 (covers multi-edge same-pair-different-types) but is silent on multi-edge same-pair-same-type.
- **Claim.** OQ-4 says "a document may both `cite` and `validate` the same target — two typed body links in different sentences is the natural expression". It does not address what happens when the same document `cite`s the same target *three times* in three different sentences (different prose, different contexts).
- **Evidence.** My grep of most-common links: `[Connections](#connections)` appears 17 times across vault, `[research §Agent 4](./domainspec-subagents-research.md#...)` appears 9 times in the same file, `[../../sessions/2026-05-03-0334-cross-boundary-…](…)` appears 9 times. If any of these were typed `"cites"`, the extractor sees N identical edges. Does that emit one row (dedup by source+target+type) or N rows (preserve every occurrence as a separate edge)?
- **Recommendation.** Round 2 must pick. Recommend dedup-by-(source, target, type) with the description being either (a) the first occurrence, (b) the union of enclosing sentences joined by `; `, or (c) a count-prefixed marker (`[3 occurrences] …`). Option (a) is simplest and loses information; (b) is the most honest projection; (c) is ugly but auditable. Same applies to OQ-4's multi-type case — if a doc both `cites` and `validates`, the derived table should have two rows, not one row with both types.

### 6. [major] OQ-1 (forward-only vs both-direction authoring) is load-bearing for v1, not deferrable

- **Location.** Explorer OQ-1.
- **Claim.** OQ-1 says "Round-1 does not pick" between (a) only catalog forward names allowed in `title`, and (b) inverse names allowed and normalized to forwards. But the choice changes whether the proposal preserves `domainspec-vault-edges` D-6 (the "stronger-claim-side authors the forward" rule).
- **Evidence.** Under option (b), a parent doc writing `[child](child.md "derives")` *is* the legitimate author of the edge from the parent's perspective — bidirectional Markdown is preserved by the *authors* writing on both sides, with the derivation normalizing names. Under option (a), only one endpoint can author each edge, period — and the derivation always invents the inverse-side row. (a) loses D-6's "stronger-claim-side" property; (b) preserves it but invites both-sides-author-with-conflicting-descriptions race conditions.
- **Recommendation.** Promote OQ-1 from open question to **D-7** (a Round-1 decision). My recommendation is **option (a) — forward-only authoring** — because the proposal's whole point is to *eliminate* the dual-authoring drift. If both sides may author, the drift OQ-1 (b) is reintroduced at exactly the place D-1 promised to remove it. Authors who instinctively want to write from the inverse side should be told by the linter "rewrite this as a forward from the other endpoint." But pick. Don't ship Round 2 with this still open.

### 7. [major] OQ-6 (relationship to inverse-edge-fix) is a sequencing prerequisite, not a sibling question

- **Location.** Explorer OQ-6, TD-1.
- **Claim.** The explorer asks whether this proposal supersedes `inverse-edge-fix` Tier 2 or whether Tier 2 is a prerequisite. The framing treats this as a "relationship to be named".
- **Evidence.** `inverse-edge-fix.md` is `status: active`, mid-flight. Its Tier-2 sweep is the work of hand-adding ~90 missing inverse rows. If this proposal's migration (TD-1) runs *before* Tier 2 completes, the migration's starting state is corrupt — 90 forward edges have no inverse-side row, so the derivation pipeline either invents inverses the authors never agreed to (option a — inverses are mechanical anyway, so this is consistent), or treats the asymmetry as malformed (option b — half the corpus rejected).
- **Recommendation.** State as a hard sequencing constraint, not an OQ: **migration to typed body links is a no-op on the current corpus' inverse structure, because the pipeline regenerates the inverse mechanically.** This *dissolves* `inverse-edge-fix` Tier 2 — Tier 2 becomes unnecessary. Make this explicit in §3.3 Deprecations (it is already gestured at, "becomes a one-time migration", but should be promoted to a load-bearing decision). The risk: `inverse-edge-fix` is already mid-flight and may have shipped partial Tier-2 work that the migration must not overwrite.

### 8. [minor] Forward-reference / dangling-target behavior is under-specified

- **Location.** Explorer TD-5 ("the proposal does not improve nor worsen this").
- **Claim.** TD-5 treats dangling/moved targets as orthogonal. But the regeneration pipeline interacts: a typed body link to a non-existent file generates an edge with a dangling target. Does the `## Connections` table show the dangling row? Does the linter error? Does it warn?
- **Recommendation.** Specify: dangling targets are **warnings, not errors** at derive-time (consistent with current vault practice of having planned-doc references). The dangling edge **is** materialized in the `## Connections` table with a marker (e.g., suffix `[dangling]` in the Type column) so the asymmetry between corpus and graph is visible. This is a 2-line decision; ship it in Round 2.

### 9. [minor] OQ-5 ("links inside the `## Connections` block") interacts with description-derivation in a way that traps authors

- **Location.** Explorer OQ-5.
- **Claim.** If derivation overwrites `## Connections` on regeneration, any link inside the block is destroyed. The "simplest rule" is "ignore links in the block". But the *current* vault has all its edge information in those tables — if migration reads from the table to bootstrap typed body links, those links must be moved into body prose, not kept in the table where they will be erased on first regeneration.
- **Recommendation.** Migration discipline (out-of-scope per D-6) must include: "Before first regeneration, all surviving edge information in `## Connections` must be moved to body links or recorded as a `connection_notes:` frontmatter list to survive." Otherwise the first `vault-ctl edges derive` run is a data-loss event. Flag this in §5 TD as a *load-bearing migration risk*, not just "migration is undesigned".

### 10. [minor] §3.2 syntax rule "edge-type must be a member of Appendix C's forward-edge set" is ambiguous for `proposes-edit`

- **Location.** Explorer §3.2; Appendix C in `ontology-conventions.md`.
- **Claim.** The explorer's own `## Connections` block (line 199) uses `proposes-edit`, which is **not in Appendix C's 22-edge catalog** (I checked — the catalog has `cites`, `derives-from`, `supersedes`, `contradicts`, `codified-as`, `operationalized-by`, `implements`, `validates`, `refines`, `governed-by`, `subclass-of`, `part-of`, `alternative-to`, `synthesized-by`, `corroborates`, `retrofits`, plus provenance + reference edges — `proposes-edit` is absent).
- **Evidence.** Line 199 of `explorer.md` uses `proposes-edit` to label its relationship to `ontology-conventions.md`. The catalog does not contain this edge.
- **Recommendation.** Either (a) Round 2 adds `proposes-edit` to the catalog (separate amendment, separate discovery), or (b) the explorer's own table is non-conformant and the relationship should be re-typed (likely `refines` or `proposes-edit` → file an amendment). This is a self-inconsistency in the discovery's own Connections section that the proposal's derivation pipeline would correctly flag as malformed. Fix in Round 2.

---

## Strongest Concern

**The description field will lose 40% of its content under any of the explorer's currently-proposed mechanisms.** TD-3 + OQ-3 understate this — the measured corpus has 407 of 1027 edge-row descriptions exceeding 120 chars, and many of those (sampled above) are *self-contained second-clause rationales* that simply do not live next to a body link in the prose. The choice is binary: either (a) accept information loss as the cost of single-source-of-truth (and say so in D-7), or (b) abandon the "single surface" headline and accept two surfaces — the link (declares the edge) and the description (lives elsewhere). The Round-1 draft tries to have it both ways and that won't survive Round 2 scrutiny.

---

## Edge Case Catalog

| Case | Current proposal handling | Recommendation |
|---|---|---|
| `![alt](path "type")` (image link with title) | Unspecified; AST extractor may match | Hard-skip images; document in §3.2 |
| `[text][ref]` + `[ref]: url "type"` (reference-style) | Unspecified | Forbid as edge form; treat as prose regardless of title on definition |
| `<https://example.com>` (autolink) | Unspecified | N/A — autolinks have no title syntax; document as out-of-scope |
| `[text](url "Opens in new tab")` (legacy a11y title) | Tooltip will read "Opens in new tab" — not in catalog, so treated as prose | Specify: titles not in catalog → prose, but linter warns to catch typos like `"derive-from"` vs `"derives-from"` |
| `[text](url "derives-from "with quotes" inside")` (escaped quotes) | CommonMark allows `\"` escaping; extractor must handle | Document escape behavior; recommend titles forbid embedded quotes |
| `[text](url 'derives-from')` (single-quote title) | CommonMark allows; same semantics | Accept; or canonicalize to double-quote in linter |
| `[text](url (derives-from))` (paren-delimited title) | CommonMark allows; same semantics | Accept; or canonicalize |
| `[text](url)` (no title at all) | Prose, not edge — explicit in §3.2 | OK as stated |
| Same source → same target with same type appearing 3× in prose | Unspecified (OQ-4 only handles multi-type) | Dedup; pick description-merge rule (recommend first-occurrence) |
| Same source → same target with `cites` AND `validates` | OQ-4 says "two rows is natural" but doesn't commit | Pick: two rows in derived table; one body link per type |
| Link inside a `## Connections` block | OQ-5 unresolved | Ignore for derivation; lint as warning |
| Link inside a fenced code block (`` `[x](y "z")` ``) | Unspecified | Hard-skip — code blocks are not authoring surface |
| Link inside a blockquote | Unspecified | Treat as body prose (current convention) |
| Link in frontmatter YAML (e.g., `superseded_by:` field) | Unspecified | Out of scope — frontmatter is handled by frontmatter-ownership constitution, not this proposal |
| Link in a table cell *outside* `## Connections` (e.g., a comparison table) | Unspecified | Treat as body prose; titles count |
| Forward link to file that doesn't exist yet (planned) | TD-5 mentions; no handling | Materialize edge with `[dangling]` marker; warn, don't error |
| Forward link to a *deleted* file (broken target) | Unspecified | Same as dangling: materialize + warn |
| Symlinks / file moves between branches | Unspecified | Path resolution must follow git renames; specify in pipeline spec |
| `[text](path#anchor "type")` (target includes section anchor) | Unspecified; target field should be the path, anchor preserved separately | Strip anchor for edge target; preserve in description |
| `[text](../other.md "type")` vs `[text](/abs/path/other.md "type")` | Unspecified | Normalize to vault-root-relative path before edge emission |
| Title with leading/trailing whitespace `" derives-from "` | CommonMark trims; verify extractor matches | Document: title is trimmed before catalog lookup |
| Title case-sensitivity (`"Derives-From"` vs `"derives-from"`) | Catalog is lowercase-only | Linter rejects non-lowercase; or case-fold |

---

## What the Explorer Got Right

- **The diagnosis of dual-surface drift is correct and measured.** The `inverse-edge-fix` reference (~90 missing inverses) and the three-sinks-with-no-Connections-block observation are the right empirical motivation. This proposal is responding to a real and recurring failure mode, not inventing a problem.
- **The title-attribute carrier is the right CommonMark-native choice.** §2 correctly rules out wikilinks (Obsidian-specific), custom prefixes (leak into visible text), separate YAML (reintroduces the dual surface). The reasoning in §2 is solid; my objection in Finding 2 is about the cost being underweighted, not about the choice being wrong.
- **§2 "Why this is not just SQL-layer inference"** is the right defense of the A-3 rejection from `domainspec-vault-edges`. The materialize-on-write distinction preserves local-readability, which was the load-bearing property of A-3. This addresses what would otherwise be the strongest constitutional-coherence objection. (I expect Reviewer 1's lane covers this; I'm noting it from the operational side because the materialization decision *is* an operational question — see Finding 4 on conflict footprint.)
- **The §3.4 "what does NOT change" enumeration is disciplined.** Naming exactly which constitutions are untouched (acyclicity, governs-runtime, frontmatter-ownership, discovery-structure) is the right way to scope a constitutional amendment so reviewers can isolate what is up for debate.
- **TD-2 (tooling does not exist) is honestly named.** The proposal does not pretend the derivation pipeline is half-built; it names the tool as a precondition. OQ-9 then correctly surfaces the sequencing footgun (constitution amends before tool exists = every edit makes the corpus stale).
- **D-4 (untyped links remain prose)** is the right escape valve. Forcing every link to be typed would break the entire vault on day one; preserving the prose-link option keeps the proposal incremental rather than a flag-day cutover.
- **D-6 (migration is out of scope)** is the right scope discipline for a Round-1 discovery. My Findings 1 and 9 push back on *some* migration concerns, but only the ones that affect whether the v1 design is sound — the question of *how* to migrate the existing 852 edge rows belongs in a separate implementation-plan node, and the explorer is right to defer it.

---

## Connections

> Author note: per the proposal's own logic, this section should be derived. It isn't (TD-2, D-6). Hand-authored in the legacy form, consistent with the explorer's own choice.

| Document | Type | Description |
|----------|------|-------------|
| [../../../../ontology-conventions.md](../../../../ontology-conventions.md) | `cites` | Appendix C edge catalog (22 forward edges), §8 Directionality Principle, and the two carve-outs are the operational baseline this review measures the proposal against. |
| [../../../../discovery/inverse-edge-fix/inverse-edge-fix.md](../../../../discovery/inverse-edge-fix/inverse-edge-fix.md) | `cites` | The ~90 missing-inverse population and the three-sinks problem are the empirical evidence I cite in Finding 7 (sequencing) and that motivates the proposal generally. |
| [../../../../discovery/domainspec-vault-edges/discovery.md](../../../../discovery/domainspec-vault-edges/discovery.md) | `cites` | The 21-edge catalog and D-6's "stronger-claim-side authors the forward" rule are the constitutional precedents I cite in Finding 6 (OQ-1 promotion). |
| [explorer.md](explorer.md) | `refines` | This review accepts the explorer's direction and proposes operational fixes (Findings 1-10) that should land in Round 2 before any constitutional amendment is drafted. |
