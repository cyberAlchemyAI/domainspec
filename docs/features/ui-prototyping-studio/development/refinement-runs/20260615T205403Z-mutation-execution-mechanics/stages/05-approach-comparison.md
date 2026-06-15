---
stage: s5-approach-comparison
owner: pareto-judge
status: pass
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
verdict: select-C-conditional
inputs:
  - stages/02-define.md
  - stages/03-refine-review.md
  - stages/04-research-decision.md
criteria:
  - auditability
  - expressiveness
  - cc_fit
  - odid_stability
  - ergonomics
---

# Approach Comparison: Mutation Execution Mechanics

This stage joins the three advocate cases (A deterministic typed-patch transformer, B agentic
regeneration, C hybrid propose-then-validate) and renders a Pareto verdict. It scores all
three on the five charge criteria, applies the s3 calibrations that level the comparison,
checks strict dominance, and lands a justified selection. **It does not rubber-stamp the
hybrid** — the dominance analysis below shows all three are non-dominated; C is selected on the
criteria-weighted total _and_ its resolution of the central tension, with explicit conditions
that, if they fail, demote it.

---

## 1. Scoring discipline (how these scores were calibrated)

The advocates self-scored. I re-scored independently and reconciled, applying the three s3
calibrations that exist precisely to stop the comparison from being rigged:

- **F3 (no inherited audit head start).** The existing `sha256` checksum binds the _input task
  set_ only (`{sourceRevisionId, generatedFromCommentIds, tasks}`) and `createdAt` is wall-clock
  non-deterministic. So **A does not inherit a clean output-audit chain** — every approach must
  _build_ output-reproducibility (GAP-2). Auditability is therefore scored on the _end-state_
  reproducibility each approach can reach, not on a chain A "keeps."
- **F4 / F7 (honest diff is a shared prerequisite).** Producing real `nextHtml` makes an honest
  `DiffSummary'` available to _any_ approach that generates HTML. So ergonomics (DC5) is scored
  on **diff fidelity + saw-the-diff _sequencing_**, not on the mere existence of a real diff.
- **F8 (cc_fit is topology, not LLM-usage).** `cc_fit` measures whether generation sits behind
  the `studio` CLI seam with the core staying pure — **not** "how much LLM does it use." This
  stops cc_fit from mechanically ranking B > C > A and double-counting expressiveness. Under the
  topology reading, A passes the seam test even though it under-uses the runtime.

Where my reconciled score diverges from the advocate self-score, the divergence and reason are
stated in §3.

---

## 2. Comparison table (1–5, higher is better; equal weight)

| Criterion          | What it rewards (post-s3 calibration)                                                                                         | **A — Det. patch** | **B — Agentic regen** | **C — Hybrid** |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------------- | -------------- |
| **auditability**   | Output-reproducibility of the recorded revision (replay-by-rerun > replay-by-verdict > replay-by-record); failure containment | **5**              | **2.5**               | **4**          |
| **expressiveness** | Realizes fuzzy + holistic + structural intent, not just a fixed op vocabulary                                                 | **2**              | **5**                 | **4**          |
| **cc_fit**         | _Topology_ fit (F8): generation behind CLI seam, core pure                                                                    | **2.5**            | **5**                 | **5**          |
| **odid_stability** | `data-od-id` preserved _and_ still addresses the right thing across the edit                                                  | **5**              | **3**                 | **4**          |
| **ergonomics**     | Diff _fidelity_ + saw-the-diff _sequencing_ (F4/F7) + authoring load                                                          | **3**              | **4**                 | **5**          |
| **Total (Σ/25)**   | equal-weight Pareto sum                                                                                                       | **17.5**           | **19.5**              | **22.0**       |

---

## 3. Per-criterion rationale and divergences from advocate self-scores

### auditability — A 5 · B 2.5 · C 4

- **A = 5 (advocate 5, agreed).** A is the _only_ approach with **replay-by-rerun**: a pure,
  total `applyPatch(currentHtml, ops)` re-run on the same inputs yields byte-identical
  `nextHtml`. Its `produce-then-persist` shape converts today's 4-write torn-state hazard into a
  compute boundary that fails closed (DC6). The F3 correction removes A's _unearned head start_
  but not its _earned end state_: A still reaches the strongest reproducibility because the ops
  are content-addressable and the transformer is pure.
- **B = 2.5 (advocate 2.5, agreed).** Honest floor. Generation is non-deterministic →
  **replay-by-record only** (verify `hash(stored) == provenance.outputHash`), never
  replay-by-rerun. G7 is a prompt instruction, not a gate; fail-open (hallucinated HTML can
  silently become head). Content-attested provenance lifts it above zero, but it is the lowest
  of the five honest scores.
- **C = 4 (advocate 4, agreed — explicitly NOT 5).** Determinism is relocated to **admission**:
  the _verdict_ is reproducible (replay-by-verdict) and fail-closed, but the _proposal_ is not,
  and C is only as strong as a validator suite whose buildability (`intent-not-reinterpreted`,
  `scope-bounded` made deterministic) is the run's pivotal unknown (s2 §6, s4 GAP-R1). 4, not 5,
  is the honest gap to A.

### expressiveness — A 2 · B 5 · C 4

- **A = 2 (agreed).** Hard ceiling at the `ChangeOp` union; "make this feel more modern" /
  "tighten the spacing" is unaddressable without expanding the schema or adding an LLM. Even
  `insertChild` smuggles raw markup, so the determinism guarantee only covers the non-insert
  fraction.
- **B = 5 (agreed).** Full-document context; fuzzy and cross-cutting intent realized natively.
  Owns the criterion outright.
- **C = 4 (agreed).** Model proposes (high), but the ceiling is **what the validators admit** —
  a legitimate-but-surprising edit can be false-rejected by `scope-bounded` if the side-effect
  allowance is tight. High, bounded.

### cc_fit — A 2.5 · B 5 · C 5 _(divergence on A)_

- **A = 2.5 (advocate self-scored 2 — I raised it).** Divergence and reason: under the **F8
  topology** reading, A satisfies the seam contract cleanly (pure core, CLI seam, no core
  violation — the advocate concedes "A passes DC3 cleanly" under s3's re-scope). The advocate's 2
  reflects "under-uses the runtime," which is the _old circular_ (LLM-usage) reading F8 expressly
  retired. I credit topology-pass at **2.5** while still marking the maximal under-use of the
  committed Claude Code-native runtime. This raise _helps A_ and is made deliberately so the
  verdict cannot be accused of suppressing A.
- **B = 5 (agreed).** Maximal native fit, generation behind the seam, core untouched.
- **C = 5 (agreed).** Generation behind the seam **plus** deterministic gating in the pure core
  is the exact existing "core owns gates + determinism, CLI is the seam" topology.

### odid_stability — A 5 · B 3 · C 4

- **A = 5 (agreed).** Per-task, static, pre-write conflict detection on same-`odId` ops; the ops
  _name_ the anchor, so "present and still addressing the right thing" holds by construction.
- **B = 3 (agreed).** Prompt-contract + post-hoc **set-check**. The set-check catches
  dropped/added od-ids but **not** an od-id that stayed present while its element was wrongly
  mutated or moved — "anchor preserved" is verified, "anchor still addresses the right thing" is
  not.
- **C = 4 (agreed).** anchor-preserved set-diff **+** `scope-bounded` tree-attribution catches
  the case B misses (a changed node with no owning task fails). Caveat: depends on robust tree
  parsing and **full GAP-1 coverage**; incomplete od-id threading weakens both scope attribution
  and the per-od-id diff.

### ergonomics — A 3 · B 4 · C 5 _(divergence on B)_

- **A = 3 (agreed).** Can compute the diff _at approval time_ (patch fully specified at
  synthesis → no preview-gate sequencing problem). But authoring **regresses**: the human must
  decide the full typed edit at annotation time, higher cognitive load than describing intent in
  prose.
- **B = 4 (advocate self-scored 4.5 — I trimmed it).** Divergence and reason: B produces the
  highest-fidelity real diff by construction, but the s3 **sequencing problem bites unmitigated**
  — approval happens _before_ HTML exists (approve-then-generate), and because re-proposing is
  non-idempotent, a retry can change the recorded output _after_ the human approved (the human
  saw a diff that is no longer the one recorded). Honoring saw-the-diff honestly requires a new
  preview/dry-run gate B does not yet have. The advocate's own §5 leans on the human gate while
  §7 concedes the seam break; 4 (not 4.5) prices the missing preview gate.
- **C = 5 (agreed).** Real per-od-id diff falls out of validation as a byproduct; the
  propose → validate → record shape **naturally hosts the preview gate** (the dormant
  `RevisionApplied` state, s3 §5) so the human sees the real diff _before_ it becomes head; prose
  authoring keeps load low. Strongest on the _full_ saw-the-diff mechanic including sequencing.

---

## 4. Dominance analysis (strict Pareto)

An approach is **dominated** iff another scores ≥ on every criterion and > on at least one.

| Test          | Blocking criterion                               | Dominated? |
| ------------- | ------------------------------------------------ | ---------- |
| C dominate A? | auditability C4 < A5 (also odid C4 < A5)         | **No**     |
| A dominate C? | expressiveness A2 < C4                           | **No**     |
| C dominate B? | expressiveness C4 < B5                           | **No**     |
| B dominate C? | auditability B2.5 < C4 (also odid, ergonomics)   | **No**     |
| B dominate A? | auditability B2.5 < A5 (also odid B3 < A5)       | **No**     |
| A dominate B? | expressiveness A2 < B5 (also cc_fit, ergonomics) | **No**     |

**Finding: no approach is strictly dominated. All three lie on the Pareto frontier.**

- **A** is the sole frontier point on **auditability (5)** and **odid_stability (5)** — it cannot
  be eliminated; anyone who values bit-exact output-reproducibility above all else rationally
  picks A.
- **B** is the sole frontier point on **expressiveness (5)** — it cannot be eliminated; a
  pure-prototype, human-gated, speed-first posture rationally picks B.
- **C** is never best-in-class on auditability, expressiveness, or odid, but is **never worst on
  any criterion** and is tied-best on cc_fit and best on ergonomics.

So **strict dominance eliminates nothing.** Elimination here is therefore _not_ by Pareto
dominance (none exists) but by the criteria-weighted total under the equal-weight Pareto posture
the define stage fixed (s2 §5: "no single one is a tiebreaker by fiat") **plus** the qualitative
resolution of the named central tension. That is the honest basis for the verdict — recorded
explicitly so it is not mistaken for a dominance claim.

---

## 5. Verdict

**Select Approach C (Hybrid: agentic-propose + deterministic-validate), conditionally.**

### Why C, justified by the scores (not by fiat)

1. **Highest criteria-weighted total (22.0 vs B 19.5 vs A 17.5)** under equal weights — the
   posture the define stage mandated.
2. **It is the only approach with no low outlier.** A's expressiveness (2) and cc_fit (2.5) are
   structural floors it cannot raise without becoming B ("B with extra steps", the s3-F5 fork).
   B's auditability (2.5) is the lowest score in the whole matrix and is _irreducible_ (generation
   is non-deterministic by construction). C's lowest scores (auditability 4, expressiveness 4,
   odid 4) are all in the "high" band — C trades _peaks_ for the **absence of a floor**, which is
   exactly the right shape when the central tension is "don't force a false trade between
   auditability and expressiveness."
3. **It resolves the central tension (s2 §5.1) structurally, not by splitting the difference.**
   C keeps generation in the runtime that is strong at it (expressiveness, cc_fit) and _recovers_
   determinism at the **admission boundary** (auditability) — converting "did it honor intent?"
   into machine-checkable acceptance predicates + tree-attributed scope diffing. It is the only
   approach that hosts an honest **preview gate** (best ergonomics) on its native propose →
   validate → record shape.
4. **It dominates A and B on the merged objective even though it dominates neither point-wise:**
   vs **A**, C recovers most of A's determinism (replay-by-verdict, fail-closed) without A's
   expressiveness ceiling or the unbuildable-without-LLM patch-synthesizer fork; vs **B**, C
   keeps B's generative strength and closes the audit hole and the fail-open risk B structurally
   cannot.

### This is not a rubber stamp — the honest crux

C's auditability is **4, not 5**, and that gap is real: C is only as strong as its validator
suite, and the pivotal unknowns (`intent-not-reinterpreted` and `scope-bounded` made fully
deterministic) are **unproven** (s2 §6; s4 names GAP-R1 as the axis where C "lives or dies").
The selection is therefore **conditional**, with explicit demotion rules:

- **Condition C-1 (validator buildability).** If a local design spike (s4 §4) shows
  `acceptanceText` _cannot_ be reduced to machine-checkable predicates for real review feedback,
  C's acceptance validator degrades to a soft check and **C collapses toward B on auditability**
  (its 4 → ~2.5). In that case the verdict flips to **B**, because C-minus-its-suite _is_ B (B is
  C's documented floor and fallback) and B is then the lower-cost way to reach the same place.
- **Condition C-2 (op-vocabulary coverage).** If a later finding shows the real comment workload
  is dominated by a _small, enumerable_ set of structured edits (so A's typed-op vocabulary covers
  it without an LLM in synthesis), then A's expressiveness floor stops binding and A's
  auditability/odid peaks (5/5) make **A** the rational pick. Nothing in the current evidence
  supports this — comments are free-text (s1 §3) — so it is recorded as a watch condition, not a
  present reason to pick A.

Absent C-1 or C-2 firing, **C stands.**

### Synthesis note (not a separate fourth approach)

No explicit synthesis beyond C is needed: C _is_ the synthesis of A's determinism and B's
expressiveness, and the dominance analysis confirms a fourth blend would not be Pareto-superior.
However, two A-native mechanics should be **imported into C's design** because they cost little
and lift C's two weakest scores:

- **Per-task conflict detection (from A's §5).** C's proposer is whole-file, so it inherits B's
  inability to name _which_ task failed. Adding A-style static same-`odId` conflict detection to
  C's validator lane (it already parses both trees) lifts C's odid_stability toward 5 at near-zero
  marginal cost.
- **Ops-vs-output reconciliation as an _optional_ validator (from A's §3).** Where a task _does_
  carry a structured op (the enumerable subset), C can cross-check ops-derived vs output-derived
  diff — a strictly stronger honesty guard than B/C's output-only path, applied opportunistically
  without forcing A's full schema burden.

---

## 6. Rejected alternatives (recorded as residue)

| Rejected                                             | Why rejected (scored, not asserted)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Resurfaces if                                                                                                                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Approach A (standalone)**                          | Σ 17.5, lowest. Two structural floors — expressiveness (2) and cc_fit (2.5) — that cannot rise without the s3-F5 patch-synthesizer fork: it either needs an LLM in synthesis (becoming "B with extra steps", forfeiting its own determinism thesis) or forces a typed-op comment UI that narrows what users can ask and pushes authoring load onto the human (ergonomics 3). Its peaks (auditability 5, odid 5) are real but bought at an expressiveness cost the free-text comment workload (s1 §3) does not justify. | **C-2 fires**: the real comment workload turns out small/enumerable, so the typed-op vocabulary covers it without an LLM — then A's 5/5 audit+odid peaks win.                  |
| **Approach B (standalone)**                          | Σ 19.5, second. Irreducible auditability floor (2.5 — lowest cell in the matrix): replay-by-record only, **fail-open** (hallucinated HTML can become head), G7 unenforced by any mechanism, and post-approval output drift (non-idempotent retry) that breaks saw-the-diff honesty without a preview gate it lacks. Strong on expressiveness (5) and cc_fit (5), but the audit/fail-open hole is exactly what C closes at modest cost.                                                                                 | **C-1 fires**: C's validator suite proves unbuildable/untrustworthy → C degrades to B anyway, so B becomes the honest lower-cost choice (B is C's documented fallback).        |
| **A's "validator is redundant" stance**              | Locally true _for A_ (the producer is the contract), but it is the very property that caps A's expressiveness — there is no untrusted generated artifact precisely because nothing fuzzy can be generated. Rejected as a general principle; C's _load-bearing_ validator is what buys the frontier.                                                                                                                                                                                                                    | Never as stated; only relevant inside A, which is itself residue.                                                                                                              |
| **B's "human gate is sufficient admission control"** | Conditional on attentive review; collapses to "whatever the model emitted" under rubber-stamping, and gets harder as diffs grow (no deterministic scope fence). Rejected as the sole backstop.                                                                                                                                                                                                                                                                                                                         | If a non-prototype / system-of-record posture is ever required, the whole B branch (and this assumption) is reconsidered — but that contradicts the current prototype framing. |
| **A fourth synthesized approach (A∪B∪C blend)**      | Dominance analysis shows no point-wise gain over C; a heavier blend adds owner-lane and schema cost (C is already the highest-build option, two lanes + validator suite + retry loop) for no Pareto improvement.                                                                                                                                                                                                                                                                                                       | If both C-1 and C-2 partially fire (validator weak _and_ a usable op subset exists), revisit a C-core + A-op-subset hybrid — partially pre-empted by §5's import note.         |

### Open residue carried forward (does not block this stage)

- **GAP-1 (od-id into `MutationTask`) and GAP-2 (HTML pointer + hash on `RevisionManifestEntry`)**
  are paid under the selected approach regardless — land them as schema changes. C's odid (4) and
  auditability (4) both _assume_ full GAP-1/GAP-2 coverage; partial coverage weakens both.
- **C-1 spike (validator buildability)** is the gating next action: stress-test
  `intent-not-reinterpreted` + `scope-bounded` as deterministic predicates before committing
  design effort. If it stalls, s4's **GAP-R1** external pass (deterministic validation of
  LLM-generated artifacts) is the named, bounded fallback — confirm before running.
- **Preview/dry-run gate** (the dormant `RevisionApplied` state) must be designed for C to realize
  its ergonomics (5) — saw-the-diff _before_ record. This is a lifecycle addition, not yet
  specified.
- **Atomicity / ordering / rollback** for the now-extra HTML write (4 non-atomic store calls;
  post-check detects, does not roll back) is unresolved for all approaches and must be specified
  in C's recorder lane (produce-then-persist, as A demonstrated, is the safe shape to adopt).
- **ExecutionProvenance shape** for C: model + prompt + input/output hashes + **validator
  verdicts** — confirm in design.
