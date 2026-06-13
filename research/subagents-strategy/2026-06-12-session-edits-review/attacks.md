---
tags: [agents, dispatch, subagents, review, red-team, governance]
node_type: research
is_session: false
layer: architecture
nature: analytical
status: complete
last_updated: 2026-06-12
---

# Attacks — session-edits review (collected returns)

**Dispatch:** `2026-06-12-session-edits-review` (meta, review, schema v0.5.2).
**Goal:** red-team today's in-place amendments and implementation (D1 dependency
scheduling, D2 anti-bias decision rule) across constitution, skills, appender, tests.
Shape run: attackers (investigate, n=3, lenses) → synthesizer ↔ verifiers (evaluate,
n=2, zig-zag, converged on turn 1 of 2 — verifiers confirmed all findings, raised no
draft inconsistencies). Feedback edge never fired.

## [BEN] Bénabou, Jean — attacker, fidelity/governance lens

- **F2 CRITICAL** — D1 strands P6 `feedback` semantics: §3/P4 now say feedback edges
  "never count as dependencies," but §5 still requires "the same agents are
  re-invoked; the requesting group's ask **is** the feedback prompt" — with no rule
  connecting the two under concurrent scheduling (the old sequential model made
  re-invocation timing unambiguous). Fix: feedback fires as a re-invocation **event**
  when the requesting group emits its ask, decoupled from readiness.
- **F3 MAJOR** — §9's debt re-confrontation re-lists §7's third debt only under a
  renamed residual ("Registry-sole-surface debt"), dropping the debt's first clause;
  the §7 meta-clause requires re-listing **all** debts. Fix: re-confront under the §7
  name, affirming both clauses.
- **F4 CRITICAL** — D2's axis-vocabulary closure collides with §5 `anti_bias_global`
  ("tension theme"): the skeleton value `novelty optimism vs precedent skepticism` is
  not in the four-axis vocabulary; P5 test 1 as written REJECTs every example. Fix:
  scope the closure to per-group `anti_bias`; declare the global a free-text theme.
- **F5 MAJOR** — §9's D2 row conflates the gate-checked four-test rule with the
  appender-checked presence conditional; a §9-only reader cannot tell which is
  enforced where. Fix: state the split in the row.
- **F6 MINOR** — §9's P-SS-9 affirmation leans on the lifecycle-vs-topology
  distinction P-SS-9's own discharge condition records as not yet made. Fix: note the
  dependency honestly.
- **F7 MINOR** — router skill step 3 still says "run groups sequentially in declared
  order" — contradicts D1.
- **F8 MAJOR** — review skill "How to run" still says "groups run in declared
  order" — the two LIVE type skills disagree with each other post-D1.
- **Dissent:** predicts the mechanics attacker will downgrade F2/F4 as unenforced
  prose and upgrade the doc-vs-doc execution fork; notes D2's four-test rule has zero
  executable enforcement (presence-only checks).

## [ART] Artin, Emil — attacker, mechanics/correctness lens

- **F1 MINOR** — D1's zig-zag readiness is ill-defined: a zig-zag edge is
  bidirectional, so "every group with a zig-zag edge into it has produced what it must
  respond to" yields a mutual-wait deadlock reading for synthesizer ↔ reviewers; no
  text names the opening endpoint. Fix: readiness follows the edge's `from`→`to`
  opening turn only; back-turns are intra-exchange.
- **F2 MINOR (test gaps)** — battery §16 misses (a) one-fanout + many singletons
  (locks "groups with ≥ 2 agents" vs "groups.length ≥ 2" semantics) and (b)
  invalid-group interplay (the counting filter must not throw/misfire when another
  group is malformed — verified manually, untested). Fix: add 16d, 16e.
- **F3 MINOR** — the dispatch-hooks README omits the new conditional entirely. Fix:
  one parity line.
- **Survived the attack:** the conditional re-guards with `isObj`/`isArray` (no throw
  on malformed groups); counts `agents.length`, not `n` (a lying `n` is already
  rejected); empty/whitespace global caught twice; close rows unaffected
  (`anti_bias_global` rejected as unknown key on close); emission only when non-null;
  battery 76/76.
- **Dissent:** predicts the fidelity attacker escalates F1 to MAJOR as a
  constitution-text defect undermining deterministic gate narration. (It did.)

## [BAN] Banach, Stefan — attacker, ownership/reference-integrity lens

- **F1 CRITICAL** — review skill: "groups run in declared order" (stale after D1).
- **F2 CRITICAL** — router skill step 3: "run groups sequentially in declared order"
  (stale after D1; router is the single owner of universal law, read by every type).
- **F3 MAJOR** — research skill: "the only LIVE type under constitution v0.5.2" —
  stale since the review promotion.
- **F4 MAJOR** — `vault/discovery/anti-bias-vector-composition/validator-check.md`
  (exists on disk; last_updated 2026-05-26) operates on the pre-v0.5.2 schema
  (`dispatch.yaml` spec files, a `composition` block of `layers[]`, the retired
  `evaluator` role) — yet constitution P5/§9-D2 delegates anti-bias semantics to it.
- **F5 MAJOR** — constitution §6 skeleton comment still lists `review` as FORECAST.
- **F6 MINOR** — README's "the ledger is currently untracked by git" is a silent-rot
  current-state claim.
- **F7 MINOR** — register-dispatch SKILL twice says `invoked_by` is "pending a
  one-line constitutional amendment," but the constitution nowhere tracks that item.
- **Zero-finding confirmations:** validator-check.md exists; the router routing table
  correctly lists review LIVE; appender D2 enforcement correct; test §16 consistent.
- **Dissent:** predicts fidelity rates F4 CRITICAL and F6 MAJOR. (Synthesizer held
  both: F4 MAJOR — an enforced gate-side fallback exists; F6 MINOR.)

## [KLE] Kleene, Stephen Cole — synthesizer (draft)

Deduped (BEN-F7=BAN-F2; BEN-F8=BAN-F1), resolved five severity collisions (router/
review staleness → CRITICAL by blast radius; validator-check → MAJOR, fallback
exists; zig-zag readiness → MAJOR, gate cannot be narrated deterministically;
BEN-F2/F4 held CRITICAL — normative self-contradictions are defects regardless of
enforcement), produced the 16-item change-request list and per-artifact verdicts
(constitution FIX, router FIX, review skill FIX, validator delegation FIX, README
KEEP, tests KEEP). Flagged two open items for verifiers: the B2 path question and the
canonical-wording question.

## [GOD] Gödel, Kurt — verifier, textual refutation

All 16 findings **CONFIRMED** against the literal files (decisive quotes per finding;
none refuted, none re-scoped except path corrections). Flag resolutions: the "only
LIVE type" line lives in `.claude/skills/research/SKILL.md` (not the router);
`research/SKILL.md` "How to run" carries the single canonical D1 phrasing the router
and review skills can copy verbatim — with the caveat that it does not itself name the
zig-zag opening turn (so it does not resolve the A3 ambiguity on its own).
**Dissent:** predicted the executable verifier would refute A3 (a scheduler would bind
the opening turn to `from`) and treat A2 as non-executable.

## [BEL] Bell, John S. — verifier, executable refutation

All code/test findings **CONFIRMED by execution** (temp roots only; real ledger
verified untouched): (F1) 1-fanout + 3 singletons, no global → exit 0 (gap real,
behavior correct); (F2) malformed second group → clean exit 2 on the agents error, no
crash, no spurious global error; (F3) battery 76/76; close row carrying
`anti_bias_global` → exit 2 unknown-key; whitespace global → exit 2 twice-caught;
(F4) nonsense axes/clone angles/"vibes" global → **exit 0** — proving the four-test
rule has zero executable enforcement, exactly as the enforcement split declares.
**Dissent:** predicted the textual verifier would reframe F4 as by-design layering
rather than a defect — which matches the synthesizer's treatment (the CR is to state
the split in §9, not to add appender enforcement).
