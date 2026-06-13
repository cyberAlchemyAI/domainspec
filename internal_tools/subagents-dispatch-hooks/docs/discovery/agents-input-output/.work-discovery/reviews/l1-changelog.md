---
tags: [agents, dispatch, io-contracts, changelog, l1, zig-zag]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: discovery-author (turno de volta, dispatch 2026-06-12-agent-io-discovery)
---

# L1 changelog — discovery.md v0.1.0 → v0.2.0 (turno de volta do zig-zag)

Artefato revisado: `discovery.md` (status mantido `draft`; versão 0.1.0 → 0.2.0). Reviews processados: `l1a-fidelidade.md` (V1–V6), `l1b-inflacao.md` (I1–I10), `l1c-coerencia.md` (C1–C5). Pontos contestados re-verificados contra `research/findings.md` e `research/research.md` antes de cada edição. Identidades entre reviews: V1≡I1≡C2, V3≡I8, V5≡I5 — 21 ids, 18 correções distintas.

## APLICADAS (21 ids / 18 edições)

| id(s) | edição | uma linha |
|---|---|---|
| V1/I1/C2 | §3.7 row #9 | verdict relabelado `GO-condicional (split: carimbo + cláusula = GO; taxonomia = OPEN)` — texto da célula do findings §2 #9; contagem GO 10 · GO-cond 3 agora reconstruível das rows (#9, #11, #12=3.5). |
| C1 | §3.3 | ponte enunciada: linha LEI 2 conta vereditos de linha (#4, #8); verbatim vive no split do #11 e é contada lá (§3.7). |
| C3 | §3.6 + §5 item 3 | regime pré-emenda declarado (approver aplica desde já; sem deviation no intervalo; witness: o próprio close do findings o aplicou); "destrava 3.6" → "formaliza 3.6", contraste explícito com 3.5. |
| C4 | §3 preâmbulo | nota de aritmética: #17 ≡ resíduo §6.1 — três OPENs distintos no total, não quatro. |
| C5 | §4 | retitulado + sub-seção "Declínios provisórios — NÃO rejeitados" para itens 7–8, com aviso contra leitura como kill-list. |
| V2 | §3.2 | locus corrigido: "§4 edge 2/A8" → "§4 edge 4/A8, e edge 5" (verificado: supersedes/contador contínuo moram no edge 4 e edge 5). |
| V3/I8 | §6 row helpers | "sem mudança de appender — row inalterada" demovida a "hipótese desta discovery, a validar na spec contra `register-dispatch`"; A14 citado fielmente (espelha no campo de desvios da close row). |
| V4 | §5 intro + §5.3 | recomendação de 5.3 marcada "derivada de §6.3 por esta discovery"; intro restringe os defaults registrados a 5.1/5.2. |
| V5/I5 | preâmbulo | "não decide nada novo" → "nada novo sobre os vereditos; adições próprias = recomendações editoriais de housing/sequência, marcadas como tal". |
| V6 | §1 quebra 1 | atribuição de wording corrigida: "a maior quebra observada" = research §E1 Elementos (output do synthesizer (b)); findings §2 #12 = "a maior observada". Locus verificado por grep. |
| I2 | §3.1 | "decisão-mãe: todas as demais são instâncias" demovida a "decisão estruturante: os demais GOs de envelope a instanciam" — o que o findings sustenta (LEIs/KILLs/OPENs não são instâncias). |
| I3 | Objective | "fixado como contrato por edge" → contagem honesta desdobrada (GO fixado; GO-cond condicionado; OPEN aberto). **Desvio da versão sugerida pelo reviewer:** o checklist NÃO foi listado como GO-condicional (findings #7 é GO, emenda candidata) — listado como "emenda candidata ao skill", evitando criar um novo erro classe C2. |
| I4 | §2 convergência | "nenhum framework" → "nenhum dos seis precedentes pesquisados"; "exatamente esse equilíbrio" → "esse equilíbrio". |
| I6 | §2 convergência | "resolvida" → "endereçada... aqui demovida a checklist de close e pendente como emenda candidata (3.6)". |
| I7 | §2c | nota de fidelidade do findings §3 anexada à quote do Dissent de E1 ("três quebras vs 'duas' — inconsistência registrada, não harmonizada"). |
| I9 | §1 Why now | contrafactual sem witness substituído pela versão demovida (reinvenção feliz 2x — E1 ev. 1; resolução perde base mecânica quando persistência falha — E1 ev. 2/3). |
| I10 | Connections | "citam os returns E1/E2/E3 verbatim" → "citam trechos verbatim dos returns E1/E2/E3". |
| — | frontmatter | version 0.1.0 → 0.2.0; status `draft` mantido. |

## REJEITADAS (0)

Nenhuma. Única ressalva de aplicação parcial registrada acima: I3 aplicado com wording corrigido (checklist permanece GO/emenda candidata, não GO-condicional — fidelidade ao findings #7 prevalece sobre a versão demovida sugerida pelo l1b).

## Verificação pós-edição

- Contagem do §3 preâmbulo = linha de contagem do findings §2: **GO 10 · GO-condicional 3 · LEI 2 · OPEN 1 (+3 resíduos §6) · KILL 2** — agora reconstruível dos rótulos exibidos: GO-cond = #9 (§3.7), #11-condensação (§3.7), #12 (§3.5); LEI 2 = #4 + #8 (§3.3, com a ponte do verbatim enunciada); OPEN com identidade #17 ≡ §6.1 declarada.
- Nenhum OPEN decidido, nenhuma LEI virou aquisição, nenhum GO-condicional adquirido sem condição; dissensos vivos (E3 R1 sobre IDs; mecanização tri-lateral) intactos.
