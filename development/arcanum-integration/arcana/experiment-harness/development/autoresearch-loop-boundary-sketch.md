---
type: boundary-sketch
status: sketch (not a build artifact)
target: autoresearch skill-improvement loop
consumes: benchmark DomainSpec Oracle Provider (frozen, external reward)
date: 2026-06-10
related:
  - ../../../benchmark/development/domainspec-oracle/DESIGN.md
  - ../../../../research/projects/domainspec/papers/domainspec-paper.md
---

# Autoresearch Loop — Boundary Sketch (experiment-harness side)

This sketches **where the skill-improvement loop sits and what it may NOT touch.** It is
deliberately not a build plan — its job is to fix the boundary so the loop and the oracle stay on
opposite sides of the line the whole investigation says is make-or-break.

## The loop (experiment-harness owns this)

```
propose skill mutation (skill_version v_old → v_new)
  → run agent+v_new on a HELD-OUT DomainSpec task corpus
    → benchmark DomainSpec Oracle scores the artifact   ← REWARD (frozen, external)
      → select / iterate (keep v_new if hard-backbone reward improves on held-out split)
        → deterministic residue + DCI as a reward-hacking TRIPWIRE
```

- **Reward = the oracle's hard backbone** (alignment D1 + tests D3 + observability D4 + residue D2 +
  traceability D5), blocker-gated by Domain Fidelity (P0). Vector reward; weight or multi-objective.
- **DCI / `rework` = guardrail, not reward.** If the oracle score rises but residue/DCI moves the
  wrong way, the mutation likely gamed something → flag the candidate, don't promote it.
- **A(k) (governance attenuation) = optional meta-objective** for the orchestration layer itself.

## The hard boundary (non-negotiable)

The harness **consumes** the oracle; it never reaches in. Concretely, the loop MUST NOT:

1. mutate, regenerate, or re-derive the **FrozenOracle** (tests, `|T|`/`|O|`, obligation graph);
2. mutate the **task corpus** or its `allowed_files` / reverse-test gate;
3. mutate the **version-pinned test generator**;
4. optimize against the **advisory LLM rubric** (advisory stays advisory).

Why this is structural, not bureaucratic: the paper's §6.2 (observer-executor conflation,
Conant-Ashby) and §6.6 (observer-executor separation + deterministic detection) say the regulator
cannot be its own model. If the loop could touch the oracle, it would "improve" by weakening the
oracle — **oracle collapse**, the same circularity DCI had, one level up. Separate packages make
this a fact, not an intention: **benchmark owns the reward; experiment-harness owns the search.**

## Held-out discipline (or it overfits)

- Split the DomainSpec task corpus into **train / held-out**; optimize on train, _promote only on
  held-out_ improvement.
- Pin the oracle version per campaign; record `oracle_version` + `skill_version` on every run so a
  reward shift is attributable to the skill, not an oracle change.

## The two walls (carried from the analysis)

1. **Credit assignment.** A full agent run exercises many skills + stochasticity. Optimize
   **code-near skills first** (their effect on the spec-conformance score is measurable); upstream
   governance skills are far from the oracle and need either far more tasks or an intermediate
   oracle boundary (score the _plan/spec_ the skill produced, still spec-derived).
2. **Cost.** Each candidate = N containerized domainspec runs × seeds. This is the binding
   constraint; the deterministic L0 oracle (D1/D2, no container) is the cheap pre-filter that
   screens candidates before paying for D3/D4.

## What to build first (when the loop is funded)

Nothing here yet — the **oracle L0 must exist first** (benchmark/development/domainspec-oracle).
Once D1/D2 are deterministic on one feature, the smallest honest loop is: one code-near skill, a
handful of held-out tasks, D1/D2 as reward + tripwire, no container — purely to prove the
_plumbing_ (mutation → run → score → select) before scaling to the full backbone.

## Boundary, one line

> **benchmark = the frozen reward. experiment-harness = the search that consumes it.**
> They never merge; the oracle is version-pinned and the loop may only read it.
