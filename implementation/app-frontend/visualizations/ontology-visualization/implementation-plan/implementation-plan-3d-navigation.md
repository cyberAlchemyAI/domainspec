---
tags: [vault, visualization, 3d, navigation, camera, implementation]
node_type: implementation-plan
layer: ontology
module: navigation-ux
nature: technical
status: consolidated
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-03-19
---

# Plano de Implementação — Navegação Espacial 3D Avançada

## Objetivo

Substituir a navegação 3D default do `OrbitControls` por um sistema de câmera customizado que implementa:
1. **Quatérnios** para rotação sem gimbal lock
2. **Slerp** para transições suaves de câmera (fly-to arco)
3. **Damping exponencial** para inércia em todos os movimentos
4. **Zoom logarítmico** para precisão variável por distância
5. **Frustum dinâmico** que se ajusta ao layout (shelves/zoom)
6. **Navegação por teclado** (WASD + QE + Shift/Space)
7. **Auto-orbit** opcional para visualização passiva

> **Restrição:** toda implementação é inline no `explorer.template.html`, operando sobre as APIs do Three.js exposta via `graph3d.scene()`, `graph3d.camera()`, `graph3d.renderer()`, e `graph3d.controls()`. Sem dependências adicionais.

---

## Fase 1 — Camera Controller Quaternion-Based

### O que muda
Desabilitamos o `OrbitControls` padrão e implementamos um loop de câmera customizado via `requestAnimationFrame`.

### Detalhes de implementação

#### 1.1 Capturar as referências do Three.js

Após o `graph3d` inicializar, extrair:
```js
const camera = graph3d.camera();
const renderer = graph3d.renderer();
const controls = graph3d.controls();
```

#### 1.2 Desabilitar OrbitControls parcialmente

Em vez de desabilitar completamente (o que quebraria o input), usamos a flag `controls.enableDamping = true` e substituímos o método de rotação:

```js
controls.enableDamping = true;
controls.dampingFactor = 0.06;      // inércia  
controls.rotateSpeed = 0.5;         // mais lento = mais suave
controls.zoomSpeed = 0.8;           // vamos sobrescrever o zoom
controls.enablePan = true;
controls.panSpeed = 0.4;
controls.minPolarAngle = 0.05;      // evita polo norte exato
controls.maxPolarAngle = Math.PI - 0.05; // evita polo sul exato
```

> **Importante:** O `OrbitControls` do Three.js r158 já **usa internamente** coordenadas esféricas (não quatérnios puros), mas com `minPolarAngle` e `maxPolarAngle` evitamos o gimbal lock prático. Para o fly-to usaremos quatérnios explícitos via `THREE.Quaternion.slerp`.

#### 1.3 Zoom Logarítmico via override

Interceptar o evento de scroll para implementar zoom logarítmico:

```js
// Bloquear zoom default do OrbitControls
controls.enableZoom = false;

// Custom zoom handler no canvas do renderer
const domElement = renderer.domElement;
domElement.addEventListener('wheel', (e) => {
  e.preventDefault();
  const camera = graph3d.camera();
  const target = controls.target;
  
  // Distância atual ao target
  const dist = camera.position.distanceTo(target);
  
  // Fator logarítmico: desloca por percentual da dist atual
  const zoomFactor = 0.08; // 8% por scroll step
  const delta = e.deltaY > 0 ? 1 + zoomFactor : 1 - zoomFactor;
  
  // Mover câmera ao longo do eixo camera→target
  const direction = new THREE.Vector3().subVectors(camera.position, target).normalize();
  const newDist = Math.max(20, Math.min(5000, dist * delta));
  camera.position.copy(target).add(direction.multiplyScalar(newDist));
  
  // Atualizar frustum dinâmico
  updateFrustum(newDist);
}, { passive: false });
```

#### 1.4 Frustum Dinâmico

Ajustar `near` e `far` baseado na distância da câmera e no range Z dos shelves:

```js
function updateFrustum(dist) {
  const camera = graph3d.camera();
  const shelfRange = state.shelves
    ? Object.keys(SHELF_SCALES[state.shelfBy] || {}).length * SHELF_GAP
    : 0;
  
  camera.near = Math.max(1, dist * 0.01);
  camera.far  = Math.max(dist * 5, shelfRange * 3, 8000);
  camera.updateProjectionMatrix();
}
```

---

## Fase 2 — Fly-To com Slerp (Arco Quaternion)

### O que muda

Substituir o fly-to linear atual por uma animação baseada em Slerp que interpola a orientação da câmera ao longo do arco mais curto na esfera de visão.

### Código atual (a substituir)
```js
// Linhas 1041-1055 do template
graph3d.cameraPosition(
  { x: node.x + (dx/len)*dist, y: node.y + (dy/len)*dist, z: (node.z||0)+(dz/len)*dist },
  { x: node.x, y: node.y, z: node.z || 0 },
  1200
);
```

### Implementação nova

```js
function flyToNode(node, duration = 1400) {
  const camera = graph3d.camera();
  const controls = graph3d.controls();
  
  // Posição alvo: manter distância de 180 unidades, preservar o ângulo vertical
  const targetPos = new THREE.Vector3(node.x, node.y, node.z || 0);
  const dist = 180;
  
  // Direção atual da câmera ao target atual
  const currentDir = new THREE.Vector3()
    .subVectors(camera.position, controls.target).normalize();
  
  // Nova posição da câmera
  const newCamPos = new THREE.Vector3()
    .copy(targetPos).add(currentDir.multiplyScalar(dist));
  
  // Quaternions: interpolação da orientação
  const startQuat = camera.quaternion.clone();
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  
  // Calcular o quaternion alvo olhando para o novo target
  const tempCamera = camera.clone();
  tempCamera.position.copy(newCamPos);
  tempCamera.lookAt(targetPos);
  const endQuat = tempCamera.quaternion.clone();
  
  const startTime = performance.now();
  
  function animateFlyTo(now) {
    const elapsed = now - startTime;
    // Ease-in-out cubic
    let t = Math.min(1, elapsed / duration);
    t = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    
    // Slerp para rotação
    const q = new THREE.Quaternion();
    THREE.Quaternion.slerp(startQuat, endQuat, q, t);
    camera.quaternion.copy(q);
    
    // Lerp para posição (o arco é dado pelo Slerp da orientação)
    camera.position.lerpVectors(startPos, newCamPos, t);
    controls.target.lerpVectors(startTarget, targetPos, t);
    
    // Frustum dinâmico durante a transição
    const currentDist = camera.position.distanceTo(controls.target);
    updateFrustum(currentDist);
    
    if (t < 1) {
      requestAnimationFrame(animateFlyTo);
    } else {
      controls.update();
    }
  }
  
  requestAnimationFrame(animateFlyTo);
}
```

---

## Fase 3 — Navegação por Teclado

### Bindings

| Tecla | Ação |
|-------|------|
| `W` / `↑` | Mover câmera para frente (em direção ao target) |
| `S` / `↓` | Mover câmera para trás |
| `A` / `←` | Pan esquerda |
| `D` / `→` | Pan direita |
| `Q` | Orbitar anti-horário (yaw esquerda) |
| `E` | Orbitar horário (yaw direita) |
| `Space` | Subir câmera (Y+) |
| `Shift` | Descer câmera (Y-) |
| `R` | Reset: câmera retorna à posição inicial |
| `F` | Focus: fly-to para o nó selecionado |

### Implementação

```js
const keyState = {};
const KEY_SPEED = 2.0;   // unidades por frame
const KEY_DAMPING = 0.9; // inércia do teclado
const velocity = { x: 0, y: 0, z: 0, yaw: 0 };

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  keyState[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', e => {
  keyState[e.key.toLowerCase()] = false;
});

// Dentro do animation loop
function processKeyboardInput() {
  const camera = graph3d.camera();
  const controls = graph3d.controls();
  
  const forward = new THREE.Vector3()
    .subVectors(controls.target, camera.position).normalize();
  const right = new THREE.Vector3()
    .crossVectors(forward, camera.up).normalize();
  
  if (keyState['w'] || keyState['arrowup'])    velocity.z += KEY_SPEED;
  if (keyState['s'] || keyState['arrowdown'])  velocity.z -= KEY_SPEED;
  if (keyState['a'] || keyState['arrowleft'])  velocity.x -= KEY_SPEED;
  if (keyState['d'] || keyState['arrowright']) velocity.x += KEY_SPEED;
  if (keyState[' '])      velocity.y += KEY_SPEED;
  if (keyState['shift'])  velocity.y -= KEY_SPEED;
  
  // Aplicar damping
  velocity.x *= KEY_DAMPING;
  velocity.y *= KEY_DAMPING;
  velocity.z *= KEY_DAMPING;
  
  // Mover câmera e target juntos
  const move = new THREE.Vector3()
    .addScaledVector(forward, velocity.z)
    .addScaledVector(right, velocity.x)
    .addScaledVector(new THREE.Vector3(0, 1, 0), velocity.y);
  
  camera.position.add(move);
  controls.target.add(move);
}
```

---

## Fase 4 — Auto-Orbit (Visualização Passiva)

### Toggle na UI
Adicionar um toggle "Auto-orbit" no painel de controles:
```html
<div class="toggle-row">
  <span>Auto-orbit</span>
  <label class="toggle-switch"><input type="checkbox" id="autoOrbit" /><span class="slider"></span></label>
</div>
```

### Implementação
Rotação lenta em torno do eixo Y com velocidade configurável:
```js
function processAutoOrbit() {
  if (!graph3d || !state.autoOrbit) return;
  const controls = graph3d.controls();
  if (!controls) return;
  const camera = graph3d.camera();
  const speed = state.autoOrbitSpeed !== undefined ? state.autoOrbitSpeed : 0.001;

  // Pure turntable: rotate camera around world Y-axis through the target
  const target = controls.target;
  const offset = new THREE.Vector3().subVectors(camera.position, target);

  // Rotate offset in XZ plane by fixed angle
  const cosA = Math.cos(speed);
  const sinA = Math.sin(speed);
  const newX = offset.x * cosA - offset.z * sinA;
  const newZ = offset.x * sinA + offset.z * cosA;
  offset.x = newX;
  offset.z = newZ;
  // Y stays unchanged — pure horizontal rotation

  camera.position.copy(target).add(offset);
  controls.update();  // sync OrbitControls' internal state
}
```

> **Why `controls.update()` instead of `camera.lookAt()`?** OrbitControls maintains its own internal spherical coordinates. Using `camera.lookAt()` fights the internal state and causes stuttering/direction reversal. `controls.update()` lets OrbitControls adopt the new camera position as ground truth.

---

## Fase 5 — Animation Loop Unificado

### O que muda
Todas as fases convergem num único `requestAnimationFrame` loop que orquestra: damping, keyboard, auto-orbit, frustum.

### Implementação

```js
function startCameraLoop() {
  const animate = () => {
    // 1. Keyboard input
    processKeyboardInput();
    
    // 2. Auto-orbit
    processAutoOrbit();
    
    // 3. Frustum dinâmico
    const dist = graph3d.camera().position.distanceTo(graph3d.controls().target);
    updateFrustum(dist);
    
    // 4. OrbitControls update (aplica damping)
    graph3d.controls().update();
    
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}
```

Chamado uma vez no `initGraph()` quando `state.mode3d` é `true`.

---

## Fase 6 — Indicadores Visuais (HUD)

### Minimap de Orientação
Um cubo wireframe no canto inferior-direito que mostra a orientação relativa da câmera (como os gizmos do Blender/Unity):

```js
// THREE.js helper — AxesHelper no canto do canvas
function createOrientationGizmo() {
  const size = 60;
  const gizmoScene = new THREE.Scene();
  const gizmoCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  gizmoCamera.position.set(0, 0, 3);
  
  const axes = new THREE.AxesHelper(1.2);
  gizmoScene.add(axes);
  
  // Sincronizar rotação com a câmera principal
  function updateGizmo() {
    gizmoCamera.quaternion.copy(graph3d.camera().quaternion);
    graph3d.renderer().setViewport(
      renderer.domElement.width - size - 10, 10, size, size
    );
    graph3d.renderer().render(gizmoScene, gizmoCamera);
    graph3d.renderer().setViewport(0, 0, renderer.domElement.width, renderer.domElement.height);
  }
  return updateGizmo;
}
```

### Zoom Level Indicator
Um badge discreto no canto que mostra o nível de zoom como multiplicador (ex: `×2.4`) para dar feedback de profundidade.

---

## Modificações por Arquivo

### [MODIFY] [explorer.template.html](file:///Users/victorboscaro/house_project/specs/ontology/ontology-visualization/explorer.template.html)

**Seção HTML (após linha ~310):**
- Adicionar toggle `Auto-orbit` no `.quick-bar`
- Adicionar container `#orientation-gizmo` no `#canvas`
- Adicionar badge `#zoom-level` no `#canvas`
- Adicionar `#keyboard-hint` tooltip com keybindings

**Seção CSS (após linha ~112):**
- Estilos para `#zoom-level`, `#keyboard-hint`, `#orientation-gizmo`

**Seção JS — Novo bloco: "Camera Controller" (após linha ~576):**
- `updateFrustum(dist)` — ajuste dinâmico de near/far
- `flyToNode(node, duration)` — fly-to com Slerp
- `processKeyboardInput()` — WASD navigation
- `processAutoOrbit()` — rotação automática
- `startCameraLoop()` — animation loop unificado
- `createOrientationGizmo()` — gizmo de orientação

**Seção JS — Modificação do `initGraph()` (linhas ~857-930):**
- Configurar `controls.enableDamping`, `dampingFactor`, polar angle limits
- Desabilitar `controls.enableZoom` e instalar handler de zoom logarítmico
- Chamar `startCameraLoop()` após inicializar o graph3d
- Substituir o handler de zoom default

**Seção JS — Modificação do `onNodeClick()` (linhas ~1033-1056):**
- Substituir `graph3d.cameraPosition(...)` por `flyToNode(node)`

**Seção JS — State (linha ~423):**
- Adicionar `autoOrbit: false` ao `defaultState()`
- Bumpar `STATE_VERSION` para 11

---

## Ordem de Execução

| Fase | Dependências | Estimativa |
|------|-------------|------------|
| 1. Camera Controller (damping + zoom log + frustum) | Nenhuma | Bloco principal de código |
| 2. Fly-to Slerp | Fase 1 (usa `updateFrustum`) | Refatorar `onNodeClick` |
| 3. Keyboard navigation | Fase 1 (usa `processKeyboardInput` no loop) | Handlers + loop |
| 4. Auto-orbit | Fase 1 (usa loop) | Toggle + rotação |
| 5. Animation loop | Fases 1-4 | Integração |
| 6. HUD (gizmo + zoom indicator) | Fase 5 (usa loop) | Visual polish |

---

## Plano de Verificação

### Testes Visuais no Browser
Não há testes automatizados para esta ferramenta (é uma tool standalone). A verificação é **100% visual e interativa** via browser:

1. **Abrir o explorer em modo 3D** — `http://localhost:8765/specs/ontology/ontology-visualization/explorer.html`, ativar o toggle 3D
2. **Testar zoom logarítmico**: rolar o scroll quando longe (deve mover rápido) e quando perto de um cluster (deve mover devagar). Nunca deve ultrapassar para dentro do nó.
3. **Testar damping**: arrastar para rotacionar e soltar — a câmera deve continuar deslizando suavemente e desacelerar.
4. **Testar gimbal lock**: tentar rotacionar até olhar diretamente de cima para baixo — não deve travar nem pular.
5. **Testar fly-to Slerp**: clicar num nó distante — a câmera deve orbitar em arco suave, não cortar caminho.
6. **Testar teclado**: pressionar WASD para navegar, Space/Shift para subir/descer, R para reset.
7. **Testar auto-orbit**: ativar toggle, confirmar rotação lenta contínua.
8. **Testar frustum dinâmico**: ativar shelves com vários níveis, dar zoom out — nós afastados não devem desaparecer.
9. **Testar preservação de funcionalidade existente**: filtros, sidebar, doc modal, 2D toggle, gravity slider — tudo deve continuar funcionando.

### Verificação Manual (para o usuário)
Após a implementação, o usuário deve:
1. Navegar livremente pelo grafo 3D por ~2 minutos e reportar se a navegação parece "agradável" (sem movimentos bruscos, sem travadas)
2. Clicar em 3-4 nós consecutivos e observar se o fly-to é suave
3. Ativar shelves e verificar se o zoom não corta nós

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[ontology-visualization/discovery-3d-navigation]] | `derives-from` | Discovery que fundamenta este plano |
| [[ontology-visualization/implementation-plan]] | `extends` | Estende o plano de implementação base com navegação avançada |
| [[ontology-visualization/vault-explorer-discovery]] | `contextualizes` | Design original do explorer |
