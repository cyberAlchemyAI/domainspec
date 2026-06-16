---
tags: [vault, discovery, harness, agents, hooks, orchestration]
node_type: discovery
is_session: false
layer: architecture, application
nature: explanatory, technical
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-25
---

# Harness as Enforcement Layer

## Claim

In DomainSpec, the harness is not just the host that runs agents; it is the runtime-and-enforcement layer that loads agents and skills, applies permissions, executes hooks, exposes routing surfaces, and thereby determines which spec-level invariants survive contact with operation.

## Status

Draft. Anchored in existing repo documentation across the Claude harness, telemetry, product-release, and pipeline-wiring surfaces; what would move it is a follow-up discovery comparing Claude Code, app-runtime, and CLI/plugin harnesses against the same invariant checklist.

## Summary

This discovery exists because "harness" is used in the repo in at least three nearby senses: the current Claude Code host, the chat-first product surface called Harness, and the future portability layer that should let DomainSpec run across multiple providers. The central finding is that these are not unrelated meanings. They are three views of the same load-bearing role: the layer that turns agent definitions and specs into actual, governed execution.

The Claude-side documentation already states the strongest version of the claim. Routing in `CLAUDE.md` is best-effort, but hooks are enforced by the harness regardless of agent intent. That means the harness is where non-negotiable behavior becomes operational fact rather than prompt aspiration. In DomainSpec terms, this is where invariants stop being merely declared and start being defended.

The product-facing app-release discovery widens the same role: Harness should feel like the orchestration surface for building an application with agents, not a thin wrapper over prompts. Meanwhile TOBANOV treats Claude Code as today's host but insists the harness layer must become portable across providers. Put together, the harness is best defined conceptually as the execution boundary that mediates between DomainSpec artifacts and the host/runtime world.

This changes how we should talk about it. A harness is not only "where the agents run" and not only "the UI the user sees." It is the layer that selects what becomes deterministic, what remains best-effort, what is observable, and what is portable. That is why missing headless harness support blocks some pipeline designs even when the agent prompts already exist.

## Lenses

- [lenses/01-runtime-enforcement-contract.md](lenses/01-runtime-enforcement-contract.md) — Shows the harness as the runtime contract that loads agents, applies permissions, and enforces deterministic behavior through hooks.
- [lenses/02-orchestration-surface.md](lenses/02-orchestration-surface.md) — Shows the same role from the product side, where Harness is the user-facing orchestration surface rather than a prompt shell.
- [lenses/03-host-portability-boundary.md](lenses/03-host-portability-boundary.md) — Separates the conceptual harness from any single provider by tracing host dependence, portability pressure, and the headless-harness gap.

## Open Questions

- Which invariants should every acceptable DomainSpec harness enforce mechanically, independent of provider?
- Is the right abstraction one harness with pluggable hosts, or distinct harness classes for chat IDE, app runtime, and headless CI?
- How much of today's Claude-specific behavior belongs in portable DomainSpec contracts versus provider adapters?
- Should the vault treat "harness" as a conceptual node distinct from "host", "orchestrator", and "runtime"?

## Next Moves

- Write a premise or constitution that lists the minimum invariant-enforcement contract for any DomainSpec harness.
- Compare `.claude/`, app-runtime chat dispatch, and future CLI/API modes against the same contract.
- Revisit `vault/discovery/curator-pipeline-integration/discovery.md` with this definition in hand to restate the headless gap more precisely.
- Link this discovery into any future `plan/harness/` work so the product meaning and the runtime meaning stop drifting apart.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/agent-context-boundary-rule/discovery.md` | `cited-by` | The agent-context boundary rule cites this discovery's "CLAUDE.md routing is best-effort; only hooks enforce" verdict as the force behind its enforced-floor / judgment-ceiling split. |
