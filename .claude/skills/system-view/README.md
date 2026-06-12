# system-view

Author the upper half of a **system-view / engineer-view** pair — the shape-and-stakes
view of a target, explained at the altitude a stakeholder needs to judge whether the idea
is sound, **one conceptual layer at a time, with no schemas and no code**. It is the prose
sibling beside `ontology-view` (the terms) and `engineer-view` (the verdicts), and its
defining discipline is that it **names every load-bearing stance and decides none of them**.

## The problem

A stakeholder deciding whether a design is sound does not want the schema and does not want
the code. They want the *shape*: what this is, how it is built one layer at a time, where it
is fixed-and-obeyed versus optimized-toward versus merely-accumulating, and which load-bearing
choices are real tensions rather than settled answers.

But a shape document drifts in two predictable ways. First, it starts **deciding things** —
a paragraph that should *name* a tension ("moat versus sovereignty is a real tension") instead
*resolves* it ("the corpus is the moat"), and now the verdict lives in two places and will
diverge. Second, it starts **redefining terms** — restating what a term means instead of using
it, and now the canonical definition has a competing copy.

`system-view` refuses both. It owns the shape and **only** the shape:

1. **It names stances; it states no verdict.** Every load-bearing choice the shape rests on is
   named with the tension it carries and pointed across — `stance:<slug> → engineer-view#<id>` —
   to exactly one decision row. The verdict lives there, once.
2. **It uses terms; it redefines none.** Every term is the `ontology-view`'s term, used here and
   defined there. Where a definition is reached for, it becomes a use plus a pointer.

That two-move discipline — name-don't-decide, use-don't-redefine — is what makes the triad's
single-owner invariant hold: nothing is decided twice, no term is defined twice.

## When to use it

Reach for `system-view` when a target has (or is getting) an `engineer-view` decision inventory
and an `ontology-view` term graph — or any source corpus rich enough to mine a shape from — and
needs a stakeholder-altitude explanation a non-engineer can read to judge soundness. The payoff
is the cross-reference layer: every tension is named once and owned once, so a reader can descend
from "is this sound?" (here) to "what was decided?" (engineer-view) to "what does this term mean?"
(ontology-view) without ever meeting a contradiction.

Run the full multi-agent zig-zag only when the shape genuinely needs adversarial pressure —
competing framings of the surface, contested layer boundaries, stance handles that must be struck
if they resolve to nothing.

## When NOT to use it

- **Skip the heavy machinery if a one-paragraph summary suffices.** The default for an ordinary
  single-author run is the **light path** — the `single + N=1 + explorer` skip predicate drops the
  multi-*agent* dispatch. Zig-zag is opt-in, not the default, because no end-to-end zig-zag
  system-view exists yet (the lifecycle is transfer-validated). **But the skip never drops the
  skeptic / citation-strike pass, nor the cross-reference sub-pass** — every precedent is still
  verified on disk, every unverifiable citation is struck, and every stance handle is checked to
  resolve to a real engineer-view row with no verdict leaked and no term redefined.
- **Skip it entirely if there is no decision inventory to point stances at.** This view decides
  nothing; it points every stance across to `engineer-view`. With no decisions to reference, the
  pointer stances have no owner. (You can still author it with *provisional* handles and a blocker
  OQ if the engineer-view is merely *not yet written* — but if there will never be one, this view
  has nothing to defer to.)

## Core concepts

- **Surface** — "what this is", stated plainly at stakeholder altitude. No schemas, no code.
- **Layered shape** — the narrative told one conceptual layer at a time; each layer rests on
  choices that may carry a named stance, and each layer-section carries its own "alternative
  framings we considered" table.
- **Given-vs-optimized layering** (or its domain equivalent) — the discipline of separating what
  is **fixed-and-obeyed** (you do not tune it) from what is **optimized-toward** (the response
  surface you shape) from what merely **accumulates** (it grows; it is not optimization). Flattening
  this into "everything is a knob we tune" is the failure it guards against.
- **Named stance** — a load-bearing choice named with the tension it carries and **decided nowhere
  here**. Each emits a handle `stance:<slug> → engineer-view#<id>` resolving to exactly one owning
  decision row.
- **Alternative framings we considered** — one table per major section: the framings set aside and
  why. This is where the shape earns its credibility — it shows the roads not taken.
- **Shape diagrams (optional)** — flow/relationship sketches at stakeholder altitude. NO schemas,
  NO contracts.
- **"What this view does not cover" map** — the closing section: what `engineer-view` owns
  (verdicts, schemas, mechanics), what `ontology-view` owns (terms), and the closing
  nothing-decided-twice line.
- **Anti-bias multi-agent lifecycle** — `explorer -> skeptic -> writer -> auditor`. The wave recipe
  is composed by **enacting the `domainspec-subagents-strategy` SKILL** (the parent session enacts
  the strategist role — a Skill/slash invocation, **not** a Task target: there is no
  `domainspec-subagents-strategy` agent file to dispatch). The **Task tool** is then used only to
  dispatch the registered writer/explorer agents the strategy composes. It is a **PEER wave-recipe —
  NOT routed through `research`** (routing through `research` would create a two-orchestrator failure;
  `research` is a self-contained domain port keyed to `discoveries/`, not a generic dispatcher). The
  **writer is the synthesizer** — there is no separate "summarizer" role.

## Relationship to the sibling views

The three views divide the labor cleanly, and **nothing is decided twice**:

- **`ontology-view` owns the terms** — the single canonical home for each term, its typed relations,
  roles, and confidence. `system-view` **uses** terms; it never redefines one.
- **`system-view` owns the prose / shape** — the stakeholder-altitude explanation, one conceptual
  layer at a time, with stances named.
- **`engineer-view` owns the verdicts** — the full decision inventory (RESOLVED / OPEN / CRITICAL
  with authority cites). Here a stance is only a **pointer**; where the shape rests on a choice, this
  view names it and points across to its single owning row.

**Validation status — state it plainly:** `system-view` is **single-instance-validated**, against
the GoldenQuill / Tilth target only. No other target currently has a system-view artifact on disk.
The first non-GoldenQuill run is the reusability proof — this is not yet a "works for any target"
claim, and should not be presented as one. Sharper still: the witnessed instance is a **two-view
pair** (system-view + engineer-view) — the `ontology-view` sibling was authored afterward — so the
**three-way** single-owner invariant (term in ontology-view, verdict in engineer-view, shape here) is
**transfer-asserted across the witnessed pair, not witnessed end-to-end across the full triad on disk**.

## Governance

- **No verdict, ever.** The central governance claim of this view is that it decides nothing. Every
  stance is named and pointed across; a verdict stated here is a blocker at the Step 8 publication gate.
- **No redefinition, ever.** Every term is deferred to `ontology-view`; a term redefined here is a
  blocker at the publication gate.
- **Project-local overlay vs promotable artifact.** Coined framing and local domain language are kept
  in the project's own artifact with `governance_status: project-local-overlay`, and promotion is
  **halted** — because no codified external amendment-routing path exists yet. `system-view` is a
  read/author overlay, not a new promotion authority: it surfaces what must be filed and points to the
  owner, but it does not promote anything itself.
- **Constitution.** The hand-authored discovery frontmatter shape and the objective-first gate are
  inherited by reference from `discovery-writing.md` + `frontmatter.md`. The governing vault constitution
  in this repo's own tree (`C:\Users\victo\domainspec`) is `vault/ontology-conventions.md`, resolved on
  disk at **v2.3.0** (a lower-version embedded copy exists at
  `implementation/app-frontend/vault/ontology/ontology-conventions.md` at v1.5.1 — flagged as a stale
  mirror; do not resolve to it by nearest-path). Resolve the canonical constitution by highest version
  within the target's own repository tree, and record the resolved path/version on each run rather than
  trusting any literal printed here.
- **Telemetry** emits through **`domainspec-emit-signals`** to the project-under-analysis's
  **`docs/signals/pipeline-signals.jsonl`** — repo-root-anchored (nearest ancestor of the project
  containing `docs/signals/`, else nearest ancestor with `.git`; created if absent — several such files
  exist across the tree and none at repo root, so a bare relative path is underspecified). This is a
  mandatory epilogue and the sole sanctioned path. It does **not** emit Arcanum `sigil-invocations.jsonl`.

(Whether to elevate Task-vs-Agent or the no-verdict / no-redefinition discipline to canonical house
doctrine are owner's calls. Note: the Task-not-Agent choice is a **hand-authored-sibling convention** —
it diverges from every hand-authored sibling — and is *not* harness-enforced.)

## Lifecycle overview

Eight steps, with a draft / validate / review / publish gate split:

1. **Resolve** the target + sibling corpus; pin the term source (ontology-view) and the decision
   inventory (engineer-view) by absolute path.
2. **Compose** the anti-bias dispatch spec by enacting the `domainspec-subagents-strategy` SKILL
   (parent enacts the strategist role); the Task tool then dispatches the registered writer/explorer
   agents it composes — a peer wave-recipe, not a Task-dispatch of the skill.
3. **Validate** the spec; resolve the gate; bound retries; user-confirm before any dispatch.
4. **Dispatch explorers** -> author the surface + the layered shape (each layer with its own
   alternative-framings table); collect per-agent files.
5. **Name every stance** + emit its `stance:<slug> → engineer-view#<id>` handle; author the
   given-vs-optimized layering. State no verdict; redefine no term.
6. **Round-level review** (zig-zag) -> converge or exit with a typed reason, **verifying the three
   cross-reference invariants on disk** (every stance resolves to one row; no verdict stated; no term
   redefined); the exit reason is drawn verbatim from `research`'s 7-value enum.
7. **Write** the "what this view does not cover" map + open questions (non-contiguous OQ numbering is
   fine; blocker OQs flagged).
8. **Publication gate only** (does not re-run Step 6) — the stance-to-verdict cross-reference table,
   overlay-status check, and the `domainspec-emit-signals` epilogue.

The anti-bias pattern is `explorers -> skeptic -> writer -> auditor -> zig-zag -> converge`. The
**writer is the synthesizer** (no separate summarizer), authoring each round; converge or exit is the
reviewer's call. No end-to-end zig-zag system-view exists yet — the lifecycle is transfer-validated.

## Worked example

The canonical instance is the **GoldenQuill / Tilth** system-view (verified on disk):
`C:\Users\victo\domainspec-core\projects\goldenquill\victor\system-view.md`.

It is the one on-disk instance — generalize *from* it, do not copy its locals (CIC/CLC, the council
seats Scout/Scribe/Editor/Judge/Red Team/Logician, the six client identities, the eight capital logics,
the Five Operating Laws, KFR / Match DB are all GoldenQuill-specific and must not leak into a new
target's artifact). Things to note when reading it:

- It is the upper half of a **pair** — its companion is `engineer-view.md` in the same folder, whose
  decision inventory (D1–D10) is where every stance it names is owned. Each layered "shape" section
  (the two-axes claim, given-vs-optimized, the council, the learning loop, the sovereignty stance) is
  followed by an **"Alternative framings we considered"** table.
- It demonstrates the discipline cleanly: stances are **named and pointed across** — e.g. the
  optimization-target stance is named in prose and its verdict is stated *only* in `engineer-view.md`
  (row D5a); the coupling, calibration-discipline, moat-vs-sovereignty, learning-loop-criticality, and
  business-model stances are each named here and decided over there.
- Its closing **"What this view does not cover"** section enumerates exactly what the engineer-view owns
  (the decision inventory, the schemas/contracts, the runtime mechanics, the eligibility ladder) and ends
  on the nothing-decided-twice line.

Honest caveat: this is the **only** on-disk system-view, and it was authored as a two-view pair before
the ontology-view sibling existed — so it witnesses the system-view/engineer-view half of the contract
directly and the full three-view triad only by transfer. The first non-GoldenQuill run is the proof.
