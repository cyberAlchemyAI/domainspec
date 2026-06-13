---
tags: [agents, dispatch, research, io-contracts, review, skeptic, overspec]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l2b
---

# L2b — Review de over-spec / non-vacuity — draft-v2.md

Dispatch: 2026-06-12-agent-io-contracts. Artefato: `.work/drafts/draft-v2.md`. Fonte: `research.md` (E1/E2/E3) + `subagents-strategy-constitution-proposal.md` §7. Gate único: para cada elemento GO, exigir (1) WITNESS — caso real onde a AUSÊNCIA quebrou algo (quebras de E1 ev. 2/3/4/5/8) OU precedente externo citado em §E2 — e (2) checagem nomeada que CONSOME o elemento (o critério do próprio draft, E3 R5). Sem os dois: teatro → KILL ou OPEN. Atenção dupla aplicada: recriação de `expected_output_shape` (§7) e auto-aplicação do critério R5 contra cada elemento do draft.

## Itens

**O1 — Tier de verificação por claim (4 valores): consumidor CIRCULAR + witness de presença, não de ausência. O pior item do draft.**
Elemento: `explorer-claimed | reviewer-upheld | parent-verified | not-re-reviewed`, GO condicional ao item (vi) do checklist.
Witness: AUSENTE no sentido do gate. E1 evidências 2 e 6 mostram a prática *inventando* o marcador ("not adversarially re-reviewed", "Parent verified:") — emergência de presença, não quebra por ausência. Nada quebrou por faltar o tier: o workaround ad-hoc funcionou, o findings foi aceito, nenhuma claim foi aceita indevidamente por falta dele. Compare com a linha Dissent, onde a ausência deixou um check nomeado (false-consensus) sem sinal — aqui não há check pré-existente faminto.
Checagem nomeada: o próprio draft confessa "hoje NENHUMA checagem nomeada o consome" e então **cria o consumidor no mesmo documento** (item (vi) do checklist). Isso é circularidade pura: inventar o campo, inventar o check que o lê, declarar o critério R5 satisfeito. É exatamente o mecanismo pelo qual `success_metric` entrou no v0.3.0 — alguém imaginou um leitor futuro. E3 §Evidência interna é o precedente da morte.
Mas a evidência sustenta um NÚCLEO menor: o que a prática inventou duas vezes não foi a taxonomia de 4 valores — foi o carimbo binário `not-re-reviewed` (m10; N1–N15 de R1), e o caso m10 veio acompanhado de deviation declarada, ou seja, a metade do item (vi) que exige declaração explícita ao aceitar claim não-re-revisada tem lastro real. `parent-verified` (ev. 6) e `reviewer-upheld` (vereditos de R1) já existem como TEXTO citável no research.md — não precisam de campo: a citação P9 já resolve para eles.
Veredito proposto: **demover**. GO apenas para o carimbo `not-re-reviewed` em claims novas de reviewer + a cláusula de aceitação declarada do item (vi). A taxonomia de 4 valores "atribuída por inteiro no close" → **OPEN** (sem witness, sem consumidor não-circular; é o próximo `success_metric`).

**O2 — `schema_version` no frontmatter do findings: campo que NENHUMA checagem nomeada lê. Padrão success_metric literal.**
Elemento: frontmatter `dispatch_id` + `schema_version`, GO (menor).
Witness: o draft cita E1 ev. 8 (deriva de vocabulário de exit entre dois artefatos do mesmo dia) e a própria coluna admite "Sim (fraco)". Mas a deriva não QUEBROU nada: nenhuma checagem falhou, nenhum leitor real foi bloqueado — "um leitor futuro não sabe contra qual vocabulário validar sem arqueologia" é dano hipotético a um leitor hipotético. O gate exige quebra concreta; não há.
Checagem nomeada: inexistente. Quem valida `exit_reason` contra `schema_version`? Nenhum item do checklist do approver (i–vi) o lê; nenhum princípio o cita; nenhum script existe (o validator foi cortado no §7). Um campo de versão sem validador é cerimônia de versão — preenchido corretamente hoje, errado amanhã, e ninguém nota porque ninguém lê.
Contraste: `dispatch_id` TEM consumidor (a linha `close_of` do registry liga findings ↔ dispatch row; o appender o usa) — esse fica.
Veredito proposto: `dispatch_id` GO; `schema_version` → **OPEN** (entra apenas se e quando um check nomeado de validação de exit-vocabulário for instituído; até lá é o campo que E3 §Evidência interna prevê ser "preenchido com vácuo e depois cortado").

**O3 — Componente `modelo` do header de fronteira: terceiro carona sem consumidor.**
Elemento: header `## E<n> — <nome> (<ângulo>, <modelo>)`, GO.
Witness por componente: identidade e ângulo têm — E1 ev. 5 (a única quebra de fronteira foi reviewers fundidos) e o check de falso-consenso/P5 consome o ângulo (E3 R2). O `modelo` não: E3 R2 deriva "agent + angle" e PARA; nenhuma quebra registrada envolve não saber o modelo; nenhum check nomeado (P5, P9, P14, checklist i–vi) lê o modelo do header. E o dado já tem casa canônica: a sheet congelada (P2) e a dispatch row do registry registram modelo por agente — o header o DUPLICA.
Veredito proposto: GO para `identidade + ângulo`; `modelo` → opcional/informativo, com a sheet como fonte canônica. Custo é ~zero, mas o critério do draft não é "custo zero" — é "um check nomeado o lê". Aplicado a si mesmo, o draft deve ou apontar o leitor do modelo ou demovê-lo.

**O4 — IDs de claim: o consumidor nomeado declarado não existe no próprio checklist do draft.**
Elemento: ID com namespace por agente, "GO como decisão de design declarada".
Witness: presença-funcionando (E1 ev. 1: P9 como praticado leu IDs), não ausência-quebrando — as quebras de ev. 2 são de persistência, e teriam ocorrido COM ou SEM IDs (F11 tinha ID e quebrou mesmo assim, porque o enunciado não foi persistido). O draft já é honesto sobre isso (pós-L1).
Checagem nomeada — aqui está o furo residual: o item (i) do checklist ("toda citação resolve para texto persistido") é satisfazível em nível de SEÇÃO, exatamente como E3 R1 sustenta. Logo, nenhum item do checklist exige IDs; o consumidor declarado ("a checagem P9 como praticada") é hábito, não regra. Pelo critério R5 do próprio draft, o elemento está sem leitor obrigatório.
Veredito proposto: manter GO-como-design-decision SOMENTE se o draft fechar o circuito — ou o item (i) passa a exigir resolução em nível de ID (assumindo o custo que E3 contesta, com o dissenso vivo), ou a linha admite que o consumidor é opcional e o GO degrada para "default recomendado". Como está, a "decisão de design declarada" declara um consumidor que o próprio documento não institui.

**O5 — Pares posição-inicial/final + item (iv) do checklist: check de presença cujo check de conteúdo ninguém roda.**
Elemento: pares por reviewer, GO "sustenta-se no forçamento por P14, não em quebra observada".
Witness: ausente por confissão do próprio draft ("adjacente"); E2 é silente (proveniência por claim/posições é listado como idiossincrático). Pelo gate estrito: sem witness interno E sem precedente E2 → OPEN.
Checagem nomeada: existe — P14/E3 R6, a desigualdade de colapso. Mas note a cadeia: o item (iv) do approver checa que os pares EXISTEM; o consumidor real (computar `spread(inicial)>0 ∧ spread(final)=0`) é o synthesizer — e essa computação nunca foi observada rodando em registro algum. Check de presença de um campo cujo único leitor de conteúdo nunca rodou é a forma mais educada de teatro.
Veredito proposto: GO mantém-se, mas APENAS como herança constitucional (P14 é axioma deste dispatch — derrubá-lo está fora do meu mandato), e o draft deve rotulá-lo assim na matriz: "pass-through de P14, não decidido aqui; witness pendente do primeiro robot-talks real". Se o painel tratar o gate de witness como soberano sobre axiomas, cai para OPEN — registro essa tensão no Dissent.

**O6 — "Invariantes de condensação DECLARADOS": a declaração não tem leitor; e o invariante "severidades" não tem item de checklist.**
Elemento: verbatim + invariantes declarados, GO.
Witness do núcleo: forte e real — E1 ev. 3 (verbatim degradou duas vezes; a perda foi a Dissent). O núcleo passa o gate com folga.
Over-spec residual: (a) a palavra "declarados" sugere um ato de declaração por dispatch — quem LÊ a declaração? Nenhum item do checklist verifica "se condensou, declarou invariantes". A regra deve ser a LISTA fixa de invariantes (propriedade do contrato), não uma declaração por instância; declaração sem leitor é o frontmatter `schema_version` de novo. (b) Dos cinco invariantes listados (IDs, severidades, âncoras, Dissent, posições), o checklist consome Dissent (ii), posições (iv), âncoras/IDs indiretamente via (i); **severidades não têm leitor nomeado em lugar nenhum** — sobreviveram à condensação nos dois casos (ev. 3) sem regra, e nenhum check as lê.
Veredito proposto: GO para o núcleo (verbatim + lista fixa + proibição do transcript como destino); cortar "declarados" como ato por dispatch; severidades na lista de invariantes só se um check do close as consumir (hoje, candidato natural: nenhum) → marcar como OPEN dentro da lista.

**O7 — Vigia de `expected_output_shape` (§7): o briefing-edge está no limite, mas do lado certo da linha.**
Elemento: edge parent→explorer com expected return = "caminho do arquivo, headers exigidos, esquema de ID, posição da linha Dissent".
Análise: §7 cortou `expected_output_shape` como CAMPO, com a racional "the briefing itself states the expected return" — ou seja, o lugar sancionado para shape é exatamente a prosa do prompt. O draft mantém "prosa de briefing — sem schema" e congela o input (KILL para campo novo). Compliant na letra. O risco residual é a tabela de edge transformar a enumeração de 4 componentes em template obrigatório de prompt — um sub-schema de fato do `initial_prompt`, o campo cortado voltando pela porta da prosa. O witness a favor do draft: E1 §Input nota que o prompt DESTE dispatch (o mais especificado observado) é a melhor instância, e que prompts sub-especificados forçaram normalização-pós-hoc = o canal de condensação que degrada (ev. 3).
Veredito proposto: GO mantido, com uma palavra de guarda: a enumeração é GUIDANCE do que um briefing completo cobre, não checklist de validação de prompt — nenhum check nomeado deve jamais validar prompts contra ela (isso recriaria o campo cortado como lint).

**O8 — Âncora de evidência: passa o gate, mas pelo ramo E2, não pelo ramo interno — registrar a base correta.**
Elemento: âncora arquivo+linha/URL, GO.
Witness interno é de presença (F21 morreu por "README line 22" — âncora PRESENTE habilitando refutação); não há caso interno de ausência-de-âncora quebrando. O gate, porém, aceita o ramo alternativo: precedente externo citado em §E2 — e existe (Anthropic, "citation accuracy" como gate de rubrica; CitationAgent). Consumidor nomeado: item (i) do checklist + o trabalho de refutação do reviewer/parent (ev. 6).
Veredito proposto: GO mantido; corrigir apenas a coluna witnessed da matriz para não vender presença-habilitando como ausência-quebrando (mesma classe do I6 de L1b).

## Contagem e severidade

8 itens. Demoções propostas: O1 (tier 4-valores → núcleo `not-re-reviewed` GO, resto OPEN), O2 (`schema_version` → OPEN), O3 (`modelo` no header → opcional), O6 ("declarados" cortado; severidades OPEN na lista). Condicionais: O4 (fechar o circuito do consumidor de IDs), O5 (rotular pass-through de P14). Mantidos com nota: O7, O8. Nenhum GO central do draft (Dissent line, draft persistido, âncoras, append-only, verbatim, envelope) cai — o over-spec do draft mora nas bordas: campos de metadado sem leitor (O2, O3), consumidor circular (O1) e atos declarativos sem auditor (O6).

Dissent: aplico o gate de witness como soberano sobre tudo MENOS axiomas constitucionais (P14 em O5) — se o painel decidir que o gate vale também contra axiomas, os pares posição-inicial/final caem para OPEN e o item (iv) do checklist sai; sustento ainda, contra o provável instinto do synthesizer de salvar o tier de 4 valores por "custo baixo", que custo baixo não é critério do draft — leitor nomeado é, e leitor inventado no mesmo documento não conta.
