---
tags: [ontology, vault, architecture]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, reference
status: active
created: 2026-05-19
timestamp: 2026-05-19T15:33:32-03:00
expires: 2026-07-18
conversation_id: domainspec-discovery-e11-reconciliation-2026-05-19
decisions_made: true
contradictions_found: true
specs_updated: [vault/discovery/domainspec-types-and-edges-validation/discovery.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Reconciles the active discovery driving adopt/defer/reject verdicts on TAXONOMY.md and RELATIONSHIPS.md against E11 evidence the original dispatch missed; errors here propagate to every future vault node."
---

# DomainSpec Discovery — E11 Reconciliation

## Summary

Continued from a compacted session that had taken `domainspec-types-and-edges-validation` discovery to v0.4.0. User flagged `/Users/victorboscaro/domainspec-core/` and the completed E11-technique-specialization experiment (D4=go, DS-M13 validated, 7-step promotion path open) as material the original C2 external-frame survey had missed. Applied three edits — new Contradictions & Tensions section (CT-1 Independence downgrade 0.90 → ~0.75; CT-2 narrowed Pattern rejection scope), E11 T-code annotations on D-2 (Outbox=T04, Read Model=T07, Port+Adapter=T24, Saga=T01–T03), and OQ-9 governance reconciliation question covering the empty `domainspec-core/implementation/domainspec/` TAXONOMY.md sync. Bumped to v0.5.0.

## Contradictions

- contradicts `vault/discovery/domainspec-types-and-edges-validation/discovery.md` (prior v0.4.0 Independence grade 0.90) — E11 in `domainspec-core/` already validated Outbox/T04, Read Model/T07, Port+Adapter/T24, Saga T01–T03 under DS-M13, so C2 was not externally independent; grade downgraded to ~0.75.
- questions `vault/discovery/domainspec-types-and-edges-validation/discovery.md` (prior Pattern-rejection rationale) — DS-M13 shows the Technique/Specialization axis carries decision-protocol shape, narrowing "Pattern has no shape" to only the code-artifact-type axis.
- questions `vault/discovery/domainspec-types-and-edges-validation/discovery.md` (governance model) — vault discovery path and E11's 7-step DS-M13 promotion path now overlap; two-repo TAXONOMY.md sync (`domainspec/` vs empty `domainspec-core/implementation/domainspec/`) unresolved; recorded as OQ-9.

## Files touched

- vault/discovery/domainspec-types-and-edges-validation/discovery.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/domainspec-types-and-edges-validation/discovery.md` | `modifies` | Edited the discovery from v0.4.0 to v0.5.0 — added Contradictions & Tensions section (CT-1, CT-2), annotated D-2 with E11 T-codes (T04, T07, T24, T01–T03), added OQ-9, downgraded Independence grade, bumped version and last_updated. |
| `vault/discovery/domainspec-types-and-edges-validation/discovery.md` | `contradicts` | Session evidence from E11 in `domainspec-core/` logically conflicts with the prior v0.4.0 Independence grade of 0.90 — C2 was not externally independent; grade downgraded to ~0.75. |
| `vault/discovery/domainspec-types-and-edges-validation/discovery.md` | `revisits` | Reconsidered the Pattern-rejection rationale in light of DS-M13 evidence that the Technique/Specialization axis carries decision-protocol shape, narrowing the prior rejection scope without refuting it. |
| `vault/discovery/domainspec-types-and-edges-validation/discovery.md` | `opens-question` | Surfaced OQ-9 on the target discovery: governance reconciliation between the vault discovery path and E11's 7-step DS-M13 promotion path, including the empty `domainspec-core/implementation/domainspec/` TAXONOMY.md sync. |
