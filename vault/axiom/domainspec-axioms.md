---
tags: [domainspec, methodology, vault]
node_type: axiom
layer: domain, application
nature: explanatory, technical
status: exploratory
veracidade: medium
convicção: high
version: 0.5.0
last_updated: 2026-05-05
is_session: false
---

# DomainSpec Axioms

> Foundational commitments of the DomainSpec methodology — the discipline of treating domain documents as source and code as their compiled image. Revising one collapses the methodology into "documented code."

---

## Objective

This document defines the **non-negotiable commitments** of DomainSpec as a methodology. It sits beside `system-axioms.md` (architecture) and `ontology-axioms.md` (knowledge organization). Every DomainSpec premise, constitution, agent, and skill derives from one or more of these axioms.

The main section gives, per axiom, a tight pair — **Context / Operationalization**. The appendix carries the formalism (math, alternative formulations, boundary conditions) and the consolidated references.

For working hypotheses — including the L1/L2/Δ extraction machinery — see `domainspec-premises.md`.

---

## Index

1. [AX-DS-1 — Spec is source; code is its compiled image](#ax-ds-1--spec-is-source-code-is-its-compiled-image)
2. [AX-DS-2 — One vocabulary across spec and code](#ax-ds-2--one-vocabulary-across-spec-and-code)
3. [AX-DS-3 — No orphan behavior](#ax-ds-3--no-orphan-behavior)
4. [AX-DS-4 — Decision space is preserved with the decision](#ax-ds-4--decision-space-is-preserved-with-the-decision)
5. [Derivation Hierarchy](#derivation-hierarchy)
6. [Appendix](#appendix)
7. [References](#references)
8. [Connections](#connections)

---

## AX-DS-1 — Spec is source; code is its compiled image

### Context

Truth flows spec → code. Code is a (possibly many-to-one) compilation of intent recorded in domain documents. Reverse-engineering intent from steady-state code is forbidden because compilation is lossy. The brownfield bootstrap is a one-shot exception, treated as a boundary condition (see [A.1](#a1--ax-ds-1)).

*If revised:* documentation becomes optional commentary on whatever the code happens to do.

### Operationalization

- `domainspec-alignment-auditor` flags drift when code states something the spec does not.
- `domainspec-layering-auditor` flags code in the wrong layer (compiled to a target the spec did not authorize).
- `domainspec-spec-feature` and the discovery → spec → plan → code pipeline ordering enforce direction.
- `domainspec-brownfield-translation` operationalizes the one-shot bootstrap exception.

Math, boundary condition, and Curry–Howard analogy are in [A.1](#a1--ax-ds-1).

---

## AX-DS-2 — One vocabulary across spec and code

### Context

The registry is a single naming target. Spec concepts and code symbols both project onto it. A code symbol outside the registry, or a spec concept without a code symbol, breaks the AX-DS-1 compilation invariant.

*If revised:* spec and code drift into two ontologies sharing only English.

### Operationalization

- `domainspec-sync-registry` rebuilds `docs/registry.md` and `docs/glossary.md` from feature SPEC concept tables.
- `domainspec-alignment-auditor` flags spec/code drift on shared concepts.

Math (commuting diagram of naming functors) is in [A.2](#a2--ax-ds-2).

---

## AX-DS-3 — No orphan behavior

### Context

Every behavior in code must trace to an authoring artifact (spec, discovery, decision, premise, axiom). Convenience helpers and "just-in-case" branches outside the artifact graph violate AX-DS-1: they exist in the compiled image with no preimage.

*If revised:* code accumulates incidental decisions invisible to the spec.

### Operationalization

- `domainspec-layering-auditor` flags code units lacking a citation in any aspect.
- `domainspec-alignment-auditor` cross-checks each behavior against the artifact graph.
- The "no half-finished implementations" rule (CLAUDE.md) prevents partial compilations from accumulating.

Math (trace map, conditional entropy, surjectivity) is in [A.3](#a3--ax-ds-3).

---

## AX-DS-4 — Decision space is preserved with the decision

### Context

A spec records the **chosen** alternative. The discovery, sessions, and decision nodes record the **rejected** branches. Both are required.

*If revised:* rejected ideas resurface as fresh proposals; the cost of every future decision regresses to the original.

### Operationalization

- The discovery → spec ordering forces the option space to be recorded before the choice.
- Sessions (`is_session: true`) preserve the reasoning context behind each closed decision.
- Project decisions, hypotheses, and propositions are first-class graph nodes, not inline spec sections.
- `domainspec-decision-gate` blocks document mutation when a decision is unresolved.

Math (counterfactual closure, EVPI) is in [A.4](#a4--ax-ds-4).

---

## Derivation Hierarchy

```
AX-DS-1 (spec → code)              ← ROOT
├── AX-DS-2 (one vocabulary)       ← derived from AX-DS-1
└── AX-DS-3 (no orphan behavior)   ← derived from AX-DS-1

AX-DS-4 (decision space)           ← independent root (provenance, not compilation)
```

The L1/L2/Δ machinery — proposed initially as axioms — is demoted to premises in `domainspec-premises.md` (P-DS-2, P-DS-3) pending CI enforcement and Tier-2 verifiers.

---

## Appendix

One section per axiom. Each contains the formalism (Math) and any extended notes — alternative formulations, boundary conditions, historical provenance. References are consolidated at the end.

### A.1 — AX-DS-1

#### Math

For intent `S`, code `C`, and compilation `Φ : S → C`, the Data Processing Inequality gives, for any chain of refactors `C → C₁ → ... → Cₙ`:

```
I(intent ; S) ≥ I(intent ; C) ≥ I(intent ; Cₙ)
```

When `Φ` is many-to-one: `H(S | C) > 0` — reverse-imaging is lossy by construction.

**Brownfield boundary condition** (one-shot):

```
β     : C → 𝒫(S)                       (reconstruction returns a set)
ratify : 𝒫(S) × user_decisions → S₀    (user collapses the set)
```

After ratification, AX-DS-1 governs strictly from `S₀` onward; `β` does not recur.

#### Boundary condition (brownfield bootstrap)

The axiom governs the **evolution** of the spec↔code relationship in steady state. It does not govern the **establishment** of the initial spec for a project that already has code. The brownfield case is a permitted one-shot exception, structured as a boundary condition — like initial conditions for a differential equation.

The cardinality `|β(c)| > 1` is exactly the DPI consequence: many intents compile to the same code, so reading code yields a *set* of candidate intents, not a single one. Interactive question-asking narrows the set in practice.

Ratification is the critical step: the user *declares* `S₀` to be the source by fiat. The lossy reverse-compilation is permitted only because the human absorbs the loss — every dimension along which `β(c)` was ambiguous becomes a recorded decision in the AX-DS-4 sense, with the rejected candidates `β(c) \ {S₀}` preserved as part of the decision-space closure.

Once `S₀` exists, the bootstrap exception does not recur. Re-running `β` on a project that already has a ratified `S₀` is forbidden — doing so re-establishes the source from the compiled image and discards prior ratification.

Operational obligations on any brownfield-translation implementation are recorded in P-DS-12 (`domainspec-premises.md`) as testable open work.

#### Curry–Howard analogy

The DPI argument for spec → code is structurally identical to the Curry–Howard correspondence: a proof carries strictly more structural information than its compiled program form, and reconstructing a proof from a program requires either auxiliary information or a one-shot inference. DomainSpec adopts the same direction of truth — proofs (specs) generate programs (code), not the inverse — and brownfield translation is the proof-reconstruction one-shot.

#### Promotion provenance from P-SYS-3

AX-DS-1 is the formal promotion of `P-SYS-3 — Code is the Compiled Output of Documentation` from premise to axiom, performed on 2026-05-05. The original premise had `convicção: high, veracidade: medium` and was doing axiom-work (justifying the entire alignment-audit machinery) without axiom-status. The promotion attaches the DPI formalism and recognizes that the claim is non-negotiable to the methodology, not a hypothesis under test. The original P-SYS-3 entry is preserved in `system-premises.md` for provenance.

---

### A.2 — AX-DS-2

#### Math

Let `Σ_S`, `Σ_C` be the spec concepts and code symbols, `R` the registry, `N_S : Σ_S → R` and `N_C : Σ_C → R` their naming maps, and `Φ_concept` the concept-level compilation. The axiom requires:

```
image(N_S) = image(N_C) = R           (coverage)
N_S, N_C injective                    (no aliases)
N_C ∘ Φ_concept = N_S                 (compilation preserves names)
```

Equivalently, this diagram commutes:

```
        Φ_concept
   Σ_S ──────────▶ Σ_C
    │               │
   N_S             N_C
    ▼      id       ▼
    R ────────────▶ R
```

#### Naming as a natural transformation

When the diagram above commutes, `N_S` and `N_C` are components of a natural transformation between the spec-naming functor and the code-naming functor; both factor canonically through `R`. Information-theoretically, `H(Σ_C | Σ_S, R) = 0` — code names carry no information beyond what the spec plus the registry already determine. Drift between the two equals positive conditional entropy.

The categorical view — naming as a natural transformation rather than a string-equality check — matters when the registry evolves: a registry change is a 2-cell, and both `N_S` and `N_C` must update coherently to preserve commutativity.

---

### A.3 — AX-DS-3

#### Math

Let `B` = behaviors observable in code, `A` = authoring artifacts. The axiom requires the trace map:

```
τ : B → 𝒫(A) \ {∅}
```

— every behavior has at least one justifying artifact. Equivalently, `H(B | A) = 0`. In categorical terms, the compilation `Φ : Spec → Code` must be surjective onto `B`; an orphan is a `b ∈ B \ image(Φ)`.

#### Why surjectivity, not bijectivity

The axiom requires `Φ : Spec → Code` to be surjective onto `B`, not bijective. One spec artifact may legitimately produce many code units (a single rule may be implemented across multiple modules), and one code unit may trace to many artifacts (a function justified by both a spec section and a project decision). The trace map `τ` returning `𝒫(A)` rather than `A` reflects this. What is forbidden is the empty preimage — code that traces to nothing.

Operationally, layering and alignment auditors compute approximations of `H(B | A)` by counting code units lacking any spec citation, weighted by call-graph centrality.

---

### A.4 — AX-DS-4

#### Math

At decision point `t`, let `A_t` be the alternative space, `D_t ∈ A_t` the choice, `R_t = A_t \ {D_t}` the rejected branches. Storing only `D_t` loses:

```
H(A_t | D_t) = log₂(|A_t| − 1)         (uniform prior)
```

The axiom requires storing the counterfactual closure `(A_t, D_t, R_t, reasons(R_t))`. Then:

```
EVPI(re-decide at t' | (A_t, D_t, R_t))  <  EVPI(re-decide at t' | D_t)
```

— the agent does not pay to rediscover what was already evaluated.

#### Parallel to AX-ONT-5

AX-DS-4 is the methodology-layer counterpart of AX-ONT-5 (explicit questions increase system information). Both rest on the same calibration argument: registering an unknown — whether a question or a rejected alternative — converts it from an unknown unknown to a known unknown, increasing perceived entropy `H_perceived → H_real` while improving the agent's calibration about the cost of revisiting.

---

## References

Grouped by the axiom whose Math section they back.

### AX-DS-1

- **Cover, T.M. & Thomas, J.A.** (1991). *Elements of Information Theory*. Wiley. Theorem 2.8.1 (Data Processing Inequality). 35 years Lindy.
- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. Bell System Technical Journal, 27. — Source–channel separation; conditional entropy. 78 years Lindy.
- **Howard, W.A.** (1969 / pub. 1980). *The formulae-as-types notion of construction*. — Curry–Howard correspondence. 57 years Lindy.
- **Hadamard, J.** (1902). *Sur les problèmes aux dérivées partielles et leur signification physique*. — Boundary conditions for well-posed problems (analogy used in the brownfield discussion). 124 years Lindy.

### AX-DS-2

- **Mac Lane, S.** (1971). *Categories for the Working Mathematician*. Springer. Ch. I (functors), Ch. II (natural transformations). 55 years Lindy.
- **Goguen, J.A.** (1991). *A categorical manifesto*. Mathematical Structures in Computer Science, 1(1). — Categories as the natural language of structure-preserving translation. 35 years Lindy.
- **Awodey, S.** (2010). *Category Theory* (2nd ed.). Oxford. Ch. 7 (functors and naturality). 16 years Lindy.

### AX-DS-3

- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. — Conditional entropy as residual unexplained information. 78 years Lindy.
- **Gotel, O. & Finkelstein, A.** (1994). *An Analysis of the Requirements Traceability Problem*. Proc. IEEE Int'l Conf. on Requirements Engineering. — Formal definition of orphan/widow artifacts in traceability. 32 years Lindy.

### AX-DS-4

- **Lindley, D.V.** (1956). *On a Measure of the Information Provided by an Experiment*. Annals of Mathematical Statistics, 27(4), 986–1005. — Expected information of an experiment; foundation of EVPI. 70 years Lindy.
- **Pearl, J.** (2009). *Causality: Models, Reasoning, and Inference* (2nd ed.). Cambridge. Ch. 7 (counterfactuals). 17 years Lindy.
- **Jaynes, E.T.** (1957). *Information Theory and Statistical Mechanics*. Physical Review, 106(4). — Maximum entropy and calibrated uncertainty. 69 years Lindy.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[system-axioms]] | `cites` | AX-DS-1 leans on AX-SYS-1/AX-SYS-2; AX-DS-3 leans on AX-SYS-2; AX-DS-4 leans on AX-SYS-4. |
| [[ontology-axioms]] | `cites` | AX-DS-3 is the methodology-layer counterpart of AX-ONT-4; AX-DS-4 is the methodology-layer counterpart of AX-ONT-5. |
| [[domainspec-premises]] | `derives` | DomainSpec premises sit on top of these axioms. |
| [[system-premises]] | `cites` | AX-DS-1 is the formal promotion of P-SYS-3; the premise is preserved there for provenance. |
