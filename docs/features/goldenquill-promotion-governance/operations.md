---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-08
docType: operations
---

# Operations: GoldenQuill Promotion Governance

## AcceptGrantWorkEvent

**Type:** Operation
**Actor:** Adapter boundary, workflow component, source importer, or operator.
**Triggers:** A grant-work adapter emits an event for validation and projection.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | [GrantWorkEvent](domain.md#grantworkevent) | yes | Event to accept. |
| `envelope` | [GrantWorkEventEnvelope](domain.md#grantworkeventenvelope) | yes | Producer, source, scope, and idempotency wrapper. |
| `producer` | [AdapterProducer](domain.md#adapterproducer) | yes | Bounded adapter or component that emitted the event. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Producer identity is mandatory. | `event.envelope.producer != null` |
| R2 | External or source-backed facts require `source_ref`. | `event.external_or_source_backed -> envelope.source_ref != null` |
| R3 | Interpretation limits are mandatory. | `len(envelope.interpretation_limits) > 0` |
| R4 | Idempotency key is mandatory. | `envelope.idempotency_key != ""` |
| R5 | Replaying the same idempotency key with identical content is a no-op. | `same_key and same_hash -> no_op` |
| R6 | Replaying the same idempotency key with different content blocks as contradiction/residue. | `same_key and different_hash -> block` |
| R7 | Adapter producers cannot set approved uses. | `event.payload.approved_allowed_uses == null` |

### Postconditions

- Accepted event is available for projection.
- Duplicate no-op replay is recorded without duplicate projection.
- Duplicate conflict is blocked with residue.

### Error States

| Condition | Result |
| --- | --- |
| Missing producer or idempotency key | Reject event. |
| Missing required source reference | Reject event. |
| Missing interpretation limits | Reject event. |
| Adapter tries to set approved uses | Reject event. |
| Duplicate idempotency key with changed content | Block as contradiction/residue. |

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

## ProjectEventToDag

**Type:** Operation
**Actor:** GoldenQuill event projector.
**Triggers:** An accepted [GrantWorkEvent](domain.md#grantworkevent) can produce or update DAG nodes and edges.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | [GrantWorkEvent](domain.md#grantworkevent) | yes | Accepted event. |
| `run_id` | string | yes | Bounded run id. |
| `projection_target` | string | yes | Node, edge, or traversal target. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Event must already be accepted. | `event.validation_state == checked` |
| R2 | DAG projection must emit an [EventProjectionReceipt](domain.md#eventprojectionreceipt). | `projection -> receipt` |
| R3 | Projected nodes and edges must satisfy [RecordGrantRunEvent](#recordgrantrunevent). | `projected_dag -> RecordGrantRunEvent.rules_pass` |
| R4 | Projection cannot bypass blocked traversal. | `blocked_by_gate -> no downstream draft_or_delivery_without_reopen` |

### Postconditions

- DAG nodes and edges are created, updated, skipped, or blocked with a receipt.
- The run DAG can explain which accepted event caused each projection.

### Error States

| Condition | Result |
| --- | --- |
| Event not accepted | Reject projection. |
| Missing projection receipt | Reject projection. |
| Projected DAG violates traversal rules | Block projection. |

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

## ProjectEventToLifecycleAndKpi

**Type:** Operation
**Actor:** GoldenQuill event projector and metrics projection.
**Triggers:** Accepted events contain outcome, cycle-cost, review, lifecycle, or metric payloads.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | [GrantWorkEvent](domain.md#grantworkevent) | yes | Accepted event. |
| `source_events` | [GrantOutcomeEvent](domain.md#grantoutcomeevent)[] | conditional | Outcome events projected from or referenced by the event. |
| `metric_kind` | [GrantKpiKind](domain.md#grantkpikind) | conditional | KPI to compute when event supports metric projection. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Event must already be accepted. | `event.validation_state == checked` |
| R2 | Outcome projection must satisfy [RecordOutcomeEvent](#recordoutcomeevent). | `outcome_projection -> RecordOutcomeEvent.rules_pass` |
| R3 | KPI projection must satisfy [ComputeKpiObservation](#computekpiobservation). | `kpi_projection -> ComputeKpiObservation.rules_pass` |
| R4 | Projection receipt is mandatory. | `projection -> EventProjectionReceipt` |

### Postconditions

- Lifecycle and KPI read models update only through source-backed projection.
- Projection receipt names created, updated, skipped, or blocked refs.

### Error States

| Condition | Result |
| --- | --- |
| Event not accepted | Reject projection. |
| Outcome lacks source | Reject outcome projection. |
| KPI lacks denominator semantics | Reject KPI projection. |

## ProjectGrantActionFacts

**Type:** Operation
**Actor:** GoldenQuill BI projector.
**Triggers:** Accepted grant-work events and DAG projection receipts are
available for action-fact projection.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `events` | [GrantWorkEvent](domain.md#grantworkevent)[] | yes | Accepted events. |
| `projection_receipts` | [EventProjectionReceipt](domain.md#eventprojectionreceipt)[] | yes | Projection receipts for lineage. |
| `dag_refs` | string[] | conditional | DAG nodes/edges represented by the action fact. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Action facts must trace to accepted events and projection receipts. | `action_fact.event_ids != [] and action_fact.projection_receipt_ids != []` |
| R2 | Source-backed action facts require source refs. | `action_fact.source_backed -> len(source_refs) > 0` |
| R3 | Action facts cannot carry approved uses. | `action_fact.approved_allowed_uses == null` |
| R4 | Backfill must preserve original occurrence time and capture time. | `backfill -> occurred_at != null and captured_at != null` |

### Postconditions

- [GrantActionFact](analytics-methods.md#grantactionfact) records exist or the
  projection fails closed.
- Facts are replay-friendly and point back to accepted events, DAG refs, and
  projection receipts.

### Error States

| Condition | Result |
| --- | --- |
| Missing event lineage | Reject action fact. |
| Missing projection receipt | Reject action fact. |
| Source-backed fact lacks source refs | Reject action fact. |
| Approved-use field appears | Reject action fact. |

## BuildKpiResponseWindow

**Type:** Operation
**Actor:** GoldenQuill BI projector.
**Triggers:** Action facts and KPI observations are available for temporal
analysis.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `anchor_action_refs` | [GrantActionFact](analytics-methods.md#grantactionfact)[] | yes | Prior actions being evaluated. |
| `kpi_kind` | [GrantKpiKind](domain.md#grantkpikind) | yes | KPI measured. |
| `baseline_ref` | string | yes | Baseline KPI, stage, outcome, or fact ref. |
| `response_ref` | string | conditional | Later KPI, stage, outcome, or fact ref. |
| `denominator_cohort` | string | yes | Cohort definition. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Anchor actions must occur before the response measurement. | `max(anchor.occurred_at) < response.measured_at` |
| R2 | Pending outcomes are censored, not losses. | `pending -> window.status == censored` |
| R3 | Rate and ratio windows require denominator cohort. | `metric.is_rate -> denominator_cohort != ""` |
| R4 | Response windows cannot cross org scope without privacy approval. | `cross_org -> privacy_gate_ref != null` |

### Postconditions

- [KpiResponseWindow](analytics-methods.md#kpiresponsewindow) exists with
  temporal, denominator, source, and interpretation boundaries.

### Error States

| Condition | Result |
| --- | --- |
| Action occurs after response | Reject temporal leakage. |
| Pending outcome treated as loss | Reject window. |
| Missing denominator cohort | Reject window. |
| Unsafe cross-org window | Block window. |

## EvaluateActionKpiAssociation

**Type:** Operation
**Actor:** GoldenQuill analytics method runner.
**Triggers:** A registered statistical method is requested for action/KPI
analysis.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `method_spec` | [StatisticalMethodSpec](analytics-methods.md#statisticalmethodspec) | yes | Method contract. |
| `action_pattern_ref` | string | yes | Action pattern or query ref. |
| `kpi_windows` | [KpiResponseWindow](analytics-methods.md#kpiresponsewindow)[] | yes | Response windows. |
| `segment` | string | conditional | Funder, program, org, stage, period, or cohort segment. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Method must be registered. | `method_spec.method_id in StatisticalMethodRegistry` |
| R2 | Required fields must be present. | `method_spec.required_fields subset input.fields` |
| R3 | Sample and segment gates must pass. | `sample_size >= minimum_observations and segments >= minimum_segments` |
| R4 | Bias checks must pass or downgrade to residue. | `failed_bias_check -> claim_label == blocked_or_residue` |
| R5 | Claim label must be allowed by method spec. | `claim_label in method_spec.allowed_claim_labels` |
| R6 | Method output cannot approve reuse. | `association.approved_allowed_uses == null` |

### Postconditions

- [ActionKpiAssociation](analytics-methods.md#actionkpiassociation) exists with
  sample, effect, claim label, bias notes, source refs, and interpretation
  limits.

### Error States

| Condition | Result |
| --- | --- |
| Unregistered method | Reject evaluation. |
| Sample gate fails | Emit blocked association or residue. |
| Temporal leakage detected | Reject evaluation. |
| Claim overreaches method spec | Reject association. |
| Output tries to approve reuse | Reject association. |

## CreateBIInsightCandidate

**Type:** Operation
**Actor:** GoldenQuill candidate generator.
**Triggers:** Valid [ActionKpiAssociation](analytics-methods.md#actionkpiassociation)
evidence suggests reusable pipeline intelligence.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `association_refs` | [ActionKpiAssociation](analytics-methods.md#actionkpiassociation)[] | yes | Association evidence. |
| `target_owner` | string | yes | Owner expected to decide reuse. |
| `proposed_allowed_uses` | [AllowedUse](domain.md#alloweduse)[] | yes | Requested allowed uses. |
| `contradiction_path` | string | yes | How future evidence can challenge the insight. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Association claim cannot be `blocked_or_residue`. | `all(claim_label != blocked_or_residue)` |
| R2 | Candidate is a [PromotionCandidate](domain.md#promotioncandidate) profile. | `BIInsightCandidate extends PromotionCandidate` |
| R3 | Candidate must preserve method id, claim label, confidence, privacy scope, and interpretation limits. | `required_profile_fields present` |
| R4 | Candidate cannot contain approved uses. | `candidate.approved_allowed_uses == null` |

### Postconditions

- [BIInsightCandidate](analytics-methods.md#biinsightcandidate-profile) exists
  as a governed [PromotionCandidate](domain.md#promotioncandidate) profile.

### Error States

| Condition | Result |
| --- | --- |
| Blocked or residue association | Reject candidate. |
| Missing method or claim label | Reject candidate. |
| Missing contradiction path | Reject candidate. |
| Approved-use field appears | Reject candidate. |

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

## PublishApprovedReusePacket

**Type:** Operation
**Actor:** GoldenQuill governance projection or owner-decision route.
**Triggers:** An approved [OwnerDecision](domain.md#ownerdecision) exists.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `decision` | [OwnerDecision](domain.md#ownerdecision) | yes | Approved owner decision. |
| `candidate` | [PromotionCandidate](domain.md#promotioncandidate) | yes | Candidate authorized by the decision. |
| `approved_allowed_uses` | [AllowedUse](domain.md#alloweduse)[] | yes | Uses approved by the owner. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Decision must be approved. | `decision.decision == approved` |
| R2 | Approved allowed uses are mandatory. | `len(decision.approved_allowed_uses) > 0` |
| R3 | Reuse scope must not exceed owner approval or redaction status. | `packet.reuse_scope <= decision.approved_scope` |
| R4 | Contradiction path is mandatory. | `packet.contradiction_path != ""` |

### Postconditions

- [ApprovedReusePacket](domain.md#approvedreusepacket) exists for future-context hydration.
- Packet preserves decision source, approved uses, scope, conditions, and contradiction path.

### Error States

| Condition | Result |
| --- | --- |
| Non-approved decision | Reject packet. |
| Missing approved uses | Reject packet. |
| Scope exceeds approval | Block packet. |

## HydrateFutureGrantContext

**Type:** Operation
**Actor:** GoldenQuill future-run context builder or memory query surface.
**Triggers:** Scout, Scribe, Judge, Logician, Funding Goal, or another future grant-work consumer requests approved learning.

### Input

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `approved_reuse_packets` | [ApprovedReusePacket](domain.md#approvedreusepacket)[] | yes | Candidate approved knowledge packets. |
| `consumer` | string | yes | Future grant-work consumer. |
| `requested_use` | [AllowedUse](domain.md#alloweduse) | yes | Intended use in future context. |

### Rules

| ID | Rule | Formal |
| --- | --- | --- |
| R1 | Consumer may use only approved allowed uses. | `requested_use in packet.approved_allowed_uses` |
| R2 | Consumer must respect reuse scope. | `consumer.scope <= packet.reuse_scope` |
| R3 | Contradicted or retired packets cannot hydrate context. | `packet.status not in {contradicted, retired}` |
| R4 | Hydration emits a projection receipt or audit record. | `hydrate -> receipt_or_audit_ref` |

### Postconditions

- Future grant work receives only approved, scoped learning.
- Hydration can be audited back to owner decision and source evidence.

### Error States

| Condition | Result |
| --- | --- |
| Requested use not approved | Reject hydration. |
| Scope violation | Reject hydration. |
| Packet contradicted or retired | Reject hydration. |
