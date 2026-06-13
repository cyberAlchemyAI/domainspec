---
tags: [agents, dispatch, review, io-contracts, conventions, frontmatter, edges]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l3a-convencoes (skeptic, dispatch 2026-06-12-agent-io-discovery)
---

# Review L3a — convenções do repo para discoveries (discovery.md v0.3)

Gate único: conformidade de `discovery.md` v0.3 com `.claude/skills/custom/discovery-writing.md`, `.claude/skills/custom/frontmatter.md` e (via referência obrigatória do primeiro) `.claude/skills/custom/edges.md`. Método: leitura integral dos três skills contra o artefato; cada violação cita a regra exata, o trecho da discovery e a correção. Checks que PASSARAM estão declarados ao final para que o silêncio não seja lido como omissão.

## Itens

### K1 — MAJOR — Seção obrigatória "2. Core Concepts" ausente; estrutura mandatória quebrada

- **Regra exata** (discovery-writing.md §Mandatory Document Structure): "Sections must appear in this order. Do not skip or reorder them." e "### 2. Core Concepts — Introduce the new abstractions and key design decisions. [...] Each concept should have: A name / What it does (one sentence) / Why this design was chosen over alternatives".
- **Trecho da discovery**: a seção 2 é "## 2. Design space — as alternativas que colidiram"; nenhuma seção "Core Concepts" existe no documento. Os conceitos novos (envelope tipado sobre corpo livre, categoria LEI, ID `<label>#<n>`, re-ask capeado helper-P11, contagem honesta GO/GO-condicional/LEI/OPEN/KILL, GO-condicional como status) estão espalhados entre §2, §3 e o preâmbulo, sem o formato nome + uma-frase + porquê.
- **Por que não é cosmético**: o próprio skill torna a seção load-bearing a jusante — "§Downstream: **`/ontology-view`** [...] Seeds from: the discovery's **Core Concepts** (→ typed nodes)" e "**`/system-view`** [...] Seeds from: the discovery's **Business Context** and **Core Concepts**". Sem a seção nomeada, o caminho de seeding documentado dos views quebra por referência.
- **Correção**: inserir "## 2. Core Concepts" antes do design space (renumerando 2→3, 3→4, ...), listando os ~6 conceitos acima no formato do skill, cada um com ponteiro para a subseção de §Decisões que o instancia — sem duplicar texto normativo (mesma disciplina que 3.6 já aplica ao checklist).

### K2 — MEDIUM — Bidirecionalidade de edges: inversos `cited-by` ausentes em dois alvos `cites`

- **Regra exata** (edges.md §MANDATORY): "Every edge **between vault nodes** is declared on **both** endpoints. The source document writes the forward edge [...]; the target document writes the inverse in its own `## Connections` block. [...] there is no SQL-layer inference of the missing side."
- **Trecho da discovery**: `## Connections` declara `cites` → `research/research.md` e `cites` → `subagents-strategy-constitution-proposal.md`. Verificado nos alvos: `research.md` **não tem bloco `## Connections`** (nenhum `cited-by`); `subagents-strategy-constitution-proposal.md` (node_type: constitution, frontmatter vault-style) **idem**. Em contraste, `research/findings.md:155-159` declara o inverso `derives` corretamente.
- **Caveat declarado**: edges.md escopa o MANDATORY a "vault nodes" e deixa caminhos não-vault como questão aberta (§Scope: "Other non-vault paths [...] remain a separate question — see OQ-C"). Porém o conjunto deste dispatch **já optou pela convenção** ao declarar o inverso em findings.md — aplicação seletiva é o pior dos dois mundos: nem carve-out declarado, nem grafo íntegro.
- **Correção**: adicionar `## Connections` em `research.md` com `| discovery.md | cited-by | ... |` e o mesmo em `subagents-strategy-constitution-proposal.md`; OU declarar explicitamente (na discovery ou no close) que docs sob `internal_tools/**` seguem o regime OQ-C forward-only — e então justificar por que findings.md carrega inverso. O edge para `.claude/skills/research/SKILL.md` está correto como está (carve-out forward-only por alvo, já anotado na própria row).

### K3 — MINOR — Conteúdo load-bearing antes do Objective

- **Regra exata** (discovery-writing.md): "### Objective (≤3 sentences, **required first**)" e Quality Checks: "[ ] Objective written before any other section".
- **Trecho da discovery**: o blockquote da linha 15 ("> Esta discovery **codifica** o `research/findings.md` [...] GO-condicional permanece condicional; OPEN permanece aberto; LEI permanece lei referenciada [...]") precede `## Objective` e carrega compromissos de escopo e status — não é decoração, é a tese de fidelidade do documento.
- **Correção**: mover o blockquote para imediatamente DEPOIS do Objective (ou para uma nota de proveniência no topo de §1). O título H1 antes do Objective é inócuo; prosa normativa não é.

### K4 — MINOR — Objective cumpre o gate de 3 frases pela letra, não pelo espírito

- **Regra exata** (discovery-writing.md §Objective): "**Quality gate:** If you cannot write this in 3 sentences, the scope is unresolved."
- **Trecho da discovery**: a segunda frase do Objective encadeia ~90 palavras com quatro categorias de veredito, dois travessões aninhados e três alvos de emenda ("O estado final é o conjunto de vereditos [...] — pronto para virar emendas pontuais em `research/SKILL.md`, na constituição e no cheatsheet de frontmatter.").
- **Atenuante**: o escopo ESTÁ resolvido — o propósito do gate é atendido; a violação é de legibilidade, não de escopo. Correção: quebrar a frase 2 em duas (estado final dos vereditos · destino em emendas) ainda fecha em ≤3 se a frase 3 for fundida via ponto-e-vírgula — ou simplesmente aceitar 4 frases curtas e declarar a deviation; legibilidade > contagem.

### K5 — MINOR — §6 roça em plano de implementação na "Sequência recomendada"

- **Regra exata** (discovery-writing.md, Quality Checks): "[ ] No implementation steps disguised as design decisions — if it's 'do X then Y', it belongs in an implementation plan."
- **Trecho da discovery** (§6): "Sequência recomendada: emendas de skill (2–4) podem entrar juntas como uma revisão do research/SKILL.md; a emenda constitucional (1) segue o rito de governança próprio [...]; a emenda de cheatsheet (5) é independente e pequena."
- **Atenuante**: a tabela de housing de §6 é decisão de design legítima ("onde mora") e o parágrafo é marcado como recomendação, não tarefa; mas "podem entrar juntas / segue o rito / é independente" é sequenciamento — material de plano. Correção: reduzir o parágrafo a constatações de dependência ("1 exige rito de governança; 5 não depende de nada") e deixar a ordem para o plano.

## Checks que PASSARAM (declarados para não inflar nem omitir)

- **Frontmatter completo e legal** (frontmatter.md): linha 1 é `---`; `node_type: discovery` ∈ enum; `layer: architecture` ∈ enum; `nature: explanatory, technical` (multi-valor permitido); `tags` lista livre; `version` semver 0.x.x; `last_updated` ISO; `created_by` string única. `veracidade`/`convicção` **corretamente omitidos**: a regra diz "Omit when a `discovery` holds multiple options at varying confidence (per-option confidence belongs inline)" — e esta discovery carrega exatamente isso (GO/GO-condicional/OPEN/KILL inline). PASS.
- **`status: draft` é o valor correto** para o estágio: frontmatter.md manda "Start at `draft`" e **não existe valor `published` no enum** (`draft | exploratory | active | consolidated | evergreen`). "Promovido" no vocabulário deste repo deve mapear para `exploratory`/`active` — bump devido só quando a spec passar a se apoiar nela, não antes do fim desta trilha L3. PASS.
- **Nomenclatura e localização**: `discovery.md` dentro de `docs/discovery/<topic>/` espelha o padrão `vault/discovery/<topic>/discovery.md` dos skills; a base foi fixada pelo dispatcher. Nota não-bloqueante: o slug da pasta (`agents-input-output`) difere do id do dispatch citado no corpo (`agent-io-contracts`) — cosmético, nenhuma regra citável violado.
- **Altitude de discovery mantida**: o documento sistematicamente recusa redigir texto normativo ("texto canônico dos itens em findings §4 [...] **não reproduz os itens**, para não criar segunda cópia divergível"), open questions todos com recomendação (Quality Check ✓), "What stays" não-vazio ✓, todo item de "What's broken" com arquivo + âncora de seção ✓ (o análogo de `file.py:line` para corpus documental). Única deriva é K5.
- **Tipos de edge corretos**: `derives-from` → findings ("typically declares derives-from toward the research/findings it stands on" ✓), `cites` → constituição ✓, forward-only para skill file corretamente usado E anotado na própria row ✓. `supersedes` ausente é correto (não há discovery anterior; v0.1→0.3 é o mesmo documento).

Dissent: K1 pressupõe que discovery-writing.md é o template certo — mas a linha 12 do próprio skill roteia "proposed revision to a constitution/premise/axiom" para `knowledge-discovery-writing.md`, e §5 desta discovery é majoritariamente recomendação de emendas à constituição e ao skill; se o template correto for o de knowledge-discovery, K1 (e a numeração exata de seções) pode ser exigência do gabarito errado. Segundo, K2 aplica a docs fora de `vault/` uma obrigação que edges.md só fixa para vault nodes (OQ-C aberta) — sustento K2 pela inconsistência interna (findings.md tem inverso), não pela letra do MANDATORY.
