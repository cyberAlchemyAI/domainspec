---
tags: [vault, architecture, discussion, two-view-discovery, close-session]
node_type: discussion
is_session: true
layer: ontology, architecture
nature: explanatory
status: active
created: 2026-06-10
timestamp: 2026-06-10T15:09:28-03:00
expires: 2026-08-09
conversation_id: 2026-06-10-two-view-chain-reframe-review
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Adjudicates the next-session direction for the two-view-discovery — adopts a 3-node chain topology while rejecting two over-reaches, constraining which gate schema the spec-author may apply."
---

# Two-View Discovery: Chain Reframe Review

## Summary

The session set out to decide how to wire the `two-view-discovery` (status: exploratory) into the DomainSpec workflow. Two multi-agent runs executed: a propose→robot-talks→review→zig-zag fan-out produced an 8-step wiring proposal (single graduation gate in `domainspec-decision-gate`, criticality flag, `complements`-not-`refines` edge correction), then a 4-vector adversarial review stress-tested an operator reframe recasting the discovery as a 3-node derivation chain (discovery → system-view → engineer-view) with a unified per-edge Open-Questions gate. Verdict: **adopt** the 3-node topology and per-altitude criticality, but **reject** the three-gate machinery (commits the exact over-calibration Q3 warns against) and the open-only consolidated table (drops the settled-decision census, AX-DS-3); the single blocking gate stays on engineer-view→spec only. No repo files were edited — deliberation only.

## Contradictions

- contradicts `two-view-discovery` (Q3 over-calibration guard) — the proposed three-gate machinery recreates the template-calibration cargo-cult Q3 forbids.
- contradicts `two-view-discovery` (D-3 settled-census / AX-DS-3) — the open-only Open-Questions table cannot hold Settled rows the spec-author compiles from.
- validates `two-view-discovery` (MAJOR-4 / A-3) — the 3-node `derives-from` topology dissolves the `refines`/`complements` edge problem and the fragile §7 reconciliation.
- questions `two-view-discovery` (§7) — is the third node (system-view) a real document or two filenames for one, per the no-revision-in-place rule? Open decision carried forward.

## Files touched

- vault/discovery/two-view-discovery/README.md (read only; subject artifact)
