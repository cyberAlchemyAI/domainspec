---
tags: [agents, dispatch, research, io-contracts, p9, review, citation-check]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l1a
---

# Review L1a — gate citação-verificável (checagem P9 executada)

**Alvo:** `.work/drafts/draft-v1.md` · **Fonte de prova:** `research.md` (returns E1/E2/E3, round 1) · **Dispatch:** 2026-06-12-agent-io-contracts

**Método:** cada claim load-bearing do draft foi resolvida manualmente contra a seção citada do research.md. Critério em três passos: (1) a citação existe? (2) resolve para uma seção/ID identificável? (3) o texto resolvido DE FATO sustenta a claim, não algo vagamente parecido? Cobertura: as 17 linhas da matriz §2 (cada célula citante), as 3 colisões de §3, as 5 linhas da tabela de edges §4, e a resposta de §5.

## Veredito geral

A espinha citacional do draft é sólida: das ~60 citações individuais resolvidas, a grande maioria aterrissa em texto identificável que sustenta a claim. As violações encontradas concentram-se em (a) uma misattribuição load-bearing usada para resolver a Colisão 2 contra E3, (b) uma claim de ausência-de-testemunha que o próprio corpus contradiz, e (c) um conjunto de âncoras imprecisas e universalizações de amostras.

## Violações

**V1 — MAIOR. Colisão 2 atribui a E3 uma classificação que E3 não fez.**
- *Claim (§3, Colisão 2):* "a própria leitura de E3 da evidência Tam et al. classifica numeração de findings como zona segura (E3 evidência (a), 'Leitura para o contrato')".
- *Citação dada:* E3 evidência (a), parágrafo "Leitura para o contrato".
- *Por que não sustenta:* o parágrafo citado diz que estruturar o **envelope** é barato e lista "cabeçalho de proveniência R1/R2, linha `Dissent:` R5, matriz de verdicts R7 — que é pós-raciocínio". **Numeração/IDs de claim não aparece na lista.** Pior: E3 R1 diz explicitamente o oposto — "Não forçado: IDs numéricos por parágrafo... Granularidade além disso é custo sem regra que a exija". O draft usa as palavras de E3 para vencer E3 num ponto em que E3 se posicionou contra; a extensão "ID de claim é pós-raciocínio, logo zona segura" é inferência do synthesizer, não leitura de E3. Isso é load-bearing: é o segundo pilar da resolução da Colisão 2 (o GO contestado da linha 2 da matriz).
- *Correção mínima:* reescrever como inferência própria: "estendo o critério de E3 (envelope pós-raciocínio é barato) aos IDs de claim, que são igualmente pós-raciocínio — extensão minha, não classificação de E3". O argumento sobrevive (E1 evidência 1 ainda carrega o peso empírico); a atribuição não.

**V2 — MODERADA. "Nenhum return malformado de explorer foi observado" é contradito por E1 evidência 4.**
- *Claim (§2 linha "Validação de envelope", repetida em §3 Colisão 3):* "Não testemunhado internamente — nenhum return malformado de explorer foi observado; as quebras foram de persistência, não de forma (E1 evidência 2)".
- *Citação dada:* E1 evidência 2.
- *Por que não sustenta:* ev.2 mostra que o padrão de quebra foi synthesizer/reviewer sub-persistidos — isso sustenta a segunda metade. Mas a primeira metade ("nenhum return malformado") é uma claim categórica de ausência que **E1 evidência 4 contradiz**: "Nenhum dos sete returns de explorer persistidos... termina com `Dissent:`" — sete returns violando o único campo de corpo obrigatório do SKILL. O próprio draft (linha 4 da matriz) cita essa ausência como quebra testemunhada. Ev.3 abre a dúvida ("ou nunca foram escritas, ou a condensação as comeu"), então a malformação pode ser de persistência e não de emissão — mas isso torna a claim **indecidível**, não testemunhada-como-ausente. O verdict OPEN repousa parcialmente nessa ausência declarada.
- *Correção mínima:* trocar para "nenhum return malformado de explorer foi observado **além da ausência de Dissent (ev.4), cuja origem (emissão vs condensação) é indecidível no corpus**" — e notar que um checklist de coleta teria pego exatamente esse caso, o que na verdade FORTALECE o lado checklist do OPEN.

**V3 — MENOR. Âncora errada para F21.**
- *Claim (§2 linha "Âncora de evidência"):* "foi o que permitiu refutar F21 ('README line 22', E1 evidência 6)".
- *Por que não resolve limpo:* ev.6 contém o "Parent verified: FALSE — README line 22" mas **nunca nomeia F21**; a ligação F21↔README-line-22 está em E1 §Elementos, "Output do explorer" item 3. A citação resolve para o lugar errado; o leitor que for a ev.6 não encontra F21.
- *Correção mínima:* citar "E1 evidência 6 + E1 §Elementos item 3".

**V4 — MENOR. "Quando quase nada mais sobreviveu" excede a fonte.**
- *Claim (§2, mesma linha):* a âncora de evidência "sobreviveu à condensação quando quase nada mais sobreviveu (E1 evidência 3)".
- *Por que não sustenta:* ev.3 lista TRÊS classes sobreviventes — "IDs, severidades, âncoras de evidência" — e UMA perdida (Dissent). "Quase nada mais sobreviveu" inverte a proporção da fonte.
- *Correção mínima:* "sobreviveu à condensação junto com IDs e severidades; só as linhas Dissent se perderam (E1 evidência 3)".

**V5 — MENOR. Citação E3 não sustenta o output do reviewer descrito.**
- *Claim (§2 linha "Output do reviewer"):* "forçado internamente por P9 aplicado ao zig-zag (E1 elemento reviewer; E3 tabela síntese, linha reviewer)".
- *Por que não sustenta:* a linha reviewer da tabela de E3 força apenas "posição inicial e final persistidas" — não diz nada sobre veredito por ID alheio nem claims novos em namespace próprio. Metade da citação composta é decorativa; só o elemento de E1 carrega a claim. Além disso, "forçado internamente por P9" é derivação do draft que nenhuma das duas fontes enuncia.
- *Correção mínima:* citar só E1 (elemento "Output do reviewer") e declarar a derivação P9→zig-zag como inferência da síntese.

**V6 — MENOR. Universalização de uma amostra.**
- *Claim (§3, Colisão 1):* "toda citação contra return persistido resolveu (E1 evidência 1)".
- *Por que não sustenta:* ev.1 testou exaustivamente a seção A do primeiro dispatch e **amostrou** o segundo ("amostrei C1, C2, M1–M6, m1, m9"). "Toda citação" promove amostra a universal.
- *Correção mínima:* "toda citação testada/amostrada contra return persistido resolveu".

**V7 — MENOR. Mecanismo causal não testemunhado apresentado como testemunhado.**
- *Claim (§2 linha "Passo dedicado de checagem"):* "as duas quebras reais passaram sem detecção **porque nenhum check rodou no close** (E1 evidência 2)".
- *Por que não sustenta:* ev.2 documenta as quebras e que persistiram no registro; não afirma o mecanismo causal "nenhum check rodou no close". É inferência plausível (e provavelmente verdadeira), mas a coluna "witnessed?" exige testemunho, e o testemunho cobre só o efeito, não a causa.
- *Correção mínima:* "passaram sem detecção até a resolução manual deste dispatch (E1 evidência 2); a ausência de check no close é a explicação inferida".

**V8 — MENOR. Misquote por conflação.**
- *Claim (§3, Colisão 2):* "a checagem P9 lê IDs de claim nos dois registros reais ('E2 C1/C2', '**F11; E2#1–2**')".
- *Por que não resolve:* a string "F11; E2#1–2" não existe na fonte; ev.2 tem "C2 (F1; E2#1–2)" e "M5 (F11; ...)" como citações separadas. A claim sobrevive com as quotes corretas; a string conflacionada não é localizável.
- *Correção mínima:* citar "C2 (F1; E2#1–2)" e "M5 (F11; ...)" como aparecem.

**V9 — MENOR. Âncora imprecisa para o verbatim literal.**
- *Claim (§2 linha "Verbatim + invariantes"):* "verbatim literal no SKILL; cada hop de resumo degrada (E3 evidência (b), telephone game)".
- *Por que não resolve limpo:* a exigência literal de verbatim no SKILL está em **E3 R4** ("literal no skill"); evidência (b) só cobre a degradação por hop. A célula cita um endereço para duas claims e só um resolve.
- *Correção mínima:* "(E3 R4; degradação: E3 evidência (b))".

## Classes que passam limpas (uma linha cada)

- **Todas as citações a E2 por framework** (§LangGraph reducer/add_messages, §AutoGen CantHandleException, §CrewAI, §OpenAI input_filter, §MetaGPT documento-como-contrato, §Anthropic CitationAgent/citation-accuracy, §Padronizado 1–4, §Idiossincrático 1) resolvem exatamente e sustentam o que carregam.
- **Todas as citações a E3 por requisito** (R1–R8, §Evidência interna success_metric/grade, evidência (a) Tam et al., evidência (b) working_folder completo) resolvem — a única falha de E3 é a atribuição de V1, não os Rs.
- **A linha Dissent (matriz linha 4)** e o conjunto E1 ev.1/2/4/5/7/8 citados nas linhas 1, 2, 8, 12, 14 e nas duas demoções de §3 resolvem com sustentação exata, incluindo as quotes literais ("not adversarially re-reviewed", "Parent verified:", deviation do zig-zag, drift exit_reason).
- **A tabela de edges §4** herda citações já verificadas; único resíduo: "KILLs banked como negativas tipadas" não cita in-loco, mas E1 ev.7 (citado em §3 demoção b) o cobre.

## Contagem

| gravidade | n |
|---|---|
| MAIOR | 1 (V1) |
| MODERADA | 1 (V2) |
| MENOR | 7 (V3–V9) |

Nenhuma violação derruba um verdict da matriz por si só; V1 enfraquece o argumento da Colisão 2 (o GO do ID de claim fica apoiado só em E1 ev.1 + na extensão declarável do critério R5, o que ainda parece suficiente SE declarado como extensão); V2 muda a textura do OPEN da Colisão 3 (a favor do checklist, ironicamente na direção que o draft já tomou como default).

Dissent: prevejo discordar do irmão L1b (inflação) quando ele classificar os GOs de duas-testemunhas (tier de verificação, schema_version) como inflados — a cadeia citacional deles resolve limpa e a força está corretamente demovida no próprio draft ("invenção nossa, declarada como tal"); o problema do draft não é claim>peso, é âncora imprecisa em ~7 pontos. E do irmão L1c (coerência) quando ele tratar a tensão "duas quebras vs três quebras" (E1 ev.2 diz três; o draft e o Dissent de E1 dizem duas) e o atrito linha-4-vs-linha-16 como incoerência do draft — o primeiro é fidelidade a uma inconsistência interna do PRÓPRIO E1, e o segundo é primariamente falha de citação (minha V2), não de coerência; e prevejo que L1c verá o uso auto-referente de R5 na Colisão 2 como circular, enquanto eu o dou como citacionalmente limpo (a quote do critério é exata; só a atribuição da aplicação falha — V1).
