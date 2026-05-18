---
tags: [{feature-slug}, spec, rules]
node_type: spec
is_session: false
layer: application
nature: technical, reference
status: draft
version: 0.1.0
last_updated: {YYYY-MM-DD}
---

# Rules: {Feature Name}

<!--
HOW TO USE THIS TEMPLATE

This file declares the behavioral contracts that TEST-SPEC.md checks.

Required for every rule:
  1. A stable identifier in the heading (R1, F1, P-X-1 — pick a namespace
     and never renumber on insert; new rules go at the end of their group).
  2. A "**Checked by:**" link to one or more TEST-SPEC.md anchors.

Optional patterns (use when the rule's content warrants them — three worked
examples below show when each applies):
  - **Type:** State Machine | Policy | Rule | Invariant
  - **Applies To:** [link to domain.md or operations.md anchor]
  - **Formal:** fenced code block with predicate logic
  - Transition Table, Decision Table, Configuration Table, Invariants Table

Rule-of-thumb: if a Type or Applies-To label only restates what the heading
and prose already convey, omit it. Don't pad rules with boilerplate.

Delete this comment block, the examples, and any unused sections once the file is yours.
-->

{One sentence: the load-bearing contract this file makes. Not what it lists.}

---

<!-- EXAMPLE — universal structural invariant.
     Source: internal_tools/graph_retrieval/features/two-layer-retrieval/spec/rules.md F1
     Use for unconditional invariants that hold for every element of a result set. -->

## F1 — Typed-edge preservation

For every node `n` in `result.nodes`, both `n.view.inbound_edges` and
`n.view.outbound_edges` must equal the edges materialized in the corpus for
that path. No edge type may be silently dropped during projection.

**Formal:**
```
∀ n ∈ result.nodes:
    n.view.inbound_edges  == corpus.inbound(n.view.path)
    n.view.outbound_edges == corpus.outbound(n.view.path)
```

**Checked by:** [TEST-SPEC.md T4](TEST-SPEC.md#t4--f1-typed-edge-preservation).

---

<!-- EXAMPLE — intent-conditional rule with piecewise formal block.
     Source: two-layer-retrieval F4
     Use when the rule branches by caller context (hard vs soft constraint). -->

## F4 — Verification-provenance respect

For CANON queries, no node with `verification == ["model-recall"]` may appear
in `result.nodes`. For other intents, model-recall-only nodes must score
strictly below an otherwise-equivalent web-fetched or local-files-read node.

**Formal:**
```
intent == CANON ⇒
    ∀ n ∈ result.nodes: n.view.verification ≠ ["model-recall"]

intent ≠ CANON ⇒
    ∀ pair (a, b) identical except verification,
        a.verification == ["model-recall"] ∧ "web-fetched" ∈ b.verification
            ⇒ score(a) < score(b)
```

**Checked by:** [TEST-SPEC.md T5](TEST-SPEC.md#t5--f4-canon-rejects-model-recall-only).

---

<!-- EXAMPLE — parameterized policy with configuration and constraint tables.
     Source: docs/features/agent-execution-orchestrator/rules.md RetryPolicy
     Use when the rule governs a tuneable behavior with enumerated branches. -->

## RetryPolicy

**Type:** Policy
**Applies To:** [ExecutePipelineRoute](operations.md#executepipelineroute)

### Configuration

| Parameter         | Type    | Default | Description                                |
| ----------------- | ------- | ------- | ------------------------------------------ |
| maxRetries        | integer | 1       | One bounded retry before terminal blocked  |
| narrowingRequired | boolean | true    | Retry must reduce scope or thinking budget |

### Rules

| ID    | Rule                                                    | Formal                                                            |
| ----- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| P-R-1 | Retry count is bounded                                  | `retryCount <= maxRetries`                                        |
| P-R-2 | Retry must narrow execution scope                       | `retryCount > 0 → narrowedScope == true`                          |
| P-R-3 | Retry exhaustion yields deterministic `blocked` outcome | `retryCount == maxRetries ∧ failure → terminalOutcome == blocked` |

**Checked by:** [TEST-SPEC.md T-R-1..T-R-3](TEST-SPEC.md#t-r-1--retry-bounded).

---

## Workflow Invariants

<!-- Optional: cross-reference invariants in workflows.md rather than duplicating. -->

See [workflows.md#invariants](workflows.md#invariants) for I1–I{n}.
