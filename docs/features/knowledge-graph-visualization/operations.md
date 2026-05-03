# Operations: Knowledge Graph Visualization

## RebuildMirrorProjection

**Type:** Operation (mutation)
**Actor:** System indexer or authorized maintainer
**Triggers:** Initial load, explicit refresh action, scheduled docs sync

### Input

| Field       | Type     | Required | Description                                              |
| ----------- | -------- | -------- | -------------------------------------------------------- |
| featureId   | string   | yes      | Target feature slug                                      |
| sourceFiles | string[] | yes      | Candidate markdown files to read and parse for mirroring |
| requestedBy | string   | yes      | Trigger identity                                         |

### Rules

| ID  | Rule                                          | Formal                                                                        |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| R1  | Required mirror files must exist              | `{'SPEC.md','domain.md','operations.md'} subsetOf sourceFiles`                |
| R2  | Mirror card coverage is exact                 | `count(cards) = count(distinct mirroredFiles)`                                |
| R3  | Edge labels are canonical                     | `forall e in edges: e.edge in CanonicalRelationshipVocabulary`                |
| R4  | Edge endpoints resolve to concepts            | `forall e in edges: exists concept(e.from) and exists concept(e.to)`          |
| R5  | Projection persistence is atomic per snapshot | `persist(snapshot) succeeds once OR operation rejects with persistence error` |

### Calculations

| ID  | Calculation             | Formula                                       |
| --- | ----------------------- | --------------------------------------------- |
| C1  | Mirror card count       | `cardCount = count(distinct mirroredFiles)`   |
| C2  | Required coverage ratio | `coverageRatio = mirroredRequiredFiles / 3`   |
| C3  | Edge density            | `edgeDensity = edgeCount / max(nodeCount, 1)` |

### State Transition

[ExplorationSession](domain.md#explorationsession): `Idle -> ProjectionReady`

### Postconditions

- Parsed markdown entities and edges are persisted as one projection snapshot in the database.
- New [MirrorProjection](domain.md#mirrorprojection) snapshot is stored.
- One [MirrorCardView](domain.md#mirrorcardview) exists per mirrored file.
- [MirrorProjectionBuilt](events.md#mirrorprojectionbuilt) is emitted with snapshot summary.

### Error States

| Condition                               | Result                                                     |
| --------------------------------------- | ---------------------------------------------------------- |
| Missing required file                   | Reject rebuild with `MIRROR_REQUIRED_FILE_MISSING`         |
| Non-canonical edge label                | Reject rebuild with `MIRROR_EDGE_LABEL_INVALID`            |
| Unresolved edge endpoint                | Reject rebuild with `MIRROR_EDGE_ENDPOINT_UNKNOWN`         |
| Projection snapshot persistence failure | Reject rebuild with `MIRROR_PROJECTION_PERSISTENCE_FAILED` |

---

## SelectConcept

**Type:** Operation (mutation)
**Actor:** Authenticated user through UI click
**Triggers:** Concept click in card or graph node click

### Input

| Field     | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| sessionId | string | yes      | Active exploration session         |
| conceptId | string | yes      | Selected concept ID                |
| source    | string | yes      | `card` or `graph` selection source |

### Rules

| ID  | Rule                                          | Formal                                |
| --- | --------------------------------------------- | ------------------------------------- |
| R1  | Selected concept must exist                   | `exists concept(conceptId)`           |
| R2  | Selected concept must have definition pointer | `exists definitionPointer(conceptId)` |
| R3  | Source must be supported                      | `source in {'card','graph'}`          |

### Calculations

| ID  | Calculation             | Formula                                               |
| --- | ----------------------- | ----------------------------------------------------- |
| C1  | Inbound relation count  | `inboundCount = count(edges where to = conceptId)`    |
| C2  | Outbound relation count | `outboundCount = count(edges where from = conceptId)` |

### State Transition

[ExplorationSession](domain.md#explorationsession): `ProjectionReady -> ConceptFocused`

### Postconditions

- Session stores `selectedConceptId = conceptId`.
- [ConceptSelected](events.md#conceptselected) event is emitted.
- [ConceptDetailCard](domain.md#conceptdetailcard) becomes queryable for the selected concept.

### Error States

| Condition                  | Result                                         |
| -------------------------- | ---------------------------------------------- |
| Unknown concept            | Reject with `CONCEPT_NOT_FOUND`                |
| Missing definition pointer | Reject with `CONCEPT_DEFINITION_UNRESOLVED`    |
| Invalid source             | Reject with `CONCEPT_SELECTION_SOURCE_INVALID` |

---

## OpenDefinition

**Type:** Operation (mutation)
**Actor:** Authenticated user
**Triggers:** "Open definition" click from detail card

### Input

| Field     | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| sessionId | string | yes      | Active exploration session |
| conceptId | string | yes      | Focused concept ID         |

### Rules

| ID  | Rule                               | Formal                                                            |
| --- | ---------------------------------- | ----------------------------------------------------------------- |
| R1  | Session concept must match request | `session.selectedConceptId = conceptId`                           |
| R2  | Definition pointer must resolve    | `exists file(pointer.filePath) and exists anchor(pointer.anchor)` |

### Calculations

| ID  | Calculation | Formula                                            |
| --- | ----------- | -------------------------------------------------- |
| C1  | Target URL  | `target = pointer.filePath + '#' + pointer.anchor` |

### State Transition

[ExplorationSession](domain.md#explorationsession): `ConceptFocused -> DefinitionOpened`

### Postconditions

- Session stores `lastDefinitionTarget` URL.
- [DefinitionOpened](events.md#definitionopened) event is emitted.
- Caller receives resolved [DefinitionPointer](domain.md#definitionpointer).

### Error States

| Condition        | Result                                     |
| ---------------- | ------------------------------------------ |
| Session mismatch | Reject with `DEFINITION_SESSION_MISMATCH`  |
| Missing pointer  | Reject with `DEFINITION_POINTER_NOT_FOUND` |
| Anchor not found | Reject with `DEFINITION_ANCHOR_NOT_FOUND`  |
