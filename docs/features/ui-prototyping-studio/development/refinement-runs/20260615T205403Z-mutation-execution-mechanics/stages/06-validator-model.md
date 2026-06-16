---
stage: s6-validator-model
owner: validator-designer
status: pass
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
inputs:
  - stages/01-context-pack.md
  - stages/02-define.md
  - stages/03-refine-review.md
  - stages/04-research-decision.md
  - stages/05-approach-comparison.md
approach_independent: true
---

# Validator Model: Mutation Execution Mechanics

This stage specifies the **deterministic validator set** for mutation execution: each check as a
**pure, reproducible** function with an explicit pass/fail and a stable failure code. The set is
authored to be **approach-independent** — it does not assume Approach C won. It is the deterministic
admission boundary that any execution model (A deterministic-patch / B agentic-regen / C hybrid)
must pass through to turn a candidate prototype HTML into a recorded revision. Which validators are
_load-bearing_ differs by approach (§4); the validators themselves do not.

It builds directly on the prior stages and inherits their calibrations:

- s2 §2.3 fixed the meaning of "deterministic validator": a pure function in the orchestration core
  (no LLM, no network, **no clock**) over `(currentHtml, candidateHtml, task | batch)` returning
  `pass | fail(reason)`, same inputs ⇒ same verdict.
- s3 surfaced the mechanics that must be validator-covered: **F3** (the existing `sha256` checksum
  binds _inputs only_; `createdAt = new Date()` is wall-clock non-deterministic; output-repro is new
  for all three), **F4/F7** (honest diff is a _shared prerequisite_, not a B/C differentiator),
  **F6** (failure containment — fail-closed vs fail-open is the dominant axis), and the
  atomicity / idempotency / partial-apply gaps.
- s5 selected **C conditionally** and explicitly: C's auditability is **4 not 5** _because the
  validator suite's buildability is the pivotal unknown_ (condition **C-1**). This stage is where
  that unknown is paid down — it makes the validator contract concrete enough to be stress-tested.

---

## 1. Where determinism MUST live (regardless of approach)

This is the load-bearing claim of the stage; everything in §3 implements it.

> **Determinism lives in the validator/recorder lane inside the pure orchestration core — never in
> the producer, and never in the persistence step alone.**

Justification, grounded:

- The orchestration core is already pure (`apply-approved-batch.ts`, `synthesize-mutation-batch.ts`
  are framework-free, LLM-free, port-only — s1 §4). Putting the validators anywhere else (in the
  `studio` CLI, in the proposer, in a wrapper) breaks G9's "core owns gates + determinism, CLI is
  the only seam" topology and makes the verdict un-replayable.
- Determinism **cannot** live in the producer under B or C: generation is non-deterministic by
  construction (s5 auditability B=2.5, C=4). Under A the producer _is_ deterministic, but the
  validators still run in the core as a fail-closed backstop (a malformed-but-typed patch can still
  emit broken HTML — see V7).
- Determinism **cannot** be delegated to the existing checksum (F3): `checksum =
sha256({sourceRevisionId, generatedFromCommentIds, tasks})` binds the _input task set_, says
  nothing about produced HTML. The validators are the only thing that can bind a candidate HTML to
  the contract.
- Two **purity obligations** every validator must honor, or the "same inputs ⇒ same verdict"
  guarantee is a lie:
  1. **No clock / no entropy.** A validator must never read `Date.now()`, `Math.random`, env, or
     filesystem mtime. (The recorder's `createdAt = new Date().toISOString()` — `apply-approved-batch.ts:130`
     — is wall-clock and is therefore **excluded from any checksum a validator computes**; see V8.)
  2. **Canonical parse, not string compare.** Every HTML-structural validator (V2/V3/V4/V6/V7/V8)
     operates on a **canonicalized parse** of the HTML (defined in §2), not on raw bytes, so that
     determinism is not accidentally coupled to incidental whitespace/attribute-order noise that the
     producer is free to vary.

The validator set returns a single composite verdict: **all required validators pass ⇒ admit;
any required validator fails ⇒ reject, no revision recorded (fail-closed, F6).** Optional validators
(V5 acceptance-proxy, V9b ops-reconciliation) can be configured as soft (warn) without changing the
admission decision — this is exactly the C-1 degradation lever (§5).

---

## 2. Shared substrate (fixed once, used by every validator)

So the per-validator specs below stay terse and identical in vocabulary:

- **`currentHtml`** — the head revision's prototype HTML, read from `htmlArtifactRef`
  (`/artifacts/ui-prototyping-studio/<sessionId>/<label>.html`, s1 §4). Read-only input.
- **`candidateHtml`** — the produced next-revision HTML the approach emitted (A: from `applyPatch`;
  B: from `generate`; C: from `propose`). The artifact under judgment.
- **`batch`** — the approved `MutationBatch` (`domain/models.ts:66`), carrying `tasks:
MutationTask[]`.
- **`task.target`** — a CSS selector string (`MutationTask.target`, `models.ts:53`).
- **anchor / `odId`** — the stable atomic id. **GAP-1 prerequisite:** `MutationTask` must carry
  `odId` (today `toMutationTask` drops `comment.target.odId` — s1 §5). Validators that key on od-id
  (V2/V3/V4) **require GAP-1 landed**; absent it they degrade to selector-only (weaker, noted
  per-validator).
- **canonical parse `Dom(html)`** — a deterministic DOM produced by a fixed parser with a fixed
  canonicalization: attribute order normalized (sorted), insignificant whitespace between block
  elements collapsed, self-closing forms normalized, comment nodes preserved, `data-od-id` treated
  as a first-class identity attribute. `Dom` is pure and total over well-formed input; on
  un-parseable input it yields a parse-error sentinel (consumed by V6). **The same canonicalizer
  must be used by the producer-side and the validator-side** or V2 "changed" detection will fire on
  noise.
- **`odIndex(html)`** — `Map<odId, CanonicalSubtreeHash>`: for each element bearing `data-od-id`, a
  deterministic hash of its canonical subtree. This single index powers V2/V3/V4/V8 and is computed
  once per `(html)`.
- **failure code convention** — SCREAMING*SNAKE, matching the existing
  `createUiPrototypingStudioError("CODE", …)` surface in `apply-approved-batch.ts`
  (`AUTO_APPLY_FORBIDDEN`, `BATCH_STALE_FOR_HEAD`, `VARIANT_GENERATION_COUNT_MISMATCH`, …). All new
  codes are prefixed `MUTATION_VALIDATOR*\*` so the validator lane is grep-isolable from the gate
  lane.

---

## 3. The deterministic validator set

Each validator below is specified as: **Input · Rule · Deterministic check · Failure code · Notes**.
"Required" means it participates in the fail-closed admission decision; "optional/soft" means it can
be downgraded to a warning by config (the C-1 lever).

### V1 — `target-exists`

- **Input:** `currentHtml`, `batch.tasks[*]` (anchor: `odId` if present else `target` selector).
- **Rule:** Every task's anchor must resolve to **exactly one** element in `currentHtml` before any
  edit is attempted. You cannot mutate what you cannot address.
- **Deterministic check:** for each task, `count = odIndex(currentHtml).has(task.odId) ? 1 :
querySelectorAll(Dom(currentHtml), task.target).length`. Pass iff `count === 1` for every task.
  `count === 0` ⇒ anchor missing; `count > 1` ⇒ ambiguous selector (the fragility GAP-1 exists to
  kill).
- **Failure code:** `MUTATION_VALIDATOR_TARGET_NOT_FOUND` (with `{taskId, anchor, count}`).
- **Notes:** Required, all approaches. This is a **pre-condition on `currentHtml`**, evaluated
  before the producer runs in A (cheap reject), and re-checked on the candidate's lineage in B/C.
  With GAP-1 the od-id path makes `count === 1` exact; selector-only is best-effort and may legitimately
  fail on ambiguous selectors — that failure is _correct_, not a false positive.

### V2 — `target-changed`

- **Input:** `currentHtml`, `candidateHtml`, `batch.tasks[*]` anchor.
- **Rule:** The element each non-noop task addresses must **actually differ** between current and
  candidate. An apply that claims to realize a task but leaves its target byte-identical (post-canon)
  is a no-op masquerading as a change — reject it so the manifest never records a hollow revision.
- **Deterministic check:** for each task, compare `odIndex(currentHtml).get(odId)` vs
  `odIndex(candidateHtml).get(odId)` (od-id path) — pass iff the subtree hashes **differ** for
  `change`/`add`-typed tasks. For `remove`-typed tasks the rule inverts (the target must be _absent_
  in candidate — see V3 overlap note). Selector-only fallback: hash the matched subtree by selector.
- **Failure code:** `MUTATION_VALIDATOR_TARGET_UNCHANGED` (with `{taskId, odId}`).
- **Notes:** Required. Pairs with V3 as the two halves of "the right thing changed and only it."
  Honest-diff (F4) is a byproduct: the per-od-id before/after subtree pair this validator already
  computes _is_ the human-viewable diff for G8/DC5 — it falls out of validation, it is not a
  separate feature.
- **CAVEAT (s8 TG-3 — UNSOUND for CSS-/style-driven change):** V2's od-id-subtree identity assumes
  the realization lands **inside** the addressed element's markup. For CSS-driven properties (the
  natural way to satisfy a sizing task like `button >= 44x44px`), the proposer edits an **un-anchored
  `<style>` rule** and the button's subtree stays **byte-identical** — V2 then reports
  `TARGET_UNCHANGED` and **false-rejects a legitimate, intent-realizing candidate**. This is the dual
  of V3's old blind spot. The spike (RESIDUE-B) must decide between **R2-a** (V2 means only "addressed
  markup differs"; CSS edits must be declared by the task and attributed to the od-id by R1's
  whole-tree diff) and **R2-b** (extend the od-id subtree hash to include the **resolved style
  declarations** applying to the element via a deterministic, layout-free cascade — stronger, but
  pulls CSS-cascade into the pure lane). Not decided here.

### V3 — `no-out-of-scope-change` (scope-bounded)

- **Input:** `currentHtml`, `candidateHtml`, `batch.tasks[*]` anchors, configured
  side-effect allowance `S`.
- **Rule:** **Only** the subtrees named by the batch's tasks (plus permitted structural
  side-effects in `S`) may differ. Any element that changed without an owning task is an
  out-of-scope edit and is rejected. This is the deterministic scope fence B structurally lacks
  (s5 auditability B=2.5, fail-open) and the reason C can claim odid_stability 4 over B's 3.
- **Deterministic check (REVISED — s8 R1 / s7-B1):** compute the **canonical whole-document diff** of
  `Dom(currentHtml)` vs `Dom(candidateHtml)` — every changed/added/removed node, **anchored or not**.
  **Attribute** each changed node to its **nearest enclosing `data-od-id`** ancestor. `ChangedSet` =
  the set of owning od-ids **plus a distinguished `⊥` (unattributed)** bucket for any change with no
  enclosing od-id (e.g. `<head>`, `<style>`, top-level layout). Compute `TaskScope = ⋃ task.odId`
  (closure: a task's od-id and, for structural tasks, its declared descendant allowance). Pass iff
  `ChangedSet ⊆ (TaskScope ∪ S)` **and `⊥ ∉ ChangedSet`** — i.e. any changed node not dominated by a
  `TaskScope` od-id (including all un-anchored markup) is out-of-scope. The `odIndex` is the
  _attribution/display_ key; it is **NOT** the change-detection domain (s8 TG-1 proved the old
  `odIndex`-only set-diff was blind to un-anchored edits — it admitted an adversarial `<style>`/`<h2>`
  rewrite on a one-card prototype).
- **Failure code:** `MUTATION_VALIDATOR_OUT_OF_SCOPE_CHANGE` (with `{offendingOdIds[]}`).
- **Notes:** Required; **load-bearing and the s5/s2 crux** (`scope-bounded` is one of the two
  pivotal C-1 unknowns). **Strictly requires GAP-1** — without od-id threaded into `MutationTask`,
  `TaskScope` is selector-derived and the fence is porous. The determinism of this check rests
  entirely on the canonical parse + od-id identity (§2); whitespace-noise tolerance is what stops it
  from false-rejecting a legitimate edit. The side-effect allowance `S` is the knob that trades
  expressiveness (C-2) against tightness: too tight ⇒ false rejects (s5 expressiveness C=4 caveat),
  too loose ⇒ fence leaks.

### V4 — `data-od-id-preserved` (anchor-preserved)

- **Input:** `currentHtml`, `candidateHtml`.
- **Rule:** Every `data-od-id` present in `currentHtml` is still present in `candidateHtml` **unless
  a `remove`-typed task explicitly owns its removal**. No atomic id may be silently
  dropped, renamed, or renumbered (DEC-ATOMIC-IDS-014 governance). New od-ids may appear only for
  `add`-typed tasks.
- **Deterministic check:** `before = keys(odIndex(currentHtml))`, `after =
keys(odIndex(candidateHtml))`. `dropped = before \ after`, `appeared = after \ before`. Pass iff
  `dropped ⊆ removalTaskOdIds(batch)` **and** `appeared ⊆ additionTaskOdIds(batch)`.
- **Failure code:** `MUTATION_VALIDATOR_ODID_NOT_PRESERVED` (with `{droppedUnowned[], appearedUnowned[]}`).
- **Notes:** Required; **requires GAP-1** for the "owned removal/addition" exception (otherwise it
  degrades to the strict "no od-id may ever change" set-check — B's level, s5 odid B=3). This is the
  set-diff half; V3 is the attribution half. Together they cover the case B misses: an od-id that
  _stayed present_ while its element was wrongly mutated (caught by V3), and an od-id that
  _vanished_ (caught here). The s5 §5 "import A's per-task same-od-id conflict detection" lifts this
  toward 5 — see V10.

### V5 — `acceptanceText-satisfiable-proxy`

- **Input:** `candidateHtml`, `task.acceptanceText`, `task.changeType`, `task.intent`.
- **Rule:** The candidate must satisfy a **machine-checkable proxy** of the task's
  `acceptanceText` — not a semantic judgment of intent (that is non-deterministic and forbidden in
  this lane), but the _structural shadow_ of acceptance that can be checked deterministically.
  `acceptanceText` is the deterministic template `` `Apply ${intent} at ${selector}: ${note}` ``
  (s1 §3), so the proxy is derived from `changeType` + anchor, not from parsing free-text intent.
- **Deterministic check:** dispatch on `changeType`:
  - `add` ⇒ the target subtree gained ≥1 descendant element/text node (node count strictly up).
  - `remove` ⇒ the target subtree is absent in candidate (count went to 0).
  - `change` ⇒ the target subtree hash differs **and** the target still exists (changed, not deleted).
    Pass iff the changeType's structural shadow holds.
- **Failure code:** `MUTATION_VALIDATOR_ACCEPTANCE_PROXY_UNMET` (with `{taskId, changeType, observed}`).
- **Notes:** **Optional/soft — this is the C-1 pivot.** It is a _proxy_, explicitly **not**
  full acceptance, because `acceptanceText` semantics are not deterministically decidable (s2 §6, s5
  C-1). If a design spike (s5 condition C-1) shows even this structural proxy cannot be made
  trustworthy, this validator degrades to a soft warning and **C collapses toward B on
  auditability** (s5 4→~2.5) — that is the documented demotion path, not a bug. Note the heavy
  overlap with V2/V5(`change`) and V3/V5(`add`): the proxy is largely re-expressing V2/V3 keyed by
  changeType, which is _why_ it can be soft without losing the fail-closed floor. **`intent` is never
  parsed or re-judged here (G7: intent is sacred — realize, never reinterpret).**

### V6 — `well-formed-HTML`

- **Input:** `candidateHtml`.
- **Rule:** The candidate must parse as well-formed HTML with no unclosed tags, no orphaned
  fragments, a single document root, and round-trippable structure. Broken markup can never become
  head (F6 fail-closed; B's dominant risk).
- **Deterministic check:** `Dom(candidateHtml)` returns a non-error tree **and** re-serializing the
  canonical tree then re-parsing yields an isomorphic tree (parse-reparse fixpoint). Pass iff parse
  succeeds and the fixpoint holds.
- **Failure code:** `MUTATION_VALIDATOR_MALFORMED_HTML` (with `{parseError, line, col}`).
- **Notes:** Required, all approaches (yes, even A: `insertChild`/`replace-text` ops smuggle raw
  markup — s5 expressiveness A=2 note — so A is not exempt). This is the first validator to run on
  any candidate; nothing downstream can trust an un-parseable input.

### V7 — `text-escaped` / sanitized

- **Input:** `candidateHtml`, and for A the `changeParams` text payloads.
- **Rule:** All text content and attribute values introduced by the edit must be properly
  HTML-escaped; no executable injection (`<script>`, `on*=` handlers, `javascript:` URLs) may be
  introduced unless the current head already contained it (no _new_ injection vector via a mutation).
- **Deterministic check:** diff the set of `<script>`/event-handler/`javascript:`-bearing nodes
  between `currentHtml` and `candidateHtml`; pass iff the candidate introduces **no new** member of
  that set. Additionally, for every text node in `ChangedSet`, assert its serialized form is its
  escaped form (entity round-trip). Pass iff both hold.
- **Failure code:** `MUTATION_VALIDATOR_UNSAFE_CONTENT` (with `{nodePath, reason}`).
- **Notes:** Required, all approaches. Phrased as **delta-injection** (new vs current), not absolute,
  so a prototype that legitimately already ships a script is not retroactively rejected — only edits
  that _add_ an injection vector fail. Deterministic because the node-set diff is over the canonical
  parse.

### V8 — `idempotency`

- **Input:** the validator suite itself, `currentHtml`, `candidateHtml`, `batch`.
- **Rule:** The validator verdict is a **pure function of its inputs** — re-running the full suite on
  the identical `(currentHtml, candidateHtml, batch)` triple yields the byte-identical verdict and
  the byte-identical `DiffSummary'` and `odIndex` hashes. (This is the _validator's_ idempotency; it
  is distinct from the _producer's_ idempotency, which only A has — s3 idempotency note.)
- **Deterministic check:** structurally guaranteed by §1's purity obligations; **enforced** by a
  self-test: compute the suite's verdict-hash twice and assert equality, and assert the verdict-hash
  excludes the recorder's wall-clock `createdAt` (F3). Pass iff stable across the double-run and
  clock-free.
- **Failure code:** `MUTATION_VALIDATOR_NONDETERMINISTIC` (with `{hash1, hash2}`) — fires only if a
  validator illegally consumed a clock/entropy/IO source; it is a **guard against validator
  authorship bugs**, not against producer behavior.
- **Notes:** Required as a self-check. It is what makes "replay-by-verdict" (s5 C auditability)
  _true_: even though the proposal is not reproducible, the **admission decision is**, because this
  validator proves the suite is a pure function. This is the deterministic core of C's audit story.

### V9 — `diff-bounded`

- **Input:** `currentHtml`, `candidateHtml`, `batch.tasks.length`, configured bound function
  `B(taskCount)`.
- **Rule:** The total size of the change (number of changed od-id subtrees, and total
  added/removed/changed node count) must be **within a deterministic bound** proportional to the
  task count. A batch of 3 small tasks must not produce a whole-document rewrite — that signals
  either a runaway proposer (B/C) or a mis-specified patch (A), and is rejected before it becomes
  head.
- **Deterministic check:** `changeMagnitude = |ChangedSet|` and node-level
  `{added, changed, removed}` from the canonical diff; pass iff `changeMagnitude <= B(batch.tasks.length)`
  for a fixed monotone `B` (e.g. `k * taskCount + c`, constants fixed in config, no clock/entropy).
- **Failure code:** `MUTATION_VALIDATOR_DIFF_OUT_OF_BOUNDS` (with `{changeMagnitude, bound, taskCount}`).
- **Notes:** Required for B/C (the runaway-generation guard — the quantitative complement to V3's
  qualitative scope fence). For A it is near-trivially satisfied (ops are bounded by construction)
  but still runs as a fail-closed backstop. The bound function `B` is policy, fixed in config so the
  check stays pure; tuning `B` trades expressiveness (large legitimate refactors) against
  runaway-containment — the same C-2 / side-effect-allowance tension as V3's `S`.

### V9b — `ops-vs-output-reconciliation` (optional, A-subset only)

- **Input:** `task.changeParams` (A's typed ops, when present), `currentHtml`, `candidateHtml`.
- **Rule:** Where a task carries a **structured op** (the enumerable A-subset, s5 §5 import), the
  diff _derived from applying the op deterministically_ must equal the diff _observed_ between
  current and candidate. A stronger honesty guard than output-only diffing.
- **Deterministic check:** `opsDerivedDiff = applyOps(currentHtml, changeParams)` (pure) vs
  `observedDiff = canonicalDiff(currentHtml, candidateHtml)`; pass iff equal over `ChangedSet`.
- **Failure code:** `MUTATION_VALIDATOR_OPS_OUTPUT_MISMATCH` (with `{taskId}`).
- **Notes:** Optional, **opportunistic** (s5 §5: "applied opportunistically without forcing A's full
  schema burden"). Only meaningful when `changeParams` exist (always for A; never for pure B; for the
  C+A-subset hybrid only where present). Skipped (not failed) when no ops carried.

---

## 4. Approach-dependence of the set (which validators are load-bearing)

The **set is the same**; its _criticality_ shifts. This is what keeps the stage approach-independent
while still informing the s5 verdict.

| Validator              | A (det-patch)         | B (agentic-regen)                                | C (hybrid)                       |
| ---------------------- | --------------------- | ------------------------------------------------ | -------------------------------- |
| V1 target-exists       | required (pre-patch)  | required                                         | required                         |
| V2 target-changed      | redundant w/ ops\*    | **load-bearing**                                 | **load-bearing**                 |
| V3 scope-bounded       | satisfied by ops      | **unenforced in B** → would fail-open without it | **the crux (C-1)**               |
| V4 odid-preserved      | by construction (5)   | set-check only (3)                               | set+attribution (4)              |
| V5 acceptance-proxy    | ops are the contract  | soft only                                        | **soft/pivotal (C-1)**           |
| V6 well-formed         | required (insert ops) | **required (dominant risk)**                     | required                         |
| V7 text-escaped        | required              | **required**                                     | required                         |
| V8 idempotency (suite) | required              | required                                         | **makes replay-by-verdict true** |
| V9 diff-bounded        | backstop              | **runaway guard**                                | **runaway guard**                |
| V9b ops-reconciliation | applicable            | n/a                                              | opportunistic                    |

\* For A, V2/V3 are largely redundant with the patch ops (the ops _are_ the diff) — but they still
run as a fail-closed backstop against a malformed transformer, consistent with s2 §2.3 ("validator
largely redundant for A" — _redundant_, not _removed_).

**Reading of the table:** under **B**, the validators V3/V9 are exactly the fail-open holes B
structurally lacks (s5 B=2.5) — i.e. _B-with-this-validator-set is C_; this is why s5 says "C-minus-
its-suite is B". Under **C**, V3 and V5 are the two checks whose deterministic buildability is the
pivotal unknown (condition **C-1**). Under **A**, the set degrades to a thin well-formed/escaped/
idempotency backstop because the producer already carries the contract.

---

## 5. Failure containment, degradation, and the C-1 lever (F6 / s5 conditions)

- **Fail-closed default (F6).** Any **required** validator failure ⇒ **reject the candidate, record
  no revision** (no `appendRevision`, no head move). This is the deterministic answer to B's
  fail-open risk and must be enforced _before_ the three/four-step persist sequence in
  `apply-approved-batch.ts:140–142` runs — i.e. **validate-then-persist**, mirroring A's
  produce-then-persist shape (s5 §3 auditability A, and the atomicity gap from s3). The existing
  `VARIANT_GENERATION_COUNT_MISMATCH` post-check stays as the append-once invariant; the validator
  set is the _new_ admission gate in front of it.
- **The C-1 degradation path is explicit, not emergent.** V5 (acceptance-proxy) and, secondarily,
  V3's tightness are the knobs s5 condition C-1 turns. If the spike proves V5 cannot be made a
  trustworthy deterministic proxy, configure it **soft** (warn, do not block). The admission floor
  then rests on V1/V2/V3/V4/V6/V7/V8/V9 — which is still strictly stronger than B (B has _none_ of
  V3/V9 enforced). If V3 _also_ cannot be made deterministic against the canonical parse, then C's
  validator suite has collapsed to "well-formed + escaped + set-check + bounded", which is the
  documented **C→B demotion** (s5 §5 condition C-1: verdict flips to B).
- **C-2 (op-vocabulary) interaction.** If the comment workload turns out small/enumerable (s5 C-2),
  V9b becomes routinely applicable and V3's `S` can be tightened safely → A's posture becomes
  rational. The validator set supports this without change: V9b simply stops being skipped.

---

## 6. Determinism budget — what is and is not reproducible

To be honest about the s5 "auditability C=4 not 5" gap, stated as a budget:

- **Reproducible (replay-by-verdict):** the **admission decision** for a fixed
  `(currentHtml, candidateHtml, batch)` — guaranteed by V8 + §1 purity. Re-running the suite always
  re-derives the same pass/fail and the same `DiffSummary'`/`odIndex` hashes.
- **Reproducible (replay-by-rerun):** **only under A** — `applyPatch` re-run on the same ops yields
  byte-identical `candidateHtml`. B/C cannot reach this (proposal non-deterministic) and the
  validator set does not claim to give it to them; it gives them replay-by-verdict instead.
- **NOT reproducible:** the **proposal** itself under B/C (a retry re-proposes different HTML — s3
  idempotency note). The validator set's job is to make this _safe_ (any proposal that passes is
  contract-honoring) and _auditable_ (V8 + recorded validator verdicts in `ExecutionProvenance`),
  **not** to make it deterministic. That residual non-determinism is exactly the 4-not-5 gap s5
  recorded — this stage prices it, it does not eliminate it.
- **Excluded from every validator hash (F3):** `RevisionManifestEntry.createdAt`
  (`apply-approved-batch.ts:130`, wall-clock) and any host/path nondeterminism. Validators bind the
  _content_ (od-id subtree hashes), never the _recording timestamp_.

---

## 7. Schema prerequisites this validator set assumes (carried from s2/s5, not re-decided here)

- **GAP-1 (od-id into `MutationTask`).** **Hard prerequisite** for V2/V3/V4/V5/V9 to operate at
  od-id granularity. Without it they fall back to CSS-selector matching (porous, ambiguous — V1's
  `count > 1` case) and the scope fence V3 weakens to the selector level. The set is authored to
  _degrade_ rather than break, but its s5 scores (odid 4, auditability 4) **assume full GAP-1
  coverage** — partial coverage weakens V3 + V4 together.
- **GAP-2 (HTML pointer + content hash on `RevisionManifestEntry`).** **Hard prerequisite** for the
  validator verdict to be _bound to_ the recorded revision (replay-by-record). Validators compute
  the candidate's content hash; GAP-2 is where it lands on the manifest so a later auditor can prove
  "this revision = that HTML that passed these validators". Without GAP-2, V8's reproducibility is
  unobservable from the audit trail.
- **`ExecutionProvenance` must carry validator verdicts** (s2 §2.5, s5 residue): per-validator
  pass/fail + the `DiffSummary'`/`odIndex` hashes the suite computed. This is the artifact that turns
  "replay-by-verdict" from a claim into a checkable record. Its full shape is confirmed in design,
  not here.

---

## 8. Residue / handoff

- **The pivotal spike is V5 + V3 (= s5 condition C-1), now expanded by s8 R1/R2.** Stress-test whether
  (a) the V5 structural proxy and (b) the **V3 whole-tree scope fence with od-id attribution** (s8 R1,
  not the old `odIndex`-only set-diff) can be made deterministic and _non-trivially strong_ against the
  canonical parse, on real comment workloads — AND (c) decide the **V2 CSS-driven-change** question
  (s8 R2-a vs R2-b), since the toy game (s8 TG-3) proved V2 false-rejects the idiomatic CSS way of
  satisfying a sizing task. If V5 must go soft, C still stands on the V1–V4/V6–V9 floor; if V3 must go
  soft, C demotes to B per s5. This stage makes that test concrete — it does not run it.
- **Canonicalizer is now load-bearing and shared.** The single biggest source of _accidental_
  validator non-determinism is producer/validator canonicalizer drift (whitespace/attr-order noise
  reading as "changed"). Design must specify **one** canonicalizer used on both sides of the seam.
- **Side-effect allowance `S` (V3) and bound function `B` (V9) are policy knobs**, not code
  constants — both must be fixed-in-config (clock/entropy-free) to preserve purity, and both encode
  the expressiveness-vs-containment trade (s5 expressiveness C=4 caveat / C-2).
- **Atomicity is out of this stage but adjacent.** This set fixes _admission_ (validate-then-persist,
  fail-closed); the s3/s5 atomicity gap (4 non-atomic store writes, post-check detects-not-rolls-back)
  must be specified in the recorder lane so a _passed-then-failed-persist_ candidate doesn't leave a
  torn state. The validator set guarantees nothing about persistence ordering — that is the
  recorder's contract.
- **Approach-independence preserved.** Nothing above presumes C won: under A the set is a thin
  backstop, under B it is the missing fail-closed gate, under C it is the load-bearing admission
  boundary. The _same_ validators, the _same_ failure codes, the _same_ determinism location.
