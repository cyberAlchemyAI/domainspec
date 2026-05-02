---
tags: [agents, architecture, vault, ontology]
node_type: discovery
is_session: true
layer: architecture, ontology
nature: explanatory
status: active
created: 2026-05-02
timestamp: 2026-05-02T16:46:00-03:00
expires: 2026-07-01
conversation_id: agents-strategy-discovery-2026-05-02
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Established the canonical agents-strategy framing and corrected the codified-as / operationalized-by schema split that governs how all future agent constitutions and skills connect in the vault."
---

# Agents-Strategy — Schema Chain and Dispatch Governance

## Summary

The session aimed to decide whether the project should codify subagent-dispatch governance now and, if so, where it lives. We introduced **agents-strategy** as the umbrella orchestration concept (with robot-talks reframed as one `mode-of` rather than a sibling), settled the schema chain **axiom → premise → constitution → skill** with the explicit correction that constitutions codify while skills implement, and chose **one-tier-below-parent** as the default model-selection rule with declared token budgets per tier. The session produced `vault/premise/agent-dispatch-premises.md` (10 premises P-AD-1..P-AD-10) and `vault/discovery/agents-strategy.md` (rewritten once to match the `discovery-writing` skill structure); the constitution, skill, and naming alignment (rename premise to `agents-strategy-premises.md`) are deferred to a later session.

## Contradictions

- questions `vault/premise/robot-talks-premises.md` — line 26 broken path (`specs/ontology/possible_constitutions/...` does not exist); line 202 should split `operationalized-by` into `codified-as` (constitution) + `operationalized-by` (the `.claude/skills/robot-talks/` skill).
- validates `vault/premise/system-premises.md` — P-SYS-3 and P-SYS-7 referenced as ground; held without contradiction.
- derives-from `.claude/skills/custom/discovery-writing.md` — discovery rewritten to conform to its mandated structure.
- questions `.claude/skills/custom/frontmatter.md` — proposes adding `strategy` as a new `node_type` value to the enumeration.

## Files touched

- vault/premise/agent-dispatch-premises.md
- vault/discovery/agents-strategy.md
