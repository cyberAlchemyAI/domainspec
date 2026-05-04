---
tags: [vault, agents, pipeline, ontology]
node_type: implementation-plan
is_session: true
layer: architecture
nature: procedural, technical
status: active
created: 2026-05-03
timestamp: 2026-05-03T03:26:28-03:00
expires: 2026-07-02
conversation_id: 2026-05-03-0326-claude-harness-curator-and-interviewer-wiring
decisions_made: true
contradictions_found: false
specs_updated: [vault/discovery/curator-pipeline-integration/discovery.md]
promoted_candidates: []
expected_importance: 6
importance_rationale: "Reconciled vault-governance agents and skills into the Claude Code harness and resolved the parked OQ-D in the curator-pipeline-integration discovery, making both the harness and the recommendation discipline operational."
---

# Claude harness — curator and interviewer wiring

## Summary

Reconciled the vault-governance agent and skill set into Claude Code. Confirmed the `subagents-strategy → domainspec-strategy` rename, copied 8 missing skills and 3 missing agents (`domainspec-interviewer`, `domainspec-orchestrator`, `mars-researcher`) from `.github/` into `.claude/`, and adapted them by rewriting VS Code tool blocks to Claude Code names, fixing `.github/skills/...` → `.claude/skills/...` paths, and replacing `AskQuestions` → `AskUserQuestion`. Created the missing `docs/signals/pipeline-signals.jsonl` the `mars-researcher` agent depends on. Resolved OQ-D in the curator-pipeline-integration discovery with an "Initial recommendation" block — trigger sets for `domainspec-strategy` and the curator's three modes — framed explicitly as discipline (single-agent reasoning, unverified heuristics) rather than measurement.

## Contradictions

- closes-question on [`vault/discovery/curator-pipeline-integration/discovery.md`](../discovery/curator-pipeline-integration/discovery.md) — OQ-D resolved with an Initial recommendation block; charter "no wiring decision is committed" preserved. Version bumped 0.1.0 → 0.2.0.

## Files touched

- vault/discovery/curator-pipeline-integration/discovery.md
- .claude/agents/domainspec-interviewer.agent.md
- .claude/agents/domainspec-orchestrator.agent.md
- .claude/agents/mars-researcher.agent.md
- .claude/skills/domainspec-brownfield-translation/SKILL.md
- .claude/skills/domainspec-decision-gate/SKILL.md
- .claude/skills/domainspec-definitions-governance/SKILL.md
- .claude/skills/domainspec-interview-scope/SKILL.md
- .claude/skills/domainspec-orchestrate/SKILL.md
- .claude/skills/domainspec-readiness-gate/SKILL.md
- .claude/skills/domainspec-start/SKILL.md
- .claude/skills/domainspec-task-session/SKILL.md
- docs/signals/pipeline-signals.jsonl

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/curator-pipeline-integration/discovery.md` | `closes-question` | Resolves OQ-D by adding an "Initial recommendation" block with trigger sets for `domainspec-strategy` and the curator's three modes; the discovery's "no wiring decision is committed" charter is preserved. |
