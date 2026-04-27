# INF-02 Dashboard Field Contract

## Audience

1. Project owner view
2. Governance owner view

## Common Fields

| Field             | Type   | Description                          |
| ----------------- | ------ | ------------------------------------ |
| objective_profile | string | Objective context from CTX-01 model. |
| task_id           | string | Task scope for the telemetry row.    |
| runtime_target    | enum   | `local`, `vps`, `cloud`.             |
| role_context      | enum   | Role perspective for slice/filter.   |
| window_start_utc  | string | Aggregation window start.            |
| window_end_utc    | string | Aggregation window end.              |

## Project Owner Fields

| Field                 | Type    | Description                                  |
| --------------------- | ------- | -------------------------------------------- |
| invocations_total     | integer | Total invocation count in selected period.   |
| success_rate          | number  | Success ratio for selected scope.            |
| p95_duration_ms       | integer | Latency pressure indicator.                  |
| estimated_cost_usd    | number  | Cost trend per objective and runtime target. |
| dependency_block_rate | number  | Frequency of dependency-caused blocks.       |
| top_blocker_reason    | string  | Highest-frequency blocker reason.            |

## Governance Owner Fields

| Field                               | Type    | Description                                   |
| ----------------------------------- | ------- | --------------------------------------------- |
| governance_gate_result_distribution | object  | Distribution of pass/flag/block outcomes.     |
| block_rate                          | number  | Block ratio in selected scope.                |
| decision_traceability_score         | number  | Coverage quality of explicit decision events. |
| schema_compliance_rate              | number  | Required-field completeness ratio.            |
| policy_violation_count              | integer | Count of policy violations in period.         |
| unresolved_field_gaps               | integer | Open field gaps from schema gap register.     |

## Rendering Requirements

- All ratio fields render with two decimal precision.
- Block and violation trends must include prior-period delta.
- Dashboard filters must support `objective_profile`, `task_id`, `runtime_target`, and `role_context`.

## Contract Versioning

- contract_version: `inf-02-v1`
- compatibility_rule: additive fields allowed, required-field removals are breaking.
