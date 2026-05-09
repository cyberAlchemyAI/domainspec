# Queries: UI Prototyping Studio

## Capability Backlinks

- [Component Reuse Registry](SPEC.md#component-reuse-registry)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
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

| Field          | Type                                                   | Source                                                      | Description          |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------- | -------------------- |
| sessionId      | string                                                 | [StudioSession](domain.md#studiosession).sessionId          | Session identifier   |
| prompt         | string                                                 | [StudioSession](domain.md#studiosession).prompt             | Active prompt text   |
| variantCount   | integer                                                | [StudioSession](domain.md#studiosession).variantCount.value | Active variant count |
| variantLabels  | string[]                                               | [StudioSession](domain.md#studiosession).variantLabels      | Candidate labels     |
| baseline       | [BaselineProvenance](domain.md#baselineprovenance)     | [StudioSession](domain.md#studiosession).baseline           | Baseline provenance  |
| revisionHeadId | string                                                 | [StudioSession](domain.md#studiosession).revisionHeadId     | Latest revision ID   |
| selectionGate  | string                                                 | [StudioSession](domain.md#studiosession).selectionGate      | Selection gate state |
| applyGate      | string                                                 | [StudioSession](domain.md#studiosession).applyGate          | Apply gate state     |
| state          | string                                                 | [StudioSession](domain.md#studiosession).state              | Session state        |
| integration    | [IntegrationReadiness](domain.md#integrationreadiness) | [StudioSession](domain.md#studiosession).integration        | Downstream readiness |

### Reads From

| Entity                                   | Relationship | Fields Used                                                                                                            |
| ---------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| [StudioSession](domain.md#studiosession) | queries      | sessionId, prompt, variantCount, variantLabels, baseline, revisionHeadId, selectionGate, applyGate, state, integration |

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

| Field                      | Type     | Source                                                         | Description           |
| -------------------------- | -------- | -------------------------------------------------------------- | --------------------- |
| variants[].variantLabel    | string   | [PrototypeVariant](domain.md#prototypevariant).variantLabel    | Variant label         |
| variants[].htmlArtifactRef | string   | [PrototypeVariant](domain.md#prototypevariant).htmlArtifactRef | HTML artifact pointer |
| variants[].componentsUsed  | string[] | [PrototypeVariant](domain.md#prototypevariant).componentsUsed  | Component usage       |
| variants[].rationale       | string   | [PrototypeVariant](domain.md#prototypevariant).rationale       | Candidate rationale   |
| variants[].tradeoffs       | string   | [PrototypeVariant](domain.md#prototypevariant).tradeoffs       | Candidate tradeoffs   |
| variants[].risk            | string   | [PrototypeVariant](domain.md#prototypevariant).risk            | Candidate risks       |
| variants[].status          | string   | [PrototypeVariant](domain.md#prototypevariant).status          | Candidate status      |

### Reads From

| Entity                                         | Relationship | Fields Used                                                                       |
| ---------------------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| [PrototypeVariant](domain.md#prototypevariant) | queries      | variantLabel, htmlArtifactRef, componentsUsed, rationale, tradeoffs, risk, status |

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

| Field           | Type                                               | Source                                                      | Description                |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------- | -------------------------- |
| sessionId       | string                                             | [StudioSession](domain.md#studiosession).sessionId          | Session identifier         |
| revisionHeadId  | string                                             | [StudioSession](domain.md#studiosession).revisionHeadId     | Latest revision            |
| baseline        | [BaselineProvenance](domain.md#baselineprovenance) | [StudioSession](domain.md#studiosession).baseline           | Baseline mode and label    |
| variantCount    | integer                                            | [StudioSession](domain.md#studiosession).variantCount.value | Variant bound              |
| storyRefs       | string[]                                           | Derived from [STORIES.md](STORIES.md)                       | Story evidence links       |
| requirementRefs | string[]                                           | Derived from [SPEC.md](SPEC.md#functional-requirements-mvp) | FR evidence links          |
| acceptanceRefs  | string[]                                           | Derived from [SPEC.md](SPEC.md#acceptance-criteria-mvp)     | AC evidence links          |
| uiSpecRef       | string                                             | Derived from [UI-SPEC.md](UI-SPEC.md)                       | UI contract reference      |
| testSpecRef     | string                                             | Derived from [TEST-SPEC.md](TEST-SPEC.md)                   | Test obligations reference |

### Reads From

| Entity                                                   | Relationship | Fields Used                                                    |
| -------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| [StudioSession](domain.md#studiosession)                 | queries      | sessionId, revisionHeadId, baseline, variantCount, integration |
| [RevisionManifestEntry](domain.md#revisionmanifestentry) | queries      | revisionId, baseline, variantCount                             |
