-- examples/FaultInject.lean
-- Adversarial test cases for Layer 1 grading. Not a spec — a test harness.
-- Verifies: P1 fires on unresolvedRefs, P5 fires on a codegen cycle,
-- compositionExtension profile accepts R_CF edges.

import LeanCodeValidator.Report

namespace FaultInject
open LeanCodeValidator

-- ── Concept set big enough to construct a cycle ────────────────────────────
inductive C where
  | OpA | OpB | EvA | EvB | RuleA
  deriving DecidableEq, BEq, Repr

def metaOf : C → Meta
  | .OpA   => .Operation
  | .OpB   => .Operation
  | .EvA   => .Event
  | .EvB   => .Event
  | .RuleA => .Rule

def cs : ConceptSpace where
  Concept  := C
  decEq    := inferInstance
  beq      := inferInstance
  concepts := [.OpA, .OpB, .EvA, .EvB, .RuleA]
  metaOf   := metaOf

-- ── Case 1: P1 fails on unresolvedRefs ─────────────────────────────────────
def specP1Fail : Spec where
  profile        := .paperBaseline
  conceptSpace   := cs
  edges          := []
  unresolvedRefs := ["MissingThing", "OtherGhost"]
  conceptCount   := 5

-- ── Case 2: P5 fails on a codegen cycle via R_CF in compositionExtension ──
-- producesFor : Operation → Event   (codegen dep, R_CF)
-- triggersCross : Event → Operation (codegen dep, R_CF)
-- Cycle: OpA → EvA → OpA
def specP5Fail : Spec where
  profile        := .compositionExtension
  conceptSpace   := cs
  edges          := [
    { src := .OpA, edge := .producesFor,   tgt := .EvA, provenance := .declared, wellTyped := rfl },
    { src := .EvA, edge := .triggersCross, tgt := .OpA, provenance := .declared, wellTyped := rfl }
  ]
  unresolvedRefs := []
  conceptCount   := 5

-- ── Case 3: compositionExtension happy path (R_CF accepted, no cycle) ─────
def specCFOk : Spec where
  profile        := .compositionExtension
  conceptSpace   := cs
  edges          := [
    { src := .RuleA, edge := .enforcesCross, tgt := .OpA, provenance := .declared, wellTyped := rfl },
    { src := .OpA,   edge := .producesFor,   tgt := .EvA, provenance := .declared, wellTyped := rfl }
  ]
  unresolvedRefs := []
  conceptCount   := 5

#eval gradeFor specP1Fail
#eval gradeFor specP5Fail
#eval gradeFor specCFOk

end FaultInject
