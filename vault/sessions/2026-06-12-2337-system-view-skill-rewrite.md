---
tags: [ontology, vault, agents]
node_type: research
is_session: true
layer: ontology
nature: [procedural, explanatory]
status: active
created: 2026-06-12
timestamp: 2026-06-12T23:37:42-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-2337-system-view-skill-rewrite
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Convergent rewrite of the canonical system-view authoring skill that closes known seams, shaping every future view produced from it."
---

# System-view skill — concise rewrite and reconciliation

## Summary

Explained the system-view/engineer-view/ontology-view skill triad, then audited the sibling repo maestro-trama for those views and judged where the domainspec skills could help. Merged maestro-trama's proven legibility techniques (incremental mermaid build, density, abstract-concrete pairing) plus prior upgrade findings into a concise rewrite of the canonical system-view SKILL (143→113 lines), folding in the reconstructibility test, executive gloss, and existence-not-status rule. Across several adversarial subagent review rounds, reverted a stance "escape hatch" that broke engineer-view's bijective-harvest handshake, resolved a "given" term overload, and closed a prose-verdict evasion seam; then reconciled the template and DECISIONS.md. Final reviews returned no blockers — system-view is converged; the engineer-view rewrite and the maestro-trama exemplar upgrade remain open.

## Files touched

- .claude/skills/system-view/SKILL.md
- .claude/skills/system-view/templates/system-view-template.md
- .claude/skills/system-view/references/DECISIONS.md
- research/subagents-strategy/2026-06-12-systemview-skill-upgrade/merged-system-view-skill-draft.md
- .claude/skills/engineer-view/SKILL.md
- research/subagents-strategy/2026-06-12-systemview-skill-upgrade/findings.md
- research/subagents-strategy/2026-06-12-views-skills-legibility-review/findings.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/system-view/SKILL.md` | `modifies` | Rewrote the canonical system-view authoring SKILL (143→113 lines), folding in reconstructibility test, executive gloss, and existence-not-status rule. |
| `.claude/skills/system-view/templates/system-view-template.md` | `modifies` | Reconciled the system-view template with the rewritten SKILL. |
| `.claude/skills/system-view/references/DECISIONS.md` | `modifies` | Reconciled DECISIONS.md with the rewritten SKILL after the adversarial review rounds. |
| `research/subagents-strategy/2026-06-12-systemview-skill-upgrade/merged-system-view-skill-draft.md` | `creates` | Produced the merged system-view skill draft as a new file during this session. |
| `.claude/skills/engineer-view/SKILL.md` | `consumes` | Read engineer-view's bijective-harvest handshake to avoid breaking it when reverting the stance escape hatch. |
| `research/subagents-strategy/2026-06-12-systemview-skill-upgrade/findings.md` | `consumes` | Used the prior upgrade findings as input to the rewrite. |
| `research/subagents-strategy/2026-06-12-views-skills-legibility-review/findings.md` | `consumes` | Used the legibility-review findings (maestro-trama techniques) as input to the rewrite. |
