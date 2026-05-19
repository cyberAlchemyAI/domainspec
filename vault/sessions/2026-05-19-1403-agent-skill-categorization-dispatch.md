---
tags: [agents, vault, ontology, architecture, application]
node_type: discovery
is_session: true
layer: [ontology, architecture]
nature: explanatory
status: active
created: 2026-05-19
timestamp: 2026-05-19T14:03:30-03:00
expires: 2026-07-18
conversation_id: agent-skill-categorization-2026-05-19
decisions_made: false
contradictions_found: false
specs_updated: []
promoted_candidates:
  - vault/discovery/agent-skill-categorization/README.md
  - docs/features/agent-skill-categorization/discovery/README.md
expected_importance: 7
importance_rationale: "First structured exploration of a faceted categorization scheme for a 159-entry corpus that affects runtime routing fidelity; no decision locked, keeping it pre-constitutive."
---

# Agent/Skill Categorization Dispatch

## Summary

The session investigated whether to introduce explicit categorization for the ~159-entry agent/skill corpus under `.claude/`. A full `domainspec-subagents-strategy` lifecycle (5 parallel L1 lenses — external literature, weights-only taxonomy, repo as-is, decision-framing, adversarial null — plus parent synthesis) produced research and findings artifacts; the dispatch was promoted to two discovery nodes (knowledge scope in vault, application scope in docs/features) at user request. Recommendation surfaced: faceted scheme preserving prefix and adding `role` (for today's runtime mis-routing) and later `tool-surface` (gated on tool-list tightening); no rollout decision was locked. One R15 working-folder violation was caught mid-flight and corrected (vault→docs/features), logged as a spec amendment.

## Files touched

- vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml
- internal_tools/vault_telemetry/events/subagent-strategy.jsonl
- docs/features/agent-skill-categorization/research/domainspec-subagents-research.md
- docs/features/agent-skill-categorization/research/domainspec-subagents-findings.md
- vault/discovery/agent-skill-categorization/README.md
- docs/features/agent-skill-categorization/discovery/README.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml` | `creates` | Session produced the dispatch spec YAML as a new artifact. |
| `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` | `modifies` | Session appended a new telemetry event row to the strategy event log. |
| `docs/features/agent-skill-categorization/research/domainspec-subagents-research.md` | `creates` | Session produced the L1 lens research file as a new artifact. |
| `docs/features/agent-skill-categorization/research/domainspec-subagents-findings.md` | `creates` | Session produced the synthesis findings file as a new artifact. |
| `vault/discovery/agent-skill-categorization/README.md` | `creates` | Session produced the knowledge-scope discovery node as a new artifact. |
| `docs/features/agent-skill-categorization/discovery/README.md` | `creates` | Session produced the application-scope discovery node as a new artifact. |
