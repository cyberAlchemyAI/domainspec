// @source internal_tools/visualizations/fractals/docs/SPEC.md#audioreactivity-inline
// @stories US-7, US-8, US-9, US-10, US-11, US-12, US-13, US-14
// @testSpec internal_tools/visualizations/fractals/docs/TEST-SPEC.md
//
// Scaffold for AudioReactivity capability tests (T-AR-1 through T-AR-22).
// All tests are currently SKIPPED — they fail by design until the
// implementation lands. Each test references its acceptance criterion
// (`@ac`), story (`@story`), and TEST-SPEC ID (`@testId`).
//
// Required implementation hooks (see TEST-SPEC.md "Implementation Test Hooks"):
//   - window._testGetAudioState()
//   - window._testInjectBandEnergies({subBass, bass, mid, treble})
//   - window._testTriggerBeat()
//   - window._testGetRenderScheduleRate()
// Hooks must be activated by `?test=1` query param.
//
// Required fixtures:
//   - tests/fixtures/test-audio.mp3 (≤ 5 s clip with audible bass + treble)

const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file://' + path.resolve(__dirname, '../fractal-ghibli.html');
const TEST_FILE_URL = FILE_URL + '?test=1';
const FIXTURE_AUDIO = path.resolve(__dirname, 'fixtures/test-audio.wav');

const BAND_ZERO = { subBass: 0, bass: 0, mid: 0, treble: 0 };
const BAND_FULL = { subBass: 1, bass: 1, mid: 1, treble: 1 };

async function waitForRender(page, timeout = 15000) {
  await page.waitForFunction(() => {
    const canvas = document.getElementById('fractal');
    if (!canvas || canvas.width === 0) return false;
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let first = -1;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const v = data[i] * 65536 + data[i + 1] * 256 + data[i + 2];
      if (first === -1) { first = v; continue; }
      if (v !== first) return true;
    }
    return false;
  }, {}, { timeout });
}

async function readSliders(page) {
  return page.evaluate(() => ({
    theta: parseFloat(document.getElementById('sl-theta').value),
    radius: parseInt(document.getElementById('sl-radius').value, 10) / 100,
    iterBase: parseInt(document.getElementById('sl-iter').value, 10),
    diveSpeed: parseInt(document.getElementById('sl-speed').value, 10) / 100,
  }));
}

test.describe('AudioReactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_FILE_URL);
    await waitForRender(page);
  });

  // ── US-7: Explorer loads a song and the fractal moves with it ────────────

  /**
   * @testId T-AR-1
   * @story US-7
   * @ac SPEC AC #16
   */
  test('T-AR-1: file picker accepts an audio file and creates an AudioContext', async ({ page }) => {
    const before = await page.evaluate(() => window._testGetAudioState());
    expect(before.state).toBe('idle');

    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);

    const after = await page.evaluate(() => window._testGetAudioState());
    expect(['loaded', 'playing']).toContain(after.state);
  });

  /**
   * @testId T-AR-2
   * @story US-7
   * @ac SPEC AC #16
   */
  test('T-AR-2: loading audio transitions AudioReactivityState idle → loaded', async ({ page }) => {
    const before = await page.evaluate(() => window._testGetAudioState());
    expect(before.state).toBe('idle');

    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);

    await expect.poll(async () =>
      (await page.evaluate(() => window._testGetAudioState())).state
    ).toBe('loaded');
  });

  // ── US-8: Each band drives only its assigned parameter ────────────────────

  /**
   * @testId T-AR-3
   * @story US-8
   * @ac SPEC AC #17
   */
  test('T-AR-3: SubBass energy modulates diveSpeed only', async ({ page }) => {
    const baseline = await readSliders(page);

    const after = await page.evaluate((energies) =>
      window._testInjectBandEnergies(energies),
      { ...BAND_ZERO, subBass: 1 }
    );

    expect(after.diveSpeed).toBeGreaterThan(baseline.diveSpeed);
    expect(after.theta).toBeCloseTo(baseline.theta, 1);
    expect(after.radius).toBeCloseTo(baseline.radius, 2);
    expect(after.iterBase).toBe(baseline.iterBase);
  });

  /**
   * @testId T-AR-4
   * @story US-8
   * @ac SPEC AC #17
   */
  test('T-AR-4: Bass energy modulates radius only', async ({ page }) => {
    const baseline = await readSliders(page);

    const after = await page.evaluate((energies) =>
      window._testInjectBandEnergies(energies),
      { ...BAND_ZERO, bass: 1 }
    );

    expect(after.radius).not.toBeCloseTo(baseline.radius, 3);
    expect(after.theta).toBeCloseTo(baseline.theta, 1);
    expect(after.iterBase).toBe(baseline.iterBase);
    expect(after.diveSpeed).toBe(baseline.diveSpeed);
  });

  /**
   * @testId T-AR-5
   * @story US-8
   * @ac SPEC AC #17
   */
  test('T-AR-5: Mid energy modulates theta only', async ({ page }) => {
    const baseline = await readSliders(page);

    const after = await page.evaluate((energies) =>
      window._testInjectBandEnergies(energies),
      { ...BAND_ZERO, mid: 1 }
    );

    expect(after.theta).not.toBeCloseTo(baseline.theta, 1);
    expect(after.radius).toBeCloseTo(baseline.radius, 2);
    expect(after.iterBase).toBe(baseline.iterBase);
    expect(after.diveSpeed).toBe(baseline.diveSpeed);
  });

  /**
   * @testId T-AR-6
   * @story US-8
   * @ac SPEC AC #17
   */
  test('T-AR-6: Treble energy modulates iterBase only', async ({ page }) => {
    const baseline = await readSliders(page);

    const after = await page.evaluate((energies) =>
      window._testInjectBandEnergies(energies),
      { ...BAND_ZERO, treble: 1 }
    );

    expect(after.iterBase).toBeGreaterThan(baseline.iterBase);
    expect(after.theta).toBeCloseTo(baseline.theta, 1);
    expect(after.radius).toBeCloseTo(baseline.radius, 2);
    expect(after.diveSpeed).toBe(baseline.diveSpeed);
  });

  /**
   * @testId T-AR-7
   * @story US-8
   * @ac SPEC AC #17
   */
  test('T-AR-7: sensitivity at zero zeroes the band\'s contribution', async ({ page }) => {
    await page.evaluate(() => {
      // Set Bass sensitivity to 0
      const slider = document.getElementById('sl-sens-bass');
      slider.value = '0';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const baseline = await readSliders(page);

    const after = await page.evaluate((energies) =>
      window._testInjectBandEnergies(energies),
      { ...BAND_ZERO, bass: 1 }
    );

    // Even with full Bass energy, radius should not move because sens=0
    expect(after.radius).toBeCloseTo(baseline.radius, 2);
  });

  // ── US-9: Beat spikes cycle the color theme ──────────────────────────────

  /**
   * @testId T-AR-8
   * @story US-9
   * @ac SPEC AC #19
   */
  test('T-AR-8: beat trigger advances ColorTheme to next palette', async ({ page }) => {
    const before = await page.evaluate(() =>
      document.querySelector('.tb.on').dataset.theme
    );

    await page.evaluate(() => window._testTriggerBeat());

    const after = await page.evaluate(() =>
      document.querySelector('.tb.on').dataset.theme
    );

    expect(after).not.toBe(before);
  });

  /**
   * @testId T-AR-9
   * @story US-9
   * @ac SPEC AC #19
   */
  test('T-AR-9: two beats ≤ 250 ms apart cycle the theme exactly once', async ({ page }) => {
    const before = await page.evaluate(() =>
      document.querySelector('.tb.on').dataset.theme
    );

    await page.evaluate(() => {
      window._testTriggerBeat();
      // Second beat immediately — should be debounced
      window._testTriggerBeat();
    });

    const themes = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.tb')).map(b => b.dataset.theme)
    );
    const beforeIdx = themes.indexOf(before);
    const expected = themes[(beforeIdx + 1) % themes.length];

    const after = await page.evaluate(() =>
      document.querySelector('.tb.on').dataset.theme
    );
    expect(after).toBe(expected); // advanced exactly once, not twice
  });

  /**
   * @testId T-AR-10
   * @story US-9
   * @ac SPEC AC #19
   */
  test('T-AR-10: five beats cycle through full rotation', async ({ page }) => {
    const rotation = ['totoro', 'spiritedaway', 'mononoke', 'howl', 'nausicaa'];

    // Reset to Totoro
    await page.click('button[data-theme="totoro"]');

    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window._testTriggerBeat());
      await page.waitForTimeout(300); // > 250 ms min interval

      const expected = rotation[(i + 1) % 5];
      const active = await page.evaluate(() =>
        document.querySelector('.tb.on').dataset.theme
      );
      expect(active).toBe(expected);
    }
  });

  // ── US-10: Modulation never freezes during silence ───────────────────────

  /**
   * @testId T-AR-11
   * @story US-10
   * @ac SPEC AC #18
   */
  test('T-AR-11: zero energy across all bands keeps advanceParamTravel drifting', async ({ page }) => {
    // Enable param travel
    await page.click('#btn-param-travel');

    const t0 = await readSliders(page);

    // Inject silence repeatedly and verify drift continues
    for (let i = 0; i < 10; i++) {
      await page.evaluate((e) => window._testInjectBandEnergies(e), BAND_ZERO);
      await page.waitForTimeout(100);
    }

    const t1 = await readSliders(page);

    // Drift should have moved theta or radius even without audio energy
    expect(t1.theta !== t0.theta || t1.radius !== t0.radius).toBe(true);
  });

  // ── US-11: Sensitivity persists across reloads ───────────────────────────

  /**
   * @testId T-AR-12
   * @story US-11
   * @ac SPEC AC #20
   */
  test('T-AR-12: sensitivity values persist in localStorage', async ({ page }) => {
    await page.evaluate(() => {
      const sl = document.getElementById('sl-sens-bass');
      sl.value = '42';
      sl.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const stored = await page.evaluate(() =>
      localStorage.getItem('fractal.audio.sensitivity')
    );
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored).bass).toBe(0.42);
  });

  /**
   * @testId T-AR-13
   * @story US-11
   * @ac SPEC AC #20
   */
  test('T-AR-13: reload restores sensitivity from localStorage', async ({ page }) => {
    await page.evaluate(() =>
      localStorage.setItem('fractal.audio.sensitivity', JSON.stringify({
        subBass: 0.3, bass: 0.6, mid: 0.9, treble: 0.5,
      }))
    );

    await page.reload();
    await waitForRender(page);

    const restored = await page.evaluate(() =>
      window._testGetAudioState().sensitivity
    );
    expect(restored.bass).toBeCloseTo(0.6, 2);
    expect(restored.mid).toBeCloseTo(0.9, 2);
  });

  /**
   * @testId T-AR-14
   * @story US-11
   * @ac SPEC AC #20
   */
  test('T-AR-14: reload does not restore loaded audio (state returns to idle)', async ({ page }) => {
    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);
    await expect.poll(async () =>
      (await page.evaluate(() => window._testGetAudioState())).state
    ).not.toBe('idle');

    await page.reload();
    await waitForRender(page);

    const state = await page.evaluate(() => window._testGetAudioState());
    expect(state.state).toBe('idle');
  });

  // ── US-12: AudioReactivity is fully opt-in (regression) ──────────────────

  /**
   * @testId T-AR-15
   * @story US-12
   * @ac SPEC AC #15
   */
  test('T-AR-15: no AudioContext is created until a file is loaded', async ({ page }) => {
    await waitForRender(page);

    const hasContext = await page.evaluate(() => {
      const state = window._testGetAudioState();
      return state.state !== 'idle' || (window.__audioContext != null);
    });

    expect(hasContext).toBe(false);
  });

  // ── US-13: Re-renders are throttled to 10 Hz under continuous audio ──────

  /**
   * @testId T-AR-17
   * @story US-13
   * @ac SPEC AC #21
   */
  test('T-AR-17: scheduled render rate ≤ 10 Hz under continuous injected energy', async ({ page }) => {
    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);

    // Drive at full energy for 2 seconds via injection at ~60 Hz
    const start = Date.now();
    while (Date.now() - start < 2000) {
      await page.evaluate((e) => window._testInjectBandEnergies(e), BAND_FULL);
      await page.waitForTimeout(16);
    }

    const rate = await page.evaluate(() => window._testGetRenderScheduleRate());
    expect(rate).toBeLessThanOrEqual(10.5); // 10 Hz ± rounding
  });

  /**
   * @testId T-AR-18
   * @story US-13
   * @ac SPEC AC #21
   */
  test('T-AR-18: sliders update at ~60 Hz even when render rate is throttled', async ({ page }) => {
    let updateCount = 0;
    await page.exposeFunction('__noteSliderUpdate', () => { updateCount++; });

    await page.evaluate(() => {
      const obs = new MutationObserver(() => window.__noteSliderUpdate());
      obs.observe(document.getElementById('sl-theta'), { attributes: true });
    });

    const start = Date.now();
    while (Date.now() - start < 1000) {
      await page.evaluate((e) => window._testInjectBandEnergies(e), BAND_FULL);
      await page.waitForTimeout(16);
    }

    expect(updateCount).toBeGreaterThan(40); // expect ~60, allow 40+
  });

  // ── US-14: Stopping audio releases context cleanly ───────────────────────

  /**
   * @testId T-AR-19
   * @story US-14
   * @ac SPEC AC #22
   */
  test('T-AR-19: stopping audio releases AudioContext within one frame', async ({ page }) => {
    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);
    await expect.poll(async () =>
      (await page.evaluate(() => window._testGetAudioState())).state
    ).not.toBe('idle');

    await page.click('#audio-stop');
    await page.waitForTimeout(50); // ~3 frames at 60 Hz

    const state = await page.evaluate(() => window._testGetAudioState());
    expect(state.state).toBe('idle');
  });

  /**
   * @testId T-AR-20
   * @story US-14
   * @ac SPEC AC #22
   */
  test('T-AR-20: stopping audio reverts sliders to user-controlled values', async ({ page }) => {
    const baseline = await readSliders(page);

    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);
    await page.evaluate((e) => window._testInjectBandEnergies(e), BAND_FULL);

    const modulated = await readSliders(page);
    expect(modulated.theta).not.toBeCloseTo(baseline.theta, 1);

    await page.click('#audio-stop');
    await page.waitForTimeout(50);

    const reverted = await readSliders(page);
    expect(reverted.theta).toBeCloseTo(baseline.theta, 1);
  });

  /**
   * @testId T-AR-21
   * @story US-14
   * @ac SPEC AC #22
   */
  test('T-AR-21: page hide triggers same teardown as explicit stop', async ({ page }) => {
    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);

    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true, get: () => 'hidden',
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await page.waitForTimeout(50);

    const state = await page.evaluate(() => window._testGetAudioState());
    expect(state.state).toBe('idle');
  });

  // ── Telemetry constraint (separate concern) ──────────────────────────────

  /**
   * @testId T-AR-22
   * @ac SPEC AC #23
   */
  test('T-AR-22: telemetry emits only aggregate band averages', async ({ page }) => {
    const requests = [];
    page.on('request', (req) => {
      if (req.url().includes('/telemetry/events')) {
        requests.push({ url: req.url(), body: req.postData() });
      }
    });

    await page.setInputFiles('#audio-file', FIXTURE_AUDIO);
    for (let i = 0; i < 30; i++) {
      await page.evaluate((e) => window._testInjectBandEnergies(e), BAND_FULL);
      await page.waitForTimeout(50);
    }
    await page.click('#audio-stop');

    // No per-tick band sample events
    const perTick = requests.filter((r) =>
      r.body && r.body.includes('"type":"band_energy_sample"')
    );
    expect(perTick).toHaveLength(0);

    // Aggregate event allowed (one per session, on stop)
    const aggregates = requests.filter((r) =>
      r.body && r.body.includes('"type":"audio_session_summary"')
    );
    expect(aggregates.length).toBeLessThanOrEqual(1);
  });
});
