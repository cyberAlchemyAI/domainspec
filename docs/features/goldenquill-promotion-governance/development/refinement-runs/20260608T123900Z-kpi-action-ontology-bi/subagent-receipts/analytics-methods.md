---
role_id: analytics-methods
agent_id: 019ea993-5a02-7530-b90f-3dee10ff193a
status: pass
---

# Subagent Receipt: Analytics Methods

## Source Paths Read

- `SPEC.md`
- `domain.md`
- `operations.md`
- `TEST-SPEC.md`
- `observability.md`
- `RUN-MANIFEST.md`
- `RESULT.md`
- `REFINE-SEED-PROPOSAL.md`
- `evidence-index.json`
- `stages/01-context-baseline.md`
- `stages/04-research-decision.md`
- `stages/05-distill-methods.md`
- `stages/06-design-kpi-action-ontology-bi.md`
- `stages/07-design-review.md`
- `stages/08-repair.md`
- `stages/09-plan-bi-project-split.md`

## Findings

- The core analytics unit is sound: `ActionFact + KpiResponseWindow +
  StatisticalMethodSpec + ActionKpiAssociation`, followed by
  `BIInsightCandidate`, not direct ontology promotion.
- L0 should allow descriptive cohorts, funnel/stage transitions, sequence
  mining, and simple survival/time-to-event summaries with censoring labels.
  These emit only `descriptive_pattern` or `correlation_candidate`.
- Regression/GLM, hierarchical/mixed-effects, Bayesian updating, quasi-causal
  designs, uplift modeling, and anomaly/residual analysis are valid later
  families but need explicit data maturity gates before activation.
- Existing governance blocks the key overclaim: KPI observations and statistical
  outputs cannot approve reuse; owner decisions own `approved_allowed_uses`.
- Method-specific gates still need validator-ready detail: minimum observations,
  treatment-selection metadata, covariate coverage, overlap, leakage checks,
  multiple-comparison handling, and aggregate privacy thresholds.

## Recommended Deltas

- Add `StatisticalMethodSpec` with `method_family`, `minimum_observations`,
  `required_fields`, `bias_checks`, `allowed_claim_labels`, `blocked_claims`,
  `promotion_limit`, and `output_schema`.
- Add maturity levels: L0 descriptive/cohort/funnel; L1 sequence/survival/
  Bayesian decision support; L2 controlled regression/hierarchical; L3
  quasi-causal; L4 uplift.
- Add fail-closed guards for temporal leakage, right-censoring, missing outcome
  data, small samples, selection bias, confounding, funder/org clustering,
  sparse segments, multiple exploratory scans, and aggregate privacy leakage.
- Add `ActionKpiAssociation.claim_label` values:
  `descriptive_pattern`, `correlation_candidate`, `controlled_association`,
  `quasi_causal_candidate`, `decision_support_only`, and `blocked_or_residue`.
- Add toy fixtures for naive-positive Red Team association downgraded by
  confounding, pending outcomes treated as censored, post-outcome action
  rejected as leakage, quasi-causal method blocked without comparison group, and
  KPI-only ontology promotion blocked.
- Add method-block observability counters:
  `method_sample_gate_failed`, `temporal_leakage_blocked`,
  `censoring_required`, `selection_bias_unchecked`,
  `multiple_comparison_residue`, and `aggregate_privacy_threshold_failed`.

## Blockers

- Exact sample-size thresholds remain unresolved and should not be invented
  until expected data volume and segment sizes are known.
- No external/statistical benchmarking was authorized or run; acceptable for
  fixture contract, not enough for production causal claims.

## Residue

- Production causal inference remains future work requiring treatment-selection
  logs, comparison groups, covariates, and stable intervention timing.
- Dashboard UX is out of scope.
- Approved BI feedback must remain scoped guidance only.

## Validation

Read-only review. Verdict: pass with required analytics-method hardening before
implementation.
