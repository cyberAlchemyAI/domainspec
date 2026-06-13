---
tags: [agents, dispatch, review, io-contracts, framings, system-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l2b-framings (skeptic, dispatch 2026-06-12-agent-io-system-view)
---

# Review L2b — justiça dos framings (system-view.md v0.2)

Gate único: cada tabela "alternative framings we considered" (Camadas 1–4) apresenta as alternativas na forma MAIS FORTE que suas fontes defendem? Método: resolução manual de cada linha das quatro tabelas contra `research/research.md` (returns E1/E2/E3 verbatim) e `discovery.md` v1.0.0 §3 (design space). Classes caçadas: (a) posição de fonte enfraquecida/strawman; (b) framing registrado na discovery §3 ausente das tabelas; (c) framing fabricado sem fonte (fora do limite declarado "tipar o corpo"); (d) dispensa cuja citação não mata o framing dispensado.

## O que passou no gate (registrado antes das violações)

- O limite "tipar o corpo epistêmico" é tratado com exatidão em ambas as ocorrências (Camada 1 r1, Camada 2 r2): marcado "ninguém o defendeu", dispensa cita E1 Dissent + E2 "Padronizado" 4 + discovery §5 item 1 — as citações matam mesmo o framing. ✓
- A família message-schema (Camada 2 r1) é atribuída como "Levantamento de E2", não como posição de E2 — fiel à correção da discovery §3(a) ("material *reportado* por E2, não posição de E2"); a dispensa cita corretamente E2 "Padronizado" 2 ("sistemas de research de longa duração convergem para a segunda família"). ✓
- A peça #1 de E2 (lista de fontes com URL, Camada 2 r5) é a dispensa mais honesta do documento: nem adota nem rejeita, registra a lacuna S3, e cria handle próprio (OQ-SV-4) para a dispensa não ficar órfã. ✓
- Conserto silencioso pelo parent (Camada 3 r3): a citação (E1 ev. 3) mata mesmo o framing — é exatamente o canal que degradou as linhas `Dissent:`. ✓
- Remoção total do re-ask (Camada 3 r2) e anotação inline do parent (Camada 3 r5): formas e dispensas fiéis à arbitragem 1 e à colisão S4 respectivamente. ✓

## Violações (F1…)

### F1 — [Camada 3, tabela / framing AUSENTE] A peça #4 de E2 — passo dedicado de checagem de citação — não aparece como framing alternativo ao checklist de 6 itens. **ALTA**

A Camada 3 apresenta o checklist do approver como o destino natural da "peça sem dono no ecossistema externo (checagem de citação por claim)". Mas a forma MAIS FORTE que a fonte defende para essa peça não é checklist lido por humano no close — é **passo/agente dedicado pós-síntese** (E2 Candidato #4: "um verificador mecânico/agente que percorre cada claim de findings.md e confirma que a âncora citada existe em research.md e sustenta o claim. **É aqui que a verificabilidade mora** — não em tipar mais o payload"; precedente Anthropic CitationAgent + "citation accuracy como gate"). A discovery registra essa posição DUAS vezes: §3 convergência ("aqui demovida a checklist de close") e §6.1 ("Quarta forma registrada dentro deste OPEN … o passo/agente dedicado de checagem de citação (E2 Candidato #4) … se o 'script' de l3b a subsume, quem fechar o OPEN deve dizê-lo" — correção S6). A tabela da Camada 3 lista a peça #5 de E2 mas não a #4: o leitor da view vê o checklist sem o seu competidor mais forte, que a discovery mantém VIVO dentro do OPEN 6.1. Critério (b) do gate violado com registro explícito na discovery. **Fix:** linha nova na tabela da Camada 3 — framing "checagem de citação como passo/agente dedicado (E2 #4, Anthropic)", dispensa "demovida a checklist pela síntese; permanece quarta forma dentro do OPEN 6.1 (S6)", apontando para `stance:mecanizacao-da-validacao`.

### F2 — [Camada 2, tabela / framing AUSENTE] O contrato mínimo completo de E3 — resolução em nível de SEÇÃO, sem IDs/âncoras por claim — não aparece como shape alternativo. **ALTA**

A discovery §3(b) registra o minimalismo de E3 como posição inteira e na forma mais forte: "só é forçado o que torna as checagens já prescritas executáveis" + a tabela "Síntese do mínimo forçado" de E3, que é um SHAPE alternativo completo e concorrente. E3 R1 é explícito que o shape adotado excede o mínimo: "**Não forçado:** IDs numéricos por parágrafo, offsets de linha, âncoras por claim … resolução em nível de seção satisfaz 'cites the return it rests on'. Granularidade além disso é custo sem regra que a exija." A view absorve o CRITÉRIO de E3 como vencedor (Camada 2, abertura) e relega o dissenso a uma linha de tensão no mapa de stances — mas a tabela de framings da Camada 2, onde o shape com IDs-por-claim + âncoras-por-claim é apresentado, não tabela o shape mínimo de E3 como alternativa. Efeito: o envelope rico adotado não enfrenta nenhum competidor minimalista na tabela; o dissenso vivo de E3 (OPEN 6.3, custo não medido) fica invisível na camada onde a escolha é narrada. **Fix:** linha nova na tabela da Camada 2 — framing "contrato mínimo derivado: fronteira por seção, sem granularidade por claim (E3 R1, tabela 'Síntese do mínimo forçado')", dispensa citando E1 ev. 1 (namespaces emergiram 2x e fizeram P9 barata) + a nota da discovery §4.2 ("decisão de design declarada, não vitória sobre E3"), apontando para `stance:ids-de-claim-com-namespace`.

### F3 — [Camada 1, r3 / posição ENFRAQUECIDA] O Dissent de E1 é convertido de claim comparativo em posição exclusiva que E1 nunca defendeu. **MÉDIA-ALTA**

A célula rotula como "Posição de E1" o framing "O problema é o approver: bastava checar mais forte no close". O Dissent de E1 é comparativo, não exclusivo: as quebras "seriam pegas por um checklist de 5 itens no close, **não por um schema executável**" — um argumento ANTI-mecanização, não um argumento de que o checklist sozinho basta. O próprio E1 propõe contratos de emissão na seção "Elementos de contrato que a prática implica": draft do synthesizer persistido antes da revisão ("a camada F dangling é a maior quebra observada"), `Dissent:` "OBRIGATÓRIA E PERSISTIDA … imune à condensação", lista de invariantes sob condensação, persistência integral para reviewer/synthesizer. Ou seja: E1 já defendia "checklist E contratos de emissão" — exatamente a convergência que a célula apresenta como correção à "posição de E1". A dispensa ("parcialmente absorvida") absorve um strawman. **Fix:** reescrever a célula: o framing real de E1 é "checklist no close em vez de schema executável" (alvo: mecanização), e a fonte dos contratos de emissão inclui o próprio E1 §Elementos — a tensão restante (peso relativo checklist vs emissão) permanece corretamente apontada às rows.

### F4 — [Camada 3, r1 / posição ENFRAQUECIDA] E2 Candidato #5 entra sem seu racional mais forte. **MÉDIA**

A célula reduz a peça #5 a um nome ("E2 Candidato #5") e à dispensa ("cheiro v0.3.0", declínio provisório). A forma mais forte na fonte: falha explícita em vez de degradação silenciosa — return malformado "é **rejeitado** na entrada do reducer, não absorvido", e E2 §AutoGen chama isso de "o argumento mais forte do levantamento para validar o envelope do return … mecanicamente". Dado que a degradação silenciosa É o diagnóstico central do problema (E1 ev. 3), o racional omitido é diretamente pertinente — sua omissão faz o declínio parecer mais fácil do que foi. A dispensa em si é honesta (provisório, não kill; roteado ao OPEN). **Fix:** uma linha na coluna "De onde veio": "rejeição explícita em vez de absorção silenciosa — 'o argumento mais forte do levantamento' (E2 §AutoGen)".

### F5 — [Camada 3, r4 / ATRIBUIÇÃO apagada] A taxonomia de 4 tiers perde seu defensor (E1) e seu witness-de-necessidade. **MÉDIA**

"De onde veio" diz apenas "Metade do split do elemento #9". A fonte é E1, com defesa forte baseada em prática: a prática inventou o marcador ad-hoc ("*(Reviewer-stage: not adversarially re-reviewed)*" em m10 — "sinal de que o contrato precisava desse campo e ele não existia", E1 ev. 2, compensação ad-hoc) e E1 §Elementos propõe o campo por claim com os 4 valores. A dispensa ("sem witness de ausência e sem consumidor não-circular") está correta quanto ao veredito do findings, mas sem a evidência de E1 na coluna de origem o leitor não vê que a dispensa precisou ARBITRAR contra um witness alegado (o split #9 existe exatamente porque a metade carimbo TINHA witness). **Fix:** "De onde veio: E1 ev. 2 (marcador inventado ad-hoc pela prática) + E1 §Elementos (campo verification-tier por claim)".

### F6 — [Camada 2, prosa+tabela / PROVENIÊNCIA do vencedor] O shape vencedor nunca é creditado como majoritariamente o candidato composto de E2. **BAIXA-MÉDIA**

Discovery §3 convergência: o contrato vencedor "é, em substância, **majoritariamente o candidato composto de E2** (peças 1–4 aterrissam nos GOs de §4; a peça 5 é declinada provisoriamente)". A view narra o vencedor como produto neutro da convergência (Camada 2 abre com o vocabulário da discovery e o critério de E3); os framings alternativos aparecem como desafiantes de um centro sem autor. Justiça de framing corta nos dois sentidos: a alternativa mais forte deve aparecer forte, e o vencedor deve carregar sua proveniência — sem isso, a tabela sugere que as 5 peças de E2 foram "consideradas e dispensadas" quando 4 delas SÃO o shape. **Fix:** uma frase na abertura da Camada 2 creditando a arquitetura ao composto de E2 (peças 1–4), com o critério de admissão vindo de E3 e o diagnóstico de E1.

### F7 — [Camada 3, prosa / COMPRESSÃO] As três posições de mecanização são nomeadas mas nenhuma recebe sua forma de uma linha. **BAIXA**

"Na máquina" registra "dissenso genuíno de três posições, não arbitrado" — fiel, mas vazio: l3a (checklist-não-script é o único default constitucionalmente seguro; o corte v0.3.0 é lei), l3b (mecânica confinada à row ATÉ witness interna de malformação que checklist lido não pegue), l3c (o item (i) — "sustenta a claim" — é inferramentável por construção) cabem em uma linha cada (discovery §3(d)). Sem elas o leitor não pode verificar que o dissenso é genuíno, só acreditar. Defensável em altitude de stakeholder; registrado porque a tabela da Camada 3 cobre apenas a variante coleta (E2 #5), deixando o tri-lateral inteiramente sem forma. **Fix opcional:** parêntese de uma linha por posição na prosa, ou na célula da r1.

### F8 — [Camada 1, r2 / citação que NÃO sustenta a origem] "Bastava disciplina do parent" citado a E1 ev. 1, que argumenta na direção oposta. **BAIXA**

A célula dá como origem "Prática registrada — deu certo duas vezes sem regra (E1 ev. 1)". E1 ev. 1 não defende confiar na reinvenção: documenta que os namespaces emergiram 2x "sem que P9 ou o SKILL exijam isso em lugar algum" como argumento para CODIFICAR o que emergiu (E1 §Elementos: "pré-condição material da checagem P9 … o contrato deve declará-la"). Nenhuma fonte defendeu o framing — ele é admissível como tentação nomeada (a dispensa, via discovery §1, mata-o corretamente), mas a coluna de origem deveria dizer "tentação derivada do fato de ter funcionado 2x (E1 ev. 1)", não sugerir que a prática registrada o sustenta. **Fix:** ajustar a coluna de origem; manter a dispensa.

## Contagem

8 achados: 2 ALTA (F1, F2 — framings de fonte registrados na discovery §3 ausentes das tabelas), 1 MÉDIA-ALTA (F3 — strawman de E1), 2 MÉDIA (F4, F5), 3 BAIXA/BAIXA-MÉDIA (F6, F7, F8). Nenhum framing fabricado apresentado como posição de fonte (F8 é erro de coluna de origem, não fabricação); nenhuma dispensa com citação que não mate o que diz matar — as falhas do documento são de AUSÊNCIA e de ENFRAQUECIMENTO, não de citação falsa.

Dissent: F7 e F8 podem ser legitimamente dispensados como compressão de altitude de stakeholder — não insisto neles contra esse argumento. Insisto em F1–F3: a tabela "alternative framings we considered" é precisamente a superfície onde a view promete força máxima às alternativas, e é exatamente lá que o passo dedicado de E2 #4 e o shape mínimo de E3 não existem, e onde E1 vira um strawman parcialmente absorvido. Se a síntese responder que o mapa de stances já carrega essas tensões, respondo: o mapa registra tensão para o engineer-view decidir; a tabela existe para o STAKEHOLDER ver as alternativas — são contratos diferentes e o segundo está furado.
