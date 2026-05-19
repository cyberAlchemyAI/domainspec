-- LeanCodeValidator/Richness.lean
-- v3 spec representation: ConceptSpace (with concept list), EdgeProvenance,
-- EdgeRow (profile-aware wellTyped + provenance), Spec, and m6Witnesses.
-- Improvement over v2: Profile is threaded into EdgeRow's wellTyped proof,
-- so σ-typing is profile-correct at compile time (P2 remains structural and free).

import LeanCodeValidator.Sigma
import LeanCodeValidator.Profiles

namespace LeanCodeValidator

-- ——————————————————————————————————————————————————————————————————————————————
-- EdgeProvenance (v3 new; not in v2)
-- How the parser inferred a given edge. Affects P4 grading.
-- ——————————————————————————————————————————————————————————————————————————————

inductive EdgeProvenance where
  | declared        -- bold-prefix syntax (e.g. **performs** →)
  | contextInferred -- structural position (e.g. Rules subsection implies enforces)
  | sigmaFallback   -- incidental markdown link accepted as σ-typed edge
  deriving DecidableEq, BEq, Repr

-- ——————————————————————————————————————————————————————————————————————————————
-- ConceptSpace
-- v3 adds `concepts : List Concept` over v2. Later fields may reference earlier
-- ones in Lean 4 structures (telescopic records).
-- ——————————————————————————————————————————————————————————————————————————————

structure ConceptSpace where
  Concept  : Type
  decEq    : DecidableEq Concept
  beq      : BEq Concept
  concepts : List Concept   -- explicit enumeration; used by P3 and P1 membership
  metaOf   : Concept → Meta

attribute [instance] ConceptSpace.decEq ConceptSpace.beq

-- ——————————————————————————————————————————————————————————————————————————————
-- EdgeRow
-- v3 adds `provenance` and threads `Profile` into `wellTyped`, making the proof
-- obligation profile-correct. P2 is still structural and free — an ill-typed
-- edge for the declared profile cannot be constructed.
-- ——————————————————————————————————————————————————————————————————————————————

structure EdgeRow (p : Profile) (C : ConceptSpace) where
  src        : C.Concept
  edge       : EdgeType
  tgt        : C.Concept
  provenance : EdgeProvenance
  wellTyped  : sigmaValid p edge (C.metaOf src) (C.metaOf tgt) = true

-- ——————————————————————————————————————————————————————————————————————————————
-- Spec
-- v3 extends the v2 structure with profile, unresolvedRefs, and conceptCount.
-- `edges` depends on `profile` and `conceptSpace` declared above it.
-- ——————————————————————————————————————————————————————————————————————————————

structure Spec where
  profile        : Profile
  conceptSpace   : ConceptSpace
  edges          : List (EdgeRow profile conceptSpace)
  unresolvedRefs : List String   -- names the parser could not resolve (P1 input)
  conceptCount   : Nat           -- total declared concepts (P3 coverage)

namespace Spec

variable (S : Spec)

-- Theorem 1 — free (structural, no native_decide).
-- All edges respect σ for the spec's profile by construction.
theorem all_edges_well_typed :
    S.edges.all (fun e =>
      sigmaValid S.profile e.edge (S.conceptSpace.metaOf e.src) (S.conceptSpace.metaOf e.tgt)) = true := by
  induction S.edges with
  | nil => rfl
  | cons e rest ih => simp [List.all, e.wellTyped, ih]

-- ——————————————————————————————————————————————————————————————————————————————
-- m6Witnesses
-- Two distinct sources converging on the same non-Entity target with the same
-- edge type, without a disambiguating relation. Used by P4 (gradeP4Ambiguity).
-- v3: same algorithm as v2; fields renamed (space → conceptSpace).
-- ——————————————————————————————————————————————————————————————————————————————

def m6Witnesses :
    List (S.conceptSpace.Concept × S.conceptSpace.Concept × EdgeType × S.conceptSpace.Concept) :=
  let triples := S.edges.map (fun e => (e.src, e.edge, e.tgt))
  triples.flatMap fun e1 =>
    triples.flatMap fun e2 =>
      if e1.1 == e2.1 then []
      else if !(e1.2.1 == e2.2.1 && e1.2.2 == e2.2.2) then []
      else if S.conceptSpace.metaOf e1.2.2 == Meta.Entity then []
      else if triples.any (fun e3 =>
            (e3.1 == e1.1 && e3.2.2 == e2.1) ||
            (e3.1 == e2.1 && e3.2.2 == e1.1)) then []
      else [(e1.1, e2.1, e1.2.1, e1.2.2)]

end Spec

end LeanCodeValidator
