---
tags: [agents, dispatch, review, io-contracts, coverage, engineer-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l1a-cobertura (skeptic, dispatch 2026-06-12-agent-io-engineer-view)
---

# Review L1a — cobertura 1:1 (engineer-view.md vs system-view.md v1.0.0, mapa de stances)

Gate único: cada uma das 21 stances do mapa da system-view tem exatamente UMA row dona no inventário, com o handle exato que a system-view aponta? Método: conferência stance-por-stance (slug, ordem, ponteiro), conferência das rows pareadas e dos splits contra a declaração da system-view, e re-derivação independente da aritmética do autor contra a matriz real do findings §2 (18 linhas, contagem "GO 10 · GO-condicional 3 · LEI 2 · OPEN 1 · KILL 2" verificada em disco).

## Resultado da conferência

- **Bijeção 21 ↔ 21: FECHA.** As 21 stances do mapa (envelope-sobre-corpo-livre … input-congelado) resolvem em D1–D21 na MESMA ordem, com slug idêntico caractere a caractere. Zero stance sem row; zero row sem stance; zero handle divergente; zero stance disputada por duas rows; zero verdict duplicado.
- **Rows pareadas: DECLARADAS pela system-view.** D1 cobre #5+#6 — a célula da system-view para `stance:envelope-sobre-corpo-livre` cita "(matriz #5, #6)". D18 cobre #10+#18 — célula cita "(matriz #10, #18)". Nenhuma pareação não-declarada.
- **Splits #9/#17: resolvidos como declarado.** #9 → D11 (parte GO) + D12 (parte OPEN); #17 → D8 (parte resolvida) + D10 (parte OPEN). As quatro rows declaram o compartilhamento do handle, espelhando a regra de row-com-split da system-view. Um verdict, um status por row — mantido.
- **Aritmética do autor: BATE com a contagem real.** 16 rows com handle de matriz (D1, D2, D5, D6, D8–D13, D16–D21) + 5 sem handle (D3, D4, D7, D14, D15) = 21 ✓. Decomposição das 18 linhas da matriz: 10 linhas 1:1 + 4 linhas pareadas em 2 rows (#5+#6, #10+#18) + 2 linhas split em 4 rows (#9, #17) = 16 linhas → 16 rows; #4 e #8 são LEI sem row. 16 + 2 = 18 ✓ — confirmado contra a matriz real do findings §2 (#4 verdict **LEI**, #8 verdict **LEI**, e nenhuma outra linha puramente LEI). Os três OPENs do §6 → três rows distintas (6.1→D10, 6.2→D12, 6.3→D3) ✓. OQ-SV-4 mantida dispensa-sem-row, fidelidade à bijeção declarada (OQ-EV-2) ✓.
- **Desambiguações na row prometida:** A2 resolve em D20 e A3 em D6 — exatamente onde a system-view (Camada 4) as endereçou ✓. A adoção do mapa verdict→status é row própria (D15), como a system-view exigiu ✓.

**Veredito do gate: PASS.** Zero achados BLOCKER ou MAJOR. Três achados MINOR abaixo.

## Itens

### V1 — MINOR — Discrepância 4-vs-5 com a enumeração da system-view absorvida em silêncio

- **Onde:** Conferência aritmética ("5 rows sem handle... D3, D4, D7, D14, D15") vs system-view, preâmbulo do mapa: "Rows sem verdict de matriz — oriundas dos abertos-da-discovery (§6) ou da proposta §7 (`stance:derivacao-de-label`, `stance:regime-pre-emenda`, `stance:verificacao-do-parent`, `stance:mapa-verdict-status`)" — **quatro** nomeadas.
- **Fato:** a contagem real é 5: `stance:custo-dos-ids` (D3) também não tem handle de matriz §2 (seu handle é findings §6.3) e está fora da lista da system-view. O engineer-view conta certo (16+5) — a cobertura não quebra — mas corrige a enumeração do índice sem flagrar a divergência, num documento cujo mandato (OQ-SV-1) é exatamente a conferência aritmética.
- **Correção mínima:** uma cláusula na conferência aritmética: "a enumeração de 4 do preâmbulo do mapa da system-view omite `custo-dos-ids`; a contagem real de rows sem handle é 5 — divergência a registrar no próximo reconcile da system-view (OQ-EV-4)".

### V2 — MINOR — Âncora pública `engineer-view#<stance-slug>` não resolve mecanicamente

- **Onde:** Convenções do inventário: "a âncora pública de cada row é o próprio stance-slug — todo ponteiro `engineer-view#<stance-slug>` resolve para a linha da tabela cujo campo Stance carrega o slug".
- **Fato:** as rows são linhas de tabela markdown, não headings nem âncoras HTML; um link literal `engineer-view.md#envelope-sobre-corpo-livre` não resolve em renderizadores padrão. A resolução é por convenção de string (campo Stance), não mecânica. Não é divergência de handle — os slugs batem 21/21 e o esquema é o que a system-view declarou — mas a frase "resolve para a linha" promete mais do que o formato entrega.
- **Correção mínima:** qualificar ("resolve por convenção — busca do slug no campo Stance; sem âncora HTML") ou encaminhar âncoras explícitas à spec, via residue ledger.

### V3 — MINOR — Enumeração de LEIs na regra de tradução omite a terceira LEI da system-view

- **Onde:** Regra de tradução, bullet "LEI → não vira row (Dissent persistida = matriz #4; pares P14 = matriz #8)".
- **Fato:** a system-view (Camada 4, bullet Dado) nomeia **três** LEIs: Dissent, pares P14 **e o verbatim** — este último é a metade-LEI da linha mista #11 ("LEI (verbatim) + GO-condicional"), cuja metade-aquisição é a única dona de D9. A aritmética não é afetada (#11 conta entre as 16 linhas-com-row; a contagem LEI 2 do findings é por linha pura), mas um leitor reconciliando "três LEIs" (system-view) contra "2 linhas LEI sem row" (aqui) pode contar errado.
- **Correção mínima:** uma cláusula no bullet LEI: "a terceira LEI da system-view (verbatim) é metade da linha mista #11 — referenciada dentro de D9, não linha LEI própria".

Dissent: V1 beira MEDIUM — um inventário cujo trabalho devido por OQ-SV-1 é a conferência aritmética não deveria absorver em silêncio uma enumeração divergente do próprio índice obrigatório; mantive MINOR porque a bijeção e a contagem real fecham e a divergência é da system-view congelada, corrigível só via reconcile dela.
