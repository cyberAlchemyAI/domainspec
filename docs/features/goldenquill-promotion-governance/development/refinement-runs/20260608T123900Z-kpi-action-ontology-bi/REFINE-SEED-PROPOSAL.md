---
run_id: 20260608T123900Z-kpi-action-ontology-bi
target: docs/features/goldenquill-promotion-governance
status: strategy-proposal
preset: standard
research: research-if-gap-appears
---

# Refine Seed Proposal: KPI Action Ontology BI

## Operator Intent

Clarify how GoldenQuill can correlate grant actions with KPI movement to
generate business intelligence, which statistical techniques are appropriate,
how grant-run data is captured, how it becomes ontology-ready knowledge, and
how that intelligence improves the grant pipeline over time.

## Target Context

Primary target:

- `docs/features/goldenquill-promotion-governance/`

Local evidence used for this seed:

- `SPEC.md`
- `architecture.md`
- `domain.md`
- `operations.md`
- `events.md`
- `mappings.md`
- `workflows.md`
- `observability.md`
- `TEST-SPEC.md`

## Missing Architecture Questions

1. Which grant actions are analytical treatments, interventions, or process
   events rather than just DAG history.
2. How action events join to outcome, cost, lifecycle, and quality KPI windows.
3. Which statistical techniques are safe at small sample sizes and which require
   stronger data maturity.
4. How correlation findings become ontology concepts without becoming premature
   promotion authority.
5. How business intelligence feeds future Scout, Scribe, Judge, Logician,
   operator, and funding-goal choices.
6. Which data contracts are required for causal or quasi-causal claims.

## Initial Architectural Position

Grant-run data should enter through typed events and project into two connected
models:

```text
GrantWorkEvent -> execution DAG
GrantWorkEvent -> analytic fact table / feature view
OutcomeEvent + KPIObservation -> measured response windows
Action-KPI association -> BI insight candidate
BI insight candidate -> Ontology Vault governance projection
OwnerDecision -> ApprovedReusePacket
ApprovedReusePacket -> future grant-work context
```

The execution DAG answers "what happened and in what order." The analytic
projection answers "what action pattern was present before which measured
result, under what context, with which limits." The ontology layer should receive
only governed insight candidates with evidence, confidence, contradiction paths,
scope, and approved allowed uses.

## Statistical Technique Menu

| Technique family | Use when | Example GoldenQuill question | Guardrail |
| --- | --- | --- | --- |
| Descriptive cohorts | Early data, small samples, baseline BI. | Do grants with Logician preflight pass reach submission faster? | Report counts and denominators; no causal claim. |
| Funnel and stage transition analysis | Lifecycle depth and conversion. | Which actions improve `eligible_match -> go_no_go_approved` or `submitted -> agency_retrieved`? | Keep stage and outcome truth separate. |
| Time-to-event / survival analysis | Cycle time and delayed outcomes. | Which actions shorten discovery-to-submit or submit-to-decision time? | Right-censor pending grants. |
| Regression / generalized linear models | Enough observations and controlled covariates. | Do responsiveness maps predict review reached after controlling funder type and amount? | Use interpretation limits and confidence intervals. |
| Mixed-effects / hierarchical models | Grants nested by org, funder, program, or writer. | Is a pattern global or only true for one funder family? | Preserve org scope and random/group effects. |
| Difference-in-differences | A workflow change is introduced at a known time. | Did adding Judge scoring improve review feedback quality versus prior runs? | Needs before/after and comparison group. |
| Propensity scoring / matching | Action choice is biased by opportunity quality. | Did Red Team review help, or was it used only on risky applications? | Requires measured confounders. |
| Uplift modeling | Choosing actions for future runs. | Which grants benefit most from extra evidence-gap work? | Use only after enough treated/untreated examples exist. |
| Bayesian updating | Sparse evidence, prior-informed estimates. | What is our current belief about funder-family strategy fit? | Show prior, posterior, and uncertainty. |
| Association rules / sequence mining | Repeated action patterns in DAG paths. | Which action sequences often precede high rubric coverage? | Treat as candidate discovery, not proof. |
| Anomaly and residual analysis | Outliers, failures, and exceptions. | Which submissions took unusually long despite normal gate passes? | Generate investigation candidates. |

## Data-To-Ontology Transformation Hypothesis

The ontology should not ingest raw events as reusable knowledge. It should ingest
governed analytical insight candidates:

```text
action_pattern
  supported_by event/query evidence
  measured_against KPI observation window
  scoped_by org/funder/program/stage
  qualified_by sample size, confidence, bias notes, and interpretation limits
  reviewed_by governance/privacy gate
  decided_by owner
  emitted_as approved reuse packet when approved
```

## Candidate Development Project Split

| Project | Boundary | First Deliverable |
| --- | --- | --- |
| GQ-BI-001 Action Fact Projection | Project DAG events into action facts and feature windows. | Fixture action fact table with source event refs. |
| GQ-BI-002 KPI Response Windows | Join actions to lifecycle, outcome, cost, and quality KPI observations. | Deterministic cohort and response-window fixtures. |
| GQ-BI-003 Statistical Method Registry | Define allowed methods, assumptions, sample-size gates, and output contracts. | Method registry doc plus fail-closed method validator. |
| GQ-BI-004 Insight Candidate Ontology Bridge | Transform statistical findings into governed BI insight candidates. | Mapping from association result to Ontology Vault projection. |
| GQ-BI-005 Feedback To Pipeline Decisions | Hydrate future Scout/Scribe/Judge/Logician/operator context from approved BI packets. | End-to-end fixture from action pattern to future recommendation. |

## Done Criteria For This Refine Run

- Produce a validated `REFINE-DISPATCH.json` route proposal.
- Record the statistical method alternatives and their guardrails.
- Preserve the distinction between correlation, causal evidence, ontology
  candidate, and approved reusable intelligence.
- Stop before runtime-backed stages or delegated subagents until confirmed.

## Validation Surface

- Dispatch route validates with:
  `python3 /home/vrondelli/projects/domainspec-core/arcanum/formulae/dispatch-spec/scripts/validate-dispatch.py REFINE-DISPATCH.json`
- No canonical SPEC, architecture, domain, workflow, event, mapping, operation,
  or test artifact is mutated in this strategy-proposal pass.
