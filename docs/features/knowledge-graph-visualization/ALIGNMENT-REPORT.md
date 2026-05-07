---
id: knowledge-graph-visualization-alignment
feature: knowledge-graph-visualization
title: Knowledge Graph Visualization Alignment Report
summary: DomainSpec alignment audit against docs, implementation, and executable evidence.
status: flag
pillar: platform
domain: knowledge-graph-visualization
audience:
  - web-core
  - backend-core
priority: p1
lang: en
owners:
  - web-core
updatedAt: 2026-05-07
dependencies:
  - SPEC.md
  - TEST-SPEC.md
  - interfaces.md
  - operations.md
  - states.md
  - events.md
includes: []
---

# Alignment Report: knowledge-graph-visualization

Audit date: 2026-05-07 (delegated stage rerun, task focus: TASK-KG-IMP-09)
Framework semantics baseline: DomainSpec CHANGELOG 2.0.8 (`CHANGELOG.md`)

## Stage Preconditions and Execution Evidence

- Planner mutation gate (`WORK-PACK.md`) is `pass` for feature-doc mutation scope.
- Delegated command contract execution:
  - Attempted: `domainspec-audit-alignment knowledge-graph-visualization`
  - Runtime output: `domainspec-audit-alignment: command not found`
  - Fallback used: deterministic manual audit against the DomainSpec command contract inputs (`domainspec/CHANGELOG.md`, feature docs, implementation files, executable evidence).
- Backend typecheck evidence: `pnpm --filter @domainspec/backend check` passed with no TypeScript errors.
- Backend executable evidence: `pnpm --filter @domainspec/backend test` passed `23/23` tests.
- UI typecheck evidence: `pnpm --filter @domainspec/web check` passed with no TypeScript errors.
- UI build evidence: `pnpm --filter @domainspec/web build` passed (`vite build`).
- UI executable evidence: `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization` passed `16/16` Playwright tests.
- Stub/dead-code scan over `backend/src/modules/knowledge-graph/{application,domain,interface,infrastructure}`: no blocking stub markers found.
- Infrastructure migration sub-gate for `infrastructure/database/schema.ts` + `drizzle/`: not applicable in current repo topology (files/directories absent).

## Requirement Classification

| ID         | Category  | Status    | Severity | Requirement                                                                                                          | Evidence                                                                                                                                                                                                                    | Action                                    |
| ---------- | --------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| KG-ALG-001 | compliant | COMPLIANT | LOW      | Rebuild enforces required files, canonical edge labels, endpoint validity, and atomic snapshot persistence.          | `operations.md` R0-R6; `backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.ts`; `backend/src/modules/knowledge-graph/infrastructure/drizzle-mirror-projection-repository.ts`; backend tests passing. | None.                                     |
| KG-ALG-002 | compliant | COMPLIANT | LOW      | Projection scope/path containment guards are implemented for cross-project execution.                                | Cross-project scope tests in `backend/src/server.test.ts`; scope validation in parser and project source registry adapters.                                                                                                 | None.                                     |
| KG-ALG-003 | compliant | COMPLIANT | LOW      | UI route flows and primary journeys are executable and passing in Playwright.                                        | `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization` -> `16/16` passed.                                                                                                                            | None.                                     |
| KG-ALG-004 | compliant | COMPLIANT | LOW      | `POST /api/knowledge-graph/rebuild` enforces write auth (`domainspec.kg.write`) with deterministic 401/403 behavior. | Guard in `backend/src/modules/knowledge-graph/interface/http-routes.ts`; tagged tests `KG-BE-API-014..016` in `backend/src/server.test.ts`; contract rows in `TEST-SPEC.md`.                                                | Closed via A-KG-ALG-001.                  |
| KG-ALG-005 | partial   | FLAG      | MEDIUM   | Declared async event consumers are not implemented in runtime event-bus form.                                        | `docs/features/knowledge-graph-visualization/events.md` records governance waivers `KG-EVT-WVR-001..003` with owner/date/rationale; unsupported hard claims removed.                                                        | Accepted residual (waiver).               |
| KG-ALG-006 | partial   | FLAG      | MEDIUM   | Route composition still binds in-memory project source registry and session store in production path.                | `backend/src/modules/knowledge-graph/interface/http-routes.ts`; risk acceptance recorded in this report and `DECISIONS.md`.                                                                                                 | Accepted residual (waiver).               |
| KG-ALG-007 | compliant | COMPLIANT | LOW      | MirrorCards response contract requires `storyCount` and `isActive`.                                                  | Response mapping in `backend/src/modules/knowledge-graph/interface/http-routes.ts`; frontend contract in `apps/web/src/lib/api.ts`; UI/E2E mocks and render updated.                                                        | Closed via A-KG-ALG-004.                  |
| KG-ALG-008 | compliant | COMPLIANT | LOW      | UI state vocabulary is synchronized between UI-SPEC and frontend state model.                                        | `docs/features/knowledge-graph-visualization/UI-SPEC.md` state table matches `useConceptFocus` states.                                                                                                                      | Closed via A-KG-ALG-005.                  |
| KG-ALG-009 | compliant | COMPLIANT | LOW      | Selection source value set is reconciled across contract and implementation.                                         | `operations.md` R3 and input table match accepted runtime values (`rail`, `board`, `detail`, `card`, `graph`); `events.md` + `TEST-SPEC.md` updated accordingly.                                                            | Closed via A-KG-ALG-006.                  |
| KG-ALG-010 | partial   | FLAG      | MEDIUM   | Full TEST-SPEC catalogue remains broader than current executable tagged evidence set.                                | `docs/features/knowledge-graph-visualization/TEST-SPEC.md` includes coverage reconciliation acceptance; executable IDs include `KG-BE-API-014..016`, `KG-BE-QRY-001`.                                                       | Accepted residual (pilot coverage floor). |
| KG-ALG-011 | compliant | COMPLIANT | LOW      | TEST-SPEC filter/mapping obligations are aligned with interfaces/query contracts.                                    | `TEST-SPEC.md` reconciled to `cardTypes` + `includeOptionalAspects` obligations; interfaces/queries remain canonical.                                                                                                       | Closed via A-KG-ALG-008.                  |

## Category Summary

| Category  | Count | IDs                                                                                            |
| --------- | ----- | ---------------------------------------------------------------------------------------------- |
| compliant | 8     | KG-ALG-001, KG-ALG-002, KG-ALG-003, KG-ALG-004, KG-ALG-007, KG-ALG-008, KG-ALG-009, KG-ALG-011 |
| partial   | 3     | KG-ALG-005, KG-ALG-006, KG-ALG-010                                                             |
| missing   | 0     | none                                                                                           |
| extra     | 0     | none                                                                                           |

## Drift Contract/File Traceability (non-PASS findings)

| Finding ID | Contract IDs / Contract References                     | Implementation files                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KG-ALG-005 | `KG-BE-EVT-005`, `KG-BE-EVT-007`, `KG-BE-EVT-009`      | `docs/features/knowledge-graph-visualization/events.md` (governance waivers `KG-EVT-WVR-001..003`)                                                                                                                            |
| KG-ALG-006 | Infrastructure binding gate (no explicit TEST-SPEC ID) | `backend/src/modules/knowledge-graph/interface/http-routes.ts`; `backend/src/modules/knowledge-graph/application/session-store.ts`; `backend/src/modules/knowledge-graph/infrastructure/in-memory-project-source-registry.ts` |
| KG-ALG-010 | Coverage floor reconciliation                          | `docs/features/knowledge-graph-visualization/TEST-SPEC.md`; `backend/src/server.test.ts`; `apps/web/e2e/knowledge-graph-visualization/*.spec.ts`                                                                              |

## Mandatory Test Obligation Coverage Gate

Coverage method:

- Expected IDs extracted from `docs/features/knowledge-graph-visualization/TEST-SPEC.md`.
- Implemented evidence IDs extracted from executable tests under `backend/src/**/*.test.ts`, `apps/web/e2e/knowledge-graph-visualization/*.ts`, plus deterministic verification rows in `docs/features/knowledge-graph-visualization/VERIFICATION.md`.

Coverage reconciliation (2026-05-07):

- Deterministic extractor set (`KG-(BE|UI)-*` only): expected `131`, covered `19`, uncovered `112`, orphan `0`.
- Covered IDs: `KG-BE-API-001`, `KG-BE-API-004`, `KG-BE-API-014`, `KG-BE-API-015`, `KG-BE-API-016`, `KG-BE-IFMAP-001`, `KG-BE-IFMAP-002`, `KG-BE-IFMAP-004`, `KG-BE-QRY-001`, `KG-UI-A11Y-001`, `KG-UI-FORM-001`, `KG-UI-FORM-002`, `KG-UI-JRN-001`, `KG-UI-JRN-002`, `KG-UI-JRN-003`, `KG-UI-JRN-004`, `KG-UI-NAV-001`, `KG-UI-RSP-001`, `KG-UI-STATE-001`.
- Uncovered obligations remain concentrated in backend families (`ST`, `OP`, `CALC`, `POST`, `ERR`, `QRY`, `EVT`, `IFMAP`, subset of `API`) plus UI state/a11y residual IDs.
- Full catalogue closure remains out-of-scope for this remediation pass and is recorded as accepted `FLAG` residual in `TEST-SPEC.md` Coverage Reconciliation section.

Severity floor rule application:

- `TEST-SPEC.md` does not currently label a `P0` / `V1 Pipeline Must-Pass Subset` set.
- Coverage residual is therefore treated as non-P0 and remains `FLAG`.

## Remediation Actions (Priority Order)

| Action ID    | Finding IDs | Remediation                                                                                    | Owner    | Status             | Resolution date | Resolution evidence                                                                                   |
| ------------ | ----------- | ---------------------------------------------------------------------------------------------- | -------- | ------------------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| A-KG-ALG-001 | KG-ALG-004  | Add write-scope guard for `POST /api/knowledge-graph/rebuild` and deterministic 401/403 tests. | web-core | closed             | 2026-05-07      | `http-routes.ts` write guard + `server.test.ts` tagged test `KG-BE-API-014..016`; backend tests pass. |
| A-KG-ALG-002 | KG-ALG-005  | Trim unsupported consumer claims and add governance waivers in `events.md`.                    | web-core | closed-with-waiver | 2026-05-07      | `events.md` waiver register `KG-EVT-WVR-001..003`.                                                    |
| A-KG-ALG-003 | KG-ALG-006  | Replace in-memory production bindings or file formal waiver.                                   | web-core | closed-with-waiver | 2026-05-07      | Risk accepted for pilot in this report and `DECISIONS.md` (`D-KG-010`).                               |
| A-KG-ALG-004 | KG-ALG-007  | Align mirror-cards payload with `storyCount` and `isActive`.                                   | web-core | closed             | 2026-05-07      | Backend response mapping + frontend API/UI updates + E2E mocks + backend/web tests passing.           |
| A-KG-ALG-005 | KG-ALG-008  | Normalize UI state vocabulary drift.                                                           | web-core | closed             | 2026-05-07      | `UI-SPEC.md` state table aligned to implemented states.                                               |
| A-KG-ALG-006 | KG-ALG-009  | Reconcile selection source contract values.                                                    | web-core | closed             | 2026-05-07      | `operations.md`, `events.md`, `TEST-SPEC.md` now share canonical source set.                          |
| A-KG-ALG-007 | KG-ALG-010  | Reduce coverage drift via executable tags or formalized docs reconciliation.                   | web-core | closed-with-waiver | 2026-05-07      | Tagged tests added; `TEST-SPEC.md` coverage reconciliation accepted for pilot profile.                |
| A-KG-ALG-008 | KG-ALG-011  | Reconcile `conceptTypes`/freshness drift in contracts.                                         | web-core | closed             | 2026-05-07      | `TEST-SPEC.md` obligations reconciled to `cardTypes` and `includeOptionalAspects`.                    |

## Accepted Residual Waivers

| Waiver ID      | Finding    | Scope                                                                                       | Owner    | Accepted date | Review date | Rationale                                                                                                           |
| -------------- | ---------- | ------------------------------------------------------------------------------------------- | -------- | ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| KG-ALG-WVR-003 | KG-ALG-006 | In-memory project source registry and session store remain bound in route composition path. | web-core | 2026-05-07    | 2026-06-15  | Keep current deterministic single-process behavior for pilot while persistent session/source adapters are designed. |
| KG-ALG-WVR-010 | KG-ALG-010 | Full TEST-SPEC catalogue closure deferred.                                                  | web-core | 2026-05-07    | 2026-06-15  | Pilot profile accepts coverage-floor subset; broader catalogue remains roadmap work.                                |

Rerun sequence for next closure cycle:

1. Refresh deterministic verification evidence (`pnpm --filter @domainspec/backend test`, `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization`).
2. Re-execute `domainspec-audit-alignment knowledge-graph-visualization` in delegated runtime (or deterministic fallback if command remains unavailable).
3. Revisit accepted waivers (`KG-ALG-WVR-003`, `KG-ALG-WVR-010`) before release-candidate readiness gate.

## Verdict

`FLAG`

Blocking reasons: none.

Additional gate result:

- Residuals are `FLAG`-only and formally accepted with owner/date waivers.
