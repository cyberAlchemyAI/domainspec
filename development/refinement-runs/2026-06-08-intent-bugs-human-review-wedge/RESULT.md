# Refine Result — Intent Bugs & The Human-Review Wedge

- Run id: `2026-06-08-intent-bugs-human-review-wedge`
- Status: **flag** (strong dialectic + clear convergence; load-bearing residue — the obvious framing is wrong and must be reframed; a design constraint is mandatory)
- Preset: standard · Research: bounded-research (external, confirmed) · Subagents: 3 (required, approved, dialectic)
- Synthesized from the three receipts (Cartographer map, Proponent thesis, Skeptic antithesis).

## Verdict in one line

**The free tools do not remove the human from intent review — nothing can — they make the irreducible review cheaper, unskippable, and auditable, and move it to where it's highest-leverage (the spec, not the diff).** Sell _that_, not "less review" — because "less review" is both unevidenced and, given LLM circularity + automation bias, potentially dangerous.

## The dialectic, resolved

- **Cartographer (map):** no free tool _eliminates_ human intent review. The pattern is **relocate** (interrogation, decision-gate, definitions-governance, spec-feature push review upstream of code) + **refocus** (alignment/layering audit, code-tag drift turn post-code review into structured spec↔code fidelity reports with mechanical BLOCK verdicts). Craft makes residue first-class.
- **Proponent (thesis):** strong empirical base — AI code ~30% defective and growing 10×; reviewers have a _false sense of security_; TDD/spec-first cuts defect density 40–90%; ambiguity is ~85% of rework. Spec→test derivation converts "compiles-but-wrong" into a machine-checkable contradiction _before_ review.
- **Skeptic (antithesis):** the knockout — the tools are **LLM-driven**, so an LLM that misreads intent in code misreads it identically when authoring the spec/definitions/tests; derived oracles ratify _implemented_ (wrong) behavior at ~coin-flip rate (LLM oracle accuracy 53.6% best / 47.8% thin-context), manufacturing false green-test confidence that, via automation bias (AI code gets _less_ visual attention), makes humans review **less**. Plus: spec review is itself expensive, formal-ish methods have decades of adoption friction, and there is **no study** showing these specific tools cut escaped intent bugs.

**Convergence both sides accept:** the defensible verb is **relocate + legibilize**, not **reduce**. The tools take an irreducible, expensive, miscalibrated human judgment (does this match intent?) and (a) move it to the cheapest, highest-leverage point (the spec/definition, amortized across all code derived from it), (b) hand the reviewer structured evidence (contract verdicts, obligation coverage, drift triples, residue ledger) instead of a raw diff, and (c) make it **unskippable** via mechanical BLOCK gates and residue-as-first-class — so intent bugs can't silently pass.

## The commercialization addition (what to actually write)

Reframing as "relocate + legibilize" is **stronger** for the business, not weaker:

1. **Honest wedge value:** "We don't promise fewer reviews — AI makes intent review _more_ necessary. We make the review you can't skip **10× cheaper to perform** (structured evidence, not diffs), **impossible to skip silently** (mechanical gates + first-class residue), and **fully auditable** (every intent decision is a persisted record)." This sells against an acute, growing pain (10× AI defects, miscalibrated reviewers) without the claim the skeptic destroys.
2. **It IS the paid moat, restated.** A legible, immutable, cross-tool trail of intent decisions + review verdicts is _exactly_ the SOC 2 / ITGC attestation value from the enforcement-runtime run. The free tools generate that audit exhaust as a byproduct of normal use; the paid tier signs/aggregates/attests over it. "Make intent review legible" and "sell auditor-grade attestation" are the same sentence at two altitudes.
3. **It positions at the right altitude:** as authorship shifts human→model, the scarce resource is _intent judgment_, not typing. The product captures, structures, and economizes that scarce resource.

## Load-bearing residue (must carry forward)

- **R-IB-1:** never market "reduces human review" — market "relocates + makes cheaper/unskippable/auditable." Human intent review is irreducible.
- **R-IB-2 (mandatory design constraint, not a caveat):** humans must own the **spec/definition ground truth**, and decision-gate/interrogation/alignment must be tuned to **add friction at intent-critical points** (counter automation bias). If the LLM authors _and_ checks intent unsupervised, circularity + complacency make escaped intent bugs **worse**. This is a product requirement.
- **R-IB-3 (measurement gap):** no evidence these specific tools cut escaped intent bugs. Instrument it (escaped-intent-bug rate + review-time, with/without) to convert the thesis from plausible to proven — and to own the metric no incumbent has.

## Stage evidence

Context Builder: pass · Invoke Define: pass · Interrogation refine-review: pass · Research decision: pass (bounded, confirmed) · Distill: pass · Invoke Redefine/Design: pass · Interrogation refine-design-review: flag · Distill Repair: flag · Invoke Plan: pass · Final Interrogation + Synthesis: flag

## Recommended next routes (not executed)

- **decision-gate** — commit the "relocate + legibilize, not reduce" framing and the human-owns-spec design constraint as a product requirement.
- **task-session** — instrument escaped-intent-bug + review-time measurement on the spec→test pipeline (closes R-IB-3, owns the metric).
- **refine** — design the "friction at intent-critical points" UX so the gates counter automation bias instead of feeding it.
