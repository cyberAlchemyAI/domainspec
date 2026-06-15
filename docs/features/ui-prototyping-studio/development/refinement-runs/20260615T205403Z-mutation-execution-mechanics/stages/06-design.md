---
stage: s6-design
owner: synthesis-architect
status: pass
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
inputs:
  - stages/01-context-pack.md
  - stages/02-define.md
  - stages/03-refine-review.md
  - stages/04-research-decision.md
  - stages/05-approach-comparison.md
  - stages/06-validator-model.md
selected_approach: C (Hybrid — agentic-propose + deterministic-validate)
fallback: B (on C-1) / A (on C-2)
---

# Design: Mutation Execution Mechanics

This stage resolves the **determinism-vs-flexibility dialectic** into **one execution model and
architecture**, on the back of the s5 tournament (Select C, conditionally) and the s6 validator
model (the deterministic admission set). It is written holding **both roles at once** — the
**determinism-guardian** (auditability, reproducibility, INV-6, fail-closed) and the
**flexibility-advocate** (expressive free-text intent, Claude Code-native generation, ergonomics) —
and every tension between them is discharged into exactly one of: a **DECISION** (resolved now), a
**RESIDUE** (carried, with an owner), or a **DEFERRED OPTION** (a named lever, dormant until a
trigger fires). Each carries an **ergonomics rationale**, because s5 made ergonomics the criterion C
won on (5/5) and the thing we must not regress.

Grounding note: governance IDs (`INV-3/4/5/6/8`, `DEC-RUNTIME-CLAUDE-CODE-011`,
`DEC-CLI-NOT-MCP-012`, `DEC-ATOMIC-IDS-014`, `OQ-2`) remain grep-negative in this module (s1 §10, s3
§5). They are honored here as constraints and mapped to real code; landing them as citable artifacts
is RESIDUE-G.

---

## 0. The dialectic, stated once so every later decision points back to it

> **Guardian:** a revision that becomes head must be _reproducible and provable_ — same inputs ⇒
> same admission verdict, no clock/entropy in the gate, no garbage silently recorded (INV-6,
> fail-closed). The existing `sha256` checksum binds the _input task set only_ (F3); `createdAt =
new Date()` (`apply-approved-batch.ts:130`) is already wall-clock. So today there is _no_
> output-reproducibility to "preserve" — it must be _built_.
>
> **Advocate:** review comments are free-text; the engine must realize fuzzy/structural intent, not
> a fixed op vocabulary (DC2). Generation is where Claude Code is strong and is a committed runtime
> (G9). And the human must _see a real before/after diff_ at the gate (DC5/OQ-2), not counts.

C is the synthesis: **let generation be non-deterministic and expressive behind the CLI seam;
recover determinism at the ADMISSION boundary inside the pure core.** Determinism is relocated, not
abandoned. Everything below implements that one sentence.

---

## 1. The chosen execution model (who does what)

Four lanes, three of them pre-existing, one new. The seam between lane 2 (impure, generative) and
lanes 3–4 (pure, deterministic) is the load-bearing boundary of the whole design — it is where the
advocate hands off to the guardian.

| Lane                     | Owner       | Purity                                      | Responsibility                                                                               | Lives in                                        |
| ------------------------ | ----------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **1. Synthesis**         | core        | pure (LLM-free, no clock)                   | comments → `MutationBatch` (deterministic, checksummed) — **unchanged**                      | `synthesize-mutation-batch.ts`                  |
| **2. Proposer (engine)** | Claude Code | **impure** (LLM, non-deterministic)         | `propose(currentHtml, tasks, context) -> candidateHtml + ExecutionProvenance`                | **outside core, behind `studio` CLI seam (G9)** |
| **3. Validator suite**   | core        | **pure** (no LLM, no network, **no clock**) | `validate(currentHtml, candidateHtml, batch) -> AdmissionVerdict` (V1–V9b, s6)               | new `validate-mutation-candidate.ts`            |
| **4. Recorder**          | core        | pure-effectful (store writes only)          | admit ⇒ persist HTML + append exactly-one revision + advance state; reject ⇒ persist nothing | `apply-approved-batch.ts` (refactored)          |

**DECISION D1 — generation is the only impure lane, and it is strictly upstream of admission.**
The proposer never writes to the store and never records a revision; it only emits a _candidate_ + a
provenance record across the CLI seam. The core owns the admission verdict and the only write path.
_Ergonomics rationale:_ this is the exact topology the team already runs (s1 §4: "core owns gates +
determinism, CLI is the seam") — no new mental model for operators, and it keeps the expressive
lane (advocate) and the provable lane (guardian) physically separable so a failure in one never
corrupts the other.

**DECISION D2 — the engine contract is a value-in / value-out CLI exchange, not a callback into the
core.** Claude Code receives a frozen input envelope and returns a candidate envelope; the core
does not hand the model a store handle, a clock, or the ability to append. (Full contract in §6.)
_Rationale:_ an out-of-process generative agent that can fail/timeout _after_ a human approved must
never be able to leave a torn store — the only thing it can produce is a candidate the core then
judges. Guardian-satisfying; advocate-neutral (the model still generates whole HTML freely).

**`sessionContext` (closing F2):** the proposer's third argument is **bounded and enumerated**, not
the whole session. It MAY see: `currentHtml`, the `tasks[]` (intent/acceptance/anchor/odId), the
session's `variantLabels`/`baseline` label (for visual consistency), and the **component library
manifest** (read-only) if present. It MUST NOT see: prior batches, the store, the manifest, or any
clock. _Rationale:_ richer context lifts proposal quality (advocate, DC2) without widening what the
non-deterministic lane can touch (guardian) — and it keeps the input envelope hashable for
provenance (§6).

---

## 2. WHERE DETERMINISM LIVES (the spine of the resolution)

**DECISION D3 — determinism lives in the validator/recorder lane inside the pure core, never in the
producer and never in the persist step alone** (adopts s6 §1 verbatim as the architectural spine).

Three sub-commitments make D3 enforceable rather than aspirational:

- **D3a — purity obligations (s6 §1).** No validator reads `Date.now()`, `Math.random`, env, or fs
  mtime. Every HTML-structural validator (V2/V3/V4/V6/V7/V8) operates on a **canonical parse**
  `Dom(html)`, not raw bytes. Enforced as a runtime self-check by **V8** (double-run verdict-hash
  equality + clock-free assertion).
- **D3b — one shared canonicalizer across the seam.** The single biggest source of _accidental_
  non-determinism is producer/validator canonicalizer drift (whitespace/attr-order noise reading as
  "changed" — s6 §8). The canonicalizer (`Dom`, `odIndex`) is **one module, used on both sides**:
  the CLI wraps it for the proposer's self-preview, the core uses it for validation.
  _Ergonomics rationale:_ without this, V2/V3 false-reject legitimate edits and the human watches
  good proposals bounce — the fastest way to destroy the trust C's ergonomics win depends on.
- **D3c — determinism is at ADMISSION, not at PRODUCTION.** We explicitly do **not** make the
  proposal reproducible (that is B/C's nature, s5). We make the _decision to admit_ reproducible
  (replay-by-verdict, V8). This is the honest content of "auditability 4 not 5" (s5) — recorded as
  the **determinism budget** in §8, not papered over.

_Guardian/advocate resolution:_ the guardian gets a pure, clock-free, replayable admission verdict;
the advocate keeps a fully free generative producer. Neither is asked to give ground inside its own
lane — the give is purely _topological_ (a seam), which is the cheapest possible trade.

---

## 3. Schema changes (make `DiffSummary` honest; thread the anchor; bind the revision)

All four changes are in `domain/models.ts`. GAP-1 and GAP-2 are shared prerequisites (paid under any
approach — s2 §6); the `DiffSummary'` and `ExecutionProvenance` shapes are C-specific honesty.

### 3.1 GAP-1 — thread `odId` into `MutationTask` (+ typed `changeType`)

```ts
export type MutationChangeType = "add" | "remove" | "change"; // was bare string (s1 §2)

export interface MutationTask {
  taskId: string;
  target: string; // CSS selector (kept — fallback anchor)
  odId: string | null; // NEW (GAP-1): stable atomic anchor; null ⇒ selector-only degrade
  intent: string; // verbatim, sacred (G7)
  changeType: MutationChangeType; // NEW: union, not string — statically constrains the 3 values
  acceptanceText: string;
  priority: string;
}
```

**DECISION D4 — `synthesize-mutation-batch.ts:toMutationTask` copies `comment.target.odId` into the
task** (closing the s1 §5 drop), and `changeType` becomes the union. **Checksum impact (guardian
must sign off):** the `sha256` over `{sourceRevisionId, generatedFromCommentIds, tasks}`
(`synthesize:172`) now incorporates `odId` — this is _correct_: the anchor is part of the bound
contract. It is a one-time chain re-baseline, not ongoing non-determinism (odId is itself
deterministic from the comment). _Rationale:_ without odId on the task, V2/V3/V4/V9 degrade to
porous selector matching (s6 per-validator notes) and the scope fence leaks — DC4 collapses.

### 3.2 Make `DiffSummary` honest — `DiffSummary'`

The dishonesty is structural (s1 §1.3, s2 §2.2): today `buildDiffSummary(batch)`
(`apply-approved-batch.ts:165`) tallies `changeType` substrings **before any HTML exists**, so it
can report "1 changed" against an HTML that never changed.

```ts
export interface DiffSummary {
  // KEEP shape for back-compat; numbers now DERIVED, not inferred
  added: number;
  changed: number;
  removed: number;
}

export interface OdDiffFragment {
  // NEW — the human-viewable, anchor-stable diff unit
  odId: string;
  changeKind: "added" | "changed" | "removed";
  beforeHtml: string | null; // canonical subtree before (null for added)
  afterHtml: string | null; // canonical subtree after  (null for removed)
}

export interface DiffSummaryHonest {
  // NEW — the DiffSummary' of s2 §2.2
  counts: DiffSummary; // derived from fragments, NOT from changeType
  unit: "od-id-subtree"; // the diff UNIT, named (F's "name the diff unit")
  fragments: OdDiffFragment[]; // per-od-id before/after — the saw-the-diff payload (G8/DC5)
  candidateHtmlHash: string; // canonical content hash of candidateHtml (binds the diff)
}
```

**DECISION D5 — the diff unit is the per-`od-id` canonical subtree, and the honest counts are
DERIVED from `odIndex` set-diff, never from `changeType`.** This is not a new computation: it is
exactly the `odIndex(current)` vs `odIndex(candidate)` set-diff that **V2/V3** already compute (s6
§3 — "honest-diff is a byproduct of V2, not a separate feature"). `buildDiffSummary(batch)` is
**deleted**; counts come from `fragments`. _Ergonomics rationale (the DC5 win):_ per-od-id
before/after fragments are the literal "saw-the-diff" payload — the human sees _which anchored
element changed, from what to what_, not a tally. Choosing the od-id subtree as the unit (over
line-diff or whole-file) is what makes the diff _anchor-stable_ (DC4) and survives whitespace noise
(D3b). RESIDUE-D: when `odId` is null (selector-only degrade), the fragment falls back to
selector-matched subtree — lower fidelity, flagged in the fragment.

### 3.3 GAP-2 — bind the revision to its produced HTML

```ts
export interface RevisionManifestEntry {
  // …existing fields…
  diffSummary: DiffSummary; // KEEP (back-compat); = DiffSummaryHonest.counts
  htmlArtifactRef: string; // NEW (GAP-2): path to the recorded nextHtml
  candidateHtmlHash: string; // NEW (GAP-2): canonical content hash (replay-by-record)
  provenance: ExecutionProvenance; // NEW (F9): how nextHtml was produced
  createdAt: string; // wall-clock — EXCLUDED from every validator hash (F3/D3)
}
```

### 3.4 `ExecutionProvenance` — make DC1 scoreable for C (closing F9)

```ts
export interface ExecutionProvenance {
  approach: "A" | "B" | "C"; // C here; A/B if a fallback fires
  // proposer (impure lane) — recorded, NOT replayable:
  model: string; // e.g. "claude-opus-4-8"
  promptHash: string; // sha256 of the frozen input envelope (§6)
  inputHtmlHash: string; // canonical hash of currentHtml seen by proposer
  outputHtmlHash: string; // canonical hash of candidateHtml returned (= candidateHtmlHash)
  // validator (pure lane) — REPLAYABLE:
  verdictHash: string; // V8 suite verdict-hash (clock-free) — the replay-by-verdict key
  validatorVerdicts: Array<{ code: string; pass: boolean; detail?: unknown }>; // per-validator V1..V9b
  // A-subset only (opportunistic, V9b):
  opsApplied?: unknown[]; // typed ops, when a structured op was carried
}
```

**DECISION D6 — `ExecutionProvenance` carries both the (non-replayable) proposer record AND the
(replayable) validator verdicts, and lands on the manifest entry.** _Rationale:_ this is what turns
"replay-by-verdict" from a claim into a checkable record (s6 §7). A future auditor proves "this
revision = that HTML (hash) that passed these validators (verdictHash) from this model/prompt
(promptHash)". The guardian gets a complete chain; the advocate pays only a recording cost, not a
generation constraint.

---

## 4. The apply state machine (propose → validate → accept/reject → revision)

This is the core ergonomic + safety mechanic and where s3's omissions (atomicity, idempotency,
partial-apply, the saw-the-diff _sequencing problem_) are resolved.

### 4.1 The sequencing problem, resolved with the dormant `RevisionApplied` state

s3 §4's most consequential omission: in B/C the human **approves before any HTML exists** (the model
generates at apply time), so a post-hoc diff is already head before it can be seen — DC5 is a lie
unless the lifecycle changes. The lifecycle enum _already_ carries an unused `RevisionApplied` state
between `MutationApproved` and `RevisionRecorded` (s1 §2, s3 §5).

**DECISION D7 — `RevisionApplied` becomes the PREVIEW / pre-record state: the candidate exists and
has passed validation, the honest diff is computed and shown, but it is NOT yet head.** This splits
the single "approve" gate into **two gates** (the s5 "preview/dry-run gate (dormant RevisionApplied
state) must be designed" residue, now designed):

```
MutationApproved                      (G2: batch approved — approve the TASKS/INTENT, not the HTML)
   │  apply requested (human actor, G1)
   ▼
[propose]  Claude Code → candidateHtml + provenance         (impure, behind CLI seam)
   │
   ▼
[validate] core runs V1..V9b on (currentHtml, candidateHtml, batch)   (pure)
   │
   ├── any REQUIRED validator fails ──────────► REJECT  (no state change, no write — §4.3)
   │
   ▼  all required pass
RevisionApplied                       (NEW use: candidate validated, DiffSummaryHonest computed,
   │                                   candidateHtml staged at a temp ref, NOT head)
   │  ── show fragments to human (the real saw-the-diff moment, DC5) ──
   │
   ├── human REJECTS the diff ─────────────────► back to MutationApproved (retry → re-propose, §4.4)
   │
   ▼  human ACCEPTS the diff (second gate, G1 human-attributed)
[record] persist HTML + append exactly-one revision + advance (§4.5 atomic)
   │
   ▼
RevisionRecorded                      (head moved, applyGate flips — as today)
```

**DECISION D8 — two gates: approve-intent (existing, on the batch) and accept-diff (new, on the
validated candidate).** _Ergonomics rationale (the whole DC5 win):_ the human now _sees the exact
HTML before/after they are accepting_, satisfying "saw-the-diff" honestly instead of approving a
counts-tally before HTML exists. This is the structural reason C scored ergonomics 5/5 and B 4/4
(s5 trimmed B for "approve-then-generate sequencing"). Guardian also wins: nothing becomes head
without a human who saw the real artifact (INV reinforcement of G1).

### 4.2 Validator-failure handling — reject / retry / repair

**DECISION D9 — fail-closed is the default; the three responses are explicitly distinguished.**

- **REJECT (terminal for this candidate).** Any **required** validator (V1/V2/V3/V4/V6/V7/V8/V9)
  fails ⇒ candidate discarded, **no revision recorded, no head move, no state change** (stays at
  `MutationApproved`). The failure code (e.g. `MUTATION_VALIDATOR_OUT_OF_SCOPE_CHANGE`) + offending
  detail are surfaced. _Rationale (guardian, F6/INV-6):_ a candidate the core cannot vouch for never
  becomes head — this is the deterministic answer to B's fail-open hole (s5 B-auditability 2.5).
- **RETRY (re-propose).** A reject (or a human diff-rejection at `RevisionApplied`) ⇒ the operator
  may **re-run `propose`**, which generates a _different_ candidate (non-idempotent by construction
  — s3 idempotency). Each retry is a fresh propose→validate cycle. **DECISION D10 — retry is bounded
  by a fixed `maxProposeAttempts` config** (no clock, pure policy) and each attempt's provenance is
  retained for audit. _Ergonomics:_ bounded retry stops an infinite "model can't satisfy the fence"
  loop from silently burning the operator's session; the failure code tells them _why_ it bounced so
  they can fix the comment or relax `S` (§4.6).
- **REPAIR (deferred option, not built now).** A soft-failure path where the core deterministically
  _normalizes_ a near-miss candidate (e.g. re-escape an unescaped text node for V7) instead of
  rejecting. **DEFERRED OPTION O1 — repair is dormant**: it risks the core _mutating_ generated
  output, which blurs the propose/admit lanes and re-opens "is the core reinterpreting?" (G7).
  Trigger to revisit: if retry-churn telemetry shows a dominant, mechanically-fixable failure class
  (e.g. V7 escaping) that the proposer reliably re-emits. Until then, repair = reject + retry.

**Soft validators and the C-1 lever.** V5 (acceptance-proxy) and, secondarily, V3's tightness are
**configurable soft** (warn, do not block) — this is the s5 condition **C-1** degradation path, wired
in §4.6.

### 4.3 / 4.5 Partial-apply, atomicity, rollback

s3 flagged that apply is **3 non-atomic store writes** (`saveBatch`, `appendRevision`, `saveSession`
— `apply-approved-batch.ts:140–142`); adding an HTML write makes it **4**, and the
`VARIANT_GENERATION_COUNT_MISMATCH` post-check (lines 144–155) _detects_ a torn state but throws
_after_ the writes — it does not roll back.

**DECISION D11 — produce-then-persist, single commit point, all-or-nothing record.** Adopt A's
produce-then-persist shape (s5 residue) for C:

1. **Produce fully before any persist.** `propose` + `validate` + `DiffSummaryHonest` all complete,
   and `candidateHtml` is written to a **staging ref** (not `htmlArtifactRef`) _before_ the human's
   accept-diff gate. Nothing in the store has moved yet.
2. **On accept, commit in one ordering with a defined rollback:** write `candidateHtml` to the final
   `htmlArtifactRef` **first** (idempotent: same hash ⇒ no-op), then the store triple
   (`saveBatch`/`appendRevision`/`saveSession`).
3. **DECISION D12 — partial-apply is FORBIDDEN at the batch granularity; apply is whole-batch
   all-or-nothing.** The proposer produces one `candidateHtml` for the whole batch; validators judge
   the whole candidate; record is one entry (preserves G5 exactly-one). There is no "4 of 5 tasks
   recorded" state. _Rationale:_ B/C regenerate whole HTML in one shot — there is no per-task
   granularity to partially commit (s3 multi-task note), and a half-applied prototype is exactly the
   torn state the guardian forbids. RESIDUE-A: the existing `VARIANT_GENERATION_COUNT_MISMATCH`
   post-check is **kept** as the append-once invariant _and_ upgraded to compensate (roll back the
   HTML write) if the triple tears — the recorder lane owns this (s6 §8 hands it here).

### 4.4 Idempotency / retry — connected to G8 (closing s3's idempotency gap)

**DECISION D13 — idempotency is defined at the VERDICT, not the PROPOSAL.** Re-running `validate` on
the identical `(currentHtml, candidateHtml, batch)` yields the byte-identical verdict (V8) — the
admission decision is idempotent even though re-running `propose` is not. **Crucially, the human
accepts a _specific staged candidate_ (by `candidateHtmlHash`), and `record` commits exactly that
hash** — a later retry cannot silently swap the HTML the human saw. This closes s3's "retry can
change post-approval output" coupling to G8: the accept-diff gate binds to a hash, so _what was seen
is what is recorded_. _Ergonomics rationale:_ this is the trust contract of the saw-the-diff gate —
the advocate's non-deterministic producer is allowed, but the guardian guarantees the _seen_ artifact
is the _recorded_ one.

### 4.6 The C-1 / C-2 levers wired into the machine

- **C-1 (auditability degrade, → B).** Config flags make V5 and/or V3 **soft**. If the buildability
  spike (RESIDUE-B) shows V5's structural proxy can't be trusted, set V5 soft — C stands on the
  V1–V4/V6–V9 floor (still strictly stronger than B). If V3 _also_ must go soft, C has demoted to B
  per s5 — the verdict flips, but the _machine does not change_ (same states, same recorder).
- **C-2 (op-vocabulary, → A).** If the real comment workload turns out enumerable, V9b becomes
  routinely applicable and `S` tightens; A's posture becomes rational. Again, no machine change —
  V9b stops being skipped. _Rationale:_ both fallbacks are _configuration_, not redesign — the s5
  conditional verdict is honored by making B and A reachable from C's own machine.

---

## 5. The deterministic validator set (from the s6 validator model)

The set is **adopted verbatim** from s6 §3 (approach-independent there; load-bearing admission
boundary here under C). Restated as the admission contract with required/soft criticality:

| #   | Validator               | Rule (one line)                                                    | Failure code                                | Criticality (C)              |
| --- | ----------------------- | ------------------------------------------------------------------ | ------------------------------------------- | ---------------------------- |
| V1  | target-exists           | each task anchor resolves to exactly one element in currentHtml    | `MUTATION_VALIDATOR_TARGET_NOT_FOUND`       | required                     |
| V2  | target-changed          | the addressed subtree actually differs current→candidate           | `MUTATION_VALIDATOR_TARGET_UNCHANGED`       | **required (load-bearing)**  |
| V3  | no-out-of-scope-change  | `ChangedSet ⊆ (TaskScope ∪ S)` via odIndex symmetric set-diff      | `MUTATION_VALIDATOR_OUT_OF_SCOPE_CHANGE`    | **required (the C-1 crux)**  |
| V4  | data-od-id-preserved    | dropped/appeared od-ids ⊆ owned removal/addition tasks             | `MUTATION_VALIDATOR_ODID_NOT_PRESERVED`     | required                     |
| V5  | acceptanceText-proxy    | structural shadow keyed on changeType; intent never re-parsed (G7) | `MUTATION_VALIDATOR_ACCEPTANCE_PROXY_UNMET` | **soft / pivotal (C-1)**     |
| V6  | well-formed-HTML        | parse + parse-reparse fixpoint                                     | `MUTATION_VALIDATOR_MALFORMED_HTML`         | required                     |
| V7  | text-escaped/sanitized  | no _new_ injection vector vs current; escaped round-trip           | `MUTATION_VALIDATOR_UNSAFE_CONTENT`         | required                     |
| V8  | idempotency (suite)     | double-run verdict-hash equality, clock-free                       | `MUTATION_VALIDATOR_NONDETERMINISTIC`       | required (self-check)        |
| V9  | diff-bounded            | `changeMagnitude ≤ B(taskCount)`, fixed monotone bound             | `MUTATION_VALIDATOR_DIFF_OUT_OF_BOUNDS`     | required (runaway guard)     |
| V9b | ops-vs-output-reconcile | opportunistic, A-subset only                                       | `MUTATION_VALIDATOR_OPS_OUTPUT_MISMATCH`    | optional (skipped if no ops) |

**Composite admission rule (DECISION D14):** _all required validators pass ⇒ admit; any required
fails ⇒ reject (fail-closed)._ Soft validators (V5, optional V3) emit warnings into provenance
without blocking. Codes use the existing `createUiPrototypingStudioError(...)` SCREAMING*SNAKE
convention (`apply-approved-batch.ts`), prefixed `MUTATION_VALIDATOR*\*` for grep-isolation.

**Two A-mechanics imported into C at low cost (s5 §5):** V9b (ops-vs-output reconciliation where a
structured op exists — stronger honesty guard) and the V3 per-task **same-od-id conflict detection**
(static: two tasks targeting one od-id, or one task removing another's anchor — the s3 multi-task
conflict case). These lift odid_stability toward 5 without forcing A's full schema burden.

**Run order (deterministic):** V6 (parse — nothing downstream trusts un-parseable input) → V1 →
V2/V4 → V3 → V7 → V9 → V9b → V5 (soft) → V8 (self-check over the whole run). Order is fixed so the
_first_ failure code is itself reproducible.

---

## 6. The engine contract (the CLI seam: what Claude Code receives / returns)

**DECISION D15 — the seam is a frozen JSON envelope in, a candidate JSON envelope out; the engine is
forbidden the store, the clock, and the record path** (implements D2, G9, `DEC-CLI-NOT-MCP-012`).

**Receives (`ProposeInput` — the whole thing is hashed into `provenance.promptHash`):**

```ts
interface ProposeInput {
  currentHtml: string; // head revision's prototype HTML (read-only)
  tasks: MutationTask[]; // intent (sacred, G7) + acceptanceText + odId + changeType + target
  context: {
    // bounded sessionContext (F2) — enumerated, not the session
    variantLabels: VariantLabel[];
    baselineLabel: VariantLabel;
    componentLibrary?: unknown; // read-only manifest, if present
  };
  canonicalizerVersion: string; // pins the shared canonicalizer (D3b)
}
```

**Returns (`ProposeOutput`):**

```ts
interface ProposeOutput {
  candidateHtml: string; // the proposed next-revision HTML — the artifact under judgment
  model: string;
  // engine MAY include a self-preview diff for the operator, but it is ADVISORY — the
  // core recomputes the authoritative DiffSummaryHonest from candidateHtml (never trusts this)
}
```

**The engine MUST:** realize every applied task's `intent` (G7 — realize, never reinterpret); keep
every `data-od-id` not owned by a remove task; return well-formed HTML. **The engine MUST NOT:**
touch the store, read a clock, append a revision, or move head — it returns a value and stops. **The
engine MAY:** vary whitespace/attribute order freely (the canonicalizer absorbs it, D3b); fail or
time out — in which case the core records nothing and the session stays at `MutationApproved`
(D2/D11). _Ergonomics rationale:_ a value-in/value-out contract is the simplest possible thing to
test, replay (via `promptHash`+`inputHtmlHash`), and reason about — and it makes the proposer
swappable (B-fallback is "same envelope, skip the validator's blocking role"; A-fallback is "core
computes candidateHtml from ops, no envelope at all").

---

## 7. How the design honors INV-3/4/5/6/8 + the saw-the-diff apply gate

The governance INV IDs are grep-negative (s1 §10); mapped here to their code-enforced analogues and
to the new mechanics. (Numeric INV→meaning mapping is inferred from s1 §6 / s2 §3's G-list; landing
the citable artifacts is RESIDUE-G.)

| Invariant                   | Meaning (per s1/s2)                             | How this design honors it                                                                                                                                                                                                                                                                                         |
| --------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **INV-3**                   | Approval before apply (G2)                      | Engine runs only on `status:"approved"` batch (`BATCH_APPROVAL_REQUIRED`, unchanged). The new accept-diff gate (D8) is a _second_ human gate, never a substitute for approval.                                                                                                                                    |
| **INV-4**                   | Staleness / head integrity (G4)                 | `BATCH_STALE_FOR_HEAD` unchanged; proposer edits `currentHtml` of the current head's source revision only (the envelope carries exactly that HTML, §6).                                                                                                                                                           |
| **INV-5**                   | Append-only, exactly one entry per apply (G5)   | Whole-batch all-or-nothing record (D12); `VARIANT_GENERATION_COUNT_MISMATCH` post-check **kept and upgraded to compensate** (RESIDUE-A). One propose→accept cycle ⇒ exactly one `RevisionManifestEntry`.                                                                                                          |
| **INV-6**                   | Determinism / reproducibility of the chain (G6) | Relocated to the admission boundary (D3): V8 makes the _verdict_ replayable; `ExecutionProvenance` + GAP-2 hash make the _revision↔HTML_ binding provable (D6). `createdAt` wall-clock excluded from every validator hash (F3/D3). Honest budget in §8 — INV-6 is satisfied at the _verdict_, not the _proposal_. |
| **INV-8**                   | Intent is sacred (G7)                           | Proposer _realizes_, never reinterprets (§6 MUST); V5 checks a **structural proxy** of acceptance and **never re-parses intent** (s6 V5 note); no core lane mutates intent or generated output (O1 repair stays deferred to protect this).                                                                        |
| **saw-the-diff apply gate** | OQ-2 / G8 / DC5                                 | The `RevisionApplied` preview state (D7) + per-od-id `OdDiffFragment` (D5) + hash-bound accept (D13): the human sees the **real** before/after of each anchored element and accepts the **exact** staged candidate that gets recorded. Counts-only dishonesty (deleted `buildDiffSummary`) is gone.               |
| **G1** auto-apply forbidden | (code)                                          | `AUTO_APPLY_FORBIDDEN` unchanged; _both_ gates require a human-attributed actor — auto-acceptance of a diff is as forbidden as auto-apply.                                                                                                                                                                        |

---

## 8. Determinism budget (honest about "auditability 4 not 5")

Carried from s6 §6, owned here as the design's stated limit (guardian transparency):

- **Reproducible — replay-by-verdict (all of C):** the admission _verdict_ and the
  `DiffSummaryHonest`/`odIndex` hashes for a fixed `(currentHtml, candidateHtml, batch)` (V8 + D3).
- **Reproducible — replay-by-record (GAP-2):** "this revision = that HTML hash that passed these
  verdicts" — provable from the manifest entry (D6).
- **NOT reproducible — the proposal itself:** a retry re-proposes different HTML. The design makes
  this _safe_ (fail-closed admission) and _auditable_ (provenance), **not deterministic**. This is
  precisely the 4-not-5 gap — it is priced, not eliminated. _If_ this gap is judged unacceptable
  (C-1 fires hard), the documented flip is to B (no determinism gain) or, on enumerable workloads,
  to A (5/5, via C-2) — both reachable from this machine (§4.6).

---

## 9. Residue / deferred options / handoff

**RESIDUE (carried, owner named):**

- **RESIDUE-A — recorder atomicity/compensation.** Upgrade `VARIANT_GENERATION_COUNT_MISMATCH` from
  detect-only to compensating rollback of the 4 writes (HTML + store triple). _Owner:_ recorder lane
  (`apply-approved-batch.ts` refactor). Adjacent to this design, not fully specified here (s6 §8).
- **RESIDUE-B — the C-1 buildability spike (the gating next action).** Stress-test whether V5's
  structural proxy and V3's scope fence can be made deterministic _and non-trivially strong_ against
  the shared canonicalizer on real comment workloads. If V5 fails ⇒ V5 soft (C stands). If V3 fails
  ⇒ C demotes to B (verdict flips). _Owner:_ a bounded local spike, with s4 GAP-R1 as the confirmed
  external fallback if the spike stalls. **This is the single thing standing between "C designed"
  and "C trusted."**
- **RESIDUE-C — the shared canonicalizer module.** Specify one `Dom`/`odIndex`/`canonicalizerVersion`
  module used on both sides of the seam (D3b); the dominant source of accidental non-determinism.
- **RESIDUE-D — selector-only degrade fidelity.** When `odId` is null, V2/V3/V4 and `OdDiffFragment`
  degrade to selector matching; document the weaker DC4 posture and surface it in provenance.
- **RESIDUE-G — land the governance IDs as citable artifacts** (`INV-3/4/5/6/8`, the DEC-\* ids,
  `OQ-2`). Honored as constraints here; not yet in-repo (s1 §10).

**DEFERRED OPTIONS (dormant levers, trigger named):**

- **O1 — REPAIR path** (§4.2): deterministic normalization of near-miss candidates. Dormant to
  protect G7 lane separation; revisit if retry-churn telemetry shows a dominant mechanically-fixable
  failure class.
- **O2 — A-fallback (C-2)**: if comments prove enumerable, promote V9b to routine + tighten `S`;
  A's 5/5 audit posture becomes rational. Reachable from this machine without redesign (§4.6).
- **O3 — B-fallback (C-1)**: if V3 can't be made deterministic, soften it; C is B. Same machine,
  flipped verdict.

**Handoff to plan/implementation:** schema deltas (§3) and the `validate-mutation-candidate.ts` lane
(§5) are the buildable units; RESIDUE-B (the C-1 spike) gates committing the V3/V5 tightness;
RESIDUE-A (recorder compensation) and RESIDUE-C (canonicalizer) are prerequisites for the
`RevisionApplied` two-gate machine (§4) to be safe.
