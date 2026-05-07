# Events: Knowledge Graph Visualization

## Governance Waivers (2026-05-07)

| Waiver ID      | Scope                                   | Status   | Owner    | Review Date | Rationale                                                                                     |
| -------------- | --------------------------------------- | -------- | -------- | ----------- | --------------------------------------------------------------------------------------------- |
| KG-EVT-WVR-001 | `MirrorProjectionBuilt` async consumers | accepted | web-core | 2026-06-15  | Observability pipeline event sink is deferred until shared event-bus substrate is introduced. |
| KG-EVT-WVR-002 | `ConceptSelected` analytics consumer    | accepted | web-core | 2026-06-15  | Analytics stream consumer is deferred; current flow remains synchronous request/response.     |
| KG-EVT-WVR-003 | `DefinitionOpened` audit-log consumer   | accepted | web-core | 2026-06-15  | Audit-log sink is deferred until centralized audit transport is available.                    |

## MirrorProjectionBuilt

**Produced by:** [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)
**Triggers transition:** [Idle -> ProjectionReady](states.md#explorationstate)

### Payload

| Field       | Type              | Description                     |
| ----------- | ----------------- | ------------------------------- |
| featureId   | string            | Feature slug                    |
| snapshotId  | string            | Projection snapshot ID          |
| cardCount   | integer           | Number of mirrored cards        |
| edgeCount   | integer           | Number of graph edges           |
| generatedAt | string (ISO-8601) | Projection generation timestamp |

### Consumed by

| Consumer                    | Action                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| HTTP rebuild caller         | Receives snapshot summary and triggers follow-up reads.                |
| Deferred (`KG-EVT-WVR-001`) | Observability freshness metrics emission is waived for this iteration. |

---

## ConceptSelected

**Produced by:** [SelectConcept](operations.md#selectconcept)
**Triggers transition:** [ProjectionReady -> ConceptFocused](states.md#explorationstate)

### Payload

| Field      | Type              | Description                                                      |
| ---------- | ----------------- | ---------------------------------------------------------------- |
| sessionId  | string            | Active session                                                   |
| conceptId  | string            | Focused concept                                                  |
| source     | string            | Selection source (`rail`, `board`, `detail`, `card`, or `graph`) |
| selectedAt | string (ISO-8601) | Selection timestamp                                              |

### Consumed by

| Consumer                    | Action                                                          |
| --------------------------- | --------------------------------------------------------------- |
| Concept detail route path   | Uses selection context to resolve deterministic detail payload. |
| Deferred (`KG-EVT-WVR-002`) | Analytics exploration sink is waived for this iteration.        |

---

## DefinitionOpened

**Produced by:** [OpenDefinition](operations.md#opendefinition)
**Triggers transition:** [ConceptFocused -> DefinitionOpened](states.md#explorationstate)

### Payload

| Field     | Type              | Description              |
| --------- | ----------------- | ------------------------ |
| sessionId | string            | Active session           |
| conceptId | string            | Focused concept          |
| filePath  | string            | Target definition file   |
| anchor    | string            | Target definition anchor |
| openedAt  | string (ISO-8601) | Navigation timestamp     |

### Consumed by

| Consumer                    | Action                                                            |
| --------------------------- | ----------------------------------------------------------------- |
| Open-definition HTTP caller | Receives deterministic target (`filePath#anchor`) for navigation. |
| Deferred (`KG-EVT-WVR-003`) | Audit-log sink is waived for this iteration.                      |
