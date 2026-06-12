---
tags: [agents, dispatch, constitution, audit]
node_type: audit
is_session: true
layer: ontology
nature: procedural, technical
status: active
created: 2026-06-12
timestamp: 2026-06-12T14:13:30-03:00
expires: 2026-08-11
conversation_id: constitution-v052-adversarial-assessment
decisions_made: true
contradictions_found: true
specs_updated: [subagents-strategy-constitution-proposal.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Resolved two CRITICAL defects (one literal self-contradiction) in the dispatch-governance constitution via a governed 7-agent adversarial dispatch, decided all five open tensions, and amended the constitution to v0.5.2 — every future dispatch runs under these rules."
---

# Constitution v0.5.2 — adversarial assessment + amendment wave

## Summary

A governed 7-agent dispatch (`2026-06-12-constitution-v051-adversarial-assessment`: 4 pairwise-tensioned explorers → opus synthesizer ↔ 2 reviewers in zig-zag; registered and closed in the ledger) audited the v0.5.1 constitution: 2 CRITICAL / 14 MAJOR / 11 MINOR confirmed, 4 findings refuted in review — full record in `research/subagents-strategy/2026-06-12-constitution-v051-assessment/`. The owner decided all five open tensions (T1 close row restored; T2 success_metric stays cut, zero-inconsistency reviewer turn = zig-zag convergence; T3 self-approval prohibited — approver is parent or a dedicated meta-evaluate agent; T4 pool kept, facts fixed to 245 names / role_fit list; T5 edge + meta machinery kept and tightened). The constitution was amended in place to v0.5.2-proposal with 14 further assessment fixes and a §8 changelog citing the findings doc.

## Open questions / next steps

1. **Port `.claude/skills/domainspec-subagents-strategy/SKILL.md` to v0.5.2** — still runs v0.3.0 machinery; the #1 follow-up (carried from the 1335 session, now two versions behind).
2. **Appender wave** — `close_of` is now constitutional (T1), but the dispatch-row schema still lacks `groups[]`, `connections[]`, `schema_version`, `final_approver`, `working_folder`, per-agent `initial_prompt`/`token_budget`.
3. **P-SS-8 aggregate-cost debt stays OPEN** — helper spawn count unregulated; `token_budget` is a declared target with no enforcement actuator (owner chose not to reopen `recursion_budget`).
4. **Discovery promotion not yet decided** — the T1 decision and the assessment findings are promotion candidates (knowledge scope, `vault/discovery/`).

## Contradictions

- contradicts `.claude/skills/domainspec-subagents-strategy/SKILL.md` — still operationalizes v0.3.0 (spec files, JSONL telemetry, validator block, recursion_budget); now lags v0.5.2.
- contradicts `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` — close_of path is now legal, but the dispatch-row schema it emits still lacks the v0.5.2 fields.

## Files touched

- subagents-strategy-constitution-proposal.md
- research/subagents-strategy/2026-06-12-constitution-v051-assessment/research.md
- research/subagents-strategy/2026-06-12-constitution-v051-assessment/findings.md
- telemetry/agents/subagents-dispatch.yaml
- telemetry/agents/agent-pool.yaml
- internal_tools/subagents-dispatch-hooks/README.md
- vault/sessions/2026-06-12-1335-subagents-dispatch-hardening-and-constitution-v051.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `subagents-strategy-constitution-proposal.md` | `modifies` | Amended the constitution in place from v0.5.1 → v0.5.2-proposal: close row restored (T1), self-approval prohibited (T3), zig-zag convergence rule (T2), schema_version field added, ~19 assessment fixes applied, §8 changelog citing the findings doc. |
| `research/subagents-strategy/2026-06-12-constitution-v051-assessment/research.md` | `creates` | Produced as new file: collected returns of the 7-agent adversarial dispatch (4 explorers → opus synthesizer ↔ 2 reviewers in zig-zag). |
| `research/subagents-strategy/2026-06-12-constitution-v051-assessment/findings.md` | `creates` | Produced as new file: adjudicated synthesis of the dispatch — 2 CRIT / 14 MAJ / 11 MIN confirmed, 4 findings refuted, tensions T1–T5 decided. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Appended the dispatch row and the close row for the `2026-06-12-constitution-v051-adversarial-assessment` dispatch. |
| `telemetry/agents/agent-pool.yaml` | `consumes` | Drew 7 agent names from the pool and verified the count equals 245. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `consumes` | Read to verify the MultiEdit coverage claim; used as evidence to refute the corresponding assessment finding. |
| `vault/sessions/2026-06-12-1335-subagents-dispatch-hardening-and-constitution-v051.md` | `consumes` | Read as context at session start: prior session that produced v0.5.1 and identified the same SKILL.md lag, now one version further behind. |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `contradicts` | Still operationalizes v0.3.0 machinery (spec files, JSONL telemetry, validator block, recursion_budget); lags the v0.5.2 constitution produced this session. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `contradicts` | Dispatch-row schema it emits lacks v0.5.2 fields (groups[], connections[], schema_version, final_approver, working_folder, per-agent initial_prompt/token_budget); close_of half now legal but schema not updated. |
