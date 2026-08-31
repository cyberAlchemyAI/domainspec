---
name: check-tension
description: Init-time anti-bias gate. Before the human confirm, subject-group sheets receive two independent rubric verdicts; no-subject sheets receive an exact digest-bound mechanical disposition without spawning gate agents. Gate infrastructure: not itself a dispatch, not subject to its own gate.
---

# check-tension — the init-time anti-bias gate

Anti-bias is enforced **only at initialization**: the guarantee is that the agents of a
dispatch are tensioned **by design**, checked here _before_ the human confirm. There is **no
post-dispatch realization check** — the `Dissent:`-line apparatus was retired. This skill is
the gate and **owns the rubric below**; it owns no dispatch field and no type judgment.

## When it runs

Between **Propose** and **Confirm** in the lifecycle (router §3), for any sheet
that has a **subject group**: a group with at least 2 agents whose agent roles
include investigation work (`explorer`) or evaluation work (`skeptic` or
`auditor`). Wire schema 0.9.0 has no group-level role. A sheet with no subject
group has nothing to tension; the gate passes mechanically without spawning
the checker or reviewer.

Precondition: the exact persisted sheet must already have passed its form
owner's non-mutating confirmation-readiness validator. On the subject branch,
both agents receive that same admitted sheet digest. This skill owns anti-bias
only; it must not infer schema, registrar, final-approver, or dispatch-type
admission from a tension PASS.

The input boundary is closed: each gate agent receives the exact persisted
sheet bytes, their SHA-256 digest, and this rubric only. Companion strategy
documents, parent-written summaries, prior chat, and any evidence not present
in those sheet bytes are forbidden. In particular, Test 4 is satisfied only by
the sheet's digest-owned `predicted_disagreements` records.

The digest identifies the exact machine input to this tension disposition; it
does not define the scope of human confirmation. Every byte revision requires
fresh disposition evidence on the new digest: independent verdicts on the
subject branch or a freshly derived canonical pair on the no-subject branch.
Whether a prior human confirmation carries is owned by the router's
deterministic material-strategy equivalence rule, not by this gate.

## No-subject disposition

After readiness reports the exact `SHEET_SHA256`, a no-subject sheet emits two
deterministic gate-slot records with `verdict: "pass"` and that same digest:

```text
check-tension:no-subject:checker:<sheet_sha256>
check-tension:no-subject:reviewer:<sheet_sha256>
```

These handles preserve the two-slot evidence shape but are **not independent
judgments**. The checker and reviewer are not spawned, no model result is
invented, and explicit human confirmation remains mandatory. The registrar
recomputes the subject-group predicate from the exact sheet: a no-subject sheet
accepts only this canonical pair, while a subject-group sheet rejects the
reserved prefix and still requires two real independent PASS receipts.

## The two agents (subject branch only, independent)

Both read the **proposed sheet** — the `groups`, each agent's `role` and
`angle`, each group's `anti_bias`, and `predicted_disagreements` (field
meanings owned by `register-dispatch`) — and judge it against the rubric below.
Read-only: neither writes to the source tree.

| agent                   | does                                                                                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **checker** («aponta»)  | applies tests 1–5 to every subject group; returns `PASS`, or per-pair / per-group apontamentos naming the exact failing test + a concrete fix                                                                    |
| **reviewer** («revisa») | forms and freezes its **own** verdict on the same sheet; only afterward, when apontamentos exist, compares that frozen verdict with the checker's frozen report — guards against both laxity and over-strictness |

Use two phases:

1. **Independent verdicts.** Spawn both in one message (parallel) as two
   distinct agents. Neither receives the other's work. Preserve each verdict,
   evidence handle, and sheet digest before proceeding.
2. **Comparison when needed.** If either verdict contains apontamentos, give
   the frozen checker report to the reviewer and ask it to mark agree or
   disagree for each item. This comparison may not change or replace the
   reviewer's independent verdict.

As gate infrastructure the agents carry no agent-pool identity and write
nothing to it.

Each **apontamento** is structured, not prose, so the strategist can act on it mechanically:

- **target** — the failing subject group (and the unordered pair, for tests 2 / 4).
- **test** — which test fired (1 / 2 / 3 / 4 / 5).
- **fix** — one concrete revision (e.g. "re-axis a_j from precedent-attack to
  definitional-attack").

The checker returns `PASS` or a list of apontamentos. The reviewer returns its **own**
`PASS`/list plus an agree/disagree flag on each of the checker's apontamentos.

## The rubric — the four tension tests + cross-group coherence

The axis vocabulary (closed — test 1 checks `anti_bias` against it):

- **methodology** — empirical / formal / adversarial / historical / computational
- **source-corpus** — e.g. arXiv-categorical / physics-journals / dissent-literature / textbook-canon / backward-citation-tree
- **attack-vector** (skeptics only) — precedent / vacuity / definitional / scope / counter-example
- **temporal-prior** — modern-only / historical-lineage / mixed-with-decade-bins

Per subject group — REJECT if any fires:

- **Test 1 — axis.** `anti_bias` names one canonical axis above, or an explicitly declared composite of them. Outside the vocabulary → REJECT.
- **Test 2 — clone.** No two `angle`s share the same core noun phrase — tokenize, drop
  stopwords, and the pair must yield ≥ 2 distinct primary verbs _or_ nouns → else REJECT.
- **Test 3 — spread.** Explorer groups: ≥ 2 distinct approaches across the
  angles; all sharing one methodology _or_ one corpus → REJECT. Skeptic or
  auditor groups: no two evaluators share an attack-vector (precedent + vacuity
  - definitional = three; three "find problems" = one) → else REJECT. Mixed
    groups apply both rules to their corresponding role subsets.
- **Test 4 — evidence.** Every unordered pair carries its predicted-disagreement sentence
  in the sheet's `predicted_disagreements`
  ("a_i runs X, a_j runs Y on the [axis] axis; a bias in a_i would be exposed by a_j") →
  else REJECT. Writing this per pair is what forces real tension instead of asserting it.

Once per sheet (not per group):

- **Test 5 — global coherence.** When ≥ 2 groups have `n ≥ 2`, each subject group's
  `anti_bias` must be a plausible **specialization** of the sheet's `anti_bias_global` theme,
  not an unrelated axis → else REJECT. (Uncoordinated axes across groups drift.)

A group passing tests 1–4, and a sheet passing test 5, PASSES — no residual judgment beyond
the evidence sentences.

> **This gate is only the _tension_ half of Principle 5.** The _partition_ half — angles
> non-overlapping AND covering the goal — is checked earlier by the
> `domainspec-subagents-strategy` chain. A sheet must pass both; partition first, then this
> gate.

## Outcome — only "both PASS" goes forward

- **Both independent verdicts PASS** → the sheet proceeds to the human
  **Confirm**.
- **Either agent reproves** → return to the strategist with the consolidated apontamentos;
  revise and re-run the gate.
- **The two disagree** (one passes, one reproves; or they contradict on a point) → **also
  return to the strategist.** Ambiguity is not good enough — the strategist revises until both
  pass cleanly. The human never adjudicates the gate.
