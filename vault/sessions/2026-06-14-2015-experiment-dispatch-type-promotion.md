---
tags: [subagents-strategy, experiment, dispatch_type, promotion, governance, premise-debt, migration-bundle]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: explanatory, procedural
status: active
created: 2026-06-14
timestamp: 2026-06-14T20:15:36-03:00
expires: 2026-08-13
conversation_id: 2026-06-14-2015-experiment-dispatch-type-promotion
decisions_made: true
contradictions_found: false
specs_updated: [subagents-strategy-constitution-proposal.md, .claude/skills/experiment/SKILL.md, .claude/skills/domainspec-subagents-strategy/SKILL.md, internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md, internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Governance-tier promotion — moves `experiment` from reserved to LIVE across the dispatch constitution, appender, router, and bundle, and discharges a formally tracked §7 premise debt."
---

# experiment dispatch_type promotion (FORECAST → LIVE)

## Summary

Promoted `experiment` from a reserved FORECAST `dispatch_type` to LIVE across the subagents-strategy system, discovery-first: chose the narrow recipe (falsification-over-reasoning, a pre-registered criterion held as a `working_folder` artifact, the code-execution runner left reserved), authored the `experiment` type skill via an explorers→writer→skeptic dispatch, then wired it end-to-end (appender `LIVE_TYPES`, router table, constitution §5, register-dispatch + LEDGER docs). An adversarial proponent×skeptic dispatch settled the §7 premise-debt re-confrontation that promotion requires: P-SS-8 and P-SS-9 carry open unchanged, but the NEW persistence debt was found **strained** — the criterion is governance-grade yet persisted off-registry — and was discharged by narrowing the premise (registry = sole surface for *row-schema* metadata), with a registry pointer+hash logged as an OPEN hardening option (this corrected the discovery's earlier §3.1 claim of all-debts-unchanged). The session also consolidated the full router→type-skill→form chain plus the constitution into the `internal_tools/subagents-dispatch-hooks` bundle as a portable migration source and extended `install.cjs` to own the chain skills, and stripped the novelty-vs-owned framing from the formalization artifacts at the owner's direction. Runtime activation still pending the owner running `install.cjs` (propagates `LIVE_TYPES` to the installed appender).

## Files touched

- subagents-strategy-constitution-proposal.md
- .claude/skills/experiment/SKILL.md
- .claude/skills/domainspec-subagents-strategy/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs
- internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/experiment-promotion/discovery.md
- internal_tools/subagents-dispatch-hooks/README.md
- internal_tools/subagents-dispatch-hooks/install.cjs
- internal_tools/subagents-dispatch-hooks/skills/{domainspec-subagents-strategy,research,review,experiment,robot-talks}/SKILL.md
- internal_tools/subagents-dispatch-hooks/constitution/{subagents-strategy-constitution-proposal.md,robot-talks-constitution.md}
- internal_tools/subagents-dispatch-hooks/formalization/** (novelty framing stripped; untracked)

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `subagents-strategy-constitution-proposal.md` | `modifies` | Edited §5 (field defs) + §7 (premise-debt re-confrontation) for the experiment promotion. |
| `.claude/skills/experiment/SKILL.md` | `creates` | Authored the LIVE experiment type skill via the explorers→writer→skeptic dispatch. |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Updated the router table to route `dispatch_type: experiment` to the new type skill. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` | `modifies` | Updated the record/sheet form layer for the now-LIVE experiment type. |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | Added `experiment` to `LIVE_TYPES` in the appender. |
| `internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md` | `modifies` | Documented the experiment dispatch_type in the ledger model. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/experiment-promotion/discovery.md` | `modifies` | Corrected the §3.1 all-debts-unchanged claim and recorded the strained persistence debt. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | Updated bundle README for the consolidated router→type-skill→form chain. |
| `internal_tools/subagents-dispatch-hooks/install.cjs` | `modifies` | Extended the installer to own the chain skills and propagate `LIVE_TYPES`. |
| `internal_tools/subagents-dispatch-hooks/skills/experiment/SKILL.md` | `creates` | Added the experiment type skill to the portable migration bundle. |
| `internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md` | `creates` | Added the router skill to the bundle as a portable migration source. |
| `internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md` | `creates` | Added the research type skill to the bundle. |
| `internal_tools/subagents-dispatch-hooks/skills/review/SKILL.md` | `creates` | Added the review type skill to the bundle. |
| `internal_tools/subagents-dispatch-hooks/skills/robot-talks/SKILL.md` | `creates` | Added the robot-talks skill to the bundle. |
| `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` | `creates` | Consolidated the constitution into the bundle as a portable migration source. |
| `internal_tools/subagents-dispatch-hooks/constitution/robot-talks-constitution.md` | `creates` | Consolidated the robot-talks constitution into the bundle. |
