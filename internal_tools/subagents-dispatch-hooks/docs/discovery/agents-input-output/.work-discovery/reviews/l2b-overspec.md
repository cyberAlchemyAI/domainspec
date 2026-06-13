---
tags: [agents, dispatch, review, overspec, altitude]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-discovery
role: l2b-overspec
---

# Review l2b — over-spec / altitude errada

Artefato: `discovery.md` (v0.2.0). Referências: `research/findings.md`, `subagents-strategy-constitution-proposal.md` §7 (linhas 506–531), `l1-changelog.md`. Gate único: a discovery deve ficar na altitude design space + decisões + porquês; formatos exatos, vocabulários fechados e textos de checklist pertencem à spec/type skill; nenhum processo novo sem witness; nenhum corte do §7 recriado sem confronto; §6 não decide o que é da spec.

**Veredito geral.** A discovery é majoritariamente disciplinada na altitude: §2 (design space), §4 (rejeitadas), §5 (OPENs) e a maior parte de §6 estão corretos. As checagens (c) e (d) saem quase limpas: os dois cortes do §7 tocados (`final_approver_criteria`, linha 515; `grade`, linha 528) são confrontados explicitamente (§3.6, §5.2), e o §6 marca como "hipótese a validar na spec" o único ponto onde quase decidiu por ela (row helpers). As violações encontradas são de duas famílias: **(1)** uma adição normativa própria em §3.6 que excede o mandato editorial declarado no preâmbulo, e **(2)** importação sistemática de literais de contrato do findings §4 — exatamente o material que o próprio §6 (row 1) atribui à spec como "texto novo derivado de findings §4" — para dentro do §3, criando uma segunda cópia divergível do texto que a spec vai redigir. Itens em ordem de gravidade.

## Itens

### O1 — §3.6 legisla o regime pré-emenda do checklist ("nenhuma deviation é exigida no intervalo") — decisão nova da discovery, derivada de silêncio

- **Trecho** (§3.6): "**Regime pré-emenda (diferente de 3.5):** o approver pode aplicá-lo desde já como prática [...] e nenhuma deviation é exigida no intervalo; a emenda 3 do §5 o **formaliza** como lei do tipo, não o destrava (regime enunciado por esta discovery a partir da arbitragem 3, que não anexa cláusula de deviation ao checklist — contraste com a arbitragem 2)."
- **Por que excede a altitude:** isto é uma ruling de governança de intervalo — se prática-antes-de-emenda exige deviation — **derivada do silêncio** da arbitragem 3 (ausência de cláusula ≠ permissão declarada). O findings não enuncia esse regime em lugar nenhum; o witness real (o close do findings aplicou o checklist) sustenta "foi aplicado uma vez", não "nenhuma deviation é exigida". Pior: o preâmbulo da v0.2 (correção V5/I5 da trilha L1) declara que as **únicas** adições próprias da discovery são "recomendações editoriais de housing e sequência (§5 'desta discovery', §6)" — o regime de 3.6 é uma adição própria normativa fora dessa lista, então o preâmbulo ficou falso na própria revisão que o consertou. Reconheço que o C3 da trilha L1 pediu o contraste 3.5-vs-3.6; a correção foi além do pedido: o contraste se enuncia com fatos observados, sem legislar o intervalo.
- **O que cortar/mover/encolher:** manter o contraste factual ("a arbitragem 3 não anexa cláusula de deviation; o próprio close do findings já aplicou o checklist") e **cortar a cláusula normativa** "nenhuma deviation é exigida no intervalo" — ou demovê-la a "recomendação desta discovery, revisável pela spec", atualizando o preâmbulo para incluí-la na lista de adições próprias. A decisão do regime de intervalo pertence à emenda 3 do skill (quem a redigir decide o regime).

### O2 — §3.6 reproduz o conteúdo dos 6 itens do checklist — texto de checklist é matéria da emenda ao skill, não da discovery

- **Trecho** (§3.6): "(i) toda citação resolve para texto persistido **que de fato sustenta a claim** [...]; (ii) todo return termina em `Dissent:` [...]; (iii) draft persistido com IDs ou deviation declarada [...]; (iv) posições inicial/final presentes se robot-talks rodou [...]; (v) nenhuma cadeia de citação termina em 'session transcript'; (vi) claims aceitas sem re-revisão carregam `not-re-reviewed` + linha `Accepted-unreviewed:`".
- **Por que excede a altitude:** o gate (a) nomeia "textos de checklist" literalmente. O texto canônico dos 6 itens já existe no findings §4 Close (com as tags [P9], [LEI verificada], [NOVO] que a paráfrase da discovery perde) e seu destino é a emenda 3 ao research/SKILL.md §Outputs (findings §5.3; §6 desta discovery). Para CODIFICAR a decisão bastam: existência, contagem (6), escopo (`dispatch_type: research`), status (emenda candidata) e a defesa contra o corte §7 — tudo já presente em §3.6. A enumeração item-a-item cria uma **segunda cópia divergível** do texto que a spec vai fixar — exatamente o risco que a própria discovery invoca em §5 ("evitando um segundo documento normativo que possa divergir") para decidir o housing dos contratos. Mesma família de cheiro do §7: superfície duplicada que o registro único substitui.
- **O que cortar/mover/encolher:** substituir a enumeração por "seis itens — texto canônico em findings §4 Close, destino na emenda 3 (§5)", mantendo existência/escopo/status/defesa e a regra `N/A — role ausente` apenas como referência (A2).

### O3 — §3.7 importa literais de contrato do findings §4 para a tabela compacta (vocabulário de veredito, formatos de âncora, mecânica de header, definição de 3 cláusulas)

- **Trechos** (§3.7, células): "veredito exaustivo por ID alheio `{UPHELD, REFUTED, DOWNGRADED→<alvo>}` + `N*` carimbados `not-re-reviewed` + duas linhas `Posição inicial:`/`Posição final:` + `Dissent:`"; "formatos fechados (`caminho:linha` \| `arquivo §seção` \| `URL`), mínimo 1 por claim"; "`<nome>` = label da sheet; ordem = rows da sheet"; "definição executável de 3 cláusulas (célula da matriz; sustenta a resposta de 1 linha; remoção mudaria verdict)".
- **Por que excede a altitude:** a linha divisória honesta é findings §2 (vereditos — o que a discovery codifica) vs findings §4 (contratos por edge — "entrega central", o texto-fonte que o §6 row 1 desta mesma discovery atribui à spec: "texto novo derivado de findings §4"). Esses literais — enum fechado em caixa alta, tripla de formatos de âncora, mecânica de montagem por sheet, as 3 cláusulas de load-bearing — são §4-material. A discovery restate-a verbatim, duplicando na própria página o que delega à spec na página seguinte. Se a spec ajustar um literal (e ela pode — preâmbulo: recomendações "revisáveis pela spec"), a tabela do §3.7 vira a cópia desatualizada.
- **O que cortar/mover/encolher:** encolher cada célula a decisão + verdict + ponteiro: "veredito exaustivo por ID alheio, vocabulário fechado (findings §4 edge 4)"; "âncora por claim-ID, formatos fechados (findings §4 edge 2/A4)"; "header de fronteira com identidade+ângulo iff n≥2, montagem determinística pela sheet (findings §4 edge 2/A5)"; "load-bearing pela definição executável de A3 (findings §3 arbitragem 4)". Os literais ficam no findings e renascem na spec.

### O4 — §3.4 reproduz a mecânica contábil do re-ask e o placeholder literal de return ausente

- **Trecho** (§3.4): "**+1 em `agents_spawned.total` (bucket `helpers`)**, registrado como `Deviation:` no close, **não consome `max_loops`** [...] header SEMPRE persiste, corpo `RETURN AUSENTE — <motivo>`".
- **Por que excede a altitude:** a decisão codificável é: re-ask capeado em 1, classificado helper P11, sem row/gate, falha dupla ou ausência → P4 partial group result — e o porquê (contradição com P4/`max_loops`; sinal recuperável do caso Dissent). A contabilidade campo-a-campo (+1 onde, qual bucket, qual linha de close) e a string-placeholder literal são mecânica de skill/close — e a própria discovery trata essa superfície como não-fechada: o §6 (row helpers) demove a contraparte de row a "hipótese desta discovery, a validar na spec contra `register-dispatch`". Não é coerente fixar no §3.4 o detalhe contábil cuja validação o §6 declara pendente.
- **O que cortar/mover/encolher:** encolher para "contado como helper no relato de `agents_spawned`, com deviation no close; não consome `max_loops` (findings §3 arbitragem 1; mecânica exata: findings §4 edge 2)"; cortar o placeholder literal.

### O5 — §3.2/§3.3 fixam tokens e ciclo de vida de ID em sintaxe literal (`supersedes E1#4`; `Dissent: none — <razão de uma linha>`)

- **Trechos**: §3.2 — "contador contínuo por agente, nunca reiniciado, nunca reutilizado; revisão referencia o superado (`supersedes E1#4`)"; §3.3 — "Token sancionado para dissenso vazio: `Dissent: none — <razão de uma linha>`".
- **Por que excede a altitude:** mesma família de O3, em seções de prosa. As decisões são: (3.2) IDs com namespace por agente, default `<label>#<n>`, override só com deviation, dissenso E3 vivo — o default em si é defensável na discovery porque é o objeto do dissenso vivo; mas a disciplina inter-turnos (nunca reutilizado, sintaxe `supersedes`) é A8/edge 4–5, texto de contrato. (3.3) A categoria LEI e seu porquê — o token literal de dissenso vazio é A10, texto que mora no contrato do edge 2 e na futura emenda do skill. Severidade menor que O3: são duas ocorrências pontuais, e o default `<label>#<n>` deve FICAR (é a decisão).
- **O que cortar/mover/encolher:** §3.2 — manter default + override + dissenso; substituir a mecânica por "disciplina de continuidade e supersedes em findings §4 edge 4/A8". §3.3 — manter a categoria LEI e o porquê; referir o token como "token sancionado para dissenso vazio (A10, findings §3 arbitragem 5)" sem a sintaxe.

### O6 — §5.3 desliza de "nenhum lado decide sem medição" para uma quase-obrigação de medir "nos próximos dispatches"

- **Trecho** (§5.3): "**Recomendação (derivada de §6.3 por esta discovery [...]):** manter o default `<label>#<n>` [...] e medir custo nos próximos dispatches antes de qualquer endurecimento ou relaxamento."
- **Por que excede a altitude:** o findings §6.3 registra um estado ("custo tampouco medido; nenhum lado decide sem medição"); a discovery converte o estado em processo prospectivo ("medir nos próximos dispatches") sem owner, sem instrumento e sem witness de que alguém medirá — gate (b), forma branda. Está corretamente carimbada como derivada (V4 da trilha L1), o que reduz a severidade a baixa; mas uma recomendação de processo sem owner é a mesma classe que o §7 corta quando vira campo (`success_metric`: preenchido com vácuo).
- **O que cortar/mover/encolher:** "manter o default; o OPEN só fecha com medição (findings §6.3) — esta discovery não prescreve quando nem por quem."

## Checagens que saem limpas

- **(c) Cortes do §7:** os dois recriáveis tocados são confrontados — checklist vs `final_approver_criteria` (linha 515; §3.6 reproduz a defesa da arbitragem 3) e taxonomia de 4 tiers vs `grade` (linha 528; §5.2 exige o confronto na promoção futura). Nenhum outro corte (`expected_output_shape`, `constraints`, `round`-como-campo etc.) é recriado: input congelado como prosa (§3.7), `round` KILL banked (§3.8).
- **(d) §6 decidindo pela spec:** quase limpo. O housing está declarado como recomendação revisável (preâmbulo + §5 último bullet); o row helpers se auto-demove a hipótese; "sem redigir a spec aqui" é honrado no §6 em si. O resíduo de (d) não está no §6 — está no §3 importando o texto que o §6 delega (O2–O5) e no regime de intervalo (O1).

**Síntese da correção:** nenhuma decisão precisa mudar de verdict; a cirurgia é de altitude — cortar 1 cláusula normativa (O1), substituir ~6 blocos de literais por ponteiros a findings §4 (O2–O5) e despessoalizar 1 recomendação (O6). O documento fica mais curto e a spec ganha fonte única.

Dissent: O3–O5 admitem leitura contrária legítima — se a discovery é o artefato que a spec lerá primeiro, reproduzir literais reduz um hop de leitura; sustento o corte porque a própria discovery (§5/§6) elege o findings §4 como texto-fonte e o skill como casa canônica, e duas cópias de literais revisáveis divergem — mas registro que a fronteira §2-verdict vs §4-contrato é critério meu, não regra escrita do gate.
