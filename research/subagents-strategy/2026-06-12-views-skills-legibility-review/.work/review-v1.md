---
tags: [agents, dispatch, review, legibility, verification]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: complete
version: 1.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Review v1 — verificador (Popper) sobre draft-v1 — dispatch 2026-06-12-views-skills-legibility-review

Persistido pelo parent, conteúdo do verificador congelado (verbatim nos vereditos e objeções).

## Veredito por CR

- **CR-1** — DOWNGRADED→MAJOR — citações l.250-251/l.131 conferem, mas é gate aditivo de legibilidade; SKILL plenamente usável, não contradiz lei governante → não é CRITICAL.
- **CR-2** — DOWNGRADED→MAJOR — introbox l.26-56 confere, mas o fix tem dois defeitos: (a) `## Para quem chega agora` ANTES de `## Objective` viola o objective-first gate herdado (SKILL l.50, template l.62-64); (b) reduzir provenance a "1 ponteiro" arrisca dropar a nota derive-only load-bearing (l.49-56). Template usável → não CRITICAL.
- **CR-3** — DOWNGRADED→MAJOR — l.46/l.63/l.173 conferem; fix consistente com no-verdict. Mas SKILL usável e não contradiz lei → não CRITICAL.
- **CR-4** — DOWNGRADED→MAJOR — l.8 confere literalmente. PORÉM `## TL;DR` após `## Objective` colide com a estrutura ordenada obrigatória (l.30 "must appear in this order. Do not skip or reorder"; Objective→Business Context). discovery-writing.md é usável → não CRITICAL.
- **CR-5** — UPHELD — l.94-106 conferem; MAJOR correto, sem conflito de invariante.
- **CR-6** — UPHELD — l.63 confere; MAJOR correto.
- **CR-7** — UPHELD — legend l.185-188 + cross-ref l.178-179 conferem; gloss de consequência marcada "informal" não é redefinição de termo da ontology → sem conflito; MAJOR correto.
- **CR-8** — UPHELD — l.150/158 + l.225 conferem; MINOR correto.
- **CR-9** — UPHELD — Step 6 l.125 confere; MINOR correto.
- **CR-10** — UPHELD — §4 l.154-157 confere; MINOR/KEEP correto.

## Objeções (o synthesizer corrige no draft v2)

1. **Inflação sistemática de severidade nos quatro CRITICAL.** CRITICAL exige contradição com lei governante OU doc inutilizável; CR-1/2/3/4 são fixes aditivos de legibilidade sobre docs usáveis. Rebaixar para MAJOR e reclassificar a lista por severidade.
2. **CR-2 — conflito de invariante não resolvido.** O slot `## Para quem chega agora` antes do `## Objective` quebra o objective-first gate herdado (SKILL l.50; template l.62-64). O fix deve OU posicionar a porta de entrada como blockquote (como o introbox atual, que não é seção `##`) OU colocá-la depois do Objective. Como redigido, o fix é inconstruível sem violar a skill-alvo.
3. **CR-2 — "introbox reduzido a 1 ponteiro" colide com provenance load-bearing.** As linhas l.49-56 (derive-only / reconcile-not-regenerate / drift baseline) são load-bearing por `<provenance-and-mutation>`; o fix deve preservar a nota de mutação, não colapsá-la num link.
4. **CR-4 — `## TL;DR` colide com a estrutura ordenada obrigatória da discovery** (l.30, ordem fixa não-reordenável). Precisa ser sancionado como exceção explícita à ordem, ou re-redigido como sub-bloco do Objective.

Dissent: O zig-zag NÃO termina — quatro CRITICAL rebaixados e dois conflitos de invariante (CR-2 ordem de seções; CR-2/CR-4 provenance e ordem-fixa) exigem nova rodada do synthesizer.
