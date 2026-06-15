---
tags: [subagents-strategy, dispatch-hooks, review, change-requests, governance, audit]
node_type: audit
is_session: false
layer: architecture
nature: [explanatory, procedural]
status: active
version: 0.1.0
last_updated: 2026-06-15
created_by: victorboscaro@gmail.com
---

# O que precisa ser alterado no `subagents-dispatch-hooks` — e por quê

**Origem:** red-team review (`dispatch_type: review`, `meta: true`) — dispatch `2026-06-15-dispatch-hooks-docs-review`, registrado em `telemetry/agents/subagents-dispatch.yaml`.
**Como foi produzido:** 4 atacantes independentes (fidelity/governance · mechanics/correctness · reference-integrity · operability) → sintetizador → 2 verificadores adversariais (lei × empírico) → coverage auditor. Provas completas e verbatim em [`../../../research/subagents-strategy/2026-06-15-dispatch-hooks-docs-review/findings.md`](../../../research/subagents-strategy/2026-06-15-dispatch-hooks-docs-review/findings.md) e `attacks.md` ao lado.
**Veredito do corpus:** **FIX** — há 1 CRITICAL bloqueante. Aprovado pelo final_approver (Loregian) **com ressalvas**.

> ⚠️ Este documento **não altera** nenhum arquivo do bundle — ele só descreve as mudanças. Cada item cita `arquivo:linha` para quem for aplicar.

---

## A causa-raiz (conserte isto primeiro — é a alavanca)

A política de emenda da constituição — **"editar in-place, sem version bump"** (§9/§5) — é o motor de quase todo o drift abaixo. A promoção de `experiment` para LIVE (2026-06-14) tocou o enum no código e nas SKILLs, mas **não** tocou o teste, o field header da §5, nem a docstring do appender. Resultado: cada referência a "v0.5.2" aponta para um alvo silenciosamente emendado 4×, e a `version` deixou de identificar o artefato.

**Mudança de keystone (M1):** exigir um **version bump** em qualquer alteração de campo/enum/princípio, e tratar promoção de `dispatch_type` como um checklist atômico (código + SKILL + constituição-§5-field + teste + README, juntos). Sem isso, a classe M1/M2/M6/m1/m3/m7 reincide.

---

## 🔴 CRITICAL — bloqueante

### C1 — A promoção de `experiment` está incompleta; a bateria de testes está vermelha
Confirmado rodando `node internal_tools/subagents-dispatch-hooks/tests/test-append-dispatch.cjs` → **`78 passed, 1 failed, exit 1`** (caso `10i`). Convergência de 4 lentes (Ashby#13, Turing#1+#2, Simon#7).

`experiment` é LIVE no corpo da lei (`constitution/…proposal.md:48-50,173`) e no código (`append-dispatch.cjs:99,152` `LIVE_TYPES`), mas três superfícies ficaram para trás:
1. **`tests/test-append-dispatch.cjs:266-267`** — o caso `10i` ainda afirma que experiment é "reserved (FORECAST)" e appenda com `exit 0`; o appender hoje exige `working_folder` e dá `exit 2`. **→ Reescrever 10i:** experiment é LIVE → exige `working_folder` (exit 2), sem nota FORECAST.
2. **`constitution/…proposal.md:231`** — `working_folder` "required when `dispatch_type` is `research` or `review`" (omite experiment). **→ Trocar para "research, review, or experiment".**
3. **`skills/register-dispatch/append-dispatch.cjs:21`** — docstring de header lista só "research/review" como REQUIRED. **→ Incluir experiment** (o código já está certo; é só o comentário). *(= M6)*

**Por que bloqueia:** o folder se anuncia como "canonical migration source" e o README:60 afirma uma suíte verde que não existe — qualquer migração ou CI herda a falha. Os três precisam fechar **juntos**, senão re-falha.

---

## 🟠 MAJOR

### C2 — README e install.cjs se contradizem sobre os paths na migração
`install.cjs:147-149` ("correct at the install target") vs `README.md:72` ("must be rebased, not yet self-referential"). São **escopos diferentes** — install fala deste repo (cópia verbatim, correta); README fala de migração cross-repo (Arcanum, precisa rebase) — mas nenhum doc diz isso. **→ Tornar o escopo explícito nos dois pontos:** "correto no install deste repo; cross-repo exige rebase".

### C3 — `install.cjs` instala no lugar errado em silêncio
`install.cjs:59` usa `CLAUDE_PROJECT_DIR || process.cwd()`. Rodar de dentro do bundle instala em `internal_tools/.../.claude/skills/` sem erro. Está documentado em `README.md:71`, mas **não** no header do install nem nas instruções de run. **→ Adicionar ao README (passo de install) e ao header do install.cjs:** "rode do repo-root, ou `export CLAUDE_PROJECT_DIR=<repo-root>` antes; o cwd é o alvo de instalação."

### M1 — Versão do README desacoplada da lei
`README.md:8` `version: 0.6.0` enquanto a lei é `v0.5.2`. **→ Ver keystone acima.**

### M10 — Fallback de `CLAUDE_PROJECT_DIR` ambíguo
`skills/register-dispatch/SKILL.md:121-124` empacota 3 condições (cwd vs `project_dir` vs path relativo) numa frase. **→ Substituir por 2 receitas explícitas:** (A) `CLAUDE_PROJECT_DIR` setado → qualquer cwd; (B) unset → adicionar `"project_dir"` ao JSON, cwd irrelevante.

### M11 — Drift path e migração admitidos, sem mecânica
`README.md:71-72` nomeia "the one drift path left" (editar `.claude/skills` direto → clobber) e a migração Arcanum, mas não há guardrail nem procedimento. **→** Adicionar `install.cjs --check` (diff instalado vs bundle) + um header "GENERATED — edite o bundle" nas skills sincronizadas, e uma tabela/`migrate` enumerando os cross-references a rebasear.

---

## 🟡 MINOR (corrigir junto, baixo risco)

| ID | Alvo | Mudança |
|----|------|---------|
| M2 | `README.md:29,59` | "P1–P12" → **P1–P14** (a lei tem P13 lineage + P14 robot-talks). |
| M3 | `skills/experiment/SKILL.md:80` | "review = UPHELD/REFUTED/DOWNGRADED" → **review = KEEP/FIX** (vocabulário real do review). |
| M5 | `skills/register-dispatch/SKILL.md:50` | "records anyway" é **by-design** (o appender é recorder, não gate); adicionar 1 linha apontando que o gate (router:39/§5) é quem recusa. |
| M8 | citações da constituição | Declarar em 1 linha qual cópia é canônica (repo-root = lei viva; `constitution/` = migration snapshot) e **diffar** as duas para confirmar que não divergiram. |
| M9 | `skills/register-dispatch/SKILL.md:111-113` | Dar uma forma PowerShell ao lado do bloco `sh`, ou marcar "Bash tool only; estas são POSIX vars". |
| M12 | `skills/register-dispatch/SKILL.md:102,110` | Declarar que `node append-dispatch.cjs` é **allowlisted** pelo enforce hook (o hook só bloqueia edit/read diretos do yaml). |
| m1 | `README.md:33` | Mencionar que `loops_used` é **required** em `agents_spawned`. |
| m2 | `docs/LEDGER-MODEL.md:97` | `agent_id` → **`agent_name`** (agent_id foi removido em §7). |
| m3 | `docs/LEDGER-MODEL.md:61` | Incluir `schema_version` na árvore da row (campo required). |
| m5 | `skills/review/SKILL.md:113`, `experiment/SKILL.md:114-120` | A two-file rule é "research fan-out" no texto §5/P9; atualizar o texto da §5/§9 para refletir que review/experiment também a usam (prática já viva). |
| m6 | todos | Padronizar **"reserved" (não "FORECAST")** — ou definir um termo e usar só ele. |

---

## O que foi atacado e **sobreviveu** (não mexer — são pontos fortes)

- **Normalização L1/L2/L3:** `docs/LEDGER-MODEL.md:104` é honesto ("design, not yet what the appender writes"); o appender escreve denormalizado como o doc afirma. Sem mismatch.
- **`token_budget` sem enforcement:** a constituição (§5:387-396) **declara explicitamente** "no runtime enforcement, OPEN QUESTION"; o código só valida presença. Claim e código batem — não há garantia prometida e quebrada.
- **Append-only / self-check / grandfathering / idempotência:** existem de fato no código e passam nos testes (exceto o 10i de C1).
- **Hooks fail-open:** `enforce-append-only` e `remind` são fail-open; `block-workflow` é deny determinístico — exatamente como o README descreve.

---

## Achados refutados na verificação (registrados para não voltarem)

- **"v0.3.0 ainda governa"** (M4) — refutado: router e LEDGER-MODEL concordam que **v0.5.2 governa**; foi má-leitura.
- **"ontology-view/engineer-view/system-view não existem"** (M7) — refutado: os *skills* existem; estão fora do `CHAIN_SKILLS` do bundle por design. **Resíduo legítimo → backlog:** o *doc* `ontology-view` da discovery `agents-input-output` não foi autorado (OQ-SV-2), fora do escopo destes 9 docs.
- **"attack lenses violam o axis test"** (m4) — refutado: o axis test governa só o `anti_bias` per-group; as lenses são categorias em prosa.

---

## Ordem de execução sugerida

1. **C1** (atômico: teste + §5:231 + cjs:21) — desbloqueia a suíte verde.
2. **M1 keystone** (política de version bump + checklist de promoção) — para o drift não reincidir.
3. **C2, C3, M10, M11** (operabilidade/migração) — antes de qualquer port para Arcanum.
4. Lote MINOR num só commit de limpeza.
5. **Backlog separado:** OQ-SV-2 (autorar o ontology-view da discovery).
