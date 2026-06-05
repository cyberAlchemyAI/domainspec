---
tags: [vault, ontology, architecture, formal-definitions-layer, governance, discovery-process, structural-repair]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory
status: active
created: 2026-05-27
timestamp: 2026-05-27T16:00:00-03:00
expires: 2026-07-26
conversation_id: 2026-05-27-formal-definitions-layer-discovery-anchor
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 6
importance_rationale: "This session closes a structural gap (orphaned research, missing discovery stub) and sharpens the problem frame from elicitation to governance fragmentation, making it load-bearing for the formal-definitions-layer work going forward."
---

# Formal Definitions Layer — Discovery Stub & Research Anchor

## Summary

The session reviewed the prior strategy session for `formal-definitions-layer` and surfaced that its framing conflated two distinct problems — a non-existent elicitation gap (already covered by `docs/INITIAL-DEFINITIONS.md` plus the `domainspec-spec-feature` discovery gate) and a real governance-fragmentation gap documented across the inventory's ~90 surfaces and six drift findings. It also flagged that the research file `repo-inventory.md` was orphaned from any discovery node, violating the discovery-before-research ordering implied by CLAUDE.md Route 3 and `discovery-writing.md`. To close the structural gap, we created a draft stub `vault/discovery/formal-definitions-layer/discovery.md` that intentionally leaves §2 Core Concepts empty to preserve the Layer-vs-governance-amendment decision under AX-DS-4 (OQ-1) and added the inverse `derives` edge row in `repo-inventory.md`'s Connections block. A separate gap was surfaced but not closed: no vault surface exists today for tracking proposed amendments to skills or agents.

## Files touched

- vault/discovery/formal-definitions-layer/discovery.md
- vault/discovery/formal-definitions-layer/research/repo-inventory.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/formal-definitions-layer/discovery.md` | `creates` | This session authored the discovery stub fresh, intentionally leaving §2 Core Concepts empty to preserve the Layer-vs-governance-amendment decision under AX-DS-4 (OQ-1). |
| `vault/discovery/formal-definitions-layer/research/repo-inventory.md` | `modifies` | This session added one row (the inverse `derives` edge back to the new discovery stub) to the research file's `## Connections` block. |
| `vault/sessions/2026-05-26-2005-formal-definitions-layer-research-strategy.md` | `revisits` | This session reframed the dispatch plan — splitting the conflated elicitation-vs-governance framing and surfacing the orphaned-research structural gap — without overturning any conclusion from the prior strategy session. |
