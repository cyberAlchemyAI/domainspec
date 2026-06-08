---
name: research-review
description: Audit a completed research dispatch. Checks per-agent files are schema-conformant, dissent surfaced, files_created/modified exist on disk, references_consulted are a subset of upstream, closure_mark consistent. Returns accept | reject-with-notes | escalate. Invoked by /research at step 8 or standalone over an existing <corpus>/<topic-slug>/ folder.
---

# /research-review

Post-dispatch auditor.

## Input
Path to `<corpus>/<topic-slug>/` containing `dispatch.yaml`, `agents/*.md`, `research/findings.md` (writer artifact), `LEDGER.md` (if written).

## Output
`accept` / `reject-with-notes` (named items) / `escalate` (after one retry).

## Checklist

1. Every agent in spec has a file `agents/<NN>-<role>-<index>.md` on disk.
2. Each per-agent file has valid frontmatter: `agent_id`, `agent_name`, `layer_id`, `dispatch_id`, `role`, `model`, `decision`, `rationale`, `files_created`, `files_modified`, `references_consulted`, `dissent`, `closure_mark`.
3. Body section ≤ 200 words.
4. **Dissent capture** — if decisions in same layer materially differ, at least one agent has non-empty `dissent`. Layer with N≥3 and zero dissent records ⇒ false-consensus flag.
5. `files_created` and `files_modified` paths exist on disk.
6. Writer's `references_consulted` ⊆ union of upstream explorer/skeptic references (no new sources at synthesis time).
7. `closure_mark` consistency: writer doesn't upgrade beyond what upstream evidence supports.
8. Writer's claims appear in upstream per-agent files (no manufactured claims).
9. **Residue ledger present.** The writer artifact has a `## Residue ledger` with ≥1 row; every claim in the body maps to a row. A row with empty residue carries a `closed-*` mark + a citation — never an `open` mark. A row with non-empty residue is NOT stamped `closed-borrowing` — surviving residue is preserved, not demoted (subset rule binds both directions).

## Dispatch
`Agent(subagent_type: research-auditor)` with spec + per-agent files + this checklist.

## Skip rule
Skip if `composition` is `single + N=1 + explorer`. Otherwise mandatory.
