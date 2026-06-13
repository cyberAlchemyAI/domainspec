---
tags: [agents, dispatch, review, io-contracts, coerencia, l1c]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: l1c-coerencia (skeptic, dispatch 2026-06-12-agent-io-discovery)
---

# Review L1c — coerência interna da discovery (agents-input-output/discovery.md)

Gate único: coerência interna. Artefato: `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/discovery.md` (v0.1.0). Findings consultado apenas para desambiguar o que a contagem citada conta — todos os itens abaixo são conflitos entre passagens DA discovery.

## Itens

### C1 — Três passagens enumeram TRÊS LEIs; §3.3 e a contagem dizem DUAS (severidade: alta)

- **Passagem A** — §1 "What stays the same": "As leis vigentes — `Dissent:` persistida (...), pares posição-inicial/final (P14), **verbatim (skill §Outputs)** — são categoria **LEI**". Três itens. Reforçado por §3.7 (row #11: "Verbatim (**LEI**) + GO-condicional") e §6 (row "LEIs (**Dissent, P14, verbatim**)").
- **Passagem B** — §3.3: "**Duas obrigações** que o contrato carrega são lei vigente, não aquisição" (só Dissent + P14), e §3 preâmbulo: "**LEI 2**".
- **Por que conflitam:** um leitor de §3.3 conclui que verbatim NÃO é LEI; um leitor de §1/§3.7/§6 conclui que É. A regra-ponte que resolve (a linha LEI-2 conta vereditos de linha da matriz — #4 e #8 — enquanto a LEI verbatim vive DENTRO do split do #11 e é contada na metade GO-condicional) existe no findings, mas a discovery nunca a enuncia.
- **Correção mínima:** uma oração em §3.3, ex.: "Duas obrigações contam na linha LEI-2 da matriz (#4, #8); a terceira lei vigente — verbatim — vive dentro do split do #11 (§3.7) e é contada lá, não aqui."

### C2 — Tabela compacta rebaixa #9 de GO-condicional para GO, quebrando a própria contagem (severidade: alta)

- **Passagem A** — §3 preâmbulo (contagem citada como normativa): "**GO 10 · GO-condicional 3** · LEI 2 · OPEN 1 (+3 resíduos §6) · KILL 2".
- **Passagem B** — §3.7, row do carimbo: "Carimbo `not-re-reviewed` + cláusula de aceitação | **GO** (a taxonomia de 4 tiers é OPEN — split mantido) | findings §2 #9". E §5.2 chama o carimbo de "a metade GO do split #9".
- **Por que conflitam:** no findings, o veredito de célula do #9 é **GO-condicional** (split: carimbo = GO; taxonomia = OPEN) — é o terceiro GO-condicional da contagem. Com o #9 rotulado "GO" na tabela, a discovery instancia apenas DOIS GO-condicionais (#11 na tabela, #12 em §3.5), contradizendo "GO-condicional 3"; e os GOs instanciados sobem para 11, contradizendo "GO 10". A contagem que o documento declara "honesta sob P10" não bate com os rótulos que o próprio documento exibe.
- **Correção mínima:** trocar o verdict da row para "**GO-condicional** (split: carimbo = GO; taxonomia de 4 tiers = OPEN)" — texto da célula do findings — sem tocar na contagem.

### C3 — §5 trata a emenda 3 como trava de 3.6, mas 3.6 é GO pleno e a regra de fechamento só polícia 3.5 (severidade: média)

- **Passagem A** — §5 Dependências, item 3: checklist de 6 itens "(**destrava 3.6**)" — mesma estrutura verbal do item 1 "(destrava 3.5)", que é GO-condicional.
- **Passagem B** — §3.6: checklist é "**GO**, como emenda candidata"; §3.5 insiste "GO-condicional NÃO é GO: sem a emenda, todo dispatch que usar a rota declara deviation"; §6 fecha com "nunca apresentar **3.5** como adquirido antes da emenda P9" — silêncio sobre 3.6.
- **Por que conflitam:** duas decisões pendentes de emenda recebem categorias diferentes (GO-cond vs GO) e o documento não diz o que muda na prática: se 3.6 está "travado" até a emenda 3, qual é o regime pré-emenda do checklist (deviation? aplicável desde já como prática do approver?)? O paralelismo verbal de "destrava" sugere simetria que as categorias negam.
- **Correção mínima:** uma oração em §5 item 3 ou §3.6 fixando o regime pré-emenda, ex.: "candidata: o approver pode aplicá-lo desde já como prática; vira lei do tipo com a emenda — diferente de 3.5, nenhuma deviation é exigida no intervalo" (ou trocar "destrava" por "formaliza").

### C4 — Aritmética dos OPENs: "1 (+3)" apresentado como distintos, mas §4.7 identifica o OPEN da matriz com o resíduo §5.1 (severidade: baixa)

- **Passagem A** — §3 preâmbulo: "OPEN **1 (+3 resíduos §6)**" — lê-se como 4 itens.
- **Passagem B** — §4 item 7: validação mecânica na coleta (#17, o OPEN de linha da matriz) "permanece **dentro do OPEN de mecanização (§5.1 abaixo)**"; e §5 abre com "**os três** do findings §6".
- **Por que conflitam:** a própria discovery estabelece a identidade #17 ≡ mecanização ≡ §5.1, o que faz a notação "1 (+3)" contar mecanização duas vezes; §5 conta três.
- **Correção mínima:** parêntese na contagem: "(o OPEN da matriz, #17, é o mesmo resíduo de §6.1 — três OPENs distintos no total)".

### C5 — §4 intitula-se "Alternativas rejeitadas" mas hospeda dois itens explicitamente NÃO rejeitados (severidade: baixa)

- **Passagem A** — título de §4: "Alternativas rejeitadas **e o que as matou**".
- **Passagem B** — §4 item 7: "declínio **PROVISÓRIO, não KILL**"; §4 item 8: "**não rejeitada: OPEN**".
- **Por que conflitam:** a semântica da seção (kill-list, "o que as matou") contradiz o status dos itens 7–8; uma spec que leia §4 como banco de negativas tipadas (espelho de §3.8) banca dois OPENs por engano. O disclaimer interno ("Registrado aqui para não ser lido como decidido") admite o risco sem removê-lo.
- **Correção mínima:** retitular ("Alternativas rejeitadas e declínios provisórios") ou mover 7–8 para §5 deixando ponteiros.

## Não encontrado

- Nenhuma alternativa rejeitada em §4 é usada/assumida em outra seção (checado: tipagem de corpo, campos de input, `round`, remoção do re-ask, digest intermediário, conserto silencioso — todos consistentemente mortos no resto do doc).
- Nenhuma decisão de §3 contradiz um open de §5 (3.2 × 5.3 coerentes: decisão declarada + custo aberto + dissenso vivo).
- §6 aloca cada decisão na casa que §3/§5 implica (P9→constituição via governança; checklist/condensação/shape→skill §Outputs; campos→cheatsheet; LEIs→onde já moram).
- O design space §2 contém a decisão vencedora (convergência = 3.1) e cada posição (a)–(d) tem destino declarado.

Dissent: nenhum item achado inverte uma decisão — C1–C5 são derivas de rotulagem/contabilidade, não contradições load-bearing; se a trilha tiver orçamento curto, só C1 e C2 exigem edição obrigatória, e C3 pode ser herança fiel do findings (que também dá GO ao #7 e GO-condicional ao #12) — corrigi-la na discovery sem nota arriscaria infidelidade à fonte.
