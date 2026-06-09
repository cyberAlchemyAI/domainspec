---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-08
docType: events
---

# Events: GoldenQuill Promotion Governance

## GrantWorkEventAccepted

**Produced by:** [AcceptGrantWorkEvent](operations.md#acceptgrantworkevent)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `event` | [GrantWorkEvent](domain.md#grantworkevent) | Accepted event. |
| `envelope` | [GrantWorkEventEnvelope](domain.md#grantworkeventenvelope) | Producer, source, scope, and idempotency wrapper. |
| `producer` | [AdapterProducer](domain.md#adapterproducer) | Adapter or component that emitted the event. |

### Consumed by

| Consumer | Action |
| --- | --- |
| DAG projector | Projects accepted events into run nodes and edges. |
| Lifecycle/KPI projector | Projects source-backed events into lifecycle and metric read models. |
| Candidate builder | Consumes validated event projections, not raw adapter output. |

## GrantWorkEventRejected

**Produced by:** [AcceptGrantWorkEvent](operations.md#acceptgrantworkevent)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `event_id` | string | Rejected event id. |
| `producer` | [AdapterProducer](domain.md#adapterproducer) | Producer that emitted the rejected event. |
| `blocked_reason` | string | Missing source, missing idempotency, duplicate conflict, premature approved use, or other failure. |
| `residue` | string[] | Deferred investigation notes. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Adapter owner | Fixes producer or source issue. |
| Observability | Counts producer and event-family rejection rates. |

## DagProjectionUpdated

**Produced by:** [ProjectEventToDag](operations.md#projecteventtodag)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `receipt` | [EventProjectionReceipt](domain.md#eventprojectionreceipt) | Projection receipt. |
| `created_nodes` | [GrantRunNode](domain.md#grantrunnode)[] | Nodes created by projection. |
| `created_edges` | [GrantRunEdge](domain.md#grantrunedge)[] | Edges created by projection. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Grant DAG validator | Confirms traversal and gate legality. |
| Audit trail | Links DAG changes back to accepted events. |

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

## KpiProjectionUpdated

**Produced by:** [ProjectEventToLifecycleAndKpi](operations.md#projecteventtolifecycleandkpi)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `receipt` | [EventProjectionReceipt](domain.md#eventprojectionreceipt) | Projection receipt. |
| `lifecycle_refs` | string[] | Lifecycle states created or updated. |
| `kpi_refs` | string[] | KPI observations created or updated. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Dashboard read model | Displays bounded metric observations. |
| Candidate generator | Uses validated KPI observations as candidate inputs. |

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

## PromotionCandidateProjected

**Produced by:** [ProjectEventToLifecycleAndKpi](operations.md#projecteventtolifecycleandkpi) or [CreatePromotionCandidate](operations.md#createpromotioncandidate)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `candidate` | [PromotionCandidate](domain.md#promotioncandidate) | Candidate produced from validated event, outcome, KPI, or evidence packet inputs. |
| `projection_receipt` | [EventProjectionReceipt](domain.md#eventprojectionreceipt) | Event projection receipt when candidate came from an accepted event. |
| `source_refs` | [SourceRef](domain.md#sourceref)[] | Source evidence refs. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Governance validator | Checks owner, evidence, contradiction path, and privacy scope. |

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

## ApprovedReusePacketPublished

**Produced by:** [PublishApprovedReusePacket](operations.md#publishapprovedreusepacket)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `packet` | [ApprovedReusePacket](domain.md#approvedreusepacket) | Approved reuse handoff. |
| `decision` | [OwnerDecision](domain.md#ownerdecision) | Owner decision authorizing reuse. |
| `approved_allowed_uses` | [AllowedUse](domain.md#alloweduse)[] | Uses approved by the owner. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Future grant context hydrator | Feeds approved learning into future grant-work context. |
| Memory query surface | Retrieves approved learning within scope. |
| Audit trail | Links future use back to owner decision. |

## FutureGrantContextHydrated

**Produced by:** [HydrateFutureGrantContext](operations.md#hydratefuturegrantcontext)

### Payload

| Field | Type | Description |
| --- | --- | --- |
| `consumer` | string | Future grant-work consumer. |
| `packets` | [ApprovedReusePacket](domain.md#approvedreusepacket)[] | Packets used for hydration. |
| `requested_use` | [AllowedUse](domain.md#alloweduse) | Use requested by consumer. |
| `audit_ref` | string | Hydration audit reference. |

### Consumed by

| Consumer | Action |
| --- | --- |
| Scout, Scribe, Judge, Logician, Funding Goal, or memory query | Uses approved learning within allowed scope. |
