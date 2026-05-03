# Test Specification: Knowledge Graph Visualization

## Objective

Define deterministic tests for markdown read/parse correctness, projection persistence into the database, mirror-card parity, canonical graph integrity, concept detail projection, and deep-link navigation.

## Contract Test Matrix

| Test ID      | Scope     | Contract                                                                                           | Type        |
| ------------ | --------- | -------------------------------------------------------------------------------------------------- | ----------- |
| KG-API-001   | API       | `GET /api/knowledge-graph/mirror-cards` returns required cards (`SPEC`, `DOMAIN`, `OPERATIONS`)    | Integration |
| KG-API-002   | API       | `GET /api/knowledge-graph/graph` returns only canonical edge labels                                | Integration |
| KG-API-003   | API       | `GET /api/knowledge-graph/concepts/:conceptId` returns detail card with inbound/outbound relations | Integration |
| KG-API-004   | API       | `POST /api/knowledge-graph/concepts/:conceptId/open-definition` returns resolved target            | Integration |
| KG-API-005   | API       | Read endpoints return data from latest persisted projection snapshot after rebuild                 | Integration |
| KG-OP-001    | Operation | `RebuildMirrorProjection` rejects missing required file cards                                      | Unit        |
| KG-OP-002    | Operation | `RebuildMirrorProjection` rejects unknown edge endpoints                                           | Unit        |
| KG-OP-005    | Operation | `RebuildMirrorProjection` parses markdown sources and persists one atomic snapshot to database     | Unit        |
| KG-OP-003    | Operation | `SelectConcept` rejects unknown concept ID                                                         | Unit        |
| KG-OP-004    | Operation | `OpenDefinition` rejects unresolved anchors                                                        | Unit        |
| KG-UIE2E-001 | UI        | `/knowledge-graph` renders card grid + graph + detail panel                                        | E2E         |
| KG-UIE2E-002 | UI        | Clicking concept in graph updates detail card title and relations                                  | E2E         |
| KG-UIE2E-003 | UI        | Clicking "Open definition" navigates to file anchor target                                         | E2E         |
| KG-UIE2E-004 | UI        | Card and graph counts stay synchronized after projection refresh                                   | E2E         |

## Story Coverage Mapping

| Story | Covered By                          | Notes                                                                    |
| ----- | ----------------------------------- | ------------------------------------------------------------------------ |
| US-1  | KG-API-001, KG-UIE2E-001, KG-OP-005 | Verifies required mirror card coverage from persisted projection         |
| US-2  | KG-API-002, KG-OP-002, KG-API-005   | Verifies canonical edge and endpoint constraints on persisted read model |
| US-3  | KG-API-004, KG-UIE2E-003, KG-OP-004 | Verifies click-to-definition flow                                        |
| US-4  | KG-API-003, KG-UIE2E-002            | Verifies related detail card behavior                                    |

## Non-Functional Checks

| Check ID  | Requirement                                                                        | Verification                                                        |
| --------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| KG-NF-001 | Graph response should be deterministic for same snapshot                           | Compare sorted node/edge outputs across repeated calls              |
| KG-NF-002 | Detail panel update should occur within 300ms on local profile                     | Measure UI event to render completion                               |
| KG-NF-003 | Deep-link failures return actionable diagnostics                                   | Assert error code and message mapping in UI                         |
| KG-NF-004 | Projection rebuild persistence should complete within 2s for baseline feature docs | Measure parse-to-persist duration in rebuild operation test harness |
