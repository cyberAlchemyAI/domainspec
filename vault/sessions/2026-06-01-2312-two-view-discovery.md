---
tags: [vault, ontology, discovery, documentation-architecture]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory, procedural
status: active
created: 2026-06-01
timestamp: 2026-06-01T23:12:39-03:00
expires: 2026-07-31
conversation_id: two-view-discovery-2026-06-01
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Codifies a structural governance method (two-view split + discovery→spec graduation gate) that gates all future DomainSpec discovery-to-spec transitions, but stays exploratory pending user ratification."
---

# Two-View Discovery — method + graduation gate

## Summary

Created the vault discovery `vault/discovery/two-view-discovery/README.md`, which codifies splitting a spec-bound discovery into a system-view (Diátaxis explanation, no schemas) + an engineer-view (reference + ADR with a Decision inventory), and defines the discovery→spec **graduation gate**: a spec may be authored only when the engineer-view has zero *critical* open decisions. The method distills Diátaxis/C4/arc42/MADR plus the in-repo `process-overview` precedent and proposes amendments G-1…G-4 to `discovery-structure-constitution` (altitude, two-view grammar, decision-as-fork, the spec-graduation gate). A writer↔reviewer cycle corrected non-canonical edges (complements→refines/refined-by, deprecated references→cites, mis-scoped synthesizes→derives-from) and dropped veracidade/convicção per the discovery confidence-omission rule. The criticality-flag mechanism (Q1) is the open decision that gates execution and awaits user ratification.

## Files touched

- vault/discovery/two-view-discovery/README.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/two-view-discovery/README.md` | `creates` | This session newly produced the two-view-discovery README; the file did not exist before this sitting. |
