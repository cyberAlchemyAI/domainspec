---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-01
docType: operations
---

# Operations: GoldenQuill Promotion Governance

## RecordGrantRunEvent

**Type:** Operation
**Actor:** GoldenQuill workflow component or operator.
**Triggers:** A grant run step, artifact, gate, revision, approval, block, or delivery is captured.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `node` | [GrantRunNode](domain.md#grantrunnode) | yes | Node to add or update. |
| `edges` | [GrantRunEdge](domain.md#grantrunedge)[] | no | Edges that connect the node to prior or downstream nodes. |
| `run_id` | string | yes | Bounded grant run id. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | [GrantRunNode](domain.md#grantrunnode).`node_kind` must be in [GrantRunNodeKind](domain.md#grantrunnodekind). | `node.node_kind in GrantRunNodeKind` |
| R2 | [GrantRunEdge](domain.md#grantrunedge).`edge_kind` must be in [GrantRunEdgeKind](domain.md#grantrunedgekind). | `all(edge.edge_kind in GrantRunEdgeKind for edge in edges)` |
| R3 | Non-initial nodes must connect to a prior run node. | `node.node_kind != run_context -> exists edge.to_node == node.node_id` |
| R4 | `blocked_by_gate` prevents downstream traversal until reopened by operator decision or evidence fix. | `blocked_by_gate -> no downstream draft_or_delivery_without_reopen` |

### State Transition

[GrantRunTraversalState](states.md#grantruntraversalstate): `not_started -> active -> blocked | delivered`

### Postconditions

- The run DAG can answer what happened, in what order, and which gate allowed or blocked the next step.
- The validator can explain every draft, delivery, KPI, or candidate through a prior run node and gate.

### Error States

| Condition | Result |
| --- | --- |
| Unknown node kind | Reject node and return validation failure. |
| Unknown edge kind | Reject edge and return validation failure. |
| Downstream step after blocked gate without reopen evidence | Reject traversal. |

## RecordOutcomeEvent

**Type:** Operation
**Actor:** GoldenQuill metric intake, operator, or source importer.
**Triggers:** Source-backed grant movement occurs.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | [GrantOutcomeEvent](domain.md#grantoutcomeevent) | yes | Source-backed outcome event. |
| `source_ref` | [SourceRef](domain.md#sourceref) | yes | Portal, agency, email, report, or operator-uploaded evidence. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Source reference is mandatory. | `event.source_ref != null` |
| R2 | Portal status and agency status must not be collapsed into final outcome. | `portal_status != final_outcome unless source_ref proves final_outcome` |
| R3 | Outcome events can create candidates but cannot approve them. | `event -> may_create(PromotionCandidate) and not may_create(OwnerDecision.approved)` |
| R4 | Event interpretation limits are mandatory. | `len(event.interpretation_limits) > 0` |

### State Transition

[ApplicationLifecycleState](states.md#applicationlifecyclestate): prior verified stage -> event-derived verified stage.

### Postconditions

- A source-backed event exists.
- Application stage may advance when event kind supports it.
- The event is available for KPI observation and candidate generation.

### Error States

| Condition | Result |
| --- | --- |
| Missing `source_ref` | Reject event. |
| Event claims final outcome from portal-only status | Reject final-outcome interpretation. |
| Missing interpretation limits | Reject event. |

## ComputeKpiObservation

**Type:** Operation
**Actor:** GoldenQuill metric projection.
**Triggers:** Source-backed run or outcome events are available for metric calculation.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `metric_kind` | [GrantKpiKind](domain.md#grantkpikind) | yes | KPI to compute. |
| `source_events` | [GrantOutcomeEvent](domain.md#grantoutcomeevent)[] | yes | Events used by the metric. |
| `numerator` | number | yes | Numerator. |
| `denominator` | number | conditional | Required for rate and ratio KPIs. |
| `denominator_definition` | string | conditional | Required for rate and ratio KPIs. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Rate and ratio metrics require denominator definition. | `metric.is_rate -> denominator != null and denominator_definition != ""` |
| R2 | KPI source events must be source-backed. | `all(event.source_ref != null for event in source_events)` |
| R3 | KPI observations must include interpretation limits. | `len(interpretation_limits) > 0` |
| R4 | KPI observations may create candidates only after validation. | `kpi.validated -> may_create(PromotionCandidate); kpi -> not may_promote` |

### Calculations

| ID | Calculation | Formula |
| --- | --- | --- |
| C1 | Rate metric value | `value = numerator / denominator` |
| C2 | Award amount realization | `value = amount_awarded / amount_requested` |
| C3 | Cycle time | `value = end_date - start_date` |

### Postconditions

- [GrantKpiObservation](domain.md#grantkpiobservation) exists with denominator semantics.
- Metric interpretation remains bounded and cannot promote directly.

### Error States

| Condition | Result |
| --- | --- |
| Missing denominator definition for rate | Reject KPI. |
| Missing source events | Reject KPI. |
| KPI tries to approve or promote | Reject KPI and candidate path. |

## CreatePromotionCandidate

**Type:** Operation
**Actor:** GoldenQuill validator or operator.
**Triggers:** A validated outcome event, KPI observation, feedback signal, or gate result suggests reusable learning.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `source_events` | [GrantOutcomeEvent](domain.md#grantoutcomeevent)[] | conditional | Outcome event evidence. |
| `source_kpis` | [GrantKpiObservation](domain.md#grantkpiobservation)[] | conditional | KPI evidence. |
| `source_packets` | [MemoryEvidencePacketRef](domain.md#memoryevidencepacketref)[] | conditional | Evidence packet references. |
| `proposed_allowed_uses` | [AllowedUse](domain.md#alloweduse)[] | yes | Requested uses before owner decision. |
| `target_owner` | string | yes | Owner who must decide. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | At least one source event, KPI, or evidence packet is required. | `len(source_events)+len(source_kpis)+len(source_packets) > 0` |
| R2 | `approved_allowed_uses` is forbidden on candidates. | `candidate.approved_allowed_uses == null` |
| R3 | Contradiction path is required. | `candidate.contradiction_path != ""` |
| R4 | Org-scoped feedback must remain org-scoped unless redaction/generalization passes. | `privacy_scope == single_org and not generalized -> no workspace_reuse` |

### State Transition

[PromotionCandidateState](states.md#promotioncandidatestate): `captured -> candidate`.

### Postconditions

- Candidate is proposal-level only.
- Candidate records proposed uses, target owner, review gate, privacy scope, and contradiction path.

### Error States

| Condition | Result |
| --- | --- |
| Candidate includes approved allowed uses | Reject candidate. |
| Missing contradiction path | Reject candidate. |
| Workspace-safe use requested from ungeneralized org-scoped feedback | Block candidate or force org-private scope. |

## ValidatePromotionGovernance

**Type:** Operation
**Actor:** GoldenQuill validator with Ontology Vault governance layer.
**Triggers:** Candidate is ready for governance compatibility check.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `candidate` | [PromotionCandidate](domain.md#promotioncandidate) | yes | Candidate to validate. |
| `projection` | [OntologyVaultProjection](mappings.md#ontologyvaultprojection) | yes | Governance-compatible projection. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Governance projection requires evidence refs. | `len(projection.evidence_refs) > 0` |
| R2 | Governance projection requires review gate. | `projection.review_gate != ""` |
| R3 | Governance projection requires contradiction path. | `projection.contradiction_path != ""` |
| R4 | Projection must not mutate target artifact. | `projection.side_effects == none` |
| R5 | KPI threshold alone cannot pass governance. | `source_kpis_only and no_owner_review -> block` |

### State Transition

[PromotionCandidateState](states.md#promotioncandidatestate): `candidate -> validated | blocked`.

### Postconditions

- Candidate is either validated for owner decision or blocked/rejected with residue.
- Projection is an audit artifact, not a production mutation.

### Error States

| Condition | Result |
| --- | --- |
| Missing evidence refs | Block validation. |
| Missing review gate | Block validation. |
| Missing contradiction path | Block validation. |
| Projection tries to mutate Ontology Vault | Block validation. |

## RedactionGeneralizationGate

**Type:** Operation
**Actor:** GoldenQuill privacy layer and operator.
**Triggers:** Org-scoped feedback or private grant learning is proposed for workspace-safe reuse.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `candidate` | [PromotionCandidate](domain.md#promotioncandidate) | yes | Candidate containing org-scoped feedback or learning. |
| `redaction_status` | [RedactionStatus](domain.md#redactionstatus) | yes | Privacy-safe abstraction state. |
| `owner_approval_ref` | [SourceRef](domain.md#sourceref) | conditional | Required before workspace-safe reuse. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Org-scoped feedback defaults to org-private reuse only. | `privacy_scope == single_org -> workspace_reuse forbidden unless generalized and approved` |
| R2 | Workspace-safe learning requires redaction/generalization. | `workspace_reuse -> redaction_status == generalized` |
| R3 | Workspace-safe learning requires owner approval. | `workspace_reuse -> owner_approval_ref != null` |

### State Transition

[PromotionCandidateState](states.md#promotioncandidatestate): `validated -> decision_pending` only after privacy gate passes or is not required.

### Error States

| Condition | Result |
| --- | --- |
| Org-scoped feedback requested for workspace-safe reuse without generalization | Block. |
| Missing owner approval | Block. |

## RecordOwnerDecision

**Type:** Operation
**Actor:** Operator or owning lifecycle route.
**Triggers:** Candidate has passed required validation and privacy gates.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `candidate` | [PromotionCandidate](domain.md#promotioncandidate) | yes | Candidate being decided. |
| `decision` | [OwnerDecisionStateValue](domain.md#ownerdecisionstatevalue) | yes | Approved, rejected, retired, or contradicted. |
| `approved_allowed_uses` | [AllowedUse](domain.md#alloweduse)[] | conditional | Required only when decision is approved. |
| `decision_source` | [SourceRef](domain.md#sourceref) | yes | Decision evidence. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Approved decisions require approved allowed uses. | `decision == approved -> len(approved_allowed_uses) > 0` |
| R2 | Non-approved decisions must not grant approved allowed uses. | `decision != approved -> approved_allowed_uses == []` |
| R3 | Decision source is mandatory. | `decision_source != null` |
| R4 | Candidate must be validated or explicitly waived before decision. | `candidate.current_state in {validated, decision_pending} or waiver_record != null` |

### State Transition

[OwnerDecisionState](states.md#ownerdecisionstate): `pending -> approved | rejected | retired | contradicted`.

### Postconditions

- Owner decision records final disposition.
- Approved allowed uses are available only when decision is approved.

### Error States

| Condition | Result |
| --- | --- |
| Approved decision without approved allowed uses | Reject decision. |
| Rejected/retired/contradicted decision with approved allowed uses | Reject decision. |
| Missing decision source | Reject decision. |
