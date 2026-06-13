---
tags: [agents, dispatch, research, io-contracts, review, skeptic, tooling, division-of-law]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l3b
---

# L3b — Review de integração (tooling + divisão de lei) — draft-v3.md

Dispatch: 2026-06-12-agent-io-contracts. Artefato: `.work/drafts/draft-v3.md`. Gate único: compatibilidade com o tooling real (appender v0.5.2, hooks) e com a divisão de lei (form = `register-dispatch`; definições = constituição §5; julgamento = type skill `research`; roteamento = router). Fontes verificadas no disco: `register-dispatch/SKILL.md` + `append-dispatch.cjs` (a validação real, linhas 94–263), `.claude/skills/domainspec-subagents-strategy/SKILL.md`, `.claude/skills/research/SKILL.md`, `subagents-strategy-constitution-proposal.md` §4 (P9, linha 133; P12, P14), `.claude/skills/custom/frontmatter.md`.

## Resposta direta às perguntas do gate

**Alguma recomendação exige campo novo no schema v0.5.2 ou mudança no appender?** NÃO — verificado linha a linha contra `DISPATCH_KEYS`/`CLOSE_KEYS`/`GROUP_KEYS`/`AGENT_KEYS` do `append-dispatch.cjs`. Headers, IDs de claim, âncoras, Dissent, carimbo `not-re-reviewed`, append-only, draft do synthesizer, pares inicial/final no return — tudo é convenção de CONTEÚDO de artefato markdown que nenhum tooling lê. O briefing enriquecido (expected return: caminho, headers, esquema de ID, posição da Dissent) viaja DENTRO de `initial_prompt`, string livre já obrigatória no schema — zero campo novo, coerente com o próprio KILL do draft para input estruturado. `feedback_prompts` na close row já existe como coluna JSON opcional. O espelho `schema_version` reusa valor de campo existente da row. **O draft passa limpo neste sub-gate.** As exceções estão em superfícies que NÃO são o appender — T1 e T2 abaixo.

**O contrato cabe inteiro na type skill?** ~90% sim. O encaixe é até elegante: a research/SKILL.md declara "this skill defines no field; it says which **values** a good research dispatch puts in them" — o contrato de briefing é exatamente isso (values de `initial_prompt`), e o checklist do approver expande a frase já existente "for research, acceptance includes the P9 citation check" (§Outputs). Os ~10% que escapam: a extensão da definição de research.md (T1) e o frontmatter do findings (T2). O draft declara a primeira pela metade e a segunda não declara.

## Itens

**T1 — A extensão "P9 de research.md" exige emenda constitucional de uma linha e o draft não nomeia a superfície. O pior item.**
Recomendação: draft do synthesizer persistido com IDs `F*` como seção append-only de research.md, citável pelo findings (§2 linha 12; §4 edge zig-zag) — "estende a definição P9 de research.md, declaradamente: de 'returns coletados' para 'returns coletados + camada de síntese append-only' (l2c D8)".
Superfície afetada: constituição §4 P9, texto literal (linha 133): "the collected returns (research) ... **every load-bearing claim in the findings cites the collected return it rests on**, and the `final_approver` checks this". Uma citação `F11` resolve para a camada de síntese — que NÃO é um collected return. Sob o texto vigente, um findings que cita `F*` FALHA a checagem P9 literal que o próprio contrato manda o approver executar (item (i) do checklist). O contrato, como escrito, fabrica não-conformidade consigo mesmo.
Conflito: o draft declara a EXTENSÃO mas não declara o ALVO da emenda. "Declaradamente" sem nomear onde a lei muda é meia honestidade: o leitor não sabe se isso é gloss de type skill ou ato constitucional. A type skill não pode absorvê-la sozinha — ela mesma diz que P9/§5 são de fora ("Route back there; nothing here overrides it"), e §Outputs da skill apenas RESTATEia P9.
Correção mínima: nomear o alvo seguindo o precedente já existente no próprio tooling — `invoked_by` está no appender com a anotação "tooling-level extension, not in constitution §5, **pending a one-line constitutional amendment**" (SKILL.md do register-dispatch, 2x). A linha da matriz e o §4 do draft ganham a mesma cláusula: "GO condicionado a emenda de uma linha em P9 ('collected returns + append-only synthesis/zig-zag sections'), pendente; até lá, deviation declarada por dispatch". Custo: uma frase. Compra: o contrato para de mandar o approver reprovar o próprio mecanismo que o contrato institui.

**T2 — O espelho `schema_version`/`dispatch_id` no frontmatter: A4 sobrecorrige l2b O2, e a superfície frontmatter-schema não é declarada.**
Recomendação: frontmatter do findings com `dispatch_id` + `schema_version` (GO menor); o edge close acrescenta `exit_reason + agents_spawned + desvios` ao frontmatter.
Superfície afetada: duas. (a) A retórica de A4: "l2b O2 rejeitado por evidência factual... Falso: o appender valida schema_version estritamente". Verificado no código: o appender valida `rec.schema_version` do RECORD da row (linha 139 do .cjs) e nada mais — nenhum código, hook ou script lê frontmatter de findings.md. A afirmação de l2b ("nenhum check nomeado lê schema_version" *do frontmatter*) permanece VERDADEIRA para o espelho; A4 a refuta provando consumidor da casa canônica, que l2b não negou. O resíduo do draft ("o appender lê a row, não o frontmatter") admite exatamente isso — então "rejeitado por evidência factual" é o rótulo errado para o que foi, no mérito, uma CONCESSÃO parcial com demoção a GO (menor). Um typo `"0.52"` no frontmatter não é pego por nada, hoje nem no plano. (b) Superfície não declarada: o schema de frontmatter do vault (`.claude/skills/custom/frontmatter.md` — "every field, every value") não contém `dispatch_id`, `schema_version`, `exit_reason`, `agents_spawned` nem `desvios`, e um hook PreToolUse injeta esse cheatsheet em TODO Write/Edit de .md. O contrato institui cinco campos de frontmatter fora do schema vigente sem dizer que o cheatsheet precisa de uma seção por `node_type: subagents-findings` (o node_type, esse sim, já existe no enum).
Correção mínima: (a) reescrever A4: "concessão parcial — consumidor mecânico existe na casa canônica; o espelho permanece sem leitor, GO (menor) por isso mesmo"; (b) uma linha declarando a emenda ao cheatsheet de frontmatter (campos extras permitidos/listados para `subagents-findings`) como segunda superfície tocada — ou mover `exit_reason`/`agents_spawned`/`desvios` para o corpo do findings, onde o router já os manda reportar ("in chat and in the findings doc", passo 4) sem prescrever frontmatter.

**T3 — O canal re-ask não declara relação com os três dials nem com a contabilidade de `agents_spawned` que o appender valida.**
Recomendação: edge 2 — "checklist de envelope na coleta... falha → re-ask ao agente".
Superfície afetada: router ("Três dials, três escopos — one scenario, one dial; if two seem to fit, the smallest scope wins") e a close row (`agents_spawned: {total, tree, loops_used}` — `loops_used` é REQUIRED e validado pelo appender, exit 2).
Conflito: re-ask é re-invocação. É um loop (conta em `loops_used` sob `max_loops`)? É um helper (P11 — reportado em `agents_spawned` sem row)? O agente re-perguntado conta uma ou duas vezes em `total`? O contrato cria um canal de re-execução fora da taxonomia de dials sem dizer em qual bucket cai — exatamente o tipo de furo que o "one scenario, one dial" do router existe para fechar. Se re-asks forem não-contados, o teto de `max_loops` ganha um bypass não-auditável; se contados, ótimo, mas alguém tem que escrever a regra antes do primeiro `exit_reason: loop_ceiling_reached` disputado.
Correção mínima: uma linha no edge 2 — proposta: "re-ask de envelope malformado não é loop de sequência (não consome `max_loops`); o agente re-invocado conta +1 em `agents_spawned.total` e o re-ask é registrado nos desvios do findings". Qualquer regra serve; a ausência de regra não.

**T4 — Checklist de 6 itens: mora em research/SKILL.md §Outputs, e o encaixe é quase perfeito — falta só escopá-lo.**
Recomendação: checklist do approver (§3, colisão 1).
Superfície afetada: research/SKILL.md. Encaixe: a skill JÁ diz "per §5, `resolved` = the `final_approver` accepted; for research, acceptance includes the P9 citation check" — o checklist é a expansão dessa frase em 6 itens, no lugar onde ela já mora. Não é form (register-dispatch não o quer: o appender valida row, não aceitação), não é roteamento (o router define QUE existe approver — P12; o QUE a aceitação research checa é type judgment). Os itens (ii)/(iv) re-enumerarem lei alheia com fonte anotada é compatível com a divisão: verificação ≠ propriedade, e o draft anota as fontes — bem resolvido.
Conflito residual: item (iv) verifica P14, invariante UNIVERSAL do router — alojá-lo só na research skill deixa um `review` dispatch com robot_talks sem o check (a review/SKILL.md tem sua própria disciplina de verificação e não recebe este contrato). Não é bug deste dispatch (escopo = contratos research), mas sem escopo explícito o checklist parece reivindicar propriedade universal a partir de uma type skill.
Correção mínima: titular o checklist "aceitação para `dispatch_type: research`" e uma nota: "item (iv) verifica lei do router; a verificação equivalente em `review` é dívida da review/SKILL.md".

**T5 — Carimbos e namespaces: compatíveis por vacuidade — e isso deve ser dito como limite, não como bênção.**
Recomendação: `not-re-reviewed`, namespaces `E*/F*/N*`, headers `## E<n> — <nome> (<ângulo>)`, seções `(round N)`.
Superfície afetada: nenhuma — e esse é o ponto. Os únicos enforcement points reais do sistema são: o appender (valida rows), o hook append-only (bloqueia edição do ledger) e o hook de frontmatter (injeta cheatsheet em .md). NADA parseia corpo de research.md/findings.md. Os carimbos não conflitam com artefato algum que appender/hooks esperam — porque appender/hooks não esperam artefato nenhum além do YAML.
Conflito: nenhum hoje; o risco é retórico — o draft deve manter "validado mecanicamente" estritamente confinado ao nível da row (o resíduo de A4 já faz isso; T2 pede que A4 inteiro faça). A consequência honesta: TODA a verificação dos carimbos/namespaces é juízo do approver via checklist — o contrato é executável por leitura, não por máquina, e isso é coerente com o corte do validator v0.3.0 que o próprio draft defende.
Correção mínima: nenhuma obrigatória; opcional, uma frase no §4: "nenhum elemento dos contratos de corpo é validado por tooling — o enforcement é o checklist do approver e o gate humano".

**T6 — Modelo opcional no header com 'fonte canônica: dispatch row': encaixe exato com o appender — registrar como acerto.**
Recomendação: matriz linha 1 + edge 2 (header com `<modelo — opcional/informativo; fonte canônica: dispatch row>`).
Superfície: `groups[].agents[].model` é REQUIRED no appender (linha 192 do .cjs) — a casa canônica existe e é validada de verdade. O contrato apontar para ela em vez de duplicar obrigação no header é exatamente a divisão de lei funcionando (form possui o dado; o artefato o espelha informativamente). Mesmo padrão correto no edge 1: "este edge é propriedade da constituição §5 — a tabela o referencia, não o re-decide". Nenhuma correção.

**T7 — Edge feedback: ligar o texto ao nome do campo da form layer.**
Recomendação: "prompt gravado na close row (P3)".
Superfície: o campo chama-se `feedback_prompts` (coluna JSON, array de strings, verbatim — SKILL do register-dispatch + .cjs linha 245). Compatível; mas o contrato que prega IDs estáveis e citação verificável deveria citar o campo pelo nome — "gravado na close row" sem o nome obriga o executor a arqueologia na form layer.
Correção mínima: "(campo `feedback_prompts` da close row — verbatim, P3)". Uma edição de seis palavras.

## Veredito do gate

Compatível com o appender v0.5.2 sem nenhuma mudança de schema (T5/T6/T7 confirmam; nenhum item exige campo). A divisão de lei é respeitada em ~90% do contrato e o encaixe na research/SKILL.md é genuíno (T4). As duas falhas de honestidade declarativa: T1 (a extensão de P9 é emenda constitucional de uma linha não nomeada como tal — e sem ela o checklist do próprio contrato reprova o mecanismo F*) e T2 (A4 vende como "rejeição factual" o que é concessão parcial, e os campos novos de frontmatter tocam o cheatsheet do vault sem declarar). Ambas têm correção de uma frase cada, no padrão `invoked_by` que o tooling já pratica.

Dissent: prevejo discordar de L3a (constituição) sobre o TAMANHO da emenda T1 — sustento que uma linha em P9 no padrão `invoked_by` basta e que a categoria LEI é contabilidade do dispatch, não ato constitucional exigindo re-confrontação §7; L3a tenderá a exigir processo pleno. E prevejo discordar de L3c (determinismo) sobre a colisão 3 e o espelho T2 — L3c tenderá a empurrar o checklist de coleta para script executável e o frontmatter para validação por hook; sustento que o enforcement split do appender ("NOT ENFORCED here — deliberate") e o corte do validator v0.3.0 são lei de desenho: validação mecânica fica confinada à row até existir testemunha interna de malformação que um checklist lido não pegue.
