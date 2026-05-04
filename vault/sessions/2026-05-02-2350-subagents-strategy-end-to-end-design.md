---
tags: [vault, agents, ontology, architecture]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: procedural, technical
status: active
created: 2026-05-02
timestamp: 2026-05-02T23:50:00-03:00
expires: 2026-07-01
conversation_id: subagents-strategy-end-to-end-2026-05-02
decisions_made: true
contradictions_found: true
specs_updated: [vault/premise/subagents-strategy-premises.md, vault/discovery/subagents-strategy-definitions/subagents-strategy.md, vault/constitution/subagents-strategy-constitution.md, vault/ontology-conventions.md]
promoted_candidates: [vault/constitution/subagents-strategy-constitution.md, .claude/skills/subagents-strategy/SKILL.md, .claude/agents/subagents-research-writer.agent.md, .claude/agents/subagents-findings-writer.agent.md, .claude/agents/subagents-discovery-writer.agent.md]
expected_importance: 9
importance_rationale: "Authored the subagents-strategy constitution end-to-end and operationalized it with skill + writer subagents — primary origin event for a new governance tier."
---

# Subagents-Strategy End-to-End Design (Premises → Constitution → Skill → Agents)

## Summary

Built the subagents-strategy discipline end-to-end: revised premises through v0.4.0 (recursion budget defaults of depth-2/breadth-5/total-10, two-file artifact set replacing the prior three-file set, dropped the speculative mechanical/synthesis/judgment tier vocabulary in favor of strategist-proposed model selection that the user validates in chat). Authored the constitution from scratch through v0.1.4 (24 rules across triggers/lifecycle/coordination/briefing/budgets/artifacts/modes/grading/governance, including R23 Context+Goal preamble and R24 making the strategist a skill-role with three writer subagents in `.claude/agents/`). Operationalized by creating the subagents-strategy skill plus three writer agents (research-writer, findings-writer, discovery-writer). Reconciled custom skills via two parallel single-agent dispatches that rewrote `subagents-research-writing.md` to the one-file-per-dispatch model and removed `session_ref` from frontmatter conventions; also removed `veracidade`/`convicção` from the `discovery` node_type in `ontology-conventions.md` (existing discoveries grandfathered).

## Contradictions

- validates vault/premise/subagents-strategy-premises.md — premises survived multi-round revision (v0.2.2 → v0.4.0) and graduated, not refuted.
- contradicts vault/discovery/subagents-strategy-definitions/subagents-strategy.md (D-7, D-9, D-10) — prior rule shapes for lifecycle, artifact set, and node_type admission reversed.
- contradicts vault/premise/subagents-strategy-premises.md P-SS-2 (pre-v0.4.0) — tier vocabulary stripped, replaced with per-dispatch user-validated model selection.
- contradicts vault/ontology-conventions.md (pre-session) — veracidade/convicção applicability narrowed by removing discovery; existing discoveries grandfathered.

## Files touched

- vault/premise/subagents-strategy-premises.md
- vault/discovery/subagents-strategy-definitions/subagents-strategy.md
- vault/constitution/subagents-strategy-constitution.md
- vault/templates/subagents-research.md
- vault/templates/subagents-findings.md
- vault/ontology-conventions.md
- .claude/skills/subagents-strategy/SKILL.md
- .claude/agents/subagents-research-writer.agent.md
- .claude/agents/subagents-findings-writer.agent.md
- .claude/agents/subagents-discovery-writer.agent.md
- .claude/skills/custom/subagents-research-writing.md
- .claude/skills/custom/subagents-findings-writing.md
- .claude/skills/custom/frontmatter.md
- .claude/skills/custom/frontmatter-semantics.md
