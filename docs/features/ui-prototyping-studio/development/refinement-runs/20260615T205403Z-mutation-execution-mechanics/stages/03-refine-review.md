---
stage: s3-refine-review
owner: interrogation
status: flag
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
inputs:
  - stages/01-context-pack.md
  - stages/02-define.md
verdict: flag
---

# Refine-Review: Mutation Execution Mechanics

Adversarial critique of the s2 Define. I re-grounded every load-bearing claim against the
real code (`apply-approved-batch.ts`, `domain/models.ts`, the module tree) before judging.
The Define is **strong and code-honest** on its core thesis. It earns a **FLAG, not a pass**:
the framing, the three contracts, and the criteria are sound, but the Define is missing a
cluster of execution-mechanics concerns that are squarely _in its own declared scope_ (§1.3:
"the mechanics by which a `MutationTask` description becomes a concrete edit") and that will
silently differentiate A/B/C in the decision stage if left unnamed. A few framing claims are
also slightly stronger than the code supports and should be tightened so the decision compares
like-for-like.

**Verdict: FLAG.** Not a block — the Define does not have to be re-run from scratch, and no
named approach is wrong. But the listed fixes (F1–F9) should be folded in before the decision
stage, because several of them (idempotency/retry, atomicity, partial-apply, the honesty of
the diff, "saw-the-diff" mechanics) change the _relative_ scoring of A/B/C, which is the
decision stage's entire job.

---

## 1. Is the problem framed correctly?

**Mostly yes — this is the Define's strongest part.**

- The `apply(approvedBatch, currentHtml, sessionContext) -> {nextHtml, diffSummary', provenance}`
  function framing is accurate and well-chosen. I confirmed against
  `apply-approved-batch.ts`: apply is pure bookkeeping, `htmlArtifactRef` is never read or
  written, and `MutationTask` fields feed only `buildDiffSummary` (lines 165–187) and
  `appliedTaskIds` (line 127). The "real gap" claim (§1.2) is true to the code.
- The scope split (§1.3) is defensible: gates are honored not redesigned, synthesis-as-
  deterministic is a real fact, runtime choice is a governance constraint.

**Two framing problems to fix:**

- **(F1 — framing too narrow) The problem is stated as single-batch, single-apply, happy
  path.** The function signature and the whole Define assume one approved batch produces one
  clean `nextHtml`. But §1.3 explicitly claims scope over "the mechanics by which a
  `MutationTask` description becomes a concrete edit." Mechanics include what happens when the
  edit only _partially_ succeeds, when apply is _retried_, and when _multiple_ batches/tasks
  interact. These are not out-of-scope gate logic — they are execution mechanics. The framing
  should be widened to: _apply must define its behavior under partial realization, retry, and
  task interaction_, or those must be explicitly deferred with a reason (not silently omitted).

- **(F2 — "sessionContext" is undefined) The third argument to `apply(...)` is never
  defined in §2's vocabulary.** Every other term is fixed; `sessionContext` is hand-waved.
  Given G9 (CLI seam, core stays pure), what the engine is _allowed to see_ (just
  currentHtml+tasks? the whole session? the component library? prior revisions?) is itself
  approach-differentiating — B and C, which generate, may want richer context; A does not.
  Define `sessionContext` or drop it from the signature.

---

## 2. Are the three approaches fairly and distinctly defined?

**Fairly: yes. Distinctly: yes. But the fairness is uneven in two specific spots, and one
shared determinism claim is overstated.**

The A/B/C contracts are genuinely comparable (same axes in §4) and the at-a-glance table
(§4.4) is honest. Distinctness is crisp: where the edit is decided (synthesis / apply-time /
propose+admit) is a real, non-overlapping axis. Good work. Specific issues:

- **(F3 — the "checksum-grade audit chain" is overstated for ALL three, which unfairly
  flatters A).** The Define repeatedly frames G6/DC1 as "A keeps the checksum-grade audit
  chain, B breaks it." I checked the actual checksum: `synthesize-mutation-batch.ts` computes
  `sha256(JSON.stringify({sourceRevisionId, generatedFromCommentIds, tasks}))`. **That checksum
  binds the _input task set_ only — it does not, and cannot, cover the produced HTML, because
  no HTML is produced today.** So even under A, the existing checksum says nothing about
  `nextHtml`; A's determinism claim depends on a _new_ property (the patch ops being
  content-addressable AND the transformer being pure), not on the existing checksum chain.
  Worse: `RevisionManifestEntry.createdAt = new Date().toISOString()` (apply-approved-batch.ts:130)
  means **the manifest entry is already wall-clock non-deterministic per run, under all three
  approaches.** The Define's framing implies A inherits a clean deterministic chain it can
  "preserve"; in fact A must _extend_ the chain to cover output, and B/C must do the same. Fix:
  restate DC1 as "does the approach let us _reconstruct/verify the output_, given inputs" and
  note that the existing checksum covers inputs only — so the real DC1 question is whether the
  _revision-to-HTML_ binding is reproducible, which is GAP-2 + per-approach. This levels the
  comparison.

- **(F4 — Approach B's "DiffSummary' computed afterward by diffing" quietly gives B the
  honest-diff property the Define elsewhere treats as hard).** §4.2 says B's `DiffSummary'` is
  "computed afterward by diffing produced HTML against current." That is true and fine — but it
  means the honest-diff (DC5) is _equally available to B and C_ the moment real HTML exists. The
  Define's §5.1 tension narrative ("DC5 pulls toward B") and §2.2 both imply honest-diff is a
  differentiator. It is **not** a differentiator among B/C (both produce real HTML, both can
  diff it); it is only a differentiator vs. _today_. The honest-diff is a property of "real HTML
  exists," i.e. GAP-2-adjacent, not of the generation strategy. Fix: move honest-`DiffSummary'`
  into the shared-prerequisite bucket (it falls out of any approach that produces HTML) and stop
  scoring DC5 as a B/C tiebreaker. What _does_ differ on DC5 is the _fidelity of the
  human-viewable diff_ (per-od-id fragments need GAP-1; whole-file diff does not) — score that
  instead.

- **(F5 — Approach A is under-stressed; its real cost is hidden in one clause).** §4.1 says A's
  validator is "largely redundant" and A "pushes the hard problem onto synthesis." True, but the
  Define never confronts that **synthesis today has no LLM and is purely deterministic
  substring inference** (`inferChangeType`). For A to emit a _complete typed patch_ from
  free-text `intent`, synthesis must either (a) gain an LLM — which reintroduces exactly the
  non-determinism A claims to avoid, just one stage earlier, or (b) restrict comments to a
  typed-op vocabulary the human must author — a product change. The Define states A's burden but
  doesn't name this fork. It is the mirror image of "is C's validator buildable?": "is A's
  _patch synthesizer_ buildable without an LLM, and if it needs one, has A just become B with
  extra steps?" Add this as A's pivotal question, symmetric to C's.

---

## 3. Are the criteria the right ones?

**The five criteria (DC1–DC5) are the right _axes_. Two gaps and one redundancy:**

- DC1 auditability/determinism, DC2 expressiveness, DC3 native fit, DC4 od-id stability,
  DC5 saw-the-diff — these are the load-bearing tensions and they map cleanly to the central
  trade-off. Good.

- **(F6 — missing criterion: failure behavior / safety on bad output).** None of DC1–DC5 asks
  _"what happens when the engine produces wrong or broken HTML?"_ For B this is the dominant
  risk (no validator, output _is_ the revision — a hallucinated layout silently becomes head).
  For C the validator is the answer. For A a malformed patch fails closed. This is arguably the
  single most decision-relevant axis and it is absent. Add **DC6 — failure containment**: on a
  bad/failed edit, does the approach fail closed (no revision recorded) or fail open (garbage
  becomes head)? This is not the same as DC1; an approach can be reproducible and still happily
  record garbage.

- **(F7 — DC5 partially redundant with the GAP-2 prerequisite; see F4).** As written, DC5
  conflates "real HTML exists" (a prerequisite all approaches pay) with "diff fidelity" (od-id-
  level vs file-level, which _does_ vary). Split it so the criterion measures only the part that
  differentiates.

- **(F8 — DC3 "native fit" risks circularity).** DC3 is "does it use the runtime where it is
  strong." Since G9 makes Claude Code-native a hard constraint, DC3 is at risk of just being
  "how much does it use the LLM," which would mechanically rank B>C>A and pre-bias the decision.
  Recommend re-scoping DC3 to "_topology_ fit: does generation sit behind the CLI seam and the
  core stay pure" — which A, B, and C can all satisfy or fail independently of how much LLM they
  use. Otherwise DC3 double-counts DC2.

---

## 4. What's missing? (the prompt's explicit checklist)

This is where the Define most needs work. Each item below is in-scope per §1.3 and currently
**unaddressed**. I confirmed grep-negative for all of these in the module
(`ExecutionProvenance`, `partial`, `rollback`, `idempoten`, multi-batch handling — none exist).

- **Partial-apply / rollback (MISSING — must add).** Apply persists via _three sequential,
  non-transactional_ store calls (`saveBatch`, `appendRevision`, `saveSession` —
  apply-approved-batch.ts:140–142). Adding an HTML write makes it **four** non-atomic steps. If
  the HTML write succeeds but `appendRevision` fails (or vice-versa), the session is left in a
  torn state with no rollback. The `VARIANT_GENERATION_COUNT_MISMATCH` post-check (lines
  144–155) detects _one_ torn case (manifest didn't grow by one) but **throws after the writes
  already happened** — it detects, it does not roll back. The Define must state the atomicity
  contract: is `apply` all-or-nothing? Where does the HTML write sit relative to the manifest
  append? This differs sharply by approach — A's pure transformer can produce `nextHtml`
  _before_ any persistence (write-then-commit is easy); B/C produce HTML via an out-of-process
  agent behind the CLI seam, so the "produce" step can fail/timeout _after_ the human already
  approved, raising the question of what state the session lands in. **Add an atomicity /
  ordering / rollback contract to §2.1.**

- **Multi-task batches (PARTIALLY MISSING — under-specified).** A batch is `tasks:
MutationTask[]` (plural). The Define's contracts mostly read as if tasks compose cleanly, but
  never addresses: (a) **task interaction/conflict** — two tasks targeting the same od-id, or
  one task removing the anchor another task targets; (b) **ordering** — is apply order
  significant, and is it deterministic? (c) **per-task vs whole-batch failure** — if task 3 of 5
  can't be realized, is the whole apply rejected, or are 4 recorded? This is the heart of
  "partial-apply" and it is approach-differentiating: A applies an ordered op list (order
  matters, conflicts detectable statically); B regenerates whole HTML in one shot (no per-task
  granularity at all — you cannot say _which_ task failed); C's validator could check per-task
  but the proposer works whole-file. **Add a "task composition & conflict" subsection** and let
  it differentiate the approaches.

- **Idempotency / retry (MISSING — must add).** What happens on a second `apply` of the same
  approved batch? Today, re-apply would fail the staleness guard _after_ the first apply moved
  the head — but the **first** apply itself, if the HTML-write step is retried after a transient
  failure, has no defined idempotency. For A (pure function) re-running the transformer on the
  same input is naturally idempotent. For B/C, re-proposing is **non-idempotent by
  construction** (the model may emit different HTML), so a retry produces a _different_
  `nextHtml` than the one the human might have seen. This directly couples to "saw-the-diff": if
  a retry can change the output after approval, the human saw a diff that is no longer the one
  being recorded. **Add an idempotency clause and connect it to G8.**

- **How `DiffSummary` becomes honest (PARTIALLY ADDRESSED — mechanism missing).** §2.2 defines
  the _honesty bar_ ("derivable from currentHtml and nextHtml") well, but never says _what diff
  algorithm_ makes it honest, and that choice is load-bearing. A textual line-diff, a DOM-tree
  diff, and a per-od-id semantic diff give different `{added, changed, removed}` numbers for the
  same HTML. The current `DiffSummary` shape is `{added, changed, removed}` _counts_ — honest
  counts require a defined unit (lines? nodes? od-id'd elements?). And note: A can derive the
  diff _from its own ops_ (the ops are the diff, §4.1) without any HTML diff at all, while B/C
  _must_ run an after-the-fact structural diff. So "how DiffSummary becomes honest" is itself
  approach-split: A = ops-derived, B/C = output-derived. **Name the diff unit and note the
  per-approach derivation path.**

- **How the human "saw the diff" (PARTIALLY ADDRESSED — only the data, not the moment).** G8/DC5
  is well-motivated but the Define only addresses _what_ (a real before/after artifact). It
  never addresses **when/where in the lifecycle** the human sees it, which is the actual
  ergonomic mechanic. The state machine is `MutationApproved → RevisionApplied →
RevisionRecorded`, and approval happens _before_ HTML exists in B/C (the model generates at
  apply time, §4.2/§4.3). So **in B/C the human approves the batch before any HTML diff can be
  shown** — the diff can only be seen _after_ apply, at which point it's already head. That is a
  genuine sequencing problem: "saw-the-diff" may require a _preview/dry-run_ step (propose HTML,
  show diff, then a second human gate to record) that doesn't exist in today's lifecycle. A, by
  contrast, can compute the diff at approval time because the patch is fully specified at
  synthesis. **The Define must distinguish "approve-then-generate" (B/C, diff is post-hoc) from
  "generate-then-approve/preview" (needed for honest saw-the-diff) and flag that B/C may need a
  new preview gate.** This is the most consequential omission for DC5.

- **(F9 — ExecutionProvenance shape is deferred but it gates DC1).** §2.5 introduces
  `ExecutionProvenance` and §6 punts its shape to the decision stage. But provenance _is_ how
  DC1 is satisfied for B/C (you cannot reproduce a model output; you can only record
  model/prompt/seed and replay-as-best-effort). Leaving its shape undefined leaves DC1
  un-scoreable for B/C. At minimum the Define should state the _minimum_ provenance fields each
  approach needs (A: ops; B: model+prompt; C: model+prompt+validator verdicts) so the decision
  can judge whether that's "auditable enough."

---

## 5. Smaller notes (non-blocking)

- §3 lists G1–G9 cleanly and the code-enforced/governance-context split is honest. Good. But
  G6 ("determinism/reproducibility of the chain") should be split into **G6a input-determinism
  (real today, via synthesis checksum)** and **G6b output-reproducibility (does not exist
  today)** — because conflating them is exactly what produces the F3 overstatement.
- The governance IDs remain grep-negative (re-confirmed: DEC-RUNTIME-CLAUDE-CODE-011,
  DEC-CLI-NOT-MCP-012, DEC-ATOMIC-IDS-014 absent in module + docs). The Define correctly labels
  them `[governance context]`. Fine for this stage; downstream should land them as citable
  artifacts as s1 already noted.
- GAP-1 and GAP-2 as shared prerequisites is the right call and well-argued.
- The `RevisionApplied` vs `RevisionRecorded` enum oddity (s1 §2.1: apply sets
  `RevisionRecorded`, `RevisionApplied` is never reached) is noted in s1 but dropped in s2. If a
  preview/dry-run gate is added (per §4 above), `RevisionApplied` may finally have a use as the
  post-generate / pre-record state. Worth a pointer.

---

## 6. Concrete fix list (for the author, to clear the FLAG)

| #   | Fix                                                                                                                                             | Where      | Why it matters to the decision                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------- |
| F1  | Widen problem framing to cover partial realization, retry, task interaction — or explicitly defer with reason                                   | §1.1/§1.3  | These are mechanics, in-scope, and approach-differentiating |
| F2  | Define `sessionContext` (what the engine may see) or remove it                                                                                  | §1.1, §2   | Engine visibility differs A vs B/C                          |
| F3  | Restate DC1/G6: existing checksum binds _inputs only_; output-reproducibility is new for all three; manifest already has wall-clock `createdAt` | §2.2/§3/§5 | Removes A's unearned head start                             |
| F4  | Move honest-`DiffSummary'` to shared prerequisite; it is not a B/C differentiator                                                               | §2.2/§5.1  | Stops double-scoring DC5                                    |
| F5  | Add A's pivotal question: can the patch _synthesizer_ be built without an LLM (else A→B)?                                                       | §4.1       | Symmetric stress to C's validator                           |
| F6  | Add **DC6 — failure containment** (fail-closed vs fail-open)                                                                                    | §5         | Dominant risk axis for B, currently absent                  |
| F7  | Split DC5 into "real HTML exists" (prereq) vs "diff fidelity" (od-id vs file)                                                                   | §5         | Measures only what differs                                  |
| F8  | Re-scope DC3 to _topology_ fit, not LLM-usage, to avoid circular pre-bias                                                                       | §5         | Prevents DC3 double-counting DC2                            |
| F9  | State minimum `ExecutionProvenance` fields per approach                                                                                         | §2.5/§6    | Makes DC1 scoreable for B/C                                 |
| —   | Add atomicity/rollback contract (4 non-atomic writes; post-check detects, doesn't roll back)                                                    | §2.1       | Torn-state risk grows with HTML write                       |
| —   | Add task-composition/conflict subsection (ordering, same-od-id conflicts, per-task vs whole-batch failure)                                      | new §4.x   | Partial-apply is approach-split                             |
| —   | Add idempotency/retry clause; connect to G8 (retry may change post-approval output for B/C)                                                     | §2.1/§3    | A idempotent, B/C not                                       |
| —   | Distinguish approve-then-generate (B/C) vs generate-then-preview; flag possible new preview gate                                                | §4/§5      | The real "saw-the-diff" mechanic                            |

---

## 7. Handoff to decision stage

- The Define is a solid _skeleton_; it is **not yet decision-ready** because the missing
  mechanics (partial-apply, idempotency, atomicity, saw-the-diff _sequencing_, failure
  containment) are precisely the axes on which A/B/C separate. A decision made on the current
  five criteria would over-credit A's audit story (F3), mis-score DC5 (F4/F7), and ignore the
  fail-open risk that should sink or rescue B (F6).
- **Pivotal questions, now symmetric:** (a) Is C's validator buildable/trustworthy? [unchanged]
  (b) Is A's patch _synthesizer_ buildable without re-introducing an LLM? [new, F5] (c) Do B/C
  require a new generate-then-preview gate to honor "saw-the-diff" honestly? [new, §4]
- No decision is made here. This stage flags the Define for the listed fixes; once F1–F9 plus
  the three contract additions are folded in, the Define should reach pass and the decision can
  compare A/B/C like-for-like across six criteria including failure containment.
