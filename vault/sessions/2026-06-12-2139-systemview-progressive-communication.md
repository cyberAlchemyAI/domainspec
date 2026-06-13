---
tags: [agents, architecture, ontology, vault]
node_type: research
is_session: true
layer: architecture, ontology
nature: explanatory, procedural
status: active
created: 2026-06-12
timestamp: 2026-06-12T21:39:00-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-systemview-progressive-communication
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Três mutações load-bearing — system-view doc v1.0.0→v1.2.0 (gloss executivo + 5 diagramas progressivos revisados), skill system-view com a nova progressive-communication-discipline e gates mecânicos, template com slots — mais 5 dispatches governados fechados resolved; reconciliação com business-philosopher segue aberta."
---

# System-view: camada executiva, diagramas progressivos e disciplina de comunicação

## Summary

A sessão atacou a ilegibilidade dos artefatos system-view em três ondas. Um review red-team das skills discovery-writing/system-view/engineer-view produziu 10 change requests verificados para uma camada executiva em linguagem comum; o meio-termo entre meta-layers-reference e two-layer-framework foi sintetizado e aplicado como gloss "Para quem chega agora" no system-view de agents-input-output, seguido de 5 diagramas mermaid progressivos (D0–D4) gerados, revisados por skeptics e aplicados (doc → v1.2.0). A skill system-view ganhou a seção `progressive-communication-discipline` (gloss obrigatório, diagramas progressivos, informação crescente, lean writing, abstrato⇄concreto) com gates mecânicos no Step 8/output-contract, e o template ganhou os slots. Cinco dispatches registrados e fechados `resolved` no ledger; business-philosopher inacessível — regras de escrita de primeiros princípios, flagged para reconciliação.

## Contradictions

- questions `.claude/skills/custom/frontmatter.md` — o classificador observou que `frontmatter-semantics.md` lista `essay` como node_type válido mas a tabela de node_type de `frontmatter.md` não o inclui; enums dessincronizados entre as duas fontes de verdade.

## Files touched

- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md
- .claude/skills/system-view/SKILL.md
- .claude/skills/system-view/templates/system-view-template.md
- research/subagents-strategy/2026-06-12-views-skills-legibility-review/attacks.md
- research/subagents-strategy/2026-06-12-views-skills-legibility-review/findings.md
- research/subagents-strategy/2026-06-12-views-skills-legibility-review/.work/draft-v1.md
- research/subagents-strategy/2026-06-12-views-skills-legibility-review/.work/review-v1.md
- research/subagents-strategy/2026-06-12-views-skills-legibility-review/.work/review-v2.md
- research/subagents-strategy/2026-06-12-execgloss-meio-termo/research.md
- research/subagents-strategy/2026-06-12-execgloss-meio-termo/findings.md
- research/subagents-strategy/2026-06-12-execgloss-meio-termo/edit-review/attacks.md
- research/subagents-strategy/2026-06-12-execgloss-meio-termo/edit-review/findings.md
- research/subagents-strategy/2026-06-12-systemview-skill-upgrade/findings.md
- research/subagents-strategy/2026-06-12-systemview-skill-upgrade/diagrams/draft-v1.md
- research/subagents-strategy/2026-06-12-systemview-skill-upgrade/diagrams/findings.md
- telemetry/agents/subagents-dispatch.yaml

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md` | `modifies` | Session aplicou gloss executivo "Para quem chega agora" e 5 diagramas Mermaid progressivos (D0–D4), levando o doc a v1.2.0. |
| `.claude/skills/system-view/SKILL.md` | `modifies` | Session adicionou a seção `progressive-communication-discipline` com gates mecânicos no Step 8 e output-contract. |
| `.claude/skills/system-view/templates/system-view-template.md` | `modifies` | Session inseriu os slots de gloss executivo e diagramas progressivos no template. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Session fechou cinco dispatches do ledger como `resolved` durante a execução. |
| `research/subagents-strategy/2026-06-12-views-skills-legibility-review/attacks.md` | `creates` | Session produziu o arquivo de ataques do review red-team das skills discovery-writing/system-view/engineer-view. |
| `research/subagents-strategy/2026-06-12-views-skills-legibility-review/findings.md` | `creates` | Session produziu os findings consolidados do review de legibilidade das views/skills. |
| `research/subagents-strategy/2026-06-12-views-skills-legibility-review/.work/draft-v1.md` | `creates` | Session produziu o rascunho v1 de trabalho do review de legibilidade. |
| `research/subagents-strategy/2026-06-12-views-skills-legibility-review/.work/review-v1.md` | `creates` | Session produziu o review v1 do draft de legibilidade. |
| `research/subagents-strategy/2026-06-12-views-skills-legibility-review/.work/review-v2.md` | `creates` | Session produziu o review v2 do draft de legibilidade (skeptic pass). |
| `research/subagents-strategy/2026-06-12-execgloss-meio-termo/research.md` | `creates` | Session produziu a síntese de research sobre o meio-termo entre meta-layers-reference e two-layer-framework para o gloss executivo. |
| `research/subagents-strategy/2026-06-12-execgloss-meio-termo/findings.md` | `creates` | Session produziu os findings da análise de meio-termo do gloss executivo. |
| `research/subagents-strategy/2026-06-12-execgloss-meio-termo/edit-review/attacks.md` | `creates` | Session produziu o arquivo de ataques do edit-review do gloss executivo. |
| `research/subagents-strategy/2026-06-12-execgloss-meio-termo/edit-review/findings.md` | `creates` | Session produziu os findings do edit-review do gloss executivo. |
| `research/subagents-strategy/2026-06-12-systemview-skill-upgrade/findings.md` | `creates` | Session produziu os findings do upgrade da skill system-view com progressive-communication-discipline. |
| `research/subagents-strategy/2026-06-12-systemview-skill-upgrade/diagrams/draft-v1.md` | `creates` | Session produziu o draft v1 dos diagramas Mermaid progressivos D0–D4. |
| `research/subagents-strategy/2026-06-12-systemview-skill-upgrade/diagrams/findings.md` | `creates` | Session produziu os findings do review dos diagramas progressivos (skeptic pass aplicado). |
