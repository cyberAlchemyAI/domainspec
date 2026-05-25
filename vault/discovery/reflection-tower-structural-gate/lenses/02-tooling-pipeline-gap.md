---
lens: tooling-pipeline-gap
date: 2026-05-22
dispatched_by: research-subagent (local-files)
addresses: Maps guard.py's actual outputs against the four T-1/T-4 tower checks, confirms none appear in the roadmap, and specifies what a tower explorer would concretely produce.
sources:
  - domainspec/internal_tools/categorical_tooling_guard/guard.py
  - domainspec/internal_tools/README.md
  - domainspec/internal_tools/future_tooling_roadmap.md
  - domainspec/internal_tools/lean-richness-proof/docs/toward-categorical-spec-semantics.md
  - domainspec/vault/discovery/reflection-tower-exports/discovery.md
verification: [local-files-read]
---

# Lens 02 — Tooling Pipeline Gap

## What guard.py actually does

Inputs: a `spec_dir` path + optional `GuardPolicy` config. It calls `audit_richness.py` (dynamic import), then normalises the resulting report into a verdict bundle.

Outputs (four keys):
- `verdict` — `pass / flag / block`
- `summary` — six counts: `concepts`, `typedEdges`, `m6Clusters`, `faithfulnessRatio`, `parserBlind`, `auditVerdict`
- `diagnostics` — coded items: `PARSER_BLIND`, `ZERO_TYPED_EDGES`, `M6_CLUSTER`, `LOW_FAITHFULNESS_RATIO`, `UNWITNESSED_EDGE`, `STRUCTURAL_COLLISION`, `LEAN_VALIDATOR_UNAVAILABLE`
- `rawAudit` — unmodified audit report from `audit_richness.py`

**What it cannot do:** guard.py operates on a single spec directory. It has no notion of tower rungs, promotion edges between layers, layer origin of edges, or refuting subgraph witnesses. The M6 count is a heuristic (finite list enumeration by `native_decide`), not a functor-level proof. The `faithfulnessRatio` is a ratio of witnessed-to-total typed edges — not a check on whether any induced functor is faithful in the categorical sense.

## The v1→v2 gap (toward-categorical-spec-semantics.md)

The gap has three steps:

1. `sigmaValid` (currently `Bool`-valued on a hardcoded list) must be lifted to a `SmallCategory Σ` — without this, no spec can be checked as a functor (~20 lines of Lean).
2. Specs are relations, not functions (e.g. 14 outgoing `performs` edges from `User`), so they cannot be `Σ ⥤ Type` directly. Path: Spivak-style presheaves, where a spec is an instance of schema `Σ`.
3. The target `L2` is currently a free variable in `DomainSpec.lean` — it needs a concrete definition before `Δ : L1 ⥤ L2` can be checked.

The **M6-graph theorem** (M6 count ⟹ Δ not full) has no categorical proof yet. Without it, the guard's `M6_CLUSTER` diagnostic is a heuristic with no formal backing.

## What the future roadmap covers and does not cover

`future_tooling_roadmap.md` plans five tools (T1–T5), all aimed at the L1↔L2 compilation functor pipeline:
- T1: Real-time M6 warnings (IDE extension)
- T2: LLM-driven L1 Refiner (resolves M6 ambiguity)
- T3: L2 Functor Extractor (Prisma/SQL/TypeScript → L2, checks FF)
- T4: Round-Trip Test Generator (asserts `I ≅ Δ*(Σ_Δ(I))`)
- T5: Zero-Residue Compiler (L1 → Postgres/GraphQL/ORM)

**The tower dimension is entirely absent.** No roadmap tool checks promotion-edge origin, reflects-iso on promotions, K/Q chain asymmetry, or obstruction witnesses. The roadmap is orthogonal to the tower structure.

## The four checks the tower explorer would add

| Check | Source in Lean | Currently in guard.py? | Currently in roadmap? |
|---|---|---|---|
| **T-1** Morphism-origin certificate: every cross-layer edge carries its origin layer | `WithAnchor.Hom` edge-locality inductive | ✗ | ✗ |
| **T-2** Reflects-iso on promotion edges: distinct lower-layer nodes do not collapse on promotion | `P_reflectsIso` / `instP_ReflectsIso` | ✗ | ✗ |
| **T-3** K/Q asymmetry marker: traceability edges tagged `K` (anchor-in) or `Q` (anchor-out); mixed chains flagged | K-only `AnchoredCarrier`, absence of `inl → inr` edges | ✗ | ✗ |
| **T-4** Obstruction-witness display: minimal refuting subgraph rendered for each residue | `embedL1(n)` + `refutes_m6_strong(n)` | ✗ | ✗ |

## Concrete tower-explorer specification

**Position in pipeline:** Gate 0 — runs before guard.py, on the vault graph rather than a single spec directory.

**Inputs:**
- Vault root (or set of vault nodes with frontmatter)
- Edge catalog (RELATIONSHIPS.md or equivalent)
- Optionally: a Lean build artefact from `ReflectionTowerAnchored.lean` for T-4

**Outputs per node:**
- Layer assignment and tower rung (inferred from `node_type` + cross-layer edge structure)
- For each cross-layer edge: origin certificate (T-1) — which layer introduced it; flag if retroactively introduced at a lower layer
- For each promotion edge: reflects-iso report (T-2) — whether distinct lower-layer nodes are collapsed; flag if so
- For each traceability edge: `direction: K | Q` tag (T-3); flag if mixed K/Q chain present
- For each residue/obstruction node: rendered minimal refuting subgraph as a concrete artifact (T-4), not prose

**Verdict:** `structural-pass / structural-flag / structural-block` (parallel to guard.py's `pass / flag / block` but at the promotion layer).

**What it does not replace:** guard.py (Gate 1, L1→L2 compilation fidelity). The two gates are orthogonal — structural integrity of the vault graph (Gate 0) is a precondition, not a substitute, for spec compilation fidelity (Gate 1).

## Recommended implementation order

T-1 first: forward-only enforcement (no schema migration), cheapest to implement, closes the retroactive-edge-introduction hole immediately.

T-4 second: the Lean infrastructure (`embedL1`, `refutes_m6_strong`) is entirely sorry-free; the gap is rendering. Highest leverage for making residue predictions concrete rather than prose.

T-2 and T-3 after: require richer frontmatter (promotion-edge direction field, reflects-iso check machinery) and are most useful once T-1 and T-4 are deployed and producing real signal.
