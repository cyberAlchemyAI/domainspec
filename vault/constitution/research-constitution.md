---
name: research-constitution
description: Declarative rules governing the `research` skill — dispatch of subagents for research over the `research-*` corpora of `domainspec-theorem`. Inherits the spec engine from `domainspec-subagents-strategy-constitution`; adds canonical roles, per-agent file schema, anti-bias vector composition, forced upfront parameters, typed exit_reason, and research-specific gates.
version: 0.2.0
last_updated: 2026-05-26
status: active
applies_to: research skill
relates_to:
  - domainspec-subagents-strategy-constitution
  - theorem/agents-strategy/02-nested-agent-strategy-v2.md
schema_version: 1
governs_pattern: .claude/skills/research/**
---

# Research Constitution

> **Charter.** Declarative rules governing the `research` skill: research dispatches over the `research-*` corpora of `domainspec-theorem`. Inherits the spec engine, lifecycle, validator, telemetry, and grading machinery from [`domainspec-subagents-strategy-constitution.md`](./domainspec-subagents-strategy-constitution.md). Adds four canonical roles, per-agent file outputs as schema-conformant decision records, anti-bias vector composition, forced upfront parameters, typed exit-reason taxonomy, and the research-specific gates first formalized in [`02-nested-agent-strategy-v2.md`](../../../domainspec-theorem/theorem/agents-strategy/02-nested-agent-strategy-v2.md).

---

## Preamble

The `research` skill exists because the generic `domainspec-subagents-strategy` engine is content-neutral: it parametrizes dispatch but is silent on **which intellectual functions** are being separated when several agents run in parallel. In research contexts — auditing a bridge, killing a precedent, witnessing non-vacuity, polishing a conjecture into a public finding — those functions are non-interchangeable. Conflating them produces the failure mode v2 of the nested-agent strategy named: review panels that converge on the same blind spot because they were dispatched along the same epistemic vector.

This constitution names four canonical roles (explorer · skeptic · writer · auditor), forces every dispatch to compose them as **deliberately tensioned micro-vectors around a shared macro goal**, and writes the result of each agent's deliberation into a schema-conformant decision record. The skill body operationalizes. This document carries the *why* and the non-negotiables.

**Scope.** This constitution governs dispatches with `category: documents` — research over `research-*` corpora, audits, bridge classifications, precedent kills, non-vacuity witnessing, conjecture refinement. It explicitly does **not** govern:

- Code-modification research (`category: code`): future category, deferred per OQ-code-category.
- Lean proof writing: handled by `writing-lean-proof` and the v2 strategy gates directly.
- General feature development under `docs/features/<feature>/`: that remains under `domainspec-subagents-strategy`.

When `research` is invoked, the parent Claude session enacts the strategist role under this constitution; the engine's R3 lifecycle is preserved, but the spec carries additional fields and the dispatched agents conform to the role schema below.

---

## Index

1. Invocation (R1–R3)
2. The four roles (R4–R8)
3. Anti-bias vector composition (R9–R11)
4. Per-agent file schema (R12–R14)
5. Three-layer polish (R15–R17)
6. Forced upfront parameters (R18–R20)
7. Exit discipline (R21–R23)
8. Mode composability (R24–R26)
9. Research-specific gates (R27–R29)
10. Naming and provenance (R30)
11. Non-negotiables
12. Relationship to other constitutions
13. Open questions
14. References

---

## 1. Invocation (R1–R3)

### R1 — Invoke `research` for research over `research-*` corpora

The skill MUST be invoked whenever a dispatch's target is a `research-*` corpus (`research-bridges/`, `research-physics/`, `research-emergence/`, `research-psychology/`, `research-gpt/`, or any future `research-*`) AND the goal is investigative, audit-shaped, or synthesis-shaped — i.e. not a code edit. Lookup-only single-agent dispatches with no `research-*` write target may use bare `domainspec-subagents-strategy` directly.

This rule exists because the four-role / anti-bias / per-agent-schema machinery is load-bearing for research-grade outputs; bypassing it via the bare engine produces dispatch records that conflate generation with judgment.

### R2 — Non-bypass

A dispatch that satisfies R1 MUST NOT be reshaped to evade this constitution (e.g. by routing the same research question through `docs/features/<feature>/research/` to claim the bare engine applies). The R26 validator under this constitution's extended checklist rejects such reshapes.

The justification is provenance: the audit trail under `research-*` is the project's epistemic record. Smuggling research findings out from under role discipline corrupts the record.

### R3 — Inheritance

This constitution INHERITS, verbatim, R1–R28 of [`domainspec-subagents-strategy-constitution.md`](./domainspec-subagents-strategy-constitution.md) — triggers, lifecycle, validator gates, telemetry, model selection, four-component grading. The axioms below ADD to that base; they do not relax it. Where this constitution prescribes something stricter (e.g. a richer validator checklist, additional spec fields), the stricter rule wins for `category: documents` dispatches.

---

## 2. The four roles (R4–R8)

### R4 — Four canonical roles, not workflow stages

Every dispatched agent under this constitution carries exactly one `role` from the closed set: `explorer | skeptic | writer | auditor`. These are **epistemic functions, not workflow phases**. An explorer can come after a writer, a skeptic can run in parallel with another skeptic. The discipline is functional separation: each role guards a distinct failure mode, and no agent is asked to guard two at once.

Workflow stages (investigate → evaluate → synthesize) remain inherited from the base engine and live in the `layers[].role` enum. The four canonical roles live in `agents[].role` on top of that. The two are orthogonal.

### R5 — `explorer` — generation under a tensioned angle

The explorer's job is to generate candidate findings, precedents, witnesses, or interpretations from a stated `angle` that is deliberately distinct from sibling explorers' angles. The explorer is graded on **coverage from its angle**, not on truth. Default model: `sonnet`. Justification: generation is breadth-bound and benefits from speed over depth at the per-agent level; tension comes from anti-bias composition (R10), not from any single agent's depth.

The explorer guards against monoculture: when every agent is generating from the same implicit prior, the dispatch's downstream synthesis is anchored on that prior. Cite: Hong & Page (2004) on diversity trumping ability under shared anchor.

### R6 — `skeptic` — non-vacuity, precedent kill, definitional soundness

The skeptic's job is to attack candidate findings on the three research gates (R27–R29): precedent already exists, witness cannot be constructed, definition collapses to triviality. The skeptic is graded on **specificity of objection** — vague unease is not a skeptic deliverable. Default model: `opus`. Justification: a competent skeptic is the most expensive seat at the table; the kill-list of Garner–Lack, Lurie HTT §5, Adámek–Rosický, Riehl–Verity, etc. (per v2 §3 Phase 2) demands deep reading.

The skeptic guards against folklore-recapitulation, vacuous theorems, and definitional sleight-of-hand. Cite: Mill, *On Liberty* Ch. 2 — the value of having one's argument met by its strongest rebuttal.

### R7 — `writer` — committed-grade prose for `research-*`

The writer's job is to produce the public finding artifact — a file landing in `research-*/<...>.md` with the corpus's closure-mark schema satisfied. The writer is graded on **schema conformance and citation fidelity to upstream artifacts**, not on novelty. Default model: `sonnet`. Justification: prose generation is well-served by `sonnet`; deeper synthesis is the auditor's seat.

The writer guards against the "great research, no record" failure: dispatches whose audit trail lives only in chat logs and whose findings never become referenceable nodes in the corpus.

### R8 — `auditor` — schema check, role coverage, dissent capture

The auditor's job is to verify, post-dispatch, that (a) per-agent files conform to the R12 schema, (b) the four roles were actually composed (no all-explorer dispatch claiming auditor coverage), (c) dissent — including the skeptic's surviving objections — was captured rather than smoothed away, and (d) the closure-mark in the public artifact matches the actual evidence. Default model: `haiku`. Justification: the auditor's task is rule-checking against a fixed schema; `haiku` is sufficient and cheap, freeing `opus` budget for the skeptic.

The auditor guards against the failure mode where everything passed because nothing was checked. Cite: Kahneman & Klein (2009) on the conditions for skilled intuition — namely, prompt feedback against rules.

---

## 3. Anti-bias vector composition (R9–R11)

### R9 — Shared macro vector

Every dispatch under this constitution declares exactly one **macro vector**: the load-bearing sentence that all agents share. This is the dispatch's `goal` (per R18). The macro vector is what the dispatch is for; all micro-vector tension is in service of this single shared aim.

A dispatch without a single load-bearing macro sentence is one R26-validator rejection away from being thrown out. "Investigate the Yoneda bridge" is not a macro vector; "decide whether YonedaBridge mirror in ReportQualia.lean can be deleted once YonedaBridge lands in Mathlib" is.

### R10 — Tensioned micro vectors (load-bearing) — **inherited from base R29 (v0.3.0); no-op locally**

**Inheritance marker.** As of base constitution v0.3.0, this rule is **inherited from base R29** (anti-bias tension). R29 generalizes the pattern from research-skill-local to all dispatches under the base constitution; the substance is unchanged.

Each agent in a dispatch carries a **micro vector** (its `angle`). The set of micro vectors MUST be **pairwise tensioned** — not merely non-overlapping. Pairwise tensioned means: for any two agents A and B, there exists a question on which a competent observer could predict, in advance, that A and B would disagree. "Non-overlapping AND jointly covering" is the base-engine validator check (R26 item 3); base R29 strengthens it; this rule retains the research-context examples and lineage.

Concretely: two explorers reading "the same literature from different starting points" are not tensioned; two explorers tasked with "the strongest case FOR precedent existing" vs "the strongest case AGAINST precedent existing" are tensioned. The R26 validator under base R29 rejects dispatches whose micro vectors are merely partitioned rather than tensioned. Cite: Mill (1859) on living debate; Hegel on antithesis; Krogh & Vedelsby (1995) on negative correlation in ensemble error; Irving, Christiano & Amodei (2018) on AI safety via debate.

The full discovery write-up — including the failure modes that motivate "tensioned, not merely covering" — lives at `/domainspec/vault/discovery/anti-bias-vector-composition/`. R10 / base R29 is the constitutional summary; the discovery doc is the source.

### R11 — Validator check for tension

The R26 validator's checklist, under this constitution, gains an item: for each pair of sibling agents in the same layer, the spec MUST either name the question on which they are predicted to disagree, OR justify with one line why the role pair is intrinsically tensioned (e.g. an `explorer` paired with a `skeptic` is intrinsically tensioned; two `skeptic`s under different gates are intrinsically tensioned). Failure to declare or justify is a `reject-with-fixes`.

This check exists because the failure mode of "five agents under five superficially different angles all hit the same answer" is silent: nothing in the base engine catches it. R11 forces the declaration upfront so absence of disagreement at close is itself a signal.

---

## 4. Per-agent file schema (R12–R14)

### R12 — Per-agent decision record (load-bearing)

Every dispatched agent MUST produce, in addition to its briefing return, **one file** at `<corpus>/<topic-slug>/agents/<NN>-<role>-<agent_name>.md` with the following YAML frontmatter schema:

```yaml
---
agent_id: <stable id, matches spec>
agent_name: <human name from agent-pool.yaml>
layer_id: <stable id, matches spec>
dispatch_id: <YYYY-MM-DD-<slug>>
role: explorer | skeptic | writer | auditor
model: <model id used>
decision: <one-sentence verdict>
rationale: <2-4 sentences of reasoning>
files_created: [<paths>]
files_modified: [<paths>]
references_consulted: [<paths or external citations>]
dissent: <one-line note on surviving disagreement, or "none">
closure_mark: <if applicable: open | promoted | closed-borrowing | closed-contribution | closed-paper | closed-analogy | closed-negative | needs-review>
---
```

Followed by a body **capped at ≤200 words**. Hard cap; the auditor (R8) rejects any agent file over 200 words in the body. The file is authored by the agent itself, not by the parent — the parent's role is to dispatch and to read, not to ghostwrite per-agent files.

This rule exists because subagent returns vanish from chat history once the dispatch closes; without a per-agent file, the dispatch is an unaudited black box. The 200-word cap forces compression and prevents the file from becoming a duplicate of the briefing return.

### R13 — Schema-not-instance principle

The R12 schema is the contract; the body is the instance. The auditor (R8) MUST check schema conformance file by file, not body content. The body is reviewed by the human at close, not by the auditor. This separation is what keeps the auditor cheap (R8 default `haiku`).

The schema-not-instance principle also means: agents that have nothing substantive to report STILL produce a file with `decision: <terse>` and a body that may be a single sentence. Empty files are missing files; one-sentence files are valid files.

### R14 — Per-agent file is authored by the agent

The per-agent file's author is the agent itself. The parent Claude session does not ghostwrite or rewrite the file post-hoc. If an agent's file is malformed, the auditor flags it (R8) and either (a) the dispatch loops with a fix-the-file briefing, or (b) the auditor records the malformation in the LEDGER (R16) — but the parent does NOT silently repair the agent file.

Author-fidelity matters because the per-agent file is the evidence used at exit (R21) to characterize what each role actually concluded. Parent rewrites would erase the dissent that R10–R11 went to such lengths to produce.

---

## 5. Three-layer polish (R15–R17)

### R15 — Layer 1: `<corpus>/<topic-slug>/agents/*.md` (gitignored provenance)

The per-agent files (R12) live under `<corpus>/<topic-slug>/agents/`. This path is **gitignored** by repo convention — it is provenance, not publication. Layer 1's contract: every dispatched agent has exactly one file; files conform to the R12 schema; the auditor has verified.

Gitignoring is deliberate: per-agent decision records are noisy, often draft-quality, and not intended as load-bearing project history. They are the audit trail for the LEDGER (R16) and for any future replay of the dispatch.

### R16 — Layer 2: `<corpus>/<topic-slug>/LEDGER.md` (gitignored synthesis)

The LEDGER is the dispatch's synthesis artifact, written by a `writer` role at close. It lives at `<corpus>/<topic-slug>/LEDGER.md`, also gitignored. Layer 2's contract:

- References each agent by `agent_name` (R30), not just `agent_id`.
- Synthesizes per-agent decisions into a single narrative.
- Captures dissent verbatim (surviving skeptic objections).
- Records the `exit_reason` (R21) and 1–2 sentences of context.

The LEDGER is the human-readable digest the user reads at dispatch close.

### R17 — Layer 3: `<corpus>/<topic-slug>/discovery.md` (committed public finding)

The public finding artifact is `discovery.md` at the dispatch folder root, under one of the `research-*` corpora; it is the only one of the three layers that is **committed** to the repo. It conforms to the closure-mark schema of its corpus (e.g. [`research-bridges/SCHEMA.md`](../../../domainspec-theorem/research-bridges/SCHEMA.md)). Layer 3's contract:

- Closure mark from the corpus's vocabulary, with `closure_ref` evidence.
- Citations resolve to Layer 2 (LEDGER) and through it to Layer 1 (per-agent files) within the same folder.
- No claim is load-bearing in Layer 3 unless it has a supporting record in Layer 1 or 2.

The three-layer split is what makes the corpus auditable without being suffocated by transcript-volume noise. Provenance is preserved (Layers 1–2 on disk, gitignored) while the public record (Layer 3, `discovery.md`) stays curated. Co-locating all three layers in the same `<corpus>/<topic-slug>/` folder (as of v0.2.0) replaces the prior split between `theorem/agents-strategy/runs/<dispatch_id>/` and `research-{corpus}/<...>.md`: corpus and slug are locked at dispatch time, and promotion (R-prom, operationalized by `/research-promote`) becomes a status-flip on `discovery.md` rather than a copy operation.

---

## 6. Forced upfront parameters (R18–R20)

### R18 — `goal` is a single load-bearing sentence (load-bearing)

The dispatch's `goal` field MUST be exactly one sentence and MUST be load-bearing — i.e. the dispatch's success or failure is decidable against that sentence. Vague goals ("explore X", "understand Y") are R26-validator rejections. The R11 tension check depends on the goal being concrete enough to predict per-agent disagreement against.

The base engine's R26 item 1 already requires `goal` to be a single sentence; this constitution strengthens "single sentence" to "single load-bearing sentence" — verifiable, not merely well-formed.

### R19 — `success_metric` is typed (load-bearing)

The dispatch MUST declare a `success_metric` from the closed typed taxonomy:

- **`coverage`** — N candidate findings produced, each meeting a stated bar (parametrize: bar definition).
- **`closure`** — a stated open question receives a `closure_mark` from the corpus vocabulary (parametrize: which question, expected mark types).
- **`refutation`** — a stated claim is killed by precedent or counter-example (parametrize: claim, kill criteria).
- **`convergence`** — N independent agents arrive at the same verdict (parametrize: N, verdict shape, threshold).
- **`artifact`** — a specific named file (Lean, audit, bridge) is produced and meets a stated bar (parametrize: file path, bar).
- **`exploratory`** — explicitly open-ended; agents produce one decision record each, no further bar. Use sparingly; this is the dispatch's escape hatch from typed metrics.

Each `success_metric` is parametrized in the spec by the fields its type names. The R26 validator under this constitution rejects untyped or unparametrized metrics.

This rule exists because "success" is otherwise post-hoc rationalized at close. Typing the metric upfront makes the dispatch falsifiable.

### R20 — `max_loops` is mandatory; default 1, cap 5 (load-bearing)

The dispatch MUST declare `max_loops` upfront. Default `1` (single pass, no loop). Hard cap `5`. The base engine's `loop_cap` is a per-layer mechanical floor; under this constitution, `max_loops` is the *whole-dispatch* loop budget — used when (a) skeptic objections trigger a re-dispatch of explorers, (b) writer output fails auditor schema check, (c) micro-vector tension produces irreconcilable dissent that warrants a re-run with revised angles.

The base engine's `composition` field (which mode per layer) is similarly forced upfront. R20 strengthens the discipline: every dispatch under this constitution carries `goal`, `success_metric` (typed), `max_loops`, `category`, `corpus` (which `research-*`), and `composition` (per-layer mode) in the spec; none is optional and the R26 validator rejects on absence.

---

## 7. Exit discipline (R21–R23)

### R21 — Typed `exit_reason` (load-bearing) — **inherited from base R31 (v0.3.0); no-op locally**

**Inheritance marker.** As of base constitution v0.3.0, this rule is **inherited from base R31** (typed exit_reason taxonomy). R31 generalizes the pattern from research-skill-local to all dispatches; the substance is unchanged. The base taxonomy uses `loop_cap_reached` where this constitution originally wrote `max_loops_reached` — they describe the same exit category; under inheritance, the base spelling `loop_cap_reached` is canonical. The research-only `reviewer_rejected_twice` value remains research-local (it has no base counterpart) and is preserved below.

Every dispatch terminates with exactly one `exit_reason` from the closed taxonomy:

- **`success`** — `success_metric` (R19) was satisfied.
- **`max_loops_reached`** — `max_loops` (R20) hit without satisfying `success_metric`.
- **`validator_rejected_twice`** — R26 validator rejected the spec twice (one-retry rule); per the base engine, this escalates to user.
- **`reviewer_rejected_twice`** — auditor (R8) rejected the dispatch's outputs twice across loops.
- **`dissent_irreconcilable`** — surviving skeptic objection cannot be resolved within `max_loops` and the dispatch's terms; finding is recorded as such in Layer 3, not papered over.
- **`user_abort`** — user explicitly halted at R6a or any subsequent gate.
- **`unrecoverable_error`** — tooling, infrastructure, or upstream-corpus failure prevented continuation.

The base engine has no analogous typed taxonomy; this constitution adds it because research dispatches need to be replay-able by exit category for retro-analysis (which dispatches died on `dissent_irreconcilable`? on `validator_rejected_twice`?).

### R22 — Exit reported to user with 1–2 sentence context

The `exit_reason` MUST be reported in chat at dispatch close, accompanied by 1–2 sentences of context: what was attempted, what stopped it, what the user can do next. Silent exit (telemetry-only) is an R22 violation. The exit message is also captured in the LEDGER (R16) for replay.

This rule exists because dispatch-close is the only moment the user has full attention on the dispatch's outcome; subsequent inquiry depends on recall, which is unreliable. The 1–2 sentence cap prevents the exit from becoming a second LEDGER.

### R23 — Exit reason in telemetry

The R28 telemetry event (inherited from the base engine) gains an `exit_reason` field under this constitution. Telemetry is emitted at dispatch close in addition to its R28 emission at dispatch start. The OQ-telemetry-consumer (inherited) will JOIN start and close events on `dispatch_id` to produce per-cycle dashboards.

This rule's reach is operational: without the close-event the telemetry stream cannot distinguish dispatched-and-completed from dispatched-and-still-running.

---

## 8. Mode composability (R24–R26)

### R24 — Modes compose per-layer, not via top-level DAG

The five modes inherited from the base engine — `single`, `task-fan-out`, `nested-waves` (i.e. multi-layer sequential), `zig-zag` (multi-layer with each layer reacting to the prior), `robot-talks` (declared perspectives, tension desired) — compose **per layer** in the spec's `layers[]` array. There is no top-level DAG mode. The `mode` field at the spec root names the overall shape, but each layer carries its own `composition` describing how its `n` agents are assembled.

This rule exists because the base engine reserves `mode: mixed` pending a `depends_on` DAG schema (OQ-mixed-dag-schema, inherited). Per-layer composition gives us most of what a DAG would buy without the schema complexity.

**Status**: Now inherited from base R30 (per-layer mode composability) — applies here unchanged. OQ-mixed-dag-schema is closed at the base level by R30.

### R25 — Validator checks per-layer mode well-formedness

The R26 validator under this constitution iterates over `layers[]` and checks per-layer well-formedness independently: a `robot-talks` layer must declare per-agent perspectives that are pairwise tensioned (R10–R11); a `task-fan-out` layer must declare per-agent angles that partition the layer's sub-goal; a `single` layer is trivially well-formed. Cross-layer dependencies are checked separately via the role-ordering invariant inherited from the base engine.

**Status**: Now inherited from base R30 (per-layer mode composability; validator checks per-layer mode well-formedness independently) — applies here unchanged.

### R26 — Per-layer mode constraints by role

`writer` agents MUST appear alone in their layer (no parallel writers — writes race). `auditor` agents MUST appear after all generative layers — auditing precedes only writing. `skeptic` and `explorer` agents MAY appear in any composition. These constraints are enforced by the R26 validator (extended under this constitution).

The exception: a `robot-talks` layer composed entirely of `skeptic`s under different gates (one for precedent kill, one for non-vacuity, one for definitional soundness) is well-formed and explicitly endorsed for high-stakes audits — it is the canonical shape of an adversarial-audit dispatch.

**Status**: Per-layer mode composability is now inherited from base R30 — applies here unchanged. The research-specific additions are preserved explicitly: (a) `writer` alone in its layer, (b) `auditor` strictly after all generative layers. These are the four-role constraints that R30 does not name and remain load-bearing here.

---

## 9. Research-specific gates (R27–R29)

### R27 — Precedent kill gate

For dispatches with `node_type: conjecture | bridge` in the public finding (Layer 3), a `skeptic` agent MUST be dispatched with the precedent-kill brief from [`02-nested-agent-strategy-v2.md`](../../../domainspec-theorem/theorem/agents-strategy/02-nested-agent-strategy-v2.md) §3 Phase 2: mandatory citation list (Rezk, Garner–Shulman, Lurie HTT §5, Adámek–Rosický, Riehl–Verity Elements Ch. 17, plus domain-specific authors per the dispatch's `corpus`). The auditor (R8) rejects a finished dispatch whose Layer 3 closure-mark is not `closed-negative` AND whose `skeptic` did not run the precedent kill.

Relaxable for `node_type: audit | track-readme` where the document's job is to record state of art rather than claim novelty.

### R28 — Non-vacuity witness gate

For the same `node_type: conjecture | bridge` class, an agent (typically `explorer` or `skeptic`) MUST construct or attempt to construct a concrete worked instance of the conjecture/bridge at the smallest non-trivial scale, per v2 §3 Phase 3. If the witness cannot be constructed by hand, the dispatch's Layer 3 closure-mark MUST be `closed-negative` or `needs-review` — never `closed-paper` or `closed-borrowing`.

Relaxable for `node_type: audit | track-readme`; auditing the state of literature does not require a fresh witness.

### R29 — Definitional soundness gate

For the same class, the `auditor` MUST verify that the definitions invoked in the public finding are non-vacuous on the R28 witness — i.e. the witness does not satisfy them by collapse to triviality. Per v2 §3 Phase 6, this is a post-build check; in research dispatches without a Lean build, the check is on the finding's prose definitions against the witness's concrete data.

Relaxable for `node_type: audit | track-readme`.

The three research-specific gates (R27–R29) collectively give the dispatch a falsification floor: a `conjecture`-typed dispatch that survives precedent, witness, and definitional soundness is at least non-trivially open, even if not yet proved.

---

## 10. Naming and provenance (R30)

### R30 — Human names from `agent-pool.yaml`; uniqueness within dispatch

Every dispatched agent MUST be assigned a human `agent_name` from [`theorem/agents-strategy/agent-pool.yaml`](../../../domainspec-theorem/theorem/agents-strategy/agent-pool.yaml). The pool is drawn from scientists, philosophers, and thinkers cited across the repo (`research-*`, `theorem/`, `lean-formalization/`, root `.md` files); project authors are excluded by construction.

Name selection prefers semantic fit between the agent's `role` and the pool entry's `role_fit`. Within a single dispatch, **a `skeptic` and an `auditor` MUST NOT share a name** — these two roles are most often invoked together to give independent objection, and shared names erode the LEDGER's ability to attribute dissent. Two `explorer`s under different angles MAY share a name only if the angles are visibly distinct in the LEDGER. Default: never reuse a name within a dispatch.

The LEDGER (R16) MUST reference agents by `agent_name`, not just `agent_id`. Per-agent files (R12) carry both fields in the frontmatter so the ID provides machine-checkable provenance while the name provides human-readable provenance.

This rule exists because anonymous IDs (`L2-A3`) make the LEDGER unreadable at scale; named agents make it narratively coherent and force the parent to think about role-name fit at dispatch-design time.

---

## 11. Non-negotiables

Load-bearing — cannot be relaxed without re-entering this constitution:

- **R10** — Tensioned (not merely covering) micro vectors. The dispatch's epistemic value depends on this; relaxing it reduces the skill to the base engine.
- **R12** — Per-agent file schema. Without it, dispatches are unauditable black boxes.
- **R18** — `goal` as a single load-bearing sentence. Vague goals make R10's tension check meaningless.
- **R19** — Typed `success_metric`. Without typing, success is post-hoc rationalized.
- **R20** — `max_loops` mandatory. Without a loop budget, runaway dispatches are inevitable.
- **R21** — Typed `exit_reason` taxonomy. Without it, the dispatch corpus cannot be retro-analyzed by failure category.

Relaxation of any of these requires a normative amendment per the base constitution's amendment process, with explicit premise revision.

---

## 12. Relationship to other constitutions

This constitution **inherits** the spec engine, lifecycle (R3 steps 0–7), validator (R26), telemetry (R28), heuristic table, model-selection rules, and four-component grading from [`domainspec-subagents-strategy-constitution.md`](./domainspec-subagents-strategy-constitution.md). Every rule in that constitution remains binding under this one unless explicitly strengthened here.

This constitution **adds**:

- The four canonical roles `explorer | skeptic | writer | auditor` (R4–R8).
- Per-agent decision-record schema (R12–R14).
- Anti-bias vector composition with tension-not-coverage (R9–R11).
- Forced upfront parameters: `goal`, `success_metric` (typed), `max_loops`, `category`, `corpus`, `composition` (R18–R20).
- Typed `exit_reason` taxonomy (R21–R23).
- Research-specific gates: precedent kill, non-vacuity witness, definitional soundness (R27–R29).
- Three-layer polish (R15–R17).
- Human naming with within-dispatch uniqueness (R30).

**Conflict resolution.** When a rule in this constitution conflicts with a rule in `domainspec-subagents-strategy-constitution`, this constitution wins for `category: documents` dispatches under the `research` skill. For any other category or any other skill, the base constitution wins. There is no current conflict in flight; this clause is forward-looking.

**Robot-talks.** When a layer's mode is `robot-talks`, [`robot-talks-constitution.md`](./robot-talks-constitution.md) additionally binds, per the base engine's R20. Conflicts resolve in favor of `robot-talks-constitution` within `robot-talks` layers.

---

## 13. Open questions

Items to resolve in v0.2.0 or as follow-up amendments:

- **OQ-code-category** — when `category: code` is unlocked (dispatches that modify the repo, not just `research-*`), do the four roles stay the same? Likely yes for `skeptic | auditor`; `explorer | writer` may split into `coder | reviewer`.
- **OQ-reviewer-haiku-vs-sonnet-threshold** — auditor default is `haiku` (R8). At what artifact complexity does the auditor need to bump to `sonnet`? Currently judgment-call per dispatch.
- **OQ-multi-role-sub-pools** — should `agent-pool.yaml` carry separate sub-pools per role (a `skeptic`-suited subset, an `auditor`-suited subset), or does the existing `role_fit` default suffice?
- **OQ-tension-declaration-form** — R11 requires either a stated disagreement question or a one-line role-pair justification. Should the disagreement question be free-text or constrained to a small ontology?
- **OQ-cross-corpus-dispatches** — when a dispatch touches both `research-bridges/` and `research-physics/`, which corpus's closure vocabulary governs Layer 3? Currently the spec's `corpus` field declares the primary; secondary mentions are unhandled.
- **OQ-loop-bookkeeping** — `max_loops` (R20) counts whole-dispatch loops; the base engine's `loop_cap` counts per-layer. Reconciling the two counters in telemetry needs an explicit schema.
- **OQ-exit-reason-vs-grade** — R21's typed `exit_reason` and the base engine's four-component grade (R21 of base) are nominally orthogonal but may rhyme; should `exit_reason: success` require all four grade components above a threshold?

---

## 14. References

| Document | Type | Description |
|----------|------|-------------|
| [`domainspec-subagents-strategy-constitution.md`](./domainspec-subagents-strategy-constitution.md) | `inherits-from` | Spec engine, lifecycle, validator, telemetry, grading. |
| [`.claude/skills/domainspec-subagents-strategy/SKILL.md`](../../../domainspec/.claude/skills/domainspec-subagents-strategy/SKILL.md) | `operationalizes-engine` | The inherited skill body. |
| [`theorem/agents-strategy/02-nested-agent-strategy-v2.md`](../../../domainspec-theorem/theorem/agents-strategy/02-nested-agent-strategy-v2.md) | `gate-source` | Source of R27–R29 (precedent kill, non-vacuity witness, definitional soundness). |
| [`theorem/agents-strategy/agent-pool.yaml`](../../../domainspec-theorem/theorem/agents-strategy/agent-pool.yaml) | `name-source` | Pool for R30 agent naming. |
| [`research-bridges/SCHEMA.md`](../../../domainspec-theorem/research-bridges/SCHEMA.md) | `closure-vocabulary` | Closure marks Layer 3 uses (extends `research-emergence/SCHEMA.md` and `research-gpt/README.md`). |
| [`research-emergence/SCHEMA.md`](../../../domainspec-theorem/research-emergence/SCHEMA.md) | `closure-vocabulary` | Inherited closure marks. |
| [`research-gpt/README.md`](../../../domainspec-theorem/research-gpt/README.md) | `closure-vocabulary` | Original closure-mark source. |
| `vault/discovery/anti-bias-vector-composition/` | `discovery-source` | Discovery doc backing R10–R11 (to be written separately). |
| [`robot-talks-constitution.md`](./robot-talks-constitution.md) | `binds-when` | Applies additionally when a layer's mode is `robot-talks`. |
| [`schema-amendment-discipline-constitution.md`](./schema-amendment-discipline-constitution.md) | `governed-by` | Amendment log discipline. |

**Literature cited (informing the rules, not load-bearing in the project's mathematical claims):**

- Mill, J. S. (1859). *On Liberty*, Ch. 2 — value of meeting one's argument by its strongest rebuttal. (R10)
- Hegel, G. W. F. — antithesis as constitutive of synthesis. (R10)
- Hong, L., & Page, S. E. (2004). "Groups of diverse problem solvers can outperform groups of high-ability problem solvers." *PNAS* 101(46). (R5, R10)
- Krogh, A., & Vedelsby, J. (1995). "Neural Network Ensembles, Cross Validation and Active Learning." *NIPS* 7. (R10 — negative correlation in ensemble error)
- Kahneman, D., & Klein, G. (2009). "Conditions for intuitive expertise: A failure to disagree." *American Psychologist* 64(6). (R8)
- Irving, G., Christiano, P., & Amodei, D. (2018). "AI safety via debate." arXiv:1805.00899. (R10)

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.2.0 | 2026-05-26 | Dispatch folder layout collapsed. R12 / R15 / R16 / R17 rewritten: per-agent files, LEDGER, and discovery now co-located under `<corpus>/<topic-slug>/` (was: split between `theorem/agents-strategy/runs/<dispatch_id>/` and `research-{corpus}/<...>.md`). `spec.yaml` → `dispatch.yaml`. Promotion is now a status-flip on `discovery.md`, not a copy. All cross-references in this constitution are repo-relative (no `/Users/victorboscaro/` prefixes). |
| 0.1.1 | 2026-05-26 | Inheritance markers added on R24 / R25 / R26 (now inherited from base R30). Amendment log section added. R10 and R21 already carried inheritance markers (to base R29 and base R31 respectively) since v0.1.0. |
| 0.1.0 | 2026-05-26 | Initial constitution. R1–R30. Inherits domainspec-subagents-strategy-constitution v0.2.1; adds four-role schema, anti-bias vector composition, per-agent file schema, three-layer polish, typed forced parameters, typed exit_reason taxonomy, research-specific gates from `02-nested-agent-strategy-v2.md`, and human-naming discipline from `agent-pool.yaml`. |

---

## Amendment log

- **2026-05-26 (v0.2.0)**: Layout shift. Every dispatch now lives in ONE folder `<corpus>/<topic-slug>/` containing `agents/`, `research/`, `dispatch.yaml`, `discovery.md`, `LEDGER.md`. The prior layout — provenance under `theorem/agents-strategy/runs/<dispatch_id>/` and committed finding under `research-{corpus}/<...>.md` — is retired. Rationale: `corpus` and `topic_slug` are locked at dispatch step 1, so there is no longer a path-computation step at promote; promotion is a user-gated status flip on `discovery.md` (from `draft` to `exploratory`/`active`/`closed-*`). The anti-pattern checks at promote are preserved unchanged. Spec file renamed `spec.yaml` → `dispatch.yaml`. All paths in this constitution are now repo-relative (sibling repos under `~` are treated as roots: `domainspec/`, `domainspec-theorem/`).
- **2026-05-26 (v0.1.1)**: Backport landed. Patterns originally crystallized here (anti-bias tension R10, per-layer mode R24-26, exit_reason R21) are now in base constitution (R29, R30, R31). Local axioms retained as inheritance markers; research-specific additions (e.g. writer-alone, auditor-last in R26) preserved explicitly.
