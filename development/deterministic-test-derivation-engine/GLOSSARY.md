---
module: deterministic-test-derivation-engine
node_type: glossary
version: current
status: draft
updatedAt: 2026-06-12
docType: glossary-ontology
---

# Glossary — Deterministic Test-Derivation Engine

Terminology authority for the engine. Terms are stable identifiers used across SPEC, ARCHITECTURE, and WORK-PACK.

| Term                        | Definition                                                                                                                                                                | Notes                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Derivation function (δ)** | The pure total function `δ(G, Δ) → Obligation[]` that maps a concept graph + rule set to test obligations.                                                                | The heart of determinism: same inputs → identical output, no side effects, no LLM.                                                                |
| **Concept graph (G)**       | Typed in-memory representation of one feature's formal docs: typed nodes + typed edges, each carrying a source anchor.                                                    | Sorted by `source_anchor` so serialization is deterministic.                                                                                      |
| **Rule set (Δ)**            | The derivation rules from `TEST-PIPELINE.md`, encoded as pure functions over `G`.                                                                                         | Replaces the free-text rules the LLM previously interpreted.                                                                                      |
| **Obligation**              | A single derived test requirement (e.g. "transition X→Y on event E must succeed").                                                                                        | The unit of test coverage; carries an `obligation_key`.                                                                                           |
| **obligation_key**          | `sha1(source_anchor \| rule_type \| canonical_params)` — a content-addressed, byte-stable ID.                                                                             | Dissolves E1's "Jaccard over hand-numbered IDs" problem structurally.                                                                             |
| **source_anchor**           | `{file}#{heading}:{row-index}` — provenance pointer from an obligation/node back to the exact doc location.                                                               | Gives traceability _by construction_ (addresses E2's circular-traceability finding honestly: it IS by construction, and is declared as such).     |
| **canonical_params**        | The sorted, normalized parameters of a rule application (state names, event names, field paths, expression hash).                                                         | Normalization is what makes two semantically-identical obligations hash equal.                                                                    |
| **Canonical form**          | The strict Markdown-table shape feature docs must take for the parser to accept them (fixed columns, `Formal` cells).                                                     | Enforced by the linter CI gate; non-canonical docs are rejected, not guessed.                                                                     |
| **needs_formal**            | A flag on a node/obligation whose `Formal` cell is prose the grammar cannot parse.                                                                                        | The deterministic escape hatch: counted and surfaced, never silently interpreted. Keeps the engine deterministic about what it _can't_ formalize. |
| **Exact cardinality**       | Replacing TEST-PIPELINE's open cardinalities ("at least 2", "1+") with an exact enumeration function over a row's typed structure.                                        | EXISTENCE→2, PRESENCE→#conjuncts, RANGE→4, COUNT_CAP→2; invalid-transition = `non-terminal-states × events − valid`.                              |
| **emit_spec**               | Engine output that renders a `TEST-SPEC.md` (rows ordered by `obligation_key`).                                                                                           | Drop-in replacement for the LLM skill's document output.                                                                                          |
| **emit_tests**              | Engine output that renders runnable vitest mapped 1:1 to obligation_keys.                                                                                                 | Removes E3's "spec is a doc, not code" implementer confound.                                                                                      |
| **Round-trip gate**         | The L0 falsification check: parse the committed `TEST-SPEC.md` into obligation_keys and assert the engine's set ⊇ it (extras allowed where the human wrote "at least N"). | Cheapest test of whether deterministic derivation is real, before any experiment spend.                                                           |
| **Extraction-completeness** | The residual research question once δ is deterministic by construction: does the parser capture everything the docs encode?                                               | The reframed E1 (→ E1a). Measured by recall vs a gold `G` + benign-edit invariance.                                                               |

## Distinctions worth keeping straight

- **Determinism vs completeness.** δ is deterministic _by construction_ (a property test). Whether it captures all intended obligations is **completeness** — a separate, empirical question (E1a). Do not conflate.
- **Engine output vs LLM output.** Every experiment must state which is the surface-under-test. The strong C2 claim is about the **engine**, not the LLM skill.
