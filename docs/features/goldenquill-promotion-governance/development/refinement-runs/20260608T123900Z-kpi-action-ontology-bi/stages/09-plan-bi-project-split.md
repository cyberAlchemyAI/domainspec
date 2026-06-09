---
stage: s9-invoke-plan
owner: invoke
mode: plan
status: pass
---

# Plan: BI Project Split

## GQ-BI-001 Action Fact Projection

Goal: derive analytics-ready `ActionFact` rows from accepted events, projection
receipts, and DAG nodes.

Deliverables:

- `ActionFact` schema;
- event/DAG-to-action mapping table;
- fixtures for Scout, Scribe, Judge, Red Team, Logician, operator, and portal
  actions;
- validator for source refs, org scope, and idempotent projection.

Acceptance:

- invalid source-less action fact fails;
- replayed event does not duplicate action fact;
- action fact links back to event and DAG evidence.

## GQ-BI-002 KPI Response Windows

Goal: define windows that join prior actions to later lifecycle, outcome, cost,
quality, strategy, and relationship KPI observations.

Deliverables:

- `KpiResponseWindow` schema;
- baseline/response fixture corpus;
- censoring and missingness rules;
- tests for temporal leakage.

Acceptance:

- action after response window cannot be used as predictor;
- pending outcomes are censored, not treated as loss;
- denominator definition is mandatory.

## GQ-BI-003 Statistical Method Registry

Goal: registry of allowed methods, assumptions, sample gates, bias checks, and
claim labels.

Deliverables:

- method registry document;
- method output schema for `ActionKpiAssociation`;
- validator for minimum observations, required fields, allowed claims, and bias
  checks.

Acceptance:

- L0 methods cannot emit causal claims;
- quasi-causal methods block until design requirements are met;
- every association has interpretation limits.

## GQ-BI-004 Ontology BI Insight Bridge

Goal: transform validated associations into governed `BIInsightCandidate`
records.

Deliverables:

- mapping from `ActionKpiAssociation` to `BIInsightCandidate`;
- Ontology Vault projection shape;
- contradiction-path and target-owner rules.

Acceptance:

- association cannot become approved reuse directly;
- candidate without contradiction path fails;
- org-scoped insight blocks without privacy/generalization gate.

## GQ-BI-005 Approved BI Feedback

Goal: hydrate future grant-work context from approved BI packets.

Deliverables:

- approved BI reuse packet profile;
- future-context hydration rules for Scout/Scribe/Judge/Logician/operator;
- end-to-end toy fixture.

Acceptance:

- future context consumes only approved allowed uses;
- retired or contradicted packet does not hydrate;
- low-confidence/private residue remains visible as residue, not guidance.
