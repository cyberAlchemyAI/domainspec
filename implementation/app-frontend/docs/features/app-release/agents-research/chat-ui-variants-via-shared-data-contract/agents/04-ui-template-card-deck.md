---
agent_id: ui-template-card-deck
phase: 2
order: 4
parallel_group: phase-2-templates
status: not-started
---

# Agent 04 — UI Template: Card Deck

## Role

Produce ONE complete chat workspace UI in the **card-deck / modular dashboard** style. Every major element is its own card. Cards can be collapsed, and (stretch goal) reordered. The user composes their own workspace.

## Mission

You are one of four template-generator agents running in parallel. Your direction is *modularity* — the layout itself is a configurable artifact. The chat is one card among several; metrics, graph, session info, and tool-use log are sibling cards. Commit fully to the dashboard metaphor.

## Style Direction (Non-Negotiable)

- **Every element is a card** with its own header, optional collapse toggle, and visual frame.
- **Grid or masonry layout.** Cards arranged in a 2 or 3 column grid (responsive).
- **Cards are independently scrollable** (long chat history scrolls inside its card; the page itself does not scroll into infinity).
- **Each card has affordances:** title bar, collapse/expand button, optional "expand to fullscreen" button.
- **Inspirations:** Notion dashboards, Tana panels, Bloomberg Terminal, Grafana, Retool.
- **Visual style:** subtle shadows or borders to create card depth, slightly playful (rounded corners, gentle accents). Distinct from the IDE-feel of split-pane.

## Inputs You Must Read

1. `../deliverables/ELEMENT-TAXONOMY.md`
2. `../deliverables/CHAT-PAYLOAD-SCHEMA.md`
3. `../deliverables/INJECTION-CONTRACT.md`

## Deliverable

`../deliverables/templates/layout-card-deck.html` — single self-contained HTML file with embedded `<style>` and `<script>`.

## Required Behaviors

- Consume payload via `window.parent.chatPayload` with `mockPayload` fallback.
- Subscribe to `postMessage` updates per the injection contract.
- Render every taxonomy element as its own card OR as a clearly delineated section inside a logically related card. No element invisible.
- Include at the top of the file:
  ```html
  <!-- @template-id: layout-card-deck -->
  <!-- @taxonomy-coverage: [list every element_id and which card hosts it] -->
  <!-- @style-direction: modular card deck -->
  ```

## Constraints

- No external CSS files, no build step, no JS framework.
- `force-graph` from CDN if needed for the graph card.
- Portuguese-first labels.
- Do not invent schema fields — log gaps as findings.
- Drag-to-reorder is OPTIONAL (stretch). Collapse/expand per card is REQUIRED.

## Output Format

Append to `../agents-findings.md`:

```markdown
## Agent 04 — ui-template-card-deck

**Status:** complete
**Deliverable:** deliverables/templates/layout-card-deck.html
**Lines of code:** N
**Taxonomy coverage:** X / Y elements rendered (mapped to N cards)
**Card list:** [card-chat, card-metrics, card-graph, card-session, ...]

**Style decisions:**
- ...

**Schema gaps encountered:**
- ...

**Stretch goals attempted:**
- (drag-to-reorder? user-pinning? localStorage layout persistence?)
```

## Done When

Opening the HTML in a browser shows a grid of clearly framed cards, each card has a recognizable purpose and can be collapsed/expanded, and the layout reads instantly as "dashboard" — distinct from the other three styles.
