---
tags: [vault, discovery, multi-agent, subagent-topologies]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: active
version: 0.2.0
last_updated: 2026-06-05
---

# Subagent Topologies

## Objective

Navigation signpost for the `subagents-topologies` discovery folder. Points to the discovery, its backfilled research layer, and its four lens findings. Carries no findings of its own.

## What is this?

A **feature discovery** grounding a refinement of the research-dispatch machinery (the `research` skill plus its three governing constitutions and the validator). The question — *which subagent dispatch topologies actually get exercised, and where does lived practice drift from the specified tension discipline?* — sits upstream of any edit to the dispatch machinery. The commitments live in [discovery.md](discovery.md); this README is navigation only.

## Why it matters

The machinery already **specifies** the de-biasing it needs — pairwise tension (R29) and a false-consensus red-flag (validator Item 10) — but its lived topologies largely do not exercise it. This folder catalogs the eight encoded topologies, audits five verified specified-vs-lived drifts, and fences the three failures no topology can repair (loaded question · variance · single synthesizer). The anti-bias *principle* itself is **cited, not re-derived** — it is owned by the sibling discovery [anti-bias-vector-composition](../anti-bias-vector-composition/principle.md). See [discovery.md](discovery.md) for what is being changed and why.

> **Format note (v0.2.0).** This folder was recast from a science-finding into the feature-discovery layout per [`lens-research-discovery-layout.md`](../../../.claude/skills/custom/lens-research-discovery-layout.md), and the `research/` layer was backfilled beneath the pre-existing lenses and discovery. The substance is unchanged; the framing is now *what we refine and why*, not *is this novel*.

## 📁 Navigation

- **[discovery.md](discovery.md)** — the commitments. Objective · Business Context (Why now / What's broken / What stays) · Core Concepts · Decisions (D-1, D-2) & Open Questions (OQ-1…OQ-4). The load-bearing document.
- **`research/`** — the backfilled cross-lens layer.
  - **[research.md](research/research.md)** — cross-lens analysis: lens inventory, the count-vs-tension mechanism, the specified-but-unexercised drift, and the scope-fence. (`backfilled: true`)
  - **[research-synthesis.md](research/research-synthesis.md)** — ≤500-word executive summary; cites `research.md` for every claim.
- **`lenses/`** — the four tensioned investigation angles, each a frozen `findings.md`.
  - **[01-ensemble-formal](lenses/01-ensemble-formal/findings.md)** — Krogh–Vedelsby: count touches only variance; only on-axis tension touches the bias term. (`model-recall`)
  - **[02-adversarial-debate](lenses/02-adversarial-debate/findings.md)** — passive averaging returns correlated bias more confidently; forced confrontation is the mechanism that surfaces it. (`model-recall` + `local`)
  - **[03-repo-prior-art](lenses/03-repo-prior-art/findings.md)** — taxonomy of 8 encoded topologies + the five-axis specified-vs-lived drift audit (verified counts, snapshot 2026-06-05). (`local-files-read`)
  - **[04-skeptic](lenses/04-skeptic/findings.md)** — precedent check + the three-failure scope-fence; the meta-lens that bounds what topology can promise. (`local` + `model-recall`)
