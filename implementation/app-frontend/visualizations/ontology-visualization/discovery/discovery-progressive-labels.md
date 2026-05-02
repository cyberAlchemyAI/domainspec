---
tags: [vault, visualization, labels, cognitive-load]
node_type: discovery
layer: ontology
module: visual-rendering
nature: technical
status: consolidated
veracidade: high
convicção: high
version: 1.0.0
last_updated: 2026-03-19
---

# Discovery — Progressive Label Reveal e Intelligent Word-Wrapping

## Contexto e Motivação

O Ontology Explorer exibe 208 nós no canvas. A renderização atual de labels segue uma lógica **binária**:

- **Hub labels** (`_mass_norm > 0.35`): sempre visíveis, semi-transparentes, fonte fixa (`9 / globalScale`).
- **Todos os outros**: invisíveis até hover ou foco.

Isso cria dois problemas:

1. **Zoom-out**: os ~10 hub labels aparecem sobrepostos quando o grafo inteiro está visível. Os 198 não-hub nodes são pontos coloridos sem identidade — o usuário precisa hover sobre cada um para saber o que são.
2. **Zoom-in**: ao aproximar de um cluster denso, ainda só os hubs mostram label. Nós com massa média (0.15–0.35) que são perfeitamente legíveis nesse zoom continuam escondidos.

No 3D, labels são sprites gerados pelo `3d-force-graph` via `nodeLabel()`, que renderiza tooltips HTML no hover — não existe label persistente exceto para a projeção padrão da lib.

### Word-Wrapping

Labels longos como `"development practices constitution"` (36 caracteres) e `"rg-document-extraction-implementation"` (38 caracteres) são renderizados em uma única linha de `fillText`. No zoom médio, isso ocupa mais espaço horizontal que o raio útil do nó, gerando sobreposição com nós vizinhos.

---

## Diagnóstico: Código Atual

### 2D — `nodeCanvasObject()` (L769–841)

```javascript
// Labels: show for focused/neighbor nodes, OR always for high-mass hubs
const showLabel = (isFocused || isNeighbor) && focusedNodeId;
if (showLabel || isHub) {
  const label = node.label || node.id.split('/').pop();
  // ... fillText(label, x, textY) — single line, no wrapping
}
```

- `isHub = !focusedNodeId && (node._mass_norm || 0) > 0.35` — **threshold fixo**, independente do zoom.
- `globalScale` é usado para tamanho de fonte, mas **não para decidir se o label aparece**.
- Nenhuma lógica de truncação, wrap, ou ellipsis.

### 3D — `nodeLabel()`

Tooltips HTML via `.nodeLabel(n => ...)`. Sem label persistente no espaço 3D.

---

## Proposta 1: Zoom-Based Progressive Reveal

### Conceito

Substituir o threshold fixo `_mass_norm > 0.35` por uma **função de visibilidade contínua** que combina a massa do nó com o nível de zoom atual:

```
visibilidade(nó) = _mass_norm × globalScale
```

Se o produto ultrapassar um threshold, o label aparece. Isso significa:
- **Zoom-out**: só os top 3–5 hubs aparecem (mass_norm alta compensa globalScale baixo).
- **Zoom médio**: nós com massa média revelam seus labels progressivamente.
- **Zoom-in de cluster**: praticamente todos os nós do cluster mostram label.

### Implementação (2D)

```javascript
// Substituir isHub por:
const labelScore = (node._mass_norm || 0) * globalScale;
const LABEL_THRESHOLD = 0.6;  // Tunable
const showPersistent = !focusedNodeId && labelScore > LABEL_THRESHOLD;

// Opacity do label proporcional ao score (fade-in gradual)
const labelOpacity = Math.min(1, (labelScore - LABEL_THRESHOLD) / 0.4);
```

### Implementação (3D)

Para o 3D, a abordagem é diferente porque `3d-force-graph` não expõe facilmente o zoom level no callback de renderização. Opções:

1. **CSS2DRenderer sprites** — criar `<div>` labels posicionados via `CSS2DRenderer` do Three.js, com visibilidade controlada pela distância câmera→nó.
2. **SpriteText com visibilidade dinâmica** — usar `nodeThreeObject` para criar sprites de texto que auto-ajustam opacity com base em `camera.position.distanceTo(node)`.

A opção 2 é mais simples e não requer importar `CSS2DRenderer`:

```javascript
.nodeThreeObject(n => {
  const massNorm = n._mass_norm || 0;
  if (massNorm < 0.05) return null; // Nunca mostra label para nós triviais

  const sprite = new SpriteText(n.label, 3);
  sprite.color = 'rgba(226,226,232,0.8)';
  sprite.backgroundColor = false;
  // Visibilidade será controlada no animation loop
  sprite.userData = { massNorm, baseY: nodeSize(n) + 4 };
  sprite.position.y = nodeSize(n) + 4;
  return sprite;
})
```

No animation loop, iterar sobre os nós visíveis e setar `sprite.material.opacity` baseado em `massNorm × (600 / distanciaCâmeraAtéNó)`.

### Parâmetros Tunable

| Parâmetro | Default | Faixa | Efeito |
|-----------|---------|-------|--------|
| `LABEL_THRESHOLD` | 0.6 | 0.2–1.5 | Menor = mais labels visíveis em qualquer zoom |
| `LABEL_FADE_RANGE` | 0.4 | 0.1–1.0 | Maior = fade-in mais gradual |
| `MIN_MASS_FOR_LABEL` | 0.05 | 0–0.2 | Corte inferior — nós abaixo nunca mostram label |

---

## Proposta 2: Intelligent Word-Wrapping

### Conceito

Quebrar labels longos em múltiplas linhas quando precisam caber dentro de uma "caixa" proporcional ao tamanho visual do nó. Regras:

1. **Largura máxima** = `max(60, r × 8)` pixels (escala com o raio do nó).
2. **Quebra preferencial** em espaços, hifens e underscores.
3. **Truncamento com ellipsis** se o texto excede 3 linhas.
4. **Line height** = `fontSize × 1.3`.

### Implementação (2D)

```javascript
function wrapText(ctx, text, maxWidth) {
  const words = text.split(/(?<=[\s\-_])/); // Preserva separadores
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current + word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current.trimEnd());
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current.trimEnd());
  // Truncar a 3 linhas
  if (lines.length > 3) {
    lines.length = 3;
    lines[2] = lines[2].slice(0, -1) + '…';
  }
  return lines;
}
```

Usar no `nodeCanvasObject`:

```javascript
const maxLabelW = Math.max(60, r * 8) / globalScale;
const lines = wrapText(ctx, label, maxLabelW);
lines.forEach((line, i) => {
  ctx.fillText(line, x, textY + i * (fontSize * 1.3));
});
```

### Implementação (3D)

Para sprites de texto 3D, usar `\n` no `SpriteText`:

```javascript
const wrapped = wrapTextSimple(label, 20); // Max 20 chars per line
const sprite = new SpriteText(wrapped, 2.5);
```

---

## Interação entre as Duas Features

As duas propostas são complementares e devem ser implementadas juntas:

1. **Progressive reveal** decide **se** o label aparece.
2. **Word-wrapping** decide **como** o label é renderizado quando aparece.

Sem word-wrapping, revelar mais labels no zoom-in aumenta a sobreposição. Sem progressive reveal, word-wrapping sozinho não resolve a bagunça do zoom-out.

```
Zoom-out ──► poucos labels (alta massa) + wrapped curto (nome cabendo)
Zoom-in  ──► muitos labels (massa média) + wrapped longo (detalhes visíveis)
```

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Performance no 2D: `wrapText` chamado todo frame para cada nó visível | Cache `lines[]` no objeto do nó, invalidar na mudança de zoom band (não a cada pixel) |
| Performance no 3D: muitos sprites de texto | Só criar sprites para `_mass_norm > 0.05` (~60% dos nós eliminados) |
| Labels overlapping mesmo com wrap | Adicionar heurística de supressão: se dois labels se sobrepõem, esconder o de menor massa |
| `globalScale` instável durante zoom animation | Amortizar `globalScale` com exponential smoothing |

---

## Impacto Esperado

- **Zoom-out**: grafo limpo, só hubs com labels curtos/wrapped. Estrutura macro visível.
- **Zoom médio**: labels de nós intermediários aparecem progressivamente com fade-in. Readable.
- **Zoom-in em cluster**: todos os labels do cluster visíveis, wrapped para caber, sobreposição minimizada.
- **Navigation flow**: o ato de zoom se torna um ato de **exploração semântica** — aproximar revela identidade, afastar revela estrutura.
