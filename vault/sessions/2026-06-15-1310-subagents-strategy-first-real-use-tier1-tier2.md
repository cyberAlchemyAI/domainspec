---
tags: [agents, ontology, vault]
node_type: research
is_session: true
layer: [ontology, architecture]
nature: [explanatory, technical]
status: active
created: 2026-06-15
timestamp: 2026-06-15T13:10:36-03:00
expires: 2026-08-14
conversation_id: 2026-06-15-1310-subagents-strategy-first-real-use
decisions_made: true
contradictions_found: true
specs_updated: [vault/discovery/anti-bias-vector-composition/validator-check.md, vault/discovery/anti-bias-vector-composition/principle.md, subagents-strategy-constitution-proposal.md, internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Primeiro uso real do mecanismo subagents-strategy, design da camada de enforcement de qualidade (Tier 2) e regra de version-bump (§10) que impede drift na raiz — alto impacto estrutural na governança."
---

# subagents-strategy: primeiro uso real + higiene (Tier 1) e design de enforcement (Tier 2)

## Summary

Esta sessão pôs o mecanismo de orquestração de subagentes em uso real pela primeira vez: rodei uma revisão adversarial completa dos próprios documentos de governança do bundle (4 atacantes + 2 verificadores + auditor), que confirmou um teste quebrado e drift entre a lei escrita e o código. Fechei a higiene (Tier 1) — corrigi a promoção incompleta do tipo "experiment" (bateria de volta ao verde; regra alinhada nas duas cópias da constituição) e adicionei o §10 (version-bump + promoção atômica) para impedir o drift na raiz. Rodei um segundo trabalho (research, meta) para desenhar a camada de enforcement de qualidade (Tier 2); os verificadores derrubaram a proposta ingênua de um carimbo auto-declarado por dar falsa segurança e estabeleceram que só é automatizável a conformidade de referência cruzada, deixando o julgamento de mérito para conferência humana por amostragem. Também realinhei o doc anti-bias-vector-composition ao schema v0.5.2.

## Contradictions

- modifies `vault/discovery/anti-bias-vector-composition/validator-check.md` — realinhado ao schema/vocabulário v0.5.2 e ao conceito renomeado de conformidade de referência cruzada.
- modifies `vault/discovery/anti-bias-vector-composition/principle.md` — realinhado ao vocabulário v0.5.2 (grupos, não layers).
- modifies `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` — §10 adicionado e regra de `experiment` corrigida; cópia repo-root sincronizada.
- validates `internal_tools/subagents-dispatch-hooks/` — revisão adversarial confirmou drift lei-vs-código (em REVIEW-CHANGE-REQUESTS-2026-06-15.md); Tier 2 estabeleceu que mérito não é automatizável, só conformidade.

## Connections

> Forward-only by source (`is_session: true`) per `vault/ontology-conventions.md` §8 — no inverse row is written on any target.

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/subagents-dispatch-hooks/docs/REVIEW-CHANGE-REQUESTS-2026-06-15.md` | `creates` | Esta sessão produziu o relatório de change-requests da revisão adversarial (Tier 1) como arquivo novo. |
| `research/subagents-strategy/2026-06-15-dispatch-hooks-docs-review/attacks.md` | `creates` | Esta sessão produziu os retornos verbatim do red-team da revisão de docs como arquivo novo. |
| `research/subagents-strategy/2026-06-15-dispatch-hooks-docs-review/findings.md` | `creates` | Esta sessão produziu as change-requests verificadas da revisão de docs como arquivo novo. |
| `research/subagents-strategy/2026-06-15-tier2-enforcement-design/research.md` | `creates` | Esta sessão produziu os retornos coletados do design de enforcement Tier 2 como arquivo novo. |
| `research/subagents-strategy/2026-06-15-tier2-enforcement-design/findings.md` | `creates` | Esta sessão produziu a síntese corrigida do design de enforcement Tier 2 como arquivo novo. |
| `vault/discovery/anti-bias-vector-composition/validator-check.md` | `modifies` | Esta sessão realinhou o validator-check ao schema/vocabulário v0.5.2 e ao conceito renomeado de conformidade de referência cruzada. |
| `vault/discovery/anti-bias-vector-composition/principle.md` | `modifies` | Esta sessão realinhou o principle ao vocabulário v0.5.2 (grupos, não layers). |
| `subagents-strategy-constitution-proposal.md` | `modifies` | Esta sessão editou a cópia repo-root da constituição (§10 adicionado; regra de `experiment` corrigida; sincronizada). |
| `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` | `modifies` | Esta sessão editou a cópia do bundle da constituição (§10 adicionado; regra de `experiment` corrigida). |
| `internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs` | `modifies` | Esta sessão alterou a bateria de testes do appender ao corrigir a promoção do tipo `experiment` (volta ao verde). |
| `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/append-dispatch.cjs` | `modifies` | Esta sessão alterou o appender oficial de dispatch ao corrigir a promoção do tipo `experiment`. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Esta sessão registrou as linhas de dispatch (review + research) desta sittings na planilha de telemetria via o appender oficial. |
