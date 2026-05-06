# Project Decisions

## Purpose

Capture project-level decisions that must be resolved before feature-level planning and pipeline execution.

## Implementation Baseline Interview

| Key                  | Question                                                           | Options Considered                                                                   | Selected Option                                                | Status   | Rationale                                                                                                         | Date       |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- | ---------- |
| architecture-pack    | Which architecture pack should be used for implementation?         | Use current architecture pack; bootstrap canonical DomainSpec pack; custom pack path | Use current architecture pack (`architecture/ARCHITECTURE.md`) | selected | The repository already uses the current architecture pack with established layer guidance.                        | 2026-05-05 |
| persistence-required | Does this feature require persistent storage?                      | Yes; no                                                                              | Yes                                                            | selected | Mirror projections and concept navigation contracts require persisted snapshots.                                  | 2026-05-05 |
| database-engine      | Which database engine should back the feature storage?             | Postgres; MySQL/MariaDB; SQLite; MongoDB; other                                      | SQLite                                                         | selected | The current implementation already persists projections in SQLite and this matches current runtime constraints.   | 2026-05-05 |
| data-access-library  | Which data access library should be used with the selected engine? | Drizzle; Prisma; TypeORM; native driver                                              | Drizzle + better-sqlite3                                       | selected | Existing repositories already use Drizzle with better-sqlite3 and keeping this avoids unnecessary layering drift. | 2026-05-05 |

## Decision Register

| ID     | Decision                                    | Options Considered                                  | Selected Option                     | Status   | Scope                                  | Rationale                                                                      | Source                            | Date       |
| ------ | ------------------------------------------- | --------------------------------------------------- | ----------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------- | ---------- |
| PD-001 | Implementation architecture baseline        | Current pack; bootstrap canonical pack; custom pack | Current architecture pack           | selected | project                                | Existing architecture references are already authoritative and in active use.  | implementation baseline interview | 2026-05-05 |
| PD-002 | Knowledge graph persistence baseline        | Persistent; in-memory only                          | Persistent                          | selected | feature: knowledge-graph-visualization | Open-definition and detail contracts rely on persisted projection snapshots.   | implementation baseline interview | 2026-05-05 |
| PD-003 | Knowledge graph database engine and adapter | Postgres + ORM; SQLite + Drizzle; other             | SQLite + Drizzle (`better-sqlite3`) | selected | feature: knowledge-graph-visualization | Matches existing adapter implementation and keeps dependency direction stable. | implementation baseline interview | 2026-05-05 |

## Required Startpoint Decisions

| Key                           | Decision Prompt                                                                | Example Resolution                                                                                                         | Status   |
| ----------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| scope-boundary                | What is in scope and explicitly out of scope for the first rollout?            | In: mirror cards, graph, concept detail, definition navigation. Out: multi-feature federation and annotations.             | selected |
| initial-delivery-slice        | What is the smallest valuable delivery slice?                                  | W1/W2 scope for knowledge-graph-visualization with deterministic API contracts and UI interactions.                        | selected |
| source-of-truth-policy        | In brownfield, which source is authoritative when docs and code diverge?       | DomainSpec docs are authority for this implementation pass; code is updated to match docs.                                 | selected |
| migration-strictness          | How strict should migration from current state to DomainSpec be in this cycle? | Strict for interface and operation error contracts; tolerant for non-contract visual refinements.                          | selected |
| verification-baseline-command | What command set defines minimum verification before feature progression?      | `pnpm --filter @domainspec/backend test && pnpm --filter @domainspec/backend check && pnpm --filter @domainspec/web check` | selected |

## Blockers

No blocker-level project decisions are currently open.

## Notes

- Architecture baseline assets exist at `architecture/` and module-level project-equivalent infrastructure exists under `backend/src/modules/**/infrastructure`.
- Database baseline for this feature is currently defined by `backend/src/modules/knowledge-graph/infrastructure/drizzle-mirror-projection-repository.ts`.

## Change Log

| Date       | Change                                                                          | Author  |
| ---------- | ------------------------------------------------------------------------------- | ------- |
| 2026-05-05 | Created implementation baseline interview outcomes and project-level decisions. | Copilot |
