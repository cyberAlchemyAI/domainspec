---
tags: [vault, edges, hygiene, inverse, bidirectionality, discovery]
node_type: discovery
is_session: false
layer: architecture
nature: procedural, technical
status: active
version: 0.1.0
last_updated: 2026-05-03
created: 2026-05-03
derived_from: [.planning/research/edges-hygiene/research/domainspec-subagents-findings.md]
---

# Discovery — Inverse-Missing Edge Fix Plan (Category 4 only)

> Scoped fix plan for the residual inverse-missing edge population the `edges-hygiene-2026-05-03` dispatch surfaced. Carved out from the broader edge-hygiene work so it can land independently of the catalog-amendment, cross-repo-policy, and dangling-target workstreams (all parked in `vault/discovery/_backlog.md`).
>
> **Load-bearing decision (preamble).** The user ruled in the same session that `.claude/skills/*` and `.claude/agents/*` files are NOT vault graph nodes. Forward-only edges TO them are legal-by-design and require no inverse. That ruling resolves OQ-B (in `curator-pipeline-integration/discovery.md`) and OQ-1 (in `documents-metadata-enforcement/documents-metadata-enforcement.md`) in principle, and it scopes Category 4 strictly to vault-internal targets — which is the population this discovery plans against.

---

## Index

1. [Objective](#1-objective)
2. [Context](#2-context)
3. [Plan](#3-plan)
4. [Sequencing](#4-sequencing)
5. [Out of Scope](#5-out-of-scope)
6. [Open Questions](#6-open-questions)
7. [Connections](#7-connections)

---

## 1. Objective

This discovery decides:

- **The plan and sequencing** for repairing the ~90 vault-internal missing-inverse edges identified by Category 4 of the `edges-hygiene-2026-05-03` dispatch.
- **The bootstrap step** for the three high-traffic vault sinks that currently carry no `## Connections` block at all (`vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/ontology-architecture-draft.md`).
- **The risk-tier partition** that separates immediately-applicable inverse additions from those blocked on upstream catalog decisions.

This discovery explicitly defers:

- The catalog-amendment work (which edge names survive, which are renamed, which are collapsed) — that decision belongs to `vault/discovery/domainspec-vault-edges/` and is parked in the backlog.
- All non-Category-4 edge-hygiene work (cross-repo absolute paths, repo-escaping relative paths, dangling targets, off-catalog edge names, README prose-vs-table standardization, the `Scope` column proposal). Each is parked in `vault/discovery/_backlog.md` by a sibling agent.
- Any decision about CI gates, headless harnesses, or curator wiring. That belongs to `vault/discovery/curator-pipeline-integration/`.

---

## 2. Context

### 2.1 The "skills/agents are not nodes" ruling scopes the work

The user's ruling — recorded in the dispatch findings as the resolution of OQ-B / OQ-1 — means that the auditor's "asymmetric edge = bug" rule (`vault/ontology-conventions.md:290-292`) only applies to edges whose target is a vault file. The ~10 forward-only edges from vault files into `.claude/skills/*` and `.claude/agents/*` are NOT bugs and are excluded from this discovery's plan.

This carves the original 134-edge inventory down to the vault-internal subset. Inside that subset, Category 4 (missing-inverse) is the dominant class.

### 2.2 Inventory headline numbers

Reproduced from the dispatch findings (full row-level inventory in `domainspec-subagents-research.md` §Agent 1):

- **Total declared edges across `vault/**`:** 134
- **Vault-internal edges (target is a vault file):** 99
- **Vault-internal edges with a declared inverse on the target:** ~9
- **Vault-internal missing-inverse edges (Category 4):** ~90

The exact count drifts slightly depending on how off-catalog edge names are reconciled (Category E in the taxonomy). This discovery treats `~90` as the working figure and refers row-level decisions to the dispatch findings rather than re-enumerating them.

### 2.3 The three-sinks problem

Three high-traffic vault files carry no `## Connections` block at all:

- `vault/ontology-conventions.md`
- `vault/confidence-levels.md`
- `vault/ontology-architecture-draft.md`

Every inbound edge to these three files is a missing inverse by definition. The dispatch found roughly 20 such inbound rows across the three files. **Bootstrapping one block per file is cheaper than 20 row-additions across three files later** — and it unblocks the rest of the inverse sweep, because it gives those rows somewhere to land.

This is the highest-leverage early move in the plan.

---

## 3. Plan

The Category-4 fix population partitions into three risk tiers. The tiering is what determines what can be done now versus what must wait on the catalog amendment.

### 3.1 Tier 1 — Bootstrap the three high-traffic sinks (low risk, high leverage)

**What:** Add a minimal `## Connections` table header (the canonical four-column format `| Document | Type | Description |`, three columns — Document, Type, Description) to each of the three sinks. No row content yet; the rows are added by Tier 2.

**Why low risk:** Adding an empty section header changes no edge semantics; it only creates the surface that subsequent inverse-additions will land on.

**Files to touch:**

- `vault/ontology-conventions.md`
- `vault/confidence-levels.md`
- `vault/ontology-architecture-draft.md`

**Acceptance:** Each file ends with a `## Connections` heading followed by the canonical table header row, even if the body is empty pending Tier 2.

### 3.2 Tier 2 — Low-risk inverse additions (mechanical)

**What:** For every Category-4 row where (i) the forward edge already uses a catalog-clean name (one of the 21 names in `.claude/skills/custom/edges.md`), (ii) the target file exists, and (iii) the target carries — or, after Tier 1, will carry — a `## Connections` block, add the inverse row on the target.

**Why low risk:** Both endpoints are stable, the edge name is uncontroversial, and the inverse name is unambiguous (e.g. `derives-from` ↔ `derived-by`, `cites` ↔ `cited-by`, `governed-by` ↔ `governs`). No catalog decision is pending for these rows.

**Estimated population:** the dispatch findings imply this is the bulk of the ~20 rows landing on the three Tier-1 sinks plus a meaningful slice of the remaining ~70 vault-internal rows whose target already has a `## Connections` block. Exact count is left to the executor at write time, since it depends on which targets get bootstrapped in Tier 1.

**Acceptance:** every forward edge meeting all three conditions has a corresponding inverse row on its target, with the inverse-edge type drawn from `edges.md` and a Description naming the source.

### 3.3 Tier 3 — Medium / high-risk inverse additions (DEFERRED to backlog)

**What is deferred and why:**

- **Off-catalog edge names** (~24 distinct types in active use, per dispatch finding F4): adding inverses for `references`, `contextualizes`, `depends-on`, `provenance-for`, `discovery-of`, `binds-when`, `mode-of-source`, `extends`, `generalizes`, etc. is wasted work if the catalog amendment renames or collapses them. **Wait for `vault/discovery/domainspec-vault-edges/` to land its catalog amendment.**
- **Forward / inverse name disagreement**: rows where the forward uses a catalog name but the natural inverse is itself off-catalog or contested (e.g. `derives-from` whose inverse is sometimes written as `codified-as` rather than `derived-by`; `mode-of` vs `mode-of-source`). See OQ-1 below.
- **Symmetric-error rows**: cases the dispatch flagged where a constitution and its premise both declare the *same* edge name (one of them should be the inverse, but the catalog has no symmetric pair for the chosen name). Resolution depends on which name survives.
- **Rows whose target is itself a dangling-or-renamed file**: parked with the dangling-targets workstream in the backlog.

**This tier is NOT executed by this discovery.** It is recorded here so the executor of Tiers 1–2 knows which rows to skip and where the deferred work is tracked.

---

## 4. Sequencing

The dispatch's C3 sequencing recommendation (`domainspec-subagents-research.md` §Agent 3, "Sequencing Recommendation") is adopted verbatim, with the steps that fall to other workstreams marked explicitly:

1. **Catalog amendment lands first.** Block on `vault/discovery/domainspec-vault-edges/` resolving which off-catalog edge names are kept, renamed, or collapsed. **Owner: domainspec-vault-edges discovery. Parked in `_backlog.md`. Out of scope here.**
2. **Bootstrap the three sinks.** Tier 1 of this discovery's plan (§3.1). Can be done in parallel with step 1 since it changes no edge semantics. **Owner: this discovery.**
3. **Fix dangling targets and repo-escaping paths.** Adding an inverse to a phantom target is wasted work; renames must land before bidirectional sweeps. **Owner: dangling/cross-repo workstreams. Parked in `_backlog.md`. Out of scope here.**
4. **Drop cross-repo absolute paths.** Mechanical; sequenced after the inverse sweep so the same lines aren't touched twice. **Owner: cross-repo workstream. Parked in `_backlog.md`. Out of scope here.**
5. **Run the Category-4 inverse sweep in dependency order: leaf-first.** Templates, sessions, and examples first; then mid-graph nodes (premises, research files); then top-of-graph constitutions and discoveries. Leaf-first ordering ensures that when a top-of-graph file's inverses are added, the leaf files they point at already exist and already declare the inverse-side acceptance. **Owner: this discovery (Tier 2).**
6. **Defer all OQ-C-open rows** until the user closes OQ-C (cross-repo policy). **Owner: cross-repo workstream.**

The executable subset for this discovery is **steps 2 and 5** of the above sequence.

### 4.1 Inside step 5 — leaf-first ordering inside vault/

Concretely, when running the Tier-2 sweep, process targets in this order:

1. **Leaves**: `templates/*`, `vault/sessions/*`, `vault/discovery/*/examples/*`, `vault/discovery/*/research/*` files that are referenced but reference little themselves.
2. **Mid-graph**: `vault/premise/*-premises.md`, `vault/discovery/*/README.md`, the per-discovery main file (e.g. `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md`).
3. **Top-of-graph**: `vault/constitution/*-constitution.md`, the three Tier-1-bootstrapped sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`), `vault/discovery/domainspec-vault-foundations/*` foundational files.

This ordering is a discipline, not a measured rule — the dispatch did not produce an empirical dependency graph. The executor may revise the ordering if a concrete dependency surfaces.

---

## 5. Out of Scope

The following work is explicitly out of scope for this discovery and is parked in `vault/discovery/_backlog.md` by a sibling agent. Do not attempt any of it under this discovery's banner:

- **Cross-repo absolute paths** (`file:///Users/...` URLs at `vault/ontology-conventions.md:369`, `:375`, and `vault/conceptual/epistemic-principles.md:127-129`).
- **Repo-escaping relative paths** (`../../../TUNING-LOOP.md`, `../../../CLAUDE.md`, etc.) — pending OQ-C.
- **Dangling targets** — the 27 dangling-non-existent rows split into renames (~10) and forthcoming-promises (~10) plus three unresolved wikilinks (`[[robot-talks-frontend]]`, `[[event-system-foundations]]`, `[[fidc-and-credit-rights]]`).
- **Off-catalog edge names** — the ~24 distinct deprecated/non-catalog types in active use; reconciliation is the job of `vault/discovery/domainspec-vault-edges/`.
- **The `Scope` column proposal** (adding a fourth `Scope ∈ {vault, harness, cross-repo}` column to `## Connections` tables) — a wire-format amendment proposal that belongs to `domainspec-vault-edges/`, not here.
- **README prose-vs-table standardization** — the three READMEs that use bullet-list prose instead of the canonical table (`domainspec-subagents-strategy-definitions/`, `robot-talks-definitions/`, `documents-metadata-enforcement/`, per dispatch finding F10) are out of scope.
- **CI gates, curator wiring, headless harnesses** — out of scope, covered by `vault/discovery/curator-pipeline-integration/discovery.md`.
- **The general missing-`## Connections`-block problem on new sessions and discoveries** (dispatch finding F11) — that's a curator/pipeline concern, not a Category-4 fix.

---

## 6. Open Questions

Only questions specific to inverse-add work are recorded here. Questions belonging to other workstreams (catalog amendment, cross-repo, dangling) live with those workstreams in the backlog.

### OQ-1 — How are forward / inverse pairs reconciled when each side uses a different catalog name?

Several Category-4 rows present pairs where both names appear in the catalog but each represents a different framing of the same relationship — for example `derives-from` (used on the deriving file) vs `codified-as` (sometimes written on the source side as the natural inverse). Similar tension: `mode-of` vs `mode-of-source`; `governed-by` vs `governs` (clean inverse) vs `binds` (a different framing).

Options:

1. **Pick one canonical inverse per forward** in the catalog (decision belongs to `domainspec-vault-edges/`). This discovery would consume that mapping.
2. **Allow either name on the inverse side** as long as one is present, and let the curator accept any name in the documented inverse-set.
3. **Treat the disagreement as a per-row content question** and decide case by case during the Tier-2 sweep.

Pending resolution, the Tier-2 sweep treats *only* rows where the forward and the natural inverse are unambiguous (i.e. the inverse name itself is uncontested in the catalog).

### OQ-2 — When the target file exists but its `## Connections` block is "frozen" by another in-flight edit, who arbitrates?

Several Tier-2 candidate targets are also being touched by the parallel rename refactor (`domainspec-subagents-strategy*` → `domainspec-subagents-strategy*`, `domainspec-vault-foundations/` → `domainspec-vault-foundations/`, etc.). If a row addition collides with a path rename on the same file, the ordering matters.

Working rule pending arbitration: **the rename refactor wins** (paths must be correct before the inverse can be meaningfully added). The Tier-2 sweep should re-read each target file just before editing and re-resolve forward-edge paths against the post-rename layout.

### OQ-3 — How is "leaf vs mid vs top" decided when a file is referenced both ways?

Some files (e.g. `vault/discovery/domainspec-vault-foundations/epistemic-chain.md`) are clearly mid-graph — they cite leaves and are cited by tops. The leaf-first ordering in §4.1 is a discipline; it does not give a deterministic order for files that span tiers. Pending a measured dependency graph, the executor uses judgment and notes any case where the ordering had to be guessed.

---

## 7. Connections

> All paths below are repo-relative Markdown links so this discovery is portable across clones (no absolute `/Users/...` paths, no `file:///` URLs).

| Document | Type | Description |
|----------|------|-------------|
| [../../../.planning/research/edges-hygiene/research/domainspec-subagents-findings.md](../../../.planning/research/edges-hygiene/research/domainspec-subagents-findings.md) | `derives-from` | The synthesis findings from the `edges-hygiene-2026-05-03` dispatch; this discovery is the Category-4 carve-out from those findings. **Forward-only (file outside `vault/`).** |
| [../../../.planning/research/edges-hygiene/research/domainspec-subagents-research.md](../../../.planning/research/edges-hygiene/research/domainspec-subagents-research.md) | `cites` | The raw three-child evidence (inventory, taxonomy, fix plan); cited transitively for the ~90 row-level decisions, the three-sinks observation, and the leaf-first sequencing recommendation. **Forward-only (file outside `vault/`).** |
| [../curator-pipeline-integration/discovery.md](../curator-pipeline-integration/discovery.md) | `cites` | OQ-B in that discovery records the user's "skills/agents are not nodes" ruling that scopes this discovery to vault-internal targets only. Inverse `cited-by` to be added on the target. |
| [../documents-metadata-enforcement/documents-metadata-enforcement.md](../documents-metadata-enforcement/documents-metadata-enforcement.md) | `cites` | OQ-1 in that discovery names the same boundary surface from the enforcement angle; same ruling resolves both. Inverse `cited-by` to be added on the target. |
| [../domainspec-vault-edges/](../domainspec-vault-edges/) | `blocked-by` | Tier 3 of this discovery's plan (off-catalog edge-name rows) cannot proceed until the catalog amendment lands in `domainspec-vault-edges/`. Inverse `blocks` to be added on the target's main discovery file once it exists. |
| [../../ontology-conventions.md](../../ontology-conventions.md) | `proposes-edit` | Tier 1 bootstrap target — this discovery proposes adding a `## Connections` block to this file. Inverse to be added at bootstrap time. |
| [../../confidence-levels.md](../../confidence-levels.md) | `proposes-edit` | Tier 1 bootstrap target — this discovery proposes adding a `## Connections` block to this file. Inverse to be added at bootstrap time. |
| [../../ontology-architecture-draft.md](../../ontology-architecture-draft.md) | `proposes-edit` | Tier 1 bootstrap target — this discovery proposes adding a `## Connections` block to this file. Inverse to be added at bootstrap time. |
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `created-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session promoted the actionable Category-4 subset of the dispatch findings into this discovery. |

> Inverse-side declarations on the four sibling vault discoveries (`curator-pipeline-integration`, `documents-metadata-enforcement`, `domainspec-vault-edges`, and the three Tier-1 sinks once their blocks exist) are required by the bidirectionality discipline and are explicitly part of this discovery's own Tier-2 sweep — i.e. this discovery's `## Connections` block is itself a Category-4 input and should not be exempted from the rule it codifies.
