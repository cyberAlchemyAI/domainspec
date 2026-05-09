---
feature: ui-prototyping-studio
version: current
status: draft
updatedAt: 2026-05-07
---

# UI Prototyping Studio Stories

> Navigate by capability: [Variant Generation and Baseline Gate](#variant-generation-and-baseline-gate) · [Annotation and Deterministic Task Synthesis](#annotation-and-deterministic-task-synthesis) · [Manual Governance and Apply Control](#manual-governance-and-apply-control) · [Prototype Revision Loop](#prototype-revision-loop)

## Variant Generation and Baseline Gate

### US-001 Prompt To Candidate Variants

As a **designer**, I want **the studio to generate bounded candidate variants from a prompt**, so that **I can compare options without losing deterministic output contracts**.

**Given** a session with a valid prompt and `variantCount` in `1..3`
**When** I request generation
**Then** I receive exactly `variantCount` HTML-first variants with metadata.

**Acceptance checks**

- [ ] Variant generation rejects `variantCount` outside `1..3`.
- [ ] Omitted `variantCount` defaults to `3`.
- [ ] Every variant includes `componentsUsed`, `rationale`, `tradeoffs`, and `risk`.

**Covered concepts (IDs)**

- [VariantCount](domain.md#variantcount) (`ui-prototyping-studio.VariantCount`)
- [GenerateVariants](operations.md#generatevariants) (`ui-prototyping-studio.GenerateVariants`)
- [ListSessionVariants](queries.md#listsessionvariants) (`ui-prototyping-studio.ListSessionVariants`)

**Aspect evidence**

- [GenerateVariants](operations.md#generatevariants)
- [ListSessionVariants](queries.md#listsessionvariants)
- [Interaction Contract](UI-SPEC.md#interaction-contract)

**Capability links**

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)

### US-002 Human Baseline Selection

As a **designer**, I want **explicit baseline selection when multiple candidates are generated**, so that **downstream comments and mutations are anchored to an intentional choice**.

**Given** a generated multi-option session (`variantCount > 1`)
**When** I choose one baseline label
**Then** selection gate is satisfied and annotation flow is unlocked.

**Acceptance checks**

- [ ] Attempting comment/synthesis/apply without baseline selection is blocked for `variantCount > 1`.
- [ ] Baseline provenance is persisted as `selected` for multi-option mode.

**Covered concepts (IDs)**

- [SelectOrCommitBaseline](operations.md#selectorcommitbaseline) (`ui-prototyping-studio.SelectOrCommitBaseline`)
- [BaselineProvenance](domain.md#baselineprovenance) (`ui-prototyping-studio.BaselineProvenance`)
- [StudioSessionState](states.md#studiosessionstate) (`ui-prototyping-studio.StudioSessionState`)

**Aspect evidence**

- [SelectOrCommitBaseline](operations.md#selectorcommitbaseline)
- [Transition Table](states.md#transition-table)
- [Form and Selection Contracts](UI-SPEC.md#form-and-selection-contracts)

**Capability links**

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)

### US-007 Single-Variant Committed Path

As a **designer**, I want **single-variant mode to commit the baseline automatically**, so that **quick iterations skip unnecessary multi-option selection gates**.

**Given** a session with `variantCount = 1`
**When** variants are generated
**Then** the baseline is marked `committed` and annotation can start without manual selection.

**Acceptance checks**

- [ ] Single-variant flow records baseline mode as `committed`.
- [ ] Selection gate is marked satisfied in committed path.

**Covered concepts (IDs)**

- [VariantCount](domain.md#variantcount) (`ui-prototyping-studio.VariantCount`)
- [SelectOrCommitBaseline](operations.md#selectorcommitbaseline) (`ui-prototyping-studio.SelectOrCommitBaseline`)
- [BaselineMode](domain.md#baselinemode) (`ui-prototyping-studio.BaselineMode`)

**Aspect evidence**

- [SelectOrCommitBaseline](operations.md#selectorcommitbaseline)
- [GenerateVariants](operations.md#generatevariants)
- [State-to-UI Mapping](UI-SPEC.md#state-to-ui-mapping)

**Capability links**

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)

## Annotation and Deterministic Task Synthesis

### US-003 Element-Level Commenting

As a **reviewer**, I want **to attach structured comments to targeted UI elements**, so that **change requests remain actionable and traceable**.

**Given** an active baseline revision
**When** I submit a comment with canonical fields
**Then** the event is persisted with target metadata and severity.

**Acceptance checks**

- [ ] Comment payload requires `target`, `severity`, `intent`, `note`.
- [ ] Severity values are restricted to `blocker|high|medium|low`.

**Covered concepts (IDs)**

- [CommentEvent](domain.md#commentevent) (`ui-prototyping-studio.CommentEvent`)
- [AnnotationTarget](domain.md#annotationtarget) (`ui-prototyping-studio.AnnotationTarget`)
- [CaptureCommentEvent](operations.md#capturecommentevent) (`ui-prototyping-studio.CaptureCommentEvent`)

**Aspect evidence**

- [CaptureCommentEvent](operations.md#capturecommentevent)
- [CommentSeverity](domain.md#commentseverity)
- [AnnotationForm](UI-SPEC.md#annotationform)

**Capability links**

- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)

### US-004 Deterministic Task Synthesis

As a **PM**, I want **ordered comments to synthesize into deterministic task batches**, so that **iteration can be replayed and audited**.

**Given** an ordered set of comment events on one revision
**When** synthesis runs repeatedly on the same input
**Then** task payload and checksum remain identical.

**Acceptance checks**

- [ ] Synthesis output is deterministic for identical ordered comment inputs.
- [ ] Synthesized batch starts in `draft` status.

**Covered concepts (IDs)**

- [SynthesizeMutationBatch](operations.md#synthesizemutationbatch) (`ui-prototyping-studio.SynthesizeMutationBatch`)
- [MutationBatch](domain.md#mutationbatch) (`ui-prototyping-studio.MutationBatch`)
- [MutationTask](domain.md#mutationtask) (`ui-prototyping-studio.MutationTask`)

**Aspect evidence**

- [SynthesizeMutationBatch](operations.md#synthesizemutationbatch)
- [GetDraftMutationBatch](queries.md#getdraftmutationbatch)
- [MVPStudioIterationWorkflow](workflows.md#mvpstudioiterationworkflow)

**Capability links**

- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)

## Manual Governance and Apply Control

### US-005 Manual Apply Gate

As a **team lead**, I want **mutation batches to require explicit approval before apply**, so that **prototype revisions do not auto-commit unintended changes**.

**Given** a synthesized draft batch
**When** approval is missing or stale
**Then** apply is rejected.

**Acceptance checks**

- [ ] Draft batch cannot be applied without explicit approval metadata.
- [ ] Auto-apply paths are rejected.
- [ ] Stale source revision apply attempts are rejected.

**Covered concepts (IDs)**

- [ApproveMutationBatch](operations.md#approvemutationbatch) (`ui-prototyping-studio.ApproveMutationBatch`)
- [ApplyApprovedBatch](operations.md#applyapprovedbatch) (`ui-prototyping-studio.ApplyApprovedBatch`)
- [GovernanceGatePolicy](workflows.md#governancegatepolicy) (`ui-prototyping-studio.GovernanceGatePolicy`)

**Aspect evidence**

- [ApproveMutationBatch](operations.md#approvemutationbatch)
- [ApplyApprovedBatch](operations.md#applyapprovedbatch)
- [GovernanceGatePolicy](workflows.md#governancegatepolicy)

**Capability links**

- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)

## Prototype Revision Loop

### US-006 Revision Manifest Traceability

As an **engineer**, I want **every applied batch to append a revision manifest record**, so that **provenance and acceptance evidence remain reviewable**.

**Given** an approved batch and satisfied gates
**When** apply succeeds
**Then** exactly one manifest row is appended with variant and baseline provenance.

**Acceptance checks**

- [ ] Each successful apply appends exactly one manifest entry.
- [ ] Manifest entry includes `variantCount` and baseline mode (`selected` or `committed`).
- [ ] Session revision head updates to the appended revision.

**Covered concepts (IDs)**

- [RevisionManifestEntry](domain.md#revisionmanifestentry) (`ui-prototyping-studio.RevisionManifestEntry`)
- [ApplyApprovedBatch](operations.md#applyapprovedbatch) (`ui-prototyping-studio.ApplyApprovedBatch`)
- [ListRevisionManifest](queries.md#listrevisionmanifest) (`ui-prototyping-studio.ListRevisionManifest`)

**Aspect evidence**

- [ApplyApprovedBatch](operations.md#applyapprovedbatch)
- [ListRevisionManifest](queries.md#listrevisionmanifest)
- [Transition Table](states.md#transition-table)

**Capability links**

- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)

## Story Coverage Matrix

| Capability                                  | Story IDs              | Covered Concepts                                                                                                                                                   | Notes                                                         |
| ------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Variant Generation and Baseline Gate        | US-001, US-002, US-007 | ui-prototyping-studio.VariantCount, ui-prototyping-studio.GenerateVariants, ui-prototyping-studio.SelectOrCommitBaseline, ui-prototyping-studio.BaselineProvenance | Covers bounded multi-option and single-option committed paths |
| Annotation and Deterministic Task Synthesis | US-003, US-004         | ui-prototyping-studio.CommentEvent, ui-prototyping-studio.CaptureCommentEvent, ui-prototyping-studio.SynthesizeMutationBatch, ui-prototyping-studio.MutationBatch  | Covers canonical schema and deterministic synthesis           |
| Manual Governance and Apply Control         | US-005                 | ui-prototyping-studio.ApproveMutationBatch, ui-prototyping-studio.ApplyApprovedBatch, ui-prototyping-studio.GovernanceGatePolicy                                   | Covers manual gates and auto-apply prohibition                |
| Prototype Revision Loop                     | US-006                 | ui-prototyping-studio.RevisionManifestEntry, ui-prototyping-studio.ListRevisionManifest, ui-prototyping-studio.StudioSessionState                                  | Covers append-only revision evidence and head updates         |
