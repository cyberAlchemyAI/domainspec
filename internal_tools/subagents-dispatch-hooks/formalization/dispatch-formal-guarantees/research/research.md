---
tags: [dispatch, formalization, research, cost-oracle, guarantees, appended-explorers]
node_type: research
is_session: false
layer: architecture
nature: technical
status: complete
version: 1.0.0
last_updated: 2026-06-13
---

# research.md — dispatch 2026-06-13-dispatch-formal-guarantees-v2 (returns coletados, verbatim)

Concat verbatim dos returns dos explorers, um header por agente (`## <id> — <angle> (round N)`),
append-only entre rounds. Este arquivo é o alvo imóvel das citações do `findings.md` (P9). Os
returns de skeptic/writer/auditor vivem em `agents/03..07-*.md` (mesmos arquivos, formato research-skill).

## 01 — Spivak — repo-internal/empirical (round 1)

> Persisted by parent: the `research-explorer` agent type is read-only by constitution and
> could not write its own file; it returned inline. Content verbatim below.

**Claim IDs anchored to file:line throughout.**

### Formal objects derived from code and schema

**S1 — Connection DAG: labeled directed multigraph with typed edges and bounded back-edges**

Source: `append-dispatch.cjs:103` defines `CONNECTION_TYPES = ['sequential', 'zig-zag', 'feedback']`; `append-dispatch.cjs:218-220` enforces that `loop_cap` is absent on `sequential` and must be a positive integer on `zig-zag`/`feedback`. `SKILL.md:95-96` names exactly `{from, to, type, loop_cap?}` per connection.

Structure: Labeled directed multigraph G = (V=group_ids, E=connections, λ: E→{sequential, zig-zag, feedback}, κ: E_{non-seq}→ℤ_{>0}). The graph is over group nodes; edges carry a type label and a conditional positive integer cap. Back-edges (zig-zag/feedback) are distinguished from acyclic edges (sequential) by the schema invariant: `loop_cap` is structurally forbidden on `sequential` edges (`append-dispatch.cjs:219`).

Invariant for candidate (1): The subgraph of zig-zag/feedback edges forms a set of back-edges each capped by `loop_cap`. Combined with `max_loops` at `append-dispatch.cjs:144` (enforced integer in 1..5), the unrolling depth of any path through the graph is bounded above by `max_loops * max(loop_cap_i)`. This is a well-founded measure: assign each back-edge a weight equal to its `loop_cap`; the total traversal count across all back-edges in a single dispatch execution is ≤ `max_loops * Σ loop_cap_i`. The structural fact from the code: `sequential` edges carry no cap because they are DAG edges; only back-edges carry caps. This is the geometric foundation for a termination/cost oracle.

**S2 — Global max_loops: bounded iteration integer, carries a monotone decrease measure**

Source: `append-dispatch.cjs:144` enforces `Number.isInteger(rec.max_loops) && rec.max_loops >= 1 && rec.max_loops <= 5`. `SKILL.md:53` names it "whole-sequence re-run ceiling".

Structure: A bounded natural number parameter `n ∈ {1,2,3,4,5}`. As a measure for termination: it serves as an ordinal bound on whole-dispatch re-run iterations. Combined with `S1`, it gives a finite product bound: total invocations ≤ (Σ_agents token_budget_i) × max_loops.

Invariant for candidate (1): `max_loops` is the global iteration ceiling; `loop_cap` per back-edge is the local ceiling. Together they bound the unrolling of any cycle in the connection DAG. The per-edge `loop_cap` gives a tighter bound than the global ceiling alone when topology is accounted for.

**S3 — Per-agent token_budget: a positive integer resource annotation on agent nodes**

Source: `append-dispatch.cjs:194` enforces `Number.isInteger(a.token_budget) && a.token_budget > 0`, with the comment "no unlimited default (§5)".

Structure: A resource annotation function `B: agents → ℤ_{>0}`. The total cost budget for a dispatch is `Σ_{g∈groups} Σ_{a∈g.agents} B(a) × (loops the group participates in)`. This is a linear arithmetic expression over the dispatch tree, bounded by `max_loops`.

Invariant for candidate (1): The absence of an unlimited default (`append-dispatch.cjs:194`) means every agent carries a declared upper bound. The total token cost of a dispatch is therefore a computable closed-form expression: `cost ≤ max_loops × Σ_a token_budget(a)`. This is the cleanest latent measure — it is a concrete arithmetic bound derivable directly from the dispatch record before execution, usable as a pre-dispatch budgeting tool.

**S4 — L1/L2/L3 tree: a three-level relational schema with foreign-key hierarchy**

Source: `LEDGER-MODEL.md:91-98` gives the normalization table explicitly: dispatch (L1, key=`dispatch_id`), group (L2, key=`group_id`, FK=`dispatch_id`), agent (L3, key implicit, FK=`group_id`). `append-dispatch.cjs:166-204` validates this nesting structurally (groups non-empty array, each group has agents non-empty array).

Structure: A three-level relational schema with FK constraints. In today's code it is denormalized (one JSON column per dispatch row), but the FK structure is enforced in-memory by validation. The normalization target is named explicitly at `LEDGER-MODEL.md:104` ("the normalization is a design, not yet what the appender writes").

Invariant for candidates (2) and (3): The `dispatch_id` at L1 is the primary key for both the dispatch row and its corresponding close row; uniqueness is enforced by the structural self-check at `append-dispatch.cjs:321-328`. This FK hierarchy is the structural backbone for lifecycle typestate (S6) and the join-semilattice property for CRDT-confluence (S5).

**S5 — Append-only keyed ledger: idempotent write monoid on two key domains**

Source: `append-dispatch.cjs:357-360` (dispatch dedup: if `dispatchIds.has(rec.dispatch_id)` → no-op, exit 0); `append-dispatch.cjs:336-339` (close dedup: if `closeOfs.has(rec.close_of)` → no-op, exit 0). `LEDGER-MODEL.md:49` states "the appender is idempotent on `dispatch_id`/`close_of`".

Structure: A keyed join-semilattice on two independent key domains (dispatch_id-keyed rows, close_of-keyed rows). The write operation is: `write(k, v) = v if k ∉ ledger, else identity`. This is exactly the idempotent, commutative operation that characterizes a grow-only set CRDT (2P-set variant with two grow-only sets: open dispatches and closed dispatches). The `checkLedger` function (`append-dispatch.cjs:299-333`) enforces structural integrity as a pre-append invariant.

Invariant for candidate (2): The join is `{dispatch rows} ∪ {close rows}`, both grow-only. Two ledger replicas that have received the same dispatch_id/close_of events (in any order) will have the same set of rows — convergence follows from set-union commutativity. The join is `L1 ∪ L2 = L2 ∪ L1 = L1 ∪ L2`. This makes the ledger a G-Set CRDT (two of them, independently keyed).

**S6 — Dispatch lifecycle: three-state partial function / typestate automaton**

Source: `append-dispatch.cjs:320-329` (the structural self-check tracks `dispatchIds` and `closeOfs` as two separate sets); `append-dispatch.cjs:336-343` (close row logic: warns if no matching dispatch row exists — "an orphan close row indicates a Principle-3 breach upstream", per `SKILL.md:209`). The lifecycle states derivable from the two sets: ∅ (not registered), open (in dispatchIds, not in closeOfs), closed (in both). Leaked/orphan = in closeOfs but not in dispatchIds (the warning case at `append-dispatch.cjs:341-343`).

Structure: A three-state labeled transition system / typestate: states = {∅, open, closed}, transitions = {register: ∅→open, close: open→closed}. There is also a degenerate state: orphan_close = transition into closeOfs without a prior dispatch row (warned, not blocked). The transition relation is a partial function (once open, you cannot re-open; once closed, re-close is idempotent no-op).

Invariant for candidate (3): Any `dispatch_id` in `closeOfs` that is not in `dispatchIds` is a detectable protocol violation (the warn at `append-dispatch.cjs:341`). The appender currently warns rather than enforcing an orphan close — a typestate guarantee would convert this warn to a structural precondition: `close(id)` is only valid if `id ∈ dispatchIds`. The full lifecycle invariant: `closeOfs ⊆ dispatchIds` (currently advisory, not enforced — this is the lifecycle gap at `append-dispatch.cjs:341`).

**S7 — One-level nesting constraint: parent_dispatch_id as a flat DAG of dispatches**

Source: `append-dispatch.cjs:147` (`parent_dispatch_id` is optional, must be a non-empty string or null). `SKILL.md:57` — "only on a dispatch planned by a meta dispatch". The nesting is at most one level (meta dispatch → child dispatch); no recursive parent chains are structurally enforced.

Structure: A forest (set of trees of depth ≤ 1) over dispatch_ids, encoded as an optional FK. Not a general DAG — the schema implies at most one level by the `meta: true` flag convention (`append-dispatch.cjs:146`, `SKILL.md:56`).

Invariant for candidates (1) and (3): The one-level nesting bound means the total agent invocation count across a meta-dispatch+children is bounded by `Σ_{child} (max_loops_child × Σ_a token_budget(a))`. There is no unbounded recursion in the nesting structure.

**S8 — Hook triad: three PreToolUse guards on disjoint tool classes**

Source: `enforce-append-only-dispatch.cjs:80-87` (Edit|MultiEdit|Write|NotebookEdit → deny if ledger path; Bash|PowerShell → deny unless read-only command); `block-workflow.cjs:12-29` (Workflow → deterministic deny); `remind-register-dispatch.cjs:10-25` (Agent → reminder-only, fail-open).

Structure: A policy enforcement point (PEP) triple: one deny-by-default guard, one soft reminder, one hard block. The `enforce-append-only-dispatch.cjs` hook is the mechanical enforcement of S5's append-only invariant. Its fail-open stance (`enforce-append-only-dispatch.cjs:29`) means it is a guardrail, not a security boundary.

Invariant for candidate (2): The hook enforces that no tool call can mutate existing rows directly — append-only at the tool call level is the enforcement mechanism for the CRDT's grow-only property. Without this hook, the G-Set property could be violated by in-place edits.

### Object → Structure → Invariant → Candidate table

| Object | Structure | Invariant | Candidate |
|--------|-----------|-----------------|-----------|
| Connection DAG with typed edges | Labeled directed multigraph, back-edges bounded by κ: E_{nseq}→ℤ_{>0} | Well-founded measure: Σ loop_cap_i × max_loops bounds path unrolling | (1) bounded-cost oracle |
| max_loops ∈ {1..5} | Bounded natural parameter | Global iteration ceiling; finite product with per-agent budgets | (1) |
| per-agent token_budget ∈ ℤ_{>0} | Resource annotation on agent nodes | Total cost ≤ max_loops × Σ B(a); closed-form before execution | (1) — cleanest measure |
| L1/L2/L3 tree with FK hierarchy | Three-level relational schema | dispatch_id uniqueness; FK closure enables lifecycle tracking | (2), (3) |
| Append-only keyed ledger | Two G-Set CRDTs (dispatch_id-keyed, close_of-keyed) | Idempotent grow-only: same events → same state regardless of order | (2) CRDT-confluence |
| Dispatch lifecycle ∅→open→closed | Three-state typestate automaton | closeOfs ⊆ dispatchIds is the enforceable invariant; orphan = violation | (3) typestate |
| parent_dispatch_id nesting | Forest of depth ≤ 1 | No unbounded recursion; nesting bound tightens cost oracle | (1) |
| Hook triad | PEP triple (deny/remind/block) | Mechanical enforcement of append-only at tool-call level | (2) |

### Which candidate has the cleanest latent measure?

Candidate (1) — bounded-cost/termination oracle — has the cleanest latent measure: `cost ≤ max_loops × Σ_{a} token_budget(a)` is a closed-form arithmetic expression derivable entirely from the dispatch record (S3, anchored to `append-dispatch.cjs:144` and `append-dispatch.cjs:194`). Every input is a declared positive integer, the operation is multiplication + addition, and the bound is computable before any agent fires — making it usable as a pre-dispatch budgeting tool. The connection DAG tightens this to a per-group-path bound once topology is accounted for (S1), and the per-edge `loop_cap` gives a strictly tighter bound than the global ceiling alone. This measure has no probability, no runtime assumption, no hidden variables — it is exact given the declared schema values.

Candidate (2) (CRDT-confluence): the two G-Sets are confluent by definition of grow-only sets; the specific dedup logic in `checkLedger` + idempotency is a standard G-Set with a pre-append integrity check, and confluence is immediate.

Candidate (3) (lifecycle typestate) has the sharpest operational gap: the orphan-close warning at `append-dispatch.cjs:341` is currently advisory; making it a hard precondition (enforced typestate transition) is a concrete, implementable guarantee. The first proof obligation: show that `close(id)` is only callable when `id ∈ dispatchIds`, and that the three-state automaton is a well-typed partial function.

**Dissent:** My angle finds candidate (1) has the cleanest *arithmetic* measure — a finite sum of positive integers bounds cost. The external-literature explorer (Abramsky) reads this onto resource-semantics frameworks and bounded-iteration graph results; the open technical question is whether the typed-edge structure (sequential vs zig-zag/feedback with per-edge cap) gives anything beyond "the graph is finite, therefore terminates." The empirical derivation cannot adjudicate that mapping — that is the Abramsky/Rathjen job. From inside the code, the measure is clean and the bound is usable as stated.


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

**A3 — How the dispatch object maps onto the literature.** The dispatch system's specific structure is: a *typed-edge* connection DAG (sequential | zig-zag | feedback), where only zig-zag/feedback edges carry a `loop_cap ∈ ℤ_{>0}`, combined with a global `max_loops ∈ {1..5}` as a ceiling on whole-dispatch re-runs, and per-agent `token_budget` as a leaf-level resource annotation. AARA types *programs*; it does not type a *scheduling DAG* where edge categories carry different iteration semantics. The component results in the literature: well-founded recursion/ordinal bounds (Abel, Abel & Pientka, e.g. FICS 2012 https://arxiv.org/pdf/1202.3496), sized types (Hughes, Pareto & Sabry 1996; Abel 2012), loop-bound analysis (Exact Loop Bound Analysis, PACMPL 2025 https://dl.acm.org/doi/10.1145/3729323), cost-aware DAG scheduling (Springer J. Supercomputing 2016).

**A4 — Workflow-net literature (Petri nets, van der Aalst):** Workflow soundness (proper termination + reachability) is the closest prior art in the process-modelling community. Soundness of workflow nets is decidable for bounded nets (van der Aalst et al., "Soundness of Workflow Nets: Classification, Decidability and Analysis," 2011). The dispatch DAG with bounded back-edges is structurally simpler than a general workflow net (back-edges are explicitly capped, not governed by markings). The *token budget* dimension (a resource parameter, not a marking) and the *edge-type taxonomy* are not part of workflow-net soundness. Sources: https://www.pads.rwth-aachen.de/global/show_document.asp?id=aaaaaaaaababkwh

### Candidate 2: Ledger CRDT-confluence

**A5 — Closest established result: Shapiro, Preguiça, Baquero, Zawirski 2011**

"Conflict-free Replicated Data Types," SOSR 2011 / RR-7687 (INRIA). A grow-only set (G-Set) is the canonical state-based CRDT: state = finite set S, join = set union ∪, mutator = insert (inflation). Strong eventual consistency follows from commutativity, associativity, and idempotency of ∪. The dispatch ledger's two independent G-Sets (one keyed on `dispatch_id`, one on `close_of`) map directly onto this structure.

Sources:
- Shapiro et al. 2011: https://www.csa.iisc.ac.in/~raghavan/CleanedPods2021/crdt-shapiro-2011.pdf
- Springer chapter: https://link.springer.com/chapter/10.1007/978-3-642-24550-3_29
- δ-CRDT: https://arxiv.org/pdf/1603.01529

**A6 — How it maps.** A two-key-domain G-Set pair (one for opens, one for closes) with a structural integrity constraint (`closeOfs ⊆ dispatchIds`) maps directly onto standard CRDT theory. Shapiro et al. establish that G-Sets converge; the two-set pair is a product of two G-Sets and inherits convergence by product of join-semilattices. The *specific* keyed-dedup semantics (idempotent on `dispatch_id`/`close_of`, ordered by two-append discipline) is an immediate corollary of the G-Set definition. The integrity constraint `closeOfs ⊆ dispatchIds` is an additional cross-set predicate that the standard G-Set CRDT does not include. The event-sourcing literature (idempotency keys, keyed deduplication) covers the mechanics in practice.

**A7 — Verified CRDT work in Lean/Coq:** "Certified Mergeable Replicated Data Types," arXiv:2203.14518 (2022), https://arxiv.org/pdf/2203.14518, formalises CRDT convergence in Coq. This is the closest mechanized prior art and would be the first thing to cite in a Lean formalization.

### Candidate 3: Dispatch lifecycle typestate

**A8 — Closest established result: Strom & Yemini 1986 + Honda-Vasconcelos-Kubo 1998 + deadlock-free typestate 2018**

Strom & Yemini, "Typestate: A programming language concept for enhancing software reliability," IEEE TSE 1986: https://www.semanticscholar.org/paper/Typestate:-A-programming-language-concept-for-Strom-Yemini/c060b1d8618d8ed2558771dd8b072e0d02e42b5a. They establish that a finite-state grammar over an object's operations can be enforced by a type system, preventing illegal state transitions (e.g., operating on a closed file).

Honda, Vasconcelos & Kubo 1998 (ESOP): "Language primitives and type discipline for structured communication-based programming." https://filipendule.github.io/mgs/honda.vasconcelos.kubo.pdf. Session types enforce a protocol (a typed channel = a behavioral type = a session) between communicating parties; well-typed programs cannot violate the prescribed sequence of send/receive operations. Progress (no deadlock) follows from duality in binary sessions.

Honda, Yoshida & Carbone 2008/2016 (JACM): Multiparty asynchronous session types. https://mrg.cs.ox.ac.uk/publications/multiparty-asynchronous-session-types-jacm/jacm.pdf. Extends to N-party sessions; global type projects to local types; well-typed processes satisfy progress (deadlock freedom) and type safety.

**A9 — How the 3-state ∅→open→closed lifecycle maps.**

The abstract structure `∅ → open → closed` (with `close` only valid from `open`) is a 2-message session type in Honda et al.'s sense: channel C carries protocol `!dispatch_id.!close_of.end`. The "orphan close" pathology (close without prior open) is exactly the protocol violation that session types prevent. The specific objects (YAML keys `dispatch_id`, `close_of`, idempotent no-op on re-close) are an engineering instantiation of a standard 3-state FSM.

The *combination* of typestate-enforcement with the CRDT-convergence property (candidate 2) — i.e., the lifecycle automaton acting on a G-Set state — maps less directly onto a single named result. Deadlock-free typestate-oriented programming (Padovani & Novara 2015; Bocchi, Lange, Rezk, Yoshida 2018 arXiv:1803.10670 https://arxiv.org/abs/1803.10670) addresses deadlock in concurrent typestate.

### Per-candidate summary table

| Candidate | Closest established result | How it maps |
|---|---|---|
| (1) Bounded-cost / termination oracle | AARA (Hofmann & Jost 2003; Das et al. 2018); workflow soundness (van der Aalst 2011) | per-edge `loop_cap × max_loops × nesting-depth` on typed-edge DAG with token budget; components in the literature, no single named theorem for the typed-edge scheduling-topology composite |
| (2) Ledger CRDT-confluence | Shapiro et al. 2011 G-Set | product of two G-Sets, convergence immediate; cross-set integrity predicate `closeOfs ⊆ dispatchIds` is the additional invariant |
| (3) Dispatch lifecycle typestate | Strom & Yemini 1986; Honda et al. 1998/2016 | 3-state FSM = 2-message session type; combination with CRDT convergence (typestate on G-Set pair) maps less directly |

**Where the composite is least directly covered:** Candidate (1). The specific structure (typed-edge DAG with edge-category-conditional `loop_cap`, global `max_loops`, per-agent `token_budget`, one-level nesting) is not an instance of AARA (which types programs, not scheduling topologies), not workflow soundness (which uses markings, not per-edge integer caps + separate token budgets), and not sized-type termination checking (which types recursive functions, not dispatch graphs). The component results are established in the literature; the typed-edge dispatch-topology oracle as a single composite is not a single named result.

Dissent: My angle reads the literature top-down onto the formal objects. The repo-internal explorer (Spivak) derived bottom-up and found candidate (1) has "a finite sum of positive integers" as its core measure — which I agree is trivially terminating. The technical tension is: bottom-up, the measure looks clean and computable (and is usable as a pre-dispatch budget bound); top-down, it maps onto standard bounded-iteration / DAG-unrolling results from the AARA and workflow-net literature. For candidate (2), the external literature reads the G-Set confluence as an immediate corollary of Shapiro et al. that requires no new proof, where Spivak reads it as a substantive structural property; both agree on the underlying fact (idempotent append-only / G-Set confluence holds).
