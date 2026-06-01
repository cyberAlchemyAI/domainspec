---
tags: [vault, ontology, edges, authoring, refactoring, robot-talks, synthesis, round-3, final]
node_type: research
is_session: false
layer: ontology
nature: synthesis
status: draft
version: 0.3.0
last_updated: 2026-05-30
---

# Robot-Talks (Round 3, FINAL) — Edges Enforcement Refactoring

> Final-round synthesis. Both Round-3 reviewers returned writer-ready verdicts. This file is bounded to what the reviewers wrote — no new critiques introduced. Its job is to (a) confirm convergence, (b) extract the load-bearing items the writer MUST preserve, (c) name the composition errors the writer MUST NOT commit, (d) route un-blocking items to follow-up, and (e) hand the writer a one-paragraph brief tight enough that they don't have to guess what to compose.
>
> Constitution: `robot-talks-constitution.md` (PM-3 tension-discovery; PM-8 traceability). Discovery-shape rules: `discovery-structure-constitution.md` §3 (Claim, Status, Summary, Lenses, Open Questions, Next Moves) and §6 (a discovery surfaces candidates; does not draft amendment text). The writer will need to remap from the research-artifact shape (Objective, §1–§9) to the discovery README shape.

---

## Participants

| Reviewer | Lane | File | Verdict |
|---|---|---|---|
| **Reviewer 1 (R3-R1)** | Constitutional coherence — did R3 close R2-R1's six findings + the ten R2-robot-talks agenda items without opening new constitutional defects; did the §8 Reframings actually bind (dead-metaphor verification); does the subset rule hold against the proposal's own claims? | `round-3/reviewer-1.md` | **accept-as-final** |
| **Reviewer 2 (R3-R2)** | Operational viability — does the demoted §4 actually read as sketch (per-section honesty test); do the D-7 fallback elements return defined values on real vault files; does §4.3's dedup mechanism survive adversarial cases; can a writer compose `discovery.md` without inventing operational claims? | `round-3/reviewer-2.md` | **accept-with-revisions (minor) — writer-ready WITH one structural caveat** |

Lanes were concern-non-overlapping (constitutional shape vs IO behaviour) but evidence-overlapping on three load-bearing surfaces: the `governed-by` Connections row (R3-R1 N3-1), the `proposes-edit` count framing (R3-R2 NR3-1), and the §8 Reframings' actual operationalization (both reviewers, from different angles).

---

## Convergence on writer-readiness

**Both reviewers say writer-ready.** R3-R1 returns `accept-as-final`; R3-R2 returns `accept-with-revisions (minor) — writer-ready WITH one structural caveat`. Neither asks for another explorer round.

**Where they agree — strongly:**
- R2-R1 findings closed: R3-R1 scores 6/6 (N-1 through N-6); R3-R2 scores 7/9 R2-R2 findings closed plus Regression-1 closed (independent count, complementary scope). No reviewer claims any R2 finding remains live as a blocker.
- §4 demotion is honest, not cosmetic. R3-R1: "the §4 demotion language is honest" (named as a "what Round 3 got right"). R3-R2: ran a per-subsection honesty test and concluded "the demotion is honest, not cosmetic — it concentrates sketch-marking on the genuinely unresolved items."
- §4.3 `contradicts` composite fix (AC-10 + dedup mechanism) is the strongest single piece of the round per both. R3-R1: "exactly the SY-2 ask"; R3-R2: "the strongest single piece of this round."
- §9 B-1 is operationally specified (three concrete sub-items, test of done), not hand-waved.
- D-3 demotion is in-sentence, satisfying the subset rule. Both flag it as adequate Regression-1/N-5 closure.
- B-2 escalation rule does not escalate. R3-R2 executed the test directly and reports "no unflagged internal contradictions found"; R3-R1 implicitly concurs by not raising one.

**Where they nuance differently (no contradiction):**
- R3-R1's strongest residual is the `governed-by` row (knowingly-shipped catalog violation) — a constitutional-lane concern.
- R3-R2's strongest residual is the `proposes-edit` "12 uses" count framing (the 8/1/3 breakdown that the explorer obscures) — an operational-lane concern.
- These are different items on different surfaces. Neither reviewer's strongest concern lands on the other's lane; the divergence is concern-non-overlap, not disagreement.

**Synthesized convergent verdict: WRITER-READY.** The two residuals are composition-discipline items, not substantive research gaps.

---

## Composition non-negotiables (writer MUST preserve)

Each item: what to preserve, citation to the reviewer finding that makes it load-bearing.

1. **The `governed-by` row in §Connections must keep its explicit catalog-gap-declaration text, routed to §9 B-1 sub-item 3.** (R3-R1 N3-1 + strongest residual concern; explorer line 437.) The row is a knowingly non-conformant exhibit; removing or silently demoting it erases §9 B-1 sub-item 3's load-bearing evidence that the catalog is internally inconsistent. Per R3-R1: "If the writer demotes this row silently, the discovery loses its own load-bearing exhibit."

2. **D-3 must keep its inline "Demoted this round … conditional on §9 catalog-reconciliation closure" disclaimer.** (R3-R1 N-5 closure verification, line 286 of explorer; R3-R2 Regression-1 closure.) The disclaimer lives in D-3's own sentence, not in a sibling OQ. Per CLAUDE.md subset rule.

3. **AC-10 must stay labeled "Candidate. Not drafted here."** (R3-R1 subset-rule Candidate 3; explorer line 173.) Per `discovery-structure-constitution.md` §6, the discovery surfaces candidates; it does not draft constitution text.

4. **D-11 must preserve the implicit "if AC-10 lands" conditional.** (R3-R1 subset-rule Candidate 4; explorer D-11 line 306.) D-11 records the proposal's binding commitment *contingent on* AC-10's adoption; composing it as unconditional would inflate.

5. **§4 heading must remain "Operational sketch," not promote back to "spec."** (R3-R1 agenda-item-10 closure; R3-R2 §4 demotion honesty test.) The demotion is one of the two non-negotiable Round-3 preconditions from the Round-2 robot-talks; reverting it breaks both rounds' synthesis.

6. **OQ-15 (D-7 fallback element 4 table-cell tractability) must stay live, not resolved.** (R3-R2 fallback chain walkthrough Level 4; explorer line 339.) The chain returns a defined value but rule 4 is information-lossy on the 76 vault files with body tables; the writer must NOT pretend the rule is fully tested.

7. **TD-11 (marker convention undecided) and OQ-14 must stay live.** (R3-R1 agenda-item-4 closure-as-demoted; R3-R2 NF-1 closure.) Three exits surfaced; explorer explicitly does not pick. Writer carries all three exits forward.

8. **AC-9-bis "conjecture, not commitment" framing.** (R3-R1 N3-3; R3-R2 NF-4 closure.) The discovery does not own `inverse-edge-fix` Tier 1's schedule; AC-9-bis must NOT be promoted to a binding directive.

9. **AC-N "(conditional on §9)" framing.** (R3-R1 N3-2; R3-R2 NF-5 closure note + OQ-13.) AC-N picks route (b) absorb conditional on a named sibling decision; writer must preserve the conditional, not strip it.

10. **§9 B-1's three sub-items and test-of-done.** (R3-R1 "What R3 got right"; R3-R2 §4.3 dedup adversarial test + "B-1 structure operationalizable as sibling-node spec".) Concrete file-level checks (count residue; off-catalog edge decision; source-type column completeness); not "the catalog is reconciled."

11. **R-2 binding into §1 body text and R-3 binding across §3/§5/§7/§9.** (R3-R1 dead-metaphor verification.) These are the two dead metaphors that genuinely died; the operational consequence shifts the proposal's headline ("eliminates drift" → "localizes drift to a single mechanically-enforceable surface" for R-2; D-3 demoted + §9 B-1 for R-3) and must not be quietly unwound.

12. **§Connections authoring-note's self-honesty disclaimer** ("Per the proposal's own logic, this section should be derived … this round hand-authors the table in the legacy form"). (R3-R1 "What Round 3 got right"; R2 robot-talks endorsement.) The discovery does not pretend its own table is in the regime it argues for.

---

## Composition prohibitions (writer MUST NOT do)

Each prohibition: the action forbidden, the load-bearing reviewer finding it would erase.

1. **Do NOT silently demote `governed-by` to `cites` in §Connections.** Erases R3-R1 N3-1's load-bearing exhibit for §9 B-1 sub-item 3. The temptation is real — a clean Connections table looks better than one with a declared catalog violation — but cleanliness here destroys the §9 argument.

2. **Do NOT promote §4 from "Operational sketch" back to "Operational spec."** Reverts the non-negotiable Round-2 robot-talks structural demotion. Both R3 reviewers verify the demotion's honesty; reverting it re-imports the commitment-level mismatch.

3. **Do NOT compose D-11 as unconditional.** Strips the "if AC-10 lands" conditional R3-R1 flagged as the borderline subset-rule case. D-11's authority depends on AC-10 being adopted; without that conditional the discovery overshoots its own §3.

4. **Do NOT inflate AC-N or AC-9-bis from "candidate / conjecture" to "directive."** Both are explicitly conditional on sibling-node decisions (§9 B-1 sub-item 2 for AC-N; `inverse-edge-fix` Tier 1 owner for AC-9-bis). The discovery does not have authority over either decision.

5. **Do NOT carry the "12 uses across 6 files" framing forward verbatim for `proposes-edit`.** R3-R2 NR3-1 (major). The actual operational decomposition is 8 prose mentions (inert under the §4 pipeline) + 1 forward-only carve-out edge (constitutionally legal per §297/§303) + 3 vault→vault `## Connections` rows in `inverse-edge-fix.md` (the only load-bearing operational exposure). The writer must either substitute the 8/1/3 breakdown OR add a footnote distinguishing the three categories. Carrying the inflated framing leaks into §9 B-1 sub-item 2 and could trigger unnecessary constitution edits by downstream sibling nodes.

6. **Do NOT silently fix R-1 or R-4 by quietly deleting the §8 entries.** (R3-R1 dead-metaphor verification.) R-1 (SoT-as-unqualified-good) and R-4 (pipeline-as-singular) are NAMED but not fully bound into §4/§5. The honest disposition is to keep them in §8 as un-bound dead metaphors; deleting them claims a kill that did not occur. Inflating by claiming all four reframings are killed is also forbidden.

7. **Do NOT silently fix the NR3-1 count breakdown without naming the prior framing.** (R3-R2 NR3-1 recommendation.) Either replace the count + name the substitution OR add a footnote. Silent rewrite obscures the audit trail.

8. **Do NOT collapse the three TD-11 exits (cite prior art / migration debt / sequence with Tier 1) into a single picked option.** (R3-R1 agenda-item-4 closure verification; R3-R2 §4.4 honesty.) The explorer explicitly does not pick. Writer carries all three forward as live.

9. **Do NOT compose a `## Claim` sentence that overshoots R3 substance.** The writer needs a one-sentence Claim per `discovery-structure-constitution.md` §3. R3-R1 offers a composable candidate: *"Inverting edge authoring from `## Connections` table to body-prose `title`-attributed links localizes drift to a single mechanically-enforceable surface, contingent on prior catalog reconciliation (§9 B-1)."* The writer should NOT write a Claim that drops the "localizes drift" demotion (R-2 binding) or drops the "contingent on §9 B-1" conditional (R-3 binding).

10. **Do NOT introduce any new substantive claim during composition.** Both reviewers stress this is composition + remap, not new research. The R-4 decomposition of D-9 into three timing decisions is explicitly out of scope for the writer (R3-R1: "out of scope for the writer"; R3-R2: "decompose D-9 OR note that the three-pipeline decomposition is a Round-4 follow-up" — the latter is the writer-safe option).

---

## Deferred to follow-up

Items the writer should NOT resolve, scoped for Round 4 retro, sibling discoveries, or v0.2 of this proposal.

| Item | Scope | Routed to |
|---|---|---|
| **B-1 catalog-reconciliation node creation and closure** | Sibling research/audit/amendment node. Three sub-items: count residue (21/22/25); off-catalog edge decision (`proposes-edit` route a or b); source-type column completeness (incl. `governed-by` source-type for `research`). | New sibling node, cited from this discovery's `## Connections` once it exists. Discovery cannot promote until this closes. |
| **B-2 prototype contact on 5 vault files** | Implementation work, not research. Recommended, not blocking. | A separate implementation session; B-2 stays as a recommendation in the discovery. |
| **R-4 decomposition of D-9 into three timing decisions** (materialization / validation / bootstrap) | New research surface; would require re-spec'ing §4.5. | Round-4 follow-up or a sibling discovery on pipeline decomposition. Writer notes R-4 as named-but-not-killed; does not act on it. |
| **TD-9 migration measurement** (sampling of body links retroactively qualifying as edges) | Unchanged across Rounds 2 → 3. | v0.2 of this proposal or a measurement-focused sibling. |
| **TD-10 `contradicts` dedup discard-rate empirical check** | Requires prototype contact. | Composes with B-2. |
| **NR3-2 §4.3 dedup composition (canonical-pair × first-occurrence for multi-site `contradicts`)** | One-sentence gap in §4.3. R3-R2 marks as minor; writer MAY add the one sentence or defer to v0.2. | Writer's discretion: add 1-sentence composition rule OR add an OQ. Not blocking. |
| **NR3-3 B-2 escalation rule tightening** ("internally contradictory not merely sketch-level") | The criterion is judgment-bound. R3-R2 offers a tightening; writer MAY adopt or accept the judgment-call structure. | Writer's discretion. |
| **AC-11 catalog-extension for "partial supersession"** | Conditional candidate; raised, not adopted. | Surfaces for visibility; depends on what B-1 decides. |
| **OQ-15 (D-7 element-4 tractability), OQ-16 (AC-9-bis sequencing), OQ-13 (AC-N (b) survives §9)** | All live attack surfaces; carry forward as Open Questions in the discovery README. | Future research / sibling-node decisions. |
| **R-1 wording update to D-7 trade-off paragraph** (lean on "v1 amendment cost" rather than "SoT is intrinsically better") | R3-R2 §8 R-1 operational translation gap; minor wording. | Writer MAY tune; R3-R1 marks as sketch-territory, not block-territory. |

---

## Residual dead metaphors / framings

Per R3-R1 dead-metaphor verification: 2 of 4 §8 reframings genuinely killed (R-2, R-3); 2 of 4 named-but-not-killed (R-1, R-4). The writer must carry the 2 named-but-not-killed honestly — neither claiming kill nor deleting.

### R-1 — "SoT is not an unqualified good for edges with descriptions" — NAMED, partially bound
- **Status.** Named in §8 R-1. D-7 picked-option-rationale (line 297) is unchanged; the trade-off paragraph still leans on SoT framing rather than R-1's "v1 amendment cost" reframing.
- **Writer alert.** Do NOT claim R-1 is fully killed. Do NOT delete §8 R-1. MAY add a one-sentence acknowledgment in D-7 noting the metaphor is named but not fully resolved; R3-R1 marks this as sketch-territory.

### R-4 — "Pipeline is not singular — materialization + validation + bootstrap" — NAMED, NOT KILLED
- **Status.** Named in §8 R-4. §4 still treats the pipeline as singular; §4.5 D-9 picks "on-build for v1" as a single decision covering three independent timing choices.
- **Writer alert.** Do NOT claim R-4 is killed. Do NOT delete §8 R-4. The honest composition is to keep R-4 in §8 as a named-but-not-bound reframing with the explicit Round-4 / sibling-discovery follow-up note (per Deferred-to-follow-up above). The writer should NOT execute the decomposition of D-9 — that is new research.

### R-2 — "Drift = authoring-rate, not surface-distance" — KILLED (bound into §1)
- **Writer must preserve.** §1 "Why now" carries the rate-vs-distance acknowledgment; the proposal's claim shifted from "eliminates drift" to "localizes drift to a single surface where mechanical enforcement can act on it." This shift is load-bearing for the Claim sentence.

### R-3 — "Catalog is not fixed invariant; reconcile first" — KILLED, load-bearing
- **Writer must preserve.** D-3 demoted; §9 B-1 added; AC-N + AC-11 + AC-8 extension all bind. R-3 is the round's clearest dead-metaphor killing. The writer's Claim sentence must carry the "contingent on §9 B-1" conditional that R-3's binding requires.

**Composition rule for §8 in the canonical discovery:** keep all four R-entries. Mark R-2 and R-3 as bound (operationalized in §1 / §3 / §5 / §9). Mark R-1 and R-4 as named-but-not-killed with follow-up routing.

---

## Writer brief

The writer composes the canonical `discovery.md` for `edges-enforcement-refactoring` by remapping the R3 explorer's research-artifact shape (Objective, §1–§9) onto `discovery-structure-constitution.md` §3's discovery-shape sections (Claim, Status, Summary, Lenses, Open Questions, Next Moves), preserving every demotion and conditional intact. **The headline Claim is the R-2-shifted form** — *"Inverting edge authoring from `## Connections` table to body-prose `title`-attributed links localizes drift to a single mechanically-enforceable surface, contingent on prior catalog reconciliation (§9 B-1)"* — not the Round-1 "eliminates drift" form, and not an unconditional version that drops the §9 contingency. **The demoted-from claim** is "edge authoring becomes catalog-mechanized with the Appendix C catalog preserved unchanged" (Round 1's de-facto headline); the writer must compose so that this stronger claim cannot be reconstructed from the canonical text. **The binding gates** the writer must preserve are: (i) the §Connections `governed-by` row keeps its explicit catalog-gap-declaration text routing to §9 B-1 sub-item 3 — do not silently demote to `cites`; (ii) D-3's inline "Demoted this round … conditional on §9 catalog-reconciliation closure" disclaimer stays in D-3's own sentence; (iii) AC-10 stays labeled "Candidate. Not drafted here." and D-11 preserves its implicit "if AC-10 lands" conditional; (iv) §4 stays titled "Operational sketch"; (v) the `proposes-edit` "12 uses across 6 files" framing is replaced or footnoted with the 8/1/3 breakdown (8 prose mentions inert under the pipeline + 1 forward-only carve-out edge + 3 vault→vault `## Connections` rows in `inverse-edge-fix.md`); (vi) §8 keeps all four R-entries with R-2 and R-3 marked as operationalized and R-1 and R-4 marked as named-but-not-killed with follow-up routing; (vii) AC-9-bis stays "conjecture, not commitment"; (viii) §9 B-1's three sub-items and concrete test-of-done are preserved as the promotion blocker. Composition is remap + preserve + the one substitution for NR3-1; no new research, no new claims, no resurrection of dead metaphors that died, no silent cleanup of declared violations.

---

## Final synthesized verdict

**WRITER-READY: YES.**

---

## Connections

> Per the proposal's own logic this would be derived. It isn't (TD-2). Hand-authored in legacy form, restricted to `cites` per the catalog's source-type column for a `research` node.

| Document | Type | Description |
|----------|------|-------------|
| [explorer.md](explorer.md) | `cites` | Round-3 explorer being synthesized. Both reviewers writer-ready; 6/6 R2-R1 findings closed; 7/9 R2-R2 closed (1 partial NR3-1 → count framing; 1 unchanged Regression-2 TD-9); 2/4 dead metaphors genuinely killed (R-2 bound into §1; R-3 load-bearing across §3/§5/§7/§9). Two structural Round-2 robot-talks preconditions executed (§4 → sketch; OQ-10 → §9 blocker). Inverse `cited-by` to be added at promotion. |
| [reviewer-1.md](reviewer-1.md) | `cites` | Constitutional-coherence Round-3 review. Verdict `accept-as-final`. N3-1 `governed-by` knowingly-shipped row is the strongest residual concern and is the writer's #1 preserve-do-not-silently-fix item. Dead-metaphor verification (R-1 named-not-killed; R-2 killed; R-3 killed and load-bearing; R-4 named-not-killed) drives §Residual-dead-metaphors. Inverse `cited-by` to be added at promotion. |
| [reviewer-2.md](reviewer-2.md) | `cites` | Operational-viability Round-3 review. Verdict `accept-with-revisions (minor) — writer-ready WITH one structural caveat`. NR3-1 `proposes-edit` 8/1/3 count breakdown is the writer's substitution item and the strongest leak-into-downstream concern. §4 demotion honesty test (per-subsection) and D-7 fallback chain walkthrough (Levels 1–5 against real vault files) ground the writer-readiness claim. Inverse `cited-by` to be added at promotion. |
| [../round-2/robot-talks.md](../round-2/robot-talks.md) | `cites` | Round-2 synthesis whose two non-negotiable structural demotions (§4 → sketch, OQ-10 → blocker) were Round-3 preconditions and are now executed and verified by both R3 reviewers. The 10-item revision agenda is closed (10/10 per R3-R1). The Round-2 dead-metaphor audit (3 of 4 persisting; DM-3 graduated to load-bearing) drove the §8 Reframings R3 added. Inverse `cited-by` to be added at promotion. |
| [../../../../constitution/discovery-structure-constitution.md](../../../../constitution/discovery-structure-constitution.md) | `cites` | Discovery-shape rules the writer must follow: §3 required body sections (Claim, Status, Summary, Lenses, Open Questions, Next Moves) drive the remap from research-artifact shape (Objective, §1–§9) to discovery README shape; §6 (a discovery surfaces candidates; does not draft amendment text) drives the AC-10 "Candidate. Not drafted here." preservation and the AC-N / AC-9-bis "candidate / conjecture" preservation. Inverse `cited-by` to be added at promotion. |
