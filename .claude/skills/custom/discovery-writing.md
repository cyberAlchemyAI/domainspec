---
description: How to write a discovery document — problem space, design decisions, and implementation detail.
---
# Discovery Writing

## Purpose

A discovery captures the problem space, design decisions, and enough detail for an agent to write an implementation plan. It is **not a task list**. A discovery answers "what are we changing and why" — an implementation plan answers "how, step by step."

If the output of this session is a list of tasks, you are writing an implementation plan, not a discovery.

---

## Frontmatter Template

Check `frontmatter.md` for how to create the frontmatter.

---

## Mandatory Document Structure

Sections must appear in this order. Do not skip or reorder them.

### Objective (≤3 sentences, required first)

What is being changed and what the end state looks like. No motivation here — that goes in Business Context.

**Quality gate:** If you cannot write this in 3 sentences, the scope is unresolved. Stop and clarify with the user before continuing.

---

### 1. Business Context

Three subsections, all required:

**Why now** — The triggering condition: a business rule that cannot be expressed, a failure in production, an architectural constraint that blocks future work. One concrete paragraph. No speculation.

**What's broken** — Enumerate each problem with a specific location (`file.py:line` or `ClassName.method`). A problem without a location is unverified.

**What stays the same** — Explicit scope boundary: list the assets, models, and behaviors that are out of scope. An unnamed boundary is an unbounded scope.

---

### 2. Core Concepts

Introduce the new abstractions and key design decisions. Short code sketches are appropriate here when they communicate the contract clearly. This section answers "what and why" — save step-by-step detail for later sections.

Each concept should have:
- A name
- What it does (one sentence)
- Why this design was chosen over alternatives (if non-obvious)

---

### 3–N. Detailed Specifications

One section per area of change. Typical sections (use what applies):

- **Data model changes** — schema diffs, migration strategy, index changes
- **Interface / API contracts** — new base classes, method signatures, port definitions
- **Service / execution flow** — sequence of operations, what changes vs. today (a before/after table is often clearest)
- **Cleanup** — what gets deleted, with location and reason
- **Open questions** — unresolved items; each must include a recommendation, not just a question

---

## Quality Checks Before Finishing

- [ ] Objective written before any other section
- [ ] Every item in "What's broken" has a specific file location
- [ ] "What stays" is non-empty (unbounded scope = future rework)
- [ ] Open questions include recommendations, not just questions
- [ ] No implementation steps disguised as design decisions — if it's "do X then Y", it belongs in an implementation plan

---

## Navigation

Before writing, anchor the discovery to existing vocabulary:
- **New concepts**: check `docs/vault/dictionary-business.md` and `docs/vault/dictionary-sys.md` — do not invent a term that already exists
- **Architecture rules**: check `docs/vault/constitution/` — a design that violates a constitution must be called out explicitly in the discovery, not silently ignored
- **Code reality**: use GitNexus (`gitnexus_query`) to verify that the "what stays" list is accurate — claimed scope boundaries that don't match the code are liabilities