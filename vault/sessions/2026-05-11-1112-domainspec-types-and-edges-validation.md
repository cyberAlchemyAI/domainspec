---
tags: [ontology, vault, architecture, domainspec, taxonomy, edges]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, reference
status: active
created: 2026-05-11
timestamp: 2026-05-11T11:12:00-03:00
expires: 2026-07-10
conversation_id: domainspec-types-and-edges-validation-2026-05-11
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: [vault/discovery/domainspec-types-and-edges-validation/discovery.md]
expected_importance: 8
importance_rationale: "Proposes structural changes to TAXONOMY.md and RELATIONSHIPS.md plus governance tooling that all future DomainSpec work depends on — high load-bearing impact, capped at 8 because the proposals are pending ratification."
---

# DomainSpec Types & Edges Validation

## Summary

Ran the `domainspec-subagents-strategy` 7-step lifecycle to test whether DomainSpec's `TAXONOMY.md` and `RELATIONSHIPS.md` catalogs need new categories, meta-concepts, or edges — surfaced by the user's "Pattern with SAGA?" hint. Dispatched six children across two parallel waves (catalog inventory, external-frame survey, internal-pressure audit, categories/Pattern inquiry, edge-catalog proposal, UI symmetry check) and synthesized verdicts into a knowledge-scope discovery: adopt three new categories (Cross-cutting/Operational, Integration, Persistence), six essential meta-concepts (Aggregate, Aggregate Root, Repository, Read Model/Projection, Outbox, Domain/Integration Event split), nine new edges plus two parser-alias removals, reject Pattern-as-meta-concept (becomes a tag), defer all UI candidates, and name top-five composability priorities. Discovery enriched iteratively after user pushback — first with per-category profiles (D-1), then with a Context-level high-level recommendation summary; final version 0.3.0.

## Files touched

- vault/discovery/domainspec-types-and-edges-validation/research/domainspec-research.md
- vault/discovery/domainspec-types-and-edges-validation/research/domainspec-findings.md
- vault/discovery/domainspec-types-and-edges-validation/discovery.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/domainspec-types-and-edges-validation/research/domainspec-research.md` | `creates` | This session produced the per-child raw research file via the `domainspec-research-writer` agent; the file did not exist before this session. |
| `vault/discovery/domainspec-types-and-edges-validation/research/domainspec-findings.md` | `creates` | This session produced the synthesis findings file via the `domainspec-findings-writer` agent; the file did not exist before this session. |
| `vault/discovery/domainspec-types-and-edges-validation/discovery.md` | `creates` | This session produced the discovery via the `domainspec-discovery-writer` agent and subsequently enriched it (per-category D-1 profiles + Context-level high-level summary) as part of the same authoring act; the file did not exist before this session. |
