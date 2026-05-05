---
tags: [vault, agents, ontology]
node_type: discovery
is_session: true
layer: ontology
nature: procedural, explanatory
status: active
created: 2026-05-02
timestamp: 2026-05-02T23:30:00-03:00
expires: 2026-07-01
conversation_id: writing-skills-subagents-research-and-findings-2026-05-02-2330
decisions_made: true
contradictions_found: true
specs_updated:
  - .claude/skills/custom/subagents-research-writing.md
  - .claude/skills/custom/subagents-findings-writing.md
  - .claude/skills/custom/discovery-writing.md
promoted_candidates: []
expected_importance: 7
importance_rationale: "Adds two new writing skills bound to the subagents-strategy constitution and patches discovery-writing.md to reference edges.md, materially expanding the vault's agent-author skill layer."
---

# Writing Skills — Subagents Research and Findings

## Summary

Added two writing-skill counterparts to `discovery-writing.md`: `subagents-research-writing.md` and `subagents-findings-writing.md`. Skipped `subagents-strategy` per user — strategy is validated in chat, not via a skill. Also patched `discovery-writing.md` to reference `edges.md`, closing a gap where it had only pointed at `frontmatter.md`. The user then heavily revised `subagents-research-writing.md` to bind it directly to `subagents-strategy-constitution.md` (R3, R5, R15, R17, R18, R23) — one file per dispatch with verbatim per-child `## Agent N` sections, written by a `subagents-research-writer` agent rather than the children themselves.

## Contradictions

- `contradicts` `vault/sessions/2026-05-02-2300-frontmatter-skill-schema-rewrite.md` — that session stripped structural rules from the frontmatter skill; this session works around the gap by baking structure into each new writing skill rather than restoring it to `frontmatter.md`. Underlying conflict still unresolved.

## Files touched

- .claude/skills/custom/subagents-research-writing.md
- .claude/skills/custom/subagents-findings-writing.md
- .claude/skills/custom/discovery-writing.md
