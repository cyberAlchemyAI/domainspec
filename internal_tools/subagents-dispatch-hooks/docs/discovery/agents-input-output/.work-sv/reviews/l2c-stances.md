---
tags: [agents, dispatch, review, stances, system-view]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-system-view
role: l2c-stances
---

# Review l2c — completude de stances

Artefato: `system-view.md` v0.2.0. Fontes de contraste: `discovery.md` v1.0.0 (§4 decisões, §4.7 matriz compacta, §6 abertos, §7 mapa verdict→status) e `research/findings.md` (§2 matriz de 18 linhas, verificada linha a linha). Gate único: toda posição load-bearing assumida pelo texto está nomeada no mapa de 19 rows com ponteiro único — caço stances órfãs, rows fantasma, ponteiros duplicados/rows com dois conceitos, decisões da discovery sem stance, e o reflexo do ERRATUM D2/A14 e da tabela verdict→status.

**Varredura das 18 linhas da matriz:** #1→header, #2→ids, #3→âncoras, #5→envelope, #7→checklist, #10→append-only, #13→output-reviewer, #14→espelho, #15→shape, #16→input-congelado (os 10 GOs); #9→tiers, #11→condensação, #12→draft-F* (os 3 condicionais); #4 e #8 (LEI) corretamente sem row, conforme o próprio mapa verdict→status; #6 e #18 (KILL) com destino declarado nas rows envelope e append-only. **Única linha com problema de ponteiro: #17 (E1).** Rows fantasma: **nenhuma** — as 19 rows são usadas por pelo menos uma camada (as 6 "GO estável" pelo shape da Camada 2; as 13 tensas por handle explícito nas Camadas 1–4). Aritmética do preâmbulo do mapa (11+3+5=19; 13 tensas + 6 estáveis) confere. **ERRATUM D2/A14: refletido corretamente** — Camada 3 ("no corpo do close — o campo de desvios da close row não existe, erratum A14"), Camada 4 (regra de honestidade) e "What this view does not cover" (A14 atribuído ao engineer-view); o split T3 (bucket `helpers` na row existe; linhas `Deviation:` só no corpo) está preservado. **Tabela verdict→status §7: refletida** na Camada 4 e registrada como row própria (`stance:mapa-verdict-status`) — com a perda de fidelidade apontada em E4.

## Itens

### E1 — ALTA — Handle #17 mal-atribuído e contradição interna: "re-ask não é linha da matriz" é falso

- **Onde:** row `stance:re-ask-capeado` cita "(#17, arbitragem 1)"; Camada 4 afirma "mais o re-ask capeado (resolvido pela arbitragem 1; **não é linha da matriz**)".
- **Problema:** findings §2 #17 é a linha "Validação de envelope na coleta" — verdict **OPEN** (forma aberta, §6.1) — e carrega INLINE a resolução do re-ask ("re-ask resolvido: cap 1, helper P11"). Ou seja: (i) o re-ask **É** parte da linha #17 — a frase da Camada 4 contradiz a própria citação da row; (ii) pela convenção U3 (handle canônico = `#n` da matriz), o handle #17 é compartilhado por DOIS conceitos do mapa — o re-ask (parte resolvida) e a mecanização (parte OPEN; a nota de aritmética da discovery §4 declara #17 ≡ resíduo §6.1) — mas a row `stance:mecanizacao-da-validacao` cita apenas "(OPEN 6.1)", ficando **sem o seu handle de matriz**, e nenhuma das duas rows declara o compartilhamento (contraste com o split do #9, declarado na row tiers). O endereçamento U3 de #17 hoje resolve para a row errada ou para nenhuma.
- **Correção apontadora:** row re-ask → "(#17, parte resolvida da linha; arbitragem 1)"; row mecanização → "(#17, parte OPEN da linha; findings §6.1)"; Camada 4 → "resolvido pela arbitragem 1 dentro da linha #17, cuja parte OPEN mora na row `stance:mecanizacao-da-validacao`" em vez de "não é linha da matriz".

### E2 — ALTA — Stance órfã: o guard anti-auto-citação é assumido "obrigatório desde já" sem ponteiro nomeado

- **Onde:** Camada 2 ("guard anti-auto-citação, **obrigatório desde já**: F-claims carregam suas próprias citações E*"); usado de novo na Camada 4 (tabela, "violaria o próprio item (i) do checklist" pressupõe o guard operante).
- **Problema:** é uma posição load-bearing com regime PRÓPRIO — a discovery §4.5 a separa explicitamente da rota F* ("guard **obrigatório desde já**" vs rota "GO-condicional, deviation até lá"). O texto da view a assume duas vezes e o mapa não a nomeia: a tensão da row `stance:draft-citavel-do-synthesizer` fala só da letra de P9 e da deviation — dois regimes distintos (vigente-já vs pendente-de-emenda) coabitam uma row sem que a row diga que é dona dos dois. Quem ler só o mapa não descobre que existe uma obrigação já vigente dentro de uma stance marcada como pendente.
- **Correção apontadora:** nomear o guard na tensão da row draft-citável ("inclui o guard anti-auto-citação, obrigatório desde já — findings §3 arbitragem 2") ou dar-lhe linha estruturada própria no mapa; em qualquer caso, declarar o duplo regime.

### E3 — MÉDIA — Dois conceitos com statuses incompatíveis numa row só: ids (#2 + OPEN 6.3) e tiers (split #9)

- **Onde:** row `stance:ids-de-claim-com-namespace` carrega o GO #2 E o OPEN 6.3 (custo); row `stance:tiers-de-verificacao` carrega a metade GO do #9 (carimbo + cláusula) E a metade OPEN (taxonomia).
- **Problema:** sob o contrato do engineer-view que a própria view enuncia ("cada row com **um** verdict, **um** status") e sob o mapa verdict→status que ela propõe (GO→RESOLVED; OPEN→OPEN), essas duas rows precisariam de dois statuses simultâneos. Para tiers é defensável — #9 é UMA linha da matriz com verdict "split" e o split está declarado na tensão. Para ids é pior: são DOIS handles de fontes distintas (#2 da matriz + §6.3 dos abertos) fundidos, e o tratamento é assimétrico com os irmãos — 6.1 e 6.2 ganharam rows dedicadas, 6.3 não. O marcador `[registro + encaminhamento]` disclosa o encaminhamento, não o conflito de status.
- **Correção apontadora:** ou separar `stance:custo-dos-ids` (OPEN 6.3) da row GO #2 — simetria com 6.1/6.2 —, ou declarar no preâmbulo do mapa a regra de row-com-split (como o autor do engineer-view deve registrar verdict composto), citando #9 e #2+6.3 como os dois casos.

### E4 — BAIXA — Paráfrase do mapa verdict→status perde duas células da tabela da discovery §7

- **Onde:** Camada 4, parágrafo do "mapa de tradução proposto".
- **Problema:** a tabela-fonte tem a linha `GO · "adotada" (A2/A3) → RESOLVED` e a cláusula `OPEN → OPEN (CRITICAL só se bloquear a spec; nenhum dos três bloqueia)`. A paráfrase da view omite "adotada" e toda a cláusula CRITICAL — exatamente a célula que diz quando um OPEN escala. Como a narração da Camada 4 é o texto citável (a row `stance:mapa-verdict-status` só aponta), a omissão pode induzir o autor do engineer-view a um vocabulário de status sem critério de CRITICAL.
- **Correção apontadora:** completar a paráfrase ("GO e adotada (A2/A3) → RESOLVED; ... OPEN → OPEN, CRITICAL só se bloquear a spec — nenhum dos três bloqueia (discovery §7)").

### E5 — BAIXA — Abertos da discovery §6 com cobertura assimétrica: três sem row nem OQ

- **Onde:** discovery §6 "Abertos identificados para a fase de spec": dívida do item (iv) em `review`, witness de conteúdo dos pares P14, e a casa editorial do texto canônico dos contratos por edge — nenhum aparece na view (sem row, sem OQ).
- **Problema:** fora do gate estrito (nenhuma camada os ASSUME, e (d) cobre §4/matriz), mas a view abriu precedente de dar handle a item de propriedade da spec quando narrado (OQ-SV-4 para a lista de URLs). Se o critério é "só o que a view narra ganha handle", ele não está escrito; sem ele, o leitor não sabe se os três foram triados ou esquecidos.
- **Correção apontadora:** uma linha no "What this view does not cover" declarando o critério de triagem ("abertos §6 não narrados por nenhuma camada permanecem com a discovery") — ou OQs explícitos.

## Verificações que passaram

- (b) Rows fantasma: nenhuma das 19.
- (d) As 18 linhas da matriz têm destino coerente no mapa (exceto o ponteiro de #17 — E1); LEIs sem row e KILLs com destino declarado, conforme a regra que a própria view enuncia.
- (e) ERRATUM D2/A14 refletido nas Camadas 3 e 4 e no "What this view does not cover", com o split T3 (bucket na row vs declaração no corpo) preservado; tabela verdict→status refletida e com row própria (ressalva E4).
- Aritmética do mapa (10+1, +3, +5 = 19; 13 tensas + 6 estáveis) confere; A2/A3 com rows donas declaradas; aplicabilidade n=1, espelho/P3, emendas 1–5 todas com row.

Dissent: a maioria provável tratará E3 como "design disclosado, não defeito", já que o marcador `[registro + encaminhamento]` existe e o engineer-view pode inventar verdict composto. Sustento que ids #2+6.3 é defeito real: o mapa promete "exatamente uma row dona" por stance e um status por row — fundir um GO e um OPEN de handles distintos quebra a promessa no único lugar onde ela é mecânica, e a assimetria com 6.1/6.2 não tem justificativa citada em fonte alguma.
