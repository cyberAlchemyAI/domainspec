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
