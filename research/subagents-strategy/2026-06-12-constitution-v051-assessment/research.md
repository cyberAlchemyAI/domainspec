---
tags: [subagents, dispatch, constitution, research, meta]
node_type: research
is_session: false
layer: architecture
nature: technical, procedural
status: draft
version: 0.1.0
last_updated: 2026-06-12
dispatch_id: 2026-06-12-constitution-v051-adversarial-assessment
---

# Research — Constitution v0.5.1 adversarial assessment (collected returns)

Meta-dispatch auditing `subagents-strategy-constitution-proposal.md` (v0.5.1-proposal, repo
root). Shape: 4 explorers (tensioned: formal vs empirical × lean vs safety) → synthesizer
(Noether, opus) ↔ 2 reviewers (zig-zag, loop_cap 1: Russell false-positive killer ⟂ Chalmers
false-negative hunter). This file holds the collected returns condensed-but-faithful (every
finding, severity, and key evidence preserved); `findings.md` holds the adjudicated synthesis.

## E1 — Gödel, Kurt (formal/internal, opus)

1. CRITICAL — §6 skeleton instantiates the conditional `feedback` edge with no annotation that its condition (§3/P6/Level-3: "reviewer group AND material may be missing") holds.
2. MAJOR — `anti_bias_global` "specializes" relation underspecified; example axes don't visibly specialize the global theme.
3. CRITICAL — `exit_reason` taxonomy not total: approver-rejects-with-loops-remaining-but-no-rerun maps to no value; `loop_ceiling_reached` vs `dissent_irreconcilable` overlap, no tiebreak.
4. MAJOR — `max_loops` trigger ("re-run fires ONLY on final_approver rejection") vs `loop_ceiling_reached` ("an edge loop_cap OR max_loops") conflate local exchange ceilings with the global re-run brake.
5. MAJOR — P7 (robot-talks collapses output via synthesize) vs P14 (downstream synthesizer MUST receive each reviewer's initial AND final positions): data flow ill-defined; canonical shape has no downstream synthesizer.
6. MINOR — §2 "the row IS the spec and IS the telemetry; no separate event log" overstates: close telemetry never reaches the row; chat+findings is a separate surface.
7. MINOR — `layers` corollary: does an incident zig-zag edge run "between the layers"? Both readings plausible.
8. MINOR — meta-planned-by-meta (`meta: true` + non-null `parent_dispatch_id`) never explicitly sanctioned; base-case prose assumes meta dispatches are top-level.
9. MINOR — Level-3 header "`{from, to, type, loop_cap?}`. Nothing else" lists `loop_cap` as uniformly optional; per-type prohibition (absent on sequential) stated elsewhere without cross-reference.
10. MINOR — `n` is R (required) yet "Default 1": required-with-default is contradictory; fails the "two strategists fill the same way" test.
11. MINOR — `agents_spawned` example tree keyed by group_id while the rule says role-category; example violates its own keying rule.
12. MINOR — `working_folder` "Never vault/**" + discovery-promotion cut leave an uncross-referenced gap vs repo CLAUDE.md route expecting promotion to `vault/discovery/`.

## E2 — Abramsky, Samson (empirical/disk, sonnet)

1. CRITICAL — appender (`append-dispatch.cjs` 46–131) + register-dispatch SKILL implement `close_of` close events with required `exit_reason`/`agents_spawned`; live ledger already contains a close_of row. Constitution P3/§7 forbid close events.
2. CRITICAL — appender emits only the old flat schema (dispatch_id, corpus, topic_slug, created, session, status, goal, success_metric, max_loops, constraints, anti_bias, agents); no output path for dispatch_type, final_approver, meta, parent_dispatch_id, anti_bias_global, working_folder, groups[], connections[]; agents column lacks initial_prompt / token_budget / agent_name. A §6-compliant row cannot be written by the current tool.
3. CRITICAL — `.claude/skills/domainspec-subagents-strategy/SKILL.md` is entirely v0.3.0 (vault/snapshots spec files, JSONL telemetry, validator block, recursion_budget, heuristic_row, bootstrap_override, spec_hash/corpus_hash, dispatch_kind, stop_conditions) and still points at the v0.3.0 constitution path.
4. MAJOR — agent-pool.yaml has 245 `name:` entries, not the claimed 217; `role_fit` is an ordered LIST, not a single tag as §2 implies. *(Parent verified: 245.)*
5. MAJOR — cited precedent `2026-05-16-subagent-strategy-parametrization-wave5` exists only as a v0.2.0 spec snapshot in `vault/snapshots/meta-dispatches/` (with abolished fields), not as a ledger row.
6. MAJOR — register-dispatch SKILL + appender still prompt for and emit `success_metric` and `constraints` (both removed by §7); live ledger rows carry both.
7. MINOR — active strategy skill writes specs to `vault/snapshots/dispatches/` on every invocation, violating "Never vault/**" until replaced.
8. MINOR — README hook table omits MultiEdit though the hook code covers it. *(Parent verified: FALSE — README line 22 lists MultiEdit. Refuted.)*

## E3 — Quine, Willard Van Orman (lean prior, sonnet)

1. MAJOR — four reserved-but-dead `dispatch_type` values (code|review|plan|suggestion): vaporware vocabulary; remove until genuinely governed.
2. MAJOR — `initial_prompt` required VERBATIM in the row: ledger bloat, duplicates the actual Agent call, unverifiable, honored in the breach; replace with `initial_prompt_ref`.
3. MINOR — three loop dials (max_loops/loop_cap/layers) + disambiguation table + corollary; `layers` unused in practice; drop it.
4. MAJOR — mandatory synthesizer midfield (P6 absolute) forces an opus-priced midfield even for trivial collection fan-outs; make it a default with an exemption condition.
5. MINOR — `anti_bias_global` conditional requirement is a rule-about-a-rule, fillable vacuously; make always-optional.
6. MINOR — edge algebra (3 edge types) + robot_talks + derived aggregation needs disambiguation in three places; collapse into one `exchange_mode` field.
7. MINOR — agent-name pool ceremony is decorative (`agent_name: null` allowed proves it); drop the constraint.
8. MINOR — `meta` + `parent_dispatch_id` machinery for a rarely-used feature; drop both, carry intent in `context`.
9. MINOR — P12's non-binding self-approval note names a defect and declines to fix it: governance theater; remove the parenthetical.

## E4 — Bell, John S. (safety prior, sonnet)

1. CRITICAL — outcome persisted nowhere queryable: exit_reason/agents_spawned only in chat + findings doc; post-incident audit of the 1.67B-token class would show every row as nominal. Fix: close_of append with exit_reason + agents_spawned_total. *(Sub-claim "n=1 produces no findings doc" refuted by Russell: §5/P9 say research n=1 produces findings.md.)*
2. CRITICAL — "reporting is the brake" is not a brake: P11 helpers need no gate/row; recursive helper trees unlisted; per-agent token_budget doesn't bound the aggregate. Fix: dispatch-level `max_agent_total` enforced pre-spawn.
3. MAJOR — success_metric removed: `resolved` = approver accepted, no falsifiable criterion. Fix: goal ends with a one-sentence falsifiable acceptance condition.
4. MAJOR — P12 self-approval: agent approver can mint `resolved` on its own group's work; `user_abort` is passive. Fix: mandatory chat flag when approver ∈ agents[].
5. MAJOR — discovery-promotion gate cut: vault discovery workflow not referenced/binding; a helper writer could move findings into vault with no gate. Fix: P9 prohibition on agent writes to vault/** + name the gate's home.
6. MAJOR — validator cut: anti-bias check = human eyeballs on strategist-authored angles. Fix: P5 rule — state, per pair, the question on which the two disagree.
7. MINOR — grandfathering: old rows silently mix into aggregate queries. Fix: schema_version tag on pre-v0.5.1 rows.

## S1 — Noether, Emmy (synthesizer, opus) — draft

Produced findings draft F1–F21 + open tensions T1–T5 + dismissed list. Verdict: coherent
design, not yet enforceable on disk; most consequential design defect = outcome persisted
nowhere queryable; exit_reason taxonomy non-total; lean-vs-safety tensions surfaced, not
smoothed. (Full adjudicated form in `findings.md`; deduplication mapping recorded there.)

Key tensions surfaced: T1 persist-outcome vs no-close-event (load-bearing — tooling already
on the opposite side of the text); T2 success_metric restore-vs-keep-cut; T3 self-approval
strengthen-vs-delete (opposite remedies, same defect); T4 pool fix-facts-vs-drop-constraint;
T5 edge-algebra/meta collapse-vs-tighten (Quine remove ⟂ Gödel under-specified).

## R1 — Russell, Bertrand (false-positive killer, opus) — zig-zag turn 1

Verdicts on the draft: F1 UPHELD CRIT (airtight against appender source — `exit_reason`
required on close record, line 49). F2 CRIT→MAJOR (stale entry point is non-adoption, not a
text flaw). F3 CRIT→MAJOR (debt self-named in §7; n=1 sub-claim refuted). F4 MAJOR (text
admits the open question). F5 CRIT→MINOR ("human stops" maps to `user_abort` via P12's
standing-abandon power; overlap real but minor). F6 MAJOR→MINOR (§7 gives the cut rationale;
decision procedure exists). F7 MAJOR→MINOR (conscious design decision; T3 genuine).
F8 REFUTED (P6's absolute is scoped to the explorers+reviewers configuration; nothing
mandates a midfield for a lone fan-out). F9 MAJOR→MINOR (deliberate auditability price).
F10 REFUTED (reserved-with-guard is prudent forward-compat; wave5 citation staleness is a
cosmetic nit). F11 UPHELD MAJOR (genuine unowned seam). F12 MAJOR→MINOR (P5 already states
the predictable-disagreement criterion). F13 UPHELD MAJOR (claimed pool count 250 — parent
re-verified: 245; role_fit is a list — both §2 facts false either way). F14 REFUTED (example
exercising full vocabulary; condition satisfied — reviewers exist). F15 MAJOR→MINOR (on
zig-zag return turns the synthesizer IS downstream; P14 binds). F16 UPHELD MINOR. F17 UPHELD
MINOR. F18 →trivial. F19 UPHELD MINOR. F20 →trivial. F21 REFUTED (README lists MultiEdit —
parent verified). Overall: draft directionally reliable but severity-inflated; spine =
F1, F4, F11, F13.

## R2 — Chalmers, David (false-negative hunter, opus) — zig-zag turn 1

New findings N1–N15 (not themselves adversarially re-reviewed; N1 parent-verified):

1. CRITICAL — §5 Level-3 `feedback`: "the parent session records it verbatim **in the row at close**" vs P3 "the row is never updated / no close event" — literal intra-document contradiction. *(Parent verified against the text: confirmed.)*
2. MAJOR — no re-confirm rule when the strategist mutates the sheet AFTER human confirm; the gate attaches to a sheet, not an immutable artifact.
3. MAJOR — mid-group agent failure has no semantics (partial group result? retry?); `error` exit has no locus; `max_loops` fires only on approver reject, so error has no recovery path.
4. MAJOR — `dispatch_id` = date+slug not unique within a day; lineage joins on this key; no disambiguator.
5. MAJOR — no `schema_version` field on the row; grandfathering cannot be mechanized; "adoption date" never a concrete date. (Root cause of E4#7/F19.)
6. MAJOR — two concurrent dispatches appending to one YAML: no atomicity/locking contract for the sole persistence surface.
7. MAJOR — `final_approver = agent_name` whose group never runs (early abort): `resolved` unreachable; no fallback to `parent` specified.
8. MAJOR — what the final_approver RECEIVES is never specified (working_folder? findings only?); citation-checking mandate unactionable without an input surface.
9. MAJOR — `token_budget` required but unenforceable: no component named that enforces it; the Agent harness has no per-call output cap; §7's claimed partial discharge of P-SS-8 is false as written.
10. MAJOR — zig-zag has no early-convergence criterion; only the numeric cap terminates, conflating "converged early" with "hit ceiling".
11. MAJOR — §1's success criterion ("two strategists fill the sheet the same way") defeated by judgment-filled fields (token_budget, model, angle) with no deterministic rule.
12. MINOR — `context` Optional yet its own Why says it is the only channel for judgment calls; optionality and indispensability incoherent.
13. MINOR — `meta-evaluate` role + `auditor` exist with zero worked example or trigger.
14. MINOR — robot-talks constitution bound as conflict-winning authority without version pin or compatibility clause; a mid-discussion user gate there would override P12's single-gate rule.
15. MINOR — `agents_spawned` tree keyed by role-category "including helper invocations", but helpers have no role-category; mandate unfillable as specified.
