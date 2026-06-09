---
feature: goldenquill-promotion-governance
runId: 20260609T004800Z-optimization-chain-definitions
status: pass
capability: invoke
mode: define-design-refresh
---

# Invoke Result: Optimization Chain Definitions

## Intent

Author and integrate governed artifacts that define GoldenQuill optimization
chains as plain-language BI sentences, implementation contracts, and JSON Schema
fixtures.

## Outputs

| Output | Path |
| --- | --- |
| Canonical companion artifact | `optimization-chains.md` |
| JSON Schema | `schemas/optimization-chain.schema.json` |
| Example fixture | `examples/optimization-chain.red-team-review.json` |
| Refine evidence | `development/refinement-runs/20260609T004800Z-optimization-chain-definitions/RESULT.md` |

## Source Signals

| Source | Signal |
| --- | --- |
| `analytics-methods.md` | Existing action facts, KPI response windows, method specs, associations, and BI insight candidate profile. |
| `SPEC.md` | Existing grant nodes, KPI rules, capability map, and approved reuse authority chain. |
| User request | Need same chain expressed as plain language, competitive advantage, contract, and schema. |

## Applied Decisions

- Name the bridge artifact `OptimizationChainDefinition`.
- Require seven expression forms for every chain.
- Require `claim_label`, `confidence_class`, `privacy_scope`, and governance
  route before BI reuse.
- Keep owner decision as the first source of approved allowed uses.

## Verdict

Pass. The optimization-chain layer is now represented as artifact, schema,
fixture, and canonical references.
