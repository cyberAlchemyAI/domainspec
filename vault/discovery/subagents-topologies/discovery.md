---
tags: [vault, discovery, multi-agent, subagent-topologies, calibration, anti-bias]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: active
version: 0.1.0
last_updated: 2026-06-05
veracidade: medium
convicção: medium
---

# Subagent Topologies

## Objective

Records what a tensioned multi-agent dispatch found when it investigated which subagent *topologies* yield calibrated findings — and, because its own skeptic lens demoted the headline, answers the narrower question that survived: *what does this repo's de-biasing machinery already own, where do its lived topologies drift from it, and what can topology demonstrably not calibrate?* It exists to ground the `research`-skill refinement without re-claiming the anti-bias principle the vault already published.

## Claim

The de-biasing principle behind multi-agent calibration — *tension along the bias-carrying axis, not agent count or surface diversity* — is **owned prior art** (Krogh–Vedelsby ensemble-error decomposition and this repo's own [anti-bias-vector-composition](../anti-bias-vector-composition/principle.md)); this discovery's surviving contribution is therefore **not** that principle but (a) a taxonomy of the dispatch topologies the repo already encodes, (b) an audit of their specified-vs-lived drift, and (c) a three-failure scope-fence on what topology demonstrably *cannot* calibrate.

## Status

**Demoted by its own skeptic lens (04)** from "finding" to *owned-prior-art consolidation + topology taxonomy + scope-fence* — the "calibration is often a demotion" thesis applied to itself by a tensioned dispatch. Foundation lenses 01–02 are `model-recall` (not web-fetched) → second-class until re-dispatched with verification. Drift lens 03 is `local-files-read`, counts verified (snapshot 2026-06-05). Moves it forward: web-verify the ensemble/debate citations; promote the scope-fence to a premise.

## Summary

The dispatch asked which subagent *topologies* yield calibrated findings, and dogfooded the question — four tensioned lenses, pairwise-opposed by design. The tension was real, not decorative: Lens 04 (skeptic) killed the headline. The principle "tension cancels the bias term; count and surface diversity do not" is already stated, with the same Krogh–Vedelsby citation, in the sibling discovery `anti-bias-vector-composition`. Per cite-don't-rediscover, the principle is borrowed, not found here.

A precision the lenses forced: the original framing "count is orthogonal to *calibration*" is too strong. Lens 01's algebra — `Var(V̄) = σ²/n + (n−1)/n·ρσ²` — shows count drains only the `σ²/n` term and leaves the correlated floor `ρσ²` and the shared bias untouched. So count is orthogonal to the **bias** term, not to variance, and variance is part of calibration. Count buys precision; only on-axis tension buys de-biasing. Lens 02 sharpened this against Lens 01: "enough diversity suffices" silently assumes independent errors, which a shared corpus and framing destroy — passive averaging then returns a *more confident* shared bias. Calibration needs a topology that forces at least one pair to confront along the bias axis.

What survives as this repo's own contribution is empirical, not principled: Lens 03's cartography of eight encoded topologies (single · task-fan-out · robot-talks · adversarial-audit · pipeline/per-layer · parent-synthesis · meta-dispatch · the four-role tension lattice) and its drift audit — LEDGER produced in 4 of 15 governed dispatches, corpus param spelled three ways, and a 32-folder ad-hoc channel (`theorem/agents-research/`) running multi-agent work entirely outside validate/review. The sibling discovery states the principle; it does not audit whether the repo's lived topologies *exercise* it. They largely do not — the false-consensus failure mode the principle warns against is live in the dominant path. Lens 04 adds the fence: three failures no topology repairs — a loaded question upstream of all agents, thin coverage (variance), and the single-synthesizer bottleneck (a tensioned dispatch still funnels into one un-tensioned reader).

## Lenses

- [lenses/01-ensemble-formal.md](lenses/01-ensemble-formal.md) — Krogh–Vedelsby `E = Ē − Ā`; bias–variance floor; why count touches only variance. (`model-recall`)
- [lenses/02-adversarial-debate.md](lenses/02-adversarial-debate.md) — averaging returns correlated bias more confidently; forced confrontation (debate / adversarial-collaboration / R29) as the de-biasing mechanism. (`model-recall` + `local`)
- [lenses/03-repo-prior-art.md](lenses/03-repo-prior-art.md) — taxonomy of 8 encoded topologies + specified-vs-lived drift audit. (`local-files-read`)
- [lenses/04-skeptic.md](lenses/04-skeptic.md) — precedent-kill (owned by the sibling discovery) + vacuity + the single-synthesizer scope-fence; forces the demotion. (`local` + `model-recall`)

## Open Questions

- Does the surviving contribution (taxonomy + drift audit + fence) clear the bar for a discovery, or is it a *premise* about lived drift attached to the sibling discovery? Lens 04 leans toward the latter.
- The single-synthesizer bottleneck: can any topology cancel synthesizer bias, or is an un-tensioned reader an irreducible single point of bias in every fan-in?
- Is the ad-hoc `theorem/agents-research/` channel a governance gap to close, or a deliberate lightweight tier that the strict pipeline should *legitimize* rather than absorb?

## Next Moves

- Re-dispatch lenses 01–02 with web verification before any claim here is treated as load-bearing (lift them out of `model-recall`).
- Draft a premise from the scope-fence: "topology de-biases the bias term only; question quality and variance and synthesizer bias are out of its reach."
- Feed the drift audit (03) into the `research`-skill refinement this discovery was commissioned to support — the spec is rigorous; adherence is the actual gap.

## Connections

- `cites` → [anti-bias-vector-composition](../anti-bias-vector-composition/principle.md) — the owning prior art for the core principle; this discovery consolidates and audits, it does not re-derive.
- `cites` → [subagents-strategy-refinement](../subagents-strategy-refinement/) — prior refinement of the dispatch engine.
- `relates-to` → `vault/constitution/research-constitution.md`, `vault/constitution/domainspec-subagents-strategy-constitution.md`, `vault/constitution/robot-talks-constitution.md` — the topologies catalogued.
