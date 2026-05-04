---
tags: [vault, agents, ontology, pipeline]
node_type: discussion
is_session: true
layer: ontology, architecture
nature: explanatory, procedural
status: active
created: 2026-05-03
timestamp: 2026-05-03T00:30:00-03:00
expires: 2026-07-02
conversation_id: curator-pipeline-wiring-2026-05-02
decisions_made: true
contradictions_found: true
specs_updated: [vault/ontology-conventions.md, .claude/skills/custom/subagents-research-writing.md, vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md]
promoted_candidates: [vault/discovery/curator-pipeline-integration/discovery.md]
expected_importance: 7
importance_rationale: "Decides curator/edges wiring direction (Option B wrapper), nullifies Option A as framed, queues an agent-naming refactor, and propagates a constitution-level schema change (session_ref removal) across 17+ vault files."
---

# Curator-Pipeline Wiring Research and `session_ref` Cleanup

## Summary

Investigated three options (A bootstrap-on-write / B promote-to-skill / C CI gate) for wiring `vault-metadata-curator` and the edges skill into the DomainSpec orchestrator via a parallel subagents-strategy dispatch (3 sonnet children + sequential research-writer / findings-writer). Findings produced a vault discovery (`vault/discovery/curator-pipeline-integration/`) showing Option A is null as framed (zero `domainspec-*` skills write to `vault/**`), Option B is mechanically cheap (~3 orchestrator diffs + 1 thin SKILL.md wrapper), Option C is blocked on missing headless Claude Code invocation, and OQ-1 is partial-sidestep with 3 user-authored cross-boundary edges to `.claude/skills/`. Removed `session_ref` field from 17 vault frontmatter files plus `ontology-conventions.md` schema and prose and `subagents-research-writing.md` guidance. Decided to rename agents to `domainspec-` prefix (with `domainspec-vault-` subprefix for vault tooling); proposer/validator subagent dispatch is queued pending user go-ahead.

## Contradictions

- contradicts vault/ontology-conventions.md (pre-session schema) — `session_ref` row + explanatory paragraph removed; field also stripped from 17 vault frontmatter files.

## Files touched

- vault/discovery/curator-pipeline-integration/discovery.md (created)
- vault/discovery/curator-pipeline-integration/README.md (created)
- vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md (added inverse `cited-by` edge; `session_ref` removed)
- vault/ontology-conventions.md (`session_ref` schema row + explanatory paragraph removed)
- .claude/skills/custom/subagents-research-writing.md (`session_ref` guidance removed)
- .planning/research/curator-pipeline-wiring/research/subagents-research.md (created)
- .planning/research/curator-pipeline-wiring/research/subagents-findings.md (created)
- vault/discovery/**/*.md — `session_ref` frontmatter line removed in 16 additional files (sed pass)
