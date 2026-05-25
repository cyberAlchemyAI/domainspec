---
lens: lean-formalization-inventory
date: 2026-05-22
dispatched_by: research-subagent (local-files)
addresses: Establishes which tower facts are sorry-free, which are scaffolded, and what TowerCrystallization.lean must state to close the crystallization lemma.
sources:
  - domainspec-theorem/lean-formalization/BridgeFF.lean
  - domainspec-theorem/lean-formalization/BridgeAdjunction.lean
  - domainspec-theorem/lean-formalization/ResidueFFfunctor.lean
  - domainspec-theorem/lean-formalization/TowerColimit.lean
  - domainspec-theorem/lean-formalization/DefectResidue.lean
  - domainspec-theorem/lean-formalization/DualResidueLossStructure.lean
  - domainspec/vault/discovery/reflection-tower-exports/discovery.md
verification: [local-files-read]
---

# Lens 01 — Lean Formalization Inventory

## What is sorry-free

**BridgeFF.lean** — `B_FF : PointedResidueObj ⥤ Cat`. Object part: the discrete category on the noise subtype `↥(P.base.str.noise P.point)`. Morphism part: restricts the residue carrier to noise subtypes via `Discrete.functor`. All functor laws proved (`bridgeOnNoise_id`, `bridgeOnNoise_comp`). Non-degeneracy and point-discrimination proved (`B_FF_is_nondegenerate`, `B_FF_distinguishes_points_via_carrier`).

**BridgeAdjunction.lean** — `B_FF ⊣ Residue_FF_pointed`. Full hom-equivalence with both invertibility directions (`left_inv`, `right_inv`), naturality in both variables. The adjunction holds under two hypotheses pushed to the caller: `hfn` (full-noise condition) and `hrefl` (reflexivity of Refines at the distinguished point). Both are satisfied by all objects in the image of `Residue_FF_pointed`, so the adjunction is non-vacuous but domain-restricted.

**ResidueFFfunctor.lean** — `residueFF` object assignment, `residueFF_ff_noise_empty` (FF ⟹ empty noise via F11 collapse), `residueFF_incl_noise_nonempty` (below-threshold witness), `residueFF_phase_transition` (biconditional package), `residueFFfunctor` functor structure. Structural caveat: `residueFF_map` uses an identity morphism because `residueFF Δ` and `residueFF Δ'` are definitionally equal as `ResidueCat` objects; genuine contravariance requires the schema-pointed level not yet built.

**TowerColimit.lean** — `TowerDiagram : ℕ ⥤ Cat.{0,0}` (via `Functor.ofSequence`), `tower_colimit_exists` (by `inferInstance` on Mathlib's `HasColimits Cat`), `TowerOmega : Cat.{0,0}`, `ι_naturality`. All sorry-free.

**ReflectionTowerAnchored.lean** — `AnchoredCarrier`, hand-rolled `Hom` inductive with definitional edge-locality on the L-block, `FreeExtension.viaAnchored`, `TowerAnchored.tower`, `TowerAnchored.embedL1(n)` (fully faithful embedding of L1 into every tower level), `TowerAnchored.refutes_m6_strong(n)`. All sorry-free.

## What is scaffolded but open

**`residueFFfunctor` morphism action**: structurally present as identity, but real contravariance requires `(L₁ ⥤ L₂)ᵒᵖ ⥤ PointedResidueObj` — the schema-pointed subcategory where morphisms carry the `lanIsoSchema` pullback. Named as a structural limitation, not a sorry; it is the Level-2.5 extension.

**`B_FF_adjunction` general form**: proved for `Residue_FF_pointed` trivial objects; the full-domain version (finite-noise rungs) is the adjunction target of `TowerCrystallization.lean`.

**`DualResidueLossStructure`**: structure defined, `categorical_orthogonality` and `dual_loss_irreducibility` stated; status beyond line 80 is sorryed.

**`TowerOmega` absorption**: colimit exists, but the K-only `viaAnchored` carrier cannot admit a promotion equivalence — proved false elsewhere (`StrangeLoop.C_ω_absorption_refuted`). The non-absorption is a feature, not a gap.

## What does not yet exist

| File | What it would prove |
|---|---|
| `TowerCrystallization.lean` | Canonical identification of `Residue_FF^N` fibres with `B_EssSurj^{N+1}` orbits at adjacent tower rungs |
| Schema-pointed `Residue_FF` functor | Contravariant `(L₁ ⥤ L₂)ᵒᵖ ⥤ PointedResidueObj` with genuine `lanIsoSchema` pullback morphisms |
| Q-side tower dual | `anchor : new_obj → quotient_obj` symmetric to the K-only `AnchoredCarrier`; needed to close the bidirectional tower |
| Transfinite tower | Extension of `TowerDiagram` beyond `ℕ` through limit ordinals |
| `M6-graph theorem` | M6 patterns in a spec instance imply any induced Δ is not full — the categorical proof behind the heuristic M6 count |

## What TowerCrystallization.lean must state

Four obligations, in dependency order:

1. **Schema-pointed morphism action** — the contravariant `Δ ↦ lanIsoSchema Δ` action on `PointedResidueObj` morphisms. Unblocks the general `B_FF ⊣ Residue_FF` adjunction.

2. **Crystallization identification** — a canonical (natural) isomorphism between the fibres of `Residue_FF^N` at tower rung `N` and the orbit-quotients organising `B_EssSurj^{N+1}` at rung `N+1`. This is the load-bearing lemma the bridge `tower-crystallization.md` names as its formalization target.

3. **Rung-monotone residue accumulation** — the residue at level `N+1` weakly extends the residue at level `N`; strict extension = second-law restatement as tower monotonicity. Connects `TowerColimit.TowerDiagram` to `ResidueFFfunctor.residueFFschema`.

4. **Worked instance** — the finite kinetic-to-thermal coarse-graining (finitely-many molecular states, Maxwell-Boltzmann orbit as velocity-permutation fibre) shown to be an instance of the crystallization identification. Required by the bridge doc's "What would close the bridge" checklist.

## Load-bearing observation for the tool

`TowerAnchored.embedL1(n)` already produces a minimal refuting subgraph (the two-objects-no-morphism witness lifted through the full tower) at every finite level. This is the T-4 obstruction witness in computable form. The Lean infrastructure for T-4 is entirely sorry-free; the gap is on the tooling side (extracting `embedL1` into a renderable subgraph), not the math side.
