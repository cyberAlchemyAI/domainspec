---
tags: [category-theory, formal-methods, compilation, functor, drift]
node_type: axiom
layer: ontology, architecture
nature: explanatory, technical
status: exploratory
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-19
is_session: false
---

# Axiom — Compilation is a functor; drift is loss of functoriality

> Domain (L₁) and code (L₂) can be modeled as categories, and the compilation between them is a functor `Δ : L₁ → L₂`. Drift = lack of functoriality. This is the load-bearing claim of L3 (Mathematics / formal methods) in `vault/foundational-knowledges.md`.

---

## Objective

Treat the domain as a **category** `L₁`: objects are domain concepts (entities, events, rules), morphisms are domain relationships (causality, derivation, refinement), and composition is the chaining of those relationships. Treat code as a **category** `L₂`: objects are code units (modules, types, functions), morphisms are dependencies and call relationships, composition is the call graph. The DomainSpec compilation from intent to code is then a structure-preserving map `Δ : L₁ → L₂` — a functor. Functoriality means: composition in `L₁` maps to composition in `L₂` (the diagram commutes), and identities map to identities.

**Drift, formally, is the failure of functoriality.** A domain morphism with no `Δ`-witness in the code (`τ(b) = ∅`) is a missing arrow under the functor. A code edge with no domain preimage is an orphan (an arrow in `L₂` outside `image(Δ)`). The category-theoretic frame supplies a single language for what the alignment-auditor, layering-auditor, and Δ-extractor are all approximating.

---

## Why it is load-bearing

If `L₁` and `L₂` are *not* usefully categories, or compilation is *not* usefully a functor:

- AX-DS-1 ("spec is source; code is its compiled image") loses its mechanical formalism — the DPI / Curry–Howard story still works, but the structural correspondence story collapses.
- The L1-extractor, L2-extractor, and Δ-extractor agents lose their target — they would emit data with no formal interpretation.
- The "drift = lack of functoriality" framing dissolves; drift would have to be redefined per audit type, fragmenting the alignment-auditor and layering-auditor into uncoordinated checks.
- Layer L3 of the foundational map reduces to "we use graphs and types," which is true but does not justify the categorical machinery.

This axiom is `exploratory` because the machinery exists in schema but not yet operationally — see `domainspec-premises.md` P-DS-2 and P-DS-3 for the operational shortfall.

---

## Domain of validity

The axiom holds **wherever the domain admits a finite, typed presentation** of objects and morphisms. Boundary conditions:

- **Where it holds firmly:** business domains where entities, events, and rules can be enumerated and typed (payments/FIDC, inventory, orders). The single non-degenerate L1 produced so far (`docs/features/payment-processing/_categorical/L1.json`, 21 objects, 26 morphisms) lives here.
- **Where it weakens:** domains dominated by tacit knowledge, continuous-valued state, or ML-driven behavior whose semantics resist typed presentation. The functor still exists as an idealization, but its `Δ` witnesses may be probabilistic rather than structural.
- **Where it fails:** wholly open-ended creative domains where the "domain category" itself is not stable across time. The framing reduces to metaphor.

The axiom is also **status: exploratory** because the operational arms (L2 extractor, Δ verifier) are degenerate today. It is included in the axiom layer not because it is empirically settled but because it is *structural* — every other formal claim in DomainSpec leans on it implicitly. Demoting to a premise would mis-classify the role it plays.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/foundational-knowledges.md` | `cited-by` | L3 (Mathematics / formal methods) layer in the foundational map cites this axiom as its load-bearing claim. |
| `vault/axiom/domainspec-axioms.md` | `cites` | AX-DS-1, AX-DS-2, AX-DS-3 derive their structural form from the functor framing recorded here. |
| `vault/premise/domainspec-premises.md` | `cites` | P-DS-2 (L1/L2 extraction tractable) and P-DS-3 (Δ-witnessed verification) are the operational obligations of this axiom; both are currently `veracidade: low`. |
