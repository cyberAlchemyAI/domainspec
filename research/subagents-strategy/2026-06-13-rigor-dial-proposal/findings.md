---
tags: [subagents-strategy, dispatch, rigor, governance, research, synthesis]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: draft
version: 0.3.0
last_updated: 2026-06-13
created_by: victorboscaro@gmail.com
---

# findings.md — Rigor dial proposal (sintese adversarial)

## Contexto + Goal

Dispatch adversarial `2026-06-13-rigor-dial-proposal` sobre a constituicao de subagentes
v0.5.2: "rigor/exigencia do usuario" deve ser (C1) heuristica no confirm gate sem campo,
(C2) campo escalar unico, (C3) dois dials breadth+depth, ou (C4) nada novo. Tres explorers
(Wittgenstein/parsimonia, Ashby/variedade requisitada, Ellerman/decomposicao) abriram em
posicoes genuinamente opostas e foram confrontados em robot_talks. Este findings sintetiza a
convergencia, nomeia a costura residual, e formula o entregavel que sobrevive aos dois skeptics
(precedent-kill, non-vacuity).

> **v0.2.0 — round 2.** O round 1 sobreviveu nos KILLs (C2/C4) mas superestimou o que C1
> *adiciona*. Os dois reviewers verificaram contra a constituicao/ledger reais e estavam
> factualmente corretos em quatro pontos. A revisao concede esses pontos limpos (claim <= proof)
> e re-funde a recomendacao em torno do unico nugget nao-vacuo. Ver "## Revisao round 2".

> **v0.3.0 — round 4 (convergencia final).** O round 2 reduziu o entregavel a UMA regra
> negativa ("appender rejeita campo agregado de rigor") e a marcou nao-vacua/nao-colapsavel.
> Godel testemunhou na fonte que essa regra tambem e VACUA: o appender ja rejeita `rigor` HOJE
> pela clausula unknown-key (linhas 133-138, allowlist `DISPATCH_KEYS`). O parent confirmou.
> A contribuicao liquida de schema deste dispatch e ZERO. A unica questao viva e nao-vacua que
> sobra e a task-class key (sec.4.1), OPEN gated-em-demanda. Ver "## Revisao round 4".

## 1. Convergencia & deteccao de colapso

Os tres moveram (`Movi: SIM`), o que dispara a suspeita de colapso. **Veredito: tensionamento
legitimo, nao colapso.** Prova pelas posicoes iniciais: eram mutuamente refutadoras, nao
variacoes de enfase. Ashby-INICIAL exigia "parametro de rigor de primeira classe **necessario**"
(campo persistido); Ellerman-INICIAL chamava qualquer escalar de rigor de "**erro de categoria**";
Wittgenstein-INICIAL chamava o campo de "**superfluo**, arquitetura de ilusao". Necessario vs
erro-de-categoria vs superfluo nao sao compativeis — uma adesao custou a cada um uma tese inicial
nomeada:

- Ashby cedeu **a dimensionalidade-um** do seu proprio primitivo ("rigor escalar e erro de
  categoria... a intencao tem dimensionalidade dois", Ashby-final) — rendicao de substancia, nao
  tatica.
- Ellerman cedeu **a necessidade de campos novos** ("`n` ja e largura... adicionar breadth/depth
  seria glossario redundante", Ellerman-final) — seu argumento "real... precisava de uma
  restricao, nao de campos".
- Wittgenstein cedeu **a auditoria-zero sem ressalva** ("honesto != reproduzivel; heuristica sem
  registro no ledger e amnesia", Wittgenstein-final).

Cada cessao e contra o interesse inicial do agente e sustentada por testemunha concreta (a
auditoria juridica n=1/token-altissimo de Ellerman-T1 quebra "rigor=alto->n=3" para todos).
Convergencia forcada por evidencia, nao por deferencia social = legitima.

**Costura residual (NAO colapsou):** Ashby-final ainda quer uma **camada de persistencia/defaults
nova** — "dois campos opcionais (breadth, depth)" + "breadth_default/depth_default por
workspace/user config". Wittgenstein-final e Ellerman-final negam: "`n` ja e breadth,
`token_budget`+`model` ja e depth — nomear meta-dials por cima adiciona indirecao"
(Wittgenstein-final); o campo auditavel extra e redundante porque "o ledger registra os valores
confirmados" (Wittgenstein-final). Esta e a fenda viva que os reviewers devem atacar — e, apos o
round 2, a UNICA fenda viva (ver sec.4).

## Revisao round 2 (resposta ao zig-zag)

Os dois reviewers (Tarski/precedent-kill, Godel/non-vacuity) atacaram verificando contra a
constituicao e o LEDGER-MODEL reais. Verifiquei cada ataque contra as mesmas fontes antes de
ceder. Resultado: **quatro concessoes limpas, tres defesas mantidas com citacao.**

### CONCEDIDO (claim <= proof; verificado contra a fonte real)

**(a) `dispatch_kind` esta MORTO na v0.5.2 — so sobrevive em SKILL.md legado.**
Verificado: constituicao par.7 (tabela "Removed"), linha verbatim: "`dispatch_kind` — One
canonical registry path; nothing to route. The *meta* concept survives as the `meta` boolean."
O round 1 (matriz, perna C4-KILL e sec.3 "por que sobrevive ao precedent-kill") apoiou-se em
"presets ja donam o eixo grosso via `dispatch_kind`" e "dispatch_kind escala fan-out, nao depth"
— ambas citam mecanismo morto. Tarski tem razao nos dois sentidos: isso (i) AJUDA a sobrevivencia
de C1 por precedente (menos um dono existente do eixo grosso), e (ii) INVALIDA a perna do
C4-KILL que dizia "dispatch_kind escala fan-out mas nao profundidade". A perna sobrevivente do
C4-KILL e so a reprodutibilidade (ver matriz revisada). O `dispatch_kind` da posicao inicial de
Wittgenstein/Ashby era um artefato do SKILL.md v0.2.0 legado, nao da lei v0.5.2.

**(b) `pin-any-dial` NAO inclui `n` nem `token_budget` — o round 1 superestimou a cobertura do
eixo fino.** Verificado: constituicao par.2 (linha 40-42) e par.5 (linha 143-145) enumeram os
dials fixaveis pelo humano como EXATAMENTE `{max_loops, loop_cap (de uma connection), layers (de
um group)}`. `n` e `token_budget` NAO estao nessa lista de pin. Logo "override do operador e
sempre em `n` ou `token_budget` direto" (invariante do round 1, sec.3) e ele proprio um pedido
normativo novo — nao algo que par.5 ja conceda. Concedo: o operador hoje fixa o eixo de
*iteracao/estrutura* (loops/layers), nao os eixos de *rigor* (`n`/`token_budget`). Esses ultimos
sao preenchidos pelo strategist por julgamento e validados no gate (par.1 linha 35), nao
"pinados". A invariante reescrita (abaixo) nao mais afirma um pin que nao existe.

**(c) A "invariante nunca-persiste-escalar" e quase-vacua HOJE — e guarda-de-emenda-futura, nao
invariante presente.** Verificado: nao existe campo `rigor` no schema (par.5 nao o lista), e
par.7 mostra o schema sendo ATIVAMENTE encolhido. Proibir o que nao existe e ja-dono por
construcao. Tarski tem razao: tem dente so como guarda contra uma futura emenda C2. Rebaixo de
"invariante de design presente" para **design note / future-amendment guard** (ver sec.3).

**(d) A recomendacao do round 1 NAO adiciona mecanismo de elicitacao — o gate JA o possui por
par.1 linha 35.** Esta e a concessao central, e resolve o dissent Tarski-vs-Godel a favor de
Godel. Verbatim, par.1 linha 35: "The judgment dials — `model`, `token_budget`, each `angle` —
are not deterministic; they are validated by the human at the confirm gate." E par.5 (fill rules
de `token_budget`/`model`/`n`) ja obriga o strategist a setar esses eixos *por julgamento de
dificuldade/tarefa*. Logo a "heuristica de elicitacao que traduz intencao->eixos" que o round 1
vendia como o nugget nao-dono e **bom senso renomeado**: e exatamente o trabalho que par.1+par.5
ja definem para o strategist. A "funcao de elicitacao positiva" e VACUA.

A **testemunha de vacuidade de Godel** e decisiva e eu a aceito: operador diz "rigor alto" em T1
(contrato juridico); o strategist — ja obrigado por par.5 — propoe `n=1`/token alto; humano
confirma; ledger grava `n=1`/token alto. Agora ADICIONE a "heuristica que emite eixos separados":
mesmo operador, mesma T1 -> mesma proposta, mesma row. O output e **byte-identico** com e sem a
recomendacao. As linhas T1/T2 divergem porque as TAREFAS divergem e o strategist julga por-tarefa
(que par.5 ja manda), nao porque alguma heuristica foi adicionada. Logo a testemunha T1/T2 que o
round 1 usou para provar "C1 adiciona algo" prova na verdade **C2-KILL** (o escalar produz config
errada nas bordas) — nao prova nao-vacuidade de C1. Concedido.

**Resolucao do dissent Tarski-vs-Godel:** Tarski diz que o "meio" (traducao intencao->eixos) e o
gap nao-dono; Godel diz que par.1 linha 35 mostra que o gate JA possui esse meio. **Godel vence,
por citacao.** O par.1 linha 35 nomeia explicitamente `model`/`token_budget`/`angle` como dials
de julgamento validados no gate; nao ha funcao escrivel faltando — a elicitacao por julgamento
por-eixo *e* o trabalho definido do strategist. O "meio" de Tarski e o julgamento existente
relabeled, nao um construct ausente.

### DEFENDIDO (mantido com citacao — nao concedo por deferencia)

**(D1) C2-KILL sobrevive over-determined.** Falha por non-vacuity (testemunhas Ellerman-T1
`n=1`/token-alto vs T2 `n=20`/token-baixo: o escalar emitiria ~n=3/n=2, ambos errados) E por
definicao (erro de categoria que "migra para o gate, escondido nao eliminado",
Ellerman-inicial-3). Nenhum reviewer contestou; nenhuma fonte o refuta. Mantido **KILL**.

**(D2) C3-como-campos-novos = KILL.** `n` ja e breadth; `token_budget`+`model` ja e depth
(Ellerman-final, Wittgenstein-final). Campos `breadth`/`depth` seriam glossario redundante. Isto
fica ainda mais forte com a concessao (a)/(b): os eixos existem no schema; o que nao existe e o
*pin* deles pelo operador — mas a falta e de pin, nao de campo. Mantido **KILL como campos**;
o *principio* da decomposicao colapsa em C1.

**(D3) Convergencia legitima (nao colapso).** As cessoes sao contra-interesse e ancoradas em
testemunha (sec.1). Nenhum reviewer atacou isto. Mantido.

## Revisao round 4 (convergencia final)

Veredito conjunto dos reviewers: Tarski (precedent-kill) CONVERGIU — sem inconsistencias,
aprova. Godel (non-vacuity) achou UMA inconsistencia remanescente, verificada na fonte e
confirmada independentemente pelo parent. Eu a concedo integralmente — claim <= proof.

### CONCEDIDO — a "regra de appender" tambem e VACUA

**(e) O unknown-key rejection JA proibe `rigor` e qualquer escalar agregado HOJE.** Verificado
na fonte: `append-dispatch.cjs`, `validateDispatch` (linhas 133-138). O laco itera sobre
`Object.keys(rec)`; toda chave fora da allowlist `DISPATCH_KEYS` (e fora dos conjuntos especiais
REMOVED/LEGACY) cai na linha 137 — `unknown key "<k>" on a dispatch record` — e o appender sai
com codigo nao-zero. Testemunha de Godel, reproduzivel: uma row com `rigor:"high"` ja sai com
**exit 2 HOJE**, sem nenhuma mudanca de codigo. Logo a regra que o round 2 vendia como "a unica
novidade enforcavel" e marcou como nao-colapsavel e **byte-identica ao comportamento atual** — e
exatamente o mesmo erro de "comportamento renomeado" que o round 2 corretamente diagnosticou na
heuristica de elicitacao (concessao d), agora repetido na perna da PROIBICAO. **Contribuicao
liquida de schema deste dispatch = ZERO.** (Nota de fonte: `topic_slug` esta em
`LEGACY_LEDGER_KEYS`, linha 125 — morto no appender, e era 1:1 com `dispatch_id`, nunca uma
classe; nao serve de task-class key.)

### O entregavel final honesto

**Nada a adicionar — nem no schema, nem no appender.** O appender ja e a barreira contra uma
futura emenda C2: qualquer campo agregado proposto (incluindo `rigor`) e rejeitado por
construcao pela allowlist. No maximo, uma **NOTA documental OPCIONAL** registrando que
`rigor`/agregados caem sob a clausula unknown-key (lar candidato: LEDGER-MODEL, ou um comentario
proximo a `DISPATCH_KEYS`). Isso e documentacao do que ja e verdade, nao uma mudanca de
comportamento. Pode-se omitir sem perda de enforcement.

### A unica questao de design viva e nao-vacua

**Task-class key para default-por-replay** (a economia que Ashby queria; sec.4.1). Godel
verificou nao-vacua: sem um `task_class` enumerado (ou derivador deterministico `goal`->classe)
nao ha como agregar `n`/`token_budget` historico por classe — o LEDGER par.3/par.5 indexa so por
`dispatch_id`/`group_id`/`agent_id`, e `topic_slug` esta morto. A chave nao existe; o default
automatico e genuinamente impossivel hoje. **Status: OPEN, gated em demanda** — a regra "menor
escopo vence" favorece **lookup manual** ate haver evidencia de demanda real por default
automatico. E uma questao SEPARADA de rigor.

### Resposta final ao goal (1 linha)

A conclusao do owner (rigor como heuristica, SEM campo) estava CERTA, mas ambas as
justificativas — "a heuristica faz trabalho" e "a regra de appender proibe o campo" — sao
VACUAS: o estado atual (gate par.1 L35 + fill rules par.5 + unknown-key rejection L133-138) ja
implementa tudo; a unica coisa acionavel e a task-class key, e isso e uma questao separada de
rigor.

## 2. Matriz de veredito (revisada v0.3.0)

| Candidato | owned? / precedent | witnessed? / non-vacuity | sound? / definitional | verdict |
|---|---|---|---|---|
| **C1** heuristica sem campo | TODA dona: elicitacao -> gate par.1 linha 35; eixos -> par.5; proibicao de campo agregado -> appender ja rejeita por unknown-key (linhas 133-138, allowlist `DISPATCH_KEYS`). Nenhuma das tres pernas e nao-dona | VACUO inteiro: a perna positiva e byte-identica (testemunha Godel round 2); a perna-proibicao tambem e byte-identica — `rigor:"high"` ja sai com exit 2 HOJE, sem mudanca (testemunha Godel round 4, verificada na fonte) | o que sobra de C1 e "nao adicione campo de rigor" = concordancia com o estado atual; nao ha regra nova a escrever | **DISSOLVE** — concorda com o estado atual; ZERO a adicionar (no maximo nota documental opcional) |
| **C2** campo escalar unico | — | falha: Ellerman-T1 (`n=1`/token-alto) e T2 (`n=20`/token-baixo) sao testemunhas de config errada nas bordas | INSANO: erro de categoria que "migra para o gate, escondido nao eliminado" | **KILL** (over-determined) |
| **C3** dois dials breadth+depth | ja-dono: `n`=breadth, `token_budget`/`model`=depth JA existem -> campos novos = glossario redundante | vacuoso como campos novos: nenhuma testemunha em que `breadth` mude algo que `n` nao mude | a *decomposicao* e sa; os *campos novos* nao — colapsa em C1 | **KILL como campos; principio = C1** |
| **C4** nada novo | "nada novo de schema/elicitacao" e em grande parte CORRETO (concessao d): gate+par.5 ja fazem a elicitacao; `dispatch_kind` morto nao muda isso | re-fundido: a unica perna viva e **reprodutibilidade** — o ledger grava `n`/`token_budget` por agente, mas o "porque" task-class nao e indexavel (LEDGER par.3/par.5) | confronta par.4.1: o derivado JA e gravado, logo o gap NAO e de persistencia-do-valor; e de **default-por-replay** (chave de task-class ausente) | **KILL-parcial**: C4 acerta "nada de elicitacao nova"; erra ao negar o gap de *indexacao para default* |

## 3. A recomendacao que sobrevive (re-fundida)

> **SUPERSEDED por round 4 (v0.3.0).** A "regra de appender" descrita abaixo foi testemunhada
> VACUA: o unknown-key rejection (L133-138) ja proibe `rigor` hoje. O entregavel real e ZERO no
> schema/appender (no maximo nota documental opcional). Texto retido para o historico do
> zig-zag; ler com a "## Revisao round 4" como autoridade.

**Vence C1 estritamente na forma de PROIBICAO, nao de mecanismo.** As tres posicoes finais
convergem aqui (Ellerman-final explicito; Wittgenstein-final "exposicao dos parametros reais";
Ashby-final concede o schema, retem so a costura de persistencia/defaults). Mas — apos o round 2
— o *conteudo positivo* ("heuristica que elicita configuracao") dissolve: o gate ja faz isso por
par.1 linha 35 + par.5. O que resta nao-vacuo e UMA regra negativa.

**O entregavel nao-vacuo (a forma exata) — uma regra de appender:**

> O appender (`append-dispatch.cjs`) **rejeita qualquer campo `rigor` ou qualquer escalar
> agregado** numa row de dispatch ou de close. O strategist continua setando os eixos
> `{n, token_budget, model}` por julgamento e o humano os valida no gate (par.1 linha 35 — *isto
> ja e lei, nao se adiciona*); a unica novidade enforcavel e que NENHUM campo agregado de rigor e
> admissivel como coluna. O escalar "rigor" pode existir como artefato efemero de elicitacao na
> conversa do gate (Ashby-final: "artefato de elicitacao, nao primitivo armazenado"), mas nunca
> como campo, nunca como linha de ledger.

**Design note (NAO invariante presente — concessao c):** "o ledger nunca persiste um escalar de
rigor" e hoje quase-vacuo (nao existe campo `rigor`; o schema esta encolhendo, par.7). Seu valor
e como **guarda contra uma futura emenda C2**: se alguem propuser reintroduzir um campo escalar
de rigor, esta regra de appender e a barreira. Por isso ela mora no appender (executavel), nao
como prosa de "invariante" que nada proibiria hoje.

Por que sobrevive ao **precedent-kill** (Tarski): a regra nao reivindica donar a elicitacao (que
e do gate) nem os eixos (que sao do par.5). Reivindica donar so a *proibicao de coluna agregada*
— que NENHUM mecanismo atual ja faz (o appender valida campos existentes, nao proibe um campo
inexistente-mas-proponivel). `dispatch_kind` nao entra (morto). E uma regra de schema nova e
estreita, nao um re-dono.

Por que sobrevive ao **non-vacuity** (Godel): a testemunha nao-vacua nao e "config divergente"
(isso o par.5 ja produz) — e **a rejeicao**: submeta uma row com `rigor: high` ao appender; com
a regra -> exit nao-zero; sem a regra -> a row entra e corrompe o ledger com um agregado que
"nao governa o comportamento" (Ellerman-final). O delta observavel da regra E essa rejeicao.

## 4. As obrigacoes de um follow-up

### 4.1 A UNICA questao de design viva — task-class key para default-por-replay

Ashby-final quer **economia via defaults persistidos**: "default invisivel -> operador nao confia
-> sobrescreve -> economia se perde" (Ashby-inicial-D). O round 1 ofereceu "(a) o ledger atual
serve como fonte de default por replay/agregacao historica". **Godel mostrou que (a) NAO e
construtivel nas chaves atuais — e eu concedo.** Verificado no LEDGER-MODEL:

- par.3: a row e indexada por `dispatch_id` (texto `YYYY-MM-DD-<slug>`), `group_id`, `agent_id`.
  Nao ha **task-class key** machine-resolvable — o `goal`/`context` sao texto livre.
- par.5: a normalizacao L1/L2/L3 (rows planas joinadas por FK) e explicitamente "a design, not
  yet what the appender writes". Hoje e um documento aninhado.

Logo "ledger como fonte de default por replay/agregacao" e, hoje, no maximo **lookup manual** (um
humano le rows passadas e julga). Para virar **default automatico por task-class**, exige-se uma
**mudanca de indexacao nomeada**: adicionar uma chave de classe-de-tarefa resolvable por maquina
(ex.: um `task_class` enumerado na row, ou um derivador deterministico de `goal`->classe) sobre a
qual agregar `n`/`token_budget` historicos. **Esta e a economia que Ashby quer, e e a unica
questao de design que sobra viva** apos o round 2 — porque ela NAO esta ja-dona (a chave nao
existe) e NAO e vacua (habilita um default que hoje e impossivel computar).

Decisao do follow-up: (a) lookup manual e suficiente (sem mudanca), ou (b) introduzir a
task-class key (mudanca de indexacao na row + agregador). A regra "menor escopo vence" favorece
(a) ate haver evidencia de demanda real por default automatico.

### 4.2 Onde a proibicao mora

A regra negativa de sec.3 precisa de um lar. **Lar correto: o appender** (`append-dispatch.cjs`,
schema-validate-or-reject) — porque e executavel e a unica novidade e a rejeicao. Cross-reference
em par.5 como nota ("nenhum dial agregado de rigor e admissivel como campo") documenta a lei; o
*dente* esta no appender. Nao precisa de uma "obrigacao de output desagregado" no gate (round 1
sec.4.2 item ii) — isso era a parte vacua: o gate ja emite eixos por par.1 linha 35.

## 5. Linhas de colapso (inline, por keystone — revisadas)

- **Keystone "convergencia e legitima"** -> colapsa se: alguma cessao for deferencia social e nao
  forcada por testemunha (ex.: se Ellerman-T1 nao quebrasse "rigor=alto->n=3"). Nao colapsa: T1 e
  n=1 por holismo, irrefutavel.
- **Keystone "C2 KILL"** -> colapsa se existir tarefa onde breadth e depth nunca divirjam nas
  bordas. Ellerman-T1/T2 mostram que as tarefas que justificam fan-out vivem nas bordas onde
  divergem. (Over-determined: tambem cai por definicao.)
- **Keystone "entregavel = proibicao de appender" -> COLAPSOU (round 4, Godel-testemunha).** O
  round 2 escreveu que ele NAO colapsa porque "o appender valida campos presentes, nao proibe um
  agregado proponivel". Isto estava factualmente errado: a verificacao na fonte
  (`append-dispatch.cjs` linhas 133-138) mostra um laco `unknown key` que rejeita QUALQUER chave
  fora de `DISPATCH_KEYS` — um agregado proponivel como `rigor` ja sai com exit 2 hoje. Logo a
  ramificacao (i) ("o appender ja rejeitaria") ATIVOU: a regra e ja-dona, byte-identica ao
  comportamento atual. Com (i) e (ii) ambas ativas, o keystone cai inteiro — claim <= proof. Nao
  sobra nenhuma perna enforcavel; o entregavel e ZERO.
- **Keystone "gap real (nao C4)"** -> RE-FUNDIDO. Colapsa para a perna de *elicitacao* (concessao
  d: o gate ja elicia; nada novo ali). NAO colapsa para a perna de *default-por-replay*: a
  task-class key nao existe (LEDGER par.3/par.5), logo o default automatico que Ashby quer e
  genuinamente impossivel hoje. Esta e a fenda viva da sec.4.1.
- **Keystone "C1 nao e re-dono (precedent)"** -> COLAPSOU INTEIRO (round 4). O round 2 reteve
  "C1-como-proibicao-de-campo nao e re-dono: nenhum mecanismo atual proibe um agregado de rigor
  proponivel". A fonte refuta: o appender JA proibe (unknown-key, linhas 133-138 — concessao e).
  As tres pernas de C1 sao agora re-dono: elicitacao (par.1 L35), eixos (par.5), proibicao
  (appender L133-138). C1 e integralmente concordancia com o estado atual; nada acionavel sobra.
