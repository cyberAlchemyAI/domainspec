---
tags: [subagents-strategy, findings, enforcement, anti-bias, tier2, meta-dispatch]
node_type: findings
is_session: false
layer: architecture
nature: [explanatory, procedural]
status: active
version: 0.1.0
last_updated: 2026-06-15
dispatch_status: backfilled-no-prompt-recoverable
---

# findings.md — Tier 2 enforcement (design corrigido pós-revisão)

Dispatch `2026-06-15-tier2-enforcement-design`. Síntese de [research.md](research.md), **corrigida pelos dois reviewers** (Quine non-vacuity; Popper definitional-soundness) e aceita pelo final_approver (parent). exit_reason: `resolved`.

> **O resultado mais importante deste dispatch é negativo, e é o dogfooding funcionando:** o design ingênuo do sintetizador (campo `tension_verdict` carimbado + rótulo "desacordo genuíno") teria embarcado **falsa garantia**. Os reviewers, em desacordo *genuíno e realizado* contra o sintetizador (Quine: `Dissent: contra Mac-Lane#design`; Popper idem), o derrubaram. O mecanismo pegou o próprio defeito que ele existe para pegar.

## As duas correções que mudam tudo

1. **Não existe "garantir desacordo genuíno" mecanicamente.** Nenhum checker decide *contradição-de-mérito* — isso é juízo semântico. O que é mecanizável é **conformidade de referência cruzada** (um agente citou o claim-ID de um irmão e declarou negá-lo). Logo: **renomear** o conceito de `genuine disagreement` → **`cross_reference_realized`**. A garantia é de *forma falsificável*, não de *substância*. (Popper §1; Quine causa-raiz.)
2. **Campo auto-declarado na close row é pior que campo nenhum.** Um `tension_verdict: VALID` digitável (P8: o estrategista pode escrever sem rodar nada) importa confiança não-ganha e não é falsificável no ponto de leitura. **Simon vence a disputa.** O campo só se justifica se seu conteúdo for um **ponteiro/hash para o output do checker** anexado no working_folder — aí forjar custa ≈ rodar honestamente. Sem isso, **disciplina pura (sem campo) vence**, e o bump de schema 0.5.3 **não se paga**. (Popper §2–4.)

## O design final (corrigido)

### (1) Contrato de retorno — APROVADO (mudança pequena, alto valor)
- Reusar claim-ID `<label>#<n>` da discovery (não redesenhar).
- Gramática única nova: `Dissent: contra <sibling-claim-ID> — <negação não-vazia, referencial ao claim citado>` ou `Dissent: none — <razão>`.
- **Aperto de Quine/Popper:** a negação deve ser **não-vazia e referencial** (proxy mecânico barato: compartilhar ≥1 token de conteúdo com o claim citado), senão `thin-dissent` → não conta como realizada. Axis-token sozinho **não** alcança REALIZED.
- Inserts: research/review (tighten a linha existente); **experiment (ADICIONAR a linha — não existe hoje)**.

### (2) O checker — APROVADO como `cross_reference_realized`, não "tension realization"
- Script Node `check-tension-realization.cjs` (renomear conceito, manter forma).
- **Correção de Quine (causa-raiz):** iterar sobre a **pré-registração como índice de obrigação**, não sobre contagens de grupo. Núcleo:
  - **D′ (substitui D):** para cada par pré-registrado em `<working_folder>/anti-bias-preregistration.md`, exigir ≥1 cross-dissent conformante entre *esse par específico*; zero → `NO-CONFORMING-DISSENT` → INVALID, **independente de N** (fecha o buraco N=2 e o displaced-dissent).
  - **B (claim-ID membership):** duro, mecânico.
  - **C (axis-tag):** soft/aditivo — notice, nunca gate sozinho.
  - Contagem de grupo N≥3 vira check *separado* (unanimidade inesperada), distinto de D′.
- Veredito honesto: `CROSS-REF-REALIZED` / `NO-CONFORMING-DISSENT` / `GROUP-UNANIMITY-FLAG`; o script **não** afirma "desacordo genuíno", só conformidade. Spot-check humano para substância (sempre).

### (3) Superfície de enforcement — close-gate, SEM campo carimbado
- Close-gate é o único choke point (Simon, confirmado: appender só vê o record; sem evento de fim-de-dispatch no harness).
- **NÃO** adicionar `tension_verdict` como literal → **NÃO** bumpar wire `schema_version`.
- Em vez disso: o SKILL manda **rodar o checker e anexar seu output** (`<working_folder>/anti-bias-check-<hash>.md`) antes do close. Disciplina + artefato auditável por um signal-observer depois. Se mais tarde se quiser o campo na close row, ele carrega o **ponteiro para o artefato**, não o veredito — e só então o schema bump se paga.

## Plano de build (corrigido — menor, sem schema bump)

| # | Arquivo | Mudança |
|---|---------|---------|
| 1 | `.claude/skills/research/SKILL.md` (+ bundle) | tighten §Outputs: gramática `Dissent: contra <ID>`/`none`, negação não-vazia referencial |
| 2 | `.claude/skills/review/SKILL.md` (+ bundle) | idem na finding discipline + §Outputs (claim-ID por finding) |
| 3 | `.claude/skills/experiment/SKILL.md` (+ bundle) | **ADICIONAR** a linha Dissent (§Roles/Validity + §Outputs) — não existe |
| 4 | `skills/register-dispatch/check-tension-realization.cjs` | **NOVO** script: índice = pré-registração; B duro + D′ + C soft; veredito de conformidade; exit code |
| 5 | `skills/domainspec-subagents-strategy/SKILL.md` | close-gate: congelar `anti-bias-preregistration.md` no dispatch; rodar o checker e anexar output antes do close |
| 6 | `validator-check.md` (vault) | alinhar Item 9 ao conceito renomeado `cross_reference_realized` + ao índice-por-par |

**NÃO no plano (cortado pelos reviewers):** o campo `tension_verdict` na close row e o bump `schema_version` 0.5.2→0.5.3. Nenhuma das 8 superfícies do §10 é tocada — não há promoção atômica aqui. (Se um dia o campo-ponteiro for desejado, aí sim é um row-schema change e dispara o §10.)

## Tensões residuais (registradas)
- **D4 (`<label>` uniqueness):** o ponteiro `contra <ID>` resolve a "exatamente 1 irmão" só se labels forem únicos por dispatch — OPEN; o guard nasce PLANNED. Aceito como dependência declarada (Spivak), não bloqueia o build (single-round colisão é rara e o checker emite `dangling-cite` warning).
- **Teto semântico permanente:** mesmo D′ + checker rodado prova *referência*, nunca *mérito*. Spot-check humano amostral é parte do design, não um TODO a fechar.

## Verdict
`cross_reference_realized` é o máximo executável; "genuine disagreement" é juízo humano amostrado. Build aprovado para os 6 itens acima — **sem** campo carimbado e **sem** schema bump.
