---
tags: [ontology, architecture, vault, agents]
node_type: discovery
is_session: true
layer: [ontology, architecture]
nature: [explanatory, procedural]
status: active
created: 2026-06-12
timestamp: 2026-06-12T00:29:32-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-0029-discovery-views-wiring
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Established a load-bearing invariant — views are derive-only artifacts reconciled from the discovery — governing how all four sibling skill artifacts evolve, and left an explicit unbuilt drift-detection OQ."
---

# Discovery→Views Wiring: derive-only / reconcile contract + inter-view edges

## Summary

Wired the DomainSpec `discovery` document to the three structural sibling views (system-view, engineer-view, ontology-view) as their canonical source corpus, deciding that views are **derive-only** artifacts **reconciled** (not regenerated) from the discovery — its sole sanctioned mutation trigger — with provenance carried by a typed `derives-from` edge plus a recorded source-version drift baseline. Added bidirectional inter-view edges (engineer `refines` system; system & engineer `cite` ontology), verified against the edge catalog via implementer + reviewer subagents, and deliberately kept the reconcile contract in PROSE rather than the template-forbidden `mutation_policy` frontmatter. Ran a 4-agent reconnaissance of the sibling `../Arcanum` project to map synergy (inventory / ontology-vault / craft as conceptual twins) and read its AGENT-FRAMEWORK-IMPROVEMENTS memo on dispatch contracts. The drift-detection comparator remains an **open question, unbuilt** — on both sides.

## Files touched

- .claude/skills/custom/discovery-writing.md
- .claude/skills/system-view/SKILL.md
- .claude/skills/engineer-view/SKILL.md
- .claude/skills/ontology-view/SKILL.md
- .claude/skills/system-view/templates/system-view-template.md
- .claude/skills/engineer-view/templates/engineer-view-template.md
- .claude/skills/ontology-view/templates/ontology-view-template.md
- subagents-dispatch.yaml

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/custom/discovery-writing.md` | `modifies` | Added downstream/derive-only/demand-pull section + drift open question. |
| `.claude/skills/system-view/SKILL.md` | `modifies` | Elevated discovery to canonical seed corpus; added provenance-and-mutation contract. |
| `.claude/skills/engineer-view/SKILL.md` | `modifies` | Same elevation + provenance contract; added `--discovery` arg-hint. |
| `.claude/skills/ontology-view/SKILL.md` | `modifies` | Same elevation + provenance contract. |
| `.claude/skills/system-view/templates/system-view-template.md` | `modifies` | Provenance callout + `## Connections` derives-from + inter-view edges. |
| `.claude/skills/engineer-view/templates/engineer-view-template.md` | `modifies` | Provenance callout + `## Connections` derives-from + inter-view edges. |
| `.claude/skills/ontology-view/templates/ontology-view-template.md` | `modifies` | Provenance callout + `## Connections` derives-from + inter-view edges. |
| `subagents-dispatch.yaml` | `modifies` | Registered the 4-agent Arcanum synergy reconnaissance dispatch. |

<!-- Session edges are forward-only by source (vault/ontology-conventions.md §8): no inverse rows
written on targets. All targets are .claude/skills/** + a root yaml (operational artifacts, not vault
graph nodes), which are also legal-by-design forward-only per edges.md. -->

