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

# L2 changelog — draft-v2 → draft-v3 (dispatch 2026-06-12-agent-io-contracts)

Fontes: `.work/reviews/l2a-precedent.md` (P1–P6), `.work/reviews/l2b-overspec.md` (O1–O8), `.work/reviews/l2c-definicional.md` (D1–D10). Evidência contestada re-verificada antes da decisão: E2 §Idiossincrático 1 / §Anthropic / fecho do Candidato (P1, O1), E1 evidências 2/6 (O1), `register-dispatch/SKILL.md` (O2).

## APLICADAS (20 ids)

1. **P1 (MAIOR)** → autoria do tier corrigida na matriz, §3 e §5: owned? de "Não" → "Parcial — o método (verdict de verificação por claim, passo dedicado de close, consumido como gate) é da Anthropic (E2 §Anthropic CitationAgent + citation accuracy; §Idiossincrático 1 a nomeia ÚNICA dona); a taxonomia de 4 degraus e o carimbo not-re-reviewed são nossos" — exatamente a partição método/conteúdo do fecho do Candidato de E2. Ressalva de l2a preservada (citation accuracy é binário, não escada).
2. **P2 (MAIOR)** → item (i) do checklist recupera a metade semântica: "resolve para texto persistido em research.md **que de fato sustenta a claim**" (E2 Candidato #4); resolução declarada mecânica, sustentação declarada juízo do approver — segunda demoção explicitada, não silenciosa.
3. **P3 (MODERADA)** → ambiguidade interna de E2 Candidato #2 registrada na colisão 2 e na coluna owned? da linha de IDs (título claim-level vs exemplo `research.md#E2-secao` section-level — segundo voto para E3 R1); mapa de votos completo, resolução mantida.
4. **P4 (MENOR)** → dono da âncora de evidência corrigido: E2 Candidato #2 (identidade citável), não citation accuracy (que é dono do PASSO, linha 7); peso do arquivo+linha mantido no pilar witnessed/prática interna.
5. **P5 (MENOR)** → `schema_version` creditado: família message-schema + roteamento por tipo do AutoGen (E2 §Padronizado 2, §AutoGen); combinado com D9.
6. **P6 (MENOR)** → colisão 3 e linha OPEN agora nomeiam o default-checklist como "declínio provisório de E2 Candidato #5", com razão (cheiro v0.3.0, sem testemunha interna suficiente).
7. **O3** → `modelo` no header demovido a opcional/informativo; fonte canônica: sheet/dispatch row (campo `model` obrigatório do appender); nenhum check nomeado lê modelo do header (E3 R2 deriva agent+angle e para).
8. **O4 (parcial)** → circuito do consumidor de IDs fechado pelo ramo honesto: declarado que o item (i) NÃO exige granularidade de ID (satisfazível em nível de seção, como E3 R1); o consumidor que institui IDs é o briefing (expected return), e degradar a seção exige aceitação declarada do approver. GO-como-design-decision mantido sem consumidor fabricado.
9. **O5 (via categoria LEI)** → pares posição-inicial/final re-rotulados como pass-through de P14 — implementado como verdict LEI (ver arbitragem A3); witness do consumidor de conteúdo (spread inicial>0 ∧ final=0 nunca observado rodando) registrado como pendente do primeiro robot-talks real.
10. **O6** → "declarados" como ato por dispatch cortado: a lista de invariantes de condensação é propriedade FIXA do contrato; severidades marcadas OPEN dentro da lista (nenhum check nomeado as lê; sobreviveram duas vezes sem regra).
11. **O7** → guarda adicionada ao edge parent→explorer e à linha de input: a enumeração de componentes do briefing é guidance, não checklist de validação de prompt — lint de prompt recriaria `expected_output_shape`.
12. **O8** → célula witnessed da âncora de evidência reescrita: presença-habilitando (F21 refutado POR âncora presente) não vendida como ausência-quebrando; sem caso interno de ausência-de-âncora.
13. **D1** → header de fronteira re-ancorado: refinamento dos per-child headers do `domainspec-research-writer` (conceito interno nomeado); delta declarado = tipagem dos campos do header.
14. **D2** → linha "Envelope tipado" abre com o canal existente: `initial_prompt` §5 ("the return expected") — fixa o conteúdo declarado, não cria superfície nova de contrato.
15. **D3** → cláusula de condensação reclassificada como **emenda declarada à regra verbatim** (lei sem cláusula de exceção; E1 ev. 3 testemunha violação, não lacuna); alternativa re-ask registrada; verdict da linha = LEI (verbatim) + GO como emenda.
16. **D4** → pares posição-inicial/final: GO → **LEI (P14)**; deltas movidos para as linhas donas: localização no return do reviewer (linha output do reviewer + edge zig-zag) e verificação no close (item iv).
17. **D5** → checklist do approver com fonte anotada por item: (i) P9+E2#4, (ii) skill §Tension design, (iv) P14, (v) operacionalização de P9, (iii)/(vi) NOVOS — duas aquisições + quatro leis verificadas, não seis aquisições.
18. **D6** → Dissent persistida: GO → **LEI por composição** (skill §Tension design ∘ verbatim — teorema, não cláusula nova; reviewers são skeptics no chassis); nota de interação com D3 preservada (se a emenda entrar, a persistência vira invariante explícito da lista — já está).
19. **D7** → regra append-only re-ancorada: `domainspec-research-writer` ("no editing of child output") citado como precedente interno; delta declarado = extensão da imutabilidade às seções de síntese/zig-zag.
20. **D8** → extensão da definição P9 de research.md declarada explicitamente na linha do draft persistido e no edge zig-zag ("returns coletados" → "+ camada de síntese append-only"); alternativa rejeitada registrada (synthesis.md separado — F11 exige o MESMO artefato durável).
21. **D9** → `schema_version` apontado para o campo §5: "espelhado no artefato, mesma semântica, mesmo valor".

(D10 era exemplar positivo sem correção; sua nota elogiando o tier como "invenção nossa honesta" caiu junto com a declaração que elogiava — superada por P1, ver arbitragem A1.)

## REJEITADAS (1)

1. **O2 (`schema_version` → OPEN)** — rejeitado por evidência factual: l2b afirma "nenhum script existe (o validator foi cortado no §7)", mas o appender de `register-dispatch` valida `schema_version` estritamente ("Must be **exactly** `\"0.5.2\"`", exit 2 com lista completa de erros), valida `exit_reason` contra vocabulário fechado, e o grandfathering é discriminado pela AUSÊNCIA do campo (SKILL.md §dispatch-row e §Grandfathering) — o campo tem consumidor mecânico nomeado; o espelho no artefato (D9) liga o findings ao mesmo regime de validação que a deriva de E1 ev. 8 pedia. Resíduo concedido: o appender lê a row, não o frontmatter — por isso GO (menor), não GO pleno.

## ARBITRAGENS (5 dissensos)

1. **l2a P1 vs l2b O1 (tier de verificação)** → **posição intermediária do próprio l2b, com a autoria do l2a**: GO para o núcleo (carimbo `not-re-reviewed` em claims novas de reviewer + cláusula de aceitação declarada — item vi reescrito para consumir o carimbo, não a taxonomia); taxonomia completa de 4 valores "atribuída por inteiro no close" → OPEN. Por quê: o dono externo do método (P1) sustenta o passo de checagem e o núcleo com lastro real (m10: carimbo + deviation declarada), mas não a escada multi-degrau (ressalva do próprio l2a: citation accuracy é binário); `parent-verified`/`reviewer-upheld` já existem como texto citável (P9 resolve sem campo) e o único consumidor do tier completo era o item (vi) criado no mesmo documento — leitor inventado no próprio documento não conta (critério soberano do draft, E3 R5; mecanismo do `success_metric`).
2. **Categoria LEI (l2c D4/D5/D6) vs Dissent do próprio l2c ("pode ser inflação de processo"; "depende de verbatim ser lei, não guidance")** → **adotada**. O skill prescreve "collected returns, verbatim" como output — lei (E3 R4 a trata como literal); a matriz do skill é para candidatos, então contar lei como aquisição infla a contagem sob P10. Custo: uma linha de definição no preâmbulo de §2. Aquisições caem de ~13 GO para 11 GO + 2 LEI.
3. **Gate de witness vs axiomas (Dissent de l2b em O5)** → o gate NÃO vale contra axiomas, mas a forma correta não é "GO pass-through" e sim LEI: P14 não é candidato, logo não deve witness; o que o dispatch deve é a verificação (item iv) e o delta de localização. A tensão de l2b fica resolvida sem subordinar lei a witness nem fingir que o dispatch adquiriu P14.
4. **l2a Dissent vs l2c (colapsar tier em checagem de citação)** → moot: l2c não os fundiu (D10 tratou o tier como novo real); a correção aplicada foi a que o próprio l2a previu como certa — compartilhar o dono (Anthropic) sem fundir os conceitos (resolução da âncora ≠ autoridade de quem sustentou).
5. **l2c D10 (elogio ao tier como "invenção nossa honesta") vs l2a P1 (declaração factualmente errada)** → P1 vence por evidência textual: E2 §Idiossincrático 1 nomeia a Anthropic como única dona do método, e o fecho do Candidato de E2 restringe "invenção nossa" ao conteúdo. O elogio de D10 valia para a honestidade do gesto, não para a exatidão da claim.

## Estado final da matriz (18 linhas)

GO: 11 (header; IDs-design-decision; âncora; envelope; checklist-close demovido; append-only; draft persistido; output do reviewer; frontmatter menor; shape-invariantes demovido; input congelado) · GO-condicional/split: 2 (tier — núcleo GO + taxonomia OPEN; verbatim — LEI + emenda GO) · LEI: 2 (Dissent persistida; pares P14) · OPEN: 1 linha inteira (validação de envelope na coleta) + 3 resíduos (taxonomia 4-valores; custo de IDs; severidades na lista de invariantes) · KILL: 2 (schema do corpo epistêmico; `round` obrigatório).
