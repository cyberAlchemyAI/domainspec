---
tags: [agents, dispatch, io-contracts, changelog, l1, zig-zag, system-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: system-view-author (turno de volta, dispatch 2026-06-12-agent-io-system-view)
---

# L1 changelog — system-view.md v0.1.0 → v0.2.0 (turno de volta do zig-zag)

Artefato revisado: `system-view.md` (status mantido `draft`; versão 0.1.0 → 0.2.0). Reviews processados: `l1a-fidelidade.md` (V1–V5), `l1b-decisao.md` (I1–I7), `l1c-coerencia.md` (C1–C9). Pontos contestados re-verificados contra `discovery.md` v1.0.0 (§4.7, §5 item 9, §6, §7) e `research/findings.md` (§2 #9/#12, §3 arbitragens, §4 edges 2/4, §5, §6) antes de cada edição. Identidades entre reviews: V2≡C1 (mesma quebra mapa-vs-promessa), V3≡I5≡C2 (mesmo cluster de propriedade dos OPENs), I1/I2 (mesma classe de localidade). 21 ids, 18 edições distintas.

## Decisão declarada V2/C1 — ramo (a)

**Adotado o ramo (a): rows novas para os GOs órfãos.** Seis stances de tensão baixa adicionadas ao mapa, cada uma com ponteiro próprio: `stance:header-de-fronteira` (#1), `stance:ancoras-por-claim` (#3), `stance:append-only-estendido` (#10), `stance:output-do-reviewer` (#13), `stance:shape-do-findings` (#15), `stance:input-congelado` (#16). Mapa: 13 → **19 rows**. Por quê (a) e não (b): preserva intacta a promessa do Objective ("cada stance aponta para exatamente uma futura row") sem reescopá-la, e entrega ao autor do engineer-view o inventário completo — nenhuma aquisição GO órfã de dono de registro (o risco que C1 nomeia). As adotadas A2/A3 resolvem dentro de rows nomeadas (A2 → `stance:shape-do-findings`; A3 → `stance:checklist-do-approver`) — destino agregado nomeado, não verdict novo. Fechamento aritmético declarado no preâmbulo do mapa: 10 GOs da matriz + re-ask = 11; +3 condicionais/split; +5 de abertos/regime/tradução = 19; Camada 4, OQ-SV-1 e "does not cover" atualizados para a mesma contagem.

## APLICADAS (21 ids / 18 edições)

| id(s) | edição | uma linha |
|---|---|---|
| V1 | Camada 4, bullet GO-condicional | re-narração do #9 corrigida: a metade carimbo + cláusula é **GO desde já, sem deviation**; a metade taxonomia é OPEN condicionada a **consumidor futuro não-circular** — nenhuma emenda pendente a destrava (findings §2 #9, §6.2); "deviation até a emenda" restrito às duas peças que de fato pendem emenda (F* → §5.1; condensação → §5.2). |
| V2/C1 | mapa + Camada 4 + OQ-SV-1 + does-not-cover | ramo (a) executado — ver bloco acima; promessa e mapa fecham exatamente em 19. |
| V3/I5/C2 | preâmbulo do mapa + 3 células + OQ-SV-3 + Camada 4 framings row 4 + fechamento | distinção registro-vs-fechamento: a row do engineer-view é dona do **REGISTRO** da decisão; quando o dono da RESOLUÇÃO é externo (OPENs de owner), a row registra o **encaminhamento** — células de `mecanizacao`, `tiers` e `ids-de-claim` marcadas `[registro + encaminhamento — OQ-SV-3]`. OQ-SV-3 reescrito: dono nomeado só para 6.1 (dono do corte do validator v0.3.0); 6.2 aguarda consumidor não-circular; 6.3 aguarda medição ("aguardando owner/witness/consumidor" é disjunção); a prescrição "deve registrar... em vez de fingir propriedade" demovida a constatação — a redação da row é do autor do engineer-view (I5). |
| I1 | Camada 2, edge 4 + "o que o shape compra" | marcador condicional inline reposto nos dois pontos onde a rota F* aparece: "(rota GO-condicional — pende emenda §5.1; deviation declarada por dispatch até lá)"; "garante que... é prova citável" → "destina... a também ser prova citável"; guard anotado "obrigatório desde já" (fiel à arbitragem 2). |
| I2 | Camada 3, "Em trânsito" | marcador condicional inline reposto no título do parágrafo: "(rota GO-condicional — pende emenda §5.2 ao skill; deviation declarada até lá; row dona: `stance:condensacao-carimbada`)"; "ela é executada" → "a rota decidida pelo dispatch é". |
| I3 | Camada 1, framings row 3 | argumento próprio sem fonte substituído pela convergência citada (checklist E contratos de emissão juntos — findings §3, primeira linha; arbitragem 3) + rows donas do peso relativo; raciocínio mantido na célula, conforme o Dissent de l1b (dispensa citada + row dona, não paráfrase vazia). |
| I4 | Camada 2, framings row 5 + OQ-SV-4 novo | célula reescrita como elemento que o findings **não veredita** (lacuna S3) com recomendação revisável da discovery §5 item 9; dispensa ganhou handle próprio: **OQ-SV-4** (dono: autor da spec). Handle como OQ e não stance: a fonte atribui o veredito à spec, não ao engineer-view — uma stance prometeria row de verdict onde a fonte não a põe. |
| I6 | OQ-SV-1 | recomendação de processo própria demovida: "Insumos disponíveis: esta view + discovery §4/§7"; o registro do mapa verdict→status como row própria atribuído ao que a discovery §7 já propõe. |
| I7 | Camada 2, framings row 1 | cláusula que fechava o framing agora citada: quebra de persistência (E1; research.md §E1 Dissent) + convergência decidida artifact-as-contract (findings §3, primeira linha) + row `stance:envelope-sobre-corpo-livre`; raciocínio mantido (Dissent de l1b). |
| C3 | Camada 2, Close + edge 2 | espelho `dispatch_id` + `schema_version` introduzido no shape (Close da Camada 2), com a tensão contra a frase final de P3 e ponteiro à row; sintoma menor coberto: tensão de `<label>` ancorada no edge 2 ("derivação canônica segue aberta — `stance:derivacao-de-label`"). |
| C4 | Camada 3, checklist | qualificação inserida: "que o final_approver aplica *(no shape proposto; o regime do intervalo pré-emenda é stance aberta — `stance:regime-pre-emenda`)*" — Camadas 3 e 4 agora coerentes. |
| C5 | Camada 4 GO-condicional + Camada 3 re-ask | superfície da declaração nomeada: deviation/declarações moram no **corpo** do close do findings — o "campo de desvios da close row" não existe no schema vigente (erratum A14); clause também no re-ask "declarado no close (no corpo — erratum A14)". |
| C6 | Camada 4, bullet GO | enumeração agora reconstrói a contagem: os **10 GOs da matriz** nomeados (incluindo output do reviewer #13 e espelho #14, antes ausentes), re-ask separado como resolução da arbitragem 1 (não linha da matriz), A2/A3 com destino nomeado. |
| C7 | Camada 4, bullet KILL | destinos nomeados: schema do corpo → row `stance:envelope-sobre-corpo-livre`; `round` obrigatório → row `stance:append-only-estendido` (onde a marcação `(round N)` do edge 5 mora); regra geral declarada: KILL sem stance própria resolve na row mais próxima, nomeada. |
| C8 | Camada 1, fechamento | "e só esses" → "em primeiro lugar — mais o relato de identidade exigido pelo ledger (espelho, `stance:espelho-no-frontmatter`)" — claim de escopo agora bate com o inventário. |
| C9 | frontmatter | `node_type: discovery` mantido com justificativa de uma linha em comentário: o schema de frontmatter (`frontmatter.md`) não tem valor para views; o tipo real está em tags + título. Não inventei valor fora do enum. |
| V4 | mapa, row envelope | "(handle 4.7/#5, #6)" → "(matriz #5, #6 — discovery §4.1/§4.8)" — a convenção U3 só cobre rows da tabela §4.7. |
| V5 | Camada 4, framings row 1 | contagem destruncada: "~13 para 10 GO + 3 GO-condicional (findings §3; pela trilha §8, a forma final fecha em L3)"; atribuição "L2" generalizada para "a trilha de revisão". |
| — | frontmatter | version 0.1.0 → 0.2.0; status `draft` mantido; `last_updated` mantido 2026-06-12. |

## REJEITADAS (0) — com 2 desvios declarados da reescrita sugerida

Nenhum item rejeitado. Dois desvios da letra sugerida pelos reviewers, ambos a favor do Dissent de l1b sobre tabelas de framing (dispensa citada + row dona, não remoção de raciocínio):

1. **I3/I7:** as células mantêm o raciocínio dispositivo (não foram reduzidas a paráfrase), mas todo elo agora cita fonte ou aponta row dona — o padrão das células boas da própria view.
2. **I4:** o handle da dispensa virou **OQ próprio (OQ-SV-4)** em vez de stance — l1b pedia "stance ou OQ"; OQ escolhido porque a fonte (discovery §5 item 9) atribui o veredito à spec, fora desta cadeia de views, e uma stance criaria row de verdict no engineer-view que a fonte não autoriza.

## Verificação de fechamento

- Mapa: **19 rows**, handles todos distintos; 13 de tensão viva + 6 GOs estáveis marcados.
- Promessa da Camada 4 ("cada uma com sua row no mapa") fecha contra o mapa: 10 GOs matriz + re-ask = 11 rows ✓; A2/A3 com destino agregado nomeado ✓; GO-condicionais 3 ✓; OPENs com `[registro + encaminhamento]` ✓; KILLs com destino nomeado ✓; LEI sem row (mapa de tradução) ✓.
- Contagens no texto: OQ-SV-1 "19 handles" ✓; does-not-cover "19 rows" ✓; nenhuma ocorrência remanescente de "13 handles/rows" como total.
