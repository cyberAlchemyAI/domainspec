---
tags: [review, skeptic, altitude, system-view, agents-io, dispatch-2026-06-12-agent-io-system-view]
node_type: audit
is_session: false
layer: architecture
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Review L2a — Gate: altitude — system-view.md v0.2.0

**Artefato:** `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md` (v0.2.0)
**Gate único:** a system-view explica shape-and-stakes em altitude de stakeholder — sem schemas, sem código, sem literais de spec. Critério: o stakeholder precisa ENTENDER o stake, não conseguir implementar.

**Alavanca interna:** a própria view declara, em "What this view does not cover", que o engineer-view é dono d'"os contratos literais por edge (literais de header, formatos de âncora, vocabulário fechado do reviewer, texto dos 6 itens)". Vários itens abaixo são o corpo violando esse próprio mapa de cobertura.

---

## Itens

### S1 [ALTA] — Token literal `<label>#<n>` reproduzido no corpo (Camada 2, edge 2)

**Trecho:** "com claim-IDs em namespace próprio (default `<label>#<n>` — a derivação canônica de `<label>` segue aberta...)" — e reincidência na célula de `stance:ids-de-claim-com-namespace` ("Granularidade por claim (`<label>#<n>`)").

**Por que desce demais:** o formato do token é exatamente o tipo de literal que a linha 187 entrega ao engineer-view ("formatos de âncora", literais por edge). Para entender o stake — cada claim tem identificador único e rastreável, e a regra de nomear o emissor ainda está aberta — o stakeholder não precisa da gramática do token. Reproduzi-la no corpo é spec antecipada e cria uma segunda superfície a sincronizar quando a row `stance:derivacao-de-label` decidir.

**Versão de altitude + ponteiro:** "cada claim do return recebe um identificador único no namespace do seu emissor — a regra canônica de derivar esse namespace segue aberta (`stance:derivacao-de-label`); gramática literal: findings §4 edge 2." Na célula da stance: "granularidade por claim versus o dissenso de custo de E3" — sem o token.

### S2 [ALTA] — Checklist do approver narrado item a item + carimbo literal `N/A — role ausente` (Camada 3)

**Trecho:** "Em substância: citações resolvem para texto persistido...; todo return termina em `Dissent:`; o draft do synthesizer está persistido; posições inicial/final presentes quando aplicável; nenhuma cadeia termina em 'session transcript'; claims aceitas sem re-revisão estão carimbadas e declaradas. Itens vacuosos em n=1 marcam `N/A — role ausente`, distinto de PASS."

**Por que desce demais:** a enumeração cobre os 6 itens um a um — é o "texto dos 6 itens" que a própria view diz pertencer ao engineer-view (texto canônico: findings §4 Close, já apontado na mesma frase). Apontar E narrar é duplicação que terá de ser sincronizada. O carimbo `N/A — role ausente` é texto literal de carimbo — implementação pura; o conceito ("não-aplicável é distinto de aprovado") basta.

**Versão de altitude + ponteiro:** "no close, o approver aplica um checklist que confere, sobre os artefatos persistidos, que toda cadeia claim→prova fecha e que os invariantes de emissão foram cumpridos — resolução de citação é mecânica, sustentação é juízo declarado; itens não aplicáveis são marcados como ausência de role, distinta de aprovação (texto canônico dos itens e dos carimbos: findings §4 Close; row `stance:checklist-do-approver`)."

### S3 [ALTA] — Mecânica de ledger e texto literal de corpo no re-ask (Camada 3)

**Trecho:** "contado no bucket `helpers` ... sem consumir `max_loops`. Segunda falha ou return ausente → P4 literal: partial group result, com o header SEMPRE persistido (preserva a numeração determinística) e corpo `RETURN AUSENTE — <motivo>`."

**Por que desce demais:** três descidas num parágrafo: (a) `bucket helpers` e `max_loops` são campos/contadores da row do ledger — "campos de row narrados como conteúdo"; (b) `RETURN AUSENTE — <motivo>` é texto literal de carimbo de corpo; (c) "header SEMPRE persistido (preserva a numeração determinística)" é mecânica de montagem. O stake — re-tentativa única e barata, contabilizada como ajuda sem inflar o orçamento de iteração do dispatch; segunda falha degrada a resultado parcial com a lacuna registrada de forma auditável — sobrevive inteiro sem nenhum literal. (O cap "no máximo 1" em si é o stake e fica.)

**Versão de altitude + ponteiro:** "falha de envelope admite uma única re-tentativa por agente, classificada como helper (P11) — contabilizada e relatada no close sem consumir o orçamento de iteração do dispatch; segunda falha degrada a P4: resultado parcial com a ausência registrada de forma que preserve a montagem determinística (campos do ledger e carimbo literal de ausência: findings §3 arbitragem 1 / findings §4; row `stance:re-ask-capeado`)."

### S4 [MÉDIA] — Enum literal `{UPHELD, REFUTED, DOWNGRADED→<alvo>}` no mapa de stances

**Trecho:** célula de `stance:output-do-reviewer`: "veredito exaustivo por TODO ID alheio em vocabulário fechado `{UPHELD, REFUTED, DOWNGRADED→<alvo>}` + `N*` carimbados..." — a MESMA célula já aponta "literais e ordem: findings §4 edge 4".

**Por que desce demais:** "vocabulário fechado do reviewer" é nominalmente listado na linha 187 como propriedade do engineer-view. Reproduzir o enum E apontar para o literal é a duplicação no estado mais puro: se a row mudar um membro do enum, esta célula mente. A tensão da stance (exaustividade versus custo) não depende de nenhum membro do enum.

**Versão de altitude + ponteiro:** "veredito exaustivo sobre todo ID alheio em vocabulário fechado de três desfechos, claims novas carimbadas, posições rotuladas, dissenso declarado — exaustividade versus custo por return (literais e ordem: findings §4 edge 4)."

### S5 [MÉDIA] — Nomes de campo de frontmatter/row narrados como conteúdo (`dispatch_id`, `schema_version`, `model`)

**Trecho:** Camada 2: "O frontmatter do findings espelha `dispatch_id` + `schema_version` como relato de identidade"; reincidência na célula de `stance:espelho-no-frontmatter`; e na célula de `stance:header-de-fronteira`: "(fonte canônica: campo `model` da row)".

**Por que desce demais:** nomes de campo são schema — exatamente o que "sem schemas" exclui. O stake é conceitual: o findings carrega um espelho da identidade do dispatch, a fonte de verdade permanece a row, e a sanção desse espelho confronta P3. Qual campo se chama como é decisão de forma da row (dona: register-dispatch/constituição §5), não conteúdo desta view.

**Versão de altitude + ponteiro:** "o findings espelha a identidade do dispatch no próprio artefato como relato — a fonte de verdade permanece a row do ledger; a sanção do espelho confronta a frase final de P3 (campos exatos: row `stance:espelho-no-frontmatter`, emenda 5)." Na célula de header: "modelo é informativo, com fonte canônica na row do ledger".

### S6 [BAIXA] — Aritmética de contagem de rows no preâmbulo do mapa de stances

**Trecho:** "(a promessa da Camada 4 fecha contra este mapa: 10 GOs da matriz + re-ask = 11 rows; +3 do regime condicional/split — ...; +5 de abertos, regime e tradução — ... = **19 rows**)."

**Por que desce demais:** a decomposição aritmética é bookkeeping do decision inventory — trabalho do engineer-view. O stake de altitude é a propriedade de fechamento: nenhuma aquisição ou aberto fica órfão de row. O número total (19) pode ficar como fato verificável; a conta parcelada é mecânica de conferência.

**Versão de altitude + ponteiro:** "a contagem honesta da Camada 4 fecha contra este mapa — toda aquisição GO, todo condicional e todo aberto têm exatamente uma row dona de registro (19 ao todo; decomposição e conferência: engineer-view, OQ-SV-1)."

### S7 [BAIXA] — Literais menores de mecânica espalhados: `(round N)`, "linhas rotuladas", "concat append-only ... pela sheet"

**Trecho:** célula de `stance:append-only-estendido`: "`(round N)` só quando o edge 5 dispara"; edge 4: "posições inicial/final em linhas rotuladas"; edge 2: "montado por concat append-only com ordem determinística pela sheet".

**Por que desce demais:** `(round N)` é marcador literal de seção (formato → engineer-view); "linhas rotuladas" e "concat" descrevem o COMO da emissão/montagem quando o stake é o QUÊ: posições declaradas pelo emissor de forma comparável, e montagem determinística com conteúdo do filho congelado. Individualmente veniais; somados, ensinam a implementar.

**Versão de altitude + ponteiro:** edge 2: "montagem determinística pelo registro do dispatch, com o conteúdo do filho congelado (mecânica de montagem: findings §4 edge 2)"; edge 4: "posições inicial e final declaradas pelo emissor de forma comparável"; célula append-only: "a marcação de round só existe quando o edge 5 dispara (marcador literal: findings §4)".

---

## Considerado e aprovado (não-itens)

- **F1–F21 / F11 na Camada 1:** são fatos históricos da quebra documentada, não sintaxe antecipada — narrativa do problema exige os handles reais. Passa.
- **Lista de invariantes de condensação (IDs, âncoras, `Dissent:`, posições):** a lista É o stake (o que não pode ser perdido), não formato. Passa, no limite.
- **Contagens estruturais ("cinco edges", "6 itens", "no máximo 1 re-ask"):** shape e stake, não caps de implementação. Passam.
- **O nome `Dissent:` como termo:** consta do vocabulário de trabalho (discovery §2) como nome de conceito; usá-lo não é reproduzir sintaxe. O que desce é narrar posição/formato ("como última linha") — coberto em S1/S7 por adjacência.

## Veredito do gate

7 itens (3 ALTA, 2 MÉDIA, 2 BAIXA). O esqueleto da view está na altitude certa — camadas conceituais, tabelas de framings, stances sem verdicts — mas o corpo reincide em reproduzir literais que a própria seção de cobertura entrega ao engineer-view. Nenhum item exige redesenho; todos são substituição de literal por descrição conceitual + ponteiro já existente na mesma frase ou célula.

Dissent: sustento que F1–F21/F11 e a lista de invariantes de condensação NÃO são violações de altitude (são fato histórico e stake, respectivamente) — se outro reviewer os marcar, discordo e mantenho que ficam.
