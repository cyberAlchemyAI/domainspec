# Operations: UI Prototyping Studio

## Capability Backlinks

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Evolution Engine](SPEC.md#evolution-engine)
- [Proof and Self-Improvement Gate](SPEC.md#proof-and-self-improvement-gate)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## InitializeSession

**Type:** Operation (mutation)
**Actor:** User
**Triggers:** Start new session command

### Input

| Field                 | Type                                       | Required | Description                            |
| --------------------- | ------------------------------------------ | -------- | -------------------------------------- |
| requestedVariantCount | integer                                    | no       | Desired variant count                  |
| generationMode        | [GenerationMode](domain.md#generationmode) | no       | Defaults to `explore` for new sessions |
| requestedBy           | string                                     | yes      | User identifier                        |

### Rules

| ID  | Rule                                            | Formal                                            |
| --- | ----------------------------------------------- | ------------------------------------------------- |
| R1  | Missing `requestedVariantCount` defaults to `3` | `variantCount = requestedVariantCount ?? 3`       |
| R2  | Variant count is bounded                        | `variantCount in {1,2,3}`                         |
| R3  | Session starts with manual governance gates     | `selectionGate='pending' and applyGate='pending'` |
| R4  | Missing generation mode defaults to Explore     | `generationMode = generationMode ?? 'explore'`    |

### Calculations

| ID  | Calculation            | Formula                                      |
| --- | ---------------------- | -------------------------------------------- |
| C1  | Session variant labels | `labels = take(['A','B','C'], variantCount)` |

### State Transition

[StudioSession](domain.md#studiosession): `[none] -> SessionInitialized`

### Postconditions

- One [StudioSession](domain.md#studiosession) is persisted with [VariantCount](domain.md#variantcount).
- Session [GenerationMode](domain.md#generationmode) is set.
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

| Field          | Type                                       | Required | Description                                                                 |
| -------------- | ------------------------------------------ | -------- | --------------------------------------------------------------------------- |
| sessionId      | string                                     | yes      | Target [StudioSession](domain.md#studiosession).sessionId                   |
| generationMode | [GenerationMode](domain.md#generationmode) | yes      | `explore` for new directions; `exploit` for baseline-constrained candidates |
| requestedBy    | string                                     | yes      | Actor requesting generation                                                 |

### Rules

| ID  | Rule                                                      | Formal                                                                                      |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| R1  | Session must have prompt before generation                | `len(trim(StudioSession.prompt)) > 0`                                                       |
| R2  | Emit exactly `variantCount` variants                      | `count(PrototypeVariant where sessionId)=StudioSession.variantCount.value`                  |
| R3  | Every variant must include metadata contract              | `forall variant: has(componentsUsed,rationale,tradeoffs,risk)`                              |
| R4  | For `variantCount = 1`, baseline is committed immediately | `variantCount=1 -> baseline.mode='committed' and selectionGate='satisfied'`                 |
| R5  | For `variantCount > 1`, selection gate remains pending    | `variantCount>1 -> selectionGate='pending'`                                                 |
| R6  | Explore offers new solution directions                    | `generationMode='explore' -> candidates are not constrained by existing family`             |
| R7  | Exploit conforms to selected baseline                     | `generationMode='exploit' -> requires baseline and uses confirmed identity/DNA constraints` |
| R8  | Identity and visual DNA metadata starts as suggestion     | `suggested(UIElementIdentity, UIVisualSignature) and not durable until confirmed`           |

### Calculations

| ID  | Calculation       | Formula                                      |
| --- | ----------------- | -------------------------------------------- |
| C1  | Variant label set | `labels = take(['A','B','C'], variantCount)` |

### State Transition

[StudioSession](domain.md#studiosession): `PromptCaptured -> VariantsReady`

### Postconditions

- [PrototypeVariant](domain.md#prototypevariant) rows are persisted for current cycle.
- Session selection gate state is updated according to `variantCount` semantics.
- Generated variants attach proposed [UIElementIdentity](domain.md#uielementidentity) and [UIVisualSignature](domain.md#uivisualsignature) IDs for baseline or exploit review.

### Error States

| Condition                   | Result                                          |
| --------------------------- | ----------------------------------------------- |
| Missing prompt              | Reject with `PROMPT_NOT_SET`                    |
| Exploit without baseline    | Reject with `EXPLOIT_BASELINE_REQUIRED`         |
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

| ID  | Rule                                                      | Formal                                                                  |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| R1  | Multi-option mode requires explicit selection             | `variantCount>1 -> selectedLabel in variantLabels`                      |
| R2  | Single-option mode commits the only baseline              | `variantCount=1 -> baseline.mode='committed'`                           |
| R3  | Baseline provenance mode must match branch                | `variantCount>1 -> mode='selected'; variantCount=1 -> mode='committed'` |
| R4  | Baseline resolution creates explicit anchor               | `BaselineReady -> create BaselineRevisionAnchor(baselineRevisionId)`    |
| R5  | Baseline resolution creates genealogy family idempotently | `BaselineReady createsOrUpdates BaselineGenealogyFamily(sessionId)`     |

### Calculations

| ID  | Calculation                | Formula                                                                                            |
| --- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| C1  | Family population snapshot | `populationVariantLabels = variants.map(variantLabel)`                                             |
| C2  | Baseline revision anchor   | `baselineRevisionId = createStableAnchor(sessionId, selectedBaseline, selectedVariantArtifactRef)` |
| C3  | Family selected baseline   | `selectedBaseline = BaselineProvenance(mode, selectedLabel or primary)`                            |

### State Transition

[StudioSession](domain.md#studiosession): `VariantsReady -> BaselineReady`

### Postconditions

- [BaselineProvenance](domain.md#baselineprovenance) is persisted on session.
- [BaselineRevisionAnchor](domain.md#baselinerevisionanchor) is created and assigned to the session.
- [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) is created or updated idempotently for the generated population and selected survivor.
- `selectionGate` moves to [GateState](domain.md#gatestate).`satisfied`.
- For single-variant sessions that already reached baseline-ready during [GenerateVariants](#generatevariants), genealogy creation uses that committed baseline as the selected survivor.

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

| ID  | Rule                                     | Formal                                                                                   |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| R1  | Session baseline gate must be satisfied  | `StudioSession.selectionGate='satisfied'`                                                |
| R2  | Canonical comment schema is mandatory    | `has(target,severity,intent,note)`                                                       |
| R3  | Severity must be valid enum value        | `severity in {'blocker','high','medium','low'}`                                          |
| R4  | Comment targets explicit baseline anchor | `revisionId = StudioSession.baselineRevisionAnchor.baselineRevisionId or revisionHeadId` |

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

## RecordFitnessSignal

**Type:** Operation (mutation)
**Actor:** User or System
**Triggers:** Baseline selection, comment capture, test result, risk review, or governance evidence capture

### Input

| Field      | Type                                                 | Required | Description                                                                                |
| ---------- | ---------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| sessionId  | string                                               | yes      | Target [StudioSession](domain.md#studiosession).sessionId                                  |
| cycleId    | string                                               | yes      | Target [EvolutionCycle](domain.md#evolutioncycle).cycleId                                  |
| source     | [FitnessSignalSource](domain.md#fitnesssignalsource) | yes      | Source of the selection pressure                                                           |
| targetRef  | [TypedReference](domain.md#typedreference)           | yes      | Variant, comment, batch, revision, identity, visual signature, decision, or rule reference |
| vector     | [FitnessVector](domain.md#fitnessvector)             | yes      | Normalized fitness direction                                                               |
| rationale  | string                                               | yes      | Why this signal matters                                                                    |
| capturedBy | string                                               | yes      | Capturing actor                                                                            |

### Rules

| ID  | Rule                                    | Formal                                                       |
| --- | --------------------------------------- | ------------------------------------------------------------ |
| R1  | Evolution cycle must exist              | `exists EvolutionCycle(cycleId)`                             |
| R2  | Target must belong to the same session  | `targetRef.sessionId = sessionId` where target is resolvable |
| R3  | Fitness vector confidence is normalized | `0.0 <= vector.confidence <= 1.0`                            |
| R4  | Rationale is required for auditability  | `len(trim(rationale)) > 0`                                   |

### State Transition

[EvolutionCycle](domain.md#evolutioncycle): `PopulationGenerated -> FitnessEvaluated`

### Postconditions

- One [FitnessSignal](domain.md#fitnesssignal) is appended to the cycle.
- [EvolutionCycle](domain.md#evolutioncycle).fitnessSignalIds includes the new signal.

### Error States

| Condition              | Result                                    |
| ---------------------- | ----------------------------------------- |
| Cycle not found        | Reject with `CYCLE_NOT_FOUND`             |
| Target outside session | Reject with `FITNESS_TARGET_OUT_OF_SCOPE` |
| Invalid fitness vector | Reject with `FITNESS_VECTOR_INVALID`      |

---

## ConfirmUIDecisionEvidence

**Type:** Operation (mutation)
**Actor:** User
**Triggers:** Baseline selection review or exploit candidate review

Confirms proposed UI element identity, rendered instance, visual DNA, and decision evidence so genealogy can relate later Explore and Exploit generations.

### Input

| Field             | Type                                             | Required | Description                                                                  |
| ----------------- | ------------------------------------------------ | -------- | ---------------------------------------------------------------------------- |
| sessionId         | string                                           | yes      | Target [StudioSession](domain.md#studiosession).sessionId                    |
| genealogyFamilyId | string                                           | yes      | Target [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily).familyId |
| identity          | [UIElementIdentity](domain.md#uielementidentity) | yes      | Conceptual UI element identity to confirm                                    |
| instance          | [UIElementInstance](domain.md#uielementinstance) | yes      | Rendered occurrence of that identity                                         |
| visualSignature   | [UIVisualSignature](domain.md#uivisualsignature) | yes      | Visual DNA evidence for the rendered occurrence                              |
| decisionRecord    | [UIDecisionRecord](domain.md#uidecisionrecord)   | yes      | Human-confirmed rationale and decision type                                  |
| confirmedBy       | string                                           | yes      | Human actor confirming the evidence                                          |

### Rules

| ID  | Rule                                      | Formal                                                           |
| --- | ----------------------------------------- | ---------------------------------------------------------------- |
| R1  | Baseline family must exist                | `exists BaselineGenealogyFamily(genealogyFamilyId)`              |
| R2  | Identity must belong to the same family   | `identity.genealogyFamilyId = genealogyFamilyId`                 |
| R3  | Instance must reference the identity      | `instance.identityId = identity.identityId`                      |
| R4  | Visual DNA must use controlled vocabulary | `forall signature fields: value in controlled enum or tokenRefs` |
| R5  | Decision rationale is required            | `len(trim(decisionRecord.rationale)) > 0`                        |
| R6  | Human confirmation is required            | `confirmedBy != 'system:auto'`                                   |

### Postconditions

- [UIElementIdentity](domain.md#uielementidentity), [UIElementInstance](domain.md#uielementinstance), [UIVisualSignature](domain.md#uivisualsignature), and [UIDecisionRecord](domain.md#uidecisionrecord) are durable genealogy evidence.
- [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) includes the confirmed identity, decision, and visual signature IDs.
- Generated suggestions not included in this operation remain non-durable.

### Error States

| Condition                  | Result                                       |
| -------------------------- | -------------------------------------------- |
| Missing baseline family    | Reject with `GENEALOGY_FAMILY_REQUIRED`      |
| Identity/family mismatch   | Reject with `IDENTITY_FAMILY_MISMATCH`       |
| Invalid visual DNA enum    | Reject with `VISUAL_DNA_INVALID`             |
| Missing human confirmation | Reject with `DECISION_CONFIRMATION_REQUIRED` |

---

## EvaluateProofGate

**Type:** Operation (calculation + mutation)
**Actor:** System
**Triggers:** Generation-rule promotion or explicitly proof-governed future paths

### Input

| Field       | Type                                           | Required | Description                                               |
| ----------- | ---------------------------------------------- | -------- | --------------------------------------------------------- |
| sessionId   | string                                         | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| cycleId     | string                                         | yes      | Target [EvolutionCycle](domain.md#evolutioncycle).cycleId |
| targetRef   | [TypedReference](domain.md#typedreference)     | yes      | Promotion rule or explicitly proof-governed target        |
| obligations | [ProofObligation](domain.md#proofobligation)[] | yes      | Evidence obligations to evaluate                          |
| evaluatedBy | string                                         | yes      | Evaluating actor                                          |

### Rules

| ID  | Rule                                   | Formal                                                    |
| --- | -------------------------------------- | --------------------------------------------------------- |
| R1  | Proof obligations must be non-empty    | `count(obligations) > 0`                                  |
| R2  | Any blocker blocks target promotion    | `exists obligation.status='block' -> proofStatus='block'` |
| R3  | Any flag without blockers returns flag | `no(block) and exists(flag) -> proofStatus='flag'`        |
| R4  | All pass returns pass                  | `forall obligations.status='pass' -> proofStatus='pass'`  |
| R5  | Missing evidence is treated as blocker | `missing(evidenceRef) -> obligation.status='block'`       |

### Calculations

| ID  | Calculation  | Formula                                                  |
| --- | ------------ | -------------------------------------------------------- |
| C1  | Proof status | `block if any block; flag if any flag; pass if all pass` |

### State Transition

[EvolutionCycle](domain.md#evolutioncycle): `MutationProposed -> ProofEvaluated`

### Postconditions

- [EvolutionCycle](domain.md#evolutioncycle).proofStatus is updated.
- Self-improvement promotion remains blocked unless proof status is `pass`.
- Normal MVP apply remains governed by [GovernanceGatePolicy](workflows.md#governancegatepolicy), not by this proof gate.

### Error States

| Condition         | Result                                        |
| ----------------- | --------------------------------------------- |
| Empty obligations | Reject with `PROOF_OBLIGATIONS_EMPTY`         |
| Missing evidence  | Reject or block with `PROOF_EVIDENCE_MISSING` |

---

## PromoteEvolutionRule

**Type:** Operation (mutation)
**Actor:** User or Governance System
**Triggers:** Approved self-improvement request for generation heuristic, prompt template, critique rubric, or mutation strategy

### Input

| Field           | Type                                       | Required | Description                                               |
| --------------- | ------------------------------------------ | -------- | --------------------------------------------------------- |
| sessionId       | string                                     | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| cycleId         | string                                     | yes      | Source [EvolutionCycle](domain.md#evolutioncycle).cycleId |
| ruleRef         | [TypedReference](domain.md#typedreference) | yes      | Generation rule, heuristic, template, or rubric reference |
| proofGateStatus | [ProofStatus](domain.md#proofstatus)       | yes      | Result from [EvaluateProofGate](#evaluateproofgate)       |
| promotedBy      | string                                     | yes      | Human/governance actor                                    |

### Rules

| ID  | Rule                                                   | Formal                                                         |
| --- | ------------------------------------------------------ | -------------------------------------------------------------- |
| R1  | Rule promotion is deferred beyond MVP runtime          | `runtimeMvp -> reject`                                         |
| R2  | Proof gate must pass before any durable promotion      | `proofGateStatus='pass'`                                       |
| R3  | Promotion actor must not be autonomous generation loop | `promotedBy != 'system:auto'`                                  |
| R4  | Rule lineage must cite revision and fitness evidence   | `has(revisionManifestRef, fitnessSignalIds, proofObligations)` |

### State Transition

[EvolutionCycle](domain.md#evolutioncycle): `ProofEvaluated -> RulePromotionDeferred | RulePromoted`

### Postconditions

- In MVP/L1/L2, no generation rule is promoted at runtime; a [RulePromotionRequest](domain.md#rulepromotionrequest) is recorded as deferred or rejected.
- In later phases, a rule may be promoted only when proof status is `pass` and governance approval is present.

### Error States

| Condition                     | Result                                          |
| ----------------------------- | ----------------------------------------------- |
| MVP runtime promotion attempt | Reject with `EVOLUTION_RULE_PROMOTION_DEFERRED` |
| Proof not passed              | Reject with `PROOF_GATE_NOT_PASSED`             |
| Autonomous promotion attempt  | Reject with `AUTO_PROMOTION_FORBIDDEN`          |

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
