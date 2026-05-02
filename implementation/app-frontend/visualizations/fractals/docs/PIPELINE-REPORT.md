# Pipeline Report — AudioScene v1

> Run: 2026-04-28 · Feature: AudioScene (sibling capability to AudioReactivity)
> Source discovery: `docs/screen-as-instrument.md`
> Pipeline orchestrator: `domainspec-pipeline` (adapted to this project's flat inline-capability layout)

## Verdict

**PASS** — with one pre-existing FLAG unrelated to this feature.

## Scope delivered (v1 = items 1–6 of the discovery doc's cost ladder)

1. ✅ HUDGlow on treble band — CSS `filter: drop-shadow` + `text-shadow` on `#hud-tr` readouts.
2. ✅ Vignette pulse on bass band — `#vignette` radial-gradient overlay.
3. ✅ Camera shake on `BeatDetected` — translate jitter on `#wrap` with exp-decay envelope (disabled on mobile).
4. ✅ BackgroundHaze on RMSEnergy (NEW signal) — `#bg-haze` palette-aware gradient layer behind canvas.
5. ✅ OnsetDetector (NEW signal) — spectral-flux threshold detector, 1.5× rolling 1 s mean, 80 ms min interval.
6. ✅ EdgeParticle layer — `#ambient-canvas` with pooled particles, palette-themed visuals (soot / lantern / spore / ash / wind streak), capped 64 desktop / 24 mobile.

Plus:
- ✅ Master `AmbientIntensitySlider` (0–100%, default 60%, persisted under `fractal.audio.ambient`).
- ✅ Per-palette ambient table (data-driven, single source of truth).
- ✅ Freeze-during-dive via CSS `body.diving-ui` + RAF gate.
- ✅ Fade-to-idle within one frame on audio teardown (`fadeAmbientToIdle`).
- ✅ Mobile downgrade: shake = 0, particle cap = 24 on viewports < 768 px.
- ✅ `audio_scene_summary` telemetry — aggregate-only (`rms_avg`, `onset_count`, `beat_count`, `session_duration_ms`), no per-frame leakage.
- ✅ Five new test hooks gated by `?test=1` for deterministic Playwright tests.

## Artifacts

| Stage              | Artifact                                                     | Status   |
| ------------------ | ------------------------------------------------------------ | -------- |
| Spec               | `docs/SPEC.md` (+1 capability, +12 concepts, +12 ACs)         | ✅ Done   |
| Stories            | `docs/STORIES.md` (+10 user stories US-17…US-26, matrix updated) | ✅ Done   |
| Test spec          | `docs/TEST-SPEC.md` (+22 test rows T-AS-1…T-AS-22, +5 hooks)  | ✅ Done   |
| Implementation     | `fractal-ghibli.html` (+~700 lines: CSS, DOM, JS, test hooks) | ✅ Done   |
| Tests              | `tests/audio-scene.spec.js` (22 Playwright tests)             | ✅ Done   |
| Observability      | Inline in SPEC.md (`audio_scene_summary` aggregate)           | ✅ Done   |

## Test results

| Suite                          | Total | Passing | Failing | Notes                                            |
| ------------------------------ | ----- | ------- | ------- | ------------------------------------------------ |
| `audio-scene.spec.js` (NEW)    | 22    | **22**  | 0       | 100% on second run after init-script clean-up.   |
| `fractal-ghibli.spec.js`       | 18    | 17      | 1       | One **pre-existing FLAG** unrelated to AudioScene. |
| `audio-reactivity.spec.js`     | n/a   | n/a     | n/a     | Pre-existing scaffold skip — runner config issue, predates AudioScene. |

### Pre-existing FLAG (out of scope)

**`mouse scroll while diving stops the dive`** — fails because the wheel handler at `fractal-ghibli.html:1733-1745` does not call `stopDive()` when the user scrolls during a dive. SPEC AC #12 and STORIES US-6 say it should. This inconsistency exists in the implementation as it stood *before* AudioScene work; the AudioScene edits did not touch the wheel handler. Fixing it would be a one-line change inside the `wheel` listener (`if (diving) { stopDive(false); return; }`), but it modifies pre-existing AudioReactivity-era behavior — out of scope for this pipeline run. Recommend: open a follow-up to either (a) fix the implementation to match the spec or (b) revise the spec to match current behavior.

### `audio-reactivity.spec.js` skip

The spec file fails to load with `Error: Playwright Test did not expect test.describe() to be called here. ... two different versions of @playwright/test`. This is a node_modules version skew issue inside `tests/node_modules/`, not a code issue. Predates AudioScene. Recommend `npm dedupe` or pinning a single `@playwright/test` version.

## Design principles compliance

| Principle                                                                                         | Compliance                                                                                              |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| One focal element only — fractal stays the centerpiece                                            | ✅ Ambient canvas opacity capped at 0.4 in CSS; vignette/haze/HUD glow each capped below 0.6.            |
| Each signal drives at most one element type                                                        | ✅ Bass→Vignette only; Treble→HUDGlow only; RMS→Haze only; Beat→Shake only; Onset→Particles only.        |
| User-controllable opacity + master ambient slider with localStorage persistence                    | ✅ `AmbientIntensitySlider` + `fractal.audio.ambient` key; per-element disclosure deferred to v2.        |
| Palette-aware (no new colors)                                                                     | ✅ All ambient layers tint via `paletteAmbientColor()` reading the active `PAL3` ramp.                  |
| Quiet by default                                                                                  | ✅ Default `A = 0.6`; effective max ambient opacity ≤ 0.4.                                              |
| No motion competes with the dive                                                                  | ✅ CSS `body.diving-ui` fades all ambient layers in 0.2 s with `!important`; RAF stays alive but skips work.|

## Acceptance criteria coverage

All 12 new acceptance criteria (AC #25–#36) covered by 22 deterministic Playwright tests. No coverage gaps.

## Pre-existing concerns surfaced (not blocking)

1. **Wheel-during-dive does not stop dive** (above).
2. **`audio-reactivity.spec.js` runner setup broken** (above).
3. **`docs/registry.md` doesn't yet list fractal-ghibli concepts** — flagged in TEST-SPEC.md drift warnings, predates AudioScene. AudioScene's new concepts should be folded in during the next registry sync pass.

## Next steps (recommended)

1. Run `domainspec-sync-registry` to fold AudioScene's 17 new concept IDs into `docs/registry.md` and `docs/glossary.md`.
2. Open a one-line PR to fix the wheel-stops-dive regression.
3. Resolve the `@playwright/test` version skew so `audio-reactivity.spec.js` can run.
4. Visual sanity check on each Ghibli theme to confirm particle visuals feel distinct.

## Skipped pipeline stages (not applicable to this project)

- **Step 5b — Infrastructure Binding Gate**: no DB, no ORM, single-file static HTML.
- **Step 6 — UI Pipeline (`domainspec-ui-pipeline`)**: the HTML *is* the UI; no React/Vue/Svelte stack to scaffold.
- **Step 7b — `domainspec-instrument-otel`**: no OTel SDK in a static HTML file. Telemetry is in-page `emitTelemetry()` calls.
- **Step 7c — `domainspec-otel-verify`**: same reason as 7b.
- **Step 7d — `domainspec-infra-deploy`**: no `INFRA-ARCHITECTURE.md`, no infrastructure to sync.
