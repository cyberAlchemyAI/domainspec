---
feature: ui-prototyping-studio
version: current
status: draft
updatedAt: 2026-05-07
---

# UI Prototyping Studio

## Overview

UI Prototyping Studio is a DomainSpec-native feature for rapid UI exploration with deterministic governance.
It receives a user prompt, generates HTML-first variants, enforces baseline gating semantics, captures element-level comments, synthesizes deterministic mutation batches, and appends revision evidence for downstream UI delivery stages.

Discovery baseline:

- [DISCOVERY.md](DISCOVERY.md)

Story baseline:

- [STORIES.md](STORIES.md)

Reference inventory:

- [inventory/README.md](inventory/README.md)
- [inventory/skills-references/open-design/INVENTORY.md](inventory/skills-references/open-design/INVENTORY.md)

## What This Module Owns

- Prompt-to-variant generation with strict `variantCount` contract (`1..3`, default `3`).
- Deterministic baseline gate behavior for both multi-option and single-option runs.
- HTML-first revision loop (`comment -> task -> approval -> apply -> manifest append`).
- Manual governance controls that forbid auto-apply in MVP.
- Adapter-only compatibility with newspaper contract shape (no runtime coupling).
- Design artifact handoff for `domainspec-ui-phase-bridge`, `domainspec-generate-tests --ui`, and `domainspec-ui-implement`.

## Module Map

```mermaid
graph TD
    A[Component Reuse Registry] --> B[Variant Generation and Baseline Gate]
    B --> C[Prototype Revision Loop]
    C --> D[Annotation and Deterministic Task Synthesis]
    D --> E[Manual Governance and Apply Control]
    E --> F[Design Artifact Export and Handoff]
    C --> G[Newspaper Adapter Compatibility]
```

## Capabilities

| Capability                                                                                  | What                                                                    | Key Aspects                                                                            | Detail                                                           |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Component Reuse Registry](#component-reuse-registry)                                       | Indexes reusable design-system primitives for prototype assembly        | [domain.md](domain.md), [queries.md](queries.md), [UI-SPEC.md](UI-SPEC.md)             | Registry metadata and bounded reuse constraints                  |
| [Variant Generation and Baseline Gate](#variant-generation-and-baseline-gate)               | Generates `1..3` variants and enforces deterministic baseline readiness | [operations.md](operations.md), [states.md](states.md), [interfaces.md](interfaces.md) | Default `3`; committed baseline semantics for `variantCount = 1` |
| [Prototype Revision Loop](#prototype-revision-loop)                                         | Runs deterministic revision cycle from prompt to manifest append        | [operations.md](operations.md), [workflows.md](workflows.md), [states.md](states.md)   | Single-loop MVP with explicit transitions                        |
| [Annotation and Deterministic Task Synthesis](#annotation-and-deterministic-task-synthesis) | Converts canonical comment events into deterministic mutation tasks     | [domain.md](domain.md), [operations.md](operations.md), [queries.md](queries.md)       | Canonical comment schema and replayable synthesis                |
| [Manual Governance and Apply Control](#manual-governance-and-apply-control)                 | Enforces manual approvals for baseline and apply gates                  | [workflows.md](workflows.md), [states.md](states.md), [TEST-SPEC.md](TEST-SPEC.md)     | Auto-apply forbidden in all MVP paths                            |
| [Newspaper Adapter Compatibility](#newspaper-adapter-compatibility)                         | Reuses newspaper contract shape without runtime dependency              | [domain.md](domain.md), [interfaces.md](interfaces.md), [DECISIONS.md](DECISIONS.md)   | Internal mapper only                                             |
| [Design Artifact Export and Handoff](#design-artifact-export-and-handoff)                   | Produces handoff bundles for UI bridge, tests, and implementation       | [queries.md](queries.md), [UI-SPEC.md](UI-SPEC.md), [TEST-SPEC.md](TEST-SPEC.md)       | Capability-aware downstream readiness                            |

### Component Reuse Registry

Maintains deterministic component metadata used during prototype generation and revision apply.

| Aspect | Concept                                               | Summary                                            |
| ------ | ----------------------------------------------------- | -------------------------------------------------- |
| Domain | [PrototypeVariant](domain.md#prototypevariant)        | Records `componentsUsed` for each generated option |
| Query  | [ListSessionVariants](queries.md#listsessionvariants) | Exposes variant metadata for review surfaces       |
| UI     | [Component Inventory](UI-SPEC.md#component-inventory) | Defines bounded studio surfaces and controls       |

### Variant Generation and Baseline Gate

Defines bounded variant generation and baseline gate semantics.

| Aspect    | Concept                                                        | Summary                                                                                |
| --------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Operation | [GenerateVariants](operations.md#generatevariants)             | Emits exactly `variantCount` HTML-first candidates                                     |
| Operation | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline) | Enforces explicit select for `variantCount > 1`; committed path for `variantCount = 1` |
| State     | [StudioSessionState](states.md#studiosessionstate)             | Captures `VariantsReady -> BaselineReady` guards                                       |

### Prototype Revision Loop

Owns the deterministic sequence from prompt capture through revision manifest append.

| Aspect    | Concept                                                               | Summary                                            |
| --------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| Workflow  | [MVPStudioIterationWorkflow](workflows.md#mvpstudioiterationworkflow) | Canonical MVP orchestration                        |
| Operation | [ApplyApprovedBatch](operations.md#applyapprovedbatch)                | Applies approved mutation batch to active baseline |
| Query     | [ListRevisionManifest](queries.md#listrevisionmanifest)               | Exposes immutable revision evidence                |

### Annotation and Deterministic Task Synthesis

Defines canonical comment schema and deterministic task conversion behavior.

| Aspect    | Concept                                                          | Summary                                                            |
| --------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| Domain    | [CommentEvent](domain.md#commentevent)                           | Canonical comment payload (`target`, `severity`, `intent`, `note`) |
| Operation | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch) | Deterministic batch generation from ordered comments               |
| Query     | [GetDraftMutationBatch](queries.md#getdraftmutationbatch)        | Review payload before approval                                     |

### Manual Governance and Apply Control

Defines mandatory gate checks and manual approvals.

| Aspect     | Concept                                                     | Summary                                            |
| ---------- | ----------------------------------------------------------- | -------------------------------------------------- |
| Policy     | [GovernanceGatePolicy](workflows.md#governancegatepolicy)   | Applies baseline and approval gates                |
| Operation  | [ApproveMutationBatch](operations.md#approvemutationbatch)  | Explicit approval transition (`draft -> approved`) |
| Invariants | [Governance and Invariants](#governance-and-invariants-mvp) | Auto-apply forbidden and audited                   |

### Newspaper Adapter Compatibility

Preserves reusable contract shape without runtime imports.

| Aspect    | Concept                                                                               | Summary                                   |
| --------- | ------------------------------------------------------------------------------------- | ----------------------------------------- |
| Interface | [NewspaperContractAdapter](interfaces.md#internal-newspapercontractadapter-interface) | Internal mapping boundary only            |
| Domain    | [MutationBatch](domain.md#mutationbatch)                                              | Contract-compatible mutation bundle       |
| Decision  | [Locked MVP decisions](DECISIONS.md#locked-mvp-decisions-d-001-d-007)                 | D-007 forbids runtime dependency coupling |

### Design Artifact Export and Handoff

Publishes deterministic handoff artifacts for downstream stages.

| Aspect | Concept                                                                 | Summary                                             |
| ------ | ----------------------------------------------------------------------- | --------------------------------------------------- |
| Query  | [GetHandoffBundle](queries.md#gethandoffbundle)                         | Produces UI/test/implementation contract references |
| UI     | [Route Table](UI-SPEC.md#route-table)                                   | Captures route and interaction obligations          |
| Tests  | [Contract Obligations Matrix](TEST-SPEC.md#contract-obligations-matrix) | Bridges stories, FRs, ACs, and evidence             |

## Domain Concepts

| Concept                                                  | Type          | Key Constraints                                                             |
| -------------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| [StudioSession](domain.md#studiosession)                 | Entity        | Persists `variantCount`, baseline provenance, revision head, and gate state |
| [PrototypeVariant](domain.md#prototypevariant)           | Entity        | Exactly one row per generated candidate in current cycle                    |
| [CommentEvent](domain.md#commentevent)                   | Entity        | Must conform to canonical schema and severity enum                          |
| [MutationBatch](domain.md#mutationbatch)                 | Entity        | Starts as `draft`; requires explicit approval before apply                  |
| [RevisionManifestEntry](domain.md#revisionmanifestentry) | Entity        | One append-only record per successful apply                                 |
| [VariantCount](domain.md#variantcount)                   | Value Object  | Allowed values `{1,2,3}`; session default `3`                               |
| [BaselineProvenance](domain.md#baselineprovenance)       | Value Object  | Mode must be `selected` or `committed`                                      |
| [StudioSessionState](states.md#studiosessionstate)       | State Machine | Governs deterministic loop transitions                                      |

## Concept Registry

| Concept                                                                                 | ID                                               | Type          | Source                                                                      |
| --------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------- | --------------------------------------------------------------------------- |
| [StudioSession](domain.md#studiosession)                                                | ui-prototyping-studio.StudioSession              | Entity        | [domain.md](domain.md#studiosession)                                        |
| [PrototypeVariant](domain.md#prototypevariant)                                          | ui-prototyping-studio.PrototypeVariant           | Entity        | [domain.md](domain.md#prototypevariant)                                     |
| [CommentEvent](domain.md#commentevent)                                                  | ui-prototyping-studio.CommentEvent               | Entity        | [domain.md](domain.md#commentevent)                                         |
| [MutationBatch](domain.md#mutationbatch)                                                | ui-prototyping-studio.MutationBatch              | Entity        | [domain.md](domain.md#mutationbatch)                                        |
| [RevisionManifestEntry](domain.md#revisionmanifestentry)                                | ui-prototyping-studio.RevisionManifestEntry      | Entity        | [domain.md](domain.md#revisionmanifestentry)                                |
| [VariantCount](domain.md#variantcount)                                                  | ui-prototyping-studio.VariantCount               | Value Object  | [domain.md](domain.md#variantcount)                                         |
| [AnnotationTarget](domain.md#annotationtarget)                                          | ui-prototyping-studio.AnnotationTarget           | Value Object  | [domain.md](domain.md#annotationtarget)                                     |
| [MutationTask](domain.md#mutationtask)                                                  | ui-prototyping-studio.MutationTask               | Value Object  | [domain.md](domain.md#mutationtask)                                         |
| [BaselineProvenance](domain.md#baselineprovenance)                                      | ui-prototyping-studio.BaselineProvenance         | Value Object  | [domain.md](domain.md#baselineprovenance)                                   |
| [DiffSummary](domain.md#diffsummary)                                                    | ui-prototyping-studio.DiffSummary                | Value Object  | [domain.md](domain.md#diffsummary)                                          |
| [CommentSeverity](domain.md#commentseverity)                                            | ui-prototyping-studio.CommentSeverity            | Enum          | [domain.md](domain.md#commentseverity)                                      |
| [MutationBatchStatus](domain.md#mutationbatchstatus)                                    | ui-prototyping-studio.MutationBatchStatus        | Enum          | [domain.md](domain.md#mutationbatchstatus)                                  |
| [GateState](domain.md#gatestate)                                                        | ui-prototyping-studio.GateState                  | Enum          | [domain.md](domain.md#gatestate)                                            |
| [InitializeSession](operations.md#initializesession)                                    | ui-prototyping-studio.InitializeSession          | Operation     | [operations.md](operations.md#initializesession)                            |
| [SubmitPrompt](operations.md#submitprompt)                                              | ui-prototyping-studio.SubmitPrompt               | Operation     | [operations.md](operations.md#submitprompt)                                 |
| [GenerateVariants](operations.md#generatevariants)                                      | ui-prototyping-studio.GenerateVariants           | Operation     | [operations.md](operations.md#generatevariants)                             |
| [SelectOrCommitBaseline](operations.md#selectorcommitbaseline)                          | ui-prototyping-studio.SelectOrCommitBaseline     | Operation     | [operations.md](operations.md#selectorcommitbaseline)                       |
| [CaptureCommentEvent](operations.md#capturecommentevent)                                | ui-prototyping-studio.CaptureCommentEvent        | Operation     | [operations.md](operations.md#capturecommentevent)                          |
| [SynthesizeMutationBatch](operations.md#synthesizemutationbatch)                        | ui-prototyping-studio.SynthesizeMutationBatch    | Operation     | [operations.md](operations.md#synthesizemutationbatch)                      |
| [ApproveMutationBatch](operations.md#approvemutationbatch)                              | ui-prototyping-studio.ApproveMutationBatch       | Operation     | [operations.md](operations.md#approvemutationbatch)                         |
| [ApplyApprovedBatch](operations.md#applyapprovedbatch)                                  | ui-prototyping-studio.ApplyApprovedBatch         | Operation     | [operations.md](operations.md#applyapprovedbatch)                           |
| [ExportDesignHandoff](operations.md#exportdesignhandoff)                                | ui-prototyping-studio.ExportDesignHandoff        | Operation     | [operations.md](operations.md#exportdesignhandoff)                          |
| [GetSessionSnapshot](queries.md#getsessionsnapshot)                                     | ui-prototyping-studio.GetSessionSnapshot         | Query         | [queries.md](queries.md#getsessionsnapshot)                                 |
| [ListSessionVariants](queries.md#listsessionvariants)                                   | ui-prototyping-studio.ListSessionVariants        | Query         | [queries.md](queries.md#listsessionvariants)                                |
| [GetDraftMutationBatch](queries.md#getdraftmutationbatch)                               | ui-prototyping-studio.GetDraftMutationBatch      | Query         | [queries.md](queries.md#getdraftmutationbatch)                              |
| [ListRevisionManifest](queries.md#listrevisionmanifest)                                 | ui-prototyping-studio.ListRevisionManifest       | Query         | [queries.md](queries.md#listrevisionmanifest)                               |
| [GetHandoffBundle](queries.md#gethandoffbundle)                                         | ui-prototyping-studio.GetHandoffBundle           | Query         | [queries.md](queries.md#gethandoffbundle)                                   |
| [UIPrototypingStudioAPI](interfaces.md#external-uiprototypingstudioapi-rest)            | ui-prototyping-studio.UIPrototypingStudioAPI     | Interface     | [interfaces.md](interfaces.md#external-uiprototypingstudioapi-rest)         |
| [StudioOrchestrationModule](interfaces.md#internal-studioorchestrationmodule-interface) | ui-prototyping-studio.StudioOrchestrationModule  | Interface     | [interfaces.md](interfaces.md#internal-studioorchestrationmodule-interface) |
| [NewspaperContractAdapter](interfaces.md#internal-newspapercontractadapter-interface)   | ui-prototyping-studio.NewspaperContractAdapter   | Interface     | [interfaces.md](interfaces.md#internal-newspapercontractadapter-interface)  |
| [MVPStudioIterationWorkflow](workflows.md#mvpstudioiterationworkflow)                   | ui-prototyping-studio.MVPStudioIterationWorkflow | Workflow      | [workflows.md](workflows.md#mvpstudioiterationworkflow)                     |
| [GovernanceGatePolicy](workflows.md#governancegatepolicy)                               | ui-prototyping-studio.GovernanceGatePolicy       | Policy        | [workflows.md](workflows.md#governancegatepolicy)                           |
| [StudioSessionState](states.md#studiosessionstate)                                      | ui-prototyping-studio.StudioSessionState         | State Machine | [states.md](states.md#studiosessionstate)                                   |
| [StudioWorkbenchPage](UI-SPEC.md#ui-concept-registry)                                   | ui-prototyping-studio.StudioWorkbenchPage        | Page          | [UI-SPEC.md](UI-SPEC.md#ui-concept-registry)                                |
| [VariantCanvas](UI-SPEC.md#ui-concept-registry)                                         | ui-prototyping-studio.VariantCanvas              | Component     | [UI-SPEC.md](UI-SPEC.md#ui-concept-registry)                                |
| [AnnotationPanel](UI-SPEC.md#ui-concept-registry)                                       | ui-prototyping-studio.AnnotationPanel            | Component     | [UI-SPEC.md](UI-SPEC.md#ui-concept-registry)                                |
| [MutationApprovalPanel](UI-SPEC.md#ui-concept-registry)                                 | ui-prototyping-studio.MutationApprovalPanel      | Component     | [UI-SPEC.md](UI-SPEC.md#ui-concept-registry)                                |

## Feature Concept Graph

| From                                         | Edge    | To                                           | Evidence                                           | Notes                           |
| -------------------------------------------- | ------- | -------------------------------------------- | -------------------------------------------------- | ------------------------------- |
| ui-prototyping-studio.GetSessionSnapshot     | queries | ui-prototyping-studio.StudioSession          | queries.md#getsessionsnapshot                      | Current loop state              |
| ui-prototyping-studio.ListSessionVariants    | queries | ui-prototyping-studio.PrototypeVariant       | queries.md#listsessionvariants                     | Candidate review data           |
| ui-prototyping-studio.UIPrototypingStudioAPI | exposes | ui-prototyping-studio.InitializeSession      | interfaces.md#external-uiprototypingstudioapi-rest | Session initialization endpoint |
| ui-prototyping-studio.UIPrototypingStudioAPI | exposes | ui-prototyping-studio.SubmitPrompt           | interfaces.md#external-uiprototypingstudioapi-rest | Prompt submission endpoint      |
| ui-prototyping-studio.UIPrototypingStudioAPI | exposes | ui-prototyping-studio.GenerateVariants       | interfaces.md#external-uiprototypingstudioapi-rest | Variant generation endpoint     |
| ui-prototyping-studio.UIPrototypingStudioAPI | exposes | ui-prototyping-studio.SelectOrCommitBaseline | interfaces.md#external-uiprototypingstudioapi-rest | Baseline selection endpoint     |
| ui-prototyping-studio.UIPrototypingStudioAPI | exposes | ui-prototyping-studio.GetSessionSnapshot     | interfaces.md#external-uiprototypingstudioapi-rest | Session snapshot endpoint       |
| ui-prototyping-studio.UIPrototypingStudioAPI | exposes | ui-prototyping-studio.ListSessionVariants    | interfaces.md#external-uiprototypingstudioapi-rest | Session variants endpoint       |

### Deferred Feature Concept Graph (Post WP-01)

These concept edges remain authoritative roadmap intent, but are deferred from strict code-tag drift closure until their corresponding work-pack tasks are implemented.

| From                                             | Edge         | To                                               | Evidence                                                   | Notes                                           |
| ------------------------------------------------ | ------------ | ------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------- |
| ui-prototyping-studio.InitializeSession          | enforces     | ui-prototyping-studio.VariantCount               | operations.md#initializesession                            | Validates range `1..3`, applies default `3`     |
| ui-prototyping-studio.SubmitPrompt               | transitions  | ui-prototyping-studio.StudioSessionState         | operations.md#submitprompt                                 | Moves session to prompt-captured state          |
| ui-prototyping-studio.GenerateVariants           | produces     | ui-prototyping-studio.PrototypeVariant           | operations.md#generatevariants                             | Emits exactly `variantCount` candidates         |
| ui-prototyping-studio.SelectOrCommitBaseline     | transitions  | ui-prototyping-studio.StudioSessionState         | operations.md#selectorcommitbaseline                       | Resolves baseline gate by select or commit      |
| ui-prototyping-studio.CaptureCommentEvent        | produces     | ui-prototyping-studio.CommentEvent               | operations.md#capturecommentevent                          | Canonical schema enforced                       |
| ui-prototyping-studio.SynthesizeMutationBatch    | produces     | ui-prototyping-studio.MutationBatch              | operations.md#synthesizemutationbatch                      | Deterministic draft batch generation            |
| ui-prototyping-studio.ApproveMutationBatch       | transitions  | ui-prototyping-studio.MutationBatchStatus        | operations.md#approvemutationbatch                         | Explicit manual approval                        |
| ui-prototyping-studio.ApplyApprovedBatch         | produces     | ui-prototyping-studio.RevisionManifestEntry      | operations.md#applyapprovedbatch                           | One append-only revision entry per apply        |
| ui-prototyping-studio.ExportDesignHandoff        | exposes      | ui-prototyping-studio.GetHandoffBundle           | operations.md#exportdesignhandoff                          | Handoff payload for downstream stages           |
| ui-prototyping-studio.GetDraftMutationBatch      | queries      | ui-prototyping-studio.MutationBatch              | queries.md#getdraftmutationbatch                           | Pending approval payload                        |
| ui-prototyping-studio.ListRevisionManifest       | queries      | ui-prototyping-studio.RevisionManifestEntry      | queries.md#listrevisionmanifest                            | Immutable revision evidence                     |
| ui-prototyping-studio.GetHandoffBundle           | queries      | ui-prototyping-studio.RevisionManifestEntry      | queries.md#gethandoffbundle                                | Includes baseline provenance and contract links |
| ui-prototyping-studio.UIPrototypingStudioAPI     | exposes      | ui-prototyping-studio.ApplyApprovedBatch         | interfaces.md#external-uiprototypingstudioapi-rest         | Apply endpoint with manual gates                |
| ui-prototyping-studio.StudioOrchestrationModule  | exposes      | ui-prototyping-studio.MVPStudioIterationWorkflow | interfaces.md#internal-studioorchestrationmodule-interface | Internal orchestration boundary                 |
| ui-prototyping-studio.NewspaperContractAdapter   | maps         | ui-prototyping-studio.CommentEvent               | interfaces.md#internal-newspapercontractadapter-interface  | Adapter-only compatibility                      |
| ui-prototyping-studio.NewspaperContractAdapter   | maps         | ui-prototyping-studio.MutationBatch              | interfaces.md#internal-newspapercontractadapter-interface  | Adapter-only compatibility                      |
| ui-prototyping-studio.NewspaperContractAdapter   | maps         | ui-prototyping-studio.RevisionManifestEntry      | interfaces.md#internal-newspapercontractadapter-interface  | Adapter-only compatibility                      |
| ui-prototyping-studio.MVPStudioIterationWorkflow | orchestrates | ui-prototyping-studio.ApplyApprovedBatch         | workflows.md#mvpstudioiterationworkflow                    | Deterministic loop orchestration                |
| ui-prototyping-studio.GovernanceGatePolicy       | enforces     | ui-prototyping-studio.ApplyApprovedBatch         | workflows.md#governancegatepolicy                          | Baseline + approval gates                       |
| ui-prototyping-studio.StudioSessionState         | enforces     | ui-prototyping-studio.VariantCount               | states.md#invariants                                       | Variant count invariant across all states       |
| ui-prototyping-studio.StudioWorkbenchPage        | renders      | ui-prototyping-studio.VariantCanvas              | UI-SPEC.md#page-layouts                                    | Candidate review surface                        |
| ui-prototyping-studio.StudioWorkbenchPage        | renders      | ui-prototyping-studio.AnnotationPanel            | UI-SPEC.md#page-layouts                                    | Element comment capture                         |
| ui-prototyping-studio.StudioWorkbenchPage        | renders      | ui-prototyping-studio.MutationApprovalPanel      | UI-SPEC.md#page-layouts                                    | Manual approval surface                         |

## Aspect Docs

| Aspect                             | Contains                                           | Key Concepts                                                  |
| ---------------------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| [Glossary](glossary.md)            | Distilled definitions for feature concepts         | StudioSession, MutationBatch, GovernanceGatePolicy            |
| [Domain](domain.md)                | Entities, value objects, enums                     | StudioSession, MutationBatch, RevisionManifestEntry           |
| [Operations](operations.md)        | Mutations, rules, calculations                     | GenerateVariants, SynthesizeMutationBatch, ApplyApprovedBatch |
| [Queries](queries.md)              | Read models and handoff outputs                    | GetSessionSnapshot, GetHandoffBundle                          |
| [Interfaces](interfaces.md)        | External and internal API boundaries               | UIPrototypingStudioAPI, NewspaperContractAdapter              |
| [Workflows](workflows.md)          | Iteration orchestration and governance policies    | MVPStudioIterationWorkflow, GovernanceGatePolicy              |
| [States](states.md)                | Session lifecycle transitions and invariants       | StudioSessionState                                            |
| [UI Specification](UI-SPEC.md)     | Route, layout, interaction, accessibility contract | StudioWorkbenchPage, VariantCanvas                            |
| [Test Specification](TEST-SPEC.md) | Spec-level test obligations and coverage matrix    | FR/AC coverage, workflow and state obligations                |
| [Decisions](DECISIONS.md)          | Locked decisions and open design questions         | D-001..D-007                                                  |
| [Tasks](TASKS.md)                  | Design/planning tasks for handoff readiness        | Documentation and governance work-plan                        |

## Cross-Feature Dependencies

| Capability                          | Depends On                                                                                                                          | Via                                                                          | Why                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Design Artifact Export and Handoff  | [knowledge-graph-visualization.SPEC-Level Feature Atlas](../knowledge-graph-visualization/SPEC.md#spec-level-feature-atlas)         | [Feature Concept Graph](#feature-concept-graph) export rows                  | Keeps published relationships visible in cross-feature whiteboard navigation |
| Manual Governance and Apply Control | [knowledge-graph-visualization.Aspect Whiteboard Navigation](../knowledge-graph-visualization/SPEC.md#aspect-whiteboard-navigation) | [DECISIONS.md](DECISIONS.md) and [TEST-SPEC.md](TEST-SPEC.md) evidence links | Preserves reviewable governance evidence in docs navigation flows            |

## Produces For

| Consumer                                                                  | Consumes Capability                  | Via                                                      | What                                                           |
| ------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------- |
| `domainspec-ui-phase-bridge`                                              | Design Artifact Export and Handoff   | [GetHandoffBundle](queries.md#gethandoffbundle)          | Route/interaction/state obligations for UI contract derivation |
| `domainspec-generate-tests --ui`                                          | Manual Governance and Apply Control  | [TEST-SPEC.md](TEST-SPEC.md#contract-obligations-matrix) | Deterministic test obligations mapped to FR/AC/invariants      |
| `domainspec-ui-implement`                                                 | Variant Generation and Baseline Gate | [UI-SPEC.md](UI-SPEC.md)                                 | Implementation contract for gated prototype loop               |
| [knowledge-graph-visualization](../knowledge-graph-visualization/SPEC.md) | Design Artifact Export and Handoff   | [Feature Concept Graph](#feature-concept-graph)          | Feature edge evidence for concept graph projection             |

## MVP Design Contract

### Information Architecture

| Surface                | Primary Purpose                                   | Owned Data                                                                                                        |
| ---------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Session Controls       | Capture prompt and set `variantCount`             | [StudioSession](domain.md#studiosession), [VariantCount](domain.md#variantcount)                                  |
| Variant Review Surface | Show generated candidates and metadata            | [PrototypeVariant](domain.md#prototypevariant), [ListSessionVariants](queries.md#listsessionvariants)             |
| Annotation Panel       | Capture canonical element-level comments          | [CommentEvent](domain.md#commentevent), [CaptureCommentEvent](operations.md#capturecommentevent)                  |
| Mutation Review Panel  | Present deterministic draft tasks before approval | [MutationBatch](domain.md#mutationbatch), [GetDraftMutationBatch](queries.md#getdraftmutationbatch)               |
| Revision Timeline      | Display immutable revision history                | [RevisionManifestEntry](domain.md#revisionmanifestentry), [ListRevisionManifest](queries.md#listrevisionmanifest) |
| Handoff Summary        | Publish downstream-ready links and evidence       | [GetHandoffBundle](queries.md#gethandoffbundle), [ExportDesignHandoff](operations.md#exportdesignhandoff)         |

### Interaction Model

1. Initialize session with `variantCount` in `1..3` (default `3`).
2. Submit prompt and generate exactly `variantCount` HTML-first variants.
3. Resolve baseline gate:
   - `variantCount > 1`: explicit selection is mandatory.
   - `variantCount = 1`: baseline is marked `committed`.
4. Capture canonical comments on active baseline.
5. Synthesize deterministic draft mutation batch.
6. Require explicit human approval.
7. Apply approved batch and append one manifest entry.
8. Repeat iteration or export handoff bundle.

### Visual and Design-System Constraints (MVP)

| Constraint                   | Contract                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Studio surface stack         | D-001: use `shadcn/ui` + `Radix` + `Tailwind` only for studio surfaces ([DECISIONS.md](DECISIONS.md#locked-mvp-decisions-d-001-d-007))    |
| Prototype output shape       | D-002: output remains HTML-first in MVP ([DECISIONS.md](DECISIONS.md#locked-mvp-decisions-d-001-d-007))                                   |
| Variant exploration bounds   | D-006: `variantCount` is `1..3`, default `3`, committed semantics for `1` ([DECISIONS.md](DECISIONS.md#locked-mvp-decisions-d-001-d-007)) |
| Auto-apply prohibition       | D-005: manual gate required for selection/apply ([DECISIONS.md](DECISIONS.md#locked-mvp-decisions-d-001-d-007))                           |
| Newspaper runtime decoupling | D-007: adapter pattern only, no runtime dependency ([DECISIONS.md](DECISIONS.md#locked-mvp-decisions-d-001-d-007))                        |

### Accessibility Constraints (MVP)

| Area                | Constraint                                                                         |
| ------------------- | ---------------------------------------------------------------------------------- |
| Keyboard navigation | Variant cards, comment targets, and approval actions are keyboard reachable        |
| Form semantics      | Comment form fields expose explicit labels and severity selection semantics        |
| Focus management    | Selection and approval transitions preserve visible focus and announce gate status |
| Color and contrast  | Severity and gate states must remain distinguishable without color-only cues       |

### Performance Constraints (MVP)

| Area                | Constraint                                                                         |
| ------------------- | ---------------------------------------------------------------------------------- |
| Variant generation  | Bounded to max `3` variants per cycle to keep deterministic latency envelope       |
| Task synthesis      | Deterministic and replayable for identical ordered comments                        |
| Manifest operations | Append-only writes with one entry per successful apply                             |
| Session resume      | Snapshot query returns current gate and revision state without recomputation drift |

### Security Constraints (MVP)

| Area                | Constraint                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| Input handling      | Prompt and comment note fields are sanitized before persistence and render |
| Approval authority  | Approval identity and timestamp are required to apply mutation batches     |
| Gate enforcement    | Apply operation rejects stale or unapproved batches                        |
| Dependency boundary | Runtime/module graph must not include newspaper runtime imports            |

## Functional Requirements (MVP)

| ID     | Requirement                                                                                                                                                                |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | Session initialization MUST accept `variantCount` only in `1..3`; omitted value defaults to `3`.                                                                           |
| FR-002 | Prompt submission MUST create or update the active session prompt and transition to variant generation.                                                                    |
| FR-003 | Variant generation MUST emit exactly `variantCount` HTML-first options plus metadata: `componentsUsed`, `rationale`, `tradeoffs`, `risk`.                                  |
| FR-004 | When `variantCount > 1`, system MUST block comment/task/apply stages until user selects one baseline option.                                                               |
| FR-005 | When `variantCount = 1`, system MUST mark baseline as `committed` and satisfy selection gate without additional choice input.                                              |
| FR-006 | Comment capture MUST validate canonical schema `{ target, severity, intent, note }` with severity enum `blocker/high/medium/low`.                                          |
| FR-007 | Task synthesis MUST be deterministic for identical ordered comment events and active baseline revision.                                                                    |
| FR-008 | Synthesized mutation batch MUST enter `draft` status and require explicit human approval before apply.                                                                     |
| FR-009 | Apply operation MUST be rejected when batch approval is absent or stale relative to current revision head.                                                                 |
| FR-010 | Approved apply MUST produce a new revision, immutable diff summary, and updated revision head pointer.                                                                     |
| FR-011 | Revision manifest MUST append one entry per successful apply including `variantCount` and baseline provenance (`selected` or `committed`).                                 |
| FR-012 | System MUST forbid auto-apply in all MVP states.                                                                                                                           |
| FR-013 | Session payload MUST persist `variantCount`, active baseline label, latest revision, and gate state for resume/traceability.                                               |
| FR-014 | Newspaper compatibility MUST be implemented as an internal adapter mapper with no runtime dependency import.                                                               |
| FR-015 | Session and revision artifacts MUST expose integration-ready references for `domainspec-ui-phase-bridge`, `domainspec-generate-tests --ui`, and `domainspec-ui-implement`. |

## Acceptance Criteria (MVP)

| ID     | Testable Check                                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| AC-001 | Creating a session without `variantCount` persists `variantCount = 3`.                                                |
| AC-002 | Inputs `variantCount = 0` and `variantCount = 4` are rejected with validation error.                                  |
| AC-003 | For `variantCount = 3`, apply attempt before baseline selection is blocked with gate error.                           |
| AC-004 | For `variantCount = 1`, baseline is auto-committed and selection gate is marked satisfied.                            |
| AC-005 | Comment missing any required field in `{target,severity,intent,note}` is rejected.                                    |
| AC-006 | Re-running task synthesis on identical ordered comments yields identical task IDs and payload.                        |
| AC-007 | Applying a `draft` batch without explicit approval is rejected.                                                       |
| AC-008 | Applying an approved batch creates next revision and appends one manifest entry.                                      |
| AC-009 | Manifest entry includes `variantCount` and baseline provenance (`selected` or `committed`).                           |
| AC-010 | Runtime dependency scan shows no newspaper runtime dependency in MVP execution path.                                  |
| AC-011 | Session payload includes integration readiness fields for UI phase bridge, UI test generation, and UI implementation. |

## Governance and Invariants (MVP)

| ID      | Invariant                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| INV-001 | `variantCount` MUST remain in `{1,2,3}` for all session states.                                               |
| INV-002 | New session default is `variantCount = 3` unless explicitly overridden for that run.                          |
| INV-003 | When `variantCount > 1`, `ApplyApprovedBatch` is forbidden before explicit baseline selection.                |
| INV-004 | When `variantCount = 1`, baseline mode MUST be `committed` and selection gate is considered satisfied.        |
| INV-005 | Mutation batches start as `draft`; only manual approval can transition to `approved`.                         |
| INV-006 | Auto-apply is forbidden in MVP (`approved` is necessary but still manually triggered).                        |
| INV-007 | Every successful apply MUST append exactly one revision manifest entry.                                       |
| INV-008 | Newspaper compatibility is adapter-only; runtime dependency graph MUST not include newspaper runtime modules. |

## Traceability Matrix (Stories -> FR -> AC -> Aspect Evidence)

| Story                                                                                     | FR Coverage            | AC Coverage            | Aspect Evidence                                                                                                                                                               |
| ----------------------------------------------------------------------------------------- | ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [US-001 Prompt To Candidate Variants](STORIES.md#us-001-prompt-to-candidate-variants)     | FR-001, FR-002, FR-003 | AC-001, AC-002         | [InitializeSession](operations.md#initializesession), [GenerateVariants](operations.md#generatevariants), [ListSessionVariants](queries.md#listsessionvariants)               |
| [US-002 Human Baseline Selection](STORIES.md#us-002-human-baseline-selection)             | FR-004, FR-005         | AC-003, AC-004         | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline), [StudioSessionState](states.md#studiosessionstate)                                                            |
| [US-003 Element-Level Commenting](STORIES.md#us-003-element-level-commenting)             | FR-006                 | AC-005                 | [CaptureCommentEvent](operations.md#capturecommentevent), [CommentEvent](domain.md#commentevent), [Form and Selection Contracts](UI-SPEC.md#form-and-selection-contracts)     |
| [US-004 Deterministic Task Synthesis](STORIES.md#us-004-deterministic-task-synthesis)     | FR-007, FR-008         | AC-006                 | [SynthesizeMutationBatch](operations.md#synthesizemutationbatch), [GetDraftMutationBatch](queries.md#getdraftmutationbatch)                                                   |
| [US-005 Manual Apply Gate](STORIES.md#us-005-manual-apply-gate)                           | FR-008, FR-009, FR-012 | AC-007                 | [ApproveMutationBatch](operations.md#approvemutationbatch), [ApplyApprovedBatch](operations.md#applyapprovedbatch), [GovernanceGatePolicy](workflows.md#governancegatepolicy) |
| [US-006 Revision Manifest Traceability](STORIES.md#us-006-revision-manifest-traceability) | FR-010, FR-011, FR-013 | AC-008, AC-009, AC-011 | [ApplyApprovedBatch](operations.md#applyapprovedbatch), [ListRevisionManifest](queries.md#listrevisionmanifest), [RevisionManifestEntry](domain.md#revisionmanifestentry)     |
| [US-007 Single-Variant Committed Path](STORIES.md#us-007-single-variant-committed-path)   | FR-005, FR-011         | AC-004, AC-009         | [SelectOrCommitBaseline](operations.md#selectorcommitbaseline), [BaselineProvenance](domain.md#baselineprovenance), [Transition Table](states.md#transition-table)            |

## Stories

See [STORIES.md](STORIES.md) for capability-scoped user journeys and coverage links.

## References

- [DISCOVERY.md](DISCOVERY.md)
- [glossary.md](glossary.md)
- [inventory/README.md](inventory/README.md)
- [UI-SPEC.md](UI-SPEC.md)
- [TEST-SPEC.md](TEST-SPEC.md)
- [DECISIONS.md](DECISIONS.md)
- [TASKS.md](TASKS.md)
