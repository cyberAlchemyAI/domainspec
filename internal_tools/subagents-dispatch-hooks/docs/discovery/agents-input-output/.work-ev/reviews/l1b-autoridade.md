---
tags: [agents, dispatch, review, autoridade, engineer-view]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-engineer-view
role: l1b-autoridade
---

# Review l1b — autoridade verificável em disco

Artefato: `engineer-view.md` (v1.0.0). Gate único: para cada uma das 21 rows do inventário, abrir a autoridade citada e verificar (1) se a citação resolve e (2) se o texto encontrado sustenta o verdict e o status declarados. Regra do skill (`engineer-view/SKILL.md`, authority-strike rule l.194): autoridade inverificável em row RESOLVED = strike + downgrade a OPEN com nota.

Fontes abertas e conferidas: `research/findings.md` (§2 #1–#18, §3 arbitragens 1–5, §4 edges 1–5 + Close itens i–vi, §5.1–5.5, §6.1–6.3, §3 nota de fidelidade), `discovery.md` (§1, §2, §3(d), §4.1–4.8, §5, §6 incl. ERRATUM e dependência 5, §7 incl. mapa proposto), `subagents-strategy-constitution-proposal.md` (l.119–138, l.222–229, l.356, l.505–531, l.576), `.claude/skills/research/SKILL.md` (l.85, l.108, l.125–126), `internal_tools/subagents-dispatch-hooks/skills/register-dispatch/SKILL.md` (l.207–218), `.claude/skills/custom/frontmatter.md` (íntegra), `.claude/skills/engineer-view/SKILL.md` (l.71, l.86, l.182–195), `system-view.md` (mapa de 21 stances, OQ-SV-1–4), `.work-sv/reviews/l3c-engineer.md` (handle U2).

Veredito geral: a disciplina de citação do artefato é alta — das ~60 citações pontuais conferidas, todas resolvem e quase todas sustentam exatamente o que a célula declara, incluindo as citações com número de linha mais arriscadas (P9 l.133 com a frase exata "the collected returns (research) and the cited synthesis (findings)"; P11 l.135 com o parêntese provisório; P12 l.136; P14 l.138; T3 l.576; research/SKILL.md l.85/l.108/l.126; register-dispatch l.211 "helpers in their own bucket" e l.218 "unknown keys are rejected (exit 2)"; ausência de `dispatch_id`/`schema_version` no cheatsheet de frontmatter confirmada, com os dois campos presentes no frontmatter do findings deste folder — o witness que D13 alega). A legenda do consumidor que D15 cita é verbatim no SKILL (RESOLVED = "decided AND enforced", l.186; *designed-but-not-built* em OPEN, l.187), e o token "no running gate in repo" de D4/D14 é vocabulário sancionado do próprio SKILL (l.71, l.86, l.192). A bijeção 21↔21 e a aritmética 16 + 2 LEI = 18 conferem contra a matriz e o mapa da system-view. Três achados, em ordem de gravidade — um strike proposto (numa das 4 RESOLVED), duas imprecisões de citação sem strike.

## Itens

### A1 — D21 `input-congelado` [STRIKE proposto]: l.222–227 é `working_folder` (output), não o canal de briefing

- **Row / citação:** D21, status RESOLVED, célula de status: "a constituição §5 em disco é a dona do edge (l.222–227 verificadas)"; coluna de autoridade: "constituição §5 l.222–227 (verificada)". Repetido no caminho de skip (§ "O que esta view possui", linha de verificação).
- **O que falhou:** a citação resolve — l.222–227 existe e é §5 — mas o texto encontrado é o campo **`working_folder`** ("where the dispatch's outputs land"), que fala de DESTINO DE OUTPUTS e não diz palavra sobre o input/briefing por role. O claim da row ("input por role = prosa de briefing dentro do canal existente; o edge é propriedade da constituição §5") é sustentado por OUTRA parte de §5: o canal de briefing é **`initial_prompt`** (l.356 — exatamente o campo que o findings §4 edge 1 cita: "prosa de briefing dentro de `initial_prompt` (§5)"), com o lado KILL ancorado no experimento natural da tabela §7 (l.526–527: `tools`/`read_scope` cortados, `expected_output_shape` "folded into `initial_prompt`"). Como D21 é RESOLVED e seu enforcement declarado repousa na linha citada, a regra do skill manda o strike: a autoridade citada não sustenta o que a célula diz que ela enforça. (Nota: l.222–227 é citação legítima onde o artefato a usa para o parenthetical "collected returns" — R-1 — só o reuso em D21 é o misfire.)
- **Correção:** trocar a âncora para "constituição §5 `initial_prompt` l.356 (canal do briefing) + §7 l.526–527 (corte dos campos de input)" mantendo findings §2 #16 e discovery §1 como estão. Com a re-citação, o RESOLVED re-sustenta-se — a substância do verdict está intacta no findings #16 e em E3 R8; o defeito é exclusivamente de alvo da linha. Até a correção, pela letra do skill, a row cai a OPEN com nota de struck-authority.

### A2 — D8 `re-ask-capeado` (+ caminho de skip + tabela de edges): "P4 l.121–122" inclui uma linha que é P3

- **Row / citação:** D8 (RESOLVED), célula de status: "P4 é lei (l.121–122)"; mesmo range no caminho de skip ("P4 l.121–122").
- **O que falhou:** l.121 é **P3** ("Two appends, one place" — onde, aliás, mora a frase final "No other persistence surface exists..." que D13/R-5 usam); P4 ("Execution shape", com "An agent error inside a group degrades to a partial group result") é **só l.122**. O próprio findings §3 arbitragem 1 cita "linha 122". O texto que sustenta o verdict existe e sustenta — o range é que está inflado em uma linha. Sem strike: a autoridade é verificável em l.122 e o verdict/status de D8 sobrevivem integralmente (P11 l.135 ✓, register-dispatch l.211 ✓, ausência em findings §5 ✓).
- **Correção:** "P4 l.122" nas duas ocorrências (D8 e caminho de skip).

### A3 — D1 `envelope-sobre-corpo-livre`: "corte do validator como lei das três posições" sobre-atribui

- **Row / citação:** D1 (RESOLVED), autoridade: "findings §6.1 (corte do validator como lei das três posições)".
- **O que falhou:** em findings §6.1, apenas **l3a** chama o corte do validator de lei ("o corte do validator no §7 ... é lei"); l3b chama de "lei de desenho" o enforcement split do APPENDER (outra lei), e l3c não fala de lei. A citação resolve e sustenta o uso que a célula de status faz dela ("o corte do validator v0.3.0 é lei citada" — verdadeiro via l3a), mas a glosa "das três posições" não é o que o texto diz. Sem strike — defeito de paráfrase, não de autoridade.
- **Correção:** "findings §6.1 (corte do validator como lei — posição l3a)".

## Rows limpas

D2, D3, D4, D5, D6, D7, D9, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20 — todas as citações resolvem e sustentam verdict + status declarados (18 rows limpas; conferência inclui os gates nomeados contra findings §5.1–5.5, os handles de split #9/#17 contra a matriz, o handle U2 resolvendo em `.work-sv/reviews/l3c-engineer.md`, e o residue ledger R-1–R-13 contra as superfícies citadas).

Dissent: mantenho o strike em A1 mesmo sendo trivialmente reparável — uma leitura menos literal ("§5 é dona do edge" é verdadeiro ainda que o range aponte o campo errado) o rebaixaria a imprecisão como A2, mas a authority-strike rule do SKILL é verbatim sobre RESOLVED repousando em autoridade citada-e-verificada, e D21 é precisamente uma das 4 claims fortes que este gate existe para testar; aceitar range errado em RESOLVED esvaziaria a regra.
