---
tags: [agents, dispatch, review, downstream, usabilidade]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-discovery
role: l3c-downstream
---

# Review l3c — usabilidade downstream (system-view / engineer-view / ontology-view)

Artefato: `discovery.md` (v0.3.0). Referências: `research/findings.md`, `research/research.md`, `.claude/skills/system-view/SKILL.md`, `.claude/skills/engineer-view/SKILL.md`, `.claude/skills/ontology-view/SKILL.md` (aberturas: objective/applicability/inputs/reusability-contract), `register-dispatch/SKILL.md`. Gate único: os três autores de views vão trabalhar SÓ com esta discovery + findings/research — (a) o system-view consegue nomear as stances e apontar onde cada verdict mora? (b) o engineer-view consegue montar o inventário com verdict + status + autoridade verificável em disco? (c) o ontology-view consegue tipar nós/edges e formular as proibições como não-construtíveis? (d) o que cada autor teria que RE-DECIDIR?

**Veredito geral.** A discovery passa os três gates no grosso e acima da média no que mais importa: **nenhuma decisão sem autoridade verificável foi encontrada** — toda posição cita findings §2/#n, findings §3/arbitragem ou research §E1–E3, todos resolvidos em disco (spot-checks: findings §2 #6, §4 Close itens i–vi, §6.1; research §E1/E2/E3 presentes; constituição e register-dispatch/SKILL.md presentes); as adições próprias estão marcadas "desta discovery" e demovidas a recomendação revisável; o §4 "Declínios provisórios" fecha explicitamente a porta para o ontology-view bancar não-KILLs como negativas tipadas — disciplina downstream exemplar; o ERRATUM A14 (§5) corrige o upstream com autoridade citada (schema fechado da close row). As falhas encontradas são de **tradução, não de substância**: o vocabulário de verdict da discovery não mapeia declaradamente para o vocabulário de status do engineer-view (U1), a fronteira de tipo entre "envelope", "linha estruturada dentro do corpo" e "schema do corpo" (o objeto do KILL) não está desenhada (U2), e as decisões da tabela §3.7 não carregam handle próprio (U3). Itens em ordem de gravidade.

## Itens

### U1 — Sem mapa GO/GO-condicional/LEI/KILL/"adotada" → RESOLVED/OPEN/CRITICAL: o autor do engineer-view re-decide a classificação de ~17 linhas

O engineer-view exige por row "a verdict, a status (RESOLVED / OPEN / CRITICAL), and a CITED authority" e seu input diz: design decisions da discovery semeiam rows RESOLVED, Open Questions semeiam OPEN/CRITICAL. O vocabulário da discovery tem cinco categorias contadas (GO 10 · GO-condicional 3 · LEI 2 · OPEN 1+3 · KILL 2) mais duas linhas "adotada (A2)/(A3)" fora da contagem — e nenhuma é traduzida:

- **GO-condicional** é o caso agudo: a própria discovery insiste "GO-condicional NÃO é GO" (§3.5) e que a spec nunca o apresente como adquirido (§6) — mas é RESOLVED-com-autoridade-pendente, OPEN ou CRITICAL? A regra do engineer-view ("a discovery OQ with no enforcing gate becomes an OPEN/CRITICAL row... never a RESOLVED row") não cobre o caso "decisão tomada, gate pendente de emenda".
- **LEI** "não conta como aquisição sob P10" (§3.3) — vira row do inventário (com autoridade = skill/P14) ou referência sem row? Se vira row RESOLVED, a contagem honesta que a discovery manda preservar (§6, última frase) muda de denominação.
- **KILL** — row resolved-negativa ou só entrada do ledger de resíduo? O engineer-view não tem categoria nomeada para negativa bancada.
- **"adotada (A2)/(A3)"** (§3.7, duas últimas linhas) — verdict fora do vocabulário contado, sem status declarado.

Nada disso exige decisão nova: é tradução. Uma nota de 4 linhas na discovery (ou a instrução explícita "o mapa é decisão do autor do engineer-view, registre-o como row própria") elimina a re-decisão silenciosa.

### U2 — A fronteira envelope / linha-estruturada-no-corpo / schema-do-corpo não está desenhada — o ontology-view re-decide o tipo das peças internas do return

O KILL #6 proíbe "schema JSON/tipado do corpo epistêmico"; o GO 3.1 manda "headers/frontmatter estruturados; corpo do raciocínio livre". Mas o contrato exige DENTRO do corpo: IDs de claim (`E1#4`), mínimo 1 âncora por claim em formato fechado, linha `Dissent:` final, duas linhas rotuladas `Posição inicial:`/`Posição final:`, carimbo de condensação. §2(b) ainda cita E3 R5 chamando `Dissent:` de "o único campo de corpo estruturado que as regras exigem" — enquanto a própria discovery adota IDs e âncoras igualmente estruturados e igualmente no corpo. Para o ontology-view, que precisa tornar o KILL não-construtível por tipo, a pergunta é direta: IDs/âncoras/Dissent são nós de QUE tipo — envelope (mas vivem no corpo), corpo (mas são estruturados), ou uma terceira categoria "linha estruturada sancionada" que nenhum dos três documentos nomeia? Sem essa terceira categoria nomeada, ou o guard do KILL #6 fica formulável só em prosa ("schema é proibido exceto as linhas que os checks nomeados leem" — exatamente o critério de E3, mas nunca enunciado como fronteira de tipo), ou o autor a inventa. Recomendação: uma frase em §3.1 nomeando a categoria (e.g. "linha estruturada consumida por checagem nomeada — não é schema do corpo; o KILL proíbe schematizar o RACIOCÍNIO, não as linhas que os checks leem").

### U3 — As 12 decisões da tabela §3.7 não têm handle — system-view e engineer-view precisam de ID estável por stance e a discovery (sobre IDs!) não dá os seus

O system-view aponta `stance:<slug> → engineer-view#<id>`; o engineer-view exige "exactly ONE owning row" por stance. As decisões numeradas (3.1–3.6, 3.8) são endereçáveis; as 12 linhas da tabela §3.7 são anônimas — endereçáveis só por paráfrase ou pelo fallback findings §2 #n, que cobre 10 delas mas não as duas "adotada" (que citam arbitragens, não linhas da matriz). Ironia registrável: a discovery cujo objeto é identidade estável por claim citável não atribui identidade estável às próprias decisões. Correção barata: numerar as linhas (3.7.1…3.7.12) ou declarar "o handle canônico de cada decisão é o #n da matriz do findings; as adotadas A2/A3 usam o ID da arbitragem".

### U4 — A taxonomia de edges (1–5) nunca é glosada na discovery

§3.7 decide "edge 1 sempre; edges 2–5 iff n≥2" e §3.2/§3.3 remetem a "edge 2/A4", "edge 4/A8", "edge 5" — mas a discovery nunca diz o que cada edge É (parent→explorer; explorer→research.md; research.md→synthesizer; synthesizer↔reviewer; synthesizer→explorers — findings §4). Para o ontology-view os edges são exatamente os EDGES tipados do grafo, e o skill manda tratar "a relationship the discovery does not carry" como discovery gap. Mitigado porque o findings está no working set do autor — mas uma gloss de 5 linhas (ou uma coluna no §6) tornaria a decisão de aplicabilidade legível sem salto e daria ao ontology-view a lista de edges direto da fonte que ele deve minerar primeiro.

### U5 — Citações de trilha de revisão sem caminho: "O4", "V1/I5", "D5/S3/S4/S6", "T2" resolvem em disco, mas só por caça

Verifiquei: O4 resolve em `research/.work/reviews/l2b-overspec.md`; S3/S4/S6/D5 resolvem em `.work-discovery/reviews/l2*.md`; V1/I5 e T2 via findings §8. Mas a discovery nunca dá um caminho, e existem DUAS "trilhas L2" distintas (a do findings em `research/.work/reviews/` e a desta discovery em `.work-discovery/reviews/`) distinguidas só pela locução "do findings"/"desta discovery". Sob a disciplina strike-on-unverifiable do engineer-view, uma autoridade que o autor não consegue resolver é riscada — e o custo de resolução aqui é uma caça em dois diretórios `.work*`. Nota agravante temática: a discovery condena cadeias de citação que morrem em artefato efêmero, e `.work/` é o degrau imediatamente acima do transcript — durável hoje, sem status declarado. Correção: uma linha em Connections (ou nota de rodapé) mapeando token de trilha → arquivo.

### U6 — OPEN vs CRITICAL: a sinalização de blocker existe mas está espalhada

O engineer-view distingue OPEN de CRITICAL; a discovery dá 3 OPENs + 5 emendas pendentes + 1 ERRATUM com a criticidade só implícita: "a fase de spec depende destas emendas" (todas?), "destrava 3.5" (emenda 1 = blocker real), "independente e pequena" (emenda 5 = não-blocker), ERRATUM "a propagar" (blocker de redação). O material para classificar está todo lá — mas o autor monta o ranking, não o lê. Uma marca por item (blocker-da-spec / não-blocker) fecharia.

### U7 — `<label>` permanece subdeterminado para tipagem estrutural — resíduo consciente, registrar e seguir

A definição provisória (§3.2) + os abertos (§5: derivação canônica, unicidade entre grupos, caso `agent_name` null) estão honestamente declarados com recomendação. Consequência downstream apenas registrada, não cobrada: o ontology-view não consegue tornar a unicidade do claim-ID estrutural enquanto `<label>` for string opaca com unicidade OPEN — o nó claim-ID nasce com guard PLANNED, não LIVE. Nenhuma ação na discovery além do que já está lá; o autor deve carimbar o guard como pendente do fechamento de §5/abertos, não inventar a derivação.

## (d) Consolidado — o que cada autor re-decidiria hoje

- **engineer-view:** o mapa de status (U1 — única re-decisão de varredura total); o status das linhas "adotada" (U1); o ranking OPEN/CRITICAL (U6); manter ou riscar autoridades de trilha não-ancoradas (U5).
- **system-view:** cunhar handles para as 12 decisões de §3.7 (U3). Fora isso, passa limpo: as stances são identificáveis (3.1 marcada estruturante, A3 define load-bearing), cada uma tem verdict citável em findings §2/#n ou §3, e a discovery decide zero vezes o que já estava decidido.
- **ontology-view:** a categoria de tipo das linhas estruturadas no corpo (U2 — única re-decisão substantiva); a lista de edges a partir do findings, não da discovery (U4); guard de unicidade de claim-ID como PLANNED (U7). As proibições estão formuláveis: KILL #6 (com U2 resolvido), KILL #18 como predicate guard (round iff edge 5 disparou), citação→transcript como edge proibido, parent→condensa→return como edge proibido, F-section como alvo-nunca-prova-terminal — e §4 declínios 7–9 explicitamente fora do banco de negativas.

Contagem: 7 itens (U1–U7) — 2 altos (U1, U2), 3 médios (U3, U4, U5), 2 baixos (U6, U7). Nenhum bloqueia o uso da discovery; U1 e U2 são os que produzem re-decisão silenciosa se não tratados.

Dissent: U1 e U2 podem ser lidos como trabalho legítimo da fase seguinte (toda tradução de vocabulário é, por definição, do tradutor) — mantenho-os como itens da discovery porque nos dois casos o autor downstream re-decidiria SEM texto citável para apontar, que é exatamente a falha que esta discovery existe para impedir.
