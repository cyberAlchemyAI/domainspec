---
tags: [domainspec, knowledge, calibration, questions-game, abstraction-level, metrics, reflection-tower]
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

# Abstraction-Level Game (skeleton)

> Skeleton. Define escopo, cross-refs e open questions para medir o **nível de abstração** em que uma pessoa opera e o nível que um tool/spec **exige**. Sem hipóteses cravadas; sem desenho de medição.

---

## Objective

Declarar escopo para uma discovery irmã de `individual-fidelity/` que trata abstração como dimensão própria. Pessoas e tools/specs **ocupam** um nível de abstração e **exigem** outro; a distância entre o nível em que o usuário opera e o nível que o tool exige é sinal candidato de ease-of-use (complementar a `learning-speed/`, que mediria a taxa em que o gap fecha). Skeleton fecha apenas escopo, prior art e open questions.

---

## Why this dimension

Razão estrutural já registrada na irmã: `individual-fidelity/discovery.md` L71-73 nota *"debugging e extension provavelmente pertencem a `abstraction-level/`"*; L233 reforça *"aplicação, debugging e crítica medem capacidades adjacentes a fidelidade mas que se confundem com nível de abstração"*; L267 explicita que esta discovery não deve ser escrita em paralelo — justificando **skeleton**. Misturar fidelidade e abstração cria overlap entre filhos e impede agregação separada.

---

## Prior art

Pressure-testing, não endosso:

- **Brooks (1986), *No Silver Bullet*** — essencial vs acidental; "silver bullets" são mudanças de nível.
- **Norman (1988), *Design of Everyday Things*** — mental models; abstraction mismatch como falha de UX.
- **Chase & Simon (1973), expert chunking** — abstração = o que chunking *habilita*.
- **Sweller (1988), cognitive load theory** — extraneous load surge no desalinhamento de nível.
- **Spolsky (2002), *Law of Leaky Abstractions*** — modo de falha no limite entre níveis.
- **Hofstadter (1979), *GEB*** — strange loops; travessia cross-level pode não ser monotônica.
- **Martin (2008), *Clean Code*** (opcional) — SOLID/DRY como convenções implícitas de nível.

---

## Cross-repo connections

Citações a `/Users/victorboscaro/domainspec-theorem/` — framing, não prova:

- **`OPEN-PROBLEM-LOOP-CLOSURE.md`** — níveis são *camadas* da reflection tower (mapeamento desta discovery; o theorem fala em camadas da tower, não em "nível de abstração"); `Loop : Layer_n → Layer_{n+1}` é o movimento *entre* níveis; V/H/D são candidatos a **famílias de loops** ao longo de dimensões ortogonais. Conditional: depende de `Loop` (open problem).
- **`EPISTEMIC-POSITION.md`** — *rótulos* dos níveis são inventados; *posições estruturais* na tower são descobertas. Governa esta discovery: nomes = novelty; posições = herdadas.
- **`lean-formalization/F11.lean`** — open question: movimento entre níveis é **phase-transitional** (como F11 no threshold de FullyFaithful) ou **gradient**? Listado em OQ-AL-6.
- **`FRAMEWORK-IMPLICATIONS.md` / `NOVEL-MAPPINGS.md`** — referência V/H/D para OQ-AL-2.

---

## Siblings

- `../individual-fidelity/discovery.md` — existe; motivou a separação.
- `../learning-speed/discovery.md` — existe como skeleton paralelo. abstraction-level mede *gap* atual; learning-speed mede *taxa de fechamento*.

---

## Open Questions

- **OQ-AL-1** — Como atribuir *operacionalmente* o nível em que uma pessoa opera? Sem isto, a dimensão é narrativa.
- **OQ-AL-2** — Escalar ou vetor? Uma torre ou múltiplas ortogonais (candidatas: V/H/D)?
- **OQ-AL-3** — Bidirecional: nível do usuário vs nível exigido pelo tool/spec; a *distância* é o sinal candidato — não o nível em si.
- **OQ-AL-4** — Anti-pattern flagging: detectar leaky/premature abstractions sem confundir com baixa fidelidade.
- **OQ-AL-5** — Relação com `learning-speed/`: aprende-se mais rápido subindo ou descendo? Direção assimétrica?
- **OQ-AL-6** — Movimento entre níveis é **phase-transitional** (cross-ref `F11.lean`) ou **gradient**?
- **OQ-AL-7** — Domain-specificity: nível é relativo ao domínio ou composável entre domínios?
- **OQ-AL-8** — **Falsifier**: qual observação tornaria nível de abstração *inútil* como sinal de ease-of-use? Sem isto, a dimensão é não-falsificável e vira discipline.

---

## Out of scope (C7 — named residue)

Pedagogia/curriculum; refactoring guidance; tooling de produção para "abstraction coaching"; resolução de qualquer OQ-AL.

---

## Stopping criterion

Skeleton pronta quando escopo, prior art, open questions e cross-refs estão estáveis. Próxima evolução é `0.2.0` após OQ-AL-1, OQ-AL-2 e OQ-AL-8 terem ao menos recomendações inline.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../individual-fidelity/discovery.md` | `cites` | Irmã que motivou a separação; L71-73, L233, L267 dizem que debugging/extension/aplicação se confundem com nível de abstração e devem migrar para cá. |
| `../../knowledge-calibration-geometry/discovery.md` | `cites` | Pai; herda o frame `C_head`/`C_spec`/`C_system`. Abstraction-level adiciona dimensão ortogonal à fidelidade. |
| `../README.md` | `derives-from` | Segundo caso de uso ativo de `questions-game/`. |
