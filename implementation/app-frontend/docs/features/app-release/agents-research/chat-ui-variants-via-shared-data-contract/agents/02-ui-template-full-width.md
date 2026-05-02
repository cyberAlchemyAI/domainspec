---
agent_id: ui-template-full-width
phase: 2
order: 2
parallel_group: phase-2-templates
status: not-started
---

# Agent 02 — UI Template: Full-Width Chat

## Role

Produce ONE complete chat workspace UI in the **full-width / chat-first** style. The chat occupies almost the entire viewport when the user has not scrolled. Other elements (metrics, graph, session controls) are present but visually subordinate.

## Mission

You are one of four template-generator agents running in parallel. The other three are pursuing very different aesthetic and structural directions. Do NOT try to balance or compromise — commit fully to chat-first minimalism. Divergence is the goal of this phase.

## Style Direction (Non-Negotiable)

- **Chat occupies ≥85% of initial viewport.** No scroll required to see the conversation and input.
- **Minimalist palette:** 2–3 colors max, generous whitespace, no decorative borders.
- **Typography-driven:** the message text is the hero; everything else is utilitarian.
- **Inspirations:** ChatGPT web UI, Claude.ai, Linear's minimal style, iA Writer.
- **Metrics & graph:** present but collapsed by default (small badge / expandable drawer / floating mini-card).
- **Session controls (tabs, end-session, resume):** thin top bar OR slide-out menu — they must NOT compete with chat for attention.

## Inputs You Must Read

1. `../deliverables/ELEMENT-TAXONOMY.md` — full list of elements you MUST render.
2. `../deliverables/CHAT-PAYLOAD-SCHEMA.md` — exact data structure you will consume.
3. `../deliverables/INJECTION-CONTRACT.md` — how to read `window.parent.chatPayload` and handle live updates.

## Deliverable

`../deliverables/templates/layout-full-width.html` — single self-contained HTML file with embedded `<style>` and `<script>`. No external dependencies except fonts and the existing `force-graph` CDN script if you render the graph.

## Required Behaviors

- Read payload from `window.parent.chatPayload`; fall back to an inline `mockPayload` (copy from schema doc) so the file works opened directly in a browser.
- Listen for `postMessage` events per the injection contract; re-render on `payload-update`.
- Render EVERY element from the taxonomy. If you choose to hide one by default (e.g., graph collapsed), it must still be reachable.
- Include at the top of the file:
  ```html
  <!-- @template-id: layout-full-width -->
  <!-- @taxonomy-coverage: [list every element_id you render] -->
  <!-- @style-direction: chat-first minimalist -->
  ```

## Constraints

- No external CSS files. Embedded `<style>` only.
- No build step (no Tailwind compile, no Sass).
- No JS framework (no React, Vue, Svelte). Vanilla JS only.
- Portuguese-first labels, matching existing UI (`+ Nova sessão`, `Encerrar sessão`, etc.).
- Do not invent data fields not in the schema. If you need one, log it as a finding instead.

## Output Format

When you finish, append to `../agents-findings.md`:

```markdown
## Agent 02 — ui-template-full-width

**Status:** complete
**Deliverable:** deliverables/templates/layout-full-width.html
**Lines of code:** N
**Taxonomy coverage:** X / Y elements rendered visibly, Z elements present-but-collapsed

**Style decisions:**
- ...

**Schema gaps encountered:**
- (any field you wished existed but didn't)

**Trade-offs taken:**
- ...
```

## Done When

Opening the HTML file in a browser shows a complete, functional chat workspace where the chat is unambiguously the dominant element and a user could not mistake the layout for any of the other three sibling templates.
