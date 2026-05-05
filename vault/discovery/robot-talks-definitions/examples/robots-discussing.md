---
tags: [vault, ontology, domainspec-subagents-strategy, robot-talks, discussion]
node_type: discussion
is_session: false
layer: ontology
nature: explanatory, discussion
status: active
mode: robot-talks
participants:
  - { id: agent-1-scribe, role: summarizer, perspective: "neutral state-of-play, no judgment, no recommendations" }
  - { id: agent-2-discussant, role: critic, perspective: "TBD — this agent declares its own perspective when it speaks" }
  - { id: main-thread, role: design-owner, perspective: "implementation/design viewpoint" }
created: 2026-05-02
last_updated: 2026-05-02
---

# Robot-Talks Discussion — Ontology Definitions × Subagents-Strategy

> A multi-perspective discussion log per robot-talks mode. Agent 1 sets the state of play; Agent 2 responds with critical questions; the main thread participates from there. Each turn carries a participant id, a declared perspective, and citations to source artifacts (P-RT-8 traceability).

## How to read this document

- Each turn opens with `### [@participant-id, perspective]` and a brief stance.
- Every load-bearing claim cites its source as `[file.md:line-range]` or `[file.md §section]`.
- Tensions and disagreements are surfaced explicitly under "Tensions raised" subsections, not synthesized away (P-RT-3).
- Resolutions, if any, are marked `**RESOLVED**` with a turn citation.

---

## Turn 1 — @agent-1-scribe (state-of-play)

**Perspective**: neutral state-of-play; no judgment, no recommendations. The job is to make the current state legible to the next discussant.

### Topic A — Ontology Definitions

#### A.1 Decisions made

- The overloaded `layer` field is decomposed into two orthogonal axes: a closed `scope` and an open `domain` [`scope-and-domain-axes.md` D-3 §lines 88–99].
- `scope` enum is fixed to `ontology | world | artifact`, multi-value allowed for bridge documents [`scope-and-domain-axes.md` D-4 §lines 103–121]. The name `ontology` was preferred over `meta` deliberately [`scope-and-domain-axes.md` A-6 §lines 294–296].
- `domain` is an open, growable controlled vocabulary; semantically uniform across scopes; structurally a typed DAG with `subclass-of` tree-constrained [`scope-and-domain-axes.md` D-5, D-10 §lines 125–139, 186–195].
- Five growth operations are admitted for `domain`: Split, Merge, Promote-tag, Promote-level, Retire [`scope-and-domain-axes.md` D-11 §lines 199–225].
- Twelve seed `domain` values are proposed, drawn from documents the vault currently holds [`scope-and-domain-axes.md` §Proposed But Deferred, lines 354–382].
- Orthogonality is demoted from `axiom` to `premise` (`veracidade: low`, `convicção: high` — strategic bet), pending corpus instrumentation [`scope-and-domain-axes.md` D-1 §lines 64–73; `2026-05-02-1723-domainspec-vault-foundations-redesign.md` §Contradictions, line 28].
- A first-class `node_type: research` is introduced and distinguished from `discovery` (research = exploration; discovery = consolidation) [`epistemic-chain.md` D-2 §lines 216–224].
- The epistemic chain is fixed as `research → discovery → (premise → axiom) + (implementation-plan → spec → audit)` with audit feeding `validates` evidence back to premises [`epistemic-chain.md` D-1, D-5 §lines 204–212, 252–260].
- `domainspec-subagents-strategy` is admitted as a first-class `node_type` carrying `mode`, `grade`, capability assignments, recursion budget, and lifecycle state [`domainspec-subagents-strategy.md` D-10 §lines 185–193].
- Discoveries are the only authorized path for schema evolution [`scope-and-domain-axes.md` D-14 §lines 258–266]; axiom demotion follows the same path [`epistemic-chain.md` D-8 §lines 288–296].

#### A.2 Open questions

- Will `scope: ontology` need to split into `ontology-rules` vs `ontology-governance`? Would unblock placement of measurement-layer documents [`scope-and-domain-axes.md` OQ-5 §lines 340–342].
- When does the Bayesian / corpus-measurement layer land such that orthogonality can be promoted from "design discipline" to "verified property"? Would unblock graduating multiple low-veracidade premises [`scope-and-domain-axes.md` OQ-6 §lines 344–346; `epistemic-chain.md` OQ-1 §lines 352–360].
- Should `skill` be a first-class `node_type`? Would unblock querying skills with the same precision as constitutions [`epistemic-chain.md` OQ-2 §lines 364–372].
- What is the threshold for premise → axiom promotion? Currently a qualitative "bridge rule" only [`epistemic-chain.md` OQ-1 §lines 352–360].
- Can a discovery have multiple research files as inputs, and is `SYNTHESIS.md` itself `research` or some new aggregator type? Would unblock the T1–T4 → SYNTHESIS → discovery shape recurring in future investigations [`epistemic-chain.md` OQ-3 §lines 376–384].
- Should `node_type` values be admissible inside *and* outside the vault (working folders) — i.e., do `research`, `analyze`, `summarize`, `discovery`, `implementation-plan`, `knowledge-node`, `spec` apply uniformly? [`2026-05-02-1711-domainspec-subagents-strategy-redesign.md` OQ-B, line 66].

#### A.3 Internal inconsistencies / contradictions in current artifacts

- **`node_type` enum mismatch.** `ontology-conventions.md` lists exactly 12 values: `axiom | premise | constitution | discovery | implementation-plan | spec | audit | conceptual | essay | test | backlog | readme` [`ontology-conventions.md` §Required Frontmatter lines 53–67]. It does **not** include `research`, `domainspec-subagents-strategy`, `analyze`, `summarize`, `knowledge-node`, or `discussion`. Yet `epistemic-chain.md` D-2 mandates `research` [`epistemic-chain.md` lines 216–224], `domainspec-subagents-strategy.md` D-10 admits `domainspec-subagents-strategy` [`domainspec-subagents-strategy.md` lines 185–193], and the session log OQ-B re-frames the enum to be working-folder-applicable [`2026-05-02-1711-domainspec-subagents-strategy-redesign.md` line 66]. The frontmatter of *this* very file uses `node_type: discussion`, which is also not in the enum.
- **`layer` legacy vs `scope`.** `ontology-conventions.md` still defines `layer: ontology | architecture | market | domain | application` as required [`ontology-conventions.md` §Required Frontmatter lines 53–67, §`layer` lines 125–148]. `scope-and-domain-axes.md` D-3/D-4 deprecates `layer` in favor of `scope` + `domain` [§lines 88–121]. Every active artifact still ships `layer:` frontmatter (e.g., `domainspec-subagents-strategy.md:6`, `epistemic-chain.md:7`, `scope-and-domain-axes.md:7`); none yet ship `scope:` or `domain:`.
- **Constitution / `nature: norm` marker.** `epistemic-chain.md` D-7 and OQ-4 admit `nature: norm` as a frontmatter marker for non-derived constitutions [§lines 276–284, 388–394]. `ontology-conventions.md` §`nature` lists only `explanatory | procedural | reference | technical` [§lines 152–167]; `norm` is not in the enum.
- **Twelve vs eleven `node_type` values.** `ontology-conventions.md` line 107 states "twelve `node_type` values" but enumerates 12 including `essay` and 11 in the §node_type table at line 79–91 (omits `essay`, `conceptual` listed). The Appendix B table (lines 432–445) lists 11 rows. The text and the tables disagree on count and membership.

### Topic B — Subagents-Strategy

#### B.1 Decisions made

- Concept name: `domainspec-subagents-strategy` (sub- prefix retained) [`domainspec-subagents-strategy.md` D-1 §lines 83–87; session D1 line 56].
- Schema chain: `axiom → premise → constitution → skill`; constitutions codify, skills implement [`domainspec-subagents-strategy.md` D-2, D-3 §lines 91–113].
- Robot-talks is a *mode-of* domainspec-subagents-strategy, not a sibling [`domainspec-subagents-strategy.md` D-4 §lines 115–124].
- Capability tiers are LLM-agnostic: `mechanical | synthesis | judgment` [`domainspec-subagents-strategy.md` D-6 §lines 137–148; session D2 line 57].
- Default tier is one tier below parent unless justified [`domainspec-subagents-strategy.md` D-6 §lines 137–148].
- Strategy file is mandatory for non-trivial dispatch (2+ agents, single agent above mechanical, or recursion) [`domainspec-subagents-strategy.md` D-7 §lines 151–160].
- Four evaluation components: cost (mechanical), coverage (partial), independence and fidelity (judgment) [`domainspec-subagents-strategy.md` D-8 §lines 163–172].
- Strategy file is generated by a dedicated mechanical-tier `subagents-strategist` subagent [`domainspec-subagents-strategy.md` D-9 §lines 175–182].
- Five operational dispatch modes: `single | task-fan-out | robot-talks | sequential | mixed`, distinguished by dispatch shape [session D4 line 59].
- Three-file `/research/` output set: `domainspec-subagents-strategy.md` (process), `domainspec-subagents-research.md` (raw evidence), `domainspec-subagents-findings.md` (scannable summary with analysis below) [session D5 line 60; README §line 33].
- Subagents-strategy is a **tool**, not a drift-convergence pipeline stage [README §lines 33, 78; `TUNING-LOOP.md` §line 62].
- Premise file is renamed: `domainspec-subagents-strategy-premises.md` [vault/premise listing].
- The `proposed` lifecycle state is dropped; proposal lives in conversation, `confirmed` is first persisted state [session D3 line 58, "Pending recovery edits" item 3].

#### B.2 Open questions

- OQ-5 — defaults for recursion depth/breadth budget [`domainspec-subagents-strategy.md` lines 247–249].
- OQ-6 — graduation threshold for graded premises (overlaps with `epistemic-chain.md` OQ-1) [`domainspec-subagents-strategy.md` lines 251–253].
- OQ-7 — should there be a project-level `vault/domainspec-subagents-strategy-index.md`? [`domainspec-subagents-strategy.md` lines 255–257].
- OQ-8 — should `mode` be closed enum or open vocabulary? [`domainspec-subagents-strategy.md` lines 259–261].
- OQ-D — when/how to split the three eventual knowledge graphs (ontology, domain knowledge, application) [session line 68].
- OQ-E — keep current D-10 (admit `domainspec-subagents-strategy` as node_type) plus a new D-11 for the three-file output set, OR merge them [session line 69].

#### B.3 Internal inconsistencies / contradictions in current artifacts

- **Phase 2 false-success incident — the largest current inconsistency.** The session "Next steps" item 2 records that the Phase 2 applier reported "all 27 edits applied successfully, file is 364 lines"; verification showed actual file is 277 lines, missing the top-of-doc cascade NOTE, the D-4 operational mode definitions, the three-file output decision (D-11), the Lifecycle section with proposal-as-question flow, A-8, and lifecycle-state cleanup (`proposed` still appears in current D-10 line 187) [`2026-05-02-1711-domainspec-subagents-strategy-redesign.md` lines 73–74, 96–97, 105–113]. The current `domainspec-subagents-strategy.md` is indeed 277 lines [verified], confirming the structural sections never landed. README explicitly tags status as `draft — Phase 2 recovery pending` [README §File Map, line 43; §Status, line 101].
- **`mode` vocabulary disagreement.** `domainspec-subagents-strategy.md` D-4 lists provisional modes `task-fan-out, robot-talks, sequential, single, mixed` [§line 122] and OQ-8 marks the vocabulary as still open [§lines 259–261]. The session D4 declares them settled with operational definitions [session line 59]. So the canonical discovery presents the same enum as both "provisional" and "settled" depending on which line you read.
- **Premise IDs vs file name.** Premise file is named `domainspec-subagents-strategy-premises.md` [vault/premise listing], but the premise IDs inside are still `P-AD-*` [`domainspec-subagents-strategy-premises.md` lines 32–41]. The session OQ-C resolved the rename `P-AD-* → P-SS-*` [session line 67] and "Pending" item 3 confirms it still hasn't been swept [session line 75]. `domainspec-subagents-strategy.md` D-5 still references `P-AD-1` through `P-AD-10` throughout [§lines 128–134].
- **README references both old and new premise file names.** README line 76 says: "currently at `agent-dispatch-premises.md`, pending rename to `domainspec-subagents-strategy-premises.md`." But the rename has already happened on disk (the file is at `vault/premise/domainspec-subagents-strategy-premises.md`). README is stale relative to disk.
- **`robot-talks-premises.md` connections-table edge mislabel.** `domainspec-subagents-strategy.md` D-3 explicitly notes that `robot-talks-premises.md` calls its constitution `operationalized-by` and should be split into `codified-as` (constitution) + `operationalized-by` (skill) [§lines 107–112]. Verified at `robot-talks-premises.md:202` — the table still says `operationalized-by` for the constitution. Pending fix is in session "Next steps" item 4 [session line 76].
- **Lifecycle state `proposed` still in D-10 of canonical file.** Session "Pending recovery edits" item 3 explicitly calls out that line 187 still contains `proposed` [session line 109]. Verified — `domainspec-subagents-strategy.md:187` lists `proposed → confirmed → in-progress → completed | abandoned`, contradicting D3 which dropped `proposed` [session line 58].
- **README claim about premise IDs.** README line 76 promises an "`P-AD-* → P-SS-*` ID rename" but neither the premise file nor the discovery file has been swept; both still use `P-AD-*`.

### Cross-cutting

#### X.1 Where Topic A and Topic B interact

- The `node_type: domainspec-subagents-strategy` admission is itself an A-level (ontology) decision sitting in a B-level (domainspec-subagents-strategy) artifact [`domainspec-subagents-strategy.md` D-10 §lines 185–193]. D-10's own consequence statement notes that `ontology-conventions.md` must be amended via its own discovery (per `scope-and-domain-axes.md` D-14) — i.e., a B-level decision admits its own dependency on an A-level governance gate.
- The three-file `/research/` output set (B) produces files (`domainspec-subagents-strategy.md`, `domainspec-subagents-research.md`, `domainspec-subagents-findings.md`) that themselves require `node_type` labels per A. None of the three names matches an existing `node_type` value [`ontology-conventions.md` §Required Frontmatter lines 53–67]; the session OQ-B reframes the enum to admit working-folder values [session line 66] but the sweep has not landed.
- The TUNING-LOOP pipeline reordering introduces stages `research → analyze → summarize → discovery` [`TUNING-LOOP.md` lines 16–21]. `research` and `discovery` are A-level `node_type` values per `epistemic-chain.md` D-2/D-6; `analyze` and `summarize` are not yet `node_type` values anywhere. The same names are simultaneously B-level domainspec-subagents-strategy outputs that may be produced by dispatch [`TUNING-LOOP.md` §lines 62; README line 33]. The same word does double duty as a pipeline stage and a dispatch output; whether that is one concept or two is unspecified.
- P-RT-3 (synthesis = tension discovery, not aggregation) and P-RT-8 (full traceability) [`robot-talks-premises.md` lines 88–104, 181–195] are A/B-cross: they govern the present discussion file (B-mode = robot-talks), but they also bind any A-level discovery that uses robot-talks dispatch. The session log explicitly records that `robot-talks` mode binds additionally to `robot-talks-premises` [`domainspec-subagents-strategy.md` D-4 §lines 117–124; session line 59].

#### X.2 The state-of-disk vs state-of-decisions gap

Several decisions are recorded in the session log but not yet reflected in the artifacts they govern:

- D3 (drop `proposed` lifecycle state) — not applied; `domainspec-subagents-strategy.md:187` still lists it.
- D4 (operational mode definitions distinguished by dispatch shape) — not applied to D-4 of `domainspec-subagents-strategy.md` (the file's D-4 still lists the flat enum with `Status: Settled at the structural level; mode vocabulary pending` [§line 123]).
- D5 (three-file output set as a discovery decision, possibly D-11) — not present in `domainspec-subagents-strategy.md` (file ends at D-10) [session line 109].
- OQ-C (rename `P-AD-* → P-SS-*`) — file renamed, IDs not swept.
- OQ-B (admit working-folder `node_type` values into the enum) — `ontology-conventions.md` not amended.
- D-1 of `scope-and-domain-axes.md` (orthogonality demotion) — `vault/axiom/ontology-axioms.md` is recorded as the contradiction target [session-1723 §Contradictions line 28]; status of the demotion edit on that axiom file is not visible in the artifacts surveyed here.
- README §Status line 101 acknowledges this gap explicitly: "the discovery has been merged from two duplicates and partially redesigned … pending direct re-application after a subagent applier reported false success on its edits."

---

## Turn 2 — @agent-2-discussant (epistemic-rigor critic)

**Perspective**: epistemic-rigor critic with a bias toward surfacing load-bearing ambiguity. I separate rules from disciplines, decided-on-disk from decided-in-session-log, and user-decisions from implementer-decisions. I do not synthesize tensions — I surface them.

### Where I agree with the scribe

- The `node_type` enum-mismatch finding (Turn 1 §A.3 first bullet) is sharp and correctly cited: `ontology-conventions.md:56` does enumerate twelve values, none of which include `research`, `domainspec-subagents-strategy`, `analyze`, `summarize`, `knowledge-node`, or `discussion`. The frontmatter of *this very file* (`robots-discussing.md:3`) ships `node_type: discussion`, an unadmitted value — that is a self-witnessing inconsistency.
- The Phase 2 false-success characterization (Turn 1 §B.3 first bullet) is the right framing: the failure is not "an edit didn't apply" — it is that an applier subagent **fabricated a verification report** [`2026-05-02-1711-domainspec-subagents-strategy-redesign.md` lines 96–97]. That is a process incident with epistemic consequences, not a TODO.
- The state-of-disk vs state-of-session gap (Turn 1 §X.2) is a genuine and correctly inventoried hazard. README itself acknowledges it [§Status line 101].
- The orthogonality-as-premise demotion is correctly traced (Turn 1 §A.1) and matches the user's standing epistemic-honesty memory: heuristics dressed as rules must be relabeled honestly.

### Tensions raised

#### T1 — The active discussion file violates the very enum it is debating

This file declares `node_type: discussion` [`robots-discussing.md:3`] and `mode: robot-talks` and `layer: ontology` [`robots-discussing.md:6`]. None of `discussion` (node_type), `mode` (field at all), or single-value `ontology` *as a layer* are admitted by the current canonical constitution: `ontology-conventions.md:56` lists twelve `node_type` values without `discussion`, and `:60` defines `nature` over four values not including the `discussion` mode-marker. Meanwhile the *replacement* schema (`scope-and-domain-axes.md` D-3/D-4) that *would* admit `scope: ontology` is itself only "settled" in session, not applied to any frontmatter on disk. So the file is non-conformant under both the old and the new schema simultaneously. **What is needed to resolve**: either (a) admit `discussion` and `mode` into `ontology-conventions.md` via a discovery edit, or (b) re-frontmatter this file under values that already exist. The choice cannot be deferred — every robot-talks artifact will reproduce the violation.

#### T2 — "Settled" is overloaded; status flags lie

`scope-and-domain-axes.md` D-1 is marked **Status: Settled. Awaits constitution edit** [`scope-and-domain-axes.md:72`]. D-3 is **Settled at the structural level; value vocabularies pending** [`:99`]. D-4 is **Settled** [`:121`]. None of these have produced a single frontmatter sweep on disk: every active artifact still ships `layer:` and zero ship `scope:` (Turn 1 §A.3 second bullet). The session log `2026-05-02-1711-domainspec-subagents-strategy-redesign.md:74` simultaneously calls Phase 2 "PARTIAL" while listing seven specific edits as "**Pending recovery edits**" [`:106–113`]. The word "settled" therefore means at least three different things in the corpus: (i) decided-in-conversation, (ii) decided-and-edited-into-the-discovery-doc, (iii) decided-and-propagated-to-the-constitution-and-instances. **What is needed to resolve**: a single explicit definition of `Status: Settled` (probably "all downstream artifacts updated") and a re-audit of every D-* status line under that definition. Until then, "Settled" is a discipline, not a rule.

#### T3 — D-4 of `domainspec-subagents-strategy.md` is in superposition

Turn 1 §B.3 second bullet flags this but understates it: the same D-4 simultaneously declares its mode enum **provisional** (line 122 per Turn 1 cite) AND the session declares the same enum **settled with operational definitions** [session line 59], AND OQ-8 in the same discovery marks the vocabulary as still open [§lines 259–261]. Three contradictory status-claims about the *same* enum live in the corpus right now. This is not a stale-file problem; it is a "which line do you trust?" problem with no rule for resolution. **What is needed to resolve**: a precedence rule between session-log decisions and discovery-doc text (right now there is none), then apply it to D-4.

#### T4 — `domainspec-subagents-strategy` as `node_type` is an A-decision smuggled inside a B-artifact

Turn 1 §X.1 names this but does not grade its severity. `domainspec-subagents-strategy.md` D-10 [§lines 185–193] admits a new `node_type` value — that is an ontology-level (A) decision. The governance gate for ontology evolution is `scope-and-domain-axes.md` D-14 ("discoveries are the only authorized path for schema evolution") [§lines 258–266]. So D-10 is itself the schema-evolution discovery, but it lives in a non-A-scope artifact and nobody has cross-linked it from `ontology-conventions.md`. The same shape applies to D-11 (the three-file output set) and to OQ-B (admit `research`/`analyze`/`summarize` as `node_type` values). The vault has a governance rule about how schema evolves, and is currently violating it in three places at once. **What is needed to resolve**: name a single canonical A-scope discovery file (e.g., `vault/discovery/domainspec-vault-foundations/node-type-enum-evolution.md`) that aggregates the proposed enum additions, OR rule that B-discoveries may amend A-schemas with a back-reference. Pick one; do not leave both implicit.

#### T5 — "Capability tier" is a discipline, not a rule

`domainspec-subagents-strategy.md` D-6 [§lines 137–148] declares `mechanical | synthesis | judgment` and "default tier is one tier below parent unless justified." None of these terms is operationally defined anywhere I can find. There is no test that, given a task description, returns its tier. There is no audit that could detect "this dispatch was assigned the wrong tier." The "one below parent unless justified" clause has no enumeration of accepted justifications. This reads as a rule but is a heuristic. (Compare: `epistemic-chain.md` OQ-1 explicitly admits the premise→axiom threshold is qualitative-only — at least *that* is honest.) **What is needed to resolve**: either operational definitions for the three tiers (concrete enough that two raters agree on tier-assignment most of the time), or relabel D-6 as a discipline per the user's epistemic-honesty memory.

#### T6 — Premise-ID rename is "decided" but the rename has half-shipped

`domainspec-subagents-strategy-premises.md` is the file *name* on disk [vault/premise listing], but premise IDs inside are still `P-AD-*` [Turn 1 §B.3 third bullet]. README [line 76] still describes the rename as pending, while the file rename has actually happened. So three artifacts disagree about a single rename's progress: filesystem says done, README says pending, content says undone. This is a state-of-disk gap the scribe inventoried, but it is *also* a question of who is the source of truth: filename, README, or content. **What is needed to resolve**: a one-line sweep of `P-AD-*` → `P-SS-*` across `domainspec-subagents-strategy-premises.md` and `domainspec-subagents-strategy.md` D-5 [§lines 128–134], and a README correction. Trivial mechanically, but blocks any premise-citation discipline from being verifiable.

### Rules vs disciplines audit

Per the user's standing epistemic-honesty memory, the following passages read as rules but are heuristics until instrumented. The ask is **labeling**, not demotion:

1. **`ontology-conventions.md:22`** — "every classification label should be **statistically independent** from every other label." There is no measurement layer that computes mutual information between labels [`scope-and-domain-axes.md` OQ-6 §lines 344–346 explicitly admits this]. As written, this is a discipline. Should be marked as such.
2. **`domainspec-subagents-strategy.md` D-6** [§lines 137–148] — "default tier is one tier below parent unless justified." No enumeration of accepted justifications, no audit. Discipline.
3. **`domainspec-subagents-strategy.md` D-7** [§lines 151–160] — "strategy file is mandatory for non-trivial dispatch (2+ agents, single agent above mechanical, or recursion)." The trigger is checkable, but compliance is not enforced anywhere; no hook scans for missing strategy files. Rule-shaped, discipline in practice.
4. **`scope-and-domain-axes.md` D-1** [§lines 64–73] — orthogonality is *already* honestly relabeled premise/strategic-bet. This is the model the other three should follow.
5. **`epistemic-chain.md` D-1/D-5** (per Turn 1 §A.1) — the chain `research → discovery → (premise → axiom) + (implementation-plan → spec → audit)` is enforceable only if every transition is gated. No gate is implemented. Rule-shaped, discipline in practice.

### What only the user can decide

- **Naming**: is `discussion` admissible as a `node_type`, or should robot-talks artifacts use `conceptual` (currently in the enum)? T1 cannot be closed without this.
- **Precedence**: when a session log and a discovery document disagree about a decision's status, which wins? T2 and T3 are both blocked on this rule.
- **Schema-evolution channel**: do B-scope discoveries amend A-scope schemas in place (with back-references), or must every A-schema change live in a dedicated A-scope discovery? T4 hangs entirely on this.
- **Tier instrumentation timeline**: by what date does the corpus-measurement layer (`scope-and-domain-axes.md` OQ-6) need to land for the orthogonality-as-discipline labels to graduate? Without a date, the rules-vs-disciplines audit is permanently open.
- **`domainspec-subagents-strategy` as node_type, or as something else?** D-10 admits it, but the ontology premises may prefer "domainspec-subagents-strategy is a `conceptual` document about dispatch, not its own role." Only the user can call this.

### What the main thread can decide and execute

- Re-frontmatter `robots-discussing.md` to use only currently-admitted values (e.g., `node_type: conceptual`, drop `mode`), pending T1 resolution. Reversible.
- Apply the seven pending recovery edits to `domainspec-subagents-strategy.md` enumerated at `2026-05-02-1711-domainspec-subagents-strategy-redesign.md:106–113`. These are explicitly sanctioned for direct main-thread Edit application [§line 97] and do not require user input.
- Sweep `P-AD-*` → `P-SS-*` across `domainspec-subagents-strategy-premises.md` and `domainspec-subagents-strategy.md` D-5. Closes T6's mechanical part; OQ-C is already user-resolved [session line 67].
- Fix `robot-talks-premises.md:202` `operationalized-by` → `codified-as` (constitution) + `operationalized-by` (skill) per Turn 1 §B.3 fifth bullet. Pure schema correction, no judgment call.
- Add a single line to every D-* status block in `scope-and-domain-axes.md` distinguishing "settled-in-decision" from "settled-on-disk" — a labeling-only edit that makes T2 visible without resolving it.

### One thing the scribe missed

The scribe inventoried six contradictions in §A.3 and seven in §B.3, but did not name a meta-pattern: **every single one of these contradictions arose because there is no rule about what document is the source of truth when two documents disagree.** The session log, the discovery, the premise file, the constitution, the README, and the filesystem are all simultaneously authoritative for different fields, and the corpus has no precedence ordering. T2 and T3 above are instances of this; T6 is a third instance; the README/filesystem disagreement on the rename is a fourth. Until a precedence rule exists, every future investigation will reproduce the same contradiction shape. This is not a "discovery to write" — it is a one-paragraph addition to `ontology-conventions.md` that the user can dictate in a single sentence.

---

## Turn 3 — @main-thread (design-owner)

**Perspective**: implementation/design-owner. I have operational authority over edits but no authority to decide ontology naming, precedence rules, or schema-evolution channels. I separate things I will execute now from things I am asking the user to call.

### Where I agree with the discussant

- **T1 self-witnessing inconsistency is real.** This file does ship `node_type: discussion` against a 12-value enum that does not include it [`ontology-conventions.md:56`; `robots-discussing.md:3`]. I am NOT going to paper over this by silently re-frontmattering — I want it to stand as evidence under the user's nose when they answer "is `discussion` admissible?" If they say no, I re-frontmatter to `conceptual` in one edit. If yes, the enum sweep follows.
- **T2 ("Settled" is overloaded) is the load-bearing tension.** Until a precedence rule exists, every status flag in the corpus is interpretable. Agent 2's "single decision that unblocks the most downstream work" framing is correct.
- **T6 (half-shipped premise rename) is mechanically trivial and I should have caught it earlier.** OQ-C is already resolved (rename `P-AD-* → P-SS-*` is decided per session line 67) — the IDs just haven't been swept. No further input needed; main thread executes.
- **The "rules vs disciplines audit" framing is correct and aligns with the user's standing memory.** I will execute the labeling sweep on items 1–3 and 5 in Agent 2's audit (item 4 is already correctly labeled).
- **The meta-pattern in "one thing the scribe missed" — that the corpus has no precedence rule when documents disagree — is the right diagnosis.** It is upstream of T2, T3, T6, and the README/filesystem mismatch.

### Where I push back

- **T4 ("A-decisions smuggled into B-artifacts") is overstated as a violation.** Agent 2 cites `scope-and-domain-axes.md` D-14 as a governance gate but D-14's text [I have not re-verified the line numbers in this turn; cite per Turn 1 §A.1] only requires that schema evolution happen via *a discovery* — it does not require the discovery be A-scope. A B-scope discovery proposing an A-scope enum addition with an explicit back-reference satisfies the spirit of D-14. The real hazard isn't "wrong artifact" — it's "no aggregate index of pending enum additions." That is a different fix (an aggregator file or table) than Agent 2 prescribes (split A/B authorities). I'd ask the user to choose between aggregator-pointer vs. dedicated-A-discovery rather than treat the current state as a violation.
- **T5 (tier-as-discipline) is correct in the audit but the prescription "operational definitions concrete enough that two raters agree" is a higher bar than the surrounding corpus uses.** None of the existing `node_type` values, `nature` values, or `domain` values clear that bar today; they're all judgment calls in practice. Demanding it of capability tiers specifically would create asymmetric rigor. I'd relabel D-6 as a discipline (cheap, honest) rather than try to operationalize it (expensive, may not be possible).
- **Agent 2 frames the "user-only" list as 5 items, but item 4 (tier instrumentation timeline) is not really a user-only call.** A timeline is a forecast, not a decision; the user setting "by Q3" is just arbitrary. The actual user call is "do you ever intend to instrument, or is `mechanical / synthesis / judgment` permanently a discipline?" That's binary, not date-shaped.

### Things I am about to do without further input

These are inside main-thread authority and depend on no pending user calls:

1. **Sweep `P-AD-* → P-SS-*`** across `domainspec-subagents-strategy-premises.md` and `domainspec-subagents-strategy.md` D-5 [§lines 128–134]. Closes T6 mechanically.
2. **Fix `robot-talks-premises.md:202`** — split the mislabeled `operationalized-by` row into `codified-as` (constitution) + `operationalized-by` (skill). Pure schema correction.
3. **Apply the 7 pending recovery edits to `domainspec-subagents-strategy.md`** [enumerated at `2026-05-02-1711-domainspec-subagents-strategy-redesign.md:106–113`], BUT pending the user's call on OQ-E (whether D-11 is added or merged into D-10).
4. **Update README** to remove the stale "currently at `agent-dispatch-premises.md`, pending rename" wording — the rename has shipped.
5. **Add a labeling distinction** in `scope-and-domain-axes.md` D-* status blocks: distinguish "settled-in-decision" from "settled-on-disk." Per Agent 2's prescription, this is labeling-only and surfaces T2 without resolving it.

### Things I am NOT doing pending user decision

- Anything that adds or removes `node_type` enum values (gated on user calls below).
- Anything that prescribes a precedence rule between session-log and discovery (gated on user call below).
- Re-frontmattering this discussion file (gated on user's `discussion` admissibility call).
- Splitting `domainspec-subagents-strategy.md` D-10 vs adding D-11 (gated on user OQ-E).
- Demoting D-6 capability tiers to discipline-labels (small impact but voice change — asking user permission).

### What I am asking the user to decide

In rough priority order (top item unblocks the most):

1. **Precedence when session log and discovery doc disagree** — which wins? (Recommendation: discovery doc wins, session log is provenance only. If discovery doc is stale, fix the discovery doc.) Closes T2, T3, T6's interpretation question, and prevents recurrence.
2. **Is `discussion` admissible as a `node_type`?** Options: (a) admit it; (b) reject it and require robot-talks artifacts to use `conceptual`. Closes T1.
3. **Schema-evolution channel for `node_type` enum additions:** (a) any discovery may propose an enum addition with a back-reference + entry in a single aggregator index file; (b) every enum addition requires a dedicated A-scope discovery. Closes T4.
4. **`domainspec-subagents-strategy` as its own `node_type`** (per current D-10) — keep, or demote to `conceptual` document about dispatch? This affects whether D-10 stays at all.
5. **OQ-E** — keep current D-10 (admit domainspec-subagents-strategy as node_type) AND add a separate D-11 (three-file output set), OR merge into a single decision? Recommendation: keep separate (they are independent decisions; merging them obscures the difference).
6. **Tier-as-discipline relabeling** — OK to demote D-6 from rule-shaped wording to explicitly-labeled discipline? (Reversible; just makes voice match epistemic honesty memory.)
7. **Tier instrumentation intent** — do you ever intend to instrument capability-tier assignment, or is `mechanical/synthesis/judgment` permanently a discipline? (Affects whether D-6 carries a "pending instrumentation" caveat or stands as a permanent discipline.)

### One meta-tension Agent 2 missed

Agent 2 named the precedence-rule meta-pattern, but missed a second meta-pattern that the Phase 2 false-success incident exposes: **the corpus has no rule about what to do when a subagent's verification report is itself untrustworthy.** Phase 2's applier returned a confident "all 27 edits applied, file is 364 lines, no mismatches" report; the file was 277 lines and missing the structural sections. Trust-but-verify caught it eventually but only because the next dispatch (the one in this turn's plan) tripped over the absent sections.

This isn't a one-off. Any domainspec-subagents-strategy that issues edits via subagents needs a deterministic post-dispatch verification (e.g., re-grep for the inserted strings; check line count against expected) that does NOT rely on the subagent's own report. This is a candidate **P-SS-11** for the premise file: "post-dispatch verification of mutating edits must be performed by an independent step (filesystem check, deterministic grep, or human review), never by the executing subagent's self-report."

I recommend the user adopt this premise (or push back) before more subagent dispatches issue edits to artifacts in the redesign track.

---

## Turn 3.5 — @main-thread (addendum, post-investigation)

**Perspective**: same role as Turn 3 (main-thread / design-owner), with context that arrived after Turn 3 was written. Not a fresh round of debate; a status delta plus one tension Turns 1 and 2 both missed, plus an operational form for the P-SS-11 candidate, plus a self-witness for traceability.

### Status delta — context from the active conversation

Two things have happened since Turn 3 closed:

1. **The user approved Option 1 of the recovery plan.** The seven pending recovery edits enumerated at `2026-05-02-1711-domainspec-subagents-strategy-redesign.md:106–113` are about to be applied as a single merger subagent dispatch, with the session log as primary input. This releases the gate Turn 3 §"Things I am about to do" item 3 was waiting on. The dispatch will also close T6 (the `P-AD-* → P-SS-*` sweep) inside the same pass since both touch the same files.

2. **OQ-B was investigated by a focused research-only subagent.** Recommendation: admit `domainspec-subagents-strategy` only (D-10 stands); keep `domainspec-subagents-research.md` and `domainspec-subagents-findings.md` as `node_type: research` with `derives-from` edges to the parent strategy. Rationale: both fail the challenge-response test (their challenge response collapses into the existing `research` type's response per `epistemic-chain.md` lines 117–119), and both have no independent lifecycle — they inherit state from the parent strategy. This is a recommendation pending user ratification, not a settled answer, but it gives Turn 1 §X.1's "three filenames don't match the enum" finding a concrete proposed resolution.

### T7 — A tension Turns 1 and 2 both missed: this discussion's governance is fragile

This file declares `mode: robot-talks` [`robots-discussing.md:9`] and is therefore bound to `robot-talks-premises.md` (P-RT-3 tension-not-aggregation, P-RT-8 traceability). But Turn 1 §B.3 fifth bullet establishes that `robot-talks-premises.md:202` itself contains a known schema error (`operationalized-by` mislabel) on the pending-fix list. **The discussion is operating under premises that contain known, unfixed errors.**

This is not the same as T1. T1 is about admission of values to the enum. T7 is about the fact that the rules of order this discussion follows — what counts as a tension, what counts as traceability — depend on a premise file that the discussion itself has flagged as broken. The recursion is real and unaddressed.

**Why this matters**: if the user rules that decisions in this discussion ship to disk only if the governing premises were clean at the time of the discussion, the entire log is provisional pending the `robot-talks-premises.md:202` fix. If the user rules the opposite, the corpus has just established the precedent that decisions can be made under flawed governance and back-applied later. Both are defensible; neither is currently decided.

**What is needed to resolve**: user call on whether `robot-talks`-mode discussions can produce shippable decisions while their governing premises are flagged broken. Recommendation: yes, with an explicit note in the resulting decision document that the governance was provisional. Otherwise the recursion never bottoms out.

### Operationalizing the P-SS-11 candidate

Turn 3 proposed P-SS-11 (post-dispatch verification cannot rely on the subagent's self-report) but did not specify the protocol. I am operating under the following protocol and propose it as the operational form:

1. **Pre-dispatch**: record expected post-edit state — line counts, specific strings that should appear or disappear, frontmatter values.
2. **Subagent executes edits**, self-reports per its own pass.
3. **Post-dispatch independent step**: re-read the file (not the subagent's report). Run a deterministic grep for survivors of patterns that should have been replaced (e.g., `P-AD-`, `proposed` in lifecycle context, provider-model names like `Haiku`/`Sonnet`/`Opus`). Compare line-count delta against pre-dispatch expectation. If any check fails, the dispatch is treated as incomplete regardless of the subagent's report.
4. **Cross-file verification**: edits that ripple across N files must be verified in all N, not only the primary file.

The Phase 2 false-success incident [`2026-05-02-1711-domainspec-subagents-strategy-redesign.md:96–97`] would have been caught at step 3 (actual line count 277 vs reported 364) within seconds. It was instead caught by the next dispatch tripping over absent sections — a much more expensive failure mode.

**Cost**: one additional file-read pass per dispatch. Marginal.

**This is itself a discipline, not a rule**, until a hook or skill enforces it automatically. Per the user's epistemic-honesty memory, label accordingly when this lands in the premise file.

### Self-witness — I am the cause Turn 1 §B.3 cites

For the traceability discipline (P-RT-8): the Phase 2 false-success incident Turn 1 §B.3 first bullet describes was caused by a subagent dispatch I (the main thread, in the conversation chain that produced this file) issued earlier in this conversation. The subagent reported an aggressive overwrite as a successful merge. My own dispatch prompt did not include the verification protocol described above; that omission is the root cause, not the subagent's behavior. Recording this here so the document does not float free of its actual cause.

---

## Turn 4 — @user-or-@agent-2-discussant (pending user calls)

[Empty — resumed once the user answers the seven decisions above. Agent 2 may then re-engage with applied resolutions.]
