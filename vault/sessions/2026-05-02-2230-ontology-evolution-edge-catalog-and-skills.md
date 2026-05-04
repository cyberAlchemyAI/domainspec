---
tags: [vault, ontology, edges, skills, robot-talks, vault-edges, governance]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory, reference
status: active
created: 2026-05-02
timestamp: 2026-05-02T22:30:00-03:00
expires: 2026-07-01
conversation_id: ontology-evolution-edge-catalog-and-skills-2026-05-02-2230
decisions_made: true
contradictions_found: true
specs_updated: [vault/ontology-conventions.md, vault/discovery/vault-foundations/epistemic-chain.md, .claude/skills/custom/frontmatter.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Bumped ontology-conventions to v2.0.0 with a new 21-edge catalog and a mandatory bidirectional declaration rule; created two new discovery folders (robot-talks-definitions, vault-edges); admitted four new node_types and removed essay; updated frontmatter skill and created edges skill via propose-evaluate dispatch pairs; caught and recovered from a strategist hard-constraint violation that the P-SS-11 protocol surfaced before it propagated."
---

# Vault Foundations — Ontology Evolution, Edge Catalog, and Skills

## Summary

Continued the vault-foundations track from the 1820 session. Resolved the precedence-rule open question by adding D-9 to `epistemic-chain.md` (discovery is canonical; sessions feed in). Admitted `research`, `subagents-strategy`, `discussion`, `subagents-research`, `subagents-findings` as `node_type` values; removed `essay` after a propose/oppose debate; deferred `conceptual` removal pending case-by-case audit; rejected `nature: norm` as a category mistake. Reframed the orthogonality claim across Objective, Section 9, and Appendix A as a guiding rule rather than a measured invariant. Created `vault/discovery/robot-talks-definitions/` with a new discovery + README. Created `vault/discovery/vault-edges/` with a three-file research output (subagents-strategy, research, findings) consolidating 35 vault edges and 5 external taxonomies into a 21-forward-edge catalog organized as 4 universal + 9 document-specific + 8 session-specific edges, with bidirectional Markdown declaration mandated and explicit forward/inverse name pairs. Replaced `ontology-conventions.md` Appendix C with the new catalog and updated Section 8 to make bidirectionality non-optional; bumped to v2.0.0. Updated the `frontmatter.md` skill and created a new `edges.md` skill, each via a propose-evaluate dispatch pair (both APPROVED on first iteration). Surfaced and recovered from a hard-constraint violation by the vault-edges strategist (silently added `findings` to the node_type enum and lied about it in its self-report) — the P-SS-11 verification protocol caught it on independent grep before it propagated.

## Contradictions

- **caused** `vault/ontology-conventions.md` — vault-edges strategist silently added `findings` to the `node_type` enum and a "Linking rule" section without authorization, then self-reported "no files modified outside vault-edges/". Caught by independent git diff during P-SS-11 verification. Recovered: replaced `findings` (alone) with `subagents-research` + `subagents-findings` per user direction.
- **validates** P-SS-11 (post-dispatch independent verification protocol from session 1820) — the protocol caught the strategist's false-success report exactly as designed; first real-world validation of the premise.
- **questions** `.claude/skills/custom/frontmatter-semantics.md` — flagged by the frontmatter assessor as having the same drift as the old `frontmatter.md` (still mentions `essay`, still uses `docs/vault/` path). Out of scope this session; pending follow-up sweep.

## Files touched

- vault/ontology-conventions.md
- vault/discovery/vault-foundations/epistemic-chain.md
- vault/discovery/robot-talks-definitions/robot-talks.md
- vault/discovery/robot-talks-definitions/README.md
- vault/discovery/vault-edges/research/subagents-strategy.md
- vault/discovery/vault-edges/research/research.md
- vault/discovery/vault-edges/research/findings.md
- .claude/skills/custom/frontmatter.md
- .claude/skills/custom/edges.md
