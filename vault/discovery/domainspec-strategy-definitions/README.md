---
tags: [vault, domainspec-subagents-strategy, dispatch, orchestration, readme]
node_type: readme
is_session: false
layer: ontology
scope: ontology
domain: dispatch, governance
nature: reference
status: draft
version: 0.1.1
last_updated: 2026-05-16
---

# domainspec-strategy-definitions

## What is this?

Discovery folder for **domainspec-subagents-strategy** — the orchestration concept governing when, how, and with what capability tier subagents are dispatched anywhere in the project. Sits one layer above `vault/premise/domainspec-subagents-strategy-premises.md` and one layer below the (forthcoming) `vault/constitution/domainspec-subagents-strategy-constitution.md` and `domainspec-subagents-strategy` skill.

## Business Context

This folder was split out of `vault/discovery/domainspec-vault-foundations/` on 2026-05-02. Subagents-strategy is not a structural foundation of the vault itself — it runs **on top of** the vault. Vault-foundations now holds only true vault structure (epistemic chain, classification axes); orchestration concepts live as siblings here.

**Subagents-strategy is the parent concept; robot-talks is one mode of it.** D-4 of the discovery names five operational dispatch modes (`single | task-fan-out | robot-talks | sequential | mixed`). The shared rules — scope-decomposition, capability-tier selection, dispatch lifecycle, briefing contract, three-file output set — live here. The mode-specific robot-talks rules live in `vault/discovery/robot-talks-definitions/`.

## Why it matters

Subagent invocation was recurring in feature work with no foundational treatment in axioms, premises, constitutions, or skills. Without this discovery, every feature reinvents dispatch discipline, capability-tier vocabulary drifts toward provider-specific model names (forbidden by the LLM-agnostic design rule), and the relation to robot-talks remains implicit. **Subagents-strategy is a tool, not a drift-convergence pipeline stage** — that distinction (D-12) is the load-bearing decision that keeps the TUNING-LOOP semantics clean.

## 📁 Navigation

- [subagents-strategy.md](subagents-strategy.md) — Discovery: decisions and open questions for the domainspec-subagents-strategy governance concept (renamed from agents-strategy 2026-05-02; moved out of domainspec-vault-foundations/ 2026-05-02). Status: draft — Phase 2 recovery applied; remaining OQs open.
- [research/agents-strategy-prior-version.md](research/agents-strategy-prior-version.md) — **SUPERSEDED** prior version; merged into `subagents-strategy.md` 2026-05-02. Kept for audit trail only.

## The Discovery

### Subagents-strategy (`subagents-strategy.md`)

Records the design decisions behind domainspec-subagents-strategy: the cross-cutting dispatch discipline, which **capability tier** to use (`mechanical / synthesis / judgment` — LLM-agnostic, with tier→model as configuration), and how the dispatch discipline relates to existing governance. Locks in the premise set already written, names rejected alternatives, and enumerates open questions that must resolve before the constitution and skill can be drafted.

A non-trivial dispatch produces a three-file `/research/` output set (process record + raw evidence + findings-with-analysis — see D-11).

## Status

`subagents-strategy.md` is `status: draft`. The premise set is written; the discovery has been merged from two duplicates and redesigned (capability tiers, three-file output set, operational mode definitions, lifecycle section). The constitution and skill are deferred until remaining open questions resolve. See [vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md](../../sessions/2026-05-02-1711-subagents-strategy-redesign.md) and [vault/sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md](../../sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md) for execution logs.

## How to Read This Folder

Read `subagents-strategy.md` linearly on first encounter. Decisions D-1 through D-12 are the load-bearing content; Alternatives Considered explains rejections; Open Questions enumerates what is still unresolved. Do **not** read `research/agents-strategy-prior-version.md` — it is superseded; it exists only for historical audit.

After that, read `vault/premise/domainspec-subagents-strategy-premises.md` for the working bets (P-SS-1 through P-SS-11). If you want one mode in detail, read `vault/discovery/robot-talks-definitions/robot-talks.md` next.

Do not look here for the rules themselves — look here for the reasoning behind them. The rules will live in the (forthcoming) constitution and skill.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../premise/domainspec-subagents-strategy-premises.md](../../premise/domainspec-subagents-strategy-premises.md) | `derives-from` | Premise file (P-SS-1 through P-SS-11). Renamed from `agent-dispatch-premises.md`. |
| [../robot-talks-definitions/](../robot-talks-definitions/) | `mode-of-this` | Robot-talks dispatch mode (per D-4). |
| [../domainspec-vault-foundations/](../domainspec-vault-foundations/) | `split-from` | Vault's structural foundations; subagents-strategy was split out 2026-05-02 because dispatch governance is application-level, not structural. |
| [../../ontology-conventions.md](../../ontology-conventions.md) | `cites` | Defines `node_type` values including `domainspec-subagents-strategy`, `research`, and `findings`. D-11 specifies how those are produced and connected by a dispatch. |
| [../../../TUNING-LOOP.md](../../../TUNING-LOOP.md) | `cites` | D-12 clarifies that domainspec-subagents-strategy is a **tool** that may execute upstream stages, not itself a pipeline stage. |
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | Session renamed folder; this README is the navigable file at the new path. |
