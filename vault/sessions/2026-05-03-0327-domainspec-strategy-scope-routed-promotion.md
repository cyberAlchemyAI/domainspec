---
tags: [vault, agents, ontology]
node_type: audit
is_session: true
layer: ontology
nature: explanatory
status: active
created: 2026-05-03
timestamp: 2026-05-03T03:27:20-03:00
expires: 2026-07-02
conversation_id: domainspec-strategy-scope-routed-promotion-2026-05-03-0327
decisions_made: true
contradictions_found: true
specs_updated: [vault/constitution/domainspec-strategy-constitution.md, .claude/skills/domainspec-strategy/SKILL.md, .claude/agents/domainspec-discovery-writer.agent.md, .claude/skills/custom/domainspec-findings-writing.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Closed a structural contradiction in the agent-protocol stack by amending the constitution to v0.1.5, making every future discovery-dispatch route load-bearing on the scope classification it established."
---

# Domainspec-Strategy Scope-Routed Discovery Promotion

## Summary

Reviewed the prior session's identified divergence (the domainspec-strategy stack hardcoded `vault/discovery/` as the only discovery sink, conflicting with R15's "vault is for codified discipline" when the dispatch is application-level). Ran the domainspec-strategy lifecycle (3 parallel children → research-writer → findings-writer) under `.planning/subagents-strategy-regime-split/`, producing research.md + findings.md. The user declined to promote a discovery node and rejected the proposed `regime` frontmatter axis, opting instead to lean on existing labels (`scope` / `layer` / `tags`) and let the path encode the operational choice. Landed the narrow 4-file edit (constitution v0.1.5, SKILL.md, discovery-writer agent, findings-writing skill) so discovery promotion now routes by scope: knowledge → `vault/discovery/<topic>-definitions/<slug>.md`, application → `docs/features/<feature>/discovery/<slug>.md`. A verification subagent re-greped the surface and confirmed no misses or stray `regime:` frontmatter fields.

## Contradictions

- validates `vault/sessions/2026-05-03-0140-subagents-strategy-discovery-target-divergence.md` — implements the regime resolution it called for (R3 step 7, R5, R15, R24 all rewritten), with the user-driven simplification of dropping the proposed `regime` frontmatter field in favor of existing labels and path-encoding.
- closes-question on the design problem that session opened: whether discovery always routes to `vault/discovery/` — answer is now formally knowledge-scope → vault, application-scope → `docs/features/<feature>/discovery/`.

## Files touched

- .claude/agents/domainspec-discovery-writer.agent.md
- .claude/skills/domainspec-strategy/SKILL.md
- vault/constitution/domainspec-strategy-constitution.md
- .claude/skills/custom/domainspec-findings-writing.md
- .planning/subagents-strategy-regime-split/research/subagents-research.md
- .planning/subagents-strategy-regime-split/research/subagents-findings.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/agents/domainspec-discovery-writer.agent.md` | `modifies` | Edited the description, role, required-inputs, execution step 2, and output sections to support the scope-routed promotion. |
| `.claude/skills/domainspec-strategy/SKILL.md` | `modifies` | Edited step 1 working-folder language and step 7 user-gate prompt for scope classification. |
| `vault/constitution/domainspec-strategy-constitution.md` | `modifies` | Edited R3 step 7, R5, R15 (rewritten), R24 table row, and added Version History v0.1.5 entry. |
| `.claude/skills/custom/domainspec-findings-writing.md` | `modifies` | Edited the line 99 promotion-suggestion to offer both knowledge and application scopes. |
| `.planning/subagents-strategy-regime-split/research/subagents-research.md` | `creates` | New file produced by domainspec-research-writer this session. |
| `.planning/subagents-strategy-regime-split/research/subagents-findings.md` | `creates` | New file produced by domainspec-findings-writer this session. |
