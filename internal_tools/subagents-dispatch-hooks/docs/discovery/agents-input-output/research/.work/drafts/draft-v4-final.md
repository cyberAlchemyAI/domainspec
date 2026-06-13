---
tags: [agents, dispatch, research, io-contracts, p9]
node_type: subagents-findings
is_session: false
layer: architecture
nature: technical
status: complete
version: 1.0.0
last_updated: 2026-06-12
dispatch_id: 2026-06-12-agent-io-contracts
schema_version: "0.5.2"
---

# findings — dispatch 2026-06-12-agent-io-contracts (contratos de I/O por role)

> Documento final após 3 camadas de revisão (3 reviewers cada). Trilha completa: `.work/reviews/` (l1/l2/l3 changelogs). Returns coletados verbatim: `research.md` (E1, E2, E3).

## 1. Contexto + Goal

Dois dispatches reais de 2026-06-12 expuseram quebras na cadeia claim→prova (camada de síntese nunca persistida, linhas `Dissent:` ausentes, citações terminando em transcript efêmero), enquanto a constituição v0.5.2 e o type skill `research` exigem que toda claim load-bearing do `findings.md` cite o return coletado que a sustenta (P9). **Goal:** determinar o que os contratos de input/output por role (explorer, synthesizer, reviewer) devem conter para que a citação P9 seja verificável e a síntese não degrade — com base em precedente externo (E2), evidência formal (E3) e prática interna registrada (E1).

## 2. Matriz de veredito final

Semântica: **GO** = aquisição deste dispatch; **GO-condicional** = aquisição condicionada a emenda pendente ou a consumidor futuro (split declarado na célula); **LEI** = lei vigente que o contrato referencia e verifica, não adota (não conta como aquisição sob P10; o gate de witness não se aplica — o que ela testemunha é violação, não lacuna); **OPEN** = sem resolução por falta de witness/consumidor — registrado, não suavizado; **KILL** = negativa tipada, banked para não ser re-levantada.

| # | elemento | verdict | base (citada) |
|---|---|---|---|
| 1 | Header de fronteira por agente (identidade + ângulo iff n≥2; modelo opcional/informativo) | **GO** | refinamento tipado dos per-child headers do `domainspec-research-writer`; E2 §MetaGPT, §LangGraph; E3 R1/R2; witness: E1 ev. 5 |
| 2 | ID de claim com namespace por agente — default `<label>#<n>` | **GO** (decisão de design declarada; dissenso de E3 R1 vivo; custo OPEN) | E1 ev. 1 (emergiu 2x, checagem P9 praticada os leu); E2 Candidato #2 ambíguo (título claim-level, exemplo section-level); consumidor = briefing, não checklist |
| 3 | Âncora de evidência por claim-ID (formatos fechados) | **GO** | E2 Candidato #2; E1 ev. 6 (âncora presente refutou F21); ramo presença-habilitando declarado |
| 4 | Linha `Dissent:` final em todo return, persistida | **LEI** (skill §Tension design ∘ verbatim — teorema por composição) | E3 R5, R4; E1 ev. 4 testemunha violação, não lacuna; contrato carrega só a verificação (item ii) |
| 5 | Envelope tipado (headers/frontmatter) sobre corpo livre | **GO** | canal existente `initial_prompt` §5; E2 §"Padronizado" 1 e 4; witness: E1 ev. 5 |
| 6 | Schema JSON/tipado do corpo epistêmico | **KILL** (unânime) | E1 Dissent, E2 Dissent, E3 evidência (a) — todos explícitos |
| 7 | Passo de checagem de citação no close → checklist de 6 itens do approver | **GO** (demovido a checklist; emenda recomendada ao skill `research` §Outputs — §5.3) | E2 §Anthropic + Candidato #4 (resolve E sustenta); P12/E3 R7; defesa contra o corte §7 em §3 |
| 8 | Pares posição-inicial/final por reviewer | **LEI** (P14 literal) | E3 R6; deltas genuínos movidos: localização no return (linha 13), verificação (item iv); witness de conteúdo pendente do 1º robot-talks real |
| 9 | Tier de verificação por claim | **GO-condicional** (split: carimbo `not-re-reviewed` + cláusula de aceitação = GO; taxonomia de 4 valores = OPEN) | método: E2 §Anthropic (única dona); conteúdo nosso; caso m10 (E1 ev. 2/6); taxonomia sem consumidor não-circular |
| 10 | Append-only para material já citado, estendido às seções de síntese/zig-zag | **GO** | `domainspec-research-writer` (precedente interno); E2 §LangGraph reducer; E3 R3; gatilho = persist (A6) |
| 11 | Verbatim + cláusula de condensação | **LEI** (verbatim) + **GO-condicional** (condensação como emenda declarada ao skill, com carimbo e lista fixa — §5.2) | skill §Outputs; E3 R4, evidência (b); E1 ev. 3 testemunha violação |
| 12 | Draft do synthesizer persistido com IDs `F*` em research.md ANTES da revisão | **GO-condicional** — pende emenda de uma linha em P9 (padrão `invoked_by`); até lá, deviation declarada por dispatch; guard anti-auto-citação obrigatório | E1 ev. 2 (quebra F11 — a maior observada); E2 §"Padronizado" 2; emenda em §5.1 |
| 13 | Output do reviewer (veredito exaustivo por ID alheio + N* carimbados + posições no return + Dissent) | **GO** | E1 §Elementos; E3 tabela síntese; E1 ev. 2; vocabulário fechado em §4 edge 4 |
| 14 | `dispatch_id` + `schema_version` no frontmatter do findings | **GO (menor)** | espelho = relato sancionado por P3; fonte de verdade = row (appender valida a row, não o frontmatter); E1 ev. 8 |
| 15 | Shape do findings: invariantes obrigatórios; matriz como default, shape equivalente só com deviation declarada | **GO** (alvo do determinismo = invariantes, não bytes; emenda recomendada ao skill — §5.4) | E1 ev. 7 (shape literal nunca usado); A13 |
| 16 | Input por role = prosa de briefing, congelado | **GO** (congelar; KILL para campo estruturado de input novo) | constituição §5; E3 R8, §Evidência interna |
| 17 | Validação de envelope na coleta | **OPEN** (default operacional: checklist; forma aberta — §6.1); re-ask resolvido: cap 1, helper P11 (§3 arbitragem 1) | E1 ev. 4 (caso Dissent); declínio provisório de E2 Candidato #5 (cheiro v0.3.0) |
| 18 | `round` marcado em todo return | **KILL** como obrigatório; GO condicional (só quando o edge feedback dispara) | E3 R2 |

**Contagem:** GO 10 · GO-condicional 3 · LEI 2 · OPEN 1 linha (+3 resíduos em §6) · KILL 2.

## 3. Síntese citada e arbitragens L3

A convergência dos três returns: **o contrato vencedor é envelope estruturado sobre corpo livre, com a verificabilidade morando na persistência e num check de close — nunca em tipar o raciocínio.** E2 mostra os seis precedentes mantendo esse equilíbrio (research.md §E2, "Padronizado" 1 e 4); E3 deriva que só campos consumidos por checagens nomeadas sobrevivem (E3 R5, §Evidência interna); E1 mostra que as quebras documentadas são de persistência (E1 ev. 2) — com o ramo Dissent indecidível entre emissão e condensação (E1 ev. 4), então o contrato cobre os dois. Nota de fidelidade: E1 ev. 2 enumera TRÊS quebras; o Dissent de E1 fala em "duas" — inconsistência interna de E1, registrada, não harmonizada.

A revisão L2 corrigiu a contabilidade (categoria **LEI**: pares = P14; Dissent = skill∘verbatim; aquisições caem de ~13 para 10 GO + 3 GO-condicional). A revisão L3 corrigiu a **honestidade declarativa contra a lei escrita**. Arbitragens deste turno:

**Arbitragem 1 — K3 (l3a) × T3 (l3b): o canal re-ask.** l3a provou contradição com P4 ("an agent error inside a group degrades to a partial group result", linha 122) e com `max_loops` ("nothing else triggers it", §5) — re-ask sem teto é o failure mode 4 do §1. l3b provou o furo de contabilidade: re-ask não cabia em nenhum dial e `loops_used`/`agents_spawned` não sabiam contá-lo. **Decisão: opção (b) — re-ask capeado e classificado.** Máximo **1 re-ask por agente**, classificado como **helper invocation (P11)** — agente único, spawned pelo parent dentro do próprio escopo, sem row e sem gate, reportado post-hoc — contado **+1 em `agents_spawned.total` (bucket `helpers`)**, registrado como `Deviation:` no close do findings; **não consome `max_loops`** (que só o reject do approver dispara). Se o re-ask também falha, ou o return está ausente (crash/timeout/vazio): **P4 literal** — degrada a partial group result, header SEMPRE persiste, corpo `RETURN AUSENTE — <motivo>`, downstream e approver informados (incorpora A9). Por que não a opção (a) (remoção): o único caso interno de malformação (ausência de Dissent nos sete returns, E1 ev. 4) é exatamente o que um re-ask barato recupera; degradar direto joga fora sinal recuperável, e P11 já fornece o bucket sancionado e o freio por relato. Resíduo declarado: a fronteira helper-vs-dispatch é provisória na própria P11.

**Arbitragem 2 — K2 (l3a) + T1 (l3b): a extensão de P9.** Mantida a recomendação do draft persistido (a quebra F11 — E1 ev. 2 — é a maior observada e exige veredito e alvo no MESMO artefato durável), MAS reclassificada: P9 como escrito (linha 133) define o par como "collected returns (research) and the cited synthesis (findings)", e uma citação `F11` não resolve para um collected return — sob o texto vigente, o findings que cita `F*` falha o item (i) do próprio checklist. **A extensão é GO-condicional: pende emenda de uma linha em P9, no padrão `invoked_by`** já praticado pelo tooling ("tooling-level extension, not in constitution §5, pending a one-line constitutional amendment" — register-dispatch/SKILL.md, 2x). Até a emenda: deviation declarada por dispatch. **Guard anti-auto-citação (K2), obrigatório desde já:** F-seções são ALVO de citação para vereditos de reviewer, nunca PROVA terminal para claims do findings — toda F-claim carrega suas próprias citações E*. Este findings RECOMENDA a emenda (§5.1); não a promulga.

**Arbitragem 3 — K1: o checklist vs o corte de `final_approver_criteria` (§7, linha 515).** Confrontado e **defendido — o checklist fica**. O corte removeu um **campo por-dispatch preenchível** da sheet ("the approver field alone carries the mandate"), da mesma família do `success_metric` ("never filled in practice") — maquinário que convida vácuo a cada preenchimento. O checklist de 6 itens não é um campo e não é preenchido: é a **definição executável da checagem P9 que P12 já manda o approver fazer** ("the approver receives the full working_folder... so the Principle 9 citation check is actionable", linha 136), fixada como lei do tipo no lugar onde essa frase já mora (research/SKILL.md §Outputs: "for research, acceptance includes the P9 citation check"). Mandato continua no approver; gate único continua respeitado (PASS explícito de l3a); nada por-dispatch é preenchível. O que muda de status: o checklist é **emenda candidata ao skill `research` §Outputs** (§5.3), não aquisição auto-sancionada por findings — e ganha escopo (T4): título "aceitação para `dispatch_type: research`"; o item (iv) verifica lei do router (P14) e a verificação equivalente em `review` é dívida da review/SKILL.md.

**Arbitragem 4 — A1 + A3 (l3c): desambiguações adotadas, não lei nova.** (A1) Esquema de ID default canônico: **`<label-do-header>#<n>`** (ex.: `E1#4`), contador por agente; o briefing pode sobrescrever **só com deviation declarada**. Contra o dissenso de l3a (IDs obrigatórios = maquinário-sem-consumidor): o default vive no contrato/type skill, não na constituição; default-com-override não re-decide o edge do briefing — torna a delegação determinística. (A3) Definição executável de **claim load-bearing**: toda assertiva que (a) aparece numa célula da matriz de veredito, (b) sustenta a resposta de 1 linha ao goal, ou (c) cuja remoção mudaria um verdict; o resto é isento. Quantificadores de §1 e do close alinhados: a obrigação de citar ID é das claims load-bearing, não de toda frase.

**Arbitragem 5 — A2, A10, A13 adotadas.** (A2) Cláusula de aplicabilidade n=1, alinhada a P9 literal: edge 1 aplica sempre; edges 2–5 aplicam **iff n ≥ 2** (a two-file rule de P9); em n = 1 o dispatch produz só `findings.md` (P9) e os invariantes de envelope (header, IDs, âncoras, Dissent) valem DENTRO dele; itens vacuosos do checklist marcados `N/A — role ausente` (distinto de PASS). (A10) Token sancionado para dissenso vazio: **`Dissent: none — <razão de uma linha>`** — a lei anti-falso-consenso nunca deve fabricar discórdia cosmética; veredito do reviewer é exaustivo por ID alheio; namespace vazio declarado (`Novas claims: nenhuma`). (A13) **O alvo do determinismo é identidade de INVARIANTES (checklist-checkável), não de bytes**; a matriz é o shape default do findings — shape equivalente só com deviation declarada.

**Dissensos L3 não-arbitrados — OPEN de owner:** mecanização (§6.1). l3a, l3b e l3c discordam genuinamente sobre checklist vs script vs linter; isso é decisão de quem é dono do corte do validator v0.3.0, não desta síntese.

Colisões herdadas mantidas como resolvidas em L1/L2: Colisão 1 (E1 vs E2) por demoção a checklist com a metade semântica recuperada ("resolve E sustenta", l2a P2); Colisão 2 (granularidade de ID) como decisão de design com dissenso de E3 vivo e custo OPEN; Colisão 3 (validação mecânica) ABERTA com default checklist e declínio provisório de E2 Candidato #5.

## 4. Contratos por edge (entrega central)

Aplicabilidade (A2, P9): o **edge 1** aplica sempre que um subagente é gerado; os **edges 2–5 e o regime de dois arquivos aplicam iff n ≥ 2** (P9); em **n = 1** o dispatch produz um único `findings.md` (P9) e os invariantes de envelope valem dentro dele. Nenhum elemento dos contratos de corpo é validado por tooling — o enforcement é o checklist do approver e o gate humano (T5); validação mecânica fica confinada à row do ledger (appender v0.5.2).

### Edge 1 — parent → explorer (briefing)

- **Payload:** goal + context + angle próprio (**obrigatório iff n ≥ 2 no grupo; omitido em n = 1** — espelha §5 `angle`, K8) + expected return (caminho do arquivo; headers exigidos; **esquema de ID — default `<label>#<n>`, sobrescrita só com deviation declarada**; posição da linha `Dissent:`) + token_budget.
- **Formato:** prosa de briefing dentro de `initial_prompt` (§5) — sem schema (E3 R8).
- **Invariantes:** congelado — nenhum campo estruturado de input novo (KILL #16); este edge é propriedade da constituição §5 — o contrato o referencia, não o re-decide; a enumeração de componentes é GUIDANCE de briefing completo, não checklist de validação de prompt (l2b O7).

### Edge 2 — explorer → research.md

- **Payload:** return integral, verbatim (LEI — skill §Outputs; E3 R4).
- **Header:** `## E<n> — <nome> (<ângulo>[, <modelo> — opcional/informativo; fonte canônica: campo model da dispatch row])`. **`<nome>` = label do agente na sheet congelada; ordem de montagem = ordem das rows da sheet** (A5).
- **IDs de claim:** namespace próprio por agente, default `<label>#<n>` (contador por agente, A1).
- **Âncoras de evidência — formatos fechados (A4):** `caminho-relativo:linha` | `arquivo §seção` | `URL`. Mínimo **1 âncora por claim-ID**; prosa livre não conta como âncora.
- **Última linha:** `Dissent: <posição>` ou o token sancionado `Dissent: none — <razão de uma linha>` (A10).
- **Montagem:** reducer append-only puro — concat sob header, conteúdo do filho congelado, ordem determinística pela sheet (E2 §LangGraph; precedente interno `domainspec-research-writer`).
- **Falha de envelope (arbitragem 1):** checklist de coleta (header? Dissent? IDs?) — default operacional, forma OPEN (§6.1). Falha → **no máximo 1 re-ask por agente**, classificado helper invocation (P11), **+1 em `agents_spawned.total` (bucket `helpers`)**, não consome `max_loops`, registrado como `Deviation:` no close. Segunda falha ou return ausente (crash/timeout/vazio) → **P4: partial group result** — o header SEMPRE persiste (preserva a numeração determinística), corpo `RETURN AUSENTE — <motivo>`, deviation na close row, downstream e approver informados (A9).
- **Condensação (só se token_budget forçar; emenda pendente — §5.2):** executada **somente pelo agente emissor** (nunca pelo parent — o conserto silencioso é o canal que E1 ev. 3 mostra degradar), marcada sob o header com a linha-carimbo `[condensado: <motivo>; invariantes preservados; perda: <extensão>]` (K4/A7 — sem o carimbo, P10 é violado pela própria rota sancionada). **Lista fixa de invariantes preservados:** IDs, âncoras, `Dissent:`, posições inicial/final. Severidades estão FORA da lista obrigatória (recomendadas, não exigidas — nenhum check nomeado as lê; resolve o membro OPEN que tornava a lista inexecutável, A7). "Está no transcript" proibido como destino final de citação.

### Edge 3 — research.md → synthesizer

- **Payload:** o arquivo research.md completo (returns verbatim) + sob robot-talks os pares posição-inicial/final por reviewer (LEI — P14, referenciada).
- **Formato:** referência leve ao arquivo — nunca transcripts de explorer (E2 §Anthropic/OpenAI `input_filter`).
- **Invariantes:** **gatilho de imutabilidade = o momento do persist; citação é irrelevante para o gatilho** (A6 — o que protege a cadeia é a persistência, não a citação; coerente com F11). Seções persistidas nunca são editadas; síntese e zig-zag anexam NOVAS seções append-only, marcadas por turno/round (E3 R3). O synthesizer não recebe nem produz resumo intermediário entre o explorer e a checagem (E3 evidência (b)).

### Edge 4 — synthesizer ↔ reviewer (zig-zag)

- **Ida:** draft persistido com IDs próprios (`F*`) como nova seção append-only de research.md ANTES da revisão. **Status: GO-condicional — pende emenda de uma linha em P9 (§5.1); até lá, deviation declarada por dispatch.** **Guard anti-auto-citação (K2):** F-seções são alvo de citação para vereditos de reviewer, nunca prova terminal para claims do findings — toda F-claim carrega suas próprias citações E*.
- **Volta (return do reviewer), nesta ordem:** (1) **veredito exaustivo por TODO ID alheio** — vocabulário fechado, caixa alta, **`{UPHELD, REFUTED, DOWNGRADED→<alvo>}`**, alvo obrigatório no downgrade (A12/A10) — + razão de 1 linha; (2) claims novos em namespace próprio (`N*`) carimbados `not-re-reviewed`; namespace vazio declarado: `Novas claims: nenhuma` (A10); (3) **duas linhas rotuladas, 1 linha cada, imediatamente antes do Dissent: `Posição inicial:` / `Posição final:`** (A11 — delta de localização sobre P14: o contrato fixa ONDE; assim o item (iv) vira grep, não juízo); (4) `Dissent:` final (token sancionado se vazio).
- **Formato:** markdown append-only no research.md, uma seção por turno (destino único: a quebra F11 mostra que o veredito do reviewer precisa citar algo persistido no MESMO artefato durável).
- **Disciplina de ID entre turnos/rounds (A8):** contador contínuo por agente, ID nunca reutilizado; revisão de claim obrigatoriamente referencia o superado (`supersedes E1#4`); o ID antigo permanece citável como superseded — citá-lo sem a marca é falha do item (i).
- **Invariantes:** nenhum turno absorvido pelo parent sem deviation declarada (E1 ev. 2); claim do draft nunca citável apenas via veredito do reviewer (F11); "full text is in the session transcript" proibido como destino de cadeia.

### Edge 5 — synthesizer → explorers (feedback; condicional)

- **Payload:** feedback-prompt verbatim + asks específicos por ID de claim.
- **Formato:** novo round = nova seção `(round N)` append-only; prompt gravado **no campo `feedback_prompts` da close row** (array JSON, verbatim — P3; T7).
- **Invariantes:** returns já persistidos são imutáveis (E3 R3, A6); contador de IDs continua — nunca reinicia (A8); `round` só é marcado quando este edge dispara (E3 R2).

### Close

- **findings.md:** matriz de vereditos como **shape default**; shape equivalente preservando os invariantes só com deviation declarada (A13). Alvo do determinismo: **identidade de invariantes, não de bytes** (A13). **Toda claim load-bearing cita ID** — load-bearing pela definição executável de 3 cláusulas (A3, §3 arbitragem 4); claims novas de reviewer aceitas sem re-revisão carregam `not-re-reviewed`; resposta de 1 linha ao goal.
- **Frontmatter:** `dispatch_id` + `schema_version` — espelho = **relato sancionado por P3** ("reported... in the findings document"); a fonte de verdade permanece a row, validada pelo appender; nenhuma migração lê o frontmatter (K6). Os dois campos pendem emenda ao cheatsheet de frontmatter do vault para `node_type: subagents-findings` (§5.5; T2).
- **Corpo, seção de close:** `exit_reason` + `agents_spawned` (total + tree + helpers + loops_used) + desvios — no CORPO, onde o router já manda reportar, não no frontmatter (T2). **Linhas fixas de declaração (A14):** `Accepted-unreviewed: <ID> — <razão>` e `Deviation: <o quê> — <razão>`, espelhadas no campo de desvios da close row.
- **Aceitação — checklist do approver, escopado: "aceitação para `dispatch_type: research`" (T4).** O approver recebe o working_folder COMPLETO, nunca digest (P12; E3 evidência (b)). Resolução é mecânica; sustentação é juízo do approver, declarado como tal:
  1. **(i)** [P9 + E2 Candidato #4] toda citação do findings resolve para texto persistido em research.md **que de fato sustenta a claim**; resolução em nível de seção é admissível mediante declaração;
  2. **(ii)** [skill §Tension design — LEI verificada] todo return termina em `Dissent:` (token sancionado conta);
  3. **(iii)** [NOVO] draft do synthesizer persistido com IDs em research.md (ou deviation declarada enquanto a emenda P9 pende);
  4. **(iv)** [P14 — LEI do router, verificada] posições inicial/final presentes se robot-talks rodou — duas linhas rotuladas (A11); *a verificação equivalente em `review` é dívida da review/SKILL.md*;
  5. **(v)** [operacionalização de P9] nenhuma cadeia de citação termina em "session transcript";
  6. **(vi)** [NOVO] toda claim nova de reviewer aceita sem re-revisão carrega `not-re-reviewed` E uma linha `Accepted-unreviewed:` no close.

  Itens vacuosos em n=1 ou sem o role: `N/A — role ausente`, distinto de PASS (A2). KILLs banked como negativas tipadas.

## 5. Emendas recomendadas (este findings recomenda; não promulga)

1. **Constituição §4 P9 — uma linha (padrão `invoked_by`).** Superfície: `subagents-strategy-constitution-proposal.md`, linha 133. De "the collected returns (research)" para reconhecer "collected returns **+ append-only synthesis/zig-zag sections**" como conteúdo de research.md citável. Acompanha o guard: F-claims carregam citações E* próprias; F-seção nunca é prova terminal. Até lá: deviation declarada por dispatch. (Espelho secundário: §5 `working_folder`, parenthetical "collected returns".)
2. **research/SKILL.md §Outputs — rota de condensação.** Emenda declarada à regra verbatim ("collected returns, verbatim"): condensação só pelo agente emissor, sob token_budget, com carimbo `[condensado: <motivo>; invariantes preservados; perda: <extensão>]` e lista fixa (IDs, âncoras, Dissent, posições). Alternativa coerente registrada: manter proibição + re-ask com token_budget revisado.
3. **research/SKILL.md §Outputs — o checklist de 6 itens** como expansão da frase existente "for research, acceptance includes the P9 citation check", escopado a `dispatch_type: research`; nota de dívida para review/SKILL.md (item iv).
4. **research/SKILL.md §Outputs — shape do findings:** "matriz de vereditos OU shape equivalente preservando os invariantes, com deviation declarada" (matriz como default).
5. **`.claude/skills/custom/frontmatter.md`** — seção para `node_type: subagents-findings` admitindo `dispatch_id` + `schema_version` (o node_type já existe no enum; os campos não — T2).

## 6. OPENs registrados

1. **Mecanização da validação de envelope/contrato — decisão de OWNER, três posições registradas:** **l3a** (constituição): checklist-não-script é o único default constitucionalmente seguro até emenda — o corte do validator no §7 ("strategist self-checks against §5, the human confirm is the gate") é lei. **l3b** (tooling): o enforcement split do appender ("NOT ENFORCED here — deliberate") é lei de desenho; validação mecânica confinada à row até existir testemunha interna de malformação que um checklist LIDO não pegue. **l3c** (determinismo): desambiguação textual primeiro, mecânica só onde o vocabulário já fechou; o item (i) ("sustenta a claim") é inferramentável por construção. Default operacional enquanto aberto: checklist.
2. **Taxonomia completa de 4 tiers de verificação** (`explorer-claimed | reviewer-upheld | parent-verified | not-re-reviewed` atribuída por inteiro no close): sem witness de ausência e sem consumidor não-circular. **Promoção futura deve confrontar o corte de `grade` (§7, "four-component — never filled in practice") além de produzir consumidor não-circular** (K5).
3. **Custo dos IDs de claim:** nenhum custo registrado, mas custo tampouco medido (E1 ev. 1); o dissenso de E3 R1 ("custo sem regra que a exija") permanece vivo; nenhum lado decide sem medição.

## 7. Resposta de uma linha ao goal

Os contratos por role são envelope estruturado sobre corpo livre — header identidade+ângulo com IDs default `<label>#<n>`, âncoras em formatos fechados e leis vigentes referenciadas e verificadas em vez de re-adotadas (Dissent persistida = skill∘verbatim; pares inicial/final = P14, em duas linhas rotuladas antes do Dissent); draft do synthesizer persistido com IDs `F*` em research.md antes da revisão (pendente emenda de uma linha em P9, com guard anti-auto-citação) e reviewer devolvendo veredito exaustivo `{UPHELD, REFUTED, DOWNGRADED→<alvo>}` por ID alheio com claims novas carimbadas `not-re-reviewed` — tudo montado por concat append-only imutável-no-persist (verbatim como lei; condensação só pelo emissor, carimbada, com lista fixa de invariantes), com falha de envelope capeada em 1 re-ask helper (P11) e depois P4, e fechado pelo checklist P9 de 6 itens do approver escopado a research, cujo alvo de determinismo é a identidade de invariantes, não de bytes — enquanto tipar o corpo epistêmico permanece KILL unânime.

## 8. Trilha de revisão (3 camadas × 3 reviewers)

**L1 — fidelidade de citação, inflação, coerência interna** (l1a-citacao V1–V9 · l1b-inflacao I1–I12 · l1c-coerencia C1–C10): 25 mudanças aplicadas (31 ids), 5 rejeições/moots. Destaques: **V1/I5 (a mais grave)** — atribuição falsa a E3 removida; a Colisão 2 deixou de ser "vitória sobre E3" e virou decisão de design declarada com dissenso vivo; **C1/C2** — forma do checklist FECHADA e semântica de imutabilidade definida (destino único research.md, motivado por F11); **C3** — escopo da Dissent unificado a todo return; **I8** — tier demovido a GO condicional; **C5/C6/C7** — régua única da coluna owned?, edge de briefing adicionado, linha de shape criada. Rejeição notável: "resolver ≠ sustentar" — âncoras que resolvem não provam witness de força.

**L2 — precedente, overspec, definicional** (l2a-precedent P1–P6 · l2b-overspec O1–O8 · l2c-definicional D1–D10): 20 aplicadas, 1 rejeitada, 5 arbitragens. Destaques: **P1** — autoria do tier corrigida (método é da Anthropic; só taxonomia e carimbo são nossos); **P2** — item (i) recupera "resolve E sustenta"; **D3–D6** — categoria **LEI** criada (Dissent = teorema skill∘verbatim; pares = P14), condensação reclassificada como emenda à regra verbatim; contagem honesta sob P10 cai de ~13 para 11 GO + 2 LEI; **O3/O4/O7** — modelo demovido a opcional, consumidor de IDs fechado pelo ramo honesto (briefing, não checklist), guidance ≠ lint de prompt. Arbitragem central: tier dividido (carimbo GO, taxonomia OPEN — leitor inventado no próprio documento não conta como consumidor). Rejeição: O2 — o appender valida `schema_version` na row (consumidor mecânico existe); resíduo concedido: lê a row, não o frontmatter — em L3 (T2) o registro foi reescrito como concessão parcial.

**L3 — constituição, tooling, determinismo** (l3a K1–K8 · l3b T1–T7 · l3c A1–A14): arbitragens deste turno. **K3×T3** → re-ask capeado em 1, classificado helper P11, contado em `agents_spawned` (bucket `helpers`), não consome `max_loops`; falha dupla/ausência → P4 partial group result (A9 incorporado). **K2+T1** → extensão de P9 reclassificada GO-condicional "pende emenda de uma linha" (padrão `invoked_by`), guard anti-auto-citação obrigatório; recomendada, não promulgada. **K1** → checklist DEFENDIDO contra o corte de `final_approver_criteria` (§7 cortou campo por-dispatch preenchível; o checklist é definição executável da checagem P9 que P12 já manda, lei fixa do tipo no skill) — mas reclassificado emenda candidata ao skill, escopado a research (T4). **K4/A7** → carimbo de condensação obrigatório; lista de invariantes FECHADA com severidades fora. **K5/K6/K8** → confrontações declaradas (corte de `grade`; espelho = relato P3; ângulo iff n≥2). **T2** → A4 do draft reescrito como concessão parcial; `exit_reason`/`agents_spawned`/desvios movidos ao corpo; emenda de cheatsheet declarada. **T7** → campo nomeado `feedback_prompts`. **A1–A14** → todas as desambiguações de determinismo adotadas (ID default, n=1 alinhado a P9, load-bearing em 3 cláusulas, formatos de âncora, chave de ordem, gatilho de imutabilidade = persist, supersedes, token de Dissent vazio, vocabulário de veredito fechado, posições em duas linhas rotuladas, linhas fixas de declaração, invariantes-não-bytes). Dissenso tri-lateral sobre mecanização: OPEN de owner (§6.1), não arbitrado.

---

**Close.** exit_reason: `completed` · agents_spawned: `{total: 12, tree: {investigate: 3, evaluate: 9}, helpers: 0, loops_used: 1}` (3 explorers + 3 reviewers × 3 camadas; synthesizer = parent). `Deviation: drafts e returns de reviewers persistidos em .work/ (drafts/, reviews/) em vez de seções append-only de research.md — desenho deste dispatch; a camada de síntese citável (F*) em research.md pende da emenda P9 que este findings recomenda (§5.1).` `Accepted-unreviewed: nenhuma — as arbitragens L3 deste turno são do synthesizer por mandato do dispatch e estão justificadas em §3 e no l3-changelog.`
