# Decisions: Knowledge Graph Visualization

## Confirmed Decisions

- Wave 1 scope is V1 Capability Atlas Board only.
- Wave 1 is specification-only; implementation details are out of scope.
- Concept namespace is fixed to `knowledge-graph-visualization.*`.
- Relationship labels are restricted to canonical values in `RELATIONSHIPS.md`.
- V1 neighborhood depth is fixed to one hop.
- Wave 2 scope includes deterministic path tracing and multi-hop analysis contracts.
- V2 analysis depth range is fixed to `[1..4]`, with default `2`.
- Path ranking policy order is fixed: cross-feature relevance, shortest edge count, lexical tie-breaker.
- Relationship-family grouping must reconcile aggregated counts with projected edge totals.
- Wave 3 scope includes dependency matrix governance, storyboard publication, and bounded exception override.
- Risk score formula is fixed to `round(100 * (0.35*Structural + 0.30*CrossFeature + 0.20*Governance + 0.15*Lifecycle))`.
- Risk-band thresholds are fixed to `0-24 Stable`, `25-49 Watch`, `50-74 Warning`, `75-100 Critical`.
- Override policy is fixed: only `Warning` and `Critical` pairs are exception-eligible.
- Exception policy is fixed: one active exception per pair, justification length >= 30 chars, expiry <= 30 days.
- Exception override changes effective state to `Mitigated` while preserving computed score and band.
- Graph snapshot persistence strategy for implementation stage is fixed to PostgreSQL relational tables.
- Production read endpoint auth scopes are fixed to `domainspec.kg.read` and `domainspec.kg.governance.read`.
- Feature index artifact generation trigger is fixed to on commit plus nightly schedule.
- Lens persistence scope is fixed to feature-local.
- Exception revocation policy is fixed to manual plus automatic expiry and policy hooks.

## Open Decisions

- None. All blocker-level pipeline decisions were resolved on 2026-05-01 and persisted in `DECISIONS.md`.

## Deferred Scope

- Advanced graph layout controls (beyond deterministic projection outputs).
- Live diff mode between snapshot versions.
- Multi-window comparative governance reports across release windows.
