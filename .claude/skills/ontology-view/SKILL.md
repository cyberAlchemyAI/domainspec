---
name: ontology-view
description: "Author a fourth sibling ontology-view for a project that already has discovery / system-view / engineer-view (or any source corpus), formalizing the domain as typed nodes + typed edges. The differentiator: forbidden relationships become unconstructible — category-errors typed so no catalog edge admits the endpoint pair, and reflexive/self-loop relations caught by named predicate guards — instead of merely asserted in prose. (Body invariants — constitution resolution by version+path, run-time live-edge counting with mismatch surfacing, confidence on belief-bearing nodes only, residue ledger, anti-bias lifecycle, telemetry via domainspec-emit-signals — are detailed below.)"
argument-hint: "<project-or-corpus-path> [--siblings discovery,system-view,engineer-view] [--mode draft|validate|review|publish] [--output <path>] [--composition single|task-fan-out|zig-zag] [--max-iterations <n>] [--constitution <path-to-ontology-conventions.md>] [--dry-run]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Task
---

<!--
FRONTMATTER CONVENTION NOTES (load-bearing, do not strip):
- This is a HAND-AUTHORED domainspec-* skill. Its frontmatter anchors to the domainspec-*
  MAJORITY family shape (name + description + argument-hint + allowed-tools). The
  anchor is the majority shape, NOT a universal invariant — domainspec-subagents-strategy
  itself carries only name + description, so do not cite the dispatch engine's own frontmatter
  as an agent+argument-hint exemplar.
- agent: INTENTIONALLY OMITTED. The parent session enacts the strategist/orchestration role
  directly (mirroring research/SKILL.md), per domainspec-subagents-strategy R24 where
  "strategist" is a ROLE the parent enacts, not a registered loadable agent. An earlier draft
  bound `domainspec-orchestrator` (a real agent at .claude/agents/domainspec-orchestrator.agent.md),
  but that agent's published contract is ROUTE-ONLY ("route each request to exactly one specialist
  workflow; do not replace specialist commands") — binding it as this skill's authoring worker
  inverts its contract. Do NOT bind `domainspec-strategist` either: no such agent file exists, and
  a frontmatter `agent:` token with no backing file risks a load failure or a silently dropped binding.
- allowed-tools declares Task, NOT Agent. This is CONVENTION-CONFORMANCE: 0 hand-authored
  domainspec siblings declare Agent in allowed-tools (re-count at authoring time — the exact
  denominator drifts across tree scopes; the stable invariant is "0 declare Agent"). It is NOT
  a harness gate: Agent is the runtime name, ~21 core skills declare Agent and load fine, and
  no validator code rejecting Agent exists. The choice diverges from 100% of hand-authored
  siblings (convention) — it is NEVER "Agent fails harness validation".
- AskUserQuestion (not AskQuestions) is the chosen user-gate token. The family is EVENLY SPLIT
  (~9/9 WITHIN domainspec-* allowed-tools — the relevant family) between AskUserQuestion and
  AskQuestions — this is NOT a majority within that scope. (The BROADER skills corpus is skewed
  ~41/10 toward AskUserQuestion; the 9/9 even-split claim holds only at domainspec-* scope.) AskUserQuestion
  is chosen because it is the token used by the user-gating siblings (decision-gate / readiness-gate
  / start); it is a defensible split-neutral choice anchored to the gating siblings, not a count win.
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

# Skill: Ontology View

<objective>
Produce a fourth sibling **ontology-view** that formalizes a project's domain as **typed nodes** and **typed edges**, so its load-bearing invariants become *structural* — enforced by typed endpoints where endpoint types differ, and by named predicate guards for the reflexive/self-loop class where endpoints are identical and legal — rather than merely asserted in prose. The view types every node (schema + precedent), types every edge (direction/cardinality/rule/inverse), makes forbidden relationships unconstructible-by-type or predicate-gated, logs every load-bearing claim to a residue ledger, and points every verdict to the engineer-view instead of re-deciding it.
</objective>

<context>
Ontology authoring under governance plus an anti-bias multi-agent lifecycle. The BODY family is **domainspec-*** (`<objective>/<context>/<process>/<output-contract>`); this skill borrows the Arcanum **ontology-vault** SKILL only for *structure-of-ideas* (its `<logic-type>` maps to this `<context>`), never for its bootstrap frontmatter, its Arcana sigil tags, or its Arcanum sigil-invocations telemetry. The view inherits the objective-first (<=3-sentence) gate and the hand-authored discovery frontmatter shape by reference from `discovery-writing.md` + `frontmatter.md` (adding only `governance_status: project-local-overlay` as a local delta), and rides `node_type: discovery` for catalog/edge-legality so all discovery-keyed edge rules apply unchanged. Confidence semantics follow `ontology-conventions.md` §6; node-type taxonomy follows §2; the unconstructibility argument generalizes Appendix C.
</context>

<modes>
- `draft` — Steps 1-5 + 7: resolve, compose, type nodes and edges, author the forbidden-edge guards, write the residue ledger. Produces the artifact in draft.
- `validate` — Step 3 only, standalone: validate a composed dispatch spec before any agent runs (accept | reject-with-fixes | escalate).
- `review` — Step 6 only, standalone: round-level skeptic/auditor pass over an existing draft (precedent verification, guard LIVE/PLANNED verification, dissent surfacing) feeding converge/exit.
- `publish` — Step 8 only: publication-gate the artifact and emit signals. Does NOT re-run Step 6's content review.

(The gate split is modeled as modes for compactness; whether validate/review/publish should instead be three companion SKILL packages mirroring research-validate/review/promote is an open owner's call — see Open questions.)
</modes>

<applicability>
Use when a project has `discovery` + `system-view` + `engineer-view` siblings (or any source corpus) AND needs a machine-checkable typed node/edge layer beneath the prose views — a layer where forbidden relationships are unconstructible rather than discouraged. In the common bootstrap case the prose siblings do not exist yet; then the **`discovery`** is the canonical seed corpus — its Core Concepts seed the typed nodes and the relationships across its Detailed Specifications seed the typed edges (including the candidate forbidden-edge / reflexive cases). The discovery is the one upstream input the triad does not circularly depend on, so it breaks the bootstrap cycle. Skip when a simple inventory lookup suffices, or when there is no decision inventory for verdicts to point at. This skill is **single-instance-validated** (GoldenQuill is the only project on disk carrying the triad); the first non-GoldenQuill run is the reusability proof. Be honest about what that one instance does NOT show: it is a partial COUNTER-example to the constitution-resolution rule (it pinned the stale v2.1.1 mirror by nearest-path and cites it throughout), and it never performed the live-table count (its artifact records only the literal 21, never 25/22/21 or 24/21/21). So both the version+path resolution discipline AND the live-table count are **transfer-asserted, not witnessed on disk** — do not present the worked example as a model of either.
</applicability>

<inputs>
- The project's sibling views (`discovery` / `system-view` / `engineer-view`) or its source corpus.
- The **`discovery`** — the canonical SEED CORPUS when the sibling prose views do not exist yet. Its **Core Concepts** seed the typed NODES (schema + precedent), and the relationships implied across its **Detailed Specifications** seed the typed EDGES — including the candidate forbidden-edge and reflexive/self-loop cases that Step 5's guard discipline acts on. It is the one upstream input the triad does not circularly depend on, so it breaks the bootstrap cycle; a relationship the discovery does not carry is a discovery gap, not an invented edge.
- The **canonical** `ontology-conventions.md`, RESOLVED BY VERSION+PATH (highest-version frontmatter wins, NOT nearest-path): record the resolved absolute path + version + commit/dirty-state; honor a `--constitution` override; flag any lower-version copy as a known stale mirror. (A tree may carry two disagreeing copies — e.g. an upstream beside-file vs an embedded submodule freeze.)
- `edge-catalog.md` — the legality MATRIX (source/target node_type constraints, cardinality, bidirectionality) ONLY. It carries deprecated rows and is NEVER the edge-count source. RESOLUTION: take the `edge-catalog.md` sitting BESIDE the resolved constitution (same directory); if none sits beside it (on disk it does NOT — `edge-catalog.md` exists only under `.claude/skills/custom/` and project copies), resolve by version+path the same way as the constitution and record the resolved path. Do NOT silently pick an unrelated custom-skill copy by nearest-path.
- Project-local label axes (the project's own kind axis; optionally its own scope axis — see `<reusability-contract>`).
- Prior-decisions inventory (the project's D-rows) so verdicts can point across.

An ontology-view rides `node_type: discovery` for catalog/edge-legality; `governance_status: project-local-overlay` keeps it out of promotion until the owning amendment is filed.
</inputs>

<reusability-contract>
A NON-GoldenQuill project MUST supply: (1) its own **kind axis** (the project's analogue of a `gq_kind` label set); (2) its OWN **scope decision** OR an explicit declination — the scope axis (ontology-type vs runtime-instance) is an **OPTIONAL project-declared axis**, not a typing primitive (in the worked example, scope is the settled discovery decision D-13, not a primitive); (3) its own **constitution** (resolved by version+path).

The skill provides GENERICALLY: the 8-step lifecycle; the four-archetype forbidden-edge detection prompts; the constitution-resolution + live-table-count rules; the enforcement-tier gate table.

**PEER-NOT-NESTED:** the skill re-implements the explorer/skeptic/writer/auditor lifecycle LOCALLY and routes composition through `domainspec-subagents-strategy` as a PEER wave-recipe — it does NOT dispatch through `research/SKILL.md`. Routing through research would create the two-orchestrator (Drift-5) ungoverned-channel failure: research is a self-contained KT-port keyed to `discoveries/`, not a generic dispatcher. The local re-implementation is a deliberate portability choice, not duplication to eliminate.

**Reusability-proof checklist** (the first non-GoldenQuill run must mechanically satisfy all):
- [ ] the project's own kind axis is supplied (not `gq_kind`);
- [ ] a scope decision is made-or-explicitly-declined;
- [ ] the constitution is resolved by version+path, path/version/commit recorded;
- [ ] zero `EXAMPLE-REPLACE-ME` rows survive into the artifact;
- [ ] zero GoldenQuill tokens leak: `gq_kind`, `TILTH-*`, `CIC`, `CLC`, `council`, `matrix-card`, the `16-COINED` count, `ontology-type`/`runtime-instance` scope values.
</reusability-contract>

<default-output>
1. `<project>/ontology-view.md` as a sibling to the other views, when the project folder exists;
2. else `.arcanum/ontology-view/<slug>.md`;
3. else a markdown report in chat.

Per-agent dispatch files live under the dispatch folder, e.g. `<dispatch-folder>/<view_slug>/agents/`. The composed dispatch spec is persisted to the dispatch folder before dispatch (Step 3).
</default-output>

<provenance-and-mutation>
This view is a **derive-only canonical artifact**; its source **`discovery` is the SOLE sanctioned mutation trigger**, and the artifact is NEVER hand-edited. To change it, revise (or supersede) the discovery, then re-run THIS skill in **evolve mode** (`--mode draft` over the existing file), which **reconciles** the view against the discovery delta — preserving the view's own authored **typed nodes, typed edges, and forbidden-edge / reflexive guards** except where the delta forces a change. This is **reconcile-not-regenerate**: the view carries judgment the discovery does not (the forbidden-edge discipline is SKILL-INTRODUCED, present nowhere upstream), so it is never rebuilt from scratch.

- **The link is an EDGE, not a frontmatter field.** The artifact declares `derives-from → discovery.md` in its `## Connections` block (inverse `derives` on the discovery), riding the existing `node_type: discovery` edge catalog. It does NOT add `generated_by` / `mutation_policy` / `canonical_source` frontmatter — those are FORBIDDEN by the template frontmatter note because they assert the regenerate contract this view rejects.
- **Drift is version-based.** The `## Connections` row records the discovery `version` last reconciled against; when the discovery's current `version` exceeds that baseline the view is STALE — flagged by an audit-alignment-style drift check and reconciled via evolve mode, never hand-patched.
</provenance-and-mutation>

<process>
The 8 lifecycle steps. The artifact SECTION ORDER follows the `<process-to-section map>` below, NOT a literal 1:1 with these steps.

**Step 1 — Resolve scope + sibling corpus + local vocabulary; resolve the CANONICAL constitution by version+path; COUNT the live forward-edge catalog on disk.**
Locate the project, its sibling views or source corpus, and the `ontology-conventions.md` + `edge-catalog.md`. Detect local labels and translate them to generic concepts WITHOUT promoting local labels to canonical vocabulary.
- CANONICAL-FILE RESOLUTION: a tree may carry two disagreeing `ontology-conventions.md`. Resolve by HIGHEST version frontmatter, scoping the version search to the **project-under-analysis's OWN repository tree** (the nearest ancestor `.git` of the project being analyzed) — NOT the skill package's own tree, and NOT across repo boundaries. (The two disagreeing copies live in DIFFERENT repos on disk: the skill package's beside-file is v2.4.0, while a `-core` project's reachable copies top out at v2.1.1; "highest version wins" must not silently cross from the project's repo into the skill's repo and resolve a constitution the project's live catalog does not key to.) Record the resolved absolute path + version + commit/dirty-state in the artifact; honor `--constitution`; flag the lower-version copy as a stale mirror. Do NOT resolve by nearest-path (it silently pins an embedded freeze).
- EDGE-COUNT (**Bash-driven**, do NOT hardcode a literal): COUNT rows in the LIVE forward-edge subsections — every forward-edge subsection BETWEEN the Appendix-C header and the first deprecated/previously-named region — whatever those subsections are NAMED in the resolved version. The subsection names are a VERSION-SPECIFIC INSTANCE, NOT the predicate: in v2.4.0 they are `epistemic / provenance / reference`; in v2.1.1 they are `universal / document-specific / session-specific`. Re-derive the live-subsection names from the resolved file each run; EXPLICITLY EXCLUDE the "Edges deprecated by this catalog" table and the "Edges previously named" mapping table — a naive whole-region grep over-counts. **GUARD: if counting under the named families yields ZERO rows, the predicate has mis-matched the resolved version's structure — STOP and re-derive the live-subsection names from the resolved file before proceeding** (e.g. applying the v2.4.0 `epistemic/provenance/reference` names to v2.1.1 returns 0). Write the counting predicate out concretely each run (which subsections counted as live forward-edge; where the deprecated/mapping region begins), e.g. `grep`/`sed` over the resolved file's Appendix-C row ranges, so the count is reproducible. SURFACE — never reconcile — any disagreement among the live-table count, the Appendix-C header literal, and the prose literal (in v2.4.0 these are **25 / 22 / 21** respectively, a three-way mismatch; the header is NOT the live-table truth). Treat `edge-catalog.md` as the legality matrix ONLY. CAUTION (worked-example trap): the GoldenQuill worked example mis-resolved by nearest-path to the stale v2.1.1 mirror, but it NEVER performed any live-table count — the artifact only records the literal **21** ("catalog (21 edges, closed)"). **24 / 21 / 21** is what an author WOULD derive from that wrongly-resolved v2.1.1 file under its `universal/document-specific/session-specific` subsections — it is NOT a value the artifact states. So 25/22/21 is a property of v2.4.0 the worked example never computed, and even 24/21/21 is derived-not-stated. Do NOT expect the worked-example artifact to yield 25/22/21 (or 24/21/21); re-derive the subsection names AND the count against the version-resolved file every run.

**Step 2 — Compose the multi-agent authoring spec (anti-bias); ENACT the strategy skill, then Task-dispatch the registered writer agents.**
Name the engine and the wiring; do not leave it to invention. The invocation path is TWO distinct mechanisms — do NOT conflate them: (1) the PARENT session ENACTS the **`domainspec-subagents-strategy`** SKILL (via the Skill/slash invocation, enacting the strategist role per its R24) to COMPOSE the wave recipe — `domainspec-subagents-strategy` is a SKILL the parent enacts, NOT an agent file, and there is NO `domainspec-subagents-strategy` agent on disk to Task-dispatch; (2) the strategist THEN dispatches the registered WRITER / explorer / role agents the strategy composes USING THE **Task** tool (Task targets registered agents, never a skill name). Force a TYPED parameter table WITH DEFAULTS: `goal` (one load-bearing sentence), `view_slug` (kebab-safe), `success_metric` (typed), `composition` (single|task-fan-out|zig-zag, default zig-zag), `max_iterations` (cap). Add the zig-zag ITERATION BLOCK to the table: per-round roles + reaction rule + convergence predicate tied to the Step 6 exit_reason. Each explorer attacks a distinct vector (node taxonomy / edge legality / cross-repo precedent / forbidden-edge guards INCLUDING the reflexive/self-loop class) with pairwise tension declared UPFRONT. Role chain: explorer -> skeptic -> writer -> auditor; the WRITER IS the synthesizer (no separate "summarizer"). Default-linear enforces writer-never-before-skeptic; under zig-zag, roles are epistemic functions that may interleave. See `<dispatch-wiring>`.

**Step 3 — Validate the spec; gate-resolve; bound retries; USER-CONFIRM before dispatch.**
Check goal load-bearing, success_metric typed, role ordering, per-layer mode well-formed, pairwise tension upfront, max_iterations within cap, view_slug kebab-safe. A zig-zag layer with NO iteration block FAILS validation. Apply the SKIP predicate (`single + N=1 + explorer` => skip the multi-AGENT dispatch machinery; this is the DEFAULT for ordinary single-author runs, zig-zag opt-in, since no end-to-end zig-zag ontology-view exists yet). CARVE-OUT: even on the skip path the author MUST still run the **skeptic/citation-strike sub-pass** (verify every precedent on disk; strike unverifiable citations) — skip drops the multi-AGENT dispatch, NOT the skeptic FUNCTION. Emit accept | reject-with-fixes | escalate and resolve: accept -> `AskUserQuestion` confirm/revise/abandon (abandon => nothing persists) -> dispatch; reject-with-fixes -> loop back to Step 2 with named fixes (this re-loop IS the single retry); SECOND reject -> escalate, halt with `exit_reason=validator_rejected_twice`. PERSIST the composed spec to the dispatch folder before dispatch.

**Step 4 — Dispatch explorers -> author typed nodes; collect per-agent files.**
Dispatch the writer/explorer agents composed by the enacted `domainspec-subagents-strategy` skill via the **Task** tool (Task targets the registered agents, not the strategy skill name). For every domain concept declare a TYPED NODE: `node_type` (canonical enum) + project-local kind axis + branch (business/system/bridge/mixed) + scope (OPTIONAL project-declared, not universal) + load-bearing schema + on-disk instances + precedent cite. Apply veracidade/convicção ONLY to belief-bearing roles (axiom/premise/audit) per §6. Verify each schema claim against disk. Collect per-agent explorer outputs into the dispatch `agents/` folder. SURFACE for Step 5 any node that can be BOTH endpoints of one relationship (a role-discriminated type, or a node that could edge to itself) — these are the reflexive/self-loop guard inputs that endpoint-typing alone cannot catch.

**Step 5 — Author typed edges + forbidden-edge guard discipline; emit a CONCRETE coined-edge fallback.**
Declare each relationship as a TYPED EDGE: from->to, directionality, cardinality, load-bearing rule, forward/inverse pair, precedent. Reuse canonical catalog edges verbatim where they fit (tightening cardinality permitted, widening forbidden); flag every COINED edge. Make category-errors **unconstructible-by-type FIRST**, named fail-closed guard SECOND — EXCEPT the **reflexive/self-loop class** (identical, legal endpoints), where by-type-first does NOT apply and the named **predicate guard is PRIMARY**. See `<forbidden-edge-discipline>`. COINED-EDGE FALLBACK: when the amendment-routing convention is absent, write coined vocabulary into the project's OWN Governance posture marked PROPOSED-UNFILED (`governance_status: project-local-overlay`) and HALT promotion — never reference an undefined external amendment path; surface the missing convention as a blocker OQ. VERSION-SKEW: an edge present in a NEWER constitution version but absent from the resolved version is reuse-pending-version-bump, NOT a coined edge.

**Step 6 — Independent ROUND-LEVEL review (zig-zag) -> converge OR exit with typed reason; VERIFY guard LIVE/PLANNED on disk (substrate-neutral).**
An independent reviewer (skeptic/auditor) pressure-tests node taxonomy, edge legality, every precedent citation against disk, and BOTH forbidden-edge guard classes. Surface false-consensus (N>=3 with zero dissent) as a failure. Strike unverifiable citations. GUARD-STATUS VERIFICATION (**Bash**, SUBSTRATE-NEUTRAL): a guard is LIVE iff its enforcement body is reachable and evaluates the predicate (no stub, no unconditional pass, no not-yet-implemented marker), verified on disk — a Python/Logician instance = 0 `NotImplementedError` in its own `run()`/`evaluate()` body; the same rule covers non-Python layers (JSON-schema const-false, SHA3-512 enum-integrity, Cedar/SQL CHECK, TS type-level, CI lint). DOWNGRADE any unverifiable LIVE claim to PLANNED. SCOPE: ROUND-LEVEL CORRECTNESS feeding converge/exit ONLY — this is NOT publication gating (Step 8). Bind loop-back BY DISSENT CLASS: node-taxonomy dissent -> Step 4 only; edge/forbidden-guard dissent -> Step 5 only; cross-cutting -> both. Any loop-back = ONE iteration against max_iterations. On convergence OR max_iterations -> exit with a TYPED `exit_reason` from research's 7-value enum (`success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`). SPELLING NOTE: the cap-exit value is `max_loops_reached` in research-constitution but `loop_cap_reached` in the base subagents-strategy constitution (v0.3.0+); this skill FOLLOWS the research spelling (`max_loops_reached`) since it reuses research's enum verbatim — so telemetry stays consistent with the enum it is emitted under and read against (research's). This is NOT base-compatible: a reader keying off the base taxonomy would see `max_loops_reached` as a mismatch — the emitter/reader contract is research's enum, not the base one.

**Step 7 — Write residue ledger + open questions.**
Every load-bearing claim maps to >=1 ledger row with status (closed=adjudicated/fixed | open=true preserved domain residue), surviving residue text, and a citation drawn from the per-agent files. Open residue is preserved, never demoted. Open questions carry recommendations and name their owner; blocker-level OQs (unfiled edge amendments, mislabeled LIVE guards, unresolved constitution-version skew, the live-table-vs-header-vs-prose count mismatch, a reflexive guard with no predicate body on disk) are flagged, not waved through. NON-CONTIGUOUS OQ numbering is acceptable — do NOT renumber.

**Step 8 — PUBLICATION-LEVEL validate + publish as project-local overlay (user-gated); emit signals.**
SCOPE: PUBLICATION GATING ONLY — does NOT re-run Step 6's content review. Validate ONLY: link integrity, role consistency, confidence gates, bidirectionality shape, `governance_status` overlay correctness, the guard block threshold, the cross-reference map, the output-contract. Require the **enforcement-tier forbidden-relationship gate table** (columns: relationship | by-type? Y/N | structural/schema-const layer LIVE/none | runtime-guard LIVE/PLANNED/registered-dormant | block?). MECHANICAL THRESHOLD (tiered, wins over a binary flip): `by-type=N AND no LIVE structural layer AND runtime!=LIVE` => BLOCKER; `by-type=N WITH a LIVE structural/schema-const layer but PLANNED runtime` => MAJOR OQ; reflexive/self-loop rows (by-type=N by construction, identical legal endpoints) gated on predicate-guard status under the same tiered rule. STATE the threshold is a GoldenQuill-calibrated DEFAULT a project MAY override (e.g. escalate to blocker when the inadmissible relationship has a stored-row surface). Mark coined-edge / local-axis content as a project-local overlay via `governance_status`. Emit a curated schema graph (subset, not exhaustive), a cross-reference map pointing verdicts to engineer-view (nothing decided twice), and the output-contract report. Then run the MANDATORY observability epilogue (see `<observability>`). User-gated.
</process>

<process-to-section map>
The canonical map from each `<process>` step to the artifact section(s) it produces. The template section ORDER follows THIS map (not a literal 1:1 with the 8 steps), which is what makes the section-order rule satisfiable. PLACEMENT NOTE: in the template the Step-8 `Schema graph` section is intentionally placed BEFORE the Step-5 `Forbidden edges & guards` section — it serves as a visual bridge into the guard detail. This is a deliberate ordering choice, not drift; the map groups sections by producing-step, the template renders them in reading order.

| Step | Artifact section(s) produced |
|---|---|
| Step 1 | Governance posture — RESOLVED-CONSTITUTION record + catalog-conformance row (counted live total + the three disagreeing values) |
| Step 2 | (composition spec — dispatch-folder artifact, not an artifact section) |
| Step 3 | (validated/persisted spec — dispatch-folder artifact, not an artifact section) |
| Step 4 | Node types |
| Step 5 | Edge types + Forbidden edges & guards |
| Step 6 | (round-level review pass — no artifact section) |
| Step 7 | Open questions + Residue ledger |
| Step 8 | Schema graph + Cross-reference map + overlay status |
</process-to-section map>

<dispatch-wiring>
Compose the wave recipe by ENACTING the **`domainspec-subagents-strategy`** SKILL (parent session enacts the strategist role per R24 — a Skill/slash invocation, NOT a Task target: there is no `domainspec-subagents-strategy` agent file on disk). The strategy is a PEER wave-recipe. The **Task** tool is then used ONLY to dispatch the registered WRITER / explorer / role agents the strategy composes — Task targets registered agents, never the strategy skill's name. Do NOT route through `research/SKILL.md`: research is a domain KT-port keyed to `discoveries/`, not a dispatcher, and routing through it creates the two-orchestrator (Drift-5) ungoverned-channel failure. Do not leave the wiring to the agent to invent.

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
- **exit_reason enum** (REUSED VERBATIM from research, 7 values): `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`. The cap-exit value is `max_loops_reached` here (research spelling); the base subagents-strategy constitution v0.3.0+ spells it `loop_cap_reached`. This skill reuses research's enum verbatim, so it follows the research spelling — `max_loops_reached` is what MATCHES the enum this skill's telemetry is emitted under and read against. NOTE the trade-off honestly: this does NOT make the value base-compatible — a reader keying off the base subagents-strategy taxonomy (`loop_cap_reached`) would see `max_loops_reached` as a mismatch. The contract is: telemetry is emitted and read against research's enum, not the base taxonomy.
- **Skip predicate:** `single + N=1 + explorer` => skip the multi-AGENT machinery (the DEFAULT for ordinary single-author runs) but KEEP the skeptic/citation-strike function.
</dispatch-wiring>

<forbidden-edge-discipline>
This discipline is **SKILL-INTRODUCED**, NOT codified in `ontology-conventions.md` — the constitution's only edge-legality levers are per-edge source/target `node_type` constraints + a "do not invent edges" rule (zero "forbidden edge" / "unconstructible" / "category error" / "fail-closed" / "guard"-as-edge-legality vocabulary). Frame by-type unconstructibility as the GENERALIZATION of the source/target constraint: *a forbidden edge is one whose endpoint types are declared such that no catalog edge admits that (source_type -> target_type) pair*. Cite the constitution's OWN Appendix C prose as the canonical in-constitution unconstructible-by-type anchor (verify the exact line at run time — in the canonical v2.4.0 it is line 559: *"A session cannot originate an epistemic edge — doing so would make the session an epistemic actor, which it is not"*; do not trust this literal blind, re-derive it on the version-resolved file). Cite `edges-enforcement-refactoring/discovery.md` ONLY as "the catalog is mechanically-enforceable + co-evolving + internally-inconsistent" (an authoring-surface drift proposal) — NOT as the forbidden-edge precedent.

Unconstructible-by-type is an AUTHORING/REVIEW-TIME property on a vault with no edge-construction engine (not-in-catalog + do-not-invent, caught at authoring/review), NOT runtime construction-refusal unless a structural validator makes it so — `by-type=N` is necessary but never sufficient; the named guard is more than reinforcement whenever the inadmissible relationship has any surface (a field, a stored row). **By-type FIRST, named-runtime-guard SECOND, EXCEPT the reflexive/self-loop class where the named predicate guard is PRIMARY.**

LIVE/PLANNED/registered-dormant honesty (SUBSTRATE-NEUTRAL): LIVE = body reachable + evaluates the predicate, no stub/unconditional-pass/not-yet-implemented marker (Python instance = 0 `NotImplementedError` in its own `run()`/`evaluate()` body; do NOT pin the LIVE rule to a Python signature for a non-Python guard). The tiered block threshold (Step 8) is a GoldenQuill-calibrated DEFAULT a project may override.

**FORBIDDEN-EDGE ARCHETYPE taxonomy (four, EXAMPLE-DERIVED, reusable as explorer detection prompts — NOT canonical doctrine):**
1. **Orthogonal-axis coupling** — two orthogonal axes bound at design time (unconstructible-by-type: distinct kinds, no admitting edge).
2. **Derived/cache node as a decision target** — a derived/cache node typed as the target of a decision edge (unconstructible-by-type: the cache node carries `decides=false` and is never the decision edge's target type).
3. **Trust/consent-tier escalation without a gate** — a tier escalation lacking a named gate predicate (caught by a named runtime guard).
4. **REFLEXIVE / self-referential edge forbidden** — a node edging to itself, or one role of a role-discriminated type cycling back. Endpoint types are IDENTICAL and LEGAL, so this is NOT unconstructible-by-endpoint-type; it ALWAYS requires a predicate/runtime guard and is the canonical case where by-type-first does NOT apply (worked example, verify on disk: `drifts-from` predicate `behavior_id(from) != behavior_id(to) AND role(from)=running AND role(to)=designed`; `contradicts` self-loops forbidden; `distilled-to` "an insight cannot distill back into its own outcome").
</forbidden-edge-discipline>

<confidence-rule>
`veracidade` + `convicção` are MEANINGFUL/EXPECTED on belief-bearing roles (axiom / premise / audit) and SHOULD BE OMITTED on other node_types. This is the `ontology-conventions.md` §6 Applicability CONVENTION, not a hard prohibition. (The objective-gate and discovery frontmatter shape are inherited by reference from `discovery-writing.md` + `frontmatter.md`, not re-derived here.)
</confidence-rule>

<coined-edge-rule>
Reuse canonical catalog edges VERBATIM; tightening cardinality is permitted, widening is forbidden. Flag every COINED edge and declare its forward/inverse pair. EXECUTABLE FALLBACK when the amendment-routing convention is absent: write the coined vocabulary into the project's OWN Governance posture marked PROPOSED-UNFILED (`governance_status: project-local-overlay`) and HALT promotion — NEVER reference an undefined external amendment path; surface the missing convention as a blocker OQ. VERSION-SKEW: an edge present in a NEWER constitution version but absent from the resolved version is **reuse-pending-version-bump**, NOT a coined edge.
</coined-edge-rule>

<anti-bias-composition>
Explorers attack distinct vectors (node taxonomy / edge legality / cross-repo precedent / forbidden-edge guards INCLUDING the reflexive-guard vector) -> skeptic -> writer (the writer IS the synthesizer; NO separate "summarizer"; the writer authors EACH round; converge is the reviewer's call) -> auditor. Pairwise tension is declared UPFRONT. Default-linear enforces writer-after-skeptic; zig-zag rounds interleave roles as epistemic functions. The skeptic/citation-strike FUNCTION runs even on the single-author skip path — absence of citation-striking is the anti-bias failure that most corrupts the artifact (phantom citations).
</anti-bias-composition>

<quality-bar>
(This `<quality-bar>` is an empirically-present-but-UNSANCTIONED hybrid element — no normative SKILL.md body-convention doc exists on disk to sanction it; kept with no claim of sanction.)

A successful execution must:
- type every node + schema it + cite a precedent verified on disk;
- give every edge a direction / cardinality / rule / inverse;
- make every forbidden relationship unconstructible-by-type OR (reflexive class) named-predicate-gated to threshold, with every LIVE guard verified on disk substrate-neutrally;
- apply confidence only to belief-bearing roles;
- map every load-bearing claim to a residue row;
- flag coined content as a project-local overlay;
- point verdicts to the engineer-view, never re-deciding them;
- resolve the canonical constitution by version+path SCOPED TO THE PROJECT-UNDER-ANALYSIS'S OWN REPO (not the skill package's tree), with the resolved path/version recorded;
- COUNT the edge total from the live forward-edge subsections of the resolved constitution at run time (whatever they are named in that version — re-derived, not pinned to v2.4.0's `epistemic/provenance/reference`; excluding deprecated/mapping tables), SURFACING the live-table-vs-header-vs-prose mismatch as a blocker note — NOT reconciled to a literal or to `edge-catalog.md`;
- emit signals via `domainspec-emit-signals` to the project-under-analysis's `docs/signals/pipeline-signals.jsonl` (repo-root-anchored).
</quality-bar>

<anti-patterns>
Avoid:
- declaring `Agent` instead of `Task` in allowed-tools (convention divergence — do NOT assert "Agent fails harness validation");
- resolving the constitution by nearest-path instead of highest-version;
- hardcoding a literal edge count, or counting deprecated/mapping rows;
- implying the live edge-count reconciles to the header literal instead of surfacing live-table / header / prose as a three-way mismatch;
- presenting the forbidden-edge discipline as inherited constitutional doctrine;
- citing `edges-enforcement-refactoring` as the forbidden-edge precedent;
- treating a reflexive/self-loop prohibition as unconstructible-by-type instead of giving it a predicate guard;
- citing a guard as LIVE without substrate-neutrally verifying its body executes the predicate;
- pinning the LIVE rule to a Python `NotImplementedError` signature for a non-Python guard;
- inventing edges without an amendment route; asserting an unfiled amendment as in force; referencing an undefined external amendment path instead of the project-local-overlay fallback;
- copying the generated-runtime frontmatter overlay; adding tier/domain/version sigil-header fields;
- introducing a separate "summarizer" role; dropping the skeptic/citation-strike function on the skip path; running the heavy zig-zag path where the skip predicate applies;
- routing dispatch THROUGH `research/SKILL.md` instead of as a peer wave-recipe;
- coining a narrower exit_reason enum instead of reusing research's 7-value enum; spelling the cap exit `loop_cap_reached` when research's enum (followed here) says `max_loops_reached`;
- emitting Arcanum `sigil-invocations.jsonl` instead of `domainspec-emit-signals` -> `pipeline-signals.jsonl`; citing a `mars-research-emit-signals` sibling instead of the `domainspec/.claude/` copy; rendering observability as an `<observability>` sigil tag;
- putting confidence on non-belief-bearing nodes; re-deciding D-row verdicts; citing phantom constructs; smoothing away dissent / false consensus; rendering an exhaustive graph instead of a curated subset; leaving the zig-zag loop unbounded;
- binary-flipping a `by-type=N` row that has a LIVE structural layer straight to blocker; re-running Step 6's content review inside the Step 8 gate; relying on a "section order matches the 8 steps" rule with no process-to-section map.
</anti-patterns>

## Observability (mandatory epilogue — rendered as process text, not a sigil tag)

After Step 8, emit the post-run signal envelope through **`domainspec-emit-signals`** as a MANDATORY epilogue, appending a `SIGNAL-SCHEMA.md`-conformant envelope to **`<repo-root-of-the-project-under-analysis>/docs/signals/pipeline-signals.jsonl`**. ANCHOR (deterministic, do NOT use a bare relative path — several `docs/signals/pipeline-signals.jsonl` exist across the tree and none at repo root): resolve `<repo-root-of-the-project-under-analysis>` as the nearest ancestor of the project-under-analysis containing a `docs/signals/` directory; if none exists, fall back to the nearest ancestor containing `.git`; CREATE the `docs/signals/` dir + the `.jsonl` file if absent. This is the SOLE sanctioned emission path (length-1-uniformity + mandatory-emit gate); cite the `domainspec/.claude/` emit-signals copy, NOT a `mars-research-emit-signals` sibling in the `.github`/copilot trees. Do NOT emit Arcanum `sigil-invocations.jsonl` (a non-federated separate stream that reproduces Drift 5). Do NOT render this contract as an `<observability>` sigil tag (0 hand-authored domainspec SKILL.md carry that tag).

Signal payload: resolved constitution path+version; counted live-table edge total + the header/prose values it disagrees with; nodes typed; edges typed; coined edges flagged; version-skew edges; forbidden guards LIVE/PLANNED with on-disk verification result + guard class (`endpoint-type` | `reflexive`); residue rows; open questions; blocker OQs; struck citations; `exit_reason`; validation result.

NOTE: no end-to-end zig-zag ontology-view exists yet — the lifecycle is transfer-validated (the loop-back/converge/exit machinery is exercised in peer domainspec-theorem dispatches, never yet end-to-end for an ontology-view).

<output-contract>
Return:

```markdown
## Ontology View Result

- Mode: draft | validate | review | publish
- Project: <path>
- Resolved constitution: <absolute path> @ <version> (<commit/dirty-state>)
- Live-table edge total: <counted> (header says <H>, prose says <P> — three-way mismatch surfaced, NOT reconciled)
- Nodes typed: <count>
- Edges typed: <count>
- Coined edges flagged: <count>
- Version-skew edges (reuse-pending-version-bump): <count>
- Forbidden-guard status: endpoint-type <LIVE/PLANNED counts> | reflexive <LIVE/PLANNED counts>
- Residue rows: <closed>/<open>
- Blockers: <count> (<list>)
- Overlay status: project-local-overlay | promotable
- exit_reason: success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error
- Next action: <action>
```
</output-contract>
