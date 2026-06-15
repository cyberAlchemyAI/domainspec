---
stage: s2-define
owner: invoke-define
status: pass
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
inputs:
  - stages/01-context-pack.md
---

# Define: Mutation Execution Mechanics

This stage takes the grounded s1 baseline and turns it into a **precise problem
definition** plus **three crisp, comparable approach definitions** (A / B / C). It
fixes vocabulary so that the downstream decision stage compares like-for-like. It
**does not decide**. Where a term is a constraint supplied as refine governance context
(decision/invariant IDs not committed as docs in this module), it is labeled
`[governance context]`, consistent with s1.

---

## 1. The Problem, Defined Precisely

### 1.1 Problem statement

> Given an **approved, non-stale `MutationBatch`** (a deterministic, checksum-bound set of
> `MutationTask` descriptions) and the **current prototype HTML** at the head revision's
> `htmlArtifactRef`, **produce the next revision's prototype HTML** that realizes every
> applied task's `intent`, **and record an honest account of what changed**, such that the
> resulting revision is appended to the manifest as exactly one entry — **without violating
> any of the governance invariants** in §3.

Stated as a function the chosen engine must implement:

```
apply(approvedBatch, currentHtml, sessionContext)
  ->  nextHtml: HtmlArtifact          # the produced revision HTML (NEW output, absent today)
      diffSummary: DiffSummary'       # honest account of change (today: counts-only, dishonest re: real edits)
      provenance: ExecutionProvenance # how nextHtml was produced (NEW, needed for replay/audit)
```

### 1.2 Why this is a real gap (grounded)

Today `applyApprovedBatch` is **pure bookkeeping** (s1 §1): it runs gates, allocates a
revision id, marks the batch `applied`, computes `unresolvedCommentIds`, appends **one**
`RevisionManifestEntry`, and flips session state to `RevisionRecorded`. **No prototype HTML
is read, transformed, generated, or written.** `htmlArtifactRef` is never touched. The
`MutationTask` fields are consumed **only** to compute counts (`buildDiffSummary`) and to
populate `appliedTaskIds`. So the "execution" of a mutation — the part that actually changes
what the prototype looks like — is **unspecified**. That unspecified step is this refine's
entire subject.

### 1.3 Scope boundary (what is and isn't in this problem)

**In scope:** the mechanics by which a `MutationTask` description becomes a concrete edit of
the prototype HTML file, the shape of the honest change record, the engine contract per
approach, and the schema/seam consequences each approach implies.

**Out of scope (already settled or owned elsewhere):** the gate logic (auto-apply forbidden,
approval, baseline, staleness, one-entry post-check) — these are enforced in the core today
and must be **honored**, not redesigned; the synthesis step (`synthesize-mutation-batch.ts`)
which is already deterministic; and the choice of runtime (Claude Code-native is a
`[governance context]` constraint, not a decision this refine reopens).

---

## 2. Vocabulary (fixed for all approaches)

These definitions are binding for the decision stage so A/B/C are compared on identical terms.

### 2.1 "apply" — what it must produce

`apply` is the act of turning an approved batch into the next revision. By the end of a
successful `apply`, **three things must exist** (today only the third, in degraded form,
exists):

1. **Next-revision HTML (`nextHtml`)** — a concrete HTML artifact at a path of the form
   `/artifacts/ui-prototyping-studio/<sessionId>/<label>.html` (the existing
   `htmlArtifactRef` shape, s1 §4), representing the prototype **after** the batch's tasks
   are realized. This output **does not exist today** and is the core deliverable of any
   chosen approach.
2. **An honest `DiffSummary`** — see §2.2. "Honest" means it reflects the **actual textual
   delta** between `currentHtml` and `nextHtml`, not a tally inferred from task `changeType`
   strings before any HTML existed.
3. **A revision record** — exactly one appended `RevisionManifestEntry` (the existing audit
   contract), which under any approach **must gain a verifiable pointer to `nextHtml`** (an
   `htmlArtifactRef` + content hash on the entry) so the revision is replayable/auditable.
   Today the entry has **no** HTML pointer (s1 §2), making "this revision produced that HTML"
   unprovable.

### 2.2 "honest DiffSummary"

| Term                        | Definition                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`DiffSummary` (today)**   | `{added, changed, removed}` **counts**, tallied from each task's `changeType` substring inference. It describes the _intent set_, not the _result_. It can claim "1 changed" even if the HTML never changed, because no HTML is produced. **Dishonest by construction** for the "saw-the-diff" purpose.                                                                                                      |
| **`DiffSummary'` (target)** | A change record computed **from the real before/after HTML** (`currentHtml` → `nextHtml`). At minimum it preserves the `{added, changed, removed}` shape but derives the numbers from an actual structural/textual diff. To satisfy "saw-the-diff" ergonomics (§3, OQ-2) it should also carry, or point to, a **human-viewable diff** (e.g. per-`data-od-id` before/after fragments or a diff artifact ref). |

The honesty bar: **a `DiffSummary'` claim is only valid if it is derivable from `currentHtml`
and `nextHtml`.** No approach may report change it cannot demonstrate against produced HTML.

### 2.3 "deterministic validator"

A **deterministic validator** is a pure function in the **orchestration core** (no LLM, no
network, no clock) that takes `(currentHtml, candidateHtml, task | batch)` and returns
`pass | fail(reason)` such that **the same inputs always yield the same verdict**. It does
not _produce_ HTML; it _judges_ whether a produced candidate honors the contract. Candidate
validator checks (the menu the decision stage will draw from):

- **Target-changed** — the element addressed by the task's anchor (selector and/or
  `data-od-id`) actually differs between `currentHtml` and `candidateHtml`.
- **Anchor-preserved** — every `data-od-id` present in `currentHtml` is still present in
  `candidateHtml` (no atomic id silently dropped/renumbered). `[governance context:
DEC-ATOMIC-IDS-014]`
- **Scope-bounded** — no out-of-scope elements changed (only anchors named by the batch's
  tasks, plus permissible structural side-effects, differ).
- **Acceptance-satisfied** — the task's `acceptanceText` condition is met, to the extent it
  is machine-checkable.
- **Well-formed / escaped** — `candidateHtml` parses and text content is properly escaped
  (no injection, no broken markup).
- **Intent-not-reinterpreted** — the change is a realization of `intent`, not a substitution
  (this is the hardest to make fully deterministic and is the crux of B vs C).

A validator is **necessary** for approach C, **impossible to fully satisfy** for approach B
(nothing to validate against a contract because the engine _is_ the contract), and **trivially
satisfied** for approach A (the deterministic transformer _is_ the producer, so a separate
validator is largely redundant with the patch spec).

### 2.4 "engine contract"

The **engine contract** is the precise interface and guarantee set the mutation engine must
satisfy, **per approach**. It answers: _what does the engine receive, what must it emit, what
may it assume, and what is it forbidden to do?_ Defined for A/B/C in §4. The engine always
lives behind the **`studio` CLI seam** `[governance context: DEC-CLI-NOT-MCP-012]`; the
orchestration core stays pure and consumes the engine's output (s1 §4).

### 2.5 Other fixed terms

| Term                       | Definition                                                                                                                                                                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **anchor**                 | The way a task addresses _where_ in the HTML to act. Two candidates: the fragile **CSS `selector`** (all the engine gets today) and the stable **`data-od-id`** atomic id (captured at comment time but **dropped at synthesis**, s1 §5). "Anchor stability" = the address still resolves after the edit. |
| **change params**          | Machine-applicable, typed instructions for an edit (e.g. set-attribute, replace-text, insert-node). **Absent from `MutationTask` today** — `MutationTask` carries only free-text `intent` + a bare-string `changeType`. Approach A requires inventing these; B/C do not.                                  |
| **ExecutionProvenance**    | A record of _how_ `nextHtml` was produced, sufficient to reproduce or audit it (e.g. patch ops for A; model/prompt/seed/validator-verdicts for C; model/prompt for B). New concept; needed because §2.1(3)'s replayability is otherwise unprovable.                                                       |
| **realize vs reinterpret** | `[governance context]` "Intent is sacred." To **realize** intent = produce the edit the comment asked for. To **reinterpret** = substitute the engine's own judgment for the author's intent. The engine may realize; it must not reinterpret.                                                            |

---

## 3. Governance Invariants (constraints every approach inherits)

Restated from s1 §6 as **hard constraints** the chosen mechanics must not break. Code-enforced
ones are non-negotiable; `[governance context]` ones are honored as design constraints.

| #   | Invariant                                        | Source                                                                   | Binding on execution mechanics                                                                                                                       |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | Auto-apply forbidden                             | code (`AUTO_APPLY_FORBIDDEN`)                                            | Engine may never run/commit without a human-attributed actor.                                                                                        |
| G2  | Approval before apply                            | code (`BATCH_APPROVAL_REQUIRED`)                                         | Engine runs only on an `approved` batch.                                                                                                             |
| G3  | Baseline gate                                    | code (`BASELINE_GATE_UNSATISFIED`)                                       | Execution presupposes a satisfied baseline.                                                                                                          |
| G4  | Staleness guard                                  | code (`BATCH_STALE_FOR_HEAD`)                                            | Engine edits the HTML of the **current head's** source revision, not a stale one.                                                                    |
| G5  | Append-only, exactly one entry per apply         | code (`VARIANT_GENERATION_COUNT_MISMATCH`)                               | However HTML is produced, apply still records **exactly one** revision.                                                                              |
| G6  | Determinism / reproducibility of the chain       | checksum (synthesis) `[governance context]`                              | The audit chain from comments → batch → revision must remain reproducible/verifiable. Execution is the only place non-determinism can enter (s1 §3). |
| G7  | Intent is sacred                                 | `[governance context]`                                                   | Engine **realizes**, never **reinterprets**, `intent`.                                                                                               |
| G8  | Ergonomics-first / "saw-the-diff" (OQ-2)         | `[governance context]`                                                   | The human approving/applying must see a **real** before/after diff, which today is impossible (counts-only).                                         |
| G9  | Claude Code-native runtime, CLI is the only seam | `[governance context: DEC-RUNTIME-CLAUDE-CODE-011, DEC-CLI-NOT-MCP-012]` | Any agentic generation lives **outside** the pure core, behind the `studio` CLI; the core consumes/validates output.                                 |

**Two cross-cutting schema gaps (from s1, true regardless of A/B/C):**

- **GAP-1 (anchor):** `data-od-id` must be threaded into `MutationTask` (a schema change) or
  no approach can satisfy anchor stability — the engine would receive only a fragile selector.
- **GAP-2 (replay pointer):** `RevisionManifestEntry` needs a verifiable pointer to the
  produced HTML, or §2.1(3) replayability and G8 "saw-the-diff" are unattainable.

These are **prerequisites**, not differentiators — every approach pays them.

---

## 4. The Three Approaches, Defined as Comparable Contracts

Each approach is defined on the **same axes**: _where the edit decision is made_, _the engine
contract_ (input / output / forbidden), _what carries determinism_, _schema deltas beyond
GAP-1/GAP-2_, and _the validator's role_.

### 4.1 Approach A — Deterministic Patch

**One-line definition:** Synthesis fully specifies a typed, machine-applicable edit; a pure
deterministic transformer in (or adjacent to) the core applies it to the HTML. **No LLM in
the apply path.**

| Axis                               | Definition                                                                                                                                                                                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Where the edit is decided**      | At **synthesis time**, deterministically. `MutationTask` must become a complete edit spec.                                                                                                                                                                                            |
| **Engine**                         | A pure function `applyPatch(currentHtml, MutationTask[]) -> nextHtml`. No network, no clock, no model.                                                                                                                                                                                |
| **Input**                          | `currentHtml` + tasks carrying **typed change params** (set-attr/replace-text/insert/remove with concrete values), addressed by `data-od-id`.                                                                                                                                         |
| **Output**                         | `nextHtml` + `DiffSummary'` derived exactly from the applied ops (the ops _are_ the diff).                                                                                                                                                                                            |
| **Forbidden**                      | Inferring missing edit detail at apply time; any non-determinism.                                                                                                                                                                                                                     |
| **Determinism carried by**         | The patch ops themselves — fully content-addressable, replayable, checksummable.                                                                                                                                                                                                      |
| **Schema deltas (beyond GAP-1/2)** | `changeType: string` → a **typed, param-bearing union**; `MutationTask` gains structured `changeParams`. Synthesis must be upgraded to _emit_ complete patches — today it only infers `add/remove/change` from intent substrings (s1 §3), which is **far short** of a full edit spec. |
| **Validator role**                 | Largely redundant — the producer is already deterministic and contract-bound. A well-formedness check may still run.                                                                                                                                                                  |
| **Native-runtime fit**             | Does **not** use Claude Code for generation at all; the hard problem (turning fuzzy `intent` into a precise patch) is pushed entirely onto synthesis.                                                                                                                                 |

### 4.2 Approach B — Agentic Regeneration

**One-line definition:** Claude Code reads the tasks (`intent`, `acceptanceText`) plus the
current HTML and **emits the next HTML directly**. The model _is_ the engine.

| Axis                               | Definition                                                                                                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Where the edit is decided**      | At **apply time**, by the model, behind the CLI seam.                                                                                                          |
| **Engine**                         | Claude Code-native generation: `generate(currentHtml, tasks) -> nextHtml`.                                                                                     |
| **Input**                          | `currentHtml` + tasks as-is (free-text `intent` + `acceptanceText`), anchors as available.                                                                     |
| **Output**                         | `nextHtml`; `DiffSummary'` computed afterward by diffing produced HTML against current.                                                                        |
| **Forbidden**                      | `[governance context]` reinterpreting intent (G7) — but **no deterministic mechanism enforces this**; it is a soft constraint on the model.                    |
| **Determinism carried by**         | **Nothing in the apply path.** Generation is non-deterministic; the checksum-grade audit chain (G6) is broken at execution.                                    |
| **Schema deltas (beyond GAP-1/2)** | Minimal — `MutationTask` need not gain change params. But `ExecutionProvenance` (model/prompt) must be recorded to make the revision even nominally auditable. |
| **Validator role**                 | None structurally — there is no contract the output is checked against; the engine's output _is_ the revision.                                                 |
| **Native-runtime fit**             | **Maximal** — uses Claude Code where it is strong (handling fuzzy/structural intent) directly.                                                                 |

### 4.3 Approach C — Hybrid (Agentic-Propose + Deterministic-Validate)

**One-line definition:** Claude Code **proposes** mutated HTML (native, expressive); then
**deterministic validators in the pure core** (§2.3) check the proposal honors the
`MutationTask` contract before it is allowed to become a revision. Propose and
validate/record are **separate owner lanes**.

| Axis                               | Definition                                                                                                                                                                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **Where the edit is decided**      | **Proposed** at apply time by the model (behind the CLI seam); **admitted** only by the deterministic core.                                                                                               |
| **Engine**                         | Two-part: `propose(currentHtml, tasks) -> candidateHtml` (Claude Code, post-seam) **then** `validate(currentHtml, candidateHtml, batch) -> pass                                                           | fail` (pure core). |
| **Input**                          | `currentHtml` + tasks (intent/acceptance/anchor) to the proposer; `(currentHtml, candidateHtml, batch)` to the validator.                                                                                 |
| **Output**                         | `nextHtml` (= `candidateHtml` iff it passes); `DiffSummary'` from real before/after; `ExecutionProvenance` incl. validator verdicts.                                                                      |
| **Forbidden**                      | Admitting a candidate that fails any validator; the core vouching for unvalidated output.                                                                                                                 |
| **Determinism carried by**         | The **validator suite** (deterministic admission), not the proposer. The _decision to accept_ is reproducible even though the proposal is not. Re-running a failed apply re-proposes; admission is gated. |
| **Schema deltas (beyond GAP-1/2)** | `MutationTask`/batch must carry enough **machine-checkable acceptance** for the validator to judge (more than B, less than A's full patch spec). `ExecutionProvenance` records verdicts.                  |
| **Validator role**                 | **Central and load-bearing** — see §2.3. C is only as strong as its validator suite.                                                                                                                      |
| **Native-runtime fit**             | Uses Claude Code for generation **and** keeps deterministic gating in the core — matches the existing "core owns gates + determinism, CLI is the seam" topology (s1 §4, §7).                              |

### 4.4 Comparison at a glance

| Axis                             | A — Det. Patch                              | B — Agentic Regen        | C — Hybrid                                             |
| -------------------------------- | ------------------------------------------- | ------------------------ | ------------------------------------------------------ |
| LLM in apply path                | No                                          | Yes (is the engine)      | Yes (proposer only)                                    |
| Where determinism lives          | Patch ops                                   | Nowhere                  | Validator suite                                        |
| `MutationTask` schema burden     | Heaviest (full change params + typed union) | Lightest                 | Medium (machine-checkable acceptance)                  |
| Audit chain (G6)                 | Strongest                                   | Broken                   | Restored at the admission boundary                     |
| Change expressiveness            | Limited to what synthesis can spec          | Highest                  | High (model proposes) bounded by what validators admit |
| Intent realization (G7)          | Mechanical (may underfit fuzzy intent)      | Soft/unenforced          | Soft-proposed, hard-bounded by validators              |
| Needs a validator suite          | No (redundant)                              | No (nothing to validate) | **Yes (load-bearing)**                                 |
| GAP-1 (od-id) / GAP-2 (html ptr) | Both required                               | Both required            | Both required                                          |

---

## 5. Decision Criteria (named, for the decision stage)

The decision stage must score A/B/C against these. Carried from s1 §8, sharpened into
yes/measurable questions. Listed as Pareto criteria (no single one is a tiebreaker by fiat).

| #       | Criterion                                 | The question it answers                                                                                                     | Why it matters                                                                                                                                           |
| ------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DC1** | **Auditability / determinism**            | Can the revision chain be reproduced and verified (G6)?                                                                     | The whole governance posture (gates, checksums) is built on a reproducible chain; execution must not silently break it.                                  |
| **DC2** | **Change expressiveness**                 | Can it realize fuzzy and structural intent, not just pre-typed ops?                                                         | Comments are free-text; an engine that can only apply a fixed op vocabulary underfits real review feedback.                                              |
| **DC3** | **Claude Code-native fit**                | Does it use the runtime where it is strong (generation) and the core where it is strong (gating), behind the CLI seam (G9)? | This is a committed runtime constraint; an approach that fights it is structurally misplaced.                                                            |
| **DC4** | **`data-od-id` stability**                | Is the atomic anchor preserved and tracked across the mutation (G7 anchor, GAP-1)?                                          | The selector is fragile by design; od-id is the durable address. Losing it means we can't reliably say _what_ changed _where_.                           |
| **DC5** | **"Saw-the-diff" ergonomics (G8 / OQ-2)** | Can the approving human see a **real** before/after diff, not counts?                                                       | The apply gate's legitimacy depends on the human actually seeing the change; counts-only is the current dishonesty. Requires real produced HTML + GAP-2. |

### 5.1 Central tension (named for the decision)

Determinism/auditability (DC1, DC4) **pulls toward A**; expressiveness + native generation
(DC2, DC3, DC5) **pulls toward B**; **C is the explicit attempt at the Pareto frontier** —
keep generation in the native runtime (DC2/DC3/DC5) while restoring deterministic _admission_
(DC1) via a validator suite — **at the cost of** having to build and trust that suite, and of
making acceptance machine-checkable. The decision stage's real question is: **is C's validator
suite buildable and trustworthy enough to be worth its cost, or does the team accept A's
expressiveness ceiling / B's broken audit chain?**

---

## 6. Residue / handoff to the decision stage

- **Prerequisites, not differentiators:** GAP-1 (thread `data-od-id` into `MutationTask`) and
  GAP-2 (HTML pointer + hash on `RevisionManifestEntry`) are paid under **every** approach.
  The decision should land these as schema changes regardless of A/B/C.
- **The pivotal unknown is DC1×DC2 reconciliation via C's validator** — specifically whether
  the §2.3 checks (especially _intent-not-reinterpreted_ and _scope-bounded_) can be made
  deterministic and strong enough. The decision/design stage should stress-test the validator
  suite before committing to C.
- **`ExecutionProvenance` is a new concept** introduced here to make §2.1(3) replayability
  expressible; the decision stage should confirm its shape per chosen approach.
- **Governance IDs remain grep-negative in this module** (DEC-RUNTIME-CLAUDE-CODE-011,
  DEC-CLI-NOT-MCP-012, DEC-ATOMIC-IDS-014, INV-\*, OQ-2). They are honored as constraints; a
  downstream stage may want to land them as citable decision/invariant artifacts.
- **No decision is made here.** This stage only fixes the problem, the vocabulary, the three
  contracts, and the five criteria so the decision stage compares like-for-like.
