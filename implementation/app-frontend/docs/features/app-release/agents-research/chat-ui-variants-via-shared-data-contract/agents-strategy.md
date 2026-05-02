---
tags: [app-release, ui, research, subagent-strategy, data-contract]
node_type: research-strategy
is_session: false
layer: application, architecture
nature: descriptive, procedural
status: active
created: 2026-05-01
---

# Subagent Strategy — Chat UI Variants via Shared Data Contract

## Goal

Produce **multiple, fully distinct chat UIs** for the app-release workspace that:
- Use the **same semantic elements** (message, tool-use box, metrics, graph, input area, session header, etc.)
- Differ in **visual style** AND **element ordering / spatial layout**
- All consume a **single shared data contract** served by the backend
- Allow swapping UIs without backend changes (URL param or config switch)

Inspired by the `app-launch/visualizations/newspaper` evolutionary approach, where many `gen_*.html` templates each render the same `currentPayload` differently.

## Core Constraint (User-Specified)

> "We will want different UIs completely, but with the same elements. We can build the style of the elements and the ordering of those elements differently."

This means: element **taxonomy is fixed**, presentation is **free**.

## Why a Subagent Strategy

The work decomposes cleanly into independent phases. Phase 2 generates 4 templates that share no implementation but share a contract — perfect for parallelization. Each agent has narrow scope, isolated context, and a single deliverable. Sequential phases create natural gates where the contract can be ratified before downstream work commits.

## Phase Diagram

```
Phase 1 (Sequential) ──► Phase 2 (4 agents in parallel) ──► Phase 3 (Sequential)
ui-element-researcher       ui-template-generator-{1..4}       ui-contract-validator
       │                              │                                 │
       ▼                              ▼                                 ▼
ELEMENT-TAXONOMY.md           templates/layout-*.html           VALIDATION-REPORT.md
CHAT-PAYLOAD-SCHEMA.md        each with mock payload            Schema gaps identified
```

## Phase 1 — Contract Definition (Sequential, 1 agent)

**Agent:** `ui-element-researcher`

**Inputs:**
- Current `visualizations/app-release/index.html` and `app.mjs`
- Backend interfaces in `docs/features/app-release/interfaces.md`
- Event types in `docs/features/app-release/events.md`
- Newspaper reference: `app-launch/visualizations/newspaper/docs/protocol/data-exchange-protocol.md`

**Deliverables:**
1. `ELEMENT-TAXONOMY.md` — Enumerates every semantic element in a chat workspace UI with its purpose, data dependencies, and optional/required status.
2. `CHAT-PAYLOAD-SCHEMA.md` — JSON schema (with concrete example) all templates will consume via `window.parent.chatPayload`.
3. `INJECTION-CONTRACT.md` — Defines the parent ↔ template handshake (postMessage events, SSE update flow, mock fallback rule).

**Success criteria:**
- Every element currently in the live UI has a row in the taxonomy.
- Schema is sufficient to render every element without backend extension.
- Injection contract leaves zero ambiguity for downstream template authors.

## Phase 2 — Template Generation (Parallel, 4 agents)

All four agents read the Phase 1 deliverables and produce ONE complete HTML template each. They have no awareness of each other's work — divergence is the goal.

### Agent A: `ui-template-full-width`
- **Style direction:** minimalist, conversation-first, chat occupies ~90% of viewport when no scroll
- **Element ordering:** chat dominates; metrics/graph collapsed/secondary
- **Inspiration to seek:** ChatGPT, Claude.ai, modern messaging apps
- **Output:** `templates/layout-full-width.html`

### Agent B: `ui-template-split-pane`
- **Style direction:** workspace-style, balanced two-pane
- **Element ordering:** chat left half, graph + metrics right half, equal visual weight
- **Inspiration to seek:** Cursor, VS Code with Copilot, IDE-style chat docks
- **Output:** `templates/layout-split-pane.html`

### Agent C: `ui-template-card-deck`
- **Style direction:** modular, every element is a card; user can rearrange or hide
- **Element ordering:** independent draggable/collapsible cards
- **Inspiration to seek:** Notion, Tana, Bloomberg Terminal panels
- **Output:** `templates/layout-card-deck.html`

### Agent D: `ui-template-terminal-dense`
- **Style direction:** monospace, data-dense, command-line aesthetic
- **Element ordering:** linear vertical stack, prompt at bottom, log-like
- **Inspiration to seek:** terminals, tmux dashboards, htop, k9s
- **Output:** `templates/layout-terminal-dense.html`

**Common requirements (all four agents):**
- Read payload via `window.parent.chatPayload`, fall back to inline `mockPayload` for standalone testing
- Subscribe to `payload-update` `postMessage` events from parent
- Implement EVERY element from the taxonomy (no silent omission)
- Include a top-of-file `<!-- @taxonomy-coverage -->` comment listing which elements are rendered
- Self-contained: no external CSS files (embedded `<style>` only), no build step

## Phase 3 — Validation (Sequential, 1 agent)

**Agent:** `ui-contract-validator`

**Process:**
1. Load each of the 4 templates with the canonical mock payload from Phase 1.
2. Verify every element in the taxonomy is rendered by every template.
3. Inject malformed / partial payloads to test fallback behavior.
4. Identify schema gaps surfaced by templates (a template needing a field the schema didn't define).
5. Cross-template comparison: are any elements interpreted inconsistently?

**Deliverable:** `VALIDATION-REPORT.md` with a per-template scorecard, schema-gap list, and recommendations for Phase 1 contract revision (if any).

## Outputs Hierarchy

```
agents-research/chat-ui-variants-via-shared-data-contract/
├── agents-strategy.md                  ← this file
├── agents-findings.md                  ← each agent appends its raw findings here
├── research-findings-for-humans.md     ← human-facing synthesis (last)
├── agents/
│   ├── 01-ui-element-researcher.md
│   ├── 02-ui-template-full-width.md
│   ├── 03-ui-template-split-pane.md
│   ├── 04-ui-template-card-deck.md
│   ├── 05-ui-template-terminal-dense.md
│   └── 06-ui-contract-validator.md
├── deliverables/
│   ├── ELEMENT-TAXONOMY.md             ← Phase 1 output
│   ├── CHAT-PAYLOAD-SCHEMA.md          ← Phase 1 output
│   ├── INJECTION-CONTRACT.md           ← Phase 1 output
│   ├── VALIDATION-REPORT.md            ← Phase 3 output
│   └── templates/
│       ├── layout-full-width.html      ← Phase 2 output
│       ├── layout-split-pane.html      ← Phase 2 output
│       ├── layout-card-deck.html       ← Phase 2 output
│       └── layout-terminal-dense.html  ← Phase 2 output
```

## Sequencing Rules

- Phase 1 MUST complete and be reviewed before Phase 2 launches.
- Phase 2 agents run in parallel via a single multi-tool message (4 concurrent invocations).
- Phase 3 MUST wait for ALL four Phase 2 agents to finish.
- If Phase 3 reports schema gaps, Phase 1 is re-opened, Phase 2 templates are patched (not rewritten).

## Out of Scope

- Backend changes (the contract Phase 1 produces should be satisfiable by today's API; if not, that is itself a finding).
- A/B testing infrastructure, telemetry, MAB style-selection (newspaper does this; here we just want the variants to exist and validate).
- Visual polish cycles beyond the initial generation — the goal is *assessable variety*, not finished design.

## Success Definition

When the user can:
1. Open `templates/layout-full-width.html` in a browser → see the entire chat workspace render.
2. Switch to `templates/layout-card-deck.html` → see the same data rendered with completely different style and ordering.
3. Make ONE change to the backend payload → see all four templates reflect it without code changes.

That is the proof the contract is right.
