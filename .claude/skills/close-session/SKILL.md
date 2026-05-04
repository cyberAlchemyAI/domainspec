---
name: close-session
description: Close a session and create a vault conversation node
---

# Close Session Workflow

> **Operational sources of truth:** `.claude/skills/custom/frontmatter.md` + `.claude/skills/custom/frontmatter-semantics.md` (classification), `.claude/skills/custom/edges.md` + `.claude/skills/custom/edge-catalog.md` (graph wiring).

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

Spawn an Agent (model: sonnet) with your summary + list of files touched. **Brief it to load these skills as its source of truth before classifying** 

- `.claude/skills/custom/frontmatter.md` — required fields per `node_type` and the `node_type` priority order.
- `.claude/skills/custom/frontmatter-semantics.md` — definitions and allowed values for every frontmatter tag (`layer`, `nature`, `tags`, `veracidade`, `convicção`, etc.).

It returns:

1. **node_type** — first match wins per the priority order in `frontmatter.md` (typically: constitution → premise → conceptual → test → discovery → implementation-plan → audit → spec fallback). If `frontmatter.md` defines a different order, follow `frontmatter.md`.
2. **tags, layer, nature** — per `frontmatter-semantics.md`. Use only values listed there.
3. **expected_importance** (0–10) + **importance_rationale** (one sentence).
4. **Contradictions** — only if a vault node was validated, contradicted, or questioned. One short prose bullet per finding (e.g. "validates `path/to/node.md` — reason"). This is human-readable narrative; the formal edge wiring is done in Step 4 by the curator. Omit section if none.
5. **Files touched** — flat list of paths, no descriptions. Git has the detail.

If a skill is missing or unreadable, the classifier should HALT and report. The skills are the operational references; the constitution is what they codify.

---

## Step 3 — Assemble the node

File: `vault/sessions/YYYY-MM-DD-HHMM-{short-slug}.md`

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

> **Hard cap:** The body (below frontmatter, **excluding the `## Connections` block written in Step 4**) must not exceed **30 lines**. If it does, you are writing too much — cut.

---

## Step 4 — Bootstrap edges via domainspec-vault-metadata-curator

The session node must be wired into the graph bidirectionally. Do NOT write the `## Connections` block yourself — delegate to the agent that owns the edge catalog.

Spawn the `domainspec-vault-metadata-curator` agent in **`bootstrap <session-file-path>`** mode. Brief it with:

- **Session file path** (the file you just wrote in Step 3).
- **Per-file edge intent** for every entry in "Files touched" — pick exactly one per file, derived from what actually happened in the session:
  - `creates` — new file produced this session (did not exist before).
  - `modifies` — edited a pre-existing file (any kind of edit, including added sections).
  - `consumes` — read or used as input without deriving new claims from it.
  - `revisits` — reconsidered the questions/decisions in the file without refuting them.
  - `closes-question` — resolved a `## Open Questions` item in a discovery.
  - `validates` / `contradicts` / `refutes` — for any file already named in the prose `## Contradictions` section, use the matching catalog edge.
- **Instruction**: do NOT use `AskUserQuestion` for anything covered by this brief. Only halt and ask if a target file's `node_type` makes the inferred edge illegal per the legality matrix in `.claude/skills/custom/edge-catalog.md`, or if a target path does not exist on disk.

The curator will:
- Write the `## Connections` block on the session file using catalog edges only.
- Write the inverse row on every target file (adding a `## Connections` block to any target that lacks one).
- Refuse to invent edges; flag illegal cases as `NEEDS_HUMAN`.

If the curator returns any `NEEDS_HUMAN` items, surface them to the user before considering the session closed. If it returns a regression report, halt and surface that immediately — do not proceed.
