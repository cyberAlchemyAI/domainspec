---
description: How to write a subagents-research document — one file per dispatch, verbatim child returns assembled under per-child headers.
---
# Subagents Research Writing

## Purpose

A `subagents-research` document records the **verbatim returns of every child agent in a single domainspec-subagents-strategy dispatch**, assembled into **one file per dispatch** under stable per-child headers (`## Agent N — <one-line brief>`).

One dispatch → one `domainspec-research.md` file → multiple `## Agent N — ...` sections.

This file is **not** written by the child agents and **not** written by the strategist. The strategist collects each child's return verbatim, then dispatches the `domainspec-research-writer` agent, which receives the collected returns plus the original Context + Goal and assembles this single file (constitution R3 step 5, R5).

If you find yourself reconciling claims across children, summarizing a child's output, or producing one file per child — stop. The first two are findings work; the third is a constitution violation (R3, R5, R15, R23).

---

## Frontmatter

Check `.claude/skills/custom/frontmatter.md`. For this node_type:

- `node_type: subagents-research`
- `is_session: false`
- Standard `layer` / `nature` / `status` per the active dispatch's working folder context.
- Omit `veracidade` and `convicção` — research is evidence, not a claim. Confidence over the synthesized picture lives in `domainspec-findings.md`, not here.

---

## Edges

Check `.claude/skills/custom/edges.md` for the canonical edge patterns. This file does not invent edges; it points at the catalog.

Typical edges for a `domainspec-research.md` file are governed there (e.g., the chain back to the dispatch's authorizing context, and the inverse relation that `domainspec-findings.md` declares when it cites the per-child sections inside this file).

---

## Mandatory Document Structure

Sections must appear in this order. Do not skip or reorder. Mirrors `templates/domainspec-research.md`.

### Context (required, R23)

Where the need for this dispatch arose: the situation, the upstream artifact or conversation, the question that surfaced, why a single inline investigation was insufficient. 2–4 sentences.

### Goal (required, R23)

What this dispatch is trying to achieve. Stated concretely enough that Coverage (R21, evaluated later in `domainspec-findings.md`) can be graded against it. 1–2 sentences.

### `## Agent N — <one-line brief>` (one per child, in dispatch order)

One section per child agent the strategist dispatched. Header format is exact: `## Agent N — <brief>` so that the slug `agent-n--brief` is a stable anchor for `domainspec-findings.md` citations (R17).

The body of each section is the **child's return verbatim**:

- Do **not** edit, summarize, paraphrase, reformat, or "tidy up."
- If the child returned its own structured subsections (Findings, Gaps, Limits, etc.), preserve them as-is.
- If the child returned messy prose, that messy prose is the artifact. Fidelity beats neatness.

There is no shared "Findings" or "Limits and Gaps" section across children at this layer — each child's return stands alone in its own section. Cross-child synthesis lives in `domainspec-findings.md`.

---

## Anti-Patterns (constitution-blocking)

Each of the following violates the constitution and produces a malformed artifact:

- **One file per child.** Forbidden. The dispatch produces exactly one `domainspec-research.md` containing N `## Agent N — ...` sections (R3, R5, R15).
- **Writing to a vault path.** Forbidden. The file lives in `<working_folder>/research/domainspec-research.md` per R15. The vault is reserved for codified discipline; per-dispatch artifacts never enter it directly.
- **Editing, summarizing, or reformatting child output.** Forbidden. The writer agent transcribes; it does not curate. Summarization destroys the audit trail R17 depends on.
- **Cross-child synthesis in this file** ("Agent A said X but Agent B said Y", reconciliation, tensions, implications). Forbidden here. That work belongs in `domainspec-findings.md` (R16).
- **Inserting a Dispatch record** (mode, per-agent table, budgets, grade). Forbidden here. The Dispatch record schema (R18) lives in `domainspec-findings.md`, not in research.
- **Children writing this file directly.** Forbidden. Children return text; only the `domainspec-research-writer` agent persists (R5).

---

## Quality Checks Before Finishing

- [ ] Exactly one file produced for the dispatch — no per-child files.
- [ ] File path is under `<working_folder>/research/`, not under `vault/`.
- [ ] `## Context` and `## Goal` sections present, in that order, before any `## Agent N` section.
- [ ] One `## Agent N — <brief>` section per child the strategist dispatched, in dispatch order, with exact header format.
- [ ] Each agent section contains the child's return verbatim — no edits, no summary, no reformatting.
- [ ] No cross-child reconciliation, no tensions, no implications, no Dispatch record in this file.
- [ ] Frontmatter has `node_type: subagents-research`, `is_session: false`, no `veracidade`/`convicção`.

---

## Navigation

- Constitution: `vault/constitution/domainspec-subagents-strategy-constitution.md` (R3, R5, R15, R17, R18, R23)
- Template: `templates/domainspec-research.md`
- Frontmatter cheatsheet: `.claude/skills/custom/frontmatter.md`
- Edge catalog: `.claude/skills/custom/edges.md`
- Findings counterpart: `.claude/skills/custom/domainspec-subagents-findings-writing.md`
- Node-type semantics: `.claude/skills/custom/frontmatter-semantics.md`