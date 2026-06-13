---
tags: [agents, dispatch, io-contracts, changelog, l1, zig-zag, engineer-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: engineer-view-author (turno de volta, dispatch 2026-06-12-agent-io-engineer-view)
---

# L1 changelog — engineer-view.md v1.0.0 → v1.1.0 (turno de volta do zig-zag)

Artefato revisado: `engineer-view.md` (versão 1.0.0 → 1.1.0, bump minor). Reviews processados: `l1a-cobertura.md` (V1–V3), `l1b-autoridade.md` (A1–A3), `l1c-coerencia.md` (C1–C8). Pontos contestados re-verificados em disco antes de cada edição: `subagents-strategy-constitution-proposal.md` (l.121 = P3 "Two appends, one place"; l.122 = P4 "Execution shape"; l.135 = P11 com "spawn count is unregulated"; **l.356 = `initial_prompt` — R · A, "the agent's starting prompt — the briefing it receives at launch"**; l.526–527 = tabela §7, `tools`/`read_scope` cortados e `expected_output_shape` "folded into `initial_prompt`"; l.222–227 = `working_folder`, destino de outputs), `research/findings.md` (§2 #16, §3 arbitragem 1, §4 edges 1–2, §5 — o cap de re-ask NÃO consta de nenhuma emenda, §6.3), `register-dispatch/SKILL.md` (l.211 — o bucket `helpers` REGISTRA, não capeia; l.218), `engineer-view/SKILL.md` (l.186–187 legenda; l.194 authority-strike rule). **14 ids: 14 aplicadas, 0 rejeitadas, 3 arbitragens declaradas (D21, R4, D8).**

## ARBITRAGENS (as três decisões que o turno exigia)

### A1 — strike em D21: executado; RESOLVED re-sustentado com a autoridade certa

A regra strike-on-unverifiable (SKILL l.194) foi executada honestamente, não contornada: a citação original (§5 l.222–227) resolve em disco mas é `working_folder` — destino de outputs — e não sustenta o que a célula declarava enforçado ("dona do edge" de input). Autoridade struck; a row caiu a OPEN com nota. **Re-citação na mesma revisão:** o canal do briefing é `initial_prompt` (§5 l.356, campo **R · A** — lei vigente em disco), e o lado KILL é lei da tabela de cortes §7 (l.526–527). Ambas verificadas em disco nesta escrita. Com a autoridade certa, D21 satisfaz a R1 estrita (o freeze é enforçado por lei vigente — o canal é campo required da constituição) e a R4 (negativa bancada): **D21 segue RESOLVED**, com o strike registrado na própria célula e no caminho de skip ("Nenhuma autoridade precisou ser struck" era falso e foi reescrito). O defeito era exclusivamente de alvo da linha; a substância do verdict estava intacta (findings §2 #16; E3 R8).

### C1 — R4 fundamentada por escrito; KILLs permanecem RESOLVED

A leitura caritativa do reviewer foi adotada E ESCRITA na R4, porque consigo defendê-la: **o objeto de enforcement de uma negativa difere do de uma positiva.** Positiva (GO) exige conduta conforme recorrente — todo dispatch futuro tem de FAZER a coisa — e só consumidor/gate vigente checa conduta; o findings bancado registra a decisão mas não checa conduta nenhuma em runtime → GO bancado sem consumidor é OPEN (R2). Negativa (KILL) exige apenas que a alternativa morta não volte sem confronto — evento de re-abertura, não conduta recorrente — e para esse objeto o findings congelado É gate vigente: sob P10 (claim ≤ proof), propor construir o campo morto obriga a citar e derrubar o KILL bancado; ignorá-lo é violação verificável hoje. Bloquear re-abertura é tudo que uma negativa demanda — e é exatamente o que um documento congelado faz. A assimetria deixa de ser declarada-sem-razão e vira regra fundamentada; **D1 e a metade-KILL de D21/D18 mantêm o tratamento R4; a contagem não muda por C1.**

### C2 — D8 rebaixada a OPEN; prong fraco da R1 removido

Reexame honesto contra a R1 estrita: o que vige em disco enforça as **peças**, não o conteúdo da arbitragem 1 — P11 (l.135) classifica helpers mas declara o spawn count *unregulated* (logo P11 NÃO é a lei do cap; permitiria mais); P4 (l.122) manda a degradação; o bucket `helpers` do appender (l.211) registra, não capeia; §5 reserva `max_loops` ao reject do approver. **O cap de 1 re-ask e a disciplina `Deviation:` no corpo não têm gate em disco** — existem só no findings (§3 arbitragem 1, §4 edge 2) e não constam de findings §5. Não encontrei lei real que enforce o cap; portanto a régua manda: **D8 → OPEN com gate nomeado** — a mesma spec do tipo que fixa o contrato do edge 2 como lei (casa editorial: R-11). A R1 foi reescrita para eliminar o prong fraco ("não depende de emenda pendente" demovido a condição necessária, nunca suficiente), fechando também o argumento análogo que D2 teria pelo prong isolado. **Contagem-manchete: RESOLVED 4 → 3 (D1, D15, D21) · OPEN 17 → 18 · CRITICAL 0.**

## APLICADAS (14 ids)

| id | edição | uma linha |
|---|---|---|
| A1 | D21 + caminho de skip | strike executado e registrado; re-citação `initial_prompt` l.356 + §7 l.526–527 (verificadas); RESOLVED re-sustentado — ver arbitragem acima. |
| A2 | D8 (status + autoridade) + caminho de skip | range de P4 corrigido para **l.122** em todas as ocorrências (l.121 é P3); nota da correção no caminho de skip. |
| A3 | D1, coluna autoridade | glosa sobre-atributiva corrigida: "corte do validator como lei — **posição l3a**" (não "das três posições"; só l3a chama o corte de lei em findings §6.1). |
| C1 | regra R4 + D15 (célula verdict) | fundamentação da assimetria banking-enforça-negativas escrita na R4 — ver arbitragem acima; D15 referencia "fundamentação escrita na R4". |
| C2 | regra R1 + D8 + contagem + edge 2 + runtime step 2 | D8 → OPEN com gate nomeado; prong fraco removido da R1; tabela de edges e mecânica de runtime realinhadas ("re-ask vigente" → "P11/P4 e não-consumo de max_loops vigentes; o cap pende a spec"); splits #17 re-rotulados ("parte arbitrada" / "parte forma-da-validação"). |
| C3 | D18 (célula verdict) | `supersedes` ganhou row dona: disciplina A8 completa escrita na célula de D18 (contador contínuo + ID nunca reutilizado + `supersedes <ID>` obrigatório em revisão de claim); a prosa do runtime step 4 agora resolve numa célula. |
| C4 | D2, D16, D17, D18, D19 (+ D8) + regra R2 + R-11 | gate "spec via emendas 2–4" substituído em todas as rows por "spec do tipo (casa editorial em aberto — R-11)"; as emendas 2–4 declaradas vizinhas nomeadas, não casa dos literais; R-11 agora lista as seis rows que apontam para ela ("o gate herda a abertura: nomeado, não localizado"). |
| C5 | convenções do inventário + D18 | exceção declarada: células multi-regime (D1, D5, D18) admitidas quando split adicional quebraria a bijeção 21↔21; status único = o mais restritivo entre as metades que a row possui (OPEN domina); metade-KILL enforced declarada na célula, nunca promove o status. |
| C6 | caminho de skip (ledger de verificação) | T3 l.576 adicionada (citada por D6); §Tension design l.85 mantida COM atribuição (carregada pelo bullet LEI da regra de tradução, matriz #4); `working_folder` l.222–227 re-atribuída a R-1; `initial_prompt` l.356 + §7 l.526–527 adicionadas. |
| C7 | D15 (célula status) | exceção meta declarada: gate auto-referente, única row cujo enforcement é o próprio documento que a adjudica, sancionada pelo dono que a system-view nomeia; sem licença análoga para outra row. |
| C8 | conferência aritmética | proveniência de D3 corrigida: oriunda do aberto do findings §6.3 (não da discovery §6/§7); as demais 4 sem handle mantêm a origem declarada. |
| V1 | conferência aritmética + OQ-EV-4 | divergência de índice flagrada: o preâmbulo do mapa da system-view enumera 4 rows sem verdict de matriz, omitindo `custo-dos-ids` — contagem real 5; encaminhada ao reconcile da system-view (OQ-EV-4), nunca hand-patch. |
| V2 | convenções + cross-reference map + R-14 novo | âncora `engineer-view#<stance-slug>` demovida a convenção de string declarada (busca do slug no campo Stance; sem âncora HTML/heading); adoção de âncoras explícitas encaminhada à spec via residue R-14. |
| V3 | regra de tradução, bullet LEI | nota de conciliação: a terceira LEI da system-view (verbatim) é a metade-LEI da linha mista #11, referenciada dentro de D9 — não linha LEI própria; só #4 e #8 são linhas puramente LEI sem row. |

## REJEITADAS

Nenhuma. Os 14 ids foram aplicados; onde o reviewer ofereceu ramos (V2: qualificar vs encaminhar; C5: split vs convenção), o ramo escolhido está declarado na linha correspondente — V2 fez os dois (qualificação + R-14); C5 escolheu a convenção amendada porque um split de #18 quebraria a bijeção 21↔21 com a system-view congelada, que só o reconcile dela pode alterar.

## Estado final

**Contagem por status: RESOLVED 3 (D1, D15, D21) · OPEN 18 · CRITICAL 0.** Régua R1–R5 re-aplicada uniformemente às 21 rows após as reescritas de R1/R4: D1 (R4 fundamentada + lei do corte l3a) ✓; D15 (exceção meta declarada) ✓; D21 (re-citação pós-strike, lei vigente `initial_prompt`) ✓; as 18 OPEN têm gate nomeado, dono nomeado ou encaminhamento externo declarado. Bijeção 21↔21 intacta; aritmética 16 + 2 LEI = 18 intacta; residue ledger agora com R-14. Strikes executados: 1 (D21 — re-sustentada).
