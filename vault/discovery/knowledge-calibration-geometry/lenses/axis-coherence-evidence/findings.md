---
tags: [coherence, evidence, literature, lens, knowledge-calibration-geometry, refinement]
node_type: findings
is_session: false
layer: architecture, application
nature: explanatory, reference
status: active
dispatch_status: lens-agent-3-of-4
lens_order: third
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Findings — Internal Coherence + External Evidence Lens on `knowledge-calibration-geometry` v0.4.0

## Instantiation

**Axis:** Internal coherence + External evidence (Lens 3 of 4).

**Modes:**
- **Mode A — Internal coherence.** Cross-hypothesis consistency (H-1..H-11), hypothesis ↔ Working Model alignment, hypothesis ↔ Alternatives (A-1..A-6), hypothesis ↔ Open Questions coverage, High-Level Summary (line 128) vs detailed hypotheses, terminology drift (`C_head`/`C_spec`/`C_system`/"reference surface"/"geometry"/"consistency"/"distance"), scope drift.
- **Mode B — External evidence.** Critique of L-1..L-5; missing pillars (knowledge engineering, epistemic communities, theory of mind in NLP, calibration of belief/Brier, formative assessment, expertise transfer, Polanyi, Wenger, Star & Griesemer, Hutchins); pillars-as-guardrails-vs-ornament; citation discipline.

**Target (read-only):** `/Users/victorboscaro/domainspec/vault/discovery/knowledge-calibration-geometry/discovery.md` (693 lines, v0.4.0).

## Method

Read the full discovery once end-to-end, then re-read the joinable sections: High-Level Summary (lines 128–141), Working Hypotheses H-1..H-11 (lines 144–325), Working Model (lines 329–577), Alternatives A-1..A-6 (lines 580–616), Open Questions OQ-1..OQ-23 (lines 620–645). Cross-checked each hypothesis against (a) its restatement in the High-Level Summary, (b) its reflection in the Working Model tables, (c) the alternative it is meant to defeat, and (d) at least one OQ that should follow from it. Tracked every appearance of key terms and recorded the meaning carried at each site. Read the reference adversarial-review lens to match frontmatter shape. Did not grep the wider vault — kept the lens scoped to the target doc.

For Mode B, walked each L-1..L-5 pillar with "if I delete this, does any hypothesis change?" and walked a candidate missing-pillar list with the inverse test.

## Findings — Internal coherence

### C1. H-11 (action-bearing metric) vs OQ-23 (when are aggregates allowed) — internal contradiction
**Location.** H-11 lines 309–325 vs OQ-23 line 645 vs anti-pattern list line 478 vs `alignment(group)` line 398.
**Conflict.** H-11 reads as an absolute gate ("DomainSpec should reject any metric…"); OQ-23 reopens it conditionally ("only after…"). The Working Model ships `alignment(group)` as an aggregate while banning aggregates as anti-pattern.
**Why it matters.** Load-bearing product gate is internally contradictory. A reader cannot tell whether aggregates are forbidden, conditional, or shipped-by-default.
**Suggested resolution.** Restate H-11 as "metrics must be locally action-bearing *before* being allowed to aggregate; OQ-23 lift criteria gate aggregates."

### C2. H-9's "questions the person asks" is also H-3's primary probe — same observable, two warrants, no reconciliation
**Location.** H-9 line 285 (inferred evidence for `C_head`) vs H-3 lines 175–184 (probe of `C_spec`/`C_system` answerability).
**Conflict.** Same observable yields evidence on two sides simultaneously. The evidence-design matrix (lines 381–388) presumes one observable → one inference.
**Suggested resolution.** Add a "co-evidence" axis; state explicitly that bidirectional probes yield independent warrants on both sides.

### C3. H-6 (collective is separate object) vs OQ-6 (aggregation from individuals)
**Location.** H-6 lines 215–229 vs OQ-6 line 628.
**Conflict.** Either collective is its own first-class object (needs group-level probes) or it is a function of individuals (then "separate object" language is wrong). Discovery does both.
**Suggested resolution.** Commit to one. If first-class, add OQs for group-level elicitation. If aggregated, drop "separate product object."

### C4. Summary silently drops H-1's "More categories may emerge later"
**Location.** Summary item 1 line 130 vs A-4 line 600 vs OQ-2 line 623 vs H-7 line 233.
**Drift.** Discovery commits to two growth paths at once: (a) subcategories inside `C_spec` (H-7), (b) new top-level categories later (H-1 hedge + OQ-2). OQ-2b names the tension but doesn't resolve it. Working Model implicitly chooses (a) by giving `C_spec` a subcategory table and the others none.
**Suggested resolution.** Make the (a) commitment explicit; reframe OQ-2 as a test case for OQ-2b.

### C5. "Reference surface" has three undeclared scopes
**Location.** H-5 lines 202–213 (operational, scope unstated) vs distance table line 394 (`d(head_i, reference)` singular) vs OQ-3 line 625 (per-domain) vs first experiment line 512 (per-task).
**Drift.** Three scopes for the same term. Without fixing scope, no distance is well-defined.
**Suggested resolution.** State reference is **per-task-family within a domain**. Then `d(head_i, reference(task_family))`, and OQ-3 reduces to "what is canonical for `reference(task_family)`?"

### C6. A-2 (generic quiz engine) is a straw man
**Location.** A-2 lines 588–592 vs H-3 lines 175–184.
**Conflict.** A-2 attacks the *target* (accuracy/speed), not the *mechanism*. H-3 uses the same mechanism a quiz engine uses.
**Suggested resolution.** Rewrite A-2 as: "Treat the product as a single-axis correctness scorer with no intra/inter-category, direct/inferred, or declared/operational distinctions."

### C7. A-5 (FF as first metric) rejected without lift criteria
**Location.** A-5 lines 605–610 vs OQ-11 line 633.
**Drift.** No evidence is named that would lift FF from horizon to product. A-5 is permanently true by construction.
**Suggested resolution.** Add lift criteria to H-5: e.g., (a) stable categorical semantics for reference, (b) checkable functoriality of `C_spec → C_system`, (c) at least one validated construct map for `C_head`.

### C8. OQ-12 (frame falsifier) is unbacked by any hypothesis
**Location.** OQ-12 line 634; kill-signal list lines 528–533 is per-experiment, not per-frame.
**Why it matters.** 11 hypotheses + 23 OQs with no frame-level falsifier is a manifesto, not a research frame.
**Suggested resolution.** Promote the kill-signal list to a frame falsifier or add an explicit hypothesis stating the falsifier.

### C9. `Spec.specification` vs "structured specs" — same subcategory, two names
**Location.** H-7 line 241 vs Working Model line 349.
**Drift.** Minor but corrosive; the parent-name-repeated subcategory (`Spec.specification`) also signals taxonomy is unstable.
**Suggested resolution.** Rename one; if `Spec.specification` is kept, justify why it differs from `Spec.ontology` + `Spec.rules` combined.

### C10. H-8's single event `formalization-created` vs Working Model's three event classes
**Location.** H-8 lines 248–266 vs Working Model lines 564–576 vs OQ-13 line 635.
**Drift.** Expansion from one candidate to three classes happens silently between hypothesis and model.
**Suggested resolution.** Update H-8 to reference the three-class taxonomy or derive the three classes from `formalization-created`'s lifecycle.

### C11. Scope drift: H-9 declares 12 evidence channels; first experiment uses 5–7, all direct
**Location.** H-9 lines 268–290 vs first experiment line 513.
**Drift.** Experiment covers ~half the declared channels and zero inferred channels, not labelled as a deliberate cut.
**Suggested resolution.** Label experiment as "direct-elicitation smoke test only; inferred-channel deferred until …" and add a kill criterion acknowledging this.

## Findings — External evidence

### E1. Four of five pillars are ornament; only L-5 is load-bearing
- **L-1 (shared mental models)** — removed: H-6 loses precedent. Light guardrail.
- **L-2 (requirements elicitation)** — removed: H-8 loses precedent. Light guardrail.
- **L-3 (SECI/tacit-explicit)** — removed: nothing changes. **Ornament.**
- **L-4 (human-AI co-formation)** — removed: nothing changes. **Ornament.**
- **L-5 (psychometrics)** — removed: H-10 + entire psychometric guardrails subsection collapses. **Load-bearing.**

**Suggested resolution.** Operationalize L-1..L-4 (borrow ≥1 named construct each that constrains a hypothesis), or demote to "Background reading."

### E2. Citation discipline: links exist but anchor to no specific claim
**Location.** L-1..L-5 list URLs; no H-X cites a specific work to support a specific claim. Citations sit in the L-section and never reappear.
**Suggested resolution.** Either anchor each citation to a hypothesis (e.g., "H-10 follows Mislevy ECD") or move to a bibliography and stop calling it "pressure."

### E3. Missing pillar — Knowledge engineering / ontology engineering (Gruber, Studer, Noy & McGuinness)
**Justification.** `C_spec`'s subcategory list is exactly KE/ontology engineering's territory since the 1990s. Gruber's "explicit specification of a conceptualization" is the canonical formulation of what `C_spec` is. Noy & McGuinness's "Ontology 101" gives operational rules for when a concept becomes its own class — directly relevant to OQ-2b (category vs subcategory).
**Load-bearing?** Yes. OQ-2b becomes "apply Noy & McGuinness criteria" rather than re-derived from scratch.

### E4. Missing pillar — Calibration of belief / epistemic uncertainty (Brier, Cooke, Tetlock)
**Justification.** Discovery uses "calibration" 20+ times but never engages technical calibration literature. Brier scores are canonical for confidence-vs-outcome calibration (relevant to H-9 confidence ratings + H-10). Cooke's classical model gives calibration-weighted expert aggregation (OQ-6). Tetlock gives empirical baselines.
**Load-bearing?** Yes. Without it, "calibration" is metaphor. With it, H-10 acquires real primitives.

### E5. Missing pillar — Communities of practice (Wenger) + boundary objects (Star & Griesemer)
**Justification.** H-6's "collective alignment" is Wenger's "negotiation of meaning." `C_spec` artifacts are Star & Griesemer's boundary objects — meant to hold meaning across communities without forcing consensus. Resolves OQ-4 (when is divergence error vs evidence-of-drift) — boundary objects are *expected* to be interpreted differently.
**Load-bearing?** Yes for H-6, C3, and OQ-4.

### E6. Missing pillar — Distributed cognition (Hutchins, "Cognition in the Wild")
**Justification.** Discovery treats `C_head` as per-person container. Hutchins reframes cognition as distributed across people+artifacts+environment — directly conflicts with the container model. Engages C2 (a `person -> system` question may be cognition happening *across* the pair).
**Load-bearing?** Yes. Discovery must either reject distributed cognition explicitly or add a relational view.

### E7. Missing pillar — Polanyi tacit knowledge in depth (not just via SECI)
**Justification.** L-3 cites SECI (which is derived from Polanyi) but not Polanyi directly. "We know more than we can tell" is the foundational claim under H-9's inferred-channel.
**Load-bearing?** Medium. Strengthens H-9.

### E8. Missing pillar — Formative assessment (Black & Wiliam)
**Justification.** "Anti-dashboard" + "calibration queue, not score" is exactly assessment-*for*-learning vs assessment-*of*-learning. "Inside the Black Box" gives 25 years of empirical findings on feedback-that-drives-action (H-11) vs feedback-that-grades (A-3).
**Load-bearing?** Yes for H-11 and A-6.

### E9. Missing pillar — Theory of mind in NLP / LLMs (Sap, Ullman)
**Justification.** H-3's `system -> person` probes presume the LLM can model what the user does not know well enough to ask productive questions. Recent ToM-in-LLM literature is directly relevant to whether H-3's mechanism is feasible.
**Load-bearing?** Medium. Implementation-feasibility for H-3.

### E10. L-section's "does not claim external validation" is overcautious to underclaim
**Location.** Line 60.
**Critique.** Humility is fine, but the discovery then doesn't engage the literature. Either constrain hypotheses with it or drop to a one-paragraph "Related work."

## Terminology audit

| Term | Section | Meaning used | Drift? |
|------|---------|--------------|--------|
| `C_head` | H-1 line 150 | "knowledge internalized by a person or group" | baseline |
| `C_head` | WM line 335 | adds "or teams" without resolving fork | mild — see C3 |
| `C_head` | H-6 line 219 | individual only | drift |
| `C_spec` | H-1 line 151 | docs, ontology, structured artifacts, rules | baseline |
| `C_spec` | H-7 line 233 | broad category, internal subcategories | adds layer |
| `C_spec` | line 462 | "what the spec says" (conceptual diff) | drift — loses breadth |
| `C_system` | H-1 line 152 | exec behavior, schemas, code, telemetry | baseline |
| `C_system` | line 462 | "what the system does" | consistent (compressed) |
| `C_system` | OQ-2 line 623 | implicit boundary question with telemetry | drift — undecided |
| reference surface | H-5 line 209 | best auditable system of record (singular) | baseline |
| reference surface | line 394 | `d(head_i, reference)` (singular, scope unstated) | drift — see C5 |
| reference surface | OQ-3 line 625 | per-domain | drift |
| reference surface | line 512 | per-task | drift |
| geometry | line 56 / summary | distances between categories | baseline |
| geometry | H-4 line 188 | distance/topology not accuracy | consistent |
| geometry | line 198 | "preserves information" | mild drift — new info-theoretic flavor |
| consistency | H-2 line 158 | intra-coherence vs inter-fidelity | baseline |
| consistency | OQ-1 line 622 | undefined for `C_head` | confirms non-operational |
| distance | H-4 line 190 | 5 enumerated types | baseline |
| distance | line 392 table | 5 entries, mixes distance with `alignment(group)` (coherence score, not distance) | drift — type-mixing |
| alignment | H-6 line 220 | collective coherence | baseline |
| alignment | line 398 | `alignment(group)` metric | consistent |
| alignment | A-1 line 586 | tacit↔formalized gap | drift — different meaning |
| fidelity | summary item 5 | operational term | baseline |
| fidelity | H-2 line 163 | inter-category translation | consistent |
| fidelity | H-6 line 219 | person↔reference | drift |
| drift | summary item 5 | operational term | baseline |
| drift | line 397, H-1 line 154 | category↔reference gap over time | consistent |
| residue | summary item 5 | operational term | baseline |
| residue | line 408 | direct↔inferred evidence disagreement | drift — different concept |
| calibration | passim (20+) | informal alignment-with-reference | drift across registers — see E4 |

**Headline drift:** reference surface (3 scopes), distance table (mixes distance with coherence), alignment/fidelity/residue each carry two meanings within the doc. Working Model line 392 table is the densest drift site (5 rows, 4 collisions with earlier sections).

## What I did NOT cover

- Did not evaluate against other vault discoveries (`domainspec-axioms/discovery.md` cited line 678, not opened).
- Did not check that cited URLs resolve or that cited works say what the discovery implies — citation discipline critique is structural, not content-verifying.
- Did not check frontmatter compliance.
- Did not evaluate the Connections block.
- Did not propose a v0.5.0 redraft; brief asks for findings.
- Did not check H-1..H-11 for plagiarism risk against external prior art — only whether cited adjacent work does real work.
- Did not check inter-document terminology drift between this discovery and `DRIFT-CONVERGENCE.md` / `TUNING-LOOP.md`.

## Connections

- Refines: [[knowledge-calibration-geometry/discovery]] — Hypotheses + Working Model + Alternatives + Open Questions, with full terminology audit.
- Sibling lenses: [[axis-adversarial-constructive]], [[axis-psychometric-geometric]], [[axis-hypotheses-model]].
