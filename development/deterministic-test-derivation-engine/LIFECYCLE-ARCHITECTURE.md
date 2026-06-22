---
module: test-derivation-engine
node_type: architecture
version: current
status: draft
updatedAt: 2026-06-21
docType: architecture
---

# Test Engine — Lifecycle Architecture (four models)

This is the project spine for the **test engine**: one deterministic capability that compiles a feature's formal DomainSpec docs into byte-stable test obligations and runnable tests, replacing the LLM-backed `domainspec-generate-tests`. It explains the engine lifecycle through four lenses — **formal**, **architectural**, **DomainSpec**, and a **real-life example** — and places the LLM-replacement as a bounded task inside the project, not a separate effort.

Companions: [SPEC.md](SPEC.md) (capabilities + the spec-formalization-metric property) · [ARCHITECTURE.md](ARCHITECTURE.md) (six-view + decisions) · [GLOSSARY.md](GLOSSARY.md) · the DomainSpec feature [docs/features/test-derivation-engine/](../../docs/features/test-derivation-engine/) · the SMT/FOL tower [research/smt-fol-test-derivation/](../../../../research/smt-fol-test-derivation/).

---

## 1. Formal model — what the engine _is_, mathematically

The engine is a composition of pure functions over a typed structure:

```
parse : Docs            -> G            (typed concept graph; total over canonical docs, else violations)
δ     : (G, Δ)          -> Obligation[] (pure, total, deterministic)
key   : Obligation      -> sha1(source_anchor | rule_type | canonical_params)   (content-addressed, byte-stable)
emit  : Obligation[]    -> TestSpec | RunnableTests
```

- **Determinism by construction.** δ is pure+total ⇒ same `G` ⇒ identical `Obligation[]`; `key` is order-invariant and byte-stable ⇒ same docs ⇒ byte-identical output. This is the C2 claim _by construction_, not measured on a stochastic generator.
- **The FOL/SMT grounding** (from the tower's decidability map): a `Formal` cell is a fragment of first-order logic. The **quantifier-free decidable fragment** (EUF, linear arithmetic, fixed-decimal/rational, bounded folds) is derivable to exact assertions; everything outside it (quantifier alternation, opaque computation, nonlinear, implementation-oracle) is **`needs_formal`** — the theory-mandated residue.
- **The spec-formalization metric (the dual).** Because the engine derives only from closed checkable expressions and _refuses_ otherwise, its `needs_formal` / `coverage_gap` output is a precise measure of where the spec is not formal enough. Two lenses: `needs_formal` = un-formalized; mutation survivors (E3) = under-formalized.
- **The verification gate.** `roundtrip` compares engine obligations vs the committed catalogue under a **normalized semantic identity**; it is **injective** (INV-1: distinct human obligations never collapse) and **falsifiable** (INV-3: a negative control proves it can report MISSING).
- **Formalization levels of a feature's spec** (the lifecycle in formal terms): `un-formalized (needs_formal)` → `closed-formalized (derivable, exact assertions)` → `under-formalized (formula present, mutation survivors)` → `fully-formalized`.

## 2. Architectural model — how the engine is _built_

A pure pipeline of single-responsibility components (TypeScript, no LLM, no network):

```
featureDir ──grammar/──▶ ir/ (G) ──rules/ + formal/──▶ Obligation[] ──keys/──▶ keyed ──emit/──▶ TEST-SPEC.md
                                          │                                                   └─▶ runnable vitest (emit_tests)
                                          └── bindings/ (declare WHICH pure fn an obligation targets; never the answer)
committed TEST-SPEC ──roundtrip/──▶ semantic-identity compare ──▶ PASS@scope / genuine-miss / irreducible
```

- **Components:** `grammar/` (strict table parser → G), `ir/` (typed nodes/edges, deterministic serialization), `rules/` (δ rule functions, exact cardinalities), `formal/` (Formal-AST: ternary/range/count-cap + FoldAst/PiecewiseAst/ArithExpr + BigInt-rational evaluator), `keys/` (obligation_key), `emit/` (spec + tests), `roundtrip/` (gate + negative control), `bindings/` (impl bindings), `cli.ts`.
- **Architectural invariants (contracts):** (a) **determinism** — byte-stable, rational arithmetic only (no float drift); (b) **honesty** — a property co-emits with `needs_formal`, never replaces it; the gap is always counted; (c) **purity boundary** — only `grammar`/`roundtrip` read the filesystem; `emit_tests` is the only cross-repo write; (d) **no fabrication** — bare-call → `needs_formal`, no guessing.
- **CLI surface:** `roundtrip`, `derive`, `emit-tests`, `lint`, `self-check` (+ planned `gaps`/`report` = the spec-formalization scorecard).

## 3. DomainSpec model — where the engine _lives_ in the framework

- **The engine is itself a DomainSpec feature** ([docs/features/test-derivation-engine/](../../docs/features/test-derivation-engine/): SPEC + operations + interfaces) → **self-derivable** (it can derive its own TEST-SPEC: a fixpoint).
- **Its place in the pipeline** — the engine _is_ the test-derivation stage:
  ```
  business idea → spec docs → [TEST ENGINE] → TEST-SPEC → implement → tag → verify
                              (replaces the LLM domainspec-generate-tests)
  ```
- **The LLM-replacement is a task _inside this project_** (not separate): swap `domainspec-generate-tests` (LLM, `domainspec-test-designer` agent) for the deterministic engine as the test-spec generator, behind the same pipeline contract — with `needs_formal`/`coverage_gap` surfaced where the LLM used to silently fabricate. See §5.
- **Owner boundary:** the engine owns _test-derivation_ only. It does not own implement / tag / verify, nor the feature specs it reads. Cross-references: the SMT/FOL tower (formal grounding), the engine Craft ledger (project state).
- **Feedback loop into authoring:** the spec-formalization metric tells the spec author exactly which obligations to formalize next — closing `needs_formal` gaps converts to real tests (DomainSpec authoring ↔ test coverage become one loop).

## 4. Real-life example — `financial-settlement`, end to end

The lifecycle, concretely, as it actually happened:

1. **Author** `states/operations/interfaces/events/workflows/queries/mappings.md`.
2. **parse → G**: entities, 4 transitions, invariants I1/I2, rules R1–R5, calcs C1–C4, endpoints, events.
3. **δ → obligations**: valid + invalid-transitions (exact Cartesian remainder), invariant cardinalities, rule-validations, postconditions, contracts, events.
4. **key + emit**: byte-stable `TEST-SPEC.md`; `emit_tests` → runnable vitest.
5. **The C4 journey (the spec-formalization metric in action):**
   - C4 `applyMakeupPolicy(...)` is an **opaque call** → engine emits only a weak `>=0` property + flags **`needs_formal`** (a _visible_ spec gap).
   - Author a **closed formula** in the spec (from documented semantics, not the impl) → engine derives an **exact value assertion**.
   - **E3 mutation re-run:** derived arm **38.75% → 54.37%**, makeup-policy **17.2% → 36.56%**, assertions passing on real code → the gap was _unwritten spec_, not impl divergence.
   - Residual makeup survivors (payout-share path) = the formula is still an **under-model** → the next gap the metric points at.
6. **roundtrip gate**: corpus 6/7 features PASS@declared-scope (0 genuine misses); player-progression the honest untuned holdout.

This single feature exercises every lifecycle stage and both gap lenses.

---

## 5. The project & its bounded tasks

Treat `development/deterministic-test-derivation-engine/` as the **test-engine project root** (code in `tools/test-derivation-engine/`). Bounded tasks, ordered:

| Task                            | What                                                                                                                            | Status                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Engine core (P1–P4)             | parse/δ/key/emit + honest injective gate + closed-form AST                                                                      | ✅ done                               |
| Spec-formalization report       | `gaps`/`report` CLI = the scorecard (operationalize §1's property)                                                              | next (engine-only)                    |
| **Replace LLM in the pipeline** | swap `domainspec-generate-tests` → engine as the deterministic test-spec stage, same pipeline contract, `needs_formal` surfaced | **planned task IN this project** (§3) |
| Full piecewise / payout-share   | close the C4 under-model (poker-team spec)                                                                                      | deferred                              |
| Experiments E1a/E2/E3           | evidence layer (E3 pilot ✅)                                                                                                    | partial                               |

**LLM-replacement task shape (the direct task you flagged):** it is a `task-session` inside this project — (a) point the pipeline's test-derivation step at the engine, (b) on `needs_formal`/`coverage_gap`, surface the gap (do not fall back to LLM fabrication silently — at most an explicit, flagged advisory), (c) keep determinism + traceability, (d) validate by re-deriving a feature's TEST-SPEC via the engine and diffing against the LLM-era one (the diff = the spec gaps the LLM was hiding). Owner: pipeline skill + engine; route: `invoke plan` → `task-session`.

## Layering seed

L0 engine core (done) → L1 spec-formalization report → L2 pipeline LLM-replacement (behind the contract) → L3 experiments/corpus. Each layer's exit evidence is byte-stable engine output + (for L2) a feature's TEST-SPEC derived deterministically in the real pipeline.
