---
tags: [agents, dispatch, research, io-contracts, p9, review, precedent-kill]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l2a
---

# Review L2a — gate precedent-kill (precedente externo vs framing de novidade)

**Alvo:** `.work/drafts/draft-v2.md` · **Fonte de prova:** `research.md` §E2 (precedente-externo) · **Dispatch:** 2026-06-12-agent-io-contracts

**Método:** para cada elemento com verdict GO (incluindo GO condicional/demovido) na matriz §2 e na tabela de edges §4, resolvi a coluna `owned?` e o texto de §3 contra o return E2 integral (seis frameworks + seções "Padronizado vs idiossincrático" e "Candidato a adoção"). Pergunta única: o precedente existe? Se sim, o draft o adota citando o dono, ou re-inventa/sub-cita? Ataque dirigido (do briefing): a declaração "invenção nossa" do tier de verificação por claim.

## Veredito geral

A disciplina de precedente do draft é majoritariamente boa — a maioria dos GOs adota citando o dono correto, e o KILL do schema de corpo está alinhado com o Dissent de E2. As violações concentram-se em: (1) a declaração "invenção nossa" do tier de verificação, que lê seletivamente E2 §Idiossincrático 1 — a seção citada como prova de ausência de precedente é a que nomeia a Anthropic como dona do padrão subjacente; (2) o checklist do approver adota o CitationAgent pela metade sem declarar a metade descartada.

## Violações

**P1 — MAIOR. "Invenção nossa" do tier de verificação por claim não sobrevive como declarado; é extensão de padrão da Anthropic.**
- *Elemento:* tier `explorer-claimed | reviewer-upheld | parent-verified | not-re-reviewed` (§2 linha 9; §3 demoção (a); §5).
- *Claim do draft:* "Não — único elemento sem dono em NENHUMA das duas categorias: sem precedente externo (E2 §Idiossincrático 1)".
- *O precedente que o atinge:* a própria seção citada. E2 §Idiossincrático 1 não diz "ninguém trata proveniência por claim" — diz **"Só a Anthropic trata, e fora do contrato de payload — como passo dedicado + métrica de avaliação"**. E2 §Anthropic detalha: o CitationAgent é um passo dedicado pós-síntese que processa documentos e atribui cada claim à sua fonte, e a rubrica do LLM-judge inclui **"Citation accuracy (do the cited sources match the claims?)"** — um veredito de verificação por claim, emitido no fechamento, consumido como gate. Isso É o padrão estrutural do tier do draft: status-de-verificação por claim, atribuído num passo dedicado de close, consumido por uma checagem de aceitação (o item (vi) do checklist). O degrau `parent-verified`, em particular, é funcionalmente o resultado de um citation-accuracy-check do coordenador.
- *O que sobrevive como nosso:* a **taxonomia** — a escada de quatro degraus, o degrau `not-re-reviewed` (carimbar claims do reviewer como não-re-revisados não tem análogo em nenhum dos seis), e a regra "atribuído por inteiro no close porque só o parent sabe o que é parent-verified". Isso coincide com a partição que o próprio E2 prescreve no fecho do "Candidato a adoção": o precedente fornece o *método* (verificação por claim como passo dedicado pós-hoc), o *conteúdo* dos contratos por role é invenção nossa "e deve ser declarado como tal". O draft declarou invenção sobre o pacote inteiro quando só o conteúdo é nosso.
- *Defesa parcial reconhecida:* citation accuracy é um check binário de source-match, não uma escada de autoridade multi-degrau rastreando QUEM verificou. A morte não é total — é a declaração plana "invenção nossa" que morre, não o elemento.
- *Correção mínima:* coluna owned? de "Não" → "Parcial — o padrão (verdict de verificação por claim, atribuído em passo dedicado de close, consumido como gate de aceitação) é da Anthropic (E2 §Anthropic CitationAgent + rubrica citation accuracy; §Idiossincrático 1 a nomeia como única dona); a taxonomia de quatro degraus e o degrau not-re-reviewed são nossos". Propagar a reformulação a §3 demoção (a) ("invenção nossa declarada" → "extensão nossa de padrão Anthropic, taxonomia nossa") e a §5. Bônus: a correção FORTALECE o GO condicional — o elemento ganha um dono externo na coluna que hoje o deixa órfão.

**P2 — MAIOR. O checklist do approver adota o CitationAgent pela metade e não declara a metade descartada.**
- *Elemento:* passo de checagem de citação no close, demovido a checklist de 6 itens (§2 linha 7; §3 colisão 1; §4 linha close).
- *O precedente:* E2 Candidato a adoção #4 define a função adotada como percorrer cada claim e confirmar que a âncora citada **"existe em research.md E sustenta o claim"**; a rubrica Anthropic é literalmente semântica — "do the cited sources **match the claims**?".
- *O que o draft fez:* item (i) do checklist = "toda citação do findings resolve para texto persistido em research.md" — só a metade da **resolução**; o teste de **sustentação** semântica sumiu. A demoção de forma (agente→checklist) foi declarada e defendida (colisão 1); a demoção de escopo (resolve-e-sustenta→resolve) não foi declarada em lugar nenhum. Ironia verificável no corpus: o próprio review L1a deste dispatch executou o critério em três passos com "(3) o texto resolvido DE FATO sustenta a claim" — a prática interna já faz a metade que o checklist dropou, e foi esse passo 3 que pegou a misattribuição V1.
- *Correção mínima:* item (i) → "toda citação do findings resolve para texto persistido em research.md **que de fato sustenta a claim**" — ou, se a sustentação semântica for deliberadamente demovida a juízo (não mecânica), dizer isso explicitamente como segunda demoção, com dono (o approver julga, não tica).

**P3 — MODERADA. Colisão 2 omite que E2 Candidato #2 já se posicionou — dos dois lados.**
- *Elemento:* IDs de claim com namespace (§2 linha 2; §3 colisão 2).
- *O que falta:* o draft cita só "dedup por ID estável (E2 §LangGraph)" como precedente parcial e enquadra IDs de claim como "decisão de design declarada" nossa contra E3. Mas E2 Candidato a adoção #2 intitula o item **"Identidade estável por claim citável"** e crava "Sem âncora estável, 'citação verificável' é impossível por construção" — apoio explícito de E2 ao lado claim-level... cujo corpo, porém, exemplifica com "âncoras estáveis (headers/IDs de seção)" e `research.md#E2-secao` — granularidade de SEÇÃO, que apoia E3 R1. E2 é internamente ambíguo entre as duas granularidades, e o draft não usa nenhuma das metades: nem o título (que reduziria o peso de "decisão nossa") nem o corpo (que daria a E3 um segundo voto). A colisão 2 está adjudicando E2-vs-E3 sem registrar que E2 votou — ambiguamente.
- *Correção mínima:* registrar na colisão 2 a ambiguidade interna de E2 candidato #2 (título claim-level, exemplo section-level) e citar isso na coluna owned?. A resolução do draft (decisão de design, dissenso de E3 vivo) provavelmente sobrevive — mas com o mapa de votos completo.

**P4 — MENOR. Âncora de evidência arquivo+linha: dono errado na coluna owned?.**
- §2 linha 3 cita "citation accuracy como gate (E2 §Anthropic)" como dono. A rubrica da Anthropic é dona do **check pós-hoc**, não da âncora por observação; nenhum dos seis frameworks exige granularidade arquivo+linha no return — essa granularidade é prática interna (E1 evidência 6 / §Elementos item 3). O precedente externo correto para "âncora estável citável" é E2 candidato #2 (com a ambiguidade de P3). *Correção:* trocar a citação de owned? e deixar o peso do arquivo+linha no pilar witnessed (que já está correto).

**P5 — MENOR. `schema_version` re-inventa "envelope auto-identifica seu schema" sem creditar a família message-schema.**
- §2 linha 13 declara owned? "Não". Mas o padrão "o receptor sabe contra qual contrato validar porque o envelope declara seu tipo" é exatamente o roteamento por tipo do AutoGen (E2 §AutoGen) e a base da família message-schema (E2 §Padronizado 2); `schema_version` no frontmatter é o análogo da família artifact. Custo zero creditar; o GO (menor) fica mais forte com dono.

**P6 — MENOR. Colisão 3 não nomeia que o default-checklist DECLINA uma recomendação explícita de E2.**
- E2 Candidato a adoção #5 recomenda rejeição mecânica na entrada do reducer ("é rejeitado…, não absorvido"). A colisão 3 cita o `CantHandleException` e deixa a forma OPEN com default checklist — engajamento real, mas o texto não diz que isso é recusar (provisoriamente) um item da lista de adoção de E2, com razão nomeada (cheiro v0.3.0, sem testemunha interna de return malformado além do caso Dissent). *Correção:* uma frase — "default checklist = declínio provisório de E2 candidato #5, razão: …".

## Classes que passam limpas

- **Header de fronteira por agente:** adota MetaGPT documento-como-contrato + identidade LangGraph, citando ambos — limpo.
- **Linha `Dissent:`:** dono interno (E3 R5/SKILL), E2 corretamente registrado como silente — limpo.
- **Envelope tipado sobre corpo livre:** adota a convergência dos seis citando E2 §Padronizado 1/4 — limpo; e o KILL do schema de corpo está exatamente alinhado com o Dissent de E2 (não inventar onde o ângulo manda adotar).
- **Regra append-only:** adota o reducer puro do LangGraph citando-o, incluindo a negativa "editar conteúdo do filho não tem precedente" — limpo.
- **Draft do synthesizer persistido:** família artifact-as-contract citada (E2 §Padronizado 2) — limpo.
- **Output do reviewer:** "Não no ecossistema" confere com E2 §Idiossincrático 2 (nenhum framework publica schema para roles de research), e o draft declara a derivação como inferência própria — exatamente a honestidade que P1 cobra do tier — limpo.
- **research.md→synthesizer (referência leve, nunca transcript):** adota Anthropic lightweight-references + OpenAI `input_filter`, citando — limpo.
- **Input por prosa congelada / `round` condicional / pares posição inicial-final / shape do findings:** donos internos (§5, E3 R2/R6, SKILL); E2 não tem nada que os mate ou os possua — limpos em uma linha cada.

## Resumo

6 achados (2 MAIORES, 1 MODERADA, 3 MENORES). Nenhum verdict da matriz precisa flipar; P1 e P2 exigem reescrita de framing/escopo em §2, §3 e §5 antes do close — a declaração de invenção do tier, como está, viola o mandato literal de E2 ("deve ser declarado como tal" aplica-se ao conteúdo, não ao método).

Dissent: prevejo discordar de L2b (over-spec) se ele mandar cortar o tier de verificação ou os IDs de claim como cerimônia — P1 mostra que o tier tem dono de método externo (Anthropic) e consumidor nomeado (checklist item vi), então não é campo órfão tipo `success_metric`; e de L2c (colapso definicional) se ele colapsar "tier de verificação" em "checagem de citação" — são adjacentes mas distintos (resolução da âncora vs autoridade de quem sustentou a claim), e a correção certa é compartilhar o dono, não fundir os conceitos.
