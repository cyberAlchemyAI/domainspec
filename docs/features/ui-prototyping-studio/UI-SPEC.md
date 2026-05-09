---
id: ui-prototyping-studio-ui
feature: ui-prototyping-studio
title: "UI Prototyping Studio UI Specification"
summary: Studio workbench for bounded variant generation, annotation, approval-gated mutation apply, and design handoff.
status: draft
pillar: platform
domain: ui-prototyping-studio-ui
audience:
  - developers
priority: p1
lang: en
owners:
  - web-core
updatedAt: 2026-05-07
dependencies:
  - SPEC.md
  - domain.md
  - interfaces.md
  - operations.md
  - queries.md
  - states.md
  - workflows.md
includes: []
constitution: docs/UI-ARCHITECTURE.md
---

# UI Specification: UI Prototyping Studio

> Governs the frontend presentation of session controls, variant review, annotation capture, mutation approval, revision evidence, and handoff summary.
> Constrained by [UI-ARCHITECTURE.md](../../UI-ARCHITECTURE.md).

## Capability Backlinks

- [Variant Generation and Baseline Gate](SPEC.md#variant-generation-and-baseline-gate)
- [Prototype Revision Loop](SPEC.md#prototype-revision-loop)
- [Annotation and Deterministic Task Synthesis](SPEC.md#annotation-and-deterministic-task-synthesis)
- [Manual Governance and Apply Control](SPEC.md#manual-governance-and-apply-control)
- [Design Artifact Export and Handoff](SPEC.md#design-artifact-export-and-handoff)

## Route Table

| Route                    | Page Title            | Layout                | Auth Required | Permission                     |
| ------------------------ | --------------------- | --------------------- | ------------- | ------------------------------ |
| `/ui-prototyping-studio` | UI Prototyping Studio | StudioWorkbenchLayout | Yes           | domainspec.ui-prototyping.read |

### Route Query Parameters

| Parameter    | Type    | Required | Default       | Description                                              |
| ------------ | ------- | -------- | ------------- | -------------------------------------------------------- |
| sessionId    | string  | no       | latest active | Active session                                           |
| variantCount | integer | no       | 3             | Initial variant count for new session                    |
| revisionId   | string  | no       | revision head | Focused revision                                         |
| panel        | string  | no       | variants      | Focus panel (`variants`, `comments`, `tasks`, `handoff`) |

## Page Layouts

### /ui-prototyping-studio (Studio Workbench)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Header: prompt input + variant count selector + session state + baseline badge           │
├───────────────────────┬──────────────────────────────────────┬────────────────────────────┤
│ Session Controls      │ Variant Canvas                       │ Annotation Panel            │
│ - prompt submit       │ - candidate A/B/C HTML previews      │ - target selector           │
│ - variant count 1..3  │ - selected/committed baseline marker │ - severity + intent + note  │
│ - generate action     │ - metadata (rationale/tradeoffs/risk)| - comment stream            │
├───────────────────────┴──────────────────────────────────────┬────────────────────────────┤
│ Mutation Approval Panel                                       │ Revision Timeline           │
│ - draft batch tasks                                           │ - revision manifest rows    │
│ - approve/apply controls                                      │ - diff summary + provenance |
└───────────────────────────────────────────────────────────────┴────────────────────────────┘
```

## Interaction Contract

### Level 1: Session Start and Prompt

1. User opens route and initializes session.
2. User sets `variantCount` (`1..3`) or keeps default `3`.
3. User submits prompt.

### Level 2: Variant Generation and Baseline Resolution

1. UI requests variant generation and renders exactly `variantCount` candidates.
2. If `variantCount > 1`, baseline selection is required before comment/task/apply interactions.
3. If `variantCount = 1`, UI marks baseline as committed and unlocks annotation panel.

### Level 3: Annotation and Synthesis

1. User selects target element and submits canonical comment payload.
2. UI shows ordered comment stream for active revision.
3. User triggers deterministic synthesis to create draft mutation batch.

### Level 4: Manual Approval and Apply

1. User reviews draft tasks and approval metadata.
2. User explicitly approves batch.
3. User explicitly applies approved batch.
4. UI updates revision timeline with one new manifest entry.

### Level 5: Handoff Publication

1. User requests handoff bundle.
2. UI surfaces references for [STORIES.md](STORIES.md), [SPEC.md](SPEC.md), [UI-SPEC.md](UI-SPEC.md), and [TEST-SPEC.md](TEST-SPEC.md).

## Component Inventory

| Component               | Type            | Location (target)                                                         | Purpose                                   |
| ----------------------- | --------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| `StudioWorkbenchLayout` | Layout          | `apps/web/src/layouts/StudioWorkbenchLayout.tsx`                          | Shell for all studio panels               |
| `SessionControlsPanel`  | Component       | `apps/web/src/components/ui-prototyping-studio/SessionControlsPanel.tsx`  | Prompt and variant count controls         |
| `VariantCanvas`         | Component       | `apps/web/src/components/ui-prototyping-studio/VariantCanvas.tsx`         | Candidate preview and baseline indication |
| `AnnotationPanel`       | Component       | `apps/web/src/components/ui-prototyping-studio/AnnotationPanel.tsx`       | Comment capture and stream                |
| `MutationApprovalPanel` | Component       | `apps/web/src/components/ui-prototyping-studio/MutationApprovalPanel.tsx` | Draft review, approve, apply controls     |
| `RevisionTimeline`      | Component       | `apps/web/src/components/ui-prototyping-studio/RevisionTimeline.tsx`      | Manifest history and diff summary         |
| `HandoffSummaryPanel`   | Component       | `apps/web/src/components/ui-prototyping-studio/HandoffSummaryPanel.tsx`   | Downstream handoff links                  |
| `SessionStateIndicator` | State Indicator | `apps/web/src/components/ui-prototyping-studio/SessionStateIndicator.tsx` | Visible state and gate status             |

## Data Flow

### Read Queries

| API Call                                                                    | Hook                      | Cache Key                                 | Trigger                      |
| --------------------------------------------------------------------------- | ------------------------- | ----------------------------------------- | ---------------------------- |
| `GET /api/ui-prototyping-studio/sessions/:sessionId`                        | `useStudioSession()`      | `queryKeys.uiProto.session(sessionId)`    | Route load, mutation success |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/variants`               | `useStudioVariants()`     | `queryKeys.uiProto.variants(sessionId)`   | Variant generation success   |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/draft` | `useDraftMutationBatch()` | `queryKeys.uiProto.draftBatch(sessionId)` | Synthesis success            |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/revisions`              | `useRevisionTimeline()`   | `queryKeys.uiProto.revisions(sessionId)`  | Apply success                |
| `GET /api/ui-prototyping-studio/sessions/:sessionId/handoff`                | `useHandoffBundle()`      | `queryKeys.uiProto.handoff(sessionId)`    | Export success               |

### Mutations

| API Call                                                                                | Hook                     | On Success                                 |
| --------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------ |
| `POST /api/ui-prototyping-studio/sessions`                                              | `useInitializeSession()` | Seed session cache and default panel state |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/prompt`                            | `useSubmitPrompt()`      | Invalidate session snapshot                |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/variants/generate`                 | `useGenerateVariants()`  | Invalidate variants + session              |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/baseline`                          | `useResolveBaseline()`   | Invalidate session + variants              |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/comments`                          | `useCaptureComment()`    | Invalidate draft batch prerequisites       |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/synthesize`       | `useSynthesizeBatch()`   | Invalidate draft batch                     |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/:batchId/approve` | `useApproveBatch()`      | Invalidate draft batch + session           |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/mutation-batches/:batchId/apply`   | `useApplyBatch()`        | Invalidate revisions + session + variants  |
| `POST /api/ui-prototyping-studio/sessions/:sessionId/handoff/export`                    | `useExportHandoff()`     | Invalidate handoff bundle                  |

## Form and Selection Contracts

### SessionControlsForm

| Field        | Type    | HTML Input | Validation                  | Error Message                            |
| ------------ | ------- | ---------- | --------------------------- | ---------------------------------------- |
| prompt       | string  | `textarea` | Required, trimmed non-empty | "Prompt is required."                    |
| variantCount | integer | `select`   | Must be `1`, `2`, or `3`    | "Variant count must be between 1 and 3." |

### AnnotationForm

| Field           | Type   | HTML Input | Validation       | Error Message                  |
| --------------- | ------ | ---------- | ---------------- | ------------------------------ | ------ | ---- | ---------------------- |
| target.selector | string | `text`     | Required         | "Target selector is required." |
| severity        | string | `select`   | Must be `blocker | high                           | medium | low` | "Severity is invalid." |
| intent          | string | `text`     | Required         | "Intent is required."          |
| note            | string | `textarea` | Required         | "Note is required."            |

### BaselineSelectionForm

| Field         | Type   | Validation                                                               |
| ------------- | ------ | ------------------------------------------------------------------------ |
| selectedLabel | string | Required only when `variantCount > 1`; must be in current variant labels |

**Error Code -> UI Message Mapping:**

| API Error Code                | HTTP Status | UI Message                                |
| ----------------------------- | ----------- | ----------------------------------------- |
| `VARIANT_COUNT_OUT_OF_RANGE`  | 422         | "Select a variant count between 1 and 3." |
| `BASELINE_SELECTION_REQUIRED` | 409         | "Select a baseline before continuing."    |
| `COMMENT_SCHEMA_INVALID`      | 422         | "Comment is missing required fields."     |
| `BATCH_APPROVAL_REQUIRED`     | 409         | "Approve the batch before applying."      |
| `AUTO_APPLY_FORBIDDEN`        | 409         | "Auto-apply is not allowed in MVP."       |

## State-to-UI Mapping

| Domain Value         | UI Representation                                          | Color / Variant     |
| -------------------- | ---------------------------------------------------------- | ------------------- |
| `SessionInitialized` | Empty workbench with prompt controls enabled               | neutral / default   |
| `PromptCaptured`     | Prompt locked for generation run                           | info / subtle       |
| `VariantsReady`      | Variant canvas active; baseline badge pending or committed | warning / outline   |
| `BaselineReady`      | Annotation panel enabled                                   | success / default   |
| `MutationDrafted`    | Mutation panel shows draft tasks                           | warning / outline   |
| `MutationApproved`   | Apply action enabled                                       | success / default   |
| `RevisionRecorded`   | Revision timeline appends new row                          | info / default      |
| `SessionCompleted`   | Workbench read-only with handoff panel highlighted         | neutral / secondary |

## Accessibility Requirements

| Component               | Requirement                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| `SessionControlsPanel`  | All inputs and actions are keyboard reachable with visible focus state        |
| `VariantCanvas`         | Candidate cards expose baseline status via `aria-label` and text              |
| `AnnotationPanel`       | Form controls use explicit labels and error messaging with `aria-describedby` |
| `MutationApprovalPanel` | Approve/apply buttons expose disabled reasons when gated                      |
| `RevisionTimeline`      | Uses semantic table/list structure for screen-reader ordering                 |
| `SessionStateIndicator` | Announces state changes with `aria-live="polite"`                             |

## Performance Constraints

| Area              | Constraint                                                               |
| ----------------- | ------------------------------------------------------------------------ |
| Initial load      | Render baseline layout before async query hydration                      |
| Variant rendering | At most three candidates rendered simultaneously                         |
| Mutation updates  | Draft and revision panels update incrementally without full-page refresh |
| History rendering | Revision timeline paginates when entry count exceeds default query limit |

## Security Constraints

| Area                     | Constraint                                                    |
| ------------------------ | ------------------------------------------------------------- |
| Prompt/comment rendering | Escape untrusted text before HTML render in workbench panels  |
| Approval actions         | Require authenticated actor and anti-replay request semantics |
| Apply actions            | Enforce server-side gate checks independent from UI state     |
| Export actions           | Return only session-scoped artifacts and references           |

## UI Concept Registry

| Concept                  | ID                                          | Type            |
| ------------------------ | ------------------------------------------- | --------------- |
| `/ui-prototyping-studio` | ui-prototyping-studio.StudioWorkbenchPage   | Page            |
| `StudioWorkbenchLayout`  | ui-prototyping-studio.StudioWorkbenchLayout | Layout          |
| `SessionControlsPanel`   | ui-prototyping-studio.SessionControlsPanel  | Component       |
| `VariantCanvas`          | ui-prototyping-studio.VariantCanvas         | Component       |
| `AnnotationPanel`        | ui-prototyping-studio.AnnotationPanel       | Component       |
| `MutationApprovalPanel`  | ui-prototyping-studio.MutationApprovalPanel | Component       |
| `RevisionTimeline`       | ui-prototyping-studio.RevisionTimeline      | Component       |
| `HandoffSummaryPanel`    | ui-prototyping-studio.HandoffSummaryPanel   | Component       |
| `SessionStateIndicator`  | ui-prototyping-studio.SessionStateIndicator | State Indicator |
| `useStudioSession`       | ui-prototyping-studio.useStudioSession      | Hook            |
| `useStudioVariants`      | ui-prototyping-studio.useStudioVariants     | Hook            |
| `useDraftMutationBatch`  | ui-prototyping-studio.useDraftMutationBatch | Hook            |
| `useApplyBatch`          | ui-prototyping-studio.useApplyBatch         | Hook            |
| `SessionBinding`         | ui-prototyping-studio.SessionBinding        | Binding         |
| `MutationApplyBinding`   | ui-prototyping-studio.MutationApplyBinding  | Binding         |
