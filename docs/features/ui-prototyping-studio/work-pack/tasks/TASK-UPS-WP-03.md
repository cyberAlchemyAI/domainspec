# TASK-UPS-WP-03 - Capability Slice 03: Manual Apply, Revision Evidence, and Handoff

## Goal

Implement and prove the third vertical capability slice by delivering backend contracts, UI interactions, and targeted tests for approved batch apply, revision manifest evidence, and handoff export readiness.

## Wave Assignment

- Primary wave: W2

## Status

completed

## Capability Contract Subset

| Contract Area  | Required Subset                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Operations     | ApplyApprovedBatch, ExportDesignHandoff                                                                   |
| Queries        | ListRevisionManifest, GetHandoffBundle                                                                    |
| States         | MutationApproved, RevisionApplied, RevisionRecorded, SessionCompleted; UPS-ST-006, UPS-ST-008, UPS-ST-009 |
| UI Obligations | UPS-UI-007, UPS-UI-008                                                                                    |

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [operations.md](../../operations.md) | ApplyApprovedBatch, ExportDesignHandoff                                                                     |
| [queries.md](../../queries.md)       | ListRevisionManifest, GetHandoffBundle                                                                      |
| [states.md](../../states.md)         | StudioSessionState, UPS-ST-006, UPS-ST-008, UPS-ST-009                                                      |
| [interfaces.md](../../interfaces.md) | UIPrototypingStudioAPI, NewspaperContractAdapter, UPS-API-007, UPS-API-008, UPS-API-010                     |
| [UI-SPEC.md](../../UI-SPEC.md)       | MutationApprovalPanel, RevisionTimeline, HandoffSummaryPanel, SessionStateIndicator, UPS-UI-007, UPS-UI-008 |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | UPS-CON-006, UPS-CON-007, UPS-CON-008, UPS-CON-009, UPS-CON-010, UPS-OP-008, UPS-OP-009, UPS-OP-010         |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [Architecture Foundations](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [Layering Reference](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)
- [Dependency Rules](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)
- [UI Architecture Constitution](../../../../UI-ARCHITECTURE.md)

## Implementation Directives

### Backend directives

- Enforce manual apply rules: approved batch required, stale source rejection, and auto-apply prohibition.
- Ensure successful apply writes exactly one manifest entry and updates revision head deterministically.
- Implement handoff export contract with required references to `STORIES.md`, `SPEC.md`, `UI-SPEC.md`, and `TEST-SPEC.md`.
- Preserve adapter-only boundary for newspaper compatibility with no runtime coupling.

### UI directives

- Implement explicit apply interaction from mutation panel only after approval state is satisfied.
- Render revision timeline updates and manifest provenance after successful apply.
- Expose handoff bundle references in dedicated UI panel and preserve secure rendering constraints.
- Announce state transitions accessibly and surface disabled reasons when apply/export gates are unsatisfied.

## In-Task Test Checkpoints

| Checkpoint ID | Timing                  | Commands (run from `implementation/domainspec`)                                                                                                                   | Pass Condition                                                |
| ------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------- | ----------- | ----------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ----------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------- | ---------- | ----------------------- | ------------------------------------------------------------------------------- |
| UPS-WP-03-CP1 | Before slice mutation   | `pnpm --filter @domainspec/backend check`<br>`pnpm --filter @domainspec/web check`<br>`pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-006 | UPS-CON-007                                                   | UPS-CON-008 | UPS-CON-009 | UPS-CON-010 | UPS-OP-008 | UPS-OP-009 | UPS-OP-010 | UPS-ST-006 | UPS-ST-008 | UPS-ST-009 | UPS-API-007 | UPS-API-008 | UPS-API-010 | ui-prototyping-studio"`<br>`pnpm --filter @domainspec/web exec playwright test --grep "UPS-UI-007 | UPS-UI-008 | ui-prototyping-studio"` | All commands pass; no "no tests" / "No tests found" output                      |
| UPS-WP-03-CP2 | After slice mutation    | `pnpm --filter @domainspec/backend check`<br>`pnpm --filter @domainspec/web check`<br>`pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-006 | UPS-CON-007                                                   | UPS-CON-008 | UPS-CON-009 | UPS-CON-010 | UPS-OP-008 | UPS-OP-009 | UPS-OP-010 | UPS-ST-006 | UPS-ST-008 | UPS-ST-009 | UPS-API-007 | UPS-API-008 | UPS-API-010 | ui-prototyping-studio"`<br>`pnpm --filter @domainspec/web exec playwright test --grep "UPS-UI-007 | UPS-UI-008 | ui-prototyping-studio"` | Apply, manifest, and handoff slice behavior passes targeted backend + UI checks |
| UPS-WP-03-CP3 | Prototype proof publish | Create `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-03/prototype-proof.md` using the acceptance script below                                    | Proof artifact exists and contains required evidence sections |

## Prototype Proof

- Required demo evidence artifact: `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-03/prototype-proof.md`

### Acceptance Script

1. Run all UPS-WP-03-CP1 commands and store output in `UPS-WP-03-CP1.log`.
2. Implement backend and UI slice changes for apply, revision evidence, and handoff only.
3. Run all UPS-WP-03-CP2 commands and store output in `UPS-WP-03-CP2.log`.
4. Capture proof that manual approval precedes apply and `system:auto` apply attempts are rejected.
5. Capture proof that one successful apply appends exactly one revision manifest entry.
6. Capture handoff export evidence including required reference set.
7. Record proof narrative with links to command logs and UI/API traces in `prototype-proof.md`.

## Completion Criteria

- Capability subset operations, queries, states, and UI obligations for this slice are implemented.
- Backend and web/e2e targeted checkpoints pass before and after mutation.
- Prototype proof artifact is present with apply, manifest, and handoff evidence.
- All checkpoints UPS-WP-03-CP1..UPS-WP-03-CP3 are marked `pass` in the execution evidence log.

## Verification Evidence

- `pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-006|UPS-CON-007|UPS-CON-008|UPS-CON-009|UPS-CON-010|UPS-OP-008|UPS-OP-009|UPS-OP-010|UPS-ST-006|UPS-ST-008|UPS-ST-009|UPS-API-007|UPS-API-008|UPS-API-010|ui-prototyping-studio"`
- `pnpm --filter @domainspec/web exec playwright test --grep "UPS-UI-007|UPS-UI-008|ui-prototyping-studio"`
- `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-03/prototype-proof.md`

## Execution Evidence Log

| Checkpoint ID | Command                                                                                   | Result | Evidence Artifact                                                                     |
| ------------- | ----------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| UPS-WP-03-CP1 | Before-slice command set in checkpoint table (replayed in resumed implementation session) | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-03/UPS-WP-03-CP1.log`  |
| UPS-WP-03-CP2 | After-slice command set in checkpoint table                                               | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-03/UPS-WP-03-CP2.log`  |
| UPS-WP-03-CP3 | Prototype proof acceptance script                                                         | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-03/prototype-proof.md` |

## Gaps and Questions

- None for planning stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                             |
| ----------- | -------- | -------- | ------------------------------------------------ |
| D-002       | yes      | selected | Runtime artifacts remain HTML-first in MVP       |
| D-005       | yes      | selected | Manual apply remains mandatory and explicit      |
| D-007       | yes      | selected | Adapter-only compatibility remains boundary-safe |
