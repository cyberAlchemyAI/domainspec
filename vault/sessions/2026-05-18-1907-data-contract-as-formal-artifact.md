---
tags: [vault, ontology, architecture, data-contract, governance]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, reference
status: active
created: 2026-05-18
timestamp: 2026-05-18T19:07:21+00:00
expires: 2026-07-17
conversation_id: data-contract-as-formal-artifact-2026-05-18
decisions_made: true
contradictions_found: false

specs_updated: []
promoted_candidates: [vault/discovery/data-contract-as-formal-artifact/README.md]
expected_importance: 7
importance_rationale: "Resolves whether data-contract earns a new vault node_type; sets the schema-patch + CI-lint + optional-generator path as canonical for downstream consumer repos."
---

# Data Contract as Formal Artifact

## Summary

User asked whether data-contract should become a formal DomainSpec artifact. A triangulation subagents dispatch (4 L1 investigators on repo state and literature + 2 L2 evaluators in constructive/adversarial roles + parent synth) concluded that DomainSpec-core should ship schema patches + CI lints + an optional `contract_view` generator rather than a new `DATA-CONTRACT` artifact node type — a contract presupposes promisor + promisee, which exist only at consumer-repo level. Persisted the dispatch spec, research+findings pair, and a new discovery node (D-1..4, A-1..3, OQ-1..5); added inverse edges on two existing vault docs; committed as 847cff0.

## Files touched

- vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml
- docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-research.md
- docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-findings.md
- vault/discovery/data-contract-as-formal-artifact/README.md
- vault/constitution/domainspec-subagents-strategy-constitution.md
- vault/discovery/template-calibration-discipline/README.md
- internal_tools/vault_telemetry/events/subagent-strategy.jsonl

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/snapshots/dispatches/2026-05-18-data-contract-formal-artifact-spec.yaml` | `creates` | Session produced the dispatch spec for the triangulation fan-out. |
| `docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-research.md` | `creates` | Session produced the raw L1/L2 research artifact for the dispatch. |
| `docs/discovery/data-contract-as-formal-artifact/research/domainspec-subagents-findings.md` | `creates` | Session produced the synthesis findings file for the dispatch. |
| `vault/discovery/data-contract-as-formal-artifact/README.md` | `creates` | Session produced the new discovery node carrying D-1..4, A-1..3, OQ-1..5. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `modifies` | Session added one row to §13 Connections (inverse `governs` edge). |
| `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` | `modifies` | Session appended one dispatch event to the telemetry log. |
| `vault/discovery/template-calibration-discipline/README.md` | `derives-from` | D-2's optional-tag-column posture in the new discovery draws its justification from this discovery's `required minimum + demonstrated optional` rule. |
| `vault/discovery/template-calibration-discipline/README.md` | `modifies` | Session added one row to Connections (inverse `cited-by` edge) to wire bidirectionality with the new discovery. |
