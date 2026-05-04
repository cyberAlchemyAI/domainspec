---
tags: [vault, agents, ontology]
node_type: discovery
is_session: true
layer: ontology
nature: procedural, reference
status: active
created: 2026-05-03
timestamp: 2026-05-03T02:40:19-03:00
expires: 2026-07-02
conversation_id: edge-catalog-skill-and-routing-2026-05-03
decisions_made: true
contradictions_found: false
specs_updated: [.claude/skills/custom/edge-catalog.md, .claude/skills/close-session/SKILL.md, .claude/agents/vault-metadata-curator.agent.md, .claude/skills/custom/subagents-research-writing.md, .claude/skills/custom/subagents-findings-writing.md]
promoted_candidates: [vault/discovery/documents-metadata-enforcement/backlog.md]
expected_importance: 5
importance_rationale: "Continuation of the prior session's edge-skill groundwork — completes the skill extraction and routes leakage points, but is a refinement pass rather than a new strategic direction."
---

# Edge-Catalog Skill Creation + Ontology-Conventions Routing Cleanup

## Summary

Continued the close-session redesign by stripping rule-source reads of `vault/ontology-conventions.md` from the agent flow. Created `.claude/skills/custom/edge-catalog.md` (verbatim lift of Appendix C — legality matrix, deprecated edges, authoring rules) and rerouted three references in close-session SKILL and the vault-metadata-curator agent away from the constitution to the new skill. Also fixed two ancillary leakage points in subagents-research-writing.md and subagents-findings-writing.md by redirecting them to frontmatter-semantics.md (dropped the "challenge-response rules" half since no skill codifies it). The execution used task-fan-out mode with two parallel children and skipped the lifecycle's research/findings/discovery steps — surfacing that the subagents-strategy lifecycle is investigation-shaped and doesn't fit mechanical-execution dispatches.

## Files touched

- .claude/skills/custom/edge-catalog.md
- .claude/skills/close-session/SKILL.md
- .claude/agents/vault-metadata-curator.agent.md
- .claude/skills/custom/subagents-research-writing.md
- .claude/skills/custom/subagents-findings-writing.md

## Connections

<!--
  OQ-1 status: CLOSED. Skill files (`.claude/skills/**`) and agent files
  (`.claude/agents/**`) are not legal vault edge endpoints and will not be
  given a `node_type`. Cross-surface references to them stay as prose. See
  `vault/discovery/documents-metadata-enforcement/backlog.md` (Completed /
  Done) for the resolution and the `feedback_no_edges_on_non_vault_files.md`
  agent memory.

  Five forward edges produced by this session targeted skill/agent files and
  are therefore (correctly) not graph rows. Kept here as a prose audit trail
  of what the session did, not as edges:
    - created `.claude/skills/custom/edge-catalog.md` (new skill file)
    - modified `.claude/skills/close-session/SKILL.md` (header + Step 4
      rerouted to edge-catalog.md)
    - modified `.claude/agents/vault-metadata-curator.agent.md` (canonical-
      skills block: ontology-conventions entry replaced with edge-catalog)
    - modified `.claude/skills/custom/subagents-research-writing.md`
      (navigation footer redirected to frontmatter-semantics.md)
    - modified `.claude/skills/custom/subagents-findings-writing.md`
      (navigation footer redirected to frontmatter-semantics.md)
-->

| Document | Type | Description |
|----------|------|-------------|
| `vault/sessions/2026-05-03-0216-close-session-edges-bootstrap.md` | `continues-from` | Same investigation across two sittings; this session completed the skill-extraction work that the prior session began (rerouting close-session and the curator agent away from `vault/ontology-conventions.md` and onto the new `edge-catalog.md` skill). |
| `vault/sessions/2026-05-03-0255-oq1-closed-linter-backlog.md` | `modified-by` | The 0255 session edited this session's `## Connections` block and `promoted_candidates` frontmatter to record OQ-1's closure. |
| `vault/sessions/2026-05-03-0301-no-edges-on-backlog-files.md` | `modified-by` | The 0301 session edited this session's `## Connections` block to remove the `creates → backlog.md` row, conforming this session to the no-edges-on-backlog-files rule. |

<!--
  No edge to `vault/discovery/documents-metadata-enforcement/backlog.md`.
  Backlog files carry frontmatter only per user directive (2026-05-03).
  The 0255 session authored the backlog; the relationship between this
  session and the backlog (which surfaced the deferred items) is recorded
  in prose only.
-->
