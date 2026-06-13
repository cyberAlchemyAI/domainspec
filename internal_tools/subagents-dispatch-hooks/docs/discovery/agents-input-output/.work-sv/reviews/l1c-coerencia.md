---
tags: [agents, dispatch, review, io-contracts, coerencia, l1c, system-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: l1c-coerencia (skeptic, dispatch 2026-06-12-agent-io-system-view)
---

# Review L1c — coerência interna do system-view (agents-input-output/system-view.md)

Gate único: coerência interna. Artefato: `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md` (v0.1.0). Todos os itens abaixo são conflitos entre passagens DO próprio system-view; nenhuma fonte externa foi usada como autoridade de mérito.

## Contagens verificadas (batem)

- **Stances:** mapa tem 13 rows; OQ-SV-1 diz "todos os 13 handles"; "What this view does not cover" diz "as 13 rows apontadas acima" — ✓ consistente.
- **Camadas:** 4 (Camada 1–4), cada uma com sua tabela "Alternative framings we considered" — ✓.
- **Framings:** 3 + 5 + 5 + 4 = 17; o corpo não declara contagem de framings, então não há conflito possível — ✓.
- **Ponteiros duplicados (duas stances → mesma row):** os 13 handles de row são todos distintos — ✓. (Slugs de stance e handles de row divergem levemente — `ids-de-claim-com-namespace` → `#ids-de-claim-namespace`, `checklist-do-approver` → `#checklist-6-itens` etc. — mas como handles PROVISIONAL isso é nomenclatura, não conflito.)
- **Checklist:** "6 itens" na Camada 3, 6 itens enumerados em substância, `#checklist-6-itens` no mapa — ✓. (O "checklist de 5 itens" da tabela da Camada 1 é citação do Dissent de E1, não auto-descrição.)

## Itens

### C1 — Camada 4 promete "cada GO com sua row futura no engineer-view"; o mapa de stances não tem row para ~4 das 9 aquisições GO (severidade: alta)

- **Passagem A** — Camada 4, bullet GO: "As aquisições estruturais: envelope sobre corpo livre, **headers de fronteira**, claim-IDs com namespace, **âncoras por claim**, append-only estendido à síntese, **shape do findings**, checklist do approver (como emenda candidata), re-ask capeado, **input congelado**. Cada uma com sua base citada; **cada uma com sua row futura no engineer-view**."
- **Passagem B** — o mapa de stances ("Cada stance load-bearing do shape acima... apontando para a row do engineer-view que será sua única dona") não contém row para *headers de fronteira*, *âncoras por claim*, *shape do findings* nem *input congelado* (append-only à síntese é discutivelmente coberto por `stance:draft-citavel-do-synthesizer`).
- **Por que conflitam:** ou a promessa universal da Camada 4 é falsa (4 GOs sem row), ou o mapa está incompleto — e o mapa é exatamente o mecanismo que a view declara no Objective ("cada stance aponta para exatamente uma futura row"). O autor do engineer-view, lendo só o mapa, criará 13 rows e deixará 4 aquisições GO órfãs de dono de verdict.
- **Correção mínima:** ou (a) reescrever a frase da Camada 4 para "as load-bearing entre elas têm row própria; as demais resolvem dentro da row `stance:envelope-sobre-corpo-livre` (casca) e do shape do findings na spec", nomeando o destino agregado; ou (b) adicionar as rows faltantes ao mapa. (a) é menor.

### C2 — Coluna "Row dona ... única dona" versus OQ-SV-3 "registrar o dono externo em vez de fingir propriedade" (severidade: alta)

- **Passagem A** — preâmbulo do mapa: cada stance aponta "para a row do engineer-view que será sua **única dona**"; coluna "Row dona". Reforçado pelo fechamento: "Toda stance nomeada aqui tem seu único veredito dono lá."
- **Passagem B** — OQ-SV-3: os OPENs (mecanização 6.1, tiers 6.2, custo de IDs 6.3) "têm donos nomeados **fora desta cadeia de views**... seus fechamentos **não dependem do engineer-view deste folder** — a row correspondente deve registrar o dono externo **em vez de fingir propriedade**". Reforçado pela Camada 3: a mecanização é "decisão... **pertencente ao dono do corte do validator v0.3.0**, não arbitrado".
- **Por que conflitam:** para `stance:mecanizacao-da-validacao`, `stance:tiers-de-verificacao` e `stance:ids-de-claim-com-namespace`, o mapa afirma que a row do engineer-view será a única dona do verdict, e o OQ-SV-3 afirma que a propriedade é externa e que afirmá-la seria fingimento. As duas passagens dão donos diferentes para as mesmas três stances.
- **Correção mínima:** qualificar essas três células da coluna "Row dona", ex.: "→ engineer-view#... [PROVISIONAL; row registra dono externo — ver OQ-SV-3]" — ou uma nota de rodapé única no preâmbulo do mapa ("para stances OPEN com dono externo, a row é dona do *registro e do default operacional*, não do fechamento").

### C3 — `stance:espelho-no-frontmatter` existe no mapa mas não aparece em nenhuma camada do shape (severidade: média)

- **Passagem A** — preâmbulo do mapa: "Cada stance load-bearing **do shape acima**..." seguido da row `stance:espelho-no-frontmatter` (`dispatch_id` + `schema_version` espelhados no findings vs P3).
- **Passagem B** — nenhuma das Camadas 1–4 (nem o Surface) menciona espelho de `dispatch_id`/`schema_version` no frontmatter do findings; "frontmatter" aparece no corpo só como locus genérico do envelope (Camada 2).
- **Por que conflitam:** o mapa promete ser índice do shape narrado acima; esta stance não tem shape acima — o leitor encontra a tensão (#14, emenda 5) pela primeira vez no mapa, sem a camada explicativa que a view promete ("uma camada conceitual por vez"). Sintoma menor do mesmo tipo: `stance:derivacao-de-label` só é ancorada no corpo pelo default `<label>#<n>` do edge 2, sem a tensão narrada.
- **Correção mínima:** uma frase na Camada 2 (close/shape do findings) ou na Camada 4 (GO-condicional/emendas) introduzindo o espelho do frontmatter e sua tensão com P3 — ou remover a pretensão de completude do preâmbulo do mapa.

### C4 — Camada 3 narra o checklist como aplicado pelo approver; Camada 4 rejeita "aplicar desde já" e deixa o regime pré-emenda em aberto (severidade: média)

- **Passagem A** — Camada 3: checklist de 6 itens "**que o final_approver aplica** recebendo o working folder completo"; "é a definição executável da checagem P9 **que P12 já manda o approver fazer**".
- **Passagem B** — Camada 4, framing rejeitado: "**Checklist auto-sancionado** — aplicar os 6 itens como lei desde já... O regime do intervalo pré-emenda é decisão de quem redigir a emenda"; e `stance:regime-pre-emenda` lista três regimes possíveis, nenhum decidido.
- **Por que conflitam:** a Camada 3 descreve a aplicação no presente do indicativo, como mecânica vigente; a Camada 4 diz que aplicá-lo desde já é exatamente o framing não adotado e que o regime do intervalo está aberto. Um leitor da Camada 3 sai achando que o checklist opera hoje; um leitor da Camada 4 sai sabendo que isso é stance aberta.
- **Correção mínima:** na Camada 3, uma qualificação: "que o final_approver aplica *(no shape proposto; regime do intervalo pré-emenda: `stance:regime-pre-emenda`)*".

### C5 — O regime "deviation declarada" da Camada 4 depende de uma superfície que a própria view registra como inexistente (erratum A14) (severidade: média)

- **Passagem A** — Camada 4: "Três peças **operam sob deviation declarada** até a emenda"; Camada 3: re-ask "**declarado no close**".
- **Passagem B** — "What this view does not cover": "o erratum A14 (**o 'campo de desvios da close row' não existe no schema v0.5.2**)".
- **Por que conflitam:** o corpo apoia o regime GO-condicional e o relato do re-ask numa declaração no close, e o fechamento da view registra que o campo de desvios da close row não existe no schema vigente — sem que o corpo aponte onde a declaração mora enquanto A14 não é corrigido. O regime de honestidade "absoluta" da Camada 4 fica sem superfície executável declarada.
- **Correção mínima:** na Camada 4, após "deviation declarada", apontar a dependência: "(superfície de declaração pendente do erratum A14 — engineer-view)".

### C6 — "10 GO" afirmado na tabela da Camada 4 versus 9 aquisições GO enumeradas no corpo (severidade: baixa)

- **Passagem A** — tabela da Camada 4: "A revisão L2 derrubou a contagem de ~13 para **10 GO**".
- **Passagem B** — bullet GO da mesma camada enumera **9** itens (envelope, headers, claim-IDs, âncoras, append-only, shape do findings, checklist, re-ask, input congelado).
- **Por que conflitam:** ou a lista é não-exaustiva (e então "As aquisições estruturais:" engana — falta provavelmente a referência-leve/no-transcripts do edge 3), ou a contagem citada está errada. Como a view declara que "a contagem honesta é, ela mesma, um invariante", a discrepância 9-vs-10 dentro da mesma seção é autodescumprimento.
- **Correção mínima:** adicionar o 10º item à enumeração (ou marcar a lista como ilustrativa e remeter a contagem ao findings §2).

### C7 — KILL "round obrigatório" sem destino, contra o mapa de tradução KILL → RESOLVED-negativo (severidade: baixa)

- **Passagem A** — Camada 4: mapa de tradução proposto "KILL → **RESOLVED-negativo**" (ou seja, KILL vira row com status no engineer-view).
- **Passagem B** — bullet KILL lista dois itens: schema do corpo epistêmico (que tem destino declarado — "formalização na row `stance:envelope-sobre-corpo-livre`", Camadas 1–2) e "**`round` obrigatório em todo return**" — que não tem stance, row nem menção em nenhuma camada ou no mapa.
- **Por que conflitam:** se KILL traduz para RESOLVED-negativo, o kill do `round` precisa de uma row dona; a view não aponta nenhuma. Assimetria interna: um KILL com destino, outro sem.
- **Correção mínima:** uma cláusula no bullet KILL: "(`round`: destino na row do shape do findings/edge 5 do engineer-view)" — ou nota de que KILLs sem stance própria resolvem na row mais próxima, nomeando-a.

### C8 — "fecha esses quatro buracos, e só esses" versus peças do shape que não fecham buraco nenhum dos quatro (severidade: baixa)

- **Passagem A** — Camada 1: "O sistema de contratos existe para fechar esses quatro buracos, **e só esses**".
- **Passagem B** — o shape inclui peças sem mapeamento a qualquer dos quatro buracos: espelho no frontmatter (#14/emenda 5) e input congelado (edge 1) — este último explicitamente "não reinventa o briefing", ok, mas o espelho não é redutível a persistência seletiva nem condensação.
- **Por que conflitam:** o "e só esses" é um claim de escopo que o próprio inventário de stances excede. Menor, mas é o tipo de frase que um auditor de inflação usaria contra a view.
- **Correção mínima:** trocar "e só esses" por "e só esses — mais o relato de identidade exigido pelo ledger (espelho, `stance:espelho-no-frontmatter`)", ou suavizar para "esses quatro buracos em primeiro lugar".

### C9 — Frontmatter declara `node_type: discovery` para um artefato que se apresenta como system-view (severidade: baixa / possivelmente herança de schema)

- **Passagem A** — frontmatter: `node_type: discovery`; **Passagem B** — título, tags (`system-view`) e Objective declaram o artefato como System View, irmão DISTINTO da discovery ("A discovery v1.0.0 é a fonte que esta view minera").
- **Por que conflitam:** o corpo insiste na separação de papéis entre os quatro irmãos; o frontmatter colapsa a view no tipo do irmão que ela minera. Se o schema de frontmatter não tem valor para views, registrar isso numa linha evitaria o falso sinal.
- **Correção mínima:** ajustar `node_type` se o schema permitir; senão, comentário/justificativa de uma linha.

## Síntese

Nenhum item inverte uma decisão de mérito — coerente com o mandato da view de não decidir nada. C1 e C2 são os únicos que corrompem o mecanismo central da view (o mapa stance→row como contrato com o futuro engineer-view) e exigem edição antes de o engineer-view ser autorado; C3–C5 são fricções de regime que um leitor de camada única não consegue resolver sozinho; C6–C9 são higiene de contagem/destino/metadata. As contagens estruturais anunciadas (13 stances, 4 camadas, tabelas de framing por camada) batem.

Dissent: nenhum — mas registro que C1 admite leitura alternativa benigna (a frase da Camada 4 pode pretender "row futura" no sentido de *qualquer* row agregadora, não row própria); rejeitei essa leitura porque o Objective define o mecanismo como "cada stance aponta para exatamente uma futura row", e aquisições GO sem ponteiro nenhum não satisfazem nem a leitura fraca.
