---
tags: [agents, dispatch, io-contracts, changelog, l2, zig-zag]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: discovery-author (turno de volta, dispatch 2026-06-12-agent-io-discovery)
---

# L2 changelog — discovery.md v0.2.0 → v0.3.0 (turno de volta do zig-zag)

Artefato revisado: `discovery.md` (status mantido `draft`; versão 0.2.0 → 0.3.0). Reviews processados: `l2a-designspace.md` (S1–S7), `l2b-overspec.md` (O1–O6), `l2c-definicional.md` (D1–D8). Pontos contestados re-verificados contra `research/findings.md` (§4 edge 2/A7, §4 Close/A14), `research/research.md` (§E1, §E2 §Candidato/§Padronizado, §E3 evidência (a)) e `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` §"Closing a dispatch" (schema da close row) antes de cada edição. Identidades entre reviews: S1≡D1, O1≡D4 — 21 ids, 19 itens distintos: **18 aplicados, 1 rejeitado em substância (S2, com aplicação parcial como nota de proveniência)**.

## APLICADAS (20 ids / 18 itens)

| id(s) | edição | uma linha |
|---|---|---|
| S1/D1 | §2 preâmbulo, §2(a), nova subseção "O limite do espaço", §2 convergência, §4 item 1 | misattribution a E2 corrigida: (a) retitulada para o candidato real de E2 (composto de 5 peças, artifact-as-contract, duas famílias citadas — research.md §E2 §Candidato/"Padronizado" 2); "tipar o corpo" apresentada como **limite do espaço que ninguém defendeu** (o Dissent de E2 a mata), não como posição de E2 nem "forma mais forte da família message-schema"; a convergência agora credita E2 explicitamente (peças 1–4; peça 5 declinada, §4 item 7). |
| D2 | §6 row helpers + §5 (novo bloco ERRATUM) | "campo de desvios da close row" (A14) demovido a **hipótese de tooling herdada do findings, refutada pelo schema atual**: verificado em register-dispatch/SKILL.md que a close row é tabela fechada (`close_of`, `exit_reason`, `agents_spawned`, `feedback_prompts`, `invoked_by`, `project_dir`, `closed`; unknown keys → exit 2) — não há campo de desvios; desvios declarados moram no corpo do close do findings. **ERRATUM upstream registrado em §5** (a propagar para a spec e para a redação das emendas); asserção "o campo de desvios existente" removida. |
| D3 | §3.2 + §5 abertos | `<label>` definido apontavelmente como **definição provisória desta discovery**: identificador curto do agente no header do return em research.md, derivado pelo strategist na sheet (ex.: `E1`, `E2`, `F`, `R1`); não é `agent_name` nem `group_id`; a spec fixa a derivação canônica (grupo + índice da row) e a unicidade entre grupos. |
| O1/D4 | §3.6 + preâmbulo + §5 abertos | cláusula "nenhuma deviation é exigida no intervalo" **demovida de regra a recomendação revisável pela spec** (movida para §5 abertos); §3.6 retém só o contraste factual (arbitragem 3 não anexa cláusula; o close do findings aplicou o checklist uma vez — witness de aplicação, não de regime); preâmbulo atualizado para listar todas as adições próprias (housing/sequência, regime pré-emenda demovido, registros de lacuna) — volta a ser verdadeiro. |
| O2 | §3.6 | enumeração dos 6 itens removida — codifica existência, contagem, escopo, regra resolução-vs-sustentação, status e defesa, com ponteiro ao texto canônico (findings §4 Close, com as tags que a paráfrase perdia); elimina a segunda cópia divergível. |
| O3 | §3.7 (4 células) | literais de contrato (enum `{UPHELD, REFUTED, DOWNGRADED→<alvo>}`, tripla de formatos de âncora, mecânica de montagem pela sheet, 3 cláusulas de load-bearing) substituídos por decisão + verdict + ponteiro a findings §4/A4/A5/edge 4 e §3 arbitragem 4 — uma cópia canônica, ponteiros no resto. |
| O4 | §3.4 | contabilidade campo-a-campo (+1, bucket literal) e placeholder `RETURN AUSENTE — <motivo>` encolhidos para "contado como helper no relato de `agents_spawned`" + ponteiro à mecânica exata (findings §4 edge 2) — reconciliado com a hipótese pendente do §6 (agora erratum D2): nenhum detalhe de row fixado no §3.4. |
| O5 | §3.2, §3.3 | sintaxe `supersedes E1#4` e disciplina inter-turnos → ponteiro a findings §4 edge 4/A8 e edge 5; token `Dissent: none — <razão>` → referido como token sancionado (A10) com sintaxe no contrato do edge 2, não aqui. Default `<label>#<n>` mantido (é a decisão, objeto do dissenso vivo). |
| O6 | §5.3 | quase-obrigação sem owner removida: "medir nos próximos dispatches" → "o OPEN só fecha com medição (findings §6.3) — esta discovery não prescreve quando nem por quem". |
| S3 | §4 declínios (novo item 9) | "lista de fontes com URL" (peça #1 de E2) registrada como elemento não-vereditado pelo findings; recomendação de não adotar pelo critério E3 R5 (âncoras por claim já cobrem), decisão da spec — registro desta discovery, marcado como tal, não KILL inventado. |
| S4 | §5 abertos (novo bullet) | colisão ev. 6 (anotação inline do parent no return) × conteúdo-congelado (E2 peça #3, §4 item 6) registrada com destino recomendado: verificação do parent como seção própria append-only assinada, nunca edição do return; a spec decide. |
| S5 | §2(b) | Tam et al. 2024 agora carrega a contestação que E3 declarou (dottxt, metodologia) e a leitura convergente da literatura posterior (degradação concentra-se DURANTE o raciocínio). |
| S6 | §5.1 | quarta forma registrada dentro do OPEN de mecanização: passo/agente dedicado de checagem de citação (E2 Candidato #4), demovido a checklist pela síntese; quem fechar o OPEN diz se o "script" de l3b a subsume. |
| S7 | §2 preâmbulo | frase de escopo adicionada: o inventário cobre o confronto de contrato de corpo/envelope; colisões de arbitragem (re-ask vs degradar-direto) moram em §3.4/§4 item 4. |
| D5 | §3.4 | base do bucket `helpers` agora cita §5 `agents_spawned` (não só P11), com a tensão interna da constituição declarada e a leitura adotada explicitada ("not written to the ledger row" = sem dispatch row própria, não fora da close row) — a confirmar na emenda. |
| D6 | §3.7 row #14 | "GO menor" → "GO (escopo menor: espelho informativo — 'menor' não é categoria do vocabulário de verdict; conta nos GO 10)". |
| D7 | §3.2 | fusão "consumidor honesto" desfeita: "consumidor (fechado pelo ramo honesto — trilha L2 do findings, O4): o briefing, não o checklist". |
| D8 | §2 preâmbulo | "entraram em colisão na pesquisa" → "na pesquisa e na sua trilha de revisão"; "quatro posições reais" → "três autoridades de explorer e um split da camada de revisão L3". |
| — | frontmatter | version 0.2.0 → 0.3.0; status `draft` mantido. Correção de coerência colateral: cross-ref do custo OPEN em §3.2 corrigida de "§6 deste documento" para "§5.3"; emenda 3 do §5 atualizada para apontar o regime demovido nos abertos. |

## REJEITADAS (1 id, com aplicação parcial)

### S2 (substância) — "acrescentar severidades à lista fixa de invariantes de condensação" — REJEITADA; nota de proveniência APLICADA

**Defesa documentada da rejeição.** O próprio l2a condicionou a severidade do achado a uma verificação que estava fora do seu escopo de fontes ("se o findings §2 #11 cortou 'severidades' deliberadamente e a discovery apenas o seguiu, S2 cai de MAJOR para nota de proveniência upstream" — l2a, Dissent). A verificação foi feita com o findings na mão e o corte É deliberado e fundamentado: findings §4 edge 2 (arbitragem K4/A7) — "**Lista fixa de invariantes preservados:** IDs, âncoras, `Dissent:`, posições inicial/final. **Severidades estão FORA da lista obrigatória (recomendadas, não exigidas — nenhum check nomeado as lê**; resolve o membro OPEN que tornava a lista inexecutável, A7)". O critério aplicado é o mesmo critério E3 R5 que governa toda a matriz (campo só entra se uma checagem nomeada o lê). A discovery se declara codificação do findings (preâmbulo): restaurar "severidades" à lista seria reabrir uma arbitragem L3 do findings dentro da discovery — exatamente o que o mandato proíbe. S2 é, portanto, **herança fiel, não perda silenciosa**.

**Aplicação parcial (o ramo "ou anotar" da correção mínima de l2a):** a row de condensação do §3.7 agora carrega a nota de proveniência — a lista de E1 (research.md §E1 "Regra de condensação") incluía severidades; o findings as excluiu deliberadamente da lista obrigatória por falta de consumidor (A7, citada) — decisão do findings, citada, não perda desta discovery.

## ARBITRAGENS (3)

1. **S1+D1 (misattribution a E2)** — acolhida integralmente nas duas formas (l2a: espantalho por misatribuição; l2c: desvio definicional do header). Re-verificado contra research.md §E2: o candidato de E2 é o composto de 5 peças e o Dissent de E2 mata a tipagem do corpo. A posição (a) foi reescrita como o candidato real; "tipar o corpo" virou subseção própria de limite do espaço, defendida por ninguém e morta unânime; §4 item 1 deixou de chamá-la de "forma mais forte da família message-schema"; a convergência credita E2. Atenuante de l2a confirmado: nenhuma peça de E2 estava perdida em substância — o defeito era de atribuição/narrativa.
2. **S2 (severidades)** — substância REJEITADA, proveniência APLICADA, conforme defesa acima: o findings §4 edge 2/A7 exclui severidades da lista fixa deliberadamente ("recomendadas, não exigidas — nenhum check nomeado as lê"); a discovery herda fielmente e agora cita a exclusão em vez de silenciá-la. O Dissent do próprio l2a previa este rebaixamento (MAJOR → nota de proveniência) caso a verificação no findings confirmasse o corte — confirmou.
3. **D2 (campo de desvios inexistente)** — acolhida com upgrade: além de remover "existente" e demover a célula do §6 a hipótese refutada, o problema foi reconhecido como **erro upstream do próprio findings (A14)** e registrado como ERRATUM em §5, a propagar para a spec e para a redação das emendas — a close row v0.5.2 é schema fechado (unknown keys → exit 2) e qualquer espelho na row exigiria campo novo + mudança de appender; até lá, `Deviation:`/`Accepted-unreviewed:` moram no corpo do close do findings.

## Verificação pós-edição

- Contagem do §3 preâmbulo intacta e fiel ao findings: **GO 10 · GO-condicional 3 · LEI 2 · OPEN 1 (+3 resíduos §6) · KILL 2**; nenhum verdict mudou (a cirurgia de O2–O5 foi de altitude — l2b: "nenhuma decisão precisa mudar de verdict").
- Nenhum OPEN decidido; novos itens de §5 são registros/recomendações marcados "desta discovery", cobertos pelo perímetro atualizado do preâmbulo; o declínio S3 está na subseção NÃO-kill de §4 com decisão delegada à spec.
- Dissensos vivos intactos (E3 R1 sobre IDs; mecanização tri-lateral — agora com quarta forma registrada); GO-condicionais seguem condicionados (3.5 com deviation até a emenda P9); LEIs seguem referenciadas, não re-adotadas.
- Literais de contrato agora têm cópia única (findings §4); a discovery aponta — coerente com o próprio §5/§6 ("evitando um segundo documento normativo que possa divergir").
