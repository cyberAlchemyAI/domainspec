---
tags: [vault, data-contract, governance, ontology, architecture]
node_type: discovery
is_session: true
layer: architecture, domain
nature: explanatory
status: active
created: 2026-05-19
timestamp: 2026-05-19T15:00:00+00:00
expires: 2026-07-18
conversation_id: data-contract-oq-resolutions-2026-05-19
decisions_made: true
contradictions_found: true
specs_updated: [vault/discovery/data-contract-as-formal-artifact/README.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Resolved two open questions blocking the contract_view implementation-plan, reframed load-bearing decision D-4, and aligned DomainSpec with cross-ecosystem prior art (OpenAPI / dbt / Buf / Schema Registry) — making the architectural stance externally defensible."
---

# Data Contract — OQ-4 + OQ-6 Resolutions

## Summary

Resolved two open questions on the data-contract discovery via Robot-Talks investigations. OQ-4 (generator location) was reframed from binary core-vs-consumer into a kernel+plugin architecture owned by core. OQ-6 (contract locus) was reframed from view-IS-contract to upstream-tagged-spec-IS-contract with the view as a per-wire binding instance, aligning DomainSpec with OpenAPI / dbt / Buf / Schema Registry prior art and resolving an internal D-3 ↔ D-4 inconsistency. Discovery bumped to v0.3.0; both Robot-Talks investigations persisted as separate vault sessions; new OQ-4.1 (plugin interface) and OQ-7 (spec versioning) opened as downstream blockers. Committed as 9af68f6.

## Contradictions

- validates `vault/discovery/data-contract-as-formal-artifact/README.md` — D-1, D-2, D-3 unchanged or strengthened; overall discovery shape confirmed.
- modifies `vault/discovery/data-contract-as-formal-artifact/README.md` — D-4 reframed (kernel+plugin owned by core, contract upstream, view as binding instance); OQ-4 + OQ-6 closed; OQ-4.1 + OQ-7 opened.

## Files touched

- vault/discovery/data-contract-as-formal-artifact/README.md
- vault/sessions/2026-05-18-1945-oq4-generator-location-robot-talks.md
- vault/sessions/2026-05-19-oq6-contract-locus-robot-talks.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/data-contract-as-formal-artifact/README.md` | `modifies` | Reframed D-4 (kernel+plugin owned by core, contract upstream, view as binding instance), closed OQ-4 + OQ-6, opened OQ-4.1 + OQ-7, bumped version to v0.3.0. |
| `vault/sessions/2026-05-18-1945-oq4-generator-location-robot-talks.md` | `creates` | This session produced the OQ-4 Robot-Talks preservation sub-session as a new file. |
| `vault/sessions/2026-05-19-oq6-contract-locus-robot-talks.md` | `creates` | This session produced the OQ-6 Robot-Talks preservation sub-session as a new file. |
