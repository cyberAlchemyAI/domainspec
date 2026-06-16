---
stage: s7-design-review
owner: interrogation-adversary
status: flag
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
verdict: FLAG (conditional pass — three required fixes before plan)
inputs:
  - stages/06-design.md
  - stages/06-validator-model.md
  - stages/05-approach-comparison.md
  - stages/02-define.md
code_evidence:
  - backend/src/modules/ui-prototyping-studio/application/apply-approved-batch.ts
  - backend/src/modules/ui-prototyping-studio/application/synthesize-mutation-batch.ts
  - backend/src/modules/ui-prototyping-studio/application/generate-variants.ts
  - backend/src/modules/ui-prototyping-studio/application/ports.ts
  - backend/src/modules/ui-prototyping-studio/domain/models.ts
---

# Design Review (Adversarial): Mutation Execution Mechanics

I attacked the s6 design holding the **guardian** lens: I tried to make a recorded revision
unreproducible where it claims reproducibility, to slip an out-of-scope edit past the validators, to
break the apply state machine on failure/retry/partial/torn-store, to show `DiffSummaryHonest` is
still dishonest, and to find an INV the mapping only _names_. The design is strong and internally
coherent — but it rests on **one buildability assumption that the code does not support**, has **two
validator-evasion holes it does not close**, and **one state-machine gap on the impure-lane failure
boundary**. Verdict: **FLAG**, not block — the architecture is sound and the fixes are local, but
three of them are _required_ before this can be planned, because each is a place where a "passed"
revision is not actually what the design claims.

Every finding below is graded **[BLOCK-LOCAL]** (must fix before plan — the design as written is
wrong or unbuildable on this point), **[FLAG]** (must be answered/decided, may not need a redesign),
or **[NOTE]** (honest residue, acceptable).

---

## A. Is determinism actually preserved where claimed?

### A1. [BLOCK-LOCAL] The whole design reads/writes HTML through a port that does not exist.

This is the load-bearing finding. Every determinism, diff, and validation claim in §2–§6 takes
`currentHtml` as input and stages/records `candidateHtml`. **There is no HTML content surface in the
system.** Verified against `application/ports.ts`: `StudioSessionStorePort` has
`saveSession/saveBatch/appendRevision/saveVariants/listVariants/...` and **zero** HTML read or write
methods. `PrototypeVariant.htmlArtifactRef` (`models.ts:136`) and `generate-variants.ts:56` set a
**synthetic path string** (`/artifacts/.../a.html`) that **nothing ever writes bytes to and nothing
ever reads bytes from** — grep confirms `htmlArtifactRef` is only ever assigned or echoed, never
dereferenced to content.

Consequences the design silently assumes away:

- §2 substrate (validator model) says `currentHtml` is "read from `htmlArtifactRef`" — there is no
  reader port, and the file it points at is never written by the current pipeline.
- §4.5 D11 step 1 stages `candidateHtml` "to a staging ref" and step 2 writes it "to the final
  `htmlArtifactRef`" — there is no HTML writer port, no staging concept, and `appendRevision` only
  takes a `RevisionManifestEntry` (metadata).
- The "4th write" the design counts (HTML + store triple, §4.3) **does not exist as a write** today;
  the design is correct that it _will_ exist, but it must first _introduce the port_, which §3 (the
  schema section) does not — it only adds a `htmlArtifactRef` _string_ field to the manifest entry.

**Required fix:** §3 / handoff must add an explicit **artifact content port** to the engine
contract — e.g. `readHtml(ref): string`, `stageHtml(stagingRef, html): void`,
`commitHtml(stagingRef, finalRef): void` (atomic move), and a way for the proposer's input envelope
to be _populated_ with real `currentHtml`. Without this port, lanes 3/4 have no input and the
recorder has nothing to commit. This is not a detail — it is the substrate the entire design
operates on, and it is currently absent from both the code and the schema-change section. (Cross-ref:
RESIDUE-C names the _canonicalizer_ module but **no residue names the artifact-store port** — that
is the actual gap.)

### A2. [FLAG] D3a self-check (V8) cannot detect the determinism leak that matters most.

V8 "double-runs the suite and asserts verdict-hash equality." But a clock/entropy read inside a
validator (the thing V8 claims to catch) frequently produces the _same_ value twice in a tight
double-run on one machine (e.g. `Date.now()` within the same millisecond, a seeded RNG, a cached env
read). V8 as specified is a **weak** guard: it catches _flapping_ nondeterminism, not _latent_
nondeterminism (different value on a different host/day — exactly the replay-by-verdict an auditor
runs _later_). The s6 model concedes V8 "fires only if a validator illegally consumed a
clock/entropy/IO source" — but the double-run mechanism does not reliably detect that.

**Required answer:** either (a) downgrade the V8 claim from "proves the suite is pure" to "catches
intra-run flapping; purity is otherwise enforced by code review / a no-`Date`/`Math.random` lint
rule on the validator module," or (b) specify a stronger mechanism (inject a frozen clock/RNG that
_throws_ on access inside the validator lane — capability denial, not value comparison). Option (b)
is the honest one and is cheap. As written, INV-6's "verdict is replayable" leans on a check that
does not actually establish it.

### A3. [NOTE] D4 checksum re-baseline is correctly disclosed.

Threading `odId` into the `sha256` over `{sourceRevisionId, generatedFromCommentIds, tasks}`
(`synthesize.ts:177`) is a one-time chain re-baseline, and `odId` is deterministic from the comment
(`comment.target.odId`, `models.ts:37`). The design flags this and signs it off as guardian-correct.
Accepted — but the plan must note this **invalidates every existing stored batch checksum**, so a
migration/version stamp on the checksum is needed or old batches will read as tampered. Minor, but
name it.

---

## B. Can the validators be fooled? (agent edits out of scope, validator misses it)

### B1. [BLOCK-LOCAL] V3's scope fence is blind to non-`od-id` regions — the largest evasion.

V3 (`ChangedSet ⊆ TaskScope ∪ S`) computes `ChangedSet` from the **symmetric set-diff of
`odIndex(current)` vs `odIndex(candidate)`** (s6 V3 + design D5). `odIndex` only indexes elements
**bearing `data-od-id`**. Therefore **any change to an element with no `data-od-id` is invisible to
V3.** The proposer (a free LLM, by design impure and adversarial-to-the-fence by construction) can:

- edit text/markup inside a non-anchored wrapper, sibling, or container;
- inject/alter `<style>`, `<script>` (V7 catches _script_ injection, but not a style rewrite, a
  `<link>` swap, a meta/viewport change, an inline `style=` on a non-anchored node);
- restructure the document skeleton (header/footer/nav) if those carry no `od-id`.

None of these appear in `ChangedSet`, so V3 admits them. The design asserts "only the subtrees named
by tasks may differ" but the _mechanism_ only enforces "only **od-id-bearing** subtrees named by
tasks may differ." **The scope fence has a hole the exact width of the un-anchored DOM** — and
prototypes are mostly un-anchored markup.

**Required fix:** V3's `ChangedSet` must be computed over a canonical diff of the **whole tree**, not
just `odIndex`. The od-id index is the _attribution_ key; the _change-detection_ must be
whole-document (every changed node attributed up to its nearest owning `od-id`, with any change not
dominated by a task's `od-id` subtree = out-of-scope). The design conflates "the diff unit is the
od-id subtree" (D5, fine for _display_) with "the change-detection domain is od-id subtrees" (wrong
for _enforcement_). Until this is fixed, B1 is the precise hole that makes C's odid/auditability
scores a fiction against a non-cooperative proposer — and the proposer is _defined_ as
non-deterministic and untrusted (D2).

### B2. [FLAG] V2 ("target changed") + V5 ("acceptance proxy") can be satisfied by a _cosmetic_ change.

V2 passes if the addressed subtree's hash differs; V5(`change`) passes if "the subtree hash differs
and still exists." Neither checks the change _relates to the intent_. A proposer that reorders an
attribute the canonicalizer does **not** normalize, or appends a whitespace-significant text node, or
flips a class, satisfies V2+V5 while ignoring the actual review comment. The design is explicit that
V5 is a _structural shadow_, not semantic — fine — but combined with B1 this means: **the validators
can pass while the proposer made a token change to the anchored element and made the _real_ (wrong)
change in un-anchored markup.** V2 proves _something_ changed at the anchor; it does not prove _the
right_ thing changed, and nothing proves _only_ the right thing changed (B1).

**Required answer:** acknowledge that V2+V5 prove "anchor touched + structurally plausible," not
"intent realized," and confirm this is the accepted ceiling (it is the honest content of
"expressiveness bounded by what validators admit," s5). This is acceptable _if disclosed in the
determinism/honesty budget §8_ — currently §8 only prices the _proposal-reproducibility_ gap, not the
_intent-fidelity_ gap. The budget is incomplete.

### B3. [FLAG] V9 diff-bound `B(taskCount)` is asserted but never anchored.

V9 rejects `changeMagnitude > B(taskCount)` for "fixed monotone `B`, e.g. `k*taskCount+c`." The
constants `k, c` (and V3's side-effect allowance `S`) are named as "policy in config" but **no
calibration or default is proposed**, and the trade is real: too loose and B1's hole widens (a
"runaway" of moderate size sails through); too tight and legitimate refactors false-reject (the
expressiveness-4 caveat). This is a knob that _defines_ the fence strength, left entirely unspecified.

**Required answer:** the plan must commit a starting `B`/`S`/`k`/`c` and the spike (RESIDUE-B) must
report their behavior on real workloads — otherwise "fail-closed" is fail-closed _at an unknown
threshold_, which is not auditable.

### B4. [NOTE] Imported A-mechanics (V9b, same-od-id conflict) are correctly low-cost.

V9b being skipped (not failed) when no ops carried is the right default. Same-od-id static conflict
detection is sound. No objection.

---

## C. Is the apply state machine complete? (failure / retry / rollback / partial)

### C1. [BLOCK-LOCAL] The impure-lane failure boundary is under-specified — propose can fail _during_ the gate.

D9/D10/D2 handle "proposer fails/times out ⇒ stay at `MutationApproved`, record nothing." But the
two-gate machine (D7/D8) introduces a window the failure model does not cover: after `validate`
passes, the candidate is **staged** and the session sits at `RevisionApplied` **waiting for a human
accept-diff gate that may never come** (operator walks away, session crashes, another batch is
synthesized against the same head). The design says `RevisionApplied` stages `candidateHtml` "at a
temp ref, NOT head," but does not specify:

- **Is `RevisionApplied` persisted or in-memory?** If persisted, what reaps an abandoned staged
  candidate, and does a stale staged candidate block a fresh `synthesize` (INV-4 staleness)? If
  in-memory, the "preview" is lost on any restart and the human re-proposes — silently re-entering
  B1/B2 with a _different_ candidate.
- **Can two batches reach `RevisionApplied` against one head?** D12 forbids partial-apply but says
  nothing about _concurrent_ staged candidates. The `StudioSession.state` is a single enum
  (`models.ts:10`), so the machine is implicitly single-flight — but that is not stated, and the
  staging ref naming/collision is undefined.

**Required fix:** specify `RevisionApplied`'s persistence, its single-flight invariant (one staged
candidate per head), its **expiry/abandon transition** back to `MutationApproved`, and what the staged
candidate's `candidateHtmlHash` binds to so a stale stage cannot be accepted against a head that
moved.

### C2. [FLAG] RESIDUE-A (compensating rollback) is the actual atomicity fix — and it is deferred, not designed.

The design's headline atomicity claim is D11 "produce-then-persist, single commit point,
all-or-nothing." But the _only_ mechanism named for the **commit** being atomic is the existing
`VARIANT_GENERATION_COUNT_MISMATCH` post-check "**upgraded to compensate**" — and that upgrade is
**RESIDUE-A**, explicitly "adjacent to this design, not fully specified here." So the design _claims_
all-or-nothing while _deferring the only thing that makes it all-or-nothing._ As it stands today
(`apply-approved-batch.ts:140–155`) the post-check **detects after the fact and throws — it does not
roll back**, and the design adds a 4th write (HTML) _in front_ of the triple, widening the torn-state
window.

This is borderline BLOCK. I keep it FLAG only because the _shape_ (write HTML first as idempotent
no-op by hash, then triple, compensate on tear) is correct and stated. **Required:** the plan cannot
treat RESIDUE-A as optional — atomicity is a claimed property of _this_ design (D11/INV-5), so the
compensation logic must be in scope of the same plan, not a later one. Name the exact rollback order:
if `saveSession` fails after `appendRevision` succeeded, what un-appends the revision? The store port
has `appendRevision` but **no `removeRevision`** (ports.ts) — so compensation is not even
_expressible_ against the current port. That makes C2 share A1's root cause: the port surface is
insufficient for the design's guarantees.

### C3. [FLAG] D13 hash-bound accept is correct but the binding is incompletely closed.

D13 ("human accepts a specific `candidateHtmlHash`; record commits exactly that hash") is the right
mechanic and genuinely closes the "retry swaps the seen artifact" hole. Good. **But:** what binds the
accepted hash to _this head_? If head moved (another apply landed) between stage and accept, the
staged candidate was produced against a now-stale `currentHtml`. D13 guarantees "seen == recorded"
but not "recorded was produced against current head." INV-4 (staleness) is asserted unchanged, but
the new two-gate window reopens it. **Required:** accept-diff gate must re-check
`batch.sourceRevisionId == session.revisionHeadId` (the existing `BATCH_STALE_FOR_HEAD` rule) _at
accept time_, not only at apply-request time.

### C4. [NOTE] Two-gate split (D7/D8) genuinely fixes the sequencing problem.

Activating the dormant `RevisionApplied` state (verified present and unused, `models.ts:18`) to host
the preview _before_ head moves is the correct resolution of the s3/s5 "approve-then-generate"
omission. The mechanic is sound; my objections are about its _failure/staleness edges_ (C1/C3), not
its happy path.

---

## D. Does `DiffSummary` become genuinely honest?

### D1. [FLAG] Honest _counts_, but the honesty inherits B1's blind spot.

Deleting `buildDiffSummary(batch)` (verified: `apply-approved-batch.ts:165–187` tallies `changeType`
substrings before any HTML exists — the design's dishonesty claim is **correct against the code**)
and deriving counts from `odIndex` set-diff is a real improvement. **However**, because the fragments
and counts are computed from `odIndex` (od-id-bearing nodes only — same root as B1), the
`DiffSummaryHonest` shown to the human **omits every un-anchored change.** So the human "saw the
diff" of the anchored elements and accepted — while un-anchored markup changed invisibly. The diff is
_honest about what it covers_ but _silent about its own coverage gap_. That is a subtler dishonesty
than the counts-tally it replaces.

**Required fix (couples to B1):** the diff unit can stay od-id-subtree for _display_, but the
fragment set must include a **"changed but unattributed" bucket** (changes not dominated by any
od-id) so the human sees that something outside the anchors moved — or, better, B1's whole-tree
`ChangedSet` makes such changes a V3 _reject_ and they never reach the diff. Either way, `DiffSummary`
is not "genuinely honest" until un-anchored change is either rejected (B1) or surfaced (D1).

### D2. [NOTE] `candidateHtmlHash` binding the diff is correct.

Pinning the fragment set to a content hash and recording it (GAP-2) is sound and supports
replay-by-record. RESIDUE-D (selector-only degrade when `odId` is null) is honestly flagged.

---

## E. Does it honor INV-3/4/5/6/8?

The design itself admits (lines 438–440) the **INV-numeric → meaning mapping is _inferred_** from the
G-list, and the IDs are grep-negative (RESIDUE-G). I verified: the define stage (`02-define.md`) uses
**G1–G9**, never `INV-3/4/5/6/8`. So the design is honoring _its own inferred mapping_
(INV-3≈G2-approval, INV-4≈G4-staleness, INV-5≈G5-append-once, INV-6≈G6-determinism, INV-8≈G7-intent),
not a cited governance artifact.

- **INV-3 (approve-before-apply / G2):** [PASS] `BATCH_APPROVAL_REQUIRED` unchanged
  (`apply-approved-batch.ts:78`); accept-diff is an _added_ gate, not a substitute. Correct.
- **INV-4 (staleness / G4):** [FLAG — see C3] honored at apply-request, **not** re-checked at the new
  accept-diff gate. The two-gate window reopens it.
- **INV-5 (append-once / G5):** [FLAG — see C2] claimed via D12, but the compensation that makes it
  true is RESIDUE-A and is not expressible against the current port (no `removeRevision`).
- **INV-6 (determinism / G6):** [FLAG — see A1/A2] relocated to admission honestly, but (a) rests on
  an artifact port that does not exist (A1), and (b) the V8 replay-by-verdict guarantee is weaker than
  claimed (A2).
- **INV-8 (intent sacred / G7):** [PASS, with B2 caveat] proposer realizes/never reinterprets; V5
  never re-parses intent; O1 repair stays deferred to protect lane separation. The _mechanism_ honors
  it. The honesty gap is B2 (passing validators ≠ intent realized), which is a _budget_ disclosure
  issue, not an INV-8 violation.
- **saw-the-diff (OQ-2/G8/DC5):** [FLAG — see C1/D1] the _gate_ exists (good), but it shows a diff
  with a coverage blind spot (D1) and the staged-state lifecycle is under-specified (C1).

**Required fix for E:** land RESIDUE-G (the citable INV artifacts) _or_ explicitly restate the design
in terms of the G-codes it can actually cite, so the mapping is not load-bearing-on-inference. A
design that "honors INV-6" by inferring what INV-6 means is honoring a guess.

---

## F. Is the engine contract precise enough to build?

### F1. [FLAG] `ProposeInput` is hashable in claim, not in fact.

D15 says the whole `ProposeInput` envelope is hashed into `promptHash`, pinning replay-by-record. But
the envelope contains `context.componentLibrary?: unknown` and `tasks` with `intent: string`
(free-text). `unknown` is not canonically serializable without a defined canonical form, and the hash
is only meaningful if the _exact same_ serialization is reproduced. The design pins
`canonicalizerVersion` for HTML but **does not pin a canonical JSON form for the envelope itself**
(key order, `unknown` shape, Unicode normalization). So `promptHash` is "a hash of _some_
serialization," not a reproducible key.

**Required fix:** specify the envelope's canonical serialization (or reuse the existing
`JSON.stringify` discipline from `synthesize.ts:177` and _type_ `componentLibrary` rather than leaving
it `unknown`). Otherwise `promptHash` cannot be recomputed by an auditor.

### F2. [NOTE] Value-in/value-out, no store/clock/append for the engine — correct and testable.

D2/D15's "engine returns a value and stops; core owns the only write path" is the right boundary and
the right thing for B/A-fallback swappability. The MUST/MUST-NOT/MAY list is clear. The advisory
self-preview being recomputed authoritatively by the core (never trusted) is exactly right. No
objection to the _shape_ — only F1 (hashability) and A1 (the envelope must be _populated_ with real
`currentHtml` via a port that doesn't exist yet).

---

## G. Verdict and required fixes

**FLAG — conditional pass.** The architecture (relocate determinism to admission; two-gate
preview/accept; value-in/value-out engine seam; honest diff derived from a tree diff) is the right
design and is internally coherent with s5/s6. It is **not blocked** because no finding requires
abandoning the approach. It is **not a clean pass** because three findings mean a "passed/recorded"
revision today would _not_ be what the design claims, and they are not buildable as written.

### REQUIRED before plan (BLOCK-LOCAL — fix or the design is wrong/unbuildable):

1. **A1 — introduce the artifact content port.** Add `readHtml/stageHtml/commitHtml` (or equivalent)
   to `StudioSessionStorePort` and populate `ProposeInput.currentHtml` from it. The entire design
   operates on HTML bytes the system never reads or writes today; `htmlArtifactRef` is a dangling path
   string. This also unblocks C2 (compensation needs a writable/removable surface).
2. **B1 — V3 change-detection must be whole-tree, not `odIndex`-only.** Compute `ChangedSet` over a
   canonical diff of the full document, attribute each change to its nearest owning `od-id`, reject any
   change not dominated by a task scope. As written, the scope fence is blind to all un-anchored
   markup — the majority of a prototype — making C's odid/auditability claims false against a
   non-cooperative proposer.
3. **C1 — specify the `RevisionApplied` staged-candidate lifecycle.** Persistence, single-flight
   (one stage per head), expiry/abandon transition, and stale-stage rejection. The two-gate machine
   introduces a wait-state the failure model does not cover.

### REQUIRED to answer (FLAG — decide, may not need redesign):

4. **A2** — restate V8 as flap-detection + capability-denial (throwing frozen clock/RNG), not
   "proves purity."
5. **C2** — pull RESIDUE-A (compensating rollback + a `removeRevision`-capable port) into _this_
   plan's scope; atomicity is a claimed property here, not a later one. Name the exact rollback order.
6. **C3 / INV-4** — re-check `BATCH_STALE_FOR_HEAD` _at the accept-diff gate_, not only at
   apply-request.
7. **D1** — surface or reject un-anchored change in `DiffSummaryHonest` (couples to B1); add the
   intent-fidelity gap (B2) to the §8 budget — currently §8 prices only proposal non-determinism.
8. **F1** — pin a canonical serialization for the `ProposeInput` envelope and type
   `componentLibrary`, or `promptHash` is not recomputable.
9. **E / RESIDUE-G** — cite the real INV artifacts or restate in citable G-codes; do not honor an
   inferred mapping as if load-bearing.

### Accepted as honest (NOTE):

- D4 checksum re-baseline (add a migration/version note).
- Two-gate split activating dormant `RevisionApplied` — verified present and unused in `models.ts`.
- D13 hash-bound accept (closes seen≠recorded) — sound, modulo C3's staleness edge.
- Engine value-in/value-out boundary (D2/D15) — sound and testable.
- V9b / same-od-id conflict imports — correctly low-cost.
- The §8 determinism budget's honesty about replay-by-verdict vs replay-by-rerun (4-not-5).

The design is buildable **after fixes 1–3**. Without them, fix 1 makes it _unbuildable_ (no HTML I/O),
fix 2 makes the headline auditability claim _false_, and fix 3 leaves a _torn lifecycle state_. The
spike RESIDUE-B remains the right gating next action, but it must now also exercise B1's whole-tree
scope diff (not just V5/V3 tightness) on real workloads.
