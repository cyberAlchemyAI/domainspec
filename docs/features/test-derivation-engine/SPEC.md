---
id: test-derivation-engine
feature: test-derivation-engine
title: Test Derivation Engine
summary: Deterministic engine that compiles canonical feature docs into byte-stable test obligations; specified as a DomainSpec feature so it can derive its own tests.
status: specified
pillar: platform
domain: test-derivation-engine
audience:
  - developers
priority: p1
lang: en
owners:
  - framework-core
updatedAt: 2026-06-21
dependencies:
  - operations.md
  - interfaces.md
includes: []
---

# Spec: Test Derivation Engine

## Why this feature is specified in DomainSpec

The engine consumes DomainSpec feature docs (`states/operations/interfaces/events`) and compiles them into test obligations. Specifying the engine **itself** in that same canonical format makes it **self-derivable**: the engine can run on this feature and derive its own TEST-SPEC — a deterministic fixpoint that is the strongest available proof of the C2 (determinism-by-construction) claim.

Scope decision (2026-06-21): model the aspects that genuinely fit a pure pipeline — **operations** and **interfaces**. `states.md` and `events.md` are intentionally omitted: the engine is a stateless pure pipeline, and forcing a state machine / domain events would be over-built docs (rejected). See [operations.md](operations.md) and [interfaces.md](interfaces.md).

## Core property: the engine's gap output is a spec-formalization metric

This is the engine's most important property — arguably more than test generation itself, and the **dual of its soundness + honesty**:

> The engine derives a test **only** from a closed, checkable spec expression, and otherwise **refuses** (flags `needs_formal` / `coverage_gap`) rather than guessing.

By the contrapositive, **everything the engine cannot derive is a precise, mechanical signal that the spec is not formal enough there.** A sound deterministic deriver that will not fabricate _is, by construction, a spec-completeness analyzer_: its `coverage_gap` count is a **spec-quality metric**, and each gap is a "the spec is under-formalized here" pointer. Two complementary lenses:

- **`needs_formal`** → _un-formalized_ spec (a behavior is named but no closed formula is given) — e.g. C4 `applyMakeupPolicy(...)` as an opaque call before a formula was authored.
- **mutation survivors** (E3) → _under-formalized_ spec (a formula exists but is incomplete) — e.g. the C4 closed form as an under-model that leaves the payout-share path unspecified.

This is exactly what an LLM test generator _cannot_ do: faced with an opaque obligation it **fabricates** a plausible test silently, **hiding** the spec gap. The deterministic engine, by refusing, **converts spec incompleteness into a visible, counted, actionable signal** — and a feedback loop: _write more formal spec → more derived tests → fewer gaps → measurably more complete spec._ Empirically demonstrated 2026-06-21: authoring C4 closed-form moved the derived mutation arm 38.75% → 54.37% (makeup-policy 17.2% → 36.56%), with the derived assertions passing against the real code (no spec/impl mismatch) — see [E3 results](../../research/results/E3-results.md) and the [SMT/FOL tower](../../../../research/smt-fol-test-derivation/DISTILLED-KNOWLEDGE.md).

Honest scope: this measures **formalization** completeness (where the spec is formal enough to derive), which is distinct from coverage-vs-ground-truth (recall against an independent gold obligation set) — both matter; they are different axes.

## Domain Policy Ownership

- Parser authority: [`tools/test-derivation-engine/src/grammar/index.ts`](../../../tools/test-derivation-engine/src/grammar/index.ts)
- Derivation (δ) authority: [`tools/test-derivation-engine/src/rules/index.ts`](../../../tools/test-derivation-engine/src/rules/index.ts)
- Obligation key authority: [`tools/test-derivation-engine/src/keys/index.ts`](../../../tools/test-derivation-engine/src/keys/index.ts)
- Round-trip / gate authority: [`tools/test-derivation-engine/src/roundtrip/index.ts`](../../../tools/test-derivation-engine/src/roundtrip/index.ts)
- Emitters: [`tools/test-derivation-engine/src/emit/`](../../../tools/test-derivation-engine/src/emit/)

## Concepts

| Concept          | Type       | Key constraints                                                                                |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| ConceptGraph (G) | Record     | typed nodes + typed edges; nodes sorted by `source_anchor` for deterministic serialization     |
| Obligation       | Record     | carries `obligation_key`, `rule_type`, `source_anchor`, `canonical_params`                     |
| ObligationKey    | Value Type | `sha1` hex; byte-stable across runs and machines; order-invariant over params                  |
| RuleSet (Δ)      | Record     | the derivation rules, encoded as pure functions in `src/rules/`                                |
| FormalExpr       | Value Type | parsed AST of a `Formal` cell; classes EXISTENCE / PRESENCE / RANGE / COUNT_CAP / UNCLASSIFIED |
| RoundTripReport  | Record     | `missing`, `extra`, `pass`; PASS iff `missing == 0` under a normalized semantic identity       |

## Capabilities

| Capability | Outcome                     | Operation                                      |
| ---------- | --------------------------- | ---------------------------------------------- |
| Parse      | canonical docs → typed `G`  | [Parse](operations.md#parse)                   |
| Derive     | pure δ produces obligations | [Derive](operations.md#derive)                 |
| Identify   | byte-stable obligation ids  | [AssignKey](operations.md#assignkey)           |
| Emit       | TEST-SPEC + runnable tests  | [EmitSpec / EmitTests](operations.md#emitspec) |
| Verify     | falsifiable round-trip gate | [RoundTrip](operations.md#roundtrip)           |

## Produces For

The engine produces a feature's `TEST-SPEC.md` (and optional runnable vitest), replacing the LLM-backed `domainspec-generate-tests`. Self-application: this feature's own `TEST-SPEC.md` is derivable by [Derive](operations.md#derive) over [operations.md](operations.md) + [interfaces.md](interfaces.md).

## Cross-references

- Invoke-format design baseline (architecture): [`development/deterministic-test-derivation-engine/`](../../../development/deterministic-test-derivation-engine/)
- Engine Craft ledger: [`tools/test-derivation-engine/.craft/ledger.yml`](../../../tools/test-derivation-engine/.craft/ledger.yml)
- C2 refine result: [`development/refinement-runs/2026-06-21-c2-engine-to-evidence/RESULT.md`](../../../development/refinement-runs/2026-06-21-c2-engine-to-evidence/RESULT.md)
