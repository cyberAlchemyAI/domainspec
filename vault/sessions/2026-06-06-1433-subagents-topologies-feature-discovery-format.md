---
tags: [vault, discovery, multi-agent, subagent-topologies, curation]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory, reference
status: active
created: 2026-06-06
timestamp: 2026-06-06T14:33:26-03:00
expires: 2026-08-05
conversation_id: 2026-06-06-subagents-topologies-feature-discovery-format
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 4
importance_rationale: "Pure format/edge-hygiene refactor of an existing discovery into the feature-discovery layout — substance preserved, no new claims, two carry-forwards left open."
---

# Subagent Topologies — Recast to Feature-Discovery Format

## Summary

Recast the `subagents-topologies` discovery from a science-finding framing into domainspec's feature-discovery format, after the user clarified it grounds a research-dispatch *feature*, not a scientific claim ("we don't care what exists or not"). Restructured the four flat lens files into `lenses/<slug>/findings.md`, backfilled the `research/` layer (research.md + a 442-word synthesis), and rewrote discovery.md around Business Context / Core Concepts / D-1,D-2 + OQ-1…OQ-4 — demoting the anti-bias principle from a novelty claim to a *cited design premise*. Used six subagents (five-way parallel reshape + one backfill), then reconciled bidirectional edges, dropped the invalid `relates-to` edge, and added `cited-by` inverses on the two reachable targets. Committed on branch `vault/subagents-topologies-feature-discovery-format`; three external `cites` edges stay one-sided (targets carry no `## Connections` block) and lenses 01–02 remain unverified `model-recall`.

## Files touched

- vault/discovery/subagents-topologies/discovery.md
- vault/discovery/subagents-topologies/README.md
- vault/discovery/subagents-topologies/lenses/01-ensemble-formal/findings.md
- vault/discovery/subagents-topologies/lenses/02-adversarial-debate/findings.md
- vault/discovery/subagents-topologies/lenses/03-repo-prior-art/findings.md
- vault/discovery/subagents-topologies/lenses/04-skeptic/findings.md
- vault/discovery/subagents-topologies/research/research.md
- vault/discovery/subagents-topologies/research/research-synthesis.md
- vault/constitution/robot-talks-constitution.md
- vault/discovery/anti-bias-vector-composition/principle.md

## Connections

| Document | Type | Description |
|---|---|---|
| `../discovery/subagents-topologies/discovery.md` | `modifies` | Rewrote into feature-discovery format (v0.2.0); demoted principle to cited premise; dropped invalid `relates-to`. |
| `../discovery/subagents-topologies/README.md` | `modifies` | Rewrote navigation to the new structure and feature framing. |
| `../discovery/subagents-topologies/lenses/01-ensemble-formal/findings.md` | `creates` | Reshaped flat lens into convention `findings.md`. |
| `../discovery/subagents-topologies/lenses/02-adversarial-debate/findings.md` | `creates` | Reshaped flat lens into convention `findings.md`. |
| `../discovery/subagents-topologies/lenses/03-repo-prior-art/findings.md` | `creates` | Reshaped flat lens into convention `findings.md`. |
| `../discovery/subagents-topologies/lenses/04-skeptic/findings.md` | `creates` | Reshaped flat lens (meta-lens, `lens_order: second`) into convention `findings.md`. |
| `../discovery/subagents-topologies/research/research.md` | `creates` | Backfilled cross-lens synthesis (`backfilled: true`, post-hoc-independent-read). |
| `../discovery/subagents-topologies/research/research-synthesis.md` | `creates` | Backfilled ≤500-word executive summary (442 words). |
| `../constitution/robot-talks-constitution.md` | `modifies` | Added `cited-by` inverse edge for the new discovery. |
| `../discovery/anti-bias-vector-composition/principle.md` | `modifies` | Added `cited-by` inverse edge for the new discovery. |
