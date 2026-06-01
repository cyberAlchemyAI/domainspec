---
tags: [vault, agents, ontology, architecture]
node_type: subagents-research
is_session: true
layer: ontology
nature: explanatory
status: active
created: 2026-06-01
timestamp: 2026-06-01T10:31:00-03:00
expires: 2026-07-31
conversation_id: 2026-06-01-1031-interviewer-entropy-reduction
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 6
importance_rationale: "Surfaces a productive tension between existing axioms (preserve uncertainty) and a proposed entropy-reduction criterion (minimize uncertainty), which will gate any future interviewer doctrine update."
---

# Interviewer entropy-reduction research dispatch

## Summary

Sessão investigou como tornar o `domainspec-interviewer` mais intencional ao perguntar, sob a tese de que cada pergunta deve reduzir entropia sobre o espaço de hipóteses do domínio. Disparamos um flat-fanout de 2 filhos via `domainspec-subagents-strategy` v0.3.0 (Explore sobre o vault, general-purpose sobre literatura externa) com tensão de corpus + methodology nomeada. Persistimos o spec, emitimos telemetry start-event, e escrevemos o research file. A discovery NÃO foi escrita — usuário vai revisar o research antes.

## Contradictions

- validates `vault/axiom/domainspec-axioms.md` e `vault/axiom/ontology-axioms.md` (AX-DS-4, AX-ONT-5) — confirmadas como o material vault-side mais carregado sobre intent-guided questioning, mas expõe que governam *preservação* da decision-space, não minimização ativa de entropia; tensão produtiva, não refutação.
- questions `.claude/agents/domainspec-interviewer.agent.md` — doutrina atual usa heurística "prefer discriminating questions" sem critério formal; identificado como gap não-refutado, sem doutrina substituta ainda.

## Files touched

- vault/snapshots/dispatches/2026-05-28-interviewer-entropy-reduction-1-spec.yaml
- vault/discovery/interviewer-entropy-reduction/research/domainspec-subagents-research.md
- internal_tools/vault_telemetry/events/subagent-strategy.jsonl

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/snapshots/dispatches/2026-05-28-interviewer-entropy-reduction-1-spec.yaml` | `creates` | Session produced this dispatch spec artifact as a new file. |
| `vault/discovery/interviewer-entropy-reduction/research/domainspec-subagents-research.md` | `creates` | Session produced this research synthesis as a new file. |
| `internal_tools/vault_telemetry/events/subagent-strategy.jsonl` | `modifies` | Session appended a start-event JSONL line to the pre-existing telemetry sink. |
| `vault/axiom/domainspec-axioms.md` | `validates` | AX-DS-4 surfaced as the vault's closest formalization of intent-guided questioning; tension named, not refuted. |
| `vault/axiom/ontology-axioms.md` | `validates` | AX-ONT-5 (explicit questions transform H_perceived → H_real) surfaced alongside AX-DS-4 as load-bearing prior. |
