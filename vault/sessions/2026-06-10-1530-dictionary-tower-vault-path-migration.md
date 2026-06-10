---
tags: [vault, ontology, architecture, agents]
node_type: conceptual
is_session: true
layer: ontology, architecture
nature: explanatory
status: active
created: 2026-06-10
timestamp: 2026-06-10T15:30:00-03:00
expires: 2026-08-09
conversation_id: 2026-06-10-dictionary-tower-vault-path-migration
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 6
importance_rationale: "Establishes the two-pole-tower framing and dictionary population model as provenance for future dictionary/metrics design, though no doc was promoted and three forks stay open."
---

# Dictionary as Vault↔Code Link — Two-Pole Tower & Dead-Path Migration

## Summary

Started as "link the vault to code via a business dictionary" and deepened into a formal model: a **two-pole tower** where a provable functor (domain L1 → code L2, Δ) sits between two *declared, non-derivable* poles — epistemic axioms (bottom) and business-metric objective functions (top) — organized around Gödel/Tarski/Goodhart and domainspec-theorem's proven reflection-tower results (no finite closure, no fixed point, asymmetric D/V/H climbing). Defined the dictionary's format (typed YAML nodes+edges), its population without the question-game (many triggers → intake backlog → single validation gate; necessity = graph-path to a metric/decision; detection = classifying domain *statements* not isolated words; eager-capture/lazy-validate/forced-at-use), and a business-metrics dictionary as same-graph nodes (`trades-off` edge = home of "less-local" optimization). Then executed a repo-wide `docs/vault/` → `vault/` dead-path migration (~43 refs) across skill trees, `AGENTS.md`, `CLAUDE.md`, and two constitutions — dictionary refs deprecate-noted (artifact never built), two reviewers PASS-WITH-NOTES, parity fix applied, three refs flagged for user, nothing committed. Design captured in scratchpad; framing forks (schema owner, dictionary shape, canonical skill tree, discovery-placement taxonomy) remain open. Parallel materialization noted: `/ontology-view` skill now exists as the typed-graph L1 formalization.

## Files touched

- CLAUDE.md, AGENTS.md
- .claude/skills/** and .agents/skills/** (11 mirrored skill files: dead-path migration + dictionary deprecate-notes)
- vault/constitution/domain-tagging-constitution.md
- vault/constitution/event-system-constitution.md
