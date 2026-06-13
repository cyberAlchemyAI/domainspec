---
tags: [agents, architecture, ontology]
node_type: discovery
is_session: true
layer: architecture, ontology
nature: explanatory, procedural
status: active
created: 2026-06-12
timestamp: 2026-06-12T19:16:00-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-subagents-governance-amendments
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Two in-place constitution amendments (D1 dependency scheduling, D2 anti-bias decision rule), two governed dispatches closed resolved, 16 review findings confirmed and applied — load-bearing governance outputs."
---

# Subagents-strategy governance amendments + two governed dispatches

## Summary

The session amended the subagents-strategy constitution in place with dependency-based
group scheduling (D1) and a mechanical four-test anti-bias decision rule plus appender
enforcement of the `anti_bias_global` conditional (D2). It then ran two governed,
ledger-recorded dispatches: a research dispatch on depth-1 nested dispatch design
(verdict: adopt on paper, gated off until a quarantine consumption-gate and appender
enforcement are built — the delegated-gate-as-drafted and bare nesting grants were
killed by skeptics) and a review dispatch red-teaming the session's own edits (16
findings confirmed by two verifiers, 0 refuted, 4 CRITICALs in the morning's own
amendments). All 16 change requests were applied inline; the test battery now passes
78/78; editor agents were refused because `dispatch_type: code` is reserved.

## Contradictions

- questions `vault/discovery/anti-bias-vector-composition/validator-check.md` — its
  protocol predates v0.5.2 (`dispatch.yaml`, `composition`/`layers[]`, retired
  `evaluator` role) while constitution P5/§9-D2 delegates anti-bias semantics to it;
  the constitution now carries a pending-realignment note.

## Files touched

- subagents-strategy-constitution-proposal.md
- .claude/skills/research/SKILL.md
- .claude/skills/review/SKILL.md
- .claude/skills/domainspec-subagents-strategy/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/README.md
- research/subagents-strategy/2026-06-12-depth1-nested-dispatch-design/research.md
- research/subagents-strategy/2026-06-12-depth1-nested-dispatch-design/findings.md
- research/subagents-strategy/2026-06-12-session-edits-review/attacks.md
- research/subagents-strategy/2026-06-12-session-edits-review/findings.md
- telemetry/agents/subagents-dispatch.yaml

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `subagents-strategy-constitution-proposal.md` | `modifies` | In-place constitution amendments: D1 dependency-based group scheduling, D2 mechanical four-test anti-bias decision rule, plus a pending-realignment note toward validator-check. |
| `.claude/skills/research/SKILL.md` | `modifies` | Applied confirmed change requests from the session-edits review dispatch to the research type skill. |
| `.claude/skills/review/SKILL.md` | `modifies` | Applied confirmed change requests from the session-edits review dispatch to the review type skill. |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Router skill updated to carry the D1/D2 constitution amendments and applied review change requests. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` | `modifies` | Register-dispatch form skill updated for the D2 `anti_bias_global` conditional enforced by the appender. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | Appender now enforces the `anti_bias_global` conditional per constitution D2. |
| `internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs` | `modifies` | Test battery extended for the new appender enforcement; passes 78/78. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | Synced with the appender behavior changes landed this session. |
| `research/subagents-strategy/2026-06-12-depth1-nested-dispatch-design/research.md` | `creates` | Raw research output of the governed dispatch on depth-1 nested dispatch design. |
| `research/subagents-strategy/2026-06-12-depth1-nested-dispatch-design/findings.md` | `creates` | Dispatch verdict: adopt on paper, gated off until a quarantine consumption-gate and appender enforcement are built. |
| `research/subagents-strategy/2026-06-12-session-edits-review/attacks.md` | `creates` | Red-team attack log of the review dispatch over this session's own edits. |
| `research/subagents-strategy/2026-06-12-session-edits-review/findings.md` | `creates` | 16 findings confirmed by two verifiers (4 CRITICAL, 0 refuted); all change requests applied inline. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Four ledger rows appended via the sanctioned appender (dispatch + close for each of the two governed dispatches); file is append-only and was never edited directly. |
| `vault/discovery/anti-bias-vector-composition/validator-check.md` | `opens-question` | Session surfaced that the validator protocol predates v0.5.2 (`dispatch.yaml`, `composition`/`layers[]`, retired `evaluator` role) while constitution P5/§9-D2 delegates anti-bias semantics to it; realignment pending. |
