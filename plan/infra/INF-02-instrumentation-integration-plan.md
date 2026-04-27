# INF-02 Instrumentation Integration Plan

## Strategy

Use contract-first integration:

1. Publish telemetry schema and field requirements in INF-02.
2. Integrate emitters into INF-01 runtime gateway.
3. Integrate governance loop emission and scoring in INF-03.

This resolves the INF-01 <-> INF-02 dependency cycle without blocking progress.

## Mandatory Emitter Boundaries

1. Runtime gateway boundary (required)
2. Tool-usage events (required)
3. Agent decision workflow events (required)

## Integration Targets

| Target                    | Required Emissions                                                            | Notes                                                      |
| ------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| INF-01 runtime envelope   | `invocation_span`, `execution_event`                                          | Primary source of invocation context and runtime metadata. |
| Orchestrator routing flow | `execution_event` (`agent-routing`, `decision-selected`)                      | Captures selected agents/skills and route rationale.       |
| Governance checks         | `execution_event` (`gate-check`), `invocation_summary.governance_gate_result` | Required for block/pass traceability.                      |
| Validation step outputs   | `execution_event` (`validation-run`)                                          | Links run quality to task/session outcomes.                |

## Integration Sequence

1. Add shared telemetry envelope fields to runtime request/response contracts.
2. Add runtime start/end span emission.
3. Add tool-usage event emission wrappers.
4. Add agent-routing and decision-selected events.
5. Add summary emission at invocation completion.
6. Validate schema compliance against `INF-02-telemetry-schema.md`.

## Validation Checks

| Check                 | Pass Condition                                                  |
| --------------------- | --------------------------------------------------------------- |
| Schema conformance    | All required fields present by record type.                     |
| Event coverage        | Tool usage + routing + gate checks emitted for each invocation. |
| Cost coverage         | `estimated_cost_usd` present or explicitly null with reason.    |
| Governance visibility | `governance_gate_result` present in summary record.             |

## Risks and Trade-offs

- Adding tool and decision workflow events increases implementation complexity moderately.
- Contract-first sequencing avoids blocking but requires disciplined downstream adoption in INF-01 and INF-03.
