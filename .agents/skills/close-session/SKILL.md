---
name: close-session
description: Close a session and create a vault conversation node
---

# Close Session Workflow

> **Operational sources of truth:** `.Codex/skills/custom/frontmatter.md` + `.Codex/skills/custom/frontmatter-semantics.md` (classification), `.Codex/skills/custom/edges.md` + `.Codex/skills/custom/edge-catalog.md` (graph wiring).

---

## Step 0 — Triage

**Create a node if any is true:** vault doc changed/created/deleted, domain code changed, architectural decision made, tests added/modified, contradiction found/resolved.

**Skip if:** no vault/code changes AND purely Q&A with no decisions. Say _"Q&A-only session. No vault node created."_ and stop.

**Scratchpad:** Check `Codex/current_conversations/` for a session file. If found, use it as primary input and delete it after saving the node.

---

## Step 1 — Write Summary, Next Steps, Open Questions (do this yourself)

You hold the session context — write all three yourself; do **not** delegate them to the classifier (Step 2 does classification only).

- **Summary** — **2–4 sentences**: what the session set out to do, what was decided (and why), what was done. No sub-headings, no per-file detail. A reader should grasp the arc without access to the conversation.
- **Next Steps (recommendation)** — **1–5 bullets, priority-ordered**: the concrete recommended next actions, each a pointer (*what* + *where* — a file, command, skill, or decision owed). This is a recommendation, not a backlog dump — only steps that genuinely follow from this session. If none, write `- None.`
- **Open Questions** — the questions this session **raised but did not settle**, one line each, pointing at the artifact that would answer each where possible. Forward-only: a later session may resolve them (and can wire `closes-question` back to this node). If none, write `- None.`

Keep all three pointer-style and tight — they live under the body cap.

---

## Step 2 — Delegate classification to Sonnet

Spawn an Agent (model: sonnet) with your summary + list of files touched. **Brief it to load these skills as its source of truth before classifying**

- `.Codex/skills/custom/frontmatter.md` — required fields per `node_type` and the `node_type` priority order.
- `.Codex/skills/custom/frontmatter-semantics.md` — definitions and allowed values for every frontmatter tag (`layer`, `nature`, `tags`, `veracidade`, `convicção`, etc.).

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

## Next Steps

{1–5 priority-ordered bullets from Step 1, each a what+where pointer. "- None." if none.}

## Open Questions

{Questions raised but not settled, one line each, pointing at the resolving artifact where possible. "- None." if none.}

## Files touched

{Flat bullet list of paths. No table, no descriptions.}
```

> **Hard cap:** The body (below frontmatter, **excluding the `## Connections` block written in Step 4**) must not exceed **40 lines**. Next Steps and Open Questions stay pointer-style — if the body runs over, you are writing too much; cut.

---

## Step 4 — Bootstrap edges via domainspec-vault-metadata-curator

The session node's outbound edges must be wired into the graph **forward-only from the session**. Do NOT write the `## Connections` block yourself — delegate to the agent that owns the edge catalog.

> **Session edge rule (canonical doctrine: `vault/ontology-conventions.md` §8):**
> _Edges originating from a session node (`is_session: true`) are forward-only by source: they live on the session's `## Connections` block, but no inverse row is written on the target document. The auditor skips bidirectionality checks for edges whose source has `is_session: true`._

Spawn the `domainspec-vault-metadata-curator` agent in **`bootstrap <session-file-path>`** mode. Brief it with:

- **Session file path** (the file you just wrote in Step 3). The session has `is_session: true` in its frontmatter — the curator MUST recognize this and apply the forward-only rule (no inverse rows on targets).
- **Per-file edge intent** for every entry in "Files touched" — pick exactly one per file, derived from what actually happened in the session:
  - `creates` — new file produced this session (did not exist before).
  - `modifies` — edited a pre-existing file (any kind of edit, including added sections).
  - `consumes` — read or used as input without deriving new claims from it.
  - `revisits` — reconsidered the questions/decisions in the file without refuting them.
  - `closes-question` — resolved a `## Open Questions` item in a discovery.
  - `validates` / `contradicts` / `refutes` — for any file already named in the prose `## Contradictions` section, use the matching catalog edge.
- **Instruction**: do NOT use `AskUserQuestion` for anything covered by this brief. Only halt and ask if a target file's `node_type` makes the inferred edge illegal per the legality matrix in `.Codex/skills/custom/edge-catalog.md`, or if a target path does not exist on disk.

The curator will:

- Write the `## Connections` block on the session file using catalog edges only.
- **NOT** write any inverse row on any target file. Because the session source has `is_session: true`, edges are forward-only by source per `vault/ontology-conventions.md` §8 — target documents are not modified, and no `## Connections` block is added to a target that lacks one.
- Refuse to invent edges; flag illegal cases as `NEEDS_HUMAN`.

If the curator returns any `NEEDS_HUMAN` items, surface them to the user before considering the session closed. If it returns a regression report, halt and surface that immediately — do not proceed.
