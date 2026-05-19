-- examples/_v2/ZagrMarketplace.lean
-- ZagrMarketplace expressed under the v2 generic Richness framework.
-- Frozen here as a diff target for v3. Self-contained — no LeanCodeValidator imports.

namespace LeanCodeValidatorV2

inductive Meta where
  | Entity | Enum | Event | Interface | Mapping | Operation
  | Policy | Query | Rule | StateMachine | ValueObject | Workflow
  deriving DecidableEq, BEq, Repr

inductive EdgeType where
  | enforces | maps | orchestrates | performs | produces | queries | transitions
  deriving DecidableEq, BEq, Repr

def sigmaValid : EdgeType → Meta → Meta → Bool
  | .performs,     .Entity,    .Operation    => true
  | .produces,     .Operation, .Event        => true
  | .enforces,     .Rule,      .Operation    => true
  | .transitions,  .Event,     .StateMachine => true
  | .orchestrates, .Workflow,  .Operation    => true
  | .maps,         .Mapping,   .Entity       => true
  | .maps,         .Mapping,   .Interface    => true
  | .queries,      .Query,     .Entity       => true
  | _, _, _ => false

structure ConceptSpace where
  Concept : Type
  decEq   : DecidableEq Concept
  beq     : BEq Concept
  metaOf  : Concept → Meta

attribute [instance] ConceptSpace.decEq ConceptSpace.beq

structure EdgeRow (C : ConceptSpace) where
  src       : C.Concept
  edge      : EdgeType
  tgt       : C.Concept
  wellTyped : sigmaValid edge (C.metaOf src) (C.metaOf tgt) = true

structure Spec where
  space : ConceptSpace
  edges : List (EdgeRow space)

namespace Spec
variable (S : Spec)

theorem all_edges_well_typed :
    S.edges.all (fun e => sigmaValid e.edge (S.space.metaOf e.src) (S.space.metaOf e.tgt)) = true := by
  induction S.edges with
  | nil => rfl
  | cons e rest ih => simp [List.all, e.wellTyped, ih]

def triple (e : EdgeRow S.space) : S.space.Concept × EdgeType × S.space.Concept :=
  (e.src, e.edge, e.tgt)

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
end LeanCodeValidatorV2

-- ——————————————————————————————————————————
-- ZagrMarketplace spec (frozen v2 encoding)
-- ——————————————————————————————————————————

namespace ZagrMarketplace
open LeanCodeValidatorV2

inductive Concept where
  | Invitation | AcceptInvitation | User | Node | ApproveNode | NodeReadyForRegistration
  deriving DecidableEq, BEq, Repr

def metaOf : Concept → Meta
  | .Invitation               => .Entity
  | .AcceptInvitation         => .Operation
  | .User                     => .Entity
  | .Node                     => .Entity
  | .ApproveNode              => .Operation
  | .NodeReadyForRegistration => .Event

def space : ConceptSpace where
  Concept := Concept
  decEq   := inferInstance
  beq     := inferInstance
  metaOf  := metaOf

def edges : List (EdgeRow space) := [
  { src := .Invitation,  edge := .performs, tgt := .AcceptInvitation,         wellTyped := rfl },
  { src := .User,        edge := .performs, tgt := .ApproveNode,              wellTyped := rfl },
  { src := .Node,        edge := .performs, tgt := .ApproveNode,              wellTyped := rfl },
  { src := .ApproveNode, edge := .produces, tgt := .NodeReadyForRegistration, wellTyped := rfl }
]

def spec : Spec where
  space := space
  edges := edges

#eval spec.m6Witnesses

end ZagrMarketplace
