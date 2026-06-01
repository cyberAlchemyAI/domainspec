---
tags: [findings, synthesis, knowledge-calibration-geometry, refinement]
node_type: subagents-findings
is_session: false
layer: architecture, application
nature: explanatory, reference
status: active
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Findings — Refinement of `knowledge-calibration-geometry/discovery.md` v0.4.0

> Synthesis across four parallel lenses. Per-lens raw output lives in `lenses/`; mechanical assembly in `research/research.md`. Every claim here cites a lens passage by ID.

## Context

User asked for a refinement pass on `vault/discovery/knowledge-calibration-geometry/discovery.md` (693 lines, v0.4.0) — the load-bearing discovery framing DomainSpec as a knowledge-calibration surface across `C_head`, `C_spec`, `C_system`, with psychometric guardrails. Architecture: 4 parallel lens children → research.md (mechanical) → findings.md (this file, synthesis).

## Goal

Surface the cross-cutting patterns the 4 lenses converged on, resolve their few disagreements, and emit a prioritized patch list keyed to load-bearing vs cosmetic — so the user can produce a v0.5.0 draft without re-reading 4 lens files and 800 lines of source.

## Dispatch record

**Mode:** flat fan-out (4 parallel children, single layer).

| Agent id | Lens slug | Model | Difficulty justification | Declared output shape |
|---|---|---|---|---|
| agent-1 | `axis-adversarial-constructive` | general-purpose | Two-mode broad audit (pressure-test + tightening) over 693-line discovery | Numbered A/C findings + cross-cutting |
| agent-2 | `axis-psychometric-geometric` | general-purpose | Technical-rigor audit against measurement/psychometric canon | Numbered P/G findings + glossary |
| agent-3 | `axis-coherence-evidence` | general-purpose | Cross-hypothesis consistency + literature pillar value test | Numbered C/E findings + terminology audit |
| agent-4 | `axis-hypotheses-model` | general-purpose | Per-hypothesis falsifiability scorecard + experiment operationalization | Scorecard + dependency graph + MVP design |

**Sequencing:** parallel set, all 4 against the same read-only target.

**Recursion budget actually used:** depth = 1, breadth = 4, total agents = 6 (4 original + 2 re-runs for agents whose first run lost content to subagent Write restriction).

**Four-component grade (judgments):**

| Component | Score (0–1) | Note |
|---|---|---|
| Coverage | 0.85 (judgment) | All 4 axes covered the doc end-to-end; lens 3 explicitly didn't open sibling vault docs; lens 1 didn't open `vault-newspaper/discovery.md`. |
| Independence | 0.80 (judgment) | Lenses overlapped on math-as-decoration and aggregates contradiction (4-way and 3-way convergence respectively), which is *good* — independent triangulation, not duplication. |
| Fidelity | 0.90 (judgment) | All 4 lenses cited line numbers and quoted snippets; no hand-waving. |
| Cost discipline | n/a | No budgets were declared per agent; orchestrator did not track per-agent tokens. |

> R22 reminder: three of four scores are judgments dressed in numbers. Cost is not measured here.

## Findings

### F1 — Math-as-decoration is the dominant systemic pattern (4-way convergence)

- **Claim:** "Geometry," "distance," "metric," "topology," "functorial," "fully faithful" are used as branding throughout the discovery without committed carrier spaces or axioms; this is the single most-cited weakness across lenses and matches existing orchestrator memory ("don't dress heuristics in math vocabulary").
- **Evidence.** Lens 1 A1 / A2 / A9 (title, H-4, `d(...)` table, FF in A-5/OQ-11 — "borrowed prestige, never gloss"). Lens 2 G1 / G2 / G3 / G4 / G10 (no carrier space; metric axioms unverified; Stevens scales never addressed; categorical bridge deferred without naming the measurement-theoretic layer that should sit underneath). Lens 3 terminology-audit row on `distance` (line 392 table "mixes distance with `alignment(group)` (coherence score, not distance) — drift, type-mixing"). Lens 4 dependency graph treats H-4 as load-bearing on H-2 and feeding H-6/H-11, so the geometric framing is the structural backbone — making the decoration risk maximum.
- **Implication.** This is the discovery's biggest single risk. Either commit to one axiomatic minimum (Lens 2 G1 suggests categorical distribution over rubric levels + √JSD as the v1 carrier-and-metric pair), or downgrade the title and prose to "topology of divergences — discipline, not math" (Lens 1 A1). The current middle ground is the worst option.

### F2 — `C_head` construct definition is the load-bearing missing piece (2-way explicit + 1 implicit)

- **Claim:** `C_head`, the central object, floats between latent continuous trait, discrete knowledge state, and behavioral disposition — three psychometric frameworks with incompatible math. No downstream metric can be chosen until this fork is resolved.
- **Evidence.** Lens 2 P1 (the most load-bearing single finding in the dispatch: IRT vs DINA/G-DINA/LCDM vs propensity estimation). Lens 1 A4 (heavy psychometric machinery cited — Messick, Kane, AERA/APA/NCME — without naming one running construct). Lens 4 hypotheses-scorecard implicitly: H-1 only "partial" falsifiability because the construct-type drop-test is missing.
- **Implication.** Add a subsection under H-1 ("What kind of object is `C_head`?") naming the three candidate types and stating the choice gates the metric family (Lens 2 P1 patch). Without this, every measurement claim downstream is provisional in a way the discovery does not currently flag.

### F3 — Three "hypotheses" are actually governance gates (2-way explicit)

- **Claim:** H-5, H-10, H-11 are non-falsifiable disciplinary commitments. Mixing them into a "Working Hypotheses" list of 11 inflates apparent empirical content and makes the reader unable to tell which items are bets that can fail.
- **Evidence.** Lens 1 A3 ("H-11 is a product policy, not a hypothesis; H-5 explicitly self-labels 'Immediate language discipline'; H-10 is a governance gate"). Lens 4 hypotheses-scorecard buckets H-5/H-10/H-11 as N-falsifiable (3 of 11), explicitly proposing reclassification as "language rule" and "guardrail." Lens 2 G5 independently arrived at the same conclusion for H-11: "Rename H-11 to 'Metric admissibility gate'; it specifies necessary conditions, not a metric."
- **Implication.** Split the H-section into two: **Working Hypotheses** (H-1, 2, 4, 6, 7, 8, 9 — actual bets) and **Disciplinary Commitments / Governance gates** (H-5, H-10, H-11). Add a `kind:` field per row.

### F4 — Aggregates contradiction inside the load-bearing product gate (Lens 3 standalone, sharpened by Lens 2)

- **Claim:** H-11 (action-bearing metric) reads as an absolute ban on non-action-bearing aggregates; OQ-23 reopens it conditionally; the Working Model itself ships `alignment(group)` while listing aggregates as anti-pattern. A reader cannot tell whether aggregates are forbidden, conditional, or shipped-by-default. This is the load-bearing product gate, and it contradicts itself within the same document.
- **Evidence.** Lens 3 C1 (cites H-11 lines 309–325 vs OQ-23 line 645 vs anti-pattern list line 478 vs `alignment(group)` line 398 — four sites in one document). Lens 2 G11 sharpens the geometric side: `alignment(group)` itself silently conflates `cohesion(group)` (within-group dispersion) and `bias(group, reference)` (mean distance from reference) into one scalar, which is exactly the kind of action-irrelevant aggregate H-11 says to reject.
- **Implication.** Restate H-11 as "metrics must be locally action-bearing *before* being allowed to aggregate; OQ-23 lift criteria gate aggregates." Then either drop `alignment(group)` from the v0.5.0 distance table or replace it with the two-component (cohesion, bias) decomposition Lens 2 proposes.

### F5 — Reference surface has 3 undeclared scopes; every cross-category distance depends on it (3-way convergence)

- **Claim:** "Reference surface" is used singular global (H-5), per-domain (OQ-3), and per-task (first experiment), with no scope declaration. Every distance in the working model is `d(_, reference)`. Plus: there is no projection layer specified that would let `C_head`, `C_spec`, `C_system` even be compared — they live in different ontological types.
- **Evidence.** Lens 1 A5 ("never defined operationally despite being load-bearing; H-5 offers four phrasings as interchangeable"). Lens 3 C5 (the three-scopes citation, with exact line numbers). Lens 2 G12 (the canonical-claim-layer gap: cross-category distances assume a shared scale that does not exist).
- **Implication.** Two coupled patches: (a) state reference is **per-task-family within a domain** (Lens 3 C5 patch), then `d(head_i, reference(task_family))`; (b) add a new working hypothesis (H-13 in Lens 2's G12 numbering, or H-12 in Lens 4's numbering — pick one) for the canonical claim layer that mediates cross-category comparison.

### F6 — Reliability silence caps the whole validity argument (1-way explicit, 2-way implicit)

- **Claim:** The word "reliability" appears once in the discovery, as a checklist item. Without reliability operationalization, validity is provably bounded (validity ≤ √reliability). The whole psychometric guardrail edifice is built on an unstated floor.
- **Evidence.** Lens 2 P4 (explicit and detailed: test-retest, internal consistency, inter-rater, G-theory all absent — and crucially LLM-as-judge will be the dominant scoring mechanism, making inter-rater the most urgent). Lens 2 G8 sharpens this for the rater problem specifically. Lens 4 implicitly via the "anti-dashboard discipline is aspirational, not enforceable — no gatekeeper, no failure mode": without reliability, there is no threshold against which to enforce.
- **Implication.** Add a subsection "Reliability — sources of measurement error" under Psychometric guardrails (Lens 2 P4 patch). Require dual rater + κ for any LLM-scored open-response probe (Lens 2 G8 patch). Tie the anti-dashboard discipline to a specific reliability floor (e.g., ω ≥ .7) so the discipline is enforceable rather than aspirational (Lens 4 finding 3).

### F7 — Doc grew by accretion; ~80–120 lines reclaimable without information loss (2-way convergence)

- **Claim:** The same argument is made 2–4 times across non-adjacent sections; the Working Model has expanded past the Hypotheses section into experiment-design territory, contradicting the discovery's own line-24 "pre-implementation" framing.
- **Evidence.** Lens 1 C1 / C8 / C10 (Hypothesis paragraph vs High-Level Summary; H-11 vs Anti-dashboard vs Product-entry test vs Prohibited uses; H-8 vs rule-formation footer). Lens 1 A13 (Working Model ~250 lines, Hypotheses ~140 lines — weight inverted). Lens 3 C10 (H-8's single event quietly expands to three event classes in Working Model). Lens 3 C8 (OQ-12 = frame falsifier, buried — kill signals exist in first experiment but are not promoted to frame-level).
- **Implication.** Concrete reclamation plan: (a) Make the High-Level Summary a 1-line-per-H table linking to expanded sections (Lens 1 C2). (b) Collapse the four duplicates of the anti-aggregation argument into one canonical block (Lens 1 C8). (c) Move "First experiment shape" and "Validation ladder" to a sibling experiment doc (Lens 1 A13). (d) Move "Possible rule-formation event" inside H-8 (Lens 1 C10). (e) Promote OQ-12 + kill-signals to the Objective (Lens 1 A12 + Lens 3 C8).

### F8 — Of L-1..L-5, only L-5 (psychometrics) is load-bearing; 4 missing pillars do real work (Lens 3 standalone)

- **Claim:** Removing L-3 (SECI) or L-4 (human-AI co-formation) changes no hypothesis; they are ornament. Four named missing pillars (knowledge engineering, calibration-of-belief, communities-of-practice/boundary-objects, distributed cognition) each solve at least one currently open question.
- **Evidence.** Lens 3 E1 (delete-test for each L-pillar). Lens 3 E3 (knowledge engineering = Gruber/Studer/Noy & McGuinness — resolves OQ-2b on category vs subcategory). Lens 3 E4 (calibration-of-belief = Brier/Cooke/Tetlock — makes the 20+ uses of "calibration" operational; partly addressed also by Lens 2 P8 distinguishing confidence calibration from product calibration). Lens 3 E5 (Wenger + Star & Griesemer — resolves OQ-4 on divergence-as-error vs evidence-of-drift). Lens 3 E6 (Hutchins distributed cognition — discovery must reject it explicitly or add a relational view of `C_head`).
- **Implication.** Operationalize L-1..L-4 (borrow at least one named construct per pillar that constrains a hypothesis), or demote them to "Background reading." Add the four missing pillars and anchor each to a hypothesis or OQ it resolves.

### F9 — First experiment is under-specified for "two engineers, two weeks" (2-way convergence on operational gap)

- **Claim:** The First Experiment Shape, Validation Ladder, and Rule-Formation Event are sketches presented as runnable plans. Sample sizes are below psychometric thresholds, kill-switches are prose-only, and the most epistemically dangerous step (classify-divergence-by-source) is the least specified.
- **Evidence.** Lens 4 Mode-B finding 1 (no sample-size logic, recruitment plan, time budget, instrumentation, kill-switch table — needs Resources & Cost table). Lens 4 finding 2 (validation ladder jumps from 2–3 → 20–40 with no probe-stability rung). Lens 4 finding 3 (anti-dashboard discipline has six gate questions but no gatekeeper). Lens 2 P9 (20–40 participants is underpowered: IRT needs ≥200, G-theory ≥30 per facet level; "beats baseline" has no effect-size target). Lens 2 G14 (the classify-divergence step is the scoring inference in Kane's framework — without inter-rater + Bayesian source attribution + calibration set, the whole smoke test's interpretability is unbacked).
- **Implication.** Cheapest first move converges across both lenses: **`d(spec, system)` drift micro-probe** (Lens 4 explicit MVP, with success/kill criteria, ~40–50 person-hours). Add: (a) a Resources & Cost table to any experiment, (b) effect-size target + power analysis + pre-registration (Lens 2 P9), (c) dual-rater + κ requirement for divergence classification (Lens 2 G14 + G8).

### F10 — Missing hypotheses surfaced by the operational lens (Lens 4 standalone)

- **Claim:** The 11 hypotheses miss two that the experiment shape implicitly depends on: H-12 drift detection lag and H-13 recruitment/consent feasibility.
- **Evidence.** Lens 4 hypotheses-Mode-A items 7 and 8.
- **Implication.** Either add H-12 (calibration-loop value depends on time-to-surface ≤ T) and H-13 (sustained voluntary participation is achievable for the elicitation cadence H-3/H-9 assume), or attach them to the existing H-3/H-9 as explicit preconditions whose failure kills the parent hypothesis.

## Analysis

### Cross-cutting patterns (synthesis, not in any single lens)

**P-A. Math-as-decoration and missing construct definition are the same failure at two layers.** F1 (the geometric layer — no carrier space, no metric axioms) and F2 (the psychometric layer — `C_head` floats between three construct types) are not independent issues. Choosing a carrier (e.g., categorical distribution over rubric levels per Lens 2 G1) requires having chosen a construct type first (latent trait → continuous embedding; knowledge state → discrete vector; behavioral disposition → propensity). The fix order is: **resolve F2 first** (pick a construct type for `C_head`), **then F1 becomes tractable** (each construct type narrows the carrier candidates and admissible distance family). Doing them independently risks committing to a metric that is wrong for the chosen construct.

**P-B. Three of four lenses arrived at the same hypothesis-vs-governance split.** F3 is unusual in that Lens 1 (adversarial), Lens 2 (psychometric-geometric — independently for H-11), and Lens 4 (hypothesis scorecard — formally for H-5/H-10/H-11) converged without coordination. When lenses with different priors land on the same structural fix, that is the strongest signal in the dispatch. Treat F3 as a free win — low cost, high clarity gain.

**P-C. The "reference surface" cluster (F5) plus the "cross-category claim layer" gap (Lens 2 G12) plus the `d(spec, system)` coverage/conformance collapse (Lens 2 G3) form one unresolved architectural decision.** The discovery has not chosen what mediates between `C_head`, `C_spec`, `C_system`. Without that mediation, no cross-category distance is well-defined, and the central "geometry" claim is structurally incomplete — independently of any axiomatic decoration concern. This is the most expensive single fix to design but the most load-bearing one for the product.

**P-D. The discovery is honest about being early but quietly drifts into product spec.** F7 + Lens 1 A13 + Lens 4 viability finding all observe the same drift: a doc that says "pre-implementation" on line 24 contains a Validation Ladder by line 537. The Working Model section has accreted into territory that belongs in a sibling experiment-design doc. Splitting it out is structurally clean (Lens 1 A13) *and* matches Lens 4's recommendation that the experiment design needs a separate pass anyway.

### Tensions between lenses (resolved here)

**T1. Lens 1 A11 calls L-1..L-5 hedges "epistemically empty"; Lens 3 E1 says only L-5 is load-bearing but L-1/L-2 have light precedent value.** Not a real contradiction — Lens 3 is more specific. **Resolution:** keep L-1 and L-2 (each provides precedent for one hypothesis), operationalize them by anchoring to that hypothesis (per Lens 3 E2 patch on citation discipline), and demote L-3 and L-4 to "Background reading." Add the four new pillars from F8.

**T2. Lens 4 assigns H-3 falsifiability "Y"; Lens 1 A7 says H-3 quietly assumes adoption.** Not contradictory — Lens 4 also flags H-3 as "Bundled" (bidirectionality + game-shaping). Lens 1's A7 is essentially the adoption-feasibility critique of H-3b (the game-shaping half). **Resolution:** Lens 4's split into H-3a (testable) / H-3b (UX bet) absorbs Lens 1's concern: H-3a is what gets the Y rating; H-3b is the adoption bet that needs the Lens 1 A7 thresholds (probes/week, system-questions/week) attached as its falsifier.

**T3. Lens 2 G3 wants to split `d(spec, system)` into coverage + conformance; Lens 4 wants `d(spec, system)` as the MVP first experiment.** Compatible — the MVP should measure both halves of the split from day one. **Resolution:** Lens 4's MVP design with Lens 2 G3's two-column structure: pair every (spec assertion, system observable) with both a coverage check (is this behavior covered by some spec rule?) and a conformance check (does the system satisfy this spec rule?).

### Prioritized patch list for v0.5.0

Ordered by load-bearingness, not by ease.

**Blockers (without these, v0.5.0 is still v0.4.0 with cosmetics):**

1. **Resolve `C_head` construct type** (F2 + P-A). Pick one of {latent trait, knowledge-state vector, behavioral disposition} as the v1 commitment; name the others as future extensions. Gates everything downstream.
2. **Choose reference surface scope + canonical claim layer** (F5 + P-C). State reference is per-task-family within a domain; add H-12 (or H-13, pick consistent numbering) for the claim layer that mediates `C_head`/`C_spec`/`C_system` comparison.
3. **Resolve aggregates contradiction** (F4). Restate H-11 with explicit precedence over OQ-23; either drop `alignment(group)` or decompose into `(cohesion, bias)`.
4. **Reclassify H-5/H-10/H-11 as governance gates** (F3). Split the H-section into Working Hypotheses (7) + Disciplinary Commitments (3 + the language rule).

**Important (rigor — affects whether scores would survive a review board):**

5. **Demote "geometry"/"distance"/"metric" or commit to axioms** (F1 + P-A). After F2 is resolved, either pick categorical distribution + √JSD (Lens 2 G1) as the v1 metric pair, or rename to "topology of divergences — discipline, not math."
6. **Add reliability subsection** (F6). Distinguish occasion / task / rater / domain variance; require G-theory framing; require dual-rater + κ for any LLM-scored probe.
7. **Apply Kane IUA scaffold to H-10** (Lens 2 P2). Replace bullet list with the four-bridge structure (scoring → generalization → extrapolation → implication), warrants per link.
8. **Split H-3 into H-3a (testable) / H-3b (UX bet); attach adoption thresholds to H-3b** (T2). Add H-12 (drift detection lag) and H-13 (recruitment feasibility) per F10.
9. **Split `d(spec, system)` into coverage + conformance** (T3 + Lens 2 G3).

**Structural cleanup (reclaim ~100 lines, sharpen rest):**

10. **Add Working Vocabulary table** under Objective (Lens 1 C7) with `Term | Provisional meaning | Status (committed / TBD)`. Resolves terminology drift documented in Lens 3 audit.
11. **Consolidate the four duplicates of the anti-aggregation argument** (F7 / Lens 1 C8). H-11 + Anti-dashboard + Anti-patterns + Product-entry test → one canonical block referenced from each site.
12. **Promote OQ-12 (frame falsifier) and the kill-signal list to the Objective** (F7 / Lens 1 A12 / Lens 3 C8).
13. **Move "First experiment shape" + "Validation ladder" + "Rule-formation event" to a sibling experiment-design doc** (P-D / Lens 1 A13 / Lens 1 C10).
14. **Convert "Next Moves" (16 bullets) into a `Move | Depends on | Output artifact | Status` table, or prune to top 3 ordered moves** (Lens 1 C11).

**Operational (the next thing to actually run):**

15. **First experiment = `d(spec, system)` drift micro-probe** (F9 / Lens 4 MVP, sharpened by T3 to measure both halves). One feature spec + impl, 5 paired probes, classify divergences, calibration queue (not score). ~40–50 person-hours.
16. **Add Resources & Cost table + power analysis + pre-registration + dual-rater requirement to any experiment** (Lens 4 + Lens 2 P9 + G14).

**Literature gaps:**

17. **Add knowledge engineering, calibration-of-belief, communities-of-practice/boundary-objects, distributed cognition pillars** (F8). Anchor each to a hypothesis or OQ it resolves. Demote L-3 / L-4 to "Background reading."

## Connections

- Refines: [[knowledge-calibration-geometry/discovery]] — synthesis of 4-lens refinement pass.
- Assembly: [[knowledge-calibration-geometry/research/research]] — verbatim per-lens citations.
- Lens children: [[axis-adversarial-constructive]], [[axis-psychometric-geometric]], [[axis-coherence-evidence]], [[axis-hypotheses-model]].
