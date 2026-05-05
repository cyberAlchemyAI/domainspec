---
tags: [vault, domainspec-subagents-strategy, dispatch, orchestration, readme]
node_type: readme
is_session: false
layer: ontology
scope: ontology
domain: dispatch, governance
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-02
---

# domainspec-subagents-strategy-definitions — Navigation README

This folder holds the discovery layer for **domainspec-subagents-strategy** — the orchestration concept that governs when, how, and with what capability tier subagents are dispatched anywhere in the project. It sits one layer above `vault/premise/domainspec-subagents-strategy-premises.md` and one layer below the (forthcoming) `vault/constitution/domainspec-subagents-strategy-constitution.md` and `domainspec-subagents-strategy` skill. If you want to understand *why* dispatch discipline exists and *how* it relates to robot-talks (one mode of it), this is the right starting point.

This folder was split out of `vault/discovery/domainspec-vault-foundations/` on 2026-05-02. Subagents-strategy is not a structural foundation of the vault itself — it runs **on top of** the vault. Vault-foundations now holds only true vault structure (epistemic chain, classification axes); orchestration concepts live as siblings.

---

## The Discovery

### Subagents-strategy (`domainspec-subagents-strategy.md`)

Subagent invocation was recurring in feature work with no foundational treatment in axioms, premises, constitutions, or skills. This discovery records the design decisions behind domainspec-subagents-strategy: the cross-cutting discipline for dispatching subagents, which **capability tier** to use (`mechanical / synthesis / judgment` — LLM-agnostic, with tier→model as configuration), and how the dispatch discipline relates to existing governance. It locks in the premise set already written, names rejected alternatives, and enumerates open questions that must resolve before the constitution and skill can be drafted.

**Subagents-strategy is the parent concept; robot-talks is one mode of it.** D-4 of this discovery names five operational dispatch modes (`single | task-fan-out | robot-talks | sequential | mixed`). The shared rules — scope-decomposition, capability-tier selection, dispatch lifecycle, briefing contract, three-file output set — live here. The mode-specific rules for robot-talks (declared per-turn perspective, tension-not-aggregation synthesis) live in `vault/discovery/robot-talks-definitions/`.

**Subagents-strategy is a tool, not a drift-convergence pipeline stage.** The drift-convergence pipeline (`research → analyze → summarize → discovery → plan → spec → ...`, see [TUNING-LOOP.md](../../../TUNING-LOOP.md)) has its own upstream stages; domainspec-subagents-strategy is the **mechanism** that may execute the `research / analyze / summarize` stages efficiently when parallel dispatch is warranted. A non-trivial dispatch produces a three-file `/research/` output set (process record + raw evidence + findings-with-analysis — see D-11).

---

## File Map

| File | Type | Purpose | Status |
|---|---|---|---|
| [domainspec-subagents-strategy.md](domainspec-subagents-strategy.md) | discovery | Decisions and open questions for the domainspec-subagents-strategy governance concept (renamed from agents-strategy 2026-05-02; moved out of domainspec-vault-foundations/ 2026-05-02) | draft — Phase 2 recovery applied; remaining OQs open |
| [research/agents-strategy-prior-version.md](research/agents-strategy-prior-version.md) | historical | **SUPERSEDED** prior version; merged into `domainspec-subagents-strategy.md` 2026-05-02. Kept for audit trail. | superseded |

---

## Status

`domainspec-subagents-strategy.md` is `status: draft`. The premise set is written; the discovery has been merged from two duplicates and redesigned (capability tiers, three-file output set, operational mode definitions, and lifecycle section landed in the 2026-05-02 recovery). The constitution and skill are deferred until the remaining open questions resolve. See [vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md](../../sessions/2026-05-02-1711-subagents-strategy-redesign.md) and [vault/sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md](../../sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md) for the execution log.

This folder represents current thinking at the discovery layer, not settled rules. The constitution and skill — when drafted — are the active enforceable artifacts; this discovery is the layer that explains *why* those rules will hold.

---

## Connections

- **[vault/premise/domainspec-subagents-strategy-premises.md](../../premise/domainspec-subagents-strategy-premises.md)** — the premise file (P-SS-1 through P-SS-11) that this discovery `derives-from`. Renamed from `agent-dispatch-premises.md`; `P-AD-*` IDs swept to `P-SS-*` in the 2026-05-02 redesign.
- **[vault/discovery/robot-talks-definitions/](../robot-talks-definitions/)** — discovery layer for the robot-talks dispatch mode. Robot-talks is *mode-of* domainspec-subagents-strategy (per D-4); this folder holds the parent concept, that folder holds the mode-specific rules.
- **[vault/discovery/domainspec-vault-foundations/](../domainspec-vault-foundations/)** — the vault's structural foundations (epistemic chain, classification axes). Subagents-strategy was split out of domainspec-vault-foundations on 2026-05-02 because dispatch governance is application-level, not structural.
- **[vault/ontology-conventions.md](../../ontology-conventions.md)** — defines `node_type` values including `domainspec-subagents-strategy`, `research`, and `findings`. This discovery's D-11 specifies how those three node types are produced and connected by a dispatch.
- **[TUNING-LOOP.md](../../../TUNING-LOOP.md)** — defines the drift-convergence pipeline. D-12 of this discovery clarifies that domainspec-subagents-strategy is a **tool** that may execute the upstream stages, not itself a pipeline stage.
- **[../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md)** — `modified-by`. The 2026-05-03 cross-boundary-rule + edges-hygiene session renamed this folder from `domainspec-subagents-strategy-definitions/` to `domainspec-subagents-strategy-definitions/`; this README is the navigable file at the new path. (Format note: this README uses prose-bullet form pending canonicalization to the `## Connections` table per `vault/discovery/_backlog.md` F10.)

---

## How to Read This Folder

Read `domainspec-subagents-strategy.md` linearly on first encounter. Decisions D-1 through D-12 are the load-bearing content; Alternatives Considered explains what was rejected and why; Open Questions enumerates what is still unresolved. Do **not** read `research/agents-strategy-prior-version.md` — it is superseded; it exists only for historical audit.

After that, read `vault/premise/domainspec-subagents-strategy-premises.md` to see the working bets (P-SS-1 through P-SS-11) this discovery consolidates. If you want to see one mode in detail, read `vault/discovery/robot-talks-definitions/robot-talks.md` next.

Do not look here for the rules themselves — look here for the reasoning behind them. The rules will live in the (forthcoming) constitution and skill.
