-- LeanCodeValidator/Profiles.lean
-- Profile membership predicates and the isCodegenDependency partition.
-- Depends only on Sigma.lean; no Mathlib.

import LeanCodeValidator.Sigma

namespace LeanCodeValidator

-- ——————————————————————————————————————————————————————————————————————————————
-- metaTypesInProfile
-- paperBaseline:       24 metas (all 25 except Saga)
-- compositionExtension: 25 metas (adds Saga)
-- ——————————————————————————————————————————————————————————————————————————————

def metaTypesInProfile : Profile → List Meta
  | .paperBaseline => [
      -- Backend (13)
      .Entity, .ValueObject, .Enum, .Operation, .Query, .Calculation,
      .Rule, .Policy, .Workflow, .Interface, .Event, .Mapping, .StateMachine,
      -- UI (11)
      .Page, .Layout, .Component, .ViewModel, .Hook, .Form, .Action,
      .Guard, .Binding, .Adapter, .StateIndicator
    ]
  | .compositionExtension => [
      -- Backend (13)
      .Entity, .ValueObject, .Enum, .Operation, .Query, .Calculation,
      .Rule, .Policy, .Workflow, .Interface, .Event, .Mapping, .StateMachine,
      -- UI (11)
      .Page, .Layout, .Component, .ViewModel, .Hook, .Form, .Action,
      .Guard, .Binding, .Adapter, .StateIndicator,
      -- Composition (1)
      .Saga
    ]

-- Smoke-test assertions (evaluated at library load, not shipped as proofs)
#eval (metaTypesInProfile .paperBaseline).length        -- expect 24
#eval (metaTypesInProfile .compositionExtension).length -- expect 25

-- ——————————————————————————————————————————————————————————————————————————————
-- edgeTypesInProfile
-- paperBaseline:       26 edges (R_B 12 + R_U 8 + R_X 6)
-- compositionExtension: 29 edges (adds R_CF 3)
-- ——————————————————————————————————————————————————————————————————————————————

def edgeTypesInProfile : Profile → List EdgeType
  | .paperBaseline => [
      -- R_B (12)
      .performs, .produces, .enforces, .calculates, .transitions, .exposes,
      .orchestrates, .applies, .maps, .contains, .queries, .emits,
      -- R_U (8)
      .renders, .wraps, .composes, .consumes, .submits, .shapes, .protects, .displays,
      -- R_X (6)
      .fetches, .mutates, .reflects, .derives, .contracts, .mirrors
    ]
  | .compositionExtension => [
      -- R_B (12)
      .performs, .produces, .enforces, .calculates, .transitions, .exposes,
      .orchestrates, .applies, .maps, .contains, .queries, .emits,
      -- R_U (8)
      .renders, .wraps, .composes, .consumes, .submits, .shapes, .protects, .displays,
      -- R_X (6)
      .fetches, .mutates, .reflects, .derives, .contracts, .mirrors,
      -- R_CF (3)
      .producesFor, .triggersCross, .enforcesCross
    ]

#eval (edgeTypesInProfile .paperBaseline).length        -- expect 26
#eval (edgeTypesInProfile .compositionExtension).length -- expect 29

-- ——————————————————————————————————————————————————————————————————————————————
-- isCodegenDependency
-- true  = target type must be emitted before source type
-- false = runtime-only or intra-layer edge, not a compile-time import
-- Partition is D11 proposed default; any P5 WARN cycle triggers D11 review.
-- ——————————————————————————————————————————————————————————————————————————————

def isCodegenDependency : EdgeType → Bool
  -- R_B: all codegen deps except `transitions` (runtime state change, not a type import)
  | .performs | .produces | .enforces | .calculates | .exposes
  | .orchestrates | .applies | .maps | .contains | .queries | .emits => true
  | .transitions => false
  -- R_U: intra-UI-layer composition; no cross-layer type import
  | .renders | .wraps | .composes | .consumes | .submits
  | .shapes | .protects | .displays => false
  -- R_X: all cross-layer; target (backend) must be emitted first
  | .fetches | .mutates | .reflects | .derives | .contracts | .mirrors => true
  -- R_CF: cross-feature codegen deps in compositionExtension
  | .producesFor | .triggersCross | .enforcesCross => true

end LeanCodeValidator
