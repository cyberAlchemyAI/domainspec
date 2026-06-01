---
tags: [adversarial, constructive, lens, knowledge-calibration-geometry, refinement]
node_type: findings
is_session: false
layer: architecture, application
nature: explanatory, reference
status: active
dispatch_status: lens-agent-1-of-4
lens_order: first
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Findings — Adversarial + Constructive Lens on `knowledge-calibration-geometry/discovery.md` v0.4.0

## Instantiation

- **Axis**: adversarial-constructive, two modes over the same doc.
- **Mode A**: math/measure decoration without falsifiable claims; psychometric vocabulary without constructs; unfalsifiable / self-protecting hypotheses; over-commitments; cargo-culted neighbors; internal contradictions.
- **Mode B**: redundancy, vague definitions, weak ordering, table opportunities, term drift.
- **Target**: `/Users/victorboscaro/domainspec/vault/discovery/knowledge-calibration-geometry/discovery.md` (693 lines, v0.4.0, draft).
- **Lens position**: 1 of 4. Siblings: `axis-psychometric-geometric`, `axis-coherence-evidence`, `axis-hypotheses-model`.

## Method

1. Full read of discovery.md for shape (Objective → Context → Hypothesis → Adjacent Literature → Hypotheses → Working Model → Alternatives → Open Questions → Next Moves → Connections → Source Dispatch).
2. Re-scanned H-1..H-11 for falsifiers, operational definitions, self-protection.
3. Re-scanned Working Model tables for term drift vs. the Hypothesis Index and Objective.
4. Cross-checked orchestrator memory ("don't dress heuristics in math vocabulary") against every use of *distance / geometry / metric / topology / score / invariance / measurement / functorial*.
5. Listed sibling lens folders to scope deferrals.
6. Did **not** open `vault-newspaper/discovery.md` content (brief said "if relevant" and connection is not asserted).

## Findings — Adversarial

**A1. "Geometry" used as branding, not a claim.** (title L14; Hypothesis L55; H-4 L186-200). "Geometry" promises structure (space, metric axioms, embeddings) but the doc never commits to a space, never says whether `d(.,.)` is symmetric or obeys triangle inequality, never says `d(head_i,head_j)` lives in the same space as `d(spec,system)`. Orchestrator memory flags this exact failure mode. **Fix**: either downgrade to "topology of divergences" explicitly framed as discipline-not-math, or commit in H-4 to a minimal axiomatic floor.

**A2. "Distance" without unit, codomain, or comparability rule.** ("First useful product distances" L391-398). Five `d(...)` functions listed as one family. `d(spec,system)` is structurally observable; `d(head_i,reference)` is a psychometric inference; `alignment(group)` isn't even a `d(...)`. Treating them as one family invites the very single-score collapse H-2 warns against. **Fix**: add a "codomain / evidence basis" column marking each as observable / inferred / definitional and state they are not commensurable until proven so.

**A3. H-11 is unfalsifiable as written; same for H-5, H-10.** (L309-325; L202-213; L294-307). H-11 ("metrics must shorten path to action") is a product policy, not a hypothesis. H-5 explicitly self-labels "Immediate language discipline." H-10 is a governance gate. Mixed into a "Hypotheses" list, they make the reader unable to tell which are bets and which are house rules. **Fix**: split into "Working Hypotheses" (H-1, 2, 4, 6, 7, 8, 9) and "Disciplinary Commitments" (H-3 partly, H-5, H-10, H-11).

**A4. Psychometric vocabulary borrowed without a single named construct.** (L-5 L110-124; H-10 L294-307; guardrails L416-451). The doc cites Messick, Kane, AERA/APA/NCME, evidence-centered design — heavy machinery — and then never names one construct. "Define the construct" is deferred to the future. This is exactly the failure orchestrator memory flags: borrowing measurement prestige while deferring measurement work. **Fix**: in H-10 or OQ-18, name **one** running-example construct (e.g., "rule-application accuracy on a FIDC remessa eligibility workflow") and thread it through.

**A5. "Reference surface" never defined operationally despite being load-bearing.** (H-5 L202-213; OQ-3 L625; used 6+ times). H-5 offers four phrasings as interchangeable, but "canonical reference / best auditable model / current system of record / reference surface" each privilege different sources (declared / reviewed / code-derived / abstract). OQ-3 admits this is open. The whole Working Model depends on a concept the doc has not chosen. **Fix**: pick one in H-5 (relegate others to Alternatives), or move H-5 below OQ-3 so reader meets the open question first.

**A6. H-1 ("three categories") is non-falsifiable: the title contains its own escape hatch.** ("first three", L146-156). If a fourth category proves needed, H-1 isn't falsified — it just gets a sequel. **Fix**: convert to a commitment that can fail — e.g., "three categories explain ≥X% of routed divergences in the FIDC reference surface; fail if a fourth category accounts for ≥Y%."

**A7. H-3 quietly assumes adoption.** (L175-184). Bidirectional question-play requires sustained engagement. No minimum cadence (probes/week/person) is named below which the channel is too sparse for any inference. Without that floor, H-3 is permanently safe. **Fix**: tie to a pilot threshold ("fails if median pilot user produces <K answered probes and <J system-directed questions per week over N weeks") and connect to the Kill signals at L527-533.

**A8. "Game" framing never inherits its known risks.** (Context L42-47; H-3; "Why the game matters" L400-414). Gamification's failure modes (gaming the metric, anxiety, status hierarchies, intrinsic-motivation collapse) are exactly the construct-irrelevant variance H-10/L-5 warn against — but the game framing never carries that warning. **Fix**: after "Why the game matters", explicitly inherit the prohibited-uses list and add game-specific construct threats (leaderboards, streaks, public scores, role-asymmetric difficulty).

**A9. "Functorial" / "fully faithful" (FF) name-dropped without a gloss.** (Alternatives A-5 L606-610; OQ-11). Category-theory vocabulary appears as deferred future state without ever being introduced. A reader without category theory cannot tell what's being deferred. Borrowed prestige. **Fix**: either gloss FF in one sentence the first time it appears, or strike it.

**A10. The 2-channel `C_head` table contradicts H-9's 4-way split.** (Table L360-367 vs. H-9 L268-292 vs. L411-413). The table puts confidence ratings and self-reported uncertainty under "Direct elicitation," but those are metacognitive self-report, not direct knowledge elicitation. Lines 411-413 introduce a 4-way model (declared / operational / metacognitive / latent) that the 2-row table never reflects. **Fix**: replace 2-row table with 4-row table aligned to declared/operational/metacognitive/tacit, or explicitly mark the 2-channel table as a coarse aggregation.

**A11. L-1..L-5 hedges are epistemically empty.** (L59-124). Every L-section closes with "literature likely supports the intuition but may not settle whether DomainSpec is distinct." Same formula five times. It neither validates nor falsifies. **Fix**: force one concrete claim per L-section ("L-3 implies DomainSpec must do X that SECI does not, or we are reinventing externalization") or admit the reading is too shallow to extract a claim.

**A12. OQ-12 (the falsification criterion for the whole frame) is buried.** (L634, 8th from end of 23 questions). The discovery admits it has not named its own kill criterion — and then parks that admission in question 12 of 23. **Fix**: promote OQ-12 into the Objective. The "First experiment shape" already has Kill signals (L527-533); link them.

**A13. The Working Model is longer than the Hypotheses section, inverting weight.** (Hypotheses ~140 lines L146-326; Working Model ~250 lines L329-578). A discovery's load-bearing section should be hypotheses. Here Working Model smuggles in a validation ladder and a first experiment — contradicting the doc's own line 24 ("intentionally pre-implementation"). **Fix**: move "First experiment shape" and "Validation ladder" to a sibling experiment doc; keep Working Model to definitions + tables.

## Findings — Constructive

**C1.** Hypothesis paragraph (L55) and the "High-Level Summary of Hypotheses" (L128-141) duplicate roles. Either delete the paragraph or make it a true single-bet thesis (probably H-2) and rename the summary "Hypotheses Index."

**C2.** "High-Level Summary of Hypotheses" (L128-141) and "Working Hypotheses" (L144-326) restate the same 11 items. Make the summary a table with `ID | One-line claim | Status | Anchor` and link to expanded H-N sections.

**C3.** L-1..L-5 share a clean structure (Pressure → References → Current hypothesis). Lift it into a one-paragraph "How to read this section" preamble so future L-N additions follow the same template.

**C4.** "Two classes of measurement" (L354-358) is a 2-row table that just restates H-2. Merge into H-2 body or into the L333 table.

**C5.** "First useful product distances" table needs a Status column (proposed / partly-defined / inferred-only). Matches Hypothesis-section discipline and immediately exposes A2.

**C6. Term drift**: `head`, `C_head`, "knowledge in heads", "people's heads", "internalized knowledge" used interchangeably; same for spec and system. Pick one form per context (C-prefixed in tables, unprefixed in prose) and state the convention in Objective.

**C7.** "Drift", "residue", "fidelity", "alignment", "calibration", "coherence", "answerability" are never disambiguated. OQ-5 admits this but is buried. Add a "Working Vocabulary" table near the Objective with `Term | Provisional meaning | Status` (TBD allowed).

**C8.** "Anti-dashboard discipline" + Anti-patterns + Product-entry test + H-11 are the same argument three times. Collapse to one canonical block; have H-11 point to it.

**C9.** "Discovery maturity note" (L496-504) introduces a new construct (maturity levels) that OQ-20 then asks about. Move next to OQ-20 or split out.

**C10.** "Possible rule-formation event inside the loop" (L564-577) duplicates H-8 and adds a 3-way distinction (retrieval / formation / promotion) that belongs *inside* H-8, not as a Working Model footer.

**C11.** "Next Moves" (16 bullets) is a backlog masquerading as a roadmap — no owner, no order, no dependency. The same anti-pattern H-11 warns about. Convert to `Next Move | Depends on | Output artifact | Status`, or prune to top 3 ordered moves.

**C12.** Connections cites 5 docs (DRIFT-CONVERGENCE, TUNING-LOOP, etc.) but Source Dispatch admits no lens dispatch was run. Add a note in Connections clarifying "outbound citation, not source provenance."

**C13.** L-* references mix author-year citations and bare URLs. Pick a convention; if URLs, add accessed-date.

**C14.** The "Prohibited uses" list (L443-451) is the strongest disciplinary statement in the doc and is buried inside Working Model → Psychometric guardrails. Promote it adjacent to the anti-dashboard constraint in the Objective.

**C15.** The Hypothesis (L55) uses "try to measure" — which cannot fail. Replace with "models" and let H-1, H-2 carry the disclaimers.

## Cross-cutting observations

1. **Math-as-decoration is the dominant adversarial pattern.** A1, A2, A9 share this root. The orchestrator memory predicted it; the doc has not absorbed that feedback at the vocabulary layer.
2. **Hypotheses are mixed with disciplinary commitments.** H-5/H-10/H-11 are house rules (A3); H-1/H-3 are partly hedged into safety (A6/A7). Only H-2, H-4, H-6, H-7, H-8, H-9 are genuine bets that can fail.
3. **The doc grew by accretion and has not been compacted.** Hypothesis vs. Index (C1), H-11 vs. Anti-dashboard (C8), H-8 vs. rule-formation footer (C10), Two classes vs. H-2 (C4) — repeated content throughout.
4. **The most adversarially important open questions are buried.** OQ-12 (falsification), OQ-3 (reference surface definition), OQ-15 (what's actually novel post-literature) belong at the top. Their burial is itself an adversarial signal.
5. **The doc is honest about being early — and then quietly drifts into product-spec territory.** A13 and C11 show the same pull. A doc that says "pre-implementation" on line 24 should not contain a validation ladder by line 537.

## What I did NOT cover

- **Psychometric construct definitions** — deferred to `axis-psychometric-geometric`. I flagged absence (A4); did not propose constructs.
- **Axiomatic floor for the geometry claim** — deferred to a math lens. I flagged decoration (A1, A2); did not write the axioms.
- **Full pairwise coherence audit of H-1..H-11** — deferred to `axis-coherence-evidence`. I caught one contradiction (A10) as a sample.
- **Systematic falsifier audit hypothesis-by-hypothesis** — deferred to `axis-hypotheses-model`. I flagged A3/A6/A7 as representative.
- **Cross-reference to `vault-newspaper/discovery.md`** — not opened. If newspaper deals with event-driven knowledge surfacing, synthesizer should connect to H-8.
- **Cited DomainSpec docs (DRIFT-CONVERGENCE, TUNING-LOOP, domainspec-axioms)** — connections not verified; C12 flags it.
- **Frontmatter validation** — mixed Portuguese/English keys (`veracidade`, `convicção`) not assessed.
- **Source provenance of L-1..L-5 URLs** — liveness not verified.

## Connections

- `../../discovery.md` — `derives_from` — read-only audit target.
- [[axis-psychometric-geometric]] — owns deep psychometric + geometric formalism critique; A1, A2, A4 deferred there.
- [[axis-coherence-evidence]] — owns systematic evidence/coherence pass across H-1..H-11; A10 surfaced as sample.
- [[axis-hypotheses-model]] — owns hypothesis-model audit; H-5/H-10/H-11 reclassification (A3) is their call.
