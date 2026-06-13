---
tags: [agents, dispatch, review, legibility, skills, findings]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: complete
version: 2.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Findings — review dispatch `2026-06-12-views-skills-legibility-review`

**Dispatch:** `2026-06-12-views-skills-legibility-review` (ledger: `telemetry/agents/subagents-dispatch.yaml`; returns: `attacks.md` neste folder; drafts/reviews: `.work/`).
**Goal:** change requests verificados para que as skills discovery-writing, system-view e engineer-view obriguem uma camada executiva em linguagem comum — o que ficou definido e por quê — legível por praticante de agentes que nunca leu o vocabulário interno.
**Produzido por:** synthesizer (Hofstadter), turno 2 do zig-zag, incorporando os vereditos e objeções REV-1..4 do verificador (Popper) registrados em `.work/review-v1.md`.

## Arbitragem

Os dois atacantes convergiram (Feynman/operabilidade + Ashby/fidelidade; posições iniciais e finais em `attacks.md`). Posição final compartilhada e ratificada pelo verificador: a camada executiva é uma **executive gloss estruturada (≤8 bullets, NÃO prosa livre)**, linguagem comum, forma *problema→escolha→porquê*; cada bullet **ancorado** (ponteiro obrigatório); **zero bullets enunciando verdict**; toda tradução de termo/status marcada **"tradução informal, não definição"**. A **lei mora uma vez na SKILL** (`<executive-layer-discipline>`); o **template carrega só slot + ponteiro + teste de leitor**; o **gate é mecânico** no Step 8 / output-contract.

**Arbitragem de severidade (REV-1):** Popper rebaixou os quatro CRITICAL do draft-v1 para MAJOR — CRITICAL exige contradição com lei governante OU doc inutilizável, e CR-1/2/3/4 são fixes *aditivos de legibilidade* sobre docs plenamente usáveis. **Não sobra nenhum CRITICAL nesta rodada.**

## Dedupe — findings fundidos

- **CR-1** = F-LEG-10 + F-GOV-7 — sem teste de legibilidade no gate/contrato; cura unificada: gate mecânico.
- **CR-2** = F-LEG-6 + F-GOV-2 — doc gerado abre com governança/jargão, sem porta de entrada.
- **CR-3** = F-LEG-1 + F-LEG-3 + F-GOV-1 + F-GOV-3 + F-GOV-4 — propósito escrito para a máquina; promessa de legibilidade sem âncora; desenho do bullet ancorado.
- **CR-7** = F-LEG-8 + F-GOV-5 — status nunca traduzido para consequência; tradução = glosa marcada "informal".
- **CR-8** = F-LEG-7 + F-LEG-11 + F-GOV-5 — rótulos/placeholders do template sem glosa nem porquê.
- F-GOV-6 absorvido como princípio transversal (não vira CR isolado): lei em UMA seção da SKILL, template só slot + ponteiro.

## Por artefato

### A. `.claude/skills/custom/discovery-writing.md` — **FIX**

| # | evidência | severidade | fix |
|---|---|---|---|
| CR-4 | l.8 "captures the problem space… enough detail for an agent to write an implementation plan"; nenhuma seção executiva na skill (F-LEG-1) | **MAJOR** (era CRITICAL — REV-1) | TL;DR obrigatório (≤5 linhas, *problema→escolha→porquê*, termos glosados na 1ª ocorrência) como **sub-bloco dentro do `## Objective`** (REV-4, abaixo). |
| CR-5 | §Downstream l.94-106 "reconcile-not-regenerate…" / "derive-only; sole mutation trigger" sem motivação em linguagem comum (F-LEG-2 + F-GOV-8) | MAJOR (UPHELD) | (a) parágrafo motivador ≤3 frases no topo do §Downstream; (b) nota: "a executive gloss de cada view reformula a Business Context da discovery; discovery ilegível é gap upstream, não licença para a view inventar." |

**Correção de CR-4 (REV-4).** O `## TL;DR` como seção `##` colide com a estrutura ordenada não-reordenável (l.30 "must appear in this order. Do not skip or reorder"). **Forma escolhida: sub-bloco dentro do `## Objective`** (um `### TL;DR` aninhado ou blockquote no fim do Objective). *Justificativa:* um sub-bloco não introduz seção `##` nova na sequência fixa, respeitando a ordem herdada sem emendar a lei governante da discovery por uma feature de legibilidade.

### B. `.claude/skills/system-view/SKILL.md` — **FIX**

| # | evidência | severidade | fix |
|---|---|---|---|
| CR-1 | output-contract l.250-251 sem linha p/ camada executiva; Step 8 l.131 só no-verdict/no-redefinition/handle (F-LEG-10 + F-GOV-7) | **MAJOR** (era CRITICAL — REV-1) | Teste de leitor externo no Step 8 (responde o-que-faz / maior-decisão-aberta / o-que-funciona-hoje) + 3 linhas no output-contract: `Executive-layer bullets: <count> (uncited: MUST be 0) \| bullets stating a verdict: MUST be 0 \| term/status glosses flagged: <count>`. |
| CR-3 | `<objective>` l.46 sem o porquê; applicability l.63 "non-engineer can read to judge soundness" sem gate; cross-ref l.173 "Stating a verdict here is a violation" (F-LEG-1/3 + F-GOV-1/3/4) | **MAJOR** (era CRITICAL — REV-1) | 2ª frase do objective em linguagem comum + seção única `<executive-layer-discipline>` (reformula shape/stakes, nunca decide; cita row dona; bullet sem ponteiro reprova). |
| CR-6 | applicability l.63 "single-instance-validated: GoldenQuill / Tilth… only on-disk instance" (F-LEG-5) | MAJOR (UPHELD) | Seção `## Maturidade / Limitações conhecidas` em prosa direta com consequência prática. |
| CR-9 | Step 6 l.125 SPELLING NOTE de enum no meio do passo (F-LEG-4) | MINOR (UPHELD) | Mover para nota/`<engineering-notes>`. |

### C. `.claude/skills/system-view/templates/system-view-template.md` — **FIX**

| # | evidência | severidade | fix |
|---|---|---|---|
| CR-2 | introbox l.26-56, 7 blocos de governança abrem o doc gerado; testemunha abre sem orientação humana (F-LEG-6 + F-GOV-2) | **MAJOR** (era CRITICAL — REV-1) | Porta de entrada como **blockquote** no topo, par-irmão do introbox de provenance (REV-2/REV-3, abaixo). |
| CR-8 | l.150/158 rótulos GIVEN sem glosa; l.225 placeholder de tensão sem porquê (F-LEG-7 + F-LEG-11 + F-GOV-5) | MINOR (UPHELD) | Glosas de 1 frase + placeholder `<X versus Y — e por que importa para [o problema central]>`. |

**Correção de CR-2 — forma (REV-2).** Seção `##` antes do `## Objective` viola o objective-first gate herdado (SKILL l.50; template l.62-64) — inconstruível como no draft-v1. **Forma escolhida: blockquote de orientação no topo**, o mesmo gênero do introbox atual (que não é seção `##` e já vive pré-Objective sem quebrar o gate). *Justificativa:* o blockquote ocupa o slot pré-Objective que o introbox de provenance já ocupa legitimamente, entrando como par-irmão sem disparar o gate.

**Correção de CR-2 — provenance (REV-3).** O draft-v1 dizia "introbox reduzido a 1 ponteiro" — colapsaria a nota derive-only / reconcile-not-regenerate / drift-baseline (l.49-56), **load-bearing** por `<provenance-and-mutation>`. **Corrigido:** a nota de provenance/mutação fica **intacta**; encurta-se apenas a redundância de governança que já mora na SKILL. O blockquote de orientação é **adicionado ao lado**, não em substituição.

### D. `.claude/skills/engineer-view/SKILL.md` — **FIX**

| # | evidência | severidade | fix |
|---|---|---|---|
| CR-7 | status legend l.185-188 nunca traduzido p/ consequência; cross-ref l.178-179 "redefines NO term… cites an AUTHORITY" (F-LEG-8 + F-GOV-5) | MAJOR (UPHELD) | Slot `## O que os status significam para você` no template (1 frase de consequência por status, marcada "tradução informal, não definição"). Verificado: gloss de consequência marcada "informal" não redefine termo da ontology → sem conflito de invariante. |

### E. `.claude/skills/engineer-view/templates/engineer-view-template.md` — **KEEP** (toque mínimo)

| # | evidência | severidade | fix |
|---|---|---|---|
| CR-10 | §4 l.154-157 placeholder pressupõe "thesis" (F-LEG-9) | MINOR (UPHELD/KEEP) | Explicitar "a promessa central do projeto — [uma frase]" **+ exemplo negativo de glosa** (fixture: o que NÃO é glosa válida) — resíduo de dissent do Feynman. |

> Defesa explícita do `engineer-view-template`: é o artefato mais bem-gated do corpus; a camada executiva o toca só por reflexo via F-GOV-3/-4/-6. Veredito KEEP confirmado pelo verificador.

## Veredito KEEP/FIX por artefato

- **A. discovery-writing.md** — **FIX** (CR-4, CR-5)
- **B. system-view/SKILL.md** — **FIX** (CR-1, CR-3, CR-6, CR-9)
- **C. system-view-template.md** — **FIX** (CR-2, CR-8)
- **D. engineer-view/SKILL.md** — **FIX** (CR-7)
- **E. engineer-view-template.md** — **KEEP** (CR-10, toque mínimo)

## Change requests por severidade

**CRITICAL:** _nenhum_ — os quatro CRITICAL do draft-v1 foram rebaixados a MAJOR (REV-1).

**MAJOR:** CR-1, CR-2, CR-3, CR-4, CR-5, CR-6, CR-7.

**MINOR:** CR-8, CR-9, CR-10.

## Desenho consolidado da camada executiva

- **Forma do conteúdo:** gloss estruturada ≤8 bullets (não prosa livre), linguagem comum, *problema→escolha→porquê*.
- **Forma de inserção:** no template system-view, **blockquote** de orientação no topo, par-irmão do introbox de provenance, nunca seção `##` pré-Objective (REV-2); provenance load-bearing intacta (REV-3). Na discovery, TL;DR como **sub-bloco do `## Objective`** (REV-4).
- **Três modos de vazamento fechados pela âncora:** (1) bullet sem ponteiro reprova (claim>prova, F-GOV-4); (2) bullet nunca decide — toca decisão ⇒ cita `engineer-view#<id>` (2ª superfície, F-GOV-3); (3) tradução marcada "informal, não definição" (redefinição fora do dono, F-GOV-5).
- **Onde a lei mora:** seção única `<executive-layer-discipline>` na SKILL; template só slot + ponteiro + teste de leitor (F-GOV-6).
- **Gate (Step 8 / output-contract):** teste de leitor externo + bullets uncited = 0 + bullets com verdict = 0 + glosas flagged.

## Registro de dissent

- **Dissent sobrevivente (Feynman):** a flag "tradução informal, não definição" é necessária mas **insuficiente** sem **exemplo negativo de glosa** no template. Resolve-se com fixture/exemplo (CR-10), não com mais norma. Permanece aberto como item de implementação, não objeção contra o desenho.
- **Dissent de Popper — absorvido:** "o zig-zag NÃO termina" do turno 1 apontava REV-1..4; os quatro pontos foram incorporados neste v2 (severidades rebaixadas; CR-2 re-redigido como blockquote com provenance preservada; CR-4 como sub-bloco do Objective).

## Close (preenchido pelo final_approver no encerramento)

- exit_reason: `resolved`
- agents_spawned: total 8 invocações / 4 agentes lógicos — investigate 4 (2 ataques + 2 turnos robot-talks), synthesize 2 turnos (1 agente lógico), evaluate 2 turnos (1 agente lógico); helpers 0; loops_used 2 (zig-zag).
- Deviations declaradas: (1) rodada robot-talks executada como turnos de confronto em instâncias novas carregando os returns verbatim — SendMessage indisponível no ambiente; posições iniciais E finais preservadas em `attacks.md` (exigência P14 satisfeita em substância). (2) O confirm de entrada (P2) foi a ordem explícita do owner na mensagem que originou o dispatch ("Você deve invocar subagentes para propor melhorias nas skills discovery, system-view e engineer-view"), anterior à folha — registrado como base do gate.
