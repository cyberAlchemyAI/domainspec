# Test Specification: UI Prototyping Studio

## Execution Record

| Field                 | Value                                                                                                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Derivation mode       | Spec-level obligations only (no implementation code)                                                                                                                                                                                                                         |
| Scope                 | UI Prototyping Studio MVP contracts                                                                                                                                                                                                                                          |
| Source artifacts      | [SPEC.md](SPEC.md), [domain.md](domain.md), [operations.md](operations.md), [queries.md](queries.md), [interfaces.md](interfaces.md), [workflows.md](workflows.md), [states.md](states.md), [UI-SPEC.md](UI-SPEC.md), [STORIES.md](STORIES.md), [DECISIONS.md](DECISIONS.md) |
| Framework constraints | [CHANGELOG.md](../../../CHANGELOG.md) latest guidance at `2.0.10`                                                                                                                                                                                                            |
| Updated               | 2026-05-07                                                                                                                                                                                                                                                                   |

## Contract Obligations Matrix

| Obligation ID | Contract       | Verification Focus                                                    | Source                                                                                                                     |
| ------------- | -------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| UPS-CON-001   | FR-001, FR-002 | Session initialization defaults and bounds                            | [SPEC.md](SPEC.md#functional-requirements-mvp), [operations.md](operations.md#initializesession)                           |
| UPS-CON-002   | FR-003         | Exact variant count and metadata output contract                      | [SPEC.md](SPEC.md#functional-requirements-mvp), [operations.md](operations.md#generatevariants)                            |
| UPS-CON-003   | FR-004, FR-005 | Multi-option selection gate and single-option committed baseline path | [SPEC.md](SPEC.md#functional-requirements-mvp), [operations.md](operations.md#selectorcommitbaseline)                      |
| UPS-CON-004   | FR-006         | Canonical comment schema validation                                   | [SPEC.md](SPEC.md#functional-requirements-mvp), [operations.md](operations.md#capturecommentevent)                         |
| UPS-CON-005   | FR-007, FR-008 | Deterministic synthesis and draft batch state                         | [SPEC.md](SPEC.md#functional-requirements-mvp), [operations.md](operations.md#synthesizemutationbatch)                     |
| UPS-CON-006   | FR-009, FR-010 | Approval/staleness checks and apply side effects                      | [SPEC.md](SPEC.md#functional-requirements-mvp), [operations.md](operations.md#applyapprovedbatch)                          |
| UPS-CON-007   | FR-011, FR-013 | Manifest append semantics and session resume traceability             | [SPEC.md](SPEC.md#functional-requirements-mvp), [queries.md](queries.md#listrevisionmanifest)                              |
| UPS-CON-008   | FR-012         | Auto-apply prohibition in all paths                                   | [SPEC.md](SPEC.md#functional-requirements-mvp), [workflows.md](workflows.md#governancegatepolicy)                          |
| UPS-CON-009   | FR-014         | Adapter-only newspaper compatibility boundary                         | [SPEC.md](SPEC.md#functional-requirements-mvp), [interfaces.md](interfaces.md#internal-newspapercontractadapter-interface) |
| UPS-CON-010   | FR-015         | Handoff bundle references for UI bridge/tests/implementation          | [SPEC.md](SPEC.md#functional-requirements-mvp), [queries.md](queries.md#gethandoffbundle)                                  |
| UPS-CON-011   | AC-001..AC-011 | Acceptance criteria completeness and traceability                     | [SPEC.md](SPEC.md#acceptance-criteria-mvp), [SPEC.md](SPEC.md#traceability-matrix-stories---fr---ac---aspect-evidence)     |

## State Machine Obligations

| Test ID    | Obligation                                                                | Type               | Source                                  |
| ---------- | ------------------------------------------------------------------------- | ------------------ | --------------------------------------- |
| UPS-ST-001 | `SubmitPrompt` moves `SessionInitialized -> PromptCaptured`.              | Transition         | [states.md](states.md#transition-table) |
| UPS-ST-002 | `GenerateVariants` moves `PromptCaptured -> VariantsReady`.               | Transition         | [states.md](states.md#transition-table) |
| UPS-ST-003 | `SelectBaseline` branch is required when `variantCount > 1`.              | Guarded transition | [states.md](states.md#transition-table) |
| UPS-ST-004 | `CommitBaseline` branch is required when `variantCount = 1`.              | Guarded transition | [states.md](states.md#transition-table) |
| UPS-ST-005 | `ApproveMutationBatch` required before `ApplyApprovedBatch`.              | Transition guard   | [states.md](states.md#transition-table) |
| UPS-ST-006 | Successful apply must pass through `RevisionApplied -> RevisionRecorded`. | Transition         | [states.md](states.md#transition-table) |
| UPS-ST-007 | Invariant I1 keeps variant count bounded in all states.                   | Invariant          | [states.md](states.md#invariants)       |
| UPS-ST-008 | Invariant I6 forbids auto-apply in all states.                            | Invariant          | [states.md](states.md#invariants)       |
| UPS-ST-009 | Invariant I7 enforces one manifest append per successful apply.           | Invariant          | [states.md](states.md#invariants)       |

## Operation Rule Obligations

| Test ID    | Obligation                                                                                                                   | Type            | Source                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------ |
| UPS-OP-001 | [InitializeSession](operations.md#initializesession) enforces `variantCount in {1,2,3}`.                                     | Rule validation | [operations.md](operations.md#initializesession)       |
| UPS-OP-002 | [GenerateVariants](operations.md#generatevariants) emits exactly `variantCount` variants.                                    | Rule validation | [operations.md](operations.md#generatevariants)        |
| UPS-OP-003 | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline) enforces explicit selection when `variantCount > 1`.          | Rule validation | [operations.md](operations.md#selectorcommitbaseline)  |
| UPS-OP-004 | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline) commits baseline automatically when `variantCount = 1`.       | Rule validation | [operations.md](operations.md#selectorcommitbaseline)  |
| UPS-OP-005 | [CaptureCommentEvent](operations.md#capturecommentevent) accepts only canonical schema and severity enum.                    | Rule validation | [operations.md](operations.md#capturecommentevent)     |
| UPS-OP-006 | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch) determinism checksum is stable for identical ordered input. | Determinism     | [operations.md](operations.md#synthesizemutationbatch) |
| UPS-OP-007 | [ApproveMutationBatch](operations.md#approvemutationbatch) requires approval identity and timestamp.                         | Rule validation | [operations.md](operations.md#approvemutationbatch)    |
| UPS-OP-008 | [ApplyApprovedBatch](operations.md#applyapprovedbatch) rejects non-approved or stale batches.                                | Rule validation | [operations.md](operations.md#applyapprovedbatch)      |
| UPS-OP-009 | [ApplyApprovedBatch](operations.md#applyapprovedbatch) rejects `system:auto` apply actor.                                    | Negative rule   | [operations.md](operations.md#applyapprovedbatch)      |
| UPS-OP-010 | [ExportDesignHandoff](operations.md#exportdesignhandoff) requires revision evidence and reference completeness.              | Rule validation | [operations.md](operations.md#exportdesignhandoff)     |

## Interface Contract Obligations

| Test ID     | Obligation                                                                                                                                              | Type                   | Source                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| UPS-API-001 | `POST /sessions` maps request fields to [InitializeSession](operations.md#initializesession).                                                           | Field mapping          | [interfaces.md](interfaces.md#post-apiui-prototyping-studiosessions)                                        |
| UPS-API-002 | `POST /sessions/:sessionId/variants/generate` exposes [GenerateVariants](operations.md#generatevariants).                                               | Contract               | [interfaces.md](interfaces.md#post-apiui-prototyping-studiosessionssessionidvariantsgenerate)               |
| UPS-API-003 | `POST /sessions/:sessionId/baseline` exposes [SelectOrCommitBaseline](operations.md#selectorcommitbaseline).                                            | Contract               | [interfaces.md](interfaces.md#post-apiui-prototyping-studiosessionssessionidbaseline)                       |
| UPS-API-004 | `POST /comments` exposes [CaptureCommentEvent](operations.md#capturecommentevent).                                                                      | Contract               | [interfaces.md](interfaces.md#post-apiui-prototyping-studiosessionssessionidcomments)                       |
| UPS-API-005 | `POST /mutation-batches/synthesize` exposes [SynthesizeMutationBatch](operations.md#synthesizemutationbatch).                                           | Contract               | [interfaces.md](interfaces.md#post-apiui-prototyping-studiosessionssessionidmutation-batchessynthesize)     |
| UPS-API-006 | `POST /approve` exposes [ApproveMutationBatch](operations.md#approvemutationbatch).                                                                     | Contract               | [interfaces.md](interfaces.md#post-apiui-prototyping-studiosessionssessionidmutation-batchesbatchidapprove) |
| UPS-API-007 | `POST /apply` exposes [ApplyApprovedBatch](operations.md#applyapprovedbatch).                                                                           | Contract               | [interfaces.md](interfaces.md#post-apiui-prototyping-studiosessionssessionidmutation-batchesbatchidapply)   |
| UPS-API-008 | `GET /sessions/:sessionId/handoff` exposes [GetHandoffBundle](queries.md#gethandoffbundle).                                                             | Contract               | [interfaces.md](interfaces.md#get-apiui-prototyping-studiosessionssessionidhandoff)                         |
| UPS-API-009 | Internal [StudioOrchestrationModule](interfaces.md#internal-studioorchestrationmodule-interface) includes operation/query methods required by MVP loop. | Interface completeness | [interfaces.md](interfaces.md#internal-studioorchestrationmodule-interface)                                 |
| UPS-API-010 | Internal [NewspaperContractAdapter](interfaces.md#internal-newspapercontractadapter-interface) remains adapter-only with no runtime imports.            | Boundary constraint    | [interfaces.md](interfaces.md#internal-newspapercontractadapter-interface)                                  |

## UI Contract Obligations

| Test ID    | Obligation                                                                                                       | Type                 | Source                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| UPS-UI-001 | Route `/ui-prototyping-studio` requires authenticated read permission.                                           | Route contract       | [UI-SPEC.md](UI-SPEC.md#route-table)                                                              |
| UPS-UI-002 | Workbench layout includes session controls, variant canvas, annotation panel, mutation panel, revision timeline. | Layout contract      | [UI-SPEC.md](UI-SPEC.md#page-layouts)                                                             |
| UPS-UI-003 | Form validation enforces `variantCount` bounds and canonical comment fields.                                     | Form contract        | [UI-SPEC.md](UI-SPEC.md#form-and-selection-contracts)                                             |
| UPS-UI-004 | Multi-option baseline gate blocks annotation/apply controls until explicit selection.                            | Interaction contract | [UI-SPEC.md](UI-SPEC.md#interaction-contract)                                                     |
| UPS-UI-005 | Single-option branch marks baseline as committed and unlocks annotation flow.                                    | Interaction contract | [UI-SPEC.md](UI-SPEC.md#interaction-contract)                                                     |
| UPS-UI-006 | Manual approval is required before apply controls become active.                                                 | Interaction contract | [UI-SPEC.md](UI-SPEC.md#interaction-contract)                                                     |
| UPS-UI-007 | State indicator reflects domain state changes with accessible announcements.                                     | State reflection     | [UI-SPEC.md](UI-SPEC.md#state-to-ui-mapping), [UI-SPEC.md](UI-SPEC.md#accessibility-requirements) |
| UPS-UI-008 | Security constraints enforce escaped text rendering and server-side gate checks.                                 | Security contract    | [UI-SPEC.md](UI-SPEC.md#security-constraints)                                                     |

## Coverage Summary

| Area                       | Obligation Count |
| -------------------------- | ---------------- |
| FR/AC contract obligations | 11               |
| State machine obligations  | 9                |
| Operation rule obligations | 10               |
| Interface obligations      | 10               |
| UI obligations             | 8                |
| Total                      | 48               |

## Notes

- This artifact defines verification obligations only.
- Implementation test code and fixtures are out of scope for this stage.
