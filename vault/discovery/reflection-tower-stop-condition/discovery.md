---
tags: [vault, discovery, ontology, reflection-tower, stop-condition, rate-distortion, residue]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
version: 0.1.0
last_updated: 2026-06-30
created_by: victorboscaro@gmail.com
---

# Reflection-Tower Stop Condition

> Conjecture: the missing "when do we stop climbing the tower" signal is an **economic** one — a rate-distortion margin (λ), not a mathematical fixed point. Ascend or promote one more level only while the residue that level removes is worth more than the cost of building it.

## Objective

Name, and propose a falsifiable test for, the stopping criterion the reflection tower currently lacks. The tower predicts the work has no bottom; at some point we stop for a concrete purpose. This discovery argues the stop is set by marginal cost vs marginal residue-reduction, records why that framing is absent from the current corpus, and lists what would have to be true for it to hold. Nothing here is proven; every load-bearing claim is flagged.

---

## 1. Business Context

### Why now

The open question is already written down, by the operator, to a second reader. `onboarding/vladimir/README.md` (§"What I'm specifically asking", line 44) states it plainly:

> **The stop condition.** The reflection tower predicts the work has no bottom. At some point we choose to stop climbing for some specific purpose (paper, talk, day's work). When? On what signal? I don't have an answer.

Note the framing already leans economic — *"for some specific purpose (paper, talk, day's work)"*. The stop is relative to a use, not an absolute point. That is the opening this discovery walks through: the missing "signal" is a **cost-vs-residue exchange rate**, not a structural invariant.

### What's missing (the gap this discovery addresses)

The corpus treats "where does the tower stop?" only two ways, neither of which answers the operator's question:

- **Mathematically / structurally.** `conceptual/reflection-tower-in-domainspec.md` §1.3 and `discovery/graph-as-residue-attractor/discovery.md` OQ-1 frame termination as a question of *climb rate* — transfinite extension, iterated Yoneda vs Feferman ascent. `lenses/01-invariants-and-layer-alignment/findings.md` (S8, S10) argue promotion halts by well-foundedness and terminal-object existence. These say the tower *can* be well-founded; they do not say *when a person should stop*. `[corpus-state, verified by precedent sweep]`
- **By capacity bound.** `GOVERNANCE-ATTENUATION.md` ("at 7, returns are already diminishing") and the folder-structure-fractal "≤7 by author discretion" cap termination at a cognitive limit (Miller/Ashby), not at an economic optimum. `[corpus-state]`

The economic stop rule itself **does** exist in the repo — *"refine until the marginal utility of revealing more schema drops below its marginal cost… over-refining past saturation reduces fidelity"* (`docs/research/entropy-symmetry/findings.md:70`, OQ-2 at `:85`) — but only for **schema-refinement / context-building**. It is never joined to the tower climb, the promotion chain, or residue closure. Joining them is the contribution of this node. `[novelty claim — see §4]`

### What stays the same

- The reflection tower itself is not under revision. `conceptual/reflection-tower-in-domainspec.md` is a stocktake and stays as is.
- This discovery is exploratory. It is not a premise, constitution, or axiom, and does not claim to be promotable yet.
- AX-ONT-1 and the new premise P-ONT-10 are not modified; this discovery *cites* P-ONT-10 as the same principle applied to a different operation (see C4).

---

## 2. Core concepts

### C1. The tower has no fixed-point stop

The flat "unique fixed point" framing was refuted (Lawvere's diagonal on a binary truth-object) in `graph-as-residue-attractor/discovery.md` C3/D-1. So "stop at the fixed point" is not available — there is no fixed point to stop at. Termination cannot be a structural invariant of closure. `[theorem-cited — Lawvere/Yanofsky, via the sibling discovery]`

### C2. The existing stop treatments do not answer the operator's question

As catalogued in §1: every current treatment is either climb-rate mathematics or a capacity cap. Neither yields a *decision rule* a person can apply to a concrete purpose ("ship the paper now or climb one more level?"). The question is a decision-theory question wearing a category-theory costume. `[framing]`

### C3. The proposed criterion: a rate-distortion margin (λ)

Model one tower step as buying a reduction in residue at a cost. Let `Δresidue(n)` be the residue the step from level `n` to `n+1` removes (what the new level can now name that the old could not), and `cost(n)` the price of building it (author effort, tokens, schema churn, reader load). Define the stop:

> **Stop climbing at the first level `n*` where the marginal residue removed is no longer worth its marginal cost** — i.e. where `Δresidue(n*) < λ · cost(n*)`, with λ set by the purpose at hand.

Equivalently, the climb minimizes the Lagrangian `residue + λ · cost`; λ is the exchange rate between effort and residue, and "the purpose (paper, talk, day's work)" *is* the choice of λ. A talk tolerates more residue (low λ-budget for effort) than a formal proof. `[conjecture — this is a reframing, not a theorem; load-bearing only if Δresidue and cost are well-defined, see OQ-1/OQ-2]`

### C4. Same principle as P-ONT-10, different operation

`ontology-premises.md` P-ONT-10 ("reduce entropy to the constrained optimum, not to zero") states this exchange-rate principle for the **classification** operation (when to stop adding labels / splitting docs). This discovery applies the *same* principle to the **promotion / tower-climb** operation. One principle, two operations: stop reducing when the marginal reduction stops paying. `[link — unifies, does not re-derive]`

---

## 3. Why this is not "seek zero residue"

The tower never closing (C1, Gödel/Lawvere) and the open/tacit domain being losslessly incompressible (AX-ONT-4; the boundary cases "purely tacit starves" / "continuous domains need sheaves" in `graph-as-residue-attractor/discovery.md` OQ-6) mean residue-zero is not merely "not the goal" — it is **unreachable**. The stop criterion is therefore never "stop when residue is zero" (impossible) but "stop when the next bit of residue costs more to remove than it is worth." Pursuing past `n*` does not approach an unreachable zero faster; it destroys value. `[two independent supports for unreachability: Gödelian + tacit-domain]`

---

## 4. Novelty (precedent sweep result)

A precedent sweep across the tower docs, all `graph-as-residue-attractor` lenses, `reflection-tower-exports`, the bets ledger, `AXIOMS.md` A6, and `GOVERNANCE-ATTENUATION*.md` found **no document that joins a marginal-cost-vs-marginal-residue rule to the tower climb or the promotion chain**. The closest matches and why they fall short:

- `onboarding/vladimir/README.md:44` — asks the question as a decision problem and declares the answer unknown. (Corroborates the gap.)
- `docs/research/entropy-symmetry/findings.md:70,85` — has the economic rule, scoped to schema-refinement only; never mentions the tower. (Exists but disconnected — the half this discovery joins.)
- `AXIOMS.md` A6 — an economic prune rule, but applied to *governance rules* competing for instruction bandwidth, not to *tower levels*. Same family, different object.

`[novelty: HOLDS — the join is absent]`

---

## 5. Open questions

### OQ-1. Is `Δresidue(n)` measurable, or only ordinal?

The criterion needs a residue-reduction quantity per level. The framework's residue is currently qualitative (the unrepresentable diagonal element, `graph-as-residue-attractor` C4). If `Δresidue` is only ordinally comparable, λ is a heuristic, not a number. **Recommendation.** Try to define `Δresidue` operationally on one worked tower (e.g. the R1–R4 residue closures) and check whether removed-residue can be ranked, even without a cardinal scale.

### OQ-2. Is `cost(n)` well-defined for a tower step?

Author effort + tokens + schema churn + reader load are heterogeneous. Without a common unit, `residue + λ·cost` is not a real Lagrangian. **Recommendation.** Start with a single dominant cost proxy (e.g. token/maintenance budget, the unit the context-builder already uses) and treat the rest as ordinal.

### OQ-3. Relation to graph-as-residue OQ-1 (the mathematical stop)

OQ-1 there asks the climb *rate* (iterated Yoneda vs Feferman). This discovery asks the climb *termination* (economic). Are they independent, or does the climb rate set the cost curve `cost(n)`? **Recommendation.** Define both on one small example and check whether rate determines cost.

### OQ-4. Does this answer Vladimir, or only rename his question?

Replacing "on what signal?" with "λ" is only progress if λ is, in some case, actually computable or at least decidable by inspection. **Recommendation.** Treat the next real "ship vs climb" decision as the test: was the call made by an explicit cost-vs-residue judgment? If yes, the reframing earned its keep.

---

## 6. What would move this discovery

- A worked tower (R1–R4 closures, or the promotion of any one node) on which `Δresidue` and `cost` are made concrete enough to locate `n*` after the fact.
- A real "ship the artifact vs climb one more level" decision logged with its implicit λ, confirming or refuting that the rule describes how the stop is actually made.
- A refutation: a case where the right stop is set by something that is *not* a cost-vs-residue margin (e.g. a hard external deadline, or a structural must-close-this-gap obligation) — which would bound the criterion's scope.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `onboarding/vladimir/README.md` | `motivated-by` | §"What I'm specifically asking" line 44 — the operator's unanswered stop-condition question this discovery addresses. |
| `implementation/app-frontend/vault/ontology/ontology-premises.md` | `derives-from` | P-ONT-10 (constrained optimum) is the same exchange-rate principle on the classification operation; this discovery applies it to the tower climb. |
| `conceptual/reflection-tower-in-domainspec.md` | `contextualizes` | The tower stocktake whose §1.3 termination question is mathematical (climb rate); this discovery supplies the missing economic reading. |
| `discovery/graph-as-residue-attractor/discovery.md` | `derives-from` | C3/D-1 (no fixed point → no structural stop), OQ-1 (climb rate vs this node's climb termination), OQ-6 (tacit/open domain → residue-zero unreachable). |
| `docs/research/entropy-symmetry/findings.md` | `cites` | The marginal-utility stop rule (`:70`) and its context-builder OQ-2 (`:85`) — the economic rule this discovery lifts from schema-refinement to the tower. Cited as evidence, not authority (it is draft). |
