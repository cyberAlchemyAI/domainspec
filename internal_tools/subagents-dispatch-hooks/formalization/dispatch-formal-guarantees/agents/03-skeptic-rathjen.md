## 03 — Rathjen — precedent mapping (round 1)

> Persisted by parent: read-only agent; content verbatim below. Working role: map each candidate
> guarantee onto the closest established result in the literature, so the writer knows which pieces
> are off-the-shelf citations and which the composite must assemble itself.

**C1 — pre-dispatch cost oracle** (static bound on typed-edge connection DAG, per-edge loop_cap + global ceiling + per-leaf budget, finite)

- **Closest established results:**
  - van der Aalst, *Verification of Workflow Nets* (1997/1998). A WF-net terminates+is bounded **iff** its short-circuited net (output→input transition) is live and bounded. The candidate's signature feature — "only back-edges carry loop_cap" — **is** the short-circuit construction: a loop is exactly the cyclic edge connecting an exit back to an entry. Boundedness = the finite ceiling.
  - Hofmann–Jost 2003 (AARA, POPL) + Hoffmann–Das–Weng 2017 — static, pre-execution, *sound* worst-case numeric bound `cost ≤ f(input)` for the per-leaf budget. `max_loops × Σ token_budget` is the elementary product bound a `max_loops`-bounded short-circuited net admits.
  - **The conjunction:** Juhász–Sidorova–van der Aalst, *Dynamic / Interval Soundness in Resource-Constrained Workflow Nets* (LNCS) — per-resource-type budgets WITH guaranteed termination as one object. This is the single result the writer's "un-named composite" glue maps onto.
- **Mapping note:** the back-edge/loop_cap mechanism reduces to the short-circuit reduction; the budget+termination conjunction maps onto the resource-constrained WF-net.

**C2 — advisory→enforced lifecycle invariant `closeOfs ⊆ dispatchIds`** (∅→open→closed)

- **Closest established results:**
  - Strom & Yemini 1986, *Typestate* (IEEE TSE 12(1)) — lifecycle lattice; "enforced not advisory" is the entire definition of typestate. Bierhoff–Aldrich 2007 extend enforcement to aliased append-only object protocols.
  - Referential-integrity / foreign-key constraint (Codd; SQL standard) — `closeOfs ⊆ dispatchIds` is child→parent key inclusion on a keyed log, an enforced inclusion invariant since the relational model. Moving append-dispatch.cjs:341 from warning to rejection = turning an advisory check into an enforced FK/typestate guard.
- **Mapping note:** the guarantee shape (enforced typestate lifecycle + referential inclusion on a keyed log) maps onto two decades-old results; the actionable content is purely the code change at `:341`.

**C3 — two-key G-Set confluence** — outside my assignment; component only (Shapiro et al. 2011, direct CRDT corollary). No mapping objection to add.

**Abramsky owner-map adjudication:** Correct on the three pieces (AARA, WF-soundness, sized types). WF-net soundness already integrates loop-termination and per-resource budgets in one object (resource-constrained WF-nets), so AARA + WF-soundness jointly cover the composite. Sized types (Abel) are redundant here: loop_cap is a static constant, so the bound is structural, not size-indexed.

**Dissent:** I dissent from the writer's framing that C1's composite is "un-named." It maps onto two named results — the loop-termination + per-resource-budget conjunction is the *resource-constrained workflow net* (Juhász–Sidorova–van der Aalst), and the back-edge/loop_cap mechanism is van der Aalst's short-circuit. The open operational question the literature does NOT settle: which concrete guarantee the bounded short-circuited net / enforced typestate-FK provably **cannot** state for this system — none is on the table here. I do not author that replacement (R6).

Sources: van der Aalst Verification of Workflow Nets (vdaalst.com/publications/p44.pdf); Soundness of Workflow Nets (Classification, Decidability, Analysis); Dynamic Soundness in Resource-Constrained Workflow Nets (LNCS 10.1007/978-3-642-21461-5_17); Hoffmann-Das-Weng 2017 AARA; Strom & Yemini Typestate; Bierhoff & Aldrich Modular Typestate; foreign key / referential integrity.
