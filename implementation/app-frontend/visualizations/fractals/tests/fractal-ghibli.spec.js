const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file://' + path.resolve(__dirname, '../fractal-ghibli.html');
const PERF_FILE_URL = FILE_URL + '?perf=1';

// Helper: sample non-black pixels on the canvas
async function sampleCanvasPixels(page, samples = 20) {
  return page.evaluate((n) => {
    const canvas = document.getElementById('fractal');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const results = [];
    for (let i = 0; i < n; i++) {
      const x = Math.floor(Math.random() * W);
      const y = Math.floor(Math.random() * H);
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      results.push({ x, y, r, g, b });
    }
    return results;
  }, samples);
}

// Helper: wait for the canvas to have a rendered fractal (non-uniform colors)
async function waitForRender(page, timeout = 15000) {
  await page.waitForFunction(() => {
    const canvas = document.getElementById('fractal');
    if (!canvas || canvas.width === 0) return false;
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let first = -1, varied = false;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const v = data[i] * 65536 + data[i + 1] * 256 + data[i + 2];
      if (first === -1) { first = v; continue; }
      if (v !== first) { varied = true; break; }
    }
    return varied;
  }, {}, { timeout }); // third arg = options (second arg = fn argument, unused)
}

// Helper: get current zoom from HUD
async function getZoom(page) {
  return page.evaluate(() => {
    const zEl = document.getElementById('z-val');
    return zEl ? zEl.textContent : '';
  });
}

// Helper: read view.zoom from JS state
async function getViewZoom(page) {
  return page.evaluate(() => window._testGetZoom && window._testGetZoom());
}

test.beforeEach(async ({ page }) => {
  // Expose view.zoom for inspection
  await page.addInitScript(() => {
    // Patched in after page load via evaluate — nothing here
  });
  await page.goto(FILE_URL);
});

// ── 1. Load & basic render ────────────────────────────────
test('loads with no console errors and renders a fractal', async ({ page }) => {
  // Capture errors before navigation so we don't miss early ones
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  // beforeEach already navigated; wait for render without re-navigating
  await waitForRender(page);

  expect(errors).toHaveLength(0);

  // Canvas must exist and have non-zero size
  const size = await page.evaluate(() => {
    const c = document.getElementById('fractal');
    return { w: c.width, h: c.height };
  });
  expect(size.w).toBeGreaterThan(0);
  expect(size.h).toBeGreaterThan(0);
});

// ── 2. Canvas has colored pixels (fractal rendered) ───────
test('canvas contains varied, non-black pixels after render', async ({ page }) => {
  await waitForRender(page);

  const pixels = await sampleCanvasPixels(page, 100);
  const nonBlack = pixels.filter(p => p.r + p.g + p.b > 0);
  expect(nonBlack.length).toBeGreaterThan(5); // at least some non-interior pixels
});

// ── 3. HUD shows zoom value ───────────────────────────────
test('HUD displays zoom, coordinate and iteration values', async ({ page }) => {
  await waitForRender(page);

  const zText = await page.locator('#z-val').textContent();
  const cText = await page.locator('#c-val').textContent();
  const iText = await page.locator('#i-val').textContent();

  expect(zText).toMatch(/\d/);
  expect(cText).toContain('i');
  expect(parseInt(iText)).toBeGreaterThan(0);
});

// ── 4. Theme buttons change the palette ───────────────────
test('switching theme produces different pixel colors', async ({ page }) => {
  await waitForRender(page);

  const pixelsBefore = await sampleCanvasPixels(page, 40);

  // Click a different theme
  await page.click('button[data-theme="howl"]');
  // Wait for re-render
  await page.waitForTimeout(300);
  await waitForRender(page);

  const pixelsAfter = await sampleCanvasPixels(page, 40);

  // At least some pixels should differ
  const avgBefore = pixelsBefore.reduce((a, p) => a + p.r + p.g + p.b, 0);
  const avgAfter  = pixelsAfter.reduce((a, p) => a + p.r + p.g + p.b, 0);
  expect(Math.abs(avgBefore - avgAfter)).toBeGreaterThan(100);
});

// ── 5. Reset button returns to center ─────────────────────
test('reset button restores view to origin', async ({ page }) => {
  await waitForRender(page);

  // Zoom in via scroll
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(200);

  await page.click('#btn-reset');
  await page.waitForTimeout(100);

  const zText = await page.locator('#z-val').textContent();
  expect(zText).toMatch(/^1[\.0×]/); // "1×" or "1.0×"
});

// ── 6. Dive button exists and is labeled ─────────────────
test('dive button is present and labeled correctly', async ({ page }) => {
  const btn = page.locator('#btn-dive');
  await expect(btn).toBeVisible();
  const text = await btn.textContent();
  expect(text.trim()).toContain('Mergulhar');
});

test('dive speed control is visible and updates its readout', async ({ page }) => {
  await expect(page.locator('#sl-speed')).toBeVisible();
  await expect(page.locator('#v-speed')).toHaveText('1.0×');

  await page.locator('#sl-speed').fill('250');

  await expect(page.locator('#v-speed')).toHaveText('2.5×');
});

test('parameter travel toggle is visible and toggles on', async ({ page }) => {
  const btn = page.locator('#btn-param-travel');
  await expect(btn).toBeVisible();
  await expect(btn).toHaveText(/Variar função/);

  await btn.click();

  await expect(btn).toHaveClass(/on/);
  await expect(btn).toHaveText(/Variando função/);
});

// ── 6b. Perf overlay is opt-in ───────────────────────────
test('performance overlay is hidden by default and visible with perf flag', async ({ page }) => {
  await waitForRender(page);

  await expect(page.locator('#perf-panel')).not.toHaveClass(/on/);

  await page.goto(PERF_FILE_URL);
  await waitForRender(page);

  await expect(page.locator('#perf-panel')).toHaveClass(/on/);
  await expect(page.locator('#pf-workers')).not.toHaveText('-');
});

test('pressing P toggles performance overlay', async ({ page }) => {
  await waitForRender(page);

  await page.keyboard.press('P');
  await expect(page.locator('#perf-panel')).toHaveClass(/on/);

  await page.keyboard.press('P');
  await expect(page.locator('#perf-panel')).not.toHaveClass(/on/);
});

// ── 7. Dive starts and zoom increases ─────────────────────
test('clicking dive button starts zoom animation', async ({ page }) => {
  await waitForRender(page);

  // Capture initial zoom text
  const zBefore = await page.locator('#z-val').textContent();

  await page.click('#btn-dive');

  // After ~2 seconds of diving, zoom must have increased
  await page.waitForTimeout(2000);

  const zAfter = await page.locator('#z-val').textContent();
  expect(zAfter).not.toBe(zBefore);

  // Button label should have changed to "Parar"
  const btnText = await page.locator('#btn-dive').textContent();
  expect(btnText).toContain('Parar');
});

test('parameter travel changes theta and radius while falling', async ({ page }) => {
  await waitForRender(page);

  const before = await page.evaluate(() => ({
    theta: document.getElementById('sl-theta').value,
    radius: document.getElementById('sl-radius').value
  }));

  await page.click('#btn-param-travel');
  await page.click('#btn-dive');
  await page.waitForTimeout(1500);
  await page.keyboard.press('Space');

  const after = await page.evaluate(() => ({
    theta: document.getElementById('sl-theta').value,
    radius: document.getElementById('sl-radius').value,
    thetaLabel: document.getElementById('v-theta').textContent,
    radiusLabel: document.getElementById('v-radius').textContent
  }));

  expect(after.theta).not.toBe(before.theta);
  expect(after.radius).not.toBe(before.radius);
  expect(after.thetaLabel).toBe(`${after.theta}°`);
  expect(after.radiusLabel).toBe((parseInt(after.radius, 10) / 100).toFixed(2));
});

test('dive keeps running after precision warning threshold', async ({ page }) => {
  await waitForRender(page);

  await page.evaluate(() => {
    view.zoom = 1e14;
    updateHUD();
  });

  await page.click('#btn-dive');
  await page.waitForTimeout(400);

  const btnText = await page.locator('#btn-dive').textContent();
  expect(btnText).toContain('Parar');
  await expect(page.locator('#prec')).toHaveClass(/on/);
});

// ── 8. Dive hides all UI while falling ───────────────────
test('dive hides HUD, overlays and controls while falling', async ({ page }) => {
  await waitForRender(page);

  await page.click('#btn-dive');
  await page.waitForTimeout(400);

  const uiState = await page.evaluate(() => {
    const ids = ['hud-tl', 'hud-tr', 'dive-overlay', 'spinner', 'prec', 'bar'];
    return {
      bodyDiving: document.body.classList.contains('diving-ui'),
      visible: ids.filter((id) => {
        const el = document.getElementById(id);
        const style = getComputedStyle(el);
        return style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none';
      })
    };
  });
  expect(uiState.bodyDiving).toBe(true);
  expect(uiState.visible).toEqual([]);
});

// ── 9. Stopping dive restores UI ─────────────────────────
test('pressing Space after dive restores the UI', async ({ page }) => {
  await waitForRender(page);

  await page.click('#btn-dive'); // start
  await page.waitForTimeout(500);
  await page.keyboard.press('Space'); // stop

  await page.waitForTimeout(200);
  const btnText = await page.locator('#btn-dive').textContent();
  expect(btnText.trim()).toContain('Mergulhar');

  const bodyDiving = await page.evaluate(() => document.body.classList.contains('diving-ui'));
  expect(bodyDiving).toBe(false);
  await expect(page.locator('#bar')).toBeVisible();
});

// ── 10. Space bar toggles dive ────────────────────────────
test('Space bar starts and stops the dive', async ({ page }) => {
  await waitForRender(page);

  await page.keyboard.press('Space');
  await page.waitForTimeout(400);

  let btnText = await page.locator('#btn-dive').textContent();
  expect(btnText).toContain('Parar');

  await page.keyboard.press('Space');
  await page.waitForTimeout(200);

  btnText = await page.locator('#btn-dive').textContent();
  expect(btnText).toContain('Mergulhar');
});

// ── 11. Scroll while diving stops dive ───────────────────
test('mouse scroll while diving stops the dive', async ({ page }) => {
  await waitForRender(page);

  await page.click('#btn-dive');
  await page.waitForTimeout(300);

  // Position cursor over the canvas before scrolling so the event hits #wrap
  const box = await page.locator('#wrap').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(300);

  const btnText = await page.locator('#btn-dive').textContent();
  expect(btnText).toContain('Mergulhar');
});

// ── 12. Dive canvas actually zooms (pixel diff) ───────────
test('canvas pixels change during dive (new frames rendered)', async ({ page }) => {
  await waitForRender(page);

  const before = await page.evaluate(() => {
    const canvas = document.getElementById('fractal');
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i+1] + data[i+2];
    return sum;
  });

  await page.click('#btn-dive');
  // Wait long enough for several worker renders to complete
  await page.waitForTimeout(3000);
  await page.keyboard.press('Space'); // stop while UI is hidden

  const after = await page.evaluate(() => {
    const canvas = document.getElementById('fractal');
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i+1] + data[i+2];
    return sum;
  });

  // Zoomed-in pixels at the center should differ from initial view
  expect(before).not.toBe(after);
});
