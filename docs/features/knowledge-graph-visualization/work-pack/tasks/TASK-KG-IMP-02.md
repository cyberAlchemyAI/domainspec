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

- [ARCHITECTURE.md - Interface and Adapters Layer](../../../../ARCHITECTURE.md#interface--adapters-layer)
- [ARCHITECTURE.md - Application Layer](../../../../ARCHITECTURE.md#application-layer)
- [ARCHITECTURE.md - Domain Mapping](../../../../ARCHITECTURE.md#domainspec-mapping)

## Implementation Directives

- Keep endpoint parsing and serialization in adapters.
- Keep concept-selection and definition-resolution semantics in use-case layer.
- Return explicit, stable error codes for unresolved concept or unresolved definition anchors.
- Keep contracts backward-compatible with pending decision on definition target mode.

## Reusable legacy Assets

| Asset                                                                                                                                            | Reuse Mode            | Required Adaptation                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------------- |
| [backend/src/server.ts](../../../../backend/src/server.ts) helper functions (`parseBooleanQuery`, `parseStringListQuery`, `sendValidationError`) | reuse with adaptation | Reuse query parsing/validation helpers for current endpoints and contracts.                               |
| [backend/src/server.ts](../../../../backend/src/server.ts) runtime gate (`ensureDataAvailable`)                                                  | reuse with adaptation | Keep database availability gate, but wire it to current projection repository loading rules.              |
| [backend/src/auth.ts](../../../../backend/src/auth.ts) and [backend/src/scopes.ts](../../../../backend/src/scopes.ts)                            | reuse as-is           | Keep scope token and missing-scope behavior for current API routes.                                       |
| [backend/src/knowledge-graph-use-cases.ts](../../../../backend/src/knowledge-graph-use-cases.ts) server-to-use-case delegation pattern           | reuse with adaptation | Preserve route-to-use-case boundary and replace legacy use-case bindings with current operations/queries. |
| [backend/src/server.test.ts](../../../../backend/src/server.test.ts) Fastify inject contract tests                                               | reuse with adaptation | Reuse 401/400/404/200 response pattern tests for new current endpoint paths and payload shapes.           |

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
