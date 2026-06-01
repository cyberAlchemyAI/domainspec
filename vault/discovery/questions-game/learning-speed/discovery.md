---
tags: [domainspec, knowledge, calibration, questions-game, learning-speed, metrics, derivative-of-productivity]
node_type: discovery
is_session: false
layer: domain, application
nature: explanatory
status: draft
veracidade: low
convicção: low
version: 0.1.0
last_updated: 2026-05-27
created_by: victorboscaro@gmail.com
---

# Learning-Speed Game

> Skeleton discovery. Reserva o caso de uso "medir a **derivada de produtividade**" (∂competence/∂t ou ∂output/∂exposure) — quão rápido uma pessoa converte exposição em competência/produção, **independente** do nível absoluto de talento. Esta discovery declara escopo e abre perguntas; **não** cravam-se hipóteses de design nem medição neste estágio.

---

## Objective

Declarar o escopo da medição de **learning-speed** como caso de uso irmão de `individual-fidelity/` dentro de `questions-game/`. O objeto medido é a **derivada de produtividade** — a taxa de mudança de competência ou output ao longo do tempo ou da exposição (∂competence/∂t), **não** o nível absoluto. Por construção, isso captura ease-of-use, curva de aprendizado e velocidade de adoção sem confundir com baseline de talento: dois jogadores podem ter derivada similar partindo de pontos muito diferentes. Esta discovery é deliberadamente um container — Hypotheses, Working Model e Alternatives ficam para v0.2.0+ depois que escopo, perguntas e cross-refs estabilizarem.

---

## Why this dimension (and not folded into individual-fidelity)

A discovery irmã `../individual-fidelity/discovery.md` reservou explicitamente learning-speed como discovery separada (ver linha 21, "velocidade de aprendizado (discovery irmã)") e linha 267 (`Next Moves`, "não escrever a discovery `abstraction-level/` em paralelo"). A separação é necessária porque fidelidade mede **distância estática** (`d(head, reference)` num instante); learning-speed mede **derivada** (como essa distância se reduz por unidade de exposição). Misturar os dois colapsa um construct em outro e força um único formato de jogo a servir dois objetos de medição.

---

## Prior art (front-loaded; cited, not invented)

| Construct | Fonte | Status vocabular |
|---|---|---|
| **Wright's law** | T.P. Wright, 1936 | `cited-prior-art` |
| **Power law of practice** | Newell & Rosenbloom 1981; Anderson 1982 (ACT-R) | `cited-prior-art` |
| **Bloom's 2-sigma problem** | Benjamin Bloom, 1984 | `cited-prior-art` |
| **Brooks's law** | Fred Brooks, 1975, *The Mythical Man-Month* | `cited-prior-art` |
| **Cognitive load theory** | John Sweller, 1988 | `cited-prior-art` |
| **Derivative of productivity** (∂competence/∂t como o objeto de medição deste caso de uso) | esta discovery | `novel-to-this-discovery` |

---

## Cross-repo connections

- **`/Users/victorboscaro/domainspec-theorem/OPEN-PROBLEM-LOOP-CLOSURE.md`** — Sharpening #1 (linhas 69–94) lista quatro leituras de "loop termination," uma das quais é *diminishing returns (economic): cost exceeds value* (linha 77). Learning-speed é o **handle empírico** dessa leitura: se a derivada de produtividade tende a zero (e o sinal sobrevive aos confundidores listados em OQ-LS-6), isso é candidato operacional a teste de terminação de loop. A conexão é estrutural, não probatória — não fechamos que learning-speed→0 *é* terminação, só que é candidato testável sob essa leitura específica.

- **`/Users/victorboscaro/domainspec-theorem/EPISTEMIC-POSITION.md`** — O *score* de learning-speed (qualquer função numérica que esta discovery eventualmente defina) é **presentation** (criado por esta discovery, sujeito a residue per linha 80). A **trajetória de competência subjacente** que esse score aproxima é candidata a **universal-property structure** (descoberta, presentation-invariante per linhas 39–42). Esta distinção governa o que será defensável como "achado" vs "convenção" no v0.2.0+.

---

## Siblings

- `../individual-fidelity/discovery.md` — discovery irmã ativa; mede distância estática `d(head, reference)`. Estabelece template, frame `C_head`/`C_spec`/`C_system` herdado da pai, e disciplina anti-stale-reference.
- `../abstraction-level/` — discovery irmã planejada (pode ou não existir quando este arquivo for lido; marcar conditional). Relevante via OQ-LS-7 (relação entre velocidade e nível de abstração).
- `../../knowledge-calibration-geometry/discovery.md` — discovery pai; estabelece KCG → questions-game → siblings per-dimensão.

---

## Open Questions

- **OQ-LS-1.** Granularidade temporal: a derivada é medida por-tarefa, por-sessão, por-semana, ou por janela ajustada ao domínio? Granularidades diferentes capturam fenômenos diferentes (ramp-up vs retenção).
- **OQ-LS-2.** Normalização de baseline: como comparar derivadas de jogadores com pontos de partida muito diferentes sem reintroduzir talento absoluto na métrica?
- **OQ-LS-3.** Detecção de platô: como distinguir "teto atingido" (aprendizado completo dentro do escopo) de "stuck" (bloqueio, falta de feedback, cognitive overload)? Os dois zeram a derivada mas exigem ações opostas.
- **OQ-LS-4.** Competência escalar vs vetor: a derivada é sobre um agregado único ou sobre cada uma das 5 componentes herdadas de `individual-fidelity/` H-2 (vocabulário, relações, regras, exceções, aplicação)?
- **OQ-LS-5.** Contaminação user-tool: a derivada medida é do usuário, da ferramenta, ou do composto user-tool? Sem desacoplamento, melhorias da ferramenta inflacionam a métrica do usuário.
- **OQ-LS-6.** Confundidores: motivação, context-switching, hora-do-dia, sono, carga concorrente. Quais são listáveis e quais são intratáveis a este nível?
- **OQ-LS-7.** Relação com nível de abstração: usuários aprendem mais rápido operando em níveis baixos (concreto, exemplo a exemplo) ou altos (regra, princípio)? Depende de quando `../abstraction-level/` for escrita.
- **OQ-LS-8.** Falsificador: que observação faria derivative-of-productivity **não** ser sinal útil de ease-of-use? Candidato pré-registrado: se duas ferramentas com derivadas idênticas produzem percepções de ease-of-use opostas em estudo paralelo, a métrica falha como proxy.

---

## Out-of-scope (residue nomeado)

- **Validação psicométrica** do score de learning-speed (reliability, validade convergente/divergente) — discovery separada, depois de existir um score candidato.
- **Desenho de métrica de produção** (dashboards, agregações organizacionais) — downstream; herda anti-dashboard discipline da pai (KCG H-11).
- **Agregação cross-user** (média de equipe, ranking) — questão de governance/produto, não de medição individual.
- **Intervenções para acelerar learning-speed** (tutoria, scaffolding, spaced repetition aplicada) — domínio de educação/UX; esta discovery só mede.
- **Curvas de esquecimento** (Ebbinghaus 1885 e descendentes) — adjacente mas distinto: esquecimento é derivada negativa sob não-exposição; aqui o foco é derivada positiva sob exposição. Reabrir se OQ-LS-1 escolher granularidade longa o suficiente para esquecimento competir.

---

## Stopping criterion

Esta skeleton está "pronta" quando: (a) escopo está estável o suficiente para não ser confundido com `individual-fidelity/` ou `abstraction-level/`, (b) as OQ-LS-* foram revistas pelo menos uma vez sem nova OQ entrar, (c) os cross-refs cross-repo são confirmados pelos respectivos arquivos. Cravar hipóteses (H-LS-*), Working Model e Alternatives acontece em **v0.2.0+**, condicionado a uma decisão explícita sobre OQ-LS-1 (granularidade) e OQ-LS-4 (escalar vs vetor) — sem essas duas, qualquer hipótese seria sobre objeto não-definido.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../README.md` | `derives-from` | Skeleton é o terceiro caso de uso planejado na pasta-mãe `questions-game/` (depois de `individual-fidelity/` e `abstraction-level/`); herda a separação por caso de uso e o substrate compartilhado declarados ali. |
| `../../knowledge-calibration-geometry/discovery.md` | `cites` | Herda o frame `C_head`/`C_spec`/`C_system` e a anti-dashboard discipline (H-11). O objeto medido aqui — derivada de produtividade — é uma leitura temporal de distância sobre o mesmo frame da pai. |
| `../individual-fidelity/discovery.md` | `cites` | Discovery irmã que reservou explicitamente este caso de uso (linhas 21 e 267). Cinco componentes de H-2 são candidatos a coordenadas do vetor em OQ-LS-4. |
