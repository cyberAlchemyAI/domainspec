-- LeanCodeValidator/Sigma.lean
-- Canonical vocabulary: 25 Meta (DS-D1), 29 EdgeType (DS-D2), 2 Profile, and the
-- full profile-aware σ-signature (paper Tables 3 & 4 for R_B + R_X; R_U unsigned;
-- R_CF in compositionExtension only).
-- Self-contained, no Mathlib, no I/O.

namespace LeanCodeValidator

-- ——————————————————————————————————————————————————————————————————————————————
-- Meta (25 values, DS-D1)
-- ——————————————————————————————————————————————————————————————————————————————

inductive Meta where
  -- Backend (13)
  | Entity | ValueObject | Enum | Operation | Query | Calculation
  | Rule | Policy | Workflow | Interface | Event | Mapping | StateMachine
  -- UI (11)
  | Page | Layout | Component | ViewModel | Hook | Form | Action
  | Guard | Binding | Adapter | StateIndicator
  -- Composition (1; compositionExtension profile only)
  | Saga
  deriving DecidableEq, BEq, Repr

-- ——————————————————————————————————————————————————————————————————————————————
-- EdgeType (29 values, DS-D2)
-- ——————————————————————————————————————————————————————————————————————————————

inductive EdgeType where
  -- R_B: backend (12)
  | performs | produces | enforces | calculates | transitions | exposes
  | orchestrates | applies | maps | contains | queries | emits
  -- R_U: UI-layer (8); no σ-triples — any use grades WARN (D12)
  | renders | wraps | composes | consumes | submits | shapes | protects | displays
  -- R_X: cross-layer (6); all are codegen dependencies (D11)
  | fetches | mutates | reflects | derives | contracts | mirrors
  -- R_CF: cross-feature (3 canonical, D6); compositionExtension only
  -- Lean camelCase encodes kebab-canonical: produces-for, triggers-cross, enforces-cross
  | producesFor | triggersCross | enforcesCross
  deriving DecidableEq, BEq, Repr

-- ——————————————————————————————————————————————————————————————————————————————
-- Profile (2 values, DS-D1 lines 78-80)
-- ——————————————————————————————————————————————————————————————————————————————

inductive Profile where
  | paperBaseline       -- 24 Meta (all except Saga), 26 EdgeType (R_B + R_U + R_X)
  | compositionExtension -- 25 Meta (adds Saga), 29 EdgeType (adds R_CF)
  deriving DecidableEq, BEq, Repr

-- ——————————————————————————————————————————————————————————————————————————————
-- σ-signature (profile-aware)
-- Source: paper Table 3 (R_B) and Table 4 (R_X); R_U unsigned (§4.2); R_CF per D6.
-- Returns true iff (profile, edgeType, srcMeta, tgtMeta) is a valid σ-triple.
-- ——————————————————————————————————————————————————————————————————————————————

def sigmaValid : Profile → EdgeType → Meta → Meta → Bool
  -- R_B: valid in both profiles (Table 3)
  | _, .performs,     .Entity,        .Operation    => true
  | _, .produces,     .Operation,     .Event        => true
  | _, .enforces,     .Rule,          .Operation    => true
  | _, .calculates,   .Calculation,   .Operation    => true
  | _, .transitions,  .Event,         .StateMachine => true
  | _, .exposes,      .Interface,     .Operation    => true
  | _, .exposes,      .Interface,     .Query        => true
  | _, .orchestrates, .Workflow,      .Operation    => true
  | _, .applies,      .Policy,        .Operation    => true
  | _, .maps,         .Mapping,       .Entity       => true
  | _, .maps,         .Mapping,       .Interface    => true
  | _, .contains,     .Entity,        .ValueObject  => true
  | _, .queries,      .Query,         .Entity       => true
  | _, .emits,        .Entity,        .Event        => true
  -- R_X: valid in both profiles (Table 4; all are UI → Backend)
  | _, .fetches,      .Binding,       .Query        => true
  | _, .mutates,      .Binding,       .Operation    => true
  | _, .reflects,     .StateIndicator,.StateMachine => true
  | _, .derives,      .ViewModel,     .Entity       => true
  | _, .contracts,    .Form,          .Interface    => true
  | _, .mirrors,      .Guard,         .Rule         => true
  -- R_CF: compositionExtension only (D6; cross-feature variants of R_B triples)
  | .compositionExtension, .producesFor,   .Operation, .Event     => true
  | .compositionExtension, .triggersCross, .Event,     .Operation => true
  | .compositionExtension, .enforcesCross, .Rule,      .Operation => true
  -- R_U: no σ-triples (paper §4.2); R_CF in paperBaseline: false
  | _, _, _, _ => false

end LeanCodeValidator
