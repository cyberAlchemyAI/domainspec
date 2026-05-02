# User Stories: Fractal Ghibli Visualization

> Navigate by capability: [FractalRendering](#fractalrendering) · [ThemeSelection](#themeselection) · [ParameterControl](#parametercontrol) · [FractalDive](#fractaldive) · [AudioReactivity](#audioreactivity) · [AudioScene](#audioscene) · [PerformanceProbe](#performanceprobe)
>
> All aspect links resolve to inline sections of [SPEC.md](SPEC.md) — this feature keeps capability detail inline rather than splitting into separate domain.md / operations.md / states.md files.

---

## FractalRendering

### US-1: Initial fractal renders on load

As an **explorer**, I want **the page to show a Julia fractal as soon as it opens**, so that **I can start exploring without configuring anything**.

**Given** the HTML file is opened in any modern browser
**When** the page finishes loading
**Then** a visible Julia Set fractal appears on the canvas with the default Totoro palette

**Acceptance checks**

- [ ] No network requests are made (file is fully self-contained) — covers SPEC AC #8
- [ ] No console errors on initial load — covers SPEC AC #1
- [ ] Canvas paints a recognizable fractal within ~2 seconds — covers SPEC AC #2
- [ ] UI controls remain interactive while the worker computes — covers SPEC AC #5

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.JuliaSet`, `fractal-ghibli-visualization.Canvas`, `fractal-ghibli-visualization.RenderFrame`
- Interfaces/Flows: `WorkerMessage` postmessage contract

**Capability links**

- [FractalRendering](SPEC.md#fractalrendering-inline)

---

## ThemeSelection

### US-2: Explorer switches palette to change visual mood

As an **explorer**, I want **to switch between Ghibli-inspired color themes**, so that **the fractal takes on a different emotional tone**.

**Given** the page is loaded with the default Totoro palette
**When** the explorer clicks any of the five theme buttons (Totoro, Chihiro, Mononoke, Howl, Nausicaä)
**Then** the canvas re-renders with that theme's distinct palette without page reload

**Acceptance checks**

- [ ] Each theme produces a visually distinct palette — covers SPEC AC #4
- [ ] Active theme button is highlighted in the controls bar
- [ ] Theme switch triggers exactly one render

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.ColorTheme`, `fractal-ghibli-visualization.ApplyTheme`

**Capability links**

- [ThemeSelection](SPEC.md#themeselection-inline)

---

## ParameterControl

### US-3: Explorer manipulates sliders to shape the fractal

As an **explorer**, I want **to drag the Espírito, Profundidade, and Essência sliders**, so that **I can see how the fractal's geometry responds to its mathematical parameters**.

**Given** the page is loaded
**When** the explorer drags any of the three parameter sliders
**Then** the fractal re-renders to reflect the new parameter value, and the slider's label shows the live value

**Acceptance checks**

- [ ] Each slider updates the fractal without page reload — covers SPEC AC #3
- [ ] All sliders display descriptive tooltips on hover — covers SPEC AC #6
- [ ] Parameter names, ranges, and current values are always visible — covers SPEC AC #7
- [ ] FractalParameter constraints are enforced (Espírito ∈ [0,360°], Profundidade ∈ [50,400], Essência ∈ [0.0,1.5])

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.FractalParameter`, `fractal-ghibli-visualization.UpdateParameter`
- Interfaces/Flows: `ParameterSlider`

**Capability links**

- [ParameterControl](SPEC.md#parametercontrol-inline)

---

## FractalDive

### US-4: Explorer dives smoothly into the fractal

As an **explorer**, I want **to start a continuous infinite zoom toward the fractal center**, so that **I can experience the self-similar depth of the Julia set**.

**Given** the page is loaded
**When** the explorer presses the "▼ Mergulhar" button or the Space bar
**Then** the canvas begins zooming smoothly toward the center at 60 fps and the button changes to "■ Parar"

**Acceptance checks**

- [ ] Dive starts via button or Space bar — covers SPEC AC #9
- [ ] Dive runs at 60 fps via RAF + CSS scale interpolation — covers SPEC AC #10
- [ ] Worker renders at step=4 during dive for throughput

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.DiveAnimation`, `fractal-ghibli-visualization.StartDive`

**Capability links**

- [FractalDive](SPEC.md#fractaldive-inline)

### US-5: Dive survives the float64 precision wall

As an **explorer**, I want **the dive to keep going past extreme zoom levels**, so that **deep self-similar regions become visible without the renderer breaking**.

**Given** an active dive that has reached `view.zoom ≥ PERT_ZOOM` (~10¹⁰)
**When** zoom continues toward the F64 precision wall
**Then** the renderer transitions to the perturbation kernel, the `#prec` advisory appears, and the imagery stays crisp through ~10³⁰× before asymptoting smoothly

**Acceptance checks**

- [ ] Perturbation kernel activates at the configured threshold — covers SPEC AC #11
- [ ] No blocky pixels or hard stops at the F64 wall
- [ ] `diveZoomFactor` dampens toward 1 as 1/zoom approaches the DD wall

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.DiveAnimation`, `fractal-ghibli-visualization.JuliaSet`

**Capability links**

- [FractalDive](SPEC.md#fractaldive-inline)

### US-6: Any user input cleanly stops the dive

As an **explorer**, I want **to interrupt a dive at any time with a natural gesture**, so that **I never feel trapped in the animation**.

**Given** an active dive
**When** the explorer drags the canvas, scrolls, touches, or presses the dive button again
**Then** the dive cancels, a full-quality re-render fires at the current zoom, and the button returns to "▼ Mergulhar"

**Acceptance checks**

- [ ] Drag, scroll, touch, or button-press all stop the dive — covers SPEC AC #12
- [ ] Stop fires exactly one full-quality render

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.StopDive`, `fractal-ghibli-visualization.DiveAnimation`

**Capability links**

- [FractalDive](SPEC.md#fractaldive-inline)

---

## AudioReactivity

### US-7: Explorer loads a song and the fractal moves with it

As an **explorer**, I want **to load any audio file and have the fractal respond to its spectrum**, so that **the visualization becomes a music-driven performance**.

**Given** the page is loaded with no audio source
**When** the explorer picks an audio file via the AudioFilePicker and presses play
**Then** within ~200 ms the four fractal parameters (`diveSpeed`, `radius`, `theta`, `iterBase`) start modulating in response to the four frequency bands of the song

**Acceptance checks**

- [ ] Common audio formats load (mp3, wav, ogg, m4a) — covers SPEC AC #16
- [ ] Audio plays through the page output via `<audio>` element
- [ ] Modulation begins within ~200 ms of playback start — covers SPEC AC #16
- [ ] Existing slider drag, dive, theme switch, reset all still work while audio plays — covers SPEC AC #24

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.AudioSource`, `fractal-ghibli-visualization.LoadAudioSource`, `fractal-ghibli-visualization.StartAudioModulation`, `fractal-ghibli-visualization.AudioModulation`
- Interfaces/Flows: `AudioFilePicker`

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

### US-8: Each band drives only its assigned parameter

As an **explorer**, I want **to verify that each frequency band controls exactly one fractal parameter**, so that **I can predict how a track will look before I play it**.

**Given** an audio file is loaded and playing
**When** the explorer raises one band's sensitivity to 100% and zeros the other three
**Then** only the parameter assigned to that band moves: SubBass→`diveSpeed`, Bass→`radius`, Mid→`theta`, Treble→`iterBase`

**Acceptance checks**

- [ ] Each parameter visibly reacts when its band sensitivity is above zero — covers SPEC AC #17
- [ ] Each parameter stops reacting when its band sensitivity is at zero — covers SPEC AC #17
- [ ] Modulation rule from SPEC.md applies exactly: amplitude scales with `s_b · e_b`

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.FrequencyBand`, `fractal-ghibli-visualization.BandEnergy`, `fractal-ghibli-visualization.BandSensitivity`, `fractal-ghibli-visualization.SampleBandEnergies`, `fractal-ghibli-visualization.ModulateParameters`
- Interfaces/Flows: `SensitivityPanel`

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

### US-9: Beat spikes cycle the color theme

As an **explorer**, I want **the palette to change on the beat**, so that **the visual energy matches the musical energy**.

**Given** an audio file is loaded and playing with detectable bass content
**When** current SubBass+Bass aggregate energy exceeds 1.4× the rolling 2-second average and at least 250 ms have passed since the last beat
**Then** `ColorTheme` advances to the next palette in fixed rotation (Totoro → SpiritedAway → Mononoke → Howl → Nausicaä → Totoro) and the canvas re-renders with the new ramp

**Acceptance checks**

- [ ] Beat fires at the documented threshold — see SPEC AC #19
- [ ] No more than one theme cycle per 250 ms regardless of input intensity — covers SPEC AC #19
- [ ] Rotation order matches SPEC

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.BeatDetector`, `fractal-ghibli-visualization.DetectBeat`, `fractal-ghibli-visualization.BeatDetected`, `fractal-ghibli-visualization.ColorTheme`

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

### US-10: Modulation never freezes the fractal during silence

As an **explorer**, I want **the fractal to keep moving even when the song goes quiet**, so that **the visual never collapses to a static image mid-performance**.

**Given** an audio file is loaded
**When** the audio is paused, between tracks, or during a near-silent passage
**Then** the fractal continues its baseline `advanceParamTravel` drift, just without audio modulation

**Acceptance checks**

- [ ] Drift never freezes during silence — covers SPEC AC #18
- [ ] Audio modulates the drift; never replaces it (per Modulation Model decision)

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.AudioModulation`, `fractal-ghibli-visualization.AudioReactivityState`

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

### US-11: Band sensitivity preferences survive reloads

As an **explorer**, I want **the four sensitivity values to persist across page reloads**, so that **I don't have to retune every session**.

**Given** the explorer has set custom values for the four `BandSensitivity` sliders
**When** the page is reloaded
**Then** the four sliders restore to those custom values from `localStorage` under `fractal.audio.sensitivity`

**Acceptance checks**

- [ ] BandSensitivity values persist via `localStorage` — covers SPEC AC #20
- [ ] The loaded audio file does NOT persist (object URLs are recreated each session) — covers SPEC AC #20

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.BandSensitivity`, `fractal-ghibli-visualization.SensitivityPanel`

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

### US-12: AudioReactivity is fully opt-in (regression guard)

As an **explorer who never loads a song**, I want **the page to behave exactly as it did before AudioReactivity existed**, so that **the new capability never imposes overhead or behavior changes on the default experience**.

**Given** the page is loaded and no audio source has been picked
**When** the explorer uses sliders, themes, dive, reset, and "Variar função" exactly as before
**Then** every existing behavior matches the pre-AudioReactivity baseline — no extra renders, no extra console output, no extra DOM beyond the file picker UI

**Acceptance checks**

- [ ] No `AudioContext` is created until a user gesture loads a file — covers SPEC AC #15
- [ ] All pre-existing acceptance criteria (#1–14) still hold — covers SPEC AC #15
- [ ] No measurable performance regression at any zoom level when audio is not loaded

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.AudioReactivityState` (idle state)

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

### US-13: Re-renders are throttled under continuous audio (edge)

As an **explorer at deep zoom**, I want **audio-driven updates to not flood the worker queue**, so that **the renderer keeps up with the music instead of falling progressively further behind**.

**Given** an audio file is playing and `view.zoom` is at a depth where a full render takes 100–500 ms
**When** the audio analyser ticks at ~60 Hz for an extended period
**Then** `scheduleRender()` is called at most every 100 ms (10 Hz cap), and the render queue does not grow unbounded

**Acceptance checks**

- [ ] Render schedule rate ≤ 10 Hz under continuous audio — covers SPEC AC #21
- [ ] No render backlog at any zoom level during 5+ minute playback — covers SPEC AC #21
- [ ] Slider value updates at audio tick rate (~60 Hz); only rendering is throttled

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.ModulateParameters`, `fractal-ghibli-visualization.AudioModulation`

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

### US-14: Stopping audio releases context cleanly

As an **explorer**, I want **stopping audio playback to fully release Web Audio resources**, so that **the page doesn't hold an open AudioContext indefinitely**.

**Given** an audio file is loaded and playing
**When** the explorer stops the audio (closes the picker, ends playback, page becomes hidden)
**Then** the `AudioContext` is closed, sliders revert to user-controlled values within one frame, and the fractal returns to its pre-audio behavior

**Acceptance checks**

- [ ] AudioContext is released on stop — covers SPEC AC #22
- [ ] Sliders return to user-controlled values within one frame — covers SPEC AC #22
- [ ] Pagehide / visibilitychange triggers the same teardown path

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.StopAudioModulation`, `fractal-ghibli-visualization.AudioReactivityState`

**Capability links**

- [AudioReactivity](SPEC.md#audioreactivity-inline)

---

## AudioScene

### US-17: Explorer feels the song through the whole screen, not just the fractal

As an **explorer**, I want **vignette pulse, edge particles, HUD glow, haze, and micro shake to react to the song around the fractal**, so that **I feel more of the music without the fractal itself getting busier**.

**Given** an audio file is loaded and playing, master `AmbientIntensity` is at its 0.6 default
**When** the song progresses
**Then** vignette opacity tracks bass, HUD readouts glow on treble, the canvas micro-shakes on each `BeatDetected`, background haze opacity tracks RMS, and edge particles spawn on each `OnsetDetected` per the active palette's particle visual

**Acceptance checks**

- [ ] All five ambient elements visibly respond to their assigned signals — covers SPEC AC #26
- [ ] Ambient elements never overlap the central fractal canvas at > 40% effective opacity — covers SPEC design principle #1
- [ ] Switching theme immediately switches the particle visual (soot/lantern/spore/ash/wind streak) — covers SPEC AC #30

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.AudioSceneState`, `fractal-ghibli-visualization.AmbientCanvas`, `fractal-ghibli-visualization.Vignette`, `fractal-ghibli-visualization.HUDGlow`, `fractal-ghibli-visualization.BackgroundHaze`, `fractal-ghibli-visualization.CameraShake`, `fractal-ghibli-visualization.EdgeParticle`, `fractal-ghibli-visualization.RenderAmbientFrame`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-18: Master ambient knob scales the whole scene uniformly

As an **explorer**, I want **a single "ambient intensity" slider that scales every peripheral element together**, so that **I can dial the room from "fractal alone" to "full scene" without juggling five sliders**.

**Given** an audio file is loaded and playing
**When** the explorer drags the `AmbientIntensitySlider` from 0% to 100%
**Then** vignette, haze, HUD glow, shake amplitude, and particle spawn rate all scale linearly together; at 0% every ambient element collapses to its idle baseline

**Acceptance checks**

- [ ] All ambient elements collapse to idle baseline within one frame at A=0 — covers SPEC AC #27
- [ ] Modulation rule applies linearly: each element's effect is proportional to A — covers SPEC modulation rule
- [ ] Slider value persists across reloads via `localStorage` under `fractal.audio.ambient` — covers SPEC AC #28

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.AmbientIntensity`, `fractal-ghibli-visualization.AmbientIntensitySlider`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-19: Onsets and beats drive different elements

As an **explorer playing music with hi-hats and a kick drum**, I want **onsets (transient attacks) to spawn particles and beats (sustained low-end punch) to shake the canvas**, so that **the screen reads both the rhythm and the texture of the mix**.

**Given** an audio file is loaded and playing with both transient (hat/snare) and sustained (kick) content
**When** the analyser ticks at ~60 Hz
**Then** `OnsetDetected` fires on transients (≥ 80 ms apart) spawning edge particles, and `BeatDetected` fires on bass punches (≥ 250 ms apart) triggering the camera-shake impulse — independently

**Acceptance checks**

- [ ] OnsetDetected and BeatDetected can fire independently — covers SPEC AC #33
- [ ] Onset min-interval is 80 ms; beat min-interval is 250 ms — covers SPEC AC #33
- [ ] Particles spawn only on onsets; shake fires only on beats (no double-binding)

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.OnsetDetector`, `fractal-ghibli-visualization.OnsetDetected`, `fractal-ghibli-visualization.SampleAmbientSignals`, `fractal-ghibli-visualization.DetectOnset`, `fractal-ghibli-visualization.SpawnEdgeParticles`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-20: Each Ghibli theme has its own ambient signature

As an **explorer cycling palettes**, I want **each theme to bring a distinct ambient mood — soot sprites, lantern haze, forest spores, falling ash, wind streaks**, so that **the page's character changes with the palette beyond just colors**.

**Given** an audio file is playing with `AmbientIntensity > 0`
**When** the explorer picks a new theme (or `BeatDetected` cycles to one)
**Then** the particle visual, direction, and spawn driver switch immediately to the row in the per-palette table for that theme — without any code-path branch (single data table is the source of truth)

**Acceptance checks**

- [ ] Five distinct particle visuals exist, one per theme — covers SPEC AC #30
- [ ] Particle visual changes within one frame of theme switch
- [ ] Particle behavior is driven from the palette table, not theme-specific code

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.EdgeParticle`, `fractal-ghibli-visualization.ColorTheme`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-21: Ambient scene freezes during a fractal dive

As an **explorer who just hit "▼ Mergulhar"**, I want **the ambient peripheral motion to step out of the way during the dive**, so that **falling through the fractal stays the focal experience without competing flicker**.

**Given** an audio file is playing with active ambient elements
**When** the explorer starts a dive (`DiveAnimation.diving === true`)
**Then** within ~200 ms vignette/haze/HUD glow fade out (or hold their last frame), particle spawning halts, and camera shake drops to zero — and they all resume when the dive ends

**Acceptance checks**

- [ ] Ambient elements freeze or fade within ~200 ms of dive start — covers SPEC AC #31
- [ ] Ambient elements resume cleanly when dive ends
- [ ] No ambient frame work runs during the dive (RAF skipped or clamped)

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.AudioSceneState` (frozen-during-dive), `fractal-ghibli-visualization.DiveAnimation`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-22: AudioScene is fully opt-in (regression guard)

As an **explorer who never loads a song**, I want **AudioScene to add no overhead and no DOM beyond an inert master slider**, so that **the default first-time experience is unchanged from before AudioScene existed**.

**Given** the page is loaded and no audio source has been picked
**When** the explorer uses sliders, themes, dive, reset, "Variar função" exactly as before
**Then** vignette and haze opacity are 0, no particles exist on the ambient canvas, the canvas wrapper has no shake transform, and no `RenderAmbientFrame` RAF loop is running

**Acceptance checks**

- [ ] No ambient element renders without an active audio source — covers SPEC AC #25
- [ ] All pre-existing acceptance criteria (#1–24) still hold
- [ ] No second AudioContext is created — single context shared with AudioReactivity — covers SPEC AC #29

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.AudioSceneState` (idle)

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-23: Stopping audio fades the scene to idle within one frame

As an **explorer who just closed the audio picker**, I want **the ambient scene to disappear immediately**, so that **stopping the song actually feels like stopping**.

**Given** an audio file is loaded and playing with active ambient elements
**When** the explorer stops audio (closes picker, ends playback, page becomes hidden via `visibilitychange`)
**Then** within one animation frame, all ambient elements fade to idle baseline (opacity 0, no shake, no further particle spawns), and the AudioScene state returns to idle alongside AudioReactivity

**Acceptance checks**

- [ ] Ambient elements fade to idle within one frame on audio stop — covers SPEC AC #32
- [ ] Pagehide / visibilitychange triggers same fade-to-idle path
- [ ] AudioScene tears down together with AudioReactivity (single shared context)

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.FadeAmbientToIdle`, `fractal-ghibli-visualization.AudioSceneState`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-24: Particle layer stays bounded under continuous onsets (edge)

As an **explorer playing a track with dense hi-hat content**, I want **the particle layer to stay bounded**, so that **the page never accumulates an unbounded particle pool that drags down the framerate**.

**Given** an audio file is playing onsets at > 30 Hz for an extended period
**When** the spawn rule fires `round(8 · A · O.strength)` particles per onset
**Then** the active particle count stays at or below 64 (desktop) / 24 (mobile); excess spawns are dropped or replace the oldest particle

**Acceptance checks**

- [ ] Active particle count never exceeds the cap — covers SPEC AC #34
- [ ] Particle pool size is fixed; allocation is pooled (no GC spikes during sustained playback)
- [ ] Particle frame work stays within the ambient frame budget (≤ 30 Hz)

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.EdgeParticle`, `fractal-ghibli-visualization.SpawnEdgeParticles`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-25: Mobile gets a quieter, lower-cost scene

As an **explorer on a phone**, I want **AudioScene to back off on weak GPUs**, so that **the page stays smooth on mobile rather than juddering on shake and particle math**.

**Given** the page loads on a viewport narrower than 768 px
**When** AudioScene activates with audio playing
**Then** camera shake amplitude is held at 0 and particle cap drops from 64 to 24

**Acceptance checks**

- [ ] `CameraShake.amplitude_px = 0` on viewports < 768 px — covers SPEC AC #35
- [ ] Particle cap = 24 on viewports < 768 px — covers SPEC AC #34
- [ ] Same DOM/code paths run on mobile and desktop — caps are data-driven, not branched

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.CameraShake`, `fractal-ghibli-visualization.EdgeParticle`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

### US-26: Telemetry stays aggregate and privacy-preserving

As an **operator measuring AudioScene usage**, I want **per-session aggregate counts, not per-frame samples**, so that **observability does not leak the user's audio**.

**Given** AudioScene runs through a complete session (audio loaded, played, stopped)
**When** the page emits the `audio_session_summary` aggregate at session end
**Then** the payload contains exactly: `band_avg`, `rms_avg`, `onset_count`, `beat_count`, `session_duration_ms` — no per-frame samples, no waveform, no song identification

**Acceptance checks**

- [ ] Telemetry contains only the documented aggregate fields — covers SPEC AC #36
- [ ] No per-frame audio data leaves the page
- [ ] Telemetry is opt-in / off by default (consistent with AudioReactivity AC #23)

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.SampleAmbientSignals`, `fractal-ghibli-visualization.RMSEnergy`, `fractal-ghibli-visualization.OnsetDetected`

**Capability links**

- [AudioScene](SPEC.md#audioscene-inline)

---

## PerformanceProbe

### US-15: Operator inspects render timings via opt-in overlay

As an **operator** diagnosing performance, I want **a hidden diagnostics overlay I can enable via query param or keypress**, so that **I can measure render and dive timing without altering the default visual experience**.

**Given** the page is loaded
**When** the operator visits with `?perf=1` in the URL or presses the `P` key
**Then** the overlay appears showing worker count, latest preview/full render times, main-thread commit time, and frame drops over the last 5 seconds

**Acceptance checks**

- [ ] Overlay activates via `?perf=1` or `P` key — covers SPEC AC #13
- [ ] Overlay shows the documented metrics (worker count, render times, RAF drops)
- [ ] When AudioReactivity is active, overlay should still measure render throttling correctly

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.PerfOverlay`, `fractal-ghibli-visualization.MeasureRender`, `fractal-ghibli-visualization.MeasureDiveRAF`

**Capability links**

- [PerformanceProbe](SPEC.md#performanceprobe-inline)

### US-16: Performance probe never alters default output (regression guard)

As an **explorer who doesn't enable diagnostics**, I want **the perf overlay to stay invisible and inert**, so that **PerformanceProbe is purely opt-in instrumentation**.

**Given** the page is loaded without `?perf=1` and without pressing `P`
**When** the explorer interacts with the fractal normally
**Then** the perf overlay is not in the DOM rendering path, no measurement code runs that could affect canvas pixels, and the default interaction path is unchanged

**Acceptance checks**

- [ ] Default load keeps overlay hidden — covers SPEC AC #13
- [ ] Performance diagnostics must not change canvas pixels or default interactions — covers SPEC AC #14

**Domain coverage**

- Concepts: `fractal-ghibli-visualization.PerfOverlay`

**Capability links**

- [PerformanceProbe](SPEC.md#performanceprobe-inline)

---

## Story Coverage Matrix

| Capability        | Story IDs        | Covered Concepts                                                                                                                                          | Journey Slices Covered                            |
| ----------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| FractalRendering  | US-1             | JuliaSet, Canvas, RenderFrame                                                                                                                             | Public                                            |
| ThemeSelection    | US-2             | ColorTheme, ApplyTheme                                                                                                                                    | Public                                            |
| ParameterControl  | US-3             | FractalParameter, UpdateParameter, ParameterSlider                                                                                                        | Public                                            |
| FractalDive       | US-4, US-5, US-6 | DiveAnimation, StartDive, StopDive                                                                                                                        | Public, Edge (precision wall)                     |
| AudioReactivity   | US-7 – US-14     | AudioSource, FrequencyBand, BandEnergy, BandSensitivity, AudioModulation, BeatDetector, BeatDetected, AudioReactivityState, AudioFilePicker, SensitivityPanel, LoadAudioSource, StartAudioModulation, StopAudioModulation, SampleBandEnergies, ModulateParameters, DetectBeat | Public, Edge (silence, throttling), Regression    |
| AudioScene        | US-17 – US-26    | AudioSceneState, AmbientCanvas, AmbientIntensity, AmbientIntensitySlider, Vignette, HUDGlow, BackgroundHaze, CameraShake, EdgeParticle, RMSEnergy, OnsetDetector, OnsetDetected, SampleAmbientSignals, DetectOnset, RenderAmbientFrame, SpawnEdgeParticles, FadeAmbientToIdle | Public, Edge (dive freeze, particle cap, mobile), Regression |
| PerformanceProbe  | US-15, US-16     | PerfOverlay, MeasureRender, MeasureDiveRAF                                                                                                                | Admin/Operations, Regression                      |

### Mandatory journey slice coverage

| Slice                         | Stories                            | Status                                                                                |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| Public                        | US-1, US-2, US-3, US-4, US-6, US-7, US-8, US-9, US-11, US-14, US-17, US-18, US-19, US-20, US-23 | ✅ Covered                                                                             |
| Admin / operations            | US-15, US-26                       | ✅ Covered                                                                             |
| Cross-feature integration     | US-21 (AudioScene ↔ FractalDive freeze), US-29-style (AudioScene shares analyser with AudioReactivity, see SPEC AC #29) | ✅ Covered |
| Error / edge case             | US-5, US-10, US-12, US-13, US-16, US-21, US-22, US-24, US-25 | ✅ Covered (precision wall, silence, opt-in regressions, throttling, dive freeze, particle cap, mobile downgrade) |

### Unmapped concepts

All registered concepts in `internal_tools/visualizations/fractals/docs/SPEC.md` are referenced by at least one story above. No drift detected at story level.
