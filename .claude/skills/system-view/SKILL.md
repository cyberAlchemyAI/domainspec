---
name: system-view
description: "Upper half of the system-view/engineer-view pair: shape and stakes at stakeholder altitude, one layer at a time, no schemas or code. Names every load-bearing stance, decides none — each points to one engineer-view verdict row; terms defer to ontology-view."
argument-hint: "<project-or-corpus-path> [--siblings ontology-view,engineer-view,discovery] [--mode draft|validate|review|publish] [--output <path>] [--composition single|task-fan-out|zig-zag] [--max-iterations <n>] [--dry-run]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Task
---

# system-view — shape and stakes at stakeholder altitude

**This view owns the shape.** ontology-view owns terms; engineer-view owns verdicts, schemas, mechanics. Rationale, decisions, and worked examples: `references/DECISIONS.md` — never restated here.

**Frontmatter:** no `agent:`/`tier`/`domain`/`version`/`surface_kind`/`runtime`/`canonical_source`/`generated_by`/`mutation_policy`; `Task` not `Agent`; `AskUserQuestion` is the user-gate token; `governance_status: project-local-overlay`; rides `node_type: discovery`; `veracidade`/`convicção` only on shape/stance claims — a confidence on a verdict, or read as side-preference, is a leaked decision.

**Dispatch law:** when/whether to fan out, the human gate, the universal lifecycle → `domainspec-subagents-strategy`; record mechanics → `register-dispatch`; fields → constitution §5. Composition is a peer wave-recipe, never routed through `research/SKILL.md`.

## Use / skip

Use when a target has (or is getting) an engineer-view decision inventory and an ontology-view term graph — or a corpus rich enough to mine a shape — and needs a stakeholder-altitude explanation a non-engineer can judge. The discovery is the canonical seed corpus and the **sole mutation trigger** (re-running draft reconciles against its delta; never hand-edit). Skip when no decision inventory exists for stances to point at, or a paragraph suffices. Skip predicate `single + N=1 + explorer` is the default; even skipped, the author runs the skeptic/citation-strike and cross-reference passes itself.

A non-GoldenQuill target supplies its own description, decision inventory (or an explicit not-yet-authored declaration → provisional handles + blocker OQ), and stances in its own domain language. Zero `EXAMPLE-REPLACE-ME` rows and zero GoldenQuill tokens (enumerated in `references/DECISIONS.md`) survive.

## Two laws and one test

**Law 1 — name, don't decide.** A load-bearing stance — a choice in the shape that could defensibly go another way, whose alternative would change the mechanics a reader must check — gets a slug, the tension stated as "X versus Y — a real tension, not a settled answer", and a pointer to **exactly one** engineer-view row: `stance:<slug> → engineer-view#<id>` (engineer-view harvests every stance and owns each). Missing row → `[PROVISIONAL — row not yet authored]` + blocker OQ; never state the verdict to fill the gap. A choice the discovery or an axiom **already settled** is out of scope, not a stance — note it in the closing "what this view does not cover" map with a cite to the *settling decision* (a `discovery#`/`axiom/` decision, never an open question), so a live tension cannot be hidden there.

**Law 2 — use, don't redefine.** Every term is the ontology-view's, used not defined.

**Reconstructibility test** (resolves density vs. shape-only): a concrete instance is allowed iff a reader **cannot reconstruct** from it a schema field, an ordered state set, a cardinality, a closed member enumeration, or a build/done status. Numbers that quantify *stakes* pass; tokens that quantify *structure* fail. Tiebreak: structure wins. A count is a stake; the ordered/enumerated set is the contract.

The test catches *structure*, not *prose*: a framings "why set aside" cell names the framing's **defect**, never which alternative wins; the executive-gloss "why" says why the tension is **live**, not why a side wins. A cell or bullet asserting a side is right/required/forbidden is a struck verdict.

## Writing discipline (explanatory views; an argumentative view declares the exception)

- **Interruptible** — each layer widens the model already formed (smallest picture first); a reader who stops anywhere holds a coherent, not complete, picture.
- **Abstract⇄concrete** — a load-bearing abstract use carries ≥1 concrete illustration (passing the test). Triggered where a term is easy to misread (shares a name with an ontology-view term, or names structure without its stake), not universal.
- **Dense** — every word carries new information. ≥1 concrete stake per shape layer, or an explicit "stake is structural here" — never a fabricated number.
- **Progressive diagrams** (required at ≥3 layers, optional below): one additive diagram per layer = previous + only this layer's additions, constraint IDs on the arrows they constrain; then a full-picture assembly diagram.

## Existence, not status

Build status is a verdict engineer-view owns — no Status column; an existence-bearing choice is a stance (`stance:<x>-build-vs-defer → engineer-view#<id>`). Given-vs-optimized is the **control axis** (fixed-and-obeyed vs. tuned), orthogonal to build status — never define "given" as "exists today". Keep the cast a scannable name + one-verb-phrase list.

## Lifecycle (`--mode` default draft = 1–5,7 · validate = 3 · review = 6 · publish = 8)

1. **Resolve.** Locate target, siblings/corpus, term source, decision inventory (absolute paths). Detect the project's domain language.
2. **Compose.** Enact `domainspec-subagents-strategy`; Task only its registered agents. explorer → skeptic → writer (= synthesizer, authors each round) → auditor; writer never before skeptic under linear. Explorer vectors distinct, tension upfront.
3. **Validate + gate.** Goal load-bearing, success_metric typed, role order, tension upfront, kebab slug, cap respected; zig-zag without an iteration block FAILS. Accept → `AskUserQuestion` confirm/revise/abandon. Reject → Step 2 once; second reject halts `validator_rejected_twice`. Persist spec to `<dispatch-folder>/<view_slug>/agents/`.
4. **Surface + layers.** Author the surface ("what this is", plainly), then one conceptual layer per section per the writing discipline. No schemas, no code.
5. **Stances + given-vs-optimized.** Name every stance (Law 1); author the given-vs-optimized layering with its framings table.
6. **Round review.** Independent skeptic/auditor: every citation against disk (unverifiable = STRUCK); the three invariants — every stance resolves to exactly one row; zero verdicts stated; zero terms redefined. N≥3 zero-dissent = failure. Loop-back by dissent class (shape → 4; stance → 5; both), each one iteration vs. cap. Converge or cap → typed exit_reason. Round-level correctness only, never publication gating.
7. **Closing map + OQs.** "What this view does not cover": enumerate engineer-view's lane (verdicts, schemas, mechanics) and ontology-view's (terms); end on nothing-decided-twice. OQs carry recommendation + owner; blocker OQs flagged. Maturity / known-limitations in plain prose with practical consequence.
8. **Publish + signals (user-gated).** Validate: link integrity, zero verdicts, zero redefinitions, a framings table per shape layer, executive gloss, stance-to-verdict table, closing map, output contract. MANDATORY epilogue: `domainspec-emit-signals` appends a SIGNAL-SCHEMA envelope to `<repo-root>/docs/signals/pipeline-signals.jsonl` (nearest ancestor with `docs/signals/`, else `.git`; create if absent).

## Sections (order)

Objective (+ **executive gloss**) → Surface → layered shape → full-picture assembly diagram → given-vs-optimized (carries the existence partition) → process-order annotations → stance-to-verdict table → what this view does not cover → Maturity → Connections edge-table.

- **Executive gloss** (inside Objective): ≤8 bullets, common language, *problem → choice → why*, each **anchored** (unanchored bullet fails the gate), **zero verdicts**, term/status translations marked "informal translation, not a definition"; optional "start here" pointer. It must **replace or strictly extend** an existing Objective, never restate its thesis. Answers: what does this do · biggest open decision · what is given-and-fixed vs. not-yet-in-the-picture.
- **Process-order annotations**: admit a step only if it adds sequence/timing/actor/contract the assembly diagram cannot carry; cut per-step any pure re-narration of arrows already shown.
- **Stance-to-verdict table**: `stance | tension named here | owning row + target doc`.
- **Connections edge-table**: `derives-from → discovery.md` (records the version last reconciled — newer = STALE), `complements → engineer-view`, `uses-terms-of → ontology-view`.

## Per-layer template

```markdown
## N. <Layer> — <one-line stake>
<2–4 sentences of shape at stakeholder altitude; ontology-view's terms used not defined;
abstract use + concrete illustration for any plausibly-misread concept; >=1 concrete stake.>

<mermaid: previous diagram + ONLY this layer's additions; constraint IDs on the new arrows>

The **<slug>** stance — <X versus Y, a real tension> — named here, decided nowhere
(`stance:<slug> -> engineer-view#<id>`).

### Alternative framings we considered
| Framing | Why we set it aside |
|---|---|
| <alternative> | <reason> |
```

## Dispatch

| Param | Type | Default |
|---|---|---|
| `goal` | one load-bearing sentence | required |
| `view_slug` | kebab-safe | derived from project |
| `success_metric` | typed (falsifiable check naming its evidence) | required |
| `composition` | single \| task-fan-out \| zig-zag | zig-zag |
| `max_iterations` | int | per research-constitution cap |
| `iteration_block` | per-round roles + reaction rule + convergence predicate | required iff zig-zag |

`exit_reason` — research's 7-value enum verbatim: `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`.

## Output contract

Default `<project>/system-view.md`; else `.arcanum/system-view/<slug>.md`; else a chat report. Return:

```markdown
## System View Result
- Mode · Project
- Term source / Decision inventory: <paths or "not yet authored — handles provisional">
- Layers · Stances: <resolved>/<provisional> · Verdicts stated: MUST be 0 · Terms redefined: MUST be 0
- Framings tables: <count> (one per shape layer) · Executive bullets: <count> (uncited MUST be 0, verdict-stating MUST be 0)
- Closing map: present | MISSING · Overlay status · exit_reason · Next action
```

## Anti-patterns

- Filling a missing engineer-view row with the verdict inline instead of PROVISIONAL + blocker OQ.
- Any reconstructible structure — schemas, field names, ordered state strings, cardinalities, closed enums, Status columns — it belongs to engineer-view.
- Collapsing the layered shape into one blob; flattening given-vs-optimized into "everything is a knob".
- A separate "summarizer" role; dropping the skeptic or cross-reference passes on the skip path.
- The skill citing its own making — provenance, assessor findings, changelogs live in `references/`, never in the instrument.
