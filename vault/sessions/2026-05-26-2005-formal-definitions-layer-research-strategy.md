---
tags: [ontology, vault, architecture]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory
status: active
created: 2026-05-26
timestamp: 2026-05-26T20:05:00-03:00
expires: 2026-07-25
conversation_id: 2026-05-26-formal-definitions-layer-research-strategy
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Reframes the planned Definition Layer research from greenfield design to unification of existing fragmented surfaces — a framing shift that will govern the 5-lens dispatch and downstream decisions."
---

# Formal Definitions Layer — Research Strategy

## Summary

The session set out to evaluate whether DomainSpec needs formal objects for business definitions and frame the design problem. We rejected "dictionary" as too narrow in favor of a typed object set (concept / rule / metric / workflow / role / interface) and identified the Definition Layer as the reference surface anticipated by H-8 of the `knowledge-calibration-geometry` discovery. After the user pressed on per-domain variability and the need for an empirical substrate, the planned research dispatch was reshaped from 4 to 5 lenses (A1 split into A1-meta universal schema + A1-domain extension mechanism). A repo-inventory subagent produced `vault/discovery/formal-definitions-layer/research/repo-inventory.md`, documenting that DomainSpec already carries fragmented definition surfaces — 3 edge namespaces (vault / domain / code), scattered rules across `rules.md` and `operations.md`, aspirational M-001..M-013 metrics, degenerate L1/L2/Δ extractors, and vault constitutions orphaned from `AUTHORITY-MAP.md` — which reframed the research from "design from scratch" to "unify, govern, and operationalize what exists." The revised 5-lens spec was validated (accept, all 9 checklist items PASS) and awaits user confirmation to dispatch into `vault/discovery/formal-definitions-layer/research/initial-fan-out/`.

## Contradictions

- revisits `vault/discovery/knowledge-calibration-geometry/discovery.md` — reconsidered H-8 (formalization-created) as the anchor for a separate Definition Layer surface, without refuting the original framing.
- revisits `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` — re-engaged the unresolved universal-vs-domain question; the dispatch will produce evidence bearing on it but no resolution this session.

## Files touched

- `vault/discovery/formal-definitions-layer/research/repo-inventory.md`

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/formal-definitions-layer/research/repo-inventory.md` | `creates` | This session produced the repo-inventory file as a new artifact via an Explore-style subagent pass; the file did not exist before this sitting. |
| `vault/discovery/knowledge-calibration-geometry/discovery.md` | `revisits` | Session reconsidered H-8 (formalization-created) as the anchor for a separate Definition Layer surface, without refuting the original framing. |
| `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` | `revisits` | Session re-engaged the unresolved universal-vs-domain debate that this discovery left open; the planned 5-lens dispatch will produce evidence bearing on it. |
