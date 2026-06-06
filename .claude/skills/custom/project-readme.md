---
description: How to write and maintain a repository-ROOT README — the project front door (context + navigation). Sibling to readme-pattern (which covers /specs/ folder indexes).
---

# Project README Pattern (repo root)

A repo-root `README.md` is the **front door** of a repository: it tells the project's story (what / why) and maps where everything lives. This is a different document from a `/specs/` folder index — see the sibling skill `readme-pattern` for those.

**Shared philosophy (inherited from `readme-pattern`):** a README is *exclusively* for context and navigation. It must **never** contain a backlog, tech-debt list, actionable TODOs, "future work" task lists, or unstructured feature requests. Open questions are allowed only as *framing* (what the project will decide), never as a work list — those belong in an issue tracker or a proposal.

## Core rules

1. **Lead with the big picture and why it matters — stated generally.** The opening must let a newcomer grasp *what this repo is and why it matters* in the first sentences, at the conceptual level: the stakes, the general phenomenon, what is at risk or unlocked. Explain relevance abstractly; do not lean on a single concrete scenario to carry it.
2. **Be wary of concrete toy examples — especially in conceptual / research work.** A contrived example ("a user asks the agent to do X with value Y") trivializes or distorts a general claim, and a skeptical reader fixates on whether the scenario is realistic instead of the point. Prefer naming the general class of cases and the stakes. Use a concrete example *only* when it generalizes cleanly and earns its place; never open on one, and never invent an unrealistic one to seem relatable.
3. **Plain language before notation.** Introduce the idea in words; introduce symbols/jargon (`η^sch`, formal terms) only after the plain version exists.
4. **Navigation is an annotated tree, not prose.** Show the structure as a text-tree where every entry is `path` + an inline one-line description of what lives there. A newcomer should locate any concept in seconds. Mark artifacts that do not exist yet (git-ignored, not generated) inline so absence is expected.
5. **Link, don't duplicate.** Point to sibling repos, proposals, and source-of-truth docs by their *relationship* in one line each; never restage their content.
6. **Label status honestly.** If nothing has run / shipped, say so once, near the top, as a blockquote — and list what *does* exist vs. what doesn't. For experiments, mark every figure as a prediction, not a measurement.

## Required structure (ordered)

```
---
frontmatter (house style): tags, node_type, layer, nature, status, version, last_updated
---

# <repo-name>
  → 1–2 sentences: the big picture — what this repo is and why it exists. High-level, plain.

> STATUS callout (blockquote, immediately under the title, when relevant)
  → what exists vs. what doesn't; for experiments: "nothing run yet, figures are predictions"

## What is this? / The problem
  → the context at high altitude; the concrete illustrating example goes HERE, after the framing

## [project-specific narrative]
  → e.g. the idea / hypothesis / approach. For an experiment: hypothesis → design → the call.
    Use a table for conditions/arms or options with a plain-language column.

## 📁 Repository structure
  → ONE annotated text-tree; every dir/file + inline one-line purpose; mark not-yet-existing artifacts

## Where to start
  → an ordered 3-item reading path for a newcomer

## Related repositories / work
  → one line per related repo, by relationship; deep-link specifics, don't duplicate

## (project-specific tail)
  → reproducibility & cost, quick start, license, etc. — as the repo warrants

## (optional, gated) For the <specialist> inclined
  → deep/formal material behind its own heading so non-specialists can skip; state it ONCE here,
    never repeated across multiple sections
```

The middle sections (narrative, tail) flex by repo type — library, framework, experiment, theory. The **fixed spine** is: big-picture opener → status (if relevant) → what/why → annotated structure tree → where to start → related repos.

## Navigation tree format

Use a text-tree with column-aligned inline descriptions (the cleanest format for "where is everything"):

```
repo-name/
  PROPOSAL.md        the frozen protocol and the source of truth — read this first
  configs/           the run specs; each is one exact objective
    config_a.yaml      baseline condition
  src/pkg/           core implementation
    core.py            the main entry point
  results/           git-ignored; appears only once the pipeline runs
```

## Agent directives

- **Big picture before concrete** — if a draft opens on a specific example without framing, rewrite the opener.
- **Dedupe** — if the same idea (e.g. a proof, a claim) appears in more than one section, consolidate it into one (gate deep material behind its own heading).
- **Update the tree** — when files/dirs are added or removed, update the structure tree in the same change.
- **No backlog creep** — strip any TODO / known-issues / future-work list; that is not what a README is for.