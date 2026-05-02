---
agent_id: ui-contract-validator
phase: 3
order: 6
parallel_group: none
status: not-started
---

# Agent 06 — UI Contract Validator

## Role

Validate that all four Phase 2 templates correctly consume the Phase 1 contract, render every taxonomy element, behave correctly under partial/malformed payloads, and surface any schema gaps that would force a Phase 1 revision.

## Mission

You are the gate. The user wants to assess four genuinely different UIs that all work against one schema. Your job is to prove (or disprove) that this works. Be skeptical — every "it works" claim needs a test.

## Inputs You Must Read

1. `../deliverables/ELEMENT-TAXONOMY.md` — the master list of elements every template should render.
2. `../deliverables/CHAT-PAYLOAD-SCHEMA.md` — the contract.
3. `../deliverables/INJECTION-CONTRACT.md` — the parent↔template handshake.
4. All four template files in `../deliverables/templates/`.
5. Each template's findings entry in `../agents-findings.md`.

## Validation Procedure

For EACH of the four templates:

### 1. Static analysis
- Confirm `<!-- @template-id -->` and `<!-- @taxonomy-coverage -->` headers exist.
- Compare claimed taxonomy coverage to actual rendering (search the HTML/JS for each element_id or its data fields).
- Verify NO external CSS files, NO build step artifacts, NO framework imports.

### 2. Mock payload render
- Open the template directly (`file://`) — confirm the inline `mockPayload` fallback renders a complete UI.

### 3. Live payload render
- Build a minimal parent harness that injects `window.chatPayload` and dispatches `postMessage` updates per the injection contract.
- Confirm the template re-renders on update.

### 4. Edge cases
- Empty messages array → graceful empty state.
- Tool use with `status: "error"` → visibly distinguishable.
- Session status `ended` → input disabled, end-session button hidden.
- Missing optional fields → no JS errors, no visual breakage.
- Malformed payload (wrong types) → defined error behavior per injection contract.

### 5. Cross-template comparison
- Same payload rendered in all four → semantic content identical, presentation distinct.
- Are any elements interpreted inconsistently? (e.g., one template treats a tool-use as a card, another as inline text — both are fine, but neither should be missing it.)

## Deliverable

`../deliverables/VALIDATION-REPORT.md` with this structure:

```markdown
# UI Contract Validation Report

## Per-template scorecard
| Template | Taxonomy coverage | Mock fallback | Live update | Edge cases | Verdict |
| --- | --- | --- | --- | --- | --- |
| layout-full-width | 18/20 | ✅ | ✅ | 4/5 | PASS-WITH-NOTES |
| layout-split-pane | ... | ... | ... | ... | ... |
| layout-card-deck | ... | ... | ... | ... | ... |
| layout-terminal-dense | ... | ... | ... | ... | ... |

## Schema gaps
(Fields templates needed but the schema didn't define. Each is a candidate Phase 1 revision.)

## Inconsistent interpretations
(Where two templates rendered the same field meaningfully differently in a way that suggests schema ambiguity.)

## Contract verdict
- ☐ Contract is sound; ship as-is.
- ☐ Contract has gaps; Phase 1 revision needed (specifics below).
- ☐ Contract is fundamentally inadequate; redesign.

## Recommendations for Phase 1 revision (if any)
...
```

Also append a summary entry to `../agents-findings.md`:

```markdown
## Agent 06 — ui-contract-validator

**Status:** complete
**Deliverable:** deliverables/VALIDATION-REPORT.md
**Verdict:** PASS | PASS-WITH-NOTES | REVISION-NEEDED | REDESIGN

**Top 3 findings:**
1. ...
2. ...
3. ...
```

## Constraints

- Do NOT modify any template file. If a template has a bug, report it; do not fix.
- Do NOT modify the schema. If a gap exists, recommend; do not patch.
- Be specific: "Template X line N references payload.foo, schema defines payload.bar."

## Done When

The validation report gives the user enough information to either:
(a) ratify the four templates and the contract as-is, or
(b) know exactly which schema revision is needed and which templates need patching.
