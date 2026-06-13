---
tags: [agents, dispatch, research, io-contracts, p9, envelope]
node_type: discovery
is_session: false
layer: architecture
nature: explanatory, technical
status: active
version: 1.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Discovery — Contratos de I/O por role (explorer, synthesizer, reviewer, approver)

## Objective

Codificar como decisões de design os contratos de input/output por role (explorer, synthesizer, reviewer, final_approver) determinados pelo dispatch `2026-06-12-agent-io-contracts`, de modo que a checagem de citação P9 seja verificável contra artefato durável e a síntese não degrade entre agentes. O estado final é o conjunto de vereditos do findings carregado com sua contagem honesta — fixado onde GO, condicionado às emendas pendentes onde GO-condicional, aberto onde OPEN, lei referenciada onde LEI — e o checklist de aceitação de 6 itens como emenda candidata ao skill. Tudo pronto para virar emendas pontuais em `research/SKILL.md`, na constituição e no cheatsheet de frontmatter; o corpo epistêmico dos returns permanece livre — tipá-lo está morto por KILL unânime (findings §2 #6).

> Esta discovery **codifica** o `research/findings.md` do dispatch `2026-06-12-agent-io-contracts` — ela não decide nada novo sobre os vereditos; suas únicas adições próprias são recomendações e registros marcados "desta discovery", todos revisáveis pela spec: housing e constatações de dependência (§6, §7), o regime pré-emenda do checklist (demovido a recomendação, §6 abertos), registros de lacuna/colisão para a spec (§5 declínios, §6), as marcas de blocker por emenda (§6), o mapa proposto verdict→status para o engineer-view (§7) e a nomeação da fronteira de tipos envelope / linha estruturada de corpo / schema do corpo (§2, §4.1 — nomeia o critério E3 que já venceu, não decide novo). Toda posição de design abaixo cita o findings (§/linha da matriz) ou o research (§E1/E2/E3) que a sustenta. GO-condicional permanece condicional; OPEN permanece aberto; LEI permanece lei referenciada, nunca aquisição; o dissenso vivo de E3 sobre IDs permanece declarado vivo.

---

## 1. Business Context

### Why now

Dois dispatches reais de 2026-06-12 (`constitution-self-improvement` e `constitution-v051-assessment`) quebraram a cadeia claim→prova em pontos documentados, enquanto a constituição v0.5.2 (P9) e o type skill `research` exigem que toda claim load-bearing do `findings.md` cite o return coletado que a sustenta — e o `final_approver` cheque isso recebendo o `working_folder` completo (P12), e nunca um digest no lugar dele (research.md §E3, premissa de executabilidade). As quebras não foram de formato: foram de **persistência seletiva e condensação sem invariantes** (research.md §E1 Dissent). Sem contrato por role, o shape depende de reinvenção feliz por dispatch (deu certo duas vezes — E1 ev. 1 — sem garantia), e a resolução de citação perde a base mecânica quando a persistência falha (E1 ev. 2/3).

### What's broken

Cada quebra com localização verificada pelo explorer E1 (resolução manual de citações; research.md §E1):

1. **Camada F dangling** — `research/subagents-strategy/2026-06-12-constitution-v051-assessment/research.md` §"S1 — Noether": o draft F1–F21 da synthesizer nunca aterrissou no research.md ("Full adjudicated form in findings.md"); o findings cita F-numbers em quase toda linha, mas o enunciado de F11 só é recuperável por inferência via o veredito de R1 — a citação resolve para um veredito sobre o claim, não para o claim (research.md §E1 ev. 2; "a maior quebra observada" — research.md §E1 Elementos, output do synthesizer (b); findings §2 #12: "a maior observada").
2. **Dissent ausente 7/7** — nenhum dos sete returns de explorer persistidos nos dois research.md termina com a linha `Dissent:` que o skill §Tension design exige; o check de falso-consenso ficou sem sinal para ler. O dissenso real existiu (T1–T5), mas foi reconstruído pela synthesizer a posteriori, não declarado pelo emissor (research.md §E1 ev. 4). Indecidível entre não-emissão e condensação — o contrato cobre os dois ramos (findings §3).
3. **Citações morrendo em transcript** — `research/subagents-strategy/2026-06-12-constitution-self-improvement/research.md` §"Reviewers (R1/R2)": "Full reviewer text is in the session transcript; the resolution is in findings.md" — a cadeia de citação termina em artefato efêmero, e a checagem P9 verifica contra paráfrase do parent, não contra o return (research.md §E1 ev. 2).
4. **Verbatim degradando monotonicamente** — "verbatim" → "verbatim-in-substance" → "condensed-but-faithful", condensação feita pelo MESMO parent que sintetiza, sem regra que diga o que pode ser perdido; o que não sobreviveu foram exatamente as linhas `Dissent:` (research.md §E1 ev. 3).

### What stays the same

Fora de escopo — fronteiras nomeadas, não reabertas:

- **O edge de briefing (parent → explorer)** é propriedade da constituição §5; o contrato o referencia e congela — nenhum campo estruturado de input novo (findings §2 #16, KILL embutido; research.md §E3 R8).
- **A row do ledger e o appender v0.5.2** — validação mecânica permanece confinada à row; nenhum elemento dos contratos de corpo ganha enforcement por tooling nesta decisão (findings §4 preâmbulo; §6.1 posição l3b).
- **O corpo epistêmico dos returns** permanece prosa livre — schema JSON/tipado é KILL unânime (findings §2 #6).
- **As leis vigentes** — `Dissent:` persistida (skill §Tension design ∘ verbatim), pares posição-inicial/final (P14), verbatim (skill §Outputs) — são categoria **LEI**: o contrato as verifica, não as re-adota; não contam como aquisição sob P10 (findings §2, semântica da matriz).
- **O gate humano e o gate único do approver** — intocados (findings §3 arbitragem 3, PASS explícito de l3a).
- **A constituição em si** — este conjunto recomenda emendas (findings §5); não promulga nenhuma.

---

## 2. Core Concepts

Os conceitos nucleares dos quais as decisões de §4 são instâncias — cada um com definição de uma linha e ponteiro para onde a decisão mora; nenhum texto normativo é duplicado aqui (cópia canônica: findings §2/§4). Os views downstream seedam daqui (ontology-view → nós tipados; system-view → este bloco + Business Context).

- **Return** — o artefato que um agente entrega ao fim do seu turno, persistido integral em research.md; é a unidade de prova da cadeia de citação P9. (→ §4.7 verbatim; findings §4 edge 2)
- **Envelope** — a casca estruturada FORA do corpo do return (header de fronteira, frontmatter): identidade + ângulo + montagem determinística. Escolhido sobre tipar o corpo porque é onde estrutura é barata e o precedente é unânime. (→ §4.1)
- **Corpo livre** — o raciocínio epistêmico em prosa, nunca schematizado. (→ §4.8 KILL 1)
- **Linha estruturada de corpo** — token com gramática fixa DENTRO do corpo livre (claim-ID, âncora, `Dissent:`, posições rotuladas, carimbo de condensação), sancionado iff uma checagem nomeada o lê; terceira categoria, distinta do envelope (não vive fora do corpo) e do schema do corpo (não tipa o raciocínio). Nomeá-la torna o KILL #6 formulável como fronteira de tipo, não como exceção em prosa. (→ §4.1, fronteiras)
- **Claim-ID** — identidade estável por claim citável, default `<label>#<n>`, namespace por agente. (→ §4.2)
- **Âncora** — referência resolvível em formato fechado (`caminho:linha` | `arquivo §seção` | `URL`) que sustenta um claim-ID; mínimo 1 por claim. (→ §4.7; findings §4 edge 2/A4)
- **Linha `Dissent:`** — última linha de todo return; o sinal que o check anti-falso-consenso lê (LEI, não aquisição; token sancionado para dissenso vazio). (→ §4.3)
- **Vocabulário de verdict — GO / GO-condicional / LEI / OPEN / KILL** — GO = aquisição deste dispatch; GO-condicional = aquisição condicionada a emenda pendente (deviation declarada até lá; nunca apresentado como adquirido); LEI = lei vigente que o contrato referencia e verifica, nunca re-adota (fora da contagem P10); OPEN = sem witness/consumidor, registrado; KILL = negativa tipada, banked. (→ §4 preâmbulo; findings §2, semântica)
- **Contratos por edge** — os cinco edges do dispatch + close, cada um com payload/formato/invariantes: **edge 1** parent→explorer (briefing); **edge 2** explorer→research.md (persistência do return); **edge 3** research.md→synthesizer; **edge 4** synthesizer↔reviewer (zig-zag); **edge 5** synthesizer→explorers (feedback, condicional). (→ §4.7 aplicabilidade; texto canônico: findings §4)
- **Checklist do approver** — definição executável, em 6 itens, da checagem P9 que P12 já manda o `final_approver` fazer no close; não é campo preenchível. (→ §4.6)
- **Re-ask helper** — recuperação capeada (máx. 1 por agente) de falha de envelope na coleta, classificada helper P11: sem row, sem gate, contada e reportada. (→ §4.4)

---

## 3. Design space — as alternativas que colidiram

Três autoridades de explorer e um split da camada de revisão L3 entraram em colisão na pesquisa e na sua trilha de revisão; cada posição na sua forma mais forte. (Escopo deste inventário: o confronto sobre o contrato de corpo/envelope; as colisões de arbitragem — e.g. re-ask vs degradar-direto, l3a K3 × l3b T3 — moram em §4.4 e §5 item 4.)

### (a) Contrato composto por precedentes — artifact-as-contract com envelope tipado (E2)

O candidato real de E2 não é tipagem do corpo: "não existe contrato adotável de prateleira", mas existe um **contrato composto por precedentes, em que cada peça é adotada, não inventada** (research.md §E2 §Candidato), em 5 peças: (1) return = **artefato persistente com envelope tipado**, canal carregando só referência leve — "o synthesizer nunca recebe transcript de explorer"; (2) **identidade estável por claim citável** (âncoras resolvíveis); (3) montagem do research.md = **reducer append-only puro**, conteúdo do filho congelado; (4) **checagem de citação como passo dedicado pós-síntese** — "é aqui que a verificabilidade mora — não em tipar mais o payload"; (5) validação de envelope com falha explícita (estilo `CantHandleException`). Pano de fundo do levantamento: E2 reporta **duas famílias de contrato** — *message-schema* (LangGraph TypedDict, AutoGen Pydantic: tipa o envelope em memória) e *artifact-as-contract* (MetaGPT/Anthropic/CrewAI: o payload é documento persistente; o canal carrega referência) — e que "sistemas de research de longa duração convergem para a segunda família" (research.md §E2 "Padronizado" 2). A família message-schema na sua forma mais dura é material *reportado* por E2, não posição de E2 — ver o limite do espaço abaixo.

### O limite do espaço: tipar o corpo epistêmico — a alternativa que NINGUÉM defendeu

Schematizar o corpo (JSON de claims/evidência) delimita o design space sem ter tido advogado: **nenhum return a defendeu** — nem E2, cujo Dissent a ataca explicitamente ("nenhum dos seis precedentes tipa claims/evidência dentro do schema; abandonar esse equilíbrio é inventar sem precedente exatamente onde o ângulo E2 manda adotar" — research.md §E2 Dissent). Ela nasceu como fronteira e morreu unânime (§5 item 1; findings §2 #6, KILL).

### (b) Minimalismo derivado — um campo só entra se uma checagem nomeada o lê (E3)

Tratando constituição v0.5.2 + type skill como axiomas, só é forçado o que torna as checagens já prescritas executáveis: âncora por agente (R1), proveniência agent+angle (R2), append-only para material citado (R3), verbatim (R4), `Dissent:` (R5 — "o único campo de corpo estruturado que as regras exigem, e exigem PORQUE uma checagem nomeada o consome"), pares P14 (R6). Tudo além é "custo sem regra que a exija" — e a tabela §7 da constituição é o experimento natural: `success_metric`, `grade`, `constraints` foram preenchidos com vácuo e cortados (research.md §E3 R1–R8, §Evidência interna). Evidência externa: restrição de formato durante o raciocínio degrada qualidade (Tam et al. 2024 — **contestado por dottxt** na metodologia; leitura convergente da literatura posterior: a degradação concentra-se quando a restrição se aplica DURANTE o raciocínio); estruturar o envelope é barato, schematizar o corpo é a zona que degrada (research.md §E3, evidência (a)).

### (c) Prática interna registrada — markdown concatenado + namespaces de ID (E1)

A autoridade é o que os dois dispatches reais já provam: namespaces de claim por agente emergiram duas vezes independentemente, sem regra que os exigisse, e são o que fez a checagem P9 ser barata (research.md §E1 ev. 1); fronteiras por header funcionaram e carregaram a proveniência certa (ev. 5); âncoras arquivo+linha permitiram refutar claims (F21 morreu por "README line 22", ev. 6). O que falhou não foi falta de tipagem — foi persistência seletiva (ev. 2) e condensação sem invariantes (ev. 3). Dissent de E1: as duas quebras reais "seriam pegas por um checklist de 5 itens no close, não por um schema executável" (research.md §E1 Dissent; nota de fidelidade do findings §3: E1 ev. 2 enumera TRÊS quebras e o Dissent fala em "duas" — inconsistência interna de E1, registrada, não harmonizada).

### (d) Mecanização da validação — três posições, OPEN de owner

Sobre COMO o contrato é validado, l3a/l3b/l3c discordam genuinamente (findings §6.1): **l3a** (constituição) — checklist-não-script é o único default constitucionalmente seguro; o corte do validator v0.3.0 no §7 é lei. **l3b** (tooling) — o enforcement split do appender é lei de desenho; mecânica confinada à row até existir testemunha interna de malformação que um checklist lido não pegue. **l3c** (determinismo) — desambiguação textual primeiro, mecânica só onde o vocabulário fechou; o item (i) do checklist ("sustenta a claim") é inferramentável por construção. **Não arbitrado** — decisão de quem é dono do corte do validator v0.3.0, não da síntese (findings §3, último parágrafo).

### A convergência

O contrato vencedor toma de cada posição o que sobreviveu ao confronto — e, em substância, é **majoritariamente o candidato composto de E2** (peças 1–4 aterrissam nos GOs de §4; a peça 5 é declinada provisoriamente, §5 item 7): **envelope estruturado sobre corpo livre, com a verificabilidade morando na persistência e num check de close — nunca em tipar o raciocínio** (findings §3, primeira linha). E2 fornece a arquitetura e mostra os seis precedentes mantendo esse equilíbrio ("corpo livre + envelope tipado é o equilíbrio dominante"; nenhum dos seis precedentes pesquisados schematiza claims/evidência — research.md §E2 "Padronizado" 4); E3 deriva o critério de admissão de campo; E1 mostra que as quebras são de persistência. A peça sem dono no ecossistema — checagem de citação por claim — é endereçada pelo único precedente que a trata (Anthropic: passo dedicado pós-síntese + citation accuracy como gate, não propriedade do schema; research.md §E2 §Anthropic) — aqui demovida a checklist de close e pendente como emenda candidata (4.6).

---

## 4. Decisões codificadas

Fonte normativa: findings §2 (matriz de 18 elementos) e §3 (arbitragens L3). Contagem honesta sob P10: **GO 10 · GO-condicional 3 · LEI 2 · OPEN 1 (+3 resíduos findings §6) · KILL 2** (findings §2, linha de contagem). Nota de aritmética: o OPEN de linha da matriz (#17) é o mesmo resíduo do findings §6.1 (mecanização — §6.1 deste documento) — são **três OPENs distintos** no total, não quatro. As decisões estruturantes:

### 4.1 Envelope tipado sobre corpo livre — GO

Headers/frontmatter estruturados; corpo do raciocínio livre. Base: canal existente `initial_prompt` §5; E2 §"Padronizado" 1 e 4; witness E1 ev. 5 (findings §2 #5). É a decisão estruturante: os demais GOs de envelope (headers, IDs, âncoras, append-only) a instanciam.

**Fronteiras de tipo (nomeação desta discovery — registra o critério E3 vencedor, não decide novo; uma linha cada):** **envelope** = casca estruturada FORA do corpo (header de fronteira, frontmatter); **linha estruturada de corpo** = token com gramática fixa DENTRO do corpo livre (claim-IDs, âncoras, `Dissent:`, posições rotuladas, carimbo de condensação), sancionado iff uma checagem nomeada o lê; **schema do corpo** = tipagem do raciocínio epistêmico — o objeto exato do KILL #6. Com a terceira categoria nomeada, o KILL é formulável como não-construtível por tipo: proibido schematizar o RACIOCÍNIO; permitidas só as linhas que os checks nomeados leem. (O que E3 R5 chama de "único campo de corpo estruturado que as regras exigem" é, neste vocabulário, a primeira linha estruturada de corpo reconhecida; IDs e âncoras entram pela mesma categoria, via os checks que as leem.)

### 4.2 IDs de claim com namespace por agente — GO, com dissenso vivo

Default canônico **`<label>#<n>`** (ex.: `E1#4`); o briefing pode sobrescrever o esquema **só com deviation declarada** (findings §3 arbitragem 4 A1). A disciplina de continuidade inter-turnos (contador contínuo, ID nunca reutilizado, `supersedes`) é texto de contrato — mora em findings §4 edge 4/A8 e edge 5, não aqui. **Definição provisória de `<label>` (desta discovery, a fechar na spec):** `<label>` é o identificador curto do agente no header do seu return em research.md, derivado pelo strategist na sheet (ex.: `E1`, `E2`, `F`, `R1`); não é `agent_name` (pool de nomes próprios, opcional/null) nem `group_id` — nenhum dos três vocabulários de referência (constituição §5, type skill, findings) o define como campo ou regra de derivação; a spec deve fixar a derivação canônica (proposta mínima: determinística de grupo + índice da row na sheet, independente de `agent_name`) e a unicidade entre grupos (ver §6, abertos). Base: E1 ev. 1 (emergiu 2x independentemente; a checagem P9 praticada os leu); consumidor (fechado pelo ramo honesto — trilha L2 do findings, O4): o briefing, não o checklist (findings §2 #2). **Dissenso de E3 R1 permanece vivo** ("granularidade além de seção é custo sem regra que a exija") e o custo permanece OPEN (§6.3 deste documento) — a decisão é de design declarada, não vitória sobre E3 (correção V1/I5 da trilha L1; findings §8).

### 4.3 Categoria LEI — referenciar e verificar, nunca re-adotar

Duas obrigações que o contrato carrega são lei vigente, não aquisição deste dispatch: a linha **`Dissent:`** final persistida (teorema por composição skill §Tension design ∘ verbatim — E1 ev. 4 testemunha violação, não lacuna; findings §2 #4) e os **pares posição-inicial/final por reviewer** (P14 literal; deltas genuínos do dispatch: localização no return e item de verificação — findings §2 #8). A terceira lei vigente — **verbatim** — não some da contagem: a linha LEI 2 conta vereditos de linha da matriz (#4 e #8), enquanto verbatim vive dentro do split do #11 e é contada lá (§4.7). O gate de witness não se aplica a LEI — o que ela testemunha é violação. Existe token sancionado para dissenso vazio (A10, findings §3 arbitragem 5) — a sintaxe literal mora no contrato do edge 2 (findings §4) e na futura emenda do skill, não aqui.

### 4.4 Re-ask capeado como helper P11 — GO (arbitragem 1)

Falha de envelope na coleta (header? Dissent? IDs?) → **no máximo 1 re-ask por agente**, classificado helper invocation (P11): sem row própria, sem gate, reportado post-hoc; contado como helper no relato de `agents_spawned`, com `Deviation:` no close; **não consome `max_loops`** (que só o reject do approver dispara). Base do bucket: §5 `agents_spawned` da constituição (close row + reported, com `helpers` no exemplo) — a letra de P11 ("not written to the ledger row") é lida aqui como "sem dispatch row própria", não "fora da close row"; tensão interna da constituição, leitura a confirmar na emenda (achado D5 da trilha L2 desta discovery). Segunda falha ou return ausente → **P4 literal**: partial group result com header sempre persistido (findings §3 arbitragem 1; mecânica contábil exata e placeholder de return ausente: findings §4 edge 2). Por quê: re-ask sem teto contradiz P4 e fura a contabilidade (l3a K3 × l3b T3); remoção total jogaria fora sinal recuperável — o único caso interno de malformação (Dissent ausente, E1 ev. 4) é exatamente o que um re-ask barato recupera. Resíduo declarado: a fronteira helper-vs-dispatch é provisória na própria P11.

### 4.5 Draft do synthesizer persistido com IDs `F*` — GO-condicional (arbitragem 2)

O draft entra como nova seção append-only de research.md ANTES da revisão, com IDs próprios — resposta direta à quebra F11. **Condicional porque** P9 como escrito define o par citável como "collected returns (research) and the cited synthesis (findings)", e uma citação `F11` não resolve para um collected return: sob o texto vigente, o findings que cita `F*` falha o item (i) do próprio checklist. **Pende emenda de uma linha em P9** (padrão `invoked_by`, já praticado pelo tooling); até lá, deviation declarada por dispatch. **Guard anti-auto-citação obrigatório desde já:** F-seções são ALVO de citação para vereditos de reviewer, nunca PROVA terminal — toda F-claim carrega suas próprias citações E* (findings §2 #12; §3 arbitragem 2; emenda 1, findings §5.1 — dependências em §6). GO-condicional NÃO é GO: sem a emenda, todo dispatch que usar a rota declara deviation.

### 4.6 Checklist de 6 itens do approver — GO, como emenda candidata (arbitragem 3)

A checagem de citação no close é um **checklist de 6 itens** escopado "aceitação para `dispatch_type: research`" — **texto canônico dos itens em findings §4 Close** (com as tags [P9]/[LEI verificada]/[NOVO] que qualquer paráfrase perde); destino: emenda 3 (§6 dependências), ao research/SKILL.md §Outputs. Esta discovery codifica existência, contagem (6), escopo, regra de resolução-vs-sustentação (resolução é mecânica; sustentação é juízo declarado do approver), status e defesa — e **não reproduz os itens**, para não criar segunda cópia divergível do texto que a spec vai fixar. **Defendido contra o corte de `final_approver_criteria` (§7):** o corte removeu um campo por-dispatch preenchível; o checklist não é campo e não é preenchido — é a definição executável da checagem P9 que P12 já manda o approver fazer, lei fixa do tipo. Status: **emenda candidata ao skill `research` §Outputs, não aquisição auto-sancionada por findings** (findings §3 arbitragem 3). **Contraste factual com 4.5:** a arbitragem 3 não anexa cláusula de deviation ao checklist (a arbitragem 2 anexa uma à rota F*), e o próprio close do findings já o aplicou ("aceito pelo final_approver `parent` após o checklist de 6 itens"); o regime do intervalo — se prática-antes-de-emenda exige deviation — é decisão de quem redigir a emenda 3, não desta discovery; a recomendação desta discovery (regime dividido pelas tags de proveniência dos itens — correção T1) está demovida a §6, revisável pela spec. Itens vacuosos em n=1: `N/A — role ausente`, distinto de PASS (A2).

### 4.7 Demais GOs estruturais (compacto)

| decisão | verdict | base |
|---|---|---|
| Header de fronteira: identidade + ângulo iff n≥2; modelo opcional/informativo; montagem determinística pela sheet (mecânica e literais: findings §4 edge 2/A5) | GO | findings §2 #1; E2 §MetaGPT/§LangGraph; E3 R1/R2; E1 ev. 5 |
| Âncora de evidência por claim-ID, formatos fechados, mínimo 1 por claim (tripla de formatos: findings §4 edge 2/A4) | GO | findings §2 #3; E2 Candidato #2; E1 ev. 6 |
| Append-only estendido às seções de síntese/zig-zag; gatilho de imutabilidade = persist, não citação | GO | findings §2 #10; E2 §LangGraph reducer; E3 R3; A6 |
| Verbatim (LEI) + rota de condensação só pelo emissor, carimbada, lista fixa de invariantes (carimbo e lista: findings §4 edge 2/A7). Nota de proveniência: a lista de E1 incluía **severidades**; o findings as excluiu deliberadamente da lista obrigatória ("recomendadas, não exigidas — nenhum check nomeado as lê", A7) — decisão do findings, citada, não perda desta discovery | LEI + GO-condicional (emenda 2, §6) | findings §2 #11; §4 edge 2/A7; E3 R4; E1 ev. 3 e §"Regra de condensação" |
| Return do reviewer: veredito exaustivo por ID alheio com vocabulário fechado + claims novas carimbadas + posições inicial/final em duas linhas rotuladas + Dissent final (literais e ordem: findings §4 edge 4) | GO | findings §2 #13; §4 edge 4; E1 §Elementos; E3 tabela síntese |
| Carimbo `not-re-reviewed` + cláusula de aceitação | GO-condicional (split: carimbo + cláusula = GO; taxonomia de 4 tiers = OPEN) | findings §2 #9; E2 §Anthropic (método); E1 ev. 2/6 |
| `dispatch_id` + `schema_version` no frontmatter do findings — espelho lido como **relato** (P3 manda reportar o outcome "in the findings document"); leitura a defender **CONTRA** a frase final de P3 ("No other persistence surface exists for dispatch metadata") — a emenda 5 deve confrontá-la explicitamente: ou uma linha em P3 sancionando o espelho, ou a demoção do espelho a redundância informativa não-autoritativa (§6 dependências, T2); fonte de verdade = row | GO (escopo menor: espelho informativo — "menor" não é categoria do vocabulário de verdict; conta nos GO 10) | findings §2 #14; E1 ev. 8; P3 confrontada, não citada como sanção limpa |
| Shape do findings: invariantes obrigatórios; matriz como default; shape equivalente só com deviation; determinismo = identidade de invariantes, não bytes | GO | findings §2 #15; E1 ev. 7; A13 |
| Input por role = prosa de briefing, congelado | GO (congelar) | findings §2 #16; E3 R8; constituição §5 |
| Claim load-bearing = definição executável de 3 cláusulas de A3 (texto: findings §3 arbitragem 4) | adotada (A3) | findings §3 arbitragem 4 |
| Aplicabilidade: edge 1 sempre; edges 2–5 iff n≥2; n=1 → só findings.md com invariantes internos | adotada (A2) | findings §4 preâmbulo; P9 |

**Handles (U3):** o handle canônico de cada row desta tabela é o `#n` da matriz do findings citado na coluna base (ex.: `4.7/#14` para o espelho); as duas linhas "adotada" usam o ID da arbitragem (`A3`, `A2`). System-view e engineer-view endereçam por esses handles, não por paráfrase.

### 4.8 KILLs banked — negativas tipadas, não re-levantar

1. **Schema JSON/tipado do corpo epistêmico — KILL unânime.** E1 Dissent, E2 Dissent e E3 evidência (a), todos explícitos (findings §2 #6).
2. **`round` obrigatório em todo return — KILL.** GO condicional apenas quando o edge feedback dispara; "num dispatch de rodada única, `round` é ruído" (findings §2 #18; research.md §E3 R2).

---

## 5. Alternativas rejeitadas (e o que as matou) — e declínios provisórios

1. **Tipar o corpo epistêmico (JSON de claims/evidência)** — a alternativa que **ninguém defendeu**: forma sem precedente algum (nenhum dos seis frameworks a pratica — research.md §E2 "Padronizado" 4), apresentada em §3 como limite do espaço, não como posição de return — e portanto não é "a forma mais forte" de família alguma do levantamento. Morta três vezes, independentemente: E1 — "o que falhou não foi a falta de tipagem, foi persistência seletiva e condensação sem invariantes; exigir o schema repete o erro do validator v0.3.0 que o §7 cortou" (research.md §E1 Dissent); E2 — "nenhum dos seis precedentes tipa claims/evidência dentro do schema; abandonar esse equilíbrio é inventar sem precedente exatamente onde o ângulo E2 manda adotar" (research.md §E2 Dissent — o próprio E2 a mata; nunca a defendeu); E3 — schematizar o corpo é a condição que Tam et al. 2024 e a literatura reason-first mostram degradar "exatamente os agentes cujo output é a superfície de prova" (research.md §E3 Dissent, evidência (a)). KILL unânime (findings §2 #6).
2. **Campos estruturados novos de input** — mortos pelo experimento natural da tabela §7 da constituição: `success_metric` preenchido com vácuo, `grade` nunca preenchido, `constraints`/`stop_conditions` viraram prosa — "campo estruturado que nenhuma checagem consome é preenchido com vácuo e depois cortado" (research.md §E3 §Evidência interna; findings §2 #16).
3. **`round` obrigatório** — sem checagem que o consuma fora do edge feedback (research.md §E3 R2; findings §2 #18).
4. **Remoção total do re-ask (opção (a) da arbitragem 1)** — rejeitada porque degradar direto a P4 joga fora sinal recuperável: o único caso interno de malformação é exatamente o que um re-ask barato recupera, e P11 já fornece o bucket sancionado e o freio por relato (findings §3 arbitragem 1).
5. **Resumo intermediário entre explorer e checagem** (synthesizer entrega digest ao approver) — morto por P12 + evidência de telephone effect: "cada camada intermediária de resumo reintroduziria o telephone effect no ponto onde a verificação acontece" (research.md §E3 evidência (b); findings §4 edge 3).
6. **Conserto silencioso pelo parent** (condensação/normalização na coleta) — é o canal exato que E1 ev. 3 mostra degradar; condensação só pelo agente emissor, carimbada (findings §4 edge 2).

### Declínios provisórios — NÃO rejeitados (não ler como kill-list)

Três itens moram nesta seção por proximidade temática, mas seu status NÃO é KILL — uma spec que leia §5 como banco de negativas tipadas (espelho de §4.8) não deve bancá-los:

7. **Validação mecânica de envelope na coleta (E2 Candidato #5, estilo `CantHandleException`)** — **declínio PROVISÓRIO, não KILL** ("cheiro v0.3.0"; findings §2 #17): permanece dentro do OPEN de mecanização (§6.1 abaixo).
8. **Taxonomia completa de 4 tiers de verificação** — **não rejeitada: OPEN** (split do #9, ver §6.2). Sem witness de ausência e sem consumidor não-circular; promoção futura deve confrontar o corte de `grade` (findings §2 #9, §6.2).
9. **Lista de fontes com URL no header (peça #1 do candidato de E2)** — elemento defendido que o findings **não veredita** (evaporou entre research e matriz — lacuna S3 da trilha L2 desta discovery). Registro desta discovery, não veredito: pelo critério de E3 R5 nenhuma checagem nomeada a consome, e a função de prova já é coberta pelas âncoras por claim-ID (mínimo 1 por claim); **recomendação: não adotar — mas a decisão pertence à spec**, que deve vereditá-la explicitamente (research.md §E2 Candidato #1).

---

## 6. Open questions

OPEN nunca vira decidido — os três do findings §6, com os defaults que o findings registra onde existem (6.1, 6.2) e uma recomendação derivada, marcada como desta discovery (6.3):

### 6.1 Mecanização da validação de envelope/contrato — decisão de OWNER

Três posições genuínas e não-arbitradas (checklist lido vs script vs linter — l3a/l3b/l3c, findings §6.1). Quarta forma registrada dentro deste OPEN (desta discovery, correção S6 da trilha L2): o **passo/agente dedicado de checagem de citação** (E2 Candidato #4 — "é aqui que a verificabilidade mora"), demovido a checklist de close pela síntese; se o "script" de l3b a subsume, quem fechar o OPEN deve dizê-lo. **Recomendação (= default operacional do findings):** checklist enquanto aberto; validação mecânica confinada à row do appender; quem decide é o dono do corte do validator v0.3.0, não a fase de spec. A spec deve escrever o checklist como texto lido, sem pressupor tooling.

### 6.2 Taxonomia de 4 tiers de verificação por claim

`explorer-claimed | reviewer-upheld | parent-verified | not-re-reviewed` atribuída por inteiro no close: sem witness de ausência e sem consumidor não-circular (leitor inventado no documento não conta — arbitragem L2; findings §8). **Recomendação:** manter só o carimbo `not-re-reviewed` + cláusula de aceitação (a metade GO do split #9); promoção futura exige consumidor não-circular E confronto declarado com o corte de `grade` (§7, "never filled in practice"; K5, findings §6.2).

### 6.3 Custo dos IDs de claim

Nenhum custo registrado, mas custo tampouco medido (E1 ev. 1); o dissenso de E3 R1 permanece vivo; nenhum lado decide sem medição (findings §6.3). **Recomendação (derivada do findings §6.3 por esta discovery — o findings registra apenas "nenhum lado decide sem medição"):** manter o default `<label>#<n>` (consumidor: briefing determinístico); o OPEN só fecha com medição (findings §6.3) — esta discovery não prescreve quando nem por quem.

### Dependências — emendas pendentes (findings §5; recomendadas, não promulgadas)

A fase de spec depende destas emendas, cada uma com superfície nomeada e marca de blocker (registro desta discovery — U6):

1. **Constituição §4 P9, uma linha** (padrão `invoked_by`): reconhecer "collected returns **+ append-only synthesis/zig-zag sections**" como conteúdo citável de research.md; acompanha o guard anti-auto-citação. Espelho secundário: §5 `working_folder`. Até lá: deviation por dispatch (destrava 4.5). **[blocker-de-aquisição: sem ela 4.5 opera só sob deviation; não bloqueia a redação da spec]**
2. **research/SKILL.md §Outputs — rota de condensação** com carimbo e lista fixa (destrava a metade condicional de #11). **[blocker-de-aquisição da metade condicional; não bloqueia a redação]**
3. **research/SKILL.md §Outputs — checklist de 6 itens** como expansão de "for research, acceptance includes the P9 citation check" (formaliza 4.6 — o regime do intervalo é decisão de quem a redigir; recomendação desta discovery nos abertos abaixo; diferente de 1, que DESTRAVA 4.5). **[não-blocker: itens de lei vigente aplicam desde já; ver regime dividido nos abertos]**
4. **research/SKILL.md §Outputs — shape do findings** (matriz default OU equivalente com deviation). **[não-blocker]**
5. **`.claude/skills/custom/frontmatter.md`** — admitir `dispatch_id` + `schema_version` para `node_type: subagents-findings` (o node_type já existe no enum; os campos não — T2 da trilha L3 do findings). **Deve vir acompanhada do confronto com a frase final de P3** ("No other persistence surface exists for dispatch metadata"): ou uma linha em P3 sancionando o espelho-no-findings como relato, ou a demoção explícita do espelho a **redundância informativa não-autoritativa** (fonte de verdade: a row) — a emenda de cheatsheet sozinha institucionalizaria uma superfície que a letra de P3 nega (T2 desta trilha L3). **[não-blocker; exige o confronto com P3 na redação]**

**ERRATUM upstream a propagar para a spec (findings §4 Close, A14) — [blocker de redação das emendas que mencionem o espelho na row]:** A14 manda espelhar `Deviation:`/`Accepted-unreviewed:` "no campo de desvios da close row" — campo que **não existe**: o schema v0.5.2 da close row é fechado (`register-dispatch/SKILL.md` §"Closing a dispatch": `close_of`, `exit_reason`, `agents_spawned`, `feedback_prompts`, `invoked_by`, `project_dir`, `closed`; "any other key not in this table — unknown keys are rejected (exit 2)"). O espelho na row é hipótese de tooling refutada pelo schema atual; as linhas de declaração de A14 ficam no **corpo** do close do findings. Reforço (T5): a constituição §5 "Close of dispatch" tampouco lista campo de desvios — só `exit_reason` + `agents_spawned` são portados pela row — então a hipótese de A14 não tem lastro nem na lei nem no tooling. A spec deve ou confinar o espelho ao corpo (sem row), ou declarar campo novo com a mudança de schema + appender que isso implica — e propagar este erratum ao findings/à redação das emendas.

### Abertos identificados para a fase de spec (desta discovery, não do findings)

- **Regime pré-emenda do checklist (4.6)** — se prática-antes-de-emenda exige deviation declarada é decisão de quem redigir a emenda 3, não do findings (a arbitragem 3 silencia; silêncio ≠ permissão) nem desta discovery. **Recomendação (desta discovery, revisável pela spec), com o racional restrito às tags de proveniência do próprio findings (correção T1):** o regime do intervalo é **dividido por proveniência** — os itens **[P9]/[LEI verificada]** (i, ii, iv, v) verificam leis e definições já vigentes e aplicam desde já, sem deviation; os dois itens **[NOVO]** (iii, vi) verificam aquisições deste dispatch e valem no intervalo como **prática recomendada, exigíveis só pós-emenda** — o (iii), no mínimo, herda o regime de deviation da rota F* que policia (4.5, arbitragem 2). O close do findings aplicou o checklist uma vez (witness de aplicação, não de regime). Nada é promulgado aqui.
- **Definição canônica de `<label>`** — termo sem definição apontável nos três vocabulários (não é `agent_name` nem `group_id`); a definição provisória desta discovery está em §4.2 (identificador curto do agente no header do research.md, derivado pelo strategist na sheet — ex.: `E1`, `F`, `R1`). **Recomendação:** a spec fixa a derivação canônica (determinística de grupo + índice da row) e a unicidade entre grupos, inclusive o caso `agent_name` null vs preenchido. Mesma disciplina do item (iv) do checklist (T6): `review` reusa os quatro roles e produzirá os mesmos headers — a spec do research fixa a derivação e registra a dívida-ponteiro para review/SKILL.md. Consequência downstream registrada (U7): enquanto a unicidade de `<label>` for OPEN, o guard de unicidade do claim-ID no ontology-view nasce **PLANNED, não LIVE** — pendente do fechamento deste aberto, não de invenção do autor do view.
- **Destino da anotação inline do parent (E1 ev. 6)** — a prática registrada ("*(Parent verified: ...)*" escrito DENTRO do return do explorer) colide com o reducer puro de conteúdo congelado (E2 peça #3, adotada via append-only #10) e com a proibição de conserto silencioso pelo parent (§5 item 6); só a metade taxonômica de ev. 6 sobreviveu (dentro do OPEN 6.2), a metade inline ficou sem destino — colisão registrada (S4 da trilha L2 desta discovery), não decidida. **Recomendação:** verificação do parent vira seção própria append-only assinada, nunca edição do return; a spec decide.
- **Dívida do item (iv) em `review`** — o checklist é escopado a `dispatch_type: research`; a verificação equivalente de P14 para `review` está declarada como dívida da review/SKILL.md (findings §4 item iv) e não tem texto. **Recomendação:** a spec do research registra a dívida com ponteiro; não redige a contraparte.
- **Witness de conteúdo dos pares P14** — pendente do primeiro robot-talks real (findings §2 #8). **Recomendação:** nenhuma forma adicional para os pares até esse witness existir.
- **Fronteira helper-vs-dispatch** — provisória na própria P11 (findings §3 arbitragem 1, resíduo). **Recomendação:** a spec referencia P11 como está; não tenta fechar a fronteira.
- **Onde mora o texto canônico dos contratos por edge** — o findings entrega os contratos em §4, mas a casa permanente (seção própria do research/SKILL.md vs documento referenciado) é escolha editorial da spec. **Recomendação:** dentro do research/SKILL.md (ver §7 abaixo), evitando um segundo documento normativo que possa divergir.

---

## 7. Caminho para spec

Onde cada decisão vai morar — sem redigir a spec aqui:

| decisão | casa | veículo |
|---|---|---|
| Contratos por edge (1–5 + close): headers, IDs default, âncoras, Dissent/token, re-ask capeado, append-only, zig-zag, vocabulário de veredito | `research/SKILL.md` — seção de contratos sob §Outputs | emendas 2–4 do findings §5 + texto novo derivado de findings §4 |
| Checklist de 6 itens do approver | `research/SKILL.md` §Outputs, expansão da frase existente sobre o P9 citation check | emenda 3 (findings §5); escopo "research"; nota de dívida para review/SKILL.md |
| Extensão de citabilidade (seções F*) | `subagents-strategy-constitution-proposal.md`, P9 (linha única) + espelho em §5 `working_folder` | emenda 1 (findings §5); até lá, deviation por dispatch |
| Rota de condensação carimbada | `research/SKILL.md` §Outputs, emenda declarada à regra verbatim | emenda 2 (findings §5) (alternativa coerente registrada: manter proibição + re-ask com token_budget revisado) |
| `dispatch_id` + `schema_version` em subagents-findings | `.claude/skills/custom/frontmatter.md` **+ confronto com a frase final de P3** ("no other persistence surface"): linha em P3 sancionando o espelho-relato OU demoção do espelho a redundância informativa não-autoritativa (T2) | emenda 5 (findings §5) — nunca redigida como sanção limpa de P3 |
| Bucket `helpers` em `agents_spawned` · linhas `Deviation:`/`Accepted-unreviewed:` | **duas casas distintas (T3):** o bucket `helpers` mora na close row — `agents_spawned` é campo required do schema v0.5.2, árvore com "helpers in their own bucket", nenhuma mudança necessária — E é espelhado no relato de corpo (P3); as linhas `Deviation:`/`Accepted-unreviewed:` (A14) moram no CORPO do close apenas | o espelho das linhas de declaração "no campo de desvios da close row" (A14) é hipótese refutada pelo schema atual (ERRATUM, §6); espelhá-las exigiria campo novo + mudança de appender, que a spec teria de declarar |
| LEIs (Dissent, P14, verbatim) | permanecem onde estão (skill §Tension design/§Outputs; constituição P14) | nenhuma — a spec as referencia e descreve a verificação, nunca as re-adota |
| OPENs §6.1–6.3 | registrados na spec como OPEN com default operacional | nenhuma promoção sem owner/witness/consumidor |

Constatações de dependência (a ordem dos passos pertence ao plano, não a esta discovery): a emenda constitucional (1) muda por rito de governança próprio — P9 é constituição, muda por governança, não por spec; as emendas de skill (2–4) compartilham uma única superfície (research/SKILL.md §Outputs); a emenda de cheatsheet (5) não depende de nenhuma outra, mas carrega o confronto com P3 (T2). A spec que codificar os contratos deve preservar a contagem honesta (GO/GO-condicional/LEI/OPEN/KILL) — em particular, nunca apresentar 4.5 como adquirido antes da emenda P9.

### Mapa proposto verdict → status do engineer-view (PROPOSTA desta discovery — tradução, não decisão nova)

O engineer-view classifica rows como RESOLVED / OPEN / CRITICAL; o vocabulário de verdict desta discovery não mapeia sozinho (U1). Tradução proposta, a validar pelo autor do engineer-view — que registra o mapa adotado como row própria:

| verdict desta discovery | status proposto no engineer-view |
|---|---|
| GO · "adotada" (A2/A3) | RESOLVED |
| GO-condicional | OPEN **com gate nomeado** (a emenda que destrava — e.g. 4.5 → emenda 1) — nunca RESOLVED antes da emenda |
| OPEN | OPEN (CRITICAL só se bloquear a spec; nenhum dos três bloqueia — todos têm default operacional) |
| KILL | RESOLVED-negativo (negativa bancada, com a autoridade citada) |
| LEI | referência à lei vigente, **não row própria** — virar row RESOLVED mudaria a contagem honesta que este §7 manda preservar |

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/findings.md` | `derives-from` | Fonte normativa: toda decisão desta discovery codifica um verdict da matriz §2 ou uma arbitragem §3 do findings. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/research/research.md` | `cites` | Design space e alternativas rejeitadas citam trechos verbatim dos returns E1/E2/E3. (Forward-only — ver regime abaixo.) |
| `subagents-strategy-constitution-proposal.md` | `cites` | P4, P9, P10, P11, P12, P14 e §5/§7 são as leis que os contratos referenciam e verificam. (Forward-only — ver regime abaixo.) |
| `.claude/skills/research/SKILL.md` | `cites` | §Outputs e §Tension design são leis do tipo verificadas pelo contrato (forward-only: alvo é skill file). |

**Regime de edges (K2 — decisão declarada, não omissão):** os dois alvos `cites` sem inverso seguem **forward-only**: `research.md` é artefato congelado de dispatch fechado (returns coletados verbatim, imutável-no-persist — anexar-lhe um bloco `## Connections` violaria a própria disciplina que esta discovery codifica) e `subagents-strategy-constitution-proposal.md` é `node_type: constitution` (muda por governança, não por edge informal). O inverso `derives` em `findings.md` existe porque foi escrito pelo próprio dispatch dentro da sua janela de escrita, antes do freeze — não é aplicação seletiva da convenção, é a janela de mutabilidade de cada alvo. edges.md escopa o MANDATORY bidirecional a vault nodes; caminhos não-vault permanecem sob OQ-C.

**Resolução das trilhas de revisão citadas no corpo (U5):** "trilha L1/L2/L3 **do findings**" (ids `V*/I*/C*`, `P*/O*/D*`, `K*/T*/A*`) → `research/.work/reviews/` (l1/l2/l3 + changelogs); "trilha L2 **desta discovery**" (ids `S*/O*/D*`) → `.work-discovery/reviews/l2*.md`; trilha L3 desta discovery (ids `K*/T*/U*` deste turno) → `.work-discovery/reviews/l3*.md`. As trilhas `.work*/` são versionadas no repo (degrau durável acima do transcript) e são auditáveis, não load-bearing: toda decisão deste documento cita findings/research diretamente.
