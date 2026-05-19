---
tags: [vault, research, folder-structure-fractal]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
backfilled: true
---

# Research — Folder Structure Fractal

> **Backfill note.** This research synthesis was written AFTER `discovery.md` was already drafted (the discovery was completed on 2026-05-17 from the 10 lenses directly, without an intermediate research-layer document). It exists to retrofit the new convention's `lens → research → discovery` chain onto an existing artifact. The analysis below was conducted post-hoc by reading the 10 lens findings; it deliberately does not look at the discovery during analysis, to test whether the discovery's commitments survive an independent cross-lens read.
>
> **Proto-synthesis acknowledgment.** Lens 07 (`wave-2-synthesis-and-verdict`) is itself a synthesis-style lens — it pre-figures exactly the cross-lens consolidation a `research.md` would carry. It is a partial proto-`research.md` written from inside the lens layer. This `research.md` cites it as a primary input, treats its verdict as load-bearing, and is honest that the lens-layer's "flat" assumption was already stress-tested by the author at dispatch time: 10 lenses with a self-acknowledged proto-synthesis at position 07 means the convention's "lens layer is flat, research layer synthesizes" boundary was crossed *inside* the lens layer.

## Objective

Synthesize, from the 10 lens findings alone, what the design space around "fractal folder structure + two-layer guarantee" actually contains — which pieces of the maximal proposal survived adversarial pressure, which were rejected on cost, which were deferred under measured-load, and what the cross-lens convergence pattern looks like. Surface cross-lens agreement and disagreement before they collapse into the discovery's narrative.

## Lens Inventory

| # | Lens | Wave | Framing | Headline finding | Confidence |
|---|------|------|---------|------------------|------------|
| 01 | [Prior research catalog](../lenses/01-prior-research-catalog/findings.md) | 1 | Catalog / context | `folder-structure-constitution.md` governs FIDC code, NOT the vault; no vault-folder constitution exists; cross-vault drift uncaught; root-level schema files are S5-leaks today | high (`[local-files-read]`) |
| 02 | [Fractal folder theory](../lenses/02-fractal-folder-theory/findings.md) | 1 | Theoretical proposal | The maximal proposal: `Unit ::= README schema/ instance/ lenses/` at every depth + top-level `schema/`/`instance/` split + `layer:` validator; honest residues for sessions, premise-vs-axiom, conceptual dual-role | high (`[local-files-read, model-recall]`) |
| 03 | [External prior art](../lenses/03-external-prior-art/findings.md) | 1 | KM survey | 13 surveyed systems (Roam, Obsidian/PARA, Logseq, TiddlyWiki, Notion, Luhmann, Antinet, Matuschak, Dewey/LCC/UDC/Colon, Wikipedia, SMW, arXiv): no system enforces schema/instance at the folder level with both as first-class markdown; "anti-deep-folders" is the dominant consensus | high (`[web-fetched]`) |
| 04 | [Adversarial attack](../lenses/04-adversarial-attack/findings.md) | 2 | Adversarial | A2 (direct conflict with `discovery-structure-constitution.md` §1) is fatal-to-coexistence as written; A1 (optional-slot grammar degenerates); A4 (conceptual dual-role); A8 (self-referential migration bootstrap); A6/A10 demote S5/Kauffman framings | high (`[local-files-read]`) |
| 05 | [Migration cost estimate](../lenses/05-migration-cost-estimate/findings.md) | 2 | Engineering | ~112 file moves, ~900 path-reference rewrites across ~60 files, ~50–70 LoC tool changes; full migration ~37 h expected, partial (I.3+I.2) ~14 h for ~80% of benefit; recommends partial+`layer:` field | high (`[local-files-read]`) |
| 06 | [Long-term + cross-repo](../lenses/06-long-term-cross-repo/findings.md) | 2 | Scale / portfolio | Two-layer split holds at 1k files, leaks at 10k (schema-of-schema appears); cross-repo unifying is blocked (`financas_pessoais` has no vault, `football-stats-oracle` uses `raw/` not `lenses/`, `house_project` carries a third "product-schema" layer); drift detection without resolution rule is half a feature | high (`[local-files-read]`) |
| 07 | [Wave-2 synthesis and verdict](../lenses/07-wave-2-synthesis-and-verdict/findings.md) | 2 (synth) | Proto-synthesis | Convergent verdict from E1/E2/E3: adopt the top-level split + `layer:` validator + per-type slot rules; defer the recursive mirror and the Unit-everywhere grammar; decline reflection-tower folder encoding and cross-repo rollout; amendment cascade in 7 steps | high (`[local-files-read]`) |
| dt-E | [Deepest thing — empirical](../lenses/deepest-thing-empirical/findings.md) | session reflection | Session-level | The 30-day residue clock started against a canonical hash; v0→v0.1→v0.2 snapshot progression is on-disk evidence | **demoted** — session-reflective (per discovery §6) |
| dt-H | [Deepest thing — historical](../lenses/deepest-thing-historical/findings.md) | session reflection | Session-level | The 15-year Vladimir conversation finally has language; cross-substrate convergence (WhatsApp, GEB, four-conversation hour) | **demoted** — session-reflective |
| dt-S | [Deepest thing — structural](../lenses/deepest-thing-structural/findings.md) | session reflection | Session-level | Residual novelty narrows to (i) diachronic reflection tower, (ii) Spivak two-layer split, (iii) RG/Noether physics-precedent framing; reflexive payoff is the framework applied to itself | **demoted** — session-reflective |

## Cross-Lens Analysis

### Theme 1 — Convergent narrowing of the maximal proposal

- **Lenses speaking to it.** 02 (proposes), 04 / 05 / 06 / 07 (narrow)
- **Convergence.** Three independent Wave-2 evaluators using three different attack vectors (adversarial / cost / long-term) converged on the same shape of answer: the top-level `vault/schema/` vs `vault/instance/` split survives; the recursive mirror, the Unit-everywhere grammar, the cross-repo universalism, and the S5/Kauffman framings do not. Lens 07 codifies this as "the load-bearing win is the top-level split + the `layer:` validator; everything else is overreach."
- **Disagreement.** Lens 02 (the proposer) argued the recursive mirror is what *operationalizes* the residue-attractor theorem at the file-system level (D.1 — "the host shape now witnesses the hosted theorem"). Lenses 04 A6 and 04 A10 reject this as overstated rhetoric (the folder split is navigational, not type-theoretic; the actual Russell-dodge already lives in `vault_common.frontmatter`). The disagreement was resolved in lens 07 §D by *dropping* the S5/Russell-dodge and Kauffman framings from the load-bearing justification.
- **Resolution.** `[lens-supported]` — the narrowing is the consensus; the maximal proposal was the bait that produced the minimal correct answer (lens 07 §F).
- **Implication for discovery.** Discovery D-1 (adopt narrowed split, defer recursive mirror) and D-3 (drop S5/Kauffman framings) carry the right shape. A-1 (full recursive fractal) is correctly recorded as rejected with five named reasons.

### Theme 2 — The constitution-conflict that wasn't (after narrowing)

- **Lenses speaking to it.** 01, 04, 07
- **Convergence.** Lens 01 §C.1 documented `discovery-structure-constitution.md` §1 ("no other subfolders") as a live tension with the maximal proposal. Lens 04 A2 escalated this to FATAL-to-coexistence: the constitution and the proposal were authored the same session, of equal status, with no tiebreaker. Lens 07 §E step 4 dissolves the conflict mechanically: the narrowed design does *not* add `schema/`/`instance/` slots inside discoveries, so §1's "no other subfolders" is preserved verbatim. No amendment to discovery-structure is required.
- **Disagreement.** None after narrowing. The disagreement was between the maximal proposal (lens 02) and the constitution (cited by lens 01); both Wave-2 evaluators (04, 06) and the synthesis (07) sided with the constitution, and the narrowing made the conflict moot.
- **Resolution.** `[lens-supported]` — A2 stopped biting because the narrowing dissolved the contradiction, not because the constitution was retracted.
- **Implication for discovery.** OQ-2 of the discovery is correctly recorded as **resolved by narrowing**, not deferred. C-3 (per-node-type slot rules with discoveries explicitly preserving §1) is the load-bearing decision.

### Theme 3 — Cost asymmetry and the partial-adoption verdict

- **Lenses speaking to it.** 05, 07, 06
- **Convergence.** Lens 05 measured 112 file moves, ~900 path references, ~50–70 LoC tool changes, and a 3× cost ratio between full migration (~37 h) and partial (~14 h) for *unmeasured* marginal benefit. The recommendation (I.3 + I.2 — partial top-level + `layer:` field) was independently corroborated by lens 06's argument that the recursive mirror would be "honored mostly in the breach" at 12 months and lens 04 A1's structural objection that optional-slot recursion degenerates the grammar.
- **Disagreement.** Lens 02 §G (the proposer) honestly flagged "the cost-benefit of recursive mirroring is not empirically established" — there is no live disagreement between proposer and evaluators here, only a recognition that the maximal proposal's case for recursion was theoretical and the empirical case favored the partial.
- **Resolution.** `[lens-supported]` — partial adoption is the consensus.
- **Implication for discovery.** D-1 carries this exactly. C-5 (the fractal is deferred, not declined) records the right disposition. The empirical re-evaluation hook at 1k files / `vault_ctl walk` case-split (D-1's deferred trigger) is load-bearing.

### Theme 4 — Cross-repo blocked

- **Lenses speaking to it.** 01 (problem), 04 A5, 06 (verdict)
- **Convergence.** Lens 01 §D documented byte-identical constitutions shipping across three vaults while actual folder shapes diverge (sessions/ vs conversations/, audits/ only in house_project, bets/ only in domainspec). Lens 06 §A established empirically that the five repos are not five instances of the same shape: financas has no vault, football uses `raw/` not `lenses/`, house_project carries an unnamed third "product-schema" layer. Lens 04 A5 added the operational point: staggered rollout *temporarily widens* the drift before any later coordinated effort closes it. Lens 06 §I item 8 names the missing piece: "drift detection without a resolution rule is half a feature."
- **Disagreement.** None across these three. The original proposal (lens 02) was largely silent on cross-repo, treating it as follow-on work; lens 06 made the silence concrete and recommended blocking.
- **Resolution.** `[lens-supported]` — block cross-repo rollout; dispatch a separate discovery for the canonicalization protocol before any coordinated migration.
- **Implication for discovery.** D-2 (block cross-repo) and OQ-4 (canonicalization protocol owed) carry this correctly.

### Theme 5 — Prior-art novelty cuts both ways

- **Lenses speaking to it.** 03, 04 A7
- **Convergence.** Lens 03 §G surveyed 13 KM systems and established that *no* system enforces schema/instance separation at the folder level with both as first-class markdown — the proposal's central move is genuinely novel. Lens 04 A7 read the same evidence adversarially: "13 mature systems all missed this" Bayesian-priors-disfavors against "13 systems found this not worth the cost." Lens 03 §F.1 itself names "anti-deep-folders" as the dominant consensus pattern, and the proposal adds depth in exactly the dimension the consensus warns against.
- **Disagreement.** Lens 03 treats the novelty as *opportunity*; lens 04 treats it as *risk-signal*. Both are honest readings of the same survey. Lens 06 §B is the tiebreaker: the partial adoption (top-level split only, no deep recursion) avoids the "deeper folders" anti-pattern while preserving the novel schema/instance-as-markdown move.
- **Resolution.** `[lens-supported]` for the novelty claim; `[analyst-judgment]` for whether it is opportunity or hubris.
- **Implication for discovery.** The discovery does not over-claim novelty in its load-bearing justification (per D-3); it rests on drift detection, onboarding, and the path-coherence invariant — empirically defensible claims, not theoretical-isomorphism rhetoric.

### Theme 6 — Self-referential migration mechanics

- **Lenses speaking to it.** 04 A8, 05 §E, 07 §E
- **Convergence.** Lens 04 A8 surfaced the chicken-and-egg: the amendment recording the migration cannot precede the migration that creates its destination path, and the new constitution governs the folder split that puts it where it lives. Lens 05 §E proposed the operational answer: three-commit sequence (`git mv` only; link rewrite; schema commit including amendment) with the migration commit atomic. Lens 07 §E codified this as the 7-step amendment cascade.
- **Disagreement.** None. The bootstrap problem has a known operational shape (two-phase / three-commit) and the lenses agree on it.
- **Resolution.** `[lens-supported]` — the cascade is well-specified.
- **Implication for discovery.** C-6 (amendment cascade as load-bearing migration sequence) carries this exactly. The order is named, not improvised.

### Theme 7 — The 10-lens, proto-synthesis-at-07 stress test of the convention

- **Lenses speaking to it.** All; structurally, this is a property of the dispatch, not of any one lens.
- **Convergence.** The new convention assumes the lens layer is flat (parallel-fanout findings) and the research layer synthesizes. Lens 07 violated this assumption *inside the lens layer* — it is structurally a partial `research.md` written by a synthesizer-role agent dispatched as a lens. This is acknowledged in lens 07's own frontmatter (`dispatched_by: synthesizer`) and in its §F honest acknowledgments.
- **Disagreement.** The convention itself disagrees with the dispatch shape — but the dispatch shipped what was needed (an in-band consolidation) before the convention existed to forbid it. The convention should either (a) recognize a `synth-lens` sub-role explicitly, or (b) treat lens 07 as an artifact pre-dating the convention and accept that the *new* `research.md` cites it as a primary input rather than a peer lens.
- **Resolution.** `[honest gap]` — the convention's "lens layer is flat" assumption is silently violated here. The migration handles it by (a) backfilling lens 07 as a normal `findings.md` (its structural role as proto-synthesis is preserved in its body) and (b) having this `research.md` explicitly cite it as a primary input that pre-figures the cross-lens analysis. The convention itself should be amended to recognize synth-lenses as a legitimate dispatch shape, OR to forbid them and require synthesizers be dispatched only at the research layer.
- **Implication for discovery.** None directly — the discovery's commitments are unaffected. But this is the one specific finding this folder generates *for the convention itself*: 10 lenses with a self-acknowledged proto-synthesis at position 07 is a stress test of the convention's "lens layer is flat" assumption, and the convention currently has no rule for it.

## Unique Contributions

- **Lens 01.** The only lens that catalogued prior research exhaustively and surfaced the FIDC-misnaming finding (the constitution called `folder-structure-constitution.md` governs the FIDC product code, not the vault). The cross-vault drift comparison (§D) and the "schema-as-root-flat-files is a visible S5 leak" reframing (§F) are unique to 01.
- **Lens 02.** The maximal proposal itself. Its enduring value is the *complete* grammar (`Unit ::= README schema/ instance/ lenses/`), the migration-map table (§C), and the honest residue catalog (§G) — even though most of the proposal did not survive. The four hardest cases (§F) — root loose files, amendments/backlog, existing discoveries, premise/axiom-vs-claims — are unique to 02 and feed directly into the discovery's OQ-3.
- **Lens 03.** The grep-verified survey of 13 KM systems and the "patterns nobody uses" enumeration (§G). The "schema-as-peer-page" precedent from Semantic MediaWiki is the cleanest structural precedent in the survey.
- **Lens 04.** The adversarial attack catalog A1–A10 with severity tags (FATAL / SERIOUS / MINOR / CONFUSED). The 788-reference grep count (A5) and the optional-slot-grammar degeneracy argument (A1) are unique to 04 and forced both the per-type slot rules (C-3) and the dropping of the S5/Kauffman framings (D-3).
- **Lens 05.** The empirical engineering estimate: 112 file moves, ~900 path references, ~50–70 LoC tool changes, three-commit migration discipline. The cost asymmetry table (§H) with optimistic/expected/pessimistic columns is the load-bearing input to D-1.
- **Lens 06.** The cross-repo portfolio survey (§A) is unique to 06 — no other lens read the five repos. The 1k-vs-10k-files projection (§B) and the reflection-tower-as-folder rejection argument (§C) are unique. The "drift detection without resolution rule is half a feature" framing (§I.8) is the move that escalated cross-repo from follow-on work to a named blocker.
- **Lens 07.** The convergent-verdict synthesis itself, structured as a 7-step amendment cascade (§E). Unique value: the dissolution-by-narrowing move on the A2 constitution conflict (step 4), which is the load-bearing tactical move that made the whole adoption sequence tractable.
- **Deepest-thing-empirical.** The snapshot-hash progression (v0 → v0.1 → v0.2) as on-disk evidence the residue clock has started — unique to this lens.
- **Deepest-thing-historical.** The 15-year-Vladimir / WhatsApp / GEB cross-substrate convergence narrative — unique to this lens.
- **Deepest-thing-structural.** The three-piece narrowed novelty claim (diachronic reflection tower + Spivak split + RG/Noether) and the form/content crystallization — unique to this lens.

## Open Questions Forwarded to Discovery

These are decision-shaped questions that lens-layer investigation could not resolve.

- **Q-R1.** Should sessions ever be promoted to Unit shape, or remain forever leaf? **Recommendation.** Stay leaf; revisit only if session count exceeds 1k and flat layout becomes unbrowsable; even then prefer date-partitioned subfolders, not Unit promotion. Matches discovery OQ-1.
- **Q-R2.** Should `premise/` and `axiom/` collapse to a unified `claims/` folder with `node_type` discriminator in frontmatter? **Recommendation.** Defer to whichever resolves first: `epistemic-chain.md` OQ-6 (edge-target identity under promotion) or the next round of measured promotion-frequency data. Matches discovery OQ-3.
- **Q-R3.** Does the cross-repo schema-canonicalization protocol need its own discovery, or can the canonicalization rule be added to the new constitution? **Recommendation.** Separate discovery — the canonicalization rule depends on cross-repo ownership decisions that this discovery's scope explicitly excludes (D-2). Matches discovery OQ-4.
- **Q-R4.** Will the `layer:` field become a derived projection of `node_type` once corpus data accumulates, or remain a stored cross-check? **Recommendation.** Collect 30 days post-migration, then decide; the cross-check value is in catching path/content drift during the migration window, which is the highest-risk period. Matches discovery OQ-6.
- **Q-R5.** *(specific to this folder, not in the discovery's OQ list.)* Should the convention recognize a `synth-lens` sub-role explicitly, given lens 07's existence as a proto-`research.md` written inside the lens layer? **Recommendation.** Surface as a convention-amendment proposal, *not* as a discovery OQ here. This is meta-convention, not folder-structure.

## Provenance

- **Lens slate dispatched on.** 2026-05-16 (per all individual lens `date` fields in the pre-migration headers, now preserved in each `findings.md` under "Provenance (pre-migration lens header)").
- **Dispatch waves.** Wave 1 = lenses 01–03 (catalog + proposal + external survey, parallel-fanout). Wave 2 = lenses 04–07 (adversarial + cost + long-term + proto-synthesis). The three `deepest-thing-*` lenses were dispatched as session-level reflections, not as load-bearing investigation lenses (see discovery §6 demotion).
- **Strategist.** Not recorded. These lenses predate the `/domainspec-subagents-strategy` skill's bootstrap convention; no strategist file exists. **Backfill status:** `backfilled-no-prompt-recoverable` on every `findings.md`.
- **Lens count.** 10 total (7 investigation + 3 session-reflection). The 7-cap from `discovery-structure-constitution.md` §1 is *exceeded by count* if the deepest-thing-* lenses count as investigation lenses; the discovery's framing demotes them to session-reflective, which keeps the investigation count at 7 (within cap) and the total at 10 (in the folder by historical fact).
- **Notable absences.** No lens dispatched on: (a) the validator-code design itself (deferred to implementation); (b) the post-migration empirical measurement plan (named in discovery D-1 deferred-trigger but not lens-dispatched); (c) the cross-repo canonicalization protocol (blocked per D-2; owed as a separate discovery).
- **Proto-synthesis acknowledgment.** Lens 07 is structurally a proto-`research.md` written inside the lens layer. This `research.md` cites it as a primary input rather than a peer lens (see Theme 7 above). The dispatch shape violated the convention's "lens layer is flat" assumption; backfill handles this by retrofitting both 07 and this `research.md` rather than reorganizing the dispatch history.

## Connections

- `retrofits` → `../lenses/01-prior-research-catalog/findings.md`
- `retrofits` → `../lenses/02-fractal-folder-theory/findings.md`
- `retrofits` → `../lenses/03-external-prior-art/findings.md`
- `retrofits` → `../lenses/04-adversarial-attack/findings.md`
- `retrofits` → `../lenses/05-migration-cost-estimate/findings.md`
- `retrofits` → `../lenses/06-long-term-cross-repo/findings.md`
- `retrofits` → `../lenses/07-wave-2-synthesis-and-verdict/findings.md`
- `retrofits` → `../lenses/deepest-thing-empirical/findings.md`
- `retrofits` → `../lenses/deepest-thing-historical/findings.md`
- `retrofits` → `../lenses/deepest-thing-structural/findings.md`
- `synthesizes` ← `../lenses/01-prior-research-catalog/findings.md`
- `synthesizes` ← `../lenses/02-fractal-folder-theory/findings.md`
- `synthesizes` ← `../lenses/03-external-prior-art/findings.md`
- `synthesizes` ← `../lenses/04-adversarial-attack/findings.md`
- `synthesizes` ← `../lenses/05-migration-cost-estimate/findings.md`
- `synthesizes` ← `../lenses/06-long-term-cross-repo/findings.md`
- `synthesizes` ← `../lenses/07-wave-2-synthesis-and-verdict/findings.md`
- `synthesizes` ← `../lenses/deepest-thing-empirical/findings.md`
- `synthesizes` ← `../lenses/deepest-thing-historical/findings.md`
- `synthesizes` ← `../lenses/deepest-thing-structural/findings.md`
- `cited-by` → `research-synthesis.md`
- `cited-by` → `../discovery.md`
