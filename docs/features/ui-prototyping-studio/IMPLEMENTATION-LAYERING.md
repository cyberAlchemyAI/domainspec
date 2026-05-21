---
feature: ui-prototyping-studio
version: current
status: draft
updatedAt: 2026-05-20
docType: implementation-layering
sourceMode: arcanum-invoke-plan
owners:
  - web-core
---

# UI Prototyping Studio Implementation Layering

This document defines an Arcanum-style progressive implementation layering model for UI Prototyping Studio with the Godel-Darwin machine and genetic algorithm as first-class planning concerns.

Scope note: Layer 0 is the smallest proof that the current MVP can be interpreted as a governed evolutionary loop. Later layers harden the explicit evolution engine, proof layer, self-improvement deferral, and post-MVP promotion path.

## Layering Method

- POC-first: prove the governed prompt -> population -> lineage -> mutation -> manifest loop with existing MVP behavior.
- Evolution-first: treat variants, comments, tasks, and manifests as genetic algorithm evidence before adding automated scoring.
- Proof-first: durable mutation and self-improvement require explicit proof obligations.
- Non-regression: every layer preserves manual gates, bounded variant count, deterministic synthesis, and append-only lineage.
- Evidence-gated promotion: each layer must cite verification evidence before the next layer can widen behavior.

## Layer Boundary Heuristic

A layer ends at the smallest slice that changes what the team can responsibly decide next.

```text
After this layer, we know whether {decision unlocked}.
```

```text
Layer value = decision unlocked + user-visible outcome + risk reduced
Layer cost = implementation time + verification time + coordination burden

Stop the layer when the next unit of work has lower value-per-cost for the current decision than starting the next decision layer.
```

## Layer Decision Framing

| Layer    | Decision Question                                                                                         | Minimum Working Unit                                                                                     | Deferred Scope                                  | Promotion Decision                                       |
| -------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| L0 (POC) | After this, we know whether the MVP loop can be formalized as a genetic population/lineage system.        | Spec/aspect contract plus existing e2e evidence for bounded variants, selection, mutation, and manifest. | Runtime fitness store, scoring, rule promotion. | Continue when docs and e2e evidence align.               |
| L1       | After this, we know whether explicit evolution read models can be implemented without changing MVP gates. | `EvolutionCycle`, `FitnessSignal`, `GetEvolutionCycle`, `ListFitnessSignals` read path.                  | Automated ranking and self-improvement.         | Harden when signals are queryable and non-authoritative. |
| L2       | After this, we know whether proof gates can reliably block unsafe mutation and self-improvement.          | `EvaluateProofGate`, proof obligation storage, negative tests for missing/blocking evidence.             | Rule promotion apply path.                      | Scale when proof blocks are auditable and deterministic. |
| L3       | After this, we know whether governed self-improvement can be piloted safely.                              | `PromoteEvolutionRule` post-MVP path with proof pass, governance approval, and rollback.                 | Autonomous multi-cycle execution.               | Pilot only with owner approval and evidence.             |

## Capability-to-Layer Progression

| Capability         | L0 (POC proof)                                      | L1 (first hardening)                | L2 (governance/reliability)        | L3 (scale/pilot)                       |
| ------------------ | --------------------------------------------------- | ----------------------------------- | ---------------------------------- | -------------------------------------- |
| Variant Generation | Existing `variantCount` and candidate metadata      | Population links to evolution cycle | Population proof obligations       | Multi-generation comparison            |
| Fitness Signals    | Human selection and comments interpreted as signals | Persist/query explicit signals      | Test/governance signals feed proof | Weighted scoring pilot                 |
| Mutation Lineage   | Existing batch + manifest path                      | Genome and lineage refs persisted   | Proof obligations link to lineage  | Lineage influences generation strategy |
| Godel Proof Gate   | Contract defined in docs                            | Read-only proof status visible      | Proof gate blocks apply/promotion  | Rule promotion with approval           |
| DomainSpec Handoff | Existing handoff bundle                             | Include evolution/proof references  | Include proof status and gaps      | Include promoted-rule provenance       |

## Layer Definitions

| Layer    | Objective                                                   | Builds On          | Primary Scope                                          | Exit Evidence                                                    | Value/Cost Notes                                 |
| -------- | ----------------------------------------------------------- | ------------------ | ------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------ |
| L0 (POC) | Formalize current MVP as governed evolutionary loop.        | Existing WP-01..03 | Docs, spec, product view, e2e mapping.                 | `PRODUCT-VIEW.md`, [SPEC.md](SPEC.md), e2e UPS-UI-001..008.      | Low implementation cost; high strategic clarity. |
| L1       | Implement explicit evolution observability.                 | L0                 | Evolution cycle and fitness signal read/write paths.   | Contract tests for cycle/signal creation and read queries.       | Adds visibility without changing decisions.      |
| L2       | Enforce proof-gated mutation and self-improvement deferral. | L1                 | Proof obligations, proof status, negative gates.       | Tests for `block`, `flag`, `pass`, and MVP deferral.             | Higher verification cost justified by safety.    |
| L3       | Pilot governed self-improvement.                            | L2                 | Promotable rule registry, approval workflow, rollback. | Pilot report with proof pass, owner approval, rollback evidence. | Only valuable after proof layer is trusted.      |

## Layer 0 - Minimum Working Unit POC

### Goal

Prove that the existing studio MVP can be understood and presented as a Godel-Darwin UI evolution system without altering runtime behavior.

### Included Scope

- DomainSpec spec/aspect updates for genetic algorithm and proof concepts.
- Product view alignment with genome, population, fitness, selection, mutation, lineage, and proof.
- Arcanum architecture and implementation-layering artifacts.
- Traceability from stories, FRs, ACs, operations, workflows, and states.

### Explicitly Deferred Beyond L0

- Runtime persistence for `EvolutionCycle` and `FitnessSignal`.
- Automated fitness scoring or ranking.
- Direct generation-rule promotion.
- Autonomous multi-cycle execution.

### Exit Criteria

- [SPEC.md](SPEC.md) includes genetic evolution and Godel proof capabilities.
- [domain.md](domain.md) defines evolution/proof concepts.
- [operations.md](operations.md), [workflows.md](workflows.md), and [states.md](states.md) define proof/evolution behavior.
- [TEST-SPEC.md](TEST-SPEC.md) carries verification obligations for evolution and proof gates.

### Promotion Decision

- Continue when: docs align and existing e2e evidence still explains the L0 loop.
- Pivot when: genetic terminology obscures rather than clarifies the product model.
- Stop when: proof gates cannot be linked to concrete DomainSpec evidence.

## Layer-by-Layer Improvements

### Layer 1 Improvements Over L0

- Added scope: explicit evolution-cycle and fitness-signal persistence/query surfaces.
- Hardening delta: signals become queryable evidence instead of presentation-only interpretation.
- Verification delta: contract tests for cycle creation, signal validation, and read models.

### Layer 2 Improvements Over L1

- Added scope: proof obligation evaluator and runtime proof-status gating.
- Hardening delta: mutation and self-improvement decisions are blocked by missing or failing proof.
- Verification delta: negative tests for missing evidence, blocker obligations, stale lineage, and auto-promotion.

### Layer 3 Improvements Over L2

- Added scope: governed self-improvement pilot for generation rules.
- Hardening delta: rule promotion becomes explicit, reversible, and provenance-backed.
- Verification delta: pilot report, rollback test, promoted-rule lineage, and owner approval evidence.

## Implementation Wave Backbone

| Wave | Target Layer | Goal                                        | Key Artifacts                                                                              | Verification                                 |
| ---- | ------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| W0   | L0           | Align docs and presentation model           | `PRODUCT-VIEW.md`, `SPEC.md`, aspect docs, `ARCHITECTURE.md`, `IMPLEMENTATION-LAYERING.md` | Markdown/link review                         |
| W1   | L1           | Add explicit evolution read/write contracts | Evolution cycle and fitness signal backend/UI read paths                                   | Backend contract tests and UI smoke coverage |
| W2   | L2           | Enforce proof gate                          | Proof obligation evaluator, negative gates, MVP deferral                                   | Proof pass/flag/block tests                  |
| W3   | L3           | Pilot self-improvement                      | Rule promotion registry, approval, rollback                                                | Pilot evidence and owner approval            |

## Source-of-Truth References

- [SPEC.md](SPEC.md)
- [domain.md](domain.md)
- [operations.md](operations.md)
- [workflows.md](workflows.md)
- [states.md](states.md)
- [interfaces.md](interfaces.md)
- [queries.md](queries.md)
- [TEST-SPEC.md](TEST-SPEC.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [PRODUCT-VIEW.md](PRODUCT-VIEW.md)

## Open Decisions

- O-004: fitness scoring model in [DECISIONS.md](DECISIONS.md#open-decisions).
- O-005: promotable generation-rule types in [DECISIONS.md](DECISIONS.md#open-decisions).
- Runtime proof storage schema and retention policy.
