---
tags: [domain-knowledge, creatives, performance-marketing]
node_type: readme
is_session: false
layer: ontology, domain
nature: reference
status: draft
version: 0.3.1
last_updated: 2026-05-16
---

# Domain Knowledge — Creative Operations

## What is this?

The knowledge graph for the **Creative Operations** domain: how creatives are produced, distributed, measured, and retired in performance-marketing campaigns. Organized into axioms, premises, constitutions, conceptual context, specs, dictionaries, audits, discoveries, and backlogs that together form the epistemic substrate of the Creative Manager system.

## Business Context

Insider's Performance Marketing team operates creatives as a continuous flywheel: source → produce → distribute → measure → retire. This folder captures the shared mental model that team — what is taken as foundational, what is bet on, what is enforced, and what is still open — so that the Creative Manager product is built on an explicit and challengeable substrate rather than implicit consensus.

## Why it matters

Without this graph, every product decision re-derives its own assumptions. With it, premises are testable, constitutions are enforceable, and discoveries have a place to land before being ratified. It also separates **knowledge** (what we know/believe about creatives) from **product** (what the Creative Manager does about it) — keeping the two from contaminating each other.

## 📁 Navigation

- **[domain-dictionary.md](domain-dictionary.md)**: Canonical glossary of creative-operations concepts (entities, attributes, lifecycle, sourcing, attribution, generative ops).
- **[metrics-dictionary.md](metrics-dictionary.md)**: Flat registry of numeric metrics with formulas, units, dependencies, and parseable YAML entries.
- **`axiom/`**: Foundational commitments about creatives.
- **`premise/`**: Working hypotheses with `convicção` / `veracidade`.
- **`constitution/`**: Enforceable rules (winning classification, removal rule, attribute schema).
- **`conceptual/`**: Background context — how Insider thinks about performance marketing and how creatives flow.
- **`spec/`**: Behavioral specs — narrative explanation of metric relationships (complements `metrics-dictionary.md`).
- **`audit/`**: Retrospective evaluations of ratified rules.
- **`discovery/`**: Open investigations preceding ratification (segmentation, removal A/B, embedding applications).
- **`backlog/`**: Pending schema / implementation work queued against ratified constitutions.

## Source Material

Seeded from seven primary artifacts internal to Insider's Performance Marketing team:

| Artifact | Role in the graph |
|---|---|
| `Criativos em Performance Marketing.pdf` | Conceptual — historical context, Insider's operating principles, flywheel |
| `Apresentação Criativos - Perf. Marketing.pdf` | Conceptual — fluxos, métricas, stakeholder-facing overview |
| `Creatives Manager - Google Docs.pdf` | Founding premise document for the Creative Ops area |
| `Criativo Vencedor - Google Docs.pdf` | Source for `constitution/winning-creative-constitution.md` |
| `Regra de Remoção Criativos.pdf` | Source for `constitution/creative-removal-constitution.md` |
| `TRAMA_ Projeto Explore.pdf` | Source for `constitution/creative-attribute-constitution.md` |
| `ccb-consig-template*.pdf` | Example creative assets from an adjacent vertical (Capital Consig). Reference only. |

## Conventions

All rules from [`claude/skills/custom/frontmatter-semantics.md`](../claude/skills/custom/frontmatter-semantics.md) apply verbatim. In particular:

- Every node carries required frontmatter (`node_type`, `layer`, `nature`, `status`, etc.)
- `axiom` / `premise` / `discovery` / `audit` documents declare `veracidade` and `convicção`
- Edges are declared in the `## Connections` section of each document
- The Orthogonality Principle governs whether a new document earns its place

## Maturity Posture

All documents currently enter at `draft` or `exploratory`. Promotion to `consolidated` requires backtests or production evidence (for premises), formal ratification (for constitutions), or resolution of the open questions listed in each document. Until then, treat this graph as the best current articulation — useful as shared context, not as ground truth.
