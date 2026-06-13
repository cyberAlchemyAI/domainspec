---
tags: [agents, dispatch, review, zero-decisao, system-view]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-system-view
role: l1b-decisao
---

# Review l1b — zero-decisão

Artefato: `system-view.md` (v0.1.0). Fontes de verificação: `discovery.md` v1.0.0, `research/findings.md` (§2 matriz, §3 arbitragens, §4 contratos por edge). Gate único: a view NOMEIA stances, DECIDE NENHUMA — caço frases que decidem, recomendam sem row dona, resolvem framing no corpo, ou tratam emenda pendente como aplicada. Re-narração de decisão já tomada, com fonte citada, é legítima; decidir de novo ou decidir além é violação.

Veredito geral: a view é estruturalmente disciplinada — o mapa de 13 stances com handles PROVISIONAL, a Camada 4 e o "What this view does not cover" são exemplares. As violações encontradas são de localidade de narração: as duas graves (I1, I2) são re-narrações do texto canônico do findings §4 que **removem o marcador condicional que o próprio texto canônico carrega inline** — exatamente a classe "emenda pendente tratada como aplicada" — e contradizem a regra que a própria Camada 4 declara absoluta ("GO-condicional nunca é apresentado como adquirido"). Itens em ordem de gravidade.

## Itens

### I1 — Emenda pendente como aplicada: a rota F* narrada como garantia adquirida (Camada 2)

- **Frase:** "o edge 4 garante que a camada de síntese *também é prova citável* — fechando o buraco F11" (parágrafo "O que esse shape compra"); e o bullet do edge 4, que apresenta "o draft do synthesizer persistido com IDs próprios (`F*`) como seção append-only ANTES da revisão" sem marcador de status.
- **Por que é decisão:** a citabilidade de `F*` é **GO-condicional** — pende a emenda 1 de P9; sob a letra vigente, citar `F*` **falha o item (i) do próprio checklist** (discovery §4.5; findings §2 #12). O texto canônico que a view diz re-narrar ("texto canônico: findings §4") carrega o marcador INLINE no edge 4: "**Status: GO-condicional — pende emenda de uma linha em P9 (§5.1); até lá, deviation declarada por dispatch.**" A re-narração da view remove o marcador e afirma "garante... é prova citável" em presente do indicativo — apresenta a emenda pendente como aplicada, violando a regra que a própria Camada 4 enuncia ("GO-condicional nunca é apresentado como adquirido antes da emenda"). Que a Camada 4 e a stance table corrijam três seções depois não desfaz a decisão tomada na narração do shape — é a frase da Camada 2 que será citada.
- **Reescrita apontadora:** "o edge 4 destina a camada de síntese a também ser prova citável — fechando o buraco F11 — **rota GO-condicional: pende uma linha em P9 (emenda 1); até lá, deviation declarada por dispatch** (findings §4 edge 4; row dona: `stance:draft-citavel-do-synthesizer`)"; e no bullet do edge 4, acrescentar o mesmo marcador de status.

### I2 — Emenda pendente como aplicada: rota de condensação narrada como norma vigente (Camada 3)

- **Frase:** "**Em trânsito — condensação só pelo emissor.** Se token_budget forçar condensação, ela é executada somente pelo agente emissor (nunca pelo parent...), carimbada sob o header, com lista fixa de invariantes preservados (IDs, âncoras, `Dissent:`, posições)."
- **Por que é decisão:** a rota de condensação carimbada é a **metade GO-condicional** do #11 — pende a emenda 2 ao skill (discovery §4.7, §6 dependências item 2). O texto canônico carrega o marcador inline: "**Condensação (só se token_budget forçar; emenda pendente — §5.2)**" (findings §4 edge 2). A view a narra como mecânica operante da economia de verificação, sem condicional — segunda instância da mesma classe de I1. (A alternativa coerente registrada — manter proibição + re-ask com budget revisado — existe na tabela de framings da Camada 3 via `stance:condensacao-carimbada`, mas o corpo já operou a rota como decidida.)
- **Reescrita apontadora:** "**Em trânsito — condensação só pelo emissor (rota GO-condicional; emenda 2 ao skill pendente — deviation até lá; row dona: `stance:condensacao-carimbada`).** Se token_budget forçar condensação, a rota decidida pelo dispatch é: somente pelo emissor, carimbada sob o header, com lista fixa de invariantes (findings §4 edge 2/A7)."

### I3 — Framing resolvido no corpo com argumento próprio sem fonte (Camada 1, tabela, row 3)

- **Frase:** "Parcialmente absorvida — o checklist do close existe no shape (Camada 3) — mas sozinha não cobre condensação em trânsito nem dissenso não emitido: **o check do close lê sinais que só existem se o contrato de emissão os garantir**."
- **Por que é decisão:** a cláusula final é um argumento de mérito que resolve o Dissent de E1 ("um checklist de 5 itens no close pegaria as quebras") dentro da célula — e não tem fonte: não há linha do findings nem da discovery que formule esse raciocínio (verifiquei; o findings adota checklist E contratos de emissão, mas a *razão* da insuficiência do checklist sozinho não está veredidata em lugar citável). A view inventou a arbitragem que dispõe do framing, em vez de citar a convergência decidida ou apontar a resolução para as rows donas.
- **Reescrita apontadora:** "Parcialmente absorvida — o checklist do close existe no shape (Camada 3; findings §3 arbitragem 3) — mas a convergência decidida adotou checklist E contratos de emissão juntos (findings §3, primeira linha); o peso relativo das duas metades é tensão das rows `stance:checklist-do-approver` e `stance:mecanizacao-da-validacao`, não desta célula."

### I4 — Recomendação revisável apresentada como não-adoção resolvida, sem row dona (Camada 2, tabela, row 5)

- **Frase:** "Sem checagem nomeada que a consuma; a função de prova já é coberta pelas âncoras por claim-ID. O destino formal pertence à spec — apontado, não decidido aqui." (Lista de fontes com URL no header, peça #1 de E2.)
- **Por que é decisão:** a discovery §5 item 9 classifica este elemento como **lacuna sem veredito** ("o findings não veredita"; "Registro desta discovery, não veredito... recomendação: não adotar — **mas a decisão pertence à spec**, que deve vereditá-la explicitamente"). A célula da view apresenta o racional da recomendação revisável ("sem checagem que a consuma"; "função já coberta") como razão assentada de não-adoção — e este é o único item dispensado em tabela de framing que não tem handle algum: nem stance no mapa, nem OQ. O hedge final aponta para "a spec", não para uma row — sob a regra da própria view ("cada stance aponta para exatamente uma futura row"), uma dispensa load-bearing sem dono nomeável é resolução órfã.
- **Reescrita apontadora:** "Elemento que o findings **não veredita** (evaporou entre research e matriz — lacuna S3); a discovery §5 item 9 registra recomendação revisável de não-adoção (sem checagem nomeada consumidora; prova já coberta pelas âncoras). Nem adotado nem rejeitado por esta view — veredito explícito pertence à spec (discovery §5 item 9)." — e registrar o handle (stance ou OQ próprio) para a dispensa não ficar sem dono.

### I5 — Prescrição própria sobre o conteúdo de rows alheias (OQ-SV-3)

- **Frase:** "a row correspondente **deve registrar o dono externo em vez de fingir propriedade**."
- **Por que é decisão:** "deve" dirigido ao autor do engineer-view, ditando como redigir as rows — instrução nova desta view (o findings §6.1 nomeia os donos externos; não prescreve a forma de registro nas rows de um documento que não existe). Decidir a forma de registro é decidir além.
- **Reescrita apontadora:** "os donos externos estão nomeados no findings §6 (e.g. o dono do corte do validator v0.3.0); como a row registra essa propriedade externa é decisão de redação do autor do engineer-view — esta view apenas constata que o fechamento desses OPENs não depende desta cadeia de views."

### I6 — Recomendação de processo emitida pela própria view (OQ-SV-1)

- **Frase:** "Recomendação: autorar o engineer-view a partir desta view + discovery §4/§7, registrando o mapa verdict→status como row própria (conforme `stance:mapa-verdict-status`)."
- **Por que é decisão:** a metade final re-narra a discovery §7 ("a validar pelo autor do engineer-view — que registra o mapa adotado como row própria") — legítima; mas "autorar a partir desta view + discovery §4/§7" é recomendação de processo originada aqui, sem fonte e sem row dona. A view que se declara "nomeia, não decide" não emite recomendações próprias nem em OQ.
- **Reescrita apontadora:** "Dono: autor do engineer-view deste folder. Insumos disponíveis: esta view + discovery §4/§7. O registro do mapa verdict→status como row própria é o que a discovery §7 já propõe (`stance:mapa-verdict-status`)."

### I7 — Cláusula argumentativa própria fechando a família message-schema (Camada 2, tabela, row 1)

- **Frase:** "— e a quebra interna observada foi exatamente de persistência, que **schema em memória não resolve**."
- **Por que é decisão:** a primeira metade da célula re-narra E2 com fonte (convergência das famílias — research.md §E2); a cláusula final é silogismo próprio da view ligando E1 à dispensa da família — derivável, mas não citado, e é a cláusula que efetivamente *fecha* o framing na célula. Menor: a substância está decidida na convergência do findings §3; falta só apontar.
- **Reescrita apontadora:** "...e a quebra interna observada foi de persistência (E1; diagnóstico: research.md §E1 Dissent) — a convergência decidida adotou a família artifact-as-contract (findings §3, primeira linha; formalização na row `stance:envelope-sobre-corpo-livre`)."

## Contagem

7 itens. Graves: I1 e I2 (emenda pendente narrada como aplicada — o texto canônico do findings §4 carrega o marcador condicional inline e a re-narração da view o remove, violando a regra de honestidade que a própria Camada 4 declara absoluta). Médios: I3, I4 (resolução de framing no corpo — argumento próprio sem fonte; dispensa sem row dona). Menores: I5, I6, I7. Intactos: o mapa de stances (13/13 com handle PROVISIONAL e tensão nomeada sem verdict), a Camada 4 inteira, o mapa verdict→status (corretamente marcado "proposto pela discovery §7... sua adoção é, ela mesma, uma row"), e o "does not cover".

Dissent: I1 e I2 são violações de localidade, não de omissão — a Camada 4 e a stance table carregam o status condicional corretamente, então um leitor do documento inteiro não é enganado; eu só bloquearia promoção por I1/I2 (cada um se conserta com uma cláusula), e trataria I3–I7 como edits de linha. Discordo de tratar as tabelas de framing como zona proibida de juízo: o skill as exige, e exigir citação para cada cláusula dispositiva pode empurrar as células para paráfrase vazia — o padrão certo é o das células boas da própria view (dispensa citada + row dona), não a remoção do raciocínio.
