---
tags:
  - architecture
  - governance
  - git
layer: architecture
nature: procedural
status: draft
audience: agent, engineer
version: 1.0.0
last_updated: 2026-04-07
node_type: constitution
is_session: false

---

# Constitution: Commit Messages

> Every commit is a historical record. A well-written commit lets any engineer or agent understand *what* changed, *why*, and *what it touched* — without reading the diff.

---

## Objective

This document is the **enforceable rulebook** for all commit messages. It answers the question: *"How must every commit be written so the git history remains useful, searchable, and traceable?"*

---

## Index

1. [Rule 1 — Prefix](#rule-1--every-commit-starts-with-a-type-prefix)
2. [Rule 2 — Subject Line](#rule-2--the-subject-line-is-a-concise-what)
3. [Rule 3 — Body: What Changed](#rule-3--the-body-explains-what-changed-and-why)
4. [Rule 4 — Files](#rule-4--list-code-files-created-or-modified)
5. [Rule 5 — Tests](#rule-5--describe-test-changes-when-applicable)
6. [Rule 6 — Ref](#rule-6--reference-the-originating-document-when-one-exists)
7. [Template](#template)
8. [Examples](#examples)
9. [Anti-Patterns](#anti-patterns)
10. [Governance](#governance)

---

## Rule 1 — Every commit starts with a type prefix

The first token of the subject line MUST be one of:

| Prefix | When to use |
|---|---|
| `feat:` | New functionality visible to users or other systems |
| `fix:` | Bug fix or correction of incorrect behavior |
| `refactor:` | Internal restructuring that does not change external behavior |

No other prefixes are allowed. If a commit doesn't fit any of these three, it likely needs to be split or reclassified.

---

## Rule 2 — The subject line is a concise *what*

- Maximum 72 characters (prefix included).
- Written in imperative mood ("add", "remove", "strip" — not "added", "removes").
- Describes the change at the right abstraction level: not too vague ("update code"), not too granular ("change line 42 in views.py").
- No trailing period.

---

## Rule 3 — The body explains what changed and why

A blank line separates the subject from the body. The body MUST be present for any non-trivial commit and should answer:

- **What** was changed — describe the modification in concrete terms.
- **Why** — the motivation, business reason, or problem being solved.
- **Impact** — quantify when possible (e.g., "reduces payload by ~80%", "eliminates N+1 query").

Keep it factual and direct. Wrap lines at 72 characters.

---

## Rule 4 — List code files created or modified

**Required when applicable.** After the body, include a `Files:` section listing the code files that were created or modified.

Rules:
- Only production code — exclude test files, documentation, and config.
- Use relative paths from the repository root.
- Mark each file as `(created)` or `(modified)`.

```
Files:
- domains/aquisicao/interfaces/views.py (modified)
- frontend/src/pages/contratos-tabs/BulkImportTab.jsx (modified)
```

May be omitted when the commit touches a single file and the subject already makes the location obvious.

---

## Rule 5 — Describe test changes when applicable

**Required when tests were added, modified, or removed.** Include a `Tests:` section summarizing what changed in the test suite.

Focus on *what* was validated or removed, not on file paths:

```
Tests:
- Removed assertion for extracted_data key in list response
- Deleted test_document_includes_ocr_text_field (no longer relevant)
- Added negative assertions confirming stripped fields are absent
```

---

## Rule 6 — Reference the originating document when one exists

**Required when the commit traces to a spec, discovery, backlog, or implementation plan.** Add a `Ref:` line at the end:

```
Ref: specs/refactor/docs/frontend-page-load/page-load-discovery.md §Fix 1
```

Use the relative path and, when useful, a section anchor (`§Section Name`) to point to the specific part of the document.

---

## Template

```
<prefix>: <subject line, max 72 chars, imperative mood>

<Body: what changed, why, and impact. Wrap at 72 chars.>

Files:
- path/to/file.py (created|modified)

Tests:
- <what was tested, added, or removed>

Ref: <path/to/originating-document.md §Section>
```

---

## Examples

### Full commit (multiple files, tests, spec reference)

```
fix: strip extracted_data/ocr_text from bulk import list response

Remove extracted_data and ocr_text from BulkImportDetailView.get()
to reduce response payload by ~80-90%. Modify openPreview in
BulkImportTab.jsx to fetch document metadata from the detail
endpoint in parallel with the file blob.

Files:
- domains/aquisicao/interfaces/views.py (modified)
- frontend/src/pages/contratos-tabs/BulkImportTab.jsx (modified)

Tests:
- Removed extracted_data key assertion from list response test
- Deleted test_document_includes_ocr_text_field
- Added negative assertions confirming stripped fields are absent

Ref: specs/refactor/docs/frontend-page-load/page-load-discovery.md §Fix 1
```

### Minimal commit (single file, no tests, no spec)

```
fix: correct CNPJ validation rejecting valid 00-prefixed inputs

The regex pattern was stripping leading zeros before length check,
causing valid CNPJs starting with 00 to fail validation.

Files:
- domains/aquisicao/domain/validations.py (modified)
```

### Refactor (no behavior change)

```
refactor: extract PDF coordinate mapping into dedicated module

The document ingestion pipeline mixed orchestration with low-level
PDF coordinate logic in a single function. Extracted coordinate
mapping to its own module to respect SLA principle.

Files:
- domains/documents_validation/domain/pdf_coordinates.py (created)
- domains/documents_validation/domain/ingestion.py (modified)
```

---

## Anti-Patterns

| Anti-Pattern | Why it's wrong |
|---|---|
| `fix: update code` | Subject too vague — says nothing about what changed |
| `feat: added new feature for the bulk import page to handle errors better and show toast` | Too long, past tense, describes UI details instead of the behavior |
| `refactor: refactor` | Tautological — the prefix already says refactor |
| Omitting the body on a multi-file commit | Impossible to understand intent without reading the diff |
| Listing every `.md`, `.json`, config file in Files | Noise — only production code matters here |
| `fix: stuff` | No information content |

---

## Governance

- This constitution follows the same amendment process as `development-practices-constitution.md`: PR + maintainer review + semantic versioning.
- Agents MUST follow this constitution for every commit they produce.
- Human engineers SHOULD follow it; reviewers may request message rewrites on PRs.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[development-practices-constitution]] | `derives-from` | Inherits governance process and agent autonomy rules |
| [commit-message (skill)](../../../.claude/skills/commit-message/SKILL.md) | `operationalizes` | Slash-command skill: `/commit-message` |
