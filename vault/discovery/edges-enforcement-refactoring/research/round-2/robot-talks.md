---
tags: [vault, ontology, edges, authoring, refactoring, robot-talks, synthesis]
node_type: research
is_session: false
layer: ontology
nature: synthesis
status: draft
version: 0.2.0
last_updated: 2026-05-30
---

# Robot-Talks (Round 2 Synthesis) — Edges Enforcement Refactoring

> Synthesis of two independent Round-2 reviews of `explorer.md` (v0.2.0). Both verdicts: `accept-with-revisions`. This file is bounded to what the reviewers wrote — no new attacks introduced. Where the synthesis judges the proposal must change shape (vs cosmetic revision), that judgment is surfaced in `## Survival check`.
>
> Constitution: `robot-talks-constitution.md`. PM-3 (synthesis is tension discovery, not aggregation) and PM-8 (every synthesis statement traceable to agent findings) govern. Each row cites reviewer + finding.

---

## Participants

| Reviewer | Attack vector | File | Verdict | Round-1 closure score |
|---|---|---|---|---|
| **Reviewer 1 (R2-R1)** | Constitutional coherence — does Round 2 close R1's blocks without opening new constitutional defects; does §3 honour the discovery→constitution promotion boundary; does the §Connections table itself obey the catalog the proposal claims to preserve? | `round-2/reviewer-1.md` | accept-with-revisions | 9/10 R1 findings closed; F6 honored in intent, fix introduces N-1 |
| **Reviewer 2 (R2-R2)** | Operational viability — does §4's IO contract survive contact with the corpus; does the marker convention pre-exist; is "enclosing sentence" defined for all link sites; does `contradicts` dedup specify a mechanism? | `round-2/reviewer-2.md` | accept-with-revisions | 10/10 surface; F4 partial, F7 partial; F10 opens NF-5 |

Coverage check: lanes are concern-non-overlapping (constitutional shape vs IO behaviour) but evidence-overlapping on three load-bearing surfaces: the §Connections table (R2-R1 N-1/N-2/N-3 vs R2-R2 NF-5), the `contradicts` posture (R2-R1 N-4 vs R2-R2 NF-3), and the `inverse-edge-fix` partial-supersession claim (R2-R1 R1-F6 audit vs R2-R2 NF-4). The convergence map below is driven by that overlap.

---

## Convergence map

Findings where both reviewers landed on the same load-bearing issue, from different angles.

| # | Issue | R2-R1 finding | R2-R2 finding | Why this convergence is load-bearing |
|---|---|---|---|---|
| **CV-1** | **The §Connections table is non-conformant with the very regime it argues for.** R2-R1 attacks at catalog source/target violations on this file's own rows; R2-R2 attacks at the catalog-residue (`proposes-edit`) the proposal claims to "preserve unchanged" while it persists in 6 vault files. | N-1, N-2, N-3 [block ×3] — `refines`/`supersedes` rows from a `research` source violate catalog source-type and (for `supersedes`) the "wholesale" semantics | NF-5 [major] — `proposes-edit` survives in 12 uses across 6 files including the constitution itself; first `vault-ctl edges derive` mechanically deletes them | Round 1's catalog defect was *the explorer's own row using `proposes-edit`*. Round 2 fixed that single row but: (R2-R1) made its replacement non-conformant at the source-type level, and (R2-R2) the original off-catalog name still lives in 11 other vault places. The proposal's headline is "edge authoring becomes catalog-mechanized"; the artifact itself cannot ship a catalog-conformant `## Connections` table, AND the corpus contains live edges the catalog forbids. Two reviewers from two lanes confirm: the catalog-state precondition the proposal asserts (D-3 "preserved unchanged") is false at multiple levels. |
| **CV-2** | **`contradicts` symmetric handling silently changes a constitutional rule without naming it as a candidate.** | N-4 [minor] — §4.3 relaxes Appendix C Authoring Rule 3 ("both must still declare") to "either side sufficient + project the other" inside an operational spec; should be lifted into a new AC or reverted | NF-3 [major] — the word "deduplicated" is asserted; the mechanism (which description wins, when projection runs, what canonical pair means) is unspecified | R2-R1 catches the *posture* problem (relaxing a constitutional rule inside §4 violates the §3-vs-§4 boundary the proposal otherwise honours); R2-R2 catches the *mechanism* problem (the dedup step is named but unspecified). Together: the §4.3 entry for `contradicts` is both constitutionally and operationally underspecified — it changes a rule it doesn't name as a candidate, AND it does so without defining what the new rule mechanically is. |
| **CV-3** | **The `inverse-edge-fix` partial-supersession claim is correct in intent but un-operationalized in catalog terms AND in sequencing terms.** | R1-F6 audit + N-1 — `supersedes` is the *right edge type* conceptually but the catalog forbids `research → supersedes → discovery` and forbids "partial" wholesale semantics; AC-9 partial framing needs catalog-level support | NF-4 [major] — "partial" is operationally undefined for in-flight Tier 1: the proposal does not state whether Tier 1 continues, pauses, or redirects to the marker-wrapped format | R2-R1: the catalog doesn't have an edge to encode "partial supersession" without amendment. R2-R2: the sequencing of partial supersession is not stated for in-flight work. Combined: AC-9 is asserting a relationship that (a) the catalog cannot type and (b) the operational plan cannot schedule. Both must close together. |
| **CV-4** | **D-3 "catalog preserved unchanged" is asserted in the headline but disclaimed in the body — the subset rule binds, the text inflates.** | N-5 [minor] — D-3 asserts a property OQ-10 admits is *unevaluable*; demote D-3's wording explicitly | Regression-1 — D-3's claim is "now *frozen* into the proposal"; Round 2 names the residue but doesn't demote the claim; subset-rule violation | Both reviewers, from different lanes, flag the same shape: the explorer Round-2 self-disclaimers (OQ-10, TD-3) do not modify the actual D-3 sentence — they sit beside it. A Round-3 reader of D-3 alone gets the inflated form. Per CLAUDE.md subset rule, the claim must be demoted *in D-3 itself*, not in a sibling open question. |

---

## Divergence map

Findings unique to one reviewer. Each annotated with why the other lane missed it.

### Unique to Reviewer 1 (constitutional lane)

| # | Finding | Why R2-R2 missed it |
|---|---|---|
| **DV1-1** | **N-1/N-2/N-3 catalog source/target violations on this file's own §Connections rows.** Three independent rows use catalog names whose declared source-type column excludes `research`. | R2-R2 audited *whether the row pointing to `inverse-edge-fix` had the right edge type* (NF-4 + R1-F7 closure) but did not cross-check the catalog row in `ontology-conventions.md` for source-type / target-type / cardinality compliance. R2-R2's lane is operational; R2-R1's audit-the-catalog-row-against-its-declared-columns is constitutional. |
| **DV1-2** | **N-6 D-9 reversibility claim lacks constitution citation.** "The constitution names *what* derivation does, not *when* it runs" is load-bearing for D-9's reversibility argument and has no cite. | One-sentence constitutional-cite hygiene; pure R2-R1 lane. |
| **DV1-3** | **Promotion-path-discipline audit (§3 reads as candidates, not as drafted constitutional text).** R2-R1 actively grepped §3 for sentences in imperative voice / "shall" / quoted block-text that would constitute amendment-by-stealth, and reports no hits. | R2-R2 noted §3's reframing as a positive but did not adversarially audit for amendment-text-by-stealth. The non-finding is itself a R2-R1 contribution: the line held. |

### Unique to Reviewer 2 (operational lane)

| # | Finding | Why R2-R1 missed it |
|---|---|---|
| **DV2-1** | **NF-1 [block] `<!-- BEGIN/END derived -->` marker convention is invented.** R2-R2 ran `rg '<!-- BEGIN' vault` and got zero hits outside this discovery. The convention does not pre-exist; the explorer treats it as established machinery. | R2-R1's lane is constitutional, not corpus-state-measurement. R2-R1 had no scope to grep for marker convention precedent. |
| **DV2-2** | **NF-2 [block] "Enclosing sentence" undefined for ~33 link sites.** Measured: 32 standalone list-item links + 1 header-link + 448 table-cell links. D-7 commits to "enclosing sentence" but does not specify what (a) returns when no sentence exists. | R2-R1 audited D-7 for whether it picked an option honestly (it did) and whether the constitutional surface was named (AC-4 names it). R2-R1 did not measure how many actual vault links the picked option leaves undefined. |
| **DV2-3** | **NF-6 [minor] Code-fenced-link parser-authority rule.** §4.2 says "hard skip" without naming whether the AST parser (mdast/remark) or a manual regex is authoritative on fence boundaries. | Pure parser-spec; R2-R1 lane stops at "the syntax constraint is named." |
| **DV2-4** | **Edge Case Catalog (~18 rows) updated with Round 2 outcomes** — adequacy graded per case. R2-R2 also flagged Round-1 carry-overs (title case-sensitivity, whitespace canonicalization) still unaddressed. | Operational-surface enumeration; R2-R1 doesn't keep this catalog. |
| **DV2-5** | **§4.5 D-9 on-build "matches existing rhythm" rationale is deferral, not solution.** The merge-conflict scenario R1-R2-F4 raised (two branches both regenerate the same sink's `## Connections`) is not addressed by on-build; it is deferred to "an on-write pre-commit hook can be added later." | R2-R1 evaluated D-9 for *constitutional* reversibility (passing with N-6 nit). The *operational* merge-conflict deferral is R2-R2-only. |

### Direct contradictions

**None.** Both reviewers issued `accept-with-revisions`. They converge on direction and on the four convergent findings; the divergences are non-overlapping concerns. The closest tension is severity ordering — R2-R1's strongest concern is CV-1 (catalog non-conformance of the artifact's own table); R2-R2's strongest concern is the NF-1 + NF-2 composition (the spec cannot run its first pass safely). Both are blocking; both must close together.

---

## Synergy / amplification

Where one finding makes another finding *worse*, or where two findings compose into a single bigger problem.

### SY-1: R2-R1 CV-1 (table non-conformance) + R2-R2 NF-5 (`proposes-edit` propagation) = the proposal cannot mechanize its own thesis

R2-R1 says the §Connections rows in *this very file* violate catalog source/target columns. R2-R2 says the off-catalog edge name `proposes-edit` lives in 11 other files including the constitution's own §8 prose. Stacked:

> The proposal claims "edge authoring becomes catalog-mechanized." But (a) its own hand-authored table cannot pass the mechanization it proposes, and (b) at first regeneration, the mechanization *would mechanically delete* 12 live edges that the corpus and constitution currently treat as canonical.

This is not a cosmetic defect. It surfaces that the catalog itself is in an inconsistent state the proposal asserts away (D-3) rather than confronts. Either the catalog must be reconciled first (OQ-10 promoted to blocker), or the proposal must add a pre-derivation reconciliation pass that names every off-catalog edge in the corpus with row counts before first derive run.

### SY-2: R2-R1 N-4 (`contradicts` posture change buried in §4) + R2-R2 NF-3 (`contradicts` dedup mechanism unspecified) = the symmetric edge needs its own AC

R2-R1: §4.3 silently relaxes the constitution's "both must still declare" rule. R2-R2: the dedup mechanism that would make the relaxation work is asserted, not specified. Combined:

> The §4.3 entry for `contradicts` does two things at once: it changes a constitutional rule it doesn't name as a candidate, AND it does so without defining the mechanism that would let the new rule work. Round 3 cannot just specify the dedup algorithm (closing NF-3) — that would close the operational hole while leaving the constitutional posture change unflagged. It cannot just lift the rule into an AC (closing N-4) — that would name the change while still not specifying what change. Both must move together: add AC-10 (or restore Authoring Rule 3) AND define the dedup mechanism.

This is the single clearest case where Round 3 must produce a *composite* fix, not two independent ones.

### SY-3: R2-R1 CV-3 (catalog can't type "partial supersession") + R2-R2 NF-4 (Tier 1 sequencing undefined) = AC-9 needs decomposition

R2-R1: the catalog allows `supersedes` only as 1:1 wholesale; "partial" is exactly what it disclaims. R2-R2: the in-flight Tier 1 work has no stated sequencing under "partial supersession." Stacked:

> AC-9's "partial supersession" framing is doing two jobs poorly: typing the relationship (which the catalog forbids) and scheduling the in-flight Tier 1 work (which the proposal doesn't address). Round 3 should decompose: (a) re-type the §Connections row to `cites` (and carry the partial-supersession claim in D-10 prose only — SY-1's recommendation also lands here), (b) raise an AC-11 for catalog-level "partial supersession" if the team wants the catalog to admit it, (c) issue a sequencing directive to `inverse-edge-fix` Tier 1 (continue / pause / redirect).

### SY-4: R2-R1 N-5 (D-3 wording inflated) + R2-R2 Regression-1 (D-3 claim now frozen) = D-3 must demote in its own sentence

Both reviewers independently flag that D-3 says "preserved unchanged" while OQ-10 admits this is unevaluable. The fix is one-sentence: D-3's text must carry the disclaimer, not delegate it to OQ-10. Per CLAUDE.md subset rule, the inflated headline is the violation; the sibling disclaimer does not cure it.

### SY-5: R2-R2 NF-1 (invented markers) + R2-R2 NF-2 (enclosing sentence undefined) = §4 cannot run its first pass

R2-R2's own composition (named in R2-R2's "strongest concern"). The marker convention is the precondition for idempotency; the enclosing-sentence rule is the precondition for description extraction. Without either, the first `vault-ctl edges derive` invocation is undefined behavior. R2-R2 frames this as the deeper Round-3 question: §4 is a specification of what the tool does, written without anyone yet trying to write the tool. The recommendation is prototype-first OR demote §4 from "spec" to "sketch."

### SY-6: SY-1 + SY-5 = the operational spec is currently spec-without-prototype, attacking a catalog that cannot validate its own artifacts

This is the synthesis-of-syntheses: R2-R1 says the catalog is broken at the artifact level; R2-R2 says the spec is broken at the implementation-readiness level. Both lanes converge on a single deeper claim: **the proposal has graduated from "good direction" to "needs at least one of [prototype contact / catalog reconciliation] before Round 3 can be evaluated against a coherent baseline."**

---

## Persisting dead metaphors

Round 1 robot-talks flagged 4 dead metaphors. Audit of whether Round 2 explorer addressed them.

### DM-1 — "Single-source-of-truth" as an unqualified good

**Round 1 flag:** Neither reviewer asked whether SoT is the right frame for *edges with descriptions*; option (c) was framed as defeat ("weakens the headline claim") not as legitimate decomposition.

**Round 2 explorer status:** D-7 explicitly accepts 40% information loss as "the cost of single-source-of-truth." TD-6 names option (c) as "a bounded escape hatch" — this is closer to legitimate-fallback framing than Round 1's "defeat" framing, but still positions decomposition as a recovery move, not as a *valid alternative shape*.

**Round 2 reviewer status:** Neither R2-R1 nor R2-R2 challenges the SoT frame directly. R2-R2 NF-3 (`contradicts` dedup) implicitly stresses it (the symmetric case is where SoT-for-edges-but-not-descriptions might be the *natural* shape), but neither reviewer names this.

**Verdict:** **PERSISTS.** Round 3 worth re-examining. The proposal is now *committed* to D-7 option (a); if Round 3 reviewers find the 40% loss is unsurvivable, the fallback to (c) is supposed to be a one-amendment cost — but no one has tested whether option (c) is actually a worse design *on its merits* vs option (a). The metaphor is preventing that test.

### DM-2 — "Drift" framed as drift between two surfaces

**Round 1 flag:** Both reviewers accepted the body-vs-table framing; neither asked whether the deeper problem is *the rate of authoring* (audit-then-sweep doesn't reward updating either surface). Inverting which surface is authoritative may just relocate where drift accumulates.

**Round 2 explorer status:** §1 "Why now" still frames the problem as "the table is far enough from the prose that authors edit one and forget the other." Mechanism: distance between surfaces. The authoring-rate question is not raised. D-9 (on-build) deferral of merge-conflict footprint (R2-R2 DV2-5) is the closest the proposal comes to admitting that *relocation* may not be *resolution*.

**Round 2 reviewer status:** Neither reviewer challenges this framing.

**Verdict:** **PERSISTS.** Round 3 worth re-examining; not a Round 3 blocker.

### DM-3 — The catalog itself as a fixed invariant

**Round 1 flag:** R1-F2 surfaced that the *count* is contested (21/22/25). The deeper question: does the catalog need to be reconciled before any proposal can claim to preserve it?

**Round 2 explorer status:** D-3 still asserts "preserved unchanged" while OQ-10 admits unevaluability. The proposal explicitly punts: "Not this proposal's job to fix." This is honest but it leaves the metaphor *as the load-bearing assumption*: that the catalog exists as a stable referent the proposal can refer to.

**Round 2 reviewer status:** Both reviewers attack from inside the metaphor (SY-1 above): R2-R1 demands the artifact obey the catalog; R2-R2 demands the proposal not delete edges the corpus treats as canonical. Neither asks the deeper question: *should the catalog be the load-bearing invariant at all, given that it doesn't agree with itself or with the corpus that uses it?*

**Verdict:** **PERSISTS AND IS NOW LOAD-BEARING.** SY-1 escalates this from "Round 3 worth re-examining" to "Round 3 must decide whether catalog reconciliation (OQ-10) is a precondition or a sibling concern." This is the strongest case for a survival-check exit (see below).

### DM-4 — "Pipeline" as a noun that already exists conceptually

**Round 1 flag:** R2-F4 hinted at this (on-write vs on-build are *different* pipelines); both reviewers treated it as a parameter, not a fork. Deeper question: is there one pipeline or three (write-time materialization, build-time validation, migration)?

**Round 2 explorer status:** §4.5 D-9 explicitly picks on-build over on-write — this is a *parameter* choice within the singular-pipeline frame. §4 throughout treats "the derivation pipeline" as one object. Migration is acknowledged as separate scope (D-6) — that is partial decomposition, but the validation pipeline is still conflated with the derivation pipeline.

**Round 2 reviewer status:** R2-R2 NF-1 (marker insertion is "a separate sub-tool") and R2-R2 §4.1 scoring ("cannot ship v0.1 without prototyping the marker-insertion sub-tool") implicitly fork the pipeline into derivation-proper + marker-bootstrap-sub-tool. But neither reviewer names this as a pipeline-decomposition question.

**Verdict:** **PARTIALLY ADDRESSED** (the migration / derivation split is acknowledged); **deeper decomposition (validation vs materialization vs bootstrap) still PERSISTS** as a Round 3 question.

**Summary:** 3 of 4 dead metaphors persist into Round 2; 1 partially addressed. **DM-3 (catalog as fixed invariant)** has graduated from "worth re-examining" to "load-bearing for the survival check" by virtue of CV-1 + SY-1.

---

## Revision agenda for Round 3 explorer (prioritized)

Numbered by load-bearingness. Each item: what to revise, why (reviewers cited), test of done.

### 1. Fix the §Connections table — pick one of three exits for each non-conformant row

- **What.** For each of the three rows R2-R1 N-1/N-2/N-3 flags:
  - Row → `ontology-conventions.md` typed `refines`: pick (a) demote to `cites`, OR (b) raise a new AC to extend `refines` source-type column to admit `research`.
  - Row → `inverse-edge-fix.md` typed `supersedes`: pick (a) demote to `cites` + carry partial-supersession claim in D-10 prose only, OR (b) drop the row, OR (c) raise an AC to extend `supersedes` to admit `research` source and "partial" semantics.
  - Row → `../round-1/explorer.md` typed `supersedes`: demote to `cites` or drop entirely (intra-dispatch revision is encoded by folder structure, not by a typed edge — R2-R1 N-2 is decisive here).
- **Why.** R2-R1 N-1/N-2/N-3 [block ×3]; CV-1; SY-1. The proposal cannot mechanize edges from an artifact whose own edges violate the catalog.
- **Test of done.** Each row's edge type satisfies the catalog's source-type / target-type / cardinality columns in `ontology-conventions.md` Appendix C, OR the row is paired with an explicit AC (and not shipped pending the AC). No row both violates the catalog AND lacks an AC justification.

### 2. Add a pre-derivation reconciliation pass for off-catalog edges OR add an AC to absorb `proposes-edit`

- **What.** Either (a) §4.1 IO contract gains a "reconciliation pass" step that surfaces all off-catalog edge names in the corpus with their row counts (12 for `proposes-edit`, 1 for `blocked-by`, etc.) **before** any derivation deletes them, OR (b) a new AC names `proposes-edit` as a candidate catalog addition (since the constitution itself uses it as an example, this may be a legitimate gap), OR (c) AC-8 cutover ordering is extended to gate also on off-catalog edge reconciliation.
- **Why.** R2-R2 NF-5 [major]; CV-1; SY-1. The proposal claims D-3 ("catalog preserved unchanged") while the corpus contains 12 live edges using `proposes-edit` and 1 using `blocked-by`, neither in Appendix C. At first derive, these are mechanically deleted with no recovery path.
- **Test of done.** §4.1 includes a step that names off-catalog edges before deleting them, OR §3 has an AC-N that proposes catalog extension for `proposes-edit` / `blocked-by`, OR AC-8 explicitly names off-catalog reconciliation as a cutover gate. (At least one of three must land; the silent-deletion failure mode must be either prevented or named as deliberate.)

### 3. Compose-fix `contradicts`: lift posture change to AC-10 AND specify dedup mechanism

- **What.** Two coordinated edits:
  - Add **AC-10**: "Appendix C Authoring Rule 3 amendment — `contradicts` becomes derive-from-either-side." Name the posture change explicitly.
  - Rewrite §4.3 `contradicts` entry to specify the mechanism: (i) projection step ordering (before or after parsing both files), (ii) which description wins on dedup (recommend: source-alphabetical canonical pair + first-occurrence description from the alphabetically-first source; OQ-2 closes), (iii) what happens to the discarded description (recommend: warning in derive-report.jsonl).
  - Alternative path: restore Authoring Rule 3 ("both must still declare") and have §4.3 *validate* symmetric authoring rather than project it; this closes both N-4 and NF-3 by reverting the relaxation.
- **Why.** R2-R1 N-4 [minor] + R2-R2 NF-3 [major]; CV-2; SY-2. The current §4.3 entry does two things badly: changes a rule without naming the change, and specifies a mechanism by asserting "deduplicated" as if it were the rule.
- **Test of done.** Either AC-10 exists with the posture change named and §4.3 specifies the dedup mechanism step-by-step, OR §4.3 reverts to "both must still declare" with validation-only behaviour. The silent-relaxation-inside-§4 anti-pattern must be removed either way.

### 4. Specify `<!-- BEGIN/END derived -->` marker convention OR demote §4.1's "between markers" to a candidate

- **What.** Three exits:
  - (a) Cite a markdown-convention prior art (Sphinx? mkdocs? Jekyll? — R2-R2 notes none known).
  - (b) Downgrade §4.1 from "between markers" (load-bearing for D-2 "never hand-edited") to a candidate option; treat marker insertion as part of migration debt.
  - (c) Commit to inserting markers as part of Tier 1 sink bootstrapping (sequencing with `inverse-edge-fix` Tier 1 — closes OQ-11 with NF-4 by composition).
- **Why.** R2-R2 NF-1 [block]; SY-5; DM-4 (pipeline decomposition). The marker convention is invented; the proposal presents it as established machinery; idempotency depends on it.
- **Test of done.** §4.1 either cites prior art for the marker convention, OR labels markers as a v1 candidate (not a commitment), OR ships marker insertion as part of a named bootstrap step. The "tool inserts them" hand-wave at §4.4 is replaced with a specific insertion rule.

### 5. Extend D-7 with a fallback for ~33 link sites that have no enclosing sentence

- **What.** Add a tie-breaker to D-7: when no enclosing sentence exists, the description is (a) empty + warning, (b) the link text, or (c) the parent block's first sentence (list-item parent paragraph, table caption). Pick one. Alternative: admit standalone-bullet edges and table-cell edges are out of scope for v1 and document the scope cut.
- **Why.** R2-R2 NF-2 [block]; SY-5. 32 standalone list-item links + 1 header-link + 448 table-cell links have no defined extraction behavior under D-7.
- **Test of done.** D-7 contains a tie-breaker rule that returns a defined value for every link site in the corpus, OR D-7 explicitly excludes these site classes from v1 with a TD entry tracking them.

### 6. Decompose AC-9: re-type the row, raise AC for catalog-level "partial supersession", issue Tier 1 sequencing directive

- **What.** Three coordinated edits per SY-3:
  - Re-type the §Connections row to `cites` (covered by agenda item 1).
  - Raise **AC-11**: "Catalog amendment to admit partial supersession" if the team wants the catalog to encode this relationship.
  - Issue a concrete sequencing directive in §3 AC-9 (or a new AC) to `inverse-edge-fix` Tier 1: continue / pause / redirect to marker-wrapped bootstrap.
- **Why.** R2-R1 R1-F6 audit + N-1 + R2-R2 NF-4 [major]; CV-3; SY-3.
- **Test of done.** §Connections row to `inverse-edge-fix` is `cites` (or dropped); AC-11 exists if catalog amendment is desired; AC-9 (or replacement) names whether Tier 1 continues, pauses, or redirects.

### 7. Demote D-3 wording in its own sentence

- **What.** Rewrite D-3 from "Preserve the Appendix C edge catalog … unchanged in name and directionality" to something like "Preserve the Appendix C edge catalog as-cataloged-modulo-OQ-10; the 21/22/25 count residue is unevaluable until OQ-10 closes, and D-3's claim is conditional on that closure." (Or move the disclaimer into D-3's text.)
- **Why.** R2-R1 N-5 [minor] + R2-R2 Regression-1; CV-4; SY-4; CLAUDE.md subset rule.
- **Test of done.** D-3's text contains the conditional / disclaimer inline. A reader of D-3 alone does not get the inflated form.

### 8. Cite the constitution for D-9's reversibility claim

- **What.** Add a one-sentence cite to §4.5 / D-9: `ontology-conventions.md` §8's "no SQL-layer inference" rule is satisfied under on-build because materialization happens before SQL/render-layer read. This is what makes D-9 constitution-independent and reversible.
- **Why.** R2-R1 N-6 [minor]; DV1-2.
- **Test of done.** §4.5 (or D-9 in §5) cites the specific constitutional surface that grounds the reversibility claim.

### 9. Name AST authority for code-fence detection

- **What.** §4.2 adds one sentence: the AST parser (mdast/remark) is the authority on fence boundaries; manual regex parsing is forbidden.
- **Why.** R2-R2 NF-6 [minor]; DV2-3.
- **Test of done.** §4.2 names AST parser authority.

### 10. Either prototype on 5 vault files OR demote §4 from "spec" to "sketch"

- **What.** R2-R2's deeper Round-3 recommendation: §4 is a spec written without prototype contact. Two exits:
  - (a) Ship a 50-line prototype that runs on 5 vault files (chosen to cover NF-1 marker insertion, NF-2 standalone-bullet links, NF-3 contradicts dedup, NF-4 in-flight Tier 1, NF-5 off-catalog edges). Let the prototype surface what §4 forgot. Promote §4 to spec only after.
  - (b) Demote §4 from "Operational spec" to "Operational sketch" in the heading; accept that implementation will produce the real spec; the §4 content survives but the title commitment doesn't.
- **Why.** R2-R2 strongest concern / SY-5 / SY-6. Specifications written without prototype contact accumulate the kind of "obvious in retrospect" gaps NF-1 through NF-4 are. R2-R2 is explicit that §4 is "concrete enough to attack but not concrete enough to implement."
- **Test of done.** Either a prototype exists with a report of what §4 forgot, OR §4's heading reads "Operational sketch" with §5's D-9 explicitly marked as a sketch-level commitment.

---

## Items NOT to revise

Things reviewers raised that the synthesis judges adequate, out-of-scope for Round 3, or where further revision would be over-engineering.

- **§3 reframing from drafts to candidates** (R2-R1 R1-F3 closure + DV1-3 audit). R2-R1 actively audited §3 for amendment-text-by-stealth and reports no hits. Keep.
- **D-7's choice of option (a) and the 40% information loss naming** (R2-R1 "what Round 2 got right" + R2-R2 R1-R2-F1 closure). Both reviewers endorse the *honesty* of the choice. The choice itself is defended; only the fallback (item 5 above) needs work.
- **D-8 forward-only authoring** (R2-R1 R1-F10 closure + R2-R2 R1-R2-F6 closure). Both reviewers endorse. Keep.
- **D-9 on-build for v1** (R2-R1 "what Round 2 got right" + R2-R2 §4.5 scoring "implementable now"). The *decision* is correct; the merge-conflict deferral (DV2-5) is a documented v1 limit, not a Round-3 revision item. Keep the decision; item 8 above adds the constitutional cite.
- **§4.2 syntax forbidlist** (R2-R1 "what Round 2 got right" + R2-R2 §4.2 scoring "implementable now"). Both reviewers' single strongest endorsement. Keep verbatim; item 9 above adds the AST authority sentence.
- **AC-3 a11y acknowledgment** (R2-R1 R1-F2 closure via cross-cite + R2-R2 R1-R2-F2 closure). Both reviewers endorse the explicit naming. Keep.
- **AC-6 carve-out predicate sourcing from `vault_common.frontmatter.carveouts`** (R2-R1 R1-F9 closure + R2-R2 §4.4 scoring "cleanest part"). Keep.
- **§Connections authoring-note** ("Per the proposal's own logic this would be derived. It isn't (TD-2)"). R2-R1 implicitly approves; R2-R2 reproduces the same disclaimer pattern on its own reviewer file. Keep.
- **Frontmatter `node_type: research`** (R2-R1 R1-F7 closure + R2-R2 closure note). Honest re-classification. Keep.

---

## Survival check

Can the proposal survive into Round 3, or is some demotion the right exit?

### The case for "proceed to Round 3" (revision-only)

Both reviewers issued `accept-with-revisions`, not `reject`. Round 2 substantively closed Round 1's load-bearing items: D-7 picked, §3 reframed, §4 added, frontmatter fixed, A-3 corrected, OQ-1 promoted to D-8, supersedes-not-cites named. The block findings in Round 2 (R2-R1 N-1/N-2/N-3; R2-R2 NF-1, NF-2) are local: the table can be re-typed in one paragraph; the marker convention can be cited or demoted; the enclosing-sentence rule can be extended. None require restructuring the proposal's thesis.

### The case for "demote §4 from spec to sketch" (R2-R2's suggestion)

R2-R2's strongest concern is explicit: §4 is "concrete enough to attack but not concrete enough to implement." NF-1 + NF-2 compose into "the proposal cannot run its first `vault-ctl edges derive` pass safely." Three of R2-R2's six new findings (NF-1, NF-2, NF-3) are gaps that prototype contact would have surfaced. R2-R2's deeper recommendation: ship a 50-line prototype on 5 vault files OR demote §4's heading to "sketch."

The honest reading: §4's content survives the demotion — what changes is the *commitment level*. The §3 candidates remain candidates; the §5 decisions D-1 through D-10 remain decisions; only §4's claim to be a *specification* (rather than a *sketch toward a specification*) is what cannot be defended. **This is a one-word edit in the §4 heading + an honest paragraph at §4's opening admitting prototype contact has not happened.** It is not a rejection; it is the subset rule applied at the artifact-level commitment.

### The case for "catalog reconciliation must happen first" (CV-1 + SY-1 + DM-3 escalation)

The deeper survival question is whether catalog reconciliation (OQ-10) is a Round-3 sibling concern or a Round-3 precondition. CV-1 says the artifact itself can't conform; SY-1 says the corpus contains 12 live edges the catalog forbids; DM-3 says the catalog itself doesn't agree with itself or with the corpus that uses it. **The proposal cannot defensibly claim D-3 ("catalog preserved unchanged") until the catalog stops being three different things at once.** This is not a Round-3-explorer revision; it is an upstream gate.

There is a defensible Round-3 form that handles this without rejecting: D-3 demotes (item 7 above), OQ-10 promotes from "downstream blocker" to "this proposal's blocker" with a named sibling node (catalog-reconciliation) that must close before this proposal can promote to discovery. The proposal survives; its dependencies become explicit.

### Survival check verdict

**Proceed to Round 3 with two structural demotions, not just revisions:**

1. **§4 heading: "Operational spec" → "Operational sketch"** (R2-R2 explicit suggestion). Content survives; commitment-level honest.
2. **OQ-10: "Not this proposal's job to fix" → "This proposal's blocker; sibling catalog-reconciliation node must close before promotion to discovery."** D-3 wording demoted to match (item 7).

The revision agenda (items 1–10 above) is then executable on Round 3 against a coherent baseline. Without these two demotions, Round 3 reviewers will land on the same CV-1 / SY-6 composition the synthesis identifies here, and the loop does not converge.

**Outcome:** `proceed` — but with the §4-as-sketch demotion and the OQ-10-as-blocker promotion treated as Round-3 preconditions, not as Round-3 revisions. The proposal is viable; its self-assessment is what needs to demote.

---

## Synthesized verdict for Round 3

**Round-2 explorer's direction holds; its commitments have outgrown its evidence. Round 3 must: (a) fix the §Connections table — the artifact cannot mechanize edges from a document whose own edges violate the catalog; (b) name the off-catalog edge propagation (`proposes-edit` in 6 files including the constitution) as either a pre-derivation reconciliation step or a candidate catalog extension — silent mechanical deletion at first derive is not acceptable; (c) compose-fix `contradicts` — lift the posture change to AC-10 AND specify the dedup mechanism, not one without the other; (d) demote §4's heading from "spec" to "sketch" and promote OQ-10 from sibling concern to this proposal's blocker. The proposal survives the round, but only if Round 3 is honest that the catalog it claims to preserve is in an inconsistent state the proposal does not own, and that §4 is a sketch written without prototype contact. Three of the four dead metaphors Round 1 flagged persist into Round 2; one — the catalog as fixed invariant — has become load-bearing via CV-1 and must be confronted in Round 3, not deferred again.**

---

## Connections

> Per the proposal's own logic this would be derived. It isn't (TD-2). Hand-authored in legacy form, with the catalog source-type constraint R2-R1 N-1/N-2/N-3 surfaced honored: rows from this `research` file use only `cites` (where the catalog admits `research` as source), avoiding the `refines` / `supersedes` violations Round-2 explorer's table committed.

| Document | Type | Description |
|----------|------|-------------|
| [explorer.md](explorer.md) | `cites` | Round-2 explorer being synthesized. Both R2 reviewers accept-with-revisions; 9–10 of 10 Round-1 findings closed; six new Round-2-specific findings (R2-R1 N-1/2/3/4/5/6; R2-R2 NF-1/2/3/4/5/6) must close in Round 3, with two structural demotions (§4 → sketch; OQ-10 → blocker) treated as preconditions. Inverse `cited-by` to be added at promotion. |
| [reviewer-1.md](reviewer-1.md) | `cites` | Constitutional-coherence Round-2 review whose Findings N-1, N-2, N-3 drive CV-1 / SY-1; N-4 drives CV-2 / SY-2; N-5 drives CV-4 / SY-4. Inverse `cited-by` to be added at promotion. |
| [reviewer-2.md](reviewer-2.md) | `cites` | Operational-viability Round-2 review whose Findings NF-1, NF-2 drive SY-5; NF-3 drives CV-2 / SY-2; NF-4 drives CV-3 / SY-3; NF-5 drives CV-1 / SY-1. R2-R2's "demote §4 to sketch" recommendation drives the survival-check outcome. Inverse `cited-by` to be added at promotion. |
| [../round-1/robot-talks.md](../round-1/robot-talks.md) | `cites` | Round-1 synthesis whose 4 dead metaphors (DM-1 SoT, DM-2 drift framing, DM-3 catalog-as-invariant, DM-4 pipeline-as-singular) are audited here: 3 persist, 1 partially addressed; DM-3 has graduated to load-bearing via CV-1. Inverse `cited-by` to be added at promotion. |
