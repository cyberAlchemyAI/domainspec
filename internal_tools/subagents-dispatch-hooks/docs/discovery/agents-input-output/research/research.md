---
tags: [agents, dispatch, research, io-contracts]
node_type: research
is_session: false
layer: architecture
nature: technical
status: complete
version: 1.0.0
last_updated: 2026-06-12
---

# research.md — dispatch 2026-06-12-agent-io-contracts (returns coletados, verbatim)

Concat verbatim dos returns dos explorers, um header por agente (`## <id> — <angle> (round N)`),
append-only entre rounds. Este arquivo é o alvo imóvel das citações do `findings.md` (P9).

## E1 — empírico-interno (round 1)


# E1 — Prática interna registrada: o que os dois dispatches de 2026-06-12 já provam sobre contratos de I/O por role

Ângulo: empírico-interno. Autoridade = a prática registrada NESTE repo. Método: resolução
manual de cada citação dos dois `findings.md` contra seus `research.md`, mais inspeção das
fronteiras por agente e das linhas `Dissent:`. Corpus: os dois pares research/findings de
`research/subagents-strategy/2026-06-12-constitution-self-improvement/` e
`.../2026-06-12-constitution-v051-assessment/`, `.claude/skills/research/SKILL.md`,
`subagents-strategy-constitution-proposal.md` (P7, P9, §5).

## Evidência

**1. Namespaces de claim por agente emergiram duas vezes, independentemente — e são o que
faz a checagem P9 ser barata.** No dispatch self-improvement, cada explorer cunhou seu
próprio esquema de IDs: E1 usa `A1–A5/B1–B5` (research.md §"E1 — Scientific literature"),
E2 usa `C*/D*/M*/P*` (§"E2 — Repo precedent"), E3 usa `#1–#16` (§"E3 — Formal
consistency"). O findings.md declara o protocolo no preâmbulo ("Every amendment cites the
explorer finding in research.md (E1 A*/B*, E2 C*/D*/M*/P*, E3 #*)") e o cumpre: testei
cada citação da seção A ("Blocks adoption") — E1→"E2 C1/C2", E2'→"E2 C4, E3 #7/#15",
E3→"E2 C3, E3 #14", E5'→"E3 #2", E10'→"E2 D7, E3 #5" — todas resolvem para um item
identificável e numerado do research.md. No dispatch v051-assessment o mesmo padrão
reaparece como `<agente>#<n>` (findings.md cita "E2#1–2", "E4#5 + E1#12", "N1", "N5");
amostrei C1, C2, M1–M6, m1, m9: todas resolvem. A prática convergiu sozinha em "todo claim
de explorer carrega um ID estável, com namespace por agente" — sem que P9 ou o SKILL
exijam isso em lugar algum.

**2. Onde a citação NÃO resolve, o padrão de quebra é sempre o mesmo: returns de
synthesizer/reviewer sub-persistidos.** Três quebras concretas:
- *Self-improvement, reviewers:* research.md §"Reviewers (R1/R2)" fecha com "Full
  reviewer text is in the session transcript; the resolution is in findings.md". O
  findings.md então cita "reviewer E5×E9" e "reviewer user_abort" (seções A, itens E5' e
  E10') — ponteiros difusos para parágrafo de prosa condensada, e a cadeia termina no
  transcript de chat, que é efêmero. A checagem P9 aqui só verifica contra paráfrase do
  próprio parent, não contra o return.
- *V051-assessment, camada F:* o draft F1–F21 da synthesizer (Noether) nunca aterrissou no
  research.md — §"S1 — Noether" diz "(Full adjudicated form in findings.md)". O findings.md
  cita F-numbers em quase toda linha ("C2 (F1; E2#1–2)", "M5 (F11; ...)"), mas o ENUNCIADO
  de F11 não existe no research.md; só é recuperável por inferência via a linha de veredito
  de R1 ("F11 UPHELD MAJOR (genuine unowned seam)"). A citação resolve para um veredito
  sobre o claim, não para o claim.
- *Compensação ad-hoc:* o findings.md do v051 marca m10 com "*(Reviewer-stage: not
  adversarially re-reviewed)*" e a seção "Dispatch record" declara "Deviation reported:
  Noether's zig-zag return turn was absorbed by the parent". A prática inventou na hora um
  marcador de camada-de-verificação por claim — sinal de que o contrato precisava desse
  campo e ele não existia.

**3. "Verbatim" degradou monotonicamente em dois passos, sem regra que diga o que pode ser
perdido.** O SKILL (§Outputs) e P9 exigem "collected returns, verbatim". O primeiro
research.md já se auto-descreve como "verbatim-in-substance" (preâmbulo); o segundo como
"condensed-but-faithful (every finding, severity, and key evidence preserved)". A
condensação é feita pelo MESMO parent que depois sintetiza — o canal exato por onde a
síntese degrada sem detecção. O que sobreviveu à condensação nos dois casos: IDs,
severidades, âncoras de evidência ("appender (`append-dispatch.cjs` 46–131)", "ledger
lines 40–44" — eu verifiquei: o ledger de fato contém as linhas `close_of` citadas). O que
NÃO sobreviveu: as linhas `Dissent:`.

**4. As linhas `Dissent:` exigidas pelo SKILL estão ausentes dos DOIS registros.** O SKILL
(§Tension design) manda: "Every explorer/skeptic return ends with an explicit `Dissent:`
line so this check has signal to read" — e define zero-dissent em N≥3 como red flag de
falso consenso. Nenhum dos sete returns de explorer persistidos (E1–E3 do primeiro, E1–E4
do segundo) termina com `Dissent:`. Ou nunca foram escritas, ou a condensação as comeu;
nos dois casos o check de falso-consenso ficou sem sinal para ler. O dissenso real existiu
(T1–T5 do v051 são dissensos inter-explorer genuínos, e.g. "T3 ... opposite remedies, same
defect"; "m11 ... Quine would remove, Gödel would tighten") — mas foi reconstruído pela
synthesizer a posteriori, não declarado pelo emissor.

**5. Fronteiras por agente funcionaram bem e o header carregou a proveniência certa.**
Ambos research.md usam `## E<n> — <nome/ângulo> (model)` — o segundo é mais rico ("E1 —
Gödel, Kurt (formal/internal, opus)"): identidade, ângulo epistêmico e modelo no header.
Nenhuma observação de um agente vazou para a seção de outro. O concat com fronteiras +
namespaces É o contrato implícito que funcionou; ele rangeu apenas onde a fronteira
deixou de existir (returns de reviewer fundidos em um parágrafo conjunto no primeiro
dispatch).

**6. Verificação do parent interfoliada no research.md com marcador explícito — prática
boa não codificada.** No v051, claims checados pelo parent carregam "*(Parent verified:
245.)*", "*(Parent verified: FALSE — README line 22 lists MultiEdit. Refuted.)*" inline no
return do explorer, e o findings cita "parent-verified" como autoridade (C1, M6). Isso dá
ao approver um terceiro tipo de ponto citável além de explorer-claim e reviewer-verdict.

**7. O shape de findings do SKILL não foi usado nenhuma vez.** O SKILL prescreve a matriz
de veredito por candidato (owned?/witnessed?/sound?/GO/KILL); os dois findings.md usam
shapes próprios (lista de amendments com seções Blocks/Tighten/Cut/Open; lista de
severidades CRITICAL/MAJOR/MINOR + Refuted + Open tensions). Ambos, porém, preservaram os
invariantes que importam: todo claim cita um ID, negativas mortas são registradas ("Refuted
(killed by review — recorded so they are not re-raised)"), tensões abertas não são
suavizadas, e o fechamento traz exit_reason + agents_spawned. O contrato útil está nesses
invariantes, não no shape literal da matriz.

**8. Vocabulário de fechamento derivou entre dois artefatos do mesmo dia.** Findings 1
fecha com `exit_reason: converged_and_approved` (vocabulário v0.5.1 que ele próprio
propõe); findings 2 com `resolved` (v0.5.2, §5 "Close of dispatch"). Nenhum dos dois
frontmatters carrega `schema_version` — só `dispatch_id` — então um leitor futuro não
sabe contra qual vocabulário validar o exit sem arqueologia.

## Elementos de contrato que a prática implica

**Output do explorer (o contrato mais provado):**
1. Header de fronteira com identidade + ângulo + modelo (`## E<n> — <nome> (<ângulo>,
   <modelo>)`).
2. Todo claim com ID estável em namespace próprio do agente (`E2#4`, `A1`, `#13`) —
   pré-condição material da checagem P9; emergiu duas vezes sem ser exigido.
3. Toda observação ancorada em artefato verificável (arquivo+linha/seção), porque foi isso
   que permitiu ao parent e ao R1 refutar claims (F21 morreu por "README line 22").
4. Linha `Dissent:` final OBRIGATÓRIA E PERSISTIDA — a regra existe no SKILL e foi violada
   nos dois registros; o contrato precisa declará-la parte do artefato durável, imune à
   condensação.

**Input do explorer:** goal + context + angle próprio + especificação do return (caminho
do arquivo, headers exigidos, esquema de ID, posição da linha Dissent, token alvo). O
prompt deste próprio dispatch é a instância mais completa observada; os anteriores
deixavam o shape implícito e o parent normalizava depois (= o passo de condensação que
degrada).

**Output do synthesizer:** (a) mapeamento de deduplicação claim-novo → IDs-fonte (o
preâmbulo "Every amendment cites..." é a versão embrionária); (b) o DRAFT da síntese deve
ser persistido no research.md com seus próprios IDs antes da revisão — a camada F dangling
é a maior quebra observada; (c) tensões não resolvidas listadas como tais (T1–T5), nunca
suavizadas; (d) sob robot-talks, receber posições inicial E final de cada reviewer (P14 —
no registro, a "Deviation reported" mostra que quando isso é absorvido pelo parent, tem
que ser declarado).

**Output do reviewer:** veredito por ID alheio (UPHELD/REFUTED/downgrade + razão de uma
linha, como R1) + claims novos em namespace próprio (N1–N15) **carimbados como
não-re-revisados** — a prática já faz isso ad-hoc; o contrato deve ter um campo de
verification-tier por claim (`explorer-claimed | reviewer-upheld | parent-verified |
not-re-reviewed`).

**Regra de condensação (o buraco central):** se "verbatim" for relaxado, o contrato deve
listar o que é invariante sob condensação: IDs, severidades, âncoras de evidência, linhas
Dissent, posições inicial/final sob robot-talks. Returns de reviewer/synthesizer têm o
mesmo direito a persistência integral que os de explorer — "full text is in the session
transcript" deve ser proibido como destino final de uma cadeia de citação.

**Fechamento:** findings carrega exit_reason + agents_spawned + desvios declarados (ambos
já fazem) e `schema_version` no frontmatter (nenhum faz), para que o vocabulário de exit
seja validável sem arqueologia.

Dissent: prevejo discordar do irmão precedente-externo quando ele importar contratos de
I/O de frameworks externos (schemas JSON tipados, message-passing estruturado): a evidência
interna mostra que markdown concatenado com namespaces de ID e âncoras de arquivo+linha já
entrega checagem P9 resolúvel — o que falhou não foi a falta de tipagem, foi persistência
seletiva e condensação sem invariantes; e do irmão formal-adversarial quando ele propuser
validação mecânica total dos contratos: as duas quebras reais (camada F dangling, Dissent
ausente) seriam pegas por um checklist de 5 itens no close, não por um schema executável —
exigir o schema repete o erro do validator v0.3.0 que o §7 cortou por cerimônia sem ganho.

---

## E2 — precedente-externo (round 1)


# E2 — Precedente externo: como frameworks existentes tipam o payload entre agentes

Ângulo: esse problema já tem dono no ecossistema. Levantamento de seis precedentes — LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, MetaGPT e o sistema de research multi-agente da Anthropic — focado em três perguntas: (1) como o payload entre agentes é tipado/estruturado, (2) como tratam proveniência/citação entre o trabalho de um agente e a síntese de outro, (3) se existe contrato adotável pronto para o nosso caso (returns markdown concatenados em `research.md` + síntese citada em `findings.md`).

## Por framework

### LangGraph — state channels + reducers
URL: https://docs.langchain.com/oss/python/langgraph/graph-api

- **Payload:** estado compartilhado tipado. "The schema of the `State` will be the input schema to all `Nodes` and `Edges` in the graph, and can be either a `TypedDict` or a `Pydantic` model." Cada chave do estado é um *channel*; nós retornam dicts parciais que são mesclados ao estado.
- **Mecanismo anti-degradação:** *reducers* por canal. Sem reducer, a escrita sobrescreve ("updates overwrite existing values"); com `Annotated[list[str], operator.add]`, escritas paralelas **concatenam** em vez de clobberar — "Reducers ensure these parallel writes merge safely according to their specified logic rather than clobbering each other." `add_messages` é o reducer especializado que deduplica por **ID estável de mensagem**.
- **Proveniência/citação:** nenhuma nativa. O ID por mensagem do `add_messages` é o único primitivo de identidade rastreável; citação é responsabilidade da aplicação.
- **Lição direta para nós:** nossa montagem de `research.md` por concatenação de returns sob headers por filho **é** um reducer append-only sobre um canal de lista. O precedente diz: o reducer deve ser puro (append, sem edição do conteúdo do filho) e cada item precisa de identidade estável — exatamente o que torna citação resolvível.

### AutoGen (core) — mensagens tipadas roteadas por tipo
URL: https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/message-and-communication.html

- **Payload:** objetos serializáveis tipados — "A subclass of Pydantic's `pydantic.BaseModel`, or A dataclass". Regra explícita: "Messages are purely data, and should not contain any logic."
- **Roteamento:** `RoutedAgent` + decorator `@message_handler` despacha pelo **tipo** da mensagem; sem handler compatível → `CantHandleException`. Ou seja: o contrato de input de cada agente é o conjunto de tipos que ele declara aceitar, e violação falha alto em vez de degradar silenciosamente.
- **Proveniência/citação:** nenhuma nativa. O tipo garante a forma do envelope, não a epistemologia do conteúdo.
- **Lição:** contrato por role = tipos de mensagem aceitos + falha explícita em payload fora do contrato. É o argumento mais forte do levantamento para validar o envelope do return (frontmatter/headers) mecanicamente e rejeitar returns malformados em vez de "aproveitar o que der".

### CrewAI — TaskOutput + context chaining
URL: https://docs.crewai.com/en/concepts/tasks

- **Payload:** todo task produz um `TaskOutput` com múltiplas representações em paralelo: `raw` (texto, default), `pydantic` (opcional, via `output_pydantic`), `json_dict` (opcional, via `output_json`) **mais metadados: description, summary, agent name, output format**. `output_file` persiste em disco.
- **Encadeamento:** o parâmetro `context` de um task lista "other tasks whose outputs will be used as context for this task" — o output de um agente vira input declarado do próximo, com espera explícita quando há `async_execution`.
- **Proveniência/citação:** a documentação "contains no mention of citation tracking, agent attribution, or provenance mechanisms" no nível de claim. O `agent name` no TaskOutput é proveniência de **autor**, não de **afirmação**.
- **Lição:** o padrão "corpo livre + envelope de metadados tipado" (raw + summary + agent) é o meio-termo dominante na indústria — é estruturalmente o nosso frontmatter YAML sobre corpo markdown.

### OpenAI Agents SDK — handoffs
URL: https://openai.github.io/openai-agents-python/handoffs/

- **Payload:** handoff é exposto como tool (`transfer_to_refund_agent`); por default o agente receptor recebe **o histórico de conversa inteiro**. Tipagem opcional via `input_type` (Pydantic) para metadados gerados pelo modelo ("reason, language, priority, or summary") — o SDK "validates the returned JSON locally". `input_filter` permite podar/transformar o que o próximo agente vê (`HandoffInputData`).
- **Proveniência/citação:** nenhuma. O contrato é sobre *o que entra*, não sobre rastrear de onde cada claim veio.
- **Lição:** o default "passa tudo" é exatamente o anti-padrão que degrada síntese em fan-outs grandes; o próprio SDK oferece `input_filter` como corretivo. Para nós: o synthesizer não deve receber transcripts dos explorers — só os artefatos-return.

### MetaGPT — SOPs e documentos estruturados como contrato
URLs: https://arxiv.org/abs/2308.00352 (paper, v6 HTML em arxiv.org/html/2308.00352v6)

- **Payload:** "agents in MetaGPT communicate through documents and diagrams (structured outputs) rather than dialogue". O SOP "establishes standards for intermediate outputs" por role; o PRD do Product Manager é o contrato de input do Architect, o design do Architect é o contrato do Engineer — **documento-como-contrato em cadeia**.
- **Transporte:** *shared message pool* publish-subscribe; agentes assinam por role profile ("they can select information to follow based on their role profiles") em vez de receber tudo.
- **Anti-degradação:** a motivação declarada é que padronizar os handovers "reduce[s] the risk of hallucination caused by idle chatter between LLMs" — estrutura no artefato, não no diálogo, é o que segura a qualidade da cadeia.
- **Proveniência/citação:** por construção (cada documento downstream referencia o documento upstream que o constrange), mas sem checagem de citação por claim.
- **Lição:** é o precedente mais próximo do nosso desenho — returns são documentos com seções padronizadas por role, e a síntese consome documentos, não conversa.

### Anthropic — "How we built our multi-agent research system"
URL: https://www.anthropic.com/engineering/built-multi-agent-research-system

- **Payload:** subagentes "independently perform web searches… and return findings to the LeadResearcher"; recomendação explícita de **artefatos fora da janela de contexto**: "implement artifact systems where specialized agents can create outputs that persist independently" e "Subagents call tools to store their work in external systems, then pass lightweight references back to the coordinator."
- **Proveniência/citação — o único precedente que trata o nosso problema central:** citação **não** é propriedade do payload entre agentes; é um **passo dedicado pós-síntese**. "Once sufficient information is gathered… passes all findings to a CitationAgent, which processes the documents and research report to identify specific locations for citations", garantindo que "all claims are properly attributed to their sources". E a verificabilidade é fechada por avaliação: "Citation accuracy (do the cited sources match the claims?)" é critério de rubrica do LLM-judge.
- **Lição:** o pipeline de produção mais próximo do nosso caso resolve citação com (a) artefato persistente + referência leve no canal, (b) agente/passo dedicado de atribuição, (c) checagem de citation accuracy como gate de avaliação — não tentando tipar epistemologia dentro do schema da mensagem.

## O que é padronizado vs idiossincrático

**Padronizado (convergência de todos os seis):**
1. **Ninguém usa texto livre nu na fronteira entre agentes.** Todos impõem um envelope: schema Pydantic/TypedDict (LangGraph, AutoGen, OpenAI `input_type`), TaskOutput com metadados (CrewAI), ou documento com seções padronizadas (MetaGPT, Anthropic).
2. **Duas famílias de contrato, não uma:** *message-schema* (LangGraph/AutoGen/OpenAI — tipa o envelope em memória) e *artifact-as-contract* (MetaGPT/Anthropic/CrewAI `output_file` — payload é documento persistente; o canal carrega referência). Sistemas de research de longa duração convergem para a segunda família.
3. **Merge paralelo exige reducer puro + identidade estável por item** (LangGraph). Concatenação append-only com dedup por ID é o padrão; edição do conteúdo do filho durante o merge não tem precedente em nenhum framework.
4. **Corpo livre + envelope tipado** é o equilíbrio dominante: nenhum framework tenta schematizar o conteúdo epistêmico (claims, evidência) — tipam autor, formato, sumário, razão do handoff.

**Idiossincrático (sem dono no ecossistema):**
1. **Citação/proveniência por claim.** Só a Anthropic trata, e fora do contrato de payload — como passo dedicado + métrica de avaliação. LangGraph, AutoGen, CrewAI e OpenAI SDK não têm nada; MetaGPT tem proveniência por documento, não por claim.
2. **Contrato de output por role epistêmico** (explorer vs synthesizer vs reviewer). Frameworks tipam por *tipo de mensagem* ou *role de SOP de software* (PM/Architect/Engineer); nenhum publica schema para roles de research. O mais próximo é o SOP do MetaGPT como padrão de "estabeleça standards de output intermediário por role" — o método existe, o conteúdo não.

## Candidato a adoção

**Não existe contrato adotável de prateleira** para "checagem de citação verificável entre return de explorer e síntese" — esse pedaço específico não tem dono. Mas existe um **contrato composto por precedentes**, em que cada peça é adotada, não inventada:

1. **Return = artefato persistente com envelope tipado** (MetaGPT documento-como-contrato + CrewAI TaskOutput + nosso frontmatter): frontmatter com agent id/role/modelo, lista de fontes com URL, e seções padronizadas por role. O canal entre agentes carrega só a referência ao arquivo (Anthropic: "lightweight references back to the coordinator") — o synthesizer nunca recebe transcript de explorer.
2. **Identidade estável por claim citável** (LangGraph `add_messages` dedup-por-ID, generalizado): cada return expõe âncoras estáveis (headers/IDs de seção) para que `findings.md` cite `research.md#E2-secao` de forma resolvível. Sem âncora estável, "citação verificável" é impossível por construção.
3. **Montagem de `research.md` = reducer append-only puro** (LangGraph): concatenar sob header por filho, conteúdo do filho congelado, ordem determinística. (Isto valida o que `domainspec-research-writer` já faz — o precedente externo confirma o desenho interno em vez de substituí-lo.)
4. **Checagem de citação = passo dedicado pós-síntese, não propriedade do schema** (Anthropic CitationAgent + rubrica "citation accuracy"): um verificador mecânico/agente que percorre cada claim de `findings.md` e confirma que a âncora citada existe em `research.md` e sustenta o claim. É aqui que a verificabilidade mora — não em tipar mais o payload.
5. **Validação de envelope com falha explícita** (AutoGen `CantHandleException`): return sem frontmatter válido, sem lista de fontes ou sem âncoras é **rejeitado** na entrada do reducer, não absorvido.

O que continua sendo invenção nossa (e deve ser declarado como tal): o **conteúdo** dos contratos por role epistêmico (que seções um explorer/synthesizer/reviewer deve produzir). O precedente fornece o *método* (SOP: padronize o output intermediário por role) e a *arquitetura* (artefato + referência + verificação pós-hoc), mas não o schema das seções de research.

Dissent: prevejo discordar do irmão empírico-interno se ele concluir que a concatenação markdown atual "já basta" — o precedente externo mostra que a peça faltante não é formato de payload, é o passo dedicado de verificação de citação (CitationAgent-equivalente) com âncoras estáveis por claim, que hoje não temos; e do irmão formal-adversarial se ele propor schematizar o corpo epistêmico do return em JSON machine-checkable — nenhum dos seis precedentes tipa claims/evidência dentro do schema; todos mantêm corpo livre sob envelope tipado e empurram a verificabilidade para um passo de checagem separado, e abandonar esse equilíbrio é inventar sem precedente exatamente onde o ângulo E2 manda adotar.

---

## E3 — formal-adversarial (round 1)


# E3 — Derivação formal do contrato mínimo de I/O por role (formal-adversarial)

**Método:** tratar a constituição v0.5.2 (`subagents-strategy-constitution-proposal.md`) e o type skill (`.claude/skills/research/SKILL.md`) como axiomas, e derivar quais propriedades dos artefatos são **logicamente necessárias** para que as checagens já prescritas sejam **executáveis** — nada além disso. Em seguida, evidência externa de que estrutura além do mínimo tem custo mensurável.

## Requisitos mínimos

Premissa de executabilidade: o `final_approver` recebe **apenas** o `working_folder` (P12: "The approver receives the full `working_folder` … so the Principle 9 citation check is actionable"). Logo, toda propriedade necessária à checagem deve estar **dentro dos arquivos**, não na memória do strategist.

### R1 — Returns individuados com âncora endereçável por agente (output do explorer)

**Forçado por:** P9 — "every load-bearing claim in the findings **cites the collected return it rests on**, and the `final_approver` checks this". O artigo definido ("**the** collected return", singular) pressupõe que `research.md` é uma coleção de unidades individuadas: se os returns forem concatenados sem fronteira por agente, a citação não resolve para um alvo único e a checagem deixa de ser mecânica — vira juízo.
**Mínimo derivado:** um cabeçalho/âncora por return de agente em `research.md`. **Não forçado:** IDs numéricos por parágrafo, offsets de linha, âncoras por claim. O approver é um agente que lê os dois arquivos; resolução em nível de seção satisfaz "cites the return it rests on". Granularidade além disso é custo sem regra que a exija.

### R2 — Proveniência agent + angle no return (output do explorer/skeptic)

**Forçado por:** P5 + a red flag pós-execução do skill ("a group of N ≥ 3 returning **zero dissent** is a failure to exercise the tensioning, NOT success"). Para essa checagem ter sinal, cada return precisa ser atribuível ao agente **com seu `angle` declarado** — sem isso, não há como verificar que a tensão da sheet foi exercida nem mapear um claim de volta ao par tensionado de P5 (teste de evidência: "a bias in a_i would be exposed by a_j"). A proveniência é o que liga o artefato à sheet congelada (P2) que o humano confirmou.
**Mínimo derivado:** `agent` (ou `agent_name`/role) + `angle` no cabeçalho do return. **Round é condicional:** proveniência de round só é forçada **se** um edge `feedback`/`zig-zag` disparar — P3 grava o feedback-prompt verbatim na close row; para o approver distinguir material original de material de re-invocação, returns da rodada N precisam ser distinguíveis da rodada N−1. Num dispatch de rodada única, `round` é ruído.

### R3 — Append-only para material já citado entre rounds (propriedade do research.md)

**Forçado por (derivação, não citação literal):** P3 torna o **ledger** append-only, não o `working_folder`. Mas P9 + P10 forçam um análogo mais fraco: `findings.md` cita spans de `research.md`; se uma rodada de `feedback` (P6/§5 connections) **mutar in place** um return já citado, as citações existentes passam a apontar para texto que não é mais a prova — o claim passa a exceder a prova (violação de P10: "Claim ≤ proof in every artifact produced") sem que ninguém tenha escrito nada falso. A checagem de P9 só é executável contra um alvo imóvel.
**Mínimo derivado:** return citado é imutável; rodadas novas **acrescentam** (seções `round: 2`), nunca editam. **Não forçado:** imutabilidade de material de trabalho ainda não citado — as regras não governam rascunho.

### R4 — Verbatim-ness dos returns coletados

**Forçado por:** literal no skill ("`research.md` (collected returns, **verbatim**)") e derivável de P10: se o strategist parafraseia ao coletar, `findings.md` cita a paráfrase — a cadeia claim→prova ganha um elo não verificável (ninguém pode mais comparar o que o agente disse com o que foi citado). Verbatim é o que faz de `research.md` uma **superfície de prova** e não uma segunda síntese. (A evidência externa da seção seguinte — perda por sumarização multi-estágio — mostra por que esse elo extra degradaria de fato, não só em princípio.)

### R5 — Linha `Dissent:` obrigatória ao fim de cada return de explorer/skeptic

**Forçado por:** literal no skill — "Every explorer/skeptic return ends with an explicit `Dissent:` line **so this check has signal to read**". É o único campo de corpo estruturado que as regras exigem, e exigem **porque** uma checagem nomeada (false-consensus) o consome. Esse é o critério geral que esta derivação propõe: **um campo só entra no contrato se uma checagem nomeada o lê.**

### R6 — Payload do synthesizer: pares (posição inicial, posição final) por reviewer

**Forçado por:** P14 — "the synthesizer **MUST receive each review agent's initial and final position (both present in `working_folder`)**, so premature-convergence / collapse is detectable". Formalmente: colapso prematuro = `spread(posições_iniciais) > 0 ∧ spread(posições_finais) = 0` sem argumento registrado que justifique a convergência. Essa desigualdade só é computável se o payload preserva o **delta** — i.e., o resultado do grupo robot-talks (agregação `synthesize`, P7) não pode chegar ao synthesizer já colapsado num consenso único.
**Mínimo derivado:** dois snapshots de posição por agente do grupo robot-talks, ambos persistidos no `working_folder`. **Não forçado:** transcript turn-a-turn da discussão — P14 pede posições, não atas.

### R7 — Output do synthesizer: claim citando return + matriz de verdicts + resposta de uma linha ao `goal`

**Forçado por:** P9 (cada claim load-bearing cita), o skill ("Findings shape — per candidate, a row in the verdict matrix … Close with the one-line answer to the dispatch `goal`") e P12 (o approver julga "against goal" — `resolved` = approver aceitou, e "for research, acceptance includes the P9 citation check"). A regra 2 do skill acrescenta: keystone claims carregam seu collapse-test inline.

### R8 — Contrato de INPUT (todos os roles): já está fechado pela §5 e não deve crescer

A §5 força exatamente: `context` obrigatório ("subagents never see the parent conversation; context is the **only** channel"), `initial_prompt` obrigatório contendo task + contexto + o que já está descartado + **expected return**, `angle` quando n ≥ 2, e `token_budget` declarado no prompt. E a tabela §7 mostra o que foi **deliberadamente removido** do input: `tools`/`read_scope`/`target` ("the agent chooses what to read … the prompt states the task, **not a reading list**") e `expected_output_shape` (dobrado no prompt). O contrato de input mínimo é, portanto, prosa de briefing — não schema.

### Evidência interna: estrutura além do mínimo já foi tentada e morreu

A tabela §7 é um experimento natural dentro do próprio repo: `success_metric` — "Agent filled it with vacuous restatements of `goal`"; `grade` (quatro componentes) — "Never filled in practice"; `constraints`/`stop_conditions` — viraram prosa de briefing. Padrão: **campo estruturado que nenhuma checagem consome é preenchido com vácuo e depois cortado.** Isso é o contrapositivo do critério de R5.

## Evidência sobre trade-offs de formato

### (a) Formato forçado vs qualidade de raciocínio

- **Tam et al. 2024, "Let Me Speak Freely?"** (EMNLP 2024 Industry) — declínio significativo de raciocínio sob restrição de formato; quanto mais estrita a restrição (JSON-mode > prosa), maior a degradação. <https://arxiv.org/abs/2408.02442> · <https://aclanthology.org/2024.emnlp-industry.91/>
- **Réplica/contestação — dottxt, "Say What You Mean"** — ataca a metodologia (prompts desiguais entre condições); mostra geração estruturada igualando ou superando livre em tarefas de classificação com prompts paritários. <https://blog.dottxt.co/say-what-you-mean.html>
- **Convergência da literatura posterior:** a degradação concentra-se quando a restrição se aplica **durante** o raciocínio; instruções de formato sozinhas (antes de qualquer decoder constraint) já causam a maior parte da perda, e "reason-first, format-second" recupera a acurácia (linha "thinking before constraining", <https://arxiv.org/html/2601.07525v1>; benchmark de structured outputs: <https://arxiv.org/pdf/2501.10868>; sobre falsa confiança induzida por outputs estruturados: <https://boundaryml.com/blog/structured-outputs-create-false-confidence>).

**Leitura para o contrato:** estruturar o **envelope** (cabeçalho de proveniência R1/R2, linha `Dissent:` R5, matriz de verdicts R7 — que é pós-raciocínio) é barato; schematizar o **corpo** do raciocínio do explorer (JSON de claims, templates de seção rígidos) é exatamente a condição que a evidência mostra degradar. O contrato mínimo derivado acima coincide com a zona segura: markdown com envelope fixo e corpo livre.

### (b) Perda em pipelines de sumarização multi-estágio

- **Sumarização em dois estágios:** ROUGE cai entre estágios — perda de informação permanece problema aberto. <https://arxiv.org/pdf/2410.06520>
- **Telephone game com LLMs:** cadeias de transmissão iterada derivam para atratores (toxicidade, positividade, comprimento), distorcendo sistematicamente o conteúdo a cada hop. <https://arxiv.org/pdf/2407.04503>
- **Fidelidade em comunicação mediada por LLM (LAAC):** cada transição de agente introduz perda/distorção cumulativa — o que chega ao destinatário diverge do emissor. <https://arxiv.org/pdf/2511.04184>
- **Anthropic, monitoring via sumarização hierárquica:** mesmo em uso defensivo, sumarizar sumários perde sinal — motivo para reter acesso ao material bruto. <https://alignment.anthropic.com/2025/summarization-for-monitoring/>

**Leitura para o contrato:** R4 (verbatim) e P12 (approver recebe o `working_folder` **completo**, não um resumo do synthesizer) são exatamente as duas regras que cortam hops de sumarização entre o explorer e a checagem. Cada camada intermediária de resumo que um contrato "mais rico" adicionasse (ex.: synthesizer entrega só digest ao approver) reintroduziria o telephone effect no ponto onde a verificação acontece. A citação deve resolver em material de rodada-0 verbatim — nunca em resumo intermediário.

### Síntese do mínimo forçado

| Role | Input forçado (§5) | Output forçado |
|---|---|---|
| explorer/skeptic | `initial_prompt` (task+context+descartado+expected return), `angle` (n≥2), `token_budget` declarado | return verbatim com âncora `agent+angle` (+`round` se feedback disparou), corpo livre, última linha `Dissent:` |
| synthesizer | returns verbatim + (se reviewer robot-talks) pares inicial/final por reviewer (P14) | `findings.md`: claim→citação de return (P9), keystone com collapse-test inline, matriz de verdicts, resposta de 1 linha ao `goal` |
| reviewer | draft do synthesizer via zig-zag | posição **inicial** e **final** persistidas no `working_folder` (P14); turno sem inconsistência levantada = convergência (T2) |
| final_approver | `working_folder` completo (P12) | recomendação accept/reject; accept inclui a checagem P9 |

Tudo fora desta tabela carece de regra que o force, e a evidência (a) diz que parte disso teria custo de raciocínio, e a (b) diz que "enriquecer" com camadas de resumo degrada o próprio material verificado.

Dissent: prevejo que o irmão empírico-interno vai querer adicionar campos justificados por falhas observadas em telemetria (templates de seção, IDs por claim, rounds sempre marcados) e o precedente-externo vai querer importar schemas de mensagens estruturadas de frameworks multi-agente (AutoGen/LangGraph-style typed payloads); sustento que qualquer campo que nenhuma checagem nomeada consome repete o destino de `success_metric`/`grade` (§7: preenchido com vácuo, depois cortado), e que schematizar o corpo do raciocínio — não só o envelope — é a condição que Tam et al. 2024 e a literatura reason-first mostram degradar exatamente os agentes cujo output é a superfície de prova.
