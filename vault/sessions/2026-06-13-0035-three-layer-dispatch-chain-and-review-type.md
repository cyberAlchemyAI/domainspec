---
tags: [agents, dispatch, constitution, architecture]
node_type: discovery
is_session: true
layer: architecture
nature: procedural, technical
status: active
created: 2026-06-13
timestamp: 2026-06-13T00:35:50-03:00
expires: 2026-08-12
conversation_id: three-layer-dispatch-chain-and-review-type
decisions_made: true
contradictions_found: true
specs_updated: [subagents-strategy-constitution-proposal.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Established the three-layer single-owner dispatch-governance skill chain, ported the tooling to constitution v0.5.2, populated `review` as a second LIVE dispatch_type, and resolved four MAJOR red-team findings — load-bearing for every future subagent dispatch."
---

# Three-layer dispatch skill chain + the `review` LIVE type

## Summary

After reviewing the day's closed sessions, the session ported the strategy skill and the `register-dispatch` appender to subagents-strategy constitution v0.5.2 (groups/connections schema, two-append append-only ledger, new `invoked_by` provenance field). It then split dispatch governance into a three-layer single-owner skill chain — router (`domainspec-subagents-strategy`) → type skill → form skill (`register-dispatch`) — creating the `research` type skill, and populated `review` as a second LIVE `dispatch_type` (a red-team skill that attacks existing artifacts). A governed red-team review (dispatch `2026-06-12-three-skill-redteam-review`, 9 agents, 2 zig-zag rounds, exit `resolved`) of the three skills found no CRITICAL and four MAJOR change requests, mostly on the freshly-written review skill. After a tensioned evaluation of next steps, the four MAJOR fixes were applied alongside a constitution P14 scope-broadening (collapse-detection now covers any robot-talks group feeding a synthesizer) and the `invoked_by` §5 recognition, verified SHIP (7/7) by an adversarial reviewer.

## Contradictions

The red-team found internal/cross-skill inconsistencies in the three dispatch skills (stale P4 phrasing, exit_reason gaps, a P14 law-minting risk), all **resolved this session** by the applied fixes. Targets are `.claude` skills + `internal_tools` + the repo-root constitution proposal — none are vault nodes, so no `contradicts` edge is written; the files carry `modifies` intent.

## Files touched

- .claude/skills/domainspec-subagents-strategy/SKILL.md
- .claude/skills/research/SKILL.md
- .claude/skills/review/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/README.md
- subagents-strategy-constitution-proposal.md
- telemetry/agents/subagents-dispatch.yaml
- research/subagents-strategy/2026-06-12-three-skill-redteam-review/findings.md
- research/subagents-strategy/2026-06-12-three-skill-redteam-review/attacks.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Rewrote as the lean router (layer 1): triggers, human gate, universal invariants, dispatch_type routing table (research + review LIVE). |
| `.claude/skills/research/SKILL.md` | `creates` | New research type skill (layer 2) — research-type judgment on the v0.5.2 chassis; later patched for the early-stop P12 fix. |
| `.claude/skills/review/SKILL.md` | `creates` | New review type skill (layer 2) — red-team judgment; second LIVE dispatch_type; carried 3 of the 4 MAJOR red-team fixes. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` | `modifies` | Migrated the form skill (layer 3) to the v0.5.2 record schema, invoked_by, review LIVE, single-owner description. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | v0.5.2 schema validation/emission, invoked_by git fallback, LIVE_TYPES including review. |
| `internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs` | `modifies` | v0.5.2 test battery (78/78 green). |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | Synced schema-stale sections to v0.5.2. |
| `subagents-strategy-constitution-proposal.md` | `modifies` | review LIVE in §5, working_folder required for review, P14 scope broadened, invoked_by §5 recognition + §9 landed. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Appended dispatch + close rows (port, split, red-team review). |
| `research/subagents-strategy/2026-06-12-three-skill-redteam-review/findings.md` | `creates` | Red-team verdict: no CRITICAL, four MAJOR change requests, per-artifact verdicts. |
| `research/subagents-strategy/2026-06-12-three-skill-redteam-review/attacks.md` | `creates` | Collected attacker + verifier returns from the red-team dispatch. |

<!-- Session edges are forward-only by source (vault/ontology-conventions.md §8): no inverse rows
written on targets. All targets are .claude/skills/**, internal_tools/**, a repo-root constitution
proposal, telemetry/**, and research/** — operational/non-vault paths, legal-by-design forward-only. -->
