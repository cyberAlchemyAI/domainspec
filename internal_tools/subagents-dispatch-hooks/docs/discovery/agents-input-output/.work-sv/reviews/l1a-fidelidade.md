---
tags: [agents, dispatch, review, io-contracts, fidelity, system-view]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l1a-fidelidade (skeptic, dispatch 2026-06-12-agent-io-system-view)
---

# Review L1a — fidelidade à fonte (system-view.md vs discovery.md v1.0.0 / findings.md)

Gate único: cada stance nomeada e cada descrição de shape/camada do system-view corresponde a algo real na discovery v1.0.0 e no findings? Método: resolução manual de cada stance do mapa, cada linha das quatro camadas e cada tabela de "alternative framings" contra `discovery.md` (§1–§7) e `research/findings.md` (§2–§6). Classes caçadas: stance inventada; stance load-bearing omitida do mapa; decisão/arbitragem re-narrada com resultado diferente; OPEN/GO-condicional/LEI re-classificado na narrativa; contagens ou atribuições E1/E2/E3 divergentes.

## Violações

### V1 — MAJOR — GO-condicional #9 re-narrado com condição de destrave inexistente ("emenda que o destrava")

- **Claim do system-view:** Camada 4, bullet "Condicionado (GO-condicional)": "**Três peças operam sob deviation declarada até a emenda que as destrava**: o draft `F*` citável (pende uma linha em P9), a rota de condensação carimbada (pende emenda ao skill), e **o split do carimbo `not-re-reviewed`**."
- **Fonte:** findings §2 #9; §5 (emendas 1–5); discovery §4.7 row #9, §6.2.
- **Por que não sustenta:** nenhuma das cinco emendas recomendadas (findings §5.1–5.5: P9, condensação, checklist, shape, frontmatter) cobre o elemento #9. A condição do #9 na fonte não é emenda pendente nem deviation: é o **split declarado na célula** — carimbo + cláusula = GO desde já; taxonomia de 4 tiers = OPEN aguardando **consumidor não-circular** (findings §2 semântica: "condicionada a emenda pendente **ou a consumidor futuro**"; §6.2). Dizer que o split "opera sob deviation declarada até a emenda que o destrava" inventa uma emenda e um regime de deviation que não existem para #9 — e contradiz a regra que o próprio bullet enuncia ("GO-condicional nunca é apresentado como adquirido" pressupõe descrever a condição certa).
- **Correção mínima:** reescrever a terceira peça como "o split do carimbo `not-re-reviewed` (#9) — condicionado a consumidor futuro não-circular para a metade taxonomia, não a emenda; a metade carimbo é GO sem deviation", deixando "deviation até a emenda" só para as duas primeiras peças.

### V2 — MEDIUM — Mapa de stances omite GOs load-bearing que a própria Camada 4 promete como rows

- **Claim do system-view:** Camada 4, bullet GO: "As aquisições estruturais: envelope..., headers de fronteira, claim-IDs..., âncoras por claim, append-only..., shape do findings, checklist..., re-ask capeado, input congelado. **Cada uma com sua row futura no engineer-view.**" E OQ-SV-1: "todos os **13** handles de stance".
- **Fonte:** discovery §4.7 (rows #1, #3, #10, #13, #15, #16, A2, A3) + convenção U3 ("System-view e engineer-view endereçam por esses handles").
- **Por que não sustenta:** o mapa de stances tem 13 rows, mas não há row para header de fronteira (#1), âncoras por claim (#3), append-only estendido (#10), output do reviewer (#13), shape do findings (#15) nem input congelado (#16) — todos GOs da matriz que a Camada 4 declara terem "row futura". O #15, em particular, carrega tensão própria (matriz default vs shape equivalente com deviation; emenda 4) e o #13 carrega o vocabulário fechado do reviewer. Ou o mapa está incompleto frente à fonte que a view diz mapear, ou a promessa "cada uma com sua row" excede o mapa — em ambas as leituras a contagem 13 não reconstrói o inventário da discovery (GO 10 + 3 GO-cond + adotadas A2/A3).
- **Correção mínima:** ou adicionar rows para os GOs ausentes (ao menos #13 e #15), ou reescopar o bullet da Camada 4 ("as stances com tensão viva têm row própria; os GOs sem tensão entram no engineer-view como rows RESOLVED diretas da matriz, endereçadas por handle U3, sem stance nesta view") e ajustar OQ-SV-1 para refletir o escopo.

### V3 — MEDIUM — OQ-SV-3 afirma "donos nomeados" para os três OPENs; a fonte só nomeia dono para 6.1

- **Claim do system-view:** OQ-SV-3: "Os OPENs do sistema (mecanização 6.1, tiers 6.2, custo de IDs 6.3) **têm donos nomeados** fora desta cadeia de views"; reforçado na Camada 4, tabela de framings, row 4: "cada OPEN carrega default operacional **E dono nomeado da decisão futura**".
- **Fonte:** discovery §6.1–6.3; findings §6.
- **Por que não sustenta:** só 6.1 tem dono nomeado ("o dono do corte do validator v0.3.0"). Para 6.2 a fonte exige consumidor não-circular + confronto com o corte de `grade`, sem nomear dono; para 6.3 a discovery diz explicitamente "esta discovery **não prescreve quando nem por quem**". O preâmbulo do §6 da discovery é "aguardando **owner/witness/consumidor**" — disjunção, não dono universal.
- **Correção mínima:** em OQ-SV-3, restringir "dono nomeado" a 6.1 e descrever 6.2/6.3 como "aguardando consumidor não-circular / medição, sem dono nomeado na fonte"; na row da Camada 4, trocar "E dono nomeado" por "e, onde a fonte o nomeia, o dono da decisão futura".

### V4 — MINOR — handle "(4.7/#5, #6)" aplica a convenção U3 a decisões que não moram na tabela §4.7

- **Claim do system-view:** mapa de stances, row `stance:envelope-sobre-corpo-livre`: "(handle 4.7/#5, #6)".
- **Fonte:** discovery §4.7 "Handles (U3)": "o handle canônico de cada row **desta tabela** é o `#n` da matriz".
- **Por que não sustenta:** #5 (envelope) é decidido em §4.1 e #6 (KILL do schema do corpo) em §4.8 — nenhum dos dois é row da tabela §4.7, então o prefixo "4.7/" não lhes pertence pela convenção citada.
- **Correção mínima:** trocar por "(matriz #5, #6 — discovery §4.1/§4.8)".

### V5 — MINOR — contagem da revisão L2 truncada ("de ~13 para 10 GO")

- **Claim do system-view:** Camada 4, tabela de framings, row 1: "A revisão L2 derrubou a contagem de ~13 para 10 GO justamente por isso."
- **Fonte:** findings §3 ("aquisições caem de ~13 para **10 GO + 3 GO-condicional**") e §8 L2 ("cai de ~13 para **11 GO + 2 LEI**" — a forma 10+3 só fecha após a reclassificação L3 do #12).
- **Por que não sustenta:** a truncação "para 10 GO" omite o resto da contagem e atribui à L2 um número que, pela trilha §8, só existe após L3; a fonte é internamente dupla (§3 vs §8) e o system-view escolheu uma metade sem citar qual.
- **Correção mínima:** "derrubou a contagem de ~13 para 10 GO + 3 GO-condicional (findings §3; pela trilha §8, a forma final fecha em L3)".

## Classes limpas

- **Camada 1 (as quatro quebras):** F1–F21/F11, Dissent 7/7, transcript, verbatim degradando — todas com conteúdo, atribuição e "maior quebra" (#12) fiéis à discovery §1 e a E1.
- **Camada 2 (três tipos + cinco edges + close):** território envelope/linha estruturada/corpo livre, payloads e invariantes por edge, aplicabilidade n≥2/n=1 — fiéis a discovery §2/§4.1 e findings §4, incluindo o guard anti-auto-citação.
- **Camada 3 (economia de verificação):** checklist de 6 itens (substância, escopo, resolução-vs-sustentação, N/A≠PASS), re-ask capeado (P11, bucket helpers, P4 literal), condensação só pelo emissor, mecânica confinada à row — fiéis a findings §3 arb. 1–3 e §4.
- **Tabelas de "alternative framings":** todas as atribuições E1/E2/E3 (duas famílias, kill triplo, experimento §7, telephone effect, peça #1 evaporada, declínio provisório do Candidato #5, anotação inline E1 ev. 6) resolvem para as fontes citadas.
- **Vocabulário de verdict, KILLs, OPENs (conteúdo), mapa verdict→status, erratum A14, nota U7 do `<label>`:** re-narrados sem mudança de resultado; PROVISIONAL/blocker declarados honestamente.
- **Stances 2–13 do mapa:** cada uma tem base real na discovery/findings (nenhuma stance inventada); as omissões estão cobertas em V2.

Dissent: V2 admite leitura alternativa legítima — um mapa só de stances com tensão viva é um critério defensável de system-view; mas o texto da própria Camada 4 ("cada uma com sua row futura") e o OQ-SV-1 ("todos os 13 handles") fecham essa porta, então alguma correção (rows novas OU reescopo da promessa) permanece obrigatória.
