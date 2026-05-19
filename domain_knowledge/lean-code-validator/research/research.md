# Research — v3 Codegen-Readiness Grader

## Goal (one line)

> Given an L1 spec, deterministically compute a **codegen-readiness grade** with per-predicate breakdowns and concrete recommendations — so the author can see exactly where a code generator would have to guess.

This is a **grader, not a gate.** The tool always runs to completion and emits a structured report. It does not reject specs. Authors decide which warnings are real and which are false positives — over time, persistent false positives feed back into the obligation rules.

This document proposes a v3 of [internal_tools/lean-code-validator](..) that mechanizes exactly that contract, using only what the repo already provides ([findings.md](./findings.md)) and the canonical vocabulary maintained in `domainspec-core` ([findings §6](./findings.md#6-canonical-sources-in-domainspec-core-sibling-repo)). No Mathlib, no unproven theorems, no parser rewrites in the critical path.

**Authority direction.** The arrow is `domainspec-core defines → domainspec-theorem implements/checks`. v3 lifts its meta-types, edges, and σ-triples directly from `domainspec-core`'s DEFINITIONS.md + paper Tables 3 & 4. Where the parser's current σ disagrees with the canonical source, the canonical source wins.

**What "deterministic" still means here.** Every predicate is a decidable function over finite data. Given the same spec, the grader always returns the same grade, the same witnesses, and the same recommendations. No randomness, no LLM judgment. The Lean file's role shifts from "compilation = proof of pass" to "compilation = proof that the grading function itself is total and decidable" — the grade then comes from `#eval gradeFor spec`.

---

## 1. Scope decisions (and what we are deliberately not doing)

### In scope for v3

- **Skeleton codegen-readiness**: enough information to emit class declarations, method signatures, event types, state machine enums, query interfaces, and the wiring between them.
- **Pure decidable predicates** over the existing `Spec` structure (extended).
- **Multi-spec validation**: ZagrMarketplace + the 5 simpler specs in [examples/](../../../examples/) all become smoke-tests.
- **σ-table alignment to the canonical source**: lift the full vocabulary from `domainspec-core` — 24/25 meta-types and 26/29 edges across R_B, R_U, R_X, R_CF — with concrete σ-triples from paper Tables 3 & 4 ([findings §6.3](./findings.md#63-concrete-σ-triples-lifted-from-paper-tables-3--4)).
- **Profile parameterization**: `paper-baseline` (24+26) and `composition-extension` (25+29) as first-class profiles. A spec declares its profile; the validator enforces only that profile's vocabulary.

### Out of scope (deferred to v4 or never)

- **Field-body codegen** (typed properties, validation logic) — needs parser to extract field types, currently dropped.
- **Enum-value rendering** — needs parser to extract enum members.
- **Invariant-as-code** — needs parser to extract predicate text.
- **Anything categorical** — no `Functor.Full`, no Quiver, no presheaf, no M6-graph theorem. v3 stays strictly below the Claim B Wall.
- **Validation-readiness, test-readiness, deployment-readiness** — different gates, different document.

### Why this scoping is honest

The framework docs define no "codegen-ready" predicate ([findings §4](./findings.md#prior-art--codegen-ready-in-the-docs)). v3 invents the framing. To stay credible we (a) only invent the *predicate*, not the *math* — every check is a finite decidable computation — and (b) name the scope ceiling (skeleton, not bodies) up front.

---

## 2. The five codegen-ready predicates

Each is a decidable predicate on the v2 `Spec` structure (with light extensions). All five must hold for a spec to certify.

### P1 — Schema closure

**Statement**: Every concept name appearing as the source or target of any edge is declared in `space.Concept`.

**Why codegen needs it**: A generator cannot emit a class for a name it doesn't know exists. A dangling target = a missing import.

**Mechanization**: Free in v3 by the type system. Because `EdgeRow.src : space.Concept` and `EdgeRow.tgt : space.Concept`, an `EdgeRow` referring to an undeclared concept *cannot be constructed*. The parser already silently drops unresolved anchors ([audit_richness.py:258](../../../scripts/audit_richness.py#L258)) — v3's contribution is to surface those drops as a parser-emitted `unresolvedReferences : List String` field on `Spec`, with the predicate `unresolvedReferences = []`.

**Cost**: trivial Lean change; one-line parser change.

### P2 — σ-signature compliance (profile-aware)

**Statement**: Every declared edge respects σ for the spec's declared profile.

**Status**: ✅ The compile-time invariant pattern from v2 ([Richness.lean:44-49](../Richness.lean#L44-L49)) carries over directly. v3 inherits the mechanism, expands the data.

**v3 change**: Replace the 8-triple `sigmaValid` with the canonical 26 (or 29) triples lifted from paper Tables 3 & 4 ([findings §6.3](./findings.md#63-concrete-σ-triples-lifted-from-paper-tables-3--4)). `Sigma.lean` becomes:

```lean
inductive Profile | paperBaseline | compositionExtension

def edgeTypesInProfile : Profile → List EdgeType
def metaTypesInProfile : Profile → List Meta
def sigmaValid : Profile → EdgeType → Meta → Meta → Bool
```

The `EdgeRow.wellTyped` field becomes parameterized by profile. An edge legal in `compositionExtension` but not `paperBaseline` cannot be constructed in a paperBaseline spec — same compile-time guarantee as v2, but profile-aware.

**R_U caveat**: Paper §4.2 names 8 UI edges but never enumerates their σ-triples ([findings §6.5](./findings.md#65-gaps-in-the-canonical-sources)). Two appear in example traces (`renders : Page → Form`, `submits : Form → Hook`); the other six are vocabulary-only. v3 ships R_U with **only the two evidenced triples** and marks the other six as `unsigned` (the validator rejects edges of those types until the paper is extended). This is the honest move — better to underclaim than invent σ that the spec authors haven't ratified.

### P3 — Per-meta-type signature completeness (profile-aware)

**Statement**: For each declared concept, the edges incident to it satisfy a meta-type-specific minimum-viable wiring, with the obligation set determined by the spec's profile.

**Backend obligations** (apply in both profiles; derived from R_B σ):

| Meta-type | Required incoming | Required outgoing |
|---|---|---|
| `Operation` | ≥1 `performs` from `Entity` | ≥1 `produces` to `Event` |
| `Event` | ≥1 `produces` from `Operation` OR ≥1 `emits` from `Entity` | — |
| `Rule` | — | ≥1 `enforces` to `Operation` |
| `Calculation` | — | ≥1 `calculates` to `Operation` |
| `Workflow` | — | ≥1 `orchestrates` to `Operation` |
| `Policy` | — | ≥1 `applies` to `Operation` |
| `Mapping` | — | ≥1 `maps` to `Entity` ∨ `Interface` |
| `Query` | — | ≥1 `queries` to `Entity` |
| `Interface` | — | ≥1 `exposes` to `Operation` ∨ `Query` |
| `StateMachine` | ≥1 `transitions` from `Event` | — |
| `ValueObject` | ≥1 `contains` from `Entity` | — |
| `Entity`, `Enum` | no requirement | no requirement |

**UI obligations** (apply only when profile includes M_U / R_U / R_X):

| Meta-type | Required (any of) |
|---|---|
| `Page` | ≥1 outgoing R_U edge to a `Layout` or `Component` |
| `Form` | ≥1 `contracts` to an `Interface` (R_X) |
| `ViewModel` | ≥1 `derives` from an `Entity` (R_X) |
| `Hook` | ≥1 outgoing R_U edge or ≥1 R_X edge to a `Query` |
| `Action` | ≥1 outgoing R_U edge to a `Binding` |
| `Binding` | ≥1 `fetches`-to-`Query` OR ≥1 `mutates`-to-`Operation` (R_X) |
| `Guard` | ≥1 `mirrors` to a `Rule` (R_X) |
| `StateIndicator` | ≥1 `reflects` to a `StateMachine` (R_X) |
| `Adapter` | (no obligation — pure transformation) |
| `Layout`, `Component` | no requirement |

**Composition obligations** (apply only in `composition-extension`):

| Meta-type | Required (any of) |
|---|---|
| `Saga` | ≥1 R_CF edge (`produces-for` ∨ `triggers-cross` ∨ `enforces-cross`) crossing ≥2 features |

**Why codegen needs it**: An `Operation` with no performing `Entity` has no class to attach the method to. A `Form` not contracted to an `Interface` is a UI orphan with no backend target. A `Saga` with no R_CF edge has nothing to coordinate.

**Mechanization**: `obligationsSatisfied : Profile → Spec → Bool`. Walks `S.edges` and `S.space.Concept`s, gates each obligation by profile membership of the meta-type. `Decidable` over finite data.

**Posture — intentionally strict**: This obligation table is **our derivation from σ**, deliberately set to the strictest reasonable reading. The R_U / R_X obligations are inferred from semantics in [paper §4.2](../../../../domainspec-core/research/projects/domainspec/papers/domainspec-paper.md). Because v3 is a **grader, not a gate**, overspecification is no longer a hard risk — a too-strict rule produces a `WARN` that the author can dismiss. The dismissal pattern over time becomes the calibration signal: rules that get persistently dismissed get softened in v4, rules that catch real bugs stay strict. Sign-off becomes optional rather than blocking.

### P4 — No codegen ambiguity (M6, reframed)

**Statement**: `m6Witnesses S = []`.

**Status**: ✅ Already computed by v2 ([Richness.lean:60-71](../Richness.lean#L60-L71)). v3 inherits the computation, **changes the framing**.

**v3 framing**: When two distinct sources converge on the same non-Entity target with the same edge type and no disambiguating relation, a code generator faces a choice: which source's context defines the call site? Two correct generators could pick differently. By the determinism contract, this is a `WARN` (or `FAIL` if `m6FromDeclared` is non-empty). The "fractality" framing is dropped — that was a categorical claim ([findings §4 Q3](./findings.md#q3-what-does-m6-mean-in-motivational-terms--is-codegen-ambiguity-the-framing)), and v3 doesn't need it.

**v3 hardening**: Tag each `EdgeRow` with `provenance : EdgeProvenance` where

```lean
inductive EdgeProvenance | declared | contextInferred | sigmaFallback
```

Then `m6Witnesses` partitions into `m6FromDeclared` and `m6FromFallback`. The pass criterion remains "all M6 witness lists empty" — but a failing spec gets a much sharper diagnosis ("this is parser noise" vs "you have a real ambiguity"). The provenance data is in the parser today, dropped at output ([findings §1, extracted-but-discarded](./findings.md#extracted-but-discarded-one-line-parser-change-to-surface)).

### P5 — Generation-order DAG

**Statement**: The dependency graph among concepts (edges interpreted as "target depends on source") is a DAG.

**Why codegen needs it**: If `Entity A` depends on `Operation B` which depends on `Event C` which depends on `Entity A`, the generator has no topological order and must break the cycle arbitrarily.

**Mechanization**: Build adjacency from `S.edges`, run a decidable cycle-check (Tarjan or just reachability over a finite list). All inputs are finite, so this is `Decidable` and dischargeable by `decide` (or `native_decide` if performance matters). No Mathlib.

**Posture**: Some edge types are *not* dependency edges (e.g., `produces` and `transitions` cross temporal boundaries — the `StateMachine` doesn't depend on the `Event` at codegen time, only at runtime). v3 needs an explicit `isCodegenDependency : EdgeType → Bool` partition, codified in `Sigma.lean` alongside `sigmaValid`. v3 ships a default partition based on our reading of the σ-table; misclassified edges produce `WARN` cycles which the author can dismiss — same calibration loop as P3.

---

## 3. The graded report

Every predicate evaluates to a `PredicateReport`. The spec-level report aggregates them into an overall grade. Nothing rejects the spec — the report is the output.

```lean
inductive Grade | pass | warn | fail
  deriving DecidableEq, Repr

structure Finding where
  concept        : String        -- which concept the issue is about, "" for spec-level
  message        : String        -- human-readable, one line
  recommendation : String        -- what to do; empty = informational
  deriving Repr

structure PredicateReport where
  predicate : String             -- e.g. "P3.obligations.Operation"
  grade     : Grade
  findings  : List Finding       -- empty when grade = pass
  deriving Repr

structure CodegenReadinessReport where
  spec     : String
  profile  : Profile
  overall  : Grade               -- worst of components (any fail ⇒ fail, any warn ⇒ warn, else pass)
  closure  : PredicateReport     -- P1
  sigma    : PredicateReport     -- P2 (always pass — EdgeRow guarantees it)
  obligs   : List PredicateReport -- P3, one per meta-type with active obligations
  ambig    : PredicateReport     -- P4
  acyclic  : PredicateReport     -- P5
  deriving Repr

def gradeFor (S : Spec) : CodegenReadinessReport := ...
```

### Grade assignment per predicate

| Predicate | `pass` when | `warn` when | `fail` when |
|---|---|---|---|
| **P1 closure** | `unresolvedReferences = []` | — | otherwise |
| **P2 σ-typing** | always (EdgeRow guarantees it) | — | — |
| **P3 obligations** | concept satisfies its meta-type's required edges | concept missing an obligation derived from R_U/R_X heuristically | concept missing a required R_B obligation (e.g. Operation with no performer) |
| **P4 ambiguity** | `m6Witnesses = []` | only `m6FromFallback` non-empty (parser noise) | `m6FromDeclared` non-empty (real ambiguity) |
| **P5 acyclic** | dependency graph is a DAG | cycle involves at least one edge type at the boundary of `isCodegenDependency` | strict cycle in declared dependency edges |

The `warn` vs `fail` split keeps strict rules useful: a missing R_B obligation is a real codegen blocker (`fail`); a missing R_U obligation might just mean the spec isn't UI-flavored (`warn`).

### Usage

```bash
lake env lean --run examples/ZagrMarketplace.lean
```

Prints the full report. Sample (sketch):

```
spec     = zagr-marketplace
profile  = paperBaseline
overall  = warn

P1 closure          pass
P2 σ-typing         pass  (by EdgeRow construction)
P3.Operation        fail
  - AcceptInvitation: no producing Event   → declare a produces edge to an Event
P3.Event            warn
  - NodeReadyForRegistration: no transitions edge → add a StateMachine if state matters
P3.Mapping          pass
P4 ambiguity        pass
P5 acyclic          pass
```

The Lean file always compiles. The report is the artifact.

---

## 4. Layout proposal

```
internal_tools/lean-code-validator/
├── Sigma.lean              -- Profile, Meta, EdgeType, sigmaValid (canonical 26/29 triples)
├── Profiles.lean           -- NEW: profile membership (which Metas/EdgeTypes per profile)
├── Richness.lean           -- v2 framework + Spec.profile field
├── CodegenReady.lean       -- NEW: P1, P3 (profile-aware), P4-with-provenance, P5 + certificate
├── examples/
│   ├── ZagrMarketplace.lean       -- profile = paperBaseline
│   ├── OrderManagement.lean       -- profile = paperBaseline
│   ├── InventoryManagement.lean   -- profile = paperBaseline
│   ├── PaymentProcessing.lean     -- profile = paperBaseline
│   ├── UserAccount.lean           -- profile = paperBaseline
│   └── CcbMatchingExperiment.lean -- profile = paperBaseline (0 entities — edge-case test)
├── research/
│   ├── findings.md
│   └── research.md
└── lean-toolchain
```

No example uses `compositionExtension` yet — none of the in-repo specs have R_CF edges or `Saga`. Once one does, it goes in `examples/` with `profile := compositionExtension`.

---

## 5. Build sequence (proposed)

Strict order, clean exit per step. **Step 0 is gone** — the grader doesn't need pre-merge sign-off.

1. **Lift the canonical σ into `Sigma.lean` + `Profiles.lean`.** Encode the full 25 meta-types and 29 edges from [findings §6.2](./findings.md#62-the-full-vocabulary), with concrete σ-triples from paper Tables 3 & 4 ([findings §6.3](./findings.md#63-concrete-σ-triples-lifted-from-paper-tables-3--4)). Define `Profile`, `metaTypesInProfile`, `edgeTypesInProfile`. Ship the 6 unevidenced R_U edges with empty σ (any attempt to use one becomes a `WARN`, not a build failure). *Exit: typechecks; v2 ZagrMarketplace example regenerates as `paperBaseline` and grades `pass`.*

2. **Surface parser-extracted-but-dropped data.** Four one-line changes to `audit_richness.py`'s emitter:
   - emit `unresolvedReferences : List String`
   - emit `provenance` per edge ([findings §1, extracted-but-discarded](./findings.md#extracted-but-discarded-one-line-parser-change-to-surface))
   - emit per-concept structural counts as `metadata` fields
   - emit `profile` (read from spec frontmatter; default `paperBaseline`)

   *Exit: regenerated ZagrMarketplace example contains the new fields; v2 example moves to `examples/_v2/` for diff.*

3. **Implement the grader in `Report.lean`.** P1, P3, P4-with-provenance, P5 each as a `Spec → PredicateReport`; aggregator returns `CodegenReadinessReport`. P2 inherits from `EdgeRow`'s compile-time invariant and is always `pass`. *Exit: `#eval gradeFor zagrMarketplace.spec` prints a structured report.*

4. **Run the grader against the 5 other examples.** Each declares `profile := paperBaseline`. The interesting output is the **distribution of `WARN`s and `FAIL`s** — that's the calibration data for v4. No spec is "rejected"; we just learn which obligations are noisy. *Exit: a `examples/grading-snapshot.md` summarizing results across all 6 specs.*

5. **One-page user-facing README.** How to add a spec, what each predicate means in plain English, how to read the report, how to dismiss a `WARN` (front-matter-level suppression key per finding ID, deferred to v4 if not needed yet), how to choose a profile. *Exit: someone unfamiliar with Lean can read the page and understand the report.*

Steps 1–3 are mechanical. Step 4 is the real learning step — distributions of `WARN`s tell us where to soften the rules. Step 5 is the deliverable.

---

## 6. Risks and how we'd notice

| Risk | Symptom | Mitigation |
|---|---|---|
| P3 obligation table too strict | Many `WARN`s on Step 4, persistently dismissed by authors | Soften specific rules in v4; the data tells us which |
| P3 obligation table too loose | A spec grades `pass` that the author considers incomplete | Add a "missing edge" survey to step 4 — author spot-checks passing specs |
| R_U signature gap propagates | UI specs accumulate `WARN`s on the 6 unevidenced R_U edges | Acknowledge in README; revisit only when a real UI spec needs to be graded |
| R_CF drift (paper says 3, E9 uses 5) | A composition spec uses `references` or `orchestrates`-as-CF | Grader emits `WARN` ("uses E9-experimental edge type"); doesn't reject |
| Profile declaration mechanism not standardized in `domainspec-core` | Authors disagree on how to declare a spec's profile | Propose `profile: paper-baseline` as a frontmatter field; document in v3 README; flag for upstreaming to DEFINITIONS |
| P5's `isCodegenDependency` partition is wrong | A `WARN` cycle the author considers legitimate | Same calibration loop as P3 |
| Parser extension in step 2 breaks v2's existing example | v2's ZagrMarketplace.lean stops compiling | Freeze v2 at `examples/_v2/`, regenerate v3 fresh |
| `native_decide` slow on larger specs | Report eval takes >30s | Switch to `decide` with explicit instances, or batch per-predicate. Not expected at current spec sizes (≤30 concepts) |
| Authors ignore the report entirely | No follow-up on persistent `FAIL`s | Out of scope — the grader's job is to surface the data, not enforce action |

---

## 7. What this gives the user

A single command per spec:

```bash
python3 scripts/audit_richness.py examples/zagr-marketplace \
  --emit-lean internal_tools/lean-code-validator/examples/ZagrMarketplace.lean
lake env lean --run internal_tools/lean-code-validator/examples/ZagrMarketplace.lean
```

Always exits 0 (unless the Lean file itself fails to typecheck — which would be a v3 bug, not a spec issue). Output is the `CodegenReadinessReport`: an overall grade (`pass` / `warn` / `fail`), a per-predicate breakdown, and a list of `Finding`s each pairing a concrete witness with a recommended fix.

That is the deliverable. The author reads the report, fixes what they agree with, dismisses what they don't. Persistent dismissals across many specs feed back into v4's rule calibration.
