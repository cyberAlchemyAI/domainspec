---
agent_id: ui-template-terminal-dense
phase: 2
order: 5
parallel_group: phase-2-templates
status: not-started
---

# Agent 05 — UI Template: Terminal / Data-Dense

## Role

Produce ONE complete chat workspace UI in the **terminal / log-stream / data-dense** style. Monospace typography, command-line aesthetic, vertical linear stack, prompt at the bottom. Information density is high; visual decoration is near zero.

## Mission

You are one of four template-generator agents running in parallel. Your direction is the terminal metaphor — the user is power-user-coded, scanning streams of tool calls and conversational turns like log lines. Commit fully to density and monospace utilitarianism.

## Style Direction (Non-Negotiable)

- **Monospace font everywhere** (`JetBrains Mono`, `Fira Code`, or system mono).
- **Linear vertical stack:** header on top, log-like message stream in the middle, prompt input pinned to the bottom.
- **Tool uses look like log lines** with timestamps, status codes, and indentation — not fancy boxes.
- **Metrics shown as a status bar** (one line, key:value pairs separated by `│`).
- **Graph:** rendered inline as a small ASCII-style summary OR in a fixed sidebar panel as a force-graph with muted colors. Decide; commit.
- **Color palette:** dark background, near-mono text, ONE accent color (lime, amber, or cyan) for highlights.
- **Inspirations:** tmux, htop, k9s, the `gen_005_explore_cyber_archive.html` newspaper template, Bloomberg Terminal command line.

## Inputs You Must Read

1. `../deliverables/ELEMENT-TAXONOMY.md`
2. `../deliverables/CHAT-PAYLOAD-SCHEMA.md`
3. `../deliverables/INJECTION-CONTRACT.md`

## Deliverable

`../deliverables/templates/layout-terminal-dense.html` — single self-contained HTML file with embedded `<style>` and `<script>`.

## Required Behaviors

- Consume payload via `window.parent.chatPayload` with `mockPayload` fallback.
- Subscribe to `postMessage` updates.
- Render every taxonomy element. None hidden — density is your friend.
- Include at the top of the file:
  ```html
  <!-- @template-id: layout-terminal-dense -->
  <!-- @taxonomy-coverage: [list every element_id you render] -->
  <!-- @style-direction: terminal data-dense -->
  ```

## Constraints

- No external CSS files, no build step, no JS framework.
- Monospace must be obvious (do not silently fall back to a sans-serif).
- Portuguese-first labels (rendered in mono — that's fine).
- Do not invent schema fields — log gaps as findings.

## Output Format

Append to `../agents-findings.md`:

```markdown
## Agent 05 — ui-template-terminal-dense

**Status:** complete
**Deliverable:** deliverables/templates/layout-terminal-dense.html
**Lines of code:** N
**Taxonomy coverage:** X / Y elements rendered

**Style decisions:**
- (chosen accent color, mono font, graph treatment)

**Schema gaps encountered:**
- ...

**Trade-offs taken:**
- ...
```

## Done When

Opening the HTML reads instantly as "terminal" — anyone glancing at it would say "that's a CLI dashboard" — and is unambiguously distinct from the other three sibling templates.
