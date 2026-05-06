# Test Specification: Knowledge Graph Visualization

## Execution Record

| Field                        | Value                                                                     |
| ---------------------------- | ------------------------------------------------------------------------- |
| Specialist workflow          | `domainspec-generate-tests --ui --scaffold knowledge-graph-visualization` |
| Pipeline stage               | Step 4 (Tests)                                                            |
| Planner gate                 | PASS (`plannerGateStatus=pass` from `WORK-PACK.md`)                       |
| Framework constraints source | `domainspec/CHANGELOG.md` (latest: 2.0.4)                                 |
| Derivation rules source      | `domainspec/TEST-PIPELINE.md` rules 1-20                                  |
| Run date                     | 2026-05-05                                                                |

## Backend Test Catalogue

### State Machine Obligations (states.md)

| Test ID      | Obligation                                                                                                                     | Type                | Source                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ---------------------------- |
| KG-BE-ST-001 | `MirrorProjectionBuilt` transitions `Idle -> ProjectionReady` when required mirror files are present.                          | State transition    | `states.md#transition-table` |
| KG-BE-ST-002 | `ConceptSelected` transitions `ProjectionReady -> ConceptFocused` when concept exists in projection.                           | State transition    | `states.md#transition-table` |
| KG-BE-ST-003 | `DefinitionOpened` transitions `ConceptFocused -> DefinitionOpened` when pointer resolves.                                     | State transition    | `states.md#transition-table` |
| KG-BE-ST-004 | `ConceptSelected` transitions `DefinitionOpened -> ConceptFocused` on re-focus/new concept.                                    | State transition    | `states.md#transition-table` |
| KG-BE-ST-005 | `MirrorProjectionBuilt` transitions `ConceptFocused -> ProjectionReady` on rebuild/stale projection.                           | State transition    | `states.md#transition-table` |
| KG-BE-ST-006 | Reject `ConceptSelected` while in `Idle`; state remains `Idle`.                                                                | Negative transition | `states.md#transition-table` |
| KG-BE-ST-007 | Reject `DefinitionOpened` while in `Idle`; state remains `Idle`.                                                               | Negative transition | `states.md#transition-table` |
| KG-BE-ST-008 | Reject `MirrorProjectionBuilt` while in `ProjectionReady` unless rebuild path is explicitly opened from `ConceptFocused`.      | Negative transition | `states.md#transition-table` |
| KG-BE-ST-009 | Reject `DefinitionOpened` while in `ProjectionReady`; state remains `ProjectionReady`.                                         | Negative transition | `states.md#transition-table` |
| KG-BE-ST-010 | Reject `ConceptSelected` while already in `ConceptFocused` without the `DefinitionOpened` detour/re-focus transition contract. | Negative transition | `states.md#transition-table` |
| KG-BE-ST-011 | Reject `MirrorProjectionBuilt` in `DefinitionOpened`; state remains `DefinitionOpened`.                                        | Negative transition | `states.md#transition-table` |
| KG-BE-ST-012 | Reject `DefinitionOpened` in `DefinitionOpened`; state remains `DefinitionOpened`.                                             | Negative transition | `states.md#transition-table` |
| KG-BE-ST-013 | Invariant I1: when state is not `Idle`, cards include `SPEC`, `DOMAIN`, `OPERATIONS`.                                          | Property/invariant  | `states.md#invariants`       |
| KG-BE-ST-014 | Invariant I2: focused states always reference an existing concept.                                                             | Property/invariant  | `states.md#invariants`       |
| KG-BE-ST-015 | Invariant I3: `DefinitionOpened` always has a resolvable `filePath` + `anchor`.                                                | Property/invariant  | `states.md#invariants`       |

### Operation Rule Obligations (operations.md)

| Test ID      | Obligation                                                                                                   | Type                   | Source                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------- | --------------------------------------- |
| KG-BE-OP-001 | Rebuild R1 pass: accepts input containing `SPEC.md`, `domain.md`, `operations.md`.                           | Rule validation (pass) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-002 | Rebuild R1 fail: rejects rebuild when any required mirror file is missing.                                   | Rule validation (fail) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-003 | Rebuild R2 pass: card coverage equals distinct mirrored files.                                               | Rule validation (pass) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-004 | Rebuild R2 fail: rejects duplicate/missing card coverage mismatch.                                           | Rule validation (fail) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-005 | Rebuild R3 pass: accepts only canonical edge labels.                                                         | Rule validation (pass) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-006 | Rebuild R3 fail: rejects non-canonical edge label with `MIRROR_EDGE_LABEL_INVALID`.                          | Rule validation (fail) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-007 | Rebuild R4 pass: accepts edges whose endpoints resolve to known concepts.                                    | Rule validation (pass) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-008 | Rebuild R4 fail: rejects unresolved endpoint with `MIRROR_EDGE_ENDPOINT_UNKNOWN`.                            | Rule validation (fail) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-009 | Rebuild R5 pass: persists exactly one projection snapshot atomically.                                        | Rule validation (pass) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-010 | Rebuild R5 fail: persistence failure returns `MIRROR_PROJECTION_PERSISTENCE_FAILED` and no partial snapshot. | Rule validation (fail) | `operations.md#rebuildmirrorprojection` |
| KG-BE-OP-011 | SelectConcept R1 pass: accepts known `conceptId`.                                                            | Rule validation (pass) | `operations.md#selectconcept`           |
| KG-BE-OP-012 | SelectConcept R1 fail: rejects unknown concept with `CONCEPT_NOT_FOUND`.                                     | Rule validation (fail) | `operations.md#selectconcept`           |
| KG-BE-OP-013 | SelectConcept R2 pass: accepts concept with resolvable definition pointer.                                   | Rule validation (pass) | `operations.md#selectconcept`           |
| KG-BE-OP-014 | SelectConcept R2 fail: rejects missing pointer with `CONCEPT_DEFINITION_UNRESOLVED`.                         | Rule validation (fail) | `operations.md#selectconcept`           |
| KG-BE-OP-015 | SelectConcept R3 pass: accepts `source` in `{card, graph}`.                                                  | Rule validation (pass) | `operations.md#selectconcept`           |
| KG-BE-OP-016 | SelectConcept R3 fail: rejects unsupported selection source with `CONCEPT_SELECTION_SOURCE_INVALID`.         | Rule validation (fail) | `operations.md#selectconcept`           |
| KG-BE-OP-017 | OpenDefinition R1 pass: request concept matches `session.selectedConceptId`.                                 | Rule validation (pass) | `operations.md#opendefinition`          |
| KG-BE-OP-018 | OpenDefinition R1 fail: rejects mismatch with `DEFINITION_SESSION_MISMATCH`.                                 | Rule validation (fail) | `operations.md#opendefinition`          |
| KG-BE-OP-019 | OpenDefinition R2 pass: pointer file and anchor resolve before open.                                         | Rule validation (pass) | `operations.md#opendefinition`          |
| KG-BE-OP-020 | OpenDefinition R2 fail: rejects unresolved pointer/anchor with documented error codes.                       | Rule validation (fail) | `operations.md#opendefinition`          |

### Operation Calculation Obligations (operations.md)

| Test ID        | Obligation                                                              | Type                    | Source                                  |
| -------------- | ----------------------------------------------------------------------- | ----------------------- | --------------------------------------- |
| KG-BE-CALC-001 | Rebuild C1 computes `cardCount = count(distinct mirroredFiles)`.        | Calculation correctness | `operations.md#rebuildmirrorprojection` |
| KG-BE-CALC-002 | Rebuild C2 computes `coverageRatio = mirroredRequiredFiles / 3`.        | Calculation correctness | `operations.md#rebuildmirrorprojection` |
| KG-BE-CALC-003 | Rebuild C3 computes `edgeDensity = edgeCount / max(nodeCount, 1)`.      | Calculation correctness | `operations.md#rebuildmirrorprojection` |
| KG-BE-CALC-004 | SelectConcept C1 computes inbound relation count for selected concept.  | Calculation correctness | `operations.md#selectconcept`           |
| KG-BE-CALC-005 | SelectConcept C2 computes outbound relation count for selected concept. | Calculation correctness | `operations.md#selectconcept`           |
| KG-BE-CALC-006 | OpenDefinition C1 builds target URL as `filePath#anchor`.               | Calculation correctness | `operations.md#opendefinition`          |

### Operation Postcondition Obligations (operations.md)

| Test ID        | Obligation                                                              | Type          | Source                                  |
| -------------- | ----------------------------------------------------------------------- | ------------- | --------------------------------------- |
| KG-BE-POST-001 | Rebuild persists parsed markdown entities and edges as one snapshot.    | Postcondition | `operations.md#rebuildmirrorprojection` |
| KG-BE-POST-002 | Rebuild stores new `MirrorProjection` snapshot.                         | Postcondition | `operations.md#rebuildmirrorprojection` |
| KG-BE-POST-003 | Rebuild creates one `MirrorCardView` per mirrored file.                 | Postcondition | `operations.md#rebuildmirrorprojection` |
| KG-BE-POST-004 | Rebuild emits `MirrorProjectionBuilt` with snapshot summary.            | Postcondition | `operations.md#rebuildmirrorprojection` |
| KG-BE-POST-005 | SelectConcept stores `selectedConceptId`.                               | Postcondition | `operations.md#selectconcept`           |
| KG-BE-POST-006 | SelectConcept emits `ConceptSelected`.                                  | Postcondition | `operations.md#selectconcept`           |
| KG-BE-POST-007 | SelectConcept makes `ConceptDetailCard` queryable for selected concept. | Postcondition | `operations.md#selectconcept`           |
| KG-BE-POST-008 | OpenDefinition stores `lastDefinitionTarget`.                           | Postcondition | `operations.md#opendefinition`          |
| KG-BE-POST-009 | OpenDefinition emits `DefinitionOpened`.                                | Postcondition | `operations.md#opendefinition`          |
| KG-BE-POST-010 | OpenDefinition returns resolved `DefinitionPointer` payload.            | Postcondition | `operations.md#opendefinition`          |

### Operation Error-State Obligations (operations.md)

| Test ID       | Obligation                                                                   | Type        | Source                                  |
| ------------- | ---------------------------------------------------------------------------- | ----------- | --------------------------------------- |
| KG-BE-ERR-001 | Missing required file returns `MIRROR_REQUIRED_FILE_MISSING`.                | Error-state | `operations.md#rebuildmirrorprojection` |
| KG-BE-ERR-002 | Non-canonical edge label returns `MIRROR_EDGE_LABEL_INVALID`.                | Error-state | `operations.md#rebuildmirrorprojection` |
| KG-BE-ERR-003 | Unresolved edge endpoint returns `MIRROR_EDGE_ENDPOINT_UNKNOWN`.             | Error-state | `operations.md#rebuildmirrorprojection` |
| KG-BE-ERR-004 | Snapshot persistence failure returns `MIRROR_PROJECTION_PERSISTENCE_FAILED`. | Error-state | `operations.md#rebuildmirrorprojection` |
| KG-BE-ERR-005 | Unknown concept returns `CONCEPT_NOT_FOUND`.                                 | Error-state | `operations.md#selectconcept`           |
| KG-BE-ERR-006 | Missing definition pointer returns `CONCEPT_DEFINITION_UNRESOLVED`.          | Error-state | `operations.md#selectconcept`           |
| KG-BE-ERR-007 | Invalid selection source returns `CONCEPT_SELECTION_SOURCE_INVALID`.         | Error-state | `operations.md#selectconcept`           |
| KG-BE-ERR-008 | Session mismatch returns `DEFINITION_SESSION_MISMATCH`.                      | Error-state | `operations.md#opendefinition`          |
| KG-BE-ERR-009 | Missing pointer returns `DEFINITION_POINTER_NOT_FOUND`.                      | Error-state | `operations.md#opendefinition`          |
| KG-BE-ERR-010 | Missing anchor returns `DEFINITION_ANCHOR_NOT_FOUND`.                        | Error-state | `operations.md#opendefinition`          |

### Interface Contract Obligations (interfaces.md)

| Test ID       | Obligation                                                                                                   | Type     | Source                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------- |
| KG-BE-API-001 | `GET /api/knowledge-graph/mirror-cards` returns 200 with mirror card payload.                                | Contract | `interfaces.md#get-apiknowledge-graphmirror-cards`                      |
| KG-BE-API-002 | `GET /api/knowledge-graph/mirror-cards` returns 401 when auth is missing/invalid.                            | Contract | `interfaces.md#get-apiknowledge-graphmirror-cards`                      |
| KG-BE-API-003 | `GET /api/knowledge-graph/mirror-cards` returns 422 for invalid filter input.                                | Contract | `interfaces.md#get-apiknowledge-graphmirror-cards`                      |
| KG-BE-API-004 | `GET /api/knowledge-graph/graph` returns 200 with `nodes[]` and `edges[]`.                                   | Contract | `interfaces.md#get-apiknowledge-graphgraph`                             |
| KG-BE-API-005 | `GET /api/knowledge-graph/graph` returns 401 when auth is missing/invalid.                                   | Contract | `interfaces.md#get-apiknowledge-graphgraph`                             |
| KG-BE-API-006 | `GET /api/knowledge-graph/graph` returns 422 for invalid filter input.                                       | Contract | `interfaces.md#get-apiknowledge-graphgraph`                             |
| KG-BE-API-007 | `GET /api/knowledge-graph/concepts/:conceptId` returns 200 with concept detail card payload.                 | Contract | `interfaces.md#get-apiknowledge-graphconceptsconceptid`                 |
| KG-BE-API-008 | `GET /api/knowledge-graph/concepts/:conceptId` returns 404 when concept is missing.                          | Contract | `interfaces.md#get-apiknowledge-graphconceptsconceptid`                 |
| KG-BE-API-009 | `GET /api/knowledge-graph/concepts/:conceptId/definition` returns 200 with definition pointer payload.       | Contract | `interfaces.md#get-apiknowledge-graphconceptsconceptiddefinition`       |
| KG-BE-API-010 | `GET /api/knowledge-graph/concepts/:conceptId/definition` returns 404 when pointer is missing.               | Contract | `interfaces.md#get-apiknowledge-graphconceptsconceptiddefinition`       |
| KG-BE-API-011 | `POST /api/knowledge-graph/concepts/:conceptId/open-definition` returns 200 with resolved definition target. | Contract | `interfaces.md#post-apiknowledge-graphconceptsconceptidopen-definition` |
| KG-BE-API-012 | `POST /api/knowledge-graph/concepts/:conceptId/open-definition` returns 409 on session mismatch.             | Contract | `interfaces.md#post-apiknowledge-graphconceptsconceptidopen-definition` |
| KG-BE-API-013 | `POST /api/knowledge-graph/concepts/:conceptId/open-definition` returns 404 when anchor is missing.          | Contract | `interfaces.md#post-apiknowledge-graphconceptsconceptidopen-definition` |

### Interface Field-Mapping Obligations (interfaces.md)

| Test ID         | Obligation                                                                | Type    | Source                                                                  |
| --------------- | ------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------- |
| KG-BE-IFMAP-001 | `featureId` request field maps to `GetMirrorCards.featureId`.             | Mapping | `interfaces.md#get-apiknowledge-graphmirror-cards`                      |
| KG-BE-IFMAP-002 | `includeOptionalAspects` maps to `GetMirrorCards.includeOptionalAspects`. | Mapping | `interfaces.md#get-apiknowledge-graphmirror-cards`                      |
| KG-BE-IFMAP-003 | `featureId` request field maps to `GetRelationshipGraph.featureId`.       | Mapping | `interfaces.md#get-apiknowledge-graphgraph`                             |
| KG-BE-IFMAP-004 | `edgeKinds[]` maps to `GetRelationshipGraph.edgeKinds`.                   | Mapping | `interfaces.md#get-apiknowledge-graphgraph`                             |
| KG-BE-IFMAP-005 | `conceptTypes[]` maps to `GetRelationshipGraph.conceptTypes`.             | Mapping | `interfaces.md#get-apiknowledge-graphgraph`                             |
| KG-BE-IFMAP-006 | `featureId` maps to `GetConceptDetailCard.featureId`.                     | Mapping | `interfaces.md#get-apiknowledge-graphconceptsconceptid`                 |
| KG-BE-IFMAP-007 | `conceptId` path param maps to `GetConceptDetailCard.conceptId`.          | Mapping | `interfaces.md#get-apiknowledge-graphconceptsconceptid`                 |
| KG-BE-IFMAP-008 | `featureId` maps to `GetDefinitionPointer.featureId`.                     | Mapping | `interfaces.md#get-apiknowledge-graphconceptsconceptiddefinition`       |
| KG-BE-IFMAP-009 | `conceptId` path param maps to `GetDefinitionPointer.conceptId`.          | Mapping | `interfaces.md#get-apiknowledge-graphconceptsconceptiddefinition`       |
| KG-BE-IFMAP-010 | `sessionId` maps to `OpenDefinition.sessionId`.                           | Mapping | `interfaces.md#post-apiknowledge-graphconceptsconceptidopen-definition` |
| KG-BE-IFMAP-011 | `conceptId` path/body maps to `OpenDefinition.conceptId`.                 | Mapping | `interfaces.md#post-apiknowledge-graphconceptsconceptidopen-definition` |

### Event Obligations (events.md)

| Test ID       | Obligation                                                                                                                                       | Type           | Source                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | --------------------------------- |
| KG-BE-EVT-001 | `RebuildMirrorProjection` emits `MirrorProjectionBuilt` with payload fields: `featureId`, `snapshotId`, `cardCount`, `edgeCount`, `generatedAt`. | Event producer | `events.md#mirrorprojectionbuilt` |
| KG-BE-EVT-002 | `SelectConcept` emits `ConceptSelected` with payload fields: `sessionId`, `conceptId`, `source`, `selectedAt`.                                   | Event producer | `events.md#conceptselected`       |
| KG-BE-EVT-003 | `OpenDefinition` emits `DefinitionOpened` with payload fields: `sessionId`, `conceptId`, `filePath`, `anchor`, `openedAt`.                       | Event producer | `events.md#definitionopened`      |
| KG-BE-EVT-004 | Web client projection store consumer refreshes cards + graph on `MirrorProjectionBuilt`.                                                         | Event consumer | `events.md#mirrorprojectionbuilt` |
| KG-BE-EVT-005 | Observability pipeline consumer emits freshness metrics on `MirrorProjectionBuilt`.                                                              | Event consumer | `events.md#mirrorprojectionbuilt` |
| KG-BE-EVT-006 | Detail panel adapter consumer projects selected concept on `ConceptSelected`.                                                                    | Event consumer | `events.md#conceptselected`       |
| KG-BE-EVT-007 | Analytics stream consumer records exploration behavior on `ConceptSelected`.                                                                     | Event consumer | `events.md#conceptselected`       |
| KG-BE-EVT-008 | Router/navigation consumer opens exact target on `DefinitionOpened`.                                                                             | Event consumer | `events.md#definitionopened`      |
| KG-BE-EVT-009 | Audit log consumer records navigation trace on `DefinitionOpened`.                                                                               | Event consumer | `events.md#definitionopened`      |

### Query Obligations (queries.md)

| Test ID       | Obligation                                                                                                                       | Type                  | Source                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- |
| KG-BE-QRY-001 | `GetMirrorCards` returns output shape including `filePath`, `title`, `aspectKind`, `conceptCount`, `relationCount`, `freshness`. | Query output          | `queries.md#getmirrorcards`       |
| KG-BE-QRY-002 | `GetMirrorCards` applies `aspectKinds` filter correctly.                                                                         | Query filtering       | `queries.md#getmirrorcards`       |
| KG-BE-QRY-003 | `GetMirrorCards` applies `freshness` filter correctly.                                                                           | Query filtering       | `queries.md#getmirrorcards`       |
| KG-BE-QRY-004 | `GetMirrorCards` enforces auth scope `domainspec.kg.read`.                                                                       | Query authorization   | `queries.md#getmirrorcards`       |
| KG-BE-QRY-005 | `GetRelationshipGraph` returns output shape including canonical node and edge fields.                                            | Query output          | `queries.md#getrelationshipgraph` |
| KG-BE-QRY-006 | `GetRelationshipGraph` applies `edgeKinds` filter correctly.                                                                     | Query filtering       | `queries.md#getrelationshipgraph` |
| KG-BE-QRY-007 | `GetRelationshipGraph` applies `conceptTypes` filter correctly.                                                                  | Query filtering       | `queries.md#getrelationshipgraph` |
| KG-BE-QRY-008 | `GetRelationshipGraph` enforces auth scope `domainspec.kg.read`.                                                                 | Query authorization   | `queries.md#getrelationshipgraph` |
| KG-BE-QRY-009 | `GetConceptDetailCard` returns output shape with summary, definition, inbound/outbound relations.                                | Query output          | `queries.md#getconceptdetailcard` |
| KG-BE-QRY-010 | `GetConceptDetailCard` applies `includeInbound` filter correctly.                                                                | Query filtering       | `queries.md#getconceptdetailcard` |
| KG-BE-QRY-011 | `GetConceptDetailCard` applies `includeOutbound` filter correctly.                                                               | Query filtering       | `queries.md#getconceptdetailcard` |
| KG-BE-QRY-012 | `GetConceptDetailCard` returns not-found behavior for unknown concept.                                                           | Query empty/not-found | `queries.md#getconceptdetailcard` |
| KG-BE-QRY-013 | `GetDefinitionPointer` returns output shape with `filePath`, `anchor`, `lineHint`, `label`.                                      | Query output          | `queries.md#getdefinitionpointer` |
| KG-BE-QRY-014 | `GetDefinitionPointer` honors `preferExactAnchor=true` semantics.                                                                | Query filtering       | `queries.md#getdefinitionpointer` |
| KG-BE-QRY-015 | `GetDefinitionPointer` enforces auth scope `domainspec.kg.read`.                                                                 | Query authorization   | `queries.md#getdefinitionpointer` |
| KG-BE-QRY-016 | `GetDefinitionPointer` returns not-found behavior for missing pointer.                                                           | Query empty/not-found | `queries.md#getdefinitionpointer` |

### Capability Acceptance Obligations (SPEC.md, STORIES.md)

| Test ID       | Obligation                                                                                                                           | Type                  | Source                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------------------------------------------------------- |
| KG-BE-CAP-001 | Acceptance intent for US-1: required mirror cards (`SPEC`, `domain`, `operations`) are always present with required metadata fields. | Capability acceptance | `STORIES.md#us-1-mirror-cards-for-required-docs`            |
| KG-BE-CAP-002 | Acceptance intent for US-2: graph data contains only canonical labels and resolvable endpoints.                                      | Capability acceptance | `STORIES.md#us-2-graph-mirrors-canonical-relationships`     |
| KG-BE-CAP-003 | Acceptance intent for US-3: selected concept resolves to definition target with explicit diagnostics on failure.                     | Capability acceptance | `STORIES.md#us-3-click-concept-to-open-definition`          |
| KG-BE-CAP-004 | Acceptance intent for US-4: detail card mirrors focused concept with inbound/outbound relation evidence.                             | Capability acceptance | `STORIES.md#us-4-related-details-card-for-selected-concept` |

## UI E2E Test Catalogue

### Navigation and Journey Obligations

| Test ID       | Obligation                                                                                      | Type       | Status | Source                                                      |
| ------------- | ----------------------------------------------------------------------------------------------- | ---------- | ------ | ----------------------------------------------------------- |
| KG-UI-NAV-001 | Navigate to `/knowledge-graph` and assert page shell plus three-pane layout renders.            | Navigation | ready  | `UI-SPEC.md#route-table`                                    |
| KG-UI-JRN-001 | US-1 journey: opening page shows required mirror cards and required per-card metadata.          | Journey    | ready  | `STORIES.md#us-1-mirror-cards-for-required-docs`            |
| KG-UI-JRN-002 | US-2 journey: graph renders canonical edges and known concept IDs on initial load.              | Journey    | ready  | `STORIES.md#us-2-graph-mirrors-canonical-relationships`     |
| KG-UI-JRN-003 | US-3 journey: selecting a concept then triggering open-definition navigates to resolved target. | Journey    | ready  | `STORIES.md#us-3-click-concept-to-open-definition`          |
| KG-UI-JRN-004 | US-4 journey: selecting a concept updates detail panel summary and inbound/outbound relations.  | Journey    | ready  | `STORIES.md#us-4-related-details-card-for-selected-concept` |

### Form/Interaction Validation Obligations

| Test ID        | Obligation                                                                                                                         | Type                        | Status | Source                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------ | -------------------------------------------- |
| KG-UI-FORM-001 | OpenDefinition action enforces matching focused concept (`DEFINITION_SESSION_MISMATCH` mapped to UI message).                      | Form/interaction validation | ready  | `UI-SPEC.md#opendefinitionaction`            |
| KG-UI-FORM-002 | OpenDefinition action surfaces missing pointer/anchor diagnostics (`DEFINITION_POINTER_NOT_FOUND`, `DEFINITION_ANCHOR_NOT_FOUND`). | Form/interaction validation | ready  | `UI-SPEC.md#error-code---ui-message-mapping` |

### State Reflection Obligations

| Test ID         | Obligation                                                              | Type             | Status | Source                           |
| --------------- | ----------------------------------------------------------------------- | ---------------- | ------ | -------------------------------- |
| KG-UI-STATE-001 | `Idle` state renders empty placeholder with reload prompt.              | State reflection | ready  | `UI-SPEC.md#state-to-ui-mapping` |
| KG-UI-STATE-002 | `ProjectionReady` state renders badge variant and loaded cards/graph.   | State reflection | ready  | `UI-SPEC.md#state-to-ui-mapping` |
| KG-UI-STATE-003 | `ConceptFocused` state highlights selected node/card and focused badge. | State reflection | ready  | `UI-SPEC.md#state-to-ui-mapping` |
| KG-UI-STATE-004 | `DefinitionOpened` state renders link-state toast and opened badge.     | State reflection | ready  | `UI-SPEC.md#state-to-ui-mapping` |

### Responsive and Accessibility Obligations

| Test ID        | Obligation                                                                                                     | Type          | Status | Source                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ---------------------------------------------- |
| KG-UI-RSP-001  | Derive `/knowledge-graph` responsive assertions per defined breakpoints in UI architecture.                    | Responsive    | ready  | `../../UI-ARCHITECTURE.md#breakpoint-contract` |
| KG-UI-A11Y-001 | Keyboard-only navigation reaches cards, graph fallback list, detail actions with visible focus indicators.     | Accessibility | ready  | `UI-SPEC.md#accessibility-requirements`        |
| KG-UI-A11Y-002 | Interactive controls expose required ARIA semantics including `aria-live="polite"` and explicit action labels. | Accessibility | ready  | `UI-SPEC.md#accessibility-requirements`        |

## Coverage Summary

| Area                                                             | Obligations     |
| ---------------------------------------------------------------- | --------------- |
| Backend state machine                                            | 15              |
| Backend operations (rules, calculations, postconditions, errors) | 46              |
| Backend interfaces, events, queries                              | 49              |
| Capability acceptance                                            | 4               |
| UI E2E (navigation, journey, form, state, accessibility)         | 13 ready        |
| UI responsive                                                    | 1 ready         |
| Total                                                            | 128 (128 ready) |

## Uncovered Formal Gaps

- Cross-project scope obligations were introduced after this derivation run and still need formal test IDs:
  - `ResolveProjectionScope` rejects unknown/disabled `projectKey`.
  - Rebuild/read/open-definition requests preserve a consistent `(projectKey, featureId)` scope.
  - Definition pointers for external sources stay inside resolved workspace roots.

## Notes

- `--scaffold` was executed for UI obligations in Step 6.
- Generated Playwright stubs:
  - `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.navigation.spec.ts`
  - `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts`
  - `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.forms.spec.ts`
  - `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.states.spec.ts`
  - `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.responsive.spec.ts`
  - `apps/web/e2e/knowledge-graph-visualization/knowledge-graph-visualization.accessibility.spec.ts`
