---
tags: [agents, dispatch, review, legibility, draft]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Draft v1 — synthesizer (Hofstadter) — dispatch 2026-06-12-views-skills-legibility-review

Persistido pelo parent antes do turno do verificador (conteúdo do synthesizer congelado, verbatim).

---

**Arbitragem:** os dois atacantes convergiram. Posição final compartilhada — camada executiva = **executive gloss estruturada (≤8 bullets, NÃO prosa livre)**, cada bullet ancorado (ponteiro obrigatório), zero bullets enunciando verdict, traduções de termo/status marcadas "tradução informal, não definição"; **lei mora uma vez na SKILL** (`<executive-layer-discipline>`), **template só carrega slot + ponteiro**, **gate mecânico no Step 8 / output-contract**. Resíduo de dissent do Feynman: a flag é insuficiente sem **exemplo negativo de glosa** no template.

## Dedupe — findings fundidos

- **CR-1** = F-LEG-10 + F-GOV-7 — sem teste de legibilidade no gate/contrato; cura unificada: gate mecânico.
- **CR-2** = F-LEG-6 + F-GOV-2 — doc gerado abre com governança/jargão, sem porta de entrada.
- **CR-3** = F-LEG-1 + F-LEG-3 + F-GOV-1 + F-GOV-3 + F-GOV-4 — propósito escrito para a máquina; promessa de legibilidade sem âncora; desenho do bullet ancorado.
- **CR-7** = F-LEG-8 + F-GOV-5 — status nunca traduzido para consequência; tradução = glosa marcada "informal".
- **CR-8** = F-LEG-7 + F-LEG-11 + F-GOV-5 — rótulos/placeholders do template sem glosa nem porquê.

## Por artefato

### A. discovery-writing.md — FIX
- CR-4 | l.8 "captures the problem space… for an agent to write an implementation plan." Nenhuma instrução de seção executiva. (F-LEG-1) | CRITICAL | Seção `## TL;DR` obrigatória após `## Objective`: ≤5 linhas, decisão como problema→escolha→porquê, termos glosados na 1ª ocorrência.
- CR-5 | §Downstream l.94-106 "reconcile-not-regenerate…" / "derive-only; sole mutation trigger" — zero motivação em linguagem comum. (F-LEG-2 + F-GOV-8) | MAJOR | (a) parágrafo motivador ≤3 frases no topo do §Downstream; (b) nota: "a executive gloss de cada view reformula a Business Context da discovery; discovery ilegível é gap upstream, não licença para a view inventar."

### B. system-view/SKILL.md — FIX
- CR-1 | output-contract l.250-251 sem linha para camada executiva; Step 8 l.131 só no-verdict/no-redefinition/handle. (F-LEG-10 + F-GOV-7) | CRITICAL | Teste de leitor externo no Step 8 (responde o-que-faz / maior-decisão-aberta / o-que-funciona-hoje) + 3 linhas no output-contract: `Executive-layer bullets: <count> (uncited: MUST be 0) | bullets stating a verdict: MUST be 0 | term/status glosses flagged: <count>`.
- CR-3 | `<objective>` l.46 sem o porquê; applicability l.63 "non-engineer can read to judge soundness" sem gate; cross-ref l.173 "Stating a verdict here is a violation". (F-LEG-1/3 + F-GOV-1/3/4) | CRITICAL | 2ª frase do objective em linguagem comum + seção única `<executive-layer-discipline>` (reformula shape/stakes, nunca decide; cita row dona; bullet sem ponteiro reprova).
- CR-6 | applicability l.63 "single-instance-validated: GoldenQuill / Tilth… only on-disk instance". (F-LEG-5) | MAJOR | Seção `## Maturidade / Limitações conhecidas` em prosa direta.
- CR-9 | Step 6 l.125 SPELLING NOTE de enum no meio do passo. (F-LEG-4) | MINOR | Mover para nota/`<engineering-notes>`.

### C. system-view-template.md — FIX
- CR-2 | introbox l.26-56, 7 blocos de governança abrem o doc gerado. (F-LEG-6 + F-GOV-2) | CRITICAL | Slot `## Para quem chega agora` antes do `## Objective` (≤8 bullets ancorados, teste de leitor, exemplo negativo); introbox de provenance reduzido a 1 ponteiro.
- CR-8 | l.150/158 rótulos GIVEN sem glosa; l.225 placeholder de tensão sem porquê. (F-LEG-7 + F-LEG-11 + F-GOV-5) | MINOR | Glosas de 1 frase + placeholder "<X versus Y — e por que importa para [o problema central]>".

### D. engineer-view/SKILL.md — FIX
- CR-7 | status legend l.185-188 nunca traduzido; cross-ref l.178-179 "redefines NO term… cites an AUTHORITY". (F-LEG-8 + F-GOV-5) | MAJOR | Slot `## O que os status significam para você` (1 frase de consequência por status, marcada "tradução informal, não definição").

### E. engineer-view-template.md — KEEP
- CR-10 | §4 l.157 placeholder pressupõe "thesis". (F-LEG-9) | MINOR | Explicitar "a promessa central do projeto — [uma frase]" + exemplo negativo de glosa (resíduo de dissent do Feynman).

> F-GOV-6 absorvido como princípio transversal: lei adicionada em UMA seção da SKILL, template só slot + ponteiro.

## Ordem por severidade
CRITICAL: CR-1, CR-2, CR-3, CR-4. MAJOR: CR-5, CR-6, CR-7. MINOR: CR-8, CR-9, CR-10.

## Desenho consolidado da camada executiva
- Forma: gloss estruturada ≤8 bullets (não prosa livre), linguagem comum, problema→escolha→porquê.
- Três modos de vazamento fechados: (1) bullet sem ponteiro reprova (claim>prova); (2) bullet nunca decide — toca decisão = cita `engineer-view#<id>` (2ª superfície); (3) tradução marcada "informal, não definição" (redefinição fora do dono).
- Lei na SKILL (`<executive-layer-discipline>`); template só slot + ponteiro + teste de leitor.
- Gate: teste de leitor externo + bullets uncited = 0 + bullets com verdict = 0 + glosas flagged.
- Dissent sobrevivente (Feynman): flag sem exemplo negativo é insuficiente — resolve com fixture no template (CR-10), não com mais norma.
