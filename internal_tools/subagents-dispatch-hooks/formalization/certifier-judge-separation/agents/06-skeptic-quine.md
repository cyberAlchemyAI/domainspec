## 06 — Quine — definitional-soundness (round 1)

> Persisted by parent: read-only agent; content verbatim below.

**Candidate C2:** the security CERTIFIED-vs-ASSUMED border, the I/O envelope-vs-body cut, and the safe-RL certified-feasible-set are ONE typed-residue object — "the residue is the typed gap between a syntactic/structural predicate and a semantic/intentional one."

### Equivocation analysis — the term "gap" does not hold its referent across the three instances

| Leg | "syntactic/structural" predicate | "semantic/intentional" predicate | What separates them |
|---|---|---|---|
| Security (Rung 5) | `eventTaints S e` — a path-prefix membership test, decidable `Bool` (SECURITY-TOWER.md:144,265-267) | "this datum **is** a secret" (content property) | decidable-prefix vs undecidable-content-classifier — an **oracle gap** |
| I/O envelope vs body | a typed token (`ToolName`, `StructuredArgs`) | "the reasoning that produced it is sound" | type-membership vs quality-of-reasoning — the second relatum is **not a predicate over the same carrier**, it is a property of an *unmodeled* process — a **category gap** |
| Safe-RL | `x ∈ {V(x) ≤ c}` — Lyapunov sublevel / CBF invariant set | `x ∈` the true maximal safe set | conservative subset vs maximal set, both in the SAME state space, joined by a proved sufficient-condition theorem — a **containment gap** |

The three "gaps" are three different mathematical species: (1) oracle gap (computability-typed); (2) category gap (a predicate vs a property on a different, unmodeled carrier — not even a relation between comparable objects); (3) containment gap (measure/approximation-typed). Only legs (1) and (3) share a frame (a verified sufficient condition under-approximating an uncertifiable target). Leg (2)'s "semantic body" is not a predicate but an absent process — the alleged gap is a **conflation of two ontological levels**. The unification is carried by the English word "gap," not by a type. **A pun, per Ashby's incommensurability dissent — confirmed at the definitional level.**

This is the definitional reason the cross-domain unification cannot stand: the unifying predicate is not univocal across the three legs.

### Lethal collapse-test (precise)

The unification is sound iff one exhibits a single witness-preserving functor `R : 𝒟 → 𝐑𝐞𝐬` (units/counits, or at minimum a faithful comparison) such that `R(security)`, `R(io)`, `R(safe-RL)` ARE the three residues — a morphism that **transports a witness** of one residue to a witness of another. Absent transport, "one residue" is analogy.

Anything weaker? A shared Galois connection suffices only if it is the same adjunction `α ⊣ γ` in all three (under-approximation `γ` of an ideal target). Legs (1) and (3) plausibly share `γ` = "best certifiable inner approximation ⊣ true set." Leg (2) has **no such adjunction**: there is no monotone map from typed tokens to reasoning quality — the codomain is not ordered by, nor a completion of, the domain; the right adjoint cannot be written. So the weakest sufficient witness (a common Galois frame) fails on leg (2) specifically. The functor is therefore not merely unbuilt — for leg (2) it is **un-buildable as stated**, obstructed by a missing carrier.

### Status

- The split *within each leg* is sound (security: FIDES/CaMeL + Rung-5 collapse-test; safe-RL: Lyapunov/CBF under-approximation, Ames et al.; I/O: type-soundness vs semantic adequacy). It is the 3-way unification that fails.
- The 3-way unification is a vacuous analogy: the unifying predicate equivocates (oracle ≠ category ≠ containment), and the rescue that would unify legs 1+3 (a shared Galois/soundness frame) provably fails to extend to leg 2.
- A narrower security + safe-RL sub-claim (a shared one-sided soundness/Galois gap) has univocal terms with the functor merely unbuilt — that smaller claim could be genuinely open, but must be stated and witnessed on its own, not under the failed triple. Not authored here (R6).

### Dissent:

"Genuinely-open" presupposes univocal terms with an unbuilt functor; the 3-way candidate has neither — the unifying predicate is a pun across three distinct gap-species, and on the I/O leg the required comparison map is into a carrier the candidate never models, so the functor is *obstructed*, not merely *absent*. To be a single entity is to be one value of one function (a functor) at three arguments; the candidate gives three functions sharing only a homonym. The 3-way object is a vacuous analogy. A narrower security + safe-RL soundness/Galois gap may survive as genuinely open, but it is a different, smaller claim that must be stated and witnessed on its own.
