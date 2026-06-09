---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-08
docType: glossary
---

# Glossary: GoldenQuill Promotion Governance

This glossary explains the feature language used by GoldenQuill Promotion
Governance. Authoritative behavior, fields, rules, and lifecycle contracts
remain in the linked source documents in this feature folder.

## Feature Language

| Term | Meaning in this feature | Related Concepts |
| --- | --- | --- |
| Grant work event | A typed event emitted by a bounded grant-work adapter or workflow component for validation and projection into the DAG, lifecycle, KPI, candidate, decision, or future-context read models. | [GrantWorkEvent](domain.md#grantworkevent), [AcceptGrantWorkEvent](operations.md#acceptgrantworkevent) |
| Event envelope | The producer, scope, source, idempotency, and interpretation wrapper that makes a grant-work event auditable and replay-safe. | [GrantWorkEventEnvelope](domain.md#grantworkeventenvelope) |
| Adapter producer | A portal, seat, uploader, workflow, source, reflection, memory, or backfill producer with observation authority only. | [AdapterProducer](domain.md#adapterproducer) |
| Event projection receipt | The audit record proving what an accepted event created, updated, skipped, or blocked. | [EventProjectionReceipt](domain.md#eventprojectionreceipt) |
| Application stage | The deepest verified point an application reached in the grant process. It is not final outcome truth. | [ApplicationLifecycleState](states.md#applicationlifecyclestate), [ApplicationStage](domain.md#applicationstage) |
| Outcome event | A source-backed real-world grant movement such as submission, portal validation, agency retrieval, review, award, decline, withdrawal, report acceptance, or closeout. | [GrantOutcomeEvent](domain.md#grantoutcomeevent) |
| Validation state | Whether a claim, denominator, feedback interpretation, compliance result, edge, or candidate has been checked, failed, waived, or contradicted. | [ValidationState](domain.md#validationstate) |
| Evidence packet | A source reference or evidence packet pointer. It can support decisions but never approves reuse by itself. | [MemoryEvidencePacketRef](domain.md#memoryevidencepacketref), [SourceRef](domain.md#sourceref) |
| KPI observation | A denominator-safe metric read model derived from source-backed events. It can create candidates after validation but cannot promote directly. | [GrantKpiObservation](domain.md#grantkpiobservation) |
| Grant action fact | Analytics-ready action record derived from accepted events, projection receipts, and DAG evidence. | [GrantActionFact](analytics-methods.md#grantactionfact) |
| KPI response window | Temporal join from prior grant actions to later KPI movement, with censoring and leakage guards. | [KpiResponseWindow](analytics-methods.md#kpiresponsewindow) |
| Statistical method spec | Registered analytics method contract with maturity, sample, required-field, bias, and claim-label gates. | [StatisticalMethodSpec](analytics-methods.md#statisticalmethodspec) |
| Action KPI association | Evidence-bounded method output linking an action pattern to KPI movement. It cannot approve reuse. | [ActionKpiAssociation](analytics-methods.md#actionkpiassociation) |
| Optimization chain | A plain-language and schema-backed contract that connects grant nodes, KPIs, analytical methods, association evidence, and the named BI optimization produced. | [OptimizationChainDefinition](optimization-chains.md#core-definition) |
| BI optimization | A named pipeline-improvement insight produced by an optimization chain, such as Objection Risk Reduction Insight or Pursuit Selectivity Optimization. | [Optimization Chain Catalog](optimization-chains.md#optimization-chain-catalog) |
| BI insight candidate | PromotionCandidate profile generated from valid action/KPI association evidence. | [BIInsightCandidate](analytics-methods.md#biinsightcandidate-profile), [PromotionCandidate](domain.md#promotioncandidate) |
| Promotion candidate | A proposed learning object created from evidence, outcomes, feedback, or KPI observations. | [PromotionCandidate](domain.md#promotioncandidate) |
| Owner decision | The authority record that approves, rejects, retires, or contradicts a candidate. Approved allowed uses live here. | [OwnerDecision](domain.md#ownerdecision) |
| Approved reuse packet | The bounded handoff from an approved owner decision into future grant-work context. It carries only approved allowed uses, source refs, scope, conditions, and contradiction path. | [ApprovedReusePacket](domain.md#approvedreusepacket), [PublishApprovedReusePacket](operations.md#publishapprovedreusepacket) |
| Future grant context | A future GoldenQuill grant-work session hydrated only from active approved reuse packets whose allowed uses and scope fit the requested work. | [HydrateFutureGrantContext](operations.md#hydratefuturegrantcontext), [ApprovedReusePacketToFutureGrantContext](mappings.md#approvedreusepackettofuturegrantcontext) |
| Governance layer | The Ontology Vault compatibility and safety layer that checks evidence sufficiency, review gate, contradiction path, and allowed-use boundaries. | [OntologyVaultProjection](mappings.md#ontologyvaultprojection) |
| Redaction/generalization gate | The privacy gate that turns org-scoped feedback into workspace-safe learning only when generalized and owner-approved. | [RedactionGeneralizationGate](operations.md#redactiongeneralizationgate) |
| Org-scoped feedback | Feedback that belongs to one applicant, client, or org context by default. | [OrgScope](domain.md#orgscope) |
| Workspace-safe learning | Reusable learning that has passed redaction/generalization and owner approval. | [OwnerDecision](domain.md#ownerdecision), [AllowedUse](domain.md#alloweduse) |

## Formal Concepts

| Term | Concept ID | Type | Definition | Source |
| --- | --- | --- | --- | --- |
| GrantWorkEvent | `goldenquill-promotion-governance.GrantWorkEvent` | Entity | An accepted typed event emitted by a bounded grant-work adapter. | [domain.md](domain.md#grantworkevent) |
| GrantWorkEventEnvelope | `goldenquill-promotion-governance.GrantWorkEventEnvelope` | Value Object | Producer, scope, source, idempotency, and interpretation wrapper for event intake. | [domain.md](domain.md#grantworkeventenvelope) |
| AdapterProducer | `goldenquill-promotion-governance.AdapterProducer` | Entity | Bounded event producer with observation authority only. | [domain.md](domain.md#adapterproducer) |
| EventProjectionReceipt | `goldenquill-promotion-governance.EventProjectionReceipt` | Entity | Audit record of projection side effects, skips, or blocks. | [domain.md](domain.md#eventprojectionreceipt) |
| GrantRunNode | `goldenquill-promotion-governance.GrantRunNode` | Entity | One event or artifact in a bounded grant-run execution DAG. | [domain.md](domain.md#grantrunnode) |
| GrantRunEdge | `goldenquill-promotion-governance.GrantRunEdge` | Entity | One typed relationship that records order, consumption, emission, blocking, revision, approval, or delivery between run nodes. | [domain.md](domain.md#grantrunedge) |
| MemoryEvidencePacketRef | `goldenquill-promotion-governance.MemoryEvidencePacketRef` | Value Object | A pointer to evidence that supports a candidate or outcome without approving reuse. | [domain.md](domain.md#memoryevidencepacketref) |
| GrantOutcomeEvent | `goldenquill-promotion-governance.GrantOutcomeEvent` | Entity | A source-backed real-world grant movement. | [domain.md](domain.md#grantoutcomeevent) |
| ApplicationLifecycleState | `goldenquill-promotion-governance.ApplicationLifecycleState` | State Machine | The lifecycle projection of the deepest verified stage reached by an application. | [states.md](states.md#applicationlifecyclestate) |
| GrantKpiObservation | `goldenquill-promotion-governance.GrantKpiObservation` | Entity | A KPI read model with source events, denominator semantics, and interpretation limits. | [domain.md](domain.md#grantkpiobservation) |
| GrantActionFact | `goldenquill-promotion-governance.GrantActionFact` | Entity/read-model | Analytics-ready grant action fact. | [analytics-methods.md](analytics-methods.md#grantactionfact) |
| KpiResponseWindow | `goldenquill-promotion-governance.KpiResponseWindow` | Entity/read-model | Temporal response window joining actions to KPI movement. | [analytics-methods.md](analytics-methods.md#kpiresponsewindow) |
| StatisticalMethodSpec | `goldenquill-promotion-governance.StatisticalMethodSpec` | Policy | Registered analytics method implementation contract. | [analytics-methods.md](analytics-methods.md#statisticalmethodspec) |
| ActionKpiAssociation | `goldenquill-promotion-governance.ActionKpiAssociation` | Entity | Method output linking action patterns to KPI movement. | [analytics-methods.md](analytics-methods.md#actionkpiassociation) |
| OptimizationChainDefinition | `goldenquill-promotion-governance.OptimizationChainDefinition` | Entity/contract | Plain-language and schema-backed bridge from action/KPI evidence to named BI optimization. | [optimization-chains.md](optimization-chains.md#core-definition) |
| OptimizationChainExpression | `goldenquill-promotion-governance.OptimizationChainExpression` | Value Object | Required sentence forms for explaining the same chain to operators, executives, dashboards, contracts, and ontology projection. | [optimization-chains.md](optimization-chains.md#expression-forms) |
| BIInsightCandidate | `goldenquill-promotion-governance.BIInsightCandidate` | Entity profile | PromotionCandidate profile generated from valid analytics association evidence. | [analytics-methods.md](analytics-methods.md#biinsightcandidate-profile) |
| PromotionCandidate | `goldenquill-promotion-governance.PromotionCandidate` | Entity | A proposed learning object that is not approved reuse. | [domain.md](domain.md#promotioncandidate) |
| OwnerDecision | `goldenquill-promotion-governance.OwnerDecision` | Entity | The owner-approved, rejected, retired, or contradicted disposition of a candidate. | [domain.md](domain.md#ownerdecision) |
| ApprovedReusePacket | `goldenquill-promotion-governance.ApprovedReusePacket` | Entity | The owner-authorized reuse handoff consumed by future grant-work context. | [domain.md](domain.md#approvedreusepacket) |
| OntologyVaultProjection | `goldenquill-promotion-governance.OntologyVaultProjection` | Mapping | The audit-only projection from local candidate and owner decision into governance-compatible shape. | [mappings.md](mappings.md#ontologyvaultprojection) |
| GrantWorkEventToDagNode | `goldenquill-promotion-governance.GrantWorkEventToDagNode` | Mapping | Projection from accepted event into a grant-run DAG node. | [mappings.md](mappings.md#grantworkeventtodagnode) |
| GrantWorkEventToDagEdge | `goldenquill-promotion-governance.GrantWorkEventToDagEdge` | Mapping | Projection from accepted event into a grant-run DAG edge. | [mappings.md](mappings.md#grantworkeventtodagedge) |
| GrantWorkEventToOutcomeEvent | `goldenquill-promotion-governance.GrantWorkEventToOutcomeEvent` | Mapping | Projection from accepted event into source-backed outcome movement. | [mappings.md](mappings.md#grantworkeventtooutcomeevent) |
| OwnerDecisionToApprovedReusePacket | `goldenquill-promotion-governance.OwnerDecisionToApprovedReusePacket` | Mapping | Projection from approved owner decision into reusable packet. | [mappings.md](mappings.md#ownerdecisiontoapprovedreusepacket) |
| ApprovedReusePacketToFutureGrantContext | `goldenquill-promotion-governance.ApprovedReusePacketToFutureGrantContext` | Mapping | Projection from active approved reuse packet into future grant-work context. | [mappings.md](mappings.md#approvedreusepackettofuturegrantcontext) |
| AcceptGrantWorkEvent | `goldenquill-promotion-governance.AcceptGrantWorkEvent` | Operation | Validates and records a typed event before projection. | [operations.md](operations.md#acceptgrantworkevent) |
| RecordGrantRunEvent | `goldenquill-promotion-governance.RecordGrantRunEvent` | Operation | Records execution DAG nodes and edges. | [operations.md](operations.md#recordgrantrunevent) |
| ProjectEventToDag | `goldenquill-promotion-governance.ProjectEventToDag` | Operation | Projects accepted events into DAG nodes and edges with receipts. | [operations.md](operations.md#projecteventtodag) |
| RecordOutcomeEvent | `goldenquill-promotion-governance.RecordOutcomeEvent` | Operation | Records source-backed real-world grant movement. | [operations.md](operations.md#recordoutcomeevent) |
| ComputeKpiObservation | `goldenquill-promotion-governance.ComputeKpiObservation` | Operation | Computes denominator-safe KPI observations. | [operations.md](operations.md#computekpiobservation) |
| ProjectEventToLifecycleAndKpi | `goldenquill-promotion-governance.ProjectEventToLifecycleAndKpi` | Operation | Projects accepted events into lifecycle and KPI read models. | [operations.md](operations.md#projecteventtolifecycleandkpi) |
| CreatePromotionCandidate | `goldenquill-promotion-governance.CreatePromotionCandidate` | Operation | Creates proposal-level learning candidates from validated evidence. | [operations.md](operations.md#createpromotioncandidate) |
| ValidatePromotionGovernance | `goldenquill-promotion-governance.ValidatePromotionGovernance` | Operation | Applies local validation and Ontology Vault governance checks. | [operations.md](operations.md#validatepromotiongovernance) |
| RedactionGeneralizationGate | `goldenquill-promotion-governance.RedactionGeneralizationGate` | Operation | Blocks workspace-safe reuse until privacy-safe abstraction and owner approval exist. | [operations.md](operations.md#redactiongeneralizationgate) |
| RecordOwnerDecision | `goldenquill-promotion-governance.RecordOwnerDecision` | Operation | Records approved, rejected, retired, or contradicted owner decisions. | [operations.md](operations.md#recordownerdecision) |
| PublishApprovedReusePacket | `goldenquill-promotion-governance.PublishApprovedReusePacket` | Operation | Publishes approved allowed uses into a bounded packet after owner approval. | [operations.md](operations.md#publishapprovedreusepacket) |
| HydrateFutureGrantContext | `goldenquill-promotion-governance.HydrateFutureGrantContext` | Operation | Hydrates future work from approved reuse packets within allowed use and scope. | [operations.md](operations.md#hydratefuturegrantcontext) |
| GrantPromotionGovernanceWorkflow | `goldenquill-promotion-governance.GrantPromotionGovernanceWorkflow` | Workflow | Orchestrates run capture through outcome evidence, KPI observations, candidate generation, governance validation, privacy gate, and owner decision. | [workflows.md](workflows.md#grantpromotiongovernanceworkflow) |
| GrantRunCaptureLoop | `goldenquill-promotion-governance.GrantRunCaptureLoop` | Workflow | Accepts adapter events and projects them into the execution DAG. | [workflows.md](workflows.md#grantruncaptureloop) |
| OutcomeMeasurementLoop | `goldenquill-promotion-governance.OutcomeMeasurementLoop` | Workflow | Projects accepted outcome events into lifecycle and KPI observations. | [workflows.md](workflows.md#outcomemeasurementloop) |
| KnowledgeFeedbackLoop | `goldenquill-promotion-governance.KnowledgeFeedbackLoop` | Workflow | Returns owner-approved learning into future grant-work context. | [workflows.md](workflows.md#knowledgefeedbackloop) |
| PromotionAuthorityPolicy | `goldenquill-promotion-governance.PromotionAuthorityPolicy` | Policy | Keeps metrics, evidence, and candidates separate from approved authority. | [workflows.md](workflows.md#promotionauthoritypolicy) |

## Maintenance Rules

- Update this glossary whenever [SPEC.md](SPEC.md) concept registry changes.
- Keep implementation-facing language GoldenQuill-native.
- Do not introduce new canonical behavior here; update the source aspect document first.
