# Operations: Knowledge Graph Visualization

## ComputeDependencyRiskScore

**Type:** Operation (mutation)
**Actor:** Governance analyst or scheduled governance process
**Triggers:** Matrix refresh, release gate check, or explicit risk recomputation request

### Input

| Field           | Type    | Required | Description                                                           |
| --------------- | ------- | -------- | --------------------------------------------------------------------- |
| sourceFeatureId | string  | yes      | Source feature namespace                                              |
| targetFeatureId | string  | yes      | Target feature namespace                                              |
| snapshotId      | string  | no       | Optional [GraphSnapshot](domain.md#graphsnapshot).snapshotId override |
| forceRecompute  | boolean | no       | Ignores cached score when true                                        |

### Rules

| ID  | Rule                                                     | Formal                                                |
| --- | -------------------------------------------------------- | ----------------------------------------------------- |
| R1  | Source and target must be different features             | `sourceFeatureId != targetFeatureId`                  |
| R2  | Source and target must exist in selected snapshot        | `exists(sourceFeatureId) and exists(targetFeatureId)` |
| R3  | Only canonical edge types are allowed in scoring input   | `forall edge in edges: edge.edgeType in EdgeType`     |
| R4  | Edge evidence paths are required for cross-feature edges | `edge.crossFeature -> edge.evidencePath != ""`        |
| R5  | Computation is deterministic for same snapshot and pair  | `sameInput -> sameScore`                              |

### Calculations

| ID  | Calculation                  | Formula                                                                                                      |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| C1  | StructuralCouplingRatio      | `structuralEdgeCount / max(totalEdgeCount, 1)`                                                               |
| C2  | CrossFeaturePropagationRatio | `crossFeatureEdgeCount / max(totalEdgeCount, 1)`                                                             |
| C3  | GovernanceExposureRatio      | `governanceEdgeCount / max(totalEdgeCount, 1)`                                                               |
| C4  | LifecycleVolatilityRatio     | `lifecycleEdgeCount / max(totalEdgeCount, 1)`                                                                |
| C5  | RiskScore                    | `round(100 * (0.35*C1 + 0.30*C2 + 0.20*C3 + 0.15*C4))`                                                       |
| C6  | RiskStateFromScore           | `if exceptionActive then Mitigated else score<=24:Stable, score<=49:Watch, score<=74:Warning, else Critical` |

### State Transition

`[DependencyRiskState](states.md#dependencyriskstate): {Stable|Watch|Warning|Critical|Mitigated} -> {Stable|Watch|Warning|Critical|Mitigated}`

### Postconditions

- One [FeaturePairImpact](domain.md#featurepairimpact) record exists for the source-target pair.
- [FeaturePairImpact](domain.md#featurepairimpact).riskScore and [FeaturePairImpact](domain.md#featurepairimpact).riskBand are updated for the selected snapshot.
- `DependencyRiskRaised` is emitted when new severity is higher than previous severity and resulting state is Warning or Critical.

### Error States

| Condition   | Result                                        |
| ----------- | --------------------------------------------- |
| R1 violated | Reject request as invalid pair                |
| R2 violated | Reject request as unknown feature reference   |
| R3 violated | Reject scoring input due to invalid edge type |
| R4 violated | Reject scoring input due to missing evidence  |

---

## BuildImpactStoryboard

**Type:** Operation (mutation)
**Actor:** Release manager or governance reviewer
**Triggers:** Release impact analysis request for one dependency pair

### Input

| Field                   | Type    | Required | Description                                     |
| ----------------------- | ------- | -------- | ----------------------------------------------- |
| sourceFeatureId         | string  | yes      | Source feature namespace                        |
| targetFeatureId         | string  | yes      | Target feature namespace                        |
| maxDepth                | number  | yes      | Traversal depth bound for storyboard generation |
| includeAlternativePaths | boolean | no       | Includes non-primary candidate paths when true  |
| releaseWindowId         | string  | no       | Optional release window reference               |

### Rules

| ID  | Rule                                                | Formal                                                        |
| --- | --------------------------------------------------- | ------------------------------------------------------------- |
| R1  | Dependency pair must have a computed risk score     | `exists(FeaturePairImpact(sourceFeatureId, targetFeatureId))` |
| R2  | maxDepth must be in valid range                     | `1 <= maxDepth <= 6`                                          |
| R3  | Storyboard path edges must use canonical edge types | `forall step.edgeType in EdgeType`                            |
| R4  | Every storyboard step must include evidence path    | `forall step: step.evidencePath != ""`                        |

### Calculations

| ID  | Calculation           | Formula                                                                                    |
| --- | --------------------- | ------------------------------------------------------------------------------------------ |
| C1  | PrimaryPathScore      | `sum(stepWeight(step)) / max(pathLength, 1)`                                               |
| C2  | StoryboardImpactScore | `round((riskScore * 0.60) + (crossFeatureStepRatio * 40))`                                 |
| C3  | StoryboardSeverity    | `if impactScore<=24:Stable, impactScore<=49:Watch, impactScore<=74:Warning, else Critical` |

### State Transition

`[DependencyRiskState](states.md#dependencyriskstate): no state change (analysis artifact generation)`

### Postconditions

- Storyboard trace is persisted with ordered [TraceStep](domain.md#tracestep) entries.
- Storyboard references current [FeaturePairImpact](domain.md#featurepairimpact).riskScore and risk band.
- `StoryboardPublished` is emitted with source-target pair and storyboard id.

### Error States

| Condition     | Result                                                           |
| ------------- | ---------------------------------------------------------------- |
| R1 violated   | Reject request because dependency pair has no scored matrix cell |
| R2 violated   | Reject request due to invalid depth                              |
| R3 violated   | Reject storyboard generation due to invalid edge types           |
| No path found | Return deterministic empty storyboard with reason                |

---

## ApproveRiskException

**Type:** Operation (mutation)
**Actor:** Governance lead
**Triggers:** Explicit exception approval for release decision

### Input

| Field           | Type              | Required | Description                    |
| --------------- | ----------------- | -------- | ------------------------------ |
| sourceFeatureId | string            | yes      | Source feature namespace       |
| targetFeatureId | string            | yes      | Target feature namespace       |
| approvedBy      | string            | yes      | Governance approver identifier |
| justification   | string            | yes      | Approval rationale             |
| expiresAt       | string (ISO-8601) | yes      | Exception expiration timestamp |

### Rules

| ID  | Rule                                                  | Formal                                |
| --- | ----------------------------------------------------- | ------------------------------------- |
| R1  | Only Warning or Critical pairs are exception-eligible | `currentState in {Warning, Critical}` |
| R2  | Justification must be explicit and non-trivial        | `length(trim(justification)) >= 30`   |
| R3  | Exception expiration is bounded                       | `expiresAt <= now + 30 days`          |
| R4  | Only one active exception per feature pair            | `count(activeExceptions(pair)) == 0`  |
| R5  | Approver identity is required                         | `approvedBy != ""`                    |

### Calculations

| ID  | Calculation            | Formula                      |
| --- | ---------------------- | ---------------------------- |
| C1  | ExceptionDurationHours | `(expiresAt - now) / 1 hour` |
| C2  | EffectiveRiskState     | `Mitigated`                  |

### State Transition

`[DependencyRiskState](states.md#dependencyriskstate): Warning|Critical -> Mitigated`

### Postconditions

- Active [RiskException](domain.md#riskexception) is persisted for source-target pair.
- [FeaturePairImpact](domain.md#featurepairimpact) keeps computed risk score while effective state becomes Mitigated.
- `DependencyRiskMitigated` is emitted with approver, justification, and expiry metadata.

### Error States

| Condition   | Result                                                 |
| ----------- | ------------------------------------------------------ |
| R1 violated | Reject request because pair is not exception-eligible  |
| R2 violated | Reject request due to insufficient justification       |
| R3 violated | Reject request due to excessive exception window       |
| R4 violated | Reject request because active exception already exists |
| R5 violated | Reject request due to missing approver identity        |
