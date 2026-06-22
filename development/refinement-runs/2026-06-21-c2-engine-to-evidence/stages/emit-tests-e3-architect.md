---
node_type: refinement-stage
role: emit_tests E3 Architect
created: 2026-06-21
---

# emit_tests → E3 Architect: runnable assertions for mutation testing

NON-EXECUTED design. Proposes how the deterministic engine's `emit_tests` should
render REAL assertion bodies (not `it.todo` stubs) that exercise
`validation/poker-team/backend/src/domain/**`, so Stryker can measure whether
DERIVED tests kill faults — without re-injecting the implementer variability E3
exists to factor out.

---

## 0. The load-bearing constraint (read this first)

Two facts from the current engine decide everything below.

1. **The obligation has no binding to the implementation.** `Obligation`
   (`src/ir/types.ts`) carries `rule_type`, `canonical_params`, `source_anchor`,
   `description` — and nothing else. There is **no module path, no exported
   symbol, no parameter shape, no return-field name**. The spec docs _do_ name
   the authority file (`operations.md` "Domain Policy Ownership" links
   `settlement.service.ts`, `makeup-policy.service.ts`), but the engine never
   parses those links into the IR. An assertion must call a function; the
   obligation alone cannot name one.

2. **`Formal` is a verbatim string, not an AST.** `grammar/index.ts` does
   `unfence(...)` and stores the cell text into `node.fields.formal`. The deriver
   _classifies_ it with regexes (`classifyFormal`) to pick a **case count**, then
   throws the structure away. `R3` `startDate <= stats.date <= endDate` becomes
   "RANGE → 4 cases" — the engine never retains `stats.date`, the bound values,
   or the comparison operators as evaluable terms.

So today the engine knows _how many_ cases an obligation has and _what kind_, but
not _which function realizes it_, _what inputs to feed_, or _what value to expect_.
That gap is the whole game. An honest design must say, per obligation type,
whether the gap is closable purely (deterministic runnable assertion) or requires
a human-authored oracle/fixture (report as coverage gap, never fake).

**Determinism rule held throughout:** assertion _generation_ must stay pure
(no I/O, no clock, no RNG) — same `(G, Δ, binding)` → byte-identical test file.
_Running_ the emitted test naturally executes the impl; that's fine. What is
forbidden is the engine _reading the impl_ to author the assertion (that is
golden-trace/characterization — see Approach 3, and why it disqualifies).

---

## 1. Tournament — five approaches to runnable assertion bodies

Scored on: **Det** (generation determinism), **Kill** (mutation-kill power),
**Cost** (build cost), **Contract** (how much it needs the impl contract vs just
the obligation), **Cov** (fraction of the 61 raw obligations it can body).

### Approach 1 — assertion-from-Formal (compile the `Formal` AST → executable assertion)

Parse `Formal`/`Formula` into a real expression AST (not a regex class), bind its
free variables to a generated input record, evaluate the RHS in the engine to get
the **expected** value, and emit `expect(fn(input)).toBe(expected)`. The engine
becomes a tiny interpreter of the spec's own formal sub-language.

- Worked example, `C3` `playerShare = limit >= NL100 ? 0.5 : 0.4` against
  `getDealSplit(limit)`:
  - true-branch: `expect(getDealSplit("NL100").player).toBe(0.5)`
  - false-branch: `expect(getDealSplit("NL10").player).toBe(0.4)`
    Both literals come from the AST, not from running the impl. A mutant flipping
    `>= 100` to `> 100` makes `NL100` fall to the false branch → `0.5 !== 0.4` →
    **killed.** Boundary-flip survival from the current `it.todo` becomes a kill.
- `R3` RANGE → the 4 cases (lower-inclusive, upper-inclusive, below, above)
  become four `filterRecordsByPeriod` calls with dates _on_ and _±1 day off_ each
  bound, asserting inclusion/exclusion. Kills `<=`→`<` and `>=`→`>` mutants on
  the boundary — exactly the financial-settlement faults E3 cares about.

| Det                  | Kill                         | Cost                                           | Contract                              | Cov                                                                                                                                                                                                              |
| -------------------- | ---------------------------- | ---------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HIGH (pure AST eval) | HIGH on arithmetic/range/cap | HIGH (build a real formal grammar + evaluator) | HIGH (still needs the symbol binding) | ~40–55% (only obligations whose `Formal` is evaluable: RANGE, COUNT_CAP, simple-expr calc, ternary calc; NOT prose, NOT bare calls like `applyMakeupPolicy(...)`, NOT `exists()` which needs a fixture universe) |

The hard truth: Approach 1 raises the SAME wall the L0 report already hit — the
4 `needs_formal` cells (`sum(...)`, `applyMakeupPolicy(...)`, `newMakeup >= 0`).
A formal evaluator that re-implements `applyMakeupPolicy` to compute the expected
makeup would be **re-implementing the code under test inside the test** — a
self-fulfilling oracle that kills nothing real. So Approach 1 is powerful exactly
where the formula is _self-contained_ (deal split, range filters, count caps) and
useless where the formula _delegates to the impl_ (the makeup policy itself).

### Approach 2 — property-based (fast-check properties from invariants/cardinalities)

Translate invariants and postconditions into universally-quantified properties:
`WI-1` `newMakeup >= 0` → `fc.assert(fc.property(genInput, i =>
expect(computeSettlement(i).newMakeup).toBeGreaterThanOrEqual(0)))`.

- Strength: needs only the _obligation_ (the invariant shape), not a hand-picked
  fixture, and covers the `needs_formal` invariants (`I1 newMakeup >= 0`) that
  Approach 1 cannot exactify. Good at _metamorphic_ obligations (monotonicity,
  non-negativity, idempotency of `decideSettlementSideEffects`).
- Weakness on **Det**: fast-check is seeded, so a _fixed seed_ is reproducible —
  but the kill set depends on whether the random search happens to hit the
  boundary. A `>=`→`>` boundary mutant survives unless an input lands exactly on
  the bound; property search is probabilistic about _that_. Determinism of
  generation is fine (seed is pinned); determinism of _kill_ is weaker than
  Approach 1's hand-placed boundary cases.
- Weakness on **Kill**: weak invariants (`newMakeup >= 0`) are killed only by
  mutants that drive it negative; many arithmetic mutants keep it non-negative and
  **survive**. Properties catch _class_ faults, not _value_ faults.

| Det                               | Kill                                             | Cost                                            | Contract                                      | Cov                                      |
| --------------------------------- | ------------------------------------------------ | ----------------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| MED (seeded, kill is statistical) | MED (great for invariants, blind to value drift) | MED (add fast-check, write generators per type) | MED (needs symbol + a domain-typed generator) | ~25% (invariants + a few postconditions) |

### Approach 3 — golden-trace / characterization (run impl once, snapshot, mutate-detect)

Generate inputs, run the _current_ impl, snapshot outputs as the expected values,
emit `toEqual(snapshot)`. Mechanically this gives the **highest kill rate** (any
output-changing mutant differs from the snapshot) at the **lowest authoring cost**.

**Disqualified for E3 — and it must be stated plainly.** A characterization oracle
asserts "the code does what the code currently does." It cannot distinguish a
correct line from a buggy one; it pins behavior, it does not _verify_ it against
the spec. Worse, it **violates the determinism rule's intent**: generation would
read the impl to author the assertion, so the test is derived from the code, not
from the spec — which is the _opposite_ of C2 ("derived **from spec** tests catch
faults"). A high mutation score from golden traces would be **evidence of nothing**
about derivation quality; it measures the impl's own observability, not the spec's
coverage. Use only as an internal _regression_ guardrail, never as the E3 derived
suite.

| Det  | Kill                | Cost | Contract                     | Cov                      |
| ---- | ------------------- | ---- | ---------------------------- | ------------------------ |
| HIGH | HIGH (artificially) | LOW  | reads impl (forbidden basis) | ~100% but INVALID for E3 |

### Approach 4 — spec-level mutation (mutate the obligation set / spec, not the code)

Mutate the _spec_ (drop an obligation, flip a `<=` in a `Formal`, lower a count
cap), re-derive, and check the derived suite changes. This is a _different
experiment_ — it tests "is the derivation sensitive to the spec?", a property of
δ, not of the tests' fault-detection. It answers C-something, but **not E3's
construct**: E3 asks whether derived tests kill _code_ faults (Stryker mutates
`src/domain/**`). Spec mutation never runs against poker-team's code, so it cannot
produce `mutation_score_derived`. Keep it as a _complementary_ δ-robustness probe;
it does not satisfy E3 and should not be sold as if it does.

| Det  | Kill               | Cost | Contract        | Cov                        |
| ---- | ------------------ | ---- | --------------- | -------------------------- |
| HIGH | N/A (wrong target) | LOW  | obligation-only | 0% of E3's actual question |

### Approach 5 — hybrid (route each obligation type to its best strategy; rest → skip)

Per-obligation routing: AST-eval where the `Formal` is self-contained and value-
exact; property-based where the obligation is an invariant over a generatable
domain; explicit `it.skip` + a `coverage_gap` entry where the obligation needs a
human oracle. No faking, no characterization. This is the only approach that is
simultaneously deterministic, honest about gaps, and produces a _real_ Stryker
signal on the financial-settlement arithmetic that matters.

| Det  | Kill                      | Cost                                           | Contract | Cov                                   |
| ---- | ------------------------- | ---------------------------------------------- | -------- | ------------------------------------- |
| HIGH | HIGH on the bodied subset | MED-HIGH (AST eval + binding map + generators) | MED-HIGH | ~50–60% bodied, rest honestly skipped |

**Winner: Approach 5 (hybrid), with Approach 1 as its core engine and Approach 2
as the fallback for invariants.** Approach 3 is rejected (invalid oracle).
Approach 4 is retained only as a separate δ-sensitivity probe, not as E3.

---

## 2. Per-obligation-type strategy table

"Binding" = what extra metadata the obligation needs beyond what it carries today.

| rule_type                                          | Strategy                                                                         | Deterministically runnable assertion?                                                                                  | Binding it needs that the IR lacks                |
| -------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `calculation` (simple expr, e.g. C3 ternary)       | **AST-eval (A1)**                                                                | YES — eval RHS literals, assert `fn(in)===expected`                                                                    | symbol + arg order (`getDealSplit(limit).player`) |
| `calculation` (bare call C4 / aggregate C1,C2)     | **skip**                                                                         | NO — oracle = the impl itself; faking = self-fulfilling                                                                | n/a (irreducible `needs_formal`)                  |
| `invariant` RANGE (R3-style chained cmp)           | **AST-eval (A1)** boundary cases                                                 | YES — on/off-by-one dates per bound                                                                                    | symbol + which field is the variable              |
| `invariant` COUNT_CAP (R4/R5)                      | **AST-eval (A1)**                                                                | YES — first-allowed vs duplicate-capped via `decideSettlementSideEffects`                                              | symbol + the dedup field mapping                  |
| `invariant` EXISTENCE (R1 `exists(...)`)           | **skip**                                                                         | NO — needs a fixture universe / repo; not in pure domain slice                                                         | a fixture oracle (human)                          |
| `invariant` PRESENCE (R2 `!= null`)                | **AST-eval (A1)** per conjunct                                                   | PARTLY — only if a pure validator exists; else skip                                                                    | symbol of the validating fn                       |
| `invariant` UNCLASSIFIED (`I1 newMakeup>=0`)       | **property (A2)**                                                                | YES (weak) — non-negativity property over generated input                                                              | symbol + domain generator                         |
| `rule-validation`                                  | same classifier routing as `invariant`                                           | per-class (above)                                                                                                      | same                                              |
| `postcondition` (P3/P4 implication)                | **AST-eval (A1)** of the antecedent→consequent via `decideSettlementSideEffects` | PARTLY — works for the pure decision (`shouldCreate…`); the "create tx / emit" half is side-effectful → skip that half | symbol + decision-field names                     |
| `valid-transition` / `invalid-transition`          | **skip (pure-domain)**                                                           | NO — state machine lives in use-cases/services, not a pure fn in the slice                                             | a transition driver (human)                       |
| `contract` (HTTP status)                           | **skip**                                                                         | NO — Fastify routes, outside `src/domain/**`                                                                           | out of scope                                      |
| `event-obligation`                                 | **skip**                                                                         | NO — emission is a side effect                                                                                         | out of scope                                      |
| `workflow-step` / `query-behavior` / `mapping-row` | **skip**                                                                         | NO — orchestration / DTO mapping, not pure domain                                                                      | out of scope                                      |
| `needs-formal`                                     | **skip + surface**                                                               | NO by definition (already honest)                                                                                      | a formal-grammar extension                        |

**Deterministically derivable today (the real E3 signal):** simple-expr & ternary
`calculation`, RANGE and COUNT_CAP `invariant`/`rule-validation`, the pure half of
`postcondition`, and weak `invariant` properties. On financial-settlement that is
roughly the `getDealSplit` ternary (2), the `filterRecordsByPeriod` RANGE (4), the
`decideSettlementSideEffects` count-caps (4), and `newMakeup>=0` property (1) —
about a dozen real, fault-killing cases against `settlement.service.ts`,
`deal.service.ts`, `makeup-policy.service.ts`.

**Needs a human oracle (report as coverage gap, never fake):** every `exists()`
(R1), every bare-call/aggregate calc (C1/C2/C4 — the makeup math), all
transitions, contracts, events, workflows, queries, mappings. Critically the
**makeup policy arithmetic** (`applyMakeupPolicy`, the most fault-rich code) is
NOT auto-derivable: its `Formal` is a bare call, so the only honest expected value
is a human-written fixture. Auto-deriving it would mean re-implementing the policy
in the test (Approach 3 in disguise). This must be emitted as `it.skip` with a
`coverage_gap: needs-fixture-oracle` tag, and E3 must report it as an explicit
hole, not a pass.

---

## 3. The one new thing the engine needs: an obligation→impl **binding map**

Both A1 and A2 need to _name a function and its argument shape_. Two ways to get
it deterministically:

- **(a) Binding sidecar (recommended MVP):** a small, committed, per-feature
  `bindings.json` mapping `source_anchor` (or rule id) → `{ module, symbol,
argShape, resultField }`, e.g. `R3 → { module:
"domain/settlement/settlement.service", symbol: "filterRecordsByPeriod",
args: ["records","periodStart","periodEnd"], assertVia: "length" }`. This is
  _human-authored once per feature_ (~12 rows for financial-settlement) and is the
  legitimate, declared place for the impl contract — kept OUT of the engine so
  generation stays pure (the engine reads the sidecar as data, identical to how it
  reads the spec). Crucially it is _not_ an oracle: it says _which function_, not
  _what answer_. Expected values still come from the `Formal` AST.
- **(b) Parse the "Domain Policy Ownership" links + Input tables** already present
  in `operations.md` into the IR, deriving module+symbol automatically. Cleaner
  long-term, more parser work; defer past MVP.

Generation stays pure either way: `emit(obligation, binding)` is a total function;
nondeterminism is impossible because there is no I/O at emit time (the sidecar is
loaded once, upstream, like the spec).

---

## 4. E3 / Stryker reframe

- **Scope = the pure slice.** `mutate: ["src/domain/**/*.ts",
"!src/domain/**/*.test.ts"]`, restricted further to the financial-settlement
  files (`domain/settlement/**`, `domain/deal/**`, `domain/makeup/**`,
  `domain/limit/**`). L0 already verified this slice is import-pure (no
  drizzle/postgres/db), so it is fast and runs with the vitest runner cleanly.
  Exclude `use-cases/**` and `infrastructure/http/**` from the E3 denominator.
- **Plug-in to the existing harness:** the engine writes its emitted suite into an
  **isolated directory** (e.g. `src/domain/__derived__/financial-settlement.derived.test.ts`)
  using the _same_ `import { describe, it, expect } from "vitest"` API the repo
  already uses (confirmed in `settlement.service.test.ts`). `vitest run` discovers
  it with zero config; Stryker's `testRunner: "vitest"` runs it. The emitted file
  imports the real impl by the binding map's `module` path.
- **Does engine-emitted code avoid the contamination the prior E3 finding flagged?**
  **Yes — by construction, and this is the decisive win.** The prior teardown
  showed (a) derived and (b) "manual" were the _same_ artifact: repo `*.test.ts`
  carry TEST-SPEC IDs (`RV-5`, `PC-6`) and were produced by the pipeline. The
  engine-emitted suite is regenerated from `(spec + Δ + binding)` into a clean
  `__derived__/` dir, authored by _code, not a human or LLM_, and never edited.
  So `mutation_score_derived` becomes a deterministic function of engine version +
  spec, independent of the in-repo hand tests. The in-repo `*.test.ts` can then
  serve as the _manual control_ arm — they are genuinely a different author (the
  pipeline's implement stage) from the deterministic emitter. The two suites are
  finally distinct sets, which is exactly what E3's comparative criterion needs.
  (Caveat: both ultimately trace to the same source docs; the comparison is
  "deterministic-emitter vs agent-implementer," not "spec vs no-spec." That is a
  fair and honest framing — E3 must state it, not overclaim a spec-free baseline.)

---

## 5. MVP — smallest `emit_tests` change that gives a REAL mutation signal

Do NOT body all 61 obligations. Body exactly the **AST-evaluable financial-
settlement subset** and skip the rest honestly:

1. Add a `bindings.json` for financial-settlement (~12 rows) mapping the
   AST-evaluable obligations (C3 ternary, R3 RANGE, R4/R5 COUNT_CAP, I1 property)
   to `{module, symbol, args, assertVia}`. Human-authored, committed, declared.
2. In `emit_tests`, branch on `rule_type` + `classifyFormal` result:
   - evaluable + has binding → emit a real `it(...)` with `expect(...).toBe(...)`
     where the expected value is computed by a small pure `Formal` evaluator
     (start with: numeric literals, ternary, chained comparison → boundary dates,
     count-cap → first/duplicate). No impl execution at emit time.
   - invariant UNCLASSIFIED + binding → emit a seeded fast-check property.
   - everything else → keep `it.skip(...)` (not `it.todo`) and append a
     `coverage_gap` comment with the reason (`needs-fixture-oracle`,
     `out-of-pure-slice`). Skips report as explicit holes in E3, not pending work.
3. Emit into `src/domain/__derived__/financial-settlement.derived.test.ts`,
   importing real impl via the binding `module`.
4. Add `@stryker-mutator/core` + `@stryker-mutator/vitest-runner` (version-verify
   against vitest 4.x; spike on `domain/settlement/**` first per prior M4),
   `stryker.conf.json` with `mutate` scoped to the four feature dirs and `testRunner: vitest`.

This yields ~12 real boundary/value assertions that kill `>=`→`>`, `+`→`-`,
`0.5`→`0.4` mutants on `deal.service`, `settlement.service`, and the `toMoneyInt`
rounding in `makeup-policy` — a genuine, reproducible `mutation_score_derived`
on the exact arithmetic that matters — while the makeup-policy core math is
**reported as a coverage gap (needs human fixture)** rather than faked with a
self-fulfilling oracle. That honesty is the deliverable: a real signal where
derivation can produce one, an explicit hole where it cannot.
