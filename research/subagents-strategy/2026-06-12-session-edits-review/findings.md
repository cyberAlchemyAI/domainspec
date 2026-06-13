---
tags: [agents, dispatch, subagents, review, red-team, change-requests]
node_type: findings
is_session: false
layer: architecture
nature: analytical
status: complete
last_updated: 2026-06-12
---

# Findings — session-edits review (verified change requests)

**Dispatch:** `2026-06-12-session-edits-review` (meta, review, schema v0.5.2).
**Goal:** red-team today's amendments (D1 dependency scheduling, D2 anti-bias decision
rule) as implemented; deliver verified change requests. Collected returns:
`attacks.md` (this folder) — citations [BEN]/[ART]/[BAN]/[GOD]/[BEL] resolve there.
**All 16 findings were CONFIRMED by both verifiers; zero refuted.** Verdicts:
constitution **FIX** · router skill **FIX** · review skill **FIX** · research skill
**FIX** (retargeted B2) · validator-check delegation **FIX** (constitution-side) ·
dispatch-hooks README **KEEP** (2 MINOR) · test battery **KEEP** (2 MINOR).

## Change-request list (severity order; every item verifier-confirmed)

### CRITICAL

| # | File | Defect | Fix |
|---|---|---|---|
| 1 | constitution §5 `feedback` / P4 | D1 says feedback edges "never count as dependencies" while §5 requires re-invocation driven by the requesting group's ask — no rule says WHEN it fires under concurrent scheduling [BEN-F2, GOD] | Feedback fires as a re-invocation **event** when the requesting group emits its ask, decoupled from readiness; it never blocks any launch |
| 2 | constitution P5 test 1 + §5 `anti_bias_global` | Axis-vocabulary closure unscoped — the skeleton's own `anti_bias_global` value violates it; test 1 as written rejects every example [BEN-F4, GOD] | Scope the closure to per-group `anti_bias` only; declare `anti_bias_global` a free-text theme the per-group axes specialize, never vocabulary-checked |
| 3 | router skill step 3 | "run groups sequentially in declared order" — contradicts D1; router is the single owner of universal law [BEN-F7=BAN-F2, GOD] | Copy the canonical D1 wording from research/SKILL.md How-to-run |
| 4 | review skill How-to-run | "groups run in declared order" — the two LIVE type skills literally disagree on scheduling [BEN-F8=BAN-F1, GOD] | Same canonical wording |

### MAJOR

| # | File | Defect | Fix |
|---|---|---|---|
| 5 | constitution §3/P4 zig-zag readiness | Bidirectional zig-zag edge + "edge into it" readiness = mutual-wait/ambiguity; no named opening turn [ART-F1, GOD] | Readiness counts a zig-zag edge in its `from`→`to` direction only — the `from` endpoint opens the exchange; back-turns are intra-exchange |
| 6 | constitution §9 third debt | Re-listed only under the renamed residual, dropping §7's first clause — fails the §7 meta-clause [BEN-F3, GOD] | Re-confront under the §7 name, affirming both clauses |
| 7 | constitution §9 D2 row | Doesn't state the enforcement split (four-test = gate-only; global presence = appender) [BEN-F5, GOD] | State the split in the row |
| 8 | constitution §6 skeleton comment | Lists `review` as FORECAST; §5 says LIVE [BAN-F5, GOD] | `# research LIVE; review LIVE (2026-06-12); code|plan|suggestion FORECAST` |
| 9 | research skill line 13 | "the only LIVE type under constitution v0.5.2" — stale since the review promotion [BAN-F3; retargeted to research/SKILL.md by GOD flag-resolution] | "one of two LIVE types (the other is `review`)" |
| 10 | constitution P5/§9 D2 delegation | Delegates anti-bias semantics to `validator-check.md`, whose protocol speaks the pre-v0.5.2 schema (`dispatch.yaml`, `composition`/`layers[]`, retired `evaluator`) [BAN-F4, GOD] | Add a schema-translation note: the P5 four tests are the v0.5.2 operationalization; the vault file is pending realignment |

### MINOR

| # | File | Defect | Fix |
|---|---|---|---|
| 11 | constitution §9 P-SS-9 line | Affirmation silently relies on the lifecycle-vs-topology split P-SS-9 records as undischarged [BEN-F6, GOD] | Note the dependency honestly |
| 12 | constitution §9 | `invoked_by` pending amendment tracked nowhere in the constitution [BAN-F7, GOD] | Give it a tracked home in §9 |
| 13 | dispatch-hooks README | Omits the new `anti_bias_global` conditional [ART-F3, GOD] | One parity line |
| 14 | dispatch-hooks README | "currently untracked by git" — silent-rot state claim [BAN-F6, GOD] | Rephrase as open decision, no current-state assertion |
| 15 | test battery §16 | Missing 16d: one fan-out group + many singletons, no global → exit 0 [ART-F2a, BEL: reproduced exit 0] | Add 16d |
| 16 | test battery §16 | Missing 16e: malformed second group must not crash/misfire the conditional [ART-F2b, BEL: reproduced clean exit 2] | Add 16e |

## What survived the attack (confirmed clean)

The D2 appender conditional itself is robust [ART, BEL]: crash-safe counting filter,
`agents.length` not `n`, double-caught empty global, close rows unaffected, battery
76/76. The router's routing table, the register-dispatch field tables, and the
constitution's §5 `dispatch_type` prose are all consistent on review-LIVE [BAN]. The
four-test rule's lack of executable enforcement is **by-design layering** (gate-side),
not a defect — confirmed executable ([BEL-F4]: nonsense axes register with exit 0,
exactly as the enforcement split declares); the CR is to *state* the split in §9
(item 7), not to add appender enforcement.

## Close record

`exit_reason: resolved` — `final_approver` (parent) accepted after checking every
surviving finding is cited to a collected return and no refuted finding remains (zero
were refuted). `agents_spawned: {total: 6, tree: {investigate: 3, synthesize: 1,
evaluate: 2, helpers: 0}, loops_used: 1}` — zig-zag converged on the first verifier
turn (ceiling 2); feedback edge never fired. Applying these change requests is a
follow-up act outside this dispatch (review type skill), executed inline by the
strategist with the human's prior authorization.
