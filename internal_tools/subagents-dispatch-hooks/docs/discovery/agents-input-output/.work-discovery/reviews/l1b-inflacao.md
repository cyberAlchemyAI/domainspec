---
tags: [agents, dispatch, review, inflacao, p10]
node_type: review
is_session: false
layer: architecture
nature: technical
status: complete
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
dispatch_id: 2026-06-12-agent-io-discovery
role: l1b-inflacao
---

# Review l1b — inflação (claim ≤ proof, P10)

Artefato: `discovery.md` (v0.1.0). Fonte de prova: `research/findings.md` (dispatch `2026-06-12-agent-io-contracts`). Gate único: nenhuma afirmação da discovery pode exceder a força que o findings registra.

Veredito geral: a discovery é, no conjunto, disciplinada — GO-condicional, LEI, OPEN e os dois dissensos vivos (E3 sobre IDs; mecanização tri-lateral) sobrevivem intactos nas seções que os tratam. As inflações encontradas são locais: 1 upgrade de verdict numa célula de tabela, 1 universal sem witness, e 8 frases que esticam além da prova. Itens em ordem de gravidade.

## Itens

### I1 — Upgrade de verdict: elemento #9 rotulado GO onde o findings registra GO-condicional

- **Frase** (§3.7, tabela): "Carimbo `not-re-reviewed` + cláusula de aceitação | **GO** (a taxonomia de 4 tiers é OPEN — split mantido)".
- **Por que infla:** o findings §2 #9 registra o verdict do elemento como **GO-condicional** (split declarado NA CÉLULA: carimbo+cláusula = GO; taxonomia = OPEN). A discovery promove o rótulo da célula a "GO" e empurra o split para parêntese. Pior: a própria contagem da discovery (§3 preâmbulo, "GO 10 · GO-condicional 3") só fecha se #9 for um dos 3 condicionais — a tabela contradiz a contagem que a discovery declara como honesta sob P10. É exatamente a classe de erro que a trilha L1 do findings corrigiu (I8: "tier demovido a GO condicional").
- **Versão demovida:** "Carimbo `not-re-reviewed` + cláusula de aceitação | **GO-condicional** (split: carimbo+cláusula = GO; taxonomia de 4 tiers = OPEN — findings §2 #9)".

### I2 — Universal sem witness: "decisão-mãe: todas as demais são instâncias dela"

- **Frase** (§3.1): "É a decisão-mãe: todas as demais são instâncias dela."
- **Por que infla:** o findings não estabelece hierarquia entre os 18 elementos; #5 é um GO entre dez. E o universal é falso na própria taxonomia da discovery: as LEIs não são instâncias de uma decisão deste dispatch (são leis vigentes referenciadas), os KILLs são negativas, os OPENs não são decisões. "Todas" excede qualquer linha do findings.
- **Versão demovida:** "É a decisão estruturante: os demais GOs de envelope (headers, IDs, âncoras, append-only) a instanciam." — ou cortar a frase.

### I3 — Objective: "fixado como contrato por edge" comprime condicional e aberto em fixado

- **Frase** (Objective): "O estado final é o conjunto de vereditos do findings fixado como contrato por edge — envelope estruturado sobre corpo livre, persistência append-only imutável-no-persist e checklist de aceitação de 6 itens — pronto para virar emendas pontuais…"
- **Por que infla:** dos três itens nomeados como "fixados", dois não estão: a persistência citável do draft F* é GO-condicional (pende emenda P9) e o checklist é emenda candidata, não lei vigente (findings §3 arbitragens 2 e 3). O corpo da discovery (3.5, 3.6) corrige, mas o Objective — a frase que mais será citada — apresenta o conjunto como adquirido.
- **Versão demovida:** "O estado final é o conjunto de vereditos do findings carregado com sua contagem honesta: fixado onde GO, condicionado às emendas pendentes onde GO-condicional (draft F*, condensação, checklist), aberto onde OPEN — pronto para virar emendas pontuais…"

### I4 — Universalização além dos seis precedentes: "nenhum framework schematiza claims/evidência"

- **Frases** (§2 A convergência): "nenhum framework schematiza claims/evidência" e "E2 mostra os seis precedentes mantendo **exatamente** esse equilíbrio".
- **Por que infla:** o witness de E2 cobre seis precedentes pesquisados ("nenhum dos seis precedentes tipa claims/evidência dentro do schema" — research.md §E2 Dissent, como o próprio §4 item 1 da discovery cita corretamente). "Nenhum framework" é um universal sobre o ecossistema que nenhum return emitiu. O "exatamente" é adjetivo de força acrescentado sobre o "mantendo esse equilíbrio" do findings §3.
- **Versão demovida:** "nenhum dos seis precedentes pesquisados schematiza claims/evidência" e "mantendo esse equilíbrio".

### I5 — Preâmbulo: "ela não decide nada novo" vs as recomendações editoriais próprias

- **Frase** (preâmbulo): "ela não decide nada novo. Toda posição abaixo cita o findings… ou o research… que a sustenta."
- **Por que infla:** a discovery contém conteúdo próprio sem lastro no findings: os quatro "Abertos identificados para a fase de spec (desta discovery, não do findings)" com Recomendações próprias (§5 — ex.: casa canônica dos contratos "dentro do research/SKILL.md… evitando um segundo documento normativo") e a tabela de housing do §6. São escolhas razoáveis e estão marcadas como da discovery — mas o preâmbulo afirma um zero absoluto que o próprio documento viola.
- **Versão demovida:** "ela não decide nada novo sobre o DESIGN dos contratos; suas únicas adições próprias são recomendações editoriais de housing e sequência (§5 'desta discovery', §6), marcadas como tal e revisáveis pela spec."

### I6 — "resolvida pelo único precedente que a trata"

- **Frase** (§2 A convergência): "A peça sem dono no ecossistema — checagem de citação por claim — é **resolvida** pelo único precedente que a trata (Anthropic…)."
- **Por que infla:** o findings não diz "resolvida": o elemento #7 foi DEMOVIDO a checklist e o checklist é emenda candidata ao skill (arbitragem 3) — método emprestado da Anthropic, estatuto ainda pendente. "Resolvida" lê como adquirido o que está condicionado.
- **Versão demovida:** "…é endereçada pelo único precedente que a trata (Anthropic: passo dedicado pós-síntese) — aqui demovida a checklist de close e pendente como emenda candidata (3.6)."

### I7 — Citação de E1 Dissent ("duas quebras") sem a nota de inconsistência registrada

- **Frase** (§2c): "Dissent de E1: as duas quebras reais 'seriam pegas por um checklist de 5 itens no close…'".
- **Por que infla (por amaciamento):** o findings §3 registra explicitamente uma inconsistência interna de E1 — "E1 ev. 2 enumera TRÊS quebras; o Dissent de E1 fala em 'duas' — inconsistência interna de E1, registrada, não harmonizada". A discovery repete o "duas" do Dissent sem carregar a nota, apagando uma reserva de fidelidade que o findings fez questão de manter viva (a discovery em §1 lista quatro quebras, agravando a fricção silenciosa).
- **Versão demovida:** acrescentar à frase: "(nota de fidelidade do findings §3: E1 ev. 2 enumera três quebras; o Dissent de E1 diz 'duas' — inconsistência registrada, não harmonizada)".

### I8 — "já compatível… sem mudança de appender — row inalterada"

- **Frase** (§6, tabela, linha do bucket `helpers`): "já compatível com o relato no corpo do close (findings §4 Close, T2/A14); verificar se `register-dispatch` precisa de nota | sem mudança de appender — relato no corpo, row inalterada".
- **Por que infla:** o findings manda reportar `agents_spawned` (com `helpers`) no corpo do close e confina validação mecânica à row — mas em nenhum lugar atesta que o appender/row atuais acomodam o bucket sem mudança. A própria célula admite a dúvida ("verificar se…") e ainda assim o veículo afirma "sem mudança de appender". Compatibilidade afirmada sem witness.
- **Versão demovida:** "presumido compatível com o relato no corpo do close (findings §4 Close, T2/A14) | verificação pendente: confirmar contra `register-dispatch` se a row/appender precisam de nota; nenhuma mudança proposta pelo findings".

### I9 — Benefício contrafactual sem witness: "cada dispatch reinventa o shape e a checagem P9 degrada de mecânica para juízo"

- **Frase** (§1 Why now): "Sem contrato por role, cada dispatch reinventa o shape e a checagem P9 degrada de mecânica para juízo."
- **Por que infla:** dupla. (a) O witness interno mostra o oposto da primeira metade: os dois dispatches reais convergiram no shape SEM regra (namespaces emergiram 2x independentemente — E1 ev. 1); o que degradou foi persistência, não shape. (b) A segunda metade contradiz o próprio contrato: mesmo COM contrato, o item (i) declara que resolução é mecânica e SUSTENTAÇÃO é juízo (findings §4 Close) — "mecânica vs juízo" não é o eixo que o contrato muda por inteiro.
- **Versão demovida:** "Sem contrato por role, o shape depende de reinvenção feliz por dispatch (deu certo 2x — E1 ev. 1 — sem garantia), e a RESOLUÇÃO de citação perde a base mecânica quando a persistência falha (E1 ev. 2/3)."

### I10 — Connections: "citam os returns E1/E2/E3 verbatim"

- **Frase** (Connections, linha research.md): "Design space e alternativas rejeitadas citam os returns E1/E2/E3 verbatim."
- **Por que infla:** a discovery cita TRECHOS selecionados dos returns; "citam os returns verbatim" sugere transcrição integral — força de fidelidade acima do que o documento faz (e "verbatim" é palavra com estatuto de LEI neste corpus; usá-la frouxamente dilui a lei).
- **Versão demovida:** "Design space e alternativas rejeitadas citam trechos verbatim dos returns E1/E2/E3."

## Contagem

10 itens. Graves: I1 (upgrade de verdict de célula, contradiz a própria contagem declarada) e I2 (universal sem witness). Médios: I3–I6. Menores: I7–I10. Nenhum item toca os dissensos vivos: E3 sobre IDs (3.2, 5.3) e a mecanização tri-lateral (2d, 5.1) estão preservados com fidelidade na discovery.

Dissent: a discovery é, fora I1, mais deflacionada que a média do corpus — vários itens (I3–I10) são fraseado local já corrigido pelo corpo do documento; eu só bloquearia promoção a `status: complete` por I1 (verdict de tabela ≠ verdict do findings), e trataria o resto como edits de linha, não como falha estrutural.
