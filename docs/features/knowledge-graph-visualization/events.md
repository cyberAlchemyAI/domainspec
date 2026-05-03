# Events: Knowledge Graph Visualization

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

| Consumer                    | Action                                |
| --------------------------- | ------------------------------------- |
| Web client projection store | Refresh mirror cards and graph canvas |
| Observability pipeline      | Emit projection freshness metrics     |

---

## ConceptSelected

**Produced by:** [SelectConcept](operations.md#selectconcept)
**Triggers transition:** [ProjectionReady -> ConceptFocused](states.md#explorationstate)

### Payload

| Field      | Type              | Description                          |
| ---------- | ----------------- | ------------------------------------ |
| sessionId  | string            | Active session                       |
| conceptId  | string            | Focused concept                      |
| source     | string            | Selection source (`card` or `graph`) |
| selectedAt | string (ISO-8601) | Selection timestamp                  |

### Consumed by

| Consumer                     | Action                             |
| ---------------------------- | ---------------------------------- |
| Concept detail panel adapter | Build detail card projection       |
| Analytics event stream       | Track concept exploration behavior |

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

| Consumer                  | Action                             |
| ------------------------- | ---------------------------------- |
| Router/navigation service | Open exact target file and anchor  |
| Audit log                 | Record definition navigation trace |
