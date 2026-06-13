---
tags: [agents, dispatch, review, renarracao, engineer-view]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-engineer-view
role: l2b-renarracao
---

# Review l2b — re-narração proibida

Artefato: `engineer-view.md` v1.1.0. Gate único: o skill manda re-narrar NENHUM shape (apontar para a system-view) e o texto canônico dos contratos por edge é findings §4. Caçados: (a) mecânica de runtime que re-conta shape/fluxo das Camadas 2–3 da system-view; (b) cópias de conteúdo do findings §4 onde ponteiro bastava; (c) redefinição de termo; (d) re-narração já DIVERGENTE do canônico hoje. Distinção aplicada em todo item: registrar a DECISÃO sobre um edge (mandato do inventário) ≠ re-contar o CONTEÚDO do edge (violação).

Fontes comparadas linha a linha: `system-view.md` v1.0.0 (Surface, Camadas 1–4, mapa de stances), `research/findings.md` §2/§3/§4/§5, `discovery.md` §2 e §4.2/§4.7, `.claude/skills/engineer-view/SKILL.md` (Step 5 l.122–123: "Re-narrate NO shape here").

Veredito geral: a disciplina declarativa do artefato é boa — a seção "O que esta view possui — e o que defere" diz a coisa certa, o preâmbulo da tabela de edges diz "referenciado por ponteiro, nunca duplicado", e D6 (checklist) é o exemplo de conduta correta: registra existência, escopo, tags e status sem reproduzir um item sequer. O problema é que o resto do documento não cumpre o que essa seção promete: três das quatro categorias de texto canônico que a deferência ENUMERA como deferidas estão copiadas dentro das células de verdict, e uma das cópias já diverge do canônico hoje. Seis itens, em ordem de gravidade.

## Itens

### R1 — [ALTA, classe (b)] O inventário copia três das quatro categorias de texto canônico que sua própria seção de deferência enumera como deferidas

- **Onde:** seção "O que esta view possui — e o que defere", bullet 3: "Texto canônico dos contratos por edge → `research/findings.md` §4 (**literais de header, formatos de âncora, vocabulário fechado do reviewer, texto dos 6 itens**). Este inventário decide *status*, não re-edita texto." Contra: D16, D17, D19.
- **O que falhou:** das quatro categorias enumeradas, três estão reproduzidas integralmente nas células de verdict: **D16** copia o literal de header (`## E<n> — <nome> (<ângulo>[, <modelo> — opcional/informativo])`); **D17** copia a tripla de formatos de âncora (`caminho-relativo:linha` | `arquivo §seção` | `URL`); **D19** copia o vocabulário fechado do reviewer (`{UPHELD, REFUTED, DOWNGRADED→<alvo>}`) E os rótulos literais `Posição inicial:` / `Posição final:`. Só "texto dos 6 itens" (D6) honra o ponteiro. Registrar o GO não exige o literal: a discovery §4.7 registra as MESMAS decisões por ponteiro ("mecânica e literais: findings §4 edge 2/A5"; "tripla de formatos: findings §4 edge 2/A4"; "literais e ordem: findings §4 edge 4") e a system-view idem ("literais: findings §4 edge 2/A5") — o padrão de registro-sem-cópia existe no corpus e o engineer-view o abandonou exatamente onde sua deferência o prometia. Quando o texto canônico migrar do findings (congelado) para a spec (R-11 — gate nomeado pelas próprias rows D2/D8/D16/D17/D18/D19), estas cópias divergem silenciosamente. O risco não é teórico: a discovery §2 já carrega `caminho:linha` onde o findings §4 diz `caminho-relativo:linha` — o corpus já demonstra o drift entre cópias.
- **Correção:** nas três células, substituir o literal por ponteiro no padrão da discovery §4.7 (D16: "header de fronteira — literal: findings §4 edge 2/A5; identidade + ângulo iff n≥2; fonte canônica do modelo = campo `model` da row"; análogo em D17 e D19), mantendo intactos verdict, status e gates.

### R2 — [ALTA, classe (d)] D16: a cópia do literal de header JÁ diverge do canônico hoje

- **Onde:** D16, célula Verdict, vs findings §4 edge 2, bullet Header.
- **O que falhou:** o canônico é `## E<n> — <nome> (<ângulo>[, <modelo> — opcional/informativo; fonte canônica: campo model da dispatch row])` — o segmento "; fonte canônica: campo model da dispatch row" está DENTRO do colchete opcional. D16 reproduz `## E<n> — <nome> (<ângulo>[, <modelo> — opcional/informativo])` e re-renderiza o segmento como prosa separada ("fonte canônica do modelo = campo `model` da dispatch row"). As duas leituras (segmento como parte do literal vs como anotação) produzem headers diferentes; um leitor que monte o header pelo engineer-view reconstrói um literal distinto do que monta pelo findings. É precisamente a divergência-por-cópia que a deferência existia para impedir — presente no dia 1, antes de qualquer mudança no canônico. (A interpretação de D16 pode até ser a melhor — o segmento parece anotação — mas adjudicar a leitura do literal é re-editar texto canônico, que a própria deferência proíbe: "decide *status*, não re-edita texto"; se a desambiguação importa, o lugar dela é a spec/R-11, registrada como resíduo, não uma segunda versão do literal.)
- **Correção:** a de R1 (ponteiro) resolve as duas de uma vez; alternativamente, registrar a ambiguidade do colchete como resíduo no ledger e apontar.

### R3 — [MÉDIA, classe (d)] Duas cópias menores já divergentes do findings §4: a lista fixa de D9 e o "destino de citação" da tabela de edges

- **Onde:** D9, célula Verdict; tabela "Schemas e contratos", linha Edge 2.
- **O que falhou:** (i) D9 copia a lista fixa de invariantes como "IDs, âncoras, `Dissent:`, posições" — o canônico findings §4 edge 2 fecha a lista como "IDs, âncoras, `Dissent:`, **posições inicial/final**" (a forma curta "posições" é a do resumo §5.2, não a do texto canônico §4); o documento que se declarou pointer-only escolheu a variante não-canônica. (ii) A linha Edge 2 da tabela copia "'está no transcript' proibido como destino de citação" — o canônico diz "proibido como destino **final** de citação"; a queda do "final" alarga a proibição (referência intermediária a transcript passaria a violar). Pequenas, mas são exatamente o padrão (d): cópia + delta textual hoje.
- **Correção:** ponteiro ("lista fixa: findings §4 edge 2/A7") ou cópia fiel com "inicial/final" e "destino final".

### R4 — [MÉDIA, classe (a)] Mecânica de runtime: cláusulas dos passos 3–5 re-contam fluxo que a system-view (Camadas 2–3) e o findings §4 já narram, sem delta de engenharia além do ponteiro que a frase já carrega

- **Onde:** seção "Mecânica de runtime", passos 3, 4 e 5.
- **O que falhou:** o esqueleto da seção é legítimo (o mandato do Step 5 do skill é mapear gate→verdict e vigente/pende, e a maior parte das frases faz isso), mas cláusulas específicas re-contam conteúdo onde o ponteiro já dado bastava: **passo 3** — "seção persistida nunca se edita; tudo novo é seção append-only" é quase verbatim a narração do edge 3 da system-view ("seção persistida nunca é editada; síntese anexa seções novas") e o invariante do findings §4 edge 3; o delta de engenharia da frase é só "(D18)" e "P12 vigente", que sobrevivem sem a re-contagem. **Passo 4** — depois de "na ordem fixa da D19" (ponteiro correto), a frase re-enumera a ordem inteira da volta do reviewer (veredito exaustivo, N* carimbadas, posições em duas linhas antes do Dissent) — conteúdo do findings §4 edge 4; idem "supersedes obrigatório... ID nunca reutilizado" (A8) e "(round N), contador contínuo" (edge 5). **Passo 5** — "Approver recebe o working folder completo e aplica o checklist de 6 itens como definição executável da checagem P9" re-conta o ¶1 da Camada 3 da system-view cláusula por cláusula; o que é desta view ali é só o overlay de regime (D7, N/A em n=1).
- **Correção:** podar cada cláusula re-contada à sua forma gate/status ("volta do reviewer conforme D19/findings §4 edge 4 — vigência: P14 LEI; resto pende spec"), preservando integralmente o overlay vigente/pende, que é o conteúdo genuíno da seção.

### R5 — [BAIXA, classe (b)] Cláusula de aplicabilidade A2 copiada duas vezes dentro do próprio documento

- **Onde:** D20, célula Verdict; mecânica passo 5.
- **O que falhou:** "edge 1 aplica sempre, edges 2–5 iff n≥2, n=1 → só findings.md com invariantes internos, itens vacuosos `N/A — role ausente` ≠ PASS" aparece em D20 E re-aparece (parcial) no passo 5 — e o mesmo conteúdo já vive no findings §4 preâmbulo + Close e na narração de aplicabilidade da Camada 2 da system-view ("Aplicabilidade honesta..."). Quatro cópias no corpus, duas neste documento. D20 como registro da adoção de A2 é mandato; a segunda instância interna e o detalhe além de "(A2 — findings §4 preâmbulo)" são cópia.
- **Correção:** D20 mantém uma forma compacta + ponteiro; passo 5 referencia D20.

### R6 — [BAIXA, classe (c)] D4 restate inline a definição provisória de `<label>` — truncada em relação à fonte

- **Onde:** D4, célula Verdict: "(`<label>` = identificador curto do agente no header, derivado pelo strategist na sheet)".
- **O que falhou:** a fonte (discovery §4.2) define "`<label>` é o identificador curto do agente no header **do seu return em research.md**, derivado pelo strategist na sheet (ex.: `E1`, `E2`, `F`, `R1`)". A paráfrase inline derruba "do seu return em research.md" — "no header" sem o complemento admite leitura de header da sheet/dispatch row. Atribuída, sim ("definição provisória da discovery §4.2 adotada como default operacional"), mas o restate cria um segundo texto definicional já mais frouxo que o primeiro — numa row cujo objeto é exatamente a indefinição do termo. A regra do view é apontar, não redefinir; aqui o ponteiro sozinho ("default operacional: a definição provisória da discovery §4.2") era suficiente e mais seguro.
- **Correção:** remover o parêntese definicional ou completá-lo fielmente.

## Distinções honradas (não-violações verificadas)

- **D1, D5, D8, D21** — registram a DECISÃO (fronteira em três tipos; rota F* + guard; arbitragem do re-ask; congelamento do input) sem reproduzir as definições/narrações que a system-view carrega; conteúdo arbitrado em célula de verdict é mandato do inventário, não re-contagem.
- **D6** — exemplo positivo: aponta para "texto canônico findings §4 Close" e não reproduz item algum.
- **Divergência A14 (Deviation no CORPO vs "campo de desvios da close row" do findings §4 Close)** — divergência DELIBERADA do canônico, declarada, verificada contra o schema do appender e rastreada em R-6 do ledger; é correção de erratum, não drift de cópia.
- **Preâmbulo da tabela de edges** — declara e pratica o ponteiro ("referenciado por ponteiro, nunca duplicado"); as células de status são majoritariamente status, com as exceções apontadas em R3.

Dissent: mantenho R1/R2 mesmo contra a leitura defensável de que o Step 5 do skill MANDA o engineer-view "declare each load-bearing SCHEMA/CONTRACT (record fields, enums)" — sob essa leitura, copiar literais seria mandato, não violação. Rejeito-a para ESTE artefato por dois motivos: o gate deste dispatch fixa findings §4 como texto canônico, e o próprio artefato registrou a deferência como decisão sua (seção de posse/deferência + R-11), enumerando nominalmente as quatro categorias que depois copia — não se pode ter as duas posturas; se o autor preferir a leitura do skill, o conserto correto é emendar a seção de deferência e assumir a casa editorial, não manter promessa de ponteiro com prática de cópia.
