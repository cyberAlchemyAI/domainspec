# Mappings: Knowledge Graph Visualization

## Capability Backlinks

- [Aspect Whiteboard Navigation](SPEC.md#aspect-whiteboard-navigation)
- [SPEC-Level Feature Atlas](SPEC.md#spec-level-feature-atlas)
- [Graph Layout & Edge Semantics Algorithm](SPEC.md#graph-layout--edge-semantics-algorithm)
- [Feature Drilldown By Aspect](SPEC.md#feature-drilldown-by-aspect)
- [Cross-Project Documentation Scope](SPEC.md#cross-project-documentation-scope)

## DocumentToConceptMapping

**From:** Markdown feature docs (`SPEC.md`, aspect files, optional story/test/UI docs)
**To:** [FeatureDocument](domain.md#featuredocument), [ConceptDefinition](domain.md#conceptdefinition), [RelationshipEdge](domain.md#relationshipedge)
**Direction:** Inbound

### Field Mapping

| Source Field                                | Target Field                                                    | Transform            | Notes                                                  |
| ------------------------------------------- | --------------------------------------------------------------- | -------------------- | ------------------------------------------------------ |
| file path                                   | [FeatureDocument](domain.md#featuredocument).path               | direct               | Relative docs path                                     |
| sorted file index                           | [FeatureDocument](domain.md#featuredocument).fileOrder          | derive               | Deterministic order in hierarchy                       |
| feature slug + file path                    | [FeatureDocument](domain.md#featuredocument).hierarchyPath      | derive               | Stable `feature -> file` hierarchy key                 |
| file category                               | [FeatureDocument](domain.md#featuredocument).aspectKind         | normalize            | Map file name to [AspectKind](domain.md#aspectkind)    |
| heading anchor                              | [ConceptDefinition](domain.md#conceptdefinition).sourceAnchor   | normalize            | Lowercase markdown anchor                              |
| concept table row ID                        | [ConceptDefinition](domain.md#conceptdefinition).conceptId      | direct               | Canonical concept ID                                   |
| concept summary/description text            | [ConceptDefinition](domain.md#conceptdefinition).summary        | normalize + fallback | Deterministic fallback if explicit summary is missing  |
| concept rules/invariants bullets            | [ConceptDefinition](domain.md#conceptdefinition).rules          | collect              | Parsed when available from aspect docs                 |
| enrichment availability                     | [ConceptDefinition](domain.md#conceptdefinition).enrichmentMode | derive               | `explicit` or deterministic `fallback`                 |
| feature graph row `From/Edge/To`            | [RelationshipEdge](domain.md#relationshipedge)                  | direct + validate    | Edge must be canonical                                 |
| relationship evidence/notes                 | [RelationshipEdge](domain.md#relationshipedge).evidence         | normalize + fallback | Used for semantic `why` labels                         |
| cross-feature target columns (when present) | [RelationshipEdge](domain.md#relationshipedge).targetFeatureId  | direct               | Enables cross-feature navigation and highlight handoff |

### Defaults

| Target Field                                                    | Default Value            | Condition                        |
| --------------------------------------------------------------- | ------------------------ | -------------------------------- |
| [FeatureDocument](domain.md#featuredocument).updatedAt          | index timestamp          | Always                           |
| [ConceptDefinition](domain.md#conceptdefinition).description    | `""`                     | No explicit extended description |
| [ConceptDefinition](domain.md#conceptdefinition).rules          | `[]`                     | No explicit rules found          |
| [ConceptDefinition](domain.md#conceptdefinition).summary        | heading-derived fallback | Empty summary/description cell   |
| [ConceptDefinition](domain.md#conceptdefinition).enrichmentMode | `fallback`               | Description/rules unavailable    |
| [RelationshipEdge](domain.md#relationshipedge).notes            | `""`                     | Notes cell missing               |

### Validation

| Field                                                        | Validation                                         | On Failure     |
| ------------------------------------------------------------ | -------------------------------------------------- | -------------- |
| [RelationshipEdge](domain.md#relationshipedge).edge          | Must exist in `RELATIONSHIPS.md`                   | Reject rebuild |
| [RelationshipEdge](domain.md#relationshipedge).fromConceptId | Must resolve concept ID                            | Reject rebuild |
| [RelationshipEdge](domain.md#relationshipedge).toConceptId   | Must resolve concept ID                            | Reject rebuild |
| [FeatureDocument](domain.md#featuredocument).hierarchyPath   | Must be unique per `(projectKey, featureId, path)` | Reject rebuild |

---

## DocumentToMirrorCardAdapter

**From:** [FeatureDocument](domain.md#featuredocument) + parsed counts
**To:** [MirrorCardView](domain.md#mirrorcardview)
**Direction:** Outbound

### Field Mapping

| Source Field                                               | Target Field                                             | Transform | Notes                               |
| ---------------------------------------------------------- | -------------------------------------------------------- | --------- | ----------------------------------- |
| [FeatureDocument](domain.md#featuredocument).id            | [MirrorCardView](domain.md#mirrorcardview).cardId        | direct    | Stable deterministic card ID        |
| [FeatureDocument](domain.md#featuredocument).featureId     | [MirrorCardView](domain.md#mirrorcardview).featureId     | direct    | Feature ownership key               |
| [FeatureDocument](domain.md#featuredocument).path          | [MirrorCardView](domain.md#mirrorcardview).filePath      | direct    | Unique file key                     |
| [FeatureDocument](domain.md#featuredocument).hierarchyPath | [MirrorCardView](domain.md#mirrorcardview).hierarchyPath | direct    | Stable `feature -> file` path       |
| [FeatureDocument](domain.md#featuredocument).aspectKind    | [MirrorCardView](domain.md#mirrorcardview).title         | derive    | Title from aspect kind              |
| parsed concept count                                       | [MirrorCardView](domain.md#mirrorcardview).conceptCount  | direct    | Count per file                      |
| parsed story count                                         | [MirrorCardView](domain.md#mirrorcardview).storyCount    | direct    | Story links per file                |
| parsed relation count                                      | [MirrorCardView](domain.md#mirrorcardview).relationCount | direct    | Relation edges per file             |
| checksum comparison                                        | [MirrorCardView](domain.md#mirrorcardview).freshness     | derive    | `up-to-date`, `stale`, or `missing` |

### Defaults

| Target Field                                             | Default Value | Condition              |
| -------------------------------------------------------- | ------------- | ---------------------- |
| [MirrorCardView](domain.md#mirrorcardview).conceptCount  | 0             | No concept rows parsed |
| [MirrorCardView](domain.md#mirrorcardview).storyCount    | 0             | No story links parsed  |
| [MirrorCardView](domain.md#mirrorcardview).relationCount | 0             | No graph rows parsed   |

### Validation

| Field                                               | Validation                       | On Failure              |
| --------------------------------------------------- | -------------------------------- | ----------------------- |
| [MirrorCardView](domain.md#mirrorcardview).filePath | Must be unique in one projection | Reject projection write |
| [MirrorCardView](domain.md#mirrorcardview).cardId   | Must be deterministic by input   | Reject projection write |

---

## ConceptToDetailCardAdapter

**From:** [ConceptDefinition](domain.md#conceptdefinition) + related [RelationshipEdge](domain.md#relationshipedge)[]
**To:** [ConceptDetailCard](domain.md#conceptdetailcard)
**Direction:** Outbound

### Field Mapping

| Source Field                                                       | Target Field                                                       | Transform | Notes                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | --------- | -------------------------------------- |
| [ConceptDefinition](domain.md#conceptdefinition).conceptId         | [ConceptDetailCard](domain.md#conceptdetailcard).conceptId         | direct    | Selected concept                       |
| [ConceptDefinition](domain.md#conceptdefinition).name              | [ConceptDetailCard](domain.md#conceptdetailcard).title             | direct    | Header label                           |
| [ConceptDefinition](domain.md#conceptdefinition).summary           | [ConceptDetailCard](domain.md#conceptdetailcard).summary           | direct    | Summary text                           |
| [ConceptDefinition](domain.md#conceptdefinition).description       | [ConceptDetailCard](domain.md#conceptdetailcard).description       | direct    | Optional extended description          |
| [ConceptDefinition](domain.md#conceptdefinition).rules             | [ConceptDetailCard](domain.md#conceptdetailcard).rules             | direct    | Optional rule list                     |
| [ConceptDefinition](domain.md#conceptdefinition).enrichmentMode    | [ConceptDetailCard](domain.md#conceptdetailcard).enrichmentMode    | direct    | `explicit` or deterministic `fallback` |
| [ConceptDefinition](domain.md#conceptdefinition).definitionPointer | [ConceptDetailCard](domain.md#conceptdetailcard).definition        | direct    | Deep-link target                       |
| edges where to = conceptId                                         | [ConceptDetailCard](domain.md#conceptdetailcard).inboundRelations  | filter    | Incoming relations                     |
| edges where from = conceptId                                       | [ConceptDetailCard](domain.md#conceptdetailcard).outboundRelations | filter    | Outgoing relations                     |

### Defaults

| Target Field      | Default Value | Condition         |
| ----------------- | ------------- | ----------------- |
| description       | `""`          | No explicit text  |
| rules             | []            | No explicit rules |
| inboundRelations  | []            | No incoming edges |
| outboundRelations | []            | No outgoing edges |

### Validation

| Field      | Validation                           | On Failure                                  |
| ---------- | ------------------------------------ | ------------------------------------------- |
| definition | `filePath` and `anchor` must resolve | Return explicit unresolved-definition error |
