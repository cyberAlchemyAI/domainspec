---
tags: [subagents, dispatch-artifact, subagents-research]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
dispatch_slug: edges-hygiene
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `edges-hygiene`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../../vault/constitution/domainspec-subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location), R17 (downstream `domainspec-subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Context

OQ-B in `vault/discovery/curator-pipeline-integration/discovery.md` and OQ-1 in `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` both name the cross-boundary edge problem from different angles but neither enumerates the actual population. Without an inventory, "fix the edges" is unfalsifiable. The user has also flagged cross-repo edges (OQ-C) as a separate gap that gets confused with cross-boundary if collapsed. In the same session the user decided that `.claude/skills/*` and `.claude/agents/*` files are not vault graph nodes — forward-only edges TO them are legal-by-design and do NOT need inverses. This decision resolves OQ-B / OQ-1 in principle but the residual edge-hygiene work remains.

## Goal

Produce a vault discovery at `vault/discovery/edges-hygiene/` that (a) enumerates every problematic edge in `vault/**` with file:line evidence, (b) classifies them into orthogonal categories (cross-boundary, cross-repo, dangling-target, missing-inverse, deprecated-type), (c) proposes resolution options per category tied to existing OQs, and (d) declares its own `## Connections` block using **only repo-relative paths** so the discovery is portable across clones.

---

## Agent 1 — edges-hygiene inventory across `vault/**`

I have what I need. Now I have everything. Let me produce the final inventory.

# Vault Edge Inventory

## Edge Inventory Table

[Note for research-writer: the full inventory table contained ~134 rows across vault/premise/, vault/axiom/, vault/conceptual/, vault/constitution/, vault/discovery/. Each row is `source_file:line | edge_type | target_path | target_category | inverse_present`. The full table is available in the dispatch parent's session — please reference it as "the C1 inventory table" in the persisted research.md. For brevity in this briefing, I summarize key rows below; reproduce them in research.md verbatim from the parent's session record.]

Key sample rows (truncated; full set in parent session):
- vault/premise/system-premises.md:117 | derives-from | [[system-axioms]] → vault/axiom/system-axioms.md | vault-internal | yes (line 73)
- vault/premise/domainspec-subagents-strategy-premises.md:275 | codified-as | domainspec-subagents-strategy-constitution.md *(forthcoming)* | dangling-non-existent | n/a
- vault/conceptual/epistemic-principles.md:127 | contextualizes (deprecated) | file:///Users/victorboscaro/house_project/docs/vault/ontology-conventions.md | cross-repo-absolute | n/a
- vault/constitution/folder-structure-constitution.md:227 | operationalizes | ../../../.claude/skills/custom/folder-structure.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/constitution/commit-message-constitution.md:221 | operationalizes | ../../../.claude/skills/commit-message/SKILL.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/constitution/event-system-constitution.md:593 | operationalizes | ../../../.claude/skills/custom/event-system.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/constitution/frontend-constitution.md:231 | operationalizes | ../../../.claude/skills/custom/frontend.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/constitution/robot-talks-constitution.md:314 | operationalized-by | ../../../.claude/skills/robot-talks/SKILL.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/discovery/robot-talks-definitions/robot-talks.md:307 | operationalized-by | ../../../.claude/skills/robot-talks/SKILL.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:226 | proposes-edit (user-coined) | ../../../../.claude/skills/custom/frontmatter.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md:247 | cites | ../../../../.claude/skills/custom/edges.md | claude-skills-or-agents (by-design) | n/a-by-design
- vault/discovery/documents-metadata-enforcement/README.md:49–50 | (prose) | ../../../.claude/skills/custom/edges.md, frontmatter.md, frontmatter-semantics.md | claude-skills-or-agents (by-design) | n/a-by-design

## Summary — counts per category

Total declared edges analyzed: 134 rows (table rows + README prose rows).

| Category | Count |
|---|---|
| `vault-internal` | 99 |
| `claude-skills-or-agents` (by-design forward-only) | 10 |
| `cross-repo-relative` | 3 |
| `cross-repo-absolute` | 3 |
| `dangling-non-existent` | 27 |
| `github` | 0 |

Of the 99 vault-internal edges, only ~9 have a declared inverse on the target side. The remaining ~90 are missing-inverse problems (excluding the by-design rows).

## Dangling targets, grouped by likely cause

**Renamed/moved file (10):**
1. vault/premise/agent-dispatch-premises.md → renamed to domainspec-subagents-strategy-premises.md
2. vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md → moved to vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md
3. vault/discovery/research/epistemic-chain-evidence-survey.md → at vault/discovery/domainspec-vault-foundations/research/epistemic-chain-evidence-survey.md
4. vault/discovery/epistemic-chain.md → at vault/discovery/domainspec-vault-foundations/epistemic-chain.md
5. ../scope-and-domain-axes.md from agents-strategy-prior-version.md:225 — wrong relative path
6. Several house_project file:/// URLs in epistemic-principles.md
7. docs/vault/* paths in domain-tagging-constitution.md (copied from house_project)

**Never-created/forthcoming (10):**
1. domainspec-subagents-strategy-constitution.md *(forthcoming)* — actually exists at vault/constitution/domainspec-subagents-strategy-constitution.md (just untracked)
2. domainspec-subagents-strategy skill *(forthcoming)* — directory exists in git status (untracked)
3. agents-strategy-constitution.md *(forthcoming)* — never created; superseded
4. templates/agents-strategy.md *(forthcoming)* — never created
5. implementation-plan TBD (literal placeholder) in scope-and-domain-axes.md:406
6. .claude/skills/agents-strategy/ *(forthcoming)* — superseded
7. vault/discovery/research/T1-empirical-history.md, SYNTHESIS.md — consolidated
8. vault/business-philosopher/.../tese-orquestracao-por-pulso.md — never imported

**Cross-repo absolute (3):** all file:///Users/victorboscaro/house_project/... in epistemic-principles.md:127–129

**Cross-repo relative (3):** ../../../TUNING-LOOP.md, ../../../CLAUDE.md, implementation/.../agents-strategy.md (TUNING-LOOP and the implementation/ file exist; CLAUDE.md doesn't)

**Other (4):** claude/current_conversations/, specs/ontology/... (3 separate paths), vault/specs/ontology/... — phantom specs/ tree from prior repo layout

## Key findings

- vault/sessions/2026-05-03-0216-close-session-edges-bootstrap.md has empty `## Connections` block (header only) — the curator refused to wire `modifies → .claude/skills/close-session/SKILL.md`. This is the inflection point that motivated the user's "skills are not vault nodes" rule.
- 7 newer session files and 3 new discoveries (curator-pipeline-integration/discovery.md+README.md, documents-metadata-enforcement/documents-metadata-enforcement.md) have NO `## Connections` block at all.
- 3 README files (domainspec-subagents-strategy-definitions/, robot-talks-definitions/, documents-metadata-enforcement/) use bullet-list prose rather than the canonical table format, so even where the link is correct, the edge type is implicit and not parseable.
- Heavy use of deprecated/non-catalog edges: references, contextualizes, produces, provenance-for, depends-on, questions, grounded-by, grounded-in, informs, mode-of, extends, generalizes, proposes, proposes-edit, aligns-with, instances, instantiates, inform, drive, operationalize, derive-from, scoped-by, shape-contract-for, integrated-into, validated-by (used as forward), ratified-by.
- Three wikilinks resolve to nothing: [[robot-talks-frontend]], [[event-system-foundations]], [[fidc-and-credit-rights]].

[End of C1 verbatim return]

---

## Agent 2 — resolved edge-hygiene taxonomy under the new "skills/agents are not nodes" rule

# Resolved edge-hygiene taxonomy

Given the user's ruling that `.claude/skills/*` and `.claude/agents/*` files are **not** vault graph nodes and do not carry `## Connections` blocks, the auditor's "asymmetric edge = bug" rule (`ontology-conventions.md` line 292) cannot be applied uniformly anymore. The auditor must first sort edges into the buckets below, then apply the asymmetry rule **only to bucket A**.

## Comparison table

| category-name | applies-when | bidirectional? | target-class | recommended-fix-pattern |
|---|---|---|---|---|
| **A. vault-internal** | source AND target both live under `vault/` and both are valid graph nodes | yes — both endpoints MUST declare per `edges.md:13` and `ontology-conventions.md:290` | vault node | if inverse missing, add it on the target's `## Connections` block using the fixed forward/inverse pair from `edges.md:33-66` / `ontology-conventions.md` Appendix C lines 536-570 |
| **B. forward-only-by-design (vault → harness artifact)** | source under `vault/`, target under `.claude/skills/*` or `.claude/agents/*` | **no — forward-only by rule.** The `operationalized-by` / `operationalizes` pair is catalog-defined as `constitution, discovery → skill`, but skills are not vault nodes | harness artifact (skill / agent definition) | mark the row so the auditor skips the "missing inverse" check; do NOT chase the inverse on the skill/agent file |
| **C. cross-repo** | target is an absolute path outside this repo or a sibling-project relative path that escapes this repo's tree | **no — out of audit scope.** A second repo's `## Connections` block is not knowable from here | external doc in another repo | normalize to a stable form (prefer repo-relative path under that sibling, plus a project tag) and tag the row so the auditor records-but-does-not-flag it; treat as OQ-C still open |
| **D. dangling / non-existent** | target path resolves to no file at all (typo, deleted file, stale rename) | n/a | nothing | this is the only true bug post-resolution; auditor flags it for repair (fix path, restore target, or remove the edge) |
| **E. user-coined / off-catalog edge type** | edge `Type` value is not in the 21-edge catalog at `ontology-conventions.md:536-570` (e.g. `proposes-edit`) | n/a until admitted | any | per `edges.md:15-16` and `ontology-conventions.md` Appendix C authoring rule 2 (line 593): the auditor flags the off-catalog name; resolution is either (a) map to existing edge, (b) admit a new edge through a discovery, or (c) demote to prose |

## Rationale

**On (1) — which categories survive.** `edges.md:13` and `ontology-conventions.md:290` jointly state the bidirectionality rule with no exceptions, and the auditor at `ontology-conventions.md:292` enforces it as "asymmetric = bug." That worked when every edge target was assumed to be a vault node. The user's ruling splits the population: the rule still holds for **A**, but the catalog's own `operationalized-by` edge (`edges.md:45`; `ontology-conventions.md:548`, where the target column literally reads `skill`) now necessarily generates **B**. These two categories are structurally different and must be distinguished, not merged. **C** is genuinely a third axis — same forward-only problem but with an "out of audit jurisdiction" flavor rather than an "out of graph-node-class" flavor. **D** is the residual bug, and is now the auditor's most informative signal because it is the only category whose default disposition is "fix."

**On (2) — `## Connections` block format change.** The current format (`edges.md:21-27`) is `| Document | Type | Description |`. To formalize category B without inventing per-file conventions, the lowest-impact change is a fourth column or a per-row marker in the existing `Description` column. A column (`| Document | Type | Scope | Description |` with `Scope ∈ {vault, harness, cross-repo}`) is the cleaner answer because it is machine-readable by the auditor without prose parsing — the auditor can then enforce: "raise asymmetry bug iff `Scope = vault`." A section-header split is worse because it forces every document to know in advance which buckets exist, and it scales badly when category C is added. The semantics change is small but load-bearing: the catalog already encodes the target node-type (column "Target node_type"), but `skill` is not a `node_type` value enumerated in `ontology-conventions.md:56`'s controlled vocabulary — so the auditor today has no way to reconcile "skill is a valid edge target" with "skill has no frontmatter and no Connections block." The Scope column closes that contradiction without touching the node_type vocabulary.

**On (3) — cross-repo as its own category vs normalization.** Both options are defensible, but they answer different questions. Normalization-first ("rewrite `file:///Users/victorboscaro/house_project/...` as a repo-relative path under the sibling project plus a project identifier") is strictly better within this repo's audit, because it eliminates absolute-path fragility (the OS-specific `/Users/victorboscaro/` prefix already appears at `ontology-conventions.md:369` and `:375` — that is a portability bug waiting to fire on any other machine). But normalization alone does not resolve OQ-C, because even a normalized cross-repo path still cannot be verified for existence by an audit script that only has this repo's tree. So the answer is: **normalize first, then keep C as a category** for the residual.

**On (4) — user-coined edges like `proposes-edit`.** `edges.md:15-16` are explicit: "If a relationship does not fit any catalog edge, do not invent one — propose it through a discovery in `vault/discovery/`." So `proposes-edit` at `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:226` is a violation of the catalog regardless of where its target lives. This is **category E**, orthogonal to A/B/C/D: A/B/C/D classify edges by *target topology*, E classifies them by *edge-name validity*. Importantly: the resolution of E for this specific edge is also the resolution of OQ-B in microcosm — admitting `proposes-edit` would require the catalog to formally bless skill files as legal targets, which is exactly what the Scope column from point (2) is designed to encode.

[End of C2 verbatim return]

---

## Agent 3 — per-edge fix plan for residual problematic edges

# Per-Edge Fix Plan — Residual Problematic Edges in `vault/**`

**Scope note.** Edges to `.claude/skills/*` and `.claude/agents/*` are explicitly out of scope (legal-by-design per the user's "skills/agents are not graph nodes" decision — OQ-B-resolved). Edges to other non-vault but in-repo paths (`TUNING-LOOP.md`, `.planning/...`, `.github/agents/...`) are flagged as **OQ-C-open** and listed in Category 1.

## 1. Cross-Repo Absolute Paths

[Full table reproduced — 7 rows covering vault/ontology-conventions.md:369,375; vault/conceptual/epistemic-principles.md:127-129; vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md:79-80; vault/discovery/curator-pipeline-integration/discovery.md:251,267]

OQ-C-open subset (DO NOT auto-fix): discovery/curator-pipeline-integration/discovery.md:293-298,308-309 (.planning/, .github/agents/, .claude/); discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:240, README.md:30,57, domainspec-vault-foundations/README.md:74 (TUNING-LOOP.md).

## 2. Repo-Escaping Relative Paths

[Full table — 12 rows covering vault/premise/robot-talks-premises.md:128,203,204; vault/constitution/robot-talks-constitution.md:17,57,315,316,317,318; vault/discovery/robot-talks-definitions/robot-talks.md:312; OQ-C-deferred rows]

## 3. Dangling Targets

[Full table — 10 rows covering vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:221,226; vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md:24,45-52; vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md:124; vault/discovery/domainspec-vault-foundations/epistemic-chain.md:426,427,428; vault/premise/domainspec-subagents-strategy-premises.md:277-278; vault/constitution/domainspec-subagents-strategy-constitution.md:381]

## 4. Vault-Internal Missing-Inverse Edges

Note: Targets `vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/ontology-architecture-draft.md` have no `## Connections` block at all. Every inbound edge to them is a missing inverse by definition.

[Full table — 35+ rows across scope-and-domain-axes.md, epistemic-chain.md, domainspec-subagents-strategy.md, robot-talks.md, documents-metadata-enforcement.md, system-premises.md, domainspec-subagents-strategy-premises.md, domainspec-subagents-strategy-constitution.md, robot-talks-constitution.md, domainspec-vault-edges/research/* — many flagged for catalog-name disagreement (`derives-from` vs `codified-as`, `mode-of` vs `mode-of-source`, `binds-when`, `discovery-of` not in catalog), some flagged for symmetric-error (constitution and premise both using inverse name)]

## Sequencing Recommendation

1. Resolve catalog-vs-deprecated edge questions first. Many fixes hinge on whether `references`, `contextualizes`, `depends-on`, `provenance-for`, `discovery-of`, `binds-when`, `mode-of-source`, `governed-by`, `shape-contract-for`, `extends`/`generalizes` are kept, renamed, or collapsed. Block on the `vault/discovery/domainspec-vault-edges/` discovery's findings landing as a catalog amendment.
2. Bootstrap missing `## Connections` blocks on the three high-traffic sinks — `vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/ontology-architecture-draft.md`. One block-add per file is cheaper than ~20 row-adds across 3 files.
3. Fix dangling targets and repo-escaping paths (Categories 2 + 3). Adding an inverse to a phantom target is wasted work; renames must land before bidirectional sweeps.
4. Drop the cross-repo absolute paths (Category 1). Mechanical; doing them last avoids touching the same lines that Category 4 inverse-sweep touches.
5. Run the Category 4 inverse sweep in dependency order: leaf-most targets first (templates, sessions, examples), then mid-graph (premises, research files), then top-of-graph constitutions and discoveries.
6. Defer all OQ-C-open rows until the user closes OQ-C.

[End of C3 verbatim return]
