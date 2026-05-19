-- Sigma.lean
-- σ-signature for DomainSpec L1 specs.
-- Schema vocabulary only — owned by the framework, not by any particular spec.
-- Self-contained, no Mathlib.

namespace LeanCodeValidator

inductive Meta where
  | Entity
  | Enum
  | Event
  | Interface
  | Mapping
  | Operation
  | Policy
  | Query
  | Rule
  | StateMachine
  | ValueObject
  | Workflow
  deriving DecidableEq, BEq, Repr

inductive EdgeType where
  | enforces
  | maps
  | orchestrates
  | performs
  | produces
  | queries
  | transitions
  deriving DecidableEq, BEq, Repr

/-- The σ-signature: which `(EdgeType, source-Meta, target-Meta)` triples are valid. -/
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

end LeanCodeValidator
