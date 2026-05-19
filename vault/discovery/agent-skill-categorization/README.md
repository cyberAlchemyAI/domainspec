---
tags: [agent-skill-categorization, architecture, ontology, governance, meta-framework]
node_type: discovery
is_session: false
layer: architecture, ontology
nature: explanatory, reference
status: exploratory
version: 0.1.0
last_updated: 2026-05-19
---

# Agent and Skill Categorization in DomainSpec

> The corpus (~159 entries: ~46 agents + ~113 skills) has crossed the adversarial null's stated failure threshold, and the existing implicit taxonomy already encodes three orthogonal dimensions. If explicit categorization is adopted, the load-bearing design move is a faceted scheme that formalizes what is already present — preserving prefix as the system dimension, adding role as the primary new axis (addresses today's routing failure), and treating tool-surface as a latent governance asset to layer on afterward. The counter-position is not defeated: categories pay rent only offline (governance, telemetry, onboarding) and only if tooling actually consumes them at runtime.

---

## Context

A maintainer managing ~46 agents and ~113 distinct skills under `.claude/` observed that implicit prefix grouping (`domainspec-*`, `gsd-*`, `gitnexus-*`) was the only categorization mechanism and asked whether explicit categorization was worth introducing [F1, F3]. No prior discovery existed. A five-lens parent-synthesis dispatch investigated the design space from five independent angles: external framework literature, axis-weight analysis, as-is inventory, decision framing, and adversarial null [dispatch spec: `vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml`].

The investigation's structural detail matters: the adversarial lens (L1-A5) deliberately steelmanned the do-nothing position against four investigative lenses that examined the real cost and benefit of categorization. The synthesis produced by L2-A1 is held in tension with the adversarial lens throughout; neither position is suppressed here.

---

## Recommendation

If explicit categorization is adopted, the scheme should be faceted: multiple independent frontmatter fields, each capturing one orthogonal axis, rather than a single hierarchy or a single new field. The migration path has three stages:

1. **Preserve prefix (system dimension).** `domainspec-*`, `gsd-*`, `gitnexus-*` already serve as a working system-level taxonomy; a new scheme should not overrule or duplicate them [F4, T2].
2. **Add `role` as the primary new axis.** This is the axis that addresses today's runtime failure — silent mis-routing that produces wrong-shaped output [F2, T1]. A constrained controlled vocabulary for `role` (e.g., `orchestrator | specialist | shell | validator | writer | utility`) is preferable to free-text.
3. **Treat `tool-surface` as a latent governance asset.** This axis has near-zero discriminating power in the as-is corpus because most agents declare the full tool set [F5]. Introducing it as a frontmatter field requires also tightening declared tools per agent — a migration larger than the field addition alone [F5]. Defer until role rollout is stable.

This recommendation is normative, not prescriptive: if categorization is adopted, then a faceted scheme with role-first sequencing is the path with the best cost-to-rent ratio. The framework does not mandate adoption.

---

## Decision space

No binding decisions have been taken by this discovery. The following space was explored.

### D-1 — No decision yet

The dispatch produced a recommendation (faceted, role-first) but no decision to adopt or reject categorization has been confirmed. The discovery records the design space so a future decision can be grounded in it.

### Candidate axes

Five axes were examined [F1]:

| Axis | What it captures | Most load-bearing for | Hybrid-forcing failure mode |
|---|---|---|---|
| Role | Orchestrates vs executes; cognitive mode | Runtime routing failures [F2, T1] | Agents that synthesize + write + commit can't resolve to one role bucket |
| Lifecycle stage | Workflow phase (discover / plan / execute / ship / maintain) | Pipeline sequencing | Cross-cutting hooks fire across all stages; assigning one stage is arbitrary [research §Agent 2] |
| Tool-surface / blast-radius | Which tools declared; destructive vs read-only | Governance gates; permissions [F2] | Dry-run vs live same agent sits in two blast-radius buckets simultaneously [research §Agent 2] |
| Domain / capability | Subject area (vault, git, gitnexus, infra) | Discoverability; onboarding | Cross-domain orchestrators break cleanly on domain boundaries |
| Hierarchy level | Supervisor vs worker vs leaf | Structural routing (LangGraph-style) | Corpus is flat by platform design; hierarchy is emergent from handoffs, not positional [T3] |

### Implicit 3D matrix already present

The as-is corpus clusters on three orthogonal dimensions that are not yet formalized [F4]:

- **System** — encoded in prefix (`domainspec-*`, `gsd-*`, `gitnexus-*`)
- **Stage** — encoded in lifecycle verbs (start, plan, execute, close, etc.)
- **Abstraction** — encoded in naming patterns (shell vs orchestrator vs specialist)

The bridge skills (`execute-phase-bridge`, `plan-phase-bridge`, `ui-phase-bridge`) are load-bearing evidence that the seams between these dimensions are already operationally real. Any explicit taxonomy that ignores these three dimensions will fight the corpus.

---

## Alternatives considered

### A-1 — Single-axis taxonomy (role only)

Adopt one frontmatter field (`role`) and no others. Simpler migration (~159 file touches, one field each). Sufficient for the routing failure [F2]. Leaves governance and tool-surface un-served. Loses the faceted benefit when downstream tooling (telemetry, onboarding) wants a second axis.

**Why not chosen as the sole recommendation.** Nothing structurally prevents adding more axes later; but starting with role-only forecloses the design signal that comes from seeing the full matrix. The recommendation favors sequencing (role first, tool-surface later) rather than permanently limiting to one axis.

### A-2 — Null hypothesis (do nothing; preserve prefix)

Prefix IS a flat taxonomy [T2]. It answers the first routing question without a single line of frontmatter. Adding category layers creates two competing taxonomies (prefix + frontmatter). Every category a maintainer adds is overhead on every new agent.

**Why not adopted — but not defeated.** The adversarial lens is partially correct: prefix covers the system dimension well [T2]. It is partially wrong: prefix is silent on stage and abstraction. The null holds valid for runtime dispatch (the LLM dispatches by description-matching, not by frontmatter field [T3]) and becomes wrong only for offline uses — governance, telemetry aggregation, onboarding navigation [T3]. If the maintainer has no tooling that consumes categories, the null is the right answer.

### A-3 — Tool-surface first (blast-radius as primary axis)

Agent 2's abstract reasoning names tool-surface as the most load-bearing axis because miscategorization of blast-radius corrupts production state — the only question with non-negotiable operational consequences [T1]. This is correct in the abstract.

**Why deferred.** Today's actual failure is routing, not blast-radius miscategorization [F2, T1]. And the tool-surface axis would be vacuous today because declared tools are not differentiated across agents [F5]. Tool-surface first optimizes for a failure that isn't currently biting, while leaving the routing failure unaddressed.

### A-4 — Graph-positional taxonomy (LangGraph-style)

Encode hierarchy by position in a supervisor/worker/leaf graph rather than by declarative label. The corpus as a whole forms an emergent topology during handoffs, not a pre-arranged graph.

**Why not applicable.** Claude Code dispatches by description-matching at the LLM layer; the platform is flat by design [T3]. LangGraph's graph-positional categorization requires a structured execution graph at compile time — that model does not map onto Claude Code's flat filesystem + description-match architecture.

---

## Open questions

### OQ-1 — What is the fixed role vocabulary?

If a `role` field is introduced, what is the controlled vocabulary? The recommendation implies a small closed set (e.g., `orchestrator | specialist | shell | validator | writer | utility`), but this vocabulary was not validated against the full ~159-entry corpus. The hybrid agents named by the inventory (pipeline, start, interviewer-kits, vault-metadata-curator, planner, brownfield-translation, autonomous, readiness-gate) are exactly the agents that break single-role assignment [cross-cutting 1 in findings]. The vocabulary must treat orchestrators as a first-class shape.

**Dependent decision.** Any `role` frontmatter field in any agent/skill file cannot be introduced before this vocabulary is validated against the corpus. Introducing the field with free-text and tightening later is an option, but creates the taxonomy-rot risk the adversarial lens names.

### OQ-2 — Should tool-surface tightening be gated on role rollout?

F5 finds that the tool-surface axis is currently vacuous because most agents declare the full tool set. If role rollout happens first and tool-surface is deferred, there is a risk that tightening declared tools requires revisiting all ~159 agents twice — once for role, once for tool-surface. The question is whether a combined single-pass migration (role + tool-surface tightening together) is cheaper at the ~159 scale than two sequential passes.

**Dependency.** Cannot be answered until OQ-1's role vocabulary is settled and a pilot set of agents has been role-labeled to measure actual per-agent overhead.

### OQ-3 — Is per-new-agent meta-overhead an acceptable marginal cost?

The adversarial null's strongest per-entry argument is that every new agent added after categorization is introduced bears the overhead of role assignment, plus potential taxonomy-rot if the vocabulary shifts [research §Agent 5]. At the current growth rate (no data on rate, only on current size) and at ~159 entries, the corpus is at the adversarial threshold [F3]. If growth is rapid, overhead compounds. If growth is slow, the one-time migration cost dominates. The marginal cost of categorization is not negligible and should be weighed against the offline governance benefit only when tooling that consumes categories is confirmed.

### OQ-4 — What tooling will consume the categories?

T3 establishes that categorization cannot improve LLM-layer dispatch (description is already the signal). Categories pay rent only for governance gates, telemetry aggregation, and onboarding navigation [T3]. None of those tooling surfaces currently exist in the corpus. If no tooling is planned, the null hypothesis (A-2) is the correct answer and this discovery's recommendation is premature. The decision to adopt categorization should be conditional on identifying at least one concrete tooling consumer.

---

## Migration sketch

If adoption is confirmed, the migration is bounded and mechanical. This is a sketch; the binding implementation-plan is downstream.

**Scope.** ~46 agents + ~113 skills = ~159 file touches. Each touch adds a `role` field to the frontmatter. No existing fields removed.

**Hybrid agents requiring canonical-role-by-rule.** The following ~8 agents span multiple role buckets and require a resolution rule before migration, not just a field addition [cross-cutting 1 in findings]:

- `pipeline` (orchestrator + specialist depending on step)
- `start` (orchestrator + shell)
- `interviewer-kits` (specialist + orchestrator)
- `vault-metadata-curator` (specialist + writer)
- `planner` (orchestrator + synthesizer)
- `brownfield-translation` (specialist + writer)
- `autonomous` (orchestrator + executor)
- `readiness-gate` (validator + orchestrator)

Resolution rule options: (a) assign primary role, note secondary in description; (b) allow multi-value role field; (c) split hybrid agents into composable units. Option (a) is least disruptive; option (c) is architecturally cleanest but involves non-trivial restructuring.

**Sequencing.** Role field first (addresses OQ-1, covers routing failure). Tool-surface tightening second, only after role rollout is stable and a decision on OQ-2 is made. Domain field optional third pass.

**Tooling gate.** Per OQ-4, migration should not begin before at least one tooling consumer (telemetry aggregation or governance gate) is identified and planned.

---

## Counter-position (adversarial null)

The adversarial null survives. Categories pay rent only offline and only if tooling consumes them. The platform (Claude Code) dispatches by description-matching, not by frontmatter category — adding `role: orchestrator` does not improve routing at runtime [T3]. The prefix taxonomy (`domainspec-*`, `gsd-*`, `gitnexus-*`) already answers the first routing question without frontmatter schema [T2].

The null fails under two conditions (per the adversarial lens itself): (1) corpus exceeds ~150–200 entries with no prefix differentiation, and (2) at least one offline tooling consumer (governance, telemetry, onboarding) is confirmed and has no viable alternative. At ~159 entries, condition 1 is met. Condition 2 is unconfirmed. The null is weakened but not defeated [F3].

A maintainer who adopts categorization without satisfying condition 2 accepts real migration overhead (~159 file touches, hybrid-agent resolution, ongoing per-entry overhead) in exchange for a benefit that is currently theoretical. The adversarial position is the correct frame for that tradeoff.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [../../../docs/features/agent-skill-categorization/research/domainspec-subagents-findings.md](../../../docs/features/agent-skill-categorization/research/domainspec-subagents-findings.md) | `derives-from` | The parent-synthesis findings file this discovery synthesizes. All load-bearing claims (F1–F5, T1–T3) trace to numbered items in that file. |
| [../../../docs/features/agent-skill-categorization/research/domainspec-subagents-research.md](../../../docs/features/agent-skill-categorization/research/domainspec-subagents-research.md) | `evidences` | Raw per-agent findings (L1-A1 through L1-A5) that the findings file cites; cited transitively for evidence chains. |
| [../../snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml](../../snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml) | `derives-from` | Frozen dispatch spec (spec_hash `3b1e8284548be3e3ba43c97ad721c787b87ff75f27943e9305f54be3589427c5`) under which the five L1 agents and parent synthesis ran. |
| [../../constitution/domainspec-subagents-strategy-constitution.md](../../constitution/domainspec-subagents-strategy-constitution.md) | `governed-by` | The dispatch lifecycle that produced this discovery is governed by the subagents-strategy constitution (R15, R16, R17, R18, R21, R22, R23). |

---

## Source dispatch

- **Dispatch slug:** `2026-05-18-agent-skill-categorization-001`
- **Mode:** robot-talks / parent-synthesis (5 L1 parallel + L2 parent synth)
- **Spec file:** `vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml`
- **Spec hash:** `3b1e8284548be3e3ba43c97ad721c787b87ff75f27943e9305f54be3589427c5`
- **Corpus hash at emit:** `58af094d89ce121cade1dac1459e32f63481967e2bcda7ae8ff046e2d12eccbf`
- **Findings file:** `docs/features/agent-skill-categorization/research/domainspec-subagents-findings.md`
- **Research file:** `docs/features/agent-skill-categorization/research/domainspec-subagents-research.md`
- **Telemetry:** `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` @ event `subagent-strategy.dispatched`
