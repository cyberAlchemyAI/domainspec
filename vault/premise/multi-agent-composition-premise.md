---
tags: [multi-agent, orchestration, dispatch, telemetry, composition]
node_type: premise
layer: ontology, architecture, application
nature: explanatory
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-19
is_session: false
---

# Premise — Reliable pipelines from unreliable agents

> Reliable pipelines can be composed from unreliable agents only when (a) dispatch is governed, (b) outputs are typed, and (c) telemetry closes the loop. This is the load-bearing claim of L7 (Multi-agent orchestration) in `vault/foundational-knowledges.md`.

---

## Objective

Individual LLM agents are unreliable in a specific sense: they produce plausible-looking outputs whose correctness varies with prompt, model, context, and randomness. The premise commits to the position that **reliability is recoverable at the pipeline level** — but only under three coupled conditions:

- **(a) Governed dispatch.** Which agent runs when, with what inputs, under what model, is decided by a rule (a constitution, a strategy, a router) rather than by ad-hoc choice. The `domainspec-subagents-strategy` constitution is the canonical instance.
- **(b) Typed outputs.** Every agent emits artifacts under a schema (frontmatter for vault docs, JSON envelopes for agent-runner contracts) so downstream stages can validate inputs structurally rather than by reading prose.
- **(c) Telemetry closing the loop.** Every dispatch leaves a signal trail; aggregate signals feed the reflect / tuning loop, which retunes prompts and strategies based on observed behavior rather than imagined behavior.

Drop any one of the three and the pipeline reverts to "lucky hand-offs between hopeful prompts."

---

## Why it is load-bearing

If reliable pipelines do *not* require all three conditions:

- The `domainspec-subagents-strategy` constitution is over-engineered — fan-out could be ad hoc.
- The agent-runner contracts (`internal_tools/agents-telemetry/docs/agent-runner.md`) collapse into "whatever the agent happens to print."
- The telemetry stack and the `domainspec-reflect` / `domainspec-signal-observer` loop lose their justification — without (c), telemetry is forensic only, not corrective.
- Layer L7 in the foundational map reduces to a list of skills with no organizing principle.

The whole "L7 is a new layer" position (OQ-1 in foundational-knowledges.md) hinges on this premise: if these three conditions were *not* jointly necessary, L7 really would be a special case of L1 (control theory) and could be retired.

---

## What would falsify it

- A pipeline that achieves comparable reliability to the DomainSpec stack while **dropping one of (a)/(b)/(c)** — e.g., ungoverned dispatch (any agent calls any agent), free-form outputs (no schema), and no telemetry — yet matches end-to-end fidelity on a fair benchmark.
- Demonstration that a single sufficiently-capable monolithic agent (no composition, no dispatch, no typed hand-offs) produces equivalent or better pipeline-level reliability. This is the same falsifier as P-DS-1 in `domainspec-premises.md` and is *coupled* with it: if P-DS-1 fails, this premise weakens accordingly.
- Evidence that telemetry-driven retuning never produces measurable improvement over a baseline of "just update the prompts when something obviously breaks." Would falsify the (c) leg specifically and demote the premise to "(a) and (b) suffice."

The first two are runnable benchmarks; the third is testable inside the existing reflect loop's history.

---

## Confidence calibration

- **veracidade: medium.** Each of the three conditions has anecdotal and partial empirical support inside DomainSpec, but the *joint* claim — that all three are necessary, not just sufficient — has not been benchmarked against ablations. We have not run "drop (a)" or "drop (c)" comparisons end-to-end.
- **convicção: high.** Defended strongly because the failure modes of dropping any of the three are visible without a benchmark: ungoverned dispatch yields prompt sprawl, untyped outputs yield parser failures downstream, no telemetry yields tuning by vibes. The premise is held with high commitment ahead of full evidence — a deliberate asymmetric bet.

The `medium` / `high` gap is the same pattern as `choice-architecture-premise.md`: betting ahead of full evidence is rational when the downside of the opposite bet is large.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/foundational-knowledges.md` | `cited-by` | L7 (Multi-agent orchestration) layer in the foundational map cites this premise as its load-bearing claim. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `cites` | The constitution operationalizes condition (a) — governed dispatch — for the fan-out case. |
| `vault/premise/domainspec-subagents-strategy-premises.md` | `cites` | The strategy premises specialize this premise to the fan-out subcase; they are derivatives, not the foundational claim. |
