---
tags: [vault, architecture, ontology, pipeline, internal-tools]
node_type: audit
is_session: true
layer: [architecture, ontology]
nature: technical
status: active
created: 2026-05-19
timestamp: 2026-05-19T14:30:12-03:00
expires: 2026-07-18
conversation_id: internal-tools-spec-and-kernel-debt-2026-05-19
decisions_made: true
contradictions_found: true
specs_updated:
  - internal_tools/vault_common/features/spec/SPEC.md
  - internal_tools/vault_ctl/features/spec/SPEC.md
  - internal_tools/vault_governance/features/README.md
promoted_candidates: []
expected_importance: 9
importance_rationale: "Closed five kernel debts that had caused the on-disk implementation to silently contradict the vault constitution, doubled test coverage with zero regressions, and relocated three subsystems."
---

# Internal-Tools Spec + Kernel Debt Closure

## Summary

Triaged 18 `/vault/discovery` folders to identify which need implementation, then dispatched parallel spec-writer subagents producing DomainSpec specs for `vault_common` (shared kernel) and `vault_ctl` (validator/snapshotter) under the new `/internal_tools/<tool>/features/` convention. Both specs returned `flag` because the on-disk kernel had drifted from the constitution it claimed to operationalize, so a second implementer pass closed five kernel debts (NodeType→16, hard-reject unknowns, body-edge parsing, `forward_only_reason` on `Edge`, LLM-agnostic embedder) and fixed one deprecated edge in `epistemic-chain.md`. On user authorization a third pass executed the D-5 module relocation — creating `vault_governance/` (bundling amendments+governance), moving bets into `vault_telemetry/`, slimming `vault_ctl`'s CLI. Tests 42 → 84 passing, zero regressions; corpus audit found 0 silent-zero parses across 194 vault files.

## Contradictions

- validates `vault/constitution/frontmatter-ownership-constitution.md` — confirmed its 16-NodeType ontology as authoritative; kernel brought into compliance.
- contradicts pre-session `vault_common/frontmatter.py` and `embedder.py` — NodeType had 6 values, validate_node fell back silently, embedder hard-coded provider names; all fixed.
- contradicts `vault/discovery/domainspec-vault-foundations/epistemic-chain.md` — carried deprecated `provenance-for` edge; replaced with canonical successor.

## Files touched

- internal_tools/vault_common/{features/**, frontmatter.py, edges.py, embedder.py, embedders/**, governance.py, __init__.py}
- internal_tools/vault_ctl/{features/**, cli.py}
- internal_tools/vault_governance/{features/README.md, amendments.py, governance.py, _kernel_amendments.py, _kernel_validators.py, __init__.py}
- internal_tools/vault_telemetry/{bets.py, _bets_kernel.py, cli.py, __init__.py}
- internal_tools/tests/{test_frontmatter.py, test_edges.py, test_embedder_kernel_isolation.py, test_two_layer_retrieval.py}
- internal_tools/scripts/audit_body_edges.py
- internal_tools/pyproject.toml
- vault/discovery/domainspec-vault-foundations/epistemic-chain.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../discovery/two-layer-platform-architecture/discovery.md](../discovery/two-layer-platform-architecture/discovery.md) | `consumes` | Load-bearing input for the vault_common shared-kernel spec produced this session. |
| [../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md](../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md) | `consumes` | Load-bearing input for the vault_ctl `validate` command spec. |
| [../discovery/inverse-edge-fix/inverse-edge-fix.md](../discovery/inverse-edge-fix/inverse-edge-fix.md) | `consumes` | Load-bearing input for the vault_ctl `lint-edges` command spec. |
| [../discovery/two-layer-retrieval/README.md](../discovery/two-layer-retrieval/README.md) | `consumes` | Sibling discovery referenced during triage; graph_retrieval already in flight, skipped from this session's implementation pass. |
| [../discovery/domainspec-vault-foundations/epistemic-chain.md](../discovery/domainspec-vault-foundations/epistemic-chain.md) | `modifies` | Replaced the deprecated `provenance-for` edge at lines 468–469 with the canonical successor. |
| [../constitution/frontmatter-ownership-constitution.md](../constitution/frontmatter-ownership-constitution.md) | `consumes` | Authoritative 16-NodeType target the kernel was brought into compliance with. (`validates` was the semantic intent but is catalog-illegal against `node_type: constitution`; downgraded to `consumes` per curator NEEDS_HUMAN.) |
| [../ontology-conventions.md](../ontology-conventions.md) | `consumes` | Source of truth for the 16 node_types, the 21-edge catalog, and the bidirectionality carve-outs that govern this session's spec/kernel work. |
