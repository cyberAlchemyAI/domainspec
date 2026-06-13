---
tags: [agents, ontology, architecture]
node_type: discovery
is_session: true
layer: architecture
nature: explanatory, reference
status: active
created: 2026-06-12
timestamp: 2026-06-12T21:41:00-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-agent-io-contracts-program
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Primeiro contrato formal de I/O por role do dispatch (research→discovery→views), validação da constituição v0.5.2 em 7 dispatches reais, e reescrita da ontology-view skill com -69% de peso."
---

# Contratos de I/O por agente — pipeline research→views e reescrita da ontology-view skill

## Summary

A sessão partiu da anotação de caderno do owner (Define→Research→Discovery→Refine→Spec), validou-a contra o subagents-strategy e executou um programa de dispatches sobre contratos de I/O por role: research completo (findings com matriz de 18 elementos e contratos por edge), discovery v1.0.0, system-view v1.0.0 e engineer-view v1.2 (parcial — L3 incompleta, user_abort), todos com review 3×3 registrado no ledger. O owner julgou as view-skills verbosas: a ontology-view foi reescrita de 5.610 para 1.747 palavras (+ references/DECISIONS.md) após red-team de 3 lentes; a reescrita de engineer-view/system-view skills foi abortada e os parciais revertidos ao HEAD (possível perda de ~580 palavras não-commitadas do system-view/SKILL.md — recuperável via VSCode Timeline). Ledger fechado consistente: 7 dispatches, 7 close rows.

## Contradictions

- validates `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` — 7 dispatches reais completaram gate→anti-bias→close-row sem desvio de protocolo.
- contradicts `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/findings.md` — o "campo de desvios da close row" (A14) não existe no schema do appender; erratum registrado na discovery §5/§6.

## Files touched

- telemetry/agents/subagents-dispatch.yaml
- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/research.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/findings.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/discovery.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/engineer-view.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/.work/, .work-discovery/, .work-sv/, .work-ev/ (trilhas de review)
- .claude/skills/ontology-view/SKILL.md
- .claude/skills/ontology-view/references/DECISIONS.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | A sessão apendou 7 dispatch rows e 7 close rows ao ledger via appender oficial. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/research.md` | `creates` | A sessão produziu a síntese de research dos contratos de I/O por role como arquivo novo. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/findings.md` | `creates` | A sessão produziu o findings (matriz de 18 elementos e contratos por edge) como arquivo novo. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/findings.md` | `contradicts` | O "campo de desvios da close row" (A14) afirmado no findings não existe no schema do appender; erratum registrado na discovery §5/§6. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/discovery.md` | `creates` | A sessão produziu a discovery v1.0.0 do pipeline research→views como arquivo novo. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md` | `creates` | A sessão produziu o system-view v1.0.0 como arquivo novo. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/engineer-view.md` | `creates` | A sessão produziu o engineer-view v1.2 (parcial — L3 incompleta, user_abort) como arquivo novo. |
| `.claude/skills/ontology-view/SKILL.md` | `modifies` | A sessão reescreveu a skill de 5.610 para 1.747 palavras após red-team de 3 lentes. |
| `.claude/skills/ontology-view/references/DECISIONS.md` | `creates` | A sessão extraiu as decisões da skill reescrita para um arquivo de referências novo. |
