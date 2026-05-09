# Operations: UI Prototyping Studio

## Capability Backlinks

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## InitializeSession

**Type:** Operation (mutation)
**Actor:** User
**Triggers:** Start new session command

### Input

| Field                 | Type    | Required | Description           |
| --------------------- | ------- | -------- | --------------------- |
| requestedVariantCount | integer | no       | Desired variant count |
| requestedBy           | string  | yes      | User identifier       |

### Rules

| ID  | Rule                                            | Formal                                            |
| --- | ----------------------------------------------- | ------------------------------------------------- |
| R1  | Missing `requestedVariantCount` defaults to `3` | `variantCount = requestedVariantCount ?? 3`       |
| R2  | Variant count is bounded                        | `variantCount in {1,2,3}`                         |
| R3  | Session starts with manual governance gates     | `selectionGate='pending' and applyGate='pending'` |

### Calculations

| ID  | Calculation            | Formula                                      |
| --- | ---------------------- | -------------------------------------------- |
| C1  | Session variant labels | `labels = take(['A','B','C'], variantCount)` |

### State Transition

[StudioSession](domain.md#studiosession): `[none] -> SessionInitialized`

### Postconditions

- One [StudioSession](domain.md#studiosession) is persisted with [VariantCount](domain.md#variantcount).
- `selectionGate` and `applyGate` are initialized to [GateState](domain.md#gatestate).`pending`.

### Error States

| Condition                    | Result                                   |
| ---------------------------- | ---------------------------------------- |
| Variant count outside `1..3` | Reject with `VARIANT_COUNT_OUT_OF_RANGE` |

---

## SubmitPrompt

**Type:** Operation (mutation)
**Actor:** User
**Triggers:** Prompt submit action

### Input

| Field       | Type   | Required | Description                                               |
| ----------- | ------ | -------- | --------------------------------------------------------- |
| sessionId   | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| prompt      | string | yes      | Prompt text for generation                                |
| submittedBy | string | yes      | User identifier                                           |

### Rules

| ID  | Rule                                  | Formal                            |
| --- | ------------------------------------- | --------------------------------- |
| R1  | Session must exist                    | `exists StudioSession(sessionId)` |
| R2  | Prompt must be non-empty after trim   | `len(trim(prompt)) > 0`           |
| R3  | Prompt updates active session context | `StudioSession.prompt = prompt`   |

### State Transition

[StudioSession](domain.md#studiosession): `SessionInitialized -> PromptCaptured`

### Postconditions

- Prompt text is stored in [StudioSession](domain.md#studiosession).prompt.
- Session state moves to `PromptCaptured`.

### Error States

| Condition         | Result                          |
| ----------------- | ------------------------------- |
| Session not found | Reject with `SESSION_NOT_FOUND` |
| Empty prompt      | Reject with `PROMPT_REQUIRED`   |

---

## GenerateVariants

**Type:** Operation (mutation)
**Actor:** System
**Triggers:** Generation request after prompt submit

### Input

| Field       | Type   | Required | Description                                               |
| ----------- | ------ | -------- | --------------------------------------------------------- |
| sessionId   | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| requestedBy | string | yes      | Actor requesting generation                               |

### Rules

| ID  | Rule                                                      | Formal                                                                      |
| --- | --------------------------------------------------------- | --------------------------------------------------------------------------- |
| R1  | Session must have prompt before generation                | `len(trim(StudioSession.prompt)) > 0`                                       |
| R2  | Emit exactly `variantCount` variants                      | `count(PrototypeVariant where sessionId)=StudioSession.variantCount.value`  |
| R3  | Every variant must include metadata contract              | `forall variant: has(componentsUsed,rationale,tradeoffs,risk)`              |
| R4  | For `variantCount = 1`, baseline is committed immediately | `variantCount=1 -> baseline.mode='committed' and selectionGate='satisfied'` |
| R5  | For `variantCount > 1`, selection gate remains pending    | `variantCount>1 -> selectionGate='pending'`                                 |

### Calculations

| ID  | Calculation       | Formula                                      |
| --- | ----------------- | -------------------------------------------- |
| C1  | Variant label set | `labels = take(['A','B','C'], variantCount)` |

### State Transition

[StudioSession](domain.md#studiosession): `PromptCaptured -> VariantsReady`

### Postconditions

- [PrototypeVariant](domain.md#prototypevariant) rows are persisted for current cycle.
- Session selection gate state is updated according to `variantCount` semantics.

### Error States

| Condition                   | Result                                          |
| --------------------------- | ----------------------------------------------- |
| Missing prompt              | Reject with `PROMPT_NOT_SET`                    |
| Variant generation mismatch | Reject with `VARIANT_GENERATION_COUNT_MISMATCH` |

---

## SelectOrCommitBaseline

**Type:** Operation (mutation)
**Actor:** User or System
**Triggers:** Baseline resolution stage

### Input

| Field         | Type   | Required | Description                                               |
| ------------- | ------ | -------- | --------------------------------------------------------- |
| sessionId     | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| selectedLabel | string | no       | Required only when `variantCount > 1`                     |
| requestedBy   | string | yes      | Actor identity                                            |

### Rules

| ID  | Rule                                              | Formal                                                                  |
| --- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| R1  | Multi-option mode requires explicit selection     | `variantCount>1 -> selectedLabel in variantLabels`                      |
| R2  | Single-option mode commits baseline automatically | `variantCount=1 -> baseline.mode='committed'`                           |
| R3  | Baseline provenance mode must match branch        | `variantCount>1 -> mode='selected'; variantCount=1 -> mode='committed'` |

### State Transition

[StudioSession](domain.md#studiosession): `VariantsReady -> BaselineReady`

### Postconditions

- [BaselineProvenance](domain.md#baselineprovenance) is persisted on session.
- `selectionGate` moves to [GateState](domain.md#gatestate).`satisfied`.

### Error States

| Condition                                | Result                                    |
| ---------------------------------------- | ----------------------------------------- |
| Missing selection for `variantCount > 1` | Reject with `BASELINE_SELECTION_REQUIRED` |
| Unknown variant label                    | Reject with `BASELINE_LABEL_INVALID`      |

---

## CaptureCommentEvent

**Type:** Operation (mutation)
**Actor:** User
**Triggers:** Element annotation submit

### Input

| Field      | Type                                           | Required | Description                                               |
| ---------- | ---------------------------------------------- | -------- | --------------------------------------------------------- |
| sessionId  | string                                         | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| revisionId | string                                         | yes      | Active revision ID                                        |
| target     | [AnnotationTarget](domain.md#annotationtarget) | yes      | Element-level target                                      |
| severity   | [CommentSeverity](domain.md#commentseverity)   | yes      | Canonical severity enum                                   |
| intent     | string                                         | yes      | Intent classification                                     |
| note       | string                                         | yes      | Comment note                                              |
| createdBy  | string                                         | yes      | User identity                                             |

### Rules

| ID  | Rule                                    | Formal                                          |
| --- | --------------------------------------- | ----------------------------------------------- |
| R1  | Session baseline gate must be satisfied | `StudioSession.selectionGate='satisfied'`       |
| R2  | Canonical comment schema is mandatory   | `has(target,severity,intent,note)`              |
| R3  | Severity must be valid enum value       | `severity in {'blocker','high','medium','low'}` |

### State Transition

[StudioSession](domain.md#studiosession): `BaselineReady -> CommentsCaptured`

### Postconditions

- One [CommentEvent](domain.md#commentevent) is appended to session log.

### Error States

| Condition                   | Result                                  |
| --------------------------- | --------------------------------------- |
| Baseline gate not satisfied | Reject with `BASELINE_GATE_UNSATISFIED` |
| Invalid comment schema      | Reject with `COMMENT_SCHEMA_INVALID`    |

---

## SynthesizeMutationBatch

**Type:** Operation (mutation)
**Actor:** System
**Triggers:** Synthesize draft action

### Input

| Field            | Type   | Required | Description                                               |
| ---------------- | ------ | -------- | --------------------------------------------------------- |
| sessionId        | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| sourceRevisionId | string | yes      | Revision head for deterministic synthesis                 |
| requestedBy      | string | yes      | Actor identity                                            |

### Rules

| ID  | Rule                                    | Formal                                                                         |
| --- | --------------------------------------- | ------------------------------------------------------------------------------ |
| R1  | Ordered comment input must be non-empty | `count(CommentEvent where sessionId and revisionId=sourceRevisionId) > 0`      |
| R2  | Synthesis determinism must hold         | `same(orderedComments, sourceRevisionId) -> same(batch.tasks, batch.checksum)` |
| R3  | Batch status initializes as draft       | `MutationBatch.status='draft'`                                                 |
| R4  | Approval is required before apply       | `MutationBatch.approval.required=true`                                         |

### Calculations

| ID  | Calculation    | Formula                                                               |
| --- | -------------- | --------------------------------------------------------------------- |
| C1  | Batch checksum | `checksum = hash(sourceRevisionId + orderedCommentIds + taskPayload)` |

### State Transition

[StudioSession](domain.md#studiosession): `CommentsCaptured -> MutationDrafted`

### Postconditions

- One [MutationBatch](domain.md#mutationbatch) with status `draft` is persisted.
- Session `applyGate` remains [GateState](domain.md#gatestate).`pending`.

### Error States

| Condition                       | Result                                |
| ------------------------------- | ------------------------------------- |
| No comments for source revision | Reject with `COMMENT_SET_EMPTY`       |
| Source revision mismatch        | Reject with `SOURCE_REVISION_INVALID` |

---

## ApproveMutationBatch

**Type:** Operation (mutation)
**Actor:** User
**Triggers:** Explicit manual approval action

### Input

| Field      | Type              | Required | Description                                               |
| ---------- | ----------------- | -------- | --------------------------------------------------------- |
| sessionId  | string            | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| batchId    | string            | yes      | Target [MutationBatch](domain.md#mutationbatch).batchId   |
| approvedBy | string            | yes      | Approver identity                                         |
| approvedAt | string (ISO-8601) | yes      | Approval timestamp                                        |

### Rules

| ID  | Rule                                          | Formal                                                                                                  |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| R1  | Batch must exist in draft status              | `MutationBatch.status='draft'`                                                                          |
| R2  | Approval identity and timestamp are mandatory | `len(approvedBy)>0 and approvedAt != null`                                                              |
| R3  | Approval only valid for current revision head | `MutationBatch.sourceRevisionId = StudioSession.revisionHeadId OR StudioSession.revisionHeadId is null` |

### State Transition

[StudioSession](domain.md#studiosession): `MutationDrafted -> MutationApproved`

### Postconditions

- Batch status changes to [MutationBatchStatus](domain.md#mutationbatchstatus).`approved`.
- Session `applyGate` becomes [GateState](domain.md#gatestate).`satisfied`.

### Error States

| Condition                            | Result                                   |
| ------------------------------------ | ---------------------------------------- |
| Batch not in draft status            | Reject with `BATCH_NOT_DRAFT`            |
| Missing approver metadata            | Reject with `APPROVAL_METADATA_REQUIRED` |
| Approval stale against revision head | Reject with `APPROVAL_STALE`             |

---

## ApplyApprovedBatch

**Type:** Operation (mutation)
**Actor:** User
**Triggers:** Explicit apply action

### Input

| Field            | Type   | Required | Description                                               |
| ---------------- | ------ | -------- | --------------------------------------------------------- |
| sessionId        | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| batchId          | string | yes      | Approved [MutationBatch](domain.md#mutationbatch).batchId |
| applyRequestedBy | string | yes      | Actor requesting apply                                    |

### Rules

| ID  | Rule                                          | Formal                                                                                                  |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| R1  | Apply requires manual trigger (no auto-apply) | `applyRequestedBy != 'system:auto'`                                                                     |
| R2  | Batch must be approved                        | `MutationBatch.status='approved'`                                                                       |
| R3  | Baseline gate must be satisfied               | `StudioSession.selectionGate='satisfied'`                                                               |
| R4  | Batch must target current revision head       | `MutationBatch.sourceRevisionId = StudioSession.revisionHeadId OR StudioSession.revisionHeadId is null` |
| R5  | Success appends exactly one manifest entry    | `appendCount(RevisionManifestEntry)=1 per successful apply`                                             |

### Calculations

| ID  | Calculation      | Formula                                                   |
| --- | ---------------- | --------------------------------------------------------- |
| C1  | Next revision ID | `nextRevision = increment(currentRevisionHead)`           |
| C2  | Diff summary     | `diff = {added, changed, removed}` from applied patch set |

### State Transition

[StudioSession](domain.md#studiosession): `MutationApproved -> RevisionApplied -> RevisionRecorded`

### Postconditions

- Batch status changes to [MutationBatchStatus](domain.md#mutationbatchstatus).`applied`.
- One [RevisionManifestEntry](domain.md#revisionmanifestentry) is appended.
- [StudioSession](domain.md#studiosession).revisionHeadId updates to new revision.

### Error States

| Condition             | Result                                |
| --------------------- | ------------------------------------- |
| Auto-apply attempt    | Reject with `AUTO_APPLY_FORBIDDEN`    |
| Batch not approved    | Reject with `BATCH_APPROVAL_REQUIRED` |
| Source revision stale | Reject with `BATCH_STALE_FOR_HEAD`    |

---

## ExportDesignHandoff

**Type:** Operation (mutation)
**Actor:** User or System
**Triggers:** Handoff generation request

### Input

| Field         | Type   | Required | Description                                               |
| ------------- | ------ | -------- | --------------------------------------------------------- |
| sessionId     | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| exportProfile | string | no       | Defaults to `mvp`                                         |
| requestedBy   | string | yes      | Actor identity                                            |

### Rules

| ID  | Rule                                                  | Formal                                              |
| --- | ----------------------------------------------------- | --------------------------------------------------- |
| R1  | Handoff requires at least one revision entry          | `count(RevisionManifestEntry where sessionId) >= 1` |
| R2  | Handoff must include UI and test references           | `includes(UI-SPEC.md, TEST-SPEC.md, STORIES.md)`    |
| R3  | Integration readiness flags must align with artifacts | `flags == artifactPresence`                         |

### State Transition

[StudioSession](domain.md#studiosession): `RevisionRecorded -> RevisionRecorded`

### Postconditions

- Session integration flags in [IntegrationReadiness](domain.md#integrationreadiness) are updated.
- Handoff bundle becomes queryable via [GetHandoffBundle](queries.md#gethandoffbundle).

### Error States

| Condition                     | Result                                     |
| ----------------------------- | ------------------------------------------ |
| No revision evidence          | Reject with `HANDOFF_REVISION_REQUIRED`    |
| Missing downstream references | Reject with `HANDOFF_REFERENCE_INCOMPLETE` |
