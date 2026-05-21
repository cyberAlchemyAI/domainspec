# Interfaces: UI Prototyping Studio

## Capability Backlinks

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Newspaper Adapter Compatibility](SPEC.md#newspaper-adapter-compatibility)
- [Evolution Engine](SPEC.md#evolution-engine)
- [Proof and Self-Improvement Gate](SPEC.md#proof-and-self-improvement-gate)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## External: UIPrototypingStudioAPI (REST)

### POST /api/ui-prototyping-studio/sessions

**Exposes:** [InitializeSession](operations.md#initializesession)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:**

| Field                 | Type    | Maps To                                                                    |
| --------------------- | ------- | -------------------------------------------------------------------------- |
| requestedVariantCount | integer | [InitializeSession](operations.md#initializesession).requestedVariantCount |
| generationMode        | string  | [InitializeSession](operations.md#initializesession).generationMode        |
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

| Field          | Type   | Maps To                                                           |
| -------------- | ------ | ----------------------------------------------------------------- |
| sessionId      | string | [GenerateVariants](operations.md#generatevariants).sessionId      |
| generationMode | string | [GenerateVariants](operations.md#generatevariants).generationMode |
| requestedBy    | string | [GenerateVariants](operations.md#generatevariants).requestedBy    |

**Responses:**

| Status | Condition       | Body                                              |
| ------ | --------------- | ------------------------------------------------- |
| 200    | Success         | Variant list with suggested identity/DNA metadata |
| 404    | Session missing | Error                                             |
| 409    | Prompt not set  | Rule violation                                    |

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

| Status | Condition          | Body                                                                                                                                                    |
| ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200    | Success            | Updated baseline state with [BaselineRevisionAnchor](domain.md#baselinerevisionanchor) and [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) |
| 409    | Selection required | Rule violation                                                                                                                                          |
| 422    | Label invalid      | Validation error                                                                                                                                        |

### POST /api/ui-prototyping-studio/sessions/:sessionId/ui-decision-evidence

**Exposes:** [ConfirmUIDecisionEvidence](operations.md#confirmuidecisionevidence)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)

**Request:** identity, instance, visual signature, decision record, target typed references, and `confirmedBy`.

**Responses:**

| Status | Condition                  | Body                      |
| ------ | -------------------------- | ------------------------- |
| 201    | Success                    | Confirmed decision record |
| 409    | Baseline family missing    | Rule violation            |
| 422    | Invalid visual DNA or refs | Validation error          |

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
**Returns:** Session state, gate state, baseline provenance, and optional L1 baseline genealogy family when available.

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

### POST /api/ui-prototyping-studio/sessions/:sessionId/handoff/export

**Exposes:** [ExportDesignHandoff](operations.md#exportdesignhandoff)
**Auth:** Bearer token (`domainspec.ui-prototyping.write`)
**Returns:** Updated integration readiness and the queryable handoff bundle.

### L1 Read Endpoints

These endpoints are L1 observability surfaces. They do not change MVP apply gates.

| Endpoint                                                                       | Exposes                                                     | Auth                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------- |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/evolution-cycles/:cycleId` | [GetEvolutionCycle](queries.md#getevolutioncycle)           | `domainspec.ui-prototyping.read` |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/fitness-signals`           | [ListFitnessSignals](queries.md#listfitnesssignals)         | `domainspec.ui-prototyping.read` |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/ui-decision-evidence`      | [ListUIDecisionEvidence](queries.md#listuidecisionevidence) | `domainspec.ui-prototyping.read` |

### L2/L3 Promotion Endpoints

These endpoints are proof/promotion surfaces and are not required for normal MVP apply.

| Endpoint                                                                   | Exposes                                                           | Layer                      |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------- |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/proof-gates/evaluate` | [EvaluateProofGate](operations.md#evaluateproofgate)              | L2                         |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/rule-promotions`      | [PromoteEvolutionRule](operations.md#promoteevolutionrule)        | L2 deferred, L3 promotable |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/rule-promotions`       | [ListRulePromotionRequests](queries.md#listrulepromotionrequests) | L2/L3 read                 |

---

## Internal: StudioOrchestrationModule Interface

**Consumers:** Studio controllers, workflow coordinator, handoff publisher

| Method                           | Maps To                                                              | Description                                                   |
| -------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| initializeSession(input)         | [InitializeSession](operations.md#initializesession)                 | Create session with bounded `variantCount`                    |
| submitPrompt(input)              | [SubmitPrompt](operations.md#submitprompt)                           | Persist prompt and prepare generation                         |
| generateVariants(input)          | [GenerateVariants](operations.md#generatevariants)                   | Build candidate variants with metadata                        |
| selectOrCommitBaseline(input)    | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline)       | Resolve baseline gate branch                                  |
| captureCommentEvent(input)       | [CaptureCommentEvent](operations.md#capturecommentevent)             | Append canonical comment event                                |
| synthesizeMutationBatch(input)   | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch)     | Produce deterministic draft batch                             |
| approveMutationBatch(input)      | [ApproveMutationBatch](operations.md#approvemutationbatch)           | Apply explicit approval metadata                              |
| applyApprovedBatch(input)        | [ApplyApprovedBatch](operations.md#applyapprovedbatch)               | Apply approved batch and append revision                      |
| recordFitnessSignal(input)       | [RecordFitnessSignal](operations.md#recordfitnesssignal)             | Append fitness evidence signal                                |
| confirmUIDecisionEvidence(input) | [ConfirmUIDecisionEvidence](operations.md#confirmuidecisionevidence) | Confirm identity, instance, visual DNA, and decision evidence |
| evaluateProofGate(input)         | [EvaluateProofGate](operations.md#evaluateproofgate)                 | Evaluate proof obligations for mutation                       |
| promoteEvolutionRule(input)      | [PromoteEvolutionRule](operations.md#promoteevolutionrule)           | Record or apply governed self-improvement                     |
| exportDesignHandoff(input)       | [ExportDesignHandoff](operations.md#exportdesignhandoff)             | Prepare downstream handoff bundle                             |
| getSessionSnapshot(input)        | [GetSessionSnapshot](queries.md#getsessionsnapshot)                  | Read current session state                                    |
| listSessionVariants(input)       | [ListSessionVariants](queries.md#listsessionvariants)                | Read generated variants                                       |
| getEvolutionCycle(input)         | [GetEvolutionCycle](queries.md#getevolutioncycle)                    | Read L1 evolution cycle                                       |
| listFitnessSignals(input)        | [ListFitnessSignals](queries.md#listfitnesssignals)                  | Read L1 fitness evidence                                      |
| listRulePromotionRequests(input) | [ListRulePromotionRequests](queries.md#listrulepromotionrequests)    | Read proof-governed promotion requests                        |
| getDraftMutationBatch(input)     | [GetDraftMutationBatch](queries.md#getdraftmutationbatch)            | Read draft batch                                              |
| listRevisionManifest(input)      | [ListRevisionManifest](queries.md#listrevisionmanifest)              | Read revision history                                         |
| listUIDecisionEvidence(input)    | [ListUIDecisionEvidence](queries.md#listuidecisionevidence)          | Read confirmed UI identity and visual DNA evidence            |
| getHandoffBundle(input)          | [GetHandoffBundle](queries.md#gethandoffbundle)                      | Read handoff artifacts                                        |

---

## Internal: NewspaperContractAdapter Interface

**Consumers:** Orchestration module

| Method                          | Maps To                                                          | Description                                       |
| ------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| mapCommentEvent(input)          | [CaptureCommentEvent](operations.md#capturecommentevent)         | Map canonical comment payload to adapter contract |
| mapMutationBatch(input)         | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch) | Map deterministic batch to adapter payload        |
| mapRevisionManifestEntry(input) | [ApplyApprovedBatch](operations.md#applyapprovedbatch)           | Map revision evidence to adapter manifest row     |

**Boundary Rule:** Adapter methods are internal mapping helpers only and must not import newspaper runtime modules.

---

## Internal: GodelDarwinEvolutionAdapter Interface

**Consumers:** Studio orchestration module, future generation strategy registry

| Method                           | Maps To                                                              | Description                                                                      |
| -------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| encodePrototypeGenome(input)     | [EvolutionCycle](domain.md#evolutioncycle)                           | Builds genome from prompt, constraints, comments, and refs                       |
| recordBaselineFamily(input)      | [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily)         | Records selected population family for L1 observability                          |
| proposeUIIdentityEvidence(input) | [UIElementIdentity](domain.md#uielementidentity)                     | Suggests conceptual identities, instances, and visual DNA for generated variants |
| confirmUIIdentityEvidence(input) | [ConfirmUIDecisionEvidence](operations.md#confirmuidecisionevidence) | Persists human-confirmed identity, visual DNA, and decision evidence             |
| recordFitnessSignal(input)       | [RecordFitnessSignal](operations.md#recordfitnesssignal)             | Captures human/test/risk/governance selection pressure                           |
| evaluateProofGate(input)         | [EvaluateProofGate](operations.md#evaluateproofgate)                 | Produces pass/flag/block proof status                                            |
| requestRulePromotion(input)      | [PromoteEvolutionRule](operations.md#promoteevolutionrule)           | Defers or promotes generation strategy changes                                   |

**Boundary Rule:** The adapter may summarize evidence and propose future rule changes, but MVP runtime MUST defer direct generation-rule promotion.
