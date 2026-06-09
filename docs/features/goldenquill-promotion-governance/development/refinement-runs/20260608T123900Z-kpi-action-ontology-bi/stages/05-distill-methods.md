---
stage: s5-distill
owner: distill
mode: standard
status: pass
---

# Distill: Statistical Method Alternatives

## Selected Coherent Unit

The smallest coherent unit is not "advanced grant analytics." It is:

```text
ActionFact + KpiResponseWindow + StatisticalMethodSpec + ActionKpiAssociation
```

This unit can be tested with fixtures before dashboards, model training, or
ontology mutation.

## Method Tournament

| Method | First Use | Data Needed | Claim Allowed | Maturity |
| --- | --- | --- | --- | --- |
| Descriptive cohorts | Compare KPI averages by action presence or segment. | action facts, KPI windows, denominators. | `descriptive_pattern` | L0 |
| Funnel/stage transition analysis | Measure stage conversion after action patterns. | lifecycle stages, ordered events. | `correlation_candidate` | L0 |
| Sequence mining | Discover repeated action paths before KPI movement. | ordered DAG/action sequences. | `correlation_candidate` | L1 |
| Time-to-event / survival | Model cycle time with pending outcomes. | event dates, censored outcomes. | `controlled_association` | L1 |
| Regression / GLM | Estimate association with covariates. | enough rows, covariates, target KPI. | `controlled_association` | L2 |
| Mixed-effects / hierarchical | Separate org/funder/program effects. | grouped data with enough clusters. | `controlled_association` | L2 |
| Bayesian updating | Update sparse beliefs with uncertainty. | priors, observed likelihood, uncertainty. | `decision_support_only` | L1-L2 |
| Difference-in-differences | Evaluate known workflow change. | before/after plus comparison group. | `quasi_causal_candidate` | L3 |
| Propensity matching | Reduce action-selection bias. | measured confounders and overlap. | `quasi_causal_candidate` | L3 |
| Uplift modeling | Recommend who benefits from an action. | large treated/untreated history. | `decision_support_only` | L4 |

## Pareto Decision

For the first implementation slice, keep only:

1. descriptive cohorts;
2. funnel/stage transitions;
3. sequence mining;
4. simple time-to-event summaries with censoring labels.

Defer regression, hierarchical, quasi-causal, and uplift methods until event
coverage, covariates, and sample sizes are proven.

## Required Method Registry Fields

| Field | Purpose |
| --- | --- |
| `method_id` | Stable method identifier. |
| `method_family` | Cohort, funnel, sequence, survival, regression, Bayesian, quasi-causal, uplift, anomaly. |
| `minimum_observations` | Fail-closed sample-size gate. |
| `required_fields` | Action, KPI, time, source, denominator, scope, and covariate requirements. |
| `allowed_claim_labels` | Prevents overclaiming. |
| `bias_checks` | Missingness, censoring, selection, confounding, leakage, multiple comparisons. |
| `output_schema` | Fields required in `ActionKpiAssociation`. |
| `promotion_limit` | Explicit statement that output is evidence only. |
