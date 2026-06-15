---
tags: [agents, dispatch, constitution, audit]
node_type: audit
is_session: true
layer: architecture
nature: procedural, technical
status: active
created: 2026-06-15
timestamp: 2026-06-15T15:54:55-03:00
expires: 2026-08-14
conversation_id: 2026-06-15-1554-constitution-v060-consistency-fix
decisions_made: true
contradictions_found: true
specs_updated: [internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Promoted the subagents-dispatch constitution to v0.6.0 by removing the root-cause group-role field and fixing a critical enforcement contradiction, atomically across all five surfaces with the test battery green."
---

# Constitution v0.6.0 — internal-consistency review and structural fix

## Summary

A `review`-type subagent dispatch (3 attackers robot_talks → synthesizer → 2 verifiers zig-zag) audited `subagents-strategy-constitution-proposal.md` for internal consistency, confirming 1 CRITICAL + 2 MAJOR + 5 MINOR inconsistencies (4 candidate findings refuted in verification). The owner then directed a full structural fix landing **v0.6.0**: the group-level `role` field was removed entirely (root cause of the CR-2 contradiction — function is now read from agents' roles and the tally keys by agent role), CR-1's appender-enforcement claim was corrected to match the code, the dangling "(D6)" label and five minor drifts were fixed, and the repo-root constitution copy was deleted to consolidate the law to a single location (§10.3). The change landed atomically across constitution + appender (wire schema 0.5.2 → 0.6.0) + tests (81/81 green) + type-skills + register-dispatch SKILL / README / LEDGER-MODEL, with all deployed/source twin pairs verified byte-identical.

## Contradictions

- The review found internal contradictions in the (non-vault) constitution `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md`; all were resolved this session — no vault node was validated or contradicted.

## Files touched

- internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs
- .claude/skills/domainspec-subagents-strategy/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md
- .claude/skills/review/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/review/SKILL.md
- .claude/skills/research/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md
- .claude/skills/experiment/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/experiment/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md
- internal_tools/subagents-dispatch-hooks/README.md
- internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md
- telemetry/agents/subagents-dispatch.yaml
- research/subagents-strategy/2026-06-15-constitution-v053-consistency-review/findings.md
- research/subagents-strategy/2026-06-15-constitution-v053-consistency-review/attacks.md
- research/subagents-strategy/2026-06-15-constitution-v053-consistency-review/anti-bias-preregistration.md

## Connections

> Forward-only by source (`is_session: true`, `vault/ontology-conventions.md` §8): no inverse rows on targets. Curator agent unavailable in this environment — block authored directly per `.claude/skills/custom/edge-catalog.md`.

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` | `modifies` | Landed v0.6.0: removed group `role` (CR-2), fixed CR-1 enforcement, §10.3 single-located law, §11 amendment; now the sole canonical copy (repo-root copy deleted). |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | Removed group-role validation/keys, bumped wire schema 0.5.2 → 0.6.0, FORECAST → RESERVED note. |
| `internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs` | `modifies` | Updated battery to v0.6.0 (no group role; agent-role tally); added group-`role`-now-rejected regression. 81/81 green. |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Repointed governing-doc to internal_tools path; v0.6.0; degrouped P12 approver wording. |
| `internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Same as its deployed twin (kept byte-identical). |
| `.claude/skills/review/SKILL.md` | `modifies` | Repointed constitution path; degrouped canonical-shape and approver language. |
| `internal_tools/subagents-dispatch-hooks/skills/review/SKILL.md` | `modifies` | Same as its deployed twin. |
| `.claude/skills/research/SKILL.md` | `modifies` | Repointed path; dropped group-role column; v0.6.0. |
| `internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md` | `modifies` | Same as its deployed twin. |
| `.claude/skills/experiment/SKILL.md` | `modifies` | Repointed path; degrouped role-set; v0.6.0. |
| `internal_tools/subagents-dispatch-hooks/skills/experiment/SKILL.md` | `modifies` | Same as its deployed twin. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` | `modifies` | Schema tables to v0.6.0: deleted group `role` row, agent-role tally, examples, RESERVED wording. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | Single-canonical-location note; v0.6.0; schema 0.6.0. |
| `internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md` | `modifies` | Repointed constitution path; v0.6.0; degrouped tree diagram. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Appended the review dispatch row + close row (resolved). |
| `research/subagents-strategy/2026-06-15-constitution-v053-consistency-review/findings.md` | `creates` | Cited change-requests from the consistency review. |
| `research/subagents-strategy/2026-06-15-constitution-v053-consistency-review/attacks.md` | `creates` | Verbatim attacker + verifier returns. |
| `research/subagents-strategy/2026-06-15-constitution-v053-consistency-review/anti-bias-preregistration.md` | `creates` | Frozen P5 tension pre-registration for the review dispatch. |
---
