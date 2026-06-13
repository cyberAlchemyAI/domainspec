---
tags: [agents, dispatch, research, io-contracts, review, skeptic, determinismo]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: draft
version: 0.1.0
last_updated: 2026-06-12
created_by: skeptic-l3c
---

# L3c — Review de determinismo de uso — draft-v3.md

Dispatch: 2026-06-12-agent-io-contracts. Artefato: `.work/drafts/draft-v3.md`. Gate único: **dois strategists independentes, mesmo goal, aplicando este contrato — produziriam research.md/findings.md estruturalmente idênticos?** Para cada item: a pergunta que os dois responderiam diferente + a desambiguação mínima. Não disputo vereditos da matriz (mérito é de L1/L2); só executabilidade.

## Itens

**A1 — Esquema de ID de claim: delegado ao briefing sem default canônico. Divergência garantida em TODO dispatch.**
O §2 linha 2 exibe três esquemas (`E2#4`, `A1`, `#13`) sem fixar nenhum; o §4 edge 1 entrega a decisão ao briefing ("esquema de ID" como componente do expected return). Pergunta divergente: strategist A institui `E1#4`, B institui `A1..A9` corrido — research.md estruturalmente distintos, e citações cross-dispatch incomparáveis. Pior: o contrato É inconsistente consigo mesmo — fixa `F*` para synthesizer e `N*` para reviewer (§4 edge 4) mas deixa o explorer livre. Desambiguação mínima: default canônico `<label-do-header>#<n>` (ex.: `E1#4`, contador por agente), briefing pode sobrescrever só com deviation declarada. Custa uma linha; sem ela o elemento mais citado do contrato não é determinístico.

**A2 — Dispatch n=1: nenhuma cláusula de aplicabilidade. O caso mais comum não está coberto.**
Single explorer, sem synthesizer nem reviewer: research.md existe? O checklist de 6 itens roda com (iii)/(iv) vazios — isso é PASS, FAIL ou N/A? Strategist A escreve research.md + findings completos; B cola o return no findings e cita inline ("o contrato é para fan-out"). Desambiguação mínima: edges 1, 2 e close aplicam SEMPRE que um subagente foi gerado; edges 3–5 condicionais à existência do role; itens vacuosos do checklist marcados `N/A — role ausente` (distinto de PASS).

**A3 — "Claim load-bearing" sem definição executável — e o close a contradiz.**
O goal (§1) restringe P9 a "toda claim load-bearing"; o close (§4) exige "toda claim citando ID" — universal. Pergunta divergente: strategist A cita toda frase assertiva do findings; B cita só as linhas da matriz. Os dois leram o mesmo documento. Desambiguação mínima: load-bearing =def toda assertiva que (a) aparece numa célula da matriz de veredito, (b) sustenta a resposta de 1 linha ao goal, ou (c) cuja remoção mudaria um verdict; o resto é isento. E alinhar §1 e §4 ao mesmo quantificador.

**A4 — Formato da âncora de evidência: três formatos admitidos, nenhum normalizado.**
"arquivo+linha, seção ou URL" (§4 edge 2) — escolha livre por observação. A escreve `README.md:22`, B escreve "README line 22" em prosa, C usa caminho absoluto. E "por observação" não define o que é uma observação (toda bullet? toda claim com ID?). Desambiguação mínima: formatos fechados `caminho-relativo:linha` | `arquivo §seção` | `URL`; mínimo de 1 âncora por claim-ID; prosa livre não conta como âncora.

**A5 — Header: `<nome>` e a "ordem determinística" sem chave.**
`## E<n> — <nome> (<ângulo>)`: nome = label da sheet? role? slug livre? E a montagem promete "ordem determinística" (§4 edge 2) sem dizer a chave — ordem de spawn, ordem de retorno, alfabética? Dois concats válidos, dois arquivos diferentes. Desambiguação mínima: `<nome>` = label do agente na sheet congelada; ordem = ordem das rows da dispatch row/sheet.

**A6 — Gatilho de imutabilidade ambíguo: "já coletadas" vs "já citado".**
§4 edge 3 usa DOIS gatilhos: "seções já coletadas (e qualquer material já citado)". Pergunta divergente: o synthesizer pode editar seu draft persistido ANTES de o reviewer o ler (ainda não citado)? A diz sim, B diz não. Desambiguação mínima: imutável no momento do persist; citação é irrelevante para o gatilho. (Coerente com a razão da F11: o que protege a cadeia é a persistência, não a citação.)

**A7 — Emenda de condensação: a lista de invariantes contém um membro OPEN — lei com cláusula aberta não é executável.**
"severidades: OPEN dentro da lista" (§2): sob orçamento, A preserva severidades, B as corta — dois condensados estruturalmente distintos, ambos "conformes". E a emenda não diz QUEM condensa (agente? parent?) nem como a condensação é marcada no research.md. Desambiguação mínima: resolver severidades in/out ANTES de adotar a emenda (lista fixa de verdade); condensação executada só pelo agente emissor, marcada com linha `[condensado: invariantes preservados]` sob o header.

**A8 — Feedback round: relação dos IDs do round 2 com os do round 1 não definida.**
Round 2 = nova seção `(round N)` — mas os claims continuam o contador (`E1#9` em diante)? Reiniciam (`E1.r2#1`)? E se o round 2 REVISA `E1#4`: reusar o ID viola imutabilidade; ID novo sem link deixa duas claims contraditórias igualmente citáveis. Desambiguação mínima: contador contínuo por agente, nunca reutilizar ID; revisão obrigatoriamente referencia o superado ("supersedes E1#4"); o ID antigo permanece citável como superseded — citá-lo sem a marca é falha do item (i).

**A9 — Agente que falha (partial group result): research.md silencioso.**
O contrato cobre return MALFORMADO (re-ask) mas não return AUSENTE (crash, timeout, vazio). A omite o header (quebra a numeração determinística de A5); B inventa uma marca. E o re-ask não tem cap — re-ask infinito é loop sem dono. Desambiguação mínima: header SEMPRE persiste, corpo `RETURN AUSENTE — <motivo>` + deviation na close row; re-ask máximo 1 por agente, depois marca ausência.

**A10 — Reviewer que não acha nada: três decisões livres no mesmo return.**
(a) Veredito por ID alheio é exaustivo (uma linha por ID) ou só para não-UPHELD? (b) Namespace `N*` vazio: omitir ou declarar? (c) `Dissent:` é LEI — mas o que ela contém quando o reviewer concorda com tudo? A escreve "Dissent: nenhum", B inventa um dissenso cosmético para cumprir a lei (pior outcome possível: a lei anti-falso-consenso fabricando consenso falso de discórdia). Desambiguação mínima: veredito exaustivo por TODO ID alheio; `Novas claims: nenhuma` explícito; token literal sancionado `Dissent: nenhum — <razão de 1 linha>`.

**A11 — Posições inicial/final: localização "NO RETURN" fixada, formato não.**
O contrato orgulhosamente fixa o ONDE (delta sobre P14) mas não o COMO: duas linhas? tabela? prosa? E "posição" = verdict agregado? resumo livre? Desambiguação mínima: duas linhas rotuladas `Posição inicial:` / `Posição final:`, 1 linha cada, imediatamente antes do `Dissent:` — assim o checklist (iv) vira grep, não juízo.

**A12 — Vocabulário de veredito do reviewer: `UPHELD/REFUTED/downgrade` — fechado? caixa? alvo?**
A grafia mista no próprio draft (duas maiúsculas, uma minúscula) sugere que ninguém decidiu. `downgrade` para o quê — severidade? verdict? E "partially upheld" é admissível? Desambiguação mínima: vocabulário fechado `{UPHELD, REFUTED, DOWNGRADED→<alvo>}`, caixa alta, alvo obrigatório no downgrade — espelhando a disciplina que A4/§2 linha 14 já exige do `exit_reason`.

**A13 — Shape do findings livre por design: o contrato sanciona a divergência estrutural que este gate caça.**
"matriz de vereditos (ou shape equivalente preservando os invariantes)" — dois strategists produzem findings estruturalmente DIFERENTES e ambos conformes; "shape equivalente" não tem teste de equivalência. Isso não é descuido, é o verdict da linha "Shape do findings" — mas então o contrato deve DIZER qual é o alvo de determinismo. Desambiguação mínima: declarar que o contrato garante identidade de INVARIANTES (checklist-checkável), não de bytes; e fixar a matriz como default salvo deviation declarada — shape livre sem default é loteria; default com escape é decisão.

**A14 — "Cláusula de aceitação declarada" e "deviation declarada": declaradas ONDE, em que forma?**
Aparecem em quatro lugares (item vi, m10, turno absorvido, briefing-override de A1) sem casa nem formato. A declara no corpo do findings em prosa; B na close row; C num comentário do checklist. O approver de um terceiro dispatch não sabe onde procurar. Desambiguação mínima: linhas fixas na seção de close do findings — `Accepted-unreviewed: <ID> — <razão>` e `Deviation: <o quê> — <razão>` — espelhadas no campo de desvios da close row.

## Veredito do gate

O draft v3 passa o gate para a ESPINHA (header, append-only, persistência do draft, checklist com donos) e falha na CASCA: os quatro pontos onde dois strategists divergem em todo dispatch são A1 (esquema de ID sem default), A3 (load-bearing sem definição + contradição §1/§4), A13 (shape livre sem alvo de determinismo declarado) e A2 (n=1 sem cláusula de aplicabilidade). Nenhum item exige conceito novo — todos são uma linha de default ou um token literal. Custo total estimado: ~15 linhas no draft.

Dissent: prevejo L3a (constituição) objetando que A1/A14 invadem propriedade da §5 ("o briefing é dono do edge, o contrato não re-decide") — sustento que default-com-override declarado não re-decide nada, só torna a delegação determinística, e §5 sem default é a própria não-determinação que o dispatch existe para fechar; e prevejo L3b (tooling) propondo fechar A4/A10/A12 com linter/appender mecânico — sustento que mecanizar antes de fixar os tokens textuais recria o cheiro do validator v0.3.0, e que A3 ("sustenta a claim" é juízo) é inferramentável por construção: a desambiguação certa é textual primeiro, mecânica só onde o vocabulário já fechou.
