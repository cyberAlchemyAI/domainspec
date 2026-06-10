# ontology-view

Author a fourth sibling **ontology-view** artifact for a project that already has
`discovery` / `system-view` / `engineer-view` (or any source corpus) — the typed
node/edge layer beneath the prose views, where the project's load-bearing invariants
stop being assertions and become **structural**.

## The problem

The prose sibling views *assert* a project's invariants. A `system-view` can say "the
two axes never couple," "the cache never decides eligibility," "no private lesson reaches
a shared surface" — but those are sentences. Nothing stops a later author from typing the
forbidden relationship anyway, because the prose carries no machine-checkable shape. The
invariant is only as strong as the next reader's discipline.

`ontology-view` makes the invariant structural in two moves, because one move is not
enough:

1. **Type the endpoints** so the forbidden relationship cannot be *well-formed*. If
   "axis A couples to axis B at design time" is a category error, you declare A and B as
   distinct node types and ensure no catalog edge admits the `(A_type -> B_type)` pair.
   The bad edge is then *unconstructible by type* — an author would have to coin a new
   edge, which the "do not invent edges" rule catches at authoring/review time. This is
   the generalization of the constitution's own per-edge source/target node_type
   constraint, and of its Appendix C line-559 prose ("a session cannot originate an
   epistemic edge — doing so would make the session an epistemic actor, which it is not").

2. **Guard the reflexive class with a predicate**, because endpoint-typing *cannot* catch
   it. When a forbidden relationship has **identical and legal** endpoint types — a node
   edging to itself, or one role of a role-discriminated type cycling back — the endpoints
   are admissible, so by-type unconstructibility does not apply. The prohibition
   ("an insight cannot distill back into its own outcome"; "running behavior drifts-from
   designed behavior, never from itself") needs a runtime/predicate guard
   (`id(from) != id(to)`) sitting on top of the type system. For this class the named
   guard is **primary**, not reinforcement.

That two-move discipline — unconstructible-by-type first, predicate guard primary for the
reflexive class — is what `ontology-view` ships, with named fail-closed guards verified on
disk and an honest LIVE / PLANNED / registered-dormant status on each.

## When to use it

Reach for `ontology-view` when a project already carries the prose triad (or any source
corpus rich enough to mine concepts and relationships from) **and** its correctness rests
on relationships that should be impossible, not merely discouraged. The payoff is the
forbidden-edge layer: if your invariants are "these two things must never connect" or
"this derived node must never be a decision target," typing the endpoints buys you
enforcement the prose cannot.

Run the full multi-agent zig-zag only when the domain genuinely needs adversarial
pressure — competing node taxonomies, contested edge legality, cross-repo precedent that
must be struck if unverifiable.

## When NOT to use it

- **Skip the heavy machinery if a simple inventory lookup suffices.** The default for an
  ordinary single-author run is the **light path** — the `single + N=1 + explorer` skip
  predicate drops the multi-*agent* dispatch. Zig-zag is opt-in, not the default, because
  no end-to-end zig-zag ontology-view exists yet (the lifecycle is transfer-validated).
  **But the skip never drops the skeptic / citation-strike pass** — every precedent is
  still verified on disk and every unverifiable citation is struck, because phantom
  citations are the anti-bias failure that most corrupts the artifact.
- **Skip it entirely if there is no decision inventory to point verdicts at.** This view
  does not decide anything; it points every verdict across to `engineer-view`. With no
  decisions to reference, there is nothing for the pointer nodes to defer to.

## Core concepts

- **Typed node** — `node_type` (canonical enum) + a project-local `kind` axis +
  `branch` (business / system / bridge / mixed) + an **optional** project-local `scope`
  axis (e.g. ontology-type vs runtime-instance, declared per project, not a universal
  typing primitive) + a load-bearing `schema` + on-disk instances + a precedent cite.
- **Typed edge** — `from -> to`, directionality, cardinality, a load-bearing rule, and a
  declared forward/inverse pair. Reuse canonical catalog edges verbatim where they fit
  (tightening cardinality is allowed, widening is forbidden); flag every **coined** edge.
- **Forbidden-edge guard** — **this is a skill contribution, not an inherited convention.**
  The live constitution has zero "forbidden edge" / "unconstructible" / "category error" /
  "fail-closed guard" vocabulary; its only edge-legality levers are per-edge source/target
  node_type constraints plus "do not invent edges." `ontology-view` generalizes those (plus
  the Appendix C line-559 prose) into a discipline: **unconstructible-by-type first** for
  differing-endpoint cases, a **predicate guard primary** for the reflexive/self-loop case,
  each with substrate-neutral LIVE / PLANNED / registered-dormant honesty. It ships a
  **four-archetype taxonomy** (reusable as explorer detection prompts, not canonical
  doctrine):
  1. **orthogonal-axis coupling** — unconstructible-by-type;
  2. **derived / cache node as a decision target** — unconstructible-by-type;
  3. **trust / consent-tier escalation without a gate** — runtime-gated;
  4. **reflexive / self-referential edge** — node-to-itself or within one role of a
     role-discriminated type; endpoints are identical and legal, so it is *not*
     unconstructible-by-endpoint-type and **always** needs a predicate guard. This is the
     canonical case where by-type-first does not apply.
- **Confidence dyad** — `veracidade` / `convicção` on **belief-bearing roles only**
  (axiom / premise / audit per the constitution §6), omitted everywhere else.
- **Residue ledger** — every load-bearing claim maps to >=1 row; open residue is preserved,
  never demoted (the subset rule).
- **Anti-bias multi-agent lifecycle** — `explorer -> skeptic -> writer -> auditor`. The wave
  recipe is composed by **enacting the `domainspec-subagents-strategy` SKILL** (the parent
  session enacts the strategist role — a Skill/slash invocation, **not** a Task target: there
  is no `domainspec-subagents-strategy` agent file to dispatch). The **Task tool** is then used
  only to dispatch the registered writer/explorer agents the strategy composes. It is a **PEER
  wave-recipe — NOT routed through `research`** (routing through `research` would create a
  two-orchestrator failure; `research` is a self-contained domain port keyed to `discoveries/`,
  not a generic dispatcher). The **writer is the synthesizer** — there is no separate
  "summarizer" role.

## Relationship to the sibling views

The four views divide the labor cleanly, and **nothing is decided twice**:

- **`ontology-view` owns the schema** — typed nodes, typed edges, forbidden-edge guards,
  the residue ledger.
- **`system-view` owns the prose / shape** — the stakeholder-altitude explanation.
- **`engineer-view` owns the verdicts** — the full decision inventory. Here a Decision /
  stance is only a **pointer node**; where a stance touches a decision row, this view names
  it and points across.

**Validation status — state it plainly:** `ontology-view` is **single-instance-validated**,
against GoldenQuill / Tilth only. No other project currently has the discovery /
system-view / engineer-view triad on disk. The first non-GoldenQuill run is the
reusability proof — this is not yet a "works for any project" claim, and should not be
presented as one. Sharper still: the one witnessed instance **does not satisfy the
version+path resolution rule** — it pinned the stale **v2.1.1** mirror by nearest-path and
cites it throughout. So the constitution-resolution discipline is in fact **unwitnessed on
disk — transfer-asserted, not validated** — and the worked example is a partial *counter*-example
to that rule, not a model of it.

## Governance

`ontology-view` **borrows `ontology-vault`'s structure-of-ideas by reference** for the body
shape (roles, confidence, branch-aware ontology) — this is a borrow-by-reference, **NOT a
runtime invocation**: do not Task-dispatch `ontology-vault` during a run. It does **not**
reinvent or duplicate that skill's edge catalog or branch-authority model, nor adopt its
bootstrap frontmatter or Arcana sigil tags. On top of it:

- **Canonical constitution by version, not by nearest-path — scoped to the project's own repo.**
  A project tree can carry two `ontology-conventions.md` that disagree — an embedded stale
  mirror alongside the live upstream copy. Resolve the canonical one by **highest version
  frontmatter**, searching **only within the project-under-analysis's own repository tree**
  (the disagreeing copies can live in *different* repos — the skill package's beside-file is
  v2.4.0, while a `-core` project's reachable copies top out at v2.1.1; "highest version wins"
  must not silently cross from the project's repo into the skill's repo). Record the resolved
  absolute path + version + commit/dirty-state. Nearest-path resolution silently pins an
  embedded freeze.
- **Count the edges at run time; never pin a literal.** The forward-edge total is *counted*
  from the resolved constitution's live forward-edge subsections — every forward-edge
  subsection between the Appendix-C header and the first deprecated/previously-named region,
  **whatever those subsections are named in the resolved version** (the names are version-
  specific, not the predicate: v2.4.0 names them `epistemic / provenance / reference`; v2.1.1
  names them `universal / document-specific / session-specific`). Excluding the deprecated and
  previously-named mapping tables, on every run. (Guard: if the count comes back zero under the
  named families, the predicate mis-matched the version's structure — re-derive the subsection
  names first.) In the **canonical upstream v2.4.0** (the one a correct run resolves to), those
  live subsections hold **25** rows while the file's own Appendix-C header says **22** and its
  prose says **21** — a three-way self-disagreement.
  The skill **surfaces** that 25 / 22 / 21 mismatch as a blocker note; it never reconciles to
  any one literal, and it never treats the catalog's legality matrix as the count source.
  (Trap: the GoldenQuill worked example mis-resolved by nearest-path to the stale **v2.1.1**
  mirror. Note carefully: **the artifact itself never performed any live-table count** — it
  only records the literal **21** ("catalog (21 edges, closed)"). **24 / 21 / 21** is the count
  an author *would derive* from that wrongly-resolved v2.1.1 file under its `universal /
  document-specific / session-specific` subsections — it is not a value the artifact states.
  So 25/22/21 is a property of v2.4.0 the worked example never computed, and even 24/21/21 is
  reviewer-derived, not artifact-stated. Re-derive the subsection names AND the count against
  the version-resolved file; do not copy either literal from the worked example.)
- **Project-local overlay vs promotable vault artifact.** Coined edges and local label
  axes are kept **PROPOSED-UNFILED** in the project's own *Governance posture* section, with
  `governance_status: project-local-overlay`, and promotion is **halted** — because no
  codified external amendment-routing path exists yet. (The `edges-enforcement-refactoring`
  discovery is an *authoring-surface* drift proposal, itself promotion-blocked — cite it
  only as evidence the catalog is mechanically-enforceable, co-evolving, and internally
  inconsistent, **not** as a forbidden-edge precedent.)
- **`ontology-view` is a read/author overlay, not a new promotion authority.** It honors
  the No-Promotion Guardrails: it surfaces what must be filed and points to the owner, but
  it does not promote anything itself.
- **Telemetry** emits through **`domainspec-emit-signals`** to the project-under-analysis's
  **`docs/signals/pipeline-signals.jsonl`** — repo-root-anchored (nearest ancestor of the
  project containing `docs/signals/`, else nearest ancestor with `.git`; created if absent —
  several such files exist across the tree and none at repo root, so a bare relative path is
  underspecified). This is a mandatory epilogue and the sole sanctioned path. It does **not**
  emit Arcanum `sigil-invocations.jsonl`.

(Whether to elevate Task-vs-Agent, the forbidden-edge discipline, or the four-archetype
taxonomy to canonical house doctrine are owner's calls. Note: the Task-not-Agent choice is
a **hand-authored-sibling convention** — it diverges from every hand-authored sibling — and
is *not* harness-enforced.)

## Lifecycle overview

Eight steps, with a draft / validate / review / publish gate split:

1. **Resolve** scope + sibling corpus + local vocabulary; resolve the canonical
   constitution by version+path; **count** the live forward-edge tables on disk and surface
   the three-way mismatch.
2. **Compose** the anti-bias dispatch spec by enacting the `domainspec-subagents-strategy`
   SKILL (parent enacts the strategist role); the Task tool then dispatches the registered
   writer/explorer agents it composes — a peer wave-recipe, not a Task-dispatch of the skill.
3. **Validate** the spec; resolve the gate; bound retries; user-confirm before any dispatch.
4. **Dispatch explorers** -> author typed nodes; collect per-agent files.
5. **Author typed edges** + the forbidden-edge guard discipline (endpoint-type *and*
   reflexive classes), with a concrete project-local-overlay fallback for coined edges.
6. **Round-level review** (zig-zag) -> converge or exit with a typed reason, **verifying
   each guard's LIVE / PLANNED status against disk substrate-neutrally**; the exit reason is
   drawn verbatim from `research`'s 7-value enum.
7. **Write** the residue ledger + open questions (non-contiguous OQ numbering is fine).
8. **Publication gate only** (does not re-run Step 6) — the enforcement-tier
   forbidden-relationship table, overlay-status check, and the `domainspec-emit-signals`
   epilogue.

The anti-bias pattern is `explorers -> skeptic -> writer -> auditor -> zig-zag -> converge`.
The **writer is the synthesizer** (no separate summarizer), authoring each round; converge
or exit is the reviewer's call. No end-to-end zig-zag ontology-view exists yet — the
lifecycle is transfer-validated.

## Worked example

The canonical instance is the **GoldenQuill / Tilth** ontology-view:
`/Users/victorboscaro/domainspec-core/projects/goldenquill/victor/ontology-view.md`.

It is the one validated instance — generalize *from* it, do not copy its locals (`gq_kind`,
the CIC/CLC axes, council seats, matrix cards, the 16-coined count, the
ontology-type/runtime-instance scope values are all GoldenQuill-specific and must not leak
into a new project's artifact). Two things to note when reading it: its constitution
citation points at the **embedded v2.1.1 stale mirror** (do not propagate that citation),
and it carries the **reflexive-guard archetype** on `drifts-from`, `contradicts`, and
`distilled-to` — the witnessed instances of the fourth archetype.
