---
tags: [agents, dispatch, io-contracts, changelog, l3, zig-zag, system-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: system-view-author (turno final do zig-zag, dispatch 2026-06-12-agent-io-system-view)
---

# L3 changelog — system-view.md v0.3.0 → v1.0.0 (turno final do zig-zag)

Artefato revisado: `system-view.md` (status `draft` → `active` — completo aguardando o engineer-view, mesma decisão da discovery v1.0.0; versão 0.3.0 → 1.0.0). Reviews processados: `l3a-skill.md` (K1–K4), `l3b-lei.md` (T1–T7), `l3c-engineer.md` (U1–U7). Pontos contestados re-verificados contra as fontes antes de cada edição: `.claude/skills/engineer-view/SKILL.md` (legenda de status `<decision-inventory-discipline>`: RESOLVED = decidido E enforced; OPEN inclui designed-but-not-built; conjunto fechado {RESOLVED, OPEN, CRITICAL}); discovery §7 (mapa verdict→status — PROPOSTA) + §6 (ERRATUM A14; abertos para a spec) + §2 (definição de Claim-ID/`<label>#<n>`) + §4.2/§4.4/§4.6/§4.7; constituição §5 (close row: `agents_spawned` com bucket `helpers` é campo required). 18 ids, **16 aplicadas, 2 rejeitadas**.

## APLICADAS (16)

| id(s) | edição | uma linha |
|---|---|---|
| U1 + T1 | mapa: split do #9 em duas rows + contagens | A regra de row-com-split do próprio preâmbulo agora é cumprida no #9, espelhando o #17: row nova `stance:carimbo-not-re-reviewed` (metade GO — carimbo + cláusula de aceitação, GO desde já sem deviation; witness E1 ev. 2/6; findings §2 #9) separada de `stance:tiers-de-verificacao` (só a metade taxonomia, OPEN 6.2), ambas declarando o compartilhamento do handle #9. Mapa **20 → 21 rows** (15 tensas + 6 GOs estáveis); contagem atualizada em TODAS as menções: preâmbulo do mapa ("quinze primeiras", "21 rows ao todo"), OQ-SV-1 ("21 handles"), what-does-not-cover ("as 21 rows"). Camada 4 (bullet Condicionado) e a tabela de framings da Camada 3 ganharam os ponteiros às duas rows donas. |
| U2 | célula de `stance:mapa-verdict-status` + Camada 4 (parágrafo do mapa e bullet KILL) | Tensão NOMEADA na célula da row dona: a tabela §7 da discovery é PROPOSTA; a legenda do consumidor exige RESOLVED = decidido E **enforced** (gate em disco) e OPEN inclui designed-but-not-built; as 10 aquisições GO pendem das emendas 2–4 sem gate vigente ⇒ a tradução mecânica produziria OPEN, não RESOLVED — e a decisão da tradução pertence à row (dono: autor do engineer-view; autoridade: discovery §7 + engineer-view/SKILL.md). `RESOLVED-negativo` corrigido nas três ocorrências (célula, parágrafo do mapa, bullet KILL): não é valor do conjunto fechado {RESOLVED, OPEN, CRITICAL} — KILL → registrado como negativa tipada com autoridade citada; **status legal a decidir pela row**, nenhum quarto valor inventado. A view nomeia, não decide. |
| T2 | Camada 3, parágrafo do re-ask | Erratum A14 descolado da frase errada: a **contabilidade** do helper mora no bucket `helpers` de `agents_spawned`, campo required da close row (constituição §5) — duas casas distintas, como a discovery §7 (linha T3) separa; o A14 governa só as linhas `Deviation:`/`Accepted-unreviewed:`, que moram no corpo do close. As duas casas agora aparecem separadas na frase. |
| T3 | Camada 3, mesmo parágrafo | "sem row própria" ganhou a marca de provisoriedade que a fonte carrega: "(leitura da letra de P11 a confirmar na emenda — discovery §4.4, achado D5)" — a única interpretação pendente de lei que era narrada como letra. |
| T4 | edge 2 + row `stance:header-de-fronteira` | "pelo registro do dispatch" → "pela sheet (congelada na dispatch row)" nas duas ocorrências — restaurado o termo da fonte (discovery §4.7 #1); "registro" pertence à constituição com outro referente (o ledger, P3). Reverte a paráfrase introduzida pela S7 da trilha L2. |
| T5 | Camada 1, fecho | "relato de identidade exigido pelo ledger" → "relato de identidade no próprio artefato (aquisição deste dispatch, lida contra P3 — ...)": a lei não exige o espelho; ele é GO deste dispatch defendido CONTRA a frase final de P3. |
| T6 | Surface | "citar a prova persistida que a sustenta" → "citar **o return coletado** que a sustenta" — a letra vigente de P9; "prova persistida" antecipava a extensão da emenda 1. |
| T7 | preâmbulo do mapa | "(OPENs de owner)" → "(OPENs de fechamento externo)" — coerente com a disjunção de OQ-SV-3 (só 6.1 tem dono nomeado na fonte). |
| K1 | edge 2 | Literais demovidos a ponteiro, descrição conceitual mantida: `<label>#<n>` → "gramática default do ID: definição do termo na discovery §2"; "`Dissent:` como última linha" → "em posição fixa de fecho do return (posição e literais: findings §4 edge 2)". O termo `<label>` permanece (innarrável a tensão de `stance:derivacao-de-label` sem ele); os literais pertencem ao engineer-view/findings §4. Supera a rejeição S1 da L2 por mandato do dispatch. |
| K3 | Contexto de fontes, bullet novo | Leitura registrada da ambiguidade do SKILL declarada no preâmbulo: tabelas de framings por **camada de shape** (Camadas 1–4, leitura do quality-bar); Surface, mapa de stances e closing map não são camadas de shape e não carregam tabela. A inconsistência interna do gate (quality-bar por-camada vs Step 8/lane "per-major-section") está **encaminhada ao dono do skill** — interpretação registrada, não resolvida aqui. |
| U3 | preâmbulo do mapa | Nota de tradução completada: rows sem verdict de matriz (abertos-da-discovery §6 / proposta §7 — derivacao-de-label, regime-pre-emenda, verificacao-do-parent, mapa-verdict-status) traduzem como **OPEN com dono nomeado na célula**; nenhuma é CRITICAL (todas com recomendação/default na discovery §6/§7). Critério do marcador declarado: `[registro + encaminhamento]` reservado às três rows dos OPENs 6.1–6.3 (rastreadas por OQ-SV-3); nas demais rows de dono externo, o encaminhamento É o dono nomeado na célula. |
| U4 | células de derivacao-de-label, regime-pre-emenda, verificacao-do-parent | Autoridade na própria célula, fim da caça: "(discovery §4.2 + §6 abertos)", "(discovery §4.6 + §6 abertos, correção T1)", "(E1 ev. 6; discovery §6 abertos, S4)" — cada uma com o dono nomeado junto. |
| U5 | preâmbulo + 8 handles do mapa | Esquema único: row-handle = stance-slug nos 8 divergentes (ids-de-claim-com-namespace, draft-citavel-do-synthesizer, checklist-do-approver, regime-pre-emenda, re-ask-capeado, condensacao-carimbada, espelho-no-frontmatter, append-only-estendido); linha no preâmbulo fixando a âncora pública (= stance-slug) e subordinando `decision:#<id>` (chave interna do SKILL) e `#n` da matriz à MESMA row; Contexto de fontes atualizado (`engineer-view#<stance-slug>`). Custo zero — todos PROVISIONAL. |
| U6 | célula de derivacao-de-label | "o guard de unicidade downstream **(ontology-view)** nasce PLANNED" — o dono do token de status desambiguado dentro da célula que alimenta statuses do consumidor. |
| U7 | tabela da Camada 2, row da URL-list | "(dispensa, não-stance; handle: OQ-SV-4)" — blinda o harvest mecânico do Step 1 do engineer-view contra ler a dispensa como stance órfã. |
| — | frontmatter | `status: draft` → `active` (enum do frontmatter.md: "current and load-bearing" — documento completo aguardando o engineer-view, mesma decisão da discovery); version 0.3.0 → **1.0.0**; `last_updated` mantido 2026-06-12. |

## REJEITADAS (2)

| id | decisão | justificativa |
|---|---|---|
| K2 | **Rejeitada (deferida)** | A correção que o próprio l3a prescreve é condicionada: "quando a ontology-view for autorada, demover os três glosses a usos + ponteiro". A condição não fechou (OQ-SV-2: ontology-view inexistente); hoje o regime sancionado — declarado no Contexto de fontes — é restatement-com-ponteiro do vocabulário de trabalho da discovery §2, e os três bullets citam a fonte no parágrafo-pai. Demover agora deixaria a Camada 2 sem chão de termos. A demoção pertence ao evolve-mode pós-ontology-view, não a esta revisão. |
| K4 | **Rejeitada (fora do artefato; encaminhada)** | O fix de l3a é "registrar **no close do dispatch** que o skip path foi tomado e que o sub-passe skeptic foi suprido pelo round L3" — registro de close, não edição do system-view.md; nenhuma frase do artefato muda. Encaminhamento: o close do dispatch 2026-06-12-agent-io-system-view deve declarar que a autoria v0.1–v0.3 tomou o skip predicate (`single + N=1`) e que os sub-passes skeptic/citation-strike/cross-reference foram exercidos pelos rounds L1–L3 deste zig-zag (L3a verificou: zero citação fantasma, zero handle órfão). |

## ARBITRAGENS

1. **U1/T1 — duas rows, não regra reescrita.** Entre os dois ramos oferecidos pelos reviewers (row irmã vs reescrever a regra de split para admitir row composta), escolhido o ramo preferível e simétrico ao #17: row própria para a metade GO. Razão: a regra "um verdict, um status por row" é a invariante que o consumidor (engineer-view SKILL, one-verdict-per-row) também exige — reescrevê-la para admitir status composto trocaria uma inconsistência local por uma violação do schema do consumidor. A nova row entra no grupo de tensão viva (carrega a declaração de split), não nos GOs estáveis. A aritmética muda para 21 e foi varrida nas três casas que a citavam.
2. **U2 — nomear sem decidir.** A célula de `stance:mapa-verdict-status` agora carrega a tensão completa (PROPOSTA §7 vs legenda enforced do SKILL vs emendas 2–4 pendentes) e a consequência da tradução mecânica (OPEN para as 10 GO) — mas o verdict da tradução permanece da row: esta view não escolhe entre "autoridade-em-disco basta" e "exige gate rodando". `RESOLVED-negativo` glosado como negativa tipada sem cunhar quarto valor — a escolha do status legal (presumivelmente RESOLVED + verdict negativo) também é da row. Coerente com o dissent do próprio l3c ("a row existe precisamente para isso") — o que faltava era o aviso, não a decisão.
3. **T2 — as duas casas separadas na frase, nenhuma criada.** O fix segue a linha T3 da tabela §7 da discovery: bucket `helpers` (close row, §5, campo required) ≠ linhas Deviation:/Accepted-unreviewed: (corpo do close, A14). Nenhuma mudança de schema é sugerida; só a frase colapsada foi dividida.
4. **K1 vs rejeição S1 da L2.** A L2 rejeitou demover `<label>#<n>` com fundamento no vocabulário de trabalho; o mandato deste turno arbitra em contrário (engineer-view é dono dos literais; discovery §2 é a casa da definição). Resolução: o literal sai, o TERMO `<label>` fica, e o ponteiro aponta à casa da definição — a tensão de derivacao-de-label continua narrável e a fonte do literal é única. Registrado como superação de arbitragem anterior por instrução do dispatch, não como re-litígio da L2.
5. **U3 — marcador não estendido.** l3c oferecia marcar `[registro + encaminhamento]` nas três rows de dono externo sem marca OU declarar por quê; escolhida a declaração: o marcador fica reservado aos OPENs 6.1–6.3 (que OQ-SV-3 rastreia como categoria da fonte), e nas rows sem verdict o encaminhamento é o dono nomeado na célula — evita diluir o marcador num segundo regime que a fonte não nomeia.

## Verificação de fechamento

- Mapa: **21 rows**, slugs e handles idênticos nos 21 pares (zero divergência remanescente); 15 de tensão viva + 6 GOs estáveis; nenhuma ocorrência remanescente de "20" como total (preâmbulo, OQ-SV-1, does-not-cover varridos).
- Split #9 e #17 ambos com duas rows e compartilhamento declarado nas quatro células; promessa "toda aquisição GO tem exatamente uma row dona" satisfazível — a metade GO do #9 tem dona (`stance:carimbo-not-re-reviewed`).
- "RESOLVED-negativo" sobrevive só entre aspas, como valor negado — nunca como status proposto.
- A14: as três ocorrências agora consistentes (Camada 3 com as duas casas separadas; Camada 4 e does-not-cover já corretas e intactas).
- Marcadores GO-condicional (rota F*, condensação, checklist/regime) intactos da L1/L2 — nenhuma emenda operada como vigente; T6 estreitou a única paráfrase larga de P9.
- Frontmatter: `status: active`, `version: 1.0.0`.
