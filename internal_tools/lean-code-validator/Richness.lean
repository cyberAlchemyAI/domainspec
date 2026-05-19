-- Richness.lean
-- Generic structural-richness framework, parameterized by the spec's `Concept` type.
-- Improvement over lean-richness-proof: theorems are generic over any spec, not
-- hardcoded to ZagrMarketplace. `EdgeRow` carries a type-level well-typedness
-- witness, turning Theorem 1 from a runtime `native_decide` into a structural
-- invariant: an ill-typed edge cannot be constructed.

import LeanCodeValidator.Sigma

namespace LeanCodeValidator

/-- A spec's concept layer: a concept type with a `metaOf` classification. -/
structure ConceptSpace where
  Concept     : Type
  decEq       : DecidableEq Concept
  beq         : BEq Concept
  metaOf      : Concept → Meta

attribute [instance] ConceptSpace.decEq ConceptSpace.beq

/-- A typed edge carrying its own well-typedness proof.

An `EdgeRow` is impossible to construct unless `sigmaValid` agrees on the
source and target metas. This pushes Theorem 1 from runtime to compile time. -/
structure EdgeRow (C : ConceptSpace) where
  src       : C.Concept
  edge      : EdgeType
  tgt       : C.Concept
  wellTyped : sigmaValid edge (C.metaOf src) (C.metaOf tgt) = true

/-- A full spec instance: a concept space plus a list of typed edges. -/
structure Spec where
  space : ConceptSpace
  edges : List (EdgeRow space)

namespace Spec

variable (S : Spec)

/-- Theorem 1, free.

`all_edges_well_typed` is no longer a runtime check — it is a structural
guarantee from the type of `EdgeRow`. This proof needs no `native_decide`. -/
theorem all_edges_well_typed :
    S.edges.all (fun e => sigmaValid e.edge (S.space.metaOf e.src) (S.space.metaOf e.tgt)) = true := by
  induction S.edges with
  | nil => rfl
  | cons e rest ih =>
      simp [List.all, e.wellTyped, ih]

/-- Triple form of an edge, for equality checks and enumeration. -/
def triple (e : EdgeRow S.space) : S.space.Concept × EdgeType × S.space.Concept :=
  (e.src, e.edge, e.tgt)

/-- M6-pattern enumeration: ordered pairs of unrelated source concepts that
converge on the same non-Entity target with the same edge type.

Length = 0 ⇒ structurally fractal at the graph level.
Length > 0 ⇒ exact residue locations. -/
def m6Witnesses :
    List (S.space.Concept × S.space.Concept × EdgeType × S.space.Concept) :=
  let triples := S.edges.map (Spec.triple S)
  triples.flatMap fun e1 =>
    triples.flatMap fun e2 =>
      if e1.1 == e2.1 then []
      else if !(e1.2.1 == e2.2.1 && e1.2.2 == e2.2.2) then []
      else if S.space.metaOf e1.2.2 == Meta.Entity then []
      else if triples.any (fun e3 =>
            (e3.1 == e1.1 && e3.2.2 == e2.1) ||
            (e3.1 == e2.1 && e3.2.2 == e1.1)) then []
      else [(e1.1, e2.1, e1.2.1, e1.2.2)]

end Spec

end LeanCodeValidator
