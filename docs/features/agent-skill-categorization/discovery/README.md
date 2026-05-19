---
tags: [agent-skill-categorization, architecture, agents, skills, taxonomy, migration, rollout]
node_type: discovery
is_session: false
layer: architecture, application
nature: explanatory, procedural
status: exploratory
version: 0.1.0
last_updated: 2026-05-19
---

# Agent-Skill Categorization — Rollout Discovery (This Repo)

> This discovery captures the operational decisions for introducing explicit categorization into the `.claude/agents/` and skills corpus of the domainspec repo specifically. It is application-scope: claims live or die with this repo's actual rollout. Abstract framework knowledge belongs in `vault/discovery/agent-skill-categorization/`. The findings that produced this document are at `docs/features/agent-skill-categorization/research/domainspec-subagents-findings.md`.

---

## Context

The domainspec repo currently holds approximately 46 agent files (`*.agent.md`) and ~113 skill SKILL.md entry-points, totalling ~159 entries [F3]. Grouping today is prefix-only: `domainspec-*`, `gsd-*`, `gitnexus-*` handle the system dimension, but the stage and abstraction dimensions are implicit [F4]. No frontmatter field encodes role, tool-surface, lifecycle stage, or invocation pattern.

The dispatch that produced this discovery was authorized by a user who was deciding whether explicit categorization is worth introducing — or whether the null hypothesis (prefix-only grouping is sufficient) still holds. A five-lens investigation (external literature, abstract taxonomy weights, repo inventory, decision framing, adversarial null) was run. The synthesis conclusion: categorization is no longer clearly deferrable at ~159 entries [F3], the active runtime failure (silent mis-routing producing wrong-shaped output) responds to a `role:` axis first [F2], and tool-surface tightening is a governance asset worth pursuing separately in a later phase [F5].

The corpus sits exactly at the adversarial threshold named by the null-hypothesis lens: ">150–200 agents with no prefix differentiation" [F3]. Inaction is a decision with a visible expiry date as the corpus grows.

---

## Decisions taken

No decisions are formally locked as of this writing. The dispatch produced a recommended rollout shape (see Proposed Rollout below), but the four decision points in that section remain open for the user to resolve before any file is touched. This discovery records the recommended positions and their rationale; formal lock-in happens when the user confirms them.

---

## Proposed Rollout — Four Phases

### Phase 1 — Add `role:` frontmatter to all agent files (~46 touches)

Add a single `role:` field to every `.claude/agents/*.agent.md` file. No skill files are touched in this phase.

**Rationale.** The active failure is silent mis-routing at the LLM dispatch layer — an orchestrator calling the wrong specialist and producing wrong-shaped output downstream [F2, T1]. A `role:` field in agent frontmatter gives every governance audit, telemetry aggregator, and human reviewer a machine-readable routing signal. The platform (Claude Code) does not read frontmatter at runtime, but offline consumers — governance gates, `vault_telemetry`, onboarding docs — can [T3].

**Migration cost.** ~46 frontmatter touches. No logic changes. Each touch is a two-line YAML addition. Estimated effort: low.

**Blocker.** The `role:` vocabulary must be decided before any files are touched (see Decision Point DP-1 below).

### Phase 2 — Define canonical role vocabulary

Establish the closed or semi-closed vocabulary for the `role:` field. Candidate values from the findings:

| Candidate role | Agents that would carry it (examples) |
|---|---|
| `orchestrator` | pipeline, autonomous, planner |
| `researcher` | domainspec-subagents-strategy, robot-talks |
| `planner` | planner, readiness-gate |
| `implementer` | brownfield-translation, gitnexus-refactoring |
| `verifier` | readiness-gate, validator roles |
| `writer` | discovery-writer, findings-writer |
| `bridge` | execute-phase-bridge, plan-phase-bridge, ui-phase-bridge |

The 8 named hybrid agents identified in the findings — pipeline, start, interviewer-kits, vault-metadata-curator, planner, brownfield-translation, autonomous, readiness-gate [F4, cross-cutting 1] — are disproportionately orchestrators. The taxonomy must treat orchestrator as a first-class shape, not a hybrid edge case [F4].

**Blocker.** OQ-1 (closed vs free-text) must be resolved here.

### Phase 3 — Apply role to hybrid agents by rule

The 8 hybrid agents require explicit handling — they do not fit cleanly into a single role [F4]. The recommended approach: assign `role: orchestrator` to agents whose primary function is dispatching other agents, and use `role: bridge` only for agents whose explicit function is seam-crossing (the three bridge skill-wrappers). Do not invent a `hybrid` catch-all value.

**Rationale.** A `hybrid` catch-all collapses the discriminating power of the axis. If the maintainer cannot assign a single primary role to an agent, that is a signal the agent should be split or the vocabulary extended — not that a null-role label is appropriate [T1, F2].

### Phase 4 — Add `tool-surface:` field AND tighten declared tools (deferred)

Introduce a `tool-surface: read-only | read-write | shell | read-write-shell` field AND simultaneously narrow the `tools:` list in each agent to the minimum actually required.

**Why deferred.** Today the tool-surface axis has near-zero discriminating power: most agents declare the full tool set, making read-only vs edit-capable a behavioral distinction rather than a mechanically enforced one [F5]. Adding a `tool-surface:` field without tightening declared tools produces a lie-by-frontmatter: the field says `read-only` but the agent has Write and Bash access. The two changes must be coupled [F5, T1].

**Migration cost.** ~159 frontmatter touches (agents + skills) plus per-agent tool-list review and tightening. Estimated effort: high. Each agent requires a judgment call about which tools it actually needs.

---

## Decision Points to Resolve Before Rollout

### DP-1 — Role vocabulary: closed enum vs free-text (maps to OQ-1)

**Options:**

- **Closed enum** (7–10 values, enforced by CI lint): consistent, machine-readable, enables aggregation. Risk: forces premature closure; hybrids become unclassifiable.
- **Semi-closed** (recommended values in docs, but no lint enforcement): easy to start, degrades into free-text over time.
- **Free-text**: zero friction to assign, zero value for aggregation.

**Recommended position.** Start semi-closed with a documented vocabulary (this document's Phase 2 table) and add a lint only after the first full pass reveals which values are missing. Do not invest in a lint before the vocabulary is empirically validated against the actual corpus.

### DP-2 — Frontmatter location: agents only, or skills too?

**Options:**

- **Agents only (Phase 1–3)**: lower migration cost (~46 touches), targets the routing failure directly.
- **Agents + skills (combined)**: complete coverage, but skills are invoked differently — the LLM reads their descriptions, not their frontmatter, and skills do not participate in the routing failure that motivates Phase 1.

**Recommended position.** Agents only for Phase 1–3. Skills can receive a `role:` field in a follow-on pass, governed separately after the agent vocabulary is stable.

### DP-3 — Bridge skills: separate role or hybrid?

The three bridge skills (execute-phase-bridge, plan-phase-bridge, ui-phase-bridge) were identified as seam-crossing wrappers [F4]. Their function is structural: they allow the dispatch layer to cross a phase boundary without the orchestrator holding state.

**Options:**

- **`role: bridge`** as a first-class value in the vocabulary.
- Absorb under `orchestrator` (they orchestrate the phase transition).
- Absorb under `implementer` (they trigger implementation-phase actions).

**Recommended position.** `role: bridge` as a first-class value. The seam-crossing function is sufficiently distinct from orchestration and implementation that losing it in the taxonomy destroys exactly the information the taxonomy is meant to preserve [F4, cross-cutting 1].

### DP-4 — Tool-surface tightening: same PR as Phase 4, or separate?

The tool-list tightening and the `tool-surface:` field addition must be coupled (see Phase 4). The question is whether they land in one PR or whether the field is added with a `pending-tightening` placeholder.

**Options:**

- **Coupled (recommended)**: one PR per agent that adds the field AND sets the correct tools list. Slower to ship, zero lies-by-frontmatter.
- **Field first, tighten later**: fast to ship, creates a window where the field is present but incorrect. Requires a follow-up lint to enforce correctness.

**Recommended position.** Coupled. The governance value of `tool-surface:` is precisely that it is machine-trustable; a known-incorrect field undermines the reason to add it.

---

## Migration Cost Estimate

| Phase | Scope | Touch count | Effort estimate |
|---|---|---|---|
| Phase 1 — `role:` on agents | 46 agent files | ~46 frontmatter additions | Low (2 lines per file) |
| Phase 2 — vocabulary definition | 0 file touches (doc only) | 0 | Low (vocabulary decision) |
| Phase 3 — hybrid agent assignment | 8 agents (subset of Phase 1) | Covered by Phase 1 count | Low (judgment calls within Phase 1) |
| Phase 4 — `tool-surface:` + tool tightening | ~159 files (agents + skills) | ~159 frontmatter additions + per-agent tool-list review | High |

**Total if Phase 4 is pursued:** ~159 file touches plus judgment-per-agent tool-list tightening. The tool-list tightening cannot be automated without reading each agent's actual behavior — this is a human review task [F5].

---

## Acceptance Criterion

The categorization rollout is "done" when ALL of the following hold:

1. Every agent file (`*.agent.md`) carries the `role:` field with a value from the agreed vocabulary.
2. At least one consumer of the `role:` field is operational — meaning one of: (a) the orchestrator routing logic reads `role:` to filter candidates, OR (b) a governance audit script aggregates by `role:`, OR (c) the telemetry aggregator emits per-role metrics. A field that no consumer reads is not done — it is documentation theater.
3. (Phase 4, if pursued) Every agent file carries a `tool-surface:` field AND the declared `tools:` list has been tightened to match.

---

## Open Questions

### OQ-1 — Role vocabulary: how many values, and who validates them?

Should the vocabulary be fixed by this discovery's Phase 2 table, or should it be validated empirically by running a first pass over all 46 agents and seeing which values are needed? The recommended position (semi-closed, lint deferred) defers this, but the question of who owns vocabulary extension requests is unresolved.

### OQ-2 — Where does the `role:` consumer live?

The acceptance criterion requires at least one consumer. The candidates are: orchestrator routing logic (runtime), governance audit script (offline), telemetry aggregator (`vault_telemetry`). Which is built first, and which team/agent owns it? Without a concrete answer, Phase 1 is a preparatory change with no guaranteed payoff date.

### OQ-3 — Does the skill corpus need `role:` at all?

Skills are invoked via description matching [T3]. The LLM does not consult frontmatter when picking a skill. If the only consumers of `role:` are offline (governance, telemetry, onboarding), do skills need it? The counter-argument: skills participate in the same onboarding discoverability problem as agents [cross-cutting 3]. Unresolved.

### OQ-4 — How do hybrid agents (Phase 3) degrade gracefully?

If the agreed vocabulary cannot assign a single primary role to one of the 8 named hybrids without loss of meaning, what is the protocol? Options: (a) extend the vocabulary, (b) allow multi-value `role:` (e.g., `role: [orchestrator, bridge]`), (c) split the agent into two. No policy exists today.

### OQ-5 — Knowledge-scope discovery at vault level

The vault folder `vault/discovery/agent-skill-categorization/` exists but contains only a `research/` subfolder — no knowledge-scope discovery node yet. If the abstract framework conclusions (faceted taxonomy, role-first, tool-surface-second) warrant codification as vault knowledge, a separate knowledge-scope discovery should be written there. That decision is separate from this application-scope document.

### OQ-6 — Telemetry attribution for Phase 1 changes

When Phase 1 lands, the `vault_telemetry` subsystem should start emitting per-role breakdowns. Is `vault_telemetry` ready to consume the new field, or does it require a schema update first? This is a sequencing dependency, not a design question, but it must be resolved before Phase 4 telemetry claims are made.

---

## Connections

| Document | Edge type | Description |
|---|---|---|
| [../research/domainspec-subagents-findings.md](../research/domainspec-subagents-findings.md) | `derived-from` | All F-numbered claims and T-numbered tensions in this document trace back to the findings synthesis. |
| [../research/domainspec-subagents-research.md](../research/domainspec-subagents-research.md) | `evidences` | Per-agent raw findings that the findings document cites; primary evidence chain. |
| [../../../../vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml](../../../../vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml) | `derived-from` | Dispatch spec that authorized the fan-out; R15 amendment logged (working folder outside vault). |
| [../../../../vault/discovery/agent-skill-categorization/](../../../../vault/discovery/agent-skill-categorization/) | `cross-references` | Knowledge-scope discovery folder for this topic (abstract framework conclusions). No discovery node exists there yet — see OQ-5. |

---

## Source Dispatch

**Findings source:** `docs/features/agent-skill-categorization/research/domainspec-subagents-findings.md`
**Dispatch spec:** `vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml`
**Dispatch ID:** `2026-05-18-agent-skill-categorization-001`
**Spec hash:** `3b1e8284548be3e3ba43c97ad721c787b87ff75f27943e9305f54be3589427c5`
**Promoted:** 2026-05-19 by `subagents-discovery-file-writer` agent, lifecycle step 7 (R6b), user-confirmed application scope.
