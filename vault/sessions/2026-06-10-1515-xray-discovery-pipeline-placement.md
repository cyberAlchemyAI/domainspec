---
tags: [vault, architecture, discussion, close-session, arcanum, x-ray, research, discovery-pipeline]
node_type: discussion
is_session: true
layer: architecture
nature: explanatory
status: active
created: 2026-06-10
timestamp: 2026-06-10T15:15:40-03:00
expires: 2026-08-09
conversation_id: 2026-06-10-xray-discovery-pipeline-placement
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 4
importance_rationale: "Analysis-and-handoff session — the load-bearing decision (x-ray's promotion gate cleared via two borrows) landed in Arcanum as TO-VLAD7; no domainspec artifacts changed, so this node is provenance only."
---

# x-ray's Placement in the Discovery Pipeline

## Summary

The session committed two pending Arcanum docs (CRAFT-FORMAL-FOUNDATIONS, TO-VLAD6), then characterized Arcanum's `x-ray` sigil and analyzed how it composes with the discovery pipeline — the discovery agent (`domainspec-discovery-writer`), the two-view discovery (system-view/engineer-view), and the research skill in both Arcanum and domainspec-theorem. Decision: x-ray sits *downstream* as a renderer, and the load-bearing move is two borrows *into* x-ray — research's typed reference-status (`verified/em-leitura/nao-lido/refuta`) plus the two-view's altitude/decision-state typing — which is what clears x-ray's seed-stage promotion gate, rather than wiring x-ray everywhere. Persisted as the TO-VLAD7 memo in Arcanum; no domainspec repo files were changed.

## Files touched

- ../Arcanum: development/craft/CRAFT-FORMAL-FOUNDATIONS.md (committed)
- ../Arcanum: TO-VLAD/TO-VLAD6.md (committed)
- ../Arcanum: TO-VLAD/TO-VLAD7.md (created + committed — the x-ray composition analysis)
