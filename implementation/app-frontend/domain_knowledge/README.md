---
tags: [domain-knowledge, creatives, performance-marketing]
node_type: readme
is_session: false
layer: ontology, domain
nature: reference
status: draft
version: 0.3.0
last_updated: 2026-04-22
---

# Domain Knowledge — Creative Operations

> Knowledge graph for the **Creative Operations** domain: how creatives are produced, distributed, measured, and retired in performance-marketing campaigns. Operates under the ontology defined in [`claude/skills/custom/frontmatter.md`](../claude/skills/custom/frontmatter.md) (schema + pickers) and [`claude/skills/custom/frontmatter-semantics.md`](../claude/skills/custom/frontmatter-semantics.md) (tag and value meanings).

---

## Objective

This folder answers the question: *"What do we know, believe, and enforce about creative operations — and how confident are we in each piece of it?"*

It separates:

- **Axioms** — foundational commitments about creatives we take as given
- **Premises** — working bets about how creatives behave, with explicit `convicção` / `veracidade`
- **Constitutions** — enforceable rules (winning creative classification, removal rule, attribute schema)
- **Conceptual** — background context that makes the rules interpretable (performance marketing, sourcing flows)
- **Spec** — behavioral description of metrics and how they're calculated
- **Dictionary** — the ubiquitous language of the domain (concepts + metrics, paired)
- **Audit** — evaluations of ratified rules against production data
- **Discovery** — open questions before a rule or premise is ratified
- **Backlog** — prioritizable schema / implementation work queued against existing constitutions

This is not a product spec. It is the **epistemic substrate** on top of which the Creative Manager system is built.

---

## Source Material

This graph was seeded from seven primary artifacts, all internal to Insider's Performance Marketing team:

| Artifact | Role in the graph |
|---|---|
| `Criativos em Performance Marketing.pdf` | Conceptual — historical context, Insider's operating principles, flywheel |
| `Apresentação Criativos - Perf. Marketing.pdf` | Conceptual — fluxos, métricas, stakeholder-facing overview |
| `Creatives Manager - Google Docs.pdf` | Founding premise document for the Creative Ops area |
| `Criativo Vencedor - Google Docs.pdf` | Source for `constitution/winning-creative-constitution.md` |
| `Regra de Remoção Criativos.pdf` | Source for `constitution/creative-removal-constitution.md` |
| `TRAMA_ Projeto Explore.pdf` | Source for `constitution/creative-attribute-constitution.md` |
| `ccb-consig-template*.pdf` | Example creative assets from an adjacent vertical (Capital Consig / crédito consignado). Reference material; not authoritative for the graph. |

---

## Folder Structure

| File / Folder | Contents |
|---|---|
| `domain-dictionary.md` | Canonical glossary of creative-operations **concepts** (entities, attributes, lifecycle, sourcing, attribution, generative ops) |
| `metrics-dictionary.md` | Flat registry of **numeric metrics** with formulas, units, dependencies, and parseable YAML entries |
| `axiom/` | Foundational commitments about creatives |
| `premise/` | Working hypotheses, with `convicção` / `veracidade` |
| `constitution/` | Enforceable rules (winning classification, removal rule, attribute schema) |
| `conceptual/` | Background context — how Insider thinks about perf marketing, how creatives flow |
| `spec/` | Behavioral specs — narrative explanation of metric relationships (complements `metrics-dictionary.md`) |
| `audit/` | Retrospective evaluations of ratified rules (e.g., `removal-rule-backtest-2024.md`) |
| `discovery/` | Open investigations that precede ratification (segmentation, removal A/B, embedding applications) |
| `backlog/` | Prioritizable pending work against the ratified schemas |

---

## Conventions

All rules from [`claude/skills/custom/frontmatter-semantics.md`](../claude/skills/custom/frontmatter-semantics.md) apply verbatim. In particular:

- Every node carries required frontmatter (`node_type`, `layer`, `nature`, `status`, etc.)
- `axiom` / `premise` / `discovery` / `audit` documents declare `veracidade` and `convicção`
- Edges are declared in the `## Connections` section of each document
- The Orthogonality Principle governs whether a new document earns its place: it must contribute information that no other document recovers

---

## Maturity Posture

All documents in this folder currently enter at `draft` or `exploratory`. They have not yet been through formal review against production data. Promoting any of them to `consolidated` requires:

- Backtests or production evidence (for premises)
- Formal ratification (for constitutions)
- Resolution of open questions listed in each document

Until then, treat this graph as the **best current articulation** of how creative operations work at Insider — useful as shared context, not as ground truth.
