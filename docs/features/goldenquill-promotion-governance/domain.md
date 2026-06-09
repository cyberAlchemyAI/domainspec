---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-08
docType: domain
---

# Domain: GoldenQuill Promotion Governance

## Entities

### GrantWorkEvent

[GrantWorkEvent](#grantworkevent) is the accepted event record emitted by a
bounded [AdapterProducer](#adapterproducer) and validated through
[AcceptGrantWorkEvent](operations.md#acceptgrantworkevent).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `event_id` | string | yes | Stable event identifier. |
| `event_kind` | [GrantWorkEventKind](#grantworkeventkind) | yes | Event family. |
| `envelope` | [GrantWorkEventEnvelope](#grantworkeventenvelope) | yes | Producer, scope, idempotency, source, and interpretation wrapper. |
| `payload_ref` | string | conditional | Local artifact, fixture, source, or payload pointer. |
| `payload` | object | conditional | Validated inline payload when no separate payload ref is used. |
| `accepted_utc` | timestamp | yes | Time accepted by GoldenQuill. |
| `validation_state` | [ValidationState](#validationstate) | yes | Candidate, checked, failed, waived, or contradicted. |

Rule: [GrantWorkEvent](#grantworkevent) can project into DAG, lifecycle, KPI,
candidate, decision, or future-context records, but it cannot approve reuse.

### AdapterProducer

[AdapterProducer](#adapterproducer) identifies the bounded producer that emitted
a [GrantWorkEvent](#grantworkevent).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `producer_id` | string | yes | Stable adapter or component id. |
| `producer_kind` | [AdapterProducerKind](#adapterproducerkind) | yes | Producer family. |
| `owner` | string | yes | Owning GoldenQuill component or operator surface. |
| `source_surface` | string | yes | Portal, seat, uploader, report, reflection, memory, or backfill surface. |
| `authority_limit` | string | yes | Statement of what the producer cannot approve or mutate. |

Rule: [AdapterProducer](#adapterproducer) has observation authority only. It
cannot set `approved_allowed_uses` or bypass event validation.

### EventProjectionReceipt

[EventProjectionReceipt](#eventprojectionreceipt) records what an accepted
[GrantWorkEvent](#grantworkevent) created, updated, skipped, or blocked.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `receipt_id` | string | yes | Stable projection receipt id. |
| `event_id` | [GrantWorkEvent](#grantworkevent) reference | yes | Event being projected. |
| `projection_kind` | string | yes | `dag`, `lifecycle`, `kpi`, `candidate`, `owner_decision`, `approved_reuse`, or `future_context`. |
| `created_refs` | string[] | no | Created node, edge, event, metric, candidate, packet, or context refs. |
| `updated_refs` | string[] | no | Updated read-model or lifecycle refs. |
| `skipped_reason` | string | no | Why replay or projection did not write. |
| `blocked_reason` | string | no | Why projection failed closed. |
| `idempotency_key` | string | yes | Replay key inherited from the event envelope. |
| `validation_state` | [ValidationState](#validationstate) | yes | Projection result. |

Rule: projection receipts make event replay and projection side effects
auditable.

### GrantRunNode

[GrantRunNode](#grantrunnode) represents one event or artifact in a bounded
grant-run execution DAG.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `node_id` | string | yes | Stable node identifier unique inside [GrantRunNode](#grantrunnode).`run_id`. |
| `node_kind` | [GrantRunNodeKind](#grantrunnodekind) | yes | Mandatory execution node family. |
| `run_id` | string | yes | Bounded grant run identifier. |
| `org_scope` | [OrgScope](#orgscope) | yes | Organization privacy and reuse boundary. |
| `source_ref` | [SourceRef](#sourceref) | conditional | Source pointer required when the node records a source-backed fact. |
| `created_utc` | timestamp | yes | Creation time. |
| `state` | [ValidationState](#validationstate) | yes | Validation state of this node. |
| `artifact_ref` | string | conditional | Pointer to produced or consumed artifact. |
| `gate_ref` | string | conditional | Gate that allowed, warned, or blocked traversal. |

**Lifecycle:** See [GrantRunTraversalState](states.md#grantruntraversalstate).
**Operations:** [RecordGrantRunEvent](operations.md#recordgrantrunevent), [ValidatePromotionGovernance](operations.md#validatepromotiongovernance).

### GrantRunEdge

[GrantRunEdge](#grantrunedge) represents ordering, consumption, emission,
revision, approval, blocking, or delivery between [GrantRunNode](#grantrunnode)
instances.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `edge_id` | string | yes | Stable edge identifier unique inside a run. |
| `edge_kind` | [GrantRunEdgeKind](#grantrunedgekind) | yes | Mandatory execution edge family. |
| `from_node` | [GrantRunNode](#grantrunnode) reference | yes | Source node. |
| `to_node` | [GrantRunNode](#grantrunnode) reference | yes | Target node. |
| `run_id` | string | yes | Bounded grant run identifier. |
| `evidence_ref` | [SourceRef](#sourceref) | conditional | Evidence for the edge assertion. |
| `created_by` | string | yes | System, operator, validator, or seat that created the edge. |
| `validation_state` | [ValidationState](#validationstate) | yes | Candidate, checked, failed, waived, or contradicted state. |

**Operations:** [RecordGrantRunEvent](operations.md#recordgrantrunevent).

### GrantOutcomeEvent

[GrantOutcomeEvent](#grantoutcomeevent) captures source-backed real-world grant
movement after discovery, delivery, submission, review, award, decline,
reporting, or closeout.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `event_id` | string | yes | Stable event identifier. |
| `application_id` | string | yes | Application or grant opportunity instance. |
| `event_kind` | [GrantOutcomeEventKind](#grantoutcomeeventkind) | yes | Source-backed event category. |
| `event_date` | date | yes | Date from source or operator-verified record. |
| `source_ref` | [SourceRef](#sourceref) | yes | Portal, agency, email, report, award notice, decline, or closeout evidence. |
| `portal_status` | string | no | Portal status when relevant. |
| `agency_status` | string | no | Agency or funder status when relevant. |
| `amount_requested` | number | no | Requested amount, if applicable. |
| `amount_awarded` | number | no | Awarded amount, if applicable. |
| `feedback_refs` | [SourceRef](#sourceref)[] | no | Reviewer, funder, or agency feedback evidence. |
| `post_award_obligations` | string[] | no | Reporting or stewardship obligations. |
| `org_scope` | [OrgScope](#orgscope) | yes | Privacy/reuse boundary. |
| `interpretation_limits` | string[] | yes | What this event does not prove. |

Rule: [GrantOutcomeEvent](#grantoutcomeevent) may create learning candidates but
cannot approve them.

### GrantKpiObservation

[GrantKpiObservation](#grantkpiobservation) is a metric read model derived from
source-backed run and outcome evidence.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `metric_id` | string | yes | Stable metric observation id. |
| `metric_kind` | [GrantKpiKind](#grantkpikind) | yes | KPI family member. |
| `numerator` | number | yes | Count, amount, or duration numerator. |
| `denominator` | number | conditional | Required for rate or ratio metrics. |
| `denominator_definition` | string | conditional | Required for rate or ratio metrics. |
| `value` | number | yes | Computed value. |
| `segment` | string | no | Funder, program, org, grant family, or time segment. |
| `source_events` | [GrantOutcomeEvent](#grantoutcomeevent)[] | yes | Source-backed events used by the metric. |
| `interpretation_limits` | string[] | yes | What the KPI cannot prove or promote. |

Rule: selected [GrantKpiObservation](#grantkpiobservation) records may create
[PromotionCandidate](#promotioncandidate) records only after validation. They
cannot promote directly.

### Analytics Method Domain Contracts

Grant-action/KPI intelligence uses the concrete implementation definitions in
[analytics-methods.md](analytics-methods.md). Those contracts define:

| Contract | Domain Role | Authority Limit |
| --- | --- | --- |
| [GrantActionFact](analytics-methods.md#grantactionfact) | Analytics-ready action fact derived from accepted events, projection receipts, and DAG nodes. | Evidence feature only. |
| [GrantLifecycleTransitionFact](analytics-methods.md#grantlifecycletransitionfact) | Historical lifecycle movement fact. | Stage evidence only. |
| [GrantOutcomeFact](analytics-methods.md#grantoutcomefact) | Source-backed outcome fact for BI. | Outcome evidence only. |
| [GrantCostFact](analytics-methods.md#grantcostfact) | Effort and spend fact linked to actions or DAG nodes. | Cost evidence only. |
| [KpiResponseWindow](analytics-methods.md#kpiresponsewindow) | Temporal join from prior action to later KPI movement. | Measurement boundary only. |
| [StatisticalMethodSpec](analytics-methods.md#statisticalmethodspec) | Method registry entry with maturity, sample, field, bias, and claim gates. | Method guardrail only. |
| [ActionKpiAssociation](analytics-methods.md#actionkpiassociation) | Statistical output relating an action pattern to KPI movement. | Evidence only; cannot approve reuse. |
| [BIInsightCandidate](analytics-methods.md#biinsightcandidate-profile) | [PromotionCandidate](#promotioncandidate) profile created from valid action/KPI association evidence. | Proposed uses only until owner decision. |

### PromotionCandidate

[PromotionCandidate](#promotioncandidate) is the local grant-learning proposal
object.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `candidate_id` | string | yes | Stable candidate identifier. |
| `candidate_kind` | [PromotionCandidateKind](#promotioncandidatekind) | yes | Learning, budget framing, stewardship, process, or strategy candidate. |
| `created_utc` | timestamp | yes | Creation time. |
| `created_by` | string | yes | Operator, validator, or system source. |
| `source_packets` | [MemoryEvidencePacketRef](#memoryevidencepacketref)[] | no | Evidence packet references. |
| `source_events` | [GrantOutcomeEvent](#grantoutcomeevent)[] | no | Source-backed outcome events. |
| `source_kpis` | [GrantKpiObservation](#grantkpiobservation)[] | no | Validated KPI observations. |
| `target_owner` | string | yes | Owner expected to approve, reject, retire, or contradict the candidate. |
| `target_artifact` | string | no | Proposed downstream artifact or lifecycle route. |
| `proposed_relation` | string | yes | Proposed learning relation. |
| `proposed_allowed_uses` | [AllowedUse](#alloweduse)[] | yes | Requested allowed uses before owner decision. |
| `current_state` | [PromotionCandidateStateValue](#promotioncandidatestatevalue) | yes | Candidate lifecycle state. |
| `review_gate` | string | yes | Review gate that must pass before owner decision. |
| `promotion_blockers` | string[] | no | Known blockers. |
| `contradiction_path` | string | yes | How future counterevidence can challenge or retire the candidate. |
| `privacy_scope` | [OrgScope](#orgscope) | yes | Privacy and reuse scope. |
| `redaction_status` | [RedactionStatus](#redactionstatus) | yes | Privacy-safe abstraction status. |
| `owner_decision_ref` | [OwnerDecision](#ownerdecision) reference | no | Final owner decision when present. |
| `residue` | string[] | no | Deferred issues, warnings, or non-promoted learning. |

Rule: [PromotionCandidate](#promotioncandidate) is not approved reuse and must
not contain `approved_allowed_uses`.

### OwnerDecision

[OwnerDecision](#ownerdecision) records the approved, rejected, retired, or
contradicted disposition of a [PromotionCandidate](#promotioncandidate).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `decision_id` | string | yes | Stable decision identifier. |
| `candidate_id` | [PromotionCandidate](#promotioncandidate) reference | yes | Candidate being decided. |
| `owner` | string | yes | Human or lifecycle owner. |
| `decision` | [OwnerDecisionStateValue](#ownerdecisionstatevalue) | yes | Approved, rejected, retired, or contradicted. |
| `approved_allowed_uses` | [AllowedUse](#alloweduse)[] | conditional | Required only for approved decisions. |
| `decision_date` | date | yes | Decision date. |
| `decision_source` | [SourceRef](#sourceref) | yes | Decision evidence. |
| `conditions` | string[] | no | Conditions attached to approval or rejection. |
| `contradiction_path` | string | yes | How the decision can be challenged later. |

Rule: approved uses live here, not on raw evidence or candidates.

### ApprovedReusePacket

[ApprovedReusePacket](#approvedreusepacket) is the bounded handoff from an
approved [OwnerDecision](#ownerdecision) back into future GoldenQuill grant
work.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `packet_id` | string | yes | Stable approved reuse packet id. |
| `decision_id` | [OwnerDecision](#ownerdecision) reference | yes | Owner decision authorizing reuse. |
| `candidate_id` | [PromotionCandidate](#promotioncandidate) reference | yes | Candidate that was decided. |
| `approved_allowed_uses` | [AllowedUse](#alloweduse)[] | yes | Uses approved by owner decision. |
| `reuse_scope` | [OrgScope](#orgscope) | yes | Privacy and reuse scope. |
| `status` | [ApprovedReusePacketStateValue](#approvedreusepacketstatevalue) | yes | Current packet state for future-context hydration. |
| `consumer_refs` | string[] | no | Future Scout, Scribe, Judge, Logician, Funding Goal, memory query, or card/funder consumers. |
| `source_refs` | [SourceRef](#sourceref)[] | yes | Decision and evidence refs supporting the packet. |
| `conditions` | string[] | no | Conditions inherited from owner decision. |
| `contradiction_path` | string | yes | How later evidence can challenge the packet. |

Rule: future grant context may consume only approved allowed uses from an
[ApprovedReusePacket](#approvedreusepacket).

## Value Objects

### GrantWorkEventEnvelope

[GrantWorkEventEnvelope](#grantworkeventenvelope) wraps every adapter-produced
event before projection.

| Field | Type | Constraint |
| --- | --- | --- |
| `producer` | [AdapterProducer](#adapterproducer) | Required. |
| `run_id` | string | Required for bounded grant-run events. |
| `org_scope` | [OrgScope](#orgscope) | Required. |
| `source_ref` | [SourceRef](#sourceref) | Required for external or source-backed facts. |
| `occurred_at` | timestamp | Required. |
| `captured_at` | timestamp | Required. |
| `idempotency_key` | string | Required. |
| `interpretation_limits` | string[] | Required. |
| `gate_refs` | string[] | Required when gates allowed, warned, or blocked the event. |

Rule: the envelope preserves source truth and replay semantics before any DAG,
KPI, candidate, or memory projection.

### MemoryEvidencePacketRef

[MemoryEvidencePacketRef](#memoryevidencepacketref) references an existing
evidence packet or source-backed equivalent.

| Field | Type | Constraint |
| --- | --- | --- |
| `packet_id` | string | Required when referencing an existing packet. |
| `source_path` | string | Required for local evidence. |
| `locator` | string | Required selector, row, section, hash, or source pointer. |
| `authority_class` | [AuthorityClass](#authorityclass) | Required. |
| `org_scope` | [OrgScope](#orgscope) | Required. |
| `retrieval_surface` | string | Optional retrieval context. |
| `freshness_signal` | string | Optional freshness indicator. |

Rule: [MemoryEvidencePacketRef](#memoryevidencepacketref) does not approve reuse.

### SourceRef

| Field | Type | Constraint |
| --- | --- | --- |
| `source_id` | string | Stable source id. |
| `source_type` | string | `document`, `url`, `portal_export`, `email_archive`, `agency_notice`, `report`, `operator_upload`, or `fixture`. |
| `path_or_url` | string | Required source location. |
| `locator` | string | Selector, row, section, hash, or timestamp. |
| `captured_utc` | timestamp | Required capture timestamp. |

### StageProfile

| Field | Type | Constraint |
| --- | --- | --- |
| `profile_id` | string | Required. |
| `family` | string | Grant or funder family. |
| `override_reason` | string | Required when overriding global baseline. |
| `stage_order` | [ApplicationStage](#applicationstage)[] | Optional override. |
| `score_map` | object | Optional stage-to-score map. |

## Enums

### GrantWorkEventKind

| Value | Description |
| --- | --- |
| `run_node_recorded` | Event can project into a [GrantRunNode](#grantrunnode). |
| `run_edge_recorded` | Event can project into a [GrantRunEdge](#grantrunedge). |
| `gate_result_recorded` | Event records a gate pass, warning, block, or waiver. |
| `outcome_event_recorded` | Event can project into a [GrantOutcomeEvent](#grantoutcomeevent). |
| `kpi_observation_recorded` | Event can project into a [GrantKpiObservation](#grantkpiobservation). |
| `cycle_receipt_recorded` | Event references a WPFA/CycleReceipt cost or resource-use artifact. |
| `reflection_packet_recorded` | Event references a Reflection Packet or learning-cycle artifact. |
| `owner_decision_recorded` | Event records an owner decision source. |
| `approved_reuse_available` | Event records an approved reuse packet becoming available to future grant work. |

### AdapterProducerKind

| Value | Description |
| --- | --- |
| `seat` | Scout, Scribe, Editor, Judge, Red Team, Logician, or other workflow seat. |
| `portal` | Grants.gov, SAM.gov, foundation, or other portal source. |
| `uploader` | Prepare-and-stage uploader adapter. |
| `operator_upload` | Operator-supplied source or decision artifact. |
| `outcome_source` | Email, agency notice, report, award, decline, closeout, or portal export source. |
| `wpfa_cycle_accountant` | WPFA/CycleReceipt producer. |
| `reflection_packet` | Reflection Packet producer or backfill source. |
| `memory_query` | Memory query or approved retrieval surface. |
| `legacy_backfill` | Batch importer for historical artifacts. |

### GrantRunNodeKind

| Value | Description |
| --- | --- |
| `run_context` | One bounded grant run. |
| `project_context_reference` | Applicant/project context pointer. |
| `rfa_reference` | RFA, NOFO, or funder instruction pointer. |
| `scout_discovery_record` | Opportunity discovery record. |
| `scout_verification_record` | Opportunity verification record. |
| `operator_review_decision` | Human go/no-go or review decision. |
| `rfa_dissection` | Extracted requirements, criteria, forms, deadlines, and constraints. |
| `kgie_preflight` | Fit, evidence, eligibility, and gap preflight. |
| `scribe_section_draft` | Drafted section or section version. |
| `editor_suggestion_report` | Editor suggestions. |
| `judge_score_report` | Score and risk assessment. |
| `responsiveness_map` | RFA/rubric-to-draft response map. |
| `red_team_review` | Conditional adversarial/risk review. |
| `logician_gate_result` | Deterministic pass, fail, or warn gate. |
| `operator_signoff` | Human approval to deliver, revise, pause, or stop. |
| `delivery_envelope` | Submitted, delivered, or handed-off package. |

### GrantRunEdgeKind

| Value | Description |
| --- | --- |
| `precedes` | One run event happened before another. |
| `consumes` | Step used source, artifact, or decision. |
| `emits` | Step produced artifact or event. |
| `blocked_by_gate` | Gate prevented traversal. |
| `revised_by` | Later review or revision changed an artifact. |
| `approved_by` | Human or owner approval allowed transition. |
| `delivered_as` | Delivery envelope emitted as submission or handoff. |

### GrantOutcomeEventKind

| Value | Description |
| --- | --- |
| `submitted` | Application was submitted. |
| `portal_validated` | Portal accepted or validated package. |
| `agency_retrieved` | Agency retrieved application. |
| `agency_tracking_assigned` | Agency assigned tracking number. |
| `under_review` | Source indicates review reached. |
| `feedback_received` | Reviewer, agency, or funder feedback arrived. |
| `awarded` | Award notice arrived. |
| `declined` | Decline notice arrived. |
| `withdrawn` | Application withdrawn before final decision. |
| `report_accepted` | Post-award report accepted. |
| `closed_out` | Award closed out. |

### ApplicationStage

| Value | Description |
| --- | --- |
| `prospect` | Opportunity is only a prospect. |
| `eligible_match` | Initial eligibility/fit match exists. |
| `go_no_go_approved` | Operator approved pursuit. |
| `loi_submitted` | Letter of intent submitted. |
| `invited_full` | Full application invited. |
| `application_started` | Application work started. |
| `application_submitted` | Application submitted. |
| `portal_validated` | Portal validation passed. |
| `agency_retrieved` | Agency retrieved application. |
| `agency_tracking_assigned` | Agency tracking assigned. |
| `under_review` | Application under review. |
| `review_feedback_received` | Feedback received. |
| `award_recommended` | Award recommended. |
| `awarded` | Awarded. |
| `declined` | Declined. |
| `withdrawn` | Withdrawn. |
| `post_award_active` | Post-award active. |
| `reporting_current` | Reporting current. |
| `closed_out` | Closed out. |

### GrantKpiKind

| Value | Description |
| --- | --- |
| `stage_depth` | Deepest reached lifecycle stage. |
| `stage_depth_score` | Numeric stage-depth score. |
| `submission_validated_rate` | Validated submissions / submitted applications. |
| `agency_retrieved_rate` | Agency-retrieved applications / validated submissions. |
| `review_reached_rate` | Applications with review signal / submitted applications. |
| `final_decision_rate` | Awarded plus declined / submitted applications. |
| `closeout_completed_rate` | Closed awards / awarded grants. |
| `win_rate_by_count` | Awarded / final decisions. |
| `win_rate_by_dollars` | Awarded dollars / requested dollars for final decisions. |
| `decline_rate` | Declined / final decisions. |
| `pending_rate` | Pending / submitted applications. |
| `award_amount_realization` | Awarded amount / requested amount. |
| `partial_award_rate` | Partial awards / awards. |
| `resubmission_success_rate` | Awarded resubmissions / final-decision resubmissions. |
| `repeat_funder_win_rate` | Repeat-funder awards / repeat-funder final decisions. |
| `new_funder_conversion_rate` | New-funder awards / new-funder final decisions. |
| `compliance_pass_rate` | Logician pre-submit gates passed / attempted. |
| `rubric_coverage_score` | Covered rubric criteria / total criteria. |
| `reviewer_objection_resolution_rate` | Resolved objections / total objections. |
| `evidence_gap_resolution_rate` | Resolved evidence gaps / identified gaps. |
| `section_revision_delta` | Score or risk movement across draft iterations. |
| `review_feedback_quality` | Feedback specificity and actionability. |
| `resubmission_delta` | Score/review movement from prior submission to next. |
| `go_no_go_selectivity` | Pursued opportunities / researched opportunities. |
| `high_match_pursuit_rate` | High-fit pursued / high-fit identified. |
| `low_fit_avoidance_rate` | Low-fit not pursued / low-fit identified. |
| `relationship_present_rate` | Submissions with existing funder relationship / submissions. |
| `prior_award_alignment` | Proposal fit against funder prior-award corpus. |
| `program_drift_rate` | Requirements changed after discovery. |
| `hours_per_submission` | Staff hours / submitted application. |
| `cost_per_submitted_application` | Labor plus tools / submitted application. |
| `cost_per_award` | Labor plus tools / awards. |
| `dollars_requested_per_hour` | Requested dollars / grant-work hours. |
| `dollars_awarded_per_hour` | Awarded dollars / grant-work hours. |
| `cycle_time_discovery_to_submit` | Submission date minus discovery date. |
| `cycle_time_submit_to_decision` | Decision date minus submission date. |
| `reporting_burden_hours` | Post-award reporting hours / award. |
| `stakeholder_contacts` | Grant-seeking contacts per period. |
| `new_stakeholder_engagement_rate` | New stakeholders engaged / stakeholders engaged. |
| `collaboration_artifacts_count` | MOUs, MOAs, support letters, partner commitments. |
| `staff_consultations` | Staff consultations for proposal/program development. |
| `internal_training_hours` | Internal grant capability hours. |
| `funder_touchpoints` | Contacts with new and existing funders. |
| `grant_retention_rate` | Repeat support year over year. |

### PromotionCandidateStateValue

| Value | Description |
| --- | --- |
| `captured` | Source signal captured but not yet candidate-ready. |
| `candidate` | Candidate created. |
| `validated` | Candidate passed local validation. |
| `decision_pending` | Awaiting owner decision. |
| `approved` | Owner approved. |
| `rejected` | Owner rejected. |
| `retired` | Candidate retired. |
| `contradicted` | Candidate contradicted by newer evidence. |

### OwnerDecisionStateValue

| Value | Description |
| --- | --- |
| `approved` | Approved with allowed uses. |
| `rejected` | Rejected for reuse. |
| `retired` | Retired as no longer active. |
| `contradicted` | Contradicted by evidence. |

### ApprovedReusePacketStateValue

| Value | Description |
| --- | --- |
| `active` | Available for future-context hydration within approved scope and uses. |
| `retired` | No longer available for future-context hydration. |
| `contradicted` | Blocked by accepted counterevidence. |

### AllowedUse

| Value | Description |
| --- | --- |
| `orient` | Use for orientation only. |
| `draft_support` | Use as draft support after source and scope checks. |
| `decision_input` | Use as owner or operator decision input. |
| `dashboard` | Display as dashboard read model. |
| `learning_candidate` | Use as candidate learning. |
| `workspace_reuse` | Reuse across workspace after approval. |
| `org_private_reuse` | Reuse only inside org scope. |
| `citation_candidate` | Candidate for citation after source review. |
| `do_not_use` | Explicitly forbidden for reuse. |

### AuthorityClass

| Value | Description |
| --- | --- |
| `canonical_source` | Source of record. |
| `signed_contract` | Signed or owner-approved contract. |
| `runtime_index` | Runtime index, not source truth. |
| `derived_summary` | Derived summary. |
| `proposal_only` | Proposal-only evidence. |
| `generated_state` | Generated runtime or session state. |

### OrgScope

| Value | Description |
| --- | --- |
| `workspace_global` | Safe for workspace-wide reuse after approval. |
| `single_org` | Private to one org. |
| `no_org_loaded` | Synthetic or non-org-loaded fixture. |
| `cross_org_forbidden` | Explicitly forbidden for cross-org use. |

### ValidationState

| Value | Description |
| --- | --- |
| `candidate` | Proposed but unchecked. |
| `checked` | Checked and acceptable. |
| `failed` | Failed validation. |
| `waived` | Waived with approval record. |
| `contradicted` | Contradicted by evidence. |

### RedactionStatus

| Value | Description |
| --- | --- |
| `not_required` | No org-scoped sensitive content. |
| `required` | Redaction/generalization required. |
| `redacted` | Direct identifiers removed. |
| `generalized` | Abstracted into workspace-safe learning. |
| `blocked` | Not safe to generalize. |

### PromotionCandidateKind

| Value | Description |
| --- | --- |
| `lesson` | General learning candidate. |
| `budget_framing_lesson` | Candidate about budget fit or amount realization. |
| `stewardship_lesson` | Candidate from reporting, retention, or closeout. |
| `strategy_gap` | Candidate about opportunity selection or strategy fit. |
| `process_lesson` | Candidate about workflow, gates, or evidence gaps. |
| `review_response_lesson` | Candidate from reviewer objections or rubric movement. |
