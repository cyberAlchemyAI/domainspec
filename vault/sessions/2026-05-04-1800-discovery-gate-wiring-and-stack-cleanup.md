---
tags: [vault, agents, ontology, pipeline, architecture]
node_type: discovery
is_session: true
layer: architecture
nature: procedural, reference
status: active
created: 2026-05-04
timestamp: 2026-05-04T18:00:00-03:00
expires: 2026-07-03
conversation_id: discovery-gate-wiring-and-stack-cleanup-2026-05-03
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Wires constitution R15 (scope-routed discovery promotion) into the live agent stack via a 5-way subagent dispatch and renames the subagents-strategy framework prefix across ~21 files, so downstream pipeline behavior and path references depend on it."
---

# Discovery-Gate Wiring + Subagents-Strategy Rename + Audit P0 Cleanup

## Summary

Wired a soft discovery-before-spec gate across the DomainSpec agent/skill stack via a 5-way parallel subagent dispatch — precondition checks in spec-writer + spec-feature, a Step 0 in pipeline, a routing rule in orchestrator, downstream cite-don't-block citations in planner/verifier/interviewer, and auto-create placeholder logic in brownfield-translation. Canonicalized the gate schema: discovery target `docs/features/<feature>/discovery/<slug>.md` (matching R15), override flag `--skip-discovery <reason>`, SPEC frontmatter waiver `discovery_waived: true` + `discovery_waiver_reason`; bounce-to-interviewer for scope classification; brownfield auto-creates a `status: placeholder` discovery. Renamed the subagents-strategy framework (skill folder, constitution, premises) to the `domainspec-subagents-strategy` prefix and swept structural path references across ~21 live files; an audit on `.claude/agents/` rewrote `domainspec-task-executor`'s broken VS Code Copilot tool block to 9 canonical Claude Code tools and aligned the three writer-agent `name:` fields and template paths with their filenames. Added Route 13 to CLAUDE.md and updated Route 3 to enforce discovery-first ordering; produced research.md + findings.md under `.planning/discovery-gate-wiring/research/` per R2.

## Contradictions

- validates `vault/constitution/domainspec-subagents-strategy-constitution.md` — wired R15 into the soft-gate stack across spec-writer, spec-feature, pipeline, orchestrator, planner, verifier, interviewer, and brownfield-translation.
- questions `vault/discovery/curator-pipeline-integration/discovery.md` — minor: skill-path references updated; OQ-D recommendation block preserved (no semantic change).

## Files touched

- vault/constitution/domainspec-subagents-strategy-constitution.md
- vault/premise/domainspec-subagents-strategy-premises.md
- vault/premise/system-premises.md
- vault/discovery/curator-pipeline-integration/discovery.md
- vault/discovery/_backlog.md
- vault/discovery/domainspec-strategy-definitions/README.md
- vault/discovery/domainspec-strategy-definitions/subagents-strategy.md
- vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md
- vault/discovery/domainspec-vault-edges/research/research.md
- vault/discovery/domainspec-vault-edges/research/findings.md
- vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md
- vault/discovery/domainspec-vault-edges/research/subagents-strategy.md
- vault/discovery/robot-talks-definitions/examples/robots-discussing.md
- .claude/agents/domainspec-spec-writer.agent.md
- .claude/agents/domainspec-orchestrator.agent.md
- .claude/agents/domainspec-planner.agent.md
- .claude/agents/domainspec-interviewer.agent.md
- .claude/agents/domainspec-task-executor.agent.md
- .claude/agents/domainspec-discovery-writer.agent.md
- .claude/agents/domainspec-findings-writer.agent.md
- .claude/agents/domainspec-research-writer.agent.md
- .claude/skills/domainspec-spec-feature/SKILL.md
- .claude/skills/domainspec-pipeline/SKILL.md
- .claude/skills/domainspec-verify-feature/SKILL.md
- .claude/skills/domainspec-brownfield-translation/SKILL.md
- .claude/skills/domainspec-subagents-strategy/SKILL.md
- .claude/skills/custom/domainspec-findings-writing.md
- .claude/skills/custom/domainspec-research-writing.md
- templates/domainspec-research.md
- templates/domainspec-findings.md
- CLAUDE.md
- .planning/discovery-gate-wiring/research/domainspec-research.md
- .planning/discovery-gate-wiring/research/domainspec-findings.md

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `modifies` | Edited as part of the discovery-gate wiring + subagents-strategy rename sweep; the prose Contradictions section frames this as `validates` (R15 wiring) — see NEEDS_HUMAN note in the curator report. |
| `vault/premise/domainspec-subagents-strategy-premises.md` | `modifies` | Edited during the project-wide `subagents-strategy → domainspec-subagents-strategy` rename sweep. |
| `vault/premise/system-premises.md` | `modifies` | Edited during the rename sweep (path/reference updates). |
| `vault/discovery/curator-pipeline-integration/discovery.md` | `opens-question` | Prose Contradictions section frames this as `questions`; mapped to the catalog `opens-question` edge (deprecated `questions` folds into `opens-question`). Skill-path references updated; OQ-D recommendation block preserved (no semantic change). |
| `vault/discovery/domainspec-strategy-definitions/README.md` | `modifies` | Edited during the rename sweep. |
| `vault/discovery/domainspec-strategy-definitions/subagents-strategy.md` | `modifies` | Edited during the rename sweep. |
| `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` | `modifies` | Edited during the rename sweep. |
| `vault/discovery/domainspec-vault-edges/research/research.md` | `modifies` | Edited during the rename sweep. |
| `vault/discovery/domainspec-vault-edges/research/findings.md` | `modifies` | Edited during the rename sweep. |
| `vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md` | `modifies` | Edited during the rename sweep. |
| `vault/discovery/domainspec-vault-edges/research/subagents-strategy.md` | `modifies` | Edited during the rename sweep. |
| `vault/discovery/robot-talks-definitions/examples/robots-discussing.md` | `modifies` | Edited during the rename sweep. |
| `.claude/agents/domainspec-spec-writer.agent.md` | `modifies` | Wired discovery-before-spec precondition check (Step 0) per the soft-gate stack. Forward-only by design (`.claude/agents/**` carve-out). |
| `.claude/agents/domainspec-orchestrator.agent.md` | `modifies` | Added Route 13 (vault-curate) and updated Route 3 to enforce discovery-first ordering. Forward-only by design. |
| `.claude/agents/domainspec-planner.agent.md` | `modifies` | Cite-don't-block citation of the discovery gate. Forward-only by design. |
| `.claude/agents/domainspec-interviewer.agent.md` | `modifies` | Bounce-to-interviewer for scope classification; cite-don't-block citation. Forward-only by design. |
| `.claude/agents/domainspec-task-executor.agent.md` | `modifies` | Audit rewrote broken VS Code Copilot tool block to 9 canonical Claude Code tools. Forward-only by design. |
| `.claude/agents/domainspec-discovery-writer.agent.md` | `modifies` | Aligned `name:` field and template path with filename. Forward-only by design. |
| `.claude/agents/domainspec-findings-writer.agent.md` | `modifies` | Aligned `name:` field and template path with filename. Forward-only by design. |
| `.claude/agents/domainspec-research-writer.agent.md` | `modifies` | Aligned `name:` field and template path with filename. Forward-only by design. |
| `.claude/skills/domainspec-spec-feature/SKILL.md` | `modifies` | Wired discovery-before-spec precondition check. Forward-only by design (`.claude/skills/**` carve-out). |
| `.claude/skills/domainspec-pipeline/SKILL.md` | `modifies` | Added Step 0 discovery gate. Forward-only by design. |
| `.claude/skills/domainspec-verify-feature/SKILL.md` | `modifies` | Cite-don't-block citation of the discovery gate. Forward-only by design. |
| `.claude/skills/domainspec-brownfield-translation/SKILL.md` | `modifies` | Auto-create `status: placeholder` discovery logic. Forward-only by design. |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Edited during the framework rename. Forward-only by design. |
| `.claude/skills/custom/domainspec-findings-writing.md` | `modifies` | Edited during the rename sweep. Forward-only by design. |
| `.claude/skills/custom/domainspec-research-writing.md` | `modifies` | Edited during the rename sweep. Forward-only by design. |
| `templates/domainspec-research.md` | `modifies` | Template path canonicalized. Forward-only by convention (`templates/**` operational artifact). |
| `templates/domainspec-findings.md` | `modifies` | Template path canonicalized. Forward-only by convention. |
| `CLAUDE.md` | `modifies` | Added Route 13; updated Route 3 to enforce discovery-first ordering. Forward-only by convention. |
| `.planning/discovery-gate-wiring/research/domainspec-research.md` | `creates` | New research artifact produced this session per R2 (subagents-strategy two-file artifact set). Forward-only by convention (`.planning/**` working-folder, see OQ-C). |
| `.planning/discovery-gate-wiring/research/domainspec-findings.md` | `creates` | New findings artifact produced this session per R2. Forward-only by convention. |
