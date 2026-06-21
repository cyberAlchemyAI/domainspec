---
id: test-derivation-engine
feature: test-derivation-engine
title: Test Derivation Engine Interfaces
summary: The CLI surface (roundtrip, derive, emit-tests, lint, self-check) and its exit-code contract.
status: specified
pillar: platform
domain: test-derivation-engine-interfaces
audience:
  - developers
priority: p1
lang: en
owners:
  - framework-core
updatedAt: 2026-06-21
dependencies:
  - SPEC.md
  - operations.md
includes: []
---

# Interfaces: Test Derivation Engine

## Internal: Engine CLI

The engine exposes a CLI (`src/cli.ts`) over the pure pipeline. Exit codes are the contract: `0` success, `1` usage error, `2` not-yet-implemented, `3` round-trip FAIL, `4` lint/validation violations.

### CLI roundtrip

**Exposes:** [RoundTrip](operations.md#roundtrip)

**Request:**

| Field   | Type   | Maps To              |
| ------- | ------ | -------------------- |
| feature | string | RoundTrip.featureDir |

**Responses:**

| Status | Condition                            | Body                                |
| ------ | ------------------------------------ | ----------------------------------- |
| 0      | PASS (missing == 0)                  | Round-trip report                   |
| 3      | FAIL (committed obligations missing) | Round-trip report with missing list |
| 1      | No feature argument                  | Usage error                         |

### CLI derive

**Exposes:** [Derive](operations.md#derive) + [EmitSpec](operations.md#emitspec)

**Request:**

| Field  | Type   | Maps To                                 |
| ------ | ------ | --------------------------------------- |
| target | string | Parse.featureDir (path or feature name) |

**Responses:**

| Status | Condition          | Body                         |
| ------ | ------------------ | ---------------------------- |
| 0      | Success            | TEST-SPEC markdown on stdout |
| 1      | No target argument | Usage error                  |

### CLI lint

**Exposes:** [Lint](operations.md#lint)

**Responses:**

| Status | Condition                                        | Body                        |
| ------ | ------------------------------------------------ | --------------------------- |
| 0      | Clean (no violations)                            | Lint report                 |
| 4      | Non-canonical tables or needs_formal cells found | Lint report with violations |
| 1      | No target argument                               | Usage error                 |

### CLI self-check

**Exposes:** [RoundTrip](operations.md#roundtrip) rule R3 (falsifiability / negative control)

**Responses:**

| Status | Condition                                            | Body               |
| ------ | ---------------------------------------------------- | ------------------ |
| 0      | Negative control passes (gate can report missing)    | Self-check report  |
| 3      | Gate failed to detect an injected/removed obligation | Self-check failure |
