---
tags: [agents, dispatch, review, legibility, skills]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: complete
version: 1.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# attacks.md — returns verbatim do review dispatch 2026-06-12-views-skills-legibility-review

Dispatch: `2026-06-12-views-skills-legibility-review` (ledger: `telemetry/agents/subagents-dispatch.yaml`).
Alvos: `.claude/skills/custom/discovery-writing.md`, `.claude/skills/system-view/SKILL.md` (+template), `.claude/skills/engineer-view/SKILL.md` (+template).
Testemunha: `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md`.
Eixo anti-bias: legibilidade máxima vs fidelidade de governança.
Nota de montagem: returns colados integralmente pelo parent, conteúdo congelado. A rodada robot-talks foi executada como dois turnos de confronto em instâncias novas carregando os returns verbatim (SendMessage indisponível no ambiente) — deviation declarada no close.

---

## RETURN — Feynman, Richard | explorer | lente: operabilidade/legibilidade | posição inicial

**Tese:** o corpus foi escrito para um único leitor implícito (o agente LLM que executa a skill); as skills são corretas como especificações de máquina e produzem documentos que herdam essa opacidade. Nenhuma contém a instrução mais básica de um documento de design útil: *inclua uma porta de entrada para quem não esteve na sala.*

- **F-LEG-1** `discovery-writing.md` | "A discovery captures the problem space, design decisions, and enough detail for an agent to write an implementation plan." (linha 8) | CRITICAL | Definição de propósito escrita para o agente que lerá o doc, não para o humano que decide; nenhuma instrução de seção executiva em toda a skill. Fix: seção `## TL;DR` obrigatória após `## Objective` — máx 5 linhas, cada decisão como *problema → escolha → porquê*, termos internos glosados na primeira ocorrência.
- **F-LEG-2** `discovery-writing.md` §Downstream (l. 95–107) | "reconcile-not-regenerate: the views know things this discovery never will" / "the views are derive-only; this discovery is their sole mutation trigger" | CRITICAL | O bloco mais longo da skill é jargão de governança sem uma linha de motivação em linguagem comum. Fix: a seção começa com parágrafo ≤3 frases explicando o problema prático (ex.: "sem esse vínculo, código e design dessincronizam e ninguém sabe qual é a verdade").
- **F-LEG-3** `system-view/SKILL.md` `<objective>` (l. 46–47) | "names every load-bearing stance, and decides none of them..." | CRITICAL | O objetivo descreve o mecanismo de cross-referência sem nunca enunciar por que um stakeholder se importaria. Fix: segunda frase em linguagem comum com o problema prático que a separação nomes/verdicts resolve.
- **F-LEG-4** `system-view/SKILL.md` Step 6 (l. 125–126) | "SPELLING NOTE: the cap-exit value is max_loops_reached (research spelling) — the base constitution spells it loop_cap_reached" | MAJOR | Parágrafo inteiro sobre ortografia de enum no meio do passo de review. Fix: mover para nota de rodapé/`<engineering-notes>`.
- **F-LEG-5** `system-view/SKILL.md` `<applicability>` (l. 63–65) | "This skill is single-instance-validated: the GoldenQuill / Tilth system-view (...) is the only on-disk instance" | MAJOR | Alerta de imaturidade pressupõe GoldenQuill/Tilth; o risco real fica enterrado em cláusula subordinada. Fix: seção `## Maturidade / Limitações conhecidas` em prosa direta com consequência prática.
- **F-LEG-6** `system-view/templates/system-view-template.md` introbox (l. 27–56) | "Provenance & mutation — derive-only. (...) do not hand-edit this file." | CRITICAL | 7 parágrafos de governança são a primeira coisa que o leitor do doc GERADO vê; a testemunha abre sem nenhuma orientação humana. Fix: seção `## Para quem chega agora` obrigatória antes do `## Objective` — 3–5 frases em linguagem comum, sem termos não glosados, respondendo: o que o sistema faz, qual problema resolve, o que está resolvido e o que está aberto.
- **F-LEG-7** template, camada given-vs-optimized (l. 149–165) | rótulos `GIVEN, fixed forever` / `NOT optimization; it simply grows` | MAJOR | Rótulos arquiteturais sem instrução de glosa para o leitor de fora. Fix: comentário de instrução no template glosando os rótulos em uma frase cada, replicado na primeira ocorrência no doc.
- **F-LEG-8** `engineer-view/SKILL.md` `<decision-inventory-discipline>` (l. 182–194) | "RESOLVED — decided AND enforced (...) CRITICAL — OPEN and blocks the core thesis" | MAJOR | O status legend nunca é traduzido para consequência prática no doc gerado (testemunha confirma). Fix: seção `## O que os status significam para você` no template, uma frase de consequência prática por status.
- **F-LEG-9** `engineer-view/templates/engineer-view-template.md` §4 (l. 149–157) | "<what must be built/decided before the thesis holds>" | MAJOR | Placeholder pressupõe o conceito de "thesis", não definido em linguagem comum em lugar nenhum. Fix: placeholder explicita "a promessa central do projeto — [descreva em uma frase]".
- **F-LEG-10** ambas as SKILLs | quality-bars inteiramente sobre integridade interna; nenhum item de legibilidade externa | CRITICAL | O doc pode ser perfeito internamente e opaco externamente — a testemunha prova (4 camadas de prosa técnica antes de qualquer orientação). Fix: item de quality-bar — "um leitor sem contexto do repo, lendo só o resumo executivo, responde: (a) o que o sistema faz, (b) a maior decisão aberta, (c) o que funciona hoje"; falhou, reprova.
- **F-LEG-11** template system-view, tabela de stances (l. 216–229) | "<X versus Y — the tension, not the answer>" | MINOR | Placeholder não pede o porquê da tensão importar. Fix: "<X versus Y — e por que essa escolha importa para [o problema central]>".

Zero-findings: não se aplica — todos os cinco artefatos têm pelo menos um finding.

Diagnóstico sistêmico: a testemunha exige conhecimento prévio de P9, P12, GO-condicional, KILL, arbitragem 1 e PROVISIONAL/BLOCKER para ser compreendida; a melhor frase de comunicação do doc ("estrutura barata na borda, prova congelada no meio, juízo caro e humano no fim") está enterrada na linha 106.

Dissent: o atacante de fidelidade dirá que o TL;DR cria segunda superfície de decisão (resumo diverge do inventory e vira a versão que decisores leem). O risco é real mas gerenciável — TL;DR marcado como derivado, com link obrigatório à row, e a regra "o TL;DR NUNCA contradiz uma row RESOLVED; contradição é blocker de publicação". Doc ilegível é pior: cria superfície de deferência ("o agente escreveu, deve estar certo"), que não é monitorável.

---

## RETURN — Ashby, W. Ross | explorer | lente: fidelidade/governança | posição inicial

**Tese de ataque:** a promessa de legibilidade *já está escrita* nas skills ("stakeholder altitude", "non-engineer can read to judge soundness") mas **não tem teste mecânico** — só os invariantes de governança têm gate. Onde uma regra não tem gate, o autor escorrega; a testemunha prova o escorregão. A emenda ingênua (seção-resumo livre) abre três superfícies de quebra de invariante, todas evitáveis.

- **F-GOV-1** `system-view/SKILL.md` | `<applicability>`: "needs a stakeholder-altitude explanation that a non-engineer can read to judge soundness"; `<quality-bar>`: "state the surface ... plainly at stakeholder altitude" — mas o gate do Step 8 lista thresholds mecânicos só para no-verdict / no-redefinition / handle-resolution | CRITICAL | A skill exige uma propriedade que seu único gate não consegue reprovar. Fix: threshold de legibilidade auditável-por-proxy no Step 8 (zero claim load-bearing sem ponteiro + surface legível sem resolver termos da strip-list).
- **F-GOV-2** testemunha (`agents-input-output/system-view.md`) | Surface l. 32: "envelope estruturado sobre corpo livre, com a verificabilidade morando na persistência e num check de close"; Camada 3 inteira em "telephone effect", "P9/P11/P12/P14", "GO-condicional", "erratum A14" | MAJOR | O escorregão previsto por F-GOV-1, comprovado: regra sem teste → autor escreve em dialeto interno sob a etiqueta de altitude. Fix: "executive gloss" ≤8 bullets em linguagem comum no topo, cada bullet apontando para a seção que o sustenta, presença gated no Step 8.
- **F-GOV-3** `system-view/SKILL.md` `<cross-reference-discipline>`: "Stating a verdict here is a violation"; `engineer-view/SKILL.md`: "engineer-view OWNS every verdict ... No verdict is stated anywhere else." | CRITICAL | Resumo livre re-enuncia "o que ficou definido" — re-enunciar decisão É declarar verdict fora da row dona ("nada decidido duas vezes"). Fix: a camada executiva só reformula shape/stakes, nunca decide; bullet que toca decisão CITA a row dona (`engineer-view#<id>`).
- **F-GOV-4** `engineer-view/SKILL.md` `<cross-reference-discipline>`: "Every verdict cites an AUTHORITY — verified on disk" | CRITICAL | "Executive summary" em prosa corrida é o gênero que afirma sem âncora — claim sem prova. Fix: cada bullet da camada executiva aponta para a seção/row que o sustenta; bullet sem ponteiro é reprovável no gate.
- **F-GOV-5** `system-view/SKILL.md` `<cross-reference-discipline>`: "ontology-view owns the terms. Every term used here is USED, never REDEFINED" | MAJOR | Resumo legível tenta explicar termos — e explicar é redefinir fora do dono. Fix: glosa marcada explicitamente "tradução informal, não definição — termo definido em ontology-view"; nunca sentença definicional autônoma.
- **F-GOV-6** SKILLs + templates | invariantes já aparecem DUAS vezes hoje (ex.: template repete "named here and decided nowhere" l. 103–114 e "Nothing is decided twice" l. 212) | MAJOR | Adicionar a camada executiva em ambos sem decidir o dono replica a lei e cria drift skill-vs-template. Fix: a regra mora numa única seção `<executive-layer-discipline>` da SKILL; o template carrega só o slot vazio + ponteiro.
- **F-GOV-7** `system-view/SKILL.md` `<output-contract>` (l. 244–258) e `engineer-view/SKILL.md` (l. 242–256) | contratos contam "Verdicts stated: MUST be 0" etc.; nenhuma linha para a camada executiva | MAJOR | Regra sem linha no contrato é regra sem teste — a emenda herdaria o defeito que deveria corrigir. Fix: adicionar `Executive-layer bullets: <count> (uncited: MUST be 0) | term-glosses flagged: <count> | bullets stating a verdict: MUST be 0`.
- **F-GOV-8** `discovery-writing.md` §Downstream (l. 94–106) | a discovery não carrega slot/insumo de resumo executivo legível | MINOR | A camada executiva nasce sem fonte upstream. Fix: nota de uma linha — "a executive gloss de cada view reformula a Business Context da discovery; discovery ilegível por praticante de fora é gap na discovery, não licença para a view inventar".

Cobertura: oito findings; o `engineer-view-template` não recebeu finding próprio — seus invariantes são os mais bem-gated do corpus e a emenda o toca por reflexo via F-GOV-3/-4/-6 (defesa explícita registrada).

Onde a regra mora: dono único = SKILL (lei) + template (slot), espelhando o split já usado para o gate.

Dissent: previsto contra a lente legibilidade, que empurrará por resumos LIVRES — livre-e-sem-âncora é exatamente claim>prova (F-GOV-4) e segunda superfície (F-GOV-3); a testemunha (F-GOV-2) prova que prosa livre sob essa skill degenera em jargão, não em clareza — a âncora é o que força a clareza a ser verificável em vez de alegada.

---

## ROBOT-TALKS — Feynman, Richard | posição final

Posição inicial: a camada executiva serve primeiro ao leitor sem contexto; opacidade é falha imediata, segunda superfície é gerenciável com subordinação.

Confrontos (resumo dos vereditos por ponto):
- F-LEG-1 vs F-GOV-3/4 — REFINO: concedo a âncora; bullet reformula stakes, nunca enuncia verdict autônomo, e carrega ponteiro obrigatório à row. Mantenho a obrigatoriedade do TL;DR.
- F-LEG-2 vs F-GOV-8 — MANTENHO + REFINO: dois fixes independentes (consertar a discovery upstream E o parágrafo motivador local, porque o §Downstream é lido isoladamente).
- F-LEG-3 vs F-GOV-1 — REFINO: camadas diferentes (orientação no início do doc vs verificabilidade no gate); ambos necessários; concedo o threshold mecânico no Step 8.
- F-LEG-6 vs F-GOV-2 — CONCEDO: prosa livre no topo sem gate reproduz o escorregão da testemunha; a forma correta é seção estruturada (bullets, não prosa), ≤8 itens, cada um com ponteiro, presença verificada no gate.
- F-LEG-5 — MANTENHO (não tocado por Ashby).
- F-LEG-10 vs F-GOV-7 — CONCEDO E AMPLIO: mesmo problema em duas superfícies; F-GOV-7 é mais preciso; fix unificado no output-contract (teste de leitor externo + bullets uncited = 0 + glosas flagged).
- F-LEG-8/9 vs F-GOV-6 — REFINO: concedo a estrutura (lei na SKILL, slot no template); mantenho que o conteúdo das traduções é necessário.
- F-LEG-7/11 vs F-GOV-5 — REFINO: glosa com flag obrigatório "tradução informal, não definição".

Posição final: camada executiva = executive gloss estruturada (≤8 bullets, não prosa livre) com âncora verificável (cada bullet com ponteiro; zero bullets enunciando verdict). Opacidade e deriva de governança não são trade-offs — alimentam-se: doc opaco produz leitores que pulam a row e copiam o resumo. Gate mecânico no Step 8; lei uma vez na SKILL em `<executive-layer-discipline>`; template só slots e ponteiros.

Dissent: a flag "tradução informal" é necessária mas insuficiente para autores em prazo — sem exemplo negativo explícito no template (o que NÃO é uma glosa válida), o escorregão persiste mesmo com a flag. Resolve-se com fixture/exemplo, não com texto normativo adicional.

---

## ROBOT-TALKS — Ashby, W. Ross | posição final

Posição inicial: a skill promete legibilidade mas não a testa; sem threshold mecânico, prosa livre degenera em jargão. A âncora-por-bullet converte legibilidade prometida em legibilidade verificável.

Confrontos (resumo dos vereditos por ponto):
- F-LEG-1/3/6 — CONCEDO: minha lente cobriu a forma do bullet mas não exigiu o porquê prático; a glosa executiva precisa carregar problema→escolha→razão, não só reformular shape.
- F-LEG-10 — CONCEDO e ABSORVO: o teste do leitor externo (responde o-que-faz / maior-decisão-aberta / o-que-funciona-hoje) é o threshold auditável-por-proxy que F-GOV-1 pedia; adoto como o gate de F-GOV-2.
- F-LEG-2/5/8 — REFINO: traduzir status/jargão é obrigatório, MAS a tradução é glosa marcada "informal", nunca re-decide — F-GOV-3/5 continuam de pé sobre a tradução.
- Dissent de Feynman (anti-contradição como regra suficiente) — REFINO: necessária mas insuficiente; um TL;DR pode ser não-contraditório e ainda afirmar sem citar (F-GOV-4) ou re-enunciar a decisão (F-GOV-3). Contradição é só um dos três modos de vazamento.
- Prioridade opacidade > segunda-superfície — CONCEDO a prioridade; MANTENHO que a cura é âncora, não liberdade — TL;DR ancorado é tão legível quanto livre e fecha os outros dois vazamentos de graça.
- F-LEG-4/7/9/11 — CONCEDO inteiro: defeitos reais, ortogonais à governança, sem custo para mim.

Posição final: a camada executiva é um TL;DR obrigatório no topo (pós-Objective), ≤8 bullets / ≤5 linhas em linguagem comum, estrutura problema→escolha→porquê — a forma de Feynman. Mas cada bullet load-bearing carrega âncora: aponta para a seção/row que o sustenta, reformula apenas shape/stakes (nunca decide), e qualquer tradução de termo/status vem marcada "tradução informal, não definição". O gate é o teste de leitor externo de Feynman acoplado a três checks mecânicos no output-contract: bullets uncited = 0, bullets com verdict = 0, glosas flagged. A lei mora na SKILL (`<executive-layer-discipline>`); o template só expõe o slot + o teste de leitor. Legibilidade e governança deixam de competir: a âncora é o que torna a legibilidade auditável.

Dissent: nenhum.
