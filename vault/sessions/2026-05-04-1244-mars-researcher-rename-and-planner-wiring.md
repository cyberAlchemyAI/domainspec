---
tags: [agents, vault, pipeline]
node_type: audit
is_session: true
layer: ontology
nature: procedural, technical
status: active
created: 2026-05-04
timestamp: 2026-05-04T12:44:00-03:00
expires: 2026-07-03
conversation_id: mars-researcher-rename-2026-05-04
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 4
importance_rationale: "Removes a structural inconsistency in the `.claude/` agent harness (duplicate researcher identity) and closes a planner wiring gap, but scope is limited to harness config files that are not vault graph nodes."
---

# mars-researcher Rename and Planner Wiring

## Summary

Investigated the project's 43 agents at the user's request and surfaced that `domainspec-researcher` and `mars-researcher` were byte-identical duplicates — `mars-researcher` was already canonical in `copilot/` and `.github/` harness profiles while `domainspec-researcher` was a `.claude/`-only alias kept in lockstep. Decided to converge on `mars-researcher` everywhere in `.claude/`, swapping six references across five callers and deleting the duplicate agent file. Also wired `mars-researcher` into `domainspec-planner.agent.md`, which previously had no researcher subagent declared in `.claude/` despite its `copilot/` twin already declaring one. Flagged broader `.claude/`-vs-`copilot/` planner divergence (richer step-2 discovery scoring and a UI detection gate exist only in copilot) for a separate decision.

## Files touched

- .claude/agents/domainspec-researcher.agent.md (deleted)
- .claude/agents/domainspec-spec-writer.agent.md
- .claude/agents/domainspec-ui-architect.agent.md
- .claude/agents/domainspec-story-sync.agent.md
- .claude/agents/domainspec-planner.agent.md
- .claude/skills/domainspec-pipeline/SKILL.md
- .claude/skills/domainspec-pilot-readiness/SKILL.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/agents/domainspec-spec-writer.agent.md` | `modifies` | Swapped two `domainspec-researcher` references to `mars-researcher` in this caller's agent declaration. |
| `.claude/agents/domainspec-ui-architect.agent.md` | `modifies` | Swapped one `domainspec-researcher` reference to `mars-researcher` in this caller's agent declaration. |
| `.claude/agents/domainspec-story-sync.agent.md` | `modifies` | Swapped one `domainspec-researcher` reference to `mars-researcher` in this caller's agent declaration. |
| `.claude/agents/domainspec-planner.agent.md` | `modifies` | Added `agents:` frontmatter declaring `mars-researcher` plus the alignment/layering auditors and added the corresponding execution-step-2 body line, closing the previously missing planner researcher wiring. |
| `.claude/skills/domainspec-pipeline/SKILL.md` | `modifies` | Swapped one `domainspec-researcher` reference to `mars-researcher` to keep the pipeline orchestrator aligned with the renamed canonical researcher. |
| `.claude/skills/domainspec-pilot-readiness/SKILL.md` | `modifies` | Swapped one `domainspec-researcher` reference to `mars-researcher` to keep the pilot-readiness flow aligned with the renamed canonical researcher. |
