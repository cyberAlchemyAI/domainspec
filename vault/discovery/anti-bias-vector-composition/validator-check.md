---
tags: [vault, discovery, multi-agent, validator, subagents-strategy, anti-bias, spec-lifecycle]
node_type: discovery
is_session: false
layer: ontology, application
nature: procedural
status: active
version: 0.2.0
last_updated: 2026-06-15
---

# Anti-Bias Vector Composition — Validator Check

> Operational rules that enforce **Principle 5 (pairwise tension)** of the subagents-strategy
> constitution (v0.5.2). They run at the **confirm gate** over the dispatch sheet — the
> dispatch row's `groups` JSON column — *before* the dispatch is registered, and again
> post-dispatch over the returned artifacts. This check is the **semantics owner** the
> constitution's four-test rule (`proposal.md` §P5, lines 124–129) points at; it is
> **additional** to the partition check ("angles non-overlapping AND covering" — see
> §Relationship to the partition check below).

> **v0.2.0 realignment note.** This file previously spoke the pre-v0.5.2 schema
> (`dispatch.yaml`, a `composition` block of **layers**, the retired `theorem-research`
> skill). v0.2.0 rewrites it to the v0.5.2 vocabulary: **`groups`** (not layers), group
> `role ∈ {investigate, evaluate, synthesize, meta-evaluate}`, agent
> `role ∈ {explorer, skeptic, writer, auditor}`, the per-group **`anti_bias`** axis, the
> per-agent **`angle`**, and the dispatch-wide **`anti_bias_global`**. Siblings
> `examples.md` and `literature.md` still carry old-schema worked shapes — pending the same
> pass. `principle.md` is realigned alongside this file.

---

## Where the check lives (enforcement split)

Principle 5 has two halves, enforced in two different places — do not conflate them:

| Half | What | Enforced by | Failure mode |
|------|------|-------------|--------------|
| **Presence conditionals** | group `anti_bias` is present at `n ≥ 2`; `anti_bias_global` is present when ≥ 2 groups have `n ≥ 2` | **appender** (`append-dispatch.cjs`), mechanically, **exit 2** | record rejected at registration |
| **Tests 1–4** (axis / clone / spread / evidence) | the substance — is the axis real, are the angles distinct, is genuine disagreement pre-registered | **the confirm gate** (router P5), by the strategist + human; **not executable** today | sheet sent back for revision |
| **Tension realization** (post-dispatch) | did the predicted disagreements actually appear in the returns | **post-dispatch check** over `working_folder` + the `Dissent:` lines / claim-IDs | dispatch flagged INVALID → re-run, owner-gated |

The appender guarantees the **fields exist**; it does not judge whether they are *meaningful*.
That judgment is tests 1–4 (gate) and tension realization (post-dispatch). This file owns
the latter two.

---

## When the check runs

Two points in the dispatch lifecycle (constitution §3):

1. **Pre-dispatch (strict), at the confirm gate.** After the strategist authors the sheet and
   before the human's affirmative / before the dispatch row is appended. Failure blocks the
   dispatch — the sheet must be revised and re-gated (P2).
2. **Post-dispatch (strict-on-realization), before the `final_approver` accepts.** After all
   agents return, before synthesis is accepted and the close row is appended. A predicted
   disagreement that did not realize is not advisory — it makes the dispatch INVALID for the
   purpose of anti-bias (see Tension realization below).

---

## Pre-dispatch checklist (the four tests)

The validator runs the following over each **subject group**. A sheet is rejected if any
**R** test fires; the **G** tests must pass for the sheet to be accepted. These are the
operational form of the constitution's tests 1–4 (`proposal.md:124-129`).

### Step 1. Identify subject groups

**Item 1.** Parse the sheet's `groups` array. A **subject group** is any group with
`n ≥ 2` whose group `role ∈ {investigate, evaluate}` (its agents are `explorer`s or
`skeptic`s). Groups with `role ∈ {synthesize, meta-evaluate}` are out of scope (single-agent
by construction / single-check). Groups with `n == 1` are out of scope (no pair to tension).

**Item 2.** For each subject group, read the per-agent **`angle`** and the group **`anti_bias`**.
A subject group missing `anti_bias`, or any agent missing `angle`, fails here — but note this
is *also* the appender's presence conditional (exit 2), so a well-formed sheet never reaches
the gate with these absent. The gate's job starts at Item 3.

### Step 2. Classify the axis

**Item 3.** The group `anti_bias` names the tension axis; each `angle` is a position on it.
The four canonical axes (constitution closed vocabulary):

- **Methodology** — empirical / formal / adversarial / historical / computational.
- **Source-corpus** — e.g. arXiv-categorical / physics-journals / dissent-or-critical-literature / textbook-canon / backward-citation-tree.
- **Attack-vector** (skeptics) — precedent-attack / vacuity-attack / definitional-attack / scope-attack / counter-example-attack.
- **Temporal-prior** — modern-only / historical-lineage / mixed-with-decade-bins.

### Step 3. Red-flag tests (R — reject if fired)

**Item 4. Axis test (constitution test 1).** The group `anti_bias` must name one of the four
canonical axes, or an **explicitly declared composite** of them. Anything outside this
vocabulary → REJECT. (Closure governs per-group `anti_bias` only — `anti_bias_global` is
free-text and is never vocabulary-checked.)

**Item 5. Clone test (constitution test 2).** Any two `angle`s in the group share the same
core noun phrase → REJECT. Specific check: tokenize the angle strings, drop stopwords, and
verify the remaining content words yield at least two distinct primary verbs *or* nouns
across the pair. The angles are not differentiated along any load-bearing axis.

**Item 6. Spread test (constitution test 3).**
- In an `investigate` group: if all agents share one methodology, *or* all share one source
  corpus → REJECT. A pass requires at least two distinct axes represented across the group's
  angles. (Corpus monoculture defeats an explorer group; the corpus *is* its bias source.)
- In an `evaluate` group: any two skeptics share the same attack-vector gate → REJECT. Three
  "find problems with the argument" agents are one attack vector; precedent + vacuity +
  definitional are three.

### Step 4. Green-light tests (G — must pass)

**Item 7. Evidence test (constitution test 4) — pairwise predicted disagreement.** For every
unordered pair `(a_i, a_j)` in a subject group, the sheet must carry a written sentence of the
form: *"a_i runs [value_i], a_j runs [value_j] on the [axis] axis; a bias internal to a_i
along this axis would be exposed by a_j."* Any pair missing its sentence → REJECT. These
sentences are the **pre-registration** that the post-dispatch check measures against — they
are not decoration; they are the prediction that makes disagreement falsifiable.

**Item 8. `anti_bias_global` coherence.** When ≥ 2 groups have `n ≥ 2`, the sheet carries a
dispatch-wide `anti_bias_global` theme (appender-enforced presence). The gate additionally
checks that each subject group's `anti_bias` axis is a plausible **specialization** of that
theme, not an unrelated axis — uncoordinated axes across groups drift (constitution §5).

A sheet that passes Items 4–8 PASSES — no residual judgment call beyond the sentences.

---

## Post-dispatch checklist — tension realization (how we check disagreement was *genuine*)

Pre-registration (Item 7) states where the agents *should* disagree. This section checks they
*did* — the only enforceable proxy for genuine disagreement. The guarantee is procedural and
ex-post, not epistemic: a dispatch whose predicted disagreements did not realize is treated as
**INVALID for anti-bias** (a failure to exercise the design), **never** as "consensus =
truth".

**Item 9. Tension-realization check (per pair).** For each pair `(a_i, a_j)` whose Item-7
sentence was accepted, the pair is **realized** iff at least one of:
- a_i's or a_j's **`Dissent:`** line cites a specific **claim-ID** of the other and
  contradicts it (the `Dissent:` line and claim-IDs are the I/O contract from the
  `agents-input-output` discovery — this is what makes the check mechanizable), **or**
- the two returns contain a contradictory claim-pair on the **declared axis** (not on an
  incidental point).

A pair that was pre-registered as tensioned and shows **no** axis-aligned realized
contradiction → fire the **unrealized-tension flag** for that pair.

**Item 10. False-consensus red flag.** If a subject group of size `n ≥ 3` returns with **zero**
`Dissent:` records and all findings reach the same conclusion, fire the false-consensus flag.
Unanimity is sometimes the truth — but a group that *promised* tension and exercised none
provides no load-bearing evidence of correctness. Treat as failure-to-tension, not success.

**Item 11. Escalation.** If Item 9 fires for ≥ 1 pair, or Item 10 fires, the dispatch is
**INVALID for anti-bias**. The `final_approver` must not close `resolved` on anti-bias
grounds; the owner gates a re-run (`max_loops`) with revised axes/angles. Repeated unrealized
tension across dispatches signals the axis taxonomy itself is misclassified — revise this
file's taxonomy, not just the sheet.

**Item 12. Honest ceiling (recorded, not a check).** Realized contradiction on the declared
axis is the strongest *mechanizable* proxy, not a proof of genuine disagreement: agents on the
same model can co-hallucinate agreement that survives Items 9–10. The residual mitigations are
(a) a human spot-check on a sample of "realized" pairs, and (b) `robot_talks` collapse
detection — when an attacker group runs `robot_talks: true`, the synthesizer receives each
agent's **initial AND final** positions (constitution P14); positions that collapse to
identical after agents see each other are a measurable consensus-collapse, distinct from
independent agreement. This ceiling is the same one the constitution records at `proposal.md:384`.

---

## Relationship to the partition check

The `domainspec-subagents-strategy` chain already checks two conditions on a group's angle set:

- **Non-overlapping.** No two agents investigate the same *concern*.
- **Covering.** Together the angles span the macro goal — no part is unaddressed.

These are **partition** conditions: *which subset of the goal each angle covers*. They do not
ask *which direction each angle points within its subset*. Tensioned-pairwise is strictly
stronger: a group can pass non-overlapping-and-covering and fail tension — four explorers
partitioning the goal into four disjoint sub-questions, each using the same arXiv-keyword
methodology. Clean partition, complete coverage, uncancelled bias term. The gate runs **both**:
partition first, then tension (this file). A sheet must pass both to be dispatched.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [principle.md](./principle.md) | `derives-from` | The principle this validator operationalizes. Tests R (Items 4–6) enforce its negative form; tests G (Items 7–8) its positive form; the post-dispatch section (Items 9–12) is its falsifiability discipline. |
| [literature.md](./literature.md) | `cites` | False-consensus (Item 10) is the Janis-groupthink failure mode; the dissent-realization check (Item 9) is the Kahneman-Klein adversarial-collaboration discipline. (Old-schema worked shapes pending realignment.) |
| [examples.md](./examples.md) | `instances` | Worked good/bad group shapes that exercise these tests. (Pending v0.5.2 realignment.) |
| `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` | `operationalized-by` ↔ | Constitution §P5 / lines 124–129 name this file as the semantics owner of the four-test rule; this file is the operational expansion. The constitution owns the enforcement split (appender vs gate). |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/` | `cites` | The `Dissent:` line + claim-ID I/O contract that makes the Item-9 tension-realization check mechanizable. |
