---
tags: [vault, ontology, edges, authoring, review, coherence-check, round-3]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-30
---

# Reviewer 1 (Round 3, FINAL) — Constitutional Coherence

> Independent skeptic pass on `explorer.md` (Round 3), scoped to constitutional coherence. Authored without reading `reviewer-2.md` for this round. R2-R1 findings and R2 robot-talks agenda items audited for closure; R3 new surfaces (§8 Reframings, §9 Blocking Dependencies, AC-10, AC-N, AC-11, AC-9-bis, D-7 fallback chain, D-11) audited for fresh defects.

---

## Verdict

**accept-as-final** — with one residual concern the writer must NOT paper over (see "Strongest residual concern" below). Round 3 closes the load-bearing R2-R1 block (N-1/N-2/N-3 demoted, catalog-shape verified), executes the two structural demotions R2 robot-talks demanded (§4 → sketch, OQ-10 → §9 blocker), composes AC-10 + §4.3 mechanism per SY-2, and adds AC-N + §9 as the explicit form of the catalog-reconciliation gate. The §Connections table now declares only edges the catalog admits (`cites` for `any→any`), with one knowing exception (`governed-by`) flagged and routed to §9 B-1 sub-item 3 — that exception is the residual concern, but it is *declared*, not smuggled.

Substantively the discovery has reached the shape a writer can compose from. The remaining work is composition discipline (preserve the demotion language, do not re-inflate D-3, do not silently fix the `governed-by` exception), not new research.

---

## R2 findings closure check

### R2-R1 N-1 [block] §Connections row `supersedes` from `research → discovery` — **CLOSED**
- Round-3 explorer line 433 (`## Connections` row → `inverse-edge-fix.md`): edge type is now `cites`. Catalog (line 616) admits `cites` with source `any`, target `any` — conforming.
- Partial-supersession claim carried in D-10 prose (line 305) and AC-11 as conditional candidate (line 175–179). Catalog-extension path is *surfaced, not adopted*, which is exactly what N-1 recommended path (c) plus path (a) combined.
- Closure citation: §Connections authoring-note line 427 explicitly cites N-1.

### R2-R1 N-2 [block] §Connections row `supersedes` round-2 → round-1 — **CLOSED**
- Round-3 explorer line 438 (`## Connections` row → `../round-2/explorer.md`): edge type is `cites`. Authoring-note explicitly says "Replaces Round-2's `supersedes` self-reference per `../round-2/reviewer-1.md` N-2 (intra-dispatch round-to-round revision is encoded by folder structure, not by a typed edge…)". This is verbatim adoption of N-2's recommendation.
- Same disposition (line 442 → round-1 explorer) — same `cites`, same reasoning cited.

### R2-R1 N-3 [block] §Connections row `refines` from `research → ontology-conventions.md` — **CLOSED**
- Round-3 explorer line 431 (row → `ontology-conventions.md`): edge type is `cites`. Authoring-note: "Demoted from Round-2 `refines` per `../round-2/reviewer-1.md` N-3 (catalog source-type for `refines` excludes `research`)."
- Catalog cross-check: line 577 confirms `refines` source ∈ {`discovery`, `spec`}; `research` excluded. Demotion to `cites` (source `any`) is conformant.

### R2-R1 N-4 [minor] `contradicts` posture change buried in §4 — **CLOSED**
- AC-10 (lines 167–173) lifts the posture change explicitly. Names the rule being changed (line 640 of `ontology-conventions.md`, "both must still declare"), the new posture ("declaration on either side is sufficient"), and explicitly cites the §3-vs-§4 boundary the lift respects.
- §4.3 (lines 250–260) now specifies the mechanism step-by-step (canonical pair via lex order on path; first-source description wins; discarded description logged). This composes correctly with AC-10 per SY-2.
- Alternative path (restore + validate-only) explicitly considered and rejected with stated reasoning. Per CLAUDE.md candor expectation, the rejection is reasoned, not handwaved.

### R2-R1 N-5 [minor] D-3 still asserts catalog-preserved — **CLOSED**
- D-3 (line 286) now reads: "Preserve the Appendix C edge catalog as-cataloged, modulo §9. Demoted this round: the 21/22/25 count residue and the off-catalog `proposes-edit`/`blocked-by` propagation make 'preserved unchanged' unevaluable in the strict sense. D-3's commitment is conditional on §9 catalog-reconciliation closure."
- The disclaimer is inline in D-3 itself; a reader of D-3 alone now gets the demoted form. Exactly N-5's ask.

### R2-R1 N-6 [minor] D-9 reversibility claim needs constitutional citation — **CLOSED**
- §4.5 (line 276): "the 'constitution names *what* derivation does, not *when* it runs' claim is grounded in `ontology-conventions.md` §8's 'no SQL-layer inference' — under on-build, materialization happens *before* any SQL/render-layer reads the corpus, so D-9 respects §8 as-currently-written."
- Specific constitutional surface named. Closure adequate.

**Summary:** 6 of 6 R2-R1 findings adequately closed.

### R2 robot-talks agenda items — closure status

| Item | Disposition |
|---|---|
| 1. Fix §Connections table | CLOSED (N-1/N-2/N-3 above) |
| 2. Pre-derivation reconciliation OR absorb `proposes-edit` | CLOSED — AC-N raises absorption (route b) conditional on §9; §4.1 failure mode includes off-catalog handling caveat (line 231) |
| 3. Compose-fix `contradicts` (AC-10 + dedup mechanism) | CLOSED — AC-10 + §4.3 (above) |
| 4. Marker convention | CLOSED as DEMOTED — TD-11 names the debt; OQ-14 surfaces the question; §4.1 (line 220–225) lists three exits and explicitly does not pick. Demotion is honest. |
| 5. D-7 fallback for ~33 link sites | CLOSED — 5-element fallback chain (lines 290–297) |
| 6. Decompose AC-9 (re-type + AC-11 + Tier 1 directive) | CLOSED — AC-9 + AC-9-bis + AC-11 (lines 156–179) |
| 7. Demote D-3 wording | CLOSED (N-5 above) |
| 8. Cite constitution for D-9 reversibility | CLOSED (N-6 above) |
| 9. AST authority for fence detection | CLOSED — §4.2 line 244 |
| 10. Prototype OR demote §4 | CLOSED as DEMOTED — §4 heading is "Operational sketch"; opening honesty admission line 205. B-2 (line 413–421) tracks prototype as recommended-not-blocking with named escalation rule. |

**Summary:** 10 of 10 agenda items addressed.

---

## New R3 findings

### N3-1 [minor] §Connections `governed-by` row knowingly violates catalog source-type, with explicit declared exception
- **Location:** Round-3 explorer line 437 (`## Connections` row → `discovery-structure-constitution.md`, type `governed-by`).
- **Evidence:** Catalog line 578: `governed-by` source ∈ {`discovery`, `implementation-plan`, `spec`} — `research` excluded.
- **The explorer's defense (line 437):** "this `research`-typed node is technically not in the listed source set; raised as sub-item of §9 B-1 sub-item 3 (source-type column completeness). For Round 3 we accept the catalog gap rather than demote to `cites`, because `governed-by` carries semantically-load-bearing constitutional binding that `cites` does not encode, and §9 B-1 is the natural place to surface the gap."
- **Why this is N3-1 [minor] not [block]:** The explorer is *explicit* about the violation. It is named, routed to §9 B-1 sub-item 3, and the reasoning for accepting the gap (rather than demoting) is stated. This is exactly the discipline N-1/N-2/N-3 demanded (route c — surface as candidate rather than silently ship). The explorer is doing in R3 what it failed to do in R2.
- **The reason for the [minor] severity rather than no-finding:** the same proposal at R2 took the same shape ("we want this typed even though catalog forbids it") and was correctly judged a block then. The defense is consistent — load-bearing semantics that `cites` cannot encode — but the precedent is that R2 reviewers said "don't ship the row." R3's choice is "ship the row + name it as a §9 item." Defensible but borderline.
- **Recommendation for the writer:** preserve the §9 B-1 sub-item 3 routing. If composing the canonical `discovery.md`, do NOT silently demote `governed-by` to `cites` (that would lose the gap-flagging) and do NOT silently delete the explanatory text on the row. The exception is *load-bearing for the §9 argument that the catalog is internally inconsistent*.

### N3-2 [minor] AC-N conditional on §9 is a real conditional, not a punt — but the precondition that resolves it is well-formed
- **Location:** AC-N (lines 181–189) — picked route (b) Absorb, "conditional on §9 catalog-reconciliation node deciding the same."
- **Attack vector from prompt:** "is 'conditional on §9' a legitimate framing or a punt? What is the precondition that resolves the condition?"
- **The condition:** AC-N picks (b) absorb; §9 B-1 sub-item 2 explicitly names the same decision ("route (a) reject and rewrite all uses OR route (b) absorb into Appendix C"). AC-N is withdrawn if §9 picks (a). OQ-13 (line 337) surfaces this explicitly.
- **Test of well-formedness:** the precondition is "sibling catalog-reconciliation node (B-1) chooses route a or route b." That is a concrete decision a future node can make in one of two named ways. It is not "wait until things become clearer" — it is "this candidate is contingent on a named decision by a named sibling node."
- **Verdict:** legitimate conditional. The precondition is well-formed and concretely resolvable. Not a punt.

### N3-3 [minor] AC-9-bis is well-formed but its "conjecture not commitment" framing is the weakest sentence in §3
- **Location:** AC-9-bis (lines 161–166).
- **Concern:** The framing "Conjecture, not commitment; awaits §9 closure" is honest but leaves the in-flight Tier 1 work — which the proposal acknowledges is *concurrently happening* — under no actionable guidance. The two routes (continue with idempotency-marker format vs pause pending §9) are both named, but the proposal does not commit. OQ-16 explicitly surfaces this as Round-3 attack surface.
- **Why this isn't [block]:** AC-9-bis's job is to surface the decision-dependency, not to make the decision. The decision belongs to `inverse-edge-fix` Tier 1's owner, not to this discovery. The split is correct constitutionally: this discovery does not own Tier 1's schedule.
- **Recommendation for writer:** preserve the conjecture-not-commitment framing. If composing the canonical discovery, do NOT promote AC-9-bis to a binding directive — the proposal does not have the authority to direct Tier 1.

### N3-4 [minor] D-7 fallback chain introduces ordering-from-context but not implicit-type-from-context — constitution-clean
- **Location:** D-7 (lines 290–297), 5-element fallback chain.
- **Attack vector from prompt:** "Does it create new constitutional issues (e.g. introducing implicit edge-type-from-context that contradicts the explicit-type principle)?"
- **Analysis:** The chain governs *description-field extraction*, not *edge-type derivation*. The edge type is always explicit in the `title` attribute (D-1, D-8). What the chain picks from context is the *description* (a prose annotation on a row), not the edge's semantic content. Per the constitution's §8, the edge type itself remains explicit; only the description (which the catalog does not constrain) is derived contextually.
- **Verdict:** no constitutional issue. The fallback chain is an extraction policy for a row's *description column*, which the catalog does not police.
- **Minor caveat:** element 4 (table-cell first-cell content as description) could in pathological cases produce descriptions that *look like* edge-type names (e.g., first-cell of a table is the word "validates"). The chain extracts this as prose description, but a future reader might misread. This is a TD-12 / OQ-15 concern, not a constitutional defect. Out of scope for this finding.

### N3-5 [minor] §8 R-3 explicitly graduates DM-3 to load-bearing — verify R3 substance actually changed
- **Location:** §8 R-3 (lines 366–374).
- **Concern:** R-3 is the load-bearing reframing of the round (per the closing line "This is the load-bearing reframing of Round 3"). It must do real work, not just NAME the reframing.
- **Body changes verifying the reframe:** D-3 demoted with the disclaimer inline (line 286). AC-N raises the absorption decision (lines 181–189). AC-8 cutover ordering extended to gate also on §9 closure (line 152). §9 B-1 added as explicit blocker (lines 396–411). AC-11 raised as conditional catalog-extension candidate (lines 175–179).
- **Verdict:** R-3 binds. The reframe is operationalized through D-3 demotion + §9 B-1 + AC-N + AC-8 extension + AC-11. This is the dead-metaphor-killed case (see "Dead metaphor verification" below).

---

## Dead metaphor verification

For §8 R-1 through R-4: did the metaphor actually die (body changed) or was it just named?

### R-1 ("SoT is not unqualified good for edges with descriptions") — **NAMED, partially bound**
- Body change verification: D-7 (line 297) explicitly admits "The 40% information-loss commitment … is unchanged from Round 2." TD-6 carries option (c) as bounded escape hatch (line 317). The proposal does NOT change its picked option (a still wins for v1).
- The reframe's *operational consequence* (line 356): "the *reason* to prefer (a) is 'lower amendment cost for v1,' not 'SoT is intrinsically better.'" This is a reasoning shift, not a decision change. The body's D-7 text does not carry this reasoning shift inline.
- **Verdict:** **NAMED, NOT FULLY KILLED.** The metaphor is correctly diagnosed and a future-pivot path is articulated, but the D-7 picked-option-rationale was not rewritten to reflect "lower amendment cost" framing rather than "SoT is right." Writer should consider whether D-7's commitment-language needs a one-sentence update to reflect R-1 — but this is sketch-territory, not block-territory.

### R-2 ("drift = authoring-rate, not surface-distance") — **NAMED, partially bound**
- Body change verification: §1 "Why now" (lines 32–36) was updated to say "the deeper cause — surfaced explicitly in §8 Reframing R-2 — is *authoring rate* … Inverting authority moves the symptom; it does not on its own change the rate. This proposal acknowledges that limit; see R-2." The original surface-distance framing remains as proximate cause, but the deeper-cause reframing is now in the §1 text, not just in §8.
- The claim shift (line 364): "from 'this eliminates drift' to 'this localizes drift to a single surface where mechanical enforcement … can act on it.'" Verify in body: §1 has the explicit acknowledgement; the headline of the proposal (Objective, §1) is no longer "eliminates drift" — it is "inverts authoring authority."
- **Verdict:** **KILLED.** R-2's reframing has bound into §1 body text. The metaphor changed not just in §8 but in the load-bearing intro.

### R-3 ("catalog is not fixed invariant; reconcile first") — **KILLED**
- Body change verification: D-3 demoted inline (line 286). §9 B-1 added with three concrete sub-items (lines 396–409). AC-N + AC-11 + AC-8-extension all bind to this reframe. OQ-10 promoted to §9 (line 334).
- **Verdict:** **KILLED, LOAD-BEARING.** This is the clearest dead-metaphor killing of the round. The reframe is operationalized across §3 (AC-N, AC-11, AC-8), §5 (D-3 demotion), §7 (OQ-10 promoted), and §9 (B-1 with concrete sub-items). The metaphor "catalog as fixed background" cannot survive contact with this body.

### R-4 ("pipeline is not singular — materialization + validation + bootstrap") — **NAMED, NOT KILLED**
- Body change verification: §4 still describes "the derivation pipeline" as a singular object. §4.1 IO contract names the materialization tool. §4.3 step 5 says "Acyclicity / triangle / self-loop invariants run after projection" — validation is a step in materialization, not a separately-scoped pipeline. Bootstrap is acknowledged in §4.4 as "marker insertion" but treated as either deferred-to-migration or sequenced-with-Tier-1, not as its own pipeline.
- The reframe's operational consequence (line 387): "§4.5's D-9 may be over-committing because it picks one timing for three things." This attack vector is *raised* in §8 R-4 but not *executed* — D-9 (line 304) still picks "on-build for v1" as a single decision.
- **Verdict:** **NAMED, NOT KILLED.** R-4 is a confessional that does not bind into §4. The body of §4 still treats the pipeline as singular. The metaphor persists in the operational sections even though it is correctly diagnosed in §8.
- **Recommendation for writer:** flag R-4 as un-bound dead metaphor in the writer's notes. The writer can either (a) accept this — R-4 is honestly named even if not fixed, which is itself progress — or (b) decompose D-9 into D-9a (materialization timing), D-9b (validation timing), D-9c (bootstrap timing). The latter is new research, out of scope for the writer.

**Dead metaphors killed: 2 (R-2, R-3). Named-but-not-killed: 2 (R-1, R-4).**

The R-3 killing is the load-bearing one. R-1 and R-4 are partial; R-2 is bound into §1 body. This is honest accounting.

---

## Subset rule final pass

Scanning for any claim that overshoots what the discovery proves or shows.

**Candidate 1 — §Objective line 24:** "what *is* in scope this round is the **operational sketch** (§4, demoted from 'spec' per Round-2 robot-talks) the eventual derivation pipeline must satisfy, with explicit honesty that no prototype contact has yet occurred." — **conforming.** "Sketch" matches §4's actual content; "no prototype" matches TD-2 and B-2.

**Candidate 2 — §1 line 34:** "Inverting authority moves the symptom; it does not on its own change the rate." — **conforming.** This is a *demotion* of a prior claim, not an inflation. R-2 work.

**Candidate 3 — §3 AC-10 line 170:** "declaration on either side is sufficient; the projection materializes the symmetric position on the other side." — **conforming as candidate.** AC-10 is explicitly labeled "Candidate. Not drafted here." (line 173). The discovery does not claim the constitution has changed; it claims the candidate is on the table.

**Candidate 4 — D-11 (line 306):** "`contradicts` authoring relaxes to declaration-on-either-side-is-sufficient (NEW this round)." — **borderline.** D-11 is in §5 Decision Summary, framed as a binding commitment of this proposal. But AC-10 (§3) labels the same change as "Candidate. Not drafted here." The slight tension: §5 commits to a decision whose §3 form is a candidate. The resolution is in D-11's own text: "The decision is constitutional (AC-10) and operational (§4.3 dedup mechanism); D-11 records the binding commitment." Read together, D-11 is the proposal's commitment that *if* AC-10 lands, the operational mechanism is §4.3. Not an inflation, but the writer should preserve the "if AC-10 lands" implicit conditional in the canonical text — composing D-11 as an unconditional declarative would inflate.

**Candidate 5 — §9 B-1 line 405:** "D-3 ('preserved unchanged') is unevaluable until B-1 closes. This proposal cannot promote to a consolidated discovery against an internally-inconsistent catalog without inflating its own claims." — **conforming.** The proposal is *applying* the subset rule to itself. Self-honest.

**Candidate 6 — §Connections `governed-by` row line 437:** see N3-1 above. The exception is declared, not smuggled. The claim ("governed-by carries semantically-load-bearing constitutional binding that cites does not encode") is locally true. The catalog gap is the residue, not the claim — and §9 B-1 sub-item 3 owns the gap.

**Verdict:** subset rule holds. One borderline (D-11; writer must preserve the conditional). One residual gap (`governed-by` row; declared, not smuggled). No inflations of the kind that would block writer composition.

---

## Writer readiness assessment

**Can a writer compose the final canonical `discovery.md` from R3 substance without introducing new claims?**

**Yes — with three composition disciplines:**

1. **Preserve the demotion language.** D-3 must keep its inline disclaimer. AC-10 must stay labeled "Candidate." D-11 must preserve the implicit "if AC-10 lands" conditional. The §Connections `governed-by` row must keep its explicit gap-declaration text routing to §9 B-1 sub-item 3. The §4 heading must remain "Operational sketch," not promote back to "spec."

2. **Do not silently fix the `governed-by` row.** Tempting for a writer to either demote to `cites` (loses the gap-flag) or quietly delete the explanatory text (smuggles the violation). Neither is acceptable. The explorer's R3 disposition — knowingly ship + route to §9 — is load-bearing for the §9 argument.

3. **Carry §8 R-1 and R-4 as un-bound dead metaphors honestly.** §8 names four reframings; R-2 and R-3 bind into the body; R-1 and R-4 are named but not fully operationalized. The writer should NOT inflate by claiming all four are killed; should NOT delete the §8 entries that are merely named; should consider one-sentence acknowledgments in D-7 (for R-1) and §4 (for R-4) noting the metaphor is named but not fully resolved.

**What's missing (does NOT block the writer):**
- Prototype contact (B-2). Recommended but not blocking; the §4 sketch demotion absorbs this.
- §9 B-1 closure. By design — the discovery cannot promote until B-1 closes, but the writer can compose the discovery in a state that names the blocker.
- R-4 decomposition of D-9 into three timing decisions. Out of scope for the writer.

**What IS missing that the writer needs:**
- A `## Claim` sentence following `discovery-structure-constitution.md` §3 ("One sentence. The finding, stated as a proposition. If it cannot be stated in one sentence, the discovery is not yet a discovery."). The explorer is `node_type: research`, not `discovery`, so this is forgivable here, but the eventual `discovery.md` writer will need to compose a Claim. The cleanest candidate from R3: *"Inverting edge authoring from `## Connections` table to body-prose `title`-attributed links localizes drift to a single mechanically-enforceable surface, contingent on prior catalog reconciliation (§9 B-1)."* This is composable from R3 substance without introducing new claims.
- A `## Status` line per §3.
- The §8 required sections of `discovery-structure-constitution.md` shape rules (Claim, Status, Summary, Lenses list, Open Questions, Next Moves) are the canonical discovery shape; the R3 explorer is shaped as research-artifact-sections (Objective, §1–§9). The writer will need to remap.

**Writer readiness verdict: YES.** The substance is sufficient. The composition work is shaping + remapping + preserving demotion language, not new research.

---

## Strongest residual concern

**The `governed-by` row exception (N3-1) is the most important issue the writer must NOT paper over.**

The explorer R3 made a knowing trade: rather than demote `governed-by` to `cites` (catalog-conformant but loses semantic content) or drop the row entirely, it ships a non-conformant row with explicit reasoning and routes the catalog gap to §9 B-1 sub-item 3. This is the *correct* disposition by the proposal's own logic — the catalog is internally inconsistent, and the proposal claims it cannot promote until §9 B-1 resolves — but it sits in the artifact-self-conformance position that R2-R1 N-1/N-2/N-3 attacked exactly six rows above.

The writer will be tempted to "clean this up" by demoting `governed-by` to `cites`. **This would lose the load-bearing exhibit for §9's claim that the catalog needs reconciliation.** The `governed-by` row is now functioning as Exhibit A for B-1 sub-item 3 — a live, named, in-this-very-document catalog violation that the proposal cannot fix without an amendment it does not have the authority to draft.

The discipline: the canonical `discovery.md` keeps the `governed-by` row, keeps its explicit gap-declaration text, and links to §9 B-1 sub-item 3. If a future reader thinks "this discovery has a catalog violation in its own Connections table," that reader is correct, and the explorer admits it — and that admission is what makes the §9 argument bind.

If the writer demotes this row silently, the discovery loses its own load-bearing exhibit.

---

## What Round 3 got right

- **R2-R1 N-1/N-2/N-3 closure is clean and reasoned.** Each demotion cites the R2 finding by name, names the catalog row that forbade the original edge type, and explains what the prose loses (and where the loss is recovered — D-10 for partial supersession, AC-11 for the catalog-extension option). This is the model of how to close a block finding.

- **AC-10 + §4.3 composition is exactly the SY-2 ask.** The R2 robot-talks demanded a composite fix; the explorer delivered a composite fix. AC-10 names the posture change as a candidate; §4.3 specifies the mechanism step-by-step including the canonical-pair rule that closes OQ-2. Neither fix shipped without the other.

- **§9 B-1 is operationally specified, not just named.** Lines 396–411 give three concrete file-level checks (count residue with named lines; `proposes-edit` decision with route-a-or-route-b; source-type column completeness). The "test of done" (line 407) and the "operational specification of the blocker" paragraph (line 409) are exactly the level of concreteness the R2 robot-talks demanded for promoting OQ-10 from "downstream concern" to "this proposal's blocker."

- **The §4 demotion language is honest.** Line 205: "This is concrete enough to attack but not concrete enough to implement without prototype contact on 5 vault files." The opening honesty admission of §4 is unflinching — and the explorer correctly identifies that the demotion absorbs the commitment-level mismatch without losing the §4 content.

- **The §Connections authoring-note is honest about its own non-derivation.** Line 427: "Per the proposal's own logic, this section should be derived from typed body links in §1–§9. Since the derivation pipeline does not exist (TD-2) and migration is out of scope (D-6), this round hand-authors the table in the legacy form." The proposal does not pretend its own table is in the regime it argues for. R2 robot-talks endorsed this disclaimer pattern; R3 preserved it.

- **DM-3 → R-3 graduation is genuine and load-bearing.** §8 R-3 is the round's single clearest dead-metaphor killing. The reframing is operationalized through D-3 demotion + §9 B-1 + AC-N + AC-11 + AC-8 extension — five separate body changes that all bind to the same reframe. This is what "the metaphor died" looks like when it actually dies.

- **The "what does NOT change in the constitution" list (line 191–199) is precise.** AC-10 changes the *authoring rule*, not the symmetry property — the explorer is explicit about which constitutional surfaces are touched and which are not. This matches `discovery-structure-constitution.md` §6's discipline that a discovery surfaces candidates, not text.

- **Subset rule is applied to the proposal's own claims (§9 B-1 line 405).** "This proposal cannot promote to a consolidated discovery against an internally-inconsistent catalog without inflating its own claims." The explorer cites the subset rule against *itself*. This is the move CLAUDE.md asks for at every turn.

---

## Return summary

- **File path:** `/Users/victorboscaro/domainspec/vault/discovery/edges-enforcement-refactoring/research/round-3/reviewer-1.md`
- **Line count:** ~262
- **Verdict:** `accept-as-final`
- **R2-R1 findings closed:** 6 of 6 (N-1, N-2, N-3, N-4, N-5, N-6 all adequately addressed)
- **R2 robot-talks agenda items closed:** 10 of 10
- **Dead metaphors genuinely killed:** 2 of 4 (R-2 "drift=rate" bound into §1 body; R-3 "catalog=fixed invariant" load-bearing across §3/§5/§7/§9). Named-but-not-killed: 2 of 4 (R-1 "SoT" named but D-7 unchanged; R-4 "pipeline-as-singular" named but §4 still singular).
- **Writer readiness:** YES — composition needs three disciplines (preserve demotion language; do not silently fix `governed-by`; carry R-1 and R-4 honestly as named-but-not-killed). Writer must also compose a `## Claim` sentence and reshape research-artifact-sections to discovery-shape-sections per `discovery-structure-constitution.md` §3.
- **Strongest residual concern:** the `governed-by` row (N3-1) is a knowingly-shipped catalog violation that functions as Exhibit A for §9 B-1; the writer must NOT silently demote it to `cites`.
