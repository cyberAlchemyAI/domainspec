---
tags: [agents, dispatch, io-contracts, changelog, l2, zig-zag, engineer-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: engineer-view-author (turno de volta, dispatch 2026-06-12-agent-io-engineer-view)
---

# L2 changelog — engineer-view.md v1.1.0 → v1.2.0 (turno de volta do zig-zag)

Artefato revisado: `engineer-view.md` (versão 1.1.0 → 1.2.0, bump minor). Reviews processados: `l2a-overclaim.md` (O1–O6), `l2b-renarracao.md` (R1–R6), `l2c-mandato.md` (M1–M5). Pontos contestados re-verificados em disco antes de cada edição: `research/findings.md` §2 (#5 GO "envelope tipado sobre corpo livre"; #6 KILL unânime; #9 split GO/OPEN; #16), §4 (literal de header com o segmento "fonte canônica: campo model da dispatch row" DENTRO do colchete opcional — confirma R2; tripla A4; vocabulário fechado e rótulos de posição do edge 4; lista fixa "posições inicial/final" do A7; "destino **final** de citação"; itens (i)–(vi) do Close), §5 (nenhuma emenda toca #5/#6) e §6.1 (o que o corte do validator estabelece é a AUSÊNCIA de checador — confirma O3). **17 ids: 14 aplicadas, 0 rejeitadas, 3 upheld/limpos sem ação (O4, O6, M1). Contagem final: RESOLVED 2 (D15, D21) · OPEN 19 · CRITICAL 0.**

## ARBITRAGENS

### O1 — D1 multi-regime: **ramo (a) escolhido** — D1 → OPEN; contagem 2/19/0

Os dois ramos do reviewer foram pesados:

- **(a)** D1 mantém #5+#6, status cai a OPEN ("OPEN domina RESOLVED" — a própria convenção multi-regime do inventário), contagem 2/19/0.
- **(b)** emendar a aritmética: #5 ganha registro próprio (row nova — quebraria a bijeção 21↔21 — ou roteamento a D16/D2), D1 fica puramente negativo (#6 só) e RESOLVED sob R4.

**Escolhido: (a).** Defesa em três pés:

1. **Fidelidade à fonte congelada.** O roteamento #5+#6 → D1 não é invenção deste inventário — espelha o pareamento de stances da system-view v1.0.0 (verificado pelo próprio l2c: "a própria system-view... pareia #5+#6 / #10+#18 em stances únicas"). Re-rotear #5 para D16 ou D2 seria emendar por baixo o mapa de uma fonte congelada — hand-patch disfarçado de contabilidade, exatamente o que o regime de drift desta view proíbe. A correção legal do mapa, se desejada, pertence ao reconcile da system-view (OQ-EV-4), não a esta célula.
2. **Régua uniforme.** D18 tem estrutura idêntica (KILL bancado + GO pendendo spec, célula multi-regime) e é OPEN. Sob (a), D1 e D18 recebem o mesmo tratamento sob a mesma régua; sob (b), estruturas gêmeas divergiriam de status por uma decisão de roteamento tomada *depois* de conhecida a consequência na contagem — contabilidade motivada, o oposto da "contagem honesta" que a discovery §7 manda preservar (R-12).
3. **Substância.** O roteamento de #5 a uma row-instância seria semanticamente forçado: #5 é o GO do *princípio* (envelope sobre corpo livre), mais largo que header (#1→D16) ou IDs (#2→D2); nenhuma row-instância o possui — o próprio l2a provou que a rota de escape "as instâncias têm rows próprias" não cobre #5.

Consequências aplicadas: célula de D1 reescrita com os dois regimes declarados inline (GO #5 sem gate vigente — consumidor é a forma OPEN de D10, spec pende via R-11; KILL #6 bancado, declarado, nunca promove); status **OPEN**; conferência aritmética **intacta** (nenhum roteamento mudou — virtude decisiva do ramo a); contagem-manchete **RESOLVED 2 (D15, D21) · OPEN 19 · CRITICAL 0** com a rebaixa registrada na linha de contagem. O3 aplicado na mesma célula: a citação de §6.1 deixou de figurar como "lei citada" em apoio a RESOLVED (papel que não pode cumprir — o que o corte estabelece é a ausência de checador) e virou "forma do consumidor em aberto — via D10", consistente com o status OPEN.

### O2 — D15: RESOLVED re-sustentado APÓS o reparo de O1, com a falsificação registrada

O gate de D15 é dual ("aplicação uniforme + checagem no gate de publicação"). Em v1.1 a metade "aplicação uniforme" era empiricamente falsa (D1 vs D18). Com D1 re-statusada nesta revisão, a uniformidade voltou a ser fato em disco — e o episódio é evidência de que o gate de publicação FUNCIONA (o review l2a é a checagem em ação). A célula de D15 agora registra a falsificação e o reparo explicitamente, em vez de fingir que o enforcement nunca falhou. D15 permanece RESOLVED **nesta versão**; teria sido over-claim mantê-lo sem o conserto de D1 — a ordem importa e foi honrada.

### M4 — R-14: decidido AQUI, não empurrado à spec

Das duas saídas de l1a V2, a v1.1 escolheu a errada (deferir à spec uma escolha sobre superfície que este documento possui). Adjudicado nesta revisão: a convenção de string é a forma ADOTADA; upgrade a âncoras HTML/heading é evolve futuro deste documento, dono = autor do engineer-view. R-14 → closed (adjudicado); convenções do inventário reescritas.

## APLICADAS (14 ids)

| id | edição | uma linha |
|---|---|---|
| O1 | D1 (verdict + status + autoridade), contagem, linha de notas | ramo (a): D1 → OPEN pela convenção multi-regime; metade-KILL #6 segue bancada e declarada; contagem 2/19/0 — ver arbitragem acima. |
| O2 | D15 (célula status) | falsificação (v1.1: aplicação não-uniforme) e reparo (D1 → OPEN nesta versão) registrados na célula; RESOLVED re-sustentado pela uniformidade restaurada. |
| O3 | D1, coluna autoridade | §6.1 demovido de "lei citada em apoio a RESOLVED" a "forma do consumidor em aberto — via D10"; autoridade que resolve mas não sustenta deixou de posar de gate. |
| O5 | OQ-EV-2 + R-11 | gate-família "spec do tipo" declarado sem pendência committed em fila alguma; criação da casa editorial nomeada como pendência que o autor da spec deve abrir; D1 (metade GO) somada à lista de rows que pendem dela. |
| R1 | D16, D17, D19 (células verdict) | as três categorias copiadas (literal de header, tripla de âncoras, vocabulário fechado + rótulos de posição) substituídas por ponteiros a findings §4 edge 2/A5, edge 2/A4 e edge 4/A10/A11/A12; cada row registra só a DECISÃO; a promessa da seção de deferência voltou a ser prática. |
| R2 | D16 + R-15 (novo resíduo) | a divergência do literal de header desaparece com o ponteiro (cumprido junto com R1); a ambiguidade do colchete opcional registrada como resíduo R-15 — desambiguação pertence à spec (R-11), não adjudicada aqui. |
| R3 | D9 (célula verdict) + tabela de edges, linha Edge 2 | lista fixa de invariantes → ponteiro a findings §4 edge 2/A7 (elimina a variante não-canônica "posições"); "destino de citação" corrigido a "destino **final** de citação" conforme o canônico. |
| R4 | runtime, passos 3–5 | cláusulas re-contadas podadas à forma gate/status ("conforme D18 / findings §4 edge 3", "volta do reviewer conforme D19 / findings §4 edge 4", "checa conforme D6"); o overlay vigente/pende — conteúdo genuíno da seção — preservado integralmente. |
| R5 | D20 (célula verdict) + runtime passo 5 | A2 em forma compacta + ponteiro em D20; passo 5 referencia D20 em vez de re-copiar a cláusula de aplicabilidade — duas cópias internas reduzidas a uma. |
| R6 | D4 (célula verdict) | parêntese definicional truncado removido; a célula aponta para a definição provisória da discovery §4.2 sem criar segundo texto definicional mais frouxo numa row cujo objeto é a indefinição do termo. |
| M2 | regra R4 | frase-doutrina P10 ("obriga a citar e derrubar"; "violação verificável hoje") rebaixada ao enunciado fraco: banking satisfaz o "enforced" da legenda para o objeto de re-abertura; proposta futura é *confrontável* citando o findings — interpretação declarada para tradução de status, nenhuma obrigação nova sobre terceiros; P10 referenciada, nunca estendida. |
| M3 | D11 (célula status) | demarcação escrita: emissão do carimbo = GO sem condição (findings #9, verdict desta row); exigibilidade do item (vi) no intervalo = regime D7 (dono externo: quem redigir a emenda 3) — esta row não o adjudica. |
| M4 | convenções + R-14 | forma da âncora decidida aqui (convenção de string adotada; âncoras explícitas = evolve futuro deste documento); encaminhamento à spec removido — ver arbitragem acima. |
| M5 | regra R4, frase final | porta de escopo fechada: freezes com lei vigente resolvem pela cláusula-cabeça de R1, não por banking; R4 cobre apenas a metade-negativa bancada; D21 citado como o caso que combina os dois regimes separadamente. |

## REJEITADAS (0)

Nenhuma. Os três itens sem edição não são rejeições — são vereditos UPHELD/limpos dos próprios reviews, que não pedem mudança:

- **O4** (l2a): D21 RESOLVED se sustenta com a re-citação pós-strike — verificado pelo reviewer, nenhuma ação. O reforço opcional sugerido (schema fechado do appender, l.218) não foi adicionado: a row sobrevive sem ele e inflar autoridade não-necessária é o vício que o l1 já cobrou uma vez.
- **O6** (l2a): varredura reversa das 18 (agora 19) OPEN — nenhum sub-claim; confirma D8/D11/D19/D6 e os registros R5; nenhuma ação.
- **M1** (l2c): rebaixamento de D8 adjudicado como tradução legítima, não re-abertura — nenhuma ação.

## Confirmações de fechamento

- **Bijeção:** intacta — 21 stances ↔ 21 rows, roteamento da matriz inalterado (16 + 2 LEI = 18 ✓); a conferência aritmética não precisou de uma vírgula (consequência direta do ramo (a)).
- **Régua uniforme:** D1 e D18 agora recebem tratamento idêntico sob a convenção multi-regime; nenhuma célula RESOLVED carece de gate vigente (D15: gate restaurado e registrado; D21: R1 + R4 com autoridades verificadas).
- **Literais copiados → ponteiros:** D16, D17, D19 (as três categorias enumeradas pela deferência), D9 (lista fixa) e D20 (A2 compacta) — o documento agora pratica o que a seção "possui/defere" promete; a única cópia divergente que existia (header, R2) deixou de existir.
