# Test Specification: Fractal Ghibli Visualization

> Derived from [SPEC.md](SPEC.md) and [STORIES.md](STORIES.md) per the rules in `domainspec/TEST-PIPELINE.md`.
> Every test row references its source acceptance criterion (`SPEC AC #n`) and story (`US-n`).
> Test runner: Playwright (chromium-only) loading `fractal-ghibli.html` via `file://`. See [tests/playwright.config.js](../tests/playwright.config.js).

## Test Infrastructure

| Item                  | Convention                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Runner                | `@playwright/test ^1.59.1`, chromium project only, headless                                                             |
| Page URL              | `file://{abs}/fractal-ghibli.html` (no dev server — single self-contained HTML)                                         |
| Test directory        | `internal_tools/visualizations/fractals/tests/`                                                                         |
| Existing spec         | `fractal-ghibli.spec.js` — 17 tests covering FractalRendering, ThemeSelection, ParameterControl, FractalDive, PerformanceProbe |
| New spec (this doc)   | `audio-reactivity.spec.js` — to be created for US-7 through US-14                                                       |
| New spec (AudioScene) | `audio-scene.spec.js` — to be created for US-17 through US-26                                                           |
| Helpers               | `sampleCanvasPixels(page, n)`, `waitForRender(page, timeout)`, `getZoom(page)`, `getViewZoom(page)` — already present in `fractal-ghibli.spec.js`; refactor into `helpers.js` when adding the audio spec |
| Fixture audio file    | `tests/fixtures/test-audio.wav` — 1 s, 22050 Hz mono synthetic clip mixing 80 Hz + 200 Hz + 4 kHz sines for guaranteed bass/treble content (44 KB, generated programmatically — no encoder dependency). Any compatible format the browser can decode is acceptable; SPEC AC #16 lists wav, mp3, ogg, m4a. |

## Implementation Test Hooks (Required)

The AudioReactivity capability needs deterministic test affordances. The implementation MUST expose these on `window` when running under Playwright (gated by `?test=1` query param, similar to `?perf=1`):

| Hook                                                | Returns / Effect                                                                                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `window._testGetAudioState()`                       | `{ state: 'idle' \| 'loaded' \| 'playing' \| 'paused', sensitivity: {subBass, bass, mid, treble}, lastBeatAt: number \| null, lastRenderAt: number }` |
| `window._testInjectBandEnergies({subBass,bass,mid,treble})` | Bypasses the live FFT for one tick. Synchronously applies the modulation rule with provided energies (each ∈ [0,1]). Returns post-modulation slider values: `{theta, radius, iterBase, diveSpeed}`. |
| `window._testTriggerBeat()`                         | Synthesizes a beat event (bypasses rolling-average detector). Cycles `ColorTheme` to next palette. Returns the new theme name.                    |
| `window._testGetRenderScheduleRate()`               | Returns Hz of `scheduleRender()` calls in the last 5 seconds. Used to verify the 10 Hz cap.                                                       |
| `window._testGetAmbientState()`                     | `{ state: 'idle' \| 'active' \| 'frozen-during-dive', ambientIntensity: number, vignetteOpacity: number, hudGlowOpacity: number, hazeOpacity: number, shakeAmplitude: number, particleCount: number, currentPaletteAmbient: string }` |
| `window._testInjectAmbientSignals({rms?,onset?,onsetStrength?})` | Bypasses live analyser for one ambient frame. `rms` ∈ [0,1]; `onset` boolean (synthesizes an OnsetEvent if true); `onsetStrength` ∈ [0,1]. Returns post-frame `{ vignetteOpacity, hudGlowOpacity, hazeOpacity, shakeAmplitude, particleCount }`. |
| `window._testGetParticleCount()`                    | Returns the number of currently-active particles on the AmbientCanvas. |
| `window._testForceDiveState(diving)`                | Bypasses dive controls to set `DiveAnimation.diving` directly. Used to verify ambient freeze-during-dive without running the full RAF dive loop. |
| `window._testGetSessionSummary()`                   | Returns the in-progress aggregate that *would* be emitted at session end: `{ band_avg, rms_avg, onset_count, beat_count, session_duration_ms }`. |

Without these hooks, US-8 (per-band isolation), US-13 (throttling), parts of US-9 (beat), and most of US-17 through US-26 (ambient elements) are not deterministically testable — they would depend on the spectrum of an actual audio file.

---

## Test Catalogue

Tests are grouped by capability. Each row lists: the test ID, the story it covers, the acceptance criteria it asserts, and the Playwright spec file where it lives.

### FractalRendering

| Test ID  | Test description                                            | Story | SPEC AC | Spec file                  | Notes                      |
| -------- | ----------------------------------------------------------- | ----- | ------- | -------------------------- | -------------------------- |
| T-FR-1   | loads with no console errors and renders a fractal          | US-1  | AC #1, #2 | fractal-ghibli.spec.js   | ✅ Already implemented     |
| T-FR-2   | canvas contains varied non-black pixels after render        | US-1  | AC #2    | fractal-ghibli.spec.js    | ✅ Already implemented     |
| T-FR-3   | HUD displays zoom, coordinate, and iteration values         | US-1  | AC #7    | fractal-ghibli.spec.js    | ✅ Already implemented     |
| T-FR-4   | UI controls remain interactive while worker computes        | US-1  | AC #5    | fractal-ghibli.spec.js    | ⚠️ Partial via T-FR-3; add explicit slider-during-render assertion |
| T-FR-5   | no external network requests on page load                   | US-1  | AC #8    | fractal-ghibli.spec.js    | ❌ New: Playwright route interception |

### ThemeSelection

| Test ID  | Test description                                            | Story | SPEC AC | Spec file                  | Notes                      |
| -------- | ----------------------------------------------------------- | ----- | ------- | -------------------------- | -------------------------- |
| T-TS-1   | switching theme produces different pixel colors             | US-2  | AC #4    | fractal-ghibli.spec.js    | ✅ Already implemented     |
| T-TS-2   | each of 5 themes produces a distinct palette                | US-2  | AC #4    | fractal-ghibli.spec.js    | ❌ New: extend existing test to cover all 5 themes pairwise |
| T-TS-3   | active theme button gets `.on` class                        | US-2  | AC #4    | fractal-ghibli.spec.js    | ❌ New: DOM class assertion |

### ParameterControl

| Test ID  | Test description                                            | Story | SPEC AC | Spec file                  | Notes                      |
| -------- | ----------------------------------------------------------- | ----- | ------- | -------------------------- | -------------------------- |
| T-PC-1   | dragging Espírito slider re-renders the fractal             | US-3  | AC #3    | fractal-ghibli.spec.js    | ❌ New                     |
| T-PC-2   | dragging Profundidade slider re-renders the fractal         | US-3  | AC #3    | fractal-ghibli.spec.js    | ❌ New                     |
| T-PC-3   | dragging Essência slider re-renders the fractal             | US-3  | AC #3    | fractal-ghibli.spec.js    | ❌ New                     |
| T-PC-4   | tooltips appear on slider hover                             | US-3  | AC #6    | fractal-ghibli.spec.js    | ❌ New                     |
| T-PC-5   | parameter labels reflect slider value live                  | US-3  | AC #7    | fractal-ghibli.spec.js    | ✅ Already implemented (param-travel test asserts label sync) |

### FractalDive

| Test ID  | Test description                                            | Story | SPEC AC | Spec file                  | Notes                      |
| -------- | ----------------------------------------------------------- | ----- | ------- | -------------------------- | -------------------------- |
| T-FD-1   | clicking dive button starts zoom animation                  | US-4  | AC #9, #10 | fractal-ghibli.spec.js | ✅ Already implemented     |
| T-FD-2   | Space bar starts and stops the dive                         | US-4, US-6 | AC #9, #12 | fractal-ghibli.spec.js | ✅ Already implemented |
| T-FD-3   | mouse scroll while diving stops the dive                    | US-6  | AC #12   | fractal-ghibli.spec.js    | ✅ Already implemented     |
| T-FD-4   | canvas pixels change during dive (new frames rendered)      | US-4  | AC #10   | fractal-ghibli.spec.js    | ✅ Already implemented     |
| T-FD-5   | dive keeps running after precision warning threshold        | US-5  | AC #11   | fractal-ghibli.spec.js    | ✅ Already implemented     |
| T-FD-6   | drag while diving stops the dive cleanly                    | US-6  | AC #12   | fractal-ghibli.spec.js    | ❌ New                     |
| T-FD-7   | touch while diving stops the dive cleanly                   | US-6  | AC #12   | fractal-ghibli.spec.js    | ❌ New (`page.touchscreen`) |

### AudioReactivity (NEW — primary scaffold target)

| Test ID  | Test description                                                                                  | Story | SPEC AC | Spec file                | Hooks used                    |
| -------- | ------------------------------------------------------------------------------------------------- | ----- | ------- | ------------------------ | ----------------------------- |
| T-AR-1   | file picker accepts an audio file and creates an AudioContext                                     | US-7  | AC #16  | audio-reactivity.spec.js | `_testGetAudioState`          |
| T-AR-2   | loading audio transitions AudioReactivityState idle → loaded                                       | US-7  | AC #16  | audio-reactivity.spec.js | `_testGetAudioState`          |
| T-AR-3   | injected SubBass energy modulates `diveSpeed` and leaves other params at baseline                  | US-8  | AC #17  | audio-reactivity.spec.js | `_testInjectBandEnergies`     |
| T-AR-4   | injected Bass energy modulates `radius` and leaves other params at baseline                        | US-8  | AC #17  | audio-reactivity.spec.js | `_testInjectBandEnergies`     |
| T-AR-5   | injected Mid energy modulates `theta` and leaves other params at baseline                          | US-8  | AC #17  | audio-reactivity.spec.js | `_testInjectBandEnergies`     |
| T-AR-6   | injected Treble energy modulates `iterBase` and leaves other params at baseline                    | US-8  | AC #17  | audio-reactivity.spec.js | `_testInjectBandEnergies`     |
| T-AR-7   | sensitivity at zero zeroes the band's modulation contribution                                      | US-8  | AC #17  | audio-reactivity.spec.js | `_testInjectBandEnergies`     |
| T-AR-8   | beat trigger advances `ColorTheme` to the next palette in rotation                                 | US-9  | AC #19  | audio-reactivity.spec.js | `_testTriggerBeat`            |
| T-AR-9   | two beats fired ≤ 250 ms apart cycle the theme exactly once                                        | US-9  | AC #19  | audio-reactivity.spec.js | `_testTriggerBeat`            |
| T-AR-10  | five consecutive beats cycle through Totoro → Spirited → Mononoke → Howl → Nausicaä → Totoro       | US-9  | AC #19  | audio-reactivity.spec.js | `_testTriggerBeat`            |
| T-AR-11  | with all band energies at 0, the fractal continues `advanceParamTravel` drift                      | US-10 | AC #18  | audio-reactivity.spec.js | `_testInjectBandEnergies`     |
| T-AR-12  | sensitivity values persist in `localStorage` under `fractal.audio.sensitivity`                     | US-11 | AC #20  | audio-reactivity.spec.js | localStorage probe            |
| T-AR-13  | reload restores sensitivity values from `localStorage`                                             | US-11 | AC #20  | audio-reactivity.spec.js | localStorage probe + reload   |
| T-AR-14  | reload does NOT restore the loaded audio file (state returns to idle)                              | US-11 | AC #20  | audio-reactivity.spec.js | `_testGetAudioState` + reload |
| T-AR-15  | with no audio loaded, no AudioContext is created (verified via API absence on window)              | US-12 | AC #15  | audio-reactivity.spec.js | window inspection             |
| T-AR-16  | with no audio loaded, all 17 pre-existing tests still pass (regression suite)                      | US-12 | AC #15  | fractal-ghibli.spec.js   | full re-run                   |
| T-AR-17  | scheduled render rate ≤ 10 Hz under continuous injected energy                                     | US-13 | AC #21  | audio-reactivity.spec.js | `_testGetRenderScheduleRate`  |
| T-AR-18  | sliders update at audio analyser rate (~60 Hz) even when render rate is throttled                  | US-13 | AC #21  | audio-reactivity.spec.js | `_testInjectBandEnergies`     |
| T-AR-19  | stopping audio releases the AudioContext within one frame                                          | US-14 | AC #22  | audio-reactivity.spec.js | `_testGetAudioState`          |
| T-AR-20  | stopping audio reverts sliders to user-controlled values                                           | US-14 | AC #22  | audio-reactivity.spec.js | DOM probe                     |
| T-AR-21  | page hide / visibilitychange triggers the same teardown as explicit stop                           | US-14 | AC #22  | audio-reactivity.spec.js | `page.evaluate(visibility)`   |
| T-AR-22  | telemetry emits only aggregate band averages (no per-frame samples)                                | —     | AC #23  | audio-reactivity.spec.js | telemetry endpoint inspection |

### AudioScene (NEW — second scaffold target)

| Test ID  | Test description                                                                                  | Story | SPEC AC | Spec file              | Hooks used                          |
| -------- | ------------------------------------------------------------------------------------------------- | ----- | ------- | ---------------------- | ----------------------------------- |
| T-AS-1   | with no audio loaded, AudioScene state is `idle` and no ambient elements render                   | US-22 | AC #25  | audio-scene.spec.js    | `_testGetAmbientState`              |
| T-AS-2   | with no audio loaded, no second AudioContext is created                                            | US-22 | AC #29  | audio-scene.spec.js    | window inspection                   |
| T-AS-3   | injected RMS modulates haze opacity proportionally to A · r                                        | US-17 | AC #26  | audio-scene.spec.js    | `_testInjectAmbientSignals`         |
| T-AS-4   | injected high Bass band modulates vignette opacity proportionally to A · e_Bass                    | US-17 | AC #26  | audio-scene.spec.js    | `_testInjectBandEnergies`           |
| T-AS-5   | injected high Treble band modulates HUD glow opacity proportionally to A · e_Treble                | US-17 | AC #26  | audio-scene.spec.js    | `_testInjectBandEnergies`           |
| T-AS-6   | `_testTriggerBeat` produces a non-zero shake amplitude that decays within ~120 ms                  | US-17 | AC #26  | audio-scene.spec.js    | `_testTriggerBeat` + `_testGetAmbientState` |
| T-AS-7   | `_testInjectAmbientSignals({onset: true})` spawns particles per palette table for active theme     | US-17, US-20 | AC #26, #30 | audio-scene.spec.js | `_testInjectAmbientSignals` + `_testGetParticleCount` |
| T-AS-8   | switching from Totoro to Howl immediately changes particle visual to `ash`                         | US-20 | AC #30  | audio-scene.spec.js    | `_testGetAmbientState`              |
| T-AS-9   | A=0 collapses every ambient element to its idle baseline within one frame                         | US-18 | AC #27  | audio-scene.spec.js    | `_testInjectAmbientSignals` + `_testGetAmbientState` |
| T-AS-10  | A=1 produces 2× the vignette/HUD/haze response of A=0.5 under the same band energies               | US-18 | AC #27  | audio-scene.spec.js    | `_testInjectAmbientSignals`         |
| T-AS-11  | AmbientIntensity persists in `localStorage` under `fractal.audio.ambient`                          | US-18 | AC #28  | audio-scene.spec.js    | localStorage probe                  |
| T-AS-12  | reload restores AmbientIntensity from `localStorage`                                               | US-18 | AC #28  | audio-scene.spec.js    | localStorage + reload               |
| T-AS-13  | OnsetDetected and BeatDetected fire independently — onset without beat, beat without onset         | US-19 | AC #33  | audio-scene.spec.js    | `_testInjectAmbientSignals` + `_testTriggerBeat` |
| T-AS-14  | onsets fired ≤ 80 ms apart spawn particles only once                                               | US-19 | AC #33  | audio-scene.spec.js    | `_testInjectAmbientSignals`         |
| T-AS-15  | `_testForceDiveState(true)` freezes ambient frame work within ~200 ms                              | US-21 | AC #31  | audio-scene.spec.js    | `_testForceDiveState`               |
| T-AS-16  | `_testForceDiveState(false)` after a freeze resumes ambient elements cleanly                       | US-21 | AC #31  | audio-scene.spec.js    | `_testForceDiveState`               |
| T-AS-17  | stopping audio fades all ambient elements to idle within one frame                                 | US-23 | AC #32  | audio-scene.spec.js    | `_testGetAmbientState`              |
| T-AS-18  | page hide / `visibilitychange` triggers same fade-to-idle path                                     | US-23 | AC #32  | audio-scene.spec.js    | `page.evaluate(visibility)`         |
| T-AS-19  | sustained 30 Hz onset injection keeps active particle count ≤ 64 (desktop)                         | US-24 | AC #34  | audio-scene.spec.js    | `_testInjectAmbientSignals` + `_testGetParticleCount` |
| T-AS-20  | viewport < 768 px caps particles at 24 and forces shake amplitude to 0                             | US-25 | AC #34, #35 | audio-scene.spec.js | `page.setViewportSize` + `_testGetAmbientState` |
| T-AS-21  | session summary contains exactly: band_avg, rms_avg, onset_count, beat_count, session_duration_ms  | US-26 | AC #36  | audio-scene.spec.js    | `_testGetSessionSummary`            |
| T-AS-22  | with no audio loaded, all 17 pre-existing tests still pass (AudioScene regression suite)           | US-22 | AC #25  | fractal-ghibli.spec.js | full re-run                         |

### PerformanceProbe

| Test ID  | Test description                                            | Story | SPEC AC | Spec file                  | Notes                      |
| -------- | ----------------------------------------------------------- | ----- | ------- | -------------------------- | -------------------------- |
| T-PP-1   | performance overlay hidden by default, visible with `?perf=1` | US-15, US-16 | AC #13 | fractal-ghibli.spec.js | ✅ Already implemented     |
| T-PP-2   | pressing P toggles performance overlay                      | US-15 | AC #13   | fractal-ghibli.spec.js    | ✅ Already implemented     |
| T-PP-3   | overlay activation does not change canvas pixels            | US-16 | AC #14   | fractal-ghibli.spec.js    | ❌ New: pixel-diff before/after `?perf=1` |

---

## Coverage Summary

| Capability        | Total tests | Existing | New | Acceptance criteria covered |
| ----------------- | ----------- | -------- | --- | --------------------------- |
| FractalRendering  | 5           | 3        | 2   | #1, #2, #5, #7, #8         |
| ThemeSelection    | 3           | 1        | 2   | #4                          |
| ParameterControl  | 5           | 1        | 4   | #3, #6, #7                  |
| FractalDive       | 7           | 5        | 2   | #9, #10, #11, #12          |
| **AudioReactivity** | **22**    | **0**    | **22** | **#15, #16, #17, #18, #19, #20, #21, #22, #23, #24** |
| **AudioScene**    | **22**      | **0**    | **22** | **#25, #26, #27, #28, #29, #30, #31, #32, #33, #34, #35, #36** |
| PerformanceProbe  | 3           | 2        | 1   | #13, #14                    |
| **Total**         | **67**      | **12**   | **55** | **all 36 acceptance criteria** |

Note: existing spec file has 17 tests; counting differs because some existing tests cover multiple acceptance criteria (e.g. `dive starts and zoom increases` covers AC #9 and #10).

---

## Drift Warnings

1. **No `tests/fixtures/` directory yet** — must be created with at least `test-audio.mp3` before T-AR-1 / T-AR-2 can run end-to-end. A 5-second royalty-free clip with audible bass and treble is sufficient.
2. **Test hooks not yet implemented** — `_testGetAudioState`, `_testInjectBandEnergies`, `_testTriggerBeat`, `_testGetRenderScheduleRate` must be added to the implementation gated by `?test=1` query param. Without them, ~15 of the 22 AudioReactivity tests cannot run deterministically.
3. **AudioScene test hooks not yet implemented** — `_testGetAmbientState`, `_testInjectAmbientSignals`, `_testGetParticleCount`, `_testForceDiveState`, `_testGetSessionSummary` must be added to the implementation gated by `?test=1`. Without them, ~20 of the 22 AudioScene tests cannot run deterministically.
4. **Pre-existing fractal concepts still unsynced** in `docs/registry.md` — flagged in the prior sync pass; the test traceability still works via concept names, but the registry index doesn't yet point at them. AudioScene concepts should be added in the same sync pass.

---

## Traceability

Every Playwright test should declare its source via comment header:

```js
/**
 * @source SPEC.md#audioreactivity-inline
 * @story US-8
 * @ac SPEC AC #17
 * @testId T-AR-3
 */
test("injected SubBass energy modulates diveSpeed only", async ({ page }) => { ... });
```

This enables:
- doc change → grep for `@source` and `@ac` to find affected tests
- test failure → follow `@story` to find the BDD scenario
- coverage audit → assert every test row in this file maps to at least one `@testId` in the spec files
