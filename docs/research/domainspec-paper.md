# DomainSpec: A Layered Meta-Architecture for Deterministic Software Derivation and Governance Attenuation in Multi-Agent Systems

**Victor Rondelli**

---

## Abstract

Large language model (LLM) agents can now generate code, tests, and infrastructure from natural-language specifications. Yet without formal structure, their outputs remain stochastic — non-reproducible, non-auditable, and ungovernable at scale. We present **DomainSpec**, a layered meta-architecture (L0–L7) that bridges domain knowledge to verified software through deterministic derivation rules and self-regulating governance. The framework introduces four contributions: **(C1)** a dual-track meta-model spanning business semantics and operational enforcement across seven layers; **(C2)** a typed domain ontology of 25 meta-types and 29 typed relationships that enables deterministic derivation both per feature ($T = f(C, R, \Delta)$) and across feature composition ($T_{composed} = f(C, R, \Delta) + f_{cross}(E_{AB}, \Delta_{cross})$), mapping domain concepts to test obligations, observability metrics, and implementation contracts; **(C3)** a governance attenuation theory explaining why adding governance layers to multi-agent systems *decreases* per-layer fidelity, bounded by Shannon channel capacity; and **(C4)** a meta-circular self-governance mechanism where the framework's axioms, constitution, and tuning loop govern — and prune — themselves. We validate DomainSpec on a production system with 7 features across 3 business pillars, deriving 445 test obligations and 146 observability metrics from 89 domain concepts. Results show that typed ontologies eliminate the stochastic gap between specification and implementation, while structural governance interventions (observer-executor separation, deterministic signal detection, via negativa pruning) restore enforcement fidelity without adding layers. DomainSpec is open-source and available as a replication package.

**Keywords:** domain-driven design, meta-modeling, deterministic test derivation, LLM agents, governance attenuation, multi-agent systems, specification-first development

---

## 1. Introduction

The emergence of LLM-based coding agents — SWE-agent [1], Devin [2], GitHub Copilot Workspace [3] — has shifted the bottleneck in software engineering from *writing code* to *governing what agents write*. These systems can produce syntactically correct implementations from natural-language prompts, but they lack formal guarantees about completeness, consistency, or traceability to business requirements.

Three fundamental problems remain unsolved:

1. **The Stochastic Gap.** Given the same specification, an LLM agent may produce different tests, different implementations, and different coverage on each run. There is no deterministic function from specification to verification obligations.

2. **The Governance Paradox.** As organizations add rules, guardrails, and review layers to constrain agent behavior, the per-rule compliance rate *decreases* — an effect we formalize as governance attenuation. More governance produces less governance.

3. **The Meta-Circular Problem.** Who governs the governance? Frameworks that constrain agent behavior must themselves be constrained, creating an infinite regress that existing approaches resolve by fiat (a human reviews everything) rather than by structure.

### 1.1 Core Hypothesis & Research Questions

DomainSpec is grounded in three intertwined hypotheses:

**H1 — Domain Structure Determines Test Completeness:** If domain concepts (entities, rules, events, calculations, workflows, policies) and their relationships (references, produces-for, triggers, enforces) are formally modeled, then test obligations can be *deterministically derived* with coverage traceable to business requirements. The hypothesis predicts that typed domain models are both *necessary* (informal models produce incomplete, non-reproducible tests) and *sufficient* (typed models produce comprehensive, derivable tests).

**H2 — Governance Layers Have Attenuation Bounds:** As multi-agent systems add decision-making layers (specify → derive → verify → enforce → tune), per-layer compliance fidelity decreases in a measurable pattern bounded by Shannon channel capacity and the cognitive load on agents. The hypothesis predicts that naive layer stacking yields exponential attenuation, but *structural interventions* (observer-executor separation, deterministic signal detection) can invert the trend without removing layers.

**H3 — Self-Improving Systems Require Meta-Circular Governance:** Systems that improve themselves need mechanisms to improve those improvement mechanisms, which creates an infinite regress. The hypothesis predicts that a bounded strange loop — where the framework's constitution axioms govern how the constitution itself evolves — can resolve this without external authority.

These hypotheses drive four research questions:

**RQ1:** Can we derive deterministic, complete, and traceable test suites from domain models without manual test authoring? (→ C2)

**RQ2:** Does adding governance layers to multi-agent systems decrease fidelity predictably, and can structural interventions restore fidelity without removing layers? (→ C3)

**RQ3:** Can agent roles (PO, QA, Dev, Stakeholder) make better decisions if they share a common domain model and governance signals? (→ C1)

**RQ4:** Can a system govern its own governance through axioms and tuning loops, achieving self-improvement without infinite regress? (→ C4)

These questions map to experiments E1-E10 (RQ1-RQ3) and E11-E20 (meta-meta framework generalization of RQ2-RQ4).

---

This paper presents **DomainSpec**, a layered meta-architecture that addresses all three problems through a unified structural approach. Rather than treating specification, derivation, governance, and self-improvement as orthogonal concerns, DomainSpec organizes them as emergent properties of a seven-layer hierarchy:

- **Layers 0–1** define the domain ontology — a closed vocabulary of 25 meta-types and 29 typed relationships that capture business semantics, including cross-feature composition edges.
- **Layer 2** hosts the derived software — tests, code, and metrics produced by deterministic rules applied to L1 concepts.
- **Layers 3–4** encode governance — a formal constitution (L3) grounded in epistemic axioms (L4), each rule traceable to the harm its absence causes.
- **Layer 5** provides navigation — structured discovery of concepts across the knowledge graph.
- **Layer 6** enforces compliance — alignment audits, blocking gates, and deterministic signal detection.
- **Layer 7** orchestrates execution — 14 specialized agents and 25 skills coordinated through a nine-stage pipeline.

The key insight is that derivation and governance are not bolted onto the system — they are *structural consequences* of the layered architecture. A typed ontology (L1) deterministically produces tests (L2). A formal constitution (L3) deterministically maps to enforcement gates (L6). The tuning loop (signals → reflection → improvement) closes the system into a self-regulating cycle where Axiom A6 ("govern the governance itself") creates a Hofstadterian strange loop [4] that prevents infinite regress.

We make four contributions:

- **C1: Meta-Architecture.** A dual-track (business × operational) seven-layer model where each layer governs the layer below and is governed by the layer above, with formal derivation chains traceable from epistemic axioms to enforcement gates.

- **C2: Deterministic Derivation Calculus.** A per-feature function $T = f(C, R, \Delta)$ plus a system-level composition extension $T_{composed} = f(C, R, \Delta) + f_{cross}(E_{AB}, \Delta_{cross})$ that map domain concepts $C$, typed relationships $R$, and derivation rules to deterministic test obligations — plus 16 symmetric observability rules that derive production metrics from the same specification documents.

- **C3: Governance Attenuation Theory.** A formal model of why governance fidelity decreases as layers accumulate in multi-agent systems, grounded in Shannon channel capacity [5], Ashby's Law of Requisite Variety [6], and empirical evidence from LLM instruction-following behavior.

- **C4: Meta-Circular Self-Governance.** A structural mechanism where the framework governs itself: Axiom A6 governs governance, Constitution Rule C10 prunes the constitution, and meta-health metrics M-001–M-006 observe the observer — resolving the infinite regress through a bounded strange loop rather than external authority.

We validate these contributions on a production poker team management system comprising 7 features across 3 business pillars (product, operations, finance), demonstrating that DomainSpec derives 445 test obligations and 146 observability metrics from 89 domain concepts with full traceability.

The remainder of this paper is organized as follows. Section 2 surveys related work. Section 3 presents the meta-architecture. Section 4 defines the typed domain ontology. Section 5 formalizes the derivation calculus. Section 6 develops governance attenuation theory. Section 7 describes the self-improving pipeline. Section 8 presents the case study. Section 9 discusses limitations and future work.

---

## 2. Background and Related Work

DomainSpec sits at the intersection of several research traditions: domain-driven design, model-based testing, specification-first development, multi-agent governance, and meta-modeling. We survey each and identify the gap that DomainSpec fills.

### 2.1 Domain-Driven Design

Evans' Domain-Driven Design (DDD) [7] established that software structure should mirror domain structure through ubiquitous language, bounded contexts, entities, value objects, and aggregates. DDD provides the *intuition* that domain semantics should drive implementation, but it remains informal — the vocabulary is advisory, relationships are implicit, and there is no derivation function from domain model to verification obligations. DomainSpec formalizes the DDD intuition into a closed typed ontology with deterministic derivation.

### 2.2 Model-Based Testing

Model-based testing (MBT) [8] generates tests from behavioral models — state machines, labeled transition systems, or UML diagrams. MBT achieves deterministic derivation (from model to test), but the models describe *system behavior*, not *domain semantics*. A state machine captures valid transitions but says nothing about the business rules that guard them, the calculations that produce side effects, or the events that propagate downstream. DomainSpec's derivation operates on domain concepts (rules, calculations, postconditions, workflows), not behavioral abstractions, producing tests that are traceable to business meaning.

### 2.3 Behavior-Driven Development

BDD [9] bridges domain language and tests through Given/When/Then scenarios written in Gherkin. BDD is human-readable but *not formally derivable* — there is no function from domain model to scenario set. The scenarios must be manually authored, and their completeness depends on the author's diligence. DomainSpec generates BDD-style templates deterministically: every rule in `operations.md` produces at least 2 tests (pass + fail), every state transition produces 1 happy-path test and 1 negative test, every interface endpoint × response status produces 1 contract test.

### 2.4 Formal Specification Languages

TLA+ [10], Alloy [11], and Z [12] provide mathematically rigorous specifications with model checking or theorem proving. These achieve the strongest guarantees but are impractical for typical business domains: the learning curve is steep, the specification effort is high, and the gap between formal model and implementation code requires a separate verification step. Recent work combines Alloy with LLMs [13] to lower the barrier, but the fundamental trade-off between rigor and accessibility remains. DomainSpec targets the *middle ground* — formal enough for deterministic derivation, accessible enough for domain experts writing Markdown.

### 2.5 LLM Agents for Software Engineering

SWE-bench [14] established the benchmark for LLM agents resolving GitHub issues. SWE-agent [15] introduced tool-use and retrieval-augmented workflows. More recent systems like Devin [2] and Copilot Workspace [3] provide end-to-end development environments. These systems demonstrate that LLM agents can produce working code, but none address *specification governance* — ensuring that what the agent builds matches what the domain requires. VeriGuard [16] proposes formal verification of LLM-generated code against TLA+ specs, but inherits the accessibility limitations of formal methods. DomainSpec governs agent execution through typed specifications that agents can navigate and derive from.

### 2.6 Multi-Agent Governance

As agent systems scale from single-agent to multi-agent architectures [17], governance becomes a first-class concern. Constitutional AI [18] introduced the idea of using principles to constrain generation, but applies at the single-output level. The Agentic Delivery Lifecycle (ADLC) [19] proposes continuous tuning as the central value driver for agent-assisted development. DomainSpec operationalizes ADLC principles through a concrete layered architecture with formal governance attenuation bounds.

### 2.7 Meta-Modeling Frameworks

The Meta-Object Facility (MOF) [20] defines a four-layer meta-modeling architecture (M0–M3) for standardizing modeling languages. ISO/IEC/IEEE 42010 [21] provides a conceptual framework for architecture descriptions. Zachman [22] organizes enterprise architecture along interrogative dimensions. These frameworks operate at the *modeling language* level — they define how to define models — but do not connect to software derivation or agent governance. The Meta-Track framework [23] introduces a seven-layer hierarchy connecting domain vocabulary to code via annotations and orphan detection. DomainSpec adopts Meta-Track's layering insight and extends it with deterministic derivation (L1→L2), formal governance attenuation theory (L3–L4), and meta-circular self-governance (A6, C10, M-001–M-006).

### 2.8 Research Gap

Table 1 summarizes the landscape. No existing approach combines a typed domain ontology, deterministic derivation to both tests and observability metrics, multi-agent governance with formal attenuation bounds, and meta-circular self-governance — the four properties that DomainSpec unifies under a single layered architecture.

**Table 1.** Comparison of specification and governance approaches.

| Approach | Typed Ontology | Deterministic Derivation | Agent Governance | Self-Governance | Accessibility |
|---|:---:|:---:|:---:|:---:|:---:|
| DDD [7] | Informal | — | — | — | High |
| MBT [8] | Behavioral | Tests only | — | — | Medium |
| BDD [9] | Natural language | — | — | — | High |
| TLA+/Alloy [10,11] | Formal logic | Model checking | — | — | Low |
| SWE-agent [15] | — | — | Implicit | — | High |
| Constitutional AI [18] | — | — | Principles | — | High |
| ADLC [19] | — | — | Lifecycle | — | Medium |
| Meta-Track [23] | Annotations | — | Health metrics | — | Medium |
| **DomainSpec** | **25 types × 29 edges** | **Tests + Metrics** | **Attenuation theory** | **Strange loop** | **High (Markdown)** |

---

## 3. The Meta-Architecture

DomainSpec organizes knowledge, software, and governance into a seven-layer dual-track hierarchy. The *business track* governs what things mean (domain semantics → software → verification). The *operational track* governs how the framework itself runs (orchestration → enforcement → self-improvement). Both tracks share Layers 0–2 and diverge at Layer 3.

### 3.1 Layer Definitions

**Layer 0 — Domain Reality.** The actual business domain as it exists independent of software. This is the territory, not the map. L0 is the ultimate source of truth against which all other layers are validated.

**Layer 1 — Ontology.** A typed vocabulary of 25 meta-types and 29 relationships (Section 4) that captures domain semantics, including cross-feature composition semantics. L1 transforms the informal domain reality into a navigable knowledge graph documented in Markdown files (`SPEC.md`, `domain.md`, `operations.md`, `states.md`, etc.).

**Layer 2 — Software.** Executable artifacts derived from L1: implementation code, test suites, observability instrumentation, and infrastructure configuration. L2 artifacts are *derived*, not authored — they are the output of applying derivation rules (Section 5) to L1 concepts.

**Layer 3B — Governance (Business Track).** The constitution: explicit rules governing how domain concepts may be created, related, and extended. Constitution rules (C1–C11) are collected in `CONSTITUTION.md`, each traceable to an L4 axiom and mapped to an L6 enforcement gate.

**Layer 3O — Governance (Operational Track).** Agent instructions, skill specifications, and pipeline sequencing rules that govern how the framework's agents operate.

**Layer 4B — Epistemic Foundations (Business Track).** Axioms (A1–A6) formalized in `AXIOMS.md` that articulate *why* each governance rule exists. Each axiom is grounded in empirical evidence of harm — the damage observed when the axiom is violated. This follows Taleb's Via Negativa [24]: formalize a rule only when its absence has caused measurable harm.

**Layer 4O — Epistemic Foundations (Operational Track).** The principles underlying agent behavior: economy of action, minimal privilege, observability-by-default.

**Layer 5 — Navigation.** Discovery mechanisms for locating concepts across the knowledge graph: feature indexes, tag indexes, registry files, and structured search patterns.

**Layer 6B — Enforcement (Business Track).** Alignment audits, layering audits, PASS/FLAG/BLOCK verdicts, and CI gates that verify L2 artifacts conform to L1 specifications. Each enforcement gate references the L3 constitution rule it implements.

**Layer 6O — Enforcement (Operational Track).** Signal detection, threshold analysis, and tuning triggers that verify the framework itself operates within expected bounds.

**Layer 7B — Orchestration (Business Track).** The nine-stage pipeline (Section 7) that sequences planning, specification, story generation, test derivation, implementation, verification, and signal emission.

**Layer 7O — Orchestration (Operational Track).** The tuning loop (signals → reflection → improvement) that closes the self-governance cycle.

### 3.2 The Derivation Chain

The architecture's structural power comes from its formal derivation chains. Each chain traces from epistemic foundation to enforcement:

$$L4 \xrightarrow{\text{justifies}} L3 \xrightarrow{\text{implemented by}} L6$$

Concretely, Axiom A1 ("Documentation is the source of truth for domain meaning") justifies Constitution Rule C1 ("Every domain concept must be documented before it is implemented"), which is enforced by Gate G1 (the alignment audit that blocks code without corresponding SPEC entries).

This chain is auditable: given any enforcement gate, one can trace backward to the axiom that justifies its existence. Given any axiom, one can trace forward to every gate that implements it. Table 2 shows the complete chain.

**Table 2.** Derivation chain: Axioms → Constitution → Enforcement.

| Axiom | Statement | Constitution Rules | Enforcement Gates |
|---|---|---|---|
| A1 — Documentation First | "Documentation is the source of truth for domain meaning" | C1 (document before implement), C5 (SPEC before code) | Alignment audit, spec-gap signals |
| A2 — Type Safety | "Every domain concept must declare a meta-type" | C2 (concept table required), C6 (relationship typing) | Registry sync, orphan detection |
| A3 — Deterministic Derivation | "Tests and metrics derive from specs via rules, not judgment" | C3 (test derivation), C7 (observability derivation) | Test-count verification, O-rule compliance |
| A4 — Governance Traceability | "Every rule must trace to a justification and an enforcement" | C4 (constitution format), C8 (gate references) | Derivation chain audit |
| A5 — Empirical Grounding | "Formalize only what absence has proven harmful" | C9 (evidence-of-harm required), C11 (via negativa pruning) | Governance pruning protocol |
| A6 — Meta-Circular Governance | "The governance system governs itself" | C10 (constitution self-amendment), C11 (pruning) | Meta-health metrics M-001–M-006 |

### 3.3 The Dual-Track Architecture

The business and operational tracks share L0–L2 (the domain and its software) but maintain independent governance hierarchies. This separation ensures that *what to build* (business track) and *how to build it* (operational track) are governed by independent authorities that can evolve at different rates.

```
Business Track (B)                   Operational Track (O)
─────────────────                    ────────────────────
L7B: Pipeline stages                 L7O: Tuning loop
L6B: Alignment audits                L6O: Signal detection
L5B: Feature navigation              L5O: Agent context discovery
L4B: Domain axioms (A1–A6)           L4O: Operational principles
L3B: Constitution (C1–C11)           L3O: Agent instructions

         ╲                 ╱
          ╲               ╱
           L2: Software
           L1: Ontology
           L0: Domain Reality
```

The tracks converge at three points: (1) L1, where the ontology defines vocabulary for both tracks; (2) L2, where derived software serves both domain behavior and framework operation; and (3) the feedback loop, where operational signals (L6O) trigger business-track re-derivation (L7B → L1 → L2).

### 3.4 Meta-Circular Self-Governance

The deepest structural property of the architecture is its meta-circularity. The framework governs itself through the same mechanisms it uses to govern software:

- **Axiom A6** ("The governance system governs itself") creates a self-referential foundation — the axiom layer includes an axiom about its own governance.
- **Constitution Rule C10** permits the constitution to amend itself when evidence warrants, subject to the same Via Negativa principle (C11) that governs all rule creation.
- **Meta-health metrics M-001–M-006** observe the observer: Orphan Rate (M-001) measures whether the ontology-to-code binding is complete, Friction Rate (M-002) measures whether enforcement is active, Overhead Ratio (M-006) measures whether governance cost is proportionate to domain work.

This creates a Hofstadterian strange loop [4]: the system that observes software behavior is itself observed by the same system's meta-health layer. The loop is bounded (it does not recurse infinitely) because M-001–M-006 are *defined metrics with fixed computation*, not open-ended self-reflection. The observer observes itself through a finite, deterministic lens.

This structure resolves the infinite regress problem: rather than requiring an external authority to govern the governance, DomainSpec's governance is self-terminating through bounded self-reference.

---

## 4. Typed Domain Ontology (L1)

### 4.1 Meta-Types

DomainSpec defines a closed vocabulary of 25 meta-types organized into three categories: 14 backend types, 11 UI types. Every domain concept documented in a feature specification must declare exactly one meta-type.

**Definition 1** (Meta-Type System). Let $\mathcal{M} = \mathcal{M}_B \cup \mathcal{M}_U$ be the set of meta-types, where:

$$\mathcal{M}_B = \{\text{Entity}, \text{ValueObject}, \text{Enum}, \text{Operation}, \text{Query}, \text{Calculation},$$
$$\text{Rule}, \text{Policy}, \text{Workflow}, \text{Saga}, \text{Interface}, \text{Event}, \text{Mapping}, \text{StateMachine}\}$$

$$\mathcal{M}_U = \{\text{Page}, \text{Layout}, \text{Component}, \text{ViewModel}, \text{Hook},$$
$$\text{Form}, \text{Action}, \text{Guard}, \text{Binding}, \text{Adapter}, \text{StateIndicator}\}$$

The backend types organize into four functional groups:

- **Structural** (what things are): Entity, Value Object, Enum
- **Behavioral** (what happens): Operation, Query, Calculation, Workflow, Saga
- **Governing** (what constrains): Rule, Policy
- **Connective** (what connects): Interface, Event, Mapping, State Machine

The UI types mirror this organization:

- **Structural**: Page, Layout, Component
- **Behavioral**: View Model, Hook, Form, Action
- **Governing**: Guard
- **Connective**: Binding, Adapter, State Indicator

### 4.2 Typed Relationships

**Definition 2** (Relationship System). Let $\mathcal{R} = \mathcal{R}_B \cup \mathcal{R}_{CF} \cup \mathcal{R}_U \cup \mathcal{R}_X$ be the set of typed relationships:

$$\mathcal{R}_B = \{\text{performs}, \text{produces}, \text{enforces}, \text{calculates}, \text{transitions},$$
$$\text{exposes}, \text{orchestrates}, \text{applies}, \text{maps}, \text{contains}, \text{queries}, \text{emits}\}$$

$$\mathcal{R}_{CF} = \{\text{produces-for}, \text{triggers-cross}, \text{enforces-cross}\}$$

$$\mathcal{R}_U = \{\text{renders}, \text{wraps}, \text{composes}, \text{consumes}, \text{submits}, \text{shapes}, \text{protects}, \text{displays}\}$$

$$\mathcal{R}_X = \{\text{fetches}, \text{mutates}, \text{reflects}, \text{derives}, \text{contracts}, \text{mirrors}\}$$

where $\mathcal{R}_B$ contains 12 intra-feature backend edges, $\mathcal{R}_{CF}$ contains 3 cross-feature backend edges, $\mathcal{R}_U$ contains 8 intra-UI edges, and $\mathcal{R}_X$ contains 6 cross-layer edges connecting UI concepts to backend concepts.

Each relationship has a typed signature constraining its source and target:

**Table 3.** Relationship type signatures (backend edges).

| Edge | Source Type | Target Type | Semantics |
|---|---|---|---|
| `performs` | Entity | Operation | Actor initiates action |
| `produces` | Operation | Event | Action emits signal |
| `enforces` | Rule | Operation | Constraint gates action |
| `calculates` | Calculation | Operation | Derived value feeds action |
| `transitions` | Event | StateMachine | Signal triggers state change |
| `exposes` | Interface | Operation ∨ Query | Boundary makes logic accessible |
| `orchestrates` | Workflow | Operation[] | Process coordinates actions |
| `applies` | Policy | Operation | Strategy governs behavior |
| `maps` | Mapping | Entity ∨ Interface | Shape transformation across boundary |
| `contains` | Entity | ValueObject | Composition |
| `queries` | Query | Entity | Read dependency |
| `emits` | Entity | Event | Source of domain signal |

**Table 3b.** Relationship type signatures (cross-feature backend edges).

| Edge | Source Type | Target Type | Semantics |
|---|---|---|---|
| `produces-for` | Operation@A | Entity@B | Operation in A mutates or projects state into B-owned entity |
| `triggers-cross` | Event@A | Operation@B | Event in A triggers operation execution in B |
| `enforces-cross` | Rule@A | Operation@B | Rule in A constrains operation in B |

**Table 4.** Relationship type signatures (cross-layer edges).

| Edge | Source Type | Target Type | Semantics |
|---|---|---|---|
| `fetches` | Binding | Query | UI reads from backend |
| `mutates` | Binding | Operation | UI writes to backend |
| `reflects` | StateIndicator | StateMachine | UI mirrors domain lifecycle |
| `derives` | ViewModel | Entity | UI data shaped from domain |
| `contracts` | Form | Interface | UI schema aligns with API |
| `mirrors` | Guard | Rule | Client replicates server constraint |

### 4.3 Formal Properties

The ontology satisfies three structural properties:

**Property 1** (Type Safety). Every relationship instance respects its type signature. If $r \in \mathcal{R}$ has signature $\sigma(r) = (S, T)$, then for every instance $(a, r, b)$ in the concept graph, $\text{type}(a) \in S$ and $\text{type}(b) \in T$.

**Property 2** (Partition). $\mathcal{M}_B \cap \mathcal{M}_U = \emptyset$. Backend and UI meta-types are disjoint. Every concept belongs to exactly one partition.

**Property 3** (Cross-Layer Bridging). Every edge in $\mathcal{R}_X$ has source type in $\mathcal{M}_U$ and target type in $\mathcal{M}_B$. Cross-layer relationships are unidirectional: UI depends on backend, never the reverse.

**Property 4** (Cross-Feature Boundary Discipline). Every edge in $\mathcal{R}_{CF}$ crosses ownership boundaries. If $(u, v)$ has label in $\mathcal{R}_{CF}$, then $u$ and $v$ belong to distinct feature or bounded-context owners.

These properties ensure that the concept graph is well-formed: no relationship can connect incompatible concept types, cross-feature edges are explicit, and the dependency direction between frontend and backend is structurally enforced.

### 4.4 The Concept Graph

**Definition 3** (Concept Graph). A DomainSpec feature specification defines a labeled directed graph $G = (V, E, \tau, \lambda)$ where:
- $V$ is the set of domain concepts
- $E \subseteq V \times V$ is the set of directed edges
- $\tau: V \rightarrow \mathcal{M}$ assigns a meta-type to each concept
- $\lambda: E \rightarrow \mathcal{R}$ assigns a relationship type to each edge

subject to the type safety constraint: $\forall (u, v) \in E$, if $\lambda(u,v) = r$ and $\sigma(r) = (S, T)$, then $\tau(u) \in S \land \tau(v) \in T$.

The concept graph provides full-stack navigability. From any concept, one can follow typed edges to discover what it affects and what affects it. For example, tracing a user action end-to-end:

$$\text{Page} \xrightarrow{\text{renders}} \text{Form} \xrightarrow{\text{submits}} \text{Hook} \xrightarrow{\text{mutates}} \text{Operation} \xrightarrow{\text{enforces}^{-1}} \text{Rule}$$
$$\text{Operation} \xrightarrow{\text{produces}} \text{Event} \xrightarrow{\text{transitions}} \text{StateMachine}$$

This trace is fully typed: each step constrains what concept types can appear next, making the graph navigable by both humans and LLM agents.

---

## 5. Deterministic Derivation Calculus (L1 → L2)

The central claim of DomainSpec is that verification obligations — test cases and observability metrics — can be *deterministically derived* from the typed domain ontology. This section formalizes the derivation.

### 5.1 The Derivation Function

**Definition 4** (Per-Feature Derivation Function). Let $G = (V, E, \tau, \lambda)$ be a concept graph (Definition 3). The per-feature derivation function is:

$$T = f(G, \Delta) = \bigcup_{i=1}^{|\Delta|} \delta_i(G)$$

where $\Delta = \{\delta_1, \ldots, \delta_{|\Delta|}\}$ is the set of derivation rules, each mapping a concept graph to a set of test obligations.

The derivation is deterministic: given the same concept graph $G$ and the same rule set $\Delta$, the function produces the identical set of test obligations $T$ on every invocation. This eliminates the stochastic gap — LLM agents execute derivation *rules*, not stochastic generation.

**Definition 5** (Composed Derivation Function). For a system composed of feature graphs $\{G_1, \ldots, G_n\}$ and cross-feature edge set $E_{AB}$:

$$T_{composed} = \sum_{k=1}^{n} f(G_k, \Delta) + f_{cross}(E_{AB}, \Delta_{cross})$$

where $\Delta_{cross} = \{\delta_{produces\text{-}for}, \delta_{triggers\text{-}cross}, \delta_{enforces\text{-}cross}\}$.

The composed function preserves determinism while making cross-feature integration obligations explicit and derivable.

### 5.2 Test Derivation Rules

DomainSpec defines 14 backend test derivation rules and 6 UI test derivation rules for per-feature graphs. For composed systems, 3 additional cross-feature derivation rules are applied through $f_{cross}$. Each rule specifies its source (which documentation section), its trigger (which concept types), and its output (which test types with what cardinality).

**Table 5.** Backend test derivation rules.

| Rule | Source | Trigger | Output | Cardinality |
|---|---|---|---|---|
| $\delta_1$ | states.md | Transition table row | Happy-path transition test | 1 per row |
| $\delta_2$ | states.md | Invalid transition entry | Negative transition test | 1 per invalid combo |
| $\delta_3$ | states.md | Invariant row | Property-based invariant test | 1 per invariant |
| $\delta_4$ | operations.md | Rule (R1, R2, ...) | Rule validation tests | ≥ 2 per rule (pass + fail) |
| $\delta_5$ | operations.md | Calculation (C1, C2, ...) | Calculation correctness test | ≥ 1 per calculation |
| $\delta_6$ | operations.md | Postcondition bullet | Postcondition assertion | 1 per postcondition |
| $\delta_7$ | operations.md | Error state row | Error state test | 1 per error state |
| $\delta_8$ | interfaces.md | Endpoint × status code | Contract test | 1 per combination |
| $\delta_9$ | interfaces.md | Field mapping entry | Mapping verification | 1 per mapping |
| $\delta_{10}$ | events.md | Event | Producer emission test | 1 per event |
| $\delta_{11}$ | events.md | Event × consumer | Consumer handling test | 1 per consumer |
| $\delta_{12}$ | queries.md | Query | Output shape + filter + auth tests | ≥ 3 per query |
| $\delta_{13}$ | workflows.md | Workflow step | Happy-path + compensation test | 2 per step |
| $\delta_{14}$ | mappings.md | Field mapping row | Transformation test | 1 per row |

**Table 6.** UI test derivation rules.

| Rule | Source | Trigger | Output | Cardinality |
|---|---|---|---|---|
| $\delta_{15}$ | UI-SPEC.md | Route declaration | Page navigation test | 1 per route |
| $\delta_{16}$ | STORIES.md + UI-SPEC | User story with UI steps | End-to-end journey test | 1 per story |
| $\delta_{17}$ | UI-SPEC.md + operations.md | Form × validation rule | Client-side validation test | 1 per rule × form |
| $\delta_{18}$ | UI-SPEC.md | Declared UI state | State reflection test | 1 per state |
| $\delta_{19}$ | UI-ARCHITECTURE.md | Page × breakpoint | Responsive layout test | 1 per page × breakpoint |
| $\delta_{20}$ | All pages | Interactive component | Accessibility test | 1 per page |

### 5.3 Derivation Cardinality

The test obligation count for a feature is deterministic and computable:

$$|T| = \sum_{i=1}^{20} |\delta_i(G)|$$

For a feature with $n_s$ state transitions, $n_r$ rules, $n_c$ calculations, $n_p$ postconditions, $n_e$ events, $n_q$ queries, $n_{ep}$ endpoint-status combinations, and $n_m$ mappings:

$$|T| \geq n_s + n_{inv} + 2n_r + n_c + n_p + n_{err} + n_{ep} + n_m + n_e + n_{ec} + 3n_q + 2n_{ws}$$

where the inequality accounts for rules that produce more than the minimum test count.

### 5.4 Observability Derivation (Symmetric Outer Loop)

A key architectural insight is that the *same* specification documents that derive tests also derive production observability metrics. DomainSpec defines 16 observability derivation rules (O-rules) that operate on the concept graph in parallel with the test rules, producing OpenTelemetry metric obligations.

**Table 7.** Observability derivation rules.

| Rule | Source | Metric Type | Alert Severity |
|---|---|---|---|
| O1 | Transition row | Counter: `state.transition` | P0 for invalid transitions |
| O2 | State machine | UpDownCounter: `state.population` | State accumulation |
| O3 | Invariant | Gauge: `invariant.violation` | P0: any > 0 |
| O4 | Operation | 4 metrics: invocation, success, failure, duration | P1: SLO breach |
| O5 | Rule | Counter: `rule.violation` | Pattern monitoring |
| O6 | Calculation | Histogram: `calculation.drift` | P0: drift > 1% |
| O7 | Postcondition | Counter: `postcondition.check` | P1: any violated |
| O8 | Endpoint | HTTP RED metrics (OTel semconv) | P1: SLO breach |
| O9 | Idempotency rule | Gauge: `idempotency.violation` | P0: any > 0 |
| O10 | Event | Counter: emit/consume + Histogram: lag | P1: event loss |
| O11 | Query | Histogram: duration + result size | P3: trend degradation |
| O12 | Workflow | Counter: invocation + Histogram: duration | P1: failure rate |
| O13 | Capability | Business KPI | P2: trend degradation |
| O14 | User journey | Funnel: step conversion | P2: drop-off spike |
| O15 | Financial operation | Gauge: reconciliation mismatch | P0: any > 0 |
| O16 | Settlement operation | Counter: cycle metrics + drift | P0: drift > 0 |

The total observability obligation count is similarly deterministic:

$$|O| = \sum_{j=1}^{16} |o_j(G)|$$

Together, tests and metrics form a **symmetric verification pair**: tests validate at build time (inner loop), metrics validate at runtime (outer loop), both derived from the same specification, both traceable to the same domain concepts. This symmetry ensures that no domain behavior is tested but unmonitored, or monitored but untested.

### 5.5 Three-Layer Metric Architecture

The derived metrics organize into three layers, each answering a different question:

**Domain Fidelity** (O1–O3, O5–O7, O9, O15–O16): Does production behavior match the specification? Any violation is a P0 — the system is doing something the domain model says it should not.

**Operational Health** (O4, O8, O10–O12): Is the system reliable and performant? Violations are P1 — the system is correct but degraded.

**Business Effectiveness** (O13–O14): Is the feature achieving its goal? Violations are P2 — the system works but the business outcome is wrong.

This layering ensures that alerts are actionable: a P0 always means the domain model is violated, not just that latency is high.

---

## 6. Governance Attenuation Theory (L3–L4)

### 6.1 The Problem

DomainSpec's dual-track architecture operates as a seven-layer recursive reinforcement system. Each layer governs the layer below it, and the tuning loop creates a cross-cutting feedback mechanism. A fundamental tension emerges: **as governance layers accumulate, each individual layer's enforcement fidelity decreases**.

We call this *governance attenuation* — the systematic loss of per-rule compliance as the total number of rules grows. This is not a bug in any particular implementation; it is a structural property of bounded-capacity enforcement channels.

### 6.2 Three Root Causes

**Cause 1: Context Exhaustion (The Epilogue Problem).** In LLM-based agent systems, governance observations (signal emission, compliance checks) are typically the *last* step in a multi-step pipeline. By the time an agent reaches step 10 of a 10-step process, its effective attention over early-session events has degraded. This maps to the serial position effect [25]: items in the middle of a long context are recalled worst. Governance violations from step 3 are forgotten by step 10.

**Cause 2: Observer-Executor Conflation.** The same agent that performs the work is asked to observe itself performing the work. This violates the Conant-Ashby Good Regulator Theorem [26]: *every good regulator of a system must be a model of that system*. The executor *is* the system — it cannot simultaneously be its own model with high fidelity. Asking a controller to be its own oscilloscope produces partial observations at best.

**Cause 3: Instruction Dilution (Channel Saturation).** Agents receive instructions from multiple sources simultaneously: agent definitions, skill specifications, framework instructions, and governance epilogues. Each source competes for attention in a fixed-capacity channel.

### 6.3 The Channel Capacity Model

We model governance fidelity using Shannon's channel capacity theorem [5]:

$$C = B \cdot \log_2\left(1 + \frac{S}{N}\right)$$

where:
- $C$ = effective governance capacity (rules reliably followed per session)
- $B$ = bandwidth (context window attention available for instructions)
- $S$ = signal strength (clarity and specificity of each rule)
- $N$ = noise (competing instructions, ambiguity, context length)

Adding governance layers increases $N$ (more competing instructions) faster than it increases $S$ (clarity of any single instruction). The result is a *decreasing* signal-to-noise ratio and thus decreasing effective capacity per rule.

**Corollary 1.** There exists a critical governance layer count $k^*$ beyond which adding layer $k^* + 1$ reduces the total effective governance capacity:

$$\frac{\partial C}{\partial k} < 0 \quad \text{for } k > k^*$$

### 6.4 Theoretical Bounds

Three theoretical results suggest that $k^* \approx 6$–$7$ for bounded-capacity systems:

**Miller's Law** [27]. The number of objects a bounded-capacity information processor can maintain simultaneously is $7 \pm 2$. LLMs exhibit analogous capacity limits in instruction-following tasks.

**Ashby's Requisite Variety** [6]. A controller must have at least as much variety as the system it controls. For a system with 25 concept types and 29 edge types: $\log_2(54) \approx 5.75$ governance dimensions are theoretically sufficient. At 7, returns are diminishing.

**Gödel's Incompleteness** (informal application). No sufficiently complex formal system can prove all true statements about itself. The meta-system cannot fully observe itself — there will always be governance gaps that the system is structurally incapable of detecting from within.

### 6.5 Empirical Evidence

DomainSpec's signal system provides empirical evidence of governance attenuation. Across 23 signals from ~10 pipeline sessions (40+ commits), the signal emission rate is approximately 30–40% of expected. Governance observations — the very signals designed to detect problems — are being systematically dropped.

The highest-value signal type (`governance-gap`) is also the most underreported, precisely because detecting what you failed to detect requires the self-modeling capacity that Conant-Ashby proves insufficient.

### 6.6 Structural Interventions

The winning strategy is not *more rules enforced by instruction* but *fewer, sharper rules enforced structurally*. DomainSpec proposes three structural interventions:

**Intervention 1: Observer-Executor Separation (Dual-Agent Protocol).** Instead of asking one agent to both execute and observe, dispatch a lightweight shadow agent after each pipeline session. The executor produces artifacts; the observer reads the session's output and produces only signals. This mirrors Constitutional AI's [18] approach where one model generates and another evaluates.

This eliminates causes 1 (context exhaustion — the observer has full attention budget) and 2 (conflation — the observer has a single responsibility).

**Intervention 2: Deterministic Signal Detection.** The largest signal types — `alignment-gap`, `spec-gap`, `governance-gap` — can be partially *computed* rather than relying on LLM self-report. Deterministic detectors shift detection from L7 (unreliable LLM observation) to L6 (deterministic enforcement):

| Signal | Computable Proxy |
|---|---|
| `alignment-gap` | Diff SPEC concept rows vs. export symbols in domain code |
| `spec-gap` | Count `TODO`/`FIXME` comments in generated code |
| `governance-gap` | Check git diff scope matches expected feature directory |
| `rework` | Count files modified more than once per session |

**Intervention 3: Via Negativa Governance Pruning.** Track which governance rules have actually caught violations via the `shouldHaveBeenCaughtBy` field. Any rule with zero references after $N$ pipeline runs is consuming channel capacity without proving value and is a candidate for removal. This implements Taleb's Via Negativa [24]: subtract rules that haven't demonstrated necessity.

### 6.7 Viable System Model Mapping

DomainSpec's architecture maps onto Stafford Beer's Viable System Model (VSM) [28] — five necessary and sufficient systems for organizational viability:

**Table 8.** DomainSpec mapped to Beer's Viable System Model.

| Beer's System | Function | DomainSpec Equivalent | Status |
|---|---|---|---|
| System 1 — Operations | Do the work | L2 (code) + L7 agents executing | Working |
| System 2 — Coordination | Prevent oscillation | Pipeline sequencing, skill dependencies | Working |
| System 3 — Control | Resource allocation, audit | Alignment audits, PASS/FLAG/BLOCK | Partially working |
| System 4 — Intelligence | Adaptation | Signal accumulation + reflect skill | Under-performing |
| System 5 — Policy | Identity, purpose | AXIOMS.md (A1–A6), CONSTITUTION.md | Formal |

Beer proved exactly five systems are needed — no more, no fewer. DomainSpec's seven layers map onto Beer's five when redundant layers are collapsed. The insight: the fix is not more layers, but making System 3 continuous (shift enforcement left) and formalizing System 5 (axioms).

---

## 7. Self-Improving Pipeline (L6–L7)

### 7.1 The Nine-Stage Pipeline

DomainSpec's delivery pipeline sequences nine stages, each producing traceable artifacts:

1. **Plan** — Clarify objectives, constraints, acceptance criteria
2. **Spec** — Create or evolve feature specification (SPEC.md, domain.md, operations.md, states.md, interfaces.md, events.md)
3. **Stories** — Generate user stories (STORIES.md) with classic + BDD format
4. **Tests** — Derive test specifications by applying $\Delta$ to the concept graph
5. **Implement** — Generate code satisfying derived test specifications
6. **Verify** — Run alignment audit, layering audit, PASS/FLAG/BLOCK verdict
7. **UI** (optional) — Derive UI-SPEC.md, implement frontend, visual audit
8. **Observability** — Derive metric obligations, instrument code
9. **Signals** — Emit structured observations about the pipeline run itself

Each stage is executed by one or more specialized agents (14 total) coordinated by skills (25 total). Agents operate on the artifacts produced by previous stages, never on raw user intent — ensuring that domain semantics flow through the typed ontology at every step.

### 7.2 The Signal System

Stage 9 emits structured signals to an append-only JSONL file. Each signal has a typed envelope:

```json
{
  "type": "alignment-gap | spec-gap | governance-gap | rework | overhead | decision | proposal | pattern | spec-compliance | agent-cost",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "category": "economy | governance | pattern | quality",
  "data": { /* type-specific payload */ }
}
```

DomainSpec defines 11 signal types across 4 categories:

- **Economy** (3 types): `step-verdict`, `rework`, `overhead` — track pipeline efficiency
- **Quality** (2 types): `alignment-gap`, `spec-gap` — track specification fidelity
- **Governance** (3 types): `governance-gap`, `proposal`, `spec-compliance` — track framework blind spots
- **Pattern** (2 types): `decision`, `pattern` — capture reusable insights
- **Operations** (1 type): `agent-cost` — track resource consumption

### 7.3 Threshold-Based Tuning

Accumulated signals are analyzed against 10 threshold conditions. When a threshold is met, the system triggers a tuning action:

**Table 9.** Tuning thresholds.

| ID | Condition | Min Signals | Action |
|---|---|---|---|
| TH1 | Same `shouldHaveBeenCaughtBy` target in 3+ gaps | 3 | Auto-propose skill update |
| TH2 | Overhead ratio > 0.5 for 3 consecutive runs | 3 | Review governance overhead |
| TH3 | Same spec gap pattern in 2+ features | 2 | Propose template improvement |
| TH4 | Rework on same step in 5+ signals | 5 | Harden skill |
| TH5 | 3+ proposals targeting same file | 3 | Bundle into single change |
| TH6 | Alignment gaps > 10 across last 5 sessions | 10 | Full alignment audit |
| TH7 | Critical governance gap | 1 | Immediate issue |
| TH8 | Low-confidence decisions in 3+ signals | 3 | Flag domain ambiguity |
| TH9 | Same agent violates spec in 2+ signals | 2 | Harden agent spec |
| TH10 | Premium requests > 50 in rolling 7 days | 50 | Cost threshold alert |

### 7.4 The Closed Loop

The tuning loop closes the architecture into a self-regulating cycle:

$$\text{Pipeline} \xrightarrow{\text{emit}} \text{Signals} \xrightarrow{\text{analyze}} \text{Thresholds} \xrightarrow{\text{reflect}} \text{Proposals} \xrightarrow{\text{apply}} \text{Skills/Agents} \xrightarrow{\text{improve}} \text{Pipeline}$$

This is DomainSpec's implementation of Beer's System 4 (Intelligence): the framework adapts to its environment not through external instruction but through accumulated evidence of its own performance. The meta-health metrics (M-001–M-006) provide the System 5 (Policy) check — ensuring that the tuning loop itself operates within acceptable bounds.

---

## 8. Case Study

### 8.1 System Under Study

We evaluate DomainSpec on a production poker team management system: a multi-feature application managing player recruitment, performance tracking, financial settlements, and coaching operations. The system comprises 7 features across 3 business pillars.

### 8.2 Quantitative Results

**Table 10.** DomainSpec metrics across 7 production features.

| Feature | Pillar | Concepts | Tests Derived | OTel Metrics | Stories | UI-SPEC |
|---|---|---|---|---|---|---|
| auth-access-control | platform | 12 | 58 | 20 | 6 | ✓ |
| candidate-review | operations | 11 | 54 | 18 | 5 | ✓ |
| coach-management | operations | 9 | 47 | 16 | 4 | ✓ |
| financial-settlement | finance | 18 | 92 | 30 | 8 | ✓ |
| player-management | product | 14 | 72 | 24 | 7 | ✓ |
| player-performance | product | 15 | 78 | 26 | 7 | ✓ |
| progression-system | product | 10 | 44 | 12 | 4 | ✓ |
| **Total** | **3 pillars** | **89** | **445** | **146** | **41** | **7/7** |

Key metrics:
- **Test-to-concept ratio:** 5.0 (each domain concept produces on average 5 test obligations)
- **Metric-to-concept ratio:** 1.64 (each domain concept produces on average 1.64 observability metrics)
- **Story coverage:** 41 user stories across 7 features (5.9 per feature)
- **UI-SPEC coverage:** 100% (all 7 features have UI design contracts)

### 8.3 Test Obligation Breakdown

**Table 11.** Test obligations by derivation rule category.

| Category | Rule(s) | Total Tests | % of Total |
|---|---|---|---|
| State transitions (happy + negative) | $\delta_1$, $\delta_2$ | 68 | 15.3% |
| Invariant / property-based | $\delta_3$ | 22 | 4.9% |
| Rule validation (pass + fail) | $\delta_4$ | 94 | 21.1% |
| Calculation correctness | $\delta_5$ | 28 | 6.3% |
| Postcondition assertions | $\delta_6$ | 36 | 8.1% |
| Error states | $\delta_7$ | 32 | 7.2% |
| Contract tests | $\delta_8$ | 48 | 10.8% |
| Event producer/consumer | $\delta_{10}$, $\delta_{11}$ | 34 | 7.6% |
| Query tests | $\delta_{12}$ | 28 | 6.3% |
| UI journey + navigation | $\delta_{15}$, $\delta_{16}$ | 32 | 7.2% |
| UI form validation + states | $\delta_{17}$, $\delta_{18}$ | 23 | 5.2% |

The distribution shows that rule validation tests ($\delta_4$) are the largest category (21.1%), consistent with the domain being rule-heavy (poker team management involves many eligibility checks, financial constraints, and access controls).

### 8.4 Alignment Verdicts

Alignment audits across the 7 features produced the following verdicts:

| Verdict | Count | Description |
|---|---|---|
| PASS | 1 | Full alignment between spec and implementation |
| FLAG | 4 | Minor drift detected, non-blocking |
| BLOCK | 1 | Significant drift requiring remediation |
| PARTIAL | 1 | Feature partially implemented |

The FLAG verdicts typically indicate concepts documented in the specification but not yet implemented (spec-ahead-of-code), which is expected in an iterative development process. The BLOCK verdict indicated a case where implementation diverged from the documented state machine transitions — caught by the alignment audit before reaching production.

### 8.5 End-to-End Traceability Example

To illustrate full-stack traceability, we trace the `GenerateSettlement` operation from the `financial-settlement` feature:

```
Axiom A3 (Deterministic Derivation)
  → Constitution C3 (test derivation from specs)
    → operations.md documents:
      - Operation: GenerateSettlement
      - Rules: R1-R5 (eligibility, idempotency, period bounds)
      - Calculations: C1-C4 (profit, debt, makeup, payout)
      - Postconditions: settlement event created, balances updated
    → TEST-PIPELINE derives:
      - 10 rule validation tests (R1-R5 × pass/fail)
      - 4 calculation correctness tests (C1-C4)
      - 3 postcondition assertions
      - 2 idempotency tests
      - 4 contract tests (POST /settlements × 4 statuses)
    → OBSERVABILITY derives:
      - O4: 4 operation metrics (invocation, success, fail, duration)
      - O5: 5 rule violation counters (R1-R5)
      - O6: 4 calculation drift gauges (C1-C4)
      - O9: 2 idempotency violation gauges
      - O15: reconciliation mismatch gauge
      - O16: settlement cycle metrics (6 instruments)
```

Total for one operation: 23 test obligations + 22 observability metrics, all deterministically derived from the specification, all traceable back to Axiom A3.

---

## 9. Discussion and Conclusion

### 9.1 Vocabulary Completeness

The strongest claim of this paper — that the extended 25 meta-types and 29 relationships are *sufficient* to capture business domain semantics including cross-feature composition — is also the most vulnerable. Our evidence is empirical: the vocabulary covers all concepts encountered across 7 features in 3 business pillars plus E9 cross-feature composition runs. We do not claim universal sufficiency. Different domains (embedded systems, scientific computing, real-time control) may require additional meta-types.

However, the architecture is designed for extension: adding a meta-type requires specifying its derivation rules and relationship signatures, after which the derivation calculus incorporates it automatically. The question is not whether the vocabulary is complete, but whether the *mechanism* for extending it preserves the formal properties (type safety, deterministic derivation, governance traceability).

### 9.2 Cross-Feature Composition

E9 established that per-feature coverage alone is insufficient at system composition boundaries. Under the original ontology, 74.5% of cross-context edges were strained or broken in the rerun dataset (94 edges across 6 domains). Incorporating three cross-feature edges (`produces-for`, `triggers-cross`, `enforces-cross`) and one additional meta-type (`Saga`) resolved this gap to 100% modeled coverage with no extra edge types required in the studied domains.

The composition algebra is now treated as an incorporated extension to the base derivation model:

$$G_{A \oplus B} = (V_A \cup V_B, E_A \cup E_B \cup E_{AB}, \tau_A \cup \tau_B, \lambda_A \cup \lambda_B \cup \lambda_{AB})$$

where $E_{AB}$ and $\lambda_{AB}$ are typed cross-feature edges. The corresponding derivation extension is:

$$T_{composed} = f(C, R, \Delta) + f_{cross}(E_{AB}, \Delta_{cross})$$

with $\Delta_{cross} = \{\delta_{produces\text{-}for}, \delta_{triggers\text{-}cross}, \delta_{enforces\text{-}cross}\}$. This extension qualifies C2: deterministic derivation remains complete within feature boundaries under $f$, and complete at system level under $f + f_{cross}$.

### 9.3 Formal Semantics

The meta-types currently have *informal* semantics (natural-language descriptions). A formal denotational semantics — mapping each meta-type to a mathematical object (Entity → labeled transition system, Rule → predicate, Calculation → pure function) — would strengthen the derivation calculus and enable automated verification of derivation rule correctness.

### 9.4 Controlled Experiments

Our case study demonstrates feasibility on a production system, but controlled experiments are needed to evaluate: (a) derivation accuracy compared to manually-authored test suites, (b) governance attenuation across different agent architectures, (c) vocabulary sufficiency across diverse business domains, and (d) developer productivity with and without DomainSpec.

### 9.5 Threats to Validity

**Internal validity.** The case study system was developed by the framework author, potentially biasing the vocabulary toward concepts already present. Independent replication on systems built by other teams would strengthen the findings.

**External validity.** Seven features in one domain (team management) may not generalize. The business pillars (product, operations, finance) provide some diversity, but different industries may require different meta-type distributions.

E9 external-domain composition evidence draws heavily from DDD literature and reference architectures; broader industrial replication remains necessary for non-DDD-heavy ecosystems.

**Construct validity.** Test obligation counts measure *derivation output*, not *test effectiveness*. A derived test that never catches a bug is less valuable than the count suggests. Mutation testing could validate that derived tests have meaningful fault-detection capability.

For E9 rerun specifically, deterministic edge-type-to-status mapping improved reproducibility but introduces definitional circularity risk in gap-rate interpretation; this is mitigated by convergence with run-1 and the original run-2 analysis.

### 9.6 Conclusion

DomainSpec demonstrates that the gap between domain knowledge and verified software can be bridged through structure rather than stochastic generation. A typed domain ontology (25 meta-types, 29 relationships) enables a deterministic derivation calculus that produces 445 test obligations and 146 observability metrics from 89 domain concepts, with composed-system derivation extended through explicit cross-feature edges. Governance attenuation — the systematic loss of enforcement fidelity as rules accumulate — is bounded by channel capacity and addressed through structural interventions rather than additional layers. Meta-circular self-governance resolves the infinite regress through bounded self-reference.

The framework is open-source, production-validated, and available as a replication package. We believe that the transition from stochastic to deterministic agent governance is both necessary and achievable — and that the path runs through typed domain ontologies.

---

## References

[1] C. E. Jimenez et al., "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" *arXiv:2310.06770*, 2023.

[2] Cognition, "Devin: The First AI Software Engineer," 2024.

[3] GitHub, "GitHub Copilot Workspace: Technical Preview," 2024.

[4] D. Hofstadter, *Gödel, Escher, Bach: An Eternal Golden Braid*. Basic Books, 1979.

[5] C. E. Shannon, "A Mathematical Theory of Communication," *Bell System Technical Journal*, vol. 27, no. 3, pp. 379–423, 1948.

[6] W. R. Ashby, *An Introduction to Cybernetics*. Chapman & Hall, 1956.

[7] E. Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley, 2003.

[8] M. Utting and B. Legeard, *Practical Model-Based Testing: A Tools Approach*. Morgan Kaufmann, 2007.

[9] D. North, "Introducing BDD," *Better Software*, 2006.

[10] L. Lamport, *Specifying Systems: The TLA+ Language and Tools for Hardware and Software Engineers*. Addison-Wesley, 2002.

[11] D. Jackson, *Software Abstractions: Logic, Language, and Analysis*. MIT Press, 2012.

[12] J. M. Spivey, *The Z Notation: A Reference Manual*. Prentice Hall, 1992.

[13] B. Cunha et al., "Combining Alloy and LLMs for Formal Specification Assistance," *arXiv:2501.xxxxx*, 2025.

[14] C. E. Jimenez et al., "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" *arXiv:2310.06770*, 2023.

[15] J. Yang et al., "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering," *arXiv:2405.15793*, 2024.

[16] M. Miculicich et al., "VeriGuard: Formal Verification of LLM-Generated Code," *arXiv:2502.xxxxx*, 2025.

[17] N. Shazeer et al., "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer," *arXiv:1701.06538*, 2017.

[18] Y. Bai et al., "Constitutional AI: Harmlessness from AI Feedback," *arXiv:2212.08073*, 2022.

[19] C. West, "The Agentic Manifesto: Engineering in the Era of Autonomy," 2025.

[20] Object Management Group, "Meta Object Facility (MOF) Core Specification," Version 2.5.1, 2019.

[21] ISO/IEC/IEEE, "42010:2011 Systems and Software Engineering — Architecture Description," 2011.

[22] J. A. Zachman, "A Framework for Information Systems Architecture," *IBM Systems Journal*, vol. 26, no. 3, pp. 276–292, 1987.

[23] V. Boscaro, "Domain-Code-Mapping," GitHub, 2026.

[24] N. N. Taleb, *Antifragile: Things That Gain from Disorder*. Random House, 2012.

[25] B. B. Murdock, "The Serial Position Effect of Free Recall," *Journal of Experimental Psychology*, vol. 64, no. 5, pp. 482–488, 1962.

[26] R. Conant and W. R. Ashby, "Every Good Regulator of a System Must Be a Model of That System," *International Journal of Systems Science*, vol. 1, no. 2, pp. 89–97, 1970.

[27] G. A. Miller, "The Magical Number Seven, Plus or Minus Two," *Psychological Review*, vol. 63, no. 2, pp. 81–97, 1956.

[28] S. Beer, *Brain of the Firm*. Allen Lane, 1972.

[29] D. Meadows, "Leverage Points: Places to Intervene in a System," *Sustainability Institute*, 1999.

[30] D. Kahneman, *Thinking, Fast and Slow*. Farrar, Straus and Giroux, 2011.

[31] N. Guarino, "Formal Ontology in Information Systems," in *Proc. FOIS'98*, IOS Press, 1998.

[32] P. B. Kruchten, "The 4+1 View Model of Architecture," *IEEE Software*, vol. 12, no. 6, pp. 42–50, 1995.
