---
tags: [subagents-strategy, review, red-team, dispatch-hooks, governance, change-requests]
node_type: audit
is_session: false
layer: architecture
nature: [explanatory, reference]
status: active
version: 0.1.0
last_updated: 2026-06-15
created_by: victorboscaro@gmail.com
---

# findings.md — change requests verificadas

Dispatch `2026-06-15-dispatch-hooks-docs-review` (`dispatch_type: review`, `meta: true`).
Síntese citada e adjudicada dos retornos em [attacks.md](attacks.md).
Verdict do corpus: **FIX** (≥ 1 CRITICAL sobrevivente). final_approver: Loregian — **ACEITO-COM-RESSALVAS**.

Cada achado foi: levantado por ≥ 1 atacante → consolidado por Shannon → refutado/confirmado por Quine (lei) + Popper (empírico) → o CRITICAL e o ponto contestado re-verificados no disco pelo estrategista (P8).

## Surviving change requests (severity-ordered)

| ID | Alvo | Defeito | Por quê | Origem (lentes) | Sev final |
|----|------|---------|---------|-----------------|-----------|
| **C1** | `tests/test-append-dispatch.cjs:266-267` + `constitution …proposal.md:231` + `append-dispatch.cjs:21` | Promoção de `experiment` para LIVE ficou **parcial**: o corpo da lei (§5:173) e o código (`LIVE_TYPES`:99/152) tratam experiment como LIVE, mas (a) o teste 10i ainda o trata como reserved → **bateria vermelha** (`78 passed, 1 failed, exit 1`, reproduzido), (b) o field header §5:231 diz "research or review", (c) a docstring do appender:21 omite experiment. | A test battery é a garantia executável e o folder é "canonical migration source" — propaga uma suíte vermelha. A lei contradiz o código que governa. | Ashby#13, Turing#1+#2, Simon#7 (**4-lente**) | **CRITICAL** (bloqueante) |
| **C2** | `README.md:72` ↔ `install.cjs:147-149` | Veredito oposto sobre os paths copiados: install diz "correct at install target"; README diz "must be rebased". | São escopos diferentes (install = este repo verbatim; README = migração cross-repo) mas nenhum doc diz isso — leitor escolhe um e desfaz o outro. | Spivak#1 | MAJOR (de CRITICAL) |
| **C3** | `internal_tools/.../install.cjs:59` | `target = CLAUDE_PROJECT_DIR \|\| process.cwd()`; rodar de dentro do bundle instala em `internal_tools/.../.claude/skills/` silenciosamente. | Foot-gun de install com falha silenciosa. Documentado em README:71, **não** no header do install. | Simon#1 | MAJOR (de CRITICAL) |
| **M1** | `README.md:8` + política de emenda | Front-matter `version: 0.6.0` desacoplado da lei `v0.5.2`; emendas §9/§5 "in-place, no version bump" tornam todo "v0.5.2" um alvo emendado 4×. | **Causa-raiz** da classe M2/M6/m1/m3/m7: a versão deixou de identificar o artefato. | Ashby#1+#4 | MAJOR |
| **M10** | `register-dispatch/SKILL.md:121-124` | Fallback de `CLAUDE_PROJECT_DIR` unset = 3 condições acopladas numa frase (cwd vs project_dir vs path relativo). | Operador não consegue resolver deterministicamente o fallback. | Simon#3 (Quine UPHELD) | MAJOR |
| **M11** | `README.md:71-72` | Nomeia "the one drift path left" (editar `.claude/skills` direto → clobber) e a migração Arcanum, mas ship zero guardrail (`--check`/banner/checksum) e zero procedimento de rebase. | A admissão não é uma defesa; "canonical migration source" repousa numa caça manual. | Simon#4+#5 (Quine UPHELD) | MAJOR |
| **M2** | `README.md:29,59` | "principles P1–P12"; a lei tem 14 (P13 lineage, P14 robot-talks). | Dois princípios ficam invisíveis a quem lê o README. | Ashby#2 | MINOR (Quine) / MAJOR (Popper) |
| **M3** | `experiment/SKILL.md:80` | Diz "review = UPHELD/REFUTED/DOWNGRADED"; o vocabulário real do review é **KEEP/FIX**. (Ashby#8 — "review:80 se autocontradiz" — foi **refutado**: :80 é o diagrama da forma canônica.) | Erro factual cross-skill; um agente não sabe que verbo emitir. | Ashby#9 (Quine UPHELD; estrategista verificou :80) | MINOR |
| **M5** | `register-dispatch/SKILL.md:50` | "records anyway" para reserved types. **By-design** — o appender é recorder, não gate (header:30-37 "NOT ENFORCED here"); o gate é router:39/§5. Residual: o texto poderia apontar pro gate. | Não é drift; é divisão de trabalho. Resíduo só de wording. | Ashby#14 (Quine T2: feature) | MINOR (de MAJOR) |
| **M6** | `append-dispatch.cjs:21` | Docstring de header omite experiment do "REQUIRED for LIVE"; o código (:152) está certo. Dobra em C1. | Comentário stale; corrige junto com C1. | Ashby#13 | MINOR |
| **M8** | citações da constituição | Dupla-localização (repo-root = lei viva; `constitution/` = migration source). Precedência **está** declarada (README:16/71, LEDGER:136, router:6) mas o conteúdo nunca foi diffado. | Drift latente, não confirmado. | Spivak#6 (Quine/Popper T4) | MINOR (pendente diff) |
| **M9** | `register-dispatch/SKILL.md:111-113` | Bloco `sh` hard-coda `$HOME`/`$CLAUDE_PROJECT_DIR`; sem forma PowerShell. | Real só p/ operador pure-PowerShell pré-install; in-harness tem Bash + env. | Simon#2 (T5) | MINOR (de MAJOR) |
| **M12** | `register-dispatch/SKILL.md:102,110` | "hook bloqueia Bash até read-only" + "prefira Bash tool" sem dizer que `node append-dispatch.cjs` é allowlisted. | Operador teme que o hook bloqueie o comando que ele precisa rodar. | Simon#8 | MINOR (de MAJOR) |
| **m1** | `README.md:33` | Close row omite que `loops_used` é REQUIRED em `agents_spawned`. | Spec da close row incompleta. | Ashby#3 | MINOR |
| **m2** | `docs/LEDGER-MODEL.md:97` | Usa `agent_id` como chave L3; §7:533 removeu `agent_id` (→ `agent_name`). | Chave stale no modelo de dados. | Ashby#6 (Popper UPHELD) | MINOR |
| **m3** | `docs/LEDGER-MODEL.md:61` | Árvore da row omite `schema_version` (campo REQUIRED). | Modelo sub-especifica a row. | Ashby#7 | MINOR |
| **m5** | `review/SKILL.md:113`, `experiment/SKILL.md:114-120` | A two-file rule é "research fan-out" no texto §5/P9:133; review/experiment a estendem e renomeiam file 1. Prática in-place tipo §9, texto §5/§9 stale. | Scope creep vs o texto escrito da lei. | Ashby#12 (T3) | MINOR |
| **m6** | todos os docs | "FORECAST" vs "reserved/RESERVED" usados de forma intercambiável. | Inconsistência terminológica. | Ashby#17 | MINOR |

## Dropped (refutados na verificação — não suavizados)

| ID | Alvo | Por que caiu |
|----|------|--------------|
| **M4** | LEDGER-MODEL "v0.3.0 não governa" vs router | Equivocação: ambos concordam que **v0.5.2 governa** e v0.3.0 não. "Ambas governam" foi má-leitura de router:6. (Quine + Popper) |
| **M7-as-filed** | ontology-view / engineer-view / system-view "não existem" | Os **skills** existem em `.claude/skills`; estão fora do `CHAIN_SKILLS` do bundle por design. (Popper Glob) — **resíduo legítimo**: a discovery `docs/discovery/agents-input-output/system-view.md` aponta p/ um **doc** ontology-view não autorado (OQ-SV-2 auto-declarado), **fora do escopo dos 9 docs** → backlog. |
| **m4** | "5 attack lenses ≠ anti_bias axes → axis test rejeita" | O axis test (§4, vocab fechado) governa só o `anti_bias` per-group; as lenses do review são categorias em prosa, não eixos — o teste não as alcança. (Quine) |

## Tensões entre verificadores (registradas, não apagadas)

- **C1 severidade:** Popper UPHELD CRITICAL (rodou e reproduziu); Quine re-terrenou p/ MAJOR (a lei já decidiu no corpo; só os aside são stale). **Resolução do estrategista:** CRITICAL — uma suíte de teste vermelha num "canonical migration source" é bloqueante independentemente de a *intenção* da lei estar correta.
- **M2:** MINOR (Quine, "miscount de nav") vs MAJOR (Popper, "subconta a lei"). Registrado como MINOR com a discordância anotada.
- **M3:** a forma do defeito mudou na verificação — não é review se autocontradizendo (refutado), é experiment misatribuindo o vocabulário do review (confirmado no disco).

## Ressalva de cobertura (Loregian)

Nenhuma 2ª rodada de ataque necessária. Único item fora-de-escopo para backlog: **OQ-SV-2** — o doc `ontology-view` da discovery `agents-input-output` não foi autorado; os handles `engineer-view#<slug>` resolvem a um doc planejado.
