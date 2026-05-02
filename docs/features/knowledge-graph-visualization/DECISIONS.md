# Pipeline Decisions: Knowledge Graph Visualization

Date: 2026-05-01
Profile: pipeline
Feature: knowledge-graph-visualization

| Decision                                  | Considered options                                                                         | Selected option                                      | Rationale                                                                                                             | Source       | Timestamp  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| Graph snapshot persistence strategy       | PostgreSQL relational tables; Document store JSON snapshots; In-memory cache only          | PostgreSQL relational tables                         | Supports durable governance queries, deterministic joins for matrix/storyboard projections, and production readiness. | AskQuestions | 2026-05-01 |
| Production auth scopes for read endpoints | domainspec.kg.read + domainspec.kg.governance.read; domainspec.kg.read only; no auth scope | domainspec.kg.read and domainspec.kg.governance.read | Separates general read access from governance-sensitive matrix/storyboard reads with least-privilege boundaries.      | AskQuestions | 2026-05-01 |
| Feature index artifact generation trigger | On commit + nightly schedule; on commit only; nightly schedule only                        | On commit and nightly schedule                       | Combines fast feedback on changes with periodic drift detection and reconciliation.                                   | AskQuestions | 2026-05-01 |
| Lens persistence scope                    | Feature-local; global across projects                                                      | Feature-local                                        | Minimizes coupling and keeps lens semantics aligned with feature-specific taxonomy and contracts.                     | AskQuestions | 2026-05-01 |
| Exception revocation policy               | Manual-only; manual + automatic expiry/policy hooks                                        | Manual plus automatic expiry/policy hooks            | Preserves human control while preventing stale exceptions from silently persisting past policy limits.                | AskQuestions | 2026-05-01 |

## Gate Status

- Blocker-level multi-option decisions: Resolved
- Pipeline continuation permission: Granted

## Confirmed Spec-Wave Decisions

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

## Open Decisions

- None. All blocker-level pipeline decisions were resolved on 2026-05-01.

## Deferred Scope

- Advanced graph layout controls (beyond deterministic projection outputs).
- Live diff mode between snapshot versions.
- Multi-window comparative governance reports across release windows.
