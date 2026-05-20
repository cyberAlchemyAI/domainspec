---
tags: [behavioral-science, choice-architecture, prompting, llm, decision]
node_type: premise
layer: ontology, application
nature: explanatory
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-19
is_session: false
---

# Premise — Prompts are choice architecture for LLM agents

> LLM agents are subject to choice architecture; prompt structure is not cosmetic but causal to outcomes. This is the load-bearing claim of L2 (Behavioral / decision science) in `vault/foundational-knowledges.md`.

---

## Objective

The way a prompt frames options, defaults, ordering, and salience materially changes what an LLM agent does — the same way Thaler-and-Sunstein-style choice architecture changes what humans decide. The premise commits to treating agent prompts as **designed decision environments**, not as neutral instruction strings. Concretely: the order in which options are presented, which option is marked "default," whether tradeoffs are surfaced explicitly, and what fields the agent is *required* to fill in, all act as nudges with measurable effects on the output. This is why DomainSpec invests in agent contracts, readiness gates, and structured envelopes rather than in longer free-form instructions.

---

## Why it is load-bearing

If prompts are cosmetic — i.e., a sufficiently capable model behaves the same regardless of framing — then:

- The entire investment in agent prompt design (`.claude/agents/**`, the `domainspec-subagents-strategy` constitution, readiness-gate prompts) is sunk cost on a non-effect.
- "No-regret defaults" become arbitrary preferences rather than designed nudges.
- The Taleb / antifragility framing of *reversible-by-default actions* loses its mechanism; reversibility-as-default works precisely because defaults stick.
- Layer L2 in the foundational map (citing Kahneman, Thaler, Taleb) reduces to a literature gesture.

Drop this premise and DomainSpec's prompt-engineering surface area has to be re-justified from scratch.

---

## What would falsify it

- Controlled comparison where two prompts with **materially different choice architectures** (different defaults, different option ordering, different salience) produce statistically indistinguishable agent outputs on a sufficient sample of representative tasks.
- A frontier model whose RLHF training has been shown to neutralize choice-architecture effects (e.g., the model normalizes option ordering internally before responding). This would localize the falsification to specific models, not the premise globally.
- Telemetry showing that DomainSpec readiness-gate variants produce no measurable change in downstream agent decisions — i.e., the gate is decorative.

The third test is runnable today; the harness exists.

---

## Confidence calibration

- **veracidade: medium.** Cross-domain evidence from human behavioral science is strong (decades of replicated nudge studies), but its transfer to LLMs is only partially measured. There are public studies showing prompt ordering and framing affect model outputs, but they are not yet a settled empirical literature at the rigor of behavioral economics. Hence not `high`.
- **convicção: high.** Even at medium veracidade we are willing to defend the position strongly because the cost of being wrong is small (a slightly over-designed prompt) while the cost of treating prompts as cosmetic would be enormous (re-tuning every agent ad hoc).

The asymmetry between `veracidade: medium` and `convicção: high` is informative: we bet ahead of full evidence because the downside of the opposite bet is asymmetric. This is the legitimate pattern for a Pascal-wager-shaped premise.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/foundational-knowledges.md` | `cited-by` | L2 (Behavioral / decision science) layer in the foundational map cites this premise as its load-bearing claim. |
