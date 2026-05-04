---
tags: [vault, ontology]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: consolidated
version: 0.1.0
last_updated: 2026-03-19
---

# Confidence Levels

> The vault is not a flat repository of information. It is a stratified system where each level represents a different degree of trust in the content. To move up a level, a document must pass specific checks. The highest level is **Evergreen** — information considered true until explicitly refuted.

---

## Objective

This document defines the **maturity lifecycle** of vault documents. It answers the question: *"How does a piece of knowledge progress from a raw idea to an established truth, and what criteria govern each transition?"*

It specifies the five maturity levels (`draft` → `evergreen`), who can create documents at each level, and the entry/exit criteria for promotion or demotion.

---

## Index

1. [The Five Levels](#the-five-levels)
2. [Rules of the System](#rules-of-the-system)
3. [Mapping to Current Status Values](#mapping-to-current-status-values)

---

## The Five Levels

### 🌱 Level 0 — Draft (`draft`)
Raw ideas, unstructured observations, unanswered questions. May be wrong. Must not be referenced by other documents as a source of truth.

- **Who creates:** anyone or any agent
- **Entry criteria:** none — just needs to exist
- **Exit criteria:** has minimal structure, linked to at least one concept

---

### 🔍 Level 1 — Exploratory (`exploratory`)
Structured but not validated. Captures a hypothesis with reasoning. Can be referenced, but with an explicit note that it is exploratory.

- **Who creates:** engineer, product, oriented agent
- **Entry criteria:** complete frontmatter, defined status, at least one link to another document
- **Exit criteria:** has been discussed and not contradicted by code or real evidence

---

### ⚡ Level 2 — Active (`active`)
In use. Reflects the current understanding and is aligned with the actual state of the system (code or business). May diverge from the ideal — and that divergence must be documented.

- **Who creates:** engineer or agent with system context
- **Entry criteria:** does not contradict Evergreen documents; aligned with the current code or has documented deviation
- **Exit criteria:** has been reviewed against the real system state and survived

---

### 🏛️ Level 3 — Consolidated (`consolidated`)
Reviewed, tested against reality, with version history. Represents team consensus. Divergences have been investigated and resolved.

- **Who creates:** tech lead or formal review process
- **Entry criteria:** version >= 1.0, no open contradictions, referenced by at least two lower-level documents
- **Exit criteria:** passes formal review with no open controversy

---

### 🌲 Level 4 — Evergreen (`evergreen`)
The highest level. Information considered true until explicitly refuted. Serves as an anchor for the rest of the vault. Documents at this level are the **constitutions, axioms, and stable principles** of the system.

- **Who creates:** deliberate process with explicit approval
- **Entry criteria:** approved by formal review, no known contradictions, tested against multiple real scenarios
- **Exit criteria:** only by documented refutation + formal review (not by abandonment or forgetting)

---

## Rules of the System

1. **A document may only reference documents at the same level or above as sources of truth.**
   - A `draft` may cite an `evergreen`. The reverse is not permitted.

2. **Downgrade is possible and expected.**
   - If a `consolidated` document is contradicted by evidence, it returns to `active` with a contradiction note.

3. **Evergreens are immutable in practice, but not in principle.**
   - Changing an `evergreen` follows the same formal process as ratifying one.

4. **Agents must declare the level of the document they used as context.**
   - If an agent uses a `draft` to make an architectural decision, that must be explicit.

---

## Mapping to Current Status Values

| Status in frontmatter | Equivalent level |
|----------------------|------------------|
| `draft` | 🌱 Level 0 |
| `exploratory` | 🔍 Level 1 |
| `active` | ⚡ Level 2 |
| `consolidated` | 🏛️ Level 3 |
| `evergreen` | 🌲 Level 4 |
| `outdated` | ⬇️ Downgrade pending |

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [discovery/domainspec-vault-foundations/epistemic-chain.md](discovery/domainspec-vault-foundations/epistemic-chain.md) | `derives` | The epistemic-chain discovery uses the `veracidade` axis defined here as the promotion mechanism for premise → axiom (D-3); the `status` lifecycle informs the chain's maturity model. |
| `sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md` | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session bootstrapped this `## Connections` block as Tier-1 of the `inverse-edge-fix` discovery's plan. |
| [discovery/domainspec-vault-foundations/scope-and-domain-axes.md](discovery/domainspec-vault-foundations/scope-and-domain-axes.md) | `derives` | The scope-and-domain-axes discovery derives from the 2x2 `veracidade` x `convicção` matrix defined here, classifying orthogonality as a "strategic bet" using that matrix. |

