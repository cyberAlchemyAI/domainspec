---
agent_id: ui-template-split-pane
phase: 2
order: 3
parallel_group: phase-2-templates
status: not-started
---

# Agent 03 — UI Template: Split-Pane Workspace

## Role

Produce ONE complete chat workspace UI in the **split-pane / IDE-style** layout. The viewport is divided into two roughly equal panes: chat on one side, ontology graph + metrics on the other. Both panes have equal visual weight — neither dominates.

## Mission

You are one of four template-generator agents running in parallel. Your direction is the IDE/workspace metaphor — the user is here to *do work on a knowledge graph*, and the chat is one tool among several. Commit fully to balance and information density.

## Style Direction (Non-Negotiable)

- **Two panes side by side.** Default split ~50/50; user-resizable divider strongly preferred.
- **Equal visual weight.** Neither pane is "primary" — both are first-class.
- **Chat pane:** message list + input at bottom, scrollable.
- **Workspace pane:** ontology graph (force-graph) + metrics + session metadata stacked vertically.
- **Header:** thin bar across the top with tabs, status, end-session.
- **Inspirations:** Cursor, VS Code with Copilot panel, JetBrains AI Assistant, Tana split views.
- **Color palette:** professional, slightly cool (greys, one accent). Borders allowed and useful for delineating panes.

## Inputs You Must Read

1. `../deliverables/ELEMENT-TAXONOMY.md`
2. `../deliverables/CHAT-PAYLOAD-SCHEMA.md`
3. `../deliverables/INJECTION-CONTRACT.md`

## Deliverable

`../deliverables/templates/layout-split-pane.html` — single self-contained HTML file with embedded `<style>` and `<script>`.

## Required Behaviors

- Consume payload via `window.parent.chatPayload` with `mockPayload` fallback.
- Subscribe to `postMessage` updates per the injection contract.
- Render EVERY element from the taxonomy — none should be hidden in this layout (information density is the point).
- Include at the top of the file:
  ```html
  <!-- @template-id: layout-split-pane -->
  <!-- @taxonomy-coverage: [list every element_id you render] -->
  <!-- @style-direction: split-pane workspace -->
  ```

## Constraints

- No external CSS files. Embedded `<style>` only.
- No build step, no JS framework. Vanilla JS only.
- Use `force-graph` from CDN (already used by current UI).
- Portuguese-first labels.
- Do not invent schema fields — log gaps as findings.

## Output Format

When you finish, append to `../agents-findings.md`:

```markdown
## Agent 03 — ui-template-split-pane

**Status:** complete
**Deliverable:** deliverables/templates/layout-split-pane.html
**Lines of code:** N
**Taxonomy coverage:** X / Y elements rendered

**Style decisions:**
- (resizable divider choice, color palette, density choices)

**Schema gaps encountered:**
- ...

**Trade-offs taken:**
- ...
```

## Done When

Opening the HTML in a browser shows two clearly delineated panes of roughly equal size, both showing meaningful content, and the layout reads instantly as "IDE/workspace" — distinct from chat-first, card-deck, or terminal styles.
