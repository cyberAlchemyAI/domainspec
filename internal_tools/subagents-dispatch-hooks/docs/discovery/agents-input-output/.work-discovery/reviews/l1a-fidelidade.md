---
tags: [agents, dispatch, review, io-contracts, fidelity, p9]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l1a-fidelidade (skeptic, dispatch 2026-06-12-agent-io-discovery)
---

# Review L1a — fidelidade à fonte (discovery.md vs findings.md/research.md)

Gate único: para cada decisão/claim da discovery, a fonte citada (findings/research) de fato a sustenta? Método: resolução manual de cada citação da discovery contra `research/findings.md` e `research/research.md`. Classes caçadas: decisão não tomada apresentada como tomada; OPEN suavizado; GO-condicional tratado como GO; LEI tratada como aquisição; verdict/contagem divergente da matriz §2; arbitragem §3 re-narrada com resultado diferente.

## Violações

### V1 — MINOR — verdict do elemento #9 relabelado de GO-condicional para GO

- **Claim da discovery:** §3.7, linha da tabela "Carimbo `not-re-reviewed` + cláusula de aceitação | **GO** (a taxonomia de 4 tiers é OPEN — split mantido)".
- **Fonte citada:** findings §2 #9.
- **Por que não sustenta:** o verdict da matriz para o elemento #9 é "**GO-condicional** (split: carimbo `not-re-reviewed` + cláusula de aceitação = GO; taxonomia de 4 valores = OPEN)". A discovery preserva o split entre parênteses, mas rotula a row como "GO" — o label de elemento diverge da matriz. Efeito colateral: a contagem que a própria discovery repete ("GO-condicional 3") deixa de ser reconstruível das suas rows (visíveis como GO-cond: só 3.5/#12 e a metade condensação de #11 — duas, não três; a terceira no findings é #9).
- **Correção mínima:** relabelar a célula de verdict para "GO-condicional (split: carimbo = GO; taxonomia = OPEN)", mantendo o resto da row.
- **Atenuante declarado:** a substância do split está integralmente preservada na própria célula e em §4 item 8 e §5.2; nenhum conteúdo da metade OPEN foi tratado como decidido.

### V2 — MINOR — locus de citação errado para a disciplina de IDs (supersedes/contador contínuo)

- **Claim da discovery:** §3.2 — "contador contínuo por agente, nunca reiniciado, nunca reutilizado; revisão referencia o superado (`supersedes E1#4`) ... (findings §3 arbitragem 4 A1; **§4 edge 2**/A8)".
- **Fonte citada:** findings §4 edge 2.
- **Por que não sustenta:** o conteúdo "contador contínuo, ID nunca reutilizado, `supersedes`, superseded permanece citável" mora em findings **§4 edge 4** ("Disciplina de ID entre turnos/rounds (A8)") e no edge 5 ("contador de IDs continua — nunca reinicia"); o edge 2 só diz "contador por agente, A1". A8 está certo; o edge apontado está errado.
- **Correção mínima:** trocar "§4 edge 2/A8" por "§4 edge 4/A8 (e edge 5)".

### V3 — MINOR — "sem mudança de appender — row inalterada" atribuído a findings que não o afirma

- **Claim da discovery:** §6, row "Bucket `helpers` em `agents_spawned` + `Deviation:` de re-ask | já compatível com o relato no corpo do close (findings §4 Close, T2/A14) ... | **sem mudança de appender — relato no corpo, row inalterada**".
- **Fonte citada:** findings §4 Close, T2/A14.
- **Por que não sustenta:** T2 move `exit_reason`/`agents_spawned`/desvios para o CORPO e A14 manda as linhas `Deviation:`/`Accepted-unreviewed:` serem "**espelhadas no campo de desvios da close row**" — ou seja, há interação com a row, e o findings em nenhum lugar conclui "sem mudança de appender / row inalterada". Essa é uma conclusão de tooling que a discovery tira por conta própria e apresenta na coluna de veículo como se decorresse do findings. A própria discovery hedgeia ("verificar se `register-dispatch` precisa de nota"), o que confirma que não está decidido.
- **Correção mínima:** reescrever o veículo como "hipótese desta discovery: nenhum campo novo de row aparenta ser necessário (A14 usa o campo de desvios existente); confirmar contra `register-dispatch` na fase de spec" — marcando como verificação pendente, não como compatibilidade dada.

### V4 — NIT — recomendação de §5.3 apresentada como registrada no findings

- **Claim da discovery:** §5 intro — "os três do findings §6, **com as recomendações que o próprio findings registra**"; §5.3 — "Recomendação: manter o default `<label>#<n>` ... e **medir custo nos próximos dispatches** antes de qualquer endurecimento ou relaxamento".
- **Fonte citada:** findings §6.3.
- **Por que não sustenta:** §6.3 registra "nenhum lado decide sem medição" — não prescreve "medir nos próximos dispatches". Para 5.1 (default checklist) e 5.2 (manter só o carimbo, via split #9) as recomendações de fato existem no findings; para 5.3 a prescrição operacional é gloss da discovery, coerente mas não registrada.
- **Correção mínima:** em 5.3, marcar a recomendação como "derivada de §6.3 por esta discovery" ou suavizar o intro de §5 para "com os defaults que o findings registra onde existem".

### V5 — NIT — preâmbulo "ela não decide nada novo" excede o corpo

- **Claim da discovery:** preâmbulo — "ela não decide nada novo".
- **Por que não sustenta (auto-contradição com o corpo):** §5 último bloco e §6 contêm posições editoriais novas da discovery — notavelmente a casa do texto canônico dos contratos ("dentro do research/SKILL.md, evitando um segundo documento normativo") e a sequência de emendas. Elas estão corretamente rotuladas localmente como "desta discovery, não do findings", o que contradiz a claim global do preâmbulo.
- **Correção mínima:** preâmbulo → "não decide nada novo sobre os vereditos; escolhas de spec-path são marcadas como desta discovery".

### V6 — NIT — quote "a maior quebra observada" atribuída ao findings §2 #12 com wording do E1

- **Claim da discovery:** §1 break 1 — "(... findings §2 #12: 'a maior quebra observada')".
- **Fonte citada:** findings §2 #12.
- **Por que não sustenta exatamente:** findings #12 escreve "(quebra F11 — **a maior observada**)"; a frase entre aspas "a maior quebra observada" é literal do research §E1 (Elementos, output do synthesizer (b)). Substância idêntica; atribuição de wording trocada.
- **Correção mínima:** citar research §E1 para a frase literal, ou ajustar a quote para "a maior observada".

## Classes limpas (verificadas, sem violação)

- **Contagem da matriz:** "GO 10 · GO-condicional 3 · LEI 2 · OPEN 1 (+3 resíduos §6) · KILL 2" reproduz verbatim a linha de contagem do findings §2.
- **OPEN nunca suavizado:** §5.1 (mecanização, três posições l3a/l3b/l3c não-arbitradas, decisão de owner), §5.2 (taxonomia 4 tiers), §5.3 (custo de IDs) e #17 (declínio provisório, "não KILL") permanecem abertos exatamente como no findings §6/§2 #17; "validação mecânica confinada à row" em §5.1 é sustentada pelo findings §4 preâmbulo (normativo), não só pela posição l3b.
- **GO-condicional preservado como condicional:** 3.5 (draft F*, "GO-condicional NÃO é GO; deviation por dispatch até a emenda P9") e a metade condensação de #11 reproduzem fielmente findings #12/#11 e arbitragem 2 — exceto o label de #9 (V1).
- **LEI nunca virou aquisição:** Dissent (skill∘verbatim), pares P14 e verbatim mantidos como categoria LEI "referencia e verifica, nunca re-adota", com o gate de witness corretamente excluído — fiel à semântica da matriz e a D3–D6.
- **Arbitragens §3:** as cinco re-narrativas (re-ask capeado helper P11; extensão P9 GO-condicional + guard anti-auto-citação; checklist defendido como emenda candidata; A1/A3; A2/A10/A13) chegam ao MESMO resultado do findings, incluindo os porquês (K3×T3, K2+T1, K1, l3a dissent sobre IDs).
- **KILLs banked:** #6 (unânime, três Dissents citados corretamente) e #18 (`round`, com o condicional do edge feedback preservado) fiéis.
- **Quotes de E1/E2/E3:** todas as aspas amostradas resolvem literais (ou truncamentos fiéis) no research.md — incluindo os três Dissents, "Padronizado" 1/4, R1/R5, Tam et al., telephone effect, "checklist de 5 itens", "README line 22".
- **Emendas §5 (1–5):** superfícies, conteúdos e o status "recomendadas, não promulgadas" idênticos ao findings §5; a claim sobre o cheatsheet (node_type existe no enum, campos não) verificada verdadeira contra `.claude/skills/custom/frontmatter.md`.
- **Quebras §1 (1–4):** as quatro re-narrativas batem com research §E1 ev. 2/3/4 e com a nota do findings §3 (ramo Dissent indecidível coberto nos dois braços).
- **Checklist de 6 itens:** os seis itens, o escopo "dispatch_type: research", a dívida do item (iv) para review e "N/A — role ausente ≠ PASS" idênticos ao findings §4 Close.

## Veredito

Nenhuma violação CRITICAL ou MAJOR. Nenhuma das classes caçadas se materializou em substância: nenhum OPEN foi decidido, nenhum GO-condicional foi adquirido sem condição, nenhuma LEI virou aquisição, nenhuma arbitragem mudou de resultado, a contagem bate. 3 MINOR (V1–V3) + 3 NIT (V4–V6), todas com correção de uma linha.

Dissent: V1 é tecnicamente uma instância da classe caçada "GO-condicional tratado como GO" — no label do elemento #9, não na substância (o split está declarado na própria célula). Classifico MINOR; um leitor mais duro poderia subir para MAJOR porque uma spec que copie só a coluna verdict da tabela §3.7 herdaria "GO" seco para o #9 e perderia a reconstrutibilidade da contagem GO-condicional 3.
