---
tags: [agents, dispatch, constitution, skill]
node_type: constitution
is_session: true
layer: architecture
nature: procedural, technical
status: active
created: 2026-06-18
timestamp: 2026-06-18T13:31:06-03:00
expires: 2026-08-17
conversation_id: 2026-06-18-1331-research-skill-five-role-split
decisions_made: true
contradictions_found: false
specs_updated: [internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "The synthesizer-role split is a schema-level governance amendment propagated across appender, register-dispatch, and the test battery — a load-bearing permanent change to the agent pipeline."
---

# Research skill portability rewrite + synthesizer/writer five-role split

## Summary

Critiqued `research/SKILL.md` for poor cross-repo portability and rewrote it to reference only sibling skills (no constitution §-numbers, vault paths, or telemetry paths) and to model the research pipeline as five distinct roles — splitting `synthesizer` (reconciles, mid-pipeline) from `writer` (persists `research.md`/`findings.md` via the writing skills), giving the spine `explorers → synthesizer → reviewers → writer → auditor` with a structural auditor→writer revision edge. The new `synthesizer` role was propagated via subagents into the appender's `AGENT_ROLES` enum (previously rejected with exit 2), the `register-dispatch` SKILL, and the test battery (now 83 green). Recorded as constitution amendment §13 with a document `version` bump 0.6.1→0.6.2; the wire `schema_version` stays 0.6.0 because adding an enum value is not a structural row-schema change. Left open: whether anti-bias design should get its own owner skill vs. fold into `check-tension`, plus a sweep of the router's remaining non-skill pointers.

## Files touched

- internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md
- internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md

## Connections

> Forward-only by source (`is_session: true`, `vault/ontology-conventions.md` §8): no inverse rows on targets. Curator agent unavailable in this environment — block authored directly per `.claude/skills/custom/edge-catalog.md`.

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md` | `modifies` | Rewrote for portability (sibling-skill pointers only) and the five-role pipeline; synthesizer split from writer; writer receives the two writing skills. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` | `modifies` | Added `synthesizer` to the agent-role vocabulary, the close-row tally keys, and the worked example. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | Added `synthesizer` to `AGENT_ROLES` (was rejected exit 2); wire `schema_version` unchanged at 0.6.0. |
| `internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs` | `modifies` | +2 cases: `synthesizer` accepted (exit 0) and enumerated in the reject message. 83/83 green. |
| `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` | `modifies` | §13 amendment + doc `version` 0.6.1→0.6.2; synthesizer/writer split across §2/§3/§5/§6 and P6/P9/P12. |
| `internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Updated governing-doc version pointer to v0.6.2-proposal / §13; wire schema note clarified. |
---
