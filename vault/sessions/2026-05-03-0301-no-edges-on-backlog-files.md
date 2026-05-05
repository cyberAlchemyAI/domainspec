---
tags: [vault, agents, ontology, edge-catalog]
node_type: spec
is_session: true
layer: ontology
nature: procedural
status: active
created: 2026-05-03
timestamp: 2026-05-03T03:01:43-03:00
expires: 2026-07-02
conversation_id: no-edges-on-backlog-files-2026-05-03
decisions_made: true
contradictions_found: true
specs_updated: [vault/discovery/documents-metadata-enforcement/backlog.md, vault/sessions/2026-05-03-0255-oq1-closed-linter-backlog.md, vault/sessions/2026-05-03-0240-edge-catalog-skill-and-routing.md]
promoted_candidates: []
expected_importance: 5
importance_rationale: "Locks a durable operational rule (backlog files carry no edges) and propagates it across three vault files — load-bearing for curator correctness but narrow in scope."
---

# No Edges on Backlog Files (Operational Stance)

## Summary

Resolved the `NEEDS_HUMAN` flag from the close of `2026-05-03-0255-oq1-closed-linter-backlog.md` — the curator had wired duplicate `created-by` rows on the new backlog file because the prior 0240 session had also been (incorrectly) edged to it. By user directive, the resolution generalized: backlog files (`node_type: backlog`) carry frontmatter only — no `## Connections` block, no inbound or outbound edges — at least for now, even though the catalog formally permits `session → any` edges to land on them. Persisted the stance as durable agent feedback (`feedback_no_edges_on_backlog_files.md`), stripped the `## Connections` block from the backlog, removed the `creates → backlog.md` rows from both the 0240 and 0255 session files, and left HTML-comment notes on each touched file so the absence is legible as intentional rather than as oversight.

## Contradictions

(Prose only — neither item below is wired as a catalog edge. The first targets a backlog, which is now edge-free per the very stance this session locks; the second is a discipline-on-top-of-rule, not a true contradiction with the catalog.)

- The prior working assumption that session→backlog edges were valid (and the catalog's formal permission for them) is overridden by user directive: backlog files (`node_type: backlog`) carry frontmatter only. Recorded against `vault/discovery/documents-metadata-enforcement/backlog.md` as context for why its `## Connections` block was stripped.
- `vault/ontology-conventions.md` Appendix C still permits `session → any` (including backlog) — the applied stance narrows that without revising the catalog. A live discipline gap, not a catalog contradiction. The metadata-enforcement linter (tracked in the backlog) is the surface where this gap will eventually be reconciled.

## Files touched

- vault/discovery/documents-metadata-enforcement/backlog.md
- vault/sessions/2026-05-03-0255-oq1-closed-linter-backlog.md
- vault/sessions/2026-05-03-0240-edge-catalog-skill-and-routing.md

## Connections

<!--
  No edge to `vault/discovery/documents-metadata-enforcement/backlog.md`.
  Backlog files (`node_type: backlog`) carry frontmatter only per user
  directive (2026-05-03) — no `## Connections` block, no inbound or
  outbound edges. This session is the directive that codifies that rule,
  so it must respect it. The relationship to the backlog is prose only
  (see `Files touched` and the Contradictions section).
-->

| Document | Type | Description |
|----------|------|-------------|
| `vault/sessions/2026-05-03-0255-oq1-closed-linter-backlog.md` | `continues-from` | Same investigation across two sittings, minutes apart; this session resolved the `NEEDS_HUMAN` flag the curator raised at the close of 0255 (duplicate `created-by` rows on the new backlog file). |
| `vault/sessions/2026-05-03-0240-edge-catalog-skill-and-routing.md` | `modifies` | This session edited 0240's `## Connections` block to remove the `creates → backlog.md` row, conforming the prior session to the no-edges-on-backlog-files rule. |
