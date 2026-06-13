---
tags: [agents, dispatch, research, io-contracts, p9, review, coerencia]
node_type: subagents-research
is_session: false
layer: architecture
nature: technical, explanatory
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l1c
---

# L1c — review de coerência interna — draft-v1.md (dispatch 2026-06-12-agent-io-contracts)

**Gate único:** coerência interna do draft. Não avalio fidelidade de citação (L1a) nem inflação de escopo (L1b); só caço contradições entre seções, vereditos da matriz inconsistentes com a prosa, elementos órfãos (prosa↔matriz↔edges), e suavização no tratamento dos 3 Dissents.

**Resultado:** 10 incoerências (2 graves, 4 médias, 4 menores). Nenhuma derruba a tese central — a resposta de uma linha (§5) é, no geral, derivável dos vereditos —, mas duas contradições estruturais (C1, C2) precisam de correção antes de o draft virar findings, e o tratamento dos Dissents tem duas suavizações pontuais (C4, C8).

---

## C1 (grave) — Veredito da matriz diz "forma aberta em §3"; §3 fecha exatamente essa forma

**Passagem A** — §2, linha "Passo dedicado de checagem de citação no close", coluna verdict: "**GO demovido** (forma aberta em §3)".
**Passagem B** — §3, Colisão 1: "**Resolução por demoção:** adoto a *função* de E2 (checagem de citação como passo explícito do close) na *forma* de E1 (checklist, não agente novo nem schema), alojada [...] no `final_approver` [...]. O checklist mínimo: (i)–(v)."

**Por que conflitam:** a Colisão 1 não deixa forma alguma aberta — ela decide forma (checklist), dono (final_approver) e conteúdo (5 itens enumerados). O que §3 deixa aberto é a Colisão 3, que trata de OUTRO check (o de **coleta**, na entrada do reducer), não o de close. A própria linha da matriz se contradiz internamente: a célula sound? da mesma linha já declara "resolvido por demoção: vira checklist explícito do approver, não agente novo" — i.e., a célula sound? diz resolvido e a célula verdict diz aberto, na mesma linha. O leitor que confiar na matriz conclui que o check de close está indefinido; o leitor que confiar na prosa conclui que está fechado.

**Correção mínima:** verdict da linha → "**GO demovido** — checklist de 5 itens do approver (§3, colisão 1)". A referência a "forma aberta" pertence só à linha "Validação de envelope com falha explícita na coleta" (que já está corretamente OPEN).

## C2 (grave) — "research.md imóvel durante a síntese" vs draft e turnos do zig-zag anexados ao research.md durante a síntese

**Passagem A** — §4, edge "research.md → synthesizer", invariantes: "research.md **imóvel durante a síntese** (E3 R3)".
**Passagem B** — §4, edge "synthesizer ↔ reviewer (zig-zag)", formato: "markdown **append-only no research.md, uma seção por turno**"; payload de ida: "draft persistido com IDs próprios (`F*`) **em research.md/.work** ANTES da revisão". Também §2, linha "Draft do synthesizer": "persistido **em research.md** [...] ANTES da revisão".

**Por que conflitam:** o zig-zag acontece durante a fase de síntese. Se research.md está imóvel durante a síntese, o synthesizer não pode persistir o draft F* nele nem anexar uma seção por turno — e vice-versa: se anexa, não está imóvel. Há ainda uma ambiguidade agravante dentro do próprio §4: o payload do zig-zag diz "research.md**/.work**" (qual dos dois?), enquanto a matriz (§2) diz sem qualificação "em research.md". Três alvos declarados para o mesmo artefato: imóvel, research.md, .work.

**Correção mínima:** reescrever o invariante do edge 2 como o que E3 R3 de fato sustenta no resto do draft: "**seções de explorer já coletadas (e qualquer material já citado) são imutáveis**; a síntese e o zig-zag anexam **novas** seções append-only" — o que é coerente com a linha "Regra append-only para material já citado" da matriz. E fixar UM destino para o draft (research.md, dado que a matriz e a quebra F11 citada exigem que o veredito do reviewer cite algo persistido no mesmo artefato durável), removendo o "/.work" ou explicando-o.

## C3 (média) — Escopo da linha `Dissent:` deriva entre matriz, checklist, edge zig-zag e §5

**Passagem A** — §2, linha Dissent: "Linha `Dissent:` final, persistida no artefato durável" (genérica, sem restrição de role); §3, checklist do approver, item (ii): "**todo return** termina em `Dissent:`".
**Passagem B** — §4, edge zig-zag, payload de volta (output do reviewer): "veredito por ID alheio [...] + claims novos [...] + posições inicial E final" — **sem** linha Dissent; §5: "linha `Dissent:` persistida **no explorer**".

**Por que conflitam:** o checklist de aceitação verifica "todo return", o que inclui returns de reviewer; mas o contrato do edge que governa o output do reviewer não exige Dissent, e a resposta de uma linha restringe Dissent ao explorer. Um dispatch que siga §4/§5 à risca falha o item (ii) do checklist de §3 — a checagem exige o que nenhum contrato impôs. Como este próprio review é um return de reviewer com linha Dissent obrigatória, a prática vigente sugere que o escopo correto é "todo return"; o draft precisa escolher.

**Correção mínima:** declarar o escopo uma vez (recomendo "todo return de agente, explorer ou reviewer"), adicionar `Dissent:` ao payload de volta do zig-zag em §4, e corrigir §5 ("no explorer" → "em todo return").

## C4 (média, suavização) — Colisão 3 fica ABERTA em §3 mas aparece como invariante liso em §4

**Passagem A** — §3, Colisão 3: "**Fica ABERTA** a forma do check de coleta: checklist lido pelo strategist [...] vs script [...]. Registro como dissenso aberto; default operacional enquanto aberto: checklist."
**Passagem B** — §4, edge "explorer → research.md", invariantes: "checklist de envelope na coleta (header? Dissent? IDs?) → falha = re-ask ao agente, nunca conserto silencioso pelo parent" — afirmado sem qualificação, sem marca de abertura. Também §2, linha "Validação de envelope", verdict OPEN com parêntese "**checklist na coleta sim**; script executável sem testemunha" — que apresenta o checklist como decidido, quando §3 o apresenta como *default enquanto aberto*.

**Por que conflitam:** é exatamente o padrão que o gate manda caçar — uma colisão declarada aberta que a tabela operacional re-apresenta como resolvida. Não é fatal (o conteúdo do invariante coincide com o default), mas apaga o sinal de que a decisão pode ser revertida para script: quem ler só §4 nunca saberá que existe dissenso vivo ali.

**Correção mínima:** no invariante de §4, acrescentar "(default operacional — forma em aberto, §3 colisão 3)"; no parêntese do verdict de §2, trocar "checklist na coleta sim" por "default: checklist; forma aberta".

## C5 (média) — Semântica da coluna "owned?" é inconsistente, e isso torna arbitrária a exigência de declarar o tier como "invenção"

**Passagem A** — §2: a linha `Dissent:` responde owned? "Sim — exigência literal do SKILL §Tension design (E3 R5)" e a linha pares posição-inicial/final responde "Sim — forçado literal por P14 (E3 R6)" — ambas citando **regra interna** como dono.
**Passagem B** — §2, linha tier de verificação: owned? "**Não** — proveniência por claim não tem dono no ecossistema (E2 §Idiossincrático 1)"; e §3: "(a) o tier de verificação por claim é **invenção nossa sem dono externo** [...] deve ser declarado invenção, não adoção".

**Por que conflitam:** a coluna se intitula "owned? (**precedente** define?)". Se "precedente" = ecossistema externo, então Dissent e pares posição/final também são "Não" (são exigências internas do SKILL/constituição, sem dono externo citado) e deveriam, pelo critério de §3(a), ser igualmente declarados invenção. Se "precedente" inclui regra interna, então o tier não é o único órfão e a demoção (a) perde a base que a singulariza. O draft usa a definição externa para penalizar o tier e a definição interna para abençoar Dissent/P14 — duas réguas na mesma coluna.

**Correção mínima:** renomear a coluna para "owned? (precedente externo OU regra interna nomeada)" e, na linha tier, manter o "Não" com a nota de que é o único elemento sem dono em **nenhuma** das duas categorias — aí a demoção (a) volta a seguir de um critério declarado.

## C6 (média) — Input de briefing tem veredito na matriz mas nenhum edge em §4

**Passagem A** — §2, linha "Input por role = prosa de briefing (goal+context+angle+expected return+token_budget), sem schema": verdict "**GO** (congelar; KILL para qualquer campo estruturado de input novo)".
**Passagem B** — §4: a tabela de contratos por edge cobre explorer→research.md, research.md→synthesizer, zig-zag, feedback e close. **Não existe edge parent→explorer (briefing)** — o único elemento de input com veredito próprio na matriz não tem linha de contrato.

**Por que conflitam:** o gate pede simetria prosa/matriz↔edges. O goal do dispatch pergunta o que os contratos de **input** e output devem conter; a matriz responde para o input (congelar §5), mas a seção que materializa contratos omite o edge de input primário. O leitor de §4 não consegue reconstruir o contrato de briefing sem voltar à matriz.

**Correção mínima:** ou adicionar a linha de edge "parent → explorer (briefing)" com payload = prosa de §5 da constituição e invariante "nenhum campo estruturado novo (KILL, §2)", ou declarar explicitamente em §4 que esse edge é propriedade da constituição §5 e está fora da tabela por congelamento.

## C7 (menor) — Demoção do "shape da matriz de vereditos" é decidida em §3 e consumida em §4, mas não existe como elemento em §2

**Passagem A** — §3, demoção (b): "o shape literal da matriz de vereditos do SKILL nunca foi usado [...] o contrato deve exigir os invariantes [...], não o shape".
**Passagem B** — §4, edge close, payload: "matriz de vereditos (**ou shape equivalente preservando os invariantes**)". §2: nenhuma linha para "shape do findings/matriz de vereditos".

**Por que conflitam:** é uma decisão de contrato (com testemunha citada, E1 evidência 7) que circula entre prosa e edge sem nunca receber linha e veredito na matriz — o documento estabelece que vereditos moram na matriz e depois emite um veredito fora dela. O mesmo vale, em grau menor, para `dispatch_id`, que aparece no frontmatter exigido pelo edge close sem linha própria (só `schema_version` ganhou uma).

**Correção mínima:** adicionar uma linha "Shape do findings: invariantes obrigatórios, shape livre" (verdict: GO demovido) e absorver `dispatch_id` na linha de `schema_version` ("identificadores de frontmatter").

## C8 (menor, suavização) — "duas se resolvem por demoção" mischaracteriza a Colisão 2

**Passagem A** — §3, abertura: "As três linhas `Dissent:` previram colisões; **duas se resolvem por demoção**, uma fica aberta."
**Passagem B** — §3, Colisão 2: "**Resolvo CONTRA E3** usando o critério do próprio E3 [...]. Demovo apenas a força".

**Por que conflitam:** a Colisão 2 não é uma demoção simétrica como a 1 (onde a função de E2 foi adotada em forma rebaixada) — é uma derrota da posição de E3, com uma concessão parcial na força do requisito. Chamar ambas de "demoção" suaviza o fato de que um explorer perdeu a colisão inteira no mérito. O corpo da Colisão 2 em si é exemplar (declara "CONTRA", dá o critério); só a frase-resumo dilui.

**Correção mínima:** "uma se resolve por demoção (1), uma contra E3 com concessão de força (2), uma fica aberta (3)".

## C9 (menor) — Célula witnessed? da linha "Envelope tipado" não responde à pergunta da coluna

**Passagem A** — §2, cabeçalho da coluna: "witnessed? (**ausência quebrou?**)".
**Passagem B** — §2, linha "Envelope tipado (frontmatter/headers) sobre corpo livre", célula witnessed?: "Sim — §7 da constituição: campo estruturado que nenhum check consome vira vácuo e é cortado".

**Por que conflitam:** a evidência citada é sobre **presença** de estrutura não consumida sendo cortada — é testemunha do limite superior do envelope (não crescer), não de que a *ausência* de envelope quebrou algo. A testemunha de ausência que o próprio draft possui está na linha 1 (reviewers fundidos num parágrafo sem fronteira, E1 evidência 5), não nesta célula. O veredito GO provavelmente sobrevive, mas a célula responde a outra pergunta.

**Correção mínima:** mover/duplicar a testemunha de ausência real (E1 evidência 5 ou a quebra de persistência da evidência 2) para esta célula e deslocar a citação de §7 para a célula sound? ou para uma nota de limite.

## C10 (menor) — Quem produz o tier de verificação: §5 diz reviewer, §4 diz findings (close), §2 diz "consumido pelo approver"

**Passagem A** — §5: "veredito por ID alheio **com tier de verificação** e posições inicial/final **no reviewer**".
**Passagem B** — §4, edge close, payload: "findings.md: [...] **tier de verificação por claim**" (produto do synthesizer no fechamento); edge zig-zag: reviewer só carimba os **próprios** claims novos com `not-re-reviewed`.

**Por que conflitam:** o enum do tier (`explorer-claimed | reviewer-upheld | parent-verified | not-re-reviewed`) só pode ser atribuído por inteiro no close (só o parent sabe o que é `parent-verified`), o que bate com §4; mas §5 aloca o tier no output do reviewer, que pelo edge zig-zag só atribui um dos quatro valores. Pequeno, mas é a resposta de uma linha ao goal — o lugar onde a inconsistência mais custa.

**Correção mínima:** em §5, mover "tier de verificação" da cláusula do reviewer para a cláusula do fechamento ("...e fechados por findings com tier de verificação por claim e checklist P9 explícito do approver").

---

## Veredito do gate

A espinha do draft é coerente: o KILL unânime do schema de corpo, o GO do envelope, a resolução das Colisões 1–2 e a abertura honesta da Colisão 3 são consistentes entre matriz, prosa e §5 **no mérito**. As falhas são de propagação: decisões tomadas em §3 não retro-propagadas para a matriz (C1, C7), invariantes de §4 que sobre-afirmam (C2, C4) ou sub-especificam (C3, C6) o que a matriz e a prosa decidiram, e duas réguas distintas na mesma coluna (C5). Tratamento dos 3 Dissents: genuíno em substância (nenhuma colisão foi dissolvida por paráfrase; a Colisão 2 declara explicitamente "CONTRA E3"), com duas suavizações localizadas — C4 (abertura da Colisão 3 apagada na tabela operacional) e C8 (rótulo "demoção" aplicado a uma derrota). Nenhum item exige re-dispatch; todos são corrigíveis por edição do draft.

Dissent: prevejo discordar de L1a se ela tratar as citações grossas de §3/§4 (e.g. "E1 evidência 2" reutilizada como âncora de quatro claims distintos) como quebra fatal da cadeia P9 — para o gate de coerência esses usos são mutuamente consistentes e o defeito, se existir, é de resolução de citação, não de contradição; e prevejo discordar de L1b se ela classificar o tier de verificação por claim e o checklist de 5 itens do approver como inflação de contrato — internamente ambos são consumidos por uma checagem nomeada que o próprio draft institui (aceitação do approver), logo passam o critério R5 que o draft adota; minha objeção a eles é de coerência de autoria e propagação (C5, C10), não de tamanho.
