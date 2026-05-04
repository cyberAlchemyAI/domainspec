---
tags: [template, subagents, dispatch-artifact, subagents-research]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.1
last_updated: 2026-05-02
template_for: domainspec-subagents-research.md
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `<dispatch-slug>`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../constitution/domainspec-subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location), R17 (downstream `domainspec-subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Context

> Where the need for this dispatch arose: the situation, the upstream artifact or conversation, the question that surfaced. Required by R23.

`<2–4 sentences. What was happening, what triggered the dispatch, why a single inline investigation was insufficient.>`

## Goal

> What this dispatch is trying to achieve. Stated concretely enough that Coverage (R21) can be evaluated against it. Required by R23.

`<1–2 sentences. The outcome that, if produced, would mean the dispatch succeeded.>`

---

## Agent 1 — `<one-line brief of agent 1's concern>`

<!--
Verbatim return from agent 1. Do NOT edit, summarize, or reformat.
If the agent returned structured sections (Findings, Gaps, etc.), preserve them as-is.
-->

`<paste agent 1's return verbatim>`

---

## Agent 2 — `<one-line brief of agent 2's concern>`

`<paste agent 2's return verbatim>`

---

## Agent N — `<one-line brief of agent N's concern>`

`<paste agent N's return verbatim>`

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session renamed this template from `domainspec-subagents-research.md` to `domainspec-subagents-research.md`. |
