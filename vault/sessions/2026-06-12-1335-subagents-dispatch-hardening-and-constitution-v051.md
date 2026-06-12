---
tags: [agents, dispatch, vault, infrastructure]
node_type: audit
is_session: true
layer: ontology
nature: procedural, technical
status: active
created: 2026-06-12
timestamp: 2026-06-12T13:35:34-03:00
expires: 2026-08-11
conversation_id: subagents-dispatch-hardening-and-constitution-v051
decisions_made: true
contradictions_found: true
specs_updated: [subagents-strategy-constitution-proposal.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Produced a verified v0.5.1 subagent-dispatch constitution via adversarial review plus mechanical append-only enforcement — a foundational governance checkpoint downstream skills and tooling must track."
---

# Subagents-dispatch hardening + constitution v0.5.1

## Summary

The session first hardened the subagent-dispatch governance tooling: it migrated the dispatch ledger from repo root to `telemetry/agents/subagents-dispatch.yaml`, made it mechanically append-only via a new `enforce-append-only-dispatch.cjs` PreToolUse hook — whose four real holes (comment-escape, MultiEdit gap, weak path-normalization, false-positive read denials) were surfaced by an adversarial reviewer subagent and fixed (10/10 deny, 9/9 pass) — and ported the 217-name agent pool into `telemetry/agents/agent-pool.yaml`. It then ran a meta fan-out (3 corpus-tensioned explorers → opus synthesizer → 2 robot-talks skeptics over a zig-zag) to review the v0.5.0 constitution, producing cited research.md + findings.md; the reviewers cut two re-inflation amendments (token cap, success_metric un-cut) for not discharging the P-SS-8 premise debt. After owner decisions, the constitution was rewritten to v0.5.1 — drop `status`, no close event, explicit `parent_dispatch_id` fill-rule, persisted groups/connections/working_folder, mandatory per-agent `token_budget`, closed `exit_reason` vocabulary, plus consistency fixes — and verified by an auditor subagent (16 PASS / 1 FIXED). The appender and the `domainspec-subagents-strategy` skill still lag the new v0.5.1 and are the outstanding follow-ups.

## Contradictions

- contradicts `.claude/skills/domainspec-subagents-strategy/SKILL.md` — still operationalizes the v0.3.0 machinery (validator block, vault/snapshots spec files, JSONL telemetry, recursion_budget); orphaned by v0.5.1 and needs realignment.
- contradicts `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` — still emits the flat schema with `status` and no groups/connections/token_budget; lags the v0.5.1 schema until an appender wave runs.

## Files touched

- subagents-strategy-constitution-proposal.md
- telemetry/agents/subagents-dispatch.yaml
- telemetry/agents/agent-pool.yaml
- internal_tools/subagents-dispatch-hooks/hooks/enforce-append-only-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md
- internal_tools/subagents-dispatch-hooks/README.md
- internal_tools/subagents-dispatch-hooks/hooks/remind-register-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/install.cjs
- research/subagents-strategy/2026-06-12-constitution-self-improvement/research.md
- research/subagents-strategy/2026-06-12-constitution-self-improvement/findings.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `subagents-strategy-constitution-proposal.md` | `modifies` | Rewrote the constitution proposal to v0.5.1 (drop `status`, no close event, explicit `parent_dispatch_id` fill-rule, persisted groups/connections/working_folder, mandatory per-agent `token_budget`, closed `exit_reason` vocabulary). |
| `telemetry/agents/subagents-dispatch.yaml` | `creates` | Relocated the dispatch ledger here from repo root and appended this session's dispatch rows. |
| `telemetry/agents/agent-pool.yaml` | `creates` | Ported the 217-name agent pool into this file this session. |
| `internal_tools/subagents-dispatch-hooks/hooks/enforce-append-only-dispatch.cjs` | `creates` | New PreToolUse hook making the dispatch ledger mechanically append-only (10/10 deny, 9/9 pass after the adversarial-review fixes). |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | Edited the appender during the hardening pass. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` | `modifies` | Updated the register-dispatch skill prompt for the relocated, append-only ledger. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | Updated tooling README for the new ledger location and enforcement hook. |
| `internal_tools/subagents-dispatch-hooks/hooks/remind-register-dispatch.cjs` | `modifies` | Updated the reminder hook to point at the relocated ledger path. |
| `internal_tools/subagents-dispatch-hooks/install.cjs` | `modifies` | Updated the installer to wire the new enforce-append-only hook. |
| `research/subagents-strategy/2026-06-12-constitution-self-improvement/research.md` | `creates` | Produced the cited research from the meta fan-out (3 explorers → opus synthesizer → 2 robot-talks skeptics). |
| `research/subagents-strategy/2026-06-12-constitution-self-improvement/findings.md` | `creates` | Produced the synthesized findings that cut the two re-inflation amendments for not discharging the P-SS-8 premise debt. |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `contradicts` | The skill still operationalizes v0.3.0 machinery (validator block, vault/snapshots spec files, JSONL telemetry, recursion_budget); orphaned by v0.5.1 and needs realignment. |
