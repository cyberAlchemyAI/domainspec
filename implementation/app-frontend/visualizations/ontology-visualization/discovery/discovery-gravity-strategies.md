---
tags: [vault, visualization, physics, gravity]
node_type: discovery
layer: ontology
module: physics-model
nature: technical
status: implemented
veracidade: high
convicção: high
version: 1.0.0
last_updated: 2026-04-07
---

# Discovery — Estratégias de Gravidade para o Ontology Explorer

## Contexto

O Explorer **agora implementa múltiplas estratégias** de gravidade selecionáveis para calcular a massa dos nós e configurar a simulação de forças. A massa define diretamente:
- **Tamanho visual** dos nós
- **Força de repulsão** (charge) — nós pesados criam poços gravitacionais mais profundos
- **Distância dos links** — links para nós pesados são mais curtos (órbitas apertadas)
- **Curvatura e partículas** — links com alto diferencial de massa curvam mais
- **Auras e labels** — nós com alta massa normalizada ganham glow e labels persistentes

A estratégia atual é: `mass = (PageRank normalizado × 10) + log(1 + in_degree)`.

Isso funciona mas é apenas **uma perspectiva** do grafo. Diferentes fórmulas de massa revelam diferentes estruturas. O objetivo é implementar **múltiplas estratégias selecionáveis** para o usuário poder comparar e encontrar a que melhor revela a topologia do vault.

---

## Estratégias Propostas

### Strategy 1: PageRank + In-degree (Atual)

**Metáfora:** "Autoridade acadêmica" — quem é mais citado por quem importa.

**Fórmula:**
```
mass = (pagerank / maxPR × α) + log(1 + in_degree)
```

**Parâmetros:**
| Param | Default | Range | Significado |
|-------|---------|-------|-------------|
| `α` (PR Weight) | 10.0 | 1..20 | Peso do PageRank relativo ao in-degree |

**O que revela:** Nós com alta autoridade transitiva (referenciados por nós que são referenciados). Bom para identificar fundações epistêmicas.

**Limitação:** Ignora nós-ponte que conectam clusters sem serem referenciados por muitos.

---

### Strategy 2: Betweenness Centrality + Degree

**Metáfora:** "Infraestrutura rodoviária" — quem é a ponte entre regiões?

**Fórmula:**
```
mass = (betweenness_norm × β) + log(1 + degree)
```

**Parâmetros:**
| Param | Default | Range | Significado |
|-------|---------|-------|-------------|
| `β` (Bridge Weight) | 8.0 | 1..20 | Peso da betweenness relativo ao grau total |

**O que revela:** Nós que são **pontes estruturais** entre clusters. Nós que, se removidos, fragmentariam o grafo. Ex: uma constituição que liga business a architecture.

**Betweenness Centrality** = fração dos caminhos mais curtos entre todos os pares de nós que passam por este nó. O(n²) mas trivial com ~200 nós.

```js
// Brandes' algorithm — O(V·E) para grafos não-ponderados
function computeBetweenness(nodes, links) {
  const C = {};
  nodes.forEach(n => { C[n.id] = 0; });
  nodes.forEach(s => {
    const stack = [], pred = {}, sigma = {}, dist = {};
    nodes.forEach(n => { pred[n.id] = []; sigma[n.id] = 0; dist[n.id] = -1; });
    sigma[s.id] = 1; dist[s.id] = 0;
    const queue = [s.id];
    while (queue.length) {
      const v = queue.shift();
      stack.push(v);
      // neighbors
      const nbrs = [];
      links.forEach(l => {
        const a = l.source?.id || l.source, b = l.target?.id || l.target;
        if (a === v) nbrs.push(b);
        if (b === v) nbrs.push(a);
      });
      nbrs.forEach(w => {
        if (dist[w] < 0) { queue.push(w); dist[w] = dist[v] + 1; }
        if (dist[w] === dist[v] + 1) { sigma[w] += sigma[v]; pred[w].push(v); }
      });
    }
    const delta = {};
    nodes.forEach(n => { delta[n.id] = 0; });
    while (stack.length) {
      const w = stack.pop();
      pred[w].forEach(v => { delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]); });
      if (w !== s.id) C[w] += delta[w];
    }
  });
  // Normalize for undirected
  const max = Math.max(...Object.values(C), 1);
  nodes.forEach(n => { n._betweenness = C[n.id]; n._betweenness_norm = C[n.id] / max; });
}
```

---

### Strategy 3: Degree Puro (Logarítmico)

**Metáfora:** "Popularidade bruta" — quem tem mais conexões?

**Fórmula:**
```
mass = log(1 + degree) × γ
```

**Parâmetros:**
| Param | Default | Range | Significado |
|-------|---------|-------|-------------|
| `γ` (Degree Scale) | 3.0 | 1..10 | Fator de escala do grau |

**O que revela:** A visão mais simples e direta. Hubs imediatos ficam grandes, folhas ficam pequenas. Sem ponderação por qualidade das referências.

**Quando usar:** Quando o PageRank está distorcendo a visualização e você quer ver a topologia pura.

---

### Strategy 4: ForceAtlas2-inspired (Gravity Central)

**Metáfora:** "Sistema solar" — existe uma força puxando tudo para o centro, com nós pesados resistindo mais.

**Fórmula de massa:**
```
mass = (degree + 1) × δ
```

**Diferencial:** Adiciona uma `forceRadial` centralizada que puxa nós leves para o centro, enquanto nós pesados resistem naturalmente (sua repulsão maior compensa). A constante `δ` não só escala a massa mas modula a intensidade da gravidade central.

**Parâmetros:**
| Param | Default | Range | Significado |
|-------|---------|-------|-------------|
| `δ` (Central Gravity) | 0.3 | 0.05..1.0 | Intensidade da força centrípeta |

**O que revela:** Clusters auto-organizados com satélites em órbita. Nós desconectados colapsam para o centro em vez de fugir para o infinito. Inspirado no ForceAtlas2 do Gephi.

**Implementação extra:**
```js
// Adicionar força radial ao d3
graph.d3Force('center', d3.forceRadial(0).strength(n => {
  const mass = n._mass || 1;
  return δ / mass;  // nós leves puxados mais forte para o centro
}));
```

---

### Strategy 5: Curvatura Epistêmica (Weighted by Link Type)

**Metáfora:** "Curvatura do conhecimento" — nem todas as referências são iguais.

**Fórmula:**
```
mass = Σ(w[link_type] × incoming_links_of_type) × ε + log(1 + degree)
```

**Pesos por tipo:**
```js
const LINK_WEIGHTS = {
  // ── Dependências duras (A não existe sem B) ──────────────────────
  'depends-on':      3.5,   // dependência de runtime — o vínculo mais forte
  'implements':      3.5,   // código é o output compilado de uma spec

  // ── Derivação e fundação ─────────────────────────────────────────
  'derives-from':    3.0,   // cadeia pai→filho canônica
  'grounds':         2.5,   // inverso de derives-from — declara a fundação teórica
  'resolves':        2.5,   // fecha um problema em aberto — vínculo de encerramento

  // ── Evidência e validação ────────────────────────────────────────
  'validates':       2.5,   // fornece evidência, aumenta veracidade

  // ── Estrutura e refinamento ──────────────────────────────────────
  'contradicts':     2.0,   // vínculo adversarial mas forte — deve ser resolvido
  'refines':         2.0,   // profundidade incremental, mesmo tópico

  // ── Referência concreta ──────────────────────────────────────────
  'supersedes':      1.5,   // sucessão estrutural — torna B obsoleto
  'exemplifies':     1.5,   // instância concreta de um abstrato

  // ── Vínculo fraco / temporal ─────────────────────────────────────
  'updates':         1.2,   // mudança incremental de versão
  'contextualizes':  1.0,   // apenas contexto informacional, sem dependência
  'deprecates':      1.0,   // aposentadoria suave de B

  // ── Exploratório / descartado ────────────────────────────────────
  'questions':       0.8,   // levanta dúvida sem resolver
  'alternative-to':  0.5,   // caminho descartado — o vínculo epistêmico mais fraco
};
```

**Parâmetros:**
| Param | Default | Range | Significado |
|-------|---------|-------|-------------|
| `ε` (Type Weight Scale) | 1.0 | 0.5..3.0 | Fator multiplicativo sobre os pesos semânticos |

**O que revela:** A importância real considerando que `derives-from` é muito mais forte que `contextualizes`. Um nó com 3 `derives-from` incoming pesa mais que um com 10 `contextualizes`.

---

### Strategy 6: Hierarchical Orbital Gravity (N-Body)

**Metáfora:** "Sistemas Estelares" — hubs pesados são estrelas que atraem nós leves para suas órbitas, mas repelem outras estrelas.

**Diferencial:** Não apenas altera a fórmula de massa, mas modifica as forças do d3. A atração orbital é determinada **primariamente pelas conexões declaradas**, não por proximidade espacial. O tipo do link define a distância orbital: vínculos fortes (`derives-from`) resultam em órbitas apertadas; vínculos fracos (`contextualizes`) em órbitas largas. Nós sem conexões recorrem à atração por proximidade como fallback — eles derivam em direção ao corpo mais pesado próximo, o que é epistemicamente honesto: "este documento existe perto deste domínio mas não declarou sua posição."

**Hierarquia de atração:**
1. **Conexão declarada** → o nó orbita seu vizinho pesado mais próximo *dentre seus nós conectados*
2. **Sem conexões** → atração por proximidade espacial pura (fallback)

**Raio orbital por tipo de link** (herdando pesos da Curvatura Epistêmica — peso maior = órbita mais apertada):
```
depends-on      → raio mínimo       (colado à estrela — sem B, A não funciona)
implements      → raio mínimo       (código não existe sem a spec)
derives-from    → raio muito curto  (cadeia pai→filho canônica)
grounds         → raio muito curto  (fundação teórica declarada)
resolves        → raio curto        (encerramento de problema em aberto)
validates       → raio curto        (evidência — próximo do que valida)
contradicts     → raio médio-curto  (tensão: puxado mas não colapsado)
refines         → raio médio-curto  (profundidade incremental)
supersedes      → raio médio        (sucessão estrutural)
exemplifies     → raio médio        (instância concreta)
updates         → raio médio-longo  (vínculo temporal fraco)
contextualizes  → raio longo        (apenas contexto, sem dependência)
deprecates      → raio longo        (aposentadoria suave)
questions       → raio muito longo  (explora, não ancora)
alternative-to  → raio máximo       (caminho descartado — quase em deriva)
sem link        → raio livre        (deriva pura — sem posição declarada)
```

**O que o raio orbital codifica:** a força epistêmica da dependência. Um documento em órbita apertada de uma constituição é estruturalmente dependente dela. Um documento em órbita larga está relacionado, mas de forma frouxa. Um nó em deriva livre ainda não declarou sua posição no grafo.

**Massa:** herdada da Curvatura Epistêmica — o peso de cada nó é ganho através da qualidade dos links que recebe, não apenas pela contagem. Isso garante que as estrelas que se formam *merecem* sua posição gravitacional.

**Parâmetros propostos:**
- `Orbital Radius Base`: Fator multiplicativo sobre os raios por tipo de link.
- `Hub Interaction`: Define a fraqueza da conexão entre nós super-pesados (evita colapso de estrelas).
- `Drift Strength`: Intensidade da atração por proximidade para nós órfãos.

**O que revela:** Estrutura epistêmica em camadas — estrelas (fundações), planetas (documentos com dependências fortes), luas (contextualizações), e matéria à deriva (documentos ainda não integrados). À medida que o vault cresce e conexões são declaradas, nós em deriva são *capturados* por sistemas solares existentes. A emergência do conhecimento fica visível como captura gravitacional ao longo do tempo.

---

## Design da UI

### Seletor de Estratégia

No painel lateral, abaixo do slider de G, adicionar um dropdown:

```
┌─────────────────────────────────────────┐
│  Gravity (G)               1.0          │
│  ═══════════════════■═══════            │
│                                         │
│  Layout Strategy    [PageRank + In ▾]   │
│                                         │
│  PR Weight (α)             10.0         │
│  ═══════════════════■═══════            │
└─────────────────────────────────────────┘
```

Ao trocar de estratégia:
1. O slider inferior muda para o parâmetro da estratégia selecionada
2. A massa é recalculada para todos os nós
3. A simulação é reaquecida (`d3ReheatSimulation`)

### State

```js
// Adicionar ao defaultState():
gravityStrategy: 'pagerank_indegree',  // id da strategy
strategyParam: 10.0,                    // valor do parâmetro específico
```

---

## Resumo Comparativo

| Strategy | Parâmetro | O que enfatiza | Quando usar |
|----------|-----------|----------------|-------------|
| PageRank + In-degree | α (PR Weight) | Autoridade transitiva | Visão default, hierarquia de influência |
| Betweenness + Degree | β (Bridge Weight) | Pontes estruturais | Encontrar nós críticos para coesão |
| Degree Puro | γ (Degree Scale) | Conectividade bruta | Topologia sem viés de qualidade |
| ForceAtlas2 (Gravity Central) | δ (Central Gravity) | Clusters com órbitas | Grafos com componentes desconectados |
| Curvatura Epistêmica | ε (Type Weight Scale) | Qualidade semântica dos links | Quando types de link são bem definidos |
| Hierarchical Orbital | Orbital Range | Sistemas solares semânticos com raio por tipo de link | Observar emergência: nós órfãos capturados por sistemas ao longo do tempo |

---

## Referências Técnicas

- **Barnes-Hut**: Usado internamente pelo d3-force para calcular N-body repulsion em O(n log n). O Explorer herda isso gratuitamente.
- **ForceAtlas2** (Jacomy et al., 2014): Inspiração para a Strategy 4. Paper: "ForceAtlas2, a Continuous Graph Layout Algorithm for Handy Network Visualization."
- **Brandes' algorithm** (Brandes, 2001): Para betweenness centrality em O(V·E). Paper: "A Faster Algorithm for Betweenness Centrality."
- **D3-force**: A engine subjacente (`d3.forceManyBody`, `d3.forceLink`, `d3.forceRadial`). Docs: https://d3js.org/d3-force

---

## Status de Implementação (2026-04-07)

✅ **Todas as 6 estratégias foram implementadas no explorer.html**:

| Estratégia | Status | UI | Funcionalidade |
|-----------|--------|----|----|
| PageRank + In-degree | ✅ Ativa | Slider (α) | Mass cálculo + força |
| Betweenness + Degree | ✅ Ativa | Slider (β) | Mass cálculo + força |
| Degree Puro | ✅ Ativa | Slider (γ) | Mass cálculo + força |
| ForceAtlas2 (Central) | ✅ Ativa | Slider (δ) | Mass cálculo + força radial |
| Curvatura Epistêmica | ✅ Ativa | Slider (ε) | Mass cálculo (weighted by link type) |
| **Hierarchical Orbital** | ✅ **Ativa** | **Slider radius + orphan drift** | **Orbital mechanics com hub selection** |

### Novos Recursos Adicionados
- **Hierarchical Orbital Gravity (Strategy 6)**: Implementado conforme especificação, com seleção de hub baseada em `edgeStrength × hubMass`
- **Node Size Scaling by Mass**: Parâmetro adicional para controlar variação de tamanho (0–3.0)
- **UI Enhancements**: Dois novos sliders no painel lateral (Orphan Drift Strength, Node Size by Mass)

---

## Parameter Smoothness Update (2026-04-07)

**Improvement:** All parameter sliders now provide smooth, real-time feedback during dragging.

**What changed:**
- **Base Orbital Radius** slider now updates orbital distances smoothly while dragging (previously only on release)
- **Orphan Drift Strength** slider provides real-time visual feedback during adjustment
- **Node Size by Mass** slider shows live size changes as user drags

**Implementation:** Throttled `oninput` handlers (100ms) that apply physics recalculation during drag, with final update on release. This maintains responsiveness while preventing excessive simulation recalculation.

**Result:** Parameter tuning is now smooth and intuitive instead of feeling frozen until slider release.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[ontology-visualization/implementation-plan]] | `extends` | Este discovery gera mudanças no explorer |
| [[ontology-visualization/vault-explorer-discovery]] | `derives-from` | Design original do explorer |
| [[ontology-visualization/discovery-3d-navigation]] | `contextualizes` | Discovery de navegação 3D que opera sobre o mesmo physics model |
