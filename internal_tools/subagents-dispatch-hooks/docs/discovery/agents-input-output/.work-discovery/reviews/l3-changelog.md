---
tags: [agents, dispatch, io-contracts, changelog, l3, zig-zag]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: discovery-author (turno final, dispatch 2026-06-12-agent-io-discovery)
---

# L3 changelog — discovery.md v0.3.0 → v1.0.0 (turno final do zig-zag)

Artefato revisado: `discovery.md` (status `draft` → `active`; versão 0.3.0 → 1.0.0). Reviews processados: `l3a-convencoes.md` (K1–K5), `l3b-lei.md` (T1–T6), `l3c-downstream.md` (U1–U7). Pontos contestados re-verificados contra `.claude/skills/custom/discovery-writing.md` (gabarito + §Mandatory Document Structure + §Downstream), `.claude/skills/custom/frontmatter.md` (enum de `status`), `subagents-strategy-constitution-proposal.md` (P3 linha 121, P12 linha 136, §5 close), `research/findings.md` §4 Close (tags [P9]/[LEI verificada]/[NOVO] dos itens i–vi) e `register-dispatch/SKILL.md` §"Closing a dispatch". **18 itens: 18 aplicados (K2 pelo ramo alternativo da própria correção), 0 rejeitados em substância.**

## APLICADAS (18)

| id | edição | uma linha |
|---|---|---|
| K1 | nova §2 Core Concepts; renumeração 2→3, 3→4, 4→5, 5→6, 6→7; todas as cross-refs internas atualizadas | seção obrigatória adicionada com os ~11 conceitos nucleares (return, envelope, corpo livre, linha estruturada de corpo, claim-ID, âncora, Dissent, vocabulário de verdict, contratos por edge, checklist do approver, re-ask helper) no formato nome + 1 frase + porquê + ponteiro — sem duplicar texto normativo; restaura o caminho de seeding dos views (ontology/system-view seedam de Core Concepts). Dissent de l3a sobre gabarito REJEITADO — ver arbitragem 1. |
| K2 | nota "Regime de edges" sob Connections | aplicado pelo ramo "OU declarar" da própria correção: forward-only declarado para os dois alvos sem inverso, com justificativa por janela de escrita — `research.md` é artefato congelado (anexar Connections violaria o imutável-no-persist que a discovery codifica) e a constituição muda por governança; o inverso em findings.md foi escrito pelo próprio dispatch antes do freeze. Nenhum alvo imóvel editado. |
| K3 | blockquote do preâmbulo movido para depois do Objective | prosa normativa não precede mais o Objective; lista de adições próprias atualizada (inclui agora o mapa U1, a fronteira U2 e as marcas de blocker U6). |
| K4 | Objective reescrito em 3 frases curtas | frase 2 (~90 palavras, travessões aninhados) dividida; vereditos numa frase, destino das emendas + KILL na terceira; gate de 3 frases cumprido pela letra E pelo espírito. |
| K5 | §7, parágrafo final | "Sequência recomendada" → "Constatações de dependência (a ordem dos passos pertence ao plano)": rito de governança da emenda 1, superfície única das 2–4, independência da 5 — sem sequenciamento. |
| T1 | §6 abertos, bullet 1 (+ ref em §4.6) | racional falso corrigido: regime pré-emenda **dividido por proveniência das tags do findings** — itens [P9]/[LEI verificada] (i, ii, iv, v) verificam lei vigente e aplicam desde já; itens [NOVO] (iii, vi) são aquisições deste dispatch, prática recomendada no intervalo, exigíveis só pós-emenda; o (iii) herda o regime de deviation da rota F* que policia. Nada promulgado. |
| T2 | §4.7 row do espelho + emenda 5 (§6) + row do cheatsheet (§7) | "espelho sancionado por P3" → "espelho lido como relato, leitura a defender CONTRA a frase final de P3 ('No other persistence surface exists for dispatch metadata')"; a emenda 5 agora exige, junto, uma linha em P3 sancionando o espelho-relato OU a demoção do espelho a redundância informativa não-autoritativa — registrado nas dependências e no veículo; nunca redigida como sanção limpa. |
| T3 | §7, row helpers | célula dividida em duas casas: bucket `helpers` = close row `agents_spawned` (campo required, já no schema v0.5.2, nenhuma mudança) + espelho no relato de corpo (P3); linhas `Deviation:`/`Accepted-unreviewed:` = corpo do close apenas (erratum A14). Fecha a regressão de contabilidade que a célula fundida autorizava. |
| T4 | §1 Why now | "recebendo apenas o working_folder (P12)" → "recebendo o working_folder completo (P12), e nunca um digest no lugar dele (research.md §E3, premissa de executabilidade)" — P12 é piso, não teto. |
| T5 | §6 ERRATUM | reforço aplicado: constituição §5 "Close of dispatch" tampouco lista campo de desvios (só `exit_reason` + `agents_spawned` portados pela row) — a hipótese A14 sem lastro nem na lei nem no tooling. |
| T6 | §6 abertos, bullet `<label>` | linha adicionada: mesma disciplina do item (iv) — a spec do research fixa a derivação de `<label>` e registra a dívida-ponteiro para review/SKILL.md (`review` reusa os roles e os headers). |
| U1 | §7, nova subseção "Mapa proposto verdict → status" | tabela de tradução marcada PROPOSTA (não decisão nova): GO/"adotada"→RESOLVED; GO-condicional→OPEN com gate nomeado (nunca RESOLVED pré-emenda); OPEN→OPEN (CRITICAL só se bloquear — nenhum bloqueia); KILL→RESOLVED-negativo; LEI→referência, não row própria (preserva a contagem honesta). O autor do engineer-view valida e registra o mapa como row própria. |
| U2 | §2 Core Concepts + §4.1 "Fronteiras de tipo" | terceira categoria nomeada: **linha estruturada de corpo** (token com gramática fixa DENTRO do corpo livre — IDs, âncoras, Dissent, posições, carimbo — sancionado iff um check nomeado o lê), distinta de envelope (fora do corpo) e de schema do corpo (objeto do KILL #6); o KILL vira fronteira de tipo não-construtível, não exceção em prosa; tensão com E3 R5 ("único campo estruturado") absorvida por nota. Marcada como nomeação do critério E3 vencedor, não decisão nova. |
| U3 | §4.7, linha "Handles" após a tabela | handle canônico de cada row = `#n` da matriz do findings na coluna base (ex.: `4.7/#14`); as duas "adotadas" usam o ID da arbitragem (`A3`, `A2`). |
| U4 | §2 Core Concepts, item "Contratos por edge" | os 5 edges glosados em uma linha cada (parent→explorer; explorer→research.md; research.md→synthesizer; synthesizer↔reviewer; synthesizer→explorers) + close — a aplicabilidade de §4.7 agora é legível sem salto ao findings. |
| U5 | nota sob Connections | mapa token-de-trilha → caminho: trilhas do findings → `research/.work/reviews/`; trilhas desta discovery → `.work-discovery/reviews/`; com declaração de status (versionadas no repo, auditáveis, não load-bearing). |
| U6 | §6 Dependências + ERRATUM | marca por item: emendas 1–2 [blocker-de-aquisição, não de redação]; 3–4 [não-blocker]; 5 [não-blocker; exige confronto com P3]; ERRATUM [blocker de redação das emendas que mencionem o espelho na row]. OPENs sem marca CRITICAL (defaults operacionais existem — coerente com o mapa U1). |
| U7 | §6 abertos, bullet `<label>` | consequência downstream registrada: enquanto a unicidade de `<label>` for OPEN, o guard de unicidade do claim-ID no ontology-view nasce PLANNED, não LIVE — pendente do fechamento do aberto, não de invenção do autor do view. |

## REJEITADAS (0)

Nenhum item rejeitado em substância. Um Dissent de reviewer rejeitado (l3a sobre o gabarito — arbitragem 1) e um ramo de correção não escolhido (K2, ramo "editar os alvos" — arbitragem 2).

## ARBITRAGENS (5)

1. **K1 — escolha de gabarito (Dissent de l3a rejeitado).** A linha 12 do discovery-writing.md roteia para `knowledge-discovery-writing.md` quando o **output** é "corpus distillation, failure-mode taxonomy, or proposed revision to a constitution/premise/axiom". O output desta discovery são decisões de design de contratos de I/O destinadas a uma spec (`research/SKILL.md`); as emendas constitucionais são **dependências** (§6) e recomendações herdadas do findings, não o deliverable. Gabarito correto: `discovery-writing.md` — Core Concepts é obrigatória e foi adicionada; a escolha fica documentada aqui (não no preâmbulo, que registra adições de substância, não de forma).
2. **K2 — ramo escolhido: declaração, não edição.** Os dois alvos sem inverso são imóveis por razões distintas (artefato congelado de dispatch fechado; constituição governada); editar qualquer um violaria exatamente a disciplina (imutável-no-persist / governança) que esta discovery codifica. O ramo "OU declarar explicitamente" da correção de l3a foi aplicado integralmente, com a justificativa da assimetria (findings.md tem inverso porque foi escrito na janela de escrita do próprio dispatch).
3. **T1 — forma do regime dividido.** Em vez de rebaixar a recomendação a "itens-vigentes-apenas" (o ramo fraco da correção), o regime foi explicitado em duas classes com a herança do (iii) declarada (regime de deviation da rota F*) — mantém o sinal recuperável dos itens [NOVO] no intervalo sem promulgar nada, e entrega ao redator da emenda 3 o racional verdadeiro em vez do falso.
4. **U2 — nome da terceira categoria.** "Linha estruturada de corpo" (structured-line-in-free-body), definida por consumo ("sancionado iff um check nomeado o lê") — o próprio critério E3 R5 que governa a matriz, agora enunciado como fronteira de tipo; marcada como nomeação, não decisão, para não inflar a contagem honesta.
5. **Status e versão finais.** O enum do frontmatter.md não tem `published`/`complete` (`draft | exploratory | active | consolidated | evergreen`); para discovery completa, no fim da trilha L3, aguardando consumo pela spec e pelos views, o valor correto é **`active`** ("current and load-bearing") — coerente com a leitura do próprio l3a ("bump devido [no] fim desta trilha L3"). Versão **1.0.0** por mandato do dispatch e precedente do próprio conjunto (findings.md está em 1.0.0); o "0.x.x" do cheatsheet lido como formato de partida, não teto.

## Verificação pós-edição

- Contagem do §4 preâmbulo intacta e fiel ao findings: **GO 10 · GO-condicional 3 · LEI 2 · OPEN 1 (+3 resíduos findings §6) · KILL 2**; nenhum verdict mudou — toda a cirurgia L3 foi de forma (K1/K3/K4/K5), tradução (U1–U7) ou honestidade de citação (T1–T6).
- Nenhum OPEN decidido; nenhuma emenda promulgada; o mapa U1 e a fronteira U2 estão marcados PROPOSTA/nomeação desta discovery, listados no perímetro do preâmbulo.
- Renumeração verificada: §2 Core Concepts novo; design space §3; decisões §4 (4.1–4.8); rejeitadas §5 (itens 1–9); open questions §6 (6.1–6.3 + dependências + abertos); caminho para spec §7. Cross-refs internas varridas: nenhum "§3.x"/"§5.x" órfão da numeração antiga; refs a "§5.x do findings" desambiguadas como "findings §5"/"emenda n (findings §5)".
- Dissensos vivos intactos (E3 R1 sobre IDs; mecanização tri-lateral); GO-condicionais seguem condicionados (4.5 com deviation até a emenda P9); LEIs seguem referenciadas, não re-adotadas; declínios de §5 seguem fora do banco de negativas.
