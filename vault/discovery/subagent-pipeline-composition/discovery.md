---
tags: [vault, discovery, multi-agent, subagents, dispatch, pipeline, wave, intent, composition, topology, role-collapse]
node_type: discovery
is_session: false
layer: [ontology, architecture]
nature: [explanatory, reference]
status: draft
version: 0.1.0
last_updated: 2026-06-08
created_by: victorboscaro@gmail.com
---

# Subagent Pipeline Composition

## Objective

Model a subagent dispatch as a **composable pipeline of waves**, where each wave is an intent-unit (research, evaluate, decide, doc, code, plan, debug, lookup) and a single skill used in isolation is just a pipeline of length 1. Establish two orthogonal axes — the **wave** (`{intent, lane, mode}`) and the **agent** (`{angle, model}`) — collapse the separate `role` field into the wave's intent, and route every pipeline through one governed parent entry so the dispatch shape is composed, not picked from a flat topology enum. The end state is a single shared composition vocabulary that supersedes the framework's three drifting topology naming systems and the three-way-inconsistent `role` enum, with the engine changes deferred to a future governed amendment.

## 1. Business Context

### Why now

The framework is converging on a toolkit of per-intent subagent skills (research, doc, code, review, decide, lookup), and the sibling `subagent-dispatch-observability` discovery has already frozen the *recording* contract for those dispatches. But the *composition* contract — how a user assembles a multi-phase dispatch — is still expressed as a single global "topology" or "mode" label picked up front, which cannot describe a real multi-phase flow (research → discovery → code) that is parallel in one phase and sequential across phases. A 3-agent robot-talks investigation in the 2026-06-08 design session established that intent cannot live at the dispatch level; it must live on each phase. Before any per-intent skill is built or the base engine is amended, the composition model those skills compose under has to be fixed, or each new skill hard-codes its own phase vocabulary and the fragmentation the observability discovery already documents gets worse.

### What's broken

Each problem with its on-disk location (verified 2026-06-08):

- **Intent is modeled as a single per-dispatch verb.** The base engine carries exactly one top-level `mode` per dispatch (`R19`, `vault/constitution/domainspec-subagents-strategy-constitution.md:298-313`) and the observability schema carries one `intent` at the dispatch level (`vault/discovery/subagent-dispatch-observability/discovery.md:86`). Neither can express a flow whose phases have different intents. The team's own prior decision that *research is a first-class step after Define* (`/Users/victorboscaro/Arcanum/TO-VLAD/TO-VLAD6.md:219-228`) plus the multi-phase use case (Define → Research → discovery → Implement, worked at `TO-VLAD6.md:234-246`) refute per-dispatch intent: a single verb cannot label a sequence of phases. The robot-talks finding that drove this is recorded in this session's scratchpad (`/Users/victorboscaro/domainspec/.claude/current_conversations/2026-06-08-1311-k7x3p-subagent-dispatch-observability.md:7`, the three-orthogonal-axes insight).
- **Three unreconciled topology vocabularies.** The framework names dispatch shapes three different ways: CLAUDE.md Route 13 heuristic rows (`single-lookup / flat-fanout / triangulation / adversarial-audit / parent-synthesis / meta-dispatch`); the 8-topology taxonomy at `vault/discovery/subagents-topologies/discovery.md:48`; and the per-layer mode enum at `vault/discovery/subagents-strategy-refinement/principle.md:36` (`single, task-fan-out, nested-waves, zig-zag, robot-talks`). This is the fragmentation `subagents-topologies` audits as Drift 3 (`vault/discovery/subagents-topologies/discovery.md:32`).
- **The `role` enum is three-way inconsistent across live artifacts.** The frozen taxonomy is the 4+1 `explorer | skeptic | writer | auditor` + meta `validator` (`vault/discovery/subagents-strategy-refinement/role-taxonomy.md:18-66`). But the observability schema's `agent.started.role` enum adds `reviewer` and `implementer` (`vault/discovery/subagent-dispatch-observability/discovery.md:139`), and `TO-VLAD6.md:150-152` drops `auditor` entirely (`explorer | skeptic | writer | reviewer | implementer`). Three artifacts, three different role sets. This drift is itself the disease this effort exists to end — a separate per-agent `role` axis that nobody can keep consistent.

### What stays the same

Explicit scope boundary — this discovery designs the **composition model only**. It does not touch:

- **The base engine lifecycle and the constitution rule text.** `domainspec-subagents-strategy-constitution.md` — the seven-step lifecycle (R3), the user-confirm gates (R6), the strategist-is-the-skill rule (R24), the spec schema (R25), the validator gate (R26), telemetry emission (R28) — is **not edited here**. Any rule change this model implies (splitting the single-verb `R19` mode into per-wave intent+mode, the parent-entry enforcement, a `role`-collapse in R25's per-agent schema) is a **future governed amendment** under the constitution's §12 amendment process, not a change this design doc makes. This discovery proposes the changes; the amendment pass enacts them.
- **The 3-level telemetry / emit contract.** The sibling `subagent-dispatch-observability` discovery owns the `dispatch → layer → agent` recording schema, the *log-what-would-vanish* criterion, and the mandatory emit gate. This discovery refines exactly one field of it (the per-agent briefing record, §3.D7) and otherwise records *which* intent/lane/mode a wave had — it does not redefine the recording schema.
- **The anti-bias pairwise-tension principle.** "De-biasing comes from tension along the bias-carrying axis, not from agent count or surface diversity" is owned by `vault/discovery/anti-bias-vector-composition/principle.md` and enforced by R29. It is cited as a constraint on how `angle`s within a wave must be assigned (§2, C3), not re-derived.
- **The `subagents-topologies` scope-fence.** The three-failure fence (loaded question · variance · single-synthesizer bottleneck) bounds what any composition can promise. Cited, not restated; the single-synthesizer caveat resurfaces in C7 (parent as the un-tensioned fan-in reader).
- **The `intent` and `lane` value-enums themselves.** This discovery fixes the *shape* (intent-on-wave, lane-on-wave, angle-on-agent) and presents intent as a *design space*, but does not freeze the closed enum of legal intent values — that freeze is deferred to align with `subagents-topologies` OQ-1 (§3, OQ1).

## 2. Core Concepts

### C1 — Dispatch = composable pipeline of waves

A dispatch is a **sequence (or DAG) of waves**, not a single shape picked from a flat enum. The user's goal is to *build pipelines from skill-units*: a research wave feeding a discovery wave feeding a code wave is one pipeline; a single skill used alone is a **pipeline of length 1**. The old global labels (`sequential | task-fan-out | pipeline | …`) dissolve — they are emergent properties of the edge set between waves (a wave that consumes a prior wave is "sequential"; two waves with no edge are "parallel"), not a label chosen up front (`TO-VLAD6.md:44-80`). Chosen over the per-dispatch-mode model because that model provably cannot label a multi-phase flow (What's broken, item 1).

### C2 — Wave = `{ intent, lane, mode }`

The wave is the phase unit (the observability discovery's `layer`; Craft's *Wave* — same object, `TO-VLAD6.md:54-59`). The recording FK stays `layer_id` per the already-frozen sibling schema; "wave" is the user-facing noun, `layer_id` the persisted key. It carries three properties:

- **`intent`** — the activity/purpose of the wave (research / evaluate / decide / doc / code / plan / debug / lookup). The intent carries the wave's **behavioral template** — what every agent in the wave is for. This is the axis that did not exist in either prior artifact (`scratchpad:7`).
- **`lane`** — the **Operational Lane** (Craft term, `TO-VLAD6.md:146-151`): the accountability / expertise domain of the wave (`validator | auditor | qa | tech | business | …`). **Kept** per user decision (§3, D4) — it answers *"what expertise is accountable for this wave"*, a question intent does not answer.
- **`mode`** — the per-wave wiring: `single | fan-out | robot-talks` *(provisional spellings — `fan-out` is a placeholder for R19's `task-fan-out`; the canonical mode value-enum is NOT frozen here, it is deferred to `subagents-topologies` OQ-1 per §3 OQ1, exactly like the sibling observability schema marks its enums `<provisional>`)*. How the agents *within* one wave relate. Per-wave, not per-dispatch — this is the unit `R19` gets at the wrong level.

### C3 — Agent (stage worker) = `{ angle, model }`

An agent is one worker inside a wave. It carries:

- **`angle`** — the per-agent assignment that **specializes the wave's behavioral template** (Craft's *Stage Worker* sub-goal; the existing R25 `angle` field). In a research wave the angle is the explorer's distinct vector; in a review wave it is the reviewer's distinct check. `angle` is the genuine per-agent differentiator — and the axis along which R29 pairwise tension is enforced.
- **`model`** — the model assigned to that agent by the strategist (per R14 / R25, strategist proposes, user validates; no fixed tier→model rule).

### C4 — `role` collapses into `wave.intent`

Because waves are **homogeneous** — every agent in a research wave is an explorer, every agent in a review wave is a reviewer — the behavioral contract is a property of the *wave's intent*, not of each agent. A separate per-agent `role` field is therefore redundant: it restates what the wave's intent already fixes. So `role` **collapses into `wave.intent`**, and the per-agent differentiator that remains is `angle` (C3). This supersedes the three-way-inconsistent `role` enum (What's broken, item 3): there is no longer a free-floating role set for three artifacts to disagree about. **Reintroduce `role` only if a single wave is ever allowed to mix functions** (e.g., an explorer and a skeptic in one wave) — that is the one condition under which a per-agent role becomes load-bearing again. Chosen over keeping `role` as a separate axis (§3, D5) because for homogeneous waves the separate axis carries no information the wave does not.

### C5 — The intent set is a design space, not a frozen MECE enum

The candidate intents are **research · evaluate · decide · doc · code · lookup · plan · debug**. The robot-talks investigation surfaced three honest collapses/forks that must be recorded but **not yet frozen**:

- **`lookup` is the `artifact:none` corner of `research`** — a research wave that produces no durable artifact (the ephemeral-lookup tier).
- **`validate` ≈ `decide`** — both collapse to `evaluate(target: artifact | options)`: validating an artifact and deciding among options are the same epistemic move over different targets.
- **`doc` vs `code` is the one genuine fork** — they differ materially (code needs worktree isolation and a test sub-wave; doc does not), so they do not collapse.

Presented as a design space because the final canonicalization is tied to `subagents-topologies` OQ-1's vocabulary unification (§3, OQ1) — freezing the values here would coin a fourth parallel vocabulary, the exact failure this work is ending.

### C6 — The only loop is the review loop

Every **work wave is followed by a review wave**; a `block` verdict re-works the prior wave, bounded by `loop_cap`. There is **no general cyclic-graph engine** — the wave graph is a DAG plus exactly one kind of feedback edge, the review back-edge (`reopens`, `TO-VLAD6.md:99-114`). When `block` persists past `loop_cap`, the dispatch closes with a typed `exit_reason` (`reviewer_rejected_twice` / `loop_cap_reached`, per R31), never an open-ended retry. The one arc with no review wave is **pure `lookup`** (ephemeral, nothing durable to review). Chosen over a general typed cyclic graph (§3, D6) — that is premature engineering for a feedback pattern that is, in practice, always "review blocked → rework."

### C7 — One governed parent entry

The parent skill (`domainspec-subagents-strategy`) is the **sole orchestrator and telemetry emitter**. It routes to per-intent **wave-recipe skills** (the research-skill, the doc-skill, the code-skill), which are **recipe providers — NOT independent orchestrators**. Two orchestrators is the ungoverned-channel failure (`subagents-topologies` Drift 5, `vault/discovery/subagents-topologies/discovery.md:34`): a second orchestrator dispatches outside the parent's emit gate and the dispatch runs invisibly. Per base R24 the orchestrator is *the parent skill enacting*, not a child agent (`domainspec-subagents-strategy-constitution.md:275-292`). Note the scope-fence caveat: the parent is also the single fan-in reader, so it is the irreducible single-synthesizer bias point (`subagents-topologies` D-1 / `TO-VLAD6.md:200-207`) — the moment fan-in becomes genuine N-wave synthesis, that synthesis must itself become a reviewable wave.

### C8 — Enforcement via a per-runtime hook (gate + nudge)

Composition is enforced by a per-runtime **hook** that does two things: it **BLOCKS the raw dispatch primitive** (`Task` / `Agent` calls) unless the dispatch is routed through the parent skill, and it **nudges** intent → the right wave-recipe skill. Cross-runtime (Claude Code / Codex / others) = **N thin per-runtime shims enforcing ONE portable contract**: the contract (route-through-parent, emit started/closed) is portable; the shim that intercepts the primitive is runtime-specific. The exact enforcement mechanism (hook vs wrapper vs audit-only) is the sibling observability discovery's OQ-3 and this discovery's OQ4 — named here, decided in the implementation plan.

### C9 — Template hierarchy

Three template tiers, with their necessity called out:

- **Agent template** (necessary) — the per-agent prompt skeleton, versioned by `sha`; the wave's intent picks the template, the agent's `angle` fills its slot.
- **Wave-recipe** (necessary) — the per-intent skill (C7) that knows how to shape a wave of that intent.
- **Pipeline-template** (optional sugar, deferred) — a named, reusable composition of waves (e.g., "the standard feature pipeline"). Deferred until ad-hoc composition shows repeated shapes (§3, OQ3).

### C10 — Briefing logged as params, not verbatim

The per-agent briefing record is `template_sha + angle + inputs` — reconstructable from those three, with a verbatim sidecar file written **only on demand**. This **refines** the sibling observability discovery's OQ-2 (`vault/discovery/subagent-dispatch-observability/discovery.md:201-203`), which decided to store the briefing verbatim by default. The composition model makes verbatim storage unnecessary in the common case: when the template is versioned by `sha` and the angle is recorded, the briefing is a pure function of the two — storing the rendered text is log bloat (§3, D7).

## 3. Detailed Specifications — Decisions & Open Questions

These are firm decisions, each naming the alternative rejected (honoring decision-space preservation).

### D1 — The hook gates the primitive AND nudges intent→skill

The enforcement hook does both jobs: hard-blocks raw `Task`/`Agent` calls that bypass the parent, and softly routes intent to the right wave-recipe. **Alternative rejected:** nudge-only (advisory). Rejected because an advisory nudge reproduces Drift 5 — the ungoverned channel exists precisely because emission was author-discipline, not structural.

### D2 — A skill used in isolation is a pipeline of length 1

A single skill invoked alone is not a special case; it is a one-wave pipeline, still parent-orchestrated and still emitted. **Alternative rejected:** a "direct" un-orchestrated path for single skills. Rejected because the direct path is the bypass that produces ungoverned dispatches (Drift 5); length-1 uniformity keeps the emit gate inescapable (cf. the observability discovery's C4 mandatory emit gate).

### D3 — Intent is per-wave, not per-dispatch

Pipelines compose waves; each wave owns its intent. **Alternative rejected:** keep one `intent`/`mode` per dispatch (the current R19 shape). Rejected by both the team's own research-after-Define decision and the multi-phase use case (What's broken, item 1) — a single verb cannot label a sequence of phases.

### D4 — Lane is kept

The Operational Lane stays as a wave property, orthogonal to intent. **Alternative rejected:** drop lane and fold accountability into intent — rejected by the user. Lane answers *"what expertise is accountable"*; intent answers *"what activity"*; the two cross (a `tech`-lane wave can have a `research` intent), so collapsing them loses information (`TO-VLAD6.md:172-179`).

### D5 — `role` collapses into `wave.intent`

The per-agent `role` field is removed; the wave's intent carries the behavioral contract, the agent's `angle` carries the differentiation. **Alternative rejected:** keep `role` as a separate per-agent axis (status quo in role-taxonomy.md). Rejected as redundant for homogeneous waves — the very homogeneity that makes a wave a wave makes a per-agent role restate the wave's intent. (Re-openable only under the mixed-function-wave condition, C4.) **Note — this diverges from `TO-VLAD6.md:141-178`**, which kept role on the agent (lane on the wave, role on the agent). This discovery adopts that doc's lane/wave vocabulary but reverses its role decision; the divergence is deliberate, on the homogeneity argument above.

### D6 — The only loop is the review loop, bounded by `loop_cap`

The single feedback edge is review → rework, bounded by `loop_cap`, exiting via a typed `exit_reason`. **Alternative rejected:** a general typed cyclic graph with arbitrary back-edges. Rejected as premature/over-engineering — no use case yet needs a feedback edge that is not "a review blocked the prior wave," and a general cycle engine invites unbounded loops the `loop_cap` discipline is built to prevent.

### D7 — Briefing logged as params + sha, not verbatim

The per-agent briefing is recorded as `template_sha + angle + inputs`, sidecar-verbatim only on demand. **Alternative rejected:** store the full rendered briefing verbatim (the sibling observability discovery's current OQ-2 decision). Rejected for log bloat — under a versioned template the verbatim text is reconstructable, so storing it duplicates the template content into every agent row.

### D8 — Light framing: intent is a label on the wave

Intent is a single label carried by the wave, picking a behavioral template. **Alternative considered and deferred:** the heavy reframing where each wave carries an explicit `lifecycle_arc + output_contract` pair (a typed phase position plus a typed deliverable schema). Recorded as considered-and-deferred — the heavy framing buys machine-checkable phase ordering and output typing, but it is more structure than the current need justifies; revisit if pipeline-templates (C9) or output-contract validation become load-bearing.

### Open Questions

#### OQ1 — Final intent canonicalization

The intent set is presented as a design space (C5) with the lookup/research, validate/decide, doc/code relationships recorded but not frozen. **Recommendation:** keep the design space and **defer the freeze to align with `subagents-topologies` OQ-1** (`vault/discovery/subagents-topologies/discovery.md:64`). Freezing intent values before the three topology vocabularies are unified would coin a fourth parallel vocabulary — the exact disease. Ship the shape (intent-on-wave); defer the enum.

#### OQ2 — Doc/code merge trip-wire

C5 keeps `doc` and `code` separate because code needs worktree isolation and a test sub-wave. **Recommendation:** keep them separate **until worktree isolation and the test sub-wave become optional parameters** of a single `produce(artifact)` intent. The fork is real today; it is a trip-wire, not a permanent law — re-evaluate when the isolation/test machinery is parameterizable.

#### OQ3 — Pipeline-template presets

C9 defers named reusable pipeline-templates as optional sugar. **Recommendation:** **defer until ad-hoc composition shows repeated shapes.** Minting presets before the common pipelines are observed risks freezing the wrong shapes; let real usage reveal which compositions recur, then promote those to named templates.

#### OQ4 — Cross-runtime hook enforcement mechanism

C8 names a per-runtime hook (gate + nudge) but does not decide hook vs wrapper vs audit-only, nor the exact primitive-interception point per runtime. **Recommendation:** **defer to the implementation plan.** This is the same open mechanism as the sibling observability discovery's OQ-3 and the constitution's OQ-non-claude-runtime-paths; resolve all three together so the portable contract and the N shims are designed once.

#### OQ5 — How the `role`-collapse reconciles the sibling observability discovery's role enum

The observability discovery's `agent.started.role` enum (`vault/discovery/subagent-dispatch-observability/discovery.md:139`) still carries the old per-agent role set, which D5 removes. **Recommendation:** the **future governed amendment pass fixes both together** — the same amendment that splits R19 into per-wave intent+mode and drops `role` from R25's per-agent schema should also retire the `role` field from the observability `agent.*` rows (replacing it with the wave's intent + the agent's `angle`). Do not patch the observability schema in isolation; the two schemas must move in one amendment so they cannot re-diverge.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/subagent-dispatch-observability/discovery.md` | `cites` | The sibling discovery owns the 3-level emit/telemetry contract; this discovery is the composition half that records into it and refines its OQ-2 briefing decision (C10/D7). |
| `vault/discovery/subagents-topologies/discovery.md` | `derives-from` | The verified drift audit (Drift 3 vocabulary fragmentation, Drift 5 ungoverned channel) and the three-failure scope-fence are the evidential basis for this discovery's "What's broken" and C7. |
| `vault/discovery/subagents-strategy-refinement/principle.md` | `refines` | Reuses the `layers[]` / per-layer-mode concept and the typed `exit_reason`; the role-collapse (D5) makes the 4+1 role taxonomy this principle catalogs more specific (per-agent role folds into wave intent) without wholesale replacing it. |
| `vault/discovery/subagents-strategy-refinement/role-taxonomy.md` | `refines` | The frozen 4+1 role enum that the `role`-collapse (C4/D5) refines — the per-agent axis collapses into wave intent, re-openable only for mixed-function waves. |
| `vault/discovery/anti-bias-vector-composition/principle.md` | `cites` | The tension-not-count principle constrains how per-agent `angle`s within a wave are assigned (C3); cited, not re-derived. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `cites` | The base engine (R19 mode enum, R24 strategist-is-the-skill, R25 spec, R28 telemetry) this composition model evolves via a future governed amendment — not edited here. |
