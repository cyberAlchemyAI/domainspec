# Interfaces: UI Prototyping Studio

## Capability Backlinks

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Newspaper Adapter Compatibility](SPEC.md#newspaper-adapter-compatibility)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## External: UIPrototypingStudioAPI (REST)

### POST /api/ui-prototyping-studio/sessions

**Exposes:** [InitializeSession](operations.md#initializesession)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field                 | Type    | Maps To                                                                    |
| --------------------- | ------- | -------------------------------------------------------------------------- |
| requestedVariantCount | integer | [InitializeSession](operations.md#initializesession).requestedVariantCount |
| requestedBy           | string  | [InitializeSession](operations.md#initializesession).requestedBy           |

**Responses:**

| Status | Condition             | Body             |
| ------ | --------------------- | ---------------- |
| 201    | Success               | Session snapshot |
| 401    | Unauthorized          | Auth error       |
| 422    | Invalid variant count | Validation error |

### POST /api/ui-prototyping-studio/sessions/:sessionId/prompt

**Exposes:** [SubmitPrompt](operations.md#submitprompt)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field       | Type   | Maps To                                                |
| ----------- | ------ | ------------------------------------------------------ |
| sessionId   | string | [SubmitPrompt](operations.md#submitprompt).sessionId   |
| prompt      | string | [SubmitPrompt](operations.md#submitprompt).prompt      |
| submittedBy | string | [SubmitPrompt](operations.md#submitprompt).submittedBy |

**Responses:**

| Status | Condition       | Body                     |
| ------ | --------------- | ------------------------ |
| 200    | Success         | Updated session snapshot |
| 404    | Session missing | Error                    |
| 422    | Prompt invalid  | Validation error         |

### POST /api/ui-prototyping-studio/sessions/:sessionId/variants/generate

**Exposes:** [GenerateVariants](operations.md#generatevariants)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field       | Type   | Maps To                                                        |
| ----------- | ------ | -------------------------------------------------------------- |
| sessionId   | string | [GenerateVariants](operations.md#generatevariants).sessionId   |
| requestedBy | string | [GenerateVariants](operations.md#generatevariants).requestedBy |

**Responses:**

| Status | Condition       | Body           |
| ------ | --------------- | -------------- |
| 200    | Success         | Variant list   |
| 404    | Session missing | Error          |
| 409    | Prompt not set  | Rule violation |

### POST /api/ui-prototyping-studio/sessions/:sessionId/baseline

**Exposes:** [SelectOrCommitBaseline](operations.md#selectorcommitbaseline)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field         | Type   | Maps To                                                                      |
| ------------- | ------ | ---------------------------------------------------------------------------- |
| sessionId     | string | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline).sessionId     |
| selectedLabel | string | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline).selectedLabel |
| requestedBy   | string | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline).requestedBy   |

**Responses:**

| Status | Condition          | Body                   |
| ------ | ------------------ | ---------------------- |
| 200    | Success            | Updated baseline state |
| 409    | Selection required | Rule violation         |
| 422    | Label invalid      | Validation error       |

### POST /api/ui-prototyping-studio/sessions/:sessionId/comments

**Exposes:** [CaptureCommentEvent](operations.md#capturecommentevent)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field      | Type   | Maps To                                                             |
| ---------- | ------ | ------------------------------------------------------------------- |
| sessionId  | string | [CaptureCommentEvent](operations.md#capturecommentevent).sessionId  |
| revisionId | string | [CaptureCommentEvent](operations.md#capturecommentevent).revisionId |
| target     | object | [CaptureCommentEvent](operations.md#capturecommentevent).target     |
| severity   | string | [CaptureCommentEvent](operations.md#capturecommentevent).severity   |
| intent     | string | [CaptureCommentEvent](operations.md#capturecommentevent).intent     |
| note       | string | [CaptureCommentEvent](operations.md#capturecommentevent).note       |
| createdBy  | string | [CaptureCommentEvent](operations.md#capturecommentevent).createdBy  |

**Responses:**

| Status | Condition                 | Body             |
| ------ | ------------------------- | ---------------- |
| 201    | Success                   | Comment record   |
| 409    | Baseline gate unsatisfied | Rule violation   |
| 422    | Schema invalid            | Validation error |

### POST /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/synthesize

**Exposes:** [SynthesizeMutationBatch](operations.md#synthesizemutationbatch)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field            | Type   | Maps To                                                                           |
| ---------------- | ------ | --------------------------------------------------------------------------------- |
| sessionId        | string | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch).sessionId        |
| sourceRevisionId | string | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch).sourceRevisionId |
| requestedBy      | string | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch).requestedBy      |

**Responses:**

| Status | Condition         | Body                 |
| ------ | ----------------- | -------------------- |
| 201    | Success           | Draft mutation batch |
| 409    | Comment set empty | Rule violation       |
| 422    | Revision invalid  | Validation error     |

### POST /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/:batchId/approve

**Exposes:** [ApproveMutationBatch](operations.md#approvemutationbatch)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field      | Type   | Maps To                                                               |
| ---------- | ------ | --------------------------------------------------------------------- |
| sessionId  | string | [ApproveMutationBatch](operations.md#approvemutationbatch).sessionId  |
| batchId    | string | [ApproveMutationBatch](operations.md#approvemutationbatch).batchId    |
| approvedBy | string | [ApproveMutationBatch](operations.md#approvemutationbatch).approvedBy |
| approvedAt | string | [ApproveMutationBatch](operations.md#approvemutationbatch).approvedAt |

**Responses:**

| Status | Condition                 | Body             |
| ------ | ------------------------- | ---------------- |
| 200    | Success                   | Approved batch   |
| 409    | Batch not draft or stale  | Rule violation   |
| 422    | Missing approval metadata | Validation error |

### POST /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/:batchId/apply

**Exposes:** [ApplyApprovedBatch](operations.md#applyapprovedbatch)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field            | Type   | Maps To                                                                 |
| ---------------- | ------ | ----------------------------------------------------------------------- |
| sessionId        | string | [ApplyApprovedBatch](operations.md#applyapprovedbatch).sessionId        |
| batchId          | string | [ApplyApprovedBatch](operations.md#applyapprovedbatch).batchId          |
| applyRequestedBy | string | [ApplyApprovedBatch](operations.md#applyapprovedbatch).applyRequestedBy |

**Responses:**

| Status | Condition               | Body                        |
| ------ | ----------------------- | --------------------------- |
| 200    | Success                 | New revision manifest entry |
| 409    | Approval/gate violation | Rule violation              |
| 422    | Stale source revision   | Validation error            |

### GET /api/ui-prototyping-studio/sessions/:sessionId

**Exposes:** [GetSessionSnapshot](queries.md#getsessionsnapshot)
**Auth:** Bearer token (`domainspec.ui-prototyping.read`)

### GET /api/ui-prototyping-studio/sessions/:sessionId/variants

**Exposes:** [ListSessionVariants](queries.md#listsessionvariants)
**Auth:** Bearer token (`domainspec.ui-prototyping.read`)

### GET /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/draft

**Exposes:** [GetDraftMutationBatch](queries.md#getdraftmutationbatch)
**Auth:** Bearer token (`domainspec.ui-prototyping.read`)

### GET /api/ui-prototyping-studio/sessions/:sessionId/revisions

**Exposes:** [ListRevisionManifest](queries.md#listrevisionmanifest)
**Auth:** Bearer token (`domainspec.ui-prototyping.read`)

### GET /api/ui-prototyping-studio/sessions/:sessionId/handoff

**Exposes:** [GetHandoffBundle](queries.md#gethandoffbundle)
**Auth:** Bearer token (`domainspec.ui-prototyping.read`)

---

## Internal: StudioOrchestrationModule Interface

**Consumers:** Studio controllers, workflow coordinator, handoff publisher

| Method                         | Maps To                                                          | Description                                |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------------------------ |
| initializeSession(input)       | [InitializeSession](operations.md#initializesession)             | Create session with bounded `variantCount` |
| submitPrompt(input)            | [SubmitPrompt](operations.md#submitprompt)                       | Persist prompt and prepare generation      |
| generateVariants(input)        | [GenerateVariants](operations.md#generatevariants)               | Build candidate variants with metadata     |
| selectOrCommitBaseline(input)  | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline)   | Resolve baseline gate branch               |
| captureCommentEvent(input)     | [CaptureCommentEvent](operations.md#capturecommentevent)         | Append canonical comment event             |
| synthesizeMutationBatch(input) | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch) | Produce deterministic draft batch          |
| approveMutationBatch(input)    | [ApproveMutationBatch](operations.md#approvemutationbatch)       | Apply explicit approval metadata           |
| applyApprovedBatch(input)      | [ApplyApprovedBatch](operations.md#applyapprovedbatch)           | Apply approved batch and append revision   |
| exportDesignHandoff(input)     | [ExportDesignHandoff](operations.md#exportdesignhandoff)         | Prepare downstream handoff bundle          |
| getSessionSnapshot(input)      | [GetSessionSnapshot](queries.md#getsessionsnapshot)              | Read current session state                 |
| listSessionVariants(input)     | [ListSessionVariants](queries.md#listsessionvariants)            | Read generated variants                    |
| getDraftMutationBatch(input)   | [GetDraftMutationBatch](queries.md#getdraftmutationbatch)        | Read draft batch                           |
| listRevisionManifest(input)    | [ListRevisionManifest](queries.md#listrevisionmanifest)          | Read revision history                      |
| getHandoffBundle(input)        | [GetHandoffBundle](queries.md#gethandoffbundle)                  | Read handoff artifacts                     |

---

## Internal: NewspaperContractAdapter Interface

**Consumers:** Orchestration module

| Method                          | Maps To                                                          | Description                                       |
| ------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| mapCommentEvent(input)          | [CaptureCommentEvent](operations.md#capturecommentevent)         | Map canonical comment payload to adapter contract |
| mapMutationBatch(input)         | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch) | Map deterministic batch to adapter payload        |
| mapRevisionManifestEntry(input) | [ApplyApprovedBatch](operations.md#applyapprovedbatch)           | Map revision evidence to adapter manifest row     |

**Boundary Rule:** Adapter methods are internal mapping helpers only and must not import newspaper runtime modules.
