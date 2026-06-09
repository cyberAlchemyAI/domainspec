---
stage: s2-invoke-define
owner: invoke
mode: define
status: pass
---

# Define: KPI Action Business Intelligence

## Definition

GoldenQuill KPI Action BI is a governed analytics layer that correlates
validated grant-work actions with later KPI movement, turns qualified findings
into ontology-compatible insight candidates, and feeds approved intelligence
back into future grant-work decisions.

## Core Objects

| Object | Definition | Authority |
| --- | --- | --- |
| `ActionFact` | One analytics-ready action derived from accepted grant-work event(s), DAG node(s), and projection receipt(s). | Analytical feature only. |
| `ActionPattern` | A repeated action, sequence, bundle, or timing pattern across runs. | Candidate explanatory feature. |
| `KpiResponseWindow` | A bounded before/after, stage-to-stage, or time-to-event window where KPI movement is measured. | Measurement boundary. |
| `StatisticalMethodSpec` | Registry entry that names method assumptions, minimum data, allowed claim type, and output contract. | Method guardrail. |
| `ActionKpiAssociation` | Statistical output linking an action pattern to KPI movement with method, sample, uncertainty, bias notes, and limits. | Analytical evidence, not reusable authority. |
| `BIInsightCandidate` | Governance-ready candidate derived from one or more associations. | Proposal-level ontology candidate. |
| `BIInsightPacket` | Approved reuse packet carrying owner-approved BI guidance into future grant-work context. | Approved reuse only after owner decision. |

## Grant Actions To Capture

Action facts should come from accepted events or projected DAG nodes, including:

- discovery and verification actions;
- go/no-go operator decisions;
- RFA dissection and requirement extraction;
- KGIE/preflight gates and evidence-gap resolution;
- Scribe drafting and revision actions;
- Editor suggestions applied or rejected;
- Judge scoring and score movement;
- responsiveness-map coverage actions;
- Red Team review and mitigation actions;
- Logician pass/warn/fail gates and waivers;
- operator signoff and delivery timing;
- portal staging and submission events;
- post-outcome follow-up and stewardship actions.

## KPI Families To Correlate

| KPI family | Example response |
| --- | --- |
| Lifecycle depth | Stage advancement, review reached, final decision reached. |
| Outcome | Award, decline, withdrawal, partial award, closeout. |
| Quality | Rubric coverage, score movement, reviewer objection resolution. |
| Strategy fit | high-match pursuit, low-fit avoidance, new-funder conversion. |
| Effort and cost | hours per submission, cost per award, cycle time. |
| Relationship and capacity | funder touchpoints, stakeholder engagement, repeat support. |

## Claim Labels

Every method output must choose one claim label:

| Label | Meaning |
| --- | --- |
| `descriptive_pattern` | Observed pattern only. |
| `correlation_candidate` | Association exists after basic denominator and segment checks. |
| `controlled_association` | Association survives specified covariates or grouping. |
| `quasi_causal_candidate` | Design approximates causal inference but still needs explicit assumptions. |
| `decision_support_only` | Useful for owner/operator judgment, not automated routing. |
| `blocked_or_residue` | Too sparse, biased, private, or contradicted for reuse. |

## Definition Guardrail

Business intelligence improves the pipeline by ranking questions, surfacing
candidate practices, and supplying approved context. It must not auto-optimize
grant work or mutate ontology authority without governance.
