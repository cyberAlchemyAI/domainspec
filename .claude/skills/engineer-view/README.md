# engineer-view

Author the **engineer-view** — the lower half of a `system-view` / `engineer-view` pair.
Where the system-view explains the *shape* of a target and **names** the load-bearing stances
without deciding them, the engineer-view **refines** that shape down to the mechanics and is
where every named stance gets its **single owning verdict**. It owns the decision inventory, the
schemas and contracts, and the runtime mechanics; it decides nothing the ontology-view should
define and re-narrates nothing the system-view should shape.

## The problem

A system-view *names* a target's load-bearing stances and then deliberately stops — "the coupling
stance is named here; the verdict lives in engineer-view." That is the right altitude for a
stakeholder judging whether the idea is sound, but it leaves the stances *undecided*. Someone has
to actually decide each one, attach a status, and cite the authority that makes the verdict stick —
and that work must live in exactly one place, or the same stance gets decided two different ways in
two different documents and they drift.

`engineer-view` is that one place. Its discipline is the **decision inventory**: every stance the
system-view names resolves to exactly one row, each row carries a verdict, a status, and an
authority verified on disk. A stance with no row is an *orphaned-stance blocker*; a stance with two
rows is a *duplicate-verdict violation*. Nothing is decided twice, and nothing named is left
undecided.

## When to use it

Reach for `engineer-view` when a target already carries a **system-view** (or any source corpus
rich enough to mine load-bearing stances from) **and** those stances now need to be *decided* — each
with a verdict, a status, and a cited authority — alongside the schemas/contracts and runtime
mechanics that turn the shape into machine reality. The payoff is the single-owner decision
inventory: one auditable home where every load-bearing verdict lives, each pointing up to the
stance it answers and down to the authority that enforces it.

Run the full multi-agent zig-zag only when the target genuinely needs adversarial pressure —
contested verdicts, authorities that must be struck if they cannot be verified, a thesis whose
CRITICAL blockers are disputed.

## When NOT to use it

- **Skip it if there is no system-view (or equivalent) naming stances to resolve.** This view does
  not invent stances; it decides the ones named upstream. With nothing named, there is no inventory
  to own.
- **Skip the heavy machinery if a simple inventory lookup suffices.** The default for an ordinary
  single-author run is the **light path** — the `single + N=1 + explorer` skip predicate drops the
  multi-*agent* dispatch. Zig-zag is opt-in, not the default, because no end-to-end zig-zag
  engineer-view exists yet (the lifecycle is transfer-validated). **But the skip never drops the
  skeptic / authority-strike pass** — every verdict's authority is still verified on disk, and any
  RESOLVED row resting on an unverifiable authority is downgraded to OPEN, because an unverified
  authority is the failure that most corrupts a decision inventory.

## Core concepts

- **Decision inventory** — the table at the heart of the view. Columns: **# | Decision-or-stance |
  Verdict | Status | Authority**. Every stance named in the system-view resolves to exactly one row.
- **Status legend** —
  - **RESOLVED** — decided *and* enforced (a verdict is reached and a gate/authority enforces it on
    disk).
  - **OPEN** — named, not decided (acknowledged but no verdict enforced; includes
    *designed-but-not-built* rows).
  - **CRITICAL** — OPEN *and* blocks the core thesis until built/decided. The subset of OPEN a
    stakeholder must resolve before the central value claim holds.
- **Authority citation** — every row cites a file / ADR / architecture-version / running gate
  verified on disk, **or** an explicit "no running gate in repo" for an OPEN/CRITICAL row. A verdict
  with no citable authority is OPEN-by-default, never RESOLVED. A RESOLVED row whose cited authority
  cannot be verified is **struck and downgraded** to OPEN — the engineer-view analogue of the
  ontology-view LIVE->PLANNED downgrade.
- **Single verdict per stance** — the mapping from named stances to decision rows is bijective: zero
  rows = orphaned-stance blocker; two rows = duplicate-verdict violation.
- **Anti-bias multi-agent lifecycle** — `explorer -> skeptic -> writer -> auditor`. The wave recipe
  is composed by **enacting the `domainspec-subagents-strategy` SKILL** (the parent session enacts
  the strategist role — a Skill/slash invocation, **not** a Task target: there is no
  `domainspec-subagents-strategy` agent file to dispatch). The **Task tool** is then used only to
  dispatch the registered writer/explorer agents the strategy composes. It is a **PEER wave-recipe —
  NOT routed through `research`** (routing through `research` would create a two-orchestrator
  failure; `research` is a self-contained domain port keyed to `discoveries/`, not a generic
  dispatcher). The **writer is the synthesizer** — there is no separate "summarizer" role.

## Relationship to the sibling views

The sibling views divide the labor cleanly, and **nothing is decided twice**:

- **`ontology-view` owns the typed schema** — the single canonical home for each term, its typed
  nodes/edges and forbidden-edge guards. (Term *meaning*.)
- **`system-view` owns the shape / prose** — the stakeholder-altitude explanation, the
  given-vs-optimized layering, the load-bearing stances **named but not decided**. (Target *shape*.)
- **`engineer-view` owns the verdicts** — the full decision inventory where every named stance gets
  its single owning verdict with a status and a cited authority, plus the schemas/contracts and the
  runtime mechanics. (Target *mechanics + decisions*.)

So the engineer-view *refines* the system-view's shape down to mechanics, **owns every verdict**,
defers shape up to system-view, and defers term meaning down to ontology-view. Every stance named in
system-view resolves to exactly one engineer-view row.

**Validation status — state it plainly:** `engineer-view` is **single-instance-validated**, against
the GoldenQuill / Tilth engineer-view only (see *Worked example*). No other project currently has a
validated engineer-view artifact on disk. The first non-GoldenQuill run is the reusability proof —
this is not yet a "works for any target" claim, and should not be presented as one. Sharper still:
the one witnessed instance carries **no `governance_status` overlay field** and **emits no
`domainspec-emit-signals` envelope** — both are skill-introduced disciplines this view adds. So the
overlay-status and telemetry disciplines are **unwitnessed on disk — transfer-asserted, not
validated** — and the worked example is a model of the decision-inventory discipline, not of those
two.

## Governance

- **Produced artifact is a project-local overlay.** The engineer-view rides `node_type: discovery`
  and carries `governance_status: project-local-overlay`, which keeps it out of promotion until the
  owning amendment is filed. It is a read/author overlay, not a new promotion authority: it surfaces
  what must be filed and points to the owner, but promotes nothing itself.
- **Frontmatter inherited by reference.** The objective-first (<=3-sentence) gate and the
  hand-authored discovery frontmatter shape are inherited **by reference** from
  `discovery-writing.md` + `frontmatter.md`; the only local delta is `governance_status:
  project-local-overlay`. Bootstrap-only fields (`surface_kind` / `canonical_source` /
  `generated_by` / `mutation_policy`) are forbidden — they assert a regenerate-from-source contract
  that does not exist for a hand-authored artifact.
- **Authority discipline.** Every verdict cites an on-disk authority; an unverifiable authority is
  struck and its RESOLVED row downgraded to OPEN. Confidence (`veracidade` / `convicção`), where any
  belief-bearing node appears, follows the `ontology-conventions.md` Applicability convention. (The
  constitution on disk at `vault/ontology-conventions.md` is `v2.3.0` and uses *named headings*, not
  a `§N` scheme — resolve the heading at run time; a lower-version copy at
  `implementation/app-frontend/vault/ontology/ontology-conventions.md` is `v1.5.1`.)
- **Telemetry** emits through **`domainspec-emit-signals`** to the project-under-analysis's
  **`docs/signals/pipeline-signals.jsonl`** — repo-root-anchored (nearest ancestor of the project
  containing `docs/signals/`, else nearest ancestor with `.git`; created if absent). This is a
  mandatory epilogue and the sole sanctioned path. It does **not** emit Arcanum
  `sigil-invocations.jsonl`.

(Whether to elevate the Task-vs-Agent choice or the decision-inventory discipline to canonical house
doctrine are owner's calls. The Task-not-Agent choice is a **hand-authored-sibling convention** —
matching `ontology-view` — and is *not* harness-enforced.)

## Lifecycle overview

Eight steps, with a draft / validate / review / publish gate split:

1. **Resolve** scope + sibling corpus; **harvest** the stances system-view names-but-does-not-decide;
   locate the authority sources.
2. **Compose** the anti-bias dispatch spec by enacting the `domainspec-subagents-strategy` SKILL
   (parent enacts the strategist role); the Task tool then dispatches the registered writer/explorer
   agents it composes — a peer wave-recipe, not a Task-dispatch of the skill.
3. **Validate** the spec; resolve the gate; bound retries; user-confirm before any dispatch.
4. **Dispatch explorers** -> build the decision inventory (one verdict per stance, each with a status
   and an authority, each back-referencing its system-view stance); collect per-agent files.
5. **Author** the schemas / contracts and the runtime mechanics, each pointing back to the verdict it
   realizes.
6. **Round-level review** (zig-zag) -> converge or exit with a typed reason, **verifying every
   authority on disk**, checking stance coverage and duplicate verdicts; unverifiable authorities are
   struck and their RESOLVED rows downgraded. The exit reason is drawn verbatim from `research`'s
   7-value enum.
7. **Write** the residue ledger + open questions (the OPEN/CRITICAL rows are the questions a
   stakeholder must weigh; non-contiguous OQ numbering is fine).
8. **Publication gate only** (does not re-run Step 6) — the inventory-shape and stance-coverage
   checks, the overlay-status check, and the `domainspec-emit-signals` epilogue.

The anti-bias pattern is `explorers -> skeptic -> writer -> auditor -> zig-zag -> converge`. The
**writer is the synthesizer** (no separate summarizer), authoring each round; converge or exit is the
reviewer's call. No end-to-end zig-zag engineer-view exists yet — the lifecycle is transfer-validated.

## Worked example

The canonical instance is the **GoldenQuill / Tilth** engineer-view:
`C:\Users\victo\domainspec-core\projects\goldenquill\victor\engineer-view.md` (verified on disk; it
lives in the separate `domainspec-core` repo).

It is the one validated on-disk instance — generalize *from* it, do not copy its locals. Its
decision inventory runs **D1–D10** (with a D5a) under the exact status legend this skill ships —
RESOLVED (decided & enforced) / OPEN (named, not decided) / CRITICAL (OPEN and blocks the value
thesis); its single CRITICAL row (D7, the learning loop) is the one that gates the value thesis. Two
things to note when reading it. First, its locals are GoldenQuill-specific and must not leak into a
new project's artifact: the `CIC` / `CLC` coupling rows, the council seats (Scout / Scribe /
Logician), the `F-CIC-CLC-COUPLING-VIOLATION` failure code, the `eligibility_filter.py` cite, and
the D1–D10 row literals are all GoldenQuill-derived. Second, it carries **no `governance_status`
field** and emits **no signal envelope** — so when you read it as a model, read it as a model of the
decision-inventory discipline only; the overlay and telemetry disciplines this skill adds are not
witnessed there.
