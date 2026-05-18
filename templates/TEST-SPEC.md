---
tags: [{feature-slug}, spec, test]
node_type: spec
is_session: false
layer: application
nature: procedural, technical
status: draft
version: 0.1.0
last_updated: {YYYY-MM-DD}
---

# Test Spec: {Feature Name}

<!--
HOW TO USE THIS TEMPLATE

This file enumerates what the tests must verify and why — it specifies tests,
not test code.

Required:
  1. A Test Matrix table with at minimum: ID | Test | Validates
  2. Each entry has a stable ID (T1, T-R-1, AEO-BE-OP-046 — pick a namespace
     and never renumber on insert)
  3. The "Validates" column cites a rules.md / workflows.md / domain.md anchor

Optional sections (use when the feature warrants — three example test shapes below):
  - Test Details — for tests needing fixture setup, multi-step assertions, or
    a "Failure meaning" callout
  - Fixture Corpus — when fixtures are shared across multiple tests
  - Rule–Test Traceability Index — at high test counts (~50+), a reverse
    index from rule IDs to test IDs
  - Source Completeness Gate — when the spec is derived from multiple source docs
  - Suite Partition — when tests must be runner-segregated (unit / integration)
  - Known Gaps — track deferred coverage with a version obligation
  - Out of Scope — guard against scope creep

Don't add a section just to fill it. Delete this comment block, the examples,
and any unused sections once the file is yours.
-->

{One paragraph: what this spec covers, where the tests live, what fixture source they use.}

## Test Matrix

| ID | Test | Validates |
| -- | ---- | --------- |
| [T1](#t1--{slug}) | {one-clause description} | [{anchor}]({link}) |

<!-- EXAMPLE rows drawn from two-layer-retrieval TEST-SPEC.md — delete once you have your own:

| [T3](#t3--f2-and-f3-stratification-canon) | `retrieve("what do we believe about residue?", k=5)` returns only `node_type ∈ {axiom, constitution}` with `status ∈ {consolidated, evergreen}` | [rules.md F2](rules.md#f2--type-stratification), [F3](rules.md#f3--stage-stratification) |
| [T5](#t5--f4-canon-rejects-model-recall-only) | CANON query never returns a `model-recall`-only node | [rules.md F4](rules.md#f4--verification-provenance-respect) |
| [T8](#t8--falsification-vector-only-baseline) | Vector-only baseline disagrees on ≥ 3/9 structurally-demanding queries | [discovery falsification round](../discovery/) |
-->

## Test Details

<!-- Include this section only for tests that need fixture setup, multi-step
     assertions, or whose failure has semantic weight worth recording. Simple
     matrix-row-only tests stay in the matrix above. -->

<!-- EXAMPLE — sample-driven test (drawn from two-layer-retrieval T1):

### T1 — Intent classification

Sample-driven: 3 queries per intent × 8 intents = 24 cases. Each asserts
`classify_intent(query) == expected_intent`. Source queries are fixture-data
inside the test file so they version with the test.
-->

<!-- EXAMPLE — inject-and-assert exclusion test (drawn from two-layer-retrieval T5):

### T5 — F4 CANON rejects model-recall-only

**Cited rule:** [rules.md F4](rules.md#f4--verification-provenance-respect).

Inject a fixture node `M` with body matching the query closely but
`verification: ["model-recall"]`. Assert `M.path` does not appear in
`result.nodes` for any CANON query.
-->

<!-- EXAMPLE — falsification baseline test (drawn from two-layer-retrieval T8):

### T8 — Falsification round (vector-only baseline)

Run a 9-query "structurally-demanding" set through two pipelines:
1. **Two-layer** — the full `retrieve` pipeline.
2. **Vector-only baseline** — skip hard filter and compose; rank purely by body_sim.

Assert top-k orderings disagree (Kendall τ < 1.0 or set difference ≥ 1) for ≥ 3
of the 9 queries.

**Failure meaning:** Failing this test means the two-layer architecture is
empirically indistinguishable from vector RAG on this corpus. The design — not
the test — should be re-examined.
-->

## Known Gaps

<!-- Optional. Each entry names what is not tested, why, and the version obligation. -->

### G1 — {Gap Name}

{What is not tested, why, and the v{n} obligation.}

## Out of Scope

<!-- Optional. List by noun what this spec deliberately does not cover. -->

- {Thing not tested and why.}
