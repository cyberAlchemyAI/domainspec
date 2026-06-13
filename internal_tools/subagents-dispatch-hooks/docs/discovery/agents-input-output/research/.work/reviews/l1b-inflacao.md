---
tags: [agents, dispatch, research, io-contracts, p10, review, skeptic]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l1b
---

# L1b — Review de inflação (gate P10: claim ≤ proof) — draft-v1.md

Dispatch: 2026-06-12-agent-io-contracts. Artefato: `.work/drafts/draft-v1.md`. Fonte de prova: `research.md` (E1/E2/E3, round 1). Método: cada afirmação do draft foi conferida contra o texto literal do return citado; o item registra a frase inflada, o que a evidência realmente sustenta, e a versão demovida.

## Itens

**I1 — "custo observado zero" (§2 linha do ID de claim; repetido em §3 colisão 2: "com custo observado zero").**
Por que infla: nenhum dos três returns mediu ou observou custo. E1 evidência 1 sustenta apenas que os namespaces *emergiram duas vezes sem serem exigidos* — emergência espontânea é evidência de custo baixo *percebido pelo emissor*, não de custo zero observado. "Observado" reivindica uma medição que não existe no corpus; e é justamente o custo que E3 R1 contesta ("custo sem regra que a exija"), então a frase resolve um dissenso real por adjetivo, não por prova.
Demoção: "emergiu duas vezes sem ser exigido (E1 ev. 1) — nenhum custo foi registrado, mas custo também não foi medido; a emergência espontânea é o único sinal de custo baixo".

**I2 — "Dissent foi o que a condensação comeu" (§2 linha verbatim/condensação) e, derivado dela, "tudo que quebrou na prática foi persistência seletiva, não falta de estrutura" (§3 abertura).**
Por que infla: E1 evidência 4 é explicitamente disjuntiva: "**Ou nunca foram escritas, ou** a condensação as comeu". O draft assevera o segundo ramo como fato. Pior: se o ramo verdadeiro for o primeiro (nunca escritas), a quebra do Dissent é falha de *emissão* — falta de estrutura no output do explorer — o que falsificaria diretamente o "tudo que quebrou foi persistência" da síntese. A frase de §3 transforma uma disjunção não resolvida no pilar de uma generalização "tudo".
Demoção: "as linhas Dissent estão ausentes dos dois registros; E1 não consegue distinguir se nunca foram emitidas ou se a condensação as comeu (E1 ev. 4). As demais quebras documentadas (camada F, reviewers no transcript) são de persistência (E1 ev. 2); a quebra do Dissent pode ser de emissão — o contrato deve cobrir os dois ramos."

**I3 — "GO (unânime, o mais forte)" na linha `Dissent:` (§2).**
Por que infla: "unânime" exige que os três returns o digam. E1 ev. 4 o sustenta; E3 R5 o sustenta; **E2 é silente** — o return precedente-externo não menciona linha de dissent em nenhum dos seis frameworks nem na seção de candidato a adoção. Dois a favor + um silente = convergente, não unânime. Contraste com a linha "schema JSON do corpo", onde o "unânime" é legítimo (E1 Dissent, E2 Dissent e E3 evidência (a) falam todos, explicitamente). Usar a mesma palavra para os dois casos apaga a diferença de força que P10 existe para preservar.
Demoção: "GO (convergente — E1 e E3 explícitos; E2 não opina; sem voz contrária)".

**I4 — "toda citação contra return persistido resolveu (E1 evidência 1)" (§3 colisão 1).**
Por que infla: E1 testou o censo da seção A do primeiro findings e uma *amostra* do segundo ("amostrei C1, C2, M1–M6, m1, m9"). "Toda citação resolveu" generaliza de censo-parcial+amostra para o universo. A direção da evidência é boa; a quantificação universal não foi comprada.
Demoção: "todas as citações testadas por E1 resolveram (censo da seção A do self-improvement; amostra de 9 itens do v051 — E1 ev. 1); nenhuma citação contra return persistido falhou na verificação".

**I5 — "a própria leitura de E3 da evidência Tam et al. classifica numeração de findings como zona segura" (§3 colisão 2).**
Por que infla: é a inflação mais grave do draft, porque é load-bearing — a colisão 2 é resolvida CONTRA E3 alegando que E3 já concedeu o ponto. E3 não concedeu: a "Leitura para o contrato" de E3 lista como envelope barato "cabeçalho de proveniência R1/R2, linha Dissent: R5, matriz de verdicts R7 — que é pós-raciocínio" — **numeração de findings/IDs por claim não está na lista**, e E3 R1 nega explicitamente: "Não forçado: IDs numéricos por parágrafo ... custo sem regra que a exija". O argumento de que IDs são pós-raciocínio/envelope é defensável — mas é inferência DO DRAFT, e atribuí-la a E3 fabrica uma concessão para vencer um dissenso usando "o critério do próprio E3".
Demoção: "classifico (inferência da síntese, não concessão de E3) IDs de claim como envelope pós-raciocínio, na mesma família que a matriz de verdicts que a leitura de E3 da Tam et al. já classifica como barata; E3 R1 discorda dessa classificação e isso permanece como o dissenso que a colisão 2 resolve contra ele."

**I6 — Linha "Envelope tipado", coluna witnessed: "Sim — §7 da constituição: campo estruturado que nenhum check consome vira vácuo e é cortado" (§2).**
Por que infla: a coluna pergunta "ausência quebrou?". A evidência citada (E3 §Evidência interna) testemunha o OPOSTO de uma quebra por ausência de envelope — testemunha campos estruturados *morrendo por excesso*. Não há, em nenhum return, caso interno em que a ausência de envelope tipado tenha quebrado algo (os headers sempre estiveram presentes onde foram tentados, E1 ev. 5). O "Sim" da coluna está sustentado por evidência que prova outra proposição.
Demoção: witnessed = "Derivado — não há testemunha interna de ausência de envelope quebrando; a evidência de §7 delimita o envelope (só sobrevive campo consumido por check), não o testemunha".

**I7 — Linha "Pares posição-inicial/final", coluna witnessed: "Sim — deviation 'zig-zag absorvido pelo parent' no v051 (E1 evidência 2)" (§2).**
Por que infla: a deviation citada testemunha um *turno de return da synthesizer absorvido pelo parent* — quebra do edge synthesizer↔reviewer, não ausência de pares posição-inicial/final de reviewer. Nenhum return relata um caso em que a falta dos dois snapshots de posição tenha tornado colapso prematuro indetectável na prática. O elemento é forçado por P14 (E3 R6) — o "owned" basta para o GO; o witnessed está emprestando uma quebra vizinha.
Demoção: witnessed = "Adjacente — a quebra registrada (turno absorvido, E1 ev. 2) mostra o canal degradando, mas a ausência dos pares em si não foi testemunhada; GO sustenta-se no forçamento por P14, não em quebra observada".

**I8 — Linha "Tier de verificação por claim", coluna sound: "Consumido pela aceitação do approver (que precisa saber que autoridade cada citação carrega)" (§2).**
Por que infla: nenhuma checagem nomeada na constituição ou no SKILL lê um campo de tier — P12/R7 mandam o approver checar que a citação *resolve*, não que autoridade carrega. "Precisa saber" é plausível, mas é exatamente o tipo de plausibilidade que o critério R5 (que o draft adota como lei nas linhas vizinhas) existe para barrar: campo sem checagem nomeada que o consuma é candidato a vácuo (§7). O draft aplica R5 a favor dos IDs e o suspende para o tier.
Demoção: "GO condicional — invenção nossa, declarada (correto no draft); hoje nenhuma checagem nomeada o consome; entra acoplado a um item novo do checklist do approver ('aceitar claim not-re-reviewed exige declaração explícita'), senão é o próximo success_metric".

**I9 — "sobreviveu à condensação quando quase nada mais sobreviveu (E1 evidência 3)" (§2, linha âncora de evidência).**
Por que infla: E1 ev. 3 lista TRÊS categorias sobreviventes — IDs, severidades e âncoras — e UMA perdida (Dissent). "Quase nada mais sobreviveu" inverte a proporção real para engrandecer a âncora. A âncora não precisa do retoque: a refutação de F21 por "README line 22" (ev. 6) já é a prova forte.
Demoção: "sobreviveu à condensação junto com IDs e severidades; a única perda registrada foi a linha Dissent (E1 ev. 3)".

**I10 — "as duas quebras reais passaram sem detecção porque nenhum check rodou no close (E1 evidência 2)" (§2, linha passo de checagem).**
Por que infla: E1 ev. 2 documenta que as quebras passaram sem detecção; o "porque" é atribuição causal contrafactual ("um check no close as teria pegado") — que é a *previsão* do Dissent de E1, não observação. A causa observável alternativa (ninguém releu o working_folder, o approver não existia nesses dispatches, etc.) não foi excluída por nenhum return.
Demoção: "as duas quebras reais passaram sem detecção, e nenhum check de citação rodou no close (E1 ev. 2); o Dissent de E1 prevê que um checklist de 5 itens as pegaria" — conjunção + previsão atribuída, não causação provada.

**I11 — §4, edge explorer→research.md, invariantes: "checklist de envelope na coleta ... → falha = re-ask ao agente, nunca conserto silencioso pelo parent".**
Por que infla: força assimétrica entre seções. O §2 marcou a validação de envelope na coleta como **OPEN** ("script executável sem testemunha") e o §3 colisão 3 a deixou explicitamente aberta com "default operacional enquanto aberto: checklist". A tabela de edges enuncia o checklist + regra de re-ask como invariante plano, sem a marca OPEN — um leitor que só consome §4 (o destino provável da tabela) recebe como contrato fechado o que a própria síntese declarou não-resolvido. Além disso "nunca conserto silencioso pelo parent" prescreve contra a prática observada (o parent normalizou nos dois dispatches, E1 §Input) sem testemunha de que re-ask funcione melhor — prescrição legítima, mas deve ser rotulada como decisão de design, não como invariante provado.
Demoção: na célula, "checklist de envelope na coleta (default operacional — forma OPEN, §3 colisão 3); falha → re-ask ao agente [decisão de design: o conserto silencioso pelo parent é o canal de condensação que E1 ev. 3 mostra degradar]".

**I12 — §2, linha header de fronteira, witnessed: "quebrou exatamente onde a fronteira sumiu".**
Por que infla (menor): a quebra-por-ausência tem UMA instância (reviewers fundidos no primeiro dispatch, E1 ev. 5). "Exatamente onde" sugere um padrão verificado em múltiplos pontos; o que existe é presença-funcionou (n=2 dispatches) + ausência-quebrou (n=1 caso). A direção está certa; a retórica de lei geral não.
Demoção: "funcionou nos dois dispatches; a única ausência registrada (reviewers fundidos num parágrafo) coincide com a única quebra de fronteira (E1 ev. 5)".

## Saldo

12 itens. Nenhum derruba um verdict GO→KILL; o padrão dominante é (a) advérbios de medição sem medição ("observado", "unânime", "toda", "exatamente"), (b) ramo de disjunção assertado como fato (I2), (c) evidência vizinha emprestada para preencher a coluna witnessed (I6, I7), e (d) uma concessão fabricada para vencer dissenso (I5 — a mais grave). As demoções propostas preservam todos os verdicts, exceto I8 (tier), que de GO pleno deveria descer a GO condicional pelo critério R5 que o próprio draft adota.

Dissent: prevejo discordar de L1a (citação) nas linhas I5, I6 e I7 — as âncoras citadas EXISTEM e resolvem no research.md, então um gate de resolução-de-citação as aprova; meu gate é que o texto resolvido não sustenta a força reivindicada (resolver ≠ sustentar), e prevejo que L1a as marque verdes; e de L1c (coerência) em I3 e I11 — L1c tende a ler "unânime" como estilo consistente da matriz e a tabela §4 como sumário legitimamente mais assertivo que o corpo, enquanto eu sustento que a assimetria de força entre §2-OPEN e §4-invariante é exatamente o tipo de degradação por condensação que o próprio draft proíbe.
