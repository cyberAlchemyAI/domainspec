# Mappings: Knowledge Graph Visualization

## DocumentToConceptMapping

**From:** Markdown feature docs (`SPEC.md`, `domain.md`, `operations.md`, optional aspects)
**To:** [FeatureDocument](domain.md#featuredocument), [ConceptDefinition](domain.md#conceptdefinition), [RelationshipEdge](domain.md#relationshipedge)
**Direction:** Inbound

### Field Mapping

| Source Field                     | Target Field                                                  | Transform         | Notes                                               |
| -------------------------------- | ------------------------------------------------------------- | ----------------- | --------------------------------------------------- |
| file path                        | [FeatureDocument](domain.md#featuredocument).path             | direct            | Relative docs path                                  |
| file category                    | [FeatureDocument](domain.md#featuredocument).aspectKind       | normalize         | Map file name to [AspectKind](domain.md#aspectkind) |
| heading anchor                   | [ConceptDefinition](domain.md#conceptdefinition).sourceAnchor | normalize         | Lowercase markdown anchor                           |
| concept table row ID             | [ConceptDefinition](domain.md#conceptdefinition).conceptId    | direct            | Canonical concept ID                                |
| feature graph row `From/Edge/To` | [RelationshipEdge](domain.md#relationshipedge)                | direct + validate | Edge must be canonical                              |

### Defaults

| Target Field                                             | Default Value           | Condition              |
| -------------------------------------------------------- | ----------------------- | ---------------------- |
| [FeatureDocument](domain.md#featuredocument).updatedAt   | index timestamp         | Always                 |
| [ConceptDefinition](domain.md#conceptdefinition).summary | `"No summary provided"` | Empty description cell |
| [RelationshipEdge](domain.md#relationshipedge).notes     | `""`                    | Notes cell missing     |

### Validation

| Field                                                        | Validation                     | On Failure     |
| ------------------------------------------------------------ | ------------------------------ | -------------- |
| [RelationshipEdge](domain.md#relationshipedge).edge          | Must exist in RELATIONSHIPS.md | Reject rebuild |
| [RelationshipEdge](domain.md#relationshipedge).fromConceptId | Must resolve concept ID        | Reject rebuild |
| [RelationshipEdge](domain.md#relationshipedge).toConceptId   | Must resolve concept ID        | Reject rebuild |

---

## DocumentToMirrorCardAdapter

**From:** [FeatureDocument](domain.md#featuredocument) + parsed counts
**To:** [MirrorCardView](domain.md#mirrorcardview)
**Direction:** Outbound

### Field Mapping

| Source Field                                            | Target Field                                             | Transform | Notes                               |
| ------------------------------------------------------- | -------------------------------------------------------- | --------- | ----------------------------------- |
| [FeatureDocument](domain.md#featuredocument).path       | [MirrorCardView](domain.md#mirrorcardview).filePath      | direct    | Unique card key                     |
| [FeatureDocument](domain.md#featuredocument).aspectKind | [MirrorCardView](domain.md#mirrorcardview).title         | derive    | Title from aspect kind              |
| parsed concept count                                    | [MirrorCardView](domain.md#mirrorcardview).conceptCount  | direct    | Count per file                      |
| parsed relation count                                   | [MirrorCardView](domain.md#mirrorcardview).relationCount | direct    | Count per file                      |
| checksum comparison                                     | [MirrorCardView](domain.md#mirrorcardview).freshness     | derive    | `up-to-date`, `stale`, or `missing` |

### Defaults

| Target Field                                             | Default Value | Condition              |
| -------------------------------------------------------- | ------------- | ---------------------- |
| [MirrorCardView](domain.md#mirrorcardview).conceptCount  | 0             | No concept rows parsed |
| [MirrorCardView](domain.md#mirrorcardview).relationCount | 0             | No graph rows parsed   |

### Validation

| Field                                               | Validation                       | On Failure              |
| --------------------------------------------------- | -------------------------------- | ----------------------- |
| [MirrorCardView](domain.md#mirrorcardview).filePath | Must be unique in one projection | Reject projection write |

---

## ConceptToDetailCardAdapter

**From:** [ConceptDefinition](domain.md#conceptdefinition) + related [RelationshipEdge](domain.md#relationshipedge)[]
**To:** [ConceptDetailCard](domain.md#conceptdetailcard)
**Direction:** Outbound

### Field Mapping

| Source Field                                                       | Target Field                                                       | Transform | Notes              |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | --------- | ------------------ |
| [ConceptDefinition](domain.md#conceptdefinition).conceptId         | [ConceptDetailCard](domain.md#conceptdetailcard).conceptId         | direct    | Selected concept   |
| [ConceptDefinition](domain.md#conceptdefinition).name              | [ConceptDetailCard](domain.md#conceptdetailcard).title             | direct    | Header label       |
| [ConceptDefinition](domain.md#conceptdefinition).summary           | [ConceptDetailCard](domain.md#conceptdetailcard).summary           | direct    | Summary text       |
| [ConceptDefinition](domain.md#conceptdefinition).definitionPointer | [ConceptDetailCard](domain.md#conceptdetailcard).definition        | direct    | Deep-link target   |
| edges where to = conceptId                                         | [ConceptDetailCard](domain.md#conceptdetailcard).inboundRelations  | filter    | Incoming relations |
| edges where from = conceptId                                       | [ConceptDetailCard](domain.md#conceptdetailcard).outboundRelations | filter    | Outgoing relations |

### Defaults

| Target Field      | Default Value | Condition         |
| ----------------- | ------------- | ----------------- |
| inboundRelations  | []            | No incoming edges |
| outboundRelations | []            | No outgoing edges |

### Validation

| Field      | Validation                           | On Failure                                  |
| ---------- | ------------------------------------ | ------------------------------------------- |
| definition | `filePath` and `anchor` must resolve | Return explicit unresolved-definition error |
