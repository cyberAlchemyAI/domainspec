---
tags: [subagents, dispatch-artifact, subagents-findings, agent-skill-categorization]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-18
dispatch_slug: agent-skill-categorization
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `agent-skill-categorization`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** (metadata) → **Findings** (summary + implications) → **Analysis** (tensions + cross-cutting). Section order is mandatory per R16. Every load-bearing claim in Findings and Analysis MUST cite a passage in `domainspec-subagents-research.md` per R17.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../vault/constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

A maintainer has ~80+ agents/skills under `.claude/` with implicit prefix grouping (`domainspec-*`, `gsd-*`, `gitnexus-*`) and asked whether explicit categorization is worth introducing. No prior discovery exists. Lens 4 was added explicitly to force the question of which decision the taxonomy must serve.

## Goal

Determine the optimal categorization scheme (or null hypothesis) for the agent/skill corpus, with as-is gap, migration cost, and an honest counter-position.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**Mode:** `robot-talks` (parent-synthesis heuristic_row)

**Amendment:** R15 correction logged for working_folder (vault→docs/features).

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|---|---|---|---|---|
| L1-A1-external-literature | sonnet | Web survey across 6+ frameworks; synthesis not deep reasoning. | 8000 | Comparison table + recurring-axes list + URLs |
| L1-A2-weights-taxonomy | sonnet | Conceptual taxonomy reasoning, no tools. | 6000 | Per-axis pros/cons table + opinionated recommendation |
| L1-A3-repo-asis | sonnet | Mechanical inventory + light NLP. | 6000 | Three counts + hybrid list + as-is description |
| L1-A4-decision-framing | sonnet | Opinion-forcing reasoning. | 5000 | Per-decision table + single pick |
| L1-A5-adversarial-null | sonnet | Adversarial steelman. | 5000 | Five-point steelman + threshold conditions |
| L2-A1-parent-synth | parent | Synthesize layer must be parent per skill invariant. | n/a | Synthesis |

**Sequencing:** L1 parallel set (5 agents in one dispatch message), then L2 parent synthesis.

**Recursion budget actually used:** depth = 2, breadth = 5, total agents = 5 (within 10 cap per R13 defaults).

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|---|---|---|---|
| L1-A1-external-literature | unknown | unknown | unknown |
| L1-A2-weights-taxonomy | unknown | unknown | unknown |
| L1-A3-repo-asis | unknown | unknown | unknown |
| L1-A4-decision-framing | unknown | unknown | unknown |
| L1-A5-adversarial-null | unknown | unknown | unknown |
| L2-A1-parent-synth | unknown | unknown | unknown |
| **Sum** | unknown | unknown | unknown |

**Telemetry emitted:** yes (`internal_tools/vault_telemetry/events/subagent-strategy.jsonl`).

**Dispatch spec:**
- spec: `vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml`
- spec_hash: `3b1e8284548be3e3ba43c97ad721c787b87ff75f27943e9305f54be3589427c5`
- corpus_hash_at_emit: `58af094d89ce121cade1dac1459e32f63481967e2bcda7ae8ff046e2d12eccbf`

**Four-component grade** *(R21; judgments marked per R22):*

| Component | Score (0–1) | Note |
|---|---|---|
| Coverage | 0.9 (judgment) | All 5 angles addressed (literature, taxonomy weights, as-is inventory, decision framing, adversarial null); no angle left unexamined. |
| Independence | 0.9 (judgment) | Adversarial lens (L1-A5) deliberately opposed the other four; no premature convergence observed across lenses. |
| Fidelity | 0.85 (judgment) | Sources cited (Agent 1 URLs verifiable); Agent 3 file inventory mechanically verifiable against repo; abstract lenses (A2, A4, A5) inherently softer to trace. |
| Cost discipline | 0.8 | Declared budgets honored qualitatively; per-child token spend not captured by harness in this dispatch. |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost discipline is mechanical.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in `domainspec-subagents-research.md` (R17).

### F1 — Frameworks converge on 5 recurring axes; none impose a single hierarchy

- **Claim:** AutoGen, CrewAI, LangGraph, OpenAI SDK, Anthropic, Semantic Kernel, and MoE literature all converge on role, tool-surface, capability/domain, lifecycle, and hierarchy-level as the recurring categorization axes; no framework imposes a single load-bearing axis — faceted or positional categorization dominates.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--external-literature-survey-across-agentic-frameworks) — Recurring Axes section, and the Notable Divergence paragraph noting that "No framework imposes a single load-bearing axis."
- **Implication:** Any taxonomy for this repo should be faceted (multiple orthogonal frontmatter fields) rather than a single hierarchy; choosing a single axis is a conscious narrowing, not a universal best practice.

### F2 — Tool-surface is most load-bearing in the abstract; role is most load-bearing for the runtime failure that exists today

- **Claim:** From first principles, blast-radius is the only axis with non-negotiable operational consequences; but the specific failure the maintainer faces today — silent runtime mis-routing producing wrong output — is best addressed by a role axis.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--weights-only-taxonomy-of-candidate-axes) — "Most Load-Bearing Axis: Tool-Surface / Blast-Radius" section; [`domainspec-subagents-research.md` §Agent 4](./domainspec-subagents-research.md#agent-4--decision-framing-across-candidate-uses-for-a-taxonomy) — "If Forced to Pick ONE" section, which names routing as the failure "that fires at runtime and silently produces wrong output."
- **Implication:** Both axes are needed, but role pays rent first if the maintainer optimizes for the active routing failure; tool-surface is a latent governance asset to layer on afterward.

### F3 — The corpus is at the edge of the adversarial threshold

- **Claim:** ~46 agents + ~113 distinct skills ≈ 159 entries; the adversarial lens names ">150–200" as the threshold at which the null hypothesis fails, placing the corpus squarely at the edge.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--repo-as-is-inventory-of-agents-and-skills) — Section 1 totals (46 agents, ~113 SKILL.md entry-points); [`domainspec-subagents-research.md` §Agent 5](./domainspec-subagents-research.md#agent-5--adversarial-steelman-against-categorization) — "When Categorization Does Win," condition 1: "Corpus > 150–200 agents with no prefix differentiation."
- **Implication:** A "do nothing" decision is no longer obviously cheap; categorization is at least debatable on size grounds alone, independent of any other argument.

### F4 — Implicit taxonomy is already 3-dimensional (system × stage × abstraction)

- **Claim:** Prefix grouping (system), lifecycle verb (stage), and shell-vs-orchestrator-vs-specialist (abstraction) already form three orthogonal de-facto dimensions in the corpus; the implicit taxonomy is a matrix, not a flat list.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--repo-as-is-inventory-of-agents-and-skills) — Section 4 "As-Is Implicit Taxonomy," which describes the corpus as clustering on "three orthogonal dimensions" (system × stage × abstraction).
- **Implication:** A new scheme that ignores these dimensions will fight the corpus. Any explicit taxonomy should formalize what is already there, not invent new axes; the bridge skills (execute-phase-bridge, plan-phase-bridge, ui-phase-bridge) are evidence that the seams between dimensions are already load-bearing.

### F5 — Tool-surface axis would be vacuous today

- **Claim:** Most agents declare the full tool set (Bash, Read, Edit, Write, ...), so the as-is tool-surface axis has near-zero discriminating power in its current state.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--repo-as-is-inventory-of-agents-and-skills) — Table C note: "Most agents declare the full tool set, making read-only vs edit-capable a behavioral distinction rather than mechanically enforced."
- **Implication:** Introducing tool-surface as a frontmatter axis requires also tightening declared tools per agent — a migration larger than the field addition alone. The governance benefit of tool-surface categorization is currently latent, not immediately realizable.

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in `domainspec-subagents-research.md` (R17).

### T1 — Abstract-optimal axis vs runtime-optimal axis

- **Held by Agent 2:** Blast-radius / tool-surface is the most load-bearing axis because miscategorization corrupts production state — the only question with non-negotiable operational consequences.
- **Reality in Agent 4:** Today's actual failure is silent mis-routing that produces wrong-shaped output downstream; that failure responds to role, not blast-radius.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--weights-only-taxonomy-of-candidate-axes) — "Most Load-Bearing Axis" section; [`domainspec-subagents-research.md` §Agent 4](./domainspec-subagents-research.md#agent-4--decision-framing-across-candidate-uses-for-a-taxonomy) — "If Forced to Pick ONE" section.
- **Impact:** The "best axis in the abstract" answer disagrees with the "best axis for the failure you have today" answer. A maintainer who picks tool-surface first optimizes for a failure that isn't biting; a maintainer who picks role first leaves governance under-served. Resolution: faceted scheme with role as primary (today's pain) and tool-surface as secondary (latent governance asset).

### T2 — Prefix is a working taxonomy vs prefix is one dimension of three

- **Held by Agent 5:** Prefix grouping IS a flat taxonomy and it works — `domainspec-*`, `gsd-*`, `gitnexus-*` answer the first routing question without a single line of frontmatter, and adding category layers creates two competing taxonomies.
- **Reality in Agent 3:** Prefix is the SYSTEM dimension only; stage and abstraction are co-equal orthogonal dimensions already present in the corpus and not captured by prefix at all.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 5](./domainspec-subagents-research.md#agent-5--adversarial-steelman-against-categorization) — "Prefix-as-Tag is Already a Flat Taxonomy" section; [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--repo-as-is-inventory-of-agents-and-skills) — Section 4 identifying three dimensions, of which prefix covers only one.
- **Impact:** The adversarial null is partially correct (prefix works for system-level routing) and partially wrong (it does not help with stage or abstraction). A faceted scheme can preserve prefix as the system dimension and add the missing facets — role and abstraction-level — without overruling it or creating a competing authority.

### T3 — Platform is flat (Anthropic dispatches by description) vs maintainer needs structure for human governance

- **Held by Agent 5:** Claude Code dispatches skills via description matching at the LLM layer; the model does not traverse a tree; adding `category: orchestration` in frontmatter does not improve runtime routing.
- **Reality in Agent 1:** This is consistent with Claude Code's actual model, but other frameworks (LangGraph, AutoGen) do encode hierarchy structurally and prevent failures that the description-match model cannot prevent; the platform argument cuts against runtime-routing categorization but is silent on governance, telemetry, and onboarding.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 5](./domainspec-subagents-research.md#agent-5--adversarial-steelman-against-categorization) — "The Platform is Flat" section; [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--external-literature-survey-across-agentic-frameworks) — LangGraph row (hierarchy-level structurally enforced) and Anthropic Claude Code row (flat filesystem, no enforced taxonomy).
- **Impact:** The platform argument does not defeat categorization; it narrows its scope. Categories cannot improve LLM-layer dispatch (the description is already the signal) but can pay rent for offline uses: governance gates, telemetry aggregation, onboarding navigation — all of which run outside the dispatch path.

### Cross-cutting observations

1. The hybrid agents named by Agent 3 (pipeline, start, interviewer-kits, vault-metadata-curator, planner, brownfield-translation, autonomous, readiness-gate) are exactly the agents that break a single-axis scheme — and they are disproportionately the orchestrators ([research §Agent 3](./domainspec-subagents-research.md#agent-3--repo-as-is-inventory-of-agents-and-skills), Section 3). The taxonomy must treat orchestrators as a first-class shape, not a hybrid edge case. This aligns with LangGraph's supervisor/worker split ([research §Agent 1](./domainspec-subagents-research.md#agent-1--external-literature-survey-across-agentic-frameworks)).

2. The corpus size (~159 entries) sits exactly at the threshold the adversarial lens names ([research §Agent 5](./domainspec-subagents-research.md#agent-5--adversarial-steelman-against-categorization), "When Categorization Does Win"). The decision is not "should we ever categorize" but "is the marginal entry tipping us over now." At the current growth rate, inaction is a decision with a visible expiry date.

3. The decision-framing exercise ([research §Agent 4](./domainspec-subagents-research.md#agent-4--decision-framing-across-candidate-uses-for-a-taxonomy)) revealed that no single decision dominates: routing wants role, discoverability wants domain, governance wants tool-surface, telemetry wants invocation-pattern, onboarding wants lifecycle. This is structural evidence for a faceted scheme — any single-axis answer solves one column of that table and leaves five partially unsolved.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [./domainspec-subagents-research.md](./domainspec-subagents-research.md) | `evidences` | Raw per-agent findings that all Findings and Analysis claims in this file cite. |
| [../../../../vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml](../../../../vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml) | `derived-from` | Dispatch spec that authorized the fan-out; amended for R15 (working folder outside vault). |
