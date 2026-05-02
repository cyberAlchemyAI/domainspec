---
tags: [creatives, sourcing, operations, capomastro, onboarding]
node_type: conceptual
is_session: false
scope: domain
representation_layer: L1-operational
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-04-22
---

# CapoMastro — O Sistema de Registro de Criativos

> Documento de contexto para quem ainda não convive com a operação de criativos do Insider. Começa no nível "nunca ouvi falar disso" e vai adensando. A meta é que, no fim, o leitor consiga ler uma conversa técnica sobre CM sem precisar perguntar o que cada coisa significa.

---

## Objective

Explicar, para quem tem pouco ou nenhum contexto, o que é o CapoMastro (CM), qual o problema que ele resolve, onde ele se encaixa no fluxo de marketing de performance do Insider, e quais características e pegadinhas operacionais ele tem. Responde: *"Eu nunca vi esse sistema. O que é, pra que serve, e por que ele existe desse jeito?"*

---

## Índice

1. [A cena](#a-cena)
2. [O mundo em que o CM vive](#o-mundo-em-que-o-cm-vive)
3. [O problema operacional que fez o CM existir](#o-problema-operacional-que-fez-o-cm-existir)
4. [O CM em uma frase](#o-cm-em-uma-frase)
5. [O ecossistema ao redor](#o-ecossistema-ao-redor)
6. [O que vive dentro de um card do CM](#o-que-vive-dentro-de-um-card-do-cm)
7. [O ciclo de um criativo, do ponto de vista do CM](#o-ciclo-de-um-criativo-do-ponto-de-vista-do-cm)
8. [Quem mexe no CM](#quem-mexe-no-cm)
9. [Pegadinhas que confundem quem chega agora](#pegadinhas-que-confundem-quem-chega-agora)
10. [O que o CM não é](#o-que-o-cm-nao-e)
11. [Conexões](#conexoes)

---

## A cena

Segunda-feira, começo da tarde. Uma editora acaba de exportar um vídeo novo de 22 segundos — uma leitura diferente de um criativo que performou bem em março. Ela abre o CapoMastro, cria um card, cola o link do arquivo no Google Drive, escolhe o produto ("Stirrup Legging"), escolhe o tema ("altura"), marca a campanha alvo ("FEM"), confere que o `ad_name` segue a convenção, e clica em salvar. Pronto. O trabalho dela, do ponto de vista do sistema, terminou. O criativo agora existe como um registro no CM, esperando um slot.

Em algum momento das próximas horas — pode ser três horas, pode ser três dias, depende de quanto espaço as campanhas tiverem — o Maestro, que é o sistema automatizado que fica lendo essa fila, vai pegar esse card, montar o anúncio no Meta, e empurrar pra dentro de uma campanha ativa. A partir daí o criativo começa a gastar dinheiro de verdade. É nesse momento, e não antes, que ele "nasce" pra efeito de métrica.

Essa pequena coreografia — registrar, esperar, subir, gastar — é a unidade básica do dia a dia de quem opera criativo aqui. O CM é o palco onde o primeiro ato acontece.

---

## O mundo em que o CM vive

Antes de falar do CM propriamente, vale um passo atrás, porque o sistema só faz sentido quando você entende o que é rodar mídia de performance em escala.

**Marketing de performance**, no formato em que a gente opera hoje, é um processo automatizado a ponto de ser guiado por objetivo: você declara pro algoritmo do Meta "quero maximizar ROAS" e deixa a plataforma achar quem comprar, quem mostrar, quando mostrar. Você não define persona, não define microtargeting, não escolhe horário. O algoritmo faz isso. O que **você** controla, no fim, é essencialmente uma coisa: **quais criativos você coloca na boca da máquina**. É o input que ainda não está automatizado.

Isso muda o desenho da operação inteira. Se o criativo é a alavanca principal, você precisa produzir muito, testar muito, descartar rápido, e manter o histórico limpo o suficiente pra aprender com ele. "Muito" aqui significa centenas de criativos ativos ao mesmo tempo, milhares por ano — e cada um desses precisa ter metadados confiáveis, senão o aprendizado fica contaminado: você não sabe mais por que um criativo ganhou, porque não sabe direito o que ele era.

É aí que o CM se encaixa. Ele é a camada que garante que, **antes de um criativo virar gasto**, alguém escreveu o que aquele criativo **é**.

---

## O problema operacional que fez o CM existir

Sem um sistema como o CM, uma operação de criativo em escala vira qualquer uma destas três bagunças — e, na prática, costuma virar todas:

1. **A bagunça de nomenclatura.** O editor sobe o vídeo direto no Meta com o nome que deu na cabeça. Dali a seis meses, quando alguém tenta responder "quais criativos de FEM com tema altura performaram?", a resposta depende de parsear string. Metade dos vídeos tem o padrão, metade não, e você descobre tarde demais que não dá pra cruzar com a base de embeddings porque os nomes são inconsistentes.

2. **A bagunça de origem.** Você olha pra um criativo de alto ROAS e não sabe se ele veio de produção interna, de um briefing especial pago a um influenciador, ou de um post orgânico capturado no Mighty Scout. Cada uma dessas origens tem custo, cadência e risco diferentes. Se você não sabe de onde veio, não tem como decidir onde dobrar a aposta.

3. **A bagunça de fila.** Sem uma fila explícita de "criativo aprovado, pronto pra subir", a decisão de quando subir vira tribal. Uns entram rápido porque o editor "avisou no Slack", outros ficam uma semana parados porque ninguém lembrou. Não tem como calcular backlog, não tem como priorizar.

O CM responde às três de uma vez. Ele obriga que o criativo tenha metadados estruturados no momento do registro (resolve #1), carrega o campo `source` que declara de onde o criativo veio (resolve #2), e é ele mesmo a fila que o Maestro consome (resolve #3).

Nenhuma dessas coisas é glamourosa. A virtude do CM é que, ao existir, ele torna invisível um monte de atrito que antes era o dia a dia.

---

## O CM em uma frase

**CapoMastro (CM) é a plataforma interna onde todo criativo que vai rodar em campanha é registrado, com seus metadados, e fica na fila até o Maestro colocá-lo no ar.**

Ele é sistema de **registro** e sistema de **fila**. Não é sistema de produção (o criativo já chega pronto), não é sistema de veiculação (quem veicula é o Meta/Google/TikTok), não é sistema de atribuição (quem atribui é o modelo de atribuição interno, que lê os dados de gasto depois que o criativo já rodou).

Essa fronteira é importante. O CM tem um escopo estreito de propósito, e parte da disciplina da operação é não deixar outras responsabilidades vazarem pra dentro dele.

---

## O ecossistema ao redor

O CM não opera sozinho. Ele está no meio de uma cadeia de quatro a cinco sistemas, dependendo da origem do criativo.

```
[produção]           → CapoMastro → Maestro → Meta/Google/TikTok → [gasto, conversão]
[briefing influ]     → CapoMastro → Maestro → Meta/Google/TikTok → [gasto, conversão]
[Mighty Scout] → [Creatives Please] → CapoMastro → Maestro → Meta/Google/TikTok → [gasto, conversão]
```

Resumindo os papéis:

- **Mighty Scout** — plataforma externa que captura posts de influenciadores. Só alimenta o fluxo de *Post Influ*.
- **Creatives Please** — ferramenta interna de **aprovação** dos posts vindos do Mighty Scout antes deles entrarem no CM. É um portão de qualidade.
- **CapoMastro** — onde o criativo passa a existir oficialmente pra operação. Metadados + fila.
- **Maestro** — automação que executa o rollout (subida) e a remoção dos criativos nas redes. Ele lê a fila do CM e monta o anúncio no Meta, Google etc.
- **Rede (Meta, Google, TikTok, Criteo, Bing, Pinterest)** — onde o dinheiro de fato é gasto. Meta concentra >70% do gasto.

O CM fica numa posição confortável: ele é o último ponto em que a operação **humana** toca o criativo antes da máquina assumir. Depois dele, é tudo algoritmo — Maestro decide quando subir, Meta decide pra quem mostrar.

---

## O que vive dentro de um card do CM

Um card no CM é um conjunto de campos. Os principais, do ponto de vista da operação e das métricas que vão ser puxadas depois:

| Campo | O que é | Por que importa |
|---|---|---|
| `ad_name` | Nome canônico do anúncio, seguindo convenção | É o que aparece no data warehouse. Convenções como `_hook1`, `_hook2` moram aqui. |
| `produto` | SKU ou família de produto (ex: Stirrup Legging) | Liga o criativo a performance por produto |
| `tema` | Eixo conceitual (ex: altura, conforto, preço) | Principal bucket analítico fora de produto |
| `campanha` / audiência | FEM, MASC, PROMO (ou TESTES) | Onde o criativo vai parar |
| `source` | Produção Interna, Briefing Especial, Post Influ | Declara origem — base pra analisar custo por origem |
| `link` (e variantes por aspect ratio: `link_1x1`, `link_9x16`, `link_5x4`) | Ponteiro pro arquivo de mídia no Drive | Onde os bytes realmente moram |
| `asset_type` | Imagem, vídeo, carrossel | Segmentação básica de formato |
| `is_trama` | Marca se o criativo veio do pipeline generativo TRAMA | Isola criativos gerados do resto |
| `parent_creative` | Se é derivado de outro, aponta pro pai | Base pra rastrear lineage (re-hooks, iterações) |

Esses campos são os que o conhecimento do domínio (o `domain_knowledge/` desse repositório) reconhece como canônicos. Podem existir outros campos no CM real; os listados aqui são os que a epistemologia da operação depende.

Dois pontos sobre a natureza desses metadados:

- Eles são **declarativos, não derivados**. Quem cria o card escreve `tema: altura` porque olhou o vídeo e decidiu que é sobre altura. Isso é bom (o contexto humano chega cedo no pipeline) e é ruim (o campo é tão confiável quanto a disciplina de quem preenche).
- Eles são **o contrato com tudo que vem depois**. Dashboards, modelo de atribuição, embeddings, análises de winner — todo mundo assume que o que está no CM é verdade. Se um tema é registrado errado, erra do CM até o final do pipeline.

---

## O ciclo de um criativo, do ponto de vista do CM

Do nascimento à morte, um criativo, visto pelo CM:

1. **Registro.** Card criado, metadados preenchidos, link colado. Momento em que o criativo passa a existir pra operação.
2. **Fila.** Card fica esperando slot na campanha apropriada. Pode esperar horas ou dias. Não tem SLA formal — depende de quanto gasto a campanha comporta.
3. **Rollout.** Maestro pega o card, materializa o anúncio na rede, dispara gasto. A partir daqui o criativo "nasceu" do ponto de vista de métrica.
4. **Avaliação.** Durante a janela de avaliação (hoje ~10 dias), o criativo acumula gasto e performance. A regra de remoção decide se ele continua.
5. **Remoção / Morte.** Se cair no critério de remoção (performance abaixo do share de gasto esperado), o Maestro tira da campanha. O card no CM continua existindo como registro histórico, mas o criativo em si não volta a rodar — é "morte".

Um detalhe importante, que confunde quem chega: **o CM guarda o momento do registro, mas o relógio da operação começa no rollout, não no registro**. Um criativo registrado dia 10 e subido dia 14 tem quatro dias de "fila" que não contam como idade do criativo em nenhum dashboard. A idade só começa a contar quando o primeiro real é gasto.

---

## Quem mexe no CM

Três tipos de ator, com papéis bem separados:

1. **Operador humano (produção, influs, media buyer).** Cria os cards, preenche metadados, corrige quando algo está errado. É quem olha pro vídeo e decide se é "altura" ou "conforto".
2. **Creatives Please (sistema automatizado).** No fluxo de Post Influ, cria cards no CM sem intervenção humana, com base no que foi aprovado no Mighty Scout. É o único ator que cria cards programaticamente hoje.
3. **Maestro (sistema automatizado).** Não cria cards, mas consome a fila. É o leitor principal do CM em produção. Quando ele sobe um criativo, escreve de volta no CM o status de "rodando", e depois "removido".

Essa separação de papéis é parte do que torna o CM usável. O operador humano não precisa saber nada sobre API do Meta; o Maestro não precisa saber o que significa `tema: altura`. Cada um só mexe no que é responsabilidade sua.

---

## Pegadinhas que confundem quem chega agora

Quatro coisas que parecem contradição até você entender o desenho. Tem muito detalhe aqui de propósito — são exatamente os pontos onde a intuição traiçoeira aparece.

### 1. Data de registro ≠ Rollout Date

Essa é a mais importante, e a que mais enrola iniciante.

A **Rollout Date** de um criativo — data usada em toda métrica baseada em idade (`ad_age`, janela de avaliação, baseline temporal d0) — **não é** a data em que o card foi criado no CM. É a data em que o criativo teve seu primeiro real de gasto. Derivada direto do data warehouse: `MIN(date) WHERE spend > 0`.

Motivo: o tempo que o criativo passa na fila do CM não é tempo de vida do criativo. Ele ainda não existiu pro algoritmo, pro mercado, pro consumidor. Começar o relógio no registro contaminaria todas as comparações de velocidade ("quanto tempo leva pra um criativo virar winner?") com atraso de fila — que é ruído operacional, não sinal do criativo.

Consequência prática: dois criativos registrados no mesmo dia podem ter idades totalmente diferentes se um subiu rápido e o outro ficou uma semana parado.

### 2. `capomastro_labels.csv` — o CM como data product

O CM não é só operacional. Ele também é um **data product**: um CSV (`data/capomastro-labels/capomastro_labels.csv`) que exporta os cards com os comentários dos editores — instruções como "trocar o hook", "cortar os primeiros 3 segundos", "refazer a abertura". Hoje, o tipo de comentário mais comum nesse arquivo é instrução de re-edição, o que em si já é um dado: os editores estão essencialmente mandando mensagens pro futuro pelo sistema.

Esse arquivo alimenta análises sobre o que os editores estão vendo e o que pedem pra arrumar — um sinal indireto de onde a produção sabe que tem atrito.

### 3. Hook não é schema — é convenção de nome

O CM **não** tem um campo chamado `hook`. Mas a operação trata variações de hook como unidade fundamental de teste: dois criativos com mesmo corpo e mesmo CTA, mudando só a abertura (o "gancho"), são comparáveis pra isolar o efeito do hook.

Como essa ideia vive no CM hoje? Por convenção de `ad_name`. Exemplos reais:

```
m-aq-cap-mt_altura_techtshirt_insiders_hook1
m-aq-cap-mt_altura_techtshirt_insiders_hook2
```

São dois criativos irmãos. Mesmo base material, hooks diferentes. A relação entre eles é inferível **só parseando a string** do nome — não existe campo `parent_hook_id`. Isso já causou estrago: performance entre hooks irmãos pode divergir brutalmente (um com ROAS 0.05 e o outro em outra faixa), e se você não souber que são irmãos, a análise perde o ponto.

Existe backlog pra promover isso a schema de primeira classe (chave de irmão de hook, enum de tipo de hook, sub-atributos). Por ora, é convenção de nomenclatura — e quem opera precisa saber disso pra não tratar como coincidência o que é teste pareado.

### 4. "Re-hook" não é criativo novo — é instrução

Termo correlato e fácil de confundir: **Re-hook** aparece nos comentários do `capomastro_labels.csv` ("Re-hook: motivo porque não vale a pena no final"). Isso **não é** a criação de um criativo novo. É uma instrução in-place pro editor trocar o hook do criativo existente. O criativo continua sendo o mesmo, do ponto de vista do CM — só a mídia subjacente muda.

Isso é diferente de **Hook Variant** (item 3), que é a criação explícita de um sibling com `_hookN` no nome, pra rodar em paralelo ao original. Re-hook é edição; Hook Variant é bifurcação.

---

## O que o CM não é

Listando o que está fora do escopo, porque a confusão sobre o escopo é fonte comum de ideia mal-dirigida:

- **Não é gerador de criativos.** O criativo chega pronto. O CM só cataloga.
- **Não é atribuidor de resultado.** Atribuição é feita pelo modelo interno (Attribution Model Interno), que lê dados do warehouse depois que o criativo rodou. O CM não sabe ROAS.
- **Não é dashboard de performance.** Olhar performance é olhar dashboard, não olhar CM. O CM sabe o que o criativo **é**, não como ele **está indo**.
- **Não é sistema de ads.** Quem veicula é Meta, Google, TikTok etc. O CM não envia o anúncio pra ninguém — isso é trabalho do Maestro.
- **Não é sistema de pagamento a influenciador.** Briefings pagos passam por outro fluxo; o CM só registra o criativo resultante.
- **Não é controle de qualidade.** O portão de qualidade, quando existe, é o Creatives Please (no fluxo Post Influ) ou revisão interna manual (nos demais). Se entrou no CM, já passou por aprovação.

---

## Conexões

| Documento | Tipo | Descrição |
|---|---|---|
| [[domain-dictionary#capomastro-cm]] | `is-defined-in` | Definição canônica curta do termo |
| [[conceptual/creative-flows]] | `elaborates` | Mostra como o CM participa dos três fluxos de origem (Produção Interna, Briefing Especial, Post Influ) |
| [[conceptual/performance-marketing-context]] | `contextualizes` | Contexto mais amplo do mercado em que o CM opera |
| [[constitution/creative-attribute-constitution]] | `governs-schema-of` | Define o schema dos atributos que viram campos de card |
| [[backlog/creative-attribute-pending]] | `pending-changes-to` | Backlog de campos que deveriam virar primeira classe no CM (hook, re-hook, etc.) |
| [[metrics-dictionary]] | `consumes-from` | Métricas que partem dos dados do CM (ad_age, spend, spend_share) |
