---
tags: [vault, ontology, architecture, agents]
node_type: research
is_session: true
layer: ontology, architecture
nature: procedural, explanatory
status: active
created: 2026-06-01
timestamp: 2026-06-01T12:13:00-03:00
expires: 2026-07-31
conversation_id: vault-cycle-commits-and-readme-zigzag-2026-06-01
decisions_made: false
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 6
importance_rationale: "Closed the May 26–27 work cycle by grouping 12 commits and ran a 3-agent zig-zag to update the root README, producing a useful provenance trail for the ontology v2.3.0 / constitution bump cluster without ratifying new design decisions."
---

# Vault Cycle Commits + README Zig-Zag Update

## Summary

The session committed and pushed 12 thematically grouped commits closing the May 26–27 work cycle — ontology v2.3.0 (3-category edge split, 22 forward edges), folder-structure v3.0.0 (framework-agnostic), discovery-structure v0.2.0 (placement governance), subagents-strategy v0.3.0 (per-layer modes, pipeline, exit_reason), a new research-constitution v0.2.0, plus discovery seeds, sessions, and a UserPromptSubmit hook. Then ran a 3-agent zig-zag (research → propose → review) over 2 rounds to update the root `README.md`, applying 10 edits that disambiguate the spec-layer taxonomy (24/26) from the vault graph schema (22 forward edges / 3 categories), add a new "Vault & Governance" section, surface AGENTS / PRODUCT-COMPONENTS-IDEA / TOBANOV in Navigation, mention `inject-domainspec-axioms.sh`, and add 7 vault-governance rows to the Reference table. README change is uncommitted pending user diff review. Two follow-up observations surfaced but were not resolved: `vault/ontology-conventions.md` has an internal "21 vs 22 edges" inconsistency (line 322 vs line 556), and `CLAUDE.md` Route #2 points to a non-existent `docs/vault/agent-navigation.md` path.

## Files touched

- README.md
