---
tags: [vault, ontology, agents]
node_type: discovery
is_session: true
layer: ontology
nature: reference, technical
status: active
created: 2026-05-02
timestamp: 2026-05-02T23:33:21-03:00
expires: 2026-07-01
conversation_id: edges-skill-review-and-metadata-curator-agent-2026-05-02-2333
decisions_made: true
contradictions_found: true
specs_updated: [.claude/skills/custom/edges.md, .claude/agents/vault-metadata-curator.agent.md]
promoted_candidates: [vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md]
expected_importance: 7
importance_rationale: "Tightened two load-bearing edges (`creates` vs `modifies`, examined `derives-from` overload), reframed Section 8 bidirectionality from rule to discipline, and produced an enforcer agent — directly affecting vault correctness going forward."
---

# Edges Skill Review and Metadata Curator Agent

## Summary

Reviewed the `edges.md` cheatsheet skill and surfaced seven concerns. User dispatched four parallel subagents that produced: a new discovery on `documents-metadata-enforcement` capturing the rule-vs-discipline gap in bidirectionality enforcement; an investigation concluding `derives-from` should stay collapsed for now (neutral with caveats, with concrete harm examples); two edits to `edges.md` (complete Example 1 target-side blocks; tighten `creates` to new-files-only and `modifies` to all edits-of-existing-files). The fourth subagent stopped because `vault/ontology-conventions.md` has no `## Connections` block to extend — open decision deferred until OQ-1 (skill files as legal endpoints) lands. Closed by designing and writing a new `vault-metadata-curator` agent with three modes (bootstrap, audit, repair) that loads the edges and frontmatter skills at runtime as its sole source of truth, never duplicating rules into its prompt.

## Contradictions

- **contradicts** `vault/discovery/vault-edges/research/findings.md:107-110` — uses deprecated `references` edge instead of canonical `derives-from`, violating the current catalog.
- **contradicts** `vault/constitution/subagents-strategy-constitution.md:380` — uses `derives-from` where `codified-as` was mandated by the epistemic chain.
- **contradicts** `vault/discovery/vault-foundations/epistemic-chain.md:428-429` — uses deprecated `provenance-for` edge, superseded by `creates`.
- **questions** `vault/ontology-conventions.md` Section 8 — bidirectionality mandate reframed from "rule" to "discipline" because no enforcer existed at time of authoring; status not restored until the curator agent runs.

## Files touched

- vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md
- vault/discovery/documents-metadata-enforcement/README.md
- vault/discovery/vault-edges/research/derives-from-overload-investigation.md
- .claude/skills/custom/edges.md
- .claude/agents/vault-metadata-curator.agent.md
