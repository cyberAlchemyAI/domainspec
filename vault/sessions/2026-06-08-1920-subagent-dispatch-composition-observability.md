---
tags: [vault, agents, architecture, ontology, dispatch, pipeline]
node_type: discovery
is_session: true
layer: architecture, ontology
nature: technical, explanatory
status: active
created: 2026-06-08
timestamp: 2026-06-08T19:20:11-03:00
expires: 2026-08-07
conversation_id: 2026-06-08-subagent-dispatch-composition-observability
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Resolves two load-bearing design questions (dispatch composition model + 3-level telemetry) and produces two discovery docs that will gate a future governed amendment to the subagents constitution."
---

# Subagent Dispatch — Composition Model & Observability

## Summary

The session designed how the framework will use subagents across task types plus one governed place to monitor dispatches. It established that `intent` lives per-wave (not per-dispatch) — so a dispatch is a composable pipeline of waves — collapsed the per-agent `role` into the wave's intent, kept `lane`, fixed the only loop to the review loop, and routed everything through one governed parent (`subagents-strategy`) gated by a per-runtime hook. The design was captured in two sibling discoveries — `subagent-dispatch-observability` (3-level telemetry) and `subagent-pipeline-composition` (composition model) — each written and adversarially reviewed by subagent waves. No canonical files were changed (only discoveries + bidirectional edges), pending a future amendment plan; one decision (briefing verbatim vs params+sha) remains open.

## Contradictions

- refines `vault/discovery/subagents-strategy-refinement/role-taxonomy.md` — per-agent `role` collapses into wave-level `intent`; the 4+1 per-agent granularity is superseded-in-part (re-openable for mixed-function waves).
- questions `vault/discovery/subagent-dispatch-observability/discovery.md` — the composition discovery prescribes params+sha briefing storage vs the observability discovery's verbatim; conflict open, no `contradicts` edge issued yet.

## Files touched

- vault/discovery/subagent-dispatch-observability/discovery.md
- vault/discovery/subagent-pipeline-composition/discovery.md
- vault/discovery/subagents-topologies/discovery.md
- vault/discovery/subagents-strategy-refinement/principle.md
- vault/discovery/subagents-strategy-refinement/role-taxonomy.md
- vault/discovery/anti-bias-vector-composition/principle.md
- vault/constitution/domainspec-subagents-strategy-constitution.md
