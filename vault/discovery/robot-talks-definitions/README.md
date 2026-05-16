---
tags: [vault, robot-talks, readme]
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

# robot-talks-definitions

## What is this?

Discovery folder consolidating *what robot-talks is*, *how it relates to `domainspec-subagents-strategy`*, and *which decisions govern its use*. Sits one layer above `vault/premise/robot-talks-premises.md` and one layer below `vault/constitution/robot-talks-constitution.md`.

## Business Context

Robot-talks has existed since 2026-04-10 as a premise file plus a constitution but had no discovery layer above it. The 2026-05-02 redesign of `domainspec-subagents-strategy` reframed robot-talks as one of five operational dispatch modes (`single | task-fan-out | robot-talks | sequential | mixed`). The shared rules (scope-decomposition, capability-tier, dispatch lifecycle) live upstream in `domainspec-subagents-strategy`; the mode-specific rules (declared per-turn perspective, tension-not-aggregation synthesis, evidence-vs-concern overlap) live here.

## Why it matters

Without this discovery, robot-talks looked like a peer concept rather than a mode — which silently invited duplicate rules, missed audit deflection, and the schema mislabel (`operationalized-by` used where `codified-as` belongs) noted in OQ-1. This folder establishes that **robot-talks is a mode of domainspec-subagents-strategy** and records seven decisions (D-1 through D-7) and four open questions (OQ-1 through OQ-4) that govern how robot-talks is invoked, authored, and audited.

## 📁 Navigation

- [robot-talks.md](robot-talks.md) — Discovery: consolidates the rules of robot-talks at the discovery layer; defines it as a dispatch mode, names the schema chain, records D-1 through D-7 and OQ-1 through OQ-4. Status: draft.
- [examples/robots-discussing.md](examples/robots-discussing.md) — Canonical example artifact (`node_type: discussion`, `mode: robot-talks`) produced by a robot-talks dispatch in practice. Turn 3.5 surfaced the governance recursion captured here as OQ-2.

## Status

`robot-talks.md` is `status: draft`, `veracidade: medium`, `convicção: high`. The decisions are written and internally consistent; no audit pass has been performed against the broader corpus, and the four open questions below remain unresolved. The premise file carries known schema errors that this discovery flags but deliberately does not fix — the recovery sweep is a separate dispatch.

This folder represents current thinking at the discovery layer, not settled rules. The constitution at `vault/constitution/robot-talks-constitution.md` is the active enforceable artifact.

## Blockers / Open Questions

- **[OQ-1](robot-talks.md#oq-1--schema-errors-in-robot-talks-premisesmd-await-a-recovery-sweep)** — Schema errors in `robot-talks-premises.md` await a recovery sweep (mislabeled `operationalized-by` on line 202; broken path reference on line 26).
- **[OQ-2](robot-talks.md#oq-2--can-a-robot-talks-discussion-ship-decisions-while-its-governing-premises-are-flagged-broken)** — Governance recursion: can a robot-talks discussion ship decisions while its governing premises are flagged broken? Recommendation pending user ratification.
- **[OQ-3](robot-talks.md#oq-3--heartbeat--partial-synthesis-enforcement)** — Heartbeat / partial-synthesis enforcement (R7's 30-minute timeout) is orchestrator discipline, not harness-enforced.
- **[OQ-4](robot-talks.md#oq-4--cross-cutting-does-robot-talks-bind-to-its-governing-constitution-at-strategy-declaration-time-or-at-dispatch-time)** — Does a strategy bind to the constitution version at authoring time or at dispatch time?

## How to Read This Folder

Read `robot-talks.md` first, linearly. The Definitions / Glossary section establishes every term used downstream. Decisions D-1 through D-7 are the load-bearing content; Alternatives Considered explains rejections; Open Questions enumerate what is unresolved.

After that, read `vault/premise/robot-talks-premises.md` to see the working bets (P-RT-1 through P-RT-8) — keeping OQ-1's schema errors in mind. Finally, read `vault/constitution/robot-talks-constitution.md` for the enforceable rules. For the mode in actual use, [examples/robots-discussing.md](examples/robots-discussing.md) is the canonical example and the source of OQ-2.

Do not look here for the rules themselves — look here for the reasoning behind them.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../premise/robot-talks-premises.md](../../premise/robot-talks-premises.md) | `derives-from` | The premise file (P-RT-1 through P-RT-8). Known schema errors tracked here as OQ-1; this discovery does not modify it. |
| [../../constitution/robot-talks-constitution.md](../../constitution/robot-talks-constitution.md) | `codifies` | The enforceable rule set (PM-1 through PM-8 plus R1–R7). |
| [../domainspec-strategy-definitions/subagents-strategy.md](../domainspec-strategy-definitions/subagents-strategy.md) | `mode-of` | Upstream parent concept. D-4 names robot-talks as one of five dispatch modes; this discovery extends D-4. |
| [examples/robots-discussing.md](examples/robots-discussing.md) | `exemplified-by` | Canonical example artifact produced by a robot-talks dispatch. |
