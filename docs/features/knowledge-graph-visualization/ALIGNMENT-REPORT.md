---
id: knowledge-graph-visualization-alignment
feature: knowledge-graph-visualization
title: Knowledge Graph Visualization Alignment Report
summary: DomainSpec alignment audit against docs, implementation, and executable evidence.
status: blocked
pillar: platform
domain: knowledge-graph-visualization
audience:
  - web-core
  - backend-core
priority: p1
lang: en
owners:
  - web-core
updatedAt: 2026-05-06
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

Audit date: 2026-05-06 (rerun: TASK-KG-IMP-06 delegated stage)
Framework semantics baseline: DomainSpec CHANGELOG 2.0.8 (`CHANGELOG.md`)

## Stage Preconditions and Execution Evidence

- Planner mutation gate (`WORK-PACK.md`) is `pass` for feature-doc mutation scope.
- Delegated command contract execution:
  - Attempted: `domainspec-audit-alignment knowledge-graph-visualization`
  - Runtime output: `domainspec-audit-alignment: command not found`
  - Fallback used: deterministic manual audit against the DomainSpec command contract inputs (`domainspec/CHANGELOG.md`, feature docs, implementation files, executable evidence).
- Backend executable evidence: `pnpm --filter @domainspec/backend test` passed `22/22` tests.
- UI executable evidence: `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization` passed `16/16` Playwright tests.
- Stub/dead-code scan over `backend/src/modules/knowledge-graph/{application,domain,interface,infrastructure}`: no blocking stub markers found.
- Infrastructure migration sub-gate for `infrastructure/database/schema.ts` + `drizzle/`: not applicable in current repo topology (files/directories absent).

## Requirement Classification

| ID         | Category  | Status    | Severity | Requirement                                                                                                                                                             | Evidence                                                                                                                                                                                                                                                                                                     | Action                                                                                     |
| ---------- | --------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| KG-ALG-001 | compliant | COMPLIANT | LOW      | Rebuild enforces required files, canonical edge labels, endpoint validity, and atomic snapshot persistence.                                                             | `operations.md` (R1-R6), `backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.ts:84`, `backend/src/modules/knowledge-graph/infrastructure/drizzle-mirror-projection-repository.ts:56`, `backend/src/modules/knowledge-graph/application/rebuild-mirror-projection.test.ts`             | None.                                                                                      |
| KG-ALG-002 | compliant | COMPLIANT | LOW      | Projection scope/path containment guards are implemented for cross-project execution.                                                                                   | `operations.md#resolveprojectionscope`, `backend/src/modules/knowledge-graph/infrastructure/in-memory-project-source-registry.ts:96`, `backend/src/modules/knowledge-graph/infrastructure/markdown-feature-docs-parser.ts:56`, `backend/src/server.test.ts` cross-project scope tests                        | None.                                                                                      |
| KG-ALG-003 | compliant | COMPLIANT | LOW      | UI route flows and primary journeys are executable and passing in Playwright.                                                                                           | `apps/web/e2e/knowledge-graph-visualization/*.spec.ts` (16 passed)                                                                                                                                                                                                                                           | None.                                                                                      |
| KG-ALG-004 | missing   | MISSING   | BLOCK    | `POST /api/knowledge-graph/rebuild` is documented as write-auth (`domainspec.kg.write`) but route has no auth guard.                                                    | `docs/features/knowledge-graph-visualization/interfaces.md:8`, `backend/src/modules/knowledge-graph/interface/http-routes.ts:199`, `backend/src/modules/knowledge-graph/interface/http-routes.ts:525`                                                                                                        | Add explicit write-scope guard for rebuild route and tests for 401/403.                    |
| KG-ALG-005 | missing   | MISSING   | BLOCK    | Event consumer contracts are not fully implemented (`Observability pipeline`, `Analytics event stream`, `Audit log`).                                                   | `docs/features/knowledge-graph-visualization/events.md:23`, `docs/features/knowledge-graph-visualization/events.md:46`, `docs/features/knowledge-graph-visualization/events.md:70`, code search across `backend/src/modules/knowledge-graph` and `apps/web/src` has no concrete handlers for these consumers | Implement consumers or remove/waive consumer claims in `events.md`.                        |
| KG-ALG-006 | missing   | MISSING   | BLOCK    | Production wiring instantiates in-memory adapters in route composition path (policy flags in-memory/mock production binding as blocker).                                | `backend/src/modules/knowledge-graph/interface/http-routes.ts:12`, `backend/src/modules/knowledge-graph/interface/http-routes.ts:29`, `backend/src/modules/knowledge-graph/interface/http-routes.ts:133`, `backend/src/modules/knowledge-graph/interface/http-routes.ts:152`                                 | Replace with production-grade adapters or formal waiver with risk acceptance.              |
| KG-ALG-007 | partial   | PARTIAL   | HIGH     | MirrorCards response contract drift: docs require `storyCount` and `isActive`; API currently returns spread card payload (includes `relationCount`) without `isActive`. | `docs/features/knowledge-graph-visualization/queries.md:35`, `docs/features/knowledge-graph-visualization/queries.md:37`, `backend/src/modules/knowledge-graph/interface/http-routes.ts:268`                                                                                                                 | Align docs and API schema (either emit required fields or update contract + tests).        |
| KG-ALG-008 | partial   | PARTIAL   | MEDIUM   | UI state vocabulary drift: UI-SPEC includes `AspectFocused` and `FeatureFocused`, frontend state union does not expose those states.                                    | `docs/features/knowledge-graph-visualization/UI-SPEC.md:170`, `docs/features/knowledge-graph-visualization/UI-SPEC.md:171`, `apps/web/src/hooks/useConceptFocus.ts:19`                                                                                                                                       | Normalize state model naming between docs and UI implementation.                           |
| KG-ALG-009 | extra     | EXTRA     | MEDIUM   | Selection source contract allows extra values (`card`, `graph`) beyond operation rule table (`rail`, `board`, `detail`).                                                | `docs/features/knowledge-graph-visualization/operations.md:126`, `backend/src/modules/knowledge-graph/application/select-concept.ts:73`, `backend/src/modules/knowledge-graph/interface/http-routes.ts:769`                                                                                                  | Either constrain implementation to documented set or expand operation contract explicitly. |
| KG-ALG-010 | missing   | MISSING   | FLAG     | Mandatory test-obligation coverage gate fails: only `15/128` TEST-SPEC IDs are referenced by executable tests or deterministic verification evidence.                   | `docs/features/knowledge-graph-visualization/TEST-SPEC.md`, `backend/src/**/*.test.ts`, `apps/web/e2e/knowledge-graph-visualization/*.ts`, `docs/features/knowledge-graph-visualization/VERIFICATION.md`                                                                                                     | Add/retag tests for uncovered IDs and refresh verification artifact.                       |
| KG-ALG-011 | partial   | PARTIAL   | MEDIUM   | TEST-SPEC contains obligations (`conceptTypes`, freshness filter) that do not exist in current interface/query contracts.                                               | `docs/features/knowledge-graph-visualization/TEST-SPEC.md:128`, `docs/features/knowledge-graph-visualization/TEST-SPEC.md:160`, `docs/features/knowledge-graph-visualization/interfaces.md:67`, `docs/features/knowledge-graph-visualization/queries.md:70`                                                  | Reconcile TEST-SPEC obligations with normative interface/query artifacts.                  |

## Drift Contract/File Traceability (non-PASS findings)

| Finding ID | Contract IDs / Contract References                                                             | Implementation files                                                                                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KG-ALG-004 | No TEST-SPEC ID currently maps this rebuild auth contract (gap); `interfaces.md` rebuild auth  | `backend/src/modules/knowledge-graph/interface/http-routes.ts`                                                                                                                                                                |
| KG-ALG-005 | `KG-BE-EVT-005`, `KG-BE-EVT-007`, `KG-BE-EVT-009`                                              | `docs/features/knowledge-graph-visualization/events.md`; search evidence over `backend/src/modules/knowledge-graph/**`, `apps/web/src/**`                                                                                     |
| KG-ALG-006 | Infrastructure binding gate in `domainspec-audit-alignment` process (no explicit TEST-SPEC ID) | `backend/src/modules/knowledge-graph/interface/http-routes.ts`; `backend/src/modules/knowledge-graph/application/session-store.ts`; `backend/src/modules/knowledge-graph/infrastructure/in-memory-project-source-registry.ts` |
| KG-ALG-007 | `KG-BE-QRY-001`                                                                                | `backend/src/modules/knowledge-graph/interface/http-routes.ts`                                                                                                                                                                |
| KG-ALG-008 | `KG-UI-STATE-002`, `KG-UI-STATE-003`                                                           | `apps/web/src/hooks/useConceptFocus.ts`                                                                                                                                                                                       |
| KG-ALG-009 | `KG-BE-OP-015`, `KG-BE-OP-016`                                                                 | `backend/src/modules/knowledge-graph/application/select-concept.ts`; `backend/src/modules/knowledge-graph/interface/http-routes.ts`                                                                                           |
| KG-ALG-010 | Coverage gate set from `KG-BE-*` + `KG-UI-*` catalogue IDs in `TEST-SPEC.md`                   | `backend/src/**/*.test.ts`; `apps/web/e2e/knowledge-graph-visualization/*.ts`; `docs/features/knowledge-graph-visualization/VERIFICATION.md`                                                                                  |
| KG-ALG-011 | `KG-BE-IFMAP-005`, `KG-BE-QRY-003`, `KG-BE-QRY-007`                                            | `docs/features/knowledge-graph-visualization/interfaces.md`; `docs/features/knowledge-graph-visualization/queries.md`; `backend/src/modules/knowledge-graph/interface/http-routes.ts`                                         |

## Mandatory Test Obligation Coverage Gate

Coverage method:

- Expected IDs extracted from `docs/features/knowledge-graph-visualization/TEST-SPEC.md`.
- Implemented evidence IDs extracted from executable tests under `backend/src/**/*.test.ts`, `apps/web/e2e/knowledge-graph-visualization/*.ts`, plus deterministic verification rows in `docs/features/knowledge-graph-visualization/VERIFICATION.md`.

Coverage totals:

- expected IDs: 128
- covered IDs: 15
- uncovered IDs: 113
- orphan IDs: 0

Severity floor rule application:

- `V1 Pipeline Must-Pass (P0)` subset is not explicitly declared in current `TEST-SPEC.md`.
- Uncovered obligations therefore apply non-P0 policy floor: `FLAG`.

Expected IDs:

```text
KG-BE-API-001
KG-BE-API-002
KG-BE-API-003
KG-BE-API-004
KG-BE-API-005
KG-BE-API-006
KG-BE-API-007
KG-BE-API-008
KG-BE-API-009
KG-BE-API-010
KG-BE-API-011
KG-BE-API-012
KG-BE-API-013
KG-BE-CALC-001
KG-BE-CALC-002
KG-BE-CALC-003
KG-BE-CALC-004
KG-BE-CALC-005
KG-BE-CALC-006
KG-BE-CAP-001
KG-BE-CAP-002
KG-BE-CAP-003
KG-BE-CAP-004
KG-BE-ERR-001
KG-BE-ERR-002
KG-BE-ERR-003
KG-BE-ERR-004
KG-BE-ERR-005
KG-BE-ERR-006
KG-BE-ERR-007
KG-BE-ERR-008
KG-BE-ERR-009
KG-BE-ERR-010
KG-BE-EVT-001
KG-BE-EVT-002
KG-BE-EVT-003
KG-BE-EVT-004
KG-BE-EVT-005
KG-BE-EVT-006
KG-BE-EVT-007
KG-BE-EVT-008
KG-BE-EVT-009
KG-BE-IFMAP-001
KG-BE-IFMAP-002
KG-BE-IFMAP-003
KG-BE-IFMAP-004
KG-BE-IFMAP-005
KG-BE-IFMAP-006
KG-BE-IFMAP-007
KG-BE-IFMAP-008
KG-BE-IFMAP-009
KG-BE-IFMAP-010
KG-BE-IFMAP-011
KG-BE-OP-001
KG-BE-OP-002
KG-BE-OP-003
KG-BE-OP-004
KG-BE-OP-005
KG-BE-OP-006
KG-BE-OP-007
KG-BE-OP-008
KG-BE-OP-009
KG-BE-OP-010
KG-BE-OP-011
KG-BE-OP-012
KG-BE-OP-013
KG-BE-OP-014
KG-BE-OP-015
KG-BE-OP-016
KG-BE-OP-017
KG-BE-OP-018
KG-BE-OP-019
KG-BE-OP-020
KG-BE-POST-001
KG-BE-POST-002
KG-BE-POST-003
KG-BE-POST-004
KG-BE-POST-005
KG-BE-POST-006
KG-BE-POST-007
KG-BE-POST-008
KG-BE-POST-009
KG-BE-POST-010
KG-BE-QRY-001
KG-BE-QRY-002
KG-BE-QRY-003
KG-BE-QRY-004
KG-BE-QRY-005
KG-BE-QRY-006
KG-BE-QRY-007
KG-BE-QRY-008
KG-BE-QRY-009
KG-BE-QRY-010
KG-BE-QRY-011
KG-BE-QRY-012
KG-BE-QRY-013
KG-BE-QRY-014
KG-BE-QRY-015
KG-BE-QRY-016
KG-BE-ST-001
KG-BE-ST-002
KG-BE-ST-003
KG-BE-ST-004
KG-BE-ST-005
KG-BE-ST-006
KG-BE-ST-007
KG-BE-ST-008
KG-BE-ST-009
KG-BE-ST-010
KG-BE-ST-011
KG-BE-ST-012
KG-BE-ST-013
KG-BE-ST-014
KG-BE-ST-015
KG-UI-A11Y-001
KG-UI-A11Y-002
KG-UI-FORM-001
KG-UI-FORM-002
KG-UI-JRN-001
KG-UI-JRN-002
KG-UI-JRN-003
KG-UI-JRN-004
KG-UI-NAV-001
KG-UI-RSP-001
KG-UI-STATE-001
KG-UI-STATE-002
KG-UI-STATE-003
KG-UI-STATE-004
```

Covered IDs:

```text
KG-BE-API-001
KG-BE-API-004
KG-BE-IFMAP-001
KG-BE-IFMAP-002
KG-BE-IFMAP-004
KG-UI-A11Y-001
KG-UI-FORM-001
KG-UI-FORM-002
KG-UI-JRN-001
KG-UI-JRN-002
KG-UI-JRN-003
KG-UI-JRN-004
KG-UI-NAV-001
KG-UI-RSP-001
KG-UI-STATE-001
```

Uncovered IDs:

```text
KG-BE-API-002
KG-BE-API-003
KG-BE-API-005
KG-BE-API-006
KG-BE-API-007
KG-BE-API-008
KG-BE-API-009
KG-BE-API-010
KG-BE-API-011
KG-BE-API-012
KG-BE-API-013
KG-BE-CALC-001
KG-BE-CALC-002
KG-BE-CALC-003
KG-BE-CALC-004
KG-BE-CALC-005
KG-BE-CALC-006
KG-BE-CAP-001
KG-BE-CAP-002
KG-BE-CAP-003
KG-BE-CAP-004
KG-BE-ERR-001
KG-BE-ERR-002
KG-BE-ERR-003
KG-BE-ERR-004
KG-BE-ERR-005
KG-BE-ERR-006
KG-BE-ERR-007
KG-BE-ERR-008
KG-BE-ERR-009
KG-BE-ERR-010
KG-BE-EVT-001
KG-BE-EVT-002
KG-BE-EVT-003
KG-BE-EVT-004
KG-BE-EVT-005
KG-BE-EVT-006
KG-BE-EVT-007
KG-BE-EVT-008
KG-BE-EVT-009
KG-BE-IFMAP-003
KG-BE-IFMAP-005
KG-BE-IFMAP-006
KG-BE-IFMAP-007
KG-BE-IFMAP-008
KG-BE-IFMAP-009
KG-BE-IFMAP-010
KG-BE-IFMAP-011
KG-BE-OP-001
KG-BE-OP-002
KG-BE-OP-003
KG-BE-OP-004
KG-BE-OP-005
KG-BE-OP-006
KG-BE-OP-007
KG-BE-OP-008
KG-BE-OP-009
KG-BE-OP-010
KG-BE-OP-011
KG-BE-OP-012
KG-BE-OP-013
KG-BE-OP-014
KG-BE-OP-015
KG-BE-OP-016
KG-BE-OP-017
KG-BE-OP-018
KG-BE-OP-019
KG-BE-OP-020
KG-BE-POST-001
KG-BE-POST-002
KG-BE-POST-003
KG-BE-POST-004
KG-BE-POST-005
KG-BE-POST-006
KG-BE-POST-007
KG-BE-POST-008
KG-BE-POST-009
KG-BE-POST-010
KG-BE-QRY-001
KG-BE-QRY-002
KG-BE-QRY-003
KG-BE-QRY-004
KG-BE-QRY-005
KG-BE-QRY-006
KG-BE-QRY-007
KG-BE-QRY-008
KG-BE-QRY-009
KG-BE-QRY-010
KG-BE-QRY-011
KG-BE-QRY-012
KG-BE-QRY-013
KG-BE-QRY-014
KG-BE-QRY-015
KG-BE-QRY-016
KG-BE-ST-001
KG-BE-ST-002
KG-BE-ST-003
KG-BE-ST-004
KG-BE-ST-005
KG-BE-ST-006
KG-BE-ST-007
KG-BE-ST-008
KG-BE-ST-009
KG-BE-ST-010
KG-BE-ST-011
KG-BE-ST-012
KG-BE-ST-013
KG-BE-ST-014
KG-BE-ST-015
KG-UI-A11Y-002
KG-UI-STATE-002
KG-UI-STATE-003
KG-UI-STATE-004
```

Orphan IDs:

```text
(none)
```

## Remediation Actions (Priority Order)

| Action ID    | Finding IDs | Remediation                                                                                                             | Owner    | Target date | Rerun evidence                                                                                                             |
| ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| A-KG-ALG-001 | KG-ALG-004  | Add write-scope guard for `POST /api/knowledge-graph/rebuild` and add deterministic 401/403 route tests.                | web-core | 2026-05-09  | `pnpm --filter @domainspec/backend test` + rerun alignment audit stage                                                     |
| A-KG-ALG-002 | KG-ALG-005  | Implement consumers or trim/waive consumer claims in `events.md` with explicit governance rationale.                    | web-core | 2026-05-10  | code search evidence + rerun alignment audit stage                                                                         |
| A-KG-ALG-003 | KG-ALG-006  | Replace production-path in-memory adapter bindings (or file formal waivers) for source registry/session store usage.    | web-core | 2026-05-10  | dependency wiring diff + rerun alignment audit stage                                                                       |
| A-KG-ALG-004 | KG-ALG-007  | Align mirror-cards payload vs query contract (`storyCount`, `isActive`) and update tests/spec references.               | web-core | 2026-05-10  | backend contract tests + rerun alignment audit stage                                                                       |
| A-KG-ALG-005 | KG-ALG-008  | Normalize UI state vocabulary between `UI-SPEC.md` and `useConceptFocus` state model.                                   | web-core | 2026-05-10  | `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization/knowledge-graph-visualization.states.spec.ts` |
| A-KG-ALG-006 | KG-ALG-009  | Reconcile selection source contract and implementation value set in one canonical source (`operations.md` or code).     | web-core | 2026-05-10  | backend unit tests + rerun alignment audit stage                                                                           |
| A-KG-ALG-007 | KG-ALG-010  | Close TEST-SPEC coverage deficit by embedding all expected IDs in executable tests or formally reducing obligation set. | web-core | 2026-05-11  | refreshed coverage summary in alignment/verification artifacts                                                             |
| A-KG-ALG-008 | KG-ALG-011  | Reconcile `conceptTypes` and freshness-filter obligations across TEST-SPEC, interfaces, and query contracts.            | web-core | 2026-05-11  | docs diff + parser/check evidence + rerun alignment audit stage                                                            |

Rerun sequence after remediation closure:

1. Refresh deterministic verification evidence (`pnpm --filter @domainspec/backend test`, `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization`).
2. Re-execute `domainspec-audit-alignment knowledge-graph-visualization` in delegated runtime (or deterministic fallback if command remains unavailable).
3. Update this report verdict and close/open action rows based on new findings.

## Verdict

`BLOCK`

Blocking reasons:

- Missing rebuild write-auth enforcement.
- Missing declared event consumers.
- Policy-blocked in-memory production bindings in route composition.

Additional gate result:

- Mandatory test-obligation coverage floor: `FLAG` (`113` uncovered, no declared P0 subset).
