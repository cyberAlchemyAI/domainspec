## 02 — Abramsky — external-literature/formal (round 1)

> Persisted by parent: read-only agent; content verbatim below.

**Claim IDs used throughout: A1, A2, ...**

### Candidate 1: Bounded-cost / termination oracle

**A1 — Closest established result: AARA lineage (Hofmann & Jost 2003 → Hoffmann, Das, Pfenning)**

Automatic Amortized Resource Analysis (AARA) proves, by type-checking, that the execution cost of a program is bounded by a polynomial (or linear) arithmetic expression in its input parameters. Hofmann & Jost 2003 (POPL) introduced the potential method as a type system for first-order functional programs; Hoffmann extended this to polynomial bounds (ESOP 2010); Das, Hoffmann & Pfenning 2018 (LICS) embedded the same potential method *into session types*, giving parametric cost bounds on message-passing processes.

Sources:
- Hofmann & Jost 2003: "Static prediction of heap space usage for first-order functional programs," POPL 2003. https://www.cs.cmu.edu/~janh/assets/pdf/HoffmannJ21.pdf (retrospective)
- Das, Hoffmann & Pfenning 2018: "Work analysis with resource-aware session types," LICS 2018. https://www.cs.cmu.edu/~janh/papers/DasHP18.pdf
- Survey: "Two decades of automatic amortized resource analysis," Hoffmann & Jost 2021. https://www.cs.cmu.edu/~janh/assets/pdf/HoffmannJ21.pdf

**A2 — What AARA establishes:** A cost bound of the form `cost ≤ f(params)` is derivable at type-check time, before execution, for terminating programs. For a DAG of agents, termination follows immediately from the DAG being acyclic (no back-edges on sequential edges). The session-type variant (Das et al.) bounds total messages exchanged in a typed communication session.

**A3 — Mapping the specific dispatch object onto the literature.** The dispatch system's specific composite is: a *typed-edge* connection DAG (sequential | zig-zag | feedback), where only zig-zag/feedback edges carry a `loop_cap ∈ ℤ_{>0}`, combined with a global `max_loops ∈ {1..5}` as a ceiling on whole-dispatch re-runs, and per-agent `token_budget` as a leaf-level resource annotation. AARA types *programs*; it does not type a *scheduling DAG* where edge categories carry different iteration semantics. The pieces have established results: well-founded recursion/ordinal bounds (Abel, Abel & Pientka, e.g. FICS 2012 https://arxiv.org/pdf/1202.3496), sized types (Hughes, Pareto & Sabry 1996; Abel 2012), loop-bound analysis (Exact Loop Bound Analysis, PACMPL 2025 https://dl.acm.org/doi/10.1145/3729323), cost-aware DAG scheduling (Springer J. Supercomputing 2016). The *composite* of per-edge `loop_cap × global max_loops × nesting-depth-1` as a static oracle for the specific dispatch topology is the object to be built; I did not locate a single result that already states it as one piece.

**A4 — Workflow-net literature (Petri nets, van der Aalst):** Workflow soundness (proper termination + reachability) is the closest prior art in the process-modelling community. Soundness of workflow nets is decidable for bounded nets (van der Aalst et al., "Soundness of Workflow Nets: Classification, Decidability and Analysis," 2011). The dispatch DAG with bounded back-edges is structurally simpler than a general workflow net (back-edges are explicitly capped, not governed by markings). However, the *token budget* dimension (a resource parameter, not a marking) and the *edge-type taxonomy* are not part of workflow-net soundness. Sources: https://www.pads.rwth-aachen.de/global/show_document.asp?id=aaaaaaaaababkwh

### Candidate 2: Ledger CRDT-confluence

**A5 — Closest established result: Shapiro, Preguiça, Baquero, Zawirski 2011**

"Conflict-free Replicated Data Types," SOSR 2011 / RR-7687 (INRIA). A grow-only set (G-Set) is the canonical state-based CRDT: state = finite set S, join = set union ∪, mutator = insert (inflation). Strong eventual consistency follows from commutativity, associativity, and idempotency of ∪. The dispatch ledger's two independent G-Sets (one keyed on `dispatch_id`, one on `close_of`) map directly onto this structure.

Sources:
- Shapiro et al. 2011: https://www.csa.iisc.ac.in/~raghavan/CleanedPods2021/crdt-shapiro-2011.pdf
- Springer chapter: https://link.springer.com/chapter/10.1007/978-3-642-24550-3_29
- δ-CRDT: https://arxiv.org/pdf/1603.01529

**A6 — Mapping onto CRDT theory: one piece beyond the standard G-Set.** A two-key-domain G-Set pair (one for opens, one for closes) with a structural integrity constraint (`closeOfs ⊆ dispatchIds`) maps closely onto standard CRDT theory. Shapiro et al. establish that G-Sets converge; the two-set pair is a product of two G-Sets and inherits convergence by product of join-semilattices. The *specific* keyed-dedup semantics (idempotent on `dispatch_id`/`close_of`, ordered by two-append discipline) follows directly from the G-Set definition. The integrity constraint `closeOfs ⊆ dispatchIds` is an additional invariant (a cross-set predicate) that the standard G-Set CRDT does not include — that predicate is the piece the standard result does not cover. The event-sourcing literature (idempotency keys, keyed deduplication) covers the mechanics in practice but without that cross-set invariant formally stated.

**A7 — Verified CRDT work in Lean/Coq:** "Certified Mergeable Replicated Data Types," arXiv:2203.14518 (2022), https://arxiv.org/pdf/2203.14518, formalises CRDT convergence in Coq. This is the closest mechanized reference and would be the first thing to cite in a Lean formalization.

### Candidate 3: Dispatch lifecycle typestate

**A8 — Closest established results: Strom & Yemini 1986 + Honda-Vasconcelos-Kubo 1998 + deadlock-free typestate 2018**

Strom & Yemini, "Typestate: A programming language concept for enhancing software reliability," IEEE TSE 1986: https://www.semanticscholar.org/paper/Typestate:-A-programming-language-concept-for-Strom-Yemini/c060b1d8618d8ed2558771dd8b072e0d02e42b5a. They establish that a finite-state grammar over an object's operations can be enforced by a type system, preventing illegal state transitions (e.g., operating on a closed file).

Honda, Vasconcelos & Kubo 1998 (ESOP): "Language primitives and type discipline for structured communication-based programming." https://filipendule.github.io/mgs/honda.vasconcelos.kubo.pdf. Session types enforce a protocol (a typed channel = a behavioral type = a session) between communicating parties; well-typed programs cannot violate the prescribed sequence of send/receive operations. Progress (no deadlock) follows from duality in binary sessions.

Honda, Yoshida & Carbone 2008/2016 (JACM): Multiparty asynchronous session types. https://mrg.cs.ox.ac.uk/publications/multiparty-asynchronous-session-types-jacm/jacm.pdf. Extends to N-party sessions; global type projects to local types; well-typed processes satisfy progress (deadlock freedom) and type safety.

**A9 — The 3-state ∅→open→closed lifecycle for dispatch_id maps onto a standard typestate / session type.**

The abstract structure `∅ → open → closed` (with `close` only valid from `open`) is a 2-message session type in Honda et al.'s sense: channel C carries protocol `!dispatch_id.!close_of.end`. The "orphan close" pathology (close without prior open) is exactly the protocol violation that session types prevent. The specific objects (YAML keys `dispatch_id`, `close_of`, idempotent no-op on re-close) instantiate a standard 3-state FSM.

The *combination* of typestate-enforcement with the CRDT-convergence property (candidate 2) — i.e., the lifecycle automaton acting on a G-Set state — does not map onto a single established result. Deadlock-free typestate-oriented programming (Padovani & Novara 2015; Bocchi, Lange, Rezk, Yoshida 2018 arXiv:1803.10670 https://arxiv.org/abs/1803.10670) addresses deadlock in concurrent typestate, not the combination with CRDT convergence.

### Per-candidate summary table

| Candidate | Closest established result | Maps as one piece? | What the result does not cover |
|---|---|---|---|
| (1) Bounded-cost / termination oracle | AARA (Hofmann & Jost 2003; Das et al. 2018); workflow soundness (van der Aalst 2011) | not as a single composite | per-edge `loop_cap × max_loops × nesting-depth` on typed-edge DAG with token budget is not stated as one theorem; the pieces are |
| (2) Ledger CRDT-confluence | Shapiro et al. 2011 G-Set | almost — direct corollary | cross-set integrity predicate `closeOfs ⊆ dispatchIds`; pure confluence follows directly |
| (3) Dispatch lifecycle typestate | Strom & Yemini 1986; Honda et al. 1998/2016 | not for this system | 3-state FSM maps cleanly; combination with CRDT convergence (typestate on G-Set pair) does not |

**Where the literature is furthest from the object:** Candidate (1). The specific composite (typed-edge DAG with edge-category-conditional `loop_cap`, global `max_loops`, per-agent `token_budget`, one-level nesting) is not an instance of AARA (which types programs, not scheduling topologies), not workflow soundness (which uses markings, not per-edge integer caps + separate token budgets), and not sized-type termination checking (which types recursive functions, not dispatch graphs). The pieces all have established results; the typed-edge dispatch-topology oracle is the object that would have to be assembled.

Dissent: My angle reads the literature top-down onto the formal objects. The repo-internal explorer (Spivak) derived bottom-up and found candidate (1) has "a finite sum of positive integers" as its core measure — which I agree is trivially terminating. The tension is: bottom-up, the measure looks clean and computable; top-down, it maps onto standard bounded-iteration / DAG-unrolling results from the AARA and workflow-net literature, suggesting the typed-edge structure may add less to the bound than it appears. I expect to disagree with Spivak specifically on candidate (2): Spivak reads the G-Set confluence as interesting; from the literature it is a direct corollary of Shapiro et al. that requires no new proof. The skeptic layer (Rathjen) should test how tightly each composite maps onto its established result.
