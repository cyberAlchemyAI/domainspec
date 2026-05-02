---
agent_id: ui-element-researcher
phase: 1
order: 1
parallel_group: none
status: not-started
---

# Agent 01 — UI Element Researcher

## Role

Define the complete taxonomy of semantic elements in the app-release chat workspace, design the shared data contract that all UI variants will consume, and specify the parent↔template injection handshake.

## Mission

You are the **contract author**. Four downstream template-generator agents will build completely different UIs, but every one of them depends on the contract you produce here. If your taxonomy misses an element, every template misses it. If your schema is ambiguous, every template will diverge in interpretation.

You write the source of truth. Be exhaustive and precise.

## Inputs You Must Read

1. `implementation/app-frontend/visualizations/app-release/index.html` — current monolithic UI; extract every visible element.
2. `implementation/app-frontend/visualizations/app-release/app.mjs` — frontend controller; extract every state field and event the UI listens for.
3. `implementation/app-frontend/visualizations/app-release/server.mjs` — backend; identify every endpoint and SSE event type.
4. `implementation/app-frontend/docs/features/app-release/interfaces.md` — declared interfaces.
5. `implementation/app-frontend/docs/features/app-release/events.md` — SSE event catalogue.
6. `implementation/app-frontend/docs/features/app-release/SPEC.md` § Phase 1 Surface — concept registry.
7. `app-launch/visualizations/newspaper/docs/protocol/data-exchange-protocol.md` — REFERENCE for how a payload contract is documented (style guide, not content).
8. `app-launch/visualizations/newspaper/evolution/index.html` and 2–3 `gen_*.html` files — reference for how templates consume `window.parent.currentPayload`.

## Deliverables (write into `../deliverables/`)

### 1. `ELEMENT-TAXONOMY.md`

A table of every semantic element with columns:
| element_id | purpose | required/optional | data dependencies (fields from schema) | example states |

Plus a section "Element relationships" describing parent/child or co-occurrence rules (e.g., a `tool-use-box` is always nested inside a `message` of role `agent`).

### 2. `CHAT-PAYLOAD-SCHEMA.md`

- Full JSON schema (informal, like newspaper's protocol doc — readable, with rules in prose)
- Concrete example payload covering every element state
- Validation rules per field (types, enums, optional/required)
- Versioning policy (`version: "1.0.0"` field, change log placeholder)
- A `mockPayload` block templates can copy verbatim for standalone testing

### 3. `INJECTION-CONTRACT.md`

- How the parent page sets `window.chatPayload`
- How templates read it (`window.parent.chatPayload`) with a defined fallback to local `mockPayload`
- The `postMessage` event names for live updates (`payload-update`, `tool-use-progress`, `session-status-change`, etc.)
- How SSE → parent → templates propagation works (parent fans out via postMessage; templates do NOT open SSE themselves)
- Error handling: what should a template do if `window.parent.chatPayload` is undefined?

## Output Format

When you finish, append to `../agents-findings.md`:

```markdown
## Agent 01 — ui-element-researcher

**Status:** complete
**Deliverables:**
- deliverables/ELEMENT-TAXONOMY.md (N elements)
- deliverables/CHAT-PAYLOAD-SCHEMA.md (vX.Y.Z, M fields)
- deliverables/INJECTION-CONTRACT.md

**Surprising findings:**
- ...

**Decisions made:**
- ...

**Open questions for human:**
- ...
```

## Constraints

- Do not modify any backend code or interface. If today's API can't satisfy your schema, log that as a finding — do not auto-fix it.
- Do not propose visual styles. Style is the next phase's job.
- Do not produce more than one schema variant. One contract, ratified.
- Keep examples concrete (real session UUIDs, real timestamps, real tool names). Avoid `<placeholder>` text.

## Done When

The four template-generator agents could read your three deliverables and produce a working UI without ever asking you a clarifying question.
