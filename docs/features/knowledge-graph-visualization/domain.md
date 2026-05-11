# Domain: Knowledge Graph Visualization

## Capability Backlinks

- [Aspect Whiteboard Navigation](SPEC.md#aspect-whiteboard-navigation)
- [SPEC-Level Feature Atlas](SPEC.md#spec-level-feature-atlas)
- [Graph Layout & Edge Semantics Algorithm](SPEC.md#graph-layout--edge-semantics-algorithm)
- [Feature Drilldown By Aspect](SPEC.md#feature-drilldown-by-aspect)
- [Cross-Project Documentation Scope](SPEC.md#cross-project-documentation-scope)

## Entities

### DocumentationWorkspace

Represents one registered documentation source that can be projected by the same algorithm contract.

Source strategy is non-exclusive: `projectKey='poker-team'` is a baseline example, not a hard-coded source.

| Field                 | Type   | Required | Description                                                      |
| --------------------- | ------ | -------- | ---------------------------------------------------------------- |
| projectKey            | string | yes      | Stable project source key (for example `poker-team`)             |
| workspaceRootDir      | string | yes      | Absolute workspace root for the source project                   |
| featureDocsRootDir    | string | yes      | Root directory for feature docs under source (`docs/features/*`) |
| relationshipsFilePath | string | yes      | Canonical relationship vocabulary file for source                |
| status                | string | yes      | `active` or `disabled` source availability                       |

**Operations:** [ResolveProjectionScope](operations.md#resolveprojectionscope)

---

### FeatureDocument

Represents one source markdown file used to build deterministic file-level cards and concept extraction input.

| Field         | Type                      | Required | Description                                      |
| ------------- | ------------------------- | -------- | ------------------------------------------------ |
| id            | string                    | yes      | Stable file identifier                           |
| projectKey    | string                    | yes      | Source project key                               |
| featureId     | string                    | yes      | Owning feature slug                              |
| path          | string                    | yes      | Relative markdown path                           |
| aspectKind    | [AspectKind](#aspectkind) | yes      | File category mirrored in cards                  |
| fileOrder     | integer                   | yes      | Deterministic order in feature-to-file hierarchy |
| hierarchyPath | string                    | yes      | Deterministic hierarchy key (`featureId/path`)   |
| checksum      | string                    | yes      | Content hash for freshness tracking              |
| updatedAt     | string (ISO-8601)         | yes      | Last indexed timestamp                           |

**Operations:** [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)

---

### ConceptDefinition

Canonical concept entry derived from aspect docs, concept tables, and relationship index references.

| Field             | Type                                    | Required | Description                                                                         |
| ----------------- | --------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| conceptId         | string                                  | yes      | Canonical concept ID                                                                |
| name              | string                                  | yes      | Human-readable concept name                                                         |
| taxonomyType      | string                                  | yes      | Meta-concept type from taxonomy                                                     |
| summary           | string                                  | yes      | Short concept description, with deterministic fallback when explicit text is absent |
| description       | string                                  | no       | Expanded description when available in source docs                                  |
| rules             | string[]                                | no       | Rule bullets or invariants parsed from source docs                                  |
| sourceFilePath    | string                                  | yes      | File where concept is defined                                                       |
| sourceAnchor      | string                                  | yes      | Markdown anchor for deep-link                                                       |
| definitionPointer | [DefinitionPointer](#definitionpointer) | yes      | Navigation target bundle                                                            |
| enrichmentMode    | [EnrichmentMode](#enrichmentmode)       | yes      | `explicit` when description/rules exist, otherwise deterministic `fallback`         |

**Operations:** [SelectConcept](operations.md#selectconcept), [OpenDefinition](operations.md#opendefinition)

---

### MirrorProjection

Read-optimized aggregate snapshot that keeps hierarchy projection and edge semantics synchronized.

| Field               | Type                                    | Required | Description                                                               |
| ------------------- | --------------------------------------- | -------- | ------------------------------------------------------------------------- |
| snapshotId          | string                                  | yes      | Projection snapshot ID                                                    |
| projectKey          | string                                  | yes      | Source project key                                                        |
| featureId           | string                                  | yes      | Feature owner of projection                                               |
| generatedAt         | string (ISO-8601)                       | yes      | Snapshot generation time                                                  |
| hierarchySignature  | string                                  | yes      | Deterministic signature of ordered `feature -> file -> concept` hierarchy |
| relationColorPolicy | string                                  | yes      | Version/key for deterministic relation color mapping                      |
| nodeCount           | integer                                 | yes      | Number of rendered nodes                                                  |
| edgeCount           | integer                                 | yes      | Number of relationship edges                                              |
| cards               | [MirrorCardView](#mirrorcardview)[]     | yes      | One file-level card per mirrored aspect file                              |
| edges               | [RelationshipEdge](#relationshipedge)[] | yes      | Canonical relationship edges                                              |

**Operations:** [RebuildMirrorProjection](operations.md#rebuildmirrorprojection)

---

### ExplorationSession

Tracks current interaction focus and highlight state for one user on the whiteboard page.

| Field                | Type                                           | Required | Description                                         |
| -------------------- | ---------------------------------------------- | -------- | --------------------------------------------------- |
| sessionId            | string                                         | yes      | Session identifier                                  |
| projectKey           | string                                         | yes      | Active source project key                           |
| featureId            | string                                         | yes      | Active feature                                      |
| activeAspect         | [AspectKind](#aspectkind)                      | yes      | Active aspect card                                  |
| viewLevel            | string                                         | yes      | `aspect`, `feature`, or `concept` board depth       |
| selectedConceptId    | string                                         | no       | Currently focused concept                           |
| selectedFilePath     | string                                         | no       | Card-selected source file                           |
| highlightedEdgeKey   | string                                         | no       | Edge key highlighted after cross-feature navigation |
| lastDefinitionTarget | string                                         | no       | Last opened `file#anchor`                           |
| state                | [ExplorationState](states.md#explorationstate) | yes      | Session lifecycle state                             |

**Lifecycle:** See [ExplorationState](states.md#explorationstate)
**Operations:** [SelectConcept](operations.md#selectconcept), [OpenDefinition](operations.md#opendefinition)

---

## Value Objects

### ProjectionScope

Deterministic projection selector used across resolve, ingest, read, select, and open operations.

| Field      | Type   | Constraint                                                               |
| ---------- | ------ | ------------------------------------------------------------------------ |
| projectKey | string | Must resolve to active [DocumentationWorkspace](#documentationworkspace) |
| featureId  | string | Must exist under resolved `featureDocsRootDir`                           |

**Equality:** by `(projectKey, featureId)`.

---

### RelationshipEdge

One canonical graph edge between two concept IDs.

| Field            | Type   | Constraint                                                              |
| ---------------- | ------ | ----------------------------------------------------------------------- |
| fromConceptId    | string | Must exist in concept registry                                          |
| edge             | string | Must be canonical edge from `RELATIONSHIPS.md`                          |
| toConceptId      | string | Must exist in concept registry                                          |
| evidence         | string | Markdown link to supporting definition or relationship-index row        |
| notes            | string | Optional reviewer note used as deterministic fallback for `why` label   |
| targetProjectKey | string | Optional, required when edge crosses into another feature scope/project |
| targetFeatureId  | string | Optional, required when edge crosses into another feature scope/project |

**Equality:** by `(fromConceptId, edge, toConceptId, evidence)`.

---

### DefinitionPointer

Deep-link pointer to a concept definition.

| Field      | Type                      | Constraint                                                |
| ---------- | ------------------------- | --------------------------------------------------------- |
| filePath   | string                    | Relative markdown path under resolved workspace docs root |
| anchor     | string                    | Existing markdown heading anchor                          |
| lineHint   | integer                   | Positive when available, otherwise `0`                    |
| label      | string                    | Non-empty human label                                     |
| aspectKind | [AspectKind](#aspectkind) | Aspect to activate when opening target                    |

**Equality:** by `(filePath, anchor)`.

---

### MirrorCardView

File-level card payload shown in the aspect rail and hierarchy projection.

| Field         | Type                                | Constraint                       |
| ------------- | ----------------------------------- | -------------------------------- |
| cardId        | string                              | Stable deterministic identity    |
| projectKey    | string                              | Source project for this card     |
| featureId     | string                              | Owner feature slug               |
| filePath      | string                              | Unique per feature projection    |
| hierarchyPath | string                              | Must match `featureId/filePath`  |
| title         | string                              | Non-empty card title             |
| aspectKind    | [AspectKind](#aspectkind)           | Must match source file kind      |
| conceptCount  | integer                             | `>= 0`                           |
| storyCount    | integer                             | `>= 0`                           |
| relationCount | integer                             | `>= 0`                           |
| freshness     | [FreshnessStatus](#freshnessstatus) | Derived from checksum comparison |

**Equality:** by `(projectKey, featureId, filePath)`.

---

### ConceptDetailCard

Detail projection shown when a concept is selected.

| Field             | Type                                    | Constraint                                                        |
| ----------------- | --------------------------------------- | ----------------------------------------------------------------- |
| conceptId         | string                                  | Must exist in concept registry                                    |
| title             | string                                  | Non-empty                                                         |
| summary           | string                                  | Non-empty, explicit if available otherwise deterministic fallback |
| description       | string                                  | Optional extended narrative                                       |
| rules             | string[]                                | Optional rules/invariants                                         |
| enrichmentMode    | [EnrichmentMode](#enrichmentmode)       | Must match parsed enrichment availability                         |
| definition        | [DefinitionPointer](#definitionpointer) | Must resolve to existing file and anchor                          |
| inboundRelations  | [RelationshipEdge](#relationshipedge)[] | Canonical edges only                                              |
| outboundRelations | [RelationshipEdge](#relationshipedge)[] | Canonical edges only                                              |

**Equality:** by `conceptId` and projection timestamp.

---

## Deterministic Hierarchy Contract

| Level   | Source Entity                                                          | Rule                                                          |
| ------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| feature | [ProjectionScope](#projectionscope)                                    | Exactly one active feature root per projection request        |
| file    | [FeatureDocument](#featuredocument), [MirrorCardView](#mirrorcardview) | One card per indexed feature file, stable `fileOrder`         |
| concept | [ConceptDefinition](#conceptdefinition)                                | Concepts are children of exactly one file node for a snapshot |

## Enums

### AspectKind

| Value      | Description                           |
| ---------- | ------------------------------------- |
| SPEC       | Feature specification overview        |
| DOMAIN     | Structural domain definitions         |
| OPERATIONS | Mutating operation contracts          |
| QUERIES    | Read-model contracts                  |
| INTERFACES | API and module contracts              |
| MAPPINGS   | Transformation contracts              |
| WORKFLOWS  | Orchestration and policy contracts    |
| EVENTS     | Domain event contracts                |
| STATES     | State machine contracts               |
| STORIES    | Story and acceptance coverage         |
| TEST-SPEC  | Deterministic verification contract   |
| UI-SPEC    | Interaction and presentation contract |
| DECISIONS  | Decision and governance register      |

### FreshnessStatus

| Value      | Description                             |
| ---------- | --------------------------------------- |
| up-to-date | File checksum matches indexed snapshot  |
| stale      | File changed after projection timestamp |
| missing    | Required file could not be loaded       |

### EnrichmentMode

| Value    | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| explicit | Summary/description/rules were explicitly found in source concept definitions |
| fallback | Deterministic fallback was used from heading, relationship evidence, or notes |
