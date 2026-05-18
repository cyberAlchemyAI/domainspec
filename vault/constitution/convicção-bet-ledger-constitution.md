---
tags: [vault, ontology, bets]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-16
---

# Convicção Bet Ledger

> The instance-side carrier for the schema-level `convicção` axis. A bet is a concrete, falsifiable commitment that materializes a high-convicção claim. Without this, `convicção: high` is a schema-only assertion with no anchor in reality — exactly the R1 residue identified in `discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md` §C.

---

## Objective

`convicção` declares how hard the team is betting on a claim. The schema accepts a value (`high | medium | low`) but until this constitution shipped, no instance artifact recorded what *bet* the value referred to. A bet ledger closes the residue: every high-convicção claim that warrants a bet acquires one durable file recording the stake, the falsification test, and the dependents that would have to be revised if the claim falls.

The ledger is intentionally minimal. Bets are not premises (a premise is a testable claim), not constitutions (a bet does not govern behavior), and not audits (a bet is forward-looking). A bet is the instance carrier of a commitment.

---

## 1. What a bet is

A bet is a structured commitment attached to one high-convicção claim. It declares: *"if this claim turns out false under the stated falsification test, the following artifacts would have to be revised."* The bet's existence is the evidence that the convicção value is more than a label.

A bet is **not**:
- A prediction market (no probability, no payout — convicção is qualitative).
- A premise (a premise carries the claim; a bet attaches *to* a claim and records what depends on it).
- A roadmap entry (dependents are artifacts to revise, not features to ship).

## 2. When a claim warrants a bet

A bet is required when **both** hold:

- `convicção: high` is declared on the node, AND
- `status` is `active`, `consolidated`, or `evergreen` (the claim is no longer purely exploratory).

A bet is also warranted (but not required) when convicção is high and the node is `exploratory` — early bets are preferred because they expose the commitment before it ossifies. A bet is **not** appropriate when the claim is trivially falsifiable (a unit test suffices) or when no concrete dependents exist.

## 3. Bet file frontmatter spec

```yaml
---
bet_id: B-NNN                              # zero-padded, monotonic, vault-wide
for_claim: <relative path to the high-convicção node>
staked_on: YYYY-MM-DD
falsification_test: <one-line concrete observable that would falsify>
dependents: [<paths to artifacts that would need revision if the claim falls>]
status: open | called-true | called-false | withdrawn
convicção_at_stake: high | medium | low    # the level being committed to
---
```

Body: prose explaining why this claim is bet-worthy, what success looks like, and what failure looks like. No body cap, soft target ≤ 40 lines.

## 4. Status lifecycle

```
open ──► called-true       (falsification test ran; claim survived)
     ├─► called-false      (falsification test ran; claim failed; dependents must be revised)
     └─► withdrawn         (claim retracted before the test could run; convicção lowered)
```

Transitions are append-only: a `called-false` bet stays in the ledger as historical record. Re-betting on the same claim opens a new `B-NNN`.

## 5. The no-orphan rule

**Every node with `convicção: high` AND `status ∈ {active, consolidated, evergreen}` MUST be the `for_claim` of at least one bet with `status: open` or `status: called-true`.**

A node violating this rule is a *schema-only commitment* — the residue this constitution exists to close. The CLI command `vault-ctl bets orphans` enumerates violations. Reviewers must either (a) write a bet, (b) lower the convicção, or (c) demote the status. There is no fourth option.

## 6. Boundary

This constitution governs the *shape* and *existence* of bets, not their substance. The quality of a falsification test is the bet author's judgment; if the test is non-observable, the bet is malformed and the validator should reject it. Bets do not promote anything — they only record commitment. Promotion of a claim remains governed by its own node type's discipline.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md` | `derives-from` | This constitution closes the R1 residue identified in §C of that lens. |
| `ontology-conventions.md` | `refines` | Refines the convicção axis by adding an instance-side carrier. |
| `bets/B-001-graph-as-residue-attractor-load-bearing.md` | `governs` | First bet written under this constitution; serves as proof of concept. |
