---
node_type: refinement-stage
role: E3 Mutation Attacker
created: 2026-06-12
---

# E3 Mutation Testing — Adversarial Teardown

**Claim under attack:** C2 — "derived tests catch real faults", operationalized by E3 as Stryker mutation testing on the poker-team TypeScript backend, success-gated on `mutation_score_derived ≥ 70%`, `≥ mutation_score_manual` for 5/7 features, and `survivors_critical = 0`.

**Verdict:** As written, E3 is **NOT RUNNABLE and NOT SOUND**. Three independent, fatal problems:

1. **The "derived test suite" is a Markdown document, not code.** Derivation emits `TEST-SPEC.md` (a catalogue of ID'd rows), so `mutation_score_derived` cannot be computed until a human/LLM _implements_ the spec into runnable vitest — re-injecting exactly the variability E3 exists to factor out.
2. **Baseline (a) and (b) are the same artifact.** The repo's "manually-written" `*.test.ts` files already carry TEST-SPEC IDs (`RV-5`, `CT-6`, `PC-6`, `ST-6`…) and every `TEST-SPEC.md` is `status: implemented`. There is **no independent manual baseline** — (a) ⊆ (b), so `mutation_score_derived ≥ mutation_score_manual` is a comparison of a set against itself.
3. **Stryker is not installed, not configured, and has zero mutator/runner setup.** The protocol assumes infrastructure that does not exist in the repo.

Below: the evidence, then severity-ranked threats with fixes, then a reframed runnable E3.

---

## 1. The central gap — "the derived test suite" has no runnable referent

`domainspec-generate-tests` (`.agents/skills/domainspec-generate-tests/SKILL.md`) produces:

- `docs/features/{feature}/TEST-SPEC.md` — a traceable catalogue of rows: `| RV-1 | R1: player must exist | Generate with non-existent playerId | domain error |`.
- Optionally, with `--scaffold`, **test stubs** mapped to those rows. Stubs, not assertions.

A `TEST-SPEC.md` row is a _sentence in English_ describing intent and expected outcome. Stryker requires a process that, given a mutated source file, **executes and returns pass/fail**. A Markdown row cannot do this. To get `mutation_score_derived` you must:

```
TEST-SPEC.md (doc) ── human/LLM implements ──▶ runnable *.test.ts ── Stryker ──▶ score
                          ▲
                          └── THIS STEP is the variability E3 claims to eliminate
```

The implementer chooses fixtures, mock shapes, assertion strictness, and which rows they bother to encode. Two implementers of the **same** `TEST-SPEC.md` will produce suites with **different mutation scores**. So `mutation_score_derived` is a property of _the implementer_, not _the derivation_. E3 as written measures the wrong thing and attributes it to C2. **This is the blocker that voids the experiment's construct validity.**

Concrete evidence the implementation step is non-trivial: `financial-settlement/TEST-SPEC.md` lists `CT-5`/`CT-6` ("Makeup: profit applied to debt", "rakeback applied second") as prose formulas ("per ApplyMakeupPolicy formula") — the implementer must reverse-engineer the actual numeric assertion from `operations.md`. That is authoring, not transcription.

---

## 2. CONTAMINATION — baselines (a) and (b) are the same set

E3 step 2 asks to score three disjoint-sounding sets: (a) derived only, (b) **current manually-written test suite (existing tests in repo)**, (c) combined. The premise is that (b) is an _independent_ hand-written baseline that predates or is orthogonal to derivation. **It is not.**

Evidence from `validation/poker-team/backend/src/`:

- `src/domain/settlement/settlement.service.test.ts` contains tests literally tagged with TEST-SPEC IDs:
  `it("RV-5: includes stats exactly on startDate", …)` — RV-5 is row RV-5 of `financial-settlement/TEST-SPEC.md`.
- 5 test files carry `RV-/CT-/PC-/ST-` IDs; the same IDs appear as rows in the matching `TEST-SPEC.md`.
- **All 7** `TEST-SPEC.md` files are `status: implemented`.
- `financial-settlement/PIPELINE-REPORT.md`: the test/implement stages are `SKIPPED … Completed in prior wave execution`; the suite (51 files, 446 tests) was produced _by the DomainSpec pipeline_, which derives the spec and then implements it.

So the repo tests are **the derived tests, implemented**. There is no second, independently-authored manual suite. Consequences:

- (a) and (b) are not independent → `mutation_score_derived ≥ mutation_score_manual for ≥5/7` is **self-comparison**, trivially true or meaningless.
- (b) is not "manually written" in the sense the success criterion needs (a human writing tests _without_ the spec). The honest baseline — "what would a developer write from the same source docs _without_ DomainSpec derivation" — **does not exist in the repo** and would have to be authored fresh, by a human who has not seen `TEST-SPEC.md`. That tester does not exist and is not budgeted.
- Even the untagged test files were generated in the same pipeline waves, so "untagged ≠ underived" — absence of an ID tag does not make a test an independent manual control.

**This is a blocker:** the comparative arm of E3 (criterion 2) cannot be run on poker-team as-is. The data exists for exactly one suite, and it is the derived one.

---

## 3. Stryker setup reality — nothing is installed

`validation/poker-team/backend/package.json`:

- Runner: `"test": "vitest run"` (vitest `^4.0.18`, coverage-v8).
- **No `@stryker-mutator/*` dependency.** `node_modules/@stryker-mutator` does not exist.
- **No `stryker.conf.*` / `stryker.config.*`** anywhere in the repo.
- **No `vitest.config.*`** at all (Stryker's vitest runner discovers config; absence means extra setup).

What E3 omits that a runnable protocol requires:

- Install `@stryker-mutator/core` + `@stryker-mutator/vitest-runner` and pin versions. **Compat risk (major):** Stryker's vitest runner historically lagged vitest majors; vitest 4.x is recent — the runner may not support it, forcing a vitest downgrade or the `command` runner (much slower, no per-test kill granularity).
- Define `mutate:` globs. **Scope is undefined.** "Backend domain code" — is that `src/domain/**` only (pure, fast, ideal for mutation) or also `src/use-cases/**` (mock-heavy) and `src/infrastructure/http/**` (Fastify routes)? Each choice changes `total_mutants` and the score denominator. The protocol must pin globs per feature.
- Per-feature isolation. E3 reports `feature_id`, but the codebase is organized by domain concept (`src/domain/settlement/`, `src/use-cases/financial-settlement/`), not by the 7 doc-features. Mapping `feature_id → mutate globs + test globs` is unspecified and non-trivial (e.g., `financial-settlement` touches `domain/settlement`, `domain/deal`, `domain/makeup`).
- Test-runner config: which `*.test.ts` constitute "the derived suite" vs "manual" — **impossible**, see §2.
- CI time / timeout. Mutation runs are O(mutants × test-suite-time). 446 tests × hundreds of mutants per feature is minutes-to-hours; `dryRunTimeoutMinutes`, `timeoutMS`, and concurrency are unset. The EXPERIMENTS.md estimate "~4 hours (needs Stryker setup)" almost certainly understates a from-scratch install + 7-feature run + classification.

**Good news (the one thing that works):** domain code is **pure** — `grep` over `src/domain/**` shows no `repository`/`drizzle`/`postgres`/`db` imports; use-case tests mock repositories via `vi.mock`. So the code **is** unit-testable in isolation; DB coupling is _not_ a blocker for the `src/domain/**` slice. Restrict mutation scope to `src/domain/**` and the runner story is clean.

---

## 4. "survivors_critical = 0" — subjective, post-hoc, unfalsifiable

E3 classifies survivors as trivial / moderate / **critical (business rule violation)** and gates on `survivors_critical = 0`. Problems:

- **No rubric, no rater, no inter-rater check.** Who decides a surviving mutant is "critical"? The experiment author — who is also the spec author and the test implementer (§1–2). A single conflicted rater classifying _after seeing which mutants survived_ is textbook post-hoc rationalization.
- **The gate is gameable both directions:** any embarrassing survivor can be relabeled "trivial"; any safe survivor can be labeled "moderate" to look rigorous. With no pre-registered rubric the classification is unfalsifiable.
- **`= 0` is brittle against equivalent mutants** (see §5): one equivalent mutant that happens to sit on a business rule makes the criterion permanently unmeetable, regardless of test quality.

This is a **major** flaw — the most paper-citable success criterion ("all business-rule mutants caught") is the least objective.

---

## 5. The 70% threshold and the equivalent-mutant problem

- **`mutation_score ≥ 70%` is asserted, not justified.** No citation, no pilot, no relation to the code's mutant population. 70% is a folk number; for pure arithmetic domain code (settlement math) a well-derived suite should clear 85–95%, making 70% a trivially-passed strawman; for branch-heavy policy code it may be optimistic. A single global threshold across 7 heterogeneous features is arbitrary.
- **Equivalent mutants inflate survivors and cap the achievable score.** Stryker cannot detect semantically-equivalent mutants (e.g., `>=` → `>` where the boundary is unreachable, or arithmetic that no input distinguishes). These are **unkillable by any test**, so they sit permanently in the survivor pile, depress `mutation_score`, and — worse for E3 — can land on a "business rule" line and break `survivors_critical = 0` forever. The protocol has **no equivalent-mutant exclusion step**, so the denominator is wrong and the critical-survivor gate is unsound. Standard practice: report `mutation_score` over _non-equivalent_ mutants, with manual equivalence adjudication logged.

**Major.**

---

## 6. Missing operational steps (the protocol is a sketch, not a runbook)

E3 names columns but omits the machinery to fill them:

- **scaffold→runnable pipeline:** how `--scaffold` stubs become asserting tests; who, with what fixtures.
- **baseline definition:** what (b) _is_, given §2. Must be redefined or dropped.
- **classification rubric:** pre-registered trivial/moderate/critical definitions + examples + second rater.
- **JSONL capture:** E3 has no `data/E3-*.jsonl` schema; EXPERIMENTS.md mandates append-only JSONL with the metadata block (`run_id`, `domainspec_version`, `model`, `system_prompt_hash`, `feature_id`, `operator`) — none specified for E3. Stryker emits a JSON report; the protocol must map Stryker output → required JSONL rows.
- **per-feature runner config:** `feature_id → {mutate globs, test globs}` table (does not exist).
- **metadata:** Stryker version, mutator set (default vs custom), vitest version, machine, wall-clock — none captured.

**Major** (collectively): without these the run is irreproducible and the data unauditable.

---

## 7. Engine vs LLM — and how the deterministic-engine end goal reshapes E3

The deepest issue is _what does the derivation_. Today `domainspec-generate-tests` is an **LLM agent** (`agent: domainspec-test-designer`) emitting a **document**, then a _second_ LLM/human implements it. C2 ("derived tests catch real faults") implicitly claims a property of _derivation_, but E3 actually measures a property of _implementation-of-derivation-output-by-an-agent_. That gap is §1.

**If the engine becomes fully deterministic and emits runnable test code directly** (not a `TEST-SPEC.md` that someone transcribes), the picture changes decisively:

- The implementation-variability step (§1) **disappears** — there is one canonical runnable suite per spec, so `mutation_score_derived` becomes a deterministic function of the spec + the engine version. E3 becomes a clean, reproducible measurement.
- Contamination (§2) becomes _avoidable by construction_: regenerate the derived suite into a clean directory from specs alone; the human-authored control can be collected separately and never mixed.
- Stryker's "derived suite" gets an unambiguous referent: the engine's emitted `*.test.ts`.

**Recommendation:** E3 should be **explicitly gated on the engine emitting runnable tests**, or, until then, E3 must report itself as measuring "agent-implemented derived tests" and treat implementation as a documented, hashed, single-pass artifact — not silently fold it into "derived." Right now E3 overclaims.

---

## 8. Threats, severity-ranked

### BLOCKERS (E3 cannot run / is unsound as written)

| #   | Threat                                                                                                                                                                                                      | Fix                                                                                                                                                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | Derived suite is a doc, not code; `mutation_score_derived` needs an implementer who re-injects the variability E3 claims to remove (§1).                                                                    | Gate E3 on engine-emitted runnable tests **or** define implementation as a single pre-registered, hashed pass and rebrand the metric "agent-implemented-derived." Pin model/temp/prompt-hash in JSONL.                       |
| B2  | Baselines (a) and (b) are the same set — repo tests already _are_ the implemented derived tests (TEST-SPEC IDs in `*.test.ts`, all specs `status: implemented`); no independent manual control exists (§2). | Either drop the comparative criterion, or collect a _fresh_ manual baseline from a developer who reads only the source docs (`operations.md` etc.), never `TEST-SPEC.md`. Regenerate the derived suite into an isolated dir. |
| B3  | Stryker not installed, no config, no mutate/test globs, no per-feature runner map (§3, §6).                                                                                                                 | Add `@stryker-mutator/core` + vitest-runner (pin versions; verify vitest 4.x support or downgrade), commit `stryker.conf.json`, author the `feature_id → globs` table, scope `mutate` to `src/domain/**`.                    |

### MAJORS

| #   | Threat                                                                                                              | Fix                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | `survivors_critical` classification has no rubric, single conflicted post-hoc rater (§4).                           | Pre-register trivial/moderate/critical definitions with worked examples; require a second independent rater; log Cohen's κ. Classify before seeing scores where possible. |
| M2  | Equivalent mutants inflate survivors, depress score, and can make `survivors_critical = 0` unmeetable forever (§5). | Add a manual equivalence-adjudication step; report score over non-equivalent mutants; exclude adjudicated-equivalent survivors from the critical gate (log them).         |
| M3  | `≥ 70%` threshold unjustified and uniform across 7 heterogeneous features (§5).                                     | Pilot one feature to set an evidence-based threshold; or report per-feature scores descriptively and drop the hard global gate, or justify 70% with a citation.           |
| M4  | vitest 4.x ↔ Stryker vitest-runner compatibility unverified (§3).                                                   | Spike the runner on `src/domain/settlement/**` first; if unsupported, downgrade vitest in an isolated experiment branch or use the command runner with documented cost.   |
| M5  | No JSONL schema / metadata for E3 despite EXPERIMENTS.md mandate (§6).                                              | Define `data/E3-mutation.jsonl` row schema mapping Stryker JSON → required columns + metadata block; capture Stryker/vitest versions and wall-clock.                      |

### MINORS

| #   | Threat                                                                                                              | Fix                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| m1  | "backend domain code" scope ambiguous (domain vs use-cases vs http) (§3).                                           | Pin scope to `src/domain/**` (pure, fast); optionally a second run over `src/use-cases/**`. |
| m2  | `feature_id` (doc) ≠ code directory; one feature spans several `src/domain/*` dirs (§3).                            | Publish the explicit feature→dir map (e.g., financial-settlement → settlement+deal+makeup). |
| m3  | EXPERIMENTS.md "~4 hours" underestimates from-scratch install + 7-feature run + dual-rater classification (§3, §6). | Re-estimate: ~1–2h setup, ~0.5–2h/feature run, ~2–3h classification.                        |
| m4  | Stryker `concurrency`/`timeoutMS` unset → flaky or runaway CI.                                                      | Set explicit concurrency and timeouts in committed config.                                  |

---

## REFRAMED E3 (runnable)

**Scope to the pure slice and make the derived suite a code artifact, not a document.** Restrict mutation to `src/domain/**` (verified pure: no DB imports, fast, deterministic). Treat "derived" as a _regenerated_ runnable suite written into an isolated directory either by the deterministic engine (preferred end-state) or by a single pre-registered, prompt-hashed agent pass over the `TEST-SPEC.md` rows — never the contaminated in-repo tests. Define a real control: a manual suite authored by a developer who reads only the source aspect docs and never sees `TEST-SPEC.md`. Install and commit `@stryker-mutator/core` + the vitest runner (version-verified), a `stryker.conf.json` with per-feature `mutate`/`test` globs from a published `feature_id → src/domain/*` map, and an explicit equivalence-adjudication step so the survivor denominator excludes unkillable mutants.

**Then measure honestly.** Report per-feature `mutation_score` over non-equivalent mutants for {regenerated-derived, manual-control, combined}, capture every run to `data/E3-mutation.jsonl` with the mandated metadata block plus Stryker/vitest versions, and classify survivors against a _pre-registered_ trivial/moderate/critical rubric scored by two independent raters with logged agreement — dropping the brittle global `=0` / `≥70%` gates in favor of descriptive per-feature evidence until a pilot justifies thresholds.
