---
tags: [agents, dispatch, research, diagrams, mermaid, system-view]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Draft v1 — diagramas progressivos (Penrose) — dispatch 2026-06-12-systemview-progressive-diagrams

Persistido pelo parent antes da revisão; conteúdo do writer congelado (verbatim).

---

## D0

ÂNCORA: inserir logo APÓS o blockquote "Para quem chega agora" (antes de `## Objective`).

```mermaid
flowchart LR
  exp["explorers"] --> rmd["research.md"]
  rmd --> syn["synthesizer"]
  syn <--> rev["reviewers"]
  syn --> fnd["findings"]
  fnd --> apr["final_approver"]

  subgraph promessa ["promessa (P9): cadeia claim -> prova"]
    claim["claim load-bearing"] --> cit["citacao"]
    cit --> ret["return persistido"]
  end

  fnd -."toda claim load-bearing cita o return" .-> claim
```

Legenda (D0): A altitude máxima — o pipeline de roles e a promessa de lei vigente de que toda claim do findings se ancora num return durável.

---

## D1

ÂNCORA: inserir ao final da Camada 1, APÓS o parágrafo de diagnóstico (antes de `### Alternative framings we considered (Camada 1)`).

```mermaid
flowchart LR
  exp["explorers"] --> rmd["research.md"]
  rmd --> syn["synthesizer"]
  syn <--> rev["reviewers"]
  syn --> fnd["findings"]
  fnd --> apr["final_approver"]

  subgraph promessa ["cadeia: veredito -> claim -> citacao -> return persistido"]
    vd["veredito"] --> claim["claim load-bearing"]
    claim --> cit["citacao"]
    cit --> ret["return persistido"]
  end

  fnd -.-> vd

  b1["quebra 1: sintese nunca aterrissou (draft F1-F21 nao persistido) -- maior quebra"]:::brk
  b2["quebra 2: dissenso evaporou 7/7 (linha Dissent: ausente)"]:::brk
  b3["quebra 3: citacoes morrendo em transcript de sessao"]:::brk
  b4["quebra 4: verbatim degradando (condensacao sem invariantes)"]:::brk

  b1 -. "rompe aqui" .-> syn
  b2 -. "rompe aqui" .-> rmd
  b3 -. "rompe aqui" .-> cit
  b4 -. "rompe aqui" .-> ret

  classDef brk fill:#fff3cd,stroke:#b8860b,color:#663c00;
```

Legenda (D1): O mesmo pipeline com as quatro quebras documentadas anotadas sobre os pontos exatos da cadeia onde ela rompia sem contrato.

---

## D2

ÂNCORA: inserir ao final da Camada 2, APÓS "O que esse shape compra, em uma linha por edge..." (antes de `### Alternative framings we considered (Camada 2)`).

```mermaid
flowchart LR
  subgraph territorio ["divisao de territorio em tres tipos"]
    env["envelope (casca estruturada fora do corpo)"]
    corpo["corpo livre (raciocinio em prosa, nunca schematizado)"]
    linha["linha estruturada de corpo (token iff checagem nomeada le)"]
  end

  exp["explorers"] -- "edge 1: briefing (prosa, congelado)" --> e1((parent))
  e1 --> exp
  exp -- "edge 2: persiste return integral, append-only, claim-IDs + ancora + Dissent:" --> rmd["research.md"]
  rmd -- "edge 3: referencia leve ao arquivo, nunca transcript" --> syn["synthesizer"]
  syn <-- "edge 4: draft F* persistido antes da revisao <-> veredito por ID alheio" --> rev["reviewers"]
  syn -- "edge 5: novo round = nova secao append-only (condicional)" --> exp
  syn --> fnd["findings"]
  fnd --> apr["final_approver"]

  subgraph promessa ["cadeia: veredito -> claim -> citacao -> return persistido"]
    vd["veredito"] --> claim["claim load-bearing"]
    claim --> cit["citacao"]
    cit --> ret["return persistido"]
  end
  fnd -.-> vd

  env -.-> rmd
  corpo -.-> rmd
  linha -.-> rmd
```

Legenda (D2): O shape da solução — envelope sobre corpo livre mais a linha estruturada de corpo, percorrido pelos cinco edges que fecham cada quebra da Camada 1.

---

## D3

ÂNCORA: inserir ao final da Camada 3, APÓS "O desenho da economia, em uma frase..." (antes de `### Alternative framings we considered (Camada 3)`).

```mermaid
flowchart LR
  subgraph territorio ["envelope / corpo livre / linha estruturada"]
    env["envelope"]
    corpo["corpo livre"]
    linha["linha estruturada de corpo"]
  end

  exp["explorers"] -- "edge 1: briefing congelado" --> e1((parent))
  e1 --> exp
  exp -- "edge 2: persiste return" --> rmd["research.md"]
  rmd -- "edge 3" --> syn["synthesizer"]
  syn <-- "edge 4" --> rev["reviewers"]
  syn -- "edge 5 (condicional)" --> exp
  syn --> fnd["findings"]
  fnd --> apr["final_approver"]

  subgraph promessa ["veredito -> claim -> citacao -> return persistido"]
    vd["veredito"] --> claim["claim"]
    claim --> cit["citacao"]
    cit --> ret["return persistido"]
  end
  fnd -.-> vd

  subgraph economia ["economia de verificacao: estrutura barata na borda, prova congelada no meio, juizo caro no fim"]
    reask["na coleta: re-ask capeado (max 1 por agente, helper P11; 2a falha -> P4)"]
    cond["em transito: condensacao so pelo emissor, carimbada, lista fixa de invariantes"]
    chk["no close: checklist do approver (6 itens, recebe working folder completo P12)"]
    mech["na maquina: validacao confinada a row do ledger (nenhum enforcement de corpo)"]
  end

  reask -. "verifica envelope na coleta" .-> e1
  cond -. "verifica em transito" .-> rmd
  chk -. "fecha a cadeia claim->prova no close" .-> claim
  mech -. "valida so a dispatch row" .-> rmd

  classDef econ fill:#e6f2ff,stroke:#3366cc,color:#003366;
  class reask,cond,chk,mech econ;
```

Legenda (D3): A economia de verificação sobreposta ao fluxo — quem checa o quê e quando.

---

## D4

ÂNCORA: inserir ao final da Camada 4, APÓS "O stake desta camada para um stakeholder..." (antes de `### Alternative framings we considered (Camada 4)`).

```mermaid
flowchart TB
  subgraph pipeline ["pipeline + cadeia + economia (camadas D0-D3, agrupadas)"]
    flow["explorers -> research.md -> synthesizer <-> reviewers -> findings -> final_approver"]
    economia["economia: re-ask | condensacao carimbada | checklist do approver | validacao na row"]
  end

  subgraph regime ["regime de mudanca (vocabulario de verdict)"]
    lei["LEI (dado, fixo-e-obedecido): Dissent: persistida, pares P14, verbatim -- referencia, nunca re-adota"]:::lei
    go["GO (otimizado, decidido): 10 aquisicoes da matriz + re-ask capeado"]:::go
    gocond["GO-condicional (com condicao declarada): draft F* citavel | condensacao carimbada | metade taxonomia tiers"]:::gocond
    open["OPEN (acumulando): mecanizacao da validacao | tiers de verificacao | custo dos claim-IDs"]:::open
    kill["KILL (negativa bancada): schema do corpo epistemico | round obrigatorio"]:::kill
  end

  go -. "status sobre" .-> economia
  gocond -. "deviation declarada ate a emenda" .-> economia
  lei -. "verifica, nao re-adota" .-> flow
  open -. "default operacional; nunca decidido por osmose" .-> economia
  kill -. "nao re-levantar" .-> flow

  classDef lei fill:#e8e8e8,stroke:#555,color:#222;
  classDef go fill:#d4edda,stroke:#2e7d32,color:#14401c;
  classDef gocond fill:#fff3cd,stroke:#b8860b,color:#663c00;
  classDef open fill:#e6f2ff,stroke:#3366cc,color:#003366;
  classDef kill fill:#f8d7da,stroke:#c0392b,color:#5a1a1a;
```

Legenda (D4): O regime de mudança como camadas de status sobre os elementos já desenhados (nenhum verdict de stance individual é desenhado; só os regimes nomeados).

---

Notas de conformidade do writer: monotonicidade preservada (D2→D4 agrupa em subgraph; salto gradual ~9 → +4 → +3 → +4 → +5); nenhum verdict desenhado; só termos do doc; sintaxe conservadora (IDs ASCII, labels com acento entre aspas, flowchart LR/TB).
