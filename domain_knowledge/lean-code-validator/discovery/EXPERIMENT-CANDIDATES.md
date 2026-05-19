# Experiment Candidates — lean-code-validator (v3)

## Objective

This document lists concrete, runnable experiments that would validate (or invalidate) the hypotheses in HYPOTHESES.md and resolve the pending decisions in PROJECT-DECISIONS.md before they become commitments. Each experiment has a clear cost, a clear success/failure signal, and a named decision or hypothesis it pressure-tests.

## How to read

Each experiment has:
- **Hypothesis / decision tested**: the H or D it addresses.
- **Setup**: what we'd build or measure.
- **Effort**: rough cost (hours / days).
- **Success signal**: observable that confirms.
- **Failure signal**: observable that invalidates.
- **Verdict update**: what changes in PROJECT-DECISIONS.md or HYPOTHESES.md depending on outcome.

---

## EX1 — Grade the 6 in-repo specs

**Hypothesis tested**: H1 (predicates sufficient), H2 (obligations approximate intent), H3 (paperBaseline covers all)

**Setup**: ship Steps 1–3 of v3 build sequence (canonical σ + parser additions + grader). Run the grader against all 6 in-repo specs:
- zagr-marketplace
- order-management
- inventory-management
- payment-processing
- user-account
- ccb-matching-experiment

For each spec, capture: profile resolution, per-predicate grade, full Finding list. Then have the operator (or a spec author) triage each `WARN` and `FAIL` as: **legitimate** (real gap), **debatable** (judgment call), or **dismissed** (false positive).

**Effort**: 2–3 days (build sequence Steps 1–3) + 0.5 day (triage).

**Success signal**: ≥80% of emitted findings are *legitimate* or *debatable*; ≤20% *dismissed*.

**Failure signal**: ≥40% *dismissed*. The obligation table is too aggressive.

**Verdict update**:
- Pass → H2 confirmed; lock current obligation table; advance to Step 4.
- Fail → H2 weakened; rewrite the most-dismissed obligations into `WARN`-only or remove; reopen D11 calibration.

---

## EX2 — Detect cross-feature edges in zagr-marketplace

**Hypothesis tested**: H3 (paperBaseline covers all)

**Setup**: extend the parser to recognize `**Cross-feature edge:** produces-for → feature.EntityName` syntax (currently treated as text). Run parser on zagr-marketplace and check whether any R_CF edges surface.

**Effort**: 0.5 day (parser change) + 0.25 day (run + analyze).

**Success signal**: zagr-marketplace produces R_CF edges (e.g., `produces-for` to `dlocal-integration.DLocalUserAccount`). H3 is **disconfirmed** — zagr-marketplace is `compositionExtension`, not `paperBaseline`. This is a *good* failure: we now have a real R_CF test case.

**Failure signal**: zero R_CF edges surface. H3 holds. zagr-marketplace stays `paperBaseline`.

**Verdict update**:
- R_CF found → update zagr-marketplace's frontmatter to `profile: composition-extension`; document as the test case for D6.
- None found → confirm H3; R_CF remains unexercised in v3, flag as "needs a real composition spec to test."

---

## EX3 — Self-grade v3's own SPEC.md

**Hypothesis tested**: H7 (self-application feasible)

**Setup**: write v3's own SPEC.md + aspect files using the spec-writer stage (after PROJECT-DECISIONS resolves). Run `audit_richness.py` on it. Run v3's grader on the parsed result. Inspect the report.

**Effort**: 1 day (write SPEC.md and aspects) + 0.25 day (parse + grade + analyze).

**Success signal**: parser succeeds without errors; grader emits `pass` on overall, with `WARN`s only on entries the operator agrees are real (e.g., "this was deferred to v4").

**Failure signal**: parser fails to parse SPEC.md (the validator can't handle its own format); or grader emits `fail` on a predicate that the operator considers a parser/grader artifact rather than a real spec issue.

**Verdict update**:
- Pass → H7 confirmed; ship the self-application story in PROJECT-OVERVIEW Goal #5; use it as the v3 "demo".
- Fail → drop H7 from Goals; document as "framework gap surfaced by self-application," report upstream.

---

## EX4 — Determinism check across machines

**Hypothesis tested**: H6 (`native_decide` is deterministic for our use)

**Setup**: run grader on all 6 specs on three machines (operator's Mac, a Linux CI runner, a clean Docker container). Diff the `Repr` output of each `CodegenReadinessReport`.

**Effort**: 0.5 day (containerization + CI runner setup) + automation only thereafter.

**Success signal**: byte-identical `Repr` output across all three environments.

**Failure signal**: any divergence — even in Finding message strings or list ordering.

**Verdict update**:
- Pass → H6 confirmed; add as a permanent CI check.
- Fail → identify divergence source (Lean version, locale, `List` ordering); pin or normalize; rerun.

---

## EX5 — First real production spec

**Hypothesis tested**: H1, H2, H4 (cross-cutting risk: 6 examples may not be representative)

**Setup**: identify one real production spec (not in `examples/`) — owned by a team that uses DomainSpec for actual delivery. Run the parser + grader against it. Compare findings distribution to the 6-example baseline.

**Effort**: 0.5 day (spec acquisition + parser run) + variable (depends on team size).

**Success signal**: findings distribution within 1.5× the dismissal rate of the 6-example baseline; no entirely new failure modes.

**Failure signal**: findings distribution drastically different (e.g., 60%+ dismissals); or entirely new failure modes (parser crashes, grader emits findings the author can't interpret, etc.).

**Verdict update**:
- Pass → cross-cutting risk in HYPOTHESES.md is mitigated; v3 generalizes.
- Fail → calibrate against production patterns, not example patterns. Possibly major v4 redesign.

---

## EX6 — Parser noise audit (R_U fallback)

**Hypothesis tested**: H4 (R_U edges stay quiet)

**Setup**: instrument the parser to log every edge inferred via σ-fallback (lines 384–390 of `audit_richness.py`). Run on all 6 specs + the production spec from EX5. Count: how many fallback edges match R_U names (`composes`, `wraps`, etc.) spuriously?

**Effort**: 0.25 day (parser instrumentation) + 0.25 day (run + count).

**Success signal**: zero (or ≤1 per spec) spurious R_U fallback matches.

**Failure signal**: ≥3 per spec spurious R_U fallback matches. Parser's σ-fallback is too greedy on R_U vocabulary.

**Verdict update**:
- Pass → H4 confirmed; v3's "empty σ → WARN" stays.
- Fail → tighten σ-fallback in `audit_richness.py` to ignore R_U edge names entirely; or change v3 to silently drop unsigned-edge findings (less honest but quieter).

---

## EX7 — Multiplicity probe (P6 candidate)

**Hypothesis tested**: H1 counter-position (P1–P5 might miss multiplicity)

**Setup**: pick 3 of the 6 specs that grade `pass` on EX1. Manually walk a code generator through each (mental simulation): for every Operation, ask "does the spec say *how many* Events it produces?" Count cases where the answer is "no, has to guess."

**Effort**: 1 day (manual walkthrough across 3 specs).

**Success signal**: ≤2 multiplicity guesses across 3 specs. Multiplicity is rare enough that P6 is deferable.

**Failure signal**: ≥10 multiplicity guesses across 3 specs. P6 is necessary; H1 fails.

**Verdict update**:
- Pass → H1 holds (for now); revisit if any production spec changes the picture.
- Fail → add P6 to the predicate list; requires parser extension to extract field cardinality (currently only counts are extracted, not cardinality of edge sets).

---

## EX8 — Integration smoke test with `domainspec-readiness-gate`

**Decision tested**: D9 (integration with readiness-gate)

**Setup**: build a minimal JSON emitter for v3 (`toJson : CodegenReadinessReport → String`). Wire it into a mock `domainspec-readiness-gate` invocation that consumes the JSON and folds the grade into its overall verdict. Run end-to-end on zagr-marketplace.

**Effort**: 1 day (JSON emitter) + 0.5 day (mock integration).

**Success signal**: readiness-gate cleanly consumes v3 output; verdict aggregation works as expected; no schema disagreements.

**Failure signal**: schema mismatch (readiness-gate expects fields v3 doesn't emit, or vice versa); or the integration surface is awkward (e.g., readiness-gate wants pass/fail, v3 emits warn — semantics don't compose).

**Verdict update**:
- Pass → resolve D9 in favor of integration; resolve D8 in favor of JSON output.
- Fail → keep v3 standalone (D9 stays "pending" or moves to "decided: standalone"); document the integration gap for the methodology owner.

---

## Sequencing recommendation

If only some experiments can run, this is the priority order:

1. **EX1** (grade the 6 specs) — single highest-value experiment; resolves H1, H2, H3, and feeds D11 calibration. Should be the first thing run after Steps 1–3 of build sequence ship.
2. **EX2** (R_CF detection) — cheap, high-information; gives v3 a real composition test case.
3. **EX4** (determinism) — cheap; should run as a permanent CI check from day one.
4. **EX6** (R_U noise audit) — cheap; resolves H4 and guides D12.
5. **EX5** (production spec) — high-value but depends on identifying a willing team. Schedule as soon as one is available.
6. **EX3** (self-grade) — moderate effort; the meta-bootstrap proof point. Schedule after spec-writer stage produces v3's SPEC.md.
7. **EX7** (multiplicity) — moderate effort; only urgent if EX1 surfaces multiplicity gaps.
8. **EX8** (readiness-gate integration) — defer until at least one team has used v3 standalone for a quarter (per D9 trigger).

EX1 + EX2 + EX4 + EX6 together cost ~4 days and resolve the highest-stakes hypotheses. They should run as a tight first sprint after build-sequence Steps 1–3 land.
