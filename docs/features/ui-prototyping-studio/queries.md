# Queries: UI Prototyping Studio

## Capability Backlinks

- [Component Reuse Registry](SPEC.md#component-reuse-registry)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Evolution Engine](SPEC.md#evolution-engine)
- [Proof and Self-Improvement Gate](SPEC.md#proof-and-self-improvement-gate)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## GetSessionSnapshot

**Type:** Query (read-only)
**Actor:** User

Returns current session state, gates, and integration readiness.

### Input

| Field     | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |

### Filters

| Field              | Type    | Default | Description                                                           |
| ------------------ | ------- | ------- | --------------------------------------------------------------------- |
| includeIntegration | boolean | true    | Include [IntegrationReadiness](domain.md#integrationreadiness) fields |

### Output

| Field                   | Type                                                         | Source                                                           | Description                       |
| ----------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------- |
| sessionId               | string                                                       | [StudioSession](domain.md#studiosession).sessionId               | Session identifier                |
| prompt                  | string                                                       | [StudioSession](domain.md#studiosession).prompt                  | Active prompt text                |
| variantCount            | integer                                                      | [StudioSession](domain.md#studiosession).variantCount.value      | Active variant count              |
| generationMode          | [GenerationMode](domain.md#generationmode)                   | [StudioSession](domain.md#studiosession).generationMode          | Active Explore/Exploit mode       |
| variantLabels           | string[]                                                     | [StudioSession](domain.md#studiosession).variantLabels           | Candidate labels                  |
| baseline                | [BaselineProvenance](domain.md#baselineprovenance)           | [StudioSession](domain.md#studiosession).baseline                | Baseline provenance               |
| baselineRevisionAnchor  | [BaselineRevisionAnchor](domain.md#baselinerevisionanchor)   | [StudioSession](domain.md#studiosession).baselineRevisionAnchor  | Explicit baseline revision anchor |
| baselineGenealogyFamily | [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) | [StudioSession](domain.md#studiosession).baselineGenealogyFamily | Selected lineage family           |
| revisionHeadId          | string                                                       | [StudioSession](domain.md#studiosession).revisionHeadId          | Latest revision ID                |
| selectionGate           | string                                                       | [StudioSession](domain.md#studiosession).selectionGate           | Selection gate state              |
| applyGate               | string                                                       | [StudioSession](domain.md#studiosession).applyGate               | Apply gate state                  |
| state                   | string                                                       | [StudioSession](domain.md#studiosession).state                   | Session state                     |
| integration             | [IntegrationReadiness](domain.md#integrationreadiness)       | [StudioSession](domain.md#studiosession).integration             | Downstream readiness              |

### Reads From

| Entity                                   | Relationship | Fields Used                                                                                                                                     |
| ---------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [StudioSession](domain.md#studiosession) | queries      | sessionId, prompt, variantCount, variantLabels, baseline, baselineGenealogyFamily, revisionHeadId, selectionGate, applyGate, state, integration |

---

## ListSessionVariants

**Type:** Query (read-only)
**Actor:** User

Returns generated variants and metadata for baseline review.

### Input

| Field     | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |

### Filters

| Field            | Type    | Default        | Description                        |
| ---------------- | ------- | -------------- | ---------------------------------- |
| includeCommitted | boolean | true           | Include committed baseline entries |
| orderBy          | string  | `variantLabel` | Sort key                           |

### Output

| Field                                 | Type                                         | Source                                                                    | Description                             |
| ------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------- |
| variants[].variantLabel               | string                                       | [PrototypeVariant](domain.md#prototypevariant).variantLabel               | Variant label                           |
| variants[].generationMode             | [GenerationMode](domain.md#generationmode)   | [PrototypeVariant](domain.md#prototypevariant).generationMode             | Explore or Exploit source mode          |
| variants[].htmlArtifactRef            | [TypedReference](domain.md#typedreference)   | [PrototypeVariant](domain.md#prototypevariant).htmlArtifactRef            | HTML artifact pointer                   |
| variants[].componentsUsed             | [TypedReference](domain.md#typedreference)[] | [PrototypeVariant](domain.md#prototypevariant).componentsUsed             | Component usage                         |
| variants[].proposedIdentityIds        | string[]                                     | [PrototypeVariant](domain.md#prototypevariant).proposedIdentityIds        | Suggested conceptual element identities |
| variants[].proposedVisualSignatureIds | string[]                                     | [PrototypeVariant](domain.md#prototypevariant).proposedVisualSignatureIds | Suggested visual DNA signatures         |
| variants[].rationale                  | string                                       | [PrototypeVariant](domain.md#prototypevariant).rationale                  | Candidate rationale                     |
| variants[].tradeoffs                  | string                                       | [PrototypeVariant](domain.md#prototypevariant).tradeoffs                  | Candidate tradeoffs                     |
| variants[].risk                       | string                                       | [PrototypeVariant](domain.md#prototypevariant).risk                       | Candidate risks                         |
| variants[].status                     | string                                       | [PrototypeVariant](domain.md#prototypevariant).status                     | Candidate status                        |

### Reads From

| Entity                                         | Relationship | Fields Used                                                                                                                        |
| ---------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [PrototypeVariant](domain.md#prototypevariant) | queries      | variantLabel, htmlArtifactRef, componentsUsed, proposedIdentityIds, proposedVisualSignatureIds, rationale, tradeoffs, risk, status |

---

## GetDraftMutationBatch

**Type:** Query (read-only)
**Actor:** User

Returns current draft batch for manual review before approval.

### Input

| Field     | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| batchId   | string | no       | Optional explicit batch                                   |

### Filters

| Field  | Type   | Default | Description         |
| ------ | ------ | ------- | ------------------- |
| status | string | `draft` | Batch status filter |

### Output

| Field                   | Type                                     | Source                                                           | Description          |
| ----------------------- | ---------------------------------------- | ---------------------------------------------------------------- | -------------------- |
| batchId                 | string                                   | [MutationBatch](domain.md#mutationbatch).batchId                 | Batch identifier     |
| sourceRevisionId        | string                                   | [MutationBatch](domain.md#mutationbatch).sourceRevisionId        | Source revision      |
| generatedFromCommentIds | string[]                                 | [MutationBatch](domain.md#mutationbatch).generatedFromCommentIds | Ordered comments     |
| tasks                   | [MutationTask](domain.md#mutationtask)[] | [MutationBatch](domain.md#mutationbatch).tasks                   | Draft task set       |
| approval                | [BatchApproval](domain.md#batchapproval) | [MutationBatch](domain.md#mutationbatch).approval                | Approval metadata    |
| checksum                | string                                   | [MutationBatch](domain.md#mutationbatch).checksum                | Determinism checksum |

### Reads From

| Entity                                   | Relationship | Fields Used                                                                           |
| ---------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| [MutationBatch](domain.md#mutationbatch) | queries      | batchId, sourceRevisionId, generatedFromCommentIds, tasks, approval, checksum, status |

---

## ListRevisionManifest

**Type:** Query (read-only)
**Actor:** User

Returns append-only revision manifest entries for a session.

### Input

| Field     | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |

### Filters

| Field       | Type    | Default | Description     |
| ----------- | ------- | ------- | --------------- |
| limit       | integer | 50      | Entry count cap |
| newestFirst | boolean | true    | Sort direction  |

### Output

| Field                          | Type                                               | Source                                                                        | Description                 |
| ------------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------- |
| entries[].revisionId           | string                                             | [RevisionManifestEntry](domain.md#revisionmanifestentry).revisionId           | Revision ID                 |
| entries[].parentRevisionId     | string                                             | [RevisionManifestEntry](domain.md#revisionmanifestentry).parentRevisionId     | Parent revision             |
| entries[].variantCount         | integer                                            | [RevisionManifestEntry](domain.md#revisionmanifestentry).variantCount.value   | Variant count at apply time |
| entries[].baseline             | [BaselineProvenance](domain.md#baselineprovenance) | [RevisionManifestEntry](domain.md#revisionmanifestentry).baseline             | Baseline provenance         |
| entries[].appliedBatchId       | string                                             | [RevisionManifestEntry](domain.md#revisionmanifestentry).appliedBatchId       | Applied batch               |
| entries[].appliedTaskIds       | string[]                                           | [RevisionManifestEntry](domain.md#revisionmanifestentry).appliedTaskIds       | Applied tasks               |
| entries[].unresolvedCommentIds | string[]                                           | [RevisionManifestEntry](domain.md#revisionmanifestentry).unresolvedCommentIds | Remaining comments          |
| entries[].diffSummary          | [DiffSummary](domain.md#diffsummary)               | [RevisionManifestEntry](domain.md#revisionmanifestentry).diffSummary          | Diff summary                |
| entries[].createdAt            | string                                             | [RevisionManifestEntry](domain.md#revisionmanifestentry).createdAt            | Created timestamp           |

### Reads From

| Entity                                                   | Relationship | Fields Used                                                                                                                        |
| -------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [RevisionManifestEntry](domain.md#revisionmanifestentry) | queries      | revisionId, parentRevisionId, variantCount, baseline, appliedBatchId, appliedTaskIds, unresolvedCommentIds, diffSummary, createdAt |

---

## GetHandoffBundle

**Type:** Query (read-only)
**Actor:** User or System

Returns contract references used by downstream UI bridge, test generation, and implementation stages.

### Input

| Field     | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |

### Filters

| Field   | Type   | Default | Description     |
| ------- | ------ | ------- | --------------- |
| profile | string | `mvp`   | Handoff profile |

### Output

| Field                  | Type                                                       | Source                                                          | Description                |
| ---------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- | -------------------------- |
| sessionId              | string                                                     | [StudioSession](domain.md#studiosession).sessionId              | Session identifier         |
| revisionHeadId         | string                                                     | [StudioSession](domain.md#studiosession).revisionHeadId         | Latest revision            |
| baselineRevisionAnchor | [BaselineRevisionAnchor](domain.md#baselinerevisionanchor) | [StudioSession](domain.md#studiosession).baselineRevisionAnchor | Baseline anchor            |
| baseline               | [BaselineProvenance](domain.md#baselineprovenance)         | [StudioSession](domain.md#studiosession).baseline               | Baseline mode and label    |
| variantCount           | integer                                                    | [StudioSession](domain.md#studiosession).variantCount.value     | Variant bound              |
| storyRefs              | [TypedReference](domain.md#typedreference)[]               | Derived from [STORIES.md](STORIES.md)                           | Story evidence links       |
| requirementRefs        | [TypedReference](domain.md#typedreference)[]               | Derived from [SPEC.md](SPEC.md#functional-requirements-mvp)     | FR evidence links          |
| acceptanceRefs         | [TypedReference](domain.md#typedreference)[]               | Derived from [SPEC.md](SPEC.md#acceptance-criteria-mvp)         | AC evidence links          |
| uiSpecRef              | [TypedReference](domain.md#typedreference)                 | Derived from [UI-SPEC.md](UI-SPEC.md)                           | UI contract reference      |
| testSpecRef            | [TypedReference](domain.md#typedreference)                 | Derived from [TEST-SPEC.md](TEST-SPEC.md)                       | Test obligations reference |

### Reads From

| Entity                                                   | Relationship | Fields Used                                                    |
| -------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| [StudioSession](domain.md#studiosession)                 | queries      | sessionId, revisionHeadId, baseline, variantCount, integration |
| [RevisionManifestEntry](domain.md#revisionmanifestentry) | queries      | revisionId, baseline, variantCount                             |

---

## GetEvolutionCycle

**Type:** Query (read-only)
**Actor:** User or System

Returns the Evolution Engine view of one studio cycle.

### Input

| Field     | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId |
| cycleId   | string | yes      | Target [EvolutionCycle](domain.md#evolutioncycle).cycleId |

### Output

| Field                   | Type                                               | Source                                                             | Description               |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------------------------ | ------------------------- |
| cycleId                 | string                                             | [EvolutionCycle](domain.md#evolutioncycle).cycleId                 | Cycle identifier          |
| generationIndex         | integer                                            | [EvolutionCycle](domain.md#evolutioncycle).generationIndex         | Generation number         |
| genome                  | [PrototypeGenome](domain.md#prototypegenome)       | [EvolutionCycle](domain.md#evolutioncycle).genome                  | Encoded prototype genome  |
| populationVariantLabels | string[]                                           | [EvolutionCycle](domain.md#evolutioncycle).populationVariantLabels | Candidate population      |
| fitnessSignalIds        | string[]                                           | [EvolutionCycle](domain.md#evolutioncycle).fitnessSignalIds        | Selection-pressure events |
| selectedBaseline        | [BaselineProvenance](domain.md#baselineprovenance) | [EvolutionCycle](domain.md#evolutioncycle).selectedBaseline        | Selected lineage          |
| genealogyFamilyId       | string                                             | [EvolutionCycle](domain.md#evolutioncycle).genealogyFamilyId       | Optional L1 family ID     |
| mutationBatchId         | string                                             | [EvolutionCycle](domain.md#evolutioncycle).mutationBatchId         | Proposed mutation batch   |
| proofStatus             | [ProofStatus](domain.md#proofstatus)               | [EvolutionCycle](domain.md#evolutioncycle).proofStatus             | Current proof-gate status |
| state                   | string                                             | [EvolutionCycle](domain.md#evolutioncycle).state                   | Evolution lifecycle state |

### Reads From

| Entity                                     | Relationship | Fields Used                                                                                                                                           |
| ------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [EvolutionCycle](domain.md#evolutioncycle) | queries      | cycleId, generationIndex, genome, populationVariantLabels, fitnessSignalIds, selectedBaseline, genealogyFamilyId, mutationBatchId, proofStatus, state |

---

## ListFitnessSignals

**Type:** Query (read-only)
**Actor:** User or System

Returns fitness signals captured for a session or cycle.

### Input

| Field     | Type   | Required | Description                                                 |
| --------- | ------ | -------- | ----------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId   |
| cycleId   | string | no       | Optional [EvolutionCycle](domain.md#evolutioncycle).cycleId |

### Filters

| Field     | Type                                       | Default | Description                                                    |
| --------- | ------------------------------------------ | ------- | -------------------------------------------------------------- |
| source    | string                                     | any     | Filter by [FitnessSignalSource](domain.md#fitnesssignalsource) |
| targetRef | [TypedReference](domain.md#typedreference) | any     | Filter by target variant/comment/batch/revision                |

### Output

| Field                | Type                                                 | Source                                              | Description                                                                                        |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| signals[].signalId   | string                                               | [FitnessSignal](domain.md#fitnesssignal).signalId   | Signal identifier                                                                                  |
| signals[].cycleId    | string                                               | [FitnessSignal](domain.md#fitnesssignal).cycleId    | Owning cycle                                                                                       |
| signals[].source     | [FitnessSignalSource](domain.md#fitnesssignalsource) | [FitnessSignal](domain.md#fitnesssignal).source     | Signal source                                                                                      |
| signals[].targetRef  | [TypedReference](domain.md#typedreference)           | [FitnessSignal](domain.md#fitnesssignal).targetRef  | Evaluated target, including variant/comment/batch/revision/identity/visual signature/decision refs |
| signals[].vector     | [FitnessVector](domain.md#fitnessvector)             | [FitnessSignal](domain.md#fitnesssignal).vector     | Fitness direction                                                                                  |
| signals[].rationale  | string                                               | [FitnessSignal](domain.md#fitnesssignal).rationale  | Selection rationale                                                                                |
| signals[].capturedAt | string                                               | [FitnessSignal](domain.md#fitnesssignal).capturedAt | Capture timestamp                                                                                  |

### Reads From

| Entity                                   | Relationship | Fields Used                                                         |
| ---------------------------------------- | ------------ | ------------------------------------------------------------------- |
| [FitnessSignal](domain.md#fitnesssignal) | queries      | signalId, cycleId, source, targetRef, vector, rationale, capturedAt |

---

## ListUIDecisionEvidence

**Type:** Query (read-only)
**Actor:** User or System

Returns confirmed UI identity, instance, visual DNA, and decision records for one baseline genealogy family.

### Input

| Field             | Type   | Required | Description                                                                  |
| ----------------- | ------ | -------- | ---------------------------------------------------------------------------- |
| sessionId         | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId                    |
| genealogyFamilyId | string | yes      | Target [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily).familyId |

### Filters

| Field        | Type   | Default | Description                                                          |
| ------------ | ------ | ------- | -------------------------------------------------------------------- |
| identityId   | string | any     | Optional [UIElementIdentity](domain.md#uielementidentity).identityId |
| decisionType | string | any     | Optional [UIDecisionType](domain.md#uidecisiontype) filter           |

### Output

| Field              | Type                                             | Source                                           | Description                        |
| ------------------ | ------------------------------------------------ | ------------------------------------------------ | ---------------------------------- |
| identities[]       | [UIElementIdentity](domain.md#uielementidentity) | [UIElementIdentity](domain.md#uielementidentity) | Confirmed conceptual UI identities |
| instances[]        | [UIElementInstance](domain.md#uielementinstance) | [UIElementInstance](domain.md#uielementinstance) | Rendered occurrences of identities |
| visualSignatures[] | [UIVisualSignature](domain.md#uivisualsignature) | [UIVisualSignature](domain.md#uivisualsignature) | Confirmed visual DNA records       |
| decisionRecords[]  | [UIDecisionRecord](domain.md#uidecisionrecord)   | [UIDecisionRecord](domain.md#uidecisionrecord)   | Human-confirmed decision evidence  |

### Reads From

| Entity                                                       | Relationship | Fields Used                                                           |
| ------------------------------------------------------------ | ------------ | --------------------------------------------------------------------- |
| [BaselineGenealogyFamily](domain.md#baselinegenealogyfamily) | filters      | familyId, confirmedIdentityIds, decisionRecordIds, visualSignatureIds |
| [UIElementIdentity](domain.md#uielementidentity)             | queries      | all fields                                                            |
| [UIElementInstance](domain.md#uielementinstance)             | queries      | all fields                                                            |
| [UIVisualSignature](domain.md#uivisualsignature)             | queries      | all fields                                                            |
| [UIDecisionRecord](domain.md#uidecisionrecord)               | queries      | all fields                                                            |

---

## ListRulePromotionRequests

**Type:** Query (read-only)
**Actor:** User or System

Returns deferred, rejected, or promotable rule-promotion requests for proof-governed self-improvement paths. This query is not part of normal MVP apply.

### Input

| Field     | Type   | Required | Description                                                 |
| --------- | ------ | -------- | ----------------------------------------------------------- |
| sessionId | string | yes      | Target [StudioSession](domain.md#studiosession).sessionId   |
| cycleId   | string | no       | Optional [EvolutionCycle](domain.md#evolutioncycle).cycleId |

### Filters

| Field   | Type                                                 | Default | Description                                               |
| ------- | ---------------------------------------------------- | ------- | --------------------------------------------------------- |
| status  | [RulePromotionStatus](domain.md#rulepromotionstatus) | any     | Filter by deferred, rejected, pending, or promoted        |
| ruleRef | [TypedReference](domain.md#typedreference)           | any     | Filter by generation rule, heuristic, template, or rubric |

### Output

| Field                      | Type                                                   | Source                                                                 | Description                     |
| -------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------- |
| requests[]                 | [RulePromotionRequest](domain.md#rulepromotionrequest) | [RulePromotionRequest](domain.md#rulepromotionrequest)                 | Promotion request records       |
| requests[].ruleRef         | [TypedReference](domain.md#typedreference)             | [RulePromotionRequest](domain.md#rulepromotionrequest).ruleRef         | Requested rule reference        |
| requests[].proofGateStatus | [ProofStatus](domain.md#proofstatus)                   | [RulePromotionRequest](domain.md#rulepromotionrequest).proofGateStatus | Proof-gate result, if evaluated |

### Reads From

| Entity                                                 | Relationship | Fields Used |
| ------------------------------------------------------ | ------------ | ----------- |
| [RulePromotionRequest](domain.md#rulepromotionrequest) | queries      | all fields  |
