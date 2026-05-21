# TASK-UPS-WP-05-EVOLUTION - L1 Evolution Observability

## Goal

Implement explicit EvolutionCycle and FitnessSignal runtime/read-model surfaces without changing existing MVP governance gates.

## Wave Assignment

- Primary wave: W4
- Layer: L1 first hardening

## Status

not-started

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| [domain.md](../../domain.md)         | EvolutionCycle, FitnessSignal, PrototypeGenome, FitnessVector, FitnessSignalSource |
| [operations.md](../../operations.md) | RecordFitnessSignal                                                                |
| [queries.md](../../queries.md)       | GetEvolutionCycle, ListFitnessSignals                                              |
| [interfaces.md](../../interfaces.md) | GodelDarwinEvolutionAdapter                                                        |
| [states.md](../../states.md)         | EvolutionCycleState                                                                |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | UPS-CON-011, UPS-ST-010, UPS-OP-011, UPS-API-011                                   |

## Architecture References

- [ARCHITECTURE.md](../../ARCHITECTURE.md#high-level-structure-view)
- [ARCHITECTURE.md](../../ARCHITECTURE.md#workflow-process-view)
- [IMPLEMENTATION-LAYERING.md](../../IMPLEMENTATION-LAYERING.md#layer-definitions)
- [Layering reference](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)

## Implementation Directives

- Add evolution observability as an additive layer over existing sessions, variants, comments, mutation batches, and revision manifests.
- Do not introduce automated ranking or autonomous lineage selection.
- Ensure `count(populationVariantLabels) = StudioSession.variantCount.value`.
- Expose read models for evolution cycle and fitness signals.
- Keep all existing WP-01..03 e2e behavior green.

## Completion Criteria

- Evolution cycle is created or derivable when variants are generated.
- Fitness signals can be recorded with source, target, vector, rationale, actor, and timestamp.
- Queries return cycle and signal data without changing apply behavior.
- Existing manual gate tests still pass.

## Verification Evidence

- Backend contract tests for EvolutionCycle and FitnessSignal.
- Query tests for GetEvolutionCycle and ListFitnessSignals.
- Targeted web/e2e smoke test showing existing workbench gates remain unchanged.

## Gaps and Questions

- Fitness scoring model O-004 remains unresolved and out of scope.
- Runtime storage shape must be selected during implementation.

## Decision Lock

| Decision ID | Required | Status   | Note                                                      |
| ----------- | -------- | -------- | --------------------------------------------------------- |
| D-005       | yes      | selected | Manual gates remain mandatory                             |
| D-008       | yes      | selected | Evolution observability follows genetic algorithm framing |
| O-004       | no       | open     | Weighted scoring is not required for L1                   |
