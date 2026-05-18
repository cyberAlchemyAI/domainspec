---
tags: [internal-tools, graph-retrieval, two-layer-retrieval, spec, rules, faithfulness]
node_type: spec
is_session: false
layer: ontology, application
nature: technical, reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Rules: Two-Layer Retrieval

The faithfulness contract — the load-bearing reason this feature exists.

Per lens 02 of the
[discovery](../../../../../vault/discovery/two-layer-retrieval/), a
retriever is faithful iff it commutes with the Yoneda embedding up to
natural isomorphism. The operational restatement below is what
[TEST-SPEC.md](TEST-SPEC.md) checks. Pure vector retrieval violates F1,
F4, and F5 by construction — see lens 02 of the discovery for the proof
sketch.

## F1 — Typed-edge preservation

For every node `n` in `result.nodes`, both
[n.view.inbound_edges](domain.md#nodeview) and
[n.view.outbound_edges](domain.md#nodeview) must equal the edges
materialized in the corpus for that path. No edge type may be silently
dropped during [projection](workflows.md#step-3-nodeview-projection),
even if the active intent's compose-function does not consume it.

**Formal:**
```
∀ n ∈ result.nodes:
    n.view.inbound_edges  == corpus.inbound(n.view.path)
    n.view.outbound_edges == corpus.outbound(n.view.path)
```

**Checked by:** [TEST-SPEC.md T4](TEST-SPEC.md#t4--f1-typed-edge-preservation).

## F2 — Type stratification

For intents with `node_type` hard filters (`CANON`, `DEFINITIONAL`),
every returned node must satisfy the filter. See
[../../../compose.py](../../../compose.py) lines 55, 94 for the filter
predicates.

**Formal:**
```
intent == CANON         ⇒ ∀ n: n.view.node_type ∈ {"axiom", "constitution"}
intent == DEFINITIONAL  ⇒ ∀ n: n.view.node_type == "conceptual"
```

**Checked by:** [TEST-SPEC.md T3](TEST-SPEC.md#t3--f2-and-f3-stratification-canon).

## F3 — Stage stratification

For intents with `status` hard filters (`CANON`, `DEFINITIONAL`,
`FRONTIER`), every returned node must satisfy the filter.

**Formal:**
```
intent == CANON         ⇒ ∀ n: n.view.status ∈ {"consolidated", "evergreen"}
intent == DEFINITIONAL  ⇒ ∀ n: n.view.status ∈ {"active", "consolidated", "evergreen"}
intent == FRONTIER      ⇒ ∀ n: n.view.status ∈ {"draft", "exploratory"}
```

**Checked by:** [TEST-SPEC.md T3](TEST-SPEC.md#t3--f2-and-f3-stratification-canon).

## F4 — Verification-provenance respect

For `CANON`, no node with `verification == ["model-recall"]` may appear
in `result.nodes`. For other intents, model-recall-only nodes must score
strictly below an otherwise-equivalent web-fetched or local-files-read
node. The numerical mechanism lives in `verification_prior` at
[../../../compose.py](../../../compose.py) lines 41–49.

**Formal:**
```
intent == CANON ⇒
    ∀ n ∈ result.nodes: n.view.verification ≠ ["model-recall"]

intent ≠ CANON ⇒
    ∀ pair (a, b) with identical fields except verification,
        a.verification == ["model-recall"] ∧ "web-fetched" ∈ b.verification
            ⇒ score(a) < score(b)
```

**Checked by:** [TEST-SPEC.md T5](TEST-SPEC.md#t5--f4-canon-rejects-model-recall-only).

## F5 — Supersedes pathology

Given nodes `A` and `A'` where `A' supersedes A` (i.e. `A` ∈
`A'.inbound_edges["supersedes"]`'s mirror), a `CANON` query whose body
matches both equally must rank `A'` strictly above `A`. This is the
counterexample lens 02 derives for pure vector retrieval.

**Formal:**
```
intent == CANON ∧ A' supersedes A ∧ body_sim(query, A) == body_sim(query, A')
    ⇒ score(A') > score(A)
```

**Checked by:** [TEST-SPEC.md T6](TEST-SPEC.md#t6--f5-supersedes-pathology).

## Workflow invariants

See [workflows.md#invariants](workflows.md#invariants) for I1–I4
(result-shape invariants on the `retrieve` workflow itself).
