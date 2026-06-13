---
tags: [agents, dispatch, io-contracts, changelog, l2, zig-zag, system-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: system-view-author (turno de volta, dispatch 2026-06-12-agent-io-system-view)
---

# L2 changelog — system-view.md v0.2.0 → v0.3.0 (turno de volta do zig-zag)

Artefato revisado: `system-view.md` (status mantido `draft`; versão 0.2.0 → 0.3.0). Reviews processados: `l2a-altitude.md` (S1–S7), `l2b-framings.md` (F1–F8), `l2c-stances.md` (E1–E5). Pontos contestados re-verificados contra as fontes antes de cada edição: discovery §3 (design space e convergência) e §6.1 (quarta forma S6); research.md §E2 Candidato #4/#5 e §E3 R1 + tabela "Síntese do mínimo forçado" + §E1 Dissent/§Elementos; findings.md §2 #17 (linha verificada: carrega INLINE o re-ask resolvido E a forma OPEN §6.1). Dissent de l2a respeitado integralmente: F1–F21/F11 como fato histórico e a lista de invariantes de condensação FICAM. 20 ids, 19 aplicadas, 1 rejeitada.

## APLICADAS (19)

| id(s) | edição | uma linha |
|---|---|---|
| S2 | Camada 3, parágrafo do checklist | enumeração item-a-item dos 6 itens substituída por narração conceitual ("confere, sobre os artefatos persistidos, que toda cadeia claim→prova fecha e que os invariantes de emissão foram cumpridos") + ponteiro; carimbo literal `N/A — role ausente` → conceito ("ausência de role, distinta de aprovação"); contagem estrutural "6 itens" mantida (aprovada por l2a); resolução-vs-sustentação e destino de emenda candidata preservados. |
| S3 | Camada 3, parágrafo do re-ask | campos de row (`bucket helpers`, `max_loops`) e literais de corpo (`RETURN AUSENTE — <motivo>`, "header SEMPRE persistido") removidos; o stake sobrevive inteiro: **re-tentativa única contabilizada como ajuda sem consumir o orçamento de iteração; degradação a resultado parcial com a lacuna auditável e a montagem determinística preservada** — contabilidade exata e carimbo: findings §3 arb. 1 / §4 edge 2. Erratum A14 ("no corpo do close") preservado (verificado por l2c). Limpeza derivada: "bucket sancionado" na tabela da Camada 3 → "classificação sancionada de helper". |
| S4 | mapa, row output-do-reviewer | enum literal `{UPHELD, REFUTED, DOWNGRADED→<alvo>}` + `N*` → "vocabulário fechado de três desfechos, claims novas carimbadas"; ponteiro a findings §4 edge 4 já existia e fica como única fonte do literal. |
| S5 | Camada 2 Close + rows espelho e header | nomes de campo (`dispatch_id`, `schema_version`, campo `model`) → conceito: "o findings espelha a identidade do dispatch como relato; fonte de verdade permanece a row do ledger" / "modelo opcional/informativo com fonte canônica na row do ledger"; campos exatos delegados à row/findings §2 #14. |
| S6 | preâmbulo do mapa + OQ-SV-1 | aritmética parcelada removida; fica a propriedade de fechamento ("toda aquisição GO, todo condicional e todo aberto têm exatamente uma row dona") + total verificável (**20**); decomposição e conferência atribuídas ao engineer-view via OQ-SV-1. |
| S7 | edge 2, edge 4, rows append-only e header + Camada 4 KILL | "concat append-only ... pela sheet" → "montagem determinística e append-only pelo registro do dispatch"; "posições inicial/final em linhas rotuladas" → "declaradas pelo emissor de forma comparável"; `(round N)` (duas ocorrências: row e bullet KILL) → "marcação de round/de seção de round" + "(marcador literal: findings §4)". |
| F1 | tabela da Camada 3, row nova | peça #4 de E2 na forma mais forte: passo/agente dedicado de checagem de citação pós-síntese ("é aqui que a verificabilidade mora — não em tipar mais o payload"; precedente Anthropic CitationAgent + citation accuracy como gate), apresentada como **competidor VIVO do checklist dentro do OPEN de mecanização** ("se o 'script' de l3b a subsume, quem fechar o OPEN deve dizê-lo" — discovery §6.1, correção S6); destino: `stance:mecanizacao-da-validacao`, cuja tensão agora nomeia a quarta forma. |
| F2 | tabela da Camada 2, row nova | shape mínimo de E3 na forma mais forte: resolução por SEÇÃO, sem IDs nem âncoras por claim — "custo sem regra que a exija" (E3 R1 + tabela "Síntese do mínimo forçado"), como **shape alternativo completo e concorrente** do envelope rico; dispensa honesta citada: E1 ev. 1 (namespaces emergiram 2x e fizeram P9 barata) + discovery §4.2 ("decisão de design declarada, não vitória sobre E3"); dissenso vivo e custo OPEN apontados às rows ids + custo-dos-ids. |
| F3 | Camada 1, framings row 3 | strawman desfeito: o framing de E1 é o claim COMPARATIVO "checklist no close, não schema executável" (anti-mecanização), não "o checklist sozinho basta"; coluna de origem agora registra que o próprio E1 §Elementos propõe contratos de emissão (draft persistido, Dissent imune à condensação, invariantes, persistência integral); dispensa reescrita: "absorvida quase inteira" — o que a view não toma é só o alvo do comparativo, que segue no OPEN de mecanização. |
| F4 | tabela da Camada 3, row 1 | racional mais forte do #5 reposto na coluna de origem: rejeição explícita em vez de absorção silenciosa — "o argumento mais forte do levantamento" (E2 §AutoGen) — com a pertinência declarada (degradação silenciosa é o diagnóstico central, E1 ev. 3); dispensa inalterada (provisória, honesta). |
| F5 | tabela da Camada 3, row tiers | defensor e witness repostos: E1 ev. 2 (marcador ad-hoc inventado pela prática) + E1 §Elementos (campo verification-tier por claim); dispensa agora declara que arbitrou contra um witness alegado (a metade carimbo TINHA witness — por isso é GO). |
| F6 | Camada 2, abertura | proveniência do vencedor creditada em uma frase: majoritariamente o candidato composto de E2 (peças 1–4 → GOs), critério de admissão de E3, diagnóstico de E1 (discovery §3 convergência) — "as alternativas desafiam um centro com autor". |
| F7 | Camada 3, "Na máquina" | aplicado em forma compacta (fix opcional do reviewer): uma linha por posição do tri-lateral (checklist-não-script constitucionalmente seguro / mecânica confinada à row até witness / "sustenta a claim" inferramentável), citando discovery §3(d) — posições são conceito, não literal; o leitor pode agora verificar que o dissenso é genuíno. |
| F8 | Camada 1, framings row 2 | coluna de origem corrigida: "tentação derivada do fato de ter funcionado duas vezes (E1 ev. 1) — nenhuma fonte o defendeu"; explicitado que E1 documenta a emergência como argumento para CODIFICAR, não para confiar na reinvenção; dispensa mantida. |
| E1 | rows re-ask e mecanização + Camada 4 bullet GO | atribuição do #17 corrigida e contradição removida: a frase falsa "não é linha da matriz" → "resolvido pela arbitragem 1 **dentro da linha #17**"; split declarado como no #9: row re-ask = "(#17, parte resolvida da linha)", row mecanização = "(#17, parte OPEN da linha)", ambas declarando o compartilhamento; o endereçamento U3 de #17 agora resolve para as duas rows com o split explícito. |
| E2 | row draft-citável + Camada 2 | guard anti-auto-citação nomeado como **sub-item declarado da row draft-citável**: "dois regimes declarados — pendente-de-emenda e vigente-já — e a row é dona dos dois" (findings §3 arbitragem 2; discovery §4.5); o ponto da Camada 2 que o assume ganhou o ponteiro ("regime próprio, declarado dentro da row"); referência a "item (i)" na Camada 4 despromovida a "a própria checagem de citação do checklist" (consistência com S2). |
| E3 | mapa: split da row ids | **arbitrado pela separação** (ver bloco abaixo): `stance:custo-dos-ids` (OPEN 6.3) separada de `stance:ids-de-claim-com-namespace` (GO #2); mapa 19 → **20 rows** (14 tensas + 6 estáveis); regra de row-com-split declarada no preâmbulo do mapa cobrindo #9 e #17. |
| E4 | Camada 4, parágrafo do mapa | paráfrase completada com as duas células perdidas: "GO e as duas adotadas A2/A3 → RESOLVED" e "OPEN → OPEN, com CRITICAL só se bloquear a spec — nenhum dos três bloqueia, todos têm default operacional". |
| E5 | "What this view does not cover" | critério de triagem declarado: "só o que esta view narra ganha handle (caso: OQ-SV-4)"; os três abertos §6 não narrados nomeados (verificação equivalente de P14 para review, witness dos pares P14, casa editorial dos contratos) como "triados, não esquecidos" — permanecem com a discovery e a spec. |
| — | frontmatter | version 0.2.0 → 0.3.0; status `draft` mantido; `last_updated` mantido 2026-06-12. |

## REJEITADAS (1)

| id | decisão | justificativa |
|---|---|---|
| S1 | **Rejeitada** (com limpeza venial da reincidência) | O token `<label>#<n>` é o default nomeado na DEFINIÇÃO do termo Claim-ID no vocabulário de trabalho (discovery §2: "identidade estável por claim citável, default `<label>#<n>`") — exatamente o regime que o próprio l2a concede a `Dissent:` ("consta do vocabulário de trabalho como nome de conceito; usá-lo não é reproduzir sintaxe"); além disso, a tensão de `stance:derivacao-de-label` é innarrável sem o termo `<label>`. O token fica no edge 2, única ocorrência narrativa. Limpeza venial concedida: a reincidência na célula de `stance:ids-de-claim-com-namespace` foi removida (a célula não precisava do token — coerente com S4). |

## ARBITRAGENS

1. **E3 — separação em duas rows (não split-na-row).** O dissenso de l2c foi acolhido contra a maioria provável: `stance:custo-dos-ids` (OPEN 6.3) ganhou row própria, separada do GO #2. Razão (critério do mandato: manter "um verdict, um status" mecânico): #2 e §6.3 são **handles de fontes distintas** fundidos — separar dá a cada row um status simples sob o mapa verdict→status (GO→RESOLVED; OPEN→OPEN) e restaura a simetria com 6.1/6.2, que já tinham rows dedicadas. O caso tiers (#9) permanece UMA row porque é UMA linha da matriz com verdict split — e o preâmbulo do mapa agora declara a regra de row-com-split que governa os dois casos de linha compartilhada (#9, #17).
2. **E2 — sub-item declarado, não row própria.** O guard anti-auto-citação mora onde a fonte o põe (discovery §4.5 o define DENTRO de 4.5; findings §3 arbitragem 2): dar-lhe row própria criaria um verdict que a matriz não tem. A row draft-citável agora declara explicitamente os dois regimes e a propriedade de ambos — quem lê só o mapa descobre a obrigação já vigente.
3. **F7 — aplicado apesar de dispensável.** O reviewer ofereceu a dispensa por compressão de altitude; apliquei a forma compacta porque posições de dissenso são conceito (não literal de spec) e a verificabilidade do "dissenso genuíno" é stake de stakeholder — sem colidir com S2/S3, que cortam literais, não posições.
4. **S1 — ver REJEITADAS.** Única rejeição; fundada na própria regra de não-itens de l2a.

## Verificação de fechamento

- Mapa: **20 rows**, handles todos distintos; 14 de tensão viva + 6 GOs estáveis; nenhuma ocorrência remanescente de "19" como total (preâmbulo, OQ-SV-1 e does-not-cover atualizados).
- Tabelas de framings: Camada 2 agora contém o competidor minimalista de E3 (F2) e Camada 3 o passo dedicado de E2 #4 (F1), ambos na forma mais forte com dispensa citada; Camada 1 sem strawman de E1 (F3).
- Handle #17: split declarado nas duas rows e na Camada 4; "não é linha da matriz" eliminado.
- Dissent de l2a honrado: F1–F21/F11 (Camada 1) e a lista de invariantes de condensação (Camada 3, "Em trânsito") intactos.
- Verificações de l2c preservadas: erratum A14 nas Camadas 3/4 e does-not-cover; split T3; A2/A3 com rows donas; LEIs sem row; KILLs com destino nomeado.
