---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-01
docType: events
---

# Events: GoldenQuill Promotion Governance

## GrantRunNodeRecorded

**Produced by:** [RecordGrantRunEvent](operations.md#recordgrantrunevent)
**Triggers transition:** [GrantRunTraversalState](states.md#grantruntraversalstate)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `run_id` | string | Bounded grant run id. |
| `node` | [GrantRunNode](domain.md#grantrunnode) | Recorded node. |
| `edges` | [GrantRunEdge](domain.md#grantrunedge)[] | Edges added with the node. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Grant DAG validator | Confirms traversal and gate legality. |
| KPI projection | Uses run events as evidence for process metrics. |

## GrantOutcomeEventRecorded

**Produced by:** [RecordOutcomeEvent](operations.md#recordoutcomeevent)
**Triggers transition:** [ApplicationLifecycleState](states.md#applicationlifecyclestate)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `event` | [GrantOutcomeEvent](domain.md#grantoutcomeevent) | Source-backed outcome event. |
| `source_ref` | [SourceRef](domain.md#sourceref) | Source evidence. |
| `interpretation_limits` | string[] | What the event cannot prove. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Lifecycle projector | Advances deepest verified application stage. |
| KPI projector | Computes lifecycle, outcome, effort, and relationship metrics. |
| Candidate generator | May create learning candidates after validation. |

## KpiObservationComputed

**Produced by:** [ComputeKpiObservation](operations.md#computekpiobservation)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `metric` | [GrantKpiObservation](domain.md#grantkpiobservation) | Computed KPI observation. |
| `source_events` | [GrantOutcomeEvent](domain.md#grantoutcomeevent)[] | Events used by the metric. |
| `denominator_definition` | string | Denominator semantics for rates or ratios. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Dashboard read model | Displays bounded metric with interpretation limits. |
| Candidate generator | May create candidate after validation. |
| Validator | Blocks denominatorless or source-less metrics. |

## PromotionCandidateCreated

**Produced by:** [CreatePromotionCandidate](operations.md#createpromotioncandidate)
**Triggers transition:** [PromotionCandidateState](states.md#promotioncandidatestate)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `candidate` | [PromotionCandidate](domain.md#promotioncandidate) | Candidate learning object. |
| `source_events` | [GrantOutcomeEvent](domain.md#grantoutcomeevent)[] | Outcome evidence. |
| `source_kpis` | [GrantKpiObservation](domain.md#grantkpiobservation)[] | KPI evidence. |
| `proposed_allowed_uses` | [AllowedUse](domain.md#alloweduse)[] | Requested uses before owner decision. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Governance validator | Checks evidence, owner, review gate, contradiction path, and privacy scope. |
| Ontology Vault projection | Maps local candidate into governance-compatible shape. |

## GovernanceProjectionValidated

**Produced by:** [ValidatePromotionGovernance](operations.md#validatepromotiongovernance)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `candidate_id` | string | Candidate id. |
| `projection` | [OntologyVaultProjection](mappings.md#ontologyvaultprojection) | Governance projection. |
| `validation_result` | [ValidationState](domain.md#validationstate) | Checked, failed, waived, or contradicted. |
| `residue` | string[] | Warnings or deferred issues. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Privacy gate | Determines whether workspace-safe reuse can be considered. |
| Owner decision route | Receives pass/block/flag state before decision. |

## OwnerDecisionRecorded

**Produced by:** [RecordOwnerDecision](operations.md#recordownerdecision)
**Triggers transition:** [OwnerDecisionState](states.md#ownerdecisionstate)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `decision` | [OwnerDecision](domain.md#ownerdecision) | Final owner disposition. |
| `approved_allowed_uses` | [AllowedUse](domain.md#alloweduse)[] | Approved uses when decision is approved. |
| `decision_source` | [SourceRef](domain.md#sourceref) | Evidence for decision. |

### Consumed by

| Consumer | Action |
| --- | --- |
| GoldenQuill runtime planning | Determines what later implementation routes may consume. |
| Ontology Vault governance handoff | Receives approved/rejected/retired/contradicted result. |
| Audit trail | Records authority boundary and approved uses. |
