---
tags: [agents, dispatch, review, engineer-view, usabilidade, system-view]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-system-view
role: l3c-engineer
---

# Review l3c — usabilidade para o engineer-view

Artefato: `system-view.md` v0.3.0. Consumidor simulado: `.claude/skills/engineer-view/SKILL.md` (decision inventory: cada stance → UMA row dona, verdict + status RESOLVED/OPEN/CRITICAL + autoridade citada verificável em disco; legenda: RESOLVED = decidido E enforced; OPEN inclui designed-but-not-built; chave de row `decision:#<id>`; back-ref `system-view#stance:<slug>`). Gate único: simular a construção do inventário a partir do mapa de 20 rows.

**Resultado da simulação, por sub-gate:**

- **(a) Autoridade localizável + verdict derivável:** PASS com ressalva (U4). Verifiquei em disco: `discovery.md` v1.0.0 (§1–§7 existem, incl. §4.7 handles/U3 e §7 mapa verdict→status), `research/findings.md` (matriz §2 com 18 linhas, arbitragens §3, contratos §4, emendas §5, OPENs §6.1–6.3), `research/research.md` presente. 17 das 20 rows citam handle de matriz/arbitragem/OPEN na própria célula e o verdict é derivável sem re-decidir; 3 rows não citam fonte na célula (U4).
- **(b) Splits traduzíveis sem ambiguidade:** FAIL para #9 (U1); PASS para #17 (duas rows, compartilhamento declarado em ambas as células).
- **(c) Cobertura da tabela verdict→status:** PARCIAL — cobre GO/GO-condicional/OPEN/KILL/LEI; não cobre as 4 rows oriundas dos abertos-da-discovery sem verdict (U3); GO→RESOLVED colide com a legenda do SKILL (U2); `RESOLVED-negativo` não é valor legal do conjunto fechado de status (U2).
- **(d) Handles estáveis e únicos:** PASS em unicidade (20 slugs de stance únicos; 20 handles de row únicos; zero colisões); ressalva de dupla/tripla nomenclatura (U5).
- **(e) Re-decisões forçadas:** listadas caso a caso em U1–U6; fora delas, a construção das demais rows é mecânica.

## Itens

### U1 — ALTA — Split do #9: a regra declarada exige duas rows, o mapa entrega uma — o autor do engineer-view não sabe se faz 1 ou 2 rows (e a aritmética de 20 quebra num dos ramos)

- **Onde:** preâmbulo do mapa ("Regra de row-com-split... quando uma única linha da matriz carrega parte resolvida E parte aberta (**#9**, #17), **cada parte resolve numa row própria** e ambas as rows declaram o compartilhamento") vs a única row que toca o #9: `stance:tiers-de-verificacao`, cuja tensão carrega AS DUAS metades ("Só o carimbo `not-re-reviewed` + cláusula de aceitação (**GO sem deviation**) versus a taxonomia completa de 4 tiers — **OPEN**...").
- **Problema:** para o #17 a regra é cumprida (re-ask-capeado + mecanizacao-da-validacao, compartilhamento declarado nas duas células). Para o #9 não existe segunda row: a metade GO (carimbo + cláusula — findings §2 #9, "carimbo... = GO") não tem row própria. O autor do engineer-view fica entre dois ramos contraditórios: (i) seguir a regra declarada → criar row 21 para a metade GO → quebra "20 rows ao todo" e a conferência aritmética que OQ-SV-1 lhe delega; (ii) seguir o mapa → uma row com dois statuses (RESOLVED + OPEN) → viola exatamente o "um verdict, um status por row" que a regra de split diz preservar, e viola a invariante one-verdict-per-row do SKILL (duplicate-verdict/composite). A promessa "toda aquisição GO... tem exatamente uma row dona" fica não-satisfazível tal como escrita: a metade-GO do #9 ou é órfã ou coabita.
- **Correção apontadora:** ou (preferível, simétrico ao #17) criar `stance:carimbo-not-re-reviewed` (GO sem deviation; findings §2 #9 metade resolvida) e ajustar a contagem para 21 com a decomposição refeita; ou reescrever a regra de split restringindo-a ao #17 e declarar explicitamente o #9 como row de status composto com a regra de registro que o engineer-view deve aplicar — em qualquer ramo, dizer ao consumidor qual é.

### U2 — ALTA — A tradução GO→RESOLVED colide com a legenda de status do consumidor (RESOLVED = decidido E ENFORCED; designed-but-not-built = OPEN) — e `RESOLVED-negativo` não é valor legal

- **Onde:** Camada 4, mapa de tradução ("GO e as duas adotadas A2/A3 → RESOLVED"; "KILL → RESOLVED-negativo") — fiel à discovery §7; vs engineer-view/SKILL.md `<decision-inventory-discipline>`: "RESOLVED — decided AND enforced (a gate/authority enforces it on disk)"; "OPEN — ... includes *designed-but-not-built* rows"; status é conjunto fechado {RESOLVED, OPEN, CRITICAL}; e Step 6 examina "a 'RESOLVED' row with no running gate... for over-claim".
- **Problema:** as 10 aquisições GO são contratos recomendados cujas casas normativas pendem das emendas 2–4 (não promulgadas — findings §5; discovery §7): em disco não existe gate vigente que as enforce. Aplicação mecânica da legenda do SKILL flipa as 10 rows GO para OPEN (designed-but-not-built / "no running gate in repo"), contradizendo a tradução proposta — o autor é forçado a RE-DECIDIR a semântica de "enforced" (autoridade-que-decide = findings em disco basta? ou exige gate rodando?) para cada row GO, ou a decidir uma vez na row `stance:mapa-verdict-status` — mas a célula dessa row não nomeia ESTA tensão (diz só "adotá-la como está, ajustá-la"), então o clash chega ao autor sem aviso. Agravante: `RESOLVED-negativo` (KILL) não pertence ao conjunto fechado de status do SKILL — o autor re-decide se é RESOLVED com verdict negativo ou um valor novo (valor novo = violação do schema do consumidor).
- **Correção apontadora:** nomear a tensão na célula de `stance:mapa-verdict-status`: "GO→RESOLVED pressupõe que autoridade-citada-em-disco (findings §2) satisfaz 'decided AND enforced' mesmo com as emendas 2–4 pendentes — a alternativa (designed-but-not-built→OPEN) flipa as 10 rows GO; e RESOLVED-negativo deve ser registrado como RESOLVED + verdict negativo, não como quarto status". A view não decide; só avisa o que a row decide.

### U3 — MÉDIA — Quatro rows nascem fora do vocabulário de verdict: a tabela verdict→status não as cobre e o autor inventa status sem regra

- **Onde:** rows `stance:derivacao-de-label`, `stance:regime-pre-emenda`, `stance:verificacao-do-parent`, `stance:mapa-verdict-status` — todas oriundas dos "Abertos identificados para a fase de spec" (discovery §6, bucket distinto dos OPENs 6.1–6.3) ou da PROPOSTA §7; nenhuma tem verdict em GO/GO-condicional/LEI/OPEN/KILL.
- **Problema:** a tabela §7 traduz VERDICTS; essas 4 rows não têm verdict de entrada — o autor deriva status por analogia (presumivelmente OPEN), mas sem gate nomeado nem regra de CRITICAL ("CRITICAL só se bloquear a spec; nenhum dos **três** bloqueia" cobre só 6.1–6.3 — não diz nada sobre estes quatro). Agravante de consistência: só 3 rows do mapa carregam `[registro + encaminhamento]`, mas regime-pre-emenda (dono: quem redigir a emenda 3), derivacao-de-label (dono: spec) e verificacao-do-parent ("a spec decide") também têm fechamento externo — o autor re-decide caso a caso quais rows são encaminhamento, sem o critério que OQ-SV-3 aplica só aos três OPENs.
- **Correção apontadora:** uma linha no preâmbulo do mapa: "rows sem verdict de matriz (abertos-da-spec) entram como OPEN com dono externo nomeado na célula; nenhuma é CRITICAL (todas têm recomendação/default na discovery §6)" — e marcar `[registro + encaminhamento]` nas três rows de dono externo hoje sem marca (ou declarar por que não).

### U4 — MÉDIA — Três rows sem autoridade citada na própria célula: localizável só por caça

- **Onde:** `stance:derivacao-de-label` (célula não cita nada; a fonte é discovery §4.2 definição provisória + §6 aberto "Definição canônica de `<label>`"), `stance:regime-pre-emenda` (célula não cita; fonte: discovery §4.6 + §6 aberto "Regime pré-emenda", correção T1), `stance:verificacao-do-parent` (célula não cita; fonte: E1 ev. 6 + discovery §6 aberto/S4 — citada só na tabela de framings da Camada 3).
- **Problema:** o SKILL exige autoridade em TODA row ("a row with no authority cell is invalid") e o Step 6 verifica em disco. Para 17 rows a célula entrega o handle; para estas 3 o autor caça nos §6 da discovery — verifiquei que as fontes existem (localizáveis), mas o mapa quebra sua própria convenção de célula-com-handle exatamente nas rows mais frágeis (as sem verdict, U3).
- **Correção apontadora:** acrescentar às três células os ponteiros: "(discovery §4.2 + §6 abertos)", "(discovery §4.6 + §6 abertos, T1)", "(E1 ev. 6; discovery §6 abertos, S4)".

### U5 — MÉDIA — Tripla nomenclatura por row: stance-slug ≠ row-handle em 9 de 20, e o SKILL ainda chaveia por `decision:#<id>`

- **Onde:** ids-de-claim-com-namespace→#ids-de-claim-namespace; draft-citavel-do-synthesizer→#draft-f-citavel; checklist-do-approver→#checklist-6-itens; regime-pre-emenda→#regime-pre-emenda-checklist; re-ask-capeado→#re-ask-helper-p11; condensacao-carimbada→#rota-de-condensacao; espelho-no-frontmatter→#espelho-frontmatter; append-only-estendido→#append-only-persist; mais a convenção U3 (handle canônico = `#n` da matriz) citada no preâmbulo.
- **Problema:** zero colisões (verifiquei unicidade nos dois conjuntos), mas cada row carrega até TRÊS nomes a manter em sincronia (matriz `#n` / `stance:<slug>` / `engineer-view#<row-slug>`), com divergência não-motivada em 9 pares — e o SKILL do consumidor chaveia rows por `decision:#<id>` e back-referencia por `system-view#stance:<slug>`, um QUARTO esquema. O autor re-decide qual âncora é canônica; qualquer escolha diferente da que esta view gravou torna os 20 ponteiros "→ engineer-view#<slug>" dangling no publish.
- **Correção apontadora:** igualar row-handle a stance-slug nos 9 divergentes (custo zero agora, ambos PROVISIONAL), e uma linha no preâmbulo: "âncora canônica da row = stance-slug; `decision:#<id>` do SKILL é a chave interna, o slug é o fragmento público".

### U6 — BAIXA — `PLANNED` dentro de célula do mapa: status de outra view num lugar onde o consumidor lê statuses

- **Onde:** célula de `stance:derivacao-de-label` ("o guard de unicidade downstream nasce PLANNED").
- **Problema:** PLANNED é vocabulário do ontology-view (LIVE→PLANNED, herdado de U7 da discovery — corretamente narrado em OQ-SV-2); dentro de uma célula do mapa de stances, na coluna que alimenta rows com status fechado {RESOLVED, OPEN, CRITICAL}, convida o autor a copiá-lo como status de row. Não força re-decisão (OQ-SV-2 desfaz a ambiguidade para quem o lê), mas é a única célula cujo texto contém um token de status que não é do consumidor.
- **Correção apontadora:** "...o guard de unicidade downstream (ontology-view) nasce PLANNED" — três palavras desambiguam o dono do token.

### U7 — BAIXA — OQ-SV-4 como não-stance está bem resolvido; registrar apenas o risco de harvest mecânico

- **Onde:** Camada 2, última linha da tabela de framings + OQ-SV-4 (lista de fontes com URL — nem adota nem rejeita; dono: spec).
- **Problema:** o Step 1 do SKILL manda harvestar "every stance it names but does not decide" — uma leitura mecânica pega a dispensa da URL-list como stance órfã (nomeada, não decidida, sem row). A view JÁ se defende ("este OQ é o handle da dispensa... para que ela não fique órfã de dono") — registro este item como verificação feita, não como mudança exigida; no máximo, uma palavra "(não-stance)" na célula da tabela blindaria o harvest.
- **Correção apontadora:** opcional — "(dispensa, não-stance; handle: OQ-SV-4)" na célula da Camada 2.

## Veredito do gate

Usável com correções: 15 das 20 rows constroem-se mecanicamente (autoridade na célula, verdict derivável, status traduzível). As re-decisões forçadas remanescentes, caso a caso: #9 — 1 ou 2 rows (U1, a única contradição interna dura); semântica de RESOLVED vs enforced + valor do KILL (U2, chega sem aviso à row que deveria absorvê-la); status e marca de encaminhamento das 4 rows sem verdict (U3); autoridade de 3 células por caça (U4); âncora canônica entre 4 esquemas de nome (U5). Nenhuma re-decisão de MÉRITO (nenhum verdict precisa ser re-julgado — a cadeia findings→discovery→view preserva isso); todas as re-decisões são de REGISTRO, e quatro das cinco são elimináveis por edição de células/preâmbulo sem tocar nenhuma decisão.

Dissent: U2 admite leitura benigna — a row `stance:mapa-verdict-status` existe precisamente para o autor do engineer-view decidir a tradução, então o clash GO→RESOLVED vs designed-but-not-built poderia ser "funcionando como desenhado"; sustento ALTA mesmo assim porque a célula dessa row não NOMEIA a tensão (a view promete nomear toda tensão que não decide), e um autor que aplique a tabela §7 sem ler o SKILL do consumidor produz 10 rows RESOLVED que o Step 6 do próprio engineer-view flagra como over-claim.
