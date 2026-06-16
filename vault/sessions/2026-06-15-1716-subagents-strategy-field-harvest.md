---
tags: [agents, vault, ontology]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory
status: active
created: 2026-06-15
timestamp: 2026-06-15T17:16:19-03:00
expires: 2026-08-14
conversation_id: 2026-06-15-1716-subagents-strategy-field-harvest
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Produced two concrete transferable-feature candidates for the generic playbook plus a FREEZE-by-absence decision, closing the migrate/freeze/stop loop on internal dispatch governance."
---

# Subagents-strategy: field-usage harvest and migration decision

## Summary

Diagnosed why the subagents-strategy isn't shipping: the workshop repo refines the governance in
isolation by reviewing itself, while the only real consumer — the sibling Lean repo (61 real daily
dispatches) — runs an older version and is the true proving ground. The owner reframed the goal from
"migrate/test the new version onto the field" to "harvest transferable lessons from real field usage
into the generic playbook." Two meta dispatches were run under the strategy's own governance: an
experiment-design dispatch (red-team showed it structurally moot — the field's ~96%-resolved ledger
yields no defect target, routing to FREEZE-by-absence; closed `loop_ceiling_reached`), and a
field-usage harvest (an independent precedent check shrank a 14-candidate overhaul to two genuine
features — a liveness/relaunch-recovery invariant and wiring the parent's bias to a logged prior —
plus naming wins, because the generic playbook proved already lean where assumed bloated; closed
`resolved`). Net decision: do not migrate the field; the field's real gift is two features plus a
verify-before-building discipline.

## Files touched

- research/subagents-strategy/2026-06-15-experiment-design-meta/research.md
- research/subagents-strategy/2026-06-15-experiment-design-meta/findings.md
- research/subagents-strategy/2026-06-15-field-usage-harvest/research.md
- research/subagents-strategy/2026-06-15-field-usage-harvest/findings.md
- telemetry/agents/subagents-dispatch.yaml

## Connections

> Forward-only by source (`is_session: true`) per `vault/ontology-conventions.md` §8 — no inverse row is written on any target. Curator agent unavailable in this environment — block authored directly per `.claude/skills/custom/edge-catalog.md`.

| Document | Type | Description |
|----------|------|-------------|
| `research/subagents-strategy/2026-06-15-experiment-design-meta/research.md` | `creates` | Collected explorer returns for the experiment-design meta dispatch. |
| `research/subagents-strategy/2026-06-15-experiment-design-meta/findings.md` | `creates` | Experiment design + the FREEZE-by-absence structural finding; closed `loop_ceiling_reached`. |
| `research/subagents-strategy/2026-06-15-field-usage-harvest/research.md` | `creates` | Collected miner returns (appreciative / friction / ruleset-diff) over real field usage. |
| `research/subagents-strategy/2026-06-15-field-usage-harvest/findings.md` | `creates` | Pruned harvest — two transferable features + naming wins; closed `resolved`. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Appended 2 dispatch rows + 2 close rows for the two meta dispatches run this session. |
