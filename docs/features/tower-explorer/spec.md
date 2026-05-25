---
tags: [feature, tower-explorer, tooling, governance, residue, reflection-tower]
node_type: spec
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-22
derives-from: vault/discovery/reflection-tower-structural-gate/README.md
---

# Feature Spec — Tower Explorer

## Overview

The Tower Explorer is a structural-gate tool (Gate 0) that runs on the vault graph before any L1→L2 compilation check. It enforces four mechanical invariants derived from the reflection tower Lean formalization: morphism-origin certification (T-1), reflects-iso promotion integrity (T-2), K/Q chain asymmetry (T-3), and obstruction-witness materialization (T-4).

The existing `categorical_tooling_guard` (guard.py) answers one flat question per spec: is the L1→L2 compilation fidelity acceptable? It has no notion of which layer introduced an edge, whether promotion collapses previously-distinct nodes, or what a minimal refuting subgraph looks like. The Tower Explorer fills this orthogonal dimension — promotion integrity across layers — as a prerequisite to guard.py's compilation check.

Mathematical grounding: `ReflectionTower.lean` (persistence lemma, edge-locality), `ReflectionTowerAnchored.lean` (`WithAnchor.Hom`, `P_reflectsIso`, `embedL1`, `refutes_m6_strong`), `BridgeFF.lean` (B_FF functor), `TowerColimit.lean` (`TowerOmega`, `ι_naturality`).

## Concepts

| Concept | ID | Type | Description |
|---|---|---|---|
| Tower Explorer | `tower-explorer.TowerExplorer` | Operation | CLI tool that analyses the vault graph and emits a structural verdict + four diagnostic streams |
| Tower Rung | `tower-explorer.TowerRung` | Value Object | The integer depth `n` of a vault node in the promotion hierarchy; 0 = axiom/constitution level |
| Promotion Edge | `tower-explorer.PromotionEdge` | Value Object | A cross-layer edge connecting a node at rung `n` to a node at rung `n+1` |
| Origin Certificate | `tower-explorer.OriginCertificate` | Value Object | Frontmatter annotation on a cross-layer edge: which rung introduced it (T-1 output) |
| Reflects-Iso Report | `tower-explorer.ReflectsIsoReport` | Value Object | Per-promotion-edge report: whether any two distinct lower-layer nodes are collapsed by this promotion (T-2 output) |
| Anchor Direction | `tower-explorer.AnchorDirection` | Value Object | `K` (incoming anchor, residue-to-knowledge) or `Q` (outgoing anchor, spec-to-artifact) on a traceability edge (T-3 tag) |
| Obstruction Witness | `tower-explorer.ObstructionWitness` | Value Object | Minimal subgraph exhibiting the two-objects-no-morphism witness at the node's rung level (T-4 artifact) |
| Structural Verdict | `tower-explorer.StructuralVerdict` | Value Object | `structural-pass / structural-flag / structural-block` — the Gate 0 output, parallel to guard.py's Gate 1 verdict |

## Feature Concept Graph

| From | Edge | To | Evidence | Notes |
|---|---|---|---|---|
| `TowerExplorer` | produces | `StructuralVerdict` | lens 02 §outputs | Gate 0 verdict, runs before guard.py |
| `TowerExplorer` | produces | `OriginCertificate` | lens 01 `WithAnchor.Hom` | T-1; forward-only, no migration |
| `TowerExplorer` | produces | `ReflectsIsoReport` | lens 01 `P_reflectsIso` | T-2; requires richer frontmatter |
| `TowerExplorer` | produces | `AnchorDirection` | lens 01 K-only tower | T-3; tags existing traceability edges |
| `TowerExplorer` | produces | `ObstructionWitness` | lens 01 `embedL1` | T-4; renders sorry-free Lean subgraph |
| `PromotionEdge` | carries | `OriginCertificate` | T-1 spec | One certificate per cross-layer edge |
| `PromotionEdge` | carries | `ReflectsIsoReport` | T-2 spec | One report per promotion edge |
| `PromotionEdge` | carries | `AnchorDirection` | T-3 spec | `K` or `Q`; missing = flag |
| `TowerRung` | contextualizes | `ObstructionWitness` | `TowerAnchored.embedL1(n)` | Witness is rung-parameterized |
| `TowerExplorer` | precedes | `categorical_tooling_guard` | lens 02 §pipeline | Gate 0 before Gate 1 |

## Aspects

- [domain.md](domain.md) — concept definitions, tower-rung inference rules, K/Q direction semantics
- [operations.md](operations.md) — `analyse_vault`, `certify_origin`, `check_reflects_iso`, `tag_direction`, `render_witness`
- [interfaces.md](interfaces.md) — CLI (`tower-explorer <vault-root> [--json] [--fail-on-flag]`), JSON output schema, integration with guard.py pipeline

## Cross-Feature Dependencies

| Depends On | Relationship | Why |
|---|---|---|
| `categorical_tooling_guard` | Gate 0 precedes Gate 1 | Tower Explorer structural verdict must pass before guard.py runs |
| `lean-richness-proof` (v1) | provides M6 count | T-4 obstruction witness requires the existing M6 enumeration as input |
| `lean-code-validator` (v2) | target integration | Once v2 lifts to functor-level, T-4 witnesses become typed proofs, not just subgraphs |

## Produces For

| Consumer | Via | What |
|---|---|---|
| CI pipeline | `structural-block` verdict | Hard gate before spec compilation |
| Spec author | `ObstructionWitness` artifact | Concrete subgraph showing *what* is ambiguous, not just that ambiguity exists |
| `lean-code-validator` v2 | `OriginCertificate` + `ReflectsIsoReport` | Frontmatter annotations that v2 can verify against `P_faithful` / `P_reflectsIso` |
