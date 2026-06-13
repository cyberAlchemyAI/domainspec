---
node_type: subagents-findings
dispatch_id: 2026-06-13-dispatch-formal-guarantees-v2
schema_version: "0.5.2"
status: draft
last_updated: 2026-06-13
---

# findings.md — dispatch-formal-guarantees (writer draft, pre-skeptic)

> Writer: Turing (read-only; parent-persisted verbatim). Candidates below are the WRITER's
> draft; the L2 skeptic gates (Rathjen precedent / Bell non-vacuity / Gödel definitional)
> run against THESE before the auditor's verdict matrix. Path correction carried from the writer:
> the authoritative appender is `skills/register-dispatch/append-dispatch.cjs` (explorers cited
> the bare filename).

## C1 — Pre-dispatch cost oracle (closed-form upper bound)

**Statement.** For any dispatch record that passes validation, the total token cost of the
entire (possibly looping) execution is bounded above by a closed form computable *before any
agent fires*: `cost ≤ max_loops × Σ_{a ∈ agents} token_budget(a)`. The pre-computable ceiling
(leg A) is *forced by* (leg B): `max_loops` a declared integer in `1..5`
(`append-dispatch.cjs:144`), every `token_budget` a declared positive integer with no unlimited
default (`:194`), and every feedback/zig-zag back-edge carrying a positive-integer `loop_cap`
while sequential edges carry none (`:218-220`) — so the connection multigraph has no unbounded
cycle and path-unrolling terminates in `≤ max_loops × Σ loop_cap_i` steps.

**Anchor.** `skills/register-dispatch/append-dispatch.cjs:144,194,218-220`. Lean home: a new
`DispatchCostBound.lean` in the cost-accounting style of `lean-formalization/CostEnriched.lean`.

**Collapse-test.** If zig-zag/feedback + `loop_cap` is semantically equal to standard
bounded-iteration, the measure `max_loops × Σ loop_cap_i` is exactly the termination measure of
bounded recursion, and the per-edge typing adds nothing to the bound (Spivak's dissent;
Abramsky's AARA/workflow-net mapping). The bound is still usable as executable code regardless.

**First Lean obligation + CERTIFIED-vs-ASSUMED border.** Define `Dispatch` (groups; agents with
`token_budget : ℕ+`; connections with `loop_cap : ℕ+`; `max_loops` in `1..5`) and prove
`totalCost d ≤ d.max_loops * (d.agents.map token_budget).sum`. **CERTIFIED** (given the declared
integers): the arithmetic bound + termination of the unrolling. **ASSUMED** (the border the proof
cannot cross): the runtime actually honors `loop_cap`/`max_loops`; agents do not self-dispatch off
the declared graph; no agent exceeds its `token_budget` mid-run. The theorem certifies the ceiling
*implied by the declared integers*, not that execution respects them.

**References for the pieces.** AARA (Hofmann-Jost 2003); workflow-net soundness (van der Aalst
2011); sized types (Abel 2012). The composite (typed-edge DAG + per-edge `loop_cap` × global
`max_loops` × `token_budget`) is the specific object characterized here. The value is
**operational** — an executable pre-dispatch oracle that gates spend before any agent fires.

## C2 — Advisory→enforced lifecycle invariant (`closeOfs ⊆ dispatchIds`)

**Statement.** The intended typestate invariant — every close row references a previously
registered dispatch (the ∅→open→closed lifecycle) — is, in current code, **not** forced by the
append path: a close row for `close_of = x` does NOT force a dispatch row for `x`, because `:341`
only emits `warning: ... appending close row anyway`. The candidate is the *enforced* version: an
`appendClose` that rejects (non-zero exit) when `close_of ∉ dispatchIds`, making the subset
relation an invariant the ledger type *forces* rather than merely observes.

**Anchor.** `skills/register-dispatch/append-dispatch.cjs:341` (the advisory-only branch). The
sharpest *actionable* gap (Spivak). Lean home: a new `DispatchLedgerInvariant.lean`.

**Collapse-test.** If the advisory warning is in practice unreachable (the surrounding workflow
already guarantees registration-before-close by construction), enforcing it adds no reachable
state-space restriction. The fact that settles it: a proof/audit that `close` is unreachable
without a prior `register` in the real invocation harness.

**References for the pieces.** The 3-state lifecycle (Strom-Yemini 1986; Honda et al. session
types 1998/2016 — a 2-message session type). The actionable point stands on its own: the current
code does NOT enforce the invariant (`:341` warns and proceeds), so this is a real gap between
intended and actual typestate — not "true by construction."

## C3 — Two-key G-Set confluence

**Statement.** The ledger is two grow-only G-Set CRDTs (keyed by `dispatch_id` and `close_of`);
concurrent racing appends converge because each append is an idempotent grow-only insert
(`already registered`/`already closed` both exit-0 no-ops, `:336-360`).

**Collapse-test (fires).** Two-key product G-Set confluence follows directly from Shapiro et al.
2011, with a verified-Coq precedent (arXiv:2203.14518). The only un-named atom — the cross-set
predicate `closeOfs ⊆ dispatchIds` — IS C2, and is currently unenforced. So C3 standalone reduces
to citing Shapiro. **Usable only as a cited component of C1/C2, not on its own.**

## One-line answer to goal

**C1 (pre-dispatch cost oracle) is the candidate most worth building as an oracle** — highest
operational leverage (the only candidate that gates real spend before any agent fires) and the
cleanest CERTIFIED/ASSUMED border — *provided* it survives the collapse-test that `loop_cap`-bounded
zig-zag is not merely well-founded recursion. If the skeptics collapse that, fall back to **C2**
(advisory→enforced lifecycle), the sharpest actionable gap since the code today only warns.

## L4 Auditor verdict (Bourbaki) — FINAL

The three gates (Rathjen precedent / Bell non-vacuity / Gödel definitional) converge on the same
operational reading for all three candidates — earned via distinct attack vectors, false-consensus
flag does NOT fire.

| candidate | witnessed? | sound? | takeaway |
|---|---|---|---|
| C1 cost oracle | NOT-WITNESSED on current data (83/84 rows sequential, max_loops=1 → "graph finite"); witnessed only under a feedback back-edge + max_loops>1 | bound uses only global `max_loops`; per-edge `loop_cap` does not enter the multiplicand | use as executable budget tool (cite van der Aalst); near-vacuous on current data until per-edge caps are exercised |
| C2 lifecycle invariant | NO-WITNESS (zero orphan close rows; close not independently reachable) | true-by-construction in the current harness | real gap in the code — `:341` only warns; advisory-vs-enforced should be reconsidered |
| C3 G-Set confluence | n/a (component only) | follows from Shapiro 2011 | settled tool — cite Shapiro; use only inside C1/C2 |

**Rathjen's owner-map note:** the C1 composite maps onto resource-constrained WF-nets
(Juhász-Sidorova-van der Aalst) for budget+termination, and the short-circuit construction for the
loop_cap back-edge.

**Gödel's note:** none of C1/C2 is formalized in Lean — they are prose models with no proof
object; the value claimed for them is operational.

**Sharper statement left on the table:** the per-edge-cap bound `Σ_e loop_cap(e)·work` is strictly
tighter than `max_loops × Σ` and would give the edge-typing genuine definitional content in the
bound — but it is non-vacuous ONLY if the dispatch system adopts per-edge cap enforcement (a
governance decision). A conditional note, not a build-now item.

## Dispatch-level answer (one line) + exit_reason

**Which dispatch-system guarantee is worth building as an oracle? C1 as an executable budget tool**
— it gates spend before any agent fires (cite van der Aalst), but is near-vacuous on current data
until the system exercises per-edge caps. C2 names a **real code gap** (`:341` only warns where it
could enforce) worth a governance decision. **exit_reason: resolved**. The certifier/judge
architectural value migrates to the sibling dispatch `certifier-judge-separation`.

