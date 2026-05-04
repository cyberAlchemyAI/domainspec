---
tags: [vault, ontology, agents, pipeline]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory, reference
status: active
created: 2026-05-03
timestamp: 2026-05-03T02:55:17-03:00
expires: 2026-07-02
conversation_id: oq1-closed-linter-backlog-2026-05-03
decisions_made: true
contradictions_found: true
specs_updated: [vault/discovery/documents-metadata-enforcement/backlog.md, vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md, vault/sessions/2026-05-03-0240-edge-catalog-skill-and-routing.md]
promoted_candidates: [vault/discovery/documents-metadata-enforcement/backlog.md]
expected_importance: 6
importance_rationale: "Closes a load-bearing open question that was blocking the edge-catalog enforcement model, and folds the deferred linter work into a backlog so the discovery stops accumulating implementation-shaped open questions."
---

# OQ-1 Closed (No Edges on Skill/Agent Files) + Linter Backlog Spun Off

## Summary

Resolved the open OQ-1 in `vault/discovery/documents-metadata-enforcement/` by user directive: skill files (`.claude/skills/**`) and agent files (`.claude/agents/**`) are not legal vault edge endpoints and will not be given a `node_type`. Cross-surface references to them stay as prose; the trade-off (rules whose canonical statement lives in a skill have no vault edge to point at) is locked in. Folded the deferred linter implementation work into a new backlog file inside the same discovery — linter (HIGH), OQ-2 manifest format (MEDIUM), OQ-3 rollout strategy + deadline (MEDIUM), OQ-4 inverse-edge cleanup (LOW), with OQ-1 logged ✅ DONE — so the discovery stops carrying implementation-shaped open questions. Updated the prior session's `## Connections` HTML-comment trace to reflect the closure rather than enumerate three resolution paths, and persisted the decision as durable agent feedback so it is not re-litigated.

## Contradictions

- closes-question `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` — OQ-1 (skill/agent files as edge endpoints) resolved by user directive in favor of reading (a). §7 annotated CLOSED with the resolution stated up front; original framing preserved below for traceability.

## Files touched

- vault/discovery/documents-metadata-enforcement/backlog.md
- vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md
- vault/sessions/2026-05-03-0240-edge-catalog-skill-and-routing.md

## Connections

<!--
  No edge to `vault/discovery/documents-metadata-enforcement/backlog.md`.
  Backlog files carry frontmatter only per user directive (2026-05-03);
  authorship is recorded in this session's `Files touched` list and
  `promoted_candidates` frontmatter, not as a graph edge.
-->

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` | `closes-question` | This session resolved OQ-1 (skill/agent files as edge endpoints) recorded in §7 of that discovery. |
| `vault/sessions/2026-05-03-0240-edge-catalog-skill-and-routing.md` | `modifies` | This session edited the prior session's `## Connections` block and `promoted_candidates` frontmatter to record OQ-1's closure; it did not wholesale replace it. |
| `vault/sessions/2026-05-03-0301-no-edges-on-backlog-files.md` | `continued-by` | The 0301 session continues this investigation arc; it resolved the `NEEDS_HUMAN` flag this session raised about duplicate `created-by` rows on the new backlog file by locking the no-edges-on-backlog-files stance. |
