---
tags: [vault, discovery, multi-agent, subagent-topologies]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: active
version: 0.1.0
last_updated: 2026-06-05
---

# Subagent Topologies

## Objective

Navigation signpost for the `subagents-topologies` discovery folder. Points to the discovery and its four lenses; carries no findings of its own.

## What is this?

A discovery folder investigating which subagent dispatch *topologies* yield calibrated findings. The actual finding lives in [discovery.md](discovery.md); this README is navigation only.

## Business Context

Commissioned to ground a refinement of the `research` skill (multi-agent research dispatch over `research-*` corpora). The question — "how should agents be composed so the returned finding is calibrated rather than confidently biased?" — sits upstream of any edit to the dispatch machinery. Produced by a tensioned four-lens dispatch that dogfooded its own subject.

## Why it matters

The dispatch demoted its own headline: the de-biasing principle it set out to establish is already owned by the sibling discovery [anti-bias-vector-composition](../anti-bias-vector-composition/principle.md). What survives is a topology taxonomy, an audit of specified-vs-lived drift in this repo's dispatches, and a scope-fence on what topology cannot calibrate — the inputs the `research`-skill refinement actually needs. See [discovery.md](discovery.md) for the calibrated conclusion and its limits.

## 📁 Navigation

- **[discovery.md](discovery.md)**: The discovery — Claim, Status, Summary, Open Questions, Next Moves. The load-bearing document.
- **`lenses/`**: The four tensioned investigation angles feeding the discovery.
  - **[01-ensemble-formal.md](lenses/01-ensemble-formal.md)**: Ensemble-error decomposition — why count touches only variance, tension touches bias. (`model-recall`)
  - **[02-adversarial-debate.md](lenses/02-adversarial-debate.md)**: Forced confrontation as the de-biasing mechanism; averaging returns correlated bias more confidently. (`model-recall` + `local`)
  - **[03-repo-prior-art.md](lenses/03-repo-prior-art.md)**: Taxonomy of 8 encoded topologies + specified-vs-lived drift audit. (`local-files-read`)
  - **[04-skeptic.md](lenses/04-skeptic.md)**: Precedent-kill, vacuity, and the single-synthesizer scope-fence; the lens that forced the demotion. (`local` + `model-recall`)
