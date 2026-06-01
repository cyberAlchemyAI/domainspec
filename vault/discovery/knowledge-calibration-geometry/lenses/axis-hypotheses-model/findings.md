---
tags: [hypotheses, model, experiments, operationalization, lens, knowledge-calibration-geometry, refinement]
node_type: findings
is_session: false
layer: architecture, application
nature: explanatory, reference
status: active
dispatch_status: lens-agent-4-of-4
lens_order: fourth
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Findings — Hypotheses Falsifiability + Model/Experiment Operationalization Lens on `knowledge-calibration-geometry/discovery.md`

## Instantiation

Lens Agent 4 of 4. Two modes over the forward-looking half of the discovery:
- **Mode A** — Score each H-1..H-11 on falsifiability, scope, dependencies, load-bearing, bundling. Identify wrong test order, missing hypotheses, conflated node-types.
- **Mode B** — Evaluate Working Model + First experiment shape + Validation ladder + Anti-dashboard discipline + First useful product distances + Rule-formation event + Discovery maturity note. Force every proposal through the "two engineers, two weeks" viability filter.

Target path: `/Users/victorboscaro/domainspec/vault/discovery/knowledge-calibration-geometry/discovery.md` (read-only).

## Method

Read the full discovery (lines 1–693), with emphasis on Hypotheses (146–327) and Working Model + Experiments (329–579). For each hypothesis, applied a 6-column scorecard. For each experiment, applied a "team of two / two weeks / minimum viable" viability rubric. Cross-checked dependencies by tracing which H-N's are presupposed by §Working Model and §First experiment shape.

## Findings — Hypotheses

### Scorecard

| ID | Falsifiability | Scope | Depends on | Load-bearing | Bundled? | Patch |
|----|----|----|----|----|----|----|
| H-1 | Partial | Right | — | Y | N | Add a drop-test: a real domain example the 3-cat split would *fail* to localize. |
| H-2 | Partial | Right | H-1 | Y | N | State operational signatures for intra (agreement-within ≥ θ) and inter (translation-preserves ≥ ψ). |
| H-3 | Y | Over | H-1, H-9 | Y | **Yes** — bidirectionality (testable) + game-shaping (UX bet) | Split H-3a (bidirectional probes) / H-3b (gamification). MVP commits to H-3a only. |
| H-4 | Partial | Over | H-1, H-2 | Y | N | Falsifier: a task family where scalar accuracy predicts action as well as the distance set. |
| H-5 | N | Right | H-1 | N | N | Reclassify as language discipline, not hypothesis. |
| H-6 | Y | Right | H-1, H-4 | Y | N | Falsifier: alignment + fidelity collapse to one latent factor under PCA. |
| H-7 | Partial | Right | H-1 | N | N | Add promotion rule ("subcategory becomes first-class when X"); otherwise unfalsifiable. |
| H-8 | Partial | Over | H-7 | N | **Yes** — observability claim + pipeline claim | Split H-8a (detector precision/recall) / H-8b (pipeline reduces drift). |
| H-9 | Y | Right | H-1, H-3 | Y | N | Falsifier: direct/inferred channels correlate ≥0.9 → two-channel claim is over-engineered. |
| H-10 | N | Right | all C_head | Y (guardrail) | N | Reclassify as governance rule (G-rule). |
| H-11 | N | Right | H-4 | Y (guardrail) | N | Reclassify as product-entry gate (already stated as such at line 325). |

**Buckets.** Y: 3 (H-3, H-6, H-9). Partial: 5 (H-1, H-2, H-4, H-7, H-8). N: 3 (H-5, H-10, H-11 — guardrails, not hypotheses).

### Dependency graph

```
H-1 ── H-2 ── H-4 ── H-6 ── H-11 [guardrail]
   ├── H-3 ── H-9 ── H-10 [guardrail]
   ├── H-5 [language rule]
   └── H-7 ── H-8
```

### Highest-impact issues (Mode A)

1. **Three node-types conflated under "hypothesis."** H-5 = language rule, H-10/H-11 = guardrails. Add a `kind:` field to each H-box. Inflates apparent empirical content.
2. **H-3 bundles two non-substitutable claims.** Bidirectionality (testable) vs. game-shaping (asserted at line 47, never tested). Split.
3. **H-2 asymmetric across categories.** Intra-consistency for `C_spec`/`C_system` is days of work; for `C_head` it is the unsolved OQ-1. The hypothesis hides three sub-hypotheses of wildly different maturity.
4. **H-7 partly definitional.** Falsifiable kernel = "subcategory list does not stabilize over 6 months." Without timeline, it is a content choice.
5. **H-8 needs an event detector before it is a hypothesis.** No detector → neither precision/recall nor pipeline effectiveness is testable. Demote or attach a detector schema.
6. **Wrong test order.** Conceptual order ≠ experimental order. Empirical order: H-1 → H-9 → H-3a → H-2; then H-4; defer H-6 (multi-person), H-7, H-8.
7. **Missing H-12 (drift detection lag).** Calibration-loop value depends on time-to-surface ≤ T. Never hypothesized.
8. **Missing H-13 (recruitment/consent feasibility).** H-3 and H-9 both assume sustained voluntary participation. Never tested.

## Findings — Model & Experiments

1. **First experiment (line 506) is under-specified for 2-engineer-2-week build.** No sample-size logic, no recruitment plan, no per-probe time budget, no instrumentation, no kill-switch beyond prose. Patch: add a "Resources & cost" table (named reference file path, probe authoring hours, participant source, instrumentation choice, reviewer-hours, kill-switch trigger like ">50% items 'ambiguous probe' → stop and rewrite").
2. **Validation ladder (line 535) skips a rung.** Jumping from 2–3 participants to 20–40 with pre/during/post protocol is a leap. Insert "Rung 1.5: probe stability" (re-run kept probes on a 2nd cohort or domain). Output = kept-probes manifest.
3. **Anti-dashboard discipline (line 453) is aspirational, not enforceable.** Six gate questions at line 487 but no gatekeeper, no failure mode. Patch: name the gate as a PR-time checklist on any user-visible-metric file, tied to a `requires-anti-dashboard-review` label or hook. Without a fail-closed owner, it collapses under shipping pressure.
4. **First useful product distances (line 390) are not on a flat shelf.** Computability ladder: `d(spec, system)` = computable today (no people, DomainSpec already has the operators); `d(head_i, head_j)` = needs ≥2 participants on same probe set; `d(head_i, reference)` = needs the probe loop first; `d(group, reference)` / `alignment(group)` = blocked on OQ-6 (aggregation). **Cheapest first instrumentation = `d(spec, system)`** — no people, tests the backbone.
5. **Rule-formation event (line 564) is speculative.** No detector, no schema, no example, no precision/recall threshold. Either demote to OQ-13/OQ-14 (already partly there) and remove from §Working Model, or attach a minimum event schema (trigger heuristic, fields, queue, review SLA).
6. **Discovery maturity note (line 496) is honest in prose but inconsistent in scope.** Says "spec-seed-ready but not experiment-ready," then §First experiment shape reads as if next-sprint pickable. Patch: append "§First experiment shape and §Validation ladder are sketches — they require a separate experiment-design pass before they can be run."
7. **2-engineers-2-weeks viability.** Smoke test = viable *only* with internal participants, single existing reference page, spreadsheet instrumentation, 5 probes. Validation study (20–40 people) = **not viable**; min cut = 6–8 internal cohort, single task family, single distance. Rule-formation pipeline = **not viable**; min cut = 1-week manual flagging of 2 real conversations to retro-author the schema.

## Suggested minimum-viable first experiment

**`spec-system` drift micro-probe.**

- **Why first.** Only distance from line 390 computable today with zero recruitment. Tests the backbone (H-1, H-2) before the harder `C_head` layer. If geometry can't produce useful local divergence on the easy distance, it won't on the hard ones.
- **Run.** Pick one existing feature spec under `docs/features/<feature>/` + its implementation dir. Author 5 paired probes `(spec assertion, system observable)`. For each, compute match/non-match; classify non-match as `spec stale | system bug | ambiguous probe | scope-out-of-band`. Produce calibration queue (not score) with probe ID, endpoints, classification, action, owner.
- **Success.** ≥3 of 5 probes classifiable; ≥1 unknown-to-team divergence; ≥1 converts to concrete action within 2 weeks; team can articulate why each divergence matters in one sentence.
- **Kill.** ≥3 of 5 "ambiguous probe" → probe authoring is the bottleneck, not geometry. 0 actionable → pair too aligned, pick another or admit framing adds nothing here. Team can't agree on "non-match" → H-2 is more broken than the discovery admits.
- **Instrumentation.** One `EXPERIMENT-LOG.md` + one spreadsheet. No UI, no telemetry.
- **Out of scope.** No human probes, no `head-head` distance, no bidirectional play, no game UX, no psychometric argument (no person-level claim is made).
- **Cost.** ~40–50 person-hours.

## What I did NOT cover

Adjacent literature L-1..L-5; alternatives A-1..A-6 (only used for triangulation); OQ-1..OQ-23 individually (only OQ-1, OQ-6, OQ-13, OQ-14 referenced); Connections/Source Dispatch; FF/categorical bridge; `Spec` subcategory taxonomy details; psychometric guardrail items individually; discovery prose/tone/hedging (adversarial lens territory).

## Connections

- Refines: [[knowledge-calibration-geometry/discovery]] — Hypotheses + Working Model + First experiment shape.
- Sibling lenses: [[axis-adversarial-constructive]], [[axis-psychometric-geometric]], [[axis-coherence-evidence]].
