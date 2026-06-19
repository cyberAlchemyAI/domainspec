---
tags: [vault, agents, ontology]
node_type: constitution
is_session: true
layer: [ontology, architecture]
nature: [procedural, reference]
status: active
created: 2026-06-18
timestamp: 2026-06-18T16:14:35-03:00
expires: 2026-08-17
conversation_id: 57963733-cef0-4584-add8-fab7efdf6620
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Produced the reusable creation interface for all future skills and wired it into the harness permanently via a global hook."
---

# create-skill skill + global authoring hook

## Summary

Built `create-skill`, a guided skill for authoring/evolving invocable skills. Established that a
skill's load-bearing property is its routing `description` (the model selects on it alone, never
the body) and distilled a quality rubric ("The bar": discoverable / coherent-scope / dense /
imperative-right-altitude-failure-aware), converging the SKILL.md through a 3-lens adversarial
review plus two reviewer rounds. Promoted `create-skill` to a global user-level skill and added a
global non-blocking `PreToolUse` hook (`remind-create-skill.cjs`) that reminds the agent to author
any `SKILL.md` through it (verified firing, 7/7 matching tests); repo-local and global copies were
made byte-identical.

## Files touched

- .claude/skills/create-skill/SKILL.md
- ~/.claude/skills/create-skill/SKILL.md (global, outside-repo)
- ~/.claude/hooks/remind-create-skill.cjs (global, outside-repo)
- ~/.claude/settings.json (global, outside-repo)

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/create-skill/SKILL.md` | `creates` | This session authored the create-skill SKILL.md as a NEW file — the guided skill-authoring interface built here. |
