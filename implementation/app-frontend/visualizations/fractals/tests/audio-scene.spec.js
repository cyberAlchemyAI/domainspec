// @source internal_tools/visualizations/fractals/docs/SPEC.md#audioscene-inline
// @stories US-17, US-18, US-19, US-20, US-21, US-22, US-23, US-24, US-25, US-26
// @testSpec internal_tools/visualizations/fractals/docs/TEST-SPEC.md
//
// AudioScene capability tests (T-AS-1 through T-AS-22).
// Each test references its acceptance criterion (`@ac`), story (`@story`),
// and TEST-SPEC ID (`@testId`).
//
// Required implementation hooks (see TEST-SPEC.md "Implementation Test Hooks"):
//   - window._testGetAmbientState()
//   - window._testInjectAmbientSignals({rms?, onset?, onsetStrength?})
//   - window._testGetParticleCount()
//   - window._testForceDiveState(diving)
//   - window._testGetSessionSummary()
// AudioReactivity hooks reused: _testGetAudioState, _testInjectBandEnergies,
// _testTriggerBeat. Hooks are activated by `?test=1` query param.
//
// Required fixtures:
//   - tests/fixtures/test-audio.wav (already created for AudioReactivity)

const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file://' + path.resolve(__dirname, '../fractal-ghibli.html');
const TEST_FILE_URL = FILE_URL + '?test=1';
const FIXTURE_AUDIO = path.resolve(__dirname, 'fixtures/test-audio.wav');

const BAND_ZERO = { subBass: 0, bass: 0, mid: 0, treble: 0 };

async function waitForRender(page, timeout = 25000) {
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

// Some tests need the audio loop running so analyser ticks update band
// energies. We use _testInject* paths primarily (they bypass the live
// FFT), but for "is the AudioContext shared" and similar we load the
// fixture file.
async function loadAudio(page) {
  await page.setInputFiles('#audio-file', FIXTURE_AUDIO);
  await page.waitForFunction(() => {
    const s = window._testGetAudioState();
    return s && (s.state === 'loaded' || s.state === 'playing');
  });
}

async function startPlayback(page) {
  await loadAudio(page);
  // Trigger play via the audio element. Some browsers gate autoplay,
  // so we click the play affordance in the controls; if that fails,
  // call .play() programmatically.
  await page.evaluate(() => {
    const a = document.getElementById('audio-player');
    return a.play().catch(() => null);
  });
  await page.waitForFunction(() => {
    return window._testGetAudioState().state === 'playing';
  }, { timeout: 5000 }).catch(() => null);
}

test.describe('AudioScene', () => {
  test.beforeEach(async ({ page }) => {
    // Playwright gives each test a fresh BrowserContext, so localStorage
    // is already isolated. No init-script clear is needed (it would also
    // wipe values written mid-test and survive the reload, breaking
    // persistence-restore tests like T-AS-12).
    await page.goto(TEST_FILE_URL);
    await waitForRender(page);
  });

  // ── US-22: regression — AudioScene is fully opt-in ─────────────────────

  /**
   * @testId T-AS-1
   * @story US-22
   * @ac SPEC AC #25
   */
  test('T-AS-1: with no audio loaded, AudioScene state is idle and no ambient elements render', async ({ page }) => {
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.state).toBe('idle');
    expect(s.vignetteOpacity).toBe(0);
    expect(s.hudGlowOpacity).toBe(0);
    expect(s.hazeOpacity).toBe(0);
    expect(s.shakeAmplitude).toBe(0);
    expect(s.particleCount).toBe(0);
  });

  /**
   * @testId T-AS-2
   * @story US-22
   * @ac SPEC AC #29
   */
  test('T-AS-2: with no audio loaded, no AudioContext exists yet', async ({ page }) => {
    const ctx = await page.evaluate(() => window.__audioContext || null);
    expect(ctx).toBeNull();
  });

  // ── US-17: explorer feels the song through the whole screen ────────────

  /**
   * @testId T-AS-3
   * @story US-17
   * @ac SPEC AC #26
   */
  test('T-AS-3: injected RMS modulates haze opacity proportionally to A · r', async ({ page }) => {
    await loadAudio(page);
    // A defaults to 0.6 from localStorage default; haze max = 0.30 · A · r
    // r = 1.0 → haze = 0.30 · 0.6 · 1.0 = 0.18
    const r1 = await page.evaluate(() => window._testInjectAmbientSignals({ rms: 1.0 }));
    expect(r1.hazeOpacity).toBeGreaterThan(0.15);
    expect(r1.hazeOpacity).toBeLessThanOrEqual(0.30);
    // r = 0 → haze ≈ 0
    const r0 = await page.evaluate(() => window._testInjectAmbientSignals({ rms: 0 }));
    expect(r0.hazeOpacity).toBeLessThan(0.01);
  });

  /**
   * @testId T-AS-4
   * @story US-17
   * @ac SPEC AC #26
   */
  test('T-AS-4: injected high Bass band modulates vignette opacity proportionally to A · e_Bass', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testInjectBandEnergies({ subBass: 0, bass: 1.0, mid: 0, treble: 0 }));
    const r = await page.evaluate(() => window._testInjectAmbientSignals({ rms: 0 }));
    // vignette max = 0.40 · A · e_Bass = 0.40 · 0.6 · 1.0 = 0.24
    expect(r.vignetteOpacity).toBeGreaterThan(0.20);
    expect(r.vignetteOpacity).toBeLessThanOrEqual(0.40);
  });

  /**
   * @testId T-AS-5
   * @story US-17
   * @ac SPEC AC #26
   */
  test('T-AS-5: injected high Treble band modulates HUD glow opacity proportionally to A · e_Treble', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testInjectBandEnergies({ subBass: 0, bass: 0, mid: 0, treble: 1.0 }));
    const r = await page.evaluate(() => window._testInjectAmbientSignals({ rms: 0 }));
    // HUD glow max = 0.60 · A · e_Treble = 0.60 · 0.6 · 1.0 = 0.36
    expect(r.hudGlowOpacity).toBeGreaterThan(0.30);
    expect(r.hudGlowOpacity).toBeLessThanOrEqual(0.60);
  });

  /**
   * @testId T-AS-6
   * @story US-17
   * @ac SPEC AC #26
   */
  test('T-AS-6: triggering a beat produces a non-zero shake amplitude that decays', async ({ page }) => {
    await loadAudio(page);
    // Skip on small viewports where shake is forced to 0.
    const isMobile = await page.evaluate(() => window._testGetAmbientState().isMobile);
    test.skip(isMobile, 'shake disabled on mobile viewports');

    await page.evaluate(() => window._testTriggerBeat());
    const peak = await page.evaluate(() => window._testInjectAmbientSignals({}));
    expect(peak.shakeAmplitude).toBeGreaterThan(0);

    // Wait > BEAT_DECAY_MS (120ms) × 4 ≈ 500 ms so impulse decays to ~0.
    await page.waitForTimeout(600);
    const decayed = await page.evaluate(() => window._testInjectAmbientSignals({}));
    expect(decayed.shakeAmplitude).toBeLessThan(0.1);
  });

  /**
   * @testId T-AS-7
   * @story US-17, US-20
   * @ac SPEC AC #26, #30
   */
  test('T-AS-7: an onset spawns particles per palette table for the active theme', async ({ page }) => {
    await loadAudio(page);
    const before = await page.evaluate(() => window._testGetParticleCount());
    expect(before).toBe(0);

    await page.evaluate(() => window._testInjectAmbientSignals({ onset: true, onsetStrength: 1.0 }));
    const after = await page.evaluate(() => window._testGetParticleCount());
    expect(after).toBeGreaterThan(0);

    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.currentPaletteAmbient).toBe('soot'); // default theme = totoro
  });

  /**
   * @testId T-AS-8
   * @story US-20
   * @ac SPEC AC #30
   */
  test('T-AS-8: switching to Howl immediately changes particle visual to ash', async ({ page }) => {
    await loadAudio(page);
    await page.click('.tb[data-theme="howl"]');
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.currentPaletteAmbient).toBe('ash');
  });

  // ── US-18: master ambient knob scales the whole scene ──────────────────

  /**
   * @testId T-AS-9
   * @story US-18
   * @ac SPEC AC #27
   */
  test('T-AS-9: A=0 collapses every ambient element to its idle baseline', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testInjectBandEnergies({ subBass: 1, bass: 1, mid: 1, treble: 1 }));
    await page.evaluate(() => window._testInjectAmbientSignals({ rms: 1.0, onset: true, onsetStrength: 1.0 }));
    // Now drag master to 0.
    await page.evaluate(() => {
      const sl = document.getElementById('sl-ambient');
      sl.value = '0';
      sl.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.ambientIntensity).toBe(0);
    expect(s.vignetteOpacity).toBe(0);
    expect(s.hudGlowOpacity).toBe(0);
    expect(s.hazeOpacity).toBe(0);
    expect(s.shakeAmplitude).toBe(0);
    expect(s.particleCount).toBe(0);
  });

  /**
   * @testId T-AS-10
   * @story US-18
   * @ac SPEC AC #27
   */
  test('T-AS-10: A=1 produces 2× the response of A=0.5 under same band energies', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testInjectBandEnergies({ subBass: 0, bass: 1.0, mid: 0, treble: 1.0 }));

    // A = 0.5
    await page.evaluate(() => {
      const sl = document.getElementById('sl-ambient');
      sl.value = '50';
      sl.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const half = await page.evaluate(() => window._testInjectAmbientSignals({ rms: 1.0 }));

    // A = 1.0
    await page.evaluate(() => {
      const sl = document.getElementById('sl-ambient');
      sl.value = '100';
      sl.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const full = await page.evaluate(() => window._testInjectAmbientSignals({ rms: 1.0 }));

    // Linear scaling: full ≈ 2 × half (with floating-point tolerance).
    expect(full.vignetteOpacity).toBeCloseTo(half.vignetteOpacity * 2, 2);
    expect(full.hudGlowOpacity).toBeCloseTo(half.hudGlowOpacity * 2, 2);
    expect(full.hazeOpacity).toBeCloseTo(half.hazeOpacity * 2, 2);
  });

  /**
   * @testId T-AS-11
   * @story US-18
   * @ac SPEC AC #28
   */
  test('T-AS-11: AmbientIntensity persists in localStorage', async ({ page }) => {
    await page.evaluate(() => {
      const sl = document.getElementById('sl-ambient');
      sl.value = '37';
      sl.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const stored = await page.evaluate(() => localStorage.getItem('fractal.audio.ambient'));
    expect(parseFloat(stored)).toBeCloseTo(0.37, 2);
  });

  /**
   * @testId T-AS-12
   * @story US-18
   * @ac SPEC AC #28
   */
  test('T-AS-12: reload restores AmbientIntensity from localStorage', async ({ page }) => {
    await page.evaluate(() => {
      const sl = document.getElementById('sl-ambient');
      sl.value = '42';
      sl.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.reload();
    await waitForRender(page);
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.ambientIntensity).toBeCloseTo(0.42, 2);
    const slv = await page.evaluate(() => document.getElementById('sl-ambient').value);
    expect(parseInt(slv, 10)).toBe(42);
  });

  // ── US-19: onsets and beats are independent signals ────────────────────

  /**
   * @testId T-AS-13
   * @story US-19
   * @ac SPEC AC #33
   */
  test('T-AS-13: OnsetDetected and BeatDetected fire independently', async ({ page }) => {
    await loadAudio(page);
    // Onset without beat
    const before = await page.evaluate(() => window._testGetParticleCount());
    await page.evaluate(() => window._testInjectAmbientSignals({ onset: true, onsetStrength: 0.8 }));
    const afterOnset = await page.evaluate(() => window._testGetParticleCount());
    expect(afterOnset).toBeGreaterThan(before);

    // Beat without onset → shake fires, no new particles spawn from the beat itself.
    const beforeBeat = await page.evaluate(() => window._testGetParticleCount());
    const isMobile = await page.evaluate(() => window._testGetAmbientState().isMobile);
    await page.evaluate(() => window._testTriggerBeat());
    const afterBeat = await page.evaluate(() => window._testInjectAmbientSignals({}));
    if (!isMobile) expect(afterBeat.shakeAmplitude).toBeGreaterThan(0);
    const afterBeatCount = await page.evaluate(() => window._testGetParticleCount());
    expect(afterBeatCount).toBe(beforeBeat); // beat did not spawn particles
  });

  /**
   * @testId T-AS-14
   * @story US-19
   * @ac SPEC AC #33
   */
  test('T-AS-14: onsets fired ≤ 80 ms apart spawn particles only once', async ({ page }) => {
    await loadAudio(page);
    const before = await page.evaluate(() => window._testGetParticleCount());
    // Two onsets back-to-back synchronously → second is debounced.
    await page.evaluate(() => {
      window._testInjectAmbientSignals({ onset: true, onsetStrength: 1.0 });
      window._testInjectAmbientSignals({ onset: true, onsetStrength: 1.0 });
    });
    const after = await page.evaluate(() => window._testGetParticleCount());
    // Particle count should reflect only one batch of spawns (round(8·A·1) = ~5 particles at A=0.6).
    const expectedMax = Math.round(8 * 0.6 * 1.0) + 2;
    expect(after - before).toBeLessThanOrEqual(expectedMax);
  });

  // ── US-21: ambient scene freezes during a fractal dive ─────────────────

  /**
   * @testId T-AS-15
   * @story US-21
   * @ac SPEC AC #31
   */
  test('T-AS-15: forcing dive state freezes ambient frame work', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testForceDiveState(true));
    // Drive a synchronous frame so the state hook sees `diving === true`.
    await page.evaluate(() => window._testInjectAmbientSignals({}));
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.state).toBe('frozen-during-dive');
    // Reset state for next test
    await page.evaluate(() => window._testForceDiveState(false));
  });

  /**
   * @testId T-AS-16
   * @story US-21
   * @ac SPEC AC #31
   */
  test('T-AS-16: forcing dive off after a freeze resumes ambient elements', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testForceDiveState(true));
    await page.evaluate(() => window._testInjectAmbientSignals({}));
    await page.evaluate(() => window._testForceDiveState(false));
    await page.evaluate(() => window._testInjectAmbientSignals({}));
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.state).not.toBe('frozen-during-dive');
  });

  // ── US-23: stopping audio fades the scene to idle within one frame ────

  /**
   * @testId T-AS-17
   * @story US-23
   * @ac SPEC AC #32
   */
  test('T-AS-17: stopping audio fades all ambient elements to idle', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testInjectBandEnergies({ subBass: 0, bass: 1, mid: 0, treble: 1 }));
    await page.evaluate(() => window._testInjectAmbientSignals({ rms: 1.0, onset: true, onsetStrength: 1.0 }));
    await page.click('#audio-stop');
    await page.waitForTimeout(50);
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.state).toBe('idle');
    expect(s.vignetteOpacity).toBe(0);
    expect(s.hazeOpacity).toBe(0);
    expect(s.shakeAmplitude).toBe(0);
    expect(s.particleCount).toBe(0);
  });

  /**
   * @testId T-AS-18
   * @story US-23
   * @ac SPEC AC #32
   */
  test('T-AS-18: page hide / visibilitychange triggers same fade-to-idle path', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testInjectAmbientSignals({ rms: 1.0 }));
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(50);
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.state).toBe('idle');
  });

  // ── US-24: particle layer stays bounded ────────────────────────────────

  /**
   * @testId T-AS-19
   * @story US-24
   * @ac SPEC AC #34
   */
  test('T-AS-19: sustained onset injection keeps active particle count ≤ cap', async ({ page }) => {
    await loadAudio(page);
    const isMobile = await page.evaluate(() => window._testGetAmbientState().isMobile);
    const cap = isMobile ? 24 : 64;

    // Hammer the onset detector — 30 onsets in a tight loop. The 80 ms gap
    // guard fires inside fireOnset so most of these will be debounced; we
    // bypass by directly invoking spawn through repeated injects spread by
    // a setTimeout chain.
    await page.evaluate(async () => {
      for (let i = 0; i < 50; i++) {
        await new Promise(r => setTimeout(r, 95)); // > ONSET_MIN_GAP_MS = 80
        window._testInjectAmbientSignals({ onset: true, onsetStrength: 1.0 });
      }
    });

    const count = await page.evaluate(() => window._testGetParticleCount());
    expect(count).toBeLessThanOrEqual(cap);
  });

  // ── US-25: mobile downgrade ────────────────────────────────────────────

  /**
   * @testId T-AS-20
   * @story US-25
   * @ac SPEC AC #34, #35
   */
  test('T-AS-20: viewport < 768 px caps particles at 24 and forces shake to 0', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    // Trigger the resize listener so AudioScene re-evaluates isMobile.
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await loadAudio(page);
    await page.evaluate(() => window._testTriggerBeat());
    const r = await page.evaluate(() => window._testInjectAmbientSignals({}));
    expect(r.shakeAmplitude).toBe(0);

    // Stress the particle cap.
    await page.evaluate(async () => {
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 95));
        window._testInjectAmbientSignals({ onset: true, onsetStrength: 1.0 });
      }
    });
    const count = await page.evaluate(() => window._testGetParticleCount());
    expect(count).toBeLessThanOrEqual(24);
  });

  // ── US-26: telemetry stays aggregate and privacy-preserving ───────────

  /**
   * @testId T-AS-21
   * @story US-26
   * @ac SPEC AC #36
   */
  test('T-AS-21: session summary contains exactly the documented aggregate fields', async ({ page }) => {
    await loadAudio(page);
    await page.evaluate(() => window._testInjectAmbientSignals({ rms: 0.5, onset: true, onsetStrength: 0.8 }));
    const summary = await page.evaluate(() => window._testGetSessionSummary());
    expect(summary).toHaveProperty('band_avg');
    expect(summary).toHaveProperty('rms_avg');
    expect(summary).toHaveProperty('onset_count');
    expect(summary).toHaveProperty('beat_count');
    expect(summary).toHaveProperty('session_duration_ms');
    // Disallow per-frame leakage.
    expect(summary).not.toHaveProperty('per_frame_samples');
    expect(summary).not.toHaveProperty('waveform');
    expect(summary).not.toHaveProperty('song_id');
    expect(typeof summary.rms_avg).toBe('number');
    expect(typeof summary.onset_count).toBe('number');
    expect(summary.onset_count).toBeGreaterThan(0);
  });

  // ── US-22: regression — pre-existing tests still pass ─────────────────

  /**
   * @testId T-AS-22
   * @story US-22
   * @ac SPEC AC #25
   */
  test('T-AS-22: with no audio loaded, fractal canvas renders normally and no ambient DOM is active', async ({ page }) => {
    // Fractal renders fine.
    await waitForRender(page);
    // No ambient state.
    const s = await page.evaluate(() => window._testGetAmbientState());
    expect(s.state).toBe('idle');
    // Existing AudioReactivity opt-in invariant is intact: no AudioContext.
    const ctx = await page.evaluate(() => window.__audioContext || null);
    expect(ctx).toBeNull();
    // HUD glow class is not applied.
    const hudHasGlow = await page.evaluate(() =>
      document.getElementById('hud-tr').classList.contains('audio-glow')
    );
    expect(hudHasGlow).toBe(false);
  });
});
