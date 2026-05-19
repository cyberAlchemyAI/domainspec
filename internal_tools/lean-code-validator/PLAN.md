---
tags: [lean-code-validator, plan, v3, implementation]
node_type: plan
is_session: false
layer: [architecture, application]
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-14
---

# Implementation Plan — lean-code-validator (v3)

## Source

Spec: [`spec/SPEC.md`](spec/SPEC.md) and aspect files.
Decisions: [`discovery/PROJECT-DECISIONS.md`](discovery/PROJECT-DECISIONS.md).
v2 baseline: [`Sigma.lean`](Sigma.lean), [`Richness.lean`](Richness.lean), [`examples/ZagrMarketplace.lean`](examples/ZagrMarketplace.lean).

## Gap summary (v2 → v3)

| Component | v2 state | v3 target | Delta |
|---|---|---|---|
| `Meta` enum | 12 values (non-canonical naming) | 25 values (DS-D1 canonical) | rename + add 13 |
| `EdgeType` enum | 7 values | 29 values (DS-D2 canonical) | add 22 |
| `sigmaValid` | 8 triples, profile-unaware | full paper Tables 3 & 4, profile-aware | rewrite |
| `Profile` | absent | 2 values: `paperBaseline`, `compositionExtension` | new file |
| `Spec` | profile-less, no unresolvedRefs | + profile, provenance, unresolvedRefs, conceptCount | extend |
| Grading (P1,P3,P4,P5) | absent (only `m6Witnesses`) | all four predicate ops + aggregator | new file |
| `CodegenReadinessReport` | absent | full graded output struct | new file |
| Parser emitter | drops provenance, profile, unresolvedRefs | emits all four new fields | 4-line additions |
| v2 examples | live in `examples/` | freeze in `examples/_v2/` | move |
| v3 examples | none | regenerated under v3 format | generate |

---

## Steps

### Step 0 — Freeze v2 (D7)

**Files touched:** `examples/ZagrMarketplace.lean` → `examples/_v2/ZagrMarketplace.lean`

Create `examples/_v2/` and move the current `ZagrMarketplace.lean` into it unchanged. The file stays compilable as a diff target against the v3 regeneration. No code changes — this is a copy/rename only.

**Done when:** `lake env lean --run examples/_v2/ZagrMarketplace.lean` still typechecks.

---

### Step 1 — Rewrite `Sigma.lean` (canonical 25/29 vocabulary)

**Files touched:** `Sigma.lean`

Full rewrite. The v2 meta names (`Enum`, `Policy`, `StateMachine`, `ValueObject`) are non-canonical — they must be renamed or replaced.

**`Meta` (25 values):**

Backend (13): `Entity`, `ValueObject`, `Enum`, `Operation`, `Query`, `Calculation`, `Rule`, `Policy`, `Workflow`, `Interface`, `Event`, `Mapping`, `StateMachine`
UI (11): `Page`, `Layout`, `Component`, `ViewModel`, `Hook`, `Form`, `Action`, `Guard`, `Binding`, `Adapter`, `StateIndicator`
Composition (1): `Saga`

**`EdgeType` (29 values):**

R_B (12): `performs`, `produces`, `enforces`, `calculates`, `transitions`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits`
R_U (8): `renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`
R_X (6): `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors`
R_CF (3): `producesFor`, `triggersCross`, `enforcesCross` (kebab canonical: `produces-for`, `triggers-cross`, `enforces-cross`; camelCase is the Lean encoding)

**`sigmaValid`:** rewrite from paper Tables 3 & 4. Profile parameter added (`Profile → EdgeType → Meta → Meta → Bool`). All 8 R_U edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`) have no σ-triple in the canonical paper and return `false` for all pairs in both profiles. Two (`renders`, `submits`) appear in example traces but are treated as unevidenced pending ratification.

**Done when:** file compiles; `sigmaValid .paperBaseline .performs .Entity .Operation = true` and all canonical triples pass a `#eval` smoke test.

---

### Step 2 — Create `Profiles.lean`

**Files touched:** `Profiles.lean` (new)

New file. Depends on `Sigma.lean`.

```
Profile       -- inductive: paperBaseline | compositionExtension
metaTypesInProfile  : Profile → List Meta
edgeTypesInProfile  : Profile → List EdgeType
```

`metaTypesInProfile paperBaseline` → 24 metas (all except `Saga`).
`metaTypesInProfile compositionExtension` → all 25.
`edgeTypesInProfile paperBaseline` → 26 edges (all R_B + all R_U + all R_X; excludes R_CF edges only).
`edgeTypesInProfile compositionExtension` → all 29.

**Done when:** `#eval metaTypesInProfile .paperBaseline |>.length = 24` and `#eval edgeTypesInProfile .compositionExtension |>.length = 29`.

---

### Step 3 — Create `Report.lean` (grader)

**Files touched:** `Report.lean` (new). Depends on `Sigma.lean`, `Profiles.lean`, and the extended `Richness.lean` (see §3a).

#### 3a — Extend `Richness.lean`

Add to the existing `Spec` structure:
- `profile : Profile`
- `unresolvedRefs : List String`
- `conceptCount : Nat`

Add `EdgeProvenance` enum (`declared | contextInferred | sigmaFallback`) to `EdgeRow`.

#### 3b — Write `Report.lean`

New types:
- `Grade` — `pass | warn | fail`, with `Repr` and `BEq`
- `Finding` — `{ concept : String, message : String, recommendation : String }`
- `PredicateReport` — `{ predicate : String, grade : Grade, findings : List Finding }`
- `CodegenReadinessReport` — `{ profile : Profile, overallGrade : Grade, predicateReports : List PredicateReport }`

New functions (in order of dependency):
1. `aggregateOverall : List PredicateReport → Grade` — worst-component rule
2. `gradeP1Closure : Spec → PredicateReport` — checks `unresolvedRefs`
3. `gradeP3Obligations : Spec → PredicateReport` — per-meta obligation loop (use `obligationsForMeta` table; ship as a `def` keyed on `Meta`)
4. `gradeP4Ambiguity : Spec → PredicateReport` — wraps `m6Witnesses`; provenance-aware grade (`declared`/`contextInferred` → `fail`; `sigmaFallback` → `warn`)
5. `gradeP5Acyclic : Spec → PredicateReport` — restrict to `isCodegenDependency` subgraph, DFS cycle check from scratch
6. `gradeFor : Spec → CodegenReadinessReport` — orchestrates all four + `aggregateOverall`

**Done when:** `#eval gradeFor emptySpec` typechecks and prints a `CodegenReadinessReport` with `overallGrade = pass`.

---

### Step 4 — Extend parser emitter (`audit_richness.py`)

**Files touched:** `scripts/audit_richness.py`

Four additive changes to the Lean emitter section only — no parsing rewrites:
1. Read `profile:` frontmatter key; emit as `profile := .paperBaseline` (or `compositionExtension`); default to `.paperBaseline`.
2. Emit `edgeProvenance` per edge (already tracked internally; wire to output).
3. Emit `unresolvedRefs := [...]` field.
4. Emit `conceptCount := N` field.

**Done when:** running `python3 scripts/audit_richness.py examples/zagr-marketplace/` produces a `.lean` file with all four new fields populated.

---

### Step 5 — Regenerate examples

**Files touched:** `examples/ZagrMarketplace.lean` (new v3 version)

Run the updated parser + emitter against the zagr-marketplace L1 spec. The regenerated file should:
- Have `profile := .paperBaseline`
- Have `unresolvedRefs`, `conceptCount`, provenance fields populated
- Typecheck against the new `Sigma.lean` + `Profiles.lean` + `Report.lean`

**Done when:** `lake env lean --run examples/ZagrMarketplace.lean` prints a `CodegenReadinessReport`.

---

### Step 6 — Run EX1 (grade all 6 in-repo specs)

**Trigger:** Steps 1–5 complete.

Run the regenerated grader against all six in-repo example specs:
- `examples/zagr-marketplace/`
- `examples/order-management/`
- `examples/payment-processing/`
- `examples/inventory-management/`
- `examples/user-account/`
- `examples/ccb-matching-experiment/`

Record per-predicate grades for each spec. This single experiment resolves:
- **H1** — are five predicates sufficient?
- **H2** — do per-meta obligations match authorial intent?
- **H3** — does `paperBaseline` cover all 6 specs, or does zagr-marketplace's `produces-for` syntax force `compositionExtension`?

Also run **EX2** (R_CF detection in zagr-marketplace) in parallel — cheap and likely reclassifies zagr-marketplace as `compositionExtension`, giving v3 its first real cross-feature test case.

**Done when:** all six specs produce a `CodegenReadinessReport`; results recorded in `discovery/EXPERIMENT-CANDIDATES.md` under EX1/EX2.

---

## Verification baseline

Per `domainspec-start` Step 4 requirement (PROJECT-DECISIONS cross-cutting policy):

```
lake env lean --run internal_tools/lean-code-validator/examples/ZagrMarketplace.lean
```

This command must print a `CodegenReadinessReport` once Step 5 ships. It is the single standing verification command.

---

## Deferred (not in this plan)

- JSON report emission (`JsonReportInterface`) — D8, deferred to v4
- Per-finding suppression — D10, deferred to v4
- `FindingLifecycle` state machine — A5, deferred to v4
- `domainspec-readiness-gate` integration — D9, pending trigger
- Self-application (EX3) — depends on EX1 results; schedule after Step 6
