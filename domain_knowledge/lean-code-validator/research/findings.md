# Findings — v3 Inventory

What we have today, gathered from a parallel survey of the parser, the specs, the heavier Lean work, and the docs. This file is descriptive (what *is*); the design proposal lives in [research.md](./research.md).

---

## 1. Parser capability — `scripts/audit_richness.py`

The parser is more capable than v2's framework currently exploits.

### Already extracted (usable today, no parser change)

| Datum | Where |
|---|---|
| Concept name + meta-type | `parse_registry()` lines 169–206 |
| Concept's home file + section header | lines 244–245 |
| Typed edge `(src, edge_type, tgt)` filtered against σ | lines 449–455 |
| Per-concept structural row counts: `rules`, `postconditions`, `error_states`, `transitions`, `fields`, `invariants` | lines 404–423 |
| Untyped link references (used for fullness signal) | line 390 |
| Orphan H2 sections (declared section with no registry concept) | line 258 |
| Test-spec row count per concept | lines 514–520 |

### Extracted-but-discarded (one-line parser change to surface)

| Datum | Where | Why dropped |
|---|---|---|
| Edge **provenance** — bold-prefix vs. context-sensitive vs. σ-fallback | lines 285–390 (3 mechanisms converge into one set) | Final tuple drops the source mechanism |
| Edge direction marker (canonical vs. inverse) | lines 302–305 | Used to rewrite tuple, then discarded |
| Markdown link text | line 297 | Only the anchor is kept |
| Negation status (`MUST NOT`, `~~`, etc.) | lines 104–117 | Computed for σ-fallback suppression, not stored |

### Not extracted at all (would need real parser work)

- Field types, enum members, invariant predicate text — only counts.
- Description / docstring prose.
- Mermaid statechart contents (only a row count for the transition table).
- Inline metadata (`**Type:**`, `**Capability:**`, `**Idempotency:**` values) — explicitly blacklisted from inference at line 270.
- Test assertion contents (only IDs).

### σ-signature mismatch — **action required**

Parser's σ has **12 edge types** ([audit_richness.py:36-49](../../../scripts/audit_richness.py#L36-L49)):

```
performs, produces, enforces, calculates, transitions, exposes,
orchestrates, applies, maps, contains, queries, emits
```

Validator's σ has **8** ([Sigma.lean:23-31](../Sigma.lean#L23-L31)) — missing `calculates`, `exposes`, `applies`, `contains`, `emits`. v3 must align these or the validator silently rejects valid edges from real specs.

### Parser/emission boundary

Clean separation at line 500. `parse_registry()` + `parse_aspect_file()` + `infer_edge_type()` produce a `(concepts: dict, typed_edges: list, untyped_edges: list)` triple consumed by `emit_lean()`. **A v3 emitter can replace `emit_lean()` without touching parsing.**

---

## 2. L1 spec conventions — what real specs look like

### Specs in the repo

Six specs total, all in [examples/](../../../examples/):

1. **zagr-marketplace** (7 entities, 5 VOs, 4 enums) — multi-file, with frontmatter, the canonical complex example.
2. **ccb-matching-experiment** (8 VOs, 1 enum, 0 entities) — technical/validation focus.
3. **order-management** (5 entities, 2 enums) — minimal.
4. **inventory-management** (3 entities, 3 VOs, 3 enums) — minimal.
5. **payment-processing** (1 entity, 1 shared VO, 2 enums) — minimal.
6. **user-account** (2 entities, 2 VOs, 4 enums) — minimal.

### De-facto grammar

- **Concept** = H3 section header (`### Name`).
- **Meta-type** = `**Type:**` bold prefix immediately after the H3.
- **Fields** = markdown table with columns `Field | Type | Required | Description`.
- **Edges** declared via bold prefixes:
  - Within-entity: `**Lifecycle:**`, `**Operations:**`, `**Invariants on X:**`
  - Cross-feature: `**Cross-feature edge:** produces-for → feature.EntityName`
  - Operation-level: `**Actor:**`, `**Triggers:**`, `**Permission key:**`, `**Idempotency:**`, `**Produced by:**`, `**Triggers transition:**`
  - Query-level: `**Reads From:**`
- **Cross-file refs** = relative path + anchor (`[Foo](../bar/baz.md#foo)`); resolution is path-based, not by name.
- **Cross-feature qualified names**: `feature-name.EntityName` (text, not always linked).

### Format drift to flag

| Drift | Specs affected | Codegen impact |
|---|---|---|
| Frontmatter present in zagr/ccb, absent in 4 simpler specs | 4/6 | None — frontmatter is metadata-only |
| No reciprocal `**Produces:**` on Operations (only `**Produced by:**` on Events) | All | Parser handles via context-sensitive inference; v3 needs to verify the implied edge exists |
| Validation expressed inconsistently (`**Validation:**` vs `**Equality:**` vs implicit) | All | Out of scope for v3 (codegen-ready ≠ validation-ready) |
| Enum table columns vary (`Value \| Description` vs custom domain-specific columns) | ccb has custom columns | None for skeleton codegen; matters if generating enum metadata |

---

## 3. Lean salvage — what's in `lean-formalization/`

Almost all of lean-formalization is Mathlib-bound. Triage:

| File | Verdict | Note |
|---|---|---|
| `FractalOP.lean` | **LEAVE** | Mathlib `Adjunction` + `KanExtension` throughout |
| `Cofractal.lean` | **LEAVE** | Dual of FractalOP, same dependencies |
| `S3Fractal.lean` | **LEAVE** | Adjunction APIs |
| `M6Restricted.lean` | **LEAVE** | Pure categorical, wraps `isIso_unit_app_iff_mem_essImage` |
| `DomainSpec.lean` | **LEAVE proofs, REFERENCE statements** | T0' theorems (determinism, image validity, entropy bound) are good targets to *cite* as motivating, not import |
| `CounitCounter.lean` | **ADAPT** | Two-nat-trans-differ-locally pattern — combinatorially salvageable |
| `S2VsS3Counter.lean` | **ADAPT** | Empty-structured-arrow + injectivity-collapse pattern |
| `M6Counter.lean` | **ADAPT** | Custom `L2Obj` + separator cocone — the data structure is salvageable, the colimit argument isn't |
| `M2Counter.lean` | **SALVAGEABLE** | **Only file with no Mathlib calls.** Pure case-split on hom-sets to derive contradictions. v3 can lift the pattern directly for impossibility proofs. |
| `NAMING.md` | **REFERENCE** | Hierarchical instance-vs-schema naming; v3 should adopt the layering vocabulary without the categorical content |

**Practical takeaway:** v3 should not import anything from `lean-formalization/`. It can *cite* `DomainSpec.lean`'s T0' theorems as the upstream conditions v3 partially mechanizes, and it can adopt M2Counter's case-split-to-contradiction pattern if v3 needs negative witnesses.

---

## 4. Prior art — "codegen-ready" in the docs

The docs do **not** define codegen-readiness, σ-obligations per meta-type, or a completeness rubric. They define a different (categorical) thing.

### What exists

- **Two-layer fidelity audit** ([docs/domainspec-two-layer-framework.md §2.4](../../../docs/domainspec-two-layer-framework.md)):
  - *Schema fidelity*: every concept has a name with the right morphisms (`Δ` faithful).
  - *Data fidelity*: invented witnesses are harmless (`η^{ins}_I` monic).
  - These are necessary, not sufficient — and they are categorical, not codegen-oriented.

- **σ-signature edge list** ([lean-richness-proof/docs/toward-categorical-spec-semantics.md §1](../../../lean-richness-proof/docs/toward-categorical-spec-semantics.md)): 8 valid `(EdgeType, Meta, Meta)` triples — note this is the *short* list that v2's `Sigma.lean` mirrors, not the parser's 12-edge expanded list.

- **Claim B Wall** ([two-layer framework §6](../../../docs/domainspec-two-layer-framework.md)):
  > "Every theorem above is conditional on the formalized constraint graph correctly representing the domain layer it was derived from. That correspondence is a human empirical act … No theorem in this catalog can verify it."
  - Two faces (per [vault 2026-05-12-1200](../../../docs/vault/conversations/2026-05-12-1200-intent-gap-upstream-residue.md)): *descriptive* (L0→L1: did we capture the domain?) and *teleological* (Intent→L1: did we capture what we wanted?).
  - **v3 stays below the Wall** by treating L1 as authoritative and only checking internal structural consistency.

- **M6 framing in current docs**: two-layer coherence ("does schema discipline propagate to instance fidelity?"), not codegen ambiguity. The codegen-ambiguity framing is **new with v3**.

### What does not exist (and v3 supplies)

1. A predicate "spec is codegen-ready."
2. Per-meta-type obligations (e.g., "every Operation must have ≥1 producing Entity and ≥1 produced Event").
3. A reframing of M6 as "the generator would have to guess."
4. A consolidated rubric — the framework is deliberately decoupled into schema and instance audits.

This is good news: v3 is genuinely additive, not a re-skin of existing prose.

---

## 5. What we have / what we're missing — at a glance

| Need for "codegen-ready" check | Have it? | From where |
|---|---|---|
| Concept name + meta-type | ✅ | Parser registry |
| Typed edge graph | ✅ | Parser, σ-filtered |
| Schema closure check (every referenced concept declared) | ✅ derivable | Parser drops unresolved anchors; we'd need to surface "dropped" instead of silent |
| Per-meta-type signature obligations | ⚠️ derivable from edge counts | Doable today; needs σ-table aligned to 12 edge types first |
| M6-style ambiguity (no two paths converge ambiguously) | ✅ | v2 already computes `m6Witnesses` |
| DAG / generation-order check | ✅ derivable | Edge graph is in hand; topological sort is decidable |
| Field-level codegen (types, required, defaults) | ❌ | Parser drops field content, only counts |
| Enum-value codegen | ❌ | Parser drops enum members |
| Invariant-as-code | ❌ | Parser drops invariant text, only counts |
| Cross-feature edge resolution (`feature.Entity`) | ⚠️ partial | Parser handles same-directory anchors; cross-feature qualified names appear as text, not edges |

**Implication for v3 scope**: codegen-readiness as defined in [research.md](./research.md) is achievable for **skeleton codegen** (classes, methods, event signatures, state machines as enums) without parser changes. **Field-body codegen** (typed properties, validation logic, enum value rendering) requires parser extensions and should be deferred to v4.

---

## 6. Canonical sources in `domainspec-core` (sibling repo)

A second-pass survey discovered that `/Users/victorboscaro/domainspec-core/` is the **canonical source** for the meta-type and edge vocabulary that domainspec-theorem (parser + validator) only partially mirrors. This changes several decisions in the v3 plan.

### 6.1 What's authoritative there

| Source | Path | What it gives us |
|---|---|---|
| **DEFINITIONS.md DS-D1, DS-D2, DS-D8** | `research/projects/domainspec/definitions/DEFINITIONS.md` | Abstract enumeration: 24 meta-types (25 with Saga), 26 edges (29 with R_CF); σ defined as operator, no concrete triples |
| **Paper Table 3** | `research/projects/domainspec/papers/domainspec-paper.md:306-321` | **Concrete σ-triples for all 12 R_B edges** |
| **Paper Table 4** | `research/projects/domainspec/papers/domainspec-paper.md:323-332` | **Concrete σ-triples for all 6 R_X edges** |
| **Paper §4.1** | same file, lines 250-253 | One-sentence semantics for the 11 UI meta-types |
| **E9 results** | `research/projects/domainspec/experiments/E9-cross-feature-composition/results/` | Empirical CF edge enumeration + Saga semantics; expands R_CF from 3 → 5 (`references`, `orchestrates` discovered) |

### 6.2 The full vocabulary

**Meta-types (25 in composition profile):**

- **Backend (13)**: `Entity, ValueObject, Enum, Operation, Query, Calculation, Rule, Policy, Workflow, Interface, Event, Mapping, StateMachine`
- **UI (11)**: `Page, Layout, Component, ViewModel, Hook, Form, Action, Guard, Binding, Adapter, StateIndicator`
- **Composition (1)**: `Saga`

**Edges (29 in composition profile):**

- **R_B backend (12)**: `performs, produces, enforces, calculates, transitions, exposes, orchestrates, applies, maps, contains, queries, emits` ← matches parser exactly
- **R_U UI (8)**: `renders, wraps, composes, consumes, submits, shapes, protects, displays`
- **R_X cross-layer (6)**: `fetches, mutates, reflects, derives, contracts, mirrors`
- **R_CF cross-feature (3 canonical, 5 empirical)**: `produces-for, triggers-cross, enforces-cross` (+ `references, orchestrates` per E9)

### 6.3 Concrete σ-triples (lifted from paper Tables 3 & 4)

**R_B (Table 3):**

| Edge | Source meta | Target meta |
|---|---|---|
| `performs` | Entity | Operation |
| `produces` | Operation | Event |
| `enforces` | Rule | Operation |
| `calculates` | Calculation | Operation |
| `transitions` | Event | StateMachine |
| `exposes` | Interface | Operation ∨ Query |
| `orchestrates` | Workflow | Operation |
| `applies` | Policy | Operation |
| `maps` | Mapping | Entity ∨ Interface |
| `contains` | Entity | ValueObject |
| `queries` | Query | Entity |
| `emits` | Entity | Event |

**R_X (Table 4):**

| Edge | Source meta | Target meta |
|---|---|---|
| `fetches` | Binding | Query |
| `mutates` | Binding | Operation |
| `reflects` | StateIndicator | StateMachine |
| `derives` | ViewModel | Entity |
| `contracts` | Form | Interface |
| `mirrors` | Guard | Rule |

**Property DS-P3** asserts all R_X edges are unidirectional UI → Backend.

### 6.4 Profile semantics

DEFINITIONS.md DS-D1 (lines 78-80):

> "Use paper/profile-specific counts explicitly when reporting experiment evidence."

A **profile** is a subset of (M, R) declared as legal for a given spec. Two are documented:

| Profile | Meta-types | Edges | Use when |
|---|---|---|---|
| `paper-baseline` | 24 (13 backend + 11 UI) | 26 (R_B + R_U + R_X) | Single-feature, publication-aligned |
| `composition-extension` | 25 (+ Saga) | 29 (+ R_CF) | Multi-feature systems, cross-context |

No `backend-only` or `ui-only` profile is defined, but nothing prevents v3 from adding them as further restrictions.

### 6.5 Gaps in the canonical sources

| Gap | Impact on v3 |
|---|---|
| **R_U has no signature table.** Paper §4.2 names the 8 UI edges but doesn't enumerate σ. Only two appear in example traces (`renders : Page → Form`, `submits : Form → Hook`). | v3 must either (a) skip R_U signature checks (codegen-ready partial for UI specs), (b) propose an R_U table for ratification, or (c) restrict the `ui-supported` profile to just the two evidenced edges |
| **Backend meta-types lack inline semantic definitions** in DEFINITIONS.md. Paper §4.1 has informal grouping (Structural, Behavioral, Governing, Connective). | Doesn't block v3 — the σ-typing is enough — but flag for the spec authors |
| **R_CF has drifted**: DEFINITIONS lists 3, E9 empirically uses 5 | v3 should default to the canonical 3 and treat the additional 2 as `experimental` profile-only |
| **No declaration mechanism**: nowhere in a real L1 spec does the author say "this spec uses profile X" | v3 must add this — either a frontmatter field or a CLI flag at parse time |

### 6.6 Tooling in `domainspec-core`

**None overlapping with what we're building.** A targeted survey found:

- `tools/check_research_structure.sh` — directory governance
- `tools/check_github_drift.sh` — submodule drift detection
- `.githooks/pre-commit` — prettier
- E9 experiments — manual JSONL classifications, not automated validation

Verdict: **safe to build v3 in domainspec-theorem; we are filling a gap, not duplicating.** The arrow should be `domainspec-core defines → domainspec-theorem implements/checks`, not the other way around.
