---
tags: [vault, agents]
node_type: discovery
is_session: true
layer: ontology
nature: procedural, explanatory
status: active
created: 2026-05-03
timestamp: 2026-05-03T02:16:52-03:00
expires: 2026-07-02
conversation_id: close-session-edges-bootstrap-2026-05-03
decisions_made: true
contradictions_found: true
specs_updated: [.claude/skills/close-session/SKILL.md]
promoted_candidates: []
expected_importance: 5
importance_rationale: "Delegates Connections-block authoring to vault-metadata-curator, fixing orphaned session nodes, but changes only one skill file and defers hook enforcement."
---

# Close-Session — Delegate Edge Bootstrapping to vault-metadata-curator

## Summary

Evolved the close-session skill to delegate `## Connections` block authoring to the existing vault-metadata-curator agent rather than duplicating the edge catalog inside the skill. Diagnosis: existing session nodes carry frontmatter and prose Contradictions but no Connections block, so sessions sit orphaned from the bidirectional graph. Edits added a new Step 4 that invokes vault-metadata-curator in `bootstrap` mode with a per-file edge-intent brief, removed `edges.md` from the Step 2 classifier's loaded skills (classifier no longer picks edges), fixed the stale `docs/vault/conversations/` path to `vault/sessions/`, and exempted the Connections block from the 30-line body cap. Hooks-based enforcement deferred.

## Contradictions

- modifies `.claude/skills/close-session/SKILL.md` — prior version had the classifier loading `edges.md` (now removed) and referenced the stale path `docs/vault/conversations/` (corrected to `vault/sessions/`); existing session nodes carry no Connections block, a structural gap the old skill implicitly permitted.

## Files touched

- .claude/skills/close-session/SKILL.md

## Connections

<!--
  No edge rows written.

  Intended forward edge: `modifies` -> `.claude/skills/close-session/SKILL.md`
  Refused by vault-metadata-curator (bootstrap mode, 2026-05-03).

  Rationale: skill files under `.claude/skills/` are not vault documents and
  carry no `node_type`. The edge catalog (vault/ontology-conventions.md
  Appendix C) requires both endpoints to be vault documents with a node_type.
  Wiring a `modifies` edge into a skill file would create an inverse
  (`modified-by`) row on a file that has no `## Connections` block contract
  and no governing schema.

  This is OQ-1 of `vault/discovery/documents-metadata-enforcement/`.
  Resolution paths (decide upstream, not in this session):
    (a) leave the session edge-orphaned (current state),
    (b) resolve OQ-1 by giving skill files a node_type,
    (c) special-case skill targets in the edge catalog.

  Per `edges.md`: "If a relationship does not fit any catalog edge, do not
  invent one — propose it through a discovery in `vault/discovery/`."
-->

| Document | Type | Description |
|----------|------|-------------|
| `vault/sessions/2026-05-03-0240-edge-catalog-skill-and-routing.md` | `continued-by` | The follow-up session continued this investigation: it created the `edge-catalog.md` skill and rerouted close-session + vault-metadata-curator off `vault/ontology-conventions.md`, completing the skill-extraction work this session began. |
