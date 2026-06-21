---
id: test-derivation-engine
feature: test-derivation-engine
title: Test Derivation Engine Operations
summary: The pure pipeline operations — parse, derive, assign-key, emit, round-trip, lint — with formal rules and postconditions.
status: specified
pillar: platform
domain: test-derivation-engine-operations
audience:
  - developers
priority: p1
lang: en
owners:
  - framework-core
updatedAt: 2026-06-21
dependencies:
  - SPEC.md
  - interfaces.md
includes: []
---

# Operations: Test Derivation Engine

## Domain Policy Ownership

- Parser: [`tools/test-derivation-engine/src/grammar/index.ts`](../../../tools/test-derivation-engine/src/grammar/index.ts)
- Derivation (δ): [`tools/test-derivation-engine/src/rules/index.ts`](../../../tools/test-derivation-engine/src/rules/index.ts)
- Keys: [`tools/test-derivation-engine/src/keys/index.ts`](../../../tools/test-derivation-engine/src/keys/index.ts)
- Round-trip: [`tools/test-derivation-engine/src/roundtrip/index.ts`](../../../tools/test-derivation-engine/src/roundtrip/index.ts)

## Parse

**Type:** Operation (pure)
**Actor:** engine pipeline
**Triggers:** derive(featureDir)

### Input

| Field      | Type   | Required | Description                                 |
| ---------- | ------ | -------- | ------------------------------------------- |
| featureDir | string | yes      | Directory holding the canonical aspect docs |

### Rules

| ID  | Rule                                                         | Formal                                                     |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| R1  | feature dir must contain at least one canonical aspect doc   | `exists(aspectDoc in featureDir)`                          |
| R2  | a parsed table must match a known column signature           | `tableColumns != null and tableColumns in knownSignatures` |
| R3  | a non-canonical table is rejected, never guessed             | `nonCanonical(table) -> reject(table)`                     |
| R4  | a prose Formal cell is flagged needs_formal, not interpreted | `unparseable(formalCell) -> needs_formal = true`           |

### Postconditions

| ID  | Class                 | Guarantee                                             | Formal Assertion                                  | Traceability                     |
| --- | --------------------- | ----------------------------------------------------- | ------------------------------------------------- | -------------------------------- |
| P1  | Integration Guarantee | Returns a typed ConceptGraph.                         | `result != null and type(result) = ConceptGraph`  | [ConceptGraph](SPEC.md#concepts) |
| P2  | Determinism Guarantee | Nodes are sorted by source_anchor.                    | `isSorted(G.nodes, by = source_anchor)`           | [Derive](#derive)                |
| P3  | Audit Guarantee       | A rejected table produces a violation with file:line. | `rejected(table) -> exists violation(file, line)` | [Lint](#lint)                    |

## Derive

**Type:** Operation (pure, total)
**Actor:** engine pipeline
**Triggers:** derive(G, Δ)

### Rules

| ID  | Rule                                                                | Formal                                                                       |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| R1  | δ is pure and total over a valid G                                  | `forall G: derive(G) != error`                                               |
| R2  | δ is deterministic                                                  | `derive(G) == derive(G)`                                                     |
| R3  | invariant cardinality is exact by class                             | `card(invariant) in {EXISTENCE:2, PRESENCE:conjuncts, RANGE:4, COUNT_CAP:2}` |
| R4  | invalid-transition is the exact Cartesian remainder                 | `invalidTransitions = (nonTerminalStates * events) - validTransitions`       |
| R5  | a rule referencing an absent node type blocks, never silently skips | `ruleRefsAbsentType -> block`                                                |

### Calculations

| ID  | Calculation                | Formula                                                        |
| --- | -------------------------- | -------------------------------------------------------------- |
| C1  | invalid-transition count   | `len(nonTerminalStates) * len(events) - len(validTransitions)` |
| C2  | invariant obligation count | `classify(formal).count`                                       |

### Postconditions

| ID  | Class                 | Guarantee                                   | Formal Assertion                               | Traceability                                                |
| --- | --------------------- | ------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| P1  | Determinism Guarantee | Same (G, Δ) yields identical obligations.   | `derive(G) == derive(G)`                       | [SPEC](SPEC.md#why-this-feature-is-specified-in-domainspec) |
| P2  | Integration Guarantee | Every obligation carries an obligation_key. | `forall o in result: o.obligation_key != null` | [AssignKey](#assignkey)                                     |

## AssignKey

**Type:** Operation (pure)
**Actor:** engine pipeline
**Triggers:** per derived obligation

### Calculations

| ID  | Calculation    | Formula                 |
| --- | -------------- | ----------------------- | ----------------- | ------------------------------------- |
| C1  | obligation key | `sha1(source_anchor + " | " + rule_type + " | " + canonicalJson(canonical_params))` |

### Rules

| ID  | Rule                                      | Formal                                |
| --- | ----------------------------------------- | ------------------------------------- |
| R1  | key is byte-stable across runs            | `key(o) == key(o)`                    |
| R2  | key is invariant to param insertion order | `key(params) == key(reorder(params))` |

### Postconditions

| ID  | Class                 | Guarantee                                            | Formal Assertion           | Traceability      |
| --- | --------------------- | ---------------------------------------------------- | -------------------------- | ----------------- |
| P1  | Determinism Guarantee | Two runs over the same docs emit identical key sets. | `keys(run1) == keys(run2)` | [Derive](#derive) |

## EmitSpec

**Type:** Operation (pure)
**Actor:** engine pipeline
**Triggers:** emit_spec(obligations)

### Rules

| ID  | Rule                               | Formal                                |
| --- | ---------------------------------- | ------------------------------------- |
| R1  | rows are ordered by obligation_key | `isSorted(rows, by = obligation_key)` |

### Postconditions

| ID  | Class                 | Guarantee                                             | Formal Assertion                              | Traceability            |
| --- | --------------------- | ----------------------------------------------------- | --------------------------------------------- | ----------------------- |
| P1  | Determinism Guarantee | emit_spec output is byte-identical across runs.       | `emit(run1) == emit(run2)`                    | [AssignKey](#assignkey) |
| P2  | Integration Guarantee | emit_tests maps one runnable case per obligation_key. | `forall o: exists testCase(o.obligation_key)` | [EmitTests](#emitspec)  |

## RoundTrip

**Type:** Operation (pure)
**Actor:** verification / experiments
**Triggers:** roundtrip(featureDir)

### Rules

| ID  | Rule                                                                | Formal                                                 |
| --- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| R1  | engine set must cover the committed set                             | `derivedKeys superset committedKeys`                   |
| R2  | injectivity: distinct human obligations never collapse to one key   | `forall a,b committed: a != b -> semId(a) != semId(b)` |
| R3  | falsifiability: an injected sentinel obligation is reported missing | `inject(sentinel) -> sentinel in report.missing`       |

### Postconditions

| ID  | Class           | Guarantee                                    | Formal Assertion                           | Traceability             |
| --- | --------------- | -------------------------------------------- | ------------------------------------------ | ------------------------ |
| P1  | Audit Guarantee | PASS only when nothing committed is missing. | `report.pass = (len(report.missing) == 0)` | [SPEC](SPEC.md#concepts) |

## Lint

**Type:** Operation (pure)
**Actor:** CI gate
**Triggers:** lint(featureDir)

### Rules

| ID  | Rule                                       | Formal                               |
| --- | ------------------------------------------ | ------------------------------------ |
| R1  | non-canonical tables are reported          | `count(nonCanonicalTables) reported` |
| R2  | needs_formal cells are counted, not hidden | `count(needs_formal) reported`       |

### Postconditions

| ID  | Class           | Guarantee                             | Formal Assertion                    | Traceability                            |
| --- | --------------- | ------------------------------------- | ----------------------------------- | --------------------------------------- |
| P1  | Audit Guarantee | Lint exits non-zero on any violation. | `(violations > 0) -> exitCode != 0` | [interfaces.md](interfaces.md#cli-lint) |
