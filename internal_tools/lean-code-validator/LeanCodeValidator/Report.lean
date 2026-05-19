-- LeanCodeValidator/Report.lean
-- Layer 1 grader: types (Grade, Finding, PredicateReport, CodegenReadinessReport)
-- and four predicate functions (P1 closure, P3/P4 stubs, P5 acyclic) + gradeFor.
-- No Mathlib; cycle detection uses partial DFS with gray/black node coloring.
-- Layer 2 (P3 obligation table, P4 M6 ambiguity) is deferred pending EX1 output.

import LeanCodeValidator.Richness

namespace LeanCodeValidator

-- ——————————————————————————————————————————————————————————————————————————————
-- Grading types
-- ——————————————————————————————————————————————————————————————————————————————

inductive Grade where
  | pass | warn | fail
  deriving DecidableEq, BEq, Repr

structure Finding where
  concept        : String
  message        : String
  recommendation : String
  deriving Repr

structure PredicateReport where
  predicate : String
  grade     : Grade
  findings  : List Finding
  deriving Repr

structure CodegenReadinessReport where
  profile          : Profile
  overallGrade     : Grade
  predicateReports : List PredicateReport
  deriving Repr

-- ——————————————————————————————————————————————————————————————————————————————
-- aggregateOverall — worst-component rule
-- fail > warn > pass
-- ——————————————————————————————————————————————————————————————————————————————

def aggregateOverall (reports : List PredicateReport) : Grade :=
  reports.foldl (fun worst r =>
    match worst, r.grade with
    | .fail, _     => .fail
    | _,     .fail => .fail
    | .warn, _     => .warn
    | _,     .warn => .warn
    | .pass, .pass => .pass) .pass

-- ——————————————————————————————————————————————————————————————————————————————
-- P1 — schema closure
-- Checks spec.unresolvedRefs: any name the parser could not resolve is a FAIL.
-- ——————————————————————————————————————————————————————————————————————————————

def gradeP1Closure (spec : Spec) : PredicateReport :=
  let findings := spec.unresolvedRefs.map fun name =>
    { concept        := name
      message        := s!"'{name}' referenced but not declared in ConceptSpace"
      recommendation := s!"Declare '{name}' with a meta-type, or remove the reference" }
  { predicate := "P1"
    grade     := if findings.isEmpty then .pass else .fail
    findings  := findings }

-- ——————————————————————————————————————————————————————————————————————————————
-- P3 stub — per-meta obligation table (Layer 2, deferred)
-- Returns pass unconditionally. Will be replaced once EX1 calibrates the
-- obligation table (H2 risk: table is our derivation, not a doc citation).
-- ——————————————————————————————————————————————————————————————————————————————

def gradeP3Obligations (_ : Spec) : PredicateReport :=
  { predicate := "P3", grade := .pass, findings := [] }

-- ——————————————————————————————————————————————————————————————————————————————
-- P4 stub — codegen ambiguity / M6 witnesses (Layer 2, deferred)
-- Returns pass unconditionally. Will wrap m6Witnesses and grade by provenance
-- (declared → fail, sigmaFallback → warn) once Layer 2 ships.
-- ——————————————————————————————————————————————————————————————————————————————

def gradeP4Ambiguity (_ : Spec) : PredicateReport :=
  { predicate := "P4", grade := .pass, findings := [] }

-- ——————————————————————————————————————————————————————————————————————————————
-- P5 — generation-order DAG (acyclicity of codegen-dependency subgraph)
-- DFS with gray/black node coloring. partial def: termination is structural
-- on the finite concept graph; no Mathlib proof needed for #eval use.
-- ——————————————————————————————————————————————————————————————————————————————

private partial def dfsCycle {α : Type} [BEq α]
    (adj   : List (α × α))
    (gray  : List α)
    (black : List α)
    (node  : α) : Bool × List α :=
  if gray.any (· == node) then
    (true, black)
  else if black.any (· == node) then
    (false, black)
  else
    let neighbors := adj.filterMap (fun e => if e.1 == node then some e.2 else none)
    let (cycleFound, black') :=
      neighbors.foldl (fun (st : Bool × List α) nb =>
        if st.1 then st
        else dfsCycle adj (node :: gray) st.2 nb)
      (false, black)
    (cycleFound, node :: black')

private def graphHasCycle {α : Type} [BEq α] (edges : List (α × α)) : Bool :=
  let nodes := edges.foldl (fun acc e =>
    let acc1 := if acc.any (· == e.1) then acc else e.1 :: acc
    if acc1.any (· == e.2) then acc1 else e.2 :: acc1) []
  (nodes.foldl (fun (st : Bool × List α) node =>
    if st.1 then st
    else dfsCycle edges [] st.2 node)
  (false, [])).1

def gradeP5Acyclic (spec : Spec) : PredicateReport :=
  let depEdges :=
    spec.edges
    |>.filter (fun e => isCodegenDependency e.edge)
    |>.map    (fun e => (e.src, e.tgt))
  if graphHasCycle depEdges then
    { predicate := "P5"
      grade     := .fail
      findings  := [{ concept        := "spec"
                      message        := "Cycle detected in codegen-dependency subgraph"
                      recommendation := "Remove the cyclic dependency or reclassify the edge via D11 review" }] }
  else
    { predicate := "P5", grade := .pass, findings := [] }

-- ——————————————————————————————————————————————————————————————————————————————
-- gradeFor — top-level entry point
-- Layer 1: runs P1 + P5 for real; P3 + P4 are stubs (pass).
-- predicateReports has exactly 4 entries (P1, P3, P4, P5) per the spec contract.
-- ——————————————————————————————————————————————————————————————————————————————

def gradeFor (spec : Spec) : CodegenReadinessReport :=
  let p1 := gradeP1Closure   spec
  let p3 := gradeP3Obligations spec
  let p4 := gradeP4Ambiguity  spec
  let p5 := gradeP5Acyclic   spec
  let reports := [p1, p3, p4, p5]
  { profile          := spec.profile
    overallGrade     := aggregateOverall reports
    predicateReports := reports }

end LeanCodeValidator
