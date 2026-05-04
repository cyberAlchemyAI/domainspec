---
tags: [vault, ontology, agents]
node_type: discovery
is_session: true
layer: ontology
nature: explanatory, procedural
status: active
created: 2026-05-03
timestamp: 2026-05-03T03:34:14-03:00
expires: 2026-07-02
conversation_id: cross-boundary-rule-edges-hygiene-2026-05-03
decisions_made: true
contradictions_found: true
specs_updated: [vault/ontology-conventions.md, vault/confidence-levels.md, vault/ontology-architecture-draft.md, vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md, vault/discovery/curator-pipeline-integration/discovery.md, .claude/skills/custom/edges.md, .claude/skills/custom/edge-catalog.md, .claude/skills/custom/frontmatter.md, .claude/agents/domainspec-vault-metadata-curator.agent.md]
promoted_candidates: [vault/discovery/inverse-edge-fix/inverse-edge-fix.md, vault/discovery/_backlog.md]
expected_importance: 8
importance_rationale: "Resolved two open questions (OQ-1, OQ-B), inverted a prior closure, landed governance-level changes in edges.md and ontology-conventions.md, and executed a project-wide rename across 10 files / 4 folders / 46 in-content sweeps — structurally load-bearing for the vault edge model."
---

# Cross-Boundary Rule + Edges-Hygiene Dispatch + Project-Wide Rename

## Summary

Investigated cross-boundary edges (vault → `.claude/skills/*` and vault → `.claude/agents/*`), decided those files are not vault graph nodes — forward-only edges to them are legal-by-design — and landed the rule across `edges.md`, `edge-catalog.md`, `frontmatter.md`, `ontology-conventions.md`, the curator agent, and the two open-question discoveries (marking OQ-1 in `documents-metadata-enforcement` and OQ-B in `curator-pipeline-integration` RESOLVED). Ran a 3-child task-fan-out producing inventory/taxonomy/fix-plan persisted to `.planning/research/edges-hygiene/`; promoted the actionable subset to a focused `vault/discovery/inverse-edge-fix/` discovery and parked the rest (Scope-column proposal, OQ-C cross-repo, catalog amendments for deprecated edges, dangling-target cleanup, etc.) in `vault/discovery/_backlog.md`. Bootstrapped empty `## Connections` blocks on the three high-traffic sinks (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`) and added 8 low-risk inverse rows. Also executed the project-wide rename `subagents-*` → `domainspec-*` and `vault-*` → `domainspec-vault-*` across 10 files, 4 folders, and in-content references in 46 files (with 2 `NEEDS_HUMAN` files in `.planning/subagents-strategy-regime-split/research/` flagged for line-keyed citations of pre-rename artifacts).

## Contradictions

- contradicts prior OQ-1 resolution in `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` — previous closure ruled "skill files are NOT legal edge endpoints"; this session inverts to "forward-only edges to skill/agent files are legal-by-design," so the new resolution supersedes the prior one rather than extending it.

## Files touched

- vault/discovery/inverse-edge-fix/inverse-edge-fix.md
- vault/discovery/inverse-edge-fix/README.md
- vault/discovery/_backlog.md
- .planning/research/edges-hygiene/research/subagents-research.md
- .planning/research/edges-hygiene/research/subagents-findings.md
- .claude/skills/custom/edges.md
- .claude/skills/custom/edge-catalog.md
- .claude/skills/custom/frontmatter.md
- vault/ontology-conventions.md
- vault/confidence-levels.md
- vault/ontology-architecture-draft.md
- .claude/agents/domainspec-vault-metadata-curator.agent.md
- vault/discovery/documents-metadata-enforcement/README.md
- vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md
- vault/discovery/curator-pipeline-integration/README.md
- vault/discovery/curator-pipeline-integration/discovery.md
- vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md
- vault/premise/system-premises.md
- vault/premise/robot-talks-premises.md
- vault/constitution/robot-talks-constitution.md
- vault/discovery/domainspec-vault-edges/research/research.md
- .claude/agents/domainspec-discovery-writer.agent.md (renamed from subagents-discovery-writer)
- .claude/agents/domainspec-findings-writer.agent.md (renamed from subagents-findings-writer)
- .claude/agents/domainspec-research-writer.agent.md (renamed from subagents-research-writer)
- .claude/skills/custom/domainspec-research-writing.md (renamed from subagents-research-writing)
- .claude/skills/custom/domainspec-findings-writing.md (renamed from subagents-findings-writing)
- .claude/skills/domainspec-strategy/ (renamed from subagents-strategy)
- vault/constitution/domainspec-strategy-constitution.md (renamed from subagents-strategy-constitution)
- vault/premise/domainspec-strategy-premises.md (renamed from subagents-strategy-premises)
- vault/discovery/domainspec-strategy-definitions/ (renamed from subagents-strategy-definitions)
- vault/discovery/domainspec-vault-foundations/ (renamed from vault-foundations)
- vault/discovery/domainspec-vault-edges/ (renamed from vault-edges)
- vault/templates/domainspec-research.md (renamed from subagents-research)
- vault/templates/domainspec-findings.md (renamed from subagents-findings)

## Connections

> Forward-only edges into `.claude/skills/**` and `.claude/agents/**` are legal-by-design (carve-out per `vault/ontology-conventions.md` §8 and `.claude/skills/custom/edges.md`). Forward edges into `.planning/**` are forward-only pending OQ-C in `vault/discovery/curator-pipeline-integration/discovery.md` (annotated below). All other targets are vault-internal and carry the inverse on the target side.

| Document | Type | Description |
|----------|------|-------------|
| `../discovery/inverse-edge-fix/inverse-edge-fix.md` | `creates` | Promoted the actionable Category-4 subset of the dispatch findings into a focused discovery (Tier-1 sinks bootstrap + Tier-2 mechanical inverse adds). |
| `../discovery/inverse-edge-fix/README.md` | `creates` | Discovery navigation README produced alongside the main file. |
| `../discovery/_backlog.md` | `creates` | Parking lot for the deferred edges-hygiene workstreams (Scope column, catalog amendments, cross-repo OQ-C, dangling targets, README canonicalization, missing-Connections-block bootstrap). |
| `../../.planning/research/edges-hygiene/research/subagents-research.md` | `creates` | Raw three-child evidence (inventory, taxonomy, fix plan) from the edges-hygiene dispatch. **Forward-only pending OQ-C (`.planning/**` outside the skills/agents carve-out).** |
| `../../.planning/research/edges-hygiene/research/subagents-findings.md` | `creates` | Synthesis findings from the edges-hygiene dispatch; the source the inverse-edge-fix discovery derives from. **Forward-only pending OQ-C (`.planning/**` outside the skills/agents carve-out).** |
| `../discovery/curator-pipeline-integration/discovery.md` | `closes-question` | Closed OQ-B (cross-boundary edges into skills/agents) by recording the user's "skills/agents are not vault graph nodes" ruling as RESOLVED. |
| `../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` | `contradicts` | Inverts the prior OQ-1 closure ("skill files are NOT legal edge endpoints") and replaces it with the new RESOLVED ruling ("forward-only edges to skill/agent files are legal-by-design"). |
| `../../.claude/skills/custom/edges.md` | `modifies` | Landed the formal carve-out for forward-only edges into `.claude/skills/**` / `.claude/agents/**` (Exception section). **Forward-only by design (skill file).** |
| `../../.claude/skills/custom/edge-catalog.md` | `modifies` | Mirrored the carve-out into the authoring-rules layer. **Forward-only by design (skill file).** |
| `../../.claude/skills/custom/frontmatter.md` | `modifies` | Cross-referenced the carve-out from the frontmatter cheatsheet. **Forward-only by design (skill file).** |
| `../ontology-conventions.md` | `modifies` | Landed Section 8 carve-out (formal statement of skills/agents forward-only legality) and bootstrapped the `## Connections` block at the bottom of the file. |
| `../confidence-levels.md` | `modifies` | Bootstrapped the `## Connections` block (Tier-1 sink fix from inverse-edge-fix discovery). |
| `../ontology-architecture-draft.md` | `modifies` | Bootstrapped the `## Connections` block (Tier-1 sink fix). |
| `../../.claude/agents/domainspec-vault-metadata-curator.agent.md` | `modifies` | Updated curator agent prompt to encode the skills/agents carve-out and the new file rename. **Forward-only by design (agent file).** |
| `../discovery/documents-metadata-enforcement/README.md` | `modifies` | Updated README to reflect the OQ-1 RESOLVED state. |
| `../discovery/curator-pipeline-integration/README.md` | `modifies` | Updated README to reflect the OQ-B RESOLVED state. |
| `../discovery/domainspec-vault-foundations/scope-and-domain-axes.md` | `modifies` | In-content sweep for the project-wide rename (`vault-foundations` → `domainspec-vault-foundations`). |
| `../premise/system-premises.md` | `modifies` | In-content rename sweep for `subagents-*` → `domainspec-*` references. |
| `../premise/robot-talks-premises.md` | `modifies` | In-content rename sweep. |
| `../constitution/robot-talks-constitution.md` | `modifies` | In-content rename sweep. |
| `../discovery/domainspec-vault-edges/research/research.md` | `modifies` | Folder renamed from `vault-edges/`; in-content rename sweep applied inside this research file at the new path. |
| `../../.claude/agents/domainspec-discovery-writer.agent.md` | `modifies` | Renamed from `subagents-discovery-writer`. **Forward-only by design (agent file).** |
| `../../.claude/agents/domainspec-findings-writer.agent.md` | `modifies` | Renamed from `subagents-findings-writer`. **Forward-only by design (agent file).** |
| `../../.claude/agents/domainspec-research-writer.agent.md` | `modifies` | Renamed from `subagents-research-writer`. **Forward-only by design (agent file).** |
| `../../.claude/skills/custom/domainspec-research-writing.md` | `modifies` | Renamed from `subagents-research-writing`. **Forward-only by design (skill file).** |
| `../../.claude/skills/custom/domainspec-findings-writing.md` | `modifies` | Renamed from `subagents-findings-writing`. **Forward-only by design (skill file).** |
| `../../.claude/skills/domainspec-strategy/SKILL.md` | `modifies` | Skill folder renamed from `subagents-strategy/`. **Forward-only by design (skill file).** |
| `../constitution/domainspec-strategy-constitution.md` | `modifies` | Renamed from `subagents-strategy-constitution`. |
| `../premise/domainspec-strategy-premises.md` | `modifies` | Renamed from `subagents-strategy-premises`. |
| `../discovery/domainspec-strategy-definitions/README.md` | `modifies` | Folder renamed from `subagents-strategy-definitions/`; README is the navigable file at the new path. |
| `../discovery/domainspec-vault-foundations/README.md` | `modifies` | Folder renamed from `vault-foundations/`; README is the navigable file at the new path. |
| `../templates/domainspec-research.md` | `modifies` | Renamed from `subagents-research`. |
| `../templates/domainspec-findings.md` | `modifies` | Renamed from `subagents-findings`. |
