-- examples/ZagrMarketplace.lean
-- ZagrMarketplace under the v3 LeanCodeValidator framework.
-- Layer 1 verification: lake env lean --run examples/ZagrMarketplace.lean
-- prints a CodegenReadinessReport with P1 + P5 graded for real, P3/P4 stubbed.

import LeanCodeValidator.Report

namespace ZagrMarketplace
open LeanCodeValidator

inductive Concept where
  | Invitation
  | AcceptInvitation
  | User
  | Node
  | ApproveNode
  | NodeReadyForRegistration
  deriving DecidableEq, BEq, Repr

def metaOf : Concept → Meta
  | .Invitation               => .Entity
  | .AcceptInvitation         => .Operation
  | .User                     => .Entity
  | .Node                     => .Entity
  | .ApproveNode              => .Operation
  | .NodeReadyForRegistration => .Event

def conceptSpace : ConceptSpace where
  Concept  := Concept
  decEq    := inferInstance
  beq      := inferInstance
  concepts := [.Invitation, .AcceptInvitation, .User, .Node,
               .ApproveNode, .NodeReadyForRegistration]
  metaOf   := metaOf

def edges : List (EdgeRow .paperBaseline conceptSpace) := [
  { src := .Invitation,  edge := .performs, tgt := .AcceptInvitation,
    provenance := .declared, wellTyped := rfl },
  { src := .User,        edge := .performs, tgt := .ApproveNode,
    provenance := .declared, wellTyped := rfl },
  { src := .Node,        edge := .performs, tgt := .ApproveNode,
    provenance := .declared, wellTyped := rfl },
  { src := .ApproveNode, edge := .produces, tgt := .NodeReadyForRegistration,
    provenance := .declared, wellTyped := rfl }
]

def spec : Spec where
  profile        := .paperBaseline
  conceptSpace   := conceptSpace
  edges          := edges
  unresolvedRefs := []
  conceptCount   := 6

#eval gradeFor spec

end ZagrMarketplace
