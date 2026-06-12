---
name: engineer-view
description: "Author the lower half of a system-view / engineer-view pair: the mechanics-and-verdicts view that OWNS every verdict. Its differentiator is the decision inventory — every load-bearing stance named in the companion system-view resolves to exactly ONE owning row, each with a verdict, a status (RESOLVED / OPEN / CRITICAL), and a CITED authority verified on disk; plus the schemas/contracts and the runtime mechanics. It re-narrates NO shape (points up to system-view) and redefines NO term (points to ontology-view). (Body invariants — single-owner cross-reference discipline, authority-citation strike-on-unverifiable, residue ledger, anti-bias lifecycle, telemetry via domainspec-emit-signals — are detailed below.)"
argument-hint: "<project-or-corpus-path> [--system-view <path>] [--ontology-view <path>] [--discovery <path>] [--mode draft|validate|review|publish] [--output <path>] [--composition single|task-fan-out|zig-zag] [--max-iterations <n>] [--dry-run]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Task
---

<!--
FRONTMATTER CONVENTION NOTES (load-bearing, do not strip):
- This is a HAND-AUTHORED domainspec-* skill, authored as a faithful SIBLING of `ontology-view`.
  Its frontmatter anchors to the domainspec-* MAJORITY shape (name + description + argument-hint
  + allowed-tools). The anchor is the majority shape, NOT a universal invariant —
  domainspec-subagents-strategy itself carries only name + description, so do not cite the
  dispatch engine's own frontmatter as an agent+argument-hint exemplar.
- agent: INTENTIONALLY OMITTED. The parent session ENACTS the strategist/orchestration role
  directly (mirroring research/SKILL.md and the ontology-view sibling), per
  domainspec-subagents-strategy where "strategist" is a ROLE the parent enacts (the skill body
  says: "When this skill is active, you (the parent Claude session) enact the strategist role"),
  NOT a registered loadable agent. Do NOT bind a `domainspec-strategist` token: no such agent
  file exists, and a frontmatter `agent:` token with no backing file risks a load failure or a
  silently dropped binding.
- allowed-tools declares Task, NOT Agent. This is CONVENTION-CONFORMANCE matching the
  ontology-view sibling: the hand-authored domainspec siblings declare Task, not Agent, in
  allowed-tools (re-count at authoring time — the exact denominator drifts across tree scopes;
  the stable invariant is "the hand-authored siblings declare Task, not Agent"). It is NOT a
  harness gate: Agent is the runtime name and core skills declare Agent and load fine; no
  validator code rejecting Agent exists. The choice diverges from the hand-authored-sibling
  convention deliberately — it is NEVER "Agent fails harness validation".
- AskUserQuestion (not AskQuestions) is the chosen user-gate token, matching the ontology-view
  sibling and the user-gating siblings (decision-gate / readiness-gate / start). It is a
  defensible split-neutral choice anchored to the gating siblings, not a count win.
- OMITTED on purpose: tier / domain / version (Arcanum-generated-sigil fields — the hand-authored
  domainspec skills do not carry them).
- EXPLICITLY FORBIDDEN here (bootstrap-only overlay, asserts a regeneration contract that does
  NOT exist for a hand-authored skill): surface_kind / runtime / canonical_source / generated_by
  / mutation_policy — and the Agent token they ship with. Do NOT mirror a generated-runtime
  frontmatter overlay.
- Body family = domainspec-* (<objective>/<context>/<process>/<output-contract>). <quality-bar>
  and <anti-patterns> are rendered as checklists/guardrail-lists; observability is rendered as
  PROSE (a ## Observability epilogue), NOT an <observability> sigil tag. <quality-bar> is an
  empirically-present-but-UNSANCTIONED hybrid (no normative SKILL.md body-convention doc exists
  on disk); kept with no claim of sanction, matching the ontology-view sibling.
-->

# Skill: Engineer View

<objective>
Produce the **engineer-view** — the lower half of a system-view / engineer-view pair — that OWNS every load-bearing verdict the companion system-view names but declines to decide. The view authors a **decision inventory** where each stance gets its SINGLE owning row (verdict + status RESOLVED / OPEN / CRITICAL + an authority cited and verified on disk), then refines that view's shape down to the **schemas / contracts** and the **runtime mechanics**; it re-narrates no shape (it points up to system-view) and redefines no term (it points to ontology-view), so nothing is decided twice.
</objective>

<context>
Mechanics-and-verdicts authoring under an anti-bias multi-agent lifecycle. The BODY family is **domainspec-*** (`<objective>/<context>/<process>/<output-contract>`). The view inherits the objective-first (<=3-sentence) gate and the hand-authored discovery frontmatter shape **by reference** from `discovery-writing.md` + `frontmatter.md` (adding only `governance_status: project-local-overlay` as a local delta), and rides `node_type: discovery`. The engineer-view is the LOWER half of the pair: the **system-view** owns the shape/prose and *names* the load-bearing stances without deciding them; the engineer-view *refines* that shape down to mechanics and OWNS the verdicts. Beneath both sits the **ontology-view**, which owns the typed schema (term meaning). The single-owner contract — defined in `<cross-reference-discipline>` and `<decision-inventory-discipline>` below — is the load-bearing differentiator: every stance system-view names resolves to exactly one engineer-view decision row, and every row cites an authority. Confidence semantics, where any belief-bearing node appears, follow `ontology-conventions.md`'s `veracidade` / `convicção` Applicability convention (the constitution on disk uses named headings, not a `§N` scheme — cite the resolved heading at run time).
</context>

<modes>
- `draft` — Steps 1-5 + 7: resolve the sibling corpus, compose, build the decision inventory (one verdict per stance, authority on each), author the schemas/contracts and the runtime mechanics, write the residue ledger. Produces the artifact in draft.
- `validate` — Step 3 only, standalone: validate a composed dispatch spec before any agent runs (accept | reject-with-fixes | escalate).
- `review` — Step 6 only, standalone: round-level skeptic/auditor pass over an existing draft (authority verification, stance-coverage check, duplicate-verdict check, dissent surfacing) feeding converge/exit.
- `publish` — Step 8 only: publication-gate the artifact and emit signals. Does NOT re-run Step 6's content review.

(The gate split is modeled as modes for compactness; whether validate/review/publish should instead be three companion SKILL packages mirroring research-validate/review/promote is an open owner's call — see Open questions. This mirrors the ontology-view sibling.)
</modes>

<applicability>
Use when a project has a **system-view** sibling (or any source corpus rich enough to mine load-bearing stances from) AND needs a single home where every named stance is *decided* — one verdict per stance, each citing an on-disk authority — alongside the schemas/contracts and runtime mechanics that refine the shape into machine reality. The canonical seed corpus is the **`discovery`**: when no system-view exists yet, harvest the stances to be decided from the discovery's design decisions and Open Questions — the discovery is the one upstream input the triad does not circularly depend on, so it lets the engineer-view bootstrap its inventory before a system-view exists. Skip when there is no system-view (or equivalent) naming stances to resolve — with nothing to decide, there is no inventory to own — or when a simple inventory lookup suffices. This skill is **single-instance-validated**: the GoldenQuill / Tilth engineer-view at `C:\Users\victo\domainspec-core\projects\goldenquill\victor\engineer-view.md` (verified on disk) is the ONLY validated on-disk instance of an engineer-view artifact; the first non-GoldenQuill run is the reusability proof. Be honest about what that one instance does NOT show: it carries no `governance_status` overlay field and emits no `domainspec-emit-signals` envelope (both are skill-introduced disciplines this view adds), so the overlay-status and telemetry disciplines are **transfer-asserted, not witnessed on disk** — do not present the worked example as a model of either.
</applicability>

<inputs>
- The project's companion **system-view** (the source of the stances that MUST each resolve to a decision row) and its **ontology-view** (the term-meaning floor this view points to), or the project's source corpus.
- The **`discovery`** (if present) — the canonical SEED CORPUS when no system-view exists yet. Its **Open Questions** (each carrying a recommendation) seed the OPEN / CRITICAL decision rows, and its **design decisions** (Core Concepts + Detailed Specifications) seed the RESOLVED rows. The discovery is the one upstream input the triad does not circularly depend on, so it lets the engineer-view bootstrap its inventory — harvest stances from the discovery's design decisions when system-view is absent. A discovery Open Question with no enforcing gate becomes an OPEN/CRITICAL row citing "no running gate in repo", never a RESOLVED row.
- The project's canonical / architecture sources from which verdicts draw their AUTHORITY: ADRs, architecture-version files, `CLAUDE.md`/`README.md`, blueprint/spec files, and any running gate (a failure-code, a validator body, a CI check). Every verdict cites one; an OPEN/CRITICAL row whose authority is "no running gate in repo" states exactly that.
- Prior decision inventory, if the project already carries one, so existing verdicts are reconciled rather than re-minted.

An engineer-view rides `node_type: discovery`; `governance_status: project-local-overlay` keeps it out of promotion until the owning amendment is filed.
</inputs>

<reusability-contract>
A NON-GoldenQuill project MUST supply: (1) its own **system-view** (or an explicit stance list) so the decision inventory has named stances to resolve; (2) its own **authority sources** (ADRs / architecture versions / running gates) — a verdict with no citable authority is OPEN-by-default, not RESOLVED; (3) its own **ontology-view** (or term source) to point term meaning at.

The skill provides GENERICALLY: the lifecycle; the decision-inventory discipline (status legend, one-verdict-per-stance, authority-required); the single-owner cross-reference contract; the residue ledger and open-questions discipline.

**PEER-NOT-NESTED:** the skill re-implements the explorer/skeptic/writer/auditor lifecycle LOCALLY and routes composition through `domainspec-subagents-strategy` as a PEER wave-recipe — it does NOT dispatch through `research/SKILL.md`. Routing through research would create the two-orchestrator ungoverned-channel failure: research is a self-contained domain port keyed to `discoveries/`, not a generic dispatcher. The local re-implementation is a deliberate portability choice, not duplication to eliminate.

**Reusability-proof checklist** (the first non-GoldenQuill run must mechanically satisfy all):
- [ ] every stance named in the project's own system-view resolves to exactly ONE decision row (zero = orphaned-stance blocker; two = duplicate-verdict violation);
- [ ] every decision row cites an authority (file / ADR / architecture-version, OR an explicit "no running gate in repo" for an OPEN/CRITICAL row);
- [ ] CRITICAL is marked on the rows that block the project's own core thesis;
- [ ] zero `EXAMPLE-REPLACE-ME` rows survive into the artifact;
- [ ] zero GoldenQuill tokens leak: `CIC`, `CLC`, `TILTH-*`, `council` / council-seat, `gq_kind`, and the worked example's D1–D10 row literals (`F-CIC-CLC-COUPLING-VIOLATION`, `Scout`/`Scribe`/`Logician`, the `eligibility_filter.py` cite, etc.).
</reusability-contract>

<default-output>
1. `<project>/engineer-view.md` as a sibling to the system-view and ontology-view, when the project folder exists;
2. else `.arcanum/engineer-view/<slug>.md`;
3. else a markdown report in chat.

Per-agent dispatch files live under the dispatch folder, e.g. `<dispatch-folder>/<view_slug>/agents/`. The composed dispatch spec is persisted to the dispatch folder before dispatch (Step 3).
</default-output>

<provenance-and-mutation>
This view is a **derive-only canonical artifact**; its source **`discovery` is the SOLE sanctioned mutation trigger**, and the artifact is NEVER hand-edited. To change it, revise (or supersede) the discovery, then re-run THIS skill in **evolve mode** (`--mode draft` over the existing file), which **reconciles** the view against the discovery delta — preserving the view's own authored **verdicts, RESOLVED/OPEN/CRITICAL statuses, and cited authorities** except where the delta forces a change. This is **reconcile-not-regenerate**: the view carries judgment the discovery does not (the verdicts and on-disk authority citations exist nowhere in the discovery — the Open Questions do, the answers do not), so it is never rebuilt from scratch.

- **The link is an EDGE, not a frontmatter field.** The artifact declares `derives-from → discovery.md` in its `## Connections` block (inverse `derives` on the discovery), riding the existing `node_type: discovery` edge catalog. It does NOT add `generated_by` / `mutation_policy` / `canonical_source` frontmatter — those are FORBIDDEN by the template frontmatter note because they assert the regenerate contract this view rejects.
- **Drift is version-based.** The `## Connections` row records the discovery `version` last reconciled against; when the discovery's current `version` exceeds that baseline the view is STALE — flagged by an audit-alignment-style drift check and reconciled via evolve mode, never hand-patched.
</provenance-and-mutation>

<process>
The lifecycle steps. The artifact SECTION ORDER follows the `<process-to-section map>` below, NOT a literal 1:1 with these steps.

**Step 1 — Resolve scope + sibling corpus; harvest the stances to be decided; locate the authority sources.**
Locate the project, its companion system-view + ontology-view (or source corpus), and the project's authority sources (ADRs, architecture-version files, `CLAUDE.md`, blueprint/spec files, running gates). HARVEST the load-bearing stances: read system-view and extract every stance it *names but does not decide* (the "named here; verdict lives in engineer-view" markers). Each harvested stance is a required row in the decision inventory — record it as `stance:<slug>` so coverage can be checked mechanically in Step 6. Do NOT decide anything yet; this step produces the stance list and the authority-source map.

**Step 2 — Compose the multi-agent authoring spec (anti-bias); ENACT the strategy skill, then Task-dispatch the registered writer agents.**
Name the engine and the wiring; do not leave it to invention. The invocation path is TWO distinct mechanisms — do NOT conflate them: (1) the PARENT session ENACTS the **`domainspec-subagents-strategy`** SKILL (via the Skill/slash invocation, enacting the strategist role) to COMPOSE the wave recipe — `domainspec-subagents-strategy` is a SKILL the parent enacts, NOT an agent file, and there is NO `domainspec-subagents-strategy` agent on disk to Task-dispatch; (2) the strategist THEN dispatches the registered WRITER / explorer / role agents the strategy composes USING THE **Task** tool (Task targets registered agents, never a skill name). Force a TYPED parameter table WITH DEFAULTS: `goal` (one load-bearing sentence), `view_slug` (kebab-safe), `success_metric` (typed), `composition` (single|task-fan-out|zig-zag, default zig-zag), `max_iterations` (cap). Add the zig-zag ITERATION BLOCK to the table: per-round roles + reaction rule + convergence predicate tied to the Step 6 exit_reason. Each explorer attacks a distinct vector (stance-harvest completeness / verdict-and-authority adjudication / schema-and-contract extraction / runtime-mechanics tracing) with pairwise tension declared UPFRONT. Role chain: explorer -> skeptic -> writer -> auditor; the WRITER IS the synthesizer (no separate "summarizer"). Default-linear enforces writer-never-before-skeptic; under zig-zag, roles are epistemic functions that may interleave. See `<dispatch-wiring>`.

**Step 3 — Validate the spec; gate-resolve; bound retries; USER-CONFIRM before dispatch.**
Check goal load-bearing, success_metric typed, role ordering, per-layer mode well-formed, pairwise tension upfront, max_iterations within cap, view_slug kebab-safe. A zig-zag layer with NO iteration block FAILS validation. Apply the SKIP predicate (`single + N=1 + explorer` => skip the multi-AGENT dispatch machinery; this is the DEFAULT for ordinary single-author runs, zig-zag opt-in, since no end-to-end zig-zag engineer-view exists yet). CARVE-OUT: even on the skip path the author MUST still run the **skeptic/authority-strike sub-pass** (verify every verdict's authority on disk; a verdict whose authority cannot be verified must be DOWNGRADED/FLAGGED — analogous to ontology-view's LIVE->PLANNED guard downgrade: a RESOLVED row whose cited authority is unverifiable cannot stand as RESOLVED and is flagged for downgrade to OPEN with a struck-authority note). Skip drops the multi-AGENT dispatch, NOT the skeptic FUNCTION. Emit accept | reject-with-fixes | escalate and resolve: accept -> `AskUserQuestion` confirm/revise/abandon (abandon => nothing persists) -> dispatch; reject-with-fixes -> loop back to Step 2 with named fixes (this re-loop IS the single retry); SECOND reject -> escalate, halt with `exit_reason=validator_rejected_twice`. PERSIST the composed spec to the dispatch folder before dispatch.

**Step 4 — Dispatch explorers -> build the decision inventory; collect per-agent files.**
Dispatch the writer/explorer agents composed by the enacted `domainspec-subagents-strategy` skill via the **Task** tool (Task targets the registered agents, not the strategy skill name). For each harvested stance, author ONE decision row: `#`/id, the decision-or-stance text, the VERDICT, a STATUS (RESOLVED / OPEN / CRITICAL — see `<decision-inventory-discipline>`), and a cited AUTHORITY verified on disk. Back-reference each row to the system-view stance it answers (`system-view#stance:<slug>`). One verdict per stance: zero rows for a named stance = orphaned-stance blocker; two rows deciding the same stance = duplicate-verdict violation. Collect per-agent explorer outputs into the dispatch `agents/` folder. SURFACE for Step 6 any row whose authority could not be verified on disk (the strike candidates).

**Step 5 — Author the schemas / contracts and the runtime mechanics.**
Refine the system-view shape down to mechanics: declare each load-bearing SCHEMA / CONTRACT (record fields, enums, the verdict-bearing states, failure-code families) with a source-file cite, and trace the RUNTIME MECHANICS (how the pieces join, which gate enforces which verdict, where each decision row is enforced or where its enforcement is absent). Every contract and mechanic points back to the decision row whose verdict it realizes (and that row points up to the system-view stance). Re-narrate NO shape here — if a sentence is describing the *shape* rather than the *mechanism*, it belongs in system-view and this view points to it; if it is *defining a term*, it belongs in ontology-view.

**Step 6 — Independent ROUND-LEVEL review (zig-zag) -> converge OR exit with typed reason; VERIFY every authority on disk; CHECK stance coverage + duplicate verdicts.**
An independent reviewer (skeptic/auditor) pressure-tests the inventory: (a) STANCE COVERAGE — every system-view-named stance resolves to exactly ONE row (zero = orphaned-stance blocker; two = duplicate-verdict violation); (b) AUTHORITY VERIFICATION (**Bash/Read**) — every row's cited authority is reachable on disk and actually supports the verdict; an unverifiable authority is STRUCK and its row downgraded (a RESOLVED row with a struck authority cannot remain RESOLVED — flag for OPEN); (c) STATUS HONESTY — CRITICAL is marked on exactly the rows that block the core thesis, and a "RESOLVED" row with no running gate is examined for over-claim. Surface false-consensus (N>=3 with zero dissent) as a failure. SCOPE: ROUND-LEVEL CORRECTNESS feeding converge/exit ONLY — this is NOT publication gating (Step 8). Bind loop-back BY DISSENT CLASS: inventory/verdict dissent -> Step 4 only; schema/mechanics dissent -> Step 5 only; cross-cutting -> both. Any loop-back = ONE iteration against max_iterations. On convergence OR max_iterations -> exit with a TYPED `exit_reason` from research's 7-value enum (`success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`). SPELLING NOTE: the cap-exit value is `max_loops_reached` in the research enum but `loop_cap_reached` in the base subagents-strategy constitution (the base spells it `loop_cap_reached`); this skill REUSES research's enum verbatim and FOLLOWS the research spelling (`max_loops_reached`) so telemetry stays consistent with the enum it is emitted under and read against. This is NOT base-compatible: a reader keying off the base taxonomy would see `max_loops_reached` as a mismatch — the emitter/reader contract is research's enum, not the base one.

**Step 7 — Write residue ledger + open questions.**
Every load-bearing VERDICT maps to >=1 ledger row with status (closed=adjudicated/fixed | open=true preserved residue), surviving residue text, and a citation drawn from the per-agent files. Open residue is preserved, never demoted. Open questions carry recommendations and name their owner; the OPEN/CRITICAL decision rows ARE the questions a stakeholder must weigh — surface them as OQs. Blocker-level OQs (an orphaned stance with no row, a duplicate verdict, a RESOLVED row resting on a struck authority, a CRITICAL row whose blocker is unowned) are flagged, not waved through. NON-CONTIGUOUS OQ numbering is acceptable — do NOT renumber.

**Step 8 — PUBLICATION-LEVEL validate + publish as project-local overlay (user-gated); emit signals.**
SCOPE: PUBLICATION GATING ONLY — does NOT re-run Step 6's content review. Validate ONLY: link integrity, the decision-inventory shape (every row has verdict + status + authority), the stance-coverage map (every system-view stance -> exactly one row), `governance_status` overlay correctness, the cross-reference map, the output-contract. Mark coined / project-local content as a project-local overlay via `governance_status`. Emit the cross-reference map pointing every verdict to this view as its single owner and pointing shape up to system-view / terms down to ontology-view (nothing decided twice), and the output-contract report. Then run the MANDATORY observability epilogue (see `## Observability`). User-gated.
</process>

<process-to-section map>
The canonical map from each `<process>` step to the artifact section(s) it produces. The template section ORDER follows THIS map (not a literal 1:1 with the steps), which is what makes the section-order rule satisfiable.

| Step | Artifact section(s) produced |
|---|---|
| Step 1 | What this view owns (the four deferred things) + the harvested stance list (feeds the inventory) |
| Step 2 | (composition spec — dispatch-folder artifact, not an artifact section) |
| Step 3 | (validated/persisted spec — dispatch-folder artifact, not an artifact section) |
| Step 4 | Decision inventory (the verdict table) |
| Step 5 | Schemas and contracts + Runtime mechanics |
| Step 6 | (round-level review pass — no artifact section) |
| Step 7 | Open questions + Residue ledger |
| Step 8 | Cross-reference map + overlay status |
</process-to-section map>

<dispatch-wiring>
Compose the wave recipe by ENACTING the **`domainspec-subagents-strategy`** SKILL (parent session enacts the strategist role — a Skill/slash invocation, NOT a Task target: there is no `domainspec-subagents-strategy` agent file on disk). The strategy is a PEER wave-recipe. The **Task** tool is then used ONLY to dispatch the registered WRITER / explorer / role agents the strategy composes — Task targets registered agents, never the strategy skill's name. Do NOT route through `research/SKILL.md`: research is a domain port keyed to `discoveries/`, not a dispatcher, and routing through it creates the two-orchestrator ungoverned-channel failure. Do not leave the wiring to the agent to invent.

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
- **exit_reason enum** (REUSED VERBATIM from research, 7 values): `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`. The cap-exit value is `max_loops_reached` here (research spelling); the base subagents-strategy constitution spells it `loop_cap_reached`. This skill reuses research's enum verbatim, so it follows the research spelling — `max_loops_reached` is what MATCHES the enum this skill's telemetry is emitted under and read against. NOTE the trade-off honestly: this does NOT make the value base-compatible — a reader keying off the base subagents-strategy taxonomy (`loop_cap_reached`) would see `max_loops_reached` as a mismatch. The contract is: telemetry is emitted and read against research's enum, not the base taxonomy.
- **Skip predicate:** `single + N=1 + explorer` => skip the multi-AGENT machinery (the DEFAULT for ordinary single-author runs) but KEEP the skeptic/authority-strike function.
</dispatch-wiring>

<cross-reference-discipline>
The single-owner / nothing-decided-twice contract — this is the LOAD-BEARING differentiator of the engineer-view.

- **engineer-view OWNS every verdict.** Each verdict lives in exactly one decision row, keyed `decision:#<id>`. No verdict is stated anywhere else; the other views POINT here.
- **Each row back-references the system-view stance it answers** (`system-view#stance:<slug>`). The mapping is bijective on the stance set: every stance system-view *names but does not decide* resolves to exactly ONE row.
  - ZERO rows for a named stance = **orphaned-stance blocker** (a stance was named upstream and never decided here).
  - TWO rows deciding the same stance = **duplicate-verdict violation** (the verdict was decided twice; nothing may be decided twice).
- **Defer SHAPE to system-view.** This view states the shape NOWHERE. If a passage narrates the *shape* (the stakeholder-altitude story, the given-vs-optimized layering), it points up to system-view rather than re-narrating it.
- **Defer TERM MEANING to ontology-view.** This view redefines NO term. A term's typed definition lives in ontology-view; engineer-view cites it.
- **Every verdict cites an AUTHORITY** — a file / ADR / architecture-version / running gate verified on disk, OR an explicit "no running gate in repo" for an OPEN/CRITICAL row. A verdict with no citable authority is OPEN-by-default, never RESOLVED.
</cross-reference-discipline>

<decision-inventory-discipline>
The decision inventory is the heart of the engineer-view. Columns: **# | Decision-or-stance | Verdict | Status | Authority** (matching the worked example).

**Status legend (verbatim discipline):**
- **RESOLVED** — decided AND enforced (a verdict is reached and a gate/authority enforces it on disk).
- **OPEN** — named, not decided (the stance is acknowledged but no verdict is enforced; includes *designed-but-not-built* rows).
- **CRITICAL** — OPEN *and* blocks the core thesis until built/decided. CRITICAL is the subset of OPEN that a stakeholder must resolve before the project's central value claim holds.

**Invariants:**
- **One verdict per stance.** Each named stance resolves to exactly one row (see `<cross-reference-discipline>` for the orphaned-stance / duplicate-verdict blockers).
- **Authority required on EVERY row.** RESOLVED rows cite the file/ADR/architecture-version/running gate that decides AND enforces them; OPEN/CRITICAL rows cite their evidence and may carry an explicit "no running gate in repo" where no enforcement exists yet. A row with no authority cell is invalid.
- **Mark CRITICAL the rows that block the core thesis.** Identify the project's central value claim and flag every OPEN row whose unresolved state would invalidate it as CRITICAL. Under-marking (a thesis-blocking row left plain OPEN) and over-marking (a non-blocking row marked CRITICAL) are both review failures.
- **Authority-strike rule:** a RESOLVED row whose cited authority cannot be verified on disk (Step 6) is DOWNGRADED — its authority is struck and the row drops to OPEN with a struck-authority note. This is the engineer-view analogue of the ontology-view LIVE->PLANNED downgrade.
</decision-inventory-discipline>

<quality-bar>
(This `<quality-bar>` is an empirically-present-but-UNSANCTIONED hybrid element — no normative SKILL.md body-convention doc exists on disk to sanction it; kept with no claim of sanction, matching the ontology-view sibling.)

A successful execution must:
- harvest every stance system-view names-but-does-not-decide, and resolve each to exactly ONE decision row;
- give every decision row a verdict, a status (RESOLVED / OPEN / CRITICAL), and an authority verified on disk;
- mark CRITICAL exactly the rows that block the project's core thesis;
- strike any unverifiable authority and downgrade the RESOLVED row that rested on it to OPEN;
- author the schemas / contracts and the runtime mechanics, each pointing back to the verdict it realizes;
- re-narrate no shape (point up to system-view) and redefine no term (point to ontology-view);
- map every load-bearing verdict to a residue row, and surface OPEN/CRITICAL rows as the questions a stakeholder must weigh;
- flag coined / project-local content as a project-local overlay (`governance_status`);
- emit signals via `domainspec-emit-signals` to the project-under-analysis's `docs/signals/pipeline-signals.jsonl` (repo-root-anchored).
</quality-bar>

<anti-patterns>
Avoid:
- declaring `Agent` instead of `Task` in allowed-tools (convention divergence — do NOT assert "Agent fails harness validation");
- deciding a stance TWICE (duplicate-verdict violation) or leaving a named stance with NO row (orphaned-stance blocker);
- stating a verdict in this view AND restating it in system-view or ontology-view (nothing is decided twice — the verdict lives only here);
- RE-NARRATING the shape here instead of pointing up to system-view; REDEFINING a term here instead of pointing to ontology-view;
- marking a row RESOLVED with no citable authority, or citing an authority without verifying it on disk;
- leaving a RESOLVED row standing on a STRUCK / unverifiable authority instead of downgrading it to OPEN;
- under-marking a thesis-blocking row as plain OPEN, or over-marking a non-blocking row CRITICAL;
- copying the worked example's D1–D10 row literals (the GoldenQuill `CIC`/`CLC` coupling rows, the council seats, the eligibility-filter cite) into a new project's artifact;
- copying the generated-runtime frontmatter overlay; adding tier/domain/version sigil-header fields;
- introducing a separate "summarizer" role; dropping the skeptic/authority-strike function on the skip path; running the heavy zig-zag path where the skip predicate applies;
- routing dispatch THROUGH `research/SKILL.md` instead of as a peer wave-recipe;
- coining a narrower exit_reason enum instead of reusing research's 7-value enum; spelling the cap exit `loop_cap_reached` when research's enum (followed here) says `max_loops_reached`;
- emitting Arcanum `sigil-invocations.jsonl` instead of `domainspec-emit-signals` -> `pipeline-signals.jsonl`; rendering observability as an `<observability>` sigil tag;
- re-running Step 6's content review inside the Step 8 gate; relying on a "section order matches the steps" rule with no process-to-section map.
</anti-patterns>

## Observability (mandatory epilogue — rendered as process text, not a sigil tag)

After Step 8, emit the post-run signal envelope through **`domainspec-emit-signals`** as a MANDATORY epilogue, appending a `SIGNAL-SCHEMA.md`-conformant envelope to **`<repo-root-of-the-project-under-analysis>/docs/signals/pipeline-signals.jsonl`**. ANCHOR (deterministic, do NOT use a bare relative path — several `docs/signals/pipeline-signals.jsonl` may exist across the tree and none at repo root): resolve `<repo-root-of-the-project-under-analysis>` as the nearest ancestor of the project-under-analysis containing a `docs/signals/` directory; if none exists, fall back to the nearest ancestor containing `.git`; CREATE the `docs/signals/` dir + the `.jsonl` file if absent. This is the SOLE sanctioned emission path. Do NOT emit Arcanum `sigil-invocations.jsonl` (a non-federated separate stream). Do NOT render this contract as an `<observability>` sigil tag (the hand-authored domainspec SKILL.md siblings do not carry that tag).

Signal payload: decisions by status (RESOLVED / OPEN / CRITICAL counts); rows missing authority; system-view stances resolved vs orphaned; duplicate-verdict violations; struck / unverifiable authorities (and the rows downgraded as a result); residue rows; open questions; blocker OQs; `exit_reason`; validation result.

NOTE: no end-to-end zig-zag engineer-view exists yet — the lifecycle is transfer-validated (the loop-back/converge/exit machinery is exercised in peer domainspec dispatches, never yet end-to-end for an engineer-view). The one validated on-disk engineer-view artifact (GoldenQuill / Tilth) carries no overlay field and emits no signal envelope, so the overlay-status and telemetry disciplines are transfer-asserted, not witnessed.

<output-contract>
Return:

```markdown
## Engineer View Result

- Mode: draft | validate | review | publish
- Project: <path>
- System-view resolved: <path> (stances harvested: <count>)
- Decision rows: <total> — RESOLVED <r> / OPEN <o> / CRITICAL <c>
- Stance coverage: <resolved>/<named> (orphaned stances: <count>, duplicate verdicts: <count>)
- Rows missing authority: <count>
- Struck / unverifiable authorities: <count> (rows downgraded: <count>)
- Schemas / contracts authored: <count>
- Residue rows: <closed>/<open>
- Blockers: <count> (<list>)
- Overlay status: project-local-overlay | promotable
- exit_reason: success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error
- Next action: <action>
```
</output-contract>
