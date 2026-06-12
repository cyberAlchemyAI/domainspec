---
tags: [agents, infrastructure, vault, architecture]
node_type: audit
is_session: true
layer: architecture
nature: technical
status: active
created: 2026-06-12
timestamp: 2026-06-12T14:13:47-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-subagents-dispatch-ledger-audit-and-fixes
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Two live defects fixed in load-bearing dispatch-governance tooling (installer registration drift, no appender self-check) and the ledger rebuilt clean — high operational impact, scoped to internal tooling."
---

# Subagents-Dispatch Ledger Audit and Fixes

## Summary

Started as a parseability check of `telemetry/agents/subagents-dispatch.yaml` and became a full audit of the dispatch-logging stack: the ledger mixed three row shapes, hooks guarantee non-corruption but not logging completeness, and the v0.5.0 constitution schema (groups/agents/connections JSON columns) exists only on paper. A 3-critic adversarial dispatch rejected two of five proposed fixes (pre-commit validator vacuous; spawn-log sidecar lacks a join key and pre-decides constitution Principle 3) and found two live defects. Implemented the survivors: `install.cjs` replace-semantics + event-generalized registrations (healing a MultiEdit matcher drift) and a structural self-check in `append-dispatch.cjs` (10/10 test battery). The old ledger was deleted (user-authorized) and recreated clean; the README was rewritten to the readme-pattern by a fixer+reviewer dispatch.

## Open / Next steps

- Schema migration deferred by user decision: define v0.5.0 fields/allowed values (groups/connections JSON columns, status/exit_reason enums), then update the appender whitelist.
- Constitution text still says rows are updated at close; tooling (and the closed self-improvement dispatch's E1) says append-only `close_of` events — land the amendment in the constitution doc; check `vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md` for the same stale language.
- `internal_tools/subagents-dispatch-hooks/` is entirely untracked in git (no history); decide commit, and decide commit-vs-gitignore for `telemetry/`.
- Erased ledger rows not re-registered (user delete vs auditor's governance obligation) — pending user decision, notably the closed `2026-06-12-constitution-self-improvement` row.
- Spawn-log sidecar deferred: if revived, needs a `dispatch_id` join key, JSONL format, repo-gating, and the Principle-3 "authored vs measurement surface" ruling recorded.
- Restart Claude Code sessions to pick up the corrected hook registration.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `telemetry/agents/subagents-dispatch.yaml` | `creates` | Old ledger deleted (user-authorized) and this session recreated it clean via the sanctioned appender, so the file on disk is new output of this session. |
| `internal_tools/subagents-dispatch-hooks/install.cjs` | `modifies` | Rewrote installer with replace-semantics and event-generalized hook registrations, healing the MultiEdit matcher drift defect. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | Added a structural self-check to the sanctioned appender, validated by the 10/10 test battery. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` | `modifies` | Updated the register-dispatch skill text to match the audited appender behavior. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | README rewritten to the readme-pattern by the fixer+reviewer dispatch during this session. |
