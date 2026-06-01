---
tags: [vault, ontology, knowledge-calibration, questions-game, individual-fidelity, domain, agents]
node_type: discovery
is_session: true
layer: ontology, domain
nature: explanatory
status: active
created: 2026-05-26
timestamp: 2026-05-26T10:33:00-0300
expires: 2026-07-25
conversation_id: ""
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Established the foundational design space and pre-committed decisions for the individual-fidelity questions-game, including the anti-stale-reference discipline (likely_source = ambiguous) which is a load-bearing epistemic rule for any future calibration mechanism."
---

# Questions-Game — Individual Fidelity Design

## Summary

A sessão se propôs a desenhar como vai funcionar a superfície de "jogos de perguntas" do DomainSpec, começando pelos objetivos; desafiamos o frame de que alinhamento é a medição "fácil" e reorganizamos a superfície como múltiplos jogos por caso de uso em vez de um mecanismo único. Criei `vault/discovery/questions-game/` como pasta-mãe com README de navegação listando 5 filhos candidatos (individual-fidelity, abstraction-level, learning-velocity, group-alignment, corpus-answerability) e escrevi a primeira discovery filha `individual-fidelity/` com quatro decisões pré-comprometidas: referência doc-first, domínio externo, autor como primeiro jogador, calibration queue como saída. A disciplina anti-stale-reference — toda divergência detectada nasce como `likely_source = ambiguous`, nunca acusação contra o jogador — foi nomeada como contribuição central, e o setup autor-como-jogador foi condicionado a referência escrita por terceiros como condição de validade.

## Files touched

- vault/discovery/questions-game/README.md
- vault/discovery/questions-game/individual-fidelity/discovery.md
- vault/discovery/knowledge-calibration-geometry/discovery.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/questions-game/README.md` | `creates` | This session produced the new navigation README for the `questions-game/` parent folder. |
| `vault/discovery/questions-game/individual-fidelity/discovery.md` | `creates` | This session produced the full individual-fidelity discovery (6 hypotheses, 6 alternatives, 10 open questions, working model). |
| `vault/discovery/knowledge-calibration-geometry/discovery.md` | `modifies` | This session added two `cited-by` rows to the Connections block of the pre-existing discovery; no other changes. |
