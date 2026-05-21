# TASK-UPS-WP-04-SPEC-REFRESH - Evolution Engine Spec Refresh

## Goal

Refresh the UI Prototyping Studio product/spec/docs baseline so accountable UI exploration, the internal Evolution Engine, and proof-governed promotion are first-class DomainSpec and Arcanum planning artifacts.

## Wave Assignment

- Primary wave: W0
- Layer: L0 documentation and planning proof

## Status

completed

## DomainSpec Coverage

| Source                                   | Coverage IDs                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [PRODUCT-VIEW.md](../../PRODUCT-VIEW.md) | Conceptual capability view, accountable exploration frame, Evolution Engine                          |
| [SPEC.md](../../SPEC.md)                 | D-008, D-009, FR-019..FR-025, AC-016..AC-019, INV-009..INV-015                                       |
| [domain.md](../../domain.md)             | EvolutionCycle, FitnessSignal, PrototypeGenome, FitnessVector, ProofObligation, RulePromotionRequest |
| [operations.md](../../operations.md)     | RecordFitnessSignal, EvaluateProofGate, PromoteEvolutionRule                                         |
| [workflows.md](../../workflows.md)       | GodelDarwinEvolutionWorkflow, GeneticSelectionPolicy, GodelProofGatePolicy                           |
| [states.md](../../states.md)             | EvolutionCycleState                                                                                  |
| [TEST-SPEC.md](../../TEST-SPEC.md)       | UPS-CON-011..013, UPS-ST-010..011, UPS-OP-011..013                                                   |

## Architecture References

- [ARCHITECTURE.md](../../ARCHITECTURE.md)
- [IMPLEMENTATION-LAYERING.md](../../IMPLEMENTATION-LAYERING.md)
- [DomainSpec architecture](../../../../../domainspec/ARCHITECTURE.md)
- [Architecture foundations](../../../../../architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md)

## Implementation Directives

- Keep the current MVP runtime behavior unchanged.
- Treat this task as a docs/spec refresh, not a backend/UI mutation task.
- Preserve manual gates, bounded variant count, deterministic synthesis, adapter-only newspaper compatibility, and append-only revision evidence.
- Make all future runtime work explicit as L1/L2/L3 tasks.

## Completion Criteria

- Product view lives under `docs/features/ui-prototyping-studio/`.
- Spec and aspect docs include Explore/Exploit, identity/visual DNA, evolution, typed-reference, and proof-promotion concepts.
- Architecture and implementation layering companions exist.
- Markdown links resolve for refreshed docs.

## Verification Evidence

- `tools/check_markdown_links.sh docs/features/ui-prototyping-studio/PRODUCT-VIEW.md`
- `tools/check_markdown_links.sh docs/features/ui-prototyping-studio/SPEC.md`
- `tools/check_markdown_links.sh docs/features/ui-prototyping-studio/ARCHITECTURE.md`
- `tools/check_markdown_links.sh docs/features/ui-prototyping-studio/IMPLEMENTATION-LAYERING.md`

## Gaps and Questions

- L1 read-model hardening for EvolutionCycle and FitnessSignal is deferred to UPS-WP-05-EVOLUTION.
- Proof-gate runtime enforcement for self-improvement and rule promotion is deferred to UPS-WP-06-PROOF-GATE.
- Governed self-improvement is deferred to UPS-WP-07-PROMOTION.

## Decision Lock

| Decision ID | Required | Status   | Note                                                     |
| ----------- | -------- | -------- | -------------------------------------------------------- |
| D-008       | yes      | selected | Evolution Engine lineage framing is now part of the spec |
| D-009       | yes      | selected | Self-improvement and rule promotion remain proof-gated   |
