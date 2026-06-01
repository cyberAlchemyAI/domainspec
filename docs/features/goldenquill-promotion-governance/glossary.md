---
feature: goldenquill-promotion-governance
version: current
status: draft
updatedAt: 2026-06-01
docType: glossary
---

# Glossary: GoldenQuill Promotion Governance

This glossary explains the feature language used by GoldenQuill Promotion
Governance. Authoritative behavior, fields, rules, and lifecycle contracts
remain in the linked source documents in this feature folder.

## Feature Language

| Term | Meaning in this feature | Related Concepts |
| --- | --- | --- |
| Application stage | The deepest verified point an application reached in the grant process. It is not final outcome truth. | [ApplicationLifecycleState](states.md#applicationlifecyclestate), [ApplicationStage](domain.md#applicationstage) |
| Outcome event | A source-backed real-world grant movement such as submission, portal validation, agency retrieval, review, award, decline, withdrawal, report acceptance, or closeout. | [GrantOutcomeEvent](domain.md#grantoutcomeevent) |
| Validation state | Whether a claim, denominator, feedback interpretation, compliance result, edge, or candidate has been checked, failed, waived, or contradicted. | [ValidationState](domain.md#validationstate) |
| Evidence packet | A source reference or evidence packet pointer. It can support decisions but never approves reuse by itself. | [MemoryEvidencePacketRef](domain.md#memoryevidencepacketref), [SourceRef](domain.md#sourceref) |
| KPI observation | A denominator-safe metric read model derived from source-backed events. It can create candidates after validation but cannot promote directly. | [GrantKpiObservation](domain.md#grantkpiobservation) |
| Promotion candidate | A proposed learning object created from evidence, outcomes, feedback, or KPI observations. | [PromotionCandidate](domain.md#promotioncandidate) |
| Owner decision | The authority record that approves, rejects, retires, or contradicts a candidate. Approved allowed uses live here. | [OwnerDecision](domain.md#ownerdecision) |
| Governance layer | The Ontology Vault compatibility and safety layer that checks evidence sufficiency, review gate, contradiction path, and allowed-use boundaries. | [OntologyVaultProjection](mappings.md#ontologyvaultprojection) |
| Redaction/generalization gate | The privacy gate that turns org-scoped feedback into workspace-safe learning only when generalized and owner-approved. | [RedactionGeneralizationGate](operations.md#redactiongeneralizationgate) |
| Org-scoped feedback | Feedback that belongs to one applicant, client, or org context by default. | [OrgScope](domain.md#orgscope) |
| Workspace-safe learning | Reusable learning that has passed redaction/generalization and owner approval. | [OwnerDecision](domain.md#ownerdecision), [AllowedUse](domain.md#alloweduse) |

## Formal Concepts

| Term | Concept ID | Type | Definition | Source |
| --- | --- | --- | --- | --- |
| GrantRunNode | `goldenquill-promotion-governance.GrantRunNode` | Entity | One event or artifact in a bounded grant-run execution DAG. | [domain.md](domain.md#grantrunnode) |
| GrantRunEdge | `goldenquill-promotion-governance.GrantRunEdge` | Entity | One typed relationship that records order, consumption, emission, blocking, revision, approval, or delivery between run nodes. | [domain.md](domain.md#grantrunedge) |
| MemoryEvidencePacketRef | `goldenquill-promotion-governance.MemoryEvidencePacketRef` | Value Object | A pointer to evidence that supports a candidate or outcome without approving reuse. | [domain.md](domain.md#memoryevidencepacketref) |
| GrantOutcomeEvent | `goldenquill-promotion-governance.GrantOutcomeEvent` | Entity | A source-backed real-world grant movement. | [domain.md](domain.md#grantoutcomeevent) |
| ApplicationLifecycleState | `goldenquill-promotion-governance.ApplicationLifecycleState` | State Machine | The lifecycle projection of the deepest verified stage reached by an application. | [states.md](states.md#applicationlifecyclestate) |
| GrantKpiObservation | `goldenquill-promotion-governance.GrantKpiObservation` | Entity | A KPI read model with source events, denominator semantics, and interpretation limits. | [domain.md](domain.md#grantkpiobservation) |
| PromotionCandidate | `goldenquill-promotion-governance.PromotionCandidate` | Entity | A proposed learning object that is not approved reuse. | [domain.md](domain.md#promotioncandidate) |
| OwnerDecision | `goldenquill-promotion-governance.OwnerDecision` | Entity | The owner-approved, rejected, retired, or contradicted disposition of a candidate. | [domain.md](domain.md#ownerdecision) |
| OntologyVaultProjection | `goldenquill-promotion-governance.OntologyVaultProjection` | Mapping | The audit-only projection from local candidate and owner decision into governance-compatible shape. | [mappings.md](mappings.md#ontologyvaultprojection) |
| RecordGrantRunEvent | `goldenquill-promotion-governance.RecordGrantRunEvent` | Operation | Records execution DAG nodes and edges. | [operations.md](operations.md#recordgrantrunevent) |
| RecordOutcomeEvent | `goldenquill-promotion-governance.RecordOutcomeEvent` | Operation | Records source-backed real-world grant movement. | [operations.md](operations.md#recordoutcomeevent) |
| ComputeKpiObservation | `goldenquill-promotion-governance.ComputeKpiObservation` | Operation | Computes denominator-safe KPI observations. | [operations.md](operations.md#computekpiobservation) |
| CreatePromotionCandidate | `goldenquill-promotion-governance.CreatePromotionCandidate` | Operation | Creates proposal-level learning candidates from validated evidence. | [operations.md](operations.md#createpromotioncandidate) |
| ValidatePromotionGovernance | `goldenquill-promotion-governance.ValidatePromotionGovernance` | Operation | Applies local validation and Ontology Vault governance checks. | [operations.md](operations.md#validatepromotiongovernance) |
| RedactionGeneralizationGate | `goldenquill-promotion-governance.RedactionGeneralizationGate` | Operation | Blocks workspace-safe reuse until privacy-safe abstraction and owner approval exist. | [operations.md](operations.md#redactiongeneralizationgate) |
| RecordOwnerDecision | `goldenquill-promotion-governance.RecordOwnerDecision` | Operation | Records approved, rejected, retired, or contradicted owner decisions. | [operations.md](operations.md#recordownerdecision) |
| GrantPromotionGovernanceWorkflow | `goldenquill-promotion-governance.GrantPromotionGovernanceWorkflow` | Workflow | Orchestrates run capture through outcome evidence, KPI observations, candidate generation, governance validation, privacy gate, and owner decision. | [workflows.md](workflows.md#grantpromotiongovernanceworkflow) |
| PromotionAuthorityPolicy | `goldenquill-promotion-governance.PromotionAuthorityPolicy` | Policy | Keeps metrics, evidence, and candidates separate from approved authority. | [workflows.md](workflows.md#promotionauthoritypolicy) |

## Maintenance Rules

- Update this glossary whenever [SPEC.md](SPEC.md) concept registry changes.
- Keep implementation-facing language GoldenQuill-native.
- Do not introduce new canonical behavior here; update the source aspect document first.
