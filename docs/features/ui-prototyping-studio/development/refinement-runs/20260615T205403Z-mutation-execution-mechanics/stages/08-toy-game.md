---
stage: s8-toy-game
owner: toy-game-runner
status: flag
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
verdict: FLAG (controlled case passes the mechanism but NOT the acceptance claim; adversarial case exposes the B1 scope-fence hole live)
inputs:
  - stages/06-design.md
  - stages/06-validator-model.md
  - stages/07-design-review.md
repairs_applied_to:
  - stages/06-design.md
  - stages/06-validator-model.md
---

# Toy Game: Falsifying the Mutation-Execution Model on a Controlled Scenario

This stage takes the **chosen execution model** (Approach C, s6 design + s6 validator model, as
flagged by the s7 review) and runs it as a literal worked example on a tiny, fully specified input.
The goal is **falsification, not confirmation**: I look for the smallest concrete case where the
model's claimed property does not hold. I run two cases:

- **Case 1 (controlled / cooperative):** the proposer does exactly the right thing. I trace every
  validator, the diff, and the two-gate accept. **Finding:** the _mechanism_ admits cleanly, but the
  worked example proves the model **cannot tell whether the acceptanceText was actually met** — it
  admits a candidate that may _not_ satisfy `>= 44x44px`. This is s7-B2 made concrete and reproducible.
- **Case 2 (adversarial):** the proposer also edits an out-of-scope element. I trace V3. **Finding:**
  the out-of-scope edit is **admitted** when it lands in un-anchored markup, because `ChangedSet` is
  computed from `odIndex` only. This is s7-B1 made concrete and reproducible — the scope fence has a
  hole the width of the un-anchored DOM.

Both findings were _named_ by s7. The toy game's contribution is to show them **firing on a minimal
input**, which converts "the reviewer thinks this is a hole" into "here is the input on which the
model gives the wrong verdict." I then name the required repairs and apply them to the model.

---

## 0. The sample input (fully concrete)

### 0.1 Prototype HTML at head (`currentHtml`)

```html
<!doctype html>
<html>
  <head>
    <style>
      .cta {
        height: 32px;
        padding: 4px 8px;
        font-size: 12px;
      }
      .hint {
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2 class="card__title">Checkout</h2>
      <button class="cta" data-od-id="cta.primary">Pay now</button>
      <p class="hint" data-od-id="card.hint">Secure payment</p>
    </div>
  </body>
</html>
```

Two anchored elements: `cta.primary` (the button) and `card.hint` (the paragraph). The `<style>`,
`<head>`, `<div class="card">`, and `<h2>` carry **no `data-od-id`** — they are un-anchored markup.
The button's tap target is `32px` tall (set by `.cta { height: 32px }`).

### 0.2 The MutationTask (the approved batch — one task)

```jsonc
{
  "taskId": "t1",
  "target": "button.cta", // CSS selector (fallback anchor)
  "odId": "cta.primary", // GAP-1 anchor (assumed landed, per s6 D4)
  "intent": "increase tap target", // verbatim, sacred (G7)
  "changeType": "change", // union value, per s6 GAP-1
  "acceptanceText": "button >= 44x44px",
  "priority": "P1",
}
```

`TaskScope = { cta.primary }`. Side-effect allowance `S = ∅` (no default proposed — s7-B3; I use the
tightest possible `S` for the toy game and flag that the default is unspecified).

### 0.3 The head/session state

`StudioSession.state = MutationApproved` (G2 satisfied: intent approved, HTML not yet generated).
`batch.sourceRevisionId == session.revisionHeadId` (not stale, INV-4/G4 holds at apply-request).

---

## CASE 1 — Controlled (cooperative proposer)

### C1.0 Lane 2 — the engine proposes (impure, behind the CLI seam)

`propose(ProposeInput) -> ProposeOutput`. The cooperative proposer realizes the intent the obvious
way: it bumps the button's height to `48px` and pads it so the tap target clears 44x44px. It returns
**only** `candidateHtml` (it never touches the store/clock — D2/D15).

`candidateHtml` (only the button-affecting region shown; rest byte-for-byte canonical-identical):

```html
<style>
  .cta {
    height: 48px;
    padding: 12px 16px;
    font-size: 16px;
  }
  <!-- changed -- > .hint {
    color: #666;
  }
</style>
...
<button class="cta" data-od-id="cta.primary">Pay now</button>
<!-- class unchanged; size comes from .cta -->
```

> **First falsification signal, surfaced immediately.** To make the tap target actually `>= 44x44px`
> the cooperative proposer changed the **`.cta` rule inside `<style>`** — an _un-anchored_ node — not
> the button element's own subtree. The button element's canonical subtree (`<button class="cta"
data-od-id="cta.primary">Pay now</button>`) is **byte-identical** before and after. Hold this; it
> breaks V2 below, and it is not a contrived case — _it is the natural way CSS-driven sizing works_.

To keep Case 1 a clean "happy path" trace first, I run **two sub-variants** of the cooperative
proposer and show the model behaves differently on each:

- **C1-A — proposer edits the element subtree** (adds an inline `style="height:48px;..."` _on the
  button_, so the change lands inside the `cta.primary` subtree).
- **C1-B — proposer edits the stylesheet** (the natural CSS way above).

### C1.1 Validator trace — variant C1-A (change lands on the anchored element)

Run order (fixed, s6 §5): V6 → V1 → V2/V4 → V3 → V7 → V9 → V9b → V5 → V8.

| #   | Validator              | Computation on this input                                                                                     | Verdict         |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------- | ---------- |
| V6  | well-formed            | `Dom(candidateHtml)` parses; parse-reparse fixpoint holds.                                                    | **PASS**        |
| V1  | target-exists          | `odIndex(currentHtml).has("cta.primary") === true` ⇒ count 1.                                                 | **PASS**        |
| V2  | target-changed         | `odIndex(current).get("cta.primary")` hash ≠ `odIndex(candidate).get("cta.primary")` (inline `style=` added). | **PASS**        |
| V4  | odid-preserved         | `before = {cta.primary, card.hint}`, `after = {cta.primary, card.hint}` ⇒ dropped=∅, appeared=∅.              | **PASS**        |
| V3  | no-out-of-scope-change | `ChangedSet = {cta.primary}` (set-diff of odIndex). `ChangedSet ⊆ (TaskScope ∪ S) = {cta.primary}`.           | **PASS**        |
| V7  | text-escaped           | No new `<script>`/`on*=`/`javascript:` node; changed text nodes round-trip.                                   | **PASS**        |
| V9  | diff-bounded           | `changeMagnitude =                                                                                            | ChangedSet      | = 1`; `B(1) = k\*1 + c`. With **any** sane non-zero `B`, `1 ≤ B(1)`. | **PASS\*** |
| V9b | ops-reconciliation     | No `changeParams` (pure-C task) ⇒ **skipped, not failed**.                                                    | **SKIP**        |
| V5  | acceptance-proxy       | `changeType="change"` ⇒ proxy = (subtree hash differs **and** target still exists). Both hold.                | **PASS (soft)** |
| V8  | idempotency (suite)    | Double-run verdict-hash equal; clock-free.                                                                    | **PASS**        |

`*` V9 PASS is **conditional on an unspecified bound** (s7-B3): `B`/`k`/`c` have no proposed default.
The toy game can only assert PASS by _assuming_ a non-degenerate `B`. Flagged.

**Composite admission (D14):** all required pass ⇒ **ADMIT**. Diff computed:

```jsonc
DiffSummaryHonest = {
  counts: { added: 0, changed: 1, removed: 0 },   // DERIVED from fragments, not changeType (D5)
  unit: "od-id-subtree",
  fragments: [{
    odId: "cta.primary",
    changeKind: "changed",
    beforeHtml: "<button class=\"cta\" data-od-id=\"cta.primary\">Pay now</button>",
    afterHtml:  "<button class=\"cta\" style=\"height:48px;padding:12px 16px\" data-od-id=\"cta.primary\">Pay now</button>"
  }],
  candidateHtmlHash: "<sha256 of canonical candidateHtml>"
}
```

**Two-gate accept (D7/D8/D13):** session → `RevisionApplied` (candidate staged at a temp ref, NOT
head). Human sees the one fragment (button before/after), accepts. `record` commits **exactly**
`candidateHtmlHash` (D13) → `RevisionRecorded`, head moves, one `RevisionManifestEntry` appended
(INV-5/G5). **Mechanism verdict for C1-A: clean admit.**

### C1.2 Validator trace — variant C1-B (change lands in the stylesheet, the _natural_ CSS way)

| #   | Validator      | Computation on this input                                                                                               | Verdict  |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| V6  | well-formed    | parses, fixpoint holds.                                                                                                 | **PASS** |
| V1  | target-exists  | `cta.primary` resolves, count 1.                                                                                        | **PASS** |
| V2  | target-changed | `odIndex(current).get("cta.primary")` == `odIndex(candidate).get("cta.primary")` — **the button subtree is identical**. | **FAIL** |

V2 **rejects** (`MUTATION_VALIDATOR_TARGET_UNCHANGED`, `{taskId:"t1", odId:"cta.primary"}`). Run
halts at first required failure (the failure code is itself reproducible by fixed run order).

> **This is the falsification.** The proposer did the **correct, idiomatic** thing — it made the
> button bigger by editing the CSS rule — and the model **rejected a legitimate, intent-realizing
> candidate** because the _anchored subtree_ did not change. V2's identity-by-od-id-subtree assumes
> the change is always _inside_ the anchored element. For a CSS/style-driven prototype that is false:
> the visible property the acceptanceText is about (`44x44px`) is governed by an _un-anchored_
> `<style>` rule. The model conflates "the element's markup changed" with "the element changed."

### C1.3 The deeper Case-1 finding — acceptance is never actually checked

Even in the **admitting** variant C1-A, look at what the model proved and did **not** prove:

- It proved: the `cta.primary` subtree changed (V2), changed in scope (V3), kept its od-id (V4),
  is well-formed (V6), safe (V7), bounded (V9), and the _change-type structural shadow_ held (V5).
- It did **not** prove: that the button is now `>= 44x44px`. **Nothing in the validator set evaluates
  computed geometry, CSS, or any pixel dimension.** V5 for `changeType="change"` is satisfied by _any_
  subtree-hash difference. So a proposer that set `style="height:33px"` — visibly failing the
  acceptanceText — produces the **identical ADMIT verdict** as one that set `height:48px`.

The acceptanceText `"button >= 44x44px"` is, in the chosen model, **decorative**: it rides along in
the task, is shown to the human at the diff gate, but is **never machine-checked**. The model's
admit verdict means "an anchored, in-scope, well-formed, safe, bounded change occurred," NOT "the
acceptance criterion is met." This is exactly s7-B2 ("validators prove anchor-touched + structurally
plausible, not intent realized"), now demonstrated on a minimal input.

---

## CASE 2 — Adversarial (proposer also changes an out-of-scope element)

Same task (`cta.primary`, "increase tap target"). The adversarial proposer does the right thing to
the button **and** smuggles an out-of-scope edit. I run **two adversarial sub-variants** to show the
fence catches one and misses the other — the boundary is the whole point.

### C2-A — out-of-scope edit lands on an _anchored_ element (`card.hint`)

The proposer enlarges the button (inline style on `cta.primary`, as C1-A) **and** rewrites the hint
paragraph's text from "Secure payment" to "FREE shipping!!!" — an edit to `card.hint`, which **no
task owns**.

| #   | Validator              | Computation                                                                                                                                               | Verdict  |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| V2  | target-changed         | `cta.primary` subtree differs.                                                                                                                            | PASS     |
| V4  | odid-preserved         | dropped=∅, appeared=∅ (both od-ids still present).                                                                                                        | PASS     |
| V3  | no-out-of-scope-change | `ChangedSet = {cta.primary, card.hint}` (both od-id subtree hashes changed). `TaskScope ∪ S = {cta.primary}`. `card.hint ∈ ChangedSet \ (TaskScope ∪ S)`. | **FAIL** |

V3 **rejects**: `MUTATION_VALIDATOR_OUT_OF_SCOPE_CHANGE`, `{offendingOdIds: ["card.hint"]}`.
**The fence works** — _when the out-of-scope element is anchored._ No revision recorded, no head move.

### C2-B — out-of-scope edit lands on _un-anchored_ markup (`<style>` / `<h2>`)

The proposer enlarges the button (inline style on `cta.primary`) **and** also (a) rewrites the
`.hint` color in `<style>` to `color:red`, and (b) changes the `<h2>` title text from "Checkout" to
"Checkout — SALE". **Neither the `<style>` rule nor the `<h2>` carries a `data-od-id`.**

`candidateHtml` (changes marked):

```html
<style>
  .cta { height: 48px; padding: 12px 16px; }                <!-- in-scope: drives the button -->
  .hint { color: red; }                                     <!-- OUT OF SCOPE, un-anchored -->
</style>
...
<h2 class="card__title">Checkout — SALE</h2>
<!-- OUT OF SCOPE, un-anchored -->
<button
  class="cta"
  style="height:48px;padding:12px 16px"
  data-od-id="cta.primary"
>
  Pay now
</button>
<p class="hint" data-od-id="card.hint">Secure payment</p>
<!-- card.hint subtree byte-identical -->
```

Now trace V3 **exactly as specified** (s6 V3 / design D5): `ChangedSet` = symmetric set-diff of
`odIndex(current)` vs `odIndex(candidate)` ∪ {od-ids whose subtree hash changed}.

- `odIndex(current)` keys: `{cta.primary, card.hint}`.
- `odIndex(candidate)` keys: `{cta.primary, card.hint}` (no od-ids added/dropped).
- Subtree hash changed: `cta.primary` (inline style added). `card.hint` subtree = `<p class="hint"
data-od-id="card.hint">Secure payment</p>` — **byte-identical** (the color change is in the
  un-anchored `<style>`, not in the `<p>` subtree). `<h2>` and `<style>` **are not in `odIndex` at
  all** — they bear no `data-od-id`.

Therefore:

```
ChangedSet      = { cta.primary }          // <style> .hint rewrite and <h2> edit are INVISIBLE here
TaskScope ∪ S   = { cta.primary }
ChangedSet \ (TaskScope ∪ S) = ∅           // V3 sees NO out-of-scope change
```

| #   | Validator              | Computation                                                                                                         | Verdict    |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------- | -------- |
| V6  | well-formed            | parses, fixpoint holds.                                                                                             | PASS       |
| V1  | target-exists          | `cta.primary` count 1.                                                                                              | PASS       |
| V2  | target-changed         | `cta.primary` subtree differs.                                                                                      | PASS       |
| V4  | odid-preserved         | dropped=∅, appeared=∅.                                                                                              | PASS       |
| V3  | no-out-of-scope-change | `ChangedSet \ (TaskScope ∪ S) = ∅`.                                                                                 | **PASS**   |
| V7  | text-escaped           | "Checkout — SALE" and `color:red` introduce **no** `<script>`/handler/`javascript:` — delta-injection check passes. | **PASS**   |
| V9  | diff-bounded           | `changeMagnitude =                                                                                                  | ChangedSet | = 1`(the un-anchored changes don't count) ≤`B(1)`. | **PASS** |
| V9b | ops-reconciliation     | no ops ⇒ skip.                                                                                                      | SKIP       |
| V5  | acceptance-proxy       | `change` proxy holds for `cta.primary`.                                                                             | PASS       |
| V8  | idempotency            | stable double-run.                                                                                                  | PASS       |

**Composite verdict: ADMIT.** The adversarial candidate — which silently rewrote the card title and a
stylesheet rule, edits **no task authorized** — is **recorded as head.** Worse, the
`DiffSummaryHonest` shown to the human at the accept-diff gate contains **one fragment**
(`cta.primary` button before/after) and is **silent about the `<h2>` and `<style>` changes**, because
fragments are derived from `odIndex` too (s7-D1). The human "saw the diff," accepted, and a title/style
change they never saw became head.

> **This is the adversarial falsification.** The model's headline claim — "only the subtrees named by
> tasks may differ" (D5/V3), the basis for C's auditability/odid scores over B — is **false on this
> minimal input.** The fence enforces "only **od-id-bearing** subtrees named by tasks may differ."
> Un-anchored markup (which is _most_ of a prototype: `<style>`, `<head>`, layout containers,
> headings) is outside the fence entirely. The set-diff-over-`odIndex` mechanism cannot see a change
> it has no key for.

### C2.3 Why V7 does not save us

One might hope V7 (sanitization) backstops B1. It does not: V7 is a _delta-injection_ check — it only
fires on **new** `<script>`/`on*=`/`javascript:`. The adversarial title/style/text rewrites are
perfectly benign markup; they introduce no injection vector. An adversarial-but-non-malicious
proposer (or simply a sloppy one) sails through. The hole is about **scope**, and only V3 owns scope.

---

## 3. Interpretation of failures

Three distinct failures, two of them the s7 BLOCK/FLAG items reproduced on a minimal input, one a new
sharpening:

| ID   | Failure (on the toy input)                                                                                                                                                                                       | s7 origin                     | Severity           |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------ |
| TG-1 | **V3 admits an out-of-scope change** when it lands in un-anchored markup (Case 2-B). The fence is `odIndex`-bounded, not document-bounded.                                                                       | s7-B1 (BLOCK-LOCAL)           | **BLOCK**          |
| TG-2 | **The acceptanceText is never machine-checked.** ADMIT means "anchored in-scope change occurred," not "`>= 44x44px` met" (Case 1-A/1.3).                                                                         | s7-B2 (FLAG, budget)          | **FLAG**           |
| TG-3 | **V2 false-rejects a legitimate CSS-driven change** (Case 1-B). The element's _rendered_ property changed via an un-anchored `<style>` rule, but its od-id subtree is byte-identical, so V2 reports "unchanged." | _new_ (sharpens s7-B1's dual) | **BLOCK-adjacent** |

TG-1 and TG-3 are the **same root cause seen from two sides**: the model identifies "change" with
"od-id subtree byte-diff." That over-includes nothing and **under-includes everything un-anchored** —
which means it (TG-1) lets un-anchored _adversarial_ change through and (TG-3) misses un-anchored
_legitimate_ change, false-rejecting it. The `odIndex` set-diff is the right _attribution_ key but
the wrong _change-detection domain_, exactly as s7-B1 stated — and the toy game shows the cost is
**symmetric**: false-admit (adversarial) and false-reject (legitimate CSS).

TG-2 is a **scope-of-claim** failure, not a mechanism bug. The model is _honest_ that V5 is a
structural proxy, but the s6 §8 budget priced only proposal non-determinism, not intent-fidelity. On
the toy input the gap is stark: a `33px` button and a `48px` button get the same verdict against an
acceptanceText that is literally about pixels. Either the model must **check geometry deterministically**
(hard — needs layout, arguably non-deterministic / out of the pure lane) or it must **explicitly
disclaim** that admit ≠ acceptance-met and price it in the budget.

A fourth, smaller observation (TG-4, NOTE): **V9's PASS is unfalsifiable as written** because `B`/`S`
have no default (s7-B3). The toy game _cannot decide_ V9 without assuming a bound; on this input any
non-degenerate `B` passes, but that is an assumption, not a result.

---

## 4. Required repairs (and what I applied to the model)

### R1 — (TG-1 / s7-B1) V3 change-detection over the whole canonical tree, attributed up to od-ids

`ChangedSet` must be the canonical **whole-document** diff, with **every** changed node — anchored or
not — attributed to its **nearest enclosing `data-od-id`**, and **any change with no enclosing od-id
(or enclosed only by an od-id not in `TaskScope`) is out-of-scope and rejected.** A change to
`<style>`, `<head>`, `<h2>`, or any un-anchored container that is not dominated by a task's od-id
subtree fails V3. The od-id index stays the _attribution/display_ key; it stops being the
_detection_ domain. (This is the exact s7-B1 required fix; the toy game confirms it is load-bearing
and that without it C's auditability claim is false on a one-card prototype.)

**Applied:** s6 validator-model V3 and s6 design D5/V3 row + §3.2 (diff coverage). See §5.

### R2 — (TG-3) V2 "changed" must be evaluated against the element's _effective_ render surface, or V2's claim must be narrowed

TG-3 is subtler than R1 and needs a decision, recorded here as the repair direction (the spike,
RESIDUE-B, must resolve which):

- **Option R2-a (narrow the claim):** V2 means _only_ "the addressed subtree's markup differs." Then
  CSS-driven changes legitimately route through R1's whole-tree diff: the `<style>` edit becomes an
  in-scope change **attributed to `cta.primary`** _iff_ the task declares a style/descendant
  allowance (the V3 `S` / structural-task closure). This keeps V2 pure but **requires tasks to declare
  when their realization may touch shared style**, and requires R1's attribution to map a `.cta` rule
  edit to the `cta.primary` subtree (non-trivial: CSS selector → od-id ownership).
- **Option R2-b (effective-style hash):** extend the od-id subtree hash to include the _resolved_
  style declarations that apply to that element (a deterministic, layout-free CSS cascade over the
  canonical tree). Then a `.cta { height }` change _does_ change `cta.primary`'s hash and V2 passes
  honestly. Stronger, but pulls a CSS-cascade engine into the pure lane — a real determinism/scope
  cost.

**Applied:** recorded as an explicit V2 caveat + a new spike obligation (the toy game proves V2 is
unsound for CSS-driven sizing as written). I did **not** pick a/b — that is RESIDUE-B's job; I made
the model _state the gap_ rather than silently claim V2 covers it. See §5.

### R3 — (TG-2 / s7-B2) Price the intent-fidelity gap in the §8 budget and disclaim acceptance

The model must say, in §8, that **admit ≠ acceptanceText satisfied**: the validators prove
anchored-in-scope-safe-bounded-changed, and the acceptanceText (esp. quantitative ones like
`44x44px`) is **not** machine-verified in this lane. The human accept-diff gate is the _only_ place
acceptance is judged, and it is judged **by eye**, not by the system. (s7-D1/B2 required this; the toy
game gives the budget a concrete worked example to cite.)

**Applied:** added to s6 design §8. See §5.

### R4 — (TG-4 / s7-B3) Commit a starting `B`/`S`/`k`/`c`

Not applied as a number here (the toy game is not the spike), but flagged as a hard precondition for
any future toy game to _decide_ V9 rather than assume it. Carried to RESIDUE-B.

> **Repairs NOT made here (out of this stage's scope, already owned by s7):** the artifact-content
> port (s7-A1), the `RevisionApplied` lifecycle (s7-C1), compensating rollback / `removeRevision`
> (s7-C2), accept-time staleness re-check (s7-C3), `ProposeInput` canonical serialization (s7-F1),
> RESIDUE-G citable INV artifacts, V8 capability-denial restatement (s7-A2). The toy game neither
> exercised nor contradicted these; they remain s7's required-before-plan list. TG-1 (R1) is the one
> the toy game independently re-confirms as BLOCK.

---

## 5. Repairs applied to the model (diffs landed in s6)

The toy game's mandate is to _apply_ repairs if needed. I applied the three that the worked example
directly proves (R1, R3, and the R2 V2-caveat), editing the two s6 artifacts in place:

1. **`stages/06-validator-model.md` — V3 (`no-out-of-scope-change`)**: rewrote the deterministic check
   from "symmetric set-difference of `odIndex`" to a **whole-tree canonical diff with od-id
   attribution**, with "any changed node not dominated by a `TaskScope` od-id ⇒ out-of-scope," and
   added the toy-game cross-reference.
2. **`stages/06-validator-model.md` — V2 (`target-changed`)**: added a **caveat** that V2's
   od-id-subtree identity is **unsound for CSS-/style-driven changes** (the rendered property changes
   via an un-anchored rule while the subtree is byte-identical), naming R2-a/R2-b as the spike's
   decision and pointing at TG-3.
3. **`stages/06-design.md` — §3.2 (`DiffSummaryHonest`) and D5**: noted that fragments derived from
   `odIndex` inherit the coverage blind spot, and that R1's whole-tree diff is what makes un-anchored
   change a V3 _reject_ (so it never silently reaches the diff) — coupling D5 to R1.
4. **`stages/06-design.md` — §8 (determinism budget)**: added the **intent-fidelity gap** (R3): admit
   ≠ acceptanceText met; quantitative acceptance (`44x44px`) is judged only by the human eye at the
   diff gate, never by the validator lane.
5. **`stages/06-design.md` — §5 V3 row + §9 RESIDUE-B**: V3 criticality note updated to "whole-tree
   scope diff"; RESIDUE-B spike scope expanded to exercise the whole-tree fence and the R2-a/R2-b
   decision (consistent with s7's closing instruction).

(The exact text landed is in the two files; this stage records _that_ and _why_.)

---

## 6. Verdict

**FLAG.** The chosen execution model's **happy-path mechanism works** (Case 1-A admits a clean,
in-scope, anchored change with a hash-bound two-gate accept). But the toy game **falsifies two of the
model's load-bearing claims on a one-card prototype**:

- The **scope fence is not document-wide** (TG-1 / s7-B1): an adversarial proposer's un-anchored title
  and stylesheet edits were **admitted and hidden from the diff**. The auditability/odid advantage C
  claims over B does not hold as the mechanism was written.
- The **acceptance criterion is never checked** (TG-2 / s7-B2): a `33px` button verdict ≡ a `48px`
  button verdict against `"button >= 44x44px"`.
- A sharpening the review did not state outright: the same `odIndex`-only assumption **false-rejects
  the idiomatic CSS way of satisfying the very task** (TG-3) — so the model is simultaneously too
  loose (admits adversarial un-anchored change) and too strict (rejects legitimate un-anchored change).

The repairs are **local and already shaped by s7** (R1 = s7-B1's whole-tree diff; R3 = s7-B2/D1's
budget disclosure), plus one new decision the toy game forces (R2, V2 vs CSS-driven change), deferred
to the RESIDUE-B spike. I applied R1/R2-caveat/R3 to the s6 artifacts. The model is plannable **after
R1 lands as code and R2 is decided by the spike** — which is consistent with s7's "required before
plan" list, now backed by a reproducible falsifying input.
