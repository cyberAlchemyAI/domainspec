---
tags: [subagents-strategy, review, red-team, dispatch-hooks, governance, attacks]
node_type: research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-06-15
created_by: victorboscaro@gmail.com
---

# attacks.md — retornos verbatim do red-team

Dispatch `2026-06-15-dispatch-hooks-docs-review` (`dispatch_type: review`, `meta: true`).
Corpus: os 9 docs de governança do `internal_tools/subagents-dispatch-hooks/`.
Pipeline: 4 atacantes (paralelo, read-only) → sintetizador → 2 verificadores (zig-zag) → coverage auditor.
Este arquivo coleta os retornos **verbatim**; a síntese citada vive em [findings.md](findings.md).

---

## Atacante 1 — Ashby, W. Ross — lente FIDELITY / GOVERNANCE

| # | arquivo:linha | citação | sev | correção |
|---|---|---|---|---|
| 1 | README.md:8/29/59 | version 0.6.0 vs lei v0.5.2 | MAJOR | alinhar esquema de versão |
| 2 | README.md:29,59 | "principles P1–P12" mas a lei tem 14 (P13, P14) | MAJOR | corrigir para P1–P14 |
| 3 | README.md:33 | close row omite que `loops_used` é REQUIRED | MINOR | mencionar loops_used |
| 5 | LEDGER-MODEL.md:19,137,141 | "v0.3.0 não governa" vs router:6 "v0.5.2 wins" | MAJOR | uma regra de conflito só |
| 6 | LEDGER-MODEL.md:97 | usa `agent_id` (removido §7 → agent_name) como chave L3 | MINOR | trocar p/ agent_name |
| 7 | LEDGER-MODEL.md:61 | árvore omite `schema_version` (REQUIRED) | MINOR | incluir schema_version |
| 8 | review/SKILL.md:80 | "UPHELD/REFUTED/DOWNGRADED" vs corpo KEEP/FIX | MAJOR | uma vocabulário só |
| 9 | experiment/SKILL.md:80 | afirma "review = UPHELD/REFUTED/DOWNGRADED" | MAJOR | review = KEEP/FIX |
| 13 | register SKILL:59 ↔ append-dispatch.cjs:21 | header omite experiment de working_folder-required | MAJOR | sincronizar |
| 14 | register SKILL:50 | reserved "records anyway" vs lei "must not be dispatched" vs router "refuse" | MAJOR | alinhar 3 camadas |
| 17 | constituição | "FORECAST" vs "reserved/RESERVED" intercambiáveis | MINOR | um termo só |

**Root cause apontado:** as emendas §9/§5 "in-place, no version bump" são a fonte do drift; todo "v0.5.2" cita um alvo emendado-in-place 4×.

**Dissent:** #14 pode ser feature (appender é recorder, não gate); #10/#12 podem ser generalizações sancionadas (P14:138) com texto §5 stale.

---

## Atacante 2 — Turing, Alan — lente MECHANICS / CORRECTNESS (rodou os testes: 78 passed, 1 FAILED)

| # | arquivo:linha | evidência | sev | correção |
|---|---|---|---|---|
| 1 | tests/test-append-dispatch.cjs:266-267 (10i) | experiment é LIVE (cjs:99) mas o teste o trata como reserved (exit 0); rodando dá exit 2. **BATERIA VERMELHA.** | CRITICAL | reescrever 10i: experiment LIVE exige working_folder |
| 2 | constituição:231 | "working_folder required when research or review" — omite experiment, embora §5:175 e código:152 o exijam | MAJOR | "research, review, or experiment" |
| 3 | README.md:45 | nunca menciona experiment LIVE; stale pós-2026-06-14 | MINOR | citar experiment LIVE |

**Sobreviveram (sem achado):** normalização L1/L2/L3 (LEDGER:104 é honesto "design, not yet what appender writes"); `token_budget` (§5:387-396 declara explicitamente "no runtime enforcement, OPEN QUESTION" — código só valida presença; claim e código batem); self-check/grandfathering/idempotência existem no código; hooks fail-open documentados; exit codes batem.

**Dissent:** não rebaixar #1 — a bateria É a garantia executável; com ela vermelha, README:60 afirma uma suíte verde inexistente e o folder é "canonical migration source". A promoção do experiment foi parcial (tocou o enum LIVE no código/SKILL mas não o teste nem a tabela de campo da constituição).

---

## Atacante 3 — Spivak, David — lente OWNERSHIP / REFERENCE INTEGRITY

| # | arquivo:linha | ponteiro | sev | correção |
|---|---|---|---|---|
| 1 | README.md:72 vs install.cjs:147-149 | "must be rebased" vs "correct at install target" | CRITICAL | reconciliar |
| 2 | system-view/engineer-view | apontam ontology-view (não existe no disco) como dono de termos | MAJOR | marcar PLANNED |
| 3 | engineer-view.md | cita engineer-view/SKILL.md (não está no bundle) como autoridade da legenda | MAJOR | inline ou pin |
| 6 | citações da constituição | dupla-localização repo-root + constitution/ sem regra de qual vence | MAJOR | declarar canônico |
| 7 | router:43,45,48 | aponta type skills p/ .claude/skills (cópia gerada), dangling em clone fresco | MINOR | nota |
| 4,5,8 | vários | paths sem prefixo / não verificados; enum 4vs5 (OQ-EV-4) | MINOR | — |

**Sobreviveram:** todos os ponteiros de DEPLOYMENT resolvem neste repo; nav links do README OK; o `../../../` do LEDGER resolve.

**Dissent:** #6 pode ser MINOR by-design (split repo-root=deployment / constitution/=migration source intencional) mas nenhum doc diz qual vence; conteúdo não foi diffado (drift latente, não atual).

---

## Atacante 4 — Simon, Herbert — lente OPERABILITY

| # | arquivo:linha | gap | sev | correção |
|---|---|---|---|---|
| 1 | install.cjs:59 / README:71 | target = CLAUDE_PROJECT_DIR \|\| cwd; rodar de dentro do bundle instala no lugar errado, silencioso | CRITICAL | dizer "rode do repo-root / exporte CLAUDE_PROJECT_DIR" |
| 2 | SKILL.md:111-113 | bloco `sh` hard-coda $HOME/$CLAUDE_PROJECT_DIR; shell do projeto é PowerShell | MAJOR | dar forma PowerShell |
| 3 | SKILL.md:121-124 | fallback = 3 condições acopladas numa frase, ambíguo | MAJOR | 2 receitas explícitas |
| 4 | README:71-72 | admite "one drift path left" mas zero guardrail/detecção | MAJOR | install --check + banner |
| 5 | README:72 | migração Arcanum "must be rebased" sem procedimento/lista/tool | MAJOR | migrate.cjs / path-map |
| 7 | constituição §5:231 vs appender:152 | working_folder omite experiment | MAJOR | (= C1) |
| 8 | SKILL.md:102,110 | "hook bloqueia Bash" + "prefira Bash tool" sem dizer que o appender é allowlisted | MAJOR | declarar allowlist |
| 6,9,10 | install/README | global+repo split não declarado; skip-on-missing silencioso; testes não posicionados como smoke-check | MINOR | — |

**Sobreviveram:** idempotência two-append executável; grandfathering/self-check documentado; example record copy-pasteable válido.

**Dissent:** pode supervalorizar #2/#8 (operador in-harness tem Bash + env vars auto). #1 CRITICAL assume que ninguém lê install.cjs:59; se "header comment conta como doc", cai p/ MAJOR.

---

## Verificador A — Quine, W.V.O. — terreno DEFINICIONAL / LEI

Vereditos principais: **C1 DOWNGRADE→MAJOR** (re-terrenado: §5:173 já diz experiment LIVE; só o aside §5:231 é stale), **C2 UPHELD (CRITICAL)**, **C3 DOWNGRADE→MAJOR** (header documenta), **M1 UPHELD**, **M2 DOWNGRADE→MINOR**, **M3 UPHELD** (experiment misatribui review), **M4 DROP** (equivocação), **M5 DOWNGRADE→MINOR** (appender é recorder, T2 confirmado), **M6 DOWNGRADE→MINOR**, **M7 UPHELD** (defere a Spivak), **M8 DOWNGRADE→MINOR** (T4 precedência declarada), **M9 DOWNGRADE→MINOR** (T5), **M10 UPHELD**, **M11 UPHELD**, **M12 DOWNGRADE→MINOR**.

Adjudicações: T1 → MAJOR (header+README documentam o target); T2 → appender é recorder não gate (header:30-37 "NOT ENFORCED here"); T3 → P14:138 só generalizou o hop de collapse-detection, não as lenses/two-file (texto §5/§9 stale); T4 → precedência declarada (repo-root=lei, constitution/=migration source), pendente diff; T5 → oversold p/ operador in-harness.

**Dissent:** (1) numa leitura estrita, C1 fica CRITICAL porque a §5 lista experiment num lugar e omite no aside duas cláusulas abaixo — falha o próprio teste "dois estrategistas preenchem igual" (§1:34). (2) o defeito genuinamente CRITICAL (test 10i red) foi mal-rotulado por Shannon como C1; deveria ser CR próprio.

---

## Verificador B — Popper, Karl — terreno EMPÍRICO / REPRODUÇÃO

| ID | veredito | evidência reproduzida |
|---|---|---|
| C1 | **UPHELD (CRITICAL)** | Rodou `node tests/test-append-dispatch.cjs` → **78 passed, 1 failed, exit 1**; falha 10i; appender:99 LIVE_TYPES inclui experiment; :152 exige working_folder; constituição:48-50 diz experiment LIVE mas :231 omite |
| C2 | DOWNGRADE→MAJOR | install targeta *este* repo verbatim; README:72 caveat é *cross-repo* — escopos diferentes, gap de clareza |
| C3 | DOWNGRADE→MAJOR | install.cjs:59 não tem header; mas README:71 documenta o target — não é silencioso |
| M1 | UPHELD (MAJOR) | README:8 version 0.6.0 vs body "v0.5.2" |
| M2 | UPHELD (MAJOR) | README:29/59 "P1–P12"; constituição tem P13 (:137,:608) e P14 (:267) |
| M3 | **REFUTED→DROP** (review self-contra) / mas confirma experiment misatribui | review:80 é o diagrama da forma canônica, não verdict; review = KEEP/FIX (:60,:118); UPHELD/REFUTED/DOWNGRADED só em experiment:80 |
| M6 | DOWNGRADE→minor | append-dispatch.cjs:21 docstring omite experiment; código (:152) correto |
| M7 | **REFUTED→DROP** | Glob: ontology/engineer/system-view SKILL.md existem em .claude/skills; fora do CHAIN_SKILLS por design |
| m2 | UPHELD (minor) | LEDGER:97 usa agent_id; §7:533 "agent_id → replaced by agent_name" |

**Dissent:** C1 é o único CRITICAL genuíno, e sua forma real difere da paráfrase do sintetizador — o corpo da lei (:48-50) já promoveu experiment; o defeito é **incoerência interna pós-promoção** (test red + §5:231 field header + cjs:21 docstring stale). M3 e M7 dropei como citações que não reproduzem (review:80 é diagrama; os view-skills existem). Não re-verifiquei M4/M5/M8-M12/m1/m3-m9 — fora do set empírico prioritário; tratar como UNVERIFIED, não endossado.

---

## Coverage auditor — Loregian, Fosco — final_approver (P12)

Matriz lente×doc: sem gap material (os únicos buracos — robot-talks-constitution × operability, LEDGER/router × operability — são docs sem superfície operável). Drops disciplinados (M4, M7-as-filed, m4 descartados, não suavizados). Todo sobrevivente citado. Nenhum atacante retornou zero (sem red flag); Turing e Simon convergiram independentemente em C1 = assinatura de ataque genuíno.

**VEREDITO: ACEITO-COM-RESSALVAS** — verdict FIX, C1 bloqueante (a promoção LIVE do experiment precisa fechar §5:231 + cjs:21 + test 10i juntos). Ressalva não-bloqueante: OQ-SV-2 (doc ontology-view não autorado) fica como backlog fora-de-escopo, sem 2ª rodada.
