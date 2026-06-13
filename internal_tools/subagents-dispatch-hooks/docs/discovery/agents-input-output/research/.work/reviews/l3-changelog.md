---
tags: [agents, dispatch, research, io-contracts, p9, review, changelog]
node_type: subagents-research
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: synthesizer
---

# L3 changelog — draft-v3 → findings.md final (dispatch 2026-06-12-agent-io-contracts)

Fontes: `.work/reviews/l3a-constituicao.md` (K1–K8), `.work/reviews/l3b-tooling.md` (T1–T7), `.work/reviews/l3c-determinismo.md` (A1–A14). Lei contestada re-verificada antes da decisão: constituição P4 (linha 122), P9 (133), P11 (135), P12 (136), §5 `max_loops` (179–184), §7 cortes (515, 528); register-dispatch/SKILL.md (padrão `invoked_by` "pending a one-line constitutional amendment", 2×).

## APLICADAS (27 ids)

1. **K2 + T1 (o pior item de L3, fundidos)** → extensão de P9 reclassificada: GO → **GO-condicional, "pende emenda de uma linha em P9" no padrão `invoked_by`** (alvo nomeado: constituição linha 133 + espelho §5 `working_folder`); até a emenda, deviation declarada por dispatch; **guard anti-auto-citação obrigatório** (F-seções = alvo de citação para vereditos de reviewer, nunca prova terminal; toda F-claim carrega citações E* próprias). O findings RECOMENDA a emenda (§5.1); não a promulga. Sem isso o item (i) do próprio checklist reprovava o mecanismo F* — o contrato fabricava não-conformidade consigo mesmo.
2. **K3 + T3 (a única contradição, fundidos)** → canal re-ask reescrito — ver arbitragem 1.
3. **K1** → corte de `final_approver_criteria` (§7, linha 515) confrontado explicitamente na síntese — ver arbitragem 3 (checklist defendido, não demovido; reclassificado emenda candidata ao skill).
4. **K4 + A7** → carimbo de condensação obrigatório: `[condensado: <motivo>; invariantes preservados; perda: <extensão>]`, executado SÓ pelo agente emissor; sem carimbo, P10 é violado pela própria rota sancionada. Lista de invariantes FECHADA (lei com cláusula aberta não é executável): IDs, âncoras, Dissent, posições — **severidades resolvidas FORA da lista obrigatória** (critério soberano do próprio draft: nenhum check nomeado as lê; recomendadas, não exigidas).
5. **K5** → linha no registro OPEN da taxonomia: promoção futura deve confrontar o corte de `grade` (§7, linha 528) além de produzir consumidor não-circular.
6. **K6** → espelho declarado EM TERMOS DE P3: relato sancionado ("reported... in the findings document"), fonte de verdade permanece a row, nenhuma migração lê o frontmatter.
7. **K7** → demoção do shape literal reclassificada como emenda candidata ao skill `research` §Outputs ("matriz OU shape equivalente preservando os invariantes"), não lei já demovida; combinada com A13 (matriz como default).
8. **K8** → ângulo no header: obrigatório **iff n ≥ 2 no grupo; omitido em n = 1** — espelhando a condicional do §5 `angle` (linha 351).
9. **T2** → (a) arbitragem A4 do draft reescrita como **concessão parcial** (o consumidor mecânico existe na casa canônica — a row; o espelho permanece sem leitor, GO menor por isso mesmo); (b) `exit_reason`/`agents_spawned`/desvios movidos do frontmatter para o **corpo** (seção de close), onde o router já manda reportar; frontmatter fica só com `dispatch_id` + `schema_version`, declarados como emenda pendente ao cheatsheet de frontmatter (§5.5).
10. **T4** → checklist escopado: título "aceitação para `dispatch_type: research`"; nota no item (iv): verifica lei do router (P14); verificação equivalente em `review` é dívida da review/SKILL.md.
11. **T5** → frase adicionada à abertura do §4: nenhum elemento dos contratos de corpo é validado por tooling — enforcement = checklist do approver + gate humano; validação mecânica confinada à row.
12. **T6** → registrado como acerto (modelo opcional com fonte canônica na row); nenhuma mudança.
13. **T7** → campo nomeado: `feedback_prompts` da close row (array JSON, verbatim — P3).
14. **A1** → esquema de ID default canônico `<label-do-header>#<n>` (contador por agente); briefing sobrescreve só com deviation declarada — adotado por mandato do dispatch (ver arbitragem 4).
15. **A2** → cláusula de aplicabilidade n=1, na forma alinhada a P9 (ver REJEITADAS-parcial 1): edge 1 sempre; edges 2–5 iff n ≥ 2; itens vacuosos do checklist = `N/A — role ausente`, distinto de PASS.
16. **A3** → definição executável de claim load-bearing em 3 cláusulas (célula da matriz; sustenta a resposta de 1 linha; remoção mudaria um verdict); quantificadores de §1 e do close alinhados (a obrigação é das load-bearing, não de toda claim).
17. **A4 (l3c)** → formatos de âncora fechados: `caminho-relativo:linha` | `arquivo §seção` | `URL`; mínimo 1 âncora por claim-ID; prosa livre não conta.
18. **A5** → `<nome>` do header = label do agente na sheet congelada; ordem de montagem = ordem das rows da sheet.
19. **A6** → gatilho de imutabilidade desambiguado: o momento do persist; citação irrelevante para o gatilho (coerente com F11: o que protege a cadeia é a persistência).
20. **A8** → disciplina de ID entre rounds/turnos: contador contínuo por agente, ID nunca reutilizado; revisão referencia o superado (`supersedes E1#4`); ID antigo citável como superseded.
21. **A9** → return ausente coberto: header SEMPRE persiste, corpo `RETURN AUSENTE — <motivo>` + deviation na close row; cap de re-ask fundido na arbitragem 1.
22. **A10** → token sancionado para dissenso vazio: `Dissent: none — <razão de uma linha>`; veredito do reviewer exaustivo por TODO ID alheio; namespace vazio declarado (`Novas claims: nenhuma`).
23. **A11** → posições inicial/final: duas linhas rotuladas (`Posição inicial:` / `Posição final:`), 1 linha cada, imediatamente antes do `Dissent:` — item (iv) vira grep, não juízo.
24. **A12** → vocabulário de veredito fechado: `{UPHELD, REFUTED, DOWNGRADED→<alvo>}`, caixa alta, alvo obrigatório no downgrade.
25. **A13** → alvo do determinismo declarado: identidade de INVARIANTES, não de bytes; matriz como shape default do findings, shape equivalente só com deviation declarada.
26. **A14** → linhas fixas de declaração na seção de close: `Accepted-unreviewed: <ID> — <razão>` e `Deviation: <o quê> — <razão>`, espelhadas no campo de desvios da close row.
27. **Estrutural** → matriz reorganizada nas 5 categorias finais (GO 10 · GO-condicional 3 · LEI 2 · OPEN 1+3 resíduos · KILL 2); seção de emendas recomendadas criada (§5, cinco superfícies exatas); trilha de revisão condensada (§8).

## REJEITADAS (2 parciais; nenhuma integral)

1. **A2, forma literal** ("edges 1, 2 e close aplicam sempre que um subagente foi gerado") — parcialmente rejeitada: edge 2 cria research.md, e P9 literal manda **n = 1 produzir um único arquivo, findings.md**. Adotada a substância (cláusula de aplicabilidade) na forma compatível com a lei: edges 2–5 iff n ≥ 2; em n = 1 os invariantes de envelope valem DENTRO do findings.
2. **K3, opção remoção** (re-ask eliminado, P4 puro) — rejeitada em favor da opção capeada que o próprio K3 oferece como alternativa: o caso Dissent (E1 ev. 4) é sinal recuperável por um re-ask barato; P11 já fornece bucket sancionado e freio por relato. Ver arbitragem 1.

## ARBITRAGENS (6)

1. **K3 (l3a: contradição com P4/max_loops) × T3 (l3b: furo de contabilidade nos dials)** → **opção (b)**: re-ask capeado em **1 por agente**, classificado **helper invocation (P11)**, contado **+1 em `agents_spawned.total` (bucket `helpers`)**, registrado como `Deviation:`, **não consome `max_loops`**; segunda falha ou return ausente → **P4 partial group result** (header persiste, `RETURN AUSENTE`). Fecha a contradição de l3a (o canal agora tem teto e desemboca em P4) e o furo de l3b (bucket declarado) com uma única regra.
2. **K2 (l3a: rota de governança + guard) + T1 (l3b: superfície não nomeada) vs dissenso l3a×l3b sobre o TAMANHO do processo** → adotado o **padrão `invoked_by` de l3b** (emenda de uma linha, pendente, declarada) — é o precedente que o próprio tooling pratica e que a constituição §9 já rastreia; l3a obteve o guard anti-auto-citação e a declaração de pendência; a exigência implícita de processo pleno antes de qualquer uso fica satisfeita pela deviation declarada por dispatch.
3. **K1 (re-introdução de `final_approver_criteria`?)** → **defendido, não demovido**: o corte §7 removeu um campo por-dispatch PREENCHÍVEL (família `success_metric` — convida vácuo); o checklist é a definição executável da checagem P9 que P12 já manda o approver fazer, lei fixa do tipo, não preenchida mas executada, escopada na research/SKILL.md. Preço da defesa: reclassificado emenda candidata ao skill (não aquisição auto-sancionada) + escopo de T4.
4. **A1 (default de ID) vs dissenso de l3a ("IDs obrigatórios = maquinário-sem-consumidor do §7")** → A1 adotado: o default vive no contrato/type skill, não na constituição; default-com-override-declarado não re-decide o edge do briefing (propriedade da §5) — torna a delegação determinística. O dissenso de E3 R1 sobre IDs em si permanece vivo na matriz (custo OPEN).
5. **A7 (membro OPEN na lista de invariantes) — severidades in ou out?** → **OUT** da lista obrigatória, pelo critério soberano do próprio draft (nenhum check nomeado as lê; leitor inventado não conta); recomendadas, não exigidas. A lista vira fechada e executável, como A7 exige.
6. **Mecanização (dissensos cruzados l3a×l3b×l3c: checklist vs script vs linter)** → **NÃO arbitrado — OPEN de owner** (§6.1 do findings), com as três posições registradas verbatim em substância: l3a (checklist-não-script é o único default constitucionalmente seguro até emenda — corte do validator §7), l3b (enforcement split do appender é lei de desenho; mecânica confinada à row até testemunha que um checklist lido não pegue), l3c (textual primeiro, mecânica só onde o vocabulário fechou; "sustenta a claim" é inferramentável por construção). Decisão pertence a quem é dono do corte do validator v0.3.0, não a esta síntese. Default operacional enquanto aberto: checklist.

## Estado final da matriz (18 linhas)

GO 10 (header; IDs-design-decision; âncora; envelope; checklist-close; append-only; output do reviewer; frontmatter menor; shape-invariantes; input congelado) · GO-condicional 3 (tier: carimbo GO + taxonomia OPEN; verbatim: LEI + emenda de condensação; draft persistido: pende emenda P9) · LEI 2 (Dissent persistida; pares P14) · OPEN 1 linha (validação de envelope na coleta) + 3 resíduos (mecanização — agora OPEN de owner com 3 posições; taxonomia 4-valores + confronto de `grade`; custo de IDs) · KILL 2 (schema do corpo epistêmico; `round` obrigatório). Resíduo de L2 fechado: severidades-na-lista (resolvidas OUT, arbitragem 5).
