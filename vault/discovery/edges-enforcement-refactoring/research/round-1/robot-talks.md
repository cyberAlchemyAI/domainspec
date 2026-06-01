---
tags: [vault, ontology, edges, authoring, refactoring, robot-talks, synthesis]
node_type: research
is_session: false
layer: ontology
nature: synthesis
status: draft
version: 0.1.0
last_updated: 2026-05-30
---

# Robot-Talks (Round 1 Synthesis) — Edges Enforcement Refactoring

> Synthesis of two independent reviews of `explorer.md`. Both verdicts: `accept-with-revisions`. This file identifies convergence, divergence, synergy, and produces a prioritized revision agenda for the Round-2 explorer. No new findings are introduced — the synthesis is bounded to what the reviewers wrote.
>
> Constitution: `robot-talks-constitution.md` v0.7.1. PM-3 governs ("synthesis is tension discovery, not aggregation") and PM-8 governs ("every synthesis statement traceable to agent findings"). Each row below cites reviewer + finding number.

---

## Participants

| Reviewer | Attack vector | File |
|---|---|---|
| **Reviewer 1** | Constitutional coherence — does the proposal honour `ontology-conventions.md`, `discovery-structure-constitution.md`, `frontmatter-ownership-constitution.md`, `edge-acyclicity-constitution.md`, and the discovery → constitution promotion boundary? | `reviewer-1.md` |
| **Reviewer 2** | Operational viability — does the title-attribute mechanism survive contact with the actual corpus (1121 links, 852 edge rows, 196 `## Connections` blocks), parser edge cases, editor tooling, and the inverse-write conflict footprint? | `reviewer-2.md` |

Coverage check (PM-2): The two lanes are concern-non-overlapping (one audits constitutional shape, the other audits parser/IO behaviour) but evidence-overlapping on three load-bearing artifacts: Appendix C, OQ-1, and the relationship to `inverse-edge-fix`. That overlap is what produces the convergence map below.

---

## Convergence map

Findings where both reviewers landed on the same load-bearing issue, from different angles.

| # | Issue | R1 finding | R2 finding | Why this convergence is load-bearing |
|---|---|---|---|---|
| C-1 | **Edge-catalog count is wrong AND inconsistent with itself.** Explorer says "21"; constitution says "22"; manual count yields 25. | F2 [block] — counts manually, gets 25, flags constitution as also stale | F10 [minor] — enumerates the catalog explicitly (22 names), notes explorer's own `## Connections` row uses `proposes-edit` which is NOT in any count | Two reviewers independently audited the catalog and produced two different numbers (R1: 25, R2: 22). That itself is the residue — the catalog count is unknowable from a single read. The explorer's "21-edge catalog preserved unchanged" claim cannot be evaluated until the catalog is reconciled. |
| C-2 | **OQ-1 (forward-only vs both-direction authoring) is already half-closed by prior art and must be picked in Round 1, not deferred.** | F10 [minor] — Appendix C Authoring Rule 1 already pins forward-on-source; OQ-1 silently re-opens a closed question | F6 [major] — option (b) reintroduces the dual-authoring drift D-1 was supposed to eliminate; promote OQ-1 to D-7, pick option (a) | Both reviewers, from different lanes, arrive at the same answer (forward-only). R1's reason: the catalog already commits to it. R2's reason: option (b) breaks the headline claim. Convergent and the answer is the same. |
| C-3 | **The relationship to `inverse-edge-fix` is mis-typed and load-bearing.** | F6 [major] — relationship should be `supersedes` (at least partially), not `cites`; `discovery-structure-constitution.md` §7 makes supersession constitutional | F7 [major] — this proposal *dissolves* `inverse-edge-fix` Tier 2; treat as hard sequencing constraint, promote out of OQ-6 into Deprecations | R1 attacks from the catalog side (wrong edge type on `## Connections`); R2 attacks from the operational side (Tier 2 work becomes a no-op). Same underlying claim: the `## Connections` row currently labelled `cites` is wrong; the truth is partial supersession. |
| C-4 | **Description-field semantics is not "tracked debt" — it is unresolved load-bearing design.** | F5 [major] — flags it as a *cutover correctness* problem (silent edge deletion), proposes OQ-10 | F1 [block] — measures 40% of descriptions >120 chars, calls it the "load-bearing unsolved problem"; demands binary choice between accept-info-loss vs abandon-single-surface headline | R1 lands here from the coherence side ("the proposal preserves bidirectionality but the cutover doesn't"); R2 lands here from measurement ("40% of descriptions don't fit"). Both say TD-3 understates the problem. Together they make it the single largest revision the explorer owes Round 2. |

---

## Divergence map

Findings unique to one reviewer. Each annotated with why the other lane missed it.

### Unique to Reviewer 1 (constitutional lane)

| # | Finding | Why R2 missed it |
|---|---|---|
| D1-1 | **F1 [block] Phantom "Authority Rule 1" vocabulary.** `ontology-conventions.md` contains no such phrase; the explorer invents an authority name and then "flips" it. | R2's lane was parser/operational; the question "does the constitution actually contain this rule name" is a coherence audit, not an operational one. |
| D1-2 | **F3 [major] Promotion-path violation.** §3.1 and §3.2 are written as **drafted constitutional text**, not as candidates. `discovery-structure-constitution.md` §6 forbids self-promotion. | R2 read these sections as operational specs to attack on their content; R2 did not audit *whether the explorer was allowed to write them in this form*. Pure governance concern. |
| D1-3 | **F4 [major] `retrofits` and `contradicts` edge-cases.** `retrofits` is forward-only-by-design (no inverse); `contradicts` is symmetric. The proposal's pipeline does not carve them out. | R2 enumerated edge cases (Findings 3, 5, 8, 10 + Edge Case Catalog) but at the *syntax/parser* level — image links, autolinks, code blocks, anchors. R2 did not audit the *catalog-semantic* edge cases. The two reviewers covered orthogonal edge-case classes. |
| D1-4 | **F7 [minor] `node_type: discovery` mismatch.** This is `research`, not `discovery`, per `ontology-conventions.md` Appendix B. | R2's lane stopped at content; frontmatter-classification is a constitutional question. |
| D1-5 | **F8 [minor] Subset-rule slip on A-3 restatement.** Explorer narrows A-3's actual rationale ("local readability") to a phrasing convenient for the proposal ("non-runtime materialization"). | Coherence-with-prior-discovery audit. R2 did not read `domainspec-vault-edges` A-3 verbatim. |
| D1-6 | **F9 [minor] `frontmatter-ownership-constitution.md` Rule 6 collision.** Carve-outs live in `vault_common.frontmatter.carveouts` as functions; the derivation pipeline must consume from there, not fork. | R2 noted the multi-site write footprint (F4) but did not connect it to the existing carve-out-ownership rule. Different constitution. |

### Unique to Reviewer 2 (operational lane)

| # | Finding | Why R1 missed it |
|---|---|---|
| D2-1 | **F2 [major] Title attribute is the HTML/a11y tooltip carrier.** ~25 years of convention; tooltips have been used for accessibility hints, "opens in new tab", citation expansions. Overloading it for `derives-from` is an a11y regression and produces "useless prose noise" on hover. | R1's lane is *internal* constitutional coherence — does the proposal cohere with the vault's own rules? The HTML/a11y ecosystem is *external* prior art. R1 had no reason to audit it. |
| D2-2 | **F3 [major] Reference-style and image links unaddressed.** CommonMark has 4 link forms + image links also carry `title`. Pipeline step 2 says "for each inline link" but the spec must explicitly forbid reference-style and image-link extraction. | Pure parser concern. R1 audited semantics, not syntax surface. |
| D2-3 | **F4 [major] Inverse-write conflict footprint.** Multi-file writes per edit; merge conflicts on `## Connections` blocks of high-traffic sinks where neither branch's author touched the sink directly. Need `<!-- BEGIN derived -->` markers. | R1 noted that derivation must consume from `vault_common.frontmatter.carveouts` (F9) but did not size the *write surface* itself. R1's lane is shape-of-rules, not IO-conflict footprint. |
| D2-4 | **F5 [major] Same-pair same-type duplicate links.** OQ-4 covers multi-edge same-pair-different-types but is silent on N occurrences of the same edge in different sentences. Dedup rule is unspecified and affects description merge. | Parser-behavior question; R1's lane stopped at "the catalog is preserved unchanged" without auditing what *materialization* looks like per-link. |
| D2-5 | **F8 [minor] Dangling-target behavior.** Should the dangling row be materialized? Marker? Warning vs error? | Operational pipeline behavior; not a constitutional question. |
| D2-6 | **F9 [minor] OQ-5 interacts with description-derivation in a way that traps authors.** Migration must move table content to body links *before* first regeneration, else data-loss. | R1's F5 names "silent edge deletion" at the *constitutional* level; R2's F9 names it at the *operational data-loss* level. Adjacent but distinct: R1 = "cutover violates Connection Coverage Policy"; R2 = "first `derive` run is a data-loss event." Either reviewer could have caught the other framing; neither did. |
| D2-7 | **Edge Case Catalog (22 rows).** Image links, autolinks, escaped quotes, single-quote titles, paren titles, code-block-fenced links, blockquote links, frontmatter-YAML links, anchor stripping, path normalization, whitespace, case sensitivity. | Pure parser-spec territory. R1 had no scope here. |

### Direct contradictions

None. The two reviews converge on direction (`accept-with-revisions`) and on the four convergent findings; the divergences are non-overlapping concerns, not opposing claims. The closest thing to tension is the *severity ordering* — R1's "strongest concern" is C-3 (supersedes), R2's "strongest concern" is C-4 (description loss). The synthesis must rank these together; see revision agenda.

---

## Synergy / amplification

Where one reviewer's finding makes another reviewer's finding *worse*, or solves it.

### S-1: R1-F3 (promotion-path violation) amplifies R2's "v1 unsafe to ship" verdict

R2's verdict line: *"Round 2 must produce an operational spec before any constitutional amendment is drafted."* R1-F3 independently says: §3.1 and §3.2 are written as drafted constitutional text, which violates `discovery-structure-constitution.md` §6 ("A discovery does not promote itself"). Combined, the two findings produce a single binding ordering:

> Round 2 cannot draft constitutional amendment text — both because the operational spec is missing (R2) AND because the discovery → constitution promotion is a separate deliberate act per the structure constitution (R1).

Either reviewer alone could be argued with (R2: "we can amend conditionally"; R1: "but the text is provisional"). Together they close the escape hatch.

### S-2: R2-F1 (description loss measured at 40%) amplifies R1-F5 (silent edge deletion at cutover)

R1-F5 is a *correctness* claim about cutover ordering. R2-F1 is a *measured information loss* claim about steady-state derivation. Stacked: the cutover not only risks silent edge deletion (R1) — it also, in the cases where the edge *is* preserved, deletes the description that explained *why* the edge exists (R2). The combined claim:

> Without solving description-field semantics first, the cutover both loses edges *and* hollows out the ones it keeps.

This is the single strongest argument for converting "migration is out of scope" (D-6) into "migration is out of scope, BUT description-field design is in scope for Round 2." The migration mechanics can defer; the description-field decision cannot.

### S-3: R2-F4 (write-conflict footprint) amplifies R1-F9 (frontmatter-ownership Rule 6)

R2-F4 says the regeneration is a multi-file write per edit; R1-F9 says the carve-out logic must live in *one* place (`vault_common.frontmatter.carveouts`). Stacked: the pipeline's write surface must (a) be wrapped in `<!-- BEGIN derived -->` markers (R2's recommendation), and (b) consume carve-out predicates from the single ownership site (R1's recommendation). The two together specify the *minimum* IO contract for the derivation pipeline.

### S-4: R1-F2 (catalog count chaos) amplifies R2-F10 (`proposes-edit` is not in the catalog)

R1 manually counts the catalog and gets 25; the constitution says 22; the explorer says 21. R2 independently notices the explorer's own `## Connections` table uses `proposes-edit`, which appears in *none* of the three counts. Combined: the catalog is *currently in an inconsistent state*, and the explorer is *also* using an edge name that isn't in any version of it. This is not just an error in the explorer — it surfaces that the catalog itself has a residue that any Round-2 work must clear before claiming "the catalog is preserved unchanged."

### S-5: R1-F6 (`supersedes`, not `cites`) amplifies R2-F7 (operational dissolution of Tier 2)

R1 says the `## Connections` row is mis-typed at the *catalog* level (should be `supersedes`). R2 says the *operational consequence* is that `inverse-edge-fix` Tier 2 becomes unnecessary. Stacked, this is a single decision with two required outputs: (a) re-type the `## Connections` row, (b) write a session note on `inverse-edge-fix` recording the partial supersession (R1's recommendation reinforced by R2's "Tier 2 dissolves").

---

## Revision agenda for explorer (prioritized)

Numbered by load-bearingness, not by reviewer order. Each item: what to revise, why (both reviewers cited when relevant), test of done.

### 1. Resolve description-field semantics — pick (a), (b), or (c) explicitly

- **What.** Demote TD-3 / promote OQ-3 into a Round-1 decision (D-7 or D-8). Three options, pick one:
  - (a) Accept ~40% information loss; description = enclosing sentence; document the loss as the cost of single-source-of-truth.
  - (b) Add a `description="…"` attribute; sacrifice CommonMark portability (the property §2 explicitly leans on).
  - (c) Keep description as a separate authored surface (HTML comment, sibling YAML, `connection_notes:` frontmatter list); the proposal becomes "single-source-of-truth for the edge declaration, not the description."
- **Why.** R2-F1 [block] measures 40% of descriptions exceed 120 chars; R1-F5 [major] shows the cutover transforms this into silent edge deletion (S-2). The headline "single-source-of-truth" cannot be defended Round 2 without naming which truth.
- **Test of done.** Round 2 explorer contains a D-N statement naming the picked option, the information-loss claim explicit, and the headline (D-1) restated consistent with the pick.

### 2. Reconcile the edge catalog count before claiming "preserved unchanged"

- **What.** Either (a) cite the constitution's "22 forward edges" verbatim and stop saying "21", or (b) trigger an independent reconciliation pass on Appendix C (R1 counted 25; constitution says 22; explorer says 21). Also: re-type the explorer's own `## Connections` row that uses `proposes-edit` (not in any version of the catalog).
- **Why.** R1-F2 [block] + R2-F10 [minor] + S-4. Three sources disagree on the count of the very invariant the proposal claims to preserve. The explorer's own table uses a non-catalog edge name.
- **Test of done.** Round 2 explorer cites the count from `ontology-conventions.md` Appendix C verbatim with a quote; the explorer's `## Connections` table uses only catalog names (or amends the catalog in a separate node); the discrepancy between R1's manual count (25) and the constitution's stated count (22) is acknowledged as a residue requiring a reconciliation node downstream.

### 3. Strike "Authority Rule 1" — cite §8 and Appendix C Authoring Rule 1 verbatim

- **What.** Remove the phrase "Victor's 'Authority Rule 1'" from §Objective and any routing context. Replace with a true citation: §8 Directionality Principle + Appendix C Authoring Rule 1 ("A `## Connections` block on the source declares the forward edge").
- **Why.** R1-F1 [block]. The phrase does not appear in `ontology-conventions.md`. Inventing an authority to "flip" it overstates what the proposal is inverting.
- **Test of done.** Grep on Round-2 explorer for "Authority Rule" returns zero hits; §Objective cites the actual binding text.

### 4. Re-type the `## Connections` row to `inverse-edge-fix` from `cites` to `supersedes` (partial) and record a session note

- **What.** Change the relationship in the explorer's `## Connections` table. Add to Decision Summary: "D-N — This discovery partially supersedes `inverse-edge-fix` Tier 2; the hand-authoring discipline that Tier 2 codifies is dissolved by mechanical derivation." Write a session note on `inverse-edge-fix` recording the partial supersession.
- **Why.** R1-F6 [major] + R2-F7 [major] = C-3 = S-5. The current `cites` label is false at the catalog level; the operational truth is Tier 2 dissolution.
- **Test of done.** `## Connections` row updated; `inverse-edge-fix` has a session note (or status field) recording the partial supersession; OQ-6 splits into (a) operational sequencing and (b) the epistemic relationship (now answered).

### 5. Promote OQ-1 to a Round-1 decision (forward-only authoring)

- **What.** Convert OQ-1 into D-N: "Body links carry the catalog forward name only; inverse names in `title` are linter-rejected. The pipeline does not normalize inverse-name authoring."
- **Why.** R1-F10 [minor] (catalog already pins forward-on-source) + R2-F6 [major] (option (b) reintroduces the dual-authoring drift D-1 eliminates) = C-2. Both reviewers converge on option (a).
- **Test of done.** OQ-1 deleted; new D-N states forward-only; rationale cites Appendix C Authoring Rule 1 and the D-1 anti-drift mandate.

### 6. Demote §3.1 and §3.2 from "drafted constitutional text" to "amendment candidates"

- **What.** Reframe §3.1 ("replaces the second sentence with…") and §3.2 ("A new subsection… would define:") as candidates per `discovery-structure-constitution.md` §6. Add a Next Moves entry: "Draft a separate constitution-amendment node (or session) once Rounds 2–3 close."
- **Why.** R1-F3 [major]. Discovery cannot self-promote into constitutional text. Synergy S-1 with R2's "operational spec must precede amendment".
- **Test of done.** §3 reframed; explicit candidate label in section headers; Next Moves names the deliberate-act path.

### 7. Add §3.5 Edge-class-specific handling — `retrofits`, `contradicts`, `subclass-of` tree constraint

- **What.** New subsection naming: (i) `retrofits` is forward-only-by-design — the derivation must not project an inverse; (ii) `contradicts` is symmetric — pick declared-once-projected vs declared-on-both-deduplicated; (iii) `subclass-of` tree constraint must be checked post-derivation.
- **Why.** R1-F4 [major]. Without this, "the catalog is preserved unchanged" silently drops or duplicates two of its 22 entries.
- **Test of done.** §3.5 exists; each of the three edge-classes has a named derivation rule.

### 8. Add §3.2 syntax constraint — inline links only; image and reference-style links are forbidden as edge forms

- **What.** Hard rule: only inline `[text](url "type")` is an edge declaration. Image links (`![alt](path "type")`), reference-style (`[text][label]` + `[label]: url "title"`), shortcut, and autolinks are prose regardless of any `title`.
- **Why.** R2-F3 [major]. The vault has zero hits today; codify before drift starts.
- **Test of done.** §3.2 syntax block enumerates allowed and forbidden link forms.

### 9. Specify the IO contract — on-write vs on-build, conflict markers, single-site carve-outs

- **What.** Round-2 explorer must state: (a) regeneration is on-build (one-shot `vault-ctl edges derive`) OR on-write (pre-commit hook); (b) the regenerated section is wrapped in `<!-- BEGIN derived -->` / `<!-- END derived -->` markers; (c) the pipeline consumes carve-out predicates from `vault_common.frontmatter.carveouts` per `frontmatter-ownership-constitution.md` Rule 6, not re-implementing them.
- **Why.** R2-F4 [major] (write-conflict footprint) + R1-F9 [minor] (frontmatter-ownership single-owner) = S-3.
- **Test of done.** §3 or §3.6 contains the IO-contract spec; the three sub-decisions named.

### 10. Specify dedup rule and dangling-target behaviour

- **What.** Pick a dedup rule for same-source / same-target / same-type repeated links (recommend first-occurrence description). Specify that dangling targets are materialized as `[dangling]`-marked rows with a warning, not an error.
- **Why.** R2-F5 [major] (dedup), R2-F8 [minor] (dangling).
- **Test of done.** Two new D-N statements or §3.7 entries.

### 11. Accept the tooltip / a11y regression explicitly in Decision Summary

- **What.** Add D-N: "The `title` attribute is repurposed from human-readable tooltip to machine-readable edge type. Vault prose forfeits the tooltip-as-accessibility-hint affordance. Measured baseline: zero existing vault links use `title` for human-readable purposes today, so the loss is prospective, not retroactive."
- **Why.** R2-F2 [major]. The cost is real (25 years of HTML/a11y convention) and must be named, not hidden in TD-6.
- **Test of done.** D-N exists with the explicit acknowledgement.

### 12. Fix `node_type: discovery` → `node_type: research`; resolve discovery-structure conformance

- **What.** Change frontmatter; acknowledge the file is the Round-1 research artifact under a multi-round dispatch, not the consolidated discovery. The discovery (with required sections per `discovery-structure-constitution.md` §3) is the Round-3 output.
- **Why.** R1-F7 [minor]. Frontmatter classification matters per Appendix B.
- **Test of done.** Frontmatter updated; the file no longer claims to be the discovery itself.

### 13. Quote A-3 verbatim; address subset-rule slip

- **What.** Quote `domainspec-vault-edges` A-3 verbatim and check whether the proposal's restatement ("against runtime-only computation with no Markdown materialization") matches A-3's actual rationale ("discoverable by reading either file" / "local readability").
- **Why.** R1-F8 [minor]. Restatement narrows A-3 in a self-serving way.
- **Test of done.** Verbatim A-3 quote in §2; rationale reconciled.

---

## Items NOT to revise

Things reviewers raised that the synthesis judges adequate or out-of-scope for Round 2.

- **D-6 (migration is out of scope).** Both reviewers explicitly accept this scope discipline (R1: "correctly out-of-scope per Victor's instruction"; R2: "the right scope discipline for a Round-1 discovery"). Revision item #1 above narrows it to "description-field design is in scope; migration mechanics still aren't" — that is a refinement, not a reversal.
- **TD-4 (`derives-from` overload).** Explicitly named as orthogonal. Neither reviewer attacks the deferral.
- **TD-5 (cross-repo / dangling targets).** R2-F8 addresses dangling at the operational level (item 10 above), but the cross-repo question is genuinely separate and out-of-scope.
- **TD-6 (editor-preview ergonomics).** Subsumed by item 11 — once the a11y / tooltip cost is named in Decision Summary, the editor-ergonomics question is a downstream tooling concern, not a constitutional one.
- **§Connections authoring-note** ("the discovery itself eats the dual-surface cost it proposes to eliminate"). R1 explicitly praises this as constraint-honesty. Keep verbatim.
- **§3.4 "what does NOT change" enumeration.** R1 calls this "disciplined"; R2 calls it the "right way to scope a constitutional amendment". Keep the structure; add the F9 frontmatter-ownership sentence per item 9 above.
- **D-4 (untyped links remain prose).** R2 explicitly endorses as "the right escape valve". Keep.
- **The `title`-attribute carrier choice itself.** Both reviewers endorse the *choice* over alternatives. The cost (R2-F2) must be named (item 11), but the choice itself is defended.

---

## Dead metaphors / framings both reviewers implicitly accepted

These are framings the synthesis flags as worth re-examining in Round 2 or Round 3 — neither reviewer challenged them, so they cannot be revised on this round's authority, but they should be put on the table.

- **"Single-source-of-truth" as an unqualified good.** Both reviewers debate *how* to implement SoT (forward-only authoring, dedup rule, description placement), but neither asks whether SoT is the right frame for *edges with descriptions*. R2's F1 option (c) — "the proposal becomes single-source-of-truth for the edge declaration, not the description" — is the closest anyone comes to questioning it, but it's framed as a defeat ("weakens the headline claim"), not as a legitimate decomposition. The framing assumption: an edge and its description are one fact. They might be two.
- **"Drift" framed as drift between two surfaces.** Both reviewers accept the explorer's framing that the problem is body-vs-table drift. Neither asks whether the deeper problem is *the rate of authoring* (authors don't update either surface because the cycle of audit-then-sweep doesn't reward it). Inverting which surface is authoritative may not change the authoring rate; it may just relocate where the drift accumulates. Round 3 worth-revisiting.
- **The catalog itself as a fixed invariant.** R1's F2 surfaces that even the *count* of the catalog is contested (21 / 22 / 25). The explorer claims "the catalog is preserved unchanged" — but if the catalog's own state is unstable, that claim is unevaluable. The deeper question both reviewers route around: does the catalog need to be reconciled *before* any proposal can claim to preserve it? Item 2 in the agenda touches this; a deeper version would ask whether the catalog should itself be derived from a single authoritative enumeration.
- **"Pipeline" as a noun that already exists conceptually.** Both reviewers debate pipeline behavior without challenging that "the derivation pipeline" is a coherent single object. R2's F4 hints at this (on-write vs on-build are *different* pipelines), but both reviewers treat it as a parameter, not a fork. The deeper question: is there one pipeline or three (one for write-time materialization, one for build-time validation, one for migration)?

---

## Synthesized verdict

**Round-2 explorer must produce an operational spec (description-field decision + IO contract + edge-class handling) BEFORE drafting constitutional amendment text. The proposal's direction is sound; its Round-1 surface is two distinct documents collapsed into one — a discovery (which Round 2 should sharpen) and a constitutional amendment draft (which is premature and forbidden by `discovery-structure-constitution.md` §6). Split them. Pick the deferred decisions (D-7 description-field option, D-8 forward-only authoring). Reconcile the catalog count. Re-type the `inverse-edge-fix` relationship. Then — and only then — Round 3 may surface amendment candidates.**
