# Domain: UI Prototyping Studio

## Capability Backlinks

- [Component Reuse Registry](SPEC.md#component-reuse-registry)
- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Newspaper Adapter Compatibility](SPEC.md#newspaper-adapter-compatibility)
- [Evolution Engine](SPEC.md#evolution-engine)
- [Proof and Self-Improvement Gate](SPEC.md#proof-and-self-improvement-gate)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## Entities

### StudioSession

Represents one deterministic prototyping session from prompt capture through revision evidence publication.

| Field                   | Type                                                | Required | Description                                                                |
| ----------------------- | --------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| sessionId               | string                                              | yes      | Stable session identifier                                                  |
| prompt                  | string                                              | no       | User prompt text, present after [SubmitPrompt](operations.md#submitprompt) |
| variantCount            | [VariantCount](#variantcount)                       | yes      | Bounded variant selector (`1..3`)                                          |
| generationMode          | [GenerationMode](#generationmode)                   | yes      | MVP generation surface: `explore` or `exploit`                             |
| variantLabels           | string[]                                            | yes      | Generated labels (`A`, `B`, `C`) consistent with `variantCount`            |
| baseline                | [BaselineProvenance](#baselineprovenance)           | no       | Active baseline mode and label                                             |
| baselineRevisionAnchor  | [BaselineRevisionAnchor](#baselinerevisionanchor)   | no       | Explicit baseline revision anchor created when baseline resolves           |
| baselineGenealogyFamily | [BaselineGenealogyFamily](#baselinegenealogyfamily) | no       | Durable family record for the selected baseline lineage                    |
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

| Field                      | Type                                | Required | Description                                                                                  |
| -------------------------- | ----------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| sessionId                  | string                              | yes      | Owning [StudioSession](#studiosession).sessionId                                             |
| variantLabel               | string                              | yes      | Candidate label (`A`, `B`, `C`)                                                              |
| generationMode             | [GenerationMode](#generationmode)   | yes      | Whether this candidate came from Explore or Exploit generation                               |
| htmlArtifactRef            | [TypedReference](#typedreference)   | yes      | HTML-first artifact pointer                                                                  |
| componentsUsed             | [TypedReference](#typedreference)[] | yes      | Design-system component references used in this variant                                      |
| proposedIdentityIds        | string[]                            | no       | Suggested [UIElementIdentity](#uielementidentity) IDs for reviewer confirmation              |
| proposedVisualSignatureIds | string[]                            | no       | Suggested [UIVisualSignature](#uivisualsignature) IDs discovered from the rendered candidate |
| rationale                  | string                              | yes      | Why this candidate was generated                                                             |
| tradeoffs                  | string                              | yes      | Candidate tradeoff summary                                                                   |
| risk                       | string                              | yes      | Candidate risk summary                                                                       |
| status                     | string                              | yes      | Candidate status (`candidate`, `selected`, `committed`)                                      |

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
| baselineRevisionId   | string                                    | yes      | Baseline anchor used by the applied mutation     |
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

Represents one Evolution Engine cycle inside a studio session: population generation, fitness evidence capture, lineage selection, mutation proposal, proof-promotion gating, and revision evidence.

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

**Layer:** MVP durable baseline family for Explore/Exploit identity and visual DNA; L1 hardens additional read models around it.

| Field                   | Type                                      | Required | Description                                                                     |
| ----------------------- | ----------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| familyId                | string                                    | yes      | Stable family identifier for the selected lineage                               |
| sessionId               | string                                    | yes      | Owning [StudioSession](#studiosession).sessionId                                |
| cycleId                 | string                                    | no       | Owning [EvolutionCycle](#evolutioncycle).cycleId when available                 |
| generationIndex         | integer                                   | yes      | Generation number that produced the selected baseline                           |
| populationVariantLabels | string[]                                  | yes      | Full generated population considered at selection time                          |
| selectedBaseline        | [BaselineProvenance](#baselineprovenance) | yes      | Selected or committed survivor                                                  |
| parentRevisionId        | string                                    | no       | Revision head before baseline family creation                                   |
| baselineRevisionId      | string                                    | yes      | Revision anchor for comments and future mutations                               |
| sourceFitnessSignalRefs | [TypedReference](#typedreference)[]       | yes      | Selection signals known at family creation; may be empty in MVP                 |
| confirmedIdentityIds    | string[]                                  | yes      | [UIElementIdentity](#uielementidentity) IDs confirmed for the selected baseline |
| decisionRecordIds       | string[]                                  | yes      | [UIDecisionRecord](#uidecisionrecord) IDs that explain durable baseline choices |
| visualSignatureIds      | string[]                                  | yes      | [UIVisualSignature](#uivisualsignature) IDs treated as baseline visual DNA      |
| selectedBy              | string                                    | yes      | Actor that selected or committed the baseline                                   |
| selectedAt              | string (ISO-8601)                         | yes      | Family creation timestamp                                                       |

**Operations:** [SelectOrCommitBaseline](operations.md#selectorcommitbaseline), [RecordFitnessSignal](operations.md#recordfitnesssignal), [ApplyApprovedBatch](operations.md#applyapprovedbatch)

**Notes:** The family is created before mutation so later comments, batches, proof obligations, and revision manifests attach to a known lineage instead of an anonymous baseline.

---

### FitnessSignal

Represents one selection-pressure event applied to a variant, baseline, mutation batch, or revision.

| Field      | Type                                        | Required | Description                                                                          |
| ---------- | ------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| signalId   | string                                      | yes      | Stable signal identifier                                                             |
| sessionId  | string                                      | yes      | Owning [StudioSession](#studiosession).sessionId                                     |
| cycleId    | string                                      | yes      | Owning [EvolutionCycle](#evolutioncycle).cycleId                                     |
| source     | [FitnessSignalSource](#fitnesssignalsource) | yes      | Origin of the fitness pressure                                                       |
| targetRef  | [TypedReference](#typedreference)           | yes      | Variant, comment, batch, revision, UI identity, visual signature, or decision record |
| vector     | [FitnessVector](#fitnessvector)             | yes      | Normalized direction and confidence of the signal                                    |
| rationale  | string                                      | yes      | Human-readable reason for the signal                                                 |
| capturedBy | string                                      | yes      | Human/system actor that captured the signal                                          |
| capturedAt | string (ISO-8601)                           | yes      | Signal timestamp                                                                     |

**Operations:** [RecordFitnessSignal](operations.md#recordfitnesssignal), [EvaluateProofGate](operations.md#evaluateproofgate)

---

### UIElementIdentity

Represents the durable conceptual identity of a UI element across Explore and Exploit generations.

**Layer:** MVP contract surface for confirmed baseline/exploit evidence; generated suggestions are not durable until human confirmation.

| Field             | Type                              | Required | Description                                                         |
| ----------------- | --------------------------------- | -------- | ------------------------------------------------------------------- |
| identityId        | string                            | yes      | Stable conceptual identity identifier                               |
| sessionId         | string                            | yes      | Owning [StudioSession](#studiosession).sessionId                    |
| genealogyFamilyId | string                            | yes      | Owning [BaselineGenealogyFamily](#baselinegenealogyfamily).familyId |
| semanticName      | string                            | yes      | Human-readable identity, e.g. `Primary onboarding CTA`              |
| elementPurpose    | string                            | yes      | Job performed by the element, e.g. submit, navigate, summarize      |
| domainConceptRef  | [TypedReference](#typedreference) | no       | Optional DomainSpec story, requirement, or concept reference        |
| canonicalRole     | string                            | yes      | Controlled role from [ElementRole](#elementrole)                    |
| contentSubject    | string                            | yes      | Subject matter the element represents                               |
| interactionIntent | string                            | yes      | Intent such as continue, confirm, cancel, inspect, or compare       |
| decisionRecordIds | string[]                          | yes      | Confirmed [UIDecisionRecord](#uidecisionrecord) IDs                 |
| createdFrom       | string                            | yes      | Variant label or revision ID where identity became durable          |
| createdBy         | string                            | yes      | Human actor confirming the identity                                 |
| createdAt         | string (ISO-8601)                 | yes      | Confirmation timestamp                                              |

**Operations:** [ConfirmUIDecisionEvidence](operations.md#confirmuidecisionevidence)

---

### UIElementInstance

Represents one rendered occurrence of a [UIElementIdentity](#uielementidentity) in a variant or revision.

| Field              | Type                                              | Required | Description                                                  |
| ------------------ | ------------------------------------------------- | -------- | ------------------------------------------------------------ |
| instanceId         | string                                            | yes      | Stable rendered-instance identifier                          |
| identityId         | string                                            | yes      | Owning [UIElementIdentity](#uielementidentity).identityId    |
| variantLabel       | string                                            | no       | Variant label for generated candidate instances              |
| revisionId         | string                                            | no       | Revision ID for applied or exploit instances                 |
| target             | [AnnotationTarget](#annotationtarget)             | yes      | Selector, label, and optional `data-od-id` locator           |
| componentRef       | [TypedReference](#typedreference)                 | no       | Design-system or generated component reference               |
| visualSignatureId  | string                                            | yes      | Attached [UIVisualSignature](#uivisualsignature).signatureId |
| textSignature      | string                                            | no       | Normalized copy hash or label signature                      |
| positionSignature  | string                                            | no       | Region/order hint such as `header.primary-action.1`          |
| relationToBaseline | [UIIdentityRelationType](#uiidentityrelationtype) | yes      | How this instance relates to baseline identity               |
| confirmed          | boolean                                           | yes      | `true` only after human confirmation                         |

**Operations:** [ConfirmUIDecisionEvidence](operations.md#confirmuidecisionevidence)

---

### UIDecisionRecord

Represents a human-confirmed reason a UI identity, instance, or visual trait was selected, preserved, changed, or rejected.

| Field             | Type                              | Required | Description                                                         |
| ----------------- | --------------------------------- | -------- | ------------------------------------------------------------------- |
| decisionRecordId  | string                            | yes      | Stable decision identifier                                          |
| sessionId         | string                            | yes      | Owning [StudioSession](#studiosession).sessionId                    |
| genealogyFamilyId | string                            | yes      | Owning [BaselineGenealogyFamily](#baselinegenealogyfamily).familyId |
| decisionType      | [UIDecisionType](#uidecisiontype) | yes      | Selected, preserved, changed, rejected, constrained, or approved    |
| targetRef         | [TypedReference](#typedreference) | yes      | Identity, instance, visual signature, variant, or revision ref      |
| rationale         | string                            | yes      | Human-readable reason for the decision                              |
| sourceSignalIds   | string[]                          | yes      | Related [FitnessSignal](#fitnesssignal) identifiers                 |
| sourceCommentIds  | string[]                          | yes      | Related [CommentEvent](#commentevent) identifiers                   |
| decidedBy         | string                            | yes      | Human actor confirming the decision                                 |
| decidedAt         | string (ISO-8601)                 | yes      | Confirmation timestamp                                              |

**Operations:** [ConfirmUIDecisionEvidence](operations.md#confirmuidecisionevidence), [RecordFitnessSignal](operations.md#recordfitnesssignal)

---

### RulePromotionRequest

Represents a deferred or governed request to improve generation rules, prompt templates, critique rubrics, or mutation strategies.

| Field           | Type                                        | Required | Description                                                     |
| --------------- | ------------------------------------------- | -------- | --------------------------------------------------------------- |
| requestId       | string                                      | yes      | Stable promotion request identifier                             |
| sessionId       | string                                      | yes      | Owning [StudioSession](#studiosession).sessionId                |
| cycleId         | string                                      | no       | Source [EvolutionCycle](#evolutioncycle).cycleId when available |
| ruleRef         | [TypedReference](#typedreference)           | yes      | Generation rule, heuristic, template, or rubric reference       |
| status          | [RulePromotionStatus](#rulepromotionstatus) | yes      | Deferred, rejected, or promoted outcome                         |
| proofGateStatus | [ProofStatus](#proofstatus)                 | yes      | Proof result used for the promotion decision                    |
| evidenceRefs    | [TypedReference](#typedreference)[]         | yes      | Revision, fitness, proof, and rollback evidence                 |
| requestedBy     | string                                      | yes      | Human/governance actor requesting promotion                     |
| requestedAt     | string (ISO-8601)                           | yes      | Request timestamp                                               |

**Operations:** [PromoteEvolutionRule](operations.md#promoteevolutionrule)

---

## Value Objects

### VariantCount

| Field        | Type    | Constraint           |
| ------------ | ------- | -------------------- |
| value        | integer | Must be in `{1,2,3}` |
| defaultValue | integer | Must be `3`          |

**Equality:** by `value`.

---

### GenerationMode

| Field | Type   | Constraint                     |
| ----- | ------ | ------------------------------ |
| value | string | Must be `explore` or `exploit` |

**Meaning:** `explore` creates new candidate directions; `exploit` creates candidates constrained by the selected baseline plus confirmed identity and visual DNA.

---

### TypedReference

Wire-level reference object used anywhere a contract points to another domain object, artifact, component, proof item, or document evidence.

| Field      | Type   | Constraint                                                                                                                   |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| refType    | string | Controlled by the producing contract, e.g. `variant`, `revision`, `artifact`, `identity`, `visual-signature`, `proof`, `doc` |
| refId      | string | Stable identifier within the referenced type                                                                                 |
| sessionId  | string | Required for session-scoped references                                                                                       |
| cycleId    | string | Optional evolution cycle scope                                                                                               |
| revisionId | string | Optional revision scope                                                                                                      |
| familyId   | string | Optional genealogy family scope                                                                                              |

**Equality:** by `(refType, refId, sessionId, cycleId, revisionId, familyId)`.

---

### BaselineRevisionAnchor

Explicit revision anchor created when baseline resolution succeeds. It replaces ad hoc fallback revisions and is the source for comments, mutation batches, genealogy, and staleness checks.

| Field              | Type                              | Constraint                                                   |
| ------------------ | --------------------------------- | ------------------------------------------------------------ |
| baselineRevisionId | string                            | Stable anchor ID created at baseline resolution              |
| sourceVariantRef   | [TypedReference](#typedreference) | Selected or committed variant artifact                       |
| mode               | [BaselineMode](#baselinemode)     | Must match [BaselineProvenance](#baselineprovenance).mode    |
| createdBy          | string                            | Human actor for selection or system for single-option commit |
| createdAt          | string (ISO-8601)                 | Anchor creation timestamp                                    |

**Equality:** by `baselineRevisionId`.

---

### AnnotationTarget

| Field        | Type   | Constraint                             |
| ------------ | ------ | -------------------------------------- |
| selector     | string | Non-empty CSS selector or stable token |
| elementLabel | string | Non-empty label for human review       |
| odId         | string | Optional stable `data-od-id` reference |

**Equality:** by `(selector, odId)` when `odId` exists; otherwise by `selector`.

---

### UIVisualSignature

Represents the visual DNA attached to a [UIElementInstance](#uielementinstance). It is evidence and constraint metadata, not a styling engine.

| Field              | Type                                      | Constraint                                                                      |
| ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------- |
| signatureId        | string                                    | Stable visual signature identifier                                              |
| colorRole          | [ColorRole](#colorrole)                   | Controlled color role; raw colors are not required                              |
| surfaceTone        | [SurfaceTone](#surfacetone)               | Controlled surface role                                                         |
| contrastIntent     | [ContrastIntent](#contrastintent)         | Controlled emphasis intent                                                      |
| accentUsage        | [AccentUsage](#accentusage)               | Controlled accent purpose                                                       |
| tokenRefs          | string[]                                  | Design token names when known; should avoid raw color values                    |
| visualShape        | [VisualShape](#visualshape)               | Controlled rendered shape                                                       |
| cornerProfile      | [CornerProfile](#cornerprofile)           | Controlled corner/radius profile                                                |
| borderTreatment    | [BorderTreatment](#bordertreatment)       | Controlled border style                                                         |
| elevation          | [Elevation](#elevation)                   | Controlled elevation behavior                                                   |
| aspectPattern      | [AspectPattern](#aspectpattern)           | Controlled aspect behavior                                                      |
| typeRole           | [TypeRole](#typerole)                     | Controlled typography role                                                      |
| typeWeight         | [TypeWeight](#typeweight)                 | Controlled typography weight                                                    |
| typeScale          | [TypeScale](#typescale)                   | Controlled typography scale                                                     |
| textTransform      | [TextTransform](#texttransform)           | Controlled text transform                                                       |
| numericStyle       | [NumericStyle](#numericstyle)             | Controlled numeric presentation                                                 |
| layoutRole         | [LayoutRole](#layoutrole)                 | Controlled layout region                                                        |
| density            | [Density](#density)                       | Controlled density category                                                     |
| alignment          | [Alignment](#alignment)                   | Controlled alignment category                                                   |
| spacingPattern     | [SpacingPattern](#spacingpattern)         | Controlled rhythm category                                                      |
| compositionPattern | [CompositionPattern](#compositionpattern) | Controlled composition category                                                 |
| interactionPattern | [InteractionPattern](#interactionpattern) | Controlled interaction behavior                                                 |
| stateModel         | [StateModel](#statemodel)                 | Controlled visible state support                                                |
| feedbackStyle      | [FeedbackStyle](#feedbackstyle)           | Controlled feedback presentation                                                |
| motionIntent       | [MotionIntent](#motionintent)             | Controlled motion category                                                      |
| elementCategory    | [ElementCategory](#elementcategory)       | Controlled semantic category                                                    |
| elementRole        | [ElementRole](#elementrole)               | Controlled semantic role                                                        |
| hierarchy          | [Hierarchy](#hierarchy)                   | Controlled visual hierarchy                                                     |
| contentSubject     | string                                    | Bounded product/domain subject label; free text allowed only for subject matter |

**Equality:** by all controlled fields plus `tokenRefs` and `contentSubject`.

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

| Field                 | Type                                | Constraint                                                                             |
| --------------------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| promptHash            | string                              | Hash of trimmed prompt text                                                            |
| componentConstraints  | [TypedReference](#typedreference)[] | Design-system component or token constraints                                           |
| identityConstraintIds | string[]                            | Confirmed [UIElementIdentity](#uielementidentity) IDs constraining the next generation |
| visualSignatureIds    | string[]                            | Confirmed [UIVisualSignature](#uivisualsignature) IDs defining baseline visual DNA     |
| environmentRefs       | [TypedReference](#typedreference)[] | DomainSpec requirement, UI-SPEC, TEST-SPEC, architecture, and policy refs              |
| commentIds            | string[]                            | Ordered comment IDs that shape mutation                                                |
| mutationTaskIds       | string[]                            | Ordered task IDs proposed for the next generation                                      |

**Equality:** by `(promptHash, componentConstraints, identityConstraintIds, visualSignatureIds, environmentRefs, commentIds, mutationTaskIds)`.

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

| Field        | Type                              | Constraint                                          |
| ------------ | --------------------------------- | --------------------------------------------------- |
| obligationId | string                            | Stable proof obligation identifier                  |
| targetRef    | [TypedReference](#typedreference) | Promotion rule or proof-governed path being checked |
| evidenceRef  | [TypedReference](#typedreference) | Link to manifest, test, checksum, gate, or doc      |
| status       | [ProofStatus](#proofstatus)       | Must be `pending`, `pass`, `flag`, or `block`       |
| rationale    | string                            | Non-empty explanation                               |

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

| Value     | Description                                           |
| --------- | ----------------------------------------------------- |
| selected  | Explicit human choice among multiple variants         |
| committed | Single-option baseline commit when `variantCount = 1` |

### GenerationModeValue

| Value   | Description                                                                                 |
| ------- | ------------------------------------------------------------------------------------------- |
| explore | Creates new candidate directions before or beyond a selected family                         |
| exploit | Creates candidates constrained by the selected baseline, confirmed identity, and visual DNA |

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

### UIDecisionType

| Value     | Description                                      |
| --------- | ------------------------------------------------ |
| select    | Chosen as a durable baseline or exploit decision |
| reject    | Explicitly not chosen                            |
| preserve  | Must remain recognizably stable across exploit   |
| change    | Intentionally changed from previous generation   |
| constrain | Adds a bounded rule for future exploit work      |
| approve   | Accepted as suitable for apply or handoff        |

### UIIdentityRelationType

| Value        | Description                                       |
| ------------ | ------------------------------------------------- |
| same-concept | Same conceptual element with compatible instance  |
| reshaped     | Same identity with changed visual shape           |
| split-from   | New identity split from an existing one           |
| merged-into  | Identity merged into another identity             |
| replaced-by  | Old identity replaced by a different identity     |
| removed      | Identity intentionally removed from the candidate |
| new          | New identity introduced in this generation        |

### ColorRole

| Value            | Description                   |
| ---------------- | ----------------------------- |
| primary          | Primary system/action color   |
| secondary        | Secondary system/action color |
| accent           | Accent or highlight color     |
| neutral          | Neutral/chrome color          |
| semantic-success | Success semantic color        |
| semantic-warning | Warning semantic color        |
| semantic-error   | Error/destructive color       |

### SurfaceTone

| Value       | Description                |
| ----------- | -------------------------- |
| page        | Page background            |
| panel       | Work or section panel      |
| card        | Repeated item/card         |
| elevated    | Raised surface             |
| inverse     | Inverse/dark-on-light flip |
| transparent | Transparent or inherited   |

### ContrastIntent

| Value      | Description                |
| ---------- | -------------------------- |
| quiet      | Low emphasis               |
| standard   | Normal readable emphasis   |
| emphasized | High emphasis              |
| critical   | Blocking/critical emphasis |

### AccentUsage

| Value     | Description            |
| --------- | ---------------------- |
| none      | No accent use          |
| action    | Action emphasis        |
| selection | Selected/current state |
| status    | Status communication   |
| brand     | Brand identity         |
| highlight | Highlight or callout   |

### VisualShape

| Value          | Description                 |
| -------------- | --------------------------- |
| text-link      | Inline or standalone link   |
| icon-button    | Icon-only button            |
| solid-button   | Filled button               |
| outline-button | Outlined button             |
| input-field    | Input/select/textarea field |
| card           | Card surface                |
| panel          | Panel surface               |
| table-row      | Table/list row              |
| badge          | Badge/pill label            |
| tab            | Tab control                 |
| toolbar        | Toolbar/action rail         |
| canvas-region  | Prototype/canvas region     |

### CornerProfile

| Value    | Description        |
| -------- | ------------------ |
| square   | No visible radius  |
| slight   | Subtle radius      |
| medium   | Medium radius      |
| rounded  | Strong radius      |
| pill     | Fully rounded pill |
| circular | Circle             |

### BorderTreatment

| Value    | Description           |
| -------- | --------------------- |
| none     | No visible border     |
| hairline | Subtle divider        |
| standard | Standard border       |
| strong   | Prominent border      |
| dashed   | Dashed/temporary edge |

### Elevation

| Value   | Description             |
| ------- | ----------------------- |
| flat    | No elevation            |
| raised  | Raised surface          |
| overlay | Overlay/modal layer     |
| sticky  | Sticky/persistent layer |

### AspectPattern

| Value       | Description             |
| ----------- | ----------------------- |
| free        | Content-defined aspect  |
| square      | Square                  |
| wide        | Wide landscape          |
| tall        | Tall portrait           |
| fixed-ratio | Fixed ratio requirement |

### TypeRole

| Value   | Description         |
| ------- | ------------------- |
| display | Display text        |
| heading | Heading text        |
| body    | Body copy           |
| label   | Label/control text  |
| caption | Caption/helper text |
| code    | Code/technical text |
| numeric | Numeric value text  |

### TypeWeight

| Value    | Description |
| -------- | ----------- |
| regular  | Regular     |
| medium   | Medium      |
| semibold | Semibold    |
| bold     | Bold        |

### TypeScale

| Value   | Description    |
| ------- | -------------- |
| xs      | Extra small    |
| sm      | Small          |
| md      | Medium/default |
| lg      | Large          |
| xl      | Extra large    |
| display | Display scale  |

### TextTransform

| Value      | Description  |
| ---------- | ------------ |
| none       | No transform |
| uppercase  | Uppercase    |
| lowercase  | Lowercase    |
| title-case | Title case   |

### NumericStyle

| Value   | Description        |
| ------- | ------------------ |
| normal  | Normal numerics    |
| tabular | Tabular numerics   |
| mono    | Monospace numerics |

### LayoutRole

| Value         | Description    |
| ------------- | -------------- |
| header        | Header region  |
| sidebar       | Sidebar region |
| main          | Main content   |
| footer        | Footer region  |
| inline        | Inline content |
| overlay       | Overlay/modal  |
| repeated-item | Repeated item  |

### Density

| Value    | Description     |
| -------- | --------------- |
| compact  | Dense layout    |
| standard | Standard layout |
| spacious | Spacious layout |

### Alignment

| Value     | Description      |
| --------- | ---------------- |
| start     | Start aligned    |
| center    | Center aligned   |
| end       | End aligned      |
| justified | Justified/spread |

### SpacingPattern

| Value     | Description      |
| --------- | ---------------- |
| tight     | Tight rhythm     |
| standard  | Standard rhythm  |
| roomy     | Roomy rhythm     |
| editorial | Editorial rhythm |

### CompositionPattern

| Value   | Description          |
| ------- | -------------------- |
| stack   | Vertical stack       |
| row     | Horizontal row       |
| grid    | Grid                 |
| split   | Split layout         |
| rail    | Rail/sidebar pattern |
| overlay | Overlay composition  |

### InteractionPattern

| Value      | Description       |
| ---------- | ----------------- |
| click      | Click action      |
| input      | Text/value input  |
| selection  | Selection control |
| drag       | Drag interaction  |
| navigation | Navigation action |
| disclosure | Expand/collapse   |
| none       | Non-interactive   |

### StateModel

| Value        | Description            |
| ------------ | ---------------------- |
| default-only | Default state only     |
| hover        | Hover state            |
| focus        | Focus state            |
| selected     | Selected/current state |
| disabled     | Disabled state         |
| loading      | Loading state          |
| error        | Error state            |

### FeedbackStyle

| Value          | Description        |
| -------------- | ------------------ |
| none           | No feedback        |
| inline-message | Inline message     |
| toast          | Toast/notification |
| badge          | Badge/status chip  |
| state-color    | Color state change |
| animation      | Motion feedback    |

### MotionIntent

| Value      | Description       |
| ---------- | ----------------- |
| none       | No motion         |
| subtle     | Subtle transition |
| guided     | Guides attention  |
| expressive | Expressive motion |

### ElementCategory

| Value        | Description                |
| ------------ | -------------------------- |
| navigation   | Navigation structure       |
| form         | Form/input element         |
| action       | Action element             |
| content      | Content display            |
| data-display | Data visualization/display |
| feedback     | Feedback/status            |
| layout       | Layout structure           |
| media        | Media/imagery              |

### ElementRole

| Value            | Description        |
| ---------------- | ------------------ |
| primary-action   | Primary action     |
| secondary-action | Secondary action   |
| input            | Input control      |
| card             | Card item          |
| table            | Table/data grid    |
| list             | List               |
| hero             | Hero/lead section  |
| empty-state      | Empty state        |
| status           | Status indicator   |
| filter           | Filter control     |
| modal            | Modal/dialog       |
| sidebar          | Sidebar/navigation |

### Hierarchy

| Value      | Description         |
| ---------- | ------------------- |
| primary    | Primary hierarchy   |
| secondary  | Secondary hierarchy |
| tertiary   | Tertiary hierarchy  |
| supporting | Supporting detail   |

### ProofStatus

| Value   | Description                                  |
| ------- | -------------------------------------------- |
| pending | Proof obligation has not been evaluated      |
| pass    | Evidence satisfies the obligation            |
| flag    | Evidence is usable but has a non-blocker gap |
| block   | Evidence is missing or violates an invariant |

### RulePromotionStatus

| Value    | Description                                                 |
| -------- | ----------------------------------------------------------- |
| deferred | Recorded but not promoted in MVP/L1/L2                      |
| rejected | Explicitly rejected due proof or governance rule            |
| promoted | Promoted in L3 after proof, approval, and rollback evidence |
