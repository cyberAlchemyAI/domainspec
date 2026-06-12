---
tags: [vault, agents, ontology]
node_type: audit
is_session: true
layer: ontology
nature: explanatory
status: active
created: 2026-06-12
timestamp: 2026-06-12T14:33:34-03:00
expires: 2026-08-11
conversation_id: anti-bias-evaluator-retirement
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Retiring evaluator locks the 4-role canon across the research skill and its governing discovery; any future spec or validator referencing evaluator is now a traceable schema violation."
---

# Evaluator role retired from anti-bias vector composition

## Summary

While reconciling the sibling `domainspec-theorem` `research` dispatch skill with this vault's research-constitution and `anti-bias-vector-composition` discovery, the owner decided to retire the `evaluator` role everywhere: 0 of 55 real dispatches ever used it, and the finalized 4-role set (explorer/skeptic/writer/auditor) carries none — criteria-scoring now folds into a `skeptic` with a stated gate. The three anti-bias discovery files were amended to drop `evaluator` from the subject-layer set (validator-check Item 1), the role enumerations (principle), and the false-consensus worked example (examples, recast to a skeptic layer), each with a dated retirement note. The research-constitution was only read (it never named evaluator), not edited.

## Contradictions

- The `evaluator` role enumerated across the `anti-bias-vector-composition` discovery was contradicted by practice (0 of 55 dispatches used it) and is now retired in all three files; the surviving subject-layer set is `{explorer, skeptic}`.

## Files touched

- vault/discovery/anti-bias-vector-composition/principle.md
- vault/discovery/anti-bias-vector-composition/validator-check.md
- vault/discovery/anti-bias-vector-composition/examples.md
- vault/constitution/research-constitution.md
- vault/discovery/subagents-strategy-refinement/role-taxonomy.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/anti-bias-vector-composition/principle.md` | `modifies` | Dropped `evaluator` from the role enumeration and the "where this applies" bullets; added a dated retirement note pointing at validator-check.md. |
| `vault/discovery/anti-bias-vector-composition/validator-check.md` | `modifies` | Item-1 subject-layer set `{explorer, skeptic, evaluator}` → `{explorer, skeptic}`; parse target switched from a `layers` block to the `composition` layers; retirement note added. |
| `vault/discovery/anti-bias-vector-composition/examples.md` | `modifies` | Recast the Example-4 false-consensus scenario from an `evaluator` layer to a `skeptic` layer; dropped `evaluator` from the "how to use" shapes. |
| `vault/constitution/research-constitution.md` | `consumes` | Read as the canonical 4-role source (R4–R8); confirmed it never named `evaluator`, so no constitution edit was needed. |
| `vault/discovery/subagents-strategy-refinement/role-taxonomy.md` | `consumes` | The 4+1 role taxonomy; confirmed `evaluator` is absent and criteria-scoring folds into `skeptic`. |
