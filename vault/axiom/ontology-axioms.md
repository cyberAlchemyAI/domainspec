---
tags: [ontology, vault]
node_type: axiom
layer: ontology
nature: explanatory, technical
status: exploratory
veracidade: low
convicção: high
version: 0.1.0
last_updated: 2026-03-17
is_session: false

---

# Ontology Axioms

> Commitments that back the classification system. We take these as given. Revising one requires rethinking the entire labeling and knowledge graph infrastructure.

---

## Objective

This document defines the **non-negotiable commitments** of the ontology system. Every label, edge type, and governance rule derives from one or more of these axioms.

For the working hypotheses that complement these axioms, see `ontology-premises.md`.

---

## Index

1. [AX-ONT-1 — Minimize retrieval entropy](#ax-ont-1--minimize-retrieval-entropy)
2. [AX-ONT-2 — Labels must be orthogonal](#ax-ont-2--labels-must-be-orthogonal)
3. [AX-ONT-3 — Every node must contribute unique information](#ax-ont-3--every-node-must-contribute-unique-information)
4. [AX-ONT-4 — Implicit knowledge is lost knowledge](#ax-ont-4--implicit-knowledge-is-lost-knowledge)
5. [AX-ONT-5 — Explicit questions increase system information](#ax-ont-5--explicit-questions-increase-system-information)
6. [AX-ONT-6 — The vault is a navigable space where proximity is relevance](#ax-ont-6--the-vault-is-a-navigable-space-where-proximity-is-relevance)
7. [AX-ONT-7 — Reasoning is navigation; topology can be engineered](#ax-ont-7--reasoning-is-navigation-topology-can-be-engineered)
8. [Connections](#connections)

---

## AX-ONT-1 — Minimize retrieval entropy

### Context

The classification system exists to reduce the number of documents an agent must inspect to answer a query. Every label, edge, and status rule is a means to this end. A rule that does not reduce retrieval uncertainty should not exist.

**Justifies:** The entire label framework and the orthogonality constraint.
**If revised:** Any arbitrary classification scheme becomes equally valid.

### Technical Foundation

Given a query `Q` seeking document `D` in a vault of `N` documents:

```
H(D | Q) = − Σ p(d | q) · log₂ p(d | q)
```

Effective classification drives `H(D | Q) → 0`. Each orthogonal label adds a filtering dimension that partitions the search space, reducing `H(D | Q)` multiplicatively.

**References:**
- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. Bell System Technical Journal, 27, 379–423. — Entropy and conditional entropy. 78 years Lindy.
- **Kolmogorov, A.N.** (1933). *Foundations of the Theory of Probability*. — Axiomatic probability on which Shannon builds. 93 years Lindy.

---

## AX-ONT-2 — Labels must be orthogonal

### Context

Two labels are orthogonal when knowing one tells you nothing about the other. Correlated labels waste descriptive capacity and create inconsistency opportunities — if two fields say correlated things and one is updated without the other, the system contradicts itself.

**Justifies:** The number of labels, the admission test for new labels, the periodic review of correlations.
**If revised:** Any arbitrary metadata grouping becomes equally valid.

### Technical Foundation

For any two labels `Lᵢ`, `Lⱼ`, mutual information measures dependence:

```
I(Lᵢ ; Lⱼ) = H(Lᵢ) + H(Lⱼ) − H(Lᵢ, Lⱼ)
```

Orthogonality requires `I(Lᵢ ; Lⱼ) = 0` for all pairs. When this holds:

```
H(L₁, ..., Lₙ) = Σ H(Lᵢ)     ← maximum capacity, zero redundancy
```

Admission test for a new label `Lₙ₊₁`:

```
ΔH = H(Lₙ₊₁) − I(Lₙ₊₁ ; L₁, ..., Lₙ)
```

`ΔH ≈ 0` → redundant. `ΔH ≈ H(Lₙ₊₁)` → independent, should exist.

**References:**
- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. — Mutual information as statistical dependence measure. 78 years Lindy.
- **Cover, T.M. & Thomas, J.A.** (1991). *Elements of Information Theory*. Wiley. Ch. 2. — Canonical reference for joint entropy and MI. 35 years Lindy.

---

## AX-ONT-3 — Every node must contribute unique information

### Context

A document should exist only if removing it would destroy information unrecoverable from other nodes. Redundant nodes create ambiguity about which version is canonical and increase retrieval noise.

Admission test: *"If I remove this document, is any information lost that cannot be recovered from the others?"*

**Justifies:** The prohibition of duplicate content and the merge-or-reference rule.
**If revised:** The vault becomes a wiki — documents proliferate without criteria, conflicts coexist.

### Technical Foundation

Each document has a content representation `c(v)` — the information it carries. A node `v` is **essential** iff its content cannot be reconstructed from the rest of the vault plus the graph structure:

```
H( c(v) | { c(u) : u ∈ V \ {v} }, edges of G ) > 0
```

Removing an essential node destroys information no other node (or combination of nodes reached via edges) can reproduce. Removing a non-essential node changes the vault's expression but not its information content.

**A note on structural vs informational redundancy.** An alternative criterion — whether removal alters the stationary distribution `π` of a random walk — captures when removal changes the graph's navigation prior, not whether unique content is lost. The two are related but not equivalent: a content-redundant document with distinctive connectivity can still shift `π`, and a content-unique document with uniform connectivity can leave `π` untouched. This axiom demands the **informational** criterion; structural effects are a downstream concern of AX-ONT-6.

**References:**
- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. — Conditional entropy as the information that remains after conditioning on the rest. 78 years Lindy.
- **Kolmogorov, A.N.** (1965). *Three approaches to the quantitative definition of information*. Problems of Information Transmission, 1(1), 1–7. — Kolmogorov complexity: a document is essential iff including it reduces the vault's minimal description length. 61 years Lindy.

---

## AX-ONT-4 — Implicit knowledge is lost knowledge

### Context

If a rule, connection, or definition is not explicitly declared in the graph, it does not exist for the system. Agents cannot process unwritten conventions. Humans forget them. The vault is reliable only if what is in it is everything that needs to be in it.

Ontology-layer version of `P-SYS-6 — Implied Knowledge is Lost Knowledge`.

**Justifies:** Complete frontmatter, explicit edges, prohibition of implicit classification.
**If revised:** The vault becomes a partial repository requiring human memory to interpret.

### Technical Foundation

A communication channel transmits only what is encoded in the signal:

```
I(vault ; agent) ≤ H(explicit_content)
```

Implicit knowledge has `H = 0` in the channel. Its transmission rate is zero regardless of how much exists in the author's mind.

**References:**
- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. — Channel capacity theorem: unencoded information is untransmitted. 78 years Lindy.
- **Wittgenstein, L.** (1921). *Tractatus Logico-Philosophicus*. Prop. 7: *"Wovon man nicht sprechen kann, darüber muss man schweigen."* 105 years Lindy.

---

## AX-ONT-5 — Explicit questions increase system information

### Context

Mapping what we don't know is as valuable as mapping what we know. A recorded question tells agents and humans that a gap exists — and the gap itself is information. We do not stop acting because we cannot answer something, but we track the unknowns.

**Justifies:** Open Questions sections, `edge_type: questions`, and the ontology backlog.
**If revised:** Gaps remain in the memory of whoever noticed them. Agents never discover them.

### Technical Foundation

Registering a question transforms an **unknown unknown** into a **known unknown**. If variable `Xₖ` is unregistered, the system underestimates its own uncertainty:

```
H_perceived = H(X₁, ..., Xₙ₋₁)  <  H_real = H(X₁, ..., Xₙ)
```

Registering the question makes `H_perceived → H_real`. Total entropy increases, but **calibration** improves. Jaynes's maximum entropy principle formalizes this: not registering a question is an implicit assumption (`Xₖ` doesn't matter) unsupported by data.

**References:**
- **Jaynes, E.T.** (1957). *Information Theory and Statistical Mechanics*. Physical Review, 106(4), 620–630. — Maximum entropy principle. 69 years Lindy.
- **Lindley, D.V.** (1956). *On a Measure of the Information Provided by an Experiment*. Annals of Mathematical Statistics, 27(4), 986–1005. — Expected information as uncertainty reduction. 70 years Lindy.

---

## AX-ONT-6 — The vault is a navigable space where proximity is relevance

### Context

The vault is a graph, not a list. Position determines context. Being at a node means being surrounded by everything relevant to it. Following any edge increases clarity about the topic — even on a random path. Each node should be informationally dense, and connections should form context webs that progressively reveal the system.

**Justifies:** Typed directional edges, prohibition of isolated nodes, density over granularity.
**If revised:** Edges become decoration. The graph loses navigability and becomes a document collection with arbitrary links.

### Technical Foundation

In a graph with transition matrix `P`, the stationary distribution `π` of a random walk concentrates probability on the most connected and contextually dense nodes:

```
π = π · P
π(relevant_node) ≫ π(peripheral_node)
```

This is formally equivalent to PageRank: a node's authority is proportional to the authority of nodes pointing to it. In the vault, an axiom referenced by multiple constitutions and premises has high `π` — a random walk converges to it naturally. The desirable property is short **mixing time** (fast convergence), requiring the graph to be connected with good expansion.

**References:**
- **Markov, A.A.** (1906). *Extension of the law of large numbers to dependent quantities*. — Markov chains: memoryless navigation. 120 years Lindy.
- **Lovász, L.** (1993). *Random Walks on Graphs: A Survey*. Combinatorics, 2, 1–46. — Mixing time and convergence. 33 years Lindy.

---

## AX-ONT-7 — Reasoning is navigation; topology can be engineered

### Context

Our working commitment: we expect reasoning to behave as a traversal over a structured space of representations — documents, concepts, beliefs, derivations. We do not treat this as a proven theorem. We treat it as the operating hypothesis that makes engineering the topology worth doing at all.

If the hypothesis holds, the quality of reasoning an agent can achieve is expected to be shaped by the quality of the space it navigates. This is why we invest in the ontology, the Context Router, the vault-routing tool, and the trust hierarchies: not because a formal bound has been derived, but because we expect such a relationship exists and we are betting accordingly.

**Justifies:** The knowledge graph infrastructure and every downstream axiom in this file — conditional on the hypothesis holding.

**If revised:** If reasoning turns out not to be navigational in the relevant sense, the topology loses leverage on cognition. The vault would still be useful as reference material, but would not carry the load we currently place on it. The other axioms would need re-examination under the new framing.

### Technical Foundation

We model the cognitive state space as a weighted directed graph `G = (V, E, W)` where:
- `V` = representations (documents, concepts, beliefs)
- `E ⊆ V × V` = admissible transitions (derivations, retrievals, associations)
- `W : E → ℝ₊` = transition weights (trust × relevance)

We conjecture — not prove — that a reasoning process behaves as a stochastic walk `{Sₜ}` on `G` with transition matrix:

```
P[i, j] = W(i, j) / Σₖ W(i, k)
```

Under this model, the information an n-step walk carries about a target concept `g` is:

```
Iₙ(q ; g) = H(g) − H(g | Sₙ, S₀ = q)
```

Our working expectation is that the quality of reasoning from `q` toward `g` is shaped by what the topology makes reachable:

```
quality of reasoning(q → g)  ≲  some function of  Iₙ(q ; g)  over G
```

We do not specify this functional relationship. We do not claim it is tight. We claim only that engineering `G` plausibly shifts the distribution of reasoning outcomes — and that this expectation, if borne out, is enough to justify the ontology work. If empirical evidence accumulates, we expect to be able to state the relationship more precisely. If it does not, we expect to revise or retire this axiom.

**References:**
- **Newell, A. & Simon, H.A.** (1972). *Human Problem Solving*. Prentice-Hall. — Reasoning formalized as search through a structured problem space. Used here as conceptual precedent, not as theorem. 54 years Lindy.
- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. — Mutual information framework adapted here to frame the expected relationship. 78 years Lindy.

---

## Derivation Hierarchy

```
AX-ONT-7 (reasoning is navigation; topology engineered)   ← ROOT
├── AX-ONT-1 (minimize retrieval entropy)
│   ├── AX-ONT-2 (orthogonal labels) ← derived from AX-ONT-1
│   ├── AX-ONT-3 (unique node contribution) ← derived from AX-ONT-1 + AX-ONT-2
│   └── AX-ONT-6 (navigable density) ← derived from AX-ONT-1
├── AX-ONT-4 (implicit = lost)
└── AX-ONT-5 (explicit questions = information)

(Former "adaptive system" axiom demoted to P-ONT-9 in ontology-premises.md —
 it is an engineering commitment about maintenance, not a foundational truth.)
```

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[system-axioms]] | `cites` | System axioms are the architecture-layer equivalent; these are the ontology-layer equivalent |
| [[ontology-premises]] | `derives-from` | Ontology premises sit on top of these axioms |
| [[ontology-conventions]] | `derives-from` | The label schema is a direct implementation of AX-ONT-1 and AX-ONT-2 |
| [[confidence-levels]] | `derives-from` | The maturity lifecycle implements P-ONT-9 (adaptivity) |
| [[ontology-constitution]] | `cites` | The constitution describes the intellectual foundations; these axioms formalize the mathematical commitments |
