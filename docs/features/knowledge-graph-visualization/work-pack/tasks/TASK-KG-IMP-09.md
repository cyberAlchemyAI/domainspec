# TASK-KG-IMP-09 - Alignment Report Closure (BLOCK -> PASS / FLAG-Only Residuals)

## Goal

Close the current alignment blockers by executing remediation actions `A-KG-ALG-001..A-KG-ALG-008` and rerunning alignment until verdict is `PASS` or formally accepted `FLAG`-only residuals remain.

## Wave Assignment

- Primary wave: W3

## Status

completed

## DomainSpec Coverage

| Source                                           | Coverage IDs                                                |
| ------------------------------------------------ | ----------------------------------------------------------- |
| [ALIGNMENT-REPORT.md](../../ALIGNMENT-REPORT.md) | KG-ALG-004..011, A-KG-ALG-001..008                          |
| [interfaces.md](../../interfaces.md)             | KG-ALG-004, KG-BE-API-001..016                              |
| [events.md](../../events.md)                     | KG-ALG-005, KG-BE-EVT-005, KG-BE-EVT-007, KG-BE-EVT-009     |
| [operations.md](../../operations.md)             | KG-ALG-009, KG-BE-OP-015, KG-BE-OP-016                      |
| [UI-SPEC.md](../../UI-SPEC.md)                   | KG-ALG-008, KG-UI-STATE-002, KG-UI-STATE-003                |
| [TEST-SPEC.md](../../TEST-SPEC.md)               | KG-ALG-010, KG-ALG-011, mandatory coverage gate obligations |

## Architecture References

- [Architecture Pattern Library](../../../../../architecture/ARCHITECTURE-PATTERN-LIBRARY.md)
- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)
- [Testing Alignment](../../../../../architecture/pattern-library/TESTING-ALIGNMENT.md)

## Implementation Directives

- `A-KG-ALG-001`: Add write-scope guard for `POST /api/knowledge-graph/rebuild` and add deterministic 401/403 tests.
- `A-KG-ALG-002`: Implement declared event consumers or trim/waive unsupported consumer claims in `events.md` with explicit governance rationale.
- `A-KG-ALG-003`: Replace production-path in-memory adapter bindings (or file formal waivers) for source registry/session store usage.
- `A-KG-ALG-004`: Align mirror-cards payload with query contract (`storyCount`, `isActive`) and update tests/spec references.
- `A-KG-ALG-005`: Normalize UI state vocabulary between `UI-SPEC.md` and frontend state model.
- `A-KG-ALG-006`: Reconcile selection source contract and implementation value set in one canonical source.
- `A-KG-ALG-007`: Close TEST-SPEC coverage deficit by implementing/retagging evidence IDs or formally reducing obligation set with owner/date governance acceptance.
- `A-KG-ALG-008`: Reconcile `conceptTypes` and freshness-filter obligations across `TEST-SPEC.md`, `interfaces.md`, and query contracts.

## Execution Steps

1. Implement blocker remediations for `A-KG-ALG-001..A-KG-ALG-006` and reconcile contract drift obligations in `A-KG-ALG-007..A-KG-ALG-008`.
2. Refresh deterministic verification evidence (`pnpm --filter @domainspec/backend test` and targeted `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization`).
3. Re-run `domainspec-audit-alignment knowledge-graph-visualization` (or deterministic fallback if command remains unavailable) and publish updated `ALIGNMENT-REPORT.md`.
4. Sync `WORK-PACK.md` and `work-pack/waves/W3.md` with task status, rerun evidence, and any remaining dated follow-up rows.

## Completion Criteria

- `ALIGNMENT-REPORT.md` verdict is no longer `BLOCK`.
- `A-KG-ALG-001..A-KG-ALG-008` are marked resolved, or any remaining residuals are formally accepted as `FLAG` with owner/date and rationale.
- Updated alignment report includes rerun evidence links and refreshed contract/file traceability for changed findings.
- `WORK-PACK.md` and `work-pack/waves/W3.md` are synchronized with final closure status.

## Verification Evidence

- Alignment rerun output from `domainspec-audit-alignment knowledge-graph-visualization` (or fallback audit transcript if command unavailable).
- Updated report link: [ALIGNMENT-REPORT.md](../../ALIGNMENT-REPORT.md) showing non-`BLOCK` verdict and action status updates.
- Supporting test evidence for changed contracts (backend tests and targeted KG visualization E2E/state assertions).

Execution evidence (2026-05-07):

- `pnpm --filter @domainspec/backend check` -> pass.
- `pnpm --filter @domainspec/backend test` -> pass (`23/23`).
- `pnpm --filter @domainspec/web check` -> pass.
- `pnpm --filter @domainspec/web build` -> pass.
- `pnpm --filter @domainspec/web test:e2e -- e2e/knowledge-graph-visualization` -> pass (`16/16`).
- `domainspec-audit-alignment knowledge-graph-visualization` -> command unavailable; deterministic fallback audit published in [ALIGNMENT-REPORT.md](../../ALIGNMENT-REPORT.md).
- `domainspec-tag-code knowledge-graph-visualization --mode strict` -> command unavailable (tooling gap recorded in alignment report).

## Gaps and Questions

- Residual `FLAG` waivers remain for in-memory adapter binding and full TEST-SPEC catalogue closure (`KG-ALG-WVR-003`, `KG-ALG-WVR-010`), both owner-dated in [ALIGNMENT-REPORT.md](../../ALIGNMENT-REPORT.md).

## Decision Lock

| Decision ID | Required | Status   | Note                                                                    |
| ----------- | -------- | -------- | ----------------------------------------------------------------------- |
| D-KG-001    | yes      | selected | Mirror-first card model remains mandatory while closing alignment drift |
| D-KG-002    | yes      | selected | Canonical graph semantics remain the source for contract reconciliation |
| D-KG-003    | yes      | selected | Concept-click behavior must stay consistent through remediation changes |
