---
tags: [vault, visualization, 3d, navigation, camera]
node_type: discovery
layer: ontology
module: navigation-ux
nature: technical
status: consolidated
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-03-19
---

# Discovery — Arquitetura de Navegação Espacial 3D para o Ontology Explorer

## Contexto e Motivação

O ZefraHub Ontology Explorer é uma aplicação standalone de visualização 3D do knowledge graph do vault. Ele usa a biblioteca `3d-force-graph` (que internamente delega a renderização ao Three.js e a câmera ao `OrbitControls`) para exibir nós e arestas num espaço tridimensional.

Na sessão anterior (`c853a7dd`), implementamos um modelo de **física gravitacional** — massa baseada em PageRank + In-degree, constante G ajustável, partículas direcionais nos links, curvatura proporcional ao diferencial de massa, e fly-to ao clicar nós. Isso deu ao grafo uma **estrutura visual com sentido** (hubs densos, satélites orbitando).

Porém a **navegação** no espaço 3D — a experiência de se mover, rotacionar, dar zoom e transitar entre pontos de interesse — ainda é completamente delegada aos defaults do `OrbitControls` do Three.js. Isso gera problemas reais de UX:

---

## Diagnóstico: Problemas Atuais da Navegação

### 1. Rotação com Ângulos de Euler → Risco de Gimbal Lock
O `OrbitControls` usa internamente coordenadas esféricas (phi/theta), que são uma variante dos ângulos de Euler. Quando o observador olha diretamente para cima ou para baixo (phi ≈ 0 ou π), a rotação trava ou pula abruptamente — o infame **Gimbal Lock**. No grafo 3D com shelves (bandas Z), esse cenário é frequente: o usuário tenta olhar "de cima para baixo" entre as camadas e a câmera trava.

### 2. Ausência de Amortecimento (Damping) Significativo
O `OrbitControls` tem um `enableDamping` opcional, mas o `3d-force-graph` não o configura por padrão. Resultado: os movimentos de pan e rotação terminam abruptamente, dando uma sensação robótica. A falta de inércia destrói a ilusão de espaço.

### 3. Zoom Linear em vez de Logarítmico
O zoom padrão é linear: cada clique de scroll move a câmera pela mesma distância, independente de quão perto ou longe o observador está. Ao mergulhar num cluster denso, o usuário ultrapassa rapidamente e perde o nó-alvo. Ao se afastar para ver o grafo inteiro, o zoom é lento demais.

### 4. Fly-to Básico sem Slerp
O fly-to implementado (ao clicar um nó em 3D) usa `graph3d.cameraPosition()` com interpolação linear sobre 1200ms. Isso funciona, mas a transição não segue o arco mais curto da esfera de visão — em rotações de ângulo grande, o caminho é reto no espaço cartesiano em vez de curvo na superfície da esfera. O efeito é que a câmera "corta caminho" pelo interior do grafo em vez de orbitar suavemente ao redor.

### 5. Frustum Sem Gestão
O `near/far` planes do frustum são definidos uma vez e nunca ajustados. Quando o grafo tem shelves com SHELF_GAP de 150px e muitos níveis, nós em Z distante simplesmente desaparecem (são clippados pelo far plane). Nenhum ajuste dinâmico é feito ao mudar o layout.

---

## Princípios do Modelo de Câmera Sintética

A teoria que sustenta uma navegação 3D fluida se baseia em conceitos bem estabelecidos:

### Pipeline de Transformação
Todo ponto visível passa pela cadeia:
$$P' = M_{projection} \cdot M_{view} \cdot M_{model} \cdot P$$

O `3d-force-graph` + Three.js já cuida desse pipeline internamente. O que precisamos melhorar é a **construção de $M_{view}$** (a matriz da câmera) e os **parâmetros de $M_{projection}$** (near, far, FOV).

### Quatérnios para Rotação
Quatérnios representam rotações como um vetor em 4D (um escalar + três componentes imaginárias). Descobertos por Hamilton em 1843, eles:
- **Evitam Gimbal Lock** — composição de rotações arbitrárias sem degeneração.
- **Permitem Slerp** — Spherical Linear Interpolation, a interpolação mais suave possível entre duas orientações.
- **São computacionalmente eficientes** — normalização simples, composição por multiplicação.

### Slerp (Spherical Linear Interpolation)
Para transições de câmera (fly-to), em vez de interpolar posição linearmente, interpolamos a **orientação** da câmera usando Slerp entre o quatérnio atual e o quatérnio alvo. O resultado é um arco suave na superfície da esfera de visão.

### Damping (Amortecimento)
Um buffer de input com desaceleração exponencial: o input do usuário define uma **velocidade alvo** que a câmera persegue com um fator de damping (ex: `0.05` por frame). Isso cria inércia — a câmera desliza suavemente após o input parar.

### Sensibilidade Logarítmica de Zoom
A velocidade de zoom deve ser proporcional à distância atual:
$$\Delta d = d_{current} \cdot k \cdot scroll$$
Quem está perto se move devagar (precisão). Quem está longe se move rápido (eficiência).

---

## Aplicabilidade ao Explorer Atual

### O que já temos que é bom
| Aspecto | Estado Atual | Qualidade |
|---------|-------------|-----------|
| Modelo de física (massa, gravidade, partículas) | Implementado via d3-force | ✅ Excelente |
| Fly-to ao clicar nó | `cameraPosition()` com 1200ms | 🟡 Funcional mas linear |
| Shelves (Z-axis por metadata) | Z fixo por `SHELF_GAP * ordinal` | ✅ Funciona |
| Aura de gravidade 3D (glow) | `THREE.AdditiveBlending` | ✅ Visual forte |

### O que precisa melhorar
| Problema | Impacto UX | Solução |
|----------|------------|---------|
| Rotação trava ao olhar vertical | Frustração, desorientação | Quatérnios |
| Movimentos robóticos, sem inércia | Parece "jogo antigo" | Damping exponencial |
| Zoom impreciso | Overshoot em clusters | Zoom logarítmico |
| Fly-to corta caminho pelo grafo | Perde contexto espacial | Slerp com arco |
| Nós distantes somem | Frustrum clip invisível | Frustum dinâmico |
| Sem keyboard navigation | Acessibilidade zero | WASD + QE + Shift/Space |

---

## Restrições Técnicas

1. **Sem refatoração da biblioteca base**: `3d-force-graph` é uma dep CDN. Não vamos forkar. Todas as melhorias devem operar sobre a instância Three.js exposta via `graph3d.scene()`, `graph3d.camera()`, e `graph3d.renderer()`.

2. **Three.js ≥ r158 já suporta quatérnios**: `THREE.Quaternion`, `THREE.Quaternion.slerp()`, e `camera.quaternion` estão disponíveis na versão carregada.

3. **Sem build step**: toda implementação é inline no HTML template.

4. **Performance**: o grafo tem ~200 nós e ~300 arestas. A câmera opera a 60fps sem problemas. O overhead de quatérnios é insignificante.

---

## Conclusão

Os princípios de Navegação Espacial 3D (Câmera Sintética, Quatérnios, Slerp, Damping, Zoom Logarítmico, Frustum Dinâmico) são **diretamente aplicáveis** ao estado atual do Ontology Explorer. A implementação atual delega tudo ao `OrbitControls` padrão, que é suficiente para demos simples mas inadequado para navegação prolongada num espaço 3D com topologia complexa (clusters, shelves, hubs gravitacionais).

A melhoria proposta não requer mudança de biblioteca nem build system — tudo é implementável com hooks nas APIs já expostas pelo Three.js (`camera.quaternion`, `Quaternion.slerp`, `camera.near/far`, `requestAnimationFrame`).

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[ontology-visualization/vault-explorer-discovery]] | `derives-from` | Documento original de design do explorer |
| [[ontology-visualization/implementation-plan]] | `contextualizes` | Plano de implementação do explorer base |
