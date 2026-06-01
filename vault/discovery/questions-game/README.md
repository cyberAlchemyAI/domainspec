---
tags: [domainspec, knowledge, calibration, questions-game, gamification, navigation]
node_type: readme
is_session: false
layer: ontology, application
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Questions-Game

## What is this?

Pasta-mãe das discoveries que projetam **os jogos de perguntas** — o mecanismo bidirecional pelo qual DomainSpec observa `C_head` (conhecimento na cabeça das pessoas) e testa a respondibilidade de `C_spec`/`C_system`. Cada filho é um caso de uso distinto do jogo; o substrate compartilhado (taxonomia de probes, schema de evidência, frame `C_head`/`C_spec`/`C_system`) vive em [`../knowledge-calibration-geometry/discovery.md`](../knowledge-calibration-geometry/discovery.md) e não é redescrito aqui.

## Por que existe esta pasta

A discovery-pai (`knowledge-calibration-geometry`) estabelece que o jogo é o mecanismo de instrumentação. O que ela **não** decide é qual forma o jogo toma quando o objetivo muda. Investigação subsequente mostrou que "o jogo" é na verdade vários jogos, cada um com formato, critério de sucesso e UX distintos:

- medir fidelidade individual a uma referência tem forma diferente de
- medir o nível de abstração em que a pessoa opera, que tem forma diferente de
- medir velocidade de aprendizado, que tem forma diferente de
- medir alinhamento entre pessoas, que tem forma diferente de
- testar respondibilidade do corpus (sentido `person → system`).

Esta pasta agrupa as discoveries que tratam cada um desses casos como objeto de design próprio, sem forçar um mecanismo único antes que o domínio do problema seja entendido.

## O que esta pasta NÃO é

- **Não é** uma especificação de produto. Cada filho é discovery (pre-implementação), não spec.
- **Não é** o lugar onde a taxonomia de probes ou o schema de evidência são definidos — esses vivem na pai (`knowledge-calibration-geometry`) e são citados por todos os filhos.
- **Não é** backlog. Itens planejados-mas-não-iniciados aparecem na tabela abaixo com status `planned`, não em arquivos `node_type: backlog` separados.

## Estado dos filhos

| Filho | Caso de uso | Status | Caminho |
|---|---|---|---|
| **individual-fidelity** | Mede `d(head_i, reference)` num domínio estreito — quão longe o entendimento de uma pessoa está da superfície de referência atual | active (em redação) | [individual-fidelity/discovery.md](individual-fidelity/discovery.md) |
| **abstraction-level** | Detecta em que degrau do ladder concreto→meta-regra a pessoa naturalmente opera, e se ela escolhe o degrau certo para o problema | active (próximo a redigir) | `abstraction-level/discovery.md` |
| **learning-velocity** | Mede quão rápido a pessoa internaliza uma regra/conceito novo e o transfere para casos vizinhos ao longo do tempo | planned | `learning-velocity/discovery.md` |
| **group-alignment** | Mede `d(head_i, head_j)` e `alignment(group)` — alinhamento intra-grupo e contra a referência. Depende de individual-fidelity já resolvido | planned | `group-alignment/discovery.md` |
| **corpus-answerability** | Sentido reverso (`person → system`): testa se `C_spec` e `C_system` respondem, justificam e recuperam o que o usuário pergunta | planned | `corpus-answerability/discovery.md` |

## Decisões já tomadas (resumo)

Estas decisões foram fechadas em conversa de design (sessão de 2026-05-26) e são premissas para todos os filhos:

- **Alinhamento NÃO é o caso fácil.** Está downstream de fidelidade individual (que precisa estar resolvida primeiro), exige probes invariantes e máquina estatística adicional (measurement invariance / IRT) que casos individuais não precisam. Por isso aparece como `planned`, não na primeira leva.
- **Cada caso de uso tem forma de jogo diferente.** O design não tenta um mecanismo único que serve todos os 5 casos; cada filho é livre para propor sua própria forma (spaced repetition, ladder de probes, longitudinal, Delphi, log de Q&A).
- **O substrate compartilhado fica na pai.** Taxonomia de probes (definição, distinção, exceção, justificativa, transferência, predição) e schema de evidência (declarada + inferida + metacognitiva) vivem em `../knowledge-calibration-geometry/discovery.md`. Filhos citam, não duplicam.
- **Ordem de redação: sequencial, fidelidade primeiro.** A primeira leva escreve `individual-fidelity` até concluir; depois `abstraction-level`. As outras três ficam `planned` até justificativa explícita.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../knowledge-calibration-geometry/discovery.md` | `cites` | A discovery-pai estabelece o frame `C_head`/`C_spec`/`C_system`, a taxonomia de probes e o schema de evidência que todos os filhos desta pasta consomem sem redescrever. |
| `individual-fidelity/discovery.md` | `derives` | Esta pasta é a base da qual a discovery `individual-fidelity` deriva: herda as 4 decisões já tomadas (referência doc-first, domínio externo, jogador é o autor, saída é calibration queue) e a separação por caso de uso documentada aqui. |
| `learning-speed/discovery.md` | `derives` | Skeleton da discovery sibling de learning-speed (derivada de produtividade) deriva desta pasta: herda a separação por caso de uso e o substrate compartilhado. |
| `abstraction-level/discovery.md` | `derives` | Skeleton da discovery sibling de abstraction-level (nível em que pessoa/tool operam) deriva desta pasta sob a mesma disciplina. |
