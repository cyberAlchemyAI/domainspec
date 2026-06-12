---
description: How to write a discovery document — problem space, design decisions, and implementation detail.
---
# Discovery Writing

## Purpose

A discovery captures the problem space, design decisions, and enough detail for an agent to write an implementation plan. It is **not a task list**. A discovery answers "what are we changing and why" — an implementation plan answers "how, step by step."

If the output of this session is a list of tasks, you are writing an implementation plan, not a discovery.

If the output is a corpus distillation, failure-mode taxonomy, or proposed revision to a constitution/premise/axiom, use `.claude/skills/custom/knowledge-discovery-writing.md` instead.

---

## Frontmatter Template

Check `.claude/skills/custom/frontmatter.md` for how to create the frontmatter.

---

## Edges

Check `.claude/skills/custom/edges.md` for how to wire the discovery into the graph via its `## Connections` block. A discovery typically declares `derives-from` toward the research/findings it stands on, `cites` toward any constitution it leans on, and `supersedes` toward the discovery it replaces (if any).

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

---

## Downstream — the structural views

A finished discovery is the **seed corpus** for three structural sibling views. Each mines this document instead of inventing from scratch, and the discovery comes first because it is the one input none of the three depend on each other for — it breaks their mutual bootstrap cycle (`system-view` needs `engineer-view`'s verdicts, `engineer-view` harvests `system-view`'s stances, `ontology-view` needs both):

- **`/ontology-view`** — types the domain as typed nodes + typed edges, making forbidden relationships *unconstructible* rather than merely asserted. Seeds from: the discovery's **Core Concepts** (→ typed nodes) and the relationships implied across its **Detailed Specifications** (→ typed edges, including the forbidden / reflexive cases).
- **`/system-view`** — re-narrates the shape at stakeholder altitude, *naming* every load-bearing stance without deciding it. Seeds from: the discovery's **Business Context** and **Core Concepts**.
- **`/engineer-view`** — *owns* the verdicts, resolving each named stance to exactly one decision row with a cited authority. Seeds from: the discovery's **design decisions** (→ RESOLVED rows) and **Open Questions** (→ OPEN / CRITICAL rows).

The discovery stays the load-bearing upstream document: if a view needs a fact the discovery does not carry, that is a **gap in the discovery**, not something the view may invent.

**The views are derive-only; this discovery is their sole mutation trigger.** A view is never hand-edited. To change a published view, **revise (or supersede) this discovery** and re-run the view's skill in **evolve mode** (`--mode draft` over the existing file), which *reconciles* the view against the change — preserving the view's own authored judgment (verdicts, guards, cited authorities) except where the delta forces a change. This is *reconcile-not-regenerate*: the views know things this discovery never will, so they are never rebuilt from scratch. Each view records the link as a `derives-from → discovery.md` edge in its `## Connections` block (inverse `derives` here), with the discovery `version` it was last reconciled against.

**Pull each view on demand, once this discovery has stabilized — not all at once, not the moment it is written.** A discovery is a living document; optimizing it *is* the right work until a view's specific need arises (a relationship that must be impossible → `ontology-view`; stances needing a single owning verdict → `engineer-view`; a stakeholder who must judge soundness → `system-view`). Authoring a view against a still-churning discovery just earns a reconcile on the next iteration.

> **Open question (drift):** once a view exists against this *living* discovery, later edits here can drift the view out of sync. The baseline is the discovery `version` recorded in each view's `## Connections` row; a `version` bump past that baseline marks the view STALE. The recommended mechanism is an audit-alignment-style drift check that *flags* stale views (not a hook that hard-blocks hand-edits) — not yet built. Owner: _unassigned_.