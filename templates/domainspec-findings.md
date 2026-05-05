---
tags: [template, subagents, dispatch-artifact, subagents-findings]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.1
last_updated: 2026-05-02
template_for: domainspec-subagents-findings.md
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `<dispatch-slug>`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** (metadata) → **Findings** (summary + implications) → **Analysis** (tensions + cross-cutting). Section order is mandatory per R16. Every load-bearing claim in Findings and Analysis MUST cite a passage in `domainspec-subagents-research.md` per R17.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

> Where the need for this dispatch arose: the situation, the upstream artifact or conversation, the question that surfaced. Required by R23.

`<2–4 sentences. What was happening, what triggered the dispatch, why a single inline investigation was insufficient.>`

## Goal

> What this dispatch is trying to achieve. Stated concretely enough that Coverage (R21) can be evaluated against it. Required by R23.

`<1–2 sentences. The outcome that, if produced, would mean the dispatch succeeded.>`

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**Mode:** `<single | task-fan-out | robot-talks | sequential | mixed>` *(R19)*

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `agent-1` | `<model name>` | `<one line>` | `<n tokens or "unbounded">` | `<e.g., 5-bullet structured report>` |
| `agent-2` | `<model name>` | `<one line>` | `<n tokens or "unbounded">` | `<e.g., 5-bullet structured report>` |

**Sequencing:** `<linear chain | parallel set | DAG description>`

**Recursion budget actually used:** depth = `<n>`, breadth = `<n>`, total agents = `<n>` *(defaults per R13: depth 2, breadth 5, total 10; overrides recorded here)*

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `agent-1` |          |            |       |
| `agent-2` |          |            |       |
| **Sum**   |          |            |       |

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | `0.x` (judgment) | `<brief reason>` |
| Independence     | `0.x` (judgment) | `<brief reason>` |
| Fidelity         | `0.x` (judgment) | `<brief reason>` |
| Cost discipline  | `0.x`            | declared budget vs actual: `<n / n>` |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in `domainspec-subagents-research.md` (R17).

### F1 — `<finding name>`

- **Claim:** `<one sentence>`
- **Evidence:** [`domainspec-subagents-research.md` §Agent N](./domainspec-subagents-research.md#agent-n--brief)
- **Implication:** `<what changes downstream because of this finding>`

### F2 — `<finding name>`

- **Claim:** `<one sentence>`
- **Evidence:** [`domainspec-subagents-research.md` §Agent N](./domainspec-subagents-research.md#agent-n--brief)
- **Implication:** `<...>`

### F3 — `<finding name>`

`<...>`

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in `domainspec-subagents-research.md` (R17).

### T1 — `<tension name>`

- **Held by `<scope A>`:** `<assumption>`
- **Reality in `<scope B>`:** `<observation>`
- **Evidence:** [`domainspec-subagents-research.md` §Agent A](./domainspec-subagents-research.md#agent-a--brief), [`domainspec-subagents-research.md` §Agent B](./domainspec-subagents-research.md#agent-b--brief)
- **Impact:** `<what breaks; severity>`

### T2 — `<tension or cross-cutting observation>`

`<...>`

### Cross-cutting observations

> Patterns spanning multiple agents that are not strictly tensions but matter for interpretation.

`<...>`

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session renamed this template from `domainspec-subagents-findings.md` to `domainspec-subagents-findings.md`. |
