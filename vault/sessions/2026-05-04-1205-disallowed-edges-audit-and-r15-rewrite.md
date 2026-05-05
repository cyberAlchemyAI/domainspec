---
tags: [vault, ontology, agents]
node_type: audit
is_session: true
layer: ontology
nature: procedural, reference
status: active
created: 2026-05-04
timestamp: 2026-05-04T12:05:35-03:00
expires: 2026-07-03
conversation_id: disallowed-edges-audit-and-r15-rewrite-2026-05-04
decisions_made: true
contradictions_found: true
specs_updated: [vault/constitution/domainspec-subagents-strategy-constitution.md, .claude/skills/domainspec-subagents-strategy/SKILL.md, vault/ontology-conventions.md, vault/confidence-levels.md, vault/discovery/_backlog.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "R15 rewritten to mandate docs/features/<feature>/research/<topic>/ as the working folder (forbidding .planning/ and vault/); 71 edge-name violations and 8 illegal node-type combos identified across vault/**, with the mechanical-fixable subset auto-applied; an earlier rename was corrected via a 39-file content sweep that updated 4 frontmatter name fields without renaming any files on disk."
---

# Disallowed-Edges Audit, Mechanical Fix Sweep, Rename Correction, R15 Rewrite

## Summary

Ran a 2-child disallowed-edges audit (DA1 name-validity + DA2 node-type-legality) finding 71 edge-name violations and 8 illegal node-type combos across `vault/**`, then applied mechanical fixes via parallel FX1 + FX2 agents (22 deprecated-edge replacements with inverse adds, 4 illegal session↔session rows dropped, 2 `operationalized-by` redirects to skill targets, plus `refines: research → constitution` and `implements: premise → constitution` rewrites with inverses on `ontology-conventions.md`). Augmented `vault/discovery/_backlog.md` with 67+ file:line entries for residual judgment-required cases. Discovered an earlier rename used `subagents-` → `domainspec-` (REPLACE) instead of the intended `subagents-` → `domainspec-subagents-` (PREPEND); a content-sweep agent updated 39 files across three phases without renaming any files on disk, plus the four `name:` frontmatter fields on the strategy SKILL.md and the three writer agents. Finally rewrote R15 of `domainspec-subagents-strategy-constitution.md` and Step 1 of the corresponding SKILL.md to mandate `docs/features/<feature>/research/<topic>/` as the working folder for future dispatches (forbidding both `.planning/` and `vault/`); legacy artifacts grandfathered.

## Contradictions

- contradicts the rename pattern applied in `vault/sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md` — that session executed `subagents-` → `domainspec-` (REPLACE), this session corrected to `subagents-` → `domainspec-subagents-` (PREPEND) via a 39-file content sweep without on-disk file renames.

## Files touched

- vault/discovery/inverse-edge-fix/inverse-edge-fix.md
- vault/discovery/inverse-edge-fix/README.md
- vault/discovery/_backlog.md
- .planning/research/edges-hygiene/research/subagents-research.md
- .planning/research/edges-hygiene/research/subagents-findings.md
- .planning/research/disallowed-edges-audit/research/subagents-research.md
- .planning/research/disallowed-edges-audit/research/subagents-findings.md
- .claude/skills/custom/edges.md
- .claude/skills/custom/edge-catalog.md
- .claude/skills/custom/frontmatter.md
- .claude/skills/domainspec-subagents-strategy/SKILL.md
- .claude/agents/domainspec-vault-metadata-curator.agent.md
- .claude/agents/domainspec-research-writer.agent.md
- .claude/agents/domainspec-findings-writer.agent.md
- .claude/agents/domainspec-discovery-writer.agent.md
- vault/constitution/domainspec-subagents-strategy-constitution.md
- vault/premise/domainspec-subagents-strategy-premises.md
- vault/ontology-conventions.md
- vault/confidence-levels.md
- vault/ontology-architecture-draft.md
- vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md
- vault/discovery/documents-metadata-enforcement/README.md
- vault/discovery/curator-pipeline-integration/discovery.md
- vault/discovery/curator-pipeline-integration/README.md
- vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md
- vault/discovery/domainspec-vault-foundations/epistemic-chain.md
- vault/discovery/domainspec-vault-foundations/README.md
- vault/discovery/domainspec-vault-foundations/research/epistemic-chain-evidence-survey.md
- vault/discovery/domainspec-vault-edges/research/research.md
- vault/discovery/domainspec-vault-edges/research/findings.md
- vault/discovery/domainspec-vault-edges/research/subagents-strategy.md
- vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md
- vault/discovery/domainspec-strategy-definitions/subagents-strategy.md
- vault/discovery/domainspec-strategy-definitions/README.md
- vault/discovery/robot-talks-definitions/robot-talks.md
- vault/discovery/robot-talks-definitions/README.md
- vault/discovery/robot-talks-definitions/examples/robots-discussing.md
- vault/premise/system-premises.md
- vault/premise/robot-talks-premises.md
- vault/premise/ontology-premises.md
- vault/constitution/robot-talks-constitution.md
- vault/constitution/development-practices-constitution.md
- vault/constitution/event-system-constitution.md
- vault/constitution/folder-structure-constitution.md
- vault/constitution/frontend-constitution.md
- vault/constitution/domain-tagging-constitution.md
- vault/conceptual/epistemic-principles.md
- vault/axiom/ontology-axioms.md
- vault/axiom/system-axioms.md
- vault/axiom/frontend-axioms.md
- TUNING-LOOP.md
- templates/domainspec-research.md
- templates/domainspec-findings.md
- vault/sessions/2026-05-03-0140-subagents-strategy-discovery-target-divergence.md
- vault/sessions/2026-05-03-0327-domainspec-strategy-scope-routed-promotion.md

## Connections

> Forward-only edges into `.claude/skills/**` and `.claude/agents/**` are legal-by-design (carve-out per `vault/ontology-conventions.md` §8 and `.claude/skills/custom/edges.md`). Forward edges into `.planning/**`, `TUNING-LOOP.md`, and `templates/**` are forward-only pending OQ-C in `vault/discovery/curator-pipeline-integration/discovery.md` (annotated below). All other targets are vault-internal and carry the inverse on the target side.

| Document | Type | Description |
|----------|------|-------------|
| `../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md` | `contradicts` | This session's rename correction (`subagents-` → `domainspec-subagents-` PREPEND) inverts the prior session's REPLACE pattern (`subagents-` → `domainspec-`). |
| `../discovery/inverse-edge-fix/inverse-edge-fix.md` | `modifies` | Edge-name violations and inverse adds touched the inverse-edge-fix discovery during the FX1/FX2 sweep (file pre-existed from the 2026-05-03-0334 session). |
| `../discovery/inverse-edge-fix/README.md` | `modifies` | README touched during the same sweep (file pre-existed). |
| `../discovery/_backlog.md` | `modifies` | Augmented with 67+ file:line entries for residual judgment-required cases (file pre-existed). |
| `../../.planning/research/edges-hygiene/research/subagents-research.md` | `creates` | Raw evidence from the edges-hygiene dispatch produced this session. **Forward-only pending OQ-C (`.planning/**` outside the skills/agents carve-out).** |
| `../../.planning/research/edges-hygiene/research/subagents-findings.md` | `creates` | Synthesis findings from the edges-hygiene dispatch produced this session. **Forward-only pending OQ-C (`.planning/**` outside the skills/agents carve-out).** |
| `../../.planning/research/disallowed-edges-audit/research/subagents-research.md` | `creates` | Raw evidence from the DA1/DA2 disallowed-edges audit dispatch. **Forward-only pending OQ-C (`.planning/**` outside the skills/agents carve-out).** |
| `../../.planning/research/disallowed-edges-audit/research/subagents-findings.md` | `creates` | Synthesis findings from the DA1/DA2 disallowed-edges audit dispatch. **Forward-only pending OQ-C (`.planning/**` outside the skills/agents carve-out).** |
| `../../.claude/skills/custom/edges.md` | `modifies` | Edge catalog touched by the audit/fix sweep. **Forward-only by design (skill file).** |
| `../../.claude/skills/custom/edge-catalog.md` | `modifies` | Edge legality matrix touched by the audit/fix sweep. **Forward-only by design (skill file).** |
| `../../.claude/skills/custom/frontmatter.md` | `modifies` | Frontmatter cheatsheet touched. **Forward-only by design (skill file).** |
| `../../.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Step 1 of the SKILL was rewritten to mandate `docs/features/<feature>/research/<topic>/` as the working folder. **Forward-only by design (skill file).** |
| `../../.claude/agents/domainspec-vault-metadata-curator.agent.md` | `modifies` | Curator agent prompt updated for the renamed agent. **Forward-only by design (agent file).** |
| `../../.claude/agents/domainspec-research-writer.agent.md` | `modifies` | Research-writer agent updated by the rename content sweep. **Forward-only by design (agent file).** |
| `../../.claude/agents/domainspec-findings-writer.agent.md` | `modifies` | Findings-writer agent updated by the rename content sweep. **Forward-only by design (agent file).** |
| `../../.claude/agents/domainspec-discovery-writer.agent.md` | `modifies` | Discovery-writer agent updated by the rename content sweep. **Forward-only by design (agent file).** |
| `../constitution/domainspec-subagents-strategy-constitution.md` | `modifies` | R15 rewritten to mandate `docs/features/<feature>/research/<topic>/` as the working folder for future dispatches. |
| `../premise/domainspec-subagents-strategy-premises.md` | `modifies` | Touched by the rename content sweep. |
| `../ontology-conventions.md` | `modifies` | `refines: research → constitution` and `implements: premise → constitution` rewrites with inverses landed here. |
| `../confidence-levels.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../ontology-architecture-draft.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/documents-metadata-enforcement/README.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/curator-pipeline-integration/discovery.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/curator-pipeline-integration/README.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-foundations/scope-and-domain-axes.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-foundations/epistemic-chain.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-foundations/README.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-foundations/research/epistemic-chain-evidence-survey.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-edges/research/research.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-edges/research/findings.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-edges/research/subagents-strategy.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-strategy-definitions/subagents-strategy.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/domainspec-strategy-definitions/README.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/robot-talks-definitions/robot-talks.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/robot-talks-definitions/README.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../discovery/robot-talks-definitions/examples/robots-discussing.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../premise/system-premises.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../premise/robot-talks-premises.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../premise/ontology-premises.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../constitution/robot-talks-constitution.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../constitution/development-practices-constitution.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../constitution/event-system-constitution.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../constitution/folder-structure-constitution.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../constitution/frontend-constitution.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../constitution/domain-tagging-constitution.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../conceptual/epistemic-principles.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../axiom/ontology-axioms.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../axiom/system-axioms.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../axiom/frontend-axioms.md` | `modifies` | Touched by FX1/FX2 sweep. |
| `../../TUNING-LOOP.md` | `modifies` | Touched by the rename content sweep. **Forward-only pending OQ-C (non-vault in-repo path).** |
| `../../templates/domainspec-research.md` | `modifies` | Touched by the rename content sweep. **Forward-only pending OQ-C (non-vault in-repo path).** |
| `../../templates/domainspec-findings.md` | `modifies` | Touched by the rename content sweep. **Forward-only pending OQ-C (non-vault in-repo path).** |
| `../sessions/2026-05-03-0140-subagents-strategy-discovery-target-divergence.md` | `modifies` | FX2 dropped illegal session↔session rows from this session file. |
| `../sessions/2026-05-03-0327-domainspec-strategy-scope-routed-promotion.md` | `modifies` | FX2 dropped illegal session↔session rows from this session file. |
