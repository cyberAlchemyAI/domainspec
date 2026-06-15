---
tags: [agents, vault]
node_type: constitution
is_session: true
layer: ontology
nature: procedural
status: active
created: 2026-06-15
timestamp: 2026-06-15T17:07:28-03:00
expires: 2026-08-14
conversation_id: 2026-06-15-1707-research-owned-not-a-kill
decisions_made: true
contradictions_found: false
specs_updated: [.claude/skills/research/SKILL.md, internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md]
promoted_candidates: []
expected_importance: 7
importance_rationale: "Reframes the epistemic stance of every future research dispatch — precedent becomes ownership attribution, not a kill — a load-bearing change to how findings are classified, though it governs the tooling layer, not the object theory."
---

# Research dispatch — owned is not a kill

## Summary

Acting on the owner's correction that finding prior art is **not** a kill — "research is not to find what is new, it is to find what exists and can be used" — the `research` dispatch type-skill was reframed so its precedent gate *attributes ownership* instead of terminating a finding. The skeptic gate `precedent-kill` was renamed `precedent` (now never emits a terminal KILL); the verdict matrix gained an `owner` label column and a `use-mode` column (`build-from-owned` / `already-deployed` / `novel-attempt`); terminal KILL was reserved for `no-witness` / `tautological` only; and a "Purpose (read first)" statement was added orienting research toward find-what-exists-and-can-be-used. A two-reviewer pass (run in the sibling lean repo) confirmed the change did not gut Trigger-2 precedent protection, then caught and demoted an inflation slip ("expected/primary frequency" → a normative statement). Both twin copies of the research SKILL were edited identically.

## Files touched

- .claude/skills/research/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md

## Connections

> Forward-only by source (`is_session: true`, `vault/ontology-conventions.md` §8): no inverse rows on targets. Curator agent unavailable in this environment (session driven from the sibling lean repo) — block authored directly per `.claude/skills/custom/edge-catalog.md`.

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/research/SKILL.md` | `modifies` | Renamed gate `precedent-kill` → `precedent` (never KILLs); added `owner` + `use-mode` columns; reserved KILL for no-witness/tautological; added Purpose statement; demoted frequency-inflation to normative. |
| `internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md` | `modifies` | Same edits as its deployed `.claude` twin (kept consistent). |
