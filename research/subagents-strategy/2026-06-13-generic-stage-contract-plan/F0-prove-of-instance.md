---
tags: [generic-stage-contract, arcanum, subagents-strategy, pipeline]
node_type: research
is_session: false
layer: architecture, ontology
nature: explanatory, reference
status: draft
version: 0.1.0
last_updated: 2026-06-13
created_by: victorboscaro@gmail.com
---

# F0 — Prova-de-Instância: contrato de etapa do research × contrato de etapa de Arcanum

> **Propósito.** Duas etapas-como-função `artefato_in → passos → artefato_out` **já rodam**: o
> contrato de I/O do `research` (domainspec) e o stage-ledger / dispatch-spec (Arcanum). Esta
> página as justapõe lado a lado para (a) **fundar a generalização em artefatos reais**, não no
> ar, e (b) sob a direção decidida — **Arcanum vira a source of truth do contrato genérico** —
> decidir **o que o domainspec contribui para Arcanum** e **o que fica como override de instância**.
> É trabalho inline (sem dispatch); é o input da Discovery (F1).

## Direção (decidida 2026-06-13)

O contrato genérico de etapa é **framework-level** (cross-project, agnóstico de domínio). Por
isso mora em **Arcanum** (o repo de framework, que já tem disciplina de extração — SIGIL-EXTRACTION-ROADMAP),
não no domainspec (um repo **consumidor**). Divisão de autoridade (Authority-Bound Composition):

- **Arcanum** é dono do **schema / a forma** (dispatch-spec, stage-receipt, frame/handle, kind tipado).
- **domainspec** é dono da **sua instância + enforcement** (telemetry, `register-dispatch`, a constituição de subagentes).

A inversão **não elimina** a decisão de fundo — **relocaliza** ela: para cada invariante do
domainspec, decidir se é **GERAL** (endurece o contrato de Arcanum na fonte) ou **INSTÂNCIA**
(fica como override do domainspec). Ver §"A decisão relocalizada".

## As duas instâncias

| | **Instância L — research (domainspec)** | **Instância R — stage (Arcanum)** |
|---|---|---|
| Onde | `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/` (findings.md §4 contratos por edge; discovery.md; system-view/engineer-view) + constituição §5/§6 + `.claude/skills/research/SKILL.md` | `formulae/dispatch-spec/dispatch.schema.yml` (`step.inputs[].kind` / `outputs[].kind`); `tools/arcanum` ~L740 (stage-receipt jq); `spells/templates/spell.md` (tabela de fase); `arcana/refine/` (loop de 10 estágios); `formulae/dispatch-spec/README.md` (frame/handle) |
| Maturidade | Maduro (v1.0.0 findings + view triad), mas semântica em **prosa/emenda candidata** | Substrato **validável**, mas marcado **draft** (refine é **pilot**); o stage-receipt jq é o único trecho verdadeiramente **operante** |

## Justaposição (dimensão × instância × veredito)

| # | Dimensão | research (domainspec) | Arcanum | Veredito |
|---|---|---|---|---|
| 1 | **Unidade da etapa** | dispatch: groups → agents → `research.md` + `findings.md` | `step` (dispatch-spec) / estágio do refine loop | **COINCIDE** na forma `in → processo → out` |
| 2 | **Input tipado** | briefing (goal+context+angle+expected return) em **prosa**, canal congelado; sem `kind` | `inputs[].kind` ∈ `{intent, frame, handle, decision, ledger, human_answer, external_context, artifact}` | **GAP** → domainspec não tipa; Arcanum sim. *Arcanum contribui.* |
| 3 | **Output tipado** | `research.md` (returns verbatim) + `findings.md` (síntese); **sem tipo** | `outputs[].kind` ∈ `{frame, handle, decision, ledger, artifact, route_menu, handoff, trace_event}` | **GAP** idem |
| 4 | **Resumo vs artefato pesado** | **PROÍBE digest intermediário**; synthesizer lê o arquivo inteiro por *light reference*, nunca transcripts (telephone effect, findings §E3) | `frame` = "safe summary" de saída; `handle` = ponteiro pro artefato bruto | **DIVERGE — a colisão.** `frame`-como-resumo normaliza o que o research proíbe. Veredito proposto: o invariante anti-digest é **GERAL** → endurece `frame`/`handle` de Arcanum (frame vira **referência/índice**, não re-sumário lossy; ou `handle` é obrigatório como input de síntese) |
| 5 | **Close / receipt** | checklist P9 de 6 itens (prosa, emenda candidata) + close row no ledger (`register-dispatch`) | stage-receipt jq: `{receipt_id, run_id, stage, owner, status∈[pass,flag,block,interrupted,timeout], handoff_path, artifact_paths[], blockers[]}`; regra `pass ⇒ artifact_paths não-vazio` | **COMPLEMENTAR.** Arcanum tem o recibo mecânico; domainspec tem a checagem semântica (claim→cite). **Fundir:** receipt carrega status+artifact (Arcanum) **e** asserção de cobertura de citação (P9, domainspec) |
| 6 | **Vocabulário de verdict** | `GO / GO-conditional / LEI / OPEN / KILL` (matriz findings) + reviewer `{UPHELD, REFUTED, DOWNGRADED→}` | `pass / flag / block` (validação) + status do estágio | **DIVERGE — mas provavelmente eixos diferentes.** `pass/flag/block` = **resultado de execução** da etapa (geral); `GO/.../KILL` = **aquisição de elemento de design** ao *autorar* um contrato (instância de etapas de autoria). Testar se conflitam de verdade ou só convivem em camadas distintas |
| 7 | **Anti-bias / multi-perspectiva** | `anti_bias` obrigatório p/ n≥2, `angle` por agente, `robot_talks`, zig-zag synthesizer↔reviewer | `subagent_strategy` {roles, parallelism, `join_policy`∈[quorum, ranked, pareto, parent_synthesis, human_gate]}; `subagent_lifecycle` ledger | **COINCIDE conceitualmente.** Disciplina anti-bias do domainspec é mais enforçada; `join_policy` enum de Arcanum é mais formal. **Cross-pollinate** |
| 8 | **Proveniência / ledger** | `telemetry/agents/subagents-dispatch.yaml` append-only (dispatch row + close row) | `signals/sigil-invocations.jsonl` append-only + observer-envelope por run | **COINCIDE** no padrão (ledger append-only + índices) |
| 9 | **Casa editorial (onde o contrato mora)** | engineer-view **R-11 OPEN** — nenhuma fila committed contém a casa | dispatch-spec é um pacote Formulae com casa clara | **Arcanum-como-source-of-truth RESOLVE R-11:** a casa do contrato é o dispatch-spec de Arcanum |

## Mapa de contribuição

**domainspec → Arcanum** (disciplina semântica — majoritariamente GERAL):
- **anti-telephone / persistência verbatim / sem digest intermediário** → endurece `frame`/`handle`.
- **fechamento P9 claim→cite** → adiciona campo de *cobertura de citação* ao stage-receipt.
- **vocabulário de aquisição de design** (GO/GO-cond/LEI/OPEN/KILL — a "contagem honesta") → disciplina de autoria de contrato.
- **a view triad** (system-view / engineer-view / ontology-view) → veículo de documentação do contrato.

**Arcanum → a casa** (substrato mecânico):
- `kind` tipado (inputs/outputs) em enum fechado.
- stage-receipt jq-operante (`pass ⇒ artifact`).
- separação `frame` / `handle`.
- validador determinístico (`validate-dispatch.py`).
- a própria casa editorial.

## A decisão relocalizada (espinha da Discovery F1)

Para cada invariante do domainspec: **GERAL** (endurece Arcanum) vs **INSTÂNCIA** (override domainspec).
Vereditos-semente (a serem atacados pelo skeptic de não-vacuidade da F1):

| Invariante | Veredito-semente | Razão |
|---|---|---|
| anti-digest / verbatim | **GERAL** | qualquer pipeline de síntese multi-hop sofre telephone effect |
| fechamento P9 claim→cite | **GERAL para etapa de síntese**; N/A p/ etapa não-sintética | citabilidade só faz sentido onde há claim sintetizado |
| verdict GO/.../KILL | provável **INSTÂNCIA** (etapas de autoria/design) | `pass/flag/block` é o status de execução geral; GO/.../KILL é aquisição de design |
| `anti_bias` axis + angles | **GERAL** | tensão multi-perspectiva é propriedade de qualquer fan-out, não só research |

## Perguntas abertas (para a Discovery resolver)

1. **Enum de `kind`:** o enum de dispatch-mechanics de Arcanum (`frame/handle/ledger/...`) basta, ou
   precisamos de um enum de **artefato-de-domínio** (`intent/discovery/spec/plan/tests/code`)? Hipótese:
   **dois eixos ortogonais** — `artifact-kind` (domínio) × `channel-kind` (mecânica).
2. **Split de governança:** schema/contrato em Arcanum; enforcement (telemetry, `register-dispatch`)
   fica no domainspec — confirmar como Authority-Bound Composition.
3. **A perna `→ código`:** continua **FORA** desta rodada; OPEN com gate nomeado. Validar genericidade
   com `review` (já LIVE) como **2ª instância**, não com código.

## Próximo

**F1 — Discovery do contrato genérico de etapa, aterrissando em Arcanum** (território do dispatch-spec),
via fan-out `triangulation`, com a decisão GERAL-vs-INSTÂNCIA como espinha e um skeptic obrigado a
construir uma 3ª instância à mão (não-vacuidade).
