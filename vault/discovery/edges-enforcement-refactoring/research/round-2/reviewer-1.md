---
tags: [vault, ontology, edges, authoring, review, coherence-check]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-30
---

# Reviewer 1 (Round 2) — Coherence with Constitution & Catalog Conformance

> Independent skeptic pass on `explorer.md` (Round 2), scoped to **constitutional coherence**. Authored without reading `reviewer-2.md` for this round. Round 1's R1 findings are checked for closure; Round 2's new surfaces (§3 Amendment candidates, §4 Operational spec) are audited for fresh constitutional violations.

---

## Verdict

**accept-with-revisions** — substantively, Round 2 closes the bulk of Round 1's blocks (Authority Rule struck; catalog count reconciled honestly; `inverse-edge-fix` re-typed; A-3 restated correctly; promotion-path split obeyed; carve-out sourcing addressed; frontmatter corrected). The design is now constitutionally defensible *at the level of argument*. But the new `## Connections` table — the very surface the author congratulated themselves for fixing — introduces **three independent catalog-source-type violations** that Round 1 did not have. Round 1's drift was at the catalog-name level (`proposes-edit` not in catalog); Round 2's drift is at the catalog-shape level (uses real names but ignores their declared source `node_type` constraints). One step deeper into the catalog, same shape of error. This is a regression of the kind both Round-1 reviewers were brought in to prevent and it must be fixed before Round 3 can be trusted to converge.

The rest of the new material (§3, §4) is constitutionally clean: the discovery-vs-amendment split is honored, the operational spec stays specification-only without smuggling amendment text, and the edge-class-handling claims in §4.3 are correctly grounded in the catalog rather than invented.

---

## Round 1 findings — addressed?

### R1-F1 [block] Phantom "Authority Rule 1" — **CLOSED**
- Round-2 explorer §Objective (line 22) replaces "Authority Rule 1" with the actual citation: §8 Directionality Principle text quoted verbatim + Appendix C Authoring Rule 1 quoted verbatim.
- Independent grep: `grep -c "Authority Rule" round-2/explorer.md` = 0. Cleanly stricken.
- Adequately addressed.

### R1-F2 [block] Edge-catalog count off (21 vs 22 vs 25) — **PARTIALLY CLOSED**
- Round-2 explorer §1 "What stays the same" (line 47), TD-3 (line 304), OQ-10 (line 323) all honestly surface the 21/22/25 inconsistency rather than picking a wrong number.
- The honest move is to *not* claim to preserve "the catalog" until a separate reconciliation node clears the residue, which the explorer does (D-3, line 286: "The catalog-count residue is a constitutional inconsistency that must be cleared independently (OQ-10), not by this proposal").
- This is the right disposition. R1-F2 is closed *as a self-honesty matter*; the residue itself survives as OQ-10 by design.

### R1-F3 [major] Promotion-path violation (§3 drafted constitutional text) — **CLOSED**
- Round-2 §3 (line 111–113) explicitly cites `discovery-structure-constitution.md` §6 and reframes every prior "drafted text" item as an "Amendment candidate" (AC-1 through AC-9).
- Each AC entry has a "Status: Candidate. Not drafted here." disclaimer.
- I audited §3 for sentences that read as drafted constitutional language (imperative voice, "shall", quoted block-text proposing a new sentence for the constitution). None found. The discovery-vs-amendment line is honored.
- Adequately addressed.

### R1-F4 [major] `retrofits` / `contradicts` / `subclass-of` edge-class handling — **CLOSED**
- Round-2 §4.3 "Edge-class handling" (lines 230–256) names all three:
  - `retrofits` forward-only-by-design, no inverse projection (line 234).
  - `contradicts` symmetric, dedup post-derivation, both authoring shapes legal (line 237).
  - `subclass-of` tree-constraint, post-derivation invariant check, violations are build errors (line 240).
- Each cites Appendix C correctly. (See "New findings" §N-4 below for the small correctness check.)
- Adequately addressed.

### R1-F5 [major] Silent edge-deletion at cutover — **ADDRESSED VIA AC-8**
- Round-2 §3 AC-8 "Cutover ordering" (line 161–164) names the cutover-correctness ordering: "the constitution amendment is gated on the migration pass having run at least once, to prevent the silent edge deletion R1 Finding 5 named."
- This converts R1's correctness-risk into an explicit ordering invariant, which is exactly the recommendation R1 made.
- OQ-9 (line 322) preserves the "who enforces the gate" question, which is the genuinely-open downstream question. Adequately addressed.

### R1-F6 [major] `inverse-edge-fix` mis-typed as `cites` — **ADDRESSED but with NEW DEFECT** (see N-1 below)
- Round-2 §Connections row (line 339) re-types from `cites` to `supersedes` with prose "Partial supersession" + AC-9.
- D-10 (line 296) and AC-9 (line 166–169) explicitly state the partial supersession.
- The re-typing direction is correct *as intent*. **But the chosen edge `supersedes` has catalog source/target constraints that the new row violates** — see New Finding N-1 below. R1's diagnosis is honored, but the fix introduces a catalog-shape error R1 did not catch because R1's recommendation was "re-type to `supersedes`" without auditing the cardinality and source/target columns.

### R1-F7 [minor] `node_type: discovery` → `research` — **CLOSED**
- Round-2 frontmatter line 4 is `node_type: research`. Explicitly cited in the "Frontmatter change vs Round 1" note (line 16).
- Adequately addressed.

### R1-F8 [minor] A-3 subset-rule slip — **CLOSED**
- Round-2 §2 "Why this is not 'just SQL-layer inference'" (lines 105–107) corrects the prior restatement, quotes the constitution's own articulation of A-3's rationale ("local readability" per `ontology-conventions.md` §8), and explicitly acknowledges the Round-1 narrowing as "self-serving" per R1-F8.
- Verbatim correction; honest self-citation. Adequately addressed.

### R1-F9 [minor] Frontmatter-ownership Rule 6 carve-out sourcing — **CLOSED**
- Round-2 §3 AC-6 (line 148–152) and §4.4 (line 263) both name `vault_common.frontmatter.carveouts` as the single-source for carve-out predicates, citing Rule 6 directly.
- "The pipeline consumes carve-out predicates from … not reimplement them" is the exact fix R1 recommended. Adequately addressed.

### R1-F10 [minor] OQ-1 silently re-opens closed question — **CLOSED**
- Round-2 D-8 (line 294) promotes OQ-1 into a binding decision: forward-only authoring; inverse-name titles are linter-rejected. Cites Appendix C Authoring Rule 1 directly.
- The decision converges with R2-F6 (per the cross-cite). OQ-1 deleted from the Open Questions list. Adequately addressed.

**Summary:** 9 of 10 R1 findings adequately closed; 1 (R1-F6) honored in intent but the fix itself introduces a new catalog-shape error (see N-1).

---

## New findings

### N-1 [block] §Connections row uses `supersedes` from a `research` source — catalog forbids it
- **Location:** Round-2 explorer line 339 (`## Connections` row toward `inverse-edge-fix.md`).
- **Claim:** The row declares `supersedes` from this research file (`node_type: research`) toward `inverse-edge-fix.md` (`node_type: discovery`).
- **Evidence:** `ontology-conventions.md` line 571: ``` `supersedes` | `superseded-by` | discovery, implementation-plan, constitution, spec | (same node_type) | 1:1 | A wholesale replaces B. B becomes historical. ```
  - **Source-type constraint:** allowed sources are `discovery, implementation-plan, constitution, spec`. **`research` is not an allowed source for `supersedes`.** The explorer's own frontmatter says `node_type: research` (line 4).
  - **Target-type constraint:** target must be `(same node_type)`. Source = `research`, target = `discovery`. Mismatch.
  - **Cardinality / semantics:** 1:1, "A *wholesale* replaces B. B becomes historical." Explorer is explicit (D-10, AC-9) that the supersession is **partial** — Tier 2 only; Tier 1 and Tier 3 unaffected. "Wholesale" is the exact word the catalog uses, and it is exactly the property the explorer disclaims.
- **Why this matters:** Round 1's `## Connections` problem was a name not in the catalog (`proposes-edit`). Round 2's is more sophisticated: it uses real catalog names while ignoring the catalog's declared source / target / cardinality columns. R1-F6 said "re-type to `supersedes`"; R2 did so but did not check whether `supersedes` even *admits* a `research`-typed source. This is a regression of the same shape: drift between the surface used to declare an edge and the catalog rule that governs the edge. The explorer is at this moment declaring an edge the catalog forbids — and is doing so in the very `## Connections` table that the proposal's own logic is meant to make mechanically impossible. The proposal's headline (single-source-of-truth via mechanical derivation) is being undercut by its own hand-authored table.
- **Recommendation for Round 3:** Pick one:
  - (a) Demote the row's edge type to `cites` and carry the partial-supersession claim in prose only (D-10 narrates it; the row need not encode it). Loses R1-F6's catalog-level correction but keeps the table catalog-shape-conformant.
  - (b) Drop the row entirely (it is a research file pointing into a discovery; the connection lives in D-10's narrative, not in the table).
  - (c) Surface this catalog violation as a NEW open question: "the catalog forbids `research →supersedes→ discovery` and forbids partial supersession; an amendment candidate is needed to extend `supersedes` source/target." This makes the catalog-level argument R1-F6 made even sharper — but it cannot be done by *also* shipping a non-conformant row. Pick the open question OR the row, not both.

### N-2 [block] §Connections row uses `supersedes` from `research` to another `research` (round-1 explorer)
- **Location:** Round-2 explorer line 344 (`## Connections` row toward `../round-1/explorer.md`).
- **Claim:** This row declares `supersedes` from the round-2 research file to the round-1 research file.
- **Evidence:** Same catalog row 571. Source must be `discovery, implementation-plan, constitution, spec` — `research` is not allowed. Target same restriction (and same-node_type allowed-set). Two `research` files cannot validly declare `supersedes` between themselves under the current catalog.
- **Why this matters:** Identical regression shape to N-1. Worse, this one cannot be defended by any "the catalog itself should expand to admit it" argument without a *separate* amendment candidate, because the cardinality is wholesale-1:1 — and the catalog reserves `supersedes` for cross-decision/cross-spec replacement, not for within-dispatch-revision (which is exactly what round-2 supersedes round-1 means here). `discovery-structure-constitution.md` §7 ("No revision in place. Refinements happen in new discoveries that `supersedes:` the original") is talking about discovery-level supersession; it does not authorize a `research`-typed dispatch to use `supersedes` for round-to-round revision within the same dispatch.
- **Recommendation for Round 3:** This is intra-dispatch versioning, not catalog-level supersession. Use `cites` (or no edge at all — the round-N relationship is encoded by folder structure, not by a typed edge). The "Closes Round-1 OQ-1 / OQ-3 / OQ-4 / OQ-6" narration in the description belongs in the body, not in a typed edge.

### N-3 [block] §Connections row uses `refines` from `research` toward `ontology-conventions.md` — catalog source forbids it
- **Location:** Round-2 explorer line 337 (`## Connections` row toward `ontology-conventions.md`).
- **Claim:** The row declares `refines` from this research (`node_type: research`) toward the constitution.
- **Evidence:** `ontology-conventions.md` line 577: ``` `refines` | `refined-by` | discovery, spec | discovery, spec, constitution | N:1 | A makes B more specific without replacing it. ``` — Source must be `discovery` or `spec`. **`research` is not an allowed source for `refines`.**
- **Why this matters:** Third instance of the same shape (N-1, N-2, N-3 are one bug repeated three times). The explorer's authoring-note (line 333) congratulates itself for being "catalog-conformant" after correcting Round 1's `proposes-edit` — but every one of the high-stakes rows in this newly-authored table is non-conformant at the source-type level. The vault is supposed to be catalog-policed *especially* on the artifacts that propose to change the catalog regime.
- **Recommendation for Round 3:** Either (a) demote to `cites` (and put the "refines §8" claim in the body where AC-1 already lives), or (b) note this as another open question: research-typed artifacts cannot currently `refines` constitutions; if research-artifacts-cannot-amend is correct, the table must use `cites`; if the constitution should be amended to admit `research →refines→ constitution`, raise it as a fresh AC. As with N-1, do not silently violate the catalog in the meantime.

### N-4 [minor] `contradicts` derivation rule §4.3 is *defensible* but the dedup choice does not address symmetry semantics
- **Location:** Round-2 explorer §4.3 (line 237), "Symmetric edges."
- **Claim:** "declared on either side is sufficient; the projection materializes the symmetric position on the other side; duplicate declarations … are deduplicated post-derivation to a single canonical pair."
- **Evidence:** Appendix C entry (line 572) says `contradicts` is symmetric — "both sides use the same name." The Authoring Rules section line 640 says: "**`contradicts` is special.** Both sides use the same name (it is symmetric). Both must still declare."
- **Why this matters:** The constitution's current rule is "both must still declare." The explorer relaxes this to "either side is sufficient; the other side is projected." That is a *real* posture change, not a derivation detail — it moves `contradicts` from "both-authored" into the projected-inverse regime that the rest of the proposal uses. This is fine *as a candidate*, but it is a constitutional change the explorer is making silently inside an operational spec rather than naming as another amendment candidate. Round 3 should either (a) lift this into a new AC-10 ("Authoring Rule 3 amendment — `contradicts` becomes derive-from-either-side"), or (b) restore the both-must-declare rule and have the derivation merely *validate* symmetric authoring rather than project it.

### N-5 [minor] OQ-10 acknowledged as load-bearing, but D-3 still asserts catalog-preserved
- **Location:** Round-2 D-3 line 286: "Preserve the Appendix C edge catalog … unchanged in name and directionality."; OQ-10 line 323: "the claim 'the catalog is preserved unchanged' (D-3) is unevaluable in the strict sense" until the 21/22/25 residue is cleared.
- **Why this matters:** D-3 asserts a property that OQ-10 admits is *unevaluable*. The subset rule says: if the proof (catalog state) cannot evaluate the claim ("preserved unchanged"), the claim must be demoted to "preserved in spirit, modulo OQ-10". The current text is one assertion (D-3) followed by one self-disclaimer (OQ-10); a Round-3 reader reading D-3 alone gets the inflated form. Demote D-3 explicitly, or move the disclaimer into D-3's text.

### N-6 [minor] D-9 (on-build) is constitutionally sound but the "reversible without constitutional change" claim needs a constitution citation
- **Location:** Round-2 §4.5 (line 268–276).
- **Why this matters:** The claim "the constitution names *what* derivation does, not *when* it runs" (line 276) is the load-bearing reason D-9 is reversible. It is also a claim *about* the constitution that has no citation. §8 of `ontology-conventions.md` says "no SQL-layer inference" — under on-build, the materialization happens before any SQL/render layer reads it, so D-9 does respect §8. But the explorer should cite this directly rather than asserting reversibility from author authority. (Minor; one sentence fix.)

---

## Regression check

### Regression-1: §Connections table — Round 2 *worse* than Round 1 at catalog-shape conformance
- Round 1's table used `proposes-edit`, which is not a catalog edge name. R1 caught this implicitly (Finding 2 attacked the count residue; R2-F10 in the synthesis caught the `proposes-edit` directly).
- Round 2's table uses three catalog names (`refines`, `supersedes`, `supersedes`) but ignores the source/target/cardinality columns the catalog declares for each. The error type shifted from "wrong name" to "right name, wrong shape."
- The authoring-note at line 333 explicitly congratulates itself for fixing Round 1's `proposes-edit`. That congratulation is premature — the new table is non-conformant at the deeper level the catalog actually polices.
- **This is the single most important regression and the main reason this review is not `accept` outright.**

### Regression-2: §4.3 silently changes `contradicts` authoring posture (N-4)
- Round 1 did not address `contradicts` derivation; Round 2 does (good) but in the process relaxes the current both-must-declare rule into projection-from-either-side. The change is silent (no AC, no OQ). Smaller regression than R1, but a real one. Round 3 must surface as an AC or restore the current rule.

### Otherwise: no regressions
- §3 promotion-path discipline is observed. §4 operational spec stays operational. Frontmatter corrected. Self-citations to upstream reviewers are honest. The amendment-text-by-stealth attack vector the prompt asked me to check produced no hits in §3 or §4.

---

## Strongest concern for Round 3

**N-1 / N-2 / N-3 — the §Connections table is non-conformant at the catalog source-type level.** This is one bug repeated three times in the single artifact whose entire thesis is "edge authoring must be catalog-mechanized." The proposal is currently arguing for mechanical edge enforcement *from a document whose own hand-authored edges violate the catalog*. That is exactly the credibility hole Round 1's `proposes-edit` error opened, and Round 2 has closed it on the surface (catalog names used) while reopening it underneath (catalog shape violated). Round 3 cannot ship the consolidated discovery if the discovery itself can't declare a single load-bearing edge that the catalog admits.

The fix is small: demote the three rows to `cites` (or drop them entirely; the relationships are already encoded in §3 / §5 prose), and either accept the resulting catalog-level under-specification or raise a fresh AC-10/AC-11 to extend `supersedes` / `refines` source-type sets to admit `research`. Pick one path; do not ship a table that depends on a catalog amendment that has not been proposed.

---

## What Round 2 got right

- **Promotion-path obedience in §3 is real.** Each AC names the constitutional surface, the posture change, and the consequence, then refuses to draft the actual amendment text. The discipline `discovery-structure-constitution.md` §6 demands is honored — no smuggled amendment-by-stealth.
- **§4 operational spec is exactly the artifact the synthesis demanded.** Concrete IO contract, edge-class handling, inverse-write discipline, on-write vs on-build with a binding-but-reversible decision. It stays *specification*, not amendment-text. The boundary is maintained.
- **D-7 is the honest pick on description-field semantics.** Picking option (a), naming the 40% information loss, *and* tracking option (c) as a bounded escape hatch (TD-6) is the right shape: commit to the headline-defending option, name what it costs, name the recovery path. No inflation.
- **Catalog-count residue handled honestly.** D-3 + TD-3 + OQ-10 together do not pretend the residue is closed; they declare D-3 conditional on OQ-10. (The only nit is N-5 — D-3's wording itself should carry the disclaimer.)
- **A-3 restatement (line 105–107) is the model of how to address a subset-rule slip.** Quotes the constitution verbatim, names the prior narrowing as self-serving, swaps in the actual rationale. This is what every R1 minor-finding fix should look like.
- **Frontmatter corrected to `research`** and the change explicitly cited in the new "Frontmatter change vs Round 1" note (line 16). No silent re-classification.
- **D-9 (on-build for v1) is a defensible Round-2 call** even with the small N-6 nit. It correctly identifies the reversibility window and aligns with the existing audit-then-sweep rhythm.
- **§4.2 inline-links-only syntax constraint is tight.** The forbidden-as-edge-form list (image links, reference-style, shortcut, autolinks, code-fenced, frontmatter-YAML, inside-`## Connections`) is exhaustive enough that the parser spec is locked. Edge-case catalog from R2 is absorbed correctly.
- **AC-9's partial-supersession framing is the right intent.** The bug is at the catalog-shape level (N-1), not at the conceptual level — the relationship Round 2 wants to name *is* partial supersession; the catalog just doesn't currently have an edge for it.

---

## Return summary

- **File path:** `/Users/victorboscaro/domainspec/vault/discovery/edges-enforcement-refactoring/research/round-2/reviewer-1.md`
- **Verdict:** `accept-with-revisions`
- **R1 findings closure:** 9 of 10 adequately closed; 1 (R1-F6) honored in intent but the fix opens a new catalog-shape defect (see N-1).
- **Top-2 new findings (one-liners):**
  - **N-1 [block]:** §Connections row 339 uses `supersedes` with source `research` and target `discovery`, partial semantics — the catalog allows `supersedes` only from `discovery/implementation-plan/constitution/spec`, requires same-node_type target, and defines it as **wholesale** replacement. The new table is non-conformant at the catalog-shape level (N-2 and N-3 are the same bug shape applied to two more rows).
  - **N-4 [minor]:** §4.3's `contradicts` derivation silently relaxes the constitution's current "both must still declare" rule (Appendix C Authoring Rule 3) into "either side is sufficient + project the other"; this is a posture change that belongs in a new AC, not buried inside an operational spec.
