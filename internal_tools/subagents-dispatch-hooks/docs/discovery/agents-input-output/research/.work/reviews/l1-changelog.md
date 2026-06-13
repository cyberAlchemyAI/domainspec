---
tags: [agents, dispatch, research, io-contracts, p9, review, changelog]
node_type: subagents-research
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: synthesizer
---

# L1 changelog — draft-v1 → draft-v2 (dispatch 2026-06-12-agent-io-contracts)

Fontes: `.work/reviews/l1a-citacao.md` (V1–V9), `.work/reviews/l1b-inflacao.md` (I1–I12), `.work/reviews/l1c-coerencia.md` (C1–C10). Achados duplicados entre reviewers foram aplicados uma vez e listados juntos. Citações contestadas re-verificadas contra `research.md` antes da decisão.

## APLICADAS (25 mudanças, cobrindo 31 ids)

1. **V1/I5 (MAIOR — a mais grave)** → Colisão 2 reescrita honestamente: removida a atribuição falsa ("a própria leitura de E3 classifica numeração como zona segura" — a lista de E3 é "R1/R2, Dissent R5, matriz R7", sem IDs; E3 R1 nega explicitamente). A classificação "ID é envelope pós-raciocínio" agora é declarada inferência da síntese. **Resultado da colisão mudou:** de "Resolvo CONTRA E3" para decisão de design declarada com dissenso de E3 vivo e componente de custo OPEN — sem vitória fabricada.
2. **V2 (MODERADA)** → linha "Validação de envelope" (§2): "nenhum return malformado" trocado por "nenhum ALÉM da ausência de Dissent nos sete returns (E1 ev. 4), origem emissão-vs-condensação indecidível (ev. 3)"; nota de que um checklist de coleta pegaria exatamente esse caso (fortalece o lado checklist do OPEN) propagada à Colisão 3.
3. **V3** → âncora de F21 corrigida para "E1 evidência 6 + E1 §Elementos, output do explorer item 3".
4. **V4/I9** → "quando quase nada mais sobreviveu" trocado por "junto com IDs e severidades; a única perda registrada foi a linha Dissent (E1 ev. 3)" — proporção da fonte restaurada.
5. **V5** → linha "Output do reviewer": citação composta desmontada — E1 §Elementos carrega o elemento inteiro; E3 (tabela síntese) força só posições inicial/final; "P9 aplicado ao zig-zag" declarado inferência desta síntese.
6. **V6/I4** → "toda citação resolveu" demovido para "censo da seção A + amostra de 9 itens, todas resolveram; nenhuma citação contra return persistido falhou" (§2 linha 2 e §3 Colisão 1).
7. **V7/I10** → "porque nenhum check rodou no close" demovido: efeito testemunhado (passaram sem detecção até a resolução manual deste dispatch) separado da causalidade, que é a previsão do Dissent de E1, não observação (§2 linha 7 e §3 Colisão 1).
8. **V8** → quote conflacionada "F11; E2#1–2" corrigida para as duas citações reais: "C2 (F1; E2#1–2)" e "M5 (F11; ...)" (§2 linha 2 e §3 Colisão 2).
9. **V9** → âncora dupla corrigida: verbatim literal = E3 R4; degradação por hop = E3 evidência (b) (§2 linha verbatim).
10. **I1** → "custo observado zero" demovido para "nenhum custo registrado, mas custo tampouco medido; a emergência espontânea é o único sinal de custo baixo" (§2 linha 2 e §3 Colisão 2) — e o custo não-medido vira o componente OPEN da Colisão 2.
11. **I2** → disjunção de E1 ev. 4 restaurada ("ou nunca escritas, ou comidas pela condensação") em §2 (linhas Dissent e verbatim) e na abertura de §3; "tudo que quebrou foi persistência" trocado por versão de dois ramos (quebra do Dissent pode ser de emissão; o contrato cobre os dois).
12. **I3** → "GO (unânime, o mais forte)" da linha Dissent demovido para "GO (convergente — E1 e E3 explícitos, E2 silente; sem voz contrária)"; o "unânime" do KILL do schema mantido (lá os três falam explicitamente).
13. **I6 (parcial) + C9** → célula witnessed da linha "Envelope tipado" agora responde à pergunta da coluna com a testemunha real de ausência (reviewers fundidos, E1 ev. 5); a citação de §7 movida para nota de limite em sound? (delimita o teto do envelope, não testemunha ausência).
14. **I7** → witnessed dos pares posição-inicial/final demovido para "Adjacente — quebra registrada é do canal (turno absorvido), não da ausência dos pares; GO sustenta-se no forçamento por P14".
15. **I8** → tier de verificação: GO pleno → **GO condicional**, acoplado ao item novo (vi) do checklist do approver ("aceitar claim not-re-reviewed exige declaração explícita"); sem o consumidor instituído seria o próximo `success_metric`.
16. **I11/C4** → invariante do edge explorer→research.md agora carrega a marca "default operacional, forma OPEN (§3, colisão 3)" e o re-ask é rotulado decisão de design, não invariante provado; parêntese do verdict de §2 corrigido para "default: checklist; forma aberta".
17. **I12** → "quebrou exatamente onde a fronteira sumiu" demovido para "a única ausência registrada coincide com a única quebra de fronteira (E1 ev. 5)".
18. **C1 (grave)** → verdict da linha "Passo dedicado de checagem" corrigido de "(forma aberta em §3)" para "checklist de 6 itens do approver, forma FECHADA (§3, colisão 1)"; a abertura pertence só ao check de COLETA (linha OPEN), e a Colisão 1 declara isso explicitamente.
19. **C2 (grave)** → semântica de imobilidade definida: **imóvel = seções já citáveis nunca editadas; síntese e zig-zag anexam NOVAS seções append-only, marcadas por turno/round** (edge research.md→synthesizer); destino único fixado em research.md (removido o "/.work" ambíguo do payload do zig-zag — a quebra F11 exige que o veredito cite algo no MESMO artefato durável).
20. **C3** → escopo da linha `Dissent:` unificado: "todo return de agente (explorer e reviewer)" na matriz e no item (ii) do checklist; `Dissent:` adicionado ao payload de volta do zig-zag em §4; §5 corrigido ("no explorer" → "em TODO return").
21. **C5** → coluna owned? renomeada para "precedente externo OU regra interna nomeada" (régua única declarada no preâmbulo de §2); linha tier mantém "Não" com a nota de que é o único elemento sem dono em NENHUMA das duas categorias — a demoção (a) volta a seguir de critério declarado.
22. **C6** → edge "parent → explorer (briefing)" adicionado a §4, com payload = prosa de §5 da constituição e invariante "nenhum campo estruturado de input novo (KILL)"; declarado propriedade da constituição §5 (referenciado, não re-decidido).
23. **C7** → linha nova na matriz "Shape do findings: invariantes obrigatórios, shape livre" (GO demovido), fechando o circuito §3(b)↔§4; `dispatch_id` absorvido na linha de identificadores de frontmatter junto com `schema_version`.
24. **C8** → frase-resumo de §3 corrigida: "uma se resolve por demoção (1), uma como decisão de design com dissenso de E3 vivo (2), uma fica aberta (3)" — o rótulo "demoção" não encobre mais o desfecho da Colisão 2 (que, após V1/I5, deixou de ser derrota de E3 no mérito).
25. **C10** → tier movido da cláusula do reviewer para a do fechamento em §5 e marcado "atribuído por inteiro no close" em §2/§4 (só o parent sabe o que é `parent-verified`; o reviewer só carimba `not-re-reviewed` nos próprios claims).

Extra (nota de fidelidade, sem id): a inconsistência interna de E1 ("três quebras" em ev. 2 vs "duas quebras reais" no Dissent de E1) — antecipada pelo Dissent de L1a e não levantada por L1c — foi registrada explicitamente na abertura de §3 em vez de harmonizada em silêncio.

## REJEITADAS (5, com arbitragem dos dissensos inter-reviewer)

1. **I6, sub-claim "não há testemunha interna de ausência de envelope quebrando"** — rejeitada: E1 ev. 5 (reviewers fundidos num parágrafo) É uma testemunha de ausência de envelope, como o próprio C9 aponta; aplicado apenas o mismatch da citação de §7.
2. **Dissent de L1a (I6/I7 deveriam passar verdes porque as âncoras resolvem)** — rejeitado: resolver ≠ sustentar; a coluna witnessed reivindica testemunho de "ausência quebrou", e a força reivindicada é parte da claim — o gate de L1b prevalece nessas células.
3. **Dissent de L1b sobre L1c (previa L1c defendendo "unânime" como estilo e §4 como sumário legitimamente assertivo)** — moot: L1c não defendeu nenhuma das duas (C4 é o MESMO achado que I11); I3 e I11 aplicados sem conflito real a arbitrar.
4. **Dissent de L1c sobre I8 ("tier e checklist passam R5 porque o draft institui o consumidor")** — parcialmente rejeitado: o consumidor só existe se for de fato instituído; aceito a via de L1c como CONDIÇÃO (item (vi) do checklist), não como estado atual — logo GO condicional (I8), não GO pleno.
5. **Dissent de L1a sobre L1c (duas-vs-três quebras e circularidade do uso de R5 na Colisão 2 como incoerências)** — moot: L1c não levantou nenhum dos dois; o duas-vs-três é inconsistência do PRÓPRIO E1 (registrada como nota de fidelidade), e a circularidade ficou sem objeto após a reescrita da Colisão 2 por V1/I5.
