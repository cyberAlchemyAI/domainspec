---
tags: [agents, dispatch, review, coherence, engineer-view, l1c]
node_type: audit
is_session: false
layer: architecture
nature: technical, reference
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Review L1c — Coerência interna do engineer-view.md (dispatch 2026-06-12-agent-io-engineer-view)

**Artefato:** `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/engineer-view.md` v1.0.0
**Gate único:** coerência interna — (a) contradições entre rows; (b) régua R1–R5 vs aplicação; (c) verdict vs prosa de runtime; (d) residue ledger vs rows; (e) contagens; (f) status vs justificativa da célula.

## Verificações que PASSARAM (refeitas, não aceitas)

- **(e) Contagens — todas conferem.** 21 rows (D1–D21) ✓. Status na tabela: RESOLVED = {D1, D8, D15, D21} = 4 ✓; OPEN = 17 ✓; CRITICAL = 0 ✓. Rows com handle de matriz: D1(#5,#6), D2(#2), D5(#12), D6(#7), D8(#17), D9(#11), D10(#17), D11(#9), D12(#9), D13(#14), D16(#1), D17(#3), D18(#10,#18), D19(#13), D20(#15), D21(#16) = 16 ✓; sem handle: D3, D4, D7, D14, D15 = 5 ✓; 16+5=21 ✓. Decomposição da matriz: 2 pareadas (#5+#6; #10+#18) + 2 splits (#9; #17) + 10 linhas 1:1 + 2 LEI (#4, #8) → 16 linhas em rows + 2 LEI = 18 ✓. Bijeção: a system-view tem exatamente 21 slugs `stance:` (l.153–173) e a ordem D1–D21 honra a ordem do mapa, slug a slug ✓.
- **Spot-check de linhas citadas da constituição** (fora do gate, mas barato): l.133=P9 com a frase do par citável ✓; l.135=P11 com o parêntese da fronteira provisória ✓; l.136=P12 ✓; l.138=P14 ✓; l.576=T3 com "approver receives the full `working_folder`" ✓.
- **(d) Sem contradição direta ledger↔row:** R-1↔D5, R-2↔D9, R-3↔D6/D11/D7, R-4↔D20, R-5↔D13, R-8/R-9↔D8 conferem; R-12 "closed" é adjudicado por D15 (RESOLVED) — consistente.

## Findings

### C1 — [ALTA] R4 ("banking = enforcement") contradiz a cláusula-cabeça da R1; casos iguais tratados desigualmente (D1/D21 vs D2/D11)

R1 define RESOLVED como "verdict tomado **e** um gate/autoridade vigente em disco o **enforça hoje**". R4 declara que para KILL "o findings congelado em disco é o gate que impede re-levantar a alternativa sem confrontá-lo". Mas o findings congelado é exatamente igual de presente-em-disco para os GOs bancados no MESMO documento — e igualmente fraco mecanicamente nos dois sentidos: nada impede alguém de construir o campo de input morto (D21) amanhã, do mesmo modo que nada obriga ninguém a carimbar `not-re-reviewed` (D11) hoje. O racional dado ("impede re-levantar sem confrontar") aplica-se simetricamente a ignorar um GO bancado. A asymmetria é *declarada* (R4 "Interpretação declarada"), mas declarar não a torna coerente com o padrão de enforcement que a própria R1 enuncia — o documento nunca diz POR QUE banking enforça negativas e não positivas. A contagem-manchete (4/17) é sensível a essa premissa sub-argumentada: rejeitada, D1 vira OPEN; aceita simetricamente, vários GOs viram RESOLVED.

### C2 — [ALTA] R1 tem dois prongs não-equivalentes e D8 só passa pelo fraco — tratamento desigual vs D11/D2

R1 lista dois critérios sob a mesma cláusula: (i) "LEIs verificadas onde uma row as carrega" e (ii) "decisões do findings cujo enforcement não depende de emenda pendente". O prong (ii) NÃO implica a cláusula-cabeça ("um gate o enforça hoje"): uma decisão pode não depender de emenda alguma E não ter gate nenhum. D8 é exatamente esse caso: P11 e P4 são leis sobre helpers e resultados parciais em geral; o schema v0.5.2 *aceita* o bucket `helpers` mas **nenhum gate em disco enforça o cap de 1 re-ask, a linha `Deviation:` no corpo, ou o não-consumo de `max_loops`** — os conteúdos específicos da arbitragem 1. O que distingue D8 (RESOLVED) de D11 e D2 (OPEN) não é enforcement vigente, é o fato contingente de ninguém ter redigido uma emenda para ele ("não consta em findings §5"). Pela cláusula-cabeça, D8 é OPEN; pelo prong (ii) lido isolado, D2 teria argumento análogo. A régua, como escrita, decide casos iguais por critérios diferentes.

### C3 — [MÉDIA] Runtime step 4 promulga verdict sem row dona: "`supersedes` obrigatório em revisão de claim (D18)"

A prosa da mecânica (step 4) afirma "`supersedes` obrigatório em revisão de claim; ID nunca reutilizado (D18)". A célula de D18 contém o contador contínuo (A8) e o gatilho persist (A6) — **nenhuma row do inventário contém um verdict sobre `supersedes`**. Isso viola o invariante do próprio cross-reference map ("Todo verdict vive somente aqui — uma row por stance") e o gate (c): a prosa de runtime carrega uma obrigação que nenhuma célula decide. Ou `supersedes` entra na célula de D18 (ou D19), ou sai da mecânica.

### C4 — [MÉDIA] Gate "spec via emendas 2–4" (D2, D16, D17, D18, D19) não corresponde ao conteúdo que o ledger atribui às emendas 2–4 — e R-11 diz que a casa do contrato está aberta

Cinco rows nomeiam como gate "spec via emendas 2–4 (que fixam o contrato como lei do tipo)". Mas o residue ledger descreve: R-2 = rota de condensação, R-3 = checklist de 6 itens, R-4 = shape do findings — **nenhuma é descrita como casa dos literais de header (D16), do esquema de IDs (D2), dos formatos de âncora (D17) ou da ordem do output do reviewer (D19)**. Pior: R-11 declara explicitamente que "a casa editorial do texto canônico dos contratos por edge" é escolha ainda aberta da spec. O documento simultaneamente (a) nomeia um gate específico para cinco rows e (b) registra que o conteúdo desse gate não cobre essas rows e que a casa ainda não foi escolhida. Status OPEN das rows permanece correto, mas o gate nomeado é internamente inconsistente.

### C5 — [MÉDIA] Convenção "um verdict, um status por row" violada pelas células multi-regime (D5, D18, D1) — inconsistente com os splits feitos para #9/#17

As convenções declaram "um verdict, um status por row", e os splits #9→D11/D12 e #17→D8/D10 existem precisamente para honrar isso. Mas D5 declara "dois regimes na mesma row"; D18 declara "R2 + R4 na mesma célula" — uma metade GO (OPEN) e uma metade KILL que, pela R4, seria RESOLVED, com o status único da row lendo OPEN; D1 mistura na mesma célula a decisão positiva de fronteira (três tipos) e o KILL. O leitor que resolve `engineer-view#append-only-estendido` recebe um status que descreve só metade da célula. O mesmo critério que exigiu split de #9/#17 exigiria split de #18 (ou a convenção deveria admitir explicitamente células multi-regime — hoje ela diz o contrário).

### C6 — [BAIXA] Ledger de verificação do preâmbulo incompleto e sobre-inclusivo

O preâmbulo afirma "toda autoridade citada abaixo foi verificada em disco nesta escrita" e enumera. A enumeração **omite** `constituição T3 l.576`, citada por D6 ("working_folder completo") — a citação em si resolve em disco (verificado neste review), mas o ledger que afirma exaustividade não a contém. E **inclui** `research/SKILL.md §Tension design l.85`, que nenhuma row cita. Para um documento cuja disciplina é strike-on-unverifiable, o registro de verificação não bate com o conjunto citado.

### C7 — [BAIXA] D15 RESOLVED por gate auto-referente

O enforcement de D15 é "a aplicação uniforme neste inventário + checagem de coverage/status no gate de publicação desta view" — o documento sob adjudicação é o gate da própria row que o adjudica. No momento da escrita, esse gate não estava "vigente em disco hoje" (a view não existia publicada). Defensável para a meta-row (a system-view nomeia o autor como dono), mas é uma exceção não-declarada ao padrão R1 que as demais rows têm de cumprir.

### C8 — [BAIXA] Proveniência de D3 mislabelada na conferência aritmética

A conferência diz que as 5 rows sem handle são "oriundas da discovery §6/§7: D3, D4, D7, D14, D15" — mas a autoridade primária de D3 é **findings §6.3**, e a mesma seção, duas frases depois, mapeia "6.3→D3" aos OPENs do findings §6. As contagens não são afetadas (verificadas acima), mas a frase de origem contradiz a própria célula de D3.

## Veredito do gate

Coerência interna: **FLAG, não BLOCK.** Toda a aritmética confere e o esqueleto (bijeção, single-owner das rows, ledger↔rows) é sólido. As duas falhas altas (C1, C2) atacam a régua R1–R5 — exatamente a row D15 que o documento declara RESOLVED — e a contagem 4/17 depende delas; exigem ou re-argumentação na própria regra ou re-tradução de D1/D8.

Dissent: sustento C1 e C2 como incoerências sob o padrão que a R1 enuncia, mas registro que uma leitura caritativa — "negativas exigem só bloqueio de re-abertura, positivas exigem consumidor" — dissolveria C1 se fosse ESCRITA na R4; a falha é de fundamentação ausente, não necessariamente de tradução errada.
