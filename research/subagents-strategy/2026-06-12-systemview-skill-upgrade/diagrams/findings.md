---
tags: [agents, dispatch, research, diagrams, mermaid, findings]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: complete
version: 1.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Findings — diagramas progressivos do system-view (2026-06-12-systemview-progressive-diagrams)

Draft do writer: `draft-v1.md` (este folder). Revisores: Sattler (sintaxe/progressão) e Bell (fidelidade). Aprovação: parent. **Aplicado no doc na mesma sessão** (system-view.md v1.2.0).

## Vereditos e fixes aplicados

| Diagrama | Sattler (sintaxe) | Bell (fidelidade) | Fix aplicado pelo parent |
|---|---|---|---|
| D0 | REFUTED — `-."label" .->` sem espaço após `-.` | UPHELD | espaço inserido: `-. "label" .->` |
| D1 | REFUTED — herda risco `<-->` | UPHELD (b2→rmd defensável; ver dissent) | `<-->` mantido (válido mermaid ≥10.1; GitHub renderiza) — risco aceito e registrado |
| D2 | REFUTED — `<-- "label" -->` é sintaxe inválida; `<->` dentro do label | UPHELD | edge 4 dividido em ida/volta unidirecionais com labels próprios |
| D3 | UPHELD (ressalva `<-- "edge 4" -->`) | UPHELD | mesmo split: `syn -- "edge 4 (zig-zag)" --> rev` + `rev --> syn` |
| D4 | UPHELD | REFUTED — "metade taxonomia tiers" listada em GO-condicional, mas o doc a declara OPEN (duplicada em open) | entrada removida do nó gocond; label do gocond agora diz "pende emenda; deviation declarada até lá" |

## Dissents registrados

- **Bell:** em D1, a quebra 2 (Dissent ausente) aponta para o nó `rmd`; apontar para o edge explorer→research.md seria igualmente válido e envelheceria melhor se o engineer-view tratar como falha-de-emissão. Registrado, não aplicado (fiel ao texto como está).
- **Sattler:** sem dissent.

## Regra de progressão validada

D_n ⊇ D_{n-1} (nós nunca somem; podem ser agrupados em subgraph declarado — D4 agrupa D0–D3 em `pipeline`); o delta de cada diagrama é só a camada correspondente; complexidade monotônica (~9 nós → +4 → +3 → +4 → +5). Nenhum verdict desenhado; só termos do doc.

## Close

exit_reason: `resolved`; agents_spawned: total 3 — synthesize 1, evaluate 2, helpers 0; loops_used 1 (fixes aplicados pelo parent como approver; sem segundo turno do writer).
