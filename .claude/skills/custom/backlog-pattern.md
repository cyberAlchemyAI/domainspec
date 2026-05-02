---
description: How to write and format a Backlog specification file
---

# Backlog Pattern Workflow

When you are asked to create or update a backlog file (e.g., `backlog-ccb.md`, `backlog-ontology.md`), you **MUST** strictly adhere to the following pattern. A backlog is not just a list of ideas; it is a prioritized, categorized, and context-rich roadmap.

## 1. Frontmatter
Always include the standard ontology YAML frontmatter with `node_type: backlog`.

## 2. Document Structure
The document must start with an introductory paragraph, followed by a `## Backlog Categories` section that explicitly lists the priority-sorted categories to focus development efforts.

Use these standard categories (include only those relevant, but keep the order):
- **New Features**: Additions to the system capabilities.
- **User Experience (UX)**: Improvements to operational workflows and observability.
- **Architectural Resilience & Robustness**: Structural improvements to prevent silent failures and handle edge cases gracefully.
- **Bug Fixes & Correctness**: Fixes for explicitly broken logic or unhandled exceptions.
- **Technical Debt & Refactoring**: Code organization improvements and enforcing isolation constraints.
- **Completed / Done**: Items that have already been resolved globally or partially.

## 3. Item Formatting
Every item in the backlog **MUST** follow this exact template:

```markdown
## [YYYY-MM-DD] [PRIORITY] — Short but descriptive title — ❌ NOT DONE (or ✅ DONE)

**Context:**
A concise explanation of the problem, when it was identified, or what rule is missing. Why are we doing this?

**What needs to be done:**
- Bullet point 1 of action to take.
- Bullet point 2 of action to take.
- Clear success criteria.

**Affected files:**
- `path/to/file1.py` — short explanation of what changes here.
- `path/to/file2.md` — shorter explanation.
```

## 4. Maintenance Rules
- **Status tracking:** Use the `❌ NOT DONE` or `✅ DONE` flag in the title of the item. When an item is completed, move it to the **Completed / Done** category or update its flag.
- **Separators:** Group items visually under their respective category (`# New Features`, `# Technical Debt & Refactoring`, etc.) and separate individual items using `---` rules above and below the title.
