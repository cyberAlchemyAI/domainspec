# TASK-UPS-WP-01 - Capability Slice 01: Session Start, Variant Generation, and Baseline Gate

## Goal

Implement and prove the first vertical capability slice for UI Prototyping Studio by delivering backend contracts, UI route behavior, and targeted tests for session initialization, bounded variant generation, and baseline resolution in one task.

## Wave Assignment

- Primary wave: W1

## Status

completed

## Capability Contract Subset

| Contract Area  | Required Subset                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| Operations     | InitializeSession, SubmitPrompt, GenerateVariants, SelectOrCommitBaseline                                        |
| Queries        | GetSessionSnapshot, ListSessionVariants                                                                          |
| States         | SessionInitialized, PromptCaptured, VariantsReady, BaselineReady; UPS-ST-001, UPS-ST-002, UPS-ST-003, UPS-ST-004 |
| UI Obligations | UPS-UI-001, UPS-UI-002, UPS-UI-003, UPS-UI-004, UPS-UI-005                                                       |

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [operations.md](../../operations.md) | InitializeSession, SubmitPrompt, GenerateVariants, SelectOrCommitBaseline                                                                   |
| [queries.md](../../queries.md)       | GetSessionSnapshot, ListSessionVariants                                                                                                     |
| [states.md](../../states.md)         | StudioSessionState, UPS-ST-001, UPS-ST-002, UPS-ST-003, UPS-ST-004                                                                          |
| [interfaces.md](../../interfaces.md) | UIPrototypingStudioAPI, UPS-API-001, UPS-API-002, UPS-API-003                                                                               |
| [UI-SPEC.md](../../UI-SPEC.md)       | StudioWorkbenchPage, SessionControlsPanel, VariantCanvas, SessionStateIndicator, UPS-UI-001, UPS-UI-002, UPS-UI-003, UPS-UI-004, UPS-UI-005 |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | UPS-CON-001, UPS-CON-002, UPS-CON-003, UPS-OP-001, UPS-OP-002, UPS-OP-003, UPS-OP-004                                                       |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [Architecture Foundations](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [Testing Alignment](../../../../../architecture/pattern-library/TESTING-ALIGNMENT.md)
- [Layering Reference](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)
- [UI Architecture Constitution](../../../../UI-ARCHITECTURE.md)

## Implementation Directives

### Backend directives

- Implement operation and API contracts for session creation, prompt capture, variant generation, and baseline resolution with deterministic error codes.
- Enforce `variantCount` bounds (`1..3`), explicit multi-variant selection gate behavior, and single-variant committed baseline behavior exactly as specified.
- Keep session and gate invariants in domain/application layers; keep transport and DTO validation in interface adapters.

### UI directives

- Implement workbench route shell and controls needed for this slice: prompt submit, variant count selector, candidate rendering, and baseline badge state.
- Ensure UI gate behavior is deterministic: disable annotation/apply paths until baseline is satisfied for `variantCount > 1`, and auto-commit branch is visible for `variantCount = 1`.
- Bind UI only through typed client contracts and avoid embedding domain rules directly in components.

## In-Task Test Checkpoints

| Checkpoint ID | Timing                  | Commands (run from `implementation/domainspec`)                                                                                                                   | Pass Condition                                                |
| ------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ---------- | ----------- | ----------- | ----------- | ---------------------------------------------------------------------------------------- | ---------- | ---------- | ---------- | ---------- | ----------------------- | ---------------------------------------------------------------- |
| UPS-WP-01-CP1 | Before slice mutation   | `pnpm --filter @domainspec/backend check`<br>`pnpm --filter @domainspec/web check`<br>`pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-001 | UPS-CON-002                                                   | UPS-CON-003 | UPS-OP-001 | UPS-OP-002 | UPS-OP-003 | UPS-OP-004 | UPS-ST-001 | UPS-ST-002 | UPS-ST-003 | UPS-ST-004 | UPS-API-001 | UPS-API-002 | UPS-API-003 | ui-prototyping-studio"`<br>`pnpm --filter @domainspec/web test:e2e -- --grep "UPS-UI-001 | UPS-UI-002 | UPS-UI-003 | UPS-UI-004 | UPS-UI-005 | ui-prototyping-studio"` | All commands pass; no "no tests" / "No tests found" output       |
| UPS-WP-01-CP2 | After slice mutation    | `pnpm --filter @domainspec/backend check`<br>`pnpm --filter @domainspec/web check`<br>`pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-001 | UPS-CON-002                                                   | UPS-CON-003 | UPS-OP-001 | UPS-OP-002 | UPS-OP-003 | UPS-OP-004 | UPS-ST-001 | UPS-ST-002 | UPS-ST-003 | UPS-ST-004 | UPS-API-001 | UPS-API-002 | UPS-API-003 | ui-prototyping-studio"`<br>`pnpm --filter @domainspec/web test:e2e -- --grep "UPS-UI-001 | UPS-UI-002 | UPS-UI-003 | UPS-UI-004 | UPS-UI-005 | ui-prototyping-studio"` | Updated backend and UI slice behavior passes all targeted checks |
| UPS-WP-01-CP3 | Prototype proof publish | Create `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-01/prototype-proof.md` using the acceptance script below                                    | Proof artifact exists and contains required evidence sections |

## Prototype Proof

- Required demo evidence artifact: `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-01/prototype-proof.md`

### Acceptance Script

1. Run all UPS-WP-01-CP1 commands and store output in `UPS-WP-01-CP1.log`.
2. Implement backend and UI slice changes for this task only.
3. Run all UPS-WP-01-CP2 commands and store output in `UPS-WP-01-CP2.log`.
4. Capture evidence for multi-variant branch (`variantCount=3`) showing explicit baseline selection requirement before unlock.
5. Capture evidence for single-variant branch (`variantCount=1`) showing committed baseline path.
6. Record proof narrative with links to command logs, UI test outputs, and any route/API traces in `prototype-proof.md`.

## Completion Criteria

- Capability subset operations, queries, states, and UI obligations for this slice are implemented.
- Backend and web/e2e targeted checkpoints pass before and after mutation.
- Prototype proof artifact is present with explicit acceptance script evidence.
- All checkpoints UPS-WP-01-CP1..UPS-WP-01-CP3 are marked `pass` in the execution evidence log.

## Verification Evidence

- `pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-001|UPS-CON-002|UPS-CON-003|UPS-OP-001|UPS-OP-002|UPS-OP-003|UPS-OP-004|UPS-ST-001|UPS-ST-002|UPS-ST-003|UPS-ST-004|UPS-API-001|UPS-API-002|UPS-API-003|ui-prototyping-studio"`
- `pnpm --filter @domainspec/web test:e2e -- --grep "UPS-UI-001|UPS-UI-002|UPS-UI-003|UPS-UI-004|UPS-UI-005|ui-prototyping-studio"`
- `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-01/prototype-proof.md`

## Execution Evidence Log

| Checkpoint ID | Command                                      | Result | Evidence Artifact                                                                     |
| ------------- | -------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| UPS-WP-01-CP1 | Before-slice command set in checkpoint table | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-01/UPS-WP-01-CP1.log`  |
| UPS-WP-01-CP2 | After-slice command set in checkpoint table  | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-01/UPS-WP-01-CP2.log`  |
| UPS-WP-01-CP3 | Prototype proof acceptance script            | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-01/prototype-proof.md` |

## Gaps and Questions

- None for planning stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                           |
| ----------- | -------- | -------- | ------------------------------------------------------------------------------ |
| D-003       | yes      | selected | Canonical comment schema is preserved for downstream slices                    |
| D-005       | yes      | selected | Manual governance gates remain visible from the first slice                    |
| D-006       | yes      | selected | Both multi-variant and single-variant baseline branches are mandatory in proof |
