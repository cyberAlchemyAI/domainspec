---
tags: [vault, robot-talks, data-contract, oq-4, governance]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, reference
status: active
created: 2026-05-18
timestamp: 2026-05-18T19:45:00+00:00
expires: 2026-07-17
conversation_id: oq4-generator-location-2026-05-18
decisions_made: true
contradictions_found: true

specs_updated: [vault/discovery/data-contract-as-formal-artifact/README.md]
promoted_candidates: []
expected_importance: 6
importance_rationale: "Reframes an open OQ from a binary location choice into a kernel-plus-plugin architectural decision; sets the surviving plank for the contract_view generator's implementation-plan."
---

# Robot-Talks: OQ-4 (contract_view generator location)

## Summary

A 4-agent Robot-Talks investigation (concern-decomposed: distribution mechanics, consumer heterogeneity, governance coherence, prior art) resolved OQ-4 from `vault/discovery/data-contract-as-formal-artifact/README.md` by rejecting the original binary framing. Three independent agents (A1/A3/A4) converged on the conclusion that OQ-4 collapses three independent axes (`spec × executor × policy`) into one. Both L2-E1's "single upgrade path" and L2-E2's "minimal core surface" arguments lost their strongest planks under evidence. Final position: **kernel + plugin, owned by core** — core ships a parametric kernel (tag validation, fill-rate gating, slos projection) as dual-shape library+CLI in `internal_tools/contract_view/`; core defines a plugin interface for per-protocol resolvers (Avro / JSON Schema / Protobuf / SQL DDL); consumers configure rather than fork. Opens OQ-4.1 (plugin interface design — preliminary lean: in-process Python entry-points, ESLint/Sphinx style) and OQ-6 (D-4 "view IS contract" framing flagged as cross-ecosystem anomaly).

## Tensions surfaced

- **T1 — Binary framing collapses.** A1/A3/A4 convergent: OQ-4 was a 1D framing of a 3D problem.
- **T2 — "Minimal core surface" (L2-E2) doesn't survive evidence.** `internal_tools/pyproject.toml` already ships 3 console scripts; precedent (`vault-ctl framework pull`) operates on consumer content.
- **T3 — "Single upgrade path" (L2-E1) doesn't survive submodule SHA-pinning.** Propagation is N-deferred regardless.
- **T4 — D-1 does not entail consumer-only generator.** Promisor/promisee asymmetry doesn't transfer to tooling.
- **T5 — Parametric vs variadic is the real architectural question.** Kernel + plugins or fat-core + many built-in exporters — every comparable ecosystem honors this boundary.
- **T6 — D-4 "view IS contract" diverges from every comparable ecosystem.** Out of OQ-4 scope; flagged as OQ-6.
- **T7 — Whoever ships the binary ships the projection policy.** Frontmatter-ownership constitution Rule 1 by analogy.

## Files touched

- vault/discovery/data-contract-as-formal-artifact/README.md (OQ-4 resolution + OQ-4.1 + OQ-6 flagged + version bump)
- vault/sessions/2026-05-18-1945-oq4-generator-location-robot-talks.md (this file)

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../discovery/data-contract-as-formal-artifact/README.md](../discovery/data-contract-as-formal-artifact/README.md) | `modifies` | Session resolved OQ-4 (kernel + plugin, owned by core), added OQ-4.1, flagged OQ-6. |
| [./2026-05-18-1907-data-contract-as-formal-artifact.md](./2026-05-18-1907-data-contract-as-formal-artifact.md) | `derives-from` | This Robot-Talks investigation operates on an OQ left open by the parent discovery's source dispatch. |
