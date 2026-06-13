---
tags: [agents, dispatch, review, legibility, executive-layer]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: complete
version: 1.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# attacks.md — returns verbatim do review dispatch 2026-06-12-execgloss-edit-review

Alvo: blockquote "Para quem chega agora" em `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/system-view.md` v1.1.0 (forma pré-revisão).
Eixo anti-bias: fidelidade ao leitor/formato meio-termo vs fidelidade à governança interna.
Montagem determinística pelo parent; conteúdo congelado.

---

## RETURN — Feynman, Richard | explorer | lente: leitor de fora / formato

Avaliação estrutural contra a spec (5 elementos do meio-termo): (1) abertura direta — presente; (2) linha de mapa — presente; (3) bullets tipados — PARCIAL (ver findings); (4) falsificação 1 linha — presente; (5) quem-decide 1 linha — presente; nota de tradução — presente.

- **F-01 — CRITICAL.** Bullets 1–5 e 7 não têm a estrutura *problema→escolha→porquê* — têm *escolha→consequência*. Ex.: bullet 1 "Estruture a casca, nunca o raciocínio — forçar o agente..." abre com a escolha em imperativo; o problema que a motivou (persistência seletiva quebrando a prova) não aparece. Bullet 3 chega perto ("fecha a maior quebra") mas subordina o problema ao porquê. A spec é explícita: "cada um *problema→escolha→porquê*". Fix: cada bullet abre com o problema (gap/quebra observada), não com a escolha em imperativo.
- **F-02 — MAJOR.** Bullet 1 pressupõe que o leitor sabe o que é "raciocinar em JSON" e que isso era alternativa em disputa real; sem isso lê como dogma de estilo. Fix: meia frase de contexto estabelecendo a alternativa antes da assertiva.
- **F-03 — MAJOR.** Bullet 6 (mecanização) não tem problema, nem escolha, nem porquê — é etiqueta de status com enumeração. Fix: "Nenhum mecanismo de validação automática foi decidido [problema] → aberto entre checklist/script/linter [escolha aberta] → dono externo [porquê da delegação]".
- **F-04 — MINOR.** A nota de tradução informal vem DEPOIS dos bullets; leitor rápido lê as tags sem saber que são informais. Fix: mover para logo após a linha de mapa, antes dos bullets.
- **F-05 — MINOR.** "doc de *forma* do contrato" é opaco (jurídico? técnico?). Fix: reformular a linha de mapa.

Dissent: a lente de governança lerá F-01 como MAJOR, não CRITICAL — os bullets entregam informação suficiente para reconstruir o problema pelas âncoras. Minha lente discorda: o leitor que chegou agora ancora na forma superficial dos bullets (imperativos sem problema explícito); a falha de formato é o mecanismo pelo qual o gloss deixa de ser autossuficiente para o seu público exato. Mantenho CRITICAL.

---

## RETURN — Ashby, W. Ross | explorer | lente: governança

- **F1 — MAJOR.** Âncora aponta para a Camada, não para a row dona. O findings do review de legibilidade (leak-mode #2) é literal: "bullet nunca decide — toca decisão ⇒ cita `engineer-view#<id>`". Sete bullets que re-enunciam decisões apontam para "(→ Camada N)" — seção deste próprio doc — reabrindo a indireção que a regra fecha. A menção única ao engineer-view na prosa de fecho não substitui a citação por bullet. Fix: anexar o slug ao lado da Camada — ex. "(→ Camada 2; engineer-view#envelope-sobre-corpo-livre [PROVISIONAL])".
- **F2 — MINOR.** A legenda lista [PENDE EMENDA] isolado, mas os bullets usam o composto [DECIDIDO, PENDE EMENDA]; o mapeamento composto→GO-condicional é inferência não escrita. Fix: legenda mapeia o composto explicitamente.
- **F3 — MINOR.** O bullet "Verificação é economia" funde checklist (GO como emenda candidata), re-ask (GO via arbitragem) sob um [DECIDIDO] só; não sinaliza que o checklist é "emenda candidata, não lei" — leitor pode ler "6 itens DECIDIDO" como já-vigente. Fix: anexar "(checklist = emenda candidata, não lei vigente)".

Defesa do que está correto: a edição cumpre o desenho de legibilidade em 4 de 5 eixos — blockquote (não `##` pré-Objective, REV-2 ✓); 7 bullets ≤8 ✓; nenhum bullet inventa (rascunho↔edge 4 GO-condicional ✓; condensação↔Camada 3 ✓; MORTO↔kill Camada 2/4 ✓); flags marcadas "informal, não definição" ✓. O único leak-mode aberto é o #2 (F1).

Dissent: prevejo que a lente do leitor considere F1 over-engineering (apontar para um doc que não existe). Resposta antecipada: o findings é lei e exige o slug; forma legível e forma governável não conflitam — F1 pede ambos (Camada + slug), não substituir um pelo outro.
