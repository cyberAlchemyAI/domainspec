---
tags: [agents, architecture, ontology, dispatch]
node_type: domainspec-subagents-strategy
is_session: true
layer: architecture
nature: procedural, reference
status: active
created: 2026-06-12
timestamp: 2026-06-12T11:39:00-03:00
expires: 2026-08-11
conversation_id: subagents-strategy-v050-lean-rewrite
decisions_made: true
contradictions_found: true
specs_updated: [subagents-strategy-constitution-proposal.md]
promoted_candidates: []
expected_importance: 9
importance_rationale: "Complete lean rewrite proposal of the subagent-dispatch constitution — new persistence surface (single registry row), groups-sequential/agents-parallel execution, connections topology, robot_talks semantics — governing all future dispatch if adopted."
---

# Session — subagents-strategy v0.5.0 lean rewrite proposal, attacked and converged

## Summary

Produced `subagents-strategy-constitution-proposal.md` (repo root, draft v0.5.0-proposal) to replace both the live v0.3.0 constitution and the v0.4.0 draft: parameter-centric (What/Why/How per field, agent-fills/human-confirms), one persistence surface (a registry row at `telemetry/agents/subagents-dispatch.yaml`, replacing spec files + telemetry JSONL), groups sequential with agents parallel, connections `{from, to, type ∈ sequential|zig-zag|feedback, loop_cap?}` with a canonical explorers→synthesizer↔reviewers edge set, intra-group `robot_talks` boolean with derived aggregation, and `meta` + `parent_dispatch_id` lineage. The draft survived three governed dispatches — a 3-skeptic attack, a 2-lens revision evaluation (lean ⟂ enforceability), and a 3-1-3 propose/synthesize/review zig-zag converging at NO-OBJECTION in round 2. Cuts are recorded in §7; P-SS-8/P-SS-9 premise debts AFFIRMED-open per the waiver-composition meta-clause; old R17 revived research-scoped; old R6b recorded as a deliberate cut. Replacement of the live constitutions awaits owner confirmation.

## Contradictions

- questions `vault/constitution/domainspec-subagents-strategy-constitution.md` — the v0.5.0 proposal intends to replace the live v0.3.0; not yet merged, so the live rules remain authoritative while the proposal disputes their machinery (R25–R28, validator, two-gate lifecycle).
- questions `vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md` — the proposal supersedes the v0.4.0 draft's waves/3-axis/DAG model rather than extending it (groups + fixed execution shape replace it).

## Files touched

- subagents-strategy-constitution-proposal.md
- vault/constitution/domainspec-subagents-strategy-constitution.md
- vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md
- vault/snapshots/meta-dispatches/2026-05-16-subagent-strategy-parametrization-wave5/spec.yaml

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `subagents-strategy-constitution-proposal.md` | `creates` | This session produced the v0.5.0-proposal draft as a new file. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `contradicts` | The v0.5.0 proposal disputes the live v0.3.0 constitution's machinery (R25–R28, validator, two-gate lifecycle); not yet merged, so the live rules remain authoritative. |
| `vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md` | `contradicts` | The v0.5.0 proposal supersedes the v0.4.0 draft's waves/3-axis/DAG model; groups + fixed execution shape replace it rather than extend it. |
| `vault/snapshots/meta-dispatches/2026-05-16-subagent-strategy-parametrization-wave5/spec.yaml` | `consumes` | Read as prior parametrization context; no new claims derived onto it. |
