---
tags: [agents, dispatch, review, io-contracts, constitution, p9]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l3b-lei (skeptic, dispatch 2026-06-12-agent-io-discovery)
---

# Review L3b — consistência com a lei viva (discovery.md v0.3)

Gate único: consistência com a lei viva. Cinco perguntas: (a) contradição com P1–P14 ou §5; (b) emenda RECOMENDADA tratada como promulgada; (c) divisão de lei (router = quando/universais; type skill = julgamento; register-dispatch = form; constituição = definições) respeitada nas casas do §6; (d) o ERRATUM D2/A14 corretamente caracterizado e corrigido na casa certa; (e) reivindicação sobre "o que a constituição manda" sem sustento no texto. Método: leitura integral de `subagents-strategy-constitution-proposal.md` (v0.5.2-proposal), `.claude/skills/domainspec-subagents-strategy/SKILL.md`, `.claude/skills/research/SKILL.md`, `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` e do findings; resolução de cada citação de lei da discovery contra a linha citada.

## Achados

### T1 — MAJOR — (b) Racional do regime pré-emenda do checklist (§5 abertos) é verificavelmente falso contra as tags do próprio findings

- **Trecho:** §5 abertos, bullet 1: "Recomendação (desta discovery, revisável pela spec): nenhuma deviation no intervalo — **o checklist verifica leis e definições já vigentes** e o próprio close do findings já o aplicou uma vez".
- **Lei/fonte:** findings §4 Close — os 6 itens carregam tags de proveniência que a própria discovery declara load-bearing em 3.6 ("com as tags [P9]/[LEI verificada]/[NOVO] que qualquer paráfrase perde"). Itens (iii) e (vi) são tagueados **[NOVO]**: (iii) policia a rota F* que é GO-condicional pendente da emenda P9 (arbitragem 2), (vi) é a metade GO do split #9 — **aquisições deste dispatch**, não "leis e definições já vigentes".
- **Desvio:** a recomendação está corretamente demovida (revisável, autoria marcada, regime atribuído a quem redigir a emenda 3) — não é promulgação. Mas o racional que a sustenta só cobre os itens (i)/(ii)/(iv)/(v); para (iii)/(vi) ele é falso, e é exatamente o racional que o redator da emenda 3 vai herdar ao decidir o regime. "Nenhuma deviation no intervalo" apoiado num "verifica só lei vigente" falso é o caminho mais curto para a emenda 3 virar promulgada de fato — a falha que o gate (b) existe para pegar.
- **Correção:** restringir o racional ("os itens [P9]/[LEI verificada] verificam lei vigente; os dois itens [NOVO] verificam aquisições deste dispatch e precisam de história própria no intervalo — no mínimo herdam o regime de deviation da rota que policiam, caso do (iii)"), mantendo a recomendação como está ou rebaixando-a a itens-vigentes-apenas.

### T2 — MODERATE — (a)/(e) "espelho sancionado por P3" não é o que P3 escreve — e a frase final de P3 lê CONTRA o espelho

- **Trecho:** §3.7, row "`dispatch_id` + `schema_version` no frontmatter do findings — **espelho sancionado por P3**; fonte de verdade = row"; alimenta a emenda 5 (§5 Dependências; §6 row do cheatsheet).
- **Lei:** P3 (linha 121) manda reportar **o outcome** ("The outcome is additionally reported in chat (1–2 sentences) and in the findings document") — e fecha com "**No other persistence surface exists for dispatch metadata.**" `dispatch_id`/`schema_version` não são outcome; um espelho deles em frontmatter é, na letra, metadado de dispatch persistido fora do registry.
- **Desvio:** herdado do findings #14 ("espelho = relato sancionado por P3") — a discovery codifica com citação, dentro do mandato. Mas a discovery ADICIONA a emenda 5 como dependência da spec, e nem ela nem o findings confrontam a cláusula de superfície-única de P3 que a emenda institucionalizaria. A defesa existe (espelho = relato, não superfície; fonte de verdade = row; nenhuma migração lê o frontmatter — K6), só que precisa ser feita CONTRA a frase final de P3, não apresentada como sanção limpa de P3.
- **Correção:** na row de 3.7 e na emenda 5 do §5: "espelho lido como relato (P3 manda reportar no findings doc), leitura a defender contra a cláusula 'no other persistence surface exists for dispatch metadata' de P3 — a emenda 5 deve confrontá-la explicitamente". Mesmo padrão do erratum A14: hipótese herdada confrontada com a letra, não repetida.

### T3 — MODERATE — (c) Casa do bucket `helpers` no §6 está meio-errada: `agents_spawned` (com o bucket) É campo da close row, não só relato de corpo

- **Trecho:** §6, row "Bucket `helpers` em `agents_spawned` + `Deviation:` de re-ask | **relato no corpo do close** (findings §4 Close, T2)...".
- **Lei:** constituição §5 `agents_spawned` — "close row + reported", exemplo com `helpers: 0` na árvore; register-dispatch §close row — `agents_spawned` é campo **required**, JSON column, "tree (keyed by role-category, **helpers in their own bucket**)". O próprio §3.4 da discovery cita essa base corretamente.
- **Desvio:** a célula de casa funde duas coisas com casas distintas: o bucket `helpers` (mora na close row JÁ HOJE, schema-suportado, nenhuma mudança necessária — e também no relato de corpo) e as linhas `Deviation:`/`Accepted-unreviewed:` (corpo-apenas, pelo erratum). Como escrita, a row autoriza uma spec a tratar a contagem de helpers como corpo-apenas e subpreencher a árvore da row — regressão exata do furo de contabilidade que a arbitragem 1 fechou (l3b T3 do findings).
- **Correção:** dividir a célula: "bucket `helpers`: close row `agents_spawned.tree` (já no schema; espelhado no relato de corpo, P3) · linhas `Deviation:`/`Accepted-unreviewed:`: CORPO do close apenas (erratum A14)".

### T4 — MINOR — (e) "recebendo apenas o working_folder (P12)" — P12 dá um piso, não um teto

- **Trecho:** §1 Why now: "o `final_approver` cheque isso **recebendo apenas o working_folder** (P12; research.md §E3, premissa de executabilidade)".
- **Lei:** P12 (linha 136): "The approver receives the **full** `working_folder`" — garantia de completude (para o check P9 ser acionável), não restrição de exclusividade. Para `final_approver: parent` (o default), o approver é a sessão estrategista, que tem a conversa inteira — "apenas" é literalmente falso nesse caso.
- **Desvio:** o "apenas/nunca digest" é a premissa anti-resumo de E3 (findings §4 edge 3 a deriva de P12 + E3 evidência (b)); atribuí-la à letra de P12 é overread. Pequeno, mas é o tipo de citação que a spec copia como lei.
- **Correção:** "recebendo o working_folder completo (P12), e nunca um digest no lugar dele (research.md §E3, premissa de executabilidade)".

### T5 — MINOR — (d) ERRATUM A14: caracterização CORRETA e casa certa — verificado; um reforço disponível

- **Verificação:** o §5 da discovery cita a tabela fechada da close row exatamente como está em `register-dispatch/SKILL.md` §"Closing a dispatch" (`close_of`, `exit_reason`, `agents_spawned`, `feedback_prompts`, `invoked_by`, `project_dir`, `closed`; "any other key not in this table — unknown keys are rejected (exit 2)") — **não existe campo de desvios**; a hipótese de A14 é refutada como a discovery diz. A correção mora na casa certa: corpo do close por default, OU campo novo declarado com a mudança de schema + appender que isso implica (form = register-dispatch), com propagação do erratum ao findings/às emendas. O D2 da trilha L2 está integralmente absorvido — sem resíduo.
- **Reforço (não é desvio):** a refutação está apoiada só no schema do tooling, o que deixa A14 legível como "lei que o tooling ainda não implementa". A constituição §5 "Close of dispatch" tampouco lista campo de desvios (só `exit_reason` + `agents_spawned` são portados pela row) — citar isso junto fecha a leitura: a hipótese não tem lastro nem na lei nem no tooling.

### T6 — MINOR — (c) Derivação de `<label>` na spec do research: casa defensável, mas com a dívida cross-type já conhecida não marcada

- **Trecho:** §3.2 + §5 abertos: a spec (research/SKILL.md, pela casa do §6) fixa a derivação canônica do `<label>` "determinística de grupo + índice da row na sheet".
- **Análise de divisão:** a alocação respeita a lei — `<label>` é convenção de nomeação de artefato (headers do research.md), julgamento de tipo; a proposta lê a sheet mas não cria campo (não invade constituição §5 nem register-dispatch). Correto.
- **Desvio (menor):** `review` reusa os quatro roles do research (constituição §5 `dispatch_type`, nota de promoção) e produzirá os mesmos headers de return; um esquema de label fixado só no research/SKILL.md abre a mesma dívida cross-type que a discovery JÁ marca para o item (iv) do checklist ("dívida da review/SKILL.md com ponteiro") — mas não marca aqui.
- **Correção:** uma linha no aberto de `<label>`: "mesma disciplina do item (iv): a spec do research fixa a derivação e registra a dívida-ponteiro para review/SKILL.md".

## Verificações limpas (gate-relevantes, sem achado)

(a) Nenhuma contradição direta com P1–P14/§5 encontrada: 3.4 (re-ask helper) cita §5 `agents_spawned` como base do bucket E declara a tensão interna P11-vs-§5 com a leitura adotada ("sem dispatch row própria") marcada como a-confirmar — o D5 da L2 está aplicado; "não consome `max_loops`" bate com §5 ("a re-run fires only when the final_approver rejects"). (b) 3.5 ("GO-condicional NÃO é GO"), 3.6 (emenda candidata), §5 Dependências ("recomendadas, não promulgadas") e §6 ("nunca apresentar 3.5 como adquirido") estão limpos — o único furo é o racional de T1. (c) Demais casas do §6 corretas: contratos/checklist/condensação/shape → research/SKILL.md §Outputs (a frase-âncora "for research, acceptance includes the P9 citation check" existe lá, verificada); extensão de citabilidade → constituição P9 + espelho §5 `working_folder`, com o rito de governança separado do veículo-spec; LEIs permanecem onde moram. (e) Verificadas e sustentadas: o teorema skill §Tension design ∘ verbatim (ambas as metades existem no skill); a citação literal de P9 em 3.5; a defesa do checklist contra o corte de `final_approver_criteria` (§7, "the approver field alone carries the mandate"); a contagem GO 10 · GO-cond 3 · LEI 2 · OPEN 1(+3=3 distintos) · KILL 2 contra a linha de contagem do findings; e a claim factual da emenda 5 ("o node_type já existe no enum; os campos não") — `subagents-findings` confirmado no enum do cheatsheet, sem `dispatch_id`/`schema_version`.

## Contagem

6 achados: 1 MAJOR (T1) · 2 MODERATE (T2, T3) · 3 MINOR (T4–T6). T5 é confirmação do gate (d) com reforço opcional.

Dissent: prevejo discordar de quem descartar T2 como "herdado do findings, fora do mandato da discovery" — a discovery promoveu o espelho a dependência de spec (emenda 5) e com isso assumiu o ônus de confrontar a cláusula de superfície-única de P3, exatamente como fez com A14; e de quem rebaixar T1 a wording: o racional falso é a única sustentação do regime sem-deviation, e regime de intervalo apoiado em racional falso é como emenda recomendada vira promulgada na prática.
