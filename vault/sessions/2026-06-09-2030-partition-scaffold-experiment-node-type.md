---
tags: [partition, scaffold, ontology, experiment, code-ontology, close-session]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: technical, procedural
status: active
created: 2026-06-09
timestamp: 2026-06-09T20:30:00-03:00
expires: 2026-08-08
conversation_id: 2026-06-09-partition-scaffold-experiment-node-type
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Ratifies a new node_type into the closed vocabulary via governed amendment, builds the partition-scaffold skill that embodies the partition discovery (R-1..R-10), and reconciles the framework's own L1 ontology counts to 25/29 — load-bearing for every future project scaffold."
---

# Partition-Scaffold Skill, `experiment` Node Type, and Ontology Reconciliation

## Summary

The session ratified `experiment` into the controlled `node_type` vocabulary (frontmatter.py +ExperimentFrontmatter, 16→17 types, ontology-conventions v2.3.0→2.4.0, governed amendment, 25 tests green) and built the `partition-scaffold` skill that embodies the partition discovery: an idempotent tree scaffolder (manifest + scaffold.py), the experiments machinery ported from knowledge-taxonomy, a self-contained code-ontology bundle (25 meta-types / 29 edges / 4 families + validate_ontology.py + extraction gate), and framework-populated `knowledge/` partitions. The partition discovery was evolved to Revision 2026-06-09 (decisions R-1..R-10) and the framework's own L1 ontology counts were reconciled from the paper's stale 24/26 to 25/29 across l1-extractor (.claude + .codex), audit_richness.py, README/docs/ADLC/GOVERNANCE/foundational-knowledges. A sibling consumer repo `goldenquill` was scaffolded with the same machinery (not tracked here).

## Next Steps

- Commit the ~30 uncommitted entries in 4 thematic chunks — C1 experiment node_type (ontology-conventions.md + frontmatter.py + test_frontmatter.py + amendment + partition discovery); C2 ontology count sweep (l1-extractor .claude+.codex + audit_richness.py + README/docs/ADLC/GOVERNANCE/foundational-knowledges + RELATIONSHIPS); C3 partition-scaffold skill (`.claude/skills/partition-scaffold/**` + `scripts/validate_ontology_extractions.py`); C4 close-session + subagent-dispatch/pipeline discoveries. Do NOT stage `.claude/current_conversations/`, `.claude/scheduled_tasks.lock`, `.claude/skills/predict/`.
- Run `internal_tools` frontmatter tests green before committing C1.
- Decide CI gate posture (partition OQ-6) — resolving artifact is a `.github/workflows/*.yml`, absent today.
- Hand `goldenquill` its own session node + the symlink→submodule portability fix (lives in `/Users/victorboscaro/goldenquill`, not here).
- Add a template equality-test asserting `code-ontology.json` counts == TAXONOMY/RELATIONSHIPS counts.
- Re-run `npx gitnexus analyze` after the commits land.

## Open Questions

- CI gate posture (partition OQ-6) — answered by a `.github/workflows/*.yml`.
- close-session-redesign deployment timing (its OQ-6).
- convicção-bet-ledger opt-in default.
- partition OQ-2 — where the knowledge↔implementation seam is cut.
- Validator layering — promote `validate_ontology.py` to `internal_tools/vault_common` or keep it skill-bundle-local?
- The `internal_tools` recursion "too big" bound is undefined (partition R-1 residual).
- `experiment` node_type has ZERO instances — write the first real experiment by when, or revisit?

## Files touched

- vault/ontology-conventions.md
- vault/amendments/2026-06-09-add-experiment-node-type.md
- internal_tools/vault_common/frontmatter.py
- internal_tools/tests/test_frontmatter.py
- scripts/validate_ontology_extractions.py
- vault/discovery/system-modeling-partition-architecture/discovery.md
- .claude/skills/partition-scaffold/
- .claude/skills/close-session/SKILL.md
- .codex/agents/domainspec-l1-extractor.agent.toml
- scripts/audit_richness.py

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/ontology-conventions.md` | `modifies` | Added the `experiment` node_type; bumped to v2.4.0. |
| `vault/amendments/2026-06-09-add-experiment-node-type.md` | `creates` | Governed amendment ratifying the `experiment` vocabulary value. |
| `vault/discovery/system-modeling-partition-architecture/discovery.md` | `modifies` | Revision 2026-06-09, decisions R-1..R-10. |
| `internal_tools/vault_common/frontmatter.py` | `modifies` | Added `ExperimentFrontmatter`; `KNOWN_NODE_TYPES` 16→17. |
| `internal_tools/tests/test_frontmatter.py` | `modifies` | Count assertions + parametrized dispatch now cover `experiment`. |
| `scripts/validate_ontology_extractions.py` | `creates` | Unwired ontology-extraction signature gate. |
| `scripts/audit_richness.py` | `modifies` | +3 cross-feature edge signatures; dropped phantom types; +`Saga`. |
| `.claude/skills/partition-scaffold/` | `creates` | The scaffold skill that operationalizes the partition discovery. |
| `.claude/skills/close-session/SKILL.md` | `modifies` | Added `## Next Steps` + `## Open Questions`; body cap 30→40. |
| `.codex/agents/domainspec-l1-extractor.agent.toml` | `modifies` | L1-ontology count sweep 24/26→25/29. |

> Forward-only by source (`is_session: true`, per `vault/ontology-conventions.md` §8): no inverse rows are written on the targets above.
