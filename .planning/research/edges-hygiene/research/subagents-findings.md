---
tags: [subagents, dispatch-artifact, subagents-findings]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
dispatch_slug: edges-hygiene
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `edges-hygiene`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** (metadata) → **Findings** (summary + implications) → **Analysis** (tensions + cross-cutting). Section order is mandatory per R16. Every load-bearing claim in Findings and Analysis MUST cite a passage in `domainspec-subagents-research.md` per R17.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../../vault/constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

OQ-B in `vault/discovery/curator-pipeline-integration/discovery.md` and OQ-1 in `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` both name the cross-boundary edge problem from different angles but neither enumerates the actual population. Without an inventory, "fix the edges" is unfalsifiable. The user has also flagged cross-repo edges (OQ-C) as a separate gap that gets confused with cross-boundary if collapsed. In the same session the user decided that `.claude/skills/*` and `.claude/agents/*` files are not vault graph nodes — forward-only edges TO them are legal-by-design and do NOT need inverses. This decision resolves OQ-B / OQ-1 in principle but the residual edge-hygiene work remains.

## Goal

Produce a vault discovery at `vault/discovery/edges-hygiene/` that (a) enumerates every problematic edge in `vault/**` with file:line evidence, (b) classifies them into orthogonal categories (cross-boundary, cross-repo, dangling-target, missing-inverse, deprecated-type), (c) proposes resolution options per category tied to existing OQs, and (d) declares its own `## Connections` block using **only repo-relative paths** so the discovery is portable across clones.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading). Missing any field violates R18.

**Dispatch id:** `edges-hygiene-2026-05-03`

**Mode:** `task-fan-out` *(R19)*

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `C1-inventory` | `general-purpose` (default sonnet) | Mechanical sweep of `vault/**` for declared edges + target existence checks; high I/O, low judgment | 30,000 | Inventory table (`source_file:line | edge_type | target_path | target_category | inverse_present`) plus per-category counts and dangling-target groupings |
| `C2-taxonomy` | `general-purpose` (default sonnet) | Conceptual reconciliation of the auditor rule with the user's "skills/agents are not nodes" ruling; requires reading `edges.md` + `ontology-conventions.md` and producing an orthogonal classification | 25,000 | Comparison table of categories (applies-when / bidirectional? / target-class / fix-pattern) plus rationale per axis |
| `C3-fix-plan` | `general-purpose` (default sonnet) | Per-row fix proposals across the residual problematic population, with sequencing that respects upstream catalog questions | 30,000 | Per-category fix tables (cross-repo absolute, repo-escaping relative, dangling, missing-inverse) plus a sequencing recommendation |

**Sequencing:** parallel set — single-message dispatch of all three children (R8); no shared scratch.

**Recursion budget actually used:** depth = 0, breadth = 3, total agents = 3 *(defaults per R13: depth 2, breadth 5, total 10; this dispatch stayed well inside the breadth limit and used no recursion)*

**User confirmation timestamp:** 2026-05-03 (current session); explicit opt-in: "you can invoke the subagents to perform the hygiene".

**Working folder:** `.planning/research/edges-hygiene/` (per R15, NOT under `vault/`).

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `C1-inventory` | (not separated) | (not separated) | 91,248 |
| `C2-taxonomy` | (not separated) | (not separated) | 46,370 |
| `C3-fix-plan` | (not separated) | (not separated) | 105,778 |
| **Sum** |  |  | **243,396** |

Declared aggregate budget = 30k + 25k + 30k = 85,000. Actual aggregate = 243,396. Overrun = 243,396 / 85,000 ≈ **2.86×**.

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | `0.95` (judgment) | Inventory covers 134 rows across `vault/**`; taxonomy covers all five categories the parent identified (vault-internal, by-design forward-only, cross-repo, dangling, off-catalog); fix plan covers all four residual problem categories with sequencing. Goal (a)–(c) substantially met; goal (d) — the discovery's own `## Connections` block — is a downstream write step still owed by the parent |
| Independence     | `0.95` (judgment) | Children read `vault/**` directly with no shared scratch; arrived at compatible categorizations independently (C1's empirical buckets map cleanly onto C2's normative buckets, and C3's fix-plan partitions match both) |
| Fidelity         | `0.90` (judgment) | Claims are tied to specific `file:line` citations; one acknowledged simplification — C1's full 134-row table was summarized in research.md with full reproduction left to the dispatch parent's session record |
| Cost discipline  | `0.35`            | declared budget vs actual: `85,000 / 243,396 = 1 / 2.86 ≈ 0.35` (mechanical, per the prior dispatch's `1/11 ≈ 0.09` calculation method) |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in `domainspec-subagents-research.md` (R17).

### F1 — The vault edge population is dominated by vault-internal missing inverses, not by the cross-boundary problem OQ-B foregrounded

- **Claim:** Of 134 declared edges across `vault/**`, 99 are vault-internal and only ~9 of those have a declared inverse on the target side; ~90 vault-internal missing-inverse problems dwarf the 10 by-design forward-only edges to `.claude/skills/*` and `.claude/agents/*`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Summary — counts per category; "Of the 99 vault-internal edges, only ~9 have a declared inverse on the target side").
- **Implication:** The user's "skills/agents are not nodes" ruling resolved a numerically small slice of the problem. The dominant residual hygiene work is vault-internal inverse repair, not boundary policy.

### F2 — Three high-traffic vault files have no `## Connections` block at all

- **Claim:** `vault/ontology-conventions.md`, `vault/confidence-levels.md`, and `vault/ontology-architecture-draft.md` carry no `## Connections` block, so every inbound edge to them is a missing inverse by definition.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--per-edge-fix-plan-for-residual-problematic-edges) (Section 4 note: "Targets `vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/ontology-architecture-draft.md` have no `## Connections` block at all").
- **Implication:** Bootstrapping these three blocks once is cheaper than ~20 row-additions across three files later, and it unblocks the Category-4 inverse sweep — making this the highest-leverage early move in the fix sequence.

### F3 — 27 dangling targets cluster into two distinct causes (renames vs forthcoming-files)

- **Claim:** Of 27 dangling-non-existent edges, ~10 are renamed/moved files (e.g. `agent-dispatch-premises.md` → `domainspec-subagents-strategy-premises.md`; `domainspec-vault-foundations/domainspec-subagents-strategy.md` → `domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md`) and ~10 are "forthcoming" promises (some now actually written but untracked, some superseded, some literal `TBD` placeholders).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Dangling targets, grouped by likely cause — "Renamed/moved file (10)" and "Never-created/forthcoming (10)").
- **Implication:** The two causes need different repair workflows: renames are mechanical path rewrites (or git-mv-aware updates), while forthcoming entries need human triage to decide "still planned / now exists elsewhere / supersede and delete edge."

### F4 — Off-catalog edge names are widespread enough to be structural, not stragglers

- **Claim:** At least 24 distinct edge-type names in active use are deprecated or never in the 21-edge catalog: `references`, `contextualizes`, `produces`, `provenance-for`, `depends-on`, `questions`, `grounded-by`, `grounded-in`, `informs`, `mode-of`, `extends`, `generalizes`, `proposes`, `proposes-edit`, `aligns-with`, `instances`, `instantiates`, `inform`, `drive`, `operationalize`, `derive-from`, `scoped-by`, `shape-contract-for`, `integrated-into`, `validated-by` (used as forward), `ratified-by`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Key findings — "Heavy use of deprecated/non-catalog edges:" list).
- **Implication:** Edge-name reconciliation must precede the Category-4 inverse sweep because adding inverses for names that may be renamed or collapsed is wasted work; this validates C3's sequencing recommendation that the `vault/discovery/domainspec-vault-edges/` discovery lands first.

### F5 — Three wikilinks resolve to no file at all

- **Claim:** `[[robot-talks-frontend]]`, `[[event-system-foundations]]`, and `[[fidc-and-credit-rights]]` are wikilinks with no resolution target anywhere in the vault.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Key findings — "Three wikilinks resolve to nothing").
- **Implication:** These are the cleanest "delete the edge or create the file" decisions in the whole population — they should be batched as a separate trivial PR rather than mixed into the larger sweeps.

### F6 — Cross-repo edges split into "absolute paths to another machine" and "relative paths that escape this repo"

- **Claim:** Six cross-repo edges exist: 3 are absolute `file:///Users/victorboscaro/house_project/...` URLs in `vault/conceptual/epistemic-principles.md:127–129`, and 3 are repo-escaping relative paths (`../../../TUNING-LOOP.md`, `../../../CLAUDE.md`, `implementation/.../agents-strategy.md`); the absolute form already appears at `vault/ontology-conventions.md:369` and `:375`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Cross-repo absolute (3) and Cross-repo relative (3)); [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--resolved-edge-hygiene-taxonomy-under-the-new-skillsagents-are-not-nodes-rule) ("the OS-specific `/Users/victorboscaro/` prefix already appears at `ontology-conventions.md:369` and `:375` — that is a portability bug waiting to fire on any other machine").
- **Implication:** Absolute `file:///` paths are a portability bug independent of OQ-C and can be normalized immediately; OQ-C-open relative paths must wait for the user's cross-repo policy.

### F7 — Five-bucket taxonomy (A–E) is necessary and sufficient under the new ruling

- **Claim:** A clean classification needs five orthogonal buckets: A. vault-internal (bidirectional required), B. forward-only-by-design to harness artifacts (skills/agents), C. cross-repo (out-of-jurisdiction), D. dangling/non-existent (true bug), E. user-coined / off-catalog edge type (orthogonal axis classifying edge-name validity rather than target topology).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--resolved-edge-hygiene-taxonomy-under-the-new-skillsagents-are-not-nodes-rule) (Comparison table; "A/B/C/D classify edges by *target topology*, E classifies them by *edge-name validity*").
- **Implication:** The auditor's "asymmetric edge = bug" rule (`ontology-conventions.md:292`) cannot be applied uniformly anymore; it must run only against bucket A. The discovery at `vault/discovery/edges-hygiene/` must encode this bucket-discrimination as a precondition to the asymmetry check.

### F8 — A `Scope` column on `## Connections` rows is the lowest-impact format change to formalize bucket B

- **Claim:** Adding a fourth column to the `## Connections` table — `| Document | Type | Scope | Description |` with `Scope ∈ {vault, harness, cross-repo}` — lets the auditor enforce "raise asymmetry bug iff `Scope = vault`" without prose parsing or per-file conventions, and without mutating the `node_type` controlled vocabulary in `ontology-conventions.md:56`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--resolved-edge-hygiene-taxonomy-under-the-new-skillsagents-are-not-nodes-rule) (Rationale (2): "A column (`| Document | Type | Scope | Description |` ...) is the cleaner answer because it is machine-readable by the auditor without prose parsing").
- **Implication:** The discovery should propose this column as an amendment to `edges.md` and treat it as the canonical wire-format change that closes OQ-B mechanically.

### F9 — Sequencing the residual fixes is non-trivial because Category 4 depends on Category E resolution

- **Claim:** The fix-plan recommends a six-step sequence: (1) resolve catalog-vs-deprecated edge questions, (2) bootstrap missing `## Connections` blocks on the three high-traffic sinks, (3) fix dangling and repo-escaping paths, (4) drop cross-repo absolute paths, (5) run the inverse sweep in dependency order (leaves first), (6) defer all OQ-C-open rows.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--per-edge-fix-plan-for-residual-problematic-edges) (Sequencing Recommendation, all six steps).
- **Implication:** The discovery's resolution proposals must surface this dependency explicitly — the user (or curator) cannot start with the most visible work (inverse sweep) without first landing the upstream catalog discovery, or much of the inverse work will be re-done.

### F10 — Several README files use bullet-list prose instead of the canonical table format

- **Claim:** Three README files (`domainspec-subagents-strategy-definitions/`, `robot-talks-definitions/`, `documents-metadata-enforcement/`) use bullet-list prose rather than the canonical `## Connections` table, so even where the link is correct, the edge type is implicit and not parseable by the auditor.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Key findings — "3 README files ... use bullet-list prose rather than the canonical table format, so even where the link is correct, the edge type is implicit and not parseable").
- **Implication:** The fix sweep must include a "canonicalize README Connections-block format" step; otherwise the inventory itself remains under-counted.

### F11 — Seven new session files and three new discoveries have no `## Connections` block at all

- **Claim:** Seven newer session files plus three new discoveries (`curator-pipeline-integration/discovery.md` + `README.md`, `documents-metadata-enforcement/documents-metadata-enforcement.md`) have no `## Connections` block at all; this is the same pattern as the inflection-point session `2026-05-03-0216-close-session-edges-bootstrap.md`, whose empty header motivated the user's "skills are not vault nodes" ruling.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Key findings — empty/missing Connections blocks).
- **Implication:** Even after adopting the Scope column, the curator pipeline (per OQ-B) needs a "no missing-block" check on session and discovery creation, otherwise the inventory will keep growing missing-block debt at write time.

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in `domainspec-subagents-research.md` (R17).

### T1 — The auditor rule and the catalog edge `operationalized-by` directly contradict under the new ruling

- **Held by `ontology-conventions.md:290-292` (auditor scope):** every edge must be bidirectional; asymmetric edges are bugs.
- **Reality in `edges.md:45` / `ontology-conventions.md:548` (catalog):** the catalog itself defines `operationalized-by` with target column literally reading `skill`, but `skill` is not a `node_type` value enumerated in `ontology-conventions.md:56`'s controlled vocabulary, and skills carry no `## Connections` block.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--resolved-edge-hygiene-taxonomy-under-the-new-skillsagents-are-not-nodes-rule) (Rationale (2): "the catalog already encodes the target node-type ... but `skill` is not a `node_type` value enumerated in `ontology-conventions.md:56`'s controlled vocabulary — so the auditor today has no way to reconcile 'skill is a valid edge target' with 'skill has no frontmatter and no Connections block.'").
- **Impact:** The auditor will permanently false-positive on every legal `operationalized-by` row until either the bidirectionality rule is scoped to bucket A or the wire format is amended (e.g. F8's Scope column). Severity: blocks the auditor from being used at all on the current vault. This contradiction is the load-bearing reason the discovery is needed.

### T2 — "Forthcoming" promises are an asymmetric debt instrument the catalog has no slot for

- **Held by authoring practice:** ~10 dangling targets are written as `*(forthcoming)*` literal markers, treated as IOUs by the author.
- **Reality in the inventory:** some of those promised files now exist but are untracked (e.g. `domainspec-subagents-strategy-constitution.md`, the `domainspec-subagents-strategy` skill directory), some were superseded and never written (`agents-strategy-constitution.md`, `templates/agents-strategy.md`, `.claude/skills/agents-strategy/`), and at least one is a literal `TBD` placeholder (`scope-and-domain-axes.md:406`).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Never-created/forthcoming (10): items 1, 3, 4, 5, 6).
- **Impact:** Every `*(forthcoming)*` edge silently mutates from "promise" to "dangling bug" the moment the author moves on, with no mechanism to surface the change. The discovery should propose either a structured frontmatter slot for promises (with expiry) or a hard rule that forthcoming markers are never permitted in committed `## Connections` blocks. Severity: medium — explains ~37% of the dangling population.

### T3 — Cross-boundary (OQ-B) and cross-repo (OQ-C) genuinely are different axes despite looking similar

- **Held by the original framing of OQ-B:** "fix the cross-boundary edges" implicitly bundled all non-vault-internal edges together.
- **Reality in C2's taxonomy:** B (forward-only-by-design to harness artifacts) and C (cross-repo) are structurally different — B is "out of graph-node-class" (target is in this repo but not a graph node by ruling), while C is "out of audit jurisdiction" (target is in another repo whose `## Connections` block is not knowable from here).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--resolved-edge-hygiene-taxonomy-under-the-new-skillsagents-are-not-nodes-rule) ("**C** is genuinely a third axis — same forward-only problem but with an 'out of audit jurisdiction' flavor rather than an 'out of graph-node-class' flavor").
- **Impact:** The user's worry about OQ-C being collapsed into OQ-B is empirically validated — they have different fix workflows (B = mark and skip; C = normalize first, then defer to OQ-C policy). The discovery must keep them as separate categories or reintroduce the confusion the user warned against.

### T4 — Children's empirical and normative views agree, which is the strongest evidence the taxonomy is right

- **Held by C1 (empirical sweep):** counts produce six categories — `vault-internal`, `claude-skills-or-agents`, `cross-repo-relative`, `cross-repo-absolute`, `dangling-non-existent`, `github` (zero).
- **Held by C2 (normative reconciliation):** five buckets A–E from rule-reading.
- **Held by C3 (fix planning):** four residual problem categories with sequencing.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) (Summary — counts per category); [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--resolved-edge-hygiene-taxonomy-under-the-new-skillsagents-are-not-nodes-rule) (Comparison table); [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--per-edge-fix-plan-for-residual-problematic-edges) (Sections 1–4).
- **Impact:** The three independent passes converge on the same partition (A=vault-internal; B=skills/agents-by-design; C=cross-repo; D=dangling; with E orthogonal). This is the main fidelity signal supporting the discovery's downstream proposals.

### Cross-cutting observations

> Patterns spanning multiple agents that are not strictly tensions but matter for interpretation.

- **Inverse-sweep work is concentrated, not diffuse.** F1 says ~90 vault-internal missing inverses exist, but F2 says three high-traffic sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`) currently have NO Connections block — so a meaningful fraction of those 90 collapses into "add three blocks once." Ref: [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edges-hygiene-inventory-across-vault) and [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--per-edge-fix-plan-for-residual-problematic-edges).

- **The off-catalog edge names ARE the open question of `vault/discovery/domainspec-vault-edges/`.** C3 explicitly defers Category 4 inverse work behind "the `vault/discovery/domainspec-vault-edges/` discovery's findings landing as a catalog amendment" — so the edges-hygiene discovery cannot resolve in isolation; it must hand off catalog-name decisions to that sibling discovery. Ref: [`domainspec-subagents-research.md` §Agent 3](./domainspec-subagents-research.md#agent-3--per-edge-fix-plan-for-residual-problematic-edges) (Sequencing step 1).

- **Cost overrun (2.86×) is much milder than the prior dispatch's 11×, but children still systematically under-estimated their own scope.** C1 and C3 each produced full tables that exceeded their declared budgets by ~3×, while C2 (the most purely conceptual task) came closest to budget. This suggests inventory and fix-plan tasks across `vault/**` should be budgeted at ~3× the naive estimate, or scoped tighter (e.g. one category per child instead of full sweeps). Ref: Dispatch record (Actual spend table).

- **The discovery's own `## Connections` block (Goal item d) is still owed.** All three children produced what the parent now needs to write the discovery, but none wrote the Connections block itself — that step is reserved for the parent (or a follow-on writer) per R5 (children don't write the persisted artifacts). The findings file flags this as outstanding work.
