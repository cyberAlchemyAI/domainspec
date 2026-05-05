---
tags: [subagents, dispatch-artifact, subagents-research, disallowed-edges-audit]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
dispatch_slug: disallowed-edges-audit
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `disallowed-edges-audit`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [../../../../vault/constitution/domainspec-subagents-strategy-constitution.md](../../../../vault/constitution/domainspec-subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location), R17 (downstream `domainspec-subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Context

The user just landed the cross-boundary rule (skills/agents are not vault graph nodes; forward-only edges to them are legal-by-design). Now they want to know which existing edges in `vault/**` are still violating the catalog (off-catalog name, deprecated, illegal per node_type) — so they can be parked in `_backlog.md` with concrete file:line evidence rather than the loose mention currently there.

## Goal

Produce two parallel inventories (name-validity + node-type-legality) that together identify every disallowed edge in `vault/**` with file:line evidence, then run the standard research-writer + findings-writer pipeline. Step 7 will gate whether to promote to a vault discovery or just augment `_backlog.md`.

---

## Agent 1 — Edge-name validity audit (off-catalog / deprecated / invented-inverse)

<!--
Verbatim return from DA1. Do NOT edit, summarize, or reformat.
-->

# Vault Edge Violation Inventory

[71 violations enumerated. Full table contains rows from: vault/axiom/frontend-axioms.md:55-57, vault/axiom/ontology-axioms.md:277,281, vault/conceptual/epistemic-principles.md:127-129, vault/constitution/development-practices-constitution.md:153, vault/constitution/domain-tagging-constitution.md:496-497, vault/constitution/event-system-constitution.md:588, vault/constitution/folder-structure-constitution.md:226, vault/constitution/frontend-constitution.md:227,228,230, vault/constitution/robot-talks-constitution.md:315-317,319, vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:221-230, vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:393-402, vault/discovery/domainspec-vault-edges/research/findings.md:108, vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md:124-131, vault/discovery/domainspec-vault-foundations/epistemic-chain.md:427-428, vault/discovery/domainspec-vault-foundations/research/epistemic-chain-evidence-survey.md:658,661-663, vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md:402-404, vault/discovery/robot-talks-definitions/robot-talks.md:308-310,312, vault/premise/frontend-premises.md:94-95, vault/premise/ontology-premises.md:233, vault/premise/robot-talks-premises.md:203-204, vault/premise/domainspec-subagents-strategy-premises.md:272-280. Each row classified as deprecated or off-catalog with replacement_suggestion (cites / propose-via-discovery / drop-or-rewrite-as-prose / specific catalog edge).]

## Per-violation-class counts
- deprecated: 36
- off-catalog: 35
- invented-inverse: 0
- Total: 71

## Top 10 most-frequently-violated edge names
- references (deprecated, 9)
- contextualizes (deprecated, 8)
- proposes (off-catalog, 7)
- instantiates (deprecated, 4)
- aligns-with (off-catalog, 4)
- mode-of (off-catalog, 4)
- produces (deprecated, 3)
- provenance-for (deprecated, 2)
- questions (deprecated, 2)
- shape-contract-for (off-catalog, 2)

## Key findings
1. Three header schemas in use: canonical `| Document | Type | Description |`, `| Document | Relationship | Description |` (frontend-axioms, frontend-premises, frontend-constitution), and `| Node | Relationship | Purpose |` (domainspec-subagents-strategy-premises, robot-talks-premises, robot-talks-constitution). Prose-bullet `## Connections` exist in 4 README files but each declares only catalog-clean edges.
2. Deprecated dominance concentrated in two families: `references`/`contextualizes` (17 of 36 deprecated rows, all → `cites`) and `produces`/`provenance-for`/`instantiates` (9 rows). `references` clusters in `domainspec-vault-edges/research/` (the dispatch that defined the new catalog — pre-rename artifacts).
3. `proposes` is load-bearing off-catalog edge — used 7× across `domainspec-subagents-strategy.md` and `agents-strategy-prior-version.md` to point at forthcoming files (constitution, skill, templates). Either map to `codified-as`/`operationalized-by` or admit via discovery.
4. `mode-of` and `shape-contract-for` are repeatedly used for relationships the catalog does not cover — load-bearing inside the subagents/robot-talks ontology, would need a discovery to admit.
5. `grounded-by`/`grounded-in` rows in robot-talks-premises, robot-talks-constitution, frontend-constitution all point at non-vault paths — both deprecated AND cross-repo, safe to drop or rewrite as prose.
6. No invented-inverse pairs detected.
7. `axiom/frontend-axioms.md:56` (`derive-from`) is a typo — almost certainly intended as `derives-from`, but the semantic direction is also inverted.

[End of DA1 verbatim return]

---

## Agent 2 — Node-type legality audit (source/target combos vs legality matrix)

<!--
Verbatim return from DA2. Do NOT edit, summarize, or reformat.
-->

# Edge Legality Audit — Vault `## Connections` Inventory

206 edges parsed across the vault.

## Per-verdict counts
- legal: 116
- unverifiable-dangling-target: 54
- legal-by-design (carve-out): 21
- illegal: 8
- unverifiable-OQ-C-pending: 4
- unverifiable-missing-frontmatter: 3

## Illegal edges (node_type combo violates legality matrix)

| source_file:line → target | edge_type | source_nt | target_nt | reason |
|---|---|---|---|---|
| vault/constitution/robot-talks-constitution.md:313 → vault/premise/robot-talks-premises.md | operationalized-by | constitution | premise | target must be skill |
| vault/discovery/domainspec-vault-foundations/research/scope-and-domain-axes-evidence.md:1244 → vault/ontology-conventions.md | refines | research | constitution | source must be in {discovery, spec} |
| vault/premise/ontology-premises.md:232 → vault/ontology-conventions.md | implements | premise | constitution | source must be implementation-plan; target must be discovery |
| vault/premise/robot-talks-premises.md:202 → vault/constitution/robot-talks-constitution.md | operationalized-by | premise | constitution | source must be in {constitution, discovery}; target must be skill |
| vault/sessions/2026-05-03-0140-…-divergence.md:41 → vault/sessions/2026-05-03-0327-…-promotion.md | validated-by | session | session | source must be in {axiom, premise, spec}; target must be in {audit, research, subagents-research, test} |
| vault/sessions/2026-05-03-0140-…-divergence.md:42 → vault/sessions/2026-05-03-0327-…-promotion.md | question-closed-by | session | session | source must be discovery |
| vault/sessions/2026-05-03-0327-…-promotion.md:50 → vault/sessions/2026-05-03-0140-…-divergence.md | validates | session | session | source must be in {audit, research, subagents-research, test}; target must be in {axiom, premise, spec} |
| vault/sessions/2026-05-03-0327-…-promotion.md:51 → vault/sessions/2026-05-03-0140-…-divergence.md | closes-question | session | session | target must be discovery |

## Unverifiable — missing frontmatter
- vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:222,223,224 — source file has no frontmatter at all.

## Unverifiable — .planning/** (OQ-C pending)
- vault/sessions/2026-05-03-0327-…-promotion.md:48,49 → .planning/subagents-strategy-regime-split/research/{subagents-research,subagents-findings}.md
- vault/sessions/2026-05-03-0334-…-dispatch.md:76,77 → .planning/research/edges-hygiene/research/{subagents-research,subagents-findings}.md

## Unverifiable — dangling target (54 rows)
Dominant patterns:
- subagents-* → domainspec-* mid-stream rename: edges still point at planned-but-absent files (vault/constitution/domainspec-subagents-strategy-constitution.md, vault/premise/domainspec-subagents-strategy-premises.md, templates/domainspec-subagents-research.md, templates/domainspec-subagents-findings.md — note `templates/` directory does not exist, files actually at /templates/).
- vault/conceptual/epistemic-principles.md:127–129 use file:/Users/victorboscaro/house_project/docs/vault/… URIs into a sibling repo.
- vault/constitution/robot-talks-constitution.md:315–317 and vault/premise/robot-talks-premises.md:203–204 point at absolute /Users/victorboscaro/specs/… and bare business-philosopher/… paths.
- vault/constitution/domain-tagging-constitution.md:491–497 references vault/constitution/specs/… paths under wrong subtrees.
- vault/discovery/domainspec-vault-foundations/epistemic-chain.md:426 and …/research/epistemic-chain-evidence-survey.md:658,662,663 reference vault/discovery/research/… and vault/discovery/epistemic-chain.md (the file is at domainspec-vault-foundations/epistemic-chain.md).
- vault/sessions/2026-05-03-0334-…-dispatch.md:100,101,104,105 and …0327-…-promotion.md:46 re-target the renamed domainspec-* files.
- One-offs: vault/premise/system-premises.md:122,123 derives to renamed targets; vault/discovery/domainspec-vault-edges/research/{findings,research,domainspec-subagents-strategy}.md link to a domainspec-subagents-strategy.md sibling that doesn't exist; vault/constitution/event-system-constitution.md:592 refs event-system-foundations.md; folder-structure-constitution.md:226 refs fidc-and-credit-rights.md; frontend-constitution.md:230 refs robot-talks-frontend.md.

## Files missing frontmatter or node_type
| file | gap |
|---|---|
| vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md | no frontmatter at all |

Every other vault .md file has both frontmatter and node_type.

## Top illegal edge-type / node_type combos
All eight are unique combos (no repeats). Two clusters:
- session ↔ session validates/closes-question pair (2026-05-03-0140 ↔ 0327, four rows)
- operationalized-by mis-aimed at premise/constitution instead of skill (two rows)
- single occurrences of refines (research → constitution) and implements (premise → constitution)

## Key findings
- 8 illegal edges, half in just two session files (`2026-05-03-0140-…` and `2026-05-03-0327-…`) misusing `validates`/`closes-question` between sessions when both should target a discovery/premise.
- The `operationalized-by` edge is being mis-aimed: must terminate at a skill (which lives outside the vault graph and is reachable only via the carve-out), not at another vault document.
- 54 dangling edges, dominated by the in-progress subagents-* → domainspec-* rename: many session/discovery/premise files declare edges to renamed targets that don't yet exist on disk.
- Only one file lacks frontmatter (`agents-strategy-prior-version.md`).

[End of DA2 verbatim return]

---
