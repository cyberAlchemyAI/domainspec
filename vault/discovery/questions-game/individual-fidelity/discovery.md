---
tags: [domainspec, knowledge, calibration, questions-game, individual-fidelity, c-head, probes, evidence, gamification]
node_type: discovery
is_session: false
layer: domain, application
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-26
created_by: victorboscaro@gmail.com
---

# Individual Fidelity Game

> Working hypothesis: o primeiro jogo de perguntas a ser desenhado mede `d(head_i, reference)` — a distância entre o entendimento de uma pessoa individual e uma superfície de referência **doc-first** num domínio de negócio externo estreito. O primeiro jogador é o próprio autor do DomainSpec, com a condição explícita de que a referência tenha sido escrita por **outro** autor (senão o teste é trivial). A saída do jogo é uma calibration queue, nunca um score.

---

## Objective

Projetar a primeira superfície de jogo que mede fidelidade individual a uma referência **doc-first** num domínio externo estreito, definindo o construct map de "saber esse domínio," o esquema de evidência por interação, o schema de um item de calibração e a disciplina anti-stale-reference. O escopo termina quando essas peças estão definidas de forma suficiente para um experimento smoke; **não** entra: methodologia de validação psicometrica, decisão sync-vs-async (Open Question), alinhamento, nível de abstração, velocidade de aprendizado (cada um em discovery irmã).

Esta discovery é deliberadamente pre-experimento. Seu próximo output legítimo é um spec-seed ou um desenho de experimento pequeno, não uma métrica em produção.

---

## Context

A discovery pai `vault/discovery/knowledge-calibration-geometry/discovery.md` estabeleceu o frame `C_head` / `C_spec` / `C_system` e nomeou bidirectional question-play como o mecanismo de instrumentação. O README de `vault/discovery/questions-game/` decompõe esse mecanismo em casos de uso distintos porque o formato do jogo muda materialmente com o objetivo. **Esta discovery é o primeiro desses casos.**

Fidelidade individual foi escolhida como o primeiro caso a ser projetado porque:

- é pré-requisito de alinhamento — `d(head_i, head_j)` só faz sentido depois que `d(head_i, reference)` está resolvido;
- tem o construct map menos contestado entre os cinco casos (vocabulário, relações, regras, exceções, aplicação são consensuais o suficiente para começar);
- tem baseline simples disponível (acerto cru, autoconfiança) que permite testar se a métrica do jogo ganha algo sobre quiz.

Quatro decisões foram tomadas durante a conversa de design de 2026-05-26 e são premissas que esta discovery não revisa:

**D-1. Referência doc-first.** A spec formalizada é a superfície autoritativa para o primeiro experimento. Code-first e reviewed-synthesis foram considerados e ficam como `A-1` e `A-2` em Alternatives. Esta escolha herda diretamente a tensão de H-5 da pai ("system true must be framed as a reference surface, not absolute truth") — divergência pode ser erro do usuário **ou** evidência de que a spec está stale. A disciplina anti-stale-reference em §3 endereça isso.

**D-2. Domínio é externo a DomainSpec.** Um conceito de negócio externo (candidato: alguma feature do ZefraHub FIDC ou de outro projeto consumer onde a spec é cuidada). Justificativa: meta-recursividade (DomainSpec sobre si mesmo) cria viés de auto-validação difícil de remover.

**D-3. Primeiro jogador é o autor do DomainSpec.** Decisão pragmática (disponibilidade, conhecimento do contexto de produto). **Condição de validade vinculada:** a referência deve ter sido escrita por outro autor, ou o teste é trivial. Esta condição é discutida em H-4 e em OQ-V abaixo.

**D-4. Saída é calibration queue, não score.** Herda anti-dashboard discipline da pai (H-11). Toda interação produz, no máximo, itens acionáveis com evidência, dono provável e direção de correção.

A escolha de **deixar formato (sync vs async vs híbrido) aberto** está em OQ-F porque tem implicações de produto suficientemente grandes para merecer uma decisão separada com mais evidência.

---

## Hypotheses

### H-1. A referência doc-first carrega obrigação dupla: medir o head **e** vigiar a própria referência

**Hipótese.** Toda divergência detectada pelo jogo entra com duas hipóteses concorrentes em aberto: "o head está errado" ou "o doc está stale." O sistema deve registrar ambas como possíveis **antes** de classificar a divergência como gap de conhecimento.

**Por que.** Sem essa disciplina, o jogo silenciosamente trata o doc como verdade absoluta, exatamente o que H-5 da pai proíbe. Em prática isso vira: o item da calibration queue carrega um campo `likely-source ∈ {head, spec, ambiguous}` que começa em `ambiguous` por default e só é resolvido com evidência adicional (re-leitura do doc pelo usuário, comparação com comportamento de sistema, segunda opinião humana).

**Status.** Premissa forte para o desenho do MVP; precisa ser operacionalizada como regra de UI/UX.

### H-2. O construct map inicial herda da pai e propõe 5 componentes para fidelidade individual

**Hipótese.** "Saber o domínio" para fins de medir fidelidade individual decompõe em pelo menos:

1. **Vocabulário** — a pessoa conhece os termos e suas definições conforme a referência?
2. **Relações** — a pessoa identifica que `A depende-de B`, `C é parte-de D`, etc.?
3. **Regras** — a pessoa sabe os invariantes, restrições e políticas?
4. **Exceções** — a pessoa sabe os casos em que a regra geral não se aplica?
5. **Aplicação** — dado um caso novo, a pessoa aplica a regra/conceito corretamente?

**Por que.** A pai lista um conjunto mais amplo (`vocabulary, relations, invariants, application, exception, debugging, extension, critique` em OQ-18). Aplicação, debugging e crítica medem capacidades adjacentes a fidelidade mas que se confundem com **nível de abstração** (discovery irmã `abstraction-level/`). O MVP de individual-fidelity restringe a 5 componentes para evitar overlap entre filhos.

**Limites desta hipótese.** `debugging` e `extension` provavelmente pertencem a `abstraction-level/`; `critique` provavelmente fica fora dos jogos de perguntas e mais perto de `corpus-answerability/` (sentido reverso). Esta hipótese **será revisada** quando aquelas discoveries forem escritas.

**Status.** Starter set; precisa de calibração contra exemplos concretos de probes.

### H-3. Cada probe é tipado por (componente, dificuldade, formato-de-resposta) e produz evidência multi-canal

**Hipótese.** O jogo opera sobre uma biblioteca de probes onde cada probe declara:

- **componente** alvo (um dos 5 acima);
- **dificuldade** declarada pelo autor da probe (`reconhecimento` < `recuperação` < `transferência`);
- **formato de resposta esperado** (texto livre, escolha entre opções da referência, ordenação, identificação de exceção, geração de exemplo).

Toda interação com a probe produz simultaneamente:

- **evidência declarada** (a resposta);
- **evidência inferida** (latência, edições, autoconfiança auto-reportada, pedido de pista);
- **evidência metacognitiva** (a pessoa marca a resposta como "tenho certeza" / "chute" / "não sei").

**Por que.** A pai (seção "Two evidence channels for `C_head`") já estabeleceu que evidência declarada sozinha overvaloriza fluência verbal. Capturar os três canais desde o MVP evita ter que reformatar evidência depois. Tipar a probe permite agregação por componente sem inventar weighting ad-hoc.

**Status.** Estrutura do MVP; o set inicial de probes não está definido (OQ-P).

### H-4. O autor como primeiro jogador é setup válido somente se a referência for de terceiros

**Hipótese.** Validade do primeiro experimento depende de que o jogador (autor do DomainSpec) **não tenha escrito** a referência (nem participado da sua revisão substantiva). Se essa condição falha, o jogo mede execução de memória, não fidelidade.

**Por que.** O autor do DomainSpec naturalmente memoriza as specs que escreveu — sua "fidelidade" a essas specs é artefato de criação, não de aprendizado. Já fidelidade sobre uma spec de domínio externo escrita por terceiros simula a situação realista que o produto pretende servir (onboarding, alinhamento sobre código legado, etc.).

**Operacionalização.** O setup do experimento deve registrar quem escreveu a referência e desqualificar o experimento se essa pessoa for o jogador.

**Status.** Premissa de validade; bloqueia o experimento se não satisfeita.

### H-5. O item de calibração tem schema mínimo de 8 campos

**Hipótese.** Cada item produzido pelo jogo carrega:

| Campo | Tipo | O que captura |
|---|---|---|
| `probe_id` | id | qual probe gerou o item |
| `component` | enum (5 componentes) | qual componente da fidelidade |
| `declared_answer` | text | resposta literal do jogador |
| `evidence_inferred` | object | latência, edições, pedidos de pista |
| `evidence_metacog` | enum {certeza, chute, não-sei} | autoavaliação |
| `likely_source` | enum {head, spec, ambiguous} | começa em `ambiguous` (H-1) |
| `suggested_action` | enum {update-head, update-spec, mark-reference-stale, defer, rewrite-probe} | direção de correção |
| `confidence` | enum {high, medium, low} | confiança do sistema na leitura |

**Por que.** Mira na OQ-21 da pai ("minimum evidence bundle for a divergence item"), restrito ao contexto de individual-fidelity. Schema é deliberadamente pequeno — campos não-essenciais (severidade, dono provável, recurrence) são derivados ou adicionados quando o caso de uso emergir.

**Status.** Schema candidato; campos podem mudar quando o primeiro experimento mostrar quais são genuinamente acionáveis.

### H-6. A discovery não fecha sync vs async — esse split é OQ-F e tem implicações de produto distintas

**Hipótese.** Sync e async não são alternativas equivalentes; cada uma serve um subconjunto diferente das 5 componentes:

- **Sync (sessão ao vivo)** é mais rico para `exceções` e `aplicação` — exige improviso, captura latência e revisões em tempo real;
- **Async (spaced-repetition)** é mais natural para `vocabulário` e `regras` — admite repetição planejada e mede retenção longitudinal.

**Por que isso justifica deixar como OQ.** A escolha não é "qual é melhor" mas "como dividir as 5 componentes entre os dois formatos." Essa decisão exige evidência empírica que esta discovery (pre-experimento) não tem.

**Status.** Aberto deliberadamente. OQ-F enumera as alternativas.

---

## Working Model

### Fluxo de uma interação

```
Sistema seleciona probe -> Apresenta ao jogador -> Coleta evidência declarada
                                                    + inferida + metacognitiva
                                                    |
                                                    v
Compara resposta à referência -> Detecta divergência? -> Sim: cria item (H-5)
                                                          + likely_source = ambiguous (H-1)
                                                          + suggested_action = defer
                                                          |
                                                          v
Item entra na calibration queue para resolução posterior
                                                  (pelo jogador, por revisor, ou por re-leitura)
```

A discovery **não** prescreve quando o item sai de `ambiguous` para `head` ou `spec` — esse é fluxo de produto a jusante. A discovery só garante que o item nasce ambíguo, não como acusação ao head.

### Os 5 componentes e probes-âncora candidatas

Para cada componente, uma probe-âncora ilustrativa (não uma proposta de set final):

| Componente | Probe-âncora ilustrativa | Formato de resposta |
|---|---|---|
| Vocabulário | "Defina X no seu próprio idioma" | texto livre + opção de selecionar definição da referência |
| Relações | "Qual a relação entre A e B?" | escolha tipada (`depends-on`, `part-of`, `derives-from`, ...) + justificativa opcional |
| Regras | "Quando isso é obrigatório?" | texto livre + autoconfiança |
| Exceções | "Existe um caso em que essa regra não vale? Qual?" | texto livre |
| Aplicação | "Cenário concreto Y — o que se aplica aqui?" | resposta narrativa + identificação dos artefatos relevantes |

Essas probes não são definitivas. Elas existem aqui para dar forma ao raciocínio sobre como o jogo se sente. O set real é gerado quando a discovery seguinte (ou o spec-seed) for escrita.

### A disciplina anti-stale-reference (H-1 operacionalizada)

| Etapa | Comportamento |
|---|---|
| Item criado | `likely_source = ambiguous`, `suggested_action = defer` por default |
| Jogador re-lê o doc | Se o jogador, ao ver o doc, ainda discorda, o item migra para `likely_source = ambiguous, suggested_action = mark-reference-stale-candidate` |
| Jogador re-lê o doc e concorda | Item migra para `likely_source = head, suggested_action = update-head` |
| Comparação com comportamento de sistema mostra que sistema implementa o que jogador disse | Item migra para `likely_source = spec, suggested_action = update-spec` |
| Probe ambígua identificada | `suggested_action = rewrite-probe`, item é arquivado sem ação sobre head ou spec |

Esta disciplina é **a contribuição central** desta discovery. Sem ela, "fidelidade individual" colapsa em quiz que culpa o usuário pela referência stale.

### O que esta discovery deixa para spec/experimento

| Item | Razão para não fechar agora |
|---|---|
| Formato sync vs async | OQ-F — requer evidência empírica |
| Set inicial de probes | OQ-P — depende do domínio externo escolhido |
| Política de promoção (quando ambiguous -> head/spec) | É fluxo de produto, não desenho do jogo |
| Argumento de validade psicometrico | Discovery irmã ou follow-up — exige experimento primeiro |
| Como detectar staleness sistematicamente | OQ-S — provavelmente envolve corpus-answerability |

---

## Alternatives Considered

### A-1. Referência code-first

**Posição.** O sistema executável seria a referência; o jogo testa se o head do jogador prevê o comportamento do código.

**Por que rejeitada para o MVP.** Code-first transfere o problema "doc stale" para "bug é verdade." Em domínios de negócio externos (D-2), o código frequentemente codifica trade-offs e atalhos que ninguém defenderia como semântica correta. Doc-first com disciplina anti-stale (H-1) é mais defensável.

**Quando reabrir.** Quando o caso de uso for medir fidelidade sobre um sistema cujo doc é sabidamente incompleto (legado, sem documentação atualizada).

### A-2. Referência reviewed-synthesis (curada)

**Posição.** Criar uma referência curada combinando doc + código + SME antes de cada experimento.

**Por que rejeitada para o MVP.** Custo de produção é alto e introduz viés do curador. Para o primeiro experimento, doc-first é mais barato e a disciplina anti-stale endereça a maior parte do risco. Reviewed-synthesis vira candidata natural quando o jogo escalar para domínios com doc claramente incompleto.

### A-3. Saída como score escalar

**Posição.** "Fidelidade = 73%" ou similar.

**Por que rejeitada.** Vetada pela pai (H-11, A-3 da pai). Score escalar mata localização da divergência e não suporta ação. Item de calibração é a unidade obrigatória.

### A-4. Formato de quiz tradicional (múltipla escolha apenas)

**Posição.** Probes seriam só multiple choice; evita ambiguidade na avaliação.

**Por que rejeitada.** Quiz puro mede reconhecimento, não os 5 componentes propostos. Específicamente, `exceções` e `aplicação` não sobrevivem a multiple-choice sem inventar distratores artificiais. Probes de texto livre são mais caras de avaliar mas indispensáveis para 3 das 5 componentes.

### A-5. Pular o construct map e medir só "acerto global"

**Posição.** Não decompor "saber"; medir só `correto / incorreto` por probe e agregar.

**Por que rejeitada.** Sem construct map, divergências não localizam o tipo de gap (vocabulário vs regra vs exceção). A calibration queue vira lista plana indiferenciada — o anti-padrão "mixing trivial and high-consequence divergences in one undifferentiated number" da pai.

### A-6. Incluir os 8 componentes da pai sem podar

**Posição.** Manter `vocabulary, relations, invariants, application, exception, debugging, extension, critique` todos no MVP.

**Por que rejeitada.** `debugging` e `extension` se confundem com nível de abstração (discovery irmã). `critique` é mais próximo de `corpus-answerability`. Manter os 8 sem separação cria overlap entre filhos de questions-game e dilui o foco de fidelidade.

---

## Open Questions

- **OQ-F — Sync, async, ou híbrido por componente?** *Recomendação:* primeiro experimento usa sync para `aplicação` e `exceções`, async para `vocabulário` e `regras`; `relações` é flexível. Decisão final exige evidência de retenção e custo de UX que esta discovery não tem.

- **OQ-V — Como o setup do experimento garante que o jogador não escreveu a referência?** *Recomendação:* o experimento exige uma referência escrita por terceiro com versionamento explícito; checklist de setup recusa o experimento se a procedência da referência não está clara.

- **OQ-P — Qual é o set inicial de probes para o primeiro domínio?** *Recomendação:* 5-7 probes (uma por componente, mais uma adicional para aplicação) escritas pelo dono da referência, **não** pelo jogador. Set é a primeira coisa a definir quando o domínio for escolhido.

- **OQ-D — Qual domínio externo concreto é o primeiro alvo?** *Recomendação:* feature do ZefraHub FIDC com spec madura escrita por outra pessoa, em escopo pequeno (uma página de spec). A discovery não escolhe agora porque a escolha depende de disponibilidade do dono da referência.

- **OQ-S — Como o jogo detecta sistematicamente que a referência está stale (não apenas item-a-item)?** *Recomendação:* deixar para quando `corpus-answerability/` for escrita — staleness sistêmica é problema do sentido `person → system`, não da fidelidade individual.

- **OQ-A — Quando o item migra de `ambiguous` para `head`/`spec`/`stale-candidate`?** *Recomendação:* política de produto, não desenho de jogo; deixar como item de spec-seed. A discovery só garante a estrutura, não o fluxo.

- **OQ-C — Como evitar que o construct map de 5 componentes vire camisa-de-força para domínios onde algum componente não se aplica?** *Recomendação:* domínio pode declarar quais componentes são `not-applicable` no setup; itens dessa componente são pulados sem penalidade.

- **OQ-B — Qual o baseline a bater?** *Recomendação:* o experimento compara o jogo contra (a) quiz multiple-choice puro sobre as mesmas probes, (b) autoavaliação do jogador antes da sessão. Se o jogo não bate esses dois baselines em "produziu item acionável que não veio dos baselines," ele falha (alinhado com a Pass/Fail ladder da pai).

- **OQ-G — Como evitar gaming do jogador (otimizar para "passar no jogo" em vez de aprender)?** *Recomendação:* primeiro experimento é low-stakes, sem ranking, com evidência metacognitiva visível ao próprio jogador como feedback. Gaming vira problema real quando o jogo tem audiência ou consequência.

- **OQ-R — Como tratar respostas que estão "tecnicamente certas" mas usam terminologia diferente da referência?** *Recomendação:* a probe declara nível de tolerância terminológica (`strict` / `semantic` / `paraphrase-ok`); avaliação humana resolve ambiguidade enquanto a avaliação automática não estiver validada.

---

## Next Moves

- **Escolher o domínio externo concreto** (resolver OQ-D) — converse com o dono da referência candidata; sem isso, o experimento não pode começar.
- **Escrever o set inicial de 5-7 probes** uma vez que o domínio esteja escolhido (OQ-P), pelo dono da referência (não pelo jogador).
- **Desenhar o setup do experimento smoke** seguindo "First experiment shape" da pai, restrito a individual-fidelity: 5-7 probes, 1 jogador (o autor do DomainSpec), 1 referência de terceiro.
- **Operacionalizar a disciplina anti-stale como protocolo de revisão de item** — definir os triggers de migração de `ambiguous` para outros estados (OQ-A) como spec-seed separado.
- **Não escrever** a discovery `abstraction-level/` em paralelo — a forma dela vai depender de quanto a fidelidade individual conseguiu sustentar (especificamente, se H-2 sobre construct map se manteve).
- **Abrir follow-up** sobre métrica de retenção longitudinal quando OQ-F for resolvida (async cria janela natural para retenção).
- **Não introduzir score agregado** mesmo se a calibration queue ficar grande — agregação é OQ-23 da pai e está fora desta discovery.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../README.md` | `derives-from` | A discovery é o primeiro filho ativo da pasta `questions-game/`; herda as 4 decisões já tomadas (referência doc-first, domínio externo, jogador é o autor, saída é calibration queue) e a separação por caso de uso. |
| `../../knowledge-calibration-geometry/discovery.md` | `cites` | Herda o frame `C_head`/`C_spec`/`C_system`, a anti-dashboard discipline (H-11 da pai), a obrigação de tratar referência como surface (H-5 da pai), e a estrutura mínima de calibration item (OQ-21 da pai). |
| `../learning-speed/discovery.md` | `cited-by` | A skeleton de learning-speed cita esta discovery como sibling que reservou o caso de uso (L21, L267) e como fonte das 5 componentes de H-2 que são candidatas a coordenadas do vetor em OQ-LS-4. |
| `../abstraction-level/discovery.md` | `cited-by` | A skeleton de abstraction-level cita esta discovery (L71-73, L233, L267) como reservação explícita: debugging/extension/aplicação se confundem com nível de abstração e devem migrar para a discovery irmã. |
