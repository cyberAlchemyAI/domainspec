---
tags: [vault, robot-talks, readme]
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

# robot-talks-definitions — Navigation README

This folder holds the discovery layer for the `robot-talks` dispatch mode. It consolidates *what robot-talks is*, *how it relates to `domainspec-subagents-strategy`*, and *which decisions govern its use* — sitting one layer above `vault/premise/robot-talks-premises.md` and one layer below `vault/constitution/robot-talks-constitution.md`. If you want to understand why robot-talks is a *mode* and not a sibling concept, this is the right starting point.

---

## The Discovery

### Robot-talks definitions (`robot-talks.md`)

Robot-talks has existed since 2026-04-10 as a premise file plus a constitution, but never had a discovery layer above it. The 2026-05-02 redesign of `domainspec-subagents-strategy` reframed robot-talks as one of five operational dispatch modes (`single | task-fan-out | robot-talks | sequential | mixed`) and surfaced three things at once: the missing discovery, a known schema mislabel in the premise file's connections table (`operationalized-by` used where `codified-as` belongs), and the implicit relationship between a robot-talks dispatch and the `node_type: discussion` artifact it produces. This discovery records seven decisions (D-1 through D-7) and four open questions (OQ-1 through OQ-4) that govern how robot-talks is invoked, authored, and audited.

**Robot-talks is a *mode*, not a peer of domainspec-subagents-strategy.** The shared rules (scope-decomposition, capability-tier, dispatch lifecycle) live upstream in `domainspec-subagents-strategy`. The mode-specific rules — declared per-turn perspective, tension-not-aggregation synthesis, evidence-vs-concern overlap — live in the robot-talks premise/constitution and are consolidated here.

---

## File Map

| File | Type | Purpose | Status |
|---|---|---|---|
| [robot-talks.md](robot-talks.md) | discovery | Consolidates the rules of robot-talks at the discovery layer; defines it as a dispatch mode, names the schema chain, records D-1 through D-7 and OQ-1 through OQ-4 | draft |
| `research/` (planned) | — | Evidence base for any claims in the discovery that need traceable backing once the corpus expands | planned |

---

## Status

`robot-talks.md` is `status: draft`, `veracidade: medium`, `convicção: high`. The decisions are written and internally consistent; no audit pass has been performed against the broader corpus, and the four open questions below remain unresolved. The premise file (`vault/premise/robot-talks-premises.md`) carries known schema errors that this discovery flags but deliberately does not fix — the recovery sweep is a separate dispatch.

This folder represents current thinking at the discovery layer, not settled rules. The constitution at `vault/constitution/robot-talks-constitution.md` is the active enforceable artifact; this discovery is the layer above it that explains *why* those rules hold.

---

## Blockers / Open Questions

The four open questions in `robot-talks.md` are the legitimate blockers for promoting this discovery toward axiom or for further amendments to the constitution:

- **[OQ-1](robot-talks.md#oq-1--schema-errors-in-robot-talks-premisesmd-await-a-recovery-sweep)** — Schema errors in `robot-talks-premises.md` await a recovery sweep (mislabeled `operationalized-by` on line 202; broken path reference on line 26). Recovery is downstream cleanup, not part of this discovery.
- **[OQ-2](robot-talks.md#oq-2--can-a-robot-talks-discussion-ship-decisions-while-its-governing-premises-are-flagged-broken)** — Governance recursion: can a robot-talks discussion ship decisions while its governing premises are flagged broken? Recommendation pending user ratification.
- **[OQ-3](robot-talks.md#oq-3--heartbeat--partial-synthesis-enforcement)** — Heartbeat / partial-synthesis enforcement (R7's 30-minute timeout) is currently orchestrator discipline, not harness-enforced. Mechanism deferred until a dispatch monitor lands.
- **[OQ-4](robot-talks.md#oq-4--cross-cutting-does-robot-talks-bind-to-its-governing-constitution-at-strategy-declaration-time-or-at-dispatch-time)** — Cross-cutting: does a strategy bind to the constitution version at authoring time or at dispatch time? Affects audit deflection of long-lived strategies.

---

## Connections

- **[vault/premise/robot-talks-premises.md](../../premise/robot-talks-premises.md)** — the premise file (P-RT-1 through P-RT-8) that this discovery `derives-from`. The connections table in that file has known schema errors tracked here as OQ-1; this discovery does not modify it.
- **[vault/constitution/robot-talks-constitution.md](../../constitution/robot-talks-constitution.md)** — the enforceable rule set (PM-1 through PM-8 plus R1–R7) that `codifies` this discovery into operational discipline.
- **[vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md](../domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md)** — the upstream framing. D-4 of that discovery names robot-talks as one of five dispatch modes; this discovery extends D-4 by recording the mode-specific rules and admitting the `discussion` artifact type.
- **[examples/robots-discussing.md](examples/robots-discussing.md)** — the canonical example artifact (`node_type: discussion`, `mode: robot-talks`) produced by a robot-talks dispatch in practice. Turn 3.5 of that file surfaced the governance recursion captured here as OQ-2.

---

## How to Read This Folder

Read `robot-talks.md` first, linearly. The Definitions / Glossary section at the top establishes every term used downstream (participant, turn, perspective, tension, synthesis-as-tension-discovery, codified-as vs operationalized-by). Once those are in hand, the Decisions Taken section (D-1 through D-7) is the load-bearing content; Alternatives Considered explains what was rejected and why; Open Questions enumerates what is still unresolved.

After that, read `vault/premise/robot-talks-premises.md` to see the working bets (P-RT-1 through P-RT-8) this discovery consolidates — keeping in mind OQ-1's schema errors. Finally, read `vault/constitution/robot-talks-constitution.md` to see the enforceable rules derived from those premises. If you want to see the mode in actual use, `vault/discovery/robot-talks-definitions/examples/robots-discussing.md` is the canonical example and the source of OQ-2.

Do not look here for the rules themselves — look here for the reasoning behind them. The rules live in the constitution.
