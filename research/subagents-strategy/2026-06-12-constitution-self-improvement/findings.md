---
tags: [subagents, dispatch, constitution, findings, amendments, meta]
node_type: findings
is_session: false
layer: architecture
nature: technical, procedural
status: draft
version: 0.1.0
last_updated: 2026-06-12
dispatch_id: 2026-06-12-constitution-self-improvement
cites: research.md
---

# Findings — Constitution v0.5.1 amendment list (cited synthesis)

Every amendment cites the explorer finding in [research.md](research.md) that motivates
it (E1 A*/B*, E2 C*/D*/M*/P*, E3 #*). Re-inflations of §7 cuts confront the recorded
removal justification. Two adversarial reviewers (complexity-creep, underspecification)
converged; the synthesizer ceded every defense that hit an internal contradiction or
required inventing schema under pressure. Result below is post-zig-zag.

## A. Blocks adoption (5 real blockers, all ready to write)

- **E1** (fix · Principle 3 + §6 skeleton) — cites E2 C1/C2. "at close it updates the same row" → "at close it appends a separate `close_of` event referencing the dispatch_id"; skeleton shows close as a separate entry, not commented fields on the dispatch row. Aligns text to the implemented append-only tooling.
- **E2'** (decision · §5 + Principle 9) — cites E2 C4, E3 #7/#15. Rich schema (`groups`/`connections`/`working_folder`) declared **FORECAST**; flat schema declared **LIVE**. FORECAST is a per-field `status: forecast` annotation in the schema doc (the doc is the sole carrier — no "forecast at runtime"); a forecast field simply does not appear in the flat-LIVE schema dispatches use; promotion FORECAST→LIVE only by constitutional amendment. Single promotion verb: "go LIVE". **Decision taken:** FORECAST, not appender rewrite (zero proven demand; rewrite re-inflates the ceremony §7 trims; reversible).
- **E3** (decision · §5 `agent_name`) — cites E2 C3, E3 #14. `agent_name` → optional + FORECAST, default null; remove the nonexistent-pool reference. **Decision:** do not port the pool (field never used; porting is gold-plating).
- **E5'** (decision · §3/§5) — cites E3 #2, reviewer E5×E9. The positive disambiguation rule that was missing: **N passes WITH conversation between them ⇒ `loop_cap` on the edge; N independent passes ⇒ `layers`.** `layers>1` forbidden *only* when a feedback/zig-zag edge runs *between* the layers; independent multi-pass `layers` stays valid (preserves the v0.5.0 "two reviewer passes" example).
- **E10'** (decision · §5 `exit_reason`) — cites E2 D7, E3 #5, reviewer user_abort. Closed vocabulary `{converged_and_approved | loop_exhausted | dissent_irreconcilable | user_abort | error}`. `user_abort` kept (covers Principle 2 abandon); `success`→`converged_and_approved` (carries both loop-convergence AND approver-acceptance, removing the ambiguity without losing the distinction); `loop_exhausted` defined as an edge loop_cap reached without convergence; `validator_rejected_twice` removed (no validator).

## B. Tighten (ready to write)

- **E4'** (was a blocker, rebased) — cites E3 #1, reviewer E4×E13. **One and only one human gate** (lifecycle step 2). final_approver=agent **recommends**; approval authority stays human at step 2; **no second human gate at close**. The agent recommendation cannot block `status:complete` by itself.
- **E7** feedback edge unified as conditional in all three places (E3 #3). **E8** annotate skeleton `loop_cap:1` as override of default 2 (E3 #4). **E9** working_folder+two-files conditional on research-kind + n≥2; n=1 → single file; move "outputs land" to lifecycle step 3 (E3 #7/#10/#12). **E11** agents_spawned role-category keys + auditor↔meta-evaluate map (E2 P5, E3 #9). **E12** top meta has parent_dispatch_id=null, chain finite acyclic (E3 #6). **E13** 4-step lifecycle canonical; writer subagents are helper invocations under step 3; heuristic_row = step-1 default-selection (E2 D8). **E14'** (atomic pair) anti_bias_global conditional-R when ≥2 groups have n≥2 AND §5 rewritten so a group's anti_bias is stand-alone when global is absent (E3 #11). **E18'** (reduced) synthesizer must receive initial AND final positions of each review agent (the one verifiable artifact from E1 A1); the rest of A1 relocates to robot-talks-constitution.

## C. Notes (non-normative, ready)

- **E15** rejects re-inflating validator / spec files / JSONL telemetry / recursion_budget (E2 D1/D2/D3/D5 show the *skill* used them, not that they improve outcomes). **E6'** the skill drift (D8) is a migration **backlog** item, not a constitutional clause. **E19** judge-bias is a recorded risk; no mitigation mandated in v0.5.1 (the "OR" disjunction was unverifiable). **E20** warn (not block) on homogeneous models for n≥2 (E1 A2). **E21** concat never a final output (E1 A4). **E22–E26** meta-evaluate positioned, model:parent defined, ⟂ canonicalized, external refs to footnote, premise-debt untouched.

## D. Cut

- **E16** (token_budget_total) — CUT. Both reviewers KILL. The P-SS-8 waiver forbids silent inheritance; a falsification of P-SS-8 mandates *revising P-SS-8 and returning `recursion_budget`*, not grafting a second cost-axis cap. Underspecified (no default/owner/trigger). Survives only as the open question E16' below.
- **E17** (un-cut success_metric) — CUT. Fatal contradiction E17×E2: success_metric is not in the flat-LIVE schema, so "appender already emits it" is false. "Fillable non-vacuously in 3 cases" ≠ "used as a mechanical halt predicate"; halt is already covered by max_loops + final_approver.
- **E18 body** → relocated to robot-talks-constitution.

## Open — needs human decision (do NOT write into v0.5.1 unanswered)

1. **E16' / P-SS-8.** The real runaway-cost incident (E1 A3) is a candidate falsification of the P-SS-8 unregulated-spawn waiver. Either (a) reopen P-SS-8, return `recursion_budget` with an explicit debt discharge, or (b) ratify that `loop_cap`+`max_loops` already cover it and close the debt. No cost cap enters the schema until this is decided. (Deliberately overrides E15's refusal to re-inflate recursion_budget — that's the human's call, not a bug.)
2. **E19.** Fix a single judge-bias mitigation mechanism in a future amendment, or leave it as a standing note?

## Exit

`exit_reason: converged_and_approved`. Zig-zag used 1 of 3 allowed rounds; reviewers'
convergence left no residual dissent. 6 agents (3 explorers, 1 synthesizer, 2 reviewers),
loops_used 1. Two items remain open for the human; everything else is ready to write into
v0.5.1.
