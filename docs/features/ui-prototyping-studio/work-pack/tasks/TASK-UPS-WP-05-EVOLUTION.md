# TASK-UPS-WP-05-EVOLUTION - L1 Evolution Observability Hardening

## Goal

Harden explicit EvolutionCycle, BaselineGenealogyFamily, FitnessSignal, and UI identity/visual DNA read models without changing existing MVP governance or apply gates.

## Wave Assignment

- Primary wave: W4
- Layer: L1 first hardening

## Status

not-started

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [domain.md](../../domain.md)         | EvolutionCycle, BaselineGenealogyFamily, genealogyFamilyId, FitnessSignal, PrototypeGenome, FitnessVector, FitnessSignalSource, UIElementIdentity, UIElementInstance, UIVisualSignature, UIDecisionRecord, TypedReference, BaselineRevisionAnchor |
| [operations.md](../../operations.md) | SelectOrCommitBaseline, ConfirmUIDecisionEvidence, RecordFitnessSignal, UPS-OP-014, UPS-OP-015                                                                                                                                                    |
| [queries.md](../../queries.md)       | GetEvolutionCycle, genealogyFamilyId, ListFitnessSignals, ListUIDecisionEvidence                                                                                                                                                                  |
| [interfaces.md](../../interfaces.md) | GodelDarwinEvolutionAdapter, recordBaselineFamily, confirmUIIdentityEvidence                                                                                                                                                                      |
| [states.md](../../states.md)         | EvolutionCycleState, UPS-ST-012, UPS-ST-013                                                                                                                                                                                                       |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | UPS-CON-011, UPS-CON-014, UPS-CON-015, UPS-ST-010, UPS-ST-012, UPS-ST-013, UPS-OP-011, UPS-OP-014, UPS-OP-015, UPS-API-011, UPS-API-014                                                                                                           |

## Architecture References

- [ARCHITECTURE.md](../../ARCHITECTURE.md#high-level-structure-view)
- [ARCHITECTURE.md](../../ARCHITECTURE.md#workflow-process-view)
- [EVOLUTION-ARCHITECTURE.md](../../EVOLUTION-ARCHITECTURE.md#baseline-family-recording)
- [EVOLUTION-ARCHITECTURE.md](../../EVOLUTION-ARCHITECTURE.md#data-ownership)
- [EVOLUTION-ARCHITECTURE.md](../../EVOLUTION-ARCHITECTURE.md#read-models)
- [IMPLEMENTATION-LAYERING.md](../../IMPLEMENTATION-LAYERING.md#layer-definitions)
- [Layering reference](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md)

## Implementation Directives

- Add evolution observability as an additive read-model layer over existing sessions, variants, comments, mutation batches, and revision manifests.
- Preserve the MVP contract that creates or updates BaselineGenealogyFamily idempotently at the first baseline-ready point, including single-variant committed sessions and multi-variant selected sessions.
- Preserve the MVP contract that stores UI identity and visual DNA as human-confirmed genealogy evidence; generated suggestions are not durable until `ConfirmUIDecisionEvidence` succeeds.
- Validate controlled visual DNA vocabulary for color schema, shape, typography, layout, interaction, and semantic UI category.
- Do not introduce automated ranking or autonomous lineage selection.
- Ensure `count(populationVariantLabels) = StudioSession.variantCount.value`.
- Expose hardened read models for evolution cycle, baseline genealogy family, UI decision evidence, and fitness signals.
- Keep all existing WP-01..03 e2e behavior green.

## Completion Criteria

- Evolution cycle is queryable or derivable when variants are generated.
- Baseline genealogy family created by the MVP baseline flow is queryable after baseline readiness.
- UI element identities, rendered instances, visual signatures, and decision records confirmed by the MVP baseline/exploit review flow are queryable against the baseline genealogy family.
- Fitness signals can be recorded with source, target, vector, rationale, actor, and timestamp.
- Queries return cycle, signal, and UI decision evidence data without changing apply behavior.
- Existing manual gate tests still pass.

## Verification Evidence

- Backend contract tests for EvolutionCycle, BaselineGenealogyFamily, FitnessSignal, UIElementIdentity, UIVisualSignature, and UIDecisionRecord.
- Query tests for GetEvolutionCycle, ListFitnessSignals, and ListUIDecisionEvidence.
- Targeted web/e2e smoke test showing existing workbench gates remain unchanged.

## Gaps and Questions

- Fitness scoring model O-004 remains unresolved and out of scope.
- Runtime storage shape must be selected during implementation.

## Decision Lock

| Decision ID | Required | Status   | Note                                                     |
| ----------- | -------- | -------- | -------------------------------------------------------- |
| D-005       | yes      | selected | Manual gates remain mandatory                            |
| D-008       | yes      | selected | Evolution observability follows Evolution Engine lineage |
| O-004       | no       | open     | Weighted scoring is not required for L1                  |
