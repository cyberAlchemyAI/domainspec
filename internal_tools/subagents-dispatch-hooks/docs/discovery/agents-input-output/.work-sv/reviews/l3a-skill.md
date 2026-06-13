---
tags: [agents, dispatch, review, system-view, skill-conformance, p9, l3a]
node_type: audit
is_session: false
layer: architecture
nature: explanatory, reference
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# L3a Skeptic Review — system-view.md v0.3 vs .claude/skills/system-view/SKILL.md

Dispatch: 2026-06-12-agent-io-system-view · Gate único: conformidade integral com o SKILL.md do system-view. Artefato: `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md` v0.3.0. Método: invariante por invariante, com verificação on-disk das citações load-bearing (findings.md §2/§3/§4-edges-1-5+Close/§5/§6/§8 e discovery.md v1.0.0 §1–§7 / OPENs 6.1–6.3 — todas resolvem).

## PASS (uma linha cada)

- **Objective-first gate (≤3 frases, primeira seção):** PASS — `## Objective` é a primeira seção do corpo, 2 frases, e a segunda enuncia o próprio invariante nomeia-toda/decide-nenhuma (artefato L16–18; SKILL `<context>` L50).
- **Surface em altitude de stakeholder, sem schemas/código:** PASS — "Surface — o que isto é" (L28–35) declara o alvo, a promessa (P9) e o stake em prosa pura (SKILL lane #1, L177).
- **Camadas de shape uma por vez:** PASS — quatro camadas conceituais distintas (problema / shape da solução / economia de verificação / regime de mudança), cada uma uma seção (L38, L61, L94, L121; SKILL quality-bar L201).
- **Tabela "alternative framings we considered" por camada:** PASS — as quatro camadas carregam tabela própria com proveniência e razão de não-adoção por linha (L51–57, L81–91, L108–117, L135–142; SKILL L201, L219).
- **Seção given-vs-optimized:** PASS — Camada 4 é explicitamente "a camada given-vs-optimized", separando LEI / GO / GO-condicional / OPEN / KILL com regra de honestidade por categoria (L121–133; SKILL L202, lane #3 L179).
- **"What this view does not cover" final:** PASS — mapa de fechamento presente, enumera o que engineer-view possui (vereditos, schemas, mecânica, erratum A14, emendas) e o que ontology-view possui (termos), e fecha na linha nothing-decided-twice ("**Nada é decidido duas vezes.**", L186–195; SKILL L205, lane #7 L183).
- **Nomeia-toda-stance / decide-nenhuma:** PASS — vereditos narrados são sempre do corpus (findings §2/§3, citados) e a view marca consistentemente "decisão de design declarada, não vitória" / "colisão registrada, não decidida" / "proposto, não decisão nova"; nenhuma stance é originada ou resolvida aqui (L18, L126, L131, L148; SKILL Step 6(b) L125).
- **Cada stance → exatamente uma row do engineer-view:** PASS — 20 stances, 20 handles únicos (conferido: zero duplicata), cada um `stance:<slug> → engineer-view#<id>` com exatamente uma row dona; rows-com-split (#9, #17) declaram o compartilhamento preservando um-verdict-um-status por row (L148–171; SKILL L173, L186).
- **Fallback PROVISIONAL + blocker OQ:** PASS — engineer-view inexistente → todos os 20 handles marcados `[PROVISIONAL — row not yet authored]` e OQ-SV-1 [BLOCKER] levantado com dono nomeado — exatamente o fallback do SKILL (L148, L179; SKILL Step 5 L122, L189).
- **Termos deferidos à ontology-view:** PASS (com K2 parcial abaixo) — bloco "Contexto de fontes" pina a fonte de termos (ontology-view ausente → vocabulário de trabalho discovery §2, "nunca redefinido aqui") e OQ-SV-2 registra a ausência com dono (L22, L180; SKILL Step 1 L110).
- **Stance-to-verdict cross-reference table:** PASS — tabela com as três colunas exigidas (stance | tensão nomeada, não decidida | row dona) presente como "Mapa de stances" (L150–171; SKILL Step 8 L131).
- **Open questions com dono, blockers flagados, numeração própria:** PASS — OQ-SV-1..4, cada um com dono ou propriedade externa declarada; só o de inventário ausente é BLOCKER, conforme a lista blocker-level do SKILL (L175–182; SKILL Step 7 L128).
- **Frontmatter conforme:** PASS — `node_type: discovery` + `governance_status: project-local-overlay` (único delta local sancionado), campos obrigatórios do cheatsheet presentes, veracidade/convicção corretamente omitidos (doc multi-stance não-decidido), linha 1 = `---` (L1–12; SKILL `<inputs>` L72, frontmatter.md).
- **Provenance/mutation + Connections:** PASS — `derives-from → discovery.md` como EDGE com baseline de versão (1.0.0) e regra de drift reconcile-not-regenerate; nenhum campo proibido (`generated_by`/`mutation_policy`/`canonical_source`) no frontmatter; edges forward-only para artefatos congelados (L199–205; SKILL L100–103).
- **Citações verificadas em disco:** PASS — anchors load-bearing (findings §2 matriz, §3 arbitragens, §4 contratos por edge + Close, §5 emendas, §6 OPENs, §8 trilha; discovery v1.0.0 §1–§7, 6.1–6.3) todas resolvem; nenhuma citação fantasma encontrada para strike (SKILL Step 6 L125).
- **Checklist de reusabilidade:** PASS — zero token GoldenQuill (CIC/CLC/council/seat-names etc.), zero placeholder, descrição própria do alvo, stances em linguagem do próprio domínio, output como sibling da discovery no folder do projeto (SKILL L82–88, L92).
- **Telemetria:** PASS (não devida) — o epílogo `domainspec-emit-signals` é mandatório APÓS o Step 8 (publish); artefato está em draft v0.3 pré-publish, logo a ausência de envelope em `pipeline-signals.jsonl` não é violação ainda (SKILL L230–234). Vira FAIL se publicar sem emitir.

## FAILs / Parciais

- **K1 [PARTIAL — baixo-médio] Vazamento de literal de contrato no shape.** O edge 2 enuncia inline a gramática default do claim-ID (`<label>#<n>`) e mecânica de header/`Dissent:`-última-linha em especificidade quase contratual (artefato L72, L74), enquanto o próprio closing map atribui "os contratos literais por edge" ao engineer-view (L190) e o SKILL proíbe "dropping into schemas or code — contracts and schemas belong in engineer-view" (SKILL L218, L174). Mitigação real: cada literal aponta "texto canônico: findings §4" e a derivação de `<label>` é stance aberta (`stance:derivacao-de-label`). Correção: demover os literais inline a descrição de shape + ponteiro; manter só o nome da peça.
- **K2 [PARTIAL — baixo] Glosses com forma de definição na Camada 2.** Os três bullets de território ("O **envelope** — a casca estruturada FORA do corpo...", L65–67) são estruturalmente definições, e o SKILL exige "use + a pointer" no lugar de definição (SKILL L172, L215). Mitigação: o parágrafo-pai cita a fonte ("vocabulário: discovery §2 e §4.1") e o Contexto de fontes pré-declara o regime. Correção: quando a ontology-view for autorada, demover os três glosses a usos + ponteiro — hoje é restatement-com-ponteiro, não redefinição franca; por isso parcial, não FAIL.
- **K3 [PARTIAL — baixo] Cobertura "per-major-section" das tabelas de framings ambígua.** As tabelas existem nas 4 camadas, satisfazendo o quality-bar (escopo por camada, SKILL L201); mas o gate do Step 8 lê "presence of a per-major-section alternative-framings table" (SKILL L131) e o lane model diz "one table per major section" (L181) — Surface, Mapa de stances e o closing map não carregam tabela. Na leitura estrita do Step 8 isto falha no publish. Correção mínima: ou uma linha no artefato declarando que "major section" = camada de shape (leitura quality-bar), ou tabela curta na Surface.
- **K4 [PARTIAL — baixo] Lifecycle anti-bias sem evidência on-disk do run de autoria.** Não existe dispatch folder, spec composto persistido nem arquivos per-agent para o run que produziu v0.3 (verificado: nenhum `agents/` no folder, nenhum `.work-sv` pré-existente). Isso é legal SE o skip predicate (`single + N=1`, o DEFAULT, SKILL L116, L166) se aplicou — mas o skip path ainda exige os sub-passes skeptic/citation-strike e cross-reference (SKILL L116), e não há evidência persistida de que rodaram na autoria. Mitigação: o presente dispatch L3 (modo `review` standalone, SKILL L56) está exercendo exatamente essas funções agora, e este review não encontrou citação fantasma nem handle órfão. Correção: registrar no close do dispatch que o skip path foi tomado e que o sub-passe skeptic foi suprido pelo round L3.

## Placar

**PASS 17 · PARTIAL 4 (K1–K4) · FAIL duro 0 · BLOCKER 0.** Nenhum dos três thresholds mecânicos de blocker do Step 8 dispara: zero veredito declarado em prosa, zero termo redefinido (K2 é borderline julgado não-redefinição), zero stance sem row dona (PROVISIONAL + blocker OQ é o fallback sancionado, não violação). Artefato CONFORME para draft; K1–K3 são apertos pré-publish.

Dissent: K3 audita uma ambiguidade do próprio SKILL (quality-bar escopa as tabelas por camada; Step 8 e o lane model dizem per-major-section) — se o dono do skill ratificar a leitura por-camada, K3 cai e o placar vai a 18/3; o artefato não deve ser cobrado pela inconsistência interna do gate.
