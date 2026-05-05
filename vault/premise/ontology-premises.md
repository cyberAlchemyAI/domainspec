---
tags: [ontology, vault]
node_type: premise
layer: ontology
nature: explanatory, technical
status: exploratory
veracidade: low
convicção: high
version: 0.1.0
last_updated: 2026-03-18
is_session: false

---

# Ontology Premises

> Working bets — informed hypotheses that guide decisions but must be revised as evidence accumulates. Each premise carries explicit `convicção` and `veracidade` levels.

---

## Objective

This document defines the **working hypotheses** of the ontology system. Unlike axioms (which are foundational commitments), premises are expected to change. They represent the team's current best guesses about how the classification system should work, and each one has a concrete test for falsification.

For the non-negotiable commitments that these premises build upon, see `ontology-axioms.md`.

---

## Index

1. [P-ONT-1 — 7 labels are sufficient](#p-ont-1--7-labels-are-sufficient)
2. [P-ONT-2 — The status hierarchy is linear and sufficient](#p-ont-2--the-status-hierarchy-is-linear-and-sufficient)
3. [P-ONT-3 — Veracidade and convicção are the only two confidence dimensions](#p-ont-3--veracidade-and-convicção-are-the-only-two-confidence-dimensions)
4. [P-ONT-4 — Sessions produce knowledge classifiable by the same labels](#p-ont-4--sessions-produce-knowledge-classifiable-by-the-same-labels)
5. [P-ONT-5 — Zero mutual information is practically achievable](#p-ont-5--zero-mutual-information-is-practically-achievable)
6. [P-ONT-6 — Frontmatter is the single source of truth](#p-ont-6--frontmatter-is-the-single-source-of-truth)
7. [P-ONT-7 — Density over granularity in the current phase](#p-ont-7--density-over-granularity-in-the-current-phase)
8. [P-ONT-8 — Sessions that generate higher-level documents must be kept forever](#p-ont-8--sessions-that-generate-higher-level-documents-must-be-kept-forever)
9. [P-ONT-9 — The classification system must adapt as the vault grows](#p-ont-9--the-classification-system-must-adapt-as-the-vault-grows)
10. [Connections](#connections)

---

## P-ONT-1 — 7 labels are sufficient

`convicção: medium` · `veracidade: low`

The 7 current labels (`node_type`, `layer`, `nature`, `status`, `veracidade`, `convicção`, `tags`) cover all dimensions necessary to classify any document in the vault. We do not need an 8th label.

> [!WARNING]
> This is the most fragile premise. "Sufficient" is a strong bet that must be constantly validated against the reality of the vault as it grows.

**How to test:** Monitor whether documents emerge that are ambiguous or misclassified *because a dimension is missing*, not because a label is misapplied. If the problem is recurrent and cannot be resolved by refining existing label values, a new label may be needed.

**Risk if wrong:** Documents will be forced into inadequate classifications, reducing search utility. But adding an 8th label is a controlled operation (apply AX-ONT-2 to validate orthogonality).

**Derives from:** AX-ONT-2 (orthogonal labels)

---

## P-ONT-2 — The status hierarchy is linear and sufficient

`convicção: high` · `veracidade: medium`

The lifecycle `draft → exploratory → active → consolidated → evergreen` is a linear progression, and that linearity is sufficient. We do not need branches, loops, or parallel states.

**How to test:** Check whether documents arise that "don't fit" the linear progression — for example, a document that needs to be simultaneously `active` and `exploratory` in different dimensions, or that needs an `archived` state separate from `deprecated`.

**Risk if wrong:** Documents get stuck in states that don't describe their real situation. The solution would be to add states or allow branches, not to abandon the lifecycle.

**Derives from:** AX-ONT-1 (minimize retrieval entropy — clear maturity states reduce ambiguity when filtering by trust)

---

## P-ONT-3 — Veracidade and convicção are the only two confidence dimensions

`convicção: high` · `veracidade: medium`

The separation between "how much evidence supports this" (veracidade) and "how hard we are betting on this" (convicção) covers the entire relevant confidence space. There is no independent third dimension.

**How to test:** Look for situations where two documents have the same veracidade and the same convicção, but require a confidence distinction that neither dimension captures.

**Discarded candidate:** "Relevance" — but relevance is contextual (depends on who's asking), not an intrinsic property of the document.

**Risk if wrong:** If a legitimate third dimension emerges (e.g., "completeness"), apply AX-ONT-2 to validate orthogonality before adding.

**Derives from:** AX-ONT-2 (orthogonal labels)

---

## P-ONT-4 — Sessions produce knowledge classifiable by the same labels

`convicção: high` · `veracidade: high`

A session (conversation log) does not need a different `node_type`. The mechanism `is_session: true` + a regular `node_type` (like `conceptual` or `spec`) is sufficient to capture both the format (session) and the epistemic content.

**Evidence:** Already applied to ~20 sessions in the vault. All were classified with existing labels without ambiguity.

**Risk if wrong:** If sessions have unique needs, we would need `node_type: session` or specific labels — violating orthogonality with `is_session`.

**Derives from:** AX-ONT-2 (orthogonal labels), AX-ONT-1 (minimize retrieval entropy)

---

## P-ONT-5 — Zero mutual information is practically achievable

`convicção: medium` · `veracidade: low`

AX-ONT-2 demands orthogonal labels. But in a real system with few documents and unbalanced distributions, spurious correlations will exist. The premise is that, as the vault grows, correlations decrease and approach zero — because the labels are *conceptually* independent, even if they show sample correlation in small populations.

**How to test:** When the vault has >100 nodes, compute mutual information between all label pairs. If any pair has `I(Lᵢ ; Lⱼ) > threshold` consistently, review definitions.

**Risk if wrong:** If a pair is inherently correlated, one label should be removed or redefined.

**Derives from:** AX-ONT-2 (orthogonal labels)

---

## P-ONT-6 — Frontmatter is the single source of truth

`convicção: high` · `veracidade: medium`

A document's classification is determined **exclusively** by its frontmatter YAML. The folder, filename, and body content may be derived or inferred from the frontmatter, but never the reverse.

If the frontmatter says `layer: architecture` and the file is in the `market/` folder, the frontmatter is right and the file is in the wrong place.

**Derivation:** This applies a more fundamental principle — **having the origin of information in a single place and propagating to where needed**. Whoever changes is the origin; the derived follow. Having multiple sources (folder + frontmatter + content) creates ambiguity, and ambiguity increases entropy (AX-ONT-1).

**Why premise and not axiom:** This is an engineering decision, not a foundational truth. One could imagine a system where the folder *is* the source of truth and frontmatter is derived — equally valid if consistent. We chose frontmatter because it's more flexible and agent-processable.

**Risk if wrong:** If frontmatter isn't the best source (e.g., if folders are more intuitive for humans), maintaining it as SoT creates friction. But the flexibility and parseability of frontmatter by agents strengthen the bet.

**Derives from:** AX-ONT-4 (implicit knowledge is lost knowledge)

---

## P-ONT-7 — Density over granularity in the current phase

`convicção: high` · `veracidade: medium`

In the current phase of the vault (~40 nodes), it is better to have dense, rich documents than many granular ones. Very granular documents fragment context and waste agent token windows. Granularity should increase **on demand** — when a document becomes impossible to reason about as a single unit.

**Relation to P-SYS-8:** Ontology-layer version of `P-SYS-8 — Entropy is Handled via Granularity on Demand`. P-SYS-8 applies to code; P-ONT-7 applies to vault documents.

**How to test:** If an agent needs to consume an entire document when it only needs a section, and this repeatedly impacts performance or accuracy, it's time to split.

**Derives from:** AX-ONT-6 (navigable density)

---

## P-ONT-8 — Sessions that generate higher-level documents must be kept forever

`convicção: high` · `veracidade: medium`

If a session (the most granular level of information) generated or influenced a higher-level document — a premise, an axiom, a constitution — that session must be kept permanently. It is the **provenance** of knowledge: without it, the chain of reasoning that led to the decision is lost.

**How to test:** Verify that sessions linked via `derives-from` or `contextualizes` to `consolidated` or `evergreen` documents are being maintained. If any was discarded and later the decision was questioned, the loss is real.

**Risk if wrong:** If keeping all sessions generates excessive noise, we will need an "archive" mechanism that preserves provenance without polluting the active graph.

**Derives from:** AX-ONT-4 (implicit knowledge is lost knowledge), AX-ONT-3 (every node must contribute unique information)

---

## P-ONT-9 — The classification system must adapt as the vault grows

`convicção: high` · `veracidade: medium`

Labels are not a static schema. They evolve as the vault grows — labels can be added, split, merged, or retired. The only constraint that does not change is orthogonality (AX-ONT-2). Correlation between two labels, accumulated over time, is a signal that one is redundant or that definitions need refinement.

Ontology-layer version of `P-SYS-7 — Refactoring is the Primary Mechanism of Architecture`.

**Why premise, not axiom:** This is an engineering commitment about how we maintain the system, not a foundational truth about what the system is. One could imagine a classification system fixed at design time and never revised — equally valid in principle, brittle in practice. We chose the adaptive approach because vault distributions change and fixed codes become suboptimal.

**Technical grounding.** By Shannon's source coding theorem, optimal code length depends on source distribution:

```
L* = H(X)     ← optimal average length = source entropy
```

When the distribution changes (the vault grows, the mix of document types shifts), `L*` changes. A fixed code becomes suboptimal — labels that once distinguished documents now group together things that should be separated.

**How to test:** Periodically compute label usage distributions. If a label's usage drops toward zero, or if two labels start showing non-trivial mutual information (violating AX-ONT-2), trigger a review. If no such signals appear and the system remains stable, the premise is *undertested* — not confirmed, but not contradicted either.

**Risk if wrong:**
- *If we ossify* (stop adapting): new documents will be forced into inadequate labels, corrupting orthogonality.
- *If we over-adapt*: frequent schema churn breaks reference stability — documents citing old labels become stale.

**Derives from:** AX-ONT-1 (minimize retrieval entropy — a stale encoding raises conditional entropy of retrieval)

**Technical references:**
- **Shannon, C.E.** (1948). *A Mathematical Theory of Communication*. — Source coding: optimal code changes with distribution.
- **Kolmogorov, A.N.** (1965). *Three approaches to the quantitative definition of information*. — Minimal description depends on the object being described.

---

## Derivation Hierarchy

```
AX-ONT-1 (minimize retrieval entropy)
├── P-ONT-2 (linear status hierarchy)
├── P-ONT-4 (sessions use same labels)
├── P-ONT-9 (classification adapts to growth)
├── AX-ONT-2 (orthogonal labels)
│   ├── P-ONT-1 (7 labels are sufficient)
│   ├── P-ONT-3 (two confidence dimensions)
│   └── P-ONT-5 (MI → 0 is achievable)
├── AX-ONT-6 (navigable density)
│   └── P-ONT-7 (density over granularity)
└── AX-ONT-4 (implicit = lost)
    ├── P-ONT-6 (frontmatter is SoT)
    └── P-ONT-8 (sessions kept forever)
```

---

## Relations to Existing System Premises

| Ontology Premise | Relation | System Premise |
|---|---|---|
| P-ONT-6 | applies the principle of | P-SYS-6 (Implied Knowledge is Lost Knowledge) |
| P-ONT-7 | ontology-layer version of | P-SYS-8 (Entropy via Granularity on Demand) |
| P-ONT-6 | extends | P-SYS-3 (Code is Compiled Output of Documentation) |

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[ontology-axioms]] | `derives-from` | All premises derive from one or more axioms |
| [[ontology-conventions]] | `derives-from` | The label schema is a direct codification of these premises |
| [[ontology-constitution]] | `cites` | The constitution describes the intellectual foundations; these premises are the working bets |
| [[domainspec-premises]] | `cited-by` | DomainSpec premises cite ontology premises: P-DS-9 (mechanical registry sync) operationalizes the AX-ONT-2/AX-ONT-3 commitments at the methodology layer. |
