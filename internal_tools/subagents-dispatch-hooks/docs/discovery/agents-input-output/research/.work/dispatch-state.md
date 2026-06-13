---
tags: [agents, dispatch, scratchpad]
node_type: scratchpad
is_session: true
layer: operations
nature: procedural
status: in-progress
version: 0.1.0
last_updated: 2026-06-12
---

# Estado de execução — programa agents-input-output (2026-06-12)

Confirmação do humano (gate P2, blanket): executar até o final sem perguntar; todo
artefato revisado por >=3 camadas de 3 agentes; quantos subagentes forem necessários.

## Programa (5 dispatches)

| # | dispatch_id | status |
|---|---|---|
| D1 | 2026-06-12-agent-io-contracts (research) | ROW REGISTRADA — executando |
| D2 | discovery agents-input-output | pendente |
| D3 | system-view | pendente |
| D4 | engineer-view | pendente |
| D5 | ontology-view | pendente |

## D1 — plano de execução (Agent tool; Workflow bloqueado por policy)

explorers(3 ∥) → eu concateno research.md → synthesizer → [feedback cap 1] →
L1(3 ∥)+reviser → L2(3 ∥)+reviser → L3(3 ∥)+reviser → findings.md → close row.

- working_folder: internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/
- intermediários: .work/returns/E*.md, .work/drafts/draft-v*.md, .work/reviews/l*.md
- contagem p/ close row: investigate=3(+fb), synthesize=1+revisers, evaluate=9, helpers=scribes
- sheet completa (prompts por agente): row no ledger telemetry/agents/subagents-dispatch.yaml

## D2–D5 — regras

- Cada um: row no ledger antes de spawnar, close row ao terminar (appender, register-dispatch).
- Writers leem: .claude/skills/custom/discovery-writing.md (D2); .claude/skills/system-view|engineer-view|ontology-view/SKILL.md (D3–D5).
- Ordem: discovery → system-view → engineer-view (lê system-view) → ontology-view (lê tudo).
- Artefatos finais em internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/.
- Review 3×3 por artefato: L1 grounding (fidelidade-à-fonte / inflação / coerência),
  L2 adversarial (precedent / over-spec / definicional), L3 integração (constituição / tooling+irmãos / determinismo-uso).
