---
tags: [subagents-strategy, dispatch, experiment, falsification, governance, promotion]
node_type: discovery
is_session: false
layer: architecture
nature: explanatory, technical
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-06-13
created_by: victorboscaro@gmail.com
---

# Discovery — Promoção do `dispatch_type: experiment` (FORECAST → LIVE, recorte estreito)

## Objective

Promover `experiment` de nome reservado (FORECAST) para `dispatch_type` **LIVE** na constituição
de subagentes v0.5.2, num **recorte estreito**: falsificação-sobre-raciocínio contra um critério
pré-registrado, **sem** substrato de execução de código. O estado final é `experiment` dispatchável
ao lado de `research` e `review`, com um type skill próprio (`.claude/skills/experiment/SKILL.md`),
**zero mudança no schema da row** (o critério pré-registrado mora como artefato no `working_folder`,
não como coluna), e o `runner`-de-código deixado explicitamente reservado até o tipo `code` aterrissar.

> Esta discovery **decide** a forma do recorte estreito e os vereditos dos três portões de promoção
> nomeados em [constituição §5, linha 175](../../../../../subagents-strategy-constitution-proposal.md).
> Ela não reescreve a definição falsificacionista já reservada — herda-a e a estreita. A disciplina
> anti-vacuidade que governa cada decisão abaixo vem do
> [rigor-dial findings](../../../../../research/subagents-strategy/2026-06-13-rigor-dial-proposal/findings.md):
> uma adição só sobrevive se produzir um delta observável que o estado atual não produz.

---

## 1. Business Context

### Why now

`experiment` já está reservado em todos os quatro layers do subsistema — lei
([constituição §5:170-175](../../../../../subagents-strategy-constitution-proposal.md)), form
([register-dispatch/SKILL.md:50](../../skills/register-dispatch/SKILL.md)), appender
(`DISPATCH_TYPES` em [append-dispatch.cjs:96](../../skills/register-dispatch/append-dispatch.cjs)),
e modelo ([LEDGER-MODEL.md:139](../../LEDGER-MODEL.md)) — mas como **nome FORECAST**, não
dispatchável. O gatilho concreto é que **já existe um experimento querido-e-não-servido**: o roster
de formalização [`formalization/dispatch-formal-guarantees/dispatch.yaml`](../../../formalization/dispatch-formal-guarantees/dispatch.yaml)
é experiment-shaped em tudo menos no nome (`success_metric` com `type`+`threshold` = critério
pré-registrado; `novelty_is_success: false`; a moldura "sobrevive aos três portões OU é arquivado
como typed-negative com seu collapse-test"), mas está sendo rodado pelo scaffold do skill `research`
porque não há tipo `experiment` LIVE. Isso satisfaz o **portão 1** de promoção. Os outros dois
portões (substrato de execução; peer-vs-sub-mode) ou são dissolvidos pelo recorte ou resolvidos aqui.

### What's broken

Cada lacuna com localização verificada:

1. **`experiment` não é dispatchável** — [append-dispatch.cjs:99](../../skills/register-dispatch/append-dispatch.cjs)
   tem `LIVE_TYPES = new Set(['research', 'review'])`; uma row com `dispatch_type: experiment` é
   gravada mas emite `note: ... reserved (FORECAST) type` ([linha 362-363](../../skills/register-dispatch/append-dispatch.cjs)),
   e registrá-la sinaliza violação de constituição upstream ([SKILL.md:50](../../skills/register-dispatch/SKILL.md)).
2. **O grader que diferencia `experiment` de `research` não tem casa executável** — a constituição
   ([§5:175](../../../../../subagents-strategy-constitution-proposal.md)) nomeia o grader de `experiment`
   (falsificação contra critério pré-registrado + validade interna + reprodutibilidade) como distinto
   do grader de `research` (cobertura / claim≤proof), mas não existe type skill que carregue esse
   julgamento — `research` e `review` têm; `experiment` não.
3. **Duas perguntas de promoção ficaram abertas na própria reserva** — [§5:175](../../../../../subagents-strategy-constitution-proposal.md)
   registra "is `experiment` a peer `dispatch_type` or a sub-mode of `research`?" e "the `runner`
   role collides with the reserved `code` type (no execution substrate yet)" sem veredito. Enquanto
   abertas, qualquer promoção é prematura (risco do tipo vacuo / re-skin — a falha que o
   [rigor-dial findings](../../../../../research/subagents-strategy/2026-06-13-rigor-dial-proposal/findings.md)
   matou em 4 rounds).
4. **A contagem "reserved" está em drift entre cópia instalada e repo** — a descrição do skill
   `register-dispatch` instalado diz "the other three dispatch_types are reserved"; o
   [SKILL.md:50](../../skills/register-dispatch/SKILL.md) do repo diz "the other four". Promover
   `experiment` muda a contagem de novo (passa a três reservados) — e é a oportunidade de alinhar.

### What stays the same

Fronteiras nomeadas, fora de escopo:

- **`research` e `review` inalterados** — graders, role-semantics e type skills atuais não mudam.
- **Schema da row v0.5.2 inalterado** — **zero coluna nova**. Em particular, `success_metric` /
  qualquer critério agregado **não** vira campo (continua REMOVED por v0.5.2; reintroduzi-lo
  repetiria o erro que o rigor-dial matou). O critério pré-registrado mora como artefato no
  `working_folder`, não como coluna (ver §3.3).
- **Enums de role inalterados** — `groups[].role` (`investigate|evaluate|meta-evaluate|synthesize`)
  e `agents[].role` (`explorer|skeptic|writer|auditor`) não ganham valores; os papéis conceituais
  de `experiment` mapeiam sobre os enums existentes (ver §3.2), exatamente como `review` reusou os
  quatro papéis de `research`.
- **O `runner`-de-execução-de-código permanece RESERVADO** — gated no tipo `code` + substrato de
  execução. Esta promoção cobre só o runner-de-raciocínio (ver §3.2, §3.4).
- **Disciplina de duas-appends, append-only, idempotência, gate humano P2** — inalteradas.
- **A formalização existente** continua um roster de skill `research`; promover `experiment` não a
  re-tipa retroativamente (grandfathering — [SKILL.md "Grandfathering"](../../skills/register-dispatch/SKILL.md)).

---

## 2. Core Concepts

### 2.1 O recorte estreito: falsificação-sobre-raciocínio

`experiment` LIVE = um dispatch que **roda uma sonda (probe) contra um critério de sucesso/falha
fixado *antes* de rodar**, e adjudica sobreviveu-vs-falsificado. No recorte estreito, a "sonda" é
**raciocínio/investigação sobre artefatos** (ler código, construir testemunhas à mão, derivar um
contra-exemplo), **não** execução de código. Decisão: o recorte estreito é a forma promovível hoje
porque dissolve o portão 2 (falsificação sobre raciocínio não precisa de substrato de execução) sem
sacrificar o núcleo não-vacuo.

### 2.2 O diferenciador não-vacuo é o **grader**, não os roles

A tentação é justificar `experiment` pelos seus roles (designer/runner/adjudicator/skeptic). Isso é
uma armadilha de vacuidade: roles renomeados sobre o mesmo grader = re-skin de `research`. O que
genuinamente distingue `experiment` é **o grader**:

| Tipo | Grader (como julga o sucesso) |
|---|---|
| `research` | cobertura / claim ≤ proof (toda claim load-bearing cita o que a sustenta) |
| `review` | severidade × verificação de flaws em artefato existente |
| **`experiment`** | **falsificação contra um critério pré-registrado + validade interna do teste + reprodutibilidade** |

A propriedade load-bearing é **pré-registro**: o critério é fixado e congelado *antes* do resultado
existir. `research` não tem isso — sua síntese é avaliada *depois*, por cobertura. Esse delta
(critério-antes-do-resultado) é o que torna `experiment` um **peer**, não um sub-modo (ver §3.5).

### 2.3 Pré-registro enforçado por topologia, não por coluna

Como garantir "critério fixado antes do resultado" sem um campo de schema? **Pela topologia do
dispatch + o freeze do confirm-gate.** O grupo `designer` (que escreve o critério) tem uma aresta
`sequential` para o grupo `runner` (que produz o resultado bruto): o critério aterrissa no
`working_folder` como artefato durável **antes** do runner rodar, e o sheet inteiro é congelado no
confirm-gate humano (P2) — qualquer edição re-entra o gate. O "pré-registro" é então uma propriedade
**verificável contra artefato** (o arquivo do critério existe e é anterior ao resultado), não uma
asserção em prosa. Isto espelha a conclusão do
[rigor-dial findings §3](../../../../../research/subagents-strategy/2026-06-13-rigor-dial-proposal/findings.md):
o escalar de critério vive como artefato de elicitação/design, nunca como coluna persistida.

---

## 3. Especificações detalhadas

### 3.1 Promoção do `dispatch_type` (a mudança de lei)

- **Constituição [§5:175](../../../../../subagents-strategy-constitution-proposal.md):** mover
  `experiment` de "reserved/FORECAST" para LIVE, no recorte estreito; registrar os vereditos dos
  três portões (§3.5), o mapa role→enum (§3.2) e a decisão critério-como-artefato (§3.3). Seguir o
  precedente de `review`: gravável sem version bump se o schema da row não muda (e não muda) —
  fold na próxima emenda versionada, com re-confronto dos débitos §7 (AFFIRMED unchanged: nenhuma
  máquina de spawn/custo nova, registry segue sendo a única superfície de persistência).
- **`append-dispatch.cjs`:** adicionar `'experiment'` a `LIVE_TYPES`
  ([linha 99](../../skills/register-dispatch/append-dispatch.cjs)). Efeito colateral desejado: o
  `working_folder` passa a ser **required** para `experiment` (a checagem em
  [linha 152](../../skills/register-dispatch/append-dispatch.cjs) é `LIVE_TYPES.has(...)`), o que é
  correto — é onde o critério pré-registrado e o resultado bruto aterrissam.
- **`register-dispatch/SKILL.md`:** atualizar a row `dispatch_type` (experiment agora LIVE,
  recorte estreito) e a contagem "the other four reserved" → "the other three" (`code | plan |
  suggestion`). Alinhar a descrição do skill instalado (corrige o drift do What's broken #4).
- **README + LEDGER-MODEL.md:** atualizar os ponteiros "research e review LIVE" → incluir experiment.

### 3.2 Mapa role-conceitual → enum de schema (sem enum novo)

Os quatro papéis conceituais de `experiment` mapeiam sobre os enums existentes, como `review` fez:

| Papel conceitual (constituição §5) | `groups[].role` | `agents[].role` | Função epistêmica |
|---|---|---|---|
| **designer** — desenha a sonda + o critério de falha/sucesso | `investigate` | `writer` | autora o critério pré-registrado (artefato) |
| **runner** — executa a sonda, produz resultado bruto | `investigate` | `explorer` | **recorte estreito: sonda = raciocínio/investigação, NÃO execução de código** |
| **adjudicator** — decide sobreviveu/falsificado vs o critério | `evaluate` | `auditor` | veredito contra critério |
| **skeptic** — ataca a validade (confounds, "o teste não testa a hipótese") | `evaluate` | `skeptic` | gate de validade interna |

Decisão: **nenhum valor de enum novo**. O type skill (§3.4) carrega o mapa e a semântica
falsificacionista; o schema permanece o de v0.5.2.

### 3.3 Onde mora o critério pré-registrado

Decisão: **artefato no `working_folder`, output do grupo `designer`** — nunca uma coluna. O
appender já rejeita `success_metric` por unknown-key ([rigor-dial findings §4 (e)](../../../../../research/subagents-strategy/2026-06-13-rigor-dial-proposal/findings.md));
reintroduzi-lo como campo repetiria o erro de vacuidade. O pré-registro é enforçado pela aresta
`designer →(sequential)→ runner` + o freeze P2 (§2.3). O ledger captura o **design** (que houve um
designer, um runner, um adjudicator e a topologia) — coerente com [LEDGER-MODEL §6](../../LEDGER-MODEL.md):
o ledger grava design + desfecho de governança, não o sinal comportamental.

### 3.4 O type skill `.claude/skills/experiment/SKILL.md` (novo)

Paralelo a `research` e `review`. Carrega **só** o julgamento de tipo-experiment (o router e a form
continuam donos do resto):

- **Semântica dos quatro papéis** sob falsificação (o mapa de §3.2 + o que cada um entrega).
- **Disciplina de freeze do critério** — o critério é artefato anterior ao resultado; a topologia
  canônica é `designer →(sequential)→ runner →(sequential)→ adjudicator`, com `skeptic` em paralelo
  ao adjudicator (ou zig-zag adjudicator↔skeptic para a checagem de validade).
- **Matriz de veredito do adjudicator** — `SURVIVED | FALSIFIED | INVALID` (INVALID quando o skeptic
  derruba a validade interna: o teste não testa a hipótese). Distinta da matriz `GO/.../KILL` de
  `research` e do `UPHELD/REFUTED/DOWNGRADED` de `review`.
- **Gates do skeptic** — confounds, o teste não discrimina, reprodutibilidade ausente.

### 3.5 Vereditos dos três portões de promoção

| Portão (constituição §5:175) | Veredito | Razão |
|---|---|---|
| 1. experimento real querido-e-não-servido | ✅ **SATISFEITO** | a formalização é experiment-shaped rodada sob `research` por falta do tipo (Why now) |
| 2. substrato de execução | ✅ **DISSOLVIDO pelo recorte** | falsificação-sobre-raciocínio não executa código; o runner-de-código fica reservado (What stays) |
| 3. peer vs sub-mode | ✅ **RESOLVIDO: PEER** | o grader difere (critério-antes-do-resultado), não só os roles (§2.2); o evidence-harness é sibling da tower em Arcanum ([F0 §"As duas instâncias"](../../../../../research/subagents-strategy/2026-06-13-generic-stage-contract-plan/F0-prove-of-instance.md)) corrobora |

### 3.6 Cleanup

Nenhuma deleção. Mudanças são aditivas (um type skill novo) + edições pontuais em 4 docs/1 appender.
A descrição stale do skill instalado (What's broken #4) é corrigida, não removida.

---

## 4. Open Questions

Cada uma com recomendação, não só pergunta.

1. **Colisão runner ↔ `code`.** O recorte estreito define `runner` = raciocínio/investigação. Quando
   `code` aterrissar (com substrato de execução), `experiment` vai querer um runner-de-execução real.
   **Recomendação:** documentar a colisão no type skill como fronteira explícita ("runner-de-código
   é RESERVADO; um experiment que precise executar código deve esperar `code` LIVE"), e tratar o
   runner-de-execução como uma *extensão futura* de `experiment`, gated no mesmo evento que promove
   `code`. Não bloquear esta promoção por isso.

2. **Onde o veredito SURVIVED/FALSIFIED/INVALID se encaixa no contrato genérico de etapa.** O
   [F0-prove-of-instance](../../../../../research/subagents-strategy/2026-06-13-generic-stage-contract-plan/F0-prove-of-instance.md)
   (dimensão #6) está decidindo se vocabulários de verdict (`GO/.../KILL` de research, `pass/flag/block`
   de Arcanum) são eixos distintos ou colidem. O verdict de `experiment` é um terceiro vocabulário.
   **Recomendação:** registrar `SURVIVED/FALSIFIED/INVALID` como input para a F1 do generic-stage
   (provável veredito: eixo de *aquisição de resultado de experimento*, distinto do status de execução
   `pass/flag/block`), e **não** unificar aqui — é uma questão de contrato cross-project, território
   de Arcanum.

3. **Reprodutibilidade como parte do grader, sem substrato de execução.** O grader inclui
   "reprodutibilidade", mas sem execução de código a reprodutibilidade de uma sonda-de-raciocínio é
   "outro agente, mesmo critério e mesmos artefatos, chega ao mesmo veredito". **Recomendação:** no
   recorte estreito, definir reprodutibilidade como *re-adjudicação determinística* (o adjudicator é
   re-rodável contra o critério+resultado congelados e dá o mesmo veredito), não re-execução. Promover
   à reprodutibilidade-por-re-execução junto com o runner-de-código (OQ1).

4. **Validação da genericidade com `review` como 2ª instância.** O F0 §"Perguntas abertas" #3 sugere
   validar o contrato genérico com `review` (já LIVE) como 2ª instância, não com código.
   **Recomendação:** após esta promoção, `experiment` vira uma **3ª instância** útil para o
   skeptic-de-não-vacuidade da F1 construir à mão — alinhado, sem ação aqui.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `subagents-strategy-constitution-proposal.md` | `cites` | §5:175 nomeia os três portões e a definição reservada de experiment que esta discovery herda e estreita. |
| `research/subagents-strategy/2026-06-13-rigor-dial-proposal/findings.md` | `derives-from` | A disciplina anti-vacuidade (delta observável; critério-como-artefato, não coluna) que governa cada decisão vem deste findings. |
| `research/subagents-strategy/2026-06-13-generic-stage-contract-plan/F0-prove-of-instance.md` | `cites` | Corrobora peer-vs-sub-mode (evidence-harness sibling) e recebe o verdict de experiment como input da F1. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/discovery.md` | `cites` | Contratos de I/O por role e a disciplina de close P9 que o type skill de experiment reusa. |
| `.claude/skills/experiment/SKILL.md` | `operationalized-by` | O type skill que executará o julgamento falsificacionista decidido aqui (a criar; edge forward-only por ser skill). |
