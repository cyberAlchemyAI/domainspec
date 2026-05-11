# Events: Knowledge Graph Visualization

## Capability Backlinks

- [Aspect Whiteboard Navigation](SPEC.md#aspect-whiteboard-navigation)
- [SPEC-Level Feature Atlas](SPEC.md#spec-level-feature-atlas)
- [Graph Layout & Edge Semantics Algorithm](SPEC.md#graph-layout--edge-semantics-algorithm)
- [Feature Drilldown By Aspect](SPEC.md#feature-drilldown-by-aspect)
- [Cross-Project Documentation Scope](SPEC.md#cross-project-documentation-scope)

## MirrorProjectionBuilt

**Produced by:** [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)
**Triggers transition:** [Idle -> ProjectionReady](states.md#explorationstate)

### Payload

| Field              | Type              | Description                                                   |
| ------------------ | ----------------- | ------------------------------------------------------------- |
| projectKey         | string            | Source project key                                            |
| featureId          | string            | Feature slug                                                  |
| snapshotId         | string            | Projection snapshot ID                                        |
| hierarchySignature | string            | Deterministic `feature -> file -> concept` snapshot signature |
| cardCount          | integer           | Number of mirrored file-level cards                           |
| edgeCount          | integer           | Number of graph edges                                         |
| crossFeatureEdges  | integer           | Number of cross-feature edges with navigation metadata        |
| generatedAt        | string (ISO-8601) | Projection generation timestamp                               |

### Consumed by

| Consumer            | Action                                                                     |
| ------------------- | -------------------------------------------------------------------------- |
| HTTP rebuild caller | Receives snapshot summary and triggers follow-up reads.                    |
| Graph read path     | Uses `hierarchySignature` to guarantee deterministic projection responses. |

---

## ConceptSelected

**Produced by:** [SelectConcept](operations.md#selectconcept)
**Triggers transition:** [ProjectionReady -> ConceptFocused](states.md#explorationstate)

### Payload

| Field              | Type              | Description                                                      |
| ------------------ | ----------------- | ---------------------------------------------------------------- |
| sessionId          | string            | Active session                                                   |
| projectKey         | string            | Active source project                                            |
| featureId          | string            | Active feature                                                   |
| conceptId          | string            | Focused concept                                                  |
| source             | string            | Selection source (`rail`, `board`, `detail`, `card`, or `graph`) |
| highlightedEdgeKey | string            | Edge key when selection follows cross-feature edge interaction   |
| selectedAt         | string (ISO-8601) | Selection timestamp                                              |

### Consumed by

| Consumer                  | Action                                                          |
| ------------------------- | --------------------------------------------------------------- |
| Concept detail route path | Uses selection context to resolve deterministic detail payload. |
| Graph highlight renderer  | Reapplies `highlightedEdgeKey` after scope/navigation handoff.  |

---

## DefinitionOpened

**Produced by:** [OpenDefinition](operations.md#opendefinition)
**Triggers transition:** [ConceptFocused -> DefinitionOpened](states.md#explorationstate)

### Payload

| Field          | Type              | Description                                             |
| -------------- | ----------------- | ------------------------------------------------------- |
| sessionId      | string            | Active session                                          |
| conceptId      | string            | Focused concept                                         |
| filePath       | string            | Target definition file                                  |
| anchor         | string            | Target definition anchor                                |
| aspectKind     | string            | Aspect activated for definition visualization           |
| enrichmentMode | string            | `explicit` or deterministic `fallback` mode for details |
| openedAt       | string (ISO-8601) | Navigation timestamp                                    |

### Consumed by

| Consumer                    | Action                                                             |
| --------------------------- | ------------------------------------------------------------------ |
| Open-definition HTTP caller | Receives deterministic target (`filePath#anchor`) for navigation.  |
| Detail panel state sync     | Preserves enrichment semantics while user returns from definition. |
