---
tags: [agents, dispatch, review, overclaim, status, engineer-view]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-engineer-view
role: l2a-overclaim
---

# Review l2a — over-claim de status (régua R1–R5 aplicada adversarialmente)

Artefato: `engineer-view.md` v1.1.0. Gate único: over-claim de status. Régua do próprio artefato: RESOLVED *iff* decidido E gate vigente em disco enforçando hoje o que o verdict exige (R1); negativas exigem só bloqueio de re-abertura — banking basta (R4). Aplicada às 3 RESOLVED (D1, D15, D21), varrida em reverso nas 18 OPEN, e checada a realidade dos gates nomeados.

Fontes abertas e conferidas: `engineer-view.md` (íntegra), `research/findings.md` (§2 #1–#18, §3 arbitragens, §4 edges + Close, §5.1–5.5, §6.1–6.3), `subagents-strategy-constitution-proposal.md` (P4 l.122, P9 l.133, P11 l.135, P12 l.136, §5 `initial_prompt` l.356, §7 l.515–531), `.claude/skills/research/SKILL.md` (l.85, l.107–108, l.126), `register-dispatch/SKILL.md` (l.209–218), `discovery.md` (l.209 — casa editorial), `.claude/skills/custom/frontmatter.md`.

---

## Itens

**O1 — MAJOR — D1: o RESOLVED viola a convenção multi-regime do próprio inventário; a metade GO #5 contrabandeia enforcement.**
D1 é nomeada nas convenções como célula multi-regime, e a convenção declara: "o status único da row é o mais restritivo entre as metades que a row possui (OPEN domina RESOLVED na mesma célula; uma metade-KILL enforced fica declarada na célula, **nunca promove o status**)". A conferência aritmética roteia **#5 (GO — envelope tipado sobre corpo livre) + #6 (KILL — schema do corpo) → D1**. A metade KILL #6 está de fato enforced por banking (findings congelado em disco, §2 #6 "KILL unânime" — R4 satisfeita). Mas a metade **GO #5 não tem gate vigente**: o consumidor que checaria o envelope é a forma OPEN de D10 (checklist lido — default, não lei), a spec do tipo pende (R-11), e o "corte do validator" citado (§7 l.516, verificado) estabelece a **ausência** de checador mecânico — não checa conduta recorrente alguma; sob R1/R2 a metade GO é OPEN-quality. Pela convenção, OPEN domina → status de D1 deveria ser **OPEN com a metade-KILL declarada na célula** — exatamente o tratamento que **D18 recebe** (estrutura idêntica: KILL #18 bancado + GO pendendo spec → "OPEN domina"). D1 e D18 não podem ambas estar certas sob uma régua. A rota de escape da célula ("as instâncias positivas têm rows próprias: D16, D2, D17, D18") não cobre #5: essas rows possuem #1, #2, #3 e #10+#18 — **nenhuma possui o GO de #5**. Dilema sem saída boa: ou D1 possui #5 (→ OPEN domina, status errado) ou #5 fica órfã de registro (→ a bijeção "16 linhas resolvem em rows, zero órfãs" quebra). Ambos os chifres falsificam a célula como está. **Consequência: contagem real 2 RESOLVED · 19 OPEN · 0 CRITICAL — a linha "RESOLVED 3 (D1, D15, D21)" é over-claim derivado.**

**O2 — MODERADO — D15: o prong de enforcement do RESOLVED está empiricamente falsificado por O1.**
A regra de tradução é decisão DESTA view (dono nomeado pela system-view — legítimo), e a exceção meta auto-referente está declarada (l1c C7) — a circularidade em si está sancionada. Mas o gate declarado é dual: "**aplicação uniforme nas 21 rows** + checagem de coverage/status no gate de publicação". O1 mostra que a aplicação **não é uniforme hoje** (D1 vs D18 sob a mesma estrutura). A exceção meta sanciona auto-referência, não não-uniformidade. No estado em disco, D15 reivindica como enforcement um fato ("aplicação uniforme") que o próprio documento desmente — RESOLVED sustentado pela metade decisão, over-claimed pela metade enforcement. Disposição: D15 volta a sustentar-se assim que D1 for re-statusada (este review É a checagem de publicação funcionando); como artefato congelado v1.1, está over-claimed pela própria evidência.

**O3 — MENOR — D1: qualidade da autoridade citada para o R1.**
"findings §6.1 (corte do validator como lei — posição l3a)" cita uma **posição** dentro de um OPEN-de-owner tri-lateral não arbitrado como se fosse "lei citada" em apoio a um RESOLVED. A frase de l3a resolve em disco (§6.1, verificada) e o corte subjacente (§7 l.516) é lei vigente — mas o que essa lei estabelece é que **não há** validador; ela não pode servir de gate R1 para a metade GO. Autoridade que resolve mas não sustenta o status — exatamente a distinção que o item (i) do checklist protege.

**O4 — VERIFICADO/UPHELD — D21: o RESOLVED se sustenta com a autoridade re-citada pós-strike.**
Verificado em disco: §5 l.356 é `initial_prompt` — R·A, "the briefing it receives at launch... and the return expected" — o canal do briefing é campo obrigatório vigente; §7 l.526 corta `tools`/`read_scope`/`target` ("the `initial_prompt` states the task, not a reading list") e l.527 dobra `expected_output_shape` em `initial_prompt`. A re-citação pós-strike (l1b A1) aponta para o lugar certo desta vez. A metade KILL (nenhum campo estruturado novo) está bancada (findings §2 #16, congelado) — R4 satisfeita — e a cláusula final da R4 cobre explicitamente freezes cujo enforcement é lei já vigente. Conferido também: **nenhuma das emendas §5.1–5.5 toca o canal de input** (P9/l.133, research/SKILL §Outputs ×3, frontmatter cheatsheet — confirmado contra findings §5). Reforço não citado disponível: o schema fechado do appender ("unknown keys are rejected, exit 2", register-dispatch l.218) bloqueia mecanicamente campo novo na row — a row sobrevive sem ele. Sem over-claim.

**O5 — MENOR — Gates nomeados: a família §5.N é toda real; a família "spec do tipo" é gate sem pendência committed.**
Verificado 1:1 contra findings §5: D5→§5.1 (P9, padrão `invoked_by`) ✓ · D9→§5.2 (condensação) ✓ · D6/D11/D7→§5.3 (checklist de 6 itens) ✓ · D20→§5.4 (shape) ✓ · D13→§5.5 + confronto P3 (T2) ✓ — todas existem verbatim como recomendações pendentes. D8 adicional: o texto canônico do cap de fato "já mora" em findings §4 edge 2 ("no máximo 1 re-ask por agente") ✓. Porém o segundo gate-família — "a spec do tipo que fixa o contrato por edge como lei" (D2, D8, D16, D17, D18, D19 — 6 das 18 OPEN) — **não é pendência do findings §5**: sua única casa registrada é discovery.md l.209 (§6 abertos: casa editorial como "escolha editorial da spec", recomendação sem dono e sem artefato committed). O artefato divulga isso honestamente (l1c C4; R-11 "nomeado, não localizado"), então não é fabricação — mas um terço das OPEN pende de um gate que nenhuma fila de pendências possui; OQ-EV-2 nomeia decisões do autor da spec (D4, D14, OQ-SV-4) sem nomear a criação da própria casa. Flag de encaminhamento, não de régua.

**O6 — VERIFICADO/UPHELD — Varredura reversa das 18 OPEN: nenhum sub-claim.**
Candidatos mais próximos examinados e mantidos OPEN sob a régua: **D8** — as peças vigentes (P4 l.122, P11 l.135, bucket `helpers` l.211 — todas verificadas) enforçam degradação, classificação e contagem, mas o conteúdo arbitrado (cap de 1, `Deviation:` no corpo) não tem gate e não consta de §5 — a rebaixa C2 está certa pela cláusula-cabeça de R1; **D11** — o carimbo é prática sem consumidor exigível até a emenda 3 (item vi é [NOVO]); **D19** — P14 l.138 é LEI vigente referenciada, mas o que a row decide (ordem, vocabulário fechado, localização das duas linhas) pende spec; **D6** — P12 l.136 + l.126 do skill mandam A checagem, mas a definição executável de 6 itens só vira lei do tipo com §5.3. Registros (D3, D4, D7, D10, D12, D14) corretos por R5; a reserva de CRITICAL a zero está justificada na R5 e bate com a discovery §7. Sub-claim seria erro de régua tanto quanto over-claim — não encontrado.

---

**Saldo: 6 itens — 1 major (O1), 1 moderado (O2), 2 menores (O3, O5), 2 upheld (O4, O6). Contagem de status defendida por este review: RESOLVED 2 (D15*, D21) · OPEN 19 · CRITICAL 0 (*D15 condicionado à re-statusagem de D1).**

Dissent: a leitura alternativa que salvaria D1 — a metade GO #5 como mero agregado abstrato das instâncias D16/D2/D17/D18, sem registro próprio em D1 — foi considerada e rejeitada, porque a conferência aritmética roteia #5 explicitamente para D1 e nenhuma outra row o possui; mas registro que, se o autor emendar a **aritmética** (declarando #5 distribuído nas rows-instância) em vez do **status**, O1 muda de erro de régua para erro de contabilidade, e o RESOLVED de D1 (então puramente negativo) passa a ser legal sob R4.
