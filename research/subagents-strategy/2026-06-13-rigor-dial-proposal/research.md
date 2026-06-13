---
tags: [subagents-strategy, dispatch, rigor, governance, research]
node_type: research
is_session: false
layer: meta
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-06-13
created_by: victorboscaro@gmail.com
---

# research.md — Retornos coletados (verbatim)

> **Dispatch:** `2026-06-13-rigor-dial-proposal` (research, adversarial-audit).
> **Goal:** decidir se "rigor/exigência do usuário" deve ser input heurístico no confirm gate
> (sem campo), campo de schema novo, ou se "rigor" é o primitivo errado.
> Este arquivo guarda os retornos **verbatim** dos agentes (P9). A síntese citada está em
> `findings.md`. Candidatos: **C1** heurística sem campo · **C2** campo escalar único ·
> **C3** dois dials breadth+depth · **C4** nada novo (dispatch_kind basta).

## Grupo `explorers` — round 1 (posições iniciais paralelas)

### Wittgenstein, Ludwig (explorer · parsimônia) — INICIAL

Tese: um campo `rigor` é supérfluo porque seu efeito é inteiramente expressável pela combinação já existente de `dispatch_kind`, `n`, `token_budget` e `model`, e adiciona indirection semântica sem adicionar poder expressivo.

Argumentos:
- **A — Expressividade já coberta.** `dispatch_kind` já escala fan-out (single-lookup → adversarial-audit). Um `rigor: high` reduz-se a uma tradução `rigor → (dispatch_kind, n, token_budget)` dentro do confirm gate; não representa nada que o sistema não saiba resolver com o que tem. Indirection sem expressividade é arquitetura de ilusão.
- **B — Viola "um cenário, um dial; menor escopo vence".** `rigor` como campo afetaria `n` (grupo) E `token_budget` (agente) simultaneamente — tenta ser três escopos num dial só, o anti-padrão que a regra proíbe.
- **C — Heurística é epistemicamente mais honesta.** A inteligência de "quanto rigor aqui" deve viver no raciocínio do strategist sobre o caso específico, não num mapeamento estático calibrado pro caso médio, errado nos extremos e resistente a update sem versionar schema.
- **D — Custo de schema.** LEDGER-MODEL.md já separa plano de design do de custo; `rigor` cria terceira camada sintética que precisa ser reconciliada ao ler registro histórico ("rigor:high significava n=4 naquela versão?"). Os campos existentes são observáveis diretos.

Evidência: `adversarial-audit` já implica multiplicidade + budget elevado por escolha de preset; não há reclamação registrada de gap intermediário; §5 pin-any-dial cobre o fino. O espaço entre grosso (presets) e fino (pin-any-dial) é onde vive a heurística do strategist, não um gap.

Contra mais forte reconhecido: o argumento cibernético tem substância — o usuário não sabe quais dials girar; sabe que quer "mais rigor". Se a UX do confirm gate for opaca, um campo `rigor` seria proxy utilizável mesmo que redundante — adiciona **acessibilidade cognitiva**, não poder expressivo. Resposta: a solução é especificar melhor o gate, não adicionar campo.

Dissent: discordará do cibernético (knob único assume qualidade unidimensional e mapeamento rigor→dials estável, que não é); com o de decomposição o dissent é menor — concorda que largura/profundidade são ortogonais, mas `n` já é largura e `token_budget` já é profundidade, então a decomposição já está feita no schema.

### Ashby, W. Ross (explorer · requisite variety) — INICIAL

Tese: um parâmetro de rigor de primeira classe é necessário porque o operador governa por intenção, não por coordenadas — e sem variedade adequada no painel, o dispatch não absorve a variedade real do espaço de tarefas (Ashby 1956).

Argumentos:
- **A — Lei da variedade requisitada.** O regulador precisa de tanta variedade quanto a perturbação. Pedir ao operador traduzir "rápido e barato" em {n=2, token=4k, kind=flat-fanout} transfere o mapeamento para o humano, que não tem feedback loop calibrado → disparidade sistemática intenção↔execução.
- **B — Heurística efêmera = auditoria zero.** A decisão evapora: não fica no ledger, não é reproduzível, não pode ser auditada como causa de resultado. Campo `rigor` persistido fecha o loop (correlacionar rigor=exhaustive com custo e qualidade, afinar default).
- **C — dispatch_kind escala fan-out, não profundidade por agente.** Rigor verdadeiro é função de ambos; um escalar de primeira classe permite mapeamento auditável/versionável {rigor}→{n, token_budget, model_tier}.
- **D — Default-ability é o mecanismo real de economia.** `rigor=low` default para tasks `lookup` → operador nem menciona custo. Com heurística o default é implícito/invisível → operador não confia → sobrescreve → economia se perde.

Evidência: a própria sessão no ledger registra `n=4` sem registrar *por quê*; `rigor=medium` tornaria reproduzível.

Contra mais forte: rigor escalar **colapsa contexto que só o operador tem** ("exaustivo" jurídico ≠ "exaustivo" criativo); só absorve variedade se o mapeamento interno for calibrado — calibração ruim inverte o benefício (variedade aparente, não real).

Dissent: vs parsimônia — `n`/`token_budget` não são intuitivos pro operador médio (coordenadas de um espaço que ele não habita); parsimônia de campos ≠ parsimônia cognitiva. vs decomposição — concorda que são ortogonais mas a decomposição interna é responsabilidade do sistema; forçar dois eixos restaura o problema de tradução.

### Ellerman, David (explorer · decomposição) — INICIAL

Tese: "rigor" é erro de categoria — escalar único que funde dois eixos ortogonais (largura=n, profundidade=token_budget/model); fundi-los, campo ou heurística, destrói informação de design sem ganho real.

Argumentos:
- **1 — Ortogonalidade estrutural.** Largura = diversidade epistêmica; profundidade = resolução analítica. Ortogonais como "nº de amostras" vs "precisão por amostra". §5 promete dial granular; "rigor" colapsa dois dials em um → operador perde controle prometido.
- **2 — A correlação quebra nas bordas.** Proxy escalar é bom no centro da distribuição; as tarefas que justificam fan-out vivem nas bordas, onde a correlação quebra. Otimiza para o caso que menos precisa.
- **3 — O confirm gate herda o erro.** Se a heurística do gate usa escalar de rigor para derivar n e token, o erro de categoria migrou pra dentro do gate — escondido, não eliminado.
- **4 — LEDGER-MODEL já separa os eixos.** n = decisão de design; token_budget = decisão de custo/profundidade. "rigor" viola a invariante já estabelecida.

Testemunhas:
- **T1 — Auditoria jurídica de contrato único.** Cláusula de 40pp + jurisprudência: correto n=1 (uma perspectiva coerente), token altíssimo. "rigor=alto" daria n=3 → contradições internas, perda de raciocínio holístico.
- **T2 — Triagem de 200 CVs** com 5 critérios objetivos: correto n=20, token baixo por CV. "rigor=baixo" daria n=2 → gargalo de throughput; o problema é de largura, não profundidade.

Contra mais forte: 70-80% das tarefas largura e profundidade correlacionam positivamente; nesse regime um proxy único produz config razoável sem o operador pensar em dois eixos. A carga cognitiva de dois dials pode superar o ganho pro usuário mediano.

Dissent: vs parsimônia — concorda em não adicionar campo, mas parcimônia ignora o problema; se o gate usa rigor implícito, precisa ser auditável/overrideable, o que exige expor os dois eixos. vs cibernético — o gap de controle é real, mas a solução é vocabulário de dois eixos nomeados, não escalar único que torna os extremos incontroláveis.

## Grupo `explorers` — robot_talks (posições finais após confrontação)

### Wittgenstein — FINAL · **Movi: SIM**

Cede a Ashby no ponto da auditoria-zero **sem ressalva**: honesto ≠ reproduzível; heurística sem registro no ledger é amnésia, não parsimônia. Cede a Ellerman no erro de categoria parcialmente: a testemunha jurídica (n=1, token altíssimo) é prova irrefutável de que "rigor=alto → n=3" quebra a tarefa; o erro migra para o gate, fatal para "heurística no gate é suficiente" se o gate usar escalar. Mantém vs Ashby: campo persistido sem mapeamento calibrado é custo sem benefício (campo que o sistema não mapeia com fidelidade dá ilusão de precisão). Mantém vs Ellerman: `n` já é breadth, `token_budget`+`model` já é depth — nomear meta-dials por cima adiciona indireção.

Veredito final: **C3, mas implementado como exposição dos parâmetros reais, não dois meta-dials opacos.** O confirm gate expõe `n` (breadth) e `token_budget`/`model` (depth) diretamente; o ledger registra os valores confirmados (satisfaz Ashby); nenhum campo de schema novo. Não é C2 (erro migra), não é C1 puro (auditoria zero), não é C4 (gap de reprodutibilidade é real).

### Ashby — FINAL · **Movi: SIM**

Cede a Ellerman **completamente**: "rigor" escalar é erro de categoria; a intenção tem dimensionalidade dois, não um; escalar é perda de informação estrutural. Cede a Wittgenstein parcialmente: mapeamento estático no schema erra nos extremos e é resistente a update — cede na forma (campo escalar estático), não na substância (persistência do derivado). **Reformulação:** a tese de auditabilidade sobrevive se o que é persistido são os valores derivados (n, token_budget, model), não o escalar "rigor" — o escalar é artefato de elicitação, não primitivo armazenado.

Mantém: o gap de controle por-intenção é real; "especificar melhor o gate" sem persistência morre na sessão; economia vem de defaults persistidos (breadth/depth default por workspace/perfil), não de campo escalar.

Veredito final: **C3 com camada de persistência híbrida**, dois planos: (i) **elicitação** (confirm gate traduz intenção → breadth/depth — heurística atualizável, fora do schema); (ii) **persistência** (ledger registra valores derivados n/token/model, não a intenção verbal); (iii) **default** (workspace/user config pode persistir breadth_default/depth_default). No schema: nenhum campo "rigor"; dois campos **opcionais** (breadth, depth) que, se omitidos, o gate deriva e o ledger registra o derivado.

### Ellerman — FINAL · **Movi: SIM**

Cede a Wittgenstein no diagnóstico estrutural: `n` já é largura, `token_budget`/`model` já é profundidade — adicionar `breadth`/`depth` seria glossário redundante. Seu argumento real não precisava de campos novos; precisava de uma **restrição** sobre a heurística do gate: não colapsar `n` e `token_budget` num escalar downstream.

Mantém: o erro de categoria nos extremos é real; auditabilidade de um campo escalar é **falsa** porque o campo auditável (`rigor`) não é o que governa o comportamento (`n` e `token_budget` governam); um escalar serializa uma função de splitting que o operador não vê nem controla.

Veredito final: **C1 com restrição hard** — heurística no confirm gate, sem campo novo, MAS a heurística **nunca expõe nem persiste um escalar agregado de rigor**; produz diretamente `{n, token_budget, model}`. Lógica de correlação interna pode ser default (usa a correlação dos 70-80%), mas o output são sempre os eixos separados; override é em `n` ou `token_budget` direto, nunca num `rigor` a ser traduzido.

## Síntese de convergência (para o synthesizer)

Os três moveram. Acordo: **(a)** rejeitar C2 (campo escalar de rigor = erro de categoria que migra para onde for posto); **(b)** rejeitar C4 (há um gap real — de reprodutibilidade/auditoria, não de expressividade); **(c)** `n` e `token_budget`/`model` JÁ SÃO os eixos largura/profundidade — nenhum campo novo necessário para representá-los; **(d)** o output da heurística devem ser os eixos separados, nunca um escalar.

Costura residual (não colapsou): **Ashby** quer uma camada de persistência/defaults (campos opcionais breadth/depth + defaults por workspace) para fechar o loop de auditoria e economia; **Wittgenstein/Ellerman** sustentam que persistir o `n`/`token_budget` que o ledger já registra é suficiente, e que campos opcionais novos reintroduzem o custo de schema. → Questão para os reviewers: a auditabilidade/economia que Ashby exige já é servida pelo ledger atual (que registra n e token_budget por agente), ou exige superfície nova?
