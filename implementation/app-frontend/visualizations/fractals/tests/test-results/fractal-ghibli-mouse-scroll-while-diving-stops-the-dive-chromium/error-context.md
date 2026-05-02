# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fractal-ghibli.spec.js >> mouse scroll while diving stops the dive
- Location: fractal-ghibli.spec.js:311:1

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Mergulhar"
Received string:    "■ Parar"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic:
      - generic:
        - strong: Conjunto de Julia · Explorador Infinito
        - text: Scroll = zoom | Drag = navegar
        - text: Simetria 180° ao redor de (0, 0)
    - generic:
      - generic [ref=e4]:
        - text: Zoom atual relativo à vista inicial.\n10K× significa 10.000 vezes mais próximo. zoom
        - emphasis [ref=e5]: 2.6×
      - generic [ref=e6]:
        - text: Centro da vista no plano complexo.\n(0 + 0i) é o centro de simetria do fractal. c =
        - emphasis [ref=e7]: 0.075755 + 0.039871i
      - generic [ref=e8]:
        - text: Iterações reais usadas neste frame.\nAumenta automaticamente com zoom mais profundo. iter
        - emphasis [ref=e9]: "180"
    - generic:
      - generic: ▼ MERGULHANDO
      - generic: 3× de profundidade
    - generic: Calculando…
    - generic: ⚠ Limite de precisão de ponto flutuante — pixels podem aparecer blocados
    - generic:
      - strong: perf
      - generic:
        - text: workers
        - emphasis: "8"
      - generic:
        - text: preview
        - emphasis: "-"
      - generic:
        - text: full
        - emphasis: "-"
      - generic:
        - text: commit
        - emphasis: "-"
      - generic:
        - text: drops/5s
        - emphasis: "0"
  - generic:
    - generic:
      - generic:
        - generic:
          - generic: Espírito — ângulo θ da constante c = r·e^(iθ).\nMuda a 'personalidade' do fractal.\n270° = seahorse clássico · 0° = dendrito · 100° = espiral Espírito
          - generic: 270°
        - slider: 270 Gira e transforma a forma do fractal.\nCada ângulo revela um personagem diferente.
        - generic: ângulo θ de c · 0–360°
      - generic:
        - generic:
          - generic: Profundidade — base de iterações por pixel.\nZoom profundo aumenta automaticamente para manter detalhes.\nValor real mostrado no HUD (iter). Profundidade
          - generic: "160"
        - slider: 160 Define a riqueza de detalhe.\nMaior = mais lento mas mais nítido.
        - generic: iterações base · 50–600
      - generic:
        - generic:
          - generic: Essência — raio r de c = r·e^(iθ).\n0.0 = círculo perfeito (trivial)\n~0.75 = fractal conectado e orgânico\n> 1.0 = fragmentado e caótico Essência
          - generic: "0.76"
        - slider: 76 Controla o 'peso' da constante c.\n0.7–1.0 dá as formas mais ricas.
        - generic: raio r de c · 0.0–1.5
      - generic:
        - generic:
          - generic: Velocidade da queda automática.\nBaixo = contemplativo · alto = queda agressiva.\nPode ser alterada enquanto mergulha. Queda
          - generic: 1.0×
        - slider: 100 Controla o multiplicador de zoom por frame durante o mergulho.
        - generic: velocidade do mergulho · 0.2–4.0×
    - generic:
      - button "Totoro — verdes de floresta\\nMeu Vizinho Totoro (1988) Totoro"
      - button "Spirited Away — ouro de lanterna\\nA Viagem de Chihiro (2001) Chihiro"
      - button "Mononoke — floresta e sangue\\nPrincess Mononoke (1997) Mononoke"
      - button "Howl — índigo e violeta arcano\\nO Castelo Animado (2004) Howl"
      - button "Nausicaä — azul-céu e vento cerúleo\\nNausicaä do Vale do Vento (1984) Nausicaä"
    - generic:
      - 'button "Enquanto mergulha, anima θ e r suavemente pelo espaço de parâmetros.\\nUse antes de iniciar a queda.\\nAtalho: A ✦ Variar função"'
      - button "Queda infinita no fractal.\\nProcura uma borda visual e cai em direção a ela.\\nPressione novamente para parar. ■ Parar" [active]
      - button "Volta ao centro (0,0) e zoom inicial.\\nBom ponto de partida para explorar. ↺ Resetar Vista"
      - generic:
        - text: scroll = zoom · drag = navegar
        - text: pinch = zoom (touch)
    - generic:
      - generic:
        - generic: Carregue um arquivo de áudio (mp3, wav, ogg, m4a).\nO espectro modula θ, raio, iterações e queda. ♪ Áudio
        - button "Para a reprodução e libera o AudioContext. ■ Parar áudio"
      - generic:
        - generic:
          - generic:
            - generic: Sub-grave (20–150 Hz). Modula a velocidade de queda durante o mergulho. SubGrave
            - generic: 100%
          - slider: 100 Sensibilidade da banda sub-grave.
          - generic: → Queda
        - generic:
          - generic:
            - generic: Grave (150–500 Hz). Modula o raio (essência) ao redor de 0.76. Grave
            - generic: 100%
          - slider: 100 Sensibilidade da banda grave.
          - generic: → Essência
        - generic:
          - generic:
            - generic: Médio (500–2000 Hz). Modula o ângulo θ (espírito) ao redor de 270°. Médio
            - generic: 100%
          - slider: 100 Sensibilidade da banda média.
          - generic: → Espírito
        - generic:
          - generic:
            - generic: Agudo (2–8 kHz). Modula a profundidade de iterações. Agudo
            - generic: 100%
          - slider: 100 Sensibilidade da banda aguda.
          - generic: → Profundidade
        - generic:
          - generic:
            - generic: Cena ambiente — escala vinheta, brilho do HUD, névoa, balanço de câmera e partículas de borda.\n0% = só o fractal · 100% = cena cheia. Ambiente
            - generic: 60%
          - slider: 60 Intensidade global da cena ambiente (todos os elementos periféricos).
          - generic: → Cena (vinheta · partículas · névoa)
```

# Test source

```ts
  224 | 
  225 |   const after = await page.evaluate(() => ({
  226 |     theta: document.getElementById('sl-theta').value,
  227 |     radius: document.getElementById('sl-radius').value,
  228 |     thetaLabel: document.getElementById('v-theta').textContent,
  229 |     radiusLabel: document.getElementById('v-radius').textContent
  230 |   }));
  231 | 
  232 |   expect(after.theta).not.toBe(before.theta);
  233 |   expect(after.radius).not.toBe(before.radius);
  234 |   expect(after.thetaLabel).toBe(`${after.theta}°`);
  235 |   expect(after.radiusLabel).toBe((parseInt(after.radius, 10) / 100).toFixed(2));
  236 | });
  237 | 
  238 | test('dive keeps running after precision warning threshold', async ({ page }) => {
  239 |   await waitForRender(page);
  240 | 
  241 |   await page.evaluate(() => {
  242 |     view.zoom = 1e14;
  243 |     updateHUD();
  244 |   });
  245 | 
  246 |   await page.click('#btn-dive');
  247 |   await page.waitForTimeout(400);
  248 | 
  249 |   const btnText = await page.locator('#btn-dive').textContent();
  250 |   expect(btnText).toContain('Parar');
  251 |   await expect(page.locator('#prec')).toHaveClass(/on/);
  252 | });
  253 | 
  254 | // ── 8. Dive hides all UI while falling ───────────────────
  255 | test('dive hides HUD, overlays and controls while falling', async ({ page }) => {
  256 |   await waitForRender(page);
  257 | 
  258 |   await page.click('#btn-dive');
  259 |   await page.waitForTimeout(400);
  260 | 
  261 |   const uiState = await page.evaluate(() => {
  262 |     const ids = ['hud-tl', 'hud-tr', 'dive-overlay', 'spinner', 'prec', 'bar'];
  263 |     return {
  264 |       bodyDiving: document.body.classList.contains('diving-ui'),
  265 |       visible: ids.filter((id) => {
  266 |         const el = document.getElementById(id);
  267 |         const style = getComputedStyle(el);
  268 |         return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
  269 |       })
  270 |     };
  271 |   });
  272 |   expect(uiState.bodyDiving).toBe(true);
  273 |   expect(uiState.visible).toEqual([]);
  274 | });
  275 | 
  276 | // ── 9. Stopping dive restores UI ─────────────────────────
  277 | test('pressing Space after dive restores the UI', async ({ page }) => {
  278 |   await waitForRender(page);
  279 | 
  280 |   await page.click('#btn-dive'); // start
  281 |   await page.waitForTimeout(500);
  282 |   await page.keyboard.press('Space'); // stop
  283 | 
  284 |   await page.waitForTimeout(200);
  285 |   const btnText = await page.locator('#btn-dive').textContent();
  286 |   expect(btnText.trim()).toContain('Mergulhar');
  287 | 
  288 |   const bodyDiving = await page.evaluate(() => document.body.classList.contains('diving-ui'));
  289 |   expect(bodyDiving).toBe(false);
  290 |   await expect(page.locator('#bar')).toBeVisible();
  291 | });
  292 | 
  293 | // ── 10. Space bar toggles dive ────────────────────────────
  294 | test('Space bar starts and stops the dive', async ({ page }) => {
  295 |   await waitForRender(page);
  296 | 
  297 |   await page.keyboard.press('Space');
  298 |   await page.waitForTimeout(400);
  299 | 
  300 |   let btnText = await page.locator('#btn-dive').textContent();
  301 |   expect(btnText).toContain('Parar');
  302 | 
  303 |   await page.keyboard.press('Space');
  304 |   await page.waitForTimeout(200);
  305 | 
  306 |   btnText = await page.locator('#btn-dive').textContent();
  307 |   expect(btnText).toContain('Mergulhar');
  308 | });
  309 | 
  310 | // ── 11. Scroll while diving stops dive ───────────────────
  311 | test('mouse scroll while diving stops the dive', async ({ page }) => {
  312 |   await waitForRender(page);
  313 | 
  314 |   await page.click('#btn-dive');
  315 |   await page.waitForTimeout(300);
  316 | 
  317 |   // Position cursor over the canvas before scrolling so the event hits #wrap
  318 |   const box = await page.locator('#wrap').boundingBox();
  319 |   await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  320 |   await page.mouse.wheel(0, -200);
  321 |   await page.waitForTimeout(300);
  322 | 
  323 |   const btnText = await page.locator('#btn-dive').textContent();
> 324 |   expect(btnText).toContain('Mergulhar');
      |                   ^ Error: expect(received).toContain(expected) // indexOf
  325 | });
  326 | 
  327 | // ── 12. Dive canvas actually zooms (pixel diff) ───────────
  328 | test('canvas pixels change during dive (new frames rendered)', async ({ page }) => {
  329 |   await waitForRender(page);
  330 | 
  331 |   const before = await page.evaluate(() => {
  332 |     const canvas = document.getElementById('fractal');
  333 |     const ctx = canvas.getContext('2d');
  334 |     const data = ctx.getImageData(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100).data;
  335 |     let sum = 0;
  336 |     for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i+1] + data[i+2];
  337 |     return sum;
  338 |   });
  339 | 
  340 |   await page.click('#btn-dive');
  341 |   // Wait long enough for several worker renders to complete
  342 |   await page.waitForTimeout(3000);
  343 |   await page.keyboard.press('Space'); // stop while UI is hidden
  344 | 
  345 |   const after = await page.evaluate(() => {
  346 |     const canvas = document.getElementById('fractal');
  347 |     const ctx = canvas.getContext('2d');
  348 |     const data = ctx.getImageData(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100).data;
  349 |     let sum = 0;
  350 |     for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i+1] + data[i+2];
  351 |     return sum;
  352 |   });
  353 | 
  354 |   // Zoomed-in pixels at the center should differ from initial view
  355 |   expect(before).not.toBe(after);
  356 | });
  357 | 
```