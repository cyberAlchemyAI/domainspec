---
name: close-session
description: Close a session and create a vault conversation node
---

# Close Session Workflow

> **Classification source of truth:** `docs/vault/ontology-conventions.md`.

---

## Step 0 — Triage

**Create a node if any is true:** vault doc changed/created/deleted, domain code changed, architectural decision made, tests added/modified, contradiction found/resolved.

**Skip if:** no vault/code changes AND purely Q&A with no decisions. Say *"Q&A-only session. No vault node created."* and stop.

**Scratchpad:** Check `claude/current_conversations/` for a session file. If found, use it as primary input and delete it after saving the node.

---

## Step 1 — Write Summary (do this yourself)

Write **2–4 sentences**: what the session set out to do, what was decided (and why), what was done. No sub-headings, no per-file detail. A reader should grasp the arc without access to the conversation.

---

## Step 2 — Delegate classification to Sonnet

Spawn an Agent (model: sonnet) with your summary + list of files touched. It returns:

1. **node_type** (first match wins): constitution → premise → conceptual → test → discovery → implementation-plan → audit → spec (fallback).
2. **tags, layer, nature** per `ontology-conventions.md`.
3. **expected_importance** (0–10) + **importance_rationale** (one sentence).
4. **Contradictions** — only if a vault node was validated, contradicted, or questioned. One bullet per edge. Omit section if none.
5. **Files touched** — flat list of paths, no descriptions. Git has the detail.

---

## Step 3 — Assemble the node

File: `docs/vault/conversations/YYYY-MM-DD-HHMM-{short-slug}.md`

```markdown
---
tags: [{tag1}, {tag2}]
node_type: {type}
is_session: true
layer: {layer}
nature: {nature}
status: active
created: YYYY-MM-DD
timestamp: YYYY-MM-DDTHH:MM:SS±HH:MM
expires: {created + 60 days}
conversation_id: {id}
decisions_made: true | false
contradictions_found: true | false
specs_updated: [paths or []]
promoted_candidates: [nodes or []]
expected_importance: {0-10}
importance_rationale: "{sentence}"
---

# {Title}

## Summary

{2–4 sentences from Step 1}

## Contradictions

{Omit if none. One bullet per edge: "validates/contradicts/questions {node} — reason."}

## Files touched

{Flat bullet list of paths. No table, no descriptions.}
```

> **Hard cap:** The body (below frontmatter) must not exceed **30 lines**. If it does, you are writing too much — cut.
