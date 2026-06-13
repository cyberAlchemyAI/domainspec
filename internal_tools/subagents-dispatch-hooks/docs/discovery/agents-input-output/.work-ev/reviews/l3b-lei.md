---
tags: [agents, dispatch, review, lei, engineer-view]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-engineer-view
role: l3b-lei
---

# Review l3b — lei (constituição, divisão de casas, linhas citadas)

Artefato: `engineer-view.md` v1.2.0. Gate único: lei — (a) contradição com P1–P14/§5; (b) emenda recomendada tratada como vigente; (c) erratum A14 onde a close row aparece; (d) divisão de casas router/type-skill/register-dispatch/constituição; (e) toda linha citada com número conferida contra o arquivo real.

Fontes abertas e conferidas: `subagents-strategy-constitution-proposal.md` (l.119–138, l.222–229, l.356, l.506–531, l.565–588, l.576), `register-dispatch/SKILL.md` (l.190–229), `.claude/skills/research/SKILL.md` (l.75–141), `.claude/skills/review/SKILL.md` (taxonomia de severidade), `.claude/skills/engineer-view/SKILL.md` (l.182–195 legenda + strike rule l.194), `.claude/skills/custom/frontmatter.md` (l.51 + ausência dos dois campos), `research/findings.md` (íntegra: §2, §3, §4, §5.1–5.5, §6, close), `discovery.md` (§6 incl. ERRATUM l.199, §7 incl. mapa l.230–240), `system-view.md` (preâmbulo do mapa l.170, mapa de stances, OQ-SV-1), `.work-ev/reviews/l1b-autoridade.md` (A1/A2 — confirmação do strike e do reparo).

## Conferência de linhas (gate e — todas as citações numeradas, contra o arquivo real)

| Citação no artefato | Arquivo real | Resultado |
|---|---|---|
| P4 l.122 (e "l.121 é P3") | l.122 = "Execution shape… partial group result"; l.121 = P3 | ✓ exato (correção l1b A2 aplicada) |
| P9 l.133 "the collected returns (research) and the cited synthesis (findings)" | l.133, frase verbatim | ✓ |
| P11 l.135 (+ parêntese final "boundary is provisional") | l.135, parêntese presente | ✓ (sustenta R-8) |
| P12 l.136 (working_folder completo) | l.136 "receives the full working_folder" | ✓ |
| P14 l.138 | l.138 "Robot-talks binding" | ✓ |
| T3 l.576 | l.576 "T3 — no self-approval… full working_folder" | ✓ |
| §5 `initial_prompt` l.356, campo R·A | l.356 "#### `initial_prompt` — R · A" | ✓ |
| §7 l.526–527 (tools/read_scope cortados; expected_output_shape "folded into initial_prompt") | l.526 e l.527, verbatim | ✓ (ver T3 sobre a glosa "lei") |
| §5 `working_folder` l.222–227 (espelho "collected returns") | bloco l.222–229; o parenthetical está em l.226, dentro do range | ✓ (range trunca o bloco em 2 linhas — nit, sem item) |
| register-dispatch l.209–218 (schema fechado da close row) | tabela l.207–215 + l.217–218 | ✓ |
| register-dispatch l.211 (bucket `helpers` registra) | l.211 "helpers in their own bucket" | ✓ |
| register-dispatch l.218 "unknown keys are rejected (exit 2)" | l.218, verbatim | ✓ (ver T4 sobre a glosa) |
| research/SKILL.md l.85 / l.108 / l.126 | heading §Tension design; "collected returns, verbatim"; "for research, acceptance includes the P9 citation check" | ✓ ✓ ✓ |
| engineer-view/SKILL.md legenda | RESOLVED = "decided AND enforced" l.186; *designed-but-not-built* em OPEN l.187; strike rule l.194 | ✓ |
| frontmatter.md: ausência de `dispatch_id`/`schema_version` | `subagents-findings` no enum (l.51); os dois campos ausentes do cheatsheet | ✓ (witness de D13 confirmado) |

**Gate (a) — contradição com P1–P14/§5: nenhuma encontrada.** Re-ask helper não consome `max_loops` (✓ §5: só reject do approver), bucket `helpers` ✓ §5 `agents_spawned`, degradação P4 literal ✓, approver com folder completo ✓ P12/T3, overlay não promulga ✓ P2/P3, `feedback_prompts` na close row ✓ register-dispatch l.212. **Gate (b) — nenhuma emenda tratada como vigente:** D5→§5.1, D9→§5.2, D6/D11→§5.3, D20→§5.4, D13→§5.5 — todas OPEN com gate nomeado e regime de intervalo (deviation/recomendado) correto; as cinco emendas existem verbatim em findings §5; as duas RESOLVED (D15, D21) não dependem de emenda alguma; os gates "spec do tipo" são honestamente declarados não-committed (R-11/l2a O5). **Gate (c) — erratum A14 corretamente refletido:** a Close row da tabela de edges e o passo 5 do runtime confinam `Deviation:`/`Accepted-unreviewed:` ao CORPO, citando o schema fechado (l.217–218); o passo 2 omite o "deviation na close row" que o findings §4 edge 2 ainda carrega — coerente com R-6 ("propagação aberta" é do findings, não desta view). **Gate (d) — casas respeitadas:** emenda 1 → constituição por rito de governança ✓; emendas 2–4 → research/SKILL §Outputs (juízo do tipo — casa certa; nada proposto toca a forma row/sheet que register-dispatch possui) ✓; emenda 5 → cheatsheet + confronto P3 ✓; o checklist verifica P14 sem re-adotá-la ✓; bucket `helpers`/`feedback_prompts` corretamente reconhecidos como schema vigente do register-dispatch, não re-decididos ✓.

Veredito geral: a disciplina legal do artefato é alta — todas as ~20 citações numeradas resolvem e sustentam, o strike l1b A1 foi executado e reparado conforme a regra do skill, e a contagem (2 RESOLVED · 19 OPEN · 0 CRITICAL, 16+5=21, 16+2=18) confere. Seis itens, dois MAJOR — ambos sobre D15, a row auto-referente.

## Itens

### T1 — D15 RESOLVED diverge do preâmbulo do mapa da system-view sem flag [MAJOR]

- **Evidência:** system-view l.170 (preâmbulo do mapa, baseline v1.0.0 congelada): "Rows sem verdict de matriz — … (`stance:derivacao-de-label`, `stance:regime-pre-emenda`, `stance:verificacao-do-parent`, `stance:mapa-verdict-status`) — **traduzem como OPEN com dono nomeado na célula**". O artefato traduz D4, D7, D14 como OPEN (✓ conforme), mas D15 (`mapa-verdict-status`) como **RESOLVED** — divergência real da prescrição do baseline, **não flagrada**: a conferência aritmética flagra a divergência vizinha da MESMA frase (enumeração 4-vs-5, l1a V1) e a roteia ao reconcile (OQ-EV-4), mas silencia sobre esta.
- **Por que não é strike:** a prescrição de STATUS pelo preâmbulo excede o mandato da própria system-view ("NAMES every load-bearing stance and DECIDES NONE") — status é verdict-adjacente e pertence à row dona. O RESOLVED de D15 é sustentável. Mas a disciplina do artefato em V1 foi flagrar-e-rotear, nunca divergir em silêncio; aqui ele diverge em silêncio do mesmo parágrafo que acabou de auditar.
- **Fix proposto:** uma frase na conferência aritmética (ou na célula de D15): a prescrição "traduzem como OPEN" do preâmbulo é ultra-vires para `mapa-verdict-status` (a system-view não decide status) e a correção pertence ao mesmo reconcile de OQ-EV-4 — divergência flagrada, nunca obedecida nem silenciada.

### T2 — D15: cadência do enforcement e cadeia de sanção da exceção meta sobre-declaradas [MAJOR]

- **Evidência:** célula de D15: "enforced pela aplicação uniforme neste inventário + checagem de coverage/status no gate de publicação"; a mesma célula registra que a v1.1 continha aplicação não-uniforme (D1 vs D18) flagrada só no gate seguinte. Logo o enforcement é **event-driven (só no gate de publicação)**, não contínuo — entre gates, a legenda "RESOLVED = decided AND enforced" (SKILL l.186) fica descoberta, e o lapso da v1.1 é o witness disso. Adicionalmente, "sancionada pelo dono que a system-view nomeia" conflaciona a propriedade da DECISÃO da row (que a system-view de fato atribui ao autor) com autoridade para excepcionar a legenda verbatim do SKILL consumidor — superfície que o autor da view não possui.
- **Por que não é strike:** o documento é autoridade em disco, a exceção é declarada (l1c C7), o lapso e o reparo são registrados com transparência exemplar, e nenhuma outra row herda a licença.
- **Fix proposto:** na célula, qualificar o enforcement como "checado a cada gate de publicação (event-driven; o lapso v1.1→v1.2 é o witness da cadência)" e demover "sancionada por" para "exceção declarada pelo dono da row; a legenda do SKILL não a prevê — registrada como interpretação, não como sanção".

### T3 — D21: "o corte dos campos de input é **lei da tabela §7**" — glosa inflada; gate mecânico mais forte não citado [MINOR]

- **Evidência:** §7 intitula-se "Removed relative to v0.3.0 / v0.4.0-draft **(for assessment)**" — é registro de cortes com rationale, não dispositivo normativo; chamar a tabela de "lei" estica P10. O que enforça hoje o freeze "nenhum campo estruturado de input novo" é (i) o schema §5 (onde `initial_prompt` l.356 é lei — citado ✓) e (ii) a validação estrita do appender sobre o registro entrante ("Strict v0.5.2 validation applies only to the incoming record" — register-dispatch l.225–228), que a row não cita.
- **Fix proposto:** re-glosar "§7 l.526–527 (registro do corte)" e acrescentar a citação do gate mecânico do appender à célula de status de D21. O RESOLVED sobrevive intacto (R1 via l.356 + R4 banking); o item é de caracterização e de gate-mais-forte-disponível.

### T4 — D10: "o appender valida apenas a row" citado a l.218, que prova menos do que a glosa [MINOR]

- **Evidência:** l.218 ("unknown keys are rejected (exit 2)") rege especificamente o **close record** ("A close record must not carry…", l.217); a afirmação geral "valida apenas a row" (vs. validar artefatos de corpo) é verdadeira, mas seu lastro é o conjunto do SKILL (validação estrita do registro entrante, l.225–228), não aquela linha isolada. Mesma família do achado l1b A3 — paráfrase, não autoridade.
- **Fix proposto:** citar l.217–218 + l.225–228, ou estreitar a glosa para "o appender rejeita chaves desconhecidas na close row".

### T5 — Runtime passo 3: "o guard anti-auto-citação vale desde já — violação hoje" sem nomear a derivação vigente [MINOR]

- **Evidência:** a força presente do guard não vem do findings (que "recomenda; não promulga" — §5 header) e sim de P9 l.133 vigente: uma citação `F*` não resolve para um collected return, logo F-seção como prova terminal já viola P9 hoje. A célula de D5 carrega exatamente essa derivação ("uma citação F* não resolve hoje"); o passo 3 do runtime assevera a força sem o ponteiro.
- **Fix proposto:** no passo 3, "vale desde já **(P9 l.133 vigente — D5)**" — um ponteiro, zero texto novo.

### T6 — Skip note: range "§5 `working_folder` l.222–227" trunca o bloco [MINOR]

- **Evidência:** o bloco `working_folder` corre l.222–229; o conteúdo citado (parenthetical "collected returns", l.226) está dentro do range, então nada falha — mas o range declarado para de cobrir o "Why/How" do próprio campo.
- **Fix proposto:** "l.222–229" — precisão de uma linha; sem consequência de verdict.

## Veredito do artefato

**FIX** (2 MAJOR sobrevivem — T1, T2; ambos resolvíveis com frases na célula de D15/conferência, nenhum altera verdict, status ou contagem). Nenhum strike: as duas RESOLVED sustentam-se sob a lei vigente conferida linha a linha; nenhuma emenda é tratada como promulgada; o erratum A14 está corretamente incorporado; as casas propostas respeitam a divisão router/type-skill/register-dispatch/constituição.

Dissent: o RESOLVED de D15 deve PERMANECER mesmo após T1/T2 — a prescrição "traduzem como OPEN" do preâmbulo da system-view excede o mandato dela ("decides none") e obedecê-la inverteria a propriedade do verdict; o dever do artefato é flagrar e rotear a divergência ao reconcile, não rebaixar a row.
