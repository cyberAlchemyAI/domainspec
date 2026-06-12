---
tags: [subagents, dispatch, constitution, findings, meta]
node_type: findings
is_session: false
layer: architecture
nature: technical, procedural
status: draft
version: 0.1.0
last_updated: 2026-06-12
dispatch_id: 2026-06-12-constitution-v051-adversarial-assessment
---

# Findings — Constitution v0.5.1 adversarial assessment (adjudicated synthesis)

Every claim cites a collected return in `research.md` (E1 Gödel, E2 Abramsky, E3 Quine,
E4 Bell, S1 Noether, R1 Russell, R2 Chalmers) or a parent verification. Severities below are
FINAL (parent = `final_approver`, after Russell's refutation pass and parent spot-checks).

## Verdict

v0.5.1 is a coherent, well-argued lean design whose **two real emergencies are (a) one
literal internal contradiction on its load-bearing invariant and (b) total divergence from
the tooling that would enforce it**. The text contradicts itself exactly once but at the
worst place: the `feedback` edge mandates a row write-back at close that Principle 3 forbids
(N1). The machinery on disk (appender, register-dispatch, strategy skill) implements the
*negation* of the no-close-event spine (F1/F2) — so T1 (persist the outcome vs hold the
line) must be decided before anything else, because text and tooling currently disagree and
both cannot be right. Beyond that: two §2 facts are false against the artifacts (F13), the
helper-spawn cost gap is admitted but still open (F4), and the reviewer pass surfaced a
band of specification gaps (N2–N11) that are individually small but collectively defeat the
document's own §1 success criterion ("two strategists fill the sheet the same way", N11).
The severity-inflation found by Russell cut 4 findings outright and downgraded 8 — the
original draft overstated; this adjudicated list does not.

## Confirmed findings (final severities)

### CRITICAL

- **C1 (N1, parent-verified)** — §5 Level-3 `feedback` says the feedback prompt is recorded "verbatim **in the row at close**"; P3 says the row is "**never updated**" and there is "**no close event**". Literal self-contradiction on the constitution's central invariant. Fix: record in the findings doc, not the row — or decide T1 the other way.
- **C2 (F1; E2#1–2, R1-upheld)** — The only sanctioned write path (`append-dispatch.cjs`) hard-requires the close events P3 forbids, the live ledger already contains a `close_of` row, and the appender cannot write a §6-compliant row (no groups/connections/initial_prompt/token_budget/…). The tooling's data model is the negation of the text. Resolves only via T1.

### MAJOR

- **M1 (F2; E2#3,7)** — `.claude/skills/domainspec-subagents-strategy/SKILL.md` is entirely v0.3.0 and points at the old constitution; v0.5.1 is unenforceable at the user entry point until ported. (Downgraded from CRIT: draft-status anticipates lag; still the #1 follow-up.)
- **M2 (F3; E4#1 + E1#6, R1-downgraded)** — Dispatch outcome (`exit_reason`, `agents_spawned`) is never queryable in the canonical registry; §7 names and AFFIRMS this debt, which caps severity, but the affirmation is what T1 must re-decide. Bell's n=1 sub-claim refuted (research n=1 does produce findings.md).
- **M3 (F4; E4#2)** — "Reporting is the brake" does not bound aggregate cost: P11 helpers need no gate or row; per-agent `token_budget` cannot bound the sum. The text admits the open question; the cheap close is a dispatch-level `max_agent_total` enforced pre-spawn.
- **M4 (N9)** — `token_budget` is required but no enforcing component exists (the Agent harness has no per-call output cap), so §7's claim that it "partially discharges" P-SS-8 is false as written. Reframe as advisory briefing target or name the actuator.
- **M5 (F11; E4#5 + E1#12)** — Discovery-promotion cut leaves an unowned seam: nothing binding prevents findings being hand-promoted into `vault/**` with no gate anywhere, and the repo's own routing expects promotion. Fix: P9 sentence prohibiting agent writes to vault/** + name the gate's home (compatible fixes, do both).
- **M6 (F13; E2#4, parent-verified)** — §2 states two false facts: the pool has **245** names (not 217) and `role_fit` is an ordered **list** (not a single tag). Fix the facts — or take T4's lean fork and drop the pool constraint.
- **M7 (N2)** — No re-confirm rule when the strategist edits the sheet after human confirm; the gate guarantee does not attach to an immutable artifact. Fix: "confirmed sheet is frozen; any post-confirm edit re-enters the gate."
- **M8 (N4)** — `dispatch_id` (date+slug) is not unique within a day, yet it is the join key for lineage and artifacts. Fix: suffix rule + ledger check.
- **M9 (N5, root cause of F19)** — No `schema_version` on the row and no concrete adoption date: grandfathering cannot be mechanized; even new rows are unversioned for future migrations.
- **M10 (N3)** — Partial-failure semantics absent: one agent of a group erroring has no defined outcome (fail group? degrade? retry?), and `error` is a dispatch-level scalar with no locus.
- **M11 (N7 + N8)** — `final_approver` mechanics underspecified: no fallback when the named agent's group never runs (making `resolved` unreachable), and the approver's input surface is never defined (it cannot check P9 citations without `research.md`).
- **M12 (N10)** — zig-zag has no early-convergence criterion; only the cap terminates, conflating "converged early" with `loop_ceiling_reached`.
- **M13 (N11)** — §1's own success criterion ("two strategists, same goal, same sheet") is defeated by three required judgment fields (`token_budget`, `model`, `angle`) with no deterministic fill rule. Soften the claim or supply discrete bands.
- **M14 (N6)** — No atomicity/locking contract for concurrent appends to the sole persistence surface. (Mitigated in practice by the single appender; still unstated.)

### MINOR

- **m1 (F5; E1#3–4, R1-downgraded)** — `exit_reason` edge cases: `loop_ceiling_reached` vs `dissent_irreconcilable` overlap (no tiebreak); the "approver rejects, human stops" case maps to `user_abort` only via P12's standing-abandon power. Cheap fix: precedence order.
- **m2 (F6; E4#3, R1-downgraded; = T2)** — `resolved` has a decision procedure but no falsifiable criterion; Bell's goal-embedded acceptance clause is a cheap middle path that does not re-add the field.
- **m3 (F7; E4#4 ⟂ E3#9; = T3)** — Self-approval named-but-not-mitigated; strengthen (chat flag) vs delete (theater) — opposite remedies, owner decides.
- **m4 (F9; E3#2)** — `initial_prompt` verbatim in the row is a consciously-priced auditability tradeoff; the pointer alternative interacts with M2 (pointed-at artifact must be durable).
- **m5 (F12; E4#6, R1-downgraded)** — P5 already states the predictable-disagreement criterion; adopting Bell's per-pair "state the question" operationalization is cheap and additive.
- **m6 (F15; E1#5, R1-downgraded)** — P14 does bind on zig-zag return turns; remaining ambiguity is how a robot-talks-collapsed output preserves per-agent initial/final positions ("both present in working_folder" is the only reconciliation).
- **m7 (F16/F17; E1#10–11)** — `n` required-yet-default-1; `agents_spawned` example keyed by group_id against its own role-category rule.
- **m8 (F19; E4#7)** — Grandfathered rows untagged in aggregates (subsumed by M9's root cause).
- **m9 (E2#5)** — The cited wave5 "repo precedent" is a v0.2.0 snapshot carrying abolished fields; citation staleness, not structure (R1 downgraded from F10).
- **m10 (N12–N15)** — `context` optional-yet-indispensable; `meta-evaluate`/`auditor` with no trigger or example; robot-talks authority unpinned (potential single-gate conflict); helpers have no role-category in the `agents_spawned` tree. *(Reviewer-stage: not adversarially re-reviewed.)*
- **m11 (E3#3,5,6,8 ⟂ E1#7,8; = T5)** — Lean-vs-formal fork on the layers dial, `anti_bias_global` conditional, edge algebra, and meta machinery: Quine would remove, Gödel would tighten. Owner decides direction before wording.

## Refuted (killed by review — recorded so they are not re-raised)

- **F8** (mandatory synthesizer for ALL dispatches) — P6's absolute is scoped to the explorers+reviewers configuration; a lone fan-out needs no midfield (R1).
- **F10** (reserved dispatch_types = vaporware) — reserved-with-explicit-guard is prudent forward-compatibility; nothing breaks (R1). Citation staleness survives as m9.
- **F14** (skeleton wires the conditional feedback edge) — example exercising the full vocabulary; the stated condition is arguably satisfied (R1).
- **F21** (README omits MultiEdit) — false premise; README line 22 lists it (parent-verified).
- **F18/F20** — downgraded to trivial by R1 (specialization is defined in context; "between the layers" is defined by the corollary).

## Open tensions (owner decisions, not smoothed)

- **T1 — Persist the outcome or hold "no close event"?** The load-bearing decision. Text (P3 + §7 NEW-debt affirmation) vs tooling (close_of already built and in use) vs C1 (the text itself slips into a row write-back). C2, M2, and C1 all resolve only after T1. *(S1, R1: "load-bearing, real".)*
- **T2 — success_metric:** keep cut (§7 rationale is strong; R1 sides lean) vs goal-embedded falsifiable clause (Bell's cheap middle).
- **T3 — Self-approval note:** strengthen with an active chat flag (Bell) vs delete as theater (Quine). Leaving as-is is the one option both reject.
- **T4 — Agent pool:** fix the two false facts (mandatory either way) and then decide: keep the pool constraint or drop it as decorative (Quine).
- **T5 — Edge algebra & meta machinery:** collapse (Quine) vs tighten specification (Gödel: meta-planned-by-meta unsanctioned; loop_cap cross-reference). Direction first, wording second.

## Dispatch record

- **dispatch_id:** `2026-06-12-constitution-v051-adversarial-assessment` (ledger row appended pre-dispatch; `meta` dispatch — framework assessment).
- **Sheet:** 4 explorers (Gödel-opus ⟂ Abramsky-sonnet on methodology; Quine-sonnet ⟂ Bell-sonnet on prior) → Noether-opus synthesis ↔ reviewers zig-zag loop_cap 1 (Russell-opus precision ⟂ Chalmers-opus recall). `anti_bias_global`: governance minimalism vs auditability maximalism.
- **Deviation reported:** Noether's zig-zag return turn was absorbed by the parent (final_approver = parent performed the post-review adjudication directly); Chalmers's N-findings received parent spot-verification (N1 confirmed; pool count re-verified at 245) but no dedicated adversarial pass.
- **exit_reason:** `resolved` — final_approver (parent) accepted the adjudicated synthesis.
- **agents_spawned:** `{total: 7, tree: {investigate: 4, synthesize: 1, evaluate: 2}, loops_used: 1}` — no helper invocations.
