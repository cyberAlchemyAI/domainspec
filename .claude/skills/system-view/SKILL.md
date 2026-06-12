---
name: system-view
description: "Author the upper half of a system-view / engineer-view pair: the shape-and-stakes view of a target, explained at stakeholder altitude one conceptual layer at a time — no schemas, no code. The differentiator: this view NAMES every load-bearing stance and DECIDES NONE — each named stance points across to exactly one engineer-view decision row for its single owning verdict, and every term's meaning is deferred to ontology-view. (Body invariants — objective-first gate, layered 'shape' sections each with an 'alternative framings we considered' table, a given-vs-optimized layering section, a closing 'what this view does not cover' map, anti-bias lifecycle, telemetry via domainspec-emit-signals — are detailed below.)"
argument-hint: "<project-or-corpus-path> [--siblings ontology-view,engineer-view,discovery] [--mode draft|validate|review|publish] [--output <path>] [--composition single|task-fan-out|zig-zag] [--max-iterations <n>] [--dry-run]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Task
---

<!--
FRONTMATTER CONVENTION NOTES (load-bearing, do not strip):
- This is a HAND-AUTHORED domainspec-* skill. Its frontmatter anchors to the domainspec-*
  MAJORITY family shape (name + description + argument-hint + allowed-tools). The anchor is
  the majority shape, NOT a universal invariant — domainspec-subagents-strategy itself carries
  only name + description, so do not cite the dispatch engine's own frontmatter as an
  agent+argument-hint exemplar.
- agent: INTENTIONALLY OMITTED. The parent session enacts the strategist/orchestration role
  directly (mirroring research/SKILL.md and the sibling ontology-view), per
  domainspec-subagents-strategy R24 where "strategist" is a ROLE the parent enacts, not a
  registered loadable agent. There is NO `domainspec-subagents-strategy` agent file on disk to
  bind. Do NOT bind `domainspec-strategist` either: no such agent file exists, and a frontmatter
  `agent:` token with no backing file risks a load failure or a silently dropped binding.
- allowed-tools declares Task, NOT Agent. This is CONVENTION-CONFORMANCE: 0 hand-authored
  domainspec siblings declare Agent in allowed-tools (re-count at authoring time — the exact
  denominator drifts across tree scopes; the stable invariant is "0 declare Agent"). It is NOT
  a harness gate: Agent is the runtime name, core skills declare Agent and load fine, and no
  validator code rejecting Agent exists. The choice diverges from 100% of hand-authored siblings
  (convention) — it is NEVER "Agent fails harness validation".
- AskUserQuestion (not AskQuestions) is the chosen user-gate token — the token used by the
  user-gating siblings (decision-gate / readiness-gate / start) and by the sibling ontology-view.
  A defensible split-neutral choice anchored to the gating siblings, not a count win.
- OMITTED on purpose: tier / domain / version (Arcanum-generated-sigil fields — 0 hand-authored
  domainspec skills carry them).
- EXPLICITLY FORBIDDEN here (bootstrap-only overlay, asserts a regeneration contract that does
  not exist for a hand-authored skill): surface_kind / runtime / canonical_source / generated_by
  / mutation_policy — and the Agent token they ship with. Do NOT mirror the ontology-vault
  frontmatter.
- Body family = domainspec-* (<objective>/<context>/<process>/<output-contract>). <quality-bar>
  and <anti-patterns> are rendered as checklists/guardrail-lists; observability is rendered as
  PROSE, not an <observability> sigil tag. <quality-bar> is an empirically-present-but-
  UNSANCTIONED hybrid (no normative SKILL.md body-convention doc exists on disk); kept with no
  claim of sanction.
-->

# Skill: System View

<objective>
Produce the **system-view** — the upper half of a system-view / engineer-view pair — that explains a target's *shape* at the altitude a stakeholder needs to judge whether the idea is sound, **one conceptual layer at a time, with no schemas and no code**. The view authors the narrative, names every load-bearing stance, and **decides none of them**: each named stance points across to exactly one `engineer-view` decision row for its single owning verdict, and every term's meaning is deferred to `ontology-view`. Its closing "what this view does not cover" map states plainly what it hands down, so nothing is decided twice and nothing is restated.
</objective>

<context>
Shape authoring under governance plus an anti-bias multi-agent lifecycle. The BODY family is **domainspec-*** (`<objective>/<context>/<process>/<output-contract>`). This is the prose/shape sibling in a three-view division of labor where **nothing is decided twice**: `ontology-view` owns the typed schema (nodes/edges/forbidden-edge guards); **`system-view` owns the prose/shape** (this skill); `engineer-view` owns the verdicts (the decision inventory). The view inherits the objective-first (<=3-sentence) gate and the hand-authored discovery frontmatter shape by reference from `discovery-writing.md` + `frontmatter.md` (adding only `governance_status: project-local-overlay` as a local delta), and rides `node_type: discovery`. It borrows nothing from the Arcanum bootstrap/sigil overlay. The load-bearing differentiator is the **cross-reference discipline**: this view STATES NO VERDICT and REDEFINES NO TERM.
</context>

<modes>
- `draft` — Steps 1-5 + 7: resolve the target and siblings, compose the authoring spec, author the layered shape, name every stance with its cross-reference handle, and write the "what this view does not cover" map. Produces the artifact in draft.
- `validate` — Step 3 only, standalone: validate a composed dispatch spec before any agent runs (accept | reject-with-fixes | escalate).
- `review` — Step 6 only, standalone: round-level skeptic/auditor pass over an existing draft (precedent verification, stance-handle verification, no-verdict / no-redefinition verification, dissent surfacing) feeding converge/exit.
- `publish` — Step 8 only: publication-gate the artifact and emit signals. Does NOT re-run Step 6's content review.

(The gate split is modeled as modes for compactness; whether validate/review/publish should instead be three companion SKILL packages is an open owner's call — see Open questions.)
</modes>

<applicability>
Use when a target has (or is getting) an `engineer-view` decision inventory and an `ontology-view` term graph — or any source corpus rich enough to mine a shape from — AND needs a stakeholder-altitude explanation that a non-engineer can read to judge soundness. The canonical seed corpus is the **`discovery`**: in the common bootstrap case the sibling views do not exist yet, so this view mines the discovery — the one upstream input the triad does not circularly depend on, which is what breaks the system-view↔engineer-view bootstrap cycle. Skip when there is no decision inventory for stances to point at (this view decides nothing — with no verdicts to defer to, the pointer stances have no owner), or when a one-paragraph summary suffices. This skill is **single-instance-validated**: the GoldenQuill / Tilth system-view (`C:\Users\victo\domainspec-core\projects\goldenquill\victor\system-view.md`) is the only on-disk instance of a system-view artifact; the first non-GoldenQuill run is the reusability proof. Be honest about what that one instance does NOT show: it is a two-view pair (system-view + engineer-view) — the ontology-view sibling was authored later — so the three-way single-owner invariant (term in ontology-view, verdict in engineer-view, shape here) is **transfer-asserted across the witnessed pair, not witnessed end-to-end across the full triad**.
</applicability>

<inputs>
- The target's sibling views (`ontology-view` / `engineer-view` / `discovery`) or its source corpus.
- The **engineer-view decision inventory** (its D-rows), so every named stance can point to exactly one owning verdict row. If no engineer-view exists yet, the stance handles are PROVISIONAL (point to the row the engineer-view will own) and this is flagged as a blocker OQ until the engineer-view is authored.
- The **ontology-view term graph** (or the project's working vocabulary), so terms are USED here and DEFINED there — this view redefines nothing.
- The **`discovery`** — the canonical SEED CORPUS for this view. When the sibling views do not exist yet (the common bootstrap case), the discovery IS the source corpus this view mines: its **Business Context** and **Core Concepts** seed the surface and the layered shape, and its design decisions surface the candidate stances. It is the one upstream input the triad does not circularly depend on, so it breaks the system-view↔engineer-view bootstrap cycle. Treat a fact the discovery does not carry as a discovery gap, not something to invent here.

A system-view rides `node_type: discovery`; `governance_status: project-local-overlay` keeps it out of promotion until the owning amendment is filed.
</inputs>

<reusability-contract>
A NON-GoldenQuill target MUST supply: (1) its own **target description** (the "what this is" — the analogue of "GoldenQuill is a desktop computer a client owns; Tilth is the software inside it"); (2) its own **engineer-view decision inventory** (the D-rows every stance points to) OR an explicit declaration that the inventory is not yet authored (then the handles are provisional + blocker OQ); (3) its own **load-bearing stances** named in its own domain language.

The skill provides GENERICALLY: the lifecycle; the lane/section model (surface → layered shape → given-vs-optimized → named stances → per-section alternative-framings table → optional shape diagrams → closing "what this view does not cover"); the no-verdict / no-redefinition cross-reference discipline; the stance-handle convention `stance:<slug> → engineer-view#<id>`.

**PEER-NOT-NESTED:** the skill re-implements the explorer/skeptic/writer/auditor lifecycle LOCALLY and routes composition through `domainspec-subagents-strategy` as a PEER wave-recipe — it does NOT dispatch through `research/SKILL.md`. Routing through research would create the two-orchestrator ungoverned-channel failure: research is a self-contained KT-port keyed to `discoveries/`, not a generic dispatcher.

**Reusability-proof checklist** (the first non-GoldenQuill run must mechanically satisfy all):
- [ ] the target's own description is supplied (not GoldenQuill / Tilth);
- [ ] every named stance points to exactly one engineer-view decision row (or is flagged provisional + blocker OQ);
- [ ] zero term is redefined (every term used here is deferred to ontology-view);
- [ ] zero verdict is stated (every verdict is pointed across to engineer-view);
- [ ] zero `EXAMPLE-REPLACE-ME` / placeholder rows survive into the artifact;
- [ ] zero GoldenQuill tokens leak: `CIC`, `CLC`, `TILTH-*`, `council`, `gq_kind`, `matrix-card`, council-seat names (Scout/Scribe/Editor/Judge/Red Team/Logician), the six client identities, the eight capital logics, the Five Operating Laws, KFR / Match DB.
</reusability-contract>

<default-output>
1. `<project>/system-view.md` as a sibling to the other views, when the project folder exists;
2. else `.arcanum/system-view/<slug>.md`;
3. else a markdown report in chat.

Per-agent dispatch files live under the dispatch folder, e.g. `<dispatch-folder>/<view_slug>/agents/`. The composed dispatch spec is persisted to the dispatch folder before dispatch (Step 3).
</default-output>

<provenance-and-mutation>
This view is a **derive-only canonical artifact**; its source **`discovery` is the SOLE sanctioned mutation trigger**, and the artifact is NEVER hand-edited. To change it, revise (or supersede) the discovery, then re-run THIS skill in **evolve mode** (`--mode draft` over the existing file), which **reconciles** the view against the discovery delta — preserving the view's own authored **named stances, layered shape, and alternative-framings** except where the delta forces a change. This is **reconcile-not-regenerate**: the view carries judgment the discovery does not (which choices are load-bearing stances is an authoring call, present nowhere upstream), so it is never rebuilt from scratch.

- **The link is an EDGE, not a frontmatter field.** The artifact declares `derives-from → discovery.md` in its `## Connections` block (inverse `derives` on the discovery), riding the existing `node_type: discovery` edge catalog. It does NOT add `generated_by` / `mutation_policy` / `canonical_source` frontmatter — those are FORBIDDEN by the template frontmatter note because they assert the regenerate contract this view rejects.
- **Drift is version-based.** The `## Connections` row records the discovery `version` last reconciled against; when the discovery's current `version` exceeds that baseline the view is STALE — flagged by an audit-alignment-style drift check and reconciled via evolve mode, never hand-patched.
</provenance-and-mutation>

<process>
The 8 lifecycle steps. The artifact SECTION ORDER follows the `<process-to-section map>` below, NOT a literal 1:1 with these steps.

**Step 1 — Resolve the target + sibling corpus; pin the term source and the decision inventory.**
Locate the target, its sibling views or source corpus, the `ontology-view` (or working vocabulary) that OWNS the terms, and the `engineer-view` decision inventory that OWNS the verdicts. Detect the project's own domain language; do NOT promote local labels to canonical vocabulary, and do NOT redefine any term — terms are USED here and DEFINED in ontology-view. Record where the term source and the decision inventory live (absolute paths). If the engineer-view does not exist yet, mark every stance handle PROVISIONAL and raise the missing-inventory blocker OQ.

**Step 2 — Compose the multi-agent authoring spec (anti-bias); ENACT the strategy skill, then Task-dispatch the registered writer agents.**
Name the engine and the wiring; do not leave it to invention. The invocation path is TWO distinct mechanisms — do NOT conflate them: (1) the PARENT session ENACTS the **`domainspec-subagents-strategy`** SKILL (via the Skill/slash invocation, enacting the strategist role per its R24) to COMPOSE the wave recipe — `domainspec-subagents-strategy` is a SKILL the parent enacts, NOT an agent file, and there is NO `domainspec-subagents-strategy` agent on disk to Task-dispatch; (2) the strategist THEN dispatches the registered WRITER / explorer / role agents the strategy composes USING THE **Task** tool (Task targets registered agents, never a skill name). Force a TYPED parameter table WITH DEFAULTS: `goal` (one load-bearing sentence), `view_slug` (kebab-safe), `success_metric` (typed), `composition` (single|task-fan-out|zig-zag, default zig-zag), `max_iterations` (cap). Add the zig-zag ITERATION BLOCK to the table: per-round roles + reaction rule + convergence predicate tied to the Step 6 exit_reason. Each explorer attacks a distinct vector (surface / layered shape / stance discovery / given-vs-optimized layering / cross-reference integrity) with pairwise tension declared UPFRONT. Role chain: explorer -> skeptic -> writer -> auditor; the WRITER IS the synthesizer (no separate "summarizer"). Default-linear enforces writer-never-before-skeptic; under zig-zag, roles are epistemic functions that may interleave. See `<dispatch-wiring>`.

**Step 3 — Validate the spec; gate-resolve; bound retries; USER-CONFIRM before dispatch.**
Check goal load-bearing, success_metric typed, role ordering, per-layer mode well-formed, pairwise tension upfront, max_iterations within cap, view_slug kebab-safe. A zig-zag layer with NO iteration block FAILS validation. Apply the SKIP predicate (`single + N=1 + explorer` => skip the multi-AGENT dispatch machinery; this is the DEFAULT for ordinary single-author runs, zig-zag opt-in, since no end-to-end zig-zag system-view exists yet). CARVE-OUT: even on the skip path the author MUST still run the **skeptic/citation-strike sub-pass** (verify every precedent on disk; strike unverifiable citations) AND the **cross-reference sub-pass** (verify every stance handle resolves to a real engineer-view row; verify no verdict is stated and no term is redefined) — skip drops the multi-AGENT dispatch, NOT the skeptic FUNCTION. Emit accept | reject-with-fixes | escalate and resolve: accept -> `AskUserQuestion` confirm/revise/abandon (abandon => nothing persists) -> dispatch; reject-with-fixes -> loop back to Step 2 with named fixes (this re-loop IS the single retry); SECOND reject -> escalate, halt with `exit_reason=validator_rejected_twice`. PERSIST the composed spec to the dispatch folder before dispatch.

**Step 4 — Dispatch explorers -> author the surface + the layered shape; collect per-agent files.**
Dispatch the writer/explorer agents composed by the enacted `domainspec-subagents-strategy` skill via the **Task** tool (Task targets the registered agents, not the strategy skill name). Author the **surface** ("what this is" — the target stated plainly at stakeholder altitude) and then the **layered shape**: one conceptual layer at a time, each layer with its own "alternative framings we considered" table. No schemas, no code — descriptions of *shape*, not contracts. Every term used is the ontology-view's term (used, not redefined). Collect per-agent explorer outputs into the dispatch `agents/` folder. SURFACE for Step 5 every place where a layer rests on a load-bearing choice that could go another way — those are the candidate stances.

**Step 5 — Name every load-bearing stance; emit a cross-reference handle for each; author the given-vs-optimized layering.**
For every load-bearing choice the shape rests on, NAME the stance (a short slug + the tension it carries) and DECIDE NONE OF IT. Emit a cross-reference handle `stance:<slug> → engineer-view#<id>` pointing to exactly one owning decision row. State the tension plainly ("X versus Y — a real tension, not a settled answer") and point across. Author the **given-vs-optimized layering** (or its domain equivalent — the discipline is "separate what is fixed-and-obeyed from what is optimized-toward from what merely accumulates"); each layer's relationship to control is stated, and any stance inside it is named-not-decided. Add the per-section "alternative framings we considered" table. CROSS-REFERENCE FALLBACK: if the engineer-view row does not exist yet, write the handle as PROVISIONAL (`stance:<slug> → engineer-view#<id> [PROVISIONAL — row not yet authored]`) and surface the missing-row blocker OQ; NEVER state the verdict here to fill the gap.

**Step 6 — Independent ROUND-LEVEL review (zig-zag) -> converge OR exit with typed reason; VERIFY no-verdict / no-redefinition / handle-resolution on disk.**
An independent reviewer (skeptic/auditor) pressure-tests the shape, every precedent citation against disk, and the THREE cross-reference invariants: (a) every named stance resolves to exactly one engineer-view row (no orphan handle, no stance pointing at two rows, no row with no stance); (b) NO verdict is stated here (a sentence that decides a stance instead of naming it is a violation — downgrade it to "named, pointed across"); (c) NO term is redefined (a definition that belongs in ontology-view is a violation — replace it with a use + a pointer). Surface false-consensus (N>=3 with zero dissent) as a failure. Strike unverifiable citations. SCOPE: ROUND-LEVEL CORRECTNESS feeding converge/exit ONLY — this is NOT publication gating (Step 8). Bind loop-back BY DISSENT CLASS: shape/layer dissent -> Step 4 only; stance/cross-reference dissent -> Step 5 only; cross-cutting -> both. Any loop-back = ONE iteration against max_iterations. On convergence OR max_iterations -> exit with a TYPED `exit_reason` from the 7-value enum (`success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`). SPELLING NOTE: the cap-exit value is `max_loops_reached` (research spelling) — the base subagents-strategy constitution spells it `loop_cap_reached`; this skill follows the research spelling so telemetry stays consistent with the enum it is emitted under and read against. This is NOT base-compatible: a reader keying off the base taxonomy would see `max_loops_reached` as a mismatch — the contract is research's enum, not the base one.

**Step 7 — Write the "what this view does not cover" map + open questions.**
Author the closing map: a plain statement that this view stops at the *shape*, names stances, and states no verdicts; an enumeration of exactly what the engineer-view owns (the decision inventory, the schemas/contracts, the mechanics) and what the ontology-view owns (the terms); and a final line that every stance named here has its single owning verdict over there — nothing decided twice. Open questions carry recommendations and name their owner; blocker-level OQs (a stance with no owning engineer-view row, a missing engineer-view inventory, a verdict that leaked into prose, a term redefined here) are flagged, not waved through. NON-CONTIGUOUS OQ numbering is acceptable — do NOT renumber.

**Step 8 — PUBLICATION-LEVEL validate + publish as project-local overlay (user-gated); emit signals.**
SCOPE: PUBLICATION GATING ONLY — does NOT re-run Step 6's content review. Validate ONLY: link integrity (every `engineer-view#<id>` and ontology-view pointer resolves), the no-verdict invariant (zero verdicts stated), the no-redefinition invariant (zero terms redefined), `governance_status` overlay correctness, the presence of a per-major-section alternative-framings table, the presence of the closing "what this view does not cover" map, the output-contract. Require the **stance-to-verdict cross-reference table** (columns: stance | tension named here | owning verdict — `engineer-view#<id>`). MECHANICAL THRESHOLD: any stance with NO owning engineer-view row => BLOCKER; any verdict stated in prose => BLOCKER; any term redefined => BLOCKER. STATE these are GoldenQuill-calibrated DEFAULTS a project MAY tighten (e.g. require a shape diagram per layered section). Mark coined framing / local language as a project-local overlay via `governance_status`. Emit the curated stance-to-verdict table, the closing map, and the output-contract report. Then run the MANDATORY observability epilogue (see `## Observability`). User-gated.
</process>

<process-to-section map>
The canonical map from each `<process>` step to the artifact section(s) it produces. The template section ORDER follows THIS map (not a literal 1:1 with the 8 steps), which is what makes the section-order rule satisfiable.

| Step | Artifact section(s) produced |
|---|---|
| Step 1 | Front-matter context block (term source + decision-inventory pointers) |
| Step 2 | (composition spec — dispatch-folder artifact, not an artifact section) |
| Step 3 | (validated/persisted spec — dispatch-folder artifact, not an artifact section) |
| Step 4 | Surface ("what this is") + the layered shape sections (each with its alternative-framings table) |
| Step 5 | Named stances (inline in the layers) + Given-vs-optimized layering + per-section alternative-framings tables |
| Step 6 | (round-level review pass — no artifact section) |
| Step 7 | What this view does not cover + Open questions |
| Step 8 | Stance-to-verdict cross-reference table + overlay status |
</process-to-section map>

<dispatch-wiring>
Compose the wave recipe by ENACTING the **`domainspec-subagents-strategy`** SKILL (parent session enacts the strategist role per R24 — a Skill/slash invocation, NOT a Task target: there is no `domainspec-subagents-strategy` agent file on disk). The strategy is a PEER wave-recipe. The **Task** tool is then used ONLY to dispatch the registered WRITER / explorer / role agents the strategy composes — Task targets registered agents, never the strategy skill's name. Do NOT route through `research/SKILL.md`: research is a domain KT-port keyed to `discoveries/`, not a dispatcher, and routing through it creates the two-orchestrator ungoverned-channel failure. Do not leave the wiring to the agent to invent.

- **Roles:** explorer / skeptic / writer / auditor. The writer IS the synthesizer (no "summarizer"); the writer authors EACH round; converge/exit is the Step 6 reviewer's call.
- **Typed parameter table (with defaults):**

  | Param | Type | Default |
  |---|---|---|
  | `goal` | one load-bearing sentence | — (required) |
  | `view_slug` | kebab-safe string | derived from project |
  | `success_metric` | typed | — (required) |
  | `composition` | single \| task-fan-out \| zig-zag | zig-zag |
  | `max_iterations` | int cap | per research-constitution |
  | `iteration_block` | per-round roles + reaction rule + convergence predicate | required iff composition=zig-zag |

- **Zig-zag iteration block schema** (no canonical schema exists on disk; this skill governs it locally): for each round name the roles active, the reaction rule (how each role responds to the prior round's output), and the convergence predicate (the exit test, tied to the Step 6 exit_reason).
- **exit_reason enum** (REUSED VERBATIM from research, 7 values): `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`. The cap-exit value is `max_loops_reached` here (research spelling); the base subagents-strategy constitution spells it `loop_cap_reached`. This skill reuses research's enum verbatim, so it follows the research spelling — `max_loops_reached` matches the enum this skill's telemetry is emitted under and read against. NOTE the trade-off honestly: this does NOT make the value base-compatible — a reader keying off the base taxonomy (`loop_cap_reached`) would see `max_loops_reached` as a mismatch. The contract is: telemetry is emitted and read against research's enum, not the base taxonomy.
- **Skip predicate:** `single + N=1 + explorer` => skip the multi-AGENT machinery (the DEFAULT for ordinary single-author runs) but KEEP the skeptic/citation-strike function AND the cross-reference sub-pass.
</dispatch-wiring>

<cross-reference-discipline>
This is the load-bearing differentiator — the single-owner / nothing-decided-twice contract. The three sibling views divide labor cleanly and NOTHING IS DECIDED TWICE:

- **`ontology-view` owns the terms.** Every term used here is USED, never REDEFINED. Where a term's meaning matters, this view uses it and (if a definition is reached for) points to ontology-view. Redefining a term here is a violation — replace the definition with a use + a pointer.
- **`engineer-view` owns the verdicts.** Every load-bearing stance the shape rests on is NAMED here and DECIDED THERE. For each stance, emit a handle `stance:<slug> → engineer-view#<id>` resolving to exactly one decision row. Stating a verdict here is a violation — downgrade it to "named, pointed across".
- **`system-view` (this view) owns the shape.** The surface, the layered narrative (one conceptual layer at a time), the given-vs-optimized layering, the named-but-undecided stances, the per-section "alternative framings we considered" tables, optional shape diagrams (NO schemas), and the closing "what this view does not cover" map.

**The lane/section model:**
1. **Surface** — "what this is", stated plainly at stakeholder altitude.
2. **Layered shape** — one conceptual layer per section; each layer rests on choices that may carry a named stance; each section carries its own alternative-framings table.
3. **Given-vs-optimized layering** (or domain equivalent) — separate what is fixed-and-obeyed from what is optimized-toward from what merely accumulates; name any stance inside.
4. **Named stances** — each with the tension it carries, UNDECIDED, each pointing to exactly one engineer-view row.
5. **Alternative framings we considered** — one table per major section.
6. **Optional shape diagrams** — flow/relationship sketches at stakeholder altitude; NO schemas, NO contracts.
7. **What this view does not cover** — the closing map: what engineer-view owns (verdicts, schemas, mechanics), what ontology-view owns (terms), and the closing "nothing decided twice" line.

**Invariants (verified at Step 6 and gated at Step 8):**
- every named stance resolves to exactly one engineer-view row (no orphan, no two-row stance, no row with no stance);
- NO verdict is stated here;
- NO term is redefined here.
A stance whose owning row does not exist yet is written PROVISIONAL and flagged as a blocker OQ — never resolved by stating the verdict.
</cross-reference-discipline>

<anti-bias-composition>
Explorers attack distinct vectors (surface / layered shape / stance discovery / given-vs-optimized layering / cross-reference integrity) -> skeptic -> writer (the writer IS the synthesizer; NO separate "summarizer"; the writer authors EACH round; converge is the reviewer's call) -> auditor. Pairwise tension is declared UPFRONT. Default-linear enforces writer-after-skeptic; zig-zag rounds interleave roles as epistemic functions. The skeptic/citation-strike FUNCTION and the cross-reference sub-pass run even on the single-author skip path — phantom citations and orphan/leaked stance handles are the anti-bias failures that most corrupt the artifact.
</anti-bias-composition>

<quality-bar>
(This `<quality-bar>` is an empirically-present-but-UNSANCTIONED hybrid element — no normative SKILL.md body-convention doc exists on disk to sanction it; kept with no claim of sanction.)

A successful execution must:
- state the surface ("what this is") plainly at stakeholder altitude, no schemas, no code;
- author the shape one conceptual layer at a time, each layer with its own "alternative framings we considered" table;
- author a given-vs-optimized layering (or domain equivalent) that separates fixed-and-obeyed from optimized-toward from merely-accumulating;
- NAME every load-bearing stance and DECIDE NONE — each stance carries its tension and a handle `stance:<slug> → engineer-view#<id>` resolving to exactly one decision row;
- state NO verdict (verdicts live only in engineer-view) and REDEFINE NO term (terms live only in ontology-view);
- close with a "what this view does not cover" map that points verdicts to engineer-view and terms to ontology-view, ending on the nothing-decided-twice line;
- verify every precedent citation on disk and strike the unverifiable ones;
- flag coined framing / local language as a project-local overlay;
- emit signals via `domainspec-emit-signals` to the project-under-analysis's `docs/signals/pipeline-signals.jsonl` (repo-root-anchored).
</quality-bar>

<anti-patterns>
Avoid:
- declaring `Agent` instead of `Task` in allowed-tools (convention divergence — do NOT assert "Agent fails harness validation");
- **stating a verdict** — deciding a stance instead of naming it and pointing across to engineer-view;
- **redefining a term** — writing a definition that belongs in ontology-view instead of using the term and pointing across;
- an **orphan stance handle** (a `stance:<slug>` with no engineer-view row), a stance pointing at two rows, or an engineer-view row no stance points to;
- resolving a missing engineer-view row by stating the verdict inline instead of writing the handle PROVISIONAL + flagging a blocker OQ;
- dropping into **schemas or code** — this view is shape-only; contracts and schemas belong in engineer-view;
- dropping the per-section "alternative framings we considered" table, or the closing "what this view does not cover" map;
- collapsing the layered shape into one undifferentiated blob, or flattening the given-vs-optimized layering into "everything is a knob we tune";
- copying the generated-runtime frontmatter overlay; adding tier/domain/version sigil-header fields;
- introducing a separate "summarizer" role; dropping the skeptic/citation-strike function or the cross-reference sub-pass on the skip path; running the heavy zig-zag path where the skip predicate applies;
- routing dispatch THROUGH `research/SKILL.md` instead of as a peer wave-recipe;
- coining a narrower exit_reason enum instead of reusing research's 7-value enum; spelling the cap exit `loop_cap_reached` when research's enum (followed here) says `max_loops_reached`;
- emitting Arcanum `sigil-invocations.jsonl` instead of `domainspec-emit-signals` -> `pipeline-signals.jsonl`; rendering observability as an `<observability>` sigil tag;
- citing phantom constructs; smoothing away dissent / false consensus; leaking GoldenQuill locals (CIC/CLC/council/seat-names/etc.); leaving the zig-zag loop unbounded;
- re-running Step 6's content review inside the Step 8 gate; relying on a "section order matches the 8 steps" rule with no process-to-section map.
</anti-patterns>

## Observability (mandatory epilogue — rendered as process text, not a sigil tag)

After Step 8, emit the post-run signal envelope through **`domainspec-emit-signals`** as a MANDATORY epilogue, appending a `SIGNAL-SCHEMA.md`-conformant envelope to **`<repo-root-of-the-project-under-analysis>/docs/signals/pipeline-signals.jsonl`**. ANCHOR (deterministic, do NOT use a bare relative path — several `docs/signals/pipeline-signals.jsonl` exist across the tree and none at repo root): resolve `<repo-root-of-the-project-under-analysis>` as the nearest ancestor of the project-under-analysis containing a `docs/signals/` directory; if none exists, fall back to the nearest ancestor containing `.git`; CREATE the `docs/signals/` dir + the `.jsonl` file if absent. This is the SOLE sanctioned emission path; cite the `domainspec/.claude/` emit-signals copy, NOT a `mars-research-emit-signals` sibling in the `.github`/copilot trees. Do NOT emit Arcanum `sigil-invocations.jsonl` (a non-federated separate stream). Do NOT render this contract as an `<observability>` sigil tag (0 hand-authored domainspec SKILL.md carry that tag).

Signal payload: term source path; decision-inventory path; layers authored; stances named; cross-reference handles emitted (resolved / provisional); verdicts-stated count (MUST be 0 — non-zero is a blocker); terms-redefined count (MUST be 0 — non-zero is a blocker); alternative-framings tables present per major section; closing "what this view does not cover" map present; open questions; blocker OQs; struck citations; `exit_reason`; validation result.

NOTE: no end-to-end zig-zag system-view exists yet — the lifecycle is transfer-validated (the loop-back/converge/exit machinery is exercised in peer domainspec dispatches, never yet end-to-end for a system-view). The witnessed instance is a system-view + engineer-view pair; the full triad invariant (term/verdict/shape) is asserted across the pair, not witnessed across all three on disk.

<output-contract>
Return:

```markdown
## System View Result

- Mode: draft | validate | review | publish
- Project: <path>
- Term source (ontology-view / vocabulary): <absolute path or "not yet authored">
- Decision inventory (engineer-view): <absolute path or "not yet authored — handles provisional">
- Layers authored: <count>
- Stances named: <count> (resolved <r> / provisional <p>)
- Verdicts stated: <MUST be 0>
- Terms redefined: <MUST be 0>
- Alternative-framings tables: <count> (one per major section)
- "What this view does not cover" map: present | MISSING (blocker)
- Open questions: <count>
- Blockers: <count> (<list>)
- Overlay status: project-local-overlay | promotable
- exit_reason: success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error
- Next action: <action>
```
</output-contract>
