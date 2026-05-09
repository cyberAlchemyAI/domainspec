# TASK-UPS-WP-02 - Capability Slice 02: Annotation, Deterministic Synthesis, and Approval Gate

## Goal

Implement and prove the second vertical capability slice by delivering backend contracts, UI interactions, and targeted tests for canonical annotation capture, deterministic mutation synthesis, and explicit approval gating.

## Wave Assignment

- Primary wave: W1
- Supporting wave: W2

## Status

completed

## Capability Contract Subset

| Contract Area  | Required Subset                                                                |
| -------------- | ------------------------------------------------------------------------------ |
| Operations     | CaptureCommentEvent, SynthesizeMutationBatch, ApproveMutationBatch             |
| Queries        | GetDraftMutationBatch, GetSessionSnapshot                                      |
| States         | BaselineReady, CommentsCaptured, MutationDrafted, MutationApproved; UPS-ST-005 |
| UI Obligations | UPS-UI-003, UPS-UI-006, UPS-UI-007                                             |

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [operations.md](../../operations.md) | CaptureCommentEvent, SynthesizeMutationBatch, ApproveMutationBatch                                |
| [queries.md](../../queries.md)       | GetDraftMutationBatch, GetSessionSnapshot                                                         |
| [states.md](../../states.md)         | StudioSessionState, UPS-ST-005                                                                    |
| [interfaces.md](../../interfaces.md) | UIPrototypingStudioAPI, StudioOrchestrationModule, UPS-API-004, UPS-API-005, UPS-API-006          |
| [UI-SPEC.md](../../UI-SPEC.md)       | AnnotationPanel, MutationApprovalPanel, SessionStateIndicator, UPS-UI-003, UPS-UI-006, UPS-UI-007 |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | UPS-CON-004, UPS-CON-005, UPS-OP-005, UPS-OP-006, UPS-OP-007                                      |

## Architecture References

- [domainspec/ARCHITECTURE.md](../../../../../domainspec/ARCHITECTURE.md)
- [Architecture Foundations](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)
- [Layering Reference](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)
- [Dependency Rules](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)
- [UI Architecture Constitution](../../../../UI-ARCHITECTURE.md)

## Implementation Directives

### Backend directives

- Enforce canonical comment schema `{target,severity,intent,note}` and severity enum at operation and API boundaries.
- Implement deterministic synthesis (`same ordered inputs -> same tasks + checksum`) and keep `MutationBatch.status='draft'` until explicit approval.
- Implement approval metadata and staleness guards exactly as documented, with deterministic error responses.

### UI directives

- Implement annotation form validation and ordered comment stream behavior tied to backend contracts.
- Implement mutation draft review and explicit approval interaction before apply becomes eligible in later slice.
- Reflect `MutationDrafted` and `MutationApproved` state transitions through accessible state indicators.

## In-Task Test Checkpoints

| Checkpoint ID | Timing                  | Commands (run from `implementation/domainspec`)                                                                                                                   | Pass Condition                                                |
| ------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------- | ---------- | ---------- | ---------- | ----------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------- | ---------- | ---------- | ----------------------- | ------------------------------------------------------------------------------------- |
| UPS-WP-02-CP1 | Before slice mutation   | `pnpm --filter @domainspec/backend check`<br>`pnpm --filter @domainspec/web check`<br>`pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-004 | UPS-CON-005                                                   | UPS-OP-005 | UPS-OP-006 | UPS-OP-007 | UPS-ST-005 | UPS-API-004 | UPS-API-005 | UPS-API-006 | ui-prototyping-studio"`<br>`pnpm --filter @domainspec/web exec playwright test --grep "UPS-UI-003 | UPS-UI-006 | UPS-UI-007 | ui-prototyping-studio"` | All commands pass; no "no tests" / "No tests found" output                            |
| UPS-WP-02-CP2 | After slice mutation    | `pnpm --filter @domainspec/backend check`<br>`pnpm --filter @domainspec/web check`<br>`pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-004 | UPS-CON-005                                                   | UPS-OP-005 | UPS-OP-006 | UPS-OP-007 | UPS-ST-005 | UPS-API-004 | UPS-API-005 | UPS-API-006 | ui-prototyping-studio"`<br>`pnpm --filter @domainspec/web exec playwright test --grep "UPS-UI-003 | UPS-UI-006 | UPS-UI-007 | ui-prototyping-studio"` | Annotation, synthesis, and approval-gate behavior passes targeted backend + UI checks |
| UPS-WP-02-CP3 | Prototype proof publish | Create `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-02/prototype-proof.md` using the acceptance script below                                    | Proof artifact exists and contains required evidence sections |

## Prototype Proof

- Required demo evidence artifact: `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-02/prototype-proof.md`

### Acceptance Script

1. Run all UPS-WP-02-CP1 commands and store output in `UPS-WP-02-CP1.log`.
2. Implement backend and UI slice changes for annotation, synthesis, and approval only.
3. Run all UPS-WP-02-CP2 commands and store output in `UPS-WP-02-CP2.log`.
4. Capture deterministic synthesis proof by repeating the same ordered comment input and recording stable checksum/task output.
5. Capture approval gate evidence showing apply controls remain blocked until explicit approval is completed.
6. Record proof narrative with links to command logs and UI/API traces in `prototype-proof.md`.

## Completion Criteria

- Capability subset operations, queries, states, and UI obligations for this slice are implemented.
- Backend and web/e2e targeted checkpoints pass before and after mutation.
- Prototype proof artifact is present with deterministic synthesis and approval-gate evidence.
- All checkpoints UPS-WP-02-CP1..UPS-WP-02-CP3 are marked `pass` in the execution evidence log.

## Verification Evidence

- `pnpm --filter @domainspec/backend test -- --test-name-pattern "UPS-CON-004|UPS-CON-005|UPS-OP-005|UPS-OP-006|UPS-OP-007|UPS-ST-005|UPS-API-004|UPS-API-005|UPS-API-006|ui-prototyping-studio"`
- `pnpm --filter @domainspec/web exec playwright test --grep "UPS-UI-003|UPS-UI-006|UPS-UI-007|ui-prototyping-studio"`
- `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-02/prototype-proof.md`

## Execution Evidence Log

| Checkpoint ID | Command                                                                                   | Result | Evidence Artifact                                                                     |
| ------------- | ----------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| UPS-WP-02-CP1 | Before-slice command set in checkpoint table (replayed in resumed implementation session) | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-02/UPS-WP-02-CP1.log`  |
| UPS-WP-02-CP2 | After-slice command set in checkpoint table                                               | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-02/UPS-WP-02-CP2.log`  |
| UPS-WP-02-CP3 | Prototype proof acceptance script                                                         | pass   | `docs/features/ui-prototyping-studio/work-pack/evidence/UPS-WP-02/prototype-proof.md` |

## Gaps and Questions

- None for planning stage.

## Decision Lock

| Decision ID | Required | Status   | Note                                                                   |
| ----------- | -------- | -------- | ---------------------------------------------------------------------- |
| D-003       | yes      | selected | Canonical comment schema is mandatory for synthesis inputs             |
| D-005       | yes      | selected | Explicit human approval remains a hard gate                            |
| D-007       | yes      | selected | Adapter-only compatibility boundary remains enforced during this slice |
