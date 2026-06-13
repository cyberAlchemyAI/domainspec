---
tags: [agents, dispatch, review, mandato, engineer-view, l2c]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-engineer-view
role: l2c-mandato
---

# Review L2c — fronteira de mandato (engineer-view.md v1.1)

**Artefato:** `engineer-view.md` v1.1.0. **Gate único:** o engineer-view decide TRADUÇÃO e registro — não re-abre mérito fechado, não fecha OPEN de dono externo, não promulga emenda. Caçado nas duas direções (excesso / omissão) + adjudicação da régua R1–R5 em si.

**Fontes abertas:** `engineer-view.md` v1.1 (íntegra), `research/findings.md` (§2, §3 arbitragens 1–5, §4, §5.1–5.5, §6.1–6.3), `discovery.md` v1.0.0 (§4.6, §6 abertos, §7 + mapa proposto), `system-view.md` v1.0.0 (mapa de stances, OQ-SV-1–4, Camada 4), `engineer-view/SKILL.md` (legenda l.186–188, l.192–194), `subagents-strategy-constitution-proposal.md` (P10 l.134), `.work-ev/reviews/l1a/l1b/l1c` (para não re-litigar o já adjudicado).

**Veredito geral do gate: PASS com 2 fricções MÉDIA.** A arquitetura de mandato do documento é correta: as duas adjudicações pedidas (rebaixamento de D8; R4) saem limpas como TRADUÇÃO delegada — nenhum mérito de arbitragem foi re-aberto, nenhum OPEN 6.1–6.3 foi fechado (D10/D12/D3 são registro + encaminhamento, conferido célula a célula), nenhuma emenda §5 é tratada como vigente (D5/D9/D6/D13/D20 todas OPEN com gate; runtime declara deviation no intervalo). Os excessos achados são pontuais (uma frase-doutrina em R4; uma fatia de regime em D11); a omissão achada é uma decisão do próprio mandato empurrada à spec (R-14).

## Itens

### M1 — [ADJUDICAÇÃO — LIMPO] Rebaixamento de D8: registro legítimo, não re-abertura da arbitragem 1

- **Questão posta:** D8 caiu de RESOLVED a OPEN nesta revisão (l1c C2). Re-abertura do mérito?
- **Conferido:** a coluna Verdict de D8 preserva a arbitragem 1 **integral e literal** contra findings §3 — cap de 1 re-ask, classificação helper P11, +1 no bucket `helpers`, `Deviation:` no corpo, não-consumo de `max_loops`, 2ª falha → P4 com header persistido e corpo `RETURN AUSENTE — <motivo>`. Nada foi revertido, enfraquecido ou re-arbitrado. O que mudou é exclusivamente o **status**, pela cláusula-cabeça de R1 aplicada uniformemente (mesma régua que mantém D2/D11 OPEN) — e tradução verdict→status é precisamente a jurisdição que a system-view delega à row `mapa-verdict-status` (dono nomeado: autor do engineer-view). O gate nomeado ("a mesma spec do tipo, casa R-11") é encaminhamento sourced: a discovery §7 (tabela, linha 1) já roteia o "re-ask capeado" para a spec do research/SKILL.md. **Dentro do mandato.**

### M2 — [MÉDIA] R4 promulga doutrina P10 nova numa frase — excesso pontual dentro de decisão delegada legítima

- **Onde:** regra de tradução, R4: "sob P10 (claim ≤ proof), propor construir o campo morto **obriga** a citar e derrubar o KILL bancado; ignorá-lo é **violação verificável hoje**".
- **O que é legítimo:** decidir que KILL → RESOLVED (banking satisfaz "enforced" da legenda do consumidor para o objeto de re-abertura) é exatamente a decisão que a system-view delega à row ("'RESOLVED-negativo' não é valor do conjunto fechado...; status legal a decidir pela row") — a fundamentação da assimetria que l1c C1 cobrou foi escrita. Tradução, não legislação.
- **O excesso:** a frase citada não traduz — **legisla**. P10 em disco é uma linha ("Claim ≤ proof in every artifact produced", l.134); dela não se extrai, sem promulgação nova, uma obrigação procedural vinculante sobre atores futuros ("obriga a citar e derrubar") nem um tipo de violação ("violação verificável hoje") que nenhuma lei citada enuncia nesses termos. O próprio documento declara "registra gates, não os abre" e "leis... nunca re-adotadas" — esta frase abre um gate constitucional por interpretação. A tradução só precisa do enunciado fraco: *para a legenda do consumidor, o findings bancado conta como gate vigente do objeto de re-abertura*.
- **Correção mínima:** rebaixar a frase de obrigação a interpretação declarada da legenda (e.g. "leitura desta row: sob P10, uma proposta que ignore o KILL bancado é confrontável citando o findings congelado — interpretação para fins de tradução de status, não regra nova"), sem mudar verdict/status de D1/D21.

### M3 — [MÉDIA] D11 adjudica uma fatia do regime de intervalo cujo registro é D7 e cujo dono é externo

- **Onde:** D11, célula de status: "até lá o carimbo **vale como prática sem deviation**".
- **Fato:** o regime pré-emenda (se prática-antes-da-emenda-3 exige deviation) é a row D7 — OPEN, dono nomeado: **quem redigir a emenda 3**; a discovery §6 registra a recomendação como revisável e diz "silêncio ≠ permissão", "nada promulgado". D11 declara um regime de intervalo em voz assertiva, não como registro do default. A defesa existe — o findings #9 dá à metade-carimbo verdict **GO** (não GO-condicional; nenhuma cláusula de deviation anexada, contraste declarado pela discovery §4.6), e a system-view o narra como "GO desde já, sem deviation" — mas essa defesa cobre a **emissão do carimbo** (verdict da própria D11), enquanto a **exigibilidade** do consumidor (item (vi), [NOVO]) é exatamente a fatia que D7 encaminha ao dono externo. Como escrita, a célula deixa um leitor concluir que o regime do intervalo do item (vi) já está adjudicado aqui — se o dono de D7 decidir deviation-uniforme, a célula de D11 estará errada sem ter declarado a dependência.
- **Correção mínima:** demarcar na célula: "a emissão do carimbo é GO sem condição (findings #9); o regime de exigibilidade do item (vi) no intervalo é D7 (dono externo)".

### M4 — [BAIXA — OMISSÃO] R-14 empurra à spec uma decisão do próprio mandato de registro

- **Onde:** convenções do inventário + R-14: "adoção de âncoras explícitas por row é **escolha da spec**".
- **Fato:** a âncora pública das rows é mecânica de REGISTRO do próprio inventário — superfície que este documento possui ("Possui: as 21 rows... e o residue ledger"). A spec do tipo (research/SKILL.md) é dona do contrato por edge, não da formatação da tabela de decisões deste folder. Deferir a uma casa externa uma escolha sobre a própria superfície é a direção omissão do gate: decisão do mandato deixada sem dono efetivo (a spec não tem jurisdição natural para editar engineer-view.md). l1a V2 sugeriu o encaminhamento como UMA das duas saídas; a outra (qualificar e decidir aqui) era a que fica dentro do mandato.
- **Correção mínima:** ou decidir aqui ("convenção de string é a forma adotada desta view; âncoras HTML só em evolve futuro") ou re-endereçar o encaminhamento ao dono certo (o próprio autor do engineer-view, próximo evolve), não à spec.

### M5 — [BAIXA] A extensão de R4 a freezes alarga o escopo da regra além do anunciado

- **Onde:** R4, última frase: "A mesma interpretação cobre *freezes* cujo enforcement é lei já vigente em disco".
- **Fato:** freeze com lei vigente em disco é caso da cláusula-cabeça de R1 — não precisa do banking. Rotulá-lo "a mesma interpretação" (R4) cria uma porta: um freeze futuro SEM lei vigente poderia pleitear RESOLVED via R4-banking, lendo a frase como precedente. D21 mitiga (cita "R1 + R4"), mas a regra — que é legislação própria desta view (D15) e portanto sua responsabilidade de precisão — admite a leitura larga. Fricção de escopo de regra, não de tradução errada.
- **Correção mínima:** "freezes cujo enforcement é lei vigente resolvem por R1; R4 cobre apenas a metade-negativa bancada".

## Verificações que PASSARAM (refeitas, não aceitas)

- **R1–R5 como um todo (gate c): tradução legítima, não legislação de outra casa.** A divergência deliberada da proposta da discovery §7 (GO → OPEN-com-gate, não RESOLVED) é exatamente a decisão que a discovery marca "PROPOSTA... a validar pelo autor do engineer-view" e que a system-view nomeia como tensão U2 da row delegada. R5 ("CRITICAL reservado a bloqueio de tese") segue a legenda do consumidor verbatim (SKILL l.188), não inventa critério. "LEI → não vira row" adota a proposta da fonte. Ressalvas: só M2/M5 acima.
- **OPENs 6.1–6.3 não fechados:** D10 (dono externo nomeado), D12 (aguarda consumidor não-circular), D3 (aguarda medição) — três rows registro+encaminhamento, nenhuma adjudicada; constatações adicionais (appender valida só a row) são fatos citados, não fechamento.
- **Nenhuma emenda §5 tratada como vigente:** D5/D9/D13/D20/D6 OPEN com gate = a emenda; runtime steps 3–5 declaram deviation/regime de intervalo; cross-reference map declara overlay ("nada aqui promulga lei").
- **Fechamento de OQ-SV-1 (OQ-EV-4): dentro do mandato** — a system-view nomeia o dono como "autor do engineer-view deste folder"; a des-PROVISIONALização e a correção 4-vs-5 são encaminhadas ao reconcile da system-view, nunca hand-patch.
- **Células multi-regime (D1, D5, D18): fiéis à system-view** — a própria system-view atribui os dois regimes de #12 a uma row ("a row é dona dos dois") e pareia #5+#6 / #10+#18 em stances únicas; a regra de desempate ("status mais restritivo") é decisão de tradução dentro de D15.
- **Gate "spec do tipo (casa: R-11)" nas seis rows:** deferir a casa editorial é necessário — a discovery §6 a declara escolha da spec; o gate é nomeado-não-localizado e o documento o declara.
- **OQ-SV-4:** mantida dispensa-sem-row, encaminhada à spec (dono que a fonte nomeia); nenhuma row inventada.

**Contagem: 5 itens — 1 adjudicação limpa (M1) · 2 MÉDIA (M2, M3) · 2 BAIXA (M4, M5). Nenhum BLOCK; nenhuma mudança de verdict/status exigida — as correções são de redação de fronteira.**

Dissent: sustento M2 como MÉDIA contra a leitura de que "fundamentar é livre dentro de decisão delegada" — fundamentação que cria obrigação verificável sobre terceiros ("obriga", "violação hoje") deixa de ser fundamentação e vira a coisa que o documento jura não fazer; mas registro que M2 não pede mudança de status algum, e que a contagem 3/18/0 sobrevive intacta a todas as correções propostas — quem ler M2 como pedido de re-tradução de D1/D21 leu errado.
