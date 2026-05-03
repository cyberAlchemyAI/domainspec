# Domain: Knowledge Graph Visualization

## Entities

### FeatureDocument

Represents one source markdown file used to build mirror cards and graph projection data.

| Field      | Type                      | Required | Description                         |
| ---------- | ------------------------- | -------- | ----------------------------------- |
| id         | string                    | yes      | Stable file identifier              |
| featureId  | string                    | yes      | Owning feature slug                 |
| path       | string                    | yes      | Relative markdown path              |
| aspectKind | [AspectKind](#aspectkind) | yes      | File category mirrored in cards     |
| checksum   | string                    | yes      | Content hash for freshness tracking |
| updatedAt  | string (ISO-8601)         | yes      | Last indexed timestamp              |

**Operations:** [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)

---

### ConceptDefinition

Canonical concept entry derived from feature concept tables and anchors.

| Field             | Type                                    | Required | Description                     |
| ----------------- | --------------------------------------- | -------- | ------------------------------- |
| conceptId         | string                                  | yes      | Canonical concept ID            |
| name              | string                                  | yes      | Human-readable concept name     |
| taxonomyType      | string                                  | yes      | Meta-concept type from taxonomy |
| summary           | string                                  | yes      | Short concept description       |
| sourceFilePath    | string                                  | yes      | File where concept is defined   |
| sourceAnchor      | string                                  | yes      | Markdown anchor for deep-link   |
| definitionPointer | [DefinitionPointer](#definitionpointer) | yes      | Navigation target bundle        |

**Operations:** [SelectConcept](operations.md#selectconcept), [OpenDefinition](operations.md#opendefinition)

---

### MirrorProjection

Read-optimized aggregate snapshot that keeps cards and graph synchronized.

| Field       | Type                                    | Required | Description                  |
| ----------- | --------------------------------------- | -------- | ---------------------------- |
| snapshotId  | string                                  | yes      | Projection snapshot ID       |
| featureId   | string                                  | yes      | Feature owner of projection  |
| generatedAt | string (ISO-8601)                       | yes      | Snapshot generation time     |
| nodeCount   | integer                                 | yes      | Number of concept nodes      |
| edgeCount   | integer                                 | yes      | Number of relationship edges |
| cards       | [MirrorCardView](#mirrorcardview)[]     | yes      | One card per mirrored file   |
| edges       | [RelationshipEdge](#relationshipedge)[] | yes      | Canonical relationship edges |

**Operations:** [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)

---

### ExplorationSession

Tracks current interaction focus for one user on the knowledge graph page.

| Field                | Type                                           | Required | Description               |
| -------------------- | ---------------------------------------------- | -------- | ------------------------- |
| sessionId            | string                                         | yes      | Session identifier        |
| featureId            | string                                         | yes      | Active feature            |
| selectedConceptId    | string                                         | no       | Currently focused concept |
| selectedFilePath     | string                                         | no       | Card-selected source file |
| lastDefinitionTarget | string                                         | no       | Last opened file#anchor   |
| state                | [ExplorationState](states.md#explorationstate) | yes      | Session lifecycle state   |

**Lifecycle:** See [ExplorationState](states.md#explorationstate)
**Operations:** [SelectConcept](operations.md#selectconcept), [OpenDefinition](operations.md#opendefinition)

---

## Value Objects

### RelationshipEdge

One canonical graph edge between two concept IDs.

| Field         | Type   | Constraint                                   |
| ------------- | ------ | -------------------------------------------- |
| fromConceptId | string | Must exist in concept registry               |
| edge          | string | Must be canonical edge from RELATIONSHIPS.md |
| toConceptId   | string | Must exist in concept registry               |
| evidence      | string | Markdown link to supporting definition       |
| notes         | string | Optional reviewer note                       |

**Equality:** by `(fromConceptId, edge, toConceptId, evidence)`.

---

### DefinitionPointer

Deep-link pointer to a concept definition.

| Field    | Type    | Constraint                                 |
| -------- | ------- | ------------------------------------------ |
| filePath | string  | Relative markdown path under docs/features |
| anchor   | string  | Existing markdown heading anchor           |
| lineHint | integer | Positive when available, otherwise 0       |
| label    | string  | Non-empty human label                      |

**Equality:** by `(filePath, anchor)`.

---

### MirrorCardView

Card payload for one mirrored file shown in the UI grid.

| Field         | Type                                | Constraint                       |
| ------------- | ----------------------------------- | -------------------------------- |
| filePath      | string                              | Unique per feature projection    |
| title         | string                              | Non-empty card title             |
| aspectKind    | [AspectKind](#aspectkind)           | Must match source file kind      |
| conceptCount  | integer                             | `>= 0`                           |
| relationCount | integer                             | `>= 0`                           |
| freshness     | [FreshnessStatus](#freshnessstatus) | Derived from checksum comparison |

**Equality:** by `filePath`.

---

### ConceptDetailCard

Detail projection shown when a concept is selected.

| Field             | Type                                    | Constraint                      |
| ----------------- | --------------------------------------- | ------------------------------- |
| conceptId         | string                                  | Must exist in concept registry  |
| title             | string                                  | Non-empty                       |
| summary           | string                                  | Non-empty                       |
| definition        | [DefinitionPointer](#definitionpointer) | Must resolve to existing anchor |
| inboundRelations  | [RelationshipEdge](#relationshipedge)[] | Canonical edges only            |
| outboundRelations | [RelationshipEdge](#relationshipedge)[] | Canonical edges only            |

**Equality:** by `conceptId` and projection timestamp.

---

## Enums

### AspectKind

| Value      | Description                        |
| ---------- | ---------------------------------- |
| SPEC       | Feature specification overview     |
| DOMAIN     | Structural domain definitions      |
| OPERATIONS | Mutating operation contracts       |
| QUERIES    | Read-model contracts               |
| INTERFACES | API and module contracts           |
| MAPPINGS   | Transformation contracts           |
| WORKFLOWS  | Orchestration and policy contracts |
| EVENTS     | Domain event contracts             |
| STATES     | State machine contracts            |

### FreshnessStatus

| Value      | Description                             |
| ---------- | --------------------------------------- |
| up-to-date | File checksum matches indexed snapshot  |
| stale      | File changed after projection timestamp |
| missing    | Required file could not be loaded       |
