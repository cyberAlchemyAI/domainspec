# Domain: UI Prototyping Studio

## Capability Backlinks

- [Component Reuse Registry](SPEC.md#component-reuse-registry)
- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Newspaper Adapter Compatibility](SPEC.md#newspaper-adapter-compatibility)
- [Genetic Evolution Engine](SPEC.md#genetic-evolution-engine)
- [Godel Proof and Self-Improvement Gate](SPEC.md#godel-proof-and-self-improvement-gate)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## Entities

### StudioSession

Represents one deterministic prototyping session from prompt capture through revision evidence publication.

| Field                   | Type                                                | Required | Description                                                                |
| ----------------------- | --------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| sessionId               | string                                              | yes      | Stable session identifier                                                  |
| prompt                  | string                                              | no       | User prompt text, present after [SubmitPrompt](operations.md#submitprompt) |
| variantCount            | [VariantCount](#variantcount)                       | yes      | Bounded variant selector (`1..3`)                                          |
| variantLabels           | string[]                                            | yes      | Generated labels (`A`, `B`, `C`) consistent with `variantCount`            |
| baseline                | [BaselineProvenance](#baselineprovenance)           | no       | Active baseline mode and label                                             |
| baselineGenealogyFamily | [BaselineGenealogyFamily](#baselinegenealogyfamily) | no       | Family record created when baseline is selected or committed               |
| revisionHeadId          | string                                              | no       | Latest applied revision ID                                                 |
| selectionGate           | [GateState](#gatestate)                             | yes      | Baseline gate status                                                       |
| applyGate               | [GateState](#gatestate)                             | yes      | Apply gate status                                                          |
| integration             | [IntegrationReadiness](#integrationreadiness)       | yes      | Downstream handoff readiness flags                                         |
| state                   | [StudioSessionState](states.md#studiosessionstate)  | yes      | Session lifecycle state                                                    |

**Lifecycle:** See [StudioSessionState](states.md#studiosessionstate)
**Operations:** [InitializeSession](operations.md#initializesession), [SubmitPrompt](operations.md#submitprompt), [GenerateVariants](operations.md#generatevariants), [SelectOrCommitBaseline](operations.md#selectorcommitbaseline), [ApplyApprovedBatch](operations.md#applyapprovedbatch)

---

### PrototypeVariant

Represents one generated candidate in a session generation cycle.

| Field           | Type     | Required | Description                                             |
| --------------- | -------- | -------- | ------------------------------------------------------- |
| sessionId       | string   | yes      | Owning [StudioSession](#studiosession).sessionId        |
| variantLabel    | string   | yes      | Candidate label (`A`, `B`, `C`)                         |
| htmlArtifactRef | string   | yes      | HTML-first artifact pointer                             |
| componentsUsed  | string[] | yes      | Design-system component references used in this variant |
| rationale       | string   | yes      | Why this candidate was generated                        |
| tradeoffs       | string   | yes      | Candidate tradeoff summary                              |
| risk            | string   | yes      | Candidate risk summary                                  |
| status          | string   | yes      | Candidate status (`candidate`, `selected`, `committed`) |

**Operations:** [GenerateVariants](operations.md#generatevariants), [SelectOrCommitBaseline](operations.md#selectorcommitbaseline)

---

### CommentEvent

Represents one canonical annotation record linked to an active baseline revision.

| Field      | Type                                  | Required | Description                                      |
| ---------- | ------------------------------------- | -------- | ------------------------------------------------ |
| commentId  | string                                | yes      | Stable comment identifier                        |
| sessionId  | string                                | yes      | Owning [StudioSession](#studiosession).sessionId |
| revisionId | string                                | yes      | Active revision receiving annotation             |
| target     | [AnnotationTarget](#annotationtarget) | yes      | Element pointer metadata                         |
| severity   | [CommentSeverity](#commentseverity)   | yes      | Priority level                                   |
| intent     | string                                | yes      | Design intent category                           |
| note       | string                                | yes      | Freeform comment text                            |
| createdBy  | string                                | yes      | Human actor identifier                           |
| createdAt  | string (ISO-8601)                     | yes      | Creation timestamp                               |

**Operations:** [CaptureCommentEvent](operations.md#capturecommentevent), [SynthesizeMutationBatch](operations.md#synthesizemutationbatch)

---

### MutationBatch

Represents deterministic task synthesis output for one revision head.

| Field                   | Type                                        | Required | Description                                      |
| ----------------------- | ------------------------------------------- | -------- | ------------------------------------------------ |
| batchId                 | string                                      | yes      | Stable batch identifier                          |
| sessionId               | string                                      | yes      | Owning [StudioSession](#studiosession).sessionId |
| sourceRevisionId        | string                                      | yes      | Revision head used for synthesis                 |
| status                  | [MutationBatchStatus](#mutationbatchstatus) | yes      | Draft/approval/apply lifecycle                   |
| generatedFromCommentIds | string[]                                    | yes      | Ordered source comment IDs                       |
| tasks                   | [MutationTask](#mutationtask)[]             | yes      | Deterministic mutation task set                  |
| approval                | [BatchApproval](#batchapproval)             | yes      | Human approval metadata                          |
| checksum                | string                                      | yes      | Deterministic synthesis checksum                 |

**Operations:** [SynthesizeMutationBatch](operations.md#synthesizemutationbatch), [ApproveMutationBatch](operations.md#approvemutationbatch), [ApplyApprovedBatch](operations.md#applyapprovedbatch)

---

### RevisionManifestEntry

Represents one append-only revision evidence record emitted after apply.

| Field                | Type                                      | Required | Description                                      |
| -------------------- | ----------------------------------------- | -------- | ------------------------------------------------ |
| revisionId           | string                                    | yes      | New revision identifier                          |
| parentRevisionId     | string                                    | yes      | Previous revision identifier                     |
| sessionId            | string                                    | yes      | Owning [StudioSession](#studiosession).sessionId |
| variantCount         | [VariantCount](#variantcount)             | yes      | Session variant bound at apply time              |
| baseline             | [BaselineProvenance](#baselineprovenance) | yes      | Selected or committed baseline provenance        |
| appliedBatchId       | string                                    | yes      | Approved batch ID                                |
| appliedTaskIds       | string[]                                  | yes      | Applied task IDs                                 |
| unresolvedCommentIds | string[]                                  | yes      | Remaining unresolved comments                    |
| diffSummary          | [DiffSummary](#diffsummary)               | yes      | Added/changed/removed summary                    |
| createdAt            | string (ISO-8601)                         | yes      | Manifest append timestamp                        |

**Operations:** [ApplyApprovedBatch](operations.md#applyapprovedbatch), [ExportDesignHandoff](operations.md#exportdesignhandoff)

---

### EvolutionCycle

Represents one genetic algorithm cycle inside a studio session: population generation, fitness capture, lineage selection, mutation proposal, proof gating, and revision evidence.

| Field                   | Type                                                 | Required | Description                                                                                 |
| ----------------------- | ---------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| cycleId                 | string                                               | yes      | Stable cycle identifier                                                                     |
| sessionId               | string                                               | yes      | Owning [StudioSession](#studiosession).sessionId                                            |
| generationIndex         | integer                                              | yes      | Monotonic generation number within the session                                              |
| genome                  | [PrototypeGenome](#prototypegenome)                  | yes      | Encoded prompt, constraints, comments, and mutation inputs                                  |
| populationVariantLabels | string[]                                             | yes      | Candidate labels participating in this cycle                                                |
| fitnessSignalIds        | string[]                                             | yes      | [FitnessSignal](#fitnesssignal) identifiers for this cycle                                  |
| selectedBaseline        | [BaselineProvenance](#baselineprovenance)            | no       | Winning lineage selected or committed for mutation                                          |
| genealogyFamilyId       | string                                               | no       | [BaselineGenealogyFamily](#baselinegenealogyfamily).familyId created at baseline resolution |
| mutationBatchId         | string                                               | no       | [MutationBatch](#mutationbatch) proposed for this cycle                                     |
| proofStatus             | [ProofStatus](#proofstatus)                          | yes      | Current proof-gate result                                                                   |
| state                   | [EvolutionCycleState](states.md#evolutioncyclestate) | yes      | Genetic/evidence-gated lifecycle state                                                      |

**Lifecycle:** See [EvolutionCycleState](states.md#evolutioncyclestate)
**Operations:** [GenerateVariants](operations.md#generatevariants), [RecordFitnessSignal](operations.md#recordfitnesssignal), [SynthesizeMutationBatch](operations.md#synthesizemutationbatch), [EvaluateProofGate](operations.md#evaluateproofgate), [PromoteEvolutionRule](operations.md#promoteevolutionrule)

---

### BaselineGenealogyFamily

Represents the first durable family record for a generated population once one baseline survives selection or single-variant commit.

| Field                   | Type                                      | Required | Description                                                     |
| ----------------------- | ----------------------------------------- | -------- | --------------------------------------------------------------- |
| familyId                | string                                    | yes      | Stable family identifier for the selected lineage               |
| sessionId               | string                                    | yes      | Owning [StudioSession](#studiosession).sessionId                |
| cycleId                 | string                                    | no       | Owning [EvolutionCycle](#evolutioncycle).cycleId when available |
| generationIndex         | integer                                   | yes      | Generation number that produced the selected baseline           |
| populationVariantLabels | string[]                                  | yes      | Full generated population considered at selection time          |
| selectedBaseline        | [BaselineProvenance](#baselineprovenance) | yes      | Selected or committed survivor                                  |
| parentRevisionId        | string                                    | no       | Revision head before baseline family creation                   |
| baselineRevisionId      | string                                    | yes      | Revision anchor for comments and future mutations               |
| sourceFitnessSignalIds  | string[]                                  | yes      | Selection signals known at family creation; may be empty in MVP |
| selectedBy              | string                                    | yes      | Actor that selected or committed the baseline                   |
| selectedAt              | string (ISO-8601)                         | yes      | Family creation timestamp                                       |

**Operations:** [SelectOrCommitBaseline](operations.md#selectorcommitbaseline), [RecordFitnessSignal](operations.md#recordfitnesssignal), [ApplyApprovedBatch](operations.md#applyapprovedbatch)

**Notes:** The family is created before mutation so later comments, batches, proof obligations, and revision manifests attach to a known lineage instead of an anonymous baseline.

---

### FitnessSignal

Represents one selection-pressure event applied to a variant, baseline, mutation batch, or revision.

| Field      | Type                                        | Required | Description                                         |
| ---------- | ------------------------------------------- | -------- | --------------------------------------------------- |
| signalId   | string                                      | yes      | Stable signal identifier                            |
| sessionId  | string                                      | yes      | Owning [StudioSession](#studiosession).sessionId    |
| cycleId    | string                                      | yes      | Owning [EvolutionCycle](#evolutioncycle).cycleId    |
| source     | [FitnessSignalSource](#fitnesssignalsource) | yes      | Origin of the fitness pressure                      |
| targetRef  | string                                      | yes      | Variant label, comment ID, batch ID, or revision ID |
| vector     | [FitnessVector](#fitnessvector)             | yes      | Normalized direction and confidence of the signal   |
| rationale  | string                                      | yes      | Human-readable reason for the signal                |
| capturedBy | string                                      | yes      | Human/system actor that captured the signal         |
| capturedAt | string (ISO-8601)                           | yes      | Signal timestamp                                    |

**Operations:** [RecordFitnessSignal](operations.md#recordfitnesssignal), [EvaluateProofGate](operations.md#evaluateproofgate)

---

## Value Objects

### VariantCount

| Field        | Type    | Constraint           |
| ------------ | ------- | -------------------- |
| value        | integer | Must be in `{1,2,3}` |
| defaultValue | integer | Must be `3`          |

**Equality:** by `value`.

---

### AnnotationTarget

| Field        | Type   | Constraint                             |
| ------------ | ------ | -------------------------------------- |
| selector     | string | Non-empty CSS selector or stable token |
| elementLabel | string | Non-empty label for human review       |
| odId         | string | Optional stable `data-od-id` reference |

**Equality:** by `(selector, odId)` when `odId` exists; otherwise by `selector`.

---

### MutationTask

| Field          | Type   | Constraint                                                     |
| -------------- | ------ | -------------------------------------------------------------- |
| taskId         | string | Deterministic for identical ordered comments                   |
| target         | string | Must resolve to [AnnotationTarget](#annotationtarget).selector |
| intent         | string | Non-empty intent label                                         |
| changeType     | string | Non-empty change category                                      |
| acceptanceText | string | Non-empty acceptance sentence                                  |
| priority       | string | Non-empty priority token                                       |

**Equality:** by `(taskId, target)`.

---

### BatchApproval

| Field      | Type              | Constraint                                            |
| ---------- | ----------------- | ----------------------------------------------------- |
| required   | boolean           | Must be `true` in MVP                                 |
| approvedBy | string            | Required when batch status is `approved` or `applied` |
| approvedAt | string (ISO-8601) | Required when batch status is `approved` or `applied` |

**Equality:** by `(required, approvedBy, approvedAt)`.

---

### BaselineProvenance

| Field | Type                          | Constraint                          |
| ----- | ----------------------------- | ----------------------------------- |
| mode  | [BaselineMode](#baselinemode) | Must be `selected` or `committed`   |
| label | string                        | Non-empty label for active baseline |

**Equality:** by `(mode, label)`.

---

### DiffSummary

| Field   | Type    | Constraint |
| ------- | ------- | ---------- |
| added   | integer | `>= 0`     |
| changed | integer | `>= 0`     |
| removed | integer | `>= 0`     |

**Equality:** by `(added, changed, removed)`.

---

### PrototypeGenome

| Field                | Type     | Constraint                                                                |
| -------------------- | -------- | ------------------------------------------------------------------------- |
| promptHash           | string   | Hash of trimmed prompt text                                               |
| componentConstraints | string[] | Design-system component or token constraints                              |
| environmentRefs      | string[] | DomainSpec requirement, UI-SPEC, TEST-SPEC, architecture, and policy refs |
| commentIds           | string[] | Ordered comment IDs that shape mutation                                   |
| mutationTaskIds      | string[] | Ordered task IDs proposed for the next generation                         |

**Equality:** by `(promptHash, componentConstraints, environmentRefs, commentIds, mutationTaskIds)`.

---

### FitnessVector

| Field      | Type    | Constraint                                                              |
| ---------- | ------- | ----------------------------------------------------------------------- |
| preference | integer | `-1`, `0`, or `1` for reject/neutral/prefer                             |
| severity   | string  | Optional severity bucket aligned to [CommentSeverity](#commentseverity) |
| confidence | number  | `0.0..1.0` normalized confidence                                        |
| dimension  | string  | Non-empty dimension, e.g. usability, risk, fit, evidence                |

**Equality:** by `(preference, severity, confidence, dimension)`.

---

### ProofObligation

| Field        | Type                        | Constraint                                      |
| ------------ | --------------------------- | ----------------------------------------------- |
| obligationId | string                      | Stable proof obligation identifier              |
| targetRef    | string                      | Mutation batch, revision, or rule being checked |
| evidenceRef  | string                      | Link to manifest, test, checksum, gate, or doc  |
| status       | [ProofStatus](#proofstatus) | Must be `pending`, `pass`, `flag`, or `block`   |
| rationale    | string                      | Non-empty explanation                           |

**Equality:** by `(obligationId, targetRef, evidenceRef)`.

---

### IntegrationReadiness

| Field                | Type    | Constraint                                                                                      |
| -------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| uiPhaseBridgeReady   | boolean | `true` only after [ExportDesignHandoff](operations.md#exportdesignhandoff) requirements are met |
| generateTestsUiReady | boolean | `true` only after [TEST-SPEC.md](TEST-SPEC.md) linkage is present                               |
| uiImplementReady     | boolean | `true` only after [UI-SPEC.md](UI-SPEC.md) linkage is present                                   |

**Equality:** by all boolean fields.

---

## Enums

### CommentSeverity

| Value   | Description                   |
| ------- | ----------------------------- |
| blocker | Blocks merge/apply acceptance |
| high    | High-priority issue           |
| medium  | Medium-priority issue         |
| low     | Low-priority issue            |

### MutationBatchStatus

| Value    | Description                             |
| -------- | --------------------------------------- |
| draft    | Synthesized, awaiting approval          |
| approved | Explicitly approved by human actor      |
| applied  | Successfully applied to active baseline |
| rejected | Explicitly rejected or invalidated      |

### BaselineMode

| Value     | Description                                   |
| --------- | --------------------------------------------- |
| selected  | Explicit human choice among multiple variants |
| committed | Automatic baseline when `variantCount = 1`    |

### GateState

| Value     | Description                      |
| --------- | -------------------------------- |
| pending   | Gate not yet satisfied           |
| satisfied | Gate conditions met              |
| blocked   | Gate rejected due rule violation |

### FitnessSignalSource

| Value      | Description                                     |
| ---------- | ----------------------------------------------- |
| human      | Explicit human selection, comment, or approval  |
| test       | Automated test, acceptance check, or e2e result |
| risk       | Risk/tradeoff metadata from a generated variant |
| telemetry  | Runtime or usage observation                    |
| governance | Gate, policy, or architecture/layering evidence |

### ProofStatus

| Value   | Description                                  |
| ------- | -------------------------------------------- |
| pending | Proof obligation has not been evaluated      |
| pass    | Evidence satisfies the obligation            |
| flag    | Evidence is usable but has a non-blocker gap |
| block   | Evidence is missing or violates an invariant |
