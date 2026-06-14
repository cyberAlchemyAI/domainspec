---
tags: [skills, ontology-view, system-view, engineer-view, view-authoring, convention-conformance, single-owner-discipline]
node_type: discovery
is_session: true
layer: ontology
nature: procedural, technical
status: active
created: 2026-06-13
timestamp: 2026-06-13T22:56:59-03:00
expires: 2026-08-12
conversation_id: 2026-06-13-2256-system-engineer-view-siblings
decisions_made: true
contradictions_found: false
specs_updated: [.claude/skills/system-view/SKILL.md, .claude/skills/system-view/README.md, .claude/skills/system-view/templates/system-view-template.md, .claude/skills/engineer-view/SKILL.md, .claude/skills/engineer-view/README.md, .claude/skills/engineer-view/templates/engineer-view-template.md]
promoted_candidates: []
expected_importance: 6
importance_rationale: "Completes the four-view sibling set (ontology/system/engineer + discovery) as reusable skills, but all three view skills remain single-instance-validated against GoldenQuill — reusability is asserted, not yet witnessed."
---

# System-View & Engineer-View Sibling Skills

## Summary

Authored two new hand-authored skill packages — `system-view` (owns the prose/shape, names stances, decides none) and `engineer-view` (owns the verdict decision inventory) — as faithful siblings of the existing `ontology-view`, completing the four-view set where nothing is decided twice. Each follows the domainspec-* convention exactly (4-field frontmatter, Task-not-Agent, `<objective>/<context>/<process>/<output-contract>` body, anti-bias explorer→skeptic→writer→auditor lifecycle, `domainspec-emit-signals` telemetry epilogue). Built in parallel via two subagents that verified every on-disk anchor; the `paired-views` Arcanum spell from the domainspec-core experiment was deliberately NOT ported (this repo composes via `domainspec-subagents-strategy`, not spells).

## Next Steps

- Commit the six new files on `domainspec` `main` (per submodule discipline) — not yet committed.
- First non-GoldenQuill run of any view skill is the reusability proof — pick a real project to exercise `system-view`/`engineer-view`/`ontology-view` end to end.
- Decide whether a composition skill (domainspec idiom, via `domainspec-subagents-strategy`) should wrap the four-view run + single-owner cross-validation.

## Open Questions

- Constitution version skew: `ontology-view`'s SKILL cites v2.4.0/v2.1.1 but the live tree is `vault/ontology-conventions.md` @ v2.3.0 (stale v1.5.1 mirror under implementation/app-frontend) — which copy is canonical, and should ontology-view be corrected?
- Overlay-status + telemetry disciplines are transfer-asserted only: the GoldenQuill worked examples carry no `governance_status` and emit no signals — needs one witnessed instance.
- Should validate/review/publish be modes or companion skill packages (open across all view siblings)?

## Files touched

- .claude/skills/system-view/SKILL.md
- .claude/skills/system-view/README.md
- .claude/skills/system-view/templates/system-view-template.md
- .claude/skills/engineer-view/SKILL.md
- .claude/skills/engineer-view/README.md
- .claude/skills/engineer-view/templates/engineer-view-template.md
</content>
