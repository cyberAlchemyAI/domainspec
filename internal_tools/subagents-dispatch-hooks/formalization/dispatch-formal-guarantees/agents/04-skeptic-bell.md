## 04 — Bell — non-vacuity (round 1)

> Persisted by parent: read-only agent; content verbatim below.
>
> **PARENT CORRECTION (cross-repo error in Bell's ground-truth premise).** Bell concluded the
> harness (`append-dispatch.cjs`, `token_budget`, `loop_cap`, typed connection edges) "does not
> exist in this repo." That is a CROSS-REPO confusion: Bell searched
> `domainspec-lean-formalization`, but the harness lives in
> `domainspec/internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs`
> (verified by explorers Spivak + Abramsky; the v0.5.2 schema DOES require `token_budget` per agent
> and DOES carry `loop_cap`/connection-type validation). Bell also read THIS repo's ledger
> (lean-formalization/telemetry), not the domainspec ledger where the new dispatches were
> registered. **Net effect on his verdict:** the schema fields DO exist — so C1's structure is real,
> not counterfactual — but Bell's substantive non-vacuity point survives in a corrected form: the
> fields exist in the schema but are **not exercised** in the recorded data (connections all
> `sequential`, `max_loops:1` on 83/84 rows). "Non-vacuous as specified, not as exercised."

**Ground truth established (read-only sweep):** the sole ledger Bell read is
`c:\Users\victo\domainspec-lean-formalization\telemetry\agents\subagents-dispatch.yaml` (84 rows,
32 register/close pairs). C1 and C2 are proposals against that registry's actual schema; non-vacuity
judged against its real contents.

**candidate: C1** — pre-dispatch cost oracle over typed-edge connection DAG
**gate: non-vacuity** — **verdict: witnessed** (as specified; see parent correction + Dissent)

The decision-changing topology is constructible by hand and the typed-edge distinction is
load-bearing (not merely "graph is finite ⇒ terminates"):

- **Sheet REJECTED (oracle changes the decision):** Take a real row with `max_loops: 3`. Build a
  2-node DAG: explorer `E` → skeptic `S`, plus a **feedback back-edge** `S → E` carrying
  `loop_cap = 3`. Set `token_budget(E)=token_budget(S)=B`, declared sheet budget `cost ≤ 2.5·B`.
  Oracle computes back-edge cost `loop_cap × Σ token_budget = 3 × 2B = 6B > 2.5B` → **fail-closed
  REJECT**. A naive reading (count two agents, `2B ≤ 2.5B`) would **accept**. The decision flips.
- **Sheet ACCEPTED:** same two nodes with a **sequential** edge `E → S` (no back-edge): cost
  `= 1 × 2B = 2B ≤ 2.5B` → accept.

Identical node set and budgets yield REJECT vs ACCEPT solely by reclassifying the edge
sequential→feedback. The multiplier `max_loops` only attaches on the back-edge. **Non-vacuous:
witnessed.** (Caveat under Dissent.)

**candidate: C2** — enforced lifecycle invariant `closeOfs ⊆ dispatchIds`
**gate: non-vacuity** — **verdict: no-witness**

I tried to build the reachable trace the advisory-warning branch is supposed to catch. I cannot
construct one, and the empirical record corroborates unreachability:

- **Empirical:** all 32 `close_of` rows resolve to an earlier `dispatch_id` (e.g. 24→14, 347→316,
  720→707). The invariant already holds on 100% of production data; never violated.
- **By-construction:** a `close_of` value is the dispatch's own id, and the close row is written by
  the *same* register-dispatch skill that wrote the register row. `close` is not an
  independently-addressable entry point — it is the second half of a dispatch's own lifecycle. The
  warning guards a state the writer cannot reach.

The one residual route — hand-editing the YAML to inject an orphan `close_of` — is operator
file-corruption, not a harness-reachable transition. **No reachable witness ⇒ enforcing restricts no
reachable state ⇒ vacuous on the harness. no-witness.** (If re-scoped as YAML-integrity /
tamper-detection it acquires a witness, but that is a different claim.)

**Dissent:**

1. **C1's "witnessed" is conditional (corrected by parent).** My witness proves the oracle *would
   be* non-vacuous given per-agent token budgets and edge types. Per the parent correction, those
   fields DO exist in the domainspec schema — but they are not exercised in the recorded data. So
   C1 is "non-vacuous as specified," and the operative gap is "specified-but-not-exercised" rather
   than "does not exist." The witness does not show the oracle is *live on current data*.
2. **C1 risks collapse to trivial finiteness on the sequential-only corpus.** 83 of 84 rows have
   `max_loops: 1` and no declared feedback edges. On that corpus the oracle reduces to
   `cost ≤ 1 × Σ token_budget` = "the graph is finite" — the vacuous reading. The non-vacuity I
   witnessed survives only because one real `max_loops:3` row plus a feedback back-edge can
   instantiate the multiplier. The collapse-test must bind C1's headline.
3. **C3 was assigned to my gate but is a component-only candidate; I declined to attack it.**
   Flagging the mis-routing rather than padding.
4. **Deliverable shortfall:** read-only toolset (no Write/Edit/Bash), so the per-agent file was
   returned inline for the parent to persist. (Parent persisted here.)
