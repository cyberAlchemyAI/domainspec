---
date: 2026-05-14
status: COMPLETED
author: evaluator-agent
sources:
  - internal_tools/lean-code-validator/spec/domain.md
  - internal_tools/lean-code-validator/spec/queries.md
  - internal_tools/lean-code-validator/PLAN.md
  - domainspec-core/research/projects/domainspec/definitions/DEFINITIONS.md (via Agent 2)
corrections_applied: 2026-05-14
---

# Spec Audit — lean-code-validator v3

> **All corrections listed in Section 5 have been applied as of 2026-05-14.** `domain.md`, `queries.md`, and `PLAN.md` now use canonical DS-D1/DS-D2 vocabulary. This document is preserved as a record of the pre-correction state and the reasoning behind each fix.

## Executive Summary

The `domain.md` and `PLAN.md` specs were written using vocabulary that diverges substantially from the canonical definitions in `domainspec-core` DEFINITIONS.md (DS-D1, DS-D2). Every single backend and UI meta-type name is wrong — the spec authors appear to have invented a parallel naming system drawing from generic DDD terminology (e.g., `Aggregate`, `Projection`, `Screen`, `UIEvent`) rather than consulting the canonical source. The EdgeType categories are also scrambled: six edges that canonically belong to R_X (the cross-layer category) have been misassigned to R_B or R_U, and a completely different set of invented edges occupies R_X. The `isCodegenDependency` contradiction in `queries.md` is a direct consequence of this category scramble — the three edges listed as both codegen-true and "all R_U edges are false" (`mirrors`, `fetches`, `mutates`) are canonical R_X edges that were incorrectly filed under R_U. The only sections that are correct are R_CF (all three names match) and the `Profile` and `Grade` value objects. An implementer must replace every meta-type name (backend and UI) and re-categorize all 29 edge types before writing any Lean code.

---

## 1. Meta-Type Reconciliation

### 1.1 Backend Meta-types (13 expected)

| # | Spec `domain.md` | Canonical (DS-D1) | Status | Notes |
|---|---|---|---|---|
| 1 | `Entity` | `Entity` | ✅ match | |
| 2 | `Operation` | `Operation` | ✅ match | |
| 3 | `Query` | `Query` | ✅ match | |
| 4 | `Event` | `Event` | ✅ match | |
| 5 | `Rule` | `Rule` | ✅ match | |
| 6 | `Workflow` | `Workflow` | ✅ match | |
| 7 | `Interface` | `Interface` | ✅ match | |
| 8 | `Mapping` | `Mapping` | ✅ match | |
| 9 | `State` | `StateMachine` | ❌ wrong name | Spec uses abbreviated form; canonical is `StateMachine` |
| 10 | `Calculation` | `Calculation` | ✅ match | |
| 11 | `Saga` | — | ➖ extra in spec | Canonical `Saga` is composition-only (not a backend meta); spec places it in the backend list |
| 12 | `Projection` | — | ➖ extra in spec | No canonical equivalent; invented term |
| 13 | `Aggregate` | — | ➖ extra in spec | No canonical equivalent; DDD term not in DS-D1 |
| — | — | `ValueObject` | ➕ missing from spec | Canonical backend meta; not present in spec |
| — | — | `Enum` | ➕ missing from spec | Canonical backend meta; not present in spec |
| — | — | `Policy` | ➕ missing from spec | Canonical backend meta; not present in spec |

**Backend summary:** 9 correct names, 1 wrong name (`State` → `StateMachine`), 3 invented extras (`Saga` misplaced, `Projection`, `Aggregate`), 3 missing (`ValueObject`, `Enum`, `Policy`).

### 1.2 UI Meta-types (11 expected)

| # | Spec `domain.md` | Canonical (DS-D1) | Status | Notes |
|---|---|---|---|---|
| 1 | `Screen` | — | ➖ extra in spec | No canonical equivalent; invented |
| 2 | `Component` | `Component` | ✅ match | |
| 3 | `Form` | `Form` | ✅ match | |
| 4 | `Action` | `Action` | ✅ match | |
| 5 | `UIEvent` | — | ➖ extra in spec | No canonical equivalent; UI-prefixed DDD term |
| 6 | `UIState` | — | ➖ extra in spec | No canonical equivalent |
| 7 | `UIQuery` | — | ➖ extra in spec | No canonical equivalent |
| 8 | `UIRule` | — | ➖ extra in spec | No canonical equivalent |
| 9 | `UIWorkflow` | — | ➖ extra in spec | No canonical equivalent |
| 10 | `UIMapping` | — | ➖ extra in spec | No canonical equivalent |
| 11 | `UICalculation` | — | ➖ extra in spec | No canonical equivalent |
| — | — | `Page` | ➕ missing from spec | Canonical UI meta |
| — | — | `Layout` | ➕ missing from spec | Canonical UI meta |
| — | — | `ViewModel` | ➕ missing from spec | Canonical UI meta |
| — | — | `Hook` | ➕ missing from spec | Canonical UI meta |
| — | — | `Guard` | ➕ missing from spec | Canonical UI meta |
| — | — | `Binding` | ➕ missing from spec | Canonical UI meta |
| — | — | `Adapter` | ➕ missing from spec | Canonical UI meta |
| — | — | `StateIndicator` | ➕ missing from spec | Canonical UI meta |

**UI summary:** 3 correct names (`Component`, `Form`, `Action`), 8 invented extras, 8 missing canonical names.

### 1.3 Composition Meta-type (1 expected)

| # | Spec `domain.md` | Canonical (DS-D1) | Status | Notes |
|---|---|---|---|---|
| 1 | `CoFeature` | `Saga` | ❌ wrong name | Spec invents `CoFeature`; canonical is `Saga`. Note: spec also incorrectly lists `Saga` in the backend category (row 11 above), which compounds the error. |

**Composition summary:** 0 correct, 1 wrong name, 1 extra (`Saga` in wrong category).

### 1.4 Meta-type count audit

| Category | Spec count | Canonical count | Delta |
|---|---|---|---|
| Backend | 13 | 13 | 0 (but 4 wrong/misplaced names) |
| UI | 11 | 11 | 0 (but 8 wrong names) |
| Composition | 1 | 1 | 0 (but wrong name) |
| **Total** | **25** | **25** | Count coincidentally matches; names do not |

---

## 2. EdgeType Reconciliation

### 2.1 R_B — Backend edges (12 expected)

| Edge in `domain.md` R_B | Canonical category | Status | Notes |
|---|---|---|---|
| `performs` | R_B | ✅ correct | |
| `enforces` | R_B | ✅ correct | |
| `calculates` | R_B | ✅ correct | |
| `exposes` | R_B | ✅ correct | |
| `orchestrates` | R_B | ✅ correct | |
| `applies` | R_B | ✅ correct | |
| `maps` | R_B | ✅ correct | |
| `contains` | R_B | ✅ correct | |
| `queries` | R_B | ✅ correct | |
| `emits` | R_B | ✅ correct | |
| `derives` | **R_X** | ❌ wrong category | Canonical R_X cross-layer edge (`ViewModel → Entity`); incorrectly placed in R_B |
| `contracts` | **R_X** | ❌ wrong category | Canonical R_X cross-layer edge (`Form → Interface`); incorrectly placed in R_B |
| — | — | ➕ missing | `produces` (canonical R_B: `Operation → Event`) not listed under R_B |
| — | — | ➕ missing | `transitions` (canonical R_B: `Event → StateMachine`) not listed under R_B |

**R_B summary:** 10 correct, 2 wrong category (`derives`, `contracts` belong in R_X), 2 missing (`produces`, `transitions`).

### 2.2 R_U — UI edges (8 expected)

| Edge in `domain.md` R_U | Canonical category | Status | Notes |
|---|---|---|---|
| `renders` | R_U | ✅ correct | |
| `triggers` | — | ➖ extra in spec | No canonical `triggers` edge in any R category |
| `binds` | — | ➖ extra in spec | No canonical `binds` edge; possibly confused with the `Binding` meta-type |
| `navigates` | — | ➖ extra in spec | No canonical `navigates` edge |
| `mirrors` | **R_X** | ❌ wrong category | Canonical R_X cross-layer edge (`Guard → Rule`) |
| `fetches` | **R_X** | ❌ wrong category | Canonical R_X cross-layer edge (`Binding → Query`) |
| `mutates` | **R_X** | ❌ wrong category | Canonical R_X cross-layer edge (`Binding → Operation`) |
| `reflects` | **R_X** | ❌ wrong category | Canonical R_X cross-layer edge (`StateIndicator → StateMachine`) |
| — | — | ➕ missing | `wraps` (canonical R_U) |
| — | — | ➕ missing | `composes` (canonical R_U) |
| — | — | ➕ missing | `consumes` (canonical R_U) |
| — | — | ➕ missing | `submits` (canonical R_U) |
| — | — | ➕ missing | `shapes` (canonical R_U) |
| — | — | ➕ missing | `protects` (canonical R_U) |
| — | — | ➕ missing | `displays` (canonical R_U) |

**R_U summary:** 1 correct (`renders`), 4 wrong category (`mirrors`, `fetches`, `mutates`, `reflects` — all belong in R_X), 3 invented extras (`triggers`, `binds`, `navigates`), 7 missing canonical names.

### 2.3 R_X — Cross-layer edges (6 expected)

| Edge in `domain.md` R_X | Canonical category | Status | Notes |
|---|---|---|---|
| `transitions` | **R_B** | ❌ wrong category | Canonical R_B edge (`Event → StateMachine`) |
| `produces` | **R_B** | ❌ wrong category | Canonical R_B edge (`Operation → Event`) |
| `listens` | — | ➖ extra in spec | No canonical equivalent |
| `subscribes` | — | ➖ extra in spec | No canonical equivalent |
| `publishes` | — | ➖ extra in spec | No canonical equivalent |
| `projects` | — | ➖ extra in spec | No canonical equivalent; possibly confused with `Projection` (invented meta-type) |
| — | — | ➕ missing | `fetches` (canonical R_X) — listed in spec under R_U |
| — | — | ➕ missing | `mutates` (canonical R_X) — listed in spec under R_U |
| — | — | ➕ missing | `reflects` (canonical R_X) — listed in spec under R_U |
| — | — | ➕ missing | `derives` (canonical R_X) — listed in spec under R_B |
| — | — | ➕ missing | `contracts` (canonical R_X) — listed in spec under R_B |
| — | — | ➕ missing | `mirrors` (canonical R_X) — listed in spec under R_U |

**R_X summary:** 0 correct, 2 wrong category (`transitions`, `produces` belong in R_B), 4 invented extras (`listens`, `subscribes`, `publishes`, `projects`), all 6 canonical R_X edges misplaced elsewhere.

### 2.4 R_CF — Cross-feature edges (3 expected)

| Edge in `domain.md` R_CF | Canonical category | Status | Notes |
|---|---|---|---|
| `produces-for` | R_CF | ✅ correct | |
| `triggers-cross` | R_CF | ✅ correct | |
| `enforces-cross` | R_CF | ✅ correct | |

**R_CF summary:** 3/3 correct. This is the only fully correct section.

### 2.5 EdgeType count audit

| Category | Spec count | Canonical count | Correctly placed |
|---|---|---|---|
| R_B | 12 | 12 | 10 |
| R_U | 8 | 8 | 1 |
| R_X | 6 | 6 | 0 |
| R_CF | 3 | 3 | 3 |
| **Total** | **29** | **29** | **14** |

The total counts happen to match (29 = 29), but 15 of 29 edges are in the wrong category or are invented names with no canonical basis.

---

## 3. isCodegenDependency Reconciliation

### 3.1 The contradiction in `queries.md`

`queries.md` states two things that conflict:

1. **Table row 1:** `mirrors`, `fetches`, `mutates` are listed as codegen=**true**
2. **Table row 2:** "All R_U edges" are codegen=**false**

Since `domain.md` (incorrectly) classifies `mirrors`, `fetches`, `mutates` as R_U edges, row 2 says they are false. But row 1 says they are true. This is a direct logical contradiction within the spec.

### 3.2 Root of the contradiction

The contradiction disappears under the canonical definitions. `mirrors`, `fetches`, `mutates` are canonical **R_X** edges, not R_U. The original spec author likely knew R_X edges are codegen dependencies (true) but then listed them under R_U — creating an irreconcilable conflict when the blanket "all R_U = false" rule was applied.

### 3.3 What `isCodegenDependency` should return under canonical definitions

The canonical reasoning: a codegen dependency edge means "the target's class must be emitted before the source's class." R_B edges (backend structural wiring) and R_X edges (UI-to-backend cross-layer bindings) create real import/dependency order. R_U edges (UI-to-UI composition) and R_CF edges (cross-feature orchestration, deferred to runtime) do not.

| Edge | Canonical category | isCodegenDependency | Rationale |
|---|---|---|---|
| `performs` | R_B | **true** | Entity class references Operation method |
| `produces` | R_B | **true** | Operation method references Event type |
| `enforces` | R_B | **true** | Operation depends on Rule for validation |
| `calculates` | R_B | **true** | Operation depends on Calculation |
| `transitions` | R_B | **false** | Event→StateMachine: runtime transition, not compile-time import |
| `exposes` | R_B | **true** | Interface exposes Operation/Query types |
| `orchestrates` | R_B | **true** | Workflow depends on Operation types |
| `applies` | R_B | **true** | Operation depends on Policy |
| `maps` | R_B | **true** | Mapping depends on Entity/Interface types |
| `contains` | R_B | **true** | Entity depends on ValueObject type (field type) |
| `queries` | R_B | **true** | Query depends on Entity type |
| `emits` | R_B | **true** | Entity method depends on Event type |
| `renders` | R_U | **false** | UI composition; R_U edges are intra-layer |
| `wraps` | R_U | **false** | UI composition |
| `composes` | R_U | **false** | UI composition |
| `consumes` | R_U | **false** | UI composition |
| `submits` | R_U | **false** | UI composition |
| `shapes` | R_U | **false** | UI composition |
| `protects` | R_U | **false** | UI composition |
| `displays` | R_U | **false** | UI composition |
| `fetches` | R_X | **true** | Binding depends on Query type (cross-layer import) |
| `mutates` | R_X | **true** | Binding depends on Operation type (cross-layer import) |
| `reflects` | R_X | **true** | StateIndicator depends on StateMachine type |
| `derives` | R_X | **true** | ViewModel depends on Entity type |
| `contracts` | R_X | **true** | Form depends on Interface type |
| `mirrors` | R_X | **true** | Guard depends on Rule type |
| `produces-for` | R_CF | **false** | Cross-feature; runtime orchestration |
| `triggers-cross` | R_CF | **false** | Cross-feature; runtime orchestration |
| `enforces-cross` | R_CF | **false** | Cross-feature; runtime orchestration |

**Corrected partition:**

| isCodegenDependency = true | isCodegenDependency = false |
|---|---|
| `performs`, `produces`, `enforces`, `calculates`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits` (R_B, 11 of 12) | `transitions` (R_B, runtime-only) |
| `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors` (all R_X, 6 of 6) | All 8 R_U edges |
| | All 3 R_CF edges (`produces-for`, `triggers-cross`, `enforces-cross`) |

Note: compared to what `queries.md` currently says, `transitions` moves from true to false, and all R_X edges are confirmed true (no longer contradicted by R_U classification). The spec's current table lists `transitions`, `produces`, `reflects` as false; under canonical definitions `produces` is true and `reflects` is true.

---

## 4. Root Cause Analysis

### 4.1 Pattern of errors

The errors are not random. They form a consistent pattern:

**Meta-types:** The backend list replaces `ValueObject`, `Enum`, `Policy`, and `StateMachine` with DDD-flavored alternatives (`Aggregate`, `Projection`, and a truncated `State`). The UI list replaces 8 of 11 canonical names with a `UI`-prefixed parallel set mirroring backend concepts (`UIEvent`, `UIState`, `UIQuery`, `UIRule`, `UIWorkflow`, `UIMapping`, `UICalculation`). This is not random drift — it is a systematic re-derivation of the vocabulary from DDD principles and a "UI mirrors backend" intuition rather than from the canonical paper.

**EdgeTypes:** The R_X category (cross-layer UI→backend edges) was entirely invented from scratch using event-bus / pub-sub terminology (`listens`, `subscribes`, `publishes`, `projects`). All six actual canonical R_X edges (`fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors`) were displaced into R_B or R_U. R_U was similarly invented from scratch (`triggers`, `binds`, `navigates`), replacing 7 of 8 canonical R_U names. This pattern suggests the author associated R_X with event streaming and R_U with UI interaction, rather than consulting the canonical source.

### 4.2 Conclusion

**The spec was written from memory and first-principles DDD intuition, not from the canonical `domainspec-core` DEFINITIONS.md.** The author knew the high-level structure (25 meta-types in three groups, 29 edges in four categories, two profiles) but reconstructed the concrete names using DDD vocabulary and a "UI mirrors backend" pattern. The R_CF section (the most unusual and non-obvious part of the vocabulary) is perfectly correct — suggesting the author did consult `domainspec-core` for that section only, or it was added later from the canonical source.

The errors are not a versioning issue (there is no evidence of a prior version of DEFINITIONS.md with these names). They are not a transcription error (the wrong names are too systematic and numerous). The most parsimonious explanation is that `domain.md` and `PLAN.md` Step 1 were drafted in the same session, from memory, without opening `domainspec-core`.

---

## 5. Correction Plan

### 5.1 `domain.md` — Meta value: Backend (13 values)

**Remove:** `State`, `Saga`, `Projection`, `Aggregate`

**Add:** `StateMachine`, `ValueObject`, `Enum`, `Policy`

**Keep unchanged:** `Entity`, `Operation`, `Query`, `Event`, `Rule`, `Workflow`, `Interface`, `Mapping`, `Calculation`

Corrected list: `Entity`, `ValueObject`, `Enum`, `Operation`, `Query`, `Calculation`, `Rule`, `Policy`, `Workflow`, `Interface`, `Event`, `Mapping`, `StateMachine`

### 5.2 `domain.md` — Meta value: UI (11 values)

**Remove:** `Screen`, `UIEvent`, `UIState`, `UIQuery`, `UIRule`, `UIWorkflow`, `UIMapping`, `UICalculation`

**Add:** `Page`, `Layout`, `ViewModel`, `Hook`, `Guard`, `Binding`, `Adapter`, `StateIndicator`

**Keep unchanged:** `Component`, `Form`, `Action`

Corrected list: `Page`, `Layout`, `Component`, `ViewModel`, `Hook`, `Form`, `Action`, `Guard`, `Binding`, `Adapter`, `StateIndicator`

### 5.3 `domain.md` — Meta value: Composition (1 value)

**Remove:** `CoFeature`

**Add:** `Saga`

Corrected list: `Saga`

### 5.4 `domain.md` — EdgeType R_B (12 values)

**Remove from R_B:** `derives`, `contracts`

**Add to R_B:** `produces`, `transitions`

**Keep in R_B:** `performs`, `enforces`, `calculates`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits`

Corrected R_B list: `performs`, `produces`, `enforces`, `calculates`, `transitions`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits`

### 5.5 `domain.md` — EdgeType R_U (8 values)

**Remove from R_U:** `triggers`, `binds`, `navigates`, `mirrors`, `fetches`, `mutates`, `reflects`

**Add to R_U:** `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`

**Keep in R_U:** `renders`

Corrected R_U list: `renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`

### 5.6 `domain.md` — EdgeType R_X (6 values)

**Remove from R_X:** `transitions`, `produces`, `listens`, `subscribes`, `publishes`, `projects`

**Add to R_X:** `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors`

**Keep in R_X:** (none of the current entries survive)

Corrected R_X list: `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors`

### 5.7 `domain.md` — EdgeType R_CF (3 values)

**No changes needed.** `produces-for`, `triggers-cross`, `enforces-cross` are correct.

### 5.8 `domain.md` — EdgeType note on σ-triples

The `sigmaValid` note in `queries.md` currently names 6 "unevidenced" R_U edges as `mirrors`, `fetches`, `mutates`, `reflects`, `navigates`, `binds`. After correction, all 8 R_U edges lack σ-triples in the canonical paper (only `renders` and `submits` appear in example traces). The `sigmaValid` note should be updated to: "all 8 R_U edges have no σ-triple in the canonical paper; any use of a canonical R_U edge in an EdgeRow produces a WARN." The 6 canonical R_X edges all have concrete σ-triples from paper Table 4 and must not be marked as "unevidenced."

### 5.9 `queries.md` — isCodegenDependency table

Replace the current table entirely with:

| isCodegenDependency = true | isCodegenDependency = false |
|---|---|
| `performs`, `produces`, `enforces`, `calculates`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits` | `transitions` |
| `fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors` | All 8 R_U edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`) |
| | R_CF edges (`produces-for`, `triggers-cross`, `enforces-cross`) — compositionExtension only |

Remove the note "all R_U edges" since the current R_U list in `domain.md` will be replaced. Replace with: "All R_U edges (renders, wraps, composes, consumes, submits, shapes, protects, displays) are not codegen dependencies — they are intra-UI-layer composition edges. All R_X edges are codegen dependencies — they cross the UI→backend boundary and create compile-time import order. `transitions` is the one R_B edge that is not a codegen dependency (it represents a runtime state transition, not a compile-time type reference)."

### 5.10 `queries.md` — sigmaValid

Update the list of "unevidenced" edges. Currently reads: "`mirrors`, `fetches`, `mutates`, `reflects`, `navigates`, `binds`." Replace with: "All 8 R_U edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`) have no σ-triple in the canonical paper. Only `renders` and `submits` appear in example traces. The other 6 return `false` for all (Meta, Meta) pairs until the paper's σ-table for R_U is ratified."

### 5.11 `PLAN.md` — Step 1 Meta and EdgeType lists

The `Meta` and `EdgeType` enumerations in PLAN.md Step 1 mirror `domain.md` and therefore carry the same errors. Apply the same corrections as sections 5.1–5.7 above to the two literal lists in Step 1:

**Meta (backend 13) replace with:**
`Entity`, `ValueObject`, `Enum`, `Operation`, `Query`, `Calculation`, `Rule`, `Policy`, `Workflow`, `Interface`, `Event`, `Mapping`, `StateMachine`

**Meta (UI 11) replace with:**
`Page`, `Layout`, `Component`, `ViewModel`, `Hook`, `Form`, `Action`, `Guard`, `Binding`, `Adapter`, `StateIndicator`

**Meta (composition 1) replace with:**
`Saga`

**EdgeType R_B (12) replace with:**
`performs`, `produces`, `enforces`, `calculates`, `transitions`, `exposes`, `orchestrates`, `applies`, `maps`, `contains`, `queries`, `emits`

**EdgeType R_U (8) replace with:**
`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`

**EdgeType R_X (6) replace with:**
`fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors`

**EdgeType R_CF (3) — no change:**
`producesFor`, `triggersCross`, `enforcesCross`

Note: PLAN.md uses camelCase for R_CF names (`producesFor`, `triggersCross`, `enforcesCross`) while `domain.md` uses kebab-case (`produces-for`, `triggers-cross`, `enforces-cross`). This is a representation-level inconsistency, not a naming error — kebab-case is the canonical identifier form, camelCase is the Lean encoding. Both files are internally consistent for their context; no change is needed, but the relationship should be documented explicitly in `Sigma.lean` as: `| producesFor => "produces-for"`.

### 5.12 `PLAN.md` — sigmaValid unevidenced-edges note

Step 1 states: "The 6 unevidenced R_U edges (`mirrors`, `fetches`, `mutates`, `reflects`, `navigates`, `binds`) return `false`." After correction, update to: "All 8 R_U edges return `false` for all σ-pairs until the R_U σ-table is ratified by the paper. Two edges (`renders` and `submits`) appear in example traces but lack a formal σ-triple; they are treated as unevidenced pending ratification."

---

## 6. Correction Priority

| Priority | File | Section | Action |
|---|---|---|---|
| P0 — blocks Lean | `domain.md` | Meta values (backend, UI, composition) | Replace all wrong/missing names before writing Lean enums |
| P0 — blocks Lean | `domain.md` | EdgeType values (R_B, R_U, R_X) | Replace all wrong/missing names before writing Lean enums |
| P0 — blocks Lean | `PLAN.md` | Step 1 Meta and EdgeType lists | Sync with corrected domain.md before any Lean is written |
| P1 — fixes contradiction | `queries.md` | isCodegenDependency table | Replace to eliminate the mirrors/fetches/mutates contradiction |
| P1 — fixes contradiction | `queries.md` | sigmaValid unevidenced-edges list | Update to name actual R_U edges (not R_X edges) |
| P2 — documentation | `PLAN.md` | Step 1 unevidenced-edges note | Update to reflect corrected R_U set |

No Lean files should be written until all P0 items are resolved. The P1 items should be resolved in the same pass. The P2 item is low-risk and can be addressed last.
