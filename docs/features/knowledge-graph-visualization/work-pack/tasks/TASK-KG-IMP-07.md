# TASK-KG-IMP-07 - Layering Audit and Boundary Enforcement

## Goal

Run layering audit to ensure domain, application, adapters, and UI boundaries remain compliant after current remake.

## Wave Assignment

- Primary wave: W3

## Status

not-started

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| [operations.md](../../operations.md) | RebuildMirrorProjection, SelectConcept, OpenDefinition                           |
| [queries.md](../../queries.md)       | GetMirrorCards, GetRelationshipGraph, GetConceptDetailCard, GetDefinitionPointer |
| [UI-SPEC.md](../../UI-SPEC.md)       | GraphDataBinding, ConceptFocusBinding, DefinitionNavigationBinding               |

## Architecture References

- [ARCHITECTURE.md - Layer Model](../../../../ARCHITECTURE.md#layer-model)
- [ARCHITECTURE.md - Application Layer](../../../../ARCHITECTURE.md#application-layer)
- [ARCHITECTURE.md - Interface and Adapters Layer](../../../../ARCHITECTURE.md#interface--adapters-layer)

## Implementation Directives

- Run `domainspec-audit-layering knowledge-graph-visualization` after alignment audit baseline is available.
- Verify parser I/O remains in adapters and business semantics remain in application/domain layers.
- Verify UI components use hooks/bindings and avoid transport/business leakage.

## Execution Steps

1. Execute layering audit command.
2. Publish [LAYERING-ALIGNMENT-REPORT.md](../../LAYERING-ALIGNMENT-REPORT.md).
3. For each finding, map offending code path to target layer and remediation action.
4. Update WORK-PACK and wave board with final audit status.

## Completion Criteria

- Layering report is published and linked.
- Any layer violations have owner/date remediation commitments.

## Verification Evidence

- Layering audit command output.
- Static boundary check outputs if available.

## Gaps and Questions

- None; depends on implementation completion and audit execution.

## Decision Lock

| Decision ID | Required | Status   | Note                                                              |
| ----------- | -------- | -------- | ----------------------------------------------------------------- |
| D-KG-001    | yes      | selected | Required file mirror model impacts parsing layer responsibilities |
| D-KG-003    | yes      | selected | Interaction flow affects UI/application boundary checks           |
