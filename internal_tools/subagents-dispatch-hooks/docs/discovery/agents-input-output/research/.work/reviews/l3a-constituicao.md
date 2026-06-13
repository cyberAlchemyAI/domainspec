---
tags: [agents, dispatch, review, constitution, io-contracts, p9]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l3a
---

# L3a — gate de consistência constitucional (draft-v3, dispatch 2026-06-12-agent-io-contracts)

Escopo: cada recomendação do `draft-v3.md` contra `subagents-strategy-constitution-proposal.md` v0.5.2 inteira (P1–P14, §5, §7 + emendas §8/§9) e contra o type skill `research` onde o draft o invoca como lei. Referências de linha são da constituição salvo indicação.

**Veredito geral primeiro, para calibrar:** o draft é constitucionalmente disciplinado acima da média — reconhece explicitamente os cortes de `expected_output_shape` (§2 linha "Envelope tipado": "era o que `expected_output_shape` teria sido antes do corte §7") e do `validator` (colisão 3: "cheiro v0.3.0"), nunca reintroduz `success_metric` (usa-o como mecanismo cautelar), e o checklist do approver **passa** o teste do single-gate: P12 (linha 136) já encarrega o `final_approver` do check P9 ("the approver receives the full working_folder... so the Principle 9 citation check is actionable"), e enumerar 6 itens enriquece o critério do MESMO gate sem criar confirm humano novo — "no second human gate at close" é respeitado porque o close continua report-only + close row (P3, linha 121). Os achados abaixo são onde a disciplina falha ou fica implícita.

## K1 — Checklist do approver re-introduz a FUNÇÃO de `final_approver_criteria` sem confrontar a linha do corte

- **Recomendação:** checklist FECHADO de 6 itens do approver (§3, colisão 1; edge `close`).
- **Violação:** §7, linha 515 — "`final_approver_criteria`, `gate_authority` | The approver field alone carries the mandate." Um checklist fixo de 6 itens com fontes anotadas é exatamente critério-de-approver materializado; o draft confronta o corte de `expected_output_shape` e do validator, mas **esta** linha da tabela de cortes nunca é citada.
- **Natureza:** extensão-que-exige-emenda (há uma defesa disponível — o corte removeu um campo *preenchível por dispatch* que convidava vácuo, e o checklist é *lei fixa do tipo*, não campo da sheet — mas essa defesa precisa ser feita, e a casa da lei fixa é o skill `research`/constituição, não um findings).
- **Correção mínima:** adicionar à colisão 1 a confrontação explícita da linha §7 e declarar o checklist como emenda candidata ao skill `research` §Outputs (onde o check P9 do approver já mora), não como aquisição auto-sancionada.

## K2 — "Draft persistido com IDs antes da revisão" redefine P9/§5 e um findings não pode se auto-sancionar

- **Recomendação:** draft do synthesizer como seção append-only de `research.md` ANTES da revisão, "extensão declarada da definição P9" (§2 linha 12 da matriz; edge zig-zag).
- **Violação:** P9 (linha 133) define o par como "the collected returns (research) and the cited synthesis (findings)"; §5 `working_folder` (linhas 226–227) fixa "`<working_folder>/research.md` (collected returns)". Colocar camada de síntese dentro de research.md contradiz a parenthetical como escrita. O draft é honesto ("extensão declarada... não feita de passagem"), mas declaração em findings não é o rito: a constituição tem rota própria para isso — owner amendment registrado no documento (§8/§9, precedente da promoção de `review` no §5 `dispatch_type`). Frontmatter da constituição: `node_type: constitution` — "change through governance, not informally".
- **Risco secundário não coberto:** com F-seções dentro de research.md, uma claim do findings pode citar o PRÓPRIO texto do synthesizer e satisfazer o item (i) do checklist vacuamente — auto-citação que esvazia "cites the collected return it rests on". O invariante existente ("claim do draft nunca citável apenas via veredito do reviewer") cobre outra direção.
- **Natureza:** extensão-que-exige-emenda (declarada, mas sem rota de governança e com guard faltante).
- **Correção mínima:** (a) marcar a extensão como PENDENTE de owner amendment a P9 + §5 `working_folder`, no padrão "pending one-line amendment" do §9; (b) acrescentar o guard: F-seções são ALVO de citação para vereditos de reviewer, nunca PROVA terminal para claims do findings — toda F-claim carrega suas próprias citações E*.

## K3 — "falha de envelope → re-ask ao agente" contradiz o tratamento de falha de P4 e roda fora de todos os freios

- **Recomendação:** edge explorer→research.md, invariante "falha → re-ask ao agente".
- **Violação:** P4 (linha 122) prescreve o tratamento de falha de agente: "An agent error inside a group **degrades to a partial group result** that downstream groups and the `final_approver` must be told about" — degradar + reportar, não re-invocar. E §5 `max_loops` (linhas 179–184): "A re-run fires **only** when the `final_approver` rejects the result... **nothing else triggers it**." O re-ask na coleta é re-invocação disparada por outra coisa; não é feedback edge (nenhum grupo requisitante emitiu ask), não é helper (P11), e não tem teto — é maquinário de iteração sem dial, exatamente o failure mode 4 do §1 ("unbounded iteration") que a constituição existe para frear. O draft até anota "(decisão de design, não invariante provado)", mas anota o trade-off errado (condensação silenciosa), não o conflito com P4.
- **Natureza:** contradição (do tratamento de falha de P4 como escrito).
- **Correção mínima:** ou classificar envelope malformado sob P4 (degrada a resultado parcial de grupo, reportado ao approver — que pode rejeitar e disparar re-run DENTRO de `max_loops`), ou, se o re-ask imediato for mantido, declará-lo emenda a P4 com teto explícito (1 re-ask por agente) e contagem em `agents_spawned`.

## K4 — Emenda de condensação: falta o invariante de carimbo, e sem ele P10 é violado pela própria rota sancionada

- **Recomendação:** cláusula de condensação como "emenda declarada à regra verbatim" com lista fixa de invariantes (IDs, âncoras, Dissent, posições) (§2 linha 11; §3).
- **Análise contra P9/P10 como escritos:** P9 (linha 133) diz "collected returns" — não diz "verbatim"; verbatim é lei do SKILL (`research` §Outputs: "collected returns, verbatim"). Logo a emenda não contradiz a LETRA de P9 — é emenda de skill, e o draft a classifica corretamente como emenda, não invariante novo. **Mas** P10 (linha 134): "Claim ≤ proof **in every artifact**." Um return condensado apresentado em research.md sob o header do agente, sem carimbo, afirma implicitamente "isto é o return coletado" — claim do artefato > prova. E a interação com o invariante "'está no transcript' proibido como destino final de citação" agrava: o original verbatim deixa de ser citável, então o texto condensado vira a prova-de-registro silenciosamente lossy.
- **Natureza:** extensão-que-exige-emenda (corretamente autoclassificada) + invariante faltante que, ausente, produz violação de P10.
- **Correção mínima:** acrescentar à lista fixa: "seção condensada carimbada `condensed-by-parent` com motivo (token_budget) e extensão da perda declarada". A nota de interação do draft (linha Dissent da matriz) já antecipa que a emenda quebra a derivação por composição — coerente; só falta o carimbo.

## K5 — Taxonomia de tiers OPEN sem confrontar o corte de `grade`

- **Recomendação:** taxonomia completa de 4 valores de verificação por claim "atribuída por inteiro no close" fica OPEN (§3, arbitragem A1).
- **Violação (de declaração, não de mérito):** §7, linha 528 — "`grade` (four-component) | Never filled in practice." Uma escada de 4 degraus atribuída por claim no close é o parente funcional mais próximo do `grade` cortado; o OPEN do draft se sustenta em circularidade e witness — corretos — mas a promoção futura encontraria a tabela de cortes sem aviso.
- **Natureza:** compatível-mas-não-declarado.
- **Correção mínima:** uma linha no registro OPEN: "promoção deve confrontar o corte de `grade` (§7) além de produzir consumidor não-circular".

## K6 — Espelho `dispatch_id`+`schema_version` no frontmatter vs "no other persistence surface" de P3

- **Recomendação:** frontmatter do findings espelha `dispatch_id` + `schema_version` (§2 linha 14; edge close).
- **Tensão:** P3 (linha 121): "No other persistence surface exists for dispatch metadata"; §7 débito residual reafirmado no §9: "the registry remains the only persistence surface for dispatch metadata". P3 sanciona o findings como superfície de RELATO ("reported... in the findings document") — `exit_reason`/`agents_spawned` no findings são lei. O espelho é defensável sob a mesma cláusula, e o draft já declara casa canônica na row; falta dizer EM TERMOS DE P3 que o espelho é relato, não segunda superfície — senão o GO (menor) belisca o débito AFFIRMED sem registrá-lo.
- **Natureza:** compatível-mas-não-declarado.
- **Correção mínima:** uma linha: "espelho = relato sancionado por P3, fonte de verdade permanece a row; nenhuma migração lê o frontmatter".

## K7 — Demoção do shape literal do findings contradiz o skill §Outputs como escrito

- **Recomendação:** "invariantes obrigatórios, shape livre" (§2 linha 15).
- **Violação:** skill `research` §Outputs prescreve "**Findings shape** — per candidate, a row in the verdict matrix". A constituição é silenciosa sobre shape (P9 só exige a síntese citada), então não há violação constitucional — mas demover prescrição de skill exige emenda ao skill, e o draft trata como veredito de matriz, não como change request.
- **Natureza:** extensão-que-exige-emenda (nível skill).
- **Correção mínima:** marcar a linha como emenda candidata ao skill `research` §Outputs ("matriz OU shape equivalente preservando os invariantes"), não como lei já demovida.

## K8 — Header exige `ângulo` incondicionalmente; §5 o define como condicional

- **Recomendação:** header de fronteira com "identidade + ângulo obrigatórios" (§2 linha 1; edge explorer→research.md).
- **Violação:** §5 `angle` (linha 351): "C · A (required **iff** group `n ≥ 2`)". Para grupo n=1 (o synthesizer canônico, ou explorer solo) o contrato exigiria um campo que a constituição define como inexistente.
- **Natureza:** compatível-mas-não-declarado (desalinhamento de condicionalidade).
- **Correção mínima:** "ângulo obrigatório iff n ≥ 2 no grupo; omitido em n = 1" — espelhando a condicional do §5.

## Checks pedidos sem achado (registrados como PASS)

- **Checklist vs single-gate (P12):** PASS — ver veredito geral; itens (i)–(vi) são critério do gate existente, approver-agente continua *recomendando*, reject continua disparando re-run dentro de `max_loops`, humano mantém só `user_abort`.
- **`expected_output_shape`:** PASS — o draft aloja esquema de ID/headers/posição da Dissent no `initial_prompt`, que é exatamente a dobra sancionada pelo §7 (linha 527), e o reconhece nominalmente.
- **`success_metric` / validator:** PASS — nunca reintroduzidos; o declínio do rejeitador mecânico (colisão 3) cita o corte com razão nomeada.
- **Dissent como LEI por composição:** PASS — skill §Tension design exige a linha em todo return de explorer/skeptic; reviewers são skeptics no chassis (tabela de roles do skill); verbatim persiste o return inteiro; o teorema fecha. A ressalva de interação com K4 já está no próprio draft.
- **Pares inicial/final = P14:** PASS — P14 (linha 138) literal, inclusive a condicional robot-talks, que o edge table do draft preserva ("sob robot-talks").

## Contagem

- Contradição: 1 (K3)
- Extensão-que-exige-emenda: 4 (K1, K2, K4, K7)
- Compatível-mas-não-declarado: 3 (K5, K6, K8)

Dissent: prevejo discordar de L3b (tooling) sobre K3 e a colisão 3 — L3b tenderá a pedir validação mecânica de envelope no appender/script como "barato e determinístico", e eu sustento que o corte do validator no §7 ("strategist self-checks against §5, the human confirm is the gate") torna checklist-não-script o único default constitucionalmente seguro até emenda; e de L3c (determinismo) sobre granularidade de ID — L3c tenderá a exigir IDs de claim obrigatórios para tornar o item (i) mecanicamente decidível, e eu sustento que P9 como escrito é satisfeito em nível de seção e que elevar IDs a obrigação constitucional repete o padrão de maquinário-sem-consumidor que o §7 cortou.
