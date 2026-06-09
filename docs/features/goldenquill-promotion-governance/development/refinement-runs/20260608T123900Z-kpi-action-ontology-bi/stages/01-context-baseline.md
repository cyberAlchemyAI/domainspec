---
stage: s1-context-baseline
owner: context-builder
status: pass
---

# Context Baseline: KPI Action Ontology BI

## Evidence Read

| Path | Evidence |
| --- | --- |
| `SPEC.md` | Event-spine, DAG, KPI observation, promotion candidate, owner decision, and approved reuse contracts. |
| `architecture.md` | Candidate implementation shape with `event_spine`, `execution`, `metrics`, `promotion`, `ontology_vault`, `privacy`, and `reuse` components. |
| `domain.md` | `GrantWorkEvent`, `EventProjectionReceipt`, `GrantOutcomeEvent`, `GrantKpiObservation`, `PromotionCandidate`, `OwnerDecision`, and `ApprovedReusePacket`. |
| `operations.md` | Event acceptance, projection, outcome capture, KPI computation, candidate creation, governance validation, owner decision, and future context hydration rules. |
| `mappings.md` | Event-to-DAG, event-to-outcome, governance projection, owner-decision-to-approved-reuse, and future context mappings. |
| `workflows.md` | Grant run capture, outcome measurement, and knowledge feedback loops. |
| `TEST-SPEC.md` | Fixture obligations for event acceptance, projection receipts, KPI denominators, governance, and approved reuse. |

## Current Contract Shape

The current docs already define a safe promotion-governance spine:

```text
GrantWorkEvent
  -> EventProjectionReceipt
  -> execution DAG / outcome / KPI read models
  -> PromotionCandidate
  -> OntologyVaultProjection
  -> OwnerDecision
  -> ApprovedReusePacket
  -> FutureGrantContext
```

What remains underdefined is the analytical bridge between run actions and KPI
movement. The DAG records order and authority. Business intelligence needs an
additional projection that turns selected DAG/event evidence into action facts,
then joins those action facts to response windows and KPI observations.

## Missing Component Catalog

| Component | Needed Contract | Why |
| --- | --- | --- |
| `ActionFact` | Normalized analytical representation of a grant action, derived from accepted events and DAG nodes. | Lets BI ask "which action pattern happened" without mining raw DAG every time. |
| `ActionContext` | Funder, program, org scope, stage, amount band, grant family, staff/seat, and timing context. | Controls confounding and supports segmentation. |
| `KpiResponseWindow` | Time/stage window that joins actions to later KPI observations. | Prevents invalid same-time or post-outcome correlations. |
| `StatisticalMethodRegistry` | Allowed methods, assumptions, required fields, sample-size gates, output labels, and blocked claims. | Keeps analytics honest and validator-friendly. |
| `ActionKpiAssociation` | Method output linking action pattern and KPI movement with confidence, caveats, and evidence refs. | Intermediate analytical result, not approved intelligence. |
| `BIInsightCandidate` | Governed candidate generated from association result. | Ontology-safe bridge into governance review. |
| `BIInsightPacket` | Approved reuse packet specialized for future grant-work intelligence. | Feeds future pipeline only after owner approval. |

## Authority Split

```text
DAG evidence answers: what happened?
Action facts answer: what analytical feature was present?
KPI windows answer: what changed later?
Statistical methods answer: what association is supported?
BI insight candidates answer: what might be reusable intelligence?
Owner decisions answer: what is approved for future use?
```

No statistical result, KPI threshold, model score, or ontology projection can
approve reusable knowledge directly.
