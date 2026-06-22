---
node_type: refinement-stage
role: Experiments Cartographer
created: 2026-06-21
tags:
  [
    research,
    experiments,
    c2,
    engine,
    measurement,
    pre-registration,
    test-derivation,
  ]
layer: application
nature: analysis
status: active
version: 0.1.0
---

# Experiments Cartographer — C2 from Engine to Evidence (E1a / E2 / E3)

NON-EXECUTED. This stage maps and reframes the C2 experiment protocols now that a
**deterministic engine exists** (`tools/test-derivation-engine/`), not just an LLM
derivation agent. The engine changes what each experiment can prove. It does not run
the experiments; it specifies what to build, in what order, and what each run proves.

**The single fact that re-bases everything:** the engine is real and its L0 round-trip
gate **PASSES** for `financial-settlement` over the full 7-doc input — `MISSING = 0`,
`tsc 0`, `33/33` vitest, byte-identical across consecutive runs (δ determinism by
construction). A second feature (`auth-access-control`) parses cleanly (108 obligations,
0 violations) but its round-trip **FAILs (honest)** at 30 missing / 25 extra — and the
report localizes every miss to **oracle-convention drift**, not a δ defect. `emit_tests`
emits one runnable `it.todo` per `obligation_key` but the **test bodies are stubs**
(`GAP-TDE-EMITTESTS-BODIES-001`). See `L0-ROUNDTRIP-REPORT.md` and the engine
`.craft/ledger.yml`.

This is the dividing line between the 2026-06-12 cluster (which planned _for_ an engine)
and this run (which validates _the_ engine).

---

## 0. What the engine moved (the reframe in one table)

| Original claim under test                                           | Pre-engine status (2026-06-12)                                                 | Post-engine status (now)                                                                                                                                                                                                    |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| δ is deterministic (E1, C2 §5.1)                                    | unprovable on an LLM; Jaccard<1.0 is the honest expectation; contradicts Def-4 | **TRUE BY CONSTRUCTION** — a property test (`derive(docs)==derive(docs)` byte-for-byte), already demonstrated byte-stable at L0. Not an experiment.                                                                         |
| `obligation_key` = sha1(source_anchor\|rule_type\|canonical_params) | a thing the cluster proposed _building_ (ledger T1 extractor)                  | **SHIPPED inside the engine** — the engine IS the obligation-key extractor. T1 collapses for engine output.                                                                                                                 |
| "same spec → same tests" residual question                          | "extraction/parser completeness," but no parser existed                        | parser exists and is pure; residual question is now **(a) recall vs gold G, (b) benign-edit invariance, (c) transparent failure** — all of which the engine _enables measuring_ but does not itself guarantee. This is E1a. |
| derived-vs-manual (E2)                                              | LLM-output vs human, with author-contaminated baselines                        | **engine-output vs human**, baselines still need quarantine + non-author testers. Mutation score (E3) is load-bearing; count/traceability descriptive.                                                                      |
| mutation (E3)                                                       | no runnable derived tests at all; no Stryker                                   | engine `emit_tests` emits runnable vitest **scaffolds with stub bodies** — E3 is unblocked _only after_ the emit_tests bodies are real (GAP-TDE-EMITTESTS-BODIES-001).                                                      |

**Net:** the engine converts E1's central claim from an experiment into a unit test, and
moves all remaining empirical risk onto **extraction quality** (E1a), **comparative
effectiveness** (E2), and **fault detection of emitted runnable tests** (E3).

---

## 1. Reframed E1a — Extraction Completeness & Invariance (the only residual E1 question)

**Surface under test:** the deterministic engine's parser+δ (`parse(docs) → G → δ(G) → T`),
not an LLM. Determinism of δ is asserted by property test, not measured here.

**Why E1 collapses and E1a survives.** With δ pure and byte-stable (L0 evidence), the
question "does the same spec produce the same tests?" is a tautology — drop it. The
engine is only as good as the **graph G it extracts from human Markdown**, and extraction
is where ambiguity, malformed tables, and underspecified Formal cells live. The `needs_formal`
escape hatch (counted, surfaced, never guessed — `DEF-TDE-NEEDS-FORMAL-001`) is exactly the
seam E1a must probe.

**Three residual empirical questions (none free from the engine):**

1. **Recall vs a hand-built gold concept-graph G.** For each feature, a human (not the
   engine author) annotates the _intended_ obligations directly from the spec docs into a
   gold set `G_gold` (by `obligation_key`-equivalent semantic identity). Measure
   **recall = |engine ∩ G_gold| / |G_gold|** and **precision = |engine ∩ G_gold| / |engine|**.
   Note: the L0 report already shows the engine emits **legitimate extras** (Cartesian
   invalid-transitions, missing-status contracts) — so precision<1.0 is expected and
   extras must be classified `legitimate-completeness` vs `spurious` by a rater, not auto-failed.
2. **Benign-edit invariance.** Apply semantics-preserving doc edits — whitespace
   reflow, table-row reorder, header rename — and assert the emitted `obligation_key`
   **set is byte-identical** (the engine's keys are order-invariant by construction, so
   this is a strong, cheap test). Then apply a **semantic** edit (add a transition row)
   and assert the key set changes _exactly_ by the predicted delta. This separates "stable
   where it should be" from "responsive where it should be."
3. **Transparent failure on malformed sections.** Feed deliberately malformed/underspecified
   sections (a prose-only invariant, a broken table, a missing aspect doc). Assert the
   engine **deterministically flags** (`needs_formal` count, `lint` exit 4, skipped-doc
   notice) rather than silently guessing. The pass condition is "flagged, counted, surfaced,"
   never "produced a plausible guess."

**Corpus.** The poker-team features with the full aspect-doc set. Anchor on
`financial-settlement` (L0-PASS, the clean case) and `auth-access-control` (the honest-FAIL
case — its 30 misses are a _convention-drift_ stress test for invariance and identity
bridging, `BLK-TDE-AUTH-CONVENTION-001`). Add features toward the corpus-generalization
gate (`GATE-TDE-CORPUS-GENERALIZATION-001`) as their docs reach canonical form.

**Metrics + JSONL schema (one row per (feature × edit-condition × run)):**

```json
{
  "experiment_id": "E1a",
  "run_id": "uuid",
  "timestamp": "2026-06-21T...",
  "prereg_commit": "sha-of-frozen-proposal",
  "engine_commit": "sha-of-engine-tree",
  "feature_id": "financial-settlement",
  "edit_condition": "baseline|whitespace|row-reorder|header-rename|semantic-add|malformed",
  "domainspec_version": "2.1.0",
  "operator": "rater-id",
  "gold_obligation_count": 20,
  "engine_obligation_count": 36,
  "intersect_count": 20,
  "recall": 1.0,
  "precision": 0.555,
  "extras_legitimate": 16,
  "extras_spurious": 0,
  "key_set_sha": "sha256-of-sorted-obligation-keys",
  "key_set_changed_vs_baseline": false,
  "predicted_delta": 0,
  "observed_delta": 0,
  "needs_formal_count": 4,
  "lint_exit_code": 0,
  "flagged_not_guessed": true
}
```

**Pass posture (descriptive, pre-registered, no brittle bars):** recall=1.0 on the
clean corpus is the aspiration but report the distribution; invariance is a **hard
binary** (`key_set_changed_vs_baseline` must be `false` for every benign edit — any
`true` is a defect, not a statistic); transparent-failure is a **hard binary**
(`flagged_not_guessed` must be `true`). Drop the Jaccard=1.0 bar entirely — it is now a
property-test tautology, not an experiment criterion.

---

## 2. Reframed E2 — Engine Output vs Manual, Blinded, Effectiveness-Anchored

**Surface under test:** `D_engine` = the engine's output (`emit_spec` obligations and,
for the effectiveness axis, the runnable `emit_tests` suite once bodies exist) at a pinned
engine commit. The word "deterministic" is now **earned** (engine, not LLM) — no longer a
mislabel. The 2026-06-12 R-TD-1 residue is discharged for the engine lane.

**The two surviving contaminations (engine does NOT fix these):**

- **R-TD-2 (baseline contamination):** the 7 committed `TEST-SPEC.md` are the author's
  derived set and the author has memorized them. Quarantine every `TEST-SPEC.md` from
  every tester's checkout.
- **R-TD-3-ish (author-as-tester):** recruit **≥3 independent testers**, none being the
  DomainSpec/engine author; each blind to D and to each other; onboarded from the spec
  docs only. Author n=1 is invalid evidence.

**Protocol (n, blinding, rubric, κ):**

1. **n:** 7 features × ≥3 testers = ≥21 manual plans (M). Pre-register the tester pool
   and the time policy ("until tester declares done," record `human_time_minutes`; do not
   set an author-tuned 30-min handicap).
2. **Blinding:** separate checkout with `TEST-SPEC.md` quarantined; testers never see D;
   a written blinding SOP committed before run.
3. **Equivalence + rubric:** publish `rubric.md` with a fixed category taxonomy
   {happy-transition, negative-transition, invariant, calculation, postcondition,
   contract, idempotency, event-flow, error-state} and a **test-equivalence relation**
   (two tests are the same iff same spec-element × condition-class). D∩M, D\M, M\D are
   computed over this relation — the engine's `obligation_key` gives D its half of the
   relation for free; M must be hand-keyed by raters.
4. **Inter-rater κ:** ≥2 independent raters classify; report Cohen/Fleiss κ; require
   κ ≥ 0.6 or the comparison is too subjective to publish.

**Metrics:** load-bearing = **mutation score of D_engine vs M vs combined** (via E3) on
the same `src/domain/**` code — **C2 passes iff D_engine kills ≥ as many non-equivalent
mutants as M on ≥6/7 features.** Descriptive (never gating): |D| vs |M|, distinct-behavior
coverage (dedup'd, so count-gaming is visible), Jaccard overlap, and **valid**-traceability
% per cohort (an independent rater confirms each `Source:` anchor actually licenses the
test — % valid links, not % present links, killing the circular M1 from the 2026-06-12 E2
teardown).

**JSONL (one row per (feature × tester)) + a paired (feature) row** carrying the
rater-adjudicated D∩M/D\M/M\D, κ, and the E3 mutation tie-in.

---

## 3. Reframed E3 — Mutation on ENGINE-EMITTED Runnable Tests

**Hard dependency, stated up front:** E3 cannot run until `emit_tests` produces
**real assertion bodies**, not `it.todo`/`expect.fail` stubs (`GAP-TDE-EMITTESTS-BODIES-001`,
severity medium, currently `defer`). The L0 report's `emit_tests` only asserts the
generated sample transpiles with zero TS diagnostics — that proves the suite is _syntactically_
runnable, not that it _asserts_ anything. **A stub suite has mutation score ≈ 0 and would
falsely sink C2.** The emit_tests-bodies work is therefore a blocking prerequisite, owned
by `task-session`, and must complete and be committed before any E3 run.

**Surface under test:** the engine-emitted runnable vitest suite (`D_engine_tests`) vs a
genuine **manual control** suite written by a dev who never sees any `TEST-SPEC.md`. Scope
mutation to the **pure `src/domain/**`\*\* slice (the deterministic majority where emitted
tests have the most claim), keeping the implementer confound out for the mechanical part.

**Tooling:** `@stryker-mutator/core` + the vitest runner, installed and committed in
`validation/poker-team/backend/` (currently absent — only vitest). Verify Stryker supports
the project's vitest version before freezing the proposal.

**Metrics & mutant classification:**

- Per-feature `mutation_score = killed / non_equivalent_mutants` for (a) D_engine_tests,
  (b) manual control, (c) combined.
- **Equivalent-mutant handling is load-bearing** (R-TD-4): two raters classify each
  survivor as `equivalent | trivial | moderate | critical(business-rule)` against a
  rubric tying mutation operators to `operations.md` rules; equivalent mutants are
  **excluded from the denominator**, not counted as survivors. This is why the old
  `survivors_critical = 0` and `≥70%` gates are dropped to **descriptive** until a pilot
  calibrates a defensible bar — `=0` is unachievable in general because of equivalent mutants.

**Gate calibration:** run a **single-feature pilot** (financial-settlement, the L0-PASS
case) first; let the observed score distribution and the equivalent-mutant rate set the
gate, then pre-register the calibrated bar for the remaining features. Pre-register the
two-rater survivor rubric before the pilot.

**JSONL (one row per feature):** `total_mutants`, `equivalent_mutants`,
`non_equivalent_mutants`, `killed_by_{engine,manual,combined}`, `mutation_score_{...}`,
`survivors_{trivial,moderate,critical}`, `engine_commit`, `prereg_commit`.

---

## 4. Measurement tooling — reuse vs new GIVEN THE ENGINE EXISTS

The 2026-06-12 build ledger had 13 units (T1–T13) + "the engine" as the heavy L item.
**The engine is now built**, which dissolves or shrinks several measurement units. Delta:

| 06-12 unit                               | What it was                                                 | Status now that the engine exists                                                                                                                                                                                                                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Engine** (the L product)               | parser→G→δ→obligation_key→emit_spec(+emit_tests)            | **BUILT.** financial L0-PASS, auth honest-FAIL, emit_tests stubs. The product the experiments validate.                                                                                                                                                                                                                        |
| **T1 obligation-key extractor**          | parse TEST-SPEC.md → normalized obligation set              | **MOSTLY SUBSUMED.** For engine output, the engine _is_ the extractor (emits keys directly). Residual-new: a thin reader to parse the **committed/manual** TEST-SPEC.md into the same semantic-identity space (the engine already does this on the oracle side for round-trip — reuse the engine's normalizer, don't rebuild). |
| **T2 input-closure hasher**              | system_prompt_hash over skill+agent+pipeline+CHANGELOG+docs | **SHRINKS / REPURPOSED.** No LLM closure to hash for the engine lane; replace with **`engine_commit` + feature-doc content hash** (engine is pure: code SHA + input SHA fully determine output). Still need a small doc-hasher for E1a edit-conditions.                                                                        |
| **T3 pairwise Jaccard**                  | N-run Jaccard on obligation sets                            | **NEARLY GONE.** δ is byte-stable → run-to-run Jaccard=1.0 by construction (a property test). Repurpose only as the E1a **edit-condition `key_set_sha` comparator** (baseline vs edited), not an N-run stochastic Jaccard.                                                                                                     |
| **T4 JSONL harness + schemas**           | append-only writer, EXPERIMENTS.md metadata                 | **REUSE (new schemas).** Row shape + 10-step narrative reuse from E6/E9; author E1a/E2/E3 schemas above. Swap `model/temperature/system_prompt_hash` fields for `engine_commit` in the engine lanes.                                                                                                                           |
| **T5 fresh-session / cross-repo runner** | spawn clean LLM sessions ×60                                | **MOSTLY GONE.** No 60-session orchestration — the engine is a CLI invocation. Residual-new: a **cross-repo CLI runner** (engine in implementation/domainspec, docs/code in validation/poker-team) — small, deterministic, no session isolation needed.                                                                        |
| **T6 bare-LLM control harness**          | E1 stochastic baseline                                      | **DROPPED.** No stochastic baseline to beat; the determinism claim is by construction.                                                                                                                                                                                                                                         |
| **T7/T8 manual capture + comparator**    | non-author tester rig, D-vs-M                               | **STILL NEW (unchanged).** Human-in-the-loop; engine does not help. Build the rubric, blinding SOP, and the rater-keyed M-normalizer.                                                                                                                                                                                          |
| **T9 Stryker wiring**                    | install Stryker on src/domain/\*\*                          | **STILL NEW (unchanged).** Absent today; install + commit in poker-team backend.                                                                                                                                                                                                                                               |
| **T10 emit_tests → executable**          | the executable-derived bridge                               | **PARTLY BUILT, BODIES MISSING.** Engine emits runnable scaffolds; **the assertion-body work (GAP-TDE-EMITTESTS-BODIES-001) is the remaining blocker for E3.** This is the new critical-path item.                                                                                                                             |
| **T11 survivor classifier**              | trivial/moderate/critical + equivalent                      | **STILL NEW (unchanged), now with explicit equivalent-mutant class.**                                                                                                                                                                                                                                                          |
| **T12 Wohlin aggregation**               | 10-step → results/EX-results.md                             | **REUSE (E6 structure).** Author E1a/E2/E3-results.md in the E6 10-step form.                                                                                                                                                                                                                                                  |
| **T13 pre-registration freezer**         | commit-hash-before-run                                      | **STILL NEW (unchanged), now also stamps `engine_commit`.**                                                                                                                                                                                                                                                                    |

**Headline reuse-vs-new:** the engine **eliminates** T1 (engine-side), T3 (as an
experiment), T5's session orchestration, and T6 entirely; **shrinks** T2 to a commit+doc
hasher. **Still net-new and human/infra-bound:** T7/T8 (manual rig + comparator), T9
(Stryker), **T10-bodies** (the emit_tests assertion work — the E3 gate), T11 (survivor +
equivalent classifier), T13 (prereg freezer). T4 and T12 reuse the E6/E9 shape.

---

## 5. Pre-registration discipline (commit-hash-before-run)

Adopt the dual-residue §7 model, extended for the engine:

1. Author `experiments/2026-06-21-c2-engine-to-evidence/proposal.md` freezing: the
   feature corpus, the **`engine_commit` SHA** (the engine is the surface under test —
   pin it), the gold-G annotation procedure (E1a), the blinding SOP + tester pool + rubric
   - κ threshold (E2), the Stryker config + two-rater survivor/equivalent rubric +
     pilot-then-calibrate gate plan (E3), and the descriptive-not-brittle success posture.
2. **Commit AND push** the proposal into `implementation/domainspec` _before_ the first
   run. Record the proposal commit hash.
3. Stamp **both** `prereg_commit` (proposal) and `engine_commit` (engine tree) into every
   JSONL row — the engine commit is what makes a pure-function run reproducible by anyone.
4. Report all outcomes regardless of direction (null result is valid), with both frozen
   hashes in `results/EX-results.md`.

**Engine-specific freeze hazard:** because the engine is pure, the entire run is
reproducible from `(engine_commit, feature-doc SHAs)`. That is a _strength_ — but it means
**any uncommitted engine change silently changes the surface under test.** The engine
package is **currently uncommitted** (`BLK-TDE-COMMIT-DISCIPLINE-001`, ART-TDE-PACKAGE
"Uncommitted"). No experiment may be pre-registered against an uncommitted/unpushed engine —
committing+pushing the engine under submodule discipline is a hard prerequisite to step 1.

---

## 6. Cross-repo / submodule mechanics

Unchanged in shape from the 2026-06-12 map, sharper now that the engine is the actor:

- **Engine + experiment data** live in `implementation/domainspec`
  (`tools/test-derivation-engine/`, `docs/research/{experiments,results,data}/`).
- **Features + backend code + TEST-SPECs + Stryker** live in `validation/poker-team`
  (`docs/features/<f>/`, `backend/src/domain/**`, `backend/` toolchain).
- The engine CLI reads poker-team docs and (for E3) the manual/committed suites read
  poker-team code — **two submodules straddled per run.**
- **Submodule-first, parent-last:** engine + data commit in `implementation/domainspec`;
  Stryker config + emitted/manual suites commit in `validation/poker-team`; each pushed
  independently; then bump the parent gitlink for both after `make bump-check`. Never bump
  the parent to an unpushed submodule commit (`push.recurseSubmodules=check`).
- **Nested-submodule shadow:** the uninitialized `validation/poker-team/domainspec` nested
  submodule can shadow the real CHANGELOG/version — the engine resolves no CHANGELOG (δ is
  code), so this risk shrinks but the path-resolution discipline (engine CLI accepts a
  feature dir path) must point at `implementation/domainspec` for any version metadata.
- **`domainspec_version`:** still no VERSION file; CHANGELOG top heading = `2.1.0` (E6/E9
  stamped a stale `1.8.2`). For the engine lanes the load-bearing reproducibility key is
  `engine_commit`, not `domainspec_version` — record both, but treat `engine_commit` as
  authoritative.

---

## 7. Execution order + dependencies (engine work ↔ each experiment)

```
[PRE]  Commit + push engine package (BLK-TDE-COMMIT-DISCIPLINE-001)  ── operator-gated, blocks ALL
          │
          ▼
[PRE]  Pre-register proposal.md, freeze (prereg_commit, engine_commit), push  (T13)
          │
   ┌──────┼───────────────────────────────────────────────┐
   ▼      ▼                                                 ▼
 E1a    E2 (manual lane)                                  E3
 (lightest, runs now)   needs: T7/T8 manual rig,         needs: emit_tests BODIES
 needs: gold-G          ≥3 non-author testers,           (GAP-TDE-EMITTESTS-BODIES-001) ← HARD GATE
 annotation, doc        rubric.md, κ raters.             then T9 Stryker install,
 hasher, T1-reader,     Effectiveness axis of E2         T11 survivor/equivalent rubric,
 edit-condition         BLOCKS on E3 (mutation score     pilot→calibrate gate.
 generator.             is its load-bearing metric).
   │                          │                                 │
   └──────────────┬───────────┴─────────────────────────────────┘
                  ▼
        T12 Wohlin aggregation → results/{E1a,E2,E3}-results.md
```

**Dependency facts that drive the order:**

1. **Engine commit+push gates everything** — you cannot pre-register against an
   uncommitted surface (§5).
2. **E1a is the cheapest and can run first** — it is pure-engine + a human gold annotation;
   no Stryker, no test bodies, no tester cohort.
3. **E3 is gated on the emit_tests assertion bodies** (`GAP-TDE-EMITTESTS-BODIES-001`).
   This is _the_ engine-side work item that unblocks the heaviest experiment. Build it
   before E3, and before E2's effectiveness verdict (E2's load-bearing metric is E3's
   mutation score).
4. **E2's descriptive axes** (count, traceability, D\M categories) can run in parallel
   with E1a once testers are recruited; **E2's pass/fail** waits on E3.
5. **Corpus generalization** (`GATE-TDE-CORPUS-GENERALIZATION-001` /
   `BLK-TDE-AUTH-CONVENTION-001`): financial-settlement is run-ready now; auth and further
   features enter the corpus as their oracle-convention drift is bridged (without hardcoding)
   or documented-irreducible.

---

## 8. Residue carried forward

- **R-ENG-1 (load-bearing):** E3 is hostage to `GAP-TDE-EMITTESTS-BODIES-001`. A stubbed
  emit_tests suite scores ~0 mutation and would falsely falsify C2 — never run E3 on stubs.
- **R-ENG-2:** the engine is uncommitted (`BLK-TDE-COMMIT-DISCIPLINE-001`); pre-registration
  is impossible until it is committed+pushed under submodule discipline.
- **R-ENG-3:** E1a precision<1.0 is _expected_ (legitimate completeness extras per L0);
  extras must be rater-classified legitimate vs spurious, never auto-failed.
- **R-ENG-4 (open, from engine ledger DEC-TDE-SEMANTIC-RIGOR-001):** the round-trip bridges
  PC/WF/QT/MT at owning-concept-bucket level, not per-row, because the oracle lacks surviving
  row ids. E1a recall is therefore measured at concept granularity for those categories until
  the oracle authoring embeds per-row ids — a known, documented ceiling on E1a rigor.
- **R-ENG-5:** equivalent mutants make any `survivors_critical=0` / `≥70%` gate
  unachievable in general (R-TD-4 persists); E3 gates stay descriptive until the
  single-feature pilot calibrates them.
