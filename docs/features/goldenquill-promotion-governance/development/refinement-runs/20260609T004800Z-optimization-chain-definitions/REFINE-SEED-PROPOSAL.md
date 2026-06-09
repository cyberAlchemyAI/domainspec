---
feature: goldenquill-promotion-governance
runId: 20260609T004800Z-optimization-chain-definitions
status: pass
capability: refine
---

# Refine Seed Proposal: Optimization Chain Definitions

## Raw Intent

Create an artifact that represents optimization chain definitions as sentences
using grant nodes, outcome KPIs, analytical methods, and the desired BI
optimization produced. Explore multiple expression forms so the same chain can
explain GoldenQuill's competitive advantage in plain language while also acting
as a contract and schema.

## Missing Concept

The current architecture defines grant events, DAG nodes, outcome KPIs,
analytics methods, and BI insight candidates. The missing concept is the
business-language bridge:

```text
grant action + KPI response + method result -> named BI optimization
```

## Selected Unit

`OptimizationChainDefinition`.

This is small enough to validate as JSON, broad enough to explain competitive
advantage, and positioned before owner-approved reuse.

## Non-Goals

- No dashboard UI.
- No automatic promotion from analytics.
- No claim that descriptive or correlation methods prove causation.
- No production data importer.
