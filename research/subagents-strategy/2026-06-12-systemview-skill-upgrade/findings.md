---
tags: [agents, dispatch, research, legibility, lean-writing, findings]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: complete
version: 1.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Findings — propriedades de escrita para a skill system-view (2026-06-12-info-increasing-property-hunt)

Explorer: Shannon (n=1; este findings carrega o return integral + a síntese do parent).

## Declaração de fonte

O repo `github.com/cyberAlchemyAI/business-philosopher` está **inacessível** (404 em main/master/raw/gh/web search; nenhum mirror). As três regras abaixo são de **primeiros princípios, [PROPOSTA PRÓPRIA, NÃO CITADA]** — quando o repo voltar a ser acessível, reconciliar contra as definições originais.

## Return do explorer (verbatim, condensado pelo emissor — carimbo: estrutura e testes preservados integralmente)

**Conceito 1 — Informação crescente.** Curva de valor por token monotonicamente não-decrescente: cada frase amplia o modelo mental já formado; o leitor pode parar em qualquer parágrafo com um quadro coerente (incompleto em detalhe, não incoerente). Regra: *escreva de modo que qualquer ponto de parada deixe o leitor com uma conclusão defensável.* Teste: truncar em 25/50/75% — leitor cego enuncia a tese; se compatível com a tese da versão completa (mais grossa), passa; "não consigo concluir nada" = vale na curva.

**Conceito 2 — Pareamento abstrato⇄concreto.** Claim abstrata sem exemplo imediato é promissória não sacada. Cada enunciado de princípio é imediatamente seguido (ou precedido) por um caso concreto que o instancia — e cada caso concreto amarrado ao princípio que o generaliza. O par é a menor unidade semântica autossuficiente. Regra: *após cada claim abstrata, um exemplo específico antes da próxima claim.* Teste: rotular sentenças [A]/[C]; razão de pares adjacentes sobre total de [A] ≥ 0,8.

**Conceito 3 — Economia de palavras.** Cada palavra carrega informação nova ou é conector estritamente necessário; o alvo é densidade semântica máxima, não brevidade absoluta (curto pode ser vago). Regra: *rodada de corte — remova toda palavra cuja deleção não muda significado nem estrutura.* Teste: resumo a 30% mantendo todos os claims; se o resumo é mais claro que o original, o original tem gordura. Proxy: hedge-words < 1/100 palavras.

**Dissent (Shannon):** a regra 1 (interrompibilidade) contradiz textos intencionalmente argumentativos (filosofia, provas, narrativas com virada), onde a tese exige build-up. Pirâmide invertida é padrão jornalístico, não universal.

## Síntese do parent (aplicação na skill)

O dissent resolve por escopo: o system-view é `nature: explanatory` — explica um shape já minerado, não constrói um argumento; a interrompibilidade aplica. A skill ganha uma seção `<progressive-communication-discipline>` com as três regras + a regra de diagramas progressivos (do owner) + a camada executiva (do review de legibilidade 2026-06-12), com escopo declarado: vale para views explicativas; um doc argumentativo declara a exceção.

## Close

exit_reason: `resolved`; agents_spawned: total 1 — investigate 1, helpers 0; loops_used 1.
