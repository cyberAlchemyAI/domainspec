---
description: Schema and patterns for creating and updating dictionary entries
---

# Domain Dictionary Skill

> Authority: `docs/vault/constitution/domain-tagging-constitution.md`

## When to Use

- When creating a **new business or system concept** entry in the dictionary
- When updating an existing dictionary entry with missing or incorrect fields
- When defining vocabulary that will be used for `@biz`/`@sys` code tags

---

## Dictionary Files

Entries belong in:
- `docs/vault/dictionary-business.md` — business domain concepts
- `docs/vault/dictionary-sys.md` — system/infrastructure concepts
- `docs/vault/dictionary-events.md` — events domain concepts

---

## Entry Structure

Every dictionary entry must be an **H3 heading** (`###`) followed by a description and optional alias bullets.

```markdown
### TermName

Natural language description explaining the concept clearly. One or more
paragraphs. Prose should answer "what is this?" and "why does it matter?"

- **Aliases in codebase:** `alias_one`, `alias_two`
- **Aliases in conversation:** `português name`, `other name`
```

---

## Required Fields

Every entry **must** have this. Commits are blocked if missing:

| Field | Format | Example |
|-------|--------|---------|
| **Description** | Prose paragraph(s) after the H3 heading | _"A stateless business rule that..."_ |

---

## Optional Fields

| Field | Format | Example |
|-------|--------|---------|
| **Aliases in codebase:** | Comma-separated identifiers | `eligibility_criteria, filter_criteria` |
| **Aliases in conversation:** | Comma-separated names | `filtro de elegibilidade, filter gate` |

> **Agent rule:** Do NOT populate aliases. Aliases must be provided by the user — they reflect real usage in the codebase and in conversations that only the user can confirm. If aliases are missing, leave the field out and ask the user to supply them.

---

## Complete Example

```markdown
### EligibilityFilter

A stateless, side-effect-free business rule that determines whether a remessa
or its installments may pass a specific eligibility check for a given fund.
Each filter is a subclass of the abstract EligibilityFilter base class.

- **Aliases in codebase:** `eligibility_criteria`, `filter_criteria`
- **Aliases in conversation:** `filtro de elegibilidade`, `filter gate`
```

---

## Structural Rules

- **H1** (`#`) — document title (one per file: "Business Dictionary" or "System Dictionary")
- **H2** (`##`) — category section (groups related terms: "Core / Shared", "Aquisição", "Documents & OCR")
- **H3** (`###`) — term name (one per entry; extraction pipeline requires this level)

**All terms must be H3 headings.** Using H4 or other levels will cause the extractor to miss them.

---

## Review Checklist

Before finalizing a dictionary entry:

- [ ] Description clearly explains what the concept is
- [ ] Aliases match real usage in codebase and conversations (if applicable)
- [ ] Entry is an H3 heading
- [ ] Entry is in the correct file (business vs. system)

---

## Multi-Term Problems

If you're trying to tag code but **no single term fits**:

1. Stop. Do not force the code under a wrong term.
2. Recognize the code might represent its own concept.
3. Add the new term to the dictionary here with full structure.
4. Then use `domain-tagging-code.md` skill to tag the code with the new term.

**Example:** `cross_check_fields` seemed to split between two terms, but was actually its own concept — `CrossCheck` was added as a new dictionary entry, and the tagging became clean.
