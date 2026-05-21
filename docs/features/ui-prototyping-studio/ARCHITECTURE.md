---
feature: ui-prototyping-studio
version: current
status: draft
updatedAt: 2026-05-20
docType: architecture
sourceMode: arcanum-invoke-design
owners:
  - web-core
---

# UI Prototyping Studio Architecture

This architecture bundle follows the Arcanum `invoke design` six-view contract for the UI Prototyping Studio Godel-Darwin machine.

## Source Contracts

| Source                             | Role                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| [PRODUCT-VIEW.md](PRODUCT-VIEW.md) | Conceptual product and capability view                 |
| [SPEC.md](SPEC.md)                 | DomainSpec capability registry and FR/AC contract      |
| [domain.md](domain.md)             | Entities, value objects, enums, genetic/proof concepts |
| [operations.md](operations.md)     | Mutation, fitness, proof, and handoff operations       |
| [workflows.md](workflows.md)       | MVP workflow plus Godel-Darwin evolution workflow      |
| [states.md](states.md)             | Session and evolution-cycle state machines             |
| [UI-SPEC.md](UI-SPEC.md)           | Frontend route and panel contract                      |
| [TEST-SPEC.md](TEST-SPEC.md)       | Verification obligations                               |

## 1. Context View

UI Prototyping Studio sits between product ideation and formal UI implementation.

The feature receives interface intent, generates bounded prototype populations, captures selection pressure, applies approved mutations, and exports evidence into the DomainSpec UI delivery pipeline. It is not a general autonomous design agent; it is a governed evolution workbench where each durable change must be explainable through state, gate, task, revision, or proof evidence.

### Actors

| Actor             | Responsibility                                                      |
| ----------------- | ------------------------------------------------------------------- |
| Designer          | Provides prompt intent, compares variants, selects baseline lineage |
| Reviewer          | Captures element-level comments and qualitative fitness signals     |
| PM / Lead         | Reviews synthesized mutation batches and approves apply             |
| Engineer          | Consumes revision lineage and handoff artifacts                     |
| Governance System | Enforces proof obligations and blocks unsafe self-improvement       |

### Environmental Constraints

| Constraint                                 | Architectural Effect                                          |
| ------------------------------------------ | ------------------------------------------------------------- |
| `variantCount` bounded to `1..3`           | Population size is deliberately small and comparable          |
| Manual gates remain mandatory              | Auto-apply and auto-promotion are forbidden                   |
| HTML-first MVP output                      | Prototype phenotype is auditable and portable                 |
| DomainSpec aspect docs are source of truth | Architecture concepts must link to formal aspects             |
| Arcanum layering governs implementation    | Evolution/proof capabilities promote only with layer evidence |

## 2. High-Level Structure View

```mermaid
graph TD
    A[Workbench UI] --> B[Studio Orchestration Module]
    B --> C[Variant Generator]
    B --> D[Annotation Capture]
    B --> E[Mutation Synthesizer]
    B --> F[Governance Gate Evaluator]
    B --> G[Revision Manifest Writer]
    B --> H[Handoff Publisher]

    C --> I[Genetic Evolution Engine]
    D --> I
    E --> I
    I --> J[Godel Proof Layer]
    F --> J
    J --> G
    G --> H

    K[Component Reuse Registry] --> C
    L[Newspaper Contract Adapter] --> D
    L --> E
    L --> G
```

### Primary Subsystems

| Subsystem                    | Owns                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| Workbench UI                 | Route, panels, forms, state indicators, disabled/enabled gate feedback   |
| Studio Orchestration Module  | Operation sequencing, session state, API boundary coordination           |
| Genetic Evolution Engine     | Genome, population, fitness signals, selected lineage, mutation proposal |
| Godel Proof Layer            | Proof obligations, pass/flag/block evaluation, self-improvement deferral |
| Revision Manifest Writer     | Append-only lineage evidence and revision head update                    |
| DomainSpec Handoff Publisher | Story/spec/UI/test/implementation references                             |

## 3. Low-Level Components View

| Component                     | DomainSpec Concept                                  | Implementation Responsibility                                      |
| ----------------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| `StudioWorkbenchLayout`       | `ui-prototyping-studio.StudioWorkbenchPage`         | Composes visible product surface                                   |
| `SessionControlsPanel`        | `ui-prototyping-studio.SessionControlsPanel`        | Captures prompt and bounded variant count                          |
| `VariantCanvas`               | `ui-prototyping-studio.VariantCanvas`               | Displays population candidates and baseline controls               |
| `AnnotationPanel`             | `ui-prototyping-studio.AnnotationPanel`             | Captures element-level comment events                              |
| `MutationApprovalPanel`       | `ui-prototyping-studio.MutationApprovalPanel`       | Reviews draft mutations and enforces manual approval               |
| `RevisionTimeline`            | `ui-prototyping-studio.RevisionTimeline`            | Displays lineage evidence                                          |
| `HandoffSummaryPanel`         | `ui-prototyping-studio.HandoffSummaryPanel`         | Publishes downstream readiness                                     |
| `GodelDarwinEvolutionAdapter` | `ui-prototyping-studio.GodelDarwinEvolutionAdapter` | Encodes genome, records fitness, evaluates proof, defers promotion |

## 4. Workflow Process View

```mermaid
flowchart LR
    A[Intent] --> B[Genome]
    B --> C[Population A/B/C]
    C --> D[Fitness Signals]
    D --> E[Lineage Selection]
    E --> F[Mutation Batch]
    F --> G[Proof Gate]
    G -->|pass + approval| H[Apply Mutation]
    G -->|flag/block| I[Defer or Reject]
    H --> J[Revision Manifest]
    J --> K[Handoff]
    J --> L[Future Rule Improvement Request]
    L --> G
```

The MVP uses the existing studio iteration loop to prove the Darwin side: bounded population, baseline selection, mutation, and lineage. The Godel side is formalized as a proof layer that blocks self-improvement until future implementation layers supply proof pass and governance approval.

## 5. Decision Flow View

| Decision              | Owner                                                     | Rule                                                           |
| --------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| Population size       | Session user + system validation                          | Must be `1..3`, default `3`                                    |
| Baseline lineage      | Human for multi-variant, system commit for single-variant | Multi-option selection is mandatory                            |
| Fitness meaning       | Human/test/governance source                              | Signals are recorded as evidence, not automatic ranking in MVP |
| Mutation apply        | Human approver + server gate                              | Draft must be approved and non-stale                           |
| Rule self-improvement | Governance system + future owner                          | MVP defers; post-MVP requires proof pass and non-auto actor    |
| Handoff readiness     | System                                                    | Revision evidence and downstream references must exist         |

## 6. Dependency Interface View

| Interface                       | Direction           | Contract                                                                   |
| ------------------------------- | ------------------- | -------------------------------------------------------------------------- |
| `UIPrototypingStudioAPI`        | external REST       | Session, variant, baseline, comment, mutation, revision, handoff endpoints |
| `StudioOrchestrationModule`     | internal            | Operation and query orchestration boundary                                 |
| `NewspaperContractAdapter`      | internal adapter    | Contract-shape reuse only; no runtime import                               |
| `GodelDarwinEvolutionAdapter`   | internal adapter    | Genome, fitness, proof, and rule-promotion request boundary                |
| DomainSpec UI pipeline          | downstream          | `UI-SPEC.md`, `TEST-SPEC.md`, stories, implementation references           |
| Arcanum implementation layering | planning/governance | L0-L3 promotion evidence and deferred self-improvement gates               |

## Risks And Mitigations

| Risk                                    | Mitigation                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| Evolution metaphor becomes vague        | Keep every concept mapped to DomainSpec entities, operations, policies, and tests |
| Self-improvement bypasses governance    | MVP defers promotion; proof gate requires pass, approval, and non-auto actor      |
| Fitness signals become hidden ranking   | MVP records qualitative signals only; scoring model remains open decision         |
| Architecture drifts from implementation | Implementation layering owns promotion evidence before runtime expansion          |

## Design Gaps

| Gap                              | Status   | Resolution Path                                              |
| -------------------------------- | -------- | ------------------------------------------------------------ |
| Fitness scoring model            | open     | Resolve O-004 in [DECISIONS.md](DECISIONS.md#open-decisions) |
| Promotable generation-rule types | open     | Resolve O-005 before post-MVP self-improvement               |
| Runtime proof storage schema     | deferred | Define in L1/L2 implementation layering                      |
