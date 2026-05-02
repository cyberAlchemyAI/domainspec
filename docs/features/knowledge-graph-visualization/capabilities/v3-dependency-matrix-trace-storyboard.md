# Capability: V3 Dependency Matrix + Trace Storyboard

## Purpose

Provide a governance-first view that turns graph relationships into release-risk signals, actionable matrix views, and audit-ready impact storyboards.

## Primary User Journey

1. Governance reviewer opens dependency matrix and filters by risk band.
2. Reviewer selects one high-risk feature pair cell.
3. System computes or refreshes dependency risk score for the selected pair.
4. Reviewer opens impact storyboard for release impact context.
5. Governance lead approves or rejects risk exception with explicit justification.

## Matrix Semantics

| Matrix Dimension        | Meaning                            | Backing Contract                                                          |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| Row (source feature)    | Potential dependency source        | [GetDependencyMatrix](../queries.md#getdependencymatrix)                  |
| Column (target feature) | Potential dependency target        | [GetDependencyMatrix](../queries.md#getdependencymatrix)                  |
| Cell risk score         | Quantified coupling risk (0-100)   | [ComputeDependencyRiskScore](../operations.md#computedependencyriskscore) |
| Cell risk state         | Current governance state           | [DependencyRiskState](../states.md#dependencyriskstate)                   |
| Cell evidence           | Paths and edge evidence references | [GetImpactStoryboard](../queries.md#getimpactstoryboard)                  |

## Coupling Score Bands

| Score Range        | State     | Governance Meaning                             |
| ------------------ | --------- | ---------------------------------------------- |
| 0-24               | Stable    | Routine monitoring only                        |
| 25-49              | Watch     | Add to watchlist for next governance cycle     |
| 50-74              | Warning   | Mandatory release impact analysis              |
| 75-100             | Critical  | Release gate decision required                 |
| Exception-approved | Mitigated | Temporary override with expiry and audit trail |

## Storyboard Trace Evidence Model

| Field           | Source                                                        | Meaning                              |
| --------------- | ------------------------------------------------------------- | ------------------------------------ |
| storyboardId    | [GetImpactStoryboard](../queries.md#getimpactstoryboard)      | Stable storyboard identifier         |
| sourceFeatureId | [FeaturePairImpact](../domain.md#featurepairimpact)           | Pair source                          |
| targetFeatureId | [FeaturePairImpact](../domain.md#featurepairimpact)           | Pair target                          |
| steps[]         | [TraceStep](../domain.md#tracestep)                           | Ordered dependency propagation steps |
| riskScore       | [FeaturePairImpact](../domain.md#featurepairimpact).riskScore | Numeric risk score                   |
| riskBand        | [FeaturePairImpact](../domain.md#featurepairimpact).riskBand  | Governance state band                |
| evidencePaths[] | [TraceStep](../domain.md#tracestep).evidencePath              | Traceable source references          |

## Risk Triage Interactions

| Interaction        | Contract                                                                  | Outcome                                          |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------------------------ |
| Refresh risk score | [ComputeDependencyRiskScore](../operations.md#computedependencyriskscore) | Matrix cell score and state recomputed           |
| Build storyboard   | [BuildImpactStoryboard](../operations.md#buildimpactstoryboard)           | Publish release impact narrative for a pair      |
| Approve exception  | [ApproveRiskException](../operations.md#approveriskexception)             | State transition to Mitigated with audit payload |

## Acceptance Checks

- [ ] Matrix retrieval returns per-pair score, state, and evidence availability.
- [ ] Score bands map deterministically to [DependencyRiskState](../states.md#dependencyriskstate).
- [ ] Storyboard output is traceable from matrix cell to ordered evidence steps.
- [ ] Exception approval is bounded by justification and expiration policies.
- [ ] All governance outcomes are represented by explicit state transitions and events.

## Story Links

- [US-V3-01](../STORIES.md#us-v3-01-review-dependency-matrix-risk-bands)
- [US-V3-02](../STORIES.md#us-v3-02-analyze-release-impact-storyboard)
- [US-V3-03](../STORIES.md#us-v3-03-approve-temporary-risk-exception)
