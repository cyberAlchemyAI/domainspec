---
tags: [vault, agents, ontology]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory
status: active
created: 2026-05-03
timestamp: 2026-05-03T01:40:34-03:00
expires: 2026-07-02
conversation_id: subagents-strategy-discovery-target-divergence-2026-05-03-0140
decisions_made: true
contradictions_found: true
specs_updated: [.claude/agents/vault-metadata-curator.agent.md]
promoted_candidates: []
expected_importance: 7
importance_rationale: "Surfaces a structural contradiction in the subagents-strategy stack (vault-only hardcoding vs two-regime design) and hardens the curator repair mode with a regression-halt guarantee — both are load-bearing for future discovery-target routing."
---

# Subagents-Strategy Discovery-Target Divergence and Curator Repair Self-Check

## Summary

Reviewed the prior session's vault-metadata-curator agent and edges.md skill edits, then surfaced that the entire subagents-strategy stack hardcodes `vault/discovery/` as the only legal discovery target — directly conflicting with R15's "vault is reserved for codified discipline" logic when the dispatch is application-level. Hardened curator `repair` mode with a mandatory post-edit self-check that halts on regression and writes a `-REGRESSION.md` instead of the clean report (Mode 3 steps 3–6). Designed (not yet wired) a two-regime resolution — `knowledge` regime targets vault, `application` regime targets near-spec (e.g. `docs/features/<feature>/discovery/<slug>.md`) — with a mandatory `regime: knowledge | application` frontmatter so both labels (chosen + alternative) are explicit on every discovery. Closed at strategy proposal step 1 of the subagents-strategy lifecycle, awaiting user fan-out confirmation; no constitution/skill/agent edits for the divergence have landed yet.

## Contradictions

- contradicts `vault/constitution/subagents-strategy-constitution.md` — R3 step 7, R5, R6b, R15, R24 all hardcode `vault/discovery/` as the only legal discovery target; session design introduces a two-regime model.
- contradicts `.claude/skills/subagents-strategy/SKILL.md` — lines 82 and 86 hardcode vault-only discovery target, contradicted by the knowledge/application regime split.
- contradicts `.claude/agents/subagents-discovery-writer.agent.md` — lines 22, 32, 53 hard-refuse non-vault paths, contradicted by the application-regime design.
- questions `vault/discovery/documents-metadata-enforcement/` — OQ-1 (skills as legal edge endpoints) remains unresolved and is still load-bearing for the curator's posture.

## Files touched

- .claude/agents/vault-metadata-curator.agent.md

## Connections

| Document | Type | Description |
|----------|------|-------------|

