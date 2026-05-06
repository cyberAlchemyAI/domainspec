# TASK-KG-IMP-02 - Read and Interaction API Contracts

## Goal

Implement API and internal module contracts for mirror cards, graph query, concept detail query, concept selection, and definition open.

## Wave Assignment

- Primary wave: W1
- Supporting wave: W2 (integration stabilization)

## Status

in-progress

## DomainSpec Coverage

| Source                               | Coverage IDs                                                                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [queries.md](../../queries.md)       | GetMirrorCards, GetRelationshipGraph, GetConceptDetailCard, GetDefinitionPointer with `projectKey`, `activeAspect`, `viewLevel`, `selectedFeatureId`, `selectedGroupKey` |
| [interfaces.md](../../interfaces.md) | KnowledgeGraphAPI, KnowledgeGraphModule, ProjectSourceRegistry, external REST endpoint field mappings                                                                    |
| [mappings.md](../../mappings.md)     | ConceptToDetailCardAdapter                                                                                                                                               |
| [operations.md](../../operations.md) | ResolveProjectionScope, SelectConcept, OpenDefinition                                                                                                                    |
| [TEST-SPEC.md](../../TEST-SPEC.md)   | KG-BE-API-001..013, KG-BE-IFMAP-001..011, KG-BE-OP-011..020, uncovered scope-gap obligations                                                                             |

## Architecture References

- [Layering Reference - Interface / Adapters Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#interface--adapters-layer)
- [Layering Reference - Application Layer](../../../../../architecture/pattern-library/LAYERING-REFERENCE.md#application-layer)
- [Dependency Rules](../../../../../architecture/pattern-library/DEPENDENCY-RULES.md)

## Implementation Directives

- Keep endpoint parsing and serialization in adapters.
- Resolve projection scope from `projectKey + featureId` before query or mutation handlers.
- Keep concept-selection and definition-resolution semantics in use-case layer.
- Implement board-level query semantics (`activeAspect`, `viewLevel`, `selectedFeatureId`, `selectedGroupKey`) in query handlers.
- Enforce whiteboard card selection validation by card id and card type (`feature`, `story`, `concept-group`, `concept`).
- Return explicit, stable error codes for unresolved concept or unresolved definition anchors.
- Keep contracts consistent with selected in-app definition-open mode.

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

1. Add/verify `projectKey` and `featureId` mapping across rebuild, read, selection, and open-definition endpoints.
2. Implement/verify graph read contract fields: `activeAspect`, `viewLevel`, `selectedFeatureId`, `selectedGroupKey`.
3. Implement/verify selection semantics for whiteboard card types and scope-safe session updates.
4. Implement/verify open-definition semantics with scope checks and deterministic diagnostics.
5. Add/refresh contract tests for endpoint field mappings, auth/scope errors, and whiteboard card validation errors.

## Completion Criteria

- All documented endpoint contracts are available.
- All scope-aware endpoint field mappings are implemented and tested.
- Error diagnostics match operation error states.
- Board-level query and selection contracts pass for `aspect`, `feature`, and `concept` drill levels.
- Cross-project scope errors are deterministic for unknown project, unavailable feature, and scope mismatch.

## Verification Evidence

- API contract test logs.
- Route-level check output for endpoint registration and handler mapping.
- Latest evidence (2026-05-06): backend suite passes detail/definition/open-definition contract tests with explicit mismatch diagnostics.

## Gaps and Questions

- Backfill formal TEST-SPEC IDs for newly introduced scope-guard contracts.

## Decision Lock

| Decision ID | Required | Status   | Note                                |
| ----------- | -------- | -------- | ----------------------------------- |
| D-KG-003    | yes      | selected | Click behavior required             |
| D-KG-005    | yes      | selected | In-app definition open mode         |
| D-KG-007    | yes      | selected | Registered source-key policy        |
| D-KG-009    | yes      | selected | Strict scope propagation invariants |
