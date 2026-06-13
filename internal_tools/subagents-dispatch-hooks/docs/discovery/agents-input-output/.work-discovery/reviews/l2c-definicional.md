---
tags: [agents, dispatch, review, io-contracts, definitional, p9]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l2c-definicional (skeptic, dispatch 2026-06-12-agent-io-discovery)
---

# Review L2c — solidez definicional (discovery.md v0.2)

Gate único: solidez definicional. Quatro perguntas: (a) termo novo cunhado para conceito já nomeado na constituição §3–§5, no research/SKILL.md ou no findings.md; (b) termo existente usado com sentido desviado; (c) os nomes das 4 posições do design space correspondem ao que E1/E2/E3 defenderam; (d) termos que a spec downstream vai precisar e que ficaram sem definição apontável. Método: resolução de cada termo da discovery contra os três vocabulários de referência + verificação mecânica do schema da close row contra `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md`.

## Achados

### D1 — MAJOR — (c) Posição (a) do design space atribuída a E2 que E2 não defendeu

- **Termo:** §2 preâmbulo "Quatro posições reais entraram em colisão na pesquisa; cada uma na sua forma mais forte" + §2(a) "Schemas tipados de mensagem — a posição dos frameworks (E2)".
- **Fonte:** research.md §E2. O candidato que E2 de fato defendeu é o composto "corpo livre + envelope tipado + checagem de citação como passo dedicado" (E2 §Candidato, itens 1–5), e o Dissent de E2 ataca explicitamente a tipagem do corpo ("nenhum dos seis precedentes tipa claims/evidência dentro do schema; abandonar esse equilíbrio é inventar sem precedente exatamente onde o ângulo E2 manda adotar").
- **Desvio:** a posição (a) na sua "forma mais forte" (AutoGen Pydantic + `CantHandleException`, LangGraph TypedDict) é a família message-schema que E2 *reportou* — nenhum return a defendeu como posição; ela nasceu para ser morta (§4.1, morta também por E2). O rótulo "(E2)" no header da posição convida a spec a citar E2 como advogado de schemas tipados, invertendo o Dissent dele. A peça de E2 que realmente entrou em colisão (Colisão 3) é o Candidato #5 (validação mecânica de envelope) — que a discovery já abriga separadamente em (d) e §4.7.
- **Correção:** renomear o header para algo como "(a) Schemas tipados de mensagem — a família mais forte do levantamento de E2 (defendida por nenhum return; ver §4.1)" e ajustar o preâmbulo de §2: são três autoridades de explorer + um split de revisão L3, não "quatro posições defendidas".

### D2 — MAJOR — (b)/(d) "campo de desvios da close row" — campo que não existe no schema; "existente" é verificavelmente falso

- **Termo:** §6 tabela, row "Bucket `helpers`...": "A14 espelha `Deviation:`/`Accepted-unreviewed:` no campo de desvios da close row" e "nenhum campo novo de row aparenta ser necessário (A14 usa o campo de desvios existente)".
- **Fonte:** `register-dispatch/SKILL.md` §"Closing a dispatch" — a tabela de campos da close row é fechada: `close_of`, `exit_reason`, `agents_spawned`, `feedback_prompts`, `invoked_by`, `project_dir`, `closed` ("any other key not in this table — unknown keys are rejected (exit 2)"). Constituição §5 "Close of dispatch" idem: só `exit_reason` + `agents_spawned` são portados pela row. Não há campo de desvios.
- **Desvio:** o termo é herdado do findings §4 Close (A14: "espelhadas no campo de desvios da close row" — igualmente sem lastro), mas a discovery o AMPLIFICA: converte a hipótese (que ela própria manda "validar na spec contra register-dispatch") em asserção de existência ("o campo de desvios existente") na mesma célula. Sob o texto vigente, espelhar `Deviation:` na close row exige campo novo → mudança de schema + appender — exatamente o que a célula nega.
- **Correção:** reescrever a célula: "A14 pressupõe um campo de desvios que NÃO existe no schema da close row v0.5.2 (unknown keys → exit 2); ou o espelho fica confinado ao corpo do close do findings (sem row), ou a spec declara campo novo com a mudança de appender que isso implica". Remover "existente".

### D3 — MAJOR — (d) `<label>` — o termo de que depende o default canônico de ID não tem definição apontável

- **Termo:** §3.2 default canônico "`<label>#<n>` (ex.: `E1#4`)"; §3.7 row de header "`<nome>` = label da sheet; ordem = rows da sheet".
- **Fonte:** constituição §5 não tem campo `label`: Level 4 tem `agent_name` (opcional, default `null`, valores do pool tipo "Russell, Bertrand" — não "E1"), `role`, `angle`; Level 2 tem `group_id`. O findings A5 ("`<nome>` = label do agente na sheet congelada") aponta para o mesmo vazio.
- **Desvio:** "E1" não é `agent_name` nem `group_id` — é uma terceira identidade que emergiu da prática (E1 ev. 1/5) e que nenhum dos três vocabulários define como campo ou regra de derivação. A spec que codificar o GO 3.2 precisa responder: onde o label mora na sheet, como é derivado (E<n> pela ordem das rows? prefixo por grupo?), unicidade entre grupos, e o que vale quando `agent_name` é `null` vs preenchido.
- **Correção:** a discovery deve registrar em §5 (abertos para a spec) que "label" é termo sem definição apontável e que a spec deve defini-lo (proposta mínima: derivado determinístico de `group_id` + posição da row, independente de `agent_name`), em vez de usá-lo em dois GOs como se fosse vocabulário fechado.

### D4 — MODERATE — (b) regime pré-emenda de 3.6 é adição normativa própria fora do perímetro que o preâmbulo declara

- **Termo:** preâmbulo (linha 15): "suas únicas adições próprias são recomendações editoriais de housing e sequência (§5 'desta discovery', §6)" vs §3.6: "nenhuma deviation é exigida no intervalo... (regime enunciado por esta discovery a partir da arbitragem 3)".
- **Fonte:** findings §3 arbitragem 3 — não enuncia regime de intervalo; só não anexa cláusula de deviation (silêncio, não permissão).
- **Desvio:** definir quando o mecanismo de deviation se aplica é normativo, não housing/sequência — e mora em §3, não em §5/§6. A discovery é internamente honesta (marca a autoria), mas o perímetro autodeclarado do preâmbulo fica falsificado pelo próprio texto; um leitor que confie no preâmbulo não procura adição própria dentro de §3.
- **Correção:** ou listar o regime pré-emenda de 3.6 no preâmbulo como terceira adição própria, ou demovê-lo a recomendação em §5/§6 e deixar 3.6 só com o contraste factual ("a arbitragem 3 não anexa cláusula de deviation — contraste com a arbitragem 2").

### D5 — MINOR — (b) "helper": citado só por P11, cuja letra lê contra o uso que a discovery faz

- **Termo:** §3.4 "+1 em `agents_spawned.total` (bucket `helpers`)... classificado helper invocation (P11)".
- **Fonte:** P11: helper "reported post-hoc in the parent's `agents_spawned` report (chat + findings, **not written to the ledger row**)"; mas §5 `agents_spawned` é "close row + reported" e o exemplo carrega `helpers: 0` na row.
- **Desvio:** tensão interna da constituição (parentético de P11 vs §5), não criação da discovery — mas a discovery cita só P11 e resolve silenciosamente na direção de §5. A spec herda a contradição sem saber que existe.
- **Correção:** citar §5 `agents_spawned` como base do bucket e acrescentar uma linha: a leitura adotada é que "not written to the ledger row" de P11 significa "sem dispatch row própria", não "fora da close row" — leitura a confirmar na emenda.

### D6 — MINOR — (a)/(d) "GO menor" — modificador de verdict fora do vocabulário sancionado

- **Termo:** §3.7 row "`dispatch_id` + `schema_version`... | GO menor".
- **Fonte:** findings §2 semântica da matriz define exatamente GO | GO-condicional | LEI | OPEN | KILL; o "(menor)" do findings #14 já era extra-vocabulário e a discovery o propaga como se fosse categoria.
- **Desvio:** sem semântica apontável — a spec não sabe se "menor" muda obrigação, contagem ou nada. (Conta no GO 10? Sim, pela linha de contagem — mas isso é inferência, não definição.)
- **Correção:** "GO" na célula de verdict + nota de prosa ("escopo menor: espelho informativo, fonte de verdade = row").

### D7 — MINOR — (a) "consumidor honesto" — fusão de dois termos da trilha em aparente categoria nova

- **Termo:** §3.2 "consumidor honesto = o briefing, não o checklist (findings §2 #2)".
- **Fonte:** findings §2 #2 diz "consumidor = briefing, não checklist"; "ramo honesto" é da trilha L2 (O4: "consumidor de IDs fechado pelo ramo honesto").
- **Desvio:** a fusão "consumidor honesto" lê como termo técnico definido em algum lugar — não é; são dois termos distintos comprimidos.
- **Correção:** "consumidor (fechado pelo ramo honesto — L2 O4): o briefing, não o checklist".

### D8 — MINOR — (c) "entraram em colisão na pesquisa" cobre posição que colidiu na revisão

- **Termo:** §2 preâmbulo "na pesquisa" vs posição (d), cujos donos são l3a/l3b/l3c — lentes da camada 3 de revisão do findings (trilha §8), não returns da pesquisa.
- **Desvio:** menor, porque (d) é honestamente rotulada "OPEN de owner" e glosada inline; mas o preâmbulo promete quatro posições "da pesquisa" e entrega três da pesquisa + uma da revisão.
- **Correção:** "entraram em colisão na pesquisa e na sua trilha de revisão".

## Termos verificados limpos

`envelope` (= headers/frontmatter sobre corpo livre — idêntico ao findings #5); `LEI` (semântica e a aritmética do "LEI 2" — #4/#8 com verbatim contada dentro do split de #11 — fielmente explicada em 3.3); `tier`/"taxonomia de 4 tiers" (split #9 preservado com label GO-condicional — a V1 da trilha L1 está corrigida na v0.2); `deviation declarada`/linha `Deviation:` (formato e usos consistentes com A14 e arbitragens 1–2 — ressalvado o housing de D2); `checklist do approver` (mesmos 6 itens, mesmo escopo "dispatch_type: research", mesma distinção resolução-mecânica/sustentação-juízo do findings §4 Close); `imutável-no-persist` (gatilho = persist, A6 — idêntico ao findings §7); `re-ask capeado`, `negativas tipadas`, `declínio provisório`, `claim load-bearing` (3 cláusulas, A3), `token sancionado` (A10) — todos com fonte resolvível e sentido preservado; nomes das posições (b) "Minimalismo derivado" e (c) "Prática interna registrada" correspondem ao conteúdo defendido por E3 e E1 (o subtítulo de (b) é literalmente o critério R5 de E3; o de (c) é o título do return de E1).

## Contagem

8 achados: 3 MAJOR (D1–D3) · 1 MODERATE (D4) · 4 MINOR (D5–D8).

Dissent: prevejo discordar de quem exigir que a discovery conserte dentro de si os termos herdados do findings (D2, D6 nascem lá): o mandato dela é codificar, não reparar a fonte — mas sustento que D2 não tem essa defesa, porque a discovery amplifica a hipótese em asserção de existência ("o campo de desvios existente") que o schema do appender refuta mecanicamente; e discordo de tratar D1 como mera escolha retórica de design space — atribuir a E2 a posição que o Dissent de E2 mata é o tipo de desvio que a spec downstream propaga como autoridade.
