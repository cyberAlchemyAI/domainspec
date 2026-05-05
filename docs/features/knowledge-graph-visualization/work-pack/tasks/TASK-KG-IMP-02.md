# TASK-KG-IMP-02 - Read and Interaction API Contracts

## Goal

Implement API and internal module contracts for mirror cards, graph query, concept detail query, concept selection, and definition open.

## Wave Assignment

- Primary wave: W1
- Supporting wave: W2 (integration stabilization)

## Status

not-started

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| [queries.md](../../queries.md)       | GetMirrorCards, GetRelationshipGraph, GetConceptDetailCard, GetDefinitionPointer          |
| [interfaces.md](../../interfaces.md) | KnowledgeGraphAPI, KnowledgeGraphModule, external REST endpoints, internal module methods |
| [mappings.md](../../mappings.md)     | ConceptToDetailCardAdapter                                                                |
| [operations.md](../../operations.md) | SelectConcept, OpenDefinition                                                             |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | KG-API-001, KG-API-002, KG-API-003, KG-API-004, KG-API-005, KG-OP-003, KG-OP-004          |

## Architecture References

- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)
- [Layering Reference - Application Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#application-layer)
- [Dependency Rules](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)

## Implementation Directives

- Keep endpoint parsing and serialization in adapters.
- Keep concept-selection and definition-resolution semantics in use-case layer.
- Return explicit, stable error codes for unresolved concept or unresolved definition anchors.
- Keep contracts backward-compatible with pending decision on definition target mode.

## Reusable legacy Assets

| Asset                                                                                                                     | Reuse Mode            | Required Adaptation                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| [backend/src/server.ts](../../../../../backend/src/server.ts) route/bootstrap boundary pattern                            | reuse with adaptation | Reuse Fastify app bootstrap and add current KG read endpoints with explicit adapter-to-application wiring.   |
| [backend/src/server.test.ts](../../../../../backend/src/server.test.ts) Fastify inject contract test pattern              | reuse with adaptation | Reuse request injection, status assertions, and lifecycle cleanup pattern for current endpoint contracts.    |
| [backend/src/index.ts](../../../../../backend/src/index.ts) process entrypoint pattern                                    | reuse with adaptation | Reuse startup composition pattern when wiring KG repositories/use-cases at process boundary.                 |
| Removed legacy route modules (`backend/src/auth.ts`, `backend/src/scopes.ts`, `backend/src/knowledge-graph-use-cases.ts`) | re-implement          | Rebuild auth/scope guards and use-case adapters in current module layout instead of restoring deleted files. |

## legacy Carryover Limits

- Do not keep legacy route contract surface (`/knowledge-graph/features/*/holistic`, `/semantic-neighborhood`) as the primary current API.
- Keep legacy compatibility routes only if explicitly required by migration policy; otherwise implement current routes from `interfaces.md` as authoritative contracts.

## Execution Steps

1. Implement read endpoints for cards, graph, detail, and definition pointer.
2. Implement operation endpoint/module method for open-definition.
3. Implement selection flow update and session-state persistence.
4. Add contract tests for success and explicit error diagnostics.

## Completion Criteria

- All documented endpoint contracts are available.
- Error diagnostics match operation error states.
- KG-API-001..005 and KG-OP-003..004 pass.

## Verification Evidence

- API contract test logs.
- Route-level check output for endpoint registration and handler mapping.

## Gaps and Questions

- Open-definition target mode decision (in-app vs editor deep-link) remains pending.

## Decision Lock

| Decision ID | Required | Status   | Note                     |
| ----------- | -------- | -------- | ------------------------ |
| D-KG-003    | yes      | selected | Click behavior required  |
| D-KG-005    | yes      | pending  | Final target mode choice |
