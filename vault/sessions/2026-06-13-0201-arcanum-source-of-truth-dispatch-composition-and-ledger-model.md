---
tags: [agents, architecture, pipeline, vault, arcanum, dispatch]
node_type: discovery
is_session: true
layer: architecture, ontology
nature: explanatory, technical
status: active
created: 2026-06-13
timestamp: 2026-06-13T02:01:30-03:00
expires: 2026-08-12
conversation_id: arcanum-source-of-truth-dispatch-composition-and-ledger-model
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Produced two load-bearing artifacts (LEDGER-MODEL.md and Arcanum's DISPATCH-COMPOSITION-MODEL.md) and surfaced a governance gap (stale constitution reference) that must be resolved before the dispatch toolchain is correct."
---

# Arcanum as source of truth — dispatch-composition model + ledger data model

## Summary

This session pivoted the agent-pipeline work to treat the sibling **Arcanum** framework repo as the
source of truth for framework-level abstractions. It produced F0 (a prove-of-instance juxtaposing
domainspec's research I/O contract against Arcanum's stage-ledger), then wrote, red-teamed, fixed,
and pushed `DISPATCH-COMPOSITION-MODEL.md` into Arcanum's TO-VLAD series — the forward consolidation
of memos 6+8 plus the on-subject slice of 7, with a §12 wiring note for fusing domainspec's authored
dispatch-ledger with Arcanum's behavioral-signal + per-stage logging (domainspec contributes an
envelope-producer Formula, not a replacement writer). On the domainspec side it added
`LEDGER-MODEL.md` — the dispatch ledger's data model (two-append discipline, the
`dispatch→groups→agents` tree as JSON columns, the L1/L2/L3 normalization, two-kinds-of-log) —
keeping the constitution as law in vault and pointing to (not moving) the skills.

## Contradictions

- questions `vault/constitution/domainspec-subagents-strategy-constitution.md` — the v0.3.0 vault
  constitution is cited as governing law across the dispatch toolchain (README, SKILL.md, appender,
  the new LEDGER-MODEL.md), but the live v0.5.2 law is the repo-root `subagents-strategy-constitution-proposal.md`;
  the vault node is stale/superseded-in-practice but not formally retired. Broader toolchain repoint left open.

## Files touched

- internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md
- internal_tools/subagents-dispatch-hooks/README.md
- research/subagents-strategy/2026-06-13-generic-stage-contract-plan/F0-prove-of-instance.md
- telemetry/agents/subagents-dispatch.yaml

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md` | `creates` | Session authored this new dispatch-ledger data-model doc. |
| `research/subagents-strategy/2026-06-13-generic-stage-contract-plan/F0-prove-of-instance.md` | `creates` | Session authored the F0 prove-of-instance juxtaposing the research I/O contract against Arcanum's stage-ledger. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | Added a `docs/` navigation entry pointing to LEDGER-MODEL and the discovery. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Appended dispatch + close rows for the planning, write, and review dispatches. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `revisits` | Reconsidered the standing of the v0.3.0 vault constitution: it is cited as law across the toolchain while the live v0.5.2 law is the repo-root proposal — stale, not formally retired. |
