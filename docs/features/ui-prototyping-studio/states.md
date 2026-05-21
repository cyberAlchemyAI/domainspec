# State Machines: UI Prototyping Studio

## Capability Backlinks

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Genetic Evolution Engine](SPEC.md#genetic-evolution-engine)
- [Godel Proof and Self-Improvement Gate](SPEC.md#godel-proof-and-self-improvement-gate)

## StudioSessionState

```mermaid
stateDiagram-v2
    [*] --> SessionInitialized
    SessionInitialized --> PromptCaptured : SubmitPrompt
    PromptCaptured --> VariantsReady : GenerateVariants
    VariantsReady --> BaselineReady : SelectBaseline [variantCount > 1]
    VariantsReady --> BaselineReady : CommitBaseline [variantCount = 1]
    BaselineReady --> CommentsCaptured : CaptureCommentEvent
    CommentsCaptured --> MutationDrafted : SynthesizeMutationBatch
    MutationDrafted --> MutationApproved : ApproveMutationBatch
    MutationApproved --> RevisionApplied : ApplyApprovedBatch
    RevisionApplied --> RevisionRecorded : AppendManifest
    RevisionRecorded --> CommentsCaptured : ContinueIteration
    RevisionRecorded --> SessionCompleted : FinalizeSession
    SessionCompleted --> [*]
```

### Transition Table

| From               | Event                   | To               | Guard                                                     | Effect                                                                                                                                                                 |
| ------------------ | ----------------------- | ---------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SessionInitialized | SubmitPrompt            | PromptCaptured   | Prompt is non-empty                                       | [StudioSession](domain.md#studiosession).prompt stored                                                                                                                 |
| PromptCaptured     | GenerateVariants        | VariantsReady    | [VariantCount](domain.md#variantcount).value in `{1,2,3}` | [PrototypeVariant](domain.md#prototypevariant) rows created                                                                                                            |
| VariantsReady      | SelectBaseline          | BaselineReady    | `variantCount > 1` and selected label is valid            | [BaselineProvenance](domain.md#baselineprovenance).mode=`selected`; [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) created; `selectionGate='satisfied'`  |
| VariantsReady      | CommitBaseline          | BaselineReady    | `variantCount = 1`                                        | [BaselineProvenance](domain.md#baselineprovenance).mode=`committed`; [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) created; `selectionGate='satisfied'` |
| BaselineReady      | CaptureCommentEvent     | CommentsCaptured | Comment payload passes schema                             | [CommentEvent](domain.md#commentevent) appended                                                                                                                        |
| CommentsCaptured   | SynthesizeMutationBatch | MutationDrafted  | Ordered comment set exists                                | [MutationBatch](domain.md#mutationbatch).status=`draft`                                                                                                                |
| MutationDrafted    | ApproveMutationBatch    | MutationApproved | Explicit approval metadata present                        | [MutationBatch](domain.md#mutationbatch).status=`approved`; `applyGate='satisfied'`                                                                                    |
| MutationApproved   | ApplyApprovedBatch      | RevisionApplied  | Batch approved, non-stale, no auto-apply                  | Revision patch applied                                                                                                                                                 |
| RevisionApplied    | AppendManifest          | RevisionRecorded | Manifest append succeeds                                  | [RevisionManifestEntry](domain.md#revisionmanifestentry) created; revision head updated                                                                                |
| RevisionRecorded   | ContinueIteration       | CommentsCaptured | Session not finalized                                     | Loop continues on active baseline                                                                                                                                      |
| RevisionRecorded   | FinalizeSession         | SessionCompleted | User finalizes session                                    | Session locked for handoff export                                                                                                                                      |

### Invariants

| ID  | Invariant                                                    | Formal                                                                                 |
| --- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| I1  | Variant count remains bounded in all states                  | `[StudioSession](domain.md#studiosession).variantCount.value in {1,2,3}`               |
| I2  | Session default remains `3` when not explicitly overridden   | `requestedVariantCount=null -> variantCount=3`                                         |
| I3  | Multi-variant sessions cannot bypass explicit selection gate | `variantCount>1 -> selectionGate='satisfied' before MutationDrafted`                   |
| I4  | Single-variant sessions must use committed baseline mode     | `variantCount=1 -> baseline.mode='committed'`                                          |
| I5  | Apply transitions require approved batch only                | `state=MutationApproved -> [MutationBatch](domain.md#mutationbatch).status='approved'` |
| I6  | Auto-apply is forbidden in every state                       | `applyRequestedBy != 'system:auto'`                                                    |
| I7  | Every successful apply creates exactly one manifest entry    | `delta(count(RevisionManifestEntry)) = 1`                                              |
| I8  | Adapter compatibility remains runtime-independent            | `imports(newspaper.runtime)=0`                                                         |

---

## EvolutionCycleState

```mermaid
stateDiagram-v2
    [*] --> GenomeCaptured
    GenomeCaptured --> PopulationGenerated : GenerateVariants
    PopulationGenerated --> FitnessEvaluated : RecordFitnessSignal
    FitnessEvaluated --> LineageSelected : SelectOrCommitBaseline
    LineageSelected --> MutationProposed : SynthesizeMutationBatch
    MutationProposed --> ProofEvaluated : EvaluateProofGate
    ProofEvaluated --> MutationApproved : ApproveMutationBatch [proofStatus pass]
    ProofEvaluated --> RulePromotionDeferred : PromoteEvolutionRule [MVP or proofStatus not pass]
    MutationApproved --> MutationApplied : ApplyApprovedBatch
    MutationApplied --> LineageRecorded : AppendManifest
    LineageRecorded --> GenomeCaptured : ContinueEvolution
    LineageRecorded --> HandoffReady : ExportDesignHandoff
    HandoffReady --> [*]
```

### Transition Table

| From                | Event                   | To                    | Guard                                        | Effect                                                                                   |
| ------------------- | ----------------------- | --------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| GenomeCaptured      | GenerateVariants        | PopulationGenerated   | [VariantCount](domain.md#variantcount) valid | Candidate population is created                                                          |
| PopulationGenerated | RecordFitnessSignal     | FitnessEvaluated      | Fitness vector valid                         | [FitnessSignal](domain.md#fitnesssignal) appended                                        |
| FitnessEvaluated    | SelectOrCommitBaseline  | LineageSelected       | Baseline gate satisfied                      | Winning lineage recorded as [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) |
| LineageSelected     | SynthesizeMutationBatch | MutationProposed      | Ordered comment set exists                   | [MutationBatch](domain.md#mutationbatch) proposed                                        |
| MutationProposed    | EvaluateProofGate       | ProofEvaluated        | Proof obligations are present                | [EvolutionCycle](domain.md#evolutioncycle).proofStatus updated                           |
| ProofEvaluated      | ApproveMutationBatch    | MutationApproved      | `proofStatus='pass'` and approval present    | Apply gate can be satisfied                                                              |
| ProofEvaluated      | PromoteEvolutionRule    | RulePromotionDeferred | MVP runtime or proof not passed              | Self-improvement is recorded but not promoted                                            |
| MutationApproved    | ApplyApprovedBatch      | MutationApplied       | Batch approved, non-stale, no auto-apply     | Prototype mutation applied                                                               |
| MutationApplied     | AppendManifest          | LineageRecorded       | Manifest append succeeds                     | [RevisionManifestEntry](domain.md#revisionmanifestentry) preserves lineage               |
| LineageRecorded     | ContinueEvolution       | GenomeCaptured        | User continues iteration                     | New genome includes prior comments, tasks, fitness signals, and revision evidence        |
| LineageRecorded     | ExportDesignHandoff     | HandoffReady          | Handoff references complete                  | Downstream handoff bundle ready                                                          |

### Invariants

| ID  | Invariant                                                        | Formal                                                                        |
| --- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| EC1 | A population cannot exceed the session variant bound             | `count(populationVariantLabels) = StudioSession.variantCount.value`           |
| EC2 | A lineage cannot be selected before fitness or explicit baseline | `LineageSelected -> selectionGate='satisfied'`                                |
| EC3 | Mutation proposal must derive from selected lineage family       | `MutationBatch.sourceRevisionId = BaselineGenealogyFamily.baselineRevisionId` |
| EC4 | Rule promotion requires proof pass and non-auto actor            | `RulePromoted -> proofStatus='pass' and promotedBy!='system:auto'`            |
| EC5 | MVP runtime cannot promote evolution rules directly              | `runtimeMvp -> RulePromotionDeferred`                                         |
| EC6 | Revision lineage remains append-only                             | `LineageRecorded -> appendCount(RevisionManifestEntry)=1`                     |
