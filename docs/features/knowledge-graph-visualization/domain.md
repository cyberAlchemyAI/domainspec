# Domain: Knowledge Graph Visualization

## Entities

### GraphSnapshot

Immutable metadata record describing one generated knowledge-graph snapshot used by read queries.

| Field             | Type              | Required | Description                             |
| ----------------- | ----------------- | -------- | --------------------------------------- |
| snapshotId        | string            | yes      | Snapshot identifier                     |
| generatedAt       | string (ISO-8601) | yes      | Generation timestamp                    |
| sourceVersion     | string            | yes      | Source docs index or build version      |
| featureCount      | number            | yes      | Number of distinct features represented |
| conceptCount      | number            | yes      | Number of concept nodes represented     |
| edgeCount         | number            | yes      | Number of typed edges represented       |
| staleAfterMinutes | number            | yes      | Freshness window used by consumers      |

**Queries:** [GetFeatureAtlas](queries.md#getfeatureatlas), [GetCapabilityNeighborhood](queries.md#getcapabilityneighborhood), [GetConceptInspectorContext](queries.md#getconceptinspectorcontext)

---

## Value Objects

### GraphNode

Canonical graph node representation for one DomainSpec concept.

| Field        | Type                                  | Constraint                           |
| ------------ | ------------------------------------- | ------------------------------------ |
| conceptId    | string                                | Must be globally unique in snapshot  |
| featureId    | string                                | Must reference one feature namespace |
| conceptType  | [ConceptType](#concepttype)           | Required                             |
| title        | string                                | Required, non-empty                  |
| sourcePath   | string                                | Relative doc path                    |
| sourceAnchor | string                                | Optional heading anchor              |
| status       | [FeatureDocStatus](#featuredocstatus) | Required                             |
| tags         | string[]                              | Optional, unique values              |

**Equality:** `conceptId`

---

### GraphEdge

Canonical typed relation between two graph nodes.

| Field         | Type                  | Constraint                                                   |
| ------------- | --------------------- | ------------------------------------------------------------ |
| edgeId        | string                | Must be unique in snapshot                                   |
| edgeType      | [EdgeType](#edgetype) | Required                                                     |
| fromConceptId | string                | Must reference an existing [GraphNode](#graphnode).conceptId |
| toConceptId   | string                | Must reference an existing [GraphNode](#graphnode).conceptId |
| crossFeature  | boolean               | Required                                                     |
| evidencePath  | string                | Source path for traceability                                 |

**Equality:** `edgeId`

---

### CapabilityAnchor

Stable address for one capability inside a feature.

| Field           | Type   | Constraint                      |
| --------------- | ------ | ------------------------------- |
| featureId       | string | Required                        |
| capabilityKey   | string | Required, unique inside feature |
| capabilityTitle | string | Required                        |
| specPath        | string | Required                        |
| specAnchor      | string | Required                        |
| summary         | string | Optional                        |

**Equality:** `(featureId, capabilityKey)`

---

### ViewFilter

Filter envelope used by atlas and neighborhood views.

| Field        | Type                                  | Constraint |
| ------------ | ------------------------------------- | ---------- |
| pillar       | string                                | Optional   |
| status       | [FeatureDocStatus](#featuredocstatus) | Optional   |
| priority     | string                                | Optional   |
| conceptTypes | [ConceptType](#concepttype)[]         | Optional   |
| edgeTypes    | [EdgeType](#edgetype)[]               | Optional   |
| tag          | string                                | Optional   |
| searchText   | string                                | Optional   |

**Equality:** field-by-field structural equality

---

### VisualizationProfile

Named profile with default filter and display behavior.

| Field            | Type                      | Constraint                     |
| ---------------- | ------------------------- | ------------------------------ |
| profileId        | string                    | Required                       |
| name             | string                    | Required                       |
| defaultFilter    | [ViewFilter](#viewfilter) | Required                       |
| showLegend       | boolean                   | Required                       |
| maxNeighborDepth | number                    | Must be in range [1, 2] for V1 |

**Equality:** `profileId`

---

### FeaturePairImpact

Governance view model for one source-target feature dependency pair in the matrix.

| Field                        | Type                  | Constraint                |
| ---------------------------- | --------------------- | ------------------------- |
| sourceFeatureId              | string                | Required                  |
| targetFeatureId              | string                | Required                  |
| snapshotId                   | string                | Required                  |
| structuralCouplingRatio      | number                | In range [0, 1]           |
| crossFeaturePropagationRatio | number                | In range [0, 1]           |
| governanceExposureRatio      | number                | In range [0, 1]           |
| lifecycleVolatilityRatio     | number                | In range [0, 1]           |
| riskScore                    | number                | Integer in range [0, 100] |
| riskBand                     | [RiskBand](#riskband) | Required                  |
| effectiveState               | [RiskBand](#riskband) | Required                  |
| activeExceptionId            | string                | Optional                  |

**Equality:** `(sourceFeatureId, targetFeatureId, snapshotId)`

---

### TraceStep

One ordered step in a published impact storyboard.

| Field         | Type                  | Constraint          |
| ------------- | --------------------- | ------------------- |
| stepIndex     | number                | Positive integer    |
| fromConceptId | string                | Required            |
| edgeType      | [EdgeType](#edgetype) | Required            |
| toConceptId   | string                | Required            |
| crossFeature  | boolean               | Required            |
| evidencePath  | string                | Required, non-empty |

**Equality:** `(stepIndex, fromConceptId, toConceptId, edgeType)`

---

### RiskException

Temporary governance override record for a dependency pair.

| Field           | Type                                        | Constraint                 |
| --------------- | ------------------------------------------- | -------------------------- |
| exceptionId     | string                                      | Required                   |
| sourceFeatureId | string                                      | Required                   |
| targetFeatureId | string                                      | Required                   |
| approvedBy      | string                                      | Required                   |
| justification   | string                                      | Required, minimum 30 chars |
| approvedAt      | string (ISO-8601)                           | Required                   |
| expiresAt       | string (ISO-8601)                           | Required                   |
| status          | [RiskExceptionStatus](#riskexceptionstatus) | Required                   |

**Equality:** `exceptionId`

---

## Enums

### ConceptType

| Value          | Description                         |
| -------------- | ----------------------------------- |
| Entity         | Backend structural entity           |
| ValueObject    | Backend structural value object     |
| EnumType       | Backend enum or type concept        |
| Operation      | Backend operation                   |
| Query          | Backend query                       |
| Calculation    | Backend calculation                 |
| Rule           | Backend rule                        |
| Policy         | Backend policy                      |
| Workflow       | Backend workflow                    |
| Saga           | Cross-feature orchestration concept |
| Interface      | API or module contract              |
| Event          | Domain event                        |
| Mapping        | Data transformation concept         |
| StateMachine   | Lifecycle model                     |
| Page           | UI page                             |
| Layout         | UI layout                           |
| Component      | UI component                        |
| ViewModel      | UI view model                       |
| Hook           | UI hook                             |
| Form           | UI form                             |
| Action         | UI action                           |
| Guard          | UI guard                            |
| Binding        | UI-to-backend binding               |
| Adapter        | UI adapter                          |
| StateIndicator | UI lifecycle indicator              |

### EdgeType

| Value          | Description                                    |
| -------------- | ---------------------------------------------- |
| performs       | Entity to operation edge                       |
| produces       | Operation to event edge                        |
| produces-for   | Cross-feature operation to foreign entity edge |
| triggers-cross | Cross-feature event to operation edge          |
| enforces-cross | Cross-feature rule to operation edge           |
| enforces       | Rule to operation edge                         |
| calculates     | Calculation to operation edge                  |
| transitions    | Event to state machine edge                    |
| exposes        | Interface to operation/query edge              |
| orchestrates   | Workflow to operations edge                    |
| applies        | Policy to operation edge                       |
| maps           | Mapping to entity/interface edge               |
| contains       | Entity to value object edge                    |
| queries        | Query to entity edge                           |
| emits          | Entity to event edge                           |
| renders        | Page to component edge                         |
| wraps          | Layout to page edge                            |
| composes       | Component to component edge                    |
| consumes       | Component to hook edge                         |
| submits        | Form to action edge                            |
| shapes         | Adapter to view model edge                     |
| protects       | Guard to page edge                             |
| displays       | Component to view model edge                   |
| fetches        | Binding to query edge                          |
| mutates        | Binding to operation edge                      |
| reflects       | State indicator to state machine edge          |
| derives        | View model to entity edge                      |
| contracts      | Form to interface edge                         |
| mirrors        | Guard to rule edge                             |

### FeatureDocStatus

| Value       | Description                                     |
| ----------- | ----------------------------------------------- |
| draft       | Early documentation state                       |
| planned     | Planned but not fully specified                 |
| in-progress | Active documentation work                       |
| implemented | Documentation aligned with implemented behavior |
| PASS        | Verification pass verdict                       |
| FLAG        | Verification flag verdict                       |
| BLOCK       | Verification block verdict                      |

### RiskBand

| Value     | Description                        |
| --------- | ---------------------------------- |
| Stable    | Low risk baseline state            |
| Watch     | Medium-low monitored state         |
| Warning   | Elevated governance-review state   |
| Critical  | High-risk release-gate state       |
| Mitigated | Exception-approved temporary state |

### RiskExceptionStatus

| Value   | Description                       |
| ------- | --------------------------------- |
| Active  | Exception is currently effective  |
| Expired | Exception reached expiration time |
| Revoked | Exception explicitly revoked      |
