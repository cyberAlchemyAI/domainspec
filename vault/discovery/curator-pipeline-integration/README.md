---
tags: [vault, agents, pipeline, curator, orchestrator, readme]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.1
last_updated: 2026-05-16
---

# curator-pipeline-integration

## What is this?

Discovery folder recording the design space for wiring the `domainspec-vault-metadata-curator` agent and the `edges` skill into the DomainSpec pipeline. Holds `discovery.md` (synthesis of the `curator-pipeline-wiring-2026-05-02` dispatch) and may later hold `research/` artifacts from follow-up dispatches.

## Business Context

Sits at the intersection of the vault's metadata enforcement work and the DomainSpec pipeline's skill graph. Upstream of any concrete wiring PR. Source provenance is the dispatch artifact at `.planning/research/curator-pipeline-wiring/research/domainspec-subagents-findings.md` (and the underlying `domainspec-subagents-research.md`) — those live outside `vault/` per the domainspec-subagents-strategy working-folder convention and are cited from `discovery.md` as forward-only edges.

## Why it matters

No wiring decision is locked yet. **Option A as originally framed was found to be a null set** against the codebase (zero `domainspec-*` skills write to `vault/**`); Option A' (bootstrap inserted into the actual vault-producing skills under `.claude/skills/`) was newly surfaced and is not yet evaluated; Options B and C remain viable with very different cost profiles. Without this discovery, follow-up dispatches would re-discover the null result.

## 📁 Navigation

- [discovery.md](discovery.md) — Three-option design space (bootstrap-on-write / promote-to-skill / CI gate) for wiring the curator into the DomainSpec pipeline; preserves the null result on Option A and surfaces a derived Option A'. Status: draft.

## Status

`discovery.md` is `status: draft`. The wiring decision is **open**. **OQ-1 / OQ-B are RESOLVED:** edges into `.claude/skills/**` and `.claude/agents/**` are formally legal-by-design forward-only (no inverse required). Edges into `.planning/**` and other non-skill/non-agent paths remain a separate question (OQ-C).

## How to Read This Folder

Read `discovery.md` linearly. The Visual Flows section (three mermaid diagrams: current state, Option B wiring, Option C wiring) is the load-bearing artifact for orientation; the Alternatives section enumerates each option with evidence and surviving viability. Open Questions names what the next dispatch (or the next user decision) must close before any wiring proposal can become an implementation-plan.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 session updated this README to reflect the OQ-B RESOLVED state. |
