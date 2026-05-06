# Cross-Task Traceability Matrix

## Task to Story and Test Coverage

| Task ID   | Primary Stories        | Primary Test IDs                                                                                                                                            | Primary Coverage IDs                              | Source Contracts                                                                                                    |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| KG-IMP-01 | US-1, US-2             | KG-OP-001, KG-OP-002, KG-OP-005, KG-API-001, KG-API-002, KG-API-005                                                                                         | R1, R2, R3, R4, R5                                | [operations.md](../../operations.md), [mappings.md](../../mappings.md), [SPEC.md](../../SPEC.md)                    |
| KG-IMP-02 | US-2, US-3, US-4       | KG-API-003, KG-API-004, KG-API-005, KG-OP-003, KG-OP-004                                                                                                    | API contract IDs, error-state IDs                 | [queries.md](../../queries.md), [interfaces.md](../../interfaces.md), [operations.md](../../operations.md)          |
| KG-IMP-03 | US-1, US-3, US-4       | KG-UIE2E-001, KG-UIE2E-002, KG-UIE2E-003, KG-UIE2E-004                                                                                                      | UI concept IDs in SPEC/UI-SPEC                    | [UI-SPEC.md](../../UI-SPEC.md), [states.md](../../states.md)                                                        |
| KG-IMP-04 | US-1, US-2, US-3, US-4 | KG-BE-ST-001..015, KG-BE-OP-001..020, KG-BE-ERR-001..010, KG-BE-API-001..013, KG-BE-IFMAP-001..011, KG-UI-NAV-001, KG-UI-JRN-001..004, KG-UI-STATE-001..004 | Full TEST-SPEC matrix + readiness evidence matrix | [TEST-SPEC.md](../../TEST-SPEC.md), [STORIES.md](../../STORIES.md), [TASK-KG-IMP-04.md](../tasks/TASK-KG-IMP-04.md) |
| KG-IMP-05 | All stories            | Verify report references test matrix                                                                                                                        | verify-feature command output                     | `docs/features/knowledge-graph-visualization/VERIFICATION.md` (generated in W3)                                     |
| KG-IMP-06 | All stories            | Alignment audit evidence                                                                                                                                    | alignment finding IDs                             | `docs/features/knowledge-graph-visualization/ALIGNMENT-REPORT.md` (generated in W3)                                 |
| KG-IMP-07 | All stories            | Layering audit evidence                                                                                                                                     | layering finding IDs                              | `docs/features/knowledge-graph-visualization/LAYERING-ALIGNMENT-REPORT.md` (generated in W3)                        |

## TASK-KG-IMP-04 Evidence Snapshot (2026-05-06)

- Backend checks: `pnpm --filter @domainspec/backend check` and `pnpm --filter @domainspec/backend test` passed.
- Web checks: `pnpm --filter @domainspec/web check` and `pnpm --filter @domainspec/web test:e2e` passed (`16 passed`).
- Scope-guard and IFMAP coverage was refreshed in `backend/src/server.test.ts`.
- Aspect -> feature -> concept -> open-definition coverage was refreshed in `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts`.

## Pipeline Stage to Evidence Mapping

| Stage                 | Planned Wave | Primary Evidence Target                                                                  |
| --------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| plan                  | W0           | [WORK-PACK.md](../../WORK-PACK.md), wave files                                           |
| architecture-baseline | W0           | directives in [WORK-PACK.md](../../WORK-PACK.md)                                         |
| spec                  | W0-W1        | [SPEC.md](../../SPEC.md)                                                                 |
| stories               | W0-W1        | [STORIES.md](../../STORIES.md)                                                           |
| tests                 | W2           | test files + [TEST-SPEC.md](../../TEST-SPEC.md)                                          |
| backend-implement     | W1-W2        | backend source + API checks                                                              |
| ui-pipeline           | W2           | UI source + E2E output                                                                   |
| observability-spec    | W2           | `docs/features/knowledge-graph-visualization/observability.md` (optional scope artifact) |
| instrument-otel       | W2           | backend observability instrumentation                                                    |
| otel-verify           | W2-W3        | OBSERVABILITY-REPORT.md                                                                  |
| infra-deploy          | W2-W3        | infra configs                                                                            |
| registry-sync         | W2-W3        | registry generation output                                                               |
| verify-readiness      | W3           | Readiness gate verdict output (command response)                                         |
| verify-feature        | W3           | `docs/features/knowledge-graph-visualization/VERIFICATION.md`                            |
| audit-alignment       | W3           | `docs/features/knowledge-graph-visualization/ALIGNMENT-REPORT.md`                        |
| audit-layering        | W3           | `docs/features/knowledge-graph-visualization/LAYERING-ALIGNMENT-REPORT.md`               |
