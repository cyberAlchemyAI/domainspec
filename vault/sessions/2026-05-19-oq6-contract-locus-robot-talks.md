---
tags: [vault, robot-talks, data-contract, oq-6, governance]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, reference
status: active
created: 2026-05-19
timestamp: 2026-05-19T00:00:00+00:00
expires: 2026-07-18
conversation_id: oq6-contract-locus-2026-05-19
decisions_made: true
contradictions_found: true

specs_updated: [vault/discovery/data-contract-as-formal-artifact/README.md]
promoted_candidates: []
expected_importance: 7
importance_rationale: "Reframes the discovery's headline framing (contract locus) into alignment with cross-ecosystem prior art; resolves an internal D-3 ↔ D-4 inconsistency; opens spec-versioning discipline as the next-blocker OQ for the contract_view implementation-plan."
---

# Robot-Talks: OQ-6 (locus of the contract — view vs upstream spec)

## Summary

A 4-agent Robot-Talks investigation (concern-decomposed: textual archaeology, blast radius, steel-man spec-as-contract, steel-man view-as-contract) reframed D-4 in `vault/discovery/data-contract-as-formal-artifact/README.md`. The original framing — *"the generated view IS the contract"* — was traced to a parent-synthesizer gloss in the original `findings.md` (L146/L152) with no L1 backing and no explicit L2-E1 endorsement; L2-E1's actual strongest argument was the *derivation invariant* (non-drift by construction), which is a property of the generator rather than a label on the artifact. 5 of 6 spec-as-contract forcing functions are present in DomainSpec (multiple renderings, pre-render validation, subject/subscriber asymmetry, tooling coupling, compat-check natural home); the Pact consumer-driven counter-pattern does not apply. The original framing also created an internal D-3 ↔ D-4 inconsistency (D-3 lints validate the spec, not the view). Final position: **the contract lives upstream in the tagged spec; the generated view is a per-wire-location *binding instance* — a resolved, materialized projection of the upstream contract bound to one counterparty's interaction surface.** This preserves L2-E1's derivation invariant, B4's per-wire binding concern, B4's resolved-schema property, and the OQ-4 kernel+plugin architecture (now coherently renderers, not contract authors). Opens OQ-7 (spec versioning discipline for stable contract citation — preliminary lean: semver on SPEC.md + content-hash CI lint).

## Tensions surfaced

- **T1 — "View IS contract" is synthesis-gloss, not source-cited (HIGH).** Coined by parent synthesizer; no L1 agent and not L2-E1 explicitly. Close to (not quite) an R17 fidelity issue.
- **T2 — D-3 ↔ D-4 internal inconsistency (HIGH).** D-3 lints validate the spec; D-4 declared the view the contract. The reframe makes D-3 coherent.
- **T3 — Prior-art consensus is spec-as-contract (HIGH).** 5/6 forcing functions present; Pact counter-pattern not applicable to in-repo producer-owned specs.
- **T4 — F5 per-wire-location binding cuts the other way (MEDIUM).** Resolved by the hybrid binding-instance interpretation.
- **T5 — Stable identity for incident citation (MEDIUM).** Resolved by versioning upstream spec; view inherits version.
- **T6 — D-4 ↔ A-3 coupling forces re-justification (HIGH).** A-3's "no pointable artifact" weakens; D-4 re-justified on binding-instance + derivation-invariant + emit-gate grounds.
- **T7 — OQ-4 resolution premise shifts but conclusion stable (LOW).** Footnote noted in OQ-4.

## Files touched

- vault/discovery/data-contract-as-formal-artifact/README.md (D-4 reframe + D-1 strengthening + A-3 softening + OQ-4 T7 footnote + OQ-5 lean-toward note + OQ-6 resolved + OQ-7 added + version bump to 0.3.0)
- vault/sessions/2026-05-19-oq6-contract-locus-robot-talks.md (this file)

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../discovery/data-contract-as-formal-artifact/README.md](../discovery/data-contract-as-formal-artifact/README.md) | `modifies` | Session reframed D-4 (view as per-wire binding instance), resolved OQ-6, opened OQ-7. |
| [./2026-05-18-1945-oq4-generator-location-robot-talks.md](./2026-05-18-1945-oq4-generator-location-robot-talks.md) | `derives-from` | OQ-6 was opened by the OQ-4 Robot-Talks' A4 prior-art finding flagging D-4 as cross-ecosystem anomaly. |
| [./2026-05-18-1907-data-contract-as-formal-artifact.md](./2026-05-18-1907-data-contract-as-formal-artifact.md) | `derives-from` | The original parent discovery whose D-4 framing this session reframed. |
