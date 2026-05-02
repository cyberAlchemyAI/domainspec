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
