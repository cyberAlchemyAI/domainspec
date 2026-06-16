---
stage: s9-plan
owner: invoke-plan
status: pass
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
executed: false
selected_approach: C (Hybrid — agentic-propose + deterministic-validate)
inputs:
  - stages/06-design.md
  - stages/06-validator-model.md
  - stages/07-design-review.md
  - stages/08-toy-game.md
code_evidence:
  - backend/src/modules/ui-prototyping-studio/domain/models.ts
  - backend/src/modules/ui-prototyping-studio/domain/errors.ts
  - backend/src/modules/ui-prototyping-studio/application/ports.ts
  - backend/src/modules/ui-prototyping-studio/application/apply-approved-batch.ts
  - backend/src/modules/ui-prototyping-studio/application/synthesize-mutation-batch.ts
  - backend/src/modules/ui-prototyping-studio/application/studio-orchestration-module.ts
  - backend/src/modules/ui-prototyping-studio/infrastructure/file-studio-session-store.ts
  - backend/src/modules/ui-prototyping-studio/interface/http-routes.ts
---

# Plan: Mutation Execution Mechanics (NON-EXECUTED, layered)

This is a **non-executed implementation plan** for the chosen mutation-execution model (Approach C —
agentic-propose behind the CLI seam, deterministic-validate in the pure core). It turns the s6 design

- s6 validator model — as repaired by the s7 review and the s8 toy game — into an **ordered,
  layered build**: minimum-working-unit first, hardening last. Nothing here is implemented; this is the
  order, the seams, and the test obligations.

**How to read this plan**

- Every change is mapped to the **real backend module layout** verified against the code:
  `domain/` (models + errors), `application/` (use cases + ports + orchestration), `infrastructure/`
  (file store), `interface/` (http-routes today; the `studio` CLI seam is added here).
- Layers are ordered **MWU → hardening**. Layer boundaries follow value/cost: each layer ends at a
  point where the system is internally consistent and testable, and the _next_ layer adds strictly
  more safety/fidelity at strictly more cost.
- **Proposals are marked.** Per the gate discipline (no canonical mutation without approval), every
  item that changes a committed contract — the batch checksum, a domain type, a store port, a state
  transition, or a calibration constant — is tagged **[PROPOSAL — needs approval]**. The spike
  outcomes (RESIDUE-B) gate three of them and are tagged **[PROPOSAL — spike-gated]**.
- The plan honors the s7 verdict: **A1, B1, C1 are BLOCK-LOCAL and land in the MWU/early layers**;
  A2/C2/C3/D1/F1/E and R2/R4 are sequenced where the design requires them.

---

## 0. Ground truth (what the code actually has today)

Verified against the module, so the plan does not invent surfaces:

- `MutationTask` (`domain/models.ts:51`) has **no `odId`** and `changeType: string` (bare). GAP-1 is
  unpaid.
- `DiffSummary` (`models.ts:77`) is `{added,changed,removed}`. `buildDiffSummary(batch)`
  (`apply-approved-batch.ts:165`) tallies **`changeType` substrings before any HTML exists** — the
  structural dishonesty s2/s8 named.
- `RevisionManifestEntry` (`models.ts:83`) has `diffSummary` + `createdAt: new Date().toISOString()`
  (`apply-approved-batch.ts:130`, wall-clock). **No `htmlArtifactRef`, no hash, no provenance.**
- `StudioSessionStorePort` (`ports.ts:10`) has **zero HTML read/write methods** and **no
  `removeRevision`**. `PrototypeVariant.htmlArtifactRef` (`models.ts:136`) is a **synthetic path
  string never written and never read** (s7-A1, confirmed).
- `StudioSessionState` (`models.ts:10`) **already carries an unused `RevisionApplied`** between
  `MutationApproved` and `RevisionRecorded` — the dormant preview state (s6 D7, s7-C4 verified).
- Apply is **3 non-atomic writes** (`saveBatch`/`appendRevision`/`saveSession`,
  `apply-approved-batch.ts:140–142`) with a **detect-but-don't-rollback** post-check
  (`VARIANT_GENERATION_COUNT_MISMATCH`, lines 144–155).
- The seam today is `interface/http-routes.ts`; there is **no `studio` CLI and no proposer**.
- Errors flow through `createUiPrototypingStudioError("CODE", msg, detail)` (`domain/errors.ts`);
  all new codes use the `MUTATION_VALIDATOR_*` prefix for grep-isolation (s6 §5).

This ground truth is _why_ the MWU is "introduce the missing substrate," not "wire validators" — the
validators have no HTML to read until A1 lands.

---

## 1. Module-layout map (where each piece lives)

| Design element                                                                                   | Layer (DDD)    | File (new = ✚, edit = ✎)                                                                |
| ------------------------------------------------------------------------------------------------ | -------------- | --------------------------------------------------------------------------------------- |
| `MutationTask.odId` + `MutationChangeType` union (GAP-1)                                         | domain         | ✎ `domain/models.ts`                                                                    |
| `DiffSummaryHonest` + `OdDiffFragment`                                                           | domain         | ✎ `domain/models.ts`                                                                    |
| `RevisionManifestEntry.htmlArtifactRef/candidateHtmlHash/provenance` (GAP-2)                     | domain         | ✎ `domain/models.ts`                                                                    |
| `ExecutionProvenance` (F9)                                                                       | domain         | ✎ `domain/models.ts`                                                                    |
| New `MUTATION_VALIDATOR_*` codes (reuse factory)                                                 | domain         | ✎ `domain/errors.ts` (factory unchanged; codes are strings)                             |
| Shared canonicalizer `Dom`/`odIndex`/`canonicalizerVersion` (RESIDUE-C)                          | domain         | ✚ `domain/html-canonicalizer.ts` (pure, framework-free)                                 |
| Whole-tree diff + od-id attribution (R1)                                                         | domain         | ✚ `domain/html-tree-diff.ts` (pure)                                                     |
| Each validator V1..V9b (one module per check)                                                    | domain         | ✚ `domain/validators/v1-target-exists.ts` … `v9b-ops-reconcile.ts`                      |
| Validator suite runner + composite verdict (D14)                                                 | domain         | ✚ `domain/validators/validate-mutation-candidate.ts` (pure)                             |
| Frozen clock/RNG capability-denial guard (A2)                                                    | domain         | ✚ `domain/validators/purity-guard.ts`                                                   |
| Artifact content port (A1): `readHtml/stageHtml/commitHtml`; `removeRevision` (C2)               | application    | ✎ `application/ports.ts`                                                                |
| Engine/proposer port (D2/D15 value-in/value-out)                                                 | application    | ✎ `application/ports.ts` (`StudioMutationProposerPort`)                                 |
| `ProposeInput`/`ProposeOutput` envelope + canonical serialization (F1)                           | application    | ✚ `application/propose-envelope.ts`                                                     |
| `propose → validate → stage` use case (gate 1 result)                                            | application    | ✚ `application/propose-mutation-candidate.ts`                                           |
| `accept-diff → record` use case (gate 2 + atomic commit + staleness re-check)                    | application    | ✚ `application/accept-revision-candidate.ts`                                            |
| `apply-approved-batch.ts` refactor (recorder lane, compensation)                                 | application    | ✎ `application/apply-approved-batch.ts`                                                 |
| `synthesize` copies `odId` + checksum re-baseline (D4)                                           | application    | ✎ `application/synthesize-mutation-batch.ts`                                            |
| Wire new use cases into the module                                                               | application    | ✎ `application/studio-orchestration-module.ts`                                          |
| File store: HTML staging/commit dir, `removeRevision`, single-flight stage record                | infrastructure | ✎ `infrastructure/file-studio-session-store.ts`                                         |
| `studio apply` CLI: invoke proposer (Claude Code) → call propose/validate → render diff → accept | interface      | ✚ `interface/studio-apply-cli.ts` (+ adapter implementing `StudioMutationProposerPort`) |
| HTTP route parity (optional)                                                                     | interface      | ✎ `interface/http-routes.ts`                                                            |

**Purity discipline (D3a / A2):** everything under `domain/validators/`, `domain/html-canonicalizer.ts`,
and `domain/html-tree-diff.ts` is **pure** — no `Date`, no `Math.random`, no `node:fs`, no network.
A2's capability-denial guard (`purity-guard.ts`) wraps the suite so any clock/RNG access **throws**.
The impure lane (the proposer) lives **only** in `interface/` behind the CLI seam.

---

## 2. Layers (MWU → hardening), ordered

### Layer 0 — Substrate: schema + ports + canonicalizer (unblocks everything; closes A1)

**Goal:** make HTML a first-class, read/writable, hashable thing and thread the anchor — so the
validator/recorder lane has inputs to operate on. **Nothing downstream is buildable before this.**

**0.1 Schema migrations (domain).** [PROPOSAL — needs approval: domain contract change]

- GAP-1: add `odId: string | null` and change `changeType: string → MutationChangeType` (`"add" |
"remove" | "change"` union) on `MutationTask` (`models.ts:51`).
- `DiffSummaryHonest` + `OdDiffFragment` new interfaces (s6 §3.2). `DiffSummary` kept for back-compat
  (= `DiffSummaryHonest.counts`).
- GAP-2: add `htmlArtifactRef: string`, `candidateHtmlHash: string`, `provenance: ExecutionProvenance`
  to `RevisionManifestEntry` (`models.ts:83`).
- `ExecutionProvenance` new interface (s6 §3.4).
- Update `cloneTask`/`cloneRevision` in the file store (`file-studio-session-store.ts:280,297`) to
  carry the new fields (deep-clone discipline preserved).

**0.2 Artifact content port (application) — closes s7-A1 [BLOCK-LOCAL].** [PROPOSAL — needs approval: port surface change]

- Add to `StudioSessionStorePort` (`ports.ts:10`):
  - `readHtml(ref: string): string` — read prototype HTML bytes (the input `currentHtml`).
  - `stageHtml(stagingRef: string, html: string): void` — write a candidate to a staging location,
    NOT head.
  - `commitHtml(stagingRef: string, finalRef: string): void` — atomic move stage→final (idempotent
    by hash).
  - `discardStagedHtml(stagingRef: string): void` — reap an abandoned stage (used by C1 expiry).
- Implement in `file-studio-session-store.ts`: an `artifacts/` subtree mirroring the existing
  `<sessionId>/<label>.html` convention; `stageHtml` writes to `<sessionId>/.staging/<hash>.html`;
  `commitHtml` is `renameSync` (already the store's atomic-write primitive,
  `file-studio-session-store.ts:182`).
- **Backfill note:** existing `PrototypeVariant.htmlArtifactRef` strings point at files never
  written. `generate-variants` must be made to actually `stageHtml`/`commitHtml` the variant HTML, or
  the first `readHtml(currentHtml)` returns empty. Land this as part of 0.2 so currentHtml is real.

**0.3 Shared canonicalizer (domain) — closes RESIDUE-C.**

- `domain/html-canonicalizer.ts`: pure `Dom(html)` (fixed parser, sorted attrs, collapsed insignificant
  whitespace, normalized self-closing, preserved comments, `data-od-id` as identity attr — s6 §2),
  `odIndex(html): Map<odId, subtreeHash>`, and an exported **`canonicalizerVersion`** string constant.
- **The same module is used on both sides of the seam** (D3b): the CLI wraps it for the proposer's
  advisory self-preview; the core uses it for validation. This is the single biggest accidental-
  nondeterminism source — it lands in Layer 0 so every later validator builds on it.

**Layer-0 test obligations (deterministic unit):**

- `Dom` idempotence: `Dom(Dom(html).serialize()) ≅ Dom(html)` (parse-reparse fixpoint — also V6's basis).
- `odIndex` stability: same HTML ⇒ byte-identical index; attribute reorder / whitespace noise ⇒
  identical subtree hashes (the false-reject guard, s6 D3b).
- Store round-trip: `stageHtml` then `readHtml(commitHtml-target)` returns the staged bytes;
  `commitHtml` is idempotent for the same hash.
- `cloneRevision`/`cloneTask` carry the new fields (regression against the existing slice test).

**Exit criterion:** HTML can be read, staged, committed, hashed, and canonicalized deterministically;
the schema carries the anchor + provenance fields (still unused by logic). No behavior change yet.

---

### Layer 1 — MWU: the deterministic validator suite + composite verdict (pure, offline)

**Goal:** a **pure function** `validate(currentHtml, candidateHtml, batch) → AdmissionVerdict` that is
fully testable **without any proposer, store write, or state change**. This is the smallest unit that
demonstrates the design's core claim (determinism at admission) and the thing the RESIDUE-B spike
stress-tests.

**1.1 Whole-tree diff with od-id attribution (R1 / s7-B1 / TG-1) — closes BLOCK-LOCAL.**

- `domain/html-tree-diff.ts`: canonical **whole-document** diff of `Dom(current)` vs `Dom(candidate)`.
  Every changed/added/removed node — **anchored or not** — is attributed to its **nearest enclosing
  `data-od-id`**; changes with no enclosing od-id land in a distinguished `⊥` (unattributed) bucket.
- This module is what makes V3 document-wide. The toy game (Case 2-B) proved that without it an
  adversarial `<style>`/`<h2>` edit is admitted and hidden. **`odIndex` is the attribution/display
  key only; `html-tree-diff` is the change-detection domain.**

**1.2 One module per validator (domain/validators/).** Each is `(inputs) → {code, pass, detail}`:

| Module                   | Validator | Criticality           | Notes for the implementer                                                      |
| ------------------------ | --------- | --------------------- | ------------------------------------------------------------------------------ |
| `v1-target-exists.ts`    | V1        | required              | od-id exact; selector fallback may legitimately fail on ambiguity              |
| `v2-target-changed.ts`   | V2        | required              | **R2-gated** — see Layer 4; build the markup-only form now, behind a flag      |
| `v3-scope-bounded.ts`    | V3        | required (crux)       | consumes `html-tree-diff`; `ChangedSet ⊆ (TaskScope ∪ S)` AND `⊥ ∉ ChangedSet` |
| `v4-odid-preserved.ts`   | V4        | required              | set-diff of `odIndex` keys vs owned add/remove tasks                           |
| `v5-acceptance-proxy.ts` | V5        | **soft/pivotal**      | dispatch on `changeType`; **never parses `intent`** (G7)                       |
| `v6-well-formed.ts`      | V6        | required              | parse + parse-reparse fixpoint (runs first)                                    |
| `v7-text-escaped.ts`     | V7        | required              | **delta-injection** (new vs current), not absolute                             |
| `v8-idempotency.ts`      | V8        | required (self-check) | see A2 below — restated                                                        |
| `v9-diff-bounded.ts`     | V9        | required              | `changeMagnitude ≤ B(taskCount)`; constants from config (Layer 4)              |
| `v9b-ops-reconcile.ts`   | V9b       | optional              | **skipped** (not failed) when no ops; same-od-id static conflict import        |

**1.3 Suite runner + composite verdict (D14).**

- `domain/validators/validate-mutation-candidate.ts`: **fixed run order** V6 → V1 → V2/V4 → V3 → V7 →
  V9 → V9b → V5(soft) → V8 (s6 §5). All-required-pass ⇒ admit; any-required-fail ⇒ reject with the
  **first** failure code (order is fixed so the first code is reproducible). Soft validators emit
  warnings into the verdict, never block. Returns `AdmissionVerdict { admit, firstFailure?,
perValidator[], verdictHash, diff: DiffSummaryHonest }`.

**1.4 V8 restated as flap-detection + capability-denial (A2 / s7-A2).** [PROPOSAL — needs approval: claim change]

- `domain/validators/purity-guard.ts` injects a **frozen clock/RNG that throws on access** into the
  suite scope; V8 keeps the double-run verdict-hash equality (flap detection) **and** the guard makes
  latent clock/entropy reads a hard throw. The V8 claim is downgraded from "proves the suite is pure"
  to "catches intra-run flapping; latent purity enforced by capability denial + a no-`Date`/
  `Math.random` lint rule on `domain/validators/`." Honors INV-6 honestly.

**Layer-1 test obligations (deterministic validator unit tests — the spec's core requirement):**

- **One test file per validator**, each asserting pass AND the exact failure code on a crafted reject.
- **Reproduce the toy-game cases as fixtures** (the falsifying inputs become regression tests):
  - TG-1 / Case 2-B: adversarial `<style>` + `<h2>` edit ⇒ **V3 REJECT** (`OUT_OF_SCOPE_CHANGE`,
    `offendingOdIds`/`⊥`). This is the proof R1 landed.
  - Case 2-A: out-of-scope edit on anchored `card.hint` ⇒ V3 REJECT.
  - Case 1-A: clean in-scope inline-style change ⇒ ADMIT, one fragment.
  - TG-2 / Case 1.3: `33px` vs `48px` button ⇒ **identical ADMIT verdict** — asserted as a _known,
    documented limit_ (admit ≠ acceptance met), not a bug.
- **V8 determinism test:** double-run verdict-hash equality; a deliberately clock-reading mock
  validator throws via the purity guard.
- **Idempotency property test:** `validate` over a fixed triple yields byte-identical `verdictHash`
  and `DiffSummaryHonest` across N runs and across a serialize→reparse of inputs.

**Exit criterion (MWU):** the admission boundary exists and is provably pure and deterministic,
offline, with the toy-game falsifiers as passing regression fixtures. No proposer, no state change yet.

---

### Layer 2 — The two-gate apply state machine (propose → validate → stage → accept → record)

**Goal:** wire the pure suite into the lifecycle, activating the dormant `RevisionApplied` state as
the preview gate, with a value-in/value-out proposer seam. Closes the saw-the-diff sequencing problem
(D7/D8) and the impure-lane failure boundary (C1).

**2.1 Engine/proposer port + envelope (D2/D15/F1).**

- `application/ports.ts`: add `StudioMutationProposerPort { propose(input: ProposeInput): ProposeOutput }`
  — value-in/value-out, **no store/clock/append handle** (D2). The real Claude Code adapter lives in
  `interface/` (Layer 5); the core depends only on the port.
- `application/propose-envelope.ts`: `ProposeInput`/`ProposeOutput` types **and a canonical
  serializer** (closes s7-F1). [PROPOSAL — needs approval: hash contract] Pin canonical JSON form
  (sorted keys, Unicode NFC, **`componentLibrary` typed**, not `unknown`); `promptHash =
sha256(canonicalSerialize(ProposeInput))`. Reuse the `synthesize.ts:177` JSON discipline. Without
  this, `promptHash` is not recomputable.

**2.2 `propose → validate → stage` use case (gate 1).**

- `application/propose-mutation-candidate.ts`: on a `status:"approved"` batch at `MutationApproved`:
  1. build `ProposeInput` (populate `currentHtml` via `readHtml`, the bounded `context` per F2),
  2. call `proposer.propose(...)` (impure, may fail/timeout — D2),
  3. run `validate(...)` (pure),
  4. **reject** ⇒ no state change, surface `firstFailure` (D9); **admit** ⇒ `stageHtml(...)`, compute
     `DiffSummaryHonest`, advance session to **`RevisionApplied`**, return the staged candidate
     (hash + fragments) for the human.
- **Bounded retry (D10):** [PROPOSAL — needs approval: policy constant] `maxProposeAttempts` config;
  each attempt's `ExecutionProvenance` retained.

**2.3 `RevisionApplied` lifecycle (C1 / s7-C1) — closes BLOCK-LOCAL.** [PROPOSAL — needs approval: state semantics]

- **Persisted** staged candidate (survives restart, so the preview isn't silently re-proposed into a
  _different_ candidate).
- **Single-flight invariant:** one staged candidate per head. `StudioSession.state` is a single enum
  (`models.ts:10`), so the machine is implicitly single-flight — make it explicit; a second `propose`
  against a head with a live stage is refused (new code `MUTATION_VALIDATOR_STAGE_IN_FLIGHT` or
  reuse-and-replace policy — decide at approval).
- **Expiry/abandon transition:** `RevisionApplied → MutationApproved` reaps the stage
  (`discardStagedHtml`) — pure policy (e.g. a bounded `staleStageAttempts` counter, **no clock** in
  the core; wall-clock expiry, if wanted, lives at the CLI/interface edge).
- Staging ref naming = `candidateHtmlHash` (collision-free, content-addressed).

**2.4 `accept-diff → record` use case (gate 2 + staleness re-check).**

- `application/accept-revision-candidate.ts`:
  1. **C3 / INV-4 fix [BLOCK-adjacent FLAG]:** re-check `batch.sourceRevisionId ===
session.revisionHeadId` **at accept time** (the existing `BATCH_STALE_FOR_HEAD` rule, lifted from
     apply-request to accept). A stage produced against a now-moved head is rejected.
  2. **D13 hash-bound accept:** the human accepts a specific `candidateHtmlHash`; `record` commits
     **exactly** that hash — a retry cannot swap the seen artifact.
  3. human-attributed actor required (G1; auto-accept forbidden, mirror `AUTO_APPLY_FORBIDDEN`).
  4. hand to the recorder (Layer 3).

**Layer-2 test obligations:**

- State-machine unit tests with a **fake proposer** (deterministic stub returning a fixed candidate):
  approved → propose(admit) → `RevisionApplied` (staged, not head) → accept → `RevisionRecorded`.
- Reject path: proposer returns out-of-scope candidate ⇒ stays `MutationApproved`, nothing staged.
- Proposer failure/timeout ⇒ stays `MutationApproved`, nothing staged (D2).
- C1: abandoned stage ⇒ expiry transition reaps it; second propose against live stage refused.
- C3: head moves between stage and accept ⇒ accept rejected with `BATCH_STALE_FOR_HEAD`.
- D13: accept of hash X commits exactly X even if a fresh propose produced hash Y in between.

**Exit criterion:** the full happy path and the named failure edges run end-to-end against a fake
proposer, with the human seeing real before/after fragments before head moves.

---

### Layer 3 — Recorder hardening: atomic all-or-nothing commit + compensation (C2 / RESIDUE-A)

**Goal:** make the commit genuinely all-or-nothing (D11/D12), closing the torn-store window the new
4th write widens. The s7 review correctly insists this is **in this plan's scope**, not deferred —
atomicity is a _claimed_ property (INV-5).

**3.1 `removeRevision` on the port (C2) — atomicity is not even expressible today.** [PROPOSAL — needs approval: port surface change]

- Add `removeRevision(sessionId, revisionId): void` to `StudioSessionStorePort` and implement in the
  file store. Without it there is no way to un-append a revision when a later write tears.

**3.2 Refactor `apply-approved-batch.ts` into the recorder lane.**

- Replace `buildDiffSummary(batch)` (`apply-approved-batch.ts:165` — **deleted**, D5) with
  `DiffSummaryHonest.counts` derived from the staged candidate's fragments.
- **Commit order (D11) with defined rollback:**
  1. `commitHtml(stagingRef, finalRef)` — idempotent by hash (same hash ⇒ no-op).
  2. store triple: `saveBatch` → `appendRevision` → `saveSession`.
  3. **Compensation (RESIDUE-A):** upgrade the `VARIANT_GENERATION_COUNT_MISMATCH` post-check from
     detect-only to **compensating rollback** — if `saveSession` fails after `appendRevision`
     succeeded, `removeRevision` un-appends; if the triple tears, the committed HTML is rolled back
     (re-stage / delete final). **Name the exact rollback order in code** (s7-C2 requirement):
     reverse of commit order, HTML last to roll back because it is the idempotent anchor.
- `createdAt = new Date().toISOString()` stays wall-clock but is **excluded from every validator
  hash** (F3/D3); assert this in test.

**3.3 Provenance lands on the manifest (D6/GAP-2).** Populate `htmlArtifactRef`, `candidateHtmlHash`,
and `ExecutionProvenance` (approach `"C"`, model, `promptHash`, `inputHtmlHash`, `outputHtmlHash`,
`verdictHash`, `validatorVerdicts[]`) on the recorded `RevisionManifestEntry`.

**Layer-3 test obligations:**

- All-or-nothing: inject a store that throws on `saveSession` ⇒ assert the revision is **rolled
  back** (manifest count unchanged) and HTML is not orphaned.
- Idempotent commit: re-commit same hash ⇒ no duplicate, no error.
- Manifest carries provenance + hash; `createdAt` absent from `verdictHash`.
- Append-once (INV-5/G5): one accept ⇒ exactly one `RevisionManifestEntry`.

**Exit criterion:** a passed-then-failed-persist candidate never leaves a torn store; the manifest is
a complete, replayable audit record.

---

### Layer 4 — Calibration + the R2 decision (spike-gated; closes B3/TG-4 and TG-3)

**Goal:** turn the two policy knobs and the V2 CSS-soundness question from "unspecified" into
"committed and reported." Per s7-B3: _fail-closed at an unknown threshold is not auditable._ This
layer is **gated by the RESIDUE-B spike** and must not be implemented as guesses.

**4.1 Commit `S` / `B` / `k` / `c` (s7-B3 / TG-4).** [PROPOSAL — spike-gated: calibration constants]

- `S` (V3 side-effect allowance), `B(taskCount) = k*taskCount + c` (V9 bound) move to a **config
  module** (clock/entropy-free, so purity holds). The spike (RESIDUE-B) must **report behavior on
  real comment workloads** and commit starting defaults; the plan commits the _shape_ and the
  obligation, not the numbers.

**4.2 Resolve the V2 CSS-driven-change question (R2 / TG-3).** [PROPOSAL — spike-gated: V2 semantics]

- The toy game (Case 1-B) proved V2-as-written **false-rejects the idiomatic CSS way** of satisfying
  a sizing task (`<style>` edit, byte-identical subtree). The spike decides:
  - **R2-a:** V2 means "addressed markup differs"; CSS edits are declared by the task and attributed
    to the od-id by R1's whole-tree diff (needs a CSS-selector → od-id ownership map).
  - **R2-b:** extend the od-id subtree hash to include **resolved style declarations** via a
    deterministic, layout-free cascade (stronger; pulls CSS-cascade into the pure lane).
- Build V2 in Layer 1 as the markup-only form **behind a flag**; flip/extend here per the decision.

**4.3 C-1 / C-2 levers wired (s6 §4.6).** Config flags make V5 (and secondarily V3 tightness)
**soft** (C-1, → B), and promote V9b to routine on enumerable workloads (C-2, → A). [PROPOSAL —
needs approval: degradation policy] These are _configuration_, not redesign — the machine is unchanged.

**Layer-4 test obligations:**

- Boundary tests for `B`/`S` at the committed defaults (just-over rejects, just-under admits).
- R2 decision test: the chosen option admits the CSS-driven sizing candidate that Layer-1's
  markup-only V2 rejected (TG-3 regression flips from reject to admit).
- C-1 soft mode: V5 failure ⇒ warning, not block; V3 soft ⇒ verdict flips to B-equivalent floor.

**Exit criterion:** the fence strength is a committed, reported number, and the legitimate CSS path no
longer false-rejects.

---

### Layer 5 — Interface seam: the `studio apply` CLI + Claude Code proposer adapter

**Goal:** the operator-facing flow `studio apply` (propose via Claude Code → validate → show diff →
accept), the only place the impure lane lives.

**5.1 Proposer adapter (impure, interface layer).**

- `interface/` adapter implementing `StudioMutationProposerPort.propose` by invoking **Claude Code**
  (`DEC-RUNTIME-CLAUDE-CODE-011`, `DEC-CLI-NOT-MCP-012` — value-in/value-out CLI exchange, not MCP).
  It wraps the **shared canonicalizer** for an advisory self-preview (D3b); the core recomputes the
  authoritative diff and never trusts the preview.

**5.2 `studio apply` CLI flow (`interface/studio-apply-cli.ts`).**

1. `propose-mutation-candidate` (gate 1) → if reject, print `firstFailure` + detail and stop;
2. on admit, render the `OdDiffFragment[]` before/after to the operator (the saw-the-diff moment);
3. operator accepts → `accept-revision-candidate` (gate 2) → recorder → `RevisionRecorded`.

- HTTP parity optional via `interface/http-routes.ts`.

**5.3 Wire into the module.** `application/studio-orchestration-module.ts`: register
`proposeMutationCandidate` and `acceptRevisionCandidate`; thread the proposer port through
construction (`createStudioOrchestrationModule` gains a proposer dependency).

**Layer-5 test obligations:**

- Adapter contract test against a recorded Claude Code transcript (the adapter returns a
  `ProposeOutput`; failure/timeout returns a typed failure, not a torn store).
- **Toy-game-style e2e (the spec's e2e requirement):** the one-card prototype (button
  `data-od-id="cta.primary"`, task "increase tap target", `acceptanceText "button >= 44x44px"`) driven
  through the **full CLI** with a _scripted_ proposer (no live LLM in CI): admit path, the V3
  whole-tree reject path (adversarial `<style>`/`<h2>`), and the accept→record path. Asserts head
  moves only on accept, exactly one manifest entry, provenance recorded, and the diff shown contains
  no un-anchored surprise (R1).

**Exit criterion:** an operator can run `studio apply` end-to-end; the e2e exercises the same inputs
the toy game falsified, now passing.

---

### Layer 6 — Governance + migration closeout (E / RESIDUE-G, D4 checksum)

**Goal:** make the governance claims citable and migrate existing data safely. Lowest urgency, highest
auditability value.

**6.1 D4 — `synthesize` copies `odId` + checksum re-baseline.** [PROPOSAL — needs approval: checksum contract]

- `synthesize-mutation-batch.ts:toMutationTask` copies `comment.target.odId` (`models.ts:37`) into the
  task; `changeType` becomes the union. The `sha256` over `{sourceRevisionId, generatedFromCommentIds,
tasks}` (`synthesize.ts:177`) now incorporates `odId` — a **one-time chain re-baseline**.
- **Migration (s7-A3):** this **invalidates every existing stored batch checksum**. Add a
  **checksum version stamp** so old batches read as "v1, re-baseline pending," not "tampered." Name
  the migration in the plan; do not silently break stored sessions.

**6.2 E / RESIDUE-G — land citable INV artifacts.** [PROPOSAL — needs approval: governance]

- Either land `INV-3/4/5/6/8`, the `DEC-*` ids, and `OQ-2` as citable artifacts, **or** restate the
  design/code comments in the **G-codes that can be cited** (`G1–G9`, used by `02-define.md`). Do not
  honor an inferred INV→G mapping as if load-bearing (s7-E). The code-enforced analogues
  (`BATCH_APPROVAL_REQUIRED`, `BATCH_STALE_FOR_HEAD`, append-once, V8, `AUTO_APPLY_FORBIDDEN`) already
  exist; this layer makes the _naming_ honest.

**6.3 §8 budget disclosure (R3/TG-2/D1) — already in s6, asserted in code comments.** The
intent-fidelity ceiling (admit ≠ acceptance met; no geometry check in the pure lane) is documented on
`validate-mutation-candidate.ts` so a future maintainer does not mistake ADMIT for "acceptanceText
satisfied."

**Layer-6 test obligations:**

- Migration test: a stored v1 batch loads, re-baselines its checksum, and is not flagged tampered.
- Lint/grep test: `MUTATION_VALIDATOR_*` codes are grep-isolable; no `Date`/`Math.random` in
  `domain/validators/`.

**Exit criterion:** governance is citable, old data migrates cleanly, the honesty budget is recorded
where maintainers will read it.

---

## 3. Layer → s7/s8 obligation traceability (nothing dropped)

| s7/s8 obligation                               | Severity                | Landed in                                             |
| ---------------------------------------------- | ----------------------- | ----------------------------------------------------- |
| A1 artifact content port                       | BLOCK-LOCAL             | Layer 0.2                                             |
| B1 / TG-1 whole-tree V3 fence                  | BLOCK-LOCAL             | Layer 1.1 + 1.2(V3)                                   |
| C1 `RevisionApplied` lifecycle                 | BLOCK-LOCAL             | Layer 2.3                                             |
| A2 V8 capability-denial restatement            | FLAG                    | Layer 1.4                                             |
| C2 / RESIDUE-A compensation + `removeRevision` | FLAG (borderline BLOCK) | Layer 3.1 + 3.2                                       |
| C3 / INV-4 accept-time staleness re-check      | FLAG                    | Layer 2.4                                             |
| D1 un-anchored change surfaced/rejected        | FLAG                    | Layer 1.1 (rejected by R1)                            |
| B2 / TG-2 intent-fidelity gap (budget)         | FLAG                    | Layer 1 fixtures + Layer 6.3                          |
| B3 / TG-4 commit `B`/`S`/`k`/`c`               | FLAG                    | Layer 4.1 (spike-gated)                               |
| R2 / TG-3 V2 CSS-driven decision               | BLOCK-adjacent          | Layer 4.2 (spike-gated)                               |
| F1 `ProposeInput` canonical serialization      | FLAG                    | Layer 2.1                                             |
| E / RESIDUE-G citable INV artifacts            | FLAG                    | Layer 6.2                                             |
| A3 D4 checksum re-baseline migration           | NOTE                    | Layer 6.1                                             |
| RESIDUE-C shared canonicalizer                 | residue                 | Layer 0.3                                             |
| RESIDUE-D selector-only degrade fidelity       | residue                 | flagged in V1/V2/V3/`OdDiffFragment` per-module notes |
| O1 repair / O2 A-fallback / O3 B-fallback      | deferred options        | dormant; O2/O3 reachable via Layer 4.3 config         |

---

## 4. Proposals requiring approval before implementation (gate list)

No canonical mutation lands without explicit approval. Each item below changes a committed contract:

1. **[PROPOSAL]** Domain schema migration (GAP-1 `odId`+union, GAP-2 manifest fields,
   `DiffSummaryHonest`, `ExecutionProvenance`) — Layer 0.1.
2. **[PROPOSAL]** `StudioSessionStorePort` additions: `readHtml/stageHtml/commitHtml/discardStagedHtml`
   (Layer 0.2) and `removeRevision` (Layer 3.1).
3. **[PROPOSAL]** `RevisionApplied` state semantics: persisted, single-flight, expiry transition
   (Layer 2.3).
4. **[PROPOSAL]** V8 claim downgrade + capability-denial guard (Layer 1.4).
5. **[PROPOSAL]** `ProposeInput` canonical-serialization / `promptHash` contract; type
   `componentLibrary` (Layer 2.1).
6. **[PROPOSAL]** `maxProposeAttempts` retry-bound + C-1/C-2 degradation flags (Layer 2.2 / 4.3).
7. **[PROPOSAL — spike-gated]** `S`/`B`/`k`/`c` calibration constants (Layer 4.1, RESIDUE-B reports).
8. **[PROPOSAL — spike-gated]** V2 R2-a vs R2-b semantics (Layer 4.2, RESIDUE-B decides).
9. **[PROPOSAL]** D4 checksum re-baseline + version stamp migration (Layer 6.1).
10. **[PROPOSAL]** Governance: land citable INV artifacts or restate in G-codes (Layer 6.2).

**The single gating next action remains RESIDUE-B** (the C-1 spike), now expanded by s8 to: (a) build
and stress-test the whole-tree od-id-attributed V3 fence (R1), (b) decide V2 R2-a vs R2-b, and (c)
commit and report `B`/`S`/`k`/`c`. Layers 0–3 are buildable **before** the spike (the substrate, the
suite scaffold with V3-whole-tree, the two-gate machine, the recorder). Layer 4's _numbers and V2
semantics_ are spike-gated. This is the boundary between "C designed" and "C trusted."

---

## 5. Test strategy summary (deterministic validator units + toy-game e2e)

- **Deterministic validator unit tests (Layer 1):** one file per validator; pass + exact failure
  code; the toy-game falsifiers (TG-1/Case 2-B, Case 2-A, Case 1-A, TG-2/Case 1.3) become **passing
  regression fixtures**; V8 double-run + purity-guard throw; idempotency property test over a fixed
  triple.
- **State-machine unit tests (Layer 2):** fake proposer drives admit/reject/fail/abandon/staleness
  paths; hash-bound accept (D13).
- **Recorder atomicity tests (Layer 3):** injected store-failure ⇒ compensating rollback; append-once;
  provenance/hash on the manifest; `createdAt` excluded from `verdictHash`.
- **Calibration boundary tests (Layer 4):** `B`/`S` just-over/just-under; R2 flip; C-1 soft mode.
- **Toy-game-style e2e (Layer 5):** the one-card prototype through the full `studio apply` CLI with a
  **scripted** proposer (no live LLM in CI) — admit, V3 whole-tree reject, accept→record; head moves
  only on accept; exactly one manifest entry; no un-anchored surprise in the shown diff.
- **Migration test (Layer 6):** stored v1 batch re-baselines without a tamper flag; `MUTATION_VALIDATOR_*`
  grep-isolation; no clock/entropy in `domain/validators/`.

All validator/recorder tests run **offline and deterministically** (no LLM, no network, no real
clock in the gate) — which is the whole point of relocating determinism to admission (D3).
