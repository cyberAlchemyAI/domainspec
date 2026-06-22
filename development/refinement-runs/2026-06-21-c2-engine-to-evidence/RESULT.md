---
node_type: refinement-result
title: Refine Result — C2 Engine-to-Evidence
status: flag
created: 2026-06-21
owner: refine
run_id: 2026-06-21-c2-engine-to-evidence
---

# Refine Result — C2 Engine-to-Evidence

- **Status: FLAG** — a clear, ordered, non-executed plan emerged, but the panel surfaced load-bearing residue: the current financial-settlement PASS is **partly concept-presence-only** (non-injective folds), and "closing auth" is **part bridging + part genuine new derivation**, not pure convention drift. Honest path forward is sequenced below.
- Preset: full · Research: research-if-gap-appears (no external gap triggered).
- 4 tensioned subagents, all receipts in `stages/`. The Architect↔Skeptic axis did real work.

## 1. The two headline findings

1. **The engine currently works on the _minority_ convention.** (Architect) The 7 poker-team TEST-SPECs use two oracle dialects: `rv-ct` (per-category tables, globally-unique ids — financial-settlement, player-onboarding: **2/7**) which the engine PASSES, and `column-typed` (flat table, `AUTH-RULE-001` ids restarting per operation — auth, player-makeup, player-management, player-progression, player-stats: **5/7**) which it FAILS. The work unit is "make `column-typed` round-trip **as a class**," not "fix auth."

2. **The passing gate is not yet honest enough to carry C2.** (Skeptic) The round-trip's WF/QT/MT **concept-bucketing is non-injective**: 5 distinct workflow steps (`WF-1..WF-5`) collapse to one key `workflow:settlementworkflow`. A δ regression that drops steps 2–5 would still PASS — the financial PASS _depends_ on this fold. And of auth's 30 misses, **~16 are convention drift but ~12+ are genuine δ gaps** (the engine emits _nothing_ for `error:auth-err-*` and consumer-side `event:*`). The Architect's "pure convention drift" framing is overstated; the Skeptic's equivalence-class probe is adopted.

## 2. Resolution of the central tension (honest PASS rule)

A round-trip PASS counts as C2 evidence only under these **honesty invariants** (Skeptic, adopted):

- **INV-1 Injectivity** — no normalization maps two _distinct_ human obligations to one key (case-expansions OK; distinct source rows not). → forces splitting WF/QT/MT bucketing.
- **INV-2 Totality** — every committed row produces a key (no silently skipped rows).
- **INV-3 Falsifiability** — a **negative control** must prove the gate CAN report MISSING: inject a sentinel obligation the engine can't derive → assert `pass===false`; delete a required engine key → assert it surfaces MISSING. **No feature PASS may be reported unless the negative control passes.**
- **INV-4 No per-feature tuning** — bridging knobs selected by a _dialect signature derived from the docs_, never by feature name.
- **INV-5 Symmetric folds** — every fold is the same function on both sides, tested both directions.

This is the line between _general deterministic derivation_ and _gate-tuned-to-oracle_. It **reorders the plan**: harden the gate's honesty BEFORE generalizing bridging to pass more features.

## 3. DEC-TDE-SEMANTIC-RIGOR-001 — resolved (SPLIT)

- **ACCEPT** operation-bucketing for postconditions (op-bucket keeps distinct operations distinct — auth's 5 post rows → 5 keys).
- **REJECT** concept-bucketing for WF/QT/MT as the permanent answer (non-injective). Require **per-row tokens upstream** (the oracle embeds `WF-/QT-/MT-` ids) → bump `GAP-TDE-POSTCONDITION-IDS-001` from low to **medium**. Until then, the financial PASS is **caveated as concept-presence-only** for those categories.

## 4. General bridging design (Architect, adopted with Skeptic guardrails)

- **Dialect descriptor** `oracle.dialect.yml` per feature, every field **defaulting from table structure** (no engine feature-name branches): `id_scope` (global vs per-operation), `concept_aliases` (preferably by structural prefix-uniqueness, e.g. `Session ⊑ SessionLifecycle`), `transition_identity`, `event_bucket`, `error_category`. Honors INV-4.
- **Delete the hardcoded `MAKEUP_CALC_IDS=["c4"]` overfit** (an existing teach-to-the-test smell) — bridge by the `needs_formal` property instead.
- **Corpus PASS bar:** 4/5 `column-typed` features + 2/2 `rv-ct` anchors clean (deliberately not 5/5 — keeps the last feature an untuned holdout).

## 5. "Closing auth" is two different kinds of work (reconciled)

| Auth miss class                             | Count (approx) | Kind              | Fix                                                     |
| ------------------------------------------- | -------------- | ----------------- | ------------------------------------------------------- |
| entity-name drift, transition keying        | ~16            | convention drift  | general bridging (§4)                                   |
| `error:auth-err-*`, consumer-side `event:*` | ~12+           | **genuine δ gap** | **new δ rules** — the engine derives nothing here today |

So the corpus-generalization gate needs _both_ dialect bridging _and_ new derivation rules (error-obligation rule, consumer-event rule). This is real engine work, not just identity recovery.

## 6. emit_tests runnable bodies → E3 (Architect, adopted)

- **Tournament winner: hybrid** = assertion-from-`Formal`-expression (core) + property-based/fast-check (invariant fallback). **Rejected:** golden-trace (reads the impl to author the oracle → circular, proves nothing about _spec_ derivation); spec-level mutation (never runs against poker-team code → fails E3's construct).
- **Two engine gaps block real bodies:** (1) `Obligation` carries no impl binding (no module/symbol/arg-shape); (2) `Formal` is a verbatim string — `classifyFormal` extracts only a case _count_. Fix with a committed **`bindings.json`** that declares _which_ function each obligation targets (NOT the expected answer — keeps generation pure) + a `Formal` AST parse.
- **Deterministically derivable today (~12 real cases):** simple/ternary calculations (deal split), RANGE invariants (date boundaries), COUNT_CAP (dedup), pure postconditions. **Needs human fixtures → emit `it.skip` + `coverage_gap`, never fake:** `exists()` rules, aggregate/bare-call calcs incl. **the makeup-policy math itself** (auto-deriving it = re-implementing the code in the test), transitions, contracts, events, workflows.
- **E3 reframe:** Stryker (vitest-runner, version-spiked first) scoped to the verified-pure `src/domain/**`; engine emits into isolated `__derived__/`. This **resolves the prior contamination** finding — the emitted suite is regenerated by code from `(spec+Δ+binding)`, never edited, genuinely distinct from the in-repo `*.test.ts` (which become the manual-control arm). Honest framing: "deterministic-emitter vs agent-implementer," not "spec vs no-spec."

## 7. Experiments reframed (Cartographer, adopted)

- **E1a** — δ-determinism is now a property test; residual empirical question = **extraction quality**: recall/precision vs a hand-built gold `G` per feature, benign-edit invariance (whitespace/reorder/rename leave `obligation_key` set byte-identical; semantic edits change it by the predicted delta), transparent `needs_formal` failure. Drop Jaccard=1.0.
- **E2** — engine output vs ≥3 **non-author** blind testers, committed TEST-SPECs quarantined; **mutation score (E3) load-bearing**, count/traceability descriptive; rubric + test-equivalence relation + κ ≥ 0.6.
- **E3** — Stryker on `src/domain/**`, engine-emitted runnable tests vs clean-room manual control; two-rater survivor/equivalent classification, equivalent mutants excluded from denominator; pilot-then-calibrate (drop the brittle `=0`/`≥70%` bars to descriptive).
- **Tooling delta (engine exists):** ELIMINATES T1 (engine IS the obligation extractor), T3-as-experiment (δ byte-stable), T5 session orchestration, T6 bare-LLM control; SHRINKS T2 to an `engine_commit` + doc hasher. NET-NEW: T7/T8 manual rig, T9 Stryker, T11 classifier, T13 prereg freezer, and **the emit_tests body work** (the one engine-side unblocker). T4/T12 reuse the E6/E9 shape.

## 8. The plan — ordered phases (non-executed)

Honesty before generalization before experiments.

| Phase                           | Work                                                                                                                                                                                  | Closes                                 | Gate                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| **P1 Honesty foundation**       | negative-control guard (INV-3) in the round-trip suite; split WF/QT/MT bucketing to per-row identity (INV-1) — accept it makes financial PASS _temporarily_ show real WF/QT/MT misses | makes the gate falsifiable + injective | negative control proves gate can FAIL; financial misses are now honest |
| **P2 General bridging + new δ** | dialect descriptor (§4); delete MAKEUP_CALC overfit; **new δ rules** for error-obligations + consumer-events (§5)                                                                     | `BLK-TDE-AUTH-CONVENTION-001`          | 4/5 column-typed + 2/2 anchors PASS _under P1's honest gate_           |
| **P3 Corpus gate**              | run round-trip across all 7; document irreducible residue                                                                                                                             | `GATE-TDE-CORPUS-GENERALIZATION-001`   | corpus PASS bar met                                                    |
| **P4 emit_tests bodies**        | `bindings.json` + Formal AST + hybrid emitter; ~12 real cases, rest `coverage_gap`                                                                                                    | `GAP-TDE-EMITTESTS-BODIES-001`         | emitted suite runs green; coverage gaps reported                       |
| **P5 Experiments**              | pre-register (freeze `engine_commit`) → E1a → Stryker+E3 → E2                                                                                                                         | C2 evidence                            | results in `docs/research/results/`                                    |

**Dependency order:** P1 → P2 → P3 → P4 → P5. E1a can start after P3 (needs only the engine); E3 waits on P4; E2 pass/fail waits on E3 (descriptive axes parallel with E1a).

## 9. Residue ledger

- **R-C2-1 (load-bearing):** the financial-settlement PASS is concept-presence-only for WF/QT/MT until P1 (injectivity) + upstream per-row ids land. Do not cite it as full per-obligation C2 evidence yet.
- **R-C2-2 (reconciled disagreement):** Architect saw auth misses as convention drift; Skeptic proved ~12+ are genuine δ gaps. Adopted the Skeptic's stricter reading — P2 includes new δ rules, not just bridging.
- **R-C2-3 (honesty gate is mandatory):** no feature PASS is reportable without the negative control (INV-3). This must land first (P1).
- **R-C2-4 (reproducibility key):** `engine_commit` (+ doc SHAs) is the authoritative reproducibility key; there is no canonical `domainspec_version`. No experiment pre-registers against an uncommitted engine.
- **R-C2-5 (makeup-policy hole):** the makeup-policy arithmetic cannot be auto-derived without re-implementing it; it stays a declared `coverage_gap`, honestly reported, not faked.

## 10. Recommended next routes

- `task-session` per phase, starting **P1** (honesty foundation — smallest, unblocks honest measurement of everything else).
- Update the engine Craft ledger: close `BLK-TDE-COMMIT-DISCIPLINE-001` (done — committed/pushed); resolve `DEC-TDE-SEMANTIC-RIGOR-001` (§3); add P1's injectivity + negative-control as the next blocker; record the corpus-dialect-minority finding.
- Optional later: an upstream `domainspec-spec-feature` change to embed per-row WF/QT/MT ids in the oracle (R-C2-1).
